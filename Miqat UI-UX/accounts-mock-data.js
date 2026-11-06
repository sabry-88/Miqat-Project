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

  let SLA_CONFIG_HOURS = 2; // Default 2 hours, max 24 hours

  return {
    TOURISM_COMPANIES_REGISTRY,
    PROGRAM_MODIFICATION_REQUESTS,
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
    }

  };
});
