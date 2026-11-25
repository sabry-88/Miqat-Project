/* ==========================================================================
   Miqat Accounts Workspace — Page 11: Employee-Scoped Profile & Settings Store
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_USER = 'miqat_user';
  var PREFIX_PROFILE = 'miqat_emp_profile_';
  var PREFIX_SECURITY = 'miqat_emp_security_';
  var PREFIX_SESSIONS = 'miqat_emp_sessions_';
  var PREFIX_ACTIVITY = 'miqat_emp_activity_';
  var PREFIX_PREFS = 'miqat_emp_display_prefs_';
  var PREFIX_PERM_REQ = 'miqat_emp_perm_requests_';

  var EMPLOYEES_CATALOG = {
    'EMP-2026-088': {
      id: 'EMP-2026-088',
      name_ar: 'أحمد عبد الله المنشاوي',
      name_en: 'Ahmed Abdullah El-Minshawy',
      title_ar: 'مدقق حسابات أول',
      title_en: 'Senior Accounts Auditor',
      department_ar: 'إدارة الحسابات المالية والتسويات',
      department_en: 'Financial Accounts & Settlements',
      email: 'a.elminshawy@miqat.internal',
      phone: '+20 100 412 8890',
      whatsapp: '+20 100 412 8890',
      joinDate: '2024-03-15',
      status: 'active',
      lastLoginAt: '2026-11-25 08:42',
      lastLoginDevice_ar: 'متصفح Chrome على Windows 11',
      lastLoginDevice_en: 'Chrome on Windows 11',
      sessions: [
        {
          id: 'SES-088-1',
          device_ar: 'حاسوب المكتب الرئيسي',
          device_en: 'Primary Office Desktop',
          browser: 'Chrome 131',
          os: 'Windows 11',
          location_ar: 'القاهرة، مصر (تقريبي)',
          location_en: 'Cairo, Egypt (Approx.)',
          lastActive: '2026-11-25 21:00',
          isCurrent: true,
          status: 'active'
        },
        {
          id: 'SES-088-2',
          device_ar: 'جهاز لوحي للمراجعة الميدانية',
          device_en: 'Field Audit Tablet',
          browser: 'Safari 18',
          os: 'iPadOS 18',
          location_ar: 'الجيزة، مصر (تقريبي)',
          location_en: 'Giza, Egypt (Approx.)',
          lastActive: '2026-11-24 19:15',
          isCurrent: false,
          status: 'active'
        },
        {
          id: 'SES-088-3',
          device_ar: 'حاسوب محمول احتياطي',
          device_en: 'Backup Work Laptop',
          browser: 'Edge 131',
          os: 'Windows 11',
          location_ar: 'الإسكندرية، مصر (تقريبي)',
          location_en: 'Alexandria, Egypt (Approx.)',
          lastActive: '2026-11-22 14:20',
          isCurrent: false,
          status: 'active'
        }
      ],
      activity: [
        { id: 'ACT-088-1', type: 'login_success', desc_ar: 'تسجيل دخول ناجح إلى مساحة الحسابات', desc_en: 'Successful sign-in to Accounts Workspace', timestamp: '2026-11-25 08:42', status: 'completed' },
        { id: 'ACT-088-2', type: 'prefs_updated', desc_ar: 'تحديث تفضيلات العرض والكثافة', desc_en: 'Updated display density preferences', timestamp: '2026-11-24 16:10', status: 'completed' },
        { id: 'ACT-088-3', type: 'contact_updated', desc_ar: 'تحديث رقم الواتساب الشخصي', desc_en: 'Updated personal WhatsApp number', timestamp: '2026-11-21 11:05', status: 'completed' }
      ],
      permissions: [
        { key: 'view_ledger', name_ar: 'عرض السجلات والتقارير المالية', name_en: 'View Financial Ledgers & Reports', access: 'permitted' },
        { key: 'audit_collections', name_ar: 'تدقيق التحصيلات والإيداعات', name_en: 'Audit Collections & Cash Deposits', access: 'permitted' },
        { key: 'review_refunds', name_ar: 'مراجعة طلبات الاسترداد والإلغاء', name_en: 'Review Refund & Cancellation Requests', access: 'permitted' },
        { key: 'approve_settlements', name_ar: 'الاعتماد النهائي لتسويات الشركات', name_en: 'Final Approval of Company Settlements', access: 'admin_approval' },
        { key: 'export_sensitive', name_ar: 'تصدير التقارير المالية الحساسة', name_en: 'Export Sensitive Financial Statements', access: 'admin_approval' }
      ]
    },
    'EMP-2026-092': {
      id: 'EMP-2026-092',
      name_ar: 'سارة منصور',
      name_en: 'Sarah Mansour',
      title_ar: 'أخصائي عمليات مالية',
      title_en: 'Financial Operations Specialist',
      department_ar: 'إدارة التحصيلات والمطابقة',
      department_en: 'Collections & Reconciliation',
      email: 's.mansour@miqat.internal',
      phone: '+20 111 784 2210',
      whatsapp: '+20 111 784 2210',
      joinDate: '2025-01-10',
      status: 'active',
      lastLoginAt: '2026-11-25 09:15',
      lastLoginDevice_ar: 'متصفح Edge على Windows 11',
      lastLoginDevice_en: 'Edge on Windows 11',
      sessions: [
        {
          id: 'SES-092-1',
          device_ar: 'محطة عمل التحصيل',
          device_en: 'Collections Workstation',
          browser: 'Edge 131',
          os: 'Windows 11',
          location_ar: 'القاهرة، مصر (تقريبي)',
          location_en: 'Cairo, Egypt (Approx.)',
          lastActive: '2026-11-25 20:45',
          isCurrent: true,
          status: 'active'
        },
        {
          id: 'SES-092-2',
          device_ar: 'هاتف العمل',
          device_en: 'Work Mobile Device',
          browser: 'Chrome Mobile',
          os: 'Android 15',
          location_ar: 'القاهرة، مصر (تقريبي)',
          location_en: 'Cairo, Egypt (Approx.)',
          lastActive: '2026-11-23 18:30',
          isCurrent: false,
          status: 'active'
        }
      ],
      activity: [
        { id: 'ACT-092-1', type: 'login_success', desc_ar: 'تسجيل دخول ناجح — سارة منصور', desc_en: 'Successful sign-in — Sarah Mansour', timestamp: '2026-11-25 09:15', status: 'completed' },
        { id: 'ACT-092-2', type: 'login_failed', desc_ar: 'محاولة تسجيل دخول فاشلة من جهاز غير معروف', desc_en: 'Failed sign-in attempt from unrecognized browser', timestamp: '2026-11-22 22:10', status: 'attention' }
      ],
      permissions: [
        { key: 'view_ledger', name_ar: 'عرض السجلات والتقارير المالية', name_en: 'View Financial Ledgers & Reports', access: 'permitted' },
        { key: 'audit_collections', name_ar: 'تدقيق التحصيلات والإيداعات', name_en: 'Audit Collections & Cash Deposits', access: 'permitted' },
        { key: 'review_refunds', name_ar: 'مراجعة طلبات الاسترداد والإلغاء', name_en: 'Review Refund & Cancellation Requests', access: 'admin_approval' },
        { key: 'approve_settlements', name_ar: 'الاعتماد النهائي لتسويات الشركات', name_en: 'Final Approval of Company Settlements', access: 'admin_approval' }
      ]
    },
    'EMP-2026-095': {
      id: 'EMP-2026-095',
      name_ar: 'عمر شريف',
      name_en: 'Omar Sharif',
      title_ar: 'مسؤول التسويات والمراجعة',
      title_en: 'Settlements & Review Officer',
      department_ar: 'إدارة تسويات الشركاء',
      department_en: 'Partner Settlements',
      email: 'o.sharif@miqat.internal',
      phone: '+20 122 509 3341',
      whatsapp: '+20 122 509 3341',
      joinDate: '2025-06-01',
      status: 'active',
      lastLoginAt: '2026-11-25 10:05',
      lastLoginDevice_ar: 'متصفح Firefox على macOS',
      lastLoginDevice_en: 'Firefox on macOS',
      sessions: [
        {
          id: 'SES-095-1',
          device_ar: 'جهاز MacBook Pro',
          device_en: 'MacBook Pro Workstation',
          browser: 'Firefox 133',
          os: 'macOS 15',
          location_ar: 'الإسكندرية، مصر (تقريبي)',
          location_en: 'Alexandria, Egypt (Approx.)',
          lastActive: '2026-11-25 20:10',
          isCurrent: true,
          status: 'active'
        }
      ],
      activity: [],
      permissions: [
        { key: 'view_ledger', name_ar: 'عرض السجلات والتقارير المالية', name_en: 'View Financial Ledgers & Reports', access: 'permitted' },
        { key: 'approve_settlements', name_ar: 'الاعتماد النهائي لتسويات الشركات', name_en: 'Final Approval of Company Settlements', access: 'admin_approval' }
      ]
    }
  };

  var DEFAULT_DISPLAY_PREFS = {
    fontSize: 'medium',
    density: 'comfortable',
    tableDisplay: 'standard',
    itemsPerPage: '20',
    dateFormat: 'iso',
    numberFormat: 'locale'
  };

  var DEFAULT_SECURITY = {
    twoFactorEnabled: false,
    newLoginAlertEnabled: true
  };

  function safeRead(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function getActiveEmployeeId() {
    var user = safeRead(STORAGE_USER, null);
    if (user && user.id && EMPLOYEES_CATALOG[user.id]) {
      return user.id;
    }
    if (user && user.id) {
      return String(user.id);
    }
    return 'EMP-2026-088';
  }

  function getBaseEmployee(empId) {
    if (EMPLOYEES_CATALOG[empId]) return EMPLOYEES_CATALOG[empId];
    var stored = safeRead(STORAGE_USER, {}) || {};
    var fallback = EMPLOYEES_CATALOG['EMP-2026-088'];
    return {
      id: empId,
      name_ar: stored.name || stored.name_ar || fallback.name_ar,
      name_en: stored.name_en || stored.name || fallback.name_en,
      title_ar: stored.title || stored.role_title_ar || fallback.title_ar,
      title_en: stored.title_en || stored.role_title_en || fallback.title_en,
      department_ar: fallback.department_ar,
      department_en: fallback.department_en,
      email: stored.email || (empId.toLowerCase() + '@miqat.internal'),
      phone: fallback.phone,
      whatsapp: fallback.whatsapp,
      joinDate: fallback.joinDate,
      status: 'active',
      lastLoginAt: fallback.lastLoginAt,
      lastLoginDevice_ar: fallback.lastLoginDevice_ar,
      lastLoginDevice_en: fallback.lastLoginDevice_en,
      sessions: fallback.sessions.map(function (s) { return Object.assign({}, s); }),
      activity: [],
      permissions: fallback.permissions.map(function (p) { return Object.assign({}, p); })
    };
  }

  function nowStamp() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function appendActivity(empId, entry) {
    var key = PREFIX_ACTIVITY + empId;
    var base = getBaseEmployee(empId);
    var list = safeRead(key, null);
    if (!Array.isArray(list)) list = base.activity.slice();
    list.unshift(Object.assign({
      id: 'ACT-' + Date.now().toString().slice(-6),
      timestamp: nowStamp(),
      status: 'completed'
    }, entry));
    safeWrite(key, list.slice(0, 10));
  }

  function getProfile() {
    var empId = getActiveEmployeeId();
    var base = getBaseEmployee(empId);
    var overrides = safeRead(PREFIX_PROFILE + empId, {});
    return Object.assign({}, base, {
      phone: overrides && typeof overrides.phone === 'string' ? overrides.phone : base.phone,
      whatsapp: overrides && typeof overrides.whatsapp === 'string' ? overrides.whatsapp : base.whatsapp
    });
  }

  function updateContact(phone, whatsapp) {
    var empId = getActiveEmployeeId();
    var ok = safeWrite(PREFIX_PROFILE + empId, {
      phone: String(phone || '').trim(),
      whatsapp: String(whatsapp || '').trim(),
      updatedAt: nowStamp()
    });
    if (!ok) return false;
    appendActivity(empId, {
      type: 'contact_updated',
      desc_ar: 'تم تحديث رقم الهاتف والواتساب الشخصي',
      desc_en: 'Updated personal phone and WhatsApp contact numbers'
    });
    return true;
  }

  function getSecurityState() {
    var empId = getActiveEmployeeId();
    var stored = safeRead(PREFIX_SECURITY + empId, null);
    return Object.assign({}, DEFAULT_SECURITY, stored || {});
  }

  function updateSecurityState(patch) {
    var empId = getActiveEmployeeId();
    var next = Object.assign({}, getSecurityState(), patch || {});
    var ok = safeWrite(PREFIX_SECURITY + empId, next);
    if (ok) {
      appendActivity(empId, {
        type: 'security_changed',
        desc_ar: 'تم تحديث إعدادات الأمان والتنبيهات (محاكاة)',
        desc_en: 'Updated account security preferences (simulated)'
      });
    }
    return next;
  }

  function getSessions() {
    var empId = getActiveEmployeeId();
    var stored = safeRead(PREFIX_SESSIONS + empId, null);
    if (Array.isArray(stored)) return stored;
    var base = getBaseEmployee(empId);
    var initial = base.sessions.map(function (s) { return Object.assign({}, s); });
    safeWrite(PREFIX_SESSIONS + empId, initial);
    return initial;
  }

  function terminateSession(sessionId) {
    var empId = getActiveEmployeeId();
    var sessions = getSessions();
    var target = sessions.find(function (s) { return s.id === sessionId; });
    if (!target || target.isCurrent) return false;
    var updated = sessions.filter(function (s) { return s.id !== sessionId; });
    safeWrite(PREFIX_SESSIONS + empId, updated);
    appendActivity(empId, {
      type: 'session_ended',
      desc_ar: 'تم إنهاء جلسة جهاز آخر (' + target.device_ar + ')',
      desc_en: 'Terminated other device session (' + target.device_en + ')'
    });
    return true;
  }

  function endOtherSessions() {
    var empId = getActiveEmployeeId();
    var sessions = getSessions();
    var currentOnly = sessions.filter(function (s) { return s.isCurrent; });
    if (currentOnly.length === sessions.length) return 0;
    var removedCount = sessions.length - currentOnly.length;
    safeWrite(PREFIX_SESSIONS + empId, currentOnly);
    appendActivity(empId, {
      type: 'sessions_cleared',
      desc_ar: 'تم إنهاء جميع الجلسات الأخرى والإبقاء على الجلسة الحالية',
      desc_en: 'Ended all other active sessions while keeping current session'
    });
    return removedCount;
  }

  function getPersonalActivity() {
    var empId = getActiveEmployeeId();
    var stored = safeRead(PREFIX_ACTIVITY + empId, null);
    if (Array.isArray(stored)) return stored.slice(0, 6);
    var base = getBaseEmployee(empId);
    var initial = base.activity.map(function (a) { return Object.assign({}, a); });
    safeWrite(PREFIX_ACTIVITY + empId, initial);
    return initial.slice(0, 6);
  }

  function getDisplayPreferences() {
    var empId = getActiveEmployeeId();
    var stored = safeRead(PREFIX_PREFS + empId, null);
    return Object.assign({}, DEFAULT_DISPLAY_PREFS, stored || {});
  }

  function saveDisplayPreferences(prefs) {
    var empId = getActiveEmployeeId();
    var next = Object.assign({}, DEFAULT_DISPLAY_PREFS, prefs || {});
    safeWrite(PREFIX_PREFS + empId, next);
    applyDisplayPreferencesToDocument(next);
    appendActivity(empId, {
      type: 'prefs_updated',
      desc_ar: 'تم تحديث تفضيلات العرض الشخصية',
      desc_en: 'Updated personal display preferences'
    });
    return next;
  }

  function applyDisplayPreferencesToDocument(prefs) {
    var p = prefs || getDisplayPreferences();
    var root = document.documentElement;
    if (!root) return;
    root.setAttribute('data-acc-font-size', p.fontSize || 'medium');
    root.setAttribute('data-acc-density', p.density || 'comfortable');
    root.setAttribute('data-acc-table-style', p.tableDisplay || 'standard');
    root.setAttribute('data-acc-date-format', p.dateFormat || 'iso');
    root.setAttribute('data-acc-number-format', p.numberFormat || 'locale');
  }

  function getPermissions() {
    var empId = getActiveEmployeeId();
    return getBaseEmployee(empId).permissions.map(function (p) { return Object.assign({}, p); });
  }

  function getPermissionRequests() {
    var empId = getActiveEmployeeId();
    var stored = safeRead(PREFIX_PERM_REQ + empId, []);
    return Array.isArray(stored) ? stored : [];
  }

  function submitPermissionRequest(permissionKey, reason) {
    var empId = getActiveEmployeeId();
    var perms = getPermissions();
    var perm = perms.find(function (p) { return p.key === permissionKey; });
    if (!perm) return null;

    var list = getPermissionRequests();
    var record = {
      id: 'PRQ-' + Date.now().toString().slice(-6),
      employeeId: empId,
      permissionKey: perm.key,
      permission_ar: perm.name_ar,
      permission_en: perm.name_en,
      reason: String(reason || '').trim(),
      status: 'pending_admin',
      submittedAt: nowStamp()
    };
    list.unshift(record);
    safeWrite(PREFIX_PERM_REQ + empId, list);
    appendActivity(empId, {
      type: 'permission_requested',
      desc_ar: 'تم إرسال طلب مراجعة صلاحية: ' + perm.name_ar,
      desc_en: 'Submitted permission review request: ' + perm.name_en,
      status: 'pending'
    });
    return record;
  }

  window.AccountsProfileData = {
    EMPLOYEES_CATALOG: EMPLOYEES_CATALOG,
    getActiveEmployeeId: getActiveEmployeeId,
    getProfile: getProfile,
    updateContact: updateContact,
    getSecurityState: getSecurityState,
    updateSecurityState: updateSecurityState,
    getSessions: getSessions,
    terminateSession: terminateSession,
    endOtherSessions: endOtherSessions,
    getPersonalActivity: getPersonalActivity,
    getDisplayPreferences: getDisplayPreferences,
    saveDisplayPreferences: saveDisplayPreferences,
    applyDisplayPreferencesToDocument: applyDisplayPreferencesToDocument,
    getPermissions: getPermissions,
    getPermissionRequests: getPermissionRequests,
    submitPermissionRequest: submitPermissionRequest
  };
})();
