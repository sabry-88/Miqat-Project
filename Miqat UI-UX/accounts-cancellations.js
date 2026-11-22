/**
 * MIQAT ACCOUNTS WORKSPACE — CANCELLATIONS & SETTLEMENTS REGISTER CONTROLLER
 * File: accounts-cancellations.js
 * 
 * Manages:
 * - Summary KPI Cards (Total Requests, Awaiting Review, Pending Refunds, Completed, Failed)
 * - 4 Register Tabs: Current Cancellations, Previous Cancelled Bookings (Archive), All Cancellations, Report Center
 * - Advanced Search & Filters with Active Chips
 * - 13-Column Multi-column Data Table
 * - Direct Excel (.xlsx) Exports for Full Register and Filtered Results
 * - Report Center & Automated Report Interface with Email Preview Modal
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsCancellations = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let currentSection = 'current'; // 'current' | 'archive' | 'all' | 'reports'
  let currentSearch = '';
  let filterSource = 'all';
  let filterCanStatus = 'all';
  let filterRefStatus = 'all';
  let filterDateFrom = '';
  let filterDateTo = '';
  let filterHasPending = false;
  let isAdvancedOpen = false;

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
    if (!window.AccountsMockData || typeof window.AccountsMockData.getCancellationRequests !== 'function') {
      console.warn('AccountsMockData service not yet ready for Cancellations Register');
      setTimeout(init, 100);
      return;
    }

    renderSummaryKPIs();
    renderTabBadges();
    renderRegisterTable();
    renderReportCenter();
    bindEvents();

    // Register refresh listener with AccountsWorkspace if available
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onRefresh === 'function') {
      window.AccountsWorkspace.onRefresh(function () {
        renderSummaryKPIs();
        renderTabBadges();
        renderRegisterTable();
        renderReportCenter();
      });
    }
    window.addEventListener('accounts-lang-changed', function () {
      renderSummaryKPIs();
      renderTabBadges();
      renderRegisterTable();
      renderReportCenter();
    });
  }

  function renderSummaryKPIs() {
    const summary = window.AccountsMockData.getCancellationSummary();
    const elTotal = document.getElementById('kpi-total-requests');
    const elReview = document.getElementById('kpi-awaiting-review');
    const elPending = document.getElementById('kpi-pending-refunds');
    const elPendingVal = document.getElementById('kpi-pending-val');
    const elComp = document.getElementById('kpi-completed-refunds');
    const elCompVal = document.getElementById('kpi-completed-val');
    const elFailed = document.getElementById('kpi-failed-refunds');

    if (elTotal) elTotal.textContent = formatNum(summary.totalRequests);
    if (elReview) elReview.textContent = formatNum(summary.awaitingReview);
    if (elPending) elPending.textContent = formatNum(summary.pendingRefunds);
    if (elPendingVal) elPendingVal.textContent = formatCurrency(summary.totalRefundDuePending) + ' ' + (getLang() === 'ar' ? 'معلق' : 'pending');
    if (elComp) elComp.textContent = formatNum(summary.completedRefunds);
    if (elCompVal) elCompVal.textContent = formatCurrency(summary.totalRefundExecuted) + ' ' + (getLang() === 'ar' ? 'مسدد' : 'settled');
    if (elFailed) elFailed.textContent = formatNum(summary.failedOperations);
  }

  function renderTabBadges() {
    const currentList = window.AccountsMockData.getCancellationRequests({ section: 'current' });
    const archiveList = window.AccountsMockData.getCancellationRequests({ section: 'archive' });
    const allList = window.AccountsMockData.getCancellationRequests({ section: 'all' });

    const badgeCur = document.getElementById('badge-count-current');
    const badgeArc = document.getElementById('badge-count-archive');
    const badgeAll = document.getElementById('badge-count-all');

    if (badgeCur) badgeCur.textContent = formatNum(currentList.length);
    if (badgeArc) badgeArc.textContent = formatNum(archiveList.length);
    if (badgeAll) badgeAll.textContent = formatNum(allList.length);
  }

  function getFilteredRecords() {
    return window.AccountsMockData.getCancellationRequests({
      section: currentSection,
      query: currentSearch,
      source: filterSource,
      cancellation_status: filterCanStatus,
      refund_status: filterRefStatus,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      hasPendingPayments: filterHasPending
    });
  }

  function renderRegisterTable() {
    if (currentSection === 'reports') return;

    const tbody = document.getElementById('can-table-body');
    const emptyState = document.getElementById('can-empty-state');
    if (!tbody) return;

    const records = getFilteredRecords();
    const lang = getLang();

    updateChipsBar();

    if (records.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = records.map(r => {
      const custName = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
      const compName = lang === 'ar' ? r.company_name_ar : (r.company_name_en || r.company_name_ar);

      // Source Badge
      let sourceBadge = '';
      if (r.source === 'customer') {
        sourceBadge = `<span class="can-status-badge can-badge-source">${t('can_source_customer_badge', 'طلب عميل', 'Customer Request')}</span>`;
      } else {
        sourceBadge = `<span class="can-status-badge can-badge-source">${t('can_source_company_badge', 'طلب شركة', 'Agency Request')}</span>`;
      }

      // Cancellation Status Badge (Zero-Red/Zero-Green compliant)
      let canStatusBadge = '';
      if (r.cancellation_status === 'under_review') {
        canStatusBadge = `<span class="can-status-badge can-badge-under-review">${t('can_status_under_review', 'قيد المراجعة والتدقيق', 'Under Review & Audit')}</span>`;
      } else if (r.cancellation_status === 'cancelled') {
        canStatusBadge = `<span class="can-status-badge can-badge-approved">${t('can_status_approved', 'ملغي معتمد', 'Cancelled & Approved')}</span>`;
      } else if (r.cancellation_status === 'rejected') {
        canStatusBadge = `<span class="can-status-badge can-badge-rejected" title="${escapeHtml(lang === 'ar' ? r.rejection_reason_ar : r.rejection_reason_en)}">${t('can_status_rejected', 'مرفوض وتثبيت الحجز', 'Rejected (Booking Retained)')}</span>`;
      }

      // Refund Status Badge
      let refStatusBadge = '';
      if (r.refund_status === 'pending') {
        refStatusBadge = `<span class="can-status-badge can-badge-pending">${t('can_ref_status_pending', 'بانتظار التحويل', 'Pending Wire')}</span>`;
      } else if (r.refund_status === 'processing') {
        refStatusBadge = `<span class="can-status-badge can-badge-processing">${t('can_ref_status_processing', 'قيد المعالجة البنكية', 'Processing with Bank')}</span>`;
      } else if (r.refund_status === 'completed') {
        refStatusBadge = `<span class="can-status-badge can-badge-completed">${t('can_ref_status_completed', 'مكتمل ومؤكد بنكياً', 'Completed & Confirmed')}</span>`;
      } else if (r.refund_status === 'failed') {
        refStatusBadge = `<span class="can-status-badge can-badge-failed" title="${escapeHtml(r.refund_operations && r.refund_operations[0] ? (lang === 'ar' ? r.refund_operations[0].notes_ar : r.refund_operations[0].notes_en) : '')}">${t('can_ref_status_failed', 'عملية تحويل متعثرة', 'Failed Wire (Bounced)')}</span>`;
      } else {
        refStatusBadge = `<span class="can-status-badge can-badge-rejected">${t('can_ref_status_none', 'لا يوجد استرداد (مرفوض)', 'No Refund (Rejected)')}</span>`;
      }

      return `
        <tr>
          <td class="can-id-cell">
            <a href="accounts-cancellation-details.html?id=${encodeURIComponent(r.id)}" style="color: inherit; text-decoration: none; font-weight: 800;">
              ${escapeHtml(r.id)}
            </a>
          </td>
          <td class="can-id-cell" style="font-size: 0.78rem;">
            ${escapeHtml(r.booking_id)}
          </td>
          <td style="font-weight: 600;">
            <a href="accounts-customer-details.html?id=${encodeURIComponent(r.customer_id)}" style="color: inherit; text-decoration: none;">
              ${escapeHtml(custName)}
            </a>
            <div style="font-size: 0.72rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums;">${escapeHtml(r.customer_phone)}</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; font-weight: 500;">${escapeHtml(compName)}</div>
          </td>
          <td>${sourceBadge}</td>
          <td class="can-date-cell">${escapeHtml(r.created_at)}</td>
          <td class="can-num-cell">${formatCurrency(r.financials.booking_total)}</td>
          <td class="can-num-cell">
            ${formatCurrency(r.financials.approved_paid)}
            ${r.financials.pending_paid > 0 ? `<div style="font-size: 0.7rem; color: var(--color-accent); font-weight: 600;">(${formatCurrency(r.financials.pending_paid)} ${lang === 'ar' ? 'معلق مستثنى' : 'pending excl'})</div>` : ''}
          </td>
          <td class="can-num-cell" style="font-weight: 800; color: var(--color-primary);">
            ${formatCurrency(r.financials.refund_due)}
          </td>
          <td>${canStatusBadge}</td>
          <td>${refStatusBadge}</td>
          <td class="can-date-cell">${escapeHtml(r.updated_at || r.created_at)}</td>
          <td>
            <a href="accounts-cancellation-details.html?id=${encodeURIComponent(r.id)}" class="btn btn-secondary btn-sm" style="white-space: nowrap; padding: 5px 10px; font-size: 0.78rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-inline-end: 4px;">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${t('can_action_view_details', 'عرض التفاصيل', 'View Details')}</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateChipsBar() {
    const chipsBar = document.getElementById('can-chips-bar');
    const chipsList = document.getElementById('can-chips-list');
    if (!chipsBar || !chipsList) return;

    const chips = [];
    const lang = getLang();

    if (currentSearch) {
      chips.push({
        id: 'search',
        label: (lang === 'ar' ? 'بحث: ' : 'Search: ') + currentSearch,
        onRemove: () => {
          currentSearch = '';
          const inp = document.getElementById('can-search-input');
          if (inp) inp.value = '';
          renderRegisterTable();
        }
      });
    }

    if (filterSource !== 'all') {
      const srcText = filterSource === 'customer' 
        ? t('can_filter_source_customer', 'طلب عميل', 'Customer')
        : t('can_filter_source_company', 'طلب شركة', 'Agency');
      chips.push({
        id: 'source',
        label: (lang === 'ar' ? 'المصدر: ' : 'Source: ') + srcText,
        onRemove: () => {
          filterSource = 'all';
          const sel = document.getElementById('can-filter-source');
          if (sel) sel.value = 'all';
          renderRegisterTable();
        }
      });
    }

    if (filterCanStatus !== 'all') {
      let stText = filterCanStatus;
      if (filterCanStatus === 'under_review') stText = t('can_status_under_review', 'قيد المراجعة', 'Under Review');
      if (filterCanStatus === 'cancelled') stText = t('can_status_approved', 'ملغي معتمد', 'Cancelled & Approved');
      if (filterCanStatus === 'rejected') stText = t('can_status_rejected', 'مرفوض', 'Rejected');
      chips.push({
        id: 'can_status',
        label: (lang === 'ar' ? 'حالة الإلغاء: ' : 'Can. Status: ') + stText,
        onRemove: () => {
          filterCanStatus = 'all';
          const sel = document.getElementById('can-filter-cancellation-status');
          if (sel) sel.value = 'all';
          renderRegisterTable();
        }
      });
    }

    if (filterRefStatus !== 'all') {
      let refText = filterRefStatus;
      if (filterRefStatus === 'pending') refText = t('can_ref_status_pending', 'بانتظار التحويل', 'Pending Wire');
      if (filterRefStatus === 'processing') refText = t('can_ref_status_processing', 'قيد المعالجة', 'Processing');
      if (filterRefStatus === 'completed') refText = t('can_ref_status_completed', 'مكتمل', 'Completed');
      if (filterRefStatus === 'failed') refText = t('can_ref_status_failed', 'متعثر', 'Failed');
      chips.push({
        id: 'ref_status',
        label: (lang === 'ar' ? 'حالة الاسترداد: ' : 'Refund: ') + refText,
        onRemove: () => {
          filterRefStatus = 'all';
          const sel = document.getElementById('can-filter-refund-status');
          if (sel) sel.value = 'all';
          renderRegisterTable();
        }
      });
    }

    if (filterDateFrom) {
      chips.push({
        id: 'date_from',
        label: (lang === 'ar' ? 'من: ' : 'From: ') + filterDateFrom,
        onRemove: () => {
          filterDateFrom = '';
          const inp = document.getElementById('can-filter-date-from');
          if (inp) inp.value = '';
          renderRegisterTable();
        }
      });
    }

    if (filterDateTo) {
      chips.push({
        id: 'date_to',
        label: (lang === 'ar' ? 'إلى: ' : 'To: ') + filterDateTo,
        onRemove: () => {
          filterDateTo = '';
          const inp = document.getElementById('can-filter-date-to');
          if (inp) inp.value = '';
          renderRegisterTable();
        }
      });
    }

    if (filterHasPending) {
      chips.push({
        id: 'has_pending',
        label: lang === 'ar' ? 'مدفوعات معلقة مستثناة' : 'Pending Payments Excluded',
        onRemove: () => {
          filterHasPending = false;
          const chk = document.getElementById('can-filter-has-pending');
          if (chk) chk.checked = false;
          renderRegisterTable();
        }
      });
    }

    if (chips.length === 0) {
      chipsBar.style.display = 'none';
      chipsList.innerHTML = '';
      return;
    }

    chipsBar.style.display = 'flex';
    chipsList.innerHTML = chips.map((c, idx) => `
      <span class="can-chip">
        <span>${escapeHtml(c.label)}</span>
        <button type="button" class="can-chip-remove" data-chip-idx="${idx}" aria-label="حذف الفلتر">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('');

    chipsList.querySelectorAll('.can-chip-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = Number(this.getAttribute('data-chip-idx'));
        if (chips[idx] && typeof chips[idx].onRemove === 'function') {
          chips[idx].onRemove();
        }
      });
    });
  }

  function renderReportCenter() {
    const templatesContainer = document.getElementById('can-scheduled-templates-grid');
    const historyContainer = document.getElementById('can-report-history-body');
    if (!templatesContainer || !historyContainer) return;

    const lang = getLang();
    const templates = window.AccountsMockData.getScheduledReportTemplates();
    const history = window.AccountsMockData.getReportHistory();

    // Render Scheduled Templates
    templatesContainer.innerHTML = templates.map(tmpl => {
      const title = lang === 'ar' ? tmpl.name_ar : tmpl.name_en;
      const freq = lang === 'ar' ? tmpl.frequency_ar : tmpl.frequency_en;
      const desc = lang === 'ar' ? tmpl.description_ar : tmpl.description_en;
      const st = lang === 'ar' ? tmpl.status_ar : tmpl.status_en;

      return `
        <div class="can-report-card">
          <div class="can-report-card-header">
            <div class="can-report-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <h4 class="can-report-card-title">${escapeHtml(title)}</h4>
              <span class="can-status-badge can-badge-approved" style="margin-top: 4px;">${escapeHtml(st)}</span>
            </div>
          </div>
          <p class="can-report-card-desc">${escapeHtml(desc)}</p>
          <div class="can-report-meta-box">
            <div><strong>${lang === 'ar' ? 'التكرار:' : 'Frequency:'}</strong> ${escapeHtml(freq)}</div>
            <div><strong>${t('can_rep_next_run', 'موعد التشغيل القادم:', 'Next Execution:')}</strong> <span style="font-variant-numeric: tabular-nums;">${escapeHtml(tmpl.next_run)}</span></div>
            <div><strong>${t('can_rep_recipients', 'المستلمون:', 'Recipients:')}</strong> ${escapeHtml(tmpl.recipients.join(', '))}</div>
            <div><strong>${lang === 'ar' ? 'الصيغة:' : 'Format:'}</strong> ${escapeHtml(tmpl.format)}</div>
          </div>
          <div style="margin-top: auto; padding-top: 10px;">
            <button type="button" class="btn btn-secondary btn-sm can-btn-preview-email" data-tmpl-id="${tmpl.id}" style="width: 100%; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>${t('can_rep_btn_preview_email', 'معاينة الإشعار البريدي الدوري', 'Preview Email Dispatch')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind preview email buttons
    templatesContainer.querySelectorAll('.can-btn-preview-email').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-tmpl-id');
        openEmailPreviewModal(id);
      });
    });

    // Render Past History Table
    historyContainer.innerHTML = history.map(item => {
      const hTitle = lang === 'ar' ? item.title_ar : item.title_en;
      const hGenBy = lang === 'ar' ? item.generated_by_ar : item.generated_by_en;

      return `
        <tr>
          <td class="can-id-cell">${escapeHtml(item.id)}</td>
          <td style="font-weight: 600;">${escapeHtml(hTitle)}</td>
          <td class="can-date-cell">${escapeHtml(item.generated_at)}</td>
          <td>${escapeHtml(hGenBy)}</td>
          <td class="can-num-cell">${formatNum(item.records_count)}</td>
          <td class="can-num-cell">${escapeHtml(item.file_size)}</td>
          <td>
            <button type="button" class="btn btn-secondary btn-sm can-btn-download-history" data-filename="${escapeHtml(item.filename)}" style="padding: 4px 10px; font-size: 0.76rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${lang === 'ar' ? 'تنزيل' : 'Download'}</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind download history buttons
    historyContainer.querySelectorAll('.can-btn-download-history').forEach(btn => {
      btn.addEventListener('click', function () {
        exportTableToExcel(window.AccountsMockData.getCancellationRequests({ section: 'all' }), this.getAttribute('data-filename') || 'Miqat_Cancellations_Export.xlsx');
      });
    });
  }

  function openEmailPreviewModal(templateId) {
    const modal = document.getElementById('can-email-preview-modal');
    if (!modal) return;

    const templates = window.AccountsMockData.getScheduledReportTemplates();
    const tmpl = templates.find(t => t.id === templateId) || templates[0];
    const summary = window.AccountsMockData.getCancellationSummary();
    const lang = getLang();

    const elTo = document.getElementById('email-preview-to');
    const elSubj = document.getElementById('email-preview-subject');
    const elAtt = document.getElementById('email-preview-attachment');

    if (elTo) elTo.textContent = tmpl.recipients.join(', ');
    if (elSubj) elSubj.textContent = (lang === 'ar' ? 'تقرير دوري: ' : 'Periodic Audit: ') + (lang === 'ar' ? tmpl.name_ar : tmpl.name_en);
    if (elAtt) elAtt.textContent = (tmpl.name_en.replace(/ /g, '_')) + '.xlsx (Excel)';

    const elKpiTot = document.getElementById('email-kpi-total');
    const elKpiRev = document.getElementById('email-kpi-under-review');
    const elKpiPen = document.getElementById('email-kpi-pending-refunds');
    const elKpiCom = document.getElementById('email-kpi-completed-refunds');
    const elKpiFai = document.getElementById('email-kpi-failed');

    if (elKpiTot) elKpiTot.textContent = formatNum(summary.totalRequests) + ' ' + (lang === 'ar' ? 'طلب' : 'requests');
    if (elKpiRev) elKpiRev.textContent = formatNum(summary.awaitingReview) + ' ' + (lang === 'ar' ? 'طلب' : 'requests');
    if (elKpiPen) elKpiPen.textContent = formatCurrency(summary.totalRefundDuePending);
    if (elKpiCom) elKpiCom.textContent = formatCurrency(summary.totalRefundExecuted);
    if (elKpiFai) elKpiFai.textContent = formatNum(summary.failedOperations) + ' ' + (lang === 'ar' ? 'عمليات' : 'ops');

    modal.classList.add('is-open');
  }

  function closeEmailPreviewModal() {
    const modal = document.getElementById('can-email-preview-modal');
    if (modal) modal.classList.remove('is-open');
  }

  function exportTableToExcel(records, filename) {
    if (!window.XLSX) {
      alert(getLang() === 'ar' ? 'مكتبة تصدير Excel غير متوفرة حالياً' : 'XLSX export library unavailable');
      return;
    }

    const lang = getLang();
    const rows = records.map(r => {
      if (lang === 'ar') {
        const canStAr = r.cancellation_status === 'under_review' ? 'قيد المراجعة والتدقيق' : (r.cancellation_status === 'cancelled' ? 'ملغي معتمد' : 'مرفوض');
        const refStAr = r.refund_status === 'pending' ? 'بانتظار التحويل' : (r.refund_status === 'processing' ? 'قيد المعالجة البنكية' : (r.refund_status === 'completed' ? 'مكتمل ومؤكد بنكياً' : (r.refund_status === 'failed' ? 'عملية تحويل متعثرة' : 'لا يوجد استرداد')));
        return {
          'رقم الإلغاء': r.id,
          'رقم الحجز': r.booking_id,
          'اسم العميل': r.customer_name_ar,
          'الهاتف': r.customer_phone,
          'شركة السياحة': r.company_name_ar,
          'مصدر الطلب': r.source === 'customer' ? 'طلب عميل' : 'طلب شركة السياحة',
          'تاريخ الطلب': r.created_at,
          'إجمالي الحجز (ج.م)': r.financials.booking_total,
          'المدفوع المعتمد (ج.م)': r.financials.approved_paid,
          'المعلق المستثنى (ج.م)': r.financials.pending_paid,
          'المستحق للاسترداد (ج.م)': r.financials.refund_due,
          'المنفذ بنكياً (ج.م)': r.financials.executed_refund,
          'حالة الإلغاء': canStAr,
          'حالة الاسترداد': refStAr,
          'سبب الإلغاء': r.cancellation_reason_ar
        };
      } else {
        const canStEn = r.cancellation_status === 'under_review' ? 'Under Review & Audit' : (r.cancellation_status === 'cancelled' ? 'Cancelled & Approved' : 'Rejected');
        const refStEn = r.refund_status === 'pending' ? 'Pending Wire' : (r.refund_status === 'processing' ? 'Processing with Bank' : (r.refund_status === 'completed' ? 'Completed & Confirmed' : (r.refund_status === 'failed' ? 'Failed Wire' : 'No Refund')));
        return {
          'Cancellation ID': r.id,
          'Booking Ref': r.booking_id,
          'Customer Name': r.customer_name_en || r.customer_name_ar,
          'Phone': r.customer_phone,
          'Tourism Agency': r.company_name_en || r.company_name_ar,
          'Source': r.source === 'customer' ? 'Customer Request' : 'Agency Request',
          'Request Date': r.created_at,
          'Booking Total (EGP)': r.financials.booking_total,
          'Approved Paid (EGP)': r.financials.approved_paid,
          'Pending Excluded (EGP)': r.financials.pending_paid,
          'Refund Due (EGP)': r.financials.refund_due,
          'Executed Refund (EGP)': r.financials.executed_refund,
          'Cancellation Status': canStEn,
          'Refund Status': refStEn,
          'Cancellation Reason': r.cancellation_reason_en || r.cancellation_reason_ar
        };
      }
    });

    const worksheet = window.XLSX.utils.json_to_sheet(rows);
    const workbook = window.XLSX.utils.book_new();
    const sheetName = lang === 'ar' ? 'سجل_الإلغاءات' : 'Cancellations';
    window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const defaultFilename = (lang === 'ar' ? 'سجل_الإلغاءات_ميقات_' : 'Miqat_Cancellations_') + Date.now() + '.xlsx';
    window.XLSX.writeFile(workbook, filename || defaultFilename);
  }

  function bindEvents() {
    // 4 Section Tabs
    const tabs = ['current', 'archive', 'all', 'reports'];
    tabs.forEach(sec => {
      const btn = document.getElementById('can-tab-' + sec);
      if (btn) {
        btn.addEventListener('click', function () {
          currentSection = sec;
          tabs.forEach(s => {
            const b = document.getElementById('can-tab-' + s);
            if (b) {
              b.classList.toggle('is-active', s === sec);
              b.setAttribute('aria-selected', s === sec ? 'true' : 'false');
            }
          });

          const regView = document.getElementById('can-register-view');
          const repView = document.getElementById('can-reports-view');

          if (sec === 'reports') {
            if (regView) regView.style.display = 'none';
            if (repView) repView.style.display = 'block';
            renderReportCenter();
          } else {
            if (regView) regView.style.display = 'block';
            if (repView) repView.style.display = 'none';
            renderRegisterTable();
          }
        });
      }
    });

    // Search Input
    const searchInput = document.getElementById('can-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = this.value;
        renderRegisterTable();
      });
    }

    // Source Filter
    const selSource = document.getElementById('can-filter-source');
    if (selSource) {
      selSource.addEventListener('change', function () {
        filterSource = this.value;
        renderRegisterTable();
      });
    }

    // Cancellation Status Filter
    const selCanStatus = document.getElementById('can-filter-cancellation-status');
    if (selCanStatus) {
      selCanStatus.addEventListener('change', function () {
        filterCanStatus = this.value;
        renderRegisterTable();
      });
    }

    // Refund Status Filter
    const selRefStatus = document.getElementById('can-filter-refund-status');
    if (selRefStatus) {
      selRefStatus.addEventListener('change', function () {
        filterRefStatus = this.value;
        renderRegisterTable();
      });
    }

    // Advanced Panel Toggle
    const btnAdv = document.getElementById('can-btn-advanced-toggle');
    const advPanel = document.getElementById('can-advanced-panel');
    if (btnAdv && advPanel) {
      btnAdv.addEventListener('click', function () {
        isAdvancedOpen = !isAdvancedOpen;
        advPanel.classList.toggle('is-open', isAdvancedOpen);
      });
    }

    // Advanced Inputs
    const dateFrom = document.getElementById('can-filter-date-from');
    if (dateFrom) {
      dateFrom.addEventListener('change', function () {
        filterDateFrom = this.value;
        renderRegisterTable();
      });
    }

    const dateTo = document.getElementById('can-filter-date-to');
    if (dateTo) {
      dateTo.addEventListener('change', function () {
        filterDateTo = this.value;
        renderRegisterTable();
      });
    }

    const chkPending = document.getElementById('can-filter-has-pending');
    if (chkPending) {
      chkPending.addEventListener('change', function () {
        filterHasPending = this.checked;
        renderRegisterTable();
      });
    }

    // Clear Filters Button
    const btnClear = document.getElementById('can-btn-clear-filters');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        currentSearch = '';
        filterSource = 'all';
        filterCanStatus = 'all';
        filterRefStatus = 'all';
        filterDateFrom = '';
        filterDateTo = '';
        filterHasPending = false;

        if (searchInput) searchInput.value = '';
        if (selSource) selSource.value = 'all';
        if (selCanStatus) selCanStatus.value = 'all';
        if (selRefStatus) selRefStatus.value = 'all';
        if (dateFrom) dateFrom.value = '';
        if (dateTo) dateTo.value = '';
        if (chkPending) chkPending.checked = false;

        renderRegisterTable();
      });
    }

    // Quick Export Header Button (All Records)
    const btnQuickExp = document.getElementById('can-btn-quick-export');
    if (btnQuickExp) {
      btnQuickExp.addEventListener('click', function () {
        const all = window.AccountsMockData.getCancellationRequests({ section: 'all' });
        exportTableToExcel(all, 'Miqat_Cancellations_Full_Register.xlsx');
      });
    }

    // Export Filtered Results Button
    const btnExpFiltered = document.getElementById('can-btn-export-filtered');
    if (btnExpFiltered) {
      btnExpFiltered.addEventListener('click', function () {
        const records = getFilteredRecords();
        exportTableToExcel(records, 'Miqat_Cancellations_' + currentSection + '_Export.xlsx');
      });
    }

    // Manual Report Generator Button
    const btnManualRep = document.getElementById('can-btn-generate-manual-report');
    if (btnManualRep) {
      btnManualRep.addEventListener('click', function () {
        const sec = document.getElementById('can-report-param-section') ? document.getElementById('can-report-param-section').value : 'all';
        const from = document.getElementById('can-report-param-from') ? document.getElementById('can-report-param-from').value : '';
        const to = document.getElementById('can-report-param-to') ? document.getElementById('can-report-param-to').value : '';

        const records = window.AccountsMockData.getCancellationRequests({
          section: sec,
          dateFrom: from,
          dateTo: to
        });
        exportTableToExcel(records, 'Miqat_Custom_Cancellations_' + (from || 'start') + '_to_' + (to || 'end') + '.xlsx');
      });
    }

    // Close Email Modal
    const btnEmailClose = document.getElementById('can-email-modal-close');
    const btnEmailDismiss = document.getElementById('can-email-modal-dismiss');
    if (btnEmailClose) btnEmailClose.addEventListener('click', closeEmailPreviewModal);
    if (btnEmailDismiss) btnEmailDismiss.addEventListener('click', closeEmailPreviewModal);

    // Click outside modal to close
    const emailModal = document.getElementById('can-email-preview-modal');
    if (emailModal) {
      emailModal.addEventListener('click', function (e) {
        if (e.target === emailModal) closeEmailPreviewModal();
      });
    }
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init: init,
    exportTableToExcel: exportTableToExcel
  };
});
