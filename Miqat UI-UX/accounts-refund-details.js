/**
 * MIQAT ACCOUNTS WORKSPACE — REFUND REQUEST DETAILS (PAGE 8)
 * Controller Engine for Details View & Interactive Workflows
 */
(function () {
  'use strict';

  let currentLang = localStorage.getItem('miqat_lang') || 'ar';
  let activeTab = 'overview';
  let currentRefund = null;

  // Format Helpers
  function formatCurrency(amount) {
    if (typeof window.AccountsWorkspace !== 'undefined' && window.AccountsWorkspace.formatCurrency) {
      return window.AccountsWorkspace.formatCurrency(amount, currentLang);
    }
    const num = Number(amount || 0).toLocaleString('en-US');
    return currentLang === 'ar' ? (num + ' ج.م') : ('EGP ' + num);
  }

  function formatNumber(num) {
    if (typeof window.AccountsWorkspace !== 'undefined' && window.AccountsWorkspace.formatNumber) {
      return window.AccountsWorkspace.formatNumber(num, currentLang);
    }
    return String(num);
  }

  // Status Pill Resolver
  function getStatusPillInfo(status, lang) {
    const map = {
      refund_requested: { pillClass: 'status-pill-blue', ar: 'طلب جديد', en: 'New Request' },
      under_review: { pillClass: 'status-pill-amber', ar: 'قيد التدقيق المحاسبي', en: 'Under Review' },
      pending_admin_approval: { pillClass: 'status-pill-amber', ar: 'بانتظار اعتماد الإدارة', en: 'Pending Admin Approval' },
      returned_for_review: { pillClass: 'status-pill-slate', ar: 'مُعاد للمراجعة', en: 'Returned for Review' },
      approved_for_refund: { pillClass: 'status-pill-navy', ar: 'معتمد للصرف', en: 'Approved for Refund' },
      partially_refunded: { pillClass: 'status-pill-amber', ar: 'مسترد جزئياً', en: 'Partially Refunded' },
      awaiting_customer_confirmation: { pillClass: 'status-pill-amber', ar: 'بانتظار تأكيد العميل', en: 'Awaiting Customer Confirmation' },
      refund_dispute: { pillClass: 'status-pill-slate', ar: 'نزاع مالي مفتوح', en: 'Refund Dispute' },
      refund_completed: { pillClass: 'status-pill-navy', ar: 'استرداد مكتمل ومؤكد', en: 'Refund Completed' }
    };
    return map[status] || { pillClass: 'status-pill-slate', ar: status, en: status };
  }

  // Load Refund Record from URL query
  function loadRefundRecord() {
    if (!window.AccountsMockData) return null;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || 'REF-2026-001';
    let data = window.AccountsMockData.getRefundDetails(id);
    if (!data && window.AccountsMockData.REFUND_REQUESTS_MASTER && window.AccountsMockData.REFUND_REQUESTS_MASTER.length > 0) {
      data = window.AccountsMockData.REFUND_REQUESTS_MASTER[0];
    }
    currentRefund = data;
    return data;
  }

  // Render Sticky Header & Quick Context Actions
  function renderStickyHeader() {
    if (!currentRefund) return;
    const r = currentRefund;
    const pill = getStatusPillInfo(r.status, currentLang);

    const elId = document.getElementById('sticky-ref-id');
    const elCust = document.getElementById('sticky-customer-name');
    const elBkg = document.getElementById('sticky-booking-id');
    const elComp = document.getElementById('sticky-company-name');
    const elSource = document.getElementById('sticky-source-badge');
    const elStatus = document.getElementById('sticky-status-badge');
    const elDate = document.getElementById('sticky-created-date');
    const actionsContainer = document.getElementById('ref-sticky-action-buttons');

    if (elId) elId.textContent = r.id;
    if (elCust) elCust.textContent = currentLang === 'ar' ? r.customer_name_ar : r.customer_name_en;
    if (elBkg) elBkg.textContent = r.booking_id;
    if (elComp) elComp.textContent = currentLang === 'ar' ? r.company_name_ar : r.company_name_en;
    if (elSource) {
      elSource.innerHTML = `<span class="ref-status-pill status-pill-navy">${currentLang === 'ar' ? r.source_ar : r.source_en}</span>`;
    }
    if (elStatus) {
      elStatus.innerHTML = `<span class="ref-status-pill ${pill.pillClass}">${currentLang === 'ar' ? pill.ar : pill.en}</span>`;
    }
    if (elDate) elDate.textContent = r.request_date;

    // Build Contextual Buttons
    if (actionsContainer) {
      let btnsHtml = '';

      if (r.status === 'under_review' && r.financials.requested_exceeds_limit) {
        btnsHtml += `
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-adjust">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span>${currentLang === 'ar' ? 'تعديل المبلغ المطلوب' : 'Adjust Amount'}</span>
          </button>
        `;
      } else if (r.status === 'refund_requested' || r.status === 'under_review') {
        btnsHtml += `
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-approve-accounts">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${currentLang === 'ar' ? 'اعتماد الحسابات وإحالة للأدمن' : 'Approve to Admin'}</span>
          </button>
        `;
      } else if (r.status === 'pending_admin_approval') {
        btnsHtml += `
          <button type="button" class="btn btn-secondary btn-sm" id="btn-sticky-return-admin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
            <span>${currentLang === 'ar' ? 'إعادة للمراجعة (أدمن)' : 'Return for Review'}</span>
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-approve-admin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>${currentLang === 'ar' ? 'اعتماد الصرف النهائي (أدمن)' : 'Admin Authorize Payout'}</span>
          </button>
        `;
      } else if (r.status === 'returned_for_review') {
        btnsHtml += `
          <button type="button" class="btn btn-secondary btn-sm" id="btn-sticky-adjust">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span>${currentLang === 'ar' ? 'تعديل وتصحيح المبلغ' : 'Adjust Amount'}</span>
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-resubmit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${currentLang === 'ar' ? 'إعادة الإرسال للاعتماد' : 'Resubmit to Admin'}</span>
          </button>
        `;
      } else if (r.status === 'approved_for_refund' || r.status === 'partially_refunded') {
        btnsHtml += `
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-record-trf">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>${currentLang === 'ar' ? 'تسجيل تحويل مالي' : 'Record Transfer'}</span>
          </button>
        `;
      } else if (r.status === 'awaiting_customer_confirmation') {
        btnsHtml += `
          <button type="button" class="btn btn-secondary btn-sm" id="btn-sticky-open-dispute">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>${currentLang === 'ar' ? 'فتح نزاع مالي' : 'Open Dispute'}</span>
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-confirm-receipt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${currentLang === 'ar' ? 'تسجيل تأكيد استلام العميل' : 'Confirm Customer Receipt'}</span>
          </button>
        `;
      } else if (r.status === 'refund_dispute') {
        btnsHtml += `
          <button type="button" class="btn btn-primary btn-sm" id="btn-sticky-resolve-dispute">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>${currentLang === 'ar' ? 'تسوية وحل النزاع المالي' : 'Resolve Dispute'}</span>
          </button>
        `;
      } else if (r.status === 'refund_completed') {
        btnsHtml += `
          <span class="ref-status-pill status-pill-navy" style="padding: 6px 12px; font-size: 0.80rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${currentLang === 'ar' ? 'تمت التسوية والاسترداد بالكامل' : 'Refund Fully Settled & Closed'}</span>
          </span>
        `;
      }

      actionsContainer.innerHTML = btnsHtml;
      attachStickyActionHandlers();
    }
  }

  // 8-Stage Stepper
  function renderStepper() {
    if (!currentRefund) return;
    const container = document.getElementById('ref-stepper-container');
    if (!container) return;

    const stages = [
      { key: 'refund_requested', ar: 'طلب الاسترداد', en: 'Requested' },
      { key: 'under_review', ar: 'التدقيق المحاسبي', en: 'Under Review' },
      { key: 'accounts_approved', ar: 'اعتماد الحسابات', en: 'Accounts Approved' },
      { key: 'pending_admin_approval', ar: 'اعتماد الإدارة', en: 'Admin Approval' },
      { key: 'approved_for_refund', ar: 'التصديق للصرف', en: 'Approved for Payout' },
      { key: 'partially_refunded', ar: 'تنفيذ التحويل', en: 'Disbursement' },
      { key: 'awaiting_customer_confirmation', ar: 'تأكيد العميل', en: 'Customer Confirm' },
      { key: 'refund_completed', ar: 'اكتمال التسوية', en: 'Completed' }
    ];

    const statusWeights = {
      refund_requested: 1,
      under_review: 2,
      returned_for_review: 2,
      accounts_approved: 3,
      pending_admin_approval: 4,
      approved_for_refund: 5,
      refund_processing: 6,
      partially_refunded: 6,
      awaiting_customer_confirmation: 7,
      refund_dispute: 7,
      refund_completed: 8
    };

    const currentWeight = statusWeights[currentRefund.status] || 1;

    const html = stages.map((st, idx) => {
      const stepNum = idx + 1;
      let stateClass = '';
      if (stepNum < currentWeight) {
        stateClass = 'is-done';
      } else if (stepNum === currentWeight) {
        stateClass = 'is-current';
        if (currentRefund.status === 'returned_for_review') stateClass += ' is-returned';
        if (currentRefund.status === 'refund_dispute') stateClass += ' is-dispute';
      } else {
        stateClass = 'is-pending';
      }

      const label = currentLang === 'ar' ? st.ar : st.en;
      const circleContent = stateClass.includes('is-done')
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : formatNumber(stepNum);

      return `
        <div class="ref-stepper-step ${stateClass}">
          <div class="ref-stepper-circle">${circleContent}</div>
          <span class="ref-stepper-label">${label}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  // Render Current Action Panel (Adaptive Box in Tab 1)
  function renderActionBox() {
    if (!currentRefund) return;
    const box = document.getElementById('ref-current-action-box');
    if (!box) return;
    const r = currentRefund;

    let html = '';

    if (r.status === 'under_review' && r.financials.requested_exceeds_limit) {
      html = `
        <div class="ref-action-box-inner">
          <div>
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="ref-status-pill status-pill-amber">${currentLang === 'ar' ? 'تنبيه تدقيق مالي' : 'Audit Notice'}</span>
              <h3 class="ref-action-box-title" style="color: var(--color-warning);">${currentLang === 'ar' ? 'المبلغ المطلوب يتجاوز الحد الأقصى للمدفوعات المعتمدة' : 'Requested Amount Exceeds Eligible Approved Payments'}</h3>
            </div>
            <p class="ref-action-box-desc">
              ${currentLang === 'ar' 
                ? `طلب العميل ${formatCurrency(r.financials.requested_amount)} بينما إجمالي المدفوعات المعتمدة دفترياً ${formatCurrency(r.financials.max_refundable_limit)}. يجب تعديل المبلغ المطلوب بذكر سبب إلزامي قبل الاعتماد.`
                : `Customer requested ${formatCurrency(r.financials.requested_amount)} while verified approved funds total ${formatCurrency(r.financials.max_refundable_limit)}. Adjust the amount with a mandatory reason.`}
            </p>
          </div>
          <div class="ref-action-box-btns">
            <button type="button" class="btn btn-primary btn-sm" id="btn-box-adjust">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>${currentLang === 'ar' ? 'تعديل المبلغ إلى الحد المسموح' : 'Adjust Amount to Eligible Limit'}</span>
            </button>
          </div>
        </div>
      `;
    } else if (r.status === 'returned_for_review') {
      const reason = r.admin_return ? (currentLang === 'ar' ? r.admin_return.reason_ar : r.admin_return.reason_en) : 'تدقيق تذاكر الطيران';
      html = `
        <div class="ref-action-box-inner">
          <div>
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="ref-status-pill status-pill-slate">${currentLang === 'ar' ? 'مُعاد للمراجعة من الإدارة' : 'Returned by Admin'}</span>
              <h3 class="ref-action-box-title">${currentLang === 'ar' ? 'توجيهات مدير الحسابات العام:' : 'Admin Return Instructions:'}</h3>
            </div>
            <p class="ref-action-box-desc" style="font-weight: 600; color: var(--color-text); margin-top: 6px;">"${reason}"</p>
          </div>
          <div class="ref-action-box-btns">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-box-adjust">
              <span>${currentLang === 'ar' ? 'تعديل المبلغ' : 'Adjust Amount'}</span>
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-box-resubmit">
              <span>${currentLang === 'ar' ? 'إعادة الإرسال بعد المراجعة' : 'Resubmit After Review'}</span>
            </button>
          </div>
        </div>
      `;
    } else if (r.status === 'pending_admin_approval') {
      html = `
        <div class="ref-action-box-inner">
          <div>
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="ref-status-pill status-pill-amber">${currentLang === 'ar' ? 'بانتظار توقيع الإدارة' : 'Pending Admin Signature'}</span>
              <h3 class="ref-action-box-title">${currentLang === 'ar' ? 'تم تدقيق الحسابات واقتراح الاسترداد بمبلغ ' + formatCurrency(r.financials.approved_amount) : 'Audited and Recommended for ' + formatCurrency(r.financials.approved_amount)}</h3>
            </div>
            <p class="ref-action-box-desc">
              ${currentLang === 'ar'
                ? 'يتطلب هذا الطلب تصديق مدير الحسابات العام (Admin) قبل إتاحة تنفيذ أوامر التحويل البنكي أو المحافظ الإلكترونية.'
                : 'This request requires General Accounts Admin authorization before transfer execution can be initiated.'}
            </p>
          </div>
          <div class="ref-action-box-btns">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-box-return-admin">
              <span>${currentLang === 'ar' ? 'إعادة الطلب لموظف الحسابات' : 'Return for Review'}</span>
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-box-approve-admin">
              <span>${currentLang === 'ar' ? 'اعتماد الصرف (أدمن)' : 'Admin Authorize Payout'}</span>
            </button>
          </div>
        </div>
      `;
    } else if (r.status === 'approved_for_refund' || r.status === 'partially_refunded') {
      html = `
        <div class="ref-action-box-inner">
          <div>
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="ref-status-pill status-pill-navy">${currentLang === 'ar' ? 'معتمد للصرف المالي' : 'Authorized for Payout'}</span>
              <h3 class="ref-action-box-title">${currentLang === 'ar' ? 'المبلغ المتبقي للتحويل: ' + formatCurrency(r.financials.remaining_to_refund) : 'Remaining to Disburse: ' + formatCurrency(r.financials.remaining_to_refund)}</h3>
            </div>
            <p class="ref-action-box-desc">
              ${currentLang === 'ar'
                ? 'يمكن صرف المبلغ عبر حوالة بنكية أو إنستاباي أو محافظ إلكترونية، دفعة واحدة أو على دفعات متعددة بحسب السيولة.'
                : 'Disburse via Bank Wire, InstaPay, or E-Wallets in single or split transfers.'}
            </p>
          </div>
          <div class="ref-action-box-btns">
            <button type="button" class="btn btn-primary btn-sm" id="btn-box-record-trf">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>${currentLang === 'ar' ? 'تسجيل تحويل مالي لصالح العميل' : 'Record Transfer Execution'}</span>
            </button>
          </div>
        </div>
      `;
    } else if (r.status === 'awaiting_customer_confirmation') {
      html = `
        <div class="ref-action-box-inner">
          <div>
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="ref-status-pill status-pill-amber">${currentLang === 'ar' ? 'المرحلة الأولى مكتملة' : 'Stage 1 Completed'}</span>
              <h3 class="ref-action-box-title">${currentLang === 'ar' ? 'تم تحويل كامل المبلغ وبانتظار تأكيد استلام العميل (المرحلة الثانية)' : 'Transferred in Full; Awaiting Customer Confirmation (Stage 2)'}</h3>
            </div>
            <p class="ref-action-box-desc">
              ${currentLang === 'ar'
                ? 'الطلب يظل مفتوحاً ولا يتم اعتباره مكتملاً إلا بعد تأكيد المعتمر استلام الحوالة في حسابه البنكي/محفظته.'
                : 'Request remains open until customer acknowledges receipt. Automatic reminders are active.'}
            </p>
          </div>
          <div class="ref-action-box-btns">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-box-reminder">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span>${currentLang === 'ar' ? 'إرسال تذكير آلي' : 'Trigger Reminder'}</span>
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-box-confirm-receipt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${currentLang === 'ar' ? 'تسجيل تأكيد الاستلام' : 'Confirm Customer Receipt'}</span>
            </button>
          </div>
        </div>
      `;
    } else if (r.status === 'refund_dispute') {
      html = `
        <div class="ref-action-box-inner">
          <div>
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="ref-status-pill status-pill-slate">${currentLang === 'ar' ? 'نزاع مالي قيد التحقيق' : 'Active Financial Dispute'}</span>
              <h3 class="ref-action-box-title" style="color: var(--color-accent);">${currentLang === 'ar' ? 'الطلب مقفل وموقوف من الإغلاق لحين التحقيق في تفاوت المبلغ' : 'Closure Auto-Locked Pending Discrepancy Resolution'}</h3>
            </div>
            <p class="ref-action-box-desc">
              ${r.dispute ? (currentLang === 'ar' ? r.dispute.dispute_reason_ar : r.dispute.dispute_reason_en) : ''}
            </p>
          </div>
          <div class="ref-action-box-btns">
            <button type="button" class="btn btn-primary btn-sm" id="btn-box-resolve-dispute">
              <span>${currentLang === 'ar' ? 'تسوية وحل النزاع المالي' : 'Resolve Dispute'}</span>
            </button>
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="ref-action-box-inner">
          <div>
            <h3 class="ref-action-box-title">${currentLang === 'ar' ? 'حالة الطلب: ' + r.status_ar : 'Status: ' + r.status_en}</h3>
            <p class="ref-action-box-desc">${currentLang === 'ar' ? 'كافة العمليات المالية مطابقة دفترياً وموثقة في سجل التدقيق.' : 'All financial transactions are audited and permanently logged.'}</p>
          </div>
        </div>
      `;
    }

    box.innerHTML = html;
    attachBoxActionHandlers();
  }

  // Populate Tab 1: Overview KPIs
  function renderOverviewTab() {
    if (!currentRefund) return;
    const fin = currentRefund.financials;

    const elProg = document.getElementById('det-kpi-prog-total');
    const elElig = document.getElementById('det-kpi-eligible-paid');
    const elFee = document.getElementById('det-kpi-policy-fee');
    const elMax = document.getElementById('det-kpi-max-limit');
    const elAppr = document.getElementById('det-kpi-approved-amt');
    const elRem = document.getElementById('det-kpi-remaining-transfer');

    if (elProg) elProg.textContent = formatCurrency(fin.booking_total);
    if (elElig) elElig.textContent = formatCurrency(fin.eligible_approved_payments);
    if (elFee) elFee.textContent = formatCurrency(fin.policy_deduction);
    if (elMax) elMax.textContent = formatCurrency(fin.max_refundable_limit);
    if (elAppr) {
      elAppr.textContent = fin.approved_amount !== null
        ? formatCurrency(fin.approved_amount)
        : (currentLang === 'ar' ? 'قيد التدقيق' : 'Pending');
    }
    if (elRem) elRem.textContent = formatCurrency(fin.remaining_to_refund);
  }

  // Populate Tab 2: Booking & Customer
  function renderBookingCustomerTab() {
    if (!currentRefund) return;
    const r = currentRefund;
    const b = r.booking;

    document.getElementById('det-cust-name').textContent = currentLang === 'ar' ? r.customer_name_ar : r.customer_name_en;
    document.getElementById('det-cust-id').textContent = r.customer_id;
    document.getElementById('det-cust-phone').textContent = r.customer_phone;
    document.getElementById('det-cust-email').textContent = r.customer_email;
    document.getElementById('det-cust-national-id').textContent = r.customer_national_id;

    document.getElementById('det-bkg-id').textContent = r.booking_id;
    document.getElementById('det-bkg-program').textContent = currentLang === 'ar' ? b.program_ar : b.program_en;
    document.getElementById('det-bkg-company').textContent = currentLang === 'ar' ? r.company_name_ar : r.company_name_en;
    document.getElementById('det-bkg-room').textContent = currentLang === 'ar' ? b.room_type_ar : b.room_type_en;
    document.getElementById('det-bkg-travelers').textContent = formatNumber(b.travelers_count);
    document.getElementById('det-bkg-dates').textContent = `${b.departure_date} → ${b.return_date}`;

    // Payment Audit Table
    const tbody = document.getElementById('tbody-booking-payments');
    if (tbody) {
      const payments = [
        {
          id: 'TXN-0981',
          date: '2026-10-15',
          method_ar: 'تحويل بنكي CIB',
          method_en: 'Bank Wire (CIB)',
          amount: r.financials.eligible_approved_payments,
          status_ar: 'معتمد دفترياً ومطابق',
          status_en: 'Approved & Reconciled',
          eligible: true
        }
      ];

      if (r.financials.pending_payments > 0) {
        payments.push({
          id: 'TXN-0994',
          date: '2026-11-01',
          method_ar: 'إيداع نقدي فرع بنك مصر',
          method_en: 'Cash Deposit Banque Misr',
          amount: r.financials.pending_payments,
          status_ar: 'معلق قيد المطابقة البنكية',
          status_en: 'Pending Bank Reconciliation',
          eligible: false
        });
      }

      tbody.innerHTML = payments.map(p => `
        <tr>
          <td style="font-family: var(--font-mono, monospace); font-size: 0.78rem;">${p.id}</td>
          <td style="font-variant-numeric: tabular-nums;">${p.date}</td>
          <td>${currentLang === 'ar' ? p.method_ar : p.method_en}</td>
          <td class="ref-col-num">${formatCurrency(p.amount)}</td>
          <td>
            <span class="ref-status-pill ${p.eligible ? 'status-pill-navy' : 'status-pill-amber'}">
              ${currentLang === 'ar' ? p.status_ar : p.status_en}
            </span>
          </td>
          <td>
            <span style="font-weight: 600; font-size: 0.76rem; color: ${p.eligible ? 'var(--color-primary)' : 'var(--color-warning)'};">
              ${p.eligible 
                ? (currentLang === 'ar' ? '✓ مؤهل للاحتساب' : '✓ Counted in Limit') 
                : (currentLang === 'ar' ? '✗ مستبعد (غير معتمد)' : '✗ Excluded (Unverified)')}
            </span>
          </td>
        </tr>
      `).join('');
    }
  }

  // Populate Tab 3: Cancellation Details & Attachments
  function renderCancellationTab() {
    if (!currentRefund) return;
    const c = currentRefund.cancellation;

    document.getElementById('det-can-id').textContent = c.id;
    document.getElementById('det-can-date').textContent = c.date;
    document.getElementById('det-can-policy').textContent = currentLang === 'ar' ? c.policy_type_ar : c.policy_type_en;
    document.getElementById('det-can-fee').textContent = formatCurrency(c.deduction_fee);
    document.getElementById('det-can-reason').textContent = currentLang === 'ar' ? c.reason_ar : c.reason_en;

    const attachContainer = document.getElementById('det-can-attachments');
    const badgeAttach = document.getElementById('badge-tab-attachments');
    if (badgeAttach) badgeAttach.textContent = formatNumber(c.attachments ? c.attachments.length : 0);

    if (attachContainer && c.attachments) {
      attachContainer.innerHTML = c.attachments.map(att => `
        <div class="ref-attachment-card">
          <div class="ref-attachment-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="ref-attachment-info">
            <span class="ref-attachment-name">${currentLang === 'ar' ? att.name_ar : att.name_en}</span>
            <span class="ref-attachment-meta">${att.size} • PDF Document</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="alert('${currentLang === 'ar' ? 'معاينة المستند: ' + att.name_ar : 'Previewing document: ' + att.name_en}')">
            <span>${currentLang === 'ar' ? 'معاينة' : 'View'}</span>
          </button>
        </div>
      `).join('');
    }
  }

  // Populate Tab 4: Financial Summary & Adjustment
  function renderFinancialSummaryTab() {
    if (!currentRefund) return;
    const fin = currentRefund.financials;

    document.getElementById('ledger-prog-total').textContent = formatCurrency(fin.booking_total);
    document.getElementById('ledger-eligible-payments').textContent = formatCurrency(fin.eligible_approved_payments);
    document.getElementById('ledger-pending-payments').textContent = formatCurrency(fin.pending_payments || 0);
    document.getElementById('ledger-policy-fee').textContent = formatCurrency(fin.policy_deduction);
    document.getElementById('ledger-prev-refunds').textContent = formatCurrency(fin.previous_refunds || 0);
    document.getElementById('ledger-max-limit').textContent = formatCurrency(fin.max_refundable_limit);
    document.getElementById('ledger-requested-amt').textContent = formatCurrency(fin.requested_amount);
    document.getElementById('ledger-approved-amt').textContent = fin.approved_amount !== null ? formatCurrency(fin.approved_amount) : (currentLang === 'ar' ? 'قيد المراجعة' : 'Pending');
    document.getElementById('ledger-actually-disbursed').textContent = formatCurrency(fin.actually_refunded || 0);
    document.getElementById('ledger-remaining-to-refund').textContent = formatCurrency(fin.remaining_to_refund);

    // Adjustment Panel
    const adjPanel = document.getElementById('ref-adjustment-panel');
    if (adjPanel) {
      if (fin.adjustment) {
        adjPanel.innerHTML = `
          <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: 8px; padding: 14px 16px;">
            <div style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 8px;">
              <span class="ref-status-pill status-pill-navy">${currentLang === 'ar' ? 'تعديل مالي مسجل' : 'Recorded Financial Adjustment'}</span>
              <span style="font-size: 0.74rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums;">${fin.adjustment.timestamp}</span>
            </div>
            <p style="margin: 4px 0; font-size: 0.82rem;">
              <strong>${currentLang === 'ar' ? 'المبلغ الأصلي:' : 'Original:'}</strong> ${formatCurrency(fin.adjustment.original_amount)} → 
              <strong>${currentLang === 'ar' ? 'المعدل المعتمد:' : 'Adjusted:'}</strong> ${formatCurrency(fin.adjustment.adjusted_amount)}
            </p>
            <p style="margin: 4px 0; font-size: 0.80rem; color: var(--color-text-muted);">
              <strong>${currentLang === 'ar' ? 'السبب المحاسبي:' : 'Reason:'}</strong> ${currentLang === 'ar' ? fin.adjustment.reason_ar : fin.adjustment.reason_en}
            </p>
            <p style="margin: 4px 0; font-size: 0.76rem; color: var(--color-text-muted);">
              <strong>${currentLang === 'ar' ? 'الموظف المسؤول:' : 'Adjusted By:'}</strong> ${currentLang === 'ar' ? fin.adjustment.employee_ar : fin.adjustment.employee_en}
            </p>
          </div>
        `;
      } else if (fin.requested_exceeds_limit) {
        adjPanel.innerHTML = `
          <div style="background: var(--color-accent-soft); border: 1.5px solid rgba(197, 161, 94, 0.5); border-radius: 8px; padding: 14px 16px;">
            <strong style="color: var(--color-warning); font-size: 0.88rem; display: block; margin-bottom: 4px;">
              ${currentLang === 'ar' ? 'مطلوب إجراء تعديل محاسبي إلزامي:' : 'Mandatory Adjustment Required:'}
            </strong>
            <p style="font-size: 0.80rem; margin: 0 0 10px 0; line-height: 1.45;">
              ${currentLang === 'ar'
                ? `المبلغ المطلوب (${formatCurrency(fin.requested_amount)}) يتجاوز رصيد المدفوعات المعتمدة دفترياً (${formatCurrency(fin.max_refundable_limit)}). يرجى إجراء التعديل للحد الأقصى المسموح وتوثيق السبب.`
                : `Requested amount (${formatCurrency(fin.requested_amount)}) exceeds verified funds (${formatCurrency(fin.max_refundable_limit)}). Please adjust to legal limit.`}
            </p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-tab-adjust">
              <span>${currentLang === 'ar' ? 'فتح نموذج التعديل المحاسبي' : 'Open Adjustment Form'}</span>
            </button>
          </div>
        `;
        const btnTabAdj = document.getElementById('btn-tab-adjust');
        if (btnTabAdj) btnTabAdj.addEventListener('click', openAdjustModal);
      } else {
        adjPanel.innerHTML = `
          <div style="font-size: 0.80rem; color: var(--color-text-muted); background: var(--color-surface-secondary); padding: 12px 14px; border-radius: 6px; border: 1px solid var(--color-border);">
            ${currentLang === 'ar' ? '✓ المبلغ المطلوب مطابق للحد الأقصى القابل للاسترداد ولا يتطلب تعديلاً.' : '✓ Requested amount conforms to eligible limit; no adjustment needed.'}
          </div>
        `;
      }
    }
  }

  // Populate Tab 5: Refund Operations
  function renderRefundOpsTab() {
    if (!currentRefund) return;
    const fin = currentRefund.financials;
    const transfers = currentRefund.transfers || [];

    const badgeTransfers = document.getElementById('badge-tab-transfers');
    if (badgeTransfers) badgeTransfers.textContent = formatNumber(transfers.length);

    document.getElementById('ops-approved-amt').textContent = fin.approved_amount !== null ? formatCurrency(fin.approved_amount) : (currentLang === 'ar' ? 'قيد الاعتماد' : 'Pending');
    document.getElementById('ops-disbursed-amt').textContent = formatCurrency(fin.actually_refunded || 0);
    document.getElementById('ops-remaining-amt').textContent = formatCurrency(fin.remaining_to_refund);

    const progressFill = document.getElementById('ops-progress-fill');
    if (progressFill && fin.approved_amount > 0) {
      const pct = Math.min(100, Math.round(((fin.actually_refunded || 0) / fin.approved_amount) * 100));
      progressFill.style.width = pct + '%';
    }

    // Transfers Table
    const tbody = document.getElementById('tbody-transfers-history');
    if (tbody) {
      if (!transfers.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 24px; color: var(--color-text-muted);">
              ${currentLang === 'ar' ? 'لم يتم تسجيل أي أوامر تحويل مالي بعد لهذا الطلب' : 'No transfer orders recorded yet'}
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = transfers.map(t => `
          <tr>
            <td style="font-family: var(--font-mono, monospace); font-weight: 700;">${t.id}</td>
            <td style="font-family: var(--font-mono, monospace); font-size: 0.78rem;">${t.transfer_ref}</td>
            <td style="font-variant-numeric: tabular-nums;">${t.date}</td>
            <td>${currentLang === 'ar' ? t.method_ar : t.method_en}</td>
            <td class="ref-col-num" style="color: var(--color-primary); font-weight: 700;">${formatCurrency(t.amount)}</td>
            <td style="font-size: 0.76rem;">${t.recipient_details}</td>
            <td style="font-size: 0.76rem;">${t.employee}</td>
            <td>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.previewReceiptSlip('${t.id}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span>${currentLang === 'ar' ? 'عرض الإشعار' : 'View Slip'}</span>
              </button>
            </td>
            <td>
              <span class="ref-status-pill ${t.customer_confirmed ? 'status-pill-navy' : 'status-pill-amber'}">
                ${t.customer_confirmed ? (currentLang === 'ar' ? '✓ تم تأكيد الاستلام' : '✓ Confirmed') : (currentLang === 'ar' ? 'بانتظار التأكيد' : 'Pending')}
              </span>
            </td>
          </tr>
        `).join('');
      }
    }

    // Two-Stage Confirmation boxes
    const s1 = document.getElementById('ref-stage-1-status');
    const s2 = document.getElementById('ref-stage-2-status');

    if (s1) {
      if (currentRefund.customer_confirmation && currentRefund.customer_confirmation.miqat_confirmed_at) {
        s1.innerHTML = `
          <span style="color: var(--color-primary); font-weight: 700;">
            ✓ ${currentLang === 'ar' ? 'تم تأكيد تحويل ميقات' : 'Miqat Transfer Confirmed'}
          </span> 
          <span style="font-size: 0.74rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums;">
            (${currentRefund.customer_confirmation.miqat_confirmed_at} - ${currentRefund.customer_confirmation.miqat_confirmed_by || 'أحمد صبري'})
          </span>
        `;
      } else {
        s1.innerHTML = `
          <span style="color: var(--color-warning); font-weight: 600;">
            ⏳ ${currentLang === 'ar' ? 'بانتظار تنفيذ التحويل المالي من الحساب' : 'Pending Transfer Execution'}
          </span>
        `;
      }
    }

    if (s2) {
      if (currentRefund.customer_confirmation && currentRefund.customer_confirmation.is_confirmed) {
        s2.innerHTML = `
          <span style="color: var(--color-primary); font-weight: 700;">
            ✓ ${currentLang === 'ar' ? 'أكد العميل الاستلام وتمت التسوية النهائية' : 'Customer Confirmed & Settled'}
          </span> 
          <span style="font-size: 0.74rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums;">
            (${currentRefund.customer_confirmation.confirmed_at})
          </span>
        `;
      } else if (fin.remaining_to_refund === 0 && transfers.length > 0) {
        s2.innerHTML = `
          <div style="display:flex; justify-content: space-between; align-items:center; flex-wrap: wrap; gap: 8px;">
            <span style="color: var(--color-warning); font-weight: 600;">
              ⏳ ${currentLang === 'ar' ? 'بانتظار تأكيد استلام المعتمر للمبلغ' : 'Awaiting Customer Confirmation'}
            </span>
            <button type="button" class="btn btn-primary btn-sm" id="btn-stage2-confirm">
              <span>${currentLang === 'ar' ? 'تسجيل تأكيد الاستلام' : 'Record Confirmation'}</span>
            </button>
          </div>
        `;
        const btnS2 = document.getElementById('btn-stage2-confirm');
        if (btnS2) btnS2.addEventListener('click', openCustomerConfirmModal);
      } else {
        s2.innerHTML = `
          <span style="color: var(--color-text-muted);">
            ${currentLang === 'ar' ? 'يتاح بعد اكتمال تنفيذ تحويل كامل المبلغ المعتمد' : 'Available after full transfer execution'}
          </span>
        `;
      }
    }

    // Reminders & Disputes Panel
    const remPanel = document.getElementById('ref-reminders-panel');
    if (remPanel) {
      const rem = currentRefund.automated_reminders;
      const disp = currentRefund.dispute;

      let rHtml = '';
      if (disp && disp.is_disputed) {
        rHtml += `
          <div style="background: var(--color-surface); border: 1.5px solid var(--color-accent); border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
            <strong style="color: var(--color-accent); display: block; margin-bottom: 4px;">
              ⚠️ ${currentLang === 'ar' ? 'ملف نزاع مالي نشط (' + disp.dispute_id + ')' : 'Active Dispute (' + disp.dispute_id + ')'}
            </strong>
            <p style="font-size: 0.78rem; margin: 4px 0;">${currentLang === 'ar' ? disp.dispute_reason_ar : disp.dispute_reason_en}</p>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 8px;" id="btn-panel-resolve-dispute">
              <span>${currentLang === 'ar' ? 'تسوية وحل النزاع' : 'Resolve Dispute'}</span>
            </button>
          </div>
        `;
      } else {
        rHtml += `
          <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
            <div style="display:flex; justify-content: space-between; align-items:center;">
              <strong style="font-size: 0.82rem;">${currentLang === 'ar' ? 'التذكيرات الآلية لتأكيد الاستلام' : 'Automated Receipt Reminders'}</strong>
              <span class="ref-status-pill ${rem && rem.is_active ? 'status-pill-navy' : 'status-pill-slate'}">
                ${rem && rem.is_active ? (currentLang === 'ar' ? 'مفعلة' : 'Active') : (currentLang === 'ar' ? 'غير مفعلة' : 'Inactive')}
              </span>
            </div>
            <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 6px 0 10px 0;">
              ${rem && rem.is_active 
                ? (currentLang === 'ar' ? `تذكير آلي كل ${rem.interval_hours} ساعة. تم إرسال ${rem.reminders_sent_count} إشعار حتى الآن.` : `Reminder every ${rem.interval_hours}h. Sent ${rem.reminders_sent_count} reminders.`)
                : (currentLang === 'ar' ? 'يمكن جدولة تذكير دوري للعميل عبر الرسائل القصيرة والتطبيق.' : 'Configure periodic SMS/App reminder for customer receipt.')}
            </p>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-panel-schedule-rem">
              <span>${currentLang === 'ar' ? 'جدولة تذكير آلي' : 'Schedule Reminder'}</span>
            </button>
          </div>
        `;
      }

      remPanel.innerHTML = rHtml;

      const btnSch = document.getElementById('btn-panel-schedule-rem');
      if (btnSch) btnSch.addEventListener('click', scheduleReminderAction);

      const btnRes = document.getElementById('btn-panel-resolve-dispute');
      if (btnRes) btnRes.addEventListener('click', resolveDisputeAction);
    }
  }

  // Populate Tab 6: Activity Log & Audit Trail
  function renderActivityLogTab() {
    if (!currentRefund) return;
    const timeline = document.getElementById('ref-timeline-container');
    if (!timeline) return;

    const logs = currentRefund.activity_log || [];
    if (!logs.length) {
      timeline.innerHTML = `<p style="color: var(--color-text-muted); font-size: 0.82rem;">${currentLang === 'ar' ? 'لا توجد سجلات نشاط' : 'No activity records'}</p>`;
      return;
    }

    timeline.innerHTML = logs.map(log => {
      const actor = currentLang === 'ar' ? log.actor_ar : log.actor_en;
      const role = currentLang === 'ar' ? log.role_ar : log.role_en;
      const title = currentLang === 'ar' ? log.title_ar : log.title_en;
      const desc = currentLang === 'ar' ? log.desc_ar : log.desc_en;

      return `
        <div class="ref-timeline-item">
          <div class="ref-timeline-marker"></div>
          <div class="ref-timeline-content">
            <div class="ref-timeline-header">
              <span class="ref-timeline-actor">${actor} <span style="font-weight: 400; color: var(--color-text-muted);">(${role})</span></span>
              <span class="ref-timeline-time">${log.timestamp}</span>
            </div>
            <h4 class="ref-timeline-title">${title}</h4>
            <p class="ref-timeline-desc">${desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Preview Receipt Slip Modal
  window.previewReceiptSlip = function (transferId) {
    if (!currentRefund) return;
    const t = (currentRefund.transfers || []).find(x => x.id === transferId);
    if (!t) return;

    const slipContainer = document.getElementById('rendered-receipt-slip');
    const modal = document.getElementById('modal-receipt-slip-preview');
    const backdrop = document.getElementById('ref-modal-backdrop');
    if (!slipContainer || !modal) return;

    slipContainer.innerHTML = `
      <div class="acc-receipt-slip-header">
        <div class="acc-receipt-bank-title">منصة ميقات للحسابات المالية</div>
        <div class="acc-receipt-date">${t.date}</div>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'رقم الإشعار المرجعي:' : 'Reference ID:'}</span>
        <span class="acc-receipt-val"><code>${t.transfer_ref}</code></span>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'رقم طلب الاسترداد:' : 'Refund Request:'}</span>
        <span class="acc-receipt-val">${currentRefund.id}</span>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'المستفيد / العميل:' : 'Beneficiary:'}</span>
        <span class="acc-receipt-val">${t.recipient_name}</span>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'طريقة التحويل والصرف:' : 'Method:'}</span>
        <span class="acc-receipt-val">${currentLang === 'ar' ? t.method_ar : t.method_en}</span>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'بيانات الحساب / المحفظة:' : 'Destination:'}</span>
        <span class="acc-receipt-val">${t.recipient_details}</span>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'المبلغ المحول:' : 'Disbursed Amount:'}</span>
        <span class="acc-receipt-val highlight">${formatCurrency(t.amount)}</span>
      </div>
      <div class="acc-receipt-row">
        <span class="acc-receipt-label">${currentLang === 'ar' ? 'الموظف المسؤول:' : 'Dispatched By:'}</span>
        <span class="acc-receipt-val">${t.employee}</span>
      </div>
      <div class="acc-receipt-footer">
        ✓ ${currentLang === 'ar' ? 'تحويل مالي رسمي معتمد ومقاص دفترياً' : 'Official Authorized & Cleared Bank Transfer'}
      </div>
    `;

    modal.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
  };

  // Close Modals
  function closeAllModals() {
    const modals = document.querySelectorAll('.acc-modal-backdrop');
    modals.forEach(m => m.style.display = 'none');
    const backdrop = document.getElementById('ref-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  // Open Record Transfer Modal
  function openRecordTransferModal() {
    if (!currentRefund) return;
    if (currentRefund.status !== 'approved_for_refund' && currentRefund.status !== 'partially_refunded') {
      alert(currentLang === 'ar' ? 'لا يمكن تنفيذ التحويل قبل صدور اعتماد مدير الحسابات (Admin) أولاً' : 'Transfer execution is locked until Admin approval');
      return;
    }

    const modal = document.getElementById('modal-record-transfer');
    const backdrop = document.getElementById('ref-modal-backdrop');
    const inputAmount = document.getElementById('trf-input-amount');
    const hintRemaining = document.getElementById('trf-hint-remaining');
    const inputRecipient = document.getElementById('trf-input-recipient');

    const remaining = currentRefund.financials.remaining_to_refund;
    if (inputAmount) {
      inputAmount.value = remaining;
      inputAmount.max = remaining;
    }
    if (hintRemaining) {
      hintRemaining.textContent = (currentLang === 'ar' ? 'الحد الأقصى المتاح للتحويل: ' : 'Max transfer limit: ') + formatCurrency(remaining);
    }
    if (inputRecipient) {
      inputRecipient.value = currentRefund.customer_name_ar + ' (' + currentRefund.customer_phone + ')';
    }

    if (modal) modal.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
  }

  // Open Adjustment Modal
  function openAdjustModal() {
    if (!currentRefund) return;
    const modal = document.getElementById('modal-adjust-amount');
    const backdrop = document.getElementById('ref-modal-backdrop');
    const inputOrig = document.getElementById('adjust-input-original');
    const inputLimit = document.getElementById('adjust-input-limit');
    const inputNew = document.getElementById('adjust-input-new');
    const inputReason = document.getElementById('adjust-input-reason');

    if (inputOrig) inputOrig.value = formatCurrency(currentRefund.financials.requested_amount);
    if (inputLimit) inputLimit.value = formatCurrency(currentRefund.financials.max_refundable_limit);
    if (inputNew) {
      inputNew.value = currentRefund.financials.max_refundable_limit;
      inputNew.max = currentRefund.financials.max_refundable_limit;
    }
    if (inputReason) inputReason.value = '';

    if (modal) modal.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
  }

  // Open Admin Return Modal
  function openAdminReturnModal() {
    const modal = document.getElementById('modal-admin-return');
    const backdrop = document.getElementById('ref-modal-backdrop');
    const reasonInput = document.getElementById('return-input-reason');
    if (reasonInput) reasonInput.value = '';

    if (modal) modal.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
  }

  // Open Customer Confirm Modal
  function openCustomerConfirmModal() {
    const modal = document.getElementById('modal-customer-confirm');
    const backdrop = document.getElementById('ref-modal-backdrop');
    if (modal) modal.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
  }

  // Open Dispute Modal
  function openDisputeModal() {
    const modal = document.getElementById('modal-open-dispute');
    const backdrop = document.getElementById('ref-modal-backdrop');
    if (modal) modal.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
  }

  // Schedule Reminder Action
  function scheduleReminderAction() {
    if (!currentRefund || !window.AccountsMockData) return;
    window.AccountsMockData.scheduleRefundReminder(currentRefund.id, { interval_hours: 24 });
    refreshAllViews();
    alert(currentLang === 'ar' ? 'تمت جدولة تذكير آلي للعميل كل ٢٤ ساعة لتأكيد الاستلام' : 'Automated reminder scheduled every 24h for customer receipt');
  }

  // Resolve Dispute Action
  function resolveDisputeAction() {
    if (!currentRefund || !window.AccountsMockData) return;
    const note = prompt(currentLang === 'ar' ? 'أدخل تفاصيل تسوية النزاع مع البنك والعميل:' : 'Enter dispute resolution details:');
    if (note && note.trim()) {
      window.AccountsMockData.resolveRefundDispute(currentRefund.id, { notes_ar: note.trim(), notes_en: note.trim() });
      refreshAllViews();
    }
  }

  // Sticky Action Handlers
  function attachStickyActionHandlers() {
    const btnAdj = document.getElementById('btn-sticky-adjust');
    if (btnAdj) btnAdj.addEventListener('click', openAdjustModal);

    const btnApprAcc = document.getElementById('btn-sticky-approve-accounts');
    if (btnApprAcc) {
      btnApprAcc.addEventListener('click', function () {
        if (!currentRefund || !window.AccountsMockData) return;
        window.AccountsMockData.accountsApproveRefund(currentRefund.id);
        refreshAllViews();
      });
    }

    const btnApprAdm = document.getElementById('btn-sticky-approve-admin');
    if (btnApprAdm) {
      btnApprAdm.addEventListener('click', function () {
        if (!currentRefund || !window.AccountsMockData) return;
        window.AccountsMockData.adminApproveRefund(currentRefund.id);
        refreshAllViews();
      });
    }

    const btnRetAdm = document.getElementById('btn-sticky-return-admin');
    if (btnRetAdm) btnRetAdm.addEventListener('click', openAdminReturnModal);

    const btnResubmit = document.getElementById('btn-sticky-resubmit');
    if (btnResubmit) {
      btnResubmit.addEventListener('click', function () {
        if (!currentRefund || !window.AccountsMockData) return;
        window.AccountsMockData.accountsApproveRefund(currentRefund.id);
        refreshAllViews();
      });
    }

    const btnTrf = document.getElementById('btn-sticky-record-trf');
    if (btnTrf) btnTrf.addEventListener('click', openRecordTransferModal);

    const btnConf = document.getElementById('btn-sticky-confirm-receipt');
    if (btnConf) btnConf.addEventListener('click', openCustomerConfirmModal);

    const btnDisp = document.getElementById('btn-sticky-open-dispute');
    if (btnDisp) btnDisp.addEventListener('click', openDisputeModal);

    const btnResDisp = document.getElementById('btn-sticky-resolve-dispute');
    if (btnResDisp) btnResDisp.addEventListener('click', resolveDisputeAction);
  }

  // Action Box Handlers
  function attachBoxActionHandlers() {
    const btnBoxAdj = document.getElementById('btn-box-adjust');
    if (btnBoxAdj) btnBoxAdj.addEventListener('click', openAdjustModal);

    const btnBoxResub = document.getElementById('btn-box-resubmit');
    if (btnBoxResub) {
      btnBoxResub.addEventListener('click', function () {
        if (!currentRefund || !window.AccountsMockData) return;
        window.AccountsMockData.accountsApproveRefund(currentRefund.id);
        refreshAllViews();
      });
    }

    const btnBoxApprAdm = document.getElementById('btn-box-approve-admin');
    if (btnBoxApprAdm) {
      btnBoxApprAdm.addEventListener('click', function () {
        if (!currentRefund || !window.AccountsMockData) return;
        window.AccountsMockData.adminApproveRefund(currentRefund.id);
        refreshAllViews();
      });
    }

    const btnBoxRetAdm = document.getElementById('btn-box-return-admin');
    if (btnBoxRetAdm) btnBoxRetAdm.addEventListener('click', openAdminReturnModal);

    const btnBoxTrf = document.getElementById('btn-box-record-trf');
    if (btnBoxTrf) btnBoxTrf.addEventListener('click', openRecordTransferModal);

    const btnBoxConf = document.getElementById('btn-box-confirm-receipt');
    if (btnBoxConf) btnBoxConf.addEventListener('click', openCustomerConfirmModal);

    const btnBoxRem = document.getElementById('btn-box-reminder');
    if (btnBoxRem) btnBoxRem.addEventListener('click', scheduleReminderAction);

    const btnBoxResDisp = document.getElementById('btn-box-resolve-dispute');
    if (btnBoxResDisp) btnBoxResDisp.addEventListener('click', resolveDisputeAction);
  }

  // Refresh All Tabs and Components
  function refreshAllViews() {
    if (!currentRefund || !window.AccountsMockData) return;
    currentRefund = window.AccountsMockData.getRefundDetails(currentRefund.id);
    renderStickyHeader();
    renderOverviewTab();
    renderStepper();
    renderActionBox();
    renderBookingCustomerTab();
    renderCancellationTab();
    renderFinancialSummaryTab();
    renderRefundOpsTab();
    renderActivityLogTab();
  }

  // Setup Form Handlers
  function setupForms() {
    // Record Transfer Form
    const formTrf = document.getElementById('form-record-transfer');
    if (formTrf) {
      formTrf.addEventListener('submit', function (e) {
        e.preventDefault();
        const amt = Number(document.getElementById('trf-input-amount').value);
        const method = document.getElementById('trf-select-method').value;
        const refNum = document.getElementById('trf-input-ref').value;
        const recipient = document.getElementById('trf-input-recipient').value;
        const notes = document.getElementById('trf-input-notes').value;

        const res = window.AccountsMockData.recordRefundTransfer(currentRefund.id, {
          amount: amt,
          method: method,
          transfer_ref: refNum,
          recipient_details: recipient,
          notes_ar: notes,
          notes_en: notes
        });

        if (!res.success) {
          alert(res.error);
          return;
        }

        closeAllModals();
        refreshAllViews();
      });
    }

    // Adjust Amount Form
    const formAdj = document.getElementById('form-adjust-amount');
    if (formAdj) {
      formAdj.addEventListener('submit', function (e) {
        e.preventDefault();
        const newAmt = Number(document.getElementById('adjust-input-new').value);
        const reason = document.getElementById('adjust-input-reason').value;

        const res = window.AccountsMockData.adjustRefundAmount(currentRefund.id, newAmt, reason);
        if (!res.success) {
          alert(res.error);
          return;
        }

        closeAllModals();
        refreshAllViews();
      });
    }

    // Admin Return Form
    const formRet = document.getElementById('form-admin-return');
    if (formRet) {
      formRet.addEventListener('submit', function (e) {
        e.preventDefault();
        const reason = document.getElementById('return-input-reason').value;

        const res = window.AccountsMockData.adminReturnRefund(currentRefund.id, reason);
        if (!res.success) {
          alert(res.error);
          return;
        }

        closeAllModals();
        refreshAllViews();
      });
    }

    // Customer Confirm Form
    const formConf = document.getElementById('form-customer-confirm');
    if (formConf) {
      formConf.addEventListener('submit', function (e) {
        e.preventDefault();
        const channel = document.getElementById('conf-select-channel').value;
        const notes = document.getElementById('conf-input-notes').value;

        const res = window.AccountsMockData.confirmCustomerRefundReceipt(currentRefund.id, {
          channel: channel,
          notes_ar: notes,
          notes_en: notes
        });

        if (!res.success) {
          alert(res.error);
          return;
        }

        closeAllModals();
        refreshAllViews();
      });
    }

    // Open Dispute Form
    const formDisp = document.getElementById('form-open-dispute');
    if (formDisp) {
      formDisp.addEventListener('submit', function (e) {
        e.preventDefault();
        const reason = document.getElementById('disp-input-reason').value;
        const diff = Number(document.getElementById('disp-input-diff').value) || 0;

        const res = window.AccountsMockData.openRefundDispute(currentRefund.id, {
          reason_ar: reason,
          reason_en: reason,
          claimed_difference: diff
        });

        if (!res.success) {
          alert(res.error);
          return;
        }

        closeAllModals();
        refreshAllViews();
      });
    }

    // Internal Note
    const btnSaveNote = document.getElementById('btn-save-note');
    if (btnSaveNote) {
      btnSaveNote.addEventListener('click', function () {
        const input = document.getElementById('ref-note-input');
        if (!input || !input.value.trim()) return;

        const res = window.AccountsMockData.addRefundInternalNote(currentRefund.id, input.value.trim());
        if (res.success) {
          input.value = '';
          refreshAllViews();
        }
      });
    }

    // Modal close buttons
    document.getElementById('btn-close-trf-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-cancel-trf-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-close-adjust-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-cancel-adjust-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-close-return-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-cancel-return-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-close-conf-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-cancel-conf-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-close-dispute-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-cancel-dispute-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-close-slip-modal')?.addEventListener('click', closeAllModals);
    document.getElementById('btn-close-slip-btn')?.addEventListener('click', closeAllModals);

    const backdrop = document.getElementById('ref-modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeAllModals);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllModals();
    });

    const btnOpenTrf = document.getElementById('btn-open-record-transfer');
    if (btnOpenTrf) btnOpenTrf.addEventListener('click', openRecordTransferModal);
  }

  // Setup Tab Navigation
  function setupTabs() {
    const tabButtons = document.querySelectorAll('.ref-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const tabKey = btn.getAttribute('data-tab');
        if (!tabKey) return;

        activeTab = tabKey;
        tabButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const contents = document.querySelectorAll('.ref-tab-content');
        contents.forEach(sec => {
          sec.classList.remove('is-active');
          sec.style.display = 'none';
        });

        const activeSec = document.getElementById('section-tab-' + tabKey);
        if (activeSec) {
          activeSec.classList.add('is-active');
          activeSec.style.display = 'block';
        }
      });
    });
  }

  // Initialize Details Page
  function init() {
    currentLang = localStorage.getItem('miqat_lang') || 'ar';
    loadRefundRecord();
    if (!currentRefund) return;

    setupTabs();
    setupForms();
    refreshAllViews();

    if (window.AccountsWorkspace && window.AccountsWorkspace.onRefresh) {
      window.AccountsWorkspace.onRefresh(function () {
        currentLang = localStorage.getItem('miqat_lang') || 'ar';
        refreshAllViews();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
