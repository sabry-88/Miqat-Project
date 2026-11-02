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
    const targetDict = dict || currentDict;
    if (!keyPath || !targetDict) return keyPath;
    const parts = keyPath.split('.');
    let val = targetDict;
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
    currentLang = lang || html.getAttribute('lang') || 'ar';
    localStorage.setItem(STORAGE_LANG, currentLang);
    const dict = await loadTranslations(currentLang);
    currentDict = dict;
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

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
    const compName = currentLang === 'ar'
      ? (user.company_name || user.name || 'شركة الدرة للسياحة')
      : (user.company_name_en || 'AL DORRA TRAVEL');
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
      if (sec === 'dashboard' || sec === 'bookings' || sec === 'financial' || sec === 'booking-details' || sec === 'programs' || sec === 'notifications' || sec === 'profile') return;
      if (href && !href.startsWith('#')) return;

      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(sec);
      });
    });

    document.querySelectorAll('[data-company-section="profile"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'company-profile.html';
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

    // Company Identity Group Click (Profile Navigation)
    const headerIdentity = document.getElementById('companyHeaderIdentity');
    if (headerIdentity) {
      const handleProfileOpen = (e) => {
        e.preventDefault();
        window.location.href = 'company-profile.html';
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
    } else if (pageId === 'company-programs') {
      renderProgramsPage();
    } else if (pageId === 'company-notifications') {
      renderNotificationsPage();
      updateNavbarNotificationsBadge();
    } else if (pageId === 'company-profile') {
      renderProfilePage();
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
  // =========================================================================
  // PROGRAMS & TRIPS MANAGEMENT ENGINE (PAGE 5)
  // =========================================================================

  let programsFilterState = {
    search: '',
    category: 'all',
    type: 'all',
    status: 'all',
    availability: 'all',
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: '',
    duration: 'all'
  };

  let cachedProgramsList = [];
  let cachedProgramsSummary = null;
  let isProgramFormDirty = false;
  let programToArchiveOrDelete = null;

  const PROGRAM_STATUS_MAP = {
    published: { ar: 'معروض ونشط', en: 'Published & Active', class: 'prog-status-published' },
    draft: { ar: 'مسودة قيد الإعداد', en: 'Draft', class: 'prog-status-draft' },
    archived: { ar: 'مؤرشف', en: 'Archived', class: 'prog-status-archived' }
  };

  const PROGRAM_AVAIL_MAP = {
    available: { ar: 'متاح للحجز', en: 'Available', class: 'prog-avail-available' },
    limited: { ar: 'مقاعد محدودة', en: 'Limited Availability', class: 'prog-avail-limited' },
    full: { ar: 'مكتمل العدد', en: 'Fully Booked', class: 'prog-avail-full' },
    unavailable: { ar: 'غير متاح', en: 'Unavailable', class: 'prog-avail-unavailable' }
  };

  const PROGRAM_TYPE_MAP = {
    economy: { ar: 'اقتصادي', en: 'Economy' },
    premium: { ar: 'متميز 5 نجوم', en: 'Premium 5-Star' },
    vip: { ar: 'فاخر VIP', en: 'VIP Luxury' },
    ramadan: { ar: 'موسم رمضان', en: 'Ramadan Season' },
    tourist: { ar: 'سياحي', en: 'Tourist' },
    family: { ar: 'عائلي', en: 'Family' }
  };

  async function fetchCompanyPrograms(filters = {}) {
    try {
      const q = new URLSearchParams();
      if (filters.search) q.append('search', filters.search);
      if (filters.category && filters.category !== 'all') q.append('category', filters.category);
      if (filters.type && filters.type !== 'all') q.append('type', filters.type);
      if (filters.status && filters.status !== 'all') q.append('status', filters.status);
      if (filters.availability && filters.availability !== 'all') q.append('availability', filters.availability);
      if (filters.dateFrom) q.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) q.append('dateTo', filters.dateTo);
      if (filters.minPrice) q.append('minPrice', filters.minPrice);
      if (filters.maxPrice) q.append('maxPrice', filters.maxPrice);
      if (filters.duration && filters.duration !== 'all') q.append('duration', filters.duration);

      const res = await apiFetch(`/api/company/programs?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          cachedProgramsList = json.data || [];
          cachedProgramsSummary = json.summary || null;
          return { programs: cachedProgramsList, summary: cachedProgramsSummary };
        }
      }
    } catch (e) {
      console.warn('API /api/company/programs fetch failed, using mock data:', e);
    }

    // Client mock data fallback
    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    if (mockData) {
      cachedProgramsList = mockData.getCompanyPrograms(filters);
      cachedProgramsSummary = mockData.getCompanyProgramsSummary();
      return { programs: cachedProgramsList, summary: cachedProgramsSummary };
    }

    return { programs: [], summary: null };
  }

  function setupProgramsPage() {
    // 1. Search input with debounce & clear button
    const searchInput = document.getElementById('progSearchInput');
    const clearSearchBtn = document.getElementById('btnClearProgSearch');
    let searchDebounceTimer = null;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (clearSearchBtn) clearSearchBtn.style.display = val ? 'flex' : 'none';
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          programsFilterState.search = val;
          renderProgramsPage();
        }, 250);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        clearTimeout(searchDebounceTimer);
        if (searchInput) searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        programsFilterState.search = '';
        renderProgramsPage();
      });
    }

    // 2. Filter dropdowns & inputs
    const catSelect = document.getElementById('filterCategorySelect');
    const typeSelect = document.getElementById('filterTypeSelect');
    const statusSelect = document.getElementById('filterStatusSelect');
    const availSelect = document.getElementById('filterAvailabilitySelect');
    const dateFromInput = document.getElementById('filterDateFrom');
    const dateToInput = document.getElementById('filterDateTo');
    const priceMinInput = document.getElementById('filterPriceMin');
    const priceMaxInput = document.getElementById('filterPriceMax');

    // 3. Filter Action Buttons
    const btnApply = document.getElementById('btnApplyFilters');
    const btnReset = document.getElementById('btnResetFilters');
    const btnResetEmpty = document.getElementById('btnResetEmptyState');

    function applyFilterInputs() {
      programsFilterState.category = catSelect ? catSelect.value : 'all';
      programsFilterState.type = typeSelect ? typeSelect.value : 'all';
      programsFilterState.status = statusSelect ? statusSelect.value : 'all';
      programsFilterState.availability = availSelect ? availSelect.value : 'all';
      programsFilterState.dateFrom = dateFromInput ? dateFromInput.value : '';
      programsFilterState.dateTo = dateToInput ? dateToInput.value : '';
      programsFilterState.minPrice = priceMinInput ? priceMinInput.value : '';
      programsFilterState.maxPrice = priceMaxInput ? priceMaxInput.value : '';
      renderProgramsPage();
    }

    function resetAllFilters() {
      programsFilterState = {
        search: '',
        category: 'all',
        type: 'all',
        status: 'all',
        availability: 'all',
        dateFrom: '',
        dateTo: '',
        minPrice: '',
        maxPrice: '',
        duration: 'all'
      };

      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (catSelect) catSelect.value = 'all';
      if (typeSelect) typeSelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';
      if (availSelect) availSelect.value = 'all';
      if (dateFromInput) dateFromInput.value = '';
      if (dateToInput) dateToInput.value = '';
      if (priceMinInput) priceMinInput.value = '';
      if (priceMaxInput) priceMaxInput.value = '';

      renderProgramsPage();
    }

    if (btnApply) btnApply.addEventListener('click', applyFilterInputs);
    if (btnReset) btnReset.addEventListener('click', resetAllFilters);
    if (btnResetEmpty) btnResetEmpty.addEventListener('click', resetAllFilters);

    // Auto-apply on dropdown changes for maximum usability
    [catSelect, typeSelect, statusSelect, availSelect].forEach(el => {
      if (el) el.addEventListener('change', applyFilterInputs);
    });

    // 4. Add New Program Modal Triggers
    const btnAddProgram = document.getElementById('btnAddProgram');
    if (btnAddProgram) {
      btnAddProgram.addEventListener('click', () => {
        openProgramFormModal();
      });
    }

    // Modal close & backdrop setup
    setupProgramModalsInteractions();
  }

  function setupProgramModalsInteractions() {
    // A. Add/Edit Form Modal
    const formModal = document.getElementById('programFormModal');
    const formCloseBtn = document.getElementById('programModalCloseBtn');
    const formCancelBtn = document.getElementById('btnCancelProgramForm');
    const formBackdrop = document.getElementById('programModalBackdrop');
    const formEl = document.getElementById('programForm');

    function closeFormModalSafe() {
      if (isProgramFormDirty) {
        const confirmMsg = getTranslation('company.prompt_unsaved_changes') ||
          (currentLang === 'ar' ? 'لديك تعديلات غير محفوظة، هل أنت متأكد من رغبتك في إغلاق النموذج وتجاهل التغييرات؟' : 'You have unsaved changes. Are you sure you want to discard them and close the form?');
        if (!confirm(confirmMsg)) return;
      }
      if (formModal) {
        formModal.style.display = 'none';
        formModal.setAttribute('aria-hidden', 'true');
      }
      isProgramFormDirty = false;
    }

    if (formCloseBtn) formCloseBtn.addEventListener('click', closeFormModalSafe);
    if (formCancelBtn) formCancelBtn.addEventListener('click', closeFormModalSafe);
    if (formBackdrop) formBackdrop.addEventListener('click', closeFormModalSafe);

    // Form Dirty Tracking
    if (formEl) {
      formEl.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('change', () => { isProgramFormDirty = true; });
        el.addEventListener('input', () => { isProgramFormDirty = true; });
      });

      formEl.addEventListener('submit', handleProgramFormSubmit);
    }

    // Image Upload Dropzone Setup
    const fileInput = document.getElementById('formImageFile');
    const triggerUploadBtn = document.getElementById('btnTriggerImageUpload');
    const replaceImageBtn = document.getElementById('btnReplaceImage');
    const removeImageBtn = document.getElementById('btnRemoveImage');
    const dropzone = document.getElementById('uploadDropzone');

    if (triggerUploadBtn && fileInput) {
      triggerUploadBtn.addEventListener('click', () => fileInput.click());
    }
    if (replaceImageBtn && fileInput) {
      replaceImageBtn.addEventListener('click', () => fileInput.click());
    }
    if (removeImageBtn) {
      removeImageBtn.addEventListener('click', () => {
        const previewContainer = document.getElementById('uploadPreviewContainer');
        const placeholder = document.getElementById('uploadPlaceholder');
        const imgInput = document.getElementById('formImageUrl');
        if (previewContainer) previewContainer.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
        if (imgInput) imgInput.value = '';
        if (fileInput) fileInput.value = '';
        isProgramFormDirty = true;
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleImageFileSelection(file);
      });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.remove('is-dragover');
        });
      });
      dropzone.addEventListener('drop', (e) => {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleImageFileSelection(file);
      });
    }

    // B. Quick Prices & Dates Modal
    const quickModal = document.getElementById('quickPriceModal');
    const quickCloseBtn = document.getElementById('quickPriceCloseBtn');
    const quickCancelBtn = document.getElementById('quickPriceCancelBtn');
    const quickBackdrop = document.getElementById('quickPriceModalBackdrop');
    const quickForm = document.getElementById('quickPriceForm');

    function closeQuickModal() {
      if (quickModal) {
        quickModal.style.display = 'none';
        quickModal.setAttribute('aria-hidden', 'true');
      }
    }

    if (quickCloseBtn) quickCloseBtn.addEventListener('click', closeQuickModal);
    if (quickCancelBtn) quickCancelBtn.addEventListener('click', closeQuickModal);
    if (quickBackdrop) quickBackdrop.addEventListener('click', closeQuickModal);
    if (quickForm) quickForm.addEventListener('submit', handleQuickPriceFormSubmit);

    // C. Program Details Modal
    const detailsModal = document.getElementById('programDetailsModal');
    const detailsCloseBtn = document.getElementById('programDetailsCloseBtn');
    const detailsDoneBtn = document.getElementById('btnCloseDetailsModal');
    const detailsBackdrop = document.getElementById('programDetailsModalBackdrop');
    const detailsEditBtn = document.getElementById('btnEditFromDetails');

    function closeDetailsModal() {
      if (detailsModal) {
        detailsModal.style.display = 'none';
        detailsModal.setAttribute('aria-hidden', 'true');
      }
    }

    if (detailsCloseBtn) detailsCloseBtn.addEventListener('click', closeDetailsModal);
    if (detailsDoneBtn) detailsDoneBtn.addEventListener('click', closeDetailsModal);
    if (detailsBackdrop) detailsBackdrop.addEventListener('click', closeDetailsModal);
    if (detailsEditBtn) {
      detailsEditBtn.addEventListener('click', () => {
        const progId = detailsEditBtn.getAttribute('data-program-id');
        closeDetailsModal();
        if (progId) openProgramFormModal(progId);
      });
    }

    // D. Safe Archive / Delete Modal
    const archiveModal = document.getElementById('archiveDeleteModal');
    const archiveCloseBtn = document.getElementById('archiveDeleteCancelBtn');
    const archiveBackdrop = document.getElementById('archiveDeleteBackdrop');
    const archiveConfirmBtn = document.getElementById('btnConfirmArchiveDelete');

    function closeArchiveModal() {
      if (archiveModal) {
        archiveModal.style.display = 'none';
        archiveModal.setAttribute('aria-hidden', 'true');
      }
      programToArchiveOrDelete = null;
    }

    if (archiveCloseBtn) archiveCloseBtn.addEventListener('click', closeArchiveModal);
    if (archiveBackdrop) archiveBackdrop.addEventListener('click', closeArchiveModal);
    if (archiveConfirmBtn) archiveConfirmBtn.addEventListener('click', handleConfirmArchiveDelete);

    // Global ESC key closes whichever modal is open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (formModal && formModal.style.display === 'flex') closeFormModalSafe();
        if (quickModal && quickModal.style.display === 'flex') closeQuickModal();
        if (detailsModal && detailsModal.style.display === 'flex') closeDetailsModal();
        if (archiveModal && archiveModal.style.display === 'flex') closeArchiveModal();
      }
    });
  }

  async function handleImageFileSelection(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const errEl = document.getElementById('errImage');
    if (errEl) errEl.textContent = '';

    if (!validTypes.includes(file.type)) {
      const msg = currentLang === 'ar'
        ? 'نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG أو PNG أو WebP.'
        : 'Unsupported file format. Please choose a JPG, PNG, or WebP image.';
      if (errEl) errEl.textContent = msg;
      showCompanyToast(msg, 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = currentLang === 'ar'
        ? 'حجم الصورة يتجاوز الحد المسموح به (5 ميجابايت).'
        : 'Image file size exceeds the 5MB maximum limit.';
      if (errEl) errEl.textContent = msg;
      showCompanyToast(msg, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      const previewImg = document.getElementById('uploadPreviewImg');
      const filenameEl = document.getElementById('uploadPreviewFilename');
      const previewContainer = document.getElementById('uploadPreviewContainer');
      const placeholder = document.getElementById('uploadPlaceholder');
      const imgInput = document.getElementById('formImageUrl');

      if (previewImg) previewImg.src = base64Data;
      if (filenameEl) filenameEl.textContent = file.name;
      if (previewContainer) previewContainer.style.display = 'flex';
      if (placeholder) placeholder.style.display = 'none';

      // Attempt server persistence upload
      try {
        const uploadRes = await apiFetch('/api/company/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Data, filename: file.name })
        });
        if (uploadRes.ok) {
          const json = await uploadRes.json();
          if (json.success && json.url) {
            if (imgInput) imgInput.value = json.url;
            isProgramFormDirty = true;
            return;
          }
        }
      } catch (err) {
        console.warn('Server image upload endpoint unavailable, storing local data URL:', err);
      }

      // Fallback: save data URL directly
      if (imgInput) imgInput.value = base64Data;
      isProgramFormDirty = true;
    };
    reader.readAsDataURL(file);
  }

  function openProgramFormModal(progId = null) {
    const modal = document.getElementById('programFormModal');
    const titleEl = document.getElementById('programModalTitle');
    const formIdInput = document.getElementById('formProgramId');
    const form = document.getElementById('programForm');
    const previewContainer = document.getElementById('uploadPreviewContainer');
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewImg = document.getElementById('uploadPreviewImg');
    const filenameEl = document.getElementById('uploadPreviewFilename');
    const imgInput = document.getElementById('formImageUrl');
    const btnSaveText = document.querySelector('#btnSaveProgram .btn-text');

    if (!modal) return;
    isProgramFormDirty = false;

    // Clear previous validation errors
    document.querySelectorAll('#programForm .field-error').forEach(el => { el.textContent = ''; });
    document.querySelectorAll('#programForm .has-error').forEach(el => { el.classList.remove('has-error'); });

    if (progId) {
      // EDIT MODE
      const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
      const prog = cachedProgramsList.find(p => p.id === progId) || (mockData && mockData.getCompanyProgramById(progId));
      if (!prog) return;

      if (titleEl) {
        titleEl.textContent = getTranslation('company.modal_edit_title') || (currentLang === 'ar' ? 'تعديل بيانات البرنامج' : 'Edit Program / Trip');
      }
      if (btnSaveText) {
        btnSaveText.textContent = getTranslation('company.btn_update_program') || (currentLang === 'ar' ? 'حفظ التعديلات' : 'Save Changes');
      }
      if (formIdInput) formIdInput.value = prog.id;

      // Populate Section 1
      document.getElementById('formNameAr').value = prog.name_ar || '';
      document.getElementById('formNameEn').value = prog.name_en || '';
      document.getElementById('formCode').value = prog.code || '';
      document.getElementById('formCategory').value = prog.category || 'umrah';
      document.getElementById('formType').value = prog.type || 'economy';
      document.getElementById('formStatus').value = prog.status || 'published';
      document.getElementById('formShortDescAr').value = prog.shortDescription_ar || '';
      document.getElementById('formShortDescEn').value = prog.shortDescription_en || '';

      // Image preview
      if (prog.imageUrl) {
        if (imgInput) imgInput.value = prog.imageUrl;
        if (previewImg) previewImg.src = prog.imageUrl;
        if (filenameEl) filenameEl.textContent = prog.name_en || 'program-image.jpg';
        if (previewContainer) previewContainer.style.display = 'flex';
        if (placeholder) placeholder.style.display = 'none';
      } else {
        if (imgInput) imgInput.value = './assets/kaaba-kiswah.jpg';
        if (previewContainer) previewContainer.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
      }

      // Populate Section 2
      document.getElementById('formDepartureDate').value = prog.departureDate || '';
      document.getElementById('formReturnDate').value = prog.returnDate || '';
      document.getElementById('formDepartureTime').value = prog.departureTime || '09:00';
      document.getElementById('formReturnTime').value = prog.returnTime || '18:00';
      document.getElementById('formSeason').value = prog.season || '1447H / 2026';
      document.getElementById('formBookingDeadline').value = prog.bookingDeadline || '';

      // Populate Section 3
      document.getElementById('formMakkahHotelAr').value = prog.makkahHotel_ar || '';
      document.getElementById('formMakkahHotelEn').value = prog.makkahHotel_en || '';
      document.getElementById('formMakkahNights').value = prog.makkahNights || 7;
      document.getElementById('formMakkahDist').value = prog.makkahDistance || 100;
      document.getElementById('formMadinahHotelAr').value = prog.madinahHotel_ar || '';
      document.getElementById('formMadinahHotelEn').value = prog.madinahHotel_en || '';
      document.getElementById('formMadinahNights').value = prog.madinahNights || 6;
      document.getElementById('formMadinahDist').value = prog.madinahDistance || 80;

      // Populate Section 4
      document.getElementById('formAirlineAr').value = prog.airline_ar || '';
      document.getElementById('formAirlineEn').value = prog.airline_en || '';
      document.getElementById('formFlightType').value = prog.flightType || 'direct';
      document.getElementById('formDepAirport').value = prog.departureAirport || 'CAI — مطار القاهرة الدولي';
      document.getElementById('formArrAirport').value = prog.arrivalAirport || 'JED — مطار الملك عبد العزيز بجدة';
      document.getElementById('formTransportAr').value = prog.transportType_ar || '';

      // Populate Section 5
      document.getElementById('formBasePrice').value = prog.unitPrice || prog.basePrice || 45000;
      document.getElementById('formPriceDouble').value = prog.pricing?.doubleRoom || Math.round((prog.unitPrice || 45000) * 1.1);
      document.getElementById('formPriceTriple').value = prog.pricing?.tripleRoom || Math.round((prog.unitPrice || 45000) * 1.05);
      document.getElementById('formPriceQuad').value = prog.pricing?.quadRoom || prog.unitPrice || 45000;
      document.getElementById('formPriceChild').value = prog.pricing?.childPrice || Math.round((prog.unitPrice || 45000) * 0.6);
      document.getElementById('formPriceInfant').value = prog.pricing?.infantPrice || Math.round((prog.unitPrice || 45000) * 0.25);
      document.getElementById('formDeposit').value = prog.pricing?.deposit || Math.round((prog.unitPrice || 45000) * 0.3);

      // Populate Section 6
      document.getElementById('formCapacity').value = prog.capacity || 45;
      document.getElementById('formMinGroup').value = prog.minGroupSize || 1;
      document.getElementById('formAvailability').value = prog.availability || 'available';

      // Populate Section 7
      document.getElementById('formIncluded').value = Array.isArray(prog.includedServices) ? prog.includedServices.join('\n') : '';
      document.getElementById('formExcluded').value = Array.isArray(prog.excludedServices) ? prog.excludedServices.join('\n') : '';
      document.getElementById('formInternalNotes').value = prog.internalNotes || '';

    } else {
      // ADD MODE
      if (titleEl) {
        titleEl.textContent = getTranslation('company.modal_add_title') || (currentLang === 'ar' ? 'إضافة برنامج رحلة جديد' : 'Add New Program / Trip');
      }
      if (btnSaveText) {
        btnSaveText.textContent = getTranslation('company.btn_save_program') || (currentLang === 'ar' ? 'حفظ ونشر البرنامج' : 'Save & Publish Program');
      }
      if (formIdInput) formIdInput.value = '';
      if (form) form.reset();

      // Reset defaults
      document.getElementById('formSeason').value = '1447H / 2026';
      document.getElementById('formDepartureTime').value = '09:00';
      document.getElementById('formReturnTime').value = '18:00';
      document.getElementById('formMakkahNights').value = '7';
      document.getElementById('formMakkahDist').value = '150';
      document.getElementById('formMadinahNights').value = '6';
      document.getElementById('formMadinahDist').value = '100';
      document.getElementById('formDepAirport').value = 'CAI — مطار القاهرة الدولي';
      document.getElementById('formArrAirport').value = 'JED — مطار الملك عبد العزيز بجدة';
      document.getElementById('formBasePrice').value = '45000';
      document.getElementById('formPriceDouble').value = '50000';
      document.getElementById('formPriceTriple').value = '47500';
      document.getElementById('formPriceQuad').value = '45000';
      document.getElementById('formPriceChild').value = '25000';
      document.getElementById('formPriceInfant').value = '10000';
      document.getElementById('formDeposit').value = '15000';
      document.getElementById('formCapacity').value = '45';
      document.getElementById('formMinGroup').value = '1';
      document.getElementById('formIncluded').value = `تأشيرة العمرة / الحج الإلكترونية والتأمين الطبي الشامل
تذاكر الطيران ذهاب وعودة (مصر للطيران)
الإقامة الفندقية المصنفة بمكة المكرمة والمدينة المنورة
الانتقالات الداخلية بحافلات سياحية حديثة ومكيفة
مشرف ديني وإداري مرافق طوال فترة الرحلة
مزارات مكة المكرمة والمدينة المنورة`;
      document.getElementById('formExcluded').value = `المصروفات والطلبات الشخصية
الجولات السياحية والتاريخية الفردية غير المذكورة`;

      if (imgInput) imgInput.value = './assets/kaaba-kiswah.jpg';
      if (previewContainer) previewContainer.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    const firstInput = document.getElementById('formNameAr');
    if (firstInput) firstInput.focus();
  }

  async function handleProgramFormSubmit(e) {
    e.preventDefault();

    const nameAr = document.getElementById('formNameAr').value.trim();
    const nameEn = document.getElementById('formNameEn').value.trim();
    const depDate = document.getElementById('formDepartureDate').value;
    const retDate = document.getElementById('formReturnDate').value;
    const basePrice = Number(document.getElementById('formBasePrice').value);
    const capacity = Number(document.getElementById('formCapacity').value);
    const progId = document.getElementById('formProgramId').value;

    let hasError = false;

    // Reset error messages
    document.querySelectorAll('#programForm .field-error').forEach(el => { el.textContent = ''; });

    if (!nameAr && !nameEn) {
      document.getElementById('errNameAr').textContent = currentLang === 'ar' ? 'يرجى إدخال اسم البرنامج بالعربية أو الإنجليزية' : 'Please enter program title in Arabic or English';
      hasError = true;
    }

    if (!depDate) {
      document.getElementById('errDepartureDate').textContent = currentLang === 'ar' ? 'يرجى تحديد تاريخ السفر' : 'Please select departure date';
      hasError = true;
    }

    if (!retDate) {
      document.getElementById('errReturnDate').textContent = currentLang === 'ar' ? 'يرجى تحديد تاريخ العودة' : 'Please select return date';
      hasError = true;
    } else if (depDate && retDate < depDate) {
      document.getElementById('errReturnDate').textContent = currentLang === 'ar' ? 'تاريخ العودة لا يمكن أن يكون قبل تاريخ المغادرة' : 'Return date cannot be earlier than departure date';
      hasError = true;
    }

    if (!basePrice || basePrice <= 0) {
      document.getElementById('errBasePrice').textContent = currentLang === 'ar' ? 'يرجى إدخال سعر صحيح للبرنامج' : 'Please enter a valid base price';
      hasError = true;
    }

    if (!capacity || capacity <= 0) {
      document.getElementById('errCapacity').textContent = currentLang === 'ar' ? 'يرجى تحديد سعة مقاعد صحيحة' : 'Please enter a valid seat capacity';
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      name_ar: nameAr || nameEn,
      name_en: nameEn || nameAr,
      code: document.getElementById('formCode').value.trim(),
      category: document.getElementById('formCategory').value,
      type: document.getElementById('formType').value,
      status: document.getElementById('formStatus').value,
      shortDescription_ar: document.getElementById('formShortDescAr').value.trim(),
      shortDescription_en: document.getElementById('formShortDescEn').value.trim(),
      imageUrl: document.getElementById('formImageUrl').value || './assets/kaaba-kiswah.jpg',
      departureDate: depDate,
      returnDate: retDate,
      departureTime: document.getElementById('formDepartureTime').value,
      returnTime: document.getElementById('formReturnTime').value,
      season: document.getElementById('formSeason').value.trim() || '1447H / 2026',
      bookingDeadline: document.getElementById('formBookingDeadline').value || depDate,
      makkahHotel_ar: document.getElementById('formMakkahHotelAr').value.trim(),
      makkahHotel_en: document.getElementById('formMakkahHotelEn').value.trim(),
      makkahNights: Number(document.getElementById('formMakkahNights').value) || 7,
      makkahDistance: Number(document.getElementById('formMakkahDist').value) || 100,
      madinahHotel_ar: document.getElementById('formMadinahHotelAr').value.trim(),
      madinahHotel_en: document.getElementById('formMadinahHotelEn').value.trim(),
      madinahNights: Number(document.getElementById('formMadinahNights').value) || 6,
      madinahDistance: Number(document.getElementById('formMadinahDist').value) || 80,
      airline_ar: document.getElementById('formAirlineAr').value.trim(),
      airline_en: document.getElementById('formAirlineEn').value.trim(),
      flightType: document.getElementById('formFlightType').value,
      departureAirport: document.getElementById('formDepAirport').value.trim(),
      arrivalAirport: document.getElementById('formArrAirport').value.trim(),
      transportType_ar: document.getElementById('formTransportAr').value.trim(),
      unitPrice: basePrice,
      basePrice: basePrice,
      pricing: {
        doubleRoom: Number(document.getElementById('formPriceDouble').value) || Math.round(basePrice * 1.1),
        tripleRoom: Number(document.getElementById('formPriceTriple').value) || Math.round(basePrice * 1.05),
        quadRoom: Number(document.getElementById('formPriceQuad').value) || basePrice,
        childPrice: Number(document.getElementById('formPriceChild').value) || Math.round(basePrice * 0.6),
        infantPrice: Number(document.getElementById('formPriceInfant').value) || Math.round(basePrice * 0.25),
        deposit: Number(document.getElementById('formDeposit').value) || Math.round(basePrice * 0.3)
      },
      capacity: capacity,
      minGroupSize: Number(document.getElementById('formMinGroup').value) || 1,
      availability: document.getElementById('formAvailability').value,
      includedServices: document.getElementById('formIncluded').value.split('\n').map(s => s.trim()).filter(Boolean),
      excludedServices: document.getElementById('formExcluded').value.split('\n').map(s => s.trim()).filter(Boolean),
      internalNotes: document.getElementById('formInternalNotes').value.trim()
    };

    const submitBtn = document.getElementById('btnSaveProgram');
    const spinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';

    try {
      if (progId) {
        // UPDATE existing
        let success = false;
        try {
          const res = await apiFetch(`/api/company/programs/${progId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const json = await res.json();
            success = json.success;
          }
        } catch (e) {
          console.warn('Backend PUT /api/company/programs failed, updating mock data:', e);
        }

        const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
        if (!success && mockData) {
          const result = mockData.updateCompanyProgram(progId, payload);
          success = result.success;
        }

        const msg = currentLang === 'ar'
          ? 'تم حفظ وتحديث بيانات البرنامج بنجاح.'
          : 'Program details successfully updated and saved.';
        showCompanyToast(msg, 'success');

      } else {
        // CREATE new
        let success = false;
        try {
          const res = await apiFetch('/api/company/programs', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const json = await res.json();
            success = json.success;
          }
        } catch (e) {
          console.warn('Backend POST /api/company/programs failed, saving to mock data:', e);
        }

        const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
        if (!success && mockData) {
          const result = mockData.createCompanyProgram(payload);
          success = result.success;
        }

        const msg = currentLang === 'ar'
          ? 'تم إضافة البرنامج الجديد ونشره بنجاح.'
          : 'New program successfully created and published.';
        showCompanyToast(msg, 'success');
      }

      isProgramFormDirty = false;
      const modal = document.getElementById('programFormModal');
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }

      await renderProgramsPage();

    } catch (err) {
      console.error('Error saving program:', err);
      showCompanyToast(currentLang === 'ar' ? 'حدث خطأ أثناء حفظ البرنامج. يرجى المحاولة ثانية.' : 'Failed to save program. Please try again.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (spinner) spinner.style.display = 'none';
    }
  }

  function openQuickPriceModal(progId) {
    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    const prog = cachedProgramsList.find(p => p.id === progId) || (mockData && mockData.getCompanyProgramById(progId));
    if (!prog) return;

    const modal = document.getElementById('quickPriceModal');
    if (!modal) return;

    const progNameEl = document.getElementById('quickPriceProgramName');
    if (progNameEl) progNameEl.textContent = (currentLang === 'ar' ? prog.name_ar : prog.name_en) + ` (${prog.code || ''})`;

    document.getElementById('quickProgramId').value = prog.id;
    document.getElementById('quickDepartureDate').value = prog.departureDate || '';
    document.getElementById('quickReturnDate').value = prog.returnDate || '';
    document.getElementById('quickBasePrice').value = prog.unitPrice || prog.basePrice || 45000;
    document.getElementById('quickCapacity').value = prog.capacity || 45;
    document.getElementById('quickPriceDouble').value = prog.pricing?.doubleRoom || Math.round((prog.unitPrice || 45000) * 1.1);
    document.getElementById('quickPriceTriple').value = prog.pricing?.tripleRoom || Math.round((prog.unitPrice || 45000) * 1.05);
    document.getElementById('quickPriceQuad').value = prog.pricing?.quadRoom || prog.unitPrice || 45000;
    document.getElementById('quickAvailability').value = prog.availability || 'available';

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  async function handleQuickPriceFormSubmit(e) {
    e.preventDefault();
    const progId = document.getElementById('quickProgramId').value;
    const depDate = document.getElementById('quickDepartureDate').value;
    const retDate = document.getElementById('quickReturnDate').value;
    const basePrice = Number(document.getElementById('quickBasePrice').value);
    const capacity = Number(document.getElementById('quickCapacity').value);
    const availability = document.getElementById('quickAvailability').value;

    if (!depDate || !retDate) {
      showCompanyToast(currentLang === 'ar' ? 'يرجى تحديد مواعيد السفر والعودة' : 'Please specify departure and return dates', 'error');
      return;
    }
    if (retDate < depDate) {
      showCompanyToast(currentLang === 'ar' ? 'تاريخ العودة لا يمكن أن يكون قبل تاريخ المغادرة' : 'Return date cannot be earlier than departure date', 'error');
      return;
    }

    const payload = {
      departureDate: depDate,
      returnDate: retDate,
      unitPrice: basePrice,
      basePrice: basePrice,
      capacity: capacity,
      availability: availability,
      pricing: {
        doubleRoom: Number(document.getElementById('quickPriceDouble').value) || Math.round(basePrice * 1.1),
        tripleRoom: Number(document.getElementById('quickPriceTriple').value) || Math.round(basePrice * 1.05),
        quadRoom: Number(document.getElementById('quickPriceQuad').value) || basePrice
      }
    };

    try {
      let success = false;
      try {
        const res = await apiFetch(`/api/company/programs/${progId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          success = json.success;
        }
      } catch (err) {
        console.warn('Quick price PUT failed, fallback to mock data:', err);
      }

      const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
      if (!success && mockData) {
        const result = mockData.updateCompanyProgram(progId, payload);
        success = result.success;
      }

      const modal = document.getElementById('quickPriceModal');
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }

      showCompanyToast(currentLang === 'ar' ? 'تم تحديث الأسعار والمواعيد بنجاح.' : 'Prices and dates updated successfully.', 'success');
      await renderProgramsPage();

    } catch (err) {
      console.error('Error updating quick price:', err);
      showCompanyToast(currentLang === 'ar' ? 'فشل تحديث البيانات. يرجى المحاولة لاحقاً.' : 'Failed to update program.', 'error');
    }
  }

  function openProgramDetailsModal(progId) {
    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    const prog = cachedProgramsList.find(p => p.id === progId) || (mockData && mockData.getCompanyProgramById(progId));
    if (!prog) return;

    const modal = document.getElementById('programDetailsModal');
    const contentEl = document.getElementById('programDetailsContent');
    const subtitleEl = document.getElementById('detailsProgramCode');
    const editBtn = document.getElementById('btnEditFromDetails');

    if (!modal || !contentEl) return;
    if (subtitleEl) subtitleEl.textContent = `${prog.code || ''} — ${currentLang === 'ar' ? prog.name_ar : prog.name_en}`;
    if (editBtn) editBtn.setAttribute('data-program-id', prog.id);

    const isAr = currentLang === 'ar';
    const title = isAr ? prog.name_ar : prog.name_en;
    const catLabel = isAr ? (prog.category === 'hajj' ? 'برنامج حج' : 'برنامج عمرة') : (prog.category === 'hajj' ? 'Hajj Program' : 'Umrah Program');
    const typeObj = PROGRAM_TYPE_MAP[prog.type] || { ar: prog.type, en: prog.type };
    const typeLabel = isAr ? typeObj.ar : typeObj.en;
    const statusObj = PROGRAM_STATUS_MAP[prog.status] || { ar: prog.status, en: prog.status, class: 'prog-status-published' };
    const availObj = PROGRAM_AVAIL_MAP[prog.availability] || { ar: prog.availability, en: prog.availability, class: 'prog-avail-available' };

    const reserved = prog.reservedSeats || 0;
    const cap = prog.capacity || 45;
    const avail = prog.availableSeats !== undefined ? prog.availableSeats : Math.max(0, cap - reserved);
    const pct = cap > 0 ? Math.min(100, Math.round((reserved / cap) * 100)) : 0;

    let html = `
      <!-- Details Hero Banner (SHOWS UPLOADED PROGRAM PHOTO HERE) -->
      <div class="details-hero-banner">
        <img src="${prog.imageUrl || './assets/kaaba-kiswah.jpg'}" alt="${title}" class="details-hero-img">
        <div class="details-hero-overlay">
          <div class="details-hero-badges">
            <span class="prog-badge prog-badge-category">${catLabel}</span>
            <span class="prog-badge prog-badge-type">${typeLabel}</span>
            <span class="prog-status-pill ${statusObj.class}">${isAr ? statusObj.ar : statusObj.en}</span>
            <span class="prog-avail-pill ${availObj.class}">${isAr ? availObj.ar : availObj.en}</span>
          </div>
          <h2 class="details-hero-title">${title}</h2>
          <span class="details-hero-code">${prog.code || ''}</span>
        </div>
      </div>

      <!-- Overview Cards Grid -->
      <div class="details-sections-grid">
        
        <!-- Section: Schedule & Dates -->
        <div class="details-card">
          <h3 class="details-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${isAr ? 'مواعيد وجدول الرحلة' : 'Trip Schedule & Dates'}
          </h3>
          <div class="details-props-list">
            <div class="prop-item"><span class="prop-key">${isAr ? 'تاريخ السفر / المغادرة:' : 'Departure Date:'}</span><span class="prop-val">${prog.departureDate || '—'} (${prog.departureTime || '09:00'})</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'تاريخ العودة:' : 'Return Date:'}</span><span class="prop-val">${prog.returnDate || '—'} (${prog.returnTime || '18:00'})</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'المدة الإجمالية:' : 'Total Duration:'}</span><span class="prop-val">${formatNumber(prog.durationDays || 10)} ${isAr ? 'أيام' : 'Days'} / ${formatNumber(prog.durationNights || 9)} ${isAr ? 'ليالٍ' : 'Nights'}</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'الموسم / الحملة:' : 'Season:'}</span><span class="prop-val">${prog.season || '1447H / 2026'}</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'الموعد النهائي لتلقي الحجز:' : 'Booking Deadline:'}</span><span class="prop-val">${prog.bookingDeadline || prog.departureDate || '—'}</span></div>
          </div>
        </div>

        <!-- Section: Accommodations & Distance -->
        <div class="details-card">
          <h3 class="details-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>
            ${isAr ? 'الإقامة الفندقية والقرب من الحرم' : 'Hotels & Haram Proximity'}
          </h3>
          <div class="details-props-list">
            <div class="prop-item">
              <span class="prop-key">${isAr ? 'فندق مكة المكرمة:' : 'Makkah Hotel:'}</span>
              <span class="prop-val"><strong>${isAr ? (prog.makkahHotel_ar || prog.makkahHotel) : (prog.makkahHotel_en || prog.makkahHotel)}</strong> (${formatNumber(prog.makkahNights || 7)} ${isAr ? 'ليالٍ' : 'Nights'})</span>
            </div>
            <div class="prop-item">
              <span class="prop-key">${isAr ? 'المسافة عن الحرم المكي:' : 'Distance to Haram:'}</span>
              <span class="prop-val"><span class="distance-pill">${formatNumber(prog.makkahDistance || 100)} ${isAr ? 'متر' : 'meters'}</span></span>
            </div>
            <div class="prop-item">
              <span class="prop-key">${isAr ? 'فندق المدينة المنورة:' : 'Madinah Hotel:'}</span>
              <span class="prop-val"><strong>${isAr ? (prog.madinahHotel_ar || prog.madinahHotel) : (prog.madinahHotel_en || prog.madinahHotel)}</strong> (${formatNumber(prog.madinahNights || 6)} ${isAr ? 'ليالٍ' : 'Nights'})</span>
            </div>
            <div class="prop-item">
              <span class="prop-key">${isAr ? 'المسافة عن المسجد النبوي:' : 'Distance to Prophet’s Mosque:'}</span>
              <span class="prop-val"><span class="distance-pill">${formatNumber(prog.madinahDistance || 80)} ${isAr ? 'متر' : 'meters'}</span></span>
            </div>
          </div>
        </div>

        <!-- Section: Flights & Transportation -->
        <div class="details-card">
          <h3 class="details-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            ${isAr ? 'الطيران والانتقالات' : 'Flights & Transfers'}
          </h3>
          <div class="details-props-list">
            <div class="prop-item"><span class="prop-key">${isAr ? 'الناقل الجوي:' : 'Airline:'}</span><span class="prop-val">${isAr ? (prog.airline_ar || prog.airline) : (prog.airline_en || prog.airline)}</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'نوع الرحلة:' : 'Flight Type:'}</span><span class="prop-val">${prog.flightType === 'transit' ? (isAr ? 'ترانزيت' : 'Transit') : (isAr ? 'مباشر بدون توقف' : 'Direct')}</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'مطار المغادرة:' : 'Departure Airport:'}</span><span class="prop-val">${prog.departureAirport || 'CAI — مطار القاهرة الدولي'}</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'مطار الوصول:' : 'Arrival Airport:'}</span><span class="prop-val">${prog.arrivalAirport || 'JED — مطار الملك عبد العزيز'}</span></div>
            <div class="prop-item"><span class="prop-key">${isAr ? 'الانتقالات البرية:' : 'Ground Transport:'}</span><span class="prop-val">${isAr ? (prog.transportType_ar || 'حافلات سياحية حديثة') : (prog.transportType_en || 'Modern AC Buses')}</span></div>
          </div>
        </div>

        <!-- Section: Room Pricing Breakdown -->
        <div class="details-card">
          <h3 class="details-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            ${isAr ? 'باقات وتسعير الغرف' : 'Room Rates & Pricing'}
          </h3>
          <div class="details-pricing-grid">
            <div class="pricing-tile">
              <span class="tile-label">${isAr ? 'سعر الأساس للفرد' : 'Base Rate (Quad)'}</span>
              <span class="tile-val">${formatCurrency(prog.unitPrice || prog.basePrice || 45000)}</span>
            </div>
            <div class="pricing-tile">
              <span class="tile-label">${isAr ? 'غرفة ثنائية (Double)' : 'Double Room'}</span>
              <span class="tile-val">${formatCurrency(prog.pricing?.doubleRoom || Math.round((prog.unitPrice || 45000) * 1.1))}</span>
            </div>
            <div class="pricing-tile">
              <span class="tile-label">${isAr ? 'غرفة ثلاثية (Triple)' : 'Triple Room'}</span>
              <span class="tile-val">${formatCurrency(prog.pricing?.tripleRoom || Math.round((prog.unitPrice || 45000) * 1.05))}</span>
            </div>
            <div class="pricing-tile">
              <span class="tile-label">${isAr ? 'مقدم الحجز المطلوب' : 'Deposit Required'}</span>
              <span class="tile-val">${formatCurrency(prog.pricing?.deposit || Math.round((prog.unitPrice || 45000) * 0.3))}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Capacity & Booking Gauge -->
      <div class="details-capacity-card">
        <div class="capacity-gauge-header">
          <span class="gauge-title">${isAr ? 'إشغال المقاعد وحالة الحجز' : 'Seat Occupancy & Availability'}</span>
          <span class="gauge-stats">${isAr ? `تم حجز ${formatNumber(reserved)} من أصل ${formatNumber(cap)} مقعد (${formatNumber(avail)} مقعد متاح)` : `${formatNumber(reserved)} of ${formatNumber(cap)} seats booked (${formatNumber(avail)} available)`}</span>
        </div>
        <div class="gauge-track">
          <div class="gauge-fill" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- Inclusions & Exclusions -->
      <div class="details-inclusions-grid">
        <div class="inclusions-column">
          <h4 class="inc-col-title">${isAr ? 'الخدمات المشمولة بالباقة' : 'Included Services'}</h4>
          <ul class="inc-list">
            ${Array.isArray(prog.includedServices) ? prog.includedServices.map(s => `<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${s}</span></li>`).join('') : ''}
          </ul>
        </div>
        <div class="inclusions-column exclusions-col">
          <h4 class="inc-col-title">${isAr ? 'الخدمات غير المشمولة' : 'Excluded Services'}</h4>
          <ul class="inc-list">
            ${Array.isArray(prog.excludedServices) ? prog.excludedServices.map(s => `<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span>${s}</span></li>`).join('') : ''}
          </ul>
        </div>
      </div>

      <!-- Itinerary Timeline -->
      ${Array.isArray(prog.itinerary) && prog.itinerary.length ? `
        <div class="details-itinerary-section">
          <h4 class="itinerary-title">${isAr ? 'المسار والبرنامج اليومي' : 'Daily Itinerary & Milestones'}</h4>
          <div class="itinerary-timeline">
            ${prog.itinerary.map((it, idx) => `
              <div class="itinerary-step">
                <div class="step-num">${isAr ? `اليوم ${formatNumber(it.day || idx + 1)}` : `Day ${formatNumber(it.day || idx + 1)}`}</div>
                <div class="step-content">${isAr ? (it.title_ar || it.title) : (it.title_en || it.title)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Internal Operations Notes (Staff Only) -->
      ${prog.internalNotes ? `
        <div class="details-internal-notes">
          <div class="notes-header">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <strong>${isAr ? 'ملاحظات الشركة الداخلية (سرية — لطاقم العمل فقط):' : 'Internal Staff Notes (Restricted):'}</strong>
          </div>
          <p class="notes-body">${prog.internalNotes}</p>
        </div>
      ` : ''}
    `;

    contentEl.innerHTML = html;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function openArchiveDeleteModal(progId) {
    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    const prog = cachedProgramsList.find(p => p.id === progId) || (mockData && mockData.getCompanyProgramById(progId));
    if (!prog) return;

    programToArchiveOrDelete = prog;

    const modal = document.getElementById('archiveDeleteModal');
    const titleEl = document.getElementById('archiveDeleteTitle');
    const msgEl = document.getElementById('archiveDeleteMessage');
    const btnTextEl = document.getElementById('archiveDeleteBtnText');
    const isAr = currentLang === 'ar';

    // Check if bookings exist in RAW_BOOKINGS
    const hasBookings = (mockData && mockData.RAW_BOOKINGS)
      ? mockData.RAW_BOOKINGS.some(b => b.programId === prog.id)
      : (prog.reservedSeats && prog.reservedSeats > 0);

    const progName = isAr ? prog.name_ar : prog.name_en;

    if (hasBookings) {
      if (titleEl) titleEl.textContent = isAr ? `أرشفة البرنامج: ${progName}` : `Archive Program: ${progName}`;
      if (msgEl) {
        msgEl.textContent = isAr
          ? `هذا البرنامج مرتبط بحجوزات فعلية لعملاء المنصة. حفاظاً على سلامة السجلات المالية والتعاقدية، سيتم أرشفة البرنامج وإيقاف تلقي حجوزات جديدة عليه بأمان دون حذف أي سجل تاريخي.`
          : `This program has active customer bookings. To protect contractual and financial integrity, this program will be safely archived without deleting any historical booking records.`;
      }
      if (btnTextEl) btnTextEl.textContent = isAr ? 'تأكيد أرشفة البرنامج بأمان' : 'Safely Archive Program';
    } else {
      if (titleEl) titleEl.textContent = isAr ? `حذف البرنامج: ${progName}` : `Delete Program: ${progName}`;
      if (msgEl) {
        msgEl.textContent = isAr
          ? `هل أنت متأكد من رغبتك في حذف هذا البرنامج نهائياً؟ لم يتم تسجيل أي حجوزات عليه حتى الآن. هذا الإجراء لا يمكن التراجع عنه.`
          : `Are you sure you want to permanently delete this program? No bookings exist for it. This action cannot be undone.`;
      }
      if (btnTextEl) btnTextEl.textContent = isAr ? 'تأكيد حذف البرنامج' : 'Permanently Delete';
    }

    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  async function handleConfirmArchiveDelete() {
    if (!programToArchiveOrDelete) return;
    const progId = programToArchiveOrDelete.id;

    try {
      let result = null;
      try {
        const res = await apiFetch(`/api/company/programs/${progId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          result = await res.json();
        }
      } catch (err) {
        console.warn('Backend DELETE /api/company/programs failed, using mock data:', err);
      }

      const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
      if (!result && mockData) {
        result = mockData.archiveOrDeleteCompanyProgram(progId);
      }

      const modal = document.getElementById('archiveDeleteModal');
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }

      const msg = result && (currentLang === 'ar' ? result.message_ar : result.message_en)
        ? (currentLang === 'ar' ? result.message_ar : result.message_en)
        : (currentLang === 'ar' ? 'تمت العملية بنجاح.' : 'Operation completed successfully.');

      showCompanyToast(msg, 'success');
      await renderProgramsPage();

    } catch (err) {
      console.error('Error in archive/delete:', err);
      showCompanyToast(currentLang === 'ar' ? 'حدث خطأ أثناء معالجة الطلب.' : 'Failed to process request.', 'error');
    } finally {
      programToArchiveOrDelete = null;
    }
  }

  async function renderProgramsPage() {
    const { programs, summary } = await fetchCompanyPrograms(programsFilterState);

    // 1. Render Summary KPI Cards
    if (summary) {
      const elTotal = document.getElementById('kpiTotalPrograms');
      const elActive = document.getElementById('kpiActivePublished');
      const elUpcoming = document.getElementById('kpiUpcomingTrips');
      const elCapacity = document.getElementById('kpiAvailableCapacity');
      const elDraft = document.getElementById('kpiDraftUnpublished');

      if (elTotal) elTotal.textContent = formatNumber(summary.totalPrograms);
      if (elActive) elActive.textContent = formatNumber(summary.activePublished);
      if (elUpcoming) elUpcoming.textContent = formatNumber(summary.upcomingTrips);
      if (elCapacity) elCapacity.textContent = formatNumber(summary.totalAvailableCapacity);
      if (elDraft) elDraft.textContent = formatNumber(summary.draftUnpublished);
    }

    // 2. Render Active Filter Chips
    renderProgramsFilterChips();

    // 3. Results Count
    const countEl = document.getElementById('programsResultsCount');
    if (countEl) {
      const countStr = formatNumber(programs.length);
      const totalStr = formatNumber(cachedProgramsSummary ? cachedProgramsSummary.totalPrograms : programs.length);
      countEl.textContent = currentLang === 'ar'
        ? `عرض ${countStr} من ${totalStr} برامج`
        : `Showing ${countStr} of ${totalStr} programs`;
    }

    // 4. Render Programs Listing Grid (CRITICAL: ZERO IMAGES INSIDE CARDS)
    const grid = document.getElementById('programsCardsGrid');
    const emptyState = document.getElementById('programsEmptyState');

    if (!grid) return;

    if (!programs || programs.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const isAr = currentLang === 'ar';
    let html = '';

    programs.forEach(prog => {
      const title = isAr ? prog.name_ar : prog.name_en;
      const catLabel = isAr ? (prog.category === 'hajj' ? 'برنامج حج' : 'برنامج عمرة') : (prog.category === 'hajj' ? 'Hajj' : 'Umrah');
      const typeObj = PROGRAM_TYPE_MAP[prog.type] || { ar: prog.type, en: prog.type };
      const typeLabel = isAr ? typeObj.ar : typeObj.en;
      const statusObj = PROGRAM_STATUS_MAP[prog.status] || { ar: prog.status, en: prog.status, class: 'prog-status-published' };
      const availObj = PROGRAM_AVAIL_MAP[prog.availability] || { ar: prog.availability, en: prog.availability, class: 'prog-avail-available' };

      const makkahHotel = isAr ? (prog.makkahHotel_ar || prog.makkahHotel) : (prog.makkahHotel_en || prog.makkahHotel);
      const madinahHotel = isAr ? (prog.madinahHotel_ar || prog.madinahHotel) : (prog.madinahHotel_en || prog.madinahHotel);
      const airline = isAr ? (prog.airline_ar || prog.airline) : (prog.airline_en || prog.airline);
      const destination = isAr ? (prog.destination_ar || 'مكة المكرمة والمدينة المنورة') : (prog.destination_en || 'Makkah & Madinah');

      const reserved = prog.reservedSeats || 0;
      const cap = prog.capacity || 45;
      const avail = prog.availableSeats !== undefined ? prog.availableSeats : Math.max(0, cap - reserved);
      const pct = cap > 0 ? Math.min(100, Math.round((reserved / cap) * 100)) : 0;

      // STRICT REQUIREMENT: Clean, information-focused cards with ZERO images/photos/thumbnails
      html += `
        <article class="program-card ${prog.status === 'archived' ? 'is-archived' : ''}" data-program-id="${prog.id}">
          
          <!-- Card Header Badges -->
          <div class="program-card-header">
            <div class="card-badges-left">
              <span class="prog-badge prog-badge-category">${catLabel}</span>
              <span class="prog-badge prog-badge-type">${typeLabel}</span>
            </div>
            <div class="card-badges-right">
              <span class="prog-status-pill ${statusObj.class}">${isAr ? statusObj.ar : statusObj.en}</span>
              <span class="prog-avail-pill ${availObj.class}">${isAr ? availObj.ar : availObj.en}</span>
            </div>
          </div>

          <!-- Title & Reference Code -->
          <div class="program-card-title-row">
            <h3 class="program-card-title">${title}</h3>
            <span class="program-card-code" title="${isAr ? 'رمز البرنامج' : 'Program Code'}">${prog.code || ''}</span>
          </div>

          <!-- Essential Information Grid -->
          <div class="program-card-body">
            
            <!-- Dates & Duration -->
            <div class="card-info-item">
              <span class="card-info-label">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${isAr ? 'مواعيد الرحلة والمدة:' : 'Schedule & Duration:'}
              </span>
              <span class="card-info-val">
                ${prog.departureDate || '—'} ➔ ${prog.returnDate || '—'} 
                <span class="duration-highlight">(${formatNumber(prog.durationDays || 10)} ${isAr ? 'أيام' : 'Days'} / ${formatNumber(prog.durationNights || 9)} ${isAr ? 'ليالٍ' : 'Nights'})</span>
              </span>
            </div>

            <!-- Destination & Routing -->
            <div class="card-info-item">
              <span class="card-info-label">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${isAr ? 'خط السير والوجهة:' : 'Routing & Destination:'}
              </span>
              <span class="card-info-val">${isAr ? (prog.departureCity_ar || 'القاهرة') : (prog.departureCity_en || 'Cairo')} ➔ ${destination}</span>
            </div>

            <!-- Accommodations -->
            <div class="card-info-item">
              <span class="card-info-label">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>
                ${isAr ? 'الفنادق والإقامة:' : 'Hotels & Lodging:'}
              </span>
              <span class="card-info-val">
                <span><strong>${isAr ? 'مكة:' : 'Makkah:'}</strong> ${makkahHotel || '—'} <span class="dist-tag">(${formatNumber(prog.makkahDistance || 100)}م)</span></span>
                <span class="hotel-sep">|</span>
                <span><strong>${isAr ? 'المدينة:' : 'Madinah:'}</strong> ${madinahHotel || '—'} <span class="dist-tag">(${formatNumber(prog.madinahDistance || 80)}م)</span></span>
              </span>
            </div>

            <!-- Airline & Transport -->
            <div class="card-info-item">
              <span class="card-info-label">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                ${isAr ? 'الطيران والانتقالات:' : 'Airlines & Transport:'}
              </span>
              <span class="card-info-val">${airline || '—'} • ${isAr ? (prog.transportType_ar || 'حافلات حديثة') : (prog.transportType_en || 'Modern Coaches')}</span>
            </div>

            <!-- Capacity Progress Bar -->
            <div class="card-capacity-box">
              <div class="capacity-stats-row">
                <span class="cap-label">${isAr ? 'إشغال المقاعد:' : 'Seat Occupancy:'}</span>
                <span class="cap-stats-text">${isAr ? `تم حجز ${formatNumber(reserved)} من ${formatNumber(cap)} مقعد (${formatNumber(avail)} متاح)` : `${formatNumber(reserved)} of ${formatNumber(cap)} booked (${formatNumber(avail)} available)`}</span>
              </div>
              <div class="prog-capacity-bar">
                <div class="prog-capacity-fill" style="width: ${pct}%;"></div>
              </div>
            </div>

            <!-- Pricing Row -->
            <div class="card-pricing-row">
              <div class="pricing-label-col">
                <span class="price-eyebrow">${isAr ? 'يبدأ من' : 'Starting from'}</span>
                <div class="price-value-wrap">
                  <span class="price-amount">${formatCurrency(prog.unitPrice || prog.basePrice || 45000)}</span>
                  <span class="price-unit">${isAr ? '/ للفرد' : '/ person'}</span>
                </div>
              </div>
              <div class="status-date-col">
                <span class="last-updated-text">${isAr ? 'الموسم:' : 'Season:'} ${prog.season || '1447H'}</span>
              </div>
            </div>

          </div>

          <!-- Card Actions Toolbar -->
          <div class="program-card-actions">
            <button type="button" class="btn btn-primary btn-sm btn-action-view" onclick="window.MiqatCompanyPortal.openDetails('${prog.id}')">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>${isAr ? 'عرض التفاصيل' : 'View Details'}</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm btn-action-edit" onclick="window.MiqatCompanyPortal.openEdit('${prog.id}')">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>${isAr ? 'تعديل البرنامج' : 'Edit Program'}</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm btn-action-quick" onclick="window.MiqatCompanyPortal.openQuickPrice('${prog.id}')">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              <span>${isAr ? 'إدارة الأسعار والمواعيد' : 'Manage Prices & Dates'}</span>
            </button>
            <!-- STRICT RULE: Delete button is NOT red, uses secondary token -->
            <button type="button" class="btn btn-secondary btn-sm btn-action-delete" onclick="window.MiqatCompanyPortal.openArchiveDelete('${prog.id}')">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
              <span>${isAr ? 'حذف / أرشفة' : 'Delete / Archive'}</span>
            </button>
          </div>

        </article>
      `;
    });

    grid.innerHTML = html;
  }

  function renderProgramsFilterChips() {
    const container = document.getElementById('activeFilterChipsContainer');
    const list = document.getElementById('activeFilterChipsList');
    if (!container || !list) return;

    const isAr = currentLang === 'ar';
    const chips = [];

    if (programsFilterState.search) {
      chips.push({
        label: `${isAr ? 'بحث' : 'Search'}: "${programsFilterState.search}"`,
        clear: () => {
          programsFilterState.search = '';
          const inp = document.getElementById('progSearchInput');
          const btn = document.getElementById('btnClearProgSearch');
          if (inp) inp.value = '';
          if (btn) btn.style.display = 'none';
        }
      });
    }

    if (programsFilterState.category && programsFilterState.category !== 'all') {
      const catLabel = programsFilterState.category === 'hajj' ? (isAr ? 'برامج الحج' : 'Hajj') : (isAr ? 'برامج العمرة' : 'Umrah');
      chips.push({
        label: `${isAr ? 'التصنيف' : 'Category'}: ${catLabel}`,
        clear: () => {
          programsFilterState.category = 'all';
          const sel = document.getElementById('filterCategorySelect');
          if (sel) sel.value = 'all';
        }
      });
    }

    if (programsFilterState.type && programsFilterState.type !== 'all') {
      const typeObj = PROGRAM_TYPE_MAP[programsFilterState.type] || { ar: programsFilterState.type, en: programsFilterState.type };
      chips.push({
        label: `${isAr ? 'النوع' : 'Type'}: ${isAr ? typeObj.ar : typeObj.en}`,
        clear: () => {
          programsFilterState.type = 'all';
          const sel = document.getElementById('filterTypeSelect');
          if (sel) sel.value = 'all';
        }
      });
    }

    if (programsFilterState.status && programsFilterState.status !== 'all') {
      const statusObj = PROGRAM_STATUS_MAP[programsFilterState.status] || { ar: programsFilterState.status, en: programsFilterState.status };
      chips.push({
        label: `${isAr ? 'الحالة' : 'Status'}: ${isAr ? statusObj.ar : statusObj.en}`,
        clear: () => {
          programsFilterState.status = 'all';
          const sel = document.getElementById('filterStatusSelect');
          if (sel) sel.value = 'all';
        }
      });
    }

    if (programsFilterState.availability && programsFilterState.availability !== 'all') {
      const availObj = PROGRAM_AVAIL_MAP[programsFilterState.availability] || { ar: programsFilterState.availability, en: programsFilterState.availability };
      chips.push({
        label: `${isAr ? 'الإتاحة' : 'Availability'}: ${isAr ? availObj.ar : availObj.en}`,
        clear: () => {
          programsFilterState.availability = 'all';
          const sel = document.getElementById('filterAvailabilitySelect');
          if (sel) sel.value = 'all';
        }
      });
    }

    if (programsFilterState.dateFrom) {
      chips.push({
        label: `${isAr ? 'من' : 'From'}: ${programsFilterState.dateFrom}`,
        clear: () => {
          programsFilterState.dateFrom = '';
          const inp = document.getElementById('filterDateFrom');
          if (inp) inp.value = '';
        }
      });
    }

    if (programsFilterState.dateTo) {
      chips.push({
        label: `${isAr ? 'إلى' : 'To'}: ${programsFilterState.dateTo}`,
        clear: () => {
          programsFilterState.dateTo = '';
          const inp = document.getElementById('filterDateTo');
          if (inp) inp.value = '';
        }
      });
    }

    if (programsFilterState.minPrice) {
      chips.push({
        label: `${isAr ? 'أدنى سعر' : 'Min Price'}: ${formatNumber(Number(programsFilterState.minPrice))} ${isAr ? 'ج.م' : 'EGP'}`,
        clear: () => {
          programsFilterState.minPrice = '';
          const inp = document.getElementById('filterPriceMin');
          if (inp) inp.value = '';
        }
      });
    }

    if (programsFilterState.maxPrice) {
      chips.push({
        label: `${isAr ? 'أقصى سعر' : 'Max Price'}: ${formatNumber(Number(programsFilterState.maxPrice))} ${isAr ? 'ج.م' : 'EGP'}`,
        clear: () => {
          programsFilterState.maxPrice = '';
          const inp = document.getElementById('filterPriceMax');
          if (inp) inp.value = '';
        }
      });
    }

    if (chips.length === 0) {
      container.style.display = 'none';
      list.innerHTML = '';
      return;
    }

    container.style.display = 'flex';
    list.innerHTML = '';

    chips.forEach((c, idx) => {
      const chipEl = document.createElement('div');
      chipEl.className = 'filter-chip';
      chipEl.innerHTML = `
        <span class="chip-text">${c.label}</span>
        <button type="button" class="chip-remove-btn" aria-label="${isAr ? 'إزالة الفلتر' : 'Remove filter'}" data-chip-idx="${idx}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      const removeBtn = chipEl.querySelector('.chip-remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          c.clear();
          renderProgramsPage();
        });
      }

      list.appendChild(chipEl);
    });
  }

  // Global window helpers for inline onclick in cards
  window.MiqatCompanyPortal = window.MiqatCompanyPortal || {};
  window.MiqatCompanyPortal.openDetails = openProgramDetailsModal;
  window.MiqatCompanyPortal.openEdit = openProgramFormModal;
  window.MiqatCompanyPortal.openQuickPrice = openQuickPriceModal;
  window.MiqatCompanyPortal.openArchiveDelete = openArchiveDeleteModal;
  window.MiqatCompanyPortal.renderPrograms = renderProgramsPage;
  window.MiqatCompanyPortal.programsFilterState = programsFilterState;


  // =========================================================================
  // SECTION 6: NOTIFICATIONS & ALERTS CENTER CONTROLLER
  // =========================================================================

  let notifFilterState = {
    period: 'all',
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    bookingRef: '',
    search: ''
  };

  let activeAdminNoticeNotifId = null;

  function formatRelativeTime(dateInput) {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;
    // Base reference date for simulation late October 2026
    const baseNow = new Date('2026-10-29T18:00:00.000Z');
    const diffMs = baseNow - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    const isAr = currentLang === 'ar';

    if (diffMin < 2) return isAr ? 'الآن' : 'Just now';
    if (diffMin < 60) return isAr ? `منذ ${formatNumber(diffMin)} دقيقة` : `${diffMin}m ago`;
    if (diffHrs < 24) return isAr ? `منذ ${formatNumber(diffHrs)} ساعة` : `${diffHrs}h ago`;
    if (diffDays === 1) return isAr ? 'أمس' : 'Yesterday';
    if (diffDays === 2) return isAr ? 'منذ يومين' : '2 days ago';
    if (diffDays < 7) return isAr ? `منذ ${formatNumber(diffDays)} أيام` : `${diffDays} days ago`;
    return d.toISOString().slice(0, 10);
  }

  function getNotifTypeMeta(type) {
    const isAr = currentLang === 'ar';
    switch (type) {
      case 'new_booking':
        return {
          label: isAr ? 'حجز جديد' : 'New Booking',
          badgeClass: 'badge-type-new-booking',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
        };
      case 'deposit_received':
        return {
          label: isAr ? 'سداد الدفعة المقدمة' : 'Deposit Received',
          badgeClass: 'badge-type-deposit',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`
        };
      case 'payment_update':
        return {
          label: isAr ? 'تحديث دفعة مالية' : 'Payment Update',
          badgeClass: 'badge-type-payment',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        };
      case 'program_change':
        return {
          label: isAr ? 'طلب تعديل الرحلة' : 'Program Change Request',
          badgeClass: 'badge-type-change',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`
        };
      case 'booking_rejected':
        return {
          label: isAr ? 'إلغاء / رفض الحجز' : 'Booking Rejected',
          badgeClass: 'badge-type-rejected',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
        };
      case 'admin_update':
        return {
          label: isAr ? 'تعميم إداري رسمي' : 'Official Circular',
          badgeClass: 'badge-type-admin',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`
        };
      default:
        return {
          label: isAr ? 'إشعار عام' : 'Notification',
          badgeClass: 'badge-type-default',
          iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
        };
    }
  }

  async function fetchNotificationsList(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.period && filters.period !== 'all') queryParams.set('period', filters.period);
      if (filters.type && filters.type !== 'all') queryParams.set('type', filters.type);
      if (filters.status && filters.status !== 'all') queryParams.set('status', filters.status);
      if (filters.dateFrom) queryParams.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.set('dateTo', filters.dateTo);
      if (filters.bookingRef) queryParams.set('bookingRef', filters.bookingRef);
      if (filters.search) queryParams.set('search', filters.search);

      const res = await apiFetch(`/api/company/notifications?${queryParams.toString()}`);
      if (res.ok) {
        const body = await res.json();
        if (body.success && Array.isArray(body.data)) {
          return body.data;
        }
      }
    } catch (err) {
      console.warn('API fetch notifications error, falling back to mock data:', err);
    }

    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    if (mockData && mockData.getCompanyNotifications) {
      return mockData.getCompanyNotifications(filters);
    }
    return [];
  }

  async function fetchNotificationsSummary() {
    try {
      const res = await apiFetch('/api/company/notifications/summary');
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data) return body.data;
      }
    } catch (err) {
      console.warn('API fetch notifications summary error, falling back to mock:', err);
    }

    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    if (mockData && mockData.getCompanyNotificationsSummary) {
      return mockData.getCompanyNotificationsSummary();
    }
    return { total: 0, unread: 0, read: 0, today: 0 };
  }

  async function updateNavbarNotificationsBadge() {
    const summary = await fetchNotificationsSummary();
    const unreadCount = summary.unread || 0;
    const formatted = formatNumber(unreadCount);

    const badgeEl = document.getElementById('navNotificationsCount');
    const mobileBadgeEl = document.getElementById('mobileNavNotificationsCount');
    const headerBadgeEl = document.getElementById('headerUnreadBadge');
    const headerBadgeText = document.getElementById('headerUnreadText');

    if (badgeEl) {
      badgeEl.textContent = formatted;
      badgeEl.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }
    if (mobileBadgeEl) {
      mobileBadgeEl.textContent = formatted;
      mobileBadgeEl.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }
    if (headerBadgeText) {
      const isAr = currentLang === 'ar';
      headerBadgeText.textContent = isAr 
        ? `${formatted} إشعارات غير مقروءة`
        : `${formatted} Unread Notifications`;
    }
    if (headerBadgeEl) {
      headerBadgeEl.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }
  }

  function renderNotificationsKpis(summary) {
    const totalEl = document.getElementById('kpiTotalNotifications');
    const unreadEl = document.getElementById('kpiUnreadNotifications');
    const readEl = document.getElementById('kpiReadNotifications');
    const todayEl = document.getElementById('kpiTodayNotifications');

    if (totalEl) totalEl.textContent = formatNumber(summary.total || 0);
    if (unreadEl) unreadEl.textContent = formatNumber(summary.unread || 0);
    if (readEl) readEl.textContent = formatNumber(summary.read || 0);
    if (todayEl) todayEl.textContent = formatNumber(summary.today || 0);

    // Update active highlight on KPI cards
    document.querySelectorAll('.notif-kpi-card').forEach(c => c.classList.remove('is-active-filter'));
    if (notifFilterState.period === 'today') {
      const card = document.getElementById('kpiTodayNotificationsCard');
      if (card) card.classList.add('is-active-filter');
    } else if (notifFilterState.status === 'unread') {
      const card = document.getElementById('kpiUnreadNotificationsCard');
      if (card) card.classList.add('is-active-filter');
    } else if (notifFilterState.status === 'read') {
      const card = document.getElementById('kpiReadNotificationsCard');
      if (card) card.classList.add('is-active-filter');
    } else if (notifFilterState.period === 'all' && notifFilterState.status === 'all' && notifFilterState.type === 'all' && !notifFilterState.dateFrom && !notifFilterState.dateTo && !notifFilterState.bookingRef && !notifFilterState.search) {
      const card = document.getElementById('kpiTotalNotificationsCard');
      if (card) card.classList.add('is-active-filter');
    }
  }

  function renderNotificationsActiveChips(totalCount, filteredCount) {
    const container = document.getElementById('notifActiveChips');
    const countEl = document.getElementById('notifResultsCount');
    const isAr = currentLang === 'ar';

    if (countEl) {
      countEl.textContent = isAr
        ? `عرض ${formatNumber(filteredCount)} من أصل ${formatNumber(totalCount)} إشعار`
        : `Showing ${filteredCount} of ${totalCount} notifications`;
    }

    if (!container) return;
    container.innerHTML = '';

    const chips = [];

    if (notifFilterState.period && notifFilterState.period !== 'all') {
      const periodNames = {
        today: isAr ? 'إشعارات اليوم' : 'Today',
        week: isAr ? 'آخر 7 أيام' : 'Last 7 Days',
        month: isAr ? 'آخر 30 يوماً' : 'Last 30 Days'
      };
      chips.push({
        label: `${isAr ? 'الفترة' : 'Period'}: ${periodNames[notifFilterState.period] || notifFilterState.period}`,
        clear: () => {
          notifFilterState.period = 'all';
          updatePeriodTabsUI('all');
        }
      });
    }

    if (notifFilterState.type && notifFilterState.type !== 'all') {
      const typeMeta = getNotifTypeMeta(notifFilterState.type);
      chips.push({
        label: `${isAr ? 'النوع' : 'Type'}: ${typeMeta.label}`,
        clear: () => {
          notifFilterState.type = 'all';
          const sel = document.getElementById('filterNotifType');
          if (sel) sel.value = 'all';
        }
      });
    }

    if (notifFilterState.status && notifFilterState.status !== 'all') {
      const statusLabels = {
        unread: isAr ? 'غير المقروءة' : 'Unread Only',
        read: isAr ? 'المقروءة' : 'Read Only'
      };
      chips.push({
        label: `${isAr ? 'الحالة' : 'Status'}: ${statusLabels[notifFilterState.status] || notifFilterState.status}`,
        clear: () => {
          notifFilterState.status = 'all';
          const sel = document.getElementById('filterNotifStatus');
          if (sel) sel.value = 'all';
        }
      });
    }

    if (notifFilterState.dateFrom) {
      chips.push({
        label: `${isAr ? 'من' : 'From'}: ${notifFilterState.dateFrom}`,
        clear: () => {
          notifFilterState.dateFrom = '';
          const inp = document.getElementById('filterNotifDateFrom');
          if (inp) inp.value = '';
        }
      });
    }

    if (notifFilterState.dateTo) {
      chips.push({
        label: `${isAr ? 'إلى' : 'To'}: ${notifFilterState.dateTo}`,
        clear: () => {
          notifFilterState.dateTo = '';
          const inp = document.getElementById('filterNotifDateTo');
          if (inp) inp.value = '';
        }
      });
    }

    if (notifFilterState.bookingRef) {
      chips.push({
        label: `${isAr ? 'الحجز' : 'Booking'}: ${notifFilterState.bookingRef}`,
        clear: () => {
          notifFilterState.bookingRef = '';
          const inp = document.getElementById('filterNotifBookingRef');
          if (inp) inp.value = '';
        }
      });
    }

    if (notifFilterState.search) {
      chips.push({
        label: `"${notifFilterState.search}"`,
        clear: () => {
          notifFilterState.search = '';
          const inp = document.getElementById('filterNotifSearch');
          if (inp) inp.value = '';
        }
      });
    }

    chips.forEach(c => {
      const chip = document.createElement('div');
      chip.className = 'notif-filter-chip';
      chip.innerHTML = `
        <span class="chip-text">${c.label}</span>
        <button type="button" class="chip-remove-btn" aria-label="${isAr ? 'إزالة الفلتر' : 'Remove filter'}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      chip.querySelector('.chip-remove-btn').addEventListener('click', () => {
        c.clear();
        renderNotificationsPage();
      });
      container.appendChild(chip);
    });
  }

  function updatePeriodTabsUI(activePeriod) {
    document.querySelectorAll('.period-tab-btn').forEach(btn => {
      if (btn.dataset.period === activePeriod) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  async function toggleNotificationReadState(notifId, currentUnread) {
    const newUnread = !currentUnread;

    try {
      await apiFetch(`/api/company/notifications/${encodeURIComponent(notifId)}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unread: newUnread })
      });
    } catch (err) {
      console.warn('API error updating read state:', err);
    }

    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    if (mockData && mockData.markCompanyNotificationRead) {
      mockData.markCompanyNotificationRead(notifId, newUnread);
    }

    await updateNavbarNotificationsBadge();
    await renderNotificationsPage();
  }

  async function markAllNotificationsAsRead() {
    try {
      await apiFetch('/api/company/notifications/mark-all-read', {
        method: 'PUT'
      });
    } catch (err) {
      console.warn('API error mark all read:', err);
    }

    const mockData = window.MiqatCompanyMockData || window.CompanyMockData;
    if (mockData && mockData.markAllCompanyNotificationsRead) {
      mockData.markAllCompanyNotificationsRead();
    }

    const isAr = currentLang === 'ar';
    showCompanyToast(isAr ? 'تم تحديد كافة الإشعارات كمقروءة بنجاح' : 'All notifications marked as read successfully');

    await updateNavbarNotificationsBadge();
    await renderNotificationsPage();
  }

  function openAdminNoticeModal(notice, notifId = null) {
    if (!notice) return;
    const modal = document.getElementById('adminNoticeModal');
    if (!modal) return;

    activeAdminNoticeNotifId = notifId;

    const circularNoEl = document.getElementById('modalCircularNo');
    const issuerEl = document.getElementById('modalIssuer');
    const issueDateEl = document.getElementById('modalIssueDate');
    const effectiveDateEl = document.getElementById('modalEffectiveDate');
    const subjectEl = document.getElementById('modalSubject');
    const bodyEl = document.getElementById('modalBody');

    const isAr = currentLang === 'ar';

    if (circularNoEl) circularNoEl.textContent = notice.circularNumber || 'CIRC-1447-084';
    if (issuerEl) issuerEl.textContent = isAr ? (notice.issuer_ar || notice.issuer || 'وزارة الحج والعمرة') : (notice.issuer_en || notice.issuer || 'Ministry of Hajj & Umrah');
    if (issueDateEl) issueDateEl.textContent = notice.issueDate || '2026-10-29';
    if (effectiveDateEl) effectiveDateEl.textContent = notice.effectiveDate || '2026-11-01';
    if (subjectEl) subjectEl.textContent = isAr ? (notice.subject_ar || notice.title_ar || '') : (notice.subject_en || notice.title_en || '');
    if (bodyEl) bodyEl.textContent = isAr ? (notice.body_ar || notice.desc_ar || notice.message_ar || '') : (notice.body_en || notice.desc_en || notice.message_en || '');

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeAdminNoticeModal() {
    const modal = document.getElementById('adminNoticeModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    activeAdminNoticeNotifId = null;
  }

  async function renderNotificationsPage() {
    const container = document.getElementById('notificationsCardsList');
    const emptyState = document.getElementById('notificationsEmptyState');
    if (!container) return;

    const summary = await fetchNotificationsSummary();
    renderNotificationsKpis(summary);

    const notifications = await fetchNotificationsList(notifFilterState);
    renderNotificationsActiveChips(summary.total || notifications.length, notifications.length);

    if (!notifications || notifications.length === 0) {
      container.style.display = 'none';
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'flex';
    container.innerHTML = '';

    const isAr = currentLang === 'ar';

    notifications.forEach(notif => {
      const typeMeta = getNotifTypeMeta(notif.type);
      const isUnread = Boolean(notif.unread);
      const relativeTime = formatRelativeTime(notif.createdAt || notif.date);
      const fullDate = (notif.createdAt || notif.date || '').slice(0, 10);
      const title = isAr ? (notif.title_ar || notif.title_en || '') : (notif.title_en || notif.title_ar || '');
      const message = isAr ? (notif.message_ar || notif.message_en || '') : (notif.message_en || notif.message_ar || '');
      const customerName = isAr ? (notif.customer_name_ar || notif.customerName_ar || '') : (notif.customer_name_en || notif.customerName_en || '');
      const programTitle = isAr ? (notif.program_title_ar || notif.programTitle_ar || '') : (notif.program_title_en || notif.programTitle_en || '');
      const bookingRef = notif.booking_reference || notif.bookingReference || '';
      const amountVal = notif.amount;

      const card = document.createElement('article');
      card.className = `notif-card ${isUnread ? 'is-unread' : 'is-read'}`;
      card.setAttribute('data-notif-id', notif.id);

      // Meta Pills HTML
      let metaPillsHtml = '';
      if (bookingRef) {
        metaPillsHtml += `
          <span class="notif-meta-pill notif-pill-booking">
            <span class="pill-label">${isAr ? 'رقم الحجز:' : 'Booking:'}</span>
            <strong class="pill-val font-numeric">${bookingRef}</strong>
          </span>
        `;
      }
      if (customerName) {
        metaPillsHtml += `
          <span class="notif-meta-pill notif-pill-customer">
            <span class="pill-label">${isAr ? 'العميل:' : 'Customer:'}</span>
            <span class="pill-val">${customerName}</span>
          </span>
        `;
      }
      if (programTitle) {
        metaPillsHtml += `
          <span class="notif-meta-pill notif-pill-program">
            <span class="pill-label">${isAr ? 'البرنامج:' : 'Program:'}</span>
            <span class="pill-val">${programTitle}</span>
          </span>
        `;
      }
      if (amountVal && !isNaN(Number(amountVal))) {
        metaPillsHtml += `
          <span class="notif-meta-pill notif-pill-amount">
            <span class="pill-label">${isAr ? 'المبلغ:' : 'Amount:'}</span>
            <strong class="pill-val font-numeric">${formatNumber(Number(amountVal))} ${isAr ? 'ج.م' : 'EGP'}</strong>
          </span>
        `;
      }

      // Actions HTML
      let actionsHtml = '';
      if (notif.bookingId || notif.booking_id) {
        const bId = notif.bookingId || notif.booking_id;
        actionsHtml += `
          <a href="company-booking-details.html?id=${encodeURIComponent(bId)}" class="btn btn-secondary notif-card-btn btn-view-details" title="${isAr ? 'عرض تفاصيل الحجز' : 'View Booking Details'}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>${isAr ? 'عرض تفاصيل الحجز' : 'View Booking Details'}</span>
          </a>
        `;
      }

      if (notif.type === 'admin_update' && (notif.adminNotice || notif.admin_notice)) {
        actionsHtml += `
          <button type="button" class="btn btn-secondary notif-card-btn btn-view-circular" data-notif-id="${notif.id}" title="${isAr ? 'عرض نص التعميم الرسمي' : 'View Official Circular'}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>
            <span>${isAr ? 'عرض نص التعميم' : 'View Circular'}</span>
          </button>
        `;
      }

      actionsHtml += `
        <button type="button" class="btn btn-secondary notif-card-btn btn-toggle-read" data-notif-id="${notif.id}" data-unread="${isUnread}" title="${isUnread ? (isAr ? 'تحديد كمقروء' : 'Mark as Read') : (isAr ? 'تحديد كغير مقروء' : 'Mark as Unread')}">
          ${isUnread 
            ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${isAr ? 'تحديد كمقروء' : 'Mark as Read'}</span>`
            : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line></svg><span>${isAr ? 'تحديد كغير مقروء' : 'Mark as Unread'}</span>`
          }
        </button>
      `;

      card.innerHTML = `
        <div class="notif-card-side-indicator" aria-hidden="true"></div>
        <div class="notif-card-content">
          
          <div class="notif-card-header">
            <div class="notif-header-left">
              <span class="notif-status-indicator" tabindex="0" role="img" aria-label="${isUnread ? (isAr ? 'غير مقروءة' : 'Unread') : (isAr ? 'مقروءة' : 'Read')}">
                <span class="notif-status-dot ${isUnread ? 'is-unread-dot' : 'is-read-dot'}" aria-hidden="true"></span>
                <span class="notif-status-tooltip" role="tooltip">${isUnread ? (isAr ? 'غير مقروءة' : 'Unread') : (isAr ? 'مقروءة' : 'Read')}</span>
              </span>
              <span class="notif-type-badge ${typeMeta.badgeClass}">
                <span class="type-icon">${typeMeta.iconSvg}</span>
                <span class="type-text">${typeMeta.label}</span>
              </span>
            </div>
            <div class="notif-header-right">
              <time class="notif-timestamp font-numeric" datetime="${notif.createdAt || notif.date}" title="${fullDate}">
                ${relativeTime} • ${fullDate}
              </time>
            </div>
          </div>

          <div class="notif-card-body">
            <h3 class="notif-card-title">${title}</h3>
            <p class="notif-card-message">${message}</p>
            ${metaPillsHtml ? `<div class="notif-meta-pills-row">${metaPillsHtml}</div>` : ''}
          </div>

          <div class="notif-card-footer">
            <div class="notif-card-actions">
              ${actionsHtml}
            </div>
          </div>

        </div>
      `;

      // Attach Toggle Read Event
      const toggleBtn = card.querySelector('.btn-toggle-read');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          toggleNotificationReadState(notif.id, isUnread);
        });
      }

      // Attach View Circular Event
      const circularBtn = card.querySelector('.btn-view-circular');
      if (circularBtn) {
        circularBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const notice = notif.adminNotice || notif.admin_notice;
          openAdminNoticeModal(notice, notif.id);
        });
      }

      container.appendChild(card);
    });
  }

  function setupNotificationsPage() {
    // Quick period tabs
    document.querySelectorAll('.period-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const period = btn.dataset.period || 'all';
        notifFilterState.period = period;
        updatePeriodTabsUI(period);
        renderNotificationsPage();
      });
    });

    // 4 KPI cards
    const cardTotal = document.getElementById('kpiTotalNotificationsCard');
    const cardUnread = document.getElementById('kpiUnreadNotificationsCard');
    const cardRead = document.getElementById('kpiReadNotificationsCard');
    const cardToday = document.getElementById('kpiTodayNotificationsCard');

    if (cardTotal) {
      cardTotal.addEventListener('click', () => {
        notifFilterState.period = 'all';
        notifFilterState.status = 'all';
        updatePeriodTabsUI('all');
        const selStatus = document.getElementById('filterNotifStatus');
        if (selStatus) selStatus.value = 'all';
        renderNotificationsPage();
      });
    }

    if (cardUnread) {
      cardUnread.addEventListener('click', () => {
        notifFilterState.status = 'unread';
        const selStatus = document.getElementById('filterNotifStatus');
        if (selStatus) selStatus.value = 'unread';
        renderNotificationsPage();
      });
    }

    if (cardRead) {
      cardRead.addEventListener('click', () => {
        notifFilterState.status = 'read';
        const selStatus = document.getElementById('filterNotifStatus');
        if (selStatus) selStatus.value = 'read';
        renderNotificationsPage();
      });
    }

    if (cardToday) {
      cardToday.addEventListener('click', () => {
        notifFilterState.period = 'today';
        updatePeriodTabsUI('today');
        renderNotificationsPage();
      });
    }

    // Filter Inputs
    const filterType = document.getElementById('filterNotifType');
    if (filterType) {
      filterType.addEventListener('change', () => {
        notifFilterState.type = filterType.value;
        renderNotificationsPage();
      });
    }

    const filterStatus = document.getElementById('filterNotifStatus');
    if (filterStatus) {
      filterStatus.addEventListener('change', () => {
        notifFilterState.status = filterStatus.value;
        renderNotificationsPage();
      });
    }

    const filterDateFrom = document.getElementById('filterNotifDateFrom');
    if (filterDateFrom) {
      filterDateFrom.addEventListener('change', () => {
        notifFilterState.dateFrom = filterDateFrom.value;
        renderNotificationsPage();
      });
    }

    const filterDateTo = document.getElementById('filterNotifDateTo');
    if (filterDateTo) {
      filterDateTo.addEventListener('change', () => {
        notifFilterState.dateTo = filterDateTo.value;
        renderNotificationsPage();
      });
    }

    let searchDebounceTimer = null;
    const filterBookingRef = document.getElementById('filterNotifBookingRef');
    if (filterBookingRef) {
      const handleBookingRef = () => {
        notifFilterState.bookingRef = filterBookingRef.value.trim();
        renderNotificationsPage();
      };
      filterBookingRef.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(handleBookingRef, 250);
      });
      filterBookingRef.addEventListener('change', () => {
        clearTimeout(searchDebounceTimer);
        handleBookingRef();
      });
    }

    const filterSearch = document.getElementById('filterNotifSearch');
    if (filterSearch) {
      const handleSearch = () => {
        notifFilterState.search = filterSearch.value.trim();
        renderNotificationsPage();
      };
      filterSearch.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(handleSearch, 250);
      });
      filterSearch.addEventListener('change', () => {
        clearTimeout(searchDebounceTimer);
        handleSearch();
      });
    }

    // Reset Filters Button
    const resetBtn = document.getElementById('btnResetNotifFilters');
    const emptyResetBtn = document.getElementById('btnEmptyReset');
    const resetHandler = () => {
      notifFilterState.period = 'all';
      notifFilterState.type = 'all';
      notifFilterState.status = 'all';
      notifFilterState.dateFrom = '';
      notifFilterState.dateTo = '';
      notifFilterState.bookingRef = '';
      notifFilterState.search = '';

      updatePeriodTabsUI('all');
      if (filterType) filterType.value = 'all';
      if (filterStatus) filterStatus.value = 'all';
      if (filterDateFrom) filterDateFrom.value = '';
      if (filterDateTo) filterDateTo.value = '';
      if (filterBookingRef) filterBookingRef.value = '';
      if (filterSearch) filterSearch.value = '';
      renderNotificationsPage();
    };

    if (resetBtn) resetBtn.addEventListener('click', resetHandler);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetHandler);

    // Mark All Read Button
    const markAllReadBtn = document.getElementById('btnMarkAllRead');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }

    // Admin Notice Modal Controls
    const modalNoticeCloseX = document.getElementById('modalNoticeCloseX');
    const adminNoticeBackdrop = document.getElementById('adminNoticeBackdrop');
    const modalAckBtn = document.getElementById('modalAckBtn');

    if (modalNoticeCloseX) modalNoticeCloseX.addEventListener('click', closeAdminNoticeModal);
    if (adminNoticeBackdrop) adminNoticeBackdrop.addEventListener('click', closeAdminNoticeModal);
    if (modalAckBtn) {
      modalAckBtn.addEventListener('click', async () => {
        const notifIdToMark = activeAdminNoticeNotifId;
        closeAdminNoticeModal();
        if (notifIdToMark) {
          await toggleNotificationReadState(notifIdToMark, true);
        }
        const isAr = currentLang === 'ar';
        showCompanyToast(isAr ? 'تم توثيق الاطلاع والالتزام بالتعميم الرسمي' : 'Official circular acknowledged and complied');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('adminNoticeModal');
        if (modal && modal.style.display === 'flex') {
          closeAdminNoticeModal();
        }
      }
    });
  }

  // Window exposure for notifications
  window.MiqatCompanyPortal.renderNotifications = renderNotificationsPage;
  window.MiqatCompanyPortal.notifFilterState = notifFilterState;
  window.MiqatCompanyPortal.openAdminNotice = openAdminNoticeModal;
  window.MiqatCompanyPortal.markAllRead = markAllNotificationsAsRead;
  window.MiqatCompanyPortal.toggleRead = toggleNotificationReadState;

  // =========================================================================
  // PAGE 7: COMPANY PROFILE — بيانات الشركة
  // =========================================================================

  const EGYPTIAN_GOVERNORATES = [
    { id: 'cairo', ar: 'القاهرة', en: 'Cairo' },
    { id: 'giza', ar: 'الجيزة', en: 'Giza' },
    { id: 'alexandria', ar: 'الإسكندرية', en: 'Alexandria' },
    { id: 'dakahlia', ar: 'الدقهلية', en: 'Dakahlia' },
    { id: 'red_sea', ar: 'البحر الأحمر', en: 'Red Sea' },
    { id: 'beheira', ar: 'البحيرة', en: 'Beheira' },
    { id: 'fayoum', ar: 'الفيوم', en: 'Faiyum' },
    { id: 'gharbia', ar: 'الغربية', en: 'Gharbia' },
    { id: 'ismailia', ar: 'الإسماعيلية', en: 'Ismailia' },
    { id: 'menofia', ar: 'المنوفية', en: 'Menofia' },
    { id: 'minya', ar: 'المنيا', en: 'Minya' },
    { id: 'qalyubia', ar: 'القليوبية', en: 'Qalyubia' },
    { id: 'new_valley', ar: 'الوادي الجديد', en: 'New Valley' },
    { id: 'suez', ar: 'السويس', en: 'Suez' },
    { id: 'aswan', ar: 'أسوان', en: 'Aswan' },
    { id: 'asyut', ar: 'أسيوط', en: 'Asyut' },
    { id: 'beni_suef', ar: 'بني سويف', en: 'Beni Suef' },
    { id: 'port_said', ar: 'بورسعيد', en: 'Port Said' },
    { id: 'damietta', ar: 'دمياط', en: 'Damietta' },
    { id: 'sharkia', ar: 'الشرقية', en: 'Sharqia' },
    { id: 'south_sinai', ar: 'جنوب سيناء', en: 'South Sinai' },
    { id: 'kafr_el_sheikh', ar: 'كفر الشيخ', en: 'Kafr El-Sheikh' },
    { id: 'matrouh', ar: 'مطروح', en: 'Matruh' },
    { id: 'luxor', ar: 'الأقصر', en: 'Luxor' },
    { id: 'qena', ar: 'قنا', en: 'Qena' },
    { id: 'north_sinai', ar: 'شمال سيناء', en: 'North Sinai' },
    { id: 'sohag', ar: 'سوهاج', en: 'Sohag' }
  ];

  let companyProfileData = null;
  let isEditingProfile = false;

  async function fetchCompanyProfile() {
    try {
      const res = await apiFetch('/api/company/profile');
      if (res && res.ok) {
        const json = await res.json();
        if (json && json.success && json.company) {
          companyProfileData = json.company;
          currentUser = {
            ...currentUser,
            ...json.company
          };
          updateCompanyIdentityUI(currentUser);
          return json.company;
        }
      }
    } catch (e) {
      console.error('Failed to fetch company profile:', e);
    }
    if (currentUser) {
      companyProfileData = currentUser;
      return currentUser;
    }
    return null;
  }

  function setupProfilePage() {
    const editBtn = document.getElementById('btnEditProfile');
    const cancelBtn = document.getElementById('btnCancelEditProfile');
    const form = document.getElementById('companyProfileForm');

    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        enterProfileEditMode();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        exitProfileEditMode(true);
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSaveProfile();
      });
    }

    const saveBtn = document.getElementById('btnSaveProfile');
    if (saveBtn) {
      saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleSaveProfile();
      });
    }

    // Populate governorate select
    populateGovernorateSelect();
  }

  function populateGovernorateSelect() {
    const govDisplay = document.getElementById('profileGovernorateDisplay');
    const govInput = document.getElementById('profileGovernorate');
    const currentVal = (govInput ? govInput.value : '') || (companyProfileData ? companyProfileData.governorate : 'الجيزة') || 'الجيزة';
    const isAr = currentLang === 'ar';

    if (govDisplay) {
      const match = EGYPTIAN_GOVERNORATES.find(gov => gov.ar === currentVal || gov.en === currentVal || gov.id === currentVal);
      govDisplay.textContent = isAr ? (match ? match.ar : currentVal) : (match ? match.en : currentVal);
    }

    if (govInput && !govInput.value) {
      govInput.value = currentVal;
    }

    // Fallback if select exists
    const select = document.getElementById('profileGovernorate');
    if (select && select.tagName === 'SELECT') {
      select.innerHTML = `<option value="" disabled ${!currentVal ? 'selected' : ''}>${isAr ? 'اختار المحافظة' : 'Select governorate'}</option>`;
      EGYPTIAN_GOVERNORATES.forEach(gov => {
        const opt = document.createElement('option');
        opt.value = gov.ar;
        opt.textContent = isAr ? gov.ar : gov.en;
        if (currentVal && (currentVal === gov.ar || currentVal === gov.en || currentVal === gov.id)) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    }
  }

  function enterProfileEditMode() {
    isEditingProfile = true;
    const form = document.getElementById('companyProfileForm');
    if (!form) return;

    form.classList.add('is-editing');

    // Enable editable inputs
    const editableInputs = form.querySelectorAll('.is-editable-input');
    editableInputs.forEach(input => {
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
    });

    const editActions = document.getElementById('profileEditActions');
    const viewActions = document.getElementById('profileViewActions');
    if (editActions) editActions.style.display = 'flex';
    if (viewActions) viewActions.style.display = 'none';

    // Focus on first editable input
    const firstInput = document.getElementById('profileResponsiblePerson');
    if (firstInput) firstInput.focus();
  }

  function exitProfileEditMode(discardChanges = true) {
    isEditingProfile = false;
    const form = document.getElementById('companyProfileForm');
    if (!form) return;

    form.classList.remove('is-editing');

    // Make editable inputs read-only again
    const editableInputs = form.querySelectorAll('.is-editable-input');
    editableInputs.forEach(input => {
      input.setAttribute('readonly', 'true');
      if (input.tagName === 'SELECT') {
        input.setAttribute('disabled', 'true');
      }
    });

    // Clear inline errors
    clearAllProfileErrors();

    const editActions = document.getElementById('profileEditActions');
    const viewActions = document.getElementById('profileViewActions');
    if (editActions) editActions.style.display = 'none';
    if (viewActions) viewActions.style.display = 'flex';

    if (discardChanges && companyProfileData) {
      renderProfileFormValues(companyProfileData);
    }
  }

  function clearAllProfileErrors() {
    const errorContainers = document.querySelectorAll('.profile-field-error');
    errorContainers.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    const inputs = document.querySelectorAll('.profile-input.has-error');
    inputs.forEach(el => el.classList.remove('has-error'));
    const banner = document.getElementById('profileFeedbackBanner');
    if (banner) {
      banner.style.display = 'none';
      banner.className = 'profile-feedback-banner';
    }
  }

  function showProfileFieldError(fieldId, errorKeyOrMsg) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    const msg = getTranslation(errorKeyOrMsg, currentDict) || errorKeyOrMsg;
    if (input) input.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
  }

  async function handleSaveProfile() {
    clearAllProfileErrors();

    const responsibleInput = document.getElementById('profileResponsiblePerson');
    const phoneInput = document.getElementById('profilePhone');
    const whatsappInput = document.getElementById('profileWhatsapp');
    const emailInput = document.getElementById('profileEmail');
    const govSelect = document.getElementById('profileGovernorate');
    const addressInput = document.getElementById('profileAddress');

    const responsiblePerson = responsibleInput ? responsibleInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim().replace(/\s+/g, '') : '';
    const whatsapp = whatsappInput ? whatsappInput.value.trim().replace(/\s+/g, '') : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const governorate = govSelect ? govSelect.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';

    let hasError = false;

    // Validate responsible person
    if (!responsiblePerson || responsiblePerson.length < 2) {
      showProfileFieldError('profileResponsiblePerson', 'company.profile_err_required');
      hasError = true;
    }

    // Validate primary phone
    if (!phone) {
      showProfileFieldError('profilePhone', 'company.profile_err_required');
      hasError = true;
    } else if (!/^01[0125][0-9]{8}$/.test(phone)) {
      showProfileFieldError('profilePhone', 'company.profile_err_invalid_phone');
      hasError = true;
    }

    // Validate WhatsApp (optional, but if provided, validate format)
    if (whatsapp && !/^01[0125][0-9]{8}$/.test(whatsapp) && !/^\+?[0-9]{10,15}$/.test(whatsapp)) {
      showProfileFieldError('profileWhatsapp', 'company.profile_err_invalid_whatsapp');
      hasError = true;
    }

    // Validate email (required)
    if (!email) {
      showProfileFieldError('profileEmail', 'company.profile_err_required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showProfileFieldError('profileEmail', 'company.profile_err_invalid_email');
      hasError = true;
    }

    // Validate governorate
    if (!governorate) {
      showProfileFieldError('profileGovernorate', 'company.profile_err_required');
      hasError = true;
    }

    // Validate address
    if (!address || address.length < 3) {
      showProfileFieldError('profileAddress', 'company.profile_err_required');
      hasError = true;
    }

    if (hasError) {
      const firstError = document.querySelector('.profile-input.has-error');
      if (firstError) firstError.focus();
      return;
    }

    // Disable save button during request
    const saveBtn = document.getElementById('btnSaveProfile');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.classList.add('is-loading');
    }

    try {
      const payload = {
        responsible_person: responsiblePerson,
        phone: phone,
        whatsapp: whatsapp || null,
        email: email,
        governorate: governorate,
        address: address
      };

      const res = await apiFetch('/api/company/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (res.ok && json && json.success && json.company) {
        companyProfileData = json.company;
        currentUser = {
          ...currentUser,
          ...json.company
        };
        updateCompanyIdentityUI(currentUser);
        exitProfileEditMode(false);
        renderProfileFormValues(json.company);
        showProfileFeedbackBanner('success', getTranslation('company.profile_msg_save_success', currentDict) || 'Company profile updated successfully.');
      } else {
        const errMsg = json && json.error ? json.error : (getTranslation('company.profile_msg_save_error', currentDict) || 'Failed to update profile.');
        showProfileFeedbackBanner('error', errMsg);
      }
    } catch (err) {
      console.error('Error updating company profile:', err);
      showProfileFeedbackBanner('error', getTranslation('company.profile_msg_save_error', currentDict) || 'Failed to update profile.');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.classList.remove('is-loading');
      }
    }
  }

  function showProfileFeedbackBanner(type, message) {
    const banner = document.getElementById('profileFeedbackBanner');
    if (!banner) return;
    banner.textContent = message;
    banner.className = `profile-feedback-banner is-${type}`;
    banner.style.display = 'flex';
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderProfileFormValues(data) {
    if (!data) return;
    const isAr = currentLang === 'ar';

    // 1. Protected Section Display
    const compNameEl = document.getElementById('profileCompanyName');
    if (compNameEl) compNameEl.textContent = isAr ? (data.company_name || data.name) : (data.company_name_en || data.name);

    const licenseEl = document.getElementById('profileLicenseNumber');
    if (licenseEl) licenseEl.textContent = data.license_number || '47852';

    const registryEl = document.getElementById('profileCommercialRegistry');
    if (registryEl) registryEl.textContent = data.commercial_registry || 'CR-104928';

    const compIdEl = document.getElementById('profileCompanyId');
    if (compIdEl) compIdEl.textContent = data.id || 'comp_aldorra_01';

    // 2. Editable Contact Inputs
    const responsibleInput = document.getElementById('profileResponsiblePerson');
    if (responsibleInput) responsibleInput.value = data.responsible_person || '';

    const phoneInput = document.getElementById('profilePhone');
    if (phoneInput) phoneInput.value = data.phone || '';

    const whatsappInput = document.getElementById('profileWhatsapp');
    if (whatsappInput) whatsappInput.value = data.whatsapp || data.phone || '';

    const emailInput = document.getElementById('profileEmail');
    if (emailInput) emailInput.value = data.email || '';

    const addressInput = document.getElementById('profileAddress');
    if (addressInput) addressInput.value = data.address || '';

    const govDisplay = document.getElementById('profileGovernorateDisplay');
    const govInput = document.getElementById('profileGovernorate');
    const savedGov = data.governorate || 'الجيزة';
    if (govInput) govInput.value = savedGov;
    if (govDisplay) {
      const match = EGYPTIAN_GOVERNORATES.find(gov => gov.ar === savedGov || gov.en === savedGov || gov.id === savedGov);
      govDisplay.textContent = isAr ? (match ? match.ar : savedGov) : (match ? match.en : savedGov);
    }

    populateGovernorateSelect();

    // 3. Contract Section Display
    const contract = data.contract || {};
    const contractRefEl = document.getElementById('profileContractRef');
    if (contractRefEl) contractRefEl.textContent = contract.ref || 'MQ-CTR-2025-084';

    const tierEl = document.getElementById('profilePartnershipTier');
    if (tierEl) tierEl.textContent = isAr ? 'شريك بلاتيني معتمد' : 'Certified Platinum Partner';

    const startEl = document.getElementById('profileContractStart');
    if (startEl) startEl.textContent = contract.start_date || '2025-01-01';

    const endEl = document.getElementById('profileContractEnd');
    if (endEl) endEl.textContent = contract.end_date || '2026-12-31';

    const signedEl = document.getElementById('profileContractSigned');
    if (signedEl) signedEl.textContent = contract.signed_at || '2024-12-20';

    const statusEl = document.getElementById('profileContractStatus');
    if (statusEl) {
      statusEl.textContent = isAr ? 'سارٍ ونشط' : 'Active & In Effect';
      statusEl.className = 'profile-status-pill is-active';
    }
  }

  async function renderProfilePage() {
    let data = companyProfileData;
    if (!data) {
      data = await fetchCompanyProfile();
    }
    if (data) {
      renderProfileFormValues(data);
    }
  }

  // Window exposure for profile
  window.MiqatCompanyPortal.renderProfile = renderProfilePage;
  window.MiqatCompanyPortal.saveProfile = handleSaveProfile;
  window.MiqatCompanyPortal.editProfile = enterProfileEditMode;
  window.MiqatCompanyPortal.cancelProfile = exitProfileEditMode;
  window.MiqatCompanyPortal.applyTranslations = applyTranslations;
  window.MiqatCompanyPortal.applyTheme = applyTheme;

  // --- Page Initialization ---
  async function initCompanyPortal() {
    applyTheme(currentTheme);
    await applyTranslations(currentLang);
    setupGlobalControls();
    setupFutureScopeNavigation();

    // Verify company authorization
    const user = await verifyCompanyAuth();
    if (!user) return;

    // Update unread notification count badge in Navbar across all pages
    await updateNavbarNotificationsBadge();

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
    } else if (pageId === 'company-programs') {
      setupProgramsPage();
      renderProgramsPage();
    } else if (pageId === 'company-notifications') {
      setupNotificationsPage();
      renderNotificationsPage();
    } else if (pageId === 'company-profile') {
      setupProfilePage();
      renderProfilePage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompanyPortal);
  } else {
    initCompanyPortal();
  }

})();

