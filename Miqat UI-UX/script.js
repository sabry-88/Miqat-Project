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

  // Modals
  const loginModal = document.getElementById('loginModal');
  const partnerModal = document.getElementById('partnerModal');
  const openLoginBtns = document.querySelectorAll('[data-open-modal="login"]');
  const openPartnerBtns = document.querySelectorAll('[data-open-modal="partner"]');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  const partnerForm = document.getElementById('partnerForm');
  const partnerFeedback = document.getElementById('partnerFeedback');

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
    openLoginBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileNav();
        }
        openModal(loginModal);
      });
    });

    openPartnerBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileNav();
        }
        openModal(partnerModal);
      });
    });

    modalCloseBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        closeModal(modal);
      });
    });

    // Close on overlay backdrop click
    [loginModal, partnerModal].forEach((modal) => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Partnership Form Submit Demo
    if (partnerForm) {
      partnerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (partnerFeedback) {
          partnerFeedback.classList.add('is-visible');
        }
        partnerForm.reset();
        setTimeout(() => {
          if (partnerFeedback) partnerFeedback.classList.remove('is-visible');
          closeModal(partnerModal);
        }, 3200);
      });
    }
  }

  /**
   * Keyboard Navigation (Escape key handling)
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (loginModal && loginModal.classList.contains('is-active')) {
        closeModal(loginModal);
      } else if (partnerModal && partnerModal.classList.contains('is-active')) {
        closeModal(partnerModal);
      } else if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
        closeMobileNav();
      }
    }
  });

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
  }

  // --- Embedded fallback dictionary (for file:// protocol without local server) ---
  const fallbackLocales = {
    ar: {"nav":{"home":"الرئيسية","programs":"استكشف البرامج","gateways":"نوع الرحلة","umrah":"برامج العمرة","hajj":"برامج الحج","how_it_works":"كيف تعمل ميقات","value":"قيمة المنصة","partnerships":"شركات السياحة","transparency":"الموثوقية والشفافية","login":"تسجيل الدخول","cta_explore":"استكشف البرامج","toggle_lang":"تغيير اللغة إلى English","toggle_theme_dark":"تفعيل الوضع الداكن","toggle_theme_light":"تفعيل الوضع الفاتح","menu_open":"فتح القائمة الرئيسية","menu_close":"إغلاق القائمة"},"hero":{"eyebrow":"الحَجُّ وَالعُمْرَةُ، بِخِيَارَاتٍ أَوْضَحَ","heading":"رِحْلَتُكَ تَبْدَأُ بِاخْتِيَارٍ يُنَاسِبُكَ","subheading":"اكتشف برامج الحج والعمرة، وقارن التفاصيل المهمة بالنسبة لك، واطلب التواصل مع شركة السياحة لاستكمال خطوات الحجز.","cta_primary":"استكشف البرامج","cta_secondary":"انضم كشركة سياحة","badge_trusted":"منصة مقارنة موحدة لبرامج شركات السياحة المرخصة","visual_badge_title":"رِحْلَةٌ مُبَارَكَةٌ بِخِيَارَاتٍ وَاضِحَةٍ","visual_badge_subtitle":"مقارنة شفافة • برامج معتمدة • تواصل مباشر","card_title":"نظرة على معايير الاختيار","card_subtitle":"كيف يساعدك ميقات في تحديد البرنامج الأنسب","crit_type":"نوع الرحلة","crit_type_val":"حج / عمرة","crit_standard":"مستوى الإقامة","crit_standard_val":"اقتصادي، 4 نجوم، 5 نجوم، فاخر","crit_proximity":"المسافة عن الحرمين","crit_proximity_val":"مركزية، صف أول، أو مواصلات","crit_travel":"طريقة السفر","crit_travel_val":"طيران مباشر / بري منظم","card_note":"بيانات منظمة وشفافة تساعدك قبل التواصل المباشر مع الشركة المرخصة"},"gateways":{"eyebrow":"بوابة الاختيار","heading":"حَدِّدْ مَسَارَ رِحْلَتِكَ المُبَارَكَةِ","subheading":"اختر بين مواسم العمرة المتاحة على مدار العام أو برامج الحج السنوي المعتمدة","umrah_title":"رحلات العمرة","umrah_tag":"متاحة طوال العام","umrah_desc":"خيارات روحانية متكاملة للأفراد والعائلات، بمستويات إقامة متعددة تشمل البرامج الاقتصادية، والمتميزة، وفاخرة VIP، وبرامج شهر رمضان المبارك.","umrah_cta":"استعراض فئات العمرة","hajj_title":"رحلات الحج","hajj_tag":"الموسم السنوي المبارك","hajj_desc":"برامج الحج الرسمية الخاضعة للضوابط التنظيمية المعتمدة، تشمل حج القرعة الرسمي، الحج السياحي المنظم، وباقات الحج الفاخر بالمشاعر المقدسة.","hajj_cta":"استعراض فئات الحج"},"categories":{"eyebrow":"تصنيفات البرامج","heading":"اخْتَرْ الفِئَةَ الَّتِي تُلائِمُ تَطَلُّعَاتِكَ وَمِيزَانِيَّتَكَ","description":"استعراض عام لتصنيفات رحلات الحج والعمرة المعتمدة لتسهيل المقارنة واتخاذ القرار الصحيح دون تعقيد.","tab_all":"جميع البرامج","tab_umrah":"برامج العمرة","tab_hajj":"برامج الحج","umrah_badge":"مواسم العمرة على مدار العام","hajj_badge":"موسم الحج السنوي","criteria_proximity":"المسافة","criteria_tier":"المستوى","criteria_transport":"السفر","card_action_inquire":"طلب تفاصيل البرنامج","umrah_economy":{"title":"عمرة اقتصادية","tag":"خيارات ملائمة للميزانية","tier":"اقتصادي معتمد","proximity":"حافلات ترددية للحرم","transport":"بري منظم / طيران","desc":"برامج تركز على التكلفة المناسبة مع توفير متطلبات الإقامة المعتمدة ووسائل النقل المنظمة من وإلى الحرم.","feat_1":"فنادق مصنفة مع توفير حافلات ترددية دورية","feat_2":"خيارات سفر متنوعة تناسب الميزانيات المحددة","feat_3":"تنظيم متكامل للمعتمرين بمستويات خدمة موثوقة"},"umrah_premium":{"title":"عمرة متميزة","tag":"توازن الراحة والقرب","tier":"4 أو 5 نجوم","proximity":"مسافة سير قصيرة","transport":"طيران مباشر","desc":"برامج تجمع بين الفنادق القريبة من الحرمين الشريفين والخدمات المتكاملة لرحلة هادئة ومريحة.","feat_1":"فنادق 4 أو 5 نجوم على مسافة سير قصيرة من الحرم","feat_2":"رحلات طيران مباشرة واستقبال وتوديع منظم","feat_3":"إشراف ميداني وتنسيق مستمر لراحة المعتمر"},"umrah_vip":{"title":"عمرة فاخرة (VIP)","tag":"أعلى درجات الخصوصية","tier":"صف أول 5 نجوم","proximity":"إطلالة مباشرة على الكعبة","transport":"سيارات خاصة VIP","desc":"تجربة استثنائية تشمل الإقامة في فنادق الصف الأول المطلة على الكعبة المشرفة وخدمات تنقل خاصة.","feat_1":"إطلالات مباشرة على الحرم وأجنحة فندقية راقية","feat_2":"خدمات استقبال ونقل خاص بكبار الشخصيات","feat_3":"متابعة وإشراف شخصي مخصص على مدار الساعة"},"umrah_ramadan":{"title":"عمرة شهر رمضان","tag":"روحانية الشهر الفضيل","tier":"باقات رمضانية متنوعة","proximity":"مركزية الحرم المكي","transport":"طيران مباشر منظم","desc":"برامج مخصصة لأيام وليالي شهر رمضان المبارك، متضمنة فترات العشر الأوائل، المنتصف، أو العشر الأواخر.","feat_1":"باقات مخصصة للعشر الأواخر وليالي القدر","feat_2":"إقامة قريبة تسهل التواجد في الصلوات والتهجد","feat_3":"ترتيبات خاصة للوجبات وتسهيل حركة المعتمرين"},"hajj_lottery":{"title":"حج القرعة","tag":"المسار الرسمي المنظم","tier":"تنظيم رسمي موحد","proximity":"المشاعر المقدسة الرسمية","transport":"طيران ونقل معتمد","desc":"برامج الحج المعتمدة عبر المنظومة الرسمية، مع ترتيبات النقل والإقامة في المشاعر المقدسة وفق الضوابط المحددة.","feat_1":"إشراف وتنظيم رسمي خاضع للضوابط الحكومية","feat_2":"مخيمات معتمدة في منى وعرفات ومتابعة ميدانية","feat_3":"مواعيد وإجراءات تعاقد محددة رسمياً"},"hajj_tourist":{"title":"حج سياحي","tag":"خيارات فندقية وتنوع برامج","tier":"اقتصادي إلى 5 نجوم","proximity":"مكة والمشاعر المطورة","transport":"طيران وخدمات تنقل مخصصة","desc":"برامج تقدمها شركات السياحة المرخصة بمستويات إقامة متعددة في مكة والمدينة ومخيمات المشاعر المطورة.","feat_1":"باقات متعددة تتراوح بين الاقتصادي و5 نجوم","feat_2":"خدمات إشراف وتفويج متكاملة من الشركة المرخصة","feat_3":"خيارات طيران متعددة مع خدمات نقل خاصة"},"hajj_vip":{"title":"حج فاخر (VIP)","tag":"أرقى معايير الراحة بالمشاعر","tier":"فاخر متميز VIP","proximity":"مخيمات مطورة قرب الجمرات","transport":"نقل خاص لكبار الشخصيات","desc":"خدمات رفيعة تشمل مخيمات مكيفة ومطورة بالقرب من الجمرات وإقامة فندقية فاخرة وخدمات ضيافة ممتازة.","feat_1":"مخيمات VIP مطورة ومجهزة بالكامل في منى وعرفات","feat_2":"فنادق صف أول مطلة على الحرم الشريف","feat_3":"إعاشة وبوفيهات خاصة مع رعاية صحية وإرشادية"},"disclaimer":"تنبيه توضيحي: التصنيفات المعروضة توضح الفئات العامة للبرامج لمساعدتك في المقارنة، ولا تمثل عروضاً أو أسعاراً تعاقدية حالية."},"how_it_works":{"eyebrow":"رحلة المستخدم","heading":"كيف تختار برنامجك وتتواصل مع الشركة عبر ميقات؟","description":"أربع خطوات واضحة ومباشرة تختصر عليك عناء البحث العشوائي وتضمن وصولك للشركة المرخصة المناسبة.","step_1_num":"01","step_1_title":"استكشف الخيارات المتاحة","step_1_desc":"تصفح تصنيفات برامج الحج والعمرة وتعرف على الفروق الأساسية بين المستويات والخدمات المقدمة.","step_2_num":"02","step_2_title":"قارن المعايير التي تهمك","step_2_desc":"راجع تفاصيل الفنادق، والمسافة عن الحرمين، وخطة السفر، والميزانية المتوقعة بكل وضوح وشفافية.","step_3_num":"03","step_3_title":"اطلب التواصل مع الشركة","step_3_desc":"أرسل متطلباتك المحددة لتصل مباشرة إلى مسؤولي المبيعات في شركة السياحة المرخصة المعنية.","step_4_num":"04","step_4_title":"استكمل إجراءات الحجز مباشرة","step_4_desc":"تواصل مع الشركة المرخصة لإتمام التعاقد، وتسليم الوثائق، وسداد الدفعات وفق الإجراءات الرسمية."},"value":{"eyebrow":"قيمة المنصة للمعتمر والحاج","heading":"وضوح أكثر، وقرار سفر مدروس","description":"صُممت ميقات لتقديم تجربة موثوقة تزيل التشتت في العروض غير المنظمة وتمنحك الثقة في كل خطوة.","item_1_title":"معلومات منظمة وموحدة","item_1_desc":"عرض منظم لتفاصيل البرامج يسهل قراءتها والمقارنة بينها دون مصطلحات مبهمة أو تفاصيل مفقودة.","item_2_title":"مقارنة واعية وموضوعية","item_2_desc":"إمكانية الموازنة بين قرب المسافة، ومستوى الإقامة، وتكلفة الرحلة لتحديد الأنسب لميزانيتك واحتياجاتك.","item_3_title":"توفير الوقت والجهد","item_3_desc":"بدلاً من البحث في صفحات وحسابات متعددة، تجمع المنصة الخيارات في واجهة واحدة موثوقة ومريحة.","item_4_title":"تواصل مباشر مع الشركات المرخصة","item_4_desc":"توجيهك لشركات السياحة المعتمدة رسمياً لاستكمال الحجز دون وسطاء مجهولين أو استفسارات ضائعة."},"partnerships":{"eyebrow":"شراكة شركات السياحة","heading":"اعرض برامجك لجمهور نوعي يبحث بجدية عن رحلته القادمة","description":"تتيح ميقات لشركات السياحة المرخصة تقديم برامجها بطريقة رقمية منظمة واستقبال طلبات تواصل مؤهلة من عملاء حددوا متطلباتهم مسبقاً.","feature_1_title":"عرض رقمي منظم للبرامج","feature_1_desc":"واجهة برامج احترافية تُبرز مواصفات رحلاتكم، وتفاصيل الفنادق، ومواعيد التفويج بوضوح تام.","feature_2_title":"وصول إلى عملاء جادين","feature_2_desc":"استقطاب فئات تبحث بالفعل عن برامج الحج والعمرة وحددت متطلبات سفرها وميزانيتها المقدرة.","feature_3_title":"تحويل مباشر لفريق مبيعاتكم","feature_3_desc":"تصلكم بيانات العميل مع ملخص متطلباته عبر رابط مخصص أو رسالة واتساب لإتمام التعاقد فوراً.","feature_4_title":"استقلالية تامة في التعاقد والتحصيل","feature_4_desc":"تستمر شركتكم في إدارة التسعير، واستلام جوازات السفر، وإبرام العقود، وتحصيل الدفعات بمعرفتكم الكاملة.","standards_title":"معايير الانضمام لمنصة ميقات","req_1":"ترخيص سياحي رسمي سارٍ ومعتمد من الجهات المختصة.","req_2":"صحة ومطابقة كافة البيانات المرفوعة من فنادق ومسافات ونقل وأسعار حقيقية.","req_3":"الالتزام بالرد على طلبات التواصل المحولة خلال 24 ساعة لضمان تجربة ممتازة.","cta_partner":"طلب الانضمام كشريك"},"transparency":{"eyebrow":"الشفافية والمسؤولية","heading":"دور ميقات في رحلتك","text":"ميقات هي منصة رقمية مستقلة تهدف لتسهيل استعراض ومقارنة برامج الحج والعمرة وتنسيق التواصل بين الراغبين في السفر وشركات السياحة المرخصة. يقتصر دور ميقات على تقديم المعلومات وتنظيم التواصل، بينما تتم كافة العمليات التعاقدية، واستخراج التأشيرات، وسداد المدفوعات، وإجراءات السفر بمعرفة وإشراف شركة السياحة المرخصة المختارة ووفقاً للأنظمة المعتمدة."},"final_cta":{"eyebrow":"ابدأ التخطيط لرحلتك","heading":"خِيَارَاتٌ أَوْضَحُ، وَتَوَاصُلٌ أَسْهَلُ مَعَ الشَّرِكَاتِ المُرَخَّصَةِ","desc":"سواء كنت تبحث عن البرنامج الملائم لرحلتك، أو شركة سياحة ترغب في تنظيم وصولها للعملاء، ميقات بوابتك الموثوقة.","btn_explore":"استكشف برامج الحج والعمرة","btn_partner":"انضم كشركة سياحة شريكة"},"footer":{"brand_desc":"منصة رقمية رائدة لاستعراض ومقارنة برامج الحج والعمرة، وتسهيل التواصل المباشر مع شركات السياحة المرخصة.","nav_heading":"أقسام المنصة","categories_heading":"تصنيفات البرامج","partner_heading":"الشركاء والخدمات","rights":"جميع الحقوق محفوظة لمنصة ميقات ©","bilingual_note":"منصة ثنائية اللغة تدعم العربية والإنجليزية"},"modals":{"login_title":"تسجيل الدخول إلى ميقات","login_desc":"تسجيل الدخول مخصص لمسؤولي شركات السياحة المرخصة لإدارة عروض وبرامج الشركة.","login_placeholder_email":"البريد الإلكتروني للشركة","login_placeholder_pass":"كلمة المرور","login_btn":"دخول","login_scope_note":"بوابة الشركات قيد التفعيل التجريبي. يرجى التواصل مع فريق ميقات للحصول على بيانات الدخول.","close":"إغلاق","partner_modal_title":"طلب انضمام شركة سياحة","partner_modal_desc":"نرحب بانضمام شركات السياحة الدينية المرخصة رسمياً لعرض برامجها عبر منصة ميقات.","partner_field_name":"اسم شركة السياحة","partner_field_license":"رقم الترخيص السياحي","partner_field_contact":"اسم مسؤول التواصل","partner_field_phone":"رقم الهاتف / واتساب","partner_field_city":"المدينة / المقر الرئيسي","partner_btn_submit":"إرسال طلب الشراكة","partner_success":"شكراً لتواصلكم. تم تسجيل اهتمامكم وسيقوم فريق ميقات بمراجعة بيانات الترخيص والتواصل معكم خلال 24 ساعة."}},
    en: {"nav":{"home":"Home","gateways":"Journeys","programs":"Programs","umrah":"Umrah","hajj":"Hajj","how_it_works":"How It Works","value":"Why Miqat","partnerships":"Partners","transparency":"Transparency","login":"Sign In","cta_explore":"Explore Programs","toggle_lang":"تغيير اللغة إلى العربية","toggle_theme_dark":"Switch to Dark Mode","toggle_theme_light":"Switch to Light Mode","menu_open":"Open Navigation Menu","menu_close":"Close Navigation Menu"},"hero":{"eyebrow":"Hajj & Umrah, with Clearer Choices","heading":"Your Sacred Journey Begins with the Right Choice","subheading":"Discover Hajj and Umrah programs, compare the details that matter to you, and request direct contact with the licensed tourism company to finalize your booking.","cta_primary":"Explore Programs","cta_secondary":"Join as a Tourism Company","badge_trusted":"Unified comparison platform for licensed tourism operators","visual_badge_title":"A Sacred Journey, Clear Decisions","visual_badge_subtitle":"Transparent Comparison • Licensed Agencies • Direct Contact","card_title":"Program Selection Criteria","card_subtitle":"How Miqat guides your decision-making","crit_type":"Journey Type","crit_type_val":"Hajj / Umrah","crit_standard":"Accommodation Tier","crit_standard_val":"Economy, 4-Star, 5-Star, VIP","crit_proximity":"Proximity to the Harams","crit_proximity_val":"Central, Frontline, or Shuttles","crit_travel":"Travel Mode","crit_travel_val":"Direct Flights / Overland","card_note":"Structured and transparent data to guide you prior to direct contact with the licensed agency"},"gateways":{"eyebrow":"Journey Gateway","heading":"Choose Your Sacred Journey Path","subheading":"Select between year-round Umrah journeys or the official annual Hajj pilgrimage","umrah_title":"Umrah Journeys","umrah_tag":"Available Year-Round","umrah_desc":"Comprehensive spiritual itineraries for individuals and families across verified accommodation tiers, including economy, premium, frontline VIP, and sacred Ramadan programs.","umrah_cta":"Browse Umrah Packages","hajj_title":"Hajj Journeys","hajj_tag":"Annual Sacred Season","hajj_desc":"Official state-supervised pilgrimage itineraries complying with authorized frameworks, including Lottery Hajj, Tourist Hajj, and VIP Holy Sites packages.","hajj_cta":"Browse Hajj Packages"},"categories":{"eyebrow":"Program Categories","heading":"Choose the Category That Fits Your Expectations & Budget","description":"A comprehensive overview of approved Hajj and Umrah program categories to simplify comparison and make informed decisions.","tab_all":"All Programs","tab_umrah":"Umrah Programs","tab_hajj":"Hajj Programs","umrah_badge":"Year-round Umrah Seasons","hajj_badge":"Annual Hajj Season","criteria_proximity":"Proximity","criteria_tier":"Tier","criteria_transport":"Travel","card_action_inquire":"Request Program Details","umrah_economy":{"title":"Economy Umrah","tag":"Budget-Conscious Choices","tier":"Rated Economy","proximity":"Regular Shuttles to Haram","transport":"Overland / Scheduled Flights","desc":"Programs focused on essential value, providing verified accommodations and scheduled shuttle transportation to and from the Holy Mosque.","feat_1":"Classified hotels with dedicated regular shuttle service","feat_2":"Flexible travel itineraries tailored for cost efficiency","feat_3":"Organized pilgrim assistance with dependable service levels"},"umrah_premium":{"title":"Premium Umrah","tag":"Balanced Comfort & Proximity","tier":"4 or 5-Star","proximity":"Short Walking Distance","transport":"Direct Flights","desc":"Programs combining hotels located within walking distance of the Holy Harams with elevated amenities for a peaceful, comfortable journey.","feat_1":"4-star or 5-star hotels within a short walk to the Haram","feat_2":"Direct flights with organized airport reception and transfers","feat_3":"Dedicated field coordination and ongoing pilgrim support"},"umrah_vip":{"title":"VIP Luxury Umrah","tag":"Supreme Privacy & Prestige","tier":"Frontline 5-Star","proximity":"Direct Kaaba Views","transport":"Private Luxury VIP Transfers","desc":"An extraordinary pilgrimage featuring frontline suites directly overlooking the Holy Kaaba and private luxury chauffeur services.","feat_1":"Direct panoramic views of the Kaaba and premium suites","feat_2":"VIP private luxury vehicle transfers from arrival to departure","feat_3":"24/7 personalized concierge and dedicated travel assistance"},"umrah_ramadan":{"title":"Ramadan Umrah","tag":"The Blessed Holy Month","tier":"Curated Ramadan Packages","proximity":"Central Haram Location","transport":"Coordinated Direct Flights","desc":"Dedicated programs for the sacred month of Ramadan, covering the early days, mid-month, or the blessed last ten nights.","feat_1":"Special packages for the last ten nights and Laylat al-Qadr","feat_2":"Close lodging ensuring effortless access for Taraweeh & Tahajjud","feat_3":"Tailored meal arrangements for Iftar and Suhoor"},"hajj_lottery":{"title":"Government Lottery Hajj","tag":"Official Public Framework","tier":"Official State Scheme","proximity":"Designated Holy Sites Camps","transport":"Authorized Logistics & Flights","desc":"Official state-supervised pilgrimage programs with organized transportation and accommodation across the Holy Sites under strict regulations.","feat_1":"Official supervision governed by governmental regulations","feat_2":"Approved Mina and Arafat camps with field coordination","feat_3":"Standardized registration timetables and procedures"},"hajj_tourist":{"title":"Tourist Hajj","tag":"Hotel Diversity & Flexibility","tier":"Economy to 5-Star","proximity":"Makkah & Upgraded Camps","transport":"Flexible Flights & Transfers","desc":"Pilgrimage itineraries presented by licensed tourism companies with multiple accommodation tiers in Makkah, Madinah, and upgraded holy camps.","feat_1":"Tiered packages ranging from economy to luxury 5-star hotels","feat_2":"End-to-end guidance and pilgrim grouping by licensed agencies","feat_3":"Multiple airline options with coordinated ground logistics"},"hajj_vip":{"title":"VIP Luxury Hajj","tag":"Highest Comfort in the Holy Sites","tier":"Exclusive Luxury VIP","proximity":"Upgraded Camps Near Jamarat","transport":"Private Chauffeur & Logistics","desc":"Refined pilgrimage services featuring upgraded air-conditioned camps near the Jamarat, frontline luxury hotels, and gourmet hospitality.","feat_1":"Upgraded, fully equipped VIP camps in Mina and Arafat","feat_2":"Frontline luxury hotels overlooking the Grand Mosque","feat_3":"Private catering, specialized medical attention, and scholars"},"disclaimer":"Clarification: The categories displayed illustrate general program classifications to assist comparison and do not constitute live contractual offers or active bookings."},"how_it_works":{"eyebrow":"User Journey","heading":"How to Choose Your Program and Connect with an Agency via Miqat","description":"Four clear, straightforward steps that eliminate scattered searching and connect you directly with the right licensed agency.","step_1_num":"01","step_1_title":"Explore Available Options","step_1_desc":"Browse Hajj and Umrah categories to understand the core differences between accommodation tiers and service packages.","step_2_num":"02","step_2_title":"Compare Key Criteria","step_2_desc":"Review hotel proximities, departure schedules, expected budgets, and itinerary details with complete transparency.","step_3_num":"03","step_3_title":"Request Contact with Agency","step_3_desc":"Submit your specific journey preferences to be routed directly to the sales team of the designated licensed tourism company.","step_4_num":"04","step_4_title":"Finalize Booking Directly","step_4_desc":"Conclude your contract, submit travel passports, and process payments directly with the licensed agency under official guidelines."},"value":{"eyebrow":"Value for Pilgrims","heading":"Greater Clarity, Smarter Travel Decisions","description":"Miqat is intentionally crafted to eliminate the confusion of unstructured travel offers and give you total confidence at every step.","item_1_title":"Structured & Standardized Data","item_1_desc":"Consistent program presentation makes comparison simple and clear, free from ambiguous claims or omitted details.","item_2_title":"Objective, Mindful Comparison","item_2_desc":"Balance distance to the Harams, accommodation standards, and travel costs to find the itinerary that truly fits your needs.","item_3_title":"Saves Valuable Time & Effort","item_3_desc":"Instead of sifting through fragmented social posts, explore structured, verified options in one dependable interface.","item_4_title":"Direct Path to Licensed Companies","item_4_desc":"Connect directly with officially licensed tourism companies to complete your arrangements without unknown middlemen."},"partnerships":{"eyebrow":"Tourism Company Partnerships","heading":"Showcase Your Programs to Serious, High-Intent Travelers","description":"Miqat empowers licensed tourism companies to showcase their itineraries in a modern digital format and receive qualified contact requests from pilgrims who have already defined their needs.","feature_1_title":"Structured Digital Showcase","feature_1_desc":"A dedicated, professional program presence presenting hotel specifications, proximity, and flight details with pristine clarity.","feature_2_title":"Access to Qualified Inquiries","feature_2_desc":"Attract pilgrims actively seeking Hajj and Umrah packages who have already defined their travel season and budget.","feature_3_title":"Direct Handoff to Your Sales Team","feature_3_desc":"Inquiries with a clear summary of traveler requirements are routed directly to your team via a dedicated link or WhatsApp.","feature_4_title":"Full Commercial Independence","feature_4_desc":"Your company retains full authority over pricing, document collection, contractual agreements, and financial transactions.","standards_title":"Partnership Standards & Requirements","req_1":"A valid, officially recognized tourism license issued by competent government authorities.","req_2":"Complete truthfulness and accuracy of all uploaded data including hotel tiers, distances, and genuine prices.","req_3":"Commitment to respond to forwarded booking inquiries within 24 hours to ensure an exceptional pilgrim experience.","cta_partner":"Apply for Partnership"},"transparency":{"eyebrow":"Trust & Responsibility","heading":"Miqat's Role in Your Journey","text":"Miqat is an independent digital platform built to simplify exploring and comparing Hajj and Umrah programs, facilitating structured communication between travelers and licensed tourism agencies. Miqat's scope is strictly focused on discovery, comparison, and qualified communication handoff. All contractual commitments, visa issuances, financial payments, and operational pilgrimage services are carried out directly by the chosen licensed tourism company under established regulatory standards."},"final_cta":{"eyebrow":"Begin Planning Your Sacred Journey","heading":"Clearer Choices, Seamless Connection with Licensed Operators","desc":"Whether you are a pilgrim seeking the ideal journey or a licensed agency expanding your reach, Miqat is your trusted gateway.","btn_explore":"Explore Hajj & Umrah Programs","btn_partner":"Join as a Partner Agency"},"footer":{"brand_desc":"A premier digital platform for exploring and comparing Hajj & Umrah programs, connecting pilgrims directly with licensed tourism companies.","nav_heading":"Platform Navigation","categories_heading":"Program Categories","partner_heading":"Partners & Services","rights":"All rights reserved. Miqat Platform ©","bilingual_note":"Bilingual platform supporting Arabic and English"},"modals":{"login_title":"Sign In to Miqat","login_desc":"Sign-in is designated for licensed tourism company representatives to manage company programs and inquiries.","login_placeholder_email":"Company Email Address","login_placeholder_pass":"Password","login_btn":"Sign In","login_scope_note":"The partner portal is currently in pilot access. Please contact the Miqat team to obtain account credentials.","close":"Close","partner_modal_title":"Tourism Company Partnership Request","partner_modal_desc":"We welcome officially licensed religious tourism companies to feature their verified programs on Miqat.","partner_field_name":"Company Name","partner_field_license":"Tourism License Number","partner_field_contact":"Contact Person Name","partner_field_phone":"Phone / WhatsApp Number","partner_field_city":"City / Headquarters","partner_btn_submit":"Submit Partnership Request","partner_success":"Thank you for reaching out. Your interest has been recorded, and the Miqat team will verify your licensing credentials and contact you within 24 hours."}}
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
