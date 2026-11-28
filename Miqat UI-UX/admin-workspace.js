/* ==========================================================================
   Miqat Admin System — Shared Admin Shell, Auth, Theme, Language & Navigation
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

  var currentLang = 'ar';
  var currentTheme = 'light';
  try {
    currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
    currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  } catch (err) {
    console.warn('[AdminWorkspace] Storage read failed:', err && err.message ? err.message : err);
  }

  var currentDict = {};
  var currentUser = null;
  var refreshCallbacks = [];

  var FALLBACK_DICT = {
    ar: {
      partner_hub: { skip_link: 'تخطي إلى المحتوى الرئيسي' },
      admin_cc: {
        page_title: 'مركز تحكم ميقات | الإدارة',
        brand_title: 'مركز تحكم ميقات',
        sidebar_portal: 'بوابة الإدارة العليا',
        owner_badge: 'المالك / الإدارة',
        btn_logout: 'تسجيل الخروج',
        btn_close: 'إغلاق',
        btn_cancel: 'إلغاء',
        btn_confirm: 'تأكيد التنفيذ',
        logout_confirm_title: 'تأكيد تسجيل الخروج',
        logout_confirm_body: 'هل تريد تسجيل الخروج من لوحة الإدارة؟',
        nav_control_center: 'مركز تحكم ميقات',
        nav_employees: 'الموظفون — الحسابات والمبيعات',
        nav_all_users: 'جميع المستخدمين',
        nav_earnings: 'أرباحي',
        nav_payments_backup: 'سجلات الدفع والنسخ الاحتياطي',
        nav_account_mgmt: 'إضافة حسابات',
        nav_daily_requests: 'الطلبات اليومية',
        coming_soon: 'قريباً',
        sys_operational: 'حالة النظام: مستقر (محاكاة)',
        cmd_welcome: 'مركز تحكم ميقات',
        mode_advanced: 'المراقبة المتقدمة',
        mode_executive: 'العرض التنفيذي',
        btn_adv_filters: 'الفلاتر المتقدمة',
        btn_customize: 'تخصيص اللوحة',
        btn_compare: 'مقارنة جانبية',
        btn_refresh: 'تحديث الكل',
        global_search_label: 'بحث شامل في المنظومة',
        global_search_ph: 'ابحث عن موظف، عميل، شركة، برنامج، حجز، طلب، أو حادثة...',
        dmode_live: 'مباشر (محاكاة)',
        dmode_periodic: 'تحديث دوري',
        dmode_manual: 'يدوي',
        focus_all: 'وضع التركيز: الكل',
        focus_workforce: 'تركيز: القوى العاملة',
        focus_business: 'تركيز: الأعمال',
        focus_analytics: 'تركيز: التحليلات',
        focus_health: 'تركيز: الذكاء والصحة',
        cust_title: 'وضع تخصيص لوحة التحكم',
        cust_desc: 'اسحب الأقسام أو استخدم أزرار التحريك/التثبيت/الإخفاء ثم احفظ العرض المخصص.',
        cust_view_ph: 'اسم العرض المخصص...',
        cust_save: 'حفظ التعديلات',
        cust_reset: 'استعادة الافتراضي',
        cust_cancel: 'إلغاء',
        sec_overview: 'نظرة عامة والمهام',
        sec_workforce: 'القوى العاملة',
        sec_business: 'نظرة الأعمال',
        sec_analytics: 'استوديو التحليلات',
        sec_activity: 'النشاط المباشر',
        sec_intelligence: 'الذكاء والصحة والنسخ',
        flt_title: 'محرك الفلاتر المتقدمة',
        kpilib_title: 'مكتبة المؤشرات التشغيلية',
        cmp_title: 'المقارنة الجانبية',
        ai_page_title: 'مساعد العمليات الذكي',
        ai_page_desc: 'يفصل كل رد بوضوح بين: (١) بيانات النظام الفعلية، (٢) التحليل والاستنتاج، (٣) التوقعات التقديرية.',
        ai_mock_notice: 'تنويه المحاكاة: لا يوجد مزود ذكاء اصطناعي حي متصل حالياً. الإجابات مبنية على محرك قواعد محلي يقرأ بيانات النموذج ويتطلب موافقة صريحة قبل أي إجراء حساس.',
        ai_input_label: 'اكتب سؤالك التشغيلي',
        ai_input_ph: 'مثال: حلل أداء الموظفين اليوم أو اعرض الطلبات المتأخرة...',
        ai_send_btn: 'إرسال',
        back_to_cc: 'العودة لمركز التحكم',
        sh_page_title: 'تفاصيل صحة النظام والأمان',
        sh_ip_dlg_title: 'تأكيد حظر IP (محاكاة)',
        sh_ip_dlg_desc: 'لا يتم حظر أي عنوان IP تلقائياً. حدد المدة وسجل الإجراء في سجل التدقيق التجريبي.'
      }
    },
    en: {
      partner_hub: { skip_link: 'Skip to main content' },
      admin_cc: {
        page_title: 'Miqat Control Center | Admin',
        brand_title: 'Miqat Control Center',
        sidebar_portal: 'Executive Admin Portal',
        owner_badge: 'Owner / Admin',
        btn_logout: 'Sign Out',
        btn_close: 'Close',
        btn_cancel: 'Cancel',
        btn_confirm: 'Confirm Action',
        logout_confirm_title: 'Confirm Sign Out',
        logout_confirm_body: 'Do you want to sign out from the Admin Portal?',
        nav_control_center: 'Miqat Control Center',
        nav_employees: 'Employees — Accounts & Sales',
        nav_all_users: 'All Users',
        nav_earnings: 'My Earnings',
        nav_payments_backup: 'Payment Records / Backup',
        nav_account_mgmt: 'Add Accounts',
        nav_daily_requests: 'Daily Requests',
        coming_soon: 'Coming Soon',
        sys_operational: 'System Status: Operational (Mock)',
        cmd_welcome: 'Miqat Control Center',
        mode_advanced: 'Advanced Monitoring',
        mode_executive: 'Executive View',
        btn_adv_filters: 'Advanced Filters',
        btn_customize: 'Customize Dashboard',
        btn_compare: 'Side-by-Side Compare',
        btn_refresh: 'Refresh All',
        global_search_label: 'Global System Search',
        global_search_ph: 'Search employees, customers, companies, programs, requests, or incidents...',
        dmode_live: 'Live (Simulated)',
        dmode_periodic: 'Periodic',
        dmode_manual: 'Manual',
        focus_all: 'Focus Mode: All',
        focus_workforce: 'Focus: Workforce',
        focus_business: 'Focus: Business',
        focus_analytics: 'Focus: Analytics',
        focus_health: 'Focus: Intelligence & Health',
        cust_title: 'Customize Dashboard Mode',
        cust_desc: 'Reorder, pin, or hide sections, then save your custom view.',
        cust_view_ph: 'Custom view name...',
        cust_save: 'Save Changes',
        cust_reset: 'Restore Default',
        cust_cancel: 'Cancel',
        sec_overview: 'Overview & Actions',
        sec_workforce: 'Workforce',
        sec_business: 'Business',
        sec_analytics: 'Analytics Studio',
        sec_activity: 'Activity Feed',
        sec_intelligence: 'Intelligence & Health',
        flt_title: 'Advanced Filter Engine',
        kpilib_title: 'Operational KPI Library',
        cmp_title: 'Side-by-Side Comparison',
        ai_page_title: 'AI Operations Assistant',
        ai_page_desc: 'Every response separates: (1) Actual System Data, (2) Analysis & Inference, and (3) Forecast.',
        ai_mock_notice: 'Simulation Notice: No live AI API is connected. Responses use a local rule-based engine and require explicit approval before sensitive actions.',
        ai_input_label: 'Ask an operational question',
        ai_input_ph: 'Example: Analyze employee performance today or show overdue requests...',
        ai_send_btn: 'Send',
        back_to_cc: 'Back to Control Center',
        sh_page_title: 'System Health & Security Details',
        sh_ip_dlg_title: 'Confirm IP Block (Simulated)',
        sh_ip_dlg_desc: 'No IP is ever blocked automatically. Choose duration and log to prototype audit trail.'
      }
    }
  };

  try {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('data-theme', currentTheme);
  } catch (err) {
    console.warn('[AdminWorkspace] Document root attribute init failed:', err && err.message ? err.message : err);
  }

  function t(key, fallback) {
    if (!key) return fallback !== undefined ? fallback : '';
    if (key.indexOf('.') > 0) {
      var parts = key.split('.');
      var ns = currentDict && currentDict[parts[0]];
      if (ns && typeof ns[parts[1]] === 'string') return ns[parts[1]];
    }
    var ac = currentDict && currentDict.admin_cc;
    if (ac && typeof ac[key] === 'string') return ac[key];
    var sc = currentDict && currentDict.sales_crm;
    if (sc && typeof sc[key] === 'string') return sc[key];
    return fallback !== undefined ? fallback : '';
  }

  function isEn() {
    return currentLang === 'en';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function formatNumber(val) {
    var num = Number(val);
    if (isNaN(num)) return String(val == null ? '' : val);
    return num.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
  }

  function formatDateTime(iso) {
    if (!iso) return isEn() ? 'Not available' : 'غير متوفر';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleString(isEn() ? 'en-US' : 'ar-EG', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (_) {
      return String(iso);
    }
  }

  async function apiFetch(url, options) {
    var opts = Object.assign({ credentials: 'include' }, options || {});
    opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    try {
      var tok = localStorage.getItem(STORAGE_TOKEN);
      if (tok && !opts.headers.Authorization) {
        opts.headers.Authorization = 'Bearer ' + tok;
      }
    } catch (_) {}
    var res = await fetch((url.startsWith('http') ? '' : API_BASE_URL) + url, opts);
    if (res.status === 401) {
      window.location.replace('login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop() || 'admin-control-center.html'));
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
      if (!res.ok) return FALLBACK_DICT[lang] || FALLBACK_DICT.ar;
      return await res.json();
    } catch (_) {
      return FALLBACK_DICT[lang] || FALLBACK_DICT.ar;
    }
  }

  function applyTheme(theme) {
    currentTheme = theme === 'dark' ? 'dark' : 'light';
    try { localStorage.setItem(STORAGE_THEME, currentTheme); } catch (_) {}
    document.documentElement.setAttribute('data-theme', currentTheme);
    var moon = document.querySelector('#adm-theme-toggle .icon-moon');
    var sun = document.querySelector('#adm-theme-toggle .icon-sun');
    if (moon) moon.style.display = currentTheme === 'dark' ? 'none' : 'block';
    if (sun) sun.style.display = currentTheme === 'dark' ? 'block' : 'none';
  }

  function hydrateAdminHeader() {
    if (!currentUser) return;
    var name = currentLang === 'ar'
      ? (currentUser.name || currentUser.name_ar || 'مدير النظام')
      : (currentUser.name_en || currentUser.name || 'System Owner');
    var nameEl = document.getElementById('adm-owner-name');
    var avatarEl = document.getElementById('adm-owner-avatar');
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.trim().charAt(0).toUpperCase();
  }

  function applyStaticTranslations() {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var rawKey = el.getAttribute('data-i18n') || '';
      var key = rawKey.replace(/^admin_cc\./, '').replace(/^sales_crm\./, '');
      var txt = t(key, null);
      if (txt && txt !== rawKey && txt !== key) el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var rawKey = el.getAttribute('data-i18n-placeholder') || '';
      var key = rawKey.replace(/^admin_cc\./, '').replace(/^sales_crm\./, '');
      var txt = t(key, null);
      if (txt && txt !== rawKey && txt !== key) el.setAttribute('placeholder', txt);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var rawKey = el.getAttribute('data-i18n-aria') || '';
      var key = rawKey.replace(/^admin_cc\./, '').replace(/^sales_crm\./, '');
      var txt = t(key, null);
      if (txt && txt !== rawKey && txt !== key) el.setAttribute('aria-label', txt);
    });

    var langBtn = document.querySelector('#adm-lang-switcher .lang-btn-text');
    if (langBtn) langBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    document.title = t('page_title', isEn() ? 'Miqat Control Center | Admin' : 'مركز تحكم ميقات | الإدارة');
    hydrateAdminHeader();
  }

  async function requireAdminAuth() {
    try {
      var data = await apiFetch('/api/auth/me', { method: 'GET' });
      if (!data.authenticated || !data.user || data.user.role !== 'admin' || (data.user.status || 'active') !== 'active') {
        window.location.replace('login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop() || 'admin-control-center.html'));
        throw new Error('ADMIN_UNAUTHORIZED');
      }
      currentUser = data.user;
      return currentUser;
    } catch (err) {
      if (err && err.message !== 'AUTH_REQUIRED' && err.message !== 'ADMIN_UNAUTHORIZED') {
        window.location.replace('login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop() || 'admin-control-center.html'));
      }
      throw err;
    }
  }

  function showToast(msg) {
    var old = document.getElementById('adm-toast-banner');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'adm-toast-banner';
    el.className = 'sls-toast-banner';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 3200);
  }

  function bindShellEvents() {
    if (window.__admShellBound) return;
    window.__admShellBound = true;

    var langBtn = document.getElementById('adm-lang-switcher');
    if (langBtn) {
      langBtn.addEventListener('click', async function () {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        try { localStorage.setItem(STORAGE_LANG, currentLang); } catch (_) {}
        currentDict = await loadTranslations(currentLang);
        applyStaticTranslations();
        refreshCallbacks.forEach(function (cb) { try { cb(); } catch (err) { console.warn('[AdminWorkspace] Refresh callback failed:', err); } });
      });
    }

    var themeBtn = document.getElementById('adm-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
      });
    }

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
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) setDrawer(false);
    });

    document.querySelectorAll('.adm-nav-soon').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showToast(isEn()
          ? 'This Admin module is scheduled in the upcoming Admin pages (Pages 2–7).'
          : 'هذه الصفحة الإدارية قيد الإعداد ضمن الصفحات القادمة (الصفحات ٢–٧).');
      });
    });

    var logoutBtn = document.getElementById('adm-logout-btn');
    var logoutDlg = document.getElementById('adm-logout-dialog');
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
          try {
            localStorage.removeItem(STORAGE_TOKEN);
            localStorage.removeItem(STORAGE_USER);
          } catch (_) {}
          window.location.replace('login.html');
        }
      });
    }
  }

  async function init() {
    applyTheme(currentTheme);
    currentDict = await loadTranslations(currentLang);
    await requireAdminAuth();
    applyStaticTranslations();
    bindShellEvents();
    return currentUser;
  }

  window.AdminWorkspace = {
    init: init,
    apiFetch: apiFetch,
    t: t,
    isEn: isEn,
    esc: esc,
    getLang: function () { return currentLang; },
    getTheme: function () { return currentTheme; },
    getUser: function () { return currentUser; },
    formatNumber: formatNumber,
    formatDateTime: formatDateTime,
    showToast: showToast,
    onRefresh: function (cb) { if (typeof cb === 'function') refreshCallbacks.push(cb); }
  };
})();
