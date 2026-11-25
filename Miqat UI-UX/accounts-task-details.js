/* ==========================================================================
   Miqat Accounts Workspace — Page 10: Task Details Controller
   ========================================================================== */
(function () {
  'use strict';

  var Data = window.AccountsNotificationsData;
  var WS = window.AccountsWorkspace;
  if (!Data || !WS) return;

  var currentTaskId = null;

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

  function localizedText(item, arKey, enKey) {
    if (!item) return '';
    return lang() === 'en' ? (item[enKey] || item[arKey] || '') : (item[arKey] || item[enKey] || '');
  }

  function formatDateTime(iso) {
    if (!iso) return '—';
    try {
      var d = new Date(String(iso).replace(' ', 'T'));
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleString(lang() === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return String(iso);
    }
  }

  function statusPillClass(status) {
    if (status === 'completed') return 'status-pill-navy';
    if (status === 'in_progress') return 'status-pill-blue';
    if (status === 'pending') return 'status-pill-amber';
    return 'status-pill-slate';
  }

  function priorityPillClass(prio) {
    if (prio === 'urgent' || prio === 'important' || prio === 'high') return 'status-pill-amber';
    if (prio === 'normal' || prio === 'medium') return 'status-pill-blue';
    return 'status-pill-slate';
  }

  function priorityLabel(prio) {
    var map = {
      urgent: 'ntf_prio_urgent',
      important: 'ntf_prio_high',
      high: 'ntf_prio_high',
      normal: 'ntf_prio_medium',
      medium: 'ntf_prio_medium',
      low: 'ntf_prio_low'
    };
    return t(map[prio] || 'ntf_prio_medium', prio);
  }

  function linkedTypeLabel(type) {
    var map = {
      refund: 'ntf_type_refund',
      cancellation: 'ntf_type_cancellation',
      trip_change: 'ntf_type_modification',
      booking: 'ntf_type_booking',
      collection: 'ntf_type_collection',
      settlement: 'ntf_type_settlement'
    };
    return t(map[type] || 'ntf_type_system', type);
  }

  function getTaskIdFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('id') || '';
    } catch (_) {
      return '';
    }
  }

  function render() {
    currentTaskId = getTaskIdFromUrl();
    var task = currentTaskId ? Data.getTaskById(currentTaskId) : null;
    var notFoundEl = document.getElementById('tsk-not-found');
    var detailEl = document.getElementById('tsk-detail-view');

    if (!task) {
      notFoundEl.hidden = false;
      detailEl.hidden = true;
      return;
    }

    notFoundEl.hidden = true;
    detailEl.hidden = false;

    var bcLink = document.getElementById('tsk-breadcrumb-id');
    bcLink.textContent = task.id;
    bcLink.href = 'accounts-task-details.html?id=' + encodeURIComponent(task.id);

    document.getElementById('tsk-detail-title').textContent = localizedText(task, 'title_ar', 'title_en');
    document.getElementById('tsk-detail-desc').textContent = localizedText(task, 'description_ar', 'description_en') || '—';

    var overdue = Data.isTaskOverdue(task);
    document.getElementById('tsk-detail-badges').innerHTML =
      '<span class="ntf-record-chip"><bdi dir="ltr">' + esc(task.id) + '</bdi></span>' +
      '<span class="status-pill ' + statusPillClass(task.status) + '">' + esc(t('tsk_status_' + task.status)) + '</span>' +
      '<span class="status-pill ' + priorityPillClass(task.priority) + '">' + esc(priorityLabel(task.priority)) + '</span>' +
      (overdue ? '<span class="status-pill status-pill-amber">' + esc(t('tsk_overdue_badge')) + '</span>' : '');

    var actionHtml = '';
    if (task.status === 'pending') {
      actionHtml += '<button type="button" class="acc-btn acc-btn-secondary" data-set-status="in_progress">' + esc(t('tsk_action_start')) + '</button>';
      actionHtml += '<button type="button" class="acc-btn acc-btn-primary" data-set-status="completed">' + esc(t('tsk_action_complete')) + '</button>';
    } else if (task.status === 'in_progress') {
      actionHtml += '<button type="button" class="acc-btn acc-btn-primary" data-set-status="completed">' + esc(t('tsk_action_complete')) + '</button>';
    } else {
      actionHtml += '<button type="button" class="acc-btn acc-btn-secondary" data-set-status="pending">' + esc(t('tsk_action_reopen')) + '</button>';
    }
    actionHtml += '<a class="acc-btn acc-btn-secondary" href="accounts-task-form.html?id=' + encodeURIComponent(task.id) + '&returnTo=details">' + esc(t('tsk_action_edit')) + '</a>';
    if (task.status !== 'cancelled' && task.status !== 'completed') {
      actionHtml += '<button type="button" class="acc-btn acc-btn-secondary" data-set-status="cancelled">' + esc(t('tsk_action_cancel')) + '</button>';
    }
    document.getElementById('tsk-detail-actions').innerHTML = actionHtml;

    document.getElementById('tsk-detail-kv').innerHTML =
      '<div class="acc-kv-item"><dt>' + esc(t('tsk_label_date')) + '</dt><dd><bdi dir="ltr">' + esc(task.taskDate || '—') + '</bdi></dd></div>' +
      '<div class="acc-kv-item"><dt>' + esc(t('tsk_label_time')) + '</dt><dd><bdi dir="ltr">' + esc(task.taskTime || '—') + '</bdi></dd></div>' +
      '<div class="acc-kv-item"><dt>' + esc(t('tsk_label_assignee')) + '</dt><dd>' + esc(localizedText(task, 'responsible_ar', 'responsible_en') || '—') + '</dd></div>' +
      '<div class="acc-kv-item"><dt>' + esc(t('tsk_details_created_at')) + '</dt><dd><bdi dir="ltr">' + esc(formatDateTime(task.createdAt)) + '</bdi></dd></div>' +
      '<div class="acc-kv-item"><dt>' + esc(t('tsk_details_updated_at')) + '</dt><dd><bdi dir="ltr">' + esc(formatDateTime(task.updatedAt)) + '</bdi></dd></div>' +
      '<div class="acc-kv-item"><dt>' + esc(t('tsk_details_completed_at')) + '</dt><dd><bdi dir="ltr">' + esc(formatDateTime(task.completedAt)) + '</bdi></dd></div>';

    var linkedCard = document.getElementById('tsk-linked-card');
    var linkedBody = document.getElementById('tsk-linked-body');
    var url = Data.resolveDestinationUrl(task.linkedRecord);
    if (task.linkedRecord && task.linkedRecord.id) {
      linkedCard.hidden = false;
      linkedBody.innerHTML =
        '<div class="tsk-linked-info">' +
          '<span class="status-pill status-pill-navy">' + esc(linkedTypeLabel(task.linkedRecord.type)) + '</span>' +
          '<span class="ntf-record-chip"><bdi dir="ltr">' + esc(task.linkedRecord.id) + '</bdi></span>' +
        '</div>' +
        (url ? '<a class="acc-btn acc-btn-primary" href="' + esc(url) + '">' + esc(t('ntf_action_open_record')) + '</a>' : '');
    } else {
      linkedCard.hidden = true;
    }

    document.getElementById('tsk-detail-notes').value = localizedText(task, 'notes_ar', 'notes_en');
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();

    document.getElementById('tsk-detail-actions').addEventListener('click', function (e) {
      var statusBtn = e.target.closest('[data-set-status]');
      if (statusBtn && currentTaskId) {
        var nextStatus = statusBtn.getAttribute('data-set-status');
        Data.setTaskStatus(currentTaskId, nextStatus);
        if (nextStatus === 'completed' && WS.showToast) WS.showToast(t('tsk_completed_toast'), 'success');
        else if (nextStatus === 'cancelled' && WS.showToast) WS.showToast(t('tsk_cancelled_toast'), 'info');
        render();
      }
    });

    document.getElementById('tsk-save-notes-btn').addEventListener('click', function () {
      if (!currentTaskId) return;
      var notes = document.getElementById('tsk-detail-notes').value.trim();
      Data.updateTask(currentTaskId, { notes_ar: notes, notes_en: notes });
      if (WS.showToast) WS.showToast(t('tsk_notes_saved_toast'), 'success');
      render();
    });

    Data.subscribe(render);
    if (WS.onPageRefresh) WS.onPageRefresh(render);
  });
})();
