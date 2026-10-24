/**
 * MIQAT PLATFORM — AUTHENTICATION & REGISTRATION ENGINE
 * Dedicated logic for:
 *  - Login & Session Initiation
 *  - Customer Registration Form with Required Dots & Governorates Dropdown
 *  - Program Context Preservation (from Hajj & Umrah Inquiry Flow)
 *  - Arabic-Indic Numeral Normalization (٠-٩ -> 0-9)
 *  - Bilingual Localization (Arabic RTL / English LTR) synced with platform storage
 *  - Light / Dark Theme toggling synced with platform storage
 *  - Transparent backend status & extensible integration hooks
 */

(function () {
  'use strict';

  // --- Storage Keys (shared with platform) ---
  const STORAGE_LANG = 'miqat_lang';
  const STORAGE_THEME = 'miqat_theme';

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ar';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  let translations = { ar: null, en: null };

  // --- Supported Egyptian Governorates ---
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

  // --- Program Labels for Context Preservation ---
  const PROGRAM_LABELS = {
    umrah_economy: { ar: 'عمرة اقتصادية', en: 'Economy Umrah' },
    umrah_premium: { ar: 'عمرة متميزة', en: 'Premium Umrah' },
    umrah_vip: { ar: 'عمرة فاخرة (VIP)', en: 'VIP Umrah' },
    umrah_ramadan: { ar: 'عمرة شهر رمضان', en: 'Ramadan Umrah' },
    hajj_lottery: { ar: 'حج القرعة', en: 'Lottery Hajj' },
    hajj_tourist: { ar: 'حج سياحي', en: 'Tourist Hajj' },
    hajj_vip: { ar: 'حج فاخر (VIP)', en: 'VIP Hajj' }
  };

  // --- Embedded fallback dictionary (for offline / file:// protocol) ---
  const fallbackDict = {
    ar: {
      "auth.login_page_title": "ميقات — تسجيل الدخول",
      "auth.back_to_home": "العودة للرئيسية",
      "auth.login_heading": "تسجيل الدخول",
      "auth.login_subheading": "مرحباً بك في منصة ميقات. سجل دخولك لمتابعة استفساراتك أو إدارة برامج الحج والعمرة.",
      "auth.identifier_label": "البريد الإلكتروني أو رقم الموبايل",
      "auth.identifier_placeholder": "اكتب الإيميل أو رقم الموبايل",
      "auth.identifier_hint": "يقبل البريد الإلكتروني أو أرقام الموبايل (المصرية والدولية)",
      "auth.password_label": "كلمة المرور",
      "auth.password_placeholder": "اكتب كلمة المرور",
      "auth.show_password": "إظهار كلمة المرور",
      "auth.hide_password": "إخفاء كلمة المرور",
      "auth.forgot_password": "نسيت كلمة المرور؟",
      "auth.sign_in_btn": "تسجيل الدخول",
      "auth.signing_in_btn": "جاري تسجيل الدخول...",
      "auth.no_account": "ليس لديك حساب؟",
      "auth.create_account": "إنشاء حساب جديد",
      "auth.val_identifier_empty": "من فضلك اكتب الإيميل أو رقم الموبايل.",
      "auth.val_identifier_invalid": "من فضلك اكتب رقم موبايل أو إيميل صحيح.",
      "auth.val_password_empty": "من فضلك اكتب كلمة المرور.",
      "auth.val_invalid_credentials": "البيانات اللي دخلتها غير صحيحة، راجعها وحاول تاني.",
      "auth.val_network_error": "تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.",
      "auth.val_backend_notice_title": "جاهزية المصادقة والربط البرمجي",
      "auth.val_backend_notice_desc": "تم التحقق من صحة المدخلات بنجاح. الواجهة الأمامية جاهزة وتتطلب ربط خادم المصادقة (Auth API) للتحقق المباشر من الحسابات.",
      "auth.forgot_title": "استعادة كلمة المرور",
      "auth.forgot_desc": "خاصية استعادة كلمة المرور تتطلب ربط مزود خدمة الرسائل القصيرة (SMS) أو البريد الإلكتروني مع خادم النظام الخلفي.",
      "auth.register_title": "إنشاء حساب عميل",
      "auth.register_desc": "سجّل بياناتك عشان تقدر تطّلع على تفاصيل برامج الحج والعمرة وتتابع طلباتك.",
      "auth.register_page_title": "ميقات — إنشاء حساب عميل",
      "auth.register_heading": "إنشاء حساب عميل",
      "auth.register_subheading": "سجّل بياناتك عشان تقدر تطّلع على تفاصيل برامج الحج والعمرة وتتابع طلباتك.",
      "auth.name_label": "الاسم بالكامل",
      "auth.name_placeholder": "اكتب اسمك بالكامل",
      "auth.phone_label": "رقم الموبايل / واتساب",
      "auth.phone_placeholder": "اكتب رقم الموبايل المتاح عليه واتساب",
      "auth.phone_hint": "يقبل أرقام الموبايل المصرية (010, 011, 012, 015) أو الأرقام الدولية",
      "auth.governorate_label": "المحافظة",
      "auth.governorate_placeholder": "اختار المحافظة",
      "auth.email_label": "البريد الإلكتروني (اختياري)",
      "auth.email_placeholder": "اكتب الإيميل لو متاح",
      "auth.email_hint": "اختياري — لمتابعة إشعارات وتفاصيل البرامج على بريدك",
      "auth.required_tooltip": "هذا الحقل إجباري",
      "auth.continue_btn": "متابعة",
      "auth.continuing_btn": "جاري المتابعة...",
      "auth.have_account": "عندك حساب بالفعل؟",
      "auth.sign_in": "تسجيل الدخول",
      "auth.val_name_empty": "من فضلك اكتب اسمك بالكامل.",
      "auth.val_name_invalid": "من فضلك اكتب اسماً صحيحاً.",
      "auth.val_phone_empty": "من فضلك اكتب رقم الموبايل أو الواتساب.",
      "auth.val_phone_invalid": "من فضلك اكتب رقم موبايل صحيح.",
      "auth.val_governorate_empty": "من فضلك اختار المحافظة.",
      "auth.val_email_invalid": "من فضلك اكتب بريد إلكتروني صحيح أو اتركه فارغاً.",
      "auth.program_context_label": "طلب تفاصيل:",
      "auth.customer_reg_notice_title": "جاهزية تسجيل العميل وطلب البرنامج",
      "auth.customer_reg_notice_desc": "تم التحقق من صحة بياناتك بنجاح. الواجهة الأمامية جاهزة وتتطلب ربط نظام إدارة العملاء (CRM / Auth API) لحفظ الحساب وتمرير تفاصيل البرنامج مباشرة.",
      "auth.back_to_login": "العودة لتسجيل الدخول",
      "auth.portal_badge": "منصة ميقات الموحدة",
      "auth.security_note": "بياناتك محمية ومُشفّرة وفق أعلى معايير الأمان",
      "auth.password_reg_placeholder": "أنشئ كلمة مرور قوية",
      "auth.confirm_password_label": "تأكيد كلمة المرور",
      "auth.confirm_password_placeholder": "اكتب كلمة المرور مرة تانية",
      "auth.pass_req_length": "أكثر من 8 أحرف",
      "auth.pass_req_letter": "تحتوي على حرف إنجليزي واحد على الأقل",
      "auth.pass_req_number": "تحتوي على رقم واحد على الأقل",
      "auth.pass_req_special": "تحتوي على رمز خاص واحد على الأقل",
      "auth.val_password_incomplete": "كلمة المرور لا تستوفي جميع الشروط المطلوبة أدناه.",
      "auth.val_confirm_password_empty": "من فضلك أكّد كلمة المرور.",
      "auth.val_passwords_mismatch": "كلمتا المرور غير متطابقتين.",
      "auth.passwords_match": "كلمتا المرور متطابقتان",
      "nav.register": "إنشاء حساب",
      "account_type.page_title": "ميقات — اختيار نوع الحساب",
      "account_type.heading": "اختار نوع الحساب",
      "account_type.subheading": "حدد نوع الحساب المناسب لك للمتابعة.",
      "account_type.customer_title": "حساب عميل",
      "account_type.customer_desc": "للبحث عن برامج الحج والعمرة والتعرّف على الرحلات المتاحة.",
      "account_type.customer_cta": "إنشاء حساب عميل",
      "account_type.company_title": "حساب شركة سياحة",
      "account_type.company_desc": "للشركات السياحية الراغبة في الانضمام إلى منصة ميقات.",
      "account_type.company_cta": "تسجيل شركة سياحة"
    },
    en: {
      "auth.login_page_title": "Miqat — Sign In",
      "auth.back_to_home": "Back to Home",
      "auth.login_heading": "Sign In",
      "auth.login_subheading": "Welcome back to Miqat. Sign in to manage your inquiries or explore verified Hajj & Umrah programs.",
      "auth.identifier_label": "Email or Phone Number",
      "auth.identifier_placeholder": "Enter your email or mobile number",
      "auth.identifier_hint": "Accepts email address or mobile numbers (Egyptian & International)",
      "auth.password_label": "Password",
      "auth.password_placeholder": "Enter your password",
      "auth.show_password": "Show password",
      "auth.hide_password": "Hide password",
      "auth.forgot_password": "Forgot password?",
      "auth.sign_in_btn": "Sign In",
      "auth.signing_in_btn": "Signing In...",
      "auth.no_account": "Don't have an account?",
      "auth.create_account": "Create an account",
      "auth.val_identifier_empty": "Please enter your email or mobile number.",
      "auth.val_identifier_invalid": "Please enter a valid email address or phone number.",
      "auth.val_password_empty": "Please enter your password.",
      "auth.val_invalid_credentials": "The credentials are incorrect. Please check them and try again.",
      "auth.val_network_error": "Unable to connect to the server. Please check your internet connection and try again.",
      "auth.val_backend_notice_title": "Authentication API Status",
      "auth.val_backend_notice_desc": "Inputs verified successfully. The frontend interface is complete and awaiting connection to the live backend Auth API for real-time authentication.",
      "auth.forgot_title": "Password Recovery",
      "auth.forgot_desc": "Password recovery requires integration with transactional SMS or email delivery services on the backend.",
      "auth.register_title": "Create Customer Account",
      "auth.register_desc": "Register your details to access Hajj & Umrah program details and track your requests.",
      "auth.register_page_title": "Miqat — Create Customer Account",
      "auth.register_heading": "Create Customer Account",
      "auth.register_subheading": "Register your details to access Hajj & Umrah program details and track your requests.",
      "auth.name_label": "Full Name",
      "auth.name_placeholder": "Enter your full name",
      "auth.phone_label": "Mobile / WhatsApp Number",
      "auth.phone_placeholder": "Enter your mobile number",
      "auth.phone_hint": "Accepts Egyptian mobile numbers (010, 011, 012, 015) or international formats",
      "auth.governorate_label": "Governorate",
      "auth.governorate_placeholder": "Select your governorate",
      "auth.email_label": "Email Address (Optional)",
      "auth.email_placeholder": "Enter your email if available",
      "auth.email_hint": "Optional — to receive program updates and details in your inbox",
      "auth.required_tooltip": "This field is required",
      "auth.continue_btn": "Continue",
      "auth.continuing_btn": "Continuing...",
      "auth.have_account": "Already have an account?",
      "auth.sign_in": "Sign In",
      "auth.val_name_empty": "Please enter your full name.",
      "auth.val_name_invalid": "Please enter a valid full name.",
      "auth.val_phone_empty": "Please enter your mobile or WhatsApp number.",
      "auth.val_phone_invalid": "Please enter a valid mobile number.",
      "auth.val_governorate_empty": "Please select your governorate.",
      "auth.val_email_invalid": "Please enter a valid email address or leave it blank.",
      "auth.program_context_label": "Requesting Details:",
      "auth.customer_reg_notice_title": "Customer Registration & Request Status",
      "auth.customer_reg_notice_desc": "Customer details verified successfully. The frontend is complete and awaiting connection to the live backend CRM/Auth API to record the request and provide program details.",
      "auth.back_to_login": "Back to Sign In",
      "auth.portal_badge": "Miqat Unified Platform",
      "auth.security_note": "Your data is protected and encrypted with strict security standards",
      "auth.password_reg_placeholder": "Create a strong password",
      "auth.confirm_password_label": "Confirm Password",
      "auth.confirm_password_placeholder": "Re-enter your password",
      "auth.pass_req_length": "More than 8 characters",
      "auth.pass_req_letter": "At least one English letter",
      "auth.pass_req_number": "At least one number",
      "auth.pass_req_special": "At least one special character",
      "auth.val_password_incomplete": "Password does not satisfy all requirements below.",
      "auth.val_confirm_password_empty": "Please confirm your password.",
      "auth.val_passwords_mismatch": "Passwords do not match.",
      "auth.passwords_match": "Passwords match",
      "nav.register": "Create Account",
      "account_type.page_title": "Miqat — Choose Account Type",
      "account_type.heading": "Choose Your Account Type",
      "account_type.subheading": "Select the appropriate account type to continue.",
      "account_type.customer_title": "Customer Account",
      "account_type.customer_desc": "To search for Hajj & Umrah programs and explore available journeys.",
      "account_type.customer_cta": "Create Customer Account",
      "account_type.company_title": "Tourism Company Account",
      "account_type.company_desc": "For tourism companies looking to join Miqat platform.",
      "account_type.company_cta": "Register Tourism Company"
    }
  };

  // --- DOM Elements ---
  const html = document.documentElement;
  const langToggleBtn = document.getElementById('langToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  
  // Login Elements
  const loginForm = document.getElementById('loginForm');
  const identifierInput = document.getElementById('loginIdentifier');
  const passwordInput = document.getElementById('loginPassword');
  const passwordToggleBtn = document.getElementById('passwordToggleBtn');
  const identifierError = document.getElementById('identifierError');
  const passwordError = document.getElementById('passwordError');

  // Customer Registration Elements
  const customerRegisterForm = document.getElementById('customerRegisterForm');
  const customerNameInput = document.getElementById('customerName');
  const customerPhoneInput = document.getElementById('customerPhone');
  const customerGovernorateSelect = document.getElementById('customerGovernorate');
  const customerEmailInput = document.getElementById('customerEmail');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const governorateError = document.getElementById('governorateError');
  const emailError = document.getElementById('emailError');
  const customerPasswordInput = document.getElementById('customerPassword');
  const customerPasswordToggleBtn = document.getElementById('customerPasswordToggleBtn');
  const customerPasswordChecklist = document.getElementById('customerPasswordChecklist');
  const customerPasswordError = document.getElementById('customerPasswordError');
  const customerConfirmPasswordInput = document.getElementById('customerConfirmPassword');
  const customerConfirmPasswordToggleBtn = document.getElementById('customerConfirmPasswordToggleBtn');
  const customerPasswordMatch = document.getElementById('customerPasswordMatch');
  const customerConfirmPasswordError = document.getElementById('customerConfirmPasswordError');

  // Tourism Company Registration Elements
  const companyRegisterForm = document.getElementById('companyRegisterForm');
  const companyNameInput = document.getElementById('companyName');
  const responsiblePersonInput = document.getElementById('responsiblePerson');
  const companyPhoneInput = document.getElementById('companyPhone');
  const companyGovernorateSelect = document.getElementById('companyGovernorate');
  const licenseNumberInput = document.getElementById('licenseNumber');
  const companyEmailInput = document.getElementById('companyEmail');
  const companyNotesInput = document.getElementById('companyNotes');
  const companyNameError = document.getElementById('companyNameError');
  const responsiblePersonError = document.getElementById('responsiblePersonError');
  const companyPhoneError = document.getElementById('companyPhoneError');
  const companyGovernorateError = document.getElementById('companyGovernorateError');
  const licenseNumberError = document.getElementById('licenseNumberError');
  const companyEmailError = document.getElementById('companyEmailError');
  const companyNotesError = document.getElementById('companyNotesError');
  const companyPasswordInput = document.getElementById('companyPassword');
  const companyPasswordToggleBtn = document.getElementById('companyPasswordToggleBtn');
  const companyPasswordChecklist = document.getElementById('companyPasswordChecklist');
  const companyPasswordError = document.getElementById('companyPasswordError');
  const companyConfirmPasswordInput = document.getElementById('companyConfirmPassword');
  const companyConfirmPasswordToggleBtn = document.getElementById('companyConfirmPasswordToggleBtn');
  const companyPasswordMatch = document.getElementById('companyPasswordMatch');
  const companyConfirmPasswordError = document.getElementById('companyConfirmPasswordError');

  // Shared Auth Elements
  const partnerContextBanner = document.getElementById('partnerContextBanner');
  const authStatusBox = document.getElementById('authStatusBox');
  const submitBtn = document.getElementById('submitBtn');
  const programContextBanner = document.getElementById('programContextBanner');
  const programContextTitle = document.getElementById('programContextTitle');
  const linkToLogin = document.getElementById('linkToLogin');
  const linkToRegister = document.getElementById('linkToRegister');
  const customerAccountCard = document.getElementById('customerAccountCard');
  const companyAccountCard = document.getElementById('companyAccountCard');

  /**
   * Arabic-Indic numerals conversion (٠-٩ -> 0-9)
   */
  function normalizeNumerals(str) {
    if (!str) return '';
    const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[٠-٩]/g, (match) => arabicIndic.indexOf(match));
  }

  /**
   * Helper to fetch translation files with fallback
   */
  async function loadTranslations(lang) {
    if (translations[lang]) return translations[lang];
    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      translations[lang] = data;
      return data;
    } catch (e) {
      return translations[lang] || fallbackDict[lang] || {};
    }
  }

  function getTranslation(key, dict) {
    if (!dict) return fallbackDict[currentLang]?.[key] || key;
    const parts = key.split('.');
    let cur = dict;
    for (let part of parts) {
      if (cur && cur[part] !== undefined) {
        cur = cur[part];
      } else {
        cur = null;
        break;
      }
    }
    return cur !== null ? cur : fallbackDict[currentLang]?.[key] || key;
  }

  /**
   * Populate Egyptian Governorates dropdown preserving selected value
   */
  function populateGovernorates(lang) {
    const selects = [customerGovernorateSelect, companyGovernorateSelect].filter(Boolean);
    if (!selects.length) return;
    
    selects.forEach(selectEl => {
      const currentVal = selectEl.value;
      const placeholderText = lang === 'ar' ? 'اختار المحافظة' : 'Select your governorate';
      
      let htmlContent = `<option value="" disabled ${!currentVal ? 'selected' : ''}>${placeholderText}</option>`;
      EGYPTIAN_GOVERNORATES.forEach(gov => {
        const name = lang === 'ar' ? gov.ar : gov.en;
        const isSelected = currentVal === gov.id ? 'selected' : '';
        htmlContent += `<option value="${gov.id}" ${isSelected}>${name}</option>`;
      });

      selectEl.innerHTML = htmlContent;
    });
  }

  /**
   * URL Parameters Parsing for Program Details Flow Preservation
   */
  function getUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        redirect: params.get('redirect'),
        trip: params.get('trip'),
        programId: params.get('programId')
      };
    } catch (e) {
      return {};
    }
  }

  function setupProgramContext() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const trip = params.get('trip');
    const programId = params.get('programId');
    const journey = params.get('journey');

    if (redirect === 'program' && programId) {
      const programInfo = PROGRAM_LABELS[programId];
      const programTitle = programInfo 
        ? (currentLang === 'ar' ? programInfo.ar : programInfo.en)
        : programId;

      if (programContextBanner && programContextTitle) {
        programContextTitle.textContent = programTitle;
        programContextBanner.style.display = 'flex';
      }

      // Preserve query params across Login / Register links
      const currentQuery = window.location.search;
      if (linkToLogin && currentQuery) {
        linkToLogin.href = `login.html${currentQuery}`;
      }
      if (linkToRegister && currentQuery) {
        linkToRegister.href = `register-choice.html${currentQuery}`;
      }
      if (customerAccountCard && currentQuery) {
        customerAccountCard.href = `register.html${currentQuery}`;
      }
    } else if (journey === 'partner') {
      if (partnerContextBanner) {
        partnerContextBanner.style.display = 'flex';
      }
      if (linkToRegister) {
        linkToRegister.href = 'register-company.html';
      }
      if (linkToLogin) {
        linkToLogin.href = 'login.html?journey=partner';
      }
    }
  }

  /**
   * Apply translations to the DOM
   */
  async function applyTranslations(lang) {
    const dict = await loadTranslations(lang);
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const pageTitleKey = document.body.dataset.pageTitleKey || 'auth.login_page_title';
    document.title = getTranslation(pageTitleKey, dict);

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslation(key, dict);
      if (val) el.textContent = val;
    });

    // Attributes
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach((mapping) => {
        const [attr, key] = mapping.split(':').map((s) => s.trim());
        if (attr && key) {
          const val = getTranslation(key, dict);
          if (val) el.setAttribute(attr, val);
        }
      });
    });

    // Language button label
    if (langToggleBtn) {
      const label = langToggleBtn.querySelector('.lang-label');
      if (label) label.textContent = lang === 'ar' ? 'EN' : 'عربي';
      const aria = lang === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic';
      langToggleBtn.setAttribute('aria-label', aria);
      langToggleBtn.setAttribute('title', aria);
    }

    // Update Governorates select dropdown
    populateGovernorates(lang);

    // Update Program Context Title if active
    setupProgramContext();

    // Update dynamic aria states
    updatePasswordToggleAria();
    updateThemeAria();
  }

  function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem(STORAGE_LANG, currentLang);
    applyTranslations(currentLang);
  }

  /**
   * Theme Management
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    updateThemeAria();
  }

  function toggleTheme() {
    currentTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_THEME, currentTheme);
    applyTheme(currentTheme);
  }

  function updateThemeAria() {
    if (!themeToggleBtn) return;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const isAr = currentLang === 'ar';
    const text = isDark
      ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode')
      : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode');

    themeToggleBtn.setAttribute('aria-label', text);
    themeToggleBtn.setAttribute('title', text);
    const moon = themeToggleBtn.querySelector('.icon-moon');
    const sun = themeToggleBtn.querySelector('.icon-sun');
    if (moon && sun) {
      moon.style.display = isDark ? 'none' : 'block';
      sun.style.display = isDark ? 'block' : 'none';
    }
  }

  /**
   * Password Visibility Toggle
   */
  function updatePasswordToggleAria() {
    if (!passwordToggleBtn || !passwordInput) return;
    const isShown = passwordInput.getAttribute('type') === 'text';
    const isAr = currentLang === 'ar';
    const ariaText = isShown
      ? (isAr ? 'إخفاء كلمة المرور' : 'Hide password')
      : (isAr ? 'إظهار كلمة المرور' : 'Show password');

    passwordToggleBtn.setAttribute('aria-label', ariaText);
    passwordToggleBtn.setAttribute('title', ariaText);
  }

  function togglePasswordVisibility() {
    if (!passwordInput || !passwordToggleBtn) return;
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

    const eyeIcon = passwordToggleBtn.querySelector('.icon-eye');
    const eyeOffIcon = passwordToggleBtn.querySelector('.icon-eye-off');
    if (eyeIcon && eyeOffIcon) {
      eyeIcon.style.display = isPassword ? 'none' : 'block';
      eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    }

    updatePasswordToggleAria();
    passwordInput.focus();
  }

  /**
   * Touch & Focus Behavior for Required Dot Indicators
   */
  function initRequiredTooltips() {
    const indicators = document.querySelectorAll('.required-indicator');
    indicators.forEach(ind => {
      ind.addEventListener('click', (e) => {
        // Toggle on touch/click
        const wasActive = ind.classList.contains('is-active');
        indicators.forEach(i => i.classList.remove('is-active'));
        if (!wasActive) {
          ind.classList.add('is-active');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.required-indicator')) {
        indicators.forEach(i => i.classList.remove('is-active'));
      }
    });
  }

  /**
   * Form Validation Helpers
   */

  /**
   * Password Criteria Checker
   * Rule 1: Length > 8 (minimum 9 characters)
   * Rule 2: At least one English letter (A-Z or a-z). Arabic characters DO NOT count.
   * Rule 3: At least one digit (0-9)
   * Rule 4: At least one special character (e.g. @, #, !, $, %, etc.)
   */
  function checkPasswordCriteria(password) {
    const str = password || '';
    return {
      length: str.length >= 9,
      letter: /[a-zA-Z]/.test(str),
      number: /[0-9]/.test(str),
      special: /[^a-zA-Z0-9\s]/.test(str)
    };
  }

  function isPasswordCriteriaSatisfied(criteria) {
    return Boolean(criteria.length && criteria.letter && criteria.number && criteria.special);
  }

  function updatePasswordChecklistUI(checklistEl, criteria) {
    if (!checklistEl) return;
    const items = checklistEl.querySelectorAll('.password-req-item');
    items.forEach(function (item) {
      const req = item.getAttribute('data-req');
      if (req && criteria[req] !== undefined) {
        if (criteria[req]) {
          item.classList.add('is-satisfied');
        } else {
          item.classList.remove('is-satisfied');
        }
      }
    });
  }

  function updateConfirmFeedback(passInput, confirmInput, matchEl, errorEl) {
    if (!confirmInput || !matchEl) return;
    const pVal = passInput ? passInput.value : '';
    const cVal = confirmInput.value;
    const dict = translations[currentLang] || fallbackDict[currentLang];

    if (!cVal) {
      matchEl.style.display = 'none';
      matchEl.className = 'password-match-feedback';
      matchEl.innerHTML = '';
      return;
    }

    if (pVal === cVal) {
      matchEl.style.display = 'flex';
      matchEl.className = 'password-match-feedback is-matched';
      matchEl.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${getTranslation('auth.passwords_match', dict)}</span>
      `;
      if (errorEl) clearFieldError(errorEl, confirmInput);
    } else {
      matchEl.style.display = 'none';
      matchEl.className = 'password-match-feedback';
      matchEl.innerHTML = '';
      if (confirmInput.classList.contains('has-error') && errorEl) {
        showFieldError(errorEl, confirmInput, 'auth.val_passwords_mismatch');
      }
    }
  }

  /**
   * Accessible Show/Hide Password Toggle Controller
   */
  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;

    function refreshAria() {
      const isVisible = input.getAttribute('type') === 'text';
      const isAr = currentLang === 'ar';
      const label = isVisible
        ? (isAr ? 'إخفاء كلمة المرور' : 'Hide password')
        : (isAr ? 'إظهار كلمة المرور' : 'Show password');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const isPass = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPass ? 'text' : 'password');
      const eye = btn.querySelector('.icon-eye');
      const eyeOff = btn.querySelector('.icon-eye-off');
      if (eye && eyeOff) {
        eye.style.display = isPass ? 'none' : 'block';
        eyeOff.style.display = isPass ? 'block' : 'none';
      }
      refreshAria();
      input.focus();
    });

    refreshAria();
  }

  function validateCustomerName(rawVal) {
    const trimmed = (rawVal || '').trim();
    if (!trimmed) {
      return { isValid: false, errorKey: 'auth.val_name_empty' };
    }
    // Accept Arabic and English letters, spaces, hyphens (min 2 chars)
    const nameRegex = /^[\u0600-\u06FFa-zA-Z\s\-']{2,60}$/;
    if (!nameRegex.test(trimmed)) {
      return { isValid: false, errorKey: 'auth.val_name_invalid' };
    }
    return { isValid: true, value: trimmed };
  }

  function validatePhoneNumber(rawVal) {
    const trimmed = (rawVal || '').trim();
    if (!trimmed) {
      return { isValid: false, errorKey: 'auth.val_phone_empty' };
    }
    const normalized = normalizeNumerals(trimmed);
    const clean = normalized.replace(/[\s\-\(\)]/g, '');

    // Egyptian mobile: 010, 011, 012, 015 + 8 digits = 11 digits
    const egRegex = /^01[0125][0-9]{8}$/;
    if (egRegex.test(clean)) return { isValid: true, value: clean, type: 'eg' };

    // Egyptian intl: +20, 0020, 20
    const egIntlRegex = /^(?:\+20|0020|20)1[0125][0-9]{8}$/;
    if (egIntlRegex.test(clean)) return { isValid: true, value: clean, type: 'eg_intl' };

    // General international phone
    const intlRegex = /^(?:\+|00)[1-9][0-9]{7,14}$/;
    if (intlRegex.test(clean)) return { isValid: true, value: clean, type: 'intl' };

    return { isValid: false, errorKey: 'auth.val_phone_invalid' };
  }

  function validateGovernorate(val) {
    if (!val || val.trim() === '') {
      return { isValid: false, errorKey: 'auth.val_governorate_empty' };
    }
    return { isValid: true, value: val };
  }

  function validateOptionalEmail(rawVal) {
    const trimmed = (rawVal || '').trim();
    // Email is optional: empty is valid!
    if (!trimmed) {
      return { isValid: true, value: '', isEmpty: true };
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (emailRegex.test(trimmed)) {
      return { isValid: true, value: trimmed, isEmpty: false };
    }
    return { isValid: false, errorKey: 'auth.val_email_invalid' };
  }

  function validateIdentifier(rawVal) {
    const trimmed = (rawVal || '').trim();
    if (!trimmed) {
      return { isValid: false, errorKey: 'auth.val_identifier_empty', type: 'empty' };
    }

    const normalized = normalizeNumerals(trimmed);

    if (normalized.includes('@') || /[a-zA-Z]/.test(normalized)) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      if (emailRegex.test(normalized)) {
        return { isValid: true, type: 'email', value: normalized };
      }
      return { isValid: false, errorKey: 'auth.val_identifier_invalid', type: 'email' };
    }

    const cleanPhone = normalized.replace(/[\s\-\(\)]/g, '');
    const egLocalRegex = /^01[0125][0-9]{8}$/;
    if (egLocalRegex.test(cleanPhone)) return { isValid: true, type: 'phone_egypt', value: cleanPhone };

    const egIntlRegex = /^(?:\+20|0020|20)1[0125][0-9]{8}$/;
    if (egIntlRegex.test(cleanPhone)) return { isValid: true, type: 'phone_egypt_intl', value: cleanPhone };

    const intlPhoneRegex = /^(?:\+|00)[1-9][0-9]{7,14}$/;
    if (intlPhoneRegex.test(cleanPhone)) return { isValid: true, type: 'phone_intl', value: cleanPhone };

    const genericDigitsRegex = /^[0-9]{8,15}$/;
    if (genericDigitsRegex.test(cleanPhone)) return { isValid: true, type: 'phone_generic', value: cleanPhone };

    return { isValid: false, errorKey: 'auth.val_identifier_invalid', type: 'invalid' };
  }

  function validatePassword(rawPass) {
    if (!rawPass || !rawPass.trim()) {
      return { isValid: false, errorKey: 'auth.val_password_empty' };
    }
    return { isValid: true };
  }

  function showFieldError(containerEl, inputEl, errorKey) {
    if (!containerEl) return;
    const dict = translations[currentLang] || fallbackDict[currentLang];
    const text = getTranslation(errorKey, dict);
    containerEl.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${text}</span>
    `;
    containerEl.classList.add('is-visible');
    if (inputEl) inputEl.classList.add('has-error');
  }

  function clearFieldError(containerEl, inputEl) {
    if (containerEl) {
      containerEl.innerHTML = '';
      containerEl.classList.remove('is-visible');
    }
    if (inputEl) inputEl.classList.remove('has-error');
  }

  function showStatusAlert(type, titleKey, descKeyOrText) {
    if (!authStatusBox) return;
    const dict = translations[currentLang] || fallbackDict[currentLang];
    const title = getTranslation(titleKey, dict);
    const desc = descKeyOrText.startsWith('auth.') ? getTranslation(descKeyOrText, dict) : descKeyOrText;

    authStatusBox.className = `auth-status-alert ${type} is-visible`;
    authStatusBox.innerHTML = `
      <div class="auth-status-title">${title}</div>
      <div>${desc}</div>
    `;
    authStatusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearStatusAlert() {
    if (!authStatusBox) return;
    authStatusBox.className = 'auth-status-alert';
    authStatusBox.innerHTML = '';
  }

  /**
   * Extensible Backend Integration Hooks
   */
  async function performAuthentication(credentials) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: false,
      isBackendAwaiting: true,
      noticeTitleKey: 'auth.val_backend_notice_title',
      noticeDescKey: 'auth.val_backend_notice_desc'
    };
  }

  async function performCustomerRegistration(customerData) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      isBackendAwaiting: true,
      noticeTitleKey: 'auth.customer_reg_notice_title',
      noticeDescKey: 'auth.customer_reg_notice_desc'
    };
  }

  async function performCompanyRegistration(companyData) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      isBackendAwaiting: true,
      noticeTitleKey: 'auth.company_reg_notice_title',
      noticeDescKey: 'auth.company_reg_notice_desc'
    };
  }

  function validateCompanyName(name) {
    if (!name || !name.trim()) {
      return { isValid: false, errorKey: 'auth.val_company_name_empty' };
    }
    const clean = name.trim();
    if (clean.length < 2) {
      return { isValid: false, errorKey: 'auth.val_company_name_invalid' };
    }
    return { isValid: true, value: clean };
  }

  function validateResponsiblePerson(name) {
    if (!name || !name.trim()) {
      return { isValid: false, errorKey: 'auth.val_responsible_empty' };
    }
    const clean = name.trim();
    if (clean.length < 2) {
      return { isValid: false, errorKey: 'auth.val_responsible_invalid' };
    }
    return { isValid: true, value: clean };
  }

  function validateCompanyPhone(phone) {
    if (!phone || !phone.trim()) {
      return { isValid: false, errorKey: 'auth.val_company_phone_empty' };
    }
    const normalized = normalizeNumerals(phone.trim());
    const digitsOnly = normalized.replace(/[\s\-\(\)\.]/g, '');
    const phoneRegex = /^(\+20|0020|20)?0?(1[0125][0-9]{8}|[23][0-9]{7,8}|[4-9][0-9]{6,7})$|^(\+[1-9]{1}[0-9]{7,14})$/;
    if (!phoneRegex.test(digitsOnly) && digitsOnly.length < 7) {
      return { isValid: false, errorKey: 'auth.val_company_phone_invalid' };
    }
    return { isValid: true, value: digitsOnly };
  }

  async function handleCompanyRegisterSubmit(e) {
    e.preventDefault();
    clearStatusAlert();

    const companyNameVal = companyNameInput ? companyNameInput.value : '';
    const responsibleVal = responsiblePersonInput ? responsiblePersonInput.value : '';
    const phoneVal = companyPhoneInput ? companyPhoneInput.value : '';
    const govVal = companyGovernorateSelect ? companyGovernorateSelect.value : '';
    const licenseVal = licenseNumberInput ? licenseNumberInput.value : '';
    const emailVal = companyEmailInput ? companyEmailInput.value : '';
    const notesVal = companyNotesInput ? companyNotesInput.value : '';
    const passVal = companyPasswordInput ? companyPasswordInput.value : '';
    const confirmVal = companyConfirmPasswordInput ? companyConfirmPasswordInput.value : '';

    const nameCheck = validateCompanyName(companyNameVal);
    const responsibleCheck = validateResponsiblePerson(responsibleVal);
    const phoneCheck = validateCompanyPhone(phoneVal);
    const govCheck = validateGovernorate(govVal);
    const emailCheck = validateOptionalEmail(emailVal);
    const passCriteria = checkPasswordCriteria(passVal);

    let hasErrors = false;
    let passValid = false;
    let confirmValid = false;

    if (!nameCheck.isValid) {
      showFieldError(companyNameError, companyNameInput, nameCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(companyNameError, companyNameInput);
    }

    if (!responsibleCheck.isValid) {
      showFieldError(responsiblePersonError, responsiblePersonInput, responsibleCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(responsiblePersonError, responsiblePersonInput);
    }

    if (!phoneCheck.isValid) {
      showFieldError(companyPhoneError, companyPhoneInput, phoneCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(companyPhoneError, companyPhoneInput);
    }

    if (!govCheck.isValid) {
      showFieldError(companyGovernorateError, companyGovernorateSelect, govCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(companyGovernorateError, companyGovernorateSelect);
    }

    if (!emailCheck.isValid) {
      showFieldError(companyEmailError, companyEmailInput, emailCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(companyEmailError, companyEmailInput);
    }

    if (!passVal) {
      showFieldError(companyPasswordError, companyPasswordInput, 'auth.val_password_empty');
      hasErrors = true;
    } else if (!isPasswordCriteriaSatisfied(passCriteria)) {
      showFieldError(companyPasswordError, companyPasswordInput, 'auth.val_password_incomplete');
      hasErrors = true;
    } else {
      clearFieldError(companyPasswordError, companyPasswordInput);
      passValid = true;
    }

    if (!confirmVal) {
      showFieldError(companyConfirmPasswordError, companyConfirmPasswordInput, 'auth.val_confirm_password_empty');
      hasErrors = true;
    } else if (confirmVal !== passVal) {
      showFieldError(companyConfirmPasswordError, companyConfirmPasswordInput, 'auth.val_passwords_mismatch');
      hasErrors = true;
    } else {
      clearFieldError(companyConfirmPasswordError, companyConfirmPasswordInput);
      confirmValid = true;
    }

    if (hasErrors) {
      if (!nameCheck.isValid && companyNameInput) companyNameInput.focus();
      else if (!responsibleCheck.isValid && responsiblePersonInput) responsiblePersonInput.focus();
      else if (!phoneCheck.isValid && companyPhoneInput) companyPhoneInput.focus();
      else if (!govCheck.isValid && companyGovernorateSelect) companyGovernorateSelect.focus();
      else if (!emailCheck.isValid && companyEmailInput) companyEmailInput.focus();
      else if (!passValid && companyPasswordInput) companyPasswordInput.focus();
      else if (!confirmValid && companyConfirmPasswordInput) companyConfirmPasswordInput.focus();
      return;
    }

    // Submit Loading State
    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('disabled', 'true');
    const submitTextEl = submitBtn.querySelector('.btn-text');
    const dict = translations[currentLang] || fallbackDict[currentLang];
    const prevText = submitTextEl ? submitTextEl.textContent : '';
    if (submitTextEl) {
      submitTextEl.textContent = getTranslation('auth.submitting_application_btn', dict);
    }

    try {
      const result = await performCompanyRegistration({
        companyName: nameCheck.value,
        responsiblePerson: responsibleCheck.value,
        phone: phoneCheck.value,
        governorate: govCheck.value,
        licenseNumber: licenseVal.trim() || null,
        email: emailCheck.value || null,
        notes: notesVal.trim() || null,
        password: passVal
      });

      if (result.isBackendAwaiting) {
        showStatusAlert('info', result.noticeTitleKey, result.noticeDescKey);
      } else if (result.success) {
        showStatusAlert('success', 'auth.company_reg_heading', 'تم استلام طلب انضمام شركتكم بنجاح.');
      }
    } catch (err) {
      showStatusAlert('error', 'auth.val_network_error', 'auth.val_network_error');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.removeAttribute('disabled');
      if (submitTextEl) {
        submitTextEl.textContent = prevText || getTranslation('auth.submit_application_btn', dict);
      }
    }
  }

  /**
   * Handle Customer Registration Form Submit
   */
  async function handleCustomerRegisterSubmit(e) {
    e.preventDefault();
    clearStatusAlert();

    const nameVal = customerNameInput ? customerNameInput.value : '';
    const phoneVal = customerPhoneInput ? customerPhoneInput.value : '';
    const govVal = customerGovernorateSelect ? customerGovernorateSelect.value : '';
    const emailVal = customerEmailInput ? customerEmailInput.value : '';
    const passVal = customerPasswordInput ? customerPasswordInput.value : '';
    const confirmVal = customerConfirmPasswordInput ? customerConfirmPasswordInput.value : '';

    const nameCheck = validateCustomerName(nameVal);
    const phoneCheck = validatePhoneNumber(phoneVal);
    const govCheck = validateGovernorate(govVal);
    const emailCheck = validateOptionalEmail(emailVal);
    const passCriteria = checkPasswordCriteria(passVal);

    let hasErrors = false;
    let passValid = false;
    let confirmValid = false;

    if (!nameCheck.isValid) {
      showFieldError(nameError, customerNameInput, nameCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(nameError, customerNameInput);
    }

    if (!phoneCheck.isValid) {
      showFieldError(phoneError, customerPhoneInput, phoneCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(phoneError, customerPhoneInput);
    }

    if (!govCheck.isValid) {
      showFieldError(governorateError, customerGovernorateSelect, govCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(governorateError, customerGovernorateSelect);
    }

    if (!emailCheck.isValid) {
      showFieldError(emailError, customerEmailInput, emailCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(emailError, customerEmailInput);
    }

    if (!passVal) {
      showFieldError(customerPasswordError, customerPasswordInput, 'auth.val_password_empty');
      hasErrors = true;
    } else if (!isPasswordCriteriaSatisfied(passCriteria)) {
      showFieldError(customerPasswordError, customerPasswordInput, 'auth.val_password_incomplete');
      hasErrors = true;
    } else {
      clearFieldError(customerPasswordError, customerPasswordInput);
      passValid = true;
    }

    if (!confirmVal) {
      showFieldError(customerConfirmPasswordError, customerConfirmPasswordInput, 'auth.val_confirm_password_empty');
      hasErrors = true;
    } else if (confirmVal !== passVal) {
      showFieldError(customerConfirmPasswordError, customerConfirmPasswordInput, 'auth.val_passwords_mismatch');
      hasErrors = true;
    } else {
      clearFieldError(customerConfirmPasswordError, customerConfirmPasswordInput);
      confirmValid = true;
    }

    if (hasErrors) {
      if (!nameCheck.isValid && customerNameInput) customerNameInput.focus();
      else if (!phoneCheck.isValid && customerPhoneInput) customerPhoneInput.focus();
      else if (!govCheck.isValid && customerGovernorateSelect) customerGovernorateSelect.focus();
      else if (!emailCheck.isValid && customerEmailInput) customerEmailInput.focus();
      else if (!passValid && customerPasswordInput) customerPasswordInput.focus();
      else if (!confirmValid && customerConfirmPasswordInput) customerConfirmPasswordInput.focus();
      return;
    }

    // Submit Loading State
    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('disabled', 'true');
    const submitTextEl = submitBtn.querySelector('.btn-text');
    const dict = translations[currentLang] || fallbackDict[currentLang];
    const prevText = submitTextEl ? submitTextEl.textContent : '';
    if (submitTextEl) {
      submitTextEl.textContent = getTranslation('auth.continuing_btn', dict);
    }

    try {
      const { redirect, trip, programId } = getUrlParams();
      const result = await performCustomerRegistration({
        name: nameCheck.value,
        phone: phoneCheck.value,
        governorate: govCheck.value,
        email: emailCheck.value,
        password: passVal,
        programId: programId || null,
        tripType: trip || null
      });

      if (result.isBackendAwaiting) {
        showStatusAlert('info', result.noticeTitleKey, result.noticeDescKey);
      } else if (result.success) {
        showStatusAlert('success', 'auth.register_heading', 'تم حفظ بياناتك بنجاح.');
      }
    } catch (err) {
      showStatusAlert('error', 'auth.val_network_error', 'auth.val_network_error');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.removeAttribute('disabled');
      if (submitTextEl) {
        submitTextEl.textContent = prevText || getTranslation('auth.continue_btn', dict);
      }
    }
  }

  /**
   * Handle Login Form Submit
   */
  async function handleLoginSubmit(e) {
    e.preventDefault();
    clearStatusAlert();

    const idVal = identifierInput ? identifierInput.value : '';
    const passVal = passwordInput ? passwordInput.value : '';

    const idCheck = validateIdentifier(idVal);
    const passCheck = validatePassword(passVal);

    let hasErrors = false;

    if (!idCheck.isValid) {
      showFieldError(identifierError, identifierInput, idCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(identifierError, identifierInput);
    }

    if (!passCheck.isValid) {
      showFieldError(passwordError, passwordInput, passCheck.errorKey);
      hasErrors = true;
    } else {
      clearFieldError(passwordError, passwordInput);
    }

    if (hasErrors) {
      if (!idCheck.isValid && identifierInput) identifierInput.focus();
      else if (!passCheck.isValid && passwordInput) passwordInput.focus();
      return;
    }

    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('disabled', 'true');
    const submitTextEl = submitBtn.querySelector('.btn-text');
    const dict = translations[currentLang] || fallbackDict[currentLang];
    const prevText = submitTextEl ? submitTextEl.textContent : '';
    if (submitTextEl) {
      submitTextEl.textContent = getTranslation('auth.signing_in_btn', dict);
    }

    try {
      const result = await performAuthentication({
        value: idCheck.value,
        type: idCheck.type,
        password: passVal
      });

      if (result.success) {
        showStatusAlert('success', 'auth.login_heading', 'تم تسجيل الدخول بنجاح.');
      } else if (result.isBackendAwaiting) {
        showStatusAlert('info', result.noticeTitleKey, result.noticeDescKey);
      } else {
        showStatusAlert('error', 'auth.val_invalid_credentials', result.errorKey || 'auth.val_invalid_credentials');
      }
    } catch (err) {
      showStatusAlert('error', 'auth.val_network_error', 'auth.val_network_error');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.removeAttribute('disabled');
      if (submitTextEl) {
        submitTextEl.textContent = prevText || getTranslation('auth.sign_in_btn', dict);
      }
    }
  }

  // Realtime Input Listeners
  function initInputListeners() {
    if (identifierInput) {
      identifierInput.addEventListener('input', () => {
        if (identifierInput.classList.contains('has-error')) clearFieldError(identifierError, identifierInput);
      });
    }
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('has-error')) clearFieldError(passwordError, passwordInput);
      });
    }
    if (customerNameInput) {
      customerNameInput.addEventListener('input', () => {
        if (customerNameInput.classList.contains('has-error')) clearFieldError(nameError, customerNameInput);
      });
    }
    if (customerPhoneInput) {
      customerPhoneInput.addEventListener('input', () => {
        if (customerPhoneInput.classList.contains('has-error')) clearFieldError(phoneError, customerPhoneInput);
      });
    }
    if (customerGovernorateSelect) {
      customerGovernorateSelect.addEventListener('change', () => {
        if (customerGovernorateSelect.classList.contains('has-error')) clearFieldError(governorateError, customerGovernorateSelect);
      });
    }
    if (customerEmailInput) {
      customerEmailInput.addEventListener('input', () => {
        if (customerEmailInput.classList.contains('has-error')) clearFieldError(emailError, customerEmailInput);
      });
    }

    // Customer Registration Password Listeners
    if (customerPasswordInput) {
      customerPasswordInput.addEventListener('input', () => {
        const criteria = checkPasswordCriteria(customerPasswordInput.value);
        updatePasswordChecklistUI(customerPasswordChecklist, criteria);
        if (customerPasswordInput.classList.contains('has-error')) {
          if (isPasswordCriteriaSatisfied(criteria)) {
            clearFieldError(customerPasswordError, customerPasswordInput);
          }
        }
        if (customerConfirmPasswordInput && customerConfirmPasswordInput.value) {
          updateConfirmFeedback(customerPasswordInput, customerConfirmPasswordInput, customerPasswordMatch, customerConfirmPasswordError);
        }
      });
    }
    if (customerConfirmPasswordInput) {
      customerConfirmPasswordInput.addEventListener('input', () => {
        updateConfirmFeedback(customerPasswordInput, customerConfirmPasswordInput, customerPasswordMatch, customerConfirmPasswordError);
      });
    }

    // Company Registration Input Listeners
    if (companyNameInput) {
      companyNameInput.addEventListener('input', () => {
        if (companyNameInput.classList.contains('has-error')) clearFieldError(companyNameError, companyNameInput);
      });
    }
    if (responsiblePersonInput) {
      responsiblePersonInput.addEventListener('input', () => {
        if (responsiblePersonInput.classList.contains('has-error')) clearFieldError(responsiblePersonError, responsiblePersonInput);
      });
    }
    if (companyPhoneInput) {
      companyPhoneInput.addEventListener('input', () => {
        if (companyPhoneInput.classList.contains('has-error')) clearFieldError(companyPhoneError, companyPhoneInput);
      });
    }
    if (companyGovernorateSelect) {
      companyGovernorateSelect.addEventListener('change', () => {
        if (companyGovernorateSelect.classList.contains('has-error')) clearFieldError(companyGovernorateError, companyGovernorateSelect);
      });
    }
    if (companyEmailInput) {
      companyEmailInput.addEventListener('input', () => {
        if (companyEmailInput.classList.contains('has-error')) clearFieldError(companyEmailError, companyEmailInput);
      });
    }

    // Company Registration Password Listeners
    if (companyPasswordInput) {
      companyPasswordInput.addEventListener('input', () => {
        const criteria = checkPasswordCriteria(companyPasswordInput.value);
        updatePasswordChecklistUI(companyPasswordChecklist, criteria);
        if (companyPasswordInput.classList.contains('has-error')) {
          if (isPasswordCriteriaSatisfied(criteria)) {
            clearFieldError(companyPasswordError, companyPasswordInput);
          }
        }
        if (companyConfirmPasswordInput && companyConfirmPasswordInput.value) {
          updateConfirmFeedback(companyPasswordInput, companyConfirmPasswordInput, companyPasswordMatch, companyConfirmPasswordError);
        }
      });
    }
    if (companyConfirmPasswordInput) {
      companyConfirmPasswordInput.addEventListener('input', () => {
        updateConfirmFeedback(companyPasswordInput, companyConfirmPasswordInput, companyPasswordMatch, companyConfirmPasswordError);
      });
    }
  }

  function initEvents() {
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

    // Password Visibility Toggles
    if (passwordToggleBtn && passwordInput) {
      setupPasswordToggle(passwordToggleBtn, passwordInput);
    }
    if (customerPasswordToggleBtn && customerPasswordInput) {
      setupPasswordToggle(customerPasswordToggleBtn, customerPasswordInput);
    }
    if (customerConfirmPasswordToggleBtn && customerConfirmPasswordInput) {
      setupPasswordToggle(customerConfirmPasswordToggleBtn, customerConfirmPasswordInput);
    }
    if (companyPasswordToggleBtn && companyPasswordInput) {
      setupPasswordToggle(companyPasswordToggleBtn, companyPasswordInput);
    }
    if (companyConfirmPasswordToggleBtn && companyConfirmPasswordInput) {
      setupPasswordToggle(companyConfirmPasswordToggleBtn, companyConfirmPasswordInput);
    }

    if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
    if (customerRegisterForm) customerRegisterForm.addEventListener('submit', handleCustomerRegisterSubmit);
    if (companyRegisterForm) companyRegisterForm.addEventListener('submit', handleCompanyRegisterSubmit);
    initRequiredTooltips();
    initInputListeners();
  }

  async function init() {
    applyTheme(currentTheme);
    initEvents();
    await applyTranslations(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
