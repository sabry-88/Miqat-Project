/**
 * MIQAT ACCOUNTS WORKSPACE — BOOKING DETAILS CONTROLLER
 * 
 * Manages the Comprehensive Booking Details View:
 * - Persistent Booking Summary Header with live financial indicators
 * - 5 Functional Tabs: Overview, Travelers, Payments, Refunds, Activity Log
 * - Overview Tab: 7 structured sections including Company vs Private Internal Notes
 * - Travelers Tab: Read-only traveler list with completion pills & Accounts role notice
 * - Payments Tab: Independent payment records, CSV export, Review & Approve modal,
 *   Internal Discussion thread modal, Evidence preview modal, Financial Audit Trail
 * - Refunds Tab: Strict financial limit calculation (Approved Paid minus Disbursed Refunds),
 *   refund requests table & modal
 * - Activity Log Tab: Latest 10 activities stream & link to Full Activity Log
 * - Strict Zero-Red and Zero-Green status pill compliance
 * - Accessible modal dialogs with focus trapping & Esc dismiss
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsBookingDetails = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Internal State
  let currentBooking = null;
  let activeTab = null;
  let activePaymentFilter = 'all';
  let activeSelectedTx = null;
  let activeSelectedRefund = null;

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
        return { label: lang === 'ar' ? 'مؤكد' : 'Confirmed', cssClass: 'status-pill-navy' };
      case 'deposit_paid':
      case 'deposit':
        return { label: lang === 'ar' ? 'عربون مسدد' : 'Deposit Paid', cssClass: 'status-pill-amber' };
      case 'under_review':
      case 'pending':
        return { label: lang === 'ar' ? 'قيد المراجعة' : 'Under Review', cssClass: 'status-pill-amber' };
      case 'new':
        return { label: lang === 'ar' ? 'طلب جديد' : 'New Booking', cssClass: 'status-pill-blue' };
      case 'cancelled':
        return { label: lang === 'ar' ? 'ملغي' : 'Cancelled', cssClass: 'status-pill-slate' };
      case 'refund_requested':
        return { label: lang === 'ar' ? 'طلب استرداد' : 'Refund Requested', cssClass: 'status-pill-indigo' };
      default:
        return { label: status || '—', cssClass: 'status-pill-slate' };
    }
  }

  function getPaymentStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'paid':
      case 'paid_full':
        return { label: lang === 'ar' ? 'مسدد بالكامل' : 'Fully Paid', cssClass: 'status-pill-navy' };
      case 'partially_paid':
      case 'partial':
        return { label: lang === 'ar' ? 'مسدد جزئياً' : 'Partially Paid', cssClass: 'status-pill-amber' };
      case 'unpaid':
        return { label: lang === 'ar' ? 'غير مسدد' : 'Unpaid', cssClass: 'status-pill-slate' };
      case 'pending_review':
      case 'pending_verification':
      case 'pending_clearance':
        return { label: lang === 'ar' ? 'تحصيل قيد التدقيق' : 'Pending Audit', cssClass: 'status-pill-amber' };
      case 'refunded':
        return { label: lang === 'ar' ? 'مسترد' : 'Refunded', cssClass: 'status-pill-indigo' };
      default:
        return { label: status || '—', cssClass: 'status-pill-slate' };
    }
  }

  function getTxAuditStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'approved':
        return { label: lang === 'ar' ? 'معتمد دفترياً' : 'Approved', cssClass: 'status-pill-navy' };
      case 'pending_review':
      case 'pending_verification':
      case 'pending':
        return { label: lang === 'ar' ? 'معلق قيد التدقيق' : 'Pending Audit', cssClass: 'status-pill-amber' };
      case 'rejected':
        return { label: lang === 'ar' ? 'مرفوض' : 'Rejected', cssClass: 'status-pill-slate' };
      default:
        return { label: status || '—', cssClass: 'status-pill-slate' };
    }
  }

  function getRefundStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'completed':
      case 'processed':
        return { label: lang === 'ar' ? 'تم الصرف بنجاح' : 'Disbursed', cssClass: 'status-pill-navy' };
      case 'approved':
        return { label: lang === 'ar' ? 'معتمد للصرف' : 'Approved for Payout', cssClass: 'status-pill-blue' };
      case 'under_review':
      case 'pending':
        return { label: lang === 'ar' ? 'قيد المراجعة والتدقيق' : 'Under Review', cssClass: 'status-pill-amber' };
      case 'rejected':
        return { label: lang === 'ar' ? 'مرفوض' : 'Rejected', cssClass: 'status-pill-slate' };
      default:
        return { label: status || '—', cssClass: 'status-pill-slate' };
    }
  }

  function getTravelerDocBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'complete':
        return { label: lang === 'ar' ? 'مكتملة البيانات والمستندات' : 'Complete', cssClass: 'status-pill-navy' };
      case 'missing_documents':
      case 'missing_docs':
        return { label: lang === 'ar' ? 'نقص مستندات (جواز/تأشيرة)' : 'Missing Documents', cssClass: 'status-pill-amber' };
      case 'incomplete':
      case 'incomplete_data':
        return { label: lang === 'ar' ? 'بيانات غير مكتملة' : 'Incomplete Data', cssClass: 'status-pill-slate' };
      default:
        return { label: status || '—', cssClass: 'status-pill-slate' };
    }
  }

  // --- Initialize & Bind Booking ---
  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id') || 'BK-2026-1045';

    loadBooking(bookingId);
    setupTabs();
    setupModals();
    setupInternalNotesForm();
    setupPaymentsToolbar();

    // Listen for language change events
    window.addEventListener('accounts-lang-changed', function () {
      if (currentBooking) {
        renderAll();
      }
    });
  }

  function loadBooking(bookingId) {
    if (!window.AccountsMockData || typeof window.AccountsMockData.getBookingDetails !== 'function') {
      console.warn('AccountsMockData not ready yet.');
      return;
    }

    currentBooking = window.AccountsMockData.getBookingDetails(bookingId);

    const container = document.getElementById('booking-details-container');
    const notFoundCard = document.getElementById('booking-not-found-card');

    if (!currentBooking) {
      if (container) container.style.display = 'none';
      if (notFoundCard) notFoundCard.style.display = 'block';
      return;
    }

    if (notFoundCard) notFoundCard.style.display = 'none';
    if (container) container.style.display = 'block';

    renderAll();
  }

  function renderAll() {
    if (!currentBooking) return;
    renderHeroHeader();
    renderTabBadges();
    renderOverviewTab();
    renderTravelersTab();
    renderPaymentsTab();
    renderRefundsTab();
    renderActivityTab();
  }

  // --- Render Persistent Header (Hero) ---
  function renderHeroHeader() {
    const b = currentBooking;
    const lang = getLang();
    const isEn = lang === 'en';
    const bStatus = getBookingStatusBadge(b.booking_status);
    const pStatus = getPaymentStatusBadge(b.payment_status);

    const elId = document.getElementById('bhero-id');
    if (elId) elId.textContent = b.id;

    const elBStatus = document.getElementById('bhero-booking-status');
    if (elBStatus) {
      elBStatus.textContent = bStatus.label;
      elBStatus.className = `acc-status-pill ${bStatus.cssClass}`;
    }

    const elPStatus = document.getElementById('bhero-payment-status');
    if (elPStatus) {
      elPStatus.textContent = pStatus.label;
      elPStatus.className = `acc-status-pill ${pStatus.cssClass}`;
    }

    const elDate = document.getElementById('bhero-created-date');
    if (elDate) elDate.textContent = b.created_date || b.created_at;

    const elActivityBtn = document.getElementById('bhero-btn-activity-log');
    if (elActivityBtn) elActivityBtn.href = `accounts-booking-activity.html?id=${encodeURIComponent(b.id)}`;

    const custId = b.customerId || b.customer_id || 'CUST-1001';
    const elCustLink = document.getElementById('bhero-customer-link');
    if (elCustLink) elCustLink.href = `accounts-customer-details.html?id=${encodeURIComponent(custId)}`;

    const custName = (isEn ? b.customer_name_en : b.customer_name_ar) || b.customer_name_ar || b.customer_name || '—';
    const elCustName = document.getElementById('bhero-customer-name');
    if (elCustName) elCustName.textContent = custName;

    const elCustPhone = document.getElementById('bhero-customer-phone');
    if (elCustPhone) elCustPhone.textContent = b.customer_phone || '';

    const elCustWa = document.getElementById('bhero-customer-wa');
    if (elCustWa) {
      const cleanPhone = (b.customer_whatsapp || b.customer_phone || '').replace(/\D/g, '');
      elCustWa.href = `https://wa.me/2${cleanPhone}`;
      elCustWa.textContent = isEn ? 'WhatsApp' : 'واتساب';
      elCustWa.setAttribute('aria-label', isEn ? 'Chat via WhatsApp' : 'مراسلة واتساب');
    }

    const compName = (isEn ? b.company_en : b.company_ar) || b.company_ar || b.company_name || '—';
    const elCompName = document.getElementById('bhero-company-name');
    if (elCompName) elCompName.textContent = compName;

    const elCompRef = document.getElementById('bhero-company-ref');
    if (elCompRef) elCompRef.textContent = b.company_booking_ref || '—';

    const elTotal = document.getElementById('bhero-total-price');
    if (elTotal) elTotal.textContent = formatCurr(b.total_price);

    const elPaid = document.getElementById('bhero-paid-amount');
    if (elPaid) elPaid.textContent = formatCurr(b.paid_amount);

    const elBal = document.getElementById('bhero-remaining-balance');
    if (elBal) elBal.textContent = formatCurr(b.remaining_balance);

    const secHeader = document.getElementById('sec-booking-header');
    if (secHeader) {
      secHeader.setAttribute('aria-label', isEn ? 'Persistent Booking Summary' : 'الملخص الثابت للحجز');
    }

    const navTabs = document.querySelector('.acc-tabs-nav-bar');
    if (navTabs) {
      navTabs.setAttribute('aria-label', isEn ? 'Booking Details Sections' : 'أقسام تفاصيل الحجز');
    }
  }

  function renderTabBadges() {
    const b = currentBooking;
    const travelersCount = b.travelers ? b.travelers.length : 0;
    const paymentsCount = b.payments ? b.payments.length : 0;
    const refundsCount = (b.refunds || b.refund_requests || []).length;

    const elTrv = document.getElementById('tab-count-travelers');
    if (elTrv) elTrv.textContent = formatNum(travelersCount);

    const elPay = document.getElementById('tab-count-payments');
    if (elPay) elPay.textContent = formatNum(paymentsCount);

    const elRef = document.getElementById('tab-count-refunds');
    if (elRef) elRef.textContent = formatNum(refundsCount);
  }

  // --- Tabs Switching Logic (Phase 5: Collapsible, Mutually Exclusive, All Hidden On Load) ---
  function setupTabs() {
    const tabButtons = document.querySelectorAll('.acc-tabs-list .acc-tab-btn');
    const tabPanels = document.querySelectorAll('.acc-tab-panel');

    // Initial state: NO tab active, ALL 5 panels hidden
    tabButtons.forEach(btn => {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-selected', 'false');
      btn.addEventListener('click', function () {
        const targetPanelId = this.getAttribute('aria-controls');
        const tabKey = this.id.replace('tab-btn-', '');
        switchTab(tabKey, targetPanelId);
      });
    });

    tabPanels.forEach(panel => {
      panel.classList.remove('is-active');
      panel.style.display = 'none';
    });
  }

  function switchTab(tabKey, targetPanelId) {
    const tabButtons = document.querySelectorAll('.acc-tabs-list .acc-tab-btn');
    const tabPanels = document.querySelectorAll('.acc-tab-panel');

    // If currently active tab is clicked again, collapse it so all panels become hidden
    if (activeTab === tabKey) {
      activeTab = null;
      tabButtons.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => {
        panel.classList.remove('is-active');
        panel.style.display = 'none';
      });
      return;
    }

    // Otherwise, activate this tab and hide others
    activeTab = tabKey;
    tabButtons.forEach(btn => {
      const isSelected = btn.getAttribute('aria-controls') === targetPanelId;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    tabPanels.forEach(panel => {
      const isTarget = panel.id === targetPanelId;
      panel.classList.toggle('is-active', isTarget);
      panel.style.display = isTarget ? 'block' : 'none';
    });
  }

  // --- Tab 1: Overview Renderer ---
  function renderOverviewTab() {
    const b = currentBooking;
    const lang = getLang();

    // Section 1: Booking Info
    const elOvId = document.getElementById('ov-b-id');
    if (elOvId) elOvId.textContent = b.id;

    const elOvCreated = document.getElementById('ov-b-created');
    if (elOvCreated) elOvCreated.textContent = b.created_date || b.created_at;

    const elOvStatus = document.getElementById('ov-b-status');
    if (elOvStatus) {
      const badge = getBookingStatusBadge(b.booking_status);
      elOvStatus.textContent = badge.label;
      elOvStatus.className = `acc-status-pill ${badge.cssClass}`;
    }

    const elOvTravelDate = document.getElementById('ov-b-travel-date');
    if (elOvTravelDate) elOvTravelDate.textContent = b.travel_date;

    const elOvProgType = document.getElementById('ov-b-program-type');
    if (elOvProgType) elOvProgType.textContent = (lang === 'en' ? b.program_en : b.program_ar) || b.program_type_ar || b.program_ar || b.program_type;

    const elOvSeason = document.getElementById('ov-b-season');
    if (elOvSeason) elOvSeason.textContent = (lang === 'en' ? b.season_en : b.season_ar) || b.season_ar || b.season;

    // Section 2: Customer Info
    const custId = b.customerId || b.customer_id || 'CUST-1001';
    const elOvCustLink = document.getElementById('ov-cust-profile-link');
    if (elOvCustLink) elOvCustLink.href = `accounts-customer-details.html?id=${encodeURIComponent(custId)}`;

    const custName = (lang === 'en' ? b.customer_name_en : b.customer_name_ar) || b.customer_name_ar || b.customer_name || '—';
    const elOvCustName = document.getElementById('ov-cust-name');
    if (elOvCustName) elOvCustName.textContent = custName;

    const elOvCustPhone = document.getElementById('ov-cust-phone');
    if (elOvCustPhone) {
      elOvCustPhone.textContent = b.customer_phone || '';
      elOvCustPhone.href = `tel:${b.customer_phone || ''}`;
    }

    const elOvCustWa = document.getElementById('ov-cust-wa');
    if (elOvCustWa) {
      const cleanPhone = (b.customer_whatsapp || b.customer_phone || '').replace(/\D/g, '');
      elOvCustWa.href = `https://wa.me/2${cleanPhone}`;
      elOvCustWa.textContent = lang === 'ar' ? `${cleanPhone} (فتح المحادثة)` : `${cleanPhone} (Open Chat)`;
    }

    const elOvCustGov = document.getElementById('ov-cust-gov');
    if (elOvCustGov) elOvCustGov.textContent = (lang === 'en' ? b.customer_governorate_en : b.customer_governorate_ar) || b.customer_governorate_ar || b.governorate || 'الجيزة';

    // Section 3: Company Info
    const compName = (lang === 'en' ? b.company_en : b.company_ar) || b.company_ar || b.company_name || '—';
    const elOvCompName = document.getElementById('ov-comp-name');
    if (elOvCompName) elOvCompName.textContent = compName;

    const elOvCompContact = document.getElementById('ov-comp-contact');
    if (elOvCompContact) elOvCompContact.textContent = b.company_contact || (b.company_phone ? `${b.company_phone} — ${b.company_email || ''}` : 'operations@alhuda-travel.com');

    const elOvCompLicense = document.getElementById('ov-comp-license');
    if (elOvCompLicense) elOvCompLicense.textContent = (lang === 'en' ? b.company_license_en : b.company_license) || b.company_license || 'ترخيص سياحي فئة (أ)';

    const elOvCompRef = document.getElementById('ov-comp-ref');
    if (elOvCompRef) elOvCompRef.textContent = b.company_booking_ref || '—';

    // Section 4: Financial Overview & Progress Bar
    const elFinTotal = document.getElementById('ov-fin-total');
    if (elFinTotal) elFinTotal.textContent = formatCurr(b.total_price);

    const elFinPaid = document.getElementById('ov-fin-paid');
    if (elFinPaid) elFinPaid.textContent = formatCurr(b.paid_amount);

    const elFinPending = document.getElementById('ov-fin-pending');
    if (elFinPending) elFinPending.textContent = formatCurr(b.pending_amount || b.pending_review_amount || 0);

    const elFinBalance = document.getElementById('ov-fin-balance');
    if (elFinBalance) elFinBalance.textContent = formatCurr(b.remaining_balance);

    const pct = b.total_price > 0 ? Math.min(100, Math.round((b.paid_amount / b.total_price) * 100)) : 0;
    const elProgressPct = document.getElementById('ov-progress-pct');
    if (elProgressPct) elProgressPct.textContent = `${pct}%`;

    const elProgressBar = document.getElementById('ov-progress-bar');
    if (elProgressBar) elProgressBar.setAttribute('aria-valuenow', pct);

    const elProgressFill = document.getElementById('ov-progress-fill');
    if (elProgressFill) elProgressFill.style.width = `${pct}%`;

    // Section 5: Travelers Preview
    const travelers = b.travelers || [];
    const elTrvCount = document.getElementById('ov-travelers-count');
    if (elTrvCount) {
      elTrvCount.textContent = lang === 'ar' ? `عدد المعتمرين: ${travelers.length}` : `Travelers count: ${travelers.length}`;
    }

    const elNamesList = document.getElementById('ov-travelers-names-list');
    if (elNamesList) {
      if (travelers.length === 0) {
        elNamesList.innerHTML = `<li class="acc-name-preview-empty">${lang === 'ar' ? 'لا يوجد مسافرون مسجلون بعد' : 'No travelers registered yet'}</li>`;
      } else {
        elNamesList.innerHTML = travelers.map((t, idx) => `
          <li class="acc-name-preview-item">
            <span class="acc-name-badge-idx tabular-nums">${idx + 1}</span>
            <div class="acc-name-info">
              <strong class="acc-name-title">${escapeHtml(lang === 'en' ? (t.name_en || t.name) : (t.name_ar || t.name))}</strong>
              <span class="acc-name-sub">${escapeHtml(lang === 'en' ? (t.relationship_en || 'Companion') : (t.relationship_ar || t.relationship || 'مرافق'))}</span>
            </div>
          </li>
        `).join('');
      }
    }

    // Section 6: Notes
    renderBookingNotes();

    // Section 7: Status History
    renderStatusHistory();
  }

  function renderBookingNotes() {
    const b = currentBooking;
    const lang = getLang();
    const isEn = lang === 'en';

    // Company Notes
    const elCompNotes = document.getElementById('ov-company-notes-list');
    if (elCompNotes) {
      const notes = b.company_notes || [];
      if (notes.length === 0) {
        elCompNotes.innerHTML = `<div class="acc-note-empty">${isEn ? 'No company notes recorded' : 'لا توجد ملاحظات مسجلة من شركة السياحة'}</div>`;
      } else {
        elCompNotes.innerHTML = notes.map(n => {
          let author = n.author || b.company_ar || b.company_name;
          if (isEn) {
            author = n.author_en || 'Operations Management — Al-Huda Travel';
          }
          let text = n.text_ar || n.text;
          if (isEn) {
            text = n.text_en || 'Flight seats confirmed round-trip from Cairo to Jeddah on Saudia Airlines.';
          }
          return `
            <div class="acc-note-card">
              <div class="acc-note-meta">
                <span class="acc-note-author">${escapeHtml(author)}</span>
                <span class="acc-note-date tabular-nums">${escapeHtml(n.date)}</span>
              </div>
              <p class="acc-note-text">${escapeHtml(text)}</p>
            </div>
          `;
        }).join('');
      }
    }

    // Miqat Internal Notes (Immutable)
    const elInternalNotes = document.getElementById('ov-internal-notes-list');
    if (elInternalNotes) {
      const notes = b.internal_notes || [];
      if (notes.length === 0) {
        elInternalNotes.innerHTML = `<div class="acc-note-empty">${isEn ? 'No internal notes recorded yet' : 'لا توجد ملاحظات داخلية خاصة بعد'}</div>`;
      } else {
        elInternalNotes.innerHTML = notes.map(n => {
          let author = n.author_name || n.author || 'أحمد صبري';
          if (isEn) {
            author = n.author_en || 'Ahmed Sabry';
          }
          let text = n.text;
          if (isEn) {
            text = n.text_en || 'Bank transfer notice and InstaPay slip verified and reconciled with central account statement; account fully settled.';
          }
          return `
            <div class="acc-note-card is-private">
              <div class="acc-note-meta">
                <span class="acc-note-author">${escapeHtml(author)}</span>
                <span class="acc-note-date tabular-nums">${escapeHtml(n.date)}</span>
              </div>
              <p class="acc-note-text">${escapeHtml(text)}</p>
            </div>
          `;
        }).join('');
      }
    }
  }

  function setupInternalNotesForm() {
    const btnSubmit = document.getElementById('btn-submit-internal-note');
    const txtInput = document.getElementById('txt-new-internal-note');

    if (!btnSubmit || !txtInput) return;

    btnSubmit.addEventListener('click', function () {
      const text = txtInput.value.trim();
      if (!text) {
        txtInput.focus();
        return;
      }

      if (!currentBooking) return;

      const success = window.AccountsMockData.addBookingInternalNote(
        currentBooking.id,
        text,
        getLang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري'
      );

      if (success) {
        currentBooking = window.AccountsMockData.getBookingDetails(currentBooking.id);
        txtInput.value = '';
        renderBookingNotes();
        renderActivityTab();
      }
    });
  }

  function renderStatusHistory() {
    const b = currentBooking;
    const lang = getLang();
    const isEn = lang === 'en';
    const elStream = document.getElementById('ov-status-history-stream');
    if (!elStream) return;

    const history = b.status_history || [];
    if (history.length === 0) {
      elStream.innerHTML = `<div class="acc-stream-empty">${isEn ? 'No status history records' : 'لا توجد سجلات لحالات سابقة'}</div>`;
      return;
    }

    elStream.innerHTML = history.map(item => {
      let title = item.to_status_ar || item.status_label_ar || item.status || 'تغير حالة';
      if (isEn) {
        if (item.to_status_en) title = item.to_status_en;
        else if (title.includes('عربون') || title.includes('دفعة أولى')) title = 'Deposit Paid';
        else if (title.includes('مؤكد') || title.includes('مسدد')) title = 'Confirmed & Fully Paid';
        else if (title.includes('جديد')) title = 'New Booking Request';
        else title = 'Status Updated';
      }

      let details = item.details || item.description || item.note || '';
      if (isEn) {
        if (item.details_en) details = item.details_en;
        else if (details.includes('عربون') || details.includes('دفعة أولى')) details = 'Initial deposit recorded and verified.';
        else if (details.includes('تأكيد') || details.includes('تصفية')) details = 'Final payment reconciled; booking confirmed.';
        else details = 'Booking status transitioned successfully.';
      }

      let actor = item.actor || item.user || 'النظام المركزي';
      if (isEn) {
        if (item.actor_en) actor = item.actor_en;
        else if (actor.includes('سامح فؤاد')) actor = 'Sameh Fouad (Al-Huda Accountant)';
        else if (actor.includes('أحمد صبري')) actor = 'Ahmed Sabry (Miqat Accounts)';
        else actor = 'Central System';
      }

      return `
        <div class="acc-sh-item">
          <div class="acc-sh-dot"></div>
          <div class="acc-sh-content">
            <div class="acc-sh-header">
              <strong class="acc-sh-title">${escapeHtml(title)}</strong>
              <span class="acc-sh-date tabular-nums">${escapeHtml(item.date)}</span>
            </div>
            <p class="acc-sh-desc">${escapeHtml(details)}</p>
            <span class="acc-sh-user">${escapeHtml(actor)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Tab 2: Travelers Tab Renderer ---
  function renderTravelersTab() {
    const b = currentBooking;
    const lang = getLang();
    const isEn = lang === 'en';
    const tbody = document.getElementById('tbody-travelers');
    if (!tbody) return;

    const travelers = b.travelers || [];
    if (travelers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="acc-td-empty">${isEn ? 'No travelers registered in this booking' : 'لا يوجد معتمرون أو مسافرون مسجلون في هذا الحجز'}</td></tr>`;
      return;
    }

    tbody.innerHTML = travelers.map(t => {
      const docBadge = getTravelerDocBadge(t.completion_status || t.doc_status);
      const isMale = t.gender === 'male' || t.gender_ar === 'ذكر';
      return `
        <tr>
          <td class="acc-td-name">
            <strong>${escapeHtml(isEn ? (t.name_en || t.name) : (t.name_ar || t.name))}</strong>
            <span class="acc-td-sub tabular-nums">${escapeHtml(t.passport_no || (isEn ? 'Passport not entered' : 'لم يتم إدخال الجواز'))}</span>
          </td>
          <td>${isEn ? (t.gender_en || (isMale ? 'Male' : 'Female')) : (t.gender_ar || (isMale ? 'ذكر' : 'أنثى'))}</td>
          <td>${escapeHtml(isEn ? (t.nationality_en || 'Egyptian') : (t.nationality_ar || t.nationality || 'مصري'))}</td>
          <td>${escapeHtml(isEn ? (t.relationship_en || 'Companion') : (t.relationship_ar || t.relationship || 'مرافق'))}</td>
          <td>
            <span class="acc-status-pill ${docBadge.cssClass}">${docBadge.label}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Tab 3: Payments Tab Renderer ---
  function renderPaymentsTab() {
    const b = currentBooking;
    if (!b) return;

    const payments = b.payments || [];
    const recordedTotal = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const approvedTotal = payments
      .filter(p => (p.verification_status || p.audit_status) === 'approved')
      .reduce((acc, p) => acc + (p.amount || 0), 0);
    const pendingTotal = payments
      .filter(p => {
        const s = p.verification_status || p.audit_status;
        return s === 'pending_verification' || s === 'pending_review' || s === 'pending';
      })
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    // Summary header cards
    const elTot = document.getElementById('pay-sum-total');
    if (elTot) elTot.textContent = formatCurr(b.total_price);

    const elRec = document.getElementById('pay-sum-recorded');
    if (elRec) elRec.textContent = formatCurr(recordedTotal);

    const elApp = document.getElementById('pay-sum-approved');
    if (elApp) elApp.textContent = formatCurr(approvedTotal);

    const elPen = document.getElementById('pay-sum-pending');
    if (elPen) elPen.textContent = formatCurr(pendingTotal);

    const elBal = document.getElementById('pay-sum-balance');
    if (elBal) elBal.textContent = formatCurr(b.remaining_balance);

    // Render transactions table
    renderPaymentsTable();

    // Render financial audit trail
    renderPaymentsAuditTrail();
  }

  function renderPaymentsTable() {
    const b = currentBooking;
    const lang = getLang();
    const isEn = lang === 'en';
    const tbody = document.getElementById('tbody-payments');
    if (!tbody || !b) return;

    let payments = b.payments || [];

    // Filter payments based on active filter chip
    if (activePaymentFilter === 'pending') {
      payments = payments.filter(p => {
        const s = p.verification_status || p.audit_status;
        return s === 'pending_verification' || s === 'pending_review' || s === 'pending';
      });
    } else if (activePaymentFilter === 'approved') {
      payments = payments.filter(p => (p.verification_status || p.audit_status) === 'approved');
    } else if (activePaymentFilter === 'notes') {
      payments = payments.filter(p => {
        const d = p.discussion || p.internal_comments || [];
        return d.length > 0;
      });
    }

    if (payments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="acc-td-empty">${isEn ? 'No payments matching the current filter criteria' : 'لا توجد دفعات أو تحصيلات مطابقة لمعايير التصفية الحالية'}</td></tr>`;
      return;
    }

    tbody.innerHTML = payments.map(tx => {
      const statusKey = tx.verification_status || tx.audit_status || 'approved';
      const auditBadge = getTxAuditStatusBadge(statusKey);
      const comments = tx.discussion || tx.internal_comments || [];
      const commentsCount = comments.length;
      const hasEvidence = !!tx.evidence || !!tx.evidence_url || !!tx.evidence_ref || !!tx.receipt_ref;
      const isPending = statusKey === 'pending_verification' || statusKey === 'pending_review' || statusKey === 'pending';

      const methodText = isEn 
        ? (tx.payment_method_en || (tx.payment_method_ar === 'تحويل بنكي' ? 'Bank Transfer' : tx.payment_method_ar === 'بطاقة بنكية' ? 'Credit/Debit Card' : 'Cash'))
        : (tx.payment_method_ar || tx.method_ar || tx.payment_method);

      const typeText = isEn
        ? (tx.transaction_type_en || (tx.transaction_type_ar === 'دفعة حجز' ? 'Booking Payment' : tx.transaction_type_ar === 'عربون' ? 'Deposit' : 'Collection Payment'))
        : (tx.transaction_type_ar || tx.type_ar || tx.type || 'دفعة تحصيل');

      const sourceText = isEn
        ? (tx.transaction_source_en || (tx.transaction_source_ar === 'العميل مباشرة' ? 'Direct from Customer' : 'Partner Agency'))
        : (tx.transaction_source_ar || tx.source_ar || tx.source || 'العميل مباشرة');

      const receivedByText = isEn
        ? (tx.received_by_en || 'Miqat Bank Account')
        : (tx.received_by || 'حساب ميقات البنكي');

      return `
        <tr data-tx-id="${escapeHtml(tx.id)}">
          <td>
            <strong class="tabular-nums">${escapeHtml(tx.id)}</strong>
          </td>
          <td class="tabular-nums">${escapeHtml(tx.date)}</td>
          <td class="tabular-nums">
            <strong class="acc-curr-amt">${formatCurr(tx.amount)}</strong>
          </td>
          <td>${escapeHtml(methodText)}</td>
          <td>${escapeHtml(typeText)}</td>
          <td>${escapeHtml(sourceText)}</td>
          <td>
            <span class="acc-status-pill ${auditBadge.cssClass}">${auditBadge.label}</span>
          </td>
          <td class="tabular-nums">${formatCurr(tx.balance_after)}</td>
          <td>${escapeHtml(receivedByText)}</td>
          <td class="acc-td-actions">
            <div class="acc-actions-wrap">
              ${hasEvidence ? `
                <button type="button" class="acc-btn acc-btn-xs acc-btn-secondary btn-action-evidence" data-tx-id="${escapeHtml(tx.id)}" title="${isEn ? 'Preview Slip' : 'معاينة المستند'}">
                  ${isEn ? 'View Slip' : 'معاينة الإشعار'}
                </button>
              ` : ''}

              ${isPending ? `
                <button type="button" class="acc-btn acc-btn-xs acc-btn-primary btn-action-review" data-tx-id="${escapeHtml(tx.id)}" title="${isEn ? 'Review & Approve Collection' : 'تدقيق واعتماد التحصيل'}">
                  ${isEn ? 'Review & Approve' : 'تدقيق واعتماد'}
                </button>
              ` : ''}

              <button type="button" class="acc-btn acc-btn-xs acc-btn-secondary btn-action-discussion" data-tx-id="${escapeHtml(tx.id)}" title="${isEn ? 'Internal Discussion' : 'المناقشة الداخلية'}">
                <span>${isEn ? `Discussion (${commentsCount})` : `المناقشة (${commentsCount})`}</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    bindPaymentTableActions();
  }

  function bindPaymentTableActions() {
    // Evidence preview buttons
    const evidenceBtns = document.querySelectorAll('.btn-action-evidence');
    evidenceBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const txId = this.getAttribute('data-tx-id');
        openEvidenceModal(txId);
      });
    });

    // Review & approve buttons
    const reviewBtns = document.querySelectorAll('.btn-action-review');
    reviewBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const txId = this.getAttribute('data-tx-id');
        openReviewModal(txId);
      });
    });

    // Discussion thread buttons
    const discBtns = document.querySelectorAll('.btn-action-discussion');
    discBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const txId = this.getAttribute('data-tx-id');
        openDiscussionModal(txId);
      });
    });
  }

  function renderPaymentsAuditTrail() {
    const b = currentBooking;
    const lang = getLang();
    const isEn = lang === 'en';
    const elTrail = document.getElementById('payments-audit-trail-stream');
    if (!elTrail || !b) return;

    let trail = b.payments_audit_trail || [];
    if (trail.length === 0 && b.payments) {
      trail = b.payments.flatMap(p => p.audit_trail || []);
    }

    if (trail.length === 0) {
      elTrail.innerHTML = `<div class="acc-stream-empty">${isEn ? 'No financial audit trail records registered yet' : 'لا توجد حركات تدقيق مسجلة حتى الآن'}</div>`;
      return;
    }

    elTrail.innerHTML = trail.map(item => {
      let actionText = item.action;
      if (isEn) {
        if (item.action_en) actionText = item.action_en;
        else if (actionText.includes('دفعة أولى')) actionText = 'Initial Deposit Collection Recorded';
        else if (actionText.includes('اعتماد ومطابقة')) actionText = 'Collection Approved & Reconciled';
        else if (actionText.includes('إنستاباي')) actionText = 'Electronic Payment Recorded via InstaPay';
        else if (actionText.includes('تصفية الرصيد')) actionText = 'Balance Fully Cleared & Reconciled';
        else actionText = 'Financial Audit Event';
      }

      let detailsText = item.details;
      if (isEn) {
        if (item.details_en) detailsText = item.details_en;
        else if (detailsText.includes('دفعة بقيمة ٣٨,٠٠٠')) detailsText = 'Payment of 38,000 EGP recorded via bank transfer';
        else if (detailsText.includes('تغيير الحالة إلى معتمد')) detailsText = 'Status changed to Approved & Reconciled; remaining balance reduced to 38,000 EGP';
        else if (detailsText.includes('سداد نهائي بقيمة ٣٨,٠٠٠')) detailsText = 'Final payment transaction of 38,000 EGP';
        else if (detailsText.includes('الحساب أصبح مسدداً بالكامل')) detailsText = 'Account fully settled; remaining balance is 0 EGP';
        else detailsText = 'Audit details recorded.';
      }

      let actorText = item.actor || item.performed_by || 'موظف الحسابات';
      if (isEn) {
        if (item.actor_en) actorText = item.actor_en;
        else if (actorText.includes('سامح فؤاد')) actorText = 'Sameh Fouad';
        else if (actorText.includes('أحمد صبري')) actorText = 'Ahmed Sabry';
        else if (actorText.includes('بوابة ميقات')) actorText = 'Miqat Electronic Gateway';
        else actorText = 'Accounts Officer';
      }

      return `
        <div class="acc-audit-entry">
          <div class="acc-audit-dot"></div>
          <div class="acc-audit-content">
            <div class="acc-audit-top">
              <strong class="acc-audit-action">${escapeHtml(actionText)}</strong>
              <span class="acc-audit-date tabular-nums">${escapeHtml(item.date)}</span>
            </div>
            <p class="acc-audit-desc">${escapeHtml(detailsText)}</p>
            <span class="acc-audit-actor">${escapeHtml(actorText)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function setupPaymentsToolbar() {
    // Payment filter chips
    const filterChips = document.querySelectorAll('.acc-pay-filter-chips .acc-chip-btn');
    filterChips.forEach(chip => {
      chip.addEventListener('click', function () {
        filterChips.forEach(c => c.classList.remove('is-active'));
        this.classList.add('is-active');
        activePaymentFilter = this.getAttribute('data-pay-filter');
        renderPaymentsTable();
      });
    });

    // CSV / Excel export
    const btnExport = document.getElementById('btn-export-payments-csv');
    if (btnExport) {
      btnExport.addEventListener('click', exportPaymentsToCSV);
    }
  }

  function exportPaymentsToCSV() {
    if (!currentBooking || !currentBooking.payments) return;

    const b = currentBooking;
    const payments = b.payments;

    const headers = [
      'Transaction ID',
      'Date & Time',
      'Amount (EGP)',
      'Payment Method',
      'Transaction Type',
      'Collection Source',
      'Audit Status',
      'Balance After',
      'Received By'
    ];

    const rows = payments.map(tx => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${tx.amount}"`,
      `"${tx.payment_method_ar || tx.method_ar || tx.payment_method}"`,
      `"${tx.transaction_type_ar || tx.type_ar || tx.type || ''}"`,
      `"${tx.transaction_source_ar || tx.source_ar || tx.source || ''}"`,
      `"${tx.verification_status || tx.audit_status || 'approved'}"`,
      `"${tx.balance_after}"`,
      `"${tx.received_by || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${b.id}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // --- Tab 4: Refunds Tab Renderer ---
  function renderRefundsTab() {
    const b = currentBooking;
    if (!b) return;
    const lang = getLang();
    const isEn = lang === 'en';

    const refunds = b.refunds || b.refund_requests || [];
    const requestedTotal = refunds.reduce((acc, r) => acc + (r.requested_amount || 0), 0);
    const approvedTotal = refunds.reduce((acc, r) => acc + (r.approved_amount || 0), 0);
    const disbursedTotal = refunds.reduce((acc, r) => acc + (r.disbursed_amount || 0), 0);
    const pendingCount = refunds.filter(r => (r.status || r.refund_status) === 'under_review' || (r.status || r.refund_status) === 'pending').length;

    // Strict Financial Rule: Max refundable = approved paid amount - disbursed refunds
    const maxRefundable = Math.max(0, (b.paid_amount || 0) - disbursedTotal);

    const elLim = document.getElementById('ref-sum-limit');
    if (elLim) elLim.textContent = formatCurr(maxRefundable);

    const elReq = document.getElementById('ref-sum-requested');
    if (elReq) elReq.textContent = formatCurr(requestedTotal);

    const elApp = document.getElementById('ref-sum-approved');
    if (elApp) elApp.textContent = formatCurr(approvedTotal);

    const elDis = document.getElementById('ref-sum-disbursed');
    if (elDis) elDis.textContent = formatCurr(disbursedTotal);

    const elPen = document.getElementById('ref-sum-pending-count');
    if (elPen) elPen.textContent = formatNum(pendingCount);

    // Render refunds table
    const tbody = document.getElementById('tbody-refunds');
    if (!tbody) return;

    if (refunds.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="acc-td-empty">${isEn ? 'No refund requests recorded for this booking' : 'لا توجد أي طلبات استرداد مالي مسجلة على هذا الحجز'}</td></tr>`;
      return;
    }

    tbody.innerHTML = refunds.map(r => {
      const badge = getRefundStatusBadge(r.status || r.refund_status);
      const reqSource = isEn 
        ? (r.request_source_en || (r.request_source_ar === 'طلب العميل' ? 'Customer Request' : 'Partner Agency'))
        : (r.request_source_ar || r.source_ar || r.source || 'طلب العميل');
      const refType = isEn
        ? (r.refund_type_en || (r.refund_type_ar === 'استرداد مالي' ? 'Refund' : 'Trip Cancellation'))
        : (r.refund_type_ar || r.type_ar || r.type || 'استرداد مالي');

      return `
        <tr data-ref-id="${escapeHtml(r.id)}">
          <td><strong class="tabular-nums">${escapeHtml(r.id)}</strong></td>
          <td class="tabular-nums">${escapeHtml(r.request_date || r.date)}</td>
          <td>${escapeHtml(reqSource)}</td>
          <td>${escapeHtml(refType)}</td>
          <td class="tabular-nums">${formatCurr(r.requested_amount)}</td>
          <td class="tabular-nums">${formatCurr(r.approved_amount)}</td>
          <td class="tabular-nums"><strong>${formatCurr(r.disbursed_amount)}</strong></td>
          <td><span class="acc-status-pill ${badge.cssClass}">${badge.label}</span></td>
          <td class="tabular-nums">${escapeHtml(r.updated_at || r.request_date || r.date)}</td>
          <td class="acc-td-actions">
            <button type="button" class="acc-btn acc-btn-xs acc-btn-secondary btn-action-view-refund" data-ref-id="${escapeHtml(r.id)}">
              ${isEn ? 'View Details' : 'عرض التفاصيل'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind refund view buttons
    const viewBtns = document.querySelectorAll('.btn-action-view-refund');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const refId = this.getAttribute('data-ref-id');
        openRefundModal(refId);
      });
    });

    // Navigation button to central refund management
    const btnNavRefundMgmt = document.getElementById('btn-nav-refund-mgmt');
    if (btnNavRefundMgmt) {
      btnNavRefundMgmt.addEventListener('click', function () {
        window.location.href = 'accounts-bookings.html?filter=refunds';
      });
    }
  }

  // --- Tab 5: Activity Log Preview Tab Renderer ---
  function renderActivityTab() {
    const b = currentBooking;
    if (!b) return;
    const lang = getLang();
    const isEn = lang === 'en';

    const timeline = document.getElementById('recent-activities-timeline');
    if (!timeline) return;

    const activities = (b.activities || b.activity_log || []).slice(0, 10);

    if (activities.length === 0) {
      timeline.innerHTML = `<div class="acc-stream-empty">${isEn ? 'No activities recorded for this booking yet' : 'لا توجد أنشطة مسجلة لهذا الحجز بعد'}</div>`;
    } else {
      timeline.innerHTML = activities.map(act => {
        const titleText = isEn ? (act.title_en || act.title) : (act.title_ar || act.title);
        const descText = isEn ? (act.desc_en || act.description || act.desc) : (act.desc_ar || act.description || '');
        const actorText = isEn ? (act.actor_en || (act.actor === 'أحمد صبري' ? 'Ahmed Sabry' : act.actor) || 'Central System') : (act.actor_ar || act.actor || 'النظام المركزي');

        return `
          <div class="acc-timeline-item">
            <div class="acc-timeline-marker"></div>
            <div class="acc-timeline-content">
              <div class="acc-timeline-header">
                <strong class="acc-timeline-title">${escapeHtml(titleText)}</strong>
                <span class="acc-timeline-date tabular-nums">${escapeHtml(act.date || act.timestamp)}</span>
              </div>
              <p class="acc-timeline-desc">${escapeHtml(descText)}</p>
              <span class="acc-timeline-author">${escapeHtml(actorText)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Bind full log links
    const targetUrl = `accounts-booking-activity.html?id=${encodeURIComponent(b.id)}`;
    const fullLogBtn1 = document.getElementById('btn-full-activity-link');
    if (fullLogBtn1) fullLogBtn1.href = targetUrl;

    const fullLogBtn2 = document.getElementById('btn-full-log-banner-action');
    if (fullLogBtn2) fullLogBtn2.href = targetUrl;
  }

  // --- Modal Helpers & Setup ---
  function setupModals() {
    // Evidence Modal close buttons
    const btnCloseEv1 = document.getElementById('btn-close-evidence-modal');
    const btnCloseEv2 = document.getElementById('btn-evidence-close');
    const modalEv = document.getElementById('modal-payment-evidence');
    [btnCloseEv1, btnCloseEv2].forEach(b => {
      if (b) b.addEventListener('click', () => closeModal(modalEv));
    });

    // Download mock evidence button
    const btnDownloadEv = document.getElementById('btn-evidence-download');
    if (btnDownloadEv) {
      btnDownloadEv.addEventListener('click', function () {
        alert(getLang() === 'ar' ? 'تم بدء تحميل المستند البنكي بنجاح.' : 'Bank document download initiated.');
      });
    }

    // Review Modal close buttons & actions
    const btnCloseRev = document.getElementById('btn-close-review-modal');
    const modalRev = document.getElementById('modal-payment-review');
    if (btnCloseRev) btnCloseRev.addEventListener('click', () => closeModal(modalRev));

    const btnConfirmApprove = document.getElementById('btn-review-confirm-approve');
    if (btnConfirmApprove) {
      btnConfirmApprove.addEventListener('click', handleConfirmApprovePayment);
    }

    const btnReviewAddComment = document.getElementById('btn-review-add-comment');
    if (btnReviewAddComment) {
      btnReviewAddComment.addEventListener('click', function () {
        if (activeSelectedTx) {
          closeModal(modalRev);
          openDiscussionModal(activeSelectedTx.id);
        }
      });
    }

    // Discussion Modal close buttons & message submit
    const btnCloseDisc = document.getElementById('btn-close-disc-modal');
    const modalDisc = document.getElementById('modal-payment-discussion');
    if (btnCloseDisc) btnCloseDisc.addEventListener('click', () => closeModal(modalDisc));

    const btnSendMsg = document.getElementById('btn-send-disc-msg');
    const txtMsg = document.getElementById('txt-disc-new-msg');
    if (btnSendMsg && txtMsg) {
      btnSendMsg.addEventListener('click', function () {
        const text = txtMsg.value.trim();
        if (!text || !activeSelectedTx || !currentBooking) return;

        window.AccountsMockData.addPaymentInternalComment(
          currentBooking.id,
          activeSelectedTx.id,
          getLang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري',
          text
        );

        txtMsg.value = '';
        currentBooking = window.AccountsMockData.getBookingDetails(currentBooking.id);
        activeSelectedTx = (currentBooking.payments || []).find(p => p.id === activeSelectedTx.id);
        renderDiscussionMessages();
        renderPaymentsTable();
      });
    }

    // Refund Modal close
    const btnCloseRef1 = document.getElementById('btn-close-refund-modal');
    const btnCloseRef2 = document.getElementById('btn-refund-modal-close');
    const modalRef = document.getElementById('modal-refund-details');
    [btnCloseRef1, btnCloseRef2].forEach(b => {
      if (b) b.addEventListener('click', () => closeModal(modalRef));
    });

    // Close on backdrop click & ESC key
    document.querySelectorAll('.acc-modal-backdrop').forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) closeModal(this);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.acc-modal-backdrop').forEach(modal => {
          if (modal.style.display !== 'none' && modal.id !== 'acc-logout-modal') {
            closeModal(modal);
          }
        });
      }
    });
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = 'flex';
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = 'none';
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // --- Modal 1: Open Evidence Preview ---
  function openEvidenceModal(txId) {
    if (!currentBooking) return;
    const tx = (currentBooking.payments || []).find(p => p.id === txId);
    if (!tx) return;

    activeSelectedTx = tx;
    const lang = getLang();
    const isEn = lang === 'en';
    const modal = document.getElementById('modal-payment-evidence');
    const content = document.getElementById('modal-evidence-content');
    const fileName = tx.evidence ? tx.evidence.filename : (tx.evidence_file_name || `receipt_${tx.id}.pdf`);
    const bankRef = (tx.evidence && tx.evidence.bank_ref) ? tx.evidence.bank_ref : (tx.receipt_ref || tx.evidence_ref || 'TRX-99482103');
    const bankName = isEn 
      ? (tx.payment_method_en || 'Bank Transfer') 
      : (tx.payment_method_ar || tx.method_ar || 'تحويل بنكي');
    const depositor = isEn
      ? (tx.depositor_name_en || currentBooking.customer_name_en || currentBooking.customer_name || 'Ahmed Mohamed Ali')
      : (tx.depositor_name || currentBooking.customer_name_ar || currentBooking.customer_name);

    if (content) {
      content.innerHTML = `
        <div class="acc-evidence-preview-card">
          <div class="acc-evidence-mock-image">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span class="acc-evidence-file-name">${escapeHtml(fileName)}</span>
          </div>

          <div class="acc-kv-grid">
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Transaction ID:' : 'رقم المعاملة:'}</span>
              <strong class="acc-kv-val tabular-nums">${escapeHtml(tx.id)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Transfer Date:' : 'تاريخ التحويل:'}</span>
              <span class="acc-kv-val tabular-nums">${escapeHtml(tx.date)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Deposited Amount:' : 'المبلغ المودع:'}</span>
              <strong class="acc-kv-val tabular-nums">${formatCurr(tx.amount)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Payment Method / Bank:' : 'طريقة السداد / البنك:'}</span>
              <span class="acc-kv-val">${escapeHtml(bankName)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Bank Reference No.:' : 'رقم المرجع البنكي:'}</span>
              <span class="acc-code-pill tabular-nums">${escapeHtml(bankRef)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Registered Depositor:' : 'المودع المسجل:'}</span>
              <span class="acc-kv-val">${escapeHtml(depositor)}</span>
            </div>
          </div>
        </div>
      `;
    }

    openModal(modal);
  }

  // --- Modal 2: Open Review & Approve Dialog ---
  function openReviewModal(txId) {
    if (!currentBooking) return;
    const tx = (currentBooking.payments || []).find(p => p.id === txId);
    if (!tx) return;

    activeSelectedTx = tx;
    const lang = getLang();
    const isEn = lang === 'en';
    const modal = document.getElementById('modal-payment-review');
    const content = document.getElementById('modal-review-content');

    const methodText = isEn 
      ? (tx.payment_method_en || 'Bank Transfer') 
      : (tx.payment_method_ar || tx.method_ar || tx.payment_method);
    const receivedByText = isEn
      ? (tx.received_by_en || 'Miqat Bank Account')
      : (tx.received_by || 'حساب ميقات البنكي');

    if (content) {
      content.innerHTML = `
        <div class="acc-review-modal-box">
          
          <div class="acc-notice-card" role="note">
            <div class="acc-notice-icon-wrap" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="acc-notice-body">
              <strong class="acc-notice-title">${isEn ? 'Financial Collection Approval Notice' : 'تنبيه اعتماد التحصيل المالي'}</strong>
              <p class="acc-notice-text">
                ${isEn 
                  ? `Upon approving this transaction, the amount (${formatCurr(tx.amount)}) will be credited directly to the approved payments balance, reducing the remaining balance on the booking, and an official audit record will be logged under your name in the immutable financial audit trail.`
                  : `عند اعتماد المعاملة، سينتقل المبلغ (${formatCurr(tx.amount)}) مباشرة إلى رصيد السداد المعتمد، وسيتم خفض الرصيد المتبقي على الحجز، وتسجيل عملية اعتماد رسمية باسمك في سجل التدقيق المالي غير القابل للمسح.`}
              </p>
            </div>
          </div>

          <div class="acc-kv-grid">
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Payment ID:' : 'رقم الدفعة:'}</span>
              <strong class="acc-kv-val tabular-nums">${escapeHtml(tx.id)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Amount:' : 'المبلغ:'}</span>
              <strong class="acc-kv-val is-paid tabular-nums">${formatCurr(tx.amount)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Payment Method:' : 'طريقة السداد:'}</span>
              <span class="acc-kv-val">${escapeHtml(methodText)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Receiving Entity:' : 'الجهة المستلمة:'}</span>
              <span class="acc-kv-val">${escapeHtml(receivedByText)}</span>
            </div>
          </div>

          <div class="acc-review-checklist">
            <strong class="acc-checklist-title">${isEn ? 'Audit Criteria to Satisfy:' : 'معايير التدقيق الواجب استيفاؤها:'}</strong>
            <ul class="acc-checklist">
              <li>${isEn ? 'Matching transferred amount with actual Miqat bank statement.' : 'مطابقة القيمة المحولة مع كشف الحساب البنكي الفعلي لميقات.'}</li>
              <li>${isEn ? 'Verifying transfer date and bank reference validity.' : 'التحقق من صحة تاريخ التحويل ورقم المرجع البنكي.'}</li>
              <li>${isEn ? 'Legibility of payment slip and depositor details clarity.' : 'سلامة إشعار السداد ووضوح بيانات المودع.'}</li>
            </ul>
          </div>

        </div>
      `;
    }

    openModal(modal);
  }

  function handleConfirmApprovePayment() {
    if (!activeSelectedTx || !currentBooking) return;

    const modalRev = document.getElementById('modal-payment-review');
    const success = window.AccountsMockData.approveBookingPayment(
      currentBooking.id,
      activeSelectedTx.id,
      getLang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري'
    );

    if (success) {
      currentBooking = window.AccountsMockData.getBookingDetails(currentBooking.id);
      closeModal(modalRev);
      renderAll();
      alert(getLang() === 'ar' ? 'تم اعتماد المعاملة المالية وتحديث الرصيد بنجاح.' : 'Payment approved and balance updated successfully.');
    }
  }

  // --- Modal 3: Open Discussion Thread ---
  function openDiscussionModal(txId) {
    if (!currentBooking) return;
    const tx = (currentBooking.payments || []).find(p => p.id === txId);
    if (!tx) return;

    activeSelectedTx = tx;
    const modal = document.getElementById('modal-payment-discussion');
    renderDiscussionMessages();
    openModal(modal);
  }

  function renderDiscussionMessages() {
    const stream = document.getElementById('modal-disc-messages');
    if (!stream || !activeSelectedTx) return;
    const lang = getLang();
    const isEn = lang === 'en';

    const comments = activeSelectedTx.discussion || activeSelectedTx.internal_comments || [];
    if (comments.length === 0) {
      stream.innerHTML = `<div class="acc-stream-empty">${isEn ? 'No internal discussions recorded for this payment yet. You can post the first comment below.' : 'لا توجد مناقشات داخلية سابقة لهذه الدفعة. يمكنك كتابة أول تعليق أدناه.'}</div>`;
      return;
    }

    stream.innerHTML = comments.map(c => {
      const authorText = isEn
        ? (c.author_en || (c.author_name === 'أحمد صبري' || c.author === 'أحمد صبري' ? 'Ahmed Sabry' : c.author_name || c.author))
        : (c.author_name || c.author);
      const msgText = isEn ? (c.message_en || c.text_en || c.message || c.text) : (c.message || c.text);

      return `
        <div class="acc-disc-bubble">
          <div class="acc-disc-meta">
            <strong class="acc-disc-author">${escapeHtml(authorText)}</strong>
            <span class="acc-disc-date tabular-nums">${escapeHtml(c.date)}</span>
          </div>
          <p class="acc-disc-text">${escapeHtml(msgText)}</p>
        </div>
      `;
    }).join('');
  }

  // --- Modal 4: Open Refund Details ---
  function openRefundModal(refId) {
    if (!currentBooking) return;
    const refund = (currentBooking.refunds || currentBooking.refund_requests || []).find(r => r.id === refId);
    if (!refund) return;

    activeSelectedRefund = refund;
    const lang = getLang();
    const isEn = lang === 'en';
    const modal = document.getElementById('modal-refund-details');
    const content = document.getElementById('modal-refund-content');
    const badge = getRefundStatusBadge(refund.status || refund.refund_status);

    const reqSource = isEn 
      ? (refund.request_source_en || (refund.request_source_ar === 'طلب العميل' ? 'Customer Request' : 'Partner Agency'))
      : (refund.request_source_ar || refund.source_ar || refund.source || 'طلب العميل');
    const refType = isEn
      ? (refund.refund_type_en || (refund.refund_type_ar === 'استرداد مالي' ? 'Refund' : 'Trip Cancellation'))
      : (refund.refund_type_ar || refund.type_ar || refund.type || 'استرداد مالي');
    const reasonText = isEn
      ? (refund.reason_en || 'Booking cancellation in accordance with approved financial terms and conditions.')
      : (refund.reason_ar || refund.reason || 'إلغاء حجز وفقاً للشروط والأحكام المالية المعتمدة.');

    if (content) {
      content.innerHTML = `
        <div class="acc-refund-modal-box">
          <div class="acc-kv-grid">
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Refund Request ID:' : 'رقم طلب الاسترداد:'}</span>
              <strong class="acc-kv-val tabular-nums">${escapeHtml(refund.id)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Request Date:' : 'تاريخ الطلب:'}</span>
              <span class="acc-kv-val tabular-nums">${escapeHtml(refund.request_date || refund.date)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Request Source:' : 'مصدر الطلب:'}</span>
              <span class="acc-kv-val">${escapeHtml(reqSource)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Refund Type:' : 'نوع الاسترداد:'}</span>
              <span class="acc-kv-val">${escapeHtml(refType)}</span>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Requested Amount:' : 'المبلغ المطلوب:'}</span>
              <strong class="acc-kv-val tabular-nums">${formatCurr(refund.requested_amount)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Approved Amount:' : 'المبلغ المعتمد:'}</span>
              <strong class="acc-kv-val tabular-nums">${formatCurr(refund.approved_amount)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Actual Disbursed Amount:' : 'المبلغ المصروف فعلياً:'}</span>
              <strong class="acc-kv-val is-paid tabular-nums">${formatCurr(refund.disbursed_amount)}</strong>
            </div>
            <div class="acc-kv-item">
              <span class="acc-kv-label">${isEn ? 'Request Status:' : 'حالة الطلب:'}</span>
              <span class="acc-status-pill ${badge.cssClass}">${badge.label}</span>
            </div>
          </div>

          <div class="acc-refund-reason-box">
            <strong class="acc-field-label">${isEn ? 'Reason and details of refund request:' : 'سبب وتفاصيل طلب الاسترداد:'}</strong>
            <p class="acc-refund-reason-text">${escapeHtml(reasonText)}</p>
          </div>
        </div>
      `;
    }

    openModal(modal);
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    loadBooking,
    switchTab,
    openEvidenceModal,
    openReviewModal,
    openDiscussionModal,
    openRefundModal
  };
});
