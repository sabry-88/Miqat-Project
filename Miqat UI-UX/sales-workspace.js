/* ==========================================================================
   Miqat Sales & Call Center CRM — Shared Employee Shell & Work Timer Engine
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_LANG = 'miqat_lang';
  var STORAGE_THEME = 'miqat_theme';
  var STORAGE_TOKEN = 'miqat_token';
  var STORAGE_USER = 'miqat_user';

  var API_BASE_URL = (typeof window !== 'undefined' && window.location && window.location.port === '4173')
    ? ''
    : 'http://127.0.0.1:4173';

  var currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  var currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  var currentDict = {};
  var currentUser = null;
  var workSession = null;
  var sessionSyncMs = 0;
  var baseWorkedSeconds = 0;
  var baseBreakElapsedSeconds = 0;
  var tickInterval = null;
  var heartbeatInterval = null;
  var refreshCallbacks = [];

  try {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('data-theme', currentTheme);
  } catch (_) {}

  function t(key, fallback) {
    var sc = currentDict && currentDict.sales_crm;
    if (sc && typeof sc[key] === 'string') return sc[key];
    return fallback || key;
  }

  function formatNumber(val) {
    var num = Number(val);
    if (isNaN(num)) return String(val == null ? '' : val);
    return num.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
  }

  function formatDuration(sec) {
    var s = Math.max(0, Math.floor(Number(sec) || 0));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var rem = s % 60;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return pad(h) + ':' + pad(m) + ':' + pad(rem);
  }

  async function apiFetch(url, options) {
    var opts = Object.assign({ credentials: 'include' }, options || {});
    opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var tok = localStorage.getItem(STORAGE_TOKEN);
    if (tok && !opts.headers.Authorization) {
      opts.headers.Authorization = 'Bearer ' + tok;
    }
    var res = await fetch((url.startsWith('http') ? '' : API_BASE_URL) + url, opts);
    if (res.status === 401) {
      window.location.replace('login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop() || 'sales-dashboard.html'));
      throw new Error('AUTH_REQUIRED');
    }
    var data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'REQUEST_FAILED');
    }
    return data;
  }

  async function loadTranslations(lang) {
    try {
      var res = await fetch('./locales/' + lang + '.json');
      if (!res.ok) return {};
      return await res.json();
    } catch (_) {
      return {};
    }
  }

  function applyStaticTranslations() {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n').replace(/^sales_crm\./, '');
      var txt = t(key, null);
      if (txt) el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder').replace(/^sales_crm\./, '');
      var txt = t(key, null);
      if (txt) el.setAttribute('placeholder', txt);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria').replace(/^sales_crm\./, '');
      var txt = t(key, null);
      if (txt) el.setAttribute('aria-label', txt);
    });

    var langBtn = document.querySelector('#sls-lang-switcher .lang-btn-text');
    if (langBtn) langBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    document.title = t('brand_title') + ' | ' + t('nav_dashboard');
    hydrateEmployeeHeader();
    renderWorkPanel();
  }

  function hydrateEmployeeHeader() {
    if (!currentUser) return;
    var name = currentLang === 'ar' ? (currentUser.name || currentUser.name_ar || 'أحمد صبري') : (currentUser.name_en || currentUser.name || 'Ahmed Sabry');
    var nameEl = document.getElementById('sls-emp-name');
    var avatarEl = document.getElementById('sls-emp-avatar');
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.trim().charAt(0).toUpperCase();
  }

  function applyTheme(theme) {
    currentTheme = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_THEME, currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    var moon = document.querySelector('#sls-theme-toggle .icon-moon');
    var sun = document.querySelector('#sls-theme-toggle .icon-sun');
    if (moon) moon.style.display = currentTheme === 'dark' ? 'none' : 'block';
    if (sun) sun.style.display = currentTheme === 'dark' ? 'block' : 'none';
  }

  async function requireAuth() {
    var data = await apiFetch('/api/auth/me', { method: 'GET' });
    if (!data.authenticated || !data.user || (data.user.role !== 'sales_employee' && data.user.role !== 'sales_agent')) {
      window.location.replace('login.html?redirect=sales-dashboard.html');
      throw new Error('UNAUTHORIZED');
    }
    currentUser = data.user;
    return currentUser;
  }

  /* --------------------------------------------------------------------------
     Work Status & Server-Authoritative Timer Widget
     -------------------------------------------------------------------------- */
  function setWorkSession(ws) {
    workSession = ws || null;
    sessionSyncMs = Date.now();
    baseWorkedSeconds = workSession ? (Number(workSession.liveWorkedSeconds) || 0) : 0;
    baseBreakElapsedSeconds = (workSession && workSession.activeBreak) ? (Number(workSession.activeBreak.elapsedSeconds) || 0) : 0;
    renderWorkPanel();
    startLocalTick();
  }

  function ensureWorkPanelInSidebar() {
    var sidebar = document.getElementById('acc-sidebar');
    if (!sidebar || document.getElementById('sls-work-panel')) return;
    var nav = sidebar.querySelector('.acc-sidebar-nav');
    if (!nav) return;
    var panel = document.createElement('section');
    panel.className = 'sls-work-panel';
    panel.id = 'sls-work-panel';
    panel.setAttribute('aria-label', 'Work Status');
    panel.innerHTML =
      '<div class="sls-work-head">' +
        '<span class="sls-work-title" data-i18n="sales_crm.work_panel_title">حالة العمل والوردية</span>' +
        '<span class="status-pill status-pill-slate" id="sls-work-status-pill" data-i18n="sales_crm.status_not_started">لم تبدأ الوردية</span>' +
      '</div>' +
      '<select id="sls-shift-select" class="acc-filter-select" aria-label="Shift Type">' +
        '<option value="full" data-i18n="sales_crm.shift_full">وردية كاملة (٨ ساعات)</option>' +
        '<option value="half" data-i18n="sales_crm.shift_half">نصف وردية (٤ ساعات)</option>' +
      '</select>' +
      '<div class="sls-timer-readout" id="sls-work-timer"><bdi dir="ltr">00:00:00</bdi></div>' +
      '<progress class="sls-progress" id="sls-work-progress" value="0" max="100" aria-label="Shift Progress"></progress>' +
      '<div class="sls-item-meta" id="sls-breaks-info"></div>' +
      '<div class="sls-break-alert" id="sls-break-alert" role="status" hidden></div>' +
      '<div class="sls-work-actions">' +
        '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" id="sls-btn-start-work" data-i18n="sales_crm.btn_start_work">بدء العمل</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-btn-resume-work" hidden data-i18n="sales_crm.btn_resume_work">استئناف العمل</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-btn-start-break" hidden data-i18n="sales_crm.btn_start_break">بدء استراحة (١٥ د)</button>' +
        '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" id="sls-btn-end-break" hidden data-i18n="sales_crm.btn_end_break">إنهاء الاستراحة</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-btn-go-offline" hidden data-i18n="sales_crm.btn_go_offline">توقف مؤقت (Offline)</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-btn-emergency-stop" hidden data-i18n="sales_crm.btn_emergency_stop">إيقاف طارئ</button>' +
      '</div>';
    sidebar.insertBefore(panel, nav);

    if (!document.getElementById('sls-emergency-dialog')) {
      var dlg = document.createElement('dialog');
      dlg.id = 'sls-emergency-dialog';
      dlg.className = 'sls-dialog';
      dlg.innerHTML =
        '<h2 data-i18n="sales_crm.emergency_dialog_title">إيقاف الوردية الطارئ</h2>' +
        '<p data-i18n="sales_crm.emergency_dialog_body">يُسمح بالإيقاف الطارئ بعد إتمام نصف مدة الوردية على الأقل مع ذكر السبب.</p>' +
        '<form method="dialog" style="display:flex; flex-direction:column; gap:0.75rem;">' +
          '<textarea id="sls-emergency-reason" class="acc-filter-input sls-textarea" rows="3" required></textarea>' +
          '<div style="display:flex; gap:0.5rem; justify-content:flex-end;">' +
            '<button type="submit" value="cancel" class="acc-btn acc-btn-secondary" formnovalidate data-i18n="sales_crm.logout_cancel_btn">البقاء</button>' +
            '<button type="submit" value="confirm" class="acc-btn acc-btn-primary" data-i18n="sales_crm.emergency_confirm_btn">تأكيد الإيقاف</button>' +
          '</div>' +
        '</form>';
      document.body.appendChild(dlg);
    }
  }

  function startLocalTick() {
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
    if (!workSession || (workSession.status !== 'online' && workSession.status !== 'on_break')) return;

    tickInterval = setInterval(function () {
      if (!workSession) return;
      var delta = Math.max(0, Math.floor((Date.now() - sessionSyncMs) / 1000));
      if (workSession.status === 'online') {
        workSession.liveWorkedSeconds = baseWorkedSeconds + delta;
        workSession.remainingWorkSeconds = Math.max(0, workSession.target_seconds - workSession.liveWorkedSeconds);
        workSession.progressPct = Math.min(100, Math.round((workSession.liveWorkedSeconds / workSession.target_seconds) * 1000) / 10);
        workSession.canEmergencyStop = workSession.liveWorkedSeconds >= Math.floor(workSession.target_seconds / 2);
      } else if (workSession.status === 'on_break' && workSession.activeBreak) {
        workSession.activeBreak.elapsedSeconds = baseBreakElapsedSeconds + delta;
        workSession.activeBreak.remainingSeconds = Math.max(0, workSession.activeBreak.allowed_seconds - workSession.activeBreak.elapsedSeconds);
        workSession.activeBreak.overtimeSeconds = Math.max(0, workSession.activeBreak.elapsedSeconds - workSession.activeBreak.allowed_seconds);
        workSession.activeBreak.isOvertime = workSession.activeBreak.overtimeSeconds > 0;
        if (workSession.activeBreak.overtimeSeconds >= 600) {
          apiFetch('/api/sales/work-session', { method: 'GET' })
            .then(function (r) { setWorkSession(r.workSession); })
            .catch(function () {});
          return;
        }
      }
      renderWorkPanel();
    }, 1000);

    if (!heartbeatInterval) {
      heartbeatInterval = setInterval(function () {
        if (workSession && workSession.status === 'online') {
          apiFetch('/api/sales/work-session/heartbeat', { method: 'POST' })
            .then(function (r) {
              if (r.workSession) {
                workSession = r.workSession;
                sessionSyncMs = Date.now();
                baseWorkedSeconds = Number(workSession.liveWorkedSeconds) || 0;
              }
            })
            .catch(function () {});
        }
      }, 30000);
    }
  }

  function renderWorkPanel() {
    var panel = document.getElementById('sls-work-panel');
    if (!panel) return;

    var statusPill = document.getElementById('sls-work-status-pill');
    var timerEl = document.getElementById('sls-work-timer');
    var progEl = document.getElementById('sls-work-progress');
    var breaksEl = document.getElementById('sls-breaks-info');
    var breakAlert = document.getElementById('sls-break-alert');
    var shiftSel = document.getElementById('sls-shift-select');

    var btnStart = document.getElementById('sls-btn-start-work');
    var btnOffline = document.getElementById('sls-btn-go-offline');
    var btnResume = document.getElementById('sls-btn-resume-work');
    var btnBreakStart = document.getElementById('sls-btn-start-break');
    var btnBreakEnd = document.getElementById('sls-btn-end-break');
    var btnEmerg = document.getElementById('sls-btn-emergency-stop');

    if (!workSession) {
      statusPill.textContent = t('status_not_started');
      statusPill.className = 'status-pill status-pill-slate';
      timerEl.textContent = '00:00:00';
      progEl.value = 0;
      progEl.max = 100;
      breaksEl.textContent = t('breaks_remaining') + ': ' + formatNumber(shiftSel.value === 'half' ? 2 : 4);
      breakAlert.hidden = true;

      shiftSel.disabled = false;
      btnStart.hidden = false;
      btnOffline.hidden = true;
      btnResume.hidden = true;
      btnBreakStart.hidden = true;
      btnBreakEnd.hidden = true;
      btnEmerg.hidden = true;
      return;
    }

    shiftSel.value = workSession.shift_type;
    shiftSel.disabled = true;
    timerEl.textContent = formatDuration(workSession.liveWorkedSeconds);
    progEl.value = workSession.progressPct;
    progEl.max = 100;
    var remWork = formatDuration(Math.max(0, workSession.target_seconds - workSession.liveWorkedSeconds));
    breaksEl.textContent = t('lbl_work_remaining') + ': ' + remWork + ' (' + formatNumber(workSession.progressPct) + '%) • ' + t('breaks_remaining') + ': ' + formatNumber(workSession.remainingBreaks) + ' / ' + formatNumber(workSession.maxBreaks);

    var welcomeTimer = document.getElementById('sls-welcome-timer');
    if (welcomeTimer) {
      welcomeTimer.textContent = formatDuration(workSession.liveWorkedSeconds) + ' (' + formatNumber(workSession.progressPct) + '%)';
    }
    var welcomeStatus = document.getElementById('sls-welcome-status-pill');
    if (welcomeStatus) {
      welcomeStatus.textContent = t('status_' + workSession.status);
    }

    if (workSession.status === 'online') {
      statusPill.textContent = t('status_online');
      statusPill.className = 'status-pill status-pill-navy';
      btnStart.hidden = true;
      btnOffline.hidden = false;
      btnResume.hidden = true;
      btnBreakStart.hidden = false;
      btnBreakStart.disabled = workSession.remainingBreaks <= 0;
      btnBreakEnd.hidden = true;
      btnEmerg.hidden = false;
      btnEmerg.disabled = !workSession.canEmergencyStop;
      breakAlert.hidden = true;
    } else if (workSession.status === 'on_break') {
      statusPill.textContent = t('status_on_break');
      statusPill.className = 'status-pill status-pill-amber';
      btnStart.hidden = true;
      btnOffline.hidden = false;
      btnResume.hidden = true;
      btnBreakStart.hidden = true;
      btnBreakEnd.hidden = false;
      btnEmerg.hidden = false;
      btnEmerg.disabled = !workSession.canEmergencyStop;
      if (workSession.activeBreak) {
        if (workSession.activeBreak.isOvertime) {
          breakAlert.textContent = t('break_overtime_warn') + ' (+' + formatDuration(workSession.activeBreak.overtimeSeconds) + ')';
          breakAlert.hidden = false;
        } else {
          breakAlert.textContent = t('status_on_break') + ' — ' + formatDuration(workSession.activeBreak.remainingSeconds);
          breakAlert.hidden = false;
        }
      }
    } else if (workSession.status === 'offline') {
      statusPill.textContent = t('status_offline');
      statusPill.className = 'status-pill status-pill-slate';
      btnStart.hidden = true;
      btnOffline.hidden = true;
      btnResume.hidden = false;
      btnBreakStart.hidden = true;
      btnBreakEnd.hidden = true;
      btnEmerg.hidden = false;
      btnEmerg.disabled = !workSession.canEmergencyStop;
      breakAlert.hidden = true;
    }
  }

  function bindShellEvents() {
    var langBtn = document.getElementById('sls-lang-switcher');
    if (langBtn) {
      langBtn.addEventListener('click', async function () {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem(STORAGE_LANG, currentLang);
        currentDict = await loadTranslations(currentLang);
        applyStaticTranslations();
        refreshCallbacks.forEach(function (cb) { try { cb(); } catch (_) {} });
      });
    }

    var themeBtn = document.getElementById('sls-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
      });
    }

    // Drawer
    var sidebar = document.getElementById('acc-sidebar');
    var backdrop = document.getElementById('acc-drawer-backdrop');
    var openBtn = document.getElementById('acc-hamburger-btn');
    var closeBtn = document.getElementById('acc-drawer-close-btn');
    function setDrawer(open) {
      if (!sidebar || !backdrop) return;
      sidebar.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
    if (backdrop) backdrop.addEventListener('click', function () { setDrawer(false); });

    // Logout native dialog
    var logoutBtn = document.getElementById('sls-logout-btn');
    var logoutDlg = document.getElementById('sls-logout-dialog');
    if (logoutBtn && logoutDlg) {
      logoutBtn.addEventListener('click', function () {
        logoutDlg.returnValue = '';
        logoutDlg.showModal();
      });
      logoutDlg.addEventListener('close', async function () {
        var rv = logoutDlg.returnValue;
        logoutDlg.returnValue = '';
        if (rv === 'confirm') {
          try { await apiFetch('/api/auth/logout', { method: 'POST' }); } catch (_) {}
          localStorage.removeItem(STORAGE_TOKEN);
          localStorage.removeItem(STORAGE_USER);
          window.location.replace('login.html');
        }
      });
    }

    // Work Session Buttons
    var shiftSel = document.getElementById('sls-shift-select');
    if (shiftSel) shiftSel.addEventListener('change', renderWorkPanel);

    var bindAction = function (id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bindAction('sls-btn-start-work', async function () {
      var res = await apiFetch('/api/sales/work-session/start', {
        method: 'POST',
        body: JSON.stringify({ shiftType: shiftSel ? shiftSel.value : 'full' })
      });
      setWorkSession(res.workSession);
      refreshCallbacks.forEach(function (cb) { try { cb(); } catch (_) {} });
    });

    bindAction('sls-btn-go-offline', async function () {
      var res = await apiFetch('/api/sales/work-session/offline', { method: 'POST' });
      setWorkSession(res.workSession);
    });

    bindAction('sls-btn-resume-work', async function () {
      var res = await apiFetch('/api/sales/work-session/resume', { method: 'POST' });
      setWorkSession(res.workSession || null);
    });

    bindAction('sls-btn-start-break', async function () {
      var res = await apiFetch('/api/sales/work-session/break/start', { method: 'POST' });
      setWorkSession(res.workSession);
    });

    bindAction('sls-btn-end-break', async function () {
      var res = await apiFetch('/api/sales/work-session/break/end', { method: 'POST' });
      setWorkSession(res.workSession);
    });

    var emergDlg = document.getElementById('sls-emergency-dialog');
    var emergBtn = document.getElementById('sls-btn-emergency-stop');
    if (emergBtn && emergDlg) {
      emergBtn.addEventListener('click', function () {
        document.getElementById('sls-emergency-reason').value = '';
        emergDlg.returnValue = '';
        emergDlg.showModal();
      });
      emergDlg.addEventListener('close', async function () {
        var rv = emergDlg.returnValue;
        emergDlg.returnValue = '';
        if (rv === 'confirm') {
          var reason = document.getElementById('sls-emergency-reason').value.trim();
          if (!reason) return;
          var res = await apiFetch('/api/sales/work-session/stop', {
            method: 'POST',
            body: JSON.stringify({ emergency: true, reason: reason })
          });
          setWorkSession(res.workSession || null);
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (tickInterval) clearInterval(tickInterval);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    });
  }

  async function init() {
    applyTheme(currentTheme);
    currentDict = await loadTranslations(currentLang);
    await requireAuth();
    ensureWorkPanelInSidebar();
    applyStaticTranslations();
    bindShellEvents();
    try {
      var wsRes = await apiFetch('/api/sales/work-session', { method: 'GET' });
      setWorkSession(wsRes.workSession || null);
    } catch (_) {}
    return currentUser;
  }

  window.SalesWorkspace = {
    init: init,
    apiFetch: apiFetch,
    t: t,
    getLang: function () { return currentLang; },
    formatNumber: formatNumber,
    formatDuration: formatDuration,
    setWorkSession: setWorkSession,
    getWorkSession: function () { return workSession; },
    onRefresh: function (cb) { if (typeof cb === 'function') refreshCallbacks.push(cb); }
  };
})();
