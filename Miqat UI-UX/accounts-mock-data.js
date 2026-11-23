/**
 * MIQAT ACCOUNTS EMPLOYEE WORKSPACE — STRUCTURED MOCK DATA SERVICE
 * 
 * Provides an isolated, authoritative mock data provider for the Accounts Workspace:
 * - Customers, Bookings, Contracts, Transactions, Refunds, Trip Changes, Activities, and Pending Tasks
 * - Believable, interconnected data models with stable references
 * - Filtering, aggregation, and recalculation functions
 * - Clean abstraction allowing future seamless migration to live REST API endpoints
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsMockData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- 1. Master Customers Dataset ---
  const CUSTOMERS = [
    {
      id: 'CUST-1001',
      name_ar: 'أحمد محمود الشريف',
      name_en: 'Ahmed Mahmoud El-Sherif',
      phone: '01012345671',
      whatsapp: '01012345671',
      email: 'ahmed.elsherif@gmail.com',
      governorate_ar: 'الجيزة',
      governorate_en: 'Giza',
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      program_key: 'economy_saver',
      booking_ref: 'BK-2026-1045',
      booking_status: 'confirmed',
      bookings_count: 2,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 76000,
      paid_amount: 76000,
      remaining: 0,
      registered_date: '2026-10-25',
      last_activity: '2026-11-03 14:20',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1002',
      name_ar: 'عمر عبد العزيز الشريف',
      name_en: 'Omar Abdelaziz El-Sherif',
      phone: '01285536230',
      whatsapp: '01285536230',
      email: 'omar.aziz@gmail.com',
      governorate_ar: 'القاهرة',
      governorate_en: 'Cairo',
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      program_key: 'five_star_premium',
      booking_ref: 'BK-2026-1046',
      booking_status: 'confirmed',
      bookings_count: 1,
      contracts_count: 1,
      contract_ref: 'MQ-CTR-2026-012',
      contract_status: 'active',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 124000,
      paid_amount: 124000,
      remaining: 0,
      registered_date: '2026-10-28',
      last_activity: '2026-11-03 11:15',
      assigned_employee: 'sarah_mansour'
    },
    {
      id: 'CUST-1003',
      name_ar: 'سارة خالد المنصوري',
      name_en: 'Sarah Khaled El-Mansoury',
      phone: '01225077617',
      whatsapp: '01225077617',
      email: 'sarah.mansour@yahoo.com',
      governorate_ar: 'الإسكندرية',
      governorate_en: 'Alexandria',
      program_ar: 'عمرة شوال الاقتصادية',
      program_en: 'Shawwal Economy Umrah',
      program_key: 'shawwal_economy',
      booking_ref: 'BK-2026-1047',
      booking_status: 'deposit_paid',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'partial',
      refund_status: 'none',
      total_spent: 66000,
      paid_amount: 22000,
      remaining: 44000,
      registered_date: '2026-10-29',
      last_activity: '2026-11-03 10:45',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1004',
      name_ar: 'محمود فوزي رضوان',
      name_en: 'Mahmoud Fawzy Radwan',
      phone: '01149201948',
      whatsapp: '01149201948',
      email: 'm.fawzy@hotmail.com',
      governorate_ar: 'المنوفية',
      governorate_en: 'Monufia',
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      program_key: 'rajab_standard',
      booking_ref: 'BK-2026-1048',
      booking_status: 'cancelled',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'refunded',
      refund_status: 'pending_approval',
      total_spent: 52000,
      paid_amount: 52000,
      remaining: 0,
      registered_date: '2026-10-20',
      last_activity: '2026-11-02 16:30',
      assigned_employee: 'omar_sharif'
    },
    {
      id: 'CUST-1005',
      name_ar: 'فاطمة الزهراء علي',
      name_en: 'Fatima Al-Zahraa Ali',
      phone: '01232574706',
      whatsapp: '01232574706',
      email: 'fatima.ali@outlook.com',
      governorate_ar: 'الدقهلية',
      governorate_en: 'Dakahlia',
      program_ar: 'عمرة شعبان VIP برج الساعة',
      program_en: 'Shaban VIP Clock Tower Umrah',
      program_key: 'shaban_vip',
      booking_ref: 'BK-2026-1049',
      booking_status: 'confirmed',
      bookings_count: 2,
      contracts_count: 1,
      contract_ref: 'MQ-CTR-2026-008',
      contract_status: 'active',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 148000,
      paid_amount: 148000,
      remaining: 0,
      registered_date: '2026-11-01',
      last_activity: '2026-11-03 09:20',
      assigned_employee: 'sarah_mansour'
    },
    {
      id: 'CUST-1006',
      name_ar: 'عبد الرحمن طارق الجمل',
      name_en: 'Abdulrahman Tarek El-Gammal',
      phone: '01289736991',
      whatsapp: '01289736991',
      email: 'tarek.gammal@gmail.com',
      governorate_ar: 'الغربية',
      governorate_en: 'Gharbia',
      program_ar: 'عمرة برية فاخرة — فنادق الحرم',
      program_en: 'Deluxe Land Umrah — Haram Hotels',
      program_key: 'deluxe_land',
      booking_ref: 'BK-2026-1050',
      booking_status: 'new',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'partial',
      refund_status: 'none',
      total_spent: 42000,
      paid_amount: 12600,
      remaining: 29400,
      registered_date: '2026-11-02',
      last_activity: '2026-11-03 08:50',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1007',
      name_ar: 'خالد مصطفى النجار',
      name_en: 'Khaled Mostafa El-Naggar',
      phone: '01098452134',
      whatsapp: '01098452134',
      email: 'khaled.naggar@gmail.com',
      governorate_ar: 'الشرقية',
      governorate_en: 'Sharqia',
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      program_key: 'five_star_premium',
      booking_ref: 'BK-2026-1051',
      booking_status: 'confirmed',
      bookings_count: 3,
      contracts_count: 1,
      contract_ref: 'MQ-CTR-2026-015',
      contract_status: 'active',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 135000,
      paid_amount: 135000,
      remaining: 0,
      registered_date: '2026-10-18',
      last_activity: '2026-11-03 16:10',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1008',
      name_ar: 'منى حسن البنا',
      name_en: 'Mona Hassan El-Banna',
      phone: '01123498765',
      whatsapp: '01123498765',
      email: 'mona.banna@yahoo.com',
      governorate_ar: 'القاهرة',
      governorate_en: 'Cairo',
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      program_key: 'economy_saver',
      booking_ref: 'BK-2026-1052',
      booking_status: 'deposit_paid',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'partial',
      refund_status: 'none',
      total_spent: 75000,
      paid_amount: 30000,
      remaining: 45000,
      registered_date: '2026-10-30',
      last_activity: '2026-11-02 14:00',
      assigned_employee: 'sarah_mansour'
    },
    {
      id: 'CUST-1009',
      name_ar: 'إبراهيم يوسف سالم',
      name_en: 'Ibrahim Youssef Salem',
      phone: '01276543210',
      whatsapp: '01276543210',
      email: 'i.salem@outlook.com',
      governorate_ar: 'الإسكندرية',
      governorate_en: 'Alexandria',
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      program_key: 'rajab_standard',
      booking_ref: 'BK-2026-1053',
      booking_status: 'confirmed',
      bookings_count: 1,
      contracts_count: 1,
      contract_ref: 'MQ-CTR-2026-019',
      contract_status: 'pending_agreement',
      payment_status: 'pending_clearance',
      refund_status: 'none',
      total_spent: 58000,
      paid_amount: 33000,
      remaining: 25000,
      registered_date: '2026-10-22',
      last_activity: '2026-11-03 12:45',
      assigned_employee: 'omar_sharif'
    },
    {
      id: 'CUST-1010',
      name_ar: 'هدى سيد عبد الرحمن',
      name_en: 'Hoda Sayed Abdelrahman',
      phone: '01067891234',
      whatsapp: '01067891234',
      email: 'hoda.sayed@gmail.com',
      governorate_ar: 'القليوبية',
      governorate_en: 'Qalyubia',
      program_ar: 'عمرة شعبان VIP برج الساعة',
      program_en: 'Shaban VIP Clock Tower Umrah',
      program_key: 'shaban_vip',
      booking_ref: 'BK-2026-1054',
      booking_status: 'confirmed',
      bookings_count: 2,
      contracts_count: 1,
      contract_ref: 'MQ-CTR-2026-022',
      contract_status: 'active',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 155000,
      paid_amount: 155000,
      remaining: 0,
      registered_date: '2026-10-15',
      last_activity: '2026-11-03 15:30',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1011',
      name_ar: 'طارق محمد الشاذلي',
      name_en: 'Tarek Mohamed El-Shazly',
      phone: '01154321876',
      whatsapp: '01154321876',
      email: 'tarek.shazly@hotmail.com',
      governorate_ar: 'الجيزة',
      governorate_en: 'Giza',
      program_ar: 'عمرة شوال الاقتصادية',
      program_en: 'Shawwal Economy Umrah',
      program_key: 'shawwal_economy',
      booking_ref: 'BK-2026-1055',
      booking_status: 'new',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'unpaid',
      refund_status: 'none',
      total_spent: 64000,
      paid_amount: 0,
      remaining: 64000,
      registered_date: '2026-11-03',
      last_activity: '2026-11-03 17:00',
      assigned_employee: 'sarah_mansour'
    },
    {
      id: 'CUST-1012',
      name_ar: 'نورهان عادل الخطيب',
      name_en: 'Nourhan Adel El-Khatib',
      phone: '01298765432',
      whatsapp: '01298765432',
      email: 'nourhan.khatib@gmail.com',
      governorate_ar: 'القاهرة',
      governorate_en: 'Cairo',
      program_ar: 'عمرة برية فاخرة — فنادق الحرم',
      program_en: 'Deluxe Land Umrah — Haram Hotels',
      program_key: 'deluxe_land',
      booking_ref: 'BK-2026-1056',
      booking_status: 'cancelled',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'refunded',
      refund_status: 'executed',
      total_spent: 38000,
      paid_amount: 38000,
      remaining: 0,
      registered_date: '2026-10-12',
      last_activity: '2026-11-01 15:30',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1013',
      name_ar: 'مصطفى كامل الدسوقي',
      name_en: 'Mostafa Kamel El-Desouky',
      phone: '01033221100',
      whatsapp: '01033221100',
      email: 'm.desouky@yahoo.com',
      governorate_ar: 'الدقهلية',
      governorate_en: 'Dakahlia',
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      program_key: 'five_star_premium',
      booking_ref: 'BK-2026-1057',
      booking_status: 'confirmed',
      bookings_count: 2,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 118000,
      paid_amount: 118000,
      remaining: 0,
      registered_date: '2026-10-24',
      last_activity: '2026-11-02 11:15',
      assigned_employee: 'omar_sharif'
    },
    {
      id: 'CUST-1014',
      name_ar: 'ياسمين أحمد رضوان',
      name_en: 'Yasmine Ahmed Radwan',
      phone: '01188776655',
      whatsapp: '01188776655',
      email: 'yasmine.radwan@outlook.com',
      governorate_ar: 'الغربية',
      governorate_en: 'Gharbia',
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      program_key: 'rajab_standard',
      booking_ref: 'BK-2026-1058',
      booking_status: 'new',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'partial',
      refund_status: 'under_review',
      total_spent: 49000,
      paid_amount: 18000,
      remaining: 31000,
      registered_date: '2026-11-01',
      last_activity: '2026-11-03 08:30',
      assigned_employee: 'sarah_mansour'
    },
    {
      id: 'CUST-1015',
      name_ar: 'عمرو سعيد بركات',
      name_en: 'Amr Saeed Barakat',
      phone: '01211223344',
      whatsapp: '01211223344',
      email: 'amr.barakat@gmail.com',
      governorate_ar: 'المنوفية',
      governorate_en: 'Monufia',
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      program_key: 'economy_saver',
      booking_ref: 'BK-2026-1059',
      booking_status: 'completed',
      bookings_count: 4,
      contracts_count: 2,
      contract_ref: 'MQ-CTR-2026-005',
      contract_status: 'active',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 72000,
      paid_amount: 72000,
      remaining: 0,
      registered_date: '2026-09-15',
      last_activity: '2026-10-28 17:00',
      assigned_employee: 'ahmed_sabry'
    },
    {
      id: 'CUST-1016',
      name_ar: 'سلمى محمود نور',
      name_en: 'Salma Mahmoud Nour',
      phone: '01055443322',
      whatsapp: '01055443322',
      email: 'salma.nour@gmail.com',
      governorate_ar: 'الشرقية',
      governorate_en: 'Sharqia',
      program_ar: 'عمرة شوال الاقتصادية',
      program_en: 'Shawwal Economy Umrah',
      program_key: 'shawwal_economy',
      booking_ref: 'BK-2026-1060',
      booking_status: 'confirmed',
      bookings_count: 1,
      contracts_count: 0,
      contract_ref: null,
      contract_status: 'none',
      payment_status: 'paid_full',
      refund_status: 'none',
      total_spent: 68000,
      paid_amount: 68000,
      remaining: 0,
      registered_date: '2026-10-27',
      last_activity: '2026-11-02 18:20',
      assigned_employee: 'ahmed_sabry'
    }
  ];

  // --- 2. Master Transactions Dataset ---
  const TRANSACTIONS = [
    {
      id: 'TXN-2026-9041',
      receipt_ref: 'MQ-RCP-2026-0812',
      booking_ref: 'BK-2026-1048',
      customer_id: 'CUST-1004',
      customer_name_ar: 'محمود فوزي رضوان',
      customer_name_en: 'Mahmoud Fawzy Radwan',
      customer_phone: '01149201948',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      amount: 45000,
      currency: 'EGP',
      payment_method: 'cash',
      payment_method_ar: 'تحصيل نقدي بمقر الفرع',
      payment_method_en: 'Branch Cash Collection',
      status: 'pending',
      status_ar: 'قيد المراجعة الإدارية والتدقيق',
      status_en: 'Pending Admin Verification',
      date: '2026-11-03 14:15',
      date_iso: '2026-11-03T12:15:00.000Z',
      recorded_by_ar: 'أحمد صبري (موظف حسابات)',
      recorded_by_en: 'Ahmed Sabry (Accounts)',
      assigned_employee: 'ahmed_sabry',
      notes_ar: 'سداد الدفعة النهائية نقداً بالخزينة بموجب إيصال استلام نقدية رقم 812',
      notes_en: 'Final balance paid in cash at branch safe receipt #812'
    },
    {
      id: 'TXN-2026-9042',
      receipt_ref: 'MQ-RCP-2026-0811',
      booking_ref: 'BK-2026-1045',
      customer_id: 'CUST-1001',
      customer_name_ar: 'أحمد محمود الشريف',
      customer_name_en: 'Ahmed Mahmoud El-Sherif',
      customer_phone: '01012345671',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      amount: 66000,
      currency: 'EGP',
      payment_method: 'platform',
      payment_method_ar: 'بطاقة إلكترونية (فيزا / ميزة)',
      payment_method_en: 'Online Card (Visa / Meeza)',
      status: 'verified',
      status_ar: 'معتمد وموثق بنكياً',
      status_en: 'Verified by Miqat',
      date: '2026-11-03 11:30',
      date_iso: '2026-11-03T09:30:00.000Z',
      recorded_by_ar: 'بوابة الدفع الإلكتروني الموحدة',
      recorded_by_en: 'Unified Payment Gateway',
      assigned_employee: 'ahmed_sabry',
      notes_ar: 'عملية دفع ناجحة عبر بوابة الدفع الإلكتروني الموحدة',
      notes_en: 'Successful online electronic card payment'
    },
    {
      id: 'TXN-2026-9043',
      receipt_ref: 'MQ-RCP-2026-0810',
      booking_ref: 'BK-2026-1046',
      customer_id: 'CUST-1002',
      customer_name_ar: 'عمر عبد العزيز الشريف',
      customer_name_en: 'Omar Abdelaziz El-Sherif',
      customer_phone: '01285536230',
      company_name_ar: 'شركة نسك الهدى للسياحة',
      company_name_en: 'Nosok Al-Huda Travel',
      amount: 38000,
      currency: 'EGP',
      payment_method: 'instapay',
      payment_method_ar: 'إنستاباي (InstaPay IPN)',
      payment_method_en: 'InstaPay (IPN)',
      status: 'verified',
      status_ar: 'معتمد وموثق بنكياً',
      status_en: 'Verified by Miqat',
      date: '2026-11-03 09:45',
      date_iso: '2026-11-03T07:45:00.000Z',
      recorded_by_ar: 'سارة خالد (قسم التحصيل)',
      recorded_by_en: 'Sarah Khaled (Collections)',
      assigned_employee: 'sarah_mansour',
      notes_ar: 'تحويل إنستاباي مباشر ومطابق في كشف الحساب البنكي',
      notes_en: 'Direct InstaPay transfer reconciled with bank statement'
    },
    {
      id: 'TXN-2026-9044',
      receipt_ref: 'MQ-RCP-2026-0809',
      booking_ref: 'BK-2026-1047',
      customer_id: 'CUST-1003',
      customer_name_ar: 'سارة خالد المنصوري',
      customer_name_en: 'Sarah Khaled El-Mansoury',
      customer_phone: '01225077617',
      company_name_ar: 'شركة هداية المعتمد للسياحة',
      company_name_en: 'Hedaya Travel',
      amount: 15000,
      currency: 'EGP',
      payment_method: 'vodafone_cash',
      payment_method_ar: 'فودافون كاش (محفظة رقمية)',
      payment_method_en: 'Vodafone Cash (Wallet)',
      status: 'verified',
      status_ar: 'معتمد وموثق بنكياً',
      status_en: 'Verified by Miqat',
      date: '2026-11-02 17:20',
      date_iso: '2026-11-02T15:20:00.000Z',
      recorded_by_ar: 'أحمد صبري (موظف حسابات)',
      recorded_by_en: 'Ahmed Sabry (Accounts)',
      assigned_employee: 'ahmed_sabry',
      notes_ar: 'تحويل محفظة إلكترونية تم استلامه وتأكيده مع العميل',
      notes_en: 'E-wallet deposit confirmed with customer SMS token'
    },
    {
      id: 'TXN-2026-9045',
      receipt_ref: 'MQ-RCP-2026-0808',
      booking_ref: 'BK-2026-1049',
      customer_id: 'CUST-1005',
      customer_name_ar: 'فاطمة الزهراء علي',
      customer_name_en: 'Fatima Al-Zahraa Ali',
      customer_phone: '01232574706',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      amount: 22000,
      currency: 'EGP',
      payment_method: 'etisalat_cash',
      payment_method_ar: 'اتصالات كاش (محفظة رقمية)',
      payment_method_en: 'Etisalat Cash (Wallet)',
      status: 'verified',
      status_ar: 'معتمد وموثق بنكياً',
      status_en: 'Verified by Miqat',
      date: '2026-11-02 13:40',
      date_iso: '2026-11-02T11:40:00.000Z',
      recorded_by_ar: 'سارة خالد (قسم التحصيل)',
      recorded_by_en: 'Sarah Khaled (Collections)',
      assigned_employee: 'sarah_mansour',
      notes_ar: 'تحويل محفظة اتصالات كاش لرقم المحفظة المؤسسية المعتمد',
      notes_en: 'Corporate wallet payment verified'
    },
    {
      id: 'TXN-2026-9046',
      receipt_ref: 'MQ-RCP-2026-0807',
      booking_ref: 'BK-2026-1050',
      customer_id: 'CUST-1006',
      customer_name_ar: 'عبد الرحمن طارق الجمل',
      customer_name_en: 'Abdulrahman Tarek El-Gammal',
      customer_phone: '01289736991',
      company_name_ar: 'شركة الصفا والمروة',
      company_name_en: 'Al Safa & Marwa Travel',
      amount: 18500,
      currency: 'EGP',
      payment_method: 'orange_cash',
      payment_method_ar: 'أورنج كاش (محفظة رقمية)',
      payment_method_en: 'Orange Cash (Wallet)',
      status: 'pending',
      status_ar: 'قيد المراجعة الإدارية والتدقيق',
      status_en: 'Pending Admin Verification',
      date: '2026-11-01 16:10',
      date_iso: '2026-11-01T14:10:00.000Z',
      recorded_by_ar: 'عمر عبد العزيز (المراجعة)',
      recorded_by_en: 'Omar Abdelaziz (Audit)',
      assigned_employee: 'omar_sharif',
      notes_ar: 'تحويل محفظة برقم مرجعي غير واضح، بانتظار إشعار البنك الرسمي',
      notes_en: 'Wallet transfer reference pending telecom clearing statement'
    },
    {
      id: 'TXN-2026-9047',
      receipt_ref: 'MQ-RCP-2026-0806',
      booking_ref: 'BK-2026-1051',
      customer_id: 'CUST-1001',
      customer_name_ar: 'أحمد محمود الشريف',
      customer_name_en: 'Ahmed Mahmoud El-Sherif',
      customer_phone: '01012345671',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      amount: 20000,
      currency: 'EGP',
      payment_method: 'we_pay',
      payment_method_ar: 'وي باي (WE Pay)',
      payment_method_en: 'WE Pay (Wallet)',
      status: 'verified',
      status_ar: 'معتمد وموثق بنكياً',
      status_en: 'Verified by Miqat',
      date: '2026-10-31 11:20',
      date_iso: '2026-10-31T09:20:00.000Z',
      recorded_by_ar: 'أحمد صبري (موظف حسابات)',
      recorded_by_en: 'Ahmed Sabry (Accounts)',
      assigned_employee: 'ahmed_sabry',
      notes_ar: 'سداد دفعة أولى لحجز باقة رجب الاقتصادية',
      notes_en: 'Initial deposit confirmed for Rajab package'
    },
    {
      id: 'TXN-2026-9048',
      receipt_ref: 'MQ-REF-2026-0031',
      booking_ref: 'BK-2026-1048',
      customer_id: 'CUST-1004',
      customer_name_ar: 'محمود فوزي رضوان',
      customer_name_en: 'Mahmoud Fawzy Radwan',
      customer_phone: '01149201948',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      amount: 33000,
      currency: 'EGP',
      payment_method: 'platform',
      payment_method_ar: 'استرداد بنكي للبطاقة',
      payment_method_en: 'Bank Card Refund',
      status: 'refunded',
      status_ar: 'تم الاسترداد والتسوية',
      status_en: 'Refunded & Settled',
      date: '2026-10-29 15:40',
      date_iso: '2026-10-29T13:40:00.000Z',
      recorded_by_ar: 'الإدارة المالية — اعتماد رسمي',
      recorded_by_en: 'Finance Admin Approval',
      assigned_employee: 'ahmed_sabry',
      notes_ar: 'صرف مبلغ الاسترداد المالي المعتمد بعد خصم الرسوم الإدارية للمعتمر',
      notes_en: 'Official refunded payment after cancellation policy deduction'
    }
  ];

  // --- 3. Master Activities Dataset ---
  const ACTIVITIES = [
    {
      id: 'ACT-2026-0501',
      type: 'collection_registered',
      type_ar: 'تسجيل تحصيل نقدي',
      type_en: 'Cash Collection Registered',
      title_ar: 'تسجيل استلام نقدية بقيمة ٤٥,٠٠٠ ج.م',
      title_en: 'Branch cash recorded: 45,000 EGP',
      customer_name_ar: 'محمود فوزي رضوان',
      customer_name_en: 'Mahmoud Fawzy Radwan',
      ref_id: 'TXN-2026-9041',
      timestamp: '2026-11-03 14:15',
      time_relative_ar: 'منذ ٢٥ دقيقة',
      time_relative_en: '25 mins ago',
      status: 'pending',
      status_ar: 'بانتظار الاعتماد',
      status_en: 'Pending Verification',
      employee: 'ahmed_sabry'
    },
    {
      id: 'ACT-2026-0502',
      type: 'payment_recorded',
      type_ar: 'عملية دفع إلكتروني',
      type_en: 'Online Payment Recorded',
      title_ar: 'توثيق عملية دفع إلكتروني بقيمة ٦٦,٠٠٠ ج.م',
      title_en: 'Online payment verified: 66,000 EGP',
      customer_name_ar: 'أحمد محمود الشريف',
      customer_name_en: 'Ahmed Mahmoud El-Sherif',
      ref_id: 'TXN-2026-9042',
      timestamp: '2026-11-03 11:30',
      time_relative_ar: 'منذ ٣ ساعات',
      time_relative_en: '3 hours ago',
      status: 'completed',
      status_ar: 'مكتمل ومعتمد',
      status_en: 'Completed',
      employee: 'ahmed_sabry'
    },
    {
      id: 'ACT-2026-0503',
      type: 'booking_created',
      type_ar: 'إنشاء حجز جديد',
      type_en: 'New Booking Created',
      title_ar: 'تأكيد حجز عمرة VIP رقم BK-2026-1049',
      title_en: 'Confirmed VIP booking BK-2026-1049',
      customer_name_ar: 'فاطمة الزهراء علي',
      customer_name_en: 'Fatima Al-Zahraa Ali',
      ref_id: 'BK-2026-1049',
      timestamp: '2026-11-03 10:10',
      time_relative_ar: 'منذ ٤ ساعات',
      time_relative_en: '4 hours ago',
      status: 'completed',
      status_ar: 'مؤكد',
      status_en: 'Confirmed',
      employee: 'sarah_mansour'
    },
    {
      id: 'ACT-2026-0504',
      type: 'trip_change_requested',
      type_ar: 'طلب تعديل برنامج',
      type_en: 'Trip Change Requested',
      title_ar: 'طلب ترقية الغرفة مع فارق مالي ١٦,٠٠٠ ج.م',
      title_en: 'Upgrade requested with price diff: 16,000 EGP',
      customer_name_ar: 'عبد الرحمن طارق',
      customer_name_en: 'Abdulrahman Tarek',
      ref_id: 'CHG-2026-002',
      timestamp: '2026-11-03 09:20',
      time_relative_ar: 'منذ ٥ ساعات',
      time_relative_en: '5 hours ago',
      status: 'pending',
      status_ar: 'بانتظار موافقة العميل',
      status_en: 'Pending Agreement',
      employee: 'ahmed_sabry'
    },
    {
      id: 'ACT-2026-0505',
      type: 'refund_submitted',
      type_ar: 'رفع طلب استرداد مالي',
      type_en: 'Refund Request Submitted',
      title_ar: 'إحالة طلب استرداد مالي بقيمة ٥٢,٠٠٠ ج.م للإدارة',
      title_en: 'Refund proposal submitted: 52,000 EGP',
      customer_name_ar: 'محمود فوزي رضوان',
      customer_name_en: 'Mahmoud Fawzy Radwan',
      ref_id: 'REF-REQ-2026-004',
      timestamp: '2026-11-02 16:45',
      time_relative_ar: 'أمس، ٤:٤٥ م',
      time_relative_en: 'Yesterday, 4:45 PM',
      status: 'under_review',
      status_ar: 'قيد مراجعة الإدارة',
      status_en: 'Under Admin Review',
      employee: 'omar_sharif'
    },
    {
      id: 'ACT-2026-0506',
      type: 'contract_recorded',
      type_ar: 'توثيق عقد شراكة',
      type_en: 'Partner Contract Recorded',
      title_ar: 'توثيق العقد السنوي لشركة نسك الهدى (فئة أ)',
      title_en: 'Accreditation contract signed: Nosok Al-Huda',
      customer_name_ar: 'شركة نسك الهدى',
      customer_name_en: 'Nosok Al-Huda Travel',
      ref_id: 'MQ-CTR-2026-012',
      timestamp: '2026-11-02 12:10',
      time_relative_ar: 'أمس، ١٢:١٠ م',
      time_relative_en: 'Yesterday, 12:10 PM',
      status: 'completed',
      status_ar: 'سارٍ ونشط',
      status_en: 'Active Contract',
      employee: 'ahmed_sabry'
    },
    {
      id: 'ACT-2026-0507',
      type: 'admin_approval',
      type_ar: 'اعتماد إداري رسمي',
      type_en: 'Admin Approval Received',
      title_ar: 'اعتماد صرف تسوية الاسترداد رقم MQT-REF-1793282001',
      title_en: 'Admin approved refund payout MQT-REF-1793282001',
      customer_name_ar: 'أحمد محمود الشريف',
      customer_name_en: 'Ahmed Mahmoud El-Sherif',
      ref_id: 'MQT-REF-1793282001',
      timestamp: '2026-11-01 15:30',
      time_relative_ar: '١ نوفمبر ٢٠٢٦',
      time_relative_en: '1 Nov 2026',
      status: 'completed',
      status_ar: 'تم الصرف',
      status_en: 'Executed',
      employee: 'sarah_mansour'
    },
    {
      id: 'ACT-2026-0508',
      type: 'booking_cancellation',
      type_ar: 'طلب إلغاء حجز',
      type_en: 'Cancellation Requested',
      title_ar: 'إلغاء حجز عمرة شعبان بناءً على طلب العميل',
      title_en: 'Customer requested booking cancellation BK-2026-1048',
      customer_name_ar: 'محمود فوزي رضوان',
      customer_name_en: 'Mahmoud Fawzy Radwan',
      ref_id: 'BK-2026-1048',
      timestamp: '2026-10-31 16:00',
      time_relative_ar: '٣١ أكتوبر ٢٠٢٦',
      time_relative_en: '31 Oct 2026',
      status: 'completed',
      status_ar: 'تم الإلغاء',
      status_en: 'Cancelled',
      employee: 'omar_sharif'
    }
  ];

  // --- 4. Master Pending Actions ---
  const PENDING_ACTIONS = [
    {
      id: 'ACT-REQ-01',
      category: 'branch_cash',
      category_ar: 'تحصيل نقدي بالفرع',
      category_en: 'Branch Cash Deposit',
      priority: 'high',
      title_ar: 'إشعار استلام نقدية بقيمة ٤٥,٠٠٠ ج.م من شركة الدرة',
      title_en: 'Cash deposit: 45,000 EGP reported by Al Dorra Travel',
      ref: 'REC-BR-2026-0412',
      booking_ref: 'BK-2026-1048',
      amount: 45000,
      due_sla_ar: 'باقٍ ٤ ساعات عمل',
      due_sla_en: '4 hours SLA remaining',
      action_type: 'verify_cash',
      action_label_ar: 'تدقيق واعتماد الإيصال',
      action_label_en: 'Review & Verify Receipt'
    },
    {
      id: 'ACT-REQ-02',
      category: 'refund_review',
      category_ar: 'طلب استرداد معلق',
      category_en: 'Pending Refund Approval',
      priority: 'high',
      title_ar: 'طلب استرداد ٥٢,٠٠٠ ج.م للعميل محمود فوزي (إلغاء طبي)',
      title_en: 'Refund proposal: 52,000 EGP for customer Mahmoud Fawzy',
      ref: 'REF-REQ-2026-004',
      booking_ref: 'BK-2026-1048',
      amount: 52000,
      due_sla_ar: 'باقٍ ٦ ساعات عمل',
      due_sla_en: '6 hours SLA remaining',
      action_type: 'review_refund',
      action_label_ar: 'مراجعة أسباب الاسترداد',
      action_label_en: 'Review Refund Dossier'
    },
    {
      id: 'ACT-REQ-03',
      category: 'price_diff',
      category_ar: 'فارق مالي لتعديل برنامج',
      category_en: 'Program Change Price Diff',
      priority: 'medium',
      title_ar: 'فارق مالي مستحق بقيمة ١٦,٠٠٠ ج.م لترقية غرفة الحجز BK-2026-1051',
      title_en: 'Price diff: 16,000 EGP upgrade for booking BK-2026-1051',
      ref: 'CHG-2026-002',
      booking_ref: 'BK-2026-1051',
      amount: 16000,
      due_sla_ar: 'بانتظار موافقة المعتمر',
      due_sla_en: 'Awaiting Customer Agreement',
      action_type: 'contact_customer',
      action_label_ar: 'متابعة السداد والربط',
      action_label_en: 'Track Collection Addendum'
    },
    {
      id: 'ACT-REQ-04',
      category: 'missing_evidence',
      category_ar: 'إيصال بنكي غير واضح',
      category_en: 'Illegible Transfer Slip',
      priority: 'medium',
      title_ar: 'إشعار تحويل إنستاباي بقيمة ٣٣,٠٠٠ ج.م بانتظار تأكيد مرجع البنك',
      title_en: 'InstaPay transfer: 33,000 EGP pending clearing verification',
      ref: 'TXN-INSTA-9921',
      booking_ref: 'BK-2026-1053',
      amount: 33000,
      due_sla_ar: 'خلال اليوم',
      due_sla_en: 'Due Today',
      action_type: 'check_clearing',
      action_label_ar: 'فحص كشف حساب البنك',
      action_label_en: 'Check Bank Clearing'
    }
  ];

  // --- 5. Base KPI Targets ---
  const BASE_KPIS = {
    totalCustomers: 148,
    newCustomersToday: 6,
    totalBookings: 84,
    newBookingsToday: 5,
    contractsCreated: 12,
    totalRecordedCollections: 3840000,
    verifiedCollections: 2920000,
    pendingVerification: 920000,
    pendingAdminApprovals: 9,
    refundRequests: 4,
    refundRequestsValue: 186000,
    completedRefunds: 3,
    completedRefundsValue: 198000,
    currency: 'EGP'
  };

  // --- 6. Helper: Search Normalization & Filter Matches Logic ---
  function normalizeSearchTerm(term) {
    if (!term) return '';
    return String(term)
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[ى]/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '')
      .replace(/[-_]/g, '')
      .trim();
  }

  function matchFilter(item, filters) {
    if (!filters) return true;

    // Exact calendar date filter (Priority over relative range)
    if (filters.exactDate) {
      const dateStr = item.date || item.date_iso || item.timestamp || item.registered_date || item.last_activity || '';
      if (!dateStr.startsWith(filters.exactDate)) {
        return false;
      }
    } else if (filters.dateRange && filters.dateRange !== 'all') {
      const itemDate = item.date_iso ? new Date(item.date_iso) : (item.registered_date ? new Date(item.registered_date) : null);
      if (itemDate) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (filters.dateRange === 'today' && itemDate < startOfToday) return false;
        if (filters.dateRange === 'yesterday') {
          const yesterday = new Date(startOfToday.getTime() - 86400000);
          if (itemDate < yesterday || itemDate >= startOfToday) return false;
        }
        if (filters.dateRange === 'last_7_days') {
          const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * 86400000);
          if (itemDate < sevenDaysAgo) return false;
        }
        if (filters.dateRange === 'this_month') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          if (itemDate < startOfMonth) return false;
        }
      }
    }

    // Payment method
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      if (item.payment_method && item.payment_method !== filters.paymentMethod) {
        return false;
      }
    }

    // Verification status
    if (filters.verificationStatus && filters.verificationStatus !== 'all') {
      if (item.status && item.status !== filters.verificationStatus) {
        return false;
      }
    }

    // Booking status
    if (filters.bookingStatus && filters.bookingStatus !== 'all') {
      if (item.booking_status && item.booking_status !== filters.bookingStatus) {
        return false;
      }
    }

    // Refund status
    if (filters.refundStatus && filters.refundStatus !== 'all') {
      if (filters.refundStatus === 'none' && item.status === 'refunded') return false;
      if (filters.refundStatus === 'completed' && item.status !== 'refunded') return false;
      if (filters.refundStatus === 'requested' && item.type !== 'refund_submitted' && item.category !== 'refund_review') return false;
    }

    // Activity type
    if (filters.activityType && filters.activityType !== 'all') {
      if (item.type && !item.type.includes(filters.activityType)) return false;
    }

    // Assigned Employee
    if (filters.assignedEmployee && filters.assignedEmployee !== 'all') {
      if (item.assigned_employee && item.assigned_employee !== filters.assignedEmployee && item.employee !== filters.assignedEmployee) {
        return false;
      }
    }

    return true;
  }

  // --- 7. Service Methods Exported ---
  // =========================================================================
  // PHASE 3 — PAGE 3: CUSTOMER PROFILE EXTENDED MOCK DATASETS
  // =========================================================================

  const CUSTOMER_BOOKINGS = {
    'CUST-1001': [
      {
        id: 'BK-2026-1045',
        customerId: 'CUST-1001',
        program_ar: 'عمرة اقتصادية موفرة (طيران)',
        program_en: 'Umrah Economy Saver (Flight)',
        company_ar: 'شركة الهدى للسياحة والخدمات الدينية',
        company_en: 'Al-Huda Religious Travel & Tourism',
        booking_date: '2026-10-25',
        travel_season_ar: 'رجب ١٤٤٨ هـ (يناير ٢٠٢٧)',
        travel_season_en: 'Rajab 1448 AH (Jan 2027)',
        travelers_count: 2,
        total_price: 76000,
        paid_amount: 76000,
        remaining: 0,
        booking_status: 'confirmed',
        payment_status: 'paid_full',
        notes_ar: 'حجز طيران مؤكد مع الإقامة في فنادق محبس الجن مع خدمة النقل الترددي',
        notes_en: 'Confirmed flight booking with Mahbas Al-Jinn accommodation and shuttle service'
      },
      {
        id: 'BK-2025-0812',
        customerId: 'CUST-1001',
        program_ar: 'عمرة رجب الاقتصادية المعيارية',
        program_en: 'Rajab Standard Umrah',
        company_ar: 'شركة البركة لخدمات المعتمرين',
        company_en: 'Al-Baraka Umrah Services',
        booking_date: '2025-11-14',
        travel_season_ar: 'شعبان ١٤٤٧ هـ (فبراير ٢٠٢٦)',
        travel_season_en: 'Shaban 1447 AH (Feb 2026)',
        travelers_count: 1,
        total_price: 34000,
        paid_amount: 34000,
        remaining: 0,
        booking_status: 'completed',
        payment_status: 'paid_full',
        notes_ar: 'رحلة سابقة منجزة ومسواة بالكامل دون أي متأخرات',
        notes_en: 'Past completed trip, fully reconciled with zero balance'
      }
    ],
    'CUST-1002': [
      {
        id: 'BK-2026-1046',
        customerId: 'CUST-1002',
        program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
        program_en: '5-Star Premium Umrah (Fairmont)',
        company_ar: 'مؤسسة الفيروز لرحلات الحج والعمرة',
        company_en: 'Al-Fairouz Hajj & Umrah Agency',
        booking_date: '2026-10-28',
        travel_season_ar: 'رمضان ١٤٤٨ هـ (مارس ٢٠٢٧)',
        travel_season_en: 'Ramadan 1448 AH (Mar 2027)',
        travelers_count: 2,
        total_price: 124000,
        paid_amount: 124000,
        remaining: 0,
        booking_status: 'confirmed',
        payment_status: 'paid_full',
        contract_ref: 'MQ-CTR-2026-012',
        notes_ar: 'حجز مميز مطل على الحرم المكي الشريف، سداد إلكتروني معتمد بالكامل',
        notes_en: 'Premium Haram view booking, fully verified electronic payment'
      }
    ],
    'CUST-1003': [
      {
        id: 'BK-2026-1047',
        customerId: 'CUST-1003',
        program_ar: 'عمرة شوال الاقتصادية',
        program_en: 'Shawwal Economy Umrah',
        company_ar: 'شركة مناسك العالمية للسياحة',
        company_en: 'Manasek Global Travel',
        booking_date: '2026-10-29',
        travel_season_ar: 'شوال ١٤٤٨ هـ (أبريل ٢٠٢٧)',
        travel_season_en: 'Shawwal 1448 AH (Apr 2027)',
        travelers_count: 2,
        total_price: 66000,
        paid_amount: 22000,
        remaining: 44000,
        booking_status: 'deposit_paid',
        payment_status: 'partial',
        notes_ar: 'تم سداد الدفعة الأولى (عربون)، المتبقي مستحق قبل موعد إصدار التأشيرات',
        notes_en: 'Initial deposit paid, remaining balance due prior to visa issuance'
      }
    ],
    'CUST-1005': [
      {
        id: 'BK-2026-1049',
        customerId: 'CUST-1005',
        program_ar: 'عمرة برية فاخرة — فنادق الحرم',
        program_en: 'Deluxe Land Umrah — Haram Hotels',
        company_ar: 'شركة مناسك العالمية للسياحة',
        company_en: 'Manasek Global Travel',
        booking_date: '2026-10-31',
        travel_season_ar: 'رجب ١٤٤٨ هـ (يناير ٢٠٢٧)',
        travel_season_en: 'Rajab 1448 AH (Jan 2027)',
        travelers_count: 1,
        total_price: 25000,
        paid_amount: 25000,
        remaining: 0,
        booking_status: 'cancelled',
        payment_status: 'refunded',
        notes_ar: 'حجز ملغي بناءً على طلب العميل مع وجود طلب استرداد مالي قيد المراجعة',
        notes_en: 'Cancelled booking per customer request with refund under financial review'
      }
    ],
    'CUST-1007': [
      {
        id: 'BK-2026-1051',
        customerId: 'CUST-1007',
        program_ar: 'عمرة برية فاخرة — فنادق الحرم',
        program_en: 'Deluxe Land Umrah — Haram Hotels',
        company_ar: 'شركة الصفا للنقل والخدمات السياحية',
        company_en: 'Al-Safa Travel & Tourism',
        booking_date: '2026-11-01',
        travel_season_ar: 'شعبان ١٤٤٨ هـ (فبراير ٢٠٢٧)',
        travel_season_en: 'Shaban 1448 AH (Feb 2027)',
        travelers_count: 2,
        total_price: 56000,
        paid_amount: 28000,
        remaining: 28000,
        booking_status: 'deposit_paid',
        payment_status: 'partial',
        notes_ar: 'يوجد طلب تعديل برنامج مقترح، الحجز الأصلي سارٍ حتى توثيق موافقة العميل',
        notes_en: 'Trip change proposal pending customer agreement; original booking remains active'
      }
    ]
  };

  const CUSTOMER_PAYMENTS = {
    'CUST-1001': [
      {
        id: 'TX-2026-9041',
        customerId: 'CUST-1001',
        booking_id: 'BK-2026-1045',
        date: '2026-10-25 14:30',
        amount: 38000,
        method: 'bank_transfer',
        method_ar: 'تحويل بنكي - الأهلي المصري',
        method_en: 'Bank Transfer (NBE)',
        receipt_ref: 'RCP-2026-4401',
        status: 'completed',
        balance_after: 38000
      },
      {
        id: 'TX-2026-9052',
        customerId: 'CUST-1001',
        booking_id: 'BK-2026-1045',
        date: '2026-10-27 11:15',
        amount: 38000,
        method: 'instapay',
        method_ar: 'إنستاباي فوري',
        method_en: 'InstaPay Instant',
        receipt_ref: 'RCP-2026-4415',
        status: 'completed',
        balance_after: 0
      }
    ],
    'CUST-1002': [
      {
        id: 'TX-2026-9060',
        customerId: 'CUST-1002',
        booking_id: 'BK-2026-1046',
        date: '2026-10-28 10:20',
        amount: 124000,
        method: 'bank_transfer',
        method_ar: 'تحويل بنكي مركزي - بنك مصر',
        method_en: 'Central Bank Transfer (Banque Misr)',
        receipt_ref: 'RCP-2026-4428',
        status: 'completed',
        balance_after: 0
      }
    ],
    'CUST-1003': [
      {
        id: 'TX-2026-9071',
        customerId: 'CUST-1003',
        booking_id: 'BK-2026-1047',
        date: '2026-10-29 16:45',
        amount: 22000,
        method: 'cash_deposit',
        method_ar: 'إيداع نقدي بالخزينة',
        method_en: 'Cash Treasury Deposit',
        receipt_ref: 'RCP-2026-4439',
        status: 'completed',
        balance_after: 44000
      }
    ],
    'CUST-1005': [
      {
        id: 'TX-2026-9080',
        customerId: 'CUST-1005',
        booking_id: 'BK-2026-1049',
        date: '2026-10-31 09:30',
        amount: 25000,
        method: 'wallet',
        method_ar: 'محفظة إلكترونية (فودافون كاش)',
        method_en: 'E-Wallet (Vodafone Cash)',
        receipt_ref: 'RCP-2026-4450',
        status: 'completed',
        balance_after: 0
      }
    ],
    'CUST-1007': [
      {
        id: 'TX-2026-9092',
        customerId: 'CUST-1007',
        booking_id: 'BK-2026-1051',
        date: '2026-11-01 12:00',
        amount: 28000,
        method: 'instapay',
        method_ar: 'إنستاباي فوري',
        method_en: 'InstaPay Instant',
        receipt_ref: 'RCP-2026-4462',
        status: 'completed',
        balance_after: 28000
      }
    ]
  };

  const CUSTOMER_RECEIPTS = {
    'CUST-1001': [
      {
        receipt_num: 'RCP-2026-4401',
        customerId: 'CUST-1001',
        booking_id: 'BK-2026-1045',
        payment_id: 'TX-2026-9041',
        date: '2026-10-25',
        amount: 38000,
        method_ar: 'تحويل بنكي رسمي',
        method_en: 'Official Bank Transfer',
        collector_ar: 'أحمد صبري (موظف حسابات)',
        collector_en: 'Ahmed Sabry (Accounts Officer)',
        verification_state: 'verified',
        notes_ar: 'تمت مطابقة الإشعار البنكي مع كشف الحساب المركزي بنجاح',
        notes_en: 'Bank advice slip reconciled with central ledger successfully'
      },
      {
        receipt_num: 'RCP-2026-4415',
        customerId: 'CUST-1001',
        booking_id: 'BK-2026-1045',
        payment_id: 'TX-2026-9052',
        date: '2026-10-27',
        amount: 38000,
        method_ar: 'إنستاباي فوري',
        method_en: 'InstaPay Instant',
        collector_ar: 'أحمد صبري (موظف حسابات)',
        collector_en: 'Ahmed Sabry (Accounts Officer)',
        verification_state: 'verified',
        notes_ar: 'تم التحقق من الرقم المرجعي للشبكة القومية للمدفوعات',
        notes_en: 'National Payment Network reference code verified'
      }
    ],
    'CUST-1002': [
      {
        receipt_num: 'RCP-2026-4428',
        customerId: 'CUST-1002',
        booking_id: 'BK-2026-1046',
        payment_id: 'TX-2026-9060',
        date: '2026-10-28',
        amount: 124000,
        method_ar: 'تحويل بنكي - بنك مصر',
        method_en: 'Banque Misr Transfer',
        collector_ar: 'سارة منصور (حسابات الشركات)',
        collector_en: 'Sarah Mansour (Corporate Accounts)',
        verification_state: 'verified',
        notes_ar: 'إيصال سداد معتمد ومطابق مع عقد الشراكة الموثق',
        notes_en: 'Verified receipt matched with documented partnership contract'
      }
    ],
    'CUST-1003': [
      {
        receipt_num: 'RCP-2026-4439',
        customerId: 'CUST-1003',
        booking_id: 'BK-2026-1047',
        payment_id: 'TX-2026-9071',
        date: '2026-10-29',
        amount: 22000,
        method_ar: 'إيداع نقدي بالخزينة',
        method_en: 'Cash Treasury Deposit',
        collector_ar: 'أحمد صبري (موظف حسابات)',
        collector_en: 'Ahmed Sabry (Accounts Officer)',
        verification_state: 'pending_approval',
        notes_ar: 'إيصال مسجل في الخزينة وبانتظار الإيداع والمطابقة البنكية الدورية',
        notes_en: 'Treasury receipt recorded, awaiting periodic bank deposit reconciliation'
      }
    ],
    'CUST-1005': [
      {
        receipt_num: 'RCP-2026-4450',
        customerId: 'CUST-1005',
        booking_id: 'BK-2026-1049',
        payment_id: 'TX-2026-9080',
        date: '2026-10-31',
        amount: 25000,
        method_ar: 'محفظة إلكترونية',
        method_en: 'E-Wallet',
        collector_ar: 'طارق الجندي (تدقيق عمليات)',
        collector_en: 'Tarek El-Gendy (Audit)',
        verification_state: 'verified',
        notes_ar: 'إيصال أصلي معتمد مرتبط بالحجز الملغي وطلب الاسترداد اللاحق',
        notes_en: 'Original verified receipt tied to cancelled booking and subsequent refund'
      }
    ],
    'CUST-1007': [
      {
        receipt_num: 'RCP-2026-4462',
        customerId: 'CUST-1007',
        booking_id: 'BK-2026-1051',
        payment_id: 'TX-2026-9092',
        date: '2026-11-01',
        amount: 28000,
        method_ar: 'إنستاباي فوري',
        method_en: 'InstaPay Instant',
        collector_ar: 'أحمد صبري (موظف حسابات)',
        collector_en: 'Ahmed Sabry (Accounts Officer)',
        verification_state: 'verified',
        notes_ar: 'سداد عربون معتمد ومطابق مع إشعار البنك المركزي',
        notes_en: 'Verified deposit receipt reconciled with central bank advice'
      }
    ]
  };

  const CUSTOMER_REFUNDS = {
    'CUST-1005': [
      {
        id: 'RF-2026-081',
        customerId: 'CUST-1005',
        booking_id: 'BK-2026-1049',
        payment_ref: 'TX-2026-9080',
        amount: 25000,
        request_date: '2026-11-01',
        reason_ar: 'إلغاء حجز لظروف صحية طارئة مع تقديم التقرير الطبي المعتمد',
        reason_en: 'Booking cancellation due to emergency medical conditions with doctor report',
        status: 'under_review',
        completion_date: null,
        notes_ar: 'الطلب قيد مراجعة الإدارة المالية والشركة المنظمة لتسوية سياسة الاسترداد (طلب الاسترداد لا يعد استرداداً منجزاً)',
        notes_en: 'Under review by finance and tour operator for policy settlement (request is not a completed refund)'
      }
    ]
  };

  const CUSTOMER_TRIP_CHANGES = {
    'CUST-1007': [
      {
        id: 'CHG-2026-032',
        customerId: 'CUST-1007',
        booking_id: 'BK-2026-1051',
        original_program_ar: 'عمرة برية فاخرة — فنادق الحرم (٥٦,٠٠٠ ج.م)',
        original_program_en: 'Deluxe Land Umrah — Haram Hotels (56,000 EGP)',
        proposed_program_ar: 'عمرة شوال الاقتصادية طيران مباشر (٥٠,٠٠٠ ج.م)',
        proposed_program_en: 'Shawwal Economy Umrah Direct Flight (50,000 EGP)',
        price_diff: -6000,
        request_date: '2026-11-02',
        customer_agreement: 'pending_agreement',
        change_status: 'under_review',
        notes_ar: 'البرنامج الأصلي وسعره يظلان رسميين حتى يتم تسجيل موافقة العميل كتابياً أو إلكترونياً',
        notes_en: 'Original program and price remain official until customer agreement is recorded'
      }
    ]
  };

  const CUSTOMER_TIMELINES = {
    'CUST-1001': [
      {
        date: '2026-10-25 10:15',
        title_ar: 'إنشاء الحساب وتوثيق بيانات المعتمر',
        title_en: 'Account Created & Traveler Details Verified',
        desc_ar: 'تم تسجيل العميل مركزياً في مساحة الحسابات بواسطة أحمد صبري',
        desc_en: 'Customer registered centrally in accounts system by Ahmed Sabry',
        category: 'registration'
      },
      {
        date: '2026-10-25 11:30',
        title_ar: 'تأكيد الحجز رقم BK-2026-1045',
        title_en: 'Booking BK-2026-1045 Confirmed',
        desc_ar: 'تم اختيار برنامج عمرة اقتصادية موفرة (طيران) لعدد ٢ معتمرين',
        desc_en: 'Economy Saver program selected for 2 travelers',
        category: 'booking'
      },
      {
        date: '2026-10-25 14:30',
        title_ar: 'تحصيل الدفعة الأولى (٣٨,٠٠٠ ج.م)',
        title_en: 'First Payment Collected (38,000 EGP)',
        desc_ar: 'تم سداد الدفعة الأولى عبر تحويل بنكي الأهلي المصري وإصدار إيصال RCP-2026-4401',
        desc_en: 'First installment paid via NBE bank transfer; receipt RCP-2026-4401 issued',
        category: 'payment'
      },
      {
        date: '2026-10-26 09:45',
        title_ar: 'اعتماد ومطابقة الإيصال البنكي',
        title_en: 'Bank Receipt Verified & Reconciled',
        desc_ar: 'تمت مطابقة الإشعار البنكي مع الحساب الجاري واعتماد الإيصال رسمياً',
        desc_en: 'Bank advice slip reconciled with current account and officially approved',
        category: 'receipt'
      },
      {
        date: '2026-10-27 11:15',
        title_ar: 'سداد المتبقي بالكامل (٣٨,٠٠٠ ج.م)',
        title_en: 'Full Final Settlement (38,000 EGP)',
        desc_ar: 'تم سداد المتبقي عبر إنستاباي فوري، وأصبح الحساب مسدداً بالكامل برصيد ٠ ج.م',
        desc_en: 'Remaining balance cleared via InstaPay; account fully paid with 0 balance',
        category: 'payment'
      }
    ],
    'CUST-1002': [
      {
        date: '2026-10-28 09:00',
        title_ar: 'تسجيل العميل وتوثيق عقد الشراكة MQ-CTR-2026-012',
        title_en: 'Account Created & Contract MQ-CTR-2026-012 Documented',
        desc_ar: 'تم تسجيل العميل وتوثيق عقد عمرة ٥ نجوم مع مؤسسة الفيروز',
        desc_en: 'Customer registered with 5-star contract with Al-Fairouz Agency',
        category: 'registration'
      },
      {
        date: '2026-10-28 10:20',
        title_ar: 'سداد كامل قيمة العقد والحجز (١٢٤,٠٠٠ ج.م)',
        title_en: 'Full Contract & Booking Payment (124,000 EGP)',
        desc_ar: 'تم استلام تحويل بنكي مركزي وإصدار إيصال معتمد RCP-2026-4428',
        desc_en: 'Central bank transfer received and verified receipt RCP-2026-4428 issued',
        category: 'payment'
      }
    ],
    'CUST-1003': [
      {
        date: '2026-10-29 14:00',
        title_ar: 'تسجيل حجز عمرة شوال BK-2026-1047',
        title_en: 'Booking BK-2026-1047 Registered',
        desc_ar: 'حجز عمرة شوال الاقتصادية بقيمة إجمالية ٦٦,٠٠٠ ج.م',
        desc_en: 'Shawwal Economy Umrah booked at 66,000 EGP total',
        category: 'booking'
      },
      {
        date: '2026-10-29 16:45',
        title_ar: 'سداد عربون الحجز (٢٢,٠٠٠ ج.م)',
        title_en: 'Deposit Payment Recorded (22,000 EGP)',
        desc_ar: 'تم إيداع الدفعة النقدية وإصدار إيصال مسجل RCP-2026-4439 قيد التدقيق',
        desc_en: 'Cash deposit recorded, receipt RCP-2026-4439 pending periodic reconciliation',
        category: 'payment'
      }
    ],
    'CUST-1005': [
      {
        date: '2026-10-31 09:30',
        title_ar: 'تسجيل الحجز وسداد القيمة (٢٥,٠٠٠ ج.م)',
        title_en: 'Booking Registered & Paid (25,000 EGP)',
        desc_ar: 'تم الحجز والسداد عبر المحفظة الإلكترونية',
        desc_en: 'Booking and payment completed via electronic wallet',
        category: 'booking'
      },
      {
        date: '2026-11-01 10:00',
        title_ar: 'إلغاء الحجز وتقديم طلب استرداد RF-2026-081',
        title_en: 'Booking Cancelled & Refund Request RF-2026-081 Filed',
        desc_ar: 'تم إلغاء الحجز لظروف صحية ورفع طلب الاسترداد للدراسة المالية',
        desc_en: 'Booking cancelled due to health reasons; refund submitted for review',
        category: 'refund'
      }
    ],
    'CUST-1007': [
      {
        date: '2026-11-01 11:00',
        title_ar: 'تسجيل الحجز وسداد الدفعة الأولى (٢٨,٠٠٠ ج.م)',
        title_en: 'Booking Registered & Deposit Paid (28,000 EGP)',
        desc_ar: 'تم حجز برنامج عمرة برية وسداد نصف القيمة عبر إنستاباي',
        desc_en: 'Land Umrah booked, 50% deposit paid via InstaPay',
        category: 'booking'
      },
      {
        date: '2026-11-02 14:20',
        title_ar: 'اقتراح تعديل البرنامج إلى طيران مباشر (CHG-2026-032)',
        title_en: 'Proposed Program Change to Direct Flight (CHG-2026-032)',
        desc_ar: 'تم رفع مقترح تعديل البرنامج وبانتظار موافقة العميل الرسمية قبل التطبيق',
        desc_en: 'Change proposal submitted, awaiting formal customer agreement',
        category: 'trip_change'
      }
    ]
  };
  // =========================================================================
  // UNIFIED BOOKINGS REGISTER — MASTER DATASET (12 Believable Bookings)
  // =========================================================================
  const BOOKINGS_MASTER = [
  {
    "id": "BK-2026-1045",
    "customerId": "CUST-1001",
    "customer_name_ar": "أحمد محمود الشريف",
    "customer_name_en": "Ahmed Mahmoud El-Sherif",
    "customer_phone": "01012345671",
    "customer_whatsapp": "01012345671",
    "customer_email": "ahmed.elsherif@gmail.com",
    "customer_governorate_ar": "الجيزة",
    "customer_governorate_en": "Giza",
    "company_id": "COMP-101",
    "company_ar": "شركة الهدى للسياحة والخدمات الدينية",
    "company_en": "Al-Huda Religious Travel & Tourism",
    "company_phone": "0233458900",
    "company_email": "operations@alhuda-travel.com",
    "company_license": "ترخيص سياحي رقم ٤١٨ فئة (أ)",
    "company_license_en": "Tourism License #418 Category (A)",
    "company_booking_ref": "HD-2026-9912",
    "program_id": "PRG-101",
    "program_ar": "عمرة اقتصادية موفرة (طيران)",
    "program_en": "Umrah Economy Saver (Flight)",
    "program_type": "economy",
    "program_type_ar": "عمرة اقتصادية",
    "program_type_en": "Economy Umrah",
    "season_ar": "رجب ١٤٤٨ هـ (يناير ٢٠٢٧)",
    "season_en": "Rajab 1448 AH (Jan 2027)",
    "season_key": "rajab_1448",
    "created_date": "2026-10-25",
    "travel_date": "2027-01-18",
    "travelers_count": 2,
    "total_price": 76000,
    "paid_amount": 76000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "confirmed",
    "booking_status_ar": "مؤكد",
    "booking_status_en": "Confirmed",
    "payment_status": "paid_full",
    "payment_status_ar": "مسدد بالكامل",
    "payment_status_en": "Paid in Full",
    "travelers": [
      {
        "id": "TRV-1045-1",
        "name_ar": "أحمد محمود الشريف",
        "name_en": "Ahmed Mahmoud El-Sherif",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي (صاحب الحجز)",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      },
      {
        "id": "TRV-1045-2",
        "name_ar": "زينب عبد الرحمن الشريف",
        "name_en": "Zeinab Abdelrahman El-Sherif",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الزوجة / مرافق",
        "relationship_en": "Spouse / Companion",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1045-1",
        "author": "إدارة العمليات — شركة الهدى",
        "date": "2026-10-25 15:00",
        "text_ar": "تم تأكيد مقاعد الطيران ذهاب وعودة من مطار القاهرة إلى مطار الملك عبد العزيز بجدة على الخطوط السعودية.",
        "text_en": "Round-trip flight seats confirmed from Cairo to Jeddah on Saudia Airlines."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1045-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-10-27 12:00",
        "text": "تمت مطابقة إشعار التحويل البنكي وإشعار إنستاباي مع كشف حساب البنك الأهلي، تم تصفية الحساب بالكامل وبانتظار إصدار شهادة التسوية."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "deposit_paid",
        "to_status_ar": "سداد دفعة أولى",
        "date": "2026-10-25 14:35",
        "actor": "سامح فؤاد (محاسب الهدى)"
      },
      {
        "from_status": "deposit_paid",
        "from_status_ar": "سداد دفعة أولى",
        "to_status": "confirmed",
        "to_status_ar": "حجز مؤكد ومسدد",
        "date": "2026-10-27 11:30",
        "actor": "أحمد صبري (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9041",
        "date": "2026-10-25 14:30",
        "amount": 38000,
        "payment_method": "bank_transfer",
        "payment_method_ar": "تحويل بنكي (الأهلي المصري)",
        "payment_method_en": "Bank Transfer (NBE)",
        "transaction_type": "deposit",
        "transaction_type_ar": "سداد دفعة أولى (عربون)",
        "transaction_type_en": "Initial Deposit",
        "transaction_source": "company_portal",
        "transaction_source_ar": "بوابة شركة السياحة الشريكة",
        "transaction_source_en": "Partner Company Portal",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 38000,
        "received_by": "سامح فؤاد — محاسب الهدى",
        "receipt_ref": "RCP-2026-4401",
        "notes": "إيداع رسمي معتمد في حساب بنك مصر للشركة",
        "evidence": {
          "type": "bank_slip",
          "filename": "NBE_Transfer_Receipt_4401.pdf",
          "size": "1.2 MB",
          "date": "2026-10-25 14:28",
          "bank_ref": "TRF-NBE-9921448",
          "account": "0100458921001"
        },
        "discussion": [
          {
            "id": "DISC-9041-1",
            "author_name": "سامح فؤاد",
            "author_role": "محاسب شركة السياحة",
            "date": "2026-10-25 14:32",
            "message": "تم إرفاق إشعار تحويل البنك الأهلي الصادر من العميل أحمد الشريف بمبلغ ٣٨,٠٠٠ ج.م."
          },
          {
            "id": "DISC-9041-2",
            "author_name": "أحمد صبري",
            "author_role": "موظف حسابات ميقات",
            "date": "2026-10-25 15:10",
            "message": "تم التحقق من ورود المبلغ في الحساب الوسيط، وتم اعتماد التحصيل دفترياً."
          }
        ],
        "audit_trail": [
          {
            "action": "تسجيل معاملة تحصيل دفعة أولى",
            "actor": "سامح فؤاد",
            "date": "2026-10-25 14:30",
            "details": "تسجيل دفعة بقيمة ٣٨,٠٠٠ ج.م عبر تحويل بنكي"
          },
          {
            "action": "اعتماد ومطابقة التحصيل",
            "actor": "أحمد صبري",
            "date": "2026-10-25 15:15",
            "details": "تغيير الحالة إلى معتمد ومطابق دفترياً، وخفض الرصيد المتبقي إلى ٣٨,٠٠٠ ج.م"
          }
        ]
      },
      {
        "id": "TX-2026-9052",
        "date": "2026-10-27 11:15",
        "amount": 38000,
        "payment_method": "instapay",
        "payment_method_ar": "إنستاباي فوري",
        "payment_method_en": "InstaPay Instant",
        "transaction_type": "final_balance",
        "transaction_type_ar": "سداد كامل الرصيد المتبقي",
        "transaction_type_en": "Final Balance Payment",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "أحمد صبري — حسابات ميقات",
        "receipt_ref": "RCP-2026-4415",
        "notes": "سداد فوري عبر شبكة المدفوعات اللحظية IPN",
        "evidence": {
          "type": "instapay_slip",
          "filename": "InstaPay_Slip_4415.png",
          "size": "640 KB",
          "date": "2026-10-27 11:14",
          "bank_ref": "IPN-20261027-88412",
          "account": "ahmed.elsherif@instapay"
        },
        "discussion": [
          {
            "id": "DISC-9052-1",
            "author_name": "أحمد صبري",
            "author_role": "موظف حسابات ميقات",
            "date": "2026-10-27 11:20",
            "message": "سداد إلكتروني مباشر عبر إنستاباي، تمت التسوية الفورية في الحساب."
          }
        ],
        "audit_trail": [
          {
            "action": "تسجيل سداد إلكتروني عبر إنستاباي",
            "actor": "بوابة ميقات الإلكترونية",
            "date": "2026-10-27 11:15",
            "details": "معاملة سداد نهائي بقيمة ٣٨,٠٠٠ ج.م"
          },
          {
            "action": "اعتماد وتصفية الرصيد بالكامل",
            "actor": "أحمد صبري",
            "date": "2026-10-27 11:25",
            "details": "الحساب أصبح مسدداً بالكامل والرصيد المتبقي صفر ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1045-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز جديد BK-2026-1045",
        "title_en": "Booking Registered BK-2026-1045",
        "desc_ar": "حجز عمرة اقتصادية موفرة (طيران) لشخصين عبر شركة الهدى بقيمة ٧٦,٠٠٠ ج.م",
        "desc_en": "Booked Economy Saver (Flight) for 2 travelers via Al-Huda for 76,000 EGP",
        "actor_ar": "أحمد الشريف (العميل)",
        "actor_en": "Ahmed El-Sherif (Customer)",
        "date": "2026-10-25 14:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1045-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "تسجيل دفعة أولى TX-2026-9041",
        "title_en": "Deposit Payment Recorded TX-2026-9041",
        "desc_ar": "سداد مبلغ ٣٨,٠٠٠ ج.م عبر تحويل بنكي (الأهلي المصري)",
        "desc_en": "Paid 38,000 EGP via Bank Transfer (NBE)",
        "actor_ar": "سامح فؤاد (محاسب الهدى)",
        "actor_en": "Sameh Fouad (Al-Huda)",
        "date": "2026-10-25 14:30",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1045-3",
        "type": "payment_approved",
        "type_label_ar": "اعتماد تحصيل",
        "type_label_en": "Payment Approved",
        "title_ar": "اعتماد دفعة البنك الأهلي",
        "title_en": "Bank Transfer Payment Approved",
        "desc_ar": "تم اعتماد التحصيل دفترياً ومطابقة إشعار التحويل",
        "desc_en": "Payment verified and ledger matched",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-10-25 15:15",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1045-4",
        "type": "internal_note",
        "type_label_ar": "ملاحظة داخلية",
        "type_label_en": "Internal Note",
        "title_ar": "إضافة ملاحظة حسابات خاصة",
        "title_en": "Accounting Note Added",
        "desc_ar": "تم التنسيق مع العميل لسداد الدفعة المتبقية قبل موعد إصدار التذاكر",
        "desc_en": "Customer contacted regarding remaining balance payment schedule",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-10-26 10:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1045-5",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد إلكتروني عبر إنستاباي TX-2026-9052",
        "title_en": "Electronic Payment Recorded TX-2026-9052",
        "desc_ar": "سداد كامل المبلغ المتبقي بقيمة ٣٨,٠٠٠ ج.م",
        "desc_en": "Full remaining balance paid 38,000 EGP",
        "actor_ar": "بوابة ميقات الإلكترونية",
        "actor_en": "Miqat Electronic Gateway",
        "date": "2026-10-27 11:15",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1045-6",
        "type": "payment_approved",
        "type_label_ar": "اعتماد تحصيل",
        "type_label_en": "Payment Approved",
        "title_ar": "اعتماد تسوية الحساب بالكامل",
        "title_en": "Full Account Settlement Approved",
        "desc_ar": "تم تأكيد الإيداع في الحساب وتصفية الرصيد المتبقي إلى صفر",
        "desc_en": "Deposit confirmed and balance cleared to zero",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-10-27 11:25",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1045-7",
        "type": "status_changed",
        "type_label_ar": "تحديث حالة",
        "type_label_en": "Status Changed",
        "title_ar": "تحديث حالة الحجز إلى مؤكد",
        "title_en": "Booking Status Updated to Confirmed",
        "desc_ar": "تأكيد الحجز النهائي بعد استيفاء سداد كامل القيمة",
        "desc_en": "Final booking confirmed following full payment completion",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-10-27 11:30",
        "link_tab": "overview"
      }
    ]
  },
  {
    "id": "BK-2026-1046",
    "customerId": "CUST-1002",
    "customer_name_ar": "عمر عبد العزيز الشريف",
    "customer_name_en": "Omar Abdelaziz El-Sherif",
    "customer_phone": "01285536230",
    "customer_whatsapp": "01285536230",
    "customer_email": "omar.aziz@gmail.com",
    "customer_governorate_ar": "القاهرة",
    "customer_governorate_en": "Cairo",
    "company_id": "COMP-102",
    "company_ar": "مؤسسة الفيروز لرحلات الحج والعمرة",
    "company_en": "Al-Fairouz Hajj & Umrah Agency",
    "company_phone": "0227941200",
    "company_email": "vip@alfairouz-travel.com",
    "company_license": "ترخيص سياحي رقم ٣١٥ فئة (أ)",
    "company_license_en": "Tourism License #315 Category (A)",
    "company_booking_ref": "FZ-2026-8804",
    "program_id": "PRG-102",
    "program_ar": "عمرة ٥ نجوم متميزة (فيرمونت)",
    "program_en": "5-Star Premium Umrah (Fairmont)",
    "program_type": "five_star",
    "program_type_ar": "عمرة ٥ نجوم",
    "program_type_en": "5-Star Premium",
    "season_ar": "رمضان ١٤٤٨ هـ (مارس ٢٠٢٧)",
    "season_en": "Ramadan 1448 AH (Mar 2027)",
    "season_key": "ramadan_1448",
    "created_date": "2026-10-28",
    "travel_date": "2027-03-12",
    "travelers_count": 1,
    "total_price": 124000,
    "paid_amount": 124000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "confirmed",
    "booking_status_ar": "مؤكد",
    "booking_status_en": "Confirmed",
    "payment_status": "paid_full",
    "payment_status_ar": "مسدد بالكامل",
    "payment_status_en": "Paid in Full",
    "travelers": [
      {
        "id": "TRV-1046-1",
        "name_ar": "عمر عبد العزيز الشريف",
        "name_en": "Omar Abdelaziz El-Sherif",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي (صاحب الحجز)",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1046-1",
        "author": "مؤسسة الفيروز",
        "date": "2026-10-28 11:00",
        "text_ar": "تم حجز جناح مطل على الحرم في برج ساعة مكة فيرمونت وتأكيد خدمة الاستقبال VIP.",
        "text_en": "Haram-view suite confirmed at Makkah Clock Royal Tower Fairmont with VIP airport meet & assist."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1046-1",
        "author_name": "سارة منصور",
        "author_role": "مشرف حسابات كبار العملاء",
        "date": "2026-10-28 12:30",
        "text": "تم استلام المبلغ بالكامل عبر تحويل بنكي رسمي من البنك التجاري الدولي CIB، وتم فحص سلامة القيد المحاسبي."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "confirmed",
        "to_status_ar": "حجز مؤكد ومسدد",
        "date": "2026-10-28 10:45",
        "actor": "سارة منصور (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9060",
        "date": "2026-10-28 10:20",
        "amount": 124000,
        "payment_method": "bank_transfer",
        "payment_method_ar": "تحويل بنكي (CIB مصر)",
        "payment_method_en": "Bank Transfer (CIB Egypt)",
        "transaction_type": "full_payment",
        "transaction_type_ar": "سداد كامل المبلغ دفعة واحدة",
        "transaction_type_en": "Full Payment Upfront",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "سارة منصور — حسابات ميقات",
        "receipt_ref": "RCP-2026-4420",
        "notes": "سداد كامل شامل تذاكر الطيران والإقامة في برج الساعة",
        "evidence": {
          "type": "bank_slip",
          "filename": "CIB_VIP_Transfer_124K.pdf",
          "size": "1.8 MB",
          "date": "2026-10-28 10:15",
          "bank_ref": "CIB-EGY-771923",
          "account": "10002847119"
        },
        "discussion": [
          {
            "id": "DISC-9060-1",
            "author_name": "سارة منصور",
            "author_role": "مشرف حسابات كبار العملاء",
            "date": "2026-10-28 10:30",
            "message": "تم التأكد من صحة التحويل الصادر بمبلغ ١٢٤,٠٠٠ ج.م بالكامل."
          }
        ],
        "audit_trail": [
          {
            "action": "اعتماد سداد كامل مباشر",
            "actor": "سارة منصور",
            "date": "2026-10-28 10:40",
            "details": "اعتماد تحويل كامل بقيمة ١٢٤,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1046-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز عمرة رمضان VIP",
        "title_en": "VIP Ramadan Booking Created",
        "desc_ar": "عمرة ٥ نجوم متميزة (فيرمونت) بقيمة ١٢٤,٠٠٠ ج.م",
        "desc_en": "5-Star Premium Umrah (Fairmont) booked for 124,000 EGP",
        "actor_ar": "عمر الشريف (العميل)",
        "actor_en": "Omar El-Sherif (Customer)",
        "date": "2026-10-28 10:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1046-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "تسجيل تحويل بنكي كامل TX-2026-9060",
        "title_en": "Full Bank Transfer Payment Recorded",
        "desc_ar": "تحويل بقيمة ١٢٤,٠٠٠ ج.م عبر البنك التجاري الدولي CIB",
        "desc_en": "124,000 EGP transfer via CIB Bank",
        "actor_ar": "سارة منصور (حسابات ميقات)",
        "actor_en": "Sarah Mansour (Miqat Accounts)",
        "date": "2026-10-28 10:20",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1046-3",
        "type": "status_changed",
        "type_label_ar": "تحديث حالة",
        "type_label_en": "Status Changed",
        "title_ar": "تأكيد الحجز النهائي",
        "title_en": "Booking Confirmed",
        "desc_ar": "الحجز مؤكد وجاهز لإصدار التأشيرة الإلكترونية",
        "desc_en": "Booking confirmed and ready for eVisa issuance",
        "actor_ar": "سارة منصور (حسابات ميقات)",
        "actor_en": "Sarah Mansour (Miqat Accounts)",
        "date": "2026-10-28 10:45",
        "link_tab": "overview"
      }
    ]
  },
  {
    "id": "BK-2026-1047",
    "customerId": "CUST-1003",
    "customer_name_ar": "سارة خالد المنصوري",
    "customer_name_en": "Sarah Khaled El-Mansouri",
    "customer_phone": "01149928341",
    "customer_whatsapp": "01149928341",
    "customer_email": "sarah.mansouri@yahoo.com",
    "customer_governorate_ar": "الإسكندرية",
    "customer_governorate_en": "Alexandria",
    "company_id": "COMP-103",
    "company_ar": "شركة مناسك العالمية للسياحة",
    "company_en": "Manasek Global Travel",
    "company_phone": "0225197800",
    "company_email": "accounts@manasek-travel.com",
    "company_license": "ترخيص سياحي رقم ٥١٢ فئة (أ)",
    "company_license_en": "Tourism License #512 Category (A)",
    "company_booking_ref": "MN-2026-4419",
    "program_id": "PRG-103",
    "program_ar": "عمرة شوال الاقتصادية",
    "program_en": "Shawwal Economy Umrah",
    "program_type": "economy",
    "program_type_ar": "عمرة اقتصادية",
    "program_type_en": "Economy Umrah",
    "season_ar": "شوال ١٤٤٨ هـ (أبريل ٢٠٢٧)",
    "season_en": "Shawwal 1448 AH (Apr 2027)",
    "season_key": "shawwal_1448",
    "created_date": "2026-10-29",
    "travel_date": "2027-04-10",
    "travelers_count": 2,
    "total_price": 66000,
    "paid_amount": 22000,
    "pending_amount": 0,
    "remaining_balance": 44000,
    "booking_status": "deposit_paid",
    "booking_status_ar": "دفعة أولى مسددة",
    "booking_status_en": "Deposit Paid",
    "payment_status": "partial",
    "payment_status_ar": "سداد جزئي (متبقي رصيد)",
    "payment_status_en": "Partial (Balance Due)",
    "travelers": [
      {
        "id": "TRV-1047-1",
        "name_ar": "سارة خالد المنصوري",
        "name_en": "Sarah Khaled El-Mansouri",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي (صاحب الحجز)",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      },
      {
        "id": "TRV-1047-2",
        "name_ar": "ياسمين خالد المنصوري",
        "name_en": "Yasmine Khaled El-Mansouri",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الأخت / مرافق",
        "relationship_en": "Sister / Companion",
        "completion_status": "missing_docs",
        "completion_label_ar": "مستندات ناقصة (جواز السفر بانتظار التجديد)",
        "completion_label_en": "Missing Documents"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1047-1",
        "author": "شركة مناسك العالمية",
        "date": "2026-10-29 17:00",
        "text_ar": "تم التنبيه على العميلة بضرورة تزويدنا بصورة جواز السفر المجدد للمرافقة قبل موعد إصدار التأشيرات بشهر على الأقل.",
        "text_en": "Customer informed to submit renewed passport for the second passenger at least 1 month before visa deadline."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1047-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-10-30 09:15",
        "text": "تم تحصيل العربون ٢٢,٠٠٠ ج.م واعتماده دفترياً. الرصيد المتبقي ٤٤,٠٠٠ ج.م مستحق السداد في موعد أقصاه ١٥ مارس ٢٠٢٧."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "deposit_paid",
        "to_status_ar": "سداد دفعة أولى",
        "date": "2026-10-29 16:50",
        "actor": "طارق عبد العال (محاسب مناسك)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9071",
        "date": "2026-10-29 16:45",
        "amount": 22000,
        "payment_method": "vodafone_cash",
        "payment_method_ar": "فودافون كاش (محفظة إلكترونية)",
        "payment_method_en": "Vodafone Cash (Mobile Wallet)",
        "transaction_type": "deposit",
        "transaction_type_ar": "دفعة أولى (عربون تأكيد)",
        "transaction_type_en": "Initial Deposit",
        "transaction_source": "company_portal",
        "transaction_source_ar": "بوابة شركة السياحة الشريكة",
        "transaction_source_en": "Partner Company Portal",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 44000,
        "received_by": "طارق عبد العال — محاسب مناسك",
        "receipt_ref": "RCP-2026-4431",
        "notes": "سداد عربون الحجز عبر محفظة فودافون كاش المعتمدة للشركة",
        "evidence": {
          "type": "wallet_receipt",
          "filename": "VF_Cash_Slip_22000.png",
          "size": "420 KB",
          "date": "2026-10-29 16:42",
          "bank_ref": "VF-WAL-889104",
          "account": "01099283419"
        },
        "discussion": [
          {
            "id": "DISC-9071-1",
            "author_name": "طارق عبد العال",
            "author_role": "محاسب شركة السياحة",
            "date": "2026-10-29 16:48",
            "message": "تم إيداع العربون في محفظة الشركة والتأكيد مع العميلة."
          }
        ],
        "audit_trail": [
          {
            "action": "اعتماد سداد دفعة أولى",
            "actor": "أحمد صبري",
            "date": "2026-10-30 09:20",
            "details": "اعتماد ٢٢,٠٠٠ ج.م وخفض الرصيد المتبقي إلى ٤٤,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1047-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز عمرة شوال BK-2026-1047",
        "title_en": "Booking Registered BK-2026-1047",
        "desc_ar": "حجز عمرة شوال الاقتصادية بقيمة إجمالية ٦٦,٠٠٠ ج.م",
        "desc_en": "Shawwal Economy Umrah booked at 66,000 EGP total",
        "actor_ar": "سارة المنصوري (العميل)",
        "actor_en": "Sarah El-Mansouri (Customer)",
        "date": "2026-10-29 16:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1047-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد دفعة أولى TX-2026-9071",
        "title_en": "Initial Deposit Recorded",
        "desc_ar": "سداد مبلغ ٢٢,٠٠٠ ج.م عبر فودافون كاش",
        "desc_en": "Paid 22,000 EGP via Vodafone Cash",
        "actor_ar": "طارق عبد العال (محاسب مناسك)",
        "actor_en": "Tarek Abdel Aal (Manasek)",
        "date": "2026-10-29 16:45",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1047-3",
        "type": "status_changed",
        "type_label_ar": "تحديث حالة",
        "type_label_en": "Status Changed",
        "title_ar": "تحديث الحالة إلى سداد دفعة أولى",
        "title_en": "Status Changed to Deposit Paid",
        "desc_ar": "الحجز قيد السداد بانتظار استكمال باقي المبلغ",
        "desc_en": "Booking pending final balance payment",
        "actor_ar": "طارق عبد العال (محاسب مناسك)",
        "actor_en": "Tarek Abdel Aal (Manasek)",
        "date": "2026-10-29 16:50",
        "link_tab": "overview"
      }
    ]
  },
  {
    "id": "BK-2026-1048",
    "customerId": "CUST-1004",
    "customer_name_ar": "محمود فوزي رضوان",
    "customer_name_en": "Mahmoud Fawzy Radwan",
    "customer_phone": "01066782345",
    "customer_whatsapp": "01066782345",
    "customer_email": "mahmoud.radwan@gmail.com",
    "customer_governorate_ar": "الشرقية",
    "customer_governorate_en": "Sharqia",
    "company_id": "COMP-104",
    "company_ar": "شركة الصفا للنقل والخدمات السياحية",
    "company_en": "Al-Safa Travel & Tourism",
    "company_phone": "0237612300",
    "company_email": "support@alsafa-travel.com",
    "company_license": "ترخيص سياحي رقم ٦٤٢ فئة (أ)",
    "company_license_en": "Tourism License #642 Category (A)",
    "company_booking_ref": "SF-2026-3391",
    "program_id": "PRG-104",
    "program_ar": "عمرة رجب المعيارية (حافلة حديثة)",
    "program_en": "Rajab Standard Umrah (Bus)",
    "program_type": "standard",
    "program_type_ar": "عمرة معيارية",
    "program_type_en": "Standard Umrah",
    "season_ar": "رجب ١٤٤٨ هـ (يناير ٢٠٢٧)",
    "season_en": "Rajab 1448 AH (Jan 2027)",
    "season_key": "rajab_1448",
    "created_date": "2026-10-20",
    "travel_date": "2027-01-22",
    "travelers_count": 1,
    "total_price": 52000,
    "paid_amount": 52000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "cancelled",
    "booking_status_ar": "ملغي (بانتظار تسوية الاسترداد)",
    "booking_status_en": "Cancelled (Pending Refund Settlement)",
    "payment_status": "refunded",
    "payment_status_ar": "مسترد / قيد رد الأموال",
    "payment_status_en": "Refund Under Review",
    "travelers": [
      {
        "id": "TRV-1048-1",
        "name_ar": "محمود فوزي رضوان",
        "name_en": "Mahmoud Fawzy Radwan",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1048-1",
        "author": "شركة الصفا للنقل",
        "date": "2026-11-02 11:30",
        "text_ar": "تقدم العميل بطلب رسمي لإلغاء الحجز لظروف عمل طارئة خارج البلاد وطلب استرداد المبلغ المسدد وفق شروط الإلغاء المبكر.",
        "text_en": "Customer submitted official cancellation request due to emergency overseas work, requesting refund per policy."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1048-1",
        "author_name": "عمر شريف",
        "author_role": "مسؤول الاستردادات المالية",
        "date": "2026-11-02 14:00",
        "text": "طلب الاسترداد رقم RF-2026-078 قيد المراجعة مع شركة الصفا لحساب الرسوم الإدارية وخصم تكلفة حجز الفندق إن وجدت."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "confirmed",
        "to_status_ar": "حجز مؤكد ومسدد",
        "date": "2026-10-20 12:15",
        "actor": "محمود عبد العزيز (الصفا)"
      },
      {
        "from_status": "confirmed",
        "from_status_ar": "حجز مؤكد ومسدد",
        "to_status": "cancelled",
        "to_status_ar": "حجز ملغي بناءً على طلب العميل",
        "date": "2026-11-02 11:45",
        "actor": "عمر شريف (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9035",
        "date": "2026-10-20 12:00",
        "amount": 52000,
        "payment_method": "bank_transfer",
        "payment_method_ar": "تحويل بنكي (بنك مصر)",
        "payment_method_en": "Bank Transfer (Banque Misr)",
        "transaction_type": "full_payment",
        "transaction_type_ar": "سداد كامل المبلغ",
        "transaction_type_en": "Full Payment",
        "transaction_source": "company_portal",
        "transaction_source_ar": "بوابة شركة السياحة الشريكة",
        "transaction_source_en": "Partner Company Portal",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "محمود عبد العزيز — محاسب الصفا",
        "receipt_ref": "RCP-2026-4390",
        "notes": "سداد كامل الحجز في حساب الشركة المعتمد",
        "evidence": {
          "type": "bank_slip",
          "filename": "Misr_Bank_Slip_52K.pdf",
          "size": "1.1 MB",
          "date": "2026-10-20 11:55",
          "bank_ref": "BM-EGY-662190",
          "account": "19003819200"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد سداد كامل",
            "actor": "عمر شريف",
            "date": "2026-10-20 12:30",
            "details": "سداد كامل ٥٢,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [
      {
        "id": "RF-2026-078",
        "booking_id": "BK-2026-1048",
        "request_date": "2026-11-02",
        "request_source": "customer",
        "request_source_ar": "طلب مباشر من العميل",
        "request_source_en": "Customer-Initiated Request",
        "refund_type": "full_cancellation",
        "refund_type_ar": "استرداد كامل مع إلغاء الحجز",
        "refund_type_en": "Full Cancellation Refund",
        "requested_amount": 52000,
        "approved_amount": 49500,
        "actually_refunded_amount": 0,
        "status": "under_review",
        "status_ar": "قيد دراسة الإدارة المالية",
        "status_en": "Under Financial Review",
        "last_updated": "2026-11-03 11:00",
        "reason_ar": "إلغاء الحجز لظروف عمل طارئة خارج البلاد قبل موعد السفر بشهرين",
        "reason_en": "Emergency overseas work travel 2 months prior to departure date",
        "notes": "تطبيق رسوم إدارية بقيمة ٢,٥٠٠ ج.م وفقاً للبند الرابع من لائحة الإلغاء المبكر"
      }
    ],
    "activities": [
      {
        "id": "ACT-1048-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "إنشاء حجز عمرة رجب BK-2026-1048",
        "title_en": "Booking Created BK-2026-1048",
        "desc_ar": "تم حجز رحلة رجب المعيارية بقيمة ٥٢,٠٠٠ ج.م",
        "desc_en": "Rajab Standard Umrah booked at 52,000 EGP",
        "actor_ar": "محمود رضوان (العميل)",
        "actor_en": "Mahmoud Radwan (Customer)",
        "date": "2026-10-20 11:30",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1048-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد كامل المبلغ عبر تحويل بنكي",
        "title_en": "Full Payment Recorded",
        "desc_ar": "سداد ٥٢,٠٠٠ ج.م عبر بنك مصر",
        "desc_en": "52,000 EGP paid via Banque Misr",
        "actor_ar": "محمود عبد العزيز (الصفا)",
        "actor_en": "Mahmoud Abdel Aziz (Al-Safa)",
        "date": "2026-10-20 12:00",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1048-3",
        "type": "refund_requested",
        "type_label_ar": "طلب استرداد",
        "type_label_en": "Refund Requested",
        "title_ar": "تسجيل طلب استرداد مالي RF-2026-078",
        "title_en": "Refund Request Registered RF-2026-078",
        "desc_ar": "طلب استرداد كامل مع إلغاء الحجز بقيمة ٥٢,٠٠٠ ج.م",
        "desc_en": "Full cancellation refund request for 52,000 EGP",
        "actor_ar": "محمود رضوان (العميل)",
        "actor_en": "Mahmoud Radwan (Customer)",
        "date": "2026-11-02 11:30",
        "link_tab": "refunds"
      },
      {
        "id": "ACT-1048-4",
        "type": "status_changed",
        "type_label_ar": "تحديث حالة",
        "type_label_en": "Status Changed",
        "title_ar": "تحديث حالة الحجز إلى ملغي",
        "title_en": "Booking Status Cancelled",
        "desc_ar": "تم إلغاء الحجز ونقله إلى مسار التسوية المالية",
        "desc_en": "Booking cancelled and routed to financial settlement",
        "actor_ar": "عمر شريف (حسابات ميقات)",
        "actor_en": "Omar Sharif (Miqat Accounts)",
        "date": "2026-11-02 11:45",
        "link_tab": "overview"
      }
    ]
  },
  {
    "id": "BK-2026-1049",
    "customerId": "CUST-1005",
    "customer_name_ar": "فاطمة الزهراء علي",
    "customer_name_en": "Fatima Al-Zahraa Ali",
    "customer_phone": "01232574706",
    "customer_whatsapp": "01232574706",
    "customer_email": "fatima.ali@outlook.com",
    "customer_governorate_ar": "الدقهلية",
    "customer_governorate_en": "Dakahlia",
    "company_id": "COMP-103",
    "company_ar": "شركة مناسك العالمية للسياحة",
    "company_en": "Manasek Global Travel",
    "company_phone": "0225197800",
    "company_email": "accounts@manasek-travel.com",
    "company_license": "ترخيص سياحي رقم ٥١٢ فئة (أ)",
    "company_license_en": "Tourism License #512 Category (A)",
    "company_booking_ref": "MN-2026-5512",
    "program_id": "PRG-105",
    "program_ar": "عمرة شعبان VIP برج الساعة",
    "program_en": "Shaban VIP Clock Tower Umrah",
    "program_type": "vip",
    "program_type_ar": "عمرة VIP",
    "program_type_en": "VIP Umrah",
    "season_ar": "شعبان ١٤٤٨ هـ (فبراير ٢٠٢٧)",
    "season_en": "Shaban 1448 AH (Feb 2027)",
    "season_key": "shaban_1448",
    "created_date": "2026-11-01",
    "travel_date": "2027-02-15",
    "travelers_count": 2,
    "total_price": 148000,
    "paid_amount": 148000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "confirmed",
    "booking_status_ar": "مؤكد (مع وجود طلب استرداد جزئي)",
    "booking_status_en": "Confirmed (Partial Refund Under Review)",
    "payment_status": "paid_full",
    "payment_status_ar": "مسدد بالكامل",
    "payment_status_en": "Paid in Full",
    "travelers": [
      {
        "id": "TRV-1049-1",
        "name_ar": "فاطمة الزهراء علي",
        "name_en": "Fatima Al-Zahraa Ali",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي (صاحب الحجز)",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات",
        "completion_label_en": "Complete"
      },
      {
        "id": "TRV-1049-2",
        "name_ar": "هدى عبد العزيز علي",
        "name_en": "Huda Abdelaziz Ali",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الوالدة / مرافق",
        "relationship_en": "Mother / Companion",
        "completion_status": "incomplete_data",
        "completion_label_ar": "بيانات صحية معلقة (طلب إلغاء لمرافق واحد)",
        "completion_label_en": "Incomplete Data (Pending 1 Passenger Cancel)"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1049-1",
        "author": "شركة مناسك العالمية",
        "date": "2026-11-01 16:30",
        "text_ar": "قامت الشركة برفع طلب استرداد جزئي نيابة عن العميلة لإلغاء سفر الوالدة لظروف صحية طارئة مع استمرار سفر العميلة في موعدها.",
        "text_en": "Partner company submitted partial refund on behalf of customer for mother due to health conditions, while primary booker continues."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1049-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-11-02 10:15",
        "text": "ملاحظة رقابية: الاسترداد الجزئي لا يلغي الحجز الأصلي. الحد الأقصى القابل للاسترداد يساوي المبالغ المعتمدة المسددة مخصوماً منها أي استردادات سابقة. الرصيد القابل للاسترداد حالياً: ١٤٨,٠٠٠ ج.م والمطلوب استرداده: ٢٥,٠٠٠ ج.م فقط."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "confirmed",
        "to_status_ar": "حجز مؤكد ومسدد بالكامل",
        "date": "2026-11-01 10:30",
        "actor": "سارة منصور (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9080",
        "date": "2026-11-01 09:30",
        "amount": 148000,
        "payment_method": "bank_transfer",
        "payment_method_ar": "تحويل بنكي رسمي (QNB الأهلي)",
        "payment_method_en": "Bank Transfer (QNB Alahli)",
        "transaction_type": "full_payment",
        "transaction_type_ar": "سداد كامل القيمة",
        "transaction_type_en": "Full Payment",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "سارة منصور — حسابات ميقات",
        "receipt_ref": "RCP-2026-4440",
        "notes": "سداد إلكتروني معتمد بالكامل لحجز VIP",
        "evidence": {
          "type": "bank_slip",
          "filename": "QNB_VIP_Transfer_148K.pdf",
          "size": "1.4 MB",
          "date": "2026-11-01 09:20",
          "bank_ref": "QNB-EGY-991823",
          "account": "00192847192"
        },
        "discussion": [
          {
            "id": "DISC-9080-1",
            "author_name": "سارة منصور",
            "author_role": "مشرف حسابات كبار العملاء",
            "date": "2026-11-01 09:40",
            "message": "تم التأكد من استلام كامل المبلغ في حساب ميقات الرئيسي وتأكيد الحجز."
          }
        ],
        "audit_trail": [
          {
            "action": "اعتماد سداد كامل",
            "actor": "سارة منصور",
            "date": "2026-11-01 09:45",
            "details": "اعتماد ١٤٨,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [
      {
        "id": "RF-2026-081",
        "booking_id": "BK-2026-1049",
        "request_date": "2026-11-01",
        "request_source": "partner_company",
        "request_source_ar": "طلب عبر شركة السياحة الشريكة",
        "request_source_en": "Partner Tourism Company-Initiated",
        "refund_type": "partial_refund",
        "refund_type_ar": "استرداد جزئي (الحجز مستمر للعميل)",
        "refund_type_en": "Partial Refund (Booking Continues)",
        "requested_amount": 25000,
        "approved_amount": 25000,
        "actually_refunded_amount": 0,
        "status": "under_review",
        "status_ar": "قيد دراسة الإدارة المالية",
        "status_en": "Under Financial Review",
        "last_updated": "2026-11-03 14:15",
        "reason_ar": "إلغاء حجز لمرافق واحد (الوالدة) لظروف صحية طارئة مع تقرير طبي رسمي معتمد",
        "reason_en": "Cancellation for 1 companion (mother) due to emergency medical conditions with official report",
        "notes": "قيد دراسة الإدارة المالية والتسوية مع منظم الرحلة، الطلب لا يلغي حجز الحاجة الرئيسية"
      }
    ],
    "activities": [
      {
        "id": "ACT-1049-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز عمرة شعبان VIP",
        "title_en": "VIP Shaban Booking Registered",
        "desc_ar": "حجز عمرة شعبان VIP برج الساعة بقيمة ١٤٨,٠٠٠ ج.م",
        "desc_en": "Shaban VIP Clock Tower Umrah booked at 148,000 EGP",
        "actor_ar": "فاطمة الزهراء (العميل)",
        "actor_en": "Fatima Al-Zahraa (Customer)",
        "date": "2026-11-01 09:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1049-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد كامل المبلغ عبر تحويل بنكي TX-2026-9080",
        "title_en": "Full Bank Transfer Payment Recorded",
        "desc_ar": "سداد ١٤٨,٠٠٠ ج.م عبر QNB الأهلي",
        "desc_en": "148,000 EGP paid via QNB Alahli",
        "actor_ar": "سارة منصور (حسابات ميقات)",
        "actor_en": "Sarah Mansour (Miqat Accounts)",
        "date": "2026-11-01 09:30",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1049-3",
        "type": "refund_requested",
        "type_label_ar": "طلب استرداد",
        "type_label_en": "Refund Requested",
        "title_ar": "تقديم طلب استرداد جزئي RF-2026-081",
        "title_en": "Partial Refund Requested RF-2026-081",
        "desc_ar": "طلب استرداد ٢٥,٠٠٠ ج.م لمرافق واحد لظروف صحية",
        "desc_en": "Partial refund requested for 25,000 EGP due to medical condition",
        "actor_ar": "شركة مناسك العالمية للسياحة",
        "actor_en": "Manasek Global Travel",
        "date": "2026-11-01 16:30",
        "link_tab": "refunds"
      }
    ]
  },
  {
    "id": "BK-2026-1050",
    "customerId": "CUST-1006",
    "customer_name_ar": "عبد الرحمن طارق الجمل",
    "customer_name_en": "Abdelrahman Tarek El-Gamal",
    "customer_phone": "01551239874",
    "customer_whatsapp": "01551239874",
    "customer_email": "abdelrahman.gamal@gmail.com",
    "customer_governorate_ar": "الغربية",
    "customer_governorate_en": "Gharbia",
    "company_id": "COMP-105",
    "company_ar": "شركة البركة لخدمات المعتمرين",
    "company_en": "Al-Baraka Umrah Services",
    "company_phone": "0403319800",
    "company_email": "info@albaraka-umrah.com",
    "company_license": "ترخيص سياحي رقم ٧٢١ فئة (أ)",
    "company_license_en": "Tourism License #721 Category (A)",
    "company_booking_ref": "BR-2026-1102",
    "program_id": "PRG-106",
    "program_ar": "عمرة رجب البرية الاقتصادية",
    "program_en": "Rajab Land Economy Umrah",
    "program_type": "economy",
    "program_type_ar": "عمرة اقتصادية برية",
    "program_type_en": "Economy Land Umrah",
    "season_ar": "رجب ١٤٤٨ هـ (يناير ٢٠٢٧)",
    "season_en": "Rajab 1448 AH (Jan 2027)",
    "season_key": "rajab_1448",
    "created_date": "2026-11-02",
    "travel_date": "2027-01-28",
    "travelers_count": 1,
    "total_price": 39000,
    "paid_amount": 15000,
    "pending_amount": 10000,
    "remaining_balance": 24000,
    "booking_status": "under_review",
    "booking_status_ar": "قيد المراجعة والتدقيق",
    "booking_status_en": "Under Review",
    "payment_status": "partial",
    "payment_status_ar": "سداد جزئي (يوجد تحصيل قيد الاعتماد)",
    "payment_status_en": "Partial (Pending Review Included)",
    "has_pending_review": true,
    "travelers": [
      {
        "id": "TRV-1050-1",
        "name_ar": "عبد الرحمن طارق الجمل",
        "name_en": "Abdelrahman Tarek El-Gamal",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1050-1",
        "author": "شركة البركة",
        "date": "2026-11-02 14:00",
        "text_ar": "قام العميل بسداد الدفعة الثانية وقدرها ١٠,٠٠٠ ج.م عبر المحفظة الإلكترونية وبانتظار اعتماد الإدارة المالية بميقات.",
        "text_en": "Customer paid second installment 10,000 EGP via mobile wallet, awaiting Miqat finance verification."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1050-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-11-02 16:30",
        "text": "تنبيه تدقيق: المعاملة TX-2026-9088 بقيمة ١٠,٠٠٠ ج.م معلقة وقيد التدقيق. لم يتم احتسابها ضمن المحصل المعتمد ولا تخفض الرصيد المتبقي حتى استلام إشعار التحويل البنكي الرسمي وتطابق رقم العملية."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "deposit_paid",
        "to_status_ar": "سداد دفعة أولى",
        "date": "2026-11-02 11:00",
        "actor": "خالد سالم (محاسب البركة)"
      },
      {
        "from_status": "deposit_paid",
        "from_status_ar": "سداد دفعة أولى",
        "to_status": "under_review",
        "to_status_ar": "قيد تدقيق تحصيل إضافي",
        "date": "2026-11-02 15:45",
        "actor": "أحمد صبري (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9085",
        "date": "2026-11-02 10:30",
        "amount": 15000,
        "payment_method": "cash",
        "payment_method_ar": "إيداع نقدي رسمي (خزينة الشركة)",
        "payment_method_en": "Cash Deposit (Company Safe)",
        "transaction_type": "deposit",
        "transaction_type_ar": "دفعة أولى (عربون)",
        "transaction_type_en": "Deposit",
        "transaction_source": "company_portal",
        "transaction_source_ar": "بوابة شركة السياحة الشريكة",
        "transaction_source_en": "Partner Company Portal",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 24000,
        "received_by": "خالد سالم — أمين خزينة البركة",
        "receipt_ref": "RCP-2026-4445",
        "notes": "إيصال استلام نقدية رقم ٥١٩ معتمد بختم الشركة",
        "evidence": {
          "type": "cash_voucher",
          "filename": "Cash_Voucher_15K_Baraka.pdf",
          "size": "890 KB",
          "date": "2026-11-02 10:25",
          "bank_ref": "CSH-VCH-5190",
          "account": "Safe-Tanta-Branch"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد إيصال نقدي معتمد",
            "actor": "أحمد صبري",
            "date": "2026-11-02 11:15",
            "details": "اعتماد ١٥,٠٠٠ ج.م وخفض الرصيد المتبقي إلى ٢٤,٠٠٠ ج.م"
          }
        ]
      },
      {
        "id": "TX-2026-9088",
        "date": "2026-11-02 15:30",
        "amount": 10000,
        "payment_method": "vodafone_cash",
        "payment_method_ar": "فودافون كاش",
        "payment_method_en": "Vodafone Cash",
        "transaction_type": "partial",
        "transaction_type_ar": "دفعة ثانية (قيد المراجعة والتدقيق)",
        "transaction_type_en": "Second Partial Payment",
        "transaction_source": "external_registration",
        "transaction_source_ar": "تسجيل تحصيل خارجي",
        "transaction_source_en": "External Payment Registration",
        "verification_status": "pending_review",
        "verification_status_ar": "قيد التدقيق والاعتماد المالي",
        "verification_status_en": "Pending Review & Approval",
        "balance_after": 24000,
        "received_by": "خالد سالم — محاسب البركة",
        "receipt_ref": "RCP-2026-4450",
        "notes": "بانتظار مطابقة رقم العملية مع تقرير المحفظة اليومي",
        "evidence": {
          "type": "wallet_receipt",
          "filename": "VF_Pending_Slip_10K.png",
          "size": "510 KB",
          "date": "2026-11-02 15:28",
          "bank_ref": "VF-TX-991204",
          "account": "01019283411"
        },
        "discussion": [
          {
            "id": "DISC-9088-1",
            "author_name": "خالد سالم",
            "author_role": "محاسب شركة السياحة",
            "date": "2026-11-02 15:35",
            "message": "تم إرفاق لقطة شاشة التحويل بمبلغ ١٠,٠٠٠ ج.م من العميل، نرجو تدقيقها واعتمادها."
          },
          {
            "id": "DISC-9088-2",
            "author_name": "أحمد صبري",
            "author_role": "موظف حسابات ميقات",
            "date": "2026-11-02 16:15",
            "message": "رقم المرجع في الإيصال غير مكتمل في الصورة المرفقة، طلبت من الشركة إعادة إرفاق كشف المحفظة أو إشعار الرسالة النصية الكامل."
          }
        ],
        "audit_trail": [
          {
            "action": "تسجيل معاملة تحصيل معلقة",
            "actor": "خالد سالم",
            "date": "2026-11-02 15:30",
            "details": "تسجيل دفعة معلقة بقيمة ١٠,٠٠٠ ج.م (لا تخفض الرصيد)"
          },
          {
            "action": "إضافة تعليق تدقيق مالي",
            "actor": "أحمد صبري",
            "date": "2026-11-02 16:15",
            "details": "طلب مستند أوضح لمطابقة رقم المعاملة مع تقرير فودافون"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1050-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز عمرة رجب البرية",
        "title_en": "Rajab Land Umrah Registered",
        "desc_ar": "حجز عمرة اقتصادية برية بقيمة ٣٩,٠٠٠ ج.م",
        "desc_en": "Economy Land Umrah booked at 39,000 EGP",
        "actor_ar": "عبد الرحمن الجمل (العميل)",
        "actor_en": "Abdelrahman El-Gamal (Customer)",
        "date": "2026-11-02 10:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1050-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد عربون نقدي معتمد TX-2026-9085",
        "title_en": "Approved Cash Deposit Recorded",
        "desc_ar": "إيداع نقدي رسمي بقيمة ١٥,٠٠٠ ج.م في الخزينة",
        "desc_en": "Official cash deposit of 15,000 EGP in safe",
        "actor_ar": "خالد سالم (محاسب البركة)",
        "actor_en": "Khaled Salem (Al-Baraka)",
        "date": "2026-11-02 10:30",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1050-3",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "تسجيل دفعة ثانية معلقة TX-2026-9088",
        "title_en": "Pending Payment Recorded TX-2026-9088",
        "desc_ar": "سداد ١٠,٠٠٠ ج.م عبر فودافون كاش قيد التدقيق المالي",
        "desc_en": "10,000 EGP paid via Vodafone Cash pending financial review",
        "actor_ar": "خالد سالم (محاسب البركة)",
        "actor_en": "Khaled Salem (Al-Baraka)",
        "date": "2026-11-02 15:30",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1050-4",
        "type": "admin_reply",
        "type_label_ar": "مراجعة مالية",
        "type_label_en": "Financial Review",
        "title_ar": "إضافة تعليق مراجعة على الدفعة المعلقة",
        "title_en": "Audit Comment Added to Pending Payment",
        "desc_ar": "تم طلب مستند رسمي أوضح لمطابقة رقم المعاملة مع تقرير الشركة",
        "desc_en": "Clearer documentation requested to verify transaction ID against statement",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-11-02 16:15",
        "link_tab": "payments"
      }
    ]
  },
  {
    "id": "BK-2026-1051",
    "customerId": "CUST-1007",
    "customer_name_ar": "مريم حسام الدين النجار",
    "customer_name_en": "Maryam Hossam El-Din El-Naggar",
    "customer_phone": "01099887766",
    "customer_whatsapp": "01099887766",
    "customer_email": "maryam.naggar@hotmail.com",
    "customer_governorate_ar": "بورسعيد",
    "customer_governorate_en": "Port Said",
    "company_id": "COMP-104",
    "company_ar": "شركة الصفا للنقل والخدمات السياحية",
    "company_en": "Al-Safa Travel & Tourism",
    "company_phone": "0237612300",
    "company_email": "support@alsafa-travel.com",
    "company_license": "ترخيص سياحي رقم ٦٤٢ فئة (أ)",
    "company_license_en": "Tourism License #642 Category (A)",
    "company_booking_ref": "SF-2026-3405",
    "program_id": "PRG-107",
    "program_ar": "عمرة برية فاخرة — فنادق الحرم",
    "program_en": "Deluxe Land Umrah — Haram Hotels",
    "program_type": "deluxe",
    "program_type_ar": "عمرة فاخرة",
    "program_type_en": "Deluxe Umrah",
    "season_ar": "شعبان ١٤٤٨ هـ (فبراير ٢٠٢٧)",
    "season_en": "Shaban 1448 AH (Feb 2027)",
    "season_key": "shaban_1448",
    "created_date": "2026-11-01",
    "travel_date": "2027-02-18",
    "travelers_count": 2,
    "total_price": 56000,
    "paid_amount": 28000,
    "pending_amount": 0,
    "remaining_balance": 28000,
    "booking_status": "deposit_paid",
    "booking_status_ar": "دفعة أولى (مقترح تعديل معلق)",
    "booking_status_en": "Deposit Paid (Proposed Change Pending)",
    "payment_status": "partial",
    "payment_status_ar": "سداد جزئي",
    "payment_status_en": "Partial",
    "travelers": [
      {
        "id": "TRV-1051-1",
        "name_ar": "مريم حسام الدين النجار",
        "name_en": "Maryam Hossam El-Din El-Naggar",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي (صاحب الحجز)",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      },
      {
        "id": "TRV-1051-2",
        "name_ar": "نورهان حسام الدين النجار",
        "name_en": "Nourhan Hossam El-Din El-Naggar",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الأخت / مرافق",
        "relationship_en": "Sister / Companion",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1051-1",
        "author": "شركة الصفا للنقل",
        "date": "2026-11-01 13:00",
        "text_ar": "تقدمت الشركة بطلب اقتراح تعديل مسار الرحلة إلى عمرة طيران بدلاً من البرية بناءً على رغبة مبدئية من العميلة، الطلب بانتظار موافقة العميلة الرسمية.",
        "text_en": "Company proposed itinerary upgrade to flight umrah per initial client interest, awaiting formal customer agreement."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1051-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-11-01 14:30",
        "text": "قاعدة العمل المعتمدة: البرنامج الأصلي وسعره (٥٦,٠٠٠ ج.م) يظلان هما المعتمدين رسمياً ولا يتم تعديل السعر أو الرصيد المتبقي إلا بعد توثيق موافقة العميل وتوقيع الملحق."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "deposit_paid",
        "to_status_ar": "سداد دفعة أولى",
        "date": "2026-11-01 12:15",
        "actor": "محمود عبد العزيز (الصفا)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9092",
        "date": "2026-11-01 12:00",
        "amount": 28000,
        "payment_method": "instapay",
        "payment_method_ar": "إنستاباي فوري",
        "payment_method_en": "InstaPay Instant",
        "transaction_type": "deposit",
        "transaction_type_ar": "سداد دفعة أولى ٥٠٪",
        "transaction_type_en": "50% Initial Deposit",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 28000,
        "received_by": "أحمد صبري — حسابات ميقات",
        "receipt_ref": "RCP-2026-4455",
        "notes": "دفعة أولى معتمدة لحجز عمرة شعبان البرية",
        "evidence": {
          "type": "instapay_slip",
          "filename": "InstaPay_Slip_28K.png",
          "size": "610 KB",
          "date": "2026-11-01 11:58",
          "bank_ref": "IPN-20261101-99412",
          "account": "maryam.naggar@instapay"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد سداد دفعة أولى",
            "actor": "أحمد صبري",
            "date": "2026-11-01 12:20",
            "details": "اعتماد ٢٨,٠٠٠ ج.م وخفض الرصيد المتبقي إلى ٢٨,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1051-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز عمرة شعبان الفاخرة",
        "title_en": "Deluxe Shaban Umrah Registered",
        "desc_ar": "حجز عمرة برية فاخرة بقيمة ٥٦,٠٠٠ ج.م",
        "desc_en": "Deluxe Land Umrah booked at 56,000 EGP",
        "actor_ar": "مريم النجار (العميل)",
        "actor_en": "Maryam El-Naggar (Customer)",
        "date": "2026-11-01 11:30",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1051-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد دفعة أولى عبر إنستاباي TX-2026-9092",
        "title_en": "Deposit Paid via InstaPay TX-2026-9092",
        "desc_ar": "سداد ٢٨,٠٠٠ ج.م تم اعتماده دفترياً",
        "desc_en": "28,000 EGP verified and ledger updated",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-11-01 12:00",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1051-3",
        "type": "program_change_proposed",
        "type_label_ar": "اقتراح تعديل",
        "type_label_en": "Change Proposed",
        "title_ar": "اقتراح ترقية البرنامج إلى عمرة طيران",
        "title_en": "Flight Umrah Upgrade Proposed",
        "desc_ar": "تم تقديم مقترح الترقية بقيمة إجمالية ٧٢,٠٠٠ ج.م بانتظار موافقة العميل",
        "desc_en": "Upgrade proposal submitted for 72,000 EGP pending customer agreement",
        "actor_ar": "شركة الصفا للنقل والسياحة",
        "actor_en": "Al-Safa Travel & Tourism",
        "date": "2026-11-01 13:00",
        "link_tab": "overview"
      }
    ]
  },
  {
    "id": "BK-2026-1052",
    "customerId": "CUST-1008",
    "customer_name_ar": "ياسر كمال المنياوي",
    "customer_name_en": "Yasser Kamal El-Menyawi",
    "customer_phone": "01122334455",
    "customer_whatsapp": "01122334455",
    "customer_email": "yasser.menyawi@gmail.com",
    "customer_governorate_ar": "المنيا",
    "customer_governorate_en": "Minya",
    "company_id": "COMP-106",
    "company_ar": "شركة دار السلام للسياحة والحج والعمرة",
    "company_en": "Dar Al-Salam Hajj & Umrah",
    "company_phone": "0233081100",
    "company_email": "finance@daralsalam-hajj.com",
    "company_license": "ترخيص سياحي رقم ٨٣٠ فئة (أ)",
    "company_license_en": "Tourism License #830 Category (A)",
    "company_booking_ref": "DS-2026-7714",
    "program_id": "PRG-108",
    "program_ar": "عمرة رمضان العشر الأواخر (طيران)",
    "program_en": "Ramadan Last 10 Days (Flight)",
    "program_type": "five_star",
    "program_type_ar": "عمرة ٥ نجوم متميزة",
    "program_type_en": "5-Star Premium",
    "season_ar": "رمضان ١٤٤٨ هـ (مارس ٢٠٢٧)",
    "season_en": "Ramadan 1448 AH (Mar 2027)",
    "season_key": "ramadan_1448",
    "created_date": "2026-11-02",
    "travel_date": "2027-03-22",
    "travelers_count": 1,
    "total_price": 185000,
    "paid_amount": 50000,
    "pending_amount": 35000,
    "remaining_balance": 135000,
    "booking_status": "under_review",
    "booking_status_ar": "قيد تدقيق دفعة ثانية",
    "booking_status_en": "Under Review (Pending Payment)",
    "payment_status": "partial",
    "payment_status_ar": "سداد جزئي (دفعة معلقة قيد المراجعة)",
    "payment_status_en": "Partial (Pending Verification)",
    "has_pending_review": true,
    "travelers": [
      {
        "id": "TRV-1052-1",
        "name_ar": "ياسر كمال المنياوي",
        "name_en": "Yasser Kamal El-Menyawi",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1052-1",
        "author": "شركة دار السلام",
        "date": "2026-11-02 16:00",
        "text_ar": "قام العميل بسداد دفعة ثانية قدرها ٣٥,٠٠٠ ج.م عبر إنستاباي لحساب الشركة وننتظر اعتماد المحاسب بميقات.",
        "text_en": "Customer submitted second payment of 35,000 EGP via InstaPay to company account, awaiting Miqat verification."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1052-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-11-03 09:30",
        "text": "معاملة التحصيل TX-2026-9104 بقيمة ٣٥,٠٠٠ ج.م تتطلب تدقيق كشف البنك ومطابقة وقت التحويل قبل التأكيد النهائي."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "deposit_paid",
        "to_status_ar": "سداد دفعة أولى ٥٠,٠٠٠ ج.م",
        "date": "2026-11-02 12:00",
        "actor": "أيمن عبد السلام (دار السلام)"
      },
      {
        "from_status": "deposit_paid",
        "from_status_ar": "سداد دفعة أولى",
        "to_status": "under_review",
        "to_status_ar": "قيد مراجعة دفعة إضافية",
        "date": "2026-11-02 16:30",
        "actor": "أحمد صبري (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9100",
        "date": "2026-11-02 11:45",
        "amount": 50000,
        "payment_method": "bank_transfer",
        "payment_method_ar": "تحويل بنكي (بنك القاهرة)",
        "payment_method_en": "Bank Transfer (BDC)",
        "transaction_type": "deposit",
        "transaction_type_ar": "عربون حجز أولي",
        "transaction_type_en": "Initial Deposit",
        "transaction_source": "company_portal",
        "transaction_source_ar": "بوابة شركة السياحة الشريكة",
        "transaction_source_en": "Partner Company Portal",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 135000,
        "received_by": "أيمن عبد السلام — محاسب دار السلام",
        "receipt_ref": "RCP-2026-4460",
        "notes": "عربون حجز فندقي العشر الأواخر",
        "evidence": {
          "type": "bank_slip",
          "filename": "BDC_Transfer_50K.pdf",
          "size": "1.3 MB",
          "date": "2026-11-02 11:40",
          "bank_ref": "BDC-TRF-11094",
          "account": "0091823719"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد سداد دفعة أولى",
            "actor": "أحمد صبري",
            "date": "2026-11-02 12:15",
            "details": "اعتماد ٥٠,٠٠٠ ج.م وخفض الرصيد المتبقي إلى ١٣٥,٠٠٠ ج.م"
          }
        ]
      },
      {
        "id": "TX-2026-9104",
        "date": "2026-11-02 15:50",
        "amount": 35000,
        "payment_method": "instapay",
        "payment_method_ar": "إنستاباي فوري",
        "payment_method_en": "InstaPay Instant",
        "transaction_type": "partial",
        "transaction_type_ar": "دفعة ثانية (قيد المراجعة)",
        "transaction_type_en": "Second Partial Payment",
        "transaction_source": "external_registration",
        "transaction_source_ar": "تسجيل تحصيل خارجي",
        "transaction_source_en": "External Payment Registration",
        "verification_status": "pending_review",
        "verification_status_ar": "قيد التدقيق والاعتماد المالي",
        "verification_status_en": "Pending Review & Approval",
        "balance_after": 135000,
        "received_by": "أيمن عبد السلام — محاسب دار السلام",
        "receipt_ref": "RCP-2026-4468",
        "notes": "إشعار تحويل إنستاباي بانتظار التأكيد البنكي (لا يخفض الرصيد حالياً)",
        "evidence": {
          "type": "instapay_slip",
          "filename": "InstaPay_35K_Pending.png",
          "size": "590 KB",
          "date": "2026-11-02 15:48",
          "bank_ref": "IPN-20261102-33190",
          "account": "yasser.menyawi@instapay"
        },
        "discussion": [
          {
            "id": "DISC-9104-1",
            "author_name": "أيمن عبد السلام",
            "author_role": "محاسب شركة السياحة",
            "date": "2026-11-02 16:05",
            "message": "تم إرفاق إشعار إنستاباي، نرجو المراجعة والاعتماد المالي لتأكيد تذكرة الطيران."
          }
        ],
        "audit_trail": [
          {
            "action": "تسجيل معاملة تحصيل معلقة",
            "actor": "أيمن عبد السلام",
            "date": "2026-11-02 15:50",
            "details": "تسجيل تحصيل معلق بقيمة ٣٥,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1052-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "حجز عمرة رمضان العشر الأواخر",
        "title_en": "Ramadan Last 10 Days Booking Created",
        "desc_ar": "حجز عمرة رمضان ٥ نجوم طيران بقيمة ١٨٥,٠٠٠ ج.م",
        "desc_en": "5-Star Ramadan Flight Umrah booked at 185,000 EGP",
        "actor_ar": "ياسر المنياوي (العميل)",
        "actor_en": "Yasser El-Menyawi (Customer)",
        "date": "2026-11-02 11:00",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1052-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد دفعة أولى ٥٠,٠٠٠ ج.م TX-2026-9100",
        "title_en": "Deposit Payment Recorded",
        "desc_ar": "تحويل بنكي معتمد عبر بنك القاهرة",
        "desc_en": "Verified bank transfer via BDC",
        "actor_ar": "أيمن عبد السلام (دار السلام)",
        "actor_en": "Ayman Abdel Salam (Dar Al-Salam)",
        "date": "2026-11-02 11:45",
        "link_tab": "payments"
      },
      {
        "id": "ACT-1052-3",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "تسجيل دفعة ثانية معلقة ٣٥,٠٠٠ ج.م TX-2026-9104",
        "title_en": "Pending Payment Recorded TX-2026-9104",
        "desc_ar": "سداد عبر إنستاباي قيد تدقيق الإدارة المالية بميقات",
        "desc_en": "InstaPay payment pending Miqat financial review",
        "actor_ar": "أيمن عبد السلام (دار السلام)",
        "actor_en": "Ayman Abdel Salam (Dar Al-Salam)",
        "date": "2026-11-02 15:50",
        "link_tab": "payments"
      }
    ]
  },
  {
    "id": "BK-2026-1053",
    "customerId": "CUST-1009",
    "customer_name_ar": "خديجة مصطفى العوضي",
    "customer_name_en": "Khadija Mostafa El-Awadi",
    "customer_phone": "01277665544",
    "customer_whatsapp": "01277665544",
    "customer_email": "khadija.awadi@yahoo.com",
    "customer_governorate_ar": "أسيوط",
    "customer_governorate_en": "Asyut",
    "company_id": "COMP-107",
    "company_ar": "شركة التقوى للسياحة والرحلات الدينية",
    "company_en": "Al-Taqwa Travel & Tourism",
    "company_phone": "0882319000",
    "company_email": "info@altaqwa-travel.com",
    "company_license": "ترخيص سياحي رقم ٩٠٤ فئة (أ)",
    "company_license_en": "Tourism License #904 Category (A)",
    "company_booking_ref": "TQ-2026-2180",
    "program_id": "PRG-109",
    "program_ar": "عمرة شعبان الاقتصادية المعيارية",
    "program_en": "Shaban Standard Economy Umrah",
    "program_type": "standard",
    "program_type_ar": "عمرة معيارية",
    "program_type_en": "Standard Umrah",
    "season_ar": "شعبان ١٤٤٨ هـ (فبراير ٢٠٢٧)",
    "season_en": "Shaban 1448 AH (Feb 2027)",
    "season_key": "shaban_1448",
    "created_date": "2026-11-03",
    "travel_date": "2027-02-10",
    "travelers_count": 1,
    "total_price": 48000,
    "paid_amount": 48000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "confirmed",
    "booking_status_ar": "مؤكد",
    "booking_status_en": "Confirmed",
    "payment_status": "paid_full",
    "payment_status_ar": "مسدد بالكامل",
    "payment_status_en": "Paid in Full",
    "travelers": [
      {
        "id": "TRV-1053-1",
        "name_ar": "خديجة مصطفى العوضي",
        "name_en": "Khadija Mostafa El-Awadi",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1053-1",
        "author": "شركة التقوى للسياحة",
        "date": "2026-11-03 14:00",
        "text_ar": "تم تأكيد التسكين في فندق أجياد وتوفير كرسي متحرك للتنقل في المشاعر المقدسة وفق رغبة العميلة.",
        "text_en": "Ajyad hotel accommodation confirmed with wheelchair assistance arranged per customer request."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1053-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-11-03 15:30",
        "text": "تم السداد بالكامل عبر إنستاباي فوري، الحساب مقفل ومسوى دفترياً دون أي مستحقات."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "confirmed",
        "to_status_ar": "حجز مؤكد ومسدد بالكامل",
        "date": "2026-11-03 14:30",
        "actor": "أحمد صبري (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9110",
        "date": "2026-11-03 14:15",
        "amount": 48000,
        "payment_method": "instapay",
        "payment_method_ar": "إنستاباي فوري",
        "payment_method_en": "InstaPay Instant",
        "transaction_type": "full_payment",
        "transaction_type_ar": "سداد كامل القيمة",
        "transaction_type_en": "Full Payment",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "أحمد صبري — حسابات ميقات",
        "receipt_ref": "RCP-2026-4475",
        "notes": "سداد فوري معتمد عبر إنستاباي",
        "evidence": {
          "type": "instapay_slip",
          "filename": "InstaPay_Slip_48K.png",
          "size": "540 KB",
          "date": "2026-11-03 14:12",
          "bank_ref": "IPN-20261103-77218",
          "account": "khadija.awadi@instapay"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد سداد كامل",
            "actor": "أحمد صبري",
            "date": "2026-11-03 14:30",
            "details": "اعتماد ٤٨,٠٠٠ ج.م وتصفية الحساب"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1053-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "حجز عمرة شعبان المعيارية",
        "title_en": "Shaban Standard Booking Created",
        "desc_ar": "حجز عمرة بقيمة ٤٨,٠٠٠ ج.م",
        "desc_en": "Umrah booked at 48,000 EGP",
        "actor_ar": "خديجة العوضي (العميل)",
        "actor_en": "Khadija El-Awadi (Customer)",
        "date": "2026-11-03 13:45",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1053-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد كامل المبلغ عبر إنستاباي TX-2026-9110",
        "title_en": "Full InstaPay Payment Recorded",
        "desc_ar": "سداد ٤٨,٠٠٠ ج.م معتمد دفترياً",
        "desc_en": "48,000 EGP verified in ledger",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-11-03 14:15",
        "link_tab": "payments"
      }
    ]
  },
  {
    "id": "BK-2026-1054",
    "customerId": "CUST-1010",
    "customer_name_ar": "حازم عادل الشافعي",
    "customer_name_en": "Hazem Adel El-Shafei",
    "customer_phone": "01001122334",
    "customer_whatsapp": "01001122334",
    "customer_email": "hazem.shafei@gmail.com",
    "customer_governorate_ar": "القليوبية",
    "customer_governorate_en": "Qalyubia",
    "company_id": "COMP-108",
    "company_ar": "شركة نور الإيمان لخدمات الحرمين",
    "company_en": "Noor Al-Eman Haramain Services",
    "company_phone": "0244192000",
    "company_email": "vip@nooraleman-hajj.com",
    "company_license": "ترخيص سياحي رقم ٩٦٠ فئة (أ)",
    "company_license_en": "Tourism License #960 Category (A)",
    "company_booking_ref": "NE-2026-1940",
    "program_id": "PRG-110",
    "program_ar": "عمرة رجب VIP فنادق وقف الملك عبد العزيز",
    "program_en": "Rajab VIP King Abdulaziz Endowment",
    "program_type": "vip",
    "program_type_ar": "عمرة VIP متميزة",
    "program_type_en": "VIP Premium Umrah",
    "season_ar": "رجب ١٤٤٨ هـ (يناير ٢٠٢٧)",
    "season_en": "Rajab 1448 AH (Jan 2027)",
    "season_key": "rajab_1448",
    "created_date": "2026-11-03",
    "travel_date": "2027-01-20",
    "travelers_count": 2,
    "total_price": 160000,
    "paid_amount": 160000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "confirmed",
    "booking_status_ar": "مؤكد",
    "booking_status_en": "Confirmed",
    "payment_status": "paid_full",
    "payment_status_ar": "مسدد بالكامل",
    "payment_status_en": "Paid in Full",
    "travelers": [
      {
        "id": "TRV-1054-1",
        "name_ar": "حازم عادل الشافعي",
        "name_en": "Hazem Adel El-Shafei",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي (صاحب الحجز)",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      },
      {
        "id": "TRV-1054-2",
        "name_ar": "ريهام محمد الشافعي",
        "name_en": "Reham Mohamed El-Shafei",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الزوجة / مرافق",
        "relationship_en": "Spouse / Companion",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات والبيانات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1054-1",
        "author": "شركة نور الإيمان",
        "date": "2026-11-03 16:00",
        "text_ar": "تم حجز الإقامة في فندق دار التوحيد إنتركونتيننتال مكة وتوفير سيارة خاصة للتنقلات في مكة المكرمة والمدينة المنورة.",
        "text_en": "Dar Al-Tawhid InterContinental booked with private chauffeured vehicle in Makkah & Madinah."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1054-1",
        "author_name": "سارة منصور",
        "author_role": "مشرف حسابات كبار العملاء",
        "date": "2026-11-03 17:00",
        "text": "تم استلام المبلغ بالكامل عبر تحويل بنكي معتمد، والتأكد من استيفاء وثائق السفر والتأشيرات."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "confirmed",
        "to_status_ar": "حجز مؤكد ومسدد بالكامل",
        "date": "2026-11-03 16:30",
        "actor": "سارة منصور (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9120",
        "date": "2026-11-03 16:15",
        "amount": 160000,
        "payment_method": "bank_transfer",
        "payment_method_ar": "تحويل بنكي (بنك HSBC مصر)",
        "payment_method_en": "Bank Transfer (HSBC Egypt)",
        "transaction_type": "full_payment",
        "transaction_type_ar": "سداد كامل المبلغ دفعة واحدة",
        "transaction_type_en": "Full Payment Upfront",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "سارة منصور — حسابات ميقات",
        "receipt_ref": "RCP-2026-4485",
        "notes": "سداد VIP كامل لحجز دار التوحيد",
        "evidence": {
          "type": "bank_slip",
          "filename": "HSBC_VIP_Transfer_160K.pdf",
          "size": "1.6 MB",
          "date": "2026-11-03 16:10",
          "bank_ref": "HSBC-EGY-004918",
          "account": "040991823001"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد سداد كامل",
            "actor": "سارة منصور",
            "date": "2026-11-03 16:30",
            "details": "اعتماد ١٦٠,٠٠٠ ج.م وتصفية الحساب"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1054-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "حجز عمرة رجب VIP فنادق الوقف",
        "title_en": "VIP Rajab Booking Created",
        "desc_ar": "عمرة VIP بقيمة ١٦٠,٠٠٠ ج.م لشخصين",
        "desc_en": "VIP Umrah booked at 160,000 EGP for 2 travelers",
        "actor_ar": "حازم الشافعي (العميل)",
        "actor_en": "Hazem El-Shafei (Customer)",
        "date": "2026-11-03 15:45",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1054-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "سداد كامل المبلغ عبر HSBC",
        "title_en": "Full Payment via HSBC",
        "desc_ar": "تحويل معتمد بمبلغ ١٦٠,٠٠٠ ج.م",
        "desc_en": "160,000 EGP transfer verified",
        "actor_ar": "سارة منصور (حسابات ميقات)",
        "actor_en": "Sarah Mansour (Miqat Accounts)",
        "date": "2026-11-03 16:15",
        "link_tab": "payments"
      }
    ]
  },
  {
    "id": "BK-2026-1055",
    "customerId": "CUST-1011",
    "customer_name_ar": "منى إبراهيم الدسوقي",
    "customer_name_en": "Mona Ibrahim El-Desouky",
    "customer_phone": "01155443322",
    "customer_whatsapp": "01155443322",
    "customer_email": "mona.desouky@gmail.com",
    "customer_governorate_ar": "كفر الشيخ",
    "customer_governorate_en": "Kafr El-Sheikh",
    "company_id": "COMP-103",
    "company_ar": "شركة مناسك العالمية للسياحة",
    "company_en": "Manasek Global Travel",
    "company_phone": "0225197800",
    "company_email": "accounts@manasek-travel.com",
    "company_license": "ترخيص سياحي رقم ٥١٢ فئة (أ)",
    "company_license_en": "Tourism License #512 Category (A)",
    "company_booking_ref": "MN-2026-5590",
    "program_id": "PRG-103",
    "program_ar": "عمرة شوال الاقتصادية",
    "program_en": "Shawwal Economy Umrah",
    "program_type": "economy",
    "program_type_ar": "عمرة اقتصادية",
    "program_type_en": "Economy Umrah",
    "season_ar": "شوال ١٤٤٨ هـ (أبريل ٢٠٢٧)",
    "season_en": "Shawwal 1448 AH (Apr 2027)",
    "season_key": "shawwal_1448",
    "created_date": "2026-11-04",
    "travel_date": "2027-04-15",
    "travelers_count": 1,
    "total_price": 33000,
    "paid_amount": 0,
    "pending_amount": 10000,
    "remaining_balance": 33000,
    "booking_status": "new",
    "booking_status_ar": "طلب حجز جديد (بانتظار التحصيل)",
    "booking_status_en": "New Booking (Pending Collection)",
    "payment_status": "pending_clearance",
    "payment_status_ar": "بانتظار اعتماد العربون",
    "payment_status_en": "Pending Clearance",
    "has_pending_review": true,
    "travelers": [
      {
        "id": "TRV-1055-1",
        "name_ar": "منى إبراهيم الدسوقي",
        "name_en": "Mona Ibrahim El-Desouky",
        "gender": "female",
        "gender_ar": "أنثى",
        "gender_en": "Female",
        "nationality_ar": "مصرية",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي",
        "relationship_en": "Primary Booker",
        "completion_status": "incomplete_data",
        "completion_label_ar": "بيانات جواز السفر غير مكتملة",
        "completion_label_en": "Incomplete Passport Data"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1055-1",
        "author": "شركة مناسك العالمية",
        "date": "2026-11-04 11:00",
        "text_ar": "قامت العميلة بإجراء طلب الحجز عبر التطبيق وأرفقت إشعار سداد عربون بقيمة ١٠,٠٠٠ ج.م عبر فودافون كاش، بانتظار تأكيد الاستلام من الحسابات.",
        "text_en": "Customer submitted booking via app and attached 10,000 EGP Vodafone Cash deposit slip, pending finance confirmation."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1055-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-11-04 11:45",
        "text": "قيد المراجعة: لم يظهر إشعار فودافون كاش بعد في كشف محفظة الشركة الوسيطة، الحجز يعتبر معلقاً ولا يخفض الرصيد المتبقي (٣٣,٠٠٠ ج.م بالكامل) حتى الاعتماد الرسمي."
      }
    ],
    "status_history": [
      {
        "from_status": "none",
        "from_status_ar": "لا يوجد",
        "to_status": "new",
        "to_status_ar": "طلب حجز جديد",
        "date": "2026-11-04 10:30",
        "actor": "بوابة ميقات الإلكترونية"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9130",
        "date": "2026-11-04 10:45",
        "amount": 10000,
        "payment_method": "vodafone_cash",
        "payment_method_ar": "فودافون كاش",
        "payment_method_en": "Vodafone Cash",
        "transaction_type": "deposit",
        "transaction_type_ar": "عربون حجز أولي (قيد التدقيق)",
        "transaction_type_en": "Initial Deposit (Pending)",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "pending_review",
        "verification_status_ar": "قيد التدقيق والاعتماد المالي",
        "verification_status_en": "Pending Review & Approval",
        "balance_after": 33000,
        "received_by": "أحمد صبري — حسابات ميقات",
        "receipt_ref": "RCP-2026-4492",
        "notes": "بانتظار التحقق من وصول رسالة التأكيد عبر فودافون كاش",
        "evidence": {
          "type": "wallet_receipt",
          "filename": "VF_Pending_Deposit_10K.png",
          "size": "480 KB",
          "date": "2026-11-04 10:42",
          "bank_ref": "VF-WAL-009182",
          "account": "01019283419"
        },
        "discussion": [
          {
            "id": "DISC-9130-1",
            "author_name": "أحمد صبري",
            "author_role": "موظف حسابات ميقات",
            "date": "2026-11-04 11:30",
            "message": "الإشعار قيد المراجعة مع المشرف المالي للتحقق من رسالة فودافون كاش."
          }
        ],
        "audit_trail": [
          {
            "action": "تسجيل دفعة عربون معلقة",
            "actor": "بوابة ميقات",
            "date": "2026-11-04 10:45",
            "details": "تسجيل دفعة معلقة بقيمة ١٠,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1055-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل طلب حجز عمرة شوال جديد",
        "title_en": "New Shawwal Booking Registered",
        "desc_ar": "طلب حجز عمرة شوال بقيمة ٣٣,٠٠٠ ج.م",
        "desc_en": "Shawwal booking request submitted at 33,000 EGP",
        "actor_ar": "منى الدسوقي (العميل)",
        "actor_en": "Mona El-Desouky (Customer)",
        "date": "2026-11-04 10:30",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1055-2",
        "type": "payment_recorded",
        "type_label_ar": "تسجيل دفعة",
        "type_label_en": "Payment Recorded",
        "title_ar": "تسجيل دفعة عربون معلقة TX-2026-9130",
        "title_en": "Pending Deposit Recorded TX-2026-9130",
        "desc_ar": "سداد ١٠,٠٠٠ ج.م عبر فودافون كاش قيد التدقيق",
        "desc_en": "10,000 EGP paid via Vodafone Cash pending review",
        "actor_ar": "بوابة ميقات الإلكترونية",
        "actor_en": "Miqat Electronic Gateway",
        "date": "2026-11-04 10:45",
        "link_tab": "payments"
      }
    ]
  },
  {
    "id": "BK-2026-1056",
    "customerId": "CUST-1012",
    "customer_name_ar": "طارق نبيل الصاوي",
    "customer_name_en": "Tarek Nabil El-Sawy",
    "customer_phone": "01200998877",
    "customer_whatsapp": "01200998877",
    "customer_email": "tarek.sawy@outlook.com",
    "customer_governorate_ar": "السويس",
    "customer_governorate_en": "Suez",
    "company_id": "COMP-101",
    "company_ar": "شركة الهدى للسياحة والخدمات الدينية",
    "company_en": "Al-Huda Religious Travel & Tourism",
    "company_phone": "0233458900",
    "company_email": "operations@alhuda-travel.com",
    "company_license": "ترخيص سياحي رقم ٤١٨ فئة (أ)",
    "company_license_en": "Tourism License #418 Category (A)",
    "company_booking_ref": "HD-2026-9988",
    "program_id": "PRG-101",
    "program_ar": "عمرة اقتصادية موفرة (طيران)",
    "program_en": "Umrah Economy Saver (Flight)",
    "program_type": "economy",
    "program_type_ar": "عمرة اقتصادية",
    "program_type_en": "Economy Umrah",
    "season_ar": "رجب ١٤٤٨ هـ (يناير ٢٠٢٧)",
    "season_en": "Rajab 1448 AH (Jan 2027)",
    "season_key": "rajab_1448",
    "created_date": "2026-10-15",
    "travel_date": "2027-01-15",
    "travelers_count": 1,
    "total_price": 38000,
    "paid_amount": 38000,
    "pending_amount": 0,
    "remaining_balance": 0,
    "booking_status": "completed",
    "booking_status_ar": "رحلة منجزة ومسواة",
    "booking_status_en": "Completed & Reconciled",
    "payment_status": "paid_full",
    "payment_status_ar": "مسدد بالكامل",
    "payment_status_en": "Paid in Full",
    "travelers": [
      {
        "id": "TRV-1056-1",
        "name_ar": "طارق نبيل الصاوي",
        "name_en": "Tarek Nabil El-Sawy",
        "gender": "male",
        "gender_ar": "ذكر",
        "gender_en": "Male",
        "nationality_ar": "مصري",
        "nationality_en": "Egyptian",
        "relationship_ar": "الحاج الرئيسي",
        "relationship_en": "Primary Booker",
        "completion_status": "complete",
        "completion_label_ar": "مكتمل المستندات",
        "completion_label_en": "Complete"
      }
    ],
    "company_notes": [
      {
        "id": "CN-1056-1",
        "author": "شركة الهدى للسياحة",
        "date": "2026-10-15 15:30",
        "text_ar": "تم إنهاء كافة الإجراءات وسداد القيمة بالكامل وإصدار التأشيرة بنجاح.",
        "text_en": "All procedures completed, full payment received, and visa successfully issued."
      }
    ],
    "internal_notes": [
      {
        "id": "IN-1056-1",
        "author_name": "أحمد صبري",
        "author_role": "موظف حسابات مالية",
        "date": "2026-10-16 11:00",
        "text": "تمت التسوية المالية الدفترية للحساب وإقفال ملف الحجز كرحلة منجزة بالكامل."
      }
    ],
    "status_history": [
      {
        "from_status": "new",
        "from_status_ar": "طلب حجز جديد",
        "to_status": "completed",
        "to_status_ar": "رحلة منجزة ومسواة بالكامل",
        "date": "2026-10-15 16:00",
        "actor": "أحمد صبري (حسابات ميقات)"
      }
    ],
    "payments": [
      {
        "id": "TX-2026-9012",
        "date": "2026-10-15 15:00",
        "amount": 38000,
        "payment_method": "instapay",
        "payment_method_ar": "إنستاباي فوري",
        "payment_method_en": "InstaPay Instant",
        "transaction_type": "full_payment",
        "transaction_type_ar": "سداد كامل القيمة",
        "transaction_type_en": "Full Payment",
        "transaction_source": "miqat_platform",
        "transaction_source_ar": "منصة ميقات الإلكترونية",
        "transaction_source_en": "Miqat Platform Direct",
        "verification_status": "approved",
        "verification_status_ar": "معتمد ومطابق دفترياً",
        "verification_status_en": "Approved & Verified",
        "balance_after": 0,
        "received_by": "أحمد صبري — حسابات ميقات",
        "receipt_ref": "RCP-2026-4350",
        "notes": "سداد فوري معتمد بالكامل",
        "evidence": {
          "type": "instapay_slip",
          "filename": "InstaPay_38K_Sawy.png",
          "size": "520 KB",
          "date": "2026-10-15 14:55",
          "bank_ref": "IPN-20261015-11029",
          "account": "tarek.sawy@instapay"
        },
        "discussion": [],
        "audit_trail": [
          {
            "action": "اعتماد سداد كامل وإقفال",
            "actor": "أحمد صبري",
            "date": "2026-10-15 15:15",
            "details": "اعتماد ٣٨,٠٠٠ ج.م"
          }
        ]
      }
    ],
    "refunds": [],
    "activities": [
      {
        "id": "ACT-1056-1",
        "type": "booking_created",
        "type_label_ar": "إنشاء الحجز",
        "type_label_en": "Booking Created",
        "title_ar": "تسجيل حجز عمرة اقتصادية",
        "title_en": "Economy Umrah Registered",
        "desc_ar": "حجز عمرة اقتصادية بقيمة ٣٨,٠٠٠ ج.م",
        "desc_en": "Economy Umrah booked at 38,000 EGP",
        "actor_ar": "طارق الصاوي (العميل)",
        "actor_en": "Tarek El-Sawy (Customer)",
        "date": "2026-10-15 14:30",
        "link_tab": "overview"
      },
      {
        "id": "ACT-1056-2",
        "type": "payment_approved",
        "type_label_ar": "اعتماد تحصيل",
        "type_label_en": "Payment Approved",
        "title_ar": "اعتماد سداد كامل TX-2026-9012",
        "title_en": "Full Payment Approved",
        "desc_ar": "سداد ٣٨,٠٠٠ ج.م عبر إنستاباي",
        "desc_en": "38,000 EGP paid via InstaPay",
        "actor_ar": "أحمد صبري (حسابات ميقات)",
        "actor_en": "Ahmed Sabry (Miqat Accounts)",
        "date": "2026-10-15 15:15",
        "link_tab": "payments"
      }
    ]
  }
];



  // =========================================================================
  // PROGRAM & ITINERARY MODIFICATION REQUESTS DATASET (PHASE 1-5 ARCHITECTURE)
  // =========================================================================

  const TOURISM_COMPANIES_REGISTRY = [
    {
      id: 'COMP-101',
      name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      name_en: 'Al-Huda Religious Travel & Tourism',
      license: 'ترخيص سياحي رقم ٤١٨ فئة (أ)',
      license_en: 'Tourism License #418 Category A',
      phone: '0233458900',
      email: 'operations@alhuda-travel.com',
      contact_person_ar: 'أشرف القاضي',
      contact_person_en: 'Ashraf El-Kady',
      contact_phone: '01198765432',
      contact_whatsapp: '01198765432',
      user_ref: 'EMP-HD-04'
    },
    {
      id: 'COMP-102',
      name_ar: 'مؤسسة الفيروز لرحلات الحج والعمرة',
      name_en: 'Al-Fairouz Hajj & Umrah Agency',
      license: 'ترخيص سياحي رقم ٥١٢ فئة (أ)',
      license_en: 'Tourism License #512 Category A',
      phone: '0223984511',
      email: 'contact@alfairouz-travel.com',
      contact_person_ar: 'ممدوح الشامي',
      contact_person_en: 'Mamdouh El-Shamy',
      contact_phone: '01223456789',
      contact_whatsapp: '01223456789',
      user_ref: 'EMP-FZ-02'
    },
    {
      id: 'COMP-103',
      name_ar: 'شركة مناسك العالمية للسياحة',
      name_en: 'Manasek Global Travel',
      license: 'ترخيص سياحي رقم ٦٣٠ فئة (أ)',
      license_en: 'Tourism License #630 Category A',
      phone: '0237612099',
      email: 'support@manasek-travel.com',
      contact_person_ar: 'حسام البدري',
      contact_person_en: 'Hossam El-Badry',
      contact_phone: '01099887766',
      contact_whatsapp: '01099887766',
      user_ref: 'EMP-MN-01'
    },
    {
      id: 'COMP-104',
      name_ar: 'شركة الصفا للنقل والخدمات السياحية',
      name_en: 'Al-Safa Travel & Tourism',
      license: 'ترخيص سياحي رقم ٣٢٩ فئة (أ)',
      license_en: 'Tourism License #329 Category A',
      phone: '0233045512',
      email: 'info@alsafa-tours.com',
      contact_person_ar: 'خالد عبد الوهاب',
      contact_person_en: 'Khaled Abdel Wahab',
      contact_phone: '01144556677',
      contact_whatsapp: '01144556677',
      user_ref: 'EMP-SF-03'
    },
    {
      id: 'COMP-105',
      name_ar: 'شركة البركة لخدمات المعتمرين',
      name_en: 'Al-Baraka Umrah Services',
      license: 'ترخيص سياحي رقم ٨١٠ فئة (أ)',
      license_en: 'Tourism License #810 Category A',
      phone: '0227943310',
      email: 'operations@albaraka-umrah.com',
      contact_person_ar: 'نبيل غانم',
      contact_person_en: 'Nabil Ghanem',
      contact_phone: '01011223344',
      contact_whatsapp: '01011223344',
      user_ref: 'EMP-BK-05'
    },
    {
      id: 'COMP-106',
      name_ar: 'شركة دار السلام للسياحة والحج والعمرة',
      name_en: 'Dar Al-Salam Hajj & Umrah',
      license: 'ترخيص سياحي رقم ١٩٤ فئة (أ)',
      license_en: 'Tourism License #194 Category A',
      phone: '0233887140',
      email: 'contact@daralsalam-travel.com',
      contact_person_ar: 'طارق منصور',
      contact_person_en: 'Tarek Mansour',
      contact_phone: '01277889900',
      contact_whatsapp: '01277889900',
      user_ref: 'EMP-DS-01'
    },
    {
      id: 'COMP-107',
      name_ar: 'شركة التقوى للسياحة والرحلات الدينية',
      name_en: 'Al-Taqwa Travel & Tourism',
      license: 'ترخيص سياحي رقم ٤٥٠ فئة (أ)',
      license_en: 'Tourism License #450 Category A',
      phone: '0224198755',
      email: 'support@altaqwa-travel.com',
      contact_person_ar: 'ياسر رضوان',
      contact_person_en: 'Yasser Radwan',
      contact_phone: '01066778899',
      contact_whatsapp: '01066778899',
      user_ref: 'EMP-TQ-02'
    },
    {
      id: 'COMP-108',
      name_ar: 'شركة نور الإيمان لخدمات الحرمين',
      name_en: 'Noor Al-Eman Haramain Services',
      license: 'ترخيص سياحي رقم ٧٧٢ فئة (أ)',
      license_en: 'Tourism License #772 Category A',
      phone: '0237498210',
      email: 'operations@nooraleman.com',
      contact_person_ar: 'علاء عبد الباقي',
      contact_person_en: 'Alaa Abdel Baqi',
      contact_phone: '01122334455',
      contact_whatsapp: '01122334455',
      user_ref: 'EMP-NE-01'
    }
  ];

  let PROGRAM_MODIFICATION_REQUESTS = [
    // --- Al-Huda (COMP-101) Requests ---
    {
      id: 'MOD-2026-101',
      company_id: 'COMP-101',
      company_name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      company_name_en: 'Al-Huda Religious Travel & Tourism',
      company_employee: {
        name_ar: 'أشرف القاضي',
        name_en: 'Ashraf El-Kady',
        phone: '01198765432',
        whatsapp: '01198765432',
        ref: 'EMP-HD-04'
      },
      booking_id: 'BK-2026-1045',
      customer_id: 'CUST-1001',
      customer_name_ar: 'أحمد محمود الشريف',
      customer_name_en: 'Ahmed Mahmoud El-Sherif',
      customer_phone: '01012345671',
      customer_whatsapp: '01012345671',
      created_at: '2026-11-06 10:15',
      timestamp_iso: '2026-11-06T10:15:00',
      request_status: 'in_progress', // 'new' | 'in_progress' | 'completed' (NO rejected!)
      payment_status: 'partially_paid',
      
      // Original Program Details
      original_program: {
        name_ar: 'عمرة اقتصادية موفرة (طيران)',
        name_en: 'Umrah Economy Saver (Flight)',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-18',
        return_date: '2027-01-28',
        total_price: 76000,
        hotel_ar: 'فندق أنوار الضيافة (مكة) — فندق روابي المدينة (المدينة)',
        hotel_en: 'Anwar Al-Diyafa (Makkah) — Rawabi Al-Madinah (Madinah)',
        travelers_count: 2,
        airline_ar: 'الخطوط الجوية السعودية (القاهرة - جدة)',
        airline_en: 'Saudia Airlines (Cairo - Jeddah)'
      },

      // New Program Details (Supplied by Tourism Company)
      new_program: {
        name_ar: 'عمرة فاخرة ٥ نجوم أبراج مكة (طيران مباشر)',
        name_en: 'Deluxe 5-Star Umrah Makkah Towers (Direct Flight)',
        type_ar: 'طيران مباشر ٥ نجوم',
        type_en: '5-Star Direct Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-20',
        return_date: '2027-01-31',
        total_price: 120000, // Exact test case requirement: 120,000 EGP
        hotel_ar: 'فندق فيرمونت مكة أبراج البيت (مكة) — أوبروي المدينة (المدينة)',
        hotel_en: 'Fairmont Makkah Clock Royal Tower — Oberoi Madinah',
        travelers_count: 2,
        airline_ar: 'مصر للطيران - درجة رجال الأعمال (القاهرة - المدينة)',
        airline_en: 'EgyptAir - Business Class (Cairo - Madinah)',
        modification_reason_ar: 'طلب العميل ترقية فندق الإقامة إلى أبراج وقف الحرم المباشرة لظروف صحية للمرافق، مع مد الإقامة ٣ ليالٍ إضافية.',
        modification_reason_en: 'Customer requested accommodation upgrade to direct Haram towers due to companion mobility needs, plus 3 additional nights.'
      },

      // Strict Financial Architecture:
      // Total Approved Paid Amount = Original Deposit + All Approved Additional Payments
      // Remaining Amount = New Program Total Price - Total Approved Paid Amount
      // Test Case Values: New: 120,000 | Deposit: 20,000 | Approved Add: 30,000 | Pending Add: 10,000
      // Expected Approved Paid: 50,000 | Remaining: 70,000 | Pending: 10,000 | Progress: 41.67%
      original_deposit: 20000,
      additional_payments: [
        {
          id: 'PAY-MOD-881',
          date: '2026-11-06 11:30',
          amount: 30000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي (البنك الأهلي)',
          payment_method_en: 'Bank Transfer (NBE)',
          receipt_ref: 'RCP-BNK-9901',
          recorded_by_ar: 'أشرف القاضي (موظف شركة الهدى)',
          recorded_by_en: 'Ashraf El-Kady (Al-Huda Staff)',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-06 12:15',
          internal_note_ar: 'تمت مطابقة قسيمة التحويل البنكي مع كشف حساب ميقات واعتماد المبلغ بنجاح.',
          internal_note_en: 'Bank voucher matched with Miqat central account statement and approved.',
          evidence: {
            filename: 'NBE_Slip_MOD_881.pdf',
            size: '1.4 MB'
          }
        },
        {
          id: 'PAY-MOD-882',
          date: '2026-11-06 13:45',
          amount: 10000,
          payment_method: 'cash',
          payment_method_ar: 'إيداع نقدي بإيصال رسمي',
          payment_method_en: 'Cash Official Deposit',
          receipt_ref: 'RCP-CSH-4412',
          recorded_by_ar: 'أشرف القاضي (موظف شركة الهدى)',
          recorded_by_en: 'Ashraf El-Kady (Al-Huda Staff)',
          review_status: 'pending_review',
          reviewed_by_ar: null,
          reviewed_by_en: null,
          reviewed_at: null,
          internal_note_ar: 'بانتظار ورود حافظة الإيداع النقدي للخزينة لمراجعة الإيصال ومطابقته.',
          internal_note_en: 'Pending treasury cash deposit ledger verification.',
          evidence: {
            filename: 'Cash_Receipt_4412.pdf',
            size: '980 KB'
          }
        }
      ],

      // Private Internal Notes (Miqat internal only, never visible to company or customer)
      internal_notes: [
        {
          id: 'NOTE-101-1',
          author_ar: 'أحمد صبري',
          author_en: 'Ahmed Sabry',
          date: '2026-11-06 10:30',
          text_ar: 'تم استلام طلب التعديل من شركة الهدى ومراجعة رصيد الدفعة الأصلية المحصلة على حجز BK-2026-1045 بقيمة ٢٠,٠٠٠ ج.م.',
          text_en: 'Received modification request from Al-Huda and verified original credited deposit of 20,000 EGP on booking BK-2026-1045.'
        }
      ],

      // Request Conversation (Between Miqat Accounts Employee & Tourism Company Employee)
      conversation: {
        is_closed: false,
        closed_at: null,
        messages: [
          {
            id: 'MSG-101-1',
            sender_type: 'company',
            sender_name_ar: 'أشرف القاضي',
            sender_name_en: 'Ashraf El-Kady',
            sender_role_ar: 'مسؤول العمليات — شركة الهدى',
            sender_role_en: 'Operations Officer — Al-Huda',
            date: '2026-11-06 10:18',
            content_ar: 'السلام عليكم أستاذ أحمد، قمنا بتسجيل طلب ترقية حجز العميل أحمد الشريف لفندق فيرمونت وأضفنا دفعة سداد أولى ٣٠ ألف عبر البنك الأهلي.',
            content_en: 'Hello Mr. Ahmed, we registered the upgrade request for customer Ahmed El-Sherif to Fairmont and added a 30,000 EGP deposit via NBE.'
          },
          {
            id: 'MSG-101-2',
            sender_type: 'accounts',
            sender_name_ar: 'أحمد صبري',
            sender_name_en: 'Ahmed Sabry',
            sender_role_ar: 'موظف حسابات مالية — ميقات',
            sender_role_en: 'Financial Accounts Officer — Miqat',
            date: '2026-11-06 12:16',
            content_ar: 'أهلاً بك أستاذ أشرف. تم تدقيق التحويل البنكي واعتماد مبلغ ٣٠,٠٠٠ ج.م ليصبح الرصيد المعتمد ٥٠,٠٠٠ ج.م، ونحن بانتظار توريد الدفعة النقدية الثانية.',
            content_en: 'Welcome Mr. Ashraf. The bank transfer has been verified and 30,000 EGP approved, bringing approved total to 50,000 EGP. Awaiting cash slip review.'
          }
        ]
      },

      // Status Transition History
      status_history: [
        {
          from_status: 'new',
          to_status: 'in_progress',
          date: '2026-11-06 10:25',
          employee_ar: 'أحمد صبري',
          employee_en: 'Ahmed Sabry',
          note_ar: 'بدء دراسة التعديل وتدقيق السجلات المالية',
          note_en: 'Started review and financial audit of modification'
        }
      ],

      // Immutable Activity Log
      activity_log: [
        {
          id: 'ACT-MOD-1',
          date: '2026-11-06 10:15',
          title_ar: 'تسجيل طلب تعديل البرنامج',
          title_en: 'Modification Request Submitted',
          desc_ar: 'تم تسجيل طلب التعديل رقم MOD-2026-101 بواسطة أشرف القاضي (شركة الهدى)',
          desc_en: 'Modification request MOD-2026-101 created by Ashraf El-Kady (Al-Huda)',
          actor_ar: 'أشرف القاضي',
          actor_en: 'Ashraf El-Kady',
          type: 'creation'
        },
        {
          id: 'ACT-MOD-2',
          date: '2026-11-06 10:25',
          title_ar: 'بدء متابعة الطلب',
          title_en: 'Follow-up Started',
          desc_ar: 'تغيير حالة الطلب من طلب جديد إلى قيد المتابعة وإيقاف مؤقت الاستجابة',
          desc_en: 'Request status updated to In Progress; SLA response timer stopped',
          actor_ar: 'أحمد صبري',
          actor_en: 'Ahmed Sabry',
          type: 'status'
        },
        {
          id: 'ACT-MOD-3',
          date: '2026-11-06 12:15',
          title_ar: 'اعتماد سداد إضافي',
          title_en: 'Additional Payment Approved',
          desc_ar: 'تم تدقيق واعتماد دفعة بنكية بقيمة ٣٠,٠٠٠ ج.م (إيصال RCP-BNK-9901)',
          desc_en: 'Verified and approved bank payment of 30,000 EGP (Receipt RCP-BNK-9901)',
          actor_ar: 'أحمد صبري',
          actor_en: 'Ahmed Sabry',
          type: 'payment'
        }
      ],

      // SLA & Response Monitoring
      sla: {
        arrival_time: '2026-11-06 10:15:00',
        window_hours: 2,
        is_overdue: false,
        response_started_at: '2026-11-06 10:25:00'
      }
    },

    {
      id: 'MOD-2026-102',
      company_id: 'COMP-101',
      company_name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      company_name_en: 'Al-Huda Religious Travel & Tourism',
      company_employee: {
        name_ar: 'أشرف القاضي',
        name_en: 'Ashraf El-Kady',
        phone: '01198765432',
        whatsapp: '01198765432',
        ref: 'EMP-HD-04'
      },
      booking_id: 'BK-2026-1049',
      customer_id: 'CUST-1005',
      customer_name_ar: 'محمد إبراهيم منصور',
      customer_name_en: 'Mohamed Ibrahim Mansour',
      customer_phone: '01234567895',
      customer_whatsapp: '01234567895',
      created_at: '2026-11-05 14:00',
      timestamp_iso: '2026-11-05T14:00:00',
      request_status: 'completed',
      payment_status: 'paid_full',
      original_program: {
        name_ar: 'عمرة أول شعبان الاقتصادية (طيران)',
        name_en: 'Shaaban Early Economy Umrah (Flight)',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-01-25',
        return_date: '2027-02-05',
        total_price: 68000,
        hotel_ar: 'فندق منازل العين (مكة) — طابة السلام (المدينة)',
        hotel_en: 'Manazel Al-Ain (Makkah) — Taba Al-Salam (Madinah)',
        travelers_count: 2
      },
      new_program: {
        name_ar: 'عمرة العشر الأواخر من رمضان تهجد (طيران مباشر)',
        name_en: 'Ramadan Last 10-Days Tahajjud Umrah (Direct Flight)',
        type_ar: 'طيران مباشر موسمي',
        type_en: 'Seasonal Direct Flight',
        season_ar: 'رمضان ١٤٤٨ هـ',
        season_en: 'Ramadan 1448 AH',
        travel_date: '2027-03-22',
        return_date: '2027-04-02',
        total_price: 98000,
        hotel_ar: 'فندق الشهداء (مكة) — دلة طيبة (المدينة)',
        hotel_en: 'Al-Shohada Hotel (Makkah) — Dallah Taibah (Madinah)',
        travelers_count: 2,
        modification_reason_ar: 'رغبة العميل في أداء مناسك العمرة وصلاة التهجد في العشر الأواخر من رمضان بدلاً من رحلة شعبان.',
        modification_reason_en: 'Customer wished to perform Umrah and Tahajjud during Ramadan last 10 days instead of Shaaban.'
      },
      original_deposit: 25000,
      additional_payments: [
        {
          id: 'PAY-MOD-883',
          date: '2026-11-05 14:20',
          amount: 45000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي فوري',
          payment_method_en: 'Instant Bank Transfer',
          receipt_ref: 'RCP-BNK-9915',
          recorded_by_ar: 'أشرف القاضي',
          recorded_by_en: 'Ashraf El-Kady',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-05 15:00',
          evidence: { filename: 'Bank_Receipt_9915.pdf', size: '1.1 MB' }
        },
        {
          id: 'PAY-MOD-884',
          date: '2026-11-05 16:10',
          amount: 28000,
          payment_method: 'instapay',
          payment_method_ar: 'إنستاباي فوري',
          payment_method_en: 'InstaPay Instant',
          receipt_ref: 'RCP-INS-4420',
          recorded_by_ar: 'أشرف القاضي',
          recorded_by_en: 'Ashraf El-Kady',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-05 16:30',
          evidence: { filename: 'Instapay_4420.png', size: '840 KB' }
        }
      ],
      internal_notes: [
        {
          id: 'NOTE-102-1',
          author_ar: 'أحمد صبري',
          author_en: 'Ahmed Sabry',
          date: '2026-11-05 16:40',
          text_ar: 'تم اعتماد وتصفية الحساب بالكامل بقيمة ٩٨,٠٠٠ ج.م واستيفاء تأكيد شركة الهدى، وتم إغلاق الطلب وتحديث الحجز.',
          text_en: 'Fully reconciled and settled for 98,000 EGP with Al-Huda confirmation; request completed and booking updated.'
        }
      ],
      conversation: {
        is_closed: true,
        closed_at: '2026-11-05 17:00',
        messages: [
          {
            id: 'MSG-102-1',
            sender_type: 'company',
            sender_name_ar: 'أشرف القاضي',
            sender_name_en: 'Ashraf El-Kady',
            sender_role_ar: 'مسؤول العمليات — شركة الهدى',
            sender_role_en: 'Operations Officer — Al-Huda',
            date: '2026-11-05 14:10',
            content_ar: 'تم استلام وتأكيد موافقة العميل على فارق السعر لرحلة العشر الأواخر، وتم سداد كامل المبلغ.',
            content_en: 'Customer confirmation and full payment difference for Ramadan 10-days confirmed.'
          },
          {
            id: 'MSG-102-2',
            sender_type: 'accounts',
            sender_name_ar: 'أحمد صبري',
            sender_name_en: 'Ahmed Sabry',
            sender_role_ar: 'موظف حسابات مالية — ميقات',
            sender_role_en: 'Financial Accounts Officer — Miqat',
            date: '2026-11-05 16:55',
            content_ar: 'تم التحقق من اكتمال السداد وتحديث البرنامج في الحجز المركزي رسمياً، وإغلاق الطلب كمكتمل.',
            content_en: 'Full payment verified and program updated in central booking officially. Request completed.'
          }
        ]
      },
      status_history: [
        {
          from_status: 'new',
          to_status: 'in_progress',
          date: '2026-11-05 14:15',
          employee_ar: 'أحمد صبري',
          employee_en: 'Ahmed Sabry',
          note_ar: 'بدء تدقيق إيصالات سداد رمضان',
          note_en: 'Started audit of Ramadan receipts'
        },
        {
          from_status: 'in_progress',
          to_status: 'completed',
          date: '2026-11-05 17:00',
          employee_ar: 'أحمد صبري',
          employee_en: 'Ahmed Sabry',
          note_ar: 'اكتمال التعديل وسداد كامل الرصيد',
          note_en: 'Modification completed and balance fully settled'
        }
      ],
      activity_log: [
        {
          id: 'ACT-MOD-10',
          date: '2026-11-05 14:00',
          title_ar: 'تسجيل طلب تعديل الحجز',
          title_en: 'Modification Request Submitted',
          desc_ar: 'تسجيل طلب الترقية للعشر الأواخر من رمضان',
          desc_en: 'Ramadan last 10 days upgrade request created',
          actor_ar: 'أشرف القاضي',
          actor_en: 'Ashraf El-Kady',
          type: 'creation'
        },
        {
          id: 'ACT-MOD-11',
          date: '2026-11-05 17:00',
          title_ar: 'اكتمال تنفيذ طلب التعديل',
          title_en: 'Modification Request Completed',
          desc_ar: 'تم اعتماد التعديل رسمياً وإغلاق المحادثة الخاصة بالطلب',
          desc_en: 'Request officially completed and conversation closed',
          actor_ar: 'أحمد صبري',
          actor_en: 'Ahmed Sabry',
          type: 'status'
        }
      ],
      sla: {
        arrival_time: '2026-11-05 14:00:00',
        window_hours: 2,
        is_overdue: false,
        response_started_at: '2026-11-05 14:15:00'
      }
    },

    {
      id: 'MOD-2026-103',
      company_id: 'COMP-101',
      company_name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      company_name_en: 'Al-Huda Religious Travel & Tourism',
      company_employee: {
        name_ar: 'أشرف القاضي',
        name_en: 'Ashraf El-Kady',
        phone: '01198765432',
        whatsapp: '01198765432',
        ref: 'EMP-HD-04'
      },
      booking_id: 'BK-2026-1052',
      customer_id: 'CUST-1008',
      customer_name_ar: 'محمود طه رضوان',
      customer_name_en: 'Mahmoud Taha Radwan',
      customer_phone: '01234567898',
      customer_whatsapp: '01234567898',
      created_at: '2026-11-06 08:30', // > 2 hours ago -> OVERDUE in 'new' status!
      timestamp_iso: '2026-11-06T08:30:00',
      request_status: 'new', // Overdue test case!
      payment_status: 'partially_paid',
      original_program: {
        name_ar: 'عمرة برية اقتصادية (حافلات)',
        name_en: 'Budget Land Umrah (Buses)',
        type_ar: 'بري اقتصادي',
        type_en: 'Budget Land',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-20',
        return_date: '2027-01-30',
        total_price: 42000,
        hotel_ar: 'فندق دار الهجرة (مكة)',
        hotel_en: 'Dar Al-Hijra (Makkah)',
        travelers_count: 2
      },
      new_program: {
        name_ar: 'عمرة سريعة طيران اقتصادي',
        name_en: 'Express Economy Flight Umrah',
        type_ar: 'طيران سريع',
        type_en: 'Express Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-22',
        return_date: '2027-01-29',
        total_price: 62000,
        hotel_ar: 'فندق صفوة مكة (مكة) — أجياد (المدينة)',
        hotel_en: 'Safwat Makkah — Ajyad (Madinah)',
        travelers_count: 2,
        modification_reason_ar: 'تعديل وسيلة السفر من الحافلة البرية إلى الطيران توفيراً للوقت لظروف عمل العميل.',
        modification_reason_en: 'Changed transport from land coach to flight to accommodate customer work schedule.'
      },
      original_deposit: 15000,
      additional_payments: [
        {
          id: 'PAY-MOD-885',
          date: '2026-11-06 09:10',
          amount: 10000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي (الأهلي)',
          payment_method_en: 'Bank Transfer (NBE)',
          receipt_ref: 'RCP-BNK-9922',
          recorded_by_ar: 'أشرف القاضي',
          recorded_by_en: 'Ashraf El-Kady',
          review_status: 'pending_review',
          evidence: { filename: 'Receipt_9922.pdf', size: '1.2 MB' }
        }
      ],
      internal_notes: [],
      conversation: {
        is_closed: false,
        closed_at: null,
        messages: [
          {
            id: 'MSG-103-1',
            sender_type: 'company',
            sender_name_ar: 'أشرف القاضي',
            sender_name_en: 'Ashraf El-Kady',
            sender_role_ar: 'مسؤول العمليات — شركة الهدى',
            sender_role_en: 'Operations Officer — Al-Huda',
            date: '2026-11-06 08:32',
            content_ar: 'يرجى متابعة الطلب للأهمية؛ العميل يرغب في حجز تذاكر الطيران قبل ارتفاع الأسعار.',
            content_en: 'Please follow up urgently; customer wants to issue flight tickets before price rise.'
          }
        ]
      },
      status_history: [],
      activity_log: [
        {
          id: 'ACT-MOD-20',
          date: '2026-11-06 08:30',
          title_ar: 'وصول طلب تعديل جديد',
          title_en: 'New Modification Request Received',
          desc_ar: 'تم إرسال طلب التعديل رقم MOD-2026-103 عبر بوابة الشريك وبدء احتساب مؤقت الاستجابة',
          desc_en: 'Request MOD-2026-103 arrived via partner portal; response timer started',
          actor_ar: 'أشرف القاضي',
          actor_en: 'Ashraf El-Kady',
          type: 'creation'
        }
      ],
      sla: {
        arrival_time: '2026-11-06 08:30:00',
        window_hours: 2,
        is_overdue: true, // OVERDUE indicator!
        response_started_at: null
      }
    },

    {
      id: 'MOD-2026-104',
      company_id: 'COMP-101',
      company_name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      company_name_en: 'Al-Huda Religious Travel & Tourism',
      company_employee: {
        name_ar: 'أشرف القاضي',
        name_en: 'Ashraf El-Kady',
        phone: '01198765432',
        whatsapp: '01198765432',
        ref: 'EMP-HD-04'
      },
      booking_id: 'BK-2026-1055',
      customer_id: 'CUST-1011',
      customer_name_ar: 'عمر خالد الصاوي',
      customer_name_en: 'Omar Khaled El-Sawy',
      customer_phone: '01122334411',
      customer_whatsapp: '01122334411',
      created_at: '2026-11-06 13:40',
      timestamp_iso: '2026-11-06T13:40:00',
      request_status: 'new', // Fresh within SLA
      payment_status: 'unpaid',
      original_program: {
        name_ar: 'عمرة اقتصادية موفرة (طيران)',
        name_en: 'Umrah Economy Saver (Flight)',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-02-05',
        return_date: '2027-02-15',
        total_price: 54000,
        hotel_ar: 'فندق منازل العين (مكة)',
        hotel_en: 'Manazel Al-Ain (Makkah)',
        travelers_count: 1
      },
      new_program: {
        name_ar: 'عمرة ٤ نجوم مميزة (طيران مباشر)',
        name_en: '4-Star Distinctive Umrah (Direct Flight)',
        type_ar: 'طيران ٤ نجوم',
        type_en: '4-Star Flight',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-02-05',
        return_date: '2027-02-15',
        total_price: 84000,
        hotel_ar: 'فندق سويس أوتيل المقام (مكة)',
        hotel_en: 'Swissotel Al Maqam (Makkah)',
        travelers_count: 1,
        modification_reason_ar: 'طلب العميل ترقية مستوى الإقامة إلى غرفة مفردة مطلة في فندق سويس أوتيل المقام.',
        modification_reason_en: 'Customer requested single room upgrade with Haram view in Swissotel Al Maqam.'
      },
      original_deposit: 20000,
      additional_payments: [],
      internal_notes: [],
      conversation: {
        is_closed: false,
        closed_at: null,
        messages: [
          {
            id: 'MSG-104-1',
            sender_type: 'company',
            sender_name_ar: 'أشرف القاضي',
            sender_name_en: 'Ashraf El-Kady',
            sender_role_ar: 'مسؤول العمليات — شركة الهدى',
            sender_role_en: 'Operations Officer — Al-Huda',
            date: '2026-11-06 13:42',
            content_ar: 'تم إدخال الطلب وتأكيد توفر الغرفة المفردة، بانتظار سداد الفارق.',
            content_en: 'Request submitted and single room availability confirmed; awaiting difference payment.'
          }
        ]
      },
      status_history: [],
      activity_log: [
        {
          id: 'ACT-MOD-30',
          date: '2026-11-06 13:40',
          title_ar: 'استلام طلب تعديل جديد',
          title_en: 'New Modification Request Received',
          desc_ar: 'تسجيل طلب الترقية لغرفة مفردة في سويس أوتيل',
          desc_en: 'Single room upgrade request in Swissotel received',
          actor_ar: 'أشرف القاضي',
          actor_en: 'Ashraf El-Kady',
          type: 'creation'
        }
      ],
      sla: {
        arrival_time: '2026-11-06 13:40:00',
        window_hours: 2,
        is_overdue: false,
        response_started_at: null
      }
    },

    // --- Al-Fairouz (COMP-102) Requests ---
    {
      id: 'MOD-2026-105',
      company_id: 'COMP-102',
      company_name_ar: 'مؤسسة الفيروز لرحلات الحج والعمرة',
      company_name_en: 'Al-Fairouz Hajj & Umrah Agency',
      company_employee: {
        name_ar: 'ممدوح الشامي',
        name_en: 'Mamdouh El-Shamy',
        phone: '01223456789',
        whatsapp: '01223456789',
        ref: 'EMP-FZ-02'
      },
      booking_id: 'BK-2026-1046',
      customer_id: 'CUST-1002',
      customer_name_ar: 'منى عبد الرحمن السيد',
      customer_name_en: 'Mona Abdel-Rahman El-Sayed',
      customer_phone: '01234567892',
      customer_whatsapp: '01234567892',
      created_at: '2026-11-06 09:00',
      timestamp_iso: '2026-11-06T09:00:00',
      request_status: 'in_progress',
      payment_status: 'paid_full',
      original_program: {
        name_ar: 'عمرة ٥ نجوم فاخرة (طيران)',
        name_en: '5-Star Deluxe Umrah (Flight)',
        type_ar: 'طيران فاخر',
        type_en: 'Deluxe Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-15',
        return_date: '2027-01-25',
        total_price: 124000,
        hotel_ar: 'فندق دار التوحيد (مكة) — هيلتون المدينة (المدينة)',
        hotel_en: 'Dar Al-Tawhid (Makkah) — Hilton Madinah',
        travelers_count: 2
      },
      new_program: {
        name_ar: 'عمرة كبار الشخصيات VIP (طيران مباشر)',
        name_en: 'VIP Royal Umrah (Direct Flight)',
        type_ar: 'طيران VIP خاص',
        type_en: 'VIP Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-15',
        return_date: '2027-01-26',
        total_price: 154000,
        hotel_ar: 'فندق قصر رافلز مكة (مكة) — أوبروي (المدينة)',
        hotel_en: 'Raffles Makkah Palace — Oberoi Madinah',
        travelers_count: 2,
        modification_reason_ar: 'ترقية باقة الإقامة لجناح ملكي مطل مباشرة على الكعبة المشرفة في فندق رافلز مكة.',
        modification_reason_en: 'Upgrade to Royal Kaaba-view suite in Raffles Makkah Palace.'
      },
      original_deposit: 124000,
      additional_payments: [
        {
          id: 'PAY-MOD-886',
          date: '2026-11-06 09:30',
          amount: 30000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي بنك مصر',
          payment_method_en: 'Bank Transfer (BM)',
          receipt_ref: 'RCP-BNK-9930',
          recorded_by_ar: 'ممدوح الشامي',
          recorded_by_en: 'Mamdouh El-Shamy',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-06 10:00',
          evidence: { filename: 'BM_Transfer_9930.pdf', size: '1.5 MB' }
        }
      ],
      internal_notes: [],
      conversation: {
        is_closed: false,
        closed_at: null,
        messages: [
          {
            id: 'MSG-105-1',
            sender_type: 'company',
            sender_name_ar: 'ممدوح الشامي',
            sender_name_en: 'Mamdouh El-Shamy',
            sender_role_ar: 'مدير الحجوزات — مؤسسة الفيروز',
            sender_role_en: 'Booking Manager — Al-Fairouz',
            date: '2026-11-06 09:05',
            content_ar: 'تم تأكيد جناح رافلز للعميلة منى، وتم تحويل فارق السعر كاملاً.',
            content_en: 'Raffles suite confirmed for client Mona; full difference amount transferred.'
          }
        ]
      },
      status_history: [
        {
          from_status: 'new',
          to_status: 'in_progress',
          date: '2026-11-06 09:20',
          employee_ar: 'أحمد صبري',
          employee_en: 'Ahmed Sabry',
          note_ar: 'مراجعة تحويل الفيروز',
          note_en: 'Audit of Al-Fairouz transfer'
        }
      ],
      activity_log: [],
      sla: {
        arrival_time: '2026-11-06 09:00:00',
        window_hours: 2,
        is_overdue: false,
        response_started_at: '2026-11-06 09:20:00'
      }
    },

    {
      id: 'MOD-2026-106',
      company_id: 'COMP-102',
      company_name_ar: 'مؤسسة الفيروز لرحلات الحج والعمرة',
      company_name_en: 'Al-Fairouz Hajj & Umrah Agency',
      company_employee: {
        name_ar: 'ممدوح الشامي',
        name_en: 'Mamdouh El-Shamy',
        phone: '01223456789',
        whatsapp: '01223456789',
        ref: 'EMP-FZ-02'
      },
      booking_id: 'BK-2026-1050',
      customer_id: 'CUST-1006',
      customer_name_ar: 'سلمى يوسف النجار',
      customer_name_en: 'Salma Youssef El-Naggar',
      customer_phone: '01234567896',
      customer_whatsapp: '01234567896',
      created_at: '2026-11-04 11:00',
      timestamp_iso: '2026-11-04T11:00:00',
      request_status: 'completed',
      payment_status: 'paid_full',
      original_program: {
        name_ar: 'عمرة رجب الاقتصادية (طيران)',
        name_en: 'Rajab Economy Umrah (Flight)',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-20',
        return_date: '2027-01-30',
        total_price: 52000,
        hotel_ar: 'فندق أبراج الكسوة (مكة)',
        hotel_en: 'Kiswah Towers (Makkah)',
        travelers_count: 2
      },
      new_program: {
        name_ar: 'عمرة رجب ٤ نجوم مميزة',
        name_en: 'Rajab 4-Star Umrah',
        type_ar: 'طيران ٤ نجوم',
        type_en: '4-Star Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-20',
        return_date: '2027-01-30',
        total_price: 72000,
        hotel_ar: 'فندق موفنبيك برج هاجر (مكة)',
        hotel_en: 'Movenpick Hajar Tower (Makkah)',
        travelers_count: 2,
        modification_reason_ar: 'ترقية فندق مكة إلى موفنبيك برج هاجر.',
        modification_reason_en: 'Hotel upgrade to Movenpick Hajar Tower.'
      },
      original_deposit: 52000,
      additional_payments: [
        {
          id: 'PAY-MOD-887',
          date: '2026-11-04 11:30',
          amount: 20000,
          payment_method: 'card',
          payment_method_ar: 'بطاقة ائتمانية بنكية',
          payment_method_en: 'Credit Card',
          receipt_ref: 'RCP-CRD-8821',
          recorded_by_ar: 'ممدوح الشامي',
          recorded_by_en: 'Mamdouh El-Shamy',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-04 12:00',
          evidence: { filename: 'Card_Auth_8821.pdf', size: '760 KB' }
        }
      ],
      internal_notes: [],
      conversation: { is_closed: true, closed_at: '2026-11-04 14:00', messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-04 11:00:00', window_hours: 2, is_overdue: false, response_started_at: '2026-11-04 11:15:00' }
    },

    // --- Manasek Global (COMP-103) Requests ---
    {
      id: 'MOD-2026-107',
      company_id: 'COMP-103',
      company_name_ar: 'شركة مناسك العالمية للسياحة',
      company_name_en: 'Manasek Global Travel',
      company_employee: {
        name_ar: 'حسام البدري',
        name_en: 'Hossam El-Badry',
        phone: '01099887766',
        whatsapp: '01099887766',
        ref: 'EMP-MN-01'
      },
      booking_id: 'BK-2026-1047',
      customer_id: 'CUST-1003',
      customer_name_ar: 'طارق فؤاد المهدي',
      customer_name_en: 'Tarek Fouad El-Mahdy',
      customer_phone: '01234567893',
      customer_whatsapp: '01234567893',
      created_at: '2026-11-06 07:15', // > 2 hours -> Overdue!
      timestamp_iso: '2026-11-06T07:15:00',
      request_status: 'new', // Overdue test case!
      payment_status: 'partially_paid',
      original_program: {
        name_ar: 'عمرة برية مميزة (حافلات حديثة)',
        name_en: 'Distinctive Land Umrah (Modern Coaches)',
        type_ar: 'بري سياحي',
        type_en: 'Land Coach',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-10',
        return_date: '2027-01-20',
        total_price: 36000,
        hotel_ar: 'فندق صفوة الضيافة (مكة)',
        hotel_en: 'Safwat Al-Diyafa (Makkah)',
        travelers_count: 1
      },
      new_program: {
        name_ar: 'عمرة طيران اقتصادي موفر',
        name_en: 'Economy Saver Flight Umrah',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-12',
        return_date: '2027-01-20',
        total_price: 56000,
        hotel_ar: 'فندق أبراج الكسوة (مكة)',
        hotel_en: 'Kiswah Towers (Makkah)',
        travelers_count: 1,
        modification_reason_ar: 'تعديل موعد السفر وحجز طيران لتفادي إرهاق السفر البري.',
        modification_reason_en: 'Changed transport to flight to avoid long land coach travel.'
      },
      original_deposit: 16000,
      additional_payments: [
        {
          id: 'PAY-MOD-888',
          date: '2026-11-06 07:45',
          amount: 15000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي الأهلي',
          payment_method_en: 'Bank Transfer (NBE)',
          receipt_ref: 'RCP-BNK-9941',
          recorded_by_ar: 'حسام البدري',
          recorded_by_en: 'Hossam El-Badry',
          review_status: 'pending_review',
          evidence: { filename: 'Receipt_9941.pdf', size: '1.3 MB' }
        }
      ],
      internal_notes: [],
      conversation: { is_closed: false, closed_at: null, messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-06 07:15:00', window_hours: 2, is_overdue: true, response_started_at: null }
    },

    // --- Al-Safa (COMP-104) Requests ---
    {
      id: 'MOD-2026-108',
      company_id: 'COMP-104',
      company_name_ar: 'شركة الصفا للنقل والخدمات السياحية',
      company_name_en: 'Al-Safa Travel & Tourism',
      company_employee: {
        name_ar: 'خالد عبد الوهاب',
        name_en: 'Khaled Abdel Wahab',
        phone: '01144556677',
        whatsapp: '01144556677',
        ref: 'EMP-SF-03'
      },
      booking_id: 'BK-2026-1048',
      customer_id: 'CUST-1004',
      customer_name_ar: 'فاطمة حسن البنا',
      customer_name_en: 'Fatma Hassan El-Banna',
      customer_phone: '01234567894',
      customer_whatsapp: '01234567894',
      created_at: '2026-11-05 10:00',
      timestamp_iso: '2026-11-05T10:00:00',
      request_status: 'in_progress',
      payment_status: 'partially_paid',
      original_program: {
        name_ar: 'عمرة شعبان البرية (حافلات VIP)',
        name_en: 'Shaaban Land VIP Umrah (VIP Buses)',
        type_ar: 'بري VIP',
        type_en: 'Land VIP',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-02-01',
        return_date: '2027-02-12',
        total_price: 48000,
        hotel_ar: 'فندق دار الإيمان (مكة)',
        hotel_en: 'Dar Al-Eiman (Makkah)',
        travelers_count: 2
      },
      new_program: {
        name_ar: 'عمرة شعبان طيران اقتصادي',
        name_en: 'Shaaban Economy Flight Umrah',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-02-03',
        return_date: '2027-02-12',
        total_price: 78000,
        hotel_ar: 'فندق بولمان زمزم مكة',
        hotel_en: 'Pullman Zamzam Makkah',
        travelers_count: 2,
        modification_reason_ar: 'ترقية السفر إلى طيران وإقامة بولمان زمزم.',
        modification_reason_en: 'Upgraded to flight and Pullman Zamzam hotel.'
      },
      original_deposit: 24000,
      additional_payments: [
        {
          id: 'PAY-MOD-889',
          date: '2026-11-05 10:30',
          amount: 30000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي بنك القاهرة',
          payment_method_en: 'Bank Transfer (BDC)',
          receipt_ref: 'RCP-BNK-9952',
          recorded_by_ar: 'خالد عبد الوهاب',
          recorded_by_en: 'Khaled Abdel Wahab',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-05 11:15',
          evidence: { filename: 'Receipt_9952.pdf', size: '1.2 MB' }
        }
      ],
      internal_notes: [],
      conversation: { is_closed: false, closed_at: null, messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-05 10:00:00', window_hours: 2, is_overdue: false, response_started_at: '2026-11-05 10:15:00' }
    },

    // --- Al-Baraka (COMP-105) Requests ---
    {
      id: 'MOD-2026-109',
      company_id: 'COMP-105',
      company_name_ar: 'شركة البركة لخدمات المعتمرين',
      company_name_en: 'Al-Baraka Umrah Services',
      company_employee: {
        name_ar: 'نبيل غانم',
        name_en: 'Nabil Ghanem',
        phone: '01011223344',
        whatsapp: '01011223344',
        ref: 'EMP-BK-05'
      },
      booking_id: 'BK-2026-1051',
      customer_id: 'CUST-1007',
      customer_name_ar: 'زينب مصطفى كمال',
      customer_name_en: 'Zeinab Mostafa Kamal',
      customer_phone: '01234567897',
      customer_whatsapp: '01234567897',
      created_at: '2026-11-06 11:00',
      timestamp_iso: '2026-11-06T11:00:00',
      request_status: 'in_progress',
      payment_status: 'paid_full',
      original_program: {
        name_ar: 'عمرة برية فاخرة — فنادق الحرم',
        name_en: 'Deluxe Land Umrah — Haram Hotels',
        type_ar: 'بري فاخر',
        type_en: 'Deluxe Land',
        season_ar: 'شوال ١٤٤٨ هـ',
        season_en: 'Shawwal 1448 AH',
        travel_date: '2027-04-10',
        return_date: '2027-04-20',
        total_price: 56000,
        hotel_ar: 'فندق أبراج الكسوة (مكة)',
        hotel_en: 'Kiswah Towers (Makkah)',
        travelers_count: 1
      },
      new_program: {
        name_ar: 'عمرة شوال الاقتصادية طيران مباشر',
        name_en: 'Shawwal Economy Umrah Direct Flight',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'شوال ١٤٤٨ هـ',
        season_en: 'Shawwal 1448 AH',
        travel_date: '2027-04-12',
        return_date: '2027-04-20',
        total_price: 50000,
        hotel_ar: 'فندق روابي مكة (مكة)',
        hotel_en: 'Rawabi Makkah (Makkah)',
        travelers_count: 1,
        modification_reason_ar: 'تعديل وسيلة السفر إلى طيران مع تخفيض تكلفة الإقامة لتوفير الميزانية.',
        modification_reason_en: 'Changed transport to flight while adjusting room category to fit budget.'
      },
      original_deposit: 50000,
      additional_payments: [],
      internal_notes: [],
      conversation: { is_closed: false, closed_at: null, messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-06 11:00:00', window_hours: 2, is_overdue: false, response_started_at: '2026-11-06 11:20:00' }
    },

    // --- Dar Al-Salam (COMP-106) Requests ---
    {
      id: 'MOD-2026-110',
      company_id: 'COMP-106',
      company_name_ar: 'شركة دار السلام للسياحة والحج والعمرة',
      company_name_en: 'Dar Al-Salam Hajj & Umrah',
      company_employee: {
        name_ar: 'طارق منصور',
        name_en: 'Tarek Mansour',
        phone: '01277889900',
        whatsapp: '01277889900',
        ref: 'EMP-DS-01'
      },
      booking_id: 'BK-2026-1053',
      customer_id: 'CUST-1009',
      customer_name_ar: 'إيمان فتحي عاشور',
      customer_name_en: 'Iman Fathy Ashour',
      customer_phone: '01234567899',
      customer_whatsapp: '01234567899',
      created_at: '2026-11-05 16:30',
      timestamp_iso: '2026-11-05T16:30:00',
      request_status: 'completed',
      payment_status: 'paid_full',
      original_program: {
        name_ar: 'عمرة اقتصادية موفرة (طيران)',
        name_en: 'Umrah Economy Saver (Flight)',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-18',
        return_date: '2027-01-28',
        total_price: 76000,
        hotel_ar: 'فندق أنوار الضيافة (مكة)',
        hotel_en: 'Anwar Al-Diyafa (Makkah)',
        travelers_count: 2
      },
      new_program: {
        name_ar: 'عمرة ٤ نجوم محبس الجن (طيران)',
        name_en: '4-Star Mahbas Al-Jin Umrah (Flight)',
        type_ar: 'طيران ٤ نجوم',
        type_en: '4-Star Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-18',
        return_date: '2027-01-28',
        total_price: 92000,
        hotel_ar: 'فندق إيلاف أجياد (مكة) — هيلتون المدينة',
        hotel_en: 'Elaf Ajyad (Makkah) — Hilton Madinah',
        travelers_count: 2,
        modification_reason_ar: 'ترقية الفندق بناءً على رغبة العميل وإضافة وجبات بوفيه كامل.',
        modification_reason_en: 'Hotel upgraded with full buffet meals at customer request.'
      },
      original_deposit: 76000,
      additional_payments: [
        {
          id: 'PAY-MOD-890',
          date: '2026-11-05 16:45',
          amount: 16000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي الأهلي',
          payment_method_en: 'Bank Transfer (NBE)',
          receipt_ref: 'RCP-BNK-9963',
          recorded_by_ar: 'طارق منصور',
          recorded_by_en: 'Tarek Mansour',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-05 17:15',
          evidence: { filename: 'Receipt_9963.pdf', size: '1.2 MB' }
        }
      ],
      internal_notes: [],
      conversation: { is_closed: true, closed_at: '2026-11-05 17:30', messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-05 16:30:00', window_hours: 2, is_overdue: false, response_started_at: '2026-11-05 16:40:00' }
    },

    // --- Al-Taqwa (COMP-107) Requests ---
    {
      id: 'MOD-2026-111',
      company_id: 'COMP-107',
      company_name_ar: 'شركة التقوى للسياحة والرحلات الدينية',
      company_name_en: 'Al-Taqwa Travel & Tourism',
      company_employee: {
        name_ar: 'ياسر رضوان',
        name_en: 'Yasser Radwan',
        phone: '01066778899',
        whatsapp: '01066778899',
        ref: 'EMP-TQ-02'
      },
      booking_id: 'BK-2026-1054',
      customer_id: 'CUST-1010',
      customer_name_ar: 'جمال توفيق البدري',
      customer_name_en: 'Gamal Tawfiq El-Badry',
      customer_phone: '01234567810',
      customer_whatsapp: '01234567810',
      created_at: '2026-11-06 12:00',
      timestamp_iso: '2026-11-06T12:00:00',
      request_status: 'in_progress',
      payment_status: 'partially_paid',
      original_program: {
        name_ar: 'عمرة التوفير البرية',
        name_en: 'Budget Saver Land Umrah',
        type_ar: 'بري اقتصادي',
        type_en: 'Budget Land',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-24',
        return_date: '2027-02-03',
        total_price: 34000,
        hotel_ar: 'فندق دار السلام (مكة)',
        hotel_en: 'Dar Al-Salam (Makkah)',
        travelers_count: 1
      },
      new_program: {
        name_ar: 'عمرة رجب ٤ نجوم طيران',
        name_en: 'Rajab 4-Star Flight Umrah',
        type_ar: 'طيران ٤ نجوم',
        type_en: '4-Star Flight',
        season_ar: 'رجب ١٤٤٨ هـ',
        season_en: 'Rajab 1448 AH',
        travel_date: '2027-01-25',
        return_date: '2027-02-03',
        total_price: 64000,
        hotel_ar: 'فندق ساعة مكة فيرمونت',
        hotel_en: 'Fairmont Makkah Clock Tower',
        travelers_count: 1,
        modification_reason_ar: 'ترقية إلى طيران وإقامة ٥ نجوم بفيرمونت.',
        modification_reason_en: 'Upgraded to flight and Fairmont Makkah.'
      },
      original_deposit: 15000,
      additional_payments: [
        {
          id: 'PAY-MOD-891',
          date: '2026-11-06 12:30',
          amount: 25000,
          payment_method: 'bank_transfer',
          payment_method_ar: 'تحويل بنكي مصر',
          payment_method_en: 'Bank Transfer (BM)',
          receipt_ref: 'RCP-BNK-9975',
          recorded_by_ar: 'ياسر رضوان',
          recorded_by_en: 'Yasser Radwan',
          review_status: 'approved',
          reviewed_by_ar: 'أحمد صبري',
          reviewed_by_en: 'Ahmed Sabry',
          reviewed_at: '2026-11-06 13:00',
          evidence: { filename: 'Receipt_9975.pdf', size: '1.1 MB' }
        }
      ],
      internal_notes: [],
      conversation: { is_closed: false, closed_at: null, messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-06 12:00:00', window_hours: 2, is_overdue: false, response_started_at: '2026-11-06 12:15:00' }
    },

    // --- Noor Al-Eman (COMP-108) Requests ---
    {
      id: 'MOD-2026-112',
      company_id: 'COMP-108',
      company_name_ar: 'شركة نور الإيمان لخدمات الحرمين',
      company_name_en: 'Noor Al-Eman Haramain Services',
      company_employee: {
        name_ar: 'علاء عبد الباقي',
        name_en: 'Alaa Abdel Baqi',
        phone: '01122334455',
        whatsapp: '01122334455',
        ref: 'EMP-NE-01'
      },
      booking_id: 'BK-2026-1056',
      customer_id: 'CUST-1012',
      customer_name_ar: 'أشرف عبد الرحيم الديب',
      customer_name_en: 'Ashraf Abdel Rahim El-Deeb',
      customer_phone: '01122334412',
      customer_whatsapp: '01122334412',
      created_at: '2026-11-06 13:10',
      timestamp_iso: '2026-11-06T13:10:00',
      request_status: 'new',
      payment_status: 'unpaid',
      original_program: {
        name_ar: 'عمرة اقتصادية طيران موفر',
        name_en: 'Economy Saver Flight Umrah',
        type_ar: 'طيران اقتصادي',
        type_en: 'Economy Flight',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-02-10',
        return_date: '2027-02-20',
        total_price: 58000,
        hotel_ar: 'فندق أبراج الكسوة (مكة)',
        hotel_en: 'Kiswah Towers (Makkah)',
        travelers_count: 1
      },
      new_program: {
        name_ar: 'عمرة النصف من شعبان المميزة',
        name_en: 'Mid-Shaaban Premium Umrah',
        type_ar: 'طيران مميز',
        type_en: 'Premium Flight',
        season_ar: 'شعبان ١٤٤٨ هـ',
        season_en: 'Shaaban 1448 AH',
        travel_date: '2027-02-15',
        return_date: '2027-02-26',
        total_price: 88000,
        hotel_ar: 'فندق كونراد مكة جبل عمر',
        hotel_en: 'Conrad Makkah Jabal Omar',
        travelers_count: 1,
        modification_reason_ar: 'تأجيل موعد السفر لمنتصف شعبان وترقية فندق مكة إلى كونراد جبل عمر.',
        modification_reason_en: 'Rescheduled travel to mid-Shaaban and upgraded hotel to Conrad Jabal Omar.'
      },
      original_deposit: 20000,
      additional_payments: [],
      internal_notes: [],
      conversation: { is_closed: false, closed_at: null, messages: [] },
      status_history: [],
      activity_log: [],
      sla: { arrival_time: '2026-11-06 13:10:00', window_hours: 2, is_overdue: false, response_started_at: null }
    }
  ];

  // Helper calculating approved amounts strictly
  function calculateRequestFinancials(req) {
    const origPrice = (req.original_program && req.original_program.total_price) || 0;
    const newPrice = (req.new_program && req.new_program.total_price) || 0;
    const origDeposit = req.original_deposit || 0;

    const payments = req.additional_payments || [];
    const approvedAdd = payments
      .filter(p => p.review_status === 'approved')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingAdd = payments
      .filter(p => p.review_status === 'pending_review' || p.review_status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalApprovedPaid = origDeposit + approvedAdd;
    const remainingAmount = Math.max(0, newPrice - totalApprovedPaid);
    const progressPct = newPrice > 0 ? Math.min(100, Number(((totalApprovedPaid / newPrice) * 100).toFixed(2))) : 0;

    return {
      originalPrice: origPrice,
      newPrice: newPrice,
      originalDeposit: origDeposit,
      approvedAdditional: approvedAdd,
      pendingAdditional: pendingAdd,
      totalApprovedPaid: totalApprovedPaid,
      remainingAmount: remainingAmount,
      progressPct: progressPct
    };
  }

  // --- Master Cancellations & Settlements Requests Dataset ---
  const CANCELLATION_REQUESTS = [
    {
      id: 'CAN-2026-001',
      booking_id: 'BK-2026-1048',
      customer_id: 'CUST-1004',
      customer_name_ar: 'محمود فوزي رضوان',
      customer_name_en: 'Mahmoud Fawzy Radwan',
      customer_phone: '01149201948',
      customer_whatsapp: '01149201948',
      customer_email: 'm.fawzy@hotmail.com',
      customer_national_id: '28910151203491',
      customer_governorate_ar: 'المنوفية',
      customer_governorate_en: 'Monufia',
      company_id: 'COMP-101',
      company_name_ar: 'شركة طيبة لإدارة رحلات الحج والعمرة',
      company_name_en: 'Tayba Pilgrimage & Umrah Management',
      company_license: '1142',
      company_contact: {
        name_ar: 'مروان السعيد',
        name_en: 'Marwan El-Saeed',
        phone: '01011223344',
        whatsapp: '01011223344'
      },
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      travelers_count: 2,
      travelers: [
        { name_ar: 'محمود فوزي رضوان', name_en: 'Mahmoud Fawzy Radwan', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A28910452', birth_date: '1985-06-14' },
        { name_ar: 'هناء عبد السميع البنا', name_en: 'Hanaa Abdel-Sameea El-Banna', relation_ar: 'الزوجة', relation_en: 'Spouse', passport: 'A28910453', birth_date: '1989-11-20' }
      ],
      source: 'customer', // Exactly two sources: 'customer' | 'company'
      cancellation_status: 'under_review', // 'under_review' | 'cancelled' | 'rejected'
      refund_status: 'pending', // 'pending' | 'processing' | 'completed' | 'failed' | 'none'
      created_at: '2026-11-05 09:30',
      timestamp_iso: '2026-11-05T09:30:00',
      updated_at: '2026-11-05 10:15',
      cancellation_reason_ar: 'ظروف صحية طارئة للمعتمر الرئيسي تمنع من السفر بموجب تقرير طبي رسمي معتمد من المستشفى.',
      cancellation_reason_en: 'Emergency medical condition preventing travel as per certified hospital medical report.',
      cancellation_notes_ar: 'طلب العميل إلغاء الحجز كاملاً واسترداد كافة المبالغ المعتمدة لحسابه البنكي بالبنك الأهلي المصري.',
      cancellation_notes_en: 'Customer requested full booking cancellation and refund of all approved payments to National Bank of Egypt account.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 52000,
        total_paid_records: 52000,
        approved_paid: 32000, // Approved only!
        pending_paid: 20000, // Pending review -> strictly excluded from refund!
        refund_due: 32000, // Refund Due = Approved Paid ONLY
        executed_refund: 0,
        remaining_refund: 32000
      },
      payments_breakdown: [
        { id: 'PAY-BK-101', date: '2026-10-20 14:00', amount: 20000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-901', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' },
        { id: 'PAY-BK-102', date: '2026-10-25 11:30', amount: 12000, method_ar: 'بطاقة ائتمان', method_en: 'Credit Card', receipt_ref: 'CRD-2026-441', status: 'approved', reviewer_ar: 'سارة خالد', reviewer_en: 'Sarah Khaled' },
        { id: 'PAY-BK-103', date: '2026-11-02 16:00', amount: 20000, method_ar: 'إيداع نقدي', method_en: 'Cash Deposit', receipt_ref: 'CSH-PEND-881', status: 'pending_review', reviewer_ar: '—', reviewer_en: '—' }
      ],
      attachments: [
        { id: 'ATT-001', name_ar: 'تقرير طبي مستشفى دار الفؤاد.pdf', name_en: 'Medical_Report_Dar_AlFouad.pdf', size: '1.4 MB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-002', name_ar: 'خطاب طلب الإلغاء الرسمي موقع ومختوم.pdf', name_en: 'Signed_Cancellation_Request_Letter.pdf', size: '820 KB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-003', name_ar: 'مستند الآيبان البنكي للعميل.jpg', name_en: 'Customer_Bank_IBAN_Proof.jpg', size: '450 KB', date: '2026-11-05', type: 'image/jpeg', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' }
      ],
      refund_operations: [],
      corrective_actions: [],
      internal_notes: [
        { id: 'NOTE-CAN-1', author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-05 10:15', text_ar: 'تم فحص المرفق الطبي وهو معتمد ومختوم. تم استبعاد الدفعة النقدية (٢٠ ألف ج.م) المعلقة من احتساب الاسترداد حتى التحقق من توريدها المركزي.', text_en: 'Medical certificate verified and authentic. Excluded pending cash deposit (20k EGP) from refund due until ledger reconciliation.' }
      ],
      activity_log: [
        { id: 'ACT-CAN-101', date: '2026-11-05 09:30', title_ar: 'استلام طلب الإلغاء من العميل', title_en: 'Cancellation Request Received', desc_ar: 'تم تقديم طلب الإلغاء عبر بوابة المعتمر مع إرفاق التقارير الطبية والآيبان.', desc_en: 'Request submitted via pilgrim portal with medical report and bank IBAN certificate.', actor_ar: 'محمود فوزي رضوان', actor_en: 'Mahmoud Fawzy Radwan', type: 'creation' },
        { id: 'ACT-CAN-102', date: '2026-11-05 10:15', title_ar: 'بدء التدقيق والمراجعة الحسابية', title_en: 'Audit & Reconciliation Initiated', desc_ar: 'بدء فحص الحوالات والتحقق من المبالغ المسددة المعتمدة واستبعاد المعلق.', desc_en: 'Reconciliation started, approved payments calculated, pending payments excluded.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'audit' }
      ]
    },

    {
      id: 'CAN-2026-002',
      booking_id: 'BK-2026-1045',
      customer_id: 'CUST-1001',
      customer_name_ar: 'أحمد محمود الشريف',
      customer_name_en: 'Ahmed Mahmoud El-Sherif',
      customer_phone: '01012345671',
      customer_whatsapp: '01012345671',
      customer_email: 'ahmed.elsherif@gmail.com',
      customer_national_id: '28005121402219',
      customer_governorate_ar: 'الجيزة',
      customer_governorate_en: 'Giza',
      company_id: 'COMP-102',
      company_name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      company_name_en: 'Al-Huda Religious Travel & Tourism',
      company_license: '2091',
      company_contact: {
        name_ar: 'أشرف القاضي',
        name_en: 'Ashraf El-Kady',
        phone: '01198765432',
        whatsapp: '01198765432'
      },
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      travelers_count: 2,
      travelers: [
        { name_ar: 'أحمد محمود الشريف', name_en: 'Ahmed Mahmoud El-Sherif', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A28005121', birth_date: '1980-05-12' },
        { name_ar: 'سلوى مصطفى خليل', name_en: 'Salwa Moustafa Khalil', relation_ar: 'الزوجة', relation_en: 'Spouse', passport: 'A28005122', birth_date: '1984-09-03' }
      ],
      source: 'company', // Exactly company source!
      cancellation_status: 'under_review',
      refund_status: 'pending',
      created_at: '2026-11-05 11:20',
      timestamp_iso: '2026-11-05T11:20:00',
      updated_at: '2026-11-05 12:00',
      cancellation_reason_ar: 'إلغاء الرحلة المجدولة من قبل شركة الطيران الناقلة وتعذر توفير مقاعد بديلة في نفس الأسبوع.',
      cancellation_reason_en: 'Flight cancellation by carrier with no alternative seats available within the operational week.',
      cancellation_notes_ar: 'تطلب شركة السياحة إلغاء الحجز وإعادة المبلغ كاملاً للعميل لعدم توفر مقاعد طيران بديلة.',
      cancellation_notes_en: 'Agency requests cancellation and full customer refund due to flight cancellation.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 76000,
        total_paid_records: 76000,
        approved_paid: 76000,
        pending_paid: 0,
        refund_due: 76000,
        executed_refund: 0,
        remaining_refund: 76000
      },
      payments_breakdown: [
        { id: 'PAY-BK-201', date: '2026-10-25 10:00', amount: 76000, method_ar: 'إنستاباي IPN', method_en: 'InstaPay IPN', receipt_ref: 'IPN-2026-9041', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' }
      ],
      attachments: [
        { id: 'ATT-004', name_ar: 'إشعار إلغاء الرحلة من الخطوط الجوية.pdf', name_en: 'Airline_Flight_Cancellation_Notice.pdf', size: '1.1 MB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'شركة السياحة', uploaded_by_en: 'Tourism Company' },
        { id: 'ATT-005', name_ar: 'إقرار شركة السياحة بالموافقة على الاسترداد الكامل.pdf', name_en: 'Company_Full_Refund_Consent_Affidavit.pdf', size: '680 KB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'شركة السياحة', uploaded_by_en: 'Tourism Company' }
      ],
      refund_operations: [],
      corrective_actions: [],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-201', date: '2026-11-05 11:20', title_ar: 'استلام طلب الإلغاء من شركة السياحة', title_en: 'Cancellation Received from Agency', desc_ar: 'سجلت شركة الهدى طلب إلغاء الحجز بسبب إلغاء رحلة الطيران من الناقل.', desc_en: 'Al-Huda Travel recorded cancellation request due to carrier flight cancellation.', actor_ar: 'أشرف القاضي', actor_en: 'Ashraf El-Kady', type: 'creation' }
      ]
    },

    {
      id: 'CAN-2026-003',
      booking_id: 'BK-2026-1049',
      customer_id: 'CUST-1005',
      customer_name_ar: 'فاطمة الزهراء علي',
      customer_name_en: 'Fatima Al-Zahraa Ali',
      customer_phone: '01232574706',
      customer_whatsapp: '01232574706',
      customer_email: 'fatima.ali@outlook.com',
      customer_national_id: '29208141201982',
      customer_governorate_ar: 'الدقهلية',
      customer_governorate_en: 'Dakahlia',
      company_id: 'COMP-103',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      company_license: '1845',
      company_contact: {
        name_ar: 'هاني سراج',
        name_en: 'Hani Serag',
        phone: '01223344556',
        whatsapp: '01223344556'
      },
      program_ar: 'عمرة شعبان VIP برج الساعة',
      program_en: 'Shaban VIP Clock Tower Umrah',
      travelers_count: 2,
      travelers: [
        { name_ar: 'فاطمة الزهراء علي', name_en: 'Fatima Al-Zahraa Ali', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A29208141', birth_date: '1992-08-14' },
        { name_ar: 'علي محمود سالم', name_en: 'Ali Mahmoud Salem', relation_ar: 'الوالد', relation_en: 'Father', passport: 'A29208142', birth_date: '1961-04-10' }
      ],
      source: 'customer',
      cancellation_status: 'cancelled', // Approved!
      refund_status: 'pending', // Awaiting refund transfer execution!
      created_at: '2026-11-04 14:10',
      timestamp_iso: '2026-11-04T14:10:00',
      updated_at: '2026-11-04 16:30',
      cancellation_reason_ar: 'وفاة والد المعتمرة الرئيسي بموجب شهادة الوفاة الرسمية المرفقة وتعذر السفر.',
      cancellation_reason_en: 'Death of lead pilgrim’s father as confirmed by official death certificate.',
      cancellation_notes_ar: 'تم التحقق من شهادة الوفاة واعتماد الإلغاء كاملاً بدون أي رسوم وإحالة الملف لتحويل الاسترداد.',
      cancellation_notes_en: 'Verified death certificate, approved full cancellation without deductions, queued for refund wire.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 148000,
        total_paid_records: 148000,
        approved_paid: 148000,
        pending_paid: 0,
        refund_due: 148000,
        executed_refund: 0,
        remaining_refund: 148000
      },
      payments_breakdown: [
        { id: 'PAY-BK-301', date: '2026-11-01 10:00', amount: 100000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'CIB-TX-8831', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' },
        { id: 'PAY-BK-302', date: '2026-11-02 13:40', amount: 48000, method_ar: 'اتصالات كاش', method_en: 'Etisalat Cash', receipt_ref: 'MQ-RCP-2026-0808', status: 'approved', reviewer_ar: 'سارة خالد', reviewer_en: 'Sarah Khaled' }
      ],
      attachments: [
        { id: 'ATT-006', name_ar: 'شهادة الوفاة الرسمية المميكنة.pdf', name_en: 'Official_Death_Certificate.pdf', size: '980 KB', date: '2026-11-04', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-007', name_ar: 'إفادة الحساب البنكي والآيبان من بنك CIB.pdf', name_en: 'Bank_IBAN_Letter_CIB.pdf', size: '520 KB', date: '2026-11-04', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' }
      ],
      refund_operations: [],
      corrective_actions: [],
      internal_notes: [
        { id: 'NOTE-CAN-3', author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-04 16:30', text_ar: 'حالة وفاة مثبتة رسمياً - تم اعتماد الإلغاء الكامل وإعفاء الحجز من أي مصاريف إدارية.', text_en: 'Documented bereavement case - approved full refund with zero administrative fees.' }
      ],
      activity_log: [
        { id: 'ACT-CAN-301', date: '2026-11-04 14:10', title_ar: 'استلام طلب الإلغاء', title_en: 'Cancellation Received', desc_ar: 'تسجيل طلب الإلغاء لظرف وفاة مرفقاً بالشهادة الرسمية.', desc_en: 'Cancellation recorded due to death certificate.', actor_ar: 'فاطمة الزهراء علي', actor_en: 'Fatima Al-Zahraa Ali', type: 'creation' },
        { id: 'ACT-CAN-302', date: '2026-11-04 16:30', title_ar: 'اعتماد إلغاء الحجز رسميًا', title_en: 'Cancellation Formally Approved', desc_ar: 'تم اعتماد الإلغاء من قبل موظف الحسابات وإدراج المبلغ (١٤٨,٠٠٠ ج.م) في قائمة انتظار التحويل.', desc_en: 'Cancellation approved by accounts officer, (148,000 EGP) queued for wire execution.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' }
      ]
    },

    {
      id: 'CAN-2026-004',
      booking_id: 'BK-2026-1050',
      customer_id: 'CUST-1006',
      customer_name_ar: 'عبد الرحمن طارق الجمل',
      customer_name_en: 'Abdulrahman Tarek El-Gammal',
      customer_phone: '01289736991',
      customer_whatsapp: '01289736991',
      customer_email: 'a.gammal@gmail.com',
      customer_national_id: '28607180102914',
      customer_governorate_ar: 'الإسكندرية',
      customer_governorate_en: 'Alexandria',
      company_id: 'COMP-104',
      company_name_ar: 'شركة الصفا والمروة',
      company_name_en: 'Al Safa & Marwa Travel',
      company_license: '1630',
      company_contact: {
        name_ar: 'حاتم الشوربجي',
        name_en: 'Hatem El-Shorbagy',
        phone: '01066554433',
        whatsapp: '01066554433'
      },
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      travelers_count: 2,
      travelers: [
        { name_ar: 'عبد الرحمن طارق الجمل', name_en: 'Abdulrahman Tarek El-Gammal', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A28607180', birth_date: '1986-07-18' },
        { name_ar: 'مريم عادل الشافعي', name_en: 'Mariam Adel El-Shafei', relation_ar: 'الزوجة', relation_en: 'Spouse', passport: 'A28607181', birth_date: '1990-03-25' }
      ],
      source: 'company',
      cancellation_status: 'cancelled',
      refund_status: 'processing', // Transfer initiated with bank!
      created_at: '2026-11-03 10:00',
      timestamp_iso: '2026-11-03T10:00:00',
      updated_at: '2026-11-04 09:30',
      cancellation_reason_ar: 'إغلاق الفندق المتعاقد عليه بمكة المكرمة لأعمال صيانة بلدية طارئة وتعذر توفير بديل مناسب.',
      cancellation_reason_en: 'Contracted Makkah hotel closure due to municipal maintenance with no equivalent alternative.',
      cancellation_notes_ar: 'وافقت الشركة على إعادة المبلغ كاملاً وتم إرسال أمر التحويل البنكي للمقاصة.',
      cancellation_notes_en: 'Company approved full refund and bank transfer dispatch instruction was sent.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 64000,
        total_paid_records: 64000,
        approved_paid: 64000,
        pending_paid: 0,
        refund_due: 64000,
        executed_refund: 0,
        remaining_refund: 64000
      },
      payments_breakdown: [
        { id: 'PAY-BK-401', date: '2026-10-28 11:00', amount: 45500, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-7712', status: 'approved', reviewer_ar: 'سارة خالد', reviewer_en: 'Sarah Khaled' },
        { id: 'PAY-BK-402', date: '2026-11-02 14:00', amount: 18500, method_ar: 'إنستاباي', method_en: 'InstaPay', receipt_ref: 'MQ-RCP-2026-0807', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' }
      ],
      attachments: [
        { id: 'ATT-008', name_ar: 'إشعار صيانة الفندق الصادر من أمانة العاصمة المقدسة.pdf', name_en: 'Hotel_Municipal_Notice.pdf', size: '1.3 MB', date: '2026-11-03', type: 'application/pdf', uploaded_by_ar: 'شركة السياحة', uploaded_by_en: 'Tourism Company' },
        { id: 'ATT-009', name_ar: 'إيصال أمر التحويل البنكي الصادر من الحسابات.pdf', name_en: 'Refund_Bank_Transfer_Order.pdf', size: '610 KB', date: '2026-11-04', type: 'application/pdf', uploaded_by_ar: 'حسابات ميقات', uploaded_by_en: 'Miqat Accounts' }
      ],
      refund_operations: [
        {
          id: 'REF-OP-401',
          date: '2026-11-04 09:30',
          amount: 64000,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي رسمي',
          method_en: 'Official Bank Wire',
          bank_name_ar: 'بنك مصر',
          bank_name_en: 'Banque Misr',
          beneficiary_name_ar: 'عبد الرحمن طارق الجمل',
          beneficiary_name_en: 'Abdulrahman Tarek El-Gammal',
          account_iban: 'EG290002000100000004819204918',
          reference_no: 'TRX-REF-992104',
          status: 'processing',
          status_ar: 'قيد التحويل والمعالجة البنكية',
          status_en: 'Processing with Bank',
          voucher_file: 'Refund_Bank_Transfer_Order.pdf',
          voucher_size: '610 KB',
          notes_ar: 'تم إرسال أمر التحويل إلى بنك مصر بانتظار إشعار المقاصة النهائي وتأكيد الإيداع',
          notes_en: 'Wire instruction sent to Banque Misr awaiting final settlement credit notification'
        }
      ],
      corrective_actions: [],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-401', date: '2026-11-03 10:00', title_ar: 'تسجيل طلب الإلغاء من شركة السياحة', title_en: 'Agency Cancellation Logged', desc_ar: 'طلب إلغاء بسبب إغلاق الفندق المتعاقد عليه بمكة.', desc_en: 'Cancellation requested due to hotel maintenance closure.', actor_ar: 'حاتم الشوربجي', actor_en: 'Hatem El-Shorbagy', type: 'creation' },
        { id: 'ACT-CAN-402', date: '2026-11-03 14:00', title_ar: 'اعتماد الإلغاء والمطابقة المالية', title_en: 'Cancellation Approved & Reconciled', desc_ar: 'تم اعتماد الإلغاء كاملاً وإحالة المستحقات البالغة ٦٤,٠٠٠ ج.م للتحويل.', desc_en: 'Approved full cancellation; 64,000 EGP forwarded for transfer.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' },
        { id: 'ACT-CAN-403', date: '2026-11-04 09:30', title_ar: 'تسجيل أمر التحويل البنكي', title_en: 'Bank Wire Instruction Recorded', desc_ar: 'تم تسجيل تحويل استرداد بمبلغ ٦٤,٠٠٠ ج.م عبر بنك مصر بالمرجع: TRX-REF-992104.', desc_en: 'Refund wire recorded for 64,000 EGP via Banque Misr, Ref: TRX-REF-992104.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_processing' }
      ]
    },

    {
      id: 'CAN-2026-005',
      booking_id: 'BK-2026-1047',
      customer_id: 'CUST-1003',
      customer_name_ar: 'سارة خالد المنصوري',
      customer_name_en: 'Sarah Khaled El-Mansoury',
      customer_phone: '01225077617',
      customer_whatsapp: '01225077617',
      customer_email: 'sarah.mansoury@gmail.com',
      customer_national_id: '29503110103429',
      customer_governorate_ar: 'القاهرة',
      customer_governorate_en: 'Cairo',
      company_id: 'COMP-102',
      company_name_ar: 'شركة هداية المعتمد للسياحة',
      company_name_en: 'Hedaya Travel',
      company_license: '1902',
      company_contact: {
        name_ar: 'مدحت عزمي',
        name_en: 'Medhat Azmy',
        phone: '01122339988',
        whatsapp: '01122339988'
      },
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      travelers_count: 1,
      travelers: [
        { name_ar: 'سارة خالد المنصوري', name_en: 'Sarah Khaled El-Mansoury', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A29503110', birth_date: '1995-03-11' }
      ],
      source: 'customer',
      cancellation_status: 'cancelled',
      refund_status: 'failed', // CRITICAL FAILURE SCENARIO
      created_at: '2026-11-01 11:00',
      timestamp_iso: '2026-11-01T11:00:00',
      updated_at: '2026-11-03 14:15',
      cancellation_reason_ar: 'ظرف عائلي قاهر يستدعي إلغاء السفر واسترداد الرصيد المالي.',
      cancellation_reason_en: 'Compelling family emergency requiring trip cancellation and funds refund.',
      cancellation_notes_ar: 'تم اعتماد الإلغاء، لكن ارتد التحويل البنكي بسبب خطأ في بيانات الآيبان المقدمة من العميل.',
      cancellation_notes_en: 'Cancellation approved, but wire bounced due to erroneous IBAN credentials provided by customer.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 92000,
        total_paid_records: 92000,
        approved_paid: 92000,
        pending_paid: 0,
        refund_due: 92000,
        executed_refund: 0,
        remaining_refund: 92000
      },
      payments_breakdown: [
        { id: 'PAY-BK-501', date: '2026-10-22 12:00', amount: 77000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-5510', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' },
        { id: 'PAY-BK-502', date: '2026-11-02 17:20', amount: 15000, method_ar: 'فودافون كاش', method_en: 'Vodafone Cash', receipt_ref: 'MQ-RCP-2026-0809', status: 'approved', reviewer_ar: 'سارة خالد', reviewer_en: 'Sarah Khaled' }
      ],
      attachments: [
        { id: 'ATT-010', name_ar: 'طلب إلغاء الحجز من العميلة سارة المنصوري.pdf', name_en: 'Customer_Cancellation_Request.pdf', size: '650 KB', date: '2026-11-01', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-011', name_ar: 'إشعار ارتداد التحويل من البنك المركزي المصري.pdf', name_en: 'Central_Bank_ACH_Reversal_Notice.pdf', size: '420 KB', date: '2026-11-03', type: 'application/pdf', uploaded_by_ar: 'حسابات ميقات', uploaded_by_en: 'Miqat Accounts' }
      ],
      refund_operations: [
        {
          id: 'REF-OP-501',
          date: '2026-11-02 10:00',
          amount: 92000,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي رسمي',
          method_en: 'Official Bank Wire',
          bank_name_ar: 'البنك التجاري الدولي CIB',
          bank_name_en: 'Commercial International Bank (CIB)',
          beneficiary_name_ar: 'سارة خالد المنصوري',
          beneficiary_name_en: 'Sarah Khaled El-Mansoury',
          account_iban: 'EG330002000100000009918237719', // Erroneous IBAN
          reference_no: 'TRX-REF-550119',
          status: 'failed',
          status_ar: 'عملية تحويل متعثرة (مرتدة من البنك)',
          status_en: 'Failed Transfer (ACH Reversal)',
          voucher_file: 'Central_Bank_ACH_Reversal_Notice.pdf',
          voucher_size: '420 KB',
          notes_ar: 'ارتدت الحوالة بسبب خطأ في رقم الآيبان البنكي أو عدم تطابق اسم المستفيد مع سجلات الفرع',
          notes_en: 'Wire bounced due to invalid IBAN or beneficiary name mismatch at destination branch'
        }
      ],
      corrective_actions: [],
      internal_notes: [
        { id: 'NOTE-CAN-5', author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-03 14:15', text_ar: 'تم التواصل مع العميلة لطلب كشف حساب بنكي رسمي أو شهادة آيبان مختومة لإعادة المحاولة بعد التصحيح.', text_en: 'Contacted customer requesting certified bank certificate with valid IBAN to initiate retry.' }
      ],
      activity_log: [
        { id: 'ACT-CAN-501', date: '2026-11-01 11:00', title_ar: 'استلام طلب الإلغاء', title_en: 'Cancellation Received', desc_ar: 'طلب إلغاء لظرف عائلي خاص.', desc_en: 'Cancellation submitted.', actor_ar: 'سارة خالد المنصوري', actor_en: 'Sarah Khaled El-Mansoury', type: 'creation' },
        { id: 'ACT-CAN-502', date: '2026-11-01 15:30', title_ar: 'اعتماد الإلغاء والمستحقات', title_en: 'Cancellation Approved', desc_ar: 'اعتماد إلغاء الحجز ومستحقات الاسترداد (٩٢,٠٠٠ ج.م).', desc_en: 'Cancellation approved for 92,000 EGP refund.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' },
        { id: 'ACT-CAN-503', date: '2026-11-02 10:00', title_ar: 'إرسال أمر التحويل البنكي', title_en: 'Wire Instruction Sent', desc_ar: 'إرسال تحويل ٩٢,٠٠٠ ج.م عبر بنك CIB بالمرجع: TRX-REF-550119.', desc_en: 'Wire dispatched via CIB, Ref: TRX-REF-550119.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_processing' },
        { id: 'ACT-CAN-504', date: '2026-11-03 14:15', title_ar: 'تعثر التحويل البنكي (ارتداد الحوالة)', title_en: 'Transfer Failed (ACH Reversal)', desc_ar: 'ورد إشعار رسمي من البنك المركزي بارتداد الحوالة لخطأ في بيانات الآيبان. يتطلب إجراءً تصحيحياً وإعادة محاولة.', desc_en: 'Central Bank ACH reversal notice received: Invalid IBAN. Requires corrective action and retry.', actor_ar: 'نظام المقاصة البنكية', actor_en: 'Bank Clearing Gateway', type: 'failure' }
      ]
    },

    {
      id: 'CAN-2026-006',
      booking_id: 'BK-2026-1051',
      customer_id: 'CUST-1007',
      customer_name_ar: 'خالد محمد النجار',
      customer_name_en: 'Khaled Mohamed El-Naggar',
      customer_phone: '01098452134',
      customer_whatsapp: '01098452134',
      customer_email: 'khaled.naggar@gmail.com',
      customer_national_id: '27712101401823',
      customer_governorate_ar: 'الشرقية',
      customer_governorate_en: 'Sharqia',
      company_id: 'COMP-101',
      company_name_ar: 'شركة طيبة لإدارة رحلات الحج والعمرة',
      company_name_en: 'Tayba Pilgrimage & Umrah Management',
      company_license: '1142',
      company_contact: {
        name_ar: 'مروان السعيد',
        name_en: 'Marwan El-Saeed',
        phone: '01011223344',
        whatsapp: '01011223344'
      },
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      travelers_count: 3,
      travelers: [
        { name_ar: 'خالد محمد النجار', name_en: 'Khaled Mohamed El-Naggar', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A27712101', birth_date: '1977-12-10' },
        { name_ar: 'نجلاء إبراهيم خضر', name_en: 'Naglaa Ibrahim Khedr', relation_ar: 'الزوجة', relation_en: 'Spouse', passport: 'A27712102', birth_date: '1981-06-22' },
        { name_ar: 'عمر خالد النجار', name_en: 'Omar Khaled El-Naggar', relation_ar: 'الابن', relation_en: 'Son', passport: 'A27712103', birth_date: '2008-03-15' }
      ],
      source: 'customer',
      cancellation_status: 'cancelled',
      refund_status: 'processing', // Retried after corrective action!
      created_at: '2026-10-30 15:30',
      timestamp_iso: '2026-10-30T15:30:00',
      updated_at: '2026-11-04 11:20',
      cancellation_reason_ar: 'تعذر الحصول على إجازة عمل رسمية للمعتمر ومرافقيه خلال فترة البرنامج.',
      cancellation_reason_en: 'Unable to secure official leave approvals for pilgrim and family during program dates.',
      cancellation_notes_ar: 'ارتد التحويل الأول لخطأ في رقم الحساب، وتم استلام شهادة بنكية رسمية وتصحيح الآيبان وإعادة التحويل.',
      cancellation_notes_en: 'Initial wire bounced; received certified bank certificate, corrected IBAN, and re-dispatched wire.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 135000,
        total_paid_records: 135000,
        approved_paid: 135000,
        pending_paid: 0,
        refund_due: 135000,
        executed_refund: 0,
        remaining_refund: 135000
      },
      payments_breakdown: [
        { id: 'PAY-BK-601', date: '2026-10-18 16:10', amount: 135000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-9901', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' }
      ],
      attachments: [
        { id: 'ATT-012', name_ar: 'طلب إلغاء حجز موقع من خالد النجار.pdf', name_en: 'Cancellation_Request_Letter.pdf', size: '720 KB', date: '2026-10-30', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-013', name_ar: 'شهادة حساب بنكي مصدق بالآيبان من بنك مصر.pdf', name_en: 'Certified_IBAN_Certificate_Banque_Misr.pdf', size: '890 KB', date: '2026-11-03', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' }
      ],
      refund_operations: [
        {
          id: 'REF-OP-602',
          date: '2026-11-04 11:20',
          amount: 135000,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي سريع (إعادة محاولة)',
          method_en: 'Express Bank Wire (Retry)',
          bank_name_ar: 'بنك مصر',
          bank_name_en: 'Banque Misr',
          beneficiary_name_ar: 'خالد محمد النجار',
          beneficiary_name_en: 'Khaled Mohamed El-Naggar',
          account_iban: 'EG120002000100000009948211029', // Corrected IBAN
          reference_no: 'RETRY-TRX-884102',
          status: 'processing',
          status_ar: 'قيد إعادة المحاولة والمعالجة البنكية',
          status_en: 'Retrying & Processing',
          voucher_file: 'Retry_Bank_Transfer_Slip.pdf',
          voucher_size: '512 KB',
          notes_ar: 'إعادة إرسال أمر التحويل بنجاح بالآيبان المصحح للعميل',
          notes_en: 'Transfer re-dispatched with customer’s validated corrected IBAN'
        },
        {
          id: 'REF-OP-601',
          date: '2026-11-01 10:00',
          amount: 135000,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي رسمي',
          method_en: 'Official Bank Wire',
          bank_name_ar: 'بنك مصر',
          bank_name_en: 'Banque Misr',
          beneficiary_name_ar: 'خالد محمد النجار',
          beneficiary_name_en: 'Khaled Mohamed El-Naggar',
          account_iban: 'EG120002000100000009948211000', // Faulty
          reference_no: 'TRX-REF-109283',
          status: 'failed',
          status_ar: 'عملية تحويل متعثرة (مرتدة من البنك)',
          status_en: 'Failed Transfer (ACH Reversal)',
          voucher_file: 'Initial_Failed_Transfer.pdf',
          voucher_size: '410 KB',
          notes_ar: 'ارتدت الحوالة لخطأ في الأرقام الأخيرة لرقم الحساب',
          notes_en: 'Wire bounced due to last digits typo in account number'
        }
      ],
      corrective_actions: [
        {
          id: 'CORR-001',
          date: '2026-11-03 16:45',
          type: 'iban_update',
          type_ar: 'تصحيح رقم الحساب والآيبان البنكي',
          type_en: 'Bank Account & IBAN Correction',
          desc_ar: 'تم التحقق من شهادة الحساب البنكي الرسمية المعتمدة وتصحيح رقم الآيبان المعتمد للعميل ليصبح EG120002000100000009948211029',
          desc_en: 'Verified official bank certificate and updated customer IBAN to EG120002000100000009948211029',
          actor_ar: 'أحمد صبري',
          actor_en: 'Ahmed Sabry'
        }
      ],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-601', date: '2026-10-30 15:30', title_ar: 'استلام طلب الإلغاء', title_en: 'Cancellation Received', desc_ar: 'طلب إلغاء الحجز لتعذر الإجازة.', desc_en: 'Cancellation request received.', actor_ar: 'خالد محمد النجار', actor_en: 'Khaled Mohamed El-Naggar', type: 'creation' },
        { id: 'ACT-CAN-602', date: '2026-10-31 11:00', title_ar: 'اعتماد الإلغاء', title_en: 'Cancellation Approved', desc_ar: 'اعتماد إلغاء الحجز ومبلغ الاسترداد (١٣٥,٠٠٠ ج.م).', desc_en: 'Approved for 135,000 EGP refund.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' },
        { id: 'ACT-CAN-603', date: '2026-11-01 10:00', title_ar: 'إرسال الحوالة الأولى', title_en: 'First Wire Dispatched', desc_ar: 'تحويل ١٣٥,٠٠٠ ج.م عبر بنك مصر بالمرجع: TRX-REF-109283.', desc_en: 'Wire sent via Banque Misr, Ref: TRX-REF-109283.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_processing' },
        { id: 'ACT-CAN-604', date: '2026-11-02 12:00', title_ar: 'ارتداد الحوالة وتوثيق التعثر', title_en: 'Wire Bounced / Failed', desc_ar: 'إشعار ارتداد الحوالة لخطأ في رقم الحساب.', desc_en: 'Reversal notice received for account typo.', actor_ar: 'نظام المقاصة البنكية', actor_en: 'Bank Clearing Gateway', type: 'failure' },
        { id: 'ACT-CAN-605', date: '2026-11-03 16:45', title_ar: 'تسجيل إجراء تصحيحي نظامي', title_en: 'Corrective Action Recorded', desc_ar: 'تم التحقق من شهادة الآيبان الرسمية من بنك مصر وتحديث بيانات التحويل.', desc_en: 'Verified Banque Misr IBAN certificate and updated record.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'corrective_action' },
        { id: 'ACT-CAN-606', date: '2026-11-04 11:20', title_ar: 'إعادة محاولة التحويل بنجاح', title_en: 'Transfer Retry Executed', desc_ar: 'إعادة تنفيذ تحويل ١٣٥,٠٠٠ ج.م بالمرجع الجديد: RETRY-TRX-884102.', desc_en: 'Transfer re-dispatched with Ref: RETRY-TRX-884102.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'retry_initiated' }
      ]
    },

    // --- Archive Scenarios: Cancelled + Refund Completed & Confirmed -> Belongs to Previous Cancelled Bookings Tab ---
    {
      id: 'CAN-2026-007',
      booking_id: 'BK-2026-1042',
      customer_id: 'CUST-1010',
      customer_name_ar: 'حسن علي منصور',
      customer_name_en: 'Hassan Ali Mansour',
      customer_phone: '01155443322',
      customer_whatsapp: '01155443322',
      customer_email: 'hassan.mansour@gmail.com',
      customer_national_id: '27509121402918',
      customer_governorate_ar: 'الجيزة',
      customer_governorate_en: 'Giza',
      company_id: 'COMP-103',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al Dorra Travel',
      company_license: '1845',
      company_contact: {
        name_ar: 'هاني سراج',
        name_en: 'Hani Serag',
        phone: '01223344556',
        whatsapp: '01223344556'
      },
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      travelers_count: 1,
      travelers: [
        { name_ar: 'حسن علي منصور', name_en: 'Hassan Ali Mansour', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A27509121', birth_date: '1975-09-12' }
      ],
      source: 'company',
      cancellation_status: 'cancelled',
      refund_status: 'completed', // SETTLED & ARCHIVED!
      created_at: '2026-10-22 09:00',
      timestamp_iso: '2026-10-22T09:00:00',
      updated_at: '2026-10-26 13:40',
      cancellation_reason_ar: 'إعادة جدولة الحصة العددية وتصفية الباقة بالكامل من قبل شركة السياحة.',
      cancellation_reason_en: 'Quota reallocation and full package cancellation by tourism company.',
      cancellation_notes_ar: 'تم اعتماد الإلغاء وتنفيذ الاسترداد المالي كاملاً ومطابقة كشف الحساب ونقل الحجز للأرشيف.',
      cancellation_notes_en: 'Cancellation approved, full refund executed, bank reconciled, record moved to archive.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 58000,
        total_paid_records: 58000,
        approved_paid: 58000,
        pending_paid: 0,
        refund_due: 58000,
        executed_refund: 58000,
        remaining_refund: 0
      },
      payments_breakdown: [
        { id: 'PAY-BK-701', date: '2026-10-15 11:00', amount: 58000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-4401', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' }
      ],
      attachments: [
        { id: 'ATT-014', name_ar: 'خطاب الإلغاء الرسمي المعتمد من شركة الدرة.pdf', name_en: 'Official_Company_Cancellation_Letter.pdf', size: '750 KB', date: '2026-10-22', type: 'application/pdf', uploaded_by_ar: 'شركة السياحة', uploaded_by_en: 'Tourism Company' },
        { id: 'ATT-015', name_ar: 'إيصال التحويل البنكي النهائي المعتمد بنك CIB.pdf', name_en: 'Final_Refund_Receipt_CIB.pdf', size: '820 KB', date: '2026-10-26', type: 'application/pdf', uploaded_by_ar: 'حسابات ميقات', uploaded_by_en: 'Miqat Accounts' }
      ],
      refund_operations: [
        {
          id: 'REF-OP-701',
          date: '2026-10-24 10:00',
          amount: 58000,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي رسمي',
          method_en: 'Official Bank Wire',
          bank_name_ar: 'البنك التجاري الدولي CIB',
          bank_name_en: 'Commercial International Bank (CIB)',
          beneficiary_name_ar: 'حسن علي منصور',
          beneficiary_name_en: 'Hassan Ali Mansour',
          account_iban: 'EG450002000100000007812903411',
          reference_no: 'TRX-REF-771890',
          status: 'completed',
          status_ar: 'مكتمل ومؤكد بنكياً',
          status_en: 'Completed & Confirmed',
          voucher_file: 'Final_Refund_Receipt_CIB.pdf',
          voucher_size: '820 KB',
          confirmed_at: '2026-10-26 13:40',
          notes_ar: 'تم تأكيد وصول التحويل لحساب المستفيد ومطابقة كشف الحساب وإقفال الملف بنجاح',
          notes_en: 'Confirmed wire credit to beneficiary, reconciled bank statement, successfully closed claim'
        }
      ],
      corrective_actions: [],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-701', date: '2026-10-22 09:00', title_ar: 'استلام طلب الإلغاء', title_en: 'Cancellation Received', desc_ar: 'طلب إلغاء من شركة الدرة.', desc_en: 'Agency cancellation received.', actor_ar: 'هاني سراج', actor_en: 'Hani Serag', type: 'creation' },
        { id: 'ACT-CAN-702', date: '2026-10-22 14:00', title_ar: 'اعتماد الإلغاء', title_en: 'Cancellation Approved', desc_ar: 'اعتماد إلغاء الحجز ومبلغ ٥٨,٠٠٠ ج.م.', desc_en: 'Approved cancellation for 58,000 EGP.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' },
        { id: 'ACT-CAN-703', date: '2026-10-24 10:00', title_ar: 'تنفيذ التحويل البنكي', title_en: 'Refund Wire Executed', desc_ar: 'تحويل مبلغ ٥٨,٠٠٠ ج.م عبر بنك CIB بالمرجع: TRX-REF-771890.', desc_en: 'Wired 58,000 EGP via CIB, Ref: TRX-REF-771890.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_processing' },
        { id: 'ACT-CAN-704', date: '2026-10-26 13:40', title_ar: 'تأكيد اكتمال الاسترداد والتسوية النهائية', title_en: 'Refund Settlement Confirmed & Completed', desc_ar: 'تم تأكيد وصول الحوالة ومطابقة كشف الحساب البنكي وإقفال المطالبة وأرشفتها.', desc_en: 'Confirmed funds credit, bank statement reconciled, claim closed and archived.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_completed' }
      ]
    },

    {
      id: 'CAN-2026-008',
      booking_id: 'BK-2026-1039',
      customer_id: 'CUST-1011',
      customer_name_ar: 'نادية محمد السيد',
      customer_name_en: 'Nadia Mohamed El-Sayed',
      customer_phone: '01066778899',
      customer_whatsapp: '01066778899',
      customer_email: 'nadia.elsayed@gmail.com',
      customer_national_id: '28111240101924',
      customer_governorate_ar: 'القاهرة',
      customer_governorate_en: 'Cairo',
      company_id: 'COMP-104',
      company_name_ar: 'شركة الصفا والمروة',
      company_name_en: 'Al Safa & Marwa Travel',
      company_license: '1630',
      company_contact: {
        name_ar: 'حاتم الشوربجي',
        name_en: 'Hatem El-Shorbagy',
        phone: '01066554433',
        whatsapp: '01066554433'
      },
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      travelers_count: 2,
      travelers: [
        { name_ar: 'نادية محمد السيد', name_en: 'Nadia Mohamed El-Sayed', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A28111240', birth_date: '1981-11-24' },
        { name_ar: 'سلمى أحمد فؤاد', name_en: 'Salma Ahmed Fouad', relation_ar: 'الابنة', relation_en: 'Daughter', passport: 'A28111241', birth_date: '2005-08-14' }
      ],
      source: 'customer',
      cancellation_status: 'cancelled',
      refund_status: 'completed', // SETTLED & ARCHIVED!
      created_at: '2026-10-18 11:15',
      timestamp_iso: '2026-10-18T11:15:00',
      updated_at: '2026-10-23 16:00',
      cancellation_reason_ar: 'تعارض مواعيد الامتحانات الجامعية للمرافقة مع موعد انطلاق الرحلة.',
      cancellation_reason_en: 'University final exam schedule clash with trip departure schedule.',
      cancellation_notes_ar: 'تم التحقق من جدول الامتحانات واعتماد الإلغاء ورد المبلغ بالكامل لحساب العميلة.',
      cancellation_notes_en: 'Verified exam schedule, approved cancellation, fully refunded to customer account.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 85000,
        total_paid_records: 85000,
        approved_paid: 85000,
        pending_paid: 0,
        refund_due: 85000,
        executed_refund: 85000,
        remaining_refund: 0
      },
      payments_breakdown: [
        { id: 'PAY-BK-801', date: '2026-10-10 14:00', amount: 85000, method_ar: 'إنستاباي IPN', method_en: 'InstaPay IPN', receipt_ref: 'IPN-2026-8819', status: 'approved', reviewer_ar: 'سارة خالد', reviewer_en: 'Sarah Khaled' }
      ],
      attachments: [
        { id: 'ATT-016', name_ar: 'إفادة جدول الامتحانات من جامعة القاهرة.pdf', name_en: 'University_Exam_Schedule.pdf', size: '540 KB', date: '2026-10-18', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-017', name_ar: 'إشعار تحويل استرداد إنستاباي مسدد بالكامل.pdf', name_en: 'InstaPay_Refund_Receipt.pdf', size: '480 KB', date: '2026-10-23', type: 'application/pdf', uploaded_by_ar: 'حسابات ميقات', uploaded_by_en: 'Miqat Accounts' }
      ],
      refund_operations: [
        {
          id: 'REF-OP-801',
          date: '2026-10-21 11:30',
          amount: 85000,
          method: 'instapay',
          method_ar: 'شبكة المدفوعات اللحظية (إنستاباي)',
          method_en: 'InstaPay IPN Network',
          bank_name_ar: 'البنك الأهلي المصري',
          bank_name_en: 'National Bank of Egypt (NBE)',
          beneficiary_name_ar: 'نادية محمد السيد',
          beneficiary_name_en: 'Nadia Mohamed El-Sayed',
          account_iban: 'nadia.elsayed@instapay',
          reference_no: 'IPN-REF-884192',
          status: 'completed',
          status_ar: 'مكتمل ومؤكد بنكياً',
          status_en: 'Completed & Confirmed',
          voucher_file: 'InstaPay_Refund_Receipt.pdf',
          voucher_size: '480 KB',
          confirmed_at: '2026-10-23 16:00',
          notes_ar: 'تم التحويل الفوري بنجاح وتأكيد الاستلام مع العميلة بالرسالة النصية',
          notes_en: 'Instant transfer confirmed by recipient SMS receipt token'
        }
      ],
      corrective_actions: [],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-801', date: '2026-10-18 11:15', title_ar: 'استلام طلب الإلغاء', title_en: 'Cancellation Received', desc_ar: 'طلب إلغاء بسبب الامتحانات الجامعية.', desc_en: 'Cancellation requested due to exams.', actor_ar: 'نادية محمد السيد', actor_en: 'Nadia Mohamed El-Sayed', type: 'creation' },
        { id: 'ACT-CAN-802', date: '2026-10-19 12:00', title_ar: 'اعتماد الإلغاء', title_en: 'Cancellation Approved', desc_ar: 'اعتماد إلغاء الحجز ومبلغ ٨٥,٠٠٠ ج.م.', desc_en: 'Approved cancellation for 85,000 EGP.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' },
        { id: 'ACT-CAN-803', date: '2026-10-21 11:30', title_ar: 'تنفيذ الاسترداد عبر إنستاباي', title_en: 'Refund Executed via InstaPay', desc_ar: 'تحويل ٨٥,٠٠٠ ج.م عبر إنستاباي بالمرجع: IPN-REF-884192.', desc_en: 'Transferred 85,000 EGP via InstaPay, Ref: IPN-REF-884192.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_processing' },
        { id: 'ACT-CAN-804', date: '2026-10-23 16:00', title_ar: 'تأكيد اكتمال الاسترداد والتسوية النهائية', title_en: 'Refund Settlement Confirmed & Completed', desc_ar: 'تأكيد التسوية المكتملة وأرشفة السجل.', desc_en: 'Settlement confirmed, record archived.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_completed' }
      ]
    },

    // --- Rejected Scenarios: Cancellation Rejected (Mandatory Reason Documented) & Refund Blocked ---
    {
      id: 'CAN-2026-009',
      booking_id: 'BK-2026-1053',
      customer_id: 'CUST-1012',
      customer_name_ar: 'ياسر عبد الرحمن عثمان',
      customer_name_en: 'Yasser Abdel-Rahman Osman',
      customer_phone: '01277889900',
      customer_whatsapp: '01277889900',
      customer_email: 'yasser.osman@hotmail.com',
      customer_national_id: '27904152101948',
      customer_governorate_ar: 'الفيوم',
      customer_governorate_en: 'Fayoum',
      company_id: 'COMP-101',
      company_name_ar: 'شركة طيبة لإدارة رحلات الحج والعمرة',
      company_name_en: 'Tayba Pilgrimage & Umrah Management',
      company_license: '1142',
      company_contact: {
        name_ar: 'مروان السعيد',
        name_en: 'Marwan El-Saeed',
        phone: '01011223344',
        whatsapp: '01011223344'
      },
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      travelers_count: 2,
      travelers: [
        { name_ar: 'ياسر عبد الرحمن عثمان', name_en: 'Yasser Abdel-Rahman Osman', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A27904152', birth_date: '1979-04-15' },
        { name_ar: 'هناء رجب السويفي', name_en: 'Hanaa Ragab El-Sewefy', relation_ar: 'الزوجة', relation_en: 'Spouse', passport: 'A27904153', birth_date: '1983-10-09' }
      ],
      source: 'customer',
      cancellation_status: 'rejected', // REJECTED!
      refund_status: 'none', // Refund blocked!
      created_at: '2026-11-02 12:40',
      timestamp_iso: '2026-11-02T12:40:00',
      updated_at: '2026-11-03 15:10',
      cancellation_reason_ar: 'طلب استرداد المبالغ بعد إصدار التأشيرات وتثبيت تذاكر الطيران غير القابلة للاسترداد.',
      cancellation_reason_en: 'Requested refund after visa issuance and confirmed non-refundable flight ticketing.',
      cancellation_notes_ar: 'طلب العميل إلغاء الحجز قبل ٤٨ ساعة فقط من موعد الرحلة بدون عذر طبي أو قهري معتمد.',
      cancellation_notes_en: 'Customer requested cancellation only 48 hours prior to trip without certified medical emergency.',
      rejection_reason_ar: 'تم رفض طلب الإلغاء لمخالفته الصريحة لبنود عقد الوساطة المعتمد: تم بالفعل إصدار التأشيرات وحجز تذاكر الطيران غير القابلة للاسترداد وتجاوز المهلة النظامية للإلغاء المجاني. الحجز يظل سارياً وقائماً.',
      rejection_reason_en: 'Cancellation rejected: Contract violation — non-refundable flight tickets and visas already issued; statutory cancellation window expired. Booking remains active.',
      financials: {
        booking_total: 62000,
        total_paid_records: 62000,
        approved_paid: 62000,
        pending_paid: 0,
        refund_due: 0, // Blocked because rejected!
        executed_refund: 0,
        remaining_refund: 0
      },
      payments_breakdown: [
        { id: 'PAY-BK-901', date: '2026-10-25 15:00', amount: 62000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-9102', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' }
      ],
      attachments: [
        { id: 'ATT-018', name_ar: 'طلب الإلغاء المتأخر المقدم من العميل.pdf', name_en: 'Late_Cancellation_Request.pdf', size: '510 KB', date: '2026-11-02', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-019', name_ar: 'تأشيرات العمرة الصادرة وتذاكر الطيران المؤكدة غير القابلة للاسترداد.pdf', name_en: 'Issued_Visas_And_Nonrefundable_Tickets.pdf', size: '1.6 MB', date: '2026-11-03', type: 'application/pdf', uploaded_by_ar: 'شركة السياحة', uploaded_by_en: 'Tourism Company' }
      ],
      refund_operations: [],
      corrective_actions: [],
      internal_notes: [
        { id: 'NOTE-CAN-9', author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-03 15:10', text_ar: 'تم رفض الإلغاء بموافقة الإدارة القانونية لصدور التذاكر والتأشيرات وتجاوز المهلة المحددة، وتم إبلاغ العميل هاتفياً.', text_en: 'Rejected with legal approval due to ticket issuance and window expiry; customer notified.' }
      ],
      activity_log: [
        { id: 'ACT-CAN-901', date: '2026-11-02 12:40', title_ar: 'استلام طلب الإلغاء', title_en: 'Cancellation Received', desc_ar: 'طلب إلغاء متأخر مقدم قبل الرحلة بيومين.', desc_en: 'Late cancellation submitted 2 days before trip.', actor_ar: 'ياسر عبد الرحمن عثمان', actor_en: 'Yasser Abdel-Rahman Osman', type: 'creation' },
        { id: 'ACT-CAN-902', date: '2026-11-03 15:10', title_ar: 'رفض طلب الإلغاء وتثبيت الحجز', title_en: 'Cancellation Request Rejected', desc_ar: 'تم رفض طلب الإلغاء مع توثيق السبب الإلزامي: مخالفة بنود العقد وصدور التذاكر غير القابلة للاسترداد. تم تثبيت الحجز وحجب الاسترداد.', desc_en: 'Cancellation rejected with mandatory reason: Issued non-refundable tickets. Booking retained, refund blocked.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'rejection' }
      ]
    },

    {
      id: 'CAN-2026-010',
      booking_id: 'BK-2026-1054',
      customer_id: 'CUST-1013',
      customer_name_ar: 'سميرة محمود الكفراوي',
      customer_name_en: 'Samira Mahmoud El-Kafrawy',
      customer_phone: '01022334455',
      customer_whatsapp: '01022334455',
      customer_email: 'samira.kafrawy@yahoo.com',
      customer_national_id: '26806121601923',
      customer_governorate_ar: 'الغربية',
      customer_governorate_en: 'Gharbia',
      company_id: 'COMP-102',
      company_name_ar: 'شركة هداية المعتمد للسياحة',
      company_name_en: 'Hedaya Travel',
      company_license: '1902',
      company_contact: {
        name_ar: 'مدحت عزمي',
        name_en: 'Medhat Azmy',
        phone: '01122339988',
        whatsapp: '01122339988'
      },
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      travelers_count: 2,
      travelers: [
        { name_ar: 'سميرة محمود الكفراوي', name_en: 'Samira Mahmoud El-Kafrawy', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A26806121', birth_date: '1968-06-12' },
        { name_ar: 'هدى مصطفى رضوان', name_en: 'Hoda Moustafa Radwan', relation_ar: 'الأخت', relation_en: 'Sister', passport: 'A26806122', birth_date: '1972-01-20' }
      ],
      source: 'company',
      cancellation_status: 'rejected', // REJECTED!
      refund_status: 'none', // Refund blocked!
      created_at: '2026-11-01 14:00',
      timestamp_iso: '2026-11-01T14:00:00',
      updated_at: '2026-11-02 10:30',
      cancellation_reason_ar: 'طلب الشركة إلغاء حجز مؤكد ومسدد بالكامل لرغبتها في إعادة بيع الغرفة بسعر أعلى في الموسم.',
      cancellation_reason_en: 'Agency requested cancellation of confirmed paid booking to resell room at higher seasonal rate.',
      cancellation_notes_ar: 'رفضت إدارة الحسابات إلغاء الحجز لعدم موافقة العميل ولحماية حقوق المعتمر النظامية.',
      cancellation_notes_en: 'Accounts rejected cancellation to protect customer rights; no customer consent provided.',
      rejection_reason_ar: 'رُفض طلب الإلغاء لعدم إرفاق موافقة خطية موثقة من المعتمر على الإلغاء. وفقاً لضوابط حماية المستهلك المعتمدة بمنصة ميقات، لا يجوز للشركة الشريكة إلغاء حجز مؤكد ومسدد دون موافقة كتابية صريحة.',
      rejection_reason_en: 'Rejected: No documented written consent from pilgrim. Per Miqat consumer protection policy, agencies cannot cancel confirmed paid bookings unilaterally.',
      financials: {
        booking_total: 78000,
        total_paid_records: 78000,
        approved_paid: 78000,
        pending_paid: 0,
        refund_due: 0,
        executed_refund: 0,
        remaining_refund: 0
      },
      payments_breakdown: [
        { id: 'PAY-BK-1001', date: '2026-10-24 16:00', amount: 78000, method_ar: 'إنستاباي', method_en: 'InstaPay', receipt_ref: 'IPN-2026-7714', status: 'approved', reviewer_ar: 'سارة خالد', reviewer_en: 'Sarah Khaled' }
      ],
      attachments: [
        { id: 'ATT-020', name_ar: 'طلب الإلغاء الأحادي المقدم من شركة هداية للسياحة.pdf', name_en: 'Unilateral_Agency_Cancellation_Request.pdf', size: '490 KB', date: '2026-11-01', type: 'application/pdf', uploaded_by_ar: 'شركة السياحة', uploaded_by_en: 'Tourism Company' }
      ],
      refund_operations: [],
      corrective_actions: [],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-1001', date: '2026-11-01 14:00', title_ar: 'استلام طلب الإلغاء الأحادي من الشركة', title_en: 'Unilateral Agency Request Received', desc_ar: 'طلب إلغاء مقدم من شركة هداية.', desc_en: 'Agency request submitted.', actor_ar: 'مدحت عزمي', actor_en: 'Medhat Azmy', type: 'creation' },
        { id: 'ACT-CAN-1002', date: '2026-11-02 10:30', title_ar: 'رفض طلب الإلغاء وحماية حجز المعتمر', title_en: 'Cancellation Rejected / Customer Protected', desc_ar: 'تم رفض طلب الشركة لعدم وجود موافقة خطية من المعتمر. الحجز مستمر وقائم.', desc_en: 'Rejected due to lack of customer consent. Booking remains active and confirmed.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'rejection' }
      ]
    },

    {
      id: 'CAN-2026-011',
      booking_id: 'BK-2026-1055',
      customer_id: 'CUST-1002',
      customer_name_ar: 'عمر عبد العزيز الشريف',
      customer_name_en: 'Omar Abdelaziz El-Sherif',
      customer_phone: '01285536230',
      customer_whatsapp: '01285536230',
      customer_email: 'omar.aziz@gmail.com',
      customer_national_id: '28409150102914',
      customer_governorate_ar: 'القاهرة',
      customer_governorate_en: 'Cairo',
      company_id: 'COMP-101',
      company_name_ar: 'شركة طيبة لإدارة رحلات الحج والعمرة',
      company_name_en: 'Tayba Pilgrimage & Umrah Management',
      company_license: '1142',
      company_contact: {
        name_ar: 'مروان السعيد',
        name_en: 'Marwan El-Saeed',
        phone: '01011223344',
        whatsapp: '01011223344'
      },
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      travelers_count: 2,
      travelers: [
        { name_ar: 'عمر عبد العزيز الشريف', name_en: 'Omar Abdelaziz El-Sherif', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A28409150', birth_date: '1984-09-15' },
        { name_ar: 'مها طارق العوضي', name_en: 'Maha Tarek El-Awady', relation_ar: 'الزوجة', relation_en: 'Spouse', passport: 'A28409151', birth_date: '1988-12-04' }
      ],
      source: 'customer',
      cancellation_status: 'under_review',
      refund_status: 'pending',
      created_at: '2026-11-05 15:45',
      timestamp_iso: '2026-11-05T15:45:00',
      updated_at: '2026-11-05 16:30',
      cancellation_reason_ar: 'انتداب عمل دولي مفاجئ للمعتمر خارج جمهورية مصر العربية قبل موعد السفر المجدول.',
      cancellation_reason_en: 'Sudden international work assignment outside Egypt prior to scheduled travel date.',
      cancellation_notes_ar: 'الحجز عالي القيمة (VIP). تم سداد ١٠٠ ألف ج.م معتمدة، ويوجد إيصال تحويل بـ ٦٥ ألف ج.م بانتظار المقاصة البنكية ومستثنى من الاسترداد.',
      cancellation_notes_en: 'VIP booking. 100k EGP approved paid; 65k EGP transfer slip pending bank clearance and excluded from refund.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 165000,
        total_paid_records: 165000,
        approved_paid: 100000, // Strictly approved payments only!
        pending_paid: 65000, // Pending review -> excluded!
        refund_due: 100000, // Refund Due = Approved Paid ONLY
        executed_refund: 0,
        remaining_refund: 100000
      },
      payments_breakdown: [
        { id: 'PAY-BK-1101', date: '2026-10-27 12:00', amount: 100000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-9988', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' },
        { id: 'PAY-BK-1102', date: '2026-11-04 15:00', amount: 65000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-PEND-1029', status: 'pending_review', reviewer_ar: '—', reviewer_en: '—' }
      ],
      attachments: [
        { id: 'ATT-021', name_ar: 'خطاب الانتداب والعمل الخارجي المعتمد من الشركة متعددة الجنسيات.pdf', name_en: 'International_Assignment_Letter.pdf', size: '1.2 MB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-022', name_ar: 'صورة جواز السفر وتأشيرة العمل الدولية.pdf', name_en: 'Passport_Copy_And_Work_Visa.pdf', size: '750 KB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-023', name_ar: 'شهادة الآيبان البنكي الصادرة من بنك HSBC مصر.pdf', name_en: 'Bank_IBAN_Certificate_HSBC.pdf', size: '620 KB', date: '2026-11-05', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' }
      ],
      refund_operations: [],
      corrective_actions: [],
      internal_notes: [
        { id: 'NOTE-CAN-11', author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-05 16:30', text_ar: 'تأكيد الالتزام بالقاعدة المالية: تم احتساب المستحق للاسترداد (١٠٠ ألف ج.م) فقط. التحويل الإضافي (٦٥ ألف ج.م) لم يظهر بكشف حساب البنك المركزي حتى تاريخه ولن يتم اعتماده قبل وصول إشعار الإيداع الرسمي.', text_en: 'Strict financial rule enforced: Refund due calculated at approved 100k EGP only. Pending 65k excluded.' }
      ],
      activity_log: [
        { id: 'ACT-CAN-1101', date: '2026-11-05 15:45', title_ar: 'استلام طلب الإلغاء للبرنامج الفاخر', title_en: 'VIP Cancellation Request Received', desc_ar: 'طلب إلغاء لعمرة ٥ نجوم متميزة مرفقاً بخطاب الانتداب الدولي وشهادة الآيبان.', desc_en: '5-Star VIP Umrah cancellation submitted with work assignment proof.', actor_ar: 'عمر عبد العزيز الشريف', actor_en: 'Omar Abdelaziz El-Sherif', type: 'creation' },
        { id: 'ACT-CAN-1102', date: '2026-11-05 16:30', title_ar: 'تدقيق المدفوعات واستبعاد المعلق', title_en: 'Payment Audit & Pending Exclusion', desc_ar: 'فحص الحوالات: تم اعتماد ١٠٠ ألف واستبعاد ٦٥ ألف معلقة من رصيد الاسترداد.', desc_en: 'Audited payments: 100k approved, 65k pending excluded from refund due.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'audit' }
      ]
    },

    {
      id: 'CAN-2026-012',
      booking_id: 'BK-2026-1036',
      customer_id: 'CUST-1014',
      customer_name_ar: 'كمال سيد بدوي',
      customer_name_en: 'Kamal Sayed Badawi',
      customer_phone: '01133221100',
      customer_whatsapp: '01133221100',
      customer_email: 'kamal.badawi@gmail.com',
      customer_national_id: '27003182201948',
      customer_governorate_ar: 'بني سويف',
      customer_governorate_en: 'Beni Suef',
      company_id: 'COMP-102',
      company_name_ar: 'شركة الهدى للسياحة والخدمات الدينية',
      company_name_en: 'Al-Huda Religious Travel & Tourism',
      company_license: '2091',
      company_contact: {
        name_ar: 'أشرف القاضي',
        name_en: 'Ashraf El-Kady',
        phone: '01198765432',
        whatsapp: '01198765432'
      },
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      travelers_count: 1,
      travelers: [
        { name_ar: 'كمال سيد بدوي', name_en: 'Kamal Sayed Badawi', relation_ar: 'المعتمر الرئيسي', relation_en: 'Lead Pilgrim', passport: 'A27003182', birth_date: '1970-03-18' }
      ],
      source: 'customer',
      cancellation_status: 'cancelled',
      refund_status: 'completed', // SETTLED & ARCHIVED!
      created_at: '2026-10-15 08:30',
      timestamp_iso: '2026-10-15T08:30:00',
      updated_at: '2026-10-19 14:00',
      cancellation_reason_ar: 'تعذر إصدار التأشيرة الإلكترونية لعدم استيفاء الشروط النظامية من الجهات المصدرة.',
      cancellation_reason_en: 'E-visa issuance denied by issuing authorities due to regulatory requirements.',
      cancellation_notes_ar: 'تم التحقق من إشعار رفض التأشيرة واعتماد الإلغاء الكامل ورد المبلغ لحساب العميل وإقفال السجل.',
      cancellation_notes_en: 'Verified visa denial notice, approved cancellation, fully refunded and archived.',
      rejection_reason_ar: null,
      rejection_reason_en: null,
      financials: {
        booking_total: 49000,
        total_paid_records: 49000,
        approved_paid: 49000,
        pending_paid: 0,
        refund_due: 49000,
        executed_refund: 49000,
        remaining_refund: 0
      },
      payments_breakdown: [
        { id: 'PAY-BK-1201', date: '2026-10-10 09:00', amount: 49000, method_ar: 'تحويل بنكي', method_en: 'Bank Wire', receipt_ref: 'BNK-TX-3310', status: 'approved', reviewer_ar: 'أحمد صبري', reviewer_en: 'Ahmed Sabry' }
      ],
      attachments: [
        { id: 'ATT-024', name_ar: 'إشعار تعذر إصدار التأشيرة الصادر من بوابة التأشيرات.pdf', name_en: 'Visa_System_Denial_Notice.pdf', size: '580 KB', date: '2026-10-15', type: 'application/pdf', uploaded_by_ar: 'العميل', uploaded_by_en: 'Customer' },
        { id: 'ATT-025', name_ar: 'إيصال التحويل البنكي للاسترداد من البنك الأهلي.pdf', name_en: 'NBE_Refund_Transfer_Receipt.pdf', size: '710 KB', date: '2026-10-19', type: 'application/pdf', uploaded_by_ar: 'حسابات ميقات', uploaded_by_en: 'Miqat Accounts' }
      ],
      refund_operations: [
        {
          id: 'REF-OP-1201',
          date: '2026-10-18 10:30',
          amount: 49000,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي رسمي',
          method_en: 'Official Bank Wire',
          bank_name_ar: 'البنك الأهلي المصري',
          bank_name_en: 'National Bank of Egypt (NBE)',
          beneficiary_name_ar: 'كمال سيد بدوي',
          beneficiary_name_en: 'Kamal Sayed Badawi',
          account_iban: 'EG900002000100000005518293019',
          reference_no: 'TRX-REF-331980',
          status: 'completed',
          status_ar: 'مكتمل ومؤكد بنكياً',
          status_en: 'Completed & Confirmed',
          voucher_file: 'NBE_Refund_Transfer_Receipt.pdf',
          voucher_size: '710 KB',
          confirmed_at: '2026-10-19 14:00',
          notes_ar: 'تم تأكيد الإيداع بحساب العميل وإقفال المطالبة المالية بنجاح',
          notes_en: 'Deposit confirmed in customer account and claim closed successfully'
        }
      ],
      corrective_actions: [],
      internal_notes: [],
      activity_log: [
        { id: 'ACT-CAN-1201', date: '2026-10-15 08:30', title_ar: 'استلام طلب الإلغاء لتعذر التأشيرة', title_en: 'Cancellation Received (Visa Denied)', desc_ar: 'طلب إلغاء لعدم صدور التأشيرة.', desc_en: 'Cancellation request received.', actor_ar: 'كمال سيد بدوي', actor_en: 'Kamal Sayed Badawi', type: 'creation' },
        { id: 'ACT-CAN-1202', date: '2026-10-16 11:00', title_ar: 'اعتماد الإلغاء الكامل', title_en: 'Full Cancellation Approved', desc_ar: 'اعتماد إلغاء الحجز ومبلغ ٤٩,٠٠٠ ج.م.', desc_en: 'Approved cancellation for 49,000 EGP.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'approval' },
        { id: 'ACT-CAN-1203', date: '2026-10-18 10:30', title_ar: 'تنفيذ التحويل البنكي', title_en: 'Wire Executed', desc_ar: 'تحويل ٤٩,٠٠٠ ج.م عبر البنك الأهلي بالمرجع: TRX-REF-331980.', desc_en: 'Transferred 49,000 EGP via NBE, Ref: TRX-REF-331980.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_processing' },
        { id: 'ACT-CAN-1204', date: '2026-10-19 14:00', title_ar: 'تأكيد اكتمال الاسترداد والتسوية النهائية', title_en: 'Refund Settlement Confirmed & Completed', desc_ar: 'تأكيد التسوية المكتملة وأرشفة السجل.', desc_en: 'Settlement confirmed, record archived.', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', type: 'refund_completed' }
      ]
    }
  ];

  let SLA_CONFIG_HOURS = 2; // Default 2 hours, max 24 hours

  return {
    TOURISM_COMPANIES_REGISTRY,
    PROGRAM_MODIFICATION_REQUESTS,
    CANCELLATION_REQUESTS,
    BASE_KPIS,
    CUSTOMERS,
    TRANSACTIONS,
    ACTIVITIES,
    PENDING_ACTIONS,

    getDashboardKPIs: function (filters) {
      const isDefault = !filters || Object.keys(filters).length === 0 || Object.values(filters).every(v => v === 'all' || !v);
      if (isDefault) {
        return { ...BASE_KPIS };
      }

      // Dynamically recalculate if filters are applied
      const filteredTx = TRANSACTIONS.filter(t => matchFilter(t, filters));
      const filteredAct = ACTIVITIES.filter(a => matchFilter(a, filters));

      let recSum = 0;
      let verSum = 0;
      let refSum = 0;

      filteredTx.forEach(t => {
        if (t.status === 'verified') verSum += t.amount;
        if (t.status === 'refunded') refSum += t.amount;
        recSum += t.amount;
      });

      return {
        totalCustomers: BASE_KPIS.totalCustomers,
        newCustomersToday: filters.dateRange === 'today' ? 6 : (filters.dateRange === 'yesterday' ? 4 : 6),
        totalBookings: BASE_KPIS.totalBookings,
        newBookingsToday: filters.dateRange === 'today' ? 5 : 5,
        contractsCreated: BASE_KPIS.contractsCreated,
        totalRecordedCollections: recSum > 0 ? recSum : BASE_KPIS.totalRecordedCollections,
        verifiedCollections: verSum > 0 ? verSum : BASE_KPIS.verifiedCollections,
        pendingVerification: (recSum - verSum) > 0 ? (recSum - verSum) : BASE_KPIS.pendingVerification,
        pendingAdminApprovals: PENDING_ACTIONS.length,
        refundRequests: 4,
        refundRequestsValue: 186000,
        completedRefunds: refSum > 0 ? 1 : BASE_KPIS.completedRefunds,
        completedRefundsValue: refSum > 0 ? refSum : BASE_KPIS.completedRefundsValue,
        currency: 'EGP',
        isFiltered: true,
        filteredTxCount: filteredTx.length,
        filteredActCount: filteredAct.length
      };
    },

    getFilteredTransactions: function (filters) {
      return TRANSACTIONS.filter(t => matchFilter(t, filters));
    },

    getFilteredActivities: function (filters) {
      return ACTIVITIES.filter(a => matchFilter(a, filters));
    },

    getFilteredCustomers: function (filters) {
      return CUSTOMERS.slice(0, 6).filter(c => matchFilter(c, filters));
    },

    getCustomerDirectorySummary: function () {
      let activeBookings = 0;
      let activeContracts = 0;
      let pendingItems = 0;

      CUSTOMERS.forEach(c => {
        if (c.booking_status === 'confirmed' || c.booking_status === 'deposit_paid' || c.booking_status === 'new') {
          activeBookings++;
        }
        if (c.contract_status === 'active') {
          activeContracts++;
        }
        if (c.payment_status === 'pending_clearance' || c.refund_status === 'pending_approval' || c.refund_status === 'under_review' || c.booking_status === 'new') {
          pendingItems++;
        }
      });

      return {
        totalCustomers: BASE_KPIS.totalCustomers, // 148
        directoryCount: CUSTOMERS.length, // 16
        activeBookings: activeBookings,
        activeContracts: activeContracts,
        pendingItems: pendingItems
      };
    },

    filterCustomerDirectory: function (opts) {
      opts = opts || {};
      const query = (opts.search || '').trim();
      const normQuery = normalizeSearchTerm(query);

      return CUSTOMERS.filter(c => {
        // Search Matching
        if (normQuery) {
          const matchNameAr = normalizeSearchTerm(c.name_ar).includes(normQuery);
          const matchNameEn = (c.name_en || '').toLowerCase().includes(query.toLowerCase()) || normalizeSearchTerm(c.name_en).includes(normQuery);
          const matchId = (c.id || '').toLowerCase().includes(query.toLowerCase()) || normalizeSearchTerm(c.id).includes(normQuery);
          const rawDigits = query.replace(/[^0-9]/g, '');
          const matchPhone = rawDigits.length > 0 && (c.phone || '').replace(/[^0-9]/g, '').includes(rawDigits);
          const matchWhatsApp = rawDigits.length > 0 && (c.whatsapp || '').replace(/[^0-9]/g, '').includes(rawDigits);
          const matchBooking = (c.booking_ref || '').toLowerCase().includes(query.toLowerCase()) || normalizeSearchTerm(c.booking_ref).includes(normQuery);
          const matchContract = (c.contract_ref || '').toLowerCase().includes(query.toLowerCase()) || normalizeSearchTerm(c.contract_ref).includes(normQuery);

          if (!matchNameAr && !matchNameEn && !matchId && !matchPhone && !matchWhatsApp && !matchBooking && !matchContract) {
            return false;
          }
        }

        // Governorate filter
        if (opts.governorate && opts.governorate !== 'all') {
          const govAr = (c.governorate_ar || '').trim();
          const govEn = (c.governorate_en || '').toLowerCase().trim();
          const opt = opts.governorate.toLowerCase().trim();
          if (govAr !== opts.governorate && govEn !== opt) return false;
        }

        // Program filter
        if (opts.program && opts.program !== 'all') {
          if (c.program_key !== opts.program && c.program_ar !== opts.program && c.program_en !== opts.program) {
            return false;
          }
        }

        // Booking status filter
        if (opts.bookingStatus && opts.bookingStatus !== 'all') {
          if (c.booking_status !== opts.bookingStatus) return false;
        }

        // Contract status filter
        if (opts.contractStatus && opts.contractStatus !== 'all') {
          if (c.contract_status !== opts.contractStatus) return false;
        }

        // Payment status filter
        if (opts.paymentStatus && opts.paymentStatus !== 'all') {
          if (c.payment_status !== opts.paymentStatus) return false;
        }

        // Refund status filter
        if (opts.refundStatus && opts.refundStatus !== 'all') {
          if (c.refund_status !== opts.refundStatus) return false;
        }

        return true;
      });
    },

    getCustomerById: function (id) {
      if (!id) return null;
      return CUSTOMERS.find(c => c.id === id) || null;
    },

    getPendingActions: function (filters) {
      return PENDING_ACTIONS.filter(p => matchFilter(p, filters));
    },

    getFinancialOverviewData: function (filters) {
      const kpis = this.getDashboardKPIs(filters);
      return {
        recorded: kpis.totalRecordedCollections,
        verified: kpis.verifiedCollections,
        pending: kpis.pendingVerification,
        refundRequests: kpis.refundRequestsValue,
        completedRefunds: kpis.completedRefundsValue,
        monthlyTrends: [
          { month_ar: 'يوليو', month_en: 'July', amount: 480000 },
          { month_ar: 'أغسطس', month_en: 'August', amount: 590000 },
          { month_ar: 'سبتمبر', month_en: 'September', amount: 720000 },
          { month_ar: 'أكتوبر', month_en: 'October', amount: 890000 },
          { month_ar: 'نوفمبر', month_en: 'November', amount: 980000 },
          { month_ar: 'ديسمبر', month_en: 'December', amount: 1180000 }
        ]
      };
    },

    getCollectionsBreakdown: function (filters) {
      const txList = this.getFilteredTransactions(filters);
      let cashSum = 0;
      let cardSum = 0;
      let instaSum = 0;
      let walletSum = 0;

      if (txList.length === 0) {
        // Fallback default distribution from base KPIs (Total 3,840,000 EGP)
        cashSum = 1520000;
        cardSum = 1140000;
        instaSum = 760000;
        walletSum = 420000;
      } else {
        txList.forEach(t => {
          if (t.payment_method === 'cash') cashSum += t.amount;
          else if (t.payment_method === 'platform_card') cardSum += t.amount;
          else if (t.payment_method === 'instapay') instaSum += t.amount;
          else walletSum += t.amount;
        });
      }

      const total = cashSum + cardSum + instaSum + walletSum;
      const calcPct = (val) => total > 0 ? ((val / total) * 100) : 0;

      const rawItems = [
        {
          id: 'cash',
          key: 'cash',
          label_ar: 'تحصيل نقدي بالفرع',
          label_en: 'Branch Cash Deposit',
          amount: cashSum,
          pct: calcPct(cashSum),
          colorLight: '#183653',
          colorDark: '#8AB7E0'
        },
        {
          id: 'card',
          key: 'platform_card',
          label_ar: 'بطاقة بنكية (فيزا / ميزة)',
          label_en: 'Electronic Card (Visa/Meeza)',
          amount: cardSum,
          pct: calcPct(cardSum),
          colorLight: '#28577D',
          colorDark: '#3E739E'
        },
        {
          id: 'instapay',
          key: 'instapay',
          label_ar: 'تحويل إنستاباي (InstaPay)',
          label_en: 'InstaPay Instant Transfer',
          amount: instaSum,
          pct: calcPct(instaSum),
          colorLight: '#875F20',
          colorDark: '#DFBF7A'
        },
        {
          id: 'wallets',
          key: 'wallets',
          label_ar: 'محافظ إلكترونية كاش',
          label_en: 'E-Wallets (Vodafone / WE)',
          amount: walletSum,
          pct: calcPct(walletSum),
          colorLight: '#526579',
          colorDark: '#D0D9E2'
        }
      ];

      // Round percentages and ensure exact 100% sum
      let sumPct = 0;
      rawItems.forEach(item => {
        item.percentage = Math.round(item.pct * 10) / 10;
        sumPct += item.percentage;
      });
      const diff = Math.round((100 - sumPct) * 10) / 10;
      if (diff !== 0 && rawItems[0]) {
        rawItems[0].percentage = Math.round((rawItems[0].percentage + diff) * 10) / 10;
      }

      return {
        total,
        items: rawItems
      };
    },

    getDailyActivityTrends: function (filters) {
      const days = [
        { date: '2026-10-28', day_ar: '٢٨ أكتوبر', day_en: '28 Oct', weekday_ar: 'الأربعاء', weekday_en: 'Wed', recorded: 480000, verified: 360000, rate: '75.0%' },
        { date: '2026-10-29', day_ar: '٢٩ أكتوبر', day_en: '29 Oct', weekday_ar: 'الخميس', weekday_en: 'Thu', recorded: 520000, verified: 410000, rate: '78.8%' },
        { date: '2026-10-30', day_ar: '٣٠ أكتوبر', day_en: '30 Oct', weekday_ar: 'الجمعة', weekday_en: 'Fri', recorded: 380000, verified: 300000, rate: '78.9%' },
        { date: '2026-10-31', day_ar: '٣١ أكتوبر', day_en: '31 Oct', weekday_ar: 'السبت', weekday_en: 'Sat', recorded: 460000, verified: 340000, rate: '73.9%' },
        { date: '2026-11-01', day_ar: '١ نوفمبر', day_en: '1 Nov', weekday_ar: 'الأحد', weekday_en: 'Sun', recorded: 590000, verified: 450000, rate: '76.3%' },
        { date: '2026-11-02', day_ar: '٢ نوفمبر', day_en: '2 Nov', weekday_ar: 'الإثنين', weekday_en: 'Mon', recorded: 650000, verified: 480000, rate: '73.8%' },
        { date: '2026-11-03', day_ar: '٣ نوفمبر', day_en: '3 Nov', weekday_ar: 'الثلاثاء', weekday_en: 'Tue', recorded: 760000, verified: 580000, rate: '76.3%' }
      ];

      if (filters && filters.exactDate) {
        days.forEach(d => {
          d.isSelected = (d.date === filters.exactDate);
        });
      }

      return days;
    },

    // --- Phase 3: Customer Profile Access Methods ---
    getCustomerDetails: function (id) {
      if (!id) return null;
      const base = CUSTOMERS.find(c => c.id === id);
      if (!base) return null;

      const bookings = this.getCustomerBookings(id);
      const payments = this.getCustomerPayments(id);
      const receipts = this.getCustomerReceipts(id);
      const refunds = this.getCustomerRefunds(id);
      const tripChanges = this.getCustomerTripChanges(id);
      const timeline = this.getCustomerTimeline(id);
      const summary = this.getCustomerFinancialSummary(id);

      return {
        ...base,
        bookings,
        payments,
        receipts,
        refunds,
        tripChanges,
        timeline,
        summary
      };
    },

    getCustomerBookings: function (customerId) {
      if (!customerId) return [];
      if (CUSTOMER_BOOKINGS[customerId]) {
        return CUSTOMER_BOOKINGS[customerId];
      }
      const c = CUSTOMERS.find(cust => cust.id === customerId);
      if (!c) return [];
      return [
        {
          id: c.booking_ref || ('BK-2026-' + customerId.replace('CUST-', '')),
          customerId: c.id,
          program_ar: c.program_ar,
          program_en: c.program_en,
          company_ar: 'شركة الهدى للسياحة والخدمات الدينية',
          company_en: 'Al-Huda Religious Travel & Tourism',
          booking_date: c.registered_date,
          travel_season_ar: 'موسم رجب - شعبان ١٤٤٨ هـ',
          travel_season_en: 'Rajab - Shaban 1448 AH',
          travelers_count: c.bookings_count || 1,
          total_price: c.total_spent || 50000,
          paid_amount: c.paid_amount || 0,
          remaining: c.remaining || 0,
          booking_status: c.booking_status || 'confirmed',
          payment_status: c.payment_status || 'paid_full',
          notes_ar: 'حجز مركزي مسجل',
          notes_en: 'Centrally recorded booking'
        }
      ];
    },

    getCustomerPayments: function (customerId) {
      if (!customerId) return [];
      if (CUSTOMER_PAYMENTS[customerId]) {
        return CUSTOMER_PAYMENTS[customerId];
      }
      const c = CUSTOMERS.find(cust => cust.id === customerId);
      if (!c || !c.paid_amount) return [];
      return [
        {
          id: 'TX-2026-' + customerId.replace('CUST-', '91'),
          customerId: c.id,
          booking_id: c.booking_ref || ('BK-2026-' + customerId.replace('CUST-', '')),
          date: c.registered_date + ' 12:00',
          amount: c.paid_amount,
          method: 'bank_transfer',
          method_ar: 'تحويل بنكي رسمي',
          method_en: 'Official Bank Transfer',
          receipt_ref: 'RCP-2026-' + customerId.replace('CUST-', '45'),
          status: 'completed',
          balance_after: c.remaining || 0
        }
      ];
    },

    getCustomerReceipts: function (customerId) {
      if (!customerId) return [];
      if (CUSTOMER_RECEIPTS[customerId]) {
        return CUSTOMER_RECEIPTS[customerId];
      }
      const payments = this.getCustomerPayments(customerId);
      return payments.map(p => ({
        receipt_num: p.receipt_ref,
        customerId: p.customerId,
        booking_id: p.booking_id,
        payment_id: p.id,
        date: p.date.split(' ')[0],
        amount: p.amount,
        method_ar: p.method_ar,
        method_en: p.method_en,
        collector_ar: 'أحمد صبري (موظف حسابات)',
        collector_en: 'Ahmed Sabry (Accounts Officer)',
        verification_state: 'verified',
        notes_ar: 'إيصال سداد معتمد ومطابق مع كشف الحساب المركزي',
        notes_en: 'Verified receipt matched with central ledger'
      }));
    },

    getCustomerRefunds: function (customerId) {
      if (!customerId) return [];
      return CUSTOMER_REFUNDS[customerId] || [];
    },

    getCustomerTripChanges: function (customerId) {
      if (!customerId) return [];
      return CUSTOMER_TRIP_CHANGES[customerId] || [];
    },

    getCustomerTimeline: function (customerId) {
      if (!customerId) return [];
      if (CUSTOMER_TIMELINES[customerId]) {
        return CUSTOMER_TIMELINES[customerId];
      }
      const c = CUSTOMERS.find(cust => cust.id === customerId);
      if (!c) return [];
      return [
        {
          date: c.registered_date + ' 10:00',
          title_ar: 'تسجيل الحساب وتوثيق البيانات',
          title_en: 'Account Registered & Verified',
          desc_ar: 'تم إنشاء سجل العميل في مساحة الحسابات بواسطة أحمد صبري',
          desc_en: 'Customer profile created in accounts workspace by Ahmed Sabry',
          category: 'registration'
        },
        {
          date: c.registered_date + ' 11:30',
          title_ar: 'إنشاء الحجز رقم ' + (c.booking_ref || 'BK-2026-1045'),
          title_en: 'Booking ' + (c.booking_ref || 'BK-2026-1045') + ' Created',
          desc_ar: 'تم اختيار ' + c.program_ar,
          desc_en: 'Selected ' + c.program_en,
          category: 'booking'
        }
      ];
    },

    getCustomerFinancialSummary: function (customerId) {
      const bookings = this.getCustomerBookings(customerId);
      const payments = this.getCustomerPayments(customerId);
      const receipts = this.getCustomerReceipts(customerId);
      const refunds = this.getCustomerRefunds(customerId);
      const tripChanges = this.getCustomerTripChanges(customerId);

      let totalBookings = bookings.length;
      let activeBookings = bookings.filter(b => b.booking_status === 'confirmed' || b.booking_status === 'deposit_paid').length;
      let totalAmount = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
      let totalPaid = bookings.reduce((sum, b) => sum + (Number(b.paid_amount) || 0), 0);
      let outstandingBalance = bookings.reduce((sum, b) => sum + (Number(b.remaining) || 0), 0);

      let pendingReceipts = receipts.filter(r => r.verification_state === 'pending_approval').length;
      let pendingRefunds = refunds.filter(rf => rf.status === 'pending_approval' || rf.status === 'under_review').length;
      let pendingChanges = tripChanges.filter(tc => tc.customer_agreement === 'pending_agreement').length;
      let pendingItemsCount = pendingReceipts + pendingRefunds + pendingChanges;

      return {
        totalBookings,
        activeBookings,
        totalAmount,
        totalPaid,
        outstandingBalance,
        pendingItemsCount,
        pendingReceipts,
        pendingRefunds,
        pendingChanges
      };
    },

    // =========================================================================
    // UNIFIED BOOKINGS REGISTER & DETAILS DATA PROVIDER METHODS
    // =========================================================================

    getAllBookings: function (options) {
      const opts = options || {};
      let list = BOOKINGS_MASTER.slice();

      // 1. Text Search (Customer Name, Booking ID, Phone)
      if (opts.search) {
        const q = opts.search.toLowerCase().trim();
        list = list.filter(b => {
          return (b.id && b.id.toLowerCase().includes(q)) ||
                 (b.customer_name_ar && b.customer_name_ar.toLowerCase().includes(q)) ||
                 (b.customer_name_en && b.customer_name_en.toLowerCase().includes(q)) ||
                 (b.customer_phone && b.customer_phone.includes(q)) ||
                 (b.company_ar && b.company_ar.toLowerCase().includes(q)) ||
                 (b.program_ar && b.program_ar.toLowerCase().includes(q));
        });
      }

      // 2. Tourism Company filter
      if (opts.company && opts.company !== 'all') {
        list = list.filter(b => b.company_id === opts.company || b.company_ar === opts.company || b.company_en === opts.company);
      }

      // 3. Program Type filter
      if (opts.programType && opts.programType !== 'all') {
        list = list.filter(b => b.program_type === opts.programType);
      }

      // 4. Booking Status filter
      if (opts.bookingStatus && opts.bookingStatus !== 'all') {
        list = list.filter(b => b.booking_status === opts.bookingStatus);
      }

      // 5. Payment Status filter
      if (opts.paymentStatus && opts.paymentStatus !== 'all') {
        list = list.filter(b => b.payment_status === opts.paymentStatus);
      }

      // 6. Season / Travel date filter
      if (opts.season && opts.season !== 'all') {
        list = list.filter(b => b.season_key === opts.season || b.season_ar.includes(opts.season));
      }

      // 7. Date Range (creation date)
      if (opts.dateFrom) {
        list = list.filter(b => b.created_date >= opts.dateFrom);
      }
      if (opts.dateTo) {
        list = list.filter(b => b.created_date <= opts.dateTo);
      }

      // 8. Quick filter: reviewOnly
      if (opts.reviewOnly === 'collections') {
        list = list.filter(b => b.has_pending_review || b.pending_amount > 0);
      } else if (opts.reviewOnly === 'refunds') {
        list = list.filter(b => b.refunds && b.refunds.some(r => r.status === 'under_review' || r.status === 'requested'));
      }

      return list;
    },

    getBookingsSummary: function () {
      const list = BOOKINGS_MASTER;
      const totalBookings = list.length;
      const confirmedBookings = list.filter(b => b.booking_status === 'confirmed' || b.booking_status === 'completed').length;
      const totalApprovedCollected = list.reduce((sum, b) => sum + (Number(b.paid_amount) || 0), 0);
      const totalRemainingBalances = list.reduce((sum, b) => sum + (Number(b.remaining_balance) || 0), 0);
      const pendingReviewCount = list.filter(b => b.has_pending_review || b.pending_amount > 0).length;
      const pendingRefundsCount = list.filter(b => b.refunds && b.refunds.some(r => r.status === 'under_review' || r.status === 'requested')).length;

      return {
        totalBookings,
        confirmedBookings,
        totalApprovedCollected,
        totalRemainingBalances,
        pendingReviewCount,
        pendingRefundsCount
      };
    },

    getOperationsRequiringReview: function () {
      const pendingCollections = [];
      const pendingRefunds = [];

      BOOKINGS_MASTER.forEach(b => {
        if (b.payments) {
          b.payments.forEach(p => {
            if (p.verification_status === 'pending_review') {
              pendingCollections.push({
                booking_id: b.id,
                customer_name_ar: b.customer_name_ar,
                customer_name_en: b.customer_name_en,
                company_ar: b.company_ar,
                company_en: b.company_en,
                transaction_id: p.id,
                amount: p.amount,
                date: p.date,
                method_ar: p.payment_method_ar,
                method_en: p.payment_method_en
              });
            }
          });
        }

        if (b.refunds) {
          b.refunds.forEach(r => {
            if (r.status === 'under_review' || r.status === 'requested') {
              pendingRefunds.push({
                booking_id: b.id,
                customer_name_ar: b.customer_name_ar,
                customer_name_en: b.customer_name_en,
                company_ar: b.company_ar,
                company_en: b.company_en,
                refund_id: r.id,
                amount: r.requested_amount,
                date: r.request_date,
                reason_ar: r.reason_ar,
                reason_en: r.reason_en,
                source_ar: r.request_source_ar,
                source_en: r.request_source_en
              });
            }
          });
        }
      });

      return {
        pendingCollections,
        pendingRefunds,
        totalCount: pendingCollections.length + pendingRefunds.length
      };
    },

    getBookingDetails: function (bookingId) {
      if (!bookingId) return null;
      const b = BOOKINGS_MASTER.find(item => item.id === bookingId);
      if (!b) return null;

      // Deep clone to prevent unintended mutations outside authorized methods
      return JSON.parse(JSON.stringify(b));
    },

    addBookingInternalNote: function (bookingId, noteText) {
      if (!bookingId || !noteText || !noteText.trim()) return false;
      const b = BOOKINGS_MASTER.find(item => item.id === bookingId);
      if (!b) return false;

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0] + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      const newNote = {
        id: 'IN-' + bookingId.replace('BK-2026-', '') + '-' + (b.internal_notes.length + 1),
        author_name: 'أحمد صبري',
        author_role: 'موظف حسابات مالية',
        date: dateStr,
        text: noteText.trim()
      };

      b.internal_notes.push(newNote);

      // Also add to activities
      b.activities.unshift({
        id: 'ACT-NOTE-' + Date.now(),
        type: 'internal_note',
        type_label_ar: 'ملاحظة داخلية',
        type_label_en: 'Internal Note',
        title_ar: 'إضافة ملاحظة حسابات داخلية',
        title_en: 'Internal Accounting Note Added',
        desc_ar: noteText.trim(),
        desc_en: noteText.trim(),
        actor_ar: 'أحمد صبري (حسابات ميقات)',
        actor_en: 'Ahmed Sabry (Miqat Accounts)',
        date: dateStr,
        link_tab: 'overview'
      });

      return true;
    },

    approveBookingPayment: function (bookingId, paymentId) {
      if (!bookingId || !paymentId) return false;
      const b = BOOKINGS_MASTER.find(item => item.id === bookingId);
      if (!b || !b.payments) return false;

      const p = b.payments.find(pay => pay.id === paymentId);
      if (!p || p.verification_status === 'approved') return false;

      // Approve collection
      p.verification_status = 'approved';
      p.verification_status_ar = 'معتمد ومطابق دفترياً';
      p.verification_status_en = 'Approved & Verified';

      // Update financial balances
      b.paid_amount += Number(p.amount) || 0;
      b.pending_amount = Math.max(0, b.pending_amount - (Number(p.amount) || 0));
      b.remaining_balance = Math.max(0, b.total_price - b.paid_amount);
      p.balance_after = b.remaining_balance;

      if (b.remaining_balance === 0) {
        b.payment_status = 'paid_full';
        b.payment_status_ar = 'مسدد بالكامل';
        b.payment_status_en = 'Paid in Full';
        b.booking_status = 'confirmed';
        b.booking_status_ar = 'مؤكد';
        b.booking_status_en = 'Confirmed';
      }

      b.has_pending_review = b.payments.some(pay => pay.verification_status === 'pending_review');

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0] + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      // Add to payment audit trail
      if (!p.audit_trail) p.audit_trail = [];
      p.audit_trail.push({
        action: 'اعتماد ومطابقة التحصيل',
        actor: 'أحمد صبري (حسابات ميقات)',
        date: dateStr,
        details: 'تم تدقيق المعاملة واعتماد مبلغ ' + p.amount.toLocaleString() + ' ج.م وتحديث الرصيد المتبقي إلى ' + b.remaining_balance.toLocaleString() + ' ج.م'
      });

      // Add to activities
      b.activities.unshift({
        id: 'ACT-APP-' + Date.now(),
        type: 'payment_approved',
        type_label_ar: 'اعتماد تحصيل',
        type_label_en: 'Payment Approved',
        title_ar: 'اعتماد تحصيل الدفعة ' + p.id,
        title_en: 'Payment Approved ' + p.id,
        desc_ar: 'تم اعتماد مبلغ ' + p.amount.toLocaleString() + ' ج.م دفترياً وتحديث الرصيد المتبقي إلى ' + b.remaining_balance.toLocaleString() + ' ج.م',
        desc_en: 'Payment of ' + p.amount.toLocaleString() + ' EGP verified; remaining balance is ' + b.remaining_balance.toLocaleString() + ' EGP',
        actor_ar: 'أحمد صبري (حسابات ميقات)',
        actor_en: 'Ahmed Sabry (Miqat Accounts)',
        date: dateStr,
        link_tab: 'payments'
      });

      return true;
    },

    addPaymentInternalComment: function (bookingId, paymentId, messageText) {
      if (!bookingId || !paymentId || !messageText || !messageText.trim()) return false;
      const b = BOOKINGS_MASTER.find(item => item.id === bookingId);
      if (!b || !b.payments) return false;

      const p = b.payments.find(pay => pay.id === paymentId);
      if (!p) return false;

      if (!p.discussion) p.discussion = [];

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0] + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      p.discussion.push({
        id: 'DISC-' + p.id.replace('TX-2026-', '') + '-' + (p.discussion.length + 1),
        author_name: 'أحمد صبري',
        author_role: 'موظف حسابات ميقات',
        date: dateStr,
        message: messageText.trim()
      });

      // Also log in payment audit trail
      if (!p.audit_trail) p.audit_trail = [];
      p.audit_trail.push({
        action: 'إضافة تعليق مناقشة داخلية',
        actor: 'أحمد صبري',
        date: dateStr,
        details: messageText.trim().substring(0, 80)
      });

      return true;
    },

    getBookingFullActivityLog: function (bookingId, filterOptions) {
      const b = this.getBookingDetails(bookingId);
      if (!b || !b.activities) return [];

      const opts = filterOptions || {};
      let list = b.activities.slice();

      // 1. Text search
      if (opts.search) {
        const q = opts.search.toLowerCase().trim();
        list = list.filter(act => {
          return (act.title_ar && act.title_ar.toLowerCase().includes(q)) ||
                 (act.title_en && act.title_en.toLowerCase().includes(q)) ||
                 (act.desc_ar && act.desc_ar.toLowerCase().includes(q)) ||
                 (act.desc_en && act.desc_en.toLowerCase().includes(q)) ||
                 (act.actor_ar && act.actor_ar.toLowerCase().includes(q)) ||
                 (act.actor_en && act.actor_en.toLowerCase().includes(q));
        });
      }

      // 2. Category filter
      if (opts.category && opts.category !== 'all') {
        list = list.filter(act => act.type === opts.category);
      }

      // 3. Date range
      if (opts.dateFrom) {
        list = list.filter(act => act.date >= opts.dateFrom);
      }
      if (opts.dateTo) {
        list = list.filter(act => act.date <= opts.dateTo);
      }

      return list;
    }

,

    // --- Program & Itinerary Modification Services (Phases 1-5) ---
    getTourismCompaniesWithModifications: function () {
      return TOURISM_COMPANIES_REGISTRY.map(comp => {
        const compRequests = PROGRAM_MODIFICATION_REQUESTS.filter(r => r.company_id === comp.id);
        const total = compRequests.length;
        const newCount = compRequests.filter(r => r.request_status === 'new').length;
        const inProgressCount = compRequests.filter(r => r.request_status === 'in_progress').length;
        const completedCount = compRequests.filter(r => r.request_status === 'completed').length;

        // Last request date
        let lastDate = '—';
        if (compRequests.length > 0) {
          const sorted = compRequests.slice().sort((a, b) => (b.timestamp_iso || b.created_at).localeCompare(a.timestamp_iso || a.created_at));
          lastDate = sorted[0].created_at;
        }

        return {
          ...comp,
          totalRequests: total,
          newRequests: newCount,
          inProgressRequests: inProgressCount,
          completedRequests: completedCount,
          lastRequestDate: lastDate
        };
      });
    },

    getCompanyDetails: function (companyId) {
      return TOURISM_COMPANIES_REGISTRY.find(c => c.id === companyId) || null;
    },

    getCompanyModificationSummary: function (companyId) {
      const compRequests = PROGRAM_MODIFICATION_REQUESTS.filter(r => r.company_id === companyId);
      const total = compRequests.length;
      const newCount = compRequests.filter(r => r.request_status === 'new').length;
      const inProgressCount = compRequests.filter(r => r.request_status === 'in_progress').length;
      const completedCount = compRequests.filter(r => r.request_status === 'completed').length;

      // Strict Financial Rule: Total remaining balance of customers with modification requests
      // Calculated using approved financial information only. Pending payments excluded.
      const totalRemaining = compRequests.reduce((sum, req) => {
        const fin = calculateRequestFinancials(req);
        return sum + fin.remainingAmount;
      }, 0);

      return {
        totalRequests: total,
        newRequests: newCount,
        inProgressRequests: inProgressCount,
        completedRequests: completedCount,
        totalRemainingBalance: totalRemaining
      };
    },

    getCompanyModificationRequests: function (companyId, filterOptions) {
      let list = PROGRAM_MODIFICATION_REQUESTS.filter(r => r.company_id === companyId);
      const opts = filterOptions || {};

      // 1. Search (Request ID, Booking ID, Customer Name, Customer Phone)
      if (opts.search) {
        const q = opts.search.toLowerCase().trim();
        list = list.filter(r => {
          return (r.id && r.id.toLowerCase().includes(q)) ||
                 (r.booking_id && r.booking_id.toLowerCase().includes(q)) ||
                 (r.customer_name_ar && r.customer_name_ar.toLowerCase().includes(q)) ||
                 (r.customer_name_en && r.customer_name_en.toLowerCase().includes(q)) ||
                 (r.customer_phone && r.customer_phone.includes(q));
        });
      }

      // 2. Basic Filters
      if (opts.modificationStatus && opts.modificationStatus !== 'all') {
        list = list.filter(r => r.request_status === opts.modificationStatus);
      }
      if (opts.paymentStatus && opts.paymentStatus !== 'all') {
        list = list.filter(r => r.payment_status === opts.paymentStatus);
      }
      if (opts.requestDateFrom) {
        list = list.filter(r => (r.created_at.slice(0, 10)) >= opts.requestDateFrom);
      }
      if (opts.requestDateTo) {
        list = list.filter(r => (r.created_at.slice(0, 10)) <= opts.requestDateTo);
      }

      // 3. Advanced Filters
      if (opts.originalProgram && opts.originalProgram !== 'all') {
        list = list.filter(r => r.original_program && r.original_program.name_ar === opts.originalProgram);
      }
      if (opts.newProgram && opts.newProgram !== 'all') {
        list = list.filter(r => r.new_program && r.new_program.name_ar === opts.newProgram);
      }
      if (opts.travelDate) {
        list = list.filter(r => r.new_program && r.new_program.travel_date === opts.travelDate);
      }
      if (opts.paymentReviewStatus && opts.paymentReviewStatus !== 'all') {
        if (opts.paymentReviewStatus === 'has_pending') {
          list = list.filter(r => (r.additional_payments || []).some(p => p.review_status === 'pending_review' || p.review_status === 'pending'));
        } else if (opts.paymentReviewStatus === 'all_approved') {
          list = list.filter(r => (r.additional_payments || []).length > 0 && (r.additional_payments || []).every(p => p.review_status === 'approved'));
        }
      }
      if (opts.overdueOnly) {
        list = list.filter(r => r.sla && r.sla.is_overdue);
      }

      // 4. Default Sorting: Newest First (timestamp descending)
      list.sort((a, b) => {
        const tsA = a.timestamp_iso || a.created_at;
        const tsB = b.timestamp_iso || b.created_at;
        return tsB.localeCompare(tsA);
      });

      return list.map(r => ({
        ...r,
        financials: calculateRequestFinancials(r)
      }));
    },

    getModificationDetails: function (requestId) {
      const req = PROGRAM_MODIFICATION_REQUESTS.find(r => r.id === requestId);
      if (!req) return null;
      return {
        ...req,
        financials: calculateRequestFinancials(req)
      };
    },

    approveModificationPayment: function (requestId, paymentId, reviewerName) {
      const req = PROGRAM_MODIFICATION_REQUESTS.find(r => r.id === requestId);
      if (!req) return false;
      const payment = (req.additional_payments || []).find(p => p.id === paymentId);
      if (!payment) return false;

      payment.review_status = 'approved';
      payment.reviewed_by_ar = reviewerName || 'أحمد صبري';
      payment.reviewed_by_en = (reviewerName === 'أحمد صبري' || !reviewerName) ? 'Ahmed Sabry' : reviewerName;
      payment.reviewed_at = new Date().toISOString().replace('T', ' ').slice(0, 16);

      // Check if all payments approved and balance zero to adjust overall payment status
      const fin = calculateRequestFinancials(req);
      if (fin.remainingAmount === 0) {
        req.payment_status = 'paid_full';
      } else if (fin.totalApprovedPaid > 0) {
        req.payment_status = 'partially_paid';
      }

      // Add to activity log
      req.activity_log.unshift({
        id: 'ACT-MOD-' + Date.now(),
        date: payment.reviewed_at,
        title_ar: 'اعتماد سداد إضافي',
        title_en: 'Additional Payment Approved',
        desc_ar: 'تم اعتماد المعاملة ' + payment.id + ' بمبلغ ' + payment.amount.toLocaleString() + ' ج.م بنجاح.',
        desc_en: 'Transaction ' + payment.id + ' of ' + payment.amount.toLocaleString() + ' EGP approved successfully.',
        actor_ar: payment.reviewed_by_ar,
        actor_en: payment.reviewed_by_en,
        type: 'payment'
      });

      return true;
    },

    sendModificationChatMessage: function (requestId, text, senderRole, senderName) {
      return this.sendModificationMessage(requestId, text, senderName, senderRole);
    },

    updateModificationStatus: function (requestId, newStatus, employeeName, confirmationData) {
      const req = PROGRAM_MODIFICATION_REQUESTS.find(r => r.id === requestId);
      if (!req) return false;
      if (newStatus !== 'new' && newStatus !== 'in_progress' && newStatus !== 'completed') return false;

      const prevStatus = req.request_status;
      req.request_status = newStatus;
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

      // If moved to in_progress from new, stop initial SLA timer
      if (prevStatus === 'new' && newStatus === 'in_progress') {
        if (req.sla) {
          req.sla.response_started_at = nowStr;
          req.sla.is_overdue = false;
        }
      }

      // If completed, automatically close conversation and record confirmation
      if (newStatus === 'completed') {
        if (req.conversation) {
          req.conversation.is_closed = true;
          req.conversation.closed_at = nowStr;
        }
      }

      const empAr = employeeName || 'أحمد صبري';
      const empEn = empAr === 'أحمد صبري' ? 'Ahmed Sabry' : empAr;

      req.status_history.unshift({
        from_status: prevStatus,
        to_status: newStatus,
        date: nowStr,
        employee_ar: empAr,
        employee_en: empEn,
        note_ar: newStatus === 'completed' ? 'تم استيفاء تأكيد شركة السياحة باكتمال التعديل وتحديث البرنامج دفترياً' : 'بدء متابعة ودراسة طلب التعديل',
        note_en: newStatus === 'completed' ? 'Company confirmation satisfied and program updated in booking' : 'Started request follow-up and review'
      });

      req.activity_log.unshift({
        id: 'ACT-MOD-' + Date.now(),
        date: nowStr,
        title_ar: newStatus === 'completed' ? 'اكتمال تنفيذ طلب التعديل' : 'تحديث حالة الطلب إلى قيد المتابعة',
        title_en: newStatus === 'completed' ? 'Modification Request Completed' : 'Status Updated to In Progress',
        desc_ar: newStatus === 'completed' ? 'تم اعتماد التعديل رسمياً وإغلاق المحادثة' : 'تم بدء المتابعة وإيقاف مؤقت الاستجابة الأولي',
        desc_en: newStatus === 'completed' ? 'Request officially completed and conversation closed' : 'Follow-up initiated; initial response timer stopped',
        actor_ar: empAr,
        actor_en: empEn,
        type: 'status'
      });

      return true;
    },

    sendModificationChatMessage: function (requestId, text, senderRole, senderName) {
      return this.sendModificationMessage(requestId, text, senderName, senderRole);
    },

    addModificationInternalNote: function (requestId, text, authorName) {
      const req = PROGRAM_MODIFICATION_REQUESTS.find(r => r.id === requestId);
      if (!req || !text) return false;

      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const authAr = authorName || 'أحمد صبري';
      const authEn = authAr === 'أحمد صبري' ? 'Ahmed Sabry' : authAr;

      req.internal_notes.unshift({
        id: 'NOTE-' + Date.now(),
        author_ar: authAr,
        author_en: authEn,
        date: nowStr,
        text_ar: text,
        text_en: text
      });

      req.activity_log.unshift({
        id: 'ACT-MOD-' + Date.now(),
        date: nowStr,
        title_ar: 'إضافة ملاحظة داخلية خاصة',
        title_en: 'Internal Note Added',
        desc_ar: text.length > 50 ? text.slice(0, 50) + '...' : text,
        desc_en: text.length > 50 ? text.slice(0, 50) + '...' : text,
        actor_ar: authAr,
        actor_en: authEn,
        type: 'note'
      });

      return true;
    },

    sendModificationChatMessage: function (requestId, text, senderRole, senderName) {
      return this.sendModificationMessage(requestId, text, senderName, senderRole);
    },

    sendModificationMessage: function (requestId, text, senderName, senderRole) {
      const req = PROGRAM_MODIFICATION_REQUESTS.find(r => r.id === requestId);
      if (!req || !text) return false;
      if (req.conversation && req.conversation.is_closed) return false;

      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const nameAr = senderName || 'أحمد صبري';
      const nameEn = nameAr === 'أحمد صبري' ? 'Ahmed Sabry' : nameAr;

      if (!req.conversation) {
        req.conversation = { is_closed: false, closed_at: null, messages: [] };
      }

      req.conversation.messages.push({
        id: 'MSG-' + Date.now(),
        sender_type: 'accounts',
        sender_name_ar: nameAr,
        sender_name_en: nameEn,
        sender_role_ar: senderRole || 'موظف حسابات مالية — ميقات',
        sender_role_en: senderRole || 'Financial Accounts Officer — Miqat',
        date: nowStr,
        content_ar: text,
        content_en: text
      });

      req.activity_log.unshift({
        id: 'ACT-MOD-' + Date.now(),
        date: nowStr,
        title_ar: 'إرسال رسالة في محادثة الطلب',
        title_en: 'Message Sent in Conversation',
        desc_ar: text.length > 40 ? text.slice(0, 40) + '...' : text,
        desc_en: text.length > 40 ? text.slice(0, 40) + '...' : text,
        actor_ar: nameAr,
        actor_en: nameEn,
        type: 'message'
      });

      return true;
    },

    sendModificationChatMessage: function (requestId, text, senderRole, senderName) {
      return this.sendModificationMessage(requestId, text, senderName, senderRole);
    },

    getSLAConfigHours: function () {
      return SLA_CONFIG_HOURS;
    },

    setSLAConfigHours: function (hours) {
      const h = Number(hours);
      if (h > 0 && h <= 24) {
        SLA_CONFIG_HOURS = h;
        return true;
      }
      return false;
    },

    // Presence & Busy State Simulation (Accounts Staff)
    _employeeState: 'online_available', // 'online_available' | 'online_busy' | 'offline'

    getEmployeePresenceState: function () {
      return this._employeeState;
    },

    setEmployeePresenceState: function (state) {
      if (['online_available', 'online_busy', 'offline'].includes(state)) {
        this._employeeState = state;
        return true;
      }
      return false;
    },

    // Mock WhatsApp notification dispatch abstraction
    sendMockWhatsAppNotification: function (phone, message) {
      return {
        success: true,
        channel: 'whatsapp_mock_gateway',
        recipient: phone,
        message: message,
        timestamp: new Date().toISOString()
      };
    },

    // =========================================================================
    // CANCELLATIONS & SETTLEMENTS REGISTER DATASET & WORKFLOW ENGINE
    // =========================================================================
    getCancellationRequests: function (filterParams) {
      const filters = filterParams || {};
      let list = CANCELLATION_REQUESTS.slice();

      // Section filtering: 'current', 'archive', 'all'
      if (filters.section === 'current') {
        // Current: under_review OR (cancelled with refund NOT completed)
        list = list.filter(r => r.cancellation_status === 'under_review' || 
          (r.cancellation_status === 'cancelled' && r.refund_status !== 'completed'));
      } else if (filters.section === 'archive') {
        // Archive: Previous cancelled bookings where cancellation is cancelled AND refund is completed and settled
        list = list.filter(r => r.cancellation_status === 'cancelled' && r.refund_status === 'completed');
      } // 'all' includes everything (current, archive, rejected)

      // Query filter
      if (filters.query && typeof filters.query === 'string' && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        list = list.filter(r => {
          return (r.id && r.id.toLowerCase().includes(q)) ||
            (r.booking_id && r.booking_id.toLowerCase().includes(q)) ||
            (r.customer_name_ar && r.customer_name_ar.toLowerCase().includes(q)) ||
            (r.customer_name_en && r.customer_name_en.toLowerCase().includes(q)) ||
            (r.customer_phone && r.customer_phone.includes(q)) ||
            (r.company_name_ar && r.company_name_ar.toLowerCase().includes(q)) ||
            (r.company_name_en && r.company_name_en.toLowerCase().includes(q));
        });
      }

      // Source filter: 'customer', 'company', or 'all'
      if (filters.source && filters.source !== 'all') {
        list = list.filter(r => r.source === filters.source);
      }

      // Cancellation status filter
      if (filters.cancellation_status && filters.cancellation_status !== 'all') {
        list = list.filter(r => r.cancellation_status === filters.cancellation_status);
      }

      // Refund status filter
      if (filters.refund_status && filters.refund_status !== 'all') {
        list = list.filter(r => r.refund_status === filters.refund_status);
      }

      // Date range filter
      if (filters.dateFrom) {
        list = list.filter(r => r.created_at.slice(0, 10) >= filters.dateFrom);
      }
      if (filters.dateTo) {
        list = list.filter(r => r.created_at.slice(0, 10) <= filters.dateTo);
      }

      // Has pending payments filter
      if (filters.hasPendingPayments === true) {
        list = list.filter(r => (r.financials && r.financials.pending_paid > 0));
      }

      return list;
    },

    getCancellationDetails: function (id) {
      if (!id) return null;
      return CANCELLATION_REQUESTS.find(r => r.id === id) || null;
    },

    getCancellationSummary: function () {
      const all = CANCELLATION_REQUESTS;
      const totalRequests = all.length;
      const awaitingReview = all.filter(r => r.cancellation_status === 'under_review').length;
      const pendingRefunds = all.filter(r => r.cancellation_status === 'cancelled' && (r.refund_status === 'pending' || r.refund_status === 'processing')).length;
      const completedRefunds = all.filter(r => r.cancellation_status === 'cancelled' && r.refund_status === 'completed').length;
      const failedOperations = all.filter(r => r.refund_status === 'failed').length;

      // Financial totals
      let totalRefundDuePending = 0;
      let totalRefundExecuted = 0;
      all.forEach(r => {
        if (r.cancellation_status === 'cancelled') {
          if (r.refund_status === 'completed') {
            totalRefundExecuted += (r.financials.executed_refund || 0);
          } else {
            totalRefundDuePending += (r.financials.refund_due || 0);
          }
        }
      });

      return {
        totalRequests: totalRequests,
        awaitingReview: awaitingReview,
        pendingRefunds: pendingRefunds,
        completedRefunds: completedRefunds,
        failedOperations: failedOperations,
        totalRefundDuePending: totalRefundDuePending,
        totalRefundExecuted: totalRefundExecuted
      };
    },

    approveCancellation: function (id, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req) return { success: false, error: 'Request not found' };
      if (req.cancellation_status !== 'under_review') {
        return { success: false, error: 'Request is not under review' };
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      req.cancellation_status = 'cancelled';
      // Strictly set refund_status to pending so it moves to refund workflow
      req.refund_status = 'pending';
      req.updated_at = now;

      // Update financial balance
      req.financials.refund_due = req.financials.approved_paid;
      req.financials.remaining_refund = req.financials.refund_due;

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'اعتماد إلغاء الحجز رسمياً',
        title_en: 'Booking Cancellation Approved',
        desc_ar: 'تم اعتماد طلب الإلغاء من قبل موظف الحسابات وإحالة المستحقات المالية لقسم الاسترداد (' + req.financials.refund_due.toLocaleString('ar-EG') + ' ج.م).',
        desc_en: 'Cancellation request approved by accounts officer and forwarded for refund execution (' + req.financials.refund_due.toLocaleString('en-US') + ' EGP).',
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'approval'
      });

      return { success: true, request: req };
    },

    rejectCancellation: function (id, reasonAr, reasonEn, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req) return { success: false, error: 'Request not found' };
      if (!reasonAr || !reasonAr.trim()) {
        return { success: false, error: 'Mandatory rejection reason missing' };
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      req.cancellation_status = 'rejected';
      req.refund_status = 'none'; // Refund blocked!
      req.rejection_reason_ar = reasonAr.trim();
      req.rejection_reason_en = reasonEn && reasonEn.trim() ? reasonEn.trim() : reasonAr.trim();
      req.updated_at = now;

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'رفض طلب الإلغاء وتثبيت الحجز',
        title_en: 'Cancellation Rejected (Booking Retained)',
        desc_ar: 'تم رفض طلب الإلغاء مع ذكر السبب الإلزامي: ' + req.rejection_reason_ar,
        desc_en: 'Cancellation request rejected with mandatory reason: ' + req.rejection_reason_en,
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'rejection'
      });

      return { success: true, request: req };
    },

    recordRefund: function (id, refundData, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req) return { success: false, error: 'Request not found' };
      if (req.cancellation_status !== 'cancelled') {
        return { success: false, error: 'Cancellation must be approved before recording refund' };
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      const opId = 'REF-OP-' + Date.now();
      const amount = Number(refundData.amount) || req.financials.refund_due;
      const method = refundData.method || 'bank_transfer';
      const methodMapAr = {
        'bank_transfer': 'تحويل بنكي رسمي',
        'instapay': 'شبكة المدفوعات اللحظية (إنستاباي)',
        'card_reversal': 'رد للبطاقة الائتمانية الأصلية',
        'vodafone_cash': 'محفظة فودافون كاش'
      };
      const methodMapEn = {
        'bank_transfer': 'Official Bank Wire',
        'instapay': 'InstaPay IPN Network',
        'card_reversal': 'Credit Card Reversal',
        'vodafone_cash': 'Vodafone Cash E-Wallet'
      };

      const newOp = {
        id: opId,
        date: now,
        amount: amount,
        method: method,
        method_ar: methodMapAr[method] || method,
        method_en: methodMapEn[method] || method,
        bank_name_ar: refundData.bank_name_ar || 'البنك الأهلي المصري',
        bank_name_en: refundData.bank_name_en || 'National Bank of Egypt (NBE)',
        beneficiary_name_ar: refundData.beneficiary_name_ar || req.customer_name_ar,
        beneficiary_name_en: refundData.beneficiary_name_en || req.customer_name_en,
        account_iban: refundData.iban || 'EG380002000100000002938472910',
        reference_no: refundData.reference_no || ('TRX-REF-' + Math.floor(100000 + Math.random() * 900000)),
        status: 'processing',
        status_ar: 'قيد التحويل والمعالجة البنكية',
        status_en: 'Processing with Bank',
        voucher_file: refundData.voucher_file || 'Refund_Bank_Transfer_Slip.pdf',
        voucher_size: '640 KB',
        notes_ar: refundData.notes_ar || 'تم إرسال أمر التحويل إلى البنك المعتمد للمقاصة والتنفيذ',
        notes_en: refundData.notes_en || 'Transfer instruction dispatched to partner clearing bank'
      };

      if (!req.refund_operations) req.refund_operations = [];
      req.refund_operations.unshift(newOp);

      req.refund_status = 'processing';
      req.updated_at = now;

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'تسجيل أمر تحويل الاسترداد المالي',
        title_en: 'Refund Transfer Instruction Recorded',
        desc_ar: 'تم تسجيل تحويل استرداد بمبلغ (' + amount.toLocaleString('ar-EG') + ' ج.م) عبر ' + newOp.method_ar + ' بالمرجع: ' + newOp.reference_no,
        desc_en: 'Recorded refund transfer of (' + amount.toLocaleString('en-US') + ' EGP) via ' + newOp.method_en + ' Ref: ' + newOp.reference_no,
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'refund_processing'
      });

      return { success: true, operation: newOp, request: req };
    },

    confirmRefundCompletion: function (id, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req) return { success: false, error: 'Request not found' };
      if (req.cancellation_status !== 'cancelled') {
        return { success: false, error: 'Cancellation is not approved' };
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      req.refund_status = 'completed';
      req.financials.executed_refund = req.financials.refund_due;
      req.financials.remaining_refund = 0;
      req.updated_at = now;

      // Update latest refund op to completed
      if (req.refund_operations && req.refund_operations.length > 0) {
        req.refund_operations[0].status = 'completed';
        req.refund_operations[0].status_ar = 'مكتمل ومؤكد بنكياً';
        req.refund_operations[0].status_en = 'Completed & Confirmed';
        req.refund_operations[0].confirmed_at = now;
      }

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'تأكيد اكتمال الاسترداد والتسوية النهائية',
        title_en: 'Refund Settlement Confirmed & Completed',
        desc_ar: 'تم تأكيد وصول التحويل لحساب المستفيد ومطابقة كشف الحساب البنكي وإقفال المطالبة المالية بنجاح ونقل السجل للأرشيف.',
        desc_en: 'Confirmed funds credit to beneficiary, bank statement reconciled, claim closed and archived.',
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'refund_completed'
      });

      return { success: true, request: req };
    },

    retryFailedRefund: function (id, retryData, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req) return { success: false, error: 'Request not found' };

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      const newRef = retryData.reference_no || ('RETRY-TRX-' + Math.floor(100000 + Math.random() * 900000));
      const retryOp = {
        id: 'REF-RETRY-' + Date.now(),
        date: now,
        amount: req.financials.refund_due,
        method: retryData.method || 'bank_transfer',
        method_ar: retryData.method_ar || 'تحويل بنكي سريع (إعادة محاولة)',
        method_en: retryData.method_en || 'Express Bank Wire (Retry)',
        bank_name_ar: retryData.bank_name_ar || 'بنك مصر',
        bank_name_en: retryData.bank_name_en || 'Banque Misr',
        beneficiary_name_ar: retryData.beneficiary_name_ar || req.customer_name_ar,
        beneficiary_name_en: retryData.beneficiary_name_en || req.customer_name_en,
        account_iban: retryData.iban || 'EG120002000100000009948211029',
        reference_no: newRef,
        status: 'processing',
        status_ar: 'قيد إعادة المحاولة والمعالجة',
        status_en: 'Retrying & Processing',
        voucher_file: retryData.voucher_file || 'Retry_Bank_Transfer_Slip.pdf',
        voucher_size: '512 KB',
        notes_ar: retryData.notes_ar || 'إعادة إرسال التحويل بعد تصحيح بيانات الآيبان البنكي',
        notes_en: retryData.notes_en || 'Transfer re-dispatched after IBAN correction'
      };

      if (!req.refund_operations) req.refund_operations = [];
      req.refund_operations.unshift(retryOp);

      req.refund_status = 'processing';
      req.updated_at = now;

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'إعادة محاولة تحويل الاسترداد المتعثر',
        title_en: 'Retry Initiated for Failed Refund',
        desc_ar: 'تمت إعادة تنفيذ التحويل المالي برقم مرجع: ' + newRef + ' بعد تحديث وتصحيح البيانات البنكية.',
        desc_en: 'Re-executed transfer with ref: ' + newRef + ' after bank credentials update.',
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'retry_initiated'
      });

      return { success: true, operation: retryOp, request: req };
    },

    recordCorrectiveAction: function (id, correctiveData, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req) return { success: false, error: 'Request not found' };

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      const actionRecord = {
        id: 'CORR-' + Date.now(),
        date: now,
        type: correctiveData.type || 'iban_update',
        type_ar: correctiveData.type_ar || 'تصحيح رقم الحساب والآيبان البنكي',
        type_en: correctiveData.type_en || 'Bank Account & IBAN Correction',
        desc_ar: correctiveData.desc_ar || 'تم التحقق من شهادة الحساب البنكي وتصحيح رقم الآيبان المعتمد للعميل',
        desc_en: correctiveData.desc_en || 'Verified customer bank certificate and updated approved IBAN',
        actor_ar: actorAr,
        actor_en: actorEn
      };

      if (!req.corrective_actions) req.corrective_actions = [];
      req.corrective_actions.unshift(actionRecord);
      req.updated_at = now;

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'تسجيل إجراء تصحيحي نظامي',
        title_en: 'Systemic Corrective Action Recorded',
        desc_ar: actionRecord.type_ar + ': ' + actionRecord.desc_ar,
        desc_en: actionRecord.type_en + ': ' + actionRecord.desc_en,
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'corrective_action'
      });

      return { success: true, action: actionRecord, request: req };
    },

    addCancellationInternalNote: function (id, noteText, actorName) {
      const req = CANCELLATION_REQUESTS.find(r => r.id === id);
      if (!req || !noteText) return false;

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const actorAr = actorName || 'أحمد صبري';
      const actorEn = actorAr === 'أحمد صبري' ? 'Ahmed Sabry' : actorAr;

      if (!req.internal_notes) req.internal_notes = [];
      req.internal_notes.unshift({
        id: 'CAN-NOTE-' + Date.now(),
        author_ar: actorAr,
        author_en: actorEn,
        date: now,
        text_ar: noteText,
        text_en: noteText
      });

      req.activity_log.unshift({
        id: 'ACT-CAN-' + Date.now(),
        date: now,
        title_ar: 'إضافة ملاحظة داخلية خاصة بالإلغاء',
        title_en: 'Internal Cancellation Note Added',
        desc_ar: noteText.length > 50 ? noteText.slice(0, 50) + '...' : noteText,
        desc_en: noteText.length > 50 ? noteText.slice(0, 50) + '...' : noteText,
        actor_ar: actorAr,
        actor_en: actorEn,
        type: 'internal_note'
      });

      return true;
    },

    getScheduledReportTemplates: function () {
      return [
        {
          id: 'REP-SCH-01',
          name_ar: 'التقرير اليومي الآلي للإلغاءات والتسويات',
          name_en: 'Daily Automated Cancellations & Settlements Report',
          frequency_ar: 'يومياً الساعة ٠٨:٠٠ صباحاً (بتوقيت القاهرة)',
          frequency_en: 'Daily at 08:00 AM (Cairo Time)',
          next_run: '2026-11-07 08:00',
          status: 'active',
          status_ar: 'مجدول ونشط',
          status_en: 'Active Schedule',
          recipients: ['finance.director@miqat.com', 'accounts.ops@miqat.com', 'settlements@miqat.com'],
          format: 'XLSX (Excel)',
          description_ar: 'يتضمن كشفاً بجميع الطلبات الجديدة، المبالغ المستردة المنفذة، والعمليات المتعثرة خلال الـ ٢٤ ساعة الماضية.',
          description_en: 'Covers all new cancellation requests, executed refunds, and failed operations during the last 24 hours.'
        },
        {
          id: 'REP-SCH-02',
          name_ar: 'التقرير الأسبوعي الشامل للمستحقات والعمليات المتعثرة',
          name_en: 'Weekly Comprehensive Dues & Failed Operations Report',
          frequency_ar: 'كل يوم أحد الساعة ٠٨:٠٠ صباحاً',
          frequency_en: 'Every Sunday at 08:00 AM',
          next_run: '2026-11-08 08:00',
          status: 'active',
          status_ar: 'مجدول ونشط',
          status_en: 'Active Schedule',
          recipients: ['cfo@miqat.com', 'auditing@miqat.com', 'finance.director@miqat.com'],
          format: 'XLSX (Excel)',
          description_ar: 'تحليل أسبوعي تراكمي للأرصدة المستحقة للاسترداد، نسب الإنجاز، وأداء معالجة الإخفاقات البنكية.',
          description_en: 'Weekly cumulative audit of pending refund dues, completion rates, and banking resolution performance.'
        },
        {
          id: 'REP-SCH-03',
          name_ar: 'تقرير الإقفال المالي الشهري لحسابات الإلغاء',
          name_en: 'Monthly Financial Closing Report for Cancellations',
          frequency_ar: 'اليوم الأول من كل شهر ميلادي الساعة ٠٨:٠٠ صباحاً',
          frequency_en: '1st of every month at 08:00 AM',
          next_run: '2026-12-01 08:00',
          status: 'active',
          status_ar: 'مجدول ونشط',
          status_en: 'Active Schedule',
          recipients: ['cfo@miqat.com', 'external.auditors@miqat.com', 'board.finance@miqat.com'],
          format: 'XLSX (Excel)',
          description_ar: 'كشف المطابقة المالية الشامل لمستحقات شركات السياحة والعملاء للأغراض المحاسبية والميزانية العامة.',
          description_en: 'Comprehensive financial reconciliation of agency and customer settlements for statutory ledger balance.'
        }
      ];
    },

    getReportHistory: function () {
      return [
        {
          id: 'RPT-GEN-2026-088',
          title_ar: 'التقرير اليومي لسجل الإلغاءات — ٠٥ نوفمبر ٢٠٢٦',
          title_en: 'Daily Cancellations Register Report — Nov 05, 2026',
          generated_at: '2026-11-05 08:00',
          generated_by_ar: 'النظام الآلي (Cron)',
          generated_by_en: 'Automated System (Cron)',
          type: 'daily_auto',
          records_count: 12,
          file_size: '48.5 KB',
          filename: 'Miqat_Cancellations_Daily_2026-11-05.xlsx'
        },
        {
          id: 'RPT-GEN-2026-087',
          title_ar: 'التقرير اليومي لسجل الإلغاءات — ٠٤ نوفمبر ٢٠٢٦',
          title_en: 'Daily Cancellations Register Report — Nov 04, 2026',
          generated_at: '2026-11-04 08:00',
          generated_by_ar: 'النظام الآلي (Cron)',
          generated_by_en: 'Automated System (Cron)',
          type: 'daily_auto',
          records_count: 11,
          file_size: '46.2 KB',
          filename: 'Miqat_Cancellations_Daily_2026-11-04.xlsx'
        },
        {
          id: 'RPT-GEN-2026-086',
          title_ar: 'التقرير الأسبوعي للمستحقات والعمليات المتعثرة — أسبوع ٤٤',
          title_en: 'Weekly Settlements & Failed Operations Report — Week 44',
          generated_at: '2026-11-01 08:00',
          generated_by_ar: 'النظام الآلي (Cron)',
          generated_by_en: 'Automated System (Cron)',
          type: 'weekly_auto',
          records_count: 38,
          file_size: '112.4 KB',
          filename: 'Miqat_Cancellations_Weekly_W44_2026.xlsx'
        },
        {
          id: 'RPT-GEN-2026-085',
          title_ar: 'تقرير مخصص يدوي — الربع الثالث والربع الرابع',
          title_en: 'Custom Manual Export — Q3 & Q4 Settled Claims',
          generated_at: '2026-10-31 16:45',
          generated_by_ar: 'أحمد صبري (موظف حسابات)',
          generated_by_en: 'Ahmed Sabry (Accounts Officer)',
          type: 'manual_custom',
          records_count: 24,
          file_size: '78.9 KB',
          filename: 'Miqat_Custom_Cancellations_Oct2026.xlsx'
        }
      ];
    },

    /* =========================================================================
     * PAGE 7: COLLECTIONS & CASH DEPOSITS / SETTLEMENTS MOCK DATA & ENGINES
     * ========================================================================= */

    // Configurable Settlement Financial Settings (provisional rates, not hardcoded formulas)
    SETTLEMENT_CONFIG: {
      commissionRate: 0.20, // 20% provisional
      depositRate: 0.30     // 30% provisional
    },

    getSettlementConfig: function () {
      return Object.assign({}, this.SETTLEMENT_CONFIG);
    },

    updateSettlementConfig: function (newConfig) {
      if (newConfig && typeof newConfig.commissionRate === 'number') {
        this.SETTLEMENT_CONFIG.commissionRate = newConfig.commissionRate;
      }
      if (newConfig && typeof newConfig.depositRate === 'number') {
        this.SETTLEMENT_CONFIG.depositRate = newConfig.depositRate;
      }
      return this.getSettlementConfig();
    },

    // Collections Mock Dataset (Electronic only: Bank Transfer, InstaPay, Vodafone Cash, Wallets)
    COLLECTIONS_DATA: [
      {
        id: 'COL-2026-0501',
        booking_id: 'BKG-2026-1042',
        customer_id: 'CUST-1042',
        customer_name_ar: 'محمد إبراهيم السيد',
        customer_name_en: 'Mohamed Ibrahim El-Sayed',
        customer_phone: '+20 100 123 4567',
        program_name_ar: 'عمرة رجب الاقتصادية — 1448 هـ',
        program_name_en: 'Rajab Economy Umrah — 1448 AH',
        program_total: 120000,
        amount: 36000,
        payment_method: 'bank_transfer',
        transaction_date: '2026-11-04 14:20',
        status: 'approved',
        provider_status: 'verified',
        provider_name: 'National Bank of Egypt (NBE)',
        rrn: 'NBE-9928104829',
        sender_account: 'EG3800020001000000123456789',
        beneficiary_account: 'Miqat Main Escrow — NBE (EG9200030001000000998877665)',
        proof_file: {
          filename: 'NBE_Transfer_Receipt_36000.png',
          size: '2.4 MB',
          uploaded_at: '2026-11-04 14:25',
          thumb_label: 'إشعار تحويل البنك الأهلي المصري'
        },
        assigned_emp_ar: 'أحمد صبري',
        assigned_emp_en: 'Ahmed Sabry',
        notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-04 14:35', text: 'تمت مطابقة رقم العملية RRN مع كشف حساب البنك الأهلي واعتماد التحصيل فوراً.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-04 14:25', actor_ar: 'العميل (البوابة الإلكترونية)', actor_en: 'Customer (Portal)', details_ar: 'تم رفع إشعار تحويل بنكي بمبلغ ٣٦,٠٠٠ ج.م', details_en: 'Uploaded bank transfer receipt for 36,000 EGP' },
          { action: 'provider_verified', date: '2026-11-04 14:30', actor_ar: 'نظام الربط البنكي الآلي', actor_en: 'Automated Bank Gateway', details_ar: 'تم التأكد من قيد المبلغ في حساب ميقات الرئيسي', details_en: 'Confirmed funds credit to Miqat main escrow account' },
          { action: 'collection_approved', date: '2026-11-04 14:35', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', details_ar: 'اعتماد التحصيل وربطه بدفعة حجز BKG-2026-1042', details_en: 'Approved collection and linked to booking BKG-2026-1042' }
        ]
      },
      {
        id: 'COL-2026-0502',
        booking_id: 'BKG-2026-1039',
        customer_id: 'CUST-1039',
        customer_name_ar: 'فاطمة الزهراء الشربيني',
        customer_name_en: 'Fatima Al-Zahraa El-Sherbini',
        customer_phone: '+20 111 884 9201',
        program_name_ar: 'رحلة عمرة شعبان المميزة — فنادق الحرم',
        program_name_en: 'Shaban Premium Umrah — Haram Hotels',
        program_total: 180000,
        amount: 54000,
        payment_method: 'instapay',
        transaction_date: '2026-11-05 10:15',
        status: 'under_review',
        provider_status: 'pending',
        provider_name: 'InstaPay Network (IPN)',
        rrn: 'IPN-8849201847',
        sender_account: 'fatima.sherbini@instapay',
        beneficiary_account: 'miqat.business@instapay',
        proof_file: {
          filename: 'InstaPay_Confirmation_54000.jpg',
          size: '1.1 MB',
          uploaded_at: '2026-11-05 10:18',
          thumb_label: 'لقطة شاشة تأكيد إنستاباي'
        },
        assigned_emp_ar: 'أحمد صبري',
        assigned_emp_en: 'Ahmed Sabry',
        notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-05 10:45', text: 'بانتظار تسوية شبكة إنستاباي اليومية للتأكد من القيد البنكي النهائي.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-05 10:18', actor_ar: 'العميل (تطبيق الهاتف)', actor_en: 'Customer (Mobile App)', details_ar: 'رفع إشعار تحويل إنستاباي ٥٤,٠٠٠ ج.م', details_en: 'Uploaded InstaPay confirmation for 54,000 EGP' },
          { action: 'under_review', date: '2026-11-05 10:20', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', details_ar: 'قيد مراجعة التسوية اللحظية للمزود', details_en: 'Under instant gateway settlement audit' }
        ]
      },
      {
        id: 'COL-2026-0503',
        booking_id: 'BKG-2026-1025',
        customer_id: 'CUST-1025',
        customer_name_ar: 'محمود عبد العزيز الجمال',
        customer_name_en: 'Mahmoud Abdel Aziz El-Gammal',
        customer_phone: '+20 122 345 6789',
        program_name_ar: 'برنامج العمرة الاقتصادية — باقة رجب 1448',
        program_name_en: 'Economy Umrah Package — Rajab 1448',
        program_total: 95000,
        amount: 28500,
        payment_method: 'vodafone_cash',
        transaction_date: '2026-11-04 16:50',
        status: 'approved',
        provider_status: 'verified',
        provider_name: 'Vodafone Cash Merchant',
        rrn: 'VF-6638102948',
        sender_account: '+20 122 345 6789',
        beneficiary_account: 'Miqat Corporate Wallet (01099887766)',
        proof_file: {
          filename: 'Vodafone_Cash_SMS_28500.png',
          size: '850 KB',
          uploaded_at: '2026-11-04 16:55',
          thumb_label: 'رسالة إتمام تحويل محفظة فودافون كاش'
        },
        assigned_emp_ar: 'سارة ممدوح',
        assigned_emp_en: 'Sarah Mamdouh',
        notes: [
          { author_ar: 'سارة ممدوح', author_en: 'Sarah Mamdouh', date: '2026-11-04 17:10', text: 'تم التحقق من رسالة بوابة فودافون ورقم المعاملة مطابق.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-04 16:55', actor_ar: 'العميل', actor_en: 'Customer', details_ar: 'إشعار سداد محفظة فودافون كاش', details_en: 'Vodafone Cash wallet payment proof' },
          { action: 'provider_verified', date: '2026-11-04 17:05', actor_ar: 'بوابة فودافون للشركات', actor_en: 'Vodafone Corporate API', details_ar: 'تأكيد استلام المبلغ في المحفظة التجارية', details_en: 'Confirmed receipt in merchant wallet' },
          { action: 'collection_approved', date: '2026-11-04 17:10', actor_ar: 'سارة ممدوح', actor_en: 'Sarah Mamdouh', details_ar: 'اعتماد التحصيل بنجاح', details_en: 'Collection successfully approved' }
        ]
      },
      {
        id: 'COL-2026-0504',
        booking_id: 'BKG-2026-0988',
        customer_id: 'CUST-0988',
        customer_name_ar: 'طارق حسام الدين فهمي',
        customer_name_en: 'Tarek Hossam El-Din Fahmy',
        customer_phone: '+20 102 998 7766',
        program_name_ar: 'عمرة النصف من شعبان — فندق دار التوحيد',
        program_name_en: 'Mid-Shaban Umrah — Dar Al-Tawhid',
        program_total: 150000,
        amount: 45000,
        payment_method: 'bank_transfer',
        transaction_date: '2026-11-05 09:30',
        status: 'under_review',
        provider_status: 'mismatch',
        provider_name: 'Banque Misr Gateway',
        rrn: 'BM-291048201',
        sender_account: 'EG1200020001000000887766554',
        beneficiary_account: 'Miqat Main Escrow — BM (EG5500020001000000112233445)',
        proof_file: {
          filename: 'Banque_Misr_Transfer_Slip.pdf',
          size: '3.1 MB',
          uploaded_at: '2026-11-05 09:35',
          thumb_label: 'إيصال تحويل بنك مصر ورقي'
        },
        assigned_emp_ar: 'أحمد صبري',
        assigned_emp_en: 'Ahmed Sabry',
        notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-05 10:00', text: 'المبلغ المذكور في الإيصال الورقي ٤٥,٠٠٠ ج.م بينما المبلغ المسجل بحساب البنك ٤٤,٥٠٠ ج.م بسبب خصم عمولة تحويل. جاري التدقيق مع العميل.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-05 09:35', actor_ar: 'العميل', actor_en: 'Customer', details_ar: 'رفع إيصال تحويل بنك مصر', details_en: 'Uploaded Banque Misr receipt' },
          { action: 'under_review', date: '2026-11-05 10:00', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', details_ar: 'تحديد تفاوت ٥٠٠ ج.م عمولة تحويل بنكي', details_en: 'Identified 500 EGP bank fee deduction variance' }
        ]
      },
      {
        id: 'COL-2026-0505',
        booking_id: 'BKG-2026-0954',
        customer_id: 'CUST-0954',
        customer_name_ar: 'سعاد أحمد المنشاوي',
        customer_name_en: 'Souad Ahmed El-Menshawy',
        customer_phone: '+20 114 556 7788',
        program_name_ar: 'برنامج عمرة رمضان المبارك — العشر الأوائل',
        program_name_en: 'Ramadan Umrah — First 10 Days',
        program_total: 210000,
        amount: 63000,
        payment_method: 'instapay',
        transaction_date: '2026-11-03 18:40',
        status: 'approved',
        provider_status: 'verified',
        provider_name: 'InstaPay Network (IPN)',
        rrn: 'IPN-5549201948',
        sender_account: 'souad.menshawy@instapay',
        beneficiary_account: 'miqat.business@instapay',
        proof_file: {
          filename: 'InstaPay_Receipt_63000.png',
          size: '1.4 MB',
          uploaded_at: '2026-11-03 18:42',
          thumb_label: 'إشعار تحويل إنستاباي مكتمل'
        },
        assigned_emp_ar: 'أحمد صبري',
        assigned_emp_en: 'Ahmed Sabry',
        notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-03 19:00', text: 'تم التحقق من مطابقة الحساب والاسم مع سجل الحجز.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-03 18:42', actor_ar: 'العميل', actor_en: 'Customer', details_ar: 'رفع إشعار تحويل فوري', details_en: 'Instant transfer proof uploaded' },
          { action: 'provider_verified', date: '2026-11-03 18:50', actor_ar: 'شبكة المدفوعات اللحظية IPN', actor_en: 'IPN Network', details_ar: 'تسوية لحظية معتمدة', details_en: 'Instant settlement approved' },
          { action: 'collection_approved', date: '2026-11-03 19:00', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', details_ar: 'اعتماد التحصيل بالكامل', details_en: 'Collection fully approved' }
        ]
      },
      {
        id: 'COL-2026-0506',
        booking_id: 'BKG-2026-0920',
        customer_id: 'CUST-0920',
        customer_name_ar: 'ياسر كمال الألفي',
        customer_name_en: 'Yasser Kamal El-Alfy',
        customer_phone: '+20 101 223 3445',
        program_name_ar: 'عمرة رجب الاقتصادية — باقة الهدى',
        program_name_en: 'Rajab Economy Umrah — Al-Huda Package',
        program_total: 110000,
        amount: 33000,
        payment_method: 'bank_transfer',
        transaction_date: '2026-11-02 11:20',
        status: 'rejected',
        provider_status: 'unverified',
        provider_name: 'CIB Egypt Gateway',
        rrn: 'CIB-1948201948',
        sender_account: 'EG4400030001000000334455667',
        beneficiary_account: 'Miqat Main Escrow — CIB (EG1100030001000000990011223)',
        proof_file: {
          filename: 'CIB_Receipt_Unclear.jpg',
          size: '540 KB',
          uploaded_at: '2026-11-02 11:25',
          thumb_label: 'صورة غير واضحة للإيصال'
        },
        assigned_emp_ar: 'سارة ممدوح',
        assigned_emp_en: 'Sarah Mamdouh',
        notes: [
          { author_ar: 'سارة ممدوح', author_en: 'Sarah Mamdouh', date: '2026-11-02 12:00', text: 'الصورة المرفوعة مظلمة تماماً ولا يظهر بها تاريخ العملية أو الحساب المحول إليه. تم رفض الإشعار وطلب إعادة الإرفاق.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-02 11:25', actor_ar: 'العميل', actor_en: 'Customer', details_ar: 'رفع إشعار تحويل CIB', details_en: 'Uploaded CIB receipt' },
          { action: 'collection_rejected', date: '2026-11-02 12:00', actor_ar: 'سارة ممدوح', actor_en: 'Sarah Mamdouh', details_ar: 'رفض الإشعار لعدم وضوح البيانات وطلب إعادة الإرفاق', details_en: 'Rejected receipt due to illegible image and requested re-upload' }
        ]
      },
      {
        id: 'COL-2026-0507',
        booking_id: 'BKG-2026-0899',
        customer_id: 'CUST-0899',
        customer_name_ar: 'خالد عبد الرحمن السواح',
        customer_name_en: 'Khaled Abdel Rahman El-Sawah',
        customer_phone: '+20 120 776 5544',
        program_name_ar: 'رحلة عمرة شعبان الاقتصادية — 1448 هـ',
        program_name_en: 'Shaban Economy Umrah — 1448 AH',
        program_total: 100000,
        amount: 30000,
        payment_method: 'wallet',
        transaction_date: '2026-11-05 11:00',
        status: 'awaiting_provider',
        provider_status: 'pending',
        provider_name: 'Etisalat Cash Gateway',
        rrn: 'ET-994820194',
        sender_account: '+20 120 776 5544',
        beneficiary_account: 'Miqat Digital Wallet (01188776655)',
        proof_file: {
          filename: 'Etisalat_Cash_Slip_30000.png',
          size: '920 KB',
          uploaded_at: '2026-11-05 11:02',
          thumb_label: 'إيصال تحويل اتصالات كاش'
        },
        assigned_emp_ar: 'أحمد صبري',
        assigned_emp_en: 'Ahmed Sabry',
        notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-05 11:15', text: 'بانتظار رد استعلام Webhook من مزود بوابة الدفع.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-05 11:02', actor_ar: 'العميل', actor_en: 'Customer', details_ar: 'رفع إشعار محفظة اتصالات كاش', details_en: 'Uploaded Etisalat Cash wallet slip' },
          { action: 'awaiting_provider', date: '2026-11-05 11:15', actor_ar: 'نظام الربط الإلكتروني', actor_en: 'Electronic Gateway System', details_ar: 'إرسال طلب تحقق من حالة العملية', details_en: 'Dispatched transaction verification request' }
        ]
      },
      {
        id: 'COL-2026-0508',
        booking_id: 'BKG-2026-0870',
        customer_id: 'CUST-0870',
        customer_name_ar: 'نادية إبراهيم القاضي',
        customer_name_en: 'Nadia Ibrahim El-Kadi',
        customer_phone: '+20 115 443 2211',
        program_name_ar: 'عمرة رجب — باقة المدينة ومكة الميسرة',
        program_name_en: 'Rajab Umrah — Medina & Mecca Budget',
        program_total: 130000,
        amount: 39000,
        payment_method: 'instapay',
        transaction_date: '2026-11-01 15:30',
        status: 'approved',
        provider_status: 'verified',
        provider_name: 'InstaPay Network (IPN)',
        rrn: 'IPN-3349201844',
        sender_account: 'nadia.kadi@instapay',
        beneficiary_account: 'miqat.business@instapay',
        proof_file: {
          filename: 'InstaPay_Receipt_39000.jpg',
          size: '1.2 MB',
          uploaded_at: '2026-11-01 15:32',
          thumb_label: 'إشعار إنستاباي بنك مصر'
        },
        assigned_emp_ar: 'أحمد صبري',
        assigned_emp_en: 'Ahmed Sabry',
        notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-01 15:45', text: 'تم تدقيق الإشعار والقيد سليم.' }
        ],
        history: [
          { action: 'proof_uploaded', date: '2026-11-01 15:32', actor_ar: 'العميل', actor_en: 'Customer', details_ar: 'رفع إشعار تحويل', details_en: 'Proof uploaded' },
          { action: 'provider_verified', date: '2026-11-01 15:40', actor_ar: 'شبكة IPN', actor_en: 'IPN Network', details_ar: 'مطابقة المعاملة وقيد الرصيد', details_en: 'Transaction matched and credited' },
          { action: 'collection_approved', date: '2026-11-01 15:45', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', details_ar: 'اعتماد نهائي للتحصيل', details_en: 'Final collection approval' }
        ]
      }
    ],

    // Settlements Mock Dataset (Independent record per booking with configurable equations)
    SETTLEMENTS_DATA: [
      {
        id: 'SET-2026-0301',
        booking_id: 'BKG-2026-1042',
        customer_name_ar: 'محمد إبراهيم السيد',
        customer_name_en: 'Mohamed Ibrahim El-Sayed',
        tourism_company_ar: 'شركة الهداية للسياحة الدينية',
        tourism_company_en: 'Al-Hedaya Religious Tourism Co.',
        program_name_ar: 'عمرة رجب الاقتصادية — 1448 هـ',
        program_name_en: 'Rajab Economy Umrah — 1448 AH',
        program_total: 120000,
        deposit_paid: 36000,      // 30% received by Miqat
        direct_paid: 84000,       // 70% paid directly to tourism company
        commission_rate: 0.20,    // 20% provisional
        commission_amount: 24000, // 120,000 * 20%
        net_settlement: 12000,    // Deposit 36,000 - Commission 24,000 = 12,000 (Miqat owes company)
        net_direction: 'payable_to_company',
        company_confirmation: {
          status: 'confirmed',
          confirmed_at: '2026-11-03 16:30',
          confirmed_amount: 84000,
          company_ref: 'HED-REC-8849',
          notes: 'تم استلام المتبقي كاملاً نقداً وبإيصال رسمي من العميل بمقر الشركة.'
        },
        status: 'approved', // Approved — Awaiting Transfer
        version: 1,
        version_history: [
          {
            version: 'v1.0',
            date: '2026-11-04 11:00',
            author_ar: 'أحمد صبري (موظف حسابات)',
            author_en: 'Ahmed Sabry (Accounts Officer)',
            changes_ar: 'إعداد مسودة التسوية الأولى واحتساب عمولة ميقات ٢٤,٠٠٠ ج.م وصافي مستحق للشركة ١٢,٠٠٠ ج.م',
            changes_en: 'Prepared initial settlement draft, calculated Miqat commission 24,000 EGP, net payable 12,000 EGP',
            program_total: 120000,
            deposit_paid: 36000,
            commission_amount: 24000,
            net_settlement: 12000
          }
        ],
        workflow_log: [
          { step: 'company_confirmed', date: '2026-11-03 16:30', actor_ar: 'شركة الهداية للسياحة', actor_en: 'Al-Hedaya Tourism Co.', note_ar: 'تأكيد استلام المتبقي ٨٤,٠٠٠ ج.م', note_en: 'Confirmed direct receipt of 84,000 EGP' },
          { step: 'accounts_prepared', date: '2026-11-04 11:00', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', note_ar: 'إعداد التسوية ورفعها للاعتماد الإداري', note_en: 'Prepared settlement and submitted for Admin approval' },
          { step: 'admin_approved', date: '2026-11-04 15:30', actor_ar: 'محمود فهمي (المدير المالي)', actor_en: 'Mahmoud Fahmy (Financial Admin)', note_ar: 'اعتماد التسوية والموافقة على الصرف البنكي', note_en: 'Approved settlement and cleared for bank disbursement' }
        ],
        transfer_details: null,
        internal_notes: [
          { author_ar: 'محمود فهمي (المدير المالي)', author_en: 'Mahmoud Fahmy (Financial Admin)', date: '2026-11-04 15:30', text: 'معتمدة للصرف ضمن دفعة التحويلات البنكية الأسبوعية.' }
        ]
      },
      {
        id: 'SET-2026-0302',
        booking_id: 'BKG-2026-1039',
        customer_name_ar: 'فاطمة الزهراء الشربيني',
        customer_name_en: 'Fatima Al-Zahraa El-Sherbini',
        tourism_company_ar: 'شركة مناسك المشاعر للسياحة',
        tourism_company_en: 'Manasek Al-Mashaer Tourism',
        program_name_ar: 'رحلة عمرة شعبان المميزة — فنادق الحرم',
        program_name_en: 'Shaban Premium Umrah — Haram Hotels',
        program_total: 180000,
        deposit_paid: 54000,       // 30% received by Miqat
        direct_paid: 126000,       // 70% direct
        commission_rate: 0.20,     // 20%
        commission_amount: 36000,  // 180,000 * 20%
        net_settlement: 18000,     // Deposit 54,000 - Commission 36,000 = 18,000 (Miqat owes company)
        net_direction: 'payable_to_company',
        company_confirmation: {
          status: 'pending',
          confirmed_at: null,
          confirmed_amount: 0,
          company_ref: null,
          notes: 'الشركة لم تؤكد بعد استلام المتبقي من العميلة. التسوية معلقة.'
        },
        status: 'awaiting_conf', // BLOCKED: Awaiting Company Confirmation
        version: 1,
        version_history: [],
        workflow_log: [
          { step: 'blocked_pending_conf', date: '2026-11-05 10:20', actor_ar: 'نظام التسويات الآلي', actor_en: 'Settlements Core Engine', note_ar: 'التسوية معلقة بانتظار إشعار تأكيد شركة مناسك المشاعر', note_en: 'Settlement blocked pending agency confirmation slip' }
        ],
        transfer_details: null,
        internal_notes: [
          { author_ar: 'أحمد صبري', author_en: 'Ahmed Sabry', date: '2026-11-05 10:30', text: 'تم التواصل هاتفياً مع مسؤول الشركة وسيقوم بتأكيد السداد فور توقيع العقد النهائي.' }
        ]
      },
      {
        id: 'SET-2026-0303',
        booking_id: 'BKG-2026-1025',
        customer_name_ar: 'محمود عبد العزيز الجمال',
        customer_name_en: 'Mahmoud Abdel Aziz El-Gammal',
        tourism_company_ar: 'شركة طيبة الدولية للحج والعمرة',
        tourism_company_en: 'Taiba International Hajj & Umrah',
        program_name_ar: 'برنامج العمرة الاقتصادية — باقة رجب 1448',
        program_name_en: 'Economy Umrah Package — Rajab 1448',
        program_total: 95000,
        deposit_paid: 28500,       // 30%
        direct_paid: 66500,        // 70%
        commission_rate: 0.20,     // 20%
        commission_amount: 19000,  // 95,000 * 20%
        net_settlement: 9500,      // Deposit 28,500 - Commission 19,000 = 9,500 (Miqat owes company)
        net_direction: 'payable_to_company',
        company_confirmation: {
          status: 'confirmed',
          confirmed_at: '2026-11-04 17:30',
          confirmed_amount: 66500,
          company_ref: 'TAIBA-CONF-7721',
          notes: 'تم استلام المبلغ المتبقي عبر تحويل بنكي لحساب الشركة.'
        },
        status: 'awaiting_admin', // Prepared by Accounts, Awaiting Admin Approval
        version: 1,
        version_history: [
          {
            version: 'v1.0',
            date: '2026-11-05 09:15',
            author_ar: 'أحمد صبري (موظف حسابات)',
            author_en: 'Ahmed Sabry (Accounts Officer)',
            changes_ar: 'تم احتساب المعادلة المالية وصافي المستحق للشركة ٩,٥٠٠ ج.م وإرسالها للاعتماد الإداري',
            changes_en: 'Calculated financial breakdown, net payable 9,500 EGP, submitted for admin approval',
            program_total: 95000,
            deposit_paid: 28500,
            commission_amount: 19000,
            net_settlement: 9500
          }
        ],
        workflow_log: [
          { step: 'company_confirmed', date: '2026-11-04 17:30', actor_ar: 'شركة طيبة الدولية', actor_en: 'Taiba International', note_ar: 'تأكيد استلام المتبقي ٦٦,٥٠٠ ج.م', note_en: 'Confirmed direct receipt of 66,500 EGP' },
          { step: 'accounts_prepared', date: '2026-11-05 09:15', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', note_ar: 'إعداد التسوية ورفعها للاعتماد الإداري', note_en: 'Prepared settlement and submitted for Admin approval' }
        ],
        transfer_details: null,
        internal_notes: []
      },
      {
        id: 'SET-2026-0304',
        booking_id: 'BKG-2026-0988',
        customer_name_ar: 'طارق حسام الدين فهمي',
        customer_name_en: 'Tarek Hossam El-Din Fahmy',
        tourism_company_ar: 'شركة الفردوس للسياحة والخدمات الدينية',
        tourism_company_en: 'Al-Ferdous Religious Tourism Co.',
        program_name_ar: 'عمرة النصف من شعبان — فندق دار التوحيد',
        program_name_en: 'Mid-Shaban Umrah — Dar Al-Tawhid',
        program_total: 150000,
        deposit_paid: 45000,
        direct_paid: 105000,
        commission_rate: 0.20,
        commission_amount: 30000,
        net_settlement: 15000,
        net_direction: 'payable_to_company',
        company_confirmation: {
          status: 'confirmed',
          confirmed_at: '2026-11-02 14:00',
          confirmed_amount: 105000,
          company_ref: 'FER-REC-9941',
          notes: 'تم استلام المبلغ بموجب شيك مصرفي مقبول الدفع.'
        },
        status: 'returned', // Returned for Correction by Admin
        version: 2,
        version_history: [
          {
            version: 'v1.0',
            date: '2026-11-03 10:00',
            author_ar: 'سارة ممدوح (موظفة حسابات)',
            author_en: 'Sarah Mamdouh (Accounts Officer)',
            changes_ar: 'الإصدار المبدئي المرفوع للاعتماد',
            changes_en: 'Initial draft submitted for approval',
            program_total: 150000,
            deposit_paid: 45000,
            commission_amount: 30000,
            net_settlement: 15000
          }
        ],
        admin_return_reason: 'تم اكتشاف خصم مصاريف إدارية إضافية بقيمة ٥٠٠ ج.م غير مخصومة من صافي التسوية. يرجى تعديل المعادلة وإعادة الرفع.',
        workflow_log: [
          { step: 'company_confirmed', date: '2026-11-02 14:00', actor_ar: 'شركة الفردوس للسياحة', actor_en: 'Al-Ferdous Tourism Co.', note_ar: 'تأكيد استلام ١٠٥,٠٠٠ ج.م', note_en: 'Confirmed 105,000 EGP receipt' },
          { step: 'accounts_prepared', date: '2026-11-03 10:00', actor_ar: 'سارة ممدوح', actor_en: 'Sarah Mamdouh', note_ar: 'رفع مسودة التسوية الأولى', note_en: 'Submitted initial draft v1.0' },
          { step: 'admin_returned', date: '2026-11-03 14:20', actor_ar: 'محمود فهمي (المدير المالي)', actor_en: 'Mahmoud Fahmy (Financial Admin)', note_ar: 'إعادة التسوية مع طلب خصم ٥٠٠ ج.م مصاريف إدارية', note_en: 'Returned with note to deduct 500 EGP admin fee' }
        ],
        transfer_details: null,
        internal_notes: [
          { author_ar: 'محمود فهمي (المدير المالي)', author_en: 'Mahmoud Fahmy (Financial Admin)', date: '2026-11-03 14:20', text: 'يرجى مراجعة إشعار بنك مصر المرفق بحساب العميل والتحقق من العمولة الإضافية.' }
        ]
      },
      {
        id: 'SET-2026-0305',
        booking_id: 'BKG-2026-0954',
        customer_name_ar: 'سعاد أحمد المنشاوي',
        customer_name_en: 'Souad Ahmed El-Menshawy',
        tourism_company_ar: 'شركة الهداية للسياحة الدينية',
        tourism_company_en: 'Al-Hedaya Religious Tourism Co.',
        program_name_ar: 'برنامج عمرة رمضان المبارك — العشر الأوائل',
        program_name_en: 'Ramadan Umrah — First 10 Days',
        program_total: 210000,
        deposit_paid: 63000,
        direct_paid: 147000,
        commission_rate: 0.20,
        commission_amount: 42000,
        net_settlement: 21000,
        net_direction: 'payable_to_company',
        company_confirmation: {
          status: 'confirmed',
          confirmed_at: '2026-10-30 11:20',
          confirmed_amount: 147000,
          company_ref: 'HED-REC-7719',
          notes: 'مؤكد استلام كامل المتبقي بحساب الشركة بالبنك التجاري الدولي.'
        },
        status: 'completed', // Transfer Executed and Completed
        version: 1,
        version_history: [
          {
            version: 'v1.0',
            date: '2026-10-31 09:30',
            author_ar: 'أحمد صبري',
            author_en: 'Ahmed Sabry',
            changes_ar: 'تم إعداد التسوية واعتمادها وصرفها بنكياً',
            changes_en: 'Prepared, approved and disbursed',
            program_total: 210000,
            deposit_paid: 63000,
            commission_amount: 42000,
            net_settlement: 21000
          }
        ],
        workflow_log: [
          { step: 'company_confirmed', date: '2026-10-30 11:20', actor_ar: 'شركة الهداية', actor_en: 'Al-Hedaya Co.', note_ar: 'تأكيد استلام ١٤٧,٠٠٠ ج.م', note_en: 'Confirmed receipt 147,000 EGP' },
          { step: 'accounts_prepared', date: '2026-10-31 09:30', actor_ar: 'أحمد صبري', actor_en: 'Ahmed Sabry', note_ar: 'إعداد التسوية ورفعها', note_en: 'Prepared draft' },
          { step: 'admin_approved', date: '2026-10-31 12:00', actor_ar: 'محمود فهمي (المدير المالي)', actor_en: 'Mahmoud Fahmy', note_ar: 'اعتماد نهائي', note_en: 'Final approval' },
          { step: 'transfer_completed', date: '2026-11-01 10:15', actor_ar: 'محمود فهمي (المدير المالي)', actor_en: 'Mahmoud Fahmy', note_ar: 'تنفيذ التحويل البنكي وإرفاق إشعار السويفت', note_en: 'Swift transfer executed and recorded' }
        ],
        transfer_details: {
          bank_ref: 'SWIFT-NBE-8839201',
          sender_bank: 'National Bank of Egypt (NBE) Corporate',
          company_iban: 'EG4500020001000000998811223',
          transfer_date: '2026-11-01 10:15',
          amount: 21000,
          proof_filename: 'Swift_Transfer_Advice_21000.pdf',
          verified_by_ar: 'محمود فهمي (المدير المالي)',
          verified_by_en: 'Mahmoud Fahmy (Financial Admin)'
        },
        internal_notes: []
      },
      {
        id: 'SET-2026-0306',
        booking_id: 'BKG-2026-0870',
        customer_name_ar: 'نادية إبراهيم القاضي',
        customer_name_en: 'Nadia Ibrahim El-Kadi',
        tourism_company_ar: 'شركة مناسك المشاعر للسياحة',
        tourism_company_en: 'Manasek Al-Mashaer Tourism',
        program_name_ar: 'عمرة رجب — باقة المدينة ومكة الميسرة',
        program_name_en: 'Rajab Umrah — Medina & Mecca Budget',
        program_total: 130000,
        deposit_paid: 39000,
        direct_paid: 91000,
        commission_rate: 0.20,
        commission_amount: 26000,
        net_settlement: 13000,
        net_direction: 'payable_to_company',
        company_confirmation: {
          status: 'confirmed',
          confirmed_at: '2026-11-01 16:00',
          confirmed_amount: 91000,
          company_ref: 'MAN-CONF-3312',
          notes: 'تم استلام المبلغ نقداً مع توقيع العقد.'
        },
        status: 'eligible', // Eligible for Review (Confirmation confirmed, waiting for Accounts to prepare)
        version: 0,
        version_history: [],
        workflow_log: [
          { step: 'company_confirmed', date: '2026-11-01 16:00', actor_ar: 'شركة مناسك المشاعر', actor_en: 'Manasek Al-Mashaer', note_ar: 'تأكيد استلام المتبقي ٩١,٠٠٠ ج.م', note_en: 'Confirmed direct receipt of 91,000 EGP' }
        ],
        transfer_details: null,
        internal_notes: []
      }
    ],

    // Methods for Collections
    getCollectionsSummaryKPIs: function () {
      const allCols = this.COLLECTIONS_DATA || [];
      const allSets = this.SETTLEMENTS_DATA || [];

      // 1. Total Approved Collections (Miqat received and approved only)
      const approvedCols = allCols.filter(function (c) { return c.status === 'approved'; });
      const totalApprovedAmount = approvedCols.reduce(function (sum, c) { return sum + (c.amount || 0); }, 0);

      // 2. Collections Awaiting Review
      const reviewPendingCount = allCols.filter(function (c) {
        return c.status === 'under_review' || c.status === 'awaiting_provider';
      }).length;

      // 3. Bookings Awaiting Company Confirmation
      const companyPendingCount = allSets.filter(function (s) {
        return s.company_confirmation && s.company_confirmation.status === 'pending';
      }).length;

      // 4. Settlements Awaiting Admin Approval
      const settlementsPendingAdminCount = allSets.filter(function (s) {
        return s.status === 'awaiting_admin';
      }).length;

      // 5. Approved Settlements Awaiting Transfer
      const settlementsPendingTransferCount = allSets.filter(function (s) {
        return s.status === 'approved';
      }).length;

      // 6. Completed Settlements
      const settlementsCompletedCount = allSets.filter(function (s) {
        return s.status === 'completed';
      }).length;

      return {
        totalApprovedAmount: totalApprovedAmount,
        approvedCollectionsCount: approvedCols.length,
        reviewPendingCount: reviewPendingCount,
        companyPendingCount: companyPendingCount,
        settlementsPendingAdminCount: settlementsPendingAdminCount,
        settlementsPendingTransferCount: settlementsPendingTransferCount,
        settlementsCompletedCount: settlementsCompletedCount
      };
    },

    getCollectionsList: function (filters) {
      filters = filters || {};
      let list = (this.COLLECTIONS_DATA || []).slice();

      if (filters.search) {
        const q = String(filters.search).toLowerCase().trim();
        list = list.filter(function (item) {
          return (
            (item.id && item.id.toLowerCase().includes(q)) ||
            (item.booking_id && item.booking_id.toLowerCase().includes(q)) ||
            (item.customer_name_ar && item.customer_name_ar.toLowerCase().includes(q)) ||
            (item.customer_name_en && item.customer_name_en.toLowerCase().includes(q)) ||
            (item.customer_phone && item.customer_phone.includes(q)) ||
            (item.rrn && item.rrn.toLowerCase().includes(q))
          );
        });
      }

      if (filters.status && filters.status !== 'all') {
        list = list.filter(function (item) { return item.status === filters.status; });
      }

      if (filters.method && filters.method !== 'all') {
        list = list.filter(function (item) { return item.payment_method === filters.method; });
      }

      if (filters.providerStatus && filters.providerStatus !== 'all') {
        list = list.filter(function (item) { return item.provider_status === filters.providerStatus; });
      }

      if (filters.minAmount) {
        list = list.filter(function (item) { return (item.amount || 0) >= Number(filters.minAmount); });
      }

      if (filters.maxAmount) {
        list = list.filter(function (item) { return (item.amount || 0) <= Number(filters.maxAmount); });
      }

      return list;
    },

    getCollectionDetails: function (id) {
      if (!id) return null;
      const found = (this.COLLECTIONS_DATA || []).find(function (c) { return c.id === id; });
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },

    approveCollection: function (id, noteText) {
      const col = (this.COLLECTIONS_DATA || []).find(function (c) { return c.id === id; });
      if (!col) return { success: false, message: 'Collection not found' };

      col.status = 'approved';
      col.provider_status = 'verified';
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      col.history.push({
        action: 'collection_approved',
        date: nowStr,
        actor_ar: 'أحمد صبري (موظف حسابات)',
        actor_en: 'Ahmed Sabry (Accounts Officer)',
        details_ar: noteText ? ('تم اعتماد التحصيل: ' + noteText) : 'تم اعتماد التحصيل بنجاح وقيد الرصيد',
        details_en: noteText ? ('Collection approved: ' + noteText) : 'Collection approved and credited'
      });

      if (noteText) {
        col.notes.push({
          author_ar: 'أحمد صبري',
          author_en: 'Ahmed Sabry',
          date: nowStr,
          text: noteText
        });
      }

      return { success: true, collection: col };
    },

    rejectCollection: function (id, reasonText) {
      const col = (this.COLLECTIONS_DATA || []).find(function (c) { return c.id === id; });
      if (!col) return { success: false, message: 'Collection not found' };
      if (!reasonText || !reasonText.trim()) return { success: false, message: 'Mandatory reason required' };

      col.status = 'rejected';
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      col.history.push({
        action: 'collection_rejected',
        date: nowStr,
        actor_ar: 'أحمد صبري (موظف حسابات)',
        actor_en: 'Ahmed Sabry (Accounts Officer)',
        details_ar: 'تم رفض التحصيل لسبب: ' + reasonText,
        details_en: 'Collection rejected: ' + reasonText
      });

      col.notes.push({
        author_ar: 'أحمد صبري',
        author_en: 'Ahmed Sabry',
        date: nowStr,
        text: 'سبب الرفض: ' + reasonText
      });

      return { success: true, collection: col };
    },

    requestCollectionReupload: function (id, instructions) {
      const col = (this.COLLECTIONS_DATA || []).find(function (c) { return c.id === id; });
      if (!col) return { success: false, message: 'Collection not found' };

      col.status = 'awaiting_proof';
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      col.history.push({
        action: 'reupload_requested',
        date: nowStr,
        actor_ar: 'أحمد صبري (موظف حسابات)',
        actor_en: 'Ahmed Sabry (Accounts Officer)',
        details_ar: 'طلب إعادة إرفاق إشعار أوضح من العميل: ' + (instructions || ''),
        details_en: 'Requested clearer proof re-upload from customer: ' + (instructions || '')
      });

      return { success: true, collection: col };
    },

    addCollectionNote: function (id, noteText) {
      const col = (this.COLLECTIONS_DATA || []).find(function (c) { return c.id === id; });
      if (!col) return { success: false, message: 'Collection not found' };
      if (!noteText || !noteText.trim()) return { success: false, message: 'Empty note' };

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      col.notes.push({
        author_ar: 'أحمد صبري',
        author_en: 'Ahmed Sabry',
        date: nowStr,
        text: noteText.trim()
      });

      return { success: true, notes: col.notes };
    },

    // Methods for Settlements
    getSettlementsList: function (filters) {
      filters = filters || {};
      let list = (this.SETTLEMENTS_DATA || []).slice();

      if (filters.search) {
        const q = String(filters.search).toLowerCase().trim();
        list = list.filter(function (item) {
          return (
            (item.id && item.id.toLowerCase().includes(q)) ||
            (item.booking_id && item.booking_id.toLowerCase().includes(q)) ||
            (item.customer_name_ar && item.customer_name_ar.toLowerCase().includes(q)) ||
            (item.customer_name_en && item.customer_name_en.toLowerCase().includes(q)) ||
            (item.tourism_company_ar && item.tourism_company_ar.toLowerCase().includes(q)) ||
            (item.tourism_company_en && item.tourism_company_en.toLowerCase().includes(q))
          );
        });
      }

      if (filters.status && filters.status !== 'all') {
        list = list.filter(function (item) { return item.status === filters.status; });
      }

      if (filters.company && filters.company !== 'all') {
        list = list.filter(function (item) {
          return item.tourism_company_ar === filters.company || item.tourism_company_en === filters.company;
        });
      }

      if (filters.confStatus && filters.confStatus !== 'all') {
        list = list.filter(function (item) {
          return item.company_confirmation && item.company_confirmation.status === filters.confStatus;
        });
      }

      return list;
    },

    getSettlementDetails: function (id) {
      if (!id) return null;
      const found = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },

    prepareSettlement: function (id, data) {
      const set = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      if (!set) return { success: false, message: 'Settlement not found' };

      // Blocked check: must have confirmed company payment
      if (!set.company_confirmation || set.company_confirmation.status !== 'confirmed') {
        return { success: false, message: 'Cannot prepare settlement before tourism company confirms payment' };
      }

      const cfg = this.getSettlementConfig();
      const progTotal = set.program_total || 0;
      const deposit = set.deposit_paid || (progTotal * cfg.depositRate);
      const commission = progTotal * cfg.commissionRate;
      const net = deposit - commission;

      set.commission_rate = cfg.commissionRate;
      set.commission_amount = commission;
      set.net_settlement = Math.abs(net);
      set.net_direction = net >= 0 ? 'payable_to_company' : 'receivable_from_company';
      set.status = 'prepared';

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      set.workflow_log.push({
        step: 'accounts_prepared',
        date: nowStr,
        actor_ar: 'أحمد صبري (موظف حسابات)',
        actor_en: 'Ahmed Sabry (Accounts Officer)',
        note_ar: 'تم احتساب مسودة التسوية وفق الإعدادات الاسترشادية الحالية',
        note_en: 'Prepared settlement draft with current provisional settings'
      });

      return { success: true, settlement: set };
    },

    submitSettlementForApproval: function (id) {
      const set = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      if (!set) return { success: false, message: 'Settlement not found' };

      if (!set.company_confirmation || set.company_confirmation.status !== 'confirmed') {
        return { success: false, message: 'Blocked: company confirmation required' };
      }

      set.status = 'awaiting_admin';
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      set.workflow_log.push({
        step: 'submitted_to_admin',
        date: nowStr,
        actor_ar: 'أحمد صبري (موظف حسابات)',
        actor_en: 'Ahmed Sabry (Accounts Officer)',
        note_ar: 'تم إرسال التسوية للاعتماد النهائي من الإدارة المالية',
        note_en: 'Submitted settlement for Admin final decision'
      });

      return { success: true, settlement: set };
    },

    adminApproveSettlement: function (id, noteText) {
      const set = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      if (!set) return { success: false, message: 'Settlement not found' };

      set.status = 'approved'; // Approved — Awaiting Transfer
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      set.workflow_log.push({
        step: 'admin_approved',
        date: nowStr,
        actor_ar: 'محمود فهمي (المدير المالي)',
        actor_en: 'Mahmoud Fahmy (Financial Admin)',
        note_ar: noteText ? ('تم اعتماد التسوية: ' + noteText) : 'تم اعتماد التسوية نهائياً وجاهزة للصرف البنكي',
        note_en: noteText ? ('Settlement approved: ' + noteText) : 'Settlement approved and cleared for bank transfer'
      });

      return { success: true, settlement: set };
    },

    adminReturnSettlement: function (id, returnReason) {
      const set = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      if (!set) return { success: false, message: 'Settlement not found' };
      if (!returnReason || !returnReason.trim()) return { success: false, message: 'Mandatory return reason required' };

      set.status = 'returned';
      set.admin_return_reason = returnReason.trim();
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Preserve previous version in history
      const vNum = (set.version || 1);
      set.version_history.push({
        version: 'v' + vNum + '.0',
        date: nowStr,
        author_ar: 'محمود فهمي (المدير المالي)',
        author_en: 'Mahmoud Fahmy (Financial Admin)',
        changes_ar: 'إعادة التسوية للتعديل: ' + returnReason.trim(),
        changes_en: 'Returned for correction: ' + returnReason.trim(),
        program_total: set.program_total,
        deposit_paid: set.deposit_paid,
        commission_amount: set.commission_amount,
        net_settlement: set.net_settlement
      });
      set.version = vNum + 1;

      set.workflow_log.push({
        step: 'admin_returned',
        date: nowStr,
        actor_ar: 'محمود فهمي (المدير المالي)',
        actor_en: 'Mahmoud Fahmy (Financial Admin)',
        note_ar: 'إعادة التسوية للتعديل: ' + returnReason.trim(),
        note_en: 'Returned for correction: ' + returnReason.trim()
      });

      return { success: true, settlement: set };
    },

    adminExecuteTransfer: function (id, transferData) {
      const set = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      if (!set) return { success: false, message: 'Settlement not found' };
      if (!transferData || !transferData.bank_ref) {
        return { success: false, message: 'Bank reference required for transfer execution' };
      }

      set.status = 'completed';
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      set.transfer_details = {
        bank_ref: transferData.bank_ref,
        sender_bank: transferData.sender_bank || 'National Bank of Egypt (NBE) Corporate',
        company_iban: transferData.company_iban || 'EG9900020001000000887766554',
        transfer_date: transferData.transfer_date || nowStr.split(' ')[0],
        amount: set.net_settlement,
        proof_filename: transferData.proof_filename || ('Swift_Advice_' + set.id + '.pdf'),
        verified_by_ar: 'محمود فهمي (المدير المالي)',
        verified_by_en: 'Mahmoud Fahmy (Financial Admin)'
      };

      set.workflow_log.push({
        step: 'transfer_completed',
        date: nowStr,
        actor_ar: 'محمود فهمي (المدير المالي)',
        actor_en: 'Mahmoud Fahmy (Financial Admin)',
        note_ar: 'تم تنفيذ الحوالة البنكية بنجاح برقم سويفت ' + transferData.bank_ref,
        note_en: 'Bank transfer executed successfully with Swift Ref ' + transferData.bank_ref
      });

      return { success: true, settlement: set };
    },

    addSettlementNote: function (id, noteText) {
      const set = (this.SETTLEMENTS_DATA || []).find(function (s) { return s.id === id; });
      if (!set) return { success: false, message: 'Settlement not found' };
      if (!noteText || !noteText.trim()) return { success: false, message: 'Empty note' };

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      if (!set.internal_notes) set.internal_notes = [];
      set.internal_notes.push({
        author_ar: 'أحمد صبري',
        author_en: 'Ahmed Sabry',
        date: nowStr,
        text: noteText.trim()
      });

      return { success: true, notes: set.internal_notes };
    },

    // Method for Section Four: Reports & Reconciliation
    getReconciliationReport: function (filters) {
      filters = filters || {};
      const sets = this.SETTLEMENTS_DATA || [];
      const cols = this.COLLECTIONS_DATA || [];

      // Stream 1: Approved Miqat Collections
      const approvedCols = cols.filter(function (c) { return c.status === 'approved'; });
      const stream1Total = approvedCols.reduce(function (sum, c) { return sum + (c.amount || 0); }, 0);

      // Stream 2: Direct Company Collections (confirmed)
      const confirmedSets = sets.filter(function (s) {
        return s.company_confirmation && s.company_confirmation.status === 'confirmed';
      });
      const stream2Total = confirmedSets.reduce(function (sum, s) { return sum + (s.direct_paid || 0); }, 0);

      // Stream 3: Net Settlements (completed + approved)
      const validSets = sets.filter(function (s) {
        return s.status === 'completed' || s.status === 'approved';
      });
      const stream3Total = validSets.reduce(function (sum, s) { return sum + (s.net_settlement || 0); }, 0);

      // Booking-level 3-way reconciliation rows
      let items = sets.map(function (s) {
        const pTotal = s.program_total || 0;
        const miqatDeposit = s.deposit_paid || 0;
        const directPaid = s.direct_paid || 0;
        const comm = s.commission_amount || 0;
        const net = s.net_settlement || 0;

        let recStatus = 'matched';
        if (!s.company_confirmation || s.company_confirmation.status !== 'confirmed') {
          recStatus = 'pending_conf';
        } else if (s.status === 'returned') {
          recStatus = 'variance';
        }

        return {
          booking_id: s.booking_id,
          settlement_id: s.id,
          customer_ar: s.customer_name_ar,
          customer_en: s.customer_name_en,
          company_ar: s.tourism_company_ar,
          company_en: s.tourism_company_en,
          program_total: pTotal,
          miqat_deposit: miqatDeposit,
          direct_paid: directPaid,
          commission: comm,
          net_settlement: net,
          reconciliation_status: recStatus
        };
      });

      if (filters.search) {
        const q = String(filters.search).toLowerCase().trim();
        items = items.filter(function (i) {
          return (
            i.booking_id.toLowerCase().includes(q) ||
            i.customer_ar.toLowerCase().includes(q) ||
            i.customer_en.toLowerCase().includes(q) ||
            i.company_ar.toLowerCase().includes(q) ||
            i.company_en.toLowerCase().includes(q)
          );
        });
      }

      if (filters.status && filters.status !== 'all') {
        items = items.filter(function (i) { return i.reconciliation_status === filters.status; });
      }

      return {
        stream1Total: stream1Total,
        stream2Total: stream2Total,
        stream3Total: stream3Total,
        reconciliationItems: items
      };
    },

    // =========================================================================
    // MASTER DATASET: REFUND REQUESTS MANAGEMENT (PAGE 8)
    // =========================================================================
    REFUND_REQUESTS_MASTER: [
      {
        id: 'REF-2026-001',
        booking_id: 'BKG-2026-104',
        customer_id: 'CUST-1001',
        customer_name_ar: 'أحمد محمود الشريف',
        customer_name_en: 'Ahmed Mahmoud El-Sherif',
        customer_phone: '01012345671',
        customer_email: 'ahmed.elsherif@gmail.com',
        customer_national_id: '29010141200192',
        company_id: 'COMP-101',
        company_name_ar: 'شركة الفجر لرحلات الحج والعمرة',
        company_name_en: 'Al-Fajr Hajj & Umrah Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-11-05 10:15',
        last_updated: '2026-11-05 10:15',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل',
        refund_type_en: 'Full Refund',
        status: 'refund_requested',
        status_ar: 'طلب استرداد جديد',
        status_en: 'Refund Requested',
        cancellation: {
          id: 'CAN-2026-001',
          date: '2026-11-03 14:00',
          reason_ar: 'ظروف عمل طارئة خارج البلاد تمنع السفر في الموعد المحدد',
          reason_en: 'Emergency overseas work assignment preventing scheduled departure',
          policy_type_ar: 'سياسة الإلغاء المبكر (> 21 يوماً قبل السفر)',
          policy_type_en: 'Early Cancellation (> 21 days before departure)',
          deduction_fee: 2000,
          attachments: [
            { id: 'ATT-REF-001', name_ar: 'خطاب انتداب العمل الرسمي للخارج.pdf', name_en: 'Official_Work_Assignment_Notice.pdf', size: '1.4 MB' },
            { id: 'ATT-REF-002', name_ar: 'نموذج طلب الاسترداد المالي الموقع.pdf', name_en: 'Signed_Refund_Application_Form.pdf', size: '850 KB' }
          ]
        },
        booking: {
          program_ar: 'برنامج الهدى المميز - طيران مباشر',
          program_en: 'Al-Hoda Premium Program - Direct Flight',
          travelers_count: 1,
          total_price: 50000,
          room_type_ar: 'غرفة ثنائية مطلة على الحرم',
          room_type_en: 'Double Haram View Room',
          departure_date: '2026-11-25',
          return_date: '2026-12-05'
        },
        financials: {
          booking_total: 50000,
          total_paid_records: 50000,
          eligible_approved_payments: 50000,
          pending_payments: 0,
          policy_deduction: 2000,
          previous_refunds: 0,
          max_refundable_limit: 48000,
          requested_amount: 48000,
          approved_amount: null,
          actually_refunded: 0,
          remaining_to_refund: 48000,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-001',
            timestamp: '2026-11-05 10:15',
            actor_ar: 'أحمد محمود الشريف',
            actor_en: 'Ahmed Mahmoud El-Sherif',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد إلكتروني',
            title_en: 'Electronic Refund Request Submitted',
            desc_ar: 'قدم العميل طلب استرداد بمبلغ ٤٨,٠٠٠ ج.م بعد إلغاء الحجز BKG-2026-104',
            desc_en: 'Customer submitted refund request for 48,000 EGP following cancellation of BKG-2026-104'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-002',
        booking_id: 'BKG-2026-108',
        customer_id: 'CUST-1002',
        customer_name_ar: 'محمود فوزي عبد الله',
        customer_name_en: 'Mahmoud Fawzy Abdullah',
        customer_phone: '01023456782',
        customer_email: 'mahmoud.fawzy@hotmail.com',
        customer_national_id: '28504151400231',
        company_id: 'COMP-102',
        company_name_ar: 'شركة الصفا والرحاب للحج والعمرة',
        company_name_en: 'Al-Safa & Al-Rehab Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-11-04 11:20',
        last_updated: '2026-11-04 11:20',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل',
        refund_type_en: 'Full Refund',
        status: 'under_review',
        status_ar: 'قيد التدقيق المحاسبي',
        status_en: 'Under Review',
        cancellation: {
          id: 'CAN-2026-002',
          date: '2026-11-02 09:30',
          reason_ar: 'تقرير طبي بعدم اللياقة البدنية للسفر إثر جراحة طارئة',
          reason_en: 'Medical report stating travel unfitness following emergency surgery',
          policy_type_ar: 'إلغاء لظرف قهري طبي موثق (استثناء كامل)',
          policy_type_en: 'Force Majeure Medical Exception',
          deduction_fee: 0,
          attachments: [
            { id: 'ATT-REF-003', name_ar: 'التقرير الطبي المعتمد من مستشفى دار الفؤاد.pdf', name_en: 'Certified_Medical_Hospital_Report.pdf', size: '2.1 MB' },
            { id: 'ATT-REF-004', name_ar: 'إيصالات السداد البنكي للمراجعة.pdf', name_en: 'Payment_Deposit_Slips.pdf', size: '1.1 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج الصفا الاقتصادي ٥ نجوم',
          program_en: 'Al-Safa 5-Star Economy Program',
          travelers_count: 1,
          total_price: 35000,
          room_type_ar: 'غرفة ثلاثية مشتركة',
          room_type_en: 'Triple Shared Room',
          departure_date: '2026-11-28',
          return_date: '2026-12-08'
        },
        financials: {
          booking_total: 35000,
          total_paid_records: 35000,
          eligible_approved_payments: 28000,
          pending_payments: 7000,
          policy_deduction: 0,
          previous_refunds: 0,
          max_refundable_limit: 28000,
          requested_amount: 35000,
          approved_amount: null,
          actually_refunded: 0,
          remaining_to_refund: 28000,
          requested_exceeds_limit: true,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-002',
            timestamp: '2026-11-04 11:20',
            actor_ar: 'محمود فوزي عبد الله',
            actor_en: 'Mahmoud Fawzy Abdullah',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد إلكتروني',
            title_en: 'Electronic Refund Request Submitted',
            desc_ar: 'طلب العميل استرداد كامل المبلغ (٣٥,٠٠٠ ج.م) بينما الدفعات المعتمدة دفترياً ٢٨,٠٠٠ ج.م فقط',
            desc_en: 'Customer requested 35,000 EGP while approved eligible payments total only 28,000 EGP'
          },
          {
            id: 'LOG-REF-003',
            timestamp: '2026-11-04 12:00',
            actor_ar: 'النظام الآلي للرقابة المالية',
            actor_en: 'Automated Financial Rule Engine',
            role_ar: 'النظام المحاسبي',
            role_en: 'System',
            action_type: 'limit_warning',
            title_ar: 'تنبيه: المبلغ المطلوب يتجاوز الرصيد المحصل المعتمد',
            title_en: 'Alert: Requested Amount Exceeds Eligible Approved Funds',
            desc_ar: 'تم حظر الموافقة المباشرة لحين تعديل المبلغ إلى الحد الأقصى المسموح (٢٨,٠٠٠ ج.م) مع ذكر السبب الإلزامي',
            desc_en: 'Direct approval blocked until amount adjusted to eligible maximum (28,000 EGP) with mandatory justification'
          }
        ],
        internal_notes: [
          {
            id: 'NOTE-REF-001',
            author_ar: 'أحمد صبري',
            author_en: 'Ahmed Sabry',
            date: '2026-11-04 12:15',
            text: 'يوجد إيداع بقيمة ٧,٠٠٠ ج.م معلق قيد المطابقة مع كشف حساب بنك مصر، لا يمكن احتسابه في الرصيد القابل للاسترداد حالياً.'
          }
        ]
      },

      {
        id: 'REF-2026-003',
        booking_id: 'BKG-2026-112',
        customer_id: 'CUST-1003',
        customer_name_ar: 'فاطمة حسن البشير',
        customer_name_en: 'Fatima Hassan Al-Bashir',
        customer_phone: '01034567893',
        customer_email: 'fatima.bashir@yahoo.com',
        customer_national_id: '29208221800345',
        company_id: 'COMP-103',
        company_name_ar: 'شركة نور الهدى للسياحة الدينية',
        company_name_en: 'Noor Al-Hoda Religious Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-11-03 14:40',
        last_updated: '2026-11-04 09:30',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل',
        refund_type_en: 'Full Refund',
        status: 'pending_admin_approval',
        status_ar: 'بانتظار اعتماد الإدارة',
        status_en: 'Pending Admin Approval',
        cancellation: {
          id: 'CAN-2026-003',
          date: '2026-11-01 16:00',
          reason_ar: 'تعذر الحصول على موافقة جهة العمل الرسمية على إجازة الحج',
          reason_en: 'Inability to obtain employer vacation approval for pilgrimage',
          policy_type_ar: 'سياسة الإلغاء الاعتيادية (خصم رسوم إدارية ٣,٠٠٠ ج.م)',
          policy_type_en: 'Standard Policy (3,000 EGP Admin Fee)',
          deduction_fee: 3000,
          attachments: [
            { id: 'ATT-REF-005', name_ar: 'إفادة جهة العمل بتأجيل الإجازة السنوية.pdf', name_en: 'Employer_Vacation_Denial_Notice.pdf', size: '920 KB' }
          ]
        },
        booking: {
          program_ar: 'برنامج نور الهدى الذهبي - إقامة أمام الحرم',
          program_en: 'Noor Al-Hoda Golden Program - Haram Front',
          travelers_count: 1,
          total_price: 45000,
          room_type_ar: 'غرفة ثنائية فاخرة',
          room_type_en: 'Luxury Double Room',
          departure_date: '2026-12-01',
          return_date: '2026-12-11'
        },
        financials: {
          booking_total: 45000,
          total_paid_records: 45000,
          eligible_approved_payments: 45000,
          pending_payments: 0,
          policy_deduction: 3000,
          previous_refunds: 0,
          max_refundable_limit: 42000,
          requested_amount: 42000,
          approved_amount: 42000,
          actually_refunded: 0,
          remaining_to_refund: 42000,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-004',
            timestamp: '2026-11-03 14:40',
            actor_ar: 'فاطمة حسن البشير',
            actor_en: 'Fatima Hassan Al-Bashir',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد إلكتروني',
            title_en: 'Electronic Refund Request Submitted',
            desc_ar: 'تقديم طلب استرداد صافي المبلغ المستحق ٤٢,٠٠٠ ج.م بعد خصم المصروفات الإدارية',
            desc_en: 'Customer submitted refund request for net due 42,000 EGP after admin fee deduction'
          },
          {
            id: 'LOG-REF-005',
            timestamp: '2026-11-04 09:30',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'accounts_approved',
            title_ar: 'اعتماد موظف الحسابات وإحالة للإدارة',
            title_en: 'Accounts Officer Approval & Admin Submission',
            desc_ar: 'تم تدقيق كافة الدفعات البنكية ومطابقة سياسة الإلغاء واعتماد الاسترداد بمبلغ ٤٢,٠٠٠ ج.م وإحالته لمدير الحسابات',
            desc_en: 'Verified bank payments, matched cancellation policy, approved 42,000 EGP and submitted to Admin'
          }
        ],
        internal_notes: [
          {
            id: 'NOTE-REF-002',
            author_ar: 'أحمد صبري',
            author_en: 'Ahmed Sabry',
            date: '2026-11-04 09:30',
            text: 'تمت مراجعة المدفوعات عبر البنك الأهلي وهي مطابقة دفترياً بالكامل. يرجى التكرم بالاعتماد الإداري للتنفيذ.'
          }
        ]
      },

      {
        id: 'REF-2026-004',
        booking_id: 'BKG-2026-115',
        customer_id: 'CUST-1004',
        customer_name_ar: 'خالد عبد الرحمن السعيد',
        customer_name_en: 'Khaled Abdelrahman Al-Saeed',
        customer_phone: '01045678904',
        customer_email: 'khaled.saeed@outlook.com',
        customer_national_id: '27809121500456',
        company_id: 'COMP-104',
        company_name_ar: 'شركة باب مكة للسياحة',
        company_name_en: 'Bab Makkah Travel',
        request_source: 'company',
        source_ar: 'شركة سياحة',
        source_en: 'Tourism Company',
        request_date: '2026-11-02 16:10',
        last_updated: '2026-11-03 11:15',
        refund_type: 'partial',
        refund_type_ar: 'استرداد جزئي (إلغاء مقعد مرافق)',
        refund_type_en: 'Partial Refund (Companion Seat Cancellation)',
        status: 'returned_for_review',
        status_ar: 'مُعاد للمراجعة من الإدارة',
        status_en: 'Returned for Review',
        admin_return: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          admin_role_ar: 'مدير الحسابات العام',
          admin_role_en: 'General Accounts Admin',
          returned_at: '2026-11-03 11:15',
          reason_ar: 'يرجى تدقيق خصم رسوم تذاكر الطيران غير المستردة من شركة مصر للطيران ومطابقة الإشعار المرفق قبل الاعتماد النهائي.',
          reason_en: 'Please verify non-refundable flight ticket fee deduction with EgyptAir and cross-check the attached notice before final approval.'
        },
        cancellation: {
          id: 'CAN-2026-004',
          date: '2026-11-02 15:00',
          reason_ar: 'إلغاء حجز الوالدة لظروف صحية مع استمرار حجز المعتمر الرئيسي',
          reason_en: 'Cancellation of mother booking due to health reasons while keeping primary booking active',
          policy_type_ar: 'إلغاء جزئي لمعتمر واحد من البرنامج الرباعي',
          policy_type_en: 'Partial Cancellation for 1 Traveler',
          deduction_fee: 5000,
          attachments: [
            { id: 'ATT-REF-006', name_ar: 'طلب شركة السياحة لإلغاء المقعد الإضافي.pdf', name_en: 'Company_Partial_Cancellation_Letter.pdf', size: '1.2 MB' },
            { id: 'ATT-REF-007', name_ar: 'إشعار خطوط الطيران الخاص بالتذكرة.pdf', name_en: 'Airlines_Ticket_Penalty_Notice.pdf', size: '640 KB' }
          ]
        },
        booking: {
          program_ar: 'برنامج باب مكة الاقتصادي المجمع',
          program_en: 'Bab Makkah Economy Package',
          travelers_count: 2,
          total_price: 60000,
          room_type_ar: 'غرفة ثنائية',
          room_type_en: 'Double Room',
          departure_date: '2026-11-30',
          return_date: '2026-12-10'
        },
        financials: {
          booking_total: 60000,
          total_paid_records: 60000,
          eligible_approved_payments: 60000,
          pending_payments: 0,
          policy_deduction: 5000,
          previous_refunds: 0,
          max_refundable_limit: 25000,
          requested_amount: 25000,
          approved_amount: 25000,
          actually_refunded: 0,
          remaining_to_refund: 25000,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-006',
            timestamp: '2026-11-02 16:10',
            actor_ar: 'شركة باب مكة للسياحة',
            actor_en: 'Bab Makkah Travel',
            role_ar: 'شركة السياحة',
            role_en: 'Tourism Company',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد جزئي',
            title_en: 'Partial Refund Request Filed',
            desc_ar: 'تقديم طلب استرداد ٢٥,٠٠٠ ج.م لإلغاء مقعد المعتمر المرافق',
            desc_en: 'Filed partial refund of 25,000 EGP for companion cancellation'
          },
          {
            id: 'LOG-REF-007',
            timestamp: '2026-11-03 09:00',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'accounts_approved',
            title_ar: 'موافقة أولية وإرسال للإدارة',
            title_en: 'Initial Approval & Sent to Admin',
            desc_ar: 'تم تدقيق الحساب وإرسال الطلب للاعتماد الإداري',
            desc_en: 'Audited accounts and forwarded for administrative approval'
          },
          {
            id: 'LOG-REF-008',
            timestamp: '2026-11-03 11:15',
            actor_ar: 'إبراهيم الدسوقي',
            actor_en: 'Ibrahim El-Desouky',
            role_ar: 'مدير الحسابات العام',
            role_en: 'General Accounts Admin',
            action_type: 'admin_returned',
            title_ar: 'إعادة الطلب للمراجعة من مدير الحسابات',
            title_en: 'Request Returned for Review by Admin',
            desc_ar: 'يرجى تدقيق خصم رسوم تذاكر الطيران غير المستردة من شركة مصر للطيران ومطابقة الإشعار المرفق قبل الاعتماد النهائي.',
            desc_en: 'Please verify non-refundable flight ticket fee deduction with EgyptAir and cross-check the attached notice before final approval.'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-005',
        booking_id: 'BKG-2026-120',
        customer_id: 'CUST-1005',
        customer_name_ar: 'سارة إبراهيم القاضي',
        customer_name_en: 'Sarah Ibrahim Al-Qadi',
        customer_phone: '01056789015',
        customer_email: 'sarah.qadi@gmail.com',
        customer_national_id: '29511052100567',
        company_id: 'COMP-105',
        company_name_ar: 'شركة قباء للسياحة',
        company_name_en: 'Quba Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-11-01 12:00',
        last_updated: '2026-11-02 15:30',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل',
        refund_type_en: 'Full Refund',
        status: 'approved_for_refund',
        status_ar: 'معتمد للصرف (جاهز للتحويل)',
        status_en: 'Approved for Refund',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-11-02 15:30',
          approval_ref: 'ADM-APPR-2026-891'
        },
        cancellation: {
          id: 'CAN-2026-005',
          date: '2026-10-30 11:00',
          reason_ar: 'إلغاء السفر لظروف عائلية خاصة مع طلب استرداد المستحقات',
          reason_en: 'Personal family emergency cancellation with refund request',
          policy_type_ar: 'سياسة الإلغاء القياسية (خصم ٢,٠٠٠ ج.م مصاريف)',
          policy_type_en: 'Standard Cancellation (2,000 EGP fee)',
          deduction_fee: 2000,
          attachments: [
            { id: 'ATT-REF-008', name_ar: 'طلب الإلغاء الموقع واستمارة الاسترداد.pdf', name_en: 'Cancellation_Refund_Request.pdf', size: '1.5 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج قباء الماسي - فنادق الصف الأول',
          program_en: 'Quba Diamond Program - First Row Hotels',
          travelers_count: 1,
          total_price: 52000,
          room_type_ar: 'غرفة مفردة كينج',
          room_type_en: 'Single King Room',
          departure_date: '2026-11-26',
          return_date: '2026-12-06'
        },
        financials: {
          booking_total: 52000,
          total_paid_records: 52000,
          eligible_approved_payments: 52000,
          pending_payments: 0,
          policy_deduction: 2000,
          previous_refunds: 0,
          max_refundable_limit: 50000,
          requested_amount: 50000,
          approved_amount: 50000,
          actually_refunded: 0,
          remaining_to_refund: 50000,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-009',
            timestamp: '2026-11-01 12:00',
            actor_ar: 'سارة إبراهيم القاضي',
            actor_en: 'Sarah Ibrahim Al-Qadi',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد إلكتروني',
            title_en: 'Electronic Refund Request Submitted',
            desc_ar: 'تقديم طلب استرداد بقيمة ٥٠,٠٠٠ ج.م',
            desc_en: 'Customer filed 50,000 EGP refund request'
          },
          {
            id: 'LOG-REF-010',
            timestamp: '2026-11-02 10:15',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'accounts_approved',
            title_ar: 'اعتماد الموظف وإحالة للأدمن',
            title_en: 'Employee Approval & Sent to Admin',
            desc_ar: 'تم اعتماد مبلغ ٥٠,٠٠٠ ج.م بنجاح وإحالته للاعتماد النهائي',
            desc_en: 'Approved 50,000 EGP and submitted for final admin authorization'
          },
          {
            id: 'LOG-REF-011',
            timestamp: '2026-11-02 15:30',
            actor_ar: 'إبراهيم الدسوقي',
            actor_en: 'Ibrahim El-Desouky',
            role_ar: 'مدير الحسابات العام',
            role_en: 'General Accounts Admin',
            action_type: 'admin_approved',
            title_ar: 'اعتماد الصرف من مدير الحسابات',
            title_en: 'Admin Payout Authorization Signed',
            desc_ar: 'تم التصديق النهائي على أمر الصرف بمبلغ ٥٠,٠٠٠ ج.م وأصبح جاهزاً للتحويل المالي المباشر أو المقسم',
            desc_en: 'Final admin sign-off for 50,000 EGP refund recorded; ready for single or split transfer execution'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-006',
        booking_id: 'BKG-2026-125',
        customer_id: 'CUST-1006',
        customer_name_ar: 'طارق رضوان المصري',
        customer_name_en: 'Tarek Radwan Al-Masry',
        customer_phone: '01067890126',
        customer_email: 'tarek.masry@gmail.com',
        customer_national_id: '28003181600678',
        company_id: 'COMP-106',
        company_name_ar: 'شركة البركة لخدمات المعتمرين',
        company_name_en: 'Al-Baraka Umrah Services',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-10-28 09:45',
        last_updated: '2026-11-01 14:20',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل (تحويلات متعددة)',
        refund_type_en: 'Full Refund (Multiple Transfers)',
        status: 'partially_refunded',
        status_ar: 'مسترد جزئياً (بانتظار التحويل المتبقي)',
        status_en: 'Partially Refunded',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-10-31 16:00',
          approval_ref: 'ADM-APPR-2026-872'
        },
        cancellation: {
          id: 'CAN-2026-006',
          date: '2026-10-27 12:00',
          reason_ar: 'تأجيل الحج لموسم قادم مع استرداد المبلغ المعتمد',
          reason_en: 'Postponement of pilgrimage with request for approved refund',
          policy_type_ar: 'سياسة الإلغاء الاعتيادية (خصم ٥,٠٠٠ ج.م)',
          policy_type_en: 'Standard Policy (5,000 EGP fee)',
          deduction_fee: 5000,
          attachments: [
            { id: 'ATT-REF-009', name_ar: 'طلب الاسترداد وتفاصيل الحساب البنكي.pdf', name_en: 'Bank_Details_Refund_Request.pdf', size: '1.3 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج البركة للعائلات - جناح تنفيذي',
          program_en: 'Al-Baraka Family Program - Executive Suite',
          travelers_count: 2,
          total_price: 65000,
          room_type_ar: 'جناح عائلي مطل',
          room_type_en: 'Family Suite View',
          departure_date: '2026-11-20',
          return_date: '2026-12-02'
        },
        financials: {
          booking_total: 65000,
          total_paid_records: 65000,
          eligible_approved_payments: 65000,
          pending_payments: 0,
          policy_deduction: 5000,
          previous_refunds: 0,
          max_refundable_limit: 60000,
          requested_amount: 60000,
          approved_amount: 60000,
          actually_refunded: 35000,
          remaining_to_refund: 25000,
          adjustment: null
        },
        transfers: [
          {
            id: 'TRF-001',
            transfer_ref: 'CIB-REF-981203',
            amount: 35000,
            date: '2026-11-01 14:20',
            method: 'bank_transfer',
            method_ar: 'تحويل بنكي (البنك التجاري الدولي CIB)',
            method_en: 'Bank Wire (CIB)',
            recipient_name: 'طارق رضوان المصري',
            recipient_details: 'EG8200050000000012345678901 - بنك CIB',
            receipt_file: 'receipt_trf_001.pdf',
            employee: 'أحمد صبري',
            notes_ar: 'الدفعة الأولى من الاسترداد المعتمد بمبلغ ٣٥,٠٠٠ ج.م من حساب ميقات بـ CIB',
            notes_en: 'First installment of approved refund (35,000 EGP) from Miqat CIB account',
            status: 'completed',
            customer_confirmed: true,
            customer_confirmed_at: '2026-11-02 10:00'
          }
        ],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-012',
            timestamp: '2026-10-28 09:45',
            actor_ar: 'طارق رضوان المصري',
            actor_en: 'Tarek Radwan Al-Masry',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب الاسترداد',
            title_en: 'Refund Request Filed',
            desc_ar: 'طلب استرداد ٦٠,٠٠٠ ج.م',
            desc_en: 'Customer requested 60,000 EGP refund'
          },
          {
            id: 'LOG-REF-013',
            timestamp: '2026-10-31 16:00',
            actor_ar: 'إبراهيم الدسوقي',
            actor_en: 'Ibrahim El-Desouky',
            role_ar: 'مدير الحسابات العام',
            role_en: 'General Accounts Admin',
            action_type: 'admin_approved',
            title_ar: 'اعتماد الاسترداد بالكامل',
            title_en: 'Refund Approved by Admin',
            desc_ar: 'اعتماد صرف ٦٠,٠٠٠ ج.م مع إمكانية التجزئة على دفعتين بحسب السيولة المتاحة',
            desc_en: 'Authorized 60,000 EGP refund with multi-transfer option based on liquidity'
          },
          {
            id: 'LOG-REF-014',
            timestamp: '2026-11-01 14:20',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'transfer_recorded',
            title_ar: 'تنفيذ التحويل البنكي الأول (٣٥,٠٠٠ ج.م)',
            title_en: 'First Transfer Executed (35,000 EGP)',
            desc_ar: 'تم قيد التحويل البنكي الأول بنجاح عبر CIB والمتبقي ٢٥,٠٠٠ ج.م بانتظار التحويل الثاني',
            desc_en: 'First transfer of 35,000 EGP dispatched via CIB; 25,000 EGP remaining for second transfer'
          }
        ],
        internal_notes: [
          {
            id: 'NOTE-REF-003',
            author_ar: 'أحمد صبري',
            author_en: 'Ahmed Sabry',
            date: '2026-11-01 14:25',
            text: 'تم التنسيق مع العميل هاتفياً لتحويل المتبقي (٢٥,٠٠٠ ج.م) غداً فور إتاحة سيولة الحساب الرئيسي.'
          }
        ]
      },

      {
        id: 'REF-2026-007',
        booking_id: 'BKG-2026-130',
        customer_id: 'CUST-1007',
        customer_name_ar: 'ياسر عبد الله الصاوي',
        customer_name_en: 'Yasser Abdullah Al-Sawy',
        customer_phone: '01078901237',
        customer_email: 'yasser.sawy@gmail.com',
        customer_national_id: '28807251700789',
        company_id: 'COMP-107',
        company_name_ar: 'شركة الروضة الشريفة للسياحة',
        company_name_en: 'Al-Rawda Al-Sharifa Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-10-27 15:30',
        last_updated: '2026-11-04 11:15',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل عبر إنستاباي',
        refund_type_en: 'Full Refund via InstaPay',
        status: 'awaiting_customer_confirmation',
        status_ar: 'بانتظار تأكيد استلام العميل (المرحلة الثانية)',
        status_en: 'Awaiting Customer Confirmation',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-10-29 11:00',
          approval_ref: 'ADM-APPR-2026-855'
        },
        cancellation: {
          id: 'CAN-2026-007',
          date: '2026-10-26 14:00',
          reason_ar: 'ظروف خاصة طارئة مع طلب تسوية عاجلة عبر إنستاباي',
          reason_en: 'Urgent personal reasons with instant InstaPay refund request',
          policy_type_ar: 'سياسة الإلغاء القياسية (خصم ٢,٠٠٠ ج.م)',
          policy_type_en: 'Standard Policy (2,000 EGP fee)',
          deduction_fee: 2000,
          attachments: [
            { id: 'ATT-REF-010', name_ar: 'طلب الاسترداد العاجل عبر إنستاباي.pdf', name_en: 'Urgent_InstaPay_Refund_Letter.pdf', size: '780 KB' }
          ]
        },
        booking: {
          program_ar: 'برنامج الروضة السريع ٤ أيام',
          program_en: 'Al-Rawda Express 4-Day Program',
          travelers_count: 1,
          total_price: 20000,
          room_type_ar: 'غرفة ثنائية',
          room_type_en: 'Double Room',
          departure_date: '2026-11-15',
          return_date: '2026-11-19'
        },
        financials: {
          booking_total: 20000,
          total_paid_records: 20000,
          eligible_approved_payments: 20000,
          pending_payments: 0,
          policy_deduction: 2000,
          previous_refunds: 0,
          max_refundable_limit: 18000,
          requested_amount: 18000,
          approved_amount: 18000,
          actually_refunded: 18000,
          remaining_to_refund: 0,
          adjustment: null
        },
        transfers: [
          {
            id: 'TRF-002',
            transfer_ref: 'INSTA-884102',
            amount: 18000,
            date: '2026-11-04 11:15',
            method: 'instapay',
            method_ar: 'إنستاباي (InstaPay)',
            method_en: 'InstaPay',
            recipient_name: 'ياسر عبد الله الصاوي',
            recipient_details: 'yasser.alsawy@instapay (IPA)',
            receipt_file: 'receipt_trf_002.pdf',
            employee: 'أحمد صبري',
            notes_ar: 'تم التحويل اللحظي بنجاح عبر شبكة المدفوعات اللحظية IPN / InstaPay',
            notes_en: 'Instant transfer dispatched via Instant Payment Network (IPN)',
            status: 'transferred',
            customer_confirmed: false,
            customer_confirmed_at: null
          }
        ],
        customer_confirmation: {
          is_confirmed: false,
          confirmed_at: null,
          channel: null,
          miqat_confirmed_at: '2026-11-04 11:15',
          miqat_confirmed_by: 'أحمد صبري'
        },
        dispute: null,
        automated_reminders: {
          is_active: true,
          interval_hours: 24,
          reminders_sent_count: 1,
          last_sent: '2026-11-04 18:00',
          next_reminder: '2026-11-05 18:00',
          employee_alert_triggered: false
        },
        activity_log: [
          {
            id: 'LOG-REF-015',
            timestamp: '2026-10-27 15:30',
            actor_ar: 'ياسر عبد الله الصاوي',
            actor_en: 'Yasser Abdullah Al-Sawy',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب الاسترداد',
            title_en: 'Refund Request Submitted',
            desc_ar: 'طلب استرداد ١٨,٠٠٠ ج.م لحساب إنستاباي',
            desc_en: 'Submitted 18,000 EGP refund to InstaPay'
          },
          {
            id: 'LOG-REF-016',
            timestamp: '2026-10-29 11:00',
            actor_ar: 'إبراهيم الدسوقي',
            actor_en: 'Ibrahim El-Desouky',
            role_ar: 'مدير الحسابات العام',
            role_en: 'General Accounts Admin',
            action_type: 'admin_approved',
            title_ar: 'اعتماد الصرف الإداري',
            title_en: 'Admin Payout Authorization',
            desc_ar: 'تم توقيع واعتماد أمر الصرف بكامل المبلغ ١٨,٠٠٠ ج.م',
            desc_en: 'Signed payout authorization for 18,000 EGP'
          },
          {
            id: 'LOG-REF-017',
            timestamp: '2026-11-04 11:15',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'transfer_recorded',
            title_ar: 'تنفيذ التحويل وتأكيد ميقات (المرحلة الأولى)',
            title_en: 'Transfer Dispatched & Miqat Confirmed (Stage 1)',
            desc_ar: 'تم تنفيذ التحويل عبر إنستاباي بنجاح وإرفاق إشعار التحويل الرقمي INSTA-884102. الطلب مفتوح بانتظار تأكيد استلام العميل (المرحلة الثانية)',
            desc_en: 'Transfer dispatched via InstaPay with receipt INSTA-884102. Remains open awaiting Stage 2 customer confirmation'
          },
          {
            id: 'LOG-REF-018',
            timestamp: '2026-11-04 18:00',
            actor_ar: 'نظام التنبيهات الآلية',
            actor_en: 'Automated Notification System',
            role_ar: 'النظام',
            role_en: 'System',
            action_type: 'reminder_sent',
            title_ar: 'إرسال تذكير آلي للعميل عبر الرسائل القصيرة والتطبيق',
            title_en: 'Automated Receipt Confirmation Reminder Sent to Customer',
            desc_ar: 'تم إرسال إشعار للعميل لتأكيد استلام حوالة إنستاباي في حسابه البنكي',
            desc_en: 'Notification sent prompting customer to acknowledge receipt in Miqat app'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-008',
        booking_id: 'BKG-2026-134',
        customer_id: 'CUST-1008',
        customer_name_ar: 'منى إبراهيم عثمان',
        customer_name_en: 'Mona Ibrahim Othman',
        customer_phone: '01089012348',
        customer_email: 'mona.othman@gmail.com',
        customer_national_id: '29106091800890',
        company_id: 'COMP-108',
        company_name_ar: 'شركة مناسك للسياحة والحج',
        company_name_en: 'Manasek Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-10-25 10:00',
        last_updated: '2026-11-02 12:10',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل عبر فودافون كاش',
        refund_type_en: 'Full Refund via Vodafone Cash',
        status: 'refund_dispute',
        status_ar: 'نزاع مالي مفتوح (موقوف لحين التسوية)',
        status_en: 'Refund Dispute',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-10-28 14:00',
          approval_ref: 'ADM-APPR-2026-840'
        },
        cancellation: {
          id: 'CAN-2026-008',
          date: '2026-10-24 11:30',
          reason_ar: 'إلغاء لظروف صحية طارئة',
          reason_en: 'Emergency health conditions',
          policy_type_ar: 'سياسة الإلغاء الاعتيادية (خصم ٢,٠٠٠ ج.م)',
          policy_type_en: 'Standard Policy (2,000 EGP fee)',
          deduction_fee: 2000,
          attachments: [
            { id: 'ATT-REF-011', name_ar: 'التقرير الطبي وطلب الاسترداد للمحفظة.pdf', name_en: 'Medical_Report_Wallet_Refund.pdf', size: '1.6 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج مناسك الروحاني - مكة والمدينة',
          program_en: 'Manasek Spiritual Package',
          travelers_count: 1,
          total_price: 22000,
          room_type_ar: 'غرفة ثنائية',
          room_type_en: 'Double Room',
          departure_date: '2026-11-12',
          return_date: '2026-11-18'
        },
        financials: {
          booking_total: 22000,
          total_paid_records: 22000,
          eligible_approved_payments: 22000,
          pending_payments: 0,
          policy_deduction: 2000,
          previous_refunds: 0,
          max_refundable_limit: 20000,
          requested_amount: 20000,
          approved_amount: 20000,
          actually_refunded: 20000,
          remaining_to_refund: 0,
          adjustment: null
        },
        transfers: [
          {
            id: 'TRF-003',
            transfer_ref: 'VF-CASH-710492',
            amount: 20000,
            date: '2026-10-29 16:30',
            method: 'vodafone_cash',
            method_ar: 'فودافون كاش (Vodafone Cash)',
            method_en: 'Vodafone Cash',
            recipient_name: 'منى إبراهيم عثمان',
            recipient_details: '01089012348',
            receipt_file: 'receipt_trf_003.pdf',
            employee: 'أحمد صبري',
            notes_ar: 'تم تحويل مبلغ ٢٠,٠٠٠ ج.م لمحفظة فودافون كاش وصدر إشعار تأكيد من فودافون',
            notes_en: 'Transferred 20,000 EGP to Vodafone Cash wallet with confirmation receipt',
            status: 'disputed',
            customer_confirmed: false,
            customer_confirmed_at: null
          }
        ],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: {
          is_disputed: true,
          opened_at: '2026-11-02 12:10',
          dispute_id: 'DSP-2026-001',
          dispute_reason_ar: 'العميلة تفيد باستلام ١٥,٠٠٠ ج.م فقط في محفظتها وتطالب بالمبلغ المتبقي ٥,٠٠٠ ج.م، بالرغم من صدور إشعار تحويل بكامل المبلغ ٢٠,٠٠٠ ج.م من منصة ميقات.',
          dispute_reason_en: 'Customer claims receipt of only 15,000 EGP and disputes 5,000 EGP discrepancy despite full 20,000 EGP transfer dispatch receipt.',
          claimed_difference: 5000,
          status: 'investigating',
          investigation_notes: [
            {
              id: 'DISP-NOTE-01',
              author_ar: 'أحمد صبري',
              author_en: 'Ahmed Sabry',
              date: '2026-11-02 14:00',
              text: 'تم التواصل مع الدعم الفني لفودافون كاش للاستعلام عن كود العملية 710492 والتأكد من عدم وجود حد يومي للمحفظة تسبب في حجز ٥,٠٠٠ ج.م.'
            }
          ]
        },
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-019',
            timestamp: '2026-10-25 10:00',
            actor_ar: 'منى إبراهيم عثمان',
            actor_en: 'Mona Ibrahim Othman',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب الاسترداد',
            title_en: 'Refund Request Submitted',
            desc_ar: 'طلب استرداد ٢٠,٠٠٠ ج.م لمحفظة فودافون كاش',
            desc_en: 'Requested 20,000 EGP refund to Vodafone Cash'
          },
          {
            id: 'LOG-REF-020',
            timestamp: '2026-10-29 16:30',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'transfer_recorded',
            title_ar: 'تنفيذ التحويل وإرفاق الإشعار',
            title_en: 'Transfer Dispatched & Receipt Attached',
            desc_ar: 'تم تنفيذ التحويل برقم VF-CASH-710492',
            desc_en: 'Transfer recorded with ref VF-CASH-710492'
          },
          {
            id: 'LOG-REF-021',
            timestamp: '2026-11-02 12:10',
            actor_ar: 'منى إبراهيم عثمان',
            actor_en: 'Mona Ibrahim Othman',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'dispute_opened',
            title_ar: 'فتح نزاع مالي من قبل العميل',
            title_en: 'Customer Dispute Opened',
            desc_ar: 'فتحت العميلة نزاعاً مالياً لعدم اكتمال المبلغ المحول للمحفظة (استلام ١٥,٠٠٠ ج.م من أصل ٢٠,٠٠٠ ج.م). تم إيقاف إغلاق الطلب تلقائياً لحين التسوية والتحقيق.',
            desc_en: 'Customer opened dispute regarding partial receipt (15,000 of 20,000 EGP). Request auto-locked until investigation completes'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-009',
        booking_id: 'BKG-2026-138',
        customer_id: 'CUST-1009',
        customer_name_ar: 'عمرو خالد سليم',
        customer_name_en: 'Amr Khaled Selim',
        customer_phone: '01090123459',
        customer_email: 'amr.selim@gmail.com',
        customer_national_id: '28205161400901',
        company_id: 'COMP-109',
        company_name_ar: 'شركة التيسير لرحلات العمرة',
        company_name_en: 'Al-Tayseer Umrah',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-10-20 11:00',
        last_updated: '2026-10-26 14:00',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل عبر تحويل بنكي',
        refund_type_en: 'Full Refund via Bank Wire',
        status: 'refund_completed',
        status_ar: 'استرداد وتسوية مكتملة ومؤكدة',
        status_en: 'Refund Completed',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-10-22 13:00',
          approval_ref: 'ADM-APPR-2026-810'
        },
        cancellation: {
          id: 'CAN-2026-009',
          date: '2026-10-19 15:00',
          reason_ar: 'إلغاء مبكر وتغيير خطة السفر',
          reason_en: 'Early cancellation and travel plan rescheduling',
          policy_type_ar: 'سياسة الإلغاء المبكر (خصم ٢,٠٠٠ ج.م)',
          policy_type_en: 'Early Cancellation (2,000 EGP fee)',
          deduction_fee: 2000,
          attachments: [
            { id: 'ATT-REF-012', name_ar: 'إشعار التحويل البنكي المعتمد والموقع.pdf', name_en: 'Certified_Bank_Transfer_Slip.pdf', size: '1.4 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج التيسير المميز',
          program_en: 'Al-Tayseer Premium Package',
          travelers_count: 1,
          total_price: 32000,
          room_type_ar: 'غرفة ثنائية',
          room_type_en: 'Double Room',
          departure_date: '2026-11-10',
          return_date: '2026-11-17'
        },
        financials: {
          booking_total: 32000,
          total_paid_records: 32000,
          eligible_approved_payments: 32000,
          pending_payments: 0,
          policy_deduction: 2000,
          previous_refunds: 0,
          max_refundable_limit: 30000,
          requested_amount: 30000,
          approved_amount: 30000,
          actually_refunded: 30000,
          remaining_to_refund: 0,
          adjustment: null
        },
        transfers: [
          {
            id: 'TRF-004',
            transfer_ref: 'NBE-REF-654109',
            amount: 30000,
            date: '2026-10-24 10:30',
            method: 'bank_transfer',
            method_ar: 'تحويل بنكي (البنك الأهلي المصري NBE)',
            method_en: 'Bank Wire (NBE)',
            recipient_name: 'عمرو خالد سليم',
            recipient_details: 'EG4900030000000098765432101 - البنك الأهلي',
            receipt_file: 'receipt_trf_004.pdf',
            employee: 'أحمد صبري',
            notes_ar: 'تم التحويل لحساب العميل بالبنك الأهلي وصدر إشعار المطابقة البنكي',
            notes_en: 'Wire dispatched to NBE account with clearing confirmation',
            status: 'completed',
            customer_confirmed: true,
            customer_confirmed_at: '2026-10-26 14:00'
          }
        ],
        customer_confirmation: {
          is_confirmed: true,
          confirmed_at: '2026-10-26 14:00',
          channel: 'miqat_app',
          customer_notes_ar: 'تم تأكيد وصول المبلغ كاملاً في حسابي بالبنك الأهلي، شكراً لتعاونكم.',
          customer_notes_en: 'Confirmed full receipt in NBE account, thank you.'
        },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-022',
            timestamp: '2026-10-20 11:00',
            actor_ar: 'عمرو خالد سليم',
            actor_en: 'Amr Khaled Selim',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب الاسترداد',
            title_en: 'Refund Request Filed',
            desc_ar: 'طلب استرداد ٣٠,٠٠٠ ج.م',
            desc_en: 'Requested 30,000 EGP refund'
          },
          {
            id: 'LOG-REF-023',
            timestamp: '2026-10-24 10:30',
            actor_ar: 'أحمد صبري',
            actor_en: 'Ahmed Sabry',
            role_ar: 'موظف الحسابات المالية',
            role_en: 'Accounts Officer',
            action_type: 'transfer_recorded',
            title_ar: 'تنفيذ التحويل البنكي وتأكيد ميقات (المرحلة الأولى)',
            title_en: 'Wire Dispatched & Miqat Confirmed (Stage 1)',
            desc_ar: 'تم تنفيذ التحويل البنكي برقم NBE-REF-654109 بمبلغ ٣٠,٠٠٠ ج.م',
            desc_en: 'Dispatched 30,000 EGP wire via NBE'
          },
          {
            id: 'LOG-REF-024',
            timestamp: '2026-10-26 14:00',
            actor_ar: 'عمرو خالد سليم',
            actor_en: 'Amr Khaled Selim',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'customer_confirmed',
            title_ar: 'تأكيد استلام العميل واكتمال التسوية (المرحلة الثانية)',
            title_en: 'Customer Acknowledged Receipt & Settlement Completed (Stage 2)',
            desc_ar: 'أكد العميل استلام المبلغ كاملاً عبر تطبيق ميقات وتم إغلاق وأرشفة طلب الاسترداد بنجاح',
            desc_en: 'Customer confirmed full receipt in app; refund request closed and settled successfully'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-010',
        booking_id: 'BKG-2026-142',
        customer_id: 'CUST-1010',
        customer_name_ar: 'حسام حسن الهواري',
        customer_name_en: 'Hossam Hassan Al-Hawary',
        customer_phone: '01001234560',
        customer_email: 'hossam.hawary@gmail.com',
        customer_national_id: '27508101900123',
        company_id: 'COMP-110',
        company_name_ar: 'شركة زمزم للسياحة',
        company_name_en: 'Zamzam Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-10-15 08:30',
        last_updated: '2026-10-24 16:30',
        refund_type: 'full',
        refund_type_ar: 'استرداد كامل (تحويلان مكتملان)',
        refund_type_en: 'Full Refund (2 Completed Transfers)',
        status: 'refund_completed',
        status_ar: 'استرداد وتسوية مكتملة ومؤكدة',
        status_en: 'Refund Completed',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-10-17 11:30',
          approval_ref: 'ADM-APPR-2026-790'
        },
        cancellation: {
          id: 'CAN-2026-010',
          date: '2026-10-14 16:00',
          reason_ar: 'إلغاء لظروف عمل قاهرة مع التنازل عن رسوم الإلغاء الجزئية',
          reason_en: 'Emergency work cancellation with partial fee waiver',
          policy_type_ar: 'سياسة الإلغاء المبكر (خصم ٥,٠٠٠ ج.م رسوم حجز)',
          policy_type_en: 'Early Cancellation (5,000 EGP fee)',
          deduction_fee: 5000,
          attachments: [
            { id: 'ATT-REF-013', name_ar: 'نموذج التسوية المالية المعتمد.pdf', name_en: 'Approved_Financial_Settlement.pdf', size: '1.8 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج زمزم الملكي VIP',
          program_en: 'Zamzam Royal VIP Package',
          travelers_count: 2,
          total_price: 85000,
          room_type_ar: 'جناح ملكي مطل على الكعبة',
          room_type_en: 'Kaaba View Royal Suite',
          departure_date: '2026-11-05',
          return_date: '2026-11-16'
        },
        financials: {
          booking_total: 85000,
          total_paid_records: 85000,
          eligible_approved_payments: 85000,
          pending_payments: 0,
          policy_deduction: 5000,
          previous_refunds: 0,
          max_refundable_limit: 80000,
          requested_amount: 80000,
          approved_amount: 80000,
          actually_refunded: 80000,
          remaining_to_refund: 0,
          adjustment: null
        },
        transfers: [
          {
            id: 'TRF-005',
            transfer_ref: 'BM-REF-109234',
            amount: 50000,
            date: '2026-10-20 12:00',
            method: 'bank_transfer',
            method_ar: 'تحويل بنكي (بنك مصر)',
            method_en: 'Bank Wire (Banque Misr)',
            recipient_name: 'حسام حسن الهواري',
            recipient_details: 'EG1900020000000054321678901 - بنك مصر',
            receipt_file: 'receipt_trf_005.pdf',
            employee: 'أحمد صبري',
            notes_ar: 'الدفعة الأولى من الاسترداد بمبلغ ٥٠,٠٠٠ ج.م عبر بنك مصر',
            notes_en: 'First installment of 50,000 EGP via Banque Misr',
            status: 'completed',
            customer_confirmed: true,
            customer_confirmed_at: '2026-10-21 16:00'
          },
          {
            id: 'TRF-006',
            transfer_ref: 'INSTA-992104',
            amount: 30000,
            date: '2026-10-23 11:30',
            method: 'instapay',
            method_ar: 'إنستاباي (InstaPay)',
            method_en: 'InstaPay',
            recipient_name: 'حسام حسن الهواري',
            recipient_details: 'hossam.hawary@instapay',
            receipt_file: 'receipt_trf_006.pdf',
            employee: 'أحمد صبري',
            notes_ar: 'الدفعة الثانية والمتبقية بمبلغ ٣٠,٠٠٠ ج.م عبر إنستاباي',
            notes_en: 'Second and final installment of 30,000 EGP via InstaPay',
            status: 'completed',
            customer_confirmed: true,
            customer_confirmed_at: '2026-10-24 16:30'
          }
        ],
        customer_confirmation: {
          is_confirmed: true,
          confirmed_at: '2026-10-24 16:30',
          channel: 'miqat_app',
          customer_notes_ar: 'تم استلام الدفعتين بنجاح واكتمال كامل المبلغ المستحق ٨٠,٠٠٠ ج.م.',
          customer_notes_en: 'Confirmed both installments totaling 80,000 EGP.'
        },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-025',
            timestamp: '2026-10-15 08:30',
            actor_ar: 'حسام حسن الهواري',
            actor_en: 'Hossam Hassan Al-Hawary',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب الاسترداد',
            title_en: 'Refund Request Filed',
            desc_ar: 'طلب استرداد ٨٠,٠٠٠ ج.م',
            desc_en: 'Requested 80,000 EGP refund'
          },
          {
            id: 'LOG-REF-026',
            timestamp: '2026-10-24 16:30',
            actor_ar: 'حسام حسن الهواري',
            actor_en: 'Hossam Hassan Al-Hawary',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'customer_confirmed',
            title_ar: 'تأكيد العميل واكتمال الاسترداد المقسم بالكامل',
            title_en: 'Customer Acknowledged Split Refund Full Completion',
            desc_ar: 'تم تأكيد وصول الدفعة الثانية وبذلك تم إغلاق طلب الاسترداد واكتماله نهائياً',
            desc_en: 'Confirmed receipt of final installment; refund closed and fully settled'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-011',
        booking_id: 'BKG-2026-146',
        customer_id: 'CUST-1011',
        customer_name_ar: 'ندى كمال عبد السميع',
        customer_name_en: 'Nada Kamal Abdel Samie',
        customer_phone: '01011223344',
        customer_email: 'nada.samie@gmail.com',
        customer_national_id: '29302141500112',
        company_id: 'COMP-111',
        company_name_ar: 'شركة الصفوة لخدمات المعتمرين',
        company_name_en: 'Al-Safwa Umrah',
        request_source: 'company',
        source_ar: 'شركة سياحة',
        source_en: 'Tourism Company',
        request_date: '2026-11-04 16:00',
        last_updated: '2026-11-04 16:00',
        refund_type: 'partial',
        refund_type_ar: 'استرداد جزئي (إلغاء مقعد معتمر)',
        refund_type_en: 'Partial Refund (Passenger Cancellation)',
        status: 'under_review',
        status_ar: 'قيد التدقيق المحاسبي',
        status_en: 'Under Review',
        cancellation: {
          id: 'CAN-2026-011',
          date: '2026-11-04 14:30',
          reason_ar: 'إلغاء مقعد معتمرة مراسلة لظروف صحية من الشركة',
          reason_en: 'Health cancellation filed by company on traveler behalf',
          policy_type_ar: 'سياسة الاسترداد الجزئي لشركات السياحة',
          policy_type_en: 'Corporate Partial Refund Policy',
          deduction_fee: 500,
          attachments: [
            { id: 'ATT-REF-014', name_ar: 'خطاب شركة الصفوة المعتمد لطلب الاسترداد الجزئي.pdf', name_en: 'Al_Safwa_Corporate_Refund_Letter.pdf', size: '1.1 MB' }
          ]
        },
        booking: {
          program_ar: 'برنامج الصفوة الاقتصادي الجماعي',
          program_en: 'Al-Safwa Group Economy Package',
          travelers_count: 2,
          total_price: 30000,
          room_type_ar: 'غرفة ثنائية',
          room_type_en: 'Double Room',
          departure_date: '2026-12-05',
          return_date: '2026-12-15'
        },
        financials: {
          booking_total: 30000,
          total_paid_records: 30000,
          eligible_approved_payments: 30000,
          pending_payments: 0,
          policy_deduction: 500,
          previous_refunds: 0,
          max_refundable_limit: 14500,
          requested_amount: 14500,
          approved_amount: null,
          actually_refunded: 0,
          remaining_to_refund: 14500,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-027',
            timestamp: '2026-11-04 16:00',
            actor_ar: 'شركة الصفوة لخدمات المعتمرين',
            actor_en: 'Al-Safwa Umrah',
            role_ar: 'شركة السياحة',
            role_en: 'Tourism Company',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد من شركة السياحة',
            title_en: 'Corporate Refund Request Filed',
            desc_ar: 'قدمت شركة الصفوة طلب استرداد جزئي بمبلغ ١٤,٥٠٠ ج.م نيابة عن المعتمرة',
            desc_en: 'Al-Safwa filed partial refund of 14,500 EGP on behalf of traveler'
          }
        ],
        internal_notes: []
      },

      {
        id: 'REF-2026-012',
        booking_id: 'BKG-2026-150',
        customer_id: 'CUST-1012',
        customer_name_ar: 'وليد مصطفى النجار',
        customer_name_en: 'Waleed Mostafa Al-Najjar',
        customer_phone: '01022334455',
        customer_email: 'waleed.najjar@gmail.com',
        customer_national_id: '28701051200234',
        company_id: 'COMP-112',
        company_name_ar: 'شركة دار السلام للحج والعمرة',
        company_name_en: 'Dar Al-Salam Travel',
        request_source: 'customer',
        source_ar: 'عميل مباشر',
        source_en: 'Direct Customer',
        request_date: '2026-11-03 13:15',
        last_updated: '2026-11-04 15:45',
        refund_type: 'partial',
        refund_type_ar: 'استرداد فارق ترقية برنامج',
        refund_type_en: 'Partial Refund (Program Downgrade)',
        status: 'approved_for_refund',
        status_ar: 'معتمد للصرف (محفظة فودافون كاش)',
        status_en: 'Approved for Refund',
        admin_approval: {
          admin_name_ar: 'إبراهيم الدسوقي',
          admin_name_en: 'Ibrahim El-Desouky',
          approved_at: '2026-11-04 15:45',
          approval_ref: 'ADM-APPR-2026-895'
        },
        cancellation: {
          id: 'CAN-2026-012',
          date: '2026-11-02 18:00',
          reason_ar: 'تعديل حجز وترقية إلى فئة مختلفة مع وجود فارق مسترد للعميل',
          reason_en: 'Booking modification and plan change with refundable price difference',
          policy_type_ar: 'تسوية فارق تعديل حجز بدون رسوم إلغاء',
          policy_type_en: 'Modification Settlement (No Fee)',
          deduction_fee: 0,
          attachments: [
            { id: 'ATT-REF-015', name_ar: 'إشعار تعديل الحجز وفارق السعر.pdf', name_en: 'Modification_Refund_Notice.pdf', size: '890 KB' }
          ]
        },
        booking: {
          program_ar: 'برنامج دار السلام الكلاسيكي',
          program_en: 'Dar Al-Salam Classic Program',
          travelers_count: 1,
          total_price: 24000,
          room_type_ar: 'غرفة ثلاثية',
          room_type_en: 'Triple Room',
          departure_date: '2026-11-22',
          return_date: '2026-11-29'
        },
        financials: {
          booking_total: 24000,
          total_paid_records: 24000,
          eligible_approved_payments: 24000,
          pending_payments: 0,
          policy_deduction: 0,
          previous_refunds: 0,
          max_refundable_limit: 8000,
          requested_amount: 8000,
          approved_amount: 8000,
          actually_refunded: 0,
          remaining_to_refund: 8000,
          adjustment: null
        },
        transfers: [],
        customer_confirmation: { is_confirmed: false, confirmed_at: null, channel: null },
        dispute: null,
        automated_reminders: { is_active: false, interval_hours: 48, reminders_sent_count: 0, last_sent: null },
        activity_log: [
          {
            id: 'LOG-REF-028',
            timestamp: '2026-11-03 13:15',
            actor_ar: 'وليد مصطفى النجار',
            actor_en: 'Waleed Mostafa Al-Najjar',
            role_ar: 'العميل',
            role_en: 'Customer',
            action_type: 'request_submitted',
            title_ar: 'تقديم طلب استرداد فارق مالي',
            title_en: 'Price Difference Refund Request Filed',
            desc_ar: 'طلب استرداد ٨,٠٠٠ ج.م فارق تعديل البرنامج',
            desc_en: 'Requested 8,000 EGP refund for program adjustment'
          },
          {
            id: 'LOG-REF-029',
            timestamp: '2026-11-04 15:45',
            actor_ar: 'إبراهيم الدسوقي',
            actor_en: 'Ibrahim El-Desouky',
            role_ar: 'مدير الحسابات العام',
            role_en: 'General Accounts Admin',
            action_type: 'admin_approved',
            title_ar: 'اعتماد الصرف الإداري',
            title_en: 'Admin Payout Authorization',
            desc_ar: 'تم توقيع واعتماد أمر الصرف بمبلغ ٨,٠٠٠ ج.م جاهز للتحويل لمحفظة فودافون كاش',
            desc_en: 'Authorized 8,000 EGP refund ready for Vodafone Cash wallet transfer'
          }
        ],
        internal_notes: []
      }
    ],

    // =========================================================================
    // MASTER DATASET: RECENT OPERATIONAL ACTIVITIES (PAGE 8)
    // =========================================================================
    REFUND_ACTIVITIES_MASTER: [
      {
        id: 'ACT-REF-101',
        refund_id: 'REF-2026-001',
        timestamp: '2026-11-05 10:15',
        actor_ar: 'أحمد محمود الشريف',
        actor_en: 'Ahmed Mahmoud El-Sherif',
        action_type: 'request_submitted',
        status_badge: 'refund_requested',
        title_ar: 'تقديم طلب استرداد جديد',
        title_en: 'New Refund Request Submitted',
        desc_ar: 'قدم العميل طلباً جديداً لاسترداد ٤٨,٠٠٠ ج.م للحجز BKG-2026-104',
        desc_en: 'Customer submitted new refund request of 48,000 EGP for booking BKG-2026-104'
      },
      {
        id: 'ACT-REF-102',
        refund_id: 'REF-2026-003',
        timestamp: '2026-11-04 09:30',
        actor_ar: 'أحمد صبري',
        actor_en: 'Ahmed Sabry',
        action_type: 'accounts_approved',
        status_badge: 'pending_admin_approval',
        title_ar: 'اعتماد موظف الحسابات وإحالة للأدمن',
        title_en: 'Accounts Approval & Sent to Admin',
        desc_ar: 'اعتمد موظف الحسابات طلب الاسترداد بمبلغ ٤٢,٠٠٠ ج.م وأحاله للاعتماد الإداري',
        desc_en: 'Accounts officer approved 42,000 EGP and submitted for admin sign-off'
      },
      {
        id: 'ACT-REF-103',
        refund_id: 'REF-2026-007',
        timestamp: '2026-11-04 11:15',
        actor_ar: 'أحمد صبري',
        actor_en: 'Ahmed Sabry',
        action_type: 'transfer_recorded',
        status_badge: 'awaiting_customer_confirmation',
        title_ar: 'تنفيذ تحويل إنستاباي وتأكيد ميقات (المرحلة الأولى)',
        title_en: 'InstaPay Transfer Executed & Confirmed by Miqat (Stage 1)',
        desc_ar: 'تم تنفيذ تحويل ١٨,٠٠٠ ج.م عبر إنستاباي، والطلب مفتوح بانتظار تأكيد استلام العميل',
        desc_en: '18,000 EGP dispatched via InstaPay; request open awaiting customer receipt confirmation'
      },
      {
        id: 'ACT-REF-104',
        refund_id: 'REF-2026-012',
        timestamp: '2026-11-04 15:45',
        actor_ar: 'إبراهيم الدسوقي',
        actor_en: 'Ibrahim El-Desouky',
        action_type: 'admin_approved',
        status_badge: 'approved_for_refund',
        title_ar: 'اعتماد أمر الصرف من مدير الحسابات',
        title_en: 'Admin Payout Authorization Signed',
        desc_ar: 'اعتمد مدير الحسابات أمر الصرف بمبلغ ٨,٠٠٠ ج.م لمستحقات وليد النجار',
        desc_en: 'Admin signed payout order of 8,000 EGP for Waleed Al-Najjar'
      },
      {
        id: 'ACT-REF-105',
        refund_id: 'REF-2026-004',
        timestamp: '2026-11-03 11:15',
        actor_ar: 'إبراهيم الدسوقي',
        actor_en: 'Ibrahim El-Desouky',
        action_type: 'admin_returned',
        status_badge: 'returned_for_review',
        title_ar: 'إعادة طلب الاسترداد للمراجعة والتدقيق',
        title_en: 'Refund Request Returned for Review',
        desc_ar: 'أعاد مدير الحسابات الطلب للمراجعة لتدقيق خصم تذكرة الطيران ومطابقة الإشعار',
        desc_en: 'Admin returned request to verify flight ticket deduction and penalty notice'
      },
      {
        id: 'ACT-REF-106',
        refund_id: 'REF-2026-008',
        timestamp: '2026-11-02 12:10',
        actor_ar: 'منى إبراهيم عثمان',
        actor_en: 'Mona Ibrahim Othman',
        action_type: 'dispute_opened',
        status_badge: 'refund_dispute',
        title_ar: 'فتح نزاع مالي من قبل العميل',
        title_en: 'Customer Financial Dispute Opened',
        desc_ar: 'أفادت العميلة بوجود تفاوت ٥,٠٠٠ ج.م في مبلغ محفظة فودافون كاش المستلم وجاري التحقيق',
        desc_en: 'Customer opened dispute claiming 5,000 EGP discrepancy in wallet transfer'
      },
      {
        id: 'ACT-REF-107',
        refund_id: 'REF-2026-005',
        timestamp: '2026-11-02 15:30',
        actor_ar: 'إبراهيم الدسوقي',
        actor_en: 'Ibrahim El-Desouky',
        action_type: 'admin_approved',
        status_badge: 'approved_for_refund',
        title_ar: 'اعتماد الصرف بالكامل بمبلغ ٥٠,٠٠٠ ج.م',
        title_en: 'Full Refund Payout Approved (50,000 EGP)',
        desc_ar: 'تم اعتماد الاسترداد لسارة القاضي وجاهز للصرف المالي المباشر أو المقسم',
        desc_en: 'Approved 50,000 EGP payout for Sarah Al-Qadi; ready for transfer execution'
      },
      {
        id: 'ACT-REF-108',
        refund_id: 'REF-2026-006',
        timestamp: '2026-11-01 14:20',
        actor_ar: 'أحمد صبري',
        actor_en: 'Ahmed Sabry',
        action_type: 'transfer_recorded',
        status_badge: 'partially_refunded',
        title_ar: 'تنفيذ التحويل البنكي الأول (٣٥,٠٠٠ ج.م)',
        title_en: 'First Installment Wire Dispatched (35,000 EGP)',
        desc_ar: 'تم تحويل الدفعة الأولى لطرق رضوان عبر CIB والمتبقي ٢٥,٠٠٠ ج.م بانتظار التحويل الثاني',
        desc_en: 'First transfer of 35,000 EGP executed via CIB; 25,000 EGP remaining'
      },
      {
        id: 'ACT-REF-109',
        refund_id: 'REF-2026-009',
        timestamp: '2026-10-26 14:00',
        actor_ar: 'عمرو خالد سليم',
        actor_en: 'Amr Khaled Selim',
        action_type: 'customer_confirmed',
        status_badge: 'refund_completed',
        title_ar: 'تأكيد العميل واكتمال الاسترداد والتسوية (المرحلة الثانية)',
        title_en: 'Customer Acknowledged Receipt & Refund Completed (Stage 2)',
        desc_ar: 'أكد العميل استلام كامل المبلغ ٣٠,٠٠٠ ج.م في حسابه البنكي وتمت التسوية النهائية',
        desc_en: 'Customer confirmed full 30,000 EGP receipt in bank account; refund settled'
      },
      {
        id: 'ACT-REF-110',
        refund_id: 'REF-2026-010',
        timestamp: '2026-10-24 16:30',
        actor_ar: 'حسام حسن الهواري',
        actor_en: 'Hossam Hassan Al-Hawary',
        action_type: 'customer_confirmed',
        status_badge: 'refund_completed',
        title_ar: 'تأكيد استلام الدفعة الثانية واكتمال التسوية (٨٠,٠٠٠ ج.م)',
        title_en: 'Final Installment Confirmed & Settled (80,000 EGP)',
        desc_ar: 'أكد العميل استلام الدفعة الثانية وتم إغلاق وأرشفة طلب الاسترداد المقسم بنجاح',
        desc_en: 'Customer confirmed receipt of second installment; split refund completed'
      }
    ],

    // =========================================================================
    // REFUND MANAGEMENT HELPER & BUSINESS LOGIC METHODS
    // =========================================================================
    getRefundsSummaryKPIs: function (filters) {
      const all = this.REFUND_REQUESTS_MASTER || [];
      
      const totalRequests = all.length;
      
      // Requests requiring review: refund_requested, under_review, returned_for_review
      const requiringReview = all.filter(function (r) {
        return r.status === 'refund_requested' || r.status === 'under_review' || r.status === 'returned_for_review';
      }).length;

      // Pending Admin Approval: pending_admin_approval or accounts_approved
      const pendingAdmin = all.filter(function (r) {
        return r.status === 'pending_admin_approval' || r.status === 'accounts_approved';
      }).length;

      // Awaiting Customer Confirmation: awaiting_customer_confirmation
      const awaitingConfirmation = all.filter(function (r) {
        return r.status === 'awaiting_customer_confirmation';
      }).length;

      // Total Requested Refund Amount
      const totalRequested = all.reduce(function (sum, r) {
        return sum + (r.financials && r.financials.requested_amount ? r.financials.requested_amount : 0);
      }, 0);

      // Total Actually Refunded Amount
      const totalRefunded = all.reduce(function (sum, r) {
        return sum + (r.financials && r.financials.actually_refunded ? r.financials.actually_refunded : 0);
      }, 0);

      return {
        totalRequests: totalRequests,
        requiringReview: requiringReview,
        pendingAdmin: pendingAdmin,
        awaitingConfirmation: awaitingConfirmation,
        totalRequested: totalRequested,
        totalRefunded: totalRefunded
      };
    },

    getRefundsList: function (filters) {
      filters = filters || {};
      let items = (this.REFUND_REQUESTS_MASTER || []).slice();

      if (filters.search) {
        const q = String(filters.search).toLowerCase().trim();
        items = items.filter(function (r) {
          return (
            r.id.toLowerCase().includes(q) ||
            r.booking_id.toLowerCase().includes(q) ||
            (r.customer_name_ar && r.customer_name_ar.toLowerCase().includes(q)) ||
            (r.customer_name_en && r.customer_name_en.toLowerCase().includes(q)) ||
            (r.customer_phone && r.customer_phone.includes(q)) ||
            (r.company_name_ar && r.company_name_ar.toLowerCase().includes(q)) ||
            (r.company_name_en && r.company_name_en.toLowerCase().includes(q))
          );
        });
      }

      if (filters.status && filters.status !== 'all') {
        items = items.filter(function (r) {
          return r.status === filters.status;
        });
      }

      if (filters.source && filters.source !== 'all') {
        items = items.filter(function (r) {
          return r.request_source === filters.source;
        });
      }

      if (filters.refund_type && filters.refund_type !== 'all') {
        items = items.filter(function (r) {
          return r.refund_type === filters.refund_type;
        });
      }

      if (filters.date_range && filters.date_range !== 'all') {
        if (filters.date_range === 'today') {
          items = items.filter(function (r) { return r.request_date && r.request_date.startsWith('2026-11-05'); });
        } else if (filters.date_range === 'seven_days') {
          items = items.filter(function (r) { return r.request_date && r.request_date >= '2026-10-29'; });
        } else if (filters.date_range === 'this_month') {
          items = items.filter(function (r) { return r.request_date && r.request_date.startsWith('2026-11'); });
        }
      }

      return items;
    },

    getRefundDetails: function (id) {
      if (!id) return null;
      const all = this.REFUND_REQUESTS_MASTER || [];
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          return JSON.parse(JSON.stringify(all[i]));
        }
      }
      return null;
    },

    getRefundRecentActivities: function (limit) {
      limit = limit || 10;
      return (this.REFUND_ACTIVITIES_MASTER || []).slice(0, limit);
    },

    adjustRefundAmount: function (id, adjustedAmount, reason, employeeName) {
      employeeName = employeeName || 'أحمد صبري';
      adjustedAmount = Number(adjustedAmount);
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const maxLimit = target.financials.max_refundable_limit;
      if (adjustedAmount > maxLimit) {
        return { success: false, error: 'Adjusted amount exceeds maximum eligible refundable limit (' + maxLimit + ' EGP)' };
      }

      const origAmount = target.financials.requested_amount;
      const nowStr = '2026-11-05 14:30';

      target.financials.requested_amount = adjustedAmount;
      target.financials.requested_exceeds_limit = false;
      target.financials.adjustment = {
        original_amount: origAmount,
        adjusted_amount: adjustedAmount,
        reason_ar: reason,
        reason_en: reason,
        employee_ar: employeeName,
        employee_en: employeeName,
        timestamp: nowStr
      };

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        role_ar: 'موظف الحسابات المالية',
        role_en: 'Accounts Officer',
        action_type: 'amount_adjusted',
        title_ar: 'تعديل مبلغ الاسترداد المطلوب وتوثيق السبب',
        title_en: 'Refund Amount Adjusted with Mandatory Justification',
        desc_ar: 'تم تعديل المبلغ من ' + origAmount.toLocaleString('en-US') + ' ج.م إلى ' + adjustedAmount.toLocaleString('en-US') + ' ج.م. السبب: ' + reason,
        desc_en: 'Amount adjusted from ' + origAmount.toLocaleString('en-US') + ' EGP to ' + adjustedAmount.toLocaleString('en-US') + ' EGP. Reason: ' + reason
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        action_type: 'amount_adjusted',
        status_badge: target.status,
        title_ar: 'تعديل المبلغ المطلوب (' + target.id + ')',
        title_en: 'Requested Amount Adjusted (' + target.id + ')',
        desc_ar: 'تم تعديل المبلغ إلى ' + adjustedAmount.toLocaleString('en-US') + ' ج.م لمطابقة الحد الأقصى المسموح',
        desc_en: 'Adjusted to ' + adjustedAmount.toLocaleString('en-US') + ' EGP per eligible limit'
      });

      return { success: true, refund: target };
    },

    accountsApproveRefund: function (id, employeeName) {
      employeeName = employeeName || 'أحمد صبري';
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const nowStr = '2026-11-05 14:45';
      target.status = 'pending_admin_approval';
      target.status_ar = 'بانتظار اعتماد الإدارة';
      target.status_en = 'Pending Admin Approval';
      target.last_updated = nowStr;
      target.financials.approved_amount = target.financials.requested_amount;

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        role_ar: 'موظف الحسابات المالية',
        role_en: 'Accounts Officer',
        action_type: 'accounts_approved',
        title_ar: 'اعتماد موظف الحسابات وإحالة للأدمن',
        title_en: 'Accounts Officer Approval & Forwarded to Admin',
        desc_ar: 'اعتمد موظف الحسابات المبلغ (' + target.financials.approved_amount.toLocaleString('en-US') + ' ج.م) وأحاله للاعتماد الإداري النهائي',
        desc_en: 'Approved ' + target.financials.approved_amount.toLocaleString('en-US') + ' EGP and submitted for final admin sign-off'
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        action_type: 'accounts_approved',
        status_badge: 'pending_admin_approval',
        title_ar: 'اعتماد حسابات وإرسال للإدارة (' + target.id + ')',
        title_en: 'Accounts Approved & Sent to Admin (' + target.id + ')',
        desc_ar: 'تم اعتماد مبلغ ' + target.financials.approved_amount.toLocaleString('en-US') + ' ج.م وإحالته للإدارة',
        desc_en: 'Approved ' + target.financials.approved_amount.toLocaleString('en-US') + ' EGP and submitted to Admin'
      });

      return { success: true, refund: target };
    },

    adminApproveRefund: function (id, adminName) {
      adminName = adminName || 'إبراهيم الدسوقي';
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const nowStr = '2026-11-05 15:00';
      target.status = 'approved_for_refund';
      target.status_ar = 'معتمد للصرف (جاهز للتحويل)';
      target.status_en = 'Approved for Refund';
      target.last_updated = nowStr;
      target.admin_approval = {
        admin_name_ar: adminName,
        admin_name_en: adminName,
        approved_at: nowStr,
        approval_ref: 'ADM-APPR-2026-' + Math.floor(100 + Math.random() * 900)
      };
      target.financials.remaining_to_refund = target.financials.approved_amount - (target.financials.actually_refunded || 0);

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: adminName,
        actor_en: adminName,
        role_ar: 'مدير الحسابات العام',
        role_en: 'General Accounts Admin',
        action_type: 'admin_approved',
        title_ar: 'اعتماد الصرف المالي من الإدارة',
        title_en: 'Admin Payout Authorization Signed',
        desc_ar: 'صادق مدير الحسابات على أمر الصرف بمبلغ ' + target.financials.approved_amount.toLocaleString('en-US') + ' ج.م وأصبح جاهزاً للتحويل المالي المباشر أو المقسم',
        desc_en: 'Admin signed payout authorization for ' + target.financials.approved_amount.toLocaleString('en-US') + ' EGP; ready for transfer execution'
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: adminName,
        actor_en: adminName,
        action_type: 'admin_approved',
        status_badge: 'approved_for_refund',
        title_ar: 'اعتماد الإدارة لأمر الصرف (' + target.id + ')',
        title_en: 'Admin Authorized Payout (' + target.id + ')',
        desc_ar: 'تم اعتماد صرف ' + target.financials.approved_amount.toLocaleString('en-US') + ' ج.م وأصبح جاهزاً للتحويل',
        desc_en: 'Payout of ' + target.financials.approved_amount.toLocaleString('en-US') + ' EGP authorized for execution'
      });

      return { success: true, refund: target };
    },

    adminReturnRefund: function (id, returnReason, adminName) {
      adminName = adminName || 'إبراهيم الدسوقي';
      if (!returnReason || !returnReason.trim()) {
        return { success: false, error: 'Mandatory return reason is required' };
      }
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const nowStr = '2026-11-05 15:10';
      target.status = 'returned_for_review';
      target.status_ar = 'مُعاد للمراجعة من الإدارة';
      target.status_en = 'Returned for Review';
      target.last_updated = nowStr;
      target.admin_return = {
        admin_name_ar: adminName,
        admin_name_en: adminName,
        returned_at: nowStr,
        reason_ar: returnReason,
        reason_en: returnReason
      };

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: adminName,
        actor_en: adminName,
        role_ar: 'مدير الحسابات العام',
        role_en: 'General Accounts Admin',
        action_type: 'admin_returned',
        title_ar: 'إعادة الطلب لموظف الحسابات مع سبب إلزامي',
        title_en: 'Request Returned to Accounts with Mandatory Justification',
        desc_ar: 'أعاد مدير الحسابات الطلب للمراجعة. السبب: ' + returnReason,
        desc_en: 'Admin returned request for review. Reason: ' + returnReason
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: adminName,
        actor_en: adminName,
        action_type: 'admin_returned',
        status_badge: 'returned_for_review',
        title_ar: 'إعادة طلب الاسترداد للمراجعة (' + target.id + ')',
        title_en: 'Refund Request Returned (' + target.id + ')',
        desc_ar: 'أعاد الأدمن الطلب: ' + returnReason,
        desc_en: 'Returned by Admin: ' + returnReason
      });

      return { success: true, refund: target };
    },

    recordRefundTransfer: function (id, transferData, employeeName) {
      employeeName = employeeName || 'أحمد صبري';
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      if (target.status !== 'approved_for_refund' && target.status !== 'partially_refunded' && target.status !== 'refund_processing') {
        return { success: false, error: 'Transfer execution is not allowed before Admin approval (current status: ' + target.status_ar + ')' };
      }

      const amount = Number(transferData.amount);
      const remainingBefore = target.financials.remaining_to_refund;
      if (amount <= 0 || amount > remainingBefore) {
        return { success: false, error: 'Transfer amount must be greater than 0 and cannot exceed remaining refundable amount (' + remainingBefore + ' EGP)' };
      }

      const nowStr = '2026-11-05 15:30';
      const methodLabels = {
        bank_transfer: { ar: 'تحويل بنكي', en: 'Bank Wire' },
        instapay: { ar: 'إنستاباي (InstaPay)', en: 'InstaPay' },
        vodafone_cash: { ar: 'فودافون كاش', en: 'Vodafone Cash' },
        orange_cash: { ar: 'أورنج كاش', en: 'Orange Cash' },
        etisalat_cash: { ar: 'اتصالات كاش', en: 'Etisalat Cash' },
        we_pay: { ar: 'وي باي (WE Pay)', en: 'WE Pay' }
      };
      const mKey = transferData.method || 'bank_transfer';
      const mObj = methodLabels[mKey] || { ar: 'تحويل مالي', en: 'Electronic Transfer' };

      const newTransfer = {
        id: 'TRF-00' + (target.transfers.length + 1),
        transfer_ref: transferData.transfer_ref || ('MQT-TRF-' + Math.floor(100000 + Math.random() * 900000)),
        amount: amount,
        date: nowStr,
        method: mKey,
        method_ar: mObj.ar,
        method_en: mObj.en,
        recipient_name: transferData.recipient_name || target.customer_name_ar,
        recipient_details: transferData.recipient_details || (target.customer_phone + ' / حساب بنكي'),
        receipt_file: transferData.receipt_file || 'receipt_transfer_' + Date.now() + '.pdf',
        employee: employeeName,
        notes_ar: transferData.notes_ar || 'تم تنفيذ التحويل من حساب ميقات المعتمد',
        notes_en: transferData.notes_en || 'Dispatched from Miqat master clearing account',
        status: 'transferred',
        customer_confirmed: false,
        customer_confirmed_at: null
      };

      target.transfers.push(newTransfer);
      target.financials.actually_refunded = (target.financials.actually_refunded || 0) + amount;
      target.financials.remaining_to_refund = target.financials.approved_amount - target.financials.actually_refunded;
      target.last_updated = nowStr;

      // Update stage 1 confirmation
      target.customer_confirmation.miqat_confirmed_at = nowStr;
      target.customer_confirmation.miqat_confirmed_by = employeeName;

      // Check remaining
      if (target.financials.remaining_to_refund === 0) {
        target.status = 'awaiting_customer_confirmation';
        target.status_ar = 'بانتظار تأكيد استلام العميل (المرحلة الثانية)';
        target.status_en = 'Awaiting Customer Confirmation';
      } else {
        target.status = 'partially_refunded';
        target.status_ar = 'مسترد جزئياً (بانتظار باقي التحويل)';
        target.status_en = 'Partially Refunded';
      }

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        role_ar: 'موظف الحسابات المالية',
        role_en: 'Accounts Officer',
        action_type: 'transfer_recorded',
        title_ar: 'قيد تنفيذ تحويل مالي (' + amount.toLocaleString('en-US') + ' ج.م) عبر ' + mObj.ar,
        title_en: 'Transfer Recorded (' + amount.toLocaleString('en-US') + ' EGP) via ' + mObj.en,
        desc_ar: 'تم تسجيل التحويل برقم مرجعي ' + newTransfer.transfer_ref + '. المتبقي للصرف: ' + target.financials.remaining_to_refund.toLocaleString('en-US') + ' ج.م',
        desc_en: 'Recorded transfer with ref ' + newTransfer.transfer_ref + '. Remaining: ' + target.financials.remaining_to_refund.toLocaleString('en-US') + ' EGP'
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        action_type: 'transfer_recorded',
        status_badge: target.status,
        title_ar: 'تسجيل تحويل استرداد (' + target.id + ')',
        title_en: 'Refund Transfer Executed (' + target.id + ')',
        desc_ar: 'تم تحويل ' + amount.toLocaleString('en-US') + ' ج.م عبر ' + mObj.ar,
        desc_en: 'Dispatched ' + amount.toLocaleString('en-US') + ' EGP via ' + mObj.en
      });

      return { success: true, refund: target, transfer: newTransfer };
    },

    confirmCustomerRefundReceipt: function (id, confirmationData, actorName) {
      actorName = actorName || 'أحمد صبري';
      confirmationData = confirmationData || {};
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      if (target.financials.remaining_to_refund > 0) {
        return { success: false, error: 'Cannot confirm completion while remaining amount is unrefunded (' + target.financials.remaining_to_refund + ' EGP)' };
      }

      const nowStr = '2026-11-05 16:00';
      target.status = 'refund_completed';
      target.status_ar = 'استرداد وتسوية مكتملة ومؤكدة';
      target.status_en = 'Refund Completed';
      target.last_updated = nowStr;

      target.customer_confirmation.is_confirmed = true;
      target.customer_confirmation.confirmed_at = nowStr;
      target.customer_confirmation.channel = confirmationData.channel || 'miqat_app';
      target.customer_confirmation.customer_notes_ar = confirmationData.notes_ar || 'تم تأكيد الاستلام بنجاح من قبل العميل.';
      target.customer_confirmation.customer_notes_en = confirmationData.notes_en || 'Customer acknowledged full receipt.';

      // Mark all transfers confirmed
      for (let t = 0; t < target.transfers.length; t++) {
        target.transfers[t].customer_confirmed = true;
        target.transfers[t].customer_confirmed_at = nowStr;
        target.transfers[t].status = 'completed';
      }

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: actorName,
        actor_en: actorName,
        role_ar: 'موظف الحسابات / العميل',
        role_en: 'Accounts Officer / Customer',
        action_type: 'customer_confirmed',
        title_ar: 'تأكيد استلام العميل واكتمال التسوية (المرحلة الثانية)',
        title_en: 'Customer Receipt Confirmed & Full Settlement Closed (Stage 2)',
        desc_ar: 'تم استيفاء شرطي التأكيد الثنائي (تأكيد تحويل ميقات + تأكيد استلام العميل)، واكتمال التسوية المالية وإغلاق الطلب',
        desc_en: 'Both two-stage confirmation conditions fulfilled (Miqat transfer + customer receipt); request closed and settled'
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: actorName,
        actor_en: actorName,
        action_type: 'customer_confirmed',
        status_badge: 'refund_completed',
        title_ar: 'اكتمال الاسترداد والتسوية (' + target.id + ')',
        title_en: 'Refund Fully Completed & Settled (' + target.id + ')',
        desc_ar: 'تم تأكيد استلام العميل وإغلاق الطلب ' + target.id + ' بنجاح',
        desc_en: 'Customer confirmed receipt; request ' + target.id + ' closed successfully'
      });

      return { success: true, refund: target };
    },

    openRefundDispute: function (id, disputeData, actorName) {
      actorName = actorName || 'أحمد صبري';
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const nowStr = '2026-11-05 16:15';
      target.status = 'refund_dispute';
      target.status_ar = 'نزاع مالي مفتوح (موقوف لحين التسوية)';
      target.status_en = 'Refund Dispute';
      target.last_updated = nowStr;

      target.dispute = {
        is_disputed: true,
        opened_at: nowStr,
        dispute_id: 'DSP-2026-' + Math.floor(100 + Math.random() * 900),
        dispute_reason_ar: disputeData.reason_ar || 'فتح نزاع لعدم تطابق المبلغ المستلم في حساب العميل',
        dispute_reason_en: disputeData.reason_en || 'Customer opened dispute regarding receipt mismatch',
        claimed_difference: Number(disputeData.claimed_difference) || 0,
        status: 'open',
        investigation_notes: [
          {
            id: 'DISP-NOTE-' + Date.now(),
            author_ar: actorName,
            author_en: actorName,
            date: nowStr,
            text: disputeData.notes || 'تم فتح ملف النزاع المالي والتحفظ على إغلاق الطلب لحين استكمال التحقيق ومراجعة البنك.'
          }
        ]
      };

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: actorName,
        actor_en: actorName,
        role_ar: 'مسؤول النزاعات والشكاوى',
        role_en: 'Disputes & Complaints Officer',
        action_type: 'dispute_opened',
        title_ar: 'فتح نزاع مالي وإيقاف إغلاق الطلب',
        title_en: 'Financial Dispute Opened & Closure Locked',
        desc_ar: 'تم فتح نزاع مالي برقم ' + target.dispute.dispute_id + '. السبب: ' + target.dispute.dispute_reason_ar,
        desc_en: 'Dispute ' + target.dispute.dispute_id + ' opened. Reason: ' + target.dispute.dispute_reason_en
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: actorName,
        actor_en: actorName,
        action_type: 'dispute_opened',
        status_badge: 'refund_dispute',
        title_ar: 'فتح نزاع مالي (' + target.id + ')',
        title_en: 'Refund Dispute Opened (' + target.id + ')',
        desc_ar: 'تم فتح نزاع مالي برقم ' + target.dispute.dispute_id,
        desc_en: 'Dispute ' + target.dispute.dispute_id + ' registered'
      });

      return { success: true, refund: target };
    },

    resolveRefundDispute: function (id, resolutionData, actorName) {
      actorName = actorName || 'أحمد صبري';
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target || !target.dispute) return { success: false, error: 'Dispute not found' };

      const nowStr = '2026-11-05 16:30';
      target.dispute.status = 'resolved';
      target.dispute.resolved_at = nowStr;
      target.dispute.resolution_ar = resolutionData.notes_ar || 'تمت التسوية البنكية والتأكد من استلام العميل لكامل المستحقات.';
      target.dispute.resolution_en = resolutionData.notes_en || 'Settled with clearing bank and confirmed full receipt.';

      if (target.financials.remaining_to_refund === 0) {
        target.status = 'refund_completed';
        target.status_ar = 'استرداد وتسوية مكتملة ومؤكدة';
        target.status_en = 'Refund Completed';
        target.customer_confirmation.is_confirmed = true;
        target.customer_confirmation.confirmed_at = nowStr;
      } else {
        target.status = 'partially_refunded';
        target.status_ar = 'مسترد جزئياً (بانتظار باقي التحويل)';
        target.status_en = 'Partially Refunded';
      }

      const logEntry = {
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: actorName,
        actor_en: actorName,
        role_ar: 'مسؤول النزاعات والشكاوى',
        role_en: 'Disputes & Complaints Officer',
        action_type: 'dispute_resolved',
        title_ar: 'تسوية النزاع المالي وإغلاق الشكوى',
        title_en: 'Financial Dispute Resolved & Closed',
        desc_ar: 'تم حل النزاع بنجاح وتوثيق نتيجة التحقيق: ' + target.dispute.resolution_ar,
        desc_en: 'Dispute resolved successfully: ' + target.dispute.resolution_en
      };
      target.activity_log.unshift(logEntry);

      this.REFUND_ACTIVITIES_MASTER.unshift({
        id: 'ACT-REF-' + Date.now(),
        refund_id: target.id,
        timestamp: nowStr,
        actor_ar: actorName,
        actor_en: actorName,
        action_type: 'dispute_resolved',
        status_badge: target.status,
        title_ar: 'تسوية النزاع المالي (' + target.id + ')',
        title_en: 'Dispute Resolved (' + target.id + ')',
        desc_ar: 'تم إنهاء النزاع المالي للطلب ' + target.id + ' واستكمال التسوية',
        desc_en: 'Dispute resolved and settlement updated'
      });

      return { success: true, refund: target };
    },

    addRefundInternalNote: function (id, noteText, authorName) {
      authorName = authorName || 'أحمد صبري';
      if (!noteText || !noteText.trim()) return { success: false, error: 'Note text cannot be empty' };

      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const nowStr = '2026-11-05 16:45';
      const newNote = {
        id: 'NOTE-REF-' + Date.now(),
        author_ar: authorName,
        author_en: authorName,
        date: nowStr,
        text: noteText.trim()
      };
      target.internal_notes.push(newNote);

      target.activity_log.unshift({
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: authorName,
        actor_en: authorName,
        role_ar: 'موظف حسابات',
        role_en: 'Accounts Officer',
        action_type: 'note_added',
        title_ar: 'إضافة ملاحظة إدارية داخلية',
        title_en: 'Internal Note Added',
        desc_ar: noteText.trim(),
        desc_en: noteText.trim()
      });

      return { success: true, note: newNote };
    },

    scheduleRefundReminder: function (id, reminderConfig, employeeName) {
      employeeName = employeeName || 'أحمد صبري';
      reminderConfig = reminderConfig || {};
      const all = this.REFUND_REQUESTS_MASTER || [];
      let target = null;
      for (let i = 0; i < all.length; i++) {
        if (all[i].id.toUpperCase() === String(id).toUpperCase()) {
          target = all[i];
          break;
        }
      }
      if (!target) return { success: false, error: 'Refund request not found' };

      const nowStr = '2026-11-05 17:00';
      const intervalHours = Number(reminderConfig.interval_hours) || 24;
      target.automated_reminders = {
        is_active: true,
        interval_hours: intervalHours,
        reminders_sent_count: (target.automated_reminders ? target.automated_reminders.reminders_sent_count : 0) + 1,
        last_sent: nowStr,
        next_reminder: '2026-11-06 17:00',
        employee_alert_triggered: false
      };

      target.activity_log.unshift({
        id: 'LOG-REF-' + Date.now(),
        timestamp: nowStr,
        actor_ar: employeeName,
        actor_en: employeeName,
        role_ar: 'موظف الحسابات المالية',
        role_en: 'Accounts Officer',
        action_type: 'reminder_scheduled',
        title_ar: 'جدولة تذكير آلي للعميل عبر الرسائل القصيرة والتطبيق',
        title_en: 'Automated Customer Reminder Scheduled',
        desc_ar: 'تم ضبط التذكير الآلي كل ' + intervalHours + ' ساعة لتأكيد استلام الحوالة',
        desc_en: 'Automated reminder set every ' + intervalHours + ' hours for receipt acknowledgement'
      });

      return { success: true, refund: target };
    },



  };
});
