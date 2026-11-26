/* ==========================================================================
   Miqat Sales & Call Center CRM — Page 4: Companies & Programs Controller
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;
  var SH = window.SalesCompaniesShared;

  var state = {
    activeTab: 'companies',
    smartSearchActive: false,
    companies: [],
    programs: [],
    recent: [],
    perfConfig: { isProvisional: true, minReliableBookings: 5 }
  };

  function setTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.sls-tab-btn').forEach(function (btn) {
      var selected = btn.getAttribute('data-tab') === tabName;
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    document.querySelectorAll('.sls-tab-panel').forEach(function (panel) {
      var match = panel.id === 'tab-panel-' + tabName;
      panel.hidden = !match;
    });
    if (tabName === 'recent') loadRecent();
  }

  function updateCompareTray() {
    var ids = SH.getCompareIds();
    var countBadge = document.getElementById('comp-header-compare-count');
    if (countBadge) countBadge.textContent = WS.formatNumber(ids.length) + '/4';

    var tray = document.getElementById('sls-compare-tray');
    if (!tray) return;
    if (!ids.length) {
      tray.hidden = true;
      return;
    }
    tray.hidden = false;
    var en = SH.isEn();
    var titleEl = document.getElementById('sls-compare-tray-title');
    if (titleEl) {
      titleEl.textContent = en
        ? ('Selected for Comparison (' + ids.length + '/4)')
        : ('البرامج المحددة للمقارنة (' + WS.formatNumber(ids.length) + '/4)');
    }
    var chipsEl = document.getElementById('sls-compare-chips');
    if (chipsEl) {
      chipsEl.innerHTML = ids.map(function (id) {
        var prog = state.programs.find(function (p) { return p.id === id; });
        var label = prog ? (en ? prog.title_en : prog.title_ar) : id;
        return '<button type="button" class="sls-filter-chip" data-remove-compare="' + SH.esc(id) + '">' +
          '<span>' + SH.esc(label) + '</span>' +
          '<span aria-hidden="true">×</span>' +
        '</button>';
      }).join('');
    }
    var goBtn = document.getElementById('sls-compare-go-btn');
    if (goBtn) {
      goBtn.classList.toggle('is-disabled', ids.length < 2);
      goBtn.setAttribute('aria-disabled', ids.length < 2 ? 'true' : 'false');
    }
  }

  function renderCompanies() {
    var en = SH.isEn();
    var grid = document.getElementById('comp-cards-grid');
    var q = (document.getElementById('dir-company-search').value || '').trim().toLowerCase();
    var list = state.companies.filter(function (c) {
      if (!q) return true;
      return (c.name_ar || '').toLowerCase().includes(q) ||
        (c.name_en || '').toLowerCase().includes(q) ||
        (c.city_ar || '').toLowerCase().includes(q) ||
        (c.city_en || '').toLowerCase().includes(q) ||
        (c.specialty_ar || '').toLowerCase().includes(q) ||
        (c.specialty_en || '').toLowerCase().includes(q) ||
        (c.license_no || '').toLowerCase().includes(q);
    });

    var countEl = document.getElementById('dir-companies-count');
    if (countEl) {
      countEl.textContent = en
        ? (list.length + ' partner companies available')
        : (WS.formatNumber(list.length) + ' شركة سياحة متاحة');
    }
    var noteEl = document.getElementById('dir-perf-transparency');
    if (noteEl) {
      var minB = state.perfConfig.minReliableBookings || 5;
      noteEl.textContent = en
        ? ('Performance formula: Completed Contracts ÷ Total Bookings × 100. Companies/programs with fewer than ' + minB + ' bookings are flagged as Limited Data (provisional threshold).')
        : ('معادلة الأداء: (العقود المكتملة ÷ إجمالي الحجوزات) × ١٠٠. البرامج أو الشركات الأقل من ' + WS.formatNumber(minB) + ' حجوزات تُميّز بشارة «بيانات محدودة» (حد استرشادي قابل للتعديل).');
    }

    if (!list.length) {
      grid.innerHTML = '<div class="sls-empty-state"><p>' + SH.esc(en ? 'No companies match your search.' : 'لا توجد شركات مطابقة لبحثك.') + '</p></div>';
      return;
    }

    grid.innerHTML = list.map(function (c) {
      var name = en ? c.name_en : c.name_ar;
      var spec = en ? c.specialty_en : c.specialty_ar;
      var city = en ? c.city_en : c.city_ar;
      var op = SH.getOperationalStatusInfo(c.operational_status);
      var fresh = SH.getFreshnessInfo(c.freshness_state);
      return '<article class="sls-sub-card sls-comp-card">' +
        '<div class="sls-prog-card-top">' +
          '<div class="sls-prog-badges">' +
            '<span class="status-pill ' + SH.esc(op.cls) + '">' + SH.esc(op.label) + '</span>' +
            '<span class="status-pill ' + SH.esc(fresh.cls) + '">' + SH.esc(fresh.label) + '</span>' +
            (c.is_pinned ? '<span class="status-pill status-pill-navy">' + SH.esc(en ? 'Pinned' : 'مثبّتة') + '</span>' : '') +
          '</div>' +
          '<span class="sls-item-meta"><bdi dir="ltr">' + SH.esc(c.license_no) + '</bdi></span>' +
        '</div>' +
        '<div>' +
          '<h2 class="sls-item-title">' + SH.esc(name) + '</h2>' +
          '<p class="sls-item-meta">' + SH.esc(spec) + ' • ' + SH.esc(city) + '</p>' +
        '</div>' +
        '<dl class="sls-prog-meta-grid">' +
          '<div><dt>' + SH.esc(en ? 'Programs' : 'البرامج المتاحة') + '</dt><dd><bdi dir="ltr">' + SH.esc(WS.formatNumber(c.total_programs)) + '</bdi> (' + SH.esc(en ? 'Umrah' : 'عمرة') + ': ' + SH.esc(WS.formatNumber(c.umrah_count)) + ' • ' + SH.esc(en ? 'Hajj' : 'حج') + ': ' + SH.esc(WS.formatNumber(c.hajj_count)) + ')</dd></div>' +
          '<div><dt>' + SH.esc(en ? 'Conversion Rate' : 'معدل التحويل') + '</dt><dd><bdi dir="ltr">' + SH.esc(SH.formatConversionSummary(c)) + '</bdi></dd></div>' +
          '<div><dt>' + SH.esc(en ? 'Internal Score' : 'مؤشر الأداء الداخلي') + '</dt><dd><bdi dir="ltr">' + SH.esc(WS.formatNumber(c.fairness_score)) + ' / 100</bdi>' + (c.is_limited_data ? ' • ' + SH.esc(en ? 'Limited Data' : 'بيانات محدودة') : '') + '</dd></div>' +
          '<div><dt>' + SH.esc(en ? 'Last Update' : 'آخر تحديث') + '</dt><dd><bdi dir="ltr">' + SH.esc(SH.formatDateShort(c.last_updated_at)) + '</bdi></dd></div>' +
        '</dl>' +
        '<div class="sls-prog-actions">' +
          '<a href="sales-company-programs.html?companyId=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + SH.esc(en ? 'Open Company Programs' : 'استعراض برامج الشركة') + '</a>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-action="pin-company" data-id="' + SH.esc(c.id) + '" aria-pressed="' + (c.is_pinned ? 'true' : 'false') + '">' +
            SH.esc(c.is_pinned ? (en ? 'Unpin' : 'إلغاء التثبيت') : (en ? 'Pin Company' : 'تثبيت الشركة')) +
          '</button>' +
          '<a href="sales-company-sync.html?companyId=' + encodeURIComponent(c.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + SH.esc(en ? 'Sync' : 'التزامن') + '</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderPrograms() {
    var en = SH.isEn();
    var grid = document.getElementById('prog-cards-grid');
    var compareIds = SH.getCompareIds();
    var countEl = document.getElementById('prog-results-count');
    if (countEl) {
      countEl.textContent = en
        ? (state.programs.length + ' programs shown' + (state.smartSearchActive ? ' (ranked by customer compatibility)' : ''))
        : (WS.formatNumber(state.programs.length) + ' برنامج معروض' + (state.smartSearchActive ? ' (مرتبة حسب التوافق مع متطلبات العميل)' : ''));
    }
    if (!state.programs.length) {
      grid.innerHTML = '<div class="sls-empty-state"><p>' + SH.esc(en ? 'No programs match the selected filters.' : 'لا توجد برامج مطابقة للفلاتر المحددة.') + '</p></div>';
      return;
    }
    grid.innerHTML = state.programs.map(function (p) {
      return SH.renderProgramCardHTML(p, { compareIds: compareIds });
    }).join('');
  }

  function renderFavorites() {
    var en = SH.isEn();
    var grid = document.getElementById('fav-cards-grid');
    var q = (document.getElementById('fav-search').value || '').trim().toLowerCase();
    var favs = state.programs.filter(function (p) {
      if (!p.is_favorite) return false;
      if (!q) return true;
      return (p.title_ar || '').toLowerCase().includes(q) ||
        (p.title_en || '').toLowerCase().includes(q) ||
        (p.company_name_ar || '').toLowerCase().includes(q) ||
        (p.company_name_en || '').toLowerCase().includes(q);
    });
    var badge = document.getElementById('fav-tab-count');
    if (badge) badge.textContent = WS.formatNumber(state.programs.filter(function (p) { return p.is_favorite; }).length);

    if (!favs.length) {
      grid.innerHTML = '<div class="sls-empty-state"><p>' + SH.esc(en ? 'Your personal favorites list is empty. Save any program from the catalog.' : 'قائمة مفضلتك الشخصية فارغة. يمكنك حفظ أي برنامج من الدليل.') + '</p></div>';
      return;
    }
    var compareIds = SH.getCompareIds();
    grid.innerHTML = favs.map(function (p) {
      return SH.renderProgramCardHTML(p, { compareIds: compareIds });
    }).join('');
  }

  function renderRecent() {
    var en = SH.isEn();
    var grid = document.getElementById('recent-cards-grid');
    if (!state.recent.length) {
      grid.innerHTML = '<div class="sls-empty-state"><p>' + SH.esc(en ? 'No recently viewed or recommended programs yet.' : 'لا توجد برامج مشاهدة أو مرشحة مؤخراً بعد.') + '</p></div>';
      return;
    }
    var compareIds = SH.getCompareIds();
    grid.innerHTML = state.recent.map(function (p) {
      var tag = p.context_type === 'recommended'
        ? (en ? 'Recommended to Customer' : 'رُشح لعميل')
        : (en ? 'Recently Viewed' : 'شوهد مؤخراً');
      return '<div class="sls-recent-wrap">' +
        '<div class="sls-recent-meta-bar">' +
          '<span class="status-pill status-pill-blue">' + SH.esc(tag) + '</span>' +
          '<span class="sls-item-meta"><bdi dir="ltr">' + SH.esc(SH.formatDateTime(p.viewed_at)) + '</bdi></span>' +
        '</div>' +
        SH.renderProgramCardHTML(p, { compareIds: compareIds }) +
      '</div>';
    }).join('');
  }

  function hydrateCompanyFilterOptions() {
    var sel = document.getElementById('comp-filter-company');
    if (!sel) return;
    var currentVal = sel.value || 'all';
    var en = SH.isEn();
    sel.innerHTML = '<option value="all">' + SH.esc(en ? 'All Companies' : 'كل الشركات') + '</option>';
    state.companies.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = en ? c.name_en : c.name_ar;
      sel.appendChild(opt);
    });
    sel.value = currentVal;
  }

  async function loadCatalog() {
    var q = document.getElementById('comp-search').value.trim();
    var cat = document.getElementById('comp-category').value;
    var cid = document.getElementById('comp-filter-company').value;
    var sort = document.getElementById('comp-sort').value;
    state.smartSearchActive = false;

    var res = await WS.apiFetch(
      '/api/sales/companies?q=' + encodeURIComponent(q) +
      '&category=' + encodeURIComponent(cat) +
      '&companyId=' + encodeURIComponent(cid) +
      '&sort=' + encodeURIComponent(sort),
      { method: 'GET' }
    );
    state.companies = res.companies || [];
    state.programs = res.programs || [];
    state.perfConfig = res.perf_config || state.perfConfig;
    hydrateCompanyFilterOptions();
    renderAll();
  }

  async function runSmartSearch() {
    var form = document.getElementById('smart-search-form');
    var services = Array.from(form.querySelectorAll('input[name="ss_service"]:checked')).map(function (el) { return el.value; });
    var payload = {
      q: document.getElementById('comp-search').value.trim(),
      companyId: document.getElementById('comp-filter-company').value,
      budget: Number(document.getElementById('ss-budget').value) || 0,
      budgetFlexibilityPct: document.getElementById('ss-flex').value !== '' ? Number(document.getElementById('ss-flex').value) : 10,
      programType: document.getElementById('ss-type').value,
      travelDate: document.getElementById('ss-travel-date').value,
      departurePeriod: document.getElementById('ss-dep-period').value,
      arrivalPeriod: document.getElementById('ss-arr-period').value,
      maxMakkahDistance: Number(document.getElementById('ss-makkah-dist').value) || 0,
      maxMadinahDistance: Number(document.getElementById('ss-madinah-dist').value) || 0,
      accommodationType: document.getElementById('ss-accomm').value,
      minDuration: Number(document.getElementById('ss-min-dur').value) || 0,
      maxDuration: Number(document.getElementById('ss-max-dur').value) || 0,
      hotelStars: Number(document.getElementById('ss-stars').value) || 0,
      roomType: document.getElementById('ss-room').value,
      mealsCode: document.getElementById('ss-meals').value,
      cancellationCode: document.getElementById('ss-cancel').value,
      availabilityStatus: document.getElementById('ss-avail').value,
      services: services
    };
    state.smartSearchActive = true;
    var res = await WS.apiFetch('/api/sales/programs/smart-search', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    state.companies = res.companies || state.companies;
    state.programs = res.programs || [];
    var noteEl = document.getElementById('smart-scoring-note');
    if (noteEl) {
      noteEl.textContent = SH.isEn()
        ? 'Provisional weighted scoring: evaluates only provided criteria with available program data; missing fields are never fabricated.'
        : 'ترتيب استرشادي مرجح: يقيّم المعايير المدخلة التي تتوفر بياناتها فقط دون اختلاق أي بيانات ناقصة.';
    }
    renderAll();
  }

  async function loadRecent() {
    try {
      var res = await WS.apiFetch('/api/sales/programs/recent', { method: 'GET' });
      state.recent = res.items || [];
      renderRecent();
    } catch (_) {}
  }

  function renderAll() {
    renderCompanies();
    renderPrograms();
    renderFavorites();
    renderRecent();
    updateCompareTray();
  }

  async function handleActionClick(e) {
    var chipRemove = e.target.closest('[data-remove-compare]');
    if (chipRemove) {
      var rid = chipRemove.getAttribute('data-remove-compare');
      SH.toggleCompareId(rid);
      renderAll();
      return;
    }

    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var id = btn.getAttribute('data-id');

    if (action === 'fav') {
      await WS.apiFetch('/api/sales/programs/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ programId: id })
      });
      await (state.smartSearchActive ? runSmartSearch() : loadCatalog());
      SH.showToast(SH.isEn() ? 'Personal favorites updated.' : 'تم تحديث مفضلتك الشخصية.');
    } else if (action === 'pin-company') {
      await WS.apiFetch('/api/sales/programs/pin/toggle', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'company', itemId: id })
      });
      await loadCatalog();
    } else if (action === 'pin-program') {
      await WS.apiFetch('/api/sales/programs/pin/toggle', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'program', itemId: id })
      });
      await (state.smartSearchActive ? runSmartSearch() : loadCatalog());
    } else if (action === 'compare') {
      var res = SH.toggleCompareId(id);
      if (res.limitReached) {
        SH.showToast(SH.isEn() ? 'Maximum 4 programs can be compared simultaneously.' : 'الحد الأقصى للمقارنة ٤ برامج في وقت واحد.');
        return;
      }
      var isIn = res.ids.indexOf(id) >= 0;
      document.querySelectorAll('[data-action="compare"][data-id="' + id + '"]').forEach(function (b) {
        b.classList.toggle('acc-btn-primary', isIn);
        b.classList.toggle('acc-btn-secondary', !isIn);
        b.setAttribute('aria-pressed', isIn ? 'true' : 'false');
        b.textContent = isIn ? (SH.isEn() ? 'In Compare ✓' : 'بالمقارنة ✓') : (SH.isEn() ? 'Compare' : 'مقارنة');
      });
      updateCompareTray();
    } else if (action === 'share') {
      var prog = state.programs.find(function (p) { return p.id === id; }) || state.recent.find(function (p) { return p.id === id; });
      if (prog) SH.openWhatsAppShare(prog);
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await WS.init();
    var params = new URLSearchParams(window.location.search);
    var urlTab = params.get('tab');
    var urlProgram = params.get('program');
    if (urlProgram) {
      window.location.replace('sales-program-details.html?id=' + encodeURIComponent(urlProgram));
      return;
    }

    await loadCatalog();
    await loadRecent();
    if (urlTab && ['companies', 'programs', 'favorites', 'recent'].indexOf(urlTab) >= 0) {
      setTab(urlTab);
    }

    document.querySelectorAll('.sls-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { setTab(btn.getAttribute('data-tab')); });
    });

    document.getElementById('dir-company-search').addEventListener('input', renderCompanies);
    document.getElementById('fav-search').addEventListener('input', renderFavorites);
    document.getElementById('comp-search').addEventListener('input', loadCatalog);
    document.getElementById('comp-category').addEventListener('change', loadCatalog);
    document.getElementById('comp-filter-company').addEventListener('change', loadCatalog);
    document.getElementById('comp-sort').addEventListener('change', loadCatalog);

    document.getElementById('toggle-smart-search-btn').addEventListener('click', function () {
      var panel = document.getElementById('smart-search-panel');
      var expanded = !panel.hidden;
      panel.hidden = expanded;
      this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    document.getElementById('smart-search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      runSmartSearch();
    });

    document.getElementById('smart-reset-btn').addEventListener('click', function () {
      document.getElementById('smart-search-form').reset();
      document.getElementById('ss-flex').value = '10';
      loadCatalog();
    });

    document.getElementById('sls-compare-clear-btn').addEventListener('click', function () {
      SH.setCompareIds([]);
      renderAll();
    });

    document.getElementById('sls-compare-go-btn').addEventListener('click', function (e) {
      if (SH.getCompareIds().length < 2) {
        e.preventDefault();
        SH.showToast(SH.isEn() ? 'Select at least 2 programs to compare.' : 'اختر برنامجين على الأقل للمقارنة.');
      }
    });

    document.getElementById('main-content').addEventListener('click', handleActionClick);

    WS.onRefresh(function () {
      hydrateCompanyFilterOptions();
      renderAll();
    });
  });
})();
