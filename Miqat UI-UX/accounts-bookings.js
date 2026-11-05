/**
 * MIQAT ACCOUNTS WORKSPACE — UNIFIED BOOKINGS REGISTER CONTROLLER
 * 
 * Manages the Unified Bookings Register view:
 * - 4 Summary KPI Cards
 * - Operations Requiring Review shortcuts
 * - Search, Quick Filters & Advanced Filters Panel
 * - Filter Chips & Clear All logic
 * - Responsive Bookings Table with strict Zero-Red & Zero-Green status tokens
 * - Navigation to Customer Profile & Booking Details
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsBookings = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // State Management
  const state = {
    search: '',
    quickFilter: 'all',
    company: 'all',
    programType: 'all',
    bookingStatus: 'all',
    paymentStatus: 'all',
    season: 'all',
    dateFrom: '',
    dateTo: '',
    reviewOnly: null, // 'collections' or 'refunds'
    isAdvancedOpen: false
  };

  function getLang() {
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getLang === 'function') {
      return window.AccountsWorkspace.getLang();
    }
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getCurrentLang === 'function') {
      return window.AccountsWorkspace.getCurrentLang();
    }
    return document.documentElement.lang || 'ar';
  }

  function t(key, fallback) {
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.t === 'function') {
      const val = window.AccountsWorkspace.t(key);
      if (val && val !== key) return val;
    }
    return fallback;
  }

  function formatNum(num) {
    const lang = getLang();
    const n = Number(num) || 0;
    if (lang === 'ar') {
      return n.toLocaleString('ar-EG');
    }
    return n.toLocaleString('en-US');
  }

  function formatCurr(amount) {
    const lang = getLang();
    const formatted = formatNum(amount);
    return lang === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Status Pill Helpers (Strict Zero-Red and Zero-Green Compliance) ---
  function getBookingStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'confirmed':
        return {
          label: lang === 'ar' ? 'مؤكد' : 'Confirmed',
          cssClass: 'status-pill-navy'
        };
      case 'deposit_paid':
        return {
          label: lang === 'ar' ? 'عربون مسدد' : 'Deposit Paid',
          cssClass: 'status-pill-amber'
        };
      case 'under_review':
        return {
          label: lang === 'ar' ? 'قيد المراجعة' : 'Under Review',
          cssClass: 'status-pill-amber'
        };
      case 'new':
        return {
          label: lang === 'ar' ? 'طلب جديد' : 'New Booking',
          cssClass: 'status-pill-blue'
        };
      case 'completed':
        return {
          label: lang === 'ar' ? 'منجز ومسوى' : 'Completed',
          cssClass: 'status-pill-indigo'
        };
      case 'cancelled':
        return {
          label: lang === 'ar' ? 'ملغي' : 'Cancelled',
          cssClass: 'status-pill-slate'
        };
      default:
        return {
          label: status,
          cssClass: 'status-pill-slate'
        };
    }
  }

  function getPaymentStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'paid_full':
        return {
          label: lang === 'ar' ? 'مسدد بالكامل' : 'Paid in Full',
          cssClass: 'status-pill-navy'
        };
      case 'partial':
        return {
          label: lang === 'ar' ? 'سداد جزئي' : 'Partial (Balance Due)',
          cssClass: 'status-pill-amber'
        };
      case 'pending_clearance':
        return {
          label: lang === 'ar' ? 'بانتظار التحصيل' : 'Pending Clearance',
          cssClass: 'status-pill-amber'
        };
      case 'refunded':
        return {
          label: lang === 'ar' ? 'مسترد / تسوية' : 'Refunded / Settled',
          cssClass: 'status-pill-slate'
        };
      default:
        return {
          label: status,
          cssClass: 'status-pill-slate'
        };
    }
  }

  // --- 1. Summary KPIs Render ---
  function renderSummaryKPIs() {
    if (!window.AccountsMockData || typeof window.AccountsMockData.getBookingsSummary !== 'function') return;
    const summary = window.AccountsMockData.getBookingsSummary();

    const elTotal = document.getElementById('kpi-total-bookings');
    const elConfirmed = document.getElementById('kpi-confirmed-bookings');
    const elApproved = document.getElementById('kpi-approved-collected');
    const elRemaining = document.getElementById('kpi-remaining-balances');

    if (elTotal) elTotal.textContent = formatNum(summary.totalBookings);
    if (elConfirmed) elConfirmed.textContent = formatNum(summary.confirmedBookings);
    if (elApproved) elApproved.textContent = formatCurr(summary.totalApprovedCollected);
    if (elRemaining) elRemaining.textContent = formatCurr(summary.totalRemainingBalances);
  }

  // --- 2. Operations Requiring Review Render ---
  function renderOperationsRequiringReview() {
    if (!window.AccountsMockData || typeof window.AccountsMockData.getOperationsRequiringReview !== 'function') return;
    const reviewData = window.AccountsMockData.getOperationsRequiringReview();
    const lang = getLang();

    const countColEl = document.getElementById('review-count-collections');
    const countRefEl = document.getElementById('review-count-refunds');

    const totalColAmount = reviewData.pendingCollections.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const totalRefAmount = reviewData.pendingRefunds.reduce((s, r) => s + (Number(r.amount) || 0), 0);

    if (countColEl) {
      countColEl.textContent = lang === 'ar'
        ? `${formatNum(reviewData.pendingCollections.length)} معاملات (${formatCurr(totalColAmount)})`
        : `${formatNum(reviewData.pendingCollections.length)} items (${formatCurr(totalColAmount)})`;
    }

    if (countRefEl) {
      countRefEl.textContent = lang === 'ar'
        ? `${formatNum(reviewData.pendingRefunds.length)} طلب (${formatCurr(totalRefAmount)})`
        : `${formatNum(reviewData.pendingRefunds.length)} requests (${formatCurr(totalRefAmount)})`;
    }

    const subColEl = document.querySelector('#review-item-collections .acc-review-item-sub');
    if (subColEl) {
      subColEl.textContent = lang === 'ar'
        ? 'تحصيلات إلكترونية ومحافظ نقدية بانتظار مطابقة كشف الحساب البنكي'
        : 'E-wallet and digital collections awaiting bank statement matching';
    }
    const subRefEl = document.querySelector('#review-item-refunds .acc-review-item-sub');
    if (subRefEl) {
      subRefEl.textContent = lang === 'ar'
        ? 'طلبات إلغاء واسترداد مالي بانتظار التحقق من المستندات وسقف الاسترداد'
        : 'Refund and cancellation requests awaiting document check and refundable limit';
    }
    const btnColEl = document.getElementById('btn-review-collections');
    if (btnColEl) {
      btnColEl.textContent = lang === 'ar' ? 'مراجعة الآن' : 'Review Now';
    }
    const btnRefEl = document.getElementById('btn-review-refunds');
    if (btnRefEl) {
      btnRefEl.textContent = lang === 'ar' ? 'معاينة الطلبات' : 'Inspect Requests';
    }
  }

  function localizeAdvFilterDropdowns() {
    const lang = getLang();

    // 1. Company
    const selComp = document.getElementById('adv-filter-company');
    if (selComp) {
      const compMap = {
        'all': lang === 'ar' ? 'كافة الشركات السياحية' : 'All Tourism Companies',
        'COMP-101': lang === 'ar' ? 'شركة الهدى للسياحة والخدمات الدينية' : 'Al-Huda Travel & Tourism',
        'COMP-102': lang === 'ar' ? 'مؤسسة الفيروز لرحلات الحج والعمرة' : 'Al-Fayrouz Hajj & Umrah',
        'COMP-103': lang === 'ar' ? 'شركة مناسك العالمية للسياحة' : 'Manasek Global Travel',
        'COMP-104': lang === 'ar' ? 'شركة الصفا للنقل والخدمات السياحية' : 'Al-Safa Transport & Tourism',
        'COMP-105': lang === 'ar' ? 'شركة البركة لخدمات المعتمرين' : 'Al-Baraka Umrah Services',
        'COMP-106': lang === 'ar' ? 'شركة دار السلام للسياحة والحج والعمرة' : 'Dar Al-Salam Travel',
        'COMP-107': lang === 'ar' ? 'شركة التقوى للسياحة والرحلات الدينية' : 'Al-Taqwa Religious Travel',
        'COMP-108': lang === 'ar' ? 'شركة نور الإيمان لخدمات الحرمين' : 'Noor Al-Iman Haramain'
      };
      Array.from(selComp.options).forEach(opt => {
        if (compMap[opt.value]) opt.textContent = compMap[opt.value];
      });
    }

    // 2. Program Type
    const selProg = document.getElementById('adv-filter-program-type');
    if (selProg) {
      const progMap = {
        'all': lang === 'ar' ? 'كافة البرامج' : 'All Program Types',
        'economy': lang === 'ar' ? 'عمرة اقتصادية' : 'Economy Umrah',
        'standard': lang === 'ar' ? 'عمرة معيارية' : 'Standard Umrah',
        'deluxe': lang === 'ar' ? 'عمرة برية فاخرة' : 'Deluxe Land Umrah',
        'five_star': lang === 'ar' ? 'عمرة ٥ نجوم' : '5-Star Umrah',
        'vip': lang === 'ar' ? 'عمرة VIP متميزة' : 'VIP Umrah'
      };
      Array.from(selProg.options).forEach(opt => {
        if (progMap[opt.value]) opt.textContent = progMap[opt.value];
      });
    }

    // 3. Booking Status
    const selBkg = document.getElementById('adv-filter-booking-status');
    if (selBkg) {
      const bkgMap = {
        'all': lang === 'ar' ? 'كافة الحالات' : 'All Booking Statuses',
        'confirmed': lang === 'ar' ? 'مؤكد' : 'Confirmed',
        'deposit_paid': lang === 'ar' ? 'عربون مسدد' : 'Deposit Paid',
        'under_review': lang === 'ar' ? 'قيد المراجعة' : 'Under Review',
        'new': lang === 'ar' ? 'طلب جديد' : 'New Booking',
        'completed': lang === 'ar' ? 'منجز ومسوى' : 'Completed',
        'cancelled': lang === 'ar' ? 'ملغي' : 'Cancelled'
      };
      Array.from(selBkg.options).forEach(opt => {
        if (bkgMap[opt.value]) opt.textContent = bkgMap[opt.value];
      });
    }

    // 4. Payment Status
    const selPay = document.getElementById('adv-filter-payment-status');
    if (selPay) {
      const payMap = {
        'all': lang === 'ar' ? 'كافة حالات السداد' : 'All Payment Statuses',
        'paid_full': lang === 'ar' ? 'مسدد بالكامل' : 'Paid in Full',
        'partial': lang === 'ar' ? 'سداد جزئي (متبقي رصيد)' : 'Partial Payment (Balance Due)',
        'pending_clearance': lang === 'ar' ? 'بانتظار التحصيل' : 'Pending Clearance',
        'refunded': lang === 'ar' ? 'مسترد' : 'Refunded'
      };
      Array.from(selPay.options).forEach(opt => {
        if (payMap[opt.value]) opt.textContent = payMap[opt.value];
      });
    }

    // 5. Season
    const selSeason = document.getElementById('adv-filter-season');
    if (selSeason) {
      const seasonMap = {
        'all': lang === 'ar' ? 'كافة المواسم' : 'All Seasons',
        'rajab_1448': lang === 'ar' ? 'رجب ١٤٤٨ هـ (يناير ٢٠٢٧)' : 'Rajab 1448 AH (Jan 2027)',
        'shaban_1448': lang === 'ar' ? 'شعبان ١٤٤٨ هـ (فبراير ٢٠٢٧)' : 'Shaaban 1448 AH (Feb 2027)',
        'ramadan_1448': lang === 'ar' ? 'رمضان ١٤٤٨ هـ (مارس ٢٠٢٧)' : 'Ramadan 1448 AH (Mar 2027)',
        'shawwal_1448': lang === 'ar' ? 'شوال ١٤٤٨ هـ (أبريل ٢٠٢٧)' : 'Shawwal 1448 AH (Apr 2027)'
      };
      Array.from(selSeason.options).forEach(opt => {
        if (seasonMap[opt.value]) opt.textContent = seasonMap[opt.value];
      });
    }

    // 6. Section labels & Review items text
    const reviewCard = document.querySelector('.acc-review-alert-card');
    if (reviewCard) {
      reviewCard.setAttribute('aria-label', lang === 'ar' ? 'تنبيه محاسبي' : 'Accounting Alert');
    }
    const secBookings = document.getElementById('sec-bookings-summary');
    if (secBookings) {
      secBookings.setAttribute('aria-label', lang === 'ar' ? 'إحصائيات ومؤشرات الحجوزات المالية' : 'Financial Bookings KPI Statistics');
    }
    const secReview = document.getElementById('acc-review-section');
    if (secReview) {
      secReview.setAttribute('aria-label', lang === 'ar' ? 'تنبيه محاسبي' : 'Accounting Alert');
    }
    const itemCol = document.getElementById('review-item-collections');
    if (itemCol) {
      itemCol.setAttribute('aria-label', lang === 'ar' ? 'معاملات تحصيل بانتظار الاعتماد' : 'Collections Awaiting Approval');
    }
    const itemRef = document.getElementById('review-item-refunds');
    if (itemRef) {
      itemRef.setAttribute('aria-label', lang === 'ar' ? 'طلبات استرداد معلقة' : 'Pending Refund Requests');
    }
  }

  // --- 3. Filter Chips Management ---
  function renderFilterChips() {
    const wrap = document.getElementById('acc-active-chips-wrap');
    const container = document.getElementById('acc-chips-container');
    const badge = document.getElementById('adv-filter-count');
    if (!wrap || !container) return;

    const lang = getLang();
    const activeFilters = [];

    if (state.search) {
      activeFilters.push({
        key: 'search',
        label: `${lang === 'ar' ? 'البحث' : 'Search'}: "${state.search}"`
      });
    }

    if (state.quickFilter && state.quickFilter !== 'all') {
      let qLabel = state.quickFilter;
      if (state.quickFilter === 'confirmed') qLabel = lang === 'ar' ? 'المؤكدة فقط' : 'Confirmed Only';
      if (state.quickFilter === 'partial') qLabel = lang === 'ar' ? 'عربون ومتبقي رصيد' : 'Deposit / Partial';
      if (state.quickFilter === 'review') qLabel = lang === 'ar' ? 'تتطلب مراجعة' : 'Requires Review';
      activeFilters.push({ key: 'quickFilter', label: qLabel });
    }

    if (state.company && state.company !== 'all') {
      const sel = document.getElementById('adv-filter-company');
      const text = sel ? sel.options[sel.selectedIndex].text : state.company;
      activeFilters.push({ key: 'company', label: `${lang === 'ar' ? 'الشركة' : 'Company'}: ${text}` });
    }

    if (state.programType && state.programType !== 'all') {
      const sel = document.getElementById('adv-filter-program-type');
      const text = sel ? sel.options[sel.selectedIndex].text : state.programType;
      activeFilters.push({ key: 'programType', label: `${lang === 'ar' ? 'البرنامج' : 'Program'}: ${text}` });
    }

    if (state.bookingStatus && state.bookingStatus !== 'all') {
      const sel = document.getElementById('adv-filter-booking-status');
      const text = sel ? sel.options[sel.selectedIndex].text : state.bookingStatus;
      activeFilters.push({ key: 'bookingStatus', label: `${lang === 'ar' ? 'الحالة' : 'Status'}: ${text}` });
    }

    if (state.paymentStatus && state.paymentStatus !== 'all') {
      const sel = document.getElementById('adv-filter-payment-status');
      const text = sel ? sel.options[sel.selectedIndex].text : state.paymentStatus;
      activeFilters.push({ key: 'paymentStatus', label: `${lang === 'ar' ? 'السداد' : 'Payment'}: ${text}` });
    }

    if (state.season && state.season !== 'all') {
      const sel = document.getElementById('adv-filter-season');
      const text = sel ? sel.options[sel.selectedIndex].text : state.season;
      activeFilters.push({ key: 'season', label: `${lang === 'ar' ? 'الموسم' : 'Season'}: ${text}` });
    }

    if (state.dateFrom) {
      activeFilters.push({ key: 'dateFrom', label: `${lang === 'ar' ? 'من' : 'From'}: ${state.dateFrom}` });
    }

    if (state.dateTo) {
      activeFilters.push({ key: 'dateTo', label: `${lang === 'ar' ? 'إلى' : 'To'}: ${state.dateTo}` });
    }

    if (state.reviewOnly) {
      activeFilters.push({
        key: 'reviewOnly',
        label: state.reviewOnly === 'collections'
          ? (lang === 'ar' ? 'تصفية: تحصيلات قيد الاعتماد' : 'Filter: Collections Pending')
          : (lang === 'ar' ? 'تصفية: استردادات قيد الدراسة' : 'Filter: Refunds Under Review')
      });
    }

    // Advanced filters count badge
    let advCount = 0;
    if (state.company !== 'all') advCount++;
    if (state.programType !== 'all') advCount++;
    if (state.bookingStatus !== 'all') advCount++;
    if (state.paymentStatus !== 'all') advCount++;
    if (state.season !== 'all') advCount++;
    if (state.dateFrom) advCount++;
    if (state.dateTo) advCount++;

    if (badge) {
      if (advCount > 0) {
        badge.style.display = 'inline-flex';
        badge.textContent = String(advCount);
      } else {
        badge.style.display = 'none';
      }
    }

    if (activeFilters.length === 0) {
      wrap.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    wrap.style.display = 'flex';
    container.innerHTML = activeFilters.map(f => `
      <span class="acc-chip" data-filter-key="${escapeHtml(f.key)}">
        <span class="acc-chip-text">${escapeHtml(f.label)}</span>
        <button type="button" class="acc-chip-remove" onclick="window.AccountsBookings.removeFilter('${f.key}')" aria-label="${lang === 'ar' ? 'إزالة التصفية' : 'Remove filter'}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('');
  }

  // --- 4. Bookings Table Render ---
  function renderBookingsTable() {
    if (!window.AccountsMockData || typeof window.AccountsMockData.getAllBookings !== 'function') return;

    const filterOpts = {
      search: state.search,
      company: state.company,
      programType: state.programType,
      bookingStatus: state.bookingStatus,
      paymentStatus: state.paymentStatus,
      season: state.season,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
      reviewOnly: state.reviewOnly
    };

    // Apply quick filters if selected
    if (state.quickFilter === 'confirmed') {
      filterOpts.bookingStatus = 'confirmed';
    } else if (state.quickFilter === 'partial') {
      filterOpts.paymentStatus = 'partial';
    } else if (state.quickFilter === 'review') {
      filterOpts.reviewOnly = 'collections';
    }

    const bookings = window.AccountsMockData.getAllBookings(filterOpts);
    const tbody = document.getElementById('acc-bookings-tbody');
    const emptyState = document.getElementById('acc-bookings-empty');
    if (!tbody) return;

    if (!bookings || bookings.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    const lang = getLang();

    tbody.innerHTML = bookings.map(b => {
      const bStatus = getBookingStatusBadge(b.booking_status);
      const pStatus = getPaymentStatusBadge(b.payment_status);
      const customerName = lang === 'ar' ? b.customer_name_ar : b.customer_name_en;
      const companyName = lang === 'ar' ? b.company_ar : b.company_en;
      const programName = lang === 'ar' ? b.program_ar : b.program_en;
      const seasonLabel = lang === 'ar' ? b.season_ar : b.season_en;

      return `
        <tr data-booking-id="${escapeHtml(b.id)}">
          
          <!-- Booking ID -->
          <td>
            <a href="accounts-booking-details.html?id=${encodeURIComponent(b.id)}" class="acc-code-pill tabular-nums" title="${lang === 'ar' ? 'عرض تفاصيل الحجز' : 'View booking details'}">
              ${escapeHtml(b.id)}
            </a>
          </td>

          <!-- Customer Name (Links to Customer Profile) -->
          <td>
            <div class="acc-cust-cell">
              <a href="accounts-customer-details.html?id=${encodeURIComponent(b.customerId)}" class="acc-customer-link" title="${lang === 'ar' ? 'عرض ملف العميل' : 'View customer profile'}">
                <strong>${escapeHtml(customerName)}</strong>
              </a>
              <span class="acc-phone-sub tabular-nums">${escapeHtml(b.customer_phone)}</span>
            </div>
          </td>

          <!-- Tourism Company -->
          <td>
            <div class="acc-company-cell">
              <span class="acc-company-name">${escapeHtml(companyName)}</span>
              <span class="acc-ref-sub tabular-nums">${escapeHtml(b.company_booking_ref || '')}</span>
            </div>
          </td>

          <!-- Program & Trip -->
          <td>
            <span class="acc-program-title">${escapeHtml(programName)}</span>
          </td>

          <!-- Travel Date -->
          <td>
            <div class="acc-date-cell">
              <strong class="tabular-nums">${escapeHtml(b.travel_date)}</strong>
              <span class="acc-season-sub">${escapeHtml(seasonLabel)}</span>
            </div>
          </td>

          <!-- Created Date -->
          <td>
            <span class="acc-date-sub tabular-nums">${escapeHtml(b.created_date)}</span>
          </td>

          <!-- Booking Status -->
          <td>
            <span class="acc-status-pill ${bStatus.cssClass}">${escapeHtml(bStatus.label)}</span>
          </td>

          <!-- Payment Status -->
          <td>
            <span class="acc-status-pill ${pStatus.cssClass}">${escapeHtml(pStatus.label)}</span>
          </td>

          <!-- Financial Summary (Total / Paid / Remaining) -->
          <td>
            <div class="acc-fin-summary-cell">
              <div class="acc-fin-line">
                <span class="acc-fin-lbl">${lang === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                <strong class="acc-fin-total tabular-nums">${escapeHtml(formatCurr(b.total_price))}</strong>
              </div>
              <div class="acc-fin-line">
                <span class="acc-fin-lbl">${lang === 'ar' ? 'المحصل:' : 'Paid:'}</span>
                <span class="acc-fin-paid tabular-nums">${escapeHtml(formatCurr(b.paid_amount))}</span>
              </div>
              <div class="acc-fin-line">
                <span class="acc-fin-lbl">${lang === 'ar' ? 'المتبقي:' : 'Balance:'}</span>
                <span class="acc-fin-balance tabular-nums ${b.remaining_balance > 0 ? 'is-due' : 'is-zero'}">${escapeHtml(formatCurr(b.remaining_balance))}</span>
              </div>
            </div>
          </td>

          <!-- Actions -->
          <td class="acc-td-actions">
            <a href="accounts-booking-details.html?id=${encodeURIComponent(b.id)}" class="acc-btn acc-btn-sm acc-btn-primary" aria-label="${lang === 'ar' ? 'عرض تفاصيل الحجز ' + b.id : 'View details for ' + b.id}">
              <span>${lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="acc-action-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </td>

        </tr>
      `;
    }).join('');
  }

  // --- 5. Event Listeners & Filter Handlers ---
  function initFilters() {
    // Search input
    const searchInput = document.getElementById('acc-bookings-search');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          state.search = searchInput.value.trim();
          renderFilterChips();
          renderBookingsTable();
        }, 250);
      });
    }

    // Quick filter chips
    document.querySelectorAll('.acc-quick-filters-wrap .acc-chip-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.acc-quick-filters-wrap .acc-chip-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.quickFilter = btn.getAttribute('data-quick-filter') || 'all';
        state.reviewOnly = null;
        renderFilterChips();
        renderBookingsTable();
      });
    });

    // Advanced filters toggle
    const advToggle = document.getElementById('acc-btn-advanced-toggle');
    const advPanel = document.getElementById('acc-advanced-filters-panel');
    if (advToggle && advPanel) {
      advToggle.addEventListener('click', function () {
        state.isAdvancedOpen = !state.isAdvancedOpen;
        advPanel.style.display = state.isAdvancedOpen ? 'block' : 'none';
        advToggle.setAttribute('aria-expanded', state.isAdvancedOpen ? 'true' : 'false');
        advPanel.setAttribute('aria-hidden', state.isAdvancedOpen ? 'false' : 'true');
      });
    }

    // Apply advanced filters
    const applyBtn = document.getElementById('adv-btn-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', function () {
        state.company = document.getElementById('adv-filter-company')?.value || 'all';
        state.programType = document.getElementById('adv-filter-program-type')?.value || 'all';
        state.bookingStatus = document.getElementById('adv-filter-booking-status')?.value || 'all';
        state.paymentStatus = document.getElementById('adv-filter-payment-status')?.value || 'all';
        state.season = document.getElementById('adv-filter-season')?.value || 'all';
        state.dateFrom = document.getElementById('adv-filter-date-from')?.value || '';
        state.dateTo = document.getElementById('adv-filter-date-to')?.value || '';

        renderFilterChips();
        renderBookingsTable();
      });
    }

    // Clear advanced filters
    const clearBtn = document.getElementById('adv-btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        resetAdvancedForm();
        state.company = 'all';
        state.programType = 'all';
        state.bookingStatus = 'all';
        state.paymentStatus = 'all';
        state.season = 'all';
        state.dateFrom = '';
        state.dateTo = '';

        renderFilterChips();
        renderBookingsTable();
      });
    }

    // Clear all chips
    const clearChipsBtn = document.getElementById('acc-btn-clear-chips');
    if (clearChipsBtn) {
      clearChipsBtn.addEventListener('click', function () {
        clearAllFilters();
      });
    }

    // Review section buttons
    const btnRevCol = document.getElementById('btn-review-collections');
    if (btnRevCol) {
      btnRevCol.addEventListener('click', function () {
        clearAllFilters();
        state.reviewOnly = 'collections';
        renderFilterChips();
        renderBookingsTable();
        document.getElementById('acc-bookings-table')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const btnRevRef = document.getElementById('btn-review-refunds');
    if (btnRevRef) {
      btnRevRef.addEventListener('click', function () {
        clearAllFilters();
        state.reviewOnly = 'refunds';
        renderFilterChips();
        renderBookingsTable();
        document.getElementById('acc-bookings-table')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function resetAdvancedForm() {
    const comp = document.getElementById('adv-filter-company');
    const prg = document.getElementById('adv-filter-program-type');
    const bs = document.getElementById('adv-filter-booking-status');
    const ps = document.getElementById('adv-filter-payment-status');
    const ssn = document.getElementById('adv-filter-season');
    const df = document.getElementById('adv-filter-date-from');
    const dt = document.getElementById('adv-filter-date-to');

    if (comp) comp.value = 'all';
    if (prg) prg.value = 'all';
    if (bs) bs.value = 'all';
    if (ps) ps.value = 'all';
    if (ssn) ssn.value = 'all';
    if (df) df.value = '';
    if (dt) dt.value = '';
  }

  function removeFilter(key) {
    if (key === 'search') {
      state.search = '';
      const el = document.getElementById('acc-bookings-search');
      if (el) el.value = '';
    } else if (key === 'quickFilter') {
      state.quickFilter = 'all';
      document.querySelectorAll('.acc-quick-filters-wrap .acc-chip-btn').forEach(b => {
        b.classList.toggle('is-active', b.getAttribute('data-quick-filter') === 'all');
      });
    } else if (key === 'reviewOnly') {
      state.reviewOnly = null;
    } else if (key === 'company') {
      state.company = 'all';
      const el = document.getElementById('adv-filter-company');
      if (el) el.value = 'all';
    } else if (key === 'programType') {
      state.programType = 'all';
      const el = document.getElementById('adv-filter-program-type');
      if (el) el.value = 'all';
    } else if (key === 'bookingStatus') {
      state.bookingStatus = 'all';
      const el = document.getElementById('adv-filter-booking-status');
      if (el) el.value = 'all';
    } else if (key === 'paymentStatus') {
      state.paymentStatus = 'all';
      const el = document.getElementById('adv-filter-payment-status');
      if (el) el.value = 'all';
    } else if (key === 'season') {
      state.season = 'all';
      const el = document.getElementById('adv-filter-season');
      if (el) el.value = 'all';
    } else if (key === 'dateFrom') {
      state.dateFrom = '';
      const el = document.getElementById('adv-filter-date-from');
      if (el) el.value = '';
    } else if (key === 'dateTo') {
      state.dateTo = '';
      const el = document.getElementById('adv-filter-date-to');
      if (el) el.value = '';
    }

    renderFilterChips();
    renderBookingsTable();
  }

  function clearAllFilters() {
    state.search = '';
    state.quickFilter = 'all';
    state.company = 'all';
    state.programType = 'all';
    state.bookingStatus = 'all';
    state.paymentStatus = 'all';
    state.season = 'all';
    state.dateFrom = '';
    state.dateTo = '';
    state.reviewOnly = null;

    const searchInput = document.getElementById('acc-bookings-search');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.acc-quick-filters-wrap .acc-chip-btn').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-quick-filter') === 'all');
    });

    resetAdvancedForm();
    renderFilterChips();
    renderBookingsTable();
  }

  // --- 6. Initialization ---
  function init() {
    localizeAdvFilterDropdowns();
    renderSummaryKPIs();
    renderOperationsRequiringReview();
    initFilters();
    renderFilterChips();
    renderBookingsTable();

    // Register refresh listener with AccountsWorkspace for lang/theme switches
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.registerRefreshListener === 'function') {
      window.AccountsWorkspace.registerRefreshListener(function () {
        localizeAdvFilterDropdowns();
        renderSummaryKPIs();
        renderOperationsRequiringReview();
        renderFilterChips();
        renderBookingsTable();
      });
    }
    // Listen for language change events
    window.addEventListener('accounts-lang-changed', function () {
      localizeAdvFilterDropdowns();
      renderSummaryKPIs();
      renderOperationsRequiringReview();
      renderFilterChips();
      renderBookingsTable();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    removeFilter,
    clearAllFilters
  };
});
