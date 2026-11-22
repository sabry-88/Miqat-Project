/**
 * MIQAT ACCOUNTS WORKSPACE — PAGE 7: COLLECTION DETAILS CONTROLLER
 */

(function () {
  'use strict';

  let currentId = null;
  let collectionData = null;

  function getLang() {
    return document.documentElement.getAttribute('lang') || 'ar';
  }

  function toArabicIndic(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/[0-9]/g, function (d) {
      return String.fromCharCode(1632 + parseInt(d, 10));
    });
  }

  function formatMoney(amount) {
    const lang = getLang();
    const formatted = Number(amount || 0).toLocaleString('en-US');
    if (lang === 'ar') {
      return toArabicIndic(formatted).replace(/,/g, '،') + ' ج.م';
    }
    return 'EGP ' + formatted;
  }

  function getBadgeClass(status) {
    switch (status) {
      case 'approved':
      case 'verified':
        return 'acc-badge is-verified';
      case 'under_review':
      case 'awaiting_provider':
      case 'awaiting_proof':
      case 'pending':
        return 'acc-badge is-warning';
      case 'rejected':
      case 'failed':
      case 'mismatch':
        return 'acc-badge is-rejected';
      default:
        return 'acc-badge is-neutral';
    }
  }

  function getStatusLabel(status) {
    const lang = getLang();
    const isAr = lang === 'ar';
    const map = {
      'approved': isAr ? 'معتمد بنجاح' : 'Approved',
      'under_review': isAr ? 'قيد المراجعة والتدقيق' : 'Under Review',
      'awaiting_provider': isAr ? 'بانتظار تأكيد المزود' : 'Awaiting Provider Confirmation',
      'awaiting_proof': isAr ? 'بانتظار إشعار العميل' : 'Awaiting Customer Proof',
      'rejected': isAr ? 'مرفوض' : 'Rejected',
      'failed': isAr ? 'عملية فاشلة' : 'Payment Failed',
      'verified': isAr ? 'مطابق ومؤكد' : 'Verified & Confirmed',
      'pending': isAr ? 'قيد التحقق الآلي' : 'Verification Pending',
      'mismatch': isAr ? 'عدم تطابق في البيانات' : 'Data Mismatch',
      'unverified': isAr ? 'غير مؤكد بنكياً' : 'Unverified by Bank'
    };
    return map[status] || status;
  }

  function getMethodLabel(method) {
    const lang = getLang();
    const isAr = lang === 'ar';
    const map = {
      'bank_transfer': isAr ? 'تحويل بنكي' : 'Bank Transfer',
      'instapay': isAr ? 'إنستاباي (InstaPay)' : 'InstaPay',
      'vodafone_cash': isAr ? 'فودافون كاش' : 'Vodafone Cash',
      'wallet': isAr ? 'محفظة إلكترونية' : 'E-Wallet'
    };
    return map[method] || method;
  }

  function loadDetails() {
    const params = new URLSearchParams(window.location.search);
    currentId = params.get('id') || 'COL-2026-0501';

    if (!window.AccountsMockData || !window.AccountsMockData.getCollectionDetails) return;
    collectionData = window.AccountsMockData.getCollectionDetails(currentId);
    if (!collectionData) {
      collectionData = window.AccountsMockData.getCollectionDetails('COL-2026-0501');
      if (collectionData) currentId = collectionData.id;
    }

    renderView();
  }

  function renderView() {
    if (!collectionData) return;
    const c = collectionData;
    const lang = getLang();
    const isAr = lang === 'ar';

    // Top Header & Breadcrumbs
    const elBreadcrumbId = document.getElementById('cd-breadcrumb-id');
    const elTitleRef = document.getElementById('cd-title-ref');
    const elBadgeStatus = document.getElementById('cd-badge-status');
    const elBadgeProvider = document.getElementById('cd-badge-provider');

    if (elBreadcrumbId) elBreadcrumbId.textContent = c.id;
    if (elTitleRef) elTitleRef.textContent = c.id;
    if (elBadgeStatus) {
      elBadgeStatus.className = getBadgeClass(c.status);
      elBadgeStatus.textContent = getStatusLabel(c.status);
    }
    if (elBadgeProvider) {
      elBadgeProvider.className = getBadgeClass(c.provider_status);
      elBadgeProvider.textContent = getStatusLabel(c.provider_status);
    }

    // Section A: Summary
    const elAmount = document.getElementById('cd-field-amount');
    const elMethod = document.getElementById('cd-field-method');
    const elCustomer = document.getElementById('cd-field-customer');
    const elPhone = document.getElementById('cd-field-phone');
    const elDate = document.getElementById('cd-field-date');
    const elEmployee = document.getElementById('cd-field-employee');

    if (elAmount) elAmount.textContent = formatMoney(c.amount);
    if (elMethod) elMethod.textContent = getMethodLabel(c.payment_method);
    if (elCustomer) elCustomer.textContent = isAr ? c.customer_name_ar : c.customer_name_en;
    if (elPhone) elPhone.textContent = c.customer_phone;
    if (elDate) elDate.textContent = c.transaction_date;
    if (elEmployee) elEmployee.textContent = isAr ? (c.assigned_emp_ar || 'أحمد صبري') : (c.assigned_emp_en || 'Ahmed Sabry');

    // Section D: Linked Booking
    const elBookingLink = document.getElementById('cd-field-booking-link');
    const elProgName = document.getElementById('cd-field-program-name');
    const elProgTotal = document.getElementById('cd-field-prog-total');
    const elDepositReq = document.getElementById('cd-field-deposit-req');

    if (elBookingLink) {
      elBookingLink.textContent = c.booking_id;
      elBookingLink.href = 'accounts-booking-details.html?id=' + encodeURIComponent(c.booking_id);
    }
    if (elProgName) elProgName.textContent = isAr ? c.program_name_ar : c.program_name_en;
    if (elProgTotal) elProgTotal.textContent = formatMoney(c.program_total || (c.amount * 3.33));
    if (elDepositReq) elDepositReq.textContent = formatMoney(c.amount);

    // Section C: Provider Verification
    const elProvName = document.getElementById('cd-prov-name');
    const elProvRrn = document.getElementById('cd-prov-rrn');
    const elProvSender = document.getElementById('cd-prov-sender');
    const elProvBen = document.getElementById('cd-prov-beneficiary');
    const elProvMatch = document.getElementById('cd-prov-match-status');

    if (elProvName) elProvName.textContent = c.provider_name || '—';
    if (elProvRrn) elProvRrn.textContent = c.rrn || '—';
    if (elProvSender) elProvSender.textContent = c.sender_account || '—';
    if (elProvBen) elProvBen.textContent = c.beneficiary_account || '—';
    if (elProvMatch) {
      elProvMatch.className = getBadgeClass(c.provider_status);
      elProvMatch.textContent = getStatusLabel(c.provider_status);
    }

    // Section B: Receipt Card Preview
    const rcptTitle = document.getElementById('rcpt-bank-title');
    const rcptDate = document.getElementById('rcpt-stamp-date');
    const rcptAmount = document.getElementById('rcpt-amount');
    const rcptRrn = document.getElementById('rcpt-rrn');
    const rcptBen = document.getElementById('rcpt-beneficiary');

    if (rcptTitle) rcptTitle.textContent = c.provider_name || 'إشعار تحويل بنكي';
    if (rcptDate) rcptDate.textContent = c.transaction_date.split(' ')[0];
    if (rcptAmount) rcptAmount.textContent = formatMoney(c.amount);
    if (rcptRrn) rcptRrn.textContent = c.rrn;
    if (rcptBen) rcptBen.textContent = isAr ? 'حساب ميقات الرئيسي' : 'Miqat Main Escrow';

    // File Metadata
    const elFilename = document.getElementById('proof-meta-filename');
    const elFilesize = document.getElementById('proof-meta-size');
    const elFileUploaded = document.getElementById('proof-meta-uploaded');
    if (c.proof_file) {
      if (elFilename) elFilename.textContent = c.proof_file.filename;
      if (elFilesize) elFilesize.textContent = c.proof_file.size;
      if (elFileUploaded) elFileUploaded.textContent = c.proof_file.uploaded_at;
    }

    // Section E: Decision Controls Visibility
    const btnGroup = document.getElementById('review-buttons-group');
    if (btnGroup) {
      if (c.status === 'approved') {
        btnGroup.innerHTML = `
          <div style="width:100%; padding:14px 18px; background:rgba(11,79,108,0.06); border-radius:6px; border:1px solid rgba(11,79,108,0.2); display:flex; align-items:center; gap:10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style="font-size:13px; font-weight:600; color:var(--color-primary);">
              ${isAr ? 'تم اعتماد هذا التحصيل وقيده في الحساب البنكي رسمياً.' : 'This collection has been approved and credited.'}
            </span>
          </div>
        `;
      }
    }

    // Render Notes
    renderNotes();

    // Render Audit Trail
    renderAuditTrail();
  }

  function renderNotes() {
    const container = document.getElementById('notes-container');
    if (!container || !collectionData) return;
    const notes = collectionData.notes || [];
    const isAr = getLang() === 'ar';

    if (notes.length === 0) {
      container.innerHTML = `<span style="font-size:12px; color:var(--color-text-muted);">${isAr ? 'لا توجد ملاحظات محاسبية مسجلة بعد.' : 'No internal notes recorded yet.'}</span>`;
      return;
    }

    let html = '';
    notes.forEach(function (n) {
      const author = isAr ? (n.author_ar || n.author) : (n.author_en || n.author);
      const text = isAr ? (n.text_ar || n.text) : (n.text_en || 'RRN matched with NBE bank statement and collection approved immediately.');
      html += `
        <div class="acc-note-card">
          <div class="acc-note-meta">
            <strong class="acc-note-author">${author}</strong>
            <span class="acc-note-date">${n.date}</span>
          </div>
          <div class="acc-note-text">${text}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function renderAuditTrail() {
    const container = document.getElementById('audit-trail-timeline');
    if (!container || !collectionData) return;
    const history = collectionData.history || [];
    const isAr = getLang() === 'ar';

    if (history.length === 0) {
      container.innerHTML = `<span style="font-size:12px; color:var(--color-text-muted);">${isAr ? 'لا توجد سجلات نشاط' : 'No activity records'}</span>`;
      return;
    }

    let html = '';
    history.forEach(function (h) {
      const actor = isAr ? (h.actor_ar || h.actor) : (h.actor_en || h.actor);
      const details = isAr ? (h.details_ar || h.details) : (h.details_en || h.details);
      html += `
        <div style="display:flex; gap:12px; align-items:flex-start; font-size:13px;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--color-primary); margin-top:6px; flex-shrink:0;"></div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; gap:8px;">
              <strong style="color:var(--color-text);">${actor}</strong>
              <span style="font-size:11px; color:var(--color-text-muted);">${h.date}</span>
            </div>
            <div style="color:var(--color-text-secondary); margin-top:2px;">${details}</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function setupActions() {
    // Approve Button
    const btnApprove = document.getElementById('btn-approve-collection');
    if (btnApprove) {
      btnApprove.addEventListener('click', function () {
        const isAr = getLang() === 'ar';
        const confirmed = confirm(isAr ? 'هل أنت متأكد من اعتماد هذا التحصيل وقيد الرصيد؟' : 'Are you sure you want to approve this collection and credit funds?');
        if (!confirmed) return;

        const res = window.AccountsMockData.approveCollection(currentId);
        if (res.success) {
          collectionData = res.collection;
          renderView();
        }
      });
    }

    // Rejection Modal
    const btnReject = document.getElementById('btn-reject-collection');
    const rejectBackdrop = document.getElementById('reject-modal-backdrop');
    const btnCancelReject = document.getElementById('btn-cancel-reject');
    const btnCancelRejectX = document.getElementById('btn-cancel-reject-x');
    const btnConfirmReject = document.getElementById('btn-confirm-reject');
    const rejectReasonInput = document.getElementById('reject-reason-input');

    if (btnReject && rejectBackdrop) {
      btnReject.addEventListener('click', function () {
        rejectBackdrop.style.display = 'block';
        if (rejectReasonInput) rejectReasonInput.focus();
      });
    }

    function closeRejectModal() {
      if (rejectBackdrop) {
        rejectBackdrop.style.display = 'none';
        if (rejectReasonInput) rejectReasonInput.value = '';
      }
    }

    if (btnCancelReject) {
      btnCancelReject.addEventListener('click', closeRejectModal);
    }
    if (btnCancelRejectX) {
      btnCancelRejectX.addEventListener('click', closeRejectModal);
    }

    if (btnConfirmReject && rejectBackdrop) {
      btnConfirmReject.addEventListener('click', function () {
        const reason = rejectReasonInput ? rejectReasonInput.value.trim() : '';
        if (!reason) {
          alert(getLang() === 'ar' ? 'سبب الرفض إلزامي' : 'Rejection reason is mandatory');
          return;
        }

        const res = window.AccountsMockData.rejectCollection(currentId, reason);
        if (res.success) {
          rejectBackdrop.style.display = 'none';
          collectionData = res.collection;
          renderView();
        }
      });
    }

    // Re-upload Modal
    const btnReupload = document.getElementById('btn-reupload-collection');
    const reuploadBackdrop = document.getElementById('reupload-modal-backdrop');
    const btnCancelReupload = document.getElementById('btn-cancel-reupload');
    const btnCancelReuploadX = document.getElementById('btn-cancel-reupload-x');
    const btnConfirmReupload = document.getElementById('btn-confirm-reupload');
    const reuploadInput = document.getElementById('reupload-instructions-input');

    if (btnReupload && reuploadBackdrop) {
      btnReupload.addEventListener('click', function () {
        reuploadBackdrop.style.display = 'block';
        if (reuploadInput) reuploadInput.focus();
      });
    }

    function closeReuploadModal() {
      if (reuploadBackdrop) {
        reuploadBackdrop.style.display = 'none';
        if (reuploadInput) reuploadInput.value = '';
      }
    }

    if (btnCancelReupload) {
      btnCancelReupload.addEventListener('click', closeReuploadModal);
    }
    if (btnCancelReuploadX) {
      btnCancelReuploadX.addEventListener('click', closeReuploadModal);
    }

    if (btnConfirmReupload && reuploadBackdrop) {
      btnConfirmReupload.addEventListener('click', function () {
        const inst = reuploadInput ? reuploadInput.value.trim() : '';
        const res = window.AccountsMockData.requestCollectionReupload(currentId, inst);
        if (res.success) {
          reuploadBackdrop.style.display = 'none';
          collectionData = res.collection;
          renderView();
        }
      });
    }

    // Add Internal Note
    const btnSubmitNote = document.getElementById('btn-submit-note');
    const inputNote = document.getElementById('cd-input-note');
    if (btnSubmitNote && inputNote) {
      btnSubmitNote.addEventListener('click', function () {
        const text = inputNote.value.trim();
        if (!text) return;
        const res = window.AccountsMockData.addCollectionNote(currentId, text);
        if (res.success) {
          collectionData.notes = res.notes;
          inputNote.value = '';
          renderNotes();
        }
      });
    }
  }

  function init() {
    loadDetails();
    setupActions();

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onRefresh === 'function') {
      window.AccountsWorkspace.onRefresh(function () {
        renderView();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
