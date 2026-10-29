/**
 * MIQAT JOURNEYHUB — PAYMENTS & TRANSACTIONS FRONTEND ENGINE
 * 
 * Manages:
 * 1. Checkout preview, authoritative pricing, program selection & simulated execution
 * 2. Payment result visualization & test receipt watermark
 * 3. Customer transaction history & mutually exclusive state management
 * 4. Administrator transaction management & reason-based mock refunds
 * 5. Bilingual localization (AR RTL / EN LTR) & dual-theme parity (Light / Dark)
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';

  const API_BASE_URL = (function () {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.port === '4173') {
        return '';
      }
      const host = window.location.hostname || '127.0.0.1';
      return `http://${host}:4173`;
    }
    return 'http://127.0.0.1:4173';
  })();

  // Centralized Authenticated Fetch Helper
  async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('miqat_token');

    const headers = Object.assign({}, options.headers || {});
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
  }

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let translations = { ar: null, en: null };
  let currentUser = null;
  let currentDict = null;

  const html = document.documentElement;

  // --- Utility: Load and Apply Translations ---
  async function loadTranslations(lang) {
    if (translations[lang]) return translations[lang];
    try {
      const res = await fetch(`./locales/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      translations[lang] = data;
      return data;
    } catch (e) {
      console.warn('Failed to load translations for', lang, e);
      return {};
    }
  }

  function getTranslation(key, dict) {
    if (!dict) return key;
    const parts = key.split('.');
    let cur = dict;
    for (let part of parts) {
      if (cur && cur[part] !== undefined) {
        cur = cur[part];
      } else {
        return key;
      }
    }
    return cur !== null ? cur : key;
  }

  async function applyTranslations(lang) {
    const dict = await loadTranslations(lang);
    currentDict = dict;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const titleKey = document.body.dataset.pageTitleKey;
    if (titleKey) {
      document.title = getTranslation(titleKey, dict);
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslation(key, dict);
      if (val && val !== key) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getTranslation(key, dict);
      if (val && val !== key) el.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach((mapping) => {
        const [attr, key] = mapping.split(':').map((s) => s.trim());
        if (attr && key) {
          const val = getTranslation(key, dict);
          if (val && val !== key) el.setAttribute(attr, val);
        }
      });
    });
  }

  // --- Utility: Theme & Language Switchers ---
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
    currentTheme = theme;
    updateThemeToggleUI();
  }

  function updateThemeToggleUI() {
    const isDark = currentTheme === 'dark';
    const isAr = currentLang === 'ar';
    const text = isDark
      ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode')
      : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode');

    document.querySelectorAll('#themeToggleBtn, #mobileThemeToggleBtn').forEach(btn => {
      btn.setAttribute('aria-label', text);
      btn.setAttribute('title', text);
      const moon = btn.querySelector('.icon-moon');
      const sun = btn.querySelector('.icon-sun');
      if (moon && sun) {
        moon.style.display = isDark ? 'none' : 'block';
        sun.style.display = isDark ? 'block' : 'none';
      }
    });
  }

  function setupGlobalControls() {
    // Theme Toggle
    document.querySelectorAll('#themeToggleBtn, #mobileThemeToggleBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    });

    // Language Toggle
    document.querySelectorAll('#langToggleBtn, #mobileLangToggleBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const nextLang = currentLang === 'ar' ? 'en' : 'ar';
        currentLang = nextLang;
        localStorage.setItem(STORAGE_LANG, nextLang);
        document.querySelectorAll('#langToggleBtn .lang-label, #mobileLangToggleBtn .lang-label').forEach(lbl => {
          lbl.textContent = nextLang === 'ar' ? 'EN' : 'عربي';
        });
        await applyTranslations(nextLang);
        updateThemeToggleUI();
        if (typeof window.activePageRerender === 'function') {
          window.activePageRerender();
        }
      });
    });

    // Mobile Drawer Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavClose = document.getElementById('mobileNavClose');

    if (mobileMenuToggle && mobileNavDrawer) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileNavDrawer.classList.add('is-open');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
      });
    }
    if (mobileNavClose && mobileNavDrawer) {
      mobileNavClose.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('is-open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
      });
    }

    // Future Scope Modal (#my-account)
    const futureModal = document.getElementById('futureScopeModal');
    document.querySelectorAll('[data-future-item]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          mobileNavDrawer.classList.remove('is-open');
        }
        if (futureModal) {
          const descEl = document.getElementById('futureScopeDesc');
          const titleEl = document.getElementById('futureScopeTitle');
          const isAr = currentLang === 'ar';
          if (currentUser) {
            if (titleEl) titleEl.textContent = isAr ? `مرحباً ${currentUser.name}` : `Welcome ${currentUser.name}`;
            if (descEl) descEl.textContent = isAr 
              ? `رقم الموبايل: ${currentUser.phone} | المحافظة: ${currentUser.governorate || 'القاهرة'} • جاري تطوير لوحة تحكم متكاملة لإدارة رحلاتك وحجوزاتك.`
              : `Phone: ${currentUser.phone} | Governorate: ${currentUser.governorate || 'Cairo'} • Customer dashboard is in development.`;
          } else {
            if (titleEl) titleEl.textContent = isAr ? 'الملف الشخصي للعميل' : 'Customer Profile';
            if (descEl) descEl.textContent = isAr 
              ? 'جاري تطوير لوحة تحكم متكاملة لإدارة حجوزاتك ومستنداتك الشخصية.'
              : 'A dedicated customer dashboard to manage your reservations and documents is currently in development.';
          }
          futureModal.classList.add('is-active');
          futureModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    document.querySelectorAll('[data-close-future-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (futureModal) {
          futureModal.classList.remove('is-active');
          futureModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // --- Auth Session Check ---
  async function checkAuthSession() {
    let authUser = null;
    const token = localStorage.getItem('miqat_token');

    try {
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          authUser = data.user;
          localStorage.setItem('miqat_user', JSON.stringify(authUser));
        }
      }
    } catch (e) {
      console.warn('Failed to verify session with backend:', e);
    }

    if (!authUser) {
      const cached = localStorage.getItem('miqat_user');
      if (cached && token) {
        try {
          authUser = JSON.parse(cached);
        } catch (e) {}
      }
    }

    if (!authUser) {
      currentUser = null;
      return null;
    }

    currentUser = authUser;
    renderNavbarUser(authUser);
    return authUser;
  }

  function getClientInitial(name, lang = 'ar') {
    if (!name || typeof name !== 'string') return lang === 'en' ? 'M' : 'م';
    const trimmed = name.trim();
    if (!trimmed) return lang === 'en' ? 'M' : 'م';
    const firstChar = trimmed.charAt(0);
    return firstChar ? firstChar.toUpperCase() : (lang === 'en' ? 'M' : 'م');
  }

  function renderNavbarUser(user) {
    if (!user) return;
    const initial = getClientInitial(user.name, currentLang);
    const displayName = user.name || (currentLang === 'en' ? 'Customer' : 'عميل');

    document.querySelectorAll('#clientAvatarInitial, #mobileClientAvatarInitial').forEach(el => {
      el.textContent = initial;
    });

    const mobileClientName = document.getElementById('mobileClientName');
    if (mobileClientName) mobileClientName.textContent = displayName;

    const clientAvatar = document.getElementById('clientAvatar');
    if (clientAvatar) {
      clientAvatar.setAttribute('title', displayName);
      clientAvatar.setAttribute('aria-label', displayName);
    }

    // Logout Button
    document.querySelectorAll('#headerLogoutBtn, #mobileLogoutBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await apiFetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {}
        localStorage.removeItem('miqat_user');
        localStorage.removeItem('miqat_token');
        window.location.replace('index.html');
      });
    });
  }

  // --- Formatting Helpers ---
  function normalizeNumerals(str) {
    if (!str) return '';
    const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(str).replace(/[٠-٩]/g, (match) => arabicIndic.indexOf(match));
  }

  function formatMoney(amount, currency = 'EGP', lang = 'ar') {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString('en-US');
    if (lang === 'ar') {
      return `${formatted} ج.م`;
    }
    return `EGP ${formatted}`;
  }

  function formatDate(isoStr, lang = 'ar') {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  }

  function renderStatusPill(status, dict) {
    const s = String(status || '').toLowerCase();
    let label = status;
    let icon = '';

    if (s === 'paid') {
      label = getTranslation('payments.status_paid', dict);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      return `<span class="status-pill status-paid">${icon}<span>${label}</span></span>`;
    } else if (s === 'pending') {
      label = getTranslation('payments.status_pending', dict);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
      return `<span class="status-pill status-pending">${icon}<span>${label}</span></span>`;
    } else if (s === 'failed') {
      label = getTranslation('payments.status_failed', dict);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      return `<span class="status-pill status-failed">${icon}<span>${label}</span></span>`;
    } else if (s === 'cancelled') {
      label = getTranslation('payments.status_cancelled', dict);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      return `<span class="status-pill status-cancelled">${icon}<span>${label}</span></span>`;
    } else if (s === 'refunded') {
      label = getTranslation('payments.status_refunded', dict);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`;
      return `<span class="status-pill status-refunded">${icon}<span>${label}</span></span>`;
    }

    return `<span class="status-pill">${label}</span>`;
  }

  // --- Localization Catalogs for Dynamic Content ---
  const FEATURES_I18N = {
    'فنادق مصنفة ومعتمدة مع حافلات ترددية مستمرة': 'Certified classified hotels with 24/7 shuttle buses',
    'استخراج التأشيرة والتأمين الطبي الشامل': 'Visa issuance & comprehensive travel medical insurance',
    'إشراف إداري وتفويج منتظم طوال مدة الرحلة': 'Administrative supervision & organized logistics throughout',
    'مزارات مكة المكرمة والمدينة المنورة بإشراف مرشدين': 'Guided historical religious tours in Makkah & Madinah',
    'فنادق ٤ و ٥ نجوم قريبة سيراً على الأقدام': 'Upscale 4 & 5-star hotels within short walking distance',
    'رحلات طيران مباشرة واستقبال وتوديع خاص بالمطارات': 'Direct scheduled flights with dedicated airport meet & greet',
    'بوفيه إفطار يومي فاخر في مكة المكرمة والمدينة المنورة': 'Deluxe daily breakfast buffet in Makkah & Madinah',
    'مرشد ديني متخصص ومرافقة دائمة': 'Specialized religious scholar and round-the-clock guidance',
    'أجنحة فاخرة صف أول بإطلالة بانورامية على الكعبة': 'First-row luxury suites with panoramic Kaaba views',
    'استقبال صالة كبار الشخصيات وتنقلات بسيارات فاخرة خاصة': 'VIP lounge access & private luxury chauffeured transfers',
    'خدمة كونسيرج ومرافقة شخصية على مدار الساعة': '24/7 dedicated concierge service & personalized assistance',
    'مرونة تامة في تحديد التواريخ وبرامج المزارات الخاصة': 'Complete flexibility in travel dates & custom sightseeing',
    'باقات مخصصة للعشر الأواخر وليلة ختم القرآن': 'Dedicated packages for Ramadan last 10 days & Khatm Quran',
    'ترتيبات إفطار وسحور مجهزة يومياً': 'Daily arranged Iftar & Suhoor dining arrangements',
    'مواقع فندقية قريبة تسهل التواجد في الصلوات': 'Central hotel locations facilitating Taraweeh & Tahajjud prayers',
    'تأمين صحي وتنظيم تفويج مكثف ومستمر': 'Comprehensive health coverage & continuous crowd logistics',
    'إشراف ومطابقة تامة مع الضوابط واللوائح الرسمية': 'Full compliance with official tourism authority regulations',
    'مخيمات مكيفة ومجهزة بالكامل في منى وعرفات': 'Fully air-conditioned and serviced camps in Mina & Arafat',
    'خدمات إعاشة ووجبات طازجة طوال أيام التشريق': 'Full-board gourmet catering throughout Tashreeq days',
    'لجان طبية وإرشادية ترافق الحجاج على مدار الساعة': 'Accompanying medical & religious guidance teams 24/7',
    'مخيمات VIP مطورة بمواقع متقدمة قرب منشأة الجمرات': 'Upgraded VIP camps in prime locations near the Jamarat',
    'بوفيهات مفتوحة وخدمة ضيافة مستمرة طوال أيام المناسك': 'Open gourmet buffets & hospitality throughout rituals',
    'إقامة فندقية ٥ نجوم صف أول مطلة على الحرم': 'First-row 5-star hotel accommodations overlooking the Haram',
    'أطقم مخصصة للرعاية الصحية والإرشاد والتفويج الميسر': 'Dedicated teams for healthcare, spiritual guidance & movement',
    'تنظيم رسمي يخضع للضوابط والقرارات الحكومية المعتمدة': 'Official organization compliant with government decrees',
    'مخيمات معتمدة في منى وعرفات بإشراف بعثة الحج الرسمية': 'Certified Mina & Arafat camps supervised by Official Mission',
    'مواعيد قرعة وتسجيل محددة بدقة وفق الإعلانات الرسمية': 'Strict lottery schedule & registration per official announcements',
    'لا تمثل ميقات جهة تسجيل بالقرعة وإنما تقدم دليلاً استرشادياً موحداً': 'Miqat provides a unified comparison guide and is not a lottery registrar'
  };

  function localizeFeature(featureText, lang = 'ar') {
    if (!featureText) return '';
    if (lang === 'en') {
      return FEATURES_I18N[featureText] || featureText;
    }
    return featureText;
  }

  const CATEGORY_LABELS = {
    'umrah_economy': { ar: 'عمرة اقتصادية معتمدة', en: 'Standard Economy Umrah' },
    'umrah_premium': { ar: 'عمرة متميزة (٤ و ٥ نجوم)', en: 'Premium Umrah (4 & 5 Stars)' },
    'umrah_vip': { ar: 'عمرة فاخرة خاصة (VIP)', en: 'Luxury VIP Umrah Experience' },
    'umrah_ramadan': { ar: 'عمرة شهر رمضان المبارك', en: 'Holy Month of Ramadan Umrah' },
    'hajj_tourist': { ar: 'الحج السياحي المنظم', en: 'Organized Tourist Hajj Program' },
    'hajj_vip': { ar: 'الحج الفاخر بالمشاعر (VIP)', en: 'Luxury VIP Hajj Experience' },
    'hajj_lottery': { ar: 'حج القرعة (المسار الرسمي المنظم)', en: 'Official Lottery Hajj (General Track)' }
  };

  function getCategoryLabel(category, lang = 'ar') {
    if (!category) return '—';
    const entry = CATEGORY_LABELS[category];
    if (entry) {
      return entry[lang] || entry.ar || category;
    }
    return category;
  }

  function updateTravelerSelectOptions(selectEl, selectedCount, lang = 'ar') {
    if (!selectEl) return;
    const isAr = lang === 'ar';
    const currentVal = parseInt(selectedCount || selectEl.value || 1, 10);
    selectEl.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      if (isAr) {
        opt.textContent = i === 1 ? '١ فرد' : (i === 2 ? '٢ أفراد' : `${i} أفراد`);
      } else {
        opt.textContent = i === 1 ? '1 Traveler' : `${i} Travelers`;
      }
      if (i === currentVal) {
        opt.selected = true;
      }
      selectEl.appendChild(opt);
    }
    selectEl.value = String(currentVal);
  }

  // ========================================================
  // PAGE 1: CHECKOUT & PROGRAM SELECTION CONTROLLER (SECTION 3, 4, 5, 6, 7)
  // ========================================================
  async function initCheckoutPage() {
    const user = await checkAuthSession();
    if (!user) {
      const currentLoc = window.location.pathname.split('/').pop() || 'checkout.html';
      const search = window.location.search || '';
      window.location.replace(`login.html?redirect=${encodeURIComponent(currentLoc + search)}`);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    let currentProgramId = params.get('programId');
    let currentTravelers = parseInt(params.get('travelers') || '1', 10);
    if (isNaN(currentTravelers) || currentTravelers < 1 || currentTravelers > 5) {
      currentTravelers = 1;
    }
    let currentPaymentPlan = params.get('plan') || 'deposit_30';
    if (currentPaymentPlan !== 'full' && currentPaymentPlan !== 'deposit_30') {
      currentPaymentPlan = 'deposit_30';
    }
    const requestId = params.get('requestId') || null;

    // View Containers
    const programSelectionView = document.getElementById('programSelectionView');
    const bookingPreparationView = document.getElementById('bookingPreparationView');
    const checkoutExecutionView = document.getElementById('checkoutExecutionView');

    // View 1 Controls
    const programsSelectionGrid = document.getElementById('programsSelectionGrid');
    const catalogFilterTabs = document.querySelectorAll('#programCatalogFilterBar .filter-tab-btn');
    const catalogNoFilterMatchState = document.getElementById('catalogNoFilterMatchState');
    const btnResetProgramsFilter = document.getElementById('btnResetProgramsFilter');

    // View 2 Controls
    const btnReturnToCatalog = document.getElementById('btnReturnToCatalog');
    const prepProgramCategory = document.getElementById('prepProgramCategory');
    const prepProgramEligibilityBadge = document.getElementById('prepProgramEligibilityBadge');
    const prepProgramTitle = document.getElementById('prepProgramTitle');
    const prepProgramDescription = document.getElementById('prepProgramDescription');
    const prepSeasonVal = document.getElementById('prepSeasonVal');
    const prepDurationVal = document.getElementById('prepDurationVal');
    const prepHotelVal = document.getElementById('prepHotelVal');
    const prepProximityVal = document.getElementById('prepProximityVal');
    const prepTransportVal = document.getElementById('prepTransportVal');
    const prepFeaturesList = document.getElementById('prepFeaturesList');
    const prepUnitPriceVal = document.getElementById('prepUnitPriceVal');
    const prepTravelersSelect = document.getElementById('prepTravelersSelect');
    const planOptionDepositCard = document.getElementById('planOptionDepositCard');
    const planOptionFullCard = document.getElementById('planOptionFullCard');
    const planDepositDueVal = document.getElementById('planDepositDueVal');
    const planDepositRemainVal = document.getElementById('planDepositRemainVal');
    const planFullDueVal = document.getElementById('planFullDueVal');
    const planFullRemainVal = document.getElementById('planFullRemainVal');
    const prepSummaryPackageTotal = document.getElementById('prepSummaryPackageTotal');
    const prepSummaryPlanName = document.getElementById('prepSummaryPlanName');
    const prepSummaryPayableNow = document.getElementById('prepSummaryPayableNow');
    const prepSummaryRemainingRow = document.getElementById('prepSummaryRemainingRow');
    const prepSummaryRemainingBalance = document.getElementById('prepSummaryRemainingBalance');
    const btnProceedToCheckout = document.getElementById('btnProceedToCheckout');

    // View 3 Controls
    const btnReturnToPrep = document.getElementById('btnReturnToPrep');
    const checkoutProgramTitle = document.getElementById('checkoutProgramTitle');
    const checkoutProgramCategory = document.getElementById('checkoutProgramCategory');
    const checkoutConfirmedTravelers = document.getElementById('checkoutConfirmedTravelers');
    const checkoutPackageTotal = document.getElementById('checkoutPackageTotal');
    const checkoutSelectedPlan = document.getElementById('checkoutSelectedPlan');
    const checkoutPayableNow = document.getElementById('checkoutPayableNow');
    const checkoutRemainingRow = document.getElementById('checkoutRemainingRow');
    const checkoutRemainingBalance = document.getElementById('checkoutRemainingBalance');
    const checkoutErrorAlert = document.getElementById('checkoutErrorAlert');
    const checkoutErrorTitle = document.getElementById('checkoutErrorTitle');
    const checkoutErrorDesc = document.getElementById('checkoutErrorDesc');
    const checkoutErrorActionArea = document.getElementById('checkoutErrorActionArea');
    const checkoutForm = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitPaymentBtn');
    const unverifiedAlert = document.getElementById('priceUnverifiedAlert');
    const btnUnverifiedChange = document.getElementById('btnUnverifiedChangeProgram');
    const checkoutGridArea = document.getElementById('checkoutGridArea');

    let allPrograms = [];
    let selectedProgram = null;
    let selectedTravelers = currentTravelers;
    let selectedPaymentPlan = currentPaymentPlan;
    let verifiedPreviewData = null;
    let currentCatalogFilter = 'all';

    // Helper: Hide In-Page Alert
    function hideCheckoutError() {
      if (checkoutErrorAlert) {
        checkoutErrorAlert.style.display = 'none';
      }
    }

    // Helper: Show In-Page Alert (Section 8 - Replaces browser alerts)
    function showCheckoutError(title, desc, isAuthError = false) {
      if (!checkoutErrorAlert) return;
      if (checkoutErrorTitle) checkoutErrorTitle.textContent = title;
      if (checkoutErrorDesc) checkoutErrorDesc.textContent = desc;
      if (checkoutErrorActionArea) {
        checkoutErrorActionArea.style.display = isAuthError ? 'block' : 'none';
      }
      checkoutErrorAlert.style.display = 'flex';
      checkoutErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Load Authoritative Programs Catalogue
    async function loadProgramsCatalogue() {
      if (allPrograms.length > 0) return allPrograms;
      try {
        const res = await apiFetch('/api/programs');
        const json = await res.json();
        const progs = Array.isArray(json.data) ? json.data : (Array.isArray(json.programs) ? json.programs : []);
        if (progs.length > 0) {
          allPrograms = progs;
        }
      } catch (e) {
        console.warn('Failed to load programs catalogue:', e);
      }
      return allPrograms;
    }

    // View 1: Program Catalog Grid
    async function showProgramSelectionView() {
      if (programSelectionView) programSelectionView.style.display = 'block';
      if (bookingPreparationView) bookingPreparationView.style.display = 'none';
      if (checkoutExecutionView) checkoutExecutionView.style.display = 'none';

      await loadProgramsCatalogue();
      renderProgramsGrid();
    }

    function renderProgramsGrid() {
      if (!programsSelectionGrid) return;
      const isAr = currentLang === 'ar';

      const filtered = allPrograms.filter(p => {
        if (currentCatalogFilter === 'all') return true;
        if (currentCatalogFilter === 'umrah') return p.trip_type === 'umrah';
        if (currentCatalogFilter === 'hajj') return p.trip_type === 'hajj';
        if (currentCatalogFilter === 'available') return p.price_verified === 1;
        if (currentCatalogFilter === 'economy') return (p.category || '').toLowerCase().includes('economy');
        if (currentCatalogFilter === 'premium') return (p.category || '').toLowerCase().includes('premium') || (p.category || '').toLowerCase().includes('vip');
        return true;
      });

      if (filtered.length === 0) {
        programsSelectionGrid.style.display = 'none';
        if (catalogNoFilterMatchState) catalogNoFilterMatchState.style.display = 'block';
        return;
      }

      programsSelectionGrid.style.display = 'grid';
      if (catalogNoFilterMatchState) catalogNoFilterMatchState.style.display = 'none';

      programsSelectionGrid.innerHTML = filtered.map(p => {
        const isEligible = p.price_verified === 1;
        const title = isAr ? p.title_ar : p.title_en;
        const season = isAr ? p.season_ar : p.season_en;
        const duration = isAr ? p.duration_ar : p.duration_en;
        const hotel = isAr ? p.hotel_tier_ar : p.hotel_tier_en;
        const features = Array.isArray(p.features) ? p.features.slice(0, 2) : [];

        const badgeHtml = isEligible
          ? `<span class="select-card-badge badge-verified">${isAr ? 'متاح للسداد التجريبي' : 'Available for Test Payment'}</span>`
          : `<span class="select-card-badge badge-unverified">${isAr ? 'السعر بانتظار التأكيد الرسمي' : 'Price Awaiting Confirmation'}</span>`;

        let priceHtml = '';
        let actionBtnHtml = '';

        if (isEligible) {
          const numPrice = p.id === 'umrah_economy' ? 33000 : (p.id === 'umrah_premium' ? 62000 : 0);
          priceHtml = `
            <div class="program-card-price-block">
              <span class="program-select-price-val">${formatMoney(numPrice, 'EGP', currentLang)}</span>
              <span class="program-select-price-unit">${isAr ? 'للفرد' : 'per person'}</span>
            </div>
          `;
          actionBtnHtml = `
            <button type="button" class="btn btn-primary btn-sm btn-select-program" data-program-id="${p.id}">
              ${isAr ? 'متابعة الحجز' : 'Continue Booking'}
            </button>
          `;
        } else {
          priceHtml = `
            <div style="font-size: 0.82rem; color: var(--color-validation-text); line-height: 1.4;">
              ${isAr ? 'السداد التجريبي غير متاح لهذا البرنامج حاليًا.' : 'Simulated payment is not available for this program.'}
            </div>
          `;
          actionBtnHtml = `
            <button type="button" class="btn btn-outline btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">
              ${isAr ? 'غير متاح للسداد' : 'Not Available'}
            </button>
          `;
        }

        const featuresHtml = features.map(f => `<span class="feature-pill-tag">${localizeFeature(f, currentLang)}</span>`).join('');

        return `
          <div class="program-select-card ${!isEligible ? 'is-disabled' : ''}" 
               data-program-id="${p.id}" 
               data-eligible="${isEligible ? '1' : '0'}">
            <div>
              <div class="program-card-badge-row">
                <span class="program-category-badge">${getCategoryLabel(p.category, currentLang)}</span>
                ${badgeHtml}
              </div>
              <h3 class="program-select-title">${title}</h3>
              <div class="card-specs-list">
                <div class="card-spec-row">
                  <span class="card-spec-label">${isAr ? 'الموسم:' : 'Season:'}</span>
                  <span class="card-spec-val">${season}</span>
                </div>
                <div class="card-spec-row">
                  <span class="card-spec-label">${isAr ? 'المدة:' : 'Duration:'}</span>
                  <span class="card-spec-val">${duration}</span>
                </div>
                <div class="card-spec-row">
                  <span class="card-spec-label">${isAr ? 'مستوى الإقامة:' : 'Hotel:'}</span>
                  <span class="card-spec-val">${hotel}</span>
                </div>
              </div>
              ${featuresHtml ? `<div class="card-features-tags">${featuresHtml}</div>` : ''}
            </div>
            <div class="program-select-footer">
              ${priceHtml}
              ${actionBtnHtml}
            </div>
          </div>
        `;
      }).join('');

      // Attach Continue Booking button listeners
      programsSelectionGrid.querySelectorAll('.btn-select-program').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-program-id');
          const prog = allPrograms.find(item => item.id === pId);
          if (prog) {
            selectProgramAndOpenPreparation(prog);
          }
        });
      });
    }

    // Filter toolbar click handlers
    catalogFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catalogFilterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        currentCatalogFilter = tab.getAttribute('data-program-filter') || 'all';
        renderProgramsGrid();
      });
    });

    if (btnResetProgramsFilter) {
      btnResetProgramsFilter.addEventListener('click', () => {
        catalogFilterTabs.forEach(t => {
          const isAll = (t.getAttribute('data-program-filter') || 'all') === 'all';
          t.classList.toggle('is-active', isAll);
          t.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
        currentCatalogFilter = 'all';
        renderProgramsGrid();
      });
    }

    // View 2: Booking Preparation Flow (Section 4, 5, 6)
    async function selectProgramAndOpenPreparation(prog) {
      selectedProgram = prog;
      currentProgramId = prog.id;

      if (programSelectionView) programSelectionView.style.display = 'none';
      if (checkoutExecutionView) checkoutExecutionView.style.display = 'none';
      if (bookingPreparationView) bookingPreparationView.style.display = 'block';

      // Update URL safely without reloading
      const newUrl = `${window.location.pathname}?programId=${encodeURIComponent(prog.id)}&travelers=${selectedTravelers}&plan=${encodeURIComponent(selectedPaymentPlan)}${requestId ? '&requestId=' + encodeURIComponent(requestId) : ''}`;
      window.history.replaceState(null, '', newUrl);

      renderPreparationProgramDetails();
      await updateBookingPreparationCalculations();
    }

    function renderPreparationProgramDetails() {
      if (!selectedProgram) return;
      const isAr = currentLang === 'ar';

      if (prepProgramCategory) prepProgramCategory.textContent = getCategoryLabel(selectedProgram.category, currentLang);
      if (prepProgramTitle) prepProgramTitle.textContent = isAr ? selectedProgram.title_ar : selectedProgram.title_en;
      if (prepProgramDescription) prepProgramDescription.textContent = isAr ? selectedProgram.description_ar : selectedProgram.description_en;
      if (prepSeasonVal) prepSeasonVal.textContent = isAr ? selectedProgram.season_ar : selectedProgram.season_en;
      if (prepDurationVal) prepDurationVal.textContent = isAr ? selectedProgram.duration_ar : selectedProgram.duration_en;
      if (prepHotelVal) prepHotelVal.textContent = isAr ? selectedProgram.hotel_tier_ar : selectedProgram.hotel_tier_en;
      if (prepProximityVal) prepProximityVal.textContent = isAr ? selectedProgram.proximity_ar : selectedProgram.proximity_en;
      if (prepTransportVal) prepTransportVal.textContent = isAr ? selectedProgram.transport_ar : selectedProgram.transport_en;

      if (prepFeaturesList) {
        const features = Array.isArray(selectedProgram.features) ? selectedProgram.features : [];
        prepFeaturesList.innerHTML = features.map(f => `<li>${localizeFeature(f, currentLang)}</li>`).join('');
      }

      const numPrice = selectedProgram.id === 'umrah_economy' ? 33000 : (selectedProgram.id === 'umrah_premium' ? 62000 : 0);
      if (prepUnitPriceVal) {
        prepUnitPriceVal.textContent = formatMoney(numPrice, 'EGP', currentLang);
      }

      if (prepTravelersSelect) {
        updateTravelerSelectOptions(prepTravelersSelect, selectedTravelers, currentLang);
      }

      if (planFullRemainVal) {
        planFullRemainVal.textContent = formatMoney(0, 'EGP', currentLang);
      }
    }

    async function updateBookingPreparationCalculations() {
      if (!selectedProgram) return;
      const isAr = currentLang === 'ar';

      try {
        const res = await apiFetch(`/api/payments/preview?programId=${encodeURIComponent(selectedProgram.id)}&travelers=${selectedTravelers}&paymentOption=${selectedPaymentPlan}`);
        const result = await res.json();

        if (result.success && result.data) {
          verifiedPreviewData = result.data;
          const { packageTotal, depositAmount, remainingAmount, totalAmount } = result.data;

          if (planDepositDueVal) planDepositDueVal.textContent = formatMoney(depositAmount, 'EGP', currentLang);
          if (planDepositRemainVal) planDepositRemainVal.textContent = formatMoney(remainingAmount, 'EGP', currentLang);
          if (planFullDueVal) planFullDueVal.textContent = formatMoney(packageTotal, 'EGP', currentLang);
          if (planFullRemainVal) planFullRemainVal.textContent = formatMoney(0, 'EGP', currentLang);

          if (prepSummaryPackageTotal) prepSummaryPackageTotal.textContent = formatMoney(packageTotal, 'EGP', currentLang);
          if (prepSummaryPlanName) {
            prepSummaryPlanName.textContent = selectedPaymentPlan === 'deposit_30'
              ? (isAr ? 'سداد دفعة مقدمة (٣٠٪)' : '30% Deposit')
              : (isAr ? 'سداد كامل المبلغ (١٠٠٪)' : '100% Full Payment');
          }
          if (prepSummaryPayableNow) prepSummaryPayableNow.textContent = formatMoney(totalAmount, 'EGP', currentLang);
          if (prepSummaryRemainingBalance) prepSummaryRemainingBalance.textContent = formatMoney(remainingAmount, 'EGP', currentLang);

          if (prepSummaryRemainingRow) {
            prepSummaryRemainingRow.style.display = selectedPaymentPlan === 'deposit_30' ? 'flex' : 'none';
          }
        }
      } catch (err) {
        console.warn('Failed to calculate preparation preview:', err);
      }
    }

    // Traveler Count Change
    if (prepTravelersSelect) {
      prepTravelersSelect.addEventListener('change', async (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1 && val <= 5) {
          selectedTravelers = val;
          await updateBookingPreparationCalculations();
        }
      });
    }

    // Payment Option Card Selection
    function updatePlanCardUI(plan) {
      selectedPaymentPlan = plan;
      if (planOptionDepositCard) {
        const isDep = plan === 'deposit_30';
        planOptionDepositCard.classList.toggle('is-selected', isDep);
        planOptionDepositCard.setAttribute('aria-checked', isDep ? 'true' : 'false');
      }
      if (planOptionFullCard) {
        const isFull = plan === 'full';
        planOptionFullCard.classList.toggle('is-selected', isFull);
        planOptionFullCard.setAttribute('aria-checked', isFull ? 'true' : 'false');
      }
    }

    if (planOptionDepositCard) {
      planOptionDepositCard.addEventListener('click', async () => {
        updatePlanCardUI('deposit_30');
        await updateBookingPreparationCalculations();
      });
    }

    if (planOptionFullCard) {
      planOptionFullCard.addEventListener('click', async () => {
        updatePlanCardUI('full');
        await updateBookingPreparationCalculations();
      });
    }

    if (btnReturnToCatalog) {
      btnReturnToCatalog.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.replaceState(null, '', window.location.pathname);
        showProgramSelectionView();
      });
    }

    if (btnProceedToCheckout) {
      btnProceedToCheckout.addEventListener('click', () => {
        openCheckoutExecutionView();
      });
    }

    // View 3: Checkout Execution Flow (Section 7)
    function openCheckoutExecutionView() {
      if (!selectedProgram) return;
      const isAr = currentLang === 'ar';

      if (programSelectionView) programSelectionView.style.display = 'none';
      if (bookingPreparationView) bookingPreparationView.style.display = 'none';
      if (checkoutExecutionView) checkoutExecutionView.style.display = 'block';

      // Update URL safely
      const newUrl = `${window.location.pathname}?programId=${encodeURIComponent(selectedProgram.id)}&travelers=${selectedTravelers}&plan=${encodeURIComponent(selectedPaymentPlan)}${requestId ? '&requestId=' + encodeURIComponent(requestId) : ''}`;
      window.history.replaceState(null, '', newUrl);

      // Populate Readonly Summary Information
      if (checkoutProgramTitle) checkoutProgramTitle.textContent = isAr ? selectedProgram.title_ar : selectedProgram.title_en;
      if (checkoutProgramCategory) checkoutProgramCategory.textContent = getCategoryLabel(selectedProgram.category, currentLang);

      // Section 5: NO duplicate traveler selection in checkout. Display as confirmed text.
      if (checkoutConfirmedTravelers) {
        checkoutConfirmedTravelers.textContent = `${selectedTravelers} ${isAr ? (selectedTravelers === 1 ? 'فرد' : 'أفراد') : (selectedTravelers === 1 ? 'Traveler' : 'Travelers')}`;
      }

      if (verifiedPreviewData) {
        if (checkoutPackageTotal) checkoutPackageTotal.textContent = formatMoney(verifiedPreviewData.packageTotal, 'EGP', currentLang);
        if (checkoutSelectedPlan) {
          checkoutSelectedPlan.textContent = selectedPaymentPlan === 'deposit_30'
            ? (isAr ? 'دفعة مقدمة (٣٠٪)' : '30% Deposit')
            : (isAr ? 'سداد كامل المبلغ (١٠٠٪)' : '100% Full Payment');
        }
        if (checkoutPayableNow) checkoutPayableNow.textContent = formatMoney(verifiedPreviewData.totalAmount, 'EGP', currentLang);
        if (checkoutRemainingBalance) checkoutRemainingBalance.textContent = formatMoney(verifiedPreviewData.remainingAmount, 'EGP', currentLang);
        if (checkoutRemainingRow) {
          checkoutRemainingRow.style.display = selectedPaymentPlan === 'deposit_30' ? 'flex' : 'none';
        }
      }

      if (submitBtn) {
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText && verifiedPreviewData) {
          btnText.textContent = isAr
            ? `تأكيد وتنفيذ الدفع التجريبي (${formatMoney(verifiedPreviewData.totalAmount, 'EGP', currentLang)})`
            : `Confirm & Pay (${formatMoney(verifiedPreviewData.totalAmount, 'EGP', currentLang)})`;
        }
      }

      hideCheckoutError();
    }

    if (btnReturnToPrep) {
      btnReturnToPrep.addEventListener('click', (e) => {
        e.preventDefault();
        if (checkoutExecutionView) checkoutExecutionView.style.display = 'none';
        if (bookingPreparationView) bookingPreparationView.style.display = 'block';
      });
    }

    if (btnUnverifiedChange) {
      btnUnverifiedChange.addEventListener('click', (e) => {
        e.preventDefault();
        showProgramSelectionView();
      });
    }

    // Checkout Form Submission (Section 8: Graceful in-page alerts, no native alerts!)
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideCheckoutError();
        if (submitBtn.classList.contains('is-loading')) return;

        const isAr = currentLang === 'ar';
        const selectedScenarioRadio = document.querySelector('input[name="simScenario"]:checked');
        const scenario = selectedScenarioRadio ? selectedScenarioRadio.value : 'success';

        submitBtn.classList.add('is-loading');
        submitBtn.setAttribute('disabled', 'true');
        const btnTextEl = submitBtn.querySelector('.btn-text');
        const dict = await loadTranslations(currentLang);
        if (btnTextEl) btnTextEl.textContent = getTranslation('payments.processing_btn', dict);

        try {
          const idempotencyKey = `MQT-IDEMP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

          const initRes = await apiFetch('/api/payments/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              programId: selectedProgram ? selectedProgram.id : currentProgramId,
              travelersCount: selectedTravelers,
              paymentOption: selectedPaymentPlan,
              requestId,
              idempotencyKey
            })
          });

          const initResult = await initRes.json();

          if (initRes.status === 401) {
            showCheckoutError(
              getTranslation('payments.auth_required_title', dict),
              getTranslation('payments.auth_required_checkout_msg', dict),
              true
            );
            return;
          }

          if (!initRes.ok || !initResult.success) {
            showCheckoutError(
              isAr ? 'تعذر إتمام العملية' : 'Transaction Failed',
              initResult.error || (isAr ? 'حدث خطأ أثناء بدء عملية السداد التجريبي.' : 'Failed to initiate simulated payment.'),
              false
            );
            return;
          }

          const paymentRef = initResult.payment.reference;

          const procRes = await apiFetch(`/api/payments/${encodeURIComponent(paymentRef)}/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scenario })
          });

          const procResult = await procRes.json();
          if (!procRes.ok || !procResult.success) {
            showCheckoutError(
              isAr ? 'فشل معالجة العملية' : 'Processing Failed',
              procResult.error || (isAr ? 'فشلت معالجة المعاملة التجريبية.' : 'Failed to process simulated payment.'),
              false
            );
            return;
          }

          window.location.href = `payment-result.html?ref=${encodeURIComponent(paymentRef)}`;
        } catch (err) {
          console.error('Checkout execution error:', err);
          showCheckoutError(
            isAr ? 'خطأ في الاتصال' : 'Connection Error',
            err.message || (isAr ? 'تعذر الاتصال بالخادم. يرجى التحقق من الاتصال وإعادة المحاولة.' : 'Network connection failure.'),
            false
          );
        } finally {
          submitBtn.classList.remove('is-loading');
          submitBtn.removeAttribute('disabled');
          if (btnTextEl && verifiedPreviewData) {
            btnTextEl.textContent = isAr
              ? `تأكيد وتنفيذ الدفع التجريبي (${formatMoney(verifiedPreviewData.totalAmount, 'EGP', currentLang)})`
              : `Confirm & Pay (${formatMoney(verifiedPreviewData.totalAmount, 'EGP', currentLang)})`;
          }
        }
      });
    }

    // Initial Route Execution
    await loadProgramsCatalogue();

    if (currentProgramId) {
      const matched = allPrograms.find(p => p.id === currentProgramId);
      if (matched && matched.price_verified === 1) {
        selectedProgram = matched;
        await selectProgramAndOpenPreparation(matched);
      } else {
        showProgramSelectionView();
      }
    } else {
      showProgramSelectionView();
    }

    // Dynamic language rerender callback
    window.activePageRerender = async () => {
      dict = await loadTranslations(currentLang);
      if (bookingPreparationView && bookingPreparationView.style.display !== 'none') {
        renderPreparationProgramDetails();
        await updateBookingPreparationCalculations();
      } else if (checkoutExecutionView && checkoutExecutionView.style.display !== 'none') {
        openCheckoutExecutionView();
      } else {
        renderProgramsGrid();
      }
    };
  }

  // ========================================================
  // PAGE 2: PAYMENT RESULT & RECEIPT CONTROLLER
  // ========================================================
  async function initPaymentResultPage() {
    await checkAuthSession();

    const params = new URLSearchParams(window.location.search);
    const reference = params.get('ref');

    const loadingState = document.getElementById('resultLoadingState');
    const voucherWrap = document.getElementById('resultVoucherWrap');
    const errorState = document.getElementById('resultErrorState');

    if (!reference) {
      if (loadingState) loadingState.style.display = 'none';
      if (errorState) errorState.style.display = 'block';
      return;
    }

    try {
      const res = await apiFetch(`/api/payments/${encodeURIComponent(reference)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.payment) {
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        return;
      }

      const payment = data.payment;
      let dict = await loadTranslations(currentLang);

      const iconRing = document.getElementById('resultStatusIconRing');
      const headingEl = document.getElementById('resultStatusHeading');
      const refCodeEl = document.getElementById('receiptRefCode');
      const customerEl = document.getElementById('receiptCustomerName');
      const programEl = document.getElementById('receiptProgramTitle');
      const travelersEl = document.getElementById('receiptTravelersCount');
      const dateEl = document.getElementById('receiptDate');
      const methodEl = document.getElementById('receiptMethod');
      const totalEl = document.getElementById('receiptTotalAmount');
      const retryBtn = document.getElementById('resultRetryBtn');

      const planRowEl = document.getElementById('receiptPlanRow');
      const planNameEl = document.getElementById('receiptPlanName');
      const packageTotalRowEl = document.getElementById('receiptPackageTotalRow');
      const packageTotalValEl = document.getElementById('receiptPackageTotalVal');
      const remainingRowEl = document.getElementById('receiptRemainingRow');
      const remainingValEl = document.getElementById('receiptRemainingVal');
      const amountLabelEl = document.getElementById('receiptAmountLabel');

      function renderReceiptDetails() {
        const isAr = currentLang === 'ar';
        if (refCodeEl) refCodeEl.textContent = payment.reference;
        if (customerEl) customerEl.textContent = payment.customer_name;
        if (programEl) programEl.textContent = isAr ? payment.program_title_ar : payment.program_title_en;
        if (travelersEl) travelersEl.textContent = `${payment.travelers_count} ${isAr ? (payment.travelers_count === 1 ? 'فرد' : 'أفراد') : (payment.travelers_count === 1 ? 'Traveler' : 'Travelers')}`;
        if (dateEl) dateEl.textContent = formatDate(payment.paid_at || payment.created_at, currentLang);
        if (methodEl) methodEl.textContent = getTranslation('payments.receipt_method_card', dict);

        const isDeposit = payment.payment_option === 'deposit_30';
        if (planNameEl) {
          planNameEl.textContent = isDeposit
            ? (isAr ? 'سداد دفعة مقدمة (٣٠٪)' : '30% Deposit Payment')
            : (isAr ? 'سداد كامل المبلغ (١٠٠٪)' : '100% Full Payment');
        }
        if (packageTotalValEl) {
          packageTotalValEl.textContent = formatMoney(payment.package_total || payment.total_amount, payment.currency, currentLang);
        }
        if (remainingRowEl) {
          remainingRowEl.style.display = isDeposit ? 'flex' : 'none';
        }
        if (remainingValEl) {
          remainingValEl.textContent = formatMoney(payment.remaining_amount || 0, payment.currency, currentLang);
        }
        if (amountLabelEl) {
          amountLabelEl.textContent = isDeposit
            ? (isAr ? 'المبلغ المسدد الآن (٣٠٪):' : 'Amount Paid Now (30%):')
            : (isAr ? 'المبلغ الإجمالي المسدد:' : 'Total Amount Paid:');
        }
        if (totalEl) totalEl.textContent = formatMoney(payment.total_amount, payment.currency, currentLang);

        const statusLower = (payment.status || '').toLowerCase();

        if (iconRing) {
          iconRing.className = `receipt-status-icon-ring status-${statusLower}`;
          if (statusLower === 'paid') {
            iconRing.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            if (headingEl) headingEl.textContent = getTranslation('payments.status_paid', dict);
          } else if (statusLower === 'failed') {
            iconRing.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            if (headingEl) headingEl.textContent = getTranslation('payments.status_failed', dict);
            if (retryBtn) {
              retryBtn.style.display = 'inline-flex';
              retryBtn.href = `checkout.html?programId=${encodeURIComponent(payment.program_id)}`;
            }
          } else if (statusLower === 'cancelled') {
            iconRing.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
            if (headingEl) headingEl.textContent = getTranslation('payments.status_cancelled', dict);
            if (retryBtn) {
              retryBtn.style.display = 'inline-flex';
              retryBtn.href = `checkout.html?programId=${encodeURIComponent(payment.program_id)}`;
            }
          } else if (statusLower === 'refunded') {
            iconRing.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`;
            if (headingEl) headingEl.textContent = getTranslation('payments.status_refunded', dict);
          }
        }
      }

      renderReceiptDetails();

      if (loadingState) loadingState.style.display = 'none';
      if (voucherWrap) voucherWrap.style.display = 'block';

      window.activePageRerender = async () => {
        dict = await loadTranslations(currentLang);
        renderReceiptDetails();
      };

    } catch (err) {
      console.error('Failed to load transaction result:', err);
      if (loadingState) loadingState.style.display = 'none';
      if (errorState) errorState.style.display = 'block';
    }
  }

  // ========================================================
  // PAGE 3: CUSTOMER TRANSACTIONS CONTROLLER (SECTION 4)
  // ========================================================
  async function initTransactionsPage() {
    const filterBar = document.getElementById('transactionsFilterBar');
    const tableArea = document.getElementById('transactionsTableArea');
    const tableBody = document.getElementById('transactionsTableBody');
    const loadingState = document.getElementById('transactionsLoadingState');
    const emptyState = document.getElementById('transactionsEmptyState');
    const errorState = document.getElementById('transactionsErrorState');
    const unauthState = document.getElementById('transactionsUnauthState');
    const noFilterMatchState = document.getElementById('transactionsNoFilterMatchState');
    const retryBtn = document.getElementById('transactionsRetryBtn');
    const btnResetFilter = document.getElementById('btnResetFilter');
    const filterTabs = document.querySelectorAll('.filter-tab-btn');

    let currentFilter = 'all';
    let allTransactions = [];

    // Strictly Mutually Exclusive State Controller (Section 4)
    function setTransactionsState(stateName) {
      const s = String(stateName || '').toLowerCase();
      if (loadingState) loadingState.style.display = s === 'loading' ? 'block' : 'none';
      if (emptyState) emptyState.style.display = s === 'empty' ? 'block' : 'none';
      if (errorState) errorState.style.display = s === 'error' ? 'block' : 'none';
      if (unauthState) unauthState.style.display = s === 'unauth' ? 'block' : 'none';
      if (noFilterMatchState) noFilterMatchState.style.display = s === 'filter_no_match' ? 'block' : 'none';
      if (tableArea) tableArea.style.display = s === 'data' ? 'block' : 'none';
      if (filterBar) filterBar.style.display = (s === 'data' || s === 'filter_no_match') ? 'flex' : 'none';
    }
    window.setTransactionsState = setTransactionsState;

    const user = await checkAuthSession();
    if (!user) {
      setTransactionsState('unauth');
      return;
    }

    async function fetchTransactions() {
      setTransactionsState('loading');

      try {
        const res = await apiFetch('/api/payments/my');
        if (res.status === 401) {
          setTransactionsState('unauth');
          return;
        }
        const result = await res.json();

        if (res.ok && result.success) {
          allTransactions = result.data || [];
          if (allTransactions.length === 0) {
            setTransactionsState('empty');
          } else {
            renderFilteredTransactions();
          }
        } else {
          setTransactionsState('error');
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setTransactionsState('error');
      }
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        fetchTransactions();
      });
    }

    if (btnResetFilter) {
      btnResetFilter.addEventListener('click', () => {
        filterTabs.forEach(t => {
          const isAll = (t.dataset.filter || 'all').toLowerCase() === 'all';
          t.classList.toggle('is-active', isAll);
          t.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
        currentFilter = 'all';
        renderFilteredTransactions();
      });
    }

    async function renderFilteredTransactions() {
      if (!tableBody) return;
      const dict = await loadTranslations(currentLang);

      const filtered = allTransactions.filter(tx => {
        if (currentFilter === 'all') return true;
        return (tx.status || '').toLowerCase() === currentFilter.toLowerCase();
      });

      if (!filtered.length) {
        setTransactionsState('filter_no_match');
        return;
      }

      setTransactionsState('data');

      tableBody.innerHTML = filtered.map(tx => {
        const programTitle = currentLang === 'ar' ? tx.program_title_ar : tx.program_title_en;
        const amountDisplay = formatMoney(tx.total_amount, tx.currency, currentLang);
        const dateDisplay = formatDate(tx.paid_at || tx.created_at, currentLang);
        const statusPill = renderStatusPill(tx.status, dict);
        const viewReceiptText = getTranslation('payments.action_view_receipt', dict);

        return `
          <tr>
            <td data-label="${getTranslation('payments.table_ref', dict)}">
              <span class="ref-code-display">${tx.reference}</span>
            </td>
            <td data-label="${getTranslation('payments.table_program', dict)}">
              <strong>${programTitle}</strong>
            </td>
            <td data-label="${getTranslation('payments.table_travelers', dict)}">${tx.travelers_count}</td>
            <td data-label="${getTranslation('payments.table_amount', dict)}">${amountDisplay}</td>
            <td data-label="${getTranslation('payments.table_date', dict)}">${dateDisplay}</td>
            <td data-label="${getTranslation('payments.table_status', dict)}">${statusPill}</td>
            <td data-label="${getTranslation('payments.table_actions', dict)}" style="text-align: end;">
              <a href="payment-result.html?ref=${encodeURIComponent(tx.reference)}" class="btn btn-outline btn-sm">
                ${viewReceiptText}
              </a>
            </td>
          </tr>
        `;
      }).join('');
    }

    window.activePageRerender = renderFilteredTransactions;

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        currentFilter = (tab.dataset.filter || 'all').toLowerCase();
        renderFilteredTransactions();
      });
    });

    await fetchTransactions();
  }

  // ========================================================
  // PAGE 4: ADMINISTRATOR TRANSACTIONS CONTROLLER
  // ========================================================
  async function initAdminTransactionsPage() {
    const user = await checkAuthSession();
    if (!user) return;

    const unauthorizedBanner = document.getElementById('adminUnauthorizedBanner');
    const adminMainContent = document.getElementById('adminMainContent');
    const tableBody = document.getElementById('adminTableBody');
    const searchInput = document.getElementById('adminSearchInput');
    const filterTabs = document.querySelectorAll('.admin-filter-tab');
    const refundModal = document.getElementById('adminRefundModal');
    const inspectModal = document.getElementById('adminInspectModal');

    // Strict Authorization Guard: Admin role required
    if (user.role !== 'admin') {
      if (unauthorizedBanner) unauthorizedBanner.style.display = 'block';
      if (adminMainContent) adminMainContent.style.display = 'none';
      return;
    }

    if (unauthorizedBanner) unauthorizedBanner.style.display = 'none';
    if (adminMainContent) adminMainContent.style.display = 'block';

    let currentFilter = 'all';
    let adminTransactions = [];
    let selectedPaymentForRefund = null;

    async function fetchAdminTransactions(query = '') {
      try {
        const res = await apiFetch(`/api/payments/admin?${(currentFilter !== 'all' ? `status=${encodeURIComponent(currentFilter)}&` : '')}${query ? `search=${encodeURIComponent(query)}&` : ''}`);
        const result = await res.json();
        if (res.ok && result.success) {
          adminTransactions = result.data || [];
          renderAdminTable();
        }
      } catch (err) {
        console.error('Failed to fetch admin transactions:', err);
      }
    }

    async function renderAdminTable() {
      if (!tableBody) return;
      const dict = await loadTranslations(currentLang);

      if (!adminTransactions.length) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 36px 16px; color: var(--color-text-muted);">
              ${getTranslation('payments.empty_transactions_title', dict)}
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = adminTransactions.map(tx => {
        const programTitle = currentLang === 'ar' ? tx.program_title_ar : tx.program_title_en;
        const amountDisplay = formatMoney(tx.total_amount, tx.currency, currentLang);
        const dateDisplay = formatDate(tx.paid_at || tx.created_at, currentLang);
        const statusPill = renderStatusPill(tx.status, dict);
        const isEligibleForRefund = tx.status === 'Paid';
        const inspectText = getTranslation('payments.action_inspect', dict);
        const refundText = getTranslation('payments.action_refund', dict);

        return `
          <tr>
            <td data-label="${getTranslation('payments.table_ref', dict)}">
              <span class="ref-code-display">${tx.reference}</span>
            </td>
            <td data-label="${getTranslation('request_modal.customer_label', dict)}">
              <strong>${tx.customer_name}</strong>
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">${tx.customer_phone}</div>
            </td>
            <td data-label="${getTranslation('payments.table_program', dict)}">${programTitle}</td>
            <td data-label="${getTranslation('payments.table_amount', dict)}">${amountDisplay}</td>
            <td data-label="${getTranslation('payments.table_date', dict)}">${dateDisplay}</td>
            <td data-label="${getTranslation('payments.table_status', dict)}">${statusPill}</td>
            <td data-label="${getTranslation('payments.table_actions', dict)}">
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn btn-outline btn-sm btn-inspect-tx" data-ref="${tx.reference}">
                  ${inspectText}
                </button>
                ${isEligibleForRefund ? `
                  <button type="button" class="btn-refund-action btn-sm btn-open-refund" data-ref="${tx.reference}">
                    ${refundText}
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');

      document.querySelectorAll('.btn-inspect-tx').forEach(btn => {
        btn.addEventListener('click', () => {
          const ref = btn.dataset.ref;
          const tx = adminTransactions.find(t => t.reference === ref);
          if (tx) openInspectModal(tx, dict);
        });
      });

      document.querySelectorAll('.btn-open-refund').forEach(btn => {
        btn.addEventListener('click', () => {
          const ref = btn.dataset.ref;
          const tx = adminTransactions.find(t => t.reference === ref);
          if (tx) openRefundModal(tx, dict);
        });
      });
    }

    function openInspectModal(tx, dict) {
      if (!inspectModal) return;
      document.getElementById('inspectRef').textContent = tx.reference;
      document.getElementById('inspectCustomer').textContent = `${tx.customer_name} (${tx.customer_phone})`;
      document.getElementById('inspectProgram').textContent = currentLang === 'ar' ? tx.program_title_ar : tx.program_title_en;
      document.getElementById('inspectAmount').textContent = formatMoney(tx.total_amount, tx.currency, currentLang);
      document.getElementById('inspectStatus').innerHTML = renderStatusPill(tx.status, dict);

      const auditBox = document.getElementById('inspectAuditEvents');
      if (auditBox) {
        const events = tx.audit_log || [];
        auditBox.innerHTML = events.map(ev => `
          <div class="audit-event-card">
            <div class="audit-event-header">
              <span>${
                (function(act, actDict) {
                  if (act === 'INITIATED') return getTranslation('payments.audit_initiated', actDict);
                  if (act === 'PROCESSED') return getTranslation('payments.audit_processed', actDict);
                  if (act === 'REFUNDED') return getTranslation('payments.audit_refunded', actDict);
                  return act;
                })(ev.action, dict)
              } — ${
                (function(actr, actrDict) {
                  if (actr === 'System') return getTranslation('payments.actor_system', actrDict);
                  if (actr === 'customer') return getTranslation('payments.actor_customer', actrDict);
                  if (actr === 'admin') return getTranslation('payments.actor_admin', actrDict);
                  return actr;
                })(ev.actor, dict)
              }</span>
              <span class="audit-event-time">${formatDate(ev.timestamp, currentLang)}</span>
            </div>
            ${ev.reason ? `<div style="font-size: 0.85rem; margin-top: 4px; color: var(--color-text);"><strong>${getTranslation('payments.refund_reason_display', dict)}</strong> ${ev.reason}</div>` : ''}
          </div>
        `).join('');
      }

      inspectModal.classList.add('is-active');
    }

    function openRefundModal(tx, dict) {
      if (!refundModal) return;
      selectedPaymentForRefund = tx;
      document.getElementById('refundRef').textContent = tx.reference;
      document.getElementById('refundCustomer').textContent = tx.customer_name;
      document.getElementById('refundProgram').textContent = currentLang === 'ar' ? tx.program_title_ar : tx.program_title_en;
      document.getElementById('refundAmount').textContent = formatMoney(tx.total_amount, tx.currency, currentLang);
      document.getElementById('refundReasonInput').value = '';

      refundModal.classList.add('is-active');
    }

    document.querySelectorAll('[data-close-admin-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (refundModal) refundModal.classList.remove('is-active');
        if (inspectModal) inspectModal.classList.remove('is-active');
      });
    });

    // Submit Mock Refund
    const submitRefundBtn = document.getElementById('submitRefundBtn');
    if (submitRefundBtn) {
      submitRefundBtn.addEventListener('click', async () => {
        if (!selectedPaymentForRefund) return;
        const reasonInput = document.getElementById('refundReasonInput');
        const reason = reasonInput ? reasonInput.value.trim() : '';

        if (!reason || reason.length < 5) {
          alert(currentLang === 'ar' ? 'من فضلك اكتب سبباً واضحاً للاسترداد (5 أحرف على الأقل).' : 'Please provide a clear refund reason (minimum 5 characters).');
          return;
        }

        submitRefundBtn.setAttribute('disabled', 'true');
        const dict = await loadTranslations(currentLang);
        submitRefundBtn.textContent = getTranslation('payments.refund_submitting_btn', dict);

        try {
          const res = await apiFetch(`/api/payments/${encodeURIComponent(selectedPaymentForRefund.reference)}/refund`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
          });

          const result = await res.json();
          if (!res.ok || !result.success) {
            throw new Error(result.error || 'Failed to execute mock refund');
          }

          if (refundModal) refundModal.classList.remove('is-active');
          alert(currentLang === 'ar' ? 'تم تسجيل الاسترداد التجريبي بنجاح.' : 'Mock refund registered successfully.');
          await fetchAdminTransactions(searchInput ? searchInput.value.trim() : '');
        } catch (err) {
          alert(err.message || 'Refund processing error');
        } finally {
          submitRefundBtn.removeAttribute('disabled');
          submitRefundBtn.textContent = getTranslation('payments.refund_confirm_btn', dict);
        }
      });
    }

    // Filter Buttons
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        currentFilter = tab.dataset.filter || 'all';
        fetchAdminTransactions(searchInput ? searchInput.value.trim() : '');
      });
    });

    // Search Input
    let searchDebounce = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          fetchAdminTransactions(e.target.value.trim());
        }, 300);
      });
    }

    window.activePageRerender = renderAdminTable;
    await fetchAdminTransactions();
  }

  // ========================================================
  // PAGE 5: MY ACCOUNT PROFILE CONTROLLER
  // ========================================================
  async function initAccountPage() {
    currentDict = await loadTranslations(currentLang);

    const accountGrid = document.getElementById('accountGrid');
    const accountUnauthCard = document.getElementById('accountUnauthCard');
    const accountAlert = document.getElementById('accountAlert');
    const accountAlertTitle = document.getElementById('accountAlertTitle');
    const accountAlertMessage = document.getElementById('accountAlertMessage');
    const accountAlertIcon = document.getElementById('accountAlertIcon');
    const accountAlertClose = document.getElementById('accountAlertClose');

    const accountAvatarLetter = document.getElementById('accountAvatarLetter');
    const accountCustomerName = document.getElementById('accountCustomerName');
    const accountCreatedAtDisplay = document.getElementById('accountCreatedAtDisplay');
    const accountGovernorateDisplay = document.getElementById('accountGovernorateDisplay');

    const accountContactForm = document.getElementById('accountContactForm');
    const phoneInput = document.getElementById('accountPhoneInput');
    const phoneError = document.getElementById('accountPhoneError');
    const emailInput = document.getElementById('accountEmailInput');
    const emailError = document.getElementById('accountEmailError');
    const saveBtn = document.getElementById('accountSaveBtn');
    const saveSpinner = document.getElementById('accountSaveSpinner');
    const saveBtnText = document.getElementById('accountSaveBtnText');
    const cancelBtn = document.getElementById('accountCancelBtn');

    const GOVERNORATES = {
      cairo: { ar: 'القاهرة', en: 'Cairo' },
      giza: { ar: 'الجيزة', en: 'Giza' },
      alexandria: { ar: 'الإسكندرية', en: 'Alexandria' },
      dakahlia: { ar: 'الدقهلية', en: 'Dakahlia' },
      red_sea: { ar: 'البحر الأحمر', en: 'Red Sea' },
      beheira: { ar: 'البحيرة', en: 'Beheira' },
      fayoum: { ar: 'الفيوم', en: 'Faiyum' },
      gharbia: { ar: 'الغربية', en: 'Gharbia' },
      ismailia: { ar: 'الإسماعيلية', en: 'Ismailia' },
      menofia: { ar: 'المنوفية', en: 'Menofia' },
      minya: { ar: 'المنيا', en: 'Minya' },
      qalyubia: { ar: 'القليوبية', en: 'Qalyubia' },
      new_valley: { ar: 'الوادي الجديد', en: 'New Valley' },
      suez: { ar: 'السويس', en: 'Suez' },
      aswan: { ar: 'أسوان', en: 'Aswan' },
      assiut: { ar: 'أسيوط', en: 'Asyut' },
      beni_suef: { ar: 'بني سويف', en: 'Beni Suef' },
      port_said: { ar: 'بورسعيد', en: 'Port Said' },
      damietta: { ar: 'دمياط', en: 'Damietta' },
      sharkia: { ar: 'الشرقية', en: 'Sharkia' },
      south_sinai: { ar: 'جنوب سيناء', en: 'South Sinai' },
      kafr_el_sheikh: { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
      matrouh: { ar: 'مطروح', en: 'Matrouh' },
      luxor: { ar: 'الأقصر', en: 'Luxor' },
      qena: { ar: 'قنا', en: 'Qena' },
      north_sinai: { ar: 'شمال سيناء', en: 'North Sinai' },
      sohag: { ar: 'سوهاج', en: 'Sohag' }
    };

    let savedPhone = '';
    let savedEmail = '';

    function showAlert(type, titleKey, msgKey, rawMessage) {
      if (!accountAlert) return;
      accountAlert.classList.remove('is-success', 'is-error');
      accountAlert.classList.add(type === 'success' ? 'is-success' : 'is-error');
      
      const title = titleKey ? getTranslation(titleKey, currentDict) : '';
      const msg = rawMessage || (msgKey ? getTranslation(msgKey, currentDict) : '');

      if (accountAlertTitle) accountAlertTitle.textContent = title;
      if (accountAlertMessage) accountAlertMessage.textContent = msg;

      if (accountAlertIcon) {
        if (type === 'success') {
          accountAlertIcon.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else {
          accountAlertIcon.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        }
      }

      accountAlert.style.display = 'flex';
      accountAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideAlert() {
      if (accountAlert) accountAlert.style.display = 'none';
    }

    if (accountAlertClose) {
      accountAlertClose.addEventListener('click', hideAlert);
    }

    function clearErrors() {
      if (phoneInput) phoneInput.classList.remove('has-error');
      if (phoneError) {
        phoneError.style.display = 'none';
        phoneError.textContent = '';
      }
      if (emailInput) emailInput.classList.remove('has-error');
      if (emailError) {
        emailError.style.display = 'none';
        emailError.textContent = '';
      }
    }

    function showFieldError(inputEl, errorEl, msgKey, rawMsg) {
      if (inputEl) inputEl.classList.add('has-error');
      if (errorEl) {
        errorEl.textContent = rawMsg || getTranslation(msgKey, currentDict);
        errorEl.style.display = 'block';
      }
    }

    function renderProfileData(user) {
      if (!user) return;
      const initial = getClientInitial(user.name, currentLang);
      if (accountAvatarLetter) accountAvatarLetter.textContent = initial;

      if (accountCustomerName) accountCustomerName.textContent = user.name || '—';

      if (accountCreatedAtDisplay) {
        accountCreatedAtDisplay.textContent = formatDate(user.created_at, currentLang);
      }

      if (accountGovernorateDisplay) {
        const govKey = (user.governorate || '').toLowerCase();
        if (GOVERNORATES[govKey]) {
          accountGovernorateDisplay.textContent = GOVERNORATES[govKey][currentLang] || GOVERNORATES[govKey].ar;
        } else {
          accountGovernorateDisplay.textContent = user.governorate || (currentLang === 'ar' ? 'القاهرة' : 'Cairo');
        }
      }

      savedPhone = user.phone || '';
      savedEmail = user.email || '';

      if (phoneInput) phoneInput.value = savedPhone;
      if (emailInput) emailInput.value = savedEmail;
    }

    // Auth verification
    const user = await checkAuthSession();
    if (!user) {
      if (accountGrid) accountGrid.style.display = 'none';
      if (accountUnauthCard) accountUnauthCard.style.display = 'block';
      return;
    }

    if (accountUnauthCard) accountUnauthCard.style.display = 'none';
    if (accountGrid) accountGrid.style.display = 'grid';

    // Fetch authoritative user data from server
    try {
      const res = await apiFetch('/api/account');
      if (res.status === 401) {
        if (accountGrid) accountGrid.style.display = 'none';
        if (accountUnauthCard) accountUnauthCard.style.display = 'block';
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        currentUser = data.user;
        localStorage.setItem('miqat_user', JSON.stringify(currentUser));
        renderProfileData(currentUser);
      } else {
        renderProfileData(user);
      }
    } catch (err) {
      console.warn('Could not fetch /api/account, fallback to session data:', err);
      renderProfileData(user);
    }

    // Cancel Button: restores saved phone & email, clears errors and alerts
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        clearErrors();
        hideAlert();
        if (phoneInput) phoneInput.value = savedPhone;
        if (emailInput) emailInput.value = savedEmail;
      });
    }

    // Contact Form Submit: updates permitted fields only
    if (accountContactForm) {
      accountContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        hideAlert();

        const rawPhone = phoneInput ? phoneInput.value.trim() : '';
        const rawEmail = emailInput ? emailInput.value.trim() : '';

        // Validation
        let hasError = false;

        if (!rawPhone) {
          showFieldError(phoneInput, phoneError, 'account.val_phone_empty');
          hasError = true;
        } else {
          const cleanPhone = normalizeNumerals(rawPhone).replace(/[^\d+]/g, '');
          const normalized = cleanPhone.startsWith('+20') ? '0' + cleanPhone.substring(3) : cleanPhone;
          const egRegex = /^01[0125][0-9]{8}$/;
          if (!egRegex.test(normalized)) {
            showFieldError(phoneInput, phoneError, 'account.val_phone_invalid');
            hasError = true;
          }
        }

        if (rawEmail) {
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
          if (!emailRegex.test(rawEmail)) {
            showFieldError(emailInput, emailError, 'account.val_email_invalid');
            hasError = true;
          }
        }

        if (hasError) return;

        // Clean & normalize values
        const cleanPhone = normalizeNumerals(rawPhone).replace(/[^\d+]/g, '');
        const normalizedPhone = cleanPhone.startsWith('+20') ? '0' + cleanPhone.substring(3) : cleanPhone;
        const normalizedEmail = rawEmail ? rawEmail.toLowerCase() : '';

        // Check if anything actually changed
        const currentSavedPhone = (savedPhone || '').trim();
        const currentSavedEmail = (savedEmail || '').toLowerCase().trim();
        if (normalizedPhone === currentSavedPhone && normalizedEmail === currentSavedEmail) {
          showAlert('success', 'account.success_title', 'account.no_changes_msg');
          return;
        }

        // Set loading state
        if (saveBtn) saveBtn.setAttribute('disabled', 'true');
        if (cancelBtn) cancelBtn.setAttribute('disabled', 'true');
        if (saveSpinner) saveSpinner.style.display = 'inline-block';
        if (saveBtnText) saveBtnText.textContent = getTranslation('account.saving_btn', currentDict);

        try {
          const res = await apiFetch('/api/account', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: normalizedPhone,
              email: rawEmail || null
            })
          });

          const result = await res.json();

          if (res.ok && result.success) {
            currentUser = result.user;
            localStorage.setItem('miqat_user', JSON.stringify(result.user));
            renderProfileData(result.user);
            renderNavbarUser(result.user);
            showAlert('success', 'account.success_title', 'account.success_msg');
          } else {
            // Handle specific conflict / validation codes
            if (result.error === 'PHONE_EXISTS') {
              showFieldError(phoneInput, phoneError, 'account.err_phone_exists');
            } else if (result.error === 'EMAIL_EXISTS') {
              showFieldError(emailInput, emailError, 'account.err_email_exists');
            } else if (result.error === 'NAME_IMMUTABLE') {
              showAlert('error', null, 'account.err_name_immutable');
            } else {
              showAlert('error', null, null, result.message || getTranslation('account.err_update_failed', currentDict));
            }
          }
        } catch (err) {
          console.error('Account update error:', err);
          showAlert('error', null, 'account.err_update_failed');
        } finally {
          if (saveBtn) saveBtn.removeAttribute('disabled');
          if (cancelBtn) cancelBtn.removeAttribute('disabled');
          if (saveSpinner) saveSpinner.style.display = 'none';
          if (saveBtnText) saveBtnText.textContent = getTranslation('account.save_btn', currentDict);
        }
      });
    }

    // Dynamic rerender hook when language switches
    window.activePageRerender = () => {
      if (currentUser) {
        renderProfileData(currentUser);
      }
    };
  }

  // ========================================================
  // ROUTER & INITIALIZATION
  // ========================================================
  document.addEventListener('DOMContentLoaded', async () => {
    setupGlobalControls();
    applyTheme(currentTheme);
    await applyTranslations(currentLang);

    const pageId = document.body.dataset.pageId;

    if (pageId === 'checkout') {
      await initCheckoutPage();
    } else if (pageId === 'transactions') {
      await initTransactionsPage();
    } else if (pageId === 'payment-result') {
      await initPaymentResultPage();
    } else if (pageId === 'admin-transactions') {
      await initAdminTransactionsPage();
    } else if (pageId === 'account') {
      await initAccountPage();
    }
  });

})();
