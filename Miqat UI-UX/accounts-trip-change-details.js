/**
 * MIQAT ACCOUNTS WORKSPACE — PROGRAM & ITINERARY MODIFICATIONS
 * PAGE 3: MODIFICATION REQUEST DETAILS CONTROLLER
 * 
 * Features:
 * - URL parameter ?id={id} (defaults to MOD-2026-101)
 * - Compact Sticky Summary Header (STRICTLY NO FINANCIAL VALUES IN HEADER)
 * - 7 Collapsible Horizontal Tabs (all collapsed by default, mutually exclusive, gold active state)
 * - Tab 1: Booking & Customer Information (with travelers list)
 * - Tab 2: Side-by-side Program Comparison (original vs new, reason, notes)
 * - Tab 3: Financial Summary (strict formula, 6 boxes, progress bar)
 * - Tab 4: Additional Payments Register (approval workflow & receipt modal)
 * - Tab 5: 3-step Workflow Stepper & Status History
 * - Tab 6: Request Conversation (direct text-only, auto-closes on completion)
 * - Tab 7: Immutable Activity Audit Log
 * - Supplementary Panels: Company Contact & Private Internal Notes
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsTripChangeDetails = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let currentRequestId = 'MOD-2026-101';
  let requestData = null;
  let pendingApprovePaymentId = null;

  function getLang() {
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getLang === 'function') {
      return window.AccountsWorkspace.getLang();
    }
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getCurrentLang === 'function') {
      return window.AccountsWorkspace.getCurrentLang();
    }
    return document.documentElement.lang || 'ar';
  }

  function t(key, fallbackAr, fallbackEn) {
    const lang = getLang();
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.t === 'function') {
      const val = window.AccountsWorkspace.t(key);
      if (val && val !== key) return val;
    }
    return lang === 'en' ? (fallbackEn || key) : (fallbackAr || key);
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

  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id');
    if (paramId) {
      currentRequestId = paramId;
    }

    if (!window.AccountsMockData) {
      console.error('AccountsMockData service not ready');
      return;
    }

    loadRequest();
    setupCollapsibleTabs();
    bindHeaderActions();
    bindSupplementaryActions();
    bindModals();

    function onLangChange() {
      loadRequest();
    }
    window.addEventListener('accounts-lang-changed', onLangChange);
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.registerRefreshListener === 'function') {
      window.AccountsWorkspace.registerRefreshListener(onLangChange);
    }
  }

  function loadRequest() {
    requestData = window.AccountsMockData.getModificationDetails(currentRequestId);
    if (!requestData) {
      console.warn('Request not found, falling back to MOD-2026-101');
      currentRequestId = 'MOD-2026-101';
      requestData = window.AccountsMockData.getModificationDetails('MOD-2026-101');
    }

    populateStickyHeader();
    populateTab1();
    populateTab2();
    populateTab3();
    populateTab4();
    populateTab5();
    populateTab6();
    populateTab7();
    populateSupplementaryPanels();
  }

  // --- Sticky Summary Header (STRICTLY NO FINANCES) ---
  function populateStickyHeader() {
    const lang = getLang();
    const r = requestData;

    const elBreadcrumbCompany = document.getElementById('breadcrumb-link-company');
    const elBreadcrumbReq = document.getElementById('breadcrumb-request-id');
    const elReqId = document.getElementById('header-request-id');
    const elCustLink = document.getElementById('header-customer-link');
    const elCompName = document.getElementById('header-company-name');
    const elDate = document.getElementById('header-request-date');
    const elStatusBadge = document.getElementById('header-status-badge');
    const elSlaBadge = document.getElementById('header-sla-badge');
    const btnBack = document.getElementById('btn-back-to-company');

    const customerName = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
    const companyName = lang === 'ar' ? (r.company_name_ar || r.company_ar) : (r.company_name_en || r.company_en || r.company_name_ar);

    if (elBreadcrumbCompany) {
      elBreadcrumbCompany.textContent = companyName;
      elBreadcrumbCompany.href = `accounts-trip-changes-company.html?company=${encodeURIComponent(r.company_id)}`;
    }
    if (elBreadcrumbReq) elBreadcrumbReq.textContent = r.id;
    if (btnBack) btnBack.href = `accounts-trip-changes-company.html?company=${encodeURIComponent(r.company_id)}`;

    if (elReqId) elReqId.textContent = r.id;
    if (elCustLink) {
      elCustLink.textContent = customerName;
      elCustLink.href = `accounts-customer-details.html?id=${encodeURIComponent(r.customer_id)}`;
    }
    if (elCompName) elCompName.textContent = companyName;
    if (elDate) elDate.textContent = r.created_at;

    // Status Badge
    if (elStatusBadge) {
      const statusMap = {
        new: { label: lang === 'ar' ? 'طلب جديد' : 'New Request', css: 'status-pill-blue' },
        in_progress: { label: lang === 'ar' ? 'قيد المعالجة' : 'In Progress', css: 'status-pill-amber' },
        completed: { label: lang === 'ar' ? 'مكتمل ومعتمد' : 'Completed', css: 'status-pill-slate' }
      };
      const st = statusMap[r.request_status] || { label: r.request_status, css: 'status-pill-slate' };
      elStatusBadge.textContent = st.label;
      elStatusBadge.className = `acc-status-pill ${st.css}`;
    }

    // SLA Badge
    if (elSlaBadge) {
      if (r.request_status === 'completed') {
        elSlaBadge.textContent = t('modifications.sla_completed_msg', 'مكتمل', 'Completed');
        elSlaBadge.className = 'acc-status-pill status-pill-slate';
      } else if (r.request_status === 'in_progress') {
        elSlaBadge.textContent = t('modifications.sla_in_progress_msg', 'قيد المعالجة (توقف عداد المهلة)', 'In Progress (SLA paused)');
        elSlaBadge.className = 'acc-status-pill status-pill-navy';
      } else if (r.sla && r.sla.is_overdue) {
        elSlaBadge.textContent = t('modifications.sla_exceeded', 'متأخر عن المهلة', 'SLA Deadline Exceeded');
        elSlaBadge.className = 'acc-status-pill status-pill-amber acc-badge-overdue';
      } else {
        const remainingMin = (r.sla && r.sla.remaining_minutes) ? r.sla.remaining_minutes : 95;
        const hours = Math.floor(remainingMin / 60);
        const mins = remainingMin % 60;
        const timeStr = lang === 'ar' ? `باقي ${hours} س و ${mins} د` : `${hours}h ${mins}m remaining`;
        elSlaBadge.textContent = timeStr;
        elSlaBadge.className = 'acc-status-pill status-pill-slate';
      }
    }

    // Header Action Buttons Visibility
    const btnStart = document.getElementById('btn-start-processing');
    const btnComp = document.getElementById('btn-mark-completed');

    if (btnStart) btnStart.style.display = r.request_status === 'new' ? 'inline-flex' : 'none';
    if (btnComp) btnComp.style.display = r.request_status === 'in_progress' ? 'inline-flex' : 'none';
  }

  // --- 7 Collapsible Horizontal Tabs Setup (Mutually Exclusive, Gold Active) ---
  function setupCollapsibleTabs() {
    const tabs = document.querySelectorAll('.acc-collapsible-tab');
    tabs.forEach(tab => {
      const header = tab.querySelector('.acc-tab-header');
      if (!header) return;

      header.addEventListener('click', function () {
        const isOpen = tab.classList.contains('is-open');

        // Close all tabs (mutually exclusive requirement)
        tabs.forEach(t => {
          t.classList.remove('is-open');
          const btn = t.querySelector('.acc-tab-header');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle this tab
        if (!isOpen) {
          tab.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // --- TAB 1: Booking & Customer Information ---
  function populateTab1() {
    const container = document.getElementById('content-booking-info');
    if (!container) return;
    const lang = getLang();
    const r = requestData;

    // Lookup customer and booking master record if available
    let customerRec = null;
    let bookingRec = null;
    if (window.AccountsMockData) {
      if (Array.isArray(window.AccountsMockData.CUSTOMERS)) {
        customerRec = window.AccountsMockData.CUSTOMERS.find(c => c.id === r.customer_id);
      }
      if (Array.isArray(window.AccountsMockData.BOOKINGS_MASTER)) {
        bookingRec = window.AccountsMockData.BOOKINGS_MASTER.find(b => b.id === r.booking_id);
      }
    }

    const custName = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
    const email = customerRec ? customerRec.email : 'ahmed.elsherif@gmail.com';
    const address = customerRec ? (lang === 'ar' ? customerRec.governorate_ar : customerRec.governorate_en) : (lang === 'ar' ? 'الجيزة' : 'Giza');
    const nationalId = '28910140102938';

    // Travelers list
    let travelers = [];
    if (bookingRec && Array.isArray(bookingRec.travelers)) {
      travelers = bookingRec.travelers;
    } else {
      travelers = [
        {
          name_ar: 'أحمد محمود الشريف',
          name_en: 'Ahmed Mahmoud El-Sherif',
          relation_ar: 'المسافر الرئيسي',
          relation_en: 'Primary Traveler',
          passport_or_id: 'A29810452',
          birth_date: '1989-10-14'
        },
        {
          name_ar: 'سعاد إبراهيم المنشاوي',
          name_en: 'Soad Ibrahim El-Menshawy',
          relation_ar: 'الزوجة',
          relation_en: 'Spouse',
          passport_or_id: 'A18274091',
          birth_date: '1992-04-20'
        }
      ];
    }

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px;">
        <!-- Customer Details Box -->
        <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 18px 20px; display: flex; flex-direction: column; gap: 10px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 0 0 6px 0;">${t('modifications.tab_booking_info', 'بيانات العميل')}</h4>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_customer_name', 'الاسم:')}</span>
            <strong>${escapeHtml(custName)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_national_id', 'الرقم القومي / الهوية:')}</span>
            <span style="font-family: monospace;">${escapeHtml(nationalId)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_phone', 'الهاتف المحمول:')}</span>
            <span dir="ltr">${escapeHtml(r.customer_phone || '')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_email', 'البريد الإلكتروني:')}</span>
            <span>${escapeHtml(email)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_address', 'المحافظة والعنوان:')}</span>
            <span>${escapeHtml(address)}</span>
          </div>
        </div>

        <!-- Booking Details Box -->
        <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 18px 20px; display: flex; flex-direction: column; gap: 10px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 0 0 6px 0;">${t('modifications.breadcrumb_company_requests', 'بيانات الحجز')}</h4>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_booking_ref', 'رقم الحجز:')}</span>
            <a href="accounts-booking-details.html?id=${encodeURIComponent(r.booking_id)}" class="acc-link" style="font-weight: 700; text-decoration: underline;">${escapeHtml(r.booking_id)}</a>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_booking_date', 'تاريخ الحجز:')}</span>
            <span>2026-10-25</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_booking_status', 'حالة الحجز:')}</span>
            <span class="acc-status-pill status-pill-navy">${lang === 'ar' ? 'مؤكد' : 'Confirmed'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
            <span style="color: var(--color-text-muted);">${t('modifications.label_travelers_count', 'عدد المسافرين:')}</span>
            <strong>${formatNum(travelers.length)}</strong>
          </div>
        </div>
      </div>

      <!-- Travelers List Table -->
      <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 0 0 12px 0;">${t('modifications.travelers_table_title', 'قائمة المسافرين المشمولين في الحجز')}</h4>
      <div class="acc-table-scroll" style="overflow-x: auto;">
        <table class="acc-table" style="width: 100%;">
          <thead>
            <tr>
              <th>${t('modifications.th_traveler_name', 'اسم المسافر')}</th>
              <th>${t('modifications.th_traveler_relation', 'صلة القرابة')}</th>
              <th>${t('modifications.th_traveler_passport', 'رقم الجواز / الهوية')}</th>
              <th>${t('modifications.th_traveler_birth', 'تاريخ الميلاد')}</th>
            </tr>
          </thead>
          <tbody>
            ${travelers.map(tr => `
              <tr>
                <td><strong>${escapeHtml(lang === 'ar' ? tr.name_ar : (tr.name_en || tr.name_ar))}</strong></td>
                <td>${escapeHtml(lang === 'ar' ? tr.relation_ar : (tr.relation_en || tr.relation_ar))}</td>
                <td style="font-family: monospace;">${escapeHtml(tr.passport_or_id || '—')}</td>
                <td>${escapeHtml(tr.birth_date || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- TAB 2: Program Comparison ---
  function populateTab2() {
    const container = document.getElementById('content-program-comparison');
    if (!container) return;
    const lang = getLang();
    const r = requestData;
    const orig = r.original_program || {};
    const mod = r.new_program || {};

    const fields = [
      {
        label: t('modifications.comp_program_name', 'اسم البرنامج والباقة'),
        orig: lang === 'ar' ? orig.name_ar : (orig.name_en || orig.name_ar),
        mod: lang === 'ar' ? mod.name_ar : (mod.name_en || mod.name_ar)
      },
      {
        label: t('modifications.comp_category', 'الفئة والدرجة'),
        orig: lang === 'ar' ? orig.type_ar : (orig.type_en || orig.type_ar),
        mod: lang === 'ar' ? mod.type_ar : (mod.type_en || mod.type_ar)
      },
      {
        label: t('modifications.comp_makkah_hotel', 'فنادق الإقامة (مكة والمدينة)'),
        orig: lang === 'ar' ? orig.hotel_ar : (orig.hotel_en || orig.hotel_ar),
        mod: lang === 'ar' ? mod.hotel_ar : (mod.hotel_en || mod.hotel_ar)
      },
      {
        label: t('modifications.comp_nights', 'خط سير الطيران'),
        orig: lang === 'ar' ? orig.airline_ar : (orig.airline_en || orig.airline_ar),
        mod: lang === 'ar' ? mod.airline_ar : (mod.airline_en || mod.airline_ar)
      },
      {
        label: t('modifications.comp_travel_date', 'تاريخ الذهاب والسفر'),
        orig: orig.travel_date || '2027-01-18',
        mod: mod.travel_date || '2027-01-20'
      },
      {
        label: t('modifications.comp_return_date', 'تاريخ العودة'),
        orig: orig.return_date || '2027-01-28',
        mod: mod.return_date || '2027-01-31'
      },
      {
        label: t('modifications.comp_room_type', 'عدد المسافرين بالبرنامج'),
        orig: formatNum(orig.travelers_count || 2),
        mod: formatNum(mod.travelers_count || 2)
      },
      {
        label: t('modifications.comp_total_price', 'السعر الإجمالي للبرنامج'),
        orig: formatCurr(orig.total_price || 0),
        mod: formatCurr(mod.total_price || 0)
      }
    ];

    const reason = lang === 'ar'
      ? (mod.modification_reason_ar || r.modification_reason_ar || 'طلب العميل ترقية فندق الإقامة لظروف صحية.')
      : (mod.modification_reason_en || r.modification_reason_en || 'Customer requested upgrade due to medical needs.');

    const notes = lang === 'ar'
      ? (r.modification_notes_ar || 'تم التنسيق المسبق مع إدارة الحجوزات بميقات وتوفير الغرف البديلة.')
      : (r.modification_notes_en || 'Pre-coordinated with Miqat reservations management.');

    container.innerHTML = `
      <!-- Comparison Table -->
      <table class="acc-prog-compare-table">
        <thead>
          <tr>
            <th>${t('modifications.comp_field', 'بند المقارنة')}</th>
            <th>${t('modifications.comp_original', 'البرنامج الأصلي المعتمد')}</th>
            <th>${t('modifications.comp_new', 'البرنامج الجديد المطلوب بالتعديل')}</th>
          </tr>
        </thead>
        <tbody>
          ${fields.map(f => `
            <tr>
              <td class="acc-prog-field-label">${escapeHtml(f.label)}</td>
              <td class="acc-prog-val-orig">${escapeHtml(f.orig || '—')}</td>
              <td class="acc-prog-val-new">${escapeHtml(f.mod || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Reason & Operational Notes -->
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 18px;">
        <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 14px 18px;">
          <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text); margin: 0 0 6px 0;">${t('modifications.mod_reason_title', 'سبب التعديل الموضح من شركة السياحة:')}</h5>
          <p style="font-size: 0.82rem; color: var(--color-text); margin: 0; line-height: 1.5;">${escapeHtml(reason)}</p>
        </div>

        <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-sm); padding: 14px 18px;">
          <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); margin: 0 0 6px 0;">${t('modifications.mod_notes_title', 'ملاحظات وتفاصيل التعديل من الشركة (للقراءة فقط):')}</h5>
          <p style="font-size: 0.82rem; color: var(--color-text-muted); margin: 0; line-height: 1.5;">${escapeHtml(notes)}</p>
        </div>
      </div>
    `;
  }

  // --- TAB 3: Financial Summary (STRICT FORMULA ENFORCEMENT) ---
  function populateTab3() {
    const container = document.getElementById('content-financial-summary');
    if (!container) return;
    const r = requestData;
    const fin = r.financials;

    container.innerHTML = `
      <!-- 6 Financial Stat Boxes -->
      <div class="acc-fin-boxes-grid">
        <!-- Box 1: Original Deposit -->
        <div class="acc-fin-box">
          <span class="acc-fin-box-label">${t('modifications.fin_box_orig_deposit', 'الدفعة الأولى الأصلية المسددة')}</span>
          <span class="acc-fin-box-val">${formatCurr(fin.originalDeposit)}</span>
        </div>

        <!-- Box 2: Approved Additional Payments -->
        <div class="acc-fin-box">
          <span class="acc-fin-box-label">${t('modifications.fin_box_approved_additional', 'المدفوعات الإضافية المعتمدة')}</span>
          <span class="acc-fin-box-val">${formatCurr(fin.approvedAdditional)}</span>
        </div>

        <!-- Box 3: Total Approved Paid Amount (HIGHLIGHTED GOLD) -->
        <div class="acc-fin-box box-highlight">
          <span class="acc-fin-box-label">${t('modifications.fin_box_total_approved_paid', 'إجمالي المدفوع المعتمد')}</span>
          <span class="acc-fin-box-val">${formatCurr(fin.totalApprovedPaid)}</span>
        </div>

        <!-- Box 4: Pending Additional Payments -->
        <div class="acc-fin-box">
          <span class="acc-fin-box-label">${t('modifications.fin_box_pending_additional', 'المدفوعات الإضافية المعلقة')}</span>
          <span class="acc-fin-box-val" style="color: var(--color-text-muted);">${formatCurr(fin.pendingAdditional)}</span>
        </div>

        <!-- Box 5: New Program Total Price -->
        <div class="acc-fin-box">
          <span class="acc-fin-box-label">${t('modifications.fin_box_new_total', 'السعر الإجمالي للبرنامج الجديد')}</span>
          <span class="acc-fin-box-val">${formatCurr(fin.newPrice)}</span>
        </div>

        <!-- Box 6: Final Remaining Balance (HIGHLIGHTED REMAINING) -->
        <div class="acc-fin-box box-remaining">
          <span class="acc-fin-box-label">${t('modifications.fin_box_remaining', 'المبلغ المتبقي النهائي للسداد')}</span>
          <span class="acc-fin-box-val">${formatCurr(fin.remainingAmount)}</span>
        </div>
      </div>

      <!-- Strict Formula Explanation Card -->
      <div class="acc-fin-formula-card">
        ${t('modifications.fin_formula_note', 'معادلة الاحتساب الصارمة: إجمالي المدفوع المعتمد = الدفعة الأولى + المدفوعات الإضافية المعتمدة. المبلغ المتبقي = سعر البرنامج الجديد - إجمالي المدفوع المعتمد. (المدفوعات المعلقة مستثناة من الاعتماد حتى التحقق).')}
      </div>

      <!-- Payment Coverage Progress Bar -->
      <div class="acc-fin-progress-wrap">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 700;">
          <span>${t('modifications.fin_payment_progress', 'نسبة تغطية سداد البرنامج الجديد:')}</span>
          <span style="color: var(--color-accent);">${formatNum(fin.progressPct)}%</span>
        </div>
        <div class="acc-fin-progress-bar-bg">
          <div class="acc-fin-progress-bar-fill" style="width: ${fin.progressPct}%;"></div>
        </div>
      </div>
    `;
  }

  // --- TAB 4: Additional Payments ---
  function populateTab4() {
    const container = document.getElementById('content-additional-payments');
    if (!container) return;
    const lang = getLang();
    const r = requestData;
    const payments = r.additional_payments || [];

    if (payments.length === 0) {
      container.innerHTML = `<p style="color: var(--color-text-muted); font-size: 0.85rem; padding: 20px 0;">${t('modifications.no_additional_payments', 'لا توجد مدفوعات إضافية مسجلة لهذا الطلب.')}</p>`;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 0;">${t('modifications.payments_list_title', 'سجل المدفوعات الإضافية المرتبطة بهذا التعديل')}</h4>
        <button type="button" class="acc-btn acc-btn-secondary" id="btn-add-mock-payment" style="font-size: 0.78rem; padding: 6px 12px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>${t('modifications.btn_add_payment', 'تسجيل دفعة إضافية')}</span>
        </button>
      </div>

      <div class="acc-table-scroll" style="overflow-x: auto;">
        <table class="acc-table" style="width: 100%;">
          <thead>
            <tr>
              <th>${t('modifications.th_payment_id', 'رقم المعاملة')}</th>
              <th>${t('modifications.th_payment_date', 'تاريخ وساعة السداد')}</th>
              <th>${t('modifications.th_payment_amount', 'المبلغ المحول')}</th>
              <th>${t('modifications.th_payment_method', 'طريقة السداد')}</th>
              <th>${t('modifications.th_payment_receipt', 'رقم الإيصال / الحوالة')}</th>
              <th>${t('modifications.th_payment_recorded_by', 'الجهة المسجلة')}</th>
              <th>${t('modifications.th_payment_review_status', 'حالة الاعتماد')}</th>
              <th>${t('modifications.th_payment_reviewer', 'الموظف المعتمد')}</th>
              <th>${t('modifications.th_payment_actions', 'الإجراءات')}</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(p => {
              const isApproved = p.review_status === 'approved';
              const badgeClass = isApproved ? 'status-pill-navy' : 'status-pill-amber';
              const badgeText = isApproved ? (lang === 'ar' ? 'معتمد' : 'Approved') : (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending Review');
              const reviewer = isApproved ? (lang === 'ar' ? p.reviewed_by_ar : (p.reviewed_by_en || p.reviewed_by_ar)) : '—';

              return `
                <tr>
                  <td style="font-family: monospace; font-weight: 700;">${escapeHtml(p.id)}</td>
                  <td>${escapeHtml(p.date)}</td>
                  <td style="font-weight: 700; color: var(--color-accent);">${formatCurr(p.amount)}</td>
                  <td>${escapeHtml(lang === 'ar' ? p.payment_method_ar : (p.payment_method_en || p.payment_method_ar))}</td>
                  <td style="font-family: monospace;">${escapeHtml(p.receipt_ref)}</td>
                  <td>${escapeHtml(lang === 'ar' ? p.recorded_by_ar : (p.recorded_by_en || p.recorded_by_ar))}</td>
                  <td><span class="acc-status-pill ${badgeClass}">${escapeHtml(badgeText)}</span></td>
                  <td>${escapeHtml(reviewer)}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button type="button" class="acc-btn acc-btn-secondary btn-view-receipt" data-payment-id="${p.id}" style="padding: 4px 8px; font-size: 0.74rem;">
                        ${t('modifications.btn_view_receipt', 'عرض الإيصال')}
                      </button>
                      ${!isApproved ? `
                        <button type="button" class="acc-btn acc-btn-primary btn-approve-payment" data-payment-id="${p.id}" style="padding: 4px 8px; font-size: 0.74rem;">
                          ${t('modifications.btn_approve_payment', 'اعتماد')}
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Bind action buttons inside Tab 4
    container.querySelectorAll('.btn-view-receipt').forEach(btn => {
      btn.addEventListener('click', function () {
        const pId = this.getAttribute('data-payment-id');
        openReceiptModal(pId);
      });
    });

    container.querySelectorAll('.btn-approve-payment').forEach(btn => {
      btn.addEventListener('click', function () {
        const pId = this.getAttribute('data-payment-id');
        openApprovePaymentDialog(pId);
      });
    });

    const btnAddMock = container.querySelector('#btn-add-mock-payment');
    if (btnAddMock) {
      btnAddMock.addEventListener('click', function () {
        addMockPayment();
      });
    }
  }

  // --- TAB 5: Modification Status & Stepper ---
  function populateTab5() {
    const container = document.getElementById('content-modification-status');
    if (!container) return;
    const lang = getLang();
    const r = requestData;
    const history = r.status_history || [];

    const isNew = r.request_status === 'new';
    const isProg = r.request_status === 'in_progress';
    const isComp = r.request_status === 'completed';

    container.innerHTML = `
      <!-- 3-Step Visual Workflow Stepper -->
      <div class="acc-status-stepper">
        <div class="acc-step-item ${isNew ? 'is-current' : 'is-done'}">
          <span class="acc-step-num">${t('modifications.step_new_title', '١. استلام الطلب')}</span>
          <span class="acc-step-title">${isNew ? t('modifications.stepper_waiting', 'قيد الانتظار', 'Awaiting Review') : t('modifications.stepper_received', 'تم الاستلام', 'Received')}</span>
          <span class="acc-step-desc">${t('modifications.step_new_desc', 'تم استلام الطلب وتسجيله على النظام بانتظار مراجعة الحسابات.')}</span>
        </div>

        <div class="acc-step-item ${isProg ? 'is-current' : (isComp ? 'is-done' : '')}">
          <span class="acc-step-num">${t('modifications.step_prog_title', '٢. قيد المعالجة والتدقيق')}</span>
          <span class="acc-step-title">${isProg ? t('modifications.stepper_active_stage', 'المرحلة النشطة', 'Active Stage') : (isComp ? t('modifications.stepper_audited', 'تم التدقيق', 'Audited') : t('modifications.stepper_pending_start', 'بانتظار البدء', 'Pending Start'))}</span>
          <span class="acc-step-desc">${t('modifications.step_prog_desc', 'الطلب قيد التدقيق المالي ومطابقة الحوالات مع الشركة.')}</span>
        </div>

        <div class="acc-step-item ${isComp ? 'is-current is-done' : ''}">
          <span class="acc-step-num">${t('modifications.step_comp_title', '٣. اكتمال واعتماد التعديل')}</span>
          <span class="acc-step-title">${isComp ? t('modifications.stepper_final_approved', 'مكتمل ومعتمد نهائياً', 'Completed & Approved') : t('modifications.stepper_incomplete', 'غير مكتمل', 'Incomplete')}</span>
          <span class="acc-step-desc">${t('modifications.step_comp_desc', 'تم سداد كافة المستحقات أو اعتماد التسوية وتثبيت البرنامج نهائياً.')}</span>
        </div>
      </div>

      <!-- History Timeline -->
      <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 20px 0 12px 0;">${t('modifications.status_history_title', 'سجل التغييرات الزمنية للحالة')}</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${history.map(h => `
          <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.82rem;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-top: 6px;"></div>
            <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${escapeHtml(lang === 'ar' ? (h.status_label_ar || h.to_status) : (h.status_label_en || h.to_status))}</strong>
                <span style="color: var(--color-text-muted); font-size: 0.74rem;">${escapeHtml(h.timestamp || h.date)}</span>
              </div>
              <span style="color: var(--color-text-muted); font-size: 0.76rem;">${escapeHtml(lang === 'ar' ? (h.actor_ar || h.employee_ar) : (h.actor_en || h.employee_en || h.actor_ar))}</span>
              ${h.note_ar ? `<p style="margin: 4px 0 0 0; color: var(--color-text); font-size: 0.8rem;">${escapeHtml(lang === 'ar' ? h.note_ar : (h.note_en || h.note_ar))}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- TAB 6: Request Conversation (Direct Text-Only Chat) ---
  function populateTab6() {
    const container = document.getElementById('content-conversation');
    if (!container) return;
    const lang = getLang();
    const r = requestData;
    const isCompleted = r.request_status === 'completed' || (r.conversation && r.conversation.is_closed);
    const messages = (r.conversation && r.conversation.messages) ? r.conversation.messages : (r.chat_messages || []);

    container.innerHTML = `
      <div class="acc-chat-container">
        <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 10px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 0 0 4px 0;">${t('modifications.chat_title', 'المحادثة الفورية المباشرة للطلب (حسابات ميقات ↔ شركة السياحة)')}</h4>
          <span style="font-size: 0.74rem; color: var(--color-text-muted);">${t('modifications.chat_notice', 'قناة رسمية نصية موثقة خاصة بهذا الطلب فقط. تُغلق المحادثة وتتحول للقراءة فقط تلقائياً بمجرد اكتمال الطلب.')}</span>
        </div>

        <div class="acc-chat-messages-stream" id="chat-stream">
          ${messages.map(m => {
            const isMiqat = m.sender_type === 'accounts' || m.sender_role === 'accounts_staff';
            const bubbleClass = isMiqat ? 'bubble-miqat' : 'bubble-company';
            const senderName = lang === 'ar' ? m.sender_name_ar : (m.sender_name_en || m.sender_name_ar);
            const content = lang === 'ar' ? m.content_ar : (m.content_en || m.content_ar);
            const time = m.date || m.timestamp || '';

            return `
              <div class="acc-chat-bubble ${bubbleClass}">
                <div class="acc-chat-bubble-meta">
                  <span class="acc-chat-bubble-author">${escapeHtml(senderName)}</span>
                  <span>${escapeHtml(time)}</span>
                </div>
                <div class="acc-chat-bubble-text">${escapeHtml(content)}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Refined Official Message Composer (Miqat Form Language) -->
        ${isCompleted ? `
          <div class="acc-chat-closed-alert">
            <div class="acc-chat-closed-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span class="acc-chat-closed-text">${t('modifications.chat_closed_notice', 'تم إغلاق المحادثة الرسمية وتجميدها لأن الطلب مكتمل ومعتمد نهائياً.', 'Official conversation is closed and read-only because the request has been completed and approved.')}</span>
          </div>
        ` : `
          <form class="acc-chat-composer" id="form-chat-composer" onsubmit="return false;" aria-label="${t('modifications.aria_chat_form', 'نموذج إرسال رسالة رسمية', 'Official message composition form')}">
            <div class="acc-chat-composer-inner">
              <label for="chat-input-text" class="sr-only" data-i18n="modifications.aria_chat_message">${t('modifications.aria_chat_message', 'نص الرسالة الرسمية', 'Official message text')}</label>
              <textarea 
                id="chat-input-text" 
                class="acc-input acc-textarea acc-chat-textarea" 
                rows="3" 
                placeholder="${t('modifications.chat_placeholder', 'اكتب رسالة أو استفساراً لمسؤول شركة السياحة...', 'Type a message or inquiry for the tourism company representative...')}" 
                data-i18n-placeholder="modifications.chat_placeholder"
                aria-label="${t('modifications.aria_chat_message', 'نص الرسالة الرسمية', 'Official message text')}"></textarea>
              
              <div class="acc-chat-composer-footer">
                <div class="acc-chat-composer-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span data-i18n="modifications.chat_composer_hint">${t('modifications.chat_composer_hint', 'محادثة موثقة مسجلة بسجل الطلب • اضغط Enter أو زر الإرسال', 'Official documented channel logged to request trail • Press Enter to send')}</span>
                </div>

                <div class="acc-chat-composer-actions">
                  <button type="button" class="acc-btn acc-btn-primary acc-chat-send-btn" id="btn-send-chat-msg" aria-label="${t('modifications.btn_send_message', 'إرسال رسالة', 'Send Message')}">
                    <span data-i18n="modifications.btn_send_message">${t('modifications.btn_send_message', 'إرسال رسالة', 'Send Message')}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="acc-chat-send-icon" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        `}
      </div>
    `;

    // Scroll chat to bottom
    const stream = container.querySelector('#chat-stream');
    if (stream) stream.scrollTop = stream.scrollHeight;

    // Send button event
    const btnSend = container.querySelector('#btn-send-chat-msg');
    const inputMsg = container.querySelector('#chat-input-text');
    if (btnSend && inputMsg) {
      const handleSend = function () {
        const text = inputMsg.value.trim();
        if (!text) return;

        btnSend.disabled = true;
        const senderName = lang === 'ar' ? 'أحمد صبري' : 'Ahmed Sabry';
        if (typeof window.AccountsMockData.sendModificationMessage === 'function') {
          window.AccountsMockData.sendModificationMessage(currentRequestId, text, senderName, 'accounts_staff');
        } else if (typeof window.AccountsMockData.sendModificationChatMessage === 'function') {
          window.AccountsMockData.sendModificationChatMessage(currentRequestId, text, 'accounts_staff', senderName);
        }
        inputMsg.value = '';
        loadRequest();
        const tabArticle = document.querySelector('article[data-tab="tab-conversation"]');
        if (tabArticle && !tabArticle.classList.contains('is-open')) {
          tabArticle.classList.add('is-open');
          const headerBtn = tabArticle.querySelector('.acc-tab-header');
          if (headerBtn) headerBtn.setAttribute('aria-expanded', 'true');
        }
      };

      btnSend.addEventListener('click', handleSend);

      inputMsg.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }
  }

  // --- TAB 7: Activity Log ---
  function populateTab7() {
    const container = document.getElementById('content-activity-log');
    if (!container) return;
    const lang = getLang();
    const r = requestData;
    const logs = r.activity_log || [];

    if (logs.length === 0) {
      container.innerHTML = `<p style="color: var(--color-text-muted); font-size: 0.85rem; padding: 20px 0;">${t('modifications.audit_log_empty', 'لا توجد أنشطة مسجلة لهذا الطلب.')}</p>`;
      return;
    }

    container.innerHTML = `
      <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-text); margin: 0 0 14px 0;">${t('modifications.audit_log_title', 'سجل التدقيق غير القابل للتعديل للطلب')}</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${logs.map(log => `
          <div style="display: flex; align-items: flex-start; gap: 14px; padding: 14px; background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.82rem;">
            <div style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--color-accent-subtle); color: var(--color-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: var(--color-text);">${escapeHtml(lang === 'ar' ? log.title_ar : (log.title_en || log.title_ar))}</strong>
                <span style="font-size: 0.74rem; color: var(--color-text-muted);">${escapeHtml(log.date)}</span>
              </div>
              <p style="margin: 0; color: var(--color-text); line-height: 1.4;">${escapeHtml(lang === 'ar' ? log.desc_ar : (log.desc_en || log.desc_ar))}</p>
              <span style="font-size: 0.72rem; color: var(--color-text-muted);">${escapeHtml(lang === 'ar' ? log.actor_ar : (log.actor_en || log.actor_ar))}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Supplementary Panels (Contact & Internal Notes) ---
  function populateSupplementaryPanels() {
    const lang = getLang();
    const r = requestData;
    const contact = r.company_employee || {};

    const repName = document.getElementById('contact-rep-name');
    const repLicense = document.getElementById('contact-comp-license');
    const repPhone = document.getElementById('contact-rep-phone');
    const notesTextarea = document.getElementById('internal-notes-textarea');

    if (repName) repName.textContent = lang === 'ar' ? contact.name_ar : (contact.name_en || contact.name_ar);
    if (repLicense) repLicense.textContent = lang === 'ar' ? 'ترخيص سياحي رقم ٤١٨ فئة (أ)' : 'Tourism License #418 Category A';
    if (repPhone) repPhone.textContent = contact.phone || '01198765432';

    // Internal notes (format string or array)
    if (notesTextarea) {
      if (Array.isArray(r.internal_notes) && r.internal_notes.length > 0) {
        notesTextarea.value = lang === 'ar' ? r.internal_notes[0].text_ar : (r.internal_notes[0].text_en || r.internal_notes[0].text_ar);
      } else if (typeof r.internal_notes === 'string') {
        notesTextarea.value = r.internal_notes;
      }
    }
  }

  function bindHeaderActions() {
    const btnStart = document.getElementById('btn-start-processing');
    if (btnStart) {
      btnStart.addEventListener('click', function () {
        window.AccountsMockData.updateModificationStatus(currentRequestId, 'in_progress', 'أحمد صبري');
        if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
          window.AccountsWorkspace.showToast(getLang() === 'ar' ? 'تم بدء معالجة الطلب وتوقف عداد الـ SLA بنجاح.' : 'Processing started and SLA timer stopped.');
        }
        loadRequest();
      });
    }

    const btnComp = document.getElementById('btn-mark-completed');
    if (btnComp) {
      btnComp.addEventListener('click', function () {
        openCompleteModal();
      });
    }

    const btnPrint = document.getElementById('btn-print-request');
    if (btnPrint) {
      btnPrint.addEventListener('click', function () {
        window.print();
      });
    }
  }

  function bindSupplementaryActions() {
    // Save Private Internal Notes
    const btnSaveNotes = document.getElementById('btn-save-internal-note');
    const notesTextarea = document.getElementById('internal-notes-textarea');
    if (btnSaveNotes && notesTextarea) {
      btnSaveNotes.addEventListener('click', function () {
        const text = notesTextarea.value.trim();
        window.AccountsMockData.addModificationInternalNote(currentRequestId, text, 'أحمد صبري');
        if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
          window.AccountsWorkspace.showToast(t('modifications.internal_notes_saved_toast', 'تم حفظ الملاحظة الداخلية بنجاح وتوثيقها في سجل الأنشطة.'));
        }
        loadRequest();
      });
    }

    // WhatsApp Contact
    const btnWhatsApp = document.getElementById('btn-contact-whatsapp');
    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', function () {
        const contact = requestData.company_employee || {};
        const phone = contact.whatsapp || contact.phone || '01198765432';
        const msg = `مرحباً ${contact.name_ar || ''} بخصوص طلب تعديل البرنامج رقم ${currentRequestId}`;

        // Log access
        if (window.AccountsMockData && typeof window.AccountsMockData.sendMockWhatsAppNotification === 'function') {
          window.AccountsMockData.sendMockWhatsAppNotification(phone, msg);
        }

        // Add to activity
        if (requestData && requestData.activity_log) {
          requestData.activity_log.unshift({
            id: 'ACT-MOD-' + Date.now(),
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            title_ar: 'التواصل مع موظف الشركة عبر واتساب',
            title_en: 'WhatsApp Channel Opened with Company Rep',
            desc_ar: 'تم فتح قناة التواصل المباشر مع ' + (contact.name_ar || 'مسؤول الشركة') + ' بخصوص هذا الطلب.',
            desc_en: 'Communication channel opened with ' + (contact.name_en || 'company rep') + ' for this request.',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            type: 'contact'
          });
        }

        if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
          window.AccountsWorkspace.showToast(t('modifications.contact_logged_toast', 'تم تسجيل فتح قناة التواصل مع موظف الشركة في سجل التدقيق.'));
        }

        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
        populateTab7();
      });
    }
  }

  // --- Modals Management ---
  function bindModals() {
    // Receipt Modal
    const modalReceipt = document.getElementById('receipt-preview-modal');
    const btnCloseR1 = document.getElementById('btn-close-receipt-modal');
    const btnCloseR2 = document.getElementById('btn-dismiss-receipt-modal');
    const backdropR = document.getElementById('receipt-modal-backdrop');

    [btnCloseR1, btnCloseR2, backdropR].forEach(el => {
      if (el) el.addEventListener('click', () => modalReceipt.classList.remove('is-open'));
    });

    // Approve Payment Modal
    const modalApprove = document.getElementById('approve-payment-modal');
    const btnCancelApprove = document.getElementById('btn-cancel-approve-payment');
    const backdropApprove = document.getElementById('approve-payment-backdrop');
    const btnConfirmApprove = document.getElementById('btn-confirm-approve-payment');

    [btnCancelApprove, backdropApprove].forEach(el => {
      if (el) el.addEventListener('click', () => modalApprove.classList.remove('is-open'));
    });

    if (btnConfirmApprove) {
      btnConfirmApprove.addEventListener('click', function () {
        if (!pendingApprovePaymentId) return;
        window.AccountsMockData.approveModificationPayment(currentRequestId, pendingApprovePaymentId, 'أحمد صبري');
        modalApprove.classList.remove('is-open');
        pendingApprovePaymentId = null;

        if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
          window.AccountsWorkspace.showToast(getLang() === 'ar' ? 'تم اعتماد الدفعة الإضافية وإعادة احتساب المتبقي فوراً.' : 'Additional payment approved and balance recalculated.');
        }

        loadRequest();
      });
    }

    // Complete Request Modal
    const modalComp = document.getElementById('complete-request-modal');
    const btnCancelComp = document.getElementById('btn-cancel-complete');
    const backdropComp = document.getElementById('complete-modal-backdrop');
    const btnConfirmComp = document.getElementById('btn-confirm-complete');

    [btnCancelComp, backdropComp].forEach(el => {
      if (el) el.addEventListener('click', () => modalComp.classList.remove('is-open'));
    });

    if (btnConfirmComp) {
      btnConfirmComp.addEventListener('click', function () {
        window.AccountsMockData.updateModificationStatus(currentRequestId, 'completed', 'أحمد صبري');
        modalComp.classList.remove('is-open');

        if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
          window.AccountsWorkspace.showToast(getLang() === 'ar' ? 'تم اكتمال واعتماد طلب التعديل وإغلاق المحادثة الرسمية بنجاح.' : 'Request marked as completed and conversation closed.');
        }

        loadRequest();
      });
    }
  }

  function openReceiptModal(paymentId) {
    const payment = (requestData.additional_payments || []).find(p => p.id === paymentId);
    if (!payment) return;
    const lang = getLang();
    const modal = document.getElementById('receipt-preview-modal');
    const body = document.getElementById('receipt-modal-body');

    const ev = payment.evidence || { filename: 'Deposit_Voucher.pdf', size: '1.2 MB' };
    const isApproved = payment.review_status === 'approved';

    body.innerHTML = `
      <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 16px; display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-muted);">${t('modifications.th_payment_id', 'رقم المعاملة:')}</span>
          <strong style="font-family: monospace;">${escapeHtml(payment.id)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-muted);">${t('modifications.th_payment_amount', 'المبلغ المحول:')}</span>
          <strong style="color: var(--color-accent);">${formatCurr(payment.amount)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-muted);">${t('modifications.receipt_filename', 'اسم الملف:')}</span>
          <span style="font-family: monospace;">${escapeHtml(ev.filename)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-muted);">${t('modifications.receipt_size', 'الحجم:')}</span>
          <span>${escapeHtml(ev.size)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-muted);">${t('modifications.receipt_status', 'حالة الاعتماد:')}</span>
          <span class="acc-status-pill ${isApproved ? 'status-pill-navy' : 'status-pill-amber'}">${isApproved ? (lang === 'ar' ? 'معتمد' : 'Approved') : (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending Review')}</span>
        </div>
      </div>

      <!-- Mock PDF Preview Box -->
      <div style="background: #1e293b; color: #fff; padding: 36px 20px; border-radius: var(--radius-sm); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span style="font-size: 0.88rem; font-weight: 600;">${escapeHtml(ev.filename)}</span>
        <span style="font-size: 0.74rem; color: #94a3b8;">${lang === 'ar' ? 'مستند بنكي معتمد ومطابق للحساب المركزي' : 'Official bank voucher verified'}</span>
      </div>
    `;

    modal.classList.add('is-open');
  }

  function openApprovePaymentDialog(paymentId) {
    const payment = (requestData.additional_payments || []).find(p => p.id === paymentId);
    if (!payment) return;
    pendingApprovePaymentId = paymentId;

    const modal = document.getElementById('approve-payment-modal');
    const detailsBox = document.getElementById('approve-payment-details-box');

    if (detailsBox) {
      detailsBox.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <span>رقم المعاملة: <strong>${escapeHtml(payment.id)}</strong></span>
          <span>المبلغ: <strong style="color: var(--color-accent);">${formatCurr(payment.amount)}</strong></span>
        </div>
      `;
    }

    modal.classList.add('is-open');
  }

  function openCompleteModal() {
    const modal = document.getElementById('complete-request-modal');
    if (modal) modal.classList.add('is-open');
  }

  function addMockPayment() {
    const r = requestData;
    const newPayId = 'PAY-MOD-' + (Math.floor(Math.random() * 800) + 100);
    const newAmount = 15000;

    const paymentObj = {
      id: newPayId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      amount: newAmount,
      payment_method: 'bank_transfer',
      payment_method_ar: 'تحويل بنكي (بنك مصر)',
      payment_method_en: 'Bank Transfer (BM)',
      receipt_ref: 'RCP-TRF-' + Math.floor(Math.random() * 9000 + 1000),
      recorded_by_ar: r.company_name_ar + ' (موظف الشركة)',
      recorded_by_en: (r.company_name_en || r.company_name_ar) + ' (Company Staff)',
      review_status: 'pending_review',
      reviewed_by_ar: null,
      reviewed_by_en: null,
      reviewed_at: null,
      evidence: { filename: 'Bank_Transfer_' + newPayId + '.pdf', size: '1.1 MB' }
    };

    window.AccountsMockData.addAdditionalPayment(currentRequestId, paymentObj);

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
      window.AccountsWorkspace.showToast(getLang() === 'ar' ? 'تم تسجيل دفعة إضافية معلقة بنجاح.' : 'New additional payment recorded successfully.');
    }

    loadRequest();
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    loadRequest
  };
});
