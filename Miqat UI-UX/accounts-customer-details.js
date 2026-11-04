/**
 * MIQAT ACCOUNTS EMPLOYEE WORKSPACE — CUSTOMER PROFILE CONTROLLER
 * Strict UI/UX Correction & Integration
 * 
 * Architectural & Behavioral Features:
 * - Reuses the exact shared Employee Navbar and Sidebar
 * - Completely removes circular avatar in favor of balanced typography & contact grid
 * - Interactive multi-criteria Filter Toolbar (Record Type, Status, Date Range, Reference Search, Reset)
 * - Organized, high-contrast content sections (Bookings, Payments, Receipts, Refunds, Trip Changes, Timeline)
 * - Accessible, read-only Receipt Details Modal with ESC, backdrop, and close button support
 * - Strict Zero-Red and Zero-Green policy across all badges and pills
 * - Bilingual Arabic (RTL) & English (LTR) with live refresh listener
 */

(function () {
  'use strict';

  // State Management
  let currentCustomerId = null;
  let rawCustomerData = null;

  const filters = {
    recordType: 'all',
    status: 'all',
    dateRange: 'all',
    searchRef: ''
  };

  // Helper references
  function getLang() {
    return (window.AccountsWorkspace && window.AccountsWorkspace.getCurrentLang)
      ? window.AccountsWorkspace.getCurrentLang()
      : (localStorage.getItem('miqat_lang') || 'ar');
  }

  function t(key, fallback) {
    if (window.AccountsWorkspace && window.AccountsWorkspace.t) {
      return window.AccountsWorkspace.t(key, fallback);
    }
    return fallback || key;
  }

  function formatNum(num) {
    const lang = getLang();
    if (window.AccountsWorkspace && window.AccountsWorkspace.formatNumber) {
      return window.AccountsWorkspace.formatNumber(num, lang);
    }
    return String(num);
  }

  function formatCurr(amount) {
    const lang = getLang();
    if (window.AccountsWorkspace && window.AccountsWorkspace.formatCurrency) {
      return window.AccountsWorkspace.formatCurrency(amount, lang);
    }
    return (lang === 'ar' ? formatNum(amount) + ' ج.م' : 'EGP ' + formatNum(amount));
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Status Resolvers (Strict Zero-Red and Zero-Green Policy)
  function getBookingStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'confirmed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_confirmed', 'مؤكد') : 'Confirmed',
          cssClass: 'status-pill-navy'
        };
      case 'deposit_paid':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_deposit_paid', 'مسدد دفعة / عربون') : 'Deposit Paid',
          cssClass: 'status-pill-amber'
        };
      case 'new':
      case 'in_progress':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_new', 'قيد التنفيذ') : 'In Progress',
          cssClass: 'status-pill-blue'
        };
      case 'completed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_completed', 'مكتمل الرحلة') : 'Trip Completed',
          cssClass: 'status-pill-indigo'
        };
      case 'cancelled':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_cancelled', 'حجز ملغي') : 'Cancelled',
          cssClass: 'status-pill-slate'
        };
      default:
        return { label: status, cssClass: 'status-pill-slate' };
    }
  }

  function getPaymentStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'paid_full':
      case 'completed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_full', 'مسدد بالكامل') : 'Paid in Full',
          cssClass: 'status-pill-navy'
        };
      case 'partial':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_partial', 'سداد جزئي') : 'Partial',
          cssClass: 'status-pill-amber'
        };
      case 'unpaid':
      case 'pending':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_unpaid', 'غير مسدد / معلق') : 'Unpaid / Pending',
          cssClass: 'status-pill-amber'
        };
      case 'refunded':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_refunded', 'مسترد') : 'Refunded',
          cssClass: 'status-pill-slate'
        };
      default:
        return { label: status, cssClass: 'status-pill-slate' };
    }
  }

  function getReceiptVerificationBadge(state) {
    const lang = getLang();
    // Distinct between Pending Review vs Verified
    if (state === 'verified') {
      return {
        label: lang === 'ar' ? t('accounts_workspace.receipt_state_verified', 'معتمد ومطابق دفترياً') : 'Verified & Reconciled',
        cssClass: 'status-pill-navy'
      };
    }
    return {
      label: lang === 'ar' ? t('accounts_workspace.receipt_state_pending', 'مسجل - بانتظار التدقيق والمطابقة') : 'Recorded - Pending Audit & Match',
      cssClass: 'status-pill-amber'
    };
  }

  function getRefundStatusBadge(state) {
    const lang = getLang();
    // Distinct between Request vs Completed
    switch (state) {
      case 'under_review':
      case 'pending':
        return {
          label: lang === 'ar' ? t('accounts_workspace.refund_state_under_review', 'طلب قيد الدراسة والاعتماد') : 'Request Under Review',
          cssClass: 'status-pill-amber'
        };
      case 'executed':
      case 'completed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.refund_state_executed', 'استرداد مسوى ومنفذ') : 'Refund Reconciled & Paid',
          cssClass: 'status-pill-navy'
        };
      case 'rejected':
        return {
          label: lang === 'ar' ? t('accounts_workspace.refund_state_rejected', 'طلب مرفوض') : 'Refund Rejected',
          cssClass: 'status-pill-slate'
        };
      default:
        return { label: state, cssClass: 'status-pill-slate' };
    }
  }

  function getCustomerAgreementBadge(state) {
    const lang = getLang();
    // Rule: Proposed program does NOT replace official program until customer agrees
    switch (state) {
      case 'approved':
      case 'agreed':
        return {
          label: lang === 'ar' ? 'موافق عليه من العميل' : 'Agreed by Customer',
          cssClass: 'status-pill-navy'
        };
      case 'pending':
      case 'pending_agreement':
        return {
          label: lang === 'ar' ? 'بانتظار موافقة العميل' : 'Pending Customer Agreement',
          cssClass: 'status-pill-amber'
        };
      case 'rejected':
        return {
          label: lang === 'ar' ? 'مرفوض من العميل' : 'Rejected by Customer',
          cssClass: 'status-pill-slate'
        };
      default:
        return { label: state, cssClass: 'status-pill-slate' };
    }
  }

  function getTripChangeStatusBadge(state) {
    const lang = getLang();
    switch (state) {
      case 'applied':
        return {
          label: lang === 'ar' ? 'معتمد ومنفذ' : 'Applied & Active',
          cssClass: 'status-pill-navy'
        };
      case 'under_review':
      case 'pending_approval':
        return {
          label: lang === 'ar' ? 'قيد المراجعة التشغيلية' : 'Under Review',
          cssClass: 'status-pill-blue'
        };
      case 'cancelled':
      case 'rejected':
        return {
          label: lang === 'ar' ? 'ملغي' : 'Cancelled',
          cssClass: 'status-pill-slate'
        };
      default:
        return { label: state, cssClass: 'status-pill-slate' };
    }
  }

  // Customer ID Resolution
  function resolveCustomerId() {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id');
    if (urlId && urlId.trim()) {
      return urlId.trim();
    }
    const storedId = sessionStorage.getItem('miqat_selected_customer_id');
    if (storedId && storedId.trim()) {
      return storedId.trim();
    }
    return null;
  }

  function loadCustomer() {
    const id = resolveCustomerId();
    currentCustomerId = id;

    if (!id || !window.AccountsMockData) {
      showNotFoundState();
      return;
    }

    const data = window.AccountsMockData.getCustomerDetails(id);
    if (!data) {
      showNotFoundState();
      return;
    }

    sessionStorage.setItem('miqat_selected_customer_id', id);
    rawCustomerData = data;

    renderCustomerIdentity(data);
    renderCustomerKPIs(data);
    applyFiltersAndRenderSections();
  }

  function showNotFoundState() {
    const container = document.getElementById('cust-profile-container');
    const notFoundCard = document.getElementById('cust-not-found-card');
    if (container) container.style.display = 'none';
    if (notFoundCard) notFoundCard.style.display = 'block';
  }

  // 1. Render Customer Identity (NO CIRCULAR AVATAR)
  function renderCustomerIdentity(customer) {
    const container = document.getElementById('cust-profile-container');
    const notFoundCard = document.getElementById('cust-not-found-card');
    if (container) container.style.display = 'block';
    if (notFoundCard) notFoundCard.style.display = 'none';

    const lang = getLang();

    const nameEl = document.getElementById('cust-profile-name');
    const idEl = document.getElementById('cust-profile-id');
    const regDateEl = document.getElementById('cust-profile-reg-date');
    const phoneEl = document.getElementById('cust-profile-phone');
    const telLink = document.getElementById('cust-tel-link');
    const waEl = document.getElementById('cust-profile-wa');
    const waLink = document.getElementById('cust-wa-link');
    const emailEl = document.getElementById('cust-profile-email');
    const govEl = document.getElementById('cust-profile-gov');

    const customerName = lang === 'ar' ? customer.name_ar : customer.name_en;
    if (nameEl) nameEl.textContent = customerName;
    if (idEl) idEl.textContent = customer.id;
    if (regDateEl) regDateEl.textContent = customer.registered_date || '2026-10-25';
    if (phoneEl) phoneEl.textContent = customer.phone || '—';
    if (telLink) telLink.href = customer.phone ? `tel:${customer.phone}` : '#';
    if (waEl) waEl.textContent = customer.whatsapp || customer.phone || '—';
    if (waLink) {
      const cleanWa = (customer.whatsapp || customer.phone || '').replace(/[^0-9]/g, '');
      const waNumber = cleanWa.startsWith('0') ? '2' + cleanWa : cleanWa;
      waLink.href = cleanWa ? `https://wa.me/${waNumber}` : '#';
    }
    if (emailEl) emailEl.textContent = customer.email || '—';
    if (govEl) govEl.textContent = (lang === 'ar' ? customer.governorate_ar : customer.governorate_en) || '—';
  }

  // 2. Render Financial KPI Summary Cards
  function renderCustomerKPIs(customer) {
    const summary = customer.summary || window.AccountsMockData.getCustomerFinancialSummary(customer.id);
    const metricBookings = document.getElementById('cust-metric-total-bookings');
    const metricPaid = document.getElementById('cust-metric-total-paid');
    const metricBalance = document.getElementById('cust-metric-balance');
    const metricPending = document.getElementById('cust-metric-pending-items');

    if (metricBookings) metricBookings.textContent = formatNum(summary.totalBookings || 0);
    if (metricPaid) metricPaid.textContent = formatNum(summary.totalPaid || 0);
    if (metricBalance) metricBalance.textContent = formatNum(summary.outstandingBalance || 0);
    if (metricPending) metricPending.textContent = formatNum(summary.pendingItemsCount || 0);
  }

  // 3. Multi-Criteria Filtering Engine
  function applyFiltersAndRenderSections() {
    if (!rawCustomerData) return;

    const { recordType, status, dateRange, searchRef } = filters;
    const query = searchRef.toLowerCase().trim();

    // Section Visibility control based on recordType
    const sections = [
      { id: 'sec-bookings', key: 'bookings' },
      { id: 'sec-payments', key: 'payments' },
      { id: 'sec-receipts', key: 'receipts' },
      { id: 'sec-refunds', key: 'refunds' },
      { id: 'sec-changes', key: 'changes' },
      { id: 'sec-timeline', key: 'timeline' }
    ];

    sections.forEach(s => {
      const secEl = document.getElementById(s.id);
      if (!secEl) return;
      if (recordType === 'all' || recordType === s.key) {
        secEl.style.display = 'block';
      } else {
        secEl.style.display = 'none';
      }
    });

    // Helper: matches search query
    function matchesQuery(item, fields) {
      if (!query) return true;
      return fields.some(f => {
        const val = item[f];
        return val && String(val).toLowerCase().includes(query);
      });
    }

    // Helper: matches status
    function matchesStatus(itemStatus, targetStatus) {
      if (targetStatus === 'all') return true;
      if (targetStatus === 'confirmed') {
        return ['confirmed', 'paid_full', 'verified', 'approved', 'applied', 'agreed'].includes(itemStatus);
      }
      if (targetStatus === 'pending') {
        return ['pending', 'pending_approval', 'under_review', 'deposit_paid', 'partial', 'pending_agreement'].includes(itemStatus);
      }
      if (targetStatus === 'completed') {
        return ['completed', 'executed', 'paid_full', 'verified'].includes(itemStatus);
      }
      return true;
    }

    // Helper: matches date range
    function matchesDate(dateStr, targetRange) {
      if (targetRange === 'all') return true;
      if (!dateStr) return true;
      // All mock data falls in 2026/2027 season
      if (targetRange === 'season') return true;
      if (targetRange === 'last_30') {
        return dateStr.includes('2026-10') || dateStr.includes('2026-11');
      }
      if (targetRange === 'last_90') {
        return dateStr.includes('2026-09') || dateStr.includes('2026-10') || dateStr.includes('2026-11');
      }
      return true;
    }

    // Filter Bookings
    const filteredBookings = (rawCustomerData.bookings || []).filter(b => {
      const matchQ = matchesQuery(b, ['id', 'program_ar', 'program_en', 'company_ar', 'company_en']);
      const matchS = matchesStatus(b.booking_status, status) || matchesStatus(b.payment_status, status);
      const matchD = matchesDate(b.booking_date, dateRange);
      return matchQ && matchS && matchD;
    });

    // Filter Payments
    const filteredPayments = (rawCustomerData.payments || []).filter(p => {
      const matchQ = matchesQuery(p, ['id', 'booking_id', 'receipt_ref', 'method_ar', 'method_en']);
      const matchS = matchesStatus(p.status, status);
      const matchD = matchesDate(p.date, dateRange);
      return matchQ && matchS && matchD;
    });

    // Filter Receipts
    const filteredReceipts = (rawCustomerData.receipts || []).filter(r => {
      const matchQ = matchesQuery(r, ['receipt_num', 'booking_id', 'payment_id', 'method_ar', 'method_en', 'collector_ar', 'collector_en']);
      const matchS = matchesStatus(r.verification_state, status);
      const matchD = matchesDate(r.date, dateRange);
      return matchQ && matchS && matchD;
    });

    // Filter Refunds
    const filteredRefunds = (rawCustomerData.refunds || []).filter(rf => {
      const matchQ = matchesQuery(rf, ['id', 'refund_id', 'booking_id', 'reason_ar', 'reason_en']);
      const matchS = matchesStatus(rf.status, status);
      const matchD = matchesDate(rf.request_date || rf.date, dateRange);
      return matchQ && matchS && matchD;
    });

    // Filter Trip Changes
    const filteredChanges = (rawCustomerData.tripChanges || []).filter(ch => {
      const matchQ = matchesQuery(ch, ['id', 'change_id', 'booking_id', 'original_program_ar', 'proposed_program_ar']);
      const matchS = matchesStatus(ch.customer_agreement || ch.customer_agreement_status, status) || matchesStatus(ch.change_status || ch.status, status);
      const matchD = matchesDate(ch.request_date, dateRange);
      return matchQ && matchS && matchD;
    });

    // Filter Timeline
    const filteredTimeline = (rawCustomerData.timeline || []).filter(tl => {
      const matchQ = matchesQuery(tl, ['title_ar', 'title_en', 'desc_ar', 'desc_en', 'category']);
      const matchD = matchesDate(tl.date, dateRange);
      return matchQ && matchD;
    });

    // Update section count badges
    updateCountBadge('badge-count-bookings', filteredBookings.length);
    updateCountBadge('badge-count-payments', filteredPayments.length);
    updateCountBadge('badge-count-receipts', filteredReceipts.length);
    updateCountBadge('badge-count-refunds', filteredRefunds.length);
    updateCountBadge('badge-count-changes', filteredChanges.length);
    updateCountBadge('badge-count-timeline', filteredTimeline.length);

    // Render tables with filtered data
    renderBookingsTable(filteredBookings);
    renderPaymentsTable(filteredPayments);
    renderReceiptsTable(filteredReceipts);
    renderRefundsTable(filteredRefunds);
    renderTripChangesTable(filteredChanges);
    renderTimeline(filteredTimeline);
  }

  function updateCountBadge(id, count) {
    const el = document.getElementById(id);
    if (el) el.textContent = formatNum(count);
  }

  // --- Section 1: Bookings Table ---
  function renderBookingsTable(bookings) {
    const tbody = document.getElementById('tbody-bookings');
    if (!tbody) return;
    const lang = getLang();

    if (!bookings || bookings.length === 0) {
      tbody.innerHTML = `
        <tr class="acc-table-empty-row">
          <td colspan="10" class="acc-table-empty-cell">
            <div class="acc-empty-state-wrap">
              <span class="acc-empty-icon" aria-hidden="true">📂</span>
              <p class="acc-empty-text">${lang === 'ar' ? 'لا توجد حجوزات مطابقة لمعايير التصفية' : 'No bookings matching the filter criteria'}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = bookings.map(b => {
      const opBadge = getBookingStatusBadge(b.booking_status);
      const payBadge = getPaymentStatusBadge(b.payment_status);
      const program = lang === 'ar' ? b.program_ar : b.program_en;
      const company = lang === 'ar' ? b.company_ar : b.company_en;
      const season = lang === 'ar' ? b.travel_season_ar : b.travel_season_en;
      const travelers = formatNum(b.travelers_count) + ' ' + (lang === 'ar' ? 'معتمر' : 'Pilgrims');

      return `
        <tr>
          <td>
            <span class="acc-code-pill tabular-nums">${escapeHtml(b.id)}</span>
          </td>
          <td>
            <strong class="acc-program-title">${escapeHtml(program)}</strong>
          </td>
          <td>
            <span class="acc-company-name">${escapeHtml(company)}</span>
          </td>
          <td>
            <span class="acc-season-name tabular-nums">${escapeHtml(season)}</span>
          </td>
          <td>
            <span class="acc-count-badge tabular-nums">${escapeHtml(travelers)}</span>
          </td>
          <td>
            <strong class="acc-amount tabular-nums">${escapeHtml(formatCurr(b.total_price))}</strong>
          </td>
          <td>
            <span class="acc-amount tabular-nums">${escapeHtml(formatCurr(b.paid_amount))}</span>
          </td>
          <td>
            <span class="acc-amount tabular-nums ${b.remaining > 0 ? 'acc-amount-remaining' : ''}">${escapeHtml(formatCurr(b.remaining))}</span>
          </td>
          <td>
            <span class="acc-status-pill ${opBadge.cssClass}">${escapeHtml(opBadge.label)}</span>
          </td>
          <td>
            <span class="acc-status-pill ${payBadge.cssClass}">${escapeHtml(payBadge.label)}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Section 2: Payments Table ---
  function renderPaymentsTable(payments) {
    const tbody = document.getElementById('tbody-payments');
    if (!tbody) return;
    const lang = getLang();

    if (!payments || payments.length === 0) {
      tbody.innerHTML = `
        <tr class="acc-table-empty-row">
          <td colspan="7" class="acc-table-empty-cell">
            <div class="acc-empty-state-wrap">
              <span class="acc-empty-icon" aria-hidden="true">💳</span>
              <p class="acc-empty-text">${lang === 'ar' ? 'لا توجد حركات مالية مطابقة لمعايير التصفية' : 'No payments matching the filter criteria'}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = payments.map(p => {
      const statusBadge = getPaymentStatusBadge(p.status);
      const method = lang === 'ar' ? p.method_ar : p.method_en;

      return `
        <tr>
          <td>
            <span class="acc-code-pill tabular-nums">${escapeHtml(p.id)}</span>
          </td>
          <td>
            <span class="acc-sub-pill tabular-nums">${escapeHtml(p.booking_id)}</span>
          </td>
          <td>
            <span class="acc-date-cell tabular-nums">${escapeHtml(p.date)}</span>
          </td>
          <td>
            <strong class="acc-amount tabular-nums">${escapeHtml(formatCurr(p.amount))}</strong>
          </td>
          <td>
            <span class="acc-method-pill">${escapeHtml(method)}</span>
          </td>
          <td>
            ${p.receipt_ref
              ? `<button type="button" class="acc-receipt-ref-btn tabular-nums" onclick="window.AccountsCustomerProfile.viewReceiptByRef('${escapeHtml(p.receipt_ref)}')">${escapeHtml(p.receipt_ref)}</button>`
              : '<span class="acc-text-muted">—</span>'
            }
          </td>
          <td>
            <span class="acc-status-pill ${statusBadge.cssClass}">${escapeHtml(statusBadge.label)}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Section 3: Receipts Table (Requirement 7: Spacious, separated columns, distinct verification) ---
  function renderReceiptsTable(receipts) {
    const tbody = document.getElementById('tbody-receipts');
    if (!tbody) return;
    const lang = getLang();

    if (!receipts || receipts.length === 0) {
      tbody.innerHTML = `
        <tr class="acc-table-empty-row">
          <td colspan="8" class="acc-table-empty-cell">
            <div class="acc-empty-state-wrap">
              <span class="acc-empty-icon" aria-hidden="true">🧾</span>
              <p class="acc-empty-text">${lang === 'ar' ? t('accounts_workspace.empty_receipts_desc', 'لا توجد إيصالات سداد مطابقة لمعايير التصفية') : 'No payment receipts matching the filter criteria'}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = receipts.map(r => {
      const verBadge = getReceiptVerificationBadge(r.verification_state);
      const method = lang === 'ar' ? r.method_ar : r.method_en;
      const collector = lang === 'ar' ? r.collector_ar : r.collector_en;

      return `
        <tr>
          <td>
            <strong class="acc-code-pill tabular-nums">${escapeHtml(r.receipt_num)}</strong>
          </td>
          <td>
            <span class="acc-sub-pill tabular-nums">${escapeHtml(r.booking_id || '—')}</span>
          </td>
          <td>
            <span class="acc-date-cell tabular-nums">${escapeHtml(r.date)}</span>
          </td>
          <td>
            <strong class="acc-amount tabular-nums">${escapeHtml(formatCurr(r.amount))}</strong>
          </td>
          <td>
            <span class="acc-method-pill">${escapeHtml(method)}</span>
          </td>
          <td>
            <span class="acc-collector-name">${escapeHtml(collector)}</span>
          </td>
          <td>
            <span class="acc-status-pill ${verBadge.cssClass}">${escapeHtml(verBadge.label)}</span>
          </td>
          <td class="acc-th-actions">
            <button type="button" class="acc-btn-view-rcpt" onclick="window.AccountsCustomerProfile.openReceiptDetails('${escapeHtml(r.receipt_num)}')" aria-label="${lang === 'ar' ? 'عرض تفاصيل الإيصال' : 'View Receipt Details'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>${lang === 'ar' ? t('accounts_workspace.btn_view_receipt', 'عرض الإيصال') : 'View Receipt'}</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Section 4: Refunds Table ---
  function renderRefundsTable(refunds) {
    const tbody = document.getElementById('tbody-refunds');
    if (!tbody) return;
    const lang = getLang();

    if (!refunds || refunds.length === 0) {
      tbody.innerHTML = `
        <tr class="acc-table-empty-row">
          <td colspan="6" class="acc-table-empty-cell">
            <div class="acc-empty-state-wrap">
              <span class="acc-empty-icon" aria-hidden="true">🔄</span>
              <p class="acc-empty-text">${lang === 'ar' ? t('accounts_workspace.empty_refunds_desc', 'لا توجد طلبات استرداد مسجلة لهذا العميل') : 'No refund requests recorded for this customer'}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = refunds.map(rf => {
      const stateBadge = getRefundStatusBadge(rf.status);
      const reason = lang === 'ar' ? rf.reason_ar : rf.reason_en;

      return `
        <tr>
          <td>
            <span class="acc-code-pill tabular-nums">${escapeHtml(rf.id || rf.refund_id)}</span>
          </td>
          <td>
            <span class="acc-sub-pill tabular-nums">${escapeHtml(rf.booking_id)}</span>
          </td>
          <td>
            <strong class="acc-amount tabular-nums">${escapeHtml(formatCurr(rf.amount))}</strong>
          </td>
          <td>
            <span class="acc-date-cell tabular-nums">${escapeHtml(rf.request_date || rf.date)}</span>
          </td>
          <td>
            <span class="acc-refund-reason">${escapeHtml(reason)}</span>
          </td>
          <td>
            <span class="acc-status-pill ${stateBadge.cssClass}">${escapeHtml(stateBadge.label)}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Section 5: Trip Changes Table ---
  function renderTripChangesTable(changes) {
    const tbody = document.getElementById('tbody-changes');
    if (!tbody) return;
    const lang = getLang();

    if (!changes || changes.length === 0) {
      tbody.innerHTML = `
        <tr class="acc-table-empty-row">
          <td colspan="6" class="acc-table-empty-cell">
            <div class="acc-empty-state-wrap">
              <span class="acc-empty-icon" aria-hidden="true">🛫</span>
              <p class="acc-empty-text">${lang === 'ar' ? 'لا توجد طلبات لتعديل البرامج أو الرحلات مسجلة لهذا العميل' : 'No program change requests recorded for this customer'}</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = changes.map(ch => {
      const agreementBadge = getCustomerAgreementBadge(ch.customer_agreement || ch.customer_agreement_status);
      const changeStatusBadge = getTripChangeStatusBadge(ch.change_status || ch.status);
      const origProgram = lang === 'ar' ? ch.original_program_ar : ch.original_program_en;
      const propProgram = lang === 'ar' ? ch.proposed_program_ar : ch.proposed_program_en;
      const diffFormatted = ch.price_diff === 0
        ? (lang === 'ar' ? 'بدون فارق سعري' : 'No Price Diff')
        : formatCurr(ch.price_diff);

      return `
        <tr>
          <td>
            <span class="acc-code-pill tabular-nums">${escapeHtml(ch.id || ch.change_id)}</span>
          </td>
          <td>
            <strong class="acc-program-title">${escapeHtml(origProgram)}</strong>
          </td>
          <td>
            <span class="acc-proposed-program">${escapeHtml(propProgram)}</span>
          </td>
          <td>
            <span class="acc-amount tabular-nums">${escapeHtml(diffFormatted)}</span>
          </td>
          <td>
            <span class="acc-status-pill ${agreementBadge.cssClass}">${escapeHtml(agreementBadge.label)}</span>
          </td>
          <td>
            <span class="acc-status-pill ${changeStatusBadge.cssClass}">${escapeHtml(changeStatusBadge.label)}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Section 6: Activity Timeline ---
  function renderTimeline(timelineItems) {
    const list = document.getElementById('cust-timeline-list');
    if (!list) return;
    const lang = getLang();

    if (!timelineItems || timelineItems.length === 0) {
      list.innerHTML = `
        <div class="acc-empty-state-wrap">
          <span class="acc-empty-icon" aria-hidden="true">🕒</span>
          <p class="acc-empty-text">${lang === 'ar' ? 'لا توجد أنشطة مسجلة في الخط الزمني' : 'No timeline activities recorded'}</p>
        </div>
      `;
      return;
    }

    list.innerHTML = timelineItems.map((item, idx) => {
      const title = lang === 'ar' ? item.title_ar : item.title_en;
      const desc = lang === 'ar' ? item.desc_ar : item.desc_en;
      const catClass = getCategoryBadgeClass(item.category);
      const catLabel = getCategoryLabel(item.category, lang);

      return `
        <div class="acc-timeline-item">
          <div class="acc-timeline-marker">
            <span class="acc-timeline-dot ${catClass}"></span>
            ${idx < timelineItems.length - 1 ? '<span class="acc-timeline-line"></span>' : ''}
          </div>
          <div class="acc-timeline-content">
            <div class="acc-timeline-header">
              <strong class="acc-timeline-title">${escapeHtml(title)}</strong>
              <span class="acc-timeline-date tabular-nums">${escapeHtml(item.date)}</span>
            </div>
            <p class="acc-timeline-desc">${escapeHtml(desc)}</p>
            <div class="acc-timeline-footer">
              <span class="acc-timeline-cat-pill ${catClass}">${escapeHtml(catLabel)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getCategoryBadgeClass(cat) {
    switch (cat) {
      case 'registration': return 'cat-navy';
      case 'booking': return 'cat-blue';
      case 'payment': return 'cat-indigo';
      case 'receipt': return 'cat-teal';
      case 'refund': return 'cat-amber';
      case 'change': return 'cat-slate';
      default: return 'cat-slate';
    }
  }

  function getCategoryLabel(cat, lang) {
    if (lang === 'ar') {
      switch (cat) {
        case 'registration': return 'تسجيل حساب';
        case 'booking': return 'حجز برنامج';
        case 'payment': return 'سداد مالي';
        case 'receipt': return 'إيصال ومطابقة';
        case 'refund': return 'طلب استرداد';
        case 'change': return 'تعديل رحلة';
        default: return 'نشاط عام';
      }
    } else {
      switch (cat) {
        case 'registration': return 'Registration';
        case 'booking': return 'Booking';
        case 'payment': return 'Payment';
        case 'receipt': return 'Receipt Audit';
        case 'refund': return 'Refund';
        case 'change': return 'Trip Change';
        default: return 'Activity';
      }
    }
  }

  // --- Receipt Modal Dialog (Accessible, Centered, Read-Only) ---
  function openReceiptDetails(receiptNum) {
    if (!rawCustomerData || !rawCustomerData.receipts) return;
    const r = rawCustomerData.receipts.find(rc => rc.receipt_num === receiptNum);
    if (!r) return;
    showReceiptModal(r);
  }

  function viewReceiptByRef(receiptRef) {
    openReceiptDetails(receiptRef);
  }

  function showReceiptModal(receipt) {
    const modal = document.getElementById('acc-receipt-modal');
    const modalBody = document.getElementById('modal-receipt-body');
    if (!modal || !modalBody) return;

    const lang = getLang();
    const verBadge = getReceiptVerificationBadge(receipt.verification_state);
    const method = lang === 'ar' ? receipt.method_ar : receipt.method_en;
    const collector = lang === 'ar' ? receipt.collector_ar : receipt.collector_en;
    const customerName = lang === 'ar' ? rawCustomerData.name_ar : rawCustomerData.name_en;
    const notes = lang === 'ar' ? receipt.notes_ar : receipt.notes_en;

    modalBody.innerHTML = `
      <div class="acc-receipt-modal-inner">
        
        <div class="acc-receipt-modal-header-card">
          <div class="acc-receipt-ref-row">
            <span class="acc-receipt-num-title">${lang === 'ar' ? 'رقم الإيصال:' : 'Receipt #:'}</span>
            <strong class="acc-receipt-num-val tabular-nums">${escapeHtml(receipt.receipt_num)}</strong>
            <span class="acc-status-pill ${verBadge.cssClass}">${escapeHtml(verBadge.label)}</span>
          </div>
          <div class="acc-receipt-amount-display">
            <span class="acc-receipt-amount-label">${lang === 'ar' ? 'المبلغ المحصل المثبت' : 'Collected Amount'}</span>
            <strong class="acc-receipt-amount-value tabular-nums">${escapeHtml(formatCurr(receipt.amount))}</strong>
          </div>
        </div>

        <div class="acc-receipt-grid">
          <div class="acc-receipt-grid-item">
            <span class="acc-receipt-grid-label">${lang === 'ar' ? 'اسم العميل' : 'Customer Name'}</span>
            <strong class="acc-receipt-grid-val">${escapeHtml(customerName)}</strong>
          </div>
          <div class="acc-receipt-grid-item">
            <span class="acc-receipt-grid-label">${lang === 'ar' ? 'كود العميل' : 'Customer ID'}</span>
            <strong class="acc-receipt-grid-val tabular-nums">${escapeHtml(rawCustomerData.id)}</strong>
          </div>
          <div class="acc-receipt-grid-item">
            <span class="acc-receipt-grid-label">${lang === 'ar' ? 'رقم الحجز المرتبط' : 'Linked Booking'}</span>
            <strong class="acc-receipt-grid-val tabular-nums">${escapeHtml(receipt.booking_id || '—')}</strong>
          </div>
          <div class="acc-receipt-grid-item">
            <span class="acc-receipt-grid-label">${lang === 'ar' ? 'تاريخ التحرير والإيداع' : 'Issue Date'}</span>
            <strong class="acc-receipt-grid-val tabular-nums">${escapeHtml(receipt.date)}</strong>
          </div>
          <div class="acc-receipt-grid-item">
            <span class="acc-receipt-grid-label">${lang === 'ar' ? 'طريقة التحصيل' : 'Payment Channel'}</span>
            <strong class="acc-receipt-grid-val">${escapeHtml(method)}</strong>
          </div>
          <div class="acc-receipt-grid-item">
            <span class="acc-receipt-grid-label">${lang === 'ar' ? 'الموظف / المحصل المسؤول' : 'Recorded By'}</span>
            <strong class="acc-receipt-grid-val">${escapeHtml(collector)}</strong>
          </div>
        </div>

        ${notes ? `
          <div class="acc-receipt-notes-card">
            <span class="acc-receipt-notes-title">${lang === 'ar' ? 'ملاحظات التدقيق والمطابقة الدفترية:' : 'Audit & Reconciliation Notes:'}</span>
            <p class="acc-receipt-notes-body">${escapeHtml(notes)}</p>
          </div>
        ` : ''}

        <div class="acc-receipt-modal-actions">
          <button type="button" class="acc-btn acc-btn-secondary" onclick="window.AccountsCustomerProfile.closeReceiptModal()">
            ${lang === 'ar' ? 'إغلاق الإيصال' : 'Close Receipt'}
          </button>
        </div>

      </div>
    `;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReceiptModal() {
    const modal = document.getElementById('acc-receipt-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initReceiptModalEvents() {
    const modal = document.getElementById('acc-receipt-modal');
    const closeBtn = document.getElementById('modal-receipt-close');
    const backdrop = document.getElementById('modal-receipt-backdrop');

    if (closeBtn) {
      closeBtn.addEventListener('click', closeReceiptModal);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeReceiptModal);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeReceiptModal();
      }
    });
  }

  // --- Filter Toolbar Event Handlers ---
  function initFilterToolbar() {
    const typeSelect = document.getElementById('filter-record-type');
    const statusSelect = document.getElementById('filter-status');
    const dateSelect = document.getElementById('filter-date-range');
    const searchInput = document.getElementById('filter-search-ref');
    const resetBtn = document.getElementById('btn-reset-profile-filters');

    if (typeSelect) {
      typeSelect.addEventListener('change', function () {
        filters.recordType = this.value;
        applyFiltersAndRenderSections();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        filters.status = this.value;
        applyFiltersAndRenderSections();
      });
    }

    if (dateSelect) {
      dateSelect.addEventListener('change', function () {
        filters.dateRange = this.value;
        applyFiltersAndRenderSections();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        filters.searchRef = this.value;
        applyFiltersAndRenderSections();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        filters.recordType = 'all';
        filters.status = 'all';
        filters.dateRange = 'all';
        filters.searchRef = '';

        if (typeSelect) typeSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (dateSelect) dateSelect.value = 'all';
        if (searchInput) searchInput.value = '';

        applyFiltersAndRenderSections();
      });
    }
  }

  // --- Document Title Localization ---
  function updateDocumentTitle() {
    const lang = getLang();
    document.title = (lang === 'ar') ? 'ملف العميل | ميقات' : 'Customer Profile | Miqat';
  }

  // --- Workspace Initialization ---
  function init() {
    updateDocumentTitle();
    initFilterToolbar();
    initReceiptModalEvents();
    loadCustomer();

    if (window.AccountsWorkspace && window.AccountsWorkspace.onPageRefresh) {
      window.AccountsWorkspace.onPageRefresh(function () {
        updateDocumentTitle();
        if (rawCustomerData) {
          renderCustomerIdentity(rawCustomerData);
          renderCustomerKPIs(rawCustomerData);
          applyFiltersAndRenderSections();
        } else {
          loadCustomer();
        }
      });
    }
  }

  // Public API
  window.AccountsCustomerProfile = {
    openReceiptDetails,
    viewReceiptByRef,
    closeReceiptModal,
    reload: loadCustomer
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
