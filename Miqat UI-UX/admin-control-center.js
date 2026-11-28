/* ==========================================================================
   Miqat Admin System — Page 1: Control Center Interactive Controller
   ========================================================================== */
(function () {
  'use strict';

  var AW = window.AdminWorkspace;
  var D = window.AdminControlData;

  if (!AW || !D) {
    console.error('[AdminControlCenter] Missing required modules (AdminWorkspace / AdminControlData).');
    return;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function closestEl(target, selector) {
    if (!target) return null;
    if (typeof target.closest === 'function') return target.closest(selector);
    if (target.parentElement && typeof target.parentElement.closest === 'function') {
      return target.parentElement.closest(selector);
    }
    return null;
  }

  function onEl(id, eventName, handler) {
    var el = byId(id);
    if (el) el.addEventListener(eventName, handler);
    return el;
  }

  function setText(id, text) {
    var el = byId(id);
    if (el) el.textContent = text;
  }

  function safeStorageGet(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('[AdminControlCenter] Storage read failed for ' + key + ':', err && err.message ? err.message : err);
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('[AdminControlCenter] Storage write failed for ' + key + ':', err && err.message ? err.message : err);
      return false;
    }
  }

  var STORAGE_LAYOUT = 'miqat_adm_cc_layout_v1';
  var STORAGE_FILTERS = 'miqat_adm_cc_filters_v1';
  var DEFAULT_WIDGET_ORDER = ['sec-overview', 'sec-workforce', 'sec-business', 'sec-analytics', 'sec-activity', 'sec-intelligence'];

  var KPI_LIBRARY = [
    { id: 'total_customers', group: 'business', ar: 'إجمالي العملاء', en: 'Total Customers', hint_ar: 'كافة العملاء المسجلين', hint_en: 'All registered customers', drill: 'customer', val: function (s) { return s.customers.length; }, delta_ar: '+١٤٪', delta_en: '+14%', dir: 'up', spark: [4, 5, 5, 6, 7, 7, 8], icon: 'users' },
    { id: 'new_today', group: 'business', ar: 'عملاء جدد اليوم', en: 'New Customers Today', hint_ar: 'خلال آخر ٢٤ ساعة', hint_en: 'In last 24 hours', drill: 'customer', val: function (s) { return s.customers.filter(function (c) { return c.stage === 'new'; }).length; }, delta_ar: '+٢', delta_en: '+2', dir: 'up', spark: [1, 2, 1, 3, 2, 2, 3], icon: 'user-plus' },
    { id: 'total_bookings', group: 'business', ar: 'إجمالي الحجوزات', en: 'Total Bookings', hint_ar: 'حجوزات قائمة ومؤكدة', hint_en: 'Active & confirmed bookings', drill: 'customer', val: function (s) { return s.customers.filter(function (c) { return c.stage === 'booked' || c.stage === 'contract_completed'; }).length; }, delta_ar: '+١٨٪', delta_en: '+18%', dir: 'up', spark: [2, 3, 2, 4, 3, 4, 5], icon: 'calendar' },
    { id: 'completed_contracts', group: 'business', ar: 'العقود المكتملة', en: 'Completed Contracts', hint_ar: 'عقود موثقة ومسدد التزامها', hint_en: 'Verified & signed contracts', drill: 'customer', val: function (s) { return s.customers.filter(function (c) { return c.stage === 'contract_completed'; }).length; }, delta_ar: '+١١٪', delta_en: '+11%', dir: 'up', spark: [1, 2, 2, 2, 3, 3, 4], icon: 'check' },
    { id: 'active_companies', group: 'business', ar: 'الشركات النشطة', en: 'Active Companies', hint_ar: 'شركاء معتمدون', hint_en: 'Approved active partners', drill: 'company', val: function () { return D.COMPANIES.filter(function (c) { return c.status === 'active'; }).length; }, delta_ar: 'مستقر', delta_en: 'Steady', dir: 'flat', spark: [3, 3, 3, 3, 3, 3, 3], icon: 'building' },
    { id: 'employees_online', group: 'workforce', ar: 'الموظفون المتصلون', en: 'Employees Online', hint_ar: 'المبيعات + الحسابات', hint_en: 'Sales + Shared Accounts', drill: 'employee', val: function () { return D.SALES_EMPLOYEES.filter(function (e) { return e.status === 'online'; }).length + (D.ACCOUNTS_SHARED.status === 'online' ? 1 : 0); }, delta_ar: 'متصل', delta_en: 'Live', dir: 'up', spark: [1, 2, 2, 3, 2, 2, 2], icon: 'team' },
    { id: 'admin_intervention', group: 'health', ar: 'طلبات تتطلب تدخل الإدارة', en: 'Requests Needing Admin', hint_ar: 'مركز الإجراءات المعلق', hint_en: 'Pending Action Center items', drill: 'request', val: function (s) { return s.actionItems.filter(function (a) { return a.status === 'pending'; }).length; }, delta_ar: 'إجراء', delta_en: 'Action', dir: 'warn', spark: [2, 3, 4, 3, 5, 4, 4], icon: 'shield' },
    { id: 'critical_alerts', group: 'health', ar: 'تنبيهات حرجة مفتوحة', en: 'Open Critical Alerts', hint_ar: 'الأمان وSLA والشركاء', hint_en: 'Security, SLA & Partners', drill: 'incident', val: function () { return D.SYSTEM_HEALTH.issues.filter(function (i) { return i.severity === 'critical' || i.severity === 'high'; }).length; }, delta_ar: 'تنبيه', delta_en: 'Alert', dir: 'warn', spark: [3, 2, 3, 2, 2, 3, 2], icon: 'alert' },
    { id: 'overdue_requests', group: 'business', ar: 'طلبات شركات متأخرة', en: 'Overdue Company Requests', hint_ar: 'تجاوزت مهلة الرد', hint_en: 'Exceeded response SLA', drill: 'request', val: function () { return D.EMP_TO_COMPANY_REQUESTS.filter(function (r) { return r.status === 'overdue'; }).length; }, delta_ar: 'مهلة', delta_en: 'SLA', dir: 'warn', spark: [1, 2, 1, 2, 1, 1, 1], icon: 'clock' },
    { id: 'payment_incomplete', group: 'business', ar: 'حجوزات بانتظار استكمال السداد', en: 'Payment Incomplete (Status)', hint_ar: 'حالة تشغيلية بدون مبالغ مالية', hint_en: 'Operational status only', drill: 'customer', val: function (s) { return s.customers.filter(function (c) { return c.payment_incomplete; }).length; }, delta_ar: 'تشغيلي', delta_en: 'Ops', dir: 'flat', spark: [1, 1, 2, 1, 1, 1, 1], icon: 'file' }
  ];

  var DEFAULT_KPI_IDS = ['total_customers', 'new_today', 'total_bookings', 'completed_contracts', 'active_companies', 'employees_online', 'admin_intervention', 'critical_alerts'];

  var PRESET_VIEWS = [
    { id: 'daily_ops', ar: 'العمليات اليومية (افتراضي)', en: 'Daily Operations (Default)', order: DEFAULT_WIDGET_ORDER.slice(), hidden: [], pinned: [], collapsed: [], kpis: DEFAULT_KPI_IDS.slice() },
    { id: 'sales_perf', ar: 'أداء المبيعات', en: 'Sales Performance', order: ['sec-workforce', 'sec-analytics', 'sec-overview', 'sec-business', 'sec-activity', 'sec-intelligence'], hidden: [], pinned: ['sec-workforce'], collapsed: [], kpis: DEFAULT_KPI_IDS.slice() },
    { id: 'companies_ov', ar: 'نظرة الشركات', en: 'Companies Overview', order: ['sec-business', 'sec-overview', 'sec-analytics', 'sec-workforce', 'sec-activity', 'sec-intelligence'], hidden: [], pinned: ['sec-business'], collapsed: [], kpis: DEFAULT_KPI_IDS.slice() },
    { id: 'sys_mon', ar: 'مراقبة النظام', en: 'System Monitoring', order: ['sec-intelligence', 'sec-overview', 'sec-activity', 'sec-workforce', 'sec-business', 'sec-analytics'], hidden: [], pinned: ['sec-intelligence'], collapsed: [], kpis: DEFAULT_KPI_IDS.slice() },
    { id: 'exec_summary', ar: 'الملخص التنفيذي', en: 'Executive Summary', order: DEFAULT_WIDGET_ORDER.slice(), hidden: [], pinned: [], collapsed: [], kpis: DEFAULT_KPI_IDS.slice() }
  ];

  var LOC_LABELS = {
    quick_filter: {
      online_staff: { ar: 'الموظفون المتصلون', en: 'Online Staff' },
      delayed_requests: { ar: 'الطلبات المتأخرة', en: 'Delayed Requests' },
      new_customers: { ar: 'العملاء الجدد', en: 'New Customers' },
      pending_approvals: { ar: 'الاعتمادات المعلقة', en: 'Pending Approvals' }
    },
    section: {
      'sec-overview': { ar: 'نظرة عامة والمهام', en: 'Overview & Actions' },
      'sec-workforce': { ar: 'القوى العاملة', en: 'Workforce' },
      'sec-business': { ar: 'نظرة الأعمال', en: 'Business' },
      'sec-analytics': { ar: 'استوديو التحليلات', en: 'Analytics Studio' },
      'sec-activity': { ar: 'النشاط المباشر', en: 'Activity Feed' },
      'sec-intelligence': { ar: 'الذكاء والصحة والنسخ', en: 'Intelligence & Health' }
    },
    data_mode: {
      live_sim: { ar: 'مباشر (محاكاة)', en: 'Live (Simulated)' },
      periodic: { ar: 'تحديث دوري', en: 'Periodic' },
      manual: { ar: 'يدوي', en: 'Manual' }
    },
    status: {
      all: { ar: 'الكل', en: 'All' },
      online: { ar: 'متصل', en: 'Online' },
      on_break: { ar: 'استراحة', en: 'On Break' },
      offline: { ar: 'غير متصل', en: 'Offline' },
      active: { ar: 'نشط', en: 'Active' },
      pending_application: { ar: 'طلب جديد قيد المراجعة', en: 'Pending Application' },
      suspended: { ar: 'موقوف', en: 'Suspended' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
      approved: { ar: 'معتمد', en: 'Approved' },
      info_requested: { ar: 'بانتظار توضيح', en: 'Info Requested' },
      pending: { ar: 'معلق', en: 'Pending' },
      overdue: { ar: 'متأخر', en: 'Overdue' },
      unanswered: { ar: 'لم يُرد عليه', en: 'Unanswered' },
      replied: { ar: 'تم الرد', en: 'Replied' },
      converted: { ar: 'محوّل لحجز', en: 'Converted' },
      new: { ar: 'جديد', en: 'New' },
      received: { ar: 'مستلم', en: 'Received' },
      closed: { ar: 'مغلق', en: 'Closed' },
      success: { ar: 'ناجح', en: 'Success' },
      failed: { ar: 'فشل', en: 'Failed' },
      warning: { ar: 'تحذير', en: 'Warning' },
      critical: { ar: 'حرج', en: 'Critical' },
      high: { ar: 'مرتفع', en: 'High' },
      medium: { ar: 'متوسط', en: 'Medium' },
      low: { ar: 'منخفض', en: 'Low' }
    }
  };

  function loc(group, key) {
    var en = AW.isEn();
    var g = LOC_LABELS[group];
    if (g && g[key]) return en ? g[key].en : g[key].ar;
    return String(key || '');
  }

  var state = {
    mode: 'advanced',
    dataMode: 'live_sim',
    focusSection: 'all',
    customizeMode: false,
    analyticsRange: 'weekly',
    analyticsTab: 'trends',
    salesRankingMetric: 'contracts',
    selectedLifecycleStage: 'all',
    selectedGeoRegion: 'africa',
    seriesVisible: { customers: true, bookings: true, contracts: true, forecast: true },
    actionFilter: 'all',
    activityFilter: 'all',
    activityDept: 'all',
    activityActor: 'all',
    activityLimit: 10,
    filterViewMode: 'summary',
    lastUpdated: new Date().toISOString(),
    actionItems: D.ACTION_CENTER_ITEMS.map(function (x) { return Object.assign({}, x); }),
    activeViewId: 'daily_ops',
    layout: {
      order: DEFAULT_WIDGET_ORDER.slice(),
      hidden: [],
      pinned: [],
      collapsed: [],
      sizes: {},
      kpis: DEFAULT_KPI_IDS.slice()
    },
    customViews: [],
    filters: {
      quick: [],
      logic: 'AND',
      negate: false,
      rules: [],
      liveMode: true,
      savedFilters: []
    },
    pendingConfirmAction: null
  };

  function loadPersistedState() {
    var parsedL = safeStorageGet(STORAGE_LAYOUT);
    if (parsedL && typeof parsedL === 'object') {
      if (parsedL.layout && typeof parsedL.layout === 'object') {
        state.layout = Object.assign({}, state.layout, parsedL.layout);
      }
      if (Array.isArray(parsedL.customViews)) state.customViews = parsedL.customViews;
      if (parsedL.activeViewId) state.activeViewId = parsedL.activeViewId;
    }
    var parsedF = safeStorageGet(STORAGE_FILTERS);
    if (parsedF && typeof parsedF === 'object') {
      state.filters = Object.assign({}, state.filters, parsedF);
    }
  }

  function saveLayoutState() {
    safeStorageSet(STORAGE_LAYOUT, {
      activeViewId: state.activeViewId,
      layout: state.layout,
      customViews: state.customViews
    });
  }

  function saveFilterState() {
    safeStorageSet(STORAGE_FILTERS, state.filters);
  }

  function getFilteredData() {
    var custs = Array.isArray(D.CUSTOMERS) ? D.CUSTOMERS.slice() : [];
    var reqs = Array.isArray(D.EMP_TO_COMPANY_REQUESTS) ? D.EMP_TO_COMPANY_REQUESTS.slice() : [];
    var emps = Array.isArray(D.SALES_EMPLOYEES) ? D.SALES_EMPLOYEES.slice() : [];
    var acts = Array.isArray(state.actionItems) ? state.actionItems.slice() : [];

    state.filters.quick.forEach(function (qf) {
      if (qf === 'new_customers') custs = custs.filter(function (c) { return c.stage === 'new' || c.stage === 'not_contacted'; });
      if (qf === 'delayed_requests') reqs = reqs.filter(function (r) { return r.status === 'overdue' || r.status === 'unanswered'; });
      if (qf === 'online_staff') emps = emps.filter(function (e) { return e.status === 'online'; });
      if (qf === 'pending_approvals') acts = acts.filter(function (a) { return a.status === 'pending'; });
    });

    if (Array.isArray(state.filters.rules) && state.filters.rules.length) {
      var evalRule = function (item, rule) {
        var rawVal = item && rule && rule.field ? item[rule.field] : '';
        var val = String(rawVal == null ? '' : rawVal).toLowerCase();
        var target = String((rule && rule.value) || '').toLowerCase();
        var res = false;
        if (rule.op === 'equals') res = val === target;
        else if (rule.op === 'contains') res = val.includes(target);
        else if (rule.op === 'not_empty') res = val.length > 0;
        else if (rule.op === 'empty') res = val.length === 0;
        else if (rule.op === 'gt') res = !isNaN(Number(val)) && !isNaN(Number(target)) && Number(val) > Number(target);
        return state.filters.negate ? !res : res;
      };
      var custRules = state.filters.rules.filter(function (r) { return r.module === 'customer'; });
      if (custRules.length) {
        custs = custs.filter(function (c) {
          return state.filters.logic === 'OR'
            ? custRules.some(function (r) { return evalRule(c, r); })
            : custRules.every(function (r) { return evalRule(c, r); });
        });
      }
      var reqRules = state.filters.rules.filter(function (r) { return r.module === 'request'; });
      if (reqRules.length) {
        reqs = reqs.filter(function (rq) {
          return state.filters.logic === 'OR'
            ? reqRules.some(function (r) { return evalRule(rq, r); })
            : reqRules.every(function (r) { return evalRule(rq, r); });
        });
      }
    }

    return { customers: custs, requests: reqs, employees: emps, actionItems: acts };
  }

  function drillUrl(type, id) {
    return 'admin-record-details.html?type=' + encodeURIComponent(type) +
      '&id=' + encodeURIComponent(id || '') +
      '&from=control-center&view=' + encodeURIComponent(state.activeViewId) +
      '&range=' + encodeURIComponent(state.analyticsRange);
  }

  function renderCommandHeader() {
    var en = AW.isEn();
    var user = AW.getUser();
    var ownerName = user ? (en ? (user.name_en || user.name) : (user.name || user.name_ar)) : (en ? 'System Owner' : 'مدير النظام');
    setText('adm-welcome-heading', en ? ('Welcome, ' + ownerName + ' — Miqat Control Center') : ('مرحباً، ' + ownerName + ' — مركز تحكم ميقات'));
    setText('adm-perm-scope-pill', en ? D.PERMISSIONS_CONTEXT.roleLabelEn : D.PERMISSIONS_CONTEXT.roleLabelAr);
    setText('adm-cmd-datetime', new Date().toLocaleString(en ? 'en-US' : 'ar-EG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }));
    setText('adm-last-updated', (en ? 'Updated: ' : 'آخر تحديث: ') + AW.formatDateTime(state.lastUpdated));

    var vSel = byId('adm-saved-views-select');
    if (vSel) {
      var allViews = PRESET_VIEWS.concat(state.customViews);
      vSel.innerHTML = allViews.map(function (v) {
        return '<option value="' + AW.esc(v.id) + '">' + AW.esc(v.name || (en ? v.en : v.ar)) + '</option>';
      }).join('');
      vSel.value = state.activeViewId;
    }

    var strip = byId('adm-active-filters-strip');
    if (!strip) return;
    var chips = [];
    state.filters.quick.forEach(function (q) {
      chips.push('<button type="button" class="sls-filter-chip" data-rm-qfilter="' + AW.esc(q) + '">' + AW.esc(loc('quick_filter', q)) + ' ×</button>');
    });
    state.filters.rules.forEach(function (r, idx) {
      chips.push('<button type="button" class="sls-filter-chip" data-rm-rule="' + idx + '">' + AW.esc(r.field + ' ' + r.op + ' ' + (r.value || '')) + ' ×</button>');
    });
    if (chips.length) {
      strip.hidden = false;
      strip.innerHTML = chips.join('') + '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="adm-clear-all-chips">' + AW.esc(en ? 'Clear All' : 'مسح الفلاتر') + '</button>';
    } else {
      strip.hidden = true;
      strip.innerHTML = '';
    }
  }

  function renderActionCenter(fd) {
    var en = AW.isEn();
    var wrap = byId('adm-action-center-wrap');
    if (!wrap) return;
    var items = fd.actionItems.filter(function (i) {
      return state.actionFilter === 'all' || i.category === state.actionFilter;
    });

    var cats = [
      { k: 'all', ar: 'الكل', en: 'All' },
      { k: 'company_application', ar: 'طلبات شركات', en: 'Company Apps' },
      { k: 'approval', ar: 'اعتمادات', en: 'Approvals' },
      { k: 'overdue_request', ar: 'طلبات متأخرة', en: 'Overdue' },
      { k: 'security_alert', ar: 'تنبيهات أمنية', en: 'Security' }
    ];

    var sevPill = function (sev) {
      if (sev === 'critical' || sev === 'high') return 'status-pill-amber';
      if (sev === 'medium') return 'status-pill-blue';
      return 'status-pill-slate';
    };

    wrap.innerHTML =
      '<div class="sls-card adm-action-center-card">' +
      '<header class="sls-card-head">' +
      '<div>' +
      '<h2 class="sls-card-title">' + AW.esc(en ? 'Action Center — Immediate Owner Attention' : 'مركز الإجراءات — مهام تتطلب انتباه الإدارة') + '</h2>' +
      '<p class="sls-card-desc">' + AW.esc(en ? 'Pending approvals, company applications, SLA breaches, and security alerts.' : 'الاعتمادات المعلقة، طلبات الشركات الجديدة، تجاوزات SLA، والتنبيهات الأمنية.') + '</p>' +
      '</div>' +
      '<div class="sls-period-pills">' +
      cats.map(function (c) {
        var active = state.actionFilter === c.k;
        return '<button type="button" class="acc-btn ' + (active ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-ac-filter="' + c.k + '">' + AW.esc(en ? c.en : c.ar) + '</button>';
      }).join('') +
      '</div>' +
      '</header>' +
      (items.length ? '<div class="adm-ac-list">' + items.map(function (it) {
        var isDone = it.status !== 'pending';
        return '<article class="sls-sub-card adm-ac-item ' + (isDone ? 'is-resolved' : '') + '" data-ac-id="' + AW.esc(it.id) + '">' +
          '<div class="sls-prog-card-top">' +
          '<div class="sls-prog-badges">' +
          '<span class="status-pill ' + sevPill(it.severity) + '">' + AW.esc(loc('status', it.severity)) + '</span>' +
          '<span class="status-pill status-pill-navy">' + AW.esc(en ? it.wait_label_en : it.wait_label_ar) + '</span>' +
          (isDone ? '<span class="status-pill status-pill-slate">' + AW.esc(loc('status', it.status)) + '</span>' : '') +
          '</div>' +
          '<span class="sls-item-meta">' + AW.esc(en ? it.owner_en : it.owner_ar) + '</span>' +
          '</div>' +
          '<strong class="sls-item-title">' + AW.esc(en ? it.title_en : it.title_ar) + '</strong>' +
          '<p class="sls-item-meta">' + AW.esc(en ? it.reason_en : it.reason_ar) + ' • <strong>' + AW.esc(en ? 'Impact:' : 'الأثر:') + '</strong> ' + AW.esc(en ? it.impact_en : it.impact_ar) + '</p>' +
          '<div class="sls-prog-actions">' +
          '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" data-ac-do="approve" data-id="' + AW.esc(it.id) + '" ' + (isDone ? 'disabled' : '') + '>' + AW.esc(en ? 'Approve' : 'اعتماد') + '</button>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-ac-do="reject" data-id="' + AW.esc(it.id) + '" ' + (isDone ? 'disabled' : '') + '>' + AW.esc(en ? 'Reject' : 'رفض') + '</button>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-ac-do="info" data-id="' + AW.esc(it.id) + '" ' + (isDone ? 'disabled' : '') + '>' + AW.esc(en ? 'Request Info' : 'طلب توضيح') + '</button>' +
          '<a href="' + AW.esc(drillUrl(it.entity_type, it.entity_id)) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Open Review Page' : 'فتح صفحة المراجعة') + '</a>' +
          '</div>' +
          '</article>';
      }).join('') + '</div>' : '<div class="sls-empty-state"><p>' + AW.esc(en ? 'No action items in this category.' : 'لا توجد مهام معلقة في هذا التصنيف.') + '</p></div>') +
      '</div>';
  }

  function buildKpiIconSvg(iconName) {
      var paths = {
        users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
        'user-plus': '<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
        calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
        check: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
        team: '<circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>',
        shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        alert: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'
      };
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[iconName] || paths.users) + '</svg>';
    }

    function buildSparklineSvg(kpi, isHealth) {
      var arr = Array.isArray(kpi && kpi.spark) && kpi.spark.length ? kpi.spark : [4, 5, 6, 5, 7, 7, 8];
      var minV = Math.min.apply(null, arr);
      var maxV = Math.max.apply(null, arr);
      var span = Math.max(1, maxV - minV);
      var coords = arr.map(function (v, idx) {
        var x = (idx * (72 / Math.max(1, arr.length - 1)) + 4).toFixed(1);
        var y = (20 - ((v - minV) / span) * 14).toFixed(1);
        return x + ',' + y;
      });
      var pts = coords.join(' ');
      var areaPts = '4,22 ' + pts + ' 76,22';
      var stroke = isHealth ? 'var(--color-warning)' : 'var(--color-accent)';
      var fill = 'var(--color-accent-subtle)';
      return '<svg class="adm-sparkline" viewBox="0 0 80 24" aria-hidden="true">' +
        '<polygon fill="' + fill + '" points="' + areaPts + '"/>' +
        '<polyline class="adm-sparkline-line" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="' + pts + '"/>' +
        '</svg>';
    }

    var activeKpiRafIds = [];

    function cancelKpiAnimations() {
      while (activeKpiRafIds.length) {
        cancelAnimationFrame(activeKpiRafIds.pop());
      }
    }

    function animateKpiCounters() {
      cancelKpiAnimations();
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.querySelectorAll('.adm-kpi-val[data-target-val]').forEach(function (el) {
        var target = Number(el.getAttribute('data-target-val'));
        if (isNaN(target) || target <= 0) return;
        var start = performance.now();
        var dur = 380;
        function tick(now) {
          var p = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var cur = Math.round(target * eased);
          el.innerHTML = '<bdi dir="ltr">' + AW.esc(AW.formatNumber(cur)) + '</bdi>';
          if (p < 1) activeKpiRafIds.push(requestAnimationFrame(tick));
        }
        activeKpiRafIds.push(requestAnimationFrame(tick));
      });
    }

    function renderKpiOverview(fd) {
      var en = AW.isEn();
      var wrap = byId('adm-kpi-overview-wrap');
      if (!wrap) return;
      var activeKpis = state.layout.kpis.map(function (id) {
        return KPI_LIBRARY.find(function (k) { return k.id === id; });
      }).filter(Boolean);

      wrap.innerHTML =
        '<div class="sls-card">' +
        '<header class="sls-card-head">' +
        '<div>' +
        '<h2 class="sls-card-title">' + AW.esc(en ? 'Executive Operational KPIs' : 'مؤشرات الأداء التشغيلية') + '</h2>' +
        '<p class="sls-card-desc">' + AW.esc(en ? 'Operational counts and system health only (no monetary/financial totals).' : 'مؤشرات تشغيلية وحالة النظام فقط (دون أي أرصدة أو مبالغ مالية).') + '</p>' +
        '</div>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="adm-open-kpilib-btn">' + AW.esc(en ? 'KPI Library' : 'مكتبة المؤشرات') + '</button>' +
        '</header>' +
        '<div class="adm-kpi-grid">' +
        activeKpis.map(function (k) {
          var val = k.val(fd);
          var isHealth = k.group === 'health';
          var deltaText = en ? k.delta_en : k.delta_ar;
          return '<a href="' + AW.esc(drillUrl(k.drill, k.id)) + '" class="adm-kpi-tile ' + (isHealth ? 'is-health-kpi' : 'is-business-kpi') + '">' +
            '<div class="adm-kpi-top">' +
            '<span class="sls-kpi-label">' + AW.esc(en ? k.en : k.ar) + '</span>' +
            '<span class="status-pill ' + (k.dir === 'warn' ? 'status-pill-amber' : 'status-pill-navy') + '">' + AW.esc(k.delta) + '</span>' +
            '<div class="adm-kpi-label-wrap">' +
            '<span class="adm-kpi-icon-box" aria-hidden="true">' + buildKpiIconSvg(k.icon) + '</span>' +
            '<span class="sls-kpi-label">' + AW.esc(en ? k.en : k.ar) + '</span>' +
            '</div>' +
            '<span class="status-pill ' + (k.dir === 'warn' ? 'status-pill-amber' : 'status-pill-navy') + '">' + AW.esc(deltaText) + '</span>' +
            '</div>' +
            '<div class="adm-kpi-mid">' +
            '<div class="adm-kpi-val" data-target-val="' + AW.esc(val) + '"><bdi dir="ltr">' + AW.esc(AW.formatNumber(val)) + '</bdi></div>' +
            buildSparklineSvg(k.id, isHealth) +
            buildSparklineSvg(k, isHealth) +
            '</div>' +
            '<span class="sls-item-meta">' + AW.esc(en ? k.hint_en : k.hint_ar) + '</span>' +
            '<div class="adm-kpi-foot">' +
            '<span class="sls-item-meta">' + AW.esc(en ? k.hint_en : k.hint_ar) + '</span>' +
            '<span class="adm-kpi-drill-cue" aria-hidden="true">' + (en ? 'Details ↗' : 'التفاصيل ↗') + '</span>' +
            '</div>' +
            '</a>';
        }).join('') +
        '</div>' +
        '</div>';

      onEl('adm-open-kpilib-btn', 'click', openKpiLibrary);
      animateKpiCounters();
    }

    function renderWorkforce(fd) {
      var en = AW.isEn();
      var wrap = byId('adm-workforce-wrap');
      if (!wrap) return;
      var acc = D.ACCOUNTS_SHARED;
      var rankMetric = state.salesRankingMetric || 'contracts';
      var rankers = {
        contracts: function (a, b) { return b.completed_contracts - a.completed_contracts; },
        bookings: function (a, b) { return b.bookings - a.bookings; },
        speed: function (a, b) { return a.avg_response_min - b.avg_response_min; },
        hours: function (a, b) { return b.worked_min - a.worked_min; },
        conversion: function (a, b) { return b.conversion_pct - a.conversion_pct; }
      };
      var emps = fd.employees.slice().sort(rankers[rankMetric] || rankers.contracts);
      var topLeader = emps[0];
      var topSpeed = fd.employees.slice().sort(rankers.speed)[0];
      var attention = fd.employees.filter(function (e) { return e.overdue_followups >= 3 || e.operational_errors >= 2 || e.shift_completion_pct < 50; });
      var rankTabs = [
        { k: 'contracts', ar: 'الأعلى عقوداً', en: 'Top Contracts' },
        { k: 'bookings', ar: 'الأعلى حجوزات', en: 'Top Bookings' },
        { k: 'speed', ar: 'أسرع استجابة', en: 'Fastest Response' },
        { k: 'hours', ar: 'ساعات العمل', en: 'Working Hours' },
        { k: 'conversion', ar: 'أعلى تحويل', en: 'Top Conversion' }
      ];

      wrap.innerHTML =
        '<div class="sls-grid-2">' +
        '<article class="sls-card">' +
        '<header class="sls-card-head">' +
        '<div>' +
        '<h2 class="sls-card-title">' + AW.esc(en ? 'Accounts Monitoring (Shared Desk)' : 'مراقبة الحسابات (الحساب المشترك)') + '</h2>' +
        '<p class="sls-card-desc">' + AW.esc(en ? acc.attribution_note_en : acc.attribution_note_ar) + '</p>' +
        '</div>' +
        '<span class="status-pill status-pill-navy">' + AW.esc(en ? 'Online (~3 Staff)' : 'متصل (~٣ موظفين)') + '</span>' +
        '</header>' +
        '<dl class="sls-detail-grid">' +
        '<div><dt>' + AW.esc(en ? 'Shift Window' : 'نطاق الوردية') + '</dt><dd><bdi dir="ltr">' + AW.esc(acc.shift_window) + '</bdi></dd></div>' +
        '<div><dt>' + AW.esc(en ? 'Operations Executed' : 'العمليات المنفذة') + '</dt><dd><bdi dir="ltr">' + AW.esc(AW.formatNumber(acc.operations_executed)) + '</bdi></dd></div>' +
        '<div><dt>' + AW.esc(en ? 'Submitted for Review' : 'مرفوع للمراجعة') + '</dt><dd><bdi dir="ltr">' + AW.esc(AW.formatNumber(acc.submitted_for_review)) + '</bdi></dd></div>' +
        '<div><dt>' + AW.esc(en ? 'Approved / Returned' : 'معتمد / معاد') + '</dt><dd><bdi dir="ltr">' + AW.esc(AW.formatNumber(acc.approved_ops) + ' / ' + AW.formatNumber(acc.returned_ops)) + '</bdi></dd></div>' +
        '<div><dt>' + AW.esc(en ? 'Avg Processing / First Resp' : 'متوسط التنفيذ / الرد') + '</dt><dd><bdi dir="ltr">' + AW.esc(AW.formatNumber(acc.avg_processing_min) + 'm / ' + AW.formatNumber(acc.first_response_min) + 'm') + '</bdi></dd></div>' +
        '<div><dt>' + AW.esc(en ? 'Overdue / Corrections' : 'متأخر / تصحيحات') + '</dt><dd><bdi dir="ltr">' + AW.esc(AW.formatNumber(acc.overdue_requests) + ' / ' + AW.formatNumber(acc.errors_and_corrections)) + '</bdi></dd></div>' +
        '</dl>' +
        '<div class="sls-prog-actions">' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-emp-notify="ACC-SHARED-01">' + AW.esc(en ? 'Notify Shared Desk' : 'إشعار فريق الحسابات') + '</button>' +
        '<a href="' + AW.esc(drillUrl('employee', 'ACC-SHARED-01')) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Inspect Logs' : 'فحص السجلات') + '</a>' +
        '</div>' +
        '</article>' +
        '<article class="sls-card">' +
        '<header class="sls-card-head">' +
        '<div>' +
        '<h2 class="sls-card-title">' + AW.esc(en ? 'Sales & Call Center Monitoring' : 'مراقبة المبيعات ومركز الاتصال') + '</h2>' +
        '<p class="sls-card-desc">' + AW.esc(en ? 'Real-time employee status, separate rankings by metric, and early warnings.' : 'الحالة الفعلية للموظفين، تصنيفات مستقلة حسب كل مؤشر، وتنبيهات المتابعة.') + '</p>' +
        '</div>' +
        (topLeader ? '<span class="status-pill status-pill-blue">' + AW.esc((en ? '#1 Leader: ' : 'الأول: ') + (en ? topLeader.name_en : topLeader.name_ar)) + '</span>' : '') +
        '</header>' +
        '<div class="sls-period-pills" role="group" aria-label="' + AW.esc(en ? 'Sales Ranking Criteria' : 'معايير ترتيب المبيعات') + '">' +
        rankTabs.map(function (rt) {
          return '<button type="button" class="acc-btn ' + (rankMetric === rt.k ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-rank-metric="' + rt.k + '">' + AW.esc(en ? rt.en : rt.ar) + '</button>';
        }).join('') +
        '</div>' +
        '<div class="sls-list">' +
        emps.map(function (e, idx) {
          var stCls = e.status === 'online' ? 'status-pill-navy' : (e.status === 'on_break' ? 'status-pill-amber' : 'status-pill-slate');
          return '<div class="sls-sub-card">' +
            '<div class="sls-prog-card-top">' +
            '<strong><bdi dir="ltr">#' + AW.formatNumber(idx + 1) + '</bdi> ' + AW.esc(en ? e.name_en : e.name_ar) + '</strong>' +
            '<div class="sls-prog-badges">' +
            '<span class="status-pill ' + stCls + '">' + AW.esc(loc('status', e.status)) + '</span>' +
            '<span class="sls-item-meta"><bdi dir="ltr">' + AW.esc(AW.formatNumber(e.shift_completion_pct)) + '% ' + (en ? 'shift' : 'وردية') + '</bdi></span>' +
            '</div>' +
            '</div>' +
            '<div class="sls-item-meta">' +
            AW.esc(en ? 'Contracts:' : 'العقود:') + ' <strong>' + AW.esc(AW.formatNumber(e.completed_contracts)) + '</strong> • ' +
            AW.esc(en ? 'Bookings:' : 'الحجوزات:') + ' <strong>' + AW.esc(AW.formatNumber(e.bookings)) + '</strong> • ' +
            AW.esc(en ? 'Conversion:' : 'التحويل:') + ' <bdi dir="ltr">' + AW.esc(AW.formatNumber(e.conversion_pct)) + '%</bdi> • ' +
            AW.esc(en ? 'Calls:' : 'المكالمات:') + ' ' + AW.esc(AW.formatNumber(e.calls_count)) +
            '</div>' +
            '<details class="adm-emp-details">' +
            '<summary class="adm-emp-summary">' + AW.esc(en ? 'Detailed Shift & Quality Metrics' : 'تفاصيل الوردية وجودة الأداء') + '</summary>' +
            '<div class="sls-item-meta adm-emp-extra">' +
            AW.esc(en ? 'Worked:' : 'مدة العمل:') + ' <bdi dir="ltr">' + AW.formatNumber(e.worked_min) + 'm</bdi> • ' +
            AW.esc(en ? 'Idle:' : 'الخمول:') + ' <bdi dir="ltr">' + AW.formatNumber(e.idle_min) + 'm</bdi> • ' +
            AW.esc(en ? 'Call Duration:' : 'مدة المكالمات:') + ' <bdi dir="ltr">' + AW.formatNumber(e.call_duration_min) + 'm</bdi> • ' +
            AW.esc(en ? 'Punctuality:' : 'الالتزام:') + ' <bdi dir="ltr">' + AW.formatNumber(e.followup_punctuality_pct) + '%</bdi> • ' +
            AW.esc(en ? 'Target:' : 'الهدف:') + ' <bdi dir="ltr">' + AW.formatNumber(e.target_achievement_pct) + '%</bdi> • ' +
            AW.esc(en ? 'Errors:' : 'أخطاء:') + ' ' + AW.formatNumber(e.operational_errors) +
            '</div>' +
            '</details>' +
            '<div class="sls-item-meta">' + AW.esc(en ? e.latest_interaction_en : e.latest_interaction_ar) + '</div>' +
            '<div class="sls-prog-actions">' +
            '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-emp-notify="' + AW.esc(e.id) + '">' + AW.esc(en ? 'Notify' : 'إرسال إشعار') + '</button>' +
            '<a href="' + AW.esc(drillUrl('employee', e.id)) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Open Record' : 'فتح السجل') + '</a>' +
            '</div>' +
            '</div>';
        }).join('') +
        '</div>' +
        (attention.length ? '<div class="sls-notice-banner">' +
          '<strong>' + AW.esc(en ? 'Attention Needed:' : 'يحتاج متابعة:') + '</strong> ' +
          attention.map(function (a) { return AW.esc((en ? a.name_en : a.name_ar) + ' (' + AW.formatNumber(a.overdue_followups) + (en ? ' overdue)' : ' متأخرة)')); }).join(' • ') +
          (topSpeed ? (' • ' + AW.esc((en ? 'Fastest Response: ' : 'أسرع استجابة: ') + (en ? topSpeed.name_en : topSpeed.name_ar))) : '') +
          '</div>' : '') +
        '</article>' +
        '</div>';
    }

    function renderBusinessOverview(fd) {
      var en = AW.isEn();
      var wrap = byId('adm-business-wrap');
      if (!wrap) return;
      var custs = fd.customers;
      var stages = [
        { k: 'new', ar: 'جديد', en: 'New' },
        { k: 'not_contacted', ar: 'لم يُتواصل معه', en: 'Not Contacted' },
        { k: 'contacted', ar: 'تم التواصل', en: 'Contacted' },
        { k: 'follow_up', ar: 'متابعة', en: 'Follow-up' },
        { k: 'booked', ar: 'محجوز', en: 'Booked' },
        { k: 'contract_completed', ar: 'عقد مكتمل', en: 'Contract Completed' },
        { k: 'cancelled', ar: 'ملغي', en: 'Cancelled' }
      ];
      var stageLabel = function (k) {
        var found = stages.find(function (s) { return s.k === k; });
        return found ? (en ? found.en : found.ar) : k;
      };
      var incompletePayCount = custs.filter(function (c) { return c.payment_incomplete; }).length;
      var reqs = fd.requests;
      var avgWait = reqs.length ? Math.round(reqs.reduce(function (a, r) { return a + r.wait_hours; }, 0) / reqs.length) : 0;
      var unitMin = en ? 'm' : ' د';
      var unitHr = en ? 'h' : ' س';

      var activeStage = state.selectedLifecycleStage || 'all';
      var stageCusts = activeStage === 'all' ? custs : custs.filter(function (c) { return c.stage === activeStage; });
      var bookedOrDone = custs.filter(function (c) { return c.stage === 'booked' || c.stage === 'contract_completed'; }).length;
      var doneCount = custs.filter(function (c) { return c.stage === 'contract_completed'; }).length;
      var convRate = custs.length ? Math.round((doneCount / custs.length) * 100) : 0;
      var bookRate = custs.length ? Math.round((bookedOrDone / custs.length) * 100) : 0;

      wrap.innerHTML =
        '<div class="sls-card adm-lifecycle-card">' +
          '<header class="sls-card-head">' +
            '<div>' +
              '<h2 class="sls-card-title">' + AW.esc(en ? 'A. Customer Intelligence & Lifecycle Pipeline' : 'أ. ذكاء العملاء ومسار دورة حياة العميل') + '</h2>' +
              '<p class="sls-card-desc">' + AW.esc(en ? 'Interactive stage pipeline, conversion velocity, and operational Payment Incomplete tracking (no monetary totals).' : 'مسار تفاعلي لمراحل العميل ومعدلات التحويل وحالة «غير مكتمل السداد» التشغيلية دون مبالغ مالية.') + '</p>' +
            '</div>' +
            '<div class="sls-prog-badges">' +
              '<span class="status-pill status-pill-navy">' + AW.esc((en ? 'Booking Rate: ' : 'معدل الحجز: ') + AW.formatNumber(bookRate) + '%') + '</span>' +
              '<span class="status-pill status-pill-blue">' + AW.esc((en ? 'Contract Close: ' : 'إتمام العقود: ') + AW.formatNumber(convRate) + '%') + '</span>' +
              '<span class="status-pill status-pill-amber">' + AW.esc((en ? 'Payment Incomplete (Ops): ' : 'غير مكتمل السداد (تشغيلي): ') + AW.formatNumber(incompletePayCount)) + '</span>' +
            '</div>' +
          '</header>' +
          '<div class="adm-lifecycle-pipeline" role="tablist" aria-label="' + AW.esc(en ? 'Customer Lifecycle Stages' : 'مراحل دورة حياة العميل') + '">' +
            stages.map(function (st, idx) {
              var cnt = custs.filter(function (c) { return c.stage === st.k; }).length;
              var pct = custs.length ? Math.round((cnt / custs.length) * 100) : 0;
              var isSelected = activeStage === st.k;
              var isDrop = st.k === 'cancelled' || st.k === 'not_contacted';
              return '<button type="button" role="tab" aria-selected="' + (isSelected ? 'true' : 'false') + '" class="adm-stage-step ' + (isSelected ? 'is-selected ' : '') + (isDrop ? 'is-drop-stage' : '') + '" data-lc-stage="' + st.k + '">' +
                '<div class="adm-stage-step-head">' +
                  '<span class="adm-stage-num"><bdi dir="ltr">' + AW.formatNumber(idx + 1) + '</bdi></span>' +
                  '<span class="sls-kpi-label">' + AW.esc(en ? st.en : st.ar) + '</span>' +
                '</div>' +
                '<div class="adm-stage-step-val">' +
                  '<strong class="adm-stage-count"><bdi dir="ltr">' + AW.esc(AW.formatNumber(cnt)) + '</bdi></strong>' +
                  '<span class="adm-stage-pct"><bdi dir="ltr">' + AW.esc(AW.formatNumber(pct)) + '%</bdi></span>' +
                '</div>' +
                '<div class="adm-stage-bar"><span class="adm-stage-bar-fill" style="width:' + Math.max(6, pct) + '%"></span></div>' +
              '</button>';
            }).join('') +
          '</div>' +
          '<div class="adm-lifecycle-inspector">' +
            '<div class="adm-lifecycle-insp-head">' +
              '<div class="sls-prog-badges">' +
                '<strong>' + AW.esc(activeStage === 'all' ? (en ? 'All Lifecycle Customers' : 'جميع العملاء في المسار') : ((en ? 'Stage Focus: ' : 'المرحلة المحددة: ') + stageLabel(activeStage))) + '</strong>' +
                '<span class="status-pill status-pill-navy"><bdi dir="ltr">' + AW.formatNumber(stageCusts.length) + '</bdi> ' + AW.esc(en ? 'records' : 'سجل') + '</span>' +
              '</div>' +
              '<div class="sls-prog-badges">' +
                (activeStage !== 'all' ? '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-lc-stage="all">' + AW.esc(en ? 'Show All Stages' : 'عرض كل المراحل') + '</button>' : '') +
                '<a href="' + AW.esc(drillUrl('customer', activeStage === 'all' ? 'CUS-D-101' : activeStage)) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Open Stage Details' : 'فتح تفاصيل المرحلة') + '</a>' +
              '</div>' +
            '</div>' +
            (stageCusts.length ? '<div class="adm-lifecycle-chips">' +
              stageCusts.slice(0, 4).map(function (c) {
                var govObj = (D.GOVERNORATE_LABELS && D.GOVERNORATE_LABELS[c.gov]) || null;
                var govName = govObj ? (en ? govObj.en : govObj.ar) : c.gov;
                return '<a href="' + AW.esc(drillUrl('customer', c.id)) + '" class="adm-lc-cust-pill">' +
                  '<strong>' + AW.esc(en ? c.name_en : c.name_ar) + '</strong>' +
                  '<span class="sls-item-meta">' + AW.esc((en ? c.program_en : c.program_ar) + ' • ' + govName) + '</span>' +
                '</a>';
              }).join('') +
            '</div>' : '<p class="sls-item-meta">' + AW.esc(en ? 'No customers in this stage under current filters.' : 'لا يوجد عملاء في هذه المرحلة وفق الفلاتر الحالية.') + '</p>') +
          '</div>' +
        '</div>' +
        '<div class="sls-grid-2">' +
          '<article class="sls-card">' +
            '<header class="sls-card-head"><h2 class="sls-card-title">' + AW.esc(en ? 'B. Companies Intelligence' : 'ب. ذكاء الشركات الشريكة') + '</h2></header>' +
            '<div class="sls-list">' +
              D.COMPANIES.map(function (c) {
                var stCls = c.status === 'active' ? 'status-pill-navy' : (c.status === 'pending_application' ? 'status-pill-amber' : 'status-pill-slate');
                return '<div class="sls-list-item">' +
                  '<div class="sls-item-main">' +
                    '<strong class="sls-item-title">' + AW.esc(en ? c.name_en : c.name_ar) + '</strong>' +
                    '<span class="sls-item-meta">' + AW.esc((en ? 'Bookings:' : 'الحجوزات:') + ' ' + AW.formatNumber(c.bookings) + ' • ' + (en ? 'Contracts:' : 'العقود:') + ' ' + AW.formatNumber(c.completed_contracts) + ' • ' + (en ? 'Response:' : 'الاستجابة:') + ' ' + (c.response_sla_min != null ? (AW.formatNumber(c.response_sla_min) + unitMin) : '—')) + '</span>' +
                  '</div>' +
                  '<div class="sls-prog-badges">' +
                    '<span class="status-pill ' + stCls + '">' + AW.esc(loc('status', c.status)) + '</span>' +
                    (c.stale_data ? '<span class="status-pill status-pill-amber">' + AW.esc(en ? 'Stale' : 'قديم') + '</span>' : '') +
                    '<a href="' + AW.esc(drillUrl('company', c.id)) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Review' : 'مراجعة') + '</a>' +
                  '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</article>' +
          '<article class="sls-card">' +
            '<header class="sls-card-head">' +
              '<h2 class="sls-card-title">' + AW.esc(en ? 'C. Employee-to-Company Requests' : 'ج. طلبات الموظفين للشركات') + '</h2>' +
              '<span class="status-pill status-pill-blue">' + AW.esc((en ? 'Avg Wait: ' : 'متوسط الانتظار: ') + AW.formatNumber(avgWait) + unitHr) + '</span>' +
            '</header>' +
            '<div class="sls-list">' +
              reqs.slice(0, 5).map(function (r) {
                var stCls = r.status === 'overdue' || r.status === 'unanswered' ? 'status-pill-amber' : (r.status === 'converted' ? 'status-pill-navy' : 'status-pill-blue');
                return '<div class="sls-list-item">' +
                  '<div class="sls-item-main">' +
                    '<strong class="sls-item-title">' + AW.esc(en ? r.subject_en : r.subject_ar) + '</strong>' +
                    '<span class="sls-item-meta"><bdi dir="ltr">' + AW.esc(r.id) + '</bdi> • ' + AW.esc((en ? 'Wait: ' : 'الانتظار: ') + AW.formatNumber(r.wait_hours) + unitHr) + '</span>' +
                  '</div>' +
                  '<div class="sls-prog-badges">' +
                    '<span class="status-pill ' + stCls + '">' + AW.esc(loc('status', r.status)) + '</span>' +
                    '<a href="' + AW.esc(drillUrl('request', r.id)) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Open' : 'فتح') + '</a>' +
                  '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</article>' +
        '</div>';
        }

  function buildWorldMapPanel(fd) {
            var en = AW.isEn();
            var regions = Array.isArray(D.GEO_REGIONS) ? D.GEO_REGIONS : [];
            var selectedId = state.selectedGeoRegion || 'africa';
            var activeReg = regions.find(function (r) { return r.id === selectedId; }) || regions[0];
            var govCounts = {};
            fd.customers.forEach(function (c) { govCounts[c.gov] = (govCounts[c.gov] || 0) + 1; });

            // Recognizable stylized 6-continent world SVG paths (viewBox 0 0 900 420)
            var continentShapes = {
              north_america: 'M78,76 L150,52 L245,56 L290,94 L270,145 L220,175 L195,212 L162,218 L140,185 L108,155 L75,112 Z',
              south_america: 'M235,222 L292,226 L332,265 L322,320 L282,382 L252,374 L244,310 L226,262 Z',
              europe: 'M412,72 L478,56 L532,74 L528,118 L496,136 L448,134 L416,115 Z',
              africa: 'M418,150 L492,148 L545,184 L548,238 L508,325 L466,342 L438,272 L405,212 Z',
              asia: 'M538,68 L665,54 L782,82 L808,136 L755,195 L690,224 L622,218 L572,186 L544,132 Z',
              oceania: 'M702,278 L792,272 L826,318 L798,364 L728,358 L698,318 Z'
            };

            var mapSvg =
              '<div class="adm-world-map-wrap" dir="ltr">' +
              '<div id="adm-geo-tooltip" class="adm-chart-tooltip" role="status" hidden></div>' +
              '<svg viewBox="0 0 900 420" class="adm-world-map-svg" role="img" aria-label="' + AW.esc(en ? 'Global Customer Distribution Map by Continent' : 'خريطة التوزيع الجغرافي للعملاء حسب القارات') + '">' +
              '<rect x="0" y="0" width="900" height="420" rx="12" fill="var(--color-surface-secondary)" opacity="0.55"/>' +
              '<g class="adm-map-grid" stroke="var(--color-border-subtle)" stroke-width="1" stroke-dasharray="4 4">' +
              '<line x1="0" y1="140" x2="900" y2="140"/><line x1="0" y1="210" x2="900" y2="210"/><line x1="0" y1="280" x2="900" y2="280"/>' +
              '<line x1="300" y1="0" x2="300" y2="420"/><line x1="450" y1="0" x2="450" y2="420"/><line x1="600" y1="0" x2="600" y2="420"/>' +
              '</g>' +
              regions.map(function (reg) {
                var isSel = activeReg && activeReg.id === reg.id;
                var d = continentShapes[reg.id] || '';
                var rSize = Math.max(7, Math.min(20, 6 + Math.round(reg.share_pct / 4.2)));
                var tip = (en ? reg.name_en : reg.name_ar) + ': ' + AW.formatNumber(reg.customers) + (en ? ' customers (' : ' عميل (') + AW.formatNumber(reg.share_pct) + '%)';
                return '<g class="adm-continent-group ' + (isSel ? 'is-selected' : '') + '" data-geo-region="' + AW.esc(reg.id) + '" data-tip="' + AW.esc(tip) + '" tabindex="0" role="button" aria-label="' + AW.esc(tip) + '">' +
                  '<path d="' + d + '" class="adm-continent-path"/>' +
                  '<circle cx="' + reg.cx + '" cy="' + reg.cy + '" r="' + (rSize + 6) + '" class="adm-geo-pulse"/>' +
                  '<circle cx="' + reg.cx + '" cy="' + reg.cy + '" r="' + rSize + '" class="adm-geo-marker"/>' +
                  '<text x="' + reg.cx + '" y="' + (reg.cy + rSize + 15) + '" text-anchor="middle" class="adm-geo-label">' + AW.esc(en ? reg.short_en : reg.short_ar) + '</text>' +
                  '</g>';
              }).join('') +
              '</svg>' +
              '</div>';

            var regionSummary = activeReg ? (
              '<div class="adm-geo-summary">' +
              '<div class="adm-geo-summary-head">' +
              '<div>' +
              '<span class="status-pill status-pill-amber">' + AW.esc(en ? 'Sample Regional Dataset (Mock)' : 'بيانات إقليمية نموذجية (محاكاة)') + '</span>' +
              '<h3 class="sls-item-title">' + AW.esc(en ? activeReg.name_en : activeReg.name_ar) + '</h3>' +
              '</div>' +
              '<a href="' + AW.esc(drillUrl('geo', activeReg.id)) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Explore Region' : 'استكشاف الإقليم') + '</a>' +
              '</div>' +
              '<dl class="sls-detail-grid">' +
              '<div><dt>' + AW.esc(en ? 'Customers' : 'العملاء') + '</dt><dd><bdi dir="ltr">' + AW.formatNumber(activeReg.customers) + '</bdi></dd></div>' +
              '<div><dt>' + AW.esc(en ? 'Global Share' : 'الحصة') + '</dt><dd><bdi dir="ltr">' + AW.formatNumber(activeReg.share_pct) + '%</bdi></dd></div>' +
              '<div><dt>' + AW.esc(en ? 'Monthly Growth' : 'النمو الشهري') + '</dt><dd><bdi dir="ltr">+' + AW.formatNumber(activeReg.growth_pct) + '%</bdi></dd></div>' +
              '<div><dt>' + AW.esc(en ? 'Top Hubs' : 'أبرز المراكز') + '</dt><dd>' + AW.esc(en ? activeReg.top_hub_en : activeReg.top_hub_ar) + '</dd></div>' +
              '</dl>' +
              '<div class="adm-geo-gov-strip">' +
              '<span class="sls-item-meta"><strong>' + AW.esc(en ? 'Egypt Governorates (Active Prototype Records):' : 'محافظات مصر (السجلات النشطة):') + '</strong></span>' +
              '<div class="sls-prog-badges">' +
              Object.keys(govCounts).map(function (g) {
                var govObj = (D.GOVERNORATE_LABELS && D.GOVERNORATE_LABELS[g]) || null;
                var gLabel = govObj ? (en ? govObj.en : govObj.ar) : g;
                return '<a href="' + AW.esc(drillUrl('geo', g)) + '" class="adm-geo-chip">' + AW.esc(gLabel) + ' <bdi dir="ltr">(' + AW.formatNumber(govCounts[g]) + ')</bdi></a>';
              }).join('') +
              '</div>' +
              '</div>' +
              '</div>'
            ) : '';

            return '<div class="sls-sub-card adm-geo-card">' +
              '<div class="sls-prog-card-top">' +
              '<div>' +
              '<strong class="sls-item-title">' + AW.esc(en ? 'Geographic Customer Distribution (Continents & Hubs)' : 'التوزيع الجغرافي للعملاء (القارات والمحافظات)') + '</strong>' +
              '<p class="sls-item-meta">' + AW.esc(en ? 'Click or hover any continent to inspect regional demand.' : 'اضغط أو مرر المؤشر على أي قارة لاستعراض الطلب الإقليمي.') + '</p>' +
              '</div>' +
              '<a href="' + AW.esc(drillUrl('geo', 'all')) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Full Geo Report' : 'التقرير الجغرافي') + '</a>' +
              '</div>' +
              mapSvg +
              regionSummary +
              '</div>';
          }

  function renderAnalyticsStudio(fd) {
            var en = AW.isEn();
            var wrap = byId('adm-analytics-wrap');
            if (!wrap) return;
            var series = D.ANALYTICS_SERIES[state.analyticsRange] || D.ANALYTICS_SERIES.weekly;
            var labels = en ? series.labels_en : series.labels_ar;
            var allVals = (series.customers || []).concat(series.forecast_customers || []).filter(function (v) { return v != null; });
            var maxVal = Math.max(1, allVals.length ? Math.max.apply(null, allVals) : 50);
            var w = 640, h = 230, padX = 48, padY = 26;
            var stepX = (w - padX * 2) / Math.max(1, labels.length - 1);
            var toY = function (v) { return h - padY - ((v / maxVal) * (h - padY * 2)); };

            var buildPath = function (arr) {
              var pts = [];
              (arr || []).forEach(function (v, i) {
                if (v == null) return;
                pts.push((pts.length ? 'L' : 'M') + (padX + i * stepX).toFixed(1) + ',' + toY(v).toFixed(1));
              });
              return pts.join(' ');
            };

            var buildAreaPath = function (arr) {
              var coords = [];
              (arr || []).forEach(function (v, i) {
                if (v == null) return;
                coords.push({ x: (padX + i * stepX).toFixed(1), y: toY(v).toFixed(1) });
              });
              if (coords.length < 2) return '';
              var baseY = (h - padY).toFixed(1);
              var d = 'M' + coords[0].x + ',' + baseY + ' L' + coords.map(function (c) { return c.x + ',' + c.y; }).join(' L') + ' L' + coords[coords.length - 1].x + ',' + baseY + ' Z';
              return d;
            };

            var buildPoints = function (arr, labelAr, labelEn, colorVar, isForecast) {
              return (arr || []).map(function (v, i) {
                if (v == null) return '';
                var cx = (padX + i * stepX).toFixed(1);
                var cy = toY(v).toFixed(1);
                var tip = (en ? labelEn : labelAr) + ' — ' + labels[i] + ': ' + AW.formatNumber(v) + (isForecast ? (en ? ' (Forecast)' : ' (توقع)') : (en ? ' (Actual)' : ' (فعلي)'));
                return '<circle class="adm-chart-pt" cx="' + cx + '" cy="' + cy + '" r="4.5" fill="' + colorVar + '" tabindex="0" data-tip="' + AW.esc(tip) + '" aria-label="' + AW.esc(tip) + '"/>';
              }).join('');
            };

            var govCounts = {};
            fd.customers.forEach(function (c) { govCounts[c.gov] = (govCounts[c.gov] || 0) + 1; });

            var anaTabs = [
              { k: 'trends', ar: 'النمو والتوقعات', en: 'Growth & Forecast' },
              { k: 'workforce_perf', ar: 'أداء المبيعات والحسابات', en: 'Sales & Accounts' },
              { k: 'companies_target', ar: 'الشركات والهدف', en: 'Companies & Target' },
              { k: 'companies_target', ar: 'الشركات والحجوزات', en: 'Companies & Bookings' },
              { k: 'journey_funnel', ar: 'قمع رحلة العميل', en: 'Journey Funnel' }
            ];

            var mainPanelHtml = '';
            if (state.analyticsTab === 'workforce_perf') {
              var accRate = Math.round((D.ACCOUNTS_SHARED.approved_ops / Math.max(1, D.ACCOUNTS_SHARED.operations_executed)) * 100);
              mainPanelHtml = '<div class="adm-bar-list">' +
                fd.employees.map(function (e) {
                  return '<div class="adm-bar-row">' +
                    '<div class="adm-bar-meta"><strong>' + AW.esc(en ? e.name_en : e.name_ar) + '</strong><span><bdi dir="ltr">' + AW.formatNumber(e.target_achievement_pct) + '% ' + (en ? 'Target' : 'هدف') + '</bdi></span></div>' +
                    '<div class="adm-bar-track"><div class="adm-bar-fill" style="width:' + Math.min(100, e.target_achievement_pct) + '%"></div></div>' +
                    '</div>';
                }).join('') +
                '<div class="adm-bar-row">' +
                '<div class="adm-bar-meta"><strong>' + AW.esc(en ? D.ACCOUNTS_SHARED.name_en : D.ACCOUNTS_SHARED.name_ar) + '</strong><span><bdi dir="ltr">' + AW.formatNumber(accRate) + '% ' + (en ? 'Approval Rate' : 'نسبة الاعتماد') + '</bdi></span></div>' +
                '<div class="adm-bar-track"><div class="adm-bar-fill is-accent" style="width:' + Math.min(100, accRate) + '%"></div></div>' +
                '</div>' +
                '</div>';
              var acc = D.ACCOUNTS_SHARED;
              var accRate = Math.round((acc.approved_ops / Math.max(1, acc.operations_executed)) * 100);
              var retRate = Math.round((acc.returned_ops / Math.max(1, acc.operations_executed)) * 100);
              var circ = 2 * Math.PI * 44;
              var accDash = ((accRate / 100) * circ).toFixed(1);
              mainPanelHtml =
                '<div class="adm-wf-ana-grid">' +
                '<div class="adm-donut-card">' +
                '<svg viewBox="0 0 120 120" class="adm-donut-svg" role="img" aria-label="' + AW.esc(en ? 'Accounts Approval Rate' : 'نسبة اعتماد الحسابات') + '">' +
                '<circle cx="60" cy="60" r="44" fill="none" stroke="var(--color-surface-secondary)" stroke-width="12"/>' +
                '<circle cx="60" cy="60" r="44" fill="none" stroke="var(--color-accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + accDash + ' ' + circ.toFixed(1) + '" transform="rotate(-90 60 60)"/>' +
                '<text x="60" y="57" text-anchor="middle" class="adm-donut-val">' + AW.formatNumber(accRate) + '%</text>' +
                '<text x="60" y="74" text-anchor="middle" class="adm-donut-sub">' + AW.esc(en ? 'Approved' : 'معتمد') + '</text>' +
                '</svg>' +
                '<div class="sls-item-meta">' + AW.esc(en ? acc.name_en : acc.name_ar) + ' • <bdi dir="ltr">' + AW.formatNumber(acc.approved_ops) + '/' + AW.formatNumber(acc.operations_executed) + '</bdi> (' + AW.esc((en ? 'Returned: ' : 'معاد: ') + AW.formatNumber(retRate) + '%') + ')</div>' +
                '</div>' +
                '<div class="adm-bar-list">' +
                fd.employees.map(function (e) {
                  return '<div class="adm-bar-row">' +
                    '<div class="adm-bar-meta"><strong>' + AW.esc(en ? e.name_en : e.name_ar) + '</strong><span><bdi dir="ltr">' + AW.formatNumber(e.target_achievement_pct) + '% ' + (en ? 'Target' : 'هدف') + ' • ' + AW.formatNumber(e.conversion_pct) + '% ' + (en ? 'Conv.' : 'تحويل') + '</bdi></span></div>' +
                    '<div class="adm-bar-track"><div class="adm-bar-fill" style="width:' + Math.min(100, e.target_achievement_pct) + '%"></div></div>' +
                    '</div>';
                }).join('') +
                '</div>' +
                '</div>';
            } else if (state.analyticsTab === 'companies_target') {
              mainPanelHtml = '<div class="adm-bar-list">' +
                D.COMPANIES.filter(function (c) { return c.bookings > 0; }).map(function (c) {
                  return '<div class="adm-bar-row">' +
                    '<div class="adm-bar-meta"><strong>' + AW.esc(en ? c.name_en : c.name_ar) + '</strong><span><bdi dir="ltr">' + AW.formatNumber(c.conversion_pct) + '% (' + AW.formatNumber(c.completed_contracts) + '/' + AW.formatNumber(c.bookings) + ')</bdi></span></div>' +
                    '<div class="adm-bar-track"><div class="adm-bar-fill" style="width:' + Math.min(100, c.conversion_pct) + '%"></div></div>' +
                    '</div>';
                }).join('') +
                '</div>';
              var activeComps = D.COMPANIES.filter(function (c) { return c.bookings > 0; });
              var totalBook = activeComps.reduce(function (a, c) { return a + c.bookings; }, 0) || 1;
              mainPanelHtml =
                '<div class="adm-bar-list">' +
                activeComps.map(function (c) {
                  var share = Math.round((c.bookings / totalBook) * 100);
                  return '<div class="adm-bar-row">' +
                    '<div class="adm-bar-meta">' +
                    '<strong>' + AW.esc(en ? c.name_en : c.name_ar) + '</strong>' +
                    '<span><bdi dir="ltr">' + AW.formatNumber(c.completed_contracts) + '/' + AW.formatNumber(c.bookings) + ' (' + AW.formatNumber(c.conversion_pct) + '% ' + (en ? 'close' : 'إتمام') + ' • ' + AW.formatNumber(share) + '% ' + (en ? 'share' : 'حصة') + ')</bdi></span>' +
                    '</div>' +
                    '<div class="adm-bar-track"><div class="adm-bar-fill is-accent" style="width:' + Math.min(100, c.conversion_pct) + '%"></div></div>' +
                    '</div>';
                }).join('') +
                '</div>';
            } else if (state.analyticsTab === 'journey_funnel') {
              var totalC = Math.max(1, fd.customers.length);
              var fSteps = [
                { ar: 'إجمالي المسجلين', en: 'Registered', cnt: fd.customers.length },
                { ar: 'تم التواصل', en: 'Contacted+', cnt: fd.customers.filter(function (c) { return ['contacted', 'follow_up', 'booked', 'contract_completed'].indexOf(c.stage) >= 0; }).length },
                { ar: 'حجز مؤكد', en: 'Booked+', cnt: fd.customers.filter(function (c) { return c.stage === 'booked' || c.stage === 'contract_completed'; }).length },
                { ar: 'عقد مكتمل', en: 'Contract Completed', cnt: fd.customers.filter(function (c) { return c.stage === 'contract_completed'; }).length }
              ];
              mainPanelHtml = '<div class="adm-funnel-visual">' +
                fSteps.map(function (fs, idx) {
                  var pct = Math.round((fs.cnt / totalC) * 100);
                  var prevCnt = idx > 0 ? Math.max(1, fSteps[idx - 1].cnt) : totalC;
                  var stepConv = idx > 0 ? Math.round((fs.cnt / prevCnt) * 100) : 100;
                  var barW = Math.max(26, pct);
                  return '<div class="adm-funnel-tier">' +
                    '<div class="adm-funnel-meta">' +
                      '<strong>' + AW.esc(en ? fs.en : fs.ar) + '</strong>' +
                      '<span class="sls-item-meta"><bdi dir="ltr">' + AW.formatNumber(fs.cnt) + ' (' + AW.formatNumber(pct) + '%)</bdi>' + (idx > 0 ? (' • ' + (en ? 'Step Conv: ' : 'تحويل المرحلة: ') + AW.formatNumber(stepConv) + '%') : '') + '</span>' +
                    '</div>' +
                    '<div class="adm-funnel-bar-wrap"><div class="adm-funnel-bar" style="width:' + barW + '%"><span><bdi dir="ltr">' + AW.formatNumber(pct) + '%</bdi></span></div></div>' +
                  '</div>';
                }).join('') +
              '</div>';
                } else {
                  var yTicks = [0, 0.25, 0.5, 0.75, 1];
                  mainPanelHtml =
                  '<div class="sls-prog-badges">' +
                  ['customers', 'bookings', 'contracts', 'forecast'].map(function (sKey) {
                    var lbl = sKey === 'customers' ? (en ? 'Customers (Actual)' : 'العملاء (فعلي)') :
                      (sKey === 'bookings' ? (en ? 'Bookings (Actual)' : 'الحجوزات (فعلي)') :
                        (sKey === 'contracts' ? (en ? 'Contracts (Actual)' : 'العقود (فعلي)') : (en ? 'Forecast (Simulated)' : 'التوقع التقديري')));
                    return '<label class="sls-ms-item"><input type="checkbox" data-series-toggle="' + sKey + '" ' + (state.seriesVisible[sKey] ? 'checked' : '') + '> <span>' + AW.esc(lbl) + '</span></label>';
                  }).join('') +
                  '</div>' +
                  '<div class="sls-chart-box adm-chart-wrap">' +
                  '<div class="sls-chart-box adm-chart-wrap" dir="ltr">' +
                  '<div id="adm-chart-tooltip" class="adm-chart-tooltip" role="status" hidden></div>' +
                  '<svg viewBox="0 0 ' + w + ' ' + h + '" class="sls-svg-chart" role="img" aria-label="Operational Trend Chart">' +
                  '<line x1="' + padX + '" y1="' + (h - padY) + '" x2="' + (w - padX) + '" y2="' + (h - padY) + '" stroke="var(--color-border)" stroke-width="1"/>' +
                  (state.seriesVisible.customers ? '<path d="' + buildPath(series.customers) + '" fill="none" stroke="var(--color-primary)" stroke-width="3"/>' + buildPoints(series.customers, 'العملاء', 'Customers', 'var(--color-primary)', false) : '') +
                  (state.seriesVisible.bookings ? '<path d="' + buildPath(series.bookings) + '" fill="none" stroke="var(--color-secondary-blue)" stroke-width="2.5"/>' + buildPoints(series.bookings, 'الحجوزات', 'Bookings', 'var(--color-secondary-blue)', false) : '') +
                  (state.seriesVisible.contracts ? '<path d="' + buildPath(series.contracts) + '" fill="none" stroke="var(--color-accent)" stroke-width="2.5"/>' + buildPoints(series.contracts, 'العقود', 'Contracts', 'var(--color-accent)', false) : '') +
                  (state.seriesVisible.forecast ? '<path d="' + buildPath(series.forecast_customers) + '" fill="none" stroke="var(--color-warning)" stroke-width="2.5" stroke-dasharray="6 4"/>' + buildPoints(series.forecast_customers, 'التوقع', 'Forecast', 'var(--color-warning)', true) : '') +
                  '<svg viewBox="0 0 ' + w + ' ' + h + '" class="sls-svg-chart" role="img" aria-label="' + AW.esc(en ? 'Operational Trend Chart' : 'مخطط الاتجاهات التشغيلية') + '">' +
                  yTicks.map(function (tRatio) {
                    var tv = Math.round(maxVal * tRatio);
                    var ty = toY(tv).toFixed(1);
                    return '<line x1="' + padX + '" y1="' + ty + '" x2="' + (w - padX) + '" y2="' + ty + '" stroke="var(--color-border-subtle)" stroke-width="1" stroke-dasharray="3 3"/>' +
                      '<text x="' + (padX - 8) + '" y="' + (Number(ty) + 4) + '" text-anchor="end" font-size="10" fill="var(--color-text-muted)">' + AW.formatNumber(tv) + '</text>';
                  }).join('') +
                  '<line x1="' + padX + '" y1="' + (h - padY) + '" x2="' + (w - padX) + '" y2="' + (h - padY) + '" stroke="var(--color-border)" stroke-width="1.2"/>' +
                  (state.seriesVisible.customers ? '<path d="' + buildAreaPath(series.customers) + '" fill="var(--color-accent-subtle)" opacity="0.7"/><path class="adm-chart-line" d="' + buildPath(series.customers) + '" fill="none" stroke="var(--color-primary)" stroke-width="3"/>' + buildPoints(series.customers, 'العملاء', 'Customers', 'var(--color-primary)', false) : '') +
                  (state.seriesVisible.bookings ? '<path class="adm-chart-line" d="' + buildPath(series.bookings) + '" fill="none" stroke="var(--color-secondary-blue)" stroke-width="2.5"/>' + buildPoints(series.bookings, 'الحجوزات', 'Bookings', 'var(--color-secondary-blue)', false) : '') +
                  (state.seriesVisible.contracts ? '<path class="adm-chart-line" d="' + buildPath(series.contracts) + '" fill="none" stroke="var(--color-accent)" stroke-width="2.5"/>' + buildPoints(series.contracts, 'العقود', 'Contracts', 'var(--color-accent)', false) : '') +
                  (state.seriesVisible.forecast ? '<path class="adm-chart-line" d="' + buildPath(series.forecast_customers) + '" fill="none" stroke="var(--color-warning)" stroke-width="2.5" stroke-dasharray="6 4"/>' + buildPoints(series.forecast_customers, 'التوقع', 'Forecast', 'var(--color-warning)', true) : '') +
                  labels.map(function (lb, i) {
                    var x = (padX + i * stepX).toFixed(1);
                    return '<text x="' + x + '" y="' + (h - 6) + '" text-anchor="middle" font-size="11" fill="var(--color-text-muted)">' + AW.esc(lb) + '</text>';
                  }).join('') +
                  '</svg>' +
                  '</div>';
                }

    wrap.innerHTML =
                  '<div class="sls-card">' +
                  '<header class="sls-card-head">' +
                  '<div>' +
                  '<h2 class="sls-card-title">' + AW.esc(en ? 'Analytics Studio — Trends, Performance & Geo Distribution' : 'استوديو التحليلات — الاتجاهات والأداء والتوزيع الجغرافي') + '</h2>' +
                  '<p class="sls-card-desc">' + AW.esc(en ? 'Interactive series, tooltips, and clear separation between actual data and simulated forecast.' : 'سلاسل تفاعلية وتلميحات وفصل بصري واضح بين البيانات الفعلية والتوقعات التقديرية.') + '</p>' +
                  '<p class="sls-card-desc">' + AW.esc(en ? 'Interactive charts, funnel conversion, and continent-level distribution.' : 'رسوم بيانية تفاعلية، قمع التحويل، وخريطة القارات التفاعلية.') + '</p>' +
                  '</div>' +
                  '<div class="sls-period-pills">' +
                  ['daily', 'weekly', 'monthly'].map(function (r) {
                    var lbl = r === 'daily' ? (en ? 'Daily' : 'يومي') : (r === 'weekly' ? (en ? 'Weekly' : 'أسبوعي') : (en ? 'Monthly' : 'شهري'));
                    return '<button type="button" class="acc-btn ' + (state.analyticsRange === r ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-ana-range="' + r + '">' + AW.esc(lbl) + '</button>';
                  }).join('') +
                  '</div>' +
                  '</header>' +
                  '<div class="sls-period-pills" role="tablist">' +
                  anaTabs.map(function (at) {
                    return '<button type="button" role="tab" aria-selected="' + (state.analyticsTab === at.k ? 'true' : 'false') + '" class="acc-btn ' + (state.analyticsTab === at.k ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-ana-tab="' + at.k + '">' + AW.esc(en ? at.en : at.ar) + '</button>';
                  }).join('') +
                  '</div>' +
                  '<div class="sls-grid-asymmetric">' +
                  '<div class="adm-analytics-main">' + mainPanelHtml + '</div>' +
                  '<div class="sls-sub-card">' +
                  '<div class="sls-prog-card-top">' +
                  '<strong class="sls-item-title">' + AW.esc(en ? 'Geographic Distribution' : 'التوزيع الجغرافي للعملاء') + '</strong>' +
                  '<a href="' + AW.esc(drillUrl('geo', 'all')) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Full Map / Analytics' : 'التحليل الجغرافي') + '</a>' +
                  '</div>' +
                  '<div class="sls-geo-grid">' +
                  Object.keys(govCounts).map(function (g) {
                    return '<a href="' + AW.esc(drillUrl('geo', g)) + '" class="sls-geo-tile">' +
                      '<span class="sls-item-title">' + AW.esc(g.toUpperCase()) + '</span>' +
                      '<strong class="sls-kpi-val"><bdi dir="ltr">' + AW.esc(AW.formatNumber(govCounts[g])) + '</bdi></strong>' +
                      '</a>';
                  }).join('') +
                  '</div>' +
                  '</div>' +
                  '<div class="adm-analytics-layout">' +
                  '<div class="adm-analytics-main sls-sub-card">' + mainPanelHtml + '</div>' +
                  buildWorldMapPanel(fd) +
                  '</div>' +
                  '</div>';
            }

            function renderActivityFeed() {
              var en = AW.isEn();
              var wrap = byId('adm-activity-wrap');
              if (!wrap) return;
              var depts = [];
              var actors = [];
              D.ACTIVITY_FEED.forEach(function (ev) {
                var d = en ? ev.dept_en : ev.dept_ar;
                var a = en ? ev.actor_en : ev.actor_ar;
                if (d && depts.indexOf(d) < 0) depts.push(d);
                if (a && actors.indexOf(a) < 0) actors.push(a);
              });

              var filtered = D.ACTIVITY_FEED.filter(function (ev) {
                var sevOk = state.activityFilter === 'all' || ev.severity === state.activityFilter || ev.status === state.activityFilter;
                var deptOk = state.activityDept === 'all' || (en ? ev.dept_en : ev.dept_ar) === state.activityDept;
                var actOk = state.activityActor === 'all' || (en ? ev.actor_en : ev.actor_ar) === state.activityActor;
                return sevOk && deptOk && actOk;
              });
              var shown = filtered.slice(0, state.activityLimit);

              wrap.innerHTML =
                '<div class="sls-card">' +
                '<header class="sls-card-head">' +
                '<div>' +
                '<h2 class="sls-card-title">' + AW.esc(en ? 'Live Activity Feed (Audit Stream)' : 'سجل النشاط المباشر') + '</h2>' +
                '<div class="sls-prog-badges">' +
                '<span class="adm-live-dot" aria-hidden="true"></span>' +
                '<h2 class="sls-card-title">' + AW.esc(en ? 'Live Activity Feed (Audit Stream)' : 'سجل النشاط المباشر') + '</h2>' +
                '</div>' +
                '<p class="sls-card-desc">' + AW.esc(en ? 'Showing ' + shown.length + ' of ' + filtered.length + ' recorded operational events.' : 'عرض ' + AW.formatNumber(shown.length) + ' من أصل ' + AW.formatNumber(filtered.length) + ' حدث تشغيلي مسجل.') + '</p>' +
                '</div>' +
                '<div class="sls-period-pills">' +
                '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="adm-sim-event-btn">' + AW.esc(en ? '+ Simulate Event' : '+ محاكاة حدث') + '</button>' +
                ['all', 'critical', 'high', 'warning', 'success'].map(function (f) {
                  return '<button type="button" class="acc-btn ' + (state.activityFilter === f ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-ev-filter="' + f + '">' + AW.esc(loc('status', f)) + '</button>';
                }).join('') +
                '</div>' +
                '</header>' +
                '<div class="sls-filter-toolbar">' +
                '<select id="adm-ev-dept-sel" class="acc-filter-select" aria-label="' + AW.esc(en ? 'Filter by Department' : 'تصفية حسب القسم') + '">' +
                '<option value="all">' + AW.esc(en ? 'All Departments' : 'كل الأقسام') + '</option>' +
                depts.map(function (d) { return '<option value="' + AW.esc(d) + '" ' + (state.activityDept === d ? 'selected' : '') + '>' + AW.esc(d) + '</option>'; }).join('') +
                '</select>' +
                '<select id="adm-ev-actor-sel" class="acc-filter-select" aria-label="' + AW.esc(en ? 'Filter by User' : 'تصفية حسب المستخدم') + '">' +
                '<option value="all">' + AW.esc(en ? 'All Users / Actors' : 'كل المستخدمين') + '</option>' +
                actors.map(function (a) { return '<option value="' + AW.esc(a) + '" ' + (state.activityActor === a ? 'selected' : '') + '>' + AW.esc(a) + '</option>'; }).join('') +
                '</select>' +
                '</div>' +
                '<div class="sls-list">' +
                shown.map(function (ev) {
                  var cls = ev.severity === 'critical' || ev.status === 'failed' ? 'status-pill-amber' : (ev.severity === 'high' ? 'status-pill-blue' : 'status-pill-navy');
                  return '<article class="sls-sub-card">' +
                    '<div class="sls-prog-card-top">' +
                    '<div class="sls-item-main">' +
                    '<strong class="sls-item-title">' + AW.esc(en ? ev.action_en : ev.action_ar) + '</strong>' +
                    '<span class="sls-item-meta">' + AW.esc((en ? ev.actor_en : ev.actor_ar) + ' • ' + (en ? ev.dept_en : ev.dept_ar) + ' • ' + (en ? ev.source_en : ev.source_ar)) + '</span>' +
                    '</div>' +
                    '<div class="sls-prog-badges">' +
                    '<span class="status-pill ' + cls + '">' + AW.esc(loc('status', ev.severity) + ' • ' + loc('status', ev.status)) + '</span>' +
                    '<span class="sls-item-meta"><bdi dir="ltr">' + AW.esc(AW.formatDateTime(ev.timestamp)) + '</bdi></span>' +
                    '</div>' +
                    '</div>' +
                    '<details class="adm-act-details">' +
                    '<summary class="adm-act-summary">' + AW.esc(en ? 'Audit Details & Source Record' : 'تفاصيل التدقيق والسجل المصدر') + '</summary>' +
                    '<div class="sls-prog-actions">' +
                    '<span class="sls-item-meta"><bdi dir="ltr">' + AW.esc(ev.id + ' → ' + ev.entity_id) + '</bdi></span>' +
                    '<a href="' + AW.esc(drillUrl(ev.entity_type, ev.entity_id)) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Open Source Record' : 'فتح السجل المصدر') + '</a>' +
                    '</div>' +
                    '</details>' +
                    '</article>';
                }).join('') +
                '</div>' +
                (filtered.length > shown.length ? '<div><button type="button" id="adm-load-more-act" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Load More Events' : 'عرض المزيد من الأحداث') + '</button></div>' : '') +
                '</div>';
            }

            function renderIntelligenceSection() {
              var en = AW.isEn();
              var wrap = byId('adm-intelligence-wrap');
              if (!wrap) return;
              var sh = D.SYSTEM_HEALTH;
              var bkp = D.BACKUP_PREVIEW;
              var mls = D.MILESTONES;

              wrap.innerHTML =
                '<div class="sls-card">' +
                '<header class="sls-card-head">' +
                '<div><h2 class="sls-card-title">' + AW.esc(en ? 'Smart Insights (Top 3 by Impact & Urgency)' : 'الرؤى الذكية (أهم ٣ مؤشرات حسب الأثر والإلحاح)') + '</h2></div>' +
                '<span class="status-pill status-pill-blue">' + AW.esc(en ? 'Rule-Based Prototype' : 'تحليل مبني على القواعد') + '</span>' +
                '</header>' +
                '<div class="sls-cards-grid">' +
                D.SMART_INSIGHTS.map(function (ins) {
                  return '<article class="sls-sub-card">' +
                    '<span class="status-pill ' + (ins.urgency === 'critical' ? 'status-pill-amber' : 'status-pill-navy') + '">' + AW.esc(loc('status', ins.urgency)) + '</span>' +
                    '<strong class="sls-item-title">' + AW.esc(en ? ins.title_en : ins.title_ar) + '</strong>' +
                    '<p class="sls-item-meta">' + AW.esc(en ? ins.detected_en : ins.detected_ar) + '</p>' +
                    '<p class="sls-item-meta"><strong>' + AW.esc(en ? 'Suggested Next Step:' : 'الخطوة المقترحة:') + '</strong> ' + AW.esc(en ? ins.next_step_en : ins.next_step_ar) + '</p>' +
                    '</article>';
                }).join('') +
                '</div>' +
                '</div>' +
                '<div class="sls-grid-2">' +
                '<article class="sls-card adm-ai-widget-card">' +
                '<header class="sls-card-head">' +
                '<div>' +
                '<h2 class="sls-card-title">' + AW.esc(en ? 'AI Operations Assistant (Simulated)' : 'مساعد العمليات الذكي (محاكاة)') + '</h2>' +
                '<p class="sls-card-desc">' + AW.esc(en ? 'Ask operational questions or open full conversation workspace.' : 'اطرح أسئلة تشغيلية أو انتقل لمساحة المحادثة الكاملة.') + '</p>' +
                '<p class="sls-card-desc">' + AW.esc(en ? 'Separates system facts, rule-based analysis, and forecasts. Requires approval for sensitive actions.' : 'يفصل بين بيانات النظام الفعلية والتحليل والتوقعات، ويتطلب موافقة صريحة لأي إجراء حساس.') + '</p>' +
                '</div>' +
                '<a href="admin-ai-assistant.html" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Open Full AI Assistant' : 'فتح المساعد الكامل') + '</a>' +
                '</header>' +
                '<div class="adm-ai-pillars">' +
                '<div class="adm-ai-pillar">' +
                '<span class="status-pill status-pill-navy">' + AW.esc(en ? '1. System Data' : '١. بيانات النظام') + '</span>' +
                '<p class="sls-item-meta">' + AW.esc(en ? '1 overdue partner request (REQ-401, 19h) & 4 pending Action Center items.' : 'طلب متأخر لدى شركة المروة (REQ-401، ١٩ ساعة) و٤ مهام معلقة بمركز الإجراءات.') + '</p>' +
                '</div>' +
                '<div class="adm-ai-pillar">' +
                '<span class="status-pill status-pill-blue">' + AW.esc(en ? '2. Analysis' : '٢. التحليل') + '</span>' +
                '<p class="sls-item-meta">' + AW.esc(en ? 'Al-Marwa SLA latency (52m) correlates with 1 missed follow-up risk.' : 'تباطؤ استجابة شركة المروة (٥٢ د) يرفع خطر فقدان عميل مؤهل.') + '</p>' +
                '</div>' +
                '<div class="adm-ai-pillar">' +
                '<span class="status-pill status-pill-amber">' + AW.esc(en ? '3. Forecast (Sim)' : '٣. التوقع (محاكاة)') + '</span>' +
                '<p class="sls-item-meta">' + AW.esc(en ? 'Projected +14% customer growth next period if SLA returns under 25m.' : 'توقع نمو العملاء +١٤٪ في الفترة القادمة عند خفض زمن الرد لأقل من ٢٥ د.') + '</p>' +
                '</div>' +
                '</div>' +
                '<form id="adm-ai-quick-form" class="adm-ai-quick-form">' +
                '<label for="adm-ai-quick-input" class="visually-hidden">' + AW.esc(en ? 'Ask AI Operations Assistant' : 'اسأل مساعد العمليات الذكي') + '</label>' +
                '<input type="text" id="adm-ai-quick-input" class="acc-filter-input adm-ai-input" placeholder="' + AW.esc(en ? 'Ask an operational question...' : 'اسأل سؤالاً تشغيلياً...') + '">' +
                '<button type="submit" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Ask' : 'اسأل') + '</button>' +
                '</form>' +
                '<div class="sls-prog-badges">' +
                [
                  { ar: 'حلل أداء الموظفين اليوم', en: 'Analyze employee performance today' },
                  { ar: 'اعرض الطلبات المتأخرة', en: 'Show overdue requests' },
                  { ar: 'ما المشكلات التي حدثت اليوم؟', en: 'What problems happened today?' },
                  { ar: 'قارن أداء الشركات هذا الشهر', en: 'Compare company performance this month' },
                  { ar: 'أعد التقرير اليومي', en: 'Prepare the daily report' }
                ].map(function (p) {
                  var txt = en ? p.en : p.ar;
                  return '<a href="admin-ai-assistant.html?prompt=' + encodeURIComponent(txt) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(txt) + '</a>';
                }).join('') +
                '</div>' +
                '</article>' +
                '<article class="sls-card">' +
                '<header class="sls-card-head">' +
                '<div><h2 class="sls-card-title">' + AW.esc(en ? 'System Health & Backup Preview (Simulated)' : 'صحة النظام والنسخ الاحتياطي (محاكاة)') + '</h2></div>' +
                '<div class="sls-prog-badges">' +
                '<a href="admin-system-health.html" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'System Health Details' : 'تفاصيل صحة النظام') + '</a>' +
                '<a href="admin-transactions.html" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Backup & Records' : 'السجلات والنسخ') + '</a>' +
                '</div>' +
                '</header>' +
                '<dl class="sls-detail-grid">' +
                '<div><dt>' + AW.esc(en ? 'Server / DB' : 'الخادم / القاعدة') + '</dt><dd>' + AW.esc((en ? sh.server.label_en : sh.server.label_ar) + ' • ' + (en ? sh.database.label_en : sh.database.label_ar)) + '</dd></div>' +
                '<div><dt>' + AW.esc(en ? 'External APIs' : 'الروابط الخارجية') + '</dt><dd>' + AW.esc(en ? sh.external_connections.label_en : sh.external_connections.label_ar) + '</dd></div>' +
                '<div><dt>' + AW.esc(en ? 'Last Backup (Mock)' : 'آخر نسخة (محاكاة)') + '</dt><dd><bdi dir="ltr">' + AW.esc(AW.formatDateTime(bkp.last_successful_at)) + '</bdi></dd></div>' +
                '<div><dt>' + AW.esc(en ? '3 Storage Locations' : '٣ مواقع تخزين') + '</dt><dd>' + bkp.locations.map(function (l) { return AW.esc(en ? l.name_en : l.name_ar); }).join(' • ') + '</dd></div>' +
                '</dl>' +
                '<div class="sls-notice-banner">' +
                '<strong>' + AW.esc(en ? 'Daily Highlight:' : 'إبراز اليوم:') + '</strong> ' + AW.esc(en ? mls.daily_highlight_en : mls.daily_highlight_ar) +
                '</div>' +
                '</article>' +
                '</div>' +
                '<div class="sls-card adm-milestones-card">' +
                '<header class="sls-card-head">' +
                '<div>' +
                '<h2 class="sls-card-title">' + AW.esc(en ? 'Milestones & Operational Achievements' : 'الإنجازات والتطورات التشغيلية') + '</h2>' +
                '<p class="sls-card-desc">' + AW.esc(en ? 'Positive team momentum, customer growth, and SLA speed improvements.' : 'نمو العملاء، إنجازات فرق المبيعات والحسابات، وتحسن سرعة الاستجابة.') + '</p>' +
                '</div>' +
                '<span class="status-pill status-pill-amber">' + AW.esc(en ? 'Celebrated Progress' : 'تقدم ملموس') + '</span>' +
                '</header>' +
                '<div class="sls-cards-grid">' +
                (mls.items || []).map(function (ach) {
                  return '<article class="sls-sub-card adm-milestone-tile">' +
                    '<span class="status-pill status-pill-navy">' + AW.esc(en ? ach.tag_en : ach.tag_ar) + '</span>' +
                    '<strong class="sls-item-title">' + AW.esc(en ? ach.title_en : ach.title_ar) + '</strong>' +
                    '<p class="sls-item-meta">' + AW.esc(en ? ach.desc_en : ach.desc_ar) + '</p>' +
                    '</article>';
                }).join('') +
                '</div>' +
                '</div>';
            }

            function renderDataStatusFooter() {
              var en = AW.isEn();
              var footer = byId('adm-data-footer');
              if (!footer) return;
              var totalRecords = D.CUSTOMERS.length + D.COMPANIES.length + D.SALES_EMPLOYEES.length + D.EMP_TO_COMPANY_REQUESTS.length + D.ACTIVITY_FEED.length;
              var dbSourceLabel = state.liveDbConnected
                ? (en ? 'Live SQLite DB (data/miqat.db) + Simulated Forecast/AI' : 'قاعدة بيانات SQLite الحية (data/miqat.db) + توقعات/ذكاء محاكاة')
                : (en ? 'Prototype Mock + Local SQLite Auth' : 'نموذج تجريبي + توثيق SQLite');
              footer.innerHTML =
                '<div class="adm-footer-row">' +
                '<span>' + AW.esc((en ? 'Represented Records: ' : 'السجلات الممثلة: ') + AW.formatNumber(totalRecords)) + '</span>' +
                '<span>' + AW.esc((en ? 'Data Mode: ' : 'وضع البيانات: ') + loc('data_mode', state.dataMode) + ' (' + dbSourceLabel + ')') + '</span>' +
                '<span>' + AW.esc(en ? 'Disconnected: Partner APIs, Live AI, WhatsApp Gateway' : 'غير متصل: API الشركات، الذكاء الاصطناعي الحي، بوابة واتساب') + '</span>' +
                '</div>';
            }

            async function syncLiveDatabase() {
              try {
                var res = await AW.apiFetch('/api/admin/control-center', { method: 'GET' });
                if (!res || !res.success) return false;
                state.liveDbConnected = true;
                state.lastUpdated = (res.sourceMeta && res.sourceMeta.checkedAt) || new Date().toISOString();

                if (res.systemHealth) {
                  D.SYSTEM_HEALTH.server.label_ar = 'الخادم يعمل (' + res.systemHealth.uptime_seconds + ' ث • ' + res.systemHealth.memory_mb + ' MB)';
                  D.SYSTEM_HEALTH.server.label_en = 'Server Online (' + res.systemHealth.uptime_seconds + 's • ' + res.systemHealth.memory_mb + ' MB)';
                  D.SYSTEM_HEALTH.database.label_ar = 'SQLite متصل (' + res.systemHealth.db_size_kb + ' KB • ' + res.systemHealth.db_integrity + ')';
                  D.SYSTEM_HEALTH.database.label_en = 'SQLite Connected (' + res.systemHealth.db_size_kb + ' KB • ' + res.systemHealth.db_integrity + ')';
                }

                setText('adm-sys-status-pill', AW.isEn() ? 'Live DB Connected: miqat.db' : 'متصل بقاعدة البيانات: miqat.db');
                return true;
              } catch (_) {
                state.liveDbConnected = false;
                return false;
              }
            }

            function renderExecutiveView(fd) {
              var en = AW.isEn();
              var el = byId('adm-executive-view');
              if (!el) return;
              el.innerHTML =
                '<div class="sls-card">' +
                '<header class="sls-card-head">' +
                '<div>' +
                '<h2 class="sls-card-title">' + AW.esc(en ? 'Executive View — Compact Owner Summary' : 'العرض التنفيذي — ملخص المالك السريع') + '</h2>' +
                '<p class="sls-card-desc">' + AW.esc(en ? 'Dedicated executive arrangement preserving your active filters and date range.' : 'ترتيب تنفيذي مخصص يحافظ على الفلاتر والمدى الزمني النشط.') + '</p>' +
                '</div>' +
                '</header>' +
                '<div class="adm-kpi-grid">' +
                KPI_LIBRARY.slice(0, 6).map(function (k) {
                  return '<a href="' + AW.esc(drillUrl(k.drill, k.id)) + '" class="adm-kpi-tile is-business-kpi">' +
                    '<span class="sls-kpi-label">' + AW.esc(en ? k.en : k.ar) + '</span>' +
                    '<strong class="adm-kpi-val"><bdi dir="ltr">' + AW.esc(AW.formatNumber(k.val(fd))) + '</bdi></strong>' +
                    '</a>';
                }).join('') +
                '</div>' +
                '</div>' +
                '<div class="sls-grid-2">' +
                '<article class="sls-card"><h3 class="sls-card-title">' + AW.esc(en ? 'Top Action Items' : 'أهم المهام العاجلة') + '</h3>' +
                '<div class="sls-list">' + fd.actionItems.slice(0, 3).map(function (a) {
                  return '<div class="sls-list-item"><div class="sls-item-main"><strong>' + AW.esc(en ? a.title_en : a.title_ar) + '</strong><span class="sls-item-meta">' + AW.esc(en ? a.wait_label_en : a.wait_label_ar) + '</span></div><a href="' + AW.esc(drillUrl(a.entity_type, a.entity_id)) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Review' : 'مراجعة') + '</a></div>';
                }).join('') + '</div>' +
                '</article>' +
                '<article class="sls-card"><h3 class="sls-card-title">' + AW.esc(en ? 'Top Insights & Health' : 'أهم الرؤى وصحة النظام') + '</h3>' +
                '<div class="sls-list">' + D.SMART_INSIGHTS.slice(0, 2).map(function (ins) {
                  return '<div class="sls-list-item"><div class="sls-item-main"><strong>' + AW.esc(en ? ins.title_en : ins.title_ar) + '</strong><span class="sls-item-meta">' + AW.esc(en ? ins.next_step_en : ins.next_step_ar) + '</span></div></div>';
                }).join('') + '</div>' +
                '</article>' +
                '</div>';
            }

            function applyLayoutAndCustomizeUI() {
              var en = AW.isEn();
              var adv = byId('adm-advanced-workspace');
              var exec = byId('adm-executive-view');
              var nav = byId('adm-section-nav');
              if (!adv || !exec || !nav) return;

              adv.hidden = state.mode === 'executive';
              nav.hidden = state.mode === 'executive';
              exec.hidden = state.mode !== 'executive';

              var btnAdv = byId('adm-mode-advanced');
              var btnExec = byId('adm-mode-executive');
              if (btnAdv) {
                btnAdv.setAttribute('aria-pressed', state.mode === 'advanced' ? 'true' : 'false');
                btnAdv.className = 'acc-btn acc-btn-sm ' + (state.mode === 'advanced' ? 'acc-btn-primary' : 'acc-btn-secondary');
              }
              if (btnExec) {
                btnExec.setAttribute('aria-pressed', state.mode === 'executive' ? 'true' : 'false');
                btnExec.className = 'acc-btn acc-btn-sm ' + (state.mode === 'executive' ? 'acc-btn-primary' : 'acc-btn-secondary');
              }

              var ordered = state.layout.pinned.concat(state.layout.order.filter(function (id) { return state.layout.pinned.indexOf(id) < 0; }));
              ordered.forEach(function (id) {
                var sec = byId(id);
                if (!sec) return;
                if ('moveBefore' in Element.prototype) {
                  try { adv.moveBefore(sec, null); } catch (_) { adv.appendChild(sec); }
                } else {
                  adv.appendChild(sec);
                }
                var isHidden = state.layout.hidden.indexOf(id) >= 0;
                var focusHidden = state.focusSection !== 'all' && state.focusSection !== id;
                sec.hidden = isHidden || focusHidden;

                var isCollapsed = state.layout.collapsed.indexOf(id) >= 0;
                var isCompact = state.layout.sizes && state.layout.sizes[id] === 'compact';
                sec.classList.toggle('is-collapsed', isCollapsed);
                sec.classList.toggle('is-compact-widget', isCompact);
                var bodyEl = sec.querySelector('.adm-widget-body');
                if (bodyEl) bodyEl.hidden = isCollapsed;

                var chrome = sec.querySelector('.adm-widget-chrome');
                if (chrome) {
                  chrome.hidden = !state.customizeMode && !isCollapsed;
                  var isPinned = state.layout.pinned.indexOf(id) >= 0;
                  chrome.innerHTML =
                    '<button type="button" class="adm-drag-handle" aria-label="' + AW.esc(en ? ('Reorder ' + loc('section', id)) : ('إعادة ترتيب ' + loc('section', id))) + '" ' + (state.customizeMode ? '' : 'hidden') + '>⋮⋮ ' + AW.esc(loc('section', id)) + '</button>' +
                    '<div class="sls-prog-badges">' +
                    (state.customizeMode ? (
                      '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-w-move="up" data-wid="' + id + '">' + AW.esc(en ? 'Up' : 'أعلى') + '</button>' +
                      '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-w-move="down" data-wid="' + id + '">' + AW.esc(en ? 'Down' : 'أسفل') + '</button>' +
                      '<button type="button" class="acc-btn ' + (isPinned ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-w-pin="' + id + '">' + AW.esc(isPinned ? (en ? 'Pinned' : 'مثبت') : (en ? 'Pin Top' : 'تثبيت')) + '</button>' +
                      '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-w-size="' + id + '">' + AW.esc(isCompact ? (en ? 'Wide' : 'موسع') : (en ? 'Compact' : 'مضغوط')) + '</button>' +
                      '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-w-hide="' + id + '">' + AW.esc(en ? 'Hide' : 'إخفاء') + '</button>'
                    ) : '') +
                    '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-w-collapse="' + id + '" aria-expanded="' + (!isCollapsed ? 'true' : 'false') + '">' + AW.esc(isCollapsed ? (en ? 'Expand' : 'توسيع') : (en ? 'Collapse' : 'طي')) + '</button>' +
                    '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-w-refresh="' + id + '">' + AW.esc(en ? 'Refresh' : 'تحديث') + '</button>' +
                    '</div>';
                }
              });

              var custBar = byId('adm-customize-bar');
              if (custBar) custBar.hidden = !state.customizeMode;
              var custBtn = byId('adm-customize-btn');
              if (custBtn) custBtn.setAttribute('aria-pressed', state.customizeMode ? 'true' : 'false');
              var hiddenBar = byId('adm-hidden-widgets-bar');
              if (hiddenBar) {
                hiddenBar.innerHTML = state.layout.hidden.map(function (hid) {
                  return '<button type="button" class="sls-filter-chip" data-w-show="' + AW.esc(hid) + '">' + AW.esc((en ? 'Restore ' : 'إظهار ') + loc('section', hid)) + ' +</button>';
                }).join('');
              }
            }

            function renderAll() {
              var fd = getFilteredData();
              renderCommandHeader();
              renderActionCenter(fd);
              renderKpiOverview(fd);
              renderWorkforce(fd);
              renderBusinessOverview(fd);
              renderAnalyticsStudio(fd);
              renderActivityFeed();
              renderIntelligenceSection();
              renderDataStatusFooter();
              renderExecutiveView(fd);
              applyLayoutAndCustomizeUI();
            }

            function openKpiLibrary() {
              var en = AW.isEn();
              var body = byId('adm-kpilib-body');
              var dlg = byId('adm-kpi-lib-dialog');
              if (!body || !dlg) return;
              body.innerHTML = '<div class="sls-smart-grid">' +
                KPI_LIBRARY.map(function (k) {
                  var checked = state.layout.kpis.indexOf(k.id) >= 0;
                  return '<label class="sls-sub-card sls-ms-item"><input type="checkbox" data-kpilib-id="' + AW.esc(k.id) + '" ' + (checked ? 'checked' : '') + '> <span>' + AW.esc(en ? k.en : k.ar) + '</span></label>';
                }).join('') +
                '</div>';
              body.querySelectorAll('[data-kpilib-id]').forEach(function (cb) {
                cb.addEventListener('change', function () {
                  var kid = cb.getAttribute('data-kpilib-id');
                  if (cb.checked && state.layout.kpis.indexOf(kid) < 0) state.layout.kpis.push(kid);
                  if (!cb.checked) state.layout.kpis = state.layout.kpis.filter(function (x) { return x !== kid; });
                  saveLayoutState();
                  renderAll();
                });
              });
              if (!dlg.open) dlg.showModal();
            }

            function openCompareDialog() {
              var en = AW.isEn();
              var body = byId('adm-cmp-body');
              var dlg = byId('adm-compare-dialog');
              if (!body || !dlg) return;
              var acc = D.ACCOUNTS_SHARED;
              var slsContracts = D.SALES_EMPLOYEES.reduce(function (a, e) { return a + e.completed_contracts; }, 0);
              var slsBookings = D.SALES_EMPLOYEES.reduce(function (a, e) { return a + e.bookings; }, 0);

              body.innerHTML =
                '<div class="acc-table-responsive">' +
                '<table class="sls-table">' +
                '<thead><tr><th>' + AW.esc(en ? 'Metric' : 'المؤشر') + '</th><th>' + AW.esc(en ? acc.name_en : acc.name_ar) + '</th><th>' + AW.esc(en ? 'Sales Team Total' : 'إجمالي فريق المبيعات') + '</th></tr></thead>' +
                '<tbody>' +
                '<tr><th>' + AW.esc(en ? 'Attribution' : 'نسبة العمليات') + '</th><td>' + AW.esc(en ? 'Shared (~3 staff)' : 'حساب مشترك (~٣ موظفين)') + '</td><td>' + AW.esc(en ? 'Individual per agent' : 'فردي لكل موظف') + '</td></tr>' +
                '<tr><th>' + AW.esc(en ? 'Operations / Bookings' : 'العمليات / الحجوزات') + '</th><td>' + AW.formatNumber(acc.operations_executed) + '</td><td>' + AW.formatNumber(slsBookings) + '</td></tr>' +
                '<tr><th>' + AW.esc(en ? 'Approved / Contracts' : 'المعتمد / العقود') + '</th><td>' + AW.formatNumber(acc.approved_ops) + '</td><td>' + AW.formatNumber(slsContracts) + '</td></tr>' +
                '<tr><th>' + AW.esc(en ? 'Avg First Response' : 'متوسط الرد الأول') + '</th><td>' + AW.formatNumber(acc.first_response_min) + 'm</td><td>' + AW.formatNumber(9) + 'm</td></tr>' +
                '</tbody>' +
                '</table>' +
                '</div>';
              if (!dlg.open) dlg.showModal();
            }

            function openFilterDialog() {
              var en = AW.isEn();
              var body = byId('adm-flt-body');
              var dlg = byId('adm-filter-dialog');
              if (!body || !dlg) return;
              var fd = getFilteredData();

              body.innerHTML =
                '<div class="sls-smart-form">' +
                '<div class="sls-prog-badges">' +
                [
                  { k: 'online_staff', ar: 'الموظفون المتصلون', en: 'Online Staff' },
                  { k: 'delayed_requests', ar: 'الطلبات المتأخرة', en: 'Delayed Requests' },
                  { k: 'new_customers', ar: 'العملاء الجدد', en: 'New Customers' },
                  { k: 'pending_approvals', ar: 'الاعتمادات المعلقة', en: 'Pending Approvals' }
                ].map(function (qf) {
                  var active = state.filters.quick.indexOf(qf.k) >= 0;
                  return '<button type="button" class="acc-btn ' + (active ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-qf="' + qf.k + '">' + AW.esc(en ? qf.en : qf.ar) + '</button>';
                }).join('') +
                '</div>' +
                '<div class="sls-sub-card">' +
                '<strong class="sls-item-title">' + AW.esc(en ? 'Visual Filter Builder (Field → Operator → Value)' : 'منشئ الفلاتر المرئي (الحقل ← المعامل ← القيمة)') + '</strong>' +
                '<div class="sls-smart-grid">' +
                '<select id="flt-logic" class="acc-filter-select"><option value="AND">AND</option><option value="OR">OR</option></select>' +
                '<select id="flt-module" class="acc-filter-select"><option value="customer">' + AW.esc(en ? 'Customers' : 'العملاء') + '</option><option value="request">' + AW.esc(en ? 'Company Requests' : 'طلبات الشركات') + '</option></select>' +
                '<select id="flt-field" class="acc-filter-select"><option value="stage">stage</option><option value="gov">gov</option><option value="status">status</option><option value="company_id">company_id</option></select>' +
                '<select id="flt-op" class="acc-filter-select"><option value="equals">' + AW.esc(en ? 'equals' : 'يساوي') + '</option><option value="contains">' + AW.esc(en ? 'contains' : 'يحتوي') + '</option><option value="not_empty">' + AW.esc(en ? 'not empty' : 'غير فارغ') + '</option></select>' +
                '<input type="text" id="flt-val" class="acc-filter-input" placeholder="new / cairo / overdue">' +
                '</div>' +
                '<div class="sls-prog-actions">' +
                '<button type="button" id="flt-add-rule-btn" class="acc-btn acc-btn-primary acc-btn-sm">' + AW.esc(en ? 'Add Condition' : 'إضافة شرط') + '</button>' +
                '<button type="button" id="flt-reset-all-btn" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Clear All & Reset' : 'مسح وإعادة ضبط') + '</button>' +
                '<button type="button" id="flt-export-csv" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Export CSV' : 'تصدير CSV') + '</button>' +
                '<button type="button" id="flt-export-pdf" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Print / PDF' : 'طباعة / PDF') + '</button>' +
                '<span class="sls-item-meta">' + AW.esc((en ? 'Preview: ' : 'معاينة النتائج: ') + AW.formatNumber(fd.customers.length) + (en ? ' customers, ' : ' عميل، ') + AW.formatNumber(fd.requests.length) + (en ? ' requests (Simulated ~12ms)' : ' طلب (محاكاة ~١٢م.ث)')) + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="sls-sub-card">' +
                '<div class="sls-prog-card-top">' +
                '<strong class="sls-item-title">' + AW.esc(en ? 'Saved Filter Groups' : 'مجموعات الفلاتر المحفوظة') + '</strong>' +
                '<div class="sls-prog-badges">' +
                '<input type="text" id="flt-save-name" class="acc-filter-input adm-flt-save-input" placeholder="' + AW.esc(en ? 'Filter group name...' : 'اسم مجموعة الفلتر...') + '">' +
                '<button type="button" id="flt-save-group-btn" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Save Group' : 'حفظ المجموعة') + '</button>' +
                '</div>' +
                '</div>' +
                '<div class="sls-prog-badges">' +
                (state.filters.savedFilters.length
                  ? state.filters.savedFilters.map(function (sf, idx) {
                    return '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-flt-load="' + idx + '">' + AW.esc(sf.name) + '</button>';
                  }).join('')
                  : '<span class="sls-item-meta">' + AW.esc(en ? 'No saved filter groups yet.' : 'لا توجد مجموعات فلاتر محفوظة بعد.') + '</span>') +
                '</div>' +
                '</div>' +
                '<div class="sls-sub-card">' +
                '<div class="sls-prog-card-top">' +
                '<strong class="sls-item-title">' + AW.esc(en ? 'Filtered Results View' : 'طريقة عرض النتائج') + '</strong>' +
                '<div class="sls-period-pills">' +
                ['summary', 'table', 'cards'].map(function (vm) {
                  var lbl = vm === 'summary' ? (en ? 'Summary' : 'ملخص') : (vm === 'table' ? (en ? 'Table' : 'جدول') : (en ? 'Cards' : 'بطاقات'));
                  return '<button type="button" class="acc-btn ' + (state.filterViewMode === vm ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-flt-vmode="' + vm + '">' + AW.esc(lbl) + '</button>';
                }).join('') +
                '</div>' +
                '</div>' +
                (state.filterViewMode === 'table'
                  ? '<div class="acc-table-responsive"><table class="sls-table"><thead><tr><th>ID</th><th>' + AW.esc(en ? 'Customer' : 'العميل') + '</th><th>' + AW.esc(en ? 'Stage' : 'المرحلة') + '</th><th>' + AW.esc(en ? 'Gov' : 'المحافظة') + '</th></tr></thead><tbody>' +
                  fd.customers.slice(0, 6).map(function (c) {
                    return '<tr><td><bdi dir="ltr">' + AW.esc(c.id) + '</bdi></td><td>' + AW.esc(en ? c.name_en : c.name_ar) + '</td><td>' + AW.esc(c.stage) + '</td><td>' + AW.esc(c.gov) + '</td></tr>';
                  }).join('') + '</tbody></table></div>'
                  : (state.filterViewMode === 'cards'
                    ? '<div class="sls-cards-grid">' + fd.customers.slice(0, 4).map(function (c) {
                      return '<div class="sls-sub-card"><strong>' + AW.esc(en ? c.name_en : c.name_ar) + '</strong><span class="sls-item-meta">' + AW.esc(c.stage + ' • ' + c.gov) + '</span></div>';
                    }).join('') + '</div>'
                    : '<p class="sls-item-meta">' + AW.esc(en ? ('Matching ' + fd.customers.length + ' customers and ' + fd.requests.length + ' requests.') : ('مطابقة ' + AW.formatNumber(fd.customers.length) + ' عميل و' + AW.formatNumber(fd.requests.length) + ' طلب.')) + '</p>')) +
                '</div>' +
                '<div class="sls-sub-card">' +
                '<strong class="sls-item-title">' + AW.esc(en ? 'Arabic Natural-Language Filter (Simulated Parser — Review Before Apply)' : 'فلتر اللغة الطبيعية بالعربية (محاكاة — مراجعة قبل التنفيذ)') + '</strong>' +
                '<div class="sls-filter-toolbar">' +
                '<input type="text" id="flt-nl-input" class="acc-filter-input adm-nl-input" placeholder="مثال: العملاء الجدد في القاهرة أو الطلبات المتأخرة">' +
                '<button type="button" id="flt-nl-parse-btn" class="acc-btn acc-btn-secondary acc-btn-sm">' + AW.esc(en ? 'Interpret Query' : 'تفسير الجملة') + '</button>' +
                '</div>' +
                '<div id="flt-nl-preview" class="sls-item-meta"></div>' +
                '</div>' +
                '</div>';

              var logicSel = byId('flt-logic');
              if (logicSel) logicSel.value = state.filters.logic || 'AND';

              body.querySelectorAll('[data-qf]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                  var qk = btn.getAttribute('data-qf');
                  var idx = state.filters.quick.indexOf(qk);
                  if (idx >= 0) state.filters.quick.splice(idx, 1);
                  else state.filters.quick.push(qk);
                  saveFilterState();
                  renderAll();
                  openFilterDialog();
                });
              });

              onEl('flt-add-rule-btn', 'click', function () {
                state.filters.logic = byId('flt-logic').value;
                state.filters.rules.push({
                  module: byId('flt-module').value,
                  field: byId('flt-field').value,
                  op: byId('flt-op').value,
                  value: byId('flt-val').value.trim()
                });
                saveFilterState();
                renderAll();
                openFilterDialog();
              });

              onEl('flt-nl-parse-btn', 'click', function () {
                var txt = (byId('flt-nl-input').value || '').trim();
                var parsed = [];
                if (txt.includes('جديد') || txt.includes('جدد')) parsed.push({ module: 'customer', field: 'stage', op: 'equals', value: 'new' });
                if (txt.includes('القاهرة')) parsed.push({ module: 'customer', field: 'gov', op: 'equals', value: 'cairo' });
                if (txt.includes('متأخر')) parsed.push({ module: 'request', field: 'status', op: 'equals', value: 'overdue' });
                var prev = byId('flt-nl-preview');
                if (!parsed.length) {
                  prev.textContent = en ? 'No matching simulated conditions detected. Try "القاهرة" or "متأخر".' : 'لم يتم التعرف على شروط مطابقة. جرب: «العملاء الجدد في القاهرة» أو «الطلبات المتأخرة».';
                  return;
                }
                prev.innerHTML = '<span>' + AW.esc((en ? 'Interpreted Conditions: ' : 'الشروط المستخلصة للمراجعة: ') + parsed.map(function (p) { return p.field + '=' + p.value; }).join(' AND ')) + '</span> ' +
                  '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" id="flt-nl-apply">' + AW.esc(en ? 'Approve & Apply' : 'اعتماد وتطبيق') + '</button>';
                onEl('flt-nl-apply', 'click', function () {
                  state.filters.rules = state.filters.rules.concat(parsed);
                  saveFilterState();
                  renderAll();
                  dlg.close();
                });
              });

              onEl('flt-reset-all-btn', 'click', function () {
                state.filters.quick = [];
                state.filters.rules = [];
                saveFilterState();
                renderAll();
                openFilterDialog();
              });

              onEl('flt-save-group-btn', 'click', function () {
                var inp = byId('flt-save-name');
                var name = (inp && inp.value || '').trim();
                if (!name) {
                  if (inp) inp.focus();
                  AW.showToast(en ? 'Please enter a filter group name.' : 'يرجى إدخال اسم لمجموعة الفلاتر.');
                  return;
                }
                state.filters.savedFilters.push({
                  name: name,
                  quick: state.filters.quick.slice(),
                  logic: state.filters.logic,
                  rules: state.filters.rules.map(function (r) { return Object.assign({}, r); })
                });
                saveFilterState();
                openFilterDialog();
                AW.showToast(en ? 'Filter group saved.' : 'تم حفظ مجموعة الفلاتر.');
              });

              body.querySelectorAll('[data-flt-load]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                  var sf = state.filters.savedFilters[Number(btn.getAttribute('data-flt-load'))];
                  if (!sf) return;
                  state.filters.quick = (sf.quick || []).slice();
                  state.filters.logic = sf.logic || 'AND';
                  state.filters.rules = (sf.rules || []).map(function (r) { return Object.assign({}, r); });
                  saveFilterState();
                  renderAll();
                  openFilterDialog();
                });
              });

              body.querySelectorAll('[data-flt-vmode]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                  state.filterViewMode = btn.getAttribute('data-flt-vmode');
                  openFilterDialog();
                });
              });

              onEl('flt-export-csv', 'click', function () {
                var rows = [['ID', 'Name', 'Stage', 'Governorate']];
                fd.customers.forEach(function (c) {
                  rows.push([c.id, en ? c.name_en : c.name_ar, c.stage, c.gov]);
                });
                var csv = '\uFEFF' + rows.map(function (r) {
                  return r.map(function (v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; }).join(',');
                }).join('\n');
                var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'miqat-control-center-export.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
                AW.showToast(en ? 'CSV exported.' : 'تم تصدير ملف CSV.');
              });

              onEl('flt-export-pdf', 'click', function () {
                dlg.close();
                window.print();
              });

              if (!dlg.open) dlg.showModal();
            }

            var scrollspyObserver = null;

            function setActiveNavLink(nav, id) {
              if (!nav || !id) return;
              nav.querySelectorAll('.adm-sec-link').forEach(function (a) {
                var active = a.getAttribute('href') === '#' + id;
                a.classList.toggle('is-active', active);
                a.setAttribute('aria-current', active ? 'true' : 'false');
              });
            }

            function cleanupScrollspy() {
              if (scrollspyObserver) {
                scrollspyObserver.disconnect();
                scrollspyObserver = null;
              }
            }

            function setupScrollspy() {
              var nav = byId('adm-section-nav');
              if (!nav) return;
              cleanupScrollspy();

              nav.querySelectorAll('.adm-sec-link').forEach(function (a) {
                if (a.dataset.scrollspyBound) return;
                a.dataset.scrollspyBound = '1';
                a.addEventListener('click', function () {
                  var href = a.getAttribute('href') || '';
                  if (href.startsWith('#')) setActiveNavLink(nav, href.slice(1));
                });
              });

              var firstVisible = DEFAULT_WIDGET_ORDER.find(function (id) {
                var el = byId(id);
                return el && !el.hidden;
              }) || DEFAULT_WIDGET_ORDER[0];
              setActiveNavLink(nav, firstVisible);

              if (typeof IntersectionObserver !== 'function') return;

              scrollspyObserver = new IntersectionObserver(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                  if (entries[i].isIntersecting) {
                    var id = entries[i].target.getAttribute('id');
                    if (id) setActiveNavLink(nav, id);
                    break;
                  }
                }
              }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });

              DEFAULT_WIDGET_ORDER.forEach(function (id) {
                var el = byId(id);
                if (el) scrollspyObserver.observe(el);
              });
            }

            var autoRefreshTimer = null;

            function setupDataModeTimer() {
              if (autoRefreshTimer) {
                clearInterval(autoRefreshTimer);
                autoRefreshTimer = null;
              }
              if (state.dataMode === 'periodic') {
                autoRefreshTimer = setInterval(async function () {
                  try {
                    await syncLiveDatabase();
                    state.lastUpdated = new Date().toISOString();
                    renderAll();
                  } catch (err) {
                    console.warn('[AdminControlCenter] Periodic refresh failed:', err && err.message ? err.message : err);
                  }
                }, 30000);
              }
            }

            function setupDragAndDrop() {
              var container = byId('adm-advanced-workspace');
              if (!container || container.dataset.dndBound) return;
              container.dataset.dndBound = '1';
              var dragState = null;

              container.addEventListener('pointerdown', function (e) {
                if (e.button !== 0 || !state.customizeMode) return;
                var handle = closestEl(e.target, '.adm-drag-handle');
                if (!handle) return;
                var item = closestEl(handle, '.adm-widget-section');
                if (!item) return;

                e.preventDefault();
                dragState = { pointerId: e.pointerId, item: item, handle: handle, startY: e.clientY };
                try { handle.setPointerCapture(e.pointerId); } catch (_) { }
                document.documentElement.classList.add('adm-is-dragging');
                item.classList.add('is-dragging');
                container.setAttribute('data-drop', 'active');
              });

              document.addEventListener('pointermove', function (e) {
                if (!dragState || e.pointerId !== dragState.pointerId) return;
                var dy = e.clientY - dragState.startY;
                dragState.item.style.translate = '0px ' + dy.toFixed(1) + 'px';

                var siblings = Array.prototype.slice.call(container.querySelectorAll('.adm-widget-section:not([hidden])'));
                var ref = null;
                for (var i = 0; i < siblings.length; i++) {
                  var sib = siblings[i];
                  if (sib === dragState.item) continue;
                  var r = sib.getBoundingClientRect();
                  if (e.clientY < r.top + r.height / 2) { ref = sib; break; }
                }
                dragState.dropRef = ref;
                var cRect = container.getBoundingClientRect();
                var lineY = ref ? ref.getBoundingClientRect().top : cRect.bottom;
                container.style.setProperty('--drop-x', cRect.left.toFixed(1) + 'px');
                container.style.setProperty('--drop-y', lineY.toFixed(1) + 'px');
                container.style.setProperty('--drop-w', cRect.width.toFixed(1) + 'px');
              });

              function finishDrag(cancelled) {
                if (!dragState) return;
                var item = dragState.item;
                var ref = dragState.dropRef;
                try {
                  if (dragState.handle.hasPointerCapture && dragState.handle.hasPointerCapture(dragState.pointerId)) {
                    dragState.handle.releasePointerCapture(dragState.pointerId);
                  }
                } catch (_) { }
                item.style.translate = '';
                item.classList.remove('is-dragging');
                document.documentElement.classList.remove('adm-is-dragging');
                container.removeAttribute('data-drop');
                container.style.removeProperty('--drop-x');
                container.style.removeProperty('--drop-y');
                container.style.removeProperty('--drop-w');

                if (!cancelled && ref !== item.nextElementSibling) {
                  if ('moveBefore' in Element.prototype) {
                    try { container.moveBefore(item, ref || null); } catch (_) { container.insertBefore(item, ref || null); }
                  } else {
                    container.insertBefore(item, ref || null);
                  }
                  state.layout.order = Array.prototype.slice.call(container.querySelectorAll('.adm-widget-section')).map(function (s) {
                    return s.getAttribute('data-widget-id');
                  });
                  saveLayoutState();
                }
                dragState = null;
              }

              document.addEventListener('pointerup', function (e) { if (dragState && e.pointerId === dragState.pointerId) finishDrag(false); });
              document.addEventListener('pointercancel', function (e) { if (dragState && e.pointerId === dragState.pointerId) finishDrag(true); });
              document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dragState) finishDrag(true); });
            }

            function cleanupLifecycle() {
              cleanupScrollspy();
              cancelKpiAnimations();
              if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
            }

            window.addEventListener('pagehide', cleanupLifecycle);
            window.addEventListener('beforeunload', cleanupLifecycle);

            document.addEventListener('DOMContentLoaded', async function () {
              if (window.__admControlCenterBound) return;
              window.__admControlCenterBound = true;

              try {
                await AW.init();
              } catch (err) {
                console.warn('[AdminControlCenter] Auth/shell initialization aborted:', err && err.message ? err.message : err);
                return;
              }

              loadPersistedState();
              await syncLiveDatabase();
              renderAll();
              setupScrollspy();
              setupDragAndDrop();
              setupDataModeTimer();

              var gsInput = byId('adm-global-search');
              var gsPop = byId('adm-global-search-results');
              if (gsInput && gsPop) {
                gsInput.addEventListener('input', function () {
                  var q = gsInput.value.trim().toLowerCase();
                  if (!q) { gsPop.hidden = true; return; }
                  var en = AW.isEn();
                  var hits = [];
                  D.CUSTOMERS.forEach(function (c) {
                    if (c.name_ar.toLowerCase().includes(q) || c.name_en.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
                      hits.push({ label: (en ? c.name_en : c.name_ar) + ' (' + c.id + ')', url: drillUrl('customer', c.id) });
                    }
                  });
                  D.COMPANIES.forEach(function (c) {
                    if (c.name_ar.toLowerCase().includes(q) || c.name_en.toLowerCase().includes(q)) {
                      hits.push({ label: (en ? c.name_en : c.name_ar) + ' (' + c.id + ')', url: drillUrl('company', c.id) });
                    }
                  });
                  D.SALES_EMPLOYEES.forEach(function (e) {
                    if (e.name_ar.toLowerCase().includes(q) || e.name_en.toLowerCase().includes(q)) {
                      hits.push({ label: (en ? e.name_en : e.name_ar) + ' (' + e.id + ')', url: drillUrl('employee', e.id) });
                    }
                  });
                  D.EMP_TO_COMPANY_REQUESTS.forEach(function (r) {
                    if (r.subject_ar.toLowerCase().includes(q) || r.subject_en.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) {
                      hits.push({ label: (en ? r.subject_en : r.subject_ar) + ' (' + r.id + ')', url: drillUrl('request', r.id) });
                    }
                  });
                  gsPop.hidden = false;
                  gsPop.innerHTML = hits.length
                    ? hits.slice(0, 6).map(function (h) { return '<a href="' + AW.esc(h.url) + '" class="adm-search-hit">' + AW.esc(h.label) + '</a>'; }).join('')
                    : '<div class="sls-item-meta" style="padding:0.5rem;">' + AW.esc(en ? 'No matching records.' : 'لا توجد نتائج مطابقة.') + '</div>';
                });
                document.addEventListener('click', function (e) {
                  if (!closestEl(e.target, '.adm-global-search-wrap')) gsPop.hidden = true;
                });
                gsInput.addEventListener('keydown', function (e) {
                  if (e.key === 'Escape') gsPop.hidden = true;
                });
              }

              onEl('adm-mode-advanced', 'click', function () { state.mode = 'advanced'; applyLayoutAndCustomizeUI(); });
              onEl('adm-mode-executive', 'click', function () { state.mode = 'executive'; applyLayoutAndCustomizeUI(); });
              onEl('adm-data-mode', 'change', function () { state.dataMode = this.value; setupDataModeTimer(); renderDataStatusFooter(); });
              onEl('adm-focus-select', 'change', function () { state.focusSection = this.value; applyLayoutAndCustomizeUI(); });
              onEl('adm-refresh-all-btn', 'click', async function () {
                var synced = await syncLiveDatabase();
                state.lastUpdated = new Date().toISOString();
                renderAll();
                AW.showToast(synced
                  ? (AW.isEn() ? 'Control Center refreshed from live SQLite DB.' : 'تم تحديث مركز التحكم من قاعدة البيانات الحية.')
                  : (AW.isEn() ? 'Control Center refreshed (Simulated mode).' : 'تم تحديث مركز التحكم (وضع المحاكاة).'));
              });

              onEl('adm-saved-views-select', 'change', function () {
                var vid = this.value;
                var found = PRESET_VIEWS.concat(state.customViews).find(function (v) { return v.id === vid; });
                if (!found) return;
                state.activeViewId = found.id;
                state.layout.order = (found.order || DEFAULT_WIDGET_ORDER).slice();
                state.layout.hidden = (found.hidden || []).slice();
                state.layout.pinned = (found.pinned || []).slice();
                state.mode = found.id === 'exec_summary' ? 'executive' : 'advanced';
                saveLayoutState();
                renderAll();
              });

              onEl('adm-customize-btn', 'click', function () { state.customizeMode = !state.customizeMode; applyLayoutAndCustomizeUI(); });
              onEl('adm-cust-cancel-btn', 'click', function () { state.customizeMode = false; applyLayoutAndCustomizeUI(); });
              onEl('adm-cust-reset-btn', 'click', function () {
                state.layout = { order: DEFAULT_WIDGET_ORDER.slice(), hidden: [], pinned: [], collapsed: [], sizes: {}, kpis: DEFAULT_KPI_IDS.slice() };
                state.activeViewId = 'daily_ops';
                saveLayoutState();
                renderAll();
              });
              onEl('adm-cust-save-btn', 'click', function () {
                var nameInp = byId('adm-custom-view-name');
                var customName = nameInp ? nameInp.value.trim() : '';
                if (customName) {
                  var newId = 'custom_' + Date.now();
                  state.customViews.push({
                    id: newId, name: customName,
                    order: state.layout.order.slice(), hidden: state.layout.hidden.slice(),
                    pinned: state.layout.pinned.slice(), kpis: state.layout.kpis.slice()
                  });
                  state.activeViewId = newId;
                  if (nameInp) nameInp.value = '';
                }
                state.customizeMode = false;
                saveLayoutState();
                renderAll();
                AW.showToast(AW.isEn() ? 'Dashboard layout saved.' : 'تم حفظ تخصيص اللوحة بنجاح.');
              });

              onEl('adm-open-filters-btn', 'click', openFilterDialog);
              onEl('adm-flt-close', 'click', function () { var d = byId('adm-filter-dialog'); if (d) d.close(); });
              onEl('adm-kpilib-close', 'click', function () { var d = byId('adm-kpi-lib-dialog'); if (d) d.close(); });
              onEl('adm-compare-open-btn', 'click', openCompareDialog);
              onEl('adm-cmp-close', 'click', function () { var d = byId('adm-compare-dialog'); if (d) d.close(); });

              onEl('adm-confirm-dialog', 'close', function () {
                var rv = this.returnValue;
                this.returnValue = '';
                if (rv === 'confirm' && typeof state.pendingConfirmAction === 'function') {
                  state.pendingConfirmAction();
                }
                state.pendingConfirmAction = null;
              });

              var mainEl = byId('main-content');
              if (mainEl) {
                mainEl.addEventListener('click', function (e) {
                  var acFilter = closestEl(e.target, '[data-ac-filter]');
                  if (acFilter) { state.actionFilter = acFilter.getAttribute('data-ac-filter'); renderActionCenter(getFilteredData()); return; }

                  var acDo = closestEl(e.target, '[data-ac-do]');
                  if (acDo) {
                    var op = acDo.getAttribute('data-ac-do');
                    var id = acDo.getAttribute('data-id');
                    var item = state.actionItems.find(function (x) { return x.id === id; });
                    if (!item) return;
                    var en = AW.isEn();
                    setText('adm-cnf-title', en ? 'Confirm Administrative Action' : 'تأكيد الإجراء الإداري');
                    setText('adm-cnf-desc', (en ? 'Proceed with ' + op + ' on: ' : 'تأكيد تنفيذ (' + op + ') على: ') + (en ? item.title_en : item.title_ar));
                    state.pendingConfirmAction = function () {
                      item.status = op === 'approve' ? 'approved' : (op === 'reject' ? 'rejected' : 'info_requested');
                      renderAll();
                      AW.showToast(en ? 'Action recorded (simulated item).' : 'تم تسجيل الإجراء (عنصر محاكاة).');
                    };
                    var cnfDlg = byId('adm-confirm-dialog');
                    if (cnfDlg) cnfDlg.showModal();
                    return;
                  }

                  var anaRange = closestEl(e.target, '[data-ana-range]');
                  if (anaRange) { state.analyticsRange = anaRange.getAttribute('data-ana-range'); renderAnalyticsStudio(getFilteredData()); return; }

                  var anaTab = closestEl(e.target, '[data-ana-tab]');
                  if (anaTab) { state.analyticsTab = anaTab.getAttribute('data-ana-tab'); renderAnalyticsStudio(getFilteredData()); return; }

                  var lcStage = closestEl(e.target, '[data-lc-stage]');
                  if (lcStage) { state.selectedLifecycleStage = lcStage.getAttribute('data-lc-stage'); renderBusinessOverview(getFilteredData()); return; }

                  var geoReg = closestEl(e.target, '[data-geo-region]');
                  if (geoReg) { state.selectedGeoRegion = geoReg.getAttribute('data-geo-region'); renderAnalyticsStudio(getFilteredData()); return; }

                  if (closestEl(e.target, '#adm-sim-event-btn')) {
                    var enSim = AW.isEn();
                    var simId = 'EV-SIM-' + String(Date.now()).slice(-4);
                    D.ACTIVITY_FEED.unshift({
                      id: simId,
                      actor_ar: 'النظام (محاكاة)',
                      actor_en: 'System (Simulated)',
                      dept_ar: 'المتابعة',
                      dept_en: 'Operations',
                      action_ar: 'تحديث تشغيلي مباشر للوحة (عنصر محاكاة)',
                      action_en: 'Simulated live operational pulse update',
                      severity: 'low',
                      status: 'success',
                      source_ar: 'محاكي الأحداث',
                      source_en: 'Event Simulator',
                      timestamp: new Date().toISOString(),
                      entity_type: 'incident',
                      entity_id: simId
                    });
                    renderActivityFeed();
                    AW.showToast(enSim ? 'Simulated live event added.' : 'تمت إضافة حدث محاكاة مباشر.');
                    return;
                  }

                  var rankBtn = closestEl(e.target, '[data-rank-metric]');
                  if (rankBtn) { state.salesRankingMetric = rankBtn.getAttribute('data-rank-metric'); renderWorkforce(getFilteredData()); return; }

                  var evFilter = closestEl(e.target, '[data-ev-filter]');
                  if (evFilter) { state.activityFilter = evFilter.getAttribute('data-ev-filter'); renderActivityFeed(); return; }

                  if (closestEl(e.target, '#adm-load-more-act')) { state.activityLimit += 10; renderActivityFeed(); return; }

                  var empNotif = closestEl(e.target, '[data-emp-notify]');
                  if (empNotif) {
                    AW.showToast(AW.isEn() ? 'Notification queued for employee (Simulated).' : 'تم تجهيز إشعار للموظف (محاكاة).');
                    return;
                  }

                  var rmQf = closestEl(e.target, '[data-rm-qfilter]');
                  if (rmQf) {
                    state.filters.quick = state.filters.quick.filter(function (x) { return x !== rmQf.getAttribute('data-rm-qfilter'); });
                    saveFilterState(); renderAll(); return;
                  }
                  var rmRule = closestEl(e.target, '[data-rm-rule]');
                  if (rmRule) {
                    state.filters.rules.splice(Number(rmRule.getAttribute('data-rm-rule')), 1);
                    saveFilterState(); renderAll(); return;
                  }
                  if (closestEl(e.target, '#adm-clear-all-chips')) {
                    state.filters.quick = []; state.filters.rules = [];
                    saveFilterState(); renderAll(); return;
                  }

                  var wMove = closestEl(e.target, '[data-w-move]');
                  if (wMove) {
                    var wid = wMove.getAttribute('data-wid');
                    var dir = wMove.getAttribute('data-w-move');
                    var idx = state.layout.order.indexOf(wid);
                    if (dir === 'up' && idx > 0) {
                      state.layout.order.splice(idx, 1); state.layout.order.splice(idx - 1, 0, wid);
                    } else if (dir === 'down' && idx >= 0 && idx < state.layout.order.length - 1) {
                      state.layout.order.splice(idx, 1); state.layout.order.splice(idx + 1, 0, wid);
                    }
                    applyLayoutAndCustomizeUI(); return;
                  }
                  var wPin = closestEl(e.target, '[data-w-pin]');
                  if (wPin) {
                    var pid = wPin.getAttribute('data-w-pin');
                    var pIdx = state.layout.pinned.indexOf(pid);
                    if (pIdx >= 0) state.layout.pinned.splice(pIdx, 1); else state.layout.pinned.push(pid);
                    applyLayoutAndCustomizeUI(); return;
                  }
                  var wHide = closestEl(e.target, '[data-w-hide]');
                  if (wHide) {
                    var hid = wHide.getAttribute('data-w-hide');
                    if (state.layout.hidden.indexOf(hid) < 0) state.layout.hidden.push(hid);
                    applyLayoutAndCustomizeUI(); return;
                  }
                  var wShow = closestEl(e.target, '[data-w-show]');
                  if (wShow) {
                    var sid = wShow.getAttribute('data-w-show');
                    state.layout.hidden = state.layout.hidden.filter(function (x) { return x !== sid; });
                    applyLayoutAndCustomizeUI(); return;
                  }
                  var wCollapse = closestEl(e.target, '[data-w-collapse]');
                  if (wCollapse) {
                    var cid = wCollapse.getAttribute('data-w-collapse');
                    var cIdx = state.layout.collapsed.indexOf(cid);
                    if (cIdx >= 0) state.layout.collapsed.splice(cIdx, 1); else state.layout.collapsed.push(cid);
                    saveLayoutState(); applyLayoutAndCustomizeUI(); return;
                  }
                  var wSize = closestEl(e.target, '[data-w-size]');
                  if (wSize) {
                    var szId = wSize.getAttribute('data-w-size');
                    state.layout.sizes = state.layout.sizes || {};
                    state.layout.sizes[szId] = state.layout.sizes[szId] === 'compact' ? 'normal' : 'compact';
                    saveLayoutState(); applyLayoutAndCustomizeUI(); return;
                  }
                  var wRef = closestEl(e.target, '[data-w-refresh]');
                  if (wRef) {
                    syncLiveDatabase().then(function () {
                      state.lastUpdated = new Date().toISOString();
                      renderAll();
                      AW.showToast(AW.isEn() ? 'Section refreshed.' : 'تم تحديث القسم.');
                    }).catch(function (err) {
                      console.warn('[AdminControlCenter] Section refresh failed:', err && err.message ? err.message : err);
                    });
                    return;
                  }
                });

                mainEl.addEventListener('change', function (e) {
                  var st = closestEl(e.target, '[data-series-toggle]');
                  if (st) {
                    state.seriesVisible[st.getAttribute('data-series-toggle')] = st.checked;
                    renderAnalyticsStudio(getFilteredData());
                    return;
                  }
                  if (e.target.id === 'adm-ev-dept-sel') {
                    state.activityDept = e.target.value;
                    renderActivityFeed();
                    return;
                  }
                  if (e.target.id === 'adm-ev-actor-sel') {
                    state.activityActor = e.target.value;
                    renderActivityFeed();
                  }
                });

                function showChartTip(pt) {
                  var tipEl = byId('adm-chart-tooltip');
                  if (!tipEl || !pt) return;
                  tipEl.textContent = pt.getAttribute('data-tip') || '';
                  tipEl.hidden = false;
                }
                function hideChartTip() {
                  var tipEl = byId('adm-chart-tooltip');
                  if (tipEl) tipEl.hidden = true;
                }
                mainEl.addEventListener('mouseover', function (e) { var pt = closestEl(e.target, '.adm-chart-pt'); if (pt) showChartTip(pt); });
                mainEl.addEventListener('mouseout', function (e) { if (closestEl(e.target, '.adm-chart-pt')) hideChartTip(); });
                mainEl.addEventListener('focusin', function (e) { var pt = closestEl(e.target, '.adm-chart-pt'); if (pt) showChartTip(pt); });
                mainEl.addEventListener('focusout', function (e) { if (closestEl(e.target, '.adm-chart-pt')) hideChartTip(); });
                function showGeoTip(el) {
                  var tipEl = byId('adm-geo-tooltip');
                  if (!tipEl || !el) return;
                  tipEl.textContent = el.getAttribute('data-tip') || '';
                  tipEl.hidden = false;
                }
                function hideGeoTip() {
                  var tipEl = byId('adm-geo-tooltip');
                  if (tipEl) tipEl.hidden = true;
                }
                mainEl.addEventListener('mouseover', function (e) {
                  var pt = closestEl(e.target, '.adm-chart-pt');
                  if (pt) showChartTip(pt);
                  var geo = closestEl(e.target, '.adm-continent-group');
                  if (geo) showGeoTip(geo);
                });
                mainEl.addEventListener('mouseout', function (e) {
                  if (closestEl(e.target, '.adm-chart-pt')) hideChartTip();
                  if (closestEl(e.target, '.adm-continent-group')) hideGeoTip();
                });
                mainEl.addEventListener('focusin', function (e) {
                  var pt = closestEl(e.target, '.adm-chart-pt');
                  if (pt) showChartTip(pt);
                  var geo = closestEl(e.target, '.adm-continent-group');
                  if (geo) showGeoTip(geo);
                });
                mainEl.addEventListener('focusout', function (e) {
                  if (closestEl(e.target, '.adm-chart-pt')) hideChartTip();
                  if (closestEl(e.target, '.adm-continent-group')) hideGeoTip();
                });
                mainEl.addEventListener('keydown', function (e) {
                  if (e.key === 'Enter' || e.key === ' ') {
                    var geo = closestEl(e.target, '.adm-continent-group[data-geo-region]');
                    if (geo) {
                      e.preventDefault();
                      state.selectedGeoRegion = geo.getAttribute('data-geo-region');
                      renderAnalyticsStudio(getFilteredData());
                    }
                  }
                });
                mainEl.addEventListener('submit', function (e) {
                  if (e.target && e.target.id === 'adm-ai-quick-form') {
                    e.preventDefault();
                    var inp = byId('adm-ai-quick-input');
                    var q = inp ? inp.value.trim() : '';
                    window.location.href = q ? ('admin-ai-assistant.html?prompt=' + encodeURIComponent(q)) : 'admin-ai-assistant.html';
                  }
                });
              }

              AW.onRefresh(renderAll);
            });
          })();
