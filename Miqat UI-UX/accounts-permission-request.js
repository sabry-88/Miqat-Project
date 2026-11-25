/* ==========================================================================
   Miqat Accounts Workspace — Page 11: Dedicated Permission Change Request
   ========================================================================== */
(function () {
  'use strict';

  var Data = window.AccountsProfileData;
  var WS = window.AccountsWorkspace;
  if (!Data || !WS) return;

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

  function populatePermissionsSelect() {
    var perms = Data.getPermissions();
    var sel = document.getElementById('prf-req-perm');
    var currentVal = sel.value;
    sel.innerHTML = perms.map(function (p) {
      var label = lang() === 'en' ? (p.name_en || p.name_ar) : (p.name_ar || p.name_en);
      return '<option value="' + esc(p.key) + '">' + esc(label) + '</option>';
    }).join('');
    if (currentVal) sel.value = currentVal;
  }

  function showStatus(key, isError) {
    var el = document.getElementById('prf-req-status');
    el.textContent = t(key);
    el.classList.toggle('is-error', Boolean(isError));
    el.hidden = false;
  }

  document.addEventListener('DOMContentLoaded', function () {
    populatePermissionsSelect();

    var reasonEl = document.getElementById('prf-req-reason');
    reasonEl.addEventListener('input', function () {
      if (reasonEl.value.trim().length >= 10) {
        reasonEl.removeAttribute('aria-invalid');
      }
    });

    document.getElementById('prf-req-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var reason = reasonEl.value.trim();
      if (reason.length < 10) {
        reasonEl.setAttribute('aria-invalid', 'true');
        showStatus('prf_req_error_reason', true);
        reasonEl.focus();
        return;
      }

      reasonEl.removeAttribute('aria-invalid');
      var permKey = document.getElementById('prf-req-perm').value;
      Data.submitPermissionRequest(permKey, reason);
      reasonEl.value = '';
      showStatus('prf_req_submitted', false);
      if (WS.showToast) WS.showToast(t('prf_req_submitted'), 'success');
    });

    if (WS.onPageRefresh) {
      WS.onPageRefresh(populatePermissionsSelect);
    }
  });
})();
