/**
 * MIQAT ACCOUNTS WORKSPACE — REFUND REQUESTS MANAGEMENT (PAGE 8)
 * Controller Engine for Main Page
 */
(function () {
  'use strict';

  let currentLang = localStorage.getItem('miqat_lang') || 'ar';
  let activeFilters = {
    search: '',
    status: 'all',
    source: 'all',
    date_range: 'all',
    refund_type: 'all',
    company: 'all'
  };

  let pagination = {
    page: 1,
    pageSize: 10
  };

  // Status Pill Class Resolver (Zero Red / Zero Green standard)
  function getStatusPillInfo(status, lang) {
    const map = {
      refund_requested: {
        pillClass: 'status-pill-blue',
        ar: 'طلب جديد',
        en: 'New Request'
      },
      under_review: {
        pillClass: 'status-pill-amber',
        ar: 'قيد التدقيق المحاسبي',
        en: 'Under Review'
      },
      pending_admin_approval: {
        pillClass: 'status-pill-amber',
        ar: 'بانتظار اعتماد الإدارة',
        en: 'Pending Admin Approval'
      },
      returned_for_review: {
        pillClass: 'status-pill-slate',
        ar: 'مُعاد للمراجعة',
        en: 'Returned for Review'
      },
      approved_for_refund: {
        pillClass: 'status-pill-navy',
        ar: 'معتمد للصرف',
        en: 'Approved for Refund'
      },
      partially_refunded: {
        pillClass: 'status-pill-amber',
        ar: 'مسترد جزئياً',
        en: 'Partially Refunded'
      },
      awaiting_customer_confirmation: {
        pillClass: 'status-pill-amber',
        ar: 'بانتظار تأكيد العميل',
        en: 'Awaiting Customer Confirmation'
      },
      refund_dispute: {
        pillClass: 'status-pill-slate',
        ar: 'نزاع مالي مفتوح',
        en: 'Refund Dispute'
      },
      refund_completed: {
        pillClass: 'status-pill-navy',
        ar: 'استرداد مكتمل ومؤكد',
        en: 'Refund Completed'
      }
    };

    return map[status] || {
      pillClass: 'status-pill-slate',
      ar: status,
      en: status
    };
  }

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

  // Render Summary KPI Cards
  function renderKPICards() {
    if (!window.AccountsMockData) return;
    const kpis = window.AccountsMockData.getRefundsSummaryKPIs(activeFilters);

    const elTotal = document.getElementById('kpi-total-requests');
    const elReview = document.getElementById('kpi-requiring-review');
    const elAdmin = document.getElementById('kpi-pending-admin');
    const elConf = document.getElementById('kpi-awaiting-conf');
    const elRequested = document.getElementById('kpi-total-requested');
    const elRefunded = document.getElementById('kpi-total-refunded');

    if (elTotal) elTotal.textContent = formatNumber(kpis.totalRequests);
    if (elReview) elReview.textContent = formatNumber(kpis.requiringReview);
    if (elAdmin) elAdmin.textContent = formatNumber(kpis.pendingAdmin);
    if (elConf) elConf.textContent = formatNumber(kpis.awaitingConfirmation);
    if (elRequested) elRequested.textContent = formatCurrency(kpis.totalRequested);
    if (elRefunded) elRefunded.textContent = formatCurrency(kpis.totalRefunded);
  }

  // Render Recent Activity Section
  function renderRecentActivity() {
    if (!window.AccountsMockData) return;
    const container = document.getElementById('ref-activity-list');
    const countBadge = document.getElementById('ref-activity-count');
    if (!container) return;

    const activities = window.AccountsMockData.getRefundRecentActivities(10);
    if (countBadge) {
      countBadge.textContent = currentLang === 'ar' 
        ? (formatNumber(activities.length) + ' أحداث تشغيلية حديثة')
        : (formatNumber(activities.length) + ' Recent Operations');
    }

    if (!activities.length) {
      container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--color-text-muted);">
        ${currentLang === 'ar' ? 'لا توجد نشاطات مسجلة حالياً' : 'No recorded activity'}
      </div>`;
      return;
    }

    const html = activities.map(act => {
      const pill = getStatusPillInfo(act.status_badge || 'under_review', currentLang);
      const title = currentLang === 'ar' ? act.title_ar : act.title_en;
      const desc = currentLang === 'ar' ? act.desc_ar : act.desc_en;
      const btnText = currentLang === 'ar' ? 'عرض الطلب' : 'View Request';

      let iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>`;

      if (act.action_type === 'admin_approved' || act.action_type === 'customer_confirmed') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`;
      } else if (act.action_type === 'transfer_recorded') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>`;
      } else if (act.action_type === 'dispute_opened' || act.action_type === 'admin_returned') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`;
      }

      return `
        <div class="ref-activity-item">
          <div class="ref-activity-left">
            <div class="ref-activity-icon">${iconSvg}</div>
            <div class="ref-activity-info">
              <div class="ref-activity-title-text">
                <span>${title}</span>
                <span class="ref-status-pill ${pill.pillClass}">${currentLang === 'ar' ? pill.ar : pill.en}</span>
              </div>
              <p class="ref-activity-desc-text" title="${desc}">${desc}</p>
            </div>
          </div>
          <div class="ref-activity-right">
            <span class="ref-activity-time">${act.timestamp}</span>
            <a href="accounts-refund-details.html?id=${act.refund_id}" class="btn btn-secondary btn-sm ref-activity-link">
              <span>${btnText}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  // Render Main Register Table
  function renderTable() {
    if (!window.AccountsMockData) return;
    const tbody = document.getElementById('refunds-tbody');
    const countText = document.getElementById('refunds-count-text');
    if (!tbody) return;

    let items = window.AccountsMockData.getRefundsList(activeFilters);

    // Apply company filter if selected in advanced
    if (activeFilters.company && activeFilters.company !== 'all') {
      items = items.filter(r => r.company_id === activeFilters.company);
    }

    const totalCount = items.length;

    // Pagination slice
    const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;
    if (pagination.page > totalPages) pagination.page = totalPages;
    const startIdx = (pagination.page - 1) * pagination.pageSize;
    const pageItems = items.slice(startIdx, startIdx + pagination.pageSize);

    if (countText) {
      countText.textContent = currentLang === 'ar'
        ? `عرض ${formatNumber(pageItems.length)} من إجمالي ${formatNumber(totalCount)} طلب استرداد`
        : `Showing ${formatNumber(pageItems.length)} of ${formatNumber(totalCount)} refund requests`;
    }

    const pageIndicator = document.getElementById('ref-page-indicator');
    if (pageIndicator) {
      pageIndicator.textContent = currentLang === 'ar'
        ? `صفحة ${formatNumber(pagination.page)} من ${formatNumber(totalPages)}`
        : `Page ${formatNumber(pagination.page)} of ${formatNumber(totalPages)}`;
    }

    const btnPrev = document.getElementById('ref-prev-page');
    const btnNext = document.getElementById('ref-next-page');
    if (btnPrev) btnPrev.disabled = pagination.page <= 1;
    if (btnNext) btnNext.disabled = pagination.page >= totalPages;

    if (!pageItems.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; padding: 30px; color: var(--color-text-muted);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; opacity: 0.6;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p style="margin: 0; font-size: 0.88rem;">${currentLang === 'ar' ? 'لا توجد طلبات استرداد مطابقة لشروط البحث والتصفية' : 'No refund requests match search and filter criteria'}</p>
          </td>
        </tr>
      `;
      return;
    }

    const rowsHtml = pageItems.map(r => {
      const pill = getStatusPillInfo(r.status, currentLang);
      const customerName = currentLang === 'ar' ? r.customer_name_ar : r.customer_name_en;
      const sourceName = currentLang === 'ar' ? r.source_ar : r.source_en;
      const typeName = currentLang === 'ar' ? r.refund_type_ar : r.refund_type_en;
      const viewText = currentLang === 'ar' ? 'عرض وتدقيق' : 'View & Audit';

      const requestedStr = formatCurrency(r.financials ? r.financials.requested_amount : 0);
      const approvedStr = r.financials && r.financials.approved_amount !== null
        ? formatCurrency(r.financials.approved_amount)
        : (currentLang === 'ar' ? 'قيد المراجعة' : 'Pending');
      const refundedStr = formatCurrency(r.financials ? r.financials.actually_refunded : 0);
      const remainingStr = formatCurrency(r.financials ? r.financials.remaining_to_refund : 0);

      return `
        <tr>
          <td>
            <a href="accounts-refund-details.html?id=${r.id}" style="font-weight: 700; color: var(--color-primary); text-decoration: none; font-family: var(--font-mono, monospace);">
              ${r.id}
            </a>
          </td>
          <td>
            <span style="font-family: var(--font-mono, monospace); font-size: 0.78rem; color: var(--color-text-muted);">${r.booking_id}</span>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--color-text);">${customerName}</div>
            <div style="font-size: 0.72rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums;">${r.customer_phone || ''}</div>
          </td>
          <td>
            <span style="font-size: 0.78rem; font-weight: 500;">${sourceName}</span>
          </td>
          <td>
            <span style="font-size: 0.76rem; font-variant-numeric: tabular-nums;">${r.request_date}</span>
          </td>
          <td>
            <span style="font-size: 0.78rem;">${typeName}</span>
          </td>
          <td class="ref-col-num">
            <span>${requestedStr}</span>
          </td>
          <td class="ref-col-num">
            <span style="color: ${r.financials && r.financials.approved_amount ? 'var(--color-primary)' : 'var(--color-text-muted)'};">${approvedStr}</span>
          </td>
          <td class="ref-col-num">
            <span style="font-weight: 700; color: var(--color-accent);">${refundedStr}</span>
          </td>
          <td class="ref-col-num">
            <span style="font-weight: 700;">${remainingStr}</span>
          </td>
          <td>
            <span class="ref-status-pill ${pill.pillClass}">
              ${currentLang === 'ar' ? pill.ar : pill.en}
            </span>
          </td>
          <td>
            <span style="font-size: 0.74rem; color: var(--color-text-muted); font-variant-numeric: tabular-nums;">${r.last_updated}</span>
          </td>
          <td class="ref-col-actions">
            <a href="accounts-refund-details.html?id=${r.id}" class="btn btn-secondary btn-sm ref-btn-action" style="display: inline-flex; align-items: center; gap: 4px; font-weight: 600; text-decoration: none;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${viewText}</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml;
  }

  // Export to Excel
  function exportToExcel() {
    if (!window.AccountsMockData || typeof XLSX === 'undefined') {
      alert(currentLang === 'ar' ? 'مكتبة التصدير غير جاهزة حالياً' : 'Export library not ready');
      return;
    }

    const items = window.AccountsMockData.getRefundsList(activeFilters);
    const data = items.map(r => ({
      [currentLang === 'ar' ? 'رقم الطلب' : 'Request ID']: r.id,
      [currentLang === 'ar' ? 'رقم الحجز' : 'Booking ID']: r.booking_id,
      [currentLang === 'ar' ? 'اسم العميل' : 'Customer Name']: currentLang === 'ar' ? r.customer_name_ar : r.customer_name_en,
      [currentLang === 'ar' ? 'جهة الطلب' : 'Source']: currentLang === 'ar' ? r.source_ar : r.source_en,
      [currentLang === 'ar' ? 'تاريخ الطلب' : 'Request Date']: r.request_date,
      [currentLang === 'ar' ? 'نوع الاسترداد' : 'Refund Type']: currentLang === 'ar' ? r.refund_type_ar : r.refund_type_en,
      [currentLang === 'ar' ? 'المبلغ المطلوب' : 'Requested Amount']: r.financials ? r.financials.requested_amount : 0,
      [currentLang === 'ar' ? 'المبلغ المعتمد' : 'Approved Amount']: r.financials ? (r.financials.approved_amount || 0) : 0,
      [currentLang === 'ar' ? 'المنفذ فعلياً' : 'Actually Refunded']: r.financials ? r.financials.actually_refunded : 0,
      [currentLang === 'ar' ? 'المتبقي للصرف' : 'Remaining']: r.financials ? r.financials.remaining_to_refund : 0,
      [currentLang === 'ar' ? 'حالة الطلب' : 'Status']: currentLang === 'ar' ? r.status_ar : r.status_en,
      [currentLang === 'ar' ? 'آخر تحديث' : 'Last Updated']: r.last_updated
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Refund_Requests');
    XLSX.writeFile(wb, 'Miqat_Refund_Requests_Register_2026.xlsx');
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('ref-filter-search');
    if (searchInput) {
      let timer = null;
      searchInput.addEventListener('input', function (e) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          activeFilters.search = e.target.value.trim();
          pagination.page = 1;
          renderTable();
          renderKPICards();
        }, 200);
      });
    }

    // Status filter
    const statusSelect = document.getElementById('ref-filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', function (e) {
        activeFilters.status = e.target.value;
        pagination.page = 1;
        renderTable();
        renderKPICards();
      });
    }

    // Source filter
    const sourceSelect = document.getElementById('ref-filter-source');
    if (sourceSelect) {
      sourceSelect.addEventListener('change', function (e) {
        activeFilters.source = e.target.value;
        pagination.page = 1;
        renderTable();
        renderKPICards();
      });
    }

    // Date range filter
    const dateSelect = document.getElementById('ref-filter-date');
    if (dateSelect) {
      dateSelect.addEventListener('change', function (e) {
        activeFilters.date_range = e.target.value;
        pagination.page = 1;
        renderTable();
        renderKPICards();
      });
    }

    // Advanced toggle
    const advBtn = document.getElementById('ref-btn-toggle-advanced');
    const advPanel = document.getElementById('ref-advanced-filters-panel');
    if (advBtn && advPanel) {
      advBtn.addEventListener('click', function () {
        const isHidden = advPanel.style.display === 'none';
        advPanel.style.display = isHidden ? 'block' : 'none';
        advBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });
    }

    // Advanced Type filter
    const typeSelect = document.getElementById('ref-filter-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', function (e) {
        activeFilters.refund_type = e.target.value;
        pagination.page = 1;
        renderTable();
        renderKPICards();
      });
    }

    // Advanced Company filter
    const compSelect = document.getElementById('ref-filter-company');
    if (compSelect) {
      compSelect.addEventListener('change', function (e) {
        activeFilters.company = e.target.value;
        pagination.page = 1;
        renderTable();
        renderKPICards();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById('ref-btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeFilters = {
          search: '',
          status: 'all',
          source: 'all',
          date_range: 'all',
          refund_type: 'all',
          company: 'all'
        };
        pagination.page = 1;

        if (searchInput) searchInput.value = '';
        if (statusSelect) statusSelect.value = 'all';
        if (sourceSelect) sourceSelect.value = 'all';
        if (dateSelect) dateSelect.value = 'all';
        if (typeSelect) typeSelect.value = 'all';
        if (compSelect) compSelect.value = 'all';

        renderTable();
        renderKPICards();
      });
    }

    // Pagination
    const prevBtn = document.getElementById('ref-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (pagination.page > 1) {
          pagination.page--;
          renderTable();
        }
      });
    }

    const nextBtn = document.getElementById('ref-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        pagination.page++;
        renderTable();
      });
    }

    // Excel Export
    const exportBtn = document.getElementById('ref-btn-export-all');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToExcel);
    }
  }

  // Initialize Page
  function init() {
    currentLang = localStorage.getItem('miqat_lang') || 'ar';
    renderKPICards();
    renderRecentActivity();
    renderTable();
    setupEventListeners();

    // Listen for language or theme switches via AccountsWorkspace
    if (window.AccountsWorkspace && window.AccountsWorkspace.onRefresh) {
      window.AccountsWorkspace.onRefresh(function () {
        currentLang = localStorage.getItem('miqat_lang') || 'ar';
        renderKPICards();
        renderRecentActivity();
        renderTable();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
