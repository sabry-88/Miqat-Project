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
    renderDashboard(currentPeriod);
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
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const sec = el.getAttribute('data-company-section');
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

  // --- Page Initialization ---
  async function initCompanyPortal() {
    applyTheme(currentTheme);
    await applyTranslations(currentLang);
    setupGlobalControls();
    setupFutureScopeNavigation();

    // Verify company authorization
    const user = await verifyCompanyAuth();
    if (!user) return;

    // Initial render
    renderDashboard(currentPeriod);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompanyPortal);
  } else {
    initCompanyPortal();
  }

})();

