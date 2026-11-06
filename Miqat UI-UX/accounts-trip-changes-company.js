/**
 * MIQAT ACCOUNTS WORKSPACE — PROGRAM & ITINERARY MODIFICATIONS
 * PAGE 2: COMPANY MODIFICATION REQUESTS REGISTER CONTROLLER
 * 
 * Features:
 * - Reads query parameter ?company={id} (defaults to COMP-101)
 * - 5 Top Summary Cards (Total, New, In Progress, Completed, Total Remaining Amount)
 * - Search across 4 fields: Request ID, Booking ID, Customer Name, Customer Phone
 * - Basic & Advanced Filters (Status, Payment, Date Range, Program, Review Status, Overdue SLA)
 * - TWO Distinct Excel Export Buttons with multi-sheet genuine XLSX generation
 * - 12-Column Table with Zero-Red/Zero-Green design tokens and soft gold overdue pulse
 * - Direct navigation to Request Details and related pages
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsTripChangesCompany = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // URL Params & State
  let currentCompanyId = 'COMP-101';
  let companyRecord = null;
  let allCompanyRequests = [];
  let filteredRequests = [];

  const filters = {
    search: '',
    modStatus: 'all',
    payStatus: 'all',
    dateFrom: '',
    dateTo: '',
    origProgram: 'all',
    newProgram: 'all',
    paymentReviewStatus: 'all',
    overdueOnly: false
  };

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
    // 1. Read company from query params
    const urlParams = new URLSearchParams(window.location.search);
    const paramCompany = urlParams.get('company');
    if (paramCompany) {
      currentCompanyId = paramCompany;
    }

    if (!window.AccountsMockData) {
      console.error('AccountsMockData service not ready');
      return;
    }

    companyRecord = window.AccountsMockData.getCompanyDetails(currentCompanyId);
    if (!companyRecord) {
      console.warn('Company not found, falling back to COMP-101');
      currentCompanyId = 'COMP-101';
      companyRecord = window.AccountsMockData.getCompanyDetails('COMP-101');
    }

    populateCompanyHeader();
    loadRequestsData();
    populateProgramDropdowns();
    renderSummaryCards();
    applyFilters();
    bindEvents();
  }

  function populateCompanyHeader() {
    if (!companyRecord) return;
    const lang = getLang();

    const bannerName = document.getElementById('banner-company-name');
    const bannerId = document.getElementById('banner-company-id');
    const bannerLicense = document.getElementById('banner-company-license');
    const bannerContact = document.getElementById('banner-company-contact');
    const breadcrumbName = document.getElementById('breadcrumb-company-name');

    const compName = lang === 'ar' ? companyRecord.name_ar : (companyRecord.name_en || companyRecord.name_ar);
    const license = lang === 'ar' ? companyRecord.license : (companyRecord.license_en || companyRecord.license);
    const contact = lang === 'ar' ? companyRecord.contact_person_ar : (companyRecord.contact_person_en || companyRecord.contact_person_ar);
    const phone = companyRecord.contact_phone || companyRecord.phone;

    if (bannerName) bannerName.textContent = compName;
    if (bannerId) bannerId.textContent = companyRecord.id;
    if (bannerLicense) bannerLicense.textContent = license;
    if (bannerContact) bannerContact.textContent = `${t('modifications.contact_name', 'مسؤول الاتصال:', 'Contact Representative:')} ${contact} (${phone})`;
    if (breadcrumbName) breadcrumbName.textContent = compName;
  }

  function loadRequestsData() {
    allCompanyRequests = window.AccountsMockData.getCompanyModificationRequests(currentCompanyId, {});
  }

  function populateProgramDropdowns() {
    const origSelect = document.getElementById('filter-orig-program');
    const newSelect = document.getElementById('filter-new-program');
    const lang = getLang();

    const origPrograms = new Set();
    const newPrograms = new Set();

    allCompanyRequests.forEach(r => {
      if (r.original_program) {
        origPrograms.add(lang === 'ar' ? r.original_program.name_ar : (r.original_program.name_en || r.original_program.name_ar));
      }
      if (r.new_program) {
        newPrograms.add(lang === 'ar' ? r.new_program.name_ar : (r.new_program.name_en || r.new_program.name_ar));
      }
    });

    if (origSelect) {
      origSelect.innerHTML = `<option value="all">${t('modifications.filter_payment_all', 'الكل')}</option>` +
        Array.from(origPrograms).map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
    }

    if (newSelect) {
      newSelect.innerHTML = `<option value="all">${t('modifications.filter_payment_all', 'الكل')}</option>` +
        Array.from(newPrograms).map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
    }
  }

  function renderSummaryCards() {
    const summary = window.AccountsMockData.getCompanyModificationSummary(currentCompanyId);

    const elTotal = document.getElementById('card-stat-total');
    const elNew = document.getElementById('card-stat-new');
    const elInProg = document.getElementById('card-stat-in-progress');
    const elComp = document.getElementById('card-stat-completed');
    const elRemaining = document.getElementById('card-stat-remaining');

    if (elTotal) elTotal.textContent = formatNum(summary.totalRequests);
    if (elNew) elNew.textContent = formatNum(summary.newRequests);
    if (elInProg) elInProg.textContent = formatNum(summary.inProgressRequests);
    if (elComp) elComp.textContent = formatNum(summary.completedRequests);
    if (elRemaining) elRemaining.textContent = formatCurr(summary.totalRemainingBalance);
  }

  function applyFilters() {
    const lang = getLang();
    const q = (filters.search || '').toLowerCase().trim();

    filteredRequests = allCompanyRequests.filter(r => {
      // 1. Search 4 fields
      if (q) {
        const matchesId = r.id && r.id.toLowerCase().includes(q);
        const matchesBooking = r.booking_id && r.booking_id.toLowerCase().includes(q);
        const name = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
        const matchesName = name && name.toLowerCase().includes(q);
        const matchesPhone = r.customer_phone && r.customer_phone.includes(q);
        if (!matchesId && !matchesBooking && !matchesName && !matchesPhone) return false;
      }

      // 2. Mod Status
      if (filters.modStatus !== 'all' && r.request_status !== filters.modStatus) {
        return false;
      }

      // 3. Payment Status
      if (filters.payStatus !== 'all' && r.payment_status !== filters.payStatus) {
        return false;
      }

      // 4. Date range
      const reqDate = (r.created_at || '').slice(0, 10);
      if (filters.dateFrom && reqDate < filters.dateFrom) return false;
      if (filters.dateTo && reqDate > filters.dateTo) return false;

      // 5. Orig Program
      if (filters.origProgram !== 'all') {
        const progName = lang === 'ar' ? r.original_program.name_ar : (r.original_program.name_en || r.original_program.name_ar);
        if (progName !== filters.origProgram) return false;
      }

      // 6. New Program
      if (filters.newProgram !== 'all') {
        const progName = lang === 'ar' ? r.new_program.name_ar : (r.new_program.name_en || r.new_program.name_ar);
        if (progName !== filters.newProgram) return false;
      }

      // 7. Payment Review Status
      if (filters.paymentReviewStatus !== 'all') {
        const payments = r.additional_payments || [];
        if (filters.paymentReviewStatus === 'has_pending') {
          const hasPending = payments.some(p => p.review_status === 'pending_review' || p.review_status === 'pending');
          if (!hasPending) return false;
        } else if (filters.paymentReviewStatus === 'all_approved') {
          const allApproved = payments.length > 0 && payments.every(p => p.review_status === 'approved');
          if (!allApproved) return false;
        }
      }

      // 8. Overdue SLA
      if (filters.overdueOnly) {
        if (!r.sla || !r.sla.is_overdue) return false;
      }

      return true;
    });

    renderTable();
    renderFilterChips();
    updateExportButtonsVisibility();
  }

  function hasActiveFilters() {
    return !!(
      filters.search ||
      filters.modStatus !== 'all' ||
      filters.payStatus !== 'all' ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.origProgram !== 'all' ||
      filters.newProgram !== 'all' ||
      filters.paymentReviewStatus !== 'all' ||
      filters.overdueOnly
    );
  }

  function updateExportButtonsVisibility() {
    const btnFiltered = document.getElementById('btn-export-filtered');
    if (btnFiltered) {
      // PROMPT REQUIREMENT: Button 2 visible only when filters are active
      btnFiltered.style.display = hasActiveFilters() ? 'inline-flex' : 'none';
    }
  }

  function renderFilterChips() {
    const wrap = document.getElementById('filter-chips-wrap');
    const chipsBar = document.getElementById('acc-active-chips-wrap');
    const badge = document.getElementById('adv-filter-count');
    if (!wrap) return;

    // Update active advanced filters count
    let advCount = 0;
    if (filters.dateFrom) advCount++;
    if (filters.dateTo) advCount++;
    if (filters.origProgram !== 'all') advCount++;
    if (filters.newProgram !== 'all') advCount++;
    if (filters.paymentReviewStatus !== 'all') advCount++;
    if (filters.overdueOnly) advCount++;

    if (badge) {
      badge.textContent = String(advCount);
      badge.style.display = advCount > 0 ? 'inline-block' : 'none';
    }

    const chips = [];
    const lang = getLang();

    if (filters.search) {
      chips.push({ key: 'search', label: `${t('modifications.col_request_id', 'بحث')}: "${filters.search}"` });
    }
    if (filters.modStatus !== 'all') {
      const statusLabel = getModStatusBadge(filters.modStatus).label;
      chips.push({ key: 'modStatus', label: `${t('modifications.col_mod_status', 'حالة التعديل')}: ${statusLabel}` });
    }
    if (filters.payStatus !== 'all') {
      const payLabel = getPayStatusBadge(filters.payStatus).label;
      chips.push({ key: 'payStatus', label: `${t('modifications.col_payment_status', 'حالة السداد')}: ${payLabel}` });
    }
    if (filters.dateFrom) {
      chips.push({ key: 'dateFrom', label: `${t('modifications.filter_date_from', 'من')}: ${filters.dateFrom}` });
    }
    if (filters.dateTo) {
      chips.push({ key: 'dateTo', label: `${t('modifications.filter_date_to', 'إلى')}: ${filters.dateTo}` });
    }
    if (filters.origProgram !== 'all') {
      chips.push({ key: 'origProgram', label: `${t('modifications.filter_orig_program', 'البرنامج الأصلي')}: ${filters.origProgram}` });
    }
    if (filters.newProgram !== 'all') {
      chips.push({ key: 'newProgram', label: `${t('modifications.filter_new_program', 'البرنامج الجديد')}: ${filters.newProgram}` });
    }
    if (filters.paymentReviewStatus !== 'all') {
      const revLabel = filters.paymentReviewStatus === 'has_pending' ? t('modifications.filter_payment_pending', 'مدفوعات معلقة') : t('modifications.filter_payment_approved', 'مدفوعات معتمدة');
      chips.push({ key: 'paymentReviewStatus', label: revLabel });
    }
    if (filters.overdueOnly) {
      chips.push({ key: 'overdueOnly', label: t('modifications.badge_overdue', 'متأخر زمنياً') });
    }

    if (chips.length === 0) {
      wrap.innerHTML = '';
      if (chipsBar) chipsBar.style.display = 'none';
      return;
    }

    if (chipsBar) chipsBar.style.display = 'flex';

    wrap.innerHTML = chips.map(c => `
      <span class="acc-chip acc-filter-chip">
        <span class="acc-chip-text">${escapeHtml(c.label)}</span>
        <button type="button" class="acc-chip-remove btn-remove-chip" data-key="${c.key}" aria-label="Remove filter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('');

    // Bind remove clicks
    wrap.querySelectorAll('.btn-remove-chip').forEach(btn => {
      btn.addEventListener('click', function () {
        const key = this.getAttribute('data-key');
        if (key === 'overdueOnly') filters[key] = false;
        else if (key === 'search' || key === 'dateFrom' || key === 'dateTo') filters[key] = '';
        else filters[key] = 'all';

        syncFiltersUI();
        applyFilters();
      });
    });
  }

  function syncFiltersUI() {
    const sInput = document.getElementById('requests-search-input');
    const mSelect = document.getElementById('filter-mod-status');
    const pSelect = document.getElementById('filter-pay-status');
    const dFrom = document.getElementById('filter-date-from');
    const dTo = document.getElementById('filter-date-to');
    const oSelect = document.getElementById('filter-orig-program');
    const nSelect = document.getElementById('filter-new-program');
    const rSelect = document.getElementById('filter-payment-review');
    const odCheck = document.getElementById('filter-overdue-only');

    if (sInput) sInput.value = filters.search;
    if (mSelect) mSelect.value = filters.modStatus;
    if (pSelect) pSelect.value = filters.payStatus;
    if (dFrom) dFrom.value = filters.dateFrom;
    if (dTo) dTo.value = filters.dateTo;
    if (oSelect) oSelect.value = filters.origProgram;
    if (nSelect) nSelect.value = filters.newProgram;
    if (rSelect) rSelect.value = filters.paymentReviewStatus;
    if (odCheck) odCheck.checked = filters.overdueOnly;
  }

  // --- Status Badge Helpers (Zero-Red and Zero-Green Compliance) ---
  function getModStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'new':
        return {
          label: lang === 'ar' ? 'طلب جديد' : 'New Request',
          cssClass: 'status-pill-blue'
        };
      case 'in_progress':
        return {
          label: lang === 'ar' ? 'قيد المعالجة' : 'In Progress',
          cssClass: 'status-pill-amber'
        };
      case 'completed':
        return {
          label: lang === 'ar' ? 'مكتمل' : 'Completed',
          cssClass: 'status-pill-slate'
        };
      default:
        return {
          label: status,
          cssClass: 'status-pill-slate'
        };
    }
  }

  function getPayStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'paid_full':
        return {
          label: lang === 'ar' ? 'مدفوع بالكامل' : 'Fully Paid',
          cssClass: 'status-pill-navy'
        };
      case 'partially_paid':
        return {
          label: lang === 'ar' ? 'مدفوع جزئياً' : 'Partially Paid',
          cssClass: 'status-pill-amber'
        };
      case 'unpaid':
        return {
          label: lang === 'ar' ? 'غير مسدد' : 'Unpaid',
          cssClass: 'status-pill-slate'
        };
      default:
        return {
          label: status,
          cssClass: 'status-pill-slate'
        };
    }
  }

  function renderTable() {
    const tbody = document.getElementById('modifications-table-body');
    const emptyState = document.getElementById('table-empty-state');
    if (!tbody) return;

    if (filteredRequests.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    const lang = getLang();

    tbody.innerHTML = filteredRequests.map(r => {
      const customerName = lang === 'ar' ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
      const origProgName = r.original_program ? (lang === 'ar' ? r.original_program.name_ar : (r.original_program.name_en || r.original_program.name_ar)) : '—';
      const newProgName = r.new_program ? (lang === 'ar' ? r.new_program.name_ar : (r.new_program.name_en || r.new_program.name_ar)) : '—';

      const fin = r.financials || { originalDeposit: 0, totalApprovedPaid: 0, remainingAmount: 0 };
      const modBadge = getModStatusBadge(r.request_status);
      const payBadge = getPayStatusBadge(r.payment_status);

      // Overdue check
      const isOverdue = r.sla && r.sla.is_overdue && r.request_status === 'new';
      const rowClass = isOverdue ? 'acc-mod-row is-overdue-row' : 'acc-mod-row';

      const overdueBadgeHtml = isOverdue ? `
        <span class="acc-badge-overdue" title="${t('modifications.sla_exceeded', 'تجاوز مهلة الاستجابة')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${t('modifications.badge_overdue', 'متأخر', 'Overdue')}</span>
        </span>
      ` : '';

      return `
        <tr class="${rowClass}">
          <!-- 1. Request ID -->
          <td>
            <div class="acc-cell-stack">
              <span class="acc-cell-primary" style="font-family: monospace; font-weight: 700; color: var(--color-primary);">${escapeHtml(r.id)}</span>
              ${overdueBadgeHtml}
            </div>
          </td>

          <!-- 2. Booking ID -->
          <td>
            <a href="accounts-booking-details.html?id=${encodeURIComponent(r.booking_id)}" class="acc-link" style="font-weight: 600; text-decoration: underline;">
              ${escapeHtml(r.booking_id)}
            </a>
          </td>

          <!-- 3. Request Date & Time -->
          <td>
            <div class="acc-cell-stack">
              <span class="acc-cell-primary">${escapeHtml(r.created_at ? r.created_at.slice(0, 10) : '—')}</span>
              <span class="acc-cell-sub">${escapeHtml(r.created_at ? r.created_at.slice(11, 16) : '')}</span>
            </div>
          </td>

          <!-- 4. Customer Name & Phone -->
          <td>
            <div class="acc-cell-stack">
              <a href="accounts-customer-details.html?id=${encodeURIComponent(r.customer_id)}" class="acc-link" style="font-weight: 600;">
                ${escapeHtml(customerName)}
              </a>
              <span class="acc-cell-sub" dir="ltr" style="text-align: right;">${escapeHtml(r.customer_phone || '')}</span>
            </div>
          </td>

          <!-- 5. Original Program -->
          <td class="acc-prog-cell">
            <span class="acc-cell-sub" style="font-size: 0.8rem; color: var(--color-text);">${escapeHtml(origProgName)}</span>
          </td>

          <!-- 6. New Program -->
          <td class="acc-prog-cell">
            <span class="acc-cell-primary" style="font-size: 0.8rem; color: var(--color-primary); font-weight: 600;">${escapeHtml(newProgName)}</span>
          </td>

          <!-- 7. Original Deposit -->
          <td>
            <span class="acc-cell-primary">${formatCurr(fin.originalDeposit)}</span>
          </td>

          <!-- 8. Total Approved Paid -->
          <td>
            <span class="acc-cell-primary" style="font-weight: 700; color: var(--color-accent);">${formatCurr(fin.totalApprovedPaid)}</span>
          </td>

          <!-- 9. Total Remaining -->
          <td>
            <span class="acc-cell-primary" style="font-weight: 700; color: var(--color-text);">${formatCurr(fin.remainingAmount)}</span>
          </td>

          <!-- 10. Payment Status -->
          <td>
            <span class="acc-status-pill ${payBadge.cssClass}">${escapeHtml(payBadge.label)}</span>
          </td>

          <!-- 11. Modification Status -->
          <td>
            <span class="acc-status-pill ${modBadge.cssClass}">${escapeHtml(modBadge.label)}</span>
          </td>

          <!-- 12. Actions -->
          <td>
            <a href="accounts-trip-change-details.html?id=${encodeURIComponent(r.id)}" class="acc-btn acc-btn-secondary" style="padding: 6px 12px; font-size: 0.78rem; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
              <span>${t('modifications.btn_view_details', 'عرض التفاصيل', 'View Details')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform: ${lang === 'ar' ? 'rotate(180deg)' : 'none'};">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function bindEvents() {
    const sInput = document.getElementById('requests-search-input');
    if (sInput) {
      sInput.addEventListener('input', function (e) {
        filters.search = e.target.value || '';
        applyFilters();
      });
    }

    const mSelect = document.getElementById('filter-mod-status');
    if (mSelect) {
      mSelect.addEventListener('change', function (e) {
        filters.modStatus = e.target.value;
        applyFilters();
      });
    }

    const pSelect = document.getElementById('filter-pay-status');
    if (pSelect) {
      pSelect.addEventListener('change', function (e) {
        filters.payStatus = e.target.value;
        applyFilters();
      });
    }

    const btnAdv = document.getElementById('btn-toggle-advanced-filters');
    const pnlAdv = document.getElementById('advanced-filters-panel');
    if (btnAdv && pnlAdv) {
      btnAdv.addEventListener('click', function () {
        isAdvancedOpen = !isAdvancedOpen;
        pnlAdv.style.display = isAdvancedOpen ? 'block' : 'none';
        pnlAdv.setAttribute('aria-hidden', !isAdvancedOpen);
        btnAdv.setAttribute('aria-expanded', isAdvancedOpen);
        btnAdv.classList.toggle('is-active', isAdvancedOpen);
      });
    }

    const btnApplyAdv = document.getElementById('btn-apply-filters');
    if (btnApplyAdv) {
      btnApplyAdv.addEventListener('click', function () {
        applyFilters();
      });
    }

    const btnClearChipsBar = document.getElementById('btn-clear-chips-bar');
    if (btnClearChipsBar) {
      btnClearChipsBar.addEventListener('click', function () {
        const btnClear = document.getElementById('btn-clear-all-filters');
        if (btnClear) btnClear.click();
      });
    }

    const dFrom = document.getElementById('filter-date-from');
    if (dFrom) {
      dFrom.addEventListener('change', function (e) {
        filters.dateFrom = e.target.value;
        applyFilters();
      });
    }

    const dTo = document.getElementById('filter-date-to');
    if (dTo) {
      dTo.addEventListener('change', function (e) {
        filters.dateTo = e.target.value;
        applyFilters();
      });
    }

    const oSelect = document.getElementById('filter-orig-program');
    if (oSelect) {
      oSelect.addEventListener('change', function (e) {
        filters.origProgram = e.target.value;
        applyFilters();
      });
    }

    const nSelect = document.getElementById('filter-new-program');
    if (nSelect) {
      nSelect.addEventListener('change', function (e) {
        filters.newProgram = e.target.value;
        applyFilters();
      });
    }

    const rSelect = document.getElementById('filter-payment-review');
    if (rSelect) {
      rSelect.addEventListener('change', function (e) {
        filters.paymentReviewStatus = e.target.value;
        applyFilters();
      });
    }

    const odCheck = document.getElementById('filter-overdue-only');
    if (odCheck) {
      odCheck.addEventListener('change', function (e) {
        filters.overdueOnly = e.target.checked;
        applyFilters();
      });
    }

    const btnClear = document.getElementById('btn-clear-all-filters');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        filters.search = '';
        filters.modStatus = 'all';
        filters.payStatus = 'all';
        filters.dateFrom = '';
        filters.dateTo = '';
        filters.origProgram = 'all';
        filters.newProgram = 'all';
        filters.paymentReviewStatus = 'all';
        filters.overdueOnly = false;
        syncFiltersUI();
        applyFilters();
      });
    }

    // Excel Export Handlers (PROMPT: TWO SEPARATE BUTTONS)
    const btnExportAll = document.getElementById('btn-export-all-company');
    if (btnExportAll) {
      btnExportAll.addEventListener('click', function () {
        exportToExcel(allCompanyRequests, 'all');
      });
    }

    const btnExportFiltered = document.getElementById('btn-export-filtered');
    if (btnExportFiltered) {
      btnExportFiltered.addEventListener('click', function () {
        exportToExcel(filteredRequests, 'filtered');
      });
    }

    // WhatsApp Contact Button
    const btnWhatsApp = document.getElementById('btn-whatsapp-company');
    if (btnWhatsApp && companyRecord) {
      btnWhatsApp.addEventListener('click', function () {
        const phone = companyRecord.contact_whatsapp || companyRecord.contact_phone || companyRecord.phone;
        const msg = `مرحباً شركة ${companyRecord.name_ar}، بخصوص طلبات تعديل البرامج المسجلة بميقات.`;
        
        // Log to activity abstraction
        if (window.AccountsMockData && typeof window.AccountsMockData.sendMockWhatsAppNotification === 'function') {
          window.AccountsMockData.sendMockWhatsAppNotification(phone, msg);
        }

        if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
          window.AccountsWorkspace.showToast(t('modifications.contact_logged_toast', 'تم تسجيل فتح قناة التواصل مع موظف الشركة في سجل التدقيق.'));
        }

        // Open WhatsApp web in simulated mode
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    }

    function onLangChange() {
      populateCompanyHeader();
      renderSummaryCards();
      populateProgramDropdowns();
      applyFilters();
    }
    window.addEventListener('accounts-lang-changed', onLangChange);
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.registerRefreshListener === 'function') {
      window.AccountsWorkspace.registerRefreshListener(onLangChange);
    }
  }

  // --- Genuine 3-Sheet Excel Export Engine using SheetJS (xlsx.full.min.js) ---
  function exportToExcel(dataset, mode) {
    if (typeof XLSX === 'undefined') {
      console.error('SheetJS library (XLSX) not loaded');
      if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
        window.AccountsWorkspace.showToast('تعذر تصدير ملف الإكسيل لعدم اكتمال تحميل المكتبة');
      }
      return;
    }

    const lang = getLang();
    const isAr = lang === 'ar';
    const compName = isAr ? companyRecord.name_ar : (companyRecord.name_en || companyRecord.name_ar);

    // 1. Workbook Creation
    const wb = XLSX.utils.book_new();

    // Sheet 1: Modification Requests
    const sheet1Headers = isAr ? [
      ['شركة السياحة:', compName, '', 'رقم الترخيص:', companyRecord.license],
      ['نوع التقرير:', mode === 'all' ? 'كافة طلبات التعديل' : 'نتائج التصفية الحالية', '', 'تاريخ الاستخراج:', new Date().toLocaleString('ar-EG')],
      [],
      ['رقم الطلب', 'رقم الحجز', 'تاريخ الطلب', 'اسم العميل', 'رقم الهاتف', 'البرنامج الأصلي', 'البرنامج الجديد', 'حالة السداد', 'حالة التعديل', 'الالتزام الزمني (SLA)']
    ] : [
      ['Tourism Company:', compName, '', 'License #:', companyRecord.license_en || companyRecord.license],
      ['Report Type:', mode === 'all' ? 'All Company Requests' : 'Filtered Results', '', 'Export Date:', new Date().toLocaleString('en-US')],
      [],
      ['Request ID', 'Booking ID', 'Request Date', 'Customer Name', 'Phone', 'Original Program', 'New Program', 'Payment Status', 'Modification Status', 'SLA Status']
    ];

    const sheet1Rows = dataset.map(r => {
      const custName = isAr ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
      const origProg = r.original_program ? (isAr ? r.original_program.name_ar : (r.original_program.name_en || r.original_program.name_ar)) : '—';
      const newProg = r.new_program ? (isAr ? r.new_program.name_ar : (r.new_program.name_en || r.new_program.name_ar)) : '—';
      const modStatus = getModStatusBadge(r.request_status).label;
      const payStatus = getPayStatusBadge(r.payment_status).label;
      const slaStatus = (r.sla && r.sla.is_overdue) ? (isAr ? 'متأخر' : 'Overdue') : (isAr ? 'ضمن المهلة' : 'Within SLA');

      return [
        r.id,
        r.booking_id,
        r.created_at,
        custName,
        r.customer_phone || '',
        origProg,
        newProg,
        payStatus,
        modStatus,
        slaStatus
      ];
    });

    const ws1 = XLSX.utils.aoa_to_sheet([...sheet1Headers, ...sheet1Rows]);
    XLSX.utils.book_append_sheet(wb, ws1, isAr ? 'طلبات التعديل' : 'Modification Requests');

    // Sheet 2: Financial Details
    const sheet2Headers = isAr ? [
      ['التفاصيل المالية لطلبات التعديل - شركة ' + compName],
      ['* المبالغ المتبقية محسوبة حصراً بالاعتمادات المالية المقبولة (المدفوعات المعلقة مستثناة حتى التحقق)'],
      [],
      ['رقم الطلب', 'رقم الحجز', 'اسم العميل', 'سعر البرنامج الأصلي', 'الدفعة الأولى', 'سعر البرنامج الجديد', 'مدفوعات إضافية معتمدة', 'مدفوعات إضافية معلقة', 'إجمالي المدفوع المعتمد', 'المبلغ المتبقي', 'نسبة السداد %']
    ] : [
      ['Financial Details for Modification Requests - ' + compName],
      ['* Remaining amounts are strictly calculated using approved payments only (pending payments excluded until review)'],
      [],
      ['Request ID', 'Booking ID', 'Customer Name', 'Original Program Price', 'Original Deposit', 'New Program Price', 'Approved Additional', 'Pending Additional', 'Total Approved Paid', 'Remaining Amount', 'Payment Progress %']
    ];

    const sheet2Rows = dataset.map(r => {
      const custName = isAr ? r.customer_name_ar : (r.customer_name_en || r.customer_name_ar);
      const fin = r.financials || {
        originalPrice: 0,
        originalDeposit: 0,
        newPrice: 0,
        approvedAdditional: 0,
        pendingAdditional: 0,
        totalApprovedPaid: 0,
        remainingAmount: 0,
        progressPct: 0
      };

      return [
        r.id,
        r.booking_id,
        custName,
        fin.originalPrice,
        fin.originalDeposit,
        fin.newPrice,
        fin.approvedAdditional,
        fin.pendingAdditional,
        fin.totalApprovedPaid,
        fin.remainingAmount,
        fin.progressPct + '%'
      ];
    });

    const ws2 = XLSX.utils.aoa_to_sheet([...sheet2Headers, ...sheet2Rows]);
    XLSX.utils.book_append_sheet(wb, ws2, isAr ? 'التفاصيل المالية' : 'Financial Details');

    // Sheet 3: Additional Payments Register
    const sheet3Headers = isAr ? [
      ['سجل المدفوعات الإضافية المرفقة بطلبات التعديل'],
      [],
      ['رقم الطلب', 'رقم المعاملة', 'تاريخ وساعة السداد', 'المبلغ (ج.م)', 'طريقة السداد', 'رقم الإيصال / الحوالة', 'الجهة المسجلة', 'حالة الاعتماد', 'الموظف المعتمد']
    ] : [
      ['Additional Payments Attached to Modification Requests'],
      [],
      ['Request ID', 'Transaction ID', 'Payment Date', 'Amount (EGP)', 'Payment Method', 'Receipt / Transfer Ref', 'Recorded By', 'Review Status', 'Reviewer Name']
    ];

    const sheet3Rows = [];
    dataset.forEach(r => {
      const payments = r.additional_payments || [];
      payments.forEach(p => {
        sheet3Rows.push([
          r.id,
          p.id,
          p.date,
          p.amount,
          isAr ? p.payment_method_ar : (p.payment_method_en || p.payment_method_ar),
          p.receipt_ref,
          isAr ? p.recorded_by_ar : (p.recorded_by_en || p.recorded_by_ar),
          p.review_status === 'approved' ? (isAr ? 'معتمد' : 'Approved') : (isAr ? 'بانتظار الاعتماد' : 'Pending Review'),
          isAr ? (p.reviewed_by_ar || '—') : (p.reviewed_by_en || '—')
        ]);
      });
    });

    const ws3 = XLSX.utils.aoa_to_sheet([...sheet3Headers, ...sheet3Rows]);
    XLSX.utils.book_append_sheet(wb, ws3, isAr ? 'المدفوعات الإضافية' : 'Additional Payments');

    // Write file
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `Miqat_${currentCompanyId}_Modifications_${mode}_${dateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
      const successMsg = isAr ? `تم استخراج وتنزيل ملف Excel بثلاثة أوراق عمل بنجاح: ${fileName}` : `Excel file with 3 worksheets exported successfully: ${fileName}`;
      window.AccountsWorkspace.showToast(successMsg);
    }
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    exportToExcel,
    applyFilters
  };
});
