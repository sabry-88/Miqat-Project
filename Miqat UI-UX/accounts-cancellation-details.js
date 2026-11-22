/**
 * MIQAT ACCOUNTS WORKSPACE — CANCELLATION DETAILS CONTROLLER
 * File: accounts-cancellation-details.js
 * 
 * Manages:
 * - Sticky Summary Header (NO FINANCES in sticky header!)
 * - Contextual Operational Action Buttons
 * - 6 Independent Tabs: Overview, Booking & Customer, Cancellation Details & Files,
 *   Financial Summary, Refund Operations & Retries, Immutable Activity Log
 * - Private Internal Notes (Staff-only)
 * - Operational Action Modals (Approve, Reject with mandatory reason, Record Refund,
 *   Confirm Completion, Retry Failed Wire, Corrective Action, File Preview)
 * - Full Arabic & English localization with zero Arabic in English mode
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsCancellationDetails = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let currentId = null;
  let recordData = null;
  let activeTab = 'overview';

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
      const val = window.AccountsWorkspace.t('accounts_workspace.' + key) || window.AccountsWorkspace.t(key);
      if (val && !val.startsWith('accounts_workspace.') && val !== key) return val;
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

  function formatCurrency(amount) {
    const lang = getLang();
    const n = Number(amount) || 0;
    const curr = lang === 'ar' ? 'ج.م' : 'EGP';
    if (lang === 'ar') {
      return n.toLocaleString('ar-EG') + ' ' + curr;
    }
    return n.toLocaleString('en-US') + ' ' + curr;
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
    if (!window.AccountsMockData || typeof window.AccountsMockData.getCancellationDetails !== 'function') {
      console.warn('AccountsMockData service not ready for Details page');
      setTimeout(init, 100);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    currentId = params.get('id') || 'CAN-2026-001';

    loadData();
    bindTabs();
    bindActionModals();
    bindInternalNotes();

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onRefresh === 'function') {
      window.AccountsWorkspace.onRefresh(function () {
        loadData();
      });
    }
    window.addEventListener('accounts-lang-changed', function () {
      loadData();
    });
  }

  function loadData() {
    recordData = window.AccountsMockData.getCancellationDetails(currentId);
    if (!recordData) {
      // Fallback to first available
      const all = window.AccountsMockData.getCancellationRequests({ section: 'all' });
      if (all.length > 0) {
        recordData = all[0];
        currentId = recordData.id;
      }
    }

    if (!recordData) return;

    renderStickyHeader();
    renderTabOverview();
    renderTabBooking();
    renderTabCancellation();
    renderTabFinancial();
    renderTabRefundOps();
    renderTabActivity();
  }

  function renderStickyHeader() {
    const r = recordData;
    const lang = getLang();

    const elId = document.getElementById('sticky-can-id');
    const elCust = document.getElementById('sticky-customer-name');
    const elBk = document.getElementById('sticky-booking-id');
    const elComp = document.getElementById('sticky-company-name');
    const elSrc = document.getElementById('sticky-source-badge');
    const elCanSt = document.getElementById('sticky-can-status-badge');
    const elRefSt = document.getElementById('sticky-ref-status-badge');
    const elDate = document.getElementById('sticky-created-date');

    const custName = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
    const compName = lang === 'ar' ? r.company_name_ar : (r.company_name_en || r.company_name_ar);

    if (elId) elId.textContent = r.id;
    if (elCust) elCust.textContent = custName;
    if (elBk) elBk.textContent = r.booking_id;
    if (elComp) elComp.textContent = compName;
    if (elDate) elDate.textContent = r.created_at;

    if (elSrc) {
      if (r.source === 'customer') {
        elSrc.innerHTML = `<span class="can-status-badge can-badge-source">${t('can_source_customer_badge', 'طلب عميل', 'Customer Request')}</span>`;
      } else {
        elSrc.innerHTML = `<span class="can-status-badge can-badge-source">${t('can_source_company_badge', 'طلب شركة', 'Agency Request')}</span>`;
      }
    }

    if (elCanSt) {
      if (r.cancellation_status === 'under_review') {
        elCanSt.innerHTML = `<span class="can-status-badge can-badge-under-review">${t('can_status_under_review', 'قيد المراجعة والتدقيق', 'Under Review & Audit')}</span>`;
      } else if (r.cancellation_status === 'cancelled') {
        elCanSt.innerHTML = `<span class="can-status-badge can-badge-approved">${t('can_status_approved', 'ملغي معتمد', 'Cancelled & Approved')}</span>`;
      } else if (r.cancellation_status === 'rejected') {
        elCanSt.innerHTML = `<span class="can-status-badge can-badge-rejected">${t('can_status_rejected', 'مرفوض وتثبيت الحجز', 'Rejected (Booking Retained)')}</span>`;
      }
    }

    if (elRefSt) {
      if (r.refund_status === 'pending') {
        elRefSt.innerHTML = `<span class="can-status-badge can-badge-pending">${t('can_ref_status_pending', 'بانتظار التحويل', 'Pending Wire')}</span>`;
      } else if (r.refund_status === 'processing') {
        elRefSt.innerHTML = `<span class="can-status-badge can-badge-processing">${t('can_ref_status_processing', 'قيد المعالجة البنكية', 'Processing with Bank')}</span>`;
      } else if (r.refund_status === 'completed') {
        elRefSt.innerHTML = `<span class="can-status-badge can-badge-completed">${t('can_ref_status_completed', 'مكتمل ومؤكد بنكياً', 'Completed & Confirmed')}</span>`;
      } else if (r.refund_status === 'failed') {
        elRefSt.innerHTML = `<span class="can-status-badge can-badge-failed">${t('can_ref_status_failed', 'عملية تحويل متعثرة', 'Failed Wire (Bounced)')}</span>`;
      } else {
        elRefSt.innerHTML = `<span class="can-status-badge can-badge-rejected">${t('can_ref_status_none', 'لا يوجد استرداد (مرفوض)', 'No Refund (Rejected)')}</span>`;
      }
    }

    // Contextual Action Buttons in Sticky Header
    const actionWrap = document.getElementById('can-sticky-action-buttons');
    if (!actionWrap) return;

    let buttonsHtml = '';

    if (r.cancellation_status === 'under_review') {
      buttonsHtml = `
        <button type="button" class="btn btn-primary btn-sm" id="btn-trigger-approve">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${t('can_btn_approve_cancellation', 'اعتماد الإلغاء', 'Approve Cancellation')}</span>
        </button>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-reject">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>${t('can_btn_reject_cancellation', 'رفض طلب الإلغاء', 'Reject Cancellation')}</span>
        </button>
      `;
    } else if (r.cancellation_status === 'cancelled' && r.refund_status === 'pending') {
      buttonsHtml = `
        <button type="button" class="btn btn-primary btn-sm" id="btn-trigger-refund">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          <span>${t('can_btn_record_refund', 'تسجيل تحويل استرداد', 'Record Refund Transfer')}</span>
        </button>
      `;
    } else if (r.cancellation_status === 'cancelled' && r.refund_status === 'processing') {
      buttonsHtml = `
        <button type="button" class="btn btn-primary btn-sm" id="btn-trigger-confirm-comp">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>${t('can_btn_confirm_refund_completion', 'تأكيد اكتمال الاسترداد', 'Confirm Refund Completion')}</span>
        </button>
      `;
    } else if (r.cancellation_status === 'cancelled' && r.refund_status === 'failed') {
      buttonsHtml = `
        <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-corrective">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span>${t('can_btn_corrective_action', 'تسجيل إجراء تصحيحي', 'Record Corrective Action')}</span>
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="btn-trigger-retry">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          <span>${t('can_btn_retry_refund', 'إعادة محاولة التحويل', 'Retry Failed Transfer')}</span>
        </button>
      `;
    } else if (r.cancellation_status === 'cancelled' && r.refund_status === 'completed') {
      buttonsHtml = `
        <span class="can-status-badge can-badge-approved">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${lang === 'ar' ? 'مكتمل ومؤرشف في الحجوزات السابقة' : 'Settled & Archived'}</span>
        </span>
      `;
    } else if (r.cancellation_status === 'rejected') {
      buttonsHtml = `
        <span class="can-status-badge can-badge-rejected">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>${lang === 'ar' ? 'طلب ملغي مرفوض (الحجز سارٍ)' : 'Cancellation Rejected (Booking Retained)'}</span>
        </span>
      `;
    }

    actionWrap.innerHTML = buttonsHtml;

    // Bind action triggers
    const btnApp = document.getElementById('btn-trigger-approve');
    if (btnApp) {
      btnApp.addEventListener('click', () => {
        const valEl = document.getElementById('modal-approve-refund-val');
        if (valEl) valEl.textContent = formatCurrency(r.financials.refund_due);
        openModal('modal-approve-cancellation');
      });
    }

    const btnRej = document.getElementById('btn-trigger-reject');
    if (btnRej) {
      btnRej.addEventListener('click', () => {
        const err = document.getElementById('reject-validation-error');
        if (err) err.style.display = 'none';
        const txt = document.getElementById('reject-reason-input');
        if (txt) txt.value = '';
        openModal('modal-reject-cancellation');
      });
    }

    const btnRef = document.getElementById('btn-trigger-refund');
    if (btnRef) {
      btnRef.addEventListener('click', () => {
        const elAmt = document.getElementById('refund-input-amount');
        const elBen = document.getElementById('refund-input-beneficiary');
        const elRef = document.getElementById('refund-input-ref');
        if (elAmt) elAmt.value = r.financials.refund_due;
        if (elBen) elBen.value = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
        if (elRef) elRef.value = 'TRX-REF-' + Math.floor(100000 + Math.random() * 900000);
        openModal('modal-record-refund');
      });
    }

    const btnConf = document.getElementById('btn-trigger-confirm-comp');
    if (btnConf) {
      btnConf.addEventListener('click', () => {
        openModal('modal-confirm-completion');
      });
    }

    const btnRet = document.getElementById('btn-trigger-retry');
    if (btnRet) {
      btnRet.addEventListener('click', () => {
        const refInp = document.getElementById('retry-input-ref');
        if (refInp) refInp.value = 'RETRY-TRX-' + Math.floor(100000 + Math.random() * 900000);
        openModal('modal-retry-refund');
      });
    }

    const btnCorr = document.getElementById('btn-trigger-corrective');
    if (btnCorr) {
      btnCorr.addEventListener('click', () => {
        openModal('modal-corrective-action');
      });
    }
  }

  function renderTabOverview() {
    const r = recordData;
    const lang = getLang();

    const boxBk = document.getElementById('box-booking-total');
    const boxApp = document.getElementById('box-approved-paid');
    const boxPen = document.getElementById('box-pending-paid');
    const boxDue = document.getElementById('box-refund-due');
    const boxExec = document.getElementById('box-executed-refund');
    const boxRem = document.getElementById('box-remaining-refund');

    if (boxBk) boxBk.textContent = formatCurrency(r.financials.booking_total);
    if (boxApp) boxApp.textContent = formatCurrency(r.financials.approved_paid);
    if (boxPen) boxPen.textContent = formatCurrency(r.financials.pending_paid);
    if (boxDue) boxDue.textContent = formatCurrency(r.financials.refund_due);
    if (boxExec) boxExec.textContent = formatCurrency(r.financials.executed_refund);
    if (boxRem) boxRem.textContent = formatCurrency(r.financials.remaining_refund);

    const rTitle = document.getElementById('overview-reason-title');
    const rText = document.getElementById('overview-reason-text');
    const rSrc = document.getElementById('overview-requester-source');
    const rDate = document.getElementById('overview-created-date');
    const rUp = document.getElementById('overview-updated-date');

    if (rTitle) rTitle.textContent = lang === 'ar' ? 'السبب الرسمي المسجل للإلغاء:' : 'Official Registered Cancellation Reason:';
    if (rText) rText.textContent = lang === 'ar' ? r.cancellation_reason_ar : (r.cancellation_reason_en || r.cancellation_reason_ar);
    if (rSrc) rSrc.textContent = r.source === 'customer' ? (lang === 'ar' ? 'العميل المعتمر' : 'Customer') : (lang === 'ar' ? 'شركة السياحة' : 'Tourism Agency');
    if (rDate) rDate.textContent = r.created_at;
    if (rUp) rUp.textContent = r.updated_at || r.created_at;

    // Rejection card
    const rejCard = document.getElementById('overview-rejection-card');
    const rejText = document.getElementById('overview-rejection-text');
    if (rejCard && rejText) {
      if (r.cancellation_status === 'rejected' && r.rejection_reason_ar) {
        rejCard.style.display = 'block';
        rejText.textContent = lang === 'ar' ? r.rejection_reason_ar : (r.rejection_reason_en || r.rejection_reason_ar);
      } else {
        rejCard.style.display = 'none';
      }
    }

    renderInternalNotesList();
  }

  function renderInternalNotesList() {
    const listEl = document.getElementById('can-internal-notes-list');
    if (!listEl) return;

    const r = recordData;
    const lang = getLang();

    if (!r.internal_notes || r.internal_notes.length === 0) {
      listEl.innerHTML = `<div style="font-size: 0.8rem; color: var(--color-text-muted); font-style: italic;">${lang === 'ar' ? 'لا توجد ملاحظات داخلية مسجلة بعد.' : 'No internal notes recorded yet.'}</div>`;
      return;
    }

    listEl.innerHTML = r.internal_notes.map(n => {
      const author = lang === 'ar' ? n.author_ar : (n.author_en || n.author_ar);
      const text = lang === 'ar' ? n.text_ar : (n.text_en || n.text_ar);
      return `
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.82rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 0.74rem; color: var(--color-text-muted);">
            <strong>${escapeHtml(author)}</strong>
            <span style="font-variant-numeric: tabular-nums;">${escapeHtml(n.date)}</span>
          </div>
          <div style="color: var(--color-text); line-height: 1.5;">${escapeHtml(text)}</div>
        </div>
      `;
    }).join('');
  }

  function renderTabBooking() {
    const r = recordData;
    const lang = getLang();

    const custName = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
    const compName = lang === 'ar' ? r.company_name_ar : (r.company_name_en || r.company_name_ar);
    const progName = lang === 'ar' ? r.program_ar : (r.program_en || r.program_ar);
    const govName = lang === 'ar' ? r.customer_governorate_ar : (r.customer_governorate_en || r.customer_governorate_ar);

    const cNameEl = document.getElementById('det-cust-name');
    const cPhoneEl = document.getElementById('det-cust-phone');
    const cWhatEl = document.getElementById('det-cust-whatsapp');
    const cEmailEl = document.getElementById('det-cust-email');
    const cNidEl = document.getElementById('det-cust-nid');
    const cGovEl = document.getElementById('det-cust-gov');

    if (cNameEl) cNameEl.textContent = custName;
    if (cPhoneEl) cPhoneEl.textContent = r.customer_phone;
    if (cWhatEl) cWhatEl.textContent = r.customer_whatsapp;
    if (cEmailEl) cEmailEl.textContent = r.customer_email;
    if (cNidEl) cNidEl.textContent = r.customer_national_id;
    if (cGovEl) cGovEl.textContent = govName;

    const bRefEl = document.getElementById('det-booking-ref');
    const bProgEl = document.getElementById('det-booking-program');
    const bCompEl = document.getElementById('det-company-name');
    const bLicEl = document.getElementById('det-company-license');
    const bContEl = document.getElementById('det-company-contact');
    const bTravCountEl = document.getElementById('det-travelers-count');

    if (bRefEl) bRefEl.textContent = r.booking_id;
    if (bProgEl) bProgEl.textContent = progName;
    if (bCompEl) bCompEl.textContent = compName;
    if (bLicEl) bLicEl.textContent = r.company_license;
    if (bContEl && r.company_contact) {
      const rep = lang === 'ar' ? r.company_contact.name_ar : (r.company_contact.name_en || r.company_contact.name_ar);
      bContEl.textContent = rep + ' (' + r.company_contact.phone + ')';
    }
    if (bTravCountEl) bTravCountEl.textContent = formatNum(r.travelers_count);

    // Travelers Table
    const travBody = document.getElementById('det-travelers-body');
    if (!travBody) return;

    if (!r.travelers || r.travelers.length === 0) {
      travBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--color-text-muted);">${lang === 'ar' ? 'لا توجد بيانات مسافرين مسجلة' : 'No travelers data recorded'}</td></tr>`;
      return;
    }

    travBody.innerHTML = r.travelers.map(tr => {
      const trName = lang === 'ar' ? tr.name_ar : (tr.name_en || tr.name_ar);
      const trRel = lang === 'ar' ? tr.relation_ar : (tr.relation_en || tr.relation_ar);

      return `
        <tr>
          <td style="font-weight: 600;">${escapeHtml(trName)}</td>
          <td>${escapeHtml(trRel)}</td>
          <td style="font-family: var(--font-mono, monospace); font-variant-numeric: tabular-nums;">${escapeHtml(tr.passport)}</td>
          <td class="can-date-cell">${escapeHtml(tr.birth_date)}</td>
        </tr>
      `;
    }).join('');
  }

  function renderTabCancellation() {
    const r = recordData;
    const lang = getLang();

    const fullReason = document.getElementById('det-full-reason');
    const fullNotes = document.getElementById('det-full-notes');
    const attGrid = document.getElementById('det-attachments-grid');
    const badgeAtt = document.getElementById('badge-tab-attachments');

    if (fullReason) fullReason.textContent = lang === 'ar' ? r.cancellation_reason_ar : (r.cancellation_reason_en || r.cancellation_reason_ar);
    if (fullNotes) fullNotes.textContent = lang === 'ar' ? r.cancellation_notes_ar : (r.cancellation_notes_en || r.cancellation_notes_ar);

    const attachments = r.attachments || [];
    if (badgeAtt) badgeAtt.textContent = formatNum(attachments.length);

    if (!attGrid) return;

    if (attachments.length === 0) {
      attGrid.innerHTML = `<div style="grid-column: 1 / -1; color: var(--color-text-muted); font-size: 0.84rem;">${lang === 'ar' ? 'لا توجد مرفقات مرفوعة مع هذا الطلب.' : 'No attachments uploaded with this request.'}</div>`;
      return;
    }

    attGrid.innerHTML = attachments.map(att => {
      const aName = lang === 'ar' ? att.name_ar : (att.name_en || att.name_ar);
      const aUploader = lang === 'ar' ? att.uploaded_by_ar : (att.uploaded_by_en || att.uploaded_by_ar);

      return `
        <div class="can-attachment-card">
          <div class="can-att-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="can-att-details">
            <div class="can-att-name" title="${escapeHtml(aName)}">${escapeHtml(aName)}</div>
            <div class="can-att-sub">${escapeHtml(att.size)} • ${escapeHtml(aUploader)} • ${escapeHtml(att.date)}</div>
            <div class="can-att-actions">
              <button type="button" class="btn btn-secondary btn-sm can-btn-preview-file" data-file-title="${escapeHtml(aName)}" data-file-meta="${escapeHtml(att.size)} • ${escapeHtml(aUploader)}" style="padding: 4px 8px; font-size: 0.74rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>${t('can_btn_preview_attachment', 'معاينة', 'Preview')}</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm can-btn-download-file" data-filename="${escapeHtml(aName)}" style="padding: 4px 8px; font-size: 0.74rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>${t('can_btn_download_attachment', 'تحميل', 'Download')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind preview and download buttons
    attGrid.querySelectorAll('.can-btn-preview-file').forEach(btn => {
      btn.addEventListener('click', function () {
        openFilePreview(this.getAttribute('data-file-title'), this.getAttribute('data-file-meta'));
      });
    });

    attGrid.querySelectorAll('.can-btn-download-file').forEach(btn => {
      btn.addEventListener('click', function () {
        triggerSimulatedDownload(this.getAttribute('data-filename'));
      });
    });
  }

  function renderTabFinancial() {
    const r = recordData;
    const tbody = document.getElementById('det-payments-body');
    if (!tbody) return;

    const lang = getLang();
    const payments = r.payments_breakdown || [];

    if (payments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--color-text-muted);">${lang === 'ar' ? 'لا توجد حركات سداد مسجلة' : 'No payment transactions recorded'}</td></tr>`;
      return;
    }

    tbody.innerHTML = payments.map(p => {
      const pMethod = lang === 'ar' ? p.method_ar : (p.method_en || p.method_ar);
      const pReviewer = lang === 'ar' ? p.reviewer_ar : (p.reviewer_en || p.reviewer_ar);

      let statusBadge = '';
      if (p.status === 'approved') {
        statusBadge = `<span class="can-status-badge can-badge-approved">${lang === 'ar' ? 'معتمد ومحسوب بالاسترداد' : 'Approved (Included in Refund)'}</span>`;
      } else {
        statusBadge = `<span class="can-status-badge can-badge-under-review">${lang === 'ar' ? 'معلق (مستثنى من الاسترداد)' : 'Pending (Excluded from Refund)'}</span>`;
      }

      return `
        <tr>
          <td class="can-id-cell">${escapeHtml(p.id)}</td>
          <td class="can-date-cell">${escapeHtml(p.date)}</td>
          <td class="can-num-cell" style="font-weight: 700;">${formatCurrency(p.amount)}</td>
          <td>${escapeHtml(pMethod)}</td>
          <td style="font-family: var(--font-mono, monospace); font-variant-numeric: tabular-nums;">${escapeHtml(p.receipt_ref)}</td>
          <td>${statusBadge}</td>
          <td>${escapeHtml(pReviewer)}</td>
          <td>
            <button type="button" class="btn btn-secondary btn-sm can-btn-view-voucher" data-receipt="${escapeHtml(p.receipt_ref)}" style="padding: 4px 8px; font-size: 0.74rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>${t('can_btn_view_voucher', 'عرض الإيصال', 'View Slip')}</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.can-btn-view-voucher').forEach(btn => {
      btn.addEventListener('click', function () {
        openFilePreview(this.getAttribute('data-receipt') + '.pdf', lang === 'ar' ? 'إيصال سداد بنكي موثق' : 'Certified bank deposit receipt');
      });
    });
  }

  function renderTabRefundOps() {
    const r = recordData;
    const opsContainer = document.getElementById('det-refund-operations-list');
    if (!opsContainer) return;

    const lang = getLang();
    const ops = r.refund_operations || [];

    if (ops.length === 0) {
      opsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">
          ${lang === 'ar' ? 'لم يتم تسجيل أي عمليات تحويل استرداد بعد لهذا الطلب.' : 'No refund wire operations recorded for this request yet.'}
        </div>
      `;
    } else {
      opsContainer.innerHTML = ops.map(op => {
        const opMethod = lang === 'ar' ? op.method_ar : (op.method_en || op.method_ar);
        const opBank = lang === 'ar' ? op.bank_name_ar : (op.bank_name_en || op.bank_name_ar);
        const opBeneficiary = lang === 'ar' ? op.beneficiary_name_ar : (op.beneficiary_name_en || op.beneficiary_name_ar);
        const opStatus = lang === 'ar' ? op.status_ar : (op.status_en || op.status_ar);
        const opNotes = lang === 'ar' ? op.notes_ar : (op.notes_en || op.notes_ar);

        let stPill = '';
        if (op.status === 'completed') {
          stPill = `<span class="can-status-badge can-badge-completed">${escapeHtml(opStatus)}</span>`;
        } else if (op.status === 'processing') {
          stPill = `<span class="can-status-badge can-badge-processing">${escapeHtml(opStatus)}</span>`;
        } else if (op.status === 'failed') {
          stPill = `<span class="can-status-badge can-badge-failed">${escapeHtml(opStatus)}</span>`;
        }

        return `
          <div class="can-refund-card" style="margin-bottom: 16px;">
            <div class="can-refund-header">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="can-id-cell">${escapeHtml(op.id)}</span>
                ${stPill}
              </div>
              <div class="can-date-cell">${escapeHtml(op.date)}</div>
            </div>

            <div class="can-refund-grid">
              <div class="can-refund-item">
                <span class="can-refund-label">${lang === 'ar' ? 'مبلغ التحويل:' : 'Transfer Amount:'}</span>
                <span class="can-refund-val" style="color: var(--color-primary);">${formatCurrency(op.amount)}</span>
              </div>
              <div class="can-refund-item">
                <span class="can-refund-label">${lang === 'ar' ? 'طريقة التحويل:' : 'Method:'}</span>
                <span class="can-refund-val">${escapeHtml(opMethod)}</span>
              </div>
              <div class="can-refund-item">
                <span class="can-refund-label">${lang === 'ar' ? 'البنك المحول إليه:' : 'Bank:'}</span>
                <span class="can-refund-val">${escapeHtml(opBank)}</span>
              </div>
              <div class="can-refund-item">
                <span class="can-refund-label">${lang === 'ar' ? 'اسم المستفيد:' : 'Beneficiary:'}</span>
                <span class="can-refund-val">${escapeHtml(opBeneficiary)}</span>
              </div>
              <div class="can-refund-item" style="grid-column: span 2;">
                <span class="can-refund-label">${lang === 'ar' ? 'رقم الحساب / الآيبان:' : 'IBAN:'}</span>
                <span class="can-refund-val" style="font-family: var(--font-mono, monospace);">${escapeHtml(op.account_iban)}</span>
              </div>
              <div class="can-refund-item" style="grid-column: span 2;">
                <span class="can-refund-label">${lang === 'ar' ? 'رقم مرجع التحويل:' : 'Wire Ref:'}</span>
                <span class="can-refund-val" style="font-family: var(--font-mono, monospace);">${escapeHtml(op.reference_no)}</span>
              </div>
            </div>

            <div style="font-size: 0.8rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border-subtle); padding-top: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div><strong>${lang === 'ar' ? 'ملاحظات المعالجة: ' : 'Processing Notes: '}</strong> ${escapeHtml(opNotes)}</div>
              ${op.voucher_file ? `
                <button type="button" class="btn btn-secondary btn-sm can-btn-view-voucher" data-receipt="${escapeHtml(op.voucher_file)}" style="padding: 3px 8px; font-size: 0.74rem;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span>${t('can_btn_view_voucher', 'عرض إشعار التحويل', 'View Wire Voucher')}</span>
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      opsContainer.querySelectorAll('.can-btn-view-voucher').forEach(btn => {
        btn.addEventListener('click', function () {
          openFilePreview(this.getAttribute('data-receipt'), lang === 'ar' ? 'إشعار تحويل بنكي رسمي' : 'Official bank wire notice');
        });
      });
    }

    // Corrective Actions Card
    const corrCard = document.getElementById('det-corrective-actions-card');
    const corrList = document.getElementById('det-corrective-actions-list');
    const actions = r.corrective_actions || [];

    if (corrCard && corrList) {
      if (actions.length > 0) {
        corrCard.style.display = 'block';
        corrList.innerHTML = actions.map(act => {
          const aType = lang === 'ar' ? act.type_ar : (act.type_en || act.type_ar);
          const aDesc = lang === 'ar' ? act.desc_ar : (act.desc_en || act.desc_ar);
          const aActor = lang === 'ar' ? act.actor_ar : (act.actor_en || act.actor_ar);

          return `
            <div style="background: var(--color-surface-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 10px; font-size: 0.82rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong>${escapeHtml(aType)}</strong>
                <span class="can-date-cell">${escapeHtml(act.date)} • ${escapeHtml(aActor)}</span>
              </div>
              <p style="color: var(--color-text-muted); line-height: 1.4; margin: 0;">${escapeHtml(aDesc)}</p>
            </div>
          `;
        }).join('');
      } else {
        corrCard.style.display = 'none';
      }
    }
  }

  function renderTabActivity() {
    const r = recordData;
    const timeline = document.getElementById('det-activity-timeline');
    if (!timeline) return;

    const lang = getLang();
    const logs = r.activity_log || [];

    if (logs.length === 0) {
      timeline.innerHTML = `<div style="color: var(--color-text-muted); font-size: 0.84rem;">${lang === 'ar' ? 'لا توجد أنشطة مسجلة بعد' : 'No activity logged yet'}</div>`;
      return;
    }

    timeline.innerHTML = logs.map(act => {
      const title = lang === 'ar' ? act.title_ar : (act.title_en || act.title_ar);
      const desc = lang === 'ar' ? act.desc_ar : (act.desc_en || act.desc_ar);
      const actor = lang === 'ar' ? act.actor_ar : (act.actor_en || act.actor_ar);

      return `
        <div class="can-timeline-item">
          <div class="can-timeline-header">
            <span>${escapeHtml(title)}</span>
            <span class="can-status-badge can-badge-source" style="font-size: 0.7rem; padding: 2px 7px;">${escapeHtml(actor)}</span>
            <span class="can-timeline-date">${escapeHtml(act.date)}</span>
          </div>
          <div class="can-timeline-desc">${escapeHtml(desc)}</div>
        </div>
      `;
    }).join('');
  }

  function bindTabs() {
    const tabs = ['overview', 'booking', 'cancellation', 'financial', 'refund-ops', 'activity'];
    tabs.forEach(tabKey => {
      const btn = document.getElementById('tab-btn-' + tabKey);
      if (btn) {
        btn.addEventListener('click', function () {
          activeTab = tabKey;
          tabs.forEach(k => {
            const b = document.getElementById('tab-btn-' + k);
            const sec = document.getElementById('section-tab-' + k);
            if (b) {
              b.classList.toggle('is-active', k === tabKey);
              b.setAttribute('aria-selected', k === tabKey ? 'true' : 'false');
            }
            if (sec) {
              sec.style.display = (k === tabKey) ? 'block' : 'none';
            }
          });
        });
      }
    });
  }

  function bindActionModals() {
    // Dismiss buttons for all modals
    document.querySelectorAll('[data-dismiss-modal]').forEach(btn => {
      btn.addEventListener('click', function () {
        const modalId = this.getAttribute('data-dismiss-modal');
        closeModal(modalId);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.can-modal-backdrop').forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    // Modal 1: Approve Execution
    const btnConfirmApprove = document.getElementById('btn-confirm-approve');
    if (btnConfirmApprove) {
      btnConfirmApprove.addEventListener('click', function () {
        const res = window.AccountsMockData.approveCancellation(currentId, 'أحمد صبري');
        if (res.success) {
          closeModal('modal-approve-cancellation');
          loadData();
        } else {
          alert(res.error);
        }
      });
    }

    // Modal 2: Reject Execution
    const btnConfirmReject = document.getElementById('btn-confirm-reject');
    if (btnConfirmReject) {
      btnConfirmReject.addEventListener('click', function () {
        const txt = document.getElementById('reject-reason-input');
        const reason = txt ? txt.value.trim() : '';
        const err = document.getElementById('reject-validation-error');

        if (!reason) {
          if (err) err.style.display = 'block';
          return;
        }

        const res = window.AccountsMockData.rejectCancellation(currentId, reason, reason, 'أحمد صبري');
        if (res.success) {
          closeModal('modal-reject-cancellation');
          loadData();
        } else {
          alert(res.error);
        }
      });
    }

    // Modal 3: Record Refund Outgoing Wire
    const btnConfirmRefund = document.getElementById('btn-confirm-record-refund');
    if (btnConfirmRefund) {
      btnConfirmRefund.addEventListener('click', function () {
        const amt = document.getElementById('refund-input-amount') ? document.getElementById('refund-input-amount').value : recordData.financials.refund_due;
        const method = document.getElementById('refund-input-method') ? document.getElementById('refund-input-method').value : 'bank_transfer';
        const bank = document.getElementById('refund-input-bank') ? document.getElementById('refund-input-bank').value : '';
        const ben = document.getElementById('refund-input-beneficiary') ? document.getElementById('refund-input-beneficiary').value : '';
        const iban = document.getElementById('refund-input-iban') ? document.getElementById('refund-input-iban').value : '';
        const refNo = document.getElementById('refund-input-ref') ? document.getElementById('refund-input-ref').value : '';
        const notes = document.getElementById('refund-input-notes') ? document.getElementById('refund-input-notes').value : '';

        const res = window.AccountsMockData.recordRefund(currentId, {
          amount: amt,
          method: method,
          bank_name_ar: bank,
          bank_name_en: bank,
          beneficiary_name_ar: ben,
          beneficiary_name_en: ben,
          iban: iban,
          reference_no: refNo,
          notes_ar: notes,
          notes_en: notes
        }, 'أحمد صبري');

        if (res.success) {
          closeModal('modal-record-refund');
          loadData();
        } else {
          alert(res.error);
        }
      });
    }

    // Modal 4: Confirm Completion
    const btnConfirmComp = document.getElementById('btn-confirm-completion-execute');
    if (btnConfirmComp) {
      btnConfirmComp.addEventListener('click', function () {
        const res = window.AccountsMockData.confirmRefundCompletion(currentId, 'أحمد صبري');
        if (res.success) {
          closeModal('modal-confirm-completion');
          loadData();
        } else {
          alert(res.error);
        }
      });
    }

    // Modal 5: Retry Wire
    const btnConfirmRetry = document.getElementById('btn-confirm-retry-execute');
    if (btnConfirmRetry) {
      btnConfirmRetry.addEventListener('click', function () {
        const iban = document.getElementById('retry-input-iban') ? document.getElementById('retry-input-iban').value : '';
        const refNo = document.getElementById('retry-input-ref') ? document.getElementById('retry-input-ref').value : '';
        const notes = document.getElementById('retry-input-notes') ? document.getElementById('retry-input-notes').value : '';

        const res = window.AccountsMockData.retryFailedRefund(currentId, {
          iban: iban,
          reference_no: refNo,
          notes_ar: notes,
          notes_en: notes
        }, 'أحمد صبري');

        if (res.success) {
          closeModal('modal-retry-refund');
          loadData();
        } else {
          alert(res.error);
        }
      });
    }

    // Modal 6: Corrective Action
    const btnConfirmCorr = document.getElementById('btn-confirm-corrective-execute');
    if (btnConfirmCorr) {
      btnConfirmCorr.addEventListener('click', function () {
        const typeSel = document.getElementById('corr-input-type');
        const descInp = document.getElementById('corr-input-desc');

        const type = typeSel ? typeSel.value : 'iban_update';
        const typeAr = typeSel ? typeSel.options[typeSel.selectedIndex].text : '';
        const desc = descInp ? descInp.value : '';

        const res = window.AccountsMockData.recordCorrectiveAction(currentId, {
          type: type,
          type_ar: typeAr,
          type_en: type,
          desc_ar: desc,
          desc_en: desc
        }, 'أحمد صبري');

        if (res.success) {
          closeModal('modal-corrective-action');
          loadData();
        } else {
          alert(res.error);
        }
      });
    }

    // Preview File Download
    const btnPreviewDl = document.getElementById('btn-preview-download-action');
    if (btnPreviewDl) {
      btnPreviewDl.addEventListener('click', function () {
        const titleEl = document.getElementById('modal-preview-title');
        triggerSimulatedDownload(titleEl ? titleEl.textContent : 'Miqat_Document.pdf');
      });
    }
  }

  function bindInternalNotes() {
    const btnSave = document.getElementById('can-btn-save-note');
    const input = document.getElementById('can-internal-note-input');

    if (btnSave && input) {
      btnSave.addEventListener('click', function () {
        const note = input.value.trim();
        if (!note) return;

        window.AccountsMockData.addCancellationInternalNote(currentId, note, 'أحمد صبري');
        input.value = '';
        renderInternalNotesList();
        renderTabActivity();
      });
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('is-open');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('is-open');
  }

  function openFilePreview(filename, meta) {
    const modal = document.getElementById('modal-file-preview');
    const titleEl = document.getElementById('modal-preview-title');
    const metaEl = document.getElementById('modal-preview-meta');

    if (titleEl) titleEl.textContent = filename || 'Document.pdf';
    if (metaEl) metaEl.textContent = meta || '640 KB • مستند معتمد';

    if (modal) modal.classList.add('is-open');
  }

  function triggerSimulatedDownload(filename) {
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('MIQAT OFFICIAL DOCUMENT SECURE ARCHIVE: ' + filename);
    a.download = filename || 'Miqat_Document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init: init,
    loadData: loadData
  };
});
