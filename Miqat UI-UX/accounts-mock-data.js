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
      email: 'ahmed.elsherif@gmail.com',
      governorate_ar: 'الجيزة',
      governorate_en: 'Giza',
      program_ar: 'عمرة اقتصادية موفرة (طيران)',
      program_en: 'Umrah Economy Saver (Flight)',
      booking_ref: 'BK-2026-1045',
      booking_status: 'confirmed',
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
      email: 'omar.aziz@gmail.com',
      governorate_ar: 'القاهرة',
      governorate_en: 'Cairo',
      program_ar: 'عمرة ٥ نجوم متميزة (فيرمونت)',
      program_en: '5-Star Premium Umrah (Fairmont)',
      booking_ref: 'BK-2026-1046',
      booking_status: 'confirmed',
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
      email: 'sarah.mansour@yahoo.com',
      governorate_ar: 'الإسكندرية',
      governorate_en: 'Alexandria',
      program_ar: 'عمرة شوال الاقتصادية',
      program_en: 'Shawwal Economy Umrah',
      booking_ref: 'BK-2026-1047',
      booking_status: 'deposit_paid',
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
      email: 'm.fawzy@hotmail.com',
      governorate_ar: 'المنوفية',
      governorate_en: 'Monufia',
      program_ar: 'عمرة رجب الاقتصادية المعيارية',
      program_en: 'Standard Rajab Economy Umrah',
      booking_ref: 'BK-2026-1048',
      booking_status: 'cancelled',
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
      email: 'fatima.ali@outlook.com',
      governorate_ar: 'الدقهلية',
      governorate_en: 'Dakahlia',
      program_ar: 'عمرة شعبان VIP برج الساعة',
      program_en: 'Shaban VIP Clock Tower Umrah',
      booking_ref: 'BK-2026-1049',
      booking_status: 'confirmed',
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
      email: 'tarek.gammal@gmail.com',
      governorate_ar: 'الغربية',
      governorate_en: 'Gharbia',
      program_ar: 'عمرة برية فاخرة — فنادق الحرم',
      program_en: 'Deluxe Land Umrah — Haram Hotels',
      booking_ref: 'BK-2026-1050',
      booking_status: 'new',
      total_spent: 42000,
      paid_amount: 12600,
      remaining: 29400,
      registered_date: '2026-11-02',
      last_activity: '2026-11-03 08:50',
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

  // --- 6. Helper: Filter Matches Logic ---
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
  return {
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
      return CUSTOMERS.filter(c => matchFilter(c, filters));
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
    }
  };
});
