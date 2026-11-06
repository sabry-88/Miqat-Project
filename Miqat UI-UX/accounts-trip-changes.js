/**
 * MIQAT ACCOUNTS WORKSPACE — PROGRAM & ITINERARY MODIFICATIONS
 * PAGE 1: TOURISM COMPANIES OVERVIEW CONTROLLER
 * 
 * Manages:
 * - Top 5 Summary KPIs
 * - Employee Presence & Busy State Simulation
 * - Real-time Search by Company Name, License, or Contact
 * - Grid of Tourism Company Cards (STRICTLY NO FINANCIAL AMOUNTS)
 * - Navigation to Company Modification Requests View
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsTripChanges = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let companiesData = [];
  let currentSearch = '';

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
    if (!window.AccountsMockData || typeof window.AccountsMockData.getTourismCompaniesWithModifications !== 'function') {
      console.error('AccountsMockData service not ready');
      return;
    }

    companiesData = window.AccountsMockData.getTourismCompaniesWithModifications();
    renderStats();
    renderCompanies();
    bindEvents();
    initPresence();
  }

  function renderStats() {
    const totalCompanies = companiesData.length;
    let totalRequests = 0;
    let newRequests = 0;
    let inProgress = 0;
    let completed = 0;

    companiesData.forEach(c => {
      totalRequests += (c.totalRequests || 0);
      newRequests += (c.newRequests || 0);
      inProgress += (c.inProgressRequests || 0);
      completed += (c.completedRequests || 0);
    });

    const elTotalComp = document.getElementById('stat-total-companies');
    const elTotalReq = document.getElementById('stat-total-requests');
    const elNewReq = document.getElementById('stat-new-requests');
    const elInProg = document.getElementById('stat-in-progress-requests');
    const elComp = document.getElementById('stat-completed-requests');

    if (elTotalComp) elTotalComp.textContent = formatNum(totalCompanies);
    if (elTotalReq) elTotalReq.textContent = formatNum(totalRequests);
    if (elNewReq) elNewReq.textContent = formatNum(newRequests);
    if (elInProg) elInProg.textContent = formatNum(inProgress);
    if (elComp) elComp.textContent = formatNum(completed);
  }

  function renderCompanies() {
    const grid = document.getElementById('companies-card-grid');
    const emptyState = document.getElementById('companies-empty-state');
    if (!grid) return;

    const lang = getLang();
    const q = currentSearch.toLowerCase().trim();

    const filtered = companiesData.filter(comp => {
      if (!q) return true;
      const name = (lang === 'ar' ? comp.name_ar : (comp.name_en || comp.name_ar)).toLowerCase();
      const license = (lang === 'ar' ? comp.license : (comp.license_en || comp.license)).toLowerCase();
      const contact = (lang === 'ar' ? comp.contact_person_ar : (comp.contact_person_en || comp.contact_person_ar)).toLowerCase();
      const phone = (comp.phone || '') + ' ' + (comp.contact_phone || '');
      return name.includes(q) || license.includes(q) || contact.includes(q) || phone.includes(q);
    });

    if (filtered.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(comp => {
      const companyName = lang === 'ar' ? comp.name_ar : (comp.name_en || comp.name_ar);
      const license = lang === 'ar' ? comp.license : (comp.license_en || comp.license);
      const contactPerson = lang === 'ar' ? comp.contact_person_ar : (comp.contact_person_en || comp.contact_person_ar);
      const lastDate = comp.lastRequestDate || '—';

      // Labels from translation dictionary
      const lblRequests = t('modifications.card_requests_count', 'إجمالي الطلبات', 'Total Requests');
      const lblNew = t('modifications.card_new', 'جديد', 'New');
      const lblInProg = t('modifications.card_in_progress', 'قيد المعالجة', 'In Progress');
      const lblComp = t('modifications.card_completed', 'مكتمل', 'Completed');
      const lblLastReq = t('modifications.card_last_request', 'آخر طلب وارد:', 'Last Request:');
      const lblContact = t('modifications.card_contact_person', 'مسؤول الاتصال:', 'Contact Person:');
      const lblBtn = t('modifications.card_btn_view_requests', 'عرض ومتابعة الطلبات', 'View & Manage Requests');

      return `
        <article class="acc-company-card" data-company-id="${escapeHtml(comp.id)}">
          <div class="acc-company-card-header">
            <div class="acc-company-card-info">
              <h2 class="acc-company-card-title">${escapeHtml(companyName)}</h2>
              <span class="acc-company-card-license">${escapeHtml(license)}</span>
            </div>
            <span class="acc-company-card-badge">${escapeHtml(comp.id)}</span>
          </div>

          <!-- Strictly Operational Metrics (NO FINANCIAL AMOUNTS) -->
          <div class="acc-company-metrics-grid" role="group" aria-label="${escapeHtml(lblRequests)}">
            <div class="acc-comp-metric">
              <span class="acc-comp-metric-label">${escapeHtml(lblRequests)}</span>
              <span class="acc-comp-metric-val">${formatNum(comp.totalRequests)}</span>
            </div>
            <div class="acc-comp-metric">
              <span class="acc-comp-metric-label">${escapeHtml(lblNew)}</span>
              <span class="acc-comp-metric-val" style="color: var(--color-accent);">${formatNum(comp.newRequests)}</span>
            </div>
            <div class="acc-comp-metric">
              <span class="acc-comp-metric-label">${escapeHtml(lblInProg)}</span>
              <span class="acc-comp-metric-val" style="color: var(--color-primary);">${formatNum(comp.inProgressRequests)}</span>
            </div>
            <div class="acc-comp-metric">
              <span class="acc-comp-metric-label">${escapeHtml(lblComp)}</span>
              <span class="acc-comp-metric-val" style="color: var(--color-text-muted);">${formatNum(comp.completedRequests)}</span>
            </div>
          </div>

          <div class="acc-company-card-meta">
            <div class="acc-comp-meta-row">
              <span>${escapeHtml(lblContact)}</span>
              <span>${escapeHtml(contactPerson)} (${escapeHtml(comp.contact_phone || comp.phone)})</span>
            </div>
            <div class="acc-comp-meta-row">
              <span>${escapeHtml(lblLastReq)}</span>
              <span>${escapeHtml(lastDate)}</span>
            </div>
          </div>

          <div class="acc-company-card-actions">
            <a href="accounts-trip-changes-company.html?company=${encodeURIComponent(comp.id)}" class="acc-btn-view-company">
              <span>${escapeHtml(lblBtn)}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform: ${lang === 'ar' ? 'rotate(180deg)' : 'none'};">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  function bindEvents() {
    const searchInput = document.getElementById('companies-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        currentSearch = e.target.value || '';
        renderCompanies();
      });
    }

    function onLangChange() {
      renderStats();
      renderCompanies();
      updatePresenceLabels();
    }
    window.addEventListener('accounts-lang-changed', onLangChange);
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.registerRefreshListener === 'function') {
      window.AccountsWorkspace.registerRefreshListener(onLangChange);
    }
  }

  function initPresence() {
    const state = (window.AccountsMockData && typeof window.AccountsMockData.getEmployeePresenceState === 'function')
      ? window.AccountsMockData.getEmployeePresenceState()
      : 'online_available';

    setPresenceUI(state);

    const btnAvail = document.getElementById('btn-presence-available');
    const btnBusy = document.getElementById('btn-presence-busy');
    const btnOffline = document.getElementById('btn-presence-offline');

    if (btnAvail) {
      btnAvail.addEventListener('click', () => updatePresence('online_available'));
    }
    if (btnBusy) {
      btnBusy.addEventListener('click', () => updatePresence('online_busy'));
    }
    if (btnOffline) {
      btnOffline.addEventListener('click', () => updatePresence('offline'));
    }
  }

  function updatePresence(newState) {
    if (window.AccountsMockData && typeof window.AccountsMockData.setEmployeePresenceState === 'function') {
      window.AccountsMockData.setEmployeePresenceState(newState);
    }
    setPresenceUI(newState);

    // Toast notification
    const lang = getLang();
    let msg = '';
    if (newState === 'online_busy') {
      msg = t('modifications.presence_busy_toast', 'حالتك الآن (مشغول): تم تفعيل كتم الإشعارات وتجميع المهام.');
    } else if (newState === 'online_available') {
      msg = t('modifications.presence_available_toast', 'حالتك الآن (متصل ومتاح): تم استئناف استقبال تنبيهات النظام.');
    } else {
      msg = lang === 'ar' ? 'حالتك الآن: غير متصل' : 'Status: Offline';
    }

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
      window.AccountsWorkspace.showToast(msg);
    }
  }

  function setPresenceUI(state) {
    const dot = document.getElementById('presence-dot');
    const statusText = document.getElementById('presence-status-text');
    const btns = document.querySelectorAll('.acc-presence-btn');

    btns.forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-state') === state);
    });

    if (dot) {
      dot.className = 'acc-presence-dot';
      if (state === 'online_available') dot.classList.add('dot-available');
      else if (state === 'online_busy') dot.classList.add('dot-busy');
      else dot.classList.add('dot-offline');
    }

    if (statusText) {
      if (state === 'online_available') statusText.textContent = t('modifications.presence_online_available', 'متصل ومتاح');
      else if (state === 'online_busy') statusText.textContent = t('modifications.presence_online_busy', 'مشغول');
      else statusText.textContent = t('modifications.presence_offline', 'غير متصل');
    }
  }

  function updatePresenceLabels() {
    const state = (window.AccountsMockData && typeof window.AccountsMockData.getEmployeePresenceState === 'function')
      ? window.AccountsMockData.getEmployeePresenceState()
      : 'online_available';
    setPresenceUI(state);
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    renderCompanies
  };
});
