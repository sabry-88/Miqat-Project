/**
 * MIQAT ACCOUNTS WORKSPACE — PAGE 7: COLLECTIONS & CASH DEPOSITS CONTROLLER
 * Handles Tabs, Filters, Tables, KPI Updates, and Mock Actions
 */

(function () {
  'use strict';

  let currentTab = 'collections';
  let activeColFilters = {
    search: '',
    status: 'all',
    method: 'all'
  };

  let activeSetFilters = {
    search: '',
    status: 'all',
    confStatus: 'all'
  };

  let activeRecFilters = {
    search: '',
    status: 'all'
  };

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

  function formatNum(num) {
    const lang = getLang();
    const str = String(num || 0);
    return lang === 'ar' ? toArabicIndic(str) : str;
  }

  function getBadgeClass(status) {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'verified':
      case 'confirmed':
      case 'matched':
        return 'acc-badge is-verified';
      case 'under_review':
      case 'awaiting_admin':
      case 'awaiting_conf':
      case 'pending':
      case 'eligible':
      case 'awaiting_provider':
      case 'awaiting_proof':
      case 'pending_conf':
        return 'acc-badge is-warning';
      case 'rejected':
      case 'returned':
      case 'mismatch':
      case 'variance':
      case 'failed':
        return 'acc-badge is-rejected';
      default:
        return 'acc-badge is-neutral';
    }
  }

  function getStatusLabel(status) {
    const lang = getLang();
    const isAr = lang === 'ar';
    const map = {
      // Collections
      'approved': isAr ? 'معتمد بنجاح' : 'Approved',
      'under_review': isAr ? 'قيد المراجعة والتدقيق' : 'Under Review',
      'awaiting_provider': isAr ? 'بانتظار تأكيد المزود' : 'Awaiting Provider Confirmation',
      'awaiting_proof': isAr ? 'بانتظار إشعار العميل' : 'Awaiting Customer Proof',
      'rejected': isAr ? 'مرفوض' : 'Rejected',
      'failed': isAr ? 'عملية فاشلة' : 'Payment Failed',
      // Provider verification
      'verified': isAr ? 'مطابق ومؤكد' : 'Verified & Confirmed',
      'pending': isAr ? 'قيد التحقق الآلي' : 'Verification Pending',
      'mismatch': isAr ? 'عدم تطابق في البيانات' : 'Data Mismatch',
      'unverified': isAr ? 'غير مؤكد بنكياً' : 'Unverified by Bank',
      // Settlements
      'awaiting_conf': isAr ? 'بانتظار تأكيد الشركة' : 'Awaiting Agency Confirmation',
      'eligible': isAr ? 'مؤهلة للمراجعة' : 'Eligible for Review',
      'prepared': isAr ? 'تم الإعداد بواسطة المحاسبة' : 'Prepared by Accounts',
      'awaiting_admin': isAr ? 'بانتظار اعتماد الإدارة' : 'Awaiting Admin Approval',
      'returned': isAr ? 'معادة للتعديل' : 'Returned for Correction',
      'transferring': isAr ? 'جاري تنفيذ الحوالة' : 'Transfer In Progress',
      'completed': isAr ? 'تسوية مكتملة ومحولة' : 'Completed',
      // Company confirmation
      'confirmed': isAr ? 'مؤكد استلام المتبقي' : 'Remaining Payment Confirmed',
      'disputed': isAr ? 'ملاحظات على المبلغ' : 'Payment Disputed',
      // Reconciliation
      'matched': isAr ? 'مطابق تماماً (٠ فرق)' : 'Fully Reconciled (0 variance)',
      'pending_conf': isAr ? 'بانتظار تأكيد الشركة' : 'Pending Agency Confirmation',
      'variance': isAr ? 'تفاوت محاسبي للمراجعة' : 'Accounting Variance'
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

  // --- Initialize Top KPI Cards ---
  function updateKPIs() {
    if (!window.AccountsMockData || !window.AccountsMockData.getCollectionsSummaryKPIs) return;
    const kpis = window.AccountsMockData.getCollectionsSummaryKPIs();

    const elApprovedAmount = document.getElementById('kpi-val-approved-amount');
    const elApprovedCount = document.getElementById('kpi-sub-approved-count');
    const elReviewCount = document.getElementById('kpi-val-review-count');
    const elCompanyCount = document.getElementById('kpi-val-company-count');
    const elAdminCount = document.getElementById('kpi-val-admin-count');
    const elTransferCount = document.getElementById('kpi-val-transfer-count');
    const elCompletedCount = document.getElementById('kpi-val-completed-count');

    if (elApprovedAmount) elApprovedAmount.textContent = formatMoney(kpis.totalApprovedAmount);
    if (elApprovedCount) {
      const isAr = getLang() === 'ar';
      elApprovedCount.textContent = isAr 
        ? (formatNum(kpis.approvedCollectionsCount) + ' عملية تحصيل معتمدة ومقيدة')
        : (formatNum(kpis.approvedCollectionsCount) + ' approved & credited collections');
    }
    if (elReviewCount) elReviewCount.textContent = formatNum(kpis.reviewPendingCount);
    if (elCompanyCount) elCompanyCount.textContent = formatNum(kpis.companyPendingCount);
    if (elAdminCount) elAdminCount.textContent = formatNum(kpis.settlementsPendingAdminCount);
    if (elTransferCount) elTransferCount.textContent = formatNum(kpis.settlementsPendingTransferCount);
    if (elCompletedCount) elCompletedCount.textContent = formatNum(kpis.settlementsCompletedCount);

    // Update tab badges
    const badgeCols = document.getElementById('tab-badge-collections');
    if (badgeCols && window.AccountsMockData.COLLECTIONS_DATA) {
      badgeCols.textContent = formatNum(window.AccountsMockData.COLLECTIONS_DATA.length);
    }
    const badgeSets = document.getElementById('tab-badge-settlements');
    if (badgeSets && window.AccountsMockData.SETTLEMENTS_DATA) {
      badgeSets.textContent = formatNum(window.AccountsMockData.SETTLEMENTS_DATA.length);
    }
  }

  // --- Tab 1: Render Collections Register ---
  function renderCollectionsTable() {
    const tbody = document.getElementById('collections-tbody');
    const countText = document.getElementById('collections-count-text');
    if (!tbody || !window.AccountsMockData || !window.AccountsMockData.getCollectionsList) return;

    const list = window.AccountsMockData.getCollectionsList(activeColFilters);
    const lang = getLang();
    const isAr = lang === 'ar';

    if (countText) {
      const totalCount = (window.AccountsMockData.COLLECTIONS_DATA || []).length;
      countText.textContent = isAr 
        ? `عرض ${formatNum(list.length)} من إجمالي ${formatNum(totalCount)} تحصيل`
        : `Showing ${formatNum(list.length)} of ${formatNum(totalCount)} collections`;
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 36px 16px; color: var(--color-text-muted);">
            <div style="font-size:15px; font-weight:600; margin-bottom:4px;">
              ${isAr ? 'لا توجد عمليات تحصيل مطابقة للفلاتر المحددة' : 'No collections match the specified filters'}
            </div>
            <div style="font-size:13px;">
              ${isAr ? 'يرجى تجربة كلمات بحث أخرى أو إعادة ضبط الفلاتر' : 'Please try different search terms or reset filters'}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    list.forEach(function (item) {
      const custName = isAr ? item.customer_name_ar : item.customer_name_en;
      const statusClass = getBadgeClass(item.status);
      const provClass = getBadgeClass(item.provider_status);
      const statusLabel = getStatusLabel(item.status);
      const provLabel = getStatusLabel(item.provider_status);
      const methodLabel = getMethodLabel(item.payment_method);

      html += `
        <tr data-collection-id="${item.id}">
          <td class="acc-cell-strong">
            <a href="accounts-collection-details.html?id=${encodeURIComponent(item.id)}" style="color:var(--color-primary); font-weight:700; text-decoration:none;">
              ${item.id}
            </a>
          </td>
          <td>
            <a href="accounts-booking-details.html?id=${encodeURIComponent(item.booking_id)}" style="color:inherit; font-weight:600; text-decoration:none;">
              ${item.booking_id}
            </a>
          </td>
          <td>
            <div style="font-weight:600;">${custName}</div>
            <div style="font-size:12px; color:var(--color-text-muted);">${item.customer_phone}</div>
          </td>
          <td class="acc-cell-amount" style="font-weight:700;">
            ${formatMoney(item.amount)}
          </td>
          <td>
            <span style="font-size:13px; font-weight:500;">${methodLabel}</span>
          </td>
          <td style="font-size:13px; white-space:nowrap;">
            ${item.transaction_date}
          </td>
          <td>
            <span class="${provClass}">${provLabel}</span>
          </td>
          <td>
            <span class="${statusClass}">${statusLabel}</span>
          </td>
          <td>
            <a href="accounts-collection-details.html?id=${encodeURIComponent(item.id)}" class="btn btn-secondary btn-sm col-btn-table-action" style="display:inline-flex; align-items:center; gap:6px; text-decoration:none; white-space:nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${isAr ? 'عرض التدقيق' : 'View Audit'}</span>
            </a>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // --- Tab 2: Render Company Settlements ---
  function renderSettlementsTable() {
    const tbody = document.getElementById('settlements-tbody');
    const countText = document.getElementById('settlements-count-text');
    if (!tbody || !window.AccountsMockData || !window.AccountsMockData.getSettlementsList) return;

    const list = window.AccountsMockData.getSettlementsList(activeSetFilters);
    const lang = getLang();
    const isAr = lang === 'ar';

    if (countText) {
      const totalCount = (window.AccountsMockData.SETTLEMENTS_DATA || []).length;
      countText.textContent = isAr 
        ? `عرض ${formatNum(list.length)} من إجمالي ${formatNum(totalCount)} تسوية`
        : `Showing ${formatNum(list.length)} of ${formatNum(totalCount)} settlements`;
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align:center; padding: 36px 16px; color: var(--color-text-muted);">
            <div style="font-size:15px; font-weight:600; margin-bottom:4px;">
              ${isAr ? 'لا توجد تسويات مطابقة للفلاتر المحددة' : 'No settlements match the specified filters'}
            </div>
            <div style="font-size:13px;">
              ${isAr ? 'يرجى تجربة كلمات بحث أخرى أو تغيير الفلاتر' : 'Please try different search terms or adjust filters'}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    list.forEach(function (item) {
      const custName = isAr ? item.customer_name_ar : item.customer_name_en;
      const compName = isAr ? item.tourism_company_ar : item.tourism_company_en;
      const statusClass = getBadgeClass(item.status);
      const statusLabel = getStatusLabel(item.status);
      const confStatus = item.company_confirmation ? item.company_confirmation.status : 'pending';
      const confClass = getBadgeClass(confStatus);
      const confLabel = getStatusLabel(confStatus);

      html += `
        <tr data-settlement-id="${item.id}">
          <td class="acc-cell-strong">
            <a href="accounts-settlement-details.html?id=${encodeURIComponent(item.id)}" style="color:var(--color-primary); font-weight:700; text-decoration:none;">
              ${item.id}
            </a>
          </td>
          <td>
            <a href="accounts-booking-details.html?id=${encodeURIComponent(item.booking_id)}" style="color:inherit; font-weight:600; text-decoration:none;">
              ${item.booking_id}
            </a>
          </td>
          <td style="font-weight:600;">
            ${custName}
          </td>
          <td style="font-weight:500;">
            ${compName}
          </td>
          <td class="acc-cell-amount" style="font-weight:600;">
            ${formatMoney(item.program_total)}
          </td>
          <td class="acc-cell-amount" style="color:var(--color-text-secondary);">
            ${formatMoney(item.deposit_paid)}
          </td>
          <td class="acc-cell-amount" style="color:var(--color-text-secondary);">
            ${formatMoney(item.direct_paid)}
          </td>
          <td class="acc-cell-amount" style="color:var(--color-accent); font-weight:600;">
            ${formatMoney(item.commission_amount)}
          </td>
          <td class="acc-cell-amount" style="font-weight:800; color:var(--color-primary);">
            ${formatMoney(item.net_settlement)}
          </td>
          <td>
            <span class="${confClass}">${confLabel}</span>
          </td>
          <td>
            <span class="${statusClass}">${statusLabel}</span>
          </td>
          <td>
            <a href="accounts-settlement-details.html?id=${encodeURIComponent(item.id)}" class="btn btn-secondary btn-sm col-btn-table-action" style="display:inline-flex; align-items:center; gap:6px; text-decoration:none; white-space:nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>${isAr ? 'عرض التسوية' : 'View Settlement'}</span>
            </a>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // --- Tab 4: Render Reports & Reconciliation ---
  function renderReconciliationSection() {
    if (!window.AccountsMockData || !window.AccountsMockData.getReconciliationReport) return;
    const data = window.AccountsMockData.getReconciliationReport(activeRecFilters);
    const lang = getLang();
    const isAr = lang === 'ar';

    // Update 3 streams cards
    const elS1 = document.getElementById('rep-stream1-val');
    const elS2 = document.getElementById('rep-stream2-val');
    const elS3 = document.getElementById('rep-stream3-val');
    if (elS1) elS1.textContent = formatMoney(data.stream1Total);
    if (elS2) elS2.textContent = formatMoney(data.stream2Total);
    if (elS3) elS3.textContent = formatMoney(data.stream3Total);

    // Render 3-way table
    const tbody = document.getElementById('reconciliation-tbody');
    const countText = document.getElementById('reconciliation-count-text');
    if (!tbody) return;

    if (countText) {
      countText.textContent = isAr 
        ? `عرض ${formatNum(data.reconciliationItems.length)} حجز للمطابقة`
        : `Showing ${formatNum(data.reconciliationItems.length)} bookings for reconciliation`;
    }

    if (data.reconciliationItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 36px 16px; color: var(--color-text-muted);">
            <div>${isAr ? 'لا توجد سجلات مطابقة' : 'No reconciliation records found'}</div>
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    data.reconciliationItems.forEach(function (r) {
      const custName = isAr ? r.customer_ar : r.customer_en;
      const compName = isAr ? r.company_ar : r.company_en;
      const statusClass = getBadgeClass(r.reconciliation_status);
      const statusLabel = getStatusLabel(r.reconciliation_status);

      html += `
        <tr>
          <td class="acc-cell-strong">
            <a href="accounts-booking-details.html?id=${encodeURIComponent(r.booking_id)}" style="color:var(--color-primary); font-weight:700; text-decoration:none;">
              ${r.booking_id}
            </a>
          </td>
          <td style="font-weight:600;">${custName}</td>
          <td>${compName}</td>
          <td class="acc-cell-amount">${formatMoney(r.program_total)}</td>
          <td class="acc-cell-amount">${formatMoney(r.miqat_deposit)}</td>
          <td class="acc-cell-amount">${formatMoney(r.direct_paid)}</td>
          <td class="acc-cell-amount" style="color:#B8860B;">${formatMoney(r.commission)}</td>
          <td class="acc-cell-amount" style="font-weight:800;">${formatMoney(r.net_settlement)}</td>
          <td><span class="${statusClass}">${statusLabel}</span></td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // --- Tab Switching Logic ---
  function switchTab(tabKey) {
    currentTab = tabKey;

    const allTabs = ['collections', 'settlements', 'cash_deposits', 'reconciliation'];
    allTabs.forEach(function (t) {
      const btn = document.getElementById('tab-btn-' + (t === 'cash_deposits' ? 'cash-deposits' : t));
      const pane = document.getElementById('pane-' + (t === 'cash_deposits' ? 'cash-deposits' : t));

      const isActive = (t === tabKey);
      if (btn) {
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
      if (pane) {
        pane.classList.toggle('is-active', isActive);
        pane.style.display = isActive ? 'block' : 'none';
      }
    });

    if (tabKey === 'collections') renderCollectionsTable();
    if (tabKey === 'settlements') renderSettlementsTable();
    if (tabKey === 'reconciliation') renderReconciliationSection();
  }

  // --- Export Excel Mock ---
  function exportExcel(type) {
    if (typeof XLSX === 'undefined') {
      alert('Export library loading. Please try again.');
      return;
    }

    const lang = getLang();
    const isAr = lang === 'ar';
    let data = [];
    let filename = '';

    if (type === 'collections') {
      const list = window.AccountsMockData.getCollectionsList(activeColFilters);
      data = list.map(function (c) {
        return {
          [isAr ? 'مرجع التحصيل' : 'Collection Ref']: c.id,
          [isAr ? 'رقم الحجز' : 'Booking ID']: c.booking_id,
          [isAr ? 'اسم العميل' : 'Customer']: isAr ? c.customer_name_ar : c.customer_name_en,
          [isAr ? 'المبلغ' : 'Amount']: c.amount,
          [isAr ? 'طريقة الدفع' : 'Payment Method']: getMethodLabel(c.payment_method),
          [isAr ? 'التاريخ' : 'Date']: c.transaction_date,
          [isAr ? 'الحالة' : 'Status']: getStatusLabel(c.status)
        };
      });
      filename = isAr ? 'سجل_التحصيلات_ميقات.xlsx' : 'Miqat_Collections_Register.xlsx';
    } else if (type === 'settlements') {
      const list = window.AccountsMockData.getSettlementsList(activeSetFilters);
      data = list.map(function (s) {
        return {
          [isAr ? 'مرجع التسوية' : 'Settlement Ref']: s.id,
          [isAr ? 'رقم الحجز' : 'Booking ID']: s.booking_id,
          [isAr ? 'شركة السياحة' : 'Agency']: isAr ? s.tourism_company_ar : s.tourism_company_en,
          [isAr ? 'إجمالي البرنامج' : 'Program Total']: s.program_total,
          [isAr ? 'مقدم ميقات' : 'Miqat Deposit']: s.deposit_paid,
          [isAr ? 'مسدد للشركة' : 'Paid to Agency']: s.direct_paid,
          [isAr ? 'عمولة ميقات' : 'Miqat Commission']: s.commission_amount,
          [isAr ? 'صافي التسوية' : 'Net Settlement']: s.net_settlement,
          [isAr ? 'الحالة' : 'Status']: getStatusLabel(s.status)
        };
      });
      filename = isAr ? 'تسويات_شركات_السياحة_ميقات.xlsx' : 'Miqat_Agency_Settlements.xlsx';
    } else if (type === 'reconciliation') {
      const rep = window.AccountsMockData.getReconciliationReport(activeRecFilters);
      data = rep.reconciliationItems.map(function (r) {
        return {
          [isAr ? 'رقم الحجز' : 'Booking ID']: r.booking_id,
          [isAr ? 'العميل' : 'Customer']: isAr ? r.customer_ar : r.customer_en,
          [isAr ? 'شركة السياحة' : 'Agency']: isAr ? r.company_ar : r.company_en,
          [isAr ? 'إجمالي البرنامج' : 'Program Total']: r.program_total,
          [isAr ? 'مقدم ميقات' : 'Miqat Deposit']: r.miqat_deposit,
          [isAr ? 'مسدد للشركة' : 'Direct to Agency']: r.direct_paid,
          [isAr ? 'عمولة ميقات' : 'Miqat Commission']: r.commission,
          [isAr ? 'صافي التسوية' : 'Net Settlement']: r.net_settlement,
          [isAr ? 'حالة المطابقة' : 'Reconciliation Status']: getStatusLabel(r.reconciliation_status)
        };
      });
      filename = isAr ? 'تقرير_المطابقة_المالية_ميقات.xlsx' : 'Miqat_Financial_Reconciliation.xlsx';
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, filename);
  }

  // --- Attach Event Listeners ---
  function setupEventListeners() {
    // Tab buttons
    ['collections', 'settlements', 'cash-deposits', 'reconciliation'].forEach(function (tKey) {
      const btn = document.getElementById('tab-btn-' + tKey);
      if (btn) {
        btn.addEventListener('click', function () {
          const actualKey = (tKey === 'cash-deposits') ? 'cash_deposits' : tKey;
          switchTab(actualKey);
        });
      }
    });

    // Collections filters
    const colSearch = document.getElementById('col-filter-search');
    if (colSearch) {
      colSearch.addEventListener('input', function (e) {
        activeColFilters.search = e.target.value;
        renderCollectionsTable();
      });
    }

    const colStatus = document.getElementById('col-select-status');
    if (colStatus) {
      colStatus.addEventListener('change', function (e) {
        activeColFilters.status = e.target.value;
        renderCollectionsTable();
      });
    }

    const colMethod = document.getElementById('col-select-method');
    if (colMethod) {
      colMethod.addEventListener('change', function (e) {
        activeColFilters.method = e.target.value;
        renderCollectionsTable();
      });
    }

    const colReset = document.getElementById('col-btn-reset-filters');
    if (colReset) {
      colReset.addEventListener('click', function () {
        activeColFilters = { search: '', status: 'all', method: 'all' };
        if (colSearch) colSearch.value = '';
        if (colStatus) colStatus.value = 'all';
        if (colMethod) colMethod.value = 'all';
        renderCollectionsTable();
      });
    }

    // Settlements filters
    const setSearch = document.getElementById('set-filter-search');
    if (setSearch) {
      setSearch.addEventListener('input', function (e) {
        activeSetFilters.search = e.target.value;
        renderSettlementsTable();
      });
    }

    const setStatus = document.getElementById('set-select-status');
    if (setStatus) {
      setStatus.addEventListener('change', function (e) {
        activeSetFilters.status = e.target.value;
        renderSettlementsTable();
      });
    }

    const setConf = document.getElementById('set-select-conf');
    if (setConf) {
      setConf.addEventListener('change', function (e) {
        activeSetFilters.confStatus = e.target.value;
        renderSettlementsTable();
      });
    }

    // Reconciliation filters
    const repSearch = document.getElementById('rep-filter-search');
    if (repSearch) {
      repSearch.addEventListener('input', function (e) {
        activeRecFilters.search = e.target.value;
        renderReconciliationSection();
      });
    }

    const repStatus = document.getElementById('rep-select-status');
    if (repStatus) {
      repStatus.addEventListener('change', function (e) {
        activeRecFilters.status = e.target.value;
        renderReconciliationSection();
      });
    }

    // Export buttons
    const btnQuickExport = document.getElementById('col-btn-quick-export');
    if (btnQuickExport) {
      btnQuickExport.addEventListener('click', function () { exportExcel('collections'); });
    }
    const btnSetExport = document.getElementById('set-btn-export');
    if (btnSetExport) {
      btnSetExport.addEventListener('click', function () { exportExcel('settlements'); });
    }
    const btnRepExport = document.getElementById('rep-btn-export');
    if (btnRepExport) {
      btnRepExport.addEventListener('click', function () { exportExcel('reconciliation'); });
    }
  }

  // --- Initial Mount ---
  function init() {
    updateKPIs();
    renderCollectionsTable();
    renderSettlementsTable();
    renderReconciliationSection();
    setupEventListeners();

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onRefresh === 'function') {
      window.AccountsWorkspace.onRefresh(function () {
        updateKPIs();
        renderCollectionsTable();
        renderSettlementsTable();
        renderReconciliationSection();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
