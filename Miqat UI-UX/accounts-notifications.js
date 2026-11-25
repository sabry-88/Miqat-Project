/* ==========================================================================
   Miqat Accounts Workspace — Page 10: Notifications & Task List Controller
   ========================================================================== */
(function () {
  'use strict';

  var Data = window.AccountsNotificationsData;
  var WS = window.AccountsWorkspace;
  if (!Data || !WS) return;

  var state = {
    activeTab: 'overview',
    searchQuery: '',
    notifStatus: 'all',
    notifType: 'all',
    notifPriority: 'all',
    taskStatus: 'all',
    taskPriority: 'all',
    taskDue: 'all',
    taskSort: 'system',
    actType: 'all'
  };

  var toastTimer = null;
  var activeToastNotifId = null;

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

  function formatNum(num) {
    return WS.formatNumber ? WS.formatNumber(num) : String(num);
  }

  function formatTimestamp(iso) {
    if (!iso) return '';
    try {
      var d = new Date(String(iso).replace(' ', 'T'));
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleString(lang() === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return String(iso);
    }
  }

  function priorityPillClass(prio) {
    if (prio === 'urgent' || prio === 'important' || prio === 'high') return 'status-pill-amber';
    if (prio === 'normal' || prio === 'medium') return 'status-pill-blue';
    return 'status-pill-slate';
  }

  function taskStatusPillClass(status) {
    if (status === 'completed') return 'status-pill-navy';
    if (status === 'in_progress') return 'status-pill-blue';
    if (status === 'pending') return 'status-pill-amber';
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

  function typeLabel(type) {
    var map = {
      refund: 'ntf_type_refund',
      refund_request: 'ntf_type_refund',
      cancellation: 'ntf_type_cancellation',
      cancellation_request: 'ntf_type_cancellation',
      trip_change: 'ntf_type_modification',
      trip_change_request: 'ntf_type_modification',
      modification: 'ntf_type_modification',
      booking: 'ntf_type_booking',
      booking_created: 'ntf_type_booking',
      collection: 'ntf_type_collection',
      collection_pending: 'ntf_type_collection',
      settlement: 'ntf_type_settlement',
      settlement_update: 'ntf_type_settlement',
      customer_update: 'ntf_type_system',
      system: 'ntf_type_system'
    };
    return t(map[type] || 'ntf_type_system', type);
  }

  function taskStatusLabel(status) {
    return t('tsk_status_' + (status || 'pending'), status);
  }

  function localizedText(item, arKey, enKey) {
    if (!item) return '';
    return lang() === 'en' ? (item[enKey] || item[arKey] || '') : (item[arKey] || item[enKey] || '');
  }

  function matchesSearch(haystackParts) {
    var q = state.searchQuery.trim().toLowerCase();
    if (!q) return true;
    return haystackParts.some(function (part) {
      return String(part || '').toLowerCase().indexOf(q) !== -1;
    });
  }

  function setActiveTab(tabName, focusTab) {
    var valid = ['overview', 'notifications', 'tasks', 'activity'];
    if (valid.indexOf(tabName) === -1) tabName = 'overview';
    state.activeTab = tabName;

    var tabs = document.querySelectorAll('.ntf-tab-btn[role="tab"]');
    tabs.forEach(function (btn) {
      var isSelected = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.tabIndex = isSelected ? 0 : -1;
      var panelId = btn.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.hidden = !isSelected;
      if (isSelected && focusTab) btn.focus();
    });

    if (window.location.hash !== '#' + tabName) {
      try {
        history.replaceState(null, '', '#' + tabName);
      } catch (_) {}
    }
  }

  function openNotification(notifId) {
    var items = Data.getNotifications(false);
    var notif = items.find(function (n) { return n.id === notifId; });
    if (!notif) return;

    Data.markNotificationRead(notifId);

    var url = Data.resolveDestinationUrl(notif.linkedRecord);
    if (!url) {
      if (WS.showToast) WS.showToast(t('ntf_missing_record_toast'), 'warning');
      renderAll();
      return;
    }
    window.location.href = url;
  }

  function getDueBucket(task) {
    if (!task.taskDate) return 'none';
    if (Data.isTaskOverdue(task)) return 'overdue';
    if (task.taskDate === '2026-11-25') return 'today';
    return 'upcoming';
  }

  function getFilteredTasks() {
    var tasks = Data.getTasks().slice();

    if (state.taskSort === 'date') {
      tasks.sort(function (a, b) {
        var da = (a.taskDate || '9999-12-31') + ' ' + (a.taskTime || '23:59');
        var db = (b.taskDate || '9999-12-31') + ' ' + (b.taskTime || '23:59');
        return da.localeCompare(db);
      });
    } else if (state.taskSort === 'priority') {
      var rank = { urgent: 0, important: 1, high: 1, normal: 2, medium: 2, low: 3 };
      tasks.sort(function (a, b) {
        return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
      });
    }

    return tasks.filter(function (task) {
      if (state.taskStatus !== 'all' && task.status !== state.taskStatus) return false;
      if (state.taskPriority !== 'all' && task.priority !== state.taskPriority) return false;
      if (state.taskDue !== 'all' && getDueBucket(task) !== state.taskDue) return false;
      return matchesSearch([
        task.id,
        task.title_ar,
        task.title_en,
        task.description_ar,
        task.description_en,
        task.responsible_ar,
        task.responsible_en,
        task.linkedRecord && task.linkedRecord.id
      ]);
    });
  }

  function renderOverview() {
    var notifs = Data.getNotifications(false);
    var tasks = Data.getTasks();

    var unreadCount = Data.getUnreadCount();
    var dueTodayCount = tasks.filter(function (tk) {
      return (tk.status === 'pending' || tk.status === 'in_progress') && tk.taskDate === '2026-11-25';
    }).length;
    var overdueCount = tasks.filter(function (tk) { return Data.isTaskOverdue(tk); }).length;
    var completedCount = tasks.filter(function (tk) { return tk.status === 'completed'; }).length;

    document.getElementById('ntf-kpi-unread-val').textContent = formatNum(unreadCount);
    document.getElementById('ntf-kpi-unread-pill').textContent = formatNum(unreadCount);
    document.getElementById('ntf-kpi-today-val').textContent = formatNum(dueTodayCount);
    document.getElementById('ntf-kpi-today-pill').textContent = formatNum(dueTodayCount);
    document.getElementById('ntf-kpi-overdue-val').textContent = formatNum(overdueCount);
    document.getElementById('ntf-kpi-overdue-pill').textContent = formatNum(overdueCount);
    document.getElementById('ntf-kpi-completed-val').textContent = formatNum(completedCount);
    document.getElementById('ntf-kpi-completed-pill').textContent = formatNum(completedCount);

    document.getElementById('ntf-tab-unread-count').textContent = formatNum(unreadCount);
    var activeTasksCount = tasks.filter(function (tk) {
      return tk.status === 'pending' || tk.status === 'in_progress';
    }).length;
    document.getElementById('ntf-tab-tasks-count').textContent = formatNum(activeTasksCount);

    var previewNotifs = notifs.filter(function (n) { return n.status === 'unread'; }).slice(0, 4);
    if (!previewNotifs.length) previewNotifs = notifs.slice(0, 4);

    var ovNotifEl = document.getElementById('ntf-overview-notifications');
    ovNotifEl.innerHTML = previewNotifs.length
      ? previewNotifs.map(function (n) {
          return '<article class="ntf-mini-item ' + (n.status === 'unread' ? 'is-unread' : '') + '">' +
            '<div class="ntf-mini-main">' +
              '<div class="ntf-mini-badges">' +
                (n.isNew ? '<span class="status-pill status-pill-amber">' + esc(t('ntf_badge_new')) + '</span>' : '') +
                '<span class="status-pill ' + priorityPillClass(n.priority) + '">' + esc(priorityLabel(n.priority)) + '</span>' +
              '</div>' +
              '<h3 class="ntf-mini-heading">' + esc(localizedText(n, 'title_ar', 'title_en')) + '</h3>' +
              '<div class="ntf-mini-meta"><bdi dir="ltr">' + esc(formatTimestamp(n.createdAt)) + '</bdi>' + (n.linkedRecord && n.linkedRecord.id ? ' • <bdi dir="ltr">' + esc(n.linkedRecord.id) + '</bdi>' : '') + '</div>' +
            '</div>' +
            '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-open-notif="' + esc(n.id) + '">' + esc(t('ntf_toast_open')) + '</button>' +
          '</article>';
        }).join('')
      : '<p class="ntf-muted-text">' + esc(t('ntf_empty_notifications_title')) + '</p>';

    var previewTasks = tasks.filter(function (tk) {
      return tk.status === 'pending' || tk.status === 'in_progress';
    }).slice(0, 4);
    var ovTaskEl = document.getElementById('ntf-overview-tasks');
    ovTaskEl.innerHTML = previewTasks.length
      ? previewTasks.map(function (tk) {
          var overdue = Data.isTaskOverdue(tk);
          return '<article class="ntf-mini-item">' +
            '<div class="ntf-mini-main">' +
              '<div class="ntf-mini-badges">' +
                '<span class="status-pill ' + taskStatusPillClass(tk.status) + '">' + esc(taskStatusLabel(tk.status)) + '</span>' +
                (overdue ? '<span class="status-pill status-pill-amber">' + esc(t('tsk_overdue_badge')) + '</span>' : '') +
              '</div>' +
              '<h3 class="ntf-mini-heading"><a class="ntf-mini-title-link" href="accounts-task-details.html?id=' + encodeURIComponent(tk.id) + '">' + esc(localizedText(tk, 'title_ar', 'title_en')) + '</a></h3>' +
              '<div class="ntf-mini-meta"><bdi dir="ltr">' + esc(tk.taskDate || '—') + (tk.taskTime ? ' ' + esc(tk.taskTime) : '') + '</bdi></div>' +
            '</div>' +
            '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-task-complete="' + esc(tk.id) + '">' + esc(t('tsk_action_complete')) + '</button>' +
          '</article>';
        }).join('')
      : '<p class="ntf-muted-text">' + esc(t('tsk_empty_title')) + '</p>';

    var activities = Data.getActivityFeed().slice(0, 5);
    var ovActEl = document.getElementById('ntf-overview-activity');
    ovActEl.innerHTML = activities.length
      ? activities.map(function (act) {
          var url = act.targetUrl || Data.resolveDestinationUrl(act.linkedRecord);
          return '<article class="ntf-mini-item">' +
            '<div class="ntf-mini-main">' +
              '<div class="ntf-mini-badges"><span class="status-pill status-pill-slate">' + esc(localizedText(act, 'type_ar', 'type_en') || typeLabel(act.type)) + '</span></div>' +
              '<h3 class="ntf-mini-heading">' +
                (url
                  ? '<a class="ntf-mini-title-link" href="' + esc(url) + '">' + esc(localizedText(act, 'title_ar', 'title_en')) + '</a>'
                  : esc(localizedText(act, 'title_ar', 'title_en'))) +
              '</h3>' +
              '<div class="ntf-mini-meta">' + esc(localizedText(act, 'actor_ar', 'actor_en')) + ' • <bdi dir="ltr">' + esc(formatTimestamp(act.timestamp)) + '</bdi></div>' +
            '</div>' +
            (url
              ? '<a class="acc-btn acc-btn-secondary acc-btn-sm" href="' + esc(url) + '">' + esc(t('ntf_toast_open')) + '</a>'
              : '') +
          '</article>';
        }).join('')
      : '<p class="ntf-muted-text">' + esc(t('ntf_activity_empty')) + '</p>';
  }

  function renderNotifications() {
    var prefs = Data.getPreferences();
    var items = Data.getNotifications(false).filter(function (n) {
      if (prefs.hideRead && n.status === 'read' && state.notifStatus === 'all') return false;
      if (state.notifStatus !== 'all' && n.status !== state.notifStatus) return false;
      if (state.notifType !== 'all' && n.eventType !== state.notifType) return false;
      if (state.notifPriority !== 'all' && n.priority !== state.notifPriority) return false;
      return matchesSearch([
        n.id,
        n.title_ar,
        n.title_en,
        n.message_ar,
        n.message_en,
        n.linkedRecord && n.linkedRecord.id
      ]);
    });

    var listEl = document.getElementById('ntf-notifications-list');
    var emptyEl = document.getElementById('ntf-notifications-empty');
    if (!items.length) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = items.map(function (n) {
      var isUnread = n.status === 'unread';
      var hasRecord = Boolean(Data.resolveDestinationUrl(n.linkedRecord));
      return '<article class="acc-card p10-item-card ' + (isUnread ? 'is-unread' : '') + '" data-notif-id="' + esc(n.id) + '">' +
        '<header class="p10-card-header">' +
          '<div class="ntf-item-badges">' +
            (isUnread ? '<span class="ntf-unread-dot" aria-hidden="true"></span>' : '') +
            '<span class="status-pill ' + (isUnread ? 'status-pill-amber' : 'status-pill-slate') + '">' + esc(t(isUnread ? 'ntf_status_unread' : 'ntf_status_read')) + '</span>' +
            (n.isNew ? '<span class="status-pill status-pill-blue">' + esc(t('ntf_badge_new')) + '</span>' : '') +
            '<span class="status-pill ' + priorityPillClass(n.priority) + '">' + esc(priorityLabel(n.priority)) + '</span>' +
            '<span class="status-pill status-pill-navy">' + esc(typeLabel(n.eventType)) + '</span>' +
          '</div>' +
          (n.linkedRecord && n.linkedRecord.id ? '<span class="ntf-record-chip"><bdi dir="ltr">' + esc(n.linkedRecord.id) + '</bdi></span>' : '') +
        '</header>' +
        '<h3 class="p10-card-title">' + esc(localizedText(n, 'title_ar', 'title_en')) + '</h3>' +
        '<p class="p10-card-desc">' + esc(localizedText(n, 'message_ar', 'message_en')) + '</p>' +
        '<div class="p10-card-meta"><bdi dir="ltr">' + esc(formatTimestamp(n.createdAt)) + '</bdi></div>' +
        '<footer class="p10-card-footer">' +
          (hasRecord
            ? '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" data-open-notif="' + esc(n.id) + '">' + esc(t('ntf_action_open_record')) + '</button>'
            : '') +
          (isUnread
            ? '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-mark-read="' + esc(n.id) + '">' + esc(t('ntf_action_mark_read')) + '</button>'
            : '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-mark-unread="' + esc(n.id) + '">' + esc(t('ntf_action_mark_unread')) + '</button>') +
          '<a class="acc-btn acc-btn-secondary acc-btn-sm" href="accounts-task-form.html?fromNotif=' + encodeURIComponent(n.id) + '">' + esc(t('ntf_action_create_task')) + '</a>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-delete-notif="' + esc(n.id) + '">' + esc(t('ntf_action_delete')) + '</button>' +
        '</footer>' +
      '</article>';
    }).join('');
  }

  function renderTasks() {
    var tasks = getFilteredTasks();
    var isCustom = Data.isCustomTaskOrderActive() && state.taskSort === 'system';
    var canReorder = state.taskSort === 'system' && state.taskStatus === 'all' && state.taskPriority === 'all' && state.taskDue === 'all' && !state.searchQuery.trim();

    document.getElementById('ntf-custom-order-badge').hidden = !isCustom;
    document.getElementById('ntf-reset-order-btn').hidden = !Data.isCustomTaskOrderActive();

    var listEl = document.getElementById('ntf-tasks-list');
    var emptyEl = document.getElementById('ntf-tasks-empty');
    if (!tasks.length) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = tasks.map(function (tk, idx) {
      var overdue = Data.isTaskOverdue(tk);
      var linkedUrl = Data.resolveDestinationUrl(tk.linkedRecord);
      var actionBtns = '';
      if (tk.status === 'pending') {
        actionBtns += '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-task-status="' + esc(tk.id) + ':in_progress">' + esc(t('tsk_action_start')) + '</button>';
        actionBtns += '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" data-task-complete="' + esc(tk.id) + '">' + esc(t('tsk_action_complete')) + '</button>';
      } else if (tk.status === 'in_progress') {
        actionBtns += '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" data-task-complete="' + esc(tk.id) + '">' + esc(t('tsk_action_complete')) + '</button>';
      } else {
        actionBtns += '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-task-status="' + esc(tk.id) + ':pending">' + esc(t('tsk_action_reopen')) + '</button>';
      }

      var reorderControls = canReorder
        ? '<div class="ntf-reorder-controls">' +
            '<span class="ntf-drag-handle" draggable="true" role="button" tabindex="0" aria-label="' + esc(t('tsk_drag_handle')) + '" title="' + esc(t('tsk_drag_handle')) + '">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                '<circle cx="9" cy="6" r="1.5"></circle><circle cx="15" cy="6" r="1.5"></circle>' +
                '<circle cx="9" cy="12" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle>' +
                '<circle cx="9" cy="18" r="1.5"></circle><circle cx="15" cy="18" r="1.5"></circle>' +
              '</svg>' +
            '</span>' +
            '<button type="button" class="acc-btn acc-btn-secondary ntf-move-btn" data-move-task="' + esc(tk.id) + ':-1" ' + (idx === 0 ? 'disabled' : '') + ' aria-label="' + esc(t('tsk_move_up')) + '" title="' + esc(t('tsk_move_up')) + '">▲</button>' +
            '<button type="button" class="acc-btn acc-btn-secondary ntf-move-btn" data-move-task="' + esc(tk.id) + ':1" ' + (idx === tasks.length - 1 ? 'disabled' : '') + ' aria-label="' + esc(t('tsk_move_down')) + '" title="' + esc(t('tsk_move_down')) + '">▼</button>' +
          '</div>'
        : '';

      return '<article class="acc-card p10-item-card p10-task-card ntf-task-card" data-task-id="' + esc(tk.id) + '">' +
        reorderControls +
        '<div class="p10-task-content">' +
          '<header class="p10-card-header">' +
            '<div class="ntf-item-badges">' +
              '<span class="status-pill ' + taskStatusPillClass(tk.status) + '">' + esc(taskStatusLabel(tk.status)) + '</span>' +
              '<span class="status-pill ' + priorityPillClass(tk.priority) + '">' + esc(priorityLabel(tk.priority)) + '</span>' +
              (overdue ? '<span class="status-pill status-pill-amber">' + esc(t('tsk_overdue_badge')) + '</span>' : '') +
              '<span class="ntf-record-chip"><bdi dir="ltr">' + esc(tk.id) + '</bdi></span>' +
            '</div>' +
            (tk.linkedRecord && tk.linkedRecord.id
              ? (linkedUrl
                  ? '<a class="ntf-record-link" href="' + esc(linkedUrl) + '"><bdi dir="ltr">' + esc(tk.linkedRecord.id) + '</bdi></a>'
                  : '<span class="ntf-record-chip"><bdi dir="ltr">' + esc(tk.linkedRecord.id) + '</bdi></span>')
              : '') +
          '</header>' +
          '<h3 class="p10-card-title">' +
            '<a class="ntf-item-title-link" href="accounts-task-details.html?id=' + encodeURIComponent(tk.id) + '">' + esc(localizedText(tk, 'title_ar', 'title_en')) + '</a>' +
          '</h3>' +
          (localizedText(tk, 'description_ar', 'description_en')
            ? '<p class="p10-card-desc">' + esc(localizedText(tk, 'description_ar', 'description_en')) + '</p>'
            : '') +
          '<div class="p10-card-meta">' +
            '<span>' + esc(t('tsk_label_date')) + ': <bdi dir="ltr">' + esc(tk.taskDate || '—') + '</bdi></span>' +
            (tk.taskTime ? '<span> • ' + esc(t('tsk_label_time')) + ': <bdi dir="ltr">' + esc(tk.taskTime) + '</bdi></span>' : '') +
            '<span> • ' + esc(t('tsk_label_assignee')) + ': ' + esc(localizedText(tk, 'responsible_ar', 'responsible_en')) + '</span>' +
          '</div>' +
          '<footer class="p10-card-footer">' +
            actionBtns +
            '<a class="acc-btn acc-btn-secondary acc-btn-sm" href="accounts-task-details.html?id=' + encodeURIComponent(tk.id) + '">' + esc(t('tsk_action_details')) + '</a>' +
            '<a class="acc-btn acc-btn-secondary acc-btn-sm" href="accounts-task-form.html?id=' + encodeURIComponent(tk.id) + '">' + esc(t('tsk_action_edit')) + '</a>' +
            (tk.status !== 'cancelled' && tk.status !== 'completed'
              ? '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-task-status="' + esc(tk.id) + ':cancelled">' + esc(t('tsk_action_cancel')) + '</button>'
              : '') +
          '</footer>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderActivity() {
    var items = Data.getActivityFeed().filter(function (act) {
      if (state.actType !== 'all' && act.type !== state.actType) return false;
      return matchesSearch([
        act.id,
        act.title_ar,
        act.title_en,
        act.actor_ar,
        act.actor_en,
        act.ref_id
      ]);
    });

    var listEl = document.getElementById('ntf-activity-list');
    var emptyEl = document.getElementById('ntf-activity-empty');
    if (!items.length) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = items.map(function (act) {
      var url = act.targetUrl || Data.resolveDestinationUrl(act.linkedRecord);
      return '<article class="acc-card p10-item-card">' +
        '<header class="p10-card-header">' +
          '<div class="ntf-item-badges">' +
            '<span class="status-pill status-pill-navy">' + esc(localizedText(act, 'type_ar', 'type_en') || typeLabel(act.type)) + '</span>' +
            '<span class="status-pill status-pill-slate">' + esc(localizedText(act, 'newState_ar', 'newState_en')) + '</span>' +
          '</div>' +
          (act.ref_id ? '<span class="ntf-record-chip"><bdi dir="ltr">' + esc(act.ref_id) + '</bdi></span>' : '') +
        '</header>' +
        '<h3 class="p10-card-title">' + esc(localizedText(act, 'title_ar', 'title_en')) + '</h3>' +
        '<div class="p10-card-meta">' + esc(localizedText(act, 'actor_ar', 'actor_en')) + ' • <bdi dir="ltr">' + esc(formatTimestamp(act.timestamp)) + '</bdi></div>' +
        (url
          ? '<footer class="p10-card-footer"><a class="acc-btn acc-btn-secondary acc-btn-sm" href="' + esc(url) + '">' + esc(t('ntf_action_open_record')) + '</a></footer>'
          : '') +
      '</article>';
    }).join('');
  }

  function renderAll() {
    renderOverview();
    renderNotifications();
    renderTasks();
    renderActivity();
  }

  function playChime() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    } catch (_) {}
  }

  function dismissPopoverToast() {
    var region = document.getElementById('ntf-toast-region');
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    activeToastNotifId = null;
    if (region) {
      try {
        if (region.matches(':popover-open')) region.hidePopover();
      } catch (_) {}
      region.innerHTML = '';
    }
  }

  function showIncomingPopoverToast(notif) {
    var prefs = Data.getPreferences();
    if (prefs.soundEnabled) playChime();
    if (prefs.toastEnabled === false) return;

    var region = document.getElementById('ntf-toast-region');
    if (!region) return;

    activeToastNotifId = notif.id;
    region.innerHTML =
      '<div class="ntf-toast-card">' +
        '<div class="ntf-toast-head">' +
          '<span class="status-pill status-pill-amber">' + esc(t('ntf_badge_new')) + '</span>' +
          '<strong class="ntf-toast-title">' + esc(localizedText(notif, 'title_ar', 'title_en')) + '</strong>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm ntf-toast-close" data-toast-dismiss aria-label="' + esc(t('ntf_toast_dismiss')) + '">×</button>' +
        '</div>' +
        '<p class="ntf-toast-body">' + esc(localizedText(notif, 'message_ar', 'message_en')) + '</p>' +
        '<div class="ntf-toast-actions">' +
          '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" data-toast-open="' + esc(notif.id) + '">' + esc(t('ntf_toast_open')) + '</button>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-toast-read="' + esc(notif.id) + '">' + esc(t('ntf_toast_mark_read')) + '</button>' +
        '</div>' +
      '</div>';

    try {
      if (!region.matches(':popover-open')) region.showPopover();
    } catch (_) {}

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(dismissPopoverToast, 6500);
  }

  function commitDomTaskOrder(listEl, movedId) {
    var cards = Array.prototype.slice.call(listEl.querySelectorAll('.ntf-task-card[data-task-id]'));
    var orderedIds = cards.map(function (c) { return c.getAttribute('data-task-id'); });
    Data.setCustomTaskOrder(orderedIds);
    var newIdx = orderedIds.indexOf(movedId);
    var live = document.getElementById('ntf-dnd-live');
    if (live && newIdx !== -1) {
      live.textContent = t('tsk_moved_announcement') + ' ' + (newIdx + 1);
    }
    renderTasks();
  }

  function moveTaskByStep(taskId, delta) {
    var listEl = document.getElementById('ntf-tasks-list');
    var cards = Array.prototype.slice.call(listEl.querySelectorAll('.ntf-task-card[data-task-id]'));
    var idx = cards.findIndex(function (c) { return c.getAttribute('data-task-id') === taskId; });
    var targetIdx = idx + delta;
    if (idx === -1 || targetIdx < 0 || targetIdx >= cards.length) return;

    var card = cards[idx];
    var refCard = cards[targetIdx];
    if (delta < 0) {
      if (typeof listEl.moveBefore === 'function') listEl.moveBefore(card, refCard);
      else refCard.before(card);
    } else {
      if (typeof listEl.moveBefore === 'function') listEl.moveBefore(card, refCard.nextSibling);
      else refCard.after(card);
    }
    commitDomTaskOrder(listEl, taskId);
  }

  function setupTaskDragAndDrop() {
    var listEl = document.getElementById('ntf-tasks-list');
    var draggedId = null;

    listEl.addEventListener('dragstart', function (e) {
      var handle = e.target.closest('.ntf-drag-handle');
      var card = e.target.closest('.ntf-task-card[data-task-id]');
      if (!handle || !card) {
        e.preventDefault();
        return;
      }
      draggedId = card.getAttribute('data-task-id');
      card.classList.add('is-dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedId);
      }
    });

    listEl.addEventListener('dragover', function (e) {
      if (!draggedId) return;
      e.preventDefault();
      var targetCard = e.target.closest('.ntf-task-card[data-task-id]');
      var draggedCard = listEl.querySelector('.ntf-task-card[data-task-id="' + draggedId + '"]');
      if (!targetCard || !draggedCard || targetCard === draggedCard) return;

      var rect = targetCard.getBoundingClientRect();
      var after = e.clientY > rect.top + rect.height / 2;
      var refNode = after ? targetCard.nextSibling : targetCard;
      if (typeof listEl.moveBefore === 'function') listEl.moveBefore(draggedCard, refNode);
      else listEl.insertBefore(draggedCard, refNode);
    });

    listEl.addEventListener('dragend', function () {
      if (!draggedId) return;
      var draggedCard = listEl.querySelector('.ntf-task-card[data-task-id="' + draggedId + '"]');
      if (draggedCard) draggedCard.classList.remove('is-dragging');
      commitDomTaskOrder(listEl, draggedId);
      draggedId = null;
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && draggedId) {
        draggedId = null;
        renderTasks();
      }
    });
  }

  function bindEvents() {
    var tablist = document.querySelector('.ntf-tablist[role="tablist"]');
    tablist.addEventListener('click', function (e) {
      var btn = e.target.closest('[role="tab"]');
      if (btn) setActiveTab(btn.getAttribute('data-tab'), false);
    });
    tablist.addEventListener('keydown', function (e) {
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var idx = tabs.indexOf(document.activeElement);
      if (idx === -1) return;
      var isRtl = document.documentElement.dir === 'rtl';
      var nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
      var prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === nextKey) {
        e.preventDefault();
        setActiveTab(tabs[(idx + 1) % tabs.length].getAttribute('data-tab'), true);
      } else if (e.key === prevKey) {
        e.preventDefault();
        setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].getAttribute('data-tab'), true);
      }
    });

    var searchInput = document.getElementById('ntf-global-search');
    var clearBtn = document.getElementById('ntf-search-clear');
    searchInput.addEventListener('input', function () {
      state.searchQuery = searchInput.value;
      clearBtn.hidden = !state.searchQuery;
      renderAll();
    });
    clearBtn.addEventListener('click', function () {
      searchInput.value = '';
      state.searchQuery = '';
      clearBtn.hidden = true;
      searchInput.focus();
      renderAll();
    });

    document.getElementById('ntf-btn-mark-all-read').addEventListener('click', function () {
      Data.markAllNotificationsRead();
      if (WS.showToast) WS.showToast(t('ntf_marked_all_read_toast'), 'success');
      renderAll();
    });
    document.getElementById('ntf-btn-simulate').addEventListener('click', function () {
      var created = Data.simulateIncomingNotification();
      renderAll();
      showIncomingPopoverToast(created);
    });

    document.getElementById('ntf-filter-status').addEventListener('change', function (e) {
      state.notifStatus = e.target.value;
      renderNotifications();
    });
    document.getElementById('ntf-filter-type').addEventListener('change', function (e) {
      state.notifType = e.target.value;
      renderNotifications();
    });
    document.getElementById('ntf-filter-priority').addEventListener('change', function (e) {
      state.notifPriority = e.target.value;
      renderNotifications();
    });
    document.getElementById('tsk-filter-status').addEventListener('change', function (e) {
      state.taskStatus = e.target.value;
      renderTasks();
    });
    document.getElementById('tsk-filter-priority').addEventListener('change', function (e) {
      state.taskPriority = e.target.value;
      renderTasks();
    });
    document.getElementById('tsk-filter-due').addEventListener('change', function (e) {
      state.taskDue = e.target.value;
      renderTasks();
    });
    document.getElementById('tsk-sort-select').addEventListener('change', function (e) {
      state.taskSort = e.target.value;
      renderTasks();
    });
    document.getElementById('act-filter-type').addEventListener('change', function (e) {
      state.actType = e.target.value;
      renderActivity();
    });

    document.getElementById('ntf-reset-order-btn').addEventListener('click', function () {
      Data.resetTaskOrder();
      state.taskSort = 'system';
      document.getElementById('tsk-sort-select').value = 'system';
      if (WS.showToast) WS.showToast(t('tsk_order_reset_toast'), 'info');
      renderAll();
    });

    document.getElementById('main-content').addEventListener('click', function (e) {
      var jump = e.target.closest('[data-jump-tab]');
      if (jump) {
        setActiveTab(jump.getAttribute('data-jump-tab'), false);
        return;
      }
      var openBtn = e.target.closest('[data-open-notif]');
      if (openBtn) {
        openNotification(openBtn.getAttribute('data-open-notif'));
        return;
      }
      var markReadBtn = e.target.closest('[data-mark-read]');
      if (markReadBtn) {
        Data.markNotificationRead(markReadBtn.getAttribute('data-mark-read'));
        renderAll();
        return;
      }
      var markUnreadBtn = e.target.closest('[data-mark-unread]');
      if (markUnreadBtn) {
        Data.markNotificationUnread(markUnreadBtn.getAttribute('data-mark-unread'));
        renderAll();
        return;
      }
      var delNotifBtn = e.target.closest('[data-delete-notif]');
      if (delNotifBtn) {
        Data.deleteNotification(delNotifBtn.getAttribute('data-delete-notif'));
        if (WS.showToast) WS.showToast(t('ntf_deleted_toast'), 'info');
        renderAll();
        return;
      }
      var compBtn = e.target.closest('[data-task-complete]');
      if (compBtn) {
        Data.setTaskStatus(compBtn.getAttribute('data-task-complete'), 'completed');
        if (WS.showToast) WS.showToast(t('tsk_completed_toast'), 'success');
        renderAll();
        return;
      }
      var statusBtn = e.target.closest('[data-task-status]');
      if (statusBtn) {
        var parts = statusBtn.getAttribute('data-task-status').split(':');
        Data.setTaskStatus(parts[0], parts[1]);
        if (parts[1] === 'cancelled' && WS.showToast) WS.showToast(t('tsk_cancelled_toast'), 'info');
        renderAll();
        return;
      }
      var moveBtn = e.target.closest('[data-move-task]');
      if (moveBtn) {
        var mParts = moveBtn.getAttribute('data-move-task').split(':');
        moveTaskByStep(mParts[0], Number(mParts[1]));
      }
    });

    var toastRegion = document.getElementById('ntf-toast-region');
    toastRegion.addEventListener('click', function (e) {
      if (e.target.closest('[data-toast-dismiss]')) {
        dismissPopoverToast();
        return;
      }
      var openT = e.target.closest('[data-toast-open]');
      if (openT) {
        var id = openT.getAttribute('data-toast-open');
        dismissPopoverToast();
        openNotification(id);
        return;
      }
      var readT = e.target.closest('[data-toast-read]');
      if (readT) {
        Data.markNotificationRead(readT.getAttribute('data-toast-read'));
        dismissPopoverToast();
        renderAll();
      }
    });
    toastRegion.addEventListener('mouseenter', function () {
      if (toastTimer) clearTimeout(toastTimer);
    });
    toastRegion.addEventListener('mouseleave', function () {
      if (activeToastNotifId) toastTimer = setTimeout(dismissPopoverToast, 4000);
    });

    setupTaskDragAndDrop();

    Data.subscribe(function () {
      renderAll();
    });

    if (WS.onPageRefresh) {
      WS.onPageRefresh(function () {
        renderAll();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var hashTab = (window.location.hash || '').replace('#', '');
    var prefs = Data.getPreferences();
    var initialTab = ['overview', 'notifications', 'tasks', 'activity'].indexOf(hashTab) !== -1
      ? hashTab
      : (prefs.defaultTab || 'overview');

    setActiveTab(initialTab, false);
    bindEvents();
    renderAll();
  });
})();
