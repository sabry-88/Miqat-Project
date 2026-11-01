/**
 * MIQAT JOURNEYHUB — PARTNER COMPANY PORTAL FRONTEND ENGINE
 * 
 * Manages:
 * 1. Role-based Authentication Guard (Company partner verification)
 * 2. Bilingual Localization (AR RTL / EN LTR) & Theme Switching (Light / Dark)
 * 3. 7-Section Navigation & Future-Scope Modals
 * 4. Reactive Time-Period Filtering (All Time, This Month, Last 30 Days, Current Season)
 * 5. Dynamic High-Performance SVG Data Visualizations (Activity, Donut, Categories, Programs)
 * 6. Mathematical Consistency Enforcement: Remaining = Total - Paid
 */

(function () {
  'use strict';

  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';

  const API_BASE_URL = (function () {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.port === '4173') return '';
      const host = window.location.hostname || '127.0.0.1';
      return `http://${host}:4173`;
    }
    return 'http://127.0.0.1:4173';
  })();

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let currentPeriod = 'all';
  let currentSpecificDate = null;
  let currentTableStatusFilter = 'All';
  let currentMultiCriteriaFilter = null;
  let currentDict = null;
  let currentUser = null;
  let currentMetrics = null;

  const html = document.documentElement;

  // --- Authenticated Fetch Helper ---
  async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('miqat_token');

    const headers = Object.assign({}, options.headers || {});
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
  }

  // --- Translation Loader ---
  async function loadTranslations(lang) {
    try {
      const res = await fetch(`./locales/${lang}.json`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(`Could not load ./locales/${lang}.json:`, e);
    }
    return {};
  }

  function getTranslation(keyPath, dict) {
    if (!keyPath || !dict) return keyPath;
    const parts = keyPath.split('.');
    let val = dict;
    for (const part of parts) {
      if (val && typeof val === 'object' && part in val) {
        val = val[part];
      } else {
        return keyPath;
      }
    }
    return typeof val === 'string' ? val : keyPath;
  }

  async function applyTranslations(lang) {
    const dict = await loadTranslations(lang);
    currentDict = dict;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const titleKey = document.body.dataset.pageTitleKey;
    if (titleKey) {
      document.title = getTranslation(titleKey, dict);
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslation(key, dict);
      if (val && val !== key) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach((mapping) => {
        const [attr, key] = mapping.split(':').map((s) => s.trim());
        if (attr && key) {
          const val = getTranslation(key, dict);
          if (val && val !== key) el.setAttribute(attr, val);
        }
      });
    });

    updateDateDisplay();
    if (currentUser) updateCompanyIdentityUI(currentUser);
    renderCurrentPage();
  }

  // --- Theme Toggle ---
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
    currentTheme = theme;
    updateThemeToggleUI();
    if (currentMetrics) {
      renderActivityChart(currentMetrics.monthlyActivity);
      renderStatusDonut(currentMetrics.statusDistribution, currentMetrics.kpi.totalBookings);
    }
  }

  function updateThemeToggleUI() {
    const isDark = currentTheme === 'dark';
    document.querySelectorAll('#themeToggleBtn, #mobileThemeToggleBtn').forEach((btn) => {
      const moon = btn.querySelector('.icon-moon');
      const sun = btn.querySelector('.icon-sun');
      if (moon && sun) {
        moon.style.display = isDark ? 'none' : 'block';
        sun.style.display = isDark ? 'block' : 'none';
      }
      btn.setAttribute('aria-label', isDark ? (currentLang === 'ar' ? 'تفعيل الوضع الفاتح' : 'Enable Light Mode') : (currentLang === 'ar' ? 'تفعيل الوضع الداكن' : 'Enable Dark Mode'));
      btn.setAttribute('title', isDark ? (currentLang === 'ar' ? 'تفعيل الوضع الفاتح' : 'Enable Light Mode') : (currentLang === 'ar' ? 'تفعيل الوضع الداكن' : 'Enable Dark Mode'));
    });
  }

  // --- Number & Currency Formatting ---
  function formatNumber(num) {
    if (typeof num !== 'number') return '0';
    return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-EG' : 'en-US').format(num);
  }

  function formatCurrency(num) {
    const formatted = formatNumber(num);
    const curr = currentLang === 'ar' ? 'ج.م' : 'EGP';
    return `${formatted} ${curr}`;
  }

  // --- Date Indicator ---
  function updateDateDisplay(dateStr) {
    const dateEl = document.getElementById('dashboardDateDisplay');
    if (!dateEl) return;
    let d;
    if (dateStr) {
      const parts = dateStr.split('-');
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date(2026, 9, 30); // 30 Oct 2026
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    try {
      dateEl.textContent = d.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch (e) {
      dateEl.textContent = dateStr || (currentLang === 'ar' ? 'الجمعة، 30 أكتوبر 2026' : 'Friday, October 30, 2026');
    }
  }

  // --- Auth Verification Guard ---
  async function verifyCompanyAuth() {
    let user = null;
    try {
      const res = await apiFetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        user = data.user;
      }
    } catch (e) {
      console.warn('Could not verify /api/auth/me:', e);
    }

    if (!user) {
      try {
        const stored = localStorage.getItem('miqat_user');
        if (stored) {
          user = JSON.parse(stored);
          if (typeof user === 'string') user = JSON.parse(user);
        }
      } catch (e) {}
    }

    const unauthBanner = document.getElementById('companyUnauthorizedBanner');
    const mainContent = document.getElementById('companyMainContent');

    if (!user) {
      // Unauthenticated -> Redirect to login page with preserved redirect query
      if (window.location.replace) {
        window.location.replace('login.html?redirect=company-dashboard.html');
      } else {
        window.location.href = 'login.html?redirect=company-dashboard.html';
      }
      return null;
    }

    // Strict Role Guard: Company partner role required
    if (user.role !== 'company' && user.role !== 'partner_company') {
      if (unauthBanner) unauthBanner.style.display = 'block';
      if (mainContent) mainContent.style.display = 'none';
      return null;
    }

    if (unauthBanner) unauthBanner.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';

    currentUser = user;
    updateCompanyIdentityUI(user);
    return user;
  }

  function updateCompanyIdentityUI(user) {
    const compName = user.company_name || user.name || 'AL DORRA TRAVEL';
    const license = user.license_number || '47852';

    // Header identity
    const nameEl = document.getElementById('companyHeaderName');
    const licenseEl = document.getElementById('companyHeaderLicense');
    const licenseBadgeEl = document.getElementById('companyLicenseBadge');
    const avatarInit = document.getElementById('companyAvatarInitial');

    if (nameEl) nameEl.textContent = compName;
    if (licenseEl) licenseEl.textContent = currentLang === 'ar' ? `ترخيص ${license}` : `Lic. ${license}`;
    if (licenseBadgeEl) licenseBadgeEl.textContent = currentLang === 'ar' ? `ترخيص سياحي رقم: ${license}` : `Tourism License No: ${license}`;
    if (avatarInit) avatarInit.textContent = currentLang === 'ar' ? 'د' : 'D';

    // Mobile drawer identity
    const mobileNameEl = document.getElementById('mobileCompanyName');
    const mobileInit = document.getElementById('mobileCompanyInitial');
    if (mobileNameEl) mobileNameEl.textContent = compName;
    if (mobileInit) mobileInit.textContent = currentLang === 'ar' ? 'د' : 'D';
  }

  // --- Render Dashboard with Mock Data Engine ---
  function renderDashboard(period = 'all', specificDate = null) {
    if (document.body && document.body.dataset.pageId !== 'company-dashboard') return;
    currentPeriod = period;
    currentSpecificDate = specificDate;

    // Fetch metrics from client mock engine (backed identically by server/companyMockData.js)
    if (typeof window.MiqatCompanyMockData !== 'undefined') {
      currentMetrics = window.MiqatCompanyMockData.getDashboardMetrics(period, specificDate);
    } else {
      console.error('MiqatCompanyMockData not loaded!');
      return;
    }

    const { kpi, popularPrograms, statusDistribution, categoriesDistribution, monthlyActivity, recentBookings, activities, notifications } = currentMetrics;

    // 1. Render 8 KPI Cards
    renderKpiCards(kpi);

    // 2. Render Analytics Visualizations
    renderActivityChart(monthlyActivity);
    renderStatusDonut(statusDistribution, kpi.totalBookings);
    renderCategoriesBreakdown(categoriesDistribution);
    renderPopularPrograms(popularPrograms);

    // 3. Populate Program Filter Options (Requirement 6)
    populateProgramFilterOptions();

    // 4. Render Recent Bookings Table & Mobile Cards (preserves/applies active filters)
    if (currentMultiCriteriaFilter && currentMultiCriteriaFilter.length > 0) {
      applyRecentBookingsFilter(false);
    } else {
      applyTableStatusFilter(currentTableStatusFilter, false);
    }

    // 5. Render Activities & Notifications
    renderActivities(activities);
    renderNotifications(notifications);
  }

  // --- 1. KPI Cards Rendering ---
  function renderKpiCards(kpi) {
    const elTotal = document.getElementById('kpiTotalBookings');
    const elNew = document.getElementById('kpiNewBookings');
    const elPending = document.getElementById('kpiPendingBookings');
    const elConfirmed = document.getElementById('kpiConfirmedBookings');
    const elRejected = document.getElementById('kpiRejectedBookings');
    const elTotalVal = document.getElementById('kpiTotalValue');
    const elCollected = document.getElementById('kpiAmountCollected');
    const elRemaining = document.getElementById('kpiRemainingAmount');

    if (elTotal) elTotal.textContent = formatNumber(kpi.totalBookings);
    if (elNew) elNew.textContent = formatNumber(kpi.newBookings);
    if (elPending) elPending.textContent = formatNumber(kpi.pendingBookings);
    if (elConfirmed) elConfirmed.textContent = formatNumber(kpi.confirmedBookings);
    if (elRejected) elRejected.textContent = formatNumber(kpi.rejectedBookings);

    if (elTotalVal) elTotalVal.textContent = formatNumber(kpi.totalBookingValue);
    if (elCollected) elCollected.textContent = formatNumber(kpi.amountCollected);
    if (elRemaining) elRemaining.textContent = formatNumber(kpi.remainingAmount);

    // Dynamic Meta Rates
    const newShareEl = document.getElementById('kpiNewShare');
    if (newShareEl) {
      const share = kpi.totalBookings > 0 ? Math.round((kpi.newBookings / kpi.totalBookings) * 100) : 0;
      newShareEl.textContent = currentLang === 'ar' ? `${share}% من الإجمالي` : `${share}% of total`;
    }

    const confirmedShareEl = document.getElementById('kpiConfirmedShare');
    if (confirmedShareEl) {
      const share = kpi.totalBookings > 0 ? Math.round((kpi.confirmedBookings / kpi.totalBookings) * 100) : 0;
      confirmedShareEl.textContent = currentLang === 'ar' ? `${share}% نسبة التأكيد` : `${share}% confirmation rate`;
    }

    const collectedRateEl = document.getElementById('kpiCollectedRate');
    if (collectedRateEl) {
      const rate = kpi.totalBookingValue > 0 ? ((kpi.amountCollected / kpi.totalBookingValue) * 100).toFixed(1) : 0;
      collectedRateEl.textContent = currentLang === 'ar' ? `${rate}% من إجمالي القيمة` : `${rate}% of total value`;
    }

    const remainingRateEl = document.getElementById('kpiRemainingRate');
    if (remainingRateEl) {
      const rate = kpi.totalBookingValue > 0 ? ((kpi.remainingAmount / kpi.totalBookingValue) * 100).toFixed(1) : 0;
      remainingRateEl.textContent = currentLang === 'ar' ? `${rate}% مستحقات مؤجلة` : `${rate}% remaining balance`;
    }
  }

  // --- 2. Booking Activity Over Time (SVG Monthly Chart with Interactive Hover Details) ---
  function renderActivityChart(months) {
    const wrapper = document.getElementById('activityChartWrapper');
    if (!wrapper) return;

    const maxCount = Math.max(...months.map(m => m.bookingsCount), 10);
    const maxValue = Math.max(...months.map(m => m.totalValue), 1000000);

    const isDark = currentTheme === 'dark';
    const primaryBarColor = isDark ? '#D1B16C' : '#183653';
    const accentLineColor = isDark ? '#E5C98A' : '#C5A15E';
    const gridColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(24,54,83,0.08)';
    const textColor = isDark ? '#F5F2EB' : '#526579';
    const textMuted = isDark ? '#D0D9E2' : '#8A9BAE';

    const width = 580;
    const height = 240;
    const padding = { top: 25, right: 35, bottom: 40, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const barWidth = 32;
    const colStep = chartWidth / months.length;

    let barsSvg = '';
    let linePoints = [];

    months.forEach((m, idx) => {
      const x = padding.left + (idx * colStep) + (colStep / 2);
      const barH = (m.bookingsCount / maxCount) * chartHeight;
      const barY = padding.top + chartHeight - barH;

      const valY = padding.top + chartHeight - ((m.totalValue / maxValue) * chartHeight);
      linePoints.push(`${x},${valY}`);

      const monthName = currentLang === 'ar' ? m.name_ar : m.name_en;
      const label = monthName.split(' ')[0];
      const countLabel = formatNumber(m.bookingsCount);
      const countWord = currentLang === 'ar' ? 'حجز' : 'bookings';

      barsSvg += `
        <g class="chart-col-group" data-month-index="${idx}" tabindex="0" role="img" aria-label="${monthName}: ${countLabel} ${countWord}" style="cursor: pointer;">
          <rect class="activity-bar" x="${x - barWidth / 2}" y="${barY}" width="${barWidth}" height="${barH}" rx="4" fill="${primaryBarColor}" opacity="0.9">
            <title>${monthName}: ${countLabel} ${countWord} — ${formatCurrency(m.totalValue)}</title>
          </rect>
          <text x="${x}" y="${barY - 6}" font-size="11" font-weight="700" fill="${textColor}" text-anchor="middle" class="font-numeric">${countLabel}</text>
          <text x="${x}" y="${height - 12}" font-size="11" fill="${textMuted}" text-anchor="middle">${label}</text>
        </g>
      `;
    });

    const linePath = linePoints.length ? `M ${linePoints.join(' L ')}` : '';

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="company-svg-chart" width="100%" height="240" style="overflow: visible;">
        <!-- Horizontal Grid Lines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="${gridColor}" stroke-dasharray="3,3" />
        <line x1="${padding.left}" y1="${padding.top + chartHeight / 2}" x2="${width - padding.right}" y2="${padding.top + chartHeight / 2}" stroke="${gridColor}" stroke-dasharray="3,3" />
        <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="${isDark ? '#334D64' : '#E2E8F0'}" stroke-width="1.2" />

        <!-- Bars -->
        ${barsSvg}

        <!-- Revenue Trend Line -->
        ${linePath ? `<path d="${linePath}" fill="none" stroke="${accentLineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />` : ''}
        ${linePoints.map(pt => {
          const [cx, cy] = pt.split(',');
          return `<circle cx="${cx}" cy="${cy}" r="4" fill="${accentLineColor}" stroke="${isDark ? '#172838' : '#FFFFFF'}" stroke-width="2" />`;
        }).join('')}
      </svg>
      <div id="activityChartTooltip" class="chart-hover-tooltip" style="display: none;"></div>
    `;

    wrapper.innerHTML = svg;

    // Attach interactive hover, focus, and touch listeners (Requirement 5)
    const tooltip = document.getElementById('activityChartTooltip');
    const colGroups = wrapper.querySelectorAll('.chart-col-group');

    colGroups.forEach(g => {
      const idx = parseInt(g.getAttribute('data-month-index'), 10);
      const m = months[idx];
      if (!m) return;

      const showTooltip = (e) => {
        if (!tooltip) return;
        const monthName = currentLang === 'ar' ? m.name_ar : m.name_en;
        const countWord = currentLang === 'ar' ? 'حجز' : 'bookings';
        const lblBookings = getTranslation('company.tooltip_bookings', currentDict) || (currentLang === 'ar' ? 'الحجوزات' : 'Bookings');
        const lblRevenue = getTranslation('company.tooltip_revenue', currentDict) || (currentLang === 'ar' ? 'الإيراد' : 'Revenue');
        const lblCollected = getTranslation('company.tooltip_collected', currentDict) || (currentLang === 'ar' ? 'المحصل' : 'Collected');

        tooltip.innerHTML = `
          <div class="chart-tooltip-title font-numeric">${monthName}</div>
          <div class="chart-tooltip-row">
            <span class="tooltip-label">${lblBookings}:</span>
            <span class="tooltip-val font-numeric">${formatNumber(m.bookingsCount)} ${countWord}</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="tooltip-label">${lblRevenue}:</span>
            <span class="tooltip-val font-numeric">${formatCurrency(m.totalValue)}</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="tooltip-label">${lblCollected}:</span>
            <span class="tooltip-val font-numeric">${formatCurrency(m.amountCollected)}</span>
          </div>
        `;
        tooltip.style.display = 'block';

        // Position tooltip relative to wrapper
        const wrapRect = wrapper.getBoundingClientRect();
        const gRect = g.getBoundingClientRect();
        const tipWidth = tooltip.offsetWidth || 150;
        const tipHeight = tooltip.offsetHeight || 85;

        let left = (gRect.left - wrapRect.left) + (gRect.width / 2) - (tipWidth / 2);
        left = Math.max(8, Math.min(left, wrapRect.width - tipWidth - 8));
        
        let top = (gRect.top - wrapRect.top) - tipHeight - 10;
        if (top < 0) top = (gRect.top - wrapRect.top) + gRect.height + 10;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        // Highlight this column, dim others
        colGroups.forEach(other => {
          const rect = other.querySelector('rect');
          if (other === g) {
            other.classList.add('is-hovered');
            if (rect) rect.style.opacity = '1';
          } else {
            other.classList.remove('is-hovered');
            if (rect) rect.style.opacity = '0.35';
          }
        });
      };

      const hideTooltip = () => {
        if (tooltip) tooltip.style.display = 'none';
        colGroups.forEach(other => {
          other.classList.remove('is-hovered');
          const rect = other.querySelector('rect');
          if (rect) rect.style.opacity = '0.9';
        });
      };

      g.addEventListener('mouseenter', showTooltip);
      g.addEventListener('focus', showTooltip);
      g.addEventListener('mouseleave', hideTooltip);
      g.addEventListener('blur', hideTooltip);
      g.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        showTooltip(e);
      }, { passive: true });
    });

    wrapper.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
      colGroups.forEach(other => {
        other.classList.remove('is-hovered');
        const rect = other.querySelector('rect');
        if (rect) rect.style.opacity = '0.9';
      });
    });
  }

  // --- 3. Booking Status Distribution (SVG Donut Chart with Interactive Hover Details) ---
  function renderStatusDonut(statusList, totalCount) {
    const container = document.getElementById('statusDonutContainer');
    if (!container) return;

    const size = 160;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;
    let segmentsSvg = '';

    const colorTokens = {
      Confirmed: currentTheme === 'dark' ? '#2B4E70' : '#183653',
      New: currentTheme === 'dark' ? '#D1B16C' : '#C5A15E',
      Pending: currentTheme === 'dark' ? '#3E739E' : '#28577D',
      Rejected: currentTheme === 'dark' ? '#4B6E8C' : '#8A9BAE'
    };

    const countWord = currentLang === 'ar' ? 'حجز' : 'bookings';

    statusList.forEach(st => {
      const segmentLength = (st.percentage / 100) * circumference;
      const strokeColor = colorTokens[st.status] || '#183653';
      const stLabel = currentLang === 'ar' ? st.label_ar : st.label_en;
      const countFmt = formatNumber(st.count);

      segmentsSvg += `
        <circle 
          cx="${size / 2}" 
          cy="${size / 2}" 
          r="${radius}" 
          fill="none" 
          stroke="${strokeColor}" 
          stroke-width="${strokeWidth}" 
          stroke-dasharray="${segmentLength} ${circumference - segmentLength}" 
          stroke-dashoffset="${-currentOffset}"
          stroke-linecap="butt"
          transform="rotate(-90 ${size / 2} ${size / 2})"
          class="donut-segment-interactive"
          data-status-filter="${st.status}"
          role="button"
          tabindex="0"
          style="cursor: pointer; transition: opacity 0.2s ease, stroke-width 0.2s ease, filter 0.2s ease;"
          aria-label="${stLabel}: ${countFmt} ${countWord} (${st.percentage}%)"
        >
          <title>${stLabel}: ${countFmt} ${countWord} (${st.percentage}%) — ${currentLang === 'ar' ? 'انقر للتصفية' : 'Click to filter'}</title>
        </circle>
      `;
      currentOffset += segmentLength;
    });

    const isDark = currentTheme === 'dark';
    const totalTextColor = isDark ? '#F5F2EB' : '#183653';
    const labelTextColor = isDark ? '#D0D9E2' : '#526579';

    const donutSvg = `
      <div class="donut-visual-wrap" style="position: relative;">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="donut-svg">
          ${segmentsSvg}
        </svg>
        <div class="donut-center-label" id="donutCenterLabel">
          <span class="donut-total-val font-numeric" id="donutCenterVal" style="color: ${totalTextColor};">${formatNumber(totalCount)}</span>
          <span class="donut-total-desc" id="donutCenterDesc" style="color: ${labelTextColor};">${currentLang === 'ar' ? 'إجمالي الحالات' : 'Total'}</span>
        </div>
      </div>
    `;

    // Legend
    let legendHtml = '<div class="donut-legend-list">';
    statusList.forEach(st => {
      const color = colorTokens[st.status] || '#183653';
      const label = currentLang === 'ar' ? st.label_ar : st.label_en;
      legendHtml += `
        <div class="donut-legend-item" role="button" tabindex="0" data-status-filter="${st.status}" style="cursor: pointer;" title="${currentLang === 'ar' ? 'تصفية الجدول بحالة: ' + label : 'Filter table by: ' + label}">
          <div class="legend-color-box" style="background-color: ${color};"></div>
          <span class="legend-label">${label}</span>
          <span class="legend-count font-numeric">${formatNumber(st.count)}</span>
          <span class="legend-pct font-numeric">(${st.percentage}%)</span>
        </div>
      `;
    });
    legendHtml += '</div>';

    container.innerHTML = donutSvg + legendHtml + `<div id="statusDonutTooltip" class="chart-hover-tooltip" style="display: none;"></div>`;

    // Attach interactive hover, focus, and touch listeners (Requirement 5)
    const tooltip = document.getElementById('statusDonutTooltip');
    const centerVal = document.getElementById('donutCenterVal');
    const centerDesc = document.getElementById('donutCenterDesc');
    const segments = container.querySelectorAll('.donut-segment-interactive');

    segments.forEach(seg => {
      const stKey = seg.getAttribute('data-status-filter');
      const st = statusList.find(s => s.status === stKey);
      if (!st) return;

      const strokeColor = colorTokens[st.status] || '#183653';
      const stLabel = currentLang === 'ar' ? st.label_ar : st.label_en;
      const countFmt = formatNumber(st.count);

      const showDonutHover = (e) => {
        if (!tooltip) return;
        const lblCount = getTranslation('company.tooltip_count', currentDict) || (currentLang === 'ar' ? 'العدد' : 'Count');
        const lblShare = getTranslation('company.tooltip_share', currentDict) || (currentLang === 'ar' ? 'النسبة' : 'Share');

        tooltip.innerHTML = `
          <div class="chart-tooltip-title" style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${strokeColor};"></span>
            <span>${stLabel}</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="tooltip-label">${lblCount}:</span>
            <span class="tooltip-val font-numeric">${countFmt} ${countWord}</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="tooltip-label">${lblShare}:</span>
            <span class="tooltip-val font-numeric">${st.percentage}%</span>
          </div>
        `;
        tooltip.style.display = 'block';

        // Position tooltip clamped in container
        const contRect = container.getBoundingClientRect();
        const segRect = seg.getBoundingClientRect();
        const tipWidth = tooltip.offsetWidth || 130;
        const tipHeight = tooltip.offsetHeight || 75;

        let left = (segRect.left - contRect.left) + (segRect.width / 2) - (tipWidth / 2);
        left = Math.max(5, Math.min(left, contRect.width - tipWidth - 5));
        let top = (segRect.top - contRect.top) - tipHeight - 8;
        if (top < 0) top = (segRect.top - contRect.top) + segRect.height + 8;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        // Highlight segment, dim others
        segments.forEach(other => {
          if (other === seg) {
            other.classList.add('is-hovered');
            other.style.opacity = '1';
          } else {
            other.classList.remove('is-hovered');
            other.style.opacity = '0.35';
          }
        });

        // Update center text to hovered segment
        if (centerVal) {
          centerVal.textContent = `${st.percentage}%`;
          centerVal.style.color = strokeColor;
        }
        if (centerDesc) {
          centerDesc.textContent = stLabel;
        }
      };

      const hideDonutHover = () => {
        if (tooltip) tooltip.style.display = 'none';
        segments.forEach(other => {
          other.classList.remove('is-hovered');
          other.style.opacity = '1';
        });
        if (centerVal) {
          centerVal.textContent = formatNumber(totalCount);
          centerVal.style.color = totalTextColor;
        }
        if (centerDesc) {
          centerDesc.textContent = currentLang === 'ar' ? 'إجمالي الحالات' : 'Total';
        }
      };

      seg.addEventListener('mouseenter', showDonutHover);
      seg.addEventListener('focus', showDonutHover);
      seg.addEventListener('mouseleave', hideDonutHover);
      seg.addEventListener('blur', hideDonutHover);
      seg.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        showDonutHover(e);
      }, { passive: true });
    });

    container.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
      segments.forEach(other => {
        other.classList.remove('is-hovered');
        other.style.opacity = '1';
      });
      if (centerVal) {
        centerVal.textContent = formatNumber(totalCount);
        centerVal.style.color = totalTextColor;
      }
      if (centerDesc) {
        centerDesc.textContent = currentLang === 'ar' ? 'إجمالي الحالات' : 'Total';
      }
    });

    // Attach click and keyboard listeners to donut segments and legend items
    container.querySelectorAll('[data-status-filter]').forEach(el => {
      const filter = el.getAttribute('data-status-filter');
      const handleFilter = () => {
        if (currentTableStatusFilter === filter) {
          applyTableStatusFilter('All', true);
        } else {
          applyTableStatusFilter(filter, true);
        }
      };
      el.addEventListener('click', handleFilter);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFilter();
        }
      });
    });
  }

  // --- 4. Trip Categories Breakdown (Umrah vs Hajj) ---
  function renderCategoriesBreakdown(categories) {
    const container = document.getElementById('categoriesBarsContainer');
    if (!container) return;

    let html = '';
    categories.forEach(cat => {
      const label = currentLang === 'ar' ? cat.label_ar : cat.label_en;
      const isUmrah = cat.category === 'umrah';
      const icon = isUmrah
        ? `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`
        : `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>`;

      html += `
        <div class="category-stat-row">
          <div class="category-info-header">
            <div class="category-icon-title">
              <span class="cat-icon-wrap ${isUmrah ? 'cat-umrah' : 'cat-hajj'}">${icon}</span>
              <strong class="cat-title">${label}</strong>
            </div>
            <div class="cat-metrics font-numeric">
              <span class="cat-count">${formatNumber(cat.count)} ${currentLang === 'ar' ? 'حجز' : 'bookings'}</span>
              <span class="cat-pct">(${cat.percentage}%)</span>
            </div>
          </div>
          <div class="category-progress-track">
            <div class="category-progress-fill ${isUmrah ? 'fill-umrah' : 'fill-hajj'}" style="width: ${cat.percentage}%;"></div>
          </div>
          <div class="cat-revenue font-numeric">${formatCurrency(cat.revenue)}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // --- 5. Popular Programs (Section 4.4) ---
  function renderPopularPrograms(programs) {
    const list = document.getElementById('popularProgramsList');
    if (!list) return;

    let html = '';
    programs.forEach((p, idx) => {
      const name = currentLang === 'ar' ? p.name_ar : p.name_en;
      const count = formatNumber(p.bookingsCount);
      const share = `${p.percentageOfTotal}%`;
      const rank = idx + 1;

      html += `
        <div class="popular-program-item">
          <div class="program-rank-badge font-numeric">${rank}</div>
          <div class="program-meta-wrap">
            <div class="program-name-row">
              <strong class="program-title">${name}</strong>
              <span class="program-count font-numeric">${count} ${currentLang === 'ar' ? 'حجز' : 'bookings'}</span>
            </div>
            <div class="program-progress-track">
              <div class="program-progress-fill" style="width: ${share};"></div>
            </div>
            <div class="program-bottom-row">
              <span class="program-revenue font-numeric">${formatCurrency(p.totalRevenue)}</span>
              <span class="program-share font-numeric">${share} ${currentLang === 'ar' ? 'من الإجمالي' : 'share'}</span>
            </div>
          </div>
        </div>
      `;
    });

    list.innerHTML = html;
  }

  // --- 6. Program Filter Options & Multi-Criteria Filtering (Requirements 3 & 6) ---
  function populateProgramFilterOptions() {
    const select = document.getElementById('filterProgram');
    if (!select) return;
    const currentVal = select.value;
    const programs = (window.MiqatCompanyMockData && window.MiqatCompanyMockData.PROGRAMS) || [];

    const allLabel = getTranslation('company.filter_all_programs', currentDict) || (currentLang === 'ar' ? 'كافة البرامج' : 'All Programs');
    let html = `<option value="">${allLabel}</option>`;

    programs.forEach(p => {
      const name = currentLang === 'ar' ? p.name_ar : p.name_en;
      html += `<option value="${p.id}">${name}</option>`;
    });
    select.innerHTML = html;
    if (currentVal) select.value = currentVal;
  }

  function applyRecentBookingsFilter(shouldScroll = false) {
    if (!currentMetrics) return;

    const source = currentMetrics.allBookings || currentMetrics.recentBookings || [];

    // Read all 8 filtering criteria
    const refVal = (document.getElementById('filterBookingRef')?.value || '').trim();
    const custVal = (document.getElementById('filterCustomerName')?.value || '').trim();
    const progVal = document.getElementById('filterProgram')?.value || '';
    const dateVal = document.getElementById('filterBookingDate')?.value || '';
    const minPrice = parseFloat(document.getElementById('filterTotalPriceMin')?.value);
    const maxPrice = parseFloat(document.getElementById('filterTotalPriceMax')?.value);
    const minPaid = parseFloat(document.getElementById('filterPaidAmountMin')?.value);
    const maxPaid = parseFloat(document.getElementById('filterPaidAmountMax')?.value);
    const minRem = parseFloat(document.getElementById('filterRemainingAmountMin')?.value);
    const maxRem = parseFloat(document.getElementById('filterRemainingAmountMax')?.value);
    const statusVal = document.getElementById('filterBookingStatus')?.value || '';

    const activeCriteria = [];
    if (refVal) activeCriteria.push({ key: 'ref', label: currentLang === 'ar' ? `المرجع: ${refVal}` : `Ref: ${refVal}` });
    if (custVal) activeCriteria.push({ key: 'cust', label: currentLang === 'ar' ? `العميل: ${custVal}` : `Customer: ${custVal}` });
    if (progVal) {
      const prog = window.MiqatCompanyMockData?.PROGRAMS?.find(p => p.id === progVal);
      const progName = prog ? (currentLang === 'ar' ? prog.name_ar : prog.name_en) : progVal;
      activeCriteria.push({ key: 'prog', label: currentLang === 'ar' ? `البرنامج: ${progName}` : `Program: ${progName}` });
    }
    if (dateVal) activeCriteria.push({ key: 'date', label: currentLang === 'ar' ? `التاريخ: ${dateVal}` : `Date: ${dateVal}` });
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      const rangeText = `${!isNaN(minPrice) ? formatNumber(minPrice) : '0'} - ${!isNaN(maxPrice) ? formatNumber(maxPrice) : '∞'}`;
      activeCriteria.push({ key: 'price', label: currentLang === 'ar' ? `السعر: ${rangeText}` : `Price: ${rangeText}` });
    }
    if (!isNaN(minPaid) || !isNaN(maxPaid)) {
      const rangeText = `${!isNaN(minPaid) ? formatNumber(minPaid) : '0'} - ${!isNaN(maxPaid) ? formatNumber(maxPaid) : '∞'}`;
      activeCriteria.push({ key: 'paid', label: currentLang === 'ar' ? `المدفوع: ${rangeText}` : `Paid: ${rangeText}` });
    }
    if (!isNaN(minRem) || !isNaN(maxRem)) {
      const rangeText = `${!isNaN(minRem) ? formatNumber(minRem) : '0'} - ${!isNaN(maxRem) ? formatNumber(maxRem) : '∞'}`;
      activeCriteria.push({ key: 'rem', label: currentLang === 'ar' ? `المتبقي: ${rangeText}` : `Remaining: ${rangeText}` });
    }
    if (statusVal) {
      const statusLabels = {
        Confirmed: { ar: 'مؤكد', en: 'Confirmed' },
        New: { ar: 'جديد', en: 'New' },
        Pending: { ar: 'تحت الإجراء', en: 'Pending' },
        Rejected: { ar: 'مرفوض', en: 'Rejected' }
      };
      const stLabel = statusLabels[statusVal] ? (currentLang === 'ar' ? statusLabels[statusVal].ar : statusLabels[statusVal].en) : statusVal;
      activeCriteria.push({ key: 'status', label: currentLang === 'ar' ? `الحالة: ${stLabel}` : `Status: ${stLabel}` });
    }

    // Multi-criteria filter: Logical AND across all active criteria
    const filtered = source.filter(b => {
      if (refVal && !(b.reference || '').toLowerCase().includes(refVal.toLowerCase())) return false;
      const bCustName = `${b.customerName_ar || ''} ${b.customerName_en || ''}`;
      if (custVal && !bCustName.toLowerCase().includes(custVal.toLowerCase())) return false;
      if (progVal && b.programId !== progVal) return false;
      if (dateVal && b.bookingDate !== dateVal) return false;
      if (!isNaN(minPrice) && b.totalPrice < minPrice) return false;
      if (!isNaN(maxPrice) && b.totalPrice > maxPrice) return false;
      if (!isNaN(minPaid) && b.paidAmount < minPaid) return false;
      if (!isNaN(maxPaid) && b.paidAmount > maxPaid) return false;
      if (!isNaN(minRem) && b.remainingAmount < minRem) return false;
      if (!isNaN(maxRem) && b.remainingAmount > maxRem) return false;
      if (statusVal && b.status !== statusVal) return false;
      return true;
    });

    // Update active filter badge on "Filter Results" button
    const badge = document.getElementById('activeFiltersCountPill');
    if (badge) {
      if (activeCriteria.length > 0) {
        badge.textContent = activeCriteria.length;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }

    // Update Active Filter Bar above table
    const filterBar = document.getElementById('tableFilterBar');
    const filterLabel = document.getElementById('tableActiveFilterLabel');
    const filterVal = document.getElementById('tableActiveFilterValue');
    const filterCount = document.getElementById('tableActiveFilterCount');

    if (activeCriteria.length > 0) {
      currentMultiCriteriaFilter = activeCriteria;
      if (filterBar) filterBar.style.display = 'flex';
      if (filterLabel) {
        filterLabel.textContent = getTranslation('company.filter_criteria_label', currentDict) || (currentLang === 'ar' ? 'المعايير المطبقة:' : 'Active Criteria:');
      }
      if (filterVal) {
        filterVal.className = 'active-criteria-tags';
        filterVal.innerHTML = activeCriteria.map(c => `<span class="active-criteria-tag font-numeric">${c.label}</span>`).join('');
      }
      if (filterCount) {
        filterCount.textContent = `(${formatNumber(filtered.length)})`;
      }
    } else {
      currentMultiCriteriaFilter = null;
      if (filterBar) filterBar.style.display = 'none';
    }

    // Close filter panel after applying
    const panel = document.getElementById('bookingsFilterPanel');
    const toggleBtn = document.getElementById('btnToggleBookingsFilter');
    if (panel) panel.style.display = 'none';
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');

    // Deselect KPI card highlights when using advanced filter
    document.querySelectorAll('.kpi-card[data-kpi-filter]').forEach(card => {
      card.classList.remove('is-filtered-active');
      card.setAttribute('aria-pressed', 'false');
    });

    renderRecentBookings(filtered.slice(0, 8));

    if (shouldScroll) {
      const tableSec = document.querySelector('.company-recent-bookings-section');
      if (tableSec) tableSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function resetRecentBookingsFilter() {
    const form = document.getElementById('bookingsFilterForm');
    if (form) form.reset();

    const badge = document.getElementById('activeFiltersCountPill');
    if (badge) badge.style.display = 'none';

    currentMultiCriteriaFilter = null;
    applyTableStatusFilter('All', false);
  }

  // --- 7. Table Status Filter (KPI Cards / Donut Clicks) ---
  function applyTableStatusFilter(status = 'All', shouldScroll = false) {
    currentTableStatusFilter = status;
    if (!currentMetrics) return;

    // Reset multi-criteria state when explicit status filter is activated
    currentMultiCriteriaFilter = null;
    const badge = document.getElementById('activeFiltersCountPill');
    if (badge) badge.style.display = 'none';
    const form = document.getElementById('bookingsFilterForm');
    if (form && status === 'All') form.reset();

    const source = currentMetrics.allBookings || currentMetrics.recentBookings || [];
    let allMatching = source;
    if (status !== 'All') {
      allMatching = source.filter(b => b.status === status);
    }
    const filteredList = allMatching.slice(0, 8);

    // Update KPI Card active highlights
    document.querySelectorAll('.kpi-card[data-kpi-filter]').forEach(card => {
      const filter = card.getAttribute('data-kpi-filter');
      const isMatch = (status === 'All' && filter === 'Total') || (filter === status);
      card.classList.toggle('is-filtered-active', isMatch);
      card.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    // Update Active Filter Bar above table
    const filterBar = document.getElementById('tableFilterBar');
    const filterLabel = document.getElementById('tableActiveFilterLabel');
    const filterValueEl = document.getElementById('tableActiveFilterValue');
    const filterCountEl = document.getElementById('tableActiveFilterCount');

    if (status !== 'All') {
      if (filterBar) filterBar.style.display = 'flex';
      if (filterLabel) {
        filterLabel.textContent = getTranslation('company.filter_by_status', currentDict) || (currentLang === 'ar' ? 'تصفية حسب الحالة:' : 'Filtered by Status:');
      }
      const statusTranslations = {
        Confirmed: { ar: 'مؤكد', en: 'Confirmed', class: 'status-confirmed' },
        New: { ar: 'جديد', en: 'New', class: 'status-new' },
        Pending: { ar: 'تحت الإجراء', en: 'Pending', class: 'status-pending' },
        Rejected: { ar: 'مرفوض', en: 'Rejected', class: 'status-rejected' }
      };
      const st = statusTranslations[status] || { ar: status, en: status, class: 'status-pending' };
      if (filterValueEl) {
        filterValueEl.textContent = currentLang === 'ar' ? st.ar : st.en;
        filterValueEl.className = `active-filter-value status-pill ${st.class}`;
      }
      if (filterCountEl) {
        filterCountEl.textContent = `(${formatNumber(allMatching.length)})`;
      }
    } else {
      if (filterBar) filterBar.style.display = 'none';
    }

    renderRecentBookings(filteredList);

    if (shouldScroll && status !== 'All') {
      const tableSec = document.querySelector('.company-recent-bookings-section');
      if (tableSec) {
        tableSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function renderRecentBookings(bookings) {
    const tbody = document.getElementById('recentBookingsTbody');
    const mobileContainer = document.getElementById('recentBookingsMobileCards');

    if (!bookings || bookings.length === 0) {
      const emptyMsg = getTranslation('company.no_matching_bookings', currentDict) || (currentLang === 'ar' ? 'لا توجد حجوزات مطابقة لمعايير التصفية المحددة' : 'No bookings matching the selected criteria');
      if (tbody) {
        tbody.innerHTML = `
          <tr class="empty-state-row">
            <td colspan="8" style="text-align: center; padding: 2.75rem 1rem; color: var(--color-text-muted);">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" style="opacity: 0.55;" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span style="font-size: 0.95rem; font-weight: 500;">${emptyMsg}</span>
              </div>
            </td>
          </tr>
        `;
      }
      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <div class="empty-state-card" style="text-align: center; padding: 2.25rem 1rem; color: var(--color-text-muted); background: var(--color-surface); border: 1.5px dashed var(--color-border); border-radius: var(--radius-lg);">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="opacity: 0.55; margin-bottom: 8px;" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p style="margin: 0; font-size: 0.92rem;">${emptyMsg}</p>
          </div>
        `;
      }
      return;
    }

    const statusMap = {
      Confirmed: { ar: 'مؤكد', en: 'Confirmed', class: 'status-confirmed' },
      New: { ar: 'جديد', en: 'New', class: 'status-new' },
      Pending: { ar: 'تحت الإجراء', en: 'Pending', class: 'status-pending' },
      Rejected: { ar: 'مرفوض', en: 'Rejected', class: 'status-rejected' }
    };

    let tableRows = '';
    let cardsHtml = '';

    bookings.forEach(b => {
      const custName = currentLang === 'ar' ? b.customerName_ar : b.customerName_en;
      const progName = currentLang === 'ar' ? b.programName_ar : b.programName_en;
      const st = statusMap[b.status] || { ar: b.status, en: b.status, class: 'status-pending' };
      const statusLabel = currentLang === 'ar' ? st.ar : st.en;

      // Table Row (Desktop / Tablet)
      tableRows += `
        <tr>
          <td><strong class="booking-ref font-numeric">${b.reference}</strong></td>
          <td><span class="booking-customer">${custName}</span></td>
          <td><span class="booking-program">${progName}</span></td>
          <td><span class="booking-date font-numeric">${b.bookingDate}</span></td>
          <td><strong class="booking-price font-numeric">${formatCurrency(b.totalPrice)}</strong></td>
          <td><span class="booking-paid font-numeric">${formatCurrency(b.paidAmount)}</span></td>
          <td><span class="booking-remaining font-numeric">${formatCurrency(b.remainingAmount)}</span></td>
          <td><span class="status-pill ${st.class}">${statusLabel}</span></td>
        </tr>
      `;

      // Mobile Card Layout (Small Screen Reflow)
      cardsHtml += `
        <div class="booking-mobile-card">
          <div class="card-top-row">
            <strong class="booking-ref font-numeric">${b.reference}</strong>
            <span class="status-pill ${st.class}">${statusLabel}</span>
          </div>
          <div class="card-details-grid">
            <div class="detail-item">
              <span class="detail-label">${currentLang === 'ar' ? 'العميل' : 'Customer'}:</span>
              <strong class="detail-val">${custName}</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">${currentLang === 'ar' ? 'البرنامج' : 'Program'}:</span>
              <span class="detail-val">${progName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${currentLang === 'ar' ? 'التاريخ' : 'Date'}:</span>
              <span class="detail-val font-numeric">${b.bookingDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${currentLang === 'ar' ? 'إجمالي السعر' : 'Total'}:</span>
              <strong class="detail-val font-numeric">${formatCurrency(b.totalPrice)}</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">${currentLang === 'ar' ? 'المدفوع' : 'Paid'}:</span>
              <span class="detail-val font-numeric">${formatCurrency(b.paidAmount)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${currentLang === 'ar' ? 'المتبقي' : 'Remaining'}:</span>
              <span class="detail-val font-numeric">${formatCurrency(b.remainingAmount)}</span>
            </div>
          </div>
        </div>
      `;
    });

    if (tbody) tbody.innerHTML = tableRows;
    if (mobileContainer) mobileContainer.innerHTML = cardsHtml;
  }

  // --- 7. Operational Activities Feed ---
  function renderActivities(activities) {
    const timeline = document.getElementById('activitiesTimeline');
    if (!timeline) return;

    let html = '';
    activities.forEach(act => {
      const title = currentLang === 'ar' ? act.title_ar : act.title_en;
      const desc = currentLang === 'ar' ? act.desc_ar : act.desc_en;
      const time = currentLang === 'ar' ? act.relative_ar : act.relative_en;

      html += `
        <div class="activity-timeline-item">
          <div class="timeline-dot-wrap">
            <span class="timeline-dot"></span>
          </div>
          <div class="timeline-content">
            <div class="timeline-header-row">
              <strong class="timeline-title">${title}</strong>
              <time class="timeline-time">${time}</time>
            </div>
            <p class="timeline-desc">${desc}</p>
          </div>
        </div>
      `;
    });

    timeline.innerHTML = html;
  }

  // --- 8. System Notifications Feed ---
  function renderNotifications(notifications) {
    const list = document.getElementById('notificationsFeedList');
    if (!list) return;

    let html = '';
    notifications.forEach(notif => {
      const title = currentLang === 'ar' ? notif.title_ar : notif.title_en;
      const msg = currentLang === 'ar' ? notif.message_ar : notif.message_en;
      const badge = currentLang === 'ar' ? (notif.badge_ar || notif.badge) : (notif.badge_en || notif.badge);

      html += `
        <div class="notification-item ${notif.unread ? 'is-unread' : ''}">
          <div class="notif-header-row">
            <div class="notif-title-group">
              ${notif.unread ? '<span class="unread-dot" aria-label="غير مقروء"></span>' : ''}
              <strong class="notif-title">${title}</strong>
            </div>
            <span class="notif-badge">${badge}</span>
          </div>
          <p class="notif-message">${msg}</p>
          <div class="notif-footer-row">
            <span class="notif-date font-numeric">${notif.date}</span>
          </div>
        </div>
      `;
    });

    list.innerHTML = html;
  }

  // --- Future Scope Placeholder Modal ---
  function setupFutureScopeNavigation() {
    const modal = document.getElementById('companyFutureModal');
    const closeBtn = document.getElementById('futureModalCloseBtn');
    const backdrop = document.getElementById('companyModalBackdrop');
    const titleEl = document.getElementById('futureModalTitle');
    const msgEl = document.getElementById('futureModalMessage');

    const sectionTitles = {
      bookings: { ar: 'الحجوزات', en: 'Bookings' },
      'booking-details': { ar: 'تفاصيل الحجز', en: 'Booking Details' },
      financial: { ar: 'الملخص المالي', en: 'Financial Overview' },
      programs: { ar: 'البرامج والرحلات', en: 'Programs & Trips' },
      notifications: { ar: 'الإشعارات', en: 'Notifications' },
      profile: { ar: 'بيانات الشركة', en: 'Company Profile' }
    };

    function openModal(sectionKey) {
      if (!modal) return;
      const s = sectionTitles[sectionKey];
      const sectionName = s ? (currentLang === 'ar' ? s.ar : s.en) : '';

      if (titleEl) {
        titleEl.textContent = currentLang === 'ar'
          ? `قسم ${sectionName} — قيد التطوير`
          : `${sectionName} — Section Under Development`;
      }
      if (msgEl) {
        msgEl.textContent = currentLang === 'ar'
          ? `قسم "${sectionName}" ضمن خطة الإطلاق الموسعة لبوابة الشركات الشريكة لمنصة ميقات. يتم التركيز حالياً على لوحة التحكم التشغيلية المتكاملة.`
          : `The "${sectionName}" section is part of the expanded roadmap for the Miqat Partner Company Portal. Currently, the operational dashboard is fully active.`;
      }

      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');

      // Close mobile drawer if open
      const drawer = document.getElementById('mobileNavDrawer');
      if (drawer && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
      }
    }

    function closeModal() {
      if (!modal) return;
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('[data-company-section]').forEach(el => {
      const sec = el.getAttribute('data-company-section');
      const href = el.getAttribute('href');
      // If element is a real page link, let it navigate normally
      if (sec === 'dashboard' || sec === 'bookings' || sec === 'financial' || sec === 'booking-details') return;
      if (href && !href.startsWith('#')) return;

      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(sec);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // --- Setup Advanced Multi-Criteria Filter Controls (Requirements 3 & 6) ---
  function setupBookingsFilterControls() {
    const toggleBtn = document.getElementById('btnToggleBookingsFilter');
    const panel = document.getElementById('bookingsFilterPanel');
    const closeBtn = document.getElementById('btnCloseBookingsFilter');
    const cancelBtn = document.getElementById('btnCancelBookingsFilter');
    const applyBtn = document.getElementById('btnApplyBookingsFilter');
    const resetBtn = document.getElementById('btnResetBookingsFilter');

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.style.display === 'block';
        panel.style.display = isOpen ? 'none' : 'block';
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (!isOpen) {
          populateProgramFilterOptions();
        }
      });
    }

    const closePanel = () => {
      if (panel) panel.style.display = 'none';
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    };

    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (cancelBtn) cancelBtn.addEventListener('click', closePanel);

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applyRecentBookingsFilter(false);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetRecentBookingsFilter();
        closePanel();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel && panel.style.display === 'block') {
        closePanel();
      }
    });
  }

  // --- Setup Global Interactive Controls ---
  function setupGlobalControls() {
    // Language Toggle
    document.querySelectorAll('#langToggleBtn, #mobileLangToggleBtn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const nextLang = currentLang === 'ar' ? 'en' : 'ar';
        currentLang = nextLang;
        localStorage.setItem(STORAGE_LANG, nextLang);
        document.querySelectorAll('#langToggleBtn .lang-label, #mobileLangToggleBtn .lang-label').forEach((lbl) => {
          lbl.textContent = nextLang === 'ar' ? 'EN' : 'عربي';
        });
        await applyTranslations(nextLang);
        updateThemeToggleUI();
      });
    });

    // Theme Toggle
    document.querySelectorAll('#themeToggleBtn, #mobileThemeToggleBtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    });

    // Mobile Drawer Navigation
    const menuToggle = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const drawerClose = document.getElementById('mobileNavClose');

    if (menuToggle && drawer) {
      menuToggle.addEventListener('click', () => {
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
      });
    }
    if (drawerClose && drawer) {
      drawerClose.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
      });
    }

    // Date Picker Filter Control (Fix 2 Part A)
    const datePicker = document.getElementById('dashboardDatePicker');
    const resetDateBtn = document.getElementById('resetDateFilterBtn');

    if (datePicker) {
      datePicker.addEventListener('change', () => {
        const val = datePicker.value;
        if (!val) return;
        currentSpecificDate = val;
        updateDateDisplay(val);
        if (resetDateBtn) resetDateBtn.style.display = 'inline-flex';

        // Deselect period tabs
        document.querySelectorAll('.period-btn').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });

        renderDashboard('custom_date', val);
      });
    }

    if (resetDateBtn) {
      resetDateBtn.addEventListener('click', () => {
        currentSpecificDate = null;
        if (datePicker) datePicker.value = '2026-10-30';
        updateDateDisplay('2026-10-30');
        resetDateBtn.style.display = 'none';

        document.querySelectorAll('.period-btn').forEach(b => {
          const isAll = b.getAttribute('data-period') === 'all';
          b.classList.toggle('is-active', isAll);
          b.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });

        renderDashboard('all');
      });
    }

    // Time-Period Selector Tabs (Fix 2 Parts B & C)
    document.querySelectorAll('.period-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-btn').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        const period = btn.getAttribute('data-period') || 'all';

        // Reset specific date filter when period is chosen
        currentSpecificDate = null;
        if (resetDateBtn) resetDateBtn.style.display = 'none';
        if (datePicker) datePicker.value = '2026-10-30';
        updateDateDisplay('2026-10-30');

        renderDashboard(period);
      });
    });

    // KPI Cards Click-To-Filter (Fix 3)
    document.querySelectorAll('.kpi-card[data-kpi-filter]').forEach(card => {
      const handleKpiFilter = () => {
        const filter = card.getAttribute('data-kpi-filter');
        if (filter === 'Total' || currentTableStatusFilter === filter) {
          applyTableStatusFilter('All', true);
        } else {
          applyTableStatusFilter(filter, true);
        }
      };

      card.addEventListener('click', handleKpiFilter);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleKpiFilter();
        }
      });
    });

    // Clear Table Filter Button (Fix 3 & Requirements 3 & 6)
    const clearTableBtn = document.getElementById('clearTableFilterBtn');
    if (clearTableBtn) {
      clearTableBtn.addEventListener('click', () => {
        resetRecentBookingsFilter();
      });
    }

    // Advanced Multi-Criteria Filter Controls (Requirements 3 & 6)
    setupBookingsFilterControls();

    // Company Identity Group Click (Fix 1B & Navigation)
    const headerIdentity = document.getElementById('companyHeaderIdentity');
    if (headerIdentity) {
      const handleProfileOpen = (e) => {
        e.preventDefault();
        const profileTrigger = document.querySelector('[data-company-section="profile"]');
        if (profileTrigger && profileTrigger !== headerIdentity) {
          profileTrigger.click();
        } else {
          const modal = document.getElementById('companyFutureModal');
          const titleEl = document.getElementById('futureModalTitle');
          const msgEl = document.getElementById('futureModalMessage');
          if (titleEl) {
            titleEl.textContent = currentLang === 'ar' ? 'بيانات الشركة — قيد التطوير' : 'Company Profile — Under Development';
          }
          if (msgEl) {
            msgEl.textContent = currentLang === 'ar'
              ? 'قسم بيانات الشركة وملف التراخيص قيد التطوير للمرحلة القادمة. يمكنك متابعة جميع العمليات من خلال لوحة التحكم.'
              : 'Company profile and licensing management is in development for the next phase. You can monitor all active operations via this operational dashboard.';
          }
          if (modal) {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
          }
        }
      };
      headerIdentity.addEventListener('click', handleProfileOpen);
      headerIdentity.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleProfileOpen(e);
        }
      });
    }

    // Logout Action
    document.querySelectorAll('#headerLogoutBtn, #mobileLogoutBtn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await apiFetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {}
        try {
          localStorage.removeItem('miqat_token');
          localStorage.removeItem('miqat_user');
        } catch (e) {}
        window.location.href = 'login.html';
      });
    });
  }

  // =========================================================================
  // PAGE DISPATCHER & BOOKINGS ENGINE (SECTION 2 & 3)
  // =========================================================================

  function renderCurrentPage() {
    const pageId = document.body ? document.body.dataset.pageId : '';
    if (pageId === 'company-dashboard') {
      renderDashboard(currentPeriod, currentSpecificDate);
    } else if (pageId === 'company-bookings') {
      renderBookingsPage();
    } else if (pageId === 'company-booking-details') {
      renderBookingDetailsPage();
    } else if (pageId === 'company-financial-overview') {
      renderFinancialOverviewPage();
    }
  }

  let bookingsFilterState = {
    search: '',
    program: '',
    dateFrom: '',
    dateTo: '',
    bookingStatus: '',
    paymentStatus: ''
  };

  const BOOKING_STATUS_MAP = {
    confirmed: { ar: 'مؤكد', en: 'Confirmed', class: 'status-confirmed' },
    new: { ar: 'جديد', en: 'New', class: 'status-new' },
    under_review: { ar: 'تحت الإجراء', en: 'Under Review', class: 'status-under_review' },
    pending: { ar: 'تحت الإجراء', en: 'Under Review', class: 'status-under_review' },
    rejected: { ar: 'مرفوض', en: 'Rejected', class: 'status-rejected' },
    cancelled: { ar: 'ملغي', en: 'Cancelled', class: 'status-cancelled' },
    changed: { ar: 'معدل', en: 'Changed', class: 'status-changed' }
  };

  const PAYMENT_STATUS_MAP = {
    fully_paid: { ar: 'مسدد بالكامل', en: 'Fully Paid', class: 'status-fully_paid' },
    paid: { ar: 'مسدد بالكامل', en: 'Fully Paid', class: 'status-fully_paid' },
    deposit_paid: { ar: 'مسدد الدفعة المقدمة', en: 'Deposit Paid', class: 'status-deposit_paid' },
    partially_paid: { ar: 'مسدد جزئياً', en: 'Partially Paid', class: 'status-partially_paid' },
    unpaid: { ar: 'غير مسدد', en: 'Unpaid', class: 'status-unpaid' },
    refund_pending: { ar: 'قيد استرداد المبلغ', en: 'Refund Pending', class: 'status-refund_pending' },
    refunded: { ar: 'مسترد', en: 'Refunded', class: 'status-refunded' }
  };

  function setupBookingsPage() {
    const searchInput = document.getElementById('bookingsSearchInput');
    const clearSearchBtn = document.getElementById('btnClearSearch');
    const progSelect = document.getElementById('filterProgramSelect');
    const dateFromInput = document.getElementById('filterDateFrom');
    const dateToInput = document.getElementById('filterDateTo');
    const bStatusSelect = document.getElementById('filterBookingStatusSelect');
    const pStatusSelect = document.getElementById('filterPaymentStatusSelect');
    const resetBtn = document.getElementById('btnResetAllFilters');
    const emptyResetBtn = document.getElementById('btnEmptyStateReset');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        bookingsFilterState.search = e.target.value.trim();
        if (clearSearchBtn) clearSearchBtn.style.display = bookingsFilterState.search ? 'flex' : 'none';
        renderBookingsPage();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        bookingsFilterState.search = '';
        clearSearchBtn.style.display = 'none';
        renderBookingsPage();
      });
    }

    if (progSelect) {
      progSelect.addEventListener('change', (e) => {
        bookingsFilterState.program = e.target.value;
        renderBookingsPage();
      });
    }

    if (dateFromInput) {
      dateFromInput.addEventListener('change', (e) => {
        bookingsFilterState.dateFrom = e.target.value;
        renderBookingsPage();
      });
    }

    if (dateToInput) {
      dateToInput.addEventListener('change', (e) => {
        bookingsFilterState.dateTo = e.target.value;
        renderBookingsPage();
      });
    }

    if (bStatusSelect) {
      bStatusSelect.addEventListener('change', (e) => {
        bookingsFilterState.bookingStatus = e.target.value;
        updateSummaryCardsActiveState(bookingsFilterState.bookingStatus);
        renderBookingsPage();
      });
    }

    if (pStatusSelect) {
      pStatusSelect.addEventListener('change', (e) => {
        bookingsFilterState.paymentStatus = e.target.value;
        renderBookingsPage();
      });
    }

    const resetHandler = () => {
      bookingsFilterState = {
        search: '',
        program: '',
        dateFrom: '',
        dateTo: '',
        bookingStatus: '',
        paymentStatus: ''
      };
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (progSelect) progSelect.value = '';
      if (dateFromInput) dateFromInput.value = '';
      if (dateToInput) dateToInput.value = '';
      if (bStatusSelect) bStatusSelect.value = '';
      if (pStatusSelect) pStatusSelect.value = '';
      updateSummaryCardsActiveState('all');
      renderBookingsPage();
    };

    if (resetBtn) resetBtn.addEventListener('click', resetHandler);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetHandler);

    // Bookings View Switcher (Table vs Cards)
    const btnTable = document.getElementById('btnViewTable');
    const btnCards = document.getElementById('btnViewCards');
    const wrapper = document.getElementById('bookingsWrapper');

    function setBookingsView(viewMode) {
      if (wrapper) wrapper.setAttribute('data-bookings-view', viewMode);
      if (btnTable) {
        const isActive = viewMode === 'table';
        btnTable.classList.toggle('is-active', isActive);
        btnTable.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
      if (btnCards) {
        const isActive = viewMode === 'cards';
        btnCards.classList.toggle('is-active', isActive);
        btnCards.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
      try {
        localStorage.setItem('miqat_bookings_view', viewMode);
      } catch (e) {}
    }

    if (btnTable) {
      btnTable.addEventListener('click', () => setBookingsView('table'));
    }
    if (btnCards) {
      btnCards.addEventListener('click', () => setBookingsView('cards'));
    }

    try {
      const savedView = localStorage.getItem('miqat_bookings_view');
      if (savedView === 'cards' || savedView === 'table') {
        setBookingsView(savedView);
      }
    } catch (e) {}

    // Summary Cards click actions
    document.querySelectorAll('.bookings-summary-card[data-summary-filter]').forEach(card => {
      const filterKey = card.getAttribute('data-summary-filter');
      const handleFilterClick = () => {
        if (filterKey === 'all') {
          bookingsFilterState.bookingStatus = '';
          if (bStatusSelect) bStatusSelect.value = '';
        } else {
          bookingsFilterState.bookingStatus = filterKey;
          if (bStatusSelect) bStatusSelect.value = filterKey;
        }
        updateSummaryCardsActiveState(filterKey);
        renderBookingsPage();
      };
      card.addEventListener('click', handleFilterClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFilterClick();
        }
      });
    });
  }

  function updateSummaryCardsActiveState(activeKey) {
    document.querySelectorAll('.bookings-summary-card[data-summary-filter]').forEach(c => {
      const key = c.getAttribute('data-summary-filter');
      const isMatch = (key === activeKey) || (!activeKey && key === 'all') || (activeKey === '' && key === 'all');
      c.classList.toggle('is-active-filter', isMatch);
      c.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  function renderBookingsPage() {
    if (document.body && document.body.dataset.pageId !== 'company-bookings') return;
    if (typeof window.MiqatCompanyMockData === 'undefined') return;

    const allBookings = window.MiqatCompanyMockData.RAW_BOOKINGS || [];
    const totalCount = allBookings.length;

    // 1. Calculate Summary Indicators from Authoritative Dataset
    let totalBookingsCount = totalCount;
    let newBookingsCount = 0;
    let confirmedBookingsCount = 0;
    let pendingBookingsCount = 0;

    allBookings.forEach(b => {
      const bSt = (b.bookingStatus || '').toLowerCase();
      const st = (b.status || '').toLowerCase();
      if (bSt === 'new' || st === 'new') newBookingsCount++;
      else if (bSt === 'confirmed' || st === 'confirmed') confirmedBookingsCount++;
      else if (bSt === 'under_review' || st === 'pending') pendingBookingsCount++;
    });

    const elSumTotal = document.getElementById('summaryTotalCount');
    const elSumNew = document.getElementById('summaryNewCount');
    const elSumConfirmed = document.getElementById('summaryConfirmedCount');
    const elSumPending = document.getElementById('summaryPendingCount');

    if (elSumTotal) elSumTotal.textContent = formatNumber(totalBookingsCount);
    if (elSumNew) elSumNew.textContent = formatNumber(newBookingsCount);
    if (elSumConfirmed) elSumConfirmed.textContent = formatNumber(confirmedBookingsCount);
    if (elSumPending) elSumPending.textContent = formatNumber(pendingBookingsCount);

    // 2. Multi-Filter AND Logic Evaluation
    const filteredBookings = window.MiqatCompanyMockData.getBookings(bookingsFilterState);
    const filteredCount = filteredBookings.length;

    // 3. Update Bookings Counter Badge
    const counterTextEl = document.getElementById('bookingsCounterText');
    if (counterTextEl) {
      if (currentLang === 'ar') {
        counterTextEl.innerHTML = `عرض <strong class="counter-highlight font-numeric">${formatNumber(filteredCount)}</strong> من أصل <strong class="counter-highlight font-numeric">${formatNumber(totalCount)}</strong> حجز`;
      } else {
        counterTextEl.innerHTML = `Showing <strong class="counter-highlight font-numeric">${formatNumber(filteredCount)}</strong> of <strong class="counter-highlight font-numeric">${formatNumber(totalCount)}</strong> bookings`;
      }
    }

    // 4. Update Active Filter Tags Chips Bar
    renderActiveFilterTags(totalCount);

    // 5. Render Bookings Table & Mobile Cards or Empty State
    const tbody = document.getElementById('bookingsTableTbody');
    const mobileList = document.getElementById('bookingsMobileCardsList');
    const emptyState = document.getElementById('bookingsEmptyState');
    const tableResponsive = document.querySelector('.bookings-table-responsive');

    if (filteredCount === 0) {
      if (tbody) tbody.innerHTML = '';
      if (mobileList) mobileList.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (tableResponsive) tableResponsive.style.display = 'none';
      if (mobileList) mobileList.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableResponsive) tableResponsive.style.display = '';
    if (mobileList) mobileList.style.display = '';

    let rowsHtml = '';
    let cardsHtml = '';

    filteredBookings.forEach(b => {
      const custName = currentLang === 'ar' ? b.customerName_ar : b.customerName_en;
      const progName = currentLang === 'ar' ? b.programName_ar : b.programName_en;

      const bStKey = (b.bookingStatus || (b.status === 'Pending' ? 'under_review' : b.status.toLowerCase())).toLowerCase();
      const bSt = BOOKING_STATUS_MAP[bStKey] || { ar: b.status, en: b.status, class: 'status-pending' };
      const bStatusLabel = currentLang === 'ar' ? bSt.ar : bSt.en;

      const pStKey = (b.paymentStatus || 'unpaid').toLowerCase();
      const pSt = PAYMENT_STATUS_MAP[pStKey] || { ar: pStKey, en: pStKey, class: 'status-unpaid' };
      const pStatusLabel = currentLang === 'ar' ? pSt.ar : pSt.en;

      const detailsUrl = `company-booking-details.html?id=${encodeURIComponent(b.id)}`;
      const viewDetailsText = currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details';

      // Table Row
      rowsHtml += `
        <tr tabindex="0" role="button" data-booking-url="${detailsUrl}" aria-label="${currentLang === 'ar' ? 'عرض تفاصيل الحجز ' + b.reference : 'View booking details for ' + b.reference}">
          <td><strong class="booking-ref-badge font-numeric">${b.reference}</strong></td>
          <td>
            <div class="customer-cell-wrap">
              <span class="customer-name-bold">${custName}</span>
              <span class="customer-phone-sub font-numeric">${b.customerPhone}</span>
            </div>
          </td>
          <td><span class="booking-program-name">${progName}</span></td>
          <td><span class="font-numeric">${b.bookingDate}</span></td>
          <td><strong class="price-main font-numeric">${formatCurrency(b.totalPrice)}</strong></td>
          <td><span class="paid-amount-cell font-numeric">${formatCurrency(b.paidAmount)}</span></td>
          <td><span class="remaining-amount-cell font-numeric">${formatCurrency(b.remainingAmount)}</span></td>
          <td><span class="status-pill ${bSt.class}">${bStatusLabel}</span></td>
          <td><span class="pay-status-pill ${pSt.class}">${pStatusLabel}</span></td>
          <td>
            <a href="${detailsUrl}" class="btn-row-details" onclick="event.stopPropagation();" title="${viewDetailsText}">
              <span>${viewDetailsText}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="rtl-flip" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </td>
        </tr>
      `;

      // Category & Travelers formatting
      const catLabel = currentLang === 'ar'
        ? (b.category === 'umrah' ? 'عمرة' : (b.category === 'hajj' ? 'حج' : (b.category || 'عمرة')))
        : (b.category === 'umrah' ? 'Umrah' : (b.category === 'hajj' ? 'Hajj' : (b.category || 'Umrah')));

      const travelersCountText = currentLang === 'ar'
        ? (b.travelers === 1 ? 'مسافر واحد' : (b.travelers === 2 ? 'مسافران' : `${b.travelers} مسافرين`))
        : `${b.travelers} ${b.travelers === 1 ? 'Traveler' : 'Travelers'}`;

      const lblCustomer = currentLang === 'ar' ? 'العميل:' : 'Customer:';
      const lblPhone = currentLang === 'ar' ? 'الهاتف:' : 'Phone:';
      const lblProgram = currentLang === 'ar' ? 'البرنامج:' : 'Program:';
      const lblTotalPrice = currentLang === 'ar' ? 'إجمالي السعر:' : 'Total Price:';
      const lblPaidAmount = currentLang === 'ar' ? 'المبلغ المدفوع:' : 'Paid Amount:';
      const lblRemainingAmount = currentLang === 'ar' ? 'المبلغ المتبقي:' : 'Remaining Amount:';

      const cardAria = currentLang === 'ar' 
        ? `عرض تفاصيل الحجز ${b.reference}` 
        : `View booking details for ${b.reference}`;

      // Card Layout displaying ALL booking fields
      cardsHtml += `
        <article class="booking-card booking-mobile-card" tabindex="0" role="button" data-booking-url="${detailsUrl}" aria-label="${cardAria}">
          <div class="card-top-row booking-card-header">
            <strong class="booking-ref-badge font-numeric">${b.reference}</strong>
            <div class="card-status-badges">
              <span class="status-pill ${bSt.class}">${bStatusLabel}</span>
              <span class="pay-status-pill ${pSt.class}">${pStatusLabel}</span>
            </div>
          </div>
          
          <div class="booking-card-body">
            <!-- Customer Row -->
            <div class="card-entity-row card-customer-row">
              <div class="card-entity-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div class="card-entity-content">
                <div class="card-customer-header">
                  <span class="card-entity-label">${lblCustomer}</span>
                  <strong class="card-customer-name">${custName}</strong>
                </div>
                <div class="card-customer-phone-wrap">
                  <span class="card-entity-label">${lblPhone}</span>
                  <span class="card-customer-phone font-numeric" dir="ltr">${b.customerPhone}</span>
                </div>
              </div>
            </div>

            <!-- Program Row & Meta Chips -->
            <div class="card-entity-row card-program-row">
              <div class="card-entity-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <div class="card-entity-content">
                <div class="card-program-header">
                  <span class="card-entity-label">${lblProgram}</span>
                  <span class="card-program-title">${progName}</span>
                </div>
                <div class="card-meta-chips-group">
                  <span class="card-meta-chip category-chip">${catLabel}</span>
                  <span class="card-meta-chip travelers-chip">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <span>${travelersCountText}</span>
                  </span>
                  <span class="card-meta-chip date-chip">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span class="font-numeric">${b.bookingDate}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Financial Breakdown Box -->
            <div class="card-financial-box">
              <div class="fin-item">
                <span class="fin-label">${lblTotalPrice}</span>
                <strong class="fin-val font-numeric">${formatCurrency(b.totalPrice)}</strong>
              </div>
              <div class="fin-item">
                <span class="fin-label">${lblPaidAmount}</span>
                <span class="fin-val fin-paid paid-amount-cell font-numeric">${formatCurrency(b.paidAmount)}</span>
              </div>
              <div class="fin-item">
                <span class="fin-label">${lblRemainingAmount}</span>
                <span class="fin-val fin-remaining remaining-amount-cell font-numeric">${formatCurrency(b.remainingAmount)}</span>
              </div>
            </div>
          </div>

          <!-- Card Footer Action -->
          <div class="booking-card-footer">
            <a href="${detailsUrl}" class="btn-row-details btn-card-details" onclick="event.stopPropagation();" title="${viewDetailsText}">
              <span>${viewDetailsText}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="rtl-flip" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </article>
      `;
    });

    if (tbody) tbody.innerHTML = rowsHtml;
    if (mobileList) mobileList.innerHTML = cardsHtml;

    // Attach row/card navigation handlers
    document.querySelectorAll('[data-booking-url]').forEach(el => {
      const url = el.getAttribute('data-booking-url');
      const navigateToDetails = () => {
        window.location.href = url;
      };
      el.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        navigateToDetails();
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a') || e.target.closest('button')) return;
          e.preventDefault();
          navigateToDetails();
        }
      });
    });
  }

  function renderActiveFilterTags(totalCount) {
    const bar = document.getElementById('activeFilterTagsBar');
    const container = document.getElementById('activeFilterTagsContainer');
    if (!bar || !container) return;

    const tags = [];

    if (bookingsFilterState.search) {
      tags.push({
        label: `${currentLang === 'ar' ? 'بحث' : 'Search'}: "${bookingsFilterState.search}"`,
        clear: () => {
          bookingsFilterState.search = '';
          const inp = document.getElementById('bookingsSearchInput');
          const clr = document.getElementById('btnClearSearch');
          if (inp) inp.value = '';
          if (clr) clr.style.display = 'none';
        }
      });
    }

    if (bookingsFilterState.program) {
      const progObj = (window.MiqatCompanyMockData.PROGRAMS || []).find(p => p.id === bookingsFilterState.program);
      const progName = progObj ? (currentLang === 'ar' ? progObj.name_ar : progObj.name_en) : bookingsFilterState.program;
      tags.push({
        label: `${currentLang === 'ar' ? 'البرنامج' : 'Program'}: ${progName}`,
        clear: () => {
          bookingsFilterState.program = '';
          const sel = document.getElementById('filterProgramSelect');
          if (sel) sel.value = '';
        }
      });
    }

    if (bookingsFilterState.dateFrom) {
      tags.push({
        label: `${currentLang === 'ar' ? 'من' : 'From'}: ${bookingsFilterState.dateFrom}`,
        clear: () => {
          bookingsFilterState.dateFrom = '';
          const inp = document.getElementById('filterDateFrom');
          if (inp) inp.value = '';
        }
      });
    }

    if (bookingsFilterState.dateTo) {
      tags.push({
        label: `${currentLang === 'ar' ? 'إلى' : 'To'}: ${bookingsFilterState.dateTo}`,
        clear: () => {
          bookingsFilterState.dateTo = '';
          const inp = document.getElementById('filterDateTo');
          if (inp) inp.value = '';
        }
      });
    }

    if (bookingsFilterState.bookingStatus) {
      const bStKey = bookingsFilterState.bookingStatus.toLowerCase();
      const bSt = BOOKING_STATUS_MAP[bStKey];
      const bLabel = bSt ? (currentLang === 'ar' ? bSt.ar : bSt.en) : bookingsFilterState.bookingStatus;
      tags.push({
        label: `${currentLang === 'ar' ? 'حالة الحجز' : 'Booking Status'}: ${bLabel}`,
        clear: () => {
          bookingsFilterState.bookingStatus = '';
          const sel = document.getElementById('filterBookingStatusSelect');
          if (sel) sel.value = '';
          updateSummaryCardsActiveState('all');
        }
      });
    }

    if (bookingsFilterState.paymentStatus) {
      const pStKey = bookingsFilterState.paymentStatus.toLowerCase();
      const pSt = PAYMENT_STATUS_MAP[pStKey];
      const pLabel = pSt ? (currentLang === 'ar' ? pSt.ar : pSt.en) : bookingsFilterState.paymentStatus;
      tags.push({
        label: `${currentLang === 'ar' ? 'حالة السداد' : 'Payment Status'}: ${pLabel}`,
        clear: () => {
          bookingsFilterState.paymentStatus = '';
          const sel = document.getElementById('filterPaymentStatusSelect');
          if (sel) sel.value = '';
        }
      });
    }

    if (tags.length === 0) {
      bar.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    bar.style.display = 'flex';
    container.innerHTML = '';

    tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'active-filter-tag-chip';
      chip.innerHTML = `
        <span>${t.label}</span>
        <button type="button" aria-label="${currentLang === 'ar' ? 'إزالة التصفية' : 'Remove filter'}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      chip.querySelector('button').addEventListener('click', () => {
        t.clear();
        renderBookingsPage();
      });
      container.appendChild(chip);
    });
  }

  // =========================================================================
  // BOOKING DETAILS PAGE ENGINE (SECTION 5)
  // =========================================================================
  // =========================================================================
  // TOAST NOTIFICATIONS HELPER
  // =========================================================================
  function showCompanyToast(message, type = 'success') {
    let container = document.getElementById('companyToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'companyToastContainer';
      container.className = 'company-toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `company-toast toast-${type}`;
    
    const iconSvg = type === 'success'
      ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-accent); flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-error); flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  }

  function openCompanyActionModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 60);
    }
  }

  function closeCompanyActionModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  // =========================================================================
  // BOOKING DETAILS: SETUP & INTERACTIVITY
  // =========================================================================
  function setupBookingDetailsPage() {
    if (document.body && document.body.dataset.pageId !== 'company-booking-details') return;

    // Helper to get active booking
    function getActiveBooking() {
      const params = new URLSearchParams(window.location.search);
      const targetIdOrRef = params.get('id') || params.get('ref') || 'bkg_1000';
      return window.MiqatCompanyMockData ? window.MiqatCompanyMockData.getBookingById(targetIdOrRef) : null;
    }

    // Modal Close Triggers
    const modalClosers = [
      { btn: 'btnCloseConfirmModal', modal: 'modalConfirmBooking' },
      { btn: 'btnCancelConfirm', modal: 'modalConfirmBooking' },
      { btn: 'backdropConfirmBooking', modal: 'modalConfirmBooking' },
      { btn: 'btnCloseReportModal', modal: 'modalReportPayment' },
      { btn: 'btnCancelReportPayment', modal: 'modalReportPayment' },
      { btn: 'backdropReportPayment', modal: 'modalReportPayment' },
      { btn: 'btnCloseRejectModal', modal: 'modalRejectBooking' },
      { btn: 'btnCancelRejectBooking', modal: 'modalRejectBooking' },
      { btn: 'backdropRejectBooking', modal: 'modalRejectBooking' },
      { btn: 'btnCloseChangeModal', modal: 'modalRequestProgramChange' },
      { btn: 'btnCancelRequestChange', modal: 'modalRequestProgramChange' },
      { btn: 'backdropRequestChange', modal: 'modalRequestProgramChange' }
    ];

    modalClosers.forEach(item => {
      const el = document.getElementById(item.btn);
      if (el) {
        el.addEventListener('click', () => closeCompanyActionModal(item.modal));
      }
    });

    // Escape Key Handler for All Action Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ['modalConfirmBooking', 'modalReportPayment', 'modalRejectBooking', 'modalRequestProgramChange'].forEach(id => {
          closeCompanyActionModal(id);
        });
      }
    });

    // 1. CONFIRM BOOKING MODAL & ACTION
    const btnActionConfirm = document.getElementById('btnActionConfirm');
    if (btnActionConfirm) {
      btnActionConfirm.addEventListener('click', () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const refEl = document.getElementById('modalConfirmRef');
        const custEl = document.getElementById('modalConfirmCustomer');
        const progEl = document.getElementById('modalConfirmProgram');

        if (refEl) refEl.textContent = booking.reference;
        if (custEl) custEl.textContent = currentLang === 'ar' ? booking.customerName_ar : booking.customerName_en;
        if (progEl) progEl.textContent = currentLang === 'ar' ? booking.programName_ar : booking.programName_en;

        openCompanyActionModal('modalConfirmBooking');
      });
    }

    const btnSubmitConfirmBooking = document.getElementById('btnSubmitConfirmBooking');
    if (btnSubmitConfirmBooking) {
      btnSubmitConfirmBooking.addEventListener('click', async () => {
        const booking = getActiveBooking();
        if (!booking) return;

        btnSubmitConfirmBooking.disabled = true;
        try {
          let updatedBooking = null;
          try {
            const resp = await fetch(`/api/company/bookings/${encodeURIComponent(booking.id)}/confirm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            if (resp.ok) {
              const data = await resp.json();
              if (data.success && data.booking) updatedBooking = data.booking;
            }
          } catch (netErr) {
            console.warn('API call failed, using client mock mutation fallback:', netErr);
          }

          if (!updatedBooking && window.MiqatCompanyMockData) {
            const res = window.MiqatCompanyMockData.confirmBooking(booking.id, currentCompanyUser);
            if (res.success) updatedBooking = res.booking;
          }

          closeCompanyActionModal('modalConfirmBooking');
          const msg = getTranslation('company.toast_confirm_success') || (currentLang === 'ar' ? 'تم تأكيد واعتماد الحجز وإشعار العميل بنجاح' : 'Booking successfully confirmed and certified');
          showCompanyToast(msg, 'success');
          renderBookingDetailsPage();
        } catch (err) {
          console.error('Error confirming booking:', err);
          showCompanyToast(getTranslation('company.toast_action_error') || 'حدث خطأ أثناء تنفيذ الإجراء', 'error');
        } finally {
          btnSubmitConfirmBooking.disabled = false;
        }
      });
    }

    // 2. REPORT PAYMENT MODAL & ACTION
    const btnActionReportPayment = document.getElementById('btnActionReportPayment');
    if (btnActionReportPayment) {
      btnActionReportPayment.addEventListener('click', () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const amountInput = document.getElementById('reportPaymentAmount');
        const dateInput = document.getElementById('reportPaymentDate');
        const refInput = document.getElementById('reportPaymentRef');
        const notesInput = document.getElementById('reportPaymentNotes');

        if (amountInput) {
          amountInput.value = booking.remainingAmount > 0 ? booking.remainingAmount : '';
          amountInput.max = booking.remainingAmount;
        }
        if (dateInput) {
          dateInput.value = new Date().toISOString().split('T')[0];
        }
        if (refInput) {
          refInput.value = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (notesInput) {
          notesInput.value = '';
        }

        openCompanyActionModal('modalReportPayment');
      });
    }

    const btnSubmitReportPayment = document.getElementById('btnSubmitReportPayment');
    if (btnSubmitReportPayment) {
      btnSubmitReportPayment.addEventListener('click', async () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const amountInput = document.getElementById('reportPaymentAmount');
        const dateInput = document.getElementById('reportPaymentDate');
        const methodSelect = document.getElementById('reportPaymentMethod');
        const refInput = document.getElementById('reportPaymentRef');
        const notesInput = document.getElementById('reportPaymentNotes');

        const amount = parseFloat(amountInput ? amountInput.value : 0);
        if (isNaN(amount) || amount <= 0) {
          alert(currentLang === 'ar' ? 'يرجى إدخال مبلغ صحيح أكبر من الصفر' : 'Please enter a valid amount greater than zero');
          if (amountInput) amountInput.focus();
          return;
        }
        if (amount > booking.remainingAmount) {
          alert(currentLang === 'ar' ? `المبلغ المدخل (${amount}) يتجاوز المتبقي المطلوب (${booking.remainingAmount})` : `Entered amount exceeds remaining balance (${booking.remainingAmount})`);
          if (amountInput) amountInput.focus();
          return;
        }

        const payload = {
          amount: amount,
          date: dateInput && dateInput.value ? dateInput.value : new Date().toISOString().split('T')[0],
          method: methodSelect ? methodSelect.value : 'cash',
          reference: refInput && refInput.value ? refInput.value.trim() : `REC-${Date.now()}`,
          notes: notesInput ? notesInput.value.trim() : ''
        };

        btnSubmitReportPayment.disabled = true;
        try {
          let updatedBooking = null;
          try {
            const resp = await fetch(`/api/company/bookings/${encodeURIComponent(booking.id)}/report-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (resp.ok) {
              const data = await resp.json();
              if (data.success && data.booking) updatedBooking = data.booking;
            }
          } catch (netErr) {
            console.warn('API call failed, using client mock mutation fallback:', netErr);
          }

          if (!updatedBooking && window.MiqatCompanyMockData) {
            const res = window.MiqatCompanyMockData.reportPayment(booking.id, payload, currentCompanyUser);
            if (res.success) updatedBooking = res.booking;
          }

          closeCompanyActionModal('modalReportPayment');
          const msg = getTranslation('company.toast_report_success') || (currentLang === 'ar' ? 'تم تسجيل الدفعة النقدية بنجاح وإضافتها إلى سجل الحجز' : 'Payment successfully recorded');
          showCompanyToast(msg, 'success');
          renderBookingDetailsPage();
        } catch (err) {
          console.error('Error reporting payment:', err);
          showCompanyToast(getTranslation('company.toast_action_error') || 'حدث خطأ أثناء تسجيل الدفعة', 'error');
        } finally {
          btnSubmitReportPayment.disabled = false;
        }
      });
    }

    // 3. REJECT BOOKING MODAL & ACTION
    const btnActionReject = document.getElementById('btnActionReject');
    if (btnActionReject) {
      btnActionReject.addEventListener('click', () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const reasonSelect = document.getElementById('rejectBookingReason');
        const notesInput = document.getElementById('rejectBookingNotes');

        if (reasonSelect) reasonSelect.value = '';
        if (notesInput) notesInput.value = '';

        openCompanyActionModal('modalRejectBooking');
      });
    }

    const btnSubmitRejectBooking = document.getElementById('btnSubmitRejectBooking');
    if (btnSubmitRejectBooking) {
      btnSubmitRejectBooking.addEventListener('click', async () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const reasonSelect = document.getElementById('rejectBookingReason');
        const notesInput = document.getElementById('rejectBookingNotes');

        if (!reasonSelect || !reasonSelect.value) {
          alert(currentLang === 'ar' ? 'يرجى اختيار سبب الرفض الإلزامي' : 'Please select a mandatory rejection reason');
          if (reasonSelect) reasonSelect.focus();
          return;
        }

        const payload = {
          reason: reasonSelect.value,
          notes: notesInput ? notesInput.value.trim() : ''
        };

        btnSubmitRejectBooking.disabled = true;
        try {
          let updatedBooking = null;
          try {
            const resp = await fetch(`/api/company/bookings/${encodeURIComponent(booking.id)}/reject`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (resp.ok) {
              const data = await resp.json();
              if (data.success && data.booking) updatedBooking = data.booking;
            }
          } catch (netErr) {
            console.warn('API call failed, using client mock mutation fallback:', netErr);
          }

          if (!updatedBooking && window.MiqatCompanyMockData) {
            const res = window.MiqatCompanyMockData.rejectBooking(booking.id, payload, currentCompanyUser);
            if (res.success) updatedBooking = res.booking;
          }

          closeCompanyActionModal('modalRejectBooking');
          const msg = getTranslation('company.toast_reject_success') || (currentLang === 'ar' ? 'تم تسجيل رفض الحجز وتحويل الملف للمراجعة المالية' : 'Booking rejected and flagged for refund review');
          showCompanyToast(msg, 'success');
          renderBookingDetailsPage();
        } catch (err) {
          console.error('Error rejecting booking:', err);
          showCompanyToast(getTranslation('company.toast_action_error') || 'حدث خطأ أثناء رفض الحجز', 'error');
        } finally {
          btnSubmitRejectBooking.disabled = false;
        }
      });
    }

    // 4. REQUEST PROGRAM CHANGE MODAL & ACTION
    const btnActionRequestChange = document.getElementById('btnActionRequestChange');
    if (btnActionRequestChange) {
      btnActionRequestChange.addEventListener('click', () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const currentProgEl = document.getElementById('changeCurrentProgramName');
        const progSelect = document.getElementById('changeReplacementProgramSelect');
        const priceInput = document.getElementById('changeProposedPriceInput');
        const varianceEl = document.getElementById('changePriceVarianceDisplay');
        const reasonInput = document.getElementById('changeReasonNotes');

        if (currentProgEl) {
          currentProgEl.textContent = currentLang === 'ar' ? booking.programName_ar : booking.programName_en;
        }

        if (progSelect && window.MiqatCompanyMockData && window.MiqatCompanyMockData.PROGRAMS) {
          progSelect.innerHTML = '';
          window.MiqatCompanyMockData.PROGRAMS.forEach(prog => {
            const opt = document.createElement('option');
            opt.value = prog.id;
            const progName = currentLang === 'ar' ? prog.name_ar : prog.name_en;
            const estPrice = prog.unitPrice * (booking.travelers || 1);
            opt.textContent = `${progName} — (${formatCurrency(estPrice)})`;
            opt.dataset.unitPrice = prog.unitPrice;
            if (prog.id === booking.programId) {
              opt.textContent += currentLang === 'ar' ? ' [البرنامج الحالي]' : ' [Current]';
            }
            progSelect.appendChild(opt);
          });
        }

        // Set initial proposed price
        const initialPrice = booking.totalPrice;
        if (priceInput) {
          priceInput.value = initialPrice;
        }

        function updateVariance() {
          const newPrice = parseFloat(priceInput ? priceInput.value : 0) || 0;
          const diff = newPrice - (booking.totalPrice || 0);
          if (varianceEl) {
            if (diff > 0) {
              varianceEl.textContent = `+${formatCurrency(diff)}`;
              varianceEl.style.color = 'var(--color-primary)';
            } else if (diff < 0) {
              varianceEl.textContent = formatCurrency(diff);
              varianceEl.style.color = 'var(--color-accent)';
            } else {
              varianceEl.textContent = formatCurrency(0);
              varianceEl.style.color = 'var(--color-text-muted)';
            }
          }
        }

        if (progSelect) {
          progSelect.onchange = () => {
            const selectedOpt = progSelect.selectedOptions[0];
            if (selectedOpt && selectedOpt.dataset.unitPrice && priceInput) {
              const uPrice = parseFloat(selectedOpt.dataset.unitPrice);
              priceInput.value = uPrice * (booking.travelers || 1);
              updateVariance();
            }
          };
        }

        if (priceInput) {
          priceInput.oninput = updateVariance;
        }

        if (reasonInput) reasonInput.value = '';
        updateVariance();

        openCompanyActionModal('modalRequestProgramChange');
      });
    }

    const btnSubmitRequestChange = document.getElementById('btnSubmitRequestChange');
    if (btnSubmitRequestChange) {
      btnSubmitRequestChange.addEventListener('click', async () => {
        const booking = getActiveBooking();
        if (!booking) return;

        const progSelect = document.getElementById('changeReplacementProgramSelect');
        const priceInput = document.getElementById('changeProposedPriceInput');
        const reasonInput = document.getElementById('changeReasonNotes');

        const replacementProgramId = progSelect ? progSelect.value : '';
        const newPrice = parseFloat(priceInput ? priceInput.value : 0);

        if (!replacementProgramId) {
          alert(currentLang === 'ar' ? 'يرجى اختيار البرنامج البديل المقترح' : 'Please select proposed replacement program');
          return;
        }
        if (isNaN(newPrice) || newPrice < 0) {
          alert(currentLang === 'ar' ? 'يرجى إدخال سعر مقترح صحيح' : 'Please enter a valid proposed price');
          if (priceInput) priceInput.focus();
          return;
        }

        const payload = {
          replacementProgramId: replacementProgramId,
          newPrice: newPrice,
          reason: reasonInput ? reasonInput.value.trim() : ''
        };

        btnSubmitRequestChange.disabled = true;
        try {
          let updatedBooking = null;
          try {
            const resp = await fetch(`/api/company/bookings/${encodeURIComponent(booking.id)}/request-program-change`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (resp.ok) {
              const data = await resp.json();
              if (data.success && data.booking) updatedBooking = data.booking;
            }
          } catch (netErr) {
            console.warn('API call failed, using client mock mutation fallback:', netErr);
          }

          if (!updatedBooking && window.MiqatCompanyMockData) {
            const res = window.MiqatCompanyMockData.requestProgramChange(booking.id, payload, currentCompanyUser);
            if (res.success) updatedBooking = res.booking;
          }

          closeCompanyActionModal('modalRequestProgramChange');
          const msg = getTranslation('company.toast_change_success') || (currentLang === 'ar' ? 'تم إرسال مقترح تعديل البرنامج بانتظار موافقة العميل' : 'Program change request submitted for customer agreement');
          showCompanyToast(msg, 'success');
          renderBookingDetailsPage();
        } catch (err) {
          console.error('Error submitting program change:', err);
          showCompanyToast(getTranslation('company.toast_action_error') || 'حدث خطأ أثناء إرسال مقترح التعديل', 'error');
        } finally {
          btnSubmitRequestChange.disabled = false;
        }
      });
    }
  }

  // =========================================================================
  // BOOKING DETAILS: FULL PROFESSIONAL RENDER
  // =========================================================================
  function renderBookingDetailsPage() {
    if (document.body && document.body.dataset.pageId !== 'company-booking-details') return;
    if (typeof window.MiqatCompanyMockData === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const targetIdOrRef = params.get('id') || params.get('ref') || 'bkg_1000';

    const booking = window.MiqatCompanyMockData.getBookingById(targetIdOrRef);

    const mainLayout = document.getElementById('bookingDetailsMainLayout');
    const kpiBar = document.querySelector('.details-kpi-bar');
    const headerSec = document.querySelector('.booking-details-header');
    const breadcrumbs = document.querySelector('.details-breadcrumbs');
    const notFoundState = document.getElementById('bookingNotFoundState');

    if (!booking) {
      if (mainLayout) mainLayout.style.display = 'none';
      if (kpiBar) kpiBar.style.display = 'none';
      if (headerSec) headerSec.style.display = 'none';
      if (breadcrumbs) breadcrumbs.style.display = 'none';
      if (notFoundState) notFoundState.style.display = 'block';
      return;
    }

    if (mainLayout) mainLayout.style.display = 'grid';
    if (kpiBar) kpiBar.style.display = 'grid';
    if (headerSec) headerSec.style.display = 'flex';
    if (breadcrumbs) breadcrumbs.style.display = 'flex';
    if (notFoundState) notFoundState.style.display = 'none';

    // Status Mappings
    const bStKey = (booking.bookingStatus || (booking.status === 'Pending' ? 'under_review' : booking.status.toLowerCase())).toLowerCase();
    const bSt = BOOKING_STATUS_MAP[bStKey] || { ar: booking.status, en: booking.status, class: 'status-pending' };

    const pStKey = (booking.paymentStatus || 'unpaid').toLowerCase();
    const pSt = PAYMENT_STATUS_MAP[pStKey] || { ar: pStKey, en: pStKey, class: 'status-unpaid' };

    // 1. Breadcrumbs & Reference Badges
    const breadcrumbRef = document.getElementById('breadcrumbRef');
    const elRef = document.getElementById('detailsBookingRef');
    if (breadcrumbRef) breadcrumbRef.textContent = booking.reference;
    if (elRef) elRef.textContent = booking.reference;

    // 2. Status Pills in Header
    const elStatusPill = document.getElementById('detailsBookingStatusPill');
    const elPayPill = document.getElementById('detailsPaymentStatusPill');
    if (elStatusPill) {
      elStatusPill.textContent = currentLang === 'ar' ? bSt.ar : bSt.en;
      elStatusPill.className = `status-pill ${bSt.class}`;
    }
    if (elPayPill) {
      elPayPill.textContent = currentLang === 'ar' ? pSt.ar : pSt.en;
      elPayPill.className = `pay-status-pill ${pSt.class}`;
    }

    // 3. Quick Indicators KPI Bar
    const kpiTotal = document.getElementById('detailsKpiTotal');
    const kpiPaid = document.getElementById('detailsKpiPaid');
    const kpiRemaining = document.getElementById('detailsKpiRemaining');
    const kpiTravelers = document.getElementById('detailsKpiTravelers');

    if (kpiTotal) kpiTotal.textContent = formatCurrency(booking.totalPrice);
    if (kpiPaid) kpiPaid.textContent = formatCurrency(booking.paidAmount);
    if (kpiRemaining) kpiRemaining.textContent = formatCurrency(booking.remainingAmount);
    if (kpiTravelers) kpiTravelers.textContent = `${booking.travelers} ${currentLang === 'ar' ? 'أفراد' : 'travelers'}`;

    // 4. Customer Information Card
    const elCustName = document.getElementById('detailsCustomerName');
    const elCustId = document.getElementById('detailsCustomerId');
    const elCustPhone = document.getElementById('detailsCustomerPhone');
    const elCustWhatsapp = document.getElementById('detailsCustomerWhatsapp');
    const elCustEmail = document.getElementById('detailsCustomerEmail');
    const elCustGov = document.getElementById('detailsCustomerGov');
    const elBookingDate = document.getElementById('detailsBookingDate');

    const custName = currentLang === 'ar' ? booking.customerName_ar : booking.customerName_en;
    if (elCustName) elCustName.textContent = custName;
    if (elCustId) elCustId.textContent = booking.customerId;

    const rawPhone = booking.customerPhone || '+20 100 000 0000';
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const cleanPhone = cleanDigits.startsWith('0') ? '2' + cleanDigits : (cleanDigits.startsWith('2') ? cleanDigits : '20' + cleanDigits);

    if (elCustPhone) {
      const phoneTextSpan = elCustPhone.querySelector('span') || elCustPhone;
      phoneTextSpan.textContent = rawPhone;
      elCustPhone.href = `tel:${rawPhone.replace(/\s+/g, '')}`;
    }

    if (elCustWhatsapp) {
      const waPhone = booking.customerWhatsapp || rawPhone;
      const waTextSpan = elCustWhatsapp.querySelector('span') || elCustWhatsapp;
      waTextSpan.textContent = waPhone;
      elCustWhatsapp.href = `https://wa.me/${cleanPhone}`;
    }

    if (elCustEmail) {
      const email = booking.customerEmail || `${booking.customerId.toLowerCase()}@customer.miqat.me`;
      const emailTextSpan = elCustEmail.querySelector('span') || elCustEmail;
      emailTextSpan.textContent = email;
      elCustEmail.href = `mailto:${email}`;
    }

    if (elCustGov) {
      elCustGov.textContent = currentLang === 'ar'
        ? (booking.customerGovernorate_ar || 'القاهرة')
        : (booking.customerGovernorate_en || 'Cairo');
    }

    if (elBookingDate) elBookingDate.textContent = booking.bookingDate;

    // 5. Program & Trip Information Card
    const elProgName = document.getElementById('detailsProgramName');
    const elCategory = document.getElementById('detailsCategory');
    const elTripType = document.getElementById('detailsTripType');
    const elTravelers = document.getElementById('detailsTravelers');
    const elUnitPrice = document.getElementById('detailsUnitPrice');
    const elDepDate = document.getElementById('detailsDepartureDate');
    const elRetDate = document.getElementById('detailsReturnDate');
    const elHotelMakkah = document.getElementById('detailsHotelMakkah');
    const elHotelMadinah = document.getElementById('detailsHotelMadinah');
    const elRoomType = document.getElementById('detailsRoomType');
    const elSpecialReq = document.getElementById('detailsSpecialRequests');

    const progName = currentLang === 'ar' ? booking.programName_ar : booking.programName_en;
    if (elProgName) elProgName.textContent = progName;

    if (elCategory) {
      const isUmrah = booking.category === 'umrah';
      elCategory.textContent = isUmrah
        ? (currentLang === 'ar' ? 'برامج العمرة' : 'Umrah Programs')
        : (currentLang === 'ar' ? 'برامج الحج' : 'Hajj Programs');
    }

    if (elTripType) {
      elTripType.textContent = currentLang === 'ar'
        ? (booking.tripType_ar || 'طيران مباشر')
        : (booking.tripType_en || 'Direct Flight');
    }

    if (elTravelers) elTravelers.textContent = `${booking.travelers} ${currentLang === 'ar' ? 'أفراد' : 'travelers'}`;
    if (elUnitPrice) elUnitPrice.textContent = formatCurrency(booking.unitPrice);
    if (elDepDate) elDepDate.textContent = booking.departureDate || booking.bookingDate;
    if (elRetDate) elRetDate.textContent = booking.returnDate || '--';

    if (elHotelMakkah) {
      elHotelMakkah.textContent = currentLang === 'ar'
        ? (booking.hotelMakkah_ar || 'سويس أوتيل مكة (5 نجوم)')
        : (booking.hotelMakkah_en || 'Swissôtel Makkah (5-Star)');
    }

    if (elHotelMadinah) {
      elHotelMadinah.textContent = currentLang === 'ar'
        ? (booking.hotelMadinah_ar || 'دار التقوى المدينة (5 نجوم)')
        : (booking.hotelMadinah_en || 'Dar Al Taqwa Madinah (5-Star)');
    }

    if (elRoomType) {
      elRoomType.textContent = currentLang === 'ar'
        ? (booking.roomType_ar || 'غرفة ثنائية مطلة')
        : (booking.roomType_en || 'Double Room with View');
    }

    if (elSpecialReq) {
      elSpecialReq.textContent = currentLang === 'ar'
        ? (booking.specialRequests_ar || 'لا توجد طلبات خاصة مسجلة.')
        : (booking.specialRequests_en || 'No special requests recorded.');
    }

    // Proposed Program Change Banner
    const bannerChange = document.getElementById('detailsProposedChangeBanner');
    const proposedProgEl = document.getElementById('proposedProgramName');
    const proposedPriceEl = document.getElementById('proposedProgramPrice');

    if (bannerChange) {
      if (booking.proposedChange && booking.proposedChange.status === 'pending_customer_agreement') {
        bannerChange.style.display = 'block';
        if (proposedProgEl) {
          proposedProgEl.textContent = currentLang === 'ar'
            ? (booking.proposedChange.programName_ar || booking.proposedChange.replacementProgramId)
            : (booking.proposedChange.programName_en || booking.proposedChange.replacementProgramId);
        }
        if (proposedPriceEl) {
          proposedPriceEl.textContent = formatCurrency(booking.proposedChange.newPrice);
        }
      } else {
        bannerChange.style.display = 'none';
      }
    }

    // 6. Financial Summary & Progress Card
    const elTotalPrice = document.getElementById('detailsTotalPrice');
    const elPaidAmount = document.getElementById('detailsPaidAmount');
    const elRemainingAmount = document.getElementById('detailsRemainingAmount');
    const elPayStatusText = document.getElementById('detailsPaymentStatusText');
    const elProgressPct = document.getElementById('detailsPaymentProgressPct');
    const elProgressFill = document.getElementById('detailsPaymentProgressFill');

    if (elTotalPrice) elTotalPrice.textContent = formatCurrency(booking.totalPrice);
    if (elPaidAmount) elPaidAmount.textContent = formatCurrency(booking.paidAmount);
    if (elRemainingAmount) elRemainingAmount.textContent = formatCurrency(booking.remainingAmount);
    if (elPayStatusText) elPayStatusText.textContent = currentLang === 'ar' ? pSt.ar : pSt.en;

    const paidPct = Math.min(100, Math.max(0, Math.round((booking.paidAmount / (booking.totalPrice || 1)) * 100)));
    if (elProgressPct) elProgressPct.textContent = `${paidPct}%`;
    if (elProgressFill) elProgressFill.style.width = `${paidPct}%`;

    // 7. Payment History and Itemized Transactions Table
    const paymentsTbody = document.getElementById('paymentsTableBody');
    const paymentsEmpty = document.getElementById('paymentsEmptyState');
    const paymentsTable = document.getElementById('paymentsTable');

    if (paymentsTbody) {
      paymentsTbody.innerHTML = '';
      if (booking.payments && booking.payments.length > 0) {
        if (paymentsTable) paymentsTable.style.display = 'table';
        if (paymentsEmpty) paymentsEmpty.style.display = 'none';

        booking.payments.forEach(pay => {
          const tr = document.createElement('tr');
          
          const methodLabel = pay.method === 'gateway' ? (currentLang === 'ar' ? 'بوابة ميقات الإلكترونية' : 'Miqat Online Gateway')
            : pay.method === 'bank_deposit' ? (currentLang === 'ar' ? 'إيداع بنكي' : 'Bank Deposit')
            : pay.method === 'cheque' ? (currentLang === 'ar' ? 'شيك مصرفي' : 'Bank Cheque')
            : (currentLang === 'ar' ? 'تحصيل نقدي بالفرع' : 'Branch Cash');

          const statusBadgeHtml = pay.verifiedByMiqat
            ? `<span class="pay-badge-verified"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> ${currentLang === 'ar' ? 'موثق عبر ميقات' : 'Verified by Miqat'}</span>`
            : `<span class="pay-badge-reported"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${currentLang === 'ar' ? 'مسجل بالفرع (مراجعة)' : 'Company-Reported'}</span>`;

          const recordedByLabel = pay.recordedBy === 'gateway' ? (currentLang === 'ar' ? 'بوابة الدفع الإلكتروني' : 'Payment Gateway')
            : pay.recordedBy === 'company' ? (currentLang === 'ar' ? 'إدارة الشركة (الفرع)' : 'Company Branch')
            : pay.recordedBy === 'finance' ? (currentLang === 'ar' ? 'مالية ميقات' : 'Miqat Finance')
            : pay.recordedBy;

          tr.innerHTML = `
            <td class="font-numeric" style="font-weight: 700;">${pay.ref || '--'}</td>
            <td class="font-numeric">${pay.date || '--'}</td>
            <td class="font-numeric" style="font-weight: 800; color: var(--color-text);">${formatCurrency(pay.amount)}</td>
            <td>${methodLabel}</td>
            <td>${statusBadgeHtml}</td>
            <td style="font-size: 0.8rem; color: var(--color-text-muted);">${recordedByLabel}</td>
          `;
          paymentsTbody.appendChild(tr);
        });
      } else {
        if (paymentsTable) paymentsTable.style.display = 'none';
        if (paymentsEmpty) paymentsEmpty.style.display = 'block';
      }
    }

    // 8. Authorized Operational Actions Buttons State
    const rawStatus = (booking.status || '').toLowerCase();
    const rawBkgStatus = (booking.bookingStatus || '').toLowerCase();
    const isConfirmed = rawStatus === 'confirmed' || rawBkgStatus === 'confirmed';
    const isCancelledOrRejected = rawStatus === 'cancelled' || rawStatus === 'rejected' || rawBkgStatus === 'cancelled' || rawBkgStatus === 'rejected';
    const isFullyPaid = booking.remainingAmount <= 0;

    const btnActionConfirm = document.getElementById('btnActionConfirm');
    const btnActionReportPayment = document.getElementById('btnActionReportPayment');
    const btnActionRequestChange = document.getElementById('btnActionRequestChange');
    const btnActionReject = document.getElementById('btnActionReject');

    if (btnActionConfirm) {
      btnActionConfirm.disabled = isConfirmed || isCancelledOrRejected;
      const textSpan = btnActionConfirm.querySelector('span');
      if (textSpan) {
        if (isConfirmed) {
          textSpan.textContent = getTranslation('company.btn_already_confirmed') || (currentLang === 'ar' ? 'الحجز معتمد ومؤكد بالفعل' : 'Booking Already Confirmed');
        } else {
          textSpan.textContent = getTranslation('company.btn_confirm_booking') || (currentLang === 'ar' ? 'تأكيد واعتماد الحجز' : 'Confirm Booking');
        }
      }
    }

    if (btnActionReportPayment) {
      btnActionReportPayment.disabled = isFullyPaid || isCancelledOrRejected;
      const textSpan = btnActionReportPayment.querySelector('span');
      if (textSpan) {
        if (isFullyPaid) {
          textSpan.textContent = getTranslation('company.btn_fully_paid') || (currentLang === 'ar' ? 'الحجز مسدد بالكامل' : 'Fully Paid');
        } else {
          textSpan.textContent = getTranslation('company.btn_report_payment') || (currentLang === 'ar' ? 'تسجيل استلام دفعة نقدية' : 'Report Payment Received');
        }
      }
    }

    if (btnActionRequestChange) {
      btnActionRequestChange.disabled = isCancelledOrRejected;
    }

    if (btnActionReject) {
      btnActionReject.disabled = isConfirmed || isCancelledOrRejected;
    }

    // 9. Booking Activity Timeline
    const timelineList = document.getElementById('timelineList');
    const timelineEmpty = document.getElementById('timelineEmptyState');

    if (timelineList) {
      timelineList.innerHTML = '';
      if (booking.timeline && booking.timeline.length > 0) {
        if (timelineEmpty) timelineEmpty.style.display = 'none';

        booking.timeline.forEach(item => {
          const li = document.createElement('li');
          li.className = 'timeline-item';

          const markerClass = item.type === 'confirmed' ? 'marker-confirmed'
            : item.type === 'rejected' ? 'marker-rejected'
            : '';

          const iconSvg = item.type === 'confirmed'
            ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            : item.type === 'rejected'
            ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
            : '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle></svg>';

          const actorName = currentLang === 'ar'
            ? (item.actor_ar || (item.actor === 'customer' ? 'العميل' : item.actor === 'company' ? 'الشركة الشريكة' : item.actor === 'miqat_gateway' ? 'بوابة ميقات' : item.actor === 'miqat_finance' ? 'مالية ميقات' : 'النظام الآلي'))
            : (item.actor_en || (item.actor === 'customer' ? 'Customer' : item.actor === 'company' ? 'Partner Company' : item.actor === 'miqat_gateway' ? 'Miqat Gateway' : item.actor === 'miqat_finance' ? 'Miqat Finance' : 'System'));

          const title = currentLang === 'ar' ? item.title_ar : item.title_en;
          const desc = currentLang === 'ar' ? item.description_ar : item.description_en;

          li.innerHTML = `
            <div class="timeline-marker-dot ${markerClass}">${iconSvg}</div>
            <div class="timeline-item-header">
              <span class="timeline-item-title">${title}</span>
              <span class="timeline-item-time font-numeric">${item.timestamp}</span>
            </div>
            <p class="timeline-item-desc">${desc}</p>
            <span class="timeline-actor-pill">${actorName}</span>
          `;
          timelineList.appendChild(li);
        });
      } else {
        if (timelineEmpty) timelineEmpty.style.display = 'block';
      }
    }
  }

  // =========================================================================
  // FINANCIAL OVERVIEW & AUTHORITATIVE COLLECTIONS ENGINE (SECTION 4)
  // =========================================================================

  let financialFilterState = {
    period: 'all',
    date: null,
    search: '',
    program: 'all',
    source: 'all',
    method: 'all',
    verification: 'all'
  };

  // --- Date Picker Display Formatter (Fix 2B) ---
  function updateFinDateDisplay(dateStr) {
    const dateEl = document.getElementById('finDateDisplay');
    if (!dateEl) return;
    let d;
    if (dateStr) {
      const parts = dateStr.split('-');
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date(2026, 9, 30);
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    try {
      dateEl.textContent = d.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch (e) {
      dateEl.textContent = dateStr || (currentLang === 'ar' ? 'الجمعة، 30 أكتوبر 2026' : 'Friday, October 30, 2026');
    }
  }

  // --- Genuine Binary XLSX Workbook Generator (Fix 6B) ---
  const _crcTable = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    _crcTable[i] = c;
  }

  function _calcCrc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ _crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function _createZipBlob(files) {
    const textEnc = new TextEncoder();
    const parts = [];
    const entries = [];
    let offset = 0;

    for (const f of files) {
      const nameBytes = textEnc.encode(f.name);
      const dataBytes = f.data instanceof Uint8Array ? f.data : textEnc.encode(f.data);
      const crc = _calcCrc32(dataBytes);

      const header = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(header.buffer);
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true); // compression: 0 = store
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, dataBytes.length, true);
      view.setUint32(22, dataBytes.length, true);
      view.setUint16(26, nameBytes.length, true);
      view.setUint16(28, 0, true);
      header.set(nameBytes, 30);

      entries.push({
        nameBytes,
        crc,
        size: dataBytes.length,
        offset
      });

      parts.push(header);
      parts.push(dataBytes);
      offset += header.length + dataBytes.length;
    }

    const cdStart = offset;
    let cdSize = 0;

    for (const entry of entries) {
      const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
      const view = new DataView(cdHeader.buffer);
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 20, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint16(14, 0, true);
      view.setUint32(16, entry.crc, true);
      view.setUint32(20, entry.size, true);
      view.setUint32(24, entry.size, true);
      view.setUint16(28, entry.nameBytes.length, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint16(36, 0, true);
      view.setUint32(38, 0, true);
      view.setUint32(42, entry.offset, true);
      cdHeader.set(entry.nameBytes, 46);

      parts.push(cdHeader);
      cdSize += cdHeader.length;
    }

    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true);
    eocdView.setUint16(4, 0, true);
    eocdView.setUint16(6, 0, true);
    eocdView.setUint16(8, entries.length, true);
    eocdView.setUint16(10, entries.length, true);
    eocdView.setUint32(12, cdSize, true);
    eocdView.setUint32(16, cdStart, true);
    eocdView.setUint16(20, 0, true);
    parts.push(eocd);

    return new Blob(parts, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function _escapeXml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function _colLetter(colIdx) {
    let letter = '';
    while (colIdx >= 0) {
      letter = String.fromCharCode((colIdx % 26) + 65) + letter;
      colIdx = Math.floor(colIdx / 26) - 1;
    }
    return letter;
  }

  function buildXlsxWorkbook(headers, rows) {
    const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '</Types>';

    const rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '</Relationships>';

    const wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>';

    const workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets>' +
      '<sheet name="Company Bookings Statement" sheetId="1" r:id="rId1"/>' +
      '</sheets>' +
      '</workbook>';

    const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<fonts count="2">' +
      '<font><sz val="11"/><name val="Segoe UI"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>' +
      '</fonts>' +
      '<fills count="3">' +
      '<fill><patternFill patternType="none"/></fill>' +
      '<fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FF183653"/></patternFill></fill>' +
      '</fills>' +
      '<borders count="1">' +
      '<border><left/><right/><top/><bottom/><diagonal/></border>' +
      '</borders>' +
      '<cellStyleXfs count="1">' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' +
      '</cellStyleXfs>' +
      '<cellXfs count="3">' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
      '<xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
      '</cellXfs>' +
      '</styleSheet>';

    let sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<sheetData>';

    // Header row
    sheetXml += '<row r="1">';
    headers.forEach((h, cIdx) => {
      const cellRef = _colLetter(cIdx) + '1';
      sheetXml += `<c r="${cellRef}" t="inlineStr" s="1"><is><t>${_escapeXml(h)}</t></is></c>`;
    });
    sheetXml += '</row>';

    // Data rows
    rows.forEach((row, rIdx) => {
      const rowNum = rIdx + 2;
      sheetXml += `<row r="${rowNum}">`;
      row.forEach((val, cIdx) => {
        const cellRef = _colLetter(cIdx) + rowNum;
        if (typeof val === 'number') {
          sheetXml += `<c r="${cellRef}" t="n" s="2"><v>${val}</v></c>`;
        } else {
          sheetXml += `<c r="${cellRef}" t="inlineStr" s="0"><is><t>${_escapeXml(val)}</t></is></c>`;
        }
      });
      sheetXml += '</row>';
    });

    sheetXml += '</sheetData></worksheet>';

    return _createZipBlob([
      { name: '[Content_Types].xml', data: contentTypes },
      { name: '_rels/.rels', data: rootRels },
      { name: 'xl/_rels/workbook.xml.rels', data: wbRels },
      { name: 'xl/workbook.xml', data: workbookXml },
      { name: 'xl/styles.xml', data: stylesXml },
      { name: 'xl/worksheets/sheet1.xml', data: sheetXml }
    ]);
  }

  function exportCompanyBookingsToExcel() {
    if (!window.MiqatCompanyMockData || !window.MiqatCompanyMockData.RAW_BOOKINGS) {
      showCompanyToast(
        currentLang === 'ar' ? 'تعذر الوصول لبيانات حجوزات الشركة' : 'Could not access company bookings data',
        'error'
      );
      return;
    }

    const allBookings = window.MiqatCompanyMockData.RAW_BOOKINGS;
    if (!allBookings || allBookings.length === 0) {
      showCompanyToast(
        currentLang === 'ar' ? 'لا توجد حجوزات مسجلة للشركة لتصديرها' : 'No bookings available to export',
        'error'
      );
      return;
    }

    showCompanyToast(
      currentLang === 'ar'
        ? `جاري إنشاء وتحميل كشف الحساب المعتمد لجميع الحجوزات (${allBookings.length} حجزاً بصيغة Excel)...`
        : `Generating and downloading official statement for all bookings (${allBookings.length} bookings in Excel)...`,
      'info'
    );

    try {
      const isAr = currentLang === 'ar';
      const headers = isAr ? [
        "رقم الحجز",
        "اسم المعتمر / العميل",
        "رقم الهاتف",
        "البرنامج",
        "فئة البرنامج",
        "تاريخ الحجز",
        "إجمالي قيمة الحجز (ج.م)",
        "المحصل عبر ميقات (ج.م)",
        "التحصيل المباشر بالشركة (ج.م)",
        "المبلغ المتبقي (ج.م)",
        "حالة الحجز",
        "حالة السداد",
        "عدد المعتمرين"
      ] : [
        "Booking Ref",
        "Customer Name",
        "Phone Number",
        "Program Name",
        "Category",
        "Booking Date",
        "Total Value (EGP)",
        "Paid via Miqat (EGP)",
        "Company Direct (EGP)",
        "Remaining (EGP)",
        "Booking Status",
        "Payment Status",
        "Travelers"
      ];

      const rows = allBookings.map(b => {
        const customerName = isAr ? b.customerName_ar : b.customerName_en;
        const progName = isAr ? b.programName_ar : b.programName_en;
        
        let platformPaid = 0;
        let companyPaid = 0;
        if (b.payments && b.payments.length) {
          b.payments.forEach(p => {
            if (p.source === 'company') {
              companyPaid += (p.amount || 0);
            } else {
              platformPaid += (p.amount || 0);
            }
          });
        } else {
          platformPaid = b.paidAmount || 0;
        }

        let bookingStatusText = '';
        if (b.status === 'Confirmed' || b.bookingStatus === 'confirmed') {
          bookingStatusText = isAr ? 'مؤكد' : 'Confirmed';
        } else if (b.status === 'Pending' || b.bookingStatus === 'under_review') {
          bookingStatusText = isAr ? 'قيد المراجعة' : 'Under Review';
        } else if (b.status === 'New' || b.bookingStatus === 'new') {
          bookingStatusText = isAr ? 'جديد' : 'New';
        } else if (b.status === 'Rejected' || b.bookingStatus === 'rejected') {
          bookingStatusText = isAr ? 'ملغي' : 'Cancelled';
        } else {
          bookingStatusText = b.status;
        }

        let paymentStatusText = '';
        if (b.paymentStatus === 'fully_paid') {
          paymentStatusText = isAr ? 'مسدد بالكامل' : 'Fully Paid';
        } else if (b.paymentStatus === 'deposit_paid' || b.paymentStatus === 'partially_paid') {
          paymentStatusText = isAr ? 'مسدد جزئياً' : 'Partially Paid';
        } else {
          paymentStatusText = isAr ? 'غير مسدد' : 'Unpaid';
        }

        const catName = isAr
          ? (b.category === 'vip' ? 'فاخر VIP' : (b.category === 'premium' ? 'متميز' : (b.category === 'ramadan' ? 'رمضان' : 'اقتصادي')))
          : (b.category === 'vip' ? 'VIP Luxury' : (b.category === 'premium' ? 'Premium' : (b.category === 'ramadan' ? 'Ramadan' : 'Economy')));

        return [
          b.reference,
          customerName,
          b.customerPhone || '',
          progName,
          catName,
          b.bookingDate,
          b.totalPrice,
          platformPaid,
          companyPaid,
          b.remainingAmount,
          bookingStatusText,
          paymentStatusText,
          b.travelers || 1
        ];
      });

      const xlsxBlob = buildXlsxWorkbook(headers, rows);
      const today = new Date().toISOString().split('T')[0];
      const filename = `Miqat_AlDorraTravel_Bookings_Statement_${today}.xlsx`;

      const downloadUrl = URL.createObjectURL(xlsxBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

      showCompanyToast(
        isAr
          ? 'تم تنزيل كشف الحساب بصيغة Excel (.xlsx) بنجاح لجميع حجوزات الشركة'
          : 'Excel statement (.xlsx) successfully downloaded for all company bookings',
        'success'
      );
    } catch (err) {
      console.error('Excel Export Error:', err);
      showCompanyToast(
        currentLang === 'ar' ? 'حدث خطأ أثناء تصدير كشف الحساب' : 'Failed to generate Excel statement',
        'error'
      );
    }
  }

  // Expose Excel helper methods for direct execution / testing
  window.buildXlsxWorkbook = buildXlsxWorkbook;
  window.exportCompanyBookingsToExcel = exportCompanyBookingsToExcel;

  // --- Collection Details Modal (Fix 6C) ---
  function openCollectionDetailsModal(tx) {
    if (!tx) return;
    const modal = document.getElementById('collectionDetailsModal');
    if (!modal) return;

    const isAr = currentLang === 'ar';
    const formatMoney = (n) => Number(n || 0).toLocaleString('en-US');

    const customerName = isAr ? tx.customerName_ar : tx.customerName_en;
    const methodText = isAr ? tx.method_ar : tx.method_en;
    const sourceText = tx.source === 'platform'
      ? (isAr ? 'منصة ميقات (إيداع إلكتروني)' : 'Miqat Platform (Electronic)')
      : (isAr ? 'فرع الشركة (تحصيل مباشر)' : 'Company Branch (Direct)');
    const recordedBy = isAr ? tx.recordedBy_ar : tx.recordedBy_en;
    const statusText = isAr ? (tx.status_ar || 'معتمد') : (tx.status_en || 'Verified');
    const notesText = isAr ? (tx.notes_ar || 'لا توجد ملاحظات إضافية') : (tx.notes_en || 'No additional notes');

    let verifText = '';
    if (tx.verifiedByMiqat) {
      verifText = isAr ? 'معتمد وموثق من ميقات' : 'Verified by Miqat';
    } else {
      verifText = isAr ? 'مسجل بالشركة (قيد التدقيق المحاسبي بميقات)' : 'Company-Reported (Pending Miqat Verification)';
    }

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('modalDetailTxRef', tx.transactionRef || tx.reference);
    setText('modalDetailBookingRef', tx.bookingRef);
    setText('modalDetailCustomerName', customerName);
    setText('modalDetailAmount', `${formatMoney(tx.amount)} ${isAr ? 'ج.م' : 'EGP'}`);
    setText('modalDetailDateTime', tx.date);
    setText('modalDetailSource', sourceText);
    setText('modalDetailMethod', methodText);
    setText('modalDetailStatus', statusText);
    setText('modalDetailVerification', verifText);
    setText('modalDetailRecordedBy', recordedBy);
    setText('modalDetailReceiptRef', tx.receiptRef || (tx.source === 'platform' ? 'E-RCP-' + tx.reference : 'REC-OFFICE-8821'));
    setText('modalDetailNotes', notesText);

    const bookingBtn = document.getElementById('btnModalViewBooking');
    if (bookingBtn) {
      bookingBtn.href = `company-booking-details.html?id=${encodeURIComponent(tx.bookingId)}`;
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeCollectionDetailsModal() {
    const modal = document.getElementById('collectionDetailsModal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function setupFinancialOverviewPage() {
    // 1. Period Pills
    const pillsGroup = document.getElementById('finPeriodPillsGroup');
    if (pillsGroup) {
      pillsGroup.querySelectorAll('.fin-period-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          pillsGroup.querySelectorAll('.fin-period-pill').forEach(p => {
            p.classList.remove('is-active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('is-active');
          pill.setAttribute('aria-selected', 'true');
          financialFilterState.date = null;
          financialFilterState.period = pill.getAttribute('data-period') || 'all';
          
          const resetFinDateBtn = document.getElementById('resetFinDateFilterBtn');
          if (resetFinDateBtn) resetFinDateBtn.style.display = 'none';
          
          const finDatePicker = document.getElementById('finDatePicker');
          if (finDatePicker) finDatePicker.value = '2026-10-30';
          updateFinDateDisplay('2026-10-30');

          renderFinancialOverviewPage();
        });
      });
    }

    // 2. Calendar Date Picker Filter Control (Fix 2B)
    const finDatePicker = document.getElementById('finDatePicker');
    const resetFinDateBtn = document.getElementById('resetFinDateFilterBtn');

    if (finDatePicker) {
      finDatePicker.addEventListener('change', () => {
        const val = finDatePicker.value;
        if (!val) return;
        financialFilterState.date = val;
        updateFinDateDisplay(val);
        if (resetFinDateBtn) resetFinDateBtn.style.display = 'inline-flex';

        // Deselect period pills
        document.querySelectorAll('.fin-period-pill').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });

        renderFinancialOverviewPage();
      });
    }

    if (resetFinDateBtn) {
      resetFinDateBtn.addEventListener('click', () => {
        financialFilterState.date = null;
        if (finDatePicker) finDatePicker.value = '2026-10-30';
        updateFinDateDisplay('2026-10-30');
        resetFinDateBtn.style.display = 'none';

        document.querySelectorAll('.fin-period-pill').forEach(b => {
          const isAll = b.getAttribute('data-period') === 'all';
          b.classList.toggle('is-active', isAll);
          b.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
        financialFilterState.period = 'all';

        renderFinancialOverviewPage();
      });
    }

    // Initialize date display
    updateFinDateDisplay('2026-10-30');

    // 3. Search Text
    const searchInput = document.getElementById('finSearchInput');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          financialFilterState.search = e.target.value.trim();
          renderFinancialOverviewPage();
        }, 250);
      });
    }

    // 4. Program Select
    const progSelect = document.getElementById('finProgramSelect');
    if (progSelect) {
      progSelect.addEventListener('change', (e) => {
        financialFilterState.program = e.target.value;
        renderFinancialOverviewPage();
      });
    }

    // 5. Source Select
    const sourceSelect = document.getElementById('finSourceSelect');
    if (sourceSelect) {
      sourceSelect.addEventListener('change', (e) => {
        financialFilterState.source = e.target.value;
        renderFinancialOverviewPage();
      });
    }

    // 6. Method Select
    const methodSelect = document.getElementById('finMethodSelect');
    if (methodSelect) {
      methodSelect.addEventListener('change', (e) => {
        financialFilterState.method = e.target.value;
        renderFinancialOverviewPage();
      });
    }

    // 7. Verification Status Select
    const verifSelect = document.getElementById('finVerificationSelect');
    if (verifSelect) {
      verifSelect.addEventListener('change', (e) => {
        financialFilterState.verification = e.target.value;
        renderFinancialOverviewPage();
      });
    }

    // 8. Apply Filters Button (Fix 5)
    const applyBtn = document.getElementById('finApplyFiltersBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        if (searchInput) financialFilterState.search = searchInput.value.trim();
        if (progSelect) financialFilterState.program = progSelect.value;
        if (sourceSelect) financialFilterState.source = sourceSelect.value;
        if (methodSelect) financialFilterState.method = methodSelect.value;
        if (verifSelect) financialFilterState.verification = verifSelect.value;
        renderFinancialOverviewPage();
      });
    }

    // 9. Reset Filters Button (Fix 5)
    function resetFilters() {
      financialFilterState.search = '';
      financialFilterState.program = 'all';
      financialFilterState.source = 'all';
      financialFilterState.method = 'all';
      financialFilterState.verification = 'all';

      if (searchInput) searchInput.value = '';
      if (progSelect) progSelect.value = 'all';
      if (sourceSelect) sourceSelect.value = 'all';
      if (methodSelect) methodSelect.value = 'all';
      if (verifSelect) verifSelect.value = 'all';

      renderFinancialOverviewPage();
    }

    const resetBtn = document.getElementById('finResetFiltersBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    const emptyResetBtn = document.getElementById('finEmptyResetBtn');
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetFilters);

    // 10. Export Statement Button (Fix 6B: Genuine .xlsx with all 36 company bookings)
    const exportBtn = document.getElementById('finExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportCompanyBookingsToExcel();
      });
    }

    // 11. Modal Close Handlers (Fix 6C)
    const closeBtn = document.getElementById('btnCloseCollectionModal');
    const cancelBtn = document.getElementById('btnCancelCollectionModal');
    const backdrop = document.getElementById('backdropCollectionModal');
    if (closeBtn) closeBtn.addEventListener('click', closeCollectionDetailsModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCollectionDetailsModal);
    if (backdrop) backdrop.addEventListener('click', closeCollectionDetailsModal);
  }

  function renderFinancialOverviewPage() {
    if (!window.MiqatCompanyMockData) return;

    const data = window.MiqatCompanyMockData.getFinancialOverviewData(financialFilterState);
    if (!data) return;

    const isAr = currentLang === 'ar';
    const currSym = isAr ? 'ج.م' : 'EGP';
    // Fix 1: Number localization for Financial Summary Cards
    // Uses existing formatNumber() so Arabic mode uses Arabic-Indic digits (ar-EG)
    // and English mode uses standard English digits (en-US)
    const formatFinNum = (n) => formatNumber(Number(n || 0));
    const formatMoney = (n) => Number(n || 0).toLocaleString('en-US');

    // Update date filter display with active language
    updateFinDateDisplay(financialFilterState.date || '2026-10-30');

    // 1. Update KPI Card 1: Total Booking Value
    const kpiValEl = document.getElementById('kpiTotalBookingValue');
    if (kpiValEl) kpiValEl.textContent = formatFinNum(data.summary.totalBookingValue);

    const kpiBookingsBadge = document.getElementById('kpiTotalBookingsCountBadge');
    if (kpiBookingsBadge) {
      kpiBookingsBadge.textContent = isAr
        ? `${formatFinNum(data.summary.totalBookingsCount)} حجزاً معتمداً`
        : `${formatFinNum(data.summary.totalBookingsCount)} Confirmed Bookings`;
    }

    // 2. Update KPI Card 2: Platform Collections
    const kpiPlatEl = document.getElementById('kpiPlatformCollected');
    if (kpiPlatEl) kpiPlatEl.textContent = formatFinNum(data.summary.platformCollections);

    const kpiPlatRateBadge = document.getElementById('kpiPlatformRateBadge');
    if (kpiPlatRateBadge) {
      kpiPlatRateBadge.textContent = isAr
        ? `${formatFinNum(data.summary.platformRate)}% من الإجمالي`
        : `${formatFinNum(data.summary.platformRate)}% of Total`;
    }

    // 3. Update KPI Card 3: Reported Company Direct Collections
    const kpiCompEl = document.getElementById('kpiCompanyReported');
    if (kpiCompEl) kpiCompEl.textContent = formatFinNum(data.summary.companyReportedCollections);

    const kpiCompRateBadge = document.getElementById('kpiCompanyRateBadge');
    if (kpiCompRateBadge) {
      kpiCompRateBadge.textContent = isAr
        ? `${formatFinNum(data.summary.companyRate)}% من الإجمالي`
        : `${formatFinNum(data.summary.companyRate)}% of Total`;
    }

    const countPending = data.transactions.filter(t => t.source === 'company' && !t.verifiedByMiqat).length;
    const kpiCompPendingAmt = document.getElementById('kpiCompanyPendingAmount');
    if (kpiCompPendingAmt) {
      kpiCompPendingAmt.textContent = `${formatFinNum(data.summary.companyReportedPending)} ${currSym}`;
    }

    const kpiCompPendingCount = document.getElementById('kpiCompanyPendingCount');
    if (kpiCompPendingCount) {
      kpiCompPendingCount.textContent = isAr ? `${formatFinNum(countPending)} إيصالات` : `${formatFinNum(countPending)} Receipts`;
    }

    const countVerified = data.transactions.filter(t => t.source === 'company' && t.verifiedByMiqat).length;
    const kpiCompVerifAmt = document.getElementById('kpiCompanyVerifiedAmount');
    if (kpiCompVerifAmt) {
      kpiCompVerifAmt.textContent = `${formatFinNum(data.summary.companyReportedVerified)} ${currSym}`;
    }

    const kpiCompVerifCount = document.getElementById('kpiCompanyVerifiedCount');
    if (kpiCompVerifCount) {
      kpiCompVerifCount.textContent = isAr ? `${formatFinNum(countVerified)} إيصال` : `${formatFinNum(countVerified)} Receipts`;
    }

    // 4. Update KPI Card 4: Remaining Outstanding
    const kpiRemEl = document.getElementById('kpiRemainingOutstanding');
    if (kpiRemEl) kpiRemEl.textContent = formatFinNum(data.summary.remainingOutstanding);

    const kpiRemRateBadge = document.getElementById('kpiRemainingRateBadge');
    if (kpiRemRateBadge) {
      kpiRemRateBadge.textContent = isAr
        ? `${formatFinNum(data.summary.remainingRate)}% متبقي`
        : `${formatFinNum(data.summary.remainingRate)}% Remaining`;
    }

    // Currency spans in cards (Fix 7A)
    document.querySelectorAll('.fin-kpi-card .fin-card-currency').forEach(el => {
      el.textContent = currSym;
    });

    // 5. Render Monthly Collections Bar Chart (Dual Bar: Platform vs Company Direct)
    renderFinMonthlyChart(data.monthlyActivity);

    // 6. Render Program Category Financial Breakdown (Fix 2: Remove nested cards, clean progress bars)
    renderFinProgramBreakdown(data.programBreakdown);

    // 7. Render Settlement Distribution Widget (Fix 2: Remove nested cards, clean stacked bar & legend)
    renderFinSettlementWidget(data.summary);

    // 8. Update Results Meta
    const resultsCountEl = document.getElementById('finResultsCountText');
    if (resultsCountEl) {
      resultsCountEl.textContent = isAr
        ? `عرض ${data.filteredCount} من أصل ${data.allTransactionsCount} معاملة مالية`
        : `Showing ${data.filteredCount} of ${data.allTransactionsCount} transactions`;
    }

    const resultsSumEl = document.getElementById('finResultsSumText');
    if (resultsSumEl) {
      resultsSumEl.textContent = isAr
        ? `إجمالي المعروض: ${formatMoney(data.filteredSum)} ج.م`
        : `Total Displayed: ${formatMoney(data.filteredSum)} EGP`;
    }

    // 9. Render Ledger Table & Mobile Cards
    renderFinTransactionsLedger(data.transactions);
  }

  function renderFinMonthlyChart(monthlyActivity) {
    const wrapper = document.getElementById('finMonthlyChartWrapper');
    if (!wrapper || !monthlyActivity || !monthlyActivity.length) return;

    const maxVal = Math.max(...monthlyActivity.map(m => Math.max(m.platformCollections, m.companyCollections, 1)));
    const svgWidth = 840;
    const svgHeight = 240;
    const chartHeight = 160;
    const topMargin = 25;
    const colWidth = svgWidth / monthlyActivity.length;

    let barsHtml = '';

    monthlyActivity.forEach((m, idx) => {
      const xCenter = idx * colWidth + colWidth / 2;
      const barWidth = 24;
      const gap = 6;

      const pHeight = Math.max(4, Math.round((m.platformCollections / maxVal) * chartHeight));
      const cHeight = Math.max(4, Math.round((m.companyCollections / maxVal) * chartHeight));

      const pX = xCenter - barWidth - gap / 2;
      const cX = xCenter + gap / 2;

      const pY = topMargin + (chartHeight - pHeight);
      const cY = topMargin + (chartHeight - cHeight);

      const monthLabel = currentLang === 'ar' ? m.name_ar : m.name_en;

      barsHtml += `
        <g class="chart-month-group" data-month="${m.monthKey}">
          <!-- Platform Bar -->
          <rect x="${pX}" y="${pY}" width="${barWidth}" height="${pHeight}" rx="4" class="bar-platform">
            <title>${currentLang === 'ar' ? 'منصة ميقات: ' + m.platformCollections.toLocaleString('en-US') + ' ج.م' : 'Miqat Platform: ' + m.platformCollections.toLocaleString('en-US') + ' EGP'}</title>
          </rect>
          <!-- Company Bar -->
          <rect x="${cX}" y="${cY}" width="${barWidth}" height="${cHeight}" rx="4" class="bar-company">
            <title>${currentLang === 'ar' ? 'مباشر بالشركة: ' + m.companyCollections.toLocaleString('en-US') + ' ج.م' : 'Company Direct: ' + m.companyCollections.toLocaleString('en-US') + ' EGP'}</title>
          </rect>
          <!-- Month Label -->
          <text x="${xCenter}" y="${svgHeight - 14}" text-anchor="middle" class="chart-axis-label">${monthLabel}</text>
        </g>
      `;
    });

    wrapper.innerHTML = `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" class="fin-timeline-svg" preserveAspectRatio="xMidYMid meet">
        <line x1="20" y1="${topMargin}" x2="${svgWidth - 20}" y2="${topMargin}" class="chart-grid-line" stroke-dasharray="4,4" />
        <line x1="20" y1="${topMargin + chartHeight / 2}" x2="${svgWidth - 20}" y2="${topMargin + chartHeight / 2}" class="chart-grid-line" stroke-dasharray="4,4" />
        <line x1="20" y1="${topMargin + chartHeight}" x2="${svgWidth - 20}" y2="${topMargin + chartHeight}" class="chart-baseline" />
        ${barsHtml}
      </svg>
    `;
  }

  function renderFinProgramBreakdown(programBreakdown) {
    const list = document.getElementById('finProgramBreakdownList');
    if (!list || !programBreakdown) return;

    list.innerHTML = '';
    const isAr = currentLang === 'ar';
    const currLabel = isAr ? 'ج.م' : 'EGP';
    const formatMoney = (n) => Number(n || 0).toLocaleString('en-US');

    programBreakdown.forEach(p => {
      // Fix 2A: Remove unnecessary nested cards — clean list row container
      const row = document.createElement('div');
      row.className = 'prog-breakdown-row';

      const progTitle = isAr ? p.name_ar : p.name_en;
      const categoryLabel = p.category === 'umrah'
        ? (isAr ? 'عمرة' : 'Umrah')
        : (isAr ? 'حج' : 'Hajj');
      const countWord = isAr ? 'حجز' : 'Bookings';

      row.innerHTML = `
        <div class="prog-breakdown-header">
          <div class="prog-title-wrap">
            <span class="prog-name">${progTitle}</span>
            <span class="prog-category-badge badge-${p.category}">${categoryLabel}</span>
            <span class="prog-count-pill font-numeric">${p.bookingsCount} ${countWord}</span>
          </div>
          <div class="prog-revenue-wrap">
            <span class="prog-revenue-val font-numeric">${formatMoney(p.totalRevenue)} <small>${currLabel}</small></span>
          </div>
        </div>
        <div class="prog-progress-track">
          <div class="prog-progress-fill fill-${p.category}" style="width: ${p.collectionRate}%;"></div>
        </div>
        <div class="prog-breakdown-footer font-numeric">
          <span class="footer-stat text-teal">${isAr ? 'المحصل: ' : 'Collected: '} ${formatMoney(p.collectedAmount)}</span>
          <span class="footer-stat text-muted">${isAr ? 'المتبقي: ' : 'Remaining: '} ${formatMoney(p.remainingAmount)}</span>
          <span class="footer-rate-pill">${p.collectionRate}% ${isAr ? 'سداد' : 'Settled'}</span>
        </div>
      `;
      list.appendChild(row);
    });
  }

  function renderFinSettlementWidget(summary) {
    const widget = document.getElementById('finSettlementWidget');
    if (!widget || !summary) return;

    const isAr = currentLang === 'ar';
    const currLabel = isAr ? 'ج.م' : 'EGP';
    const formatMoney = (n) => Number(n || 0).toLocaleString('en-US');

    // Fix 2A: Remove unnecessary nested cards — clean ratio bar and legend rows
    widget.innerHTML = `
      <div class="settlement-stacked-bar-wrap">
        <div class="settlement-stacked-bar">
          <div class="bar-segment seg-platform" style="width: ${summary.platformRate}%;" title="${isAr ? 'منصة ميقات: ' + summary.platformRate + '%' : 'Miqat Platform: ' + summary.platformRate + '%'}"></div>
          <div class="bar-segment seg-company" style="width: ${summary.companyRate}%;" title="${isAr ? 'مباشر بالشركة: ' + summary.companyRate + '%' : 'Company Direct: ' + summary.companyRate + '%'}"></div>
          <div class="bar-segment seg-remaining" style="width: ${summary.remainingRate}%;" title="${isAr ? 'متبقي: ' + summary.remainingRate + '%' : 'Remaining: ' + summary.remainingRate + '%'}"></div>
        </div>
      </div>
      <div class="settlement-legend-list">
        <div class="settlement-stat-row">
          <div class="stat-left">
            <span class="stat-bullet bullet-platform"></span>
            <span class="stat-name">${isAr ? 'محصل عبر منصة ميقات' : 'Miqat Platform'}</span>
          </div>
          <div class="stat-right">
            <span class="stat-val font-numeric">${formatMoney(summary.platformCollections)} ${currLabel}</span>
            <span class="stat-pct font-numeric pct-platform">${summary.platformRate}%</span>
          </div>
        </div>
        <div class="settlement-stat-row">
          <div class="stat-left">
            <span class="stat-bullet bullet-company"></span>
            <span class="stat-name">${isAr ? 'مسجل بالشركة (مباشر)' : 'Company Direct'}</span>
          </div>
          <div class="stat-right">
            <span class="stat-val font-numeric">${formatMoney(summary.companyReportedCollections)} ${currLabel}</span>
            <span class="stat-pct font-numeric pct-company">${summary.companyRate}%</span>
          </div>
        </div>
        <div class="settlement-stat-row">
          <div class="stat-left">
            <span class="stat-bullet bullet-remaining"></span>
            <span class="stat-name">${isAr ? 'متبقي غير محصل' : 'Remaining Dues'}</span>
          </div>
          <div class="stat-right">
            <span class="stat-val font-numeric">${formatMoney(summary.remainingOutstanding)} ${currLabel}</span>
            <span class="stat-pct font-numeric pct-remaining">${summary.remainingRate}%</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderFinTransactionsLedger(transactions) {
    const tableBody = document.getElementById('finLedgerTableBody');
    const tableContainer = document.querySelector('.fin-table-container');
    const cardsContainer = document.getElementById('finCardsMobileContainer');
    const emptyState = document.getElementById('finEmptyState');

    if (!transactions || transactions.length === 0) {
      if (tableContainer) tableContainer.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (tableContainer) tableContainer.style.display = '';
    if (cardsContainer) cardsContainer.style.display = '';
    if (emptyState) emptyState.style.display = 'none';

    const formatMoney = (n) => Number(n || 0).toLocaleString('en-US');

    // 1. Desktop / Tablet Table
    if (tableBody) {
      tableBody.innerHTML = '';
      transactions.forEach(tx => {
        const tr = document.createElement('tr');
        tr.className = 'fin-ledger-row';
        tr.setAttribute('tabindex', '0');
        tr.setAttribute('role', 'button');
        tr.setAttribute('aria-label', currentLang === 'ar' ? `عرض تفاصيل المعاملة ${tx.transactionRef || tx.reference}` : `View transaction details ${tx.transactionRef || tx.reference}`);

        const customerName = currentLang === 'ar' ? tx.customerName_ar : tx.customerName_en;
        const progName = currentLang === 'ar' ? tx.programName_ar : tx.programName_en;
        const methodText = currentLang === 'ar' ? tx.method_ar : tx.method_en;
        const sourceText = tx.source === 'platform'
          ? (currentLang === 'ar' ? 'منصة ميقات' : 'Miqat Platform')
          : (currentLang === 'ar' ? 'فرع الشركة' : 'Company Branch');
        const recordedBy = currentLang === 'ar' ? tx.recordedBy_ar : tx.recordedBy_en;

        const isVerified = tx.verifiedByMiqat;
        const verifClass = isVerified ? 'verif-approved' : 'verif-pending';
        let verifText = '';
        if (isVerified) {
          verifText = tx.source === 'company'
            ? (currentLang === 'ar' ? 'مسجل بالشركة (معتمد)' : 'Company-Reported (Verified)')
            : (currentLang === 'ar' ? 'معتمد من ميقات' : 'Verified by Miqat');
        } else {
          verifText = currentLang === 'ar' ? 'مسجل بالشركة (قيد التدقيق)' : 'Company-Reported (Pending)';
        }

        tr.innerHTML = `
          <td>
            <span class="fin-code-pill font-numeric">${tx.transactionRef || tx.reference}</span>
          </td>
          <td>
            <a href="company-booking-details.html?id=${encodeURIComponent(tx.bookingId)}" class="fin-booking-ref-link font-numeric" title="${currentLang === 'ar' ? 'عرض تفاصيل الحجز' : 'View Booking Details'}">
              ${tx.bookingRef}
            </a>
          </td>
          <td>
            <div class="fin-customer-stack">
              <span class="fin-customer-name">${customerName}</span>
              <span class="fin-customer-phone font-numeric">${tx.customerPhone}</span>
            </div>
          </td>
          <td>
            <span class="fin-prog-badge badge-${tx.category}">${progName}</span>
          </td>
          <td>
            <span class="fin-datetime font-numeric">${tx.date}</span>
          </td>
          <td>
            <span class="fin-source-badge badge-${tx.source}">${sourceText}</span>
          </td>
          <td>
            <span class="fin-method-text">${methodText}</span>
          </td>
          <td>
            <span class="fin-amount-cell font-numeric">${formatMoney(tx.amount)} <small>${currentLang === 'ar' ? 'ج.م' : 'EGP'}</small></span>
          </td>
          <td>
            <span class="fin-verif-badge ${verifClass}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                ${isVerified ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'}
              </svg>
              <span>${verifText}</span>
            </span>
          </td>
          <td>
            <span class="fin-recorded-by" title="${recordedBy}">${recordedBy}</span>
          </td>
          <td class="td-actions">
            <a href="company-booking-details.html?id=${encodeURIComponent(tx.bookingId)}" class="fin-action-link" title="${currentLang === 'ar' ? 'عرض تفاصيل الحجز الكاملة' : 'View Full Booking Details'}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${currentLang === 'ar' ? 'عرض الحجز' : 'View Booking'}</span>
            </a>
          </td>
        `;

        // Row click opens Collection Details Modal (Fix 6C) unless link clicked
        tr.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          openCollectionDetailsModal(tx);
        });

        tr.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a')) return;
            e.preventDefault();
            openCollectionDetailsModal(tx);
          }
        });

        tableBody.appendChild(tr);
      });
    }

    // 2. Mobile Cards
    if (cardsContainer) {
      cardsContainer.innerHTML = '';
      transactions.forEach(tx => {
        const card = document.createElement('article');
        card.className = 'fin-mobile-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', currentLang === 'ar' ? `عرض تفاصيل المعاملة ${tx.transactionRef || tx.reference}` : `View transaction details ${tx.transactionRef || tx.reference}`);

        const customerName = currentLang === 'ar' ? tx.customerName_ar : tx.customerName_en;
        const progName = currentLang === 'ar' ? tx.programName_ar : tx.programName_en;
        const methodText = currentLang === 'ar' ? tx.method_ar : tx.method_en;
        const sourceText = tx.source === 'platform'
          ? (currentLang === 'ar' ? 'منصة ميقات' : 'Miqat Platform')
          : (currentLang === 'ar' ? 'فرع الشركة' : 'Company Branch');
        const recordedBy = currentLang === 'ar' ? tx.recordedBy_ar : tx.recordedBy_en;

        const isVerified = tx.verifiedByMiqat;
        const verifClass = isVerified ? 'verif-approved' : 'verif-pending';
        let verifText = '';
        if (isVerified) {
          verifText = tx.source === 'company'
            ? (currentLang === 'ar' ? 'مسجل بالشركة (معتمد)' : 'Company-Reported (Verified)')
            : (currentLang === 'ar' ? 'معتمد من ميقات' : 'Verified by Miqat');
        } else {
          verifText = currentLang === 'ar' ? 'مسجل بالشركة (قيد التدقيق)' : 'Company-Reported (Pending)';
        }

        card.innerHTML = `
          <div class="mobile-card-top">
            <div class="mobile-top-left">
              <span class="fin-code-pill font-numeric">${tx.transactionRef || tx.reference}</span>
              <a href="company-booking-details.html?id=${encodeURIComponent(tx.bookingId)}" class="fin-booking-ref-link font-numeric">${tx.bookingRef}</a>
            </div>
            <span class="fin-amount-cell font-numeric">${formatMoney(tx.amount)} <small>${currentLang === 'ar' ? 'ج.م' : 'EGP'}</small></span>
          </div>
          <div class="mobile-card-customer">
            <span class="mobile-cust-name">${customerName}</span>
            <span class="mobile-cust-phone font-numeric">${tx.customerPhone}</span>
          </div>
          <div class="mobile-card-meta-row">
            <span class="fin-prog-badge badge-${tx.category}">${progName}</span>
            <span class="fin-source-badge badge-${tx.source}">${sourceText}</span>
            <span class="fin-datetime font-numeric">${tx.date}</span>
          </div>
          <div class="mobile-card-status-row">
            <span class="fin-verif-badge ${verifClass}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                ${isVerified ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'}
              </svg>
              <span>${verifText}</span>
            </span>
            <span class="fin-method-text">${methodText}</span>
          </div>
          <div class="mobile-card-footer">
            <span class="mobile-recorded-by" title="${recordedBy}">${recordedBy}</span>
            <a href="company-booking-details.html?id=${encodeURIComponent(tx.bookingId)}" class="fin-action-link">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${currentLang === 'ar' ? 'عرض تفاصيل الحجز' : 'View Booking'}</span>
            </a>
          </div>
        `;

        // Card click opens Collection Details Modal (Fix 6C) unless link clicked
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          openCollectionDetailsModal(tx);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a')) return;
            e.preventDefault();
            openCollectionDetailsModal(tx);
          }
        });

        cardsContainer.appendChild(card);
      });
    }
  }
  // --- Page Initialization ---
  async function initCompanyPortal() {
    applyTheme(currentTheme);
    await applyTranslations(currentLang);
    setupGlobalControls();
    setupFutureScopeNavigation();

    // Verify company authorization
    const user = await verifyCompanyAuth();
    if (!user) return;

    const pageId = document.body ? document.body.dataset.pageId : '';
    if (pageId === 'company-dashboard') {
      renderDashboard(currentPeriod);
    } else if (pageId === 'company-bookings') {
      setupBookingsPage();
      renderBookingsPage();
    } else if (pageId === 'company-booking-details') {
      setupBookingDetailsPage();
      renderBookingDetailsPage();
    } else if (pageId === 'company-financial-overview') {
      setupFinancialOverviewPage();
      renderFinancialOverviewPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompanyPortal);
  } else {
    initCompanyPortal();
  }

})();

