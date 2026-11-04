/**
 * MIQAT ACCOUNTS EMPLOYEE WORKSPACE — CONTROLLER ENGINE
 * Strict UI/UX Revision — 9 Mandatory Changes Implementation
 * 
 * Features:
 * 1. Horizontal Navbar with authentic dual-theme Miqat logo, refined controls, and profile hover.
 * 2. Direction-aware sticky sidebar (>=1024px) & mobile off-canvas drawer (<1024px).
 * 3. Calendar Date Picker inside advanced filters with exact day filtering, bilingual support, and clear action.
 * 4. Enterprise UI typography (IBM Plex Sans Arabic & Inter) with strict weight hierarchy.
 * 5. Interactive Donut Chart (collections by channel) + Distinctive Analytical Graph (recorded vs verified).
 * 6. Redesigned compact "مباشرة التدقيق" action button with icon and refined hover states.
 * 7. Redesigned compact "عرض الإيصال" action button in transactions table with receipt icon.
 * 8. Redesigned Daily Operations & Financial Activity Log with structured visual cards.
 * 9. Comprehensive Dark Mode visibility audit across all components, badges, tooltips, and surfaces.
 */

(function () {
  'use strict';

  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';
  const STORAGE_USER = 'miqat_user';
  const STORAGE_TOKEN = 'miqat_token';

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let currentDict = null;
  let currentUser = null;
  
  let activeFilters = {
    dateRange: 'all',
    exactDate: null,
    paymentMethod: 'all',
    verificationStatus: 'all',
    bookingStatus: 'all',
    refundStatus: 'all',
    assignedEmployee: 'all'
  };

  // Calendar State (Defaults to November 2026, the simulated operational period)
  let calState = {
    year: 2026,
    month: 10, // 0-indexed (10 = November)
    isOpen: false
  };

  const refreshListeners = [];

  const html = document.documentElement;

  // --- 1. Arabic-Indic & Western Numerals Helpers ---
  function toArabicIndicDigits(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[0-9]/g, function (d) {
      return String.fromCharCode(1632 + parseInt(d, 10));
    });
  }

  function toWesternDigits(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[٠-٩]/g, function (d) {
      return String(d.charCodeAt(0) - 1632);
    });
  }

  function formatNumber(val, lang) {
    if (val === null || val === undefined) return '';
    const formatted = typeof val === 'number' ? val.toLocaleString('en-US') : String(val);
    if (lang === 'ar') {
      return toArabicIndicDigits(formatted).replace(/,/g, '،');
    }
    return toWesternDigits(formatted);
  }

  function formatCurrency(amount, lang) {
    const numStr = formatNumber(amount, lang);
    const currStr = lang === 'ar' ? 'ج.م' : 'EGP';
    return lang === 'ar' ? (numStr + ' ' + currStr) : (currStr + ' ' + numStr);
  }

  // --- 2. Localization Loader ---
  async function loadTranslations(lang) {
    try {
      const res = await fetch('./locales/' + lang + '.json');
      if (!res.ok) throw new Error('Failed to load ' + lang + '.json');
      return await res.json();
    } catch (e) {
      console.warn('Fallback loading translations for ' + lang + ':', e);
      return {};
    }
  }

  function t(keyPath, defaultText) {
    if (!currentDict || !keyPath) return defaultText || keyPath;
    const parts = keyPath.split('.');
    let curr = currentDict;
    for (let i = 0; i < parts.length; i++) {
      if (curr && typeof curr === 'object' && parts[i] in curr) {
        curr = curr[parts[i]];
      } else {
        return defaultText || keyPath;
      }
    }
    return typeof curr === 'string' ? curr : (defaultText || keyPath);
  }

  function applyTranslations() {
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    const isCustPage = document.body && document.body.classList.contains('accounts-customers-page');
    if (isCustPage) {
      document.title = (currentLang === 'ar' ? 'دليل العملاء والمعتمرين | ميقات' : 'Customers Directory | Miqat');
    } else {
      document.title = (currentLang === 'ar' ? 'لوحة تحكم العمليات المالية والحسابات | ميقات' : 'Financial Operations & Accounts Dashboard | Miqat');
    }

    // Translate all [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', val);
        } else {
          el.textContent = val;
        }
      }
    });

    // Translate all [data-i18n-aria]
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val) el.setAttribute('aria-label', val);
    });

    // Update Language switcher label
    const langBtn = document.getElementById('acc-lang-switcher');
    if (langBtn) {
      const labelEl = langBtn.querySelector('.lang-btn-text');
      if (labelEl) {
        labelEl.textContent = currentLang === 'ar' ? 'EN' : 'AR';
      }
      langBtn.setAttribute('aria-label', currentLang === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية');
    }

    // Update Theme toggle button aria
    updateThemeToggleUI();

    // Re-render Calendar Date Picker labels & grid
    renderCalendarPicker();

    // Re-render dynamic components with localized numbers
    renderAllDashboardComponents();

    // Notify registered page controllers (e.g. Customers Directory)
    refreshListeners.forEach(cb => {
      try { cb({ lang: currentLang, theme: currentTheme }); } catch (err) { console.error(err); }
    });
  }

  async function setLanguage(newLang) {
    currentLang = newLang;
    try {
      localStorage.setItem(STORAGE_LANG, currentLang);
    } catch (e) {}
    currentDict = await loadTranslations(currentLang);
    applyTranslations();
  }

  // --- 3. Theme Management ---
  function updateThemeToggleUI() {
    const btn = document.getElementById('acc-theme-toggle');
    if (!btn) return;
    const isDark = currentTheme === 'dark';
    const isAr = currentLang === 'ar';
    const ariaText = isDark
      ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode')
      : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode');

    btn.setAttribute('aria-label', ariaText);
    btn.setAttribute('title', ariaText);

    const sun = btn.querySelector('.icon-sun');
    const moon = btn.querySelector('.icon-moon');
    if (sun && moon) {
      sun.style.display = isDark ? 'block' : 'none';
      moon.style.display = isDark ? 'none' : 'block';
    }
  }

  function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_THEME, theme);
    } catch (e) {}
    updateThemeToggleUI();

    // Re-render SVG charts so their stroke colors match the active theme
    if (window.AccountsMockData) {
      const breakdown = window.AccountsMockData.getCollectionsBreakdown(activeFilters);
      const trends = window.AccountsMockData.getDailyActivityTrends(activeFilters);
      renderDonutChart(breakdown);
      renderAnalyticalGraph(trends);
    }

    refreshListeners.forEach(cb => {
      try { cb({ lang: currentLang, theme: currentTheme }); } catch (err) { console.error(err); }
    });
  }

  // --- 4. Authentication & Session Verification ---
  function initUserSession() {
    let storedUser = null;
    const token = localStorage.getItem(STORAGE_TOKEN);
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) storedUser = JSON.parse(raw);
    } catch (e) {}

    // Strict authentication check
    if (!token || !storedUser) {
      if (window.location.replace) {
        window.location.replace('login.html?redirect=accounts-dashboard.html');
      } else {
        window.location.href = 'login.html?redirect=accounts-dashboard.html';
      }
      return;
    }

    // Role guard: Only accounts employees or admins may access the accounts workspace
    if (storedUser.role === 'accounts_employee' || storedUser.role === 'accountant' || storedUser.role === 'admin') {
      currentUser = storedUser;
    } else {
      let target = 'login.html';
      if (storedUser.role === 'customer') {
        target = 'programs.html';
      } else if (storedUser.role === 'new_company') {
        target = 'new-company-overview.html';
      } else if (storedUser.role === 'company' || storedUser.role === 'partner_company') {
        if (storedUser.contract_status === 'active' || storedUser.application_status === 'approved') {
          target = 'company-dashboard.html';
        } else {
          target = 'new-company-overview.html';
        }
      }
      if (window.location.replace) {
        window.location.replace(target);
      } else {
        window.location.href = target;
      }
      return;
    }

    // Hydrate User UI
    const nameEl = document.getElementById('acc-employee-name');
    const roleEl = document.getElementById('acc-employee-role');
    const avatarEl = document.getElementById('acc-employee-avatar');

    if (nameEl) nameEl.textContent = currentLang === 'ar' ? (currentUser.name_ar || currentUser.name || 'أحمد صبري') : (currentUser.name_en || currentUser.name || 'Ahmed Sabry');
    if (roleEl) roleEl.textContent = currentLang === 'ar' ? (currentUser.role_title_ar || 'إدارة الحسابات المالية') : (currentUser.role_title_en || 'Financial Accounts Officer');
    if (avatarEl) avatarEl.textContent = currentLang === 'ar' ? 'أ' : 'A';
  }

  // --- 5. Direction-Aware Sidebar & Mobile Drawer Handling ---
  function initDrawer() {
    const sidebar = document.getElementById('acc-sidebar');
    const backdrop = document.getElementById('acc-drawer-backdrop');
    const menuToggle = document.getElementById('acc-hamburger-btn');
    const closeBtn = document.getElementById('acc-drawer-close-btn');

    function openDrawer() {
      if (!sidebar) return;
      sidebar.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('acc-drawer-locked');
    }

    function closeDrawer() {
      if (!sidebar) return;
      sidebar.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('acc-drawer-locked');
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sidebar && sidebar.classList.contains('is-open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (sidebar && sidebar.classList.contains('is-open')) {
          closeDrawer();
        }
        closeSafeLogoutModal();
        closeReceiptModal();
        closeCalendarPopover();
      }
    });

    // Close drawer when clicking any link
    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (window.innerWidth < 1024) {
            closeDrawer();
          }
        });
      });
    }

    // Coming soon items notify politely
    sidebar.querySelectorAll('.is-coming-soon').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        showToast(currentLang === 'ar' ? 'هذا القسم قيد التطوير وسيتاح في المرحلة القادمة' : 'This section is coming soon in the next phase');
      });
    });
  }

  // --- 6. Safe Centered Logout Modal (Shared Across Workspace) ---
  function openSafeLogoutModal() {
    const modal = document.getElementById('acc-logout-modal');
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('acc-modal-locked');

    const cancelBtn = document.getElementById('modal-btn-stay') || modal.querySelector('.acc-btn-logout-cancel');
    if (cancelBtn) {
      try {
        cancelBtn.focus({ preventScroll: true });
      } catch (e) {
        cancelBtn.focus();
      }
    }
  }

  function closeSafeLogoutModal() {
    const modal = document.getElementById('acc-logout-modal');
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('acc-modal-locked');
  }

  function handleLogout(saveFirst) {
    if (saveFirst) {
      showToast(currentLang === 'ar' ? 'جاري تسجيل الخروج الآمن...' : 'Signing out safely...');
      setTimeout(executeSignOut, 400);
    } else {
      executeSignOut();
    }
  }

  function executeSignOut() {
    try {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
    } catch (e) {}
    try {
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        window.location.href = 'login.html';
      });
    } catch (e) {
      window.location.href = 'login.html';
    }
  }

  function initLogoutModal() {
    const logoutBtn = document.getElementById('acc-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openSafeLogoutModal();
      });
    }

    const stayBtn = document.getElementById('modal-btn-stay');
    if (stayBtn) {
      stayBtn.addEventListener('click', closeSafeLogoutModal);
    }

    const cancelBtns = document.querySelectorAll('.acc-btn-logout-cancel');
    cancelBtns.forEach(btn => {
      btn.addEventListener('click', closeSafeLogoutModal);
    });

    const discardBtn = document.getElementById('modal-btn-discard');
    if (discardBtn) {
      discardBtn.addEventListener('click', function () {
        handleLogout(false);
      });
    }

    const saveBtn = document.getElementById('modal-btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        handleLogout(false);
      });
    }

    const confirmBtns = document.querySelectorAll('.acc-btn-logout-confirm');
    confirmBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        handleLogout(false);
      });
    });

    const modalBackdrop = document.querySelector('#acc-logout-modal .acc-modal-backdrop-inner') || document.getElementById('modal-logout-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeSafeLogoutModal);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('acc-logout-modal');
        if (modal && modal.classList.contains('is-visible')) {
          closeSafeLogoutModal();
        }
      }
    });
  }

  // --- 7. Simple Toast Notification ---
  function showToast(message) {
    let toast = document.getElementById('acc-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'acc-global-toast';
      toast.className = 'acc-global-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  // --- 8. Receipt Modal Preview (Change 3) ---
  function openReceiptModal(tx) {
    const modal = document.getElementById('acc-receipt-modal');
    if (!modal) return;
    const lang = currentLang;

    // Apply translations to all data-i18n elements inside the modal
    modal.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) el.textContent = val;
    });
    modal.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val) el.setAttribute('aria-label', val);
    });

    const isVerified = tx.status === 'verified';
    const statusText = isVerified 
      ? t('accounts_workspace.rcpt_status_verified', 'معتمد وموثق بنكياً') 
      : t('accounts_workspace.rcpt_status_review', 'قيد المراجعة والتدقيق');

    const idEl = document.getElementById('rcpt-modal-id');
    if (idEl) idEl.textContent = tx.id;

    const refEl = document.getElementById('rcpt-modal-ref');
    if (refEl) refEl.textContent = tx.receipt_ref;

    const custEl = document.getElementById('rcpt-modal-cust');
    if (custEl) custEl.textContent = lang === 'ar' ? (tx.customer_name_ar || tx.customer_name_en) : (tx.customer_name_en || tx.customer_name_ar);

    const compEl = document.getElementById('rcpt-modal-company');
    if (compEl) compEl.textContent = lang === 'ar' ? (tx.company_name_ar || tx.company_name_en) : (tx.company_name_en || tx.company_name_ar);

    const bkgEl = document.getElementById('rcpt-modal-bkg');
    if (bkgEl) bkgEl.textContent = tx.booking_ref;

    const amountEl = document.getElementById('rcpt-modal-amount');
    if (amountEl) amountEl.textContent = formatCurrency(tx.amount, lang);

    const methodEl = document.getElementById('rcpt-modal-method');
    if (methodEl) methodEl.textContent = lang === 'ar' ? (tx.method_name_ar || tx.method_name_en) : (tx.method_name_en || tx.method_name_ar);

    const dateEl = document.getElementById('rcpt-modal-date');
    if (dateEl) dateEl.textContent = formatNumber(tx.date, lang);

    const statusBanner = document.getElementById('rcpt-banner-status-text');
    if (statusBanner) statusBanner.textContent = statusText;

    const statusBadge = document.getElementById('rcpt-banner-status');
    if (statusBadge) {
      statusBadge.className = 'rcpt-banner-badge ' + (isVerified ? 'is-verified' : 'is-review');
    }

    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('acc-modal-locked');
  }

  function closeReceiptModal() {
    const modal = document.getElementById('acc-receipt-modal');
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('acc-modal-locked');
  }

  // --- 9. Calendar Date Picker Controller (Requirement 3) ---
  const MONTH_NAMES_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const WEEKDAYS_AR = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
  const WEEKDAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  function openCalendarPopover() {
    const popover = document.getElementById('acc-calendar-popover');
    const trigger = document.getElementById('acc-datepicker-trigger');
    if (!popover) return;
    calState.isOpen = true;
    popover.style.display = 'block';
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    renderCalendarPicker();
  }

  function closeCalendarPopover() {
    const popover = document.getElementById('acc-calendar-popover');
    const trigger = document.getElementById('acc-datepicker-trigger');
    if (!popover) return;
    calState.isOpen = false;
    popover.style.display = 'none';
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function renderCalendarPicker() {
    const popover = document.getElementById('acc-calendar-popover');
    if (!popover) return;

    const titleEl = document.getElementById('acc-cal-title');
    const weekdaysEl = document.getElementById('acc-cal-weekdays');
    const daysEl = document.getElementById('acc-cal-days');
    const displayEl = document.getElementById('acc-datepicker-display');
    const clearBtn = document.getElementById('acc-datepicker-clear');
    const lang = currentLang;

    // 1. Update Title (Month + Year)
    if (titleEl) {
      const monthName = lang === 'ar' ? MONTH_NAMES_AR[calState.month] : MONTH_NAMES_EN[calState.month];
      titleEl.textContent = monthName + ' ' + formatNumber(calState.year, lang);
    }

    // 2. Render Weekdays
    if (weekdaysEl) {
      const names = lang === 'ar' ? WEEKDAYS_AR : WEEKDAYS_EN;
      weekdaysEl.innerHTML = names.map(w => '<span class="acc-cal-weekday">' + w + '</span>').join('');
    }

    // 3. Days Grid for Month
    if (daysEl) {
      daysEl.innerHTML = '';
      const year = calState.year;
      const month = calState.month;
      
      const firstDayDate = new Date(year, month, 1);
      const jsDay = firstDayDate.getDay();
      const firstWeekdayOffset = (jsDay + 1) % 7; 
      const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

      for (let p = 0; p < firstWeekdayOffset; p++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'acc-cal-day is-empty';
        emptyCell.setAttribute('aria-hidden', 'true');
        daysEl.appendChild(emptyCell);
      }

      const activeMockDates = ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'];

      for (let d = 1; d <= totalDaysInMonth; d++) {
        const dayStr = String(d).padStart(2, '0');
        const monthStr = String(month + 1).padStart(2, '0');
        const fullDateStr = year + '-' + monthStr + '-' + dayStr;

        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.className = 'acc-cal-day';
        dayBtn.textContent = formatNumber(d, lang);
        dayBtn.setAttribute('data-date', fullDateStr);

        if (activeFilters.exactDate === fullDateStr) {
          dayBtn.classList.add('is-selected');
          dayBtn.setAttribute('aria-selected', 'true');
        }

        if (fullDateStr === '2026-11-03') {
          dayBtn.classList.add('is-today');
          dayBtn.setAttribute('title', lang === 'ar' ? 'اليوم' : 'Today');
        }

        if (activeMockDates.includes(fullDateStr)) {
          dayBtn.classList.add('has-data');
        }

        dayBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          selectCalendarDate(fullDateStr, d, month, year);
        });

        daysEl.appendChild(dayBtn);
      }
    }

    // 4. Update Trigger Button Display Text & Clear Button Visibility
    if (displayEl) {
      if (activeFilters.exactDate) {
        const parts = activeFilters.exactDate.split('-');
        const selYear = parseInt(parts[0], 10);
        const selMonth = parseInt(parts[1], 10) - 1;
        const selDay = parseInt(parts[2], 10);
        const monthName = lang === 'ar' ? MONTH_NAMES_AR[selMonth] : MONTH_NAMES_EN[selMonth];
        displayEl.textContent = formatNumber(selDay, lang) + ' ' + monthName + ' ' + formatNumber(selYear, lang);
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      } else {
        displayEl.textContent = t('accounts_workspace.datepicker_placeholder', 'اختر يوماً من التقويم...');
        if (clearBtn) clearBtn.style.display = 'none';
      }
    }
  }

  function selectCalendarDate(fullDateStr, day, month, year) {
    activeFilters.exactDate = fullDateStr;
    const chips = document.querySelectorAll('.acc-chip-btn');
    chips.forEach(c => c.classList.remove('is-active'));
    
    closeCalendarPopover();
    renderCalendarPicker();
    renderAllDashboardComponents();

    const lang = currentLang;
    const monthName = lang === 'ar' ? MONTH_NAMES_AR[month] : MONTH_NAMES_EN[month];
    const formatted = formatNumber(day, lang) + ' ' + monthName + ' ' + formatNumber(year, lang);
    showToast(lang === 'ar' ? ('تمت الفلترة وفق التاريخ: ' + formatted) : ('Filtered by date: ' + formatted));
  }

  function clearCalendarDate() {
    activeFilters.exactDate = null;
    closeCalendarPopover();
    renderCalendarPicker();
    renderAllDashboardComponents();
    showToast(currentLang === 'ar' ? 'تم مسح تاريخ الفلترة' : 'Date filter cleared');
  }

  function initCalendarDatePicker() {
    const trigger = document.getElementById('acc-datepicker-trigger');
    const popover = document.getElementById('acc-calendar-popover');
    const clearBtn = document.getElementById('acc-datepicker-clear');
    const calClearBtn = document.getElementById('acc-cal-clear-btn');
    const calTodayBtn = document.getElementById('acc-cal-today-btn');
    const prevBtn = document.getElementById('acc-cal-prev');
    const nextBtn = document.getElementById('acc-cal-next');

    if (trigger) {
      trigger.addEventListener('click', function (e) {
        if (e.target.closest('#acc-datepicker-clear')) return;
        if (calState.isOpen) {
          closeCalendarPopover();
        } else {
          openCalendarPopover();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearCalendarDate();
      });
      clearBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          clearCalendarDate();
        }
      });
    }

    if (calClearBtn) {
      calClearBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearCalendarDate();
      });
    }

    if (calTodayBtn) {
      calTodayBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        calState.year = 2026;
        calState.month = 10;
        selectCalendarDate('2026-11-03', 3, 10, 2026);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (calState.month === 0) {
          calState.month = 11;
          calState.year--;
        } else {
          calState.month--;
        }
        renderCalendarPicker();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (calState.month === 11) {
          calState.month = 0;
          calState.year++;
        } else {
          calState.month++;
        }
        renderCalendarPicker();
      });
    }

    document.addEventListener('click', function (e) {
      if (calState.isOpen && popover && !popover.contains(e.target) && trigger && !trigger.contains(e.target)) {
        closeCalendarPopover();
      }
    });
  }

  // --- 10. Dynamic Rendering of Dashboard Components ---
  function renderKPIs(kpis) {
    const lang = currentLang;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal('kpi-val-customers', formatNumber(kpis.totalCustomers, lang));
    setVal('kpi-val-customers-today', formatNumber(kpis.newCustomersToday, lang));
    setVal('kpi-val-bookings', formatNumber(kpis.totalBookings, lang));
    setVal('kpi-val-bookings-today', formatNumber(kpis.newBookingsToday, lang));
    setVal('kpi-val-contracts', formatNumber(kpis.contractsCreated, lang));

    setVal('kpi-val-recorded-collections', formatCurrency(kpis.totalRecordedCollections, lang));
    setVal('kpi-val-verified-collections', formatCurrency(kpis.verifiedCollections, lang));
    setVal('kpi-val-pending-collections', formatCurrency(kpis.pendingVerification, lang));
    setVal('kpi-val-pending-approvals', formatNumber(kpis.pendingAdminApprovals, lang));
    setVal('kpi-val-refunds', formatNumber(kpis.refundRequests, lang) + ' (' + formatCurrency(kpis.refundRequestsValue, lang) + ')');
  }

  // --- Requirement 5A: Interactive Donut Chart ---
  function renderDonutChart(breakdown) {
    const svg = document.getElementById('acc-donut-svg');
    const totalValEl = document.getElementById('acc-donut-total-val');
    const legendEl = document.getElementById('acc-donut-legend');
    const tooltipEl = document.getElementById('acc-donut-tooltip');
    if (!svg || !breakdown) return;

    const lang = currentLang;
    const isDark = currentTheme === 'dark';

    // 1. Center Total
    if (totalValEl) {
      totalValEl.textContent = formatCurrency(breakdown.total, lang);
    }

    // 2. SVG Geometry: Center (140, 140), Radius = 88, Circumference = 2 * PI * 88 ~= 552.92
    const cx = 140;
    const cy = 140;
    const r = 88;
    const c = 2 * Math.PI * r;

    const trackColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 30, 48, 0.07)';
    let svgHtml = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + trackColor + '" stroke-width="26" />';

    let accumulatedOffset = 0;
    const items = breakdown.items || [];

    items.forEach((item, idx) => {
      const segPct = item.percentage !== undefined ? item.percentage : item.pct;
      const segLength = (segPct / 100) * c;
      const gap = items.length > 1 ? 2 : 0;
      const dashLength = Math.max(0, segLength - gap);
      const dashArray = dashLength.toFixed(2) + ' ' + (c - dashLength).toFixed(2);
      const dashOffset = (-accumulatedOffset).toFixed(2);

      const color = isDark ? (item.colorDark || item.color) : (item.colorLight || item.color);
      const name = lang === 'ar' ? (item.label_ar || item.name_ar) : (item.label_en || item.name_en);

      svgHtml += '<circle class="acc-donut-segment" data-index="' + idx + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' +
                 'fill="none" stroke="' + color + '" stroke-width="26" ' +
                 'stroke-dasharray="' + dashArray + '" stroke-dashoffset="' + dashOffset + '" ' +
                 'transform="rotate(-90 ' + cx + ' ' + cy + ')" tabindex="0" role="graphics-symbol" ' +
                 'aria-label="' + name + ': ' + formatCurrency(item.amount, lang) + ' (' + formatNumber(segPct, lang) + '%)" />';

      accumulatedOffset += segLength;
    });

    svg.innerHTML = svgHtml;

    // 3. Render Legend
    if (legendEl) {
      legendEl.innerHTML = items.map((item, idx) => {
        const name = lang === 'ar' ? (item.label_ar || item.name_ar) : (item.label_en || item.name_en);
        const segPct = item.percentage !== undefined ? item.percentage : item.pct;
        const color = isDark ? (item.colorDark || item.color) : (item.colorLight || item.color);
        const val = formatCurrency(item.amount, lang);
        const pct = formatNumber(segPct, lang) + '%';

        return '<div class="acc-donut-legend-item" data-index="' + idx + '" tabindex="0" role="listitem">' +
                 '<span class="acc-legend-dot" style="background-color: ' + color + ';"></span>' +
                 '<div class="acc-legend-info">' +
                   '<span class="acc-legend-name">' + name + '</span>' +
                   '<span class="acc-legend-val">' + val + '</span>' +
                 '</div>' +
                 '<span class="acc-legend-pct">' + pct + '</span>' +
               '</div>';
      }).join('');
    }

    // 4. Attach Interactive Hover & Focus Handlers (Mandatory Interaction)
    function highlightIndex(index, eventTarget, clientX, clientY) {
      if (index === null || index < 0 || index >= items.length) {
        svg.querySelectorAll('.acc-donut-segment').forEach(s => s.classList.remove('is-active', 'is-dimmed'));
        if (legendEl) legendEl.querySelectorAll('.acc-donut-legend-item').forEach(l => l.classList.remove('is-active'));
        if (tooltipEl) tooltipEl.style.display = 'none';
        return;
      }

      const item = items[index];
      const name = lang === 'ar' ? (item.label_ar || item.name_ar) : (item.label_en || item.name_en);
      const segPct = item.percentage !== undefined ? item.percentage : item.pct;
      const color = isDark ? (item.colorDark || item.color) : (item.colorLight || item.color);
      const val = formatCurrency(item.amount, lang);
      const pct = formatNumber(segPct, lang) + '%';

      // Highlight SVG segment
      const segs = svg.querySelectorAll('.acc-donut-segment');
      segs.forEach((s, i) => {
        if (i === index) {
          s.classList.add('is-active');
          s.classList.remove('is-dimmed');
        } else {
          s.classList.remove('is-active');
          s.classList.add('is-dimmed');
        }
      });

      // Highlight Legend row
      if (legendEl) {
        const legRows = legendEl.querySelectorAll('.acc-donut-legend-item');
        legRows.forEach((l, i) => {
          if (i === index) l.classList.add('is-active');
          else l.classList.remove('is-active');
        });
      }

      // Show and position Tooltip
      if (tooltipEl) {
        tooltipEl.innerHTML = '<div class="acc-tooltip-header">' +
                                '<span class="acc-tooltip-dot" style="background-color: ' + color + ';"></span>' +
                                '<strong>' + name + '</strong>' +
                              '</div>' +
                              '<div class="acc-tooltip-body">' +
                                '<span class="acc-tooltip-val">' + val + '</span> ' +
                                '<span class="acc-tooltip-pct">(' + pct + ')</span>' +
                              '</div>';
        tooltipEl.style.display = 'block';

        const card = document.getElementById('card-donut-chart');
        if (card) {
          const cardRect = card.getBoundingClientRect();
          let leftPos, topPos;
          if (clientX && clientY) {
            leftPos = clientX - cardRect.left + 15;
            topPos = clientY - cardRect.top - 10;
          } else {
            leftPos = 140;
            topPos = 90;
          }

          const tipWidth = 190;
          if (leftPos + tipWidth > cardRect.width - 15) {
            leftPos = cardRect.width - tipWidth - 15;
          }
          if (leftPos < 15) leftPos = 15;
          if (topPos < 15) topPos = 15;

          tooltipEl.style.left = leftPos + 'px';
          tooltipEl.style.top = topPos + 'px';
        }
      }
    }

    svg.querySelectorAll('.acc-donut-segment').forEach(seg => {
      const idx = parseInt(seg.getAttribute('data-index'), 10);
      seg.addEventListener('pointerenter', function (e) {
        highlightIndex(idx, this, e.clientX, e.clientY);
      });
      seg.addEventListener('pointermove', function (e) {
        highlightIndex(idx, this, e.clientX, e.clientY);
      });
      seg.addEventListener('pointerleave', function () {
        highlightIndex(null);
      });
      seg.addEventListener('focus', function () {
        highlightIndex(idx, this);
      });
      seg.addEventListener('blur', function () {
        highlightIndex(null);
      });
    });

    if (legendEl) {
      legendEl.querySelectorAll('.acc-donut-legend-item').forEach(leg => {
        const idx = parseInt(leg.getAttribute('data-index'), 10);
        leg.addEventListener('pointerenter', function (e) {
          highlightIndex(idx, this, e.clientX, e.clientY);
        });
        leg.addEventListener('pointerleave', function () {
          highlightIndex(null);
        });
        leg.addEventListener('focus', function () {
          highlightIndex(idx, this);
        });
        leg.addEventListener('blur', function () {
          highlightIndex(null);
        });
      });
    }
  }

  // --- Requirement 5B: Distinctive Interactive Analytical Graph ---
  function renderAnalyticalGraph(trends) {
    const svg = document.getElementById('acc-graph-svg');
    const tooltipEl = document.getElementById('acc-graph-tooltip');
    if (!svg || !trends || trends.length === 0) return;

    const lang = currentLang;
    const isDark = currentTheme === 'dark';

    const w = 620;
    const h = 250;
    const padL = lang === 'ar' ? 45 : 70;
    const padR = lang === 'ar' ? 70 : 45;
    const padTop = 28;
    const padBottom = 45;

    const plotW = w - padL - padR;
    const plotH = h - padTop - padBottom;

    let maxVal = 0;
    trends.forEach(d => {
      if (d.recorded > maxVal) maxVal = d.recorded;
      if (d.verified > maxVal) maxVal = d.verified;
    });
    maxVal = Math.ceil((maxVal * 1.15) / 100000) * 100000 || 800000;

    let svgHtml = '';

    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 30, 48, 0.08)';
    const textMuted = isDark ? '#9CB0C3' : '#627D98';
    const ySteps = 4;

    for (let s = 0; s <= ySteps; s++) {
      const stepVal = (maxVal / ySteps) * s;
      const yPos = padTop + plotH - (s / ySteps) * plotH;

      svgHtml += '<line x1="' + padL + '" y1="' + yPos + '" x2="' + (padL + plotW) + '" y2="' + yPos + '" ' +
                 'stroke="' + gridColor + '" stroke-width="1" stroke-dasharray="3,3" />';

      const yLabelText = formatNumber(Math.round(stepVal / 1000), lang) + ' ' + (lang === 'ar' ? 'ألف' : 'k');
      const textX = lang === 'ar' ? (padL + plotW + 10) : (padL - 10);
      const textAnchor = lang === 'ar' ? 'start' : 'end';

      svgHtml += '<text x="' + textX + '" y="' + (yPos + 4) + '" fill="' + textMuted + '" ' +
                 'font-size="11" font-family="inherit" text-anchor="' + textAnchor + '">' + yLabelText + '</text>';
    }

    const n = trends.length;
    const colStep = plotW / n;
    const barW = 14;
    const barGap = 3;

    const recColor = isDark ? '#5B8CB9' : '#1C3B57';
    const verColor = isDark ? '#DFBF7A' : '#875F20';

    trends.forEach((d, i) => {
      const cx = lang === 'ar' ? (padL + plotW - (i + 0.5) * colStep) : (padL + (i + 0.5) * colStep);

      const hRec = Math.max(4, (d.recorded / maxVal) * plotH);
      const hVer = Math.max(4, (d.verified / maxVal) * plotH);

      const yRec = padTop + plotH - hRec;
      const yVer = padTop + plotH - hVer;

      const xRec = cx - barW - (barGap / 2);
      const xVer = cx + (barGap / 2);

      const isSelected = d.isSelected ? ' is-selected-date' : '';

      svgHtml += '<g class="acc-graph-col' + isSelected + '" data-index="' + i + '">';
      
      svgHtml += '<rect class="acc-bar bar-recorded" x="' + xRec + '" y="' + yRec + '" width="' + barW + '" height="' + hRec + '" ' +
                 'rx="3" ry="3" fill="' + recColor + '" />';

      svgHtml += '<rect class="acc-bar bar-verified" x="' + xVer + '" y="' + yVer + '" width="' + barW + '" height="' + hVer + '" ' +
                 'rx="3" ry="3" fill="' + verColor + '" />';

      const dayLabel = lang === 'ar' ? d.day_ar : d.day_en;
      const weekdayLabel = lang === 'ar' ? d.weekday_ar : d.weekday_en;

      svgHtml += '<text x="' + cx + '" y="' + (padTop + plotH + 18) + '" fill="' + (d.isSelected ? '#DFBF7A' : textMuted) + '" ' +
                 'font-size="11" font-weight="' + (d.isSelected ? '700' : '500') + '" font-family="inherit" text-anchor="middle">' + dayLabel + '</text>';
      svgHtml += '<text x="' + cx + '" y="' + (padTop + plotH + 32) + '" fill="' + textMuted + '" ' +
                 'font-size="10" font-family="inherit" text-anchor="middle">' + weekdayLabel + '</text>';

      svgHtml += '<rect class="acc-graph-hover-zone" data-index="' + i + '" x="' + (cx - colStep / 2) + '" y="' + padTop + '" ' +
                 'width="' + colStep + '" height="' + (plotH + padBottom) + '" fill="transparent" cursor="pointer" tabindex="0" role="graphics-symbol" ' +
                 'aria-label="' + dayLabel + ' ' + weekdayLabel + ': ' + (lang === 'ar' ? 'مقيد ' : 'Rec ') + formatCurrency(d.recorded, lang) + ', ' + (lang === 'ar' ? 'معتمد ' : 'Ver ') + formatCurrency(d.verified, lang) + '" />';

      svgHtml += '</g>';
    });

    svgHtml += '<line class="acc-graph-guide" id="acc-graph-guide" x1="0" y1="' + padTop + '" x2="0" y2="' + (padTop + plotH) + '" ' +
               'stroke="' + (isDark ? '#DFBF7A' : '#1C3B57') + '" stroke-width="1.5" stroke-dasharray="3,3" opacity="0" pointer-events="none" />';

    svg.innerHTML = svgHtml;

    const guideEl = document.getElementById('acc-graph-guide');

    function highlightGraphDay(index, targetEl, clientX, clientY) {
      if (index === null || index < 0 || index >= trends.length) {
        if (guideEl) guideEl.setAttribute('opacity', '0');
        svg.querySelectorAll('.acc-graph-col').forEach(c => c.classList.remove('is-hovered'));
        if (tooltipEl) tooltipEl.style.display = 'none';
        return;
      }

      const d = trends[index];
      const cx = lang === 'ar' ? (padL + plotW - (index + 0.5) * colStep) : (padL + (index + 0.5) * colStep);

      if (guideEl) {
        guideEl.setAttribute('x1', cx);
        guideEl.setAttribute('x2', cx);
        guideEl.setAttribute('opacity', '1');
      }

      svg.querySelectorAll('.acc-graph-col').forEach((c, idx) => {
        if (idx === index) c.classList.add('is-hovered');
        else c.classList.remove('is-hovered');
      });

      if (tooltipEl) {
        const dayTitle = (lang === 'ar' ? d.weekday_ar : d.weekday_en) + '، ' + (lang === 'ar' ? d.day_ar : d.day_en) + ' ' + formatNumber(2026, lang);
        const recText = formatCurrency(d.recorded, lang);
        const verText = formatCurrency(d.verified, lang);
        const ratePct = formatNumber(d.rate, lang);

        tooltipEl.innerHTML = '<div class="acc-tooltip-header">' +
                                '<strong>' + dayTitle + '</strong>' +
                              '</div>' +
                              '<div class="acc-graph-tip-row">' +
                                '<span class="pill-dot dot-recorded"></span>' +
                                '<span class="tip-lbl">' + (lang === 'ar' ? 'التحصيلات المقيدة:' : 'Recorded:') + '</span>' +
                                '<strong class="tip-val">' + recText + '</strong>' +
                              '</div>' +
                              '<div class="acc-graph-tip-row">' +
                                '<span class="pill-dot dot-verified"></span>' +
                                '<span class="tip-lbl">' + (lang === 'ar' ? 'التحصيلات المعتمدة:' : 'Verified:') + '</span>' +
                                '<strong class="tip-val">' + verText + '</strong>' +
                              '</div>' +
                              '<div class="acc-graph-tip-row tip-match-rate">' +
                                '<span class="tip-lbl">' + (lang === 'ar' ? 'نسبة المطابقة البنكية:' : 'Match Rate:') + '</span>' +
                                '<span class="acc-badge-success">' + ratePct + '</span>' +
                              '</div>';

        tooltipEl.style.display = 'block';

        const stage = document.getElementById('acc-graph-stage');
        if (stage) {
          const stageRect = stage.getBoundingClientRect();
          let leftPos, topPos;

          if (clientX && clientY) {
            leftPos = clientX - stageRect.left + 15;
            topPos = clientY - stageRect.top - 20;
          } else {
            leftPos = cx - 90;
            topPos = padTop + 20;
          }

          const tipW = 210;
          if (leftPos + tipW > stageRect.width - 15) {
            leftPos = stageRect.width - tipW - 15;
          }
          if (leftPos < 15) leftPos = 15;
          if (topPos < 10) topPos = 10;

          tooltipEl.style.left = leftPos + 'px';
          tooltipEl.style.top = topPos + 'px';
        }
      }
    }

    svg.querySelectorAll('.acc-graph-hover-zone').forEach(zone => {
      const idx = parseInt(zone.getAttribute('data-index'), 10);
      zone.addEventListener('pointerenter', function (e) {
        highlightGraphDay(idx, this, e.clientX, e.clientY);
      });
      zone.addEventListener('pointermove', function (e) {
        highlightGraphDay(idx, this, e.clientX, e.clientY);
      });
      zone.addEventListener('pointerleave', function () {
        highlightGraphDay(null);
      });
      zone.addEventListener('focus', function () {
        highlightGraphDay(idx, this);
      });
      zone.addEventListener('blur', function () {
        highlightGraphDay(null);
      });
    });
  }

  // --- Requirement 6: Redesigned Action Button in Urgent Tasks ---
  function renderPendingActions(actions) {
    const list = document.getElementById('acc-pending-list');
    if (!list) return;
    const lang = currentLang;

    if (!actions || actions.length === 0) {
      list.innerHTML = '<div class="acc-empty-state">' +
                         '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>' +
                         '<p>' + t('accounts_workspace.pending_empty', 'لا توجد مهام معلقة تطابق شروط الفلترة المحددة.') + '</p>' +
                       '</div>';
      return;
    }

    list.innerHTML = actions.map(act => {
      const title = lang === 'ar' ? act.title_ar : act.title_en;
      const desc = lang === 'ar' ? act.desc_ar : act.desc_en;
      const source = lang === 'ar' ? act.source_name_ar : act.source_name_en;
      const priorityClass = act.priority === 'high' ? 'priority-high' : 'priority-medium';
      const priorityText = act.priority === 'high' ? (lang === 'ar' ? 'أولوية عاجلة' : 'High Priority') : (lang === 'ar' ? 'أولوية معيارية' : 'Normal Priority');

      return '<div class="acc-pending-item ' + priorityClass + '">' +
               '<div class="acc-pending-icon-wrap">' +
                 '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                   '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>' +
                 '</svg>' +
               '</div>' +
               '<div class="acc-pending-content">' +
                 '<div class="acc-pending-header">' +
                   '<h4 class="acc-pending-title">' + title + '</h4>' +
                   '<span class="acc-priority-badge ' + priorityClass + '">' + priorityText + '</span>' +
                 '</div>' +
                 '<p class="acc-pending-desc">' + desc + '</p>' +
                 '<div class="acc-pending-meta">' +
                   '<span class="acc-meta-item">' +
                     '<strong>' + (lang === 'ar' ? 'الطرف المعني:' : 'Party:') + '</strong> ' + source +
                   '</span>' +
                   '<span class="acc-meta-item">' +
                     '<strong>' + (lang === 'ar' ? 'القيمة:' : 'Amount:') + '</strong> ' + formatCurrency(act.amount, lang) +
                   '</span>' +
                   '<span class="acc-meta-item sla-item">' +
                     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
                     (lang === 'ar' ? 'مهلة المعالجة:' : 'SLA Limit:') + ' ' + formatNumber(act.sla_hours, lang) + ' ' + (lang === 'ar' ? 'ساعة' : 'hrs') +
                   '</span>' +
                 '</div>' +
               '</div>' +
               '<div class="acc-pending-actions">' +
                 '<button type="button" class="acc-btn-audit" onclick="window.AccountsWorkspace.handleAuditAction(\'' + act.id + '\')" aria-label="' + (lang === 'ar' ? 'مباشرة تدقيق المهمة' : 'Audit action') + '">' +
                   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>' +
                   '<span>' + (lang === 'ar' ? 'مباشرة التدقيق' : 'Audit Now') + '</span>' +
                 '</button>' +
               '</div>' +
             '</div>';
    }).join('');
  }

  function renderRecentCustomers(customers) {
    const tbody = document.getElementById('acc-cust-tbody');
    if (!tbody) return;
    const lang = currentLang;

    if (!customers || customers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="acc-td-empty">' +
                          t('accounts_workspace.empty_table_msg', 'لا توجد سجلات تطابق معايير الفلترة المحددة.') +
                        '</td></tr>';
      return;
    }

    tbody.innerHTML = customers.map(c => {
      const name = lang === 'ar' ? c.name_ar : c.name_en;
      const prog = lang === 'ar' ? c.program_ar : c.program_en;
      let statusClass = 'status-confirmed';
      let statusLabel = lang === 'ar' ? 'مؤكد' : 'Confirmed';

      if (c.booking_status === 'deposit_paid') {
        statusClass = 'status-pending';
        statusLabel = lang === 'ar' ? 'عربون مدفوع' : 'Deposit Paid';
      } else if (c.booking_status === 'cancelled') {
        statusClass = 'status-cancelled status-rejected';
        statusLabel = lang === 'ar' ? 'ملغي' : 'Cancelled';
      }

      return '<tr>' +
               '<td><span class="acc-code-pill">' + formatNumber(c.id, lang) + '</span></td>' +
               '<td>' +
                 '<div class="acc-cust-cell">' +
                   '<span class="acc-cust-name">' + name + '</span>' +
                   '<span class="acc-cust-sub">' + (lang === 'ar' ? c.governorate_ar : c.governorate_en) + '</span>' +
                 '</div>' +
               '</td>' +
               '<td dir="ltr" class="acc-td-phone">' + formatNumber(c.phone, lang) + '</td>' +
               '<td><span class="acc-text-truncate" title="' + prog + '">' + prog + '</span></td>' +
               '<td><span class="acc-status-pill ' + statusClass + '">' + statusLabel + '</span></td>' +
               '<td><span class="acc-amount-cell">' + formatCurrency(c.paid_amount, lang) + '</span></td>' +
               '<td><span class="acc-date-muted">' + formatNumber(c.last_activity, lang) + '</span></td>' +
             '</tr>';
    }).join('');
  }

  // --- Requirement 7: Redesigned "عرض الإيصال" Button in Recent Transactions ---
  function renderRecentTransactions(transactions) {
    const tbody = document.getElementById('acc-txn-tbody');
    if (!tbody) return;
    const lang = currentLang;

    if (!transactions || transactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="acc-td-empty">' +
                          t('accounts_workspace.empty_table_msg', 'لا توجد سجلات تطابق معايير الفلترة المحددة.') +
                        '</td></tr>';
      return;
    }

    tbody.innerHTML = transactions.map(tx => {
      const custName = lang === 'ar' ? tx.customer_name_ar : tx.customer_name_en;
      const methodName = lang === 'ar' ? tx.method_name_ar : tx.method_name_en;
      const isVerified = tx.status === 'verified';
      const statusClass = isVerified ? 'status-confirmed' : (tx.status === 'refunded' ? 'status-refunded' : 'status-pending');
      const statusLabel = isVerified ? (lang === 'ar' ? 'موثق ومعتمد' : 'Verified') : (tx.status === 'refunded' ? (lang === 'ar' ? 'مسترد بالكامل' : 'Refunded') : (lang === 'ar' ? 'قيد المراجعة' : 'Pending'));

      return '<tr>' +
               '<td><span class="acc-code-pill">' + formatNumber(tx.id, lang) + '</span></td>' +
               '<td><span class="acc-ref-link">' + formatNumber(tx.receipt_ref, lang) + '</span></td>' +
               '<td>' +
                 '<div class="acc-cust-cell">' +
                   '<span class="acc-cust-name">' + custName + '</span>' +
                   '<span class="acc-cust-sub">' + formatNumber(tx.booking_ref, lang) + '</span>' +
                 '</div>' +
               '</td>' +
               '<td><span class="acc-method-pill method-' + tx.payment_method + '">' + methodName + '</span></td>' +
               '<td><span class="acc-amount-cell bold">' + formatCurrency(tx.amount, lang) + '</span></td>' +
               '<td><span class="acc-status-pill ' + statusClass + '">' + statusLabel + '</span></td>' +
               '<td>' +
                 '<button type="button" class="acc-btn-receipt" onclick="window.AccountsWorkspace.viewReceipt(\'' + tx.id + '\')" aria-label="' + (lang === 'ar' ? 'عرض إيصال السجل ' + tx.id : 'View receipt for ' + tx.id) + '">' +
                   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' +
                   '<span>' + (lang === 'ar' ? 'عرض الإيصال' : 'View Receipt') + '</span>' +
                 '</button>' +
               '</td>' +
             '</tr>';
    }).join('');
  }

  // --- Requirement 8: Completely Reorganized Daily Operations & Financial Activity Log ---
  function renderActivityFeed(activities) {
    const list = document.getElementById('acc-activity-list');
    if (!list) return;
    const lang = currentLang;

    if (!activities || activities.length === 0) {
      list.innerHTML = '<div class="acc-empty-state">' +
                         '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
                         '<p>' + t('accounts_workspace.empty_activity_msg', 'لا توجد أنشطة مسجلة ضمن نطاق الفلترة المختار.') + '</p>' +
                       '</div>';
      return;
    }

    const employeeNames = {
      'ahmed_sabry': (lang === 'ar' ? 'أحمد صبري' : 'Ahmed Sabry'),
      'sara_hassan': (lang === 'ar' ? 'سارة حسن' : 'Sara Hassan'),
      'omar_farouk': (lang === 'ar' ? 'عمر فاروق' : 'Omar Farouk'),
      'system': (lang === 'ar' ? 'النظام الآلي' : 'System Automation')
    };

    list.innerHTML = activities.map(act => {
      const typeLabel = lang === 'ar' ? (act.type_ar || act.type) : (act.type_en || act.type);
      const title = lang === 'ar' ? act.title_ar : act.title_en;
      const custName = lang === 'ar' ? act.customer_name_ar : act.customer_name_en;
      const refId = act.ref_id;
      const empName = employeeNames[act.employee] || act.employee;
      const timeRel = lang === 'ar' ? act.time_relative_ar : act.time_relative_en;
      const statusLabel = lang === 'ar' ? act.status_ar : act.status_en;

      // Assign distinct, semantic status badge classes (Change 4)
      let statusBadgeClass = 'badge-act-default';
      const s = (act.status_en || act.status || '').toLowerCase();
      if (s.includes('pending verification')) {
        statusBadgeClass = 'badge-act-pending-verification';
      } else if (s.includes('pending agreement') || s.includes('agreement')) {
        statusBadgeClass = 'badge-act-pending-agreement';
      } else if (s.includes('review') || s.includes('under_review')) {
        statusBadgeClass = 'badge-act-under-review';
      } else if (s.includes('confirmed')) {
        statusBadgeClass = 'badge-act-confirmed';
      } else if (s.includes('active contract') || s.includes('active')) {
        statusBadgeClass = 'badge-act-active-contract';
      } else if (s.includes('executed')) {
        statusBadgeClass = 'badge-act-executed';
      } else if (s.includes('cancelled')) {
        statusBadgeClass = 'badge-act-cancelled';
      } else if (s.includes('completed')) {
        statusBadgeClass = 'badge-act-completed';
      } else {
        statusBadgeClass = 'badge-act-pending-verification';
      }

      let typeBadgeClass = 'type-' + (act.type || 'default');

      return '<div class="acc-activity-card-item">' +
               '<!-- Header Row -->' +
               '<div class="acc-act-header-row">' +
                 '<div class="acc-act-type-title">' +
                   '<span class="acc-act-type-badge ' + typeBadgeClass + '">' + typeLabel + '</span>' +
                   '<h4 class="acc-act-title">' + title + '</h4>' +
                 '</div>' +
                 '<div class="acc-act-time">' +
                   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
                   '<span>' + timeRel + '</span>' +
                 '</div>' +
               '</div>' +
               '<!-- Structured Details Row -->' +
               '<div class="acc-act-details-row">' +
                 '<div class="acc-act-meta-group">' +
                   '<div class="acc-act-meta-col">' +
                     '<span class="acc-act-meta-label">' + (lang === 'ar' ? 'العميل / الطرف:' : 'Customer / Party:') + '</span>' +
                     '<span class="acc-act-meta-val bold">' + custName + '</span>' +
                   '</div>' +
                   '<div class="acc-act-meta-col">' +
                     '<span class="acc-act-meta-label">' + (lang === 'ar' ? 'الرمز المرجعي:' : 'Reference Code:') + '</span>' +
                     '<span class="acc-act-ref-pill">' + refId + '</span>' +
                   '</div>' +
                   '<div class="acc-act-meta-col">' +
                     '<span class="acc-act-meta-label">' + (lang === 'ar' ? 'المسؤول التنفيذي:' : 'Account Officer:') + '</span>' +
                     '<span class="acc-act-meta-val"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ' + empName + '</span>' +
                   '</div>' +
                 '</div>' +
                 '<div class="acc-act-status-col">' +
                   '<span class="acc-act-status-badge ' + statusBadgeClass + '">' + statusLabel + '</span>' +
                 '</div>' +
               '</div>' +
             '</div>';
    }).join('');
  }

  function renderAllDashboardComponents() {
    if (!window.AccountsMockData) return;

    const kpis = window.AccountsMockData.getDashboardKPIs(activeFilters);
    const breakdown = window.AccountsMockData.getCollectionsBreakdown(activeFilters);
    const trends = window.AccountsMockData.getDailyActivityTrends(activeFilters);
    const actions = window.AccountsMockData.getPendingActions(activeFilters);
    const customers = window.AccountsMockData.getFilteredCustomers(activeFilters);
    const transactions = window.AccountsMockData.getFilteredTransactions(activeFilters);
    const activities = window.AccountsMockData.getFilteredActivities(activeFilters);

    renderKPIs(kpis);
    renderDonutChart(breakdown);
    renderAnalyticalGraph(trends);
    renderPendingActions(actions);
    renderRecentCustomers(customers);
    renderRecentTransactions(transactions);
    renderActivityFeed(activities);
    updateActiveFilterBadge();
  }

  // --- 11. Filter Handlers ---
  function updateActiveFilterBadge() {
    let count = 0;
    if (activeFilters.dateRange !== 'all') count++;
    if (activeFilters.exactDate) count++;
    if (activeFilters.paymentMethod !== 'all') count++;
    if (activeFilters.verificationStatus !== 'all') count++;
    if (activeFilters.bookingStatus !== 'all') count++;
    if (activeFilters.refundStatus !== 'all') count++;
    if (activeFilters.assignedEmployee !== 'all') count++;

    const badge = document.getElementById('active-filter-badge');
    if (badge) {
      if (count > 0) {
        badge.style.display = 'inline-flex';
        badge.textContent = currentLang === 'ar' ? ('(' + formatNumber(count, 'ar') + ')') : ('(' + count + ')');
      } else {
        badge.style.display = 'none';
      }
    }
  }

  function initFilterPanel() {
    const chips = document.querySelectorAll('.acc-chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => c.classList.remove('is-active'));
        this.classList.add('is-active');
        activeFilters.dateRange = this.getAttribute('data-range') || 'all';
        activeFilters.exactDate = null;
        renderCalendarPicker();
        renderAllDashboardComponents();
      });
    });

    const form = document.getElementById('acc-filter-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const paySel = document.getElementById('filter-payment-method');
        const verSel = document.getElementById('filter-verification-status');
        const bkgSel = document.getElementById('filter-booking-status');
        const refSel = document.getElementById('filter-refund-status');
        const empSel = document.getElementById('filter-employee');

        if (paySel) activeFilters.paymentMethod = paySel.value;
        if (verSel) activeFilters.verificationStatus = verSel.value;
        if (bkgSel) activeFilters.bookingStatus = bkgSel.value;
        if (refSel) activeFilters.refundStatus = refSel.value;
        if (empSel) activeFilters.assignedEmployee = empSel.value;

        renderAllDashboardComponents();
        showToast(currentLang === 'ar' ? 'تم تطبيق معايير الفلترة المحددة' : 'Search filters applied successfully');
      });
    }

    const resetBtn = document.getElementById('btn-clear-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeFilters = {
          dateRange: 'all',
          exactDate: null,
          paymentMethod: 'all',
          verificationStatus: 'all',
          bookingStatus: 'all',
          refundStatus: 'all',
          assignedEmployee: 'all'
        };

        chips.forEach(c => {
          if (c.getAttribute('data-range') === 'all') c.classList.add('is-active');
          else c.classList.remove('is-active');
        });

        const selects = document.querySelectorAll('.acc-filter-select');
        selects.forEach(s => s.value = 'all');

        renderCalendarPicker();
        renderAllDashboardComponents();
        showToast(currentLang === 'ar' ? 'تمت إعادة ضبط كافة الفلاتر' : 'All filters reset');
      });
    }
  }

  // --- 12. Global Public API for workspace ---
  window.AccountsWorkspace = {
    setLanguage,
    setTheme,
    t,
    formatNumber,
    formatCurrency,
    showToast,
    getCurrentLang: () => currentLang,
    getCurrentTheme: () => currentTheme,
    onPageRefresh: function (cb) {
      if (typeof cb === 'function') refreshListeners.push(cb);
    },
    handleAuditAction: function (actionId) {
      showToast(currentLang === 'ar' ? ('مباشرة التدقيق والمطابقة للمهمة: ' + actionId) : ('Initiating audit review for: ' + actionId));
    },
    viewReceipt: function (txId) {
      if (!window.AccountsMockData) return;
      const tx = window.AccountsMockData.TRANSACTIONS.find(t => t.id === txId);
      if (tx) {
        openReceiptModal(tx);
      }
    },
    closeReceiptModal
  };

  // --- 13. Initialization on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', async function () {
    html.setAttribute('data-theme', currentTheme);
    initUserSession();
    currentDict = await loadTranslations(currentLang);
    applyTranslations();
    initDrawer();
    initLogoutModal();
    initCalendarDatePicker();
    initFilterPanel();

    const langBtn = document.getElementById('acc-lang-switcher');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        const nextLang = currentLang === 'ar' ? 'en' : 'ar';
        setLanguage(nextLang);
      });
    }

    const themeBtn = document.getElementById('acc-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
      });
    }

    const receiptCloseBtn = document.getElementById('rcpt-modal-close-btn');
    if (receiptCloseBtn) {
      receiptCloseBtn.addEventListener('click', closeReceiptModal);
    }
    const receiptCloseIcon = document.getElementById('rcpt-modal-close-icon');
    if (receiptCloseIcon) {
      receiptCloseIcon.addEventListener('click', closeReceiptModal);
    }
    const receiptBackdrop = document.querySelector('#acc-receipt-modal .acc-modal-backdrop-inner') || document.getElementById('rcpt-backdrop');
    if (receiptBackdrop) {
      receiptBackdrop.addEventListener('click', closeReceiptModal);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeReceiptModal();
      }
    });
  });

})();
