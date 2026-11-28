/* ==========================================================================
   Miqat Admin Control Center — Interconnected Mock Data & Query Selectors
   NOTE: Prototype mock data only. Zero financial aggregates or balances.
   ========================================================================== */
(function () {
  'use strict';

  var PERMISSIONS_CONTEXT = {
    roleLabelAr: 'المالك / مدير النظام',
    roleLabelEn: 'System Owner / Super Admin',
    canApproveCompanies: true,
    canManageSecurity: true,
    canShareSavedFilters: true
  };

  var ACCOUNTS_SHARED = {
    id: 'ACC-SHARED-01',
    name_ar: 'حساب إدارة الحسابات المشترك',
    name_en: 'Shared Accounts Desk',
    active_operators_approx: 3,
    is_shared_account: true,
    attribution_note_ar: 'تعمل إدارة الحسابات حالياً بحساب واحد مشترك (~٣ موظفين)، لذا لا تُنسب العمليات لموظف فردي.',
    attribution_note_en: 'Accounts operates via one shared account (~3 staff); individual operator attribution is unavailable.',
    status: 'online',
    shift_window: '09:00 – 17:00',
    work_duration_min: 315,
    last_activity_at: '2026-11-28T09:18:00.000Z',
    operations_executed: 42,
    submitted_for_review: 6,
    approved_ops: 34,
    returned_ops: 2,
    avg_processing_min: 19,
    first_response_min: 7,
    overdue_requests: 1,
    errors_and_corrections: 2
  };

  var SALES_EMPLOYEES = [
    {
      id: 'EMP-SLS-01',
      name_ar: 'أحمد صبري',
      name_en: 'Ahmed Sabry',
      status: 'online',
      worked_min: 340,
      shift_completion_pct: 71,
      idle_min: 14,
      contacted_customers: 18,
      calls_count: 14,
      call_duration_min: 68,
      bookings: 7,
      completed_contracts: 5,
      conversion_pct: 27.8,
      target_achievement_pct: 84,
      followup_punctuality_pct: 92,
      avg_response_min: 6,
      overdue_followups: 1,
      operational_errors: 0,
      last_activity_at: '2026-11-28T09:30:00.000Z',
      latest_interaction_ar: 'مراجعة عقد عمرة رجب للعميل محمود عبد الفتاح',
      latest_interaction_en: 'Reviewed Rajab Umrah contract for Mahmoud Abdel Fattah'
    },
    {
      id: 'EMP-SLS-02',
      name_ar: 'سارة منصور',
      name_en: 'Sara Mansour',
      status: 'on_break',
      worked_min: 310,
      shift_completion_pct: 65,
      idle_min: 18,
      contacted_customers: 21,
      calls_count: 19,
      call_duration_min: 82,
      bookings: 9,
      completed_contracts: 7,
      conversion_pct: 33.3,
      target_achievement_pct: 91,
      followup_punctuality_pct: 96,
      avg_response_min: 4,
      overdue_followups: 0,
      operational_errors: 0,
      last_activity_at: '2026-11-28T09:12:00.000Z',
      latest_interaction_ar: 'تأكيد حجوزات باقة شعبان ٥ نجوم',
      latest_interaction_en: 'Confirmed Shaban 5-Star Umrah bookings'
    },
    {
      id: 'EMP-SLS-03',
      name_ar: 'عمر طارق',
      name_en: 'Omar Tarek',
      status: 'offline',
      worked_min: 165,
      shift_completion_pct: 34,
      idle_min: 48,
      contacted_customers: 9,
      calls_count: 6,
      call_duration_min: 24,
      bookings: 2,
      completed_contracts: 1,
      conversion_pct: 11.1,
      target_achievement_pct: 41,
      followup_punctuality_pct: 68,
      avg_response_min: 19,
      overdue_followups: 4,
      operational_errors: 2,
      last_activity_at: '2026-11-28T07:05:00.000Z',
      latest_interaction_ar: 'متابعة متأخرة للعميل إيهاب فاروق',
      latest_interaction_en: 'Overdue follow-up for Ehab Farouk'
    }
  ];

  var COMPANIES = [
    { id: 'CMP-NOUR', name_ar: 'شركة النور للسياحة الدينية', name_en: 'Al-Nour Religious Travel', status: 'active', programs_count: 2, bookings: 76, completed_contracts: 60, conversion_pct: 78.9, response_sla_min: 18, stale_data: false, city_ar: 'القاهرة', city_en: 'Cairo' },
    { id: 'CMP-RAHMA', name_ar: 'شركة الرحمة للحج والعمرة', name_en: 'Al-Rahma Hajj & Umrah', status: 'active', programs_count: 2, bookings: 27, completed_contracts: 21, conversion_pct: 77.8, response_sla_min: 24, stale_data: false, city_ar: 'الجيزة', city_en: 'Giza' },
    { id: 'CMP-MARWA', name_ar: 'شركة المروة للسياحة', name_en: 'Al-Marwa Travel', status: 'active', programs_count: 1, bookings: 20, completed_contracts: 11, conversion_pct: 55.0, response_sla_min: 52, stale_data: true, city_ar: 'الإسكندرية', city_en: 'Alexandria' },
    { id: 'CMP-SAFWA', name_ar: 'شركة الصفوة لكبار الشخصيات', name_en: 'Al-Safwa VIP Tours', status: 'suspended', programs_count: 1, bookings: 13, completed_contracts: 10, conversion_pct: 76.9, response_sla_min: 68, stale_data: true, city_ar: 'القاهرة', city_en: 'Cairo' },
    { id: 'CMP-APP-01', name_ar: 'شركة الهدى للسياحة', name_en: 'Al-Huda Tourism', status: 'pending_application', programs_count: 0, bookings: 0, completed_contracts: 0, conversion_pct: 0, response_sla_min: null, stale_data: false, city_ar: 'المنصورة', city_en: 'Mansoura' },
    { id: 'CMP-REJ-01', name_ar: 'شركة الأفق للسفريات', name_en: 'Al-Ofoq Travel', status: 'rejected', programs_count: 0, bookings: 0, completed_contracts: 0, conversion_pct: 0, response_sla_min: null, stale_data: false, city_ar: 'طنطا', city_en: 'Tanta' }
  ];

  var CUSTOMERS = [
    { id: 'CUS-D-101', name_ar: 'محمود عبد الفتاح', name_en: 'Mahmoud Abdel Fattah', stage: 'contract_completed', gov: 'cairo', company_id: 'CMP-NOUR', employee_id: 'EMP-SLS-01', program_ar: 'عمرة رجب المميزة', program_en: 'Elite Rajab Umrah', payment_incomplete: false, updated_at: '2026-11-28T08:50:00.000Z' },
    { id: 'CUS-D-102', name_ar: 'سلوى حسن محمود', name_en: 'Salwa Hassan Mahmoud', stage: 'contract_completed', gov: 'cairo', company_id: 'CMP-RAHMA', employee_id: 'EMP-SLS-02', program_ar: 'حج ٢٠٢٦ الاقتصادي', program_en: 'Economy Hajj 2026', payment_incomplete: false, updated_at: '2026-11-28T08:10:00.000Z' },
    { id: 'CUS-D-103', name_ar: 'كريم عادل السيد', name_en: 'Karim Adel El-Sayed', stage: 'booked', gov: 'alexandria', company_id: 'CMP-NOUR', employee_id: 'EMP-SLS-02', program_ar: 'عمرة شعبان ٥ نجوم', program_en: 'Shaban 5-Star Umrah', payment_incomplete: true, updated_at: '2026-11-28T07:40:00.000Z' },
    { id: 'CUS-D-104', name_ar: 'إيهاب فاروق', name_en: 'Ehab Farouk', stage: 'follow_up', gov: 'giza', company_id: 'CMP-MARWA', employee_id: 'EMP-SLS-03', program_ar: 'باقة رمضان العائلية', program_en: 'Ramadan Family Package', payment_incomplete: false, updated_at: '2026-11-28T06:20:00.000Z' },
    { id: 'CUS-D-105', name_ar: 'منى عبد العزيز', name_en: 'Mona Abdel Aziz', stage: 'contacted', gov: 'cairo', company_id: 'CMP-RAHMA', employee_id: 'EMP-SLS-01', program_ar: 'عمرة رجب المميزة', program_en: 'Elite Rajab Umrah', payment_incomplete: false, updated_at: '2026-11-28T05:50:00.000Z' },
    { id: 'CUS-D-106', name_ar: 'ياسر فتحي', name_en: 'Yasser Fathi', stage: 'new', gov: 'dakahlia', company_id: 'CMP-NOUR', employee_id: 'EMP-SLS-01', program_ar: 'عمرة شعبان الاقتصادية', program_en: 'Economy Shaban Umrah', payment_incomplete: false, updated_at: '2026-11-28T09:15:00.000Z' },
    { id: 'CUS-D-107', name_ar: 'هدى إبراهيم', name_en: 'Hoda Ibrahim', stage: 'not_contacted', gov: 'giza', company_id: 'CMP-MARWA', employee_id: 'EMP-SLS-03', program_ar: 'باقة رمضان العائلية', program_en: 'Ramadan Family Package', payment_incomplete: false, updated_at: '2026-11-28T09:05:00.000Z' },
    { id: 'CUS-D-108', name_ar: 'طارق جمال', name_en: 'Tarek Gamal', stage: 'cancelled', gov: 'alexandria', company_id: 'CMP-SAFWA', employee_id: 'EMP-SLS-03', program_ar: 'عمرة VIP المباشرة', program_en: 'Direct VIP Umrah', payment_incomplete: false, updated_at: '2026-11-27T19:00:00.000Z' }
  ];

  var EMP_TO_COMPANY_REQUESTS = [
    { id: 'REQ-401', employee_id: 'EMP-SLS-01', customer_id: 'CUS-D-104', company_id: 'CMP-MARWA', subject_ar: 'تأكيد إتاحة غرف فندقية قريبة من الحرم', subject_en: 'Confirm Haram-view room availability', status: 'overdue', wait_hours: 19, created_at: '2026-11-27T14:00:00.000Z' },
    { id: 'REQ-402', employee_id: 'EMP-SLS-02', customer_id: 'CUS-D-103', company_id: 'CMP-NOUR', subject_ar: 'مراجعة موعد الطيران لباقة شعبان', subject_en: 'Verify Shaban flight schedule', status: 'converted', wait_hours: 2, created_at: '2026-11-28T07:10:00.000Z' },
    { id: 'REQ-403', employee_id: 'EMP-SLS-01', customer_id: 'CUS-D-105', company_id: 'CMP-RAHMA', subject_ar: 'تعديل طلب برنامج عمرة رجب', subject_en: 'Modify Rajab Umrah program request', status: 'replied', wait_hours: 4, created_at: '2026-11-28T05:30:00.000Z' },
    { id: 'REQ-404', employee_id: 'EMP-SLS-03', customer_id: 'CUS-D-107', company_id: 'CMP-MARWA', subject_ar: 'استفسار تأشيرة عمرة عائلية', subject_en: 'Family Umrah visa inquiry', status: 'unanswered', wait_hours: 11, created_at: '2026-11-27T22:00:00.000Z' },
    { id: 'REQ-405', employee_id: 'EMP-SLS-02', customer_id: 'CUS-D-106', company_id: 'CMP-NOUR', subject_ar: 'حجز مبدئي لباقة اقتصادية', subject_en: 'Initial hold for economy package', status: 'new', wait_hours: 1, created_at: '2026-11-28T08:40:00.000Z' }
  ];

  var ACTION_CENTER_ITEMS = [
    {
      id: 'ACT-01', category: 'company_application', severity: 'high', status: 'pending',
      title_ar: 'طلب انضمام شركة جديدة: شركة الهدى للسياحة', title_en: 'New Company Application: Al-Huda Tourism',
      reason_ar: 'بانتظار مراجعة السجل التجاري والترخيص السياحي', reason_en: 'Awaiting commercial registry & tourism license review',
      wait_label_ar: 'منذ ١٤ ساعة', wait_label_en: 'Waiting 14h',
      impact_ar: 'إضافة ٣ برامج عمرة جديدة', impact_en: 'Unlocks 3 new Umrah programs',
      owner_ar: 'المالك / الإدارة', owner_en: 'Owner / Admin',
      entity_type: 'company', entity_id: 'CMP-APP-01'
    },
    {
      id: 'ACT-02', category: 'overdue_request', severity: 'critical', status: 'pending',
      title_ar: 'تجاوز SLA الرد: طلب REQ-401 لدى شركة المروة', title_en: 'SLA Breach: Request REQ-401 at Al-Marwa Travel',
      reason_ar: 'لم ترد الشركة منذ ١٩ ساعة على طلب حجز مؤكد', reason_en: 'Partner has not replied for 19h on confirmed hold',
      wait_label_ar: '١٩ ساعة', wait_label_en: '19h overdue',
      impact_ar: 'احتمالية فقدان عميل مؤهل', impact_en: 'Risk of losing qualified customer',
      owner_ar: 'متابعة الشركاء / المبيعات', owner_en: 'Partner Ops / Sales',
      entity_type: 'request', entity_id: 'REQ-401'
    },
    {
      id: 'ACT-03', category: 'security_alert', severity: 'critical', status: 'pending',
      title_ar: 'محاولات دخول متكررة فاشلة (محاكاة أمان)', title_en: 'Repeated Failed Login Attempts (Security Sim)',
      reason_ar: '٥ محاولات غير ناجحة من عنوان IP خارجي — لم يتم الحظر تلقائياً', reason_en: '5 failed attempts from external IP — no auto-block taken',
      wait_label_ar: 'منذ ٣٥ دقيقة', wait_label_en: '35m ago',
      impact_ar: 'حماية بوابة الإدارة', impact_en: 'Admin portal protection',
      owner_ar: 'أمان النظام', owner_en: 'System Security',
      entity_type: 'incident', entity_id: 'INC-901'
    },
    {
      id: 'ACT-04', category: 'approval', severity: 'medium', status: 'pending',
      title_ar: 'اعتماد عملية مراجعة من حساب الحسابات المشترك', title_en: 'Approve Review Batch from Shared Accounts Desk',
      reason_ar: 'دفعة مراجعة تشغيلية مرفوعة من الفريق المشترك', reason_en: 'Operational review batch submitted by shared Accounts desk',
      wait_label_ar: 'منذ ٣ ساعات', wait_label_en: 'Waiting 3h',
      impact_ar: 'استكمال إغلاق ملفات عملاء', impact_en: 'Completes customer file closure',
      owner_ar: 'الإدارة العليا', owner_en: 'Executive Admin',
      entity_type: 'employee', entity_id: 'ACC-SHARED-01'
    }
  ];

  var ACTIVITY_FEED = [
    { id: 'EV-101', actor_ar: 'سارة منصور', actor_en: 'Sara Mansour', dept_ar: 'المبيعات', dept_en: 'Sales', action_ar: 'تحويل طلب REQ-402 إلى حجز مؤكد', action_en: 'Converted REQ-402 to confirmed booking', severity: 'low', status: 'success', source_ar: 'بوابة المبيعات', source_en: 'Sales Portal', timestamp: '2026-11-28T09:20:00.000Z', entity_type: 'request', entity_id: 'REQ-402' },
    { id: 'EV-102', actor_ar: 'حساب الحسابات المشترك', actor_en: 'Shared Accounts Desk', dept_ar: 'الحسابات', dept_en: 'Accounts', action_ar: 'اعتماد مراجعة ملف العميل محمود عبد الفتاح', action_en: 'Approved file review for Mahmoud Abdel Fattah', severity: 'low', status: 'success', source_ar: 'بوابة الحسابات', source_en: 'Accounts Desk', timestamp: '2026-11-28T09:10:00.000Z', entity_type: 'customer', entity_id: 'CUS-D-101' },
    { id: 'EV-103', actor_ar: 'النظام (محاكاة)', actor_en: 'System (Simulated)', dept_ar: 'الأمان', dept_en: 'Security', action_ar: 'رصد ٥ محاولات دخول فاشلة متكررة', action_en: 'Detected 5 repeated failed login attempts', severity: 'critical', status: 'warning', source_ar: 'مراقبة الأمان', source_en: 'Security Monitor', timestamp: '2026-11-28T08:55:00.000Z', entity_type: 'incident', entity_id: 'INC-901' },
    { id: 'EV-104', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', dept_ar: 'المبيعات', dept_en: 'Sales', action_ar: 'تحديث مرحلة العميل منى عبد العزيز إلى تم التواصل', action_en: 'Updated Mona Abdel Aziz stage to Contacted', severity: 'low', status: 'success', source_ar: 'بوابة المبيعات', source_en: 'Sales Portal', timestamp: '2026-11-28T08:40:00.000Z', entity_type: 'customer', entity_id: 'CUS-D-105' },
    { id: 'EV-105', actor_ar: 'عمر طارق', actor_en: 'Omar Tarek', dept_ar: 'المبيعات', dept_en: 'Sales', action_ar: 'تأخر متابعة العميل إيهاب فاروق عن الموعد', action_en: 'Missed scheduled follow-up for Ehab Farouk', severity: 'high', status: 'failed', source_ar: 'جدولة المتابعات', source_en: 'Follow-up Scheduler', timestamp: '2026-11-28T08:15:00.000Z', entity_type: 'customer', entity_id: 'CUS-D-104' },
    { id: 'EV-106', actor_ar: 'شركة المروة للسياحة', actor_en: 'Al-Marwa Travel', dept_ar: 'الشركات', dept_en: 'Partners', action_ar: 'تجاوز SLA الرد على الطلب REQ-401', action_en: 'Exceeded response SLA for REQ-401', severity: 'high', status: 'warning', source_ar: 'بوابة الشركاء', source_en: 'Partner Hub', timestamp: '2026-11-28T07:50:00.000Z', entity_type: 'company', entity_id: 'CMP-MARWA' },
    { id: 'EV-107', actor_ar: 'شركة الهدى للسياحة', actor_en: 'Al-Huda Tourism', dept_ar: 'الشركات', dept_en: 'Partners', action_ar: 'تقديم طلب انضمام جديد للمراجعة', action_en: 'Submitted new partner onboarding application', severity: 'medium', status: 'success', source_ar: 'تسجيل الشركات', source_en: 'Partner Onboarding', timestamp: '2026-11-27T19:30:00.000Z', entity_type: 'company', entity_id: 'CMP-APP-01' },
    { id: 'EV-108', actor_ar: 'حساب الحسابات المشترك', actor_en: 'Shared Accounts Desk', dept_ar: 'الحسابات', dept_en: 'Accounts', action_ar: 'إعادة عملية تصحيح بيانات حجز CUS-D-103', action_en: 'Returned booking record CUS-D-103 for correction', severity: 'medium', status: 'warning', source_ar: 'بوابة الحسابات', source_en: 'Accounts Desk', timestamp: '2026-11-27T18:10:00.000Z', entity_type: 'customer', entity_id: 'CUS-D-103' },
    { id: 'EV-109', actor_ar: 'سارة منصور', actor_en: 'Sara Mansour', dept_ar: 'المبيعات', dept_en: 'Sales', action_ar: 'إتمام عقد حج ٢٠٢٦ الاقتصادي للعميلة سلوى حسن', action_en: 'Completed Economy Hajj 2026 contract for Salwa Hassan', severity: 'low', status: 'success', source_ar: 'بوابة المبيعات', source_en: 'Sales Portal', timestamp: '2026-11-27T17:20:00.000Z', entity_type: 'customer', entity_id: 'CUS-D-102' },
    { id: 'EV-110', actor_ar: 'النظام (محاكاة)', actor_en: 'System (Simulated)', dept_ar: 'النسخ الاحتياطي', dept_en: 'Backup', action_ar: 'اكتمال النسخ الاحتياطي المجدول (محاكاة)', action_en: 'Scheduled backup check completed (Simulated)', severity: 'low', status: 'success', source_ar: 'مراقب النسخ', source_en: 'Backup Monitor', timestamp: '2026-11-27T04:00:00.000Z', entity_type: 'incident', entity_id: 'BKP-01' },
    { id: 'EV-111', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', dept_ar: 'المبيعات', dept_en: 'Sales', action_ar: 'تسجيل عميل جديد ياسر فتحي من الدقهلية', action_en: 'Registered new lead Yasser Fathi from Dakahlia', severity: 'low', status: 'success', source_ar: 'بوابة المبيعات', source_en: 'Sales Portal', timestamp: '2026-11-27T15:00:00.000Z', entity_type: 'customer', entity_id: 'CUS-D-106' }
  ];

  var SMART_INSIGHTS = [
    {
      id: 'INS-01', urgency: 'critical',
      title_ar: 'تباطؤ استجابة شركة المروة يهدد التحويل', title_en: 'Al-Marwa Slow Response Threatens Conversion',
      detected_ar: 'ارتفع متوسط الرد إلى ٥٢ دقيقة مع وجود طلب متأخر (REQ-401) منذ ١٩ ساعة.', detected_en: 'Average SLA rose to 52m with REQ-401 overdue by 19h.',
      next_step_ar: 'إرسال تنبيه تصعيد للشريك أو إعادة توزيع الطلب.', next_step_en: 'Send SLA escalation notice or reassign request.'
    },
    {
      id: 'INS-02', urgency: 'high',
      title_ar: 'انخفاض التزام المتابعة لدى موظف مبيعات واحد', title_en: 'Follow-up Punctuality Dip for One Sales Agent',
      detected_ar: 'عمر طارق لديه ٤ متابعات متأخرة ومعدل خمول ٤٨ دقيقة.', detected_en: 'Omar Tarek has 4 overdue follow-ups and 48m idle time.',
      next_step_ar: 'توجيه تذكير متابعة داعم ومراجعة جدول الوردية.', next_step_en: 'Send supportive follow-up reminder and review shift pacing.'
    },
    {
      id: 'INS-03', urgency: 'medium',
      title_ar: 'تحسن ملحوظ في سرعة الإغلاق لدى سارة منصور', title_en: 'Strong Closing Velocity from Sara Mansour',
      detected_ar: 'معدل تحويل ٣٣.٣٪ مع صفر متابعات متأخرة ومتوسط رد ٤ دقائق.', detected_en: '33.3% conversion rate with zero overdue follow-ups and 4m response.',
      next_step_ar: 'توثيق الأداء ضمن إنجازات الأسبوع.', next_step_en: 'Highlight performance in weekly milestones.'
    }
  ];

  var SYSTEM_HEALTH = {
    server: { label_ar: 'الخادم يعمل (محاكاة)', label_en: 'Server Online (Simulated)', latency_ms: 42 },
    database: { label_ar: 'SQLite متصل (محاكاة)', label_en: 'SQLite Connected (Simulated)', latency_ms: 9 },
    api: { label_ar: 'واجهات البرمجة مستقرة (محاكاة)', label_en: 'API Healthy (Simulated)', error_rate_pct: 0.4 },
    external_connections: { label_ar: 'بوابات الشركاء غير متصلة (وضع نموذج)', label_en: 'Partner APIs Disconnected (Prototype)', latency_ms: 0 },
    issues: [
      { id: 'INC-901', severity: 'critical', status: 'investigating', title_ar: 'محاولات دخول فاشلة متكررة (محاكاة)', title_en: 'Repeated Failed Login Attempts (Simulated)', detail_ar: '٥ محاولات من عنوان خارجي بدون حظر تلقائي.', detail_en: '5 external attempts; awaiting manual Admin review.' },
      { id: 'INC-902', severity: 'high', status: 'new', title_ar: 'بطء مزامنة برامج شركة المروة (محاكاة)', title_en: 'Al-Marwa Program Sync Latency (Simulated)', detail_ar: 'بيانات الباقات لم تُحدّث منذ ٧٢ ساعة.', detail_en: 'Package feed stale for 72 hours.' },
      { id: 'INC-903', severity: 'medium', status: 'resolved', title_ar: 'تحذير مؤقت في طابور الإشعارات (محاكاة)', title_en: 'Transient Notification Queue Warning (Simulated)', detail_ar: 'تمت إعادة المحاولة تلقائياً.', detail_en: 'Recovered after automatic retry.' }
    ]
  };

  var BACKUP_PREVIEW = {
    last_successful_at: '2026-11-28T04:00:00.000Z',
    next_scheduled_at: '2026-11-29T04:00:00.000Z',
    status_ar: 'مكتمل (محاكاة)',
    status_en: 'Healthy (Simulated)',
    locations: [
      { name_ar: 'التخزين الأساسي المحلي', name_en: 'Primary Local Vault' },
      { name_ar: 'نسخة خارجية ١ (سحابة)', name_en: 'External Mirror 1 (Cloud)' },
      { name_ar: 'نسخة خارجية ٢ (أرشيف)', name_en: 'External Mirror 2 (Archive)' }
    ]
  };

  var ANALYTICS_SERIES = {
    daily: {
      labels_ar: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      labels_en: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      customers: [6, 9, 8, 12, 11, 14, 10],
      bookings: [3, 4, 5, 6, 5, 8, 6],
      contracts: [2, 3, 4, 5, 4, 6, 5],
      forecast_customers: [null, null, null, null, null, 14, 15]
    },
    weekly: {
      labels_ar: ['الأسبوع ١', 'الأسبوع ٢', 'الأسبوع ٣', 'الأسبوع ٤', 'توقع الأسبوع ٥'],
      labels_en: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Wk 5 Forecast'],
      customers: [22, 28, 31, 36, null],
      bookings: [11, 15, 18, 21, null],
      contracts: [8, 11, 14, 17, null],
      forecast_customers: [null, null, null, 36, 41]
    },
    monthly: {
      labels_ar: ['أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'توقع ديسمبر'],
      labels_en: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec Forecast'],
      customers: [64, 78, 92, 112, null],
      bookings: [31, 40, 49, 62, null],
      contracts: [24, 32, 39, 51, null],
      forecast_customers: [null, null, null, 112, 128]
    }
  };

  var MILESTONES = {
    daily_highlight_ar: 'إنجاز ١٠٢ عقداً مكتملاً عبر الشركاء النشطين مع تحسن سرعة الرد الأولى إلى ٧ دقائق.',
    daily_highlight_en: '102 completed contracts across active partners with first-response speed improved to 7 minutes.',
    items: [
      { id: 'MLS-01', title_ar: 'تخطي حاجز ١٠٠ عقد مكتمل', title_en: 'Surpassed 100 Completed Contracts', desc_ar: 'شركة النور والرحمة والصفوة حققت ١٠٢ عقداً موثقاً.', desc_en: 'Active partners reached 102 verified completed contracts.', tag_ar: 'إنجاز الأعمال', tag_en: 'Business Milestone' },
      { id: 'MLS-02', title_ar: 'تحسن زمن الاستجابة الأولى للمبيعات', title_en: 'Sales First-Response Speed Improved', desc_ar: 'انخفض متوسط الرد الأول إلى ٥ دقائق لدى سارة وأحمد.', desc_en: 'Average first response improved to 5m for top Sales agents.', tag_ar: 'كفاءة الفريق', tag_en: 'Team Velocity' },
      { id: 'MLS-03', title_ar: 'نمو العملاء الجدد هذا الشهر (+١٨٪)', title_en: 'Monthly Customer Acquisition (+18%)', desc_ar: 'زيادة في استفسارات العمرة المميزة من القاهرة والإسكندرية.', desc_en: 'Growth in Umrah inquiries from Cairo and Alexandria.', tag_ar: 'نمو العملاء', tag_en: 'Customer Growth' }
    ]
  };

  var GEO_REGIONS = [
    { id: 'africa', name_ar: 'أفريقيا (مصر وشمال أفريقيا)', name_en: 'Africa (Egypt & North Africa)', short_ar: 'أفريقيا', short_en: 'Africa', customers: 148, share_pct: 58, growth_pct: 18, top_hub_ar: 'القاهرة، الجيزة، الإسكندرية', top_hub_en: 'Cairo, Giza, Alexandria', cx: 478, cy: 235 },
    { id: 'asia', name_ar: 'آسيا (الخليج والمشرق)', name_en: 'Asia (GCC & Levant)', short_ar: 'آسيا', short_en: 'Asia', customers: 62, share_pct: 24, growth_pct: 14, top_hub_ar: 'الرياض، جدة، عمّان', top_hub_en: 'Riyadh, Jeddah, Amman', cx: 645, cy: 175 },
    { id: 'europe', name_ar: 'أوروبا (الجاليات المسلمة)', name_en: 'Europe (Diaspora Communities)', short_ar: 'أوروبا', short_en: 'Europe', customers: 26, share_pct: 10, growth_pct: 9, top_hub_ar: 'لندن، باريس، برلين', top_hub_en: 'London, Paris, Berlin', cx: 470, cy: 118 },
    { id: 'north_america', name_ar: 'أمريكا الشمالية', name_en: 'North America', short_ar: 'أمريكا الشمالية', short_en: 'N. America', customers: 12, share_pct: 5, growth_pct: 11, top_hub_ar: 'نيويورك، تورونتو، شيكاغو', top_hub_en: 'New York, Toronto, Chicago', cx: 195, cy: 142 },
    { id: 'oceania', name_ar: 'أوقيانوسيا (أستراليا)', name_en: 'Oceania (Australia)', short_ar: 'أوقيانوسيا', short_en: 'Oceania', customers: 5, share_pct: 2, growth_pct: 6, top_hub_ar: 'سيدني، ملبورن', top_hub_en: 'Sydney, Melbourne', cx: 765, cy: 325 },
    { id: 'south_america', name_ar: 'أمريكا الجنوبية', name_en: 'South America', short_ar: 'أمريكا الجنوبية', short_en: 'S. America', customers: 3, share_pct: 1, growth_pct: 4, top_hub_ar: 'ساو باولو، بوينس آيرس', top_hub_en: 'Sao Paulo, Buenos Aires', cx: 280, cy: 295 }
  ];

  var GOVERNORATE_LABELS = {
    cairo: { ar: 'القاهرة', en: 'Cairo' },
    giza: { ar: 'الجيزة', en: 'Giza' },
    alexandria: { ar: 'الإسكندرية', en: 'Alexandria' },
    dakahlia: { ar: 'الدقهلية', en: 'Dakahlia' }
  };

  window.AdminControlData = {
    PERMISSIONS_CONTEXT: PERMISSIONS_CONTEXT,
    ACCOUNTS_SHARED: ACCOUNTS_SHARED,
    SALES_EMPLOYEES: SALES_EMPLOYEES,
    COMPANIES: COMPANIES,
    CUSTOMERS: CUSTOMERS,
    EMP_TO_COMPANY_REQUESTS: EMP_TO_COMPANY_REQUESTS,
    ACTION_CENTER_ITEMS: ACTION_CENTER_ITEMS,
    ACTIVITY_FEED: ACTIVITY_FEED,
    SMART_INSIGHTS: SMART_INSIGHTS,
    SYSTEM_HEALTH: SYSTEM_HEALTH,
    BACKUP_PREVIEW: BACKUP_PREVIEW,
    ANALYTICS_SERIES: ANALYTICS_SERIES,
    MILESTONES: MILESTONES,
    GEO_REGIONS: GEO_REGIONS,
    GOVERNORATE_LABELS: GOVERNORATE_LABELS
  };
})();
