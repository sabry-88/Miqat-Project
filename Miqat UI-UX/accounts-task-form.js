/* ==========================================================================
   Miqat Accounts Workspace — Page 10: Dedicated Task Create / Edit Form
   ========================================================================== */
(function () {
  'use strict';

  var Data = window.AccountsNotificationsData;
  var WS = window.AccountsWorkspace;
  if (!Data || !WS) return;

  var editTaskId = null;
  var cancelUrl = 'accounts-notifications.html#tasks';

  function lang() {
    return (document.documentElement.lang || 'ar').toLowerCase() === 'en' ? 'en' : 'ar';
  }

  function t(key, fallback) {
    var val = WS.t ? WS.t('accounts_workspace.' + key) : null;
    if (!val || val === 'accounts_workspace.' + key) return fallback || key;
    return val;
  }

  function localizedText(item, arKey, enKey) {
    if (!item) return '';
    return lang() === 'en' ? (item[enKey] || item[arKey] || '') : (item[arKey] || item[enKey] || '');
  }

  function getParams() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (_) {
      return new URLSearchParams();
    }
  }

  function applyModeLabels() {
    var isEdit = Boolean(editTaskId);
    document.getElementById('tsk-form-mode-pill').textContent = t(isEdit ? 'tsk_form_mode_edit' : 'tsk_form_mode_create');
    document.getElementById('tsk-form-heading').textContent = t(isEdit ? 'tsk_modal_edit_title' : 'tsk_modal_create_title');
    document.getElementById('tsk-form-subtitle').textContent = t(isEdit ? 'tsk_form_edit_subtitle' : 'tsk_form_create_subtitle');
    document.getElementById('tsk-form-breadcrumb-current').textContent = t(isEdit ? 'tsk_modal_edit_title' : 'tsk_modal_create_title');
    if (!isEdit) {
      document.getElementById('tsk-f-created').value = t('tsk_form_created_readonly');
    }
  }

  function initForm() {
    var params = getParams();
    var idParam = params.get('id');
    var fromNotif = params.get('fromNotif');
    var returnTo = params.get('returnTo');

    if (idParam) {
      var task = Data.getTaskById(idParam);
      if (!task) {
        document.getElementById('tsk-form-not-found').hidden = false;
        document.getElementById('tsk-form-container').hidden = true;
        return;
      }
      editTaskId = task.id;
      cancelUrl = returnTo === 'details'
        ? 'accounts-task-details.html?id=' + encodeURIComponent(task.id)
        : 'accounts-notifications.html#tasks';
      document.getElementById('tsk-form-back-btn').href = cancelUrl;
      document.getElementById('tsk-form-cancel-btn').href = cancelUrl;

      var chip = document.getElementById('tsk-form-id-chip');
      chip.textContent = task.id;
      chip.hidden = false;

      document.getElementById('tsk-f-title').value = localizedText(task, 'title_ar', 'title_en');
      document.getElementById('tsk-f-desc').value = localizedText(task, 'description_ar', 'description_en');
      document.getElementById('tsk-f-date').value = task.taskDate || '';
      document.getElementById('tsk-f-time').value = task.taskTime || '';
      document.getElementById('tsk-f-priority').value = task.priority || 'normal';
      document.getElementById('tsk-f-status').value = task.status || 'pending';
      document.getElementById('tsk-f-assignee').value = localizedText(task, 'responsible_ar', 'responsible_en') || (lang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري');
      document.getElementById('tsk-f-created').value = task.createdAt || '';
      document.getElementById('tsk-f-linked-type').value = (task.linkedRecord && task.linkedRecord.type) || 'none';
      document.getElementById('tsk-f-linked-id').value = (task.linkedRecord && task.linkedRecord.id) || '';
      document.getElementById('tsk-f-notes').value = localizedText(task, 'notes_ar', 'notes_en');
    } else if (fromNotif) {
      var notif = Data.getNotifications(false).find(function (n) { return n.id === fromNotif; });
      if (notif) {
        document.getElementById('tsk-f-title').value = localizedText(notif, 'title_ar', 'title_en');
        document.getElementById('tsk-f-desc').value = localizedText(notif, 'message_ar', 'message_en');
        document.getElementById('tsk-f-priority').value = notif.priority || 'normal';
        if (notif.linkedRecord) {
          document.getElementById('tsk-f-linked-type').value = notif.linkedRecord.type || 'none';
          document.getElementById('tsk-f-linked-id').value = notif.linkedRecord.id || '';
        }
      }
      document.getElementById('tsk-f-assignee').value = lang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري';
    } else {
      document.getElementById('tsk-f-assignee').value = lang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري';
    }

    applyModeLabels();
  }

  function validateTitle() {
    var titleEl = document.getElementById('tsk-f-title');
    var errEl = document.getElementById('tsk-form-error');
    var valid = Boolean(titleEl.value.trim());
    if (!valid) {
      titleEl.setAttribute('aria-invalid', 'true');
      errEl.textContent = t('tsk_validation_title');
      errEl.hidden = false;
    } else {
      titleEl.removeAttribute('aria-invalid');
      errEl.hidden = true;
    }
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateTitle()) {
      document.getElementById('tsk-f-title').focus();
      return;
    }

    var titleVal = document.getElementById('tsk-f-title').value.trim();
    var descVal = document.getElementById('tsk-f-desc').value.trim();
    var notesVal = document.getElementById('tsk-f-notes').value.trim();
    var assigneeVal = document.getElementById('tsk-f-assignee').value.trim() || (lang() === 'en' ? 'Ahmed Sabry' : 'أحمد صبري');
    var linkedType = document.getElementById('tsk-f-linked-type').value;
    var linkedId = document.getElementById('tsk-f-linked-id').value.trim();

    var payload = {
      title_ar: titleVal,
      title_en: titleVal,
      description_ar: descVal,
      description_en: descVal,
      taskDate: document.getElementById('tsk-f-date').value,
      taskTime: document.getElementById('tsk-f-time').value,
      priority: document.getElementById('tsk-f-priority').value,
      status: document.getElementById('tsk-f-status').value,
      responsible_ar: assigneeVal,
      responsible_en: assigneeVal,
      linkedRecord: (linkedType && linkedType !== 'none' && linkedId) ? { type: linkedType, id: linkedId } : null,
      notes_ar: notesVal,
      notes_en: notesVal
    };

    if (editTaskId) {
      Data.updateTask(editTaskId, payload);
      if (WS.showToast) WS.showToast(t('tsk_updated_toast'), 'success');
      window.location.href = cancelUrl;
    } else {
      var created = Data.createTask(payload);
      if (WS.showToast) WS.showToast(t('tsk_created_toast'), 'success');
      window.location.href = created && created.id
        ? 'accounts-task-details.html?id=' + encodeURIComponent(created.id)
        : 'accounts-notifications.html#tasks';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initForm();

    var titleEl = document.getElementById('tsk-f-title');
    titleEl.addEventListener('blur', function () {
      if (titleEl.dataset.touched === 'true') validateTitle();
    });
    titleEl.addEventListener('input', function () {
      titleEl.dataset.touched = 'true';
      if (titleEl.value.trim()) {
        titleEl.removeAttribute('aria-invalid');
        document.getElementById('tsk-form-error').hidden = true;
      }
    });

    document.getElementById('tsk-dedicated-form').addEventListener('submit', handleSubmit);

    if (WS.onPageRefresh) {
      WS.onPageRefresh(function () {
        applyModeLabels();
      });
    }
  });
})();
