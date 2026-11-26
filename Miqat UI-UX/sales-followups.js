/* ==========================================================================
   Miqat Sales & Call Center CRM — Page 3: Follow-ups Workspace Controller
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;
  if (!WS) return;

  var todayIso = new Date().toISOString().slice(0, 10);

  var state = {
    q: '',
    status: 'all',
    priority: '',
    overdueBucket: '',
    companyId: '',
    programId: '',
    gov: '',
    source: '',
    dueDate: '',
    dueExact: '',
    sort: localStorage.getItem('sls_fup_sort') || 'priority',
    view: localStorage.getItem('sls_fup_view') || 'cards',
    calMode: 'month',
    calCursor: todayIso,
    calSelectedDate: todayIso,
    page: 1,
    pageSize: 12,
    selectedIds: new Set()
  };

  var data = null;
  var triggeredReminders = new Set();
  var toastTimer = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function loc(o, ar, en) {
    return o ? (WS.getLang() === 'en' ? (o[en] || o[ar] || '') : (o[ar] || o[en] || '')) : '';
  }

  function localeCode() {
    return WS.getLang() === 'ar' ? 'ar-EG' : 'en-US';
  }

  function fmtTs(iso) {
    if (!iso) return WS.t('fup_status_undated', 'بدون موعد');
    try {
      return new Date(iso).toLocaleString(localeCode(), {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (_) { return String(iso); }
  }

  function statusLabel(st) {
    var map = {
      scheduled: WS.t('fup_status_scheduled', 'مجدولة'),
      pending: WS.t('fup_status_scheduled', 'مجدولة'),
      overdue: WS.t('fup_status_overdue', 'متأخرة'),
      undated: WS.t('fup_status_undated', 'بدون موعد'),
      follow_without_due: WS.t('fup_status_undated', 'بدون موعد'),
      completed: WS.t('fup_status_completed', 'مكتملة'),
      cancelled: WS.t('fup_status_cancelled', 'ملغاة')
    };
    return map[st] || st || '—';
  }

  function priorityLabel(p) {
    var map = {
      urgent: WS.t('prio_urgent', 'عاجل'),
      high: WS.t('prio_high', 'مرتفع'),
      normal: WS.t('prio_normal', 'عادي'),
      medium: WS.t('prio_medium', 'متوسط'),
      low: WS.t('prio_low', 'منخفض')
    };
    return map[p] || p || '—';
  }

  function showToast(msg) {
    var el = document.getElementById('fup-toast');
    if (!el || !msg) return;
    el.textContent = msg;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  function waLink(phone) {
    var p = String(phone || '').replace(/\s+/g, '').replace(/^\+/, '');
    if (p.indexOf('0') === 0) p = '20' + p.slice(1);
    return p ? ('https://wa.me/' + encodeURIComponent(p)) : '#';
  }

  function buildSparkline(values, color) {
    var pts = (values && values.length) ? values : [0, 0, 0, 0, 0, 0];
    var max = Math.max.apply(null, pts.concat([1]));
    var w = 64, h = 22, step = pts.length > 1 ? w / (pts.length - 1) : w;
    var coords = pts.map(function (v, i) {
      var x = Math.round(i * step);
      var y = Math.round(h - 3 - ((v / max) * (h - 6)));
      return x + ',' + y;
    }).join(' ');
    return '<svg class="sls-kpi-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<polyline fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="' + coords + '"></polyline>' +
    '</svg>';
  }

  function buildMiniBars(vals) {
    var arr = (vals && vals.length) ? vals : [1, 1, 1, 1];
    var max = Math.max.apply(null, arr.concat([1]));
    return '<span class="sls-kpi-mini-bars" aria-hidden="true">' + arr.map(function (v) {
      var pct = Math.max(18, Math.round((v / max) * 100));
      return '<span class="sls-kpi-mini-bar" style="height:' + pct + '%;"></span>';
    }).join('') + '</span>';
  }

  function buildQuery() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.status && state.status !== 'all') p.set('status', state.status);
    if (state.priority) p.set('priority', state.priority);
    if (state.overdueBucket) p.set('overdueBucket', state.overdueBucket);
    if (state.companyId) p.set('companyId', state.companyId);
    if (state.programId) p.set('programId', state.programId);
    if (state.gov) p.set('gov', state.gov);
    if (state.source) p.set('source', state.source);
    if (state.dueDate === 'today') p.set('dueDate', 'today');
    else if (state.dueExact) { p.set('dueDate', 'custom'); p.set('dueExact', state.dueExact); }
    if (state.sort) p.set('sort', state.sort);
    var qs = p.toString();
    return qs ? ('?' + qs) : '';
  }

  function renderAnalytics() {
    var a = data.analytics || {};
    var g = data.globalCounts || {};
    var trends = a.trends || [];
    var totalBase = Math.max(1, g.all || a.total || 1);
    var pctOf = function (n) { return WS.formatNumber(Math.round(((n || 0) / totalBase) * 100)) + '%'; };

    var icons = {
      list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
      clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
      upcoming: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
      alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      inbox: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"></path></svg>',
      target: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'
    };

    var cards = [
      {
        key: 'all',
        active: state.status === 'all' && !state.dueDate,
        icon: icons.list,
        label: WS.t('fup_kpi_total', 'إجمالي المتابعات'),
        val: WS.formatNumber(a.total || 0),
        pill: WS.formatNumber(g.all || a.total || 0) + ' ' + WS.t('fup_status_all', 'الكل'),
        spark: trends.map(function (t) { return t.total; }),
        color: '#28577D',
        sub: WS.t('fup_kpi_all_sub', 'كافة المتابعات المسجلة')
      },
      {
        key: 'today',
        active: state.dueDate === 'today',
        icon: icons.clock,
        label: WS.t('fup_kpi_due_today', 'مستحقة اليوم'),
        val: WS.formatNumber(a.dueToday || 0),
        pill: pctOf(a.dueToday),
        spark: trends.map(function (t) { return t.due; }),
        color: '#D1B16C',
        sub: WS.t('fup_kpi_today_sub', 'مواعيد مستحقة اليوم')
      },
      {
        key: 'scheduled',
        active: state.status === 'scheduled' && !state.dueDate,
        icon: icons.upcoming,
        label: WS.t('fup_kpi_upcoming', 'قادمة'),
        val: WS.formatNumber(a.upcoming || 0),
        pill: pctOf(a.upcoming),
        miniBars: [g.dueToday || 0, a.upcoming || 0, a.completed || 0, a.undated || 0],
        sub: WS.t('fup_kpi_upcoming_sub', 'مواعيد مجدولة قادمة')
      },
      {
        key: 'overdue',
        active: state.status === 'overdue',
        icon: icons.alert,
        label: WS.t('fup_status_overdue', 'متأخرة'),
        val: WS.formatNumber(a.overdue || 0),
        pill: WS.formatNumber(a.avgDelayHours || 0) + ' ' + WS.t('fup_avg_delay_unit', 'س متوسط التأخير'),
        spark: trends.map(function (t) { return t.overdue; }),
        color: '#D1B16C',
        sub: WS.t('fup_kpi_overdue_sub', 'تحتاج معالجة فورية')
      },
      {
        key: 'completed',
        active: state.status === 'completed',
        icon: icons.check,
        label: WS.t('fup_status_completed', 'مكتملة'),
        val: WS.formatNumber(a.completed || 0),
        pill: pctOf(a.completed),
        spark: trends.map(function (t) { return t.completed; }),
        color: '#0F253B',
        sub: WS.t('fup_kpi_completed_sub', 'تم إغلاقها بنجاح')
      },
      {
        key: 'undated',
        active: state.status === 'undated',
        icon: icons.inbox,
        label: WS.t('kpi_undated', 'بدون موعد'),
        val: WS.formatNumber(a.undated || 0),
        pill: pctOf(a.undated),
        miniBars: [a.undated || 0, a.upcoming || 0, a.overdue || 0, a.completed || 0],
        sub: WS.t('fup_kpi_undated_sub', 'بانتظار تحديد موعد')
      },
      {
        key: 'ontime',
        active: state.sort === 'most_overdue',
        icon: icons.target,
        label: WS.t('fup_kpi_ontime', 'الالتزام بالموعد'),
        val: WS.formatNumber(a.onTimeCompletionRate || 0) + '%',
        pill: WS.formatNumber(a.avgDelayHours || 0) + ' ' + WS.t('fup_avg_delay_unit', 'س متوسط التأخير'),
        isTarget: true,
        targetVal: a.onTimeCompletionRate || 0,
        sub: WS.t('fup_contact_rate', 'نسبة التواصل الناجح') + ': ' + WS.formatNumber(a.contactRate || 0) + '%'
      }
    ];

    document.getElementById('fup-analytics-kpis').innerHTML = cards.map(function (c) {
      var visual = c.spark ? buildSparkline(c.spark, c.color) : (c.miniBars ? buildMiniBars(c.miniBars) : '');
      var progressHtml = c.isTarget
        ? '<progress class="sls-progress" value="' + esc(c.targetVal) + '" max="100"></progress>'
        : '';
      return '<button type="button" class="sls-kpi-ref-card' + (c.active ? ' is-active' : '') + '" data-kpi-filter="' + esc(c.key) + '">' +
        '<div class="sls-kpi-head-row">' +
          '<div class="sls-kpi-title-wrap"><span class="sls-kpi-icon-badge">' + c.icon + '</span><span class="sls-kpi-label">' + esc(c.label) + '</span></div>' +
          '<span class="sls-kpi-trend-pill">' + esc(c.pill) + '</span>' +
        '</div>' +
        '<div class="sls-kpi-main-row">' +
          '<strong class="sls-kpi-val-lg">' + esc(c.val) + '</strong>' +
          visual +
        '</div>' +
        progressHtml +
        '<span class="sls-kpi-trend">' + esc(c.sub) + '</span>' +
      '</button>';
    }).join('');

    // Donut: Completed vs Overdue vs Upcoming
    var total = Math.max(1, (a.completed || 0) + (a.overdue || 0) + (a.upcoming || 0));
    var segs = [
      { label: WS.t('fup_status_completed'), val: a.completed || 0, color: '#0F253B' },
      { label: WS.t('fup_status_overdue'), val: a.overdue || 0, color: '#D1B16C' },
      { label: WS.t('fup_status_scheduled'), val: a.upcoming || 0, color: '#28577D' }
    ];
    var r = 48, circ = 2 * Math.PI * r, off = 0;
    var circles = segs.map(function (s) {
      var len = (s.val / total) * circ;
      var el = '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="16" stroke-dasharray="' + len.toFixed(1) + ' ' + circ.toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 60 60)"></circle>';
      off += len;
      return el;
    }).join('');
    document.getElementById('fup-donut-chart').innerHTML =
      '<svg width="120" height="120" viewBox="0 0 120 120">' + circles +
        '<text x="60" y="64" text-anchor="middle" font-size="18" font-weight="800" fill="var(--color-text)">' + esc(WS.formatNumber(a.total || 0)) + '</text>' +
      '</svg>' +
      '<div class="sls-chart-legend" style="flex-direction:column; gap:0.35rem;">' +
        segs.map(function (s) { return '<span><i class="sls-legend-dot" style="background:' + s.color + ';"></i>' + esc(s.label) + ': <strong>' + esc(WS.formatNumber(s.val)) + '</strong></span>'; }).join('') +
      '</div>';

    // Outcomes & Conversion Bar
    var rows = [
      { label: WS.t('fup_contact_rate', 'نسبة التواصل الناجح'), val: a.contactRate || 0, display: WS.formatNumber(a.contactRate || 0) + '%' },
      { label: WS.t('fup_booking_conv', 'معدل التحويل للحجز'), val: a.conversionToBookingRate || 0, display: WS.formatNumber(a.conversionToBookingRate || 0) + '% (' + WS.formatNumber(a.bookedCount || 0) + ')' }
    ];
    document.getElementById('fup-outcomes-chart').innerHTML = '<div class="sls-chart-list">' + rows.map(function (rw) {
      return '<div class="sls-bar-row"><div class="sls-bar-head"><span>' + esc(rw.label) + '</span><span>' + esc(rw.display) + '</span></div>' +
        '<div class="sls-bar-track"><div class="sls-bar-fill" style="inline-size:' + rw.val + '%"></div></div></div>';
    }).join('') + '</div>';

    var badge = document.getElementById('sls-header-fup-badge');
    if (badge) {
      var alertCnt = (a.dueToday || 0) + (a.overdue || 0);
      badge.textContent = WS.formatNumber(alertCnt);
      badge.hidden = alertCnt <= 0;
    }
  }

  function renderStatusGroups() {
    var bar = document.getElementById('fup-status-groups-bar');
    if (!bar) return;
    var g = data.globalCounts || {};
    var total = Math.max(1, g.all || 1);
    var groups = [
      { key: 'overdue', label: WS.t('fup_status_overdue', 'متأخرة'), cnt: g.overdue || 0, pill: 'status-pill-amber' },
      { key: 'scheduled', label: WS.t('fup_status_scheduled', 'مجدولة'), cnt: g.scheduled || 0, pill: 'status-pill-navy' },
      { key: 'undated', label: WS.t('fup_status_undated', 'بدون موعد'), cnt: g.undated || 0, pill: 'status-pill-blue' },
      { key: 'completed', label: WS.t('fup_status_completed', 'مكتملة'), cnt: g.completed || 0, pill: 'status-pill-slate' },
      { key: 'cancelled', label: WS.t('fup_status_cancelled', 'ملغاة'), cnt: g.cancelled || 0, pill: 'status-pill-slate' }
    ];
    bar.innerHTML = groups.map(function (gr) {
      var share = Math.round((gr.cnt / total) * 100);
      var active = state.status === gr.key ? ' is-active' : '';
      return '<button type="button" class="sls-status-group-card' + active + '" data-group-filter="' + esc(gr.key) + '">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem;">' +
          '<span class="sls-kpi-label">' + esc(gr.label) + '</span>' +
          '<span class="status-pill ' + gr.pill + '">' + esc(WS.formatNumber(gr.cnt)) + '</span>' +
        '</div>' +
        '<span class="sls-item-meta">' + esc(WS.formatNumber(share)) + '% ' + esc(WS.t('fup_share_of_total', 'من الإجمالي')) + '</span>' +
      '</button>';
    }).join('');
  }

  function renderFollowupCard(f, isTodayFocus) {
    var cname = loc(f, 'customer_name_ar', 'customer_name_en');
    var checked = state.selectedIds.has(f.id) ? ' checked' : '';
    var pillCls = f.effectiveStatus === 'overdue' ? 'status-pill-amber' : (f.effectiveStatus === 'completed' || f.effectiveStatus === 'cancelled' ? 'status-pill-slate' : 'status-pill-navy');
    var detailsHref = 'sales-followup-details.html?id=' + encodeURIComponent(f.id);
    var custHref = 'sales-customer-details.html?id=' + encodeURIComponent(f.customer_id);
    var callHref = 'sales-call-log.html?customerId=' + encodeURIComponent(f.customer_id);
    var fupFormHref = 'sales-followup-form.html?customerId=' + encodeURIComponent(f.customer_id);

    var extraActions = isTodayFocus
      ? '<a href="' + fupFormHref + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('fup_followup_customer', 'متابعة العميل')) + '</a>' +
        '<a href="' + callHref + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('fup_call_customer', 'اتصال بالعميل')) + '</a>' +
        '<a href="' + waLink(f.customer_phone) + '" target="_blank" rel="noopener" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('action_whatsapp', 'واتساب')) + '</a>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-preview-fup="' + esc(f.id) + '">' + esc(WS.t('fup_quick_preview', 'معاينة سريعة')) + '</button>'
      : '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-preview-fup="' + esc(f.id) + '">' + esc(WS.t('fup_quick_preview', 'معاينة سريعة')) + '</button>';

    return '<article class="sls-sub-card is-clickable" data-card-href="' + detailsHref + '" tabindex="0">' +
      '<div style="display:flex; justify-content:space-between; gap:0.4rem; align-items:flex-start;">' +
        '<label class="sls-ms-item" style="align-items:flex-start;">' +
          '<input type="checkbox" data-sel-fup="' + esc(f.id) + '"' + checked + '>' +
          '<div>' +
            '<a href="' + custHref + '" class="sls-item-title" style="color:var(--color-link); text-decoration:none; display:inline-block;">' + esc(cname) + '</a>' +
            '<div class="sls-item-meta"><bdi dir="ltr">' + esc(f.customer_phone) + '</bdi> • ' + esc(loc(f, 'program_title_ar', 'program_title_en')) + '</div>' +
          '</div>' +
        '</label>' +
        '<span class="status-pill ' + pillCls + '">' + esc(priorityLabel(f.priority)) + '</span>' +
      '</div>' +
      '<div class="sls-item-meta">' + esc(f.purpose ? (f.purpose + (f.notes ? ' — ' + f.notes : '')) : (f.notes || '—')) + '</div>' +
      '<div class="sls-item-meta" style="display:flex; justify-content:space-between; gap:0.4rem; flex-wrap:wrap;">' +
        '<span><bdi dir="ltr">' + esc(fmtTs(f.due_at)) + '</bdi>' + (f.overdueHours ? (' • ' + esc(WS.formatNumber(f.overdueHours)) + 'h') : '') + '</span>' +
        '<span class="status-pill status-pill-slate">' + esc(statusLabel(f.effectiveStatus)) + '</span>' +
      '</div>' +
      (f.cancel_reason ? ('<div class="sls-item-meta">' + esc(WS.t('cancel_reason_lbl')) + ': ' + esc(f.cancel_reason) + '</div>') : '') +
      '<div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-block-start:auto; padding-block-start:0.45rem; border-top:1px solid var(--color-border-subtle);">' +
        '<a href="' + detailsHref + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('fup_view_details', 'عرض التفاصيل')) + '</a>' +
        extraActions +
        (f.effectiveStatus === 'overdue' ? '<a href="sales-followup-form.html?customerId=' + encodeURIComponent(f.customer_id) + '&overdueId=' + encodeURIComponent(f.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('btn_process_overdue')) + '</a>' : '') +
        (f.effectiveStatus !== 'completed' && f.effectiveStatus !== 'cancelled' ? '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-complete-fup="' + esc(f.id) + '">' + esc(WS.t('fup_mark_done')) + '</button>' : '') +
        '<a href="sales-followup-form.html?customerId=' + encodeURIComponent(f.customer_id) + '&rescheduleId=' + encodeURIComponent(f.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('btn_reschedule')) + '</a>' +
      '</div>' +
    '</article>';
  }

  function renderTodayFocus() {
    var tf = data.todayFocus || { items: [], suggestedNext: null };
    document.getElementById('fup-suggested-next').textContent = tf.suggestedNext
      ? (WS.t('fup_suggested_prefix', 'أولوية مقترحة الآن:') + ' ' + loc(tf.suggestedNext, 'customer_name_ar', 'customer_name_en'))
      : '';
    document.getElementById('fup-today-grid').innerHTML = tf.items.length
      ? tf.items.map(function (item) { return renderFollowupCard(item, true); }).join('')
      : '<p class="sls-item-meta">' + esc(WS.t('empty_followups')) + '</p>';
  }

  function renderActiveChips() {
    var listEl = document.getElementById('fup-chips-list');
    if (!listEl) return;
    var chips = [];
    if (state.q) chips.push({ key: 'q', label: state.q });
    if (state.status && state.status !== 'all') chips.push({ key: 'status', label: WS.t('fup_status', 'الحالة') + ': ' + statusLabel(state.status) });
    if (state.dueDate === 'today') chips.push({ key: 'dueDate', label: WS.t('fup_kpi_due_today', 'مستحقة اليوم') });
    if (state.priority) chips.push({ key: 'priority', label: WS.t('fup_lbl_priority', 'الأولوية') + ': ' + priorityLabel(state.priority) });
    if (state.overdueBucket) chips.push({ key: 'overdueBucket', label: WS.t('overdue_' + state.overdueBucket, state.overdueBucket) });
    if (state.companyId) chips.push({ key: 'companyId', label: WS.t('cust_company', 'الشركة') + ': ' + state.companyId });
    if (state.programId) chips.push({ key: 'programId', label: WS.t('cust_program', 'البرنامج') + ': ' + state.programId });
    if (state.gov) chips.push({ key: 'gov', label: WS.t('geo_' + state.gov, state.gov) });
    if (state.source) chips.push({ key: 'source', label: WS.t('src_' + state.source, state.source) });
    if (state.dueExact) chips.push({ key: 'dueExact', label: state.dueExact });

    listEl.innerHTML = chips.map(function (ch) {
      return '<button type="button" class="sls-filter-chip" data-remove-chip="' + esc(ch.key) + '">' + esc(ch.label) + ' <span aria-hidden="true">×</span></button>';
    }).join('');
  }

  function renderCalendar() {
    var body = document.getElementById('fup-calendar-body');
    if (!body) return;

    document.querySelectorAll('#cal-mode-pills [data-cal]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-cal') === state.calMode);
    });

    var dated = (data.items || []).filter(function (f) { return Boolean(f.due_at); });
    var byDate = new Map();
    dated.forEach(function (f) {
      var d = f.due_at.slice(0, 10);
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d).push(f);
    });

    var cursor = new Date(state.calCursor + 'T00:00:00');
    if (Number.isNaN(cursor.getTime())) cursor = new Date();
    var monthLabel = cursor.toLocaleDateString(localeCode(), { month: 'long', year: 'numeric' });

    var toolbar = '<div class="sls-cal-toolbar">' +
      '<div style="display:flex; gap:0.4rem; align-items:center;">' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="cal-prev-btn">' + esc(WS.t('cal_prev', 'السابق')) + '</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="cal-today-btn">' + esc(WS.t('cal_today', 'اليوم')) + '</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="cal-next-btn">' + esc(WS.t('cal_next', 'التالي')) + '</button>' +
      '</div>' +
      '<strong>' + esc(monthLabel) + '</strong>' +
    '</div>';

    var gridHtml = '';
    if (state.calMode === 'month' || state.calMode === 'week') {
      var days = [];
      if (state.calMode === 'month') {
        var yr = cursor.getFullYear(), mo = cursor.getMonth();
        var first = new Date(yr, mo, 1);
        var startOff = first.getDay();
        var start = new Date(yr, mo, 1 - startOff);
        for (var i = 0; i < 35; i++) {
          var cellD = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
          days.push({ iso: cellD.toISOString().slice(0, 10), num: cellD.getDate(), muted: cellD.getMonth() !== mo });
        }
      } else {
        var wd = cursor.getDay();
        var wkStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - wd);
        for (var j = 0; j < 7; j++) {
          var wdD = new Date(wkStart.getFullYear(), wkStart.getMonth(), wkStart.getDate() + j);
          days.push({ iso: wdD.toISOString().slice(0, 10), num: wdD.getDate(), muted: false });
        }
      }

      var weekHeaders = [];
      for (var w = 0; w < 7; w++) {
        var refDay = new Date(2026, 10, 22 + w); // Nov 22 2026 is Sunday
        weekHeaders.push(refDay.toLocaleDateString(localeCode(), { weekday: 'short' }));
      }

      gridHtml = '<div class="sls-cal-grid-7">' +
        weekHeaders.map(function (wh) { return '<div class="sls-cal-weekday">' + esc(wh) + '</div>'; }).join('') +
        days.map(function (d) {
          var list = byDate.get(d.iso) || [];
          var selCls = d.iso === state.calSelectedDate ? ' is-selected' : '';
          var mutCls = d.muted ? ' is-muted' : '';
          var pills = list.slice(0, 2).map(function (f) {
            return '<a href="sales-followup-details.html?id=' + encodeURIComponent(f.id) + '" class="sls-cal-pill">' + esc(loc(f, 'customer_name_ar', 'customer_name_en')) + '</a>';
          }).join('');
          return '<div class="sls-cal-cell' + selCls + mutCls + '" role="button" tabindex="0" data-cal-date="' + esc(d.iso) + '">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<strong>' + esc(WS.formatNumber(d.num)) + '</strong>' +
              (list.length ? '<span class="status-pill status-pill-navy">' + esc(WS.formatNumber(list.length)) + '</span>' : '') +
            '</div>' +
            pills +
          '</div>';
        }).join('') +
      '</div>';
    } else if (state.calMode === 'day') {
      state.calSelectedDate = state.calCursor;
    } else if (state.calMode === 'agenda') {
      var dates = Array.from(byDate.keys()).sort();
      gridHtml = dates.length
        ? '<div class="sls-cards-grid">' + dates.map(function (d) {
            var list = byDate.get(d);
            return '<div class="sls-sub-card"><strong><bdi dir="ltr">' + esc(d) + '</bdi> (' + esc(WS.formatNumber(list.length)) + ')</strong>' +
              list.map(function (f) {
                return '<a href="sales-followup-details.html?id=' + encodeURIComponent(f.id) + '" class="sls-list-item ' + (f.effectiveStatus === 'overdue' ? 'is-highlight' : '') + '" style="text-decoration:none; color:inherit;">' +
                  '<span class="sls-item-title">' + esc(loc(f, 'customer_name_ar', 'customer_name_en')) + '</span><span class="status-pill status-pill-slate">' + esc(statusLabel(f.effectiveStatus)) + '</span></a>';
              }).join('') + '</div>';
          }).join('') + '</div>'
        : '<p class="sls-item-meta">' + esc(WS.t('empty_followups')) + '</p>';
    }

    var selectedList = byDate.get(state.calSelectedDate) || [];
    var dayPanel = state.calMode !== 'agenda'
      ? '<div style="margin-block-start:1rem; padding-block-start:0.85rem; border-top:1px solid var(--color-border-subtle);">' +
          '<h3 class="sls-card-title" style="margin-block-end:0.6rem;">' + esc(WS.t('cal_selected_day', 'مواعيد اليوم المحدد')) + ': <bdi dir="ltr">' + esc(state.calSelectedDate) + '</bdi></h3>' +
          (selectedList.length
            ? '<div class="sls-cards-grid">' + selectedList.map(function (f) { return renderFollowupCard(f, false); }).join('') + '</div>'
            : '<p class="sls-item-meta">' + esc(WS.t('cal_no_appts', 'لا توجد مواعيد في هذا اليوم.')) + '</p>') +
        '</div>'
      : '';

    body.innerHTML = toolbar + gridHtml + dayPanel;
  }

  function renderPagination(totalItems) {
    var bar = document.getElementById('fup-pagination-bar');
    if (!bar) return;
    if (state.view === 'calendar' || totalItems <= state.pageSize) {
      bar.hidden = true;
      return;
    }
    var totalPages = Math.max(1, Math.ceil(totalItems / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    bar.hidden = false;
    bar.innerHTML =
      '<span class="sls-item-meta">' + esc(WS.t('fup_page_of', 'صفحة')) + ' ' + esc(WS.formatNumber(state.page)) + ' / ' + esc(WS.formatNumber(totalPages)) + ' (' + esc(WS.formatNumber(totalItems)) + ')</span>' +
      '<div style="display:flex; gap:0.45rem;">' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="fup-page-prev"' + (state.page <= 1 ? ' disabled' : '') + '>' + esc(WS.t('fup_prev_page', 'السابق')) + '</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="fup-page-next"' + (state.page >= totalPages ? ' disabled' : '') + '>' + esc(WS.t('fup_next_page', 'التالي')) + '</button>' +
      '</div>';
  }

  function renderViews() {
    if (!data || !data.groups) return;
    var g = data.groups;
    document.getElementById('fup-result-count').textContent = WS.t('flt_summary_prefix') + ': ' + WS.formatNumber(data.items.length);
    renderActiveChips();

    var calSec = document.getElementById('fup-calendar-section');
    var tblSec = document.getElementById('fup-table-section');
    var grpSec = document.getElementById('fup-groups-container');

    calSec.hidden = state.view !== 'calendar';
    tblSec.hidden = state.view !== 'table';
    grpSec.hidden = state.view !== 'cards';

    var startIdx = (state.page - 1) * state.pageSize;
    var pagedItems = data.items.slice(startIdx, startIdx + state.pageSize);
    renderPagination(data.items.length);

    if (state.view === 'table') {
      tblSec.innerHTML = pagedItems.length ? '<table class="sls-table"><thead><tr>' +
        '<th></th><th>' + esc(WS.t('tbl_customer')) + '</th><th>' + esc(WS.t('lbl_status')) + '</th><th>' + esc(WS.t('fup_lbl_priority')) + '</th><th>' + esc(WS.t('fup_lbl_due')) + '</th><th>' + esc(WS.t('lbl_actions')) + '</th>' +
      '</tr></thead><tbody>' + pagedItems.map(function (f) {
        var detailsHref = 'sales-followup-details.html?id=' + encodeURIComponent(f.id);
        return '<tr class="is-clickable" data-card-href="' + detailsHref + '">' +
          '<td><input type="checkbox" data-sel-fup="' + esc(f.id) + '"' + (state.selectedIds.has(f.id) ? ' checked' : '') + '></td>' +
          '<td><strong>' + esc(loc(f, 'customer_name_ar', 'customer_name_en')) + '</strong></td>' +
          '<td><span class="status-pill status-pill-navy">' + esc(statusLabel(f.effectiveStatus)) + '</span></td>' +
          '<td>' +
            '<select class="acc-filter-select" style="width:auto; padding:0.2rem 0.45rem;" data-quick-prio="' + esc(f.id) + '" aria-label="Priority">' +
              '<option value="normal"' + (f.priority === 'normal' ? ' selected' : '') + '>' + esc(priorityLabel('normal')) + '</option>' +
              '<option value="high"' + (f.priority === 'high' ? ' selected' : '') + '>' + esc(priorityLabel('high')) + '</option>' +
              '<option value="urgent"' + (f.priority === 'urgent' ? ' selected' : '') + '>' + esc(priorityLabel('urgent')) + '</option>' +
            '</select>' +
          '</td>' +
          '<td><bdi dir="ltr">' + esc(fmtTs(f.due_at)) + '</bdi></td>' +
          '<td><a href="' + detailsHref + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('fup_view_details', 'عرض التفاصيل')) + '</a></td></tr>';
      }).join('') + '</tbody></table>' : '<p class="sls-item-meta">' + esc(WS.t('empty_followups')) + '</p>';
      return;
    }

    if (state.view === 'calendar') {
      renderCalendar();
      return;
    }

    // Cards View: 5 Independent Sections
    document.getElementById('cnt-overdue').textContent = WS.formatNumber(g.overdue.length);
    var buckets = g.overdueBuckets || {};
    var bHtml = [
      { key: 'lt_1h', label: WS.t('overdue_lt_1h', 'أقل من ساعة'), list: buckets.lt_1h || [] },
      { key: '1_24h', label: WS.t('overdue_1_24h', '١ إلى ٢٤ ساعة'), list: buckets['1_24h'] || [] },
      { key: '1_3d', label: WS.t('overdue_1_3d', '١ إلى ٣ أيام'), list: buckets['1_3d'] || [] },
      { key: 'gt_3d', label: WS.t('overdue_gt_3d', 'أكثر من ٣ أيام'), list: buckets.gt_3d || [] }
    ].filter(function (b) { return b.list.length > 0; }).map(function (b) {
      return '<div style="margin-block-end:0.85rem;"><strong class="sls-item-meta">' + esc(b.label) + ' (' + esc(WS.formatNumber(b.list.length)) + ')</strong><div class="sls-cards-grid" style="margin-block-start:0.4rem;">' + b.list.map(function (item) { return renderFollowupCard(item, false); }).join('') + '</div></div>';
    }).join('');
    document.getElementById('sec-overdue-body').innerHTML = bHtml || '<p class="sls-item-meta">—</p>';

    document.getElementById('cnt-scheduled').textContent = WS.formatNumber(g.scheduled.length);
    document.getElementById('sec-scheduled-body').innerHTML = g.scheduled.length ? g.scheduled.map(function (item) { return renderFollowupCard(item, false); }).join('') : '<p class="sls-item-meta">—</p>';

    document.getElementById('cnt-undated').textContent = WS.formatNumber(g.undated.length);
    document.getElementById('sec-undated-body').innerHTML = g.undated.length ? g.undated.map(function (item) { return renderFollowupCard(item, false); }).join('') : '<p class="sls-item-meta">—</p>';

    document.getElementById('cnt-completed').textContent = WS.formatNumber(g.completed.length);
    document.getElementById('sec-completed-body').innerHTML = g.completed.length ? g.completed.map(function (item) { return renderFollowupCard(item, false); }).join('') : '<p class="sls-item-meta">—</p>';

    document.getElementById('cnt-cancelled').textContent = WS.formatNumber(g.cancelled.length);
    document.getElementById('sec-cancelled-body').innerHTML = g.cancelled.length ? g.cancelled.map(function (item) { return renderFollowupCard(item, false); }).join('') : '<p class="sls-item-meta">—</p>';

    // Highlight or hide sections when a specific status is filtered
    document.querySelectorAll('#fup-groups-container [data-group-sec]').forEach(function (sec) {
      var key = sec.getAttribute('data-group-sec');
      sec.hidden = Boolean(state.status && state.status !== 'all' && state.status !== key);
    });
  }

  function hydrateCatalogAndSavedFilters() {
    if (data.filterCatalog) {
      var cSel = document.getElementById('fup-flt-company');
      var pSel = document.getElementById('fup-flt-program');
      cSel.innerHTML = '<option value="">' + esc(WS.t('flt_all_companies')) + '</option>' +
        data.filterCatalog.companies.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === state.companyId ? ' selected' : '') + '>' + esc(loc(c, 'name_ar', 'name_en')) + '</option>'; }).join('');
      var progs = data.filterCatalog.programs.filter(function (p) { return !state.companyId || p.company_id === state.companyId; });
      pSel.innerHTML = '<option value="">' + esc(WS.t('flt_all_programs')) + '</option>' +
        progs.map(function (p) { return '<option value="' + esc(p.id) + '"' + (p.id === state.programId ? ' selected' : '') + '>' + esc(loc(p, 'title_ar', 'title_en')) + '</option>'; }).join('');
    }
    var sfSel = document.getElementById('fup-saved-select');
    sfSel.innerHTML = '<option value="">' + esc(WS.t('fup_saved_filters')) + '</option>' +
      (data.savedFilters || []).map(function (sf) { return '<option value="' + esc(sf.id) + '">' + esc(sf.name) + '</option>'; }).join('');
  }

  function checkRemindersAndSnooze() {
    var nowMs = Date.now();
    var active = (data.items || []).filter(function (f) { return f.effectiveStatus === 'scheduled' || f.effectiveStatus === 'overdue'; });
    var target = active.find(function (f) {
      if (!f.due_at || triggeredReminders.has(f.id)) return false;
      var diffMin = (Date.parse(f.due_at) - nowMs) / 60000;
      return diffMin <= 15;
    });
    var pop = document.getElementById('sls-reminder-popover');
    if (target && pop && (!pop.dataset.snoozedUntil || Number(pop.dataset.snoozedUntil) <= nowMs)) {
      triggeredReminders.add(target.id);
      pop.innerHTML = '<strong>' + esc(loc(target, 'customer_name_ar', 'customer_name_en')) + '</strong>' +
        '<p style="margin:0.3rem 0; font-size:0.84rem;">' + esc(target.notes || '') + '</p>' +
        '<div style="display:flex; gap:0.35rem; flex-wrap:wrap;">' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-snooze="5">' + esc(WS.t('fup_snooze_5', 'تأجيل ٥ د')) + '</button>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-snooze="10">' + esc(WS.t('fup_snooze_10', 'تأجيل ١٠ د')) + '</button>' +
          '<a href="sales-followup-details.html?id=' + encodeURIComponent(target.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('fup_view_details', 'عرض التفاصيل')) + '</a>' +
        '</div>';
      try { if (!pop.matches(':popover-open')) pop.showPopover(); } catch (_) {}
      pop.querySelectorAll('[data-snooze]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          pop.dataset.snoozedUntil = String(Date.now() + Number(btn.getAttribute('data-snooze')) * 60000);
          try { pop.hidePopover(); } catch (_) {}
        });
      });
    }
  }

  function openQuickPreview(fupId) {
    var f = (data.items || []).find(function (x) { return x.id === fupId; });
    if (!f) return;
    var dlg = document.getElementById('fup-preview-dialog');
    document.getElementById('fup-prev-title').textContent = loc(f, 'customer_name_ar', 'customer_name_en');
    document.getElementById('fup-prev-body').innerHTML =
      '<div class="sls-item-meta"><strong>' + esc(WS.t('cust_phone', 'الهاتف')) + ':</strong> <bdi dir="ltr">' + esc(f.customer_phone) + '</bdi></div>' +
      '<div class="sls-item-meta"><strong>' + esc(WS.t('cust_company', 'الشركة')) + ':</strong> ' + esc(loc(f, 'company_name_ar', 'company_name_en')) + ' — ' + esc(loc(f, 'program_title_ar', 'program_title_en')) + '</div>' +
      '<div class="sls-item-meta"><strong>' + esc(WS.t('fup_status', 'الحالة')) + ':</strong> ' + esc(statusLabel(f.effectiveStatus)) + ' • <strong>' + esc(WS.t('fup_lbl_priority', 'الأولوية')) + ':</strong> ' + esc(priorityLabel(f.priority)) + '</div>' +
      '<div class="sls-item-meta"><strong>' + esc(WS.t('fup_lbl_due', 'موعد المتابعة')) + ':</strong> <bdi dir="ltr">' + esc(fmtTs(f.due_at)) + '</bdi></div>' +
      '<div class="sls-item-meta"><strong>' + esc(WS.t('fup_lbl_notes', 'الملاحظات')) + ':</strong> ' + esc(f.notes || '—') + '</div>' +
      '<div style="display:flex; flex-wrap:wrap; gap:0.45rem; margin-top:0.5rem;">' +
        '<a href="sales-followup-details.html?id=' + encodeURIComponent(f.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(WS.t('fup_view_details', 'عرض التفاصيل')) + '</a>' +
        '<a href="sales-customer-details.html?id=' + encodeURIComponent(f.customer_id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('view_customer_details', 'ملف العميل')) + '</a>' +
        '<a href="sales-call-log.html?customerId=' + encodeURIComponent(f.customer_id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('fup_call_customer', 'اتصال بالعميل')) + '</a>' +
        '<a href="' + waLink(f.customer_phone) + '" target="_blank" rel="noopener" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(WS.t('action_whatsapp', 'واتساب')) + '</a>' +
      '</div>';
    dlg.showModal();
  }

  function renderAll() {
    if (!data) return;
    document.getElementById('fup-header-date').textContent = new Date().toLocaleDateString(localeCode(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    hydrateCatalogAndSavedFilters();
    renderAnalytics();
    renderStatusGroups();
    renderTodayFocus();
    renderViews();
    checkRemindersAndSnooze();
  }

  async function loadWorkspace() {
    data = await WS.apiFetch('/api/sales/followups' + buildQuery(), { method: 'GET' });
    renderAll();
  }

  function updateBulkBtn() {
    var cnt = state.selectedIds.size;
    document.getElementById('fup-selected-count').textContent = WS.formatNumber(cnt);
    document.getElementById('fup-bulk-sel').disabled = cnt === 0;
    document.getElementById('fup-bulk-apply').disabled = cnt === 0;
  }

  function setView(v) {
    state.view = v;
    state.page = 1;
    localStorage.setItem('sls_fup_view', v);
    ['cards', 'table', 'calendar'].forEach(function (m) {
      document.getElementById('fup-view-' + m).classList.toggle('is-active', m === v);
    });
    renderViews();
  }

  function applyKpiOrGroupFilter(key) {
    state.page = 1;
    state.dueDate = '';
    if (key === 'all') {
      state.status = 'all';
    } else if (key === 'today') {
      state.status = 'all';
      state.dueDate = 'today';
    } else if (key === 'ontime') {
      state.status = 'all';
      state.sort = 'most_overdue';
      document.getElementById('fup-sort').value = 'most_overdue';
    } else {
      state.status = key;
    }
    var stSel = document.getElementById('fup-flt-status');
    if (stSel) stSel.value = state.status;
    loadWorkspace();
  }

  function bindEvents() {
    document.getElementById('fup-search').addEventListener('input', function (e) { state.q = e.target.value.trim(); state.page = 1; loadWorkspace(); });
    document.getElementById('fup-sort').addEventListener('change', function (e) { state.sort = e.target.value; localStorage.setItem('sls_fup_sort', state.sort); loadWorkspace(); });
    document.getElementById('fup-toggle-adv').addEventListener('click', function () {
      var p = document.getElementById('fup-adv-panel');
      p.hidden = !p.hidden;
      this.setAttribute('aria-expanded', !p.hidden ? 'true' : 'false');
    });
    document.getElementById('fup-flt-company').addEventListener('change', function (e) { state.companyId = e.target.value; state.programId = ''; state.page = 1; loadWorkspace(); });
    document.getElementById('fup-flt-program').addEventListener('change', function (e) { state.programId = e.target.value; state.page = 1; loadWorkspace(); });
    document.getElementById('fup-apply-adv').addEventListener('click', function () {
      state.status = document.getElementById('fup-flt-status').value;
      state.priority = document.getElementById('fup-flt-priority').value;
      state.overdueBucket = document.getElementById('fup-flt-overdue-bucket').value;
      state.gov = document.getElementById('fup-flt-gov').value;
      state.source = document.getElementById('fup-flt-source').value;
      state.dueExact = document.getElementById('fup-flt-due-exact').value;
      state.dueDate = '';
      state.page = 1;
      loadWorkspace();
    });
    document.getElementById('fup-clear-all').addEventListener('click', function () {
      state.q = ''; state.status = 'all'; state.priority = ''; state.overdueBucket = ''; state.companyId = ''; state.programId = ''; state.gov = ''; state.source = ''; state.dueDate = ''; state.dueExact = ''; state.page = 1;
      document.getElementById('fup-search').value = '';
      document.getElementById('fup-flt-status').value = 'all';
      document.getElementById('fup-flt-priority').value = '';
      document.getElementById('fup-flt-overdue-bucket').value = '';
      document.getElementById('fup-flt-gov').value = '';
      document.getElementById('fup-flt-source').value = '';
      document.getElementById('fup-flt-due-exact').value = '';
      loadWorkspace();
    });

    ['cards', 'table', 'calendar'].forEach(function (m) {
      document.getElementById('fup-view-' + m).addEventListener('click', function () { setView(m); });
    });
    document.getElementById('fup-jump-calendar').addEventListener('click', function () { setView('calendar'); document.getElementById('fup-calendar-section').scrollIntoView({ behavior: 'smooth' }); });

    document.querySelectorAll('#cal-mode-pills [data-cal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.calMode = btn.getAttribute('data-cal');
        renderCalendar();
      });
    });

    document.getElementById('fup-prev-close').addEventListener('click', function () {
      document.getElementById('fup-preview-dialog').close();
    });

    document.getElementById('fup-save-filter-btn').addEventListener('click', function () {
      var dlg = document.getElementById('fup-save-filter-dialog');
      document.getElementById('sf-name').value = '';
      dlg.returnValue = '';
      dlg.showModal();
    });
    document.getElementById('fup-save-filter-dialog').addEventListener('close', async function () {
      if (this.returnValue !== 'confirm') return;
      var name = document.getElementById('sf-name').value.trim();
      if (!name) return;
      await WS.apiFetch('/api/sales/saved-filters', { method: 'POST', body: JSON.stringify({ pageKey: 'followups', name: name, filterObj: state }) });
      showToast(WS.t('fup_saved_ok', 'تم حفظ الفلتر بنجاح'));
      await loadWorkspace();
    });
    document.getElementById('fup-saved-select').addEventListener('change', function (e) {
      var sf = (data.savedFilters || []).find(function (x) { return x.id === e.target.value; });
      if (!sf) return;
      try {
        var parsed = JSON.parse(sf.filter_json);
        delete parsed.selectedIds;
        Object.assign(state, parsed);
      } catch (_) {}
      loadWorkspace();
    });

    document.getElementById('fup-select-all').addEventListener('change', function (e) {
      if (e.target.checked) (data.items || []).forEach(function (f) { state.selectedIds.add(f.id); });
      else state.selectedIds.clear();
      renderViews();
      updateBulkBtn();
    });
    document.addEventListener('change', async function (e) {
      var chk = e.target.closest('[data-sel-fup]');
      if (chk) {
        var id = chk.getAttribute('data-sel-fup');
        if (chk.checked) state.selectedIds.add(id); else state.selectedIds.delete(id);
        updateBulkBtn();
        return;
      }
      var prioSel = e.target.closest('[data-quick-prio]');
      if (prioSel) {
        var fid = prioSel.getAttribute('data-quick-prio');
        await WS.apiFetch('/api/sales/followups/' + encodeURIComponent(fid), {
          method: 'PATCH',
          body: JSON.stringify({ priority: prioSel.value })
        });
        showToast(WS.t('fup_saved', 'تم تحديث الأولوية'));
        await loadWorkspace();
      }
    });

    document.getElementById('fup-bulk-apply').addEventListener('click', function () {
      var act = document.getElementById('fup-bulk-sel').value;
      if (!act || !state.selectedIds.size) return;
      var dlg = document.getElementById('fup-bulk-dialog');
      document.getElementById('fb-body').textContent = WS.t('bulk_confirm_body') + ' ' + WS.formatNumber(state.selectedIds.size);
      dlg.dataset.action = act;
      dlg.returnValue = '';
      dlg.showModal();
    });
    document.getElementById('fup-bulk-dialog').addEventListener('close', async function () {
      if (this.returnValue !== 'confirm') return;
      var raw = this.dataset.action || '';
      var body = { followupIds: Array.from(state.selectedIds) };
      if (raw === 'reschedule_tom') {
        var tom = new Date();
        tom.setDate(tom.getDate() + 1);
        tom.setHours(10, 0, 0, 0);
        body.action = 'reschedule';
        body.dueAt = tom.toISOString();
      } else {
        var parts = raw.split(':');
        body.action = parts[0];
        if (parts[0] === 'priority') body.priority = parts[1];
      }
      await WS.apiFetch('/api/sales/followups/bulk', { method: 'POST', body: JSON.stringify(body) });
      state.selectedIds.clear();
      updateBulkBtn();
      showToast(WS.t('fup_bulk_done_ok', 'تم تنفيذ الإجراء الجماعي بنجاح'));
      await loadWorkspace();
    });

    document.addEventListener('click', async function (e) {
      var kpiBtn = e.target.closest('[data-kpi-filter]');
      if (kpiBtn) {
        applyKpiOrGroupFilter(kpiBtn.getAttribute('data-kpi-filter'));
        return;
      }
      var grpBtn = e.target.closest('[data-group-filter]');
      if (grpBtn) {
        applyKpiOrGroupFilter(grpBtn.getAttribute('data-group-filter'));
        if (state.view === 'calendar') setView('cards');
        return;
      }
      var chipBtn = e.target.closest('[data-remove-chip]');
      if (chipBtn) {
        var k = chipBtn.getAttribute('data-remove-chip');
        if (k === 'status') state.status = 'all';
        else state[k] = '';
        state.page = 1;
        loadWorkspace();
        return;
      }
      var prevBtn = e.target.closest('[data-preview-fup]');
      if (prevBtn) {
        openQuickPreview(prevBtn.getAttribute('data-preview-fup'));
        return;
      }
      var compBtn = e.target.closest('[data-complete-fup]');
      if (compBtn) {
        await WS.apiFetch('/api/sales/followups/' + encodeURIComponent(compBtn.getAttribute('data-complete-fup')) + '/complete', {
          method: 'PATCH',
          body: JSON.stringify({ completedVia: 'phone' })
        });
        showToast(WS.t('fup_bulk_done_ok', 'تم إتمام المتابعة'));
        await loadWorkspace();
        return;
      }
      var calDateCell = e.target.closest('[data-cal-date]');
      if (calDateCell && !e.target.closest('a, button')) {
        state.calSelectedDate = calDateCell.getAttribute('data-cal-date');
        renderCalendar();
        return;
      }
      if (e.target.id === 'cal-prev-btn' || e.target.id === 'cal-next-btn' || e.target.id === 'cal-today-btn') {
        var c = new Date(state.calCursor + 'T00:00:00');
        if (e.target.id === 'cal-today-btn') {
          state.calCursor = todayIso;
          state.calSelectedDate = todayIso;
        } else {
          var dir = e.target.id === 'cal-next-btn' ? 1 : -1;
          if (state.calMode === 'month') c.setMonth(c.getMonth() + dir);
          else if (state.calMode === 'week') c.setDate(c.getDate() + dir * 7);
          else c.setDate(c.getDate() + dir);
          state.calCursor = c.toISOString().slice(0, 10);
          state.calSelectedDate = state.calCursor;
        }
        renderCalendar();
        return;
      }
      if (e.target.id === 'fup-page-prev' && state.page > 1) {
        state.page--;
        renderViews();
        return;
      }
      if (e.target.id === 'fup-page-next') {
        state.page++;
        renderViews();
        return;
      }
      // Clickable card or table row -> navigate only if click wasn't on a nested interactive element
      var cardOrRow = e.target.closest('[data-card-href]');
      if (cardOrRow && !e.target.closest('a, button, input, select, label')) {
        window.location.href = cardOrRow.getAttribute('data-card-href');
      }
    });

    WS.onRefresh(function () {
      triggeredReminders.clear();
      renderAll();
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await WS.init();
    var params = new URLSearchParams(window.location.search);
    var st = params.get('status') || params.get('filter');
    if (st) state.status = st;
    document.getElementById('fup-sort').value = state.sort;
    bindEvents();
    await loadWorkspace();
    setView(state.view);
  });
})();
