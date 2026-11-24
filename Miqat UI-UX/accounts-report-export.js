/**
 * MIQAT ACCOUNTS WORKSPACE — DEDICATED REPORT EXPORT DETAILS CONTROLLER
 * 
 * Manages the dedicated report export details page:
 * - URL parameter resolution (?id=REP-...&format=xlsx|pdf|csv)
 * - Report identity & metadata presentation
 * - Strict tourism company data isolation (Mock Data Only)
 * - Financial KPIs & summary metrics presentation
 * - Interactive export format selection (XLSX, PDF, CSV)
 * - Worksheets and export data structure preview
 * - Mock export execution & verification simulation
 * - Comprehensive bilingual (AR/EN) and theme support
 */

(function () {
  'use strict';

  // --- 1. Master Tourism Companies Catalog (Strict Data Isolation) ---
  const TOURISM_COMPANIES = [
    {
      id: 'COMP-101',
      name_ar: 'شركة الدرة للسياحة',
      name_en: 'Al-Durrah Tourism Co.',
      license: 'TOUR-7841',
      city: 'القاهرة',
      city_en: 'Cairo',
      active_trips: 14,
      total_bookings: 342,
      total_pilgrims: 890,
      collected_direct_egp: 2840000,
      collected_miqat_egp: 5120000,
      pending_collections_egp: 380000,
      settlements_completed_egp: 4650000,
      settlements_pending_egp: 470000,
      refunds_approved_egp: 185000,
      refunds_processing_egp: 42000,
      cancellations_count: 12,
      changes_count: 19
    },
    {
      id: 'COMP-102',
      name_ar: 'شركة نسك الهدى للسياحة',
      name_en: 'Nusuk Al-Huda Tourism',
      license: 'TOUR-9214',
      city: 'الجيزة',
      city_en: 'Giza',
      active_trips: 9,
      total_bookings: 215,
      total_pilgrims: 540,
      collected_direct_egp: 1650000,
      collected_miqat_egp: 3480000,
      pending_collections_egp: 210000,
      settlements_completed_egp: 3120000,
      settlements_pending_egp: 360000,
      refunds_approved_egp: 95000,
      refunds_processing_egp: 25000,
      cancellations_count: 7,
      changes_count: 11
    },
    {
      id: 'COMP-103',
      name_ar: 'شركة هداية المعتمد للسياحة',
      name_en: 'Hedaya Al-Moatamad Tourism',
      license: 'TOUR-6632',
      city: 'الإسكندرية',
      city_en: 'Alexandria',
      active_trips: 11,
      total_bookings: 278,
      total_pilgrims: 680,
      collected_direct_egp: 2100000,
      collected_miqat_egp: 4250000,
      pending_collections_egp: 290000,
      settlements_completed_egp: 3890000,
      settlements_pending_egp: 360000,
      refunds_approved_egp: 140000,
      refunds_processing_egp: 35000,
      cancellations_count: 9,
      changes_count: 15
    },
    {
      id: 'COMP-104',
      name_ar: 'شركة الصفا والمروة للسياحة',
      name_en: 'Al-Safa & Al-Marwa Tourism',
      license: 'TOUR-5519',
      city: 'المنصورة',
      city_en: 'Mansoura',
      active_trips: 8,
      total_bookings: 184,
      total_pilgrims: 460,
      collected_direct_egp: 1420000,
      collected_miqat_egp: 2890000,
      pending_collections_egp: 175000,
      settlements_completed_egp: 2610000,
      settlements_pending_egp: 280000,
      refunds_approved_egp: 78000,
      refunds_processing_egp: 19000,
      cancellations_count: 5,
      changes_count: 8
    },
    {
      id: 'COMP-105',
      name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      name_en: 'Al-Huda Religious Services',
      license: 'TOUR-4187',
      city: 'طنطا',
      city_en: 'Tanta',
      active_trips: 16,
      total_bookings: 412,
      total_pilgrims: 1040,
      collected_direct_egp: 3450000,
      collected_miqat_egp: 6320000,
      pending_collections_egp: 460000,
      settlements_completed_egp: 5780000,
      settlements_pending_egp: 540000,
      refunds_approved_egp: 230000,
      refunds_processing_egp: 55000,
      cancellations_count: 14,
      changes_count: 24
    }
  ];

  // --- 2. Master Reports Catalog (Strict Historical Integrity) ---
  const REPORTS_CATALOG = {
    'REP-20261123-01': {
      id: 'REP-20261123-01',
      title_ar: 'تقرير المطابقة والعمليات المالية اليومي',
      title_en: 'Daily Financial Operations & Reconciliation',
      desc_ar: 'مطابقة شاملة للقيود المحاسبية اليومية والعمليات المعتمدة والمعلقة والاستردادات',
      desc_en: 'Comprehensive daily audit of approved, pending, and refunded operations',
      type_ar: 'تقرير يومي آلي',
      type_en: 'Automated Daily Report',
      scope: 'internal',
      category: 'all',
      date: '2026-11-23 09:30',
      period_ar: 'اليوم (23 نوفمبر 2026)',
      period_en: 'Today (23 Nov 2026)',
      size: '1.8 MB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy',
      kpis_internal: [
        { label_ar: 'إجمالي العمليات المحاسبية', label_en: 'Total Operations Volume', val_ar: '2,845 عملية', val_en: '2,845 ops', badge: 'status-pill-blue' },
        { label_ar: 'إجمالي التحصيلات المعتمدة', label_en: 'Approved Collections', val_ar: '4,650,000 ج.م', val_en: 'EGP 4,650,000', badge: 'status-pill-navy' },
        { label_ar: 'التسويات المحولة للشركات', label_en: 'Completed Settlements', val_ar: '3,890,000 ج.م', val_en: 'EGP 3,890,000', badge: 'status-pill-navy' },
        { label_ar: 'مبالغ قيد المقاصة والتحصيل', label_en: 'Pending Clearance', val_ar: '410,000 ج.م', val_en: 'EGP 410,000', badge: 'status-pill-amber' }
      ]
    },
    'REP-20261122-02': {
      id: 'REP-20261122-02',
      title_ar: 'تقرير تسويات شركات السياحة الأسبوعي',
      title_en: 'Weekly Tourism Company Settlements Report',
      desc_ar: 'تدقيق أرصدة وحوالات تسويات شركات السياحة المتعاقدة وإشعارات الصرف البنكية',
      desc_en: 'Weekly audit of tourism company settlement transfers and payment vouchers',
      type_ar: 'تقرير أسبوعي دوري',
      type_en: 'Periodic Weekly Report',
      scope: 'internal',
      category: 'settlements',
      date: '2026-11-22 18:00',
      period_ar: 'الأسبوع المنتهي في 22 نوفمبر 2026',
      period_en: 'Week ending 22 Nov 2026',
      size: '2.4 MB',
      format: 'XLSX / CSV',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy',
      kpis_internal: [
        { label_ar: 'الشركات المشمولة بالتسوية', label_en: 'Settled Companies', val_ar: '18 شركة', val_en: '18 companies', badge: 'status-pill-blue' },
        { label_ar: 'إجمالي المبالغ المسواة', label_en: 'Total Settled Amount', val_ar: '12,480,000 ج.م', val_en: 'EGP 12,480,000', badge: 'status-pill-navy' },
        { label_ar: 'حوالات بنكية ناجحة', label_en: 'Successful Transfers', val_ar: '24 حوالة', val_en: '24 transfers', badge: 'status-pill-navy' },
        { label_ar: 'تسويات معلقة للمراجعة', label_en: 'Pending Review', val_ar: '620,000 ج.م', val_en: 'EGP 620,000', badge: 'status-pill-amber' }
      ]
    },
    'REP-20261121-03': {
      id: 'REP-20261121-03',
      title_ar: 'كشف الحساب التشغيلي — شركة الدرة للسياحة',
      title_en: 'Operational Statement — Al-Durrah Tourism Co.',
      desc_ar: 'كشف حساب مالي وتشغيلي معزول خاص بشركة الدرة للسياحة للرحلات المعتمدة',
      desc_en: 'Isolated operational and financial statement for Al-Durrah Tourism Co.',
      type_ar: 'تقرير شركة معزول',
      type_en: 'Isolated Company Report',
      scope: 'company',
      company_id: 'COMP-101',
      date: '2026-11-21 14:15',
      period_ar: 'من 01 نوفمبر إلى 21 نوفمبر 2026',
      period_en: '01 Nov to 21 Nov 2026',
      size: '1.2 MB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    'REP-20261120-04': {
      id: 'REP-20261120-04',
      title_ar: 'سجل التحصيلات والمدفوعات الإلكترونية',
      title_en: 'Electronic Collections & Payments Ledger',
      desc_ar: 'كشف الحركات المالية عبر بوابات الدفع الإلكتروني والبطاقات البنكية المعتمدة',
      desc_en: 'Ledger of electronic payment gateway transactions and bank cards',
      type_ar: 'تقرير دوري',
      type_en: 'Periodic Report',
      scope: 'internal',
      category: 'collections',
      date: '2026-11-20 20:00',
      period_ar: 'من 14 نوفمبر إلى 20 نوفمبر 2026',
      period_en: '14 Nov to 20 Nov 2026',
      size: '3.1 MB',
      format: 'XLSX / CSV',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy',
      kpis_internal: [
        { label_ar: 'إجمالي مدفوعات البوابات', label_en: 'Total Gateway Volume', val_ar: '7,150,000 ج.م', val_en: 'EGP 7,150,000', badge: 'status-pill-navy' },
        { label_ar: 'عدد المعاملات الإلكترونية', label_en: 'Electronic Transactions', val_ar: '1,420 عملية', val_en: '1,420 ops', badge: 'status-pill-blue' },
        { label_ar: 'نسبة النجاح الفوري', label_en: 'Instant Success Rate', val_ar: '99.4%', val_en: '99.4%', badge: 'status-pill-navy' },
        { label_ar: 'مبالغ قيد التأكيد البنكي', label_en: 'Pending Bank Confirm', val_ar: '85,000 ج.م', val_en: 'EGP 85,000', badge: 'status-pill-amber' }
      ]
    },
    'REP-20261119-05': {
      id: 'REP-20261119-05',
      title_ar: 'كشف حساب شركة نسك الهدى للسياحة',
      title_en: 'Company Statement — Nusuk Al-Huda Tourism',
      desc_ar: 'بيانات مالية معزولة للرحلات والحجوزات الخاصة بشركة نسك الهدى للسياحة',
      desc_en: 'Isolated company records and settlement breakdown for Nusuk Al-Huda Tourism',
      scope: 'company',
      company_id: 'COMP-102',
      date: '2026-11-19 11:20',
      period_ar: 'من 01 نوفمبر إلى 19 نوفمبر 2026',
      period_en: '01 Nov to 19 Nov 2026',
      size: '980 KB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    'REP-20261118-06': {
      id: 'REP-20261118-06',
      title_ar: 'تقرير طلبات الاسترداد والإلغاءات الشهري',
      title_en: 'Monthly Refunds & Cancellations Report',
      desc_ar: 'حصر مبالغ الاسترداد المنفذة والمبالغ قيد المعالجة والإلغاءات حسب السياسة المعتمدة',
      desc_en: 'Monthly audit of processed refunds, in-review refunds, and policy deductions',
      type_ar: 'تقرير شهري',
      type_en: 'Monthly Report',
      scope: 'internal',
      category: 'refunds',
      date: '2026-11-18 16:45',
      period_ar: 'شهر أكتوبر ونصف نوفمبر 2026',
      period_en: 'October & mid-November 2026',
      size: '1.9 MB',
      format: 'XLSX',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy',
      kpis_internal: [
        { label_ar: 'إجمالي طلبات الاسترداد', label_en: 'Total Refund Requests', val_ar: '48 طلباً', val_en: '48 requests', badge: 'status-pill-blue' },
        { label_ar: 'مبالغ الاسترداد المنفذة', label_en: 'Executed Refunds', val_ar: '540,000 ج.م', val_en: 'EGP 540,000', badge: 'status-pill-navy' },
        { label_ar: 'استردادات قيد المراجعة', label_en: 'Refunds Under Review', val_ar: '120,000 ج.م', val_en: 'EGP 120,000', badge: 'status-pill-amber' },
        { label_ar: 'رسوم الإلغاء المحتسبة', label_en: 'Cancellation Fees Deducted', val_ar: '45,000 ج.م', val_en: 'EGP 45,000', badge: 'status-pill-navy' }
      ]
    },
    'REP-20261117-07': {
      id: 'REP-20261117-07',
      title_ar: 'كشف الحساب التشغيلي — شركة هداية المعتمد للسياحة',
      title_en: 'Operational Statement — Hedaya Al-Moatamad Tourism',
      desc_ar: 'كشف حساب مالي وتشغيلي معزول خاص بشركة هداية المعتمد للسياحة للرحلات المعتمدة',
      desc_en: 'Isolated operational and financial statement for Hedaya Al-Moatamad Tourism',
      type_ar: 'تقرير شركة معزول',
      type_en: 'Isolated Company Report',
      scope: 'company',
      company_id: 'COMP-103',
      date: '2026-11-17 12:30',
      period_ar: 'من 01 نوفمبر إلى 17 نوفمبر 2026',
      period_en: '01 Nov to 17 Nov 2026',
      size: '1.4 MB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    }
  };

  // --- 3. Bilingual Localization Dictionary ---
  const I18N = {
    ar: {
      page_title: 'تفاصيل وتصدير التقرير | منصة ميقات',
      bc_root: 'أقسام الحسابات',
      bc_parent: 'التقارير اليومية والنسخ الاحتياطي',
      bc_current: 'تفاصيل وتصدير التقرير: ',
      btn_back: 'العودة للتقارير والنسخ',
      btn_preview: 'معاينة التقرير المستقل',
      header_mode: 'بيئة محاكاة التصدير المعتمدة',
      scope_internal: 'داخلي — منصة ميقات',
      scope_company_prefix: 'معزول — ',
      status_ready: 'مكتمل ومتاح',
      lbl_id: 'الرقم المرجعي المعياري',
      lbl_type: 'نوع ودورية التقرير',
      lbl_period: 'الفترة المحاسبية',
      lbl_date: 'تاريخ وتوقيت التوليد',
      lbl_size: 'الحجم التقديري للبيانات',
      lbl_operator: 'المسؤول المعتمد للتصدير',
      kpis_title: 'الملخص المالي ومؤشرات البيانات المشمولة بالتصدير',
      kpis_sub: 'حصر إجمالي المبالغ والعمليات المحاسبية المؤكدة والمعلقة في هذا التقرير',
      kpis_badge: 'مؤشرات موثقة',
      accounting_rule: 'ضابط التدقيق المحاسبي: يقتصر التصدير على العمليات المعتمدة والمقيدة حتى توقيت إصدار التقرير، مع إيضاح المبالغ المعلقة في عمود محاسبي مستقل.',
      cfg_title: 'صيغة وإعدادات ملف التصدير المطلوب',
      cfg_sub: 'اختر الصيغة المعيارية المناسبة للاستخدام في التدقيق الداخلي أو برامج المحاسبة',
      selected_fmt_prefix: 'المحدد: ',
      fmt_xlsx_name: 'مصنف إكسل متقدم (.xlsx)',
      fmt_xlsx_desc: 'مصنف جداول بيانات متعدد أوراق العمل يتضمن الملخص المالي وسجلات العمليات التفصيلية مع تنسيق الخلايا المحاسبي والأرقام الجدولية.',
      fmt_pdf_name: 'مستند تدقيق رسمي (.pdf)',
      fmt_pdf_desc: 'مستند معتمد وجاهز للطباعة والتدقيق الخارجي يتضمن الترويسة المؤسسية لمنصة ميقات والأختام الرقمية وأرقام الصفحات المتسلسلة.',
      fmt_csv_name: 'ملف بيانات خام (.csv)',
      fmt_csv_desc: 'بيانات مفصولة بفواصل مخصصة للدمج المباشر مع أنظمة تخطيط الموارد المؤسسية (ERP) والبرامج المحاسبية الخارجية مع دعم ترميز UTF-8.',
      struct_title: 'معاينة بنية ومحتوى ملف التصدير',
      struct_sub: 'نظرة عامة على جداول وأوراق العمل والحقول المضمنة في حزمة التصدير',
      struct_badge: '5 أوراق عمل محاسبية',
      mock_title: 'بيئة محاكاة تجريبية معتمدة:',
      mock_desc: 'هذا الإجراء توضيحي يحاكي عملية استخراج وتجهيز الملف دون استدعاء محرك التنزيل الفعلي أو حفظ ملفات محلية على جهازك.',
      trig_title: 'جاهزية تجهيز ملف التصدير',
      trig_desc: 'اضغط على الزر أدناه لبدء محاكاة توليد الحزمة المحاسبية بالصيغة المحددة وإصدار إشعار التحقق.',
      btn_simulate: 'بدء محاكاة التصدير',
      btn_simulating: 'جاري محاكاة التصدير...',
      res_status: 'اكتملت محاكاة التصدير بنجاح',
      res_title: 'تمت معالجة حزمة البيانات المحاسبية بنجاح',
      res_lbl_filename: 'اسم الملف الناتج المحاكى:',
      res_lbl_size: 'الحجم النهائي المعالج:',
      res_lbl_timestamp: 'توقيت إتمام المعالجة:',
      res_lbl_integrity: 'كود التحقق الرقمي:',
      btn_resimulate: 'محاكاة بصيغة أخرى',
      btn_return: 'العودة لسجل التقارير الرئيسي',
      invalid_code: 'CODE: NOT_FOUND',
      invalid_title: 'تعذر تحميل بيانات ملف التصدير للتقرير',
      invalid_msg: 'الرقم المرجعي للتقرير المطلوب غير محدد أو غير مسجل في سجل التقارير المنشأة. يرجى اختيار تقرير معتمد من قائمة التقارير الرئيسية.',
      invalid_btn: 'العودة إلى مركز التقارير والنسخ الاحتياطي'
    },
    en: {
      page_title: 'Report Details & Export | Miqat Platform',
      bc_root: 'Accounts Workspace',
      bc_parent: 'Daily Reports & Backup',
      bc_current: 'Report Export Details: ',
      btn_back: 'Return to Reports & Backup',
      btn_preview: 'View Independent Report',
      header_mode: 'Certified Export Simulation Environment',
      scope_internal: 'Internal — Miqat Platform',
      scope_company_prefix: 'Isolated — ',
      status_ready: 'Ready & Available',
      lbl_id: 'Standard Reference ID',
      lbl_type: 'Report Type & Cadence',
      lbl_period: 'Reporting Period',
      lbl_date: 'Generation Timestamp',
      lbl_size: 'Estimated Data Size',
      lbl_operator: 'Authorized Export Officer',
      kpis_title: 'Financial Summary & Included Export Metrics',
      kpis_sub: 'Summary of total confirmed and pending accounting figures in this export package',
      kpis_badge: 'Verified Metrics',
      accounting_rule: 'Accounting Audit Policy: Export scope is restricted to approved, booked transactions up to report release time, isolating pending amounts in distinct columns.',
      cfg_title: 'Required Export Format & Specifications',
      cfg_sub: 'Select the standard format suitable for internal auditing or ERP integration',
      selected_fmt_prefix: 'Selected: ',
      fmt_xlsx_name: 'Advanced Excel Workbook (.xlsx)',
      fmt_xlsx_desc: 'Multi-worksheet spreadsheet workbook containing financial summary, detailed booking logs, and accounting cell formatting.',
      fmt_pdf_name: 'Official Audit Document (.pdf)',
      fmt_pdf_desc: 'Certified print-ready statement with Miqat institutional headers, verification seals, and sequential page numbering.',
      fmt_csv_name: 'Raw Data File (.csv)',
      fmt_csv_desc: 'Comma-separated values designed for direct automated ingestion into ERP and external accounting suites with UTF-8 support.',
      struct_title: 'Export Structure & Worksheets Preview',
      struct_sub: 'Overview of worksheets, tables, and accounting fields included in this export package',
      struct_badge: '5 Accounting Worksheets',
      mock_title: 'Certified Mock Simulation Environment (Mock Simulation Only):',
      mock_desc: 'This action demonstrates the packaging process without invoking real file downloads or writing files to your local device.',
      trig_title: 'Export Package Ready for Simulation',
      trig_desc: 'Click below to simulate generating the selected financial package and produce the verification receipt.',
      btn_simulate: 'Simulate Export',
      btn_simulating: 'Simulating export...',
      res_status: 'Export Simulation Completed Successfully',
      res_title: 'Accounting Data Package Processed Successfully',
      res_lbl_filename: 'Simulated Output Filename:',
      res_lbl_size: 'Final Processed Size:',
      res_lbl_timestamp: 'Processing Timestamp:',
      res_lbl_integrity: 'Verification Hash:',
      btn_resimulate: 'Simulate Another Format',
      btn_return: 'Return to Reports Hub',
      invalid_code: 'CODE: NOT_FOUND',
      invalid_title: 'Unable to Load Report Export Data',
      invalid_msg: 'The requested report reference ID is missing or not registered in the generated reports catalog. Please select an authorized report.',
      invalid_btn: 'Return to Reports & Backup Center'
    }
  };

  // --- 4. Worksheets Schema Structure Definition ---
  const WORKSHEET_SCHEMAS = [
    {
      id: '01_summary',
      name_ar: '01_الملخص_التنفيذي',
      name_en: '01_Executive_Summary',
      badge_ar: 'مؤشرات الأداء',
      badge_en: 'KPIs & Overview',
      records_ar: '10 مؤشرات محاسبية',
      records_en: '10 Accounting KPIs',
      fields_ar: 'الفترة، النطاق، إجمالي التحصيلات، مبالغ التسوية، السيولة المعلقة، العملة (EGP)',
      fields_en: 'Period, Scope, Total Collections, Settlement Amounts, Pending Liquidity, Currency (EGP)'
    },
    {
      id: '02_bookings',
      name_ar: '02_سجل_الحجوزات',
      name_en: '02_Bookings_Register',
      badge_ar: 'بيانات المعتمرين',
      badge_en: 'Pilgrims & Trips',
      records_ar: '342 قيد حجز',
      records_en: '342 Booking Rows',
      fields_ar: 'رقم الحجز، اسم العميل، الرحلة، عدد الأفراد، التحصيل المباشر، تحصيل المنصة، الحالة',
      fields_en: 'Booking ID, Customer Name, Trip, Passengers Count, Direct Collection, Platform Collection, Status'
    },
    {
      id: '03_collections',
      name_ar: '03_التحصيلات_والبوابات',
      name_en: '03_Collections_Ledger',
      badge_ar: 'العمليات الإلكترونية',
      badge_en: 'Gateways & Cash',
      records_ar: '518 حركة تحصيل',
      records_en: '518 Payment Rows',
      fields_ar: 'معرف الحركة، التاريخ، وسيلة الدفع (بطاقة / محفظة / إيداع)، المبلغ، الرسوم، رقم المرجع',
      fields_en: 'Transaction ID, Date, Payment Method (Card / Wallet / Deposit), Gross Amount, Gateway Fee, Reference ID'
    },
    {
      id: '04_settlements',
      name_ar: '04_حوالات_التسوية',
      name_en: '04_Company_Settlements',
      badge_ar: 'مستحقات الشركات',
      badge_en: 'Company Transfers',
      records_ar: '24 أمر تحويل',
      records_en: '24 Transfer Vouchers',
      fields_ar: 'رقم أمر الصرف، كود الشركة، الحساب البنكي، المبلغ المحول، تاريخ التحويل، الإشعار',
      fields_en: 'Voucher ID, Company Code, Bank Account, Transferred Net, Transfer Date, Bank Reference'
    },
    {
      id: '05_refunds',
      name_ar: '05_الاستردادات_والتسويات',
      name_en: '05_Refunds_Adjustments',
      badge_ar: 'قيود الإلغاء',
      badge_en: 'Policy Deductions',
      records_ar: '12 عملية استرداد',
      records_en: '12 Refund Rows',
      fields_ar: 'رقم طلب الاسترداد، السبب، المبلغ الأصلي، نسبة الاستقطاع، الصافي المعاد، حالة الصرف',
      fields_en: 'Refund ID, Cancellation Reason, Original Amount, Penalty Deduction, Net Refund, Disbursement Status'
    }
  ];

  // --- 5. State Management ---
  let state = {
    reportId: null,
    reportItem: null,
    companyItem: null,
    selectedFormat: 'xlsx',
    isSimulating: false,
    hasSimulated: false,
    simulatedReceipt: null
  };

  // --- 6. Helper Functions ---
  function getIsArabic() {
    return document.documentElement.getAttribute('dir') !== 'ltr';
  }

  function formatEGP(num) {
    return (num || 0).toLocaleString('ar-EG') + ' ج.م';
  }

  function formatEGP_EN(num) {
    return 'EGP ' + (num || 0).toLocaleString('en-US');
  }

  function getOperatorIdentity() {
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getEmployeeIdentity === 'function') {
      const emp = window.AccountsWorkspace.getEmployeeIdentity();
      if (emp && emp.name) {
        return {
          ar: `${emp.name} (${emp.role || 'موظف حسابات مالية'})`,
          en: `${emp.name_en || emp.name} (${emp.role_en || 'Financial Accounts Officer'})`
        };
      }
    }
    return {
      ar: 'أحمد صبري (موظف حسابات مالية)',
      en: 'Ahmed Sabry (Financial Accounts Officer)'
    };
  }

  // --- 7. Resolve URL Parameters & Validate Identity ---
  function resolveReport() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const fmt = params.get('format');

    if (fmt && ['xlsx', 'pdf', 'csv'].includes(fmt.toLowerCase())) {
      state.selectedFormat = fmt.toLowerCase();
    }

    if (!id || !REPORTS_CATALOG[id]) {
      state.reportId = id || 'NOT_FOUND';
      state.reportItem = null;
      renderInvalidState();
      return;
    }

    state.reportId = id;
    state.reportItem = REPORTS_CATALOG[id];

    // If company scope, resolve authoritative company identity
    if (state.reportItem.scope === 'company') {
      const compId = state.reportItem.company_id;
      const comp = TOURISM_COMPANIES.find(c => c.id === compId);
      if (comp) {
        state.companyItem = comp;
      }
    }

    renderValidState();
  }

  // --- 8. Render Invalid State ---
  function renderInvalidState() {
    const invalidCard = document.getElementById('rep-exp-invalid-state');
    const validContainer = document.getElementById('rep-exp-valid-container');
    const codePill = document.getElementById('rep-exp-invalid-code-pill');

    if (validContainer) validContainer.style.display = 'none';
    if (invalidCard) invalidCard.style.display = 'flex';
    if (codePill) codePill.textContent = `ID: ${state.reportId}`;

    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;

    const titleEl = document.getElementById('rep-exp-invalid-title');
    const msgEl = document.getElementById('rep-exp-invalid-msg');
    const btnText = document.getElementById('rep-exp-invalid-btn-text');

    if (titleEl) titleEl.textContent = dict.invalid_title;
    if (msgEl) msgEl.textContent = dict.invalid_msg;
    if (btnText) btnText.textContent = dict.invalid_btn;
  }

  // --- 9. Render Valid State & Metadata ---
  function renderValidState() {
    const invalidCard = document.getElementById('rep-exp-invalid-state');
    const validContainer = document.getElementById('rep-exp-valid-container');

    if (invalidCard) invalidCard.style.display = 'none';
    if (validContainer) validContainer.style.display = 'block';

    const item = state.reportItem;
    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;
    const op = getOperatorIdentity();

    // Breadcrumbs & Header
    const bcCurrent = document.getElementById('rep-exp-bc-current');
    if (bcCurrent) bcCurrent.textContent = dict.bc_current + item.id;

    const headerId = document.getElementById('rep-exp-header-id');
    if (headerId) headerId.textContent = item.id;

    const headerScope = document.getElementById('rep-exp-header-scope-badge');
    if (headerScope) {
      if (item.scope === 'company' && state.companyItem) {
        headerScope.textContent = dict.scope_company_prefix + (isAr ? state.companyItem.name_ar : state.companyItem.name_en);
        headerScope.className = 'acc-status-pill status-pill-amber';
      } else {
        headerScope.textContent = dict.scope_internal;
        headerScope.className = 'acc-status-pill status-pill-navy';
      }
    }

    const headerStatus = document.getElementById('rep-exp-header-status-badge');
    if (headerStatus) {
      headerStatus.textContent = isAr ? item.status_ar : item.status_en;
      headerStatus.className = `acc-status-pill ${item.status_badge || 'status-pill-navy'}`;
    }

    // Link Preview Button to Standalone Details Page
    const btnPreview = document.getElementById('rep-exp-btn-preview');
    if (btnPreview) {
      btnPreview.href = `accounts-report-details.html?id=${encodeURIComponent(item.id)}`;
    }

    // Section 1: Main Metadata Card
    const titleEl = document.getElementById('rep-exp-title');
    if (titleEl) titleEl.textContent = isAr ? item.title_ar : item.title_en;

    const descEl = document.getElementById('rep-exp-desc');
    if (descEl) descEl.textContent = isAr ? item.desc_ar : item.desc_en;

    const scopeTag = document.getElementById('rep-exp-scope-tag');
    if (scopeTag) {
      if (item.scope === 'company' && state.companyItem) {
        scopeTag.textContent = dict.scope_company_prefix + (isAr ? state.companyItem.name_ar : state.companyItem.name_en);
        scopeTag.className = 'acc-status-pill status-pill-amber';
      } else {
        scopeTag.textContent = dict.scope_internal;
        scopeTag.className = 'acc-status-pill status-pill-navy';
      }
    }

    const valId = document.getElementById('rep-exp-val-id');
    if (valId) valId.textContent = item.id;

    const valType = document.getElementById('rep-exp-val-type');
    if (valType) valType.textContent = isAr ? item.type_ar : item.type_en;

    const valPeriod = document.getElementById('rep-exp-val-period');
    if (valPeriod) valPeriod.textContent = isAr ? item.period_ar : item.period_en;

    const valDate = document.getElementById('rep-exp-val-date');
    if (valDate) valDate.textContent = item.date;

    const valSize = document.getElementById('rep-exp-val-size');
    if (valSize) valSize.textContent = item.size;

    const valOp = document.getElementById('rep-exp-val-operator');
    if (valOp) valOp.textContent = isAr ? op.ar : op.en;

    // Section 2: Strict Company Isolation Alert
    const isolationCard = document.getElementById('rep-exp-isolation-card');
    if (isolationCard) {
      if (item.scope === 'company' && state.companyItem) {
        isolationCard.style.display = 'flex';
        const comp = state.companyItem;
        const codePill = document.getElementById('rep-exp-company-code-pill');
        const namePill = document.getElementById('rep-exp-company-name-pill');
        const cityPill = document.getElementById('rep-exp-company-city-pill');

        if (codePill) codePill.textContent = `CODE: ${comp.id}`;
        if (namePill) namePill.textContent = isAr ? comp.name_ar : comp.name_en;
        if (cityPill) cityPill.textContent = isAr ? comp.city : comp.city_en;
      } else {
        isolationCard.style.display = 'none';
      }
    }

    // Section 3: Financial KPIs
    renderKPIs();

    // Section 4: Format Selection
    updateFormatSelectionUI();

    // Section 5: Worksheets Structure Preview
    renderWorksheetsPreview();

    // Section 6: Action / Simulation State
    renderSimulationView();
  }

  // --- 10. Render Financial KPIs ---
  function renderKPIs() {
    const kpiGrid = document.getElementById('rep-exp-kpi-grid');
    if (!kpiGrid) return;

    const item = state.reportItem;
    const isAr = getIsArabic();
    let kpiList = [];

    if (item.scope === 'company' && state.companyItem) {
      const comp = state.companyItem;
      kpiList = [
        {
          label: isAr ? 'الرحلات التشغيلية النشطة' : 'Active Operational Trips',
          val: `${comp.active_trips} ` + (isAr ? 'رحلات' : 'trips'),
          badge: 'status-pill-blue'
        },
        {
          label: isAr ? 'إجمالي الحجوزات والمعتمرين' : 'Total Bookings & Pax',
          val: `${comp.total_bookings} (${comp.total_pilgrims} ` + (isAr ? 'معتمر' : 'pax') + ')',
          badge: 'status-pill-navy'
        },
        {
          label: isAr ? 'مبالغ محصلة مباشرة' : 'Direct Company Collections',
          val: isAr ? formatEGP(comp.collected_direct_egp) : formatEGP_EN(comp.collected_direct_egp),
          badge: 'status-pill-navy'
        },
        {
          label: isAr ? 'تحصيلات منصة ميقات' : 'Miqat Platform Collections',
          val: isAr ? formatEGP(comp.collected_miqat_egp) : formatEGP_EN(comp.collected_miqat_egp),
          badge: 'status-pill-navy'
        },
        {
          label: isAr ? 'تسويات الشركة المكتملة' : 'Completed Settlements',
          val: isAr ? formatEGP(comp.settlements_completed_egp) : formatEGP_EN(comp.settlements_completed_egp),
          badge: 'status-pill-navy'
        },
        {
          label: isAr ? 'مبالغ معلقة قيد التحصيل' : 'Pending Collections',
          val: isAr ? formatEGP(comp.pending_collections_egp) : formatEGP_EN(comp.pending_collections_egp),
          badge: 'status-pill-amber'
        }
      ];
    } else if (item.kpis_internal) {
      kpiList = item.kpis_internal.map(k => ({
        label: isAr ? k.label_ar : k.label_en,
        val: isAr ? k.val_ar : k.val_en,
        badge: k.badge
      }));
    } else {
      kpiList = [
        { label: isAr ? 'حجم العمليات' : 'Operations Volume', val: '2,845', badge: 'status-pill-blue' },
        { label: isAr ? 'المبالغ المعتمدة' : 'Approved Volume', val: isAr ? '4,650,000 ج.م' : 'EGP 4,650,000', badge: 'status-pill-navy' },
        { label: isAr ? 'التسويات' : 'Settlements', val: isAr ? '3,890,000 ج.م' : 'EGP 3,890,000', badge: 'status-pill-navy' },
        { label: isAr ? 'مبالغ معلقة' : 'Pending', val: isAr ? '410,000 ج.م' : 'EGP 410,000', badge: 'status-pill-amber' }
      ];
    }

    kpiGrid.innerHTML = kpiList.map(k => `
      <div class="rep-exp-kpi-card">
        <div class="rep-exp-kpi-top">
          <span class="rep-exp-kpi-lbl">${k.label}</span>
          <span class="acc-status-pill ${k.badge}">${isAr ? 'معتمد' : 'Certified'}</span>
        </div>
        <strong class="rep-exp-kpi-val rep-table-mono">${k.val}</strong>
      </div>
    `).join('');
  }

  // --- 11. Format Selection Handling ---
  function selectFormat(fmt) {
    if (!['xlsx', 'pdf', 'csv'].includes(fmt)) return;
    state.selectedFormat = fmt;
    state.hasSimulated = false;
    state.simulatedReceipt = null;
    updateFormatSelectionUI();
    renderWorksheetsPreview();
    renderSimulationView();
  }

  function updateFormatSelectionUI() {
    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;

    const cards = document.querySelectorAll('.rep-exp-fmt-card');
    cards.forEach(card => {
      const cardFmt = card.getAttribute('data-format');
      const isActive = cardFmt === state.selectedFormat;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    const badgeEl = document.getElementById('rep-exp-selected-fmt-badge');
    if (badgeEl) {
      let fmtName = '';
      if (state.selectedFormat === 'xlsx') fmtName = isAr ? 'مصنف إكسل (.xlsx)' : 'Excel Workbook (.xlsx)';
      else if (state.selectedFormat === 'pdf') fmtName = isAr ? 'مستند تدقيق PDF (.pdf)' : 'Audit Document PDF (.pdf)';
      else fmtName = isAr ? 'ملف بيانات CSV (.csv)' : 'Data File CSV (.csv)';
      badgeEl.textContent = dict.selected_fmt_prefix + fmtName;
    }
  }

  // --- 12. Render Worksheets Structure Preview ---
  function renderWorksheetsPreview() {
    const grid = document.getElementById('rep-exp-sheets-grid');
    if (!grid) return;

    const isAr = getIsArabic();
    const fmt = state.selectedFormat;

    if (fmt === 'csv') {
      grid.innerHTML = `
        <div class="rep-exp-sheet-card rep-exp-sheet-single">
          <div class="rep-exp-sheet-header">
            <div class="rep-exp-sheet-title-wrap">
              <strong class="rep-exp-sheet-name rep-table-mono">MASTER_DATA_EXPORT.CSV</strong>
              <span class="acc-status-pill status-pill-blue">${isAr ? 'ملف جدول بيانات أحادي (UTF-8 BOM)' : 'Single Flat Table (UTF-8 BOM)'}</span>
            </div>
            <span class="acc-status-pill status-pill-slate">${isAr ? '1,890 سجل مجدول' : '1,890 Structured Rows'}</span>
          </div>
          <p class="rep-exp-sheet-desc">${isAr ? 'ملف بيانات خام مفصول بفواصل قياسية (Comma Delimited) يتضمن كافة القيود المحاسبية، الحجوزات، التحصيلات، والتسويات في جدول مالي موحد.' : 'Raw comma-delimited data file containing all accounting entries, bookings, collections, and settlements in a unified financial table.'}</p>
          <div class="rep-exp-sheet-columns">
            <span class="col-pill">Record_ID</span>
            <span class="col-pill">Timestamp</span>
            <span class="col-pill">Category</span>
            <span class="col-pill">Customer_Name</span>
            <span class="col-pill">Company_Code</span>
            <span class="col-pill">Amount_EGP</span>
            <span class="col-pill">Status</span>
            <span class="col-pill">Gateway_Ref</span>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = WORKSHEET_SCHEMAS.map(s => `
      <div class="rep-exp-sheet-card">
        <div class="rep-exp-sheet-header">
          <div class="rep-exp-sheet-title-wrap">
            <strong class="rep-exp-sheet-name rep-table-mono">${isAr ? s.name_ar : s.name_en}</strong>
            <span class="acc-status-pill status-pill-navy">${isAr ? s.badge_ar : s.badge_en}</span>
          </div>
          <span class="acc-status-pill status-pill-slate">${isAr ? s.records_ar : s.records_en}</span>
        </div>
        <p class="rep-exp-sheet-desc">${isAr ? 'الحقول المضمنة:' : 'Included fields:'} ${isAr ? s.fields_ar : s.fields_en}</p>
      </div>
    `).join('');
  }

  // --- 13. Simulation Execution Flow ---
  function executeSimulation() {
    if (state.isSimulating) return;
    state.isSimulating = true;

    const btnSimulate = document.getElementById('rep-exp-btn-simulate');
    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;

    if (btnSimulate) {
      btnSimulate.disabled = true;
      btnSimulate.setAttribute('aria-busy', 'true');
      btnSimulate.querySelector('span').textContent = dict.btn_simulating;
    }

    setTimeout(function () {
      state.isSimulating = false;
      state.hasSimulated = true;

      const item = state.reportItem;
      const ext = state.selectedFormat;
      const cleanId = (item.id || 'REPORT').replace(/[^a-zA-Z0-9-]/g, '_');
      const filename = `${cleanId}_Audit_Export.${ext}`;
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const hash = `SIM-HASH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      state.simulatedReceipt = {
        filename: filename,
        format: ext.toUpperCase(),
        size: item.size || '1.8 MB',
        timestamp: timestamp,
        hash: hash
      };

      if (btnSimulate) {
        btnSimulate.disabled = false;
        btnSimulate.removeAttribute('aria-busy');
        btnSimulate.querySelector('span').textContent = dict.btn_simulate;
      }

      renderSimulationView();
    }, 600);
  }

  function renderSimulationView() {
    const triggerWrap = document.getElementById('rep-exp-trigger-wrap');
    const resultCard = document.getElementById('rep-exp-result-card');

    if (!state.hasSimulated || !state.simulatedReceipt) {
      if (triggerWrap) triggerWrap.style.display = 'flex';
      if (resultCard) resultCard.style.display = 'none';
      return;
    }

    if (triggerWrap) triggerWrap.style.display = 'none';
    if (resultCard) resultCard.style.display = 'block';

    const r = state.simulatedReceipt;
    const isAr = getIsArabic();

    const fmtPill = document.getElementById('rep-exp-res-fmt-pill');
    if (fmtPill) fmtPill.textContent = `${r.format} File`;

    const fileEl = document.getElementById('rep-exp-res-filename');
    if (fileEl) fileEl.textContent = r.filename;

    const sizeEl = document.getElementById('rep-exp-res-size');
    if (sizeEl) sizeEl.textContent = r.size;

    const timeEl = document.getElementById('rep-exp-res-timestamp');
    if (timeEl) timeEl.textContent = r.timestamp;

    const hashEl = document.getElementById('rep-exp-res-hash');
    if (hashEl) hashEl.textContent = r.hash;
  }

  function resetSimulation() {
    state.hasSimulated = false;
    state.simulatedReceipt = null;
    renderSimulationView();
  }

  // --- 14. Full Bilingual Re-rendering ---
  function renderBilingualUI() {
    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;

    document.title = dict.page_title;

    const textMappings = [
      { id: 'rep-exp-btn-back-text', text: dict.btn_back },
      { id: 'rep-exp-btn-preview-text', text: dict.btn_preview },
      { id: 'rep-exp-header-mode-badge', text: dict.header_mode },
      { id: 'rep-exp-cadence-pill', text: isAr ? 'تقرير يومي معتمد' : 'Certified Daily Report' },
      { id: 'rep-exp-lbl-id', text: dict.lbl_id },
      { id: 'rep-exp-lbl-type', text: dict.lbl_type },
      { id: 'rep-exp-lbl-period', text: dict.lbl_period },
      { id: 'rep-exp-lbl-date', text: dict.lbl_date },
      { id: 'rep-exp-lbl-size', text: dict.lbl_size },
      { id: 'rep-exp-lbl-operator', text: dict.lbl_operator },
      { id: 'rep-exp-kpis-title', text: dict.kpis_title },
      { id: 'rep-exp-kpis-sub', text: dict.kpis_sub },
      { id: 'rep-exp-kpi-badge', text: dict.kpis_badge },
      { id: 'rep-exp-accounting-rule-text', text: dict.accounting_rule },
      { id: 'rep-exp-cfg-title', text: dict.cfg_title },
      { id: 'rep-exp-cfg-sub', text: dict.cfg_sub },
      { id: 'rep-exp-fmt-name-xlsx', text: dict.fmt_xlsx_name },
      { id: 'rep-exp-fmt-desc-xlsx', text: dict.fmt_xlsx_desc },
      { id: 'rep-exp-fmt-name-pdf', text: dict.fmt_pdf_name },
      { id: 'rep-exp-fmt-desc-pdf', text: dict.fmt_pdf_desc },
      { id: 'rep-exp-fmt-name-csv', text: dict.fmt_csv_name },
      { id: 'rep-exp-fmt-desc-csv', text: dict.fmt_csv_desc },
      { id: 'rep-exp-struct-title', text: dict.struct_title },
      { id: 'rep-exp-struct-sub', text: dict.struct_sub },
      { id: 'rep-exp-struct-badge', text: dict.struct_badge },
      { id: 'rep-exp-mock-notice-title', text: dict.mock_title },
      { id: 'rep-exp-mock-notice-desc', text: dict.mock_desc },
      { id: 'rep-exp-trig-title', text: dict.trig_title },
      { id: 'rep-exp-trig-desc', text: dict.trig_desc },
      { id: 'rep-exp-btn-simulate-text', text: dict.btn_simulate },
      { id: 'rep-exp-res-status-pill', text: dict.res_status },
      { id: 'rep-exp-res-title', text: dict.res_title },
      { id: 'rep-exp-res-lbl-filename', text: dict.res_lbl_filename },
      { id: 'rep-exp-res-lbl-size', text: dict.res_lbl_size },
      { id: 'rep-exp-res-lbl-timestamp', text: dict.res_lbl_timestamp },
      { id: 'rep-exp-res-lbl-integrity', text: dict.res_lbl_integrity },
      { id: 'rep-exp-btn-resimulate-text', text: dict.btn_resimulate },
      { id: 'rep-exp-btn-return-center-text', text: dict.btn_return }
    ];

    textMappings.forEach(m => {
      const el = document.getElementById(m.id);
      if (el) el.textContent = m.text;
    });

    if (state.reportItem) {
      renderValidState();
    } else {
      renderInvalidState();
    }
  }

  // --- 15. Initialization & Event Binding ---
  function init() {
    resolveReport();
    renderBilingualUI();

    // Format selection click and keyboard handlers
    const formatCards = document.querySelectorAll('.rep-exp-fmt-card');
    formatCards.forEach(card => {
      card.addEventListener('click', function () {
        selectFormat(this.getAttribute('data-format'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectFormat(this.getAttribute('data-format'));
        }
      });
    });

    // Execute simulation button
    const btnSimulate = document.getElementById('rep-exp-btn-simulate');
    if (btnSimulate) {
      btnSimulate.addEventListener('click', executeSimulation);
    }

    // Re-simulate button
    const btnResimulate = document.getElementById('rep-exp-btn-resimulate');
    if (btnResimulate) {
      btnResimulate.addEventListener('click', resetSimulation);
    }

    // Register with shared workspace refresh hook (Language / Theme toggles)
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onPageRefresh === 'function') {
      window.AccountsWorkspace.onPageRefresh(function () {
        renderBilingualUI();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
