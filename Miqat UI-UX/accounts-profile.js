/* ==========================================================================
   Miqat Accounts Workspace — Page 11: Profile & Account Settings Controller
   ========================================================================== */
(function () {
  'use strict';

  var Data = window.AccountsProfileData;
  var WS = window.AccountsWorkspace;
  if (!Data || !WS) return;

  var savedContact = { phone: '', whatsapp: '' };
  var pendingSessionAction = null;

  function lang() {
    return (document.documentElement.lang || 'ar').toLowerCase() === 'en' ? 'en' : 'ar';
  }

  function t(key, fallback) {
    var val = WS.t ? WS.t('accounts_workspace.' + key) : null;
    if (!val || val === 'accounts_workspace.' + key) return fallback || key;
    return val;
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function localizedText(obj, arKey, enKey) {
    if (!obj) return '';
    return lang() === 'en' ? (obj[enKey] || obj[arKey] || '') : (obj[arKey] || obj[enKey] || '');
  }

  function setProfileStatus(stateKey, isError) {
    var el = document.getElementById('prf-profile-status');
    if (!el) return;
    if (!stateKey) {
      el.hidden = true;
      el.textContent = '';
      el.classList.remove('is-error');
      return;
    }
    el.textContent = t(stateKey);
    el.classList.toggle('is-error', Boolean(isError));
    el.hidden = false;
  }

  function renderProfile() {
    var prof = Data.getProfile();
    var fullName = localizedText(prof, 'name_ar', 'name_en');
    var title = localizedText(prof, 'title_ar', 'title_en');
    var dept = localizedText(prof, 'department_ar', 'department_en');

    document.getElementById('prf-avatar').textContent = fullName ? fullName.trim().charAt(0).toUpperCase() : 'M';
    document.getElementById('prf-display-name').textContent = fullName;
    document.getElementById('prf-display-title').textContent = title + ' — ' + dept;

    document.getElementById('prf-val-name').textContent = fullName;
    document.getElementById('prf-val-title').textContent = title;
    document.getElementById('prf-val-dept').textContent = dept;
    document.getElementById('prf-val-id').textContent = prof.id;
    document.getElementById('prf-val-join').textContent = prof.joinDate;
    document.getElementById('prf-val-email').textContent = prof.email;

    savedContact = { phone: prof.phone || '', whatsapp: prof.whatsapp || '' };
    document.getElementById('prf-input-phone').value = savedContact.phone;
    document.getElementById('prf-input-whatsapp').value = savedContact.whatsapp;
  }

  function renderSecurity() {
    var prof = Data.getProfile();
    var sec = Data.getSecurityState();

    document.getElementById('prf-sec-last-login').textContent = prof.lastLoginAt || '—';
    document.getElementById('prf-sec-device').textContent = localizedText(prof, 'lastLoginDevice_ar', 'lastLoginDevice_en');

    var toggle2fa = document.getElementById('prf-sec-2fa-toggle');
    var pill2fa = document.getElementById('prf-sec-2fa-pill');
    toggle2fa.checked = Boolean(sec.twoFactorEnabled);
    pill2fa.textContent = t(sec.twoFactorEnabled ? 'prf_2fa_enabled' : 'prf_2fa_disabled');
    pill2fa.className = 'status-pill ' + (sec.twoFactorEnabled ? 'status-pill-blue' : 'status-pill-slate');

    document.getElementById('prf-sec-alert-toggle').checked = Boolean(sec.newLoginAlertEnabled);
  }

  function renderSessions() {
    var sessions = Data.getSessions();
    var listEl = document.getElementById('prf-sessions-list');
    var endOthersBtn = document.getElementById('prf-btn-end-others');
    var hasOthers = sessions.some(function (s) { return !s.isCurrent; });
    endOthersBtn.disabled = !hasOthers;

    listEl.innerHTML = sessions.map(function (s) {
      return '<div class="prf-list-item ' + (s.isCurrent ? 'is-current' : '') + '">' +
        '<div class="prf-item-main">' +
          '<div class="prf-btn-group">' +
            '<span class="prf-item-title">' + esc(localizedText(s, 'device_ar', 'device_en')) + '</span>' +
            (s.isCurrent
              ? '<span class="status-pill status-pill-amber">' + esc(t('prf_badge_current_session')) + '</span>'
              : '<span class="status-pill status-pill-navy">' + esc(t('prf_session_active')) + '</span>') +
          '</div>' +
          '<div class="prf-item-meta">' +
            esc(s.browser) + ' • ' + esc(s.os) + ' • ' + esc(localizedText(s, 'location_ar', 'location_en')) +
          '</div>' +
          '<div class="prf-item-meta">' + esc(t('prf_lbl_last_activity')) + ': <bdi dir="ltr">' + esc(s.lastActive) + '</bdi></div>' +
        '</div>' +
        (!s.isCurrent
          ? '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-end-session="' + esc(s.id) + '">' + esc(t('prf_btn_terminate')) + '</button>'
          : '') +
      '</div>';
    }).join('');
  }

  function renderActivity() {
    var items = Data.getPersonalActivity();
    var listEl = document.getElementById('prf-activity-list');
    var emptyEl = document.getElementById('prf-activity-empty');

    if (!items.length) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    listEl.innerHTML = items.map(function (act) {
      var pillClass = act.status === 'attention' || act.status === 'pending' ? 'status-pill-amber' : 'status-pill-navy';
      return '<div class="prf-list-item">' +
        '<div class="prf-item-main">' +
          '<span class="prf-item-title">' + esc(localizedText(act, 'desc_ar', 'desc_en')) + '</span>' +
          '<span class="prf-item-meta"><bdi dir="ltr">' + esc(act.timestamp) + '</bdi></span>' +
        '</div>' +
        '<span class="status-pill ' + pillClass + '">' + esc(act.status === 'pending' ? t('prf_perm_status_pending') : t('prf_status_active')) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderDisplayPreferences() {
    var prefs = Data.getDisplayPreferences();
    document.getElementById('prf-pref-font').value = prefs.fontSize || 'medium';
    document.getElementById('prf-pref-density').value = prefs.density || 'comfortable';
    document.getElementById('prf-pref-table').value = prefs.tableDisplay || 'standard';
    document.getElementById('prf-pref-items').value = prefs.itemsPerPage || '20';
    document.getElementById('prf-pref-date').value = prefs.dateFormat || 'iso';
    document.getElementById('prf-pref-num').value = prefs.numberFormat || 'locale';
    Data.applyDisplayPreferencesToDocument(prefs);
  }

  function renderPermissions() {
    var perms = Data.getPermissions();
    document.getElementById('prf-permissions-list').innerHTML = perms.map(function (p) {
      var isPermitted = p.access === 'permitted';
      return '<div class="prf-list-item">' +
        '<div class="prf-item-main">' +
          '<span class="prf-item-title">' + esc(localizedText(p, 'name_ar', 'name_en')) + '</span>' +
        '</div>' +
        '<span class="status-pill ' + (isPermitted ? 'status-pill-navy' : 'status-pill-amber') + '">' +
          esc(t(isPermitted ? 'prf_perm_permitted' : 'prf_perm_admin_approval')) +
        '</span>' +
      '</div>';
    }).join('');

    var reqs = Data.getPermissionRequests();
    var reqListEl = document.getElementById('prf-perm-requests-list');
    var reqEmptyEl = document.getElementById('prf-perm-requests-empty');
    if (!reqs.length) {
      reqListEl.innerHTML = '';
      reqEmptyEl.hidden = false;
      return;
    }
    reqEmptyEl.hidden = true;
    reqListEl.innerHTML = reqs.map(function (r) {
      return '<div class="prf-list-item">' +
        '<div class="prf-item-main">' +
          '<span class="prf-item-title">' + esc(localizedText(r, 'permission_ar', 'permission_en')) + '</span>' +
          '<span class="prf-item-meta">' + esc(r.reason) + ' • <bdi dir="ltr">' + esc(r.submittedAt) + '</bdi></span>' +
        '</div>' +
        '<span class="status-pill status-pill-amber">' + esc(t('prf_perm_status_pending')) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderAll() {
    renderProfile();
    renderSecurity();
    renderSessions();
    renderActivity();
    renderDisplayPreferences();
    renderPermissions();
  }

  function openSessionDialog(mode, sessionId) {
    var dialog = document.getElementById('prf-session-dialog');
    pendingSessionAction = { mode: mode, sessionId: sessionId || null };
    document.getElementById('prf-dialog-title').textContent = t(mode === 'all' ? 'prf_dialog_end_all_title' : 'prf_dialog_end_one_title');
    document.getElementById('prf-dialog-body').textContent = t(mode === 'all' ? 'prf_dialog_end_all_body' : 'prf_dialog_end_one_body');
    dialog.returnValue = '';
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  function isValidPhone(val) {
    var digits = String(val || '').replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 16;
  }

  function bindEvents() {
    var phoneInput = document.getElementById('prf-input-phone');
    var waInput = document.getElementById('prf-input-whatsapp');

    function markDirty() {
      var changed = phoneInput.value.trim() !== savedContact.phone || waInput.value.trim() !== savedContact.whatsapp;
      if (changed) setProfileStatus('prf_state_unsaved', false);
      else setProfileStatus('', false);
    }

    phoneInput.addEventListener('input', markDirty);
    waInput.addEventListener('input', markDirty);

    document.getElementById('prf-btn-cancel').addEventListener('click', function () {
      phoneInput.value = savedContact.phone;
      waInput.value = savedContact.whatsapp;
      phoneInput.removeAttribute('aria-invalid');
      waInput.removeAttribute('aria-invalid');
      setProfileStatus('', false);
    });

    document.getElementById('prf-contact-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var pVal = phoneInput.value.trim();
      var wVal = waInput.value.trim();
      var pOk = isValidPhone(pVal);
      var wOk = isValidPhone(wVal);

      if (!pOk || !wOk) {
        if (!pOk) phoneInput.setAttribute('aria-invalid', 'true');
        else phoneInput.removeAttribute('aria-invalid');
        if (!wOk) waInput.setAttribute('aria-invalid', 'true');
        else waInput.removeAttribute('aria-invalid');
        setProfileStatus('prf_state_validation', true);
        (!pOk ? phoneInput : waInput).focus();
        return;
      }

      phoneInput.removeAttribute('aria-invalid');
      waInput.removeAttribute('aria-invalid');
      setProfileStatus('prf_state_saving', false);

      setTimeout(function () {
        var ok = Data.updateContact(pVal, wVal);
        if (!ok) {
          setProfileStatus('prf_state_failed', true);
          return;
        }
        savedContact = { phone: pVal, whatsapp: wVal };
        setProfileStatus('prf_state_saved', false);
        renderActivity();
        if (WS.showToast) WS.showToast(t('prf_state_saved'), 'success');
      }, 150);
    });

    document.getElementById('prf-sec-2fa-toggle').addEventListener('change', function (e) {
      Data.updateSecurityState({ twoFactorEnabled: e.target.checked });
      renderSecurity();
      renderActivity();
    });

    document.getElementById('prf-sec-alert-toggle').addEventListener('change', function (e) {
      Data.updateSecurityState({ newLoginAlertEnabled: e.target.checked });
      renderSecurity();
      renderActivity();
    });

    document.getElementById('prf-btn-end-others').addEventListener('click', function () {
      openSessionDialog('all', null);
    });

    document.getElementById('prf-sessions-list').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-end-session]');
      if (btn) openSessionDialog('one', btn.getAttribute('data-end-session'));
    });

    var dialog = document.getElementById('prf-session-dialog');
    dialog.addEventListener('close', function () {
      var rv = dialog.returnValue;
      dialog.returnValue = '';
      if (rv === 'confirm' && pendingSessionAction) {
        if (pendingSessionAction.mode === 'all') {
          Data.endOtherSessions();
        } else if (pendingSessionAction.sessionId) {
          Data.terminateSession(pendingSessionAction.sessionId);
        }
        renderSessions();
        renderActivity();
      }
      pendingSessionAction = null;
    });

    document.getElementById('prf-prefs-form').addEventListener('submit', function (e) {
      e.preventDefault();
      Data.saveDisplayPreferences({
        fontSize: document.getElementById('prf-pref-font').value,
        density: document.getElementById('prf-pref-density').value,
        tableDisplay: document.getElementById('prf-pref-table').value,
        itemsPerPage: document.getElementById('prf-pref-items').value,
        dateFormat: document.getElementById('prf-pref-date').value,
        numberFormat: document.getElementById('prf-pref-num').value
      });
      var st = document.getElementById('prf-prefs-status');
      st.textContent = t('prf_prefs_saved');
      st.hidden = false;
      renderActivity();
      if (WS.showToast) WS.showToast(t('prf_prefs_saved'), 'success');
    });

    if (WS.onPageRefresh) {
      WS.onPageRefresh(renderAll);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderAll();
    bindEvents();
  });
})();
