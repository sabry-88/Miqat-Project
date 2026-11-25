/* ==========================================================================
   Miqat Accounts Workspace — Page 10: Dedicated Notification Preferences Page
   ========================================================================== */
(function () {
  'use strict';

  var Data = window.AccountsNotificationsData;
  var WS = window.AccountsWorkspace;
  if (!Data || !WS) return;

  function t(key, fallback) {
    var val = WS.t ? WS.t('accounts_workspace.' + key) : null;
    if (!val || val === 'accounts_workspace.' + key) return fallback || key;
    return val;
  }

  function loadPreferencesIntoForm() {
    var prefs = Data.getPreferences();
    document.getElementById('pref-sound').checked = Boolean(prefs.soundEnabled);
    document.getElementById('pref-hide-read').checked = Boolean(prefs.hideRead);
    document.getElementById('pref-whatsapp').checked = Boolean(prefs.whatsappOfflineEnabled);
    document.getElementById('pref-default-tab').value = prefs.defaultTab || 'overview';

    var checks = document.querySelectorAll('#prefs-types-grid input[type="checkbox"]');
    checks.forEach(function (cb) {
      cb.checked = prefs.enabledTypes ? prefs.enabledTypes[cb.value] !== false : true;
    });
  }

  function handleSave(e) {
    e.preventDefault();
    var enabledTypes = {};
    document.querySelectorAll('#prefs-types-grid input[type="checkbox"]').forEach(function (cb) {
      enabledTypes[cb.value] = cb.checked;
    });

    Data.savePreferences({
      soundEnabled: document.getElementById('pref-sound').checked,
      hideRead: document.getElementById('pref-hide-read').checked,
      whatsappOfflineEnabled: document.getElementById('pref-whatsapp').checked,
      defaultTab: document.getElementById('pref-default-tab').value,
      enabledTypes: enabledTypes
    });

    var banner = document.getElementById('prefs-status-banner');
    if (banner) {
      banner.textContent = t('ntf_prefs_saved_toast');
      banner.hidden = false;
    }
    if (WS.showToast) {
      WS.showToast(t('ntf_prefs_saved_toast'), 'success');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadPreferencesIntoForm();
    document.getElementById('ntf-prefs-page-form').addEventListener('submit', handleSave);
    if (WS.onPageRefresh) {
      WS.onPageRefresh(function () {
        var banner = document.getElementById('prefs-status-banner');
        if (banner && !banner.hidden) {
          banner.textContent = t('ntf_prefs_saved_toast');
        }
      });
    }
  });
})();
