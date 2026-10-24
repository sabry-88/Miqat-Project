/**
 * MIQAT PLATFORM — CORE INTERACTION ENGINE
 * Handles:
 *  1. Bilingual Localization (Arabic / English, RTL / LTR)
 *  2. Theme Toggling (Light / Dark with local storage persistence)
 *  3. Accessible Mobile Drawer Navigation
 *  4. Program Category Filtering
 *  5. Accessible Modals (Login & Partnership Request)
 */

(function () {
  'use strict';

  // --- State & Storage Keys ---
  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let translations = {
    ar: null,
    en: null
  };

  // --- DOM Elements Cache ---
  const html = document.documentElement;
  const langToggleBtn = document.getElementById('langToggleBtn');
  const mobileLangToggleBtn = document.getElementById('mobileLangToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Modals (Customer Program Details & Tourism Partner Onboarding Choice Dialogs)
  const partnerChoiceModal = document.getElementById('partnerChoiceModal');
  const accountChoiceModal = document.getElementById('accountChoiceModal');
  const openPartnerBtns = document.querySelectorAll('[data-open-modal="partner"]');
  const requestDetailsBtns = document.querySelectorAll('[data-action="request-details"]');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  const choiceLoginLink = document.getElementById('choiceLoginLink');
  const choiceRegisterLink = document.getElementById('choiceRegisterLink');
  const accountChoiceBadgeText = document.getElementById('accountChoiceBadgeText');

  // Categories Tabs
  const categoryTabs = document.querySelectorAll('.category-tab-btn');
  const categoryGroups = document.querySelectorAll('.categories-group');

  /**
   * Load JSON translations with robust fallback for local file:// protocol
   */
  async function loadTranslations(lang) {
    if (translations[lang]) return translations[lang];

    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      translations[lang] = data;
      return data;
    } catch (err) {
      console.warn(`Could not fetch ./locales/${lang}.json directly (e.g. file:// protocol restriction). Using preloaded bundle.`, err);
      return translations[lang] || fallbackLocales[lang] || {};
    }
  }

  /**
   * Helper to retrieve nested object values via dot-notation (e.g. "hero.heading")
   */
  function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) return null;
    return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  /**
   * Apply translations to all DOM elements with data-i18n and data-i18n-attr
   */
  async function applyTranslations(lang) {
    let dict = await loadTranslations(lang);
    if (!dict) return;

    // Update root language and direction attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.title = lang === 'ar'
      ? 'ميقات — منصة اختيار ومقارنة برامج الحج والعمرة'
      : 'Miqat — Hajj & Umrah Program Comparison Platform';

    // 1. Text elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(dict, key);
      if (val !== null) {
        el.textContent = val;
      }
    });

    // 2. Attributes (e.g. placeholder, aria-label, title)
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach((mapping) => {
        const [attr, key] = mapping.split(':').map((s) => s.trim());
        if (attr && key) {
          const val = getNestedValue(dict, key);
          if (val !== null) {
            el.setAttribute(attr, val);
          }
        }
      });
    });

    // 3. Update toggler button accessible texts & labels
    const nextLangText = lang === 'ar' ? 'EN' : 'عربي';
    const nextLangAria = lang === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic';

    if (langToggleBtn) {
      const langLabel = langToggleBtn.querySelector('.lang-label');
      if (langLabel) langLabel.textContent = nextLangText;
      langToggleBtn.setAttribute('aria-label', nextLangAria);
      langToggleBtn.setAttribute('title', nextLangAria);
    }

    if (mobileLangToggleBtn) {
      const mLabel = mobileLangToggleBtn.querySelector('.lang-label');
      if (mLabel) mLabel.textContent = nextLangText;
      mobileLangToggleBtn.setAttribute('aria-label', nextLangAria);
    }

    updateThemeAriaLabels();
  }

  /**
   * Toggle Language between Arabic and English
   */
  function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem(STORAGE_LANG, currentLang);
    applyTranslations(currentLang);
  }

  /**
   * Theme Management (Light / Dark)
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    updateThemeAriaLabels();
  }

  function updateThemeAriaLabels() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const isAr = currentLang === 'ar';
    const ariaText = isDark
      ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode')
      : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode');

    [themeToggleBtn, mobileThemeToggleBtn].forEach((btn) => {
      if (btn) {
        btn.setAttribute('aria-label', ariaText);
        btn.setAttribute('title', ariaText);
        const iconMoon = btn.querySelector('.icon-moon');
        const iconSun = btn.querySelector('.icon-sun');
        if (iconMoon && iconSun) {
          iconMoon.style.display = isDark ? 'none' : 'block';
          iconSun.style.display = isDark ? 'block' : 'none';
        }
      }
    });
  }

  function toggleTheme() {
    currentTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_THEME, currentTheme);
    applyTheme(currentTheme);
  }

  /**
   * Mobile Drawer Navigation
   */
  function openMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (mobileNavClose) mobileNavClose.focus();
  }

  function closeMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    mobileMenuToggle.focus();
  }

  /**
   * Program Category Tabs Filtering
   */
  function initCategoryTabs() {
    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetType = tab.getAttribute('data-category-tab');

        // Update active tab styles
        categoryTabs.forEach((t) => {
          const isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Show/hide corresponding category groups
        categoryGroups.forEach((group) => {
          const groupType = group.getAttribute('data-group-type');
          if (targetType === 'all' || groupType === targetType) {
            group.style.display = 'block';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });

    // Gateway cards and external CTA triggers with [data-switch-tab]
    document.querySelectorAll('[data-switch-tab]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const targetType = trigger.getAttribute('data-switch-tab');
        const matchingTab = Array.from(categoryTabs).find(
          (t) => t.getAttribute('data-category-tab') === targetType
        );
        if (matchingTab) {
          matchingTab.click();
        }
      });
    });
  }

  /**
   * Accessible Modal Management
   */
  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button or first input
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function initModals() {
    // Open Partner Account Choice Modal (Tourism Companies)
    openPartnerBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileNav();
        }
        openModal(partnerChoiceModal);
      });
    });

    // Open Account Choice Modal for Customer Program Inquiries
    requestDetailsBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileNav();
        }

        const trip = btn.getAttribute('data-trip') || 'umrah';
        const programId = btn.getAttribute('data-program-id') || '';
        const isAr = currentLang === 'ar';
        const programName = isAr
          ? (btn.getAttribute('data-program-name-ar') || 'طلب تفاصيل البرنامج')
          : (btn.getAttribute('data-program-name-en') || 'Program Details Inquiry');

        if (accountChoiceBadgeText) {
          accountChoiceBadgeText.textContent = programName;
        }

        const query = `?redirect=program&trip=${encodeURIComponent(trip)}&programId=${encodeURIComponent(programId)}`;
        if (choiceLoginLink) {
          choiceLoginLink.href = `login.html${query}`;
        }
        if (choiceRegisterLink) {
          choiceRegisterLink.href = `register.html${query}`;
        }

        openModal(accountChoiceModal);
      });
    });

    modalCloseBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        closeModal(modal);
      });
    });

    // Close on overlay backdrop click
    if (partnerChoiceModal) {
      partnerChoiceModal.addEventListener('click', (e) => {
        if (e.target === partnerChoiceModal) {
          closeModal(partnerChoiceModal);
        }
      });
    }

    if (accountChoiceModal) {
      accountChoiceModal.addEventListener('click', (e) => {
        if (e.target === accountChoiceModal) {
          closeModal(accountChoiceModal);
        }
      });
    }
  }

  /**
   * Keyboard Navigation (Escape key handling)
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (accountChoiceModal && accountChoiceModal.classList.contains('is-active')) {
        closeModal(accountChoiceModal);
      } else if (partnerChoiceModal && partnerChoiceModal.classList.contains('is-active')) {
        closeModal(partnerChoiceModal);
      } else if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
        closeMobileNav();
      }
    }
  });

  /**
   * Smart Navbar Transparency over Hero Section
   * Transparent only at the very top of the landing page over the Hero.
   * Transitions to solid background as soon as the user starts scrolling down,
   * preventing navbar text from overlapping content as it scrolls underneath.
   */
  function initNavbarTransparency() {
    const header = document.getElementById('siteHeader');
    const hero = document.getElementById('hero');
    if (!header) return;
    if (!hero) {
      header.classList.remove('is-transparent');
      return;
    }

    // Small, sensible threshold to trigger solid navbar on scroll
    // and subtle hysteresis to avoid flickering around the boundary
    const SCROLL_THRESHOLD_SOLID = 24;
    const SCROLL_THRESHOLD_TRANSPARENT = 10;

    function updateNavbar() {
      const scrollY = window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0;
      const hash = window.location.hash;
      const isTargetingOtherSection = hash && hash !== '#hero' && hash !== '#main-content';

      if (scrollY <= SCROLL_THRESHOLD_TRANSPARENT && !isTargetingOtherSection) {
        header.classList.add('is-transparent');
      } else if (scrollY > SCROLL_THRESHOLD_SOLID || isTargetingOtherSection) {
        header.classList.remove('is-transparent');
      }
    }

    // Run immediately to set initial state
    updateNavbar();

    // Immediately make solid when navigating to any non-hero anchor link
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', () => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#hero' && targetId !== '#' && targetId !== '#main-content') {
          header.classList.remove('is-transparent');
        }
      });
    });

    // Smooth scroll listener via requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Handle hash change, page load, and viewport resize
    window.addEventListener('hashchange', updateNavbar, { passive: true });
    window.addEventListener('load', updateNavbar, { passive: true });
    window.addEventListener('resize', updateNavbar, { passive: true });
  }

  /**
   * Event Listeners Registration
   */
  function initEvents() {
    // Language Toggles
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (mobileLangToggleBtn) mobileLangToggleBtn.addEventListener('click', () => {
      toggleLanguage();
      closeMobileNav();
    });

    // Theme Toggles
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // Mobile Menu
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
    if (mobileNavDrawer) {
      const backdrop = mobileNavDrawer.querySelector('.mobile-nav-backdrop');
      if (backdrop) backdrop.addEventListener('click', closeMobileNav);
    }
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    initCategoryTabs();
    initModals();
    initNavbarTransparency();
  }

  const fallbackLocales = {
    ar: {},
    en: {}
  };

  /**
   * Initial Setup
   */
  async function init() {
    applyTheme(currentTheme);
    initEvents();

    // Pre-populate translations from JSON
    await applyTranslations(currentLang);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
