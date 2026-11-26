/* ==========================================================================
   Miqat Sales & Call Center CRM — Page 1: Interactive SaaS Analytics Controller
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;
  if (!WS) return;

  var DEFAULT_FILTERS = {
    period: 'month',
    from: '',
    to: '',
    q: '',
    companyIds: [],
    programIds: [],
    stages: [],
    govs: [],
    sources: [],
    contactState: 'all',
    followupState: 'all',
    referrer: '',
    callDir: 'all',
    callOutcome: 'all',
    callDuration: 'all',
    category: 'all',
    bookingState: 'all',
    contractState: 'all'
  };

  var filterState = JSON.parse(JSON.stringify(DEFAULT_FILTERS));
  var dashData = null;
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

  function buildQueryString() {
    var p = new URLSearchParams();
    p.set('period', filterState.period || 'month');
    if (filterState.period === 'custom' && filterState.from && filterState.to) {
      p.set('from', filterState.from);
      p.set('to', filterState.to);
    }
    if (filterState.q) p.set('q', filterState.q);
    if (filterState.companyIds.length) p.set('companyIds', filterState.companyIds.join(','));
    if (filterState.programIds.length) p.set('programIds', filterState.programIds.join(','));
    if (filterState.stages.length) p.set('stages', filterState.stages.join(','));
    if (filterState.govs.length) p.set('govs', filterState.govs.join(','));
    if (filterState.sources.length) p.set('sources', filterState.sources.join(','));
    if (filterState.contactState !== 'all') p.set('contactState', filterState.contactState);
    if (filterState.followupState !== 'all') p.set('followupState', filterState.followupState);
    if (filterState.referrer) p.set('referrer', filterState.referrer);
    if (filterState.callDir !== 'all') p.set('callDir', filterState.callDir);
    if (filterState.callOutcome !== 'all') p.set('callOutcome', filterState.callOutcome);
    if (filterState.callDuration !== 'all') p.set('callDuration', filterState.callDuration);
    if (filterState.category !== 'all') p.set('category', filterState.category);
    if (filterState.bookingState !== 'all') p.set('bookingState', filterState.bookingState);
    if (filterState.contractState !== 'all') p.set('contractState', filterState.contractState);
    return '?' + p.toString();
  }

  function hydrateFilterCatalog() {
    if (!dashData || !dashData.filterCatalog) return;
    var cat = dashData.filterCatalog;
    var compSel = document.getElementById('sls-flt-company');
    var progSel = document.getElementById('sls-flt-program');
    var refSel = document.getElementById('sls-flt-referrer');

    var selectedComp = filterState.companyIds[0] || '';
    var selectedProg = filterState.programIds[0] || '';

    compSel.innerHTML = '<option value="">' + esc(WS.t('flt_all_companies')) + '</option>' +
      cat.companies.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === selectedComp ? ' selected' : '') + '>' + esc(localized(c, 'name_ar', 'name_en')) + '</option>';
      }).join('');

    var progs = cat.programs.filter(function (p) {
      if (selectedComp && p.company_id !== selectedComp) return false;
      if (filterState.category !== 'all' && p.category !== filterState.category) return false;
      return true;
    });
    progSel.innerHTML = '<option value="">' + esc(WS.t('flt_all_programs')) + '</option>' +
      progs.map(function (p) {
        return '<option value="' + esc(p.id) + '"' + (p.id === selectedProg ? ' selected' : '') + '>' + esc(localized(p, 'title_ar', 'title_en')) + '</option>';
      }).join('');

    if (!catalogHydrated) {
      refSel.innerHTML = '<option value="">All Referrers / كل المرشحين</option>' +
        (cat.referrers || []).map(function (r) {
          return '<option value="' + esc(r) + '">' + esc(r) + '</option>';
        }).join('');

      var stageOpts = ['fresh_lead', 'contacted', 'follow_up', 'booked_pending_payment', 'booked_pending_contract', 'contract_completed'];
      document.getElementById('sls-ms-stages').innerHTML = stageOpts.map(function (st) {
        return '<label class="sls-ms-item" data-opt-label="' + esc(WS.t('cust_stage_' + st, st).toLowerCase()) + '"><input type="checkbox" value="' + st + '"><span>' + esc(WS.t('cust_stage_' + st, st)) + '</span></label>';
      }).join('');

      var govOpts = ['cairo', 'portsaid', 'other_gov', 'overseas'];
      document.getElementById('sls-ms-govs').innerHTML = govOpts.map(function (g) {
        return '<label class="sls-ms-item"><input type="checkbox" value="' + g + '"><span>' + esc(WS.t('geo_' + g, g)) + '</span></label>';
      }).join('');

      var srcOpts = ['referral', 'social_ads', 'website', 'call_center', 'whatsapp'];
      document.getElementById('sls-ms-sources').innerHTML = srcOpts.map(function (s) {
        return '<label class="sls-ms-item"><input type="checkbox" value="' + s + '"><span>' + esc(WS.t('src_' + s, s)) + '</span></label>';
      }).join('');

      catalogHydrated = true;
    }
  }

  function renderActiveFilterChips() {
    var k = dashData ? dashData.kpis : { assignedCustomers: 0, inboundCalls: 0, outboundCalls: 0 };
    var totalCalls = (k.inboundCalls || 0) + (k.outboundCalls || 0);
    document.getElementById('sls-filter-summary').textContent =
      WS.t('flt_summary_prefix') + ': ' + WS.formatNumber(k.assignedCustomers) + ' ' + WS.t('tbl_customers') + ' • ' + WS.formatNumber(totalCalls) + ' ' + WS.t('kpi_total_calls');

    var chips = [];
    if (filterState.q) chips.push({ key: 'q', label: 'Search: ' + filterState.q });
    if (filterState.companyIds.length) chips.push({ key: 'companyIds', label: WS.t('tbl_company') + ': ' + filterState.companyIds.join(',') });
    if (filterState.programIds.length) chips.push({ key: 'programIds', label: WS.t('tbl_program') + ': ' + filterState.programIds.join(',') });
    if (filterState.stages.length) chips.push({ key: 'stages', label: 'Stages (' + filterState.stages.length + ')' });
    if (filterState.govs.length) chips.push({ key: 'govs', label: 'Gov: ' + filterState.govs.map(function (g) { return WS.t('geo_' + g, g); }).join(', ') });
    if (filterState.sources.length) chips.push({ key: 'sources', label: 'Sources (' + filterState.sources.length + ')' });
    if (filterState.contactState !== 'all') chips.push({ key: 'contactState', label: 'Contact: ' + filterState.contactState });
    if (filterState.followupState !== 'all') chips.push({ key: 'followupState', label: 'Follow-up: ' + filterState.followupState });
    if (filterState.referrer) chips.push({ key: 'referrer', label: 'Referrer: ' + filterState.referrer });
    if (filterState.callDir !== 'all') chips.push({ key: 'callDir', label: 'Call: ' + filterState.callDir });
    if (filterState.callOutcome !== 'all') chips.push({ key: 'callOutcome', label: 'Outcome: ' + filterState.callOutcome });
    if (filterState.callDuration !== 'all') chips.push({ key: 'callDuration', label: 'Duration: ' + filterState.callDuration });
    if (filterState.category !== 'all') chips.push({ key: 'category', label: 'Category: ' + filterState.category });
    if (filterState.bookingState !== 'all') chips.push({ key: 'bookingState', label: 'Booking: ' + filterState.bookingState });
    if (filterState.contractState !== 'all') chips.push({ key: 'contractState', label: 'Contract: ' + filterState.contractState });

    document.getElementById('sls-active-chips-list').innerHTML = chips.map(function (ch) {
      return '<button type="button" class="sls-filter-chip" data-remove-chip="' + esc(ch.key) + '">' + esc(ch.label) + ' <span aria-hidden="true">×</span></button>';
    }).join('');

    var hasAnyFilter = chips.length > 0;
    document.getElementById('sls-empty-banner').hidden = !(hasAnyFilter && k.assignedCustomers === 0 && totalCalls === 0);
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

  function renderWelcome() {
    if (!dashData) return;
    var emp = dashData.employee;
    var name = WS.getLang() === 'en' ? emp.name_en : emp.name_ar;
    document.getElementById('sls-welcome-heading').textContent = WS.t('welcome_greeting') + ' ' + name;
    document.getElementById('sls-welcome-date').textContent = new Date().toLocaleDateString(
      WS.getLang() === 'ar' ? 'ar-EG' : 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    );
    var pct = dashData.kpis.targetAchievementPct || 0;
    var motAr = pct >= 80 ? 'أداء متميز! أنت قريب جداً من إتمام مستهدف الفترة.' : 'انطلاقة موفقة — ركز على المتابعات القريبة لإتمام العقود.';
    var motEn = pct >= 80 ? 'Outstanding momentum! You are close to completing your period target.' : 'Strong start — prioritize upcoming follow-ups to close contracts.';
    document.getElementById('sls-motivational-msg').textContent = WS.getLang() === 'en' ? motEn : motAr;
    document.getElementById('sls-data-notice').textContent = localized(dashData.dataNotice, 'message_ar', 'message_en');

    var ws = WS.getWorkSession() || dashData.workSession;
    var statusLabel = ws ? WS.t('status_' + ws.status) : WS.t('status_not_started');
    var timerTxt = ws ? WS.formatDuration(ws.liveWorkedSeconds) : '00:00:00';
    var pctTxt = ws ? WS.formatNumber(ws.progressPct || 0) : WS.formatNumber(0);
    document.getElementById('sls-welcome-badges').innerHTML =
      '<span class="status-pill status-pill-navy" id="sls-welcome-status-pill">' + esc(statusLabel) + '</span>' +
      '<span class="status-pill status-pill-slate" id="sls-welcome-timer"><bdi dir="ltr">' + esc(timerTxt) + '</bdi> (' + esc(pctTxt) + '%)</span>' +
      '<span class="status-pill status-pill-amber">' + esc(WS.t('kpi_target_pct')) + ': ' + esc(WS.formatNumber(pct)) + '%</span>';
  }

  function renderKpis() {
    var k = dashData.kpis;
    var p = dashData.prevKpis || {};
    var trends = (dashData.analytics && dashData.analytics.trends) || [];
    var totalCalls = (k.inboundCalls || 0) + (k.outboundCalls || 0);
    var trendBadge = function (cur, prev) {
      var diff = (cur || 0) - (prev || 0);
      var arrow = diff > 0 ? '↗ +' : (diff < 0 ? '↘ ' : '• ');
      return arrow + WS.formatNumber(diff);
    };

    var icons = {
      users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>',
      spark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5 12 2"></polygon></svg>',
      phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z"></path></svg>',
      check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      target: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'
    };

    var cards = [
      { icon: icons.users, label: WS.t('kpi_assigned'), val: WS.formatNumber(k.assignedCustomers), badge: trendBadge(k.assignedCustomers, p.assignedCustomers), sub: WS.t('kpi_vs_prev') + ': ' + WS.formatNumber(p.assignedCustomers || 0), spark: trends.map(function (t) { return t.newCustomers; }), color: '#28577D', href: 'sales-customers.html' },
      { icon: icons.spark, label: WS.t('kpi_fresh'), val: WS.formatNumber(k.freshLeads), badge: trendBadge(k.freshLeads, p.freshLeads), sub: WS.t('kpi_vs_prev') + ': ' + WS.formatNumber(p.freshLeads || 0), spark: trends.map(function (t) { return t.newCustomers; }), color: '#D1B16C', href: 'sales-customers.html?stage=fresh_lead' },
      { icon: icons.users, label: WS.t('kpi_contacted'), val: WS.formatNumber(k.customersContacted), badge: trendBadge(k.customersContacted, p.customersContacted), sub: WS.t('kpi_vs_prev') + ': ' + WS.formatNumber(p.customersContacted || 0), spark: trends.map(function (t) { return t.contacted; }), color: '#0F253B', href: 'sales-customers.html?stage=contacted' },
      { icon: icons.phone, label: WS.t('kpi_total_calls'), val: WS.formatNumber(totalCalls), badge: trendBadge(totalCalls, p.totalCalls), sub: WS.formatNumber(k.outboundCalls) + ' / ' + WS.formatNumber(k.inboundCalls) + ' • ' + WS.formatDuration(k.totalCallDurationSeconds), spark: trends.map(function (t) { return t.inboundCalls + t.outboundCalls; }), color: '#28577D', href: 'sales-call-log.html' },
      { icon: icons.check, label: WS.t('kpi_bookings'), val: WS.formatNumber(k.completedBookings), badge: trendBadge(k.completedBookings, p.completedBookings), sub: WS.t('kpi_vs_prev') + ': ' + WS.formatNumber(p.completedBookings || 0), spark: [1, 2, 3, 4, 6, k.completedBookings], color: '#D1B16C', href: 'sales-customers.html?stage=booked' },
      { icon: icons.check, label: WS.t('kpi_contracts'), val: WS.formatNumber(k.completedContracts), badge: trendBadge(k.completedContracts, p.completedContracts), sub: WS.t('kpi_vs_prev') + ': ' + WS.formatNumber(p.completedContracts || 0), spark: [1, 1, 2, 3, 4, k.completedContracts], color: '#0F253B', href: 'sales-customers.html?stage=contract_completed' },
      { icon: icons.target, label: WS.t('kpi_target_pct'), val: WS.formatNumber(k.targetAchievementPct) + '%', badge: WS.formatNumber(k.achievedValue) + ' / ' + WS.formatNumber(k.targetValue), sub: WS.t('lbl_remaining') + ': ' + WS.formatNumber(k.remainingValue), isTarget: true, href: 'sales-profile.html' }
    ];

    document.getElementById('sls-kpi-grid').innerHTML = cards.map(function (c) {
      var extra = c.isTarget
        ? '<progress class="sls-progress" value="' + esc(k.achievedValue) + '" max="' + esc(Math.max(1, k.targetValue)) + '"></progress>'
        : '';
      return '<a href="' + esc(c.href) + '" class="sls-kpi-ref-card">' +
        '<div class="sls-kpi-head-row">' +
          '<div class="sls-kpi-title-wrap"><span class="sls-kpi-icon-badge">' + c.icon + '</span><span class="sls-kpi-label">' + esc(c.label) + '</span></div>' +
          '<span class="sls-kpi-trend-pill">' + esc(c.badge) + '</span>' +
        '</div>' +
        '<div class="sls-kpi-main-row">' +
          '<strong class="sls-kpi-val-lg">' + c.val + '</strong>' +
          (c.spark ? buildSparkline(c.spark, c.color) : '') +
        '</div>' +
        extra +
        '<span class="sls-kpi-trend">' + esc(c.sub) + '</span>' +
      '</a>';
    }).join('');
  }

  function renderTrendsChart() {
    var trends = (dashData.analytics && dashData.analytics.trends) || [];
    var wrap = document.getElementById('sls-trends-svg-wrap');
    var leg = document.getElementById('sls-trends-legend');
    if (!trends.length) { wrap.innerHTML = '<p class="sls-item-meta">—</p>'; return; }

    var w = 620, h = 210, padL = 32, padR = 16, padT = 16, padB = 28;
    var maxV = 1;
    trends.forEach(function (t) { maxV = Math.max(maxV, t.newCustomers, t.contacted, t.followups); });
    var plotW = w - padL - padR;
    var plotH = h - padT - padB;
    var step = trends.length > 1 ? plotW / (trends.length - 1) : plotW;

    var makePath = function (key) {
      return trends.map(function (t, i) {
        var x = Math.round(padL + i * step);
        var y = Math.round(padT + plotH - ((t[key] / maxV) * plotH));
        return (i === 0 ? 'M' : 'L') + x + ' ' + y;
      }).join(' ');
    };
    var makeDots = function (key, color, label) {
      return trends.map(function (t, i) {
        var x = Math.round(padL + i * step);
        var y = Math.round(padT + plotH - ((t[key] / maxV) * plotH));
        var lbl = WS.getLang() === 'en' ? t.label_en : t.label_ar;
        return '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + color + '" stroke="var(--color-surface)" stroke-width="1.5" tabindex="0" data-tip="' + esc(lbl + ' — ' + label + ': ' + WS.formatNumber(t[key])) + '"></circle>';
      }).join('');
    };

    var gridLines = [0, 0.5, 1].map(function (r) {
      var y = Math.round(padT + plotH - r * plotH);
      return '<line x1="' + padL + '" y1="' + y + '" x2="' + (w - padR) + '" y2="' + y + '" stroke="var(--color-border-subtle)" stroke-dasharray="3 3" />' +
             '<text x="' + (padL - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10" fill="var(--color-text-muted)">' + Math.round(maxV * r) + '</text>';
    }).join('');

    var xLabels = trends.map(function (t, i) {
      var x = Math.round(padL + i * step);
      var lbl = WS.getLang() === 'en' ? t.label_en : t.label_ar;
      return '<text x="' + x + '" y="' + (h - 6) + '" text-anchor="middle" font-size="10" fill="var(--color-text-muted)">' + esc(lbl) + '</text>';
    }).join('');

    wrap.innerHTML =
      '<svg class="sls-svg-chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Customer Trends">' +
        gridLines + xLabels +
        '<path d="' + makePath('newCustomers') + '" fill="none" stroke="#D1B16C" stroke-width="2.5" stroke-linecap="round" />' +
        '<path d="' + makePath('contacted') + '" fill="none" stroke="#0F253B" stroke-width="2.5" stroke-linecap="round" />' +
        '<path d="' + makePath('followups') + '" fill="none" stroke="#28577D" stroke-width="2.5" stroke-dasharray="4 3" stroke-linecap="round" />' +
        makeDots('newCustomers', '#D1B16C', WS.t('kpi_fresh')) +
        makeDots('contacted', '#0F253B', WS.t('kpi_contacted')) +
        makeDots('followups', '#28577D', WS.t('kpi_followups')) +
      '</svg>';

    leg.innerHTML =
      '<span><i class="sls-legend-dot" style="background:#D1B16C;"></i>' + esc(WS.t('kpi_fresh')) + '</span>' +
      '<span><i class="sls-legend-dot" style="background:#0F253B;"></i>' + esc(WS.t('kpi_contacted')) + '</span>' +
      '<span><i class="sls-legend-dot" style="background:#28577D;"></i>' + esc(WS.t('kpi_followups')) + '</span>';
  }

  function renderConversionDonut() {
    var d = (dashData.analytics && dashData.analytics.conversionDistribution) || { total: 0, fresh: 0, inProgress: 0, booked: 0, contractCompleted: 0 };
    var segs = [
      { label: WS.t('cust_stage_fresh_lead'), val: d.fresh, color: '#94A3B8' },
      { label: WS.t('cust_stage_follow_up'), val: d.inProgress, color: '#28577D' },
      { label: WS.t('kpi_bookings'), val: d.booked, color: '#D1B16C' },
      { label: WS.t('kpi_contracts'), val: d.contractCompleted, color: '#0F253B' }
    ];
    var total = Math.max(1, d.total);
    var r = 54, c = 2 * Math.PI * r, offset = 0;
    var circles = segs.map(function (s) {
      var len = (s.val / total) * c;
      var el = '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="18" stroke-dasharray="' + len.toFixed(1) + ' ' + c.toFixed(1) + '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 70 70)" data-tip="' + esc(s.label + ': ' + WS.formatNumber(s.val)) + '"></circle>';
      offset += len;
      return el;
    }).join('');

    document.getElementById('sls-conversion-donut').innerHTML =
      '<svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="Conversion Distribution">' +
        '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="var(--color-border-subtle)" stroke-width="18"></circle>' +
        circles +
        '<text x="70" y="67" text-anchor="middle" font-size="20" font-weight="800" fill="var(--color-text)">' + esc(WS.formatNumber(d.total)) + '</text>' +
        '<text x="70" y="84" text-anchor="middle" font-size="10" fill="var(--color-text-muted)">' + esc(WS.t('tbl_customers')) + '</text>' +
      '</svg>' +
      '<div class="sls-chart-legend" style="flex-direction:column; gap:0.4rem;">' +
        segs.map(function (s) {
          return '<span><i class="sls-legend-dot" style="background:' + s.color + ';"></i>' + esc(s.label) + ': <strong>' + esc(WS.formatNumber(s.val)) + '</strong></span>';
        }).join('') +
      '</div>';
  }

  function renderCallsBarChart() {
    var trends = (dashData.analytics && dashData.analytics.trends) || [];
    var wrap = document.getElementById('sls-calls-bar-svg');
    if (!trends.length) { wrap.innerHTML = '<p class="sls-item-meta">—</p>'; return; }
    var w = 480, h = 180, padL = 28, padB = 26, padT = 14;
    var maxV = 1;
    trends.forEach(function (t) { maxV = Math.max(maxV, t.inboundCalls, t.outboundCalls); });
    var plotH = h - padT - padB;
    var groupW = (w - padL - 12) / trends.length;

    var bars = trends.map(function (t, i) {
      var x0 = padL + i * groupW + groupW * 0.18;
      var bw = Math.max(8, groupW * 0.28);
      var hOut = Math.round((t.outboundCalls / maxV) * plotH);
      var hIn = Math.round((t.inboundCalls / maxV) * plotH);
      var lbl = WS.getLang() === 'en' ? t.label_en : t.label_ar;
      return '<rect x="' + x0 + '" y="' + (padT + plotH - hOut) + '" width="' + bw + '" height="' + hOut + '" rx="3" fill="#0F253B" data-tip="' + esc(lbl + ' — ' + WS.t('kpi_outbound') + ': ' + WS.formatNumber(t.outboundCalls)) + '"></rect>' +
             '<rect x="' + (x0 + bw + 3) + '" y="' + (padT + plotH - hIn) + '" width="' + bw + '" height="' + hIn + '" rx="3" fill="#D1B16C" data-tip="' + esc(lbl + ' — ' + WS.t('kpi_inbound') + ': ' + WS.formatNumber(t.inboundCalls)) + '"></rect>' +
             '<text x="' + (x0 + bw) + '" y="' + (h - 6) + '" text-anchor="middle" font-size="9.5" fill="var(--color-text-muted)">' + esc(lbl) + '</text>';
    }).join('');

    wrap.innerHTML =
      '<svg class="sls-svg-chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Calls Performance">' + bars + '</svg>' +
      '<div class="sls-chart-legend"><span><i class="sls-legend-dot" style="background:#0F253B;"></i>' + esc(WS.t('kpi_outbound')) + '</span><span><i class="sls-legend-dot" style="background:#D1B16C;"></i>' + esc(WS.t('kpi_inbound')) + '</span></div>';
  }

  function renderTargetVsReality() {
    var k = dashData.kpis;
    var tb = dashData.targetBreakdown || {};
    document.getElementById('sls-target-pct-pill').textContent = WS.formatNumber(k.targetAchievementPct) + '%';
    var rows = [
      { label: WS.t('target_daily'), d: tb.daily },
      { label: WS.t('target_weekly'), d: tb.weekly },
      { label: WS.t('target_monthly'), d: tb.monthly }
    ].filter(function (r) { return r.d; });

    document.getElementById('sls-target-reality-body').innerHTML =
      '<div class="sls-chart-list">' +
      rows.map(function (r) {
        return '<div class="sls-bar-row">' +
          '<div class="sls-bar-head"><span>' + esc(r.label) + '</span><span>' + esc(WS.formatNumber(r.d.achieved)) + ' / ' + esc(WS.formatNumber(r.d.target)) + ' (' + esc(WS.formatNumber(r.d.pct)) + '%)</span></div>' +
          '<progress class="sls-progress" value="' + esc(r.d.achieved) + '" max="' + esc(Math.max(1, r.d.target)) + '"></progress>' +
        '</div>';
      }).join('') +
      '</div>';
  }

  function renderBusinessInsights() {
    var topProgs = (dashData.analytics && dashData.analytics.topPrograms) || [];
    document.getElementById('sls-top-programs-table').innerHTML = topProgs.length
      ? '<table class="sls-table"><thead><tr>' +
          '<th>' + esc(WS.t('tbl_rank')) + '</th>' +
          '<th>' + esc(WS.t('tbl_company')) + '</th>' +
          '<th>' + esc(WS.t('tbl_program')) + '</th>' +
          '<th>' + esc(WS.t('tbl_customers')) + '</th>' +
          '<th>' + esc(WS.t('tbl_bookings')) + '</th>' +
          '<th>' + esc(WS.t('tbl_perf')) + '</th>' +
        '</tr></thead><tbody>' +
        topProgs.map(function (r) {
          return '<tr data-href="sales-program-details.html?id=' + encodeURIComponent(r.program_id) + '">' +
            '<td>#' + esc(WS.formatNumber(r.rank)) + '</td>' +
            '<td>' + esc(localized(r, 'company_ar', 'company_en')) + '</td>' +
            '<td>' + esc(localized(r, 'program_ar', 'program_en')) + '</td>' +
            '<td>' + esc(WS.formatNumber(r.customers)) + '</td>' +
            '<td>' + esc(WS.formatNumber(r.booked)) + '</td>' +
            '<td><span class="status-pill status-pill-navy">' + esc(WS.formatNumber(r.performancePct)) + '%</span></td>' +
          '</tr>';
        }).join('') +
        '</tbody></table>'
      : '<p class="sls-item-meta">' + esc(WS.t('flt_empty_title')) + '</p>';

    var srcs = (dashData.analytics && dashData.analytics.sources) || [];
    var refs = (dashData.analytics && dashData.analytics.referrers) || [];
    var maxSrc = Math.max.apply(null, srcs.map(function (s) { return s.total; }).concat([1]));
    document.getElementById('sls-referral-body').innerHTML = srcs.length
      ? '<div class="sls-chart-list">' +
        srcs.map(function (s) {
          var pct = Math.round((s.total / maxSrc) * 100);
          return '<div class="sls-bar-row"><div class="sls-bar-head"><span>' + esc(WS.t('src_' + s.key, s.key)) + '</span><span>' + esc(WS.formatNumber(s.total)) + '</span></div>' +
            '<div class="sls-bar-track"><div class="sls-bar-fill" style="inline-size:' + pct + '%"></div></div></div>';
        }).join('') +
        '</div>' +
        (refs.length ? '<div class="sls-item-meta" style="margin-block-start:0.5rem;">' + esc(WS.t('src_referral')) + ': ' + refs.slice(0, 3).map(function (r) { return esc(r.name); }).join(' • ') + '</div>' : '')
      : '<p class="sls-item-meta">' + esc(WS.t('flt_empty_title')) + '</p>';

    var geos = (dashData.analytics && dashData.analytics.geography) || [];
    document.getElementById('sls-geo-map-body').innerHTML = geos.length
      ? '<div class="sls-geo-grid">' +
        geos.map(function (g) {
          var active = filterState.govs.indexOf(g.key) !== -1;
          return '<button type="button" class="sls-geo-tile ' + (active ? 'is-active' : '') + '" data-geo="' + esc(g.key) + '">' +
            '<strong class="sls-item-title">' + esc(WS.t('geo_' + g.key, g.key)) + '</strong>' +
            '<span class="sls-item-meta">' + esc(WS.t('tbl_customers')) + ': ' + esc(WS.formatNumber(g.total)) + ' • ' + esc(WS.t('tbl_bookings')) + ': ' + esc(WS.formatNumber(g.booked)) + '</span>' +
          '</button>';
        }).join('') +
        '</div>'
      : '<p class="sls-item-meta">' + esc(WS.t('flt_empty_title')) + '</p>';

    var f = (dashData.analytics && dashData.analytics.bookingContractFunnel) || {};
    var k = dashData.kpis;
    var funnelRows = [
      { label: WS.t('tbl_bookings'), val: f.bookedCount || 0 },
      { label: WS.t('kpi_contracts'), val: f.completedContractsCount || 0 }
    ];
    document.getElementById('sls-booking-contract-body').innerHTML =
      '<div class="sls-chart-list">' +
        funnelRows.map(function (r) {
          var pct = Math.round((r.val / Math.max(1, f.totalCustomers || 1)) * 100);
          return '<div class="sls-bar-row"><div class="sls-bar-head"><span>' + esc(r.label) + '</span><span>' + esc(WS.formatNumber(r.val)) + ' (' + esc(WS.formatNumber(pct)) + '%)</span></div>' +
            '<div class="sls-bar-track"><div class="sls-bar-fill" style="inline-size:' + pct + '%"></div></div></div>';
        }).join('') +
        '<div class="sls-bar-row" style="margin-block-start:0.25rem;">' +
          '<div class="sls-bar-head"><span>' + esc(WS.t('lbl_payment_progress')) + '</span><span>' + esc(WS.formatNumber(k.totalPaidEgp || 0)) + ' / ' + esc(WS.formatNumber(k.totalContractValueEgp || 0)) + ' EGP</span></div>' +
          '<progress class="sls-progress" value="' + esc(k.totalPaidEgp || 0) + '" max="' + esc(Math.max(1, k.totalContractValueEgp || 1)) + '"></progress>' +
        '</div>' +
      '</div>';
  }

  function renderInteractionsAndFollowups() {
    var ints = dashData.recentInteractions || [];
    document.getElementById('sls-interactions-table').innerHTML = ints.length
      ? '<table class="sls-table"><thead><tr>' +
          '<th>' + esc(WS.t('tbl_customer')) + '</th>' +
          '<th>' + esc(WS.t('tbl_activity')) + '</th>' +
          '<th>' + esc(WS.t('tbl_datetime')) + '</th>' +
          '<th>' + esc(WS.t('tbl_outcome')) + '</th>' +
          '<th>' + esc(WS.t('tbl_next_action')) + '</th>' +
        '</tr></thead><tbody>' +
        ints.map(function (i) {
          return '<tr data-href="sales-call-log.html?customerId=' + encodeURIComponent(i.customer_id || '') + '">' +
            '<td>' + esc(localized(i, 'customer_ar', 'customer_en') || '—') + '</td>' +
            '<td>' + esc(i.direction === 'inbound' ? WS.t('kpi_inbound') : WS.t('kpi_outbound')) + '</td>' +
            '<td><bdi dir="ltr">' + esc(formatTs(i.created_at)) + '</bdi></td>' +
            '<td><span class="status-pill status-pill-slate">' + esc(i.outcome || 'answered') + '</span></td>' +
            '<td><a href="sales-followup-form.html?customerId=' + encodeURIComponent(i.customer_id || '') + '">' + esc(WS.t('qa_schedule_followup')) + '</a></td>' +
          '</tr>';
        }).join('') +
        '</tbody></table>'
      : '<p class="sls-item-meta">' + esc(WS.t('flt_empty_title')) + '</p>';

    var fups = dashData.followupsPreview || [];
    document.getElementById('sls-followups-list').innerHTML = fups.length
      ? fups.slice(0, 6).map(function (f) {
          var isOverdue = f.status === 'overdue' || (f.due_at && f.due_at < new Date().toISOString());
          var dueText = f.due_at ? formatTs(f.due_at) : WS.t('fup_status_undated');
          return '<div class="sls-list-item ' + (isOverdue ? 'is-highlight' : '') + '">' +
            '<div class="sls-item-main">' +
              '<span class="sls-item-title">' + esc(localized(f, 'customer_name_ar', 'customer_name_en') || f.customer_id) + '</span>' +
              '<span class="sls-item-meta">' + esc(f.notes || '') + ' • <bdi dir="ltr">' + esc(dueText) + '</bdi></span>' +
            '</div>' +
            '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-complete-fup="' + esc(f.id) + '">' + esc(WS.t('fup_mark_done')) + '</button>' +
          '</div>';
        }).join('')
      : '<p class="sls-item-meta">' + esc(WS.t('empty_followups')) + '</p>';

    var nowMs = Date.now();
    var soon = fups.find(function (f) { var diff = Date.parse(f.due_at) - nowMs; return diff > 0 && diff <= 15 * 60000; });
    var remPop = document.getElementById('sls-reminder-popover');
    if (soon && remPop && !remPop.dataset.dismissed) {
      remPop.innerHTML = '<strong>' + esc(localized(soon, 'customer_name_ar', 'customer_name_en')) + '</strong>' +
        '<p style="margin:0.35rem 0; font-size:0.84rem;">' + esc(soon.notes || '') + '</p>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-rem-close">×</button>';
      try { if (!remPop.matches(':popover-open')) remPop.showPopover(); } catch (_) {}
      var closeBtn = document.getElementById('sls-rem-close');
      if (closeBtn) closeBtn.addEventListener('click', function () { remPop.dataset.dismissed = '1'; try { remPop.hidePopover(); } catch (_) {} });
    }
  }

  function renderMotivationAndNotifs() {
    var lb = dashData.leaderboard;
    var my = lb.myRank;
    document.getElementById('sls-my-rank-pill').textContent = WS.t('lbl_your_rank') + ': #' + WS.formatNumber(my ? my.rank : '-');
    document.getElementById('sls-leaderboard-list').innerHTML = lb.top10.map(function (row) {
      var label = row.isCurrent ? (WS.getLang() === 'en' ? 'You (Current Employee)' : 'أنت (الموظف الحالي)') : row.code;
      return '<div class="sls-list-item ' + (row.isCurrent ? 'is-highlight' : '') + '">' +
        '<div class="sls-item-main"><span class="sls-item-title">#' + esc(WS.formatNumber(row.rank)) + ' — ' + esc(label) + '</span>' +
        '<span class="sls-item-meta">' + esc(WS.t('kpi_contracts')) + ': ' + esc(WS.formatNumber(row.contracts)) + ' • ' + esc(WS.t('kpi_bookings')) + ': ' + esc(WS.formatNumber(row.bookings)) + '</span></div>' +
        '<span class="status-pill status-pill-navy">' + esc(WS.formatNumber(row.score)) + '</span></div>';
    }).join('');

    var gam = dashData.gamification;
    document.getElementById('sls-points-pill').textContent = WS.t('lbl_points_balance') + ': ' + WS.formatNumber(gam.pointsBalance);
    var earnedSet = new Set((gam.earnedBadges || []).map(function (b) { return b.id; }));
    document.getElementById('sls-gamification-body').innerHTML =
      '<div class="sls-badges-grid">' +
      gam.allBadges.map(function (b) {
        return '<div class="sls-badge-tile ' + (earnedSet.has(b.id) ? 'is-earned' : '') + '">' +
          '<strong>' + esc(localized(b, 'title_ar', 'title_en')) + '</strong>' +
          '<span class="sls-item-meta">' + esc(localized(b, 'desc_ar', 'desc_en')) + '</span></div>';
      }).join('') + '</div>';

    var notifs = (dashData.notifications && dashData.notifications.items) || [];
    var unread = (dashData.notifications && dashData.notifications.unreadCount) || 0;
    var badge = document.getElementById('sls-header-notif-badge');
    if (badge) { badge.textContent = WS.formatNumber(unread); badge.hidden = unread <= 0; }

    document.getElementById('sls-notifications-list').innerHTML = notifs.length
      ? notifs.slice(0, 3).map(function (n) {
          return '<div class="sls-list-item ' + (!n.is_read ? 'is-highlight' : '') + '">' +
            '<div class="sls-item-main"><span class="sls-item-title">' + esc(localized(n, 'title_ar', 'title_en')) + '</span><span class="sls-item-meta">' + esc(localized(n, 'body_ar', 'body_en')) + '</span></div>' +
            '<div style="display:flex; gap:0.35rem;">' +
              (!n.is_read ? '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-read-notif="' + esc(n.id) + '">' + esc(WS.t('notif_mark_read')) + '</button>' : '') +
              '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-del-notif="' + esc(n.id) + '">' + esc(WS.t('notif_delete')) + '</button>' +
            '</div></div>';
        }).join('')
      : '<p class="sls-item-meta">' + esc(WS.t('empty_notifications')) + '</p>';
  }

  function renderFunCorner() {
    var fc = dashData.funCorner;
    if (!fc) return;
    document.getElementById('sls-fun-streak-pill').textContent = WS.t('fun_streak') + ': ' + WS.formatNumber(fc.streakDays || 0) + ' ' + WS.t('fun_days');
    var completedMap = {};
    (fc.completedToday || []).forEach(function (r) { completedMap[r.activity_type] = r; });

    var cel = document.getElementById('sls-fun-celebrate');
    if (Object.keys(completedMap).length > 0) {
      cel.textContent = WS.t('fun_celebrate');
      cel.hidden = false;
    } else {
      cel.hidden = true;
    }

    var cards = [
      { type: 'riddle', title: WS.t('fun_riddle'), item: fc.riddle },
      { type: 'quiz', title: WS.t('fun_quiz') + ' — ' + localized(fc.quiz, 'topic_ar', 'topic_en'), item: fc.quiz },
      { type: 'challenge', title: WS.t('fun_challenge'), item: fc.challenge }
    ];
    document.getElementById('sls-fun-grid').innerHTML = cards.map(function (c) {
      var done = completedMap[c.type];
      var opts = (WS.getLang() === 'en' ? c.item.options_en : c.item.options_ar) || [];
      return '<article class="sls-fun-box">' +
        '<strong class="sls-item-title">' + esc(c.title) + '</strong>' +
        '<p style="margin:0; font-size:0.86rem;">' + esc(localized(c.item, 'question_ar', 'question_en')) + '</p>' +
        '<div class="sls-fun-options">' +
          opts.map(function (opt, idx) {
            var isPicked = done && done.selected_index === idx;
            return '<button type="button" class="acc-btn ' + (isPicked ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm sls-fun-opt" data-fun-type="' + esc(c.type) + '" data-fun-id="' + esc(c.item.id) + '" data-fun-idx="' + idx + '">' + esc(opt) + '</button>';
          }).join('') +
        '</div>' +
        (done ? '<div class="sls-item-meta" role="status"><strong>' + esc(done.is_correct ? WS.t('fun_correct') : WS.t('fun_try')) + ':</strong> ' + esc(localized(c.item, 'explanation_ar', 'explanation_en')) + '</div>' : '') +
      '</article>';
    }).join('');
  }

  function renderAll() {
    if (!dashData) return;
    hydrateFilterCatalog();
    renderActiveFilterChips();
    var scriptSel = document.getElementById('sls-script-select');
    if (scriptSel && dashData.salesScripts) {
      scriptSel.innerHTML = dashData.salesScripts.map(function (s) {
        return '<option value="' + esc(s.id) + '">' + esc(localized(s, 'title_ar', 'title_en')) + '</option>';
      }).join('');
    }
    renderWelcome();
    renderKpis();
    renderTrendsChart();
    renderConversionDonut();
    renderCallsBarChart();
    renderTargetVsReality();
    renderBusinessInsights();
    renderInteractionsAndFollowups();
    renderMotivationAndNotifs();
    renderFunCorner();
  }

  async function loadDashboard() {
    dashData = await WS.apiFetch('/api/sales/dashboard' + buildQueryString(), { method: 'GET' });
    WS.setWorkSession(dashData.workSession);
    renderAll();
  }

  function resetAllFilters() {
    filterState = JSON.parse(JSON.stringify(DEFAULT_FILTERS));
    document.getElementById('sls-dash-search-input').value = '';
    document.getElementById('sls-period-select').value = 'month';
    document.getElementById('sls-custom-dates').hidden = true;
    document.getElementById('sls-flt-contact').value = 'all';
    document.getElementById('sls-flt-followup').value = 'all';
    document.getElementById('sls-flt-referrer').value = '';
    document.getElementById('sls-flt-call-dir').value = 'all';
    document.getElementById('sls-flt-call-outcome').value = 'all';
    document.getElementById('sls-flt-call-duration').value = 'all';
    document.getElementById('sls-flt-category').value = 'all';
    document.getElementById('sls-flt-booking').value = 'all';
    document.getElementById('sls-flt-contract').value = 'all';
    document.querySelectorAll('#sls-adv-filter-panel input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
    loadDashboard();
  }

  function syncAdvCheckboxesToState() {
    var readChecked = function (id) {
      return Array.from(document.querySelectorAll('#' + id + ' input[type="checkbox"]:checked')).map(function (c) { return c.value; });
    };
    filterState.stages = readChecked('sls-ms-stages');
    filterState.govs = readChecked('sls-ms-govs');
    filterState.sources = readChecked('sls-ms-sources');
    filterState.contactState = document.getElementById('sls-flt-contact').value;
    filterState.followupState = document.getElementById('sls-flt-followup').value;
    filterState.referrer = document.getElementById('sls-flt-referrer').value;
    filterState.callDir = document.getElementById('sls-flt-call-dir').value;
    filterState.callOutcome = document.getElementById('sls-flt-call-outcome').value;
    filterState.callDuration = document.getElementById('sls-flt-call-duration').value;
    filterState.category = document.getElementById('sls-flt-category').value;
    filterState.bookingState = document.getElementById('sls-flt-booking').value;
    filterState.contractState = document.getElementById('sls-flt-contract').value;
  }

  function bindDashboardEvents() {
    document.getElementById('sls-period-select').addEventListener('change', function (e) {
      filterState.period = e.target.value;
      document.getElementById('sls-custom-dates').hidden = filterState.period !== 'custom';
      if (filterState.period !== 'custom') loadDashboard();
    });

    document.getElementById('sls-apply-custom').addEventListener('click', function () {
      filterState.from = document.getElementById('sls-date-from').value;
      filterState.to = document.getElementById('sls-date-to').value;
      if (filterState.from && filterState.to) loadDashboard();
    });

    document.getElementById('sls-flt-company').addEventListener('change', function (e) {
      filterState.companyIds = e.target.value ? [e.target.value] : [];
      filterState.programIds = []; // Reset cascading program when company changes
      loadDashboard();
    });

    document.getElementById('sls-flt-program').addEventListener('change', function (e) {
      filterState.programIds = e.target.value ? [e.target.value] : [];
      loadDashboard();
    });

    document.getElementById('sls-toggle-adv-filters').addEventListener('click', function () {
      var panel = document.getElementById('sls-adv-filter-panel');
      var open = panel.hidden;
      panel.hidden = !open;
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.getElementById('sls-ms-stages-search').addEventListener('input', function (e) {
      var term = e.target.value.trim().toLowerCase();
      document.querySelectorAll('#sls-ms-stages .sls-ms-item').forEach(function (lbl) {
        lbl.hidden = term && !(lbl.getAttribute('data-opt-label') || '').includes(term);
      });
    });

    document.getElementById('sls-apply-adv-filters').addEventListener('click', function () {
      syncAdvCheckboxesToState();
      loadDashboard();
    });

    document.getElementById('sls-clear-filters').addEventListener('click', resetAllFilters);
    document.getElementById('sls-clear-adv-filters').addEventListener('click', resetAllFilters);
    document.getElementById('sls-empty-reset-btn').addEventListener('click', resetAllFilters);

    document.getElementById('sls-active-chips-list').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove-chip]');
      if (!btn) return;
      var k = btn.getAttribute('data-remove-chip');
      if (Array.isArray(DEFAULT_FILTERS[k])) {
        filterState[k] = [];
        if (k === 'stages' || k === 'govs' || k === 'sources') {
          document.querySelectorAll('#sls-ms-' + k + ' input[type="checkbox"]').forEach(function (c) { c.checked = false; });
        }
      } else {
        filterState[k] = DEFAULT_FILTERS[k];
        if (k === 'q') document.getElementById('sls-dash-search-input').value = '';
      }
      loadDashboard();
    });

    document.getElementById('sls-dash-search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      filterState.q = (document.getElementById('sls-dash-search-input').value || '').trim();
      loadDashboard();
    });

    document.getElementById('sls-geo-map-body').addEventListener('click', function (e) {
      var tile = e.target.closest('[data-geo]');
      if (!tile) return;
      var g = tile.getAttribute('data-geo');
      var idx = filterState.govs.indexOf(g);
      if (idx === -1) filterState.govs.push(g);
      else filterState.govs.splice(idx, 1);
      loadDashboard();
    });

    document.addEventListener('click', function (e) {
      var row = e.target.closest('tr[data-href]');
      if (row && !e.target.closest('a, button')) {
        window.location.href = row.getAttribute('data-href');
      }
    });

    // Interactive SVG Chart Tooltip
    var tipEl = document.getElementById('sls-chart-tooltip');
    document.addEventListener('pointerover', function (e) {
      var target = e.target.closest('[data-tip]');
      if (!target || !tipEl) return;
      tipEl.textContent = target.getAttribute('data-tip');
      tipEl.hidden = false;
      tipEl.style.left = Math.min(window.innerWidth - 220, e.clientX + 12) + 'px';
      tipEl.style.top = Math.max(8, e.clientY - 32) + 'px';
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest('[data-tip]') && tipEl) tipEl.hidden = true;
    });

    document.getElementById('sls-notifications-list').addEventListener('click', async function (e) {
      var readBtn = e.target.closest('[data-read-notif]');
      if (readBtn) { await WS.apiFetch('/api/sales/notifications/' + encodeURIComponent(readBtn.getAttribute('data-read-notif')) + '/read', { method: 'PATCH' }); await loadDashboard(); return; }
      var delBtn = e.target.closest('[data-del-notif]');
      if (delBtn) { await WS.apiFetch('/api/sales/notifications/' + encodeURIComponent(delBtn.getAttribute('data-del-notif')), { method: 'DELETE' }); await loadDashboard(); }
    });

    document.getElementById('sls-followups-list').addEventListener('click', async function (e) {
      var doneBtn = e.target.closest('[data-complete-fup]');
      if (doneBtn) { await WS.apiFetch('/api/sales/followups/' + encodeURIComponent(doneBtn.getAttribute('data-complete-fup')) + '/complete', { method: 'PATCH' }); await loadDashboard(); }
    });

    document.getElementById('sls-fun-grid').addEventListener('click', async function (e) {
      var btn = e.target.closest('[data-fun-type]');
      if (!btn) return;
      await WS.apiFetch('/api/sales/fun-corner/submit', {
        method: 'POST',
        body: JSON.stringify({
          activityType: btn.getAttribute('data-fun-type'),
          itemId: btn.getAttribute('data-fun-id'),
          selectedIndex: Number(btn.getAttribute('data-fun-idx'))
        })
      });
      await loadDashboard();
    });

    document.getElementById('sls-copy-script-btn').addEventListener('click', async function () {
      if (!dashData || !dashData.salesScripts) return;
      var sel = document.getElementById('sls-script-select');
      var scr = dashData.salesScripts.find(function (s) { return s.id === (sel ? sel.value : ''); }) || dashData.salesScripts[0];
      if (!scr) return;
      try { await navigator.clipboard.writeText(localized(scr, 'body_ar', 'body_en')); } catch (_) {}
      var st = document.getElementById('sls-script-status');
      if (st) { st.textContent = WS.t('script_copied'); st.hidden = false; setTimeout(function () { st.hidden = true; }, 3000); }
    });

    WS.onRefresh(renderAll);
  }

  document.addEventListener('DOMContentLoaded', async function () {
    try {
      await WS.init();
      bindDashboardEvents();
      await loadDashboard();
    } catch (err) {
      var notice = document.getElementById('sls-data-notice');
      if (notice && err && err.message !== 'AUTH_REQUIRED' && err.message !== 'UNAUTHORIZED') {
        notice.textContent = 'Error loading dashboard data: ' + err.message;
      }
    }
  });
})();
