/* ==========================================================================
   Miqat Sales & Call Center CRM — Page 2: Customers Workspace Controller
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;
  if (!WS) return;

  var PAGE_SIZE = 9;
  var state = {
    q: '',
    group: '',
    cancelReason: '',
    sort: 'fresh_first',
    view: sessionStorage.getItem('sls_cust_view') || 'cards',
    page: 1,
    followupState: '',
    contactState: '',
    callOutcome: '',
    gov: '',
    source: '',
    referrer: '',
    companyId: '',
    programId: '',
    createdFrom: '',
    createdTo: '',
    selectedIds: new Set()
  };

  var lastPayload = null;
  var catalogHydrated = false;

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function localized(obj, arKey, enKey) {
    if (!obj) return '';
    return WS.getLang() === 'en' ? (obj[enKey] || obj[arKey] || '') : (obj[arKey] || obj[enKey] || '');
  }

  function formatTs(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(WS.getLang() === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (_) {
      return String(iso);
    }
  }

  function groupLabel(grp) {
    if (grp === 'fresh_lead') return WS.t('grp_fresh', 'Fresh Leads');
    if (grp === 'follow_with_due') return WS.t('grp_follow_due', 'Follow with Due Date');
    if (grp === 'follow_without_due') return WS.t('grp_follow_nodue', 'Follow without Due Date');
    if (grp === 'cancelled') return WS.t('grp_cancelled', 'Cancelled');
    return grp;
  }

  function cancelLabel(reason) {
    var map = {
      low_budget: WS.t('cancel_low_budget', 'Low Budget'),
      not_interested: WS.t('cancel_not_interested', 'Not Interested'),
      not_registered_campaign: WS.t('cancel_not_registered', 'Did Not Register Through Campaign'),
      inappropriate_behavior: WS.t('cancel_inappropriate', 'Inappropriate Behavior'),
      other: WS.t('cancel_other', 'Other Reasons')
    };
    return map[reason] || reason || '';
  }

  function buildQuery() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.group) p.set('group', state.group);
    if (state.cancelReason) p.set('cancelReason', state.cancelReason);
    if (state.sort) p.set('sort', state.sort);
    if (state.followupState) p.set('followupState', state.followupState);
    if (state.contactState) p.set('contactState', state.contactState);
    if (state.callOutcome) p.set('callOutcome', state.callOutcome);
    if (state.gov) p.set('govs', state.gov);
    if (state.source) p.set('sources', state.source);
    if (state.referrer) p.set('referrer', state.referrer);
    if (state.companyId) p.set('companyIds', state.companyId);
    if (state.programId) p.set('programIds', state.programId);
    if (state.createdFrom) p.set('createdFrom', state.createdFrom);
    if (state.createdTo) p.set('createdTo', state.createdTo);
    var qs = p.toString();
    return qs ? ('?' + qs) : '';
  }

  function hydrateCatalog() {
    if (!lastPayload || !lastPayload.filterCatalog) return;
    var cat = lastPayload.filterCatalog;
    var compSel = document.getElementById('cust-flt-company');
    var progSel = document.getElementById('cust-flt-program');
    var refSel = document.getElementById('cust-flt-referrer');

    compSel.innerHTML = '<option value="">' + esc(WS.t('flt_all_companies')) + '</option>' +
      cat.companies.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === state.companyId ? ' selected' : '') + '>' + esc(localized(c, 'name_ar', 'name_en')) + '</option>';
      }).join('');

    var progs = cat.programs.filter(function (p) { return !state.companyId || p.company_id === state.companyId; });
    progSel.innerHTML = '<option value="">' + esc(WS.t('flt_all_programs')) + '</option>' +
      progs.map(function (p) {
        return '<option value="' + esc(p.id) + '"' + (p.id === state.programId ? ' selected' : '') + '>' + esc(localized(p, 'title_ar', 'title_en')) + '</option>';
      }).join('');

    if (!catalogHydrated) {
      refSel.innerHTML = '<option value="">All Referrers / كل المرشحين</option>' +
        (cat.referrers || []).map(function (r) { return '<option value="' + esc(r) + '">' + esc(r) + '</option>'; }).join('');
      catalogHydrated = true;
    }
  }

  function renderStatusGroups() {
    var gc = (lastPayload && lastPayload.groupCounts) || { fresh_lead: 0, follow_with_due: 0, follow_without_due: 0 };
    var groups = [
      { id: 'fresh_lead', title: WS.t('grp_fresh'), desc: WS.t('grp_fresh_desc'), count: gc.fresh_lead, pill: 'status-pill-amber' },
      { id: 'follow_with_due', title: WS.t('grp_follow_due'), desc: WS.t('grp_follow_due_desc'), count: gc.follow_with_due, pill: 'status-pill-navy' },
      { id: 'follow_without_due', title: WS.t('grp_follow_nodue'), desc: WS.t('grp_follow_nodue_desc'), count: gc.follow_without_due, pill: 'status-pill-blue' }
    ];
    document.getElementById('cust-main-groups').innerHTML = groups.map(function (g) {
      var active = state.group === g.id && !state.cancelReason;
      return '<button type="button" class="sls-group-card ' + (active ? 'is-active' : '') + '" data-pick-group="' + g.id + '">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; width:100%;">' +
          '<strong class="sls-item-title">' + esc(g.title) + '</strong>' +
          '<span class="status-pill ' + g.pill + '">' + esc(WS.formatNumber(g.count)) + '</span>' +
        '</div>' +
        '<span class="sls-item-meta">' + esc(g.desc) + '</span>' +
      '</button>';
    }).join('');

    var cc = (lastPayload && lastPayload.cancellationCounts) || {};
    var cancelReasons = ['low_budget', 'not_interested', 'not_registered_campaign', 'inappropriate_behavior', 'other'];
    document.getElementById('cust-cancel-groups').innerHTML = cancelReasons.map(function (r) {
      var active = state.group === 'cancelled' && state.cancelReason === r;
      return '<button type="button" class="sls-group-card ' + (active ? 'is-active' : '') + '" data-pick-cancel="' + r + '">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; width:100%;">' +
          '<strong class="sls-item-title">' + esc(cancelLabel(r)) + '</strong>' +
          '<span class="status-pill status-pill-slate">' + esc(WS.formatNumber(cc[r] || 0)) + '</span>' +
        '</div>' +
      '</button>';
    }).join('');
  }

  function renderFilterChips() {
    var items = (lastPayload && lastPayload.items) || [];
    var totalGlobal = (lastPayload && lastPayload.totalGlobal) || 0;
    document.getElementById('cust-global-summary').textContent =
      WS.t('flt_summary_prefix') + ': ' + WS.formatNumber(items.length) + ' / ' + WS.formatNumber(totalGlobal);
    document.getElementById('cust-match-summary').textContent =
      WS.t('flt_summary_prefix') + ': ' + WS.formatNumber(items.length);

    var chips = [];
    if (state.q) chips.push({ key: 'q', label: 'Search: ' + state.q });
    if (state.group) chips.push({ key: 'group', label: groupLabel(state.group) });
    if (state.cancelReason) chips.push({ key: 'cancelReason', label: cancelLabel(state.cancelReason) });
    if (state.gov) chips.push({ key: 'gov', label: WS.t('geo_' + state.gov, state.gov) });
    if (state.source) chips.push({ key: 'source', label: WS.t('src_' + state.source, state.source) });
    if (state.companyId) chips.push({ key: 'companyId', label: state.companyId });
    if (state.programId) chips.push({ key: 'programId', label: state.programId });
    if (state.followupState) chips.push({ key: 'followupState', label: state.followupState });
    if (state.contactState) chips.push({ key: 'contactState', label: state.contactState });
    if (state.callOutcome) chips.push({ key: 'callOutcome', label: state.callOutcome });

    document.getElementById('cust-chips-list').innerHTML = chips.map(function (ch) {
      return '<button type="button" class="sls-filter-chip" data-clear-key="' + esc(ch.key) + '">' + esc(ch.label) + ' ×</button>';
    }).join('');
  }

  function updateBulkControls() {
    var cnt = state.selectedIds.size;
    document.getElementById('cust-selected-count').textContent = WS.formatNumber(cnt);
    document.getElementById('cust-bulk-action-sel').disabled = cnt === 0;
    document.getElementById('cust-bulk-apply').disabled = cnt === 0;
  }

  function renderResults() {
    var allItems = (lastPayload && lastPayload.items) || [];
    var totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = allItems.slice(start, start + PAGE_SIZE);

    var emptyEl = document.getElementById('cust-empty');
    var gridEl = document.getElementById('cust-grid');
    var tableWrap = document.getElementById('cust-table-wrap');
    var pagEl = document.getElementById('cust-pagination');

    if (!allItems.length) {
      emptyEl.hidden = false;
      gridEl.hidden = true;
      tableWrap.hidden = true;
      pagEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    pagEl.hidden = totalPages <= 1;
    document.getElementById('cust-page-info').textContent =
      WS.formatNumber(state.page) + ' / ' + WS.formatNumber(totalPages);
    document.getElementById('cust-prev-page').disabled = state.page <= 1;
    document.getElementById('cust-next-page').disabled = state.page >= totalPages;

    if (state.view === 'table') {
      gridEl.hidden = true;
      tableWrap.hidden = false;
      tableWrap.innerHTML =
        '<table class="sls-table"><thead><tr>' +
          '<th></th>' +
          '<th>' + esc(WS.t('tbl_customer')) + '</th>' +
          '<th>' + esc(WS.t('lbl_phone', 'Phone')) + '</th>' +
          '<th>' + esc(WS.t('lbl_gov', 'Governorate')) + '</th>' +
          '<th>' + esc(WS.t('lbl_source', 'Source')) + '</th>' +
          '<th>' + esc(WS.t('lbl_status', 'Status')) + '</th>' +
          '<th>' + esc(WS.t('lbl_last_contact', 'Last Contact')) + '</th>' +
          '<th>' + esc(WS.t('tbl_outcome')) + '</th>' +
          '<th>' + esc(WS.t('lbl_next_fup', 'Next Follow-up')) + '</th>' +
          '<th>' + esc(WS.t('lbl_actions', 'Actions')) + '</th>' +
        '</tr></thead><tbody>' +
        pageItems.map(function (c) {
          var name = localized(c, 'name_ar', 'name_en');
          var checked = state.selectedIds.has(c.id) ? ' checked' : '';
          return '<tr data-open-cust="' + esc(c.id) + '">' +
            '<td><input type="checkbox" data-sel-cust="' + esc(c.id) + '"' + checked + ' aria-label="Select customer"></td>' +
            '<td><strong>' + esc(name) + '</strong></td>' +
            '<td><bdi dir="ltr">' + esc(c.phone) + '</bdi></td>' +
            '<td>' + esc(WS.t('geo_' + c.governorate, c.governorate)) + '</td>' +
            '<td>' + esc(WS.t('src_' + c.source, c.source)) + '</td>' +
            '<td><span class="status-pill status-pill-navy">' + esc(groupLabel(c.customer_group)) + '</span></td>' +
            '<td><bdi dir="ltr">' + esc(formatTs(c.last_call_at)) + '</bdi></td>' +
            '<td>' + esc(c.last_call_outcome || '—') + '</td>' +
            '<td><bdi dir="ltr">' + esc(c.next_followup_at ? formatTs(c.next_followup_at) : '—') + '</bdi></td>' +
            '<td style="display:flex; gap:0.35rem;">' +
              '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-preview-cust="' + esc(c.id) + '">' + esc(WS.t('btn_preview', 'Preview')) + '</button>' +
              '<a href="sales-call-log.html?dir=outbound&customerId=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('qa_record_outbound')) + '</a>' +
            '</td>' +
          '</tr>';
        }).join('') +
        '</tbody></table>';
      return;
    }

    tableWrap.hidden = true;
    gridEl.hidden = false;
    gridEl.innerHTML = pageItems.map(function (c) {
      var name = localized(c, 'name_ar', 'name_en');
      var empName = localized(c, 'assigned_employee_ar', 'assigned_employee_en');
      var waDigits = String(c.whatsapp || c.phone || '').replace(/[^\d]/g, '');
      if (waDigits.startsWith('01')) waDigits = '2' + waDigits;
      var checked = state.selectedIds.has(c.id) ? ' checked' : '';
      var fupStr = c.next_followup_at ? formatTs(c.next_followup_at) : (c.open_followups > 0 ? WS.t('fup_status_undated') : '—');
      var statusText = c.customer_group === 'cancelled'
        ? cancelLabel(c.cancellation_reason)
        : groupLabel(c.customer_group);

      return '<article class="sls-sub-card sls-cust-card" data-open-cust="' + esc(c.id) + '">' +
        '<div style="display:flex; justify-content:space-between; gap:0.5rem; align-items:flex-start;">' +
          '<label class="sls-ms-item" style="align-items:flex-start;"><input type="checkbox" data-sel-cust="' + esc(c.id) + '"' + checked + ' aria-label="Select customer"><div><strong class="sls-item-title">' + esc(name) + '</strong><div class="sls-item-meta"><bdi dir="ltr">' + esc(c.phone) + '</bdi> • ' + esc(WS.t('geo_' + c.governorate, c.governorate)) + '</div></div></label>' +
          '<span class="status-pill ' + (c.has_overdue ? 'status-pill-amber' : 'status-pill-navy') + '">' + esc(statusText) + '</span>' +
        '</div>' +
        '<div class="sls-item-meta">' +
          esc(WS.t('src_' + c.source, c.source)) + (c.referrer_name ? (' (' + esc(c.referrer_name) + ')') : '') +
          ' • ' + esc(empName) +
        '</div>' +
        '<div class="sls-item-meta">' +
          esc(WS.t('lbl_last_contact', 'Last Call')) + ': <bdi dir="ltr">' + esc(formatTs(c.last_call_at)) + '</bdi>' +
          (c.last_call_outcome ? (' (' + esc(c.last_call_outcome) + ')') : '') +
        '</div>' +
        '<div class="sls-item-meta">' +
          esc(WS.t('lbl_next_fup', 'Next Follow-up')) + ': <bdi dir="ltr">' + esc(fupStr) + '</bdi> • ' + esc(WS.t('lbl_updated', 'Updated')) + ': <bdi dir="ltr">' + esc(formatTs(c.updated_at)) + '</bdi>' +
        '</div>' +
        '<div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-block-start:auto; padding-block-start:0.35rem; border-top:1px solid var(--color-border-subtle);">' +
          '<a href="tel:' + esc(c.phone) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('btn_call', 'Call')) + '</a>' +
          '<a href="https://wa.me/' + esc(waDigits) + '" target="_blank" rel="noopener" class="acc-btn acc-btn-secondary acc-btn-sm">WhatsApp</a>' +
          '<a href="sales-call-log.html?dir=outbound&customerId=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('qa_record_outbound')) + '</a>' +
          '<a href="sales-followup-form.html?customerId=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('qa_schedule_followup')) + '</a>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-preview-cust="' + esc(c.id) + '">' + esc(WS.t('btn_preview', 'Preview')) + '</button>' +
          '<a href="sales-customer-details.html?id=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('btn_details', 'Details')) + '</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function openQuickPreview(customerId) {
    var items = (lastPayload && lastPayload.items) || [];
    var c = items.find(function (x) { return x.id === customerId; });
    if (!c) return;
    document.getElementById('preview-title').textContent = localized(c, 'name_ar', 'name_en');
    document.getElementById('preview-body').innerHTML =
      '<div><strong>' + esc(WS.t('lbl_phone', 'Phone')) + ':</strong> <bdi dir="ltr">' + esc(c.phone) + '</bdi> • <strong>WhatsApp:</strong> <bdi dir="ltr">' + esc(c.whatsapp || c.phone) + '</bdi></div>' +
      '<div><strong>' + esc(WS.t('lbl_status', 'Status')) + ':</strong> ' + esc(groupLabel(c.customer_group)) + '</div>' +
      '<div><strong>' + esc(WS.t('lbl_last_contact', 'Last Call')) + ':</strong> ' + esc(formatTs(c.last_call_at)) + ' (' + esc(c.last_call_outcome || '—') + ')</div>' +
      '<div><strong>' + esc(WS.t('lbl_next_fup', 'Next Follow-up')) + ':</strong> ' + esc(c.next_followup_at ? formatTs(c.next_followup_at) : '—') + '</div>' +
      (c.cancellation_reason ? ('<div><strong>' + esc(WS.t('cancel_reason_lbl', 'Cancellation Reason')) + ':</strong> ' + esc(cancelLabel(c.cancellation_reason)) + (c.cancellation_other_note ? (' — ' + esc(c.cancellation_other_note)) : '') + '</div>') : '');

    document.getElementById('preview-actions').innerHTML =
      '<a href="sales-call-log.html?dir=outbound&customerId=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('qa_record_outbound')) + '</a>' +
      '<a href="sales-customer-edit.html?id=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('btn_edit', 'Edit')) + '</a>' +
      '<a href="sales-customer-cancel.html?id=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('btn_cancel_cust', 'Cancel')) + '</a>' +
      '<a href="sales-customer-details.html?id=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('btn_open_full_details', 'Open Full Details')) + '</a>';

    var dlg = document.getElementById('cust-preview-dialog');
    dlg.returnValue = '';
    dlg.showModal();
  }

  function renderAll() {
    if (!lastPayload) return;
    hydrateCatalog();
    renderStatusGroups();
    renderFilterChips();
    renderResults();
    updateBulkControls();
  }

  async function loadCustomers() {
    document.getElementById('cust-loading').hidden = false;
    try {
      lastPayload = await WS.apiFetch('/api/sales/customers' + buildQuery(), { method: 'GET' });
      renderAll();
    } finally {
      document.getElementById('cust-loading').hidden = true;
    }
  }

  function resetFilters() {
    state.q = '';
    state.group = '';
    state.cancelReason = '';
    state.followupState = '';
    state.contactState = '';
    state.callOutcome = '';
    state.gov = '';
    state.source = '';
    state.referrer = '';
    state.companyId = '';
    state.programId = '';
    state.createdFrom = '';
    state.createdTo = '';
    state.page = 1;
    document.getElementById('cust-search').value = '';
    document.getElementById('cust-group-sel').value = '';
    document.getElementById('cust-flt-followup').value = '';
    document.getElementById('cust-flt-contact').value = '';
    document.getElementById('cust-flt-call-outcome').value = '';
    document.getElementById('cust-flt-gov').value = '';
    document.getElementById('cust-flt-source').value = '';
    document.getElementById('cust-flt-referrer').value = '';
    document.getElementById('cust-flt-cancel-reason').value = '';
    document.getElementById('cust-flt-from').value = '';
    document.getElementById('cust-flt-to').value = '';
    loadCustomers();
  }

  function bindEvents() {
    document.getElementById('cust-search').addEventListener('input', function (e) {
      state.q = e.target.value.trim();
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-group-sel').addEventListener('change', function (e) {
      state.group = e.target.value;
      if (state.group !== 'cancelled') state.cancelReason = '';
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-sort').addEventListener('change', function (e) {
      state.sort = e.target.value;
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('view-btn-cards').addEventListener('click', function () {
      state.view = 'cards';
      sessionStorage.setItem('sls_cust_view', 'cards');
      this.classList.add('is-active');
      document.getElementById('view-btn-table').classList.remove('is-active');
      renderResults();
    });

    document.getElementById('view-btn-table').addEventListener('click', function () {
      state.view = 'table';
      sessionStorage.setItem('sls_cust_view', 'table');
      this.classList.add('is-active');
      document.getElementById('view-btn-cards').classList.remove('is-active');
      renderResults();
    });

    document.getElementById('cust-toggle-adv').addEventListener('click', function () {
      var panel = document.getElementById('cust-adv-panel');
      panel.hidden = !panel.hidden;
      this.setAttribute('aria-expanded', !panel.hidden ? 'true' : 'false');
    });

    document.getElementById('cust-flt-company').addEventListener('change', function (e) {
      state.companyId = e.target.value;
      state.programId = '';
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-flt-program').addEventListener('change', function (e) {
      state.programId = e.target.value;
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-apply-adv').addEventListener('click', function () {
      state.followupState = document.getElementById('cust-flt-followup').value;
      state.contactState = document.getElementById('cust-flt-contact').value;
      state.callOutcome = document.getElementById('cust-flt-call-outcome').value;
      state.gov = document.getElementById('cust-flt-gov').value;
      state.source = document.getElementById('cust-flt-source').value;
      state.referrer = document.getElementById('cust-flt-referrer').value;
      state.cancelReason = document.getElementById('cust-flt-cancel-reason').value;
      if (state.cancelReason) state.group = 'cancelled';
      state.createdFrom = document.getElementById('cust-flt-from').value;
      state.createdTo = document.getElementById('cust-flt-to').value;
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-clear-all').addEventListener('click', resetFilters);
    document.getElementById('cust-empty-reset').addEventListener('click', resetFilters);

    document.getElementById('cust-chips-list').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-clear-key]');
      if (!btn) return;
      var k = btn.getAttribute('data-clear-key');
      state[k] = '';
      if (k === 'group') document.getElementById('cust-group-sel').value = '';
      if (k === 'q') document.getElementById('cust-search').value = '';
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-main-groups').addEventListener('click', function (e) {
      var card = e.target.closest('[data-pick-group]');
      if (!card) return;
      var g = card.getAttribute('data-pick-group');
      state.group = state.group === g ? '' : g;
      state.cancelReason = '';
      document.getElementById('cust-group-sel').value = state.group;
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-cancel-groups').addEventListener('click', function (e) {
      var card = e.target.closest('[data-pick-cancel]');
      if (!card) return;
      var r = card.getAttribute('data-pick-cancel');
      if (state.group === 'cancelled' && state.cancelReason === r) {
        state.group = '';
        state.cancelReason = '';
      } else {
        state.group = 'cancelled';
        state.cancelReason = r;
      }
      document.getElementById('cust-group-sel').value = state.group;
      state.page = 1;
      loadCustomers();
    });

    document.getElementById('cust-prev-page').addEventListener('click', function () {
      if (state.page > 1) { state.page -= 1; renderResults(); }
    });
    document.getElementById('cust-next-page').addEventListener('click', function () {
      state.page += 1;
      renderResults();
    });

    document.getElementById('cust-select-all').addEventListener('change', function (e) {
      var items = (lastPayload && lastPayload.items) || [];
      if (e.target.checked) items.forEach(function (c) { state.selectedIds.add(c.id); });
      else state.selectedIds.clear();
      renderResults();
      updateBulkControls();
    });

    document.getElementById('cust-bulk-apply').addEventListener('click', function () {
      var act = document.getElementById('cust-bulk-action-sel').value;
      if (!act || !state.selectedIds.size) return;
      if (act === 'export') {
        var items = (lastPayload && lastPayload.items || []).filter(function (c) { return state.selectedIds.has(c.id); });
        var csv = ['Name,Phone,Governorate,Status'].concat(items.map(function (c) {
          return '"' + (c.name_en || c.name_ar) + '","' + c.phone + '","' + c.governorate + '","' + c.customer_group + '"';
        })).join('\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'miqat-customers-export.csv';
        a.click();
        return;
      }
      var dlg = document.getElementById('cust-bulk-dialog');
      document.getElementById('bulk-dlg-body').textContent = WS.t('bulk_confirm_body', 'Apply action to selected customers:') + ' ' + WS.formatNumber(state.selectedIds.size);
      dlg.dataset.action = act;
      dlg.returnValue = '';
      dlg.showModal();
    });

    document.getElementById('cust-bulk-dialog').addEventListener('close', async function () {
      if (this.returnValue !== 'confirm') return;
      var parts = (this.dataset.action || '').split(':');
      if (parts[0] === 'stage') {
        await WS.apiFetch('/api/sales/customers/bulk', {
          method: 'POST',
          body: JSON.stringify({ customerIds: Array.from(state.selectedIds), action: 'stage', stage: parts[1] })
        });
        state.selectedIds.clear();
        await loadCustomers();
      }
    });

    document.addEventListener('click', function (e) {
      var prevBtn = e.target.closest('[data-preview-cust]');
      if (prevBtn) {
        e.stopPropagation();
        openQuickPreview(prevBtn.getAttribute('data-preview-cust'));
        return;
      }
      if (e.target.closest('a, button, input, select, label')) return;
      var openTarget = e.target.closest('[data-open-cust]');
      if (openTarget) {
        window.location.href = 'sales-customer-details.html?id=' + encodeURIComponent(openTarget.getAttribute('data-open-cust'));
      }
    });

    document.addEventListener('change', function (e) {
      var chk = e.target.closest('[data-sel-cust]');
      if (!chk) return;
      var id = chk.getAttribute('data-sel-cust');
      if (chk.checked) state.selectedIds.add(id);
      else state.selectedIds.delete(id);
      updateBulkControls();
    });

    document.getElementById('preview-close-btn').addEventListener('click', function () {
      document.getElementById('cust-preview-dialog').close();
    });

    WS.onRefresh(renderAll);
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await WS.init();
    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      state.q = params.get('q');
      document.getElementById('cust-search').value = state.q;
    }
    if (params.get('stage')) {
      var st = params.get('stage');
      if (['fresh_lead', 'follow_with_due', 'follow_without_due', 'cancelled'].indexOf(st) !== -1) {
        state.group = st;
        document.getElementById('cust-group-sel').value = st;
      }
    }
    if (state.view === 'table') {
      document.getElementById('view-btn-table').classList.add('is-active');
      document.getElementById('view-btn-cards').classList.remove('is-active');
    }
    bindEvents();
    await loadCustomers();
  });
})();
