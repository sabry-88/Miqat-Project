/**
 * MIQAT ACCOUNTS EMPLOYEE WORKSPACE — CUSTOMERS DIRECTORY CONTROLLER
 * Phase 3 – Page 2: Customers Directory (دليل العملاء والمعتمرين)
 * 
 * Strict Scope & Architecture:
 * - Uses Mock Data exclusively via window.AccountsMockData
 * - Full Arabic (RTL) & English (LTR) bilingual localization
 * - Zero Red and Zero Green color compliance across all badges and statuses
 * - Multi-criteria live search and advanced filtering
 * - UTF-8 CSV client-side export for active filtered results
 * - Prepares navigation to Customer Profile (Phase 3 – Page 3) with stable Customer IDs
 */

(function () {
  'use strict';

  // State Management
  const state = {
    search: '',
    governorate: 'all',
    program: 'all',
    bookingStatus: 'all',
    contractStatus: 'all',
    paymentStatus: 'all',
    refundStatus: 'all',
    page: 1,
    pageSize: 8
  };

  // Helper references
  function getLang() {
    return (window.AccountsWorkspace && window.AccountsWorkspace.getCurrentLang)
      ? window.AccountsWorkspace.getCurrentLang()
      : (localStorage.getItem('miqat_lang') || 'ar');
  }

  function t(key, fallback) {
    if (window.AccountsWorkspace && window.AccountsWorkspace.t) {
      return window.AccountsWorkspace.t(key, fallback);
    }
    return fallback || key;
  }

  function formatNum(num) {
    const lang = getLang();
    if (window.AccountsWorkspace && window.AccountsWorkspace.formatNumber) {
      return window.AccountsWorkspace.formatNumber(num, lang);
    }
    return String(num);
  }

  function formatCurr(amount) {
    const lang = getLang();
    if (window.AccountsWorkspace && window.AccountsWorkspace.formatCurrency) {
      return window.AccountsWorkspace.formatCurrency(amount, lang);
    }
    return (lang === 'ar' ? formatNum(amount) + ' ج.م' : 'EGP ' + formatNum(amount));
  }

  function showNotification(msg) {
    if (window.AccountsWorkspace && window.AccountsWorkspace.showToast) {
      window.AccountsWorkspace.showToast(msg);
    } else {
      console.log('Miqat Workspace Toast:', msg);
    }
  }

  // --- Status Class & Color Resolver (Strict Zero-Red & Zero-Green Rule) ---
  function getBookingStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'confirmed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_confirmed', 'مؤكد') : 'Confirmed',
          cssClass: 'status-pill-navy'
        };
      case 'deposit_paid':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_deposit_paid', 'مسدد دفعة / عربون') : 'Deposit Paid',
          cssClass: 'status-pill-amber'
        };
      case 'new':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_new', 'جديد قيد التنفيذ') : 'New / In Progress',
          cssClass: 'status-pill-blue'
        };
      case 'cancelled':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_cancelled', 'حجز ملغي') : 'Cancelled',
          cssClass: 'status-pill-slate'
        };
      case 'completed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_bkg_completed', 'مكتمل الرحلة') : 'Trip Completed',
          cssClass: 'status-pill-indigo'
        };
      default:
        return { label: status, cssClass: 'status-pill-slate' };
    }
  }

  function getContractStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'active':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ctr_active', 'عقد سارٍ') : 'Active Contract',
          cssClass: 'status-pill-navy'
        };
      case 'pending_agreement':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ctr_pending', 'بانتظار الموافقة') : 'Pending Agreement',
          cssClass: 'status-pill-amber'
        };
      case 'under_review':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ctr_review', 'قيد مراجعة الإدارة') : 'Under Admin Review',
          cssClass: 'status-pill-indigo'
        };
      default:
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ctr_none', 'أفراد (بدون عقد)') : 'Individual',
          cssClass: 'status-pill-neutral'
        };
    }
  }

  function getPaymentStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'paid_full':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_full', 'مسدد بالكامل') : 'Paid in Full',
          cssClass: 'status-pill-navy'
        };
      case 'partial':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_partial', 'سداد جزئي') : 'Partial Payment',
          cssClass: 'status-pill-amber'
        };
      case 'pending_clearance':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_pending', 'بانتظار المطابقة') : 'Pending Clearance',
          cssClass: 'status-pill-indigo'
        };
      case 'refunded':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_refunded', 'مسترد بالكامل') : 'Refunded',
          cssClass: 'status-pill-slate'
        };
      case 'unpaid':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_pay_unpaid', 'غير مسدد') : 'Unpaid',
          cssClass: 'status-pill-charcoal'
        };
      default:
        return { label: status, cssClass: 'status-pill-slate' };
    }
  }

  function getRefundStatusBadge(status) {
    const lang = getLang();
    switch (status) {
      case 'pending_approval':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ref_pending', 'طلب معلق') : 'Pending Review',
          cssClass: 'status-pill-amber'
        };
      case 'under_review':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ref_under_review', 'قيد دراسة الإدارة') : 'Under Admin Review',
          cssClass: 'status-pill-indigo'
        };
      case 'executed':
        return {
          label: lang === 'ar' ? t('accounts_workspace.status_ref_executed', 'تم الصرف والتسوية') : 'Executed & Settled',
          cssClass: 'status-pill-slate'
        };
      default:
        return {
          label: lang === 'ar' ? '—' : '—',
          cssClass: 'status-pill-muted'
        };
    }
  }

  // --- 1. Summary Cards Controller ---
  function renderSummaryMetrics() {
    if (!window.AccountsMockData || !window.AccountsMockData.getCustomerDirectorySummary) return;
    const summary = window.AccountsMockData.getCustomerDirectorySummary();
    const lang = getLang();

    const totalEl = document.getElementById('cust-kpi-total');
    if (totalEl) totalEl.textContent = formatNum(summary.totalCustomers);

    const bkgEl = document.getElementById('cust-kpi-active-bkg');
    if (bkgEl) bkgEl.textContent = formatNum(summary.activeBookings);

    const ctrEl = document.getElementById('cust-kpi-active-ctr');
    if (ctrEl) ctrEl.textContent = formatNum(summary.activeContracts);

    const pendEl = document.getElementById('cust-kpi-pending');
    if (pendEl) pendEl.textContent = formatNum(summary.pendingItems);
  }

  // --- 2. Active Filter Tags & Results Counter ---
  function renderActiveFilterTags(totalMatches) {
    const tagsContainer = document.getElementById('cust-active-tags');
    if (!tagsContainer) return;
    const lang = getLang();

    const tags = [];

    if (state.search) {
      tags.push({
        id: 'search',
        label: (lang === 'ar' ? 'بحث: ' : 'Search: ') + '"' + state.search + '"'
      });
    }

    if (state.governorate !== 'all') {
      const govEl = document.getElementById('filter-cust-governorate');
      const text = govEl && govEl.selectedOptions[0] ? govEl.selectedOptions[0].textContent : state.governorate;
      tags.push({ id: 'governorate', label: (lang === 'ar' ? 'المحافظة: ' : 'Gov: ') + text });
    }

    if (state.program !== 'all') {
      const progEl = document.getElementById('filter-cust-program');
      const text = progEl && progEl.selectedOptions[0] ? progEl.selectedOptions[0].textContent : state.program;
      tags.push({ id: 'program', label: (lang === 'ar' ? 'البرنامج: ' : 'Program: ') + text });
    }

    if (state.bookingStatus !== 'all') {
      const bkgEl = document.getElementById('filter-cust-bkg-status');
      const text = bkgEl && bkgEl.selectedOptions[0] ? bkgEl.selectedOptions[0].textContent : state.bookingStatus;
      tags.push({ id: 'bookingStatus', label: (lang === 'ar' ? 'الحجز: ' : 'Booking: ') + text });
    }

    if (state.contractStatus !== 'all') {
      const ctrEl = document.getElementById('filter-cust-contract-status');
      const text = ctrEl && ctrEl.selectedOptions[0] ? ctrEl.selectedOptions[0].textContent : state.contractStatus;
      tags.push({ id: 'contractStatus', label: (lang === 'ar' ? 'العقد: ' : 'Contract: ') + text });
    }

    if (state.paymentStatus !== 'all') {
      const payEl = document.getElementById('filter-cust-payment-status');
      const text = payEl && payEl.selectedOptions[0] ? payEl.selectedOptions[0].textContent : state.paymentStatus;
      tags.push({ id: 'paymentStatus', label: (lang === 'ar' ? 'المالي: ' : 'Payment: ') + text });
    }

    if (state.refundStatus !== 'all') {
      const refEl = document.getElementById('filter-cust-refund-status');
      const text = refEl && refEl.selectedOptions[0] ? refEl.selectedOptions[0].textContent : state.refundStatus;
      tags.push({ id: 'refundStatus', label: (lang === 'ar' ? 'الاسترداد: ' : 'Refund: ') + text });
    }

    if (tags.length === 0) {
      tagsContainer.innerHTML = '<span class="acc-cust-no-tags">' + (lang === 'ar' ? 'كافة السجلات' : 'All Records') + '</span>';
    } else {
      tagsContainer.innerHTML = tags.map(tag => {
        return '<button type="button" class="acc-cust-filter-tag" data-filter-id="' + tag.id + '" aria-label="' + (lang === 'ar' ? 'إزالة الفلتر ' : 'Remove filter ') + tag.label + '">' +
                 '<span>' + tag.label + '</span>' +
                 '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
               '</button>';
      }).join('');

      tagsContainer.querySelectorAll('.acc-cust-filter-tag').forEach(btn => {
        btn.addEventListener('click', function () {
          const filterId = this.getAttribute('data-filter-id');
          removeSingleFilter(filterId);
        });
      });
    }

    // Update Counter
    const countVisibleEl = document.getElementById('cust-count-visible');
    const countTotalEl = document.getElementById('cust-count-total');
    const totalRecords = window.AccountsMockData ? window.AccountsMockData.CUSTOMERS.length : 16;
    if (countVisibleEl) countVisibleEl.textContent = formatNum(totalMatches);
    if (countTotalEl) countTotalEl.textContent = formatNum(totalRecords);
  }

  function removeSingleFilter(filterId) {
    if (filterId === 'search') {
      state.search = '';
      const input = document.getElementById('cust-search-input');
      const clearBtn = document.getElementById('cust-search-clear');
      if (input) input.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
    } else if (filterId in state) {
      state[filterId] = 'all';
      const selectMap = {
        governorate: 'filter-cust-governorate',
        program: 'filter-cust-program',
        bookingStatus: 'filter-cust-bkg-status',
        contractStatus: 'filter-cust-contract-status',
        paymentStatus: 'filter-cust-payment-status',
        refundStatus: 'filter-cust-refund-status'
      };
      const selectEl = document.getElementById(selectMap[filterId]);
      if (selectEl) selectEl.value = 'all';
    }
    state.page = 1;
    renderDirectoryTable();
  }

  // --- 3. Directory Table & Pagination Controller ---
  function renderDirectoryTable() {
    if (!window.AccountsMockData || !window.AccountsMockData.filterCustomerDirectory) return;
    const lang = getLang();

    const matches = window.AccountsMockData.filterCustomerDirectory(state);
    renderActiveFilterTags(matches.length);

    const tbody = document.getElementById('acc-customers-tbody');
    const emptyState = document.getElementById('acc-customers-empty');
    const tableFooter = document.getElementById('acc-customers-pagination');

    if (!tbody) return;

    if (matches.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (tableFooter) tableFooter.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableFooter) tableFooter.style.display = 'flex';

    // Pagination calculations
    const totalPages = Math.ceil(matches.length / state.pageSize) || 1;
    if (state.page > totalPages) state.page = totalPages;
    const startIdx = (state.page - 1) * state.pageSize;
    const endIdx = Math.min(startIdx + state.pageSize, matches.length);
    const pageItems = matches.slice(startIdx, endIdx);

    // Update pagination UI numbers
    const startEl = document.getElementById('cust-pg-start');
    const endEl = document.getElementById('cust-pg-end');
    const totalEl = document.getElementById('cust-pg-total');
    const pageNumEl = document.getElementById('cust-pg-page-num');
    const prevBtn = document.getElementById('cust-pg-prev');
    const nextBtn = document.getElementById('cust-pg-next');

    if (startEl) startEl.textContent = formatNum(startIdx + 1);
    if (endEl) endEl.textContent = formatNum(endIdx);
    if (totalEl) totalEl.textContent = formatNum(matches.length);
    if (pageNumEl) pageNumEl.textContent = formatNum(state.page);

    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= totalPages;

    // Render Table Rows
    tbody.innerHTML = pageItems.map(c => {
      const name = lang === 'ar' ? c.name_ar : c.name_en;
      const initial = name.charAt(0);
      const gov = lang === 'ar' ? c.governorate_ar : c.governorate_en;
      const prog = lang === 'ar' ? c.program_ar : c.program_en;
      const bkgStatus = getBookingStatusBadge(c.booking_status);
      const ctrStatus = getContractStatusBadge(c.contract_status);
      const payStatus = getPaymentStatusBadge(c.payment_status);
      const refStatus = getRefundStatusBadge(c.refund_status);

      // Bookings and contracts count localized
      const bkgText = formatNum(c.bookings_count) + ' ' + (c.bookings_count > 1 ? (lang === 'ar' ? 'حجوزات' : 'Bookings') : (lang === 'ar' ? 'حجز' : 'Booking'));
      const ctrText = c.contracts_count > 0 
        ? (formatNum(c.contracts_count) + ' ' + (c.contracts_count > 1 ? (lang === 'ar' ? 'عقود' : 'Contracts') : (lang === 'ar' ? 'عقد' : 'Contract')))
        : (lang === 'ar' ? 'أفراد' : 'Indiv.');

      // Registration date formatted
      const regDate = formatNum(c.registered_date, lang);

      // Clean WhatsApp international link
      const waDigits = (c.whatsapp || c.phone || '').replace(/[^0-9]/g, '');
      const waLink = 'https://wa.me/2' + waDigits;
      const telLink = 'tel:' + waDigits;

      return '<tr class="acc-cust-row">' +
               '<!-- Customer Name & ID -->' +
               '<td>' +
                 '<div class="acc-cust-identity">' +
                   '<div class="acc-cust-avatar" aria-hidden="true">' + initial + '</div>' +
                   '<div class="acc-cust-id-info">' +
                     '<button type="button" class="acc-cust-name-btn" onclick="window.AccountsCustomers.handleProfileClick(\'' + c.id + '\')" aria-label="' + t('accounts_workspace.btn_view_profile_aria', 'عرض الملف الشامل للعميل') + ' ' + name + '">' +
                       name +
                     '</button>' +
                     '<span class="acc-code-pill">' + formatNum(c.id, lang) + '</span>' +
                   '</div>' +
                 '</div>' +
               '</td>' +

               '<!-- Contact & WhatsApp -->' +
               '<td>' +
                 '<div class="acc-cust-contact-cell">' +
                   '<span class="acc-cust-phone">' + formatNum(c.phone, lang) + '</span>' +
                   '<div class="acc-cust-contact-actions">' +
                     '<a href="' + waLink + '" target="_blank" rel="noopener noreferrer" class="acc-cust-wa-btn" aria-label="' + (lang === 'ar' ? t('accounts_workspace.wa_chat_aria', 'مراسلة عبر واتساب') : 'Chat via WhatsApp') + ' (' + c.phone + ')">' +
                       '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>' +
                       '<span>' + (lang === 'ar' ? 'واتساب' : 'WhatsApp') + '</span>' +
                     '</a>' +
                     '<a href="' + telLink + '" class="acc-cust-tel-btn" aria-label="' + (lang === 'ar' ? t('accounts_workspace.tel_call_aria', 'اتصال هاتفي مباشر') : 'Direct Phone Call') + '">' +
                       '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>' +
                     '</a>' +
                   '</div>' +
                 '</div>' +
               '</td>' +

               '<!-- Governorate -->' +
               '<td>' +
                 '<span class="acc-gov-badge">' + gov + '</span>' +
               '</td>' +

               '<!-- Enrolled Program -->' +
               '<td>' +
                 '<div class="acc-prog-cell">' +
                   '<span class="acc-prog-title">' + prog + '</span>' +
                   '<span class="acc-ref-sub">' + formatNum(c.booking_ref, lang) + '</span>' +
                 '</div>' +
               '</td>' +

               '<!-- Bookings & Contracts Counts -->' +
               '<td>' +
                 '<div class="acc-counts-cell">' +
                   '<span class="acc-count-chip chip-bkg" title="' + bkgText + '">' +
                     '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg> ' +
                     bkgText +
                   '</span>' +
                   '<span class="acc-count-chip chip-ctr" title="' + ctrText + '">' +
                     '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path></svg> ' +
                     ctrText +
                   '</span>' +
                 '</div>' +
               '</td>' +

               '<!-- Booking Status -->' +
               '<td>' +
                 '<span class="acc-status-pill ' + bkgStatus.cssClass + '">' + bkgStatus.label + '</span>' +
               '</td>' +

               '<!-- Payment Status -->' +
               '<td>' +
                 '<div class="acc-fin-cell">' +
                   '<span class="acc-status-pill ' + payStatus.cssClass + '">' + payStatus.label + '</span>' +
                   '<span class="acc-amount-sub">' + formatCurr(c.paid_amount) + '</span>' +
                 '</div>' +
               '</td>' +

               '<!-- Refund Status -->' +
               '<td>' +
                 '<span class="acc-status-pill ' + refStatus.cssClass + '">' + refStatus.label + '</span>' +
               '</td>' +

               '<!-- Registration Date -->' +
               '<td>' +
                 '<span class="acc-date-cell">' + regDate + '</span>' +
               '</td>' +

               '<!-- Action: View Customer Profile -->' +
               '<td class="acc-td-actions">' +
                 '<button type="button" class="acc-btn-profile" onclick="window.AccountsCustomers.handleProfileClick(\'' + c.id + '\')" aria-label="' + t('accounts_workspace.btn_view_profile_aria', 'عرض الملف الشامل للعميل') + ' ' + name + '">' +
                   '<span>' + t('accounts_workspace.btn_view_profile', 'عرض الملف') + '</span>' +
                   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="acc-profile-icon"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
                 '</button>' +
               '</td>' +
             '</tr>';
    }).join('');
  }

  // --- 4. Customer Profile Navigation Controller (Section 10) ---
  function handleProfileClick(customerId) {
    if (!customerId) return;
    try {
      sessionStorage.setItem('miqat_selected_customer_id', customerId);
    } catch (e) {}

    // Navigate to the official Customer Profile page with stable customer ID parameter
    const targetUrl = 'accounts-customer-details.html?id=' + encodeURIComponent(customerId);
    window.location.href = targetUrl;
  }

  // --- 5. Export Filtered Results to CSV (Section 11) ---
  function exportFilteredResultsToCSV() {
    if (!window.AccountsMockData || !window.AccountsMockData.filterCustomerDirectory) return;
    const lang = getLang();
    const items = window.AccountsMockData.filterCustomerDirectory(state);

    if (items.length === 0) {
      showNotification(lang === 'ar' ? 'لا توجد سجلات مطابقة للتصدير' : 'No records match for export');
      return;
    }

    const headers = lang === 'ar'
      ? ['معرف العميل', 'اسم العميل', 'رقم الهاتف', 'الواتساب', 'المحافظة', 'البرنامج المختار', 'رقم الحجز', 'عدد الحجوزات', 'عدد العقود', 'حالة الحجز', 'حالة العقد', 'الموقف المالي', 'المبلغ الإجمالي', 'المبلغ المسدد', 'حالة الاسترداد', 'تاريخ التسجيل']
      : ['Customer ID', 'Customer Name', 'Phone', 'WhatsApp', 'Governorate', 'Selected Program', 'Booking Ref', 'Bookings Count', 'Contracts Count', 'Booking Status', 'Contract Status', 'Payment Status', 'Total Amount', 'Paid Amount', 'Refund Status', 'Registration Date'];

    const rows = items.map(c => {
      const name = lang === 'ar' ? c.name_ar : c.name_en;
      const gov = lang === 'ar' ? c.governorate_ar : c.governorate_en;
      const prog = lang === 'ar' ? c.program_ar : c.program_en;
      const bkgStatus = getBookingStatusBadge(c.booking_status).label;
      const ctrStatus = getContractStatusBadge(c.contract_status).label;
      const payStatus = getPaymentStatusBadge(c.payment_status).label;
      const refStatus = getRefundStatusBadge(c.refund_status).label;

      return [
        c.id,
        '"' + name.replace(/"/g, '""') + '"',
        '\'' + c.phone,
        '\'' + (c.whatsapp || c.phone),
        '"' + gov + '"',
        '"' + prog.replace(/"/g, '""') + '"',
        c.booking_ref,
        c.bookings_count,
        c.contracts_count,
        '"' + bkgStatus + '"',
        '"' + ctrStatus + '"',
        '"' + payStatus + '"',
        c.total_spent,
        c.paid_amount,
        '"' + refStatus + '"',
        c.registered_date
      ].join(',');
    });

    // Add UTF-8 BOM for Excel Arabic character compatibility
    const csvContent = '\uFEFF' + headers.join(',') + '\r\n' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = 'Miqat_Customers_Directory_' + timestamp + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(lang === 'ar' 
      ? ('تم تصدير ' + formatNum(items.length) + ' سجل بنجاح بتنسيق CSV') 
      : ('Exported ' + formatNum(items.length) + ' customer records successfully'));
  }

  // --- 6. Reset Filters ---
  function resetAllFilters() {
    state.search = '';
    state.governorate = 'all';
    state.program = 'all';
    state.bookingStatus = 'all';
    state.contractStatus = 'all';
    state.paymentStatus = 'all';
    state.refundStatus = 'all';
    state.page = 1;

    const searchInput = document.getElementById('cust-search-input');
    const clearBtn = document.getElementById('cust-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    ['filter-cust-governorate', 'filter-cust-program', 'filter-cust-bkg-status', 'filter-cust-contract-status', 'filter-cust-payment-status', 'filter-cust-refund-status'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
    });

    renderDirectoryTable();
    showNotification(getLang() === 'ar' ? 'تمت إعادة ضبط كافة فلاتر الدليل' : 'All directory filters reset');
  }

  // --- 7. Event Listeners Initialization ---
  function initEventListeners() {
    // Search input
    const searchInput = document.getElementById('cust-search-input');
    const searchClear = document.getElementById('cust-search-clear');

    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', function () {
        const val = this.value;
        if (searchClear) searchClear.style.display = val.length > 0 ? 'inline-flex' : 'none';

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.search = val.trim();
          state.page = 1;
          renderDirectoryTable();
        }, 180);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        this.style.display = 'none';
        state.search = '';
        state.page = 1;
        renderDirectoryTable();
      });
    }

    // Filter selects
    const selectMappings = [
      { id: 'filter-cust-governorate', key: 'governorate' },
      { id: 'filter-cust-program', key: 'program' },
      { id: 'filter-cust-bkg-status', key: 'bookingStatus' },
      { id: 'filter-cust-contract-status', key: 'contractStatus' },
      { id: 'filter-cust-payment-status', key: 'paymentStatus' },
      { id: 'filter-cust-refund-status', key: 'refundStatus' }
    ];

    selectMappings.forEach(mapping => {
      const el = document.getElementById(mapping.id);
      if (el) {
        el.addEventListener('change', function () {
          state[mapping.key] = this.value;
          state.page = 1;
          renderDirectoryTable();
        });
      }
    });

    // Reset Buttons
    const resetBtn = document.getElementById('cust-btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);

    const emptyResetBtn = document.getElementById('cust-btn-empty-reset');
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

    // Export Button
    const exportBtn = document.getElementById('cust-btn-export');
    if (exportBtn) exportBtn.addEventListener('click', exportFilteredResultsToCSV);

    // Pagination Buttons
    const prevBtn = document.getElementById('cust-pg-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (state.page > 1) {
          state.page--;
          renderDirectoryTable();
          const tableCard = document.querySelector('.acc-cust-table-card');
          if (tableCard) tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    const nextBtn = document.getElementById('cust-pg-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        state.page++;
        renderDirectoryTable();
        const tableCard = document.querySelector('.acc-cust-table-card');
        if (tableCard) tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // --- 8. Public API & Bootstrapping ---
  window.AccountsCustomers = {
    handleProfileClick,
    exportFilteredResultsToCSV,
    resetAllFilters,
    render: function () {
      renderSummaryMetrics();
      renderDirectoryTable();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    renderSummaryMetrics();
    renderDirectoryTable();
    initEventListeners();

    // Register refresh callback for language and theme switching
    if (window.AccountsWorkspace && window.AccountsWorkspace.onPageRefresh) {
      window.AccountsWorkspace.onPageRefresh(function () {
        renderSummaryMetrics();
        renderDirectoryTable();
      });
    }
  });

})();
