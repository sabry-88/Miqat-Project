/**
 * MIQAT JOURNEYHUB — PARTNER COMPANY PORTAL MOCK DATA (CLIENT ENGINE)
 * Contracted Partner: AL DORRA TRAVEL (شركة الدرة للسياحة)
 * 
 * Strict Mock Data Guarantee:
 * 1. Fully isolated and clearly identified mock dataset.
 * 2. 100% mathematical consistency: Remaining Amount = Total Price - Paid Amount.
 * 3. Single authoritative source for all KPIs, charts, distributions, and tables.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MiqatCompanyMockData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const COMPANY_INFO = {
    id: 'usr_comp_01156379990',
    name: 'AL DORRA TRAVEL',
    name_ar: 'شركة الدرة للسياحة',
    name_en: 'AL DORRA TRAVEL',
    responsible_person: 'محمد سعيد',
    phone: '01156379990',
    email: 'aldorra@gmail.com',
    governorate: 'الجيزة',
    governorate_ar: 'الجيزة',
    governorate_en: 'Giza',
    license_number: '47852',
    account_type: 'Existing Partner Company',
    account_type_ar: 'شركة شريكة معتمدة',
    account_type_en: 'Contracted Partner Company',
    status: 'Active / Contracted',
    status_ar: 'نشط / متعاقد',
    status_en: 'Active / Contracted',
    member_since: '2024-03-15',
    current_season: '1447H / 2026',
    stats_badge: 'مستوى التميز الفضي'
  };

  const PROGRAMS = [
    { id: 'prog_umrah_econ', name_ar: 'عمرة اقتصادية', name_en: 'Umrah Economy', category: 'umrah', unitPrice: 38000 },
    { id: 'prog_umrah_prem', name_ar: 'عمرة متميزة', name_en: 'Umrah Premium', category: 'umrah', unitPrice: 65000 },
    { id: 'prog_umrah_vip', name_ar: 'عمرة فاخرة VIP', name_en: 'Umrah VIP', category: 'umrah', unitPrice: 110000 },
    { id: 'prog_umrah_ramadan', name_ar: 'عمرة رمضان', name_en: 'Ramadan Umrah', category: 'umrah', unitPrice: 85000 },
    { id: 'prog_hajj_tourist', name_ar: 'حج سياحي', name_en: 'Tourist Hajj', category: 'hajj', unitPrice: 220000 },
    { id: 'prog_hajj_vip', name_ar: 'حج فاخر VIP', name_en: 'VIP Hajj', category: 'hajj', unitPrice: 350000 }
  ];

  const CUSTOMERS = [
    { name_ar: 'أحمد محمود الشريف', name_en: 'Ahmed Mahmoud El-Sherif', phone: '01012345671' },
    { name_ar: 'سارة خالد المنصوري', name_en: 'Sara Khaled El-Mansouri', phone: '01012345672' },
    { name_ar: 'عمر عبد العزيز خليل', name_en: 'Omar Abdel-Aziz Khalil', phone: '01012345673' },
    { name_ar: 'مريم محمود النجار', name_en: 'Maryam Mahmoud El-Naggar', phone: '01012345674' },
    { name_ar: 'عبد الرحمن طارق الفقي', name_en: 'Abdel-Rahman Tarek El-Feki', phone: '01012345675' },
    { name_ar: 'فاطمة الزهراء علي', name_en: 'Fatima El-Zahraa Ali', phone: '01012345676' },
    { name_ar: 'محمود حسن إبراهيم', name_en: 'Mahmoud Hassan Ibrahim', phone: '01012345677' },
    { name_ar: 'هدى إبراهيم السيد', name_en: 'Hoda Ibrahim El-Sayed', phone: '01012345678' },
    { name_ar: 'إسلام مصطفى البدري', name_en: 'Islam Mostafa El-Badry', phone: '01012345679' },
    { name_ar: 'نورهان عادل القاضي', name_en: 'Nourhan Adel El-Kadi', phone: '01012345680' },
    { name_ar: 'يوسف كمال الدين', name_en: 'Youssef Kamal El-Din', phone: '01012345681' },
    { name_ar: 'ياسمين عبد السلام', name_en: 'Yasmine Abdel-Salam', phone: '01012345682' },
    { name_ar: 'خالد وليد غنيم', name_en: 'Khaled Walid Ghoneim', phone: '01012345683' },
    { name_ar: 'أماني نبيل زهران', name_en: 'Amani Nabil Zahran', phone: '01012345684' },
    { name_ar: 'محمد رضا الشرقاوي', name_en: 'Mohamed Reda El-Sharkawy', phone: '01012345685' },
    { name_ar: 'شيماء سمير عطية', name_en: 'Shaimaa Samir Attia', phone: '01012345686' },
    { name_ar: 'كريم أحمد الصاوي', name_en: 'Karim Ahmed El-Sawy', phone: '01012345687' },
    { name_ar: 'ريهام شريف البستاني', name_en: 'Reham Sherif El-Bostany', phone: '01012345688' },
    { name_ar: 'طارق حامد جاد', name_en: 'Tarek Hamed Gad', phone: '01012345689' },
    { name_ar: 'داليا منير عثمان', name_en: 'Dalia Mounir Othman', phone: '01012345690' },
    { name_ar: 'تامر صلاح الدين', name_en: 'Tamer Salah El-Din', phone: '01012345691' },
    { name_ar: 'مروة سعيد خطاب', name_en: 'Marwa Saeed Khattab', phone: '01012345692' },
    { name_ar: 'شريف عزت الدالي', name_en: 'Sherif Ezzat El-Daly', phone: '01012345693' },
    { name_ar: 'نيفين رمزي مراد', name_en: 'Nevin Ramzy Mourad', phone: '01012345694' },
    { name_ar: 'حازم فتحي الشناوي', name_en: 'Hazem Fathy El-Shennawy', phone: '01012345695' },
    { name_ar: 'منى رفعت الخولي', name_en: 'Mona Refaat El-Kholy', phone: '01012345696' },
    { name_ar: 'هيثم عبد المنعم', name_en: 'Haitham Abdel-Moneim', phone: '01012345697' },
    { name_ar: 'إنجي صبحي مهران', name_en: 'Engy Sobhy Mehran', phone: '01012345698' },
    { name_ar: 'وائل فاروق سليمان', name_en: 'Wael Farouk Soliman', phone: '01012345699' },
    { name_ar: 'دينا حسام الأزهري', name_en: 'Dina Hossam El-Azhary', phone: '01012345700' },
    { name_ar: 'أشرف عبد العظيم', name_en: 'Ashraf Abdel-Azim', phone: '01012345701' },
    { name_ar: 'رانيا يسري رضوان', name_en: 'Rania Yosry Radwan', phone: '01012345702' },
    { name_ar: 'ماجد سامي الشاعر', name_en: 'Maged Samy El-Shaer', phone: '01012345703' },
    { name_ar: 'هبة الله إسماعيل', name_en: 'Heba-Allah Ismail', phone: '01012345704' },
    { name_ar: 'زياد محيي الدين', name_en: 'Ziad Mohie El-Din', phone: '01012345705' },
    { name_ar: 'سلوى عبد الحميد غانم', name_en: 'Salwa Abdel-Hamid Ghanem', phone: '01012345706' }
  ];

  const STATUSES = [
    'New', 'New', 'New', 'New', 'New', 'New',
    'Pending', 'Pending', 'Pending', 'Pending', 'Pending',
    'Rejected', 'Rejected',
    'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed',
    'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed',
    'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed',
    'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed',
    'Confirmed', 'Confirmed', 'Confirmed'
  ];

  const PROGRAM_INDICES = [
    0, 1, 0, 2, 3, 4, 1, 0, 3, 5,
    1, 0, 2, 3, 0, 4, 1, 0, 2, 3,
    5, 0, 1, 3, 4, 0, 1, 2, 3, 5,
    0, 1, 2, 4, 1, 3
  ];

  const DATES = [
    '2026-10-29', '2026-10-28', '2026-10-27', '2026-10-26', '2026-10-25', '2026-10-23',
    '2026-10-21', '2026-10-18', '2026-10-15', '2026-10-12', '2026-10-08', '2026-10-04',
    '2026-09-28', '2026-09-25', '2026-09-20', '2026-09-15', '2026-09-10', '2026-09-02',
    '2026-08-27', '2026-08-22', '2026-08-16', '2026-08-11', '2026-08-05', '2026-07-29',
    '2026-07-22', '2026-07-15', '2026-07-08', '2026-06-28', '2026-06-20', '2026-06-12',
    '2026-06-04', '2026-05-27', '2026-05-20', '2026-05-14', '2026-05-08', '2026-05-02'
  ];

  const TRAVELERS = [
    2, 1, 3, 1, 2, 1, 4, 2, 1, 2,
    1, 3, 2, 1, 2, 1, 2, 1, 3, 2,
    1, 2, 1, 4, 1, 2, 3, 1, 2, 1,
    2, 1, 2, 1, 2, 3
  ];

  const GOVERNORATES = [
    { ar: 'الجيزة', en: 'Giza' },
    { ar: 'القاهرة', en: 'Cairo' },
    { ar: 'الإسكندرية', en: 'Alexandria' },
    { ar: 'الدقهلية', en: 'Dakahlia' },
    { ar: 'الغربية', en: 'Gharbia' },
    { ar: 'الشرقية', en: 'Sharqia' },
    { ar: 'المنوفية', en: 'Monufia' },
    { ar: 'القليوبية', en: 'Qalyubia' },
    { ar: 'البحيرة', en: 'Beheira' },
    { ar: 'دمياط', en: 'Damietta' },
    { ar: 'بورسعيد', en: 'Port Said' },
    { ar: 'أسيوط', en: 'Asyut' }
  ];

  const HOTELS_MAKKAH = [
    { ar: 'فندق فيرمونت برج الساعة (مكة)', en: 'Fairmont Makkah Clock Royal Tower' },
    { ar: 'فندق سويس أوتيل المقام (مكة)', en: 'Swissôtel Al Maqam Makkah' },
    { ar: 'فندق ريف العالمية (مكة)', en: 'Reef Global Hotel Makkah' },
    { ar: 'فندق إعمار الأندلسية (ش المعلاة)', en: 'Emaar Al Andalusiah Hotel' }
  ];

  const HOTELS_MADINAH = [
    { ar: 'فندق أوبروي المدينة المنورة', en: 'The Oberoi Madinah' },
    { ar: 'فندق دار التقوى (المنطقة المركزية)', en: 'Dar Al Taqwa Hotel Madinah' },
    { ar: 'فندق شذا المدينة', en: 'Shaza Madinah' },
    { ar: 'فندق ديار المدينة المنورة', en: 'Deyar Al Madinah Hotel' }
  ];

  const ROOM_TYPES = [
    { ar: 'غرفة ثنائية فاخرة', en: 'Luxury Double Room' },
    { ar: 'غرفة مفردة خاصة', en: 'Private Single Room' },
    { ar: 'غرفة ثلاثية متميزة', en: 'Premium Triple Room' },
    { ar: 'غرفة رباعية عائلية', en: 'Family Quad Room' }
  ];

  const SPECIAL_REQUESTS = [
    { ar: 'طلب مقاعد متجاورة بالطائرة وتوفير كرسي متحرك للمسافر عند الوصول.', en: 'Adjacent flight seats requested with airport wheelchair assistance.' },
    { ar: 'تفضيل غرفة بإطلالة مباشرة على الحرم وسرير إضافي للأطفال.', en: 'Direct Haram view room preference with an extra child cot.' },
    { ar: 'وجبات غذائية خاصة تناسب مرضى السكري وقريبة من المصاعد.', en: 'Diabetic dietary meal plan requested with room near elevator banks.' },
    { ar: 'لا توجد طلبات أو اشتراطات خاصة مسجلة لهذا الحجز.', en: 'No special requests or dietary restrictions registered.' }
  ];


  const RAW_BOOKINGS = [];
  for (let i = 0; i < 36; i++) {
    const cust = CUSTOMERS[i];
    const prog = PROGRAMS[PROGRAM_INDICES[i]];
    const status = STATUSES[i];
    const date = DATES[i];
    const travelers = TRAVELERS[i];
    const totalPrice = prog.unitPrice * travelers;

    let paidAmount = 0;
    if (status === 'Confirmed') {
      paidAmount = (i % 2 === 0) ? totalPrice : Math.round(totalPrice * 0.3);
    } else if (status === 'Pending') {
      paidAmount = Math.round(totalPrice * 0.3);
    } else if (status === 'New') {
      paidAmount = (i % 2 === 0) ? Math.round(totalPrice * 0.3) : 0;
    } else if (status === 'Rejected') {
      paidAmount = 0;
    }

    const remainingAmount = totalPrice - paidAmount;
    const refNum = 1045 - i;

    // Canonical booking status and payment status tokens
    let bookingStatus = 'new';
    if (status === 'Confirmed') bookingStatus = 'confirmed';
    else if (status === 'Pending') bookingStatus = 'under_review';
    else if (status === 'Rejected') bookingStatus = 'rejected';

    let paymentStatus = 'unpaid';
    if (paidAmount === totalPrice && totalPrice > 0) {
      paymentStatus = 'fully_paid';
    } else if (paidAmount > 0) {
      paymentStatus = (paidAmount === Math.round(totalPrice * 0.3)) ? 'deposit_paid' : 'partially_paid';
    }

    const gov = GOVERNORATES[i % GOVERNORATES.length];
    const hotelMakkah = HOTELS_MAKKAH[i % HOTELS_MAKKAH.length];
    const hotelMadinah = HOTELS_MADINAH[i % HOTELS_MADINAH.length];
    const roomType = ROOM_TYPES[i % ROOM_TYPES.length];
    const specReq = SPECIAL_REQUESTS[i % SPECIAL_REQUESTS.length];

    const dDateObj = new Date(date);
    dDateObj.setDate(dDateObj.getDate() + 21);
    const departureDate = dDateObj.toISOString().split('T')[0];

    const rDateObj = new Date(departureDate);
    rDateObj.setDate(rDateObj.getDate() + 14);
    const returnDate = rDateObj.toISOString().split('T')[0];

    const tripType_ar = prog.category === 'hajj' 
      ? 'طيران مباشر مجدول (مصر للطيران)' 
      : (i % 3 === 0 ? 'طيران مباشر (مصر للطيران)' : (i % 3 === 1 ? 'طيران ترانزيت (الخطوط السعودية)' : 'حافلات برية حديثة VIP'));
    const tripType_en = prog.category === 'hajj'
      ? 'Scheduled Direct Flight (EgyptAir)'
      : (i % 3 === 0 ? 'Direct Flight (EgyptAir)' : (i % 3 === 1 ? 'Transit Flight (Saudia)' : 'Modern Luxury VIP Overland Coach'));

    const customerEmail = cust.phone === '01012345671' ? 'ahmed.elsherif@gmail.com' : (cust.name_en.toLowerCase().replace(/[^a-z]/g, '.') + '@gmail.com');
    const customerWhatsapp = '+20' + cust.phone.slice(1);

    // Initial itemized payment records
    const payments = [];
    if (paidAmount > 0) {
      const depositPart = (status === 'Confirmed' && i % 2 === 0) ? Math.round(totalPrice * 0.3) : paidAmount;
      payments.push({
        id: 'pay_tx_' + (1000 + i) + '_1',
        reference: 'PAY-2026-' + String(9000 + i).padStart(4, '0'),
        date: date + ' 09:42',
        amount: depositPart,
        source: 'platform',
        method_key: 'electronic_card',
        method_ar: 'بطاقة بنكية (مدى / فيزا)',
        method_en: 'Bank Card (Visa / Mada)',
        status_key: 'verified',
        status_ar: 'معتمد وموثق',
        status_en: 'Verified by Miqat',
        verifiedByMiqat: true,
        recordedBy_ar: 'بوابة الدفع الإلكتروني — ميقات',
        recordedBy_en: 'Miqat Payment Gateway',
        transactionRef: 'TXN-EGP-' + (489200 + i),
        notes_ar: 'سداد الدفعة المقدمة لتأكيد الحجز (30%)',
        notes_en: 'Initial booking confirmation deposit (30%)'
      });

      if (paidAmount === totalPrice) {
        const remainingSettlement = totalPrice - depositPart;
        
        // Distinct financial collection paths to reflect both Platform Gateways and Company Branch receipts
        if (i === 14 || i === 22 || i === 30) {
          // Company Direct Cash Collection at Branch Counter — Pending Miqat Finance Audit
          payments.push({
            id: 'pay_tx_' + (1000 + i) + '_2',
            reference: 'RCP-2026-' + String(9500 + i).padStart(4, '0'),
            date: date + ' 14:15',
            amount: remainingSettlement,
            source: 'company',
            method_key: 'cash_office',
            method_ar: 'نقداً بمقر الشركة',
            method_en: 'Cash at Branch Office',
            status_key: 'company_reported',
            status_ar: 'مسدد للشركة (قيد تدقيق ميقات)',
            status_en: 'Company-Reported (Pending Miqat)',
            verifiedByMiqat: false,
            recordedBy_ar: 'شركة الدرة للسياحة (فرع الجيزة)',
            recordedBy_en: 'AL DORRA TRAVEL (Giza Branch)',
            transactionRef: 'RCP-2026-' + (8400 + i),
            notes_ar: 'استلام الدفعة المتبقية نقداً بخزينة فرع الشركة، قيد التدقيق المحاسبي من منصة ميقات',
            notes_en: 'Remaining balance received in cash at company branch counter, pending Miqat finance audit'
          });
        } else if (i === 18 || i === 26) {
          // Company Direct Bank Deposit — Audited and Verified by Miqat Accounting
          payments.push({
            id: 'pay_tx_' + (1000 + i) + '_2',
            reference: 'RCP-2026-' + String(9500 + i).padStart(4, '0'),
            date: date + ' 14:15',
            amount: remainingSettlement,
            source: 'company',
            method_key: 'bank_deposit',
            method_ar: 'إيداع بنكي مباشر بالشركة',
            method_en: 'Direct Company Bank Deposit',
            status_key: 'company_verified',
            status_ar: 'مسجل بالشركة (معتمد محاسبياً)',
            status_en: 'Company-Reported (Verified)',
            verifiedByMiqat: true,
            recordedBy_ar: 'شركة الدرة للسياحة (معتمد من تدقيق ميقات)',
            recordedBy_en: 'AL DORRA TRAVEL (Audited by Miqat)',
            transactionRef: 'RCP-2026-' + (8400 + i),
            notes_ar: 'إيداع بنكي مباشر في حساب الشركة، تم مراجعته واعتماده محاسبياً من ميقات',
            notes_en: 'Direct deposit to company bank account, audited and verified by Miqat finance'
          });
        } else {
          // Official Miqat Platform Clearing & Verified Wire
          payments.push({
            id: 'pay_tx_' + (1000 + i) + '_2',
            reference: 'PAY-2026-' + String(9500 + i).padStart(4, '0'),
            date: date + ' 14:15',
            amount: remainingSettlement,
            source: 'platform',
            method_key: 'bank_transfer',
            method_ar: 'تحويل بنكي رسمي',
            method_en: 'Official Bank Transfer',
            status_key: 'verified',
            status_ar: 'معتمد وموثق',
            status_en: 'Verified by Miqat',
            verifiedByMiqat: true,
            recordedBy_ar: 'الإدارة المالية — ميقات',
            recordedBy_en: 'Miqat Finance Dept',
            transactionRef: 'TXN-EGP-' + (589200 + i),
            notes_ar: 'سداد باقي قيمة الحجز بالكامل واعتماد المخالصة عبر منصة ميقات',
            notes_en: 'Remaining balance settlement and final clearance verified via Miqat Platform'
          });
        }
      }
    }

    // Chronological Activity Timeline
    const timeline = [];
    timeline.push({
      id: 'evt_' + (1000 + i) + '_1',
      timestamp: date + ' 09:30',
      type: 'created',
      title_ar: 'إنشاء طلب الحجز',
      title_en: 'Booking Created & Registered',
      desc_ar: 'تم استلام طلب الحجز إلكترونياً وتخصيص الرقم المرجعي BK-2026-' + String(refNum).padStart(4, '0') + '.',
      desc_en: 'Booking request received electronically and assigned reference BK-2026-' + String(refNum).padStart(4, '0') + '.',
      actor_ar: 'العميل (' + cust.name_ar + ')',
      actor_en: 'Customer (' + cust.name_en + ')',
      party: 'customer'
    });

    if (paidAmount > 0) {
      timeline.push({
        id: 'evt_' + (1000 + i) + '_2',
        timestamp: date + ' 09:42',
        type: 'payment',
        title_ar: 'توثيق سداد الدفعة المقدمة',
        title_en: 'Deposit Payment Recorded',
        desc_ar: 'تم استلام واعتماد دفعة تأكيد الحجز إلكترونياً بقيمة ' + Math.round(totalPrice * 0.3).toLocaleString('en-US') + ' ج.م عبر بوابة الدفع.',
        desc_en: 'Booking confirmation deposit of ' + Math.round(totalPrice * 0.3).toLocaleString('en-US') + ' EGP verified via payment gateway.',
        actor_ar: 'بوابة دفع ميقات الموحدة',
        actor_en: 'Miqat Unified Payment Gateway',
        party: 'system'
      });
    }

    if (status === 'Confirmed') {
      timeline.push({
        id: 'evt_' + (1000 + i) + '_3',
        timestamp: date + ' 11:15',
        type: 'confirmed',
        title_ar: 'اعتماد وتأكيد الحجز رسميًا',
        title_en: 'Booking Officially Confirmed',
        desc_ar: 'تمت مراجعة المقاعد وتأكيد الحجز وتخصيص باقة السفر للعميل من قبل شركة السياحة.',
        desc_en: 'Availability verified, booking confirmed and travel package allocated by partner company.',
        actor_ar: 'شركة الدرة للسياحة (مسؤول الحجوزات)',
        actor_en: 'AL DORRA TRAVEL (Reservations Manager)',
        party: 'company'
      });
    } else if (status === 'Rejected') {
      timeline.push({
        id: 'evt_' + (1000 + i) + '_3',
        timestamp: date + ' 14:20',
        type: 'rejected',
        title_ar: 'رفض الحجز من شركة السياحة',
        title_en: 'Booking Rejected by Company',
        desc_ar: 'تم رفض الحجز لعدم توفر غرف شاغرة بالفندق المطلوب للفترة المحددة. تم إحالة الدفعة لبروتوكول الاسترداد.',
        desc_en: 'Booking rejected due to hotel room unavailability for the specified dates. Forwarded to refund protocol.',
        actor_ar: 'شركة الدرة للسياحة',
        actor_en: 'AL DORRA TRAVEL',
        party: 'company'
      });
    } else if (status === 'Pending') {
      timeline.push({
        id: 'evt_' + (1000 + i) + '_3',
        timestamp: date + ' 10:05',
        type: 'under_review',
        title_ar: 'الحجز قيد المراجعة والتدقيق',
        title_en: 'Booking Under Operational Review',
        desc_ar: 'الحجز قيد مراجعة جوازات سفر المعتمرين وتوافر الغرف الفندقية مع الوكيل.',
        desc_en: 'Booking undergoing pilgrim passport review and room allotment check.',
        actor_ar: 'شركة الدرة للسياحة',
        actor_en: 'AL DORRA TRAVEL',
        party: 'company'
      });
    }

    RAW_BOOKINGS.push({
      id: 'bkg_' + (1000 + i),
      reference: 'BK-2026-' + String(refNum).padStart(4, '0'),
      customerId: 'cust_' + (100 + i),
      customerName_ar: cust.name_ar,
      customerName_en: cust.name_en,
      customerPhone: cust.phone,
      customerWhatsapp,
      customerEmail,
      customerGovernorate_ar: gov.ar,
      customerGovernorate_en: gov.en,
      programId: prog.id,
      programName_ar: prog.name_ar,
      programName_en: prog.name_en,
      category: prog.category,
      unitPrice: prog.unitPrice,
      travelers,
      totalPrice,
      paidAmount,
      remainingAmount,
      status,
      bookingStatus,
      paymentStatus,
      bookingDate: date,
      tripType_ar,
      tripType_en,
      departureDate,
      returnDate,
      hotelMakkah_ar: hotelMakkah.ar,
      hotelMakkah_en: hotelMakkah.en,
      hotelMadinah_ar: hotelMadinah.ar,
      hotelMadinah_en: hotelMadinah.en,
      roomType_ar: roomType.ar,
      roomType_en: roomType.en,
      specialRequests_ar: specReq.ar,
      specialRequests_en: specReq.en,
      payments,
      timeline,
      proposedChange: null,
      currency: 'EGP'
    });
  }

  const ACTIVITIES_FEED = [
    {
      id: 'act_1',
      type: 'booking_new',
      title_ar: 'استلام حجز جديد',
      title_en: 'New Booking Received',
      desc_ar: 'تم استلام حجز جديد برقم BK-2026-1045 من العميل أحمد محمود الشريف لبرنامج عمرة اقتصادية (فردين).',
      desc_en: 'New booking #BK-2026-1045 received from Ahmed Mahmoud El-Sherif for Umrah Economy (2 travelers).',
      timestamp: '2026-10-30T00:45:00.000Z',
      relative_ar: 'منذ 25 دقيقة',
      relative_en: '25 mins ago'
    },
    {
      id: 'act_2',
      type: 'payment_deposit',
      title_ar: 'سداد دفعة مقدمة',
      title_en: 'Deposit Payment Processed',
      desc_ar: 'تم سداد دفعة مقدمة 30% بمبلغ 22,800 ج.م للحجز BK-2026-1045 عبر بوابة ميقات.',
      desc_en: '30% deposit payment of 22,800 EGP recorded for #BK-2026-1045 via Miqat gateway.',
      timestamp: '2026-10-29T23:30:00.000Z',
      relative_ar: 'منذ ساعة و40 دقيقة',
      relative_en: '1 hr 40 mins ago'
    },
    {
      id: 'act_3',
      type: 'booking_confirmed',
      title_ar: 'تأكيد حجز معتمد',
      title_en: 'Booking Confirmed',
      desc_ar: 'تم تأكيد حجز برنامج عمرة فاخرة VIP بنجاح للعميلة سارة خالد المنصوري برقم BK-2026-1044.',
      desc_en: 'Booking confirmed for Umrah VIP for client Sara Khaled El-Mansouri under #BK-2026-1044.',
      timestamp: '2026-10-29T21:15:00.000Z',
      relative_ar: 'منذ 4 ساعات',
      relative_en: '4 hrs ago'
    },
    {
      id: 'act_4',
      type: 'status_update',
      title_ar: 'تحديث حالة الحجز',
      title_en: 'Booking Status Updated',
      desc_ar: 'تم نقل الحجز BK-2026-1043 إلى "تحت الإجراء" بعد استلام صور جوازات السفر للمعتمرين.',
      desc_en: 'Booking #BK-2026-1043 moved to "Pending" upon receiving customer passport documents.',
      timestamp: '2026-10-29T18:00:00.000Z',
      relative_ar: 'منذ 7 ساعات',
      relative_en: '7 hrs ago'
    },
    {
      id: 'act_5',
      type: 'notification_ministry',
      title_ar: 'إشعار وزاري رسمي',
      title_en: 'Official Ministry Notice',
      desc_ar: 'تم اعتماد حصة موسم العمرة 1447هـ لشركات السياحة الفئة (أ) عبر المسار الإلكتروني الموحد.',
      desc_en: '1447H Umrah quota officially approved for Category (A) agencies via unified electronic portal.',
      timestamp: '2026-10-28T14:30:00.000Z',
      relative_ar: 'أمس الساعة 2:30 م',
      relative_en: 'Yesterday at 2:30 PM'
    }
  ];

  const NOTIFICATIONS = [
    {
      id: 'notif_1',
      unread: true,
      title_ar: 'تحديث جدول رحلات الطيران',
      title_en: 'Flight Schedule Updated',
      message_ar: 'تم تحديث مواعيد رحلات مصر للطيران لموسم عمرة رجب وشعبان 1447هـ.',
      message_en: 'EgyptAir flight schedules updated for Rajab & Shaban 1447H season.',
      date: '2026-10-29',
      badge_ar: 'هام',
      badge_en: 'Important',
      badge: 'هام'
    },
    {
      id: 'notif_2',
      unread: true,
      title_ar: 'إيداع مدفوعات إلكترونية',
      title_en: 'Electronic Payments Credited',
      message_ar: 'تم تحصيل 4 دفعات مقدمة جديدة بقيمة إجمالية 91,200 ج.م لحساب الشركة.',
      message_en: '4 new deposit payments totaling 91,200 EGP received for company account.',
      date: '2026-10-28',
      badge_ar: 'مالي',
      badge_en: 'Financial',
      badge: 'مالي'
    },
    {
      id: 'notif_3',
      unread: true,
      title_ar: 'طلب تعديل موعد رحلة',
      title_en: 'Trip Date Change Request',
      message_ar: 'طلب العميل عمر عبد العزيز تعديل موعد السفر لبرنامج عمرة متميزة.',
      message_en: 'Customer Omar Abdel-Aziz requested a departure date change for Umrah Premium.',
      date: '2026-10-27',
      badge_ar: 'خدمة عملاء',
      badge_en: 'Support',
      badge: 'خدمة عملاء'
    },
    {
      id: 'notif_4',
      unread: false,
      title_ar: 'اكتمال الطاقة الاستيعابية',
      title_en: 'Capacity Reached',
      message_ar: 'اكتملت 85% من مقاعد برنامج عمرة رمضان المبارك — العشر الأواخر.',
      message_en: '85% capacity reached for Ramadan Umrah — Last Ten Days program.',
      date: '2026-10-25',
      badge_ar: 'تشغيلي',
      badge_en: 'Operational',
      badge: 'تشغيلي'
    }
  ];

  function getDashboardMetrics(period = 'all', specificDate = null) {
    let filtered = RAW_BOOKINGS;

    if (specificDate) {
      filtered = RAW_BOOKINGS.filter(b => b.bookingDate === specificDate);
    } else if (period === 'week') {
      // Current week: Saturday 2026-10-24 through Friday 2026-10-30
      filtered = RAW_BOOKINGS.filter(b => b.bookingDate >= '2026-10-24' && b.bookingDate <= '2026-10-30');
    } else if (period === 'month') {
      filtered = RAW_BOOKINGS.filter(b => b.bookingDate.startsWith('2026-10'));
    } else if (period === 'last30') {
      filtered = RAW_BOOKINGS.filter(b => b.bookingDate >= '2026-10-01');
    } else if (period === 'season') {
      filtered = RAW_BOOKINGS;
    }

    const totalBookings = filtered.length;
    let newBookings = 0;
    let pendingBookings = 0;
    let confirmedBookings = 0;
    let rejectedBookings = 0;
    let totalBookingValue = 0;
    let amountCollected = 0;
    let remainingAmount = 0;

    filtered.forEach(b => {
      if (b.status === 'New') newBookings++;
      else if (b.status === 'Pending') pendingBookings++;
      else if (b.status === 'Confirmed') confirmedBookings++;
      else if (b.status === 'Rejected') rejectedBookings++;

      totalBookingValue += b.totalPrice;
      amountCollected += b.paidAmount;
      remainingAmount += b.remainingAmount;
    });

    const programMap = {};
    PROGRAMS.forEach(p => {
      programMap[p.id] = {
        id: p.id,
        name_ar: p.name_ar,
        name_en: p.name_en,
        category: p.category,
        unitPrice: p.unitPrice,
        bookingsCount: 0,
        totalRevenue: 0,
        percentageOfTotal: 0
      };
    });

    filtered.forEach(b => {
      if (programMap[b.programId]) {
        programMap[b.programId].bookingsCount++;
        programMap[b.programId].totalRevenue += b.totalPrice;
      }
    });

    const popularPrograms = Object.values(programMap)
      .map(p => ({
        ...p,
        percentageOfTotal: totalBookings > 0 ? Math.round((p.bookingsCount / totalBookings) * 100) : 0
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount);

    const statusDistribution = [
      {
        status: 'Confirmed',
        label_ar: 'مؤكدة',
        label_en: 'Confirmed',
        count: confirmedBookings,
        percentage: totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0,
        colorToken: 'var(--color-primary)'
      },
      {
        status: 'New',
        label_ar: 'جديدة',
        label_en: 'New',
        count: newBookings,
        percentage: totalBookings > 0 ? Math.round((newBookings / totalBookings) * 100) : 0,
        colorToken: 'var(--color-accent)'
      },
      {
        status: 'Pending',
        label_ar: 'تحت الإجراء',
        label_en: 'Pending',
        count: pendingBookings,
        percentage: totalBookings > 0 ? Math.round((pendingBookings / totalBookings) * 100) : 0,
        colorToken: 'var(--color-secondary-blue)'
      },
      {
        status: 'Rejected',
        label_ar: 'مرفوضة',
        label_en: 'Rejected',
        count: rejectedBookings,
        percentage: totalBookings > 0 ? Math.round((rejectedBookings / totalBookings) * 100) : 0,
        colorToken: 'var(--color-border)'
      }
    ];

    let umrahCount = 0;
    let hajjCount = 0;
    let umrahRevenue = 0;
    let hajjRevenue = 0;

    filtered.forEach(b => {
      if (b.category === 'umrah') {
        umrahCount++;
        umrahRevenue += b.totalPrice;
      } else {
        hajjCount++;
        hajjRevenue += b.totalPrice;
      }
    });

    const categoriesDistribution = [
      {
        category: 'umrah',
        label_ar: 'برامج العمرة',
        label_en: 'Umrah Programs',
        count: umrahCount,
        revenue: umrahRevenue,
        percentage: totalBookings > 0 ? Math.round((umrahCount / totalBookings) * 100) : 0
      },
      {
        category: 'hajj',
        label_ar: 'برامج الحج',
        label_en: 'Hajj Programs',
        count: hajjCount,
        revenue: hajjRevenue,
        percentage: totalBookings > 0 ? Math.round((hajjCount / totalBookings) * 100) : 0
      }
    ];

    const MONTHS = [
      { key: '2026-05', name_ar: 'مايو 2026', name_en: 'May 2026' },
      { key: '2026-06', name_ar: 'يونيو 2026', name_en: 'Jun 2026' },
      { key: '2026-07', name_ar: 'يوليو 2026', name_en: 'Jul 2026' },
      { key: '2026-08', name_ar: 'أغسطس 2026', name_en: 'Aug 2026' },
      { key: '2026-09', name_ar: 'سبتمبر 2026', name_en: 'Sep 2026' },
      { key: '2026-10', name_ar: 'أكتوبر 2026', name_en: 'Oct 2026' }
    ];

    const monthlyActivity = MONTHS.map(m => {
      const monthBookings = RAW_BOOKINGS.filter(b => b.bookingDate.startsWith(m.key));
      const count = monthBookings.length;
      const value = monthBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const paid = monthBookings.reduce((sum, b) => sum + b.paidAmount, 0);
      return {
        monthKey: m.key,
        name_ar: m.name_ar,
        name_en: m.name_en,
        bookingsCount: count,
        totalValue: value,
        amountCollected: paid
      };
    });

    const recentBookings = filtered.slice(0, 8);

    return {
      period,
      specificDate,
      company: COMPANY_INFO,
      kpi: {
        totalBookings,
        newBookings,
        pendingBookings,
        confirmedBookings,
        rejectedBookings,
        totalBookingValue,
        amountCollected,
        remainingAmount,
        currency: 'EGP'
      },
      popularPrograms,
      statusDistribution,
      categoriesDistribution,
      monthlyActivity,
      recentBookings,
      allBookings: filtered,
      activities: ACTIVITIES_FEED,
      notifications: NOTIFICATIONS
    };
  }

  /**
   * Multi-criteria filter query evaluator for company bookings
   */
  function getBookings(filters = {}) {
    let list = [...RAW_BOOKINGS];

    if (!filters) return list;

    const { search, program, programId, dateFrom, dateTo, bookingDate, bookingStatus, paymentStatus } = filters;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(b => 
        b.reference.toLowerCase().includes(q) ||
        (b.customerName_ar && b.customerName_ar.toLowerCase().includes(q)) ||
        (b.customerName_en && b.customerName_en.toLowerCase().includes(q))
      );
    }

    if (program && program !== 'all' && program !== 'All') {
      list = list.filter(b => 
        b.programId === program || 
        b.programName_en.toLowerCase() === program.toLowerCase() || 
        b.programName_ar === program
      );
    }

    if (programId && programId !== 'all') {
      list = list.filter(b => b.programId === programId);
    }

    if (dateFrom) {
      list = list.filter(b => b.bookingDate >= dateFrom);
    }

    if (dateTo) {
      list = list.filter(b => b.bookingDate <= dateTo);
    }

    if (bookingDate) {
      list = list.filter(b => b.bookingDate === bookingDate);
    }

    if (bookingStatus && bookingStatus !== 'all' && bookingStatus !== 'All') {
      const bs = bookingStatus.toLowerCase();
      list = list.filter(b => {
        const bStatus = (b.bookingStatus || '').toLowerCase();
        const sStatus = (b.status || '').toLowerCase();
        if (bs === 'under_review' || bs === 'pending') {
          return bStatus === 'under_review' || sStatus === 'pending';
        }
        return bStatus === bs || sStatus === bs;
      });
    }

    if (paymentStatus && paymentStatus !== 'all' && paymentStatus !== 'All') {
      const ps = paymentStatus.toLowerCase();
      list = list.filter(b => (b.paymentStatus || '').toLowerCase() === ps);
    }

    return list;
  }

  function getBookingById(idOrRef) {
    if (!idOrRef) return null;
    const target = String(idOrRef).trim().toLowerCase();
    return RAW_BOOKINGS.find(b => 
      b.id.toLowerCase() === target || 
      b.reference.toLowerCase() === target
    ) || null;
  }

  function confirmBooking(idOrRef, companyUser) {
    const booking = getBookingById(idOrRef);
    if (!booking) return { success: false, error: 'Booking not found' };
    if (booking.bookingStatus === 'confirmed' || booking.status === 'Confirmed') {
      return { success: false, error: 'Booking is already confirmed' };
    }
    if (booking.bookingStatus === 'rejected' || booking.bookingStatus === 'cancelled') {
      return { success: false, error: 'Cannot confirm a cancelled or rejected booking' };
    }

    booking.bookingStatus = 'confirmed';
    booking.status = 'Confirmed';

    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 16);
    booking.timeline.push({
      id: 'evt_act_' + Date.now(),
      timestamp: timeStr,
      type: 'confirmed',
      title_ar: 'تأكيد الحجز بنجاح',
      title_en: 'Booking Successfully Confirmed',
      desc_ar: 'تم تأكيد الحجز رسمياً واعتماد وثائق المعتمرين وتخصيص باقة السفر للعميل.',
      desc_en: 'Booking officially confirmed, pilgrim documents verified, and package allocated.',
      actor_ar: companyUser ? (companyUser.name || 'شركة الدرة للسياحة') : 'شركة الدرة للسياحة (مسؤول الحجوزات)',
      actor_en: companyUser ? (companyUser.name_en || companyUser.name || 'AL DORRA TRAVEL') : 'AL DORRA TRAVEL (Reservations Manager)',
      party: 'company'
    });

    return { success: true, booking };
  }

  function reportPayment(idOrRef, paymentData, companyUser) {
    const booking = getBookingById(idOrRef);
    if (!booking) return { success: false, error: 'Booking not found' };

    const amount = Number(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: 'Payment amount must be greater than zero' };
    }
    if (amount > booking.remainingAmount) {
      return { success: false, error: 'Reported amount cannot exceed remaining balance' };
    }

    booking.paidAmount += amount;
    booking.remainingAmount = booking.totalPrice - booking.paidAmount;
    if (booking.remainingAmount === 0) {
      booking.paymentStatus = 'fully_paid';
    } else {
      booking.paymentStatus = 'partially_paid';
    }

    const now = new Date();
    const dateStr = paymentData.receiptDate || now.toISOString().split('T')[0];
    const timeStr = dateStr + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const methodLabels = {
      cash_office: { ar: 'نقداً بمقر الشركة', en: 'Cash at Branch Office' },
      bank_deposit: { ar: 'إيداع / تحويل بنكي', en: 'Direct Bank Deposit' },
      cheque: { ar: 'شيك بنكي معتمد', en: 'Certified Bank Cheque' }
    };
    const methodInfo = methodLabels[paymentData.paymentMethod] || { ar: paymentData.paymentMethod || 'نقداً', en: paymentData.paymentMethod || 'Cash' };

    const txId = 'pay_rep_' + Date.now();
    const receiptRef = paymentData.receiptRef || ('RCP-' + String(Date.now()).slice(-6));

    const newPayment = {
      id: txId,
      reference: receiptRef,
      date: timeStr,
      amount,
      source: 'company',
      method_key: paymentData.paymentMethod || 'cash_office',
      method_ar: methodInfo.ar,
      method_en: methodInfo.en,
      status_key: 'company_reported',
      status_ar: 'مسدد للشركة (قيد تدقيق ميقات)',
      status_en: 'Company-Reported (Pending Miqat)',
      verifiedByMiqat: false,
      recordedBy_ar: companyUser ? (companyUser.name || 'شركة الدرة للسياحة') : 'شركة الدرة للسياحة',
      recordedBy_en: companyUser ? (companyUser.name_en || 'AL DORRA TRAVEL') : 'AL DORRA TRAVEL',
      transactionRef: receiptRef,
      notes_ar: paymentData.notes || 'تم استلام الدفعة النقدية بمقر الشركة.',
      notes_en: paymentData.notes || 'Payment received directly at branch office.'
    };
    booking.payments.push(newPayment);

    booking.timeline.push({
      id: 'evt_rep_' + Date.now(),
      timestamp: timeStr,
      type: 'payment_reported',
      title_ar: 'تسجيل استلام دفعة نقدية بالشركة',
      title_en: 'Cash Receipt Reported by Company',
      desc_ar: 'قامت الشركة بتسجيل استلام دفعة بقيمة ' + amount.toLocaleString('en-US') + ' ج.م بموجب إيصال رقم (' + receiptRef + '). الإيصال قيد تدقيق الإدارة المالية بميقات.',
      desc_en: 'Company reported receiving payment of ' + amount.toLocaleString('en-US') + ' EGP under receipt (' + receiptRef + '). Pending Miqat finance verification.',
      actor_ar: companyUser ? (companyUser.name || 'شركة الدرة للسياحة') : 'شركة الدرة للسياحة',
      actor_en: companyUser ? (companyUser.name_en || 'AL DORRA TRAVEL') : 'AL DORRA TRAVEL',
      party: 'company'
    });

    return { success: true, booking, payment: newPayment };
  }

  function rejectBooking(idOrRef, rejectionData, companyUser) {
    const booking = getBookingById(idOrRef);
    if (!booking) return { success: false, error: 'Booking not found' };
    if (booking.bookingStatus === 'rejected') {
      return { success: false, error: 'Booking is already rejected' };
    }

    const reason = (rejectionData && rejectionData.reason) ? rejectionData.reason.trim() : '';
    if (!reason) {
      return { success: false, error: 'Rejection reason is mandatory' };
    }

    booking.bookingStatus = 'rejected';
    booking.status = 'Rejected';

    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 16);

    const notes = (rejectionData && rejectionData.notes) ? rejectionData.notes.trim() : '';
    const descAr = 'تم رفض الحجز من قبل الشركة. السبب: ' + reason + (notes ? ' (' + notes + ')' : '') + '. في حال وجود دفعة مقدمة سيتم إحالتها لإجراءات الاسترداد المعتمدة بميقات.';
    const descEn = 'Booking rejected by partner company. Reason: ' + reason + (notes ? ' (' + notes + ')' : '') + '. Any deposit paid enters Miqat refund protocol.';

    booking.timeline.push({
      id: 'evt_rej_' + Date.now(),
      timestamp: timeStr,
      type: 'rejected',
      title_ar: 'رفض طلب الحجز',
      title_en: 'Booking Rejected by Company',
      desc_ar: descAr,
      desc_en: descEn,
      actor_ar: companyUser ? (companyUser.name || 'شركة الدرة للسياحة') : 'شركة الدرة للسياحة',
      actor_en: companyUser ? (companyUser.name_en || 'AL DORRA TRAVEL') : 'AL DORRA TRAVEL',
      party: 'company'
    });

    return { success: true, booking };
  }

  function requestProgramChange(idOrRef, changeData, companyUser) {
    const booking = getBookingById(idOrRef);
    if (!booking) return { success: false, error: 'Booking not found' };
    if (booking.bookingStatus === 'rejected' || booking.bookingStatus === 'cancelled') {
      return { success: false, error: 'Cannot propose program change for a closed booking' };
    }

    const replacementId = changeData ? changeData.replacementProgramId : '';
    const replacementProg = PROGRAMS.find(p => p.id === replacementId);
    if (!replacementProg) {
      return { success: false, error: 'Valid replacement program must be selected' };
    }

    const proposedTotalPrice = replacementProg.unitPrice * booking.travelers;
    const reason = (changeData && changeData.reason) ? changeData.reason.trim() : 'تعديل تشغيلي مقترح للبرنامج';

    // Strict rule: DO NOT unilaterally change official booking program or price!
    booking.proposedChange = {
      programId: replacementProg.id,
      programName_ar: replacementProg.name_ar,
      programName_en: replacementProg.name_en,
      category: replacementProg.category,
      unitPrice: replacementProg.unitPrice,
      totalPrice: proposedTotalPrice,
      priceDiff: proposedTotalPrice - booking.totalPrice,
      reason,
      status: 'pending_customer_agreement',
      requestedAt: new Date().toISOString()
    };

    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 16);

    booking.timeline.push({
      id: 'evt_chg_' + Date.now(),
      timestamp: timeStr,
      type: 'change_requested',
      title_ar: 'اقتراح تعديل البرنامج (بانتظار موافقة العميل)',
      title_en: 'Program Change Proposed (Pending Customer Agreement)',
      desc_ar: 'قامت الشركة باقتراح استبدال البرنامج بـ (' + replacementProg.name_ar + '). طبقاً للقواعد التنظيمية، يظل البرنامج الأصلي سارياً ولا يعتمد التعديل إلا بعد تسجيل موافقة العميل رسمياً.',
      desc_en: 'Company proposed replacing program with (' + replacementProg.name_en + '). In accordance with regulations, original package remains in effect until customer agreement is officially recorded.',
      actor_ar: companyUser ? (companyUser.name || 'شركة الدرة للسياحة') : 'شركة الدرة للسياحة',
      actor_en: companyUser ? (companyUser.name_en || 'AL DORRA TRAVEL') : 'AL DORRA TRAVEL',
      party: 'company'
    });

    return { success: true, booking, proposedChange: booking.proposedChange };
  }

  /**
   * Authoritative Financial Overview & Collections Engine
   * Strictly separates Platform-Verified collections from Company Direct Branch collections.
   */
  function getFinancialOverviewData(options = {}) {
    const {
      period = 'all',
      date = null,
      search = '',
      program = 'all',
      source = 'all',
      method = 'all',
      verification = 'all'
    } = options;

    let periodBookings = [...RAW_BOOKINGS];

    // Filter bookings by period or specific date
    if (date) {
      periodBookings = periodBookings.filter(b => b.bookingDate === date);
    } else if (period === 'today') {
      periodBookings = periodBookings.filter(b => b.bookingDate === '2026-10-29' || b.bookingDate === '2026-10-30');
    } else if (period === 'week') {
      periodBookings = periodBookings.filter(b => b.bookingDate >= '2026-10-24' && b.bookingDate <= '2026-10-30');
    } else if (period === 'month') {
      periodBookings = periodBookings.filter(b => b.bookingDate.startsWith('2026-10'));
    } else if (period === 'last30') {
      periodBookings = periodBookings.filter(b => b.bookingDate >= '2026-10-01');
    }

    // Authoritative totals across period bookings
    let totalBookingValue = 0;
    let remainingOutstanding = 0;
    periodBookings.forEach(b => {
      totalBookingValue += b.totalPrice;
      remainingOutstanding += b.remainingAmount;
    });

    // Extract itemized transactions for period bookings
    const allPeriodTransactions = [];
    periodBookings.forEach(b => {
      if (b.payments && b.payments.length) {
        b.payments.forEach(p => {
          const isPlatform = p.source ? (p.source === 'platform') : (!p.status_key.startsWith('company'));
          const txSource = isPlatform ? 'platform' : 'company';
          allPeriodTransactions.push({
            id: p.id,
            reference: p.reference,
            transactionRef: p.transactionRef || p.reference,
            date: p.date,
            amount: p.amount,
            method_key: p.method_key,
            method_ar: p.method_ar,
            method_en: p.method_en,
            status_key: p.status_key,
            status_ar: p.status_ar,
            status_en: p.status_en,
            verifiedByMiqat: !!p.verifiedByMiqat,
            recordedBy_ar: p.recordedBy_ar,
            recordedBy_en: p.recordedBy_en,
            notes_ar: p.notes_ar || '',
            notes_en: p.notes_en || '',
            source: txSource,
            source_ar: isPlatform ? 'منصة ميقات' : 'فرع الشركة',
            source_en: isPlatform ? 'Miqat Platform' : 'Company Branch',
            bookingId: b.id,
            bookingRef: b.reference,
            customerId: b.customerId,
            customerName_ar: b.customerName_ar,
            customerName_en: b.customerName_en,
            customerPhone: b.customerPhone,
            programId: b.programId,
            programName_ar: b.programName_ar,
            programName_en: b.programName_en,
            category: b.category,
            bookingDate: b.bookingDate
          });
        });
      }
    });

    // Authoritative Collections Split
    let platformCollections = 0;
    let companyReportedCollections = 0;
    let companyReportedPending = 0;
    let companyReportedVerified = 0;

    allPeriodTransactions.forEach(tx => {
      if (tx.source === 'platform') {
        platformCollections += tx.amount;
      } else {
        companyReportedCollections += tx.amount;
        if (tx.verifiedByMiqat) {
          companyReportedVerified += tx.amount;
        } else {
          companyReportedPending += tx.amount;
        }
      }
    });

    const totalPaid = platformCollections + companyReportedCollections;
    const collectionRate = totalBookingValue > 0 ? Math.round((totalPaid / totalBookingValue) * 100) : 0;
    const platformRate = totalBookingValue > 0 ? Math.round((platformCollections / totalBookingValue) * 100) : 0;
    const companyRate = totalBookingValue > 0 ? Math.round((companyReportedCollections / totalBookingValue) * 100) : 0;
    const remainingRate = totalBookingValue > 0 ? Math.round((remainingOutstanding / totalBookingValue) * 100) : 0;

    // Monthly Activity Timeline (Platform vs Company)
    const MONTHS = [
      { key: '2026-05', name_ar: 'مايو 2026', name_en: 'May 2026' },
      { key: '2026-06', name_ar: 'يونيو 2026', name_en: 'Jun 2026' },
      { key: '2026-07', name_ar: 'يوليو 2026', name_en: 'Jul 2026' },
      { key: '2026-08', name_ar: 'أغسطس 2026', name_en: 'Aug 2026' },
      { key: '2026-09', name_ar: 'سبتمبر 2026', name_en: 'Sep 2026' },
      { key: '2026-10', name_ar: 'أكتوبر 2026', name_en: 'Oct 2026' }
    ];

    const monthlyActivity = MONTHS.map(m => {
      const monthBookings = RAW_BOOKINGS.filter(b => b.bookingDate.startsWith(m.key));
      const totalVal = monthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

      let pSum = 0;
      let cSum = 0;
      monthBookings.forEach(b => {
        (b.payments || []).forEach(p => {
          const isPlat = p.source ? (p.source === 'platform') : (!p.status_key.startsWith('company'));
          if (isPlat) pSum += p.amount;
          else cSum += p.amount;
        });
      });

      return {
        monthKey: m.key,
        name_ar: m.name_ar,
        name_en: m.name_en,
        bookingsCount: monthBookings.length,
        totalValue: totalVal,
        platformCollections: pSum,
        companyCollections: cSum,
        totalCollected: pSum + cSum
      };
    });

    // Program Category Financial Breakdown
    const programBreakdown = PROGRAMS.map(prog => {
      const progBookings = periodBookings.filter(b => b.programId === prog.id);
      const count = progBookings.length;
      const rev = progBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const paid = progBookings.reduce((sum, b) => sum + b.paidAmount, 0);
      const remaining = progBookings.reduce((sum, b) => sum + b.remainingAmount, 0);
      return {
        id: prog.id,
        name_ar: prog.name_ar,
        name_en: prog.name_en,
        category: prog.category,
        unitPrice: prog.unitPrice,
        bookingsCount: count,
        totalRevenue: rev,
        collectedAmount: paid,
        remainingAmount: remaining,
        collectionRate: rev > 0 ? Math.round((paid / rev) * 100) : 0
      };
    });

    // Multi-Facet Filtering on Transactions
    let filteredTransactions = [...allPeriodTransactions];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filteredTransactions = filteredTransactions.filter(tx => {
        return (
          (tx.transactionRef && tx.transactionRef.toLowerCase().includes(q)) ||
          (tx.reference && tx.reference.toLowerCase().includes(q)) ||
          (tx.bookingRef && tx.bookingRef.toLowerCase().includes(q)) ||
          (tx.customerName_ar && tx.customerName_ar.toLowerCase().includes(q)) ||
          (tx.customerName_en && tx.customerName_en.toLowerCase().includes(q)) ||
          (tx.customerPhone && tx.customerPhone.includes(q))
        );
      });
    }

    if (program && program !== 'all') {
      filteredTransactions = filteredTransactions.filter(tx => tx.programId === program);
    }

    if (source && source !== 'all') {
      filteredTransactions = filteredTransactions.filter(tx => tx.source === source);
    }

    if (method && method !== 'all') {
      filteredTransactions = filteredTransactions.filter(tx => tx.method_key === method);
    }

    if (verification && verification !== 'all') {
      if (verification === 'verified') {
        filteredTransactions = filteredTransactions.filter(tx => tx.verifiedByMiqat === true);
      } else if (verification === 'pending') {
        filteredTransactions = filteredTransactions.filter(tx => tx.verifiedByMiqat === false);
      } else if (verification === 'verified_platform') {
        filteredTransactions = filteredTransactions.filter(tx => tx.source === 'platform' && tx.verifiedByMiqat === true);
      } else if (verification === 'verified_company') {
        filteredTransactions = filteredTransactions.filter(tx => tx.source === 'company' && tx.verifiedByMiqat === true);
      }
    }

    // Sort descending by date
    filteredTransactions.sort((a, b) => (b.date > a.date ? 1 : -1));

    const filteredSum = filteredTransactions.reduce((s, tx) => s + tx.amount, 0);

    return {
      period,
      company: COMPANY_INFO,
      summary: {
        totalBookingValue,
        platformCollections,
        companyReportedCollections,
        companyReportedPending,
        companyReportedVerified,
        remainingOutstanding,
        totalPaid,
        collectionRate,
        platformRate,
        companyRate,
        remainingRate,
        totalBookingsCount: periodBookings.length,
        totalTransactionsCount: allPeriodTransactions.length,
        currency: 'EGP'
      },
      monthlyActivity,
      programBreakdown,
      transactions: filteredTransactions,
      allTransactionsCount: allPeriodTransactions.length,
      filteredCount: filteredTransactions.length,
      filteredSum
    };
  }

  return {
    COMPANY_INFO,
    PROGRAMS,
    CUSTOMERS,
    RAW_BOOKINGS,
    ACTIVITIES_FEED,
    NOTIFICATIONS,
    getDashboardMetrics,
    getBookings,
    getBookingById,
    confirmBooking,
    reportPayment,
    rejectBooking,
    requestProgramChange,
    getFinancialOverviewData
  };
});

