/**
 * MIQAT ACCOUNTS WORKSPACE — PAGE 10: NOTIFICATIONS, TASKS & ACTIVITY DATA STORE
 *
 * Strictly Mock UI / Frontend Simulation Store.
 * - Owns NOTIFICATIONS_SEED, TASKS_SEED, preferences, and localStorage persistence.
 * - Reuses existing business IDs and window.AccountsMockData.ACTIVITIES without cloning entities.
 * - Authoritative localStorage keys:
 *   1. miqat_notifications_state
 *   2. miqat_tasks_state
 *   3. miqat_notif_prefs
 * - Unread count is ALWAYS derived dynamically (!deleted && status === 'unread').
 */

(function () {
  'use strict';

  const STORAGE_NOTIFS = 'miqat_notifications_state';
  const STORAGE_TASKS = 'miqat_tasks_state';
  const STORAGE_PREFS = 'miqat_notif_prefs';

  // Simulated current reference timestamp aligned with the Accounts mock dataset (Nov 2026)
  const MOCK_NOW_ISO = '2026-11-25 15:30';

  const DEFAULT_PREFS = {
    soundEnabled: true,
    hideRead: false,
    whatsappOfflineEnabled: false, // UI mock preference only — no real WhatsApp or network detection
    enabledTypes: {
      refund_request: true,
      cancellation_request: true,
      trip_change_request: true,
      collection_pending: true,
      settlement_update: true,
      booking_created: true,
      customer_update: true
    }
  };

  // Routes mapped strictly to existing Accounts Workspace detail pages
  const RECORD_ROUTES = {
    refund: 'accounts-refund-details.html',
    cancellation: 'accounts-cancellation-details.html',
    trip_change: 'accounts-trip-change-details.html',
    booking: 'accounts-booking-details.html',
    collection: 'accounts-collection-details.html',
    settlement: 'accounts-settlement-details.html',
    customer: 'accounts-customer-details.html'
  };

  const NOTIFICATIONS_SEED = [
    {
      id: 'NTF-2026-101',
      eventType: 'refund_request',
      priority: 'urgent',
      status: 'unread',
      isNew: true,
      deleted: false,
      title_ar: 'طلب استرداد مالي عاجل — REF-2026-001',
      title_en: 'Urgent Refund Request — REF-2026-001',
      message_ar: 'تم رفع طلب استرداد مالي جديد يحتاج مراجعة فورية لمطابقة المستندات والرصيد المستحق.',
      message_en: 'A new financial refund request requires immediate review to verify documents and eligible balance.',
      createdAt: '2026-11-25 14:45',
      linkedRecord: { type: 'refund', id: 'REF-2026-001' }
    },
    {
      id: 'NTF-2026-102',
      eventType: 'cancellation_request',
      priority: 'urgent',
      status: 'unread',
      isNew: true,
      deleted: false,
      title_ar: 'طلب إلغاء حجز عاجل — CAN-2026-001',
      title_en: 'Urgent Cancellation Request — CAN-2026-001',
      message_ar: 'وصل طلب إلغاء حجز يتطلب احتساب التسوية المالية ومراجعة شروط الإلغاء قبل الاعتماد.',
      message_en: 'A booking cancellation request requires settlement calculation and policy review before approval.',
      createdAt: '2026-11-25 13:20',
      linkedRecord: { type: 'cancellation', id: 'CAN-2026-001' }
    },
    {
      id: 'NTF-2026-103',
      eventType: 'trip_change_request',
      priority: 'important',
      status: 'unread',
      isNew: true,
      deleted: false,
      title_ar: 'طلب تعديل برنامج ورحلة — CHG-2026-032',
      title_en: 'Program Modification Request — CHG-2026-032',
      message_ar: 'طلب تعديل باقة إقامة مع احتساب الفارق المالي المترتب ومراجعة حالة الدفع.',
      message_en: 'Package modification requested with price difference calculation and payment status verification.',
      createdAt: '2026-11-25 11:10',
      linkedRecord: { type: 'trip_change', id: 'CHG-2026-032' }
    },
    {
      id: 'NTF-2026-104',
      eventType: 'collection_pending',
      priority: 'normal',
      status: 'unread',
      isNew: false,
      deleted: false,
      title_ar: 'تحصيل مالي بانتظار المطابقة — COL-2026-0501',
      title_en: 'Collection Pending Reconciliation — COL-2026-0501',
      message_ar: 'إيصال تحصيل نقدي/بنكي مسجل وينتظر مراجعة موظف الحسابات واعتماده.',
      message_en: 'Recorded collection receipt awaiting Accounts Officer verification and confirmation.',
      createdAt: '2026-11-24 16:30',
      linkedRecord: { type: 'collection', id: 'COL-2026-0501' }
    },
    {
      id: 'NTF-2026-105',
      eventType: 'settlement_update',
      priority: 'normal',
      status: 'read',
      isNew: false,
      deleted: false,
      title_ar: 'تحديث تسوية شركة سياحة — SET-2026-0301',
      title_en: 'Tourism Company Settlement Update — SET-2026-0301',
      message_ar: 'تم تحديث كشف تسوية مستحقات شركة السياحة وهو متاح للمراجعة المالية.',
      message_en: 'Tourism company settlement statement updated and available for financial review.',
      createdAt: '2026-11-23 15:00',
      linkedRecord: { type: 'settlement', id: 'SET-2026-0301' }
    },
    {
      id: 'NTF-2026-106',
      eventType: 'booking_created',
      priority: 'normal',
      status: 'read',
      isNew: false,
      deleted: false,
      title_ar: 'تأكيد قيد مالي لحجز — BK-2026-1045',
      title_en: 'Booking Financial Entry Confirmed — BK-2026-1045',
      message_ar: 'تم تسجيل حجز جديد ومطابقة دفعته الأولى ضمن سجل الحجوزات الموحد.',
      message_en: 'New booking recorded and initial deposit reconciled in the Unified Bookings Register.',
      createdAt: '2026-11-22 10:15',
      linkedRecord: { type: 'booking', id: 'BK-2026-1045' }
    },
    {
      id: 'NTF-2026-107',
      eventType: 'customer_update',
      priority: 'normal',
      status: 'unread',
      isNew: false,
      deleted: false,
      title_ar: 'مراجعة ملف عميل — CUST-1001',
      title_en: 'Customer Dossier Review — CUST-1001',
      message_ar: 'تحديث في سجل المدفوعات المرتبط بملف العميل يتطلب التحقق الروتيني.',
      message_en: 'Payment history update on customer dossier requires routine verification.',
      createdAt: '2026-11-21 09:40',
      linkedRecord: { type: 'customer', id: 'CUST-1001' }
    }
  ];

  const TASKS_SEED = [
    {
      id: 'TSK-2026-201',
      sourceType: 'auto',
      title_ar: 'مراجعة واعتماد طلب الاسترداد REF-2026-001',
      title_en: 'Review & Verify Refund Request REF-2026-001',
      description_ar: 'التحقق من مرفقات الإلغاء والمبلغ الصافي المستحق قبل رفع التوصية المالية.',
      description_en: 'Verify cancellation attachments and net refundable amount before submitting recommendation.',
      createdAt: '2026-11-24 09:00',
      taskDate: '2026-11-25',
      taskTime: '11:00', // Overdue relative to MOCK_NOW_ISO (15:30)
      priority: 'urgent',
      status: 'pending',
      responsible_ar: 'فريق الحسابات المالية',
      responsible_en: 'Accounts Team',
      linkedRecord: { type: 'refund', id: 'REF-2026-001' },
      notes_ar: 'مراجعة إيصال التحويل الأصلي والتأكد من عدم وجود رسوم بنكية معلقة.',
      notes_en: 'Check original transfer receipt and confirm no pending bank fees.',
      systemOrderIndex: 0
    },
    {
      id: 'TSK-2026-202',
      sourceType: 'auto',
      title_ar: 'احتساب تسوية الإلغاء CAN-2026-001',
      title_en: 'Calculate Cancellation Settlement CAN-2026-001',
      description_ar: 'مراجعة شروط الباقة واحتساب صافي المبلغ القابل للاسترداد وفق السياسة المعتمدة.',
      description_en: 'Review package policy and compute net refundable settlement amount.',
      createdAt: '2026-11-25 08:30',
      taskDate: '2026-11-25',
      taskTime: '17:00',
      priority: 'urgent',
      status: 'in_progress',
      responsible_ar: 'فريق الحسابات المالية',
      responsible_en: 'Accounts Team',
      linkedRecord: { type: 'cancellation', id: 'CAN-2026-001' },
      notes_ar: 'بانتظار تأكيد شركة السياحة على تكلفة الفندق.',
      notes_en: 'Awaiting tourism agency confirmation on hotel penalty.',
      systemOrderIndex: 1
    },
    {
      id: 'TSK-2026-203',
      sourceType: 'auto',
      title_ar: 'تدقيق الفارق المالي لتعديل البرنامج CHG-2026-032',
      title_en: 'Audit Price Difference for Trip Change CHG-2026-032',
      description_ar: 'مراجعة الفارق المالي بين البرنامج الأصلي والبرنامج المعدل والتحقق من التحصيل.',
      description_en: 'Verify price difference between original and updated itinerary and confirm payment.',
      createdAt: '2026-11-25 10:15',
      taskDate: '2026-11-25',
      taskTime: '18:30',
      priority: 'important',
      status: 'pending',
      responsible_ar: 'أحمد صبري',
      responsible_en: 'Ahmed Sabry',
      linkedRecord: { type: 'trip_change', id: 'CHG-2026-032' },
      notes_ar: 'التأكد من تطابق المبلغ مع إشعار الدفع.',
      notes_en: 'Ensure amount matches payment notification.',
      systemOrderIndex: 2
    },
    {
      id: 'TSK-2026-204',
      sourceType: 'manual',
      title_ar: 'مطابقة كشف التحصيلات النقدية COL-2026-0501',
      title_en: 'Reconcile Cash Collection Sheet COL-2026-0501',
      description_ar: 'مطابقة حافظة الإيداع البنكي مع إيصالات الفرع المسجلة يدوياً.',
      description_en: 'Match bank deposit slip against manually logged branch receipts.',
      createdAt: '2026-11-23 13:00',
      taskDate: '2026-11-24',
      taskTime: '16:00', // Overdue
      priority: 'normal',
      status: 'pending',
      responsible_ar: 'أحمد صبري',
      responsible_en: 'Ahmed Sabry',
      linkedRecord: { type: 'collection', id: 'COL-2026-0501' },
      notes_ar: 'مراجعة المرجع البنكي مع كشف الحساب اليومي.',
      notes_en: 'Cross-check bank reference against daily statement.',
      systemOrderIndex: 3
    },
    {
      id: 'TSK-2026-205',
      sourceType: 'manual',
      title_ar: 'مراجعة تسوية شركة السياحة SET-2026-0301',
      title_en: 'Review Company Settlement SET-2026-0301',
      description_ar: 'إغلاق مراجعة مستحقات الفترة الحالية وأرشفة المستند المعتمد.',
      description_en: 'Finalize current period company payable review and archive approved sheet.',
      createdAt: '2026-11-20 11:00',
      taskDate: '2026-11-22',
      taskTime: '14:00',
      priority: 'normal',
      status: 'completed',
      responsible_ar: 'أحمد صبري',
      responsible_en: 'Ahmed Sabry',
      linkedRecord: { type: 'settlement', id: 'SET-2026-0301' },
      notes_ar: 'تمت المراجعة والمطابقة بنجاح.',
      notes_en: 'Reviewed and reconciled cleanly.',
      systemOrderIndex: 4
    }
  ];

  const SIMULATED_INCOMING_TEMPLATES = [
    {
      eventType: 'refund_request',
      priority: 'urgent',
      title_ar: 'تنبيه فوري (محاكاة): طلب استرداد مالي جديد REF-2026-002',
      title_en: 'Instant Alert (Simulated): New Refund Request REF-2026-002',
      message_ar: 'محاكاة لوصول إشعار فوري بارتفاع أولوية طلب استرداد جديد للمراجعة.',
      message_en: 'Simulated instant alert for a newly arrived urgent refund request.',
      linkedRecord: { type: 'refund', id: 'REF-2026-002' }
    },
    {
      eventType: 'cancellation_request',
      priority: 'urgent',
      title_ar: 'تنبيه فوري (محاكاة): طلب إلغاء جديد CAN-2026-002',
      title_en: 'Instant Alert (Simulated): New Cancellation Request CAN-2026-002',
      message_ar: 'محاكاة لوصول طلب إلغاء حجز عاجل يتطلب احتساب التسوية.',
      message_en: 'Simulated urgent booking cancellation request awaiting settlement review.',
      linkedRecord: { type: 'cancellation', id: 'CAN-2026-002' }
    },
    {
      eventType: 'trip_change_request',
      priority: 'important',
      title_ar: 'تنبيه فوري (محاكاة): طلب تعديل برنامج CHG-2026-002',
      title_en: 'Instant Alert (Simulated): Program Modification CHG-2026-002',
      message_ar: 'محاكاة لوصول إشعار مهم حول طلب تعديل برنامج بفارق مالي.',
      message_en: 'Simulated important alert for a program modification with price difference.',
      linkedRecord: { type: 'trip_change', id: 'CHG-2026-002' }
    }
  ];

  const listeners = [];
  let storageWarningShown = false;
  let simCounter = 0;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function safeReadStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      return fallback;
    }
  }

  function safeWriteStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (!storageWarningShown && window.AccountsWorkspace && typeof window.AccountsWorkspace.showToast === 'function') {
        storageWarningShown = true;
        const lang = window.AccountsWorkspace.getLang ? window.AccountsWorkspace.getLang() : 'ar';
        window.AccountsWorkspace.showToast(
          lang === 'ar'
            ? 'تعذر حفظ التغييرات محلياً (مساحة المتصفح غير متاحة أو ممتلئة).'
            : 'Unable to persist changes locally (browser storage unavailable or full).'
        );
      }
      return false;
    }
  }

  function getActiveOfficer() {
    const lang = (window.AccountsWorkspace && window.AccountsWorkspace.getLang) ? window.AccountsWorkspace.getLang() : 'ar';
    const domName = document.getElementById('acc-employee-name');
    if (domName && domName.textContent.trim()) {
      return {
        ar: lang === 'ar' ? domName.textContent.trim() : 'أحمد صبري',
        en: lang === 'en' ? domName.textContent.trim() : 'Ahmed Sabry'
      };
    }
    return { ar: 'أحمد صبري', en: 'Ahmed Sabry' };
  }

  function resolveDestinationUrl(linkedRecord) {
    if (!linkedRecord || !linkedRecord.type || !linkedRecord.id) return null;
    const base = RECORD_ROUTES[linkedRecord.type];
    if (!base) return null;
    return base + '?id=' + encodeURIComponent(linkedRecord.id);
  }

  // --- Notifications State ---
  function loadNotificationsState() {
    const saved = safeReadStorage(STORAGE_NOTIFS, null);
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const initial = clone(NOTIFICATIONS_SEED);
    safeWriteStorage(STORAGE_NOTIFS, initial);
    return initial;
  }

  function saveNotificationsState(list) {
    safeWriteStorage(STORAGE_NOTIFS, list);
    notifyListeners('notifications');
  }

  function getNotifications(includeDeleted) {
    const list = loadNotificationsState();
    return includeDeleted ? list : list.filter(n => !n.deleted);
  }

  function getUnreadCount() {
    const list = loadNotificationsState();
    return list.filter(n => !n.deleted && n.status === 'unread').length;
  }

  function markNotificationRead(id) {
    const list = loadNotificationsState();
    const target = list.find(n => n.id === id);
    if (!target) return null;
    target.status = 'read';
    target.isNew = false;
    saveNotificationsState(list);
    return target;
  }

  function markNotificationUnread(id) {
    const list = loadNotificationsState();
    const target = list.find(n => n.id === id);
    if (!target) return null;
    target.status = 'unread';
    // Rule: Manually marking an old notification Unread must NEVER restore isNew
    target.isNew = false;
    saveNotificationsState(list);
    return target;
  }

  function markAllNotificationsRead() {
    const list = loadNotificationsState();
    let changed = false;
    list.forEach(n => {
      if (!n.deleted && (n.status === 'unread' || n.isNew)) {
        n.status = 'read';
        n.isNew = false;
        changed = true;
      }
    });
    if (changed) saveNotificationsState(list);
    return changed;
  }

  function deleteNotification(id) {
    const list = loadNotificationsState();
    const target = list.find(n => n.id === id);
    if (!target) return false;
    target.deleted = true;
    target.isNew = false;
    saveNotificationsState(list);
    return true;
  }

  function simulateIncomingNotification() {
    const tpl = SIMULATED_INCOMING_TEMPLATES[simCounter % SIMULATED_INCOMING_TEMPLATES.length];
    simCounter += 1;
    const list = loadNotificationsState();
    const newNotif = {
      id: 'NTF-SIM-' + Date.now().toString().slice(-5),
      eventType: tpl.eventType,
      priority: tpl.priority,
      status: 'unread',
      isNew: true,
      deleted: false,
      title_ar: tpl.title_ar,
      title_en: tpl.title_en,
      message_ar: tpl.message_ar,
      message_en: tpl.message_en,
      createdAt: MOCK_NOW_ISO,
      linkedRecord: clone(tpl.linkedRecord)
    };
    list.unshift(newNotif);
    saveNotificationsState(list);
    return newNotif;
  }

  // --- Tasks State ---
  function loadTasksStore() {
    const saved = safeReadStorage(STORAGE_TASKS, null);
    if (saved && Array.isArray(saved.items)) {
      return {
        items: saved.items,
        customOrderIds: Array.isArray(saved.customOrderIds) ? saved.customOrderIds : null
      };
    }
    const initial = { items: clone(TASKS_SEED), customOrderIds: null };
    safeWriteStorage(STORAGE_TASKS, initial);
    return initial;
  }

  function saveTasksStore(store) {
    safeWriteStorage(STORAGE_TASKS, store);
    notifyListeners('tasks');
  }

  function priorityRank(p) {
    if (p === 'urgent') return 0;
    if (p === 'important') return 1;
    return 2;
  }

  function isTaskOverdue(task) {
    if (!task) return false;
    if (task.status === 'completed' || task.status === 'cancelled') return false;
    const dt = (task.taskDate || '') + ' ' + (task.taskTime || '23:59');
    return dt < MOCK_NOW_ISO;
  }

  function sortTasksSystem(items) {
    return items.slice().sort((a, b) => {
      const doneA = (a.status === 'completed' || a.status === 'cancelled') ? 1 : 0;
      const doneB = (b.status === 'completed' || b.status === 'cancelled') ? 1 : 0;
      if (doneA !== doneB) return doneA - doneB;
      const pDiff = priorityRank(a.priority) - priorityRank(b.priority);
      if (pDiff !== 0) return pDiff;
      const dtA = (a.taskDate || '9999-99-99') + ' ' + (a.taskTime || '23:59');
      const dtB = (b.taskDate || '9999-99-99') + ' ' + (b.taskTime || '23:59');
      if (dtA !== dtB) return dtA.localeCompare(dtB);
      return (a.systemOrderIndex || 0) - (b.systemOrderIndex || 0);
    });
  }

  function getTasks() {
    const store = loadTasksStore();
    const items = store.items.slice();
    if (!store.customOrderIds || store.customOrderIds.length === 0) {
      return sortTasksSystem(items);
    }
    const orderMap = {};
    store.customOrderIds.forEach((id, idx) => { orderMap[id] = idx; });
    const systemSorted = sortTasksSystem(items);
    return systemSorted.sort((a, b) => {
      const hasA = Object.prototype.hasOwnProperty.call(orderMap, a.id);
      const hasB = Object.prototype.hasOwnProperty.call(orderMap, b.id);
      if (hasA && hasB) return orderMap[a.id] - orderMap[b.id];
      if (hasA) return -1;
      if (hasB) return 1;
      return 0;
    });
  }

  function isCustomTaskOrderActive() {
    const store = loadTasksStore();
    return Array.isArray(store.customOrderIds) && store.customOrderIds.length > 0;
  }

  function getTaskById(id) {
    if (!id) return null;
    const store = loadTasksStore();
    return store.items.find(t => t.id === id) || null;
  }

  function createTask(data) {
    const store = loadTasksStore();
    const officer = getActiveOfficer();
    const newId = 'TSK-' + Date.now().toString().slice(-6);
    const linked = (data.linkedType && data.linkedId)
      ? { type: data.linkedType, id: data.linkedId.trim() }
      : null;

    const task = {
      id: newId,
      sourceType: 'manual',
      title_ar: data.title_ar || data.title || 'مهمة حسابية جديدة',
      title_en: data.title_en || data.title || 'New Accounts Task',
      description_ar: data.description_ar || data.description || '',
      description_en: data.description_en || data.description || '',
      createdAt: MOCK_NOW_ISO,
      taskDate: data.taskDate || '2026-11-26',
      taskTime: data.taskTime || '12:00',
      priority: data.priority || 'normal',
      status: 'pending',
      responsible_ar: officer.ar,
      responsible_en: officer.en,
      linkedRecord: linked,
      notes_ar: data.notes_ar || data.notes || '',
      notes_en: data.notes_en || data.notes || '',
      systemOrderIndex: store.items.length
    };
    store.items.unshift(task);
    if (Array.isArray(store.customOrderIds)) {
      store.customOrderIds.unshift(newId);
    }
    saveTasksStore(store);
    return task;
  }

  function updateTask(id, patch) {
    const store = loadTasksStore();
    const idx = store.items.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const current = store.items[idx];
    const updated = Object.assign({}, current, patch);
    store.items[idx] = updated;
    saveTasksStore(store);
    return updated;
  }

  function setTaskStatus(id, status) {
    const valid = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (valid.indexOf(status) === -1) return null;
    return updateTask(id, { status: status });
  }

  function setCustomTaskOrder(orderedIds) {
    const store = loadTasksStore();
    store.customOrderIds = orderedIds.slice();
    saveTasksStore(store);
  }

  function resetTaskOrder() {
    const store = loadTasksStore();
    store.customOrderIds = null;
    saveTasksStore(store);
  }

  // --- Preferences State ---
  function getPreferences() {
    const saved = safeReadStorage(STORAGE_PREFS, null);
    if (saved && typeof saved === 'object') {
      return Object.assign({}, clone(DEFAULT_PREFS), saved, {
        enabledTypes: Object.assign({}, DEFAULT_PREFS.enabledTypes, saved.enabledTypes || {})
      });
    }
    const initial = clone(DEFAULT_PREFS);
    safeWriteStorage(STORAGE_PREFS, initial);
    return initial;
  }

  function savePreferences(prefs) {
    const merged = Object.assign({}, clone(DEFAULT_PREFS), prefs, {
      enabledTypes: Object.assign({}, DEFAULT_PREFS.enabledTypes, (prefs && prefs.enabledTypes) || {})
    });
    safeWriteStorage(STORAGE_PREFS, merged);
    notifyListeners('prefs');
    return merged;
  }

  // --- Activity Feed (Reuses AccountsMockData.ACTIVITIES without duplicating records) ---
  function inferRouteFromRef(refId) {
    if (!refId) return null;
    const upper = String(refId).toUpperCase();
    if (upper.startsWith('BK-')) return { type: 'booking', id: refId };
    if (upper.startsWith('CHG-')) return { type: 'trip_change', id: refId };
    if (upper.startsWith('REF-')) return { type: 'refund', id: refId };
    if (upper.startsWith('CAN-')) return { type: 'cancellation', id: refId };
    if (upper.startsWith('COL-')) return { type: 'collection', id: refId };
    if (upper.startsWith('SET-')) return { type: 'settlement', id: refId };
    if (upper.startsWith('CUST-')) return { type: 'customer', id: refId };
    return null;
  }

  function getActorDisplay(empKey) {
    const map = {
      ahmed_sabry: { ar: 'أحمد صبري', en: 'Ahmed Sabry' },
      sarah_mansour: { ar: 'سارة منصور', en: 'Sarah Mansour' },
      omar_sharif: { ar: 'عمر شريف', en: 'Omar Sharif' }
    };
    return map[empKey] || { ar: 'فريق الحسابات المالية', en: 'Accounts Team' };
  }

  function getActivityFeed() {
    const raw = (window.AccountsMockData && Array.isArray(window.AccountsMockData.ACTIVITIES))
      ? window.AccountsMockData.ACTIVITIES
      : [];

    return raw.map(act => {
      const actor = getActorDisplay(act.employee);
      const linked = inferRouteFromRef(act.ref_id);
      return {
        id: act.id,
        type: act.type,
        type_ar: act.type_ar,
        type_en: act.type_en,
        title_ar: act.title_ar,
        title_en: act.title_en,
        timestamp: act.timestamp,
        actorKey: act.employee || 'accounts_team',
        actor_ar: actor.ar,
        actor_en: actor.en,
        ref_id: act.ref_id || '',
        linkedRecord: linked,
        targetUrl: linked ? resolveDestinationUrl(linked) : null,
        prevState_ar: act.status === 'completed' ? 'قيد المراجعة' : 'مسجل حديثاً',
        prevState_en: act.status === 'completed' ? 'Under Review' : 'Newly Logged',
        newState_ar: act.status_ar,
        newState_en: act.status_en,
        status: act.status
      };
    });
  }

  // --- Listeners & Cross-Tab Storage Sync ---
  function notifyListeners(topic) {
    listeners.forEach(cb => {
      try { cb(topic); } catch (e) {}
    });
    try {
      window.dispatchEvent(new CustomEvent('miqat:notifications-updated', { detail: { topic: topic } }));
    } catch (e) {}
  }

  function subscribe(cb) {
    if (typeof cb === 'function' && listeners.indexOf(cb) === -1) {
      listeners.push(cb);
    }
  }

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_NOTIFS) notifyListeners('notifications');
    else if (e.key === STORAGE_TASKS) notifyListeners('tasks');
    else if (e.key === STORAGE_PREFS) notifyListeners('prefs');
  });

  window.AccountsNotificationsData = {
    MOCK_NOW_ISO: MOCK_NOW_ISO,
    STORAGE_KEYS: {
      NOTIFICATIONS: STORAGE_NOTIFS,
      TASKS: STORAGE_TASKS,
      PREFS: STORAGE_PREFS
    },
    RECORD_ROUTES: RECORD_ROUTES,
    resolveDestinationUrl: resolveDestinationUrl,
    getNotifications: getNotifications,
    getUnreadCount: getUnreadCount,
    markNotificationRead: markNotificationRead,
    markNotificationUnread: markNotificationUnread,
    markAllNotificationsRead: markAllNotificationsRead,
    deleteNotification: deleteNotification,
    simulateIncomingNotification: simulateIncomingNotification,
    getTasks: getTasks,
    getTaskById: getTaskById,
    isTaskOverdue: isTaskOverdue,
    isCustomTaskOrderActive: isCustomTaskOrderActive,
    createTask: createTask,
    updateTask: updateTask,
    setTaskStatus: setTaskStatus,
    setCustomTaskOrder: setCustomTaskOrder,
    resetTaskOrder: resetTaskOrder,
    getPreferences: getPreferences,
    savePreferences: savePreferences,
    getActivityFeed: getActivityFeed,
    subscribe: subscribe
  };
})();
