/**
 * MIQAT PARTNER HUB — FRONTEND ENGINE (REFINED)
 * 
 * Features:
 * 1. Session verification & role guard for newly registered partner agencies.
 * 2. Real-time data hydration from /api/partner-hub/overview.
 * 3. 100% Arabic (RTL, Eastern Arabic-Indic numerals ٠–٩) vs 100% English (LTR, Western 0–9).
 * 4. Dual theme (Light / Dark) parity with persistent preference.
 * 5. Full Hamburger Navigation Drawer on ALL screen sizes with keyboard accessibility & scroll lock.
 * 6. Accessible account menu, mobile drawer, and session logout.
 */

(function () {
  'use strict';

  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';

  const API_BASE_URL = (function () {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.port === '4173') return '';
      const host = window.location.hostname || '127.0.0.1';
      return 'http://' + host + ':4173';
    }
    return 'http://127.0.0.1:4173';
  })();

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let currentDict = null;
  let currentUser = null;
  let currentOverviewData = null;

  const html = document.documentElement;

  // --- Authenticated Fetch Helper ---
  async function apiFetch(endpoint, options) {
    options = options || {};
    const url = endpoint.startsWith('http') ? endpoint : (API_BASE_URL + endpoint);
    const token = localStorage.getItem('miqat_token');

    const headers = Object.assign({}, options.headers || {});
    if (token && !headers['Authorization']) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, Object.assign({}, options, { headers }));
  }

  // --- Translation Loader ---
  async function loadTranslations(lang) {
    try {
      const res = await fetch('./locales/' + lang + '.json');
      if (!res.ok) throw new Error('Failed to load translations for ' + lang);
      return await res.json();
    } catch (e) {
      console.warn('Fallback loading translations for ' + lang + ':', e);
      return {};
    }
  }

  function getTranslation(keyPath, dict) {
    if (!dict || !keyPath) return keyPath;
    const parts = keyPath.split('.');
    let curr = dict;
    for (let i = 0; i < parts.length; i++) {
      if (curr && typeof curr === 'object' && parts[i] in curr) {
        curr = curr[parts[i]];
      } else {
        return keyPath;
      }
    }
    return typeof curr === 'string' ? curr : keyPath;
  }

  // Convert Western digits (0-9) to Eastern Arabic-Indic digits (٠-٩)
  function toArabicIndicDigits(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[0-9]/g, function (d) {
      return String.fromCharCode(1632 + parseInt(d, 10));
    });
  }

  // Convert Eastern Arabic-Indic digits (٠-٩) to Western digits (0-9)
  function toWesternDigits(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[٠-٩]/g, function (d) {
      return String(d.charCodeAt(0) - 1632);
    });
  }

  function formatNumericText(val, lang) {
    if (val === null || val === undefined) return '';
    if (lang === 'ar') {
      return toArabicIndicDigits(val);
    }
    return toWesternDigits(val);
  }

  function applyTranslations(dict, lang) {
    currentDict = dict;
    currentLang = lang;
    localStorage.setItem(STORAGE_LANG, lang);

    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Document title
    const pageTitle = getTranslation('partner_hub.page_title', dict);
    if (pageTitle && pageTitle !== 'partner_hub.page_title') {
      document.title = pageTitle;
    }

    // Text elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const text = getTranslation(key, dict);
      if (text && text !== key) {
        if (el.classList.contains('font-numeric') || el.hasAttribute('data-numeric')) {
          el.textContent = formatNumericText(text, lang);
        } else {
          el.textContent = text;
        }
      }
    });

    // Attribute translations (title, aria-label, placeholder)
    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(function (el) {
      const spec = el.getAttribute('data-i18n-attr');
      const pairs = spec.split('|');
      pairs.forEach(function (pair) {
        const [attr, key] = pair.split(':');
        if (attr && key) {
          const text = getTranslation(key, dict);
          if (text && text !== key) {
            el.setAttribute(attr, text);
          }
        }
      });
    });

    // Language Toggle Button (Short codes: EN / AR)
    const langLabelEl = document.getElementById('hubLangLabel');
    const langBtn = document.getElementById('hubLangToggle');
    if (langLabelEl) {
      // Arabic mode -> display 'EN' to switch to English
      // English mode -> display 'AR' to switch to Arabic
      langLabelEl.textContent = lang === 'ar' ? 'EN' : 'AR';
    }
    if (langBtn) {
      const targetTitle = lang === 'ar' ? 'التبديل إلى اللغة الإنجليزية (EN)' : 'Switch to Arabic (AR)';
      langBtn.setAttribute('title', targetTitle);
      langBtn.setAttribute('aria-label', targetTitle);
      langBtn.setAttribute('data-current-lang', lang);
      langBtn.setAttribute('data-target-lang', lang === 'ar' ? 'en' : 'ar');
    }

    // Re-hydrate dynamic overview data if already loaded or available in session cache
    if (currentOverviewData) {
      renderOverviewData(currentOverviewData, lang);
    } else {
      try {
        const cachedUser = localStorage.getItem('miqat_user');
        if (cachedUser) {
          renderOverviewData({ user: JSON.parse(cachedUser) }, lang);
        }
      } catch (e) {}
    }
  }

  // --- Theme Controller ---
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem(STORAGE_THEME, theme);
    html.setAttribute('data-theme', theme);

    const iconMoon = document.getElementById('hubIconMoon');
    const iconSun = document.getElementById('hubIconSun');

    if (iconMoon && iconSun) {
      if (theme === 'dark') {
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
      } else {
        iconMoon.style.display = 'block';
        iconSun.style.display = 'none';
      }
    }
  }

  // --- Authentication & Role Guard ---
  async function checkAuth() {
    const token = localStorage.getItem('miqat_token');
    const userStr = localStorage.getItem('miqat_user');

    if (!token || !userStr) {
      window.location.replace('login.html');
      return;
    }

    try {
      currentUser = JSON.parse(userStr);
    } catch (e) {
      window.location.replace('login.html');
      return;
    }

    try {
      const res = await apiFetch('/api/partner-hub/overview');
      if (res.status === 403) {
        window.location.replace('company-dashboard.html');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load overview data');
      }
      const json = await res.json();
      const payload = (json && json.data) ? json.data : json;
      currentOverviewData = payload;
      renderOverviewData(payload, currentLang);
    } catch (err) {
      console.warn('API error, using cached user data:', err);
      currentOverviewData = { user: currentUser };
      renderOverviewData({ user: currentUser }, currentLang);
    }
  }

  // --- Render Overview Data ---
  function renderOverviewData(data, lang) {
    if (!data) return;
    const payload = data.data || data;
    if (!payload.user) return;
    const user = payload.user;
    const app = payload.application || {};

    const isAr = lang === 'ar';
    const compName = isAr
      ? (user.company_name || user.name || 'شركة سياحة')
      : (user.company_name_en || 'New Travel Agency');
    const initial = isAr
      ? compName.charAt(0)
      : (user.company_name_en ? user.company_name_en.charAt(0) : 'T');

    // Top Bar Account Menu
    const avatarInitialEl = document.getElementById('hubAvatarInitial');
    if (avatarInitialEl) avatarInitialEl.textContent = initial;

    const accountNameEl = document.getElementById('hubAccountName');
    if (accountNameEl) accountNameEl.textContent = compName;

    const menuCompanyEl = document.getElementById('hubMenuCompany');
    if (menuCompanyEl) menuCompanyEl.textContent = compName;

    const menuPhoneEl = document.getElementById('hubMenuPhone');
    if (menuPhoneEl) {
      menuPhoneEl.textContent = formatNumericText(user.phone, lang);
    }

    const menuStatusEl = document.getElementById('hubMenuStatus');
    if (menuStatusEl) {
      menuStatusEl.textContent = isAr ? 'قيد المراجعة الإدارية' : 'Pending Administrative Review';
    }

    // Status Section Card (Task 5)
    const statusCompanyEl = document.getElementById('statusCompName');
    if (statusCompanyEl) statusCompanyEl.textContent = compName;

    const statusRespEl = document.getElementById('statusResponsible');
    if (statusRespEl) {
      statusRespEl.textContent = isAr
        ? (user.responsible_person || 'مقدم الطلب (حساب تجريبي)')
        : 'Applicant (Test Account)';
    }

    const advAvatarEl = document.querySelector('.hub-advisor-avatar');
    if (advAvatarEl) {
      advAvatarEl.textContent = isAr ? 'أ' : 'A';
    }

    const statusPhoneEl = document.getElementById('statusPhone');
    if (statusPhoneEl) statusPhoneEl.textContent = formatNumericText(user.phone, lang);

    const statusDateEl = document.getElementById('statusDate');
    if (statusDateEl) {
      statusDateEl.textContent = isAr ? '١ نوفمبر ٢٠٢٦' : '1 November 2026';
    }

    const statusSlaEl = document.getElementById('statusSla');
    if (statusSlaEl) {
      statusSlaEl.textContent = isAr ? '٤٨ ساعة عمل' : '48 Business Hours';
    }

    // Advisor Info in Support Section
    const adv = app.advisor || {};
    const advNameEl = document.getElementById('advName');
    if (advNameEl) advNameEl.textContent = isAr ? (adv.name_ar || 'أ/ أحمد محمود الشريف') : (adv.name_en || 'Mr. Ahmed Al-Sharif');

    const advTitleEl = document.getElementById('advTitle');
    if (advTitleEl) advTitleEl.textContent = isAr ? (adv.title_ar || 'مستشار علاقات الشركاء وشركات السياحة') : (adv.title_en || 'Partner Relations Advisor');

    const advPhoneEl = document.getElementById('advPhone');
    if (advPhoneEl) advPhoneEl.textContent = formatNumericText(adv.phone || '01022334455', lang);

    const advWhatsappEl = document.getElementById('advWhatsapp');
    if (advWhatsappEl) advWhatsappEl.textContent = formatNumericText(adv.whatsapp || '01022334455', lang);

    const advEmailEl = document.getElementById('advEmail');
    if (advEmailEl) advEmailEl.textContent = adv.email || 'partners@miqat.me';

    const advHotlineEl = document.getElementById('advHotline');
    if (advHotlineEl) advHotlineEl.textContent = formatNumericText(adv.hotline || '19800', lang);

    const advHoursEl = document.getElementById('advHours');
    if (advHoursEl) advHoursEl.textContent = isAr ? 'الأحد - الخميس: ٩:٠٠ ص حتى ٥:٠٠ م بتوقيت القاهرة' : 'Sunday – Thursday: 9:00 AM – 5:00 PM (Cairo Time)';
  }

  // --- Scrollspy & Navigation Active State ---
  function initScrollspy() {
    const navLinks = document.querySelectorAll('.hub-drawer-link, .hub-nav-link');
    const sections = [];

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#sec-')) {
        const sec = document.querySelector(href);
        if (sec && !sections.includes(sec)) sections.push(sec);
      }
    });

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === ('#' + id)) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, {
      rootMargin: '-15% 0px -75% 0px',
      threshold: 0
    });

    sections.forEach(function (s) {
      observer.observe(s);
    });

    // Smooth scroll support
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#sec-')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, href);
            closeMobileDrawer(); // Close drawer after clicking any link
          }
        }
      });
    });
  }

  // --- Account Dropdown ---
  function initAccountDropdown() {
    const btn = document.getElementById('hubAccountBtn');
    const menu = document.getElementById('hubDropdownMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // --- Task 1: Navigation Drawer Controller (Works on ALL Screen Sizes) ---
  function openMobileDrawer() {
    const drawer = document.getElementById('hubMobileDrawer');
    const backdrop = document.getElementById('hubDrawerBackdrop');
    const toggle = document.getElementById('hubMenuToggle') || document.getElementById('hubMobileToggle');
    if (drawer && backdrop) {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.classList.add('hub-drawer-open');
      document.body.style.overflow = 'hidden';
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      
      // Accessibility focus on close button
      const closeBtn = document.getElementById('hubDrawerCloseBtn') || document.getElementById('hubDrawerClose');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById('hubMobileDrawer');
    const backdrop = document.getElementById('hubDrawerBackdrop');
    const toggle = document.getElementById('hubMenuToggle') || document.getElementById('hubMobileToggle');
    if (drawer && backdrop) {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.classList.remove('hub-drawer-open');
      document.body.style.overflow = '';
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }

  function initMobileDrawer() {
    const toggle = document.getElementById('hubMenuToggle') || document.getElementById('hubMobileToggle');
    const closeBtn = document.getElementById('hubDrawerCloseBtn') || document.getElementById('hubDrawerClose');
    const backdrop = document.getElementById('hubDrawerBackdrop');

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        openMobileDrawer();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMobileDrawer();
        if (toggle) toggle.focus();
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMobileDrawer();
        if (toggle) toggle.focus();
      });
    }

    // Keyboard support: Escape closes drawer and restores focus
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const drawer = document.getElementById('hubMobileDrawer');
        if (drawer && drawer.classList.contains('is-open')) {
          closeMobileDrawer();
          if (toggle) toggle.focus();
        }
      }
    });

    // Close drawer when any drawer link is clicked
    const drawerLinks = document.querySelectorAll('.hub-drawer-link');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileDrawer();
      });
    });
  }

  // --- Logout Handler ---
  async function handleLogout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}

    localStorage.removeItem('miqat_token');
    localStorage.removeItem('miqat_user');

    if (window.location.replace) {
      window.location.replace('login.html');
    } else {
      window.location.href = 'login.html';
    }
  }

  // --- Initialization ---
  async function init() {
    // 1. Initial Theme
    applyTheme(currentTheme);

    // 2. Load Translations
    const dict = await loadTranslations(currentLang);
    applyTranslations(dict, currentLang);

    // 3. Setup Lang Switcher
    const langBtn = document.getElementById('hubLangToggle');
    if (langBtn) {
      langBtn.addEventListener('click', async function () {
        const nextLang = currentLang === 'ar' ? 'en' : 'ar';
        const newDict = await loadTranslations(nextLang);
        applyTranslations(newDict, nextLang);
      });
    }

    // 4. Setup Theme Switcher
    const themeBtn = document.getElementById('hubThemeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }

    // 5. Setup Account Menu & Navigation Drawer
    initAccountDropdown();
    initMobileDrawer();

    // 6. Setup Logout Buttons
    const logoutBtns = document.querySelectorAll('.js-hub-logout');
    logoutBtns.forEach(function (btn) {
      btn.addEventListener('click', handleLogout);
    });

    // 7. Scrollspy
    initScrollspy();

    // 8. Auth Check & Data Hydration
    await checkAuth();
  }

  async function switchLanguage(lang) {
    const nextLang = lang || (currentLang === 'ar' ? 'en' : 'ar');
    const newDict = await loadTranslations(nextLang);
    applyTranslations(newDict, nextLang);
    if (currentOverviewData) {
      renderOverviewData(currentOverviewData, nextLang);
    }
    return nextLang;
  }

  // Expose on window for debugging or extension
  window.MiqatPartnerHub = {
    init,
    checkAuth,
    applyTranslations,
    applyTheme,
    switchLanguage,
    openMobileDrawer,
    closeMobileDrawer,
    handleLogout,
    get currentDict() { return currentDict; },
    get currentLang() { return currentLang; },
    get currentTheme() { return currentTheme; }
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
