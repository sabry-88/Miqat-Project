/**
 * MIQAT ACCOUNTS WORKSPACE — STANDALONE REPORT DETAILS & PREVIEW CONTROLLER
 * 
 * Provides dedicated standalone view for generated reports and catalog previews:
 * - URL Parameter and SessionStorage State Resolution
 * - Strict Tourism Company Data Isolation (Mock Data Only)
 * - Multi-Worksheet Excel (.xlsx) Structure (Executive Summary, Bookings, Collections, Settlements, Refunds)
 * - Simulated Export Flows (XLSX, PDF, CSV) with Explicit Mock Notices
 * - Accounting Distinction Enforcement (Approved vs Pending vs In-Process)
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
      active_trips: 16,
      total_bookings: 412,
      total_pilgrims: 1050,
      collected_direct_egp: 3450000,
      collected_miqat_egp: 6200000,
      pending_collections_egp: 490000,
      settlements_completed_egp: 5800000,
      settlements_pending_egp: 510000,
      refunds_approved_egp: 210000,
      refunds_processing_egp: 55000,
      cancellations_count: 14,
      changes_count: 22
    }
  ];

  // Isolated Company Datasets Dictionary (Strict Isolation: no cross-company data, no internal notes/commissions)
  const COMPANY_ISOLATED_DATASETS = {
    'COMP-101': {
      bookings: [
        { ref: 'BKG-DR-701', customer: 'محمود عبد الرحيم', customer_en: 'Mahmoud Abdel-Rahim', trip: 'رحلة الوفاء 14 يوم', trip_en: 'Al-Wafaa 14-Day Trip', pax: 4, direct_amt: 60000, miqat_amt: 90000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' },
        { ref: 'BKG-DR-714', customer: 'فاطمة إبراهيم السيد', customer_en: 'Fatma Ibrahim El-Sayed', trip: 'رحلة النور 10 أيام', trip_en: 'Al-Noor 10-Day Trip', pax: 2, direct_amt: 35000, miqat_amt: 45000, pending_amt: 10000, status: 'تحصيل جزئي', status_en: 'Partial' },
        { ref: 'BKG-DR-729', customer: 'حسين كمال الدين', customer_en: 'Hussein Kamal Eldin', trip: 'رحلة التيسير الاقتصادية', trip_en: 'Al-Tayseer Economy', pax: 5, direct_amt: 50000, miqat_amt: 125000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' },
        { ref: 'BKG-DR-740', customer: 'نجوى عبد الرحمن', customer_en: 'Nagwa Abdel-Rahman', trip: 'رحلة الوفاء 14 يوم', trip_en: 'Al-Wafaa 14-Day Trip', pax: 3, direct_amt: 0, miqat_amt: 110000, pending_amt: 15000, status: 'قيد استكمال الدفع', status_en: 'Pending Payment' },
        { ref: 'BKG-DR-755', customer: 'طارق سامي عبد الله', customer_en: 'Tarek Sami Abdullah', trip: 'رحلة الهدى المميزة', trip_en: 'Al-Huda Premium Trip', pax: 2, direct_amt: 40000, miqat_amt: 70000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' }
      ],
      settlements: [
        { ref: 'SET-DR-101', date: '2026-11-20', batch: 'BATCH-2026-W47', direct_collected: 1200000, miqat_collected: 3450000, transferred_amt: 4650000, bank_ref: 'BNK-EG-99412', status: 'محول لحساب الشركة', status_en: 'Transferred' },
        { ref: 'SET-DR-102', date: '2026-11-23', batch: 'BATCH-2026-W48', direct_collected: 450000, miqat_collected: 920000, transferred_amt: 470000, bank_ref: 'BNK-EG-99580', status: 'قيد إشعار البنك', status_en: 'Pending Transfer' }
      ],
      refunds: [
        { ref: 'REF-DR-01', customer: 'ياسر محمد فؤاد', customer_en: 'Yasser Mohamed Fouad', date: '2026-11-15', trip: 'رحلة الوفاء 14 يوم', gross_amt: 45000, penalty_amt: 4500, refund_amt: 40500, status: 'منفذ للعميل', status_en: 'Processed' },
        { ref: 'REF-DR-02', customer: 'سعاد أحمد خليل', customer_en: 'Soad Ahmed Khalil', date: '2026-11-21', trip: 'رحلة النور 10 أيام', gross_amt: 25000, penalty_amt: 2500, refund_amt: 22500, status: 'قيد التدقيق البنكي', status_en: 'In Bank Review' }
      ]
    },
    'COMP-102': {
      bookings: [
        { ref: 'BKG-NH-801', customer: 'عبد الله السعيد سالم', customer_en: 'Abdullah El-Saeed Salem', trip: 'رحلة الهدى 15 يوم', trip_en: 'Al-Huda 15-Day Trip', pax: 3, direct_amt: 45000, miqat_amt: 75000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' },
        { ref: 'BKG-NH-812', customer: 'مريم عادل نصار', customer_en: 'Mariam Adel Nassar', trip: 'رحلة الإيمان 10 أيام', trip_en: 'Al-Iman 10-Day Trip', pax: 2, direct_amt: 30000, miqat_amt: 40000, pending_amt: 5000, status: 'تحصيل جزئي', status_en: 'Partial' },
        { ref: 'BKG-NH-825', customer: 'خالد مصطفى عمر', customer_en: 'Khaled Mostafa Omar', trip: 'رحلة الهدى الاقتصادية', trip_en: 'Al-Huda Economy Trip', pax: 4, direct_amt: 40000, miqat_amt: 100000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' },
        { ref: 'BKG-NH-838', customer: 'سميحة حسن رضوان', customer_en: 'Sameeha Hassan Radwan', trip: 'رحلة الهدى 15 يوم', trip_en: 'Al-Huda 15-Day Trip', pax: 2, direct_amt: 0, miqat_amt: 80000, pending_amt: 12000, status: 'قيد استكمال الدفع', status_en: 'Pending Payment' }
      ],
      settlements: [
        { ref: 'SET-NH-201', date: '2026-11-19', batch: 'BATCH-2026-W46', direct_collected: 800000, miqat_collected: 2320000, transferred_amt: 3120000, bank_ref: 'BNK-GZ-44102', status: 'محول لحساب الشركة', status_en: 'Transferred' },
        { ref: 'SET-NH-202', date: '2026-11-22', batch: 'BATCH-2026-W47', direct_collected: 350000, miqat_collected: 710000, transferred_amt: 360000, bank_ref: 'BNK-GZ-44218', status: 'قيد إشعار البنك', status_en: 'Pending Transfer' }
      ],
      refunds: [
        { ref: 'REF-NH-01', customer: 'عادل يوسف كامل', customer_en: 'Adel Youssef Kamel', date: '2026-11-12', trip: 'رحلة الإيمان 10 أيام', gross_amt: 35000, penalty_amt: 3500, refund_amt: 31500, status: 'منفذ للعميل', status_en: 'Processed' }
      ]
    },
    'COMP-103': {
      bookings: [
        { ref: 'BKG-HD-901', customer: 'أحمد عصام الدين', customer_en: 'Ahmed Essam Eldin', trip: 'رحلة الرحاب 12 يوم', trip_en: 'Al-Rehab 12-Day Trip', pax: 4, direct_amt: 55000, miqat_amt: 95000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' },
        { ref: 'BKG-HD-915', customer: 'منى عبد العال حسن', customer_en: 'Mona Abdel-Aal Hassan', trip: 'رحلة الصفا 14 يوم', trip_en: 'Al-Safa 14-Day Trip', pax: 2, direct_amt: 40000, miqat_amt: 50000, pending_amt: 8000, status: 'تحصيل جزئي', status_en: 'Partial' },
        { ref: 'BKG-HD-928', customer: 'شريف مجدي توفيق', customer_en: 'Sherif Magdy Tawfik', trip: 'رحلة الرحاب الاقتصادية', trip_en: 'Al-Rehab Economy', pax: 3, direct_amt: 35000, miqat_amt: 85000, pending_amt: 0, status: 'مؤكد ومكتمل', status_en: 'Confirmed' }
      ],
      settlements: [
        { ref: 'SET-HD-301', date: '2026-11-18', batch: 'BATCH-2026-W46', direct_collected: 950000, miqat_collected: 2940000, transferred_amt: 3890000, bank_ref: 'BNK-ALX-12055', status: 'محول لحساب الشركة', status_en: 'Transferred' },
        { ref: 'SET-HD-302', date: '2026-11-22', batch: 'BATCH-2026-W47', direct_collected: 400000, miqat_collected: 860000, transferred_amt: 360000, bank_ref: 'BNK-ALX-12190', status: 'قيد إشعار البنك', status_en: 'Pending Transfer' }
      ],
      refunds: [
        { ref: 'REF-HD-01', customer: 'وليد فاروق إسماعيل', customer_en: 'Walid Farouk Ismail', date: '2026-11-14', trip: 'رحلة الصفا 14 يوم', gross_amt: 48000, penalty_amt: 4800, refund_amt: 43200, status: 'منفذ للعميل', status_en: 'Processed' }
      ]
    }
  };

  // Pre-configured Reports Catalog
  const REPORTS_CATALOG = {
    'REP-20261123-01': {
      id: 'REP-20261123-01',
      title_ar: 'تقرير المطابقة والعمليات المالية اليومي',
      title_en: 'Daily Financial Operations & Reconciliation',
      desc_ar: 'مطابقة شاملة للقيود المحاسبية اليومية والعمليات المعتمدة والمعلقة والاستردادات',
      desc_en: 'Comprehensive daily audit of approved, pending, and refunded operations',
      scope: 'internal',
      category: 'all',
      date: '2026-11-23 09:30',
      period_ar: 'اليوم (23 نوفمبر 2026)',
      period_en: 'Today (23 Nov 2026)'
    },
    'REP-20261122-02': {
      id: 'REP-20261122-02',
      title_ar: 'تقرير تسويات شركات السياحة الأسبوعي',
      title_en: 'Weekly Tourism Company Settlements Report',
      desc_ar: 'تدقيق أرصدة وحوالات تسويات شركات السياحة المتعاقدة وإشعارات الصرف البنكية',
      desc_en: 'Weekly audit of tourism company settlement transfers and payment vouchers',
      scope: 'internal',
      category: 'settlements',
      date: '2026-11-22 18:00',
      period_ar: 'الأسبوع المنتهي في 22 نوفمبر 2026',
      period_en: 'Week ending 22 Nov 2026'
    },
    'REP-20261121-03': {
      id: 'REP-20261121-03',
      title_ar: 'كشف الحساب التشغيلي — شركة الدرة للسياحة',
      title_en: 'Operational Statement — Al-Durrah Tourism Co.',
      desc_ar: 'كشف حساب مالي وتشغيلي معزول خاص بشركة الدرة للسياحة للرحلات المعتمدة',
      desc_en: 'Isolated operational and financial statement for Al-Durrah Tourism Co.',
      scope: 'company',
      company_id: 'COMP-101',
      date: '2026-11-21 14:15',
      period_ar: 'من 01 نوفمبر إلى 21 نوفمبر 2026',
      period_en: '01 Nov to 21 Nov 2026'
    },
    'REP-20261120-04': {
      id: 'REP-20261120-04',
      title_ar: 'سجل التحصيلات والمدفوعات الإلكترونية',
      title_en: 'Electronic Collections & Payments Ledger',
      desc_ar: 'كشف الحركات المالية عبر بوابات الدفع الإلكتروني والبطاقات البنكية المعتمدة',
      desc_en: 'Ledger of electronic payment gateway transactions and bank cards',
      scope: 'internal',
      category: 'collections',
      date: '2026-11-20 20:00',
      period_ar: 'من 14 نوفمبر إلى 20 نوفمبر 2026',
      period_en: '14 Nov to 20 Nov 2026'
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
      period_en: '01 Nov to 19 Nov 2026'
    },
    'REP-20261118-06': {
      id: 'REP-20261118-06',
      title_ar: 'تقرير طلبات الاسترداد والإلغاءات الشهري',
      title_en: 'Monthly Refunds & Cancellations Report',
      desc_ar: 'حصر مبالغ الاسترداد المنفذة والمبالغ قيد المعالجة والإلغاءات حسب السياسة المعتمدة',
      desc_en: 'Monthly audit of processed refunds, in-review refunds, and policy deductions',
      scope: 'internal',
      category: 'refunds',
      date: '2026-11-18 16:45',
      period_ar: 'شهر أكتوبر ونصف نوفمبر 2026',
      period_en: 'October & mid-November 2026'
    },
    'REP-20261117-07': {
      id: 'REP-20261117-07',
      title_ar: 'كشف الحساب التشغيلي — شركة هداية المعتمد للسياحة',
      title_en: 'Operational Statement — Hedaya Al-Moatamad Tourism',
      desc_ar: 'كشف حساب مالي وتشغيلي معزول خاص بشركة هداية المعتمد للسياحة',
      desc_en: 'Isolated operational and financial statement for Hedaya Al-Moatamad Tourism',
      scope: 'company',
      company_id: 'COMP-103',
      date: '2026-11-17 12:30',
      period_ar: 'من 01 نوفمبر إلى 17 نوفمبر 2026',
      period_en: '01 Nov to 17 Nov 2026'
    },
    'REP-INVALID-COMP': {
      id: 'REP-INVALID-COMP',
      title_ar: 'سجل تدقيق لشركة ملغاة أو غير مسجلة',
      title_en: 'Audit Record for Unregistered Company',
      desc_ar: 'سجل تاريخي تجريبي لاختبار التحقق من الشركات غير الصالحة',
      desc_en: 'Simulated historical record testing invalid company handling',
      scope: 'company',
      company_id: 'COMP-UNKNOWN-HIST',
      date: '2026-11-16 10:00',
      period_ar: 'نوفمبر 2026',
      period_en: 'November 2026'
    },
    'REP-HIST-MISSING-COMP': {
      id: 'REP-HIST-MISSING-COMP',
      title_ar: 'سجل تاريخي بدون معرف شركة',
      title_en: 'Historical Record Missing Company ID',
      desc_ar: 'سجل تدقيق تاريخي غير صالح لاختبار حالة عدم تعيين الشركة',
      desc_en: 'Invalid historical audit record testing missing company ID state',
      scope: 'company',
      date: '2026-11-15 09:00',
      period_ar: 'نوفمبر 2026',
      period_en: 'November 2026'
    },
    'REP-HIST-EMPTY-COMP': {
      id: 'REP-HIST-EMPTY-COMP',
      title_ar: 'سجل تاريخي بمعرف شركة فارغ',
      title_en: 'Historical Record Empty Company ID',
      desc_ar: 'سجل تدقيق تاريخي غير صالح لاختبار حالة رمز الشركة الفارغ',
      desc_en: 'Invalid historical audit record testing empty company ID state',
      scope: 'company',
      company_id: '',
      date: '2026-11-15 09:15',
      period_ar: 'نوفمبر 2026',
      period_en: 'November 2026'
    },
    'REP-HIST-COMP-999': {
      id: 'REP-HIST-COMP-999',
      title_ar: 'سجل تدقيق لشركة ملغاة أو غير مسجلة (COMP-999)',
      title_en: 'Audit Record for Unregistered Company (COMP-999)',
      desc_ar: 'سجل تاريخي تجريبي لاختبار التحقق من الشركات غير الصالحة',
      desc_en: 'Simulated historical record testing invalid company handling',
      scope: 'company',
      company_id: 'COMP-999',
      date: '2026-11-16 10:00',
      period_ar: 'نوفمبر 2026',
      period_en: 'November 2026'
    },
    'REP-HIST-COMP-104': {
      id: 'REP-HIST-COMP-104',
      title_ar: 'كشف حساب شركة الصفا للسياحة',
      title_en: 'Company Statement — Al-Safa Tourism',
      desc_ar: 'كشف حساب مالي للشركة المسجلة الصفا للسياحة ذات العمليات الصفرية',
      desc_en: 'Financial statement for registered company Al-Safa with zero operations',
      scope: 'company',
      company_id: 'COMP-104',
      date: '2026-11-14 16:00',
      period_ar: 'من 01 نوفمبر إلى 14 نوفمبر 2026',
      period_en: '01 Nov to 14 Nov 2026'
    }
  };

  let activeReport = null;
  let activeWorksheetId = 'summary';
  let selectedExportFormat = 'xlsx';

  function getLang() {
    return document.documentElement.getAttribute('lang') || 'ar';
  }

  function isRTL() {
    return getLang() === 'ar';
  }

  function formatEGP(num) {
    if (num === null || num === undefined || isNaN(num)) return '0 ج.م';
    return Number(num).toLocaleString('ar-EG') + ' ج.م';
  }

  function formatEGP_EN(num) {
    if (num === null || num === undefined || isNaN(num)) return '0 EGP';
    return Number(num).toLocaleString('en-US') + ' EGP';
  }

  // --- 2. Multi-Worksheet Data Builders ---

  function buildCompanyReportData(comp, periodStr) {
    const rtl = isRTL();
    const period = periodStr || (rtl ? 'نوفمبر 2026' : 'November 2026');
    const compDatasets = COMPANY_ISOLATED_DATASETS[comp.id] || { bookings: [], settlements: [], refunds: [] };

    return {
      id: 'REP-COMP-' + comp.id,
      scope: 'company',
      title_ar: `كشف حساب تشغيلي ومالي معزول — ${comp.name_ar}`,
      title_en: `Isolated Operational & Financial Statement — ${comp.name_en}`,
      desc_ar: `بيانات تشغيلية ومالية معزولة خاصة بشركة السياحة، لا تتضمن أي مذكرات داخلية أو عمولات خاصة بميقات. ترخيص: ${comp.license} (${comp.city})`,
      desc_en: `Strictly isolated company financial statement. Contains zero internal Miqat commissions or internal notes. License: ${comp.license} (${comp.city})`,
      period_ar: period,
      period_en: period,
      date: '2026-11-23 17:30',
      company: comp,
      kpis: [
        { label: rtl ? 'الرحلات النشطة' : 'Active Trips', val: comp.active_trips + ' ' + (rtl ? 'رحلات' : 'trips'), class: 'kpi-blue' },
        { label: rtl ? 'الحجوزات / المعتمرين' : 'Bookings / Pilgrims', val: `${comp.total_bookings} (${comp.total_pilgrims} ${rtl ? 'معتمر' : 'pax'})`, class: 'kpi-primary' },
        { label: rtl ? 'محصل مباشر للشركة' : 'Direct Co. Collections', val: rtl ? formatEGP(comp.collected_direct_egp) : formatEGP_EN(comp.collected_direct_egp), class: 'kpi-primary' },
        { label: rtl ? 'محصل عبر ميقات' : 'Miqat Platform Collections', val: rtl ? formatEGP(comp.collected_miqat_egp) : formatEGP_EN(comp.collected_miqat_egp), class: 'kpi-primary' },
        { label: rtl ? 'مبالغ معلقة قيد التحصيل' : 'Pending Collections', val: rtl ? formatEGP(comp.pending_collections_egp) : formatEGP_EN(comp.pending_collections_egp), class: 'kpi-warning' },
        { label: rtl ? 'تسويات مكتملة ومحولة' : 'Completed Settlements', val: rtl ? formatEGP(comp.settlements_completed_egp) : formatEGP_EN(comp.settlements_completed_egp), class: 'kpi-primary' },
        { label: rtl ? 'تسويات جارية قيد الاستحقاق' : 'Pending Settlements Due', val: rtl ? formatEGP(comp.settlements_pending_egp) : formatEGP_EN(comp.settlements_pending_egp), class: 'kpi-warning' },
        { label: rtl ? 'استردادات منفذة للعملاء' : 'Approved Refunds', val: rtl ? formatEGP(comp.refunds_approved_egp) : formatEGP_EN(comp.refunds_approved_egp), class: 'kpi-secondary' },
        { label: rtl ? 'استردادات قيد المعالجة' : 'Refunds in Process', val: rtl ? formatEGP(comp.refunds_processing_egp) : formatEGP_EN(comp.refunds_processing_egp), class: 'kpi-warning' }
      ],
      worksheets: [
        {
          id: 'summary',
          title_ar: 'الملخص التنفيذي وحساب الشركة',
          title_en: 'Executive Statement & Account Summary',
          recordsCount: 9,
          records: [
            { ref: 'ST-01', item_ar: 'الرحلات التشغيلية المعتمدة', item_en: 'Approved Operational Trips', count: comp.active_trips, approved_val: rtl ? formatEGP(comp.collected_direct_egp + comp.collected_miqat_egp) : formatEGP_EN(comp.collected_direct_egp + comp.collected_miqat_egp), status: rtl ? 'معتمد' : 'Certified' },
            { ref: 'ST-02', item_ar: 'إجمالي حجوزات المعتمرين', item_en: 'Pilgrim Bookings Total', count: comp.total_bookings, approved_val: `${comp.total_pilgrims} ${rtl ? 'معتمر' : 'pax'}`, status: rtl ? 'مطابق' : 'Reconciled' },
            { ref: 'ST-03', item_ar: 'المتحصل المباشر لخزينة الشركة', item_en: 'Direct Company Cash Intake', count: comp.total_bookings, approved_val: rtl ? formatEGP(comp.collected_direct_egp) : formatEGP_EN(comp.collected_direct_egp), status: rtl ? 'معتمد' : 'Certified' },
            { ref: 'ST-04', item_ar: 'المتحصل عبر بوابات ميقات', item_en: 'Platform Gateway Intake', count: comp.total_bookings, approved_val: rtl ? formatEGP(comp.collected_miqat_egp) : formatEGP_EN(comp.collected_miqat_egp), status: rtl ? 'مطابق' : 'Reconciled' },
            { ref: 'ST-05', item_ar: 'التسويات البنكية المنفذة', item_en: 'Completed Bank Settlements', count: 2, approved_val: rtl ? formatEGP(comp.settlements_completed_egp) : formatEGP_EN(comp.settlements_completed_egp), status: rtl ? 'محول' : 'Transferred' },
            { ref: 'ST-06', item_ar: 'التسويات الجارية المستحقة', item_en: 'Pending Settlements Due', count: 1, approved_val: rtl ? formatEGP(comp.settlements_pending_egp) : formatEGP_EN(comp.settlements_pending_egp), status: rtl ? 'قيد التحويل' : 'In Process' }
          ]
        },
        {
          id: 'bookings',
          title_ar: 'سجل المعتمرين والحجوزات المعتمدة',
          title_en: 'Pilgrim Bookings Ledger',
          recordsCount: compDatasets.bookings.length,
          records: compDatasets.bookings
        },
        {
          id: 'settlements',
          title_ar: 'التسويات البنكية وإشعارات الصرف',
          title_en: 'Bank Settlement Transfers',
          recordsCount: compDatasets.settlements.length,
          records: compDatasets.settlements
        },
        {
          id: 'refunds',
          title_ar: 'استردادات العملاء والخصومات',
          title_en: 'Client Deductions & Refunds',
          recordsCount: compDatasets.refunds.length,
          records: compDatasets.refunds
        }
      ]
    };
  }

  function buildInternalReportData(item) {
    const rtl = isRTL();
    const period = (item && item.period_ar) ? (rtl ? item.period_ar : item.period_en) : (rtl ? 'نوفمبر 2026' : 'November 2026');

    return {
      id: item ? item.id : 'REP-INT-20261123',
      scope: 'internal',
      title_ar: item ? item.title_ar : 'التقرير المالي والتشغيلي المتكامل — منصة ميقات',
      title_en: item ? item.title_en : 'Comprehensive Financial & Operational Report — Miqat Platform',
      desc_ar: item ? item.desc_ar : 'بيانات مفصلة ومعتمدة للتدقيق المالي والتشغيلي ومطابقة القيود المحاسبية عبر كافة أقسام الحسابات',
      desc_en: item ? item.desc_en : 'Detailed certified records for financial and operational auditing across all accounts modules',
      period_ar: period,
      period_en: period,
      date: item ? item.date : '2026-11-23 09:30',
      kpis: [
        { label: rtl ? 'إجمالي الحجوزات المسجلة' : 'Total Registered Bookings', val: '1,429 ' + (rtl ? 'حجز' : 'bookings'), class: 'kpi-primary' },
        { label: rtl ? 'المبالغ المحصلة والمعتمدة' : 'Approved Collections', val: rtl ? formatEGP(22060000) : formatEGP_EN(22060000), class: 'kpi-primary' },
        { label: rtl ? 'مبالغ معلقة قيد التحصيل' : 'Pending Collections', val: rtl ? formatEGP(1515000) : formatEGP_EN(1515000), class: 'kpi-warning' },
        { label: rtl ? 'مبالغ مستردة فعلياً للعملاء' : 'Actually Refunded to Clients', val: rtl ? formatEGP(728000) : formatEGP_EN(728000), class: 'kpi-secondary' },
        { label: rtl ? 'استردادات قيد المعالجة' : 'Refunds in Process', val: rtl ? formatEGP(176000) : formatEGP_EN(176000), class: 'kpi-warning' },
        { label: rtl ? 'تسويات شركات السياحة المنفذة' : 'Completed Company Settlements', val: rtl ? formatEGP(18050000) : formatEGP_EN(18050000), class: 'kpi-primary' },
        { label: rtl ? 'تسويات معلقة مستحقة' : 'Pending Settlements Due', val: rtl ? formatEGP(2010000) : formatEGP_EN(2010000), class: 'kpi-warning' },
        { label: rtl ? 'تعديلات البرامج والرحلات' : 'Program Modifications', val: '77 ' + (rtl ? 'تعديلاً' : 'modifications'), class: 'kpi-blue' }
      ],
      worksheets: [
        {
          id: 'summary',
          title_ar: 'الملخص التنفيذي والمطابقة المركزية',
          title_en: 'Executive Summary & Platform Reconciliation',
          recordsCount: 5,
          records: [
            { ref: 'INT-BKG-881', category_ar: 'سجل الحجوزات والتعاقدات', category_en: 'Confirmed Bookings', count: 1140, approved_amt: 18200000, pending_amt: 950000, status: rtl ? 'معتمد' : 'Approved' },
            { ref: 'INT-COL-442', category_ar: 'التحصيلات والمدفوعات الإلكترونية', category_en: 'Collections & Deposits', count: 980, approved_amt: 22060000, pending_amt: 1515000, status: rtl ? 'مطابق' : 'Reconciled' },
            { ref: 'INT-REF-119', category_ar: 'طلبات الاسترداد المالي', category_en: 'Refund Requests', count: 38, approved_amt: 728000, pending_amt: 176000, status: rtl ? 'قيد التدقيق' : 'In Review' },
            { ref: 'INT-SET-205', category_ar: 'تسويات شركات السياحة', category_en: 'Tourism Company Settlements', count: 24, approved_amt: 18050000, pending_amt: 2010000, status: rtl ? 'معتمد وجاري' : 'Processed' },
            { ref: 'INT-MOD-088', category_ar: 'تعديلات وتغيير باقات البرامج', category_en: 'Program Modifications', count: 77, approved_amt: 1450000, pending_amt: 65000, status: rtl ? 'مكتمل' : 'Completed' }
          ]
        },
        {
          id: 'bookings',
          title_ar: 'سجل الحجوزات والتعاقدات المؤكدة',
          title_en: 'Confirmed Bookings Ledger',
          recordsCount: 5,
          records: [
            { ref: 'BKG-INT-9901', customer: 'خالد عبد السلام محمود', customer_en: 'Khaled Abdel-Salam', company: 'شركة الدرة للسياحة', company_en: 'Al-Durrah Tourism', amt: 125000, commission: 6250, status: rtl ? 'مؤكد ومقيد' : 'Certified' },
            { ref: 'BKG-INT-9902', customer: 'أماني فوزي إبراهيم', customer_en: 'Amani Fawzy Ibrahim', company: 'شركة نسك الهدى', company_en: 'Nusuk Al-Huda', amt: 85000, commission: 4250, status: rtl ? 'مؤكد ومقيد' : 'Certified' },
            { ref: 'BKG-INT-9903', customer: 'محسن عبد الجواد', customer_en: 'Mohsen Abdel-Gawad', company: 'شركة هداية المعتمد', company_en: 'Hedaya Tourism', amt: 96000, commission: 4800, status: rtl ? 'مؤكد ومقيد' : 'Certified' },
            { ref: 'BKG-INT-9904', customer: 'زينب أحمد توفيق', customer_en: 'Zeinab Ahmed Tawfik', company: 'شركة الدرة للسياحة', company_en: 'Al-Durrah Tourism', amt: 110000, commission: 5500, status: rtl ? 'مؤكد ومقيد' : 'Certified' },
            { ref: 'BKG-INT-9905', customer: 'سامي عبد العزيز', customer_en: 'Sami Abdel-Aziz', company: 'شركة الصفا والمروة', company_en: 'Al-Safa Tourism', amt: 78000, commission: 3900, status: rtl ? 'مؤكد ومقيد' : 'Certified' }
          ]
        },
        {
          id: 'collections',
          title_ar: 'التحصيلات والمدفوعات الإلكترونية',
          title_en: 'Electronic Collections & Gateway Receipts',
          recordsCount: 4,
          records: [
            { ref: 'PAY-GW-4401', method: 'بطاقة ائتمانية (Visa / MC)', method_en: 'Credit Card (Visa/MC)', tx_count: 512, gross_amt: 12450000, gateway_fee: 186750, net_amt: 12263250, status: rtl ? 'تم الإيداع البنكي' : 'Deposited' },
            { ref: 'PAY-GW-4402', method: 'مدى (Mada Debit)', method_en: 'Mada Debit Gateway', tx_count: 320, gross_amt: 6850000, gateway_fee: 68500, net_amt: 6781500, status: rtl ? 'تم الإيداع البنكي' : 'Deposited' },
            { ref: 'PAY-GW-4403', method: 'تحويل بنكي مباشر', method_en: 'Direct Bank Transfer', tx_count: 84, gross_amt: 2760000, gateway_fee: 0, net_amt: 2760000, status: rtl ? 'مطابق دفترياً' : 'Reconciled' },
            { ref: 'PAY-GW-4404', method: 'سندات قبض نقدية بالخزينة', method_en: 'Treasury Cash Receipts', tx_count: 64, gross_amt: 1515000, gateway_fee: 0, net_amt: 1515000, status: rtl ? 'قيد التوريد البنكي' : 'Pending Deposit' }
          ]
        },
        {
          id: 'settlements',
          title_ar: 'تسويات شركات السياحة والعمولات',
          title_en: 'Tourism Company Settlements & Commissions',
          recordsCount: 4,
          records: [
            { ref: 'SET-INT-501', company: 'شركة الدرة للسياحة', company_en: 'Al-Durrah Tourism', gross_collected: 7960000, miqat_commission: 398000, net_transferred: 4650000, pending_transfer: 470000, status: rtl ? 'محول' : 'Completed' },
            { ref: 'SET-INT-502', company: 'شركة نسك الهدى', company_en: 'Nusuk Al-Huda', gross_collected: 5130000, miqat_commission: 256500, net_transferred: 3120000, pending_transfer: 360000, status: rtl ? 'محول' : 'Completed' },
            { ref: 'SET-INT-503', company: 'شركة هداية المعتمد', company_en: 'Hedaya Tourism', gross_collected: 6350000, miqat_commission: 317500, net_transferred: 3890000, pending_transfer: 360000, status: rtl ? 'محول' : 'Completed' },
            { ref: 'SET-INT-504', company: 'شركة الصفا والمروة', company_en: 'Al-Safa Tourism', gross_collected: 4310000, miqat_commission: 215500, net_transferred: 2610000, pending_transfer: 280000, status: rtl ? 'محول' : 'Completed' }
          ]
        },
        {
          id: 'refunds',
          title_ar: 'طلبات الاسترداد المالي والخصومات',
          title_en: 'Refund Requests & Deductions Ledger',
          recordsCount: 3,
          records: [
            { ref: 'REF-INT-1101', customer: 'ياسر محمد فؤاد', customer_en: 'Yasser Mohamed Fouad', company: 'شركة الدرة للسياحة', requested_amt: 45000, policy_penalty: 4500, approved_refund: 40500, status: rtl ? 'تم الصرف البنكي' : 'Disbursed' },
            { ref: 'REF-INT-1102', customer: 'عادل يوسف كامل', customer_en: 'Adel Youssef Kamel', company: 'شركة نسك الهدى', requested_amt: 35000, policy_penalty: 3500, approved_refund: 31500, status: rtl ? 'تم الصرف البنكي' : 'Disbursed' },
            { ref: 'REF-INT-1103', customer: 'سعاد أحمد خليل', customer_en: 'Soad Ahmed Khalil', company: 'شركة الدرة للسياحة', requested_amt: 25000, policy_penalty: 2500, approved_refund: 22500, status: rtl ? 'قيد المراجعة المصرفية' : 'Pending' }
          ]
        }
      ]
    };
  }

  // --- 3. View Resolution and Rendering ---

  function resolveReport() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const scope = params.get('scope');
    const rawCompanyParam = params.get('companyId') || params.get('company');
    const companyId = rawCompanyParam ? rawCompanyParam.trim() : '';

    // 1. Check if ID matches pre-configured catalog
    if (id && REPORTS_CATALOG[id]) {
      const item = REPORTS_CATALOG[id];
      if (item.scope === 'company') {
        // Strict Historical Identity Validation: item.company_id is authoritative and immutable
        const histCompId = item.company_id ? String(item.company_id).trim() : '';
        if (!histCompId) {
          activeReport = { scope: 'invalid_company', invalidCompanyId: 'NOT_SPECIFIED' };
          return;
        }
        const comp = TOURISM_COMPANIES.find(c => c.id === histCompId);
        if (!comp) {
          activeReport = { scope: 'invalid_company', invalidCompanyId: histCompId };
          return;
        }
        // If a URL companyId is supplied and differs from item.company_id, reject the mismatch
        if (companyId && companyId !== histCompId) {
          activeReport = { scope: 'invalid_company', invalidCompanyId: 'MISMATCH', isMismatch: true };
          return;
        }
        activeReport = buildCompanyReportData(comp, isRTL() ? item.period_ar : item.period_en);
        activeReport.id = item.id;
      } else {
        activeReport = buildInternalReportData(item);
      }
      return;
    }

    // 2. Check if company scope is passed (or companyId parameter exists)
    if (scope === 'company' || rawCompanyParam !== null) {
      if (!companyId) {
        activeReport = { scope: 'invalid_company', invalidCompanyId: 'NOT_SPECIFIED' };
        return;
      }
      const comp = TOURISM_COMPANIES.find(c => c.id === companyId);
      if (!comp) {
        activeReport = { scope: 'invalid_company', invalidCompanyId: companyId };
        return;
      }
      const from = params.get('from');
      const to = params.get('to');
      const periodStr = from && to ? `${from} — ${to}` : null;
      activeReport = buildCompanyReportData(comp, periodStr);
      return;
    }

    // 3. Check SessionStorage for on-demand generated report
    try {
      const sessionData = sessionStorage.getItem('miqat_active_report');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.scope === 'company') {
          const compId = parsed.company ? parsed.company.id : null;
          const comp = compId && TOURISM_COMPANIES.find(c => c.id === compId);
          if (!comp) {
            activeReport = { scope: 'invalid_company', invalidCompanyId: compId || 'NOT_SPECIFIED' };
            return;
          }
          activeReport = buildCompanyReportData(comp, parsed.period);
          if (parsed.reportId) activeReport.id = parsed.reportId;
          return;
        } else {
          activeReport = buildInternalReportData(null);
          if (parsed.period) {
            activeReport.period_ar = parsed.period;
            activeReport.period_en = parsed.period;
          }
          if (parsed.reportId) activeReport.id = parsed.reportId;
          return;
        }
      }
    } catch (e) {}

    // 4. Default: Standard Internal Miqat Report
    activeReport = buildInternalReportData(REPORTS_CATALOG['REP-20261123-01']);
  }

  function renderView() {
    if (!activeReport) return;
    window.__MIQAT_ACTIVE_REPORT = activeReport;
    const rep = activeReport;
    const rtl = isRTL();

    // DOM Elements
    const idEl = document.getElementById('rep-det-id');
    const breadcrumbIdEl = document.getElementById('rep-det-breadcrumb-id');
    const scopeBadge = document.getElementById('rep-det-scope-badge');
    const periodBadge = document.getElementById('rep-det-period-badge');
    const titleEl = document.getElementById('rep-det-title');
    const descEl = document.getElementById('rep-det-desc');
    const genDateEl = document.getElementById('rep-det-generated-date');
    const isolationAlert = document.getElementById('rep-det-isolation-alert');
    const kpiGrid = document.getElementById('rep-det-kpi-grid');
    const invalidStateEl = document.getElementById('rep-det-invalid-state');
    const metaCard = document.querySelector('.rep-det-meta-card');
    const kpisCard = document.querySelector('.rep-det-kpis-card');
    const worksheetWrap = document.querySelector('.rep-worksheet-nav-wrap');
    const tableCard = document.querySelector('.rep-det-table-card');

    const btnXlsx = document.getElementById('rep-det-export-xlsx');
    const btnPdf = document.getElementById('rep-det-export-pdf');
    const btnCsv = document.getElementById('rep-det-export-csv');

    // === STRICT INVALID-COMPANY RESOLUTION (Never substitute another company) ===
    if (rep.scope === 'invalid_company') {
      // 1. Render Dedicated Institutional Invalid State
      if (invalidStateEl) {
        invalidStateEl.style.display = 'flex';
        const codePill = document.getElementById('rep-det-invalid-code-pill');
        if (codePill) {
          codePill.textContent = 'CODE: ' + String(rep.invalidCompanyId || 'UNKNOWN').slice(0, 32);
        }
      }

      // 2. Hide all normal report containers so no data is visible behind/underneath
      if (metaCard) metaCard.style.display = 'none';
      if (isolationAlert) isolationAlert.style.display = 'none';
      if (kpisCard) kpisCard.style.display = 'none';
      if (worksheetWrap) worksheetWrap.style.display = 'none';
      if (tableCard) tableCard.style.display = 'none';

      // 3. Purge dynamic content from DOM to prevent any stale data leakage
      if (kpiGrid) kpiGrid.innerHTML = '';
      const tableEl = document.getElementById('rep-det-table');
      if (tableEl) tableEl.innerHTML = '';
      const navEl = document.getElementById('rep-worksheet-tabs');
      if (navEl) navEl.innerHTML = '';

      // 4. Update Header Badges to Institutional Access-Denied State
      if (idEl) idEl.textContent = 'ACCESS-DENIED';
      if (breadcrumbIdEl) breadcrumbIdEl.textContent = rtl ? 'تعذر الوصول' : 'Access Denied';
      if (scopeBadge) {
        scopeBadge.className = 'acc-status-pill status-pill-amber';
        scopeBadge.textContent = rtl ? 'عزل الحسابات — رمز غير صالح' : 'Access Denied — Invalid Code';
      }
      if (periodBadge) {
        periodBadge.className = 'acc-status-pill status-pill-slate';
        periodBadge.textContent = rtl ? 'غير متاح' : 'Unavailable';
      }

      // 5. Disable and lock export buttons
      [btnXlsx, btnPdf, btnCsv].forEach(btn => {
        if (!btn) return;
        btn.disabled = true;
        btn.style.opacity = '0.45';
        btn.style.pointerEvents = 'none';
        btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('title', rtl ? 'التصدير غير متاح لحالة خطأ في رمز الشركة' : 'Export disabled for invalid company');
      });

      document.title = (rtl ? 'تعذر تحميل كشف الحساب | منصة ميقات' : 'Unable to Load Account Statement | Miqat');
      return;
    }

    // === VALID REPORT RESOLUTION (Reset invalid state and restore UI) ===
    if (invalidStateEl) invalidStateEl.style.display = 'none';
    if (metaCard) metaCard.style.display = 'flex';
    if (kpisCard) kpisCard.style.display = 'block';
    if (worksheetWrap) worksheetWrap.style.display = 'flex';
    if (tableCard) tableCard.style.display = 'block';

    // Re-enable export actions
    [btnXlsx, btnPdf, btnCsv].forEach(btn => {
      if (!btn) return;
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
      btn.removeAttribute('aria-disabled');
      btn.removeAttribute('title');
    });

    if (idEl) idEl.textContent = rep.id;
    if (breadcrumbIdEl) breadcrumbIdEl.textContent = rep.id;
    if (titleEl) titleEl.textContent = rtl ? rep.title_ar : rep.title_en;
    if (descEl) descEl.textContent = rtl ? rep.desc_ar : rep.desc_en;
    if (genDateEl) genDateEl.textContent = rep.date;

    const operatorEl = document.getElementById('rep-det-operator');
    if (operatorEl) {
      operatorEl.textContent = rtl ? 'موظف الحسابات' : 'Accounts Employee';
    }

    if (periodBadge) {
      periodBadge.textContent = `${rtl ? 'الفترة:' : 'Period:'} ${rtl ? rep.period_ar : rep.period_en}`;
    }

    if (scopeBadge) {
      scopeBadge.className = 'acc-status-pill ' + (rep.scope === 'company' ? 'status-pill-amber' : 'status-pill-navy');
      scopeBadge.textContent = rep.scope === 'company'
        ? (rtl ? 'تقرير شركة سياحة (معزول)' : 'Isolated Tourism Company Report')
        : (rtl ? 'تقرير داخلي معتمد' : 'Certified Internal Report');
    }

    // Strict Data Isolation Alert
    if (isolationAlert) {
      isolationAlert.style.display = rep.scope === 'company' ? 'flex' : 'none';
    }

    // Render KPI Cards (Strict typography standard: 1.30rem bold value, 0.76rem label)
    if (kpiGrid) {
      kpiGrid.innerHTML = rep.kpis.map(k => `
        <div class="rep-det-kpi-card ${k.class || ''}">
          <span class="rep-det-kpi-label">${k.label}</span>
          <strong class="rep-det-kpi-val">${k.val}</strong>
        </div>
      `).join('');
    }

    // Render Worksheets Nav
    renderWorksheetNav();

    // Render Active Worksheet Table
    renderActiveWorksheetTable();

    // Set Document Title
    document.title = (rtl ? `${rep.title_ar} | تفاصيل ومعاينة التقرير | منصة ميقات` : `${rep.title_en} | Report Details & Preview | Miqat Platform`);
  }

  function renderWorksheetNav() {
    const navEl = document.getElementById('rep-worksheet-tabs');
    if (!navEl || !activeReport || !activeReport.worksheets) return;
    const rtl = isRTL();

    navEl.innerHTML = activeReport.worksheets.map((ws, idx) => {
      const isActive = ws.id === activeWorksheetId || (!activeWorksheetId && idx === 0);
      if (idx === 0 && !activeWorksheetId) activeWorksheetId = ws.id;

      return `
        <button type="button" class="rep-worksheet-tab ${isActive ? 'is-active' : ''}" data-sheet-id="${ws.id}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">
          <span>${rtl ? ws.title_ar : ws.title_en}</span>
          <span class="rep-worksheet-tab-count">${ws.recordsCount}</span>
        </button>
      `;
    }).join('');

    // Attach Click Handlers to Tabs
    navEl.querySelectorAll('.rep-worksheet-tab').forEach(btn => {
      btn.addEventListener('click', function () {
        const sheetId = this.getAttribute('data-sheet-id');
        activeWorksheetId = sheetId;
        navEl.querySelectorAll('.rep-worksheet-tab').forEach(b => {
          const active = b === this;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderActiveWorksheetTable();
      });
    });
  }

  function renderActiveWorksheetTable() {
    const tableEl = document.getElementById('rep-det-table');
    const sheetTitleEl = document.getElementById('rep-det-sheet-title');
    const sheetSubtitleEl = document.getElementById('rep-det-sheet-subtitle');
    const countBadge = document.getElementById('rep-det-record-count-badge');
    if (!tableEl || !activeReport || !activeReport.worksheets) return;

    const rtl = isRTL();
    const currentSheet = activeReport.worksheets.find(ws => ws.id === activeWorksheetId) || activeReport.worksheets[0];

    if (sheetTitleEl) sheetTitleEl.textContent = rtl ? currentSheet.title_ar : currentSheet.title_en;
    if (sheetSubtitleEl) {
      sheetSubtitleEl.textContent = rtl
        ? `كافة القيود والبيانات المعتمدة ضمن ورقة العمل: ${currentSheet.title_ar}`
        : `All certified records within worksheet: ${currentSheet.title_en}`;
    }
    if (countBadge) {
      countBadge.textContent = rtl
        ? `${currentSheet.recordsCount} سجلات معتمدة`
        : `${currentSheet.recordsCount} certified records`;
    }

    // Dynamic Worksheet Table Renderers
    if (activeReport.scope === 'company') {
      renderCompanySheetTable(tableEl, currentSheet, rtl);
    } else {
      renderInternalSheetTable(tableEl, currentSheet, rtl);
    }
  }

  function renderCompanySheetTable(tableEl, sheet, rtl) {
    if (sheet.id === 'summary') {
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'الرمز' : 'Code'}</th>
            <th>${rtl ? 'بند الكشف المالي' : 'Statement Item'}</th>
            <th>${rtl ? 'العدد / الحالات' : 'Count / Cases'}</th>
            <th>${rtl ? 'القيمة الإجمالية المعتمدة' : 'Approved Total'}</th>
            <th>${rtl ? 'الحالة المحاسبية' : 'Accounting Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.item_ar : r.item_en}</strong></td>
              <td><span class="acc-status-pill status-pill-slate">${r.count}</span></td>
              <td class="rep-val-primary is-bold"><bdi dir="ltr">${r.approved_val}</bdi></td>
              <td><span class="acc-status-pill status-pill-navy">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'bookings') {
      if (!sheet.records || sheet.records.length === 0) {
        tableEl.innerHTML = `
          <thead>
            <tr>
              <th>${rtl ? 'رقم الحجز' : 'Booking Ref'}</th>
              <th>${rtl ? 'اسم المعتمر / العميل' : 'Customer Name'}</th>
              <th>${rtl ? 'البرنامج / الرحلة' : 'Trip / Program'}</th>
              <th>${rtl ? 'المعتمرين' : 'Pax'}</th>
              <th>${rtl ? 'مباشر للشركة' : 'Direct (Co.)'}</th>
              <th>${rtl ? 'عبر ميقات' : 'Via Miqat'}</th>
              <th>${rtl ? 'مبالغ معلقة' : 'Pending'}</th>
              <th>${rtl ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="8" style="text-align:center; padding: 2.75rem 1rem; color: var(--color-text-muted);">
                <p style="margin: 0 0 0.35rem 0; font-size: 0.86rem; font-weight: 600; color: var(--color-text);">${rtl ? 'لا توجد حجوزات مسجلة لهذه الشركة خلال الفترة المحددة' : 'No bookings recorded for this company in the selected period'}</p>
                <span style="font-size: 0.76rem; color: var(--color-text-muted);">${rtl ? 'بيانات معزولة خاصة بالشركة — لم يتم استدعاء أي سجلات لشركات أخرى' : 'Strictly isolated dataset — zero cross-company records loaded'}</span>
              </td>
            </tr>
          </tbody>
        `;
        return;
      }
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رقم الحجز' : 'Booking Ref'}</th>
            <th>${rtl ? 'اسم المعتمر / العميل' : 'Customer Name'}</th>
            <th>${rtl ? 'البرنامج / الرحلة' : 'Trip / Program'}</th>
            <th>${rtl ? 'المعتمرين' : 'Pax'}</th>
            <th>${rtl ? 'مباشر للشركة' : 'Direct (Co.)'}</th>
            <th>${rtl ? 'عبر ميقات' : 'Via Miqat'}</th>
            <th>${rtl ? 'مبالغ معلقة' : 'Pending'}</th>
            <th>${rtl ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.customer : r.customer_en}</strong></td>
              <td><span>${rtl ? r.trip : r.trip_en}</span></td>
              <td><span class="acc-status-pill status-pill-slate">${r.pax} ${rtl ? 'أفراد' : 'pax'}</span></td>
              <td class="rep-val-primary"><bdi dir="ltr">${rtl ? formatEGP(r.direct_amt) : formatEGP_EN(r.direct_amt)}</bdi></td>
              <td class="rep-val-primary"><bdi dir="ltr">${rtl ? formatEGP(r.miqat_amt) : formatEGP_EN(r.miqat_amt)}</bdi></td>
              <td style="color:${r.pending_amt > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)'}; font-weight:600;">
                <bdi dir="ltr">${r.pending_amt > 0 ? (rtl ? formatEGP(r.pending_amt) : formatEGP_EN(r.pending_amt)) : '—'}</bdi>
              </td>
              <td><span class="acc-status-pill status-pill-navy">${rtl ? r.status : r.status_en}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'settlements') {
      if (!sheet.records || sheet.records.length === 0) {
        tableEl.innerHTML = `
          <thead>
            <tr>
              <th>${rtl ? 'رقم التسوية' : 'Settlement Ref'}</th>
              <th>${rtl ? 'تاريخ التحويل' : 'Transfer Date'}</th>
              <th>${rtl ? 'دفعة التسوية' : 'Batch Code'}</th>
              <th>${rtl ? 'المبلغ المحول للشركة' : 'Amount Credited'}</th>
              <th>${rtl ? 'المرجع البنكي' : 'Bank Reference'}</th>
              <th>${rtl ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" style="text-align:center; padding: 2.75rem 1rem; color: var(--color-text-muted);">
                <p style="margin: 0 0 0.35rem 0; font-size: 0.86rem; font-weight: 600; color: var(--color-text);">${rtl ? 'لا توجد تسويات بنكية مسجلة لهذه الشركة خلال الفترة المحددة' : 'No bank settlements recorded for this company in the selected period'}</p>
                <span style="font-size: 0.76rem; color: var(--color-text-muted);">${rtl ? 'بيانات معزولة خاصة بالشركة — لم يتم استدعاء أي سجلات لشركات أخرى' : 'Strictly isolated dataset — zero cross-company records loaded'}</span>
              </td>
            </tr>
          </tbody>
        `;
        return;
      }
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رقم التسوية' : 'Settlement Ref'}</th>
            <th>${rtl ? 'تاريخ التحويل' : 'Transfer Date'}</th>
            <th>${rtl ? 'دفعة التسوية' : 'Batch Code'}</th>
            <th>${rtl ? 'المبلغ المحول للشركة' : 'Amount Credited'}</th>
            <th>${rtl ? 'المرجع البنكي' : 'Bank Reference'}</th>
            <th>${rtl ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><span class="rep-table-mono" dir="ltr">${r.date}</span></td>
              <td><span class="rep-table-mono" dir="ltr">${r.batch}</span></td>
              <td class="rep-val-primary is-bold"><bdi dir="ltr">${rtl ? formatEGP(r.transferred_amt) : formatEGP_EN(r.transferred_amt)}</bdi></td>
              <td><strong class="rep-table-mono" dir="ltr">${r.bank_ref}</strong></td>
              <td><span class="acc-status-pill status-pill-navy">${rtl ? r.status : r.status_en}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'refunds') {
      if (!sheet.records || sheet.records.length === 0) {
        tableEl.innerHTML = `
          <thead>
            <tr>
              <th>${rtl ? 'رقم الاسترداد' : 'Refund Ref'}</th>
              <th>${rtl ? 'اسم المعتمر' : 'Customer Name'}</th>
              <th>${rtl ? 'البرنامج' : 'Trip'}</th>
              <th>${rtl ? 'المبلغ الإجمالي' : 'Gross Amount'}</th>
              <th>${rtl ? 'خصم السياسة' : 'Policy Deduction'}</th>
              <th>${rtl ? 'المسترد الصافي' : 'Net Refund'}</th>
              <th>${rtl ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" style="text-align:center; padding: 2.75rem 1rem; color: var(--color-text-muted);">
                <p style="margin: 0 0 0.35rem 0; font-size: 0.86rem; font-weight: 600; color: var(--color-text);">${rtl ? 'لا توجد طلبات استرداد مالي منفذة أو جارية لهذه الشركة' : 'No refund requests recorded for this company in the selected period'}</p>
                <span style="font-size: 0.76rem; color: var(--color-text-muted);">${rtl ? 'بيانات معزولة خاصة بالشركة — لم يتم استدعاء أي سجلات لشركات أخرى' : 'Strictly isolated dataset — zero cross-company records loaded'}</span>
              </td>
            </tr>
          </tbody>
        `;
        return;
      }
    }
  }

  function renderInternalSheetTable(tableEl, sheet, rtl) {
    if (sheet.id === 'summary') {
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رمز البند' : 'Item Code'}</th>
            <th>${rtl ? 'تصنيف العمليات المالية' : 'Operation Category'}</th>
            <th>${rtl ? 'العدد الإجمالي' : 'Total Count'}</th>
            <th>${rtl ? 'المبالغ المعتمدة والمحصلة' : 'Approved / Cleared'}</th>
            <th>${rtl ? 'المبالغ المعلقة قيد التحصيل' : 'Pending Amounts'}</th>
            <th>${rtl ? 'حالة الاعتماد والتدقيق' : 'Audit Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.category_ar : r.category_en}</strong></td>
              <td><span class="acc-status-pill status-pill-slate">${r.count} ${rtl ? 'حركة' : 'items'}</span></td>
              <td class="rep-val-primary"><bdi dir="ltr">${rtl ? formatEGP(r.approved_amt) : formatEGP_EN(r.approved_amt)}</bdi></td>
              <td style="color:var(--color-warning); font-weight:600;"><bdi dir="ltr">${rtl ? formatEGP(r.pending_amt) : formatEGP_EN(r.pending_amt)}</bdi></td>
              <td><span class="acc-status-pill status-pill-navy">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'bookings') {
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رقم الحجز' : 'Booking Ref'}</th>
            <th>${rtl ? 'اسم العميل' : 'Customer Name'}</th>
            <th>${rtl ? 'شركة السياحة المتعاقدة' : 'Tourism Company'}</th>
            <th>${rtl ? 'إجمالي الحجز' : 'Booking Total'}</th>
            <th>${rtl ? 'عمولة ميقات' : 'Miqat Commission'}</th>
            <th>${rtl ? 'حالة القيد' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.customer : r.customer_en}</strong></td>
              <td><span>${rtl ? r.company : r.company_en}</span></td>
              <td class="rep-val-primary"><bdi dir="ltr">${rtl ? formatEGP(r.amt) : formatEGP_EN(r.amt)}</bdi></td>
              <td style="color:var(--color-accent); font-weight:600;"><bdi dir="ltr">${rtl ? formatEGP(r.commission) : formatEGP_EN(r.commission)}</bdi></td>
              <td><span class="acc-status-pill status-pill-navy">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'collections') {
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رقم البوابة' : 'Gateway Code'}</th>
            <th>${rtl ? 'وسيلة التحصيل' : 'Payment Method'}</th>
            <th>${rtl ? 'عدد العمليات' : 'Transactions'}</th>
            <th>${rtl ? 'المتحصل الإجمالي' : 'Gross Intake'}</th>
            <th>${rtl ? 'رسوم المعالجة' : 'Processing Fee'}</th>
            <th>${rtl ? 'الصافي المودع' : 'Net Deposited'}</th>
            <th>${rtl ? 'حالة الإيداع' : 'Deposit Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.method : r.method_en}</strong></td>
              <td><span class="acc-status-pill status-pill-slate">${r.tx_count} ${rtl ? 'عملية' : 'tx'}</span></td>
              <td><bdi dir="ltr">${rtl ? formatEGP(r.gross_amt) : formatEGP_EN(r.gross_amt)}</bdi></td>
              <td style="color:var(--color-text-muted);"><bdi dir="ltr">${rtl ? formatEGP(r.gateway_fee) : formatEGP_EN(r.gateway_fee)}</bdi></td>
              <td class="rep-val-primary is-bold"><bdi dir="ltr">${rtl ? formatEGP(r.net_amt) : formatEGP_EN(r.net_amt)}</bdi></td>
              <td><span class="acc-status-pill status-pill-navy">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'settlements') {
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رقم التسوية' : 'Settlement Ref'}</th>
            <th>${rtl ? 'شركة السياحة' : 'Company'}</th>
            <th>${rtl ? 'المتحصل الإجمالي' : 'Gross Collected'}</th>
            <th>${rtl ? 'عمولة ميقات' : 'Miqat Commission'}</th>
            <th>${rtl ? 'المسدد للشركة' : 'Settled to Co.'}</th>
            <th>${rtl ? 'المعلق المستحق' : 'Pending Due'}</th>
            <th>${rtl ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.company : r.company_en}</strong></td>
              <td><bdi dir="ltr">${rtl ? formatEGP(r.gross_collected) : formatEGP_EN(r.gross_collected)}</bdi></td>
              <td style="color:var(--color-accent); font-weight:600;"><bdi dir="ltr">${rtl ? formatEGP(r.miqat_commission) : formatEGP_EN(r.miqat_commission)}</bdi></td>
              <td class="rep-val-primary is-bold"><bdi dir="ltr">${rtl ? formatEGP(r.net_transferred) : formatEGP_EN(r.net_transferred)}</bdi></td>
              <td style="color:var(--color-warning); font-weight:600;"><bdi dir="ltr">${rtl ? formatEGP(r.pending_transfer) : formatEGP_EN(r.pending_transfer)}</bdi></td>
              <td><span class="acc-status-pill status-pill-navy">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (sheet.id === 'refunds') {
      tableEl.innerHTML = `
        <thead>
          <tr>
            <th>${rtl ? 'رقم الاسترداد' : 'Refund Ref'}</th>
            <th>${rtl ? 'اسم المعتمر' : 'Customer Name'}</th>
            <th>${rtl ? 'شركة السياحة' : 'Company'}</th>
            <th>${rtl ? 'المبلغ المطلوب' : 'Requested'}</th>
            <th>${rtl ? 'خصم السياسة' : 'Deduction'}</th>
            <th>${rtl ? 'المسترد المعتمد' : 'Approved Refund'}</th>
            <th>${rtl ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${sheet.records.map(r => `
            <tr>
              <td><strong class="rep-table-mono" dir="ltr">${r.ref}</strong></td>
              <td><strong>${rtl ? r.customer : r.customer_en}</strong></td>
              <td><span>${rtl ? r.company : ''}</span></td>
              <td><bdi dir="ltr">${rtl ? formatEGP(r.requested_amt) : formatEGP_EN(r.requested_amt)}</bdi></td>
              <td style="color:var(--color-warning); font-weight:600;"><bdi dir="ltr">${rtl ? formatEGP(r.policy_penalty) : formatEGP_EN(r.policy_penalty)}</bdi></td>
              <td class="rep-val-primary is-bold"><bdi dir="ltr">${rtl ? formatEGP(r.approved_refund) : formatEGP_EN(r.approved_refund)}</bdi></td>
              <td><span class="acc-status-pill status-pill-navy">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      `;
    }
  }

  // --- 4. Simulated Export Modal Controller (Strict Mock Simulation) ---

  function setupActions() {
    const btnXlsx = document.getElementById('rep-det-export-xlsx');
    const btnCsv = document.getElementById('rep-det-export-csv');
    const btnPdf = document.getElementById('rep-det-export-pdf');

    if (btnXlsx) btnXlsx.addEventListener('click', () => openExportModal('xlsx'));
    if (btnCsv) btnCsv.addEventListener('click', () => openExportModal('csv'));
    if (btnPdf) btnPdf.addEventListener('click', () => openExportModal('pdf'));

    // Modal controls
    const modal = document.getElementById('rep-det-export-modal');
    const btnCancel = document.getElementById('rep-det-exp-btn-cancel');
    const btnConfirm = document.getElementById('rep-det-exp-btn-confirm');
    const btnCloseDone = document.getElementById('rep-det-exp-btn-close-done');
    const fmtXlsx = document.getElementById('rep-det-exp-fmt-xlsx');
    const fmtPdf = document.getElementById('rep-det-exp-fmt-pdf');
    const fmtCsv = document.getElementById('rep-det-exp-fmt-csv');

    if (btnCancel) btnCancel.addEventListener('click', closeExportModal);
    if (btnCloseDone) btnCloseDone.addEventListener('click', closeExportModal);
    if (btnConfirm) btnConfirm.addEventListener('click', executeExportSimulation);

    if (fmtXlsx) fmtXlsx.addEventListener('click', () => setExportFormat('xlsx'));
    if (fmtPdf) fmtPdf.addEventListener('click', () => setExportFormat('pdf'));
    if (fmtCsv) fmtCsv.addEventListener('click', () => setExportFormat('csv'));
  }

  function setExportFormat(fmt) {
    selectedExportFormat = fmt;
    const fmtXlsx = document.getElementById('rep-det-exp-fmt-xlsx');
    const fmtPdf = document.getElementById('rep-det-exp-fmt-pdf');
    const fmtCsv = document.getElementById('rep-det-exp-fmt-csv');

    [fmtXlsx, fmtPdf, fmtCsv].forEach(btn => {
      if (!btn) return;
      btn.classList.toggle('is-active', btn.getAttribute('data-format') === fmt);
    });
    renderExportStructurePreview();
  }

  function openExportModal(fmt) {
    if (!activeReport || activeReport.scope === 'invalid_company') return;
    selectedExportFormat = fmt || 'xlsx';
    const rtl = isRTL();
    const rep = activeReport;

    const modal = document.getElementById('rep-det-export-modal');
    const titleEl = document.getElementById('rep-det-exp-report-title');
    const scopeEl = document.getElementById('rep-det-exp-report-scope');
    const periodEl = document.getElementById('rep-det-exp-report-period');
    const configView = document.getElementById('rep-det-export-config-view');
    const resultView = document.getElementById('rep-det-export-result-view');
    const footerActions = document.getElementById('rep-det-export-footer-actions');
    const footerDone = document.getElementById('rep-det-export-footer-done');

    if (titleEl) titleEl.textContent = rtl ? rep.title_ar : rep.title_en;
    if (scopeEl) {
      const scopeLabel = rep.scope === 'company'
        ? (rtl ? `تقرير شركة معزول &bull; ${rep.company ? rep.company.name_ar : ''}` : `Isolated Company &bull; ${rep.company ? rep.company.name_en : ''}`)
        : (rtl ? 'تقرير داخلي معتمد (منصة ميقات)' : 'Certified Internal Report (Miqat Platform)');
      scopeEl.innerHTML = `<bdi dir="ltr">${rep.id}</bdi> &bull; ${scopeLabel}`;
    }
    if (periodEl) periodEl.textContent = rtl ? rep.period_ar : rep.period_en;

    if (configView) configView.style.display = 'block';
    if (resultView) resultView.style.display = 'none';
    if (footerActions) footerActions.style.display = 'flex';
    if (footerDone) footerDone.style.display = 'none';

    setExportFormat(selectedExportFormat);

    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeExportModal() {
    const modal = document.getElementById('rep-det-export-modal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function renderExportStructurePreview() {
    const previewBox = document.getElementById('rep-det-exp-preview-content');
    if (!previewBox || !activeReport) return;
    const rtl = isRTL();
    const rep = activeReport;

    if (selectedExportFormat === 'xlsx') {
      const sheetsList = rep.worksheets ? rep.worksheets.map((ws, i) => `
        <div class="rep-exp-sheet-item">
          <span><strong>Sheet ${i + 1}:</strong> ${rtl ? ws.title_ar : ws.title_en}</span>
          <span class="acc-status-pill status-pill-slate">${ws.recordsCount} ${rtl ? 'سجلات' : 'records'}</span>
        </div>
      `).join('') : '';

      previewBox.innerHTML = `
        <div class="rep-exp-preview-heading">
          ${rtl ? 'بنية مصنف Excel المتعدد الأوراق (.xlsx):' : 'Multi-Worksheet Excel Workbook Structure (.xlsx):'}
        </div>
        ${sheetsList}
        <div style="margin-top:0.4rem; font-size:0.75rem; color:var(--color-text-muted);">
          ${rep.scope === 'company'
            ? (rtl ? 'الأمان المحاسبي: استبعاد كامل لعمولات ميقات أو المذكرات الداخلية لضمان خصوصية بيانات الشركة المعزولة.' : 'Accounting Security: Internal Miqat commissions and internal notes are strictly excluded.')
            : (rtl ? 'المصنف يضم جداول القيود المحاسبية التفصيلية مع ترميز الحالات والمطابقات البنكية.' : 'Workbook includes detailed accounting ledgers with status codes and bank matching.')
          }
        </div>
      `;
    } else if (selectedExportFormat === 'pdf') {
      previewBox.innerHTML = `
        <div class="rep-exp-preview-heading">
          ${rtl ? 'مواصفات وثيقة PDF المعتمدة للطباعة والتوقيع:' : 'Printable Official PDF Specifications:'}
        </div>
        <div class="rep-exp-sheet-item">
          <span>${rtl ? 'المقاس والاتجاه:' : 'Dimensions & Orientation:'}</span>
          <strong dir="ltr">A4 Landscape (297 &times; 210 mm)</strong>
        </div>
        <div class="rep-exp-sheet-item">
          <span>${rtl ? 'الترويسة المعتمدة:' : 'Official Header:'}</span>
          <span>${rtl ? 'شعار ميقات الرسمي + الختم الرقمي لمسؤول الحسابات' : 'Official Miqat Logo & Digital Audit Stamp'}</span>
        </div>
        <div class="rep-exp-sheet-item">
          <span>${rtl ? 'مستوى الأمان والسرية:' : 'Security Classification:'}</span>
          <span>${rep.scope === 'company' ? (rtl ? 'بيانات شركة سياحة معزولة وموثقة' : 'Strict Isolated Company View Certified') : (rtl ? 'مستند مالي داخلي معتمد' : 'Certified Internal Financial Audit Doc')}</span>
        </div>
        <div class="rep-exp-sheet-item">
          <span>${rtl ? 'بصمة التحقق والتوقيع:' : 'Integrity Checksum:'}</span>
          <span><bdi dir="ltr">SHA-256 Checksum &bull; Page 1 of 2</bdi></span>
        </div>
      `;
    } else if (selectedExportFormat === 'csv') {
      previewBox.innerHTML = `
        <div class="rep-exp-preview-heading">
          ${rtl ? 'عينة من تدفق البيانات المجدولة (CSV — UTF-8 with BOM):' : 'Sample Formatted CSV Stream (UTF-8 BOM):'}
        </div>
        <div class="rep-exp-preview-code" dir="ltr">
          "Report_ID","Reference","Category_or_Customer","Amount_EGP","Status"<br>
          "${rep.id}","${rep.scope === 'company' ? 'BKG-DR-701' : 'INT-BKG-881'}","${rep.scope === 'company' ? 'Mahmoud Abdel-Rahim' : 'Confirmed Bookings'}","${rep.scope === 'company' ? '90000' : '18200000'}","Certified"<br>
          "${rep.id}","${rep.scope === 'company' ? 'BKG-DR-714' : 'INT-COL-442'}","${rep.scope === 'company' ? 'Fatma Ibrahim' : 'Electronic Collections'}","${rep.scope === 'company' ? '45000' : '22060000'}","Reconciled"<br>
          ... [3 more records previewed]
        </div>
        <div style="margin-top:0.4rem; font-size:0.75rem; color:var(--color-text-muted);">
          ${rtl ? 'بيانات مجدولة خام قابلة للاستيراد في برامج المحاسبة مع الحفاظ التام على ترميز الأحرف العربية.' : 'Raw tabular text stream ready for accounting ERP import with full Arabic UTF-8 encoding.'}
        </div>
      `;
    }
  }

  function executeExportSimulation() {
    if (!activeReport || activeReport.scope === 'invalid_company') return;
    const rep = activeReport;
    const fmt = selectedExportFormat;

    const extension = fmt === 'xlsx' ? 'xlsx' : (fmt === 'pdf' ? 'pdf' : 'csv');
    const fmtLabel = fmt === 'xlsx'
      ? 'Microsoft Excel Workbook (.xlsx)'
      : (fmt === 'pdf' ? 'Adobe Acrobat PDF Document (.pdf)' : 'Comma-Separated Values (.csv)');
    const simulatedSize = fmt === 'xlsx' ? '54.6 KB (Simulated)' : (fmt === 'pdf' ? '1.8 MB (Simulated)' : '18.4 KB (Simulated)');
    const simulatedFilename = `${rep.id}_${rep.scope}_Audit.${extension}`;

    const filenameEl = document.getElementById('rep-det-exp-result-filename');
    const formatEl = document.getElementById('rep-det-exp-result-format');
    const sizeEl = document.getElementById('rep-det-exp-result-size');
    const timestampEl = document.getElementById('rep-det-exp-result-timestamp');
    const configView = document.getElementById('rep-det-export-config-view');
    const resultView = document.getElementById('rep-det-export-result-view');
    const footerActions = document.getElementById('rep-det-export-footer-actions');
    const footerDone = document.getElementById('rep-det-export-footer-done');

    if (filenameEl) filenameEl.textContent = simulatedFilename;
    if (formatEl) formatEl.textContent = fmtLabel;
    if (sizeEl) sizeEl.textContent = simulatedSize;
    if (timestampEl) timestampEl.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (configView) configView.style.display = 'none';
    if (resultView) resultView.style.display = 'block';
    if (footerActions) footerActions.style.display = 'none';
    if (footerDone) footerDone.style.display = 'flex';
  }

  // --- 5. Initializer ---

  function init() {
    resolveReport();
    renderView();
    setupActions();

    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onPageRefresh === 'function') {
      window.AccountsWorkspace.onPageRefresh(function () {
        resolveReport();
        renderView();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
