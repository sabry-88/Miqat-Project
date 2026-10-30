/**
 * MIQAT JOURNEYHUB — PARTNER COMPANY PORTAL MOCK DATA ENGINE
 * Contracted Partner: AL DORRA TRAVEL (شركة الدرة للسياحة)
 * 
 * Strict Mock Data Guarantee:
 * 1. Fully isolated and clearly identified mock dataset.
 * 2. 100% mathematical consistency: Remaining Amount = Total Price - Paid Amount.
 * 3. Single authoritative source for all KPIs, charts, distributions, and tables.
 */

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
  // 6 New
  'New', 'New', 'New', 'New', 'New', 'New',
  // 5 Pending
  'Pending', 'Pending', 'Pending', 'Pending', 'Pending',
  // 2 Rejected
  'Rejected', 'Rejected',
  // 23 Confirmed
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

// Generate the 36 raw bookings
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

  RAW_BOOKINGS.push({
    id: `bkg_${1000 + i}`,
    reference: `BK-2026-${String(refNum).padStart(4, '0')}`,
    customerId: `cust_${100 + i}`,
    customerName_ar: cust.name_ar,
    customerName_en: cust.name_en,
    customerPhone: cust.phone,
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
    bookingDate: date,
    currency: 'EGP'
  });
}

// Operational Activities Feed
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

// System Notifications
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

/**
 * Filter bookings by time period and return mathematically consistent aggregated dashboard data
 * Supported periods: 'all' (default), 'week', 'month' (Oct 2026), 'last30', 'season'
 */
function getDashboardMetrics(period = 'all', specificDate = null) {
  let filtered = RAW_BOOKINGS;

  if (specificDate) {
    filtered = RAW_BOOKINGS.filter(b => b.bookingDate === specificDate);
  } else if (period === 'week') {
    // Current week: Saturday 2026-10-24 through Friday 2026-10-30
    filtered = RAW_BOOKINGS.filter(b => b.bookingDate >= '2026-10-24' && b.bookingDate <= '2026-10-30');
  } else if (period === 'month') {
    // Current month: October 2026
    filtered = RAW_BOOKINGS.filter(b => b.bookingDate.startsWith('2026-10'));
  } else if (period === 'last30') {
    // Last 30 days from 2026-10-30: bookings >= 2026-10-01
    filtered = RAW_BOOKINGS.filter(b => b.bookingDate >= '2026-10-01');
  } else if (period === 'season') {
    // Entire current 1447H Season (all 36 bookings)
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

  // Strict mathematical parity check
  if (remainingAmount !== (totalBookingValue - amountCollected)) {
    throw new Error('MATHEMATICAL_INCONSISTENCY_IN_MOCK_DATA');
  }

  // Popular Programs Breakdown (Derived directly from filtered set)
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

  // Status Distribution
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

  // Trip Categories Breakdown (Umrah vs Hajj)
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

  // Monthly Activity Over Time (Last 6 Months: May to Oct 2026)
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

  // Recent Bookings (first 8 for clean dashboard presentation)
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

module.exports = {
  COMPANY_INFO,
  PROGRAMS,
  CUSTOMERS,
  RAW_BOOKINGS,
  ACTIVITIES_FEED,
  NOTIFICATIONS,
  getDashboardMetrics
};

