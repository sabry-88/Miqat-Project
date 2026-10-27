/**
 * MIQAT JOURNEYHUB — CUSTOMER PROGRAMS & REQUEST WORKFLOW ENGINE
 * 
 * Features:
 * 1. Bilingual Localization (AR RTL / EN LTR) synced with platform storage
 * 2. Light / Dark theme engine with WCAG AAA contrast
 * 3. Verified Programs Catalog loader with dynamic filtering & live search
 * 4. Customer Authentication state detection & session binding
 * 5. Request Details submission workflow with backend SQLite persistence
 * 6. Official WhatsApp (+201203340116) universal link dispatch & audit tracking
 * 7. Accessible modals & responsive keyboard navigation
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';

  const EGYPTIAN_GOVERNORATES = [
    { id: 'cairo', ar: 'القاهرة', en: 'Cairo' },
    { id: 'giza', ar: 'الجيزة', en: 'Giza' },
    { id: 'alexandria', ar: 'الإسكندرية', en: 'Alexandria' },
    { id: 'dakahlia', ar: 'الدقهلية', en: 'Dakahlia' },
    { id: 'red_sea', ar: 'البحر الأحمر', en: 'Red Sea' },
    { id: 'beheira', ar: 'البحيرة', en: 'Beheira' },
    { id: 'fayoum', ar: 'الفيوم', en: 'Faiyum' },
    { id: 'gharbia', ar: 'الغربية', en: 'Gharbia' },
    { id: 'ismailia', ar: 'الإسماعيلية', en: 'Ismailia' },
    { id: 'menofia', ar: 'المنوفية', en: 'Menofia' },
    { id: 'minya', ar: 'المنيا', en: 'Minya' },
    { id: 'qalyubia', ar: 'القليوبية', en: 'Qalyubia' },
    { id: 'new_valley', ar: 'الوادي الجديد', en: 'New Valley' },
    { id: 'suez', ar: 'السويس', en: 'Suez' },
    { id: 'aswan', ar: 'أسوان', en: 'Aswan' },
    { id: 'asyut', ar: 'أسيوط', en: 'Asyut' },
    { id: 'beni_suef', ar: 'بني سويف', en: 'Beni Suef' },
    { id: 'port_said', ar: 'بورسعيد', en: 'Port Said' },
    { id: 'damietta', ar: 'دمياط', en: 'Damietta' },
    { id: 'sharkia', ar: 'الشرقية', en: 'Sharqia' },
    { id: 'south_sinai', ar: 'جنوب سيناء', en: 'South Sinai' },
    { id: 'kafr_el_sheikh', ar: 'كفر الشيخ', en: 'Kafr El-Sheikh' },
    { id: 'matrouh', ar: 'مطروح', en: 'Matruh' },
    { id: 'luxor', ar: 'الأقصر', en: 'Luxor' },
    { id: 'qena', ar: 'قنا', en: 'Qena' },
    { id: 'north_sinai', ar: 'شمال سيناء', en: 'North Sinai' },
    { id: 'sohag', ar: 'سوهاج', en: 'Sohag' }
  ];

  // --- State ---
  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let translations = { ar: null, en: null };
  let allPrograms = [];
  let currentUser = null;
  let activeTripFilter = 'all';
  let activeCatFilter = 'all';
  let searchQuery = '';
  let currentRequestId = null;
  let isSubmittingRequest = false;

  // --- DOM Elements ---
  const html = document.documentElement;
  const langToggleBtn = document.getElementById('langToggleBtn');
  const mobileLangToggleBtn = document.getElementById('mobileLangToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.getElementById('mobileNavClose');

  // Auth Elements
  const headerAuthArea = document.getElementById('headerAuthArea');
  const headerLoginBtn = document.getElementById('headerLoginBtn');
  const headerRegisterBtn = document.getElementById('headerRegisterBtn');
  const headerUserPill = document.getElementById('headerUserPill');
  const headerUserName = document.getElementById('headerUserName');
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');

  // Catalog Elements
  const programsGrid = document.getElementById('programsGrid');
  const resultsCountText = document.getElementById('resultsCountText');
  const catalogEmptyState = document.getElementById('catalogEmptyState');
  const programSearchInput = document.getElementById('programSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const tripTabs = document.querySelectorAll('[data-trip-filter]');
  const catChips = document.querySelectorAll('[data-cat-filter]');

  // Modals
  const requestDetailsModal = document.getElementById('requestDetailsModal');
  const requestFormView = document.getElementById('requestFormView');
  const requestSuccessView = document.getElementById('requestSuccessView');
  const requestModalCloseBtn = document.getElementById('requestModalCloseBtn');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const requestModalProgramBadge = document.getElementById('requestModalProgramBadge');
  const modalLoggedInNotice = document.getElementById('modalLoggedInNotice');
  const modalCustomerNameDisplay = document.getElementById('modalCustomerNameDisplay');
  const modalCustomerPhoneDisplay = document.getElementById('modalCustomerPhoneDisplay');
  const modalGuestFields = document.getElementById('modalGuestFields');
  const requestDetailsForm = document.getElementById('requestDetailsForm');
  const requestProgramId = document.getElementById('requestProgramId');
  const reqCustomerName = document.getElementById('reqCustomerName');
  const reqCustomerPhone = document.getElementById('reqCustomerPhone');
  const reqCustomerGovernorate = document.getElementById('reqCustomerGovernorate');
  const reqCustomerEmail = document.getElementById('reqCustomerEmail');
  const reqCustomerNotes = document.getElementById('reqCustomerNotes');
  const requestSubmitBtn = document.getElementById('requestSubmitBtn');
  const requestStatusAlert = document.getElementById('requestStatusAlert');
  const successRequestId = document.getElementById('successRequestId');
  const openWhatsAppBtn = document.getElementById('openWhatsAppBtn');

  // Future Scope Modal
  const futureScopeModal = document.getElementById('futureScopeModal');
  const futureItems = document.querySelectorAll('[data-future-item]');
  const closeFutureModalBtns = document.querySelectorAll('[data-close-future-modal]');

  /**
   * Helper: Normalize Arabic-Indic Numerals
   */
  function normalizeNumerals(str) {
    if (!str) return '';
    const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[٠-٩]/g, (match) => arabicIndic.indexOf(match));
  }

  /**
   * Translations Loader
   */
  async function loadTranslations(lang) {
    if (translations[lang]) return translations[lang];
    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      translations[lang] = data;
      return data;
    } catch (err) {
      console.warn(`Could not fetch ./locales/${lang}.json directly.`, err);
      return {};
    }
  }

  function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) return null;
    return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  async function applyTranslations(lang) {
    const dict = await loadTranslations(lang);
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const metaTitle = getNestedValue(dict, 'programs_page.meta_title') || 'ميقات — برامج الحج والعمرة';
    document.title = metaTitle;

    // Data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(dict, key);
      if (val !== null) el.textContent = val;
    });

    // Data-i18n-attr elements
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach((mapping) => {
        const [attr, key] = mapping.split(':').map((s) => s.trim());
        if (attr && key) {
          const val = getNestedValue(dict, key);
          if (val !== null) el.setAttribute(attr, val);
        }
      });
    });

    // Toggler button accessibility
    const nextLangText = lang === 'ar' ? 'EN' : 'عربي';
    const nextLangAria = lang === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic';

    [langToggleBtn, mobileLangToggleBtn].forEach((btn) => {
      if (!btn) return;
      const label = btn.querySelector('.lang-label');
      if (label) label.textContent = nextLangText;
      btn.setAttribute('aria-label', nextLangAria);
      btn.setAttribute('title', nextLangAria);
    });

    // Populate governorates dropdown
    populateGovernoratesSelect(lang);

    // Refresh active theme aria labels
    updateThemeAriaLabels();

    // Re-render program cards in current language
    renderProgramCards();
  }

  function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem(STORAGE_LANG, currentLang);
    applyTranslations(currentLang);
  }

  /**
   * Theme Engine
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
      if (!btn) return;
      btn.setAttribute('aria-label', ariaText);
      btn.setAttribute('title', ariaText);
      const moon = btn.querySelector('.icon-moon');
      const sun = btn.querySelector('.icon-sun');
      if (moon && sun) {
        moon.style.display = isDark ? 'none' : 'block';
        sun.style.display = isDark ? 'block' : 'none';
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
   * Governorates Select Population
   */
  function populateGovernoratesSelect(lang) {
    if (!reqCustomerGovernorate) return;
    const currentVal = reqCustomerGovernorate.value;
    const placeholder = lang === 'ar' ? 'اختار محافظتك' : 'Select your governorate';

    let htmlOptions = `<option value="" disabled ${!currentVal ? 'selected' : ''}>${placeholder}</option>`;
    EGYPTIAN_GOVERNORATES.forEach((gov) => {
      const isSelected = currentVal === gov.id ? 'selected' : '';
      const name = lang === 'ar' ? gov.ar : gov.en;
      htmlOptions += `<option value="${gov.id}" ${isSelected}>${name}</option>`;
    });

    reqCustomerGovernorate.innerHTML = htmlOptions;
  }

  /**
   * Check Authentication Status via Backend Session API
   * Protects Customer page against unauthenticated access
   */
  async function checkAuthSession() {
    let authenticatedUser = null;

    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          authenticatedUser = data.user;
          try {
            localStorage.setItem('miqat_user', JSON.stringify(authenticatedUser));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Auth session check error:', err);
    }

    // Secondary fallback: local cache
    if (!authenticatedUser) {
      try {
        const cached = localStorage.getItem('miqat_user');
        if (cached) authenticatedUser = JSON.parse(cached);
      } catch (e) {}
    }

    if (!authenticatedUser) {
      // Unauthenticated visitor: route to existing Sign In flow with preserved destination
      currentUser = null;
      try {
        localStorage.removeItem('miqat_user');
      } catch (e) {}

      const currentPath = window.location.pathname.split('/').pop() || 'programs.html';
      const search = window.location.search || '';
      const redirectTarget = encodeURIComponent(currentPath + search);
      window.location.replace(`login.html?redirect=${redirectTarget}`);
      return false;
    }

    currentUser = authenticatedUser;
    renderAuthUI(currentUser);
    return true;
  }

  function renderAuthUI(user) {
    if (user) {
      if (headerLoginBtn) headerLoginBtn.style.display = 'none';
      if (headerRegisterBtn) headerRegisterBtn.style.display = 'none';
      if (headerUserPill) {
        headerUserPill.style.display = 'inline-flex';
        if (headerUserName) headerUserName.textContent = user.name;
      }
      if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
      if (mobileRegisterBtn) {
        mobileRegisterBtn.textContent = user.name;
        mobileRegisterBtn.href = '#my-account';
      }
    } else {
      if (headerLoginBtn) headerLoginBtn.style.display = '';
      if (headerRegisterBtn) headerRegisterBtn.style.display = '';
      if (headerUserPill) headerUserPill.style.display = 'none';
      if (mobileLoginBtn) mobileLoginBtn.style.display = '';
      if (mobileRegisterBtn) {
        mobileRegisterBtn.textContent = currentLang === 'ar' ? 'إنشاء حساب' : 'Create Account';
        mobileRegisterBtn.href = 'register-choice.html';
      }
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    currentUser = null;
    try {
      localStorage.removeItem('miqat_user');
    } catch (e) {}
    window.location.replace('index.html');
  }

  /**
   * Fetch Verified Programs Catalog from Backend API
   */
  async function fetchPrograms() {
    try {
      const res = await fetch('/api/programs');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      allPrograms = json.data || [];
      renderProgramCards();
    } catch (err) {
      console.error('Failed to load programs from API:', err);
      if (resultsCountText) {
        resultsCountText.textContent = currentLang === 'ar'
          ? 'تعذر تحميل البرامج حالياً. يرجى التأكد من تشغيل الخادم وتحديث الصفحة.'
          : 'Unable to load programs at this time. Please ensure the server is active and refresh.';
      }
    }
  }

  /**
   * Filter Programs Logic
   */
  function getFilteredPrograms() {
    return allPrograms.filter((p) => {
      // 1. Trip filter (all, umrah, hajj)
      if (activeTripFilter !== 'all' && p.trip_type !== activeTripFilter) {
        return false;
      }

      // 2. Category filter
      if (activeCatFilter !== 'all' && p.category !== activeCatFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const titleAr = (p.title_ar || '').toLowerCase();
        const titleEn = (p.title_en || '').toLowerCase();
        const descAr = (p.description_ar || '').toLowerCase();
        const descEn = (p.description_en || '').toLowerCase();
        const seasonAr = (p.season_ar || '').toLowerCase();
        const seasonEn = (p.season_en || '').toLowerCase();
        const hotelAr = (p.hotel_tier_ar || '').toLowerCase();
        const proxAr = (p.proximity_ar || '').toLowerCase();

        const match =
          titleAr.includes(q) ||
          titleEn.includes(q) ||
          descAr.includes(q) ||
          descEn.includes(q) ||
          seasonAr.includes(q) ||
          seasonEn.includes(q) ||
          hotelAr.includes(q) ||
          proxAr.includes(q);

        if (!match) return false;
      }

      return true;
    });
  }

  /**
   * Render Program Cards with Rich Visual Hierarchy
   */
  function renderProgramCards() {
    if (!programsGrid) return;

    const filtered = getFilteredPrograms();
    const isAr = currentLang === 'ar';

    // Update Results Count
    if (resultsCountText) {
      if (isAr) {
        resultsCountText.textContent = `عرض ${filtered.length} من برامج الحج والعمرة المعتمدة`;
      } else {
        resultsCountText.textContent = `Showing ${filtered.length} certified Hajj & Umrah programs`;
      }
    }

    // Toggle Empty State
    if (filtered.length === 0) {
      programsGrid.style.display = 'none';
      if (catalogEmptyState) catalogEmptyState.style.display = 'block';
      return;
    }

    programsGrid.style.display = 'grid';
    if (catalogEmptyState) catalogEmptyState.style.display = 'none';

    // Generate Cards HTML
    const cardsHtml = filtered.map((p) => {
      const title = isAr ? p.title_ar : p.title_en;
      const season = isAr ? p.season_ar : p.season_en;
      const duration = isAr ? p.duration_ar : p.duration_en;
      const hotelTier = isAr ? p.hotel_tier_ar : p.hotel_tier_en;
      const proximity = isAr ? p.proximity_ar : p.proximity_en;
      const transport = isAr ? p.transport_ar : p.transport_en;
      const priceText = isAr ? p.price_indicative_ar : p.price_indicative_en;
      const badge = isAr ? (p.badge_ar || 'برنامج معتمد') : (p.badge_en || 'Certified Program');
      const desc = isAr ? p.description_ar : p.description_en;
      const features = p.features || [];

      const featuresHtml = features.map(f => `
        <li class="card-feature-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${f}</span>
        </li>
      `).join('');

      return `
        <article class="program-card" data-program-id="${p.id}" data-category="${p.category}">
          
          <!-- Card Media Area with Authentic Photography -->
          <div class="card-media-wrap">
            <img src="${p.image_url}" alt="${title}" class="card-media-photo" loading="lazy" width="600" height="340">
            <div class="card-media-gradient"></div>
            <div class="card-badges-overlay">
              <span class="card-category-badge">${badge}</span>
              <span class="card-season-pill">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${season}</span>
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="program-card-body">
            
            <div class="card-duration-row">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${duration}</span>
            </div>

            <h3 class="program-card-title">${title}</h3>
            
            <p class="program-card-desc">${desc}</p>

            <!-- Key Criteria Scannable Bar -->
            <div class="card-metrics-bar">
              <div class="metric-line">
                <span class="metric-key">${isAr ? 'المستوى' : 'Tier'}</span>
                <span class="metric-val">${hotelTier}</span>
              </div>
              <div class="metric-line">
                <span class="metric-key">${isAr ? 'المسافة' : 'Proximity'}</span>
                <span class="metric-val">${proximity}</span>
              </div>
              <div class="metric-line">
                <span class="metric-key">${isAr ? 'السفر' : 'Transport'}</span>
                <span class="metric-val">${transport}</span>
              </div>
            </div>

            <!-- Verified Features List -->
            <ul class="card-features-list">
              ${featuresHtml}
            </ul>

            <!-- Pricing & Action Row -->
            <div class="card-footer-row">
              <div class="card-pricing-block">
                <span class="price-eyebrow">${isAr ? 'الأسعار المقدرة:' : 'Indicative Pricing:'}</span>
                <span class="price-value">${priceText}</span>
              </div>
              
              <!-- Primary Action: Request Details -->
              <button type="button" class="btn btn-primary btn-sm request-details-btn" 
                data-action="request-details"
                data-program-id="${p.id}"
                data-program-title="${title}"
                data-program-category="${p.category}">
                ${isAr ? 'اطلب التفاصيل' : 'Request Details'}
              </button>
            </div>

          </div>

        </article>
      `;
    }).join('');

    programsGrid.innerHTML = cardsHtml;

    // Attach listeners to newly created "Request Details" buttons
    programsGrid.querySelectorAll('.request-details-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = btn.getAttribute('data-program-id');
        const pTitle = btn.getAttribute('data-program-title');
        openRequestModal(pId, pTitle);
      });
    });
  }

  /**
   * Request Modal Management
   */
  let lastActiveModalTrigger = null;

  function openRequestModal(programId, programTitle) {
    if (!requestDetailsModal) return;
    lastActiveModalTrigger = document.activeElement;

    // Reset Form View & States
    if (requestFormView) requestFormView.classList.add('is-active');
    if (requestSuccessView) requestSuccessView.classList.remove('is-active');
    if (requestStatusAlert) {
      requestStatusAlert.style.display = 'none';
      requestStatusAlert.className = 'request-status-alert';
    }

    // Set Program Context
    if (requestProgramId) requestProgramId.value = programId;
    if (requestModalProgramBadge) {
      requestModalProgramBadge.textContent = programTitle || programId;
    }

    // If User is Authenticated, bind verified details
    if (currentUser) {
      if (modalLoggedInNotice) modalLoggedInNotice.style.display = 'flex';
      if (modalCustomerNameDisplay) modalCustomerNameDisplay.textContent = currentUser.name;
      if (modalCustomerPhoneDisplay) modalCustomerPhoneDisplay.textContent = currentUser.phone;
      if (reqCustomerName) reqCustomerName.value = currentUser.name;
      if (reqCustomerPhone) reqCustomerPhone.value = currentUser.phone;
      if (reqCustomerEmail) reqCustomerEmail.value = currentUser.email || '';
      if (reqCustomerGovernorate && currentUser.governorate) {
        reqCustomerGovernorate.value = currentUser.governorate;
      }
      if (modalGuestFields) modalGuestFields.style.display = 'none';
    } else {
      if (modalLoggedInNotice) modalLoggedInNotice.style.display = 'none';
      if (modalGuestFields) modalGuestFields.style.display = 'block';
    }

    requestDetailsModal.classList.add('is-active');
    requestDetailsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first interactive control
    if (currentUser && reqCustomerNotes) {
      reqCustomerNotes.focus();
    } else if (reqCustomerName) {
      reqCustomerName.focus();
    }
  }

  function closeRequestModal() {
    if (!requestDetailsModal) return;
    requestDetailsModal.classList.remove('is-active');
    requestDetailsModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveModalTrigger) {
      lastActiveModalTrigger.focus();
      lastActiveModalTrigger = null;
    }
  }

  /**
   * Request Validation & Submission
   */
  function showFieldError(errorEl, inputEl, text) {
    if (!errorEl) return;
    errorEl.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${text}</span>
    `;
    errorEl.classList.add('is-visible');
    if (inputEl) inputEl.classList.add('has-error');
  }

  function clearFieldError(errorEl, inputEl) {
    if (errorEl) {
      errorEl.innerHTML = '';
      errorEl.classList.remove('is-visible');
    }
    if (inputEl) inputEl.classList.remove('has-error');
  }

  async function handleRequestSubmit(e) {
    e.preventDefault();
    if (isSubmittingRequest) return; // Prevent duplicate clicks

    const isAr = currentLang === 'ar';
    const dict = translations[currentLang] || {};

    const nameVal = (reqCustomerName ? reqCustomerName.value : '').trim();
    const phoneVal = (reqCustomerPhone ? reqCustomerPhone.value : '').trim();
    const govVal = reqCustomerGovernorate ? reqCustomerGovernorate.value : '';
    const emailVal = (reqCustomerEmail ? reqCustomerEmail.value : '').trim();
    const notesVal = (reqCustomerNotes ? reqCustomerNotes.value : '').trim();
    const progId = requestProgramId ? requestProgramId.value : '';

    const nameErrorEl = document.getElementById('reqNameError');
    const phoneErrorEl = document.getElementById('reqPhoneError');
    const govErrorEl = document.getElementById('reqGovError');
    const emailErrorEl = document.getElementById('reqEmailError');

    let hasErrors = false;

    // Validate fields if guest
    if (!currentUser) {
      if (!nameVal || nameVal.length < 2) {
        showFieldError(nameErrorEl, reqCustomerName, getNestedValue(dict, 'request_modal.val_name') || 'من فضلك اكتب اسمك بالكامل.');
        hasErrors = true;
      } else {
        clearFieldError(nameErrorEl, reqCustomerName);
      }

      const normalizedPhone = normalizeNumerals(phoneVal).replace(/[\s\-\(\)]/g, '');
      const egRegex = /^01[0125][0-9]{8}$/;
      const intlRegex = /^(?:\+20|0020|20)1[0125][0-9]{8}$/;
      const generalIntl = /^(?:\+|00)[1-9][0-9]{7,14}$/;

      if (!normalizedPhone || (!egRegex.test(normalizedPhone) && !intlRegex.test(normalizedPhone) && !generalIntl.test(normalizedPhone) && normalizedPhone.length < 8)) {
        showFieldError(phoneErrorEl, reqCustomerPhone, getNestedValue(dict, 'request_modal.val_phone') || 'من فضلك اكتب رقم موبايل صحيح.');
        hasErrors = true;
      } else {
        clearFieldError(phoneErrorEl, reqCustomerPhone);
      }

      if (!govVal) {
        showFieldError(govErrorEl, reqCustomerGovernorate, getNestedValue(dict, 'request_modal.val_gov') || 'من فضلك اختار المحافظة.');
        hasErrors = true;
      } else {
        clearFieldError(govErrorEl, reqCustomerGovernorate);
      }

      if (emailVal) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        if (!emailRegex.test(emailVal)) {
          showFieldError(emailErrorEl, reqCustomerEmail, getNestedValue(dict, 'request_modal.val_email') || 'من فضلك اكتب بريد إلكتروني صحيح.');
          hasErrors = true;
        } else {
          clearFieldError(emailErrorEl, reqCustomerEmail);
        }
      }
    }

    if (hasErrors) {
      return;
    }

    // Enter Loading State
    isSubmittingRequest = true;
    requestSubmitBtn.classList.add('is-loading');
    requestSubmitBtn.setAttribute('disabled', 'true');
    const btnTextEl = requestSubmitBtn.querySelector('.btn-text');
    const originalBtnText = btnTextEl ? btnTextEl.textContent : '';
    if (btnTextEl) {
      btnTextEl.textContent = getNestedValue(dict, 'request_modal.submitting_btn') || 'جاري حفظ وتجهيز الطلب...';
    }

    try {
      const payload = {
        programId: progId,
        customerName: currentUser ? currentUser.name : nameVal,
        customerPhone: currentUser ? currentUser.phone : normalizeNumerals(phoneVal).replace(/[\s\-\(\)]/g, ''),
        customerEmail: currentUser ? currentUser.email : (emailVal || null),
        customerGovernorate: currentUser ? currentUser.governorate : govVal,
        notes: notesVal || null
      };

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Server rejected request');
      }

      // Success: Transition to Professional Confirmation View
      currentRequestId = result.request.id;
      if (successRequestId) {
        successRequestId.textContent = currentRequestId;
      }

      // Prepare WhatsApp Link with target 201203340116
      if (openWhatsAppBtn && result.whatsapp && result.whatsapp.waLink) {
        openWhatsAppBtn.href = result.whatsapp.waLink;
        openWhatsAppBtn.onclick = () => {
          // Track WhatsApp dispatch
          fetch(`/api/requests/${encodeURIComponent(currentRequestId)}/whatsapp-dispatched`, {
            method: 'POST'
          }).catch(() => {});
        };
      }

      if (requestFormView) requestFormView.classList.remove('is-active');
      if (requestSuccessView) requestSuccessView.classList.add('is-active');

    } catch (err) {
      console.error('Request submission error:', err);
      if (requestStatusAlert) {
        requestStatusAlert.style.display = 'block';
        requestStatusAlert.className = 'request-status-alert error is-visible';
        requestStatusAlert.textContent = getNestedValue(dict, 'request_modal.error_network') || 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك والمحاولة مجدداً.';
      }
    } finally {
      isSubmittingRequest = false;
      requestSubmitBtn.classList.remove('is-loading');
      requestSubmitBtn.removeAttribute('disabled');
      if (btnTextEl) btnTextEl.textContent = originalBtnText;
    }
  }

  /**
   * Future Scope Modal (Payments & Payment History)
   */
  function openFutureModal(scopeName) {
    if (!futureScopeModal) return;
    lastActiveModalTrigger = document.activeElement;
    
    const badgeEl = document.getElementById('futureScopeBadge');
    const titleEl = document.getElementById('futureScopeTitle');
    const descEl = document.getElementById('futureScopeDesc');
    const isAr = currentLang === 'ar';

    if (scopeName === 'payments') {
      if (badgeEl) badgeEl.textContent = isAr ? 'بوابة المدفوعات' : 'Payment Portal';
      if (titleEl) titleEl.textContent = isAr ? 'المدفوعات الإلكترونية — قادمة في التحديث القادم' : 'Electronic Payments — Coming in Next Update';
      if (descEl) descEl.textContent = isAr 
        ? 'يجري ربط بوابات الدفع الرسمية المعتمدة لتقديم تجربة سداد إلكتروني وتقسيط متوافقة مع شركات السياحة المرخصة.'
        : 'Official electronic payment gateways and installment options are being integrated for licensed travel agencies.';
    } else if (scopeName === 'payment-history') {
      if (badgeEl) badgeEl.textContent = isAr ? 'سجل المعاملات' : 'Payment History';
      if (titleEl) titleEl.textContent = isAr ? 'سجل المدفوعات — قيد التطوير' : 'Payment History — In Development';
      if (descEl) descEl.textContent = isAr
        ? 'سيتيح لك سجل المدفوعات متابعة الدفعات الصادرة، وسندات القبض، وجدول الأقساط بعد إتمام التعاقد مع شركة السياحة.'
        : 'Payment history will allow you to track installments, official receipts, and payment schedules directly.';
    } else if (scopeName === 'my-account') {
      if (currentUser) {
        if (badgeEl) badgeEl.textContent = isAr ? 'حساب العميل' : 'Customer Account';
        if (titleEl) titleEl.textContent = isAr ? `مرحباً ${currentUser.name}` : `Welcome ${currentUser.name}`;
        if (descEl) descEl.textContent = isAr
          ? `رقم الموبايل: ${currentUser.phone} | المحافظة: ${currentUser.governorate || 'القاهرة'} • جاري تطوير لوحة تحكم متكاملة لإدارة رحلاتك وحجوزاتك.`
          : `Phone: ${currentUser.phone} | Governorate: ${currentUser.governorate || 'Cairo'} • A full dashboard is in development.`;
      } else {
        window.location.href = 'login.html?redirect=programs';
        return;
      }
    }

    futureScopeModal.classList.add('is-active');
    futureScopeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFutureModal() {
    if (!futureScopeModal) return;
    futureScopeModal.classList.remove('is-active');
    futureScopeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveModalTrigger) {
      lastActiveModalTrigger.focus();
      lastActiveModalTrigger = null;
    }
  }

  /**
   * Filter & Search Handlers
   */
  function initFilterListeners() {
    // Trip tabs (All / Umrah / Hajj)
    tripTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const type = tab.getAttribute('data-trip-filter');
        activeTripFilter = type;

        tripTabs.forEach((t) => {
          const isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Reset cat chips to all when switching primary tab
        activeCatFilter = 'all';
        catChips.forEach((c) => {
          c.classList.toggle('is-active', c.getAttribute('data-cat-filter') === 'all');
        });

        renderProgramCards();
      });
    });

    // Category chips
    catChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-cat-filter');
        activeCatFilter = cat;

        catChips.forEach((c) => {
          c.classList.toggle('is-active', c === chip);
        });

        renderProgramCards();
      });
    });

    // Live search input
    if (programSearchInput) {
      programSearchInput.addEventListener('input', (e) => {
        searchQuery = (e.target.value || '').trim();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery ? 'inline-flex' : 'none';
        }
        renderProgramCards();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (programSearchInput) {
          programSearchInput.value = '';
          searchQuery = '';
          clearSearchBtn.style.display = 'none';
          programSearchInput.focus();
        }
        renderProgramCards();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        activeTripFilter = 'all';
        activeCatFilter = 'all';
        searchQuery = '';
        if (programSearchInput) programSearchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';

        tripTabs.forEach((t) => {
          t.classList.toggle('is-active', t.getAttribute('data-trip-filter') === 'all');
        });
        catChips.forEach((c) => {
          c.classList.toggle('is-active', c.getAttribute('data-cat-filter') === 'all');
        });

        renderProgramCards();
      });
    }

    // Read URL query parameters (?trip=umrah, ?trip=hajj, ?category=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tripParam = urlParams.get('trip');
      const catParam = urlParams.get('category');

      if (tripParam && (tripParam === 'umrah' || tripParam === 'hajj')) {
        activeTripFilter = tripParam;
        tripTabs.forEach((t) => {
          const isActive = t.getAttribute('data-trip-filter') === tripParam;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }

      if (catParam) {
        activeCatFilter = catParam;
        catChips.forEach((c) => {
          c.classList.toggle('is-active', c.getAttribute('data-cat-filter') === catParam);
        });
      }
    } catch (e) {}
  }

  /**
   * Event Listeners Setup
   */
  function initEvents() {
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (mobileLangToggleBtn) mobileLangToggleBtn.addEventListener('click', toggleLanguage);
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
    if (mobileNavDrawer) {
      mobileNavDrawer.addEventListener('click', (e) => {
        if (e.target.classList.contains('mobile-nav-backdrop')) {
          closeMobileNav();
        }
      });
    }

    if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', handleLogout);

    // Request Modal Events
    if (requestModalCloseBtn) requestModalCloseBtn.addEventListener('click', closeRequestModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeRequestModal);
    if (requestDetailsModal) {
      requestDetailsModal.addEventListener('click', (e) => {
        if (e.target === requestDetailsModal) closeRequestModal();
      });
    }
    if (requestDetailsForm) {
      requestDetailsForm.addEventListener('submit', handleRequestSubmit);
    }

    // Future Scope Triggers
    futureItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const scope = item.getAttribute('data-future-item');
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileNav();
        }
        openFutureModal(scope);
      });
    });

    closeFutureModalBtns.forEach((btn) => {
      btn.addEventListener('click', closeFutureModal);
    });

    if (futureScopeModal) {
      futureScopeModal.addEventListener('click', (e) => {
        if (e.target === futureScopeModal) closeFutureModal();
      });
    }

    // Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (requestDetailsModal && requestDetailsModal.classList.contains('is-active')) {
          closeRequestModal();
        } else if (futureScopeModal && futureScopeModal.classList.contains('is-active')) {
          closeFutureModal();
        } else if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileNav();
        }
      }
    });

    initFilterListeners();
  }

  function initUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const trip = params.get('trip');
      const cat = params.get('category');
      if (trip && (trip === 'umrah' || trip === 'hajj')) {
        activeTripFilter = trip;
        tripTabs.forEach((t) => {
          const isActive = t.getAttribute('data-trip-filter') === trip;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }
      if (cat) {
        activeCatFilter = cat;
        catChips.forEach((c) => {
          c.classList.toggle('is-active', c.getAttribute('data-cat-filter') === cat);
        });
      }
    } catch (e) {}
  }

  /**
   * App Initializer
   */
  async function init() {
    applyTheme(currentTheme);
    initEvents();
    initUrlParams();
    await applyTranslations(currentLang);
    const hasAccess = await checkAuthSession();
    if (!hasAccess) return;
    await fetchPrograms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
