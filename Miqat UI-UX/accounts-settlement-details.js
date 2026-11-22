/**
 * MIQAT ACCOUNTS WORKSPACE — PAGE 7: SETTLEMENT DETAILS CONTROLLER
 * Full Role-Separation Simulation (Accounts Officer vs Financial Admin)
 */

(function () {
  'use strict';

  let currentId = null;
  let settlementData = null;
  let currentSimRole = 'accounts'; // 'accounts' or 'admin'

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
      case 'completed':
      case 'confirmed':
        return 'acc-badge is-verified';
      case 'awaiting_conf':
      case 'eligible':
      case 'prepared':
      case 'awaiting_admin':
      case 'pending':
        return 'acc-badge is-warning';
      case 'returned':
      case 'disputed':
        return 'acc-badge is-rejected';
      default:
        return 'acc-badge is-neutral';
    }
  }

  function getStatusLabel(status) {
    const lang = getLang();
    const isAr = lang === 'ar';
    const map = {
      'awaiting_conf': isAr ? 'بانتظار تأكيد الشركة' : 'Awaiting Agency Confirmation',
      'eligible': isAr ? 'مؤهلة للمراجعة' : 'Eligible for Review',
      'prepared': isAr ? 'تم الإعداد بواسطة المحاسبة' : 'Prepared by Accounts',
      'awaiting_admin': isAr ? 'بانتظار اعتماد الإدارة' : 'Awaiting Admin Approval',
      'returned': isAr ? 'معادة للتعديل' : 'Returned for Correction',
      'approved': isAr ? 'معتمدة — بانتظار التحويل' : 'Approved — Awaiting Transfer',
      'transferring': isAr ? 'جاري تنفيذ الحوالة' : 'Transfer In Progress',
      'completed': isAr ? 'تسوية مكتملة ومحولة' : 'Completed',
      'confirmed': isAr ? 'مؤكد استلام المتبقي' : 'Remaining Payment Confirmed',
      'pending': isAr ? 'بانتظار تأكيد الشركة' : 'Awaiting Agency Confirmation',
      'disputed': isAr ? 'ملاحظات على المبلغ' : 'Payment Disputed'
    };
    return map[status] || status;
  }

  function loadDetails() {
    const params = new URLSearchParams(window.location.search);
    currentId = params.get('id') || 'SET-2026-0301';

    if (!window.AccountsMockData || !window.AccountsMockData.getSettlementDetails) return;
    settlementData = window.AccountsMockData.getSettlementDetails(currentId);
    if (!settlementData) {
      settlementData = window.AccountsMockData.getSettlementDetails('SET-2026-0301');
      if (settlementData) currentId = settlementData.id;
    }

    renderView();
  }

  function renderView() {
    if (!settlementData) return;
    const s = settlementData;
    const lang = getLang();
    const isAr = lang === 'ar';

    // Top Header & Breadcrumbs
    const elBreadcrumbId = document.getElementById('sd-breadcrumb-id');
    const elTitleRef = document.getElementById('sd-title-ref');
    const elBadgeStatus = document.getElementById('sd-badge-status');
    const elBadgeVersion = document.getElementById('sd-badge-version');

    if (elBreadcrumbId) elBreadcrumbId.textContent = s.id;
    if (elTitleRef) elTitleRef.textContent = s.id;
    if (elBadgeStatus) {
      elBadgeStatus.className = getBadgeClass(s.status);
      elBadgeStatus.textContent = getStatusLabel(s.status);
    }
    if (elBadgeVersion) {
      elBadgeVersion.textContent = 'v' + (s.version || 1) + '.0';
    }

    // Blocked Banner Check (If Company Confirmation is Pending)
    const blockedBanner = document.getElementById('sd-blocked-banner');
    const isCompanyConfirmed = s.company_confirmation && s.company_confirmation.status === 'confirmed';
    if (blockedBanner) {
      blockedBanner.style.display = (!isCompanyConfirmed || s.status === 'awaiting_conf') ? 'block' : 'none';
    }

    // Section C: Financial Breakdown
    const elProgTotal = document.getElementById('sd-calc-prog-total');
    const elDeposit = document.getElementById('sd-calc-deposit');
    const elDirect = document.getElementById('sd-calc-direct');
    const elCommission = document.getElementById('sd-calc-commission');
    const elNetTotal = document.getElementById('sd-calc-net-total');
    const elDirectionLabel = document.getElementById('sd-calc-direction-label');
    const elDepositNote = document.getElementById('sd-calc-deposit-note');
    const elCommNote = document.getElementById('sd-calc-comm-note');

    if (elProgTotal) elProgTotal.textContent = formatMoney(s.program_total);
    if (elDeposit) elDeposit.textContent = formatMoney(s.deposit_paid);
    if (elDirect) elDirect.textContent = formatMoney(s.direct_paid);
    if (elCommission) elCommission.textContent = formatMoney(s.commission_amount);
    if (elNetTotal) elNetTotal.textContent = formatMoney(s.net_settlement);

    if (elDirectionLabel) {
      if (s.net_direction === 'receivable_from_company') {
        elDirectionLabel.textContent = isAr 
          ? 'مستحق التحصيل من شركة السياحة إلى ميقات:'
          : 'Receivable by Miqat from Tourism Agency:';
      } else {
        elDirectionLabel.textContent = isAr
          ? 'مستحق الدفع من ميقات إلى شركة السياحة:'
          : 'Payable from Miqat to Tourism Agency:';
      }
    }

    if (elDepositNote) {
      elDepositNote.textContent = isAr ? '~30% دفعة مقدمة استرشادية محصلة إلكترونياً' : '~30% provisional deposit collected electronically';
    }
    if (elCommNote) {
      const commPct = Math.round((s.commission_rate || 0.2) * 100);
      elCommNote.textContent = isAr ? `نسبة العمولة: ${commPct}% استرشادية` : `Commission rate: ${commPct}% provisional`;
    }

    // Section B: Company Confirmation Card
    const elConfBadge = document.getElementById('sd-conf-badge');
    const elConfAmount = document.getElementById('sd-conf-amount');
    const elConfDate = document.getElementById('sd-conf-date');
    const elConfRef = document.getElementById('sd-conf-ref');
    const elConfNotes = document.getElementById('sd-conf-notes');

    const confObj = s.company_confirmation || {};
    if (elConfBadge) {
      elConfBadge.className = getBadgeClass(confObj.status || 'pending');
      elConfBadge.textContent = getStatusLabel(confObj.status || 'pending');
    }
    if (elConfAmount) elConfAmount.textContent = formatMoney(confObj.confirmed_amount || s.direct_paid);
    if (elConfDate) elConfDate.textContent = confObj.confirmed_at || (isAr ? 'لم يؤكد بعد' : 'Not yet confirmed');
    if (elConfRef) elConfRef.textContent = confObj.company_ref || '—';
    if (elConfNotes) {
      const noteAr = confObj.notes_ar || confObj.notes || 'لا توجد ملاحظات مرفقة من شركة السياحة.';
      const noteEn = confObj.notes_en || 'Full remaining balance confirmed and received at agency headquarters.';
      elConfNotes.textContent = isAr ? noteAr : noteEn;
    }

    // Section A: Booking Info
    const elBooking = document.getElementById('sd-field-booking');
    const elCompany = document.getElementById('sd-field-company');
    const elCustomer = document.getElementById('sd-field-customer');
    const elProgram = document.getElementById('sd-field-program');

    if (elBooking) {
      elBooking.textContent = s.booking_id;
      elBooking.href = 'accounts-booking-details.html?id=' + encodeURIComponent(s.booking_id);
    }
    if (elCompany) elCompany.textContent = isAr ? s.tourism_company_ar : s.tourism_company_en;
    if (elCustomer) elCustomer.textContent = isAr ? s.customer_name_ar : s.customer_name_en;
    if (elProgram) elProgram.textContent = isAr ? s.program_name_ar : s.program_name_en;

    // Transfer Executed Card (if completed)
    const transferCard = document.getElementById('transfer-executed-card');
    if (transferCard) {
      if (s.status === 'completed' && s.transfer_details) {
        transferCard.style.display = 'block';
        const tr = s.transfer_details;
        const elTrRef = document.getElementById('sd-tr-ref');
        const elTrBank = document.getElementById('sd-tr-bank');
        const elTrDate = document.getElementById('sd-tr-date');
        const elTrFile = document.getElementById('sd-tr-file');

        if (elTrRef) elTrRef.textContent = tr.bank_ref || '—';
        if (elTrBank) elTrBank.textContent = tr.sender_bank || '—';
        if (elTrDate) elTrDate.textContent = tr.transfer_date || '—';
        if (elTrFile) elTrFile.textContent = tr.proof_filename || 'Swift_Advice.pdf';
      } else {
        transferCard.style.display = 'none';
      }
    }

    // Role Actions
    renderRoleActions();

    // Notes
    renderNotes();

    // Version History
    renderVersionHistory();

    // Workflow Timeline
    renderWorkflow();
  }

  function renderRoleActions() {
    const container = document.getElementById('role-actions-container');
    if (!container || !settlementData) return;
    const s = settlementData;
    const isAr = getLang() === 'ar';
    const isCompanyConfirmed = s.company_confirmation && s.company_confirmation.status === 'confirmed';

    let html = '';

    if (currentSimRole === 'accounts') {
      // --- ACCOUNTS OFFICER ROLE PERSPECTIVE ---
      html += `
        <div style="font-size:12px; color:var(--color-text-muted); margin-bottom:4px;">
          ${isAr ? 'صلاحيات موظف الحسابات: إعداد التسوية ومراجعة الأرقام ورفعها للاعتماد الإداري' : 'Accounts Officer Scope: Prepare settlement, verify figures, and submit for admin approval'}
        </div>
      `;

      if (s.status === 'returned') {
        html += `
          <div style="background:var(--color-accent-subtle); border-inline-start:4px solid var(--color-accent); padding:12px; border-radius:6px; margin-bottom:8px;">
            <div style="font-weight:700; color:var(--color-accent); font-size:13px; margin-bottom:4px;">
              ${isAr ? 'ملاحظة الإدارة المالية لإعادة التسوية:' : 'Financial Admin Return Note:'}
            </div>
            <div style="font-size:13px; color:var(--color-text);">
              ${s.admin_return_reason || (isAr ? 'يرجى مراجعة وتعديل بنود التسوية.' : 'Please revise settlement line items.')}
            </div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-accounts-resubmit" style="width:100%;">
            ${isAr ? 'إعادة تقديم التسوية للاعتماد الإداري' : 'Resubmit for Admin Approval'}
          </button>
        `;
      } else if (s.status === 'eligible') {
        html += `
          <button type="button" class="btn btn-primary" id="btn-accounts-prepare" style="width:100%;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${isAr ? 'إعداد مسودة التسوية واحتساب المستحقات' : 'Prepare Settlement Draft & Calculate'}</span>
          </button>
        `;
      } else if (s.status === 'prepared') {
        html += `
          <button type="button" class="btn btn-primary" id="btn-accounts-submit" style="width:100%;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>${isAr ? 'إرسال التسوية للاعتماد الإداري' : 'Submit for Admin Approval'}</span>
          </button>
        `;
      } else if (s.status === 'awaiting_conf') {
        html += `
          <button type="button" class="btn btn-primary" disabled style="width:100%; opacity:0.6; cursor:not-allowed;" title="${isAr ? 'التسوية معلقة بانتظار تأكيد الشركة' : 'Blocked awaiting company confirmation'}">
            <span>${isAr ? 'إعداد التسوية (معلق بانتظار تأكيد الشركة)' : 'Prepare Settlement (Blocked: Confirmation Pending)'}</span>
          </button>
        `;
      } else if (s.status === 'awaiting_admin') {
        html += `
          <div style="padding:12px; background:var(--color-bg); border-radius:6px; font-size:13px; text-align:center; color:var(--color-text-secondary);">
            ${isAr ? 'تم رفع التسوية وهي قيد المراجعة والقرار من الإدارة المالية' : 'Settlement submitted and awaiting Financial Admin decision'}
          </div>
        `;
      } else {
        html += `
          <div style="padding:12px; background:var(--color-bg); border-radius:6px; font-size:13px; text-align:center; color:var(--color-text-secondary);">
            ${isAr ? 'التسوية معتمدة إدارياً. تنفيذ التحويل البنكي مخصص لمدير الحسابات/الإدارة.' : 'Settlement is admin-approved. Bank transfer execution is restricted to Financial Admin.'}
          </div>
        `;
      }

    } else {
      // --- FINANCIAL ADMIN ROLE PERSPECTIVE ---
      html += `
        <div style="font-size:12px; color:var(--color-text-muted); margin-bottom:4px;">
          ${isAr ? 'صلاحيات المدير المالي / الإدارة: اعتماد التسويات، إعادتها للتصحيح، وتنفيذ التحويل البنكي' : 'Financial Admin Scope: Approve, return for correction, or execute bank transfer'}
        </div>
      `;

      if (s.status === 'awaiting_admin') {
        html += `
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn btn-primary" id="btn-admin-approve" style="flex:1;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${isAr ? 'اعتماد التسوية نهائياً' : 'Approve Settlement'}</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-admin-return" style="flex:1;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              <span>${isAr ? 'إعادة للتعديل' : 'Return for Correction'}</span>
            </button>
          </div>
        `;
      } else if (s.status === 'approved') {
        html += `
          <button type="button" class="btn btn-primary" id="btn-admin-execute-transfer" style="width:100%;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>${isAr ? 'تنفيذ التحويل البنكي وإرفاق إشعار السويفت' : 'Execute Bank Transfer & Attach Swift'}</span>
          </button>
        `;
      } else if (s.status === 'completed') {
        html += `
          <div style="padding:12px; background:rgba(11,79,108,0.06); border:1px solid rgba(11,79,108,0.2); border-radius:6px; font-size:13px; font-weight:600; text-align:center; color:var(--color-primary);">
            ✓ ${isAr ? 'تم تنفيذ التحويل البنكي واكتمال التسوية المالية بنجاح' : 'Bank transfer executed and settlement completed successfully'}
          </div>
        `;
      } else {
        html += `
          <div style="padding:12px; background:var(--color-bg); border-radius:6px; font-size:13px; text-align:center; color:var(--color-text-secondary);">
            ${isAr ? 'التسوية لم تُقدم بعد للاعتماد الإداري من موظف الحسابات.' : 'Settlement has not yet been submitted for admin approval.'}
          </div>
        `;
      }
    }

    container.innerHTML = html;
    attachDynamicActionListeners();
  }

  function attachDynamicActionListeners() {
    const isAr = getLang() === 'ar';

    // Accounts Prepare
    const btnPrepare = document.getElementById('btn-accounts-prepare');
    if (btnPrepare) {
      btnPrepare.addEventListener('click', function () {
        const res = window.AccountsMockData.prepareSettlement(currentId);
        if (res.success) {
          settlementData = res.settlement;
          renderView();
        } else {
          alert(res.message);
        }
      });
    }

    // Accounts Submit
    const btnSubmit = document.getElementById('btn-accounts-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', function () {
        const res = window.AccountsMockData.submitSettlementForApproval(currentId);
        if (res.success) {
          settlementData = res.settlement;
          renderView();
        }
      });
    }

    // Accounts Resubmit
    const btnResubmit = document.getElementById('btn-accounts-resubmit');
    if (btnResubmit) {
      btnResubmit.addEventListener('click', function () {
        const res = window.AccountsMockData.submitSettlementForApproval(currentId);
        if (res.success) {
          settlementData = res.settlement;
          renderView();
        }
      });
    }

    // Admin Approve
    const btnApprove = document.getElementById('btn-admin-approve');
    if (btnApprove) {
      btnApprove.addEventListener('click', function () {
        const confirmed = confirm(isAr ? 'تأكيد اعتماد التسوية النهائية والموافقة على التحويل البنكي؟' : 'Confirm final settlement approval for bank disbursement?');
        if (!confirmed) return;
        const res = window.AccountsMockData.adminApproveSettlement(currentId);
        if (res.success) {
          settlementData = res.settlement;
          renderView();
        }
      });
    }

    // Admin Return (Modal)
    const btnReturn = document.getElementById('btn-admin-return');
    const returnBackdrop = document.getElementById('return-modal-backdrop');
    const btnCancelReturn = document.getElementById('btn-cancel-return');
    const btnCancelReturnX = document.getElementById('btn-cancel-return-x');
    const btnConfirmReturn = document.getElementById('btn-confirm-return');
    const returnReasonInput = document.getElementById('return-reason-input');

    if (btnReturn && returnBackdrop) {
      btnReturn.addEventListener('click', function () {
        returnBackdrop.style.display = 'block';
        if (returnReasonInput) returnReasonInput.focus();
      });
    }

    function closeReturnModal() {
      if (returnBackdrop) {
        returnBackdrop.style.display = 'none';
        if (returnReasonInput) returnReasonInput.value = '';
      }
    }

    if (btnCancelReturn) {
      btnCancelReturn.addEventListener('click', closeReturnModal);
    }
    if (btnCancelReturnX) {
      btnCancelReturnX.addEventListener('click', closeReturnModal);
    }

    if (btnConfirmReturn && returnBackdrop) {
      btnConfirmReturn.addEventListener('click', function () {
        const reason = returnReasonInput ? returnReasonInput.value.trim() : '';
        if (!reason) {
          alert(isAr ? 'سبب الإعادة إلزامي' : 'Return reason is mandatory');
          return;
        }

        const res = window.AccountsMockData.adminReturnSettlement(currentId, reason);
        if (res.success) {
          returnBackdrop.style.display = 'none';
          settlementData = res.settlement;
          renderView();
        }
      });
    }

    // Admin Execute Transfer (Modal)
    const btnExecute = document.getElementById('btn-admin-execute-transfer');
    const transferBackdrop = document.getElementById('transfer-modal-backdrop');
    const btnCancelTransfer = document.getElementById('btn-cancel-transfer');
    const btnCancelTransferX = document.getElementById('btn-cancel-transfer-x');
    const btnConfirmTransfer = document.getElementById('btn-confirm-transfer');
    const transferRefInput = document.getElementById('transfer-ref-input');
    const transferBankInput = document.getElementById('transfer-bank-input');

    if (btnExecute && transferBackdrop) {
      btnExecute.addEventListener('click', function () {
        transferBackdrop.style.display = 'block';
        if (transferRefInput) transferRefInput.focus();
      });
    }

    function closeTransferModal() {
      if (transferBackdrop) {
        transferBackdrop.style.display = 'none';
      }
    }

    if (btnCancelTransfer) {
      btnCancelTransfer.addEventListener('click', closeTransferModal);
    }
    if (btnCancelTransferX) {
      btnCancelTransferX.addEventListener('click', closeTransferModal);
    }

    if (btnConfirmTransfer && transferBackdrop) {
      btnConfirmTransfer.addEventListener('click', function () {
        const bankRef = transferRefInput ? transferRefInput.value.trim() : '';
        const senderBank = transferBankInput ? transferBankInput.value.trim() : '';
        if (!bankRef) {
          alert(isAr ? 'الرقم المرجعي للسويفت إلزامي' : 'Swift bank reference is mandatory');
          return;
        }

        const res = window.AccountsMockData.adminExecuteTransfer(currentId, {
          bank_ref: bankRef,
          sender_bank: senderBank
        });

        if (res.success) {
          transferBackdrop.style.display = 'none';
          settlementData = res.settlement;
          renderView();
        }
      });
    }
  }

  function renderNotes() {
    const container = document.getElementById('sd-notes-container');
    if (!container || !settlementData) return;
    const notes = settlementData.internal_notes || [];
    const isAr = getLang() === 'ar';

    if (notes.length === 0) {
      container.innerHTML = `<span style="font-size:12px; color:var(--color-text-muted);">${isAr ? 'لا توجد ملاحظات مسجلة' : 'No notes recorded'}</span>`;
      return;
    }

    let html = '';
    notes.forEach(function (n) {
      const author = isAr ? (n.author_ar || n.author) : (n.author_en || n.author);
      const text = isAr ? (n.text_ar || n.text) : (n.text_en || 'Approved for disbursement in weekly bank transfer batch.');
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

  function renderVersionHistory() {
    const container = document.getElementById('version-history-container');
    if (!container || !settlementData) return;
    const vHistory = settlementData.version_history || [];
    const isAr = getLang() === 'ar';

    if (vHistory.length === 0) {
      container.innerHTML = `<span style="font-size:12px; color:var(--color-text-muted);">${isAr ? 'الإصدار الأول الأصلي (v1.0)' : 'Original first version (v1.0)'}</span>`;
      return;
    }

    let html = '';
    vHistory.forEach(function (v) {
      const author = isAr ? (v.author_ar || v.author) : (v.author_en || v.author);
      const changes = isAr ? (v.changes_ar || v.changes) : (v.changes_en || v.changes);
      html += `
        <div style="border:1px solid var(--color-border); border-radius:var(--border-radius-base, 8px); padding:12px; font-size:13px; background:var(--color-bg);">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <strong style="color:var(--color-primary); font-weight:600;">${v.version}</strong>
            <span style="font-size:11px; color:var(--color-text-muted);">${v.date}</span>
          </div>
          <div style="font-size:12px; color:var(--color-text-muted); margin-bottom:4px;">${author}</div>
          <div style="color:var(--color-text-secondary); line-height:1.4;">${changes}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function renderWorkflow() {
    const container = document.getElementById('workflow-timeline-container');
    if (!container || !settlementData) return;
    const workflow = settlementData.workflow_log || [];
    const isAr = getLang() === 'ar';

    if (workflow.length === 0) {
      container.innerHTML = `<span style="font-size:12px; color:var(--color-text-muted);">${isAr ? 'لا توجد خطوات مسجلة' : 'No workflow steps'}</span>`;
      return;
    }

    let html = '';
    workflow.forEach(function (w) {
      const actor = isAr ? (w.actor_ar || w.actor) : (w.actor_en || w.actor);
      const note = isAr ? (w.note_ar || w.note) : (w.note_en || w.note);
      html += `
        <div style="display:flex; gap:12px; align-items:flex-start; font-size:13px;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--color-primary); margin-top:6px; flex-shrink:0;"></div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; gap:8px;">
              <strong style="color:var(--color-text); font-weight:600;">${actor}</strong>
              <span style="font-size:11px; color:var(--color-text-muted);">${w.date}</span>
            </div>
            <div style="color:var(--color-text-secondary); margin-top:2px; line-height:1.4;">${note}</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function setupRoleSimulation() {
    const btnAcc = document.getElementById('role-toggle-accounts');
    const btnAdm = document.getElementById('role-toggle-admin');

    if (btnAcc && btnAdm) {
      btnAcc.addEventListener('click', function () {
        currentSimRole = 'accounts';
        btnAcc.className = 'btn btn-sm is-active';
        btnAdm.className = 'btn btn-sm btn-ghost';
        renderRoleActions();
      });

      btnAdm.addEventListener('click', function () {
        currentSimRole = 'admin';
        btnAdm.className = 'btn btn-sm is-active';
        btnAcc.className = 'btn btn-sm btn-ghost';
        renderRoleActions();
      });
    }

    // Note submit
    const btnNote = document.getElementById('btn-submit-sd-note');
    const inputNote = document.getElementById('sd-input-note');
    if (btnNote && inputNote) {
      btnNote.addEventListener('click', function () {
        const text = inputNote.value.trim();
        if (!text) return;
        const res = window.AccountsMockData.addSettlementNote(currentId, text);
        if (res.success) {
          settlementData.internal_notes = res.notes;
          inputNote.value = '';
          renderNotes();
        }
      });
    }
  }

  function init() {
    loadDetails();
    setupRoleSimulation();

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
