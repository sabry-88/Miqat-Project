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
    root.CompanyMockData = root.MiqatCompanyMockData;
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
    {
      id: 'prog_umrah_econ',
      companyId: 'comp_aldorra_01',
      code: 'UMR-2026-EC01',
      name_ar: 'عمرة اقتصادية موفرة',
      name_en: 'Umrah Economy Saver',
      category: 'umrah',
      type: 'economy',
      status: 'published',
      availability: 'available',
      durationDays: 10,
      durationNights: 9,
      departureDate: '2026-11-15',
      returnDate: '2026-11-25',
      departureTime: '08:30',
      returnTime: '17:45',
      season: '1447H / 2026',
      bookingDeadline: '2026-11-08',
      destination_ar: 'مكة المكرمة والمدينة المنورة',
      destination_en: 'Makkah & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق أنوار الضيافة (أجياد)',
      makkahHotel_en: 'Anwar Al Diyafa Hotel (Ajyad)',
      makkahNights: 5,
      makkahDistance: 650,
      madinahHotel_ar: 'فندق روضة العقيق (المنطقة المركزية)',
      madinahHotel_en: 'Rawdet Al Aqeeq Hotel (Central Area)',
      madinahNights: 4,
      madinahDistance: 450,
      airline_ar: 'مصر للطيران — رحلة مباشرة',
      airline_en: 'EgyptAir — Direct Flight',
      flightType: 'direct',
      departureAirport: 'CAI — مطار القاهرة الدولي',
      arrivalAirport: 'JED — مطار الملك عبد العزيز بجدة',
      transportType_ar: 'حافلات سياحية حديثة ومكيفة 49 راكب',
      transportType_en: 'Modern Air-Conditioned Buses (49-seater)',
      unitPrice: 38000,
      basePrice: 38000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 42000,
        tripleRoom: 40000,
        quadRoom: 38000,
        childPrice: 22000,
        infantPrice: 9500,
        deposit: 10000
      },
      capacity: 50,
      minGroupSize: 1,
      shortDescription_ar: 'برنامج اقتصادي متكامل يشمل الطيران المباشر والإقامة القريبة مع النقل الجماعي والإشراف الإداري.',
      shortDescription_en: 'Comprehensive economy package with direct flights, close lodging, group transport, and guidance.',
      fullDescription_ar: 'رحلة عمرة ميسرة تناسب الأفراد والعائلات، تشمل تذاكر الطيران على مصر للطيران، والإقامة في فنادق 3 نجوم مريحة، والانتقالات الداخلية بحافلات سياحية حديثة، مع مشرف مرافق طوال الرحلة.',
      fullDescription_en: 'An affordable Umrah trip suitable for individuals and families, including EgyptAir flights, 3-star lodging, modern bus transfers, and continuous administrative supervision.',
      includedServices: [
        'تأشيرة العمرة الإلكترونية والتأمين الطبي الشامل',
        'تذاكر الطيران ذهاب وعودة (مصر للطيران)',
        'الإقامة 5 ليالٍ بمكة و4 ليالٍ بالمدينة',
        'الانتقالات الداخلية بحافلات سياحية مكيفة',
        'مشرف ديني وإداري مرافق طوال فترة الرحلة',
        'مزارات مكة المكرمة والمدينة المنورة'
      ],
      excludedServices: [
        'المصروفات الشخصية والوجبات الإضافية',
        'الجولات السياحية والتاريخية الخاصة غير المدرجة'
      ],
      itinerary: [
        { day: 1, title_ar: 'التجمع بمطار القاهرة الدولي والمغادرة إلى جدة ثم التوجه إلى مكة المكرمة لأداء مناسك العمرة', title_en: 'Gathering at Cairo Airport, flight to Jeddah, and transfer to Makkah to perform Umrah' },
        { day: 2, title_ar: 'يوم حر للعبادة والصلاة في المسجد الحرام', title_en: 'Free day for prayers and worship at the Grand Mosque' },
        { day: 4, title_ar: 'جولة مزارات مكة المكرمة (غار حراء، غار ثور، منى، عرفات، ومزدلفة)', title_en: 'Makkah historical ziyarat tour (Hira, Thawr, Mina, Arafat, Muzdalifah)' },
        { day: 6, title_ar: 'المغادرة إلى المدينة المنورة واستلام الغرف بفندق روضة العقيق وزيارة المسجد النبوي', title_en: 'Transfer to Madinah, check-in at hotel, and visiting the Prophet’s Mosque' },
        { day: 8, title_ar: 'مزارات المدينة المنورة (مسجد قباء، شهداء أحد، القبلتين)', title_en: 'Madinah ziyarat tour (Quba Mosque, Uhud Martyrs, Qiblatayn)' },
        { day: 10, title_ar: 'صلاة الوداع والتوجه إلى مطار جدة للعودة بسلام إلى القاهرة', title_en: 'Farewell prayer and transfer to airport for departure to Cairo' }
      ],
      internalNotes: 'الرحلة محجوزة على دفعة مقاعد المجموعة A لدى مصر للطيران. تم تسليم خطابات التأمين للشركاء.',
      imageUrl: './assets/kaaba-kiswah.jpg',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-10-25T14:30:00Z'
    },
    {
      id: 'prog_umrah_prem',
      companyId: 'comp_aldorra_01',
      code: 'UMR-2026-PR02',
      name_ar: 'عمرة متميزة 5 نجوم',
      name_en: 'Umrah Premium 5-Star',
      category: 'umrah',
      type: 'premium',
      status: 'published',
      availability: 'available',
      durationDays: 14,
      durationNights: 13,
      departureDate: '2026-11-20',
      returnDate: '2026-12-04',
      departureTime: '11:15',
      returnTime: '21:30',
      season: '1447H / 2026',
      bookingDeadline: '2026-11-12',
      destination_ar: 'مكة المكرمة والمدينة المنورة',
      destination_en: 'Makkah & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق سويس أوتيل المقام (أبراج وقف الملك عبد العزيز)',
      makkahHotel_en: 'Swissôtel Al Maqam (Abraj Clock)',
      makkahNights: 7,
      makkahDistance: 100,
      madinahHotel_ar: 'فندق المدينة هيلتون (الصف الأول أمام الحرم)',
      madinahHotel_en: 'Madinah Hilton (Front Row at Prophet’s Mosque)',
      madinahNights: 6,
      madinahDistance: 100,
      airline_ar: 'الخطوط السعودية — رحلة منتظمة',
      airline_en: 'Saudia Airlines — Regular Direct Flight',
      flightType: 'direct',
      departureAirport: 'CAI — مطار القاهرة الدولي',
      arrivalAirport: 'MED — مطار الأمير محمد بن عبد العزيز بالمدينة',
      transportType_ar: 'قطار الحرمين السريع VIP + حافلات مرسيدس حديثة',
      transportType_en: 'Haramain High-Speed Train VIP + Modern Mercedes Coaches',
      unitPrice: 65000,
      basePrice: 65000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 72000,
        tripleRoom: 68000,
        quadRoom: 65000,
        childPrice: 38000,
        infantPrice: 14000,
        deposit: 20000
      },
      capacity: 45,
      minGroupSize: 1,
      shortDescription_ar: 'إقامة فاخرة 5 نجوم مطلة على ساحات الحرمين الشريفين مع بوفيه إفطار فاخر وقطار الحرمين السريع.',
      shortDescription_en: 'Luxury 5-star lodging facing the Holy Mosques with gourmet breakfast and Haramain high-speed train.',
      fullDescription_ar: 'تجربة روحانية راقية تلبي تطلعات الراغبين في القرب من الحرمين، إقامة 7 ليالٍ في أبراج الساعة بمكة و6 ليالٍ في فندق المدينة هيلتون، شاملة بوفيه الإفطار المفتوح والانتقال بقطار الحرمين السريع بين المدينتين.',
      fullDescription_en: 'An elevated spiritual journey offering prime proximity to the Holy Mosques. 7 nights in Clock Towers Makkah and 6 nights in Madinah Hilton, with gourmet breakfast and Haramain Train transfers.',
      includedServices: [
        'تأشيرة العمرة والتأمين الطبي الشامل VIP',
        'تذاكر الطيران على الخطوط الجوية السعودية (مطار المدينة / مطار جدة)',
        'بوفيه إفطار يومي فاخر في الفندقين',
        'تذاكر درجة أولى بقطار الحرمين السريع (مكة — المدينة)',
        'استقبال وتوديع خاص في المطارات',
        'حقيبة هدايا فاخرة لكل معتمر تشمل إحراماً وسجادة ومظلة'
      ],
      excludedServices: [
        'وجبات الغداء والعشاء غير المحددة',
        'خدمات الغسيل والمكالمات الهاتفية'
      ],
      itinerary: [
        { day: 1, title_ar: 'الوصول إلى مطار المدينة المنورة والانتقال إلى فندق المدينة هيلتون', title_en: 'Arrival at Madinah Airport and VIP transfer to Madinah Hilton' },
        { day: 3, title_ar: 'زيارة الروضة الشريفة ومزارات المدينة المنورة بحافلات خاصة', title_en: 'Visiting the Rawdah Sharif and Madinah historic sites' },
        { day: 7, title_ar: 'ركوب قطار الحرمين السريع إلى مكة المكرمة واستلام الغرف بفندق سويس أوتيل وأداء مناسك العمرة', title_en: 'Boarding Haramain High-Speed Train to Makkah, hotel check-in and performing Umrah' },
        { day: 10, title_ar: 'محاضرة إيمانية خاصة وجولة معالم مكة المكرمة التاريخية', title_en: 'Private spiritual lecture and historical Makkah landmarks tour' },
        { day: 14, title_ar: 'طواف الوداع والانتقال إلى مطار الملك عبد العزيز بجدة للعودة للقاهرة', title_en: 'Farewell Tawaf and transfer to Jeddah Airport for return to Cairo' }
      ],
      internalNotes: 'تم تأكيد الغرف في برج المقام. تم حجز تذاكر قطار الحرمين مقدماً للمجموعة بأكملها.',
      imageUrl: './assets/makkah-sunset-tawaf.jpg',
      createdAt: '2026-08-10T09:00:00Z',
      updatedAt: '2026-10-28T11:20:00Z'
    },
    {
      id: 'prog_umrah_vip',
      companyId: 'comp_aldorra_01',
      code: 'UMR-2026-VP03',
      name_ar: 'عمرة النخبة VIP المباشرة',
      name_en: 'Umrah Elite VIP Direct',
      category: 'umrah',
      type: 'vip',
      status: 'published',
      availability: 'limited',
      durationDays: 15,
      durationNights: 14,
      departureDate: '2026-12-01',
      returnDate: '2026-12-16',
      departureTime: '13:00',
      returnTime: '23:45',
      season: '1447H / 2026',
      bookingDeadline: '2026-11-22',
      destination_ar: 'مكة المكرمة والمدينة المنورة',
      destination_en: 'Makkah & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق رافلز قصر مكة (مطل مباشرة على الكعبة)',
      makkahHotel_en: 'Raffles Makkah Palace (Direct Kaaba View)',
      makkahNights: 8,
      makkahDistance: 50,
      madinahHotel_ar: 'فندق دار التقوى أوبروي (الصف الأول بالمسجد النبوي)',
      madinahHotel_en: 'Dar Al Taqwa Oberoi (Front Row at Prophet’s Mosque)',
      madinahNights: 6,
      madinahDistance: 50,
      airline_ar: 'الخطوط السعودية — درجة رجال الأعمال',
      airline_en: 'Saudia Airlines — Business Class',
      flightType: 'direct',
      departureAirport: 'CAI — صالة كبار الزوار (VIP Terminal)',
      arrivalAirport: 'JED — صالة كبار الزوار (VIP Terminal)',
      transportType_ar: 'سيارات مرسيدس S-Class وسيارات GMC خاصة بالسائق',
      transportType_en: 'Private Mercedes S-Class & GMC Yukon with Chauffeur',
      unitPrice: 110000,
      basePrice: 110000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 125000,
        tripleRoom: 118000,
        quadRoom: 110000,
        childPrice: 65000,
        infantPrice: 25000,
        deposit: 40000
      },
      capacity: 30,
      minGroupSize: 1,
      shortDescription_ar: 'أعلى معايير الرفاهية والخدمة الفندقية الفاخرة مع إطلالة كاملة ومباشرة على الكعبة المشرفة وخدمة كبار الشخصيات.',
      shortDescription_en: 'Highest standard of luxury and hospitality with direct Kaaba view suites and exclusive VIP service.',
      fullDescription_ar: 'باقة استثنائية لكبار الشخصيات ورجال الأعمال، إقامة في أجنحة فندق رافلز قصر مكة المطلة على الكعبة المشرفة مباشرة، وفي دار التقوى بالمدينة المنورة، مع طيران درجة رجال الأعمال، وسيارات خاصة وسائق خاص طوال الرحلة.',
      fullDescription_en: 'An extraordinary package designed for dignitaries and business executives. Accommodation in direct Kaaba-view suites at Raffles Makkah Palace and Dar Al Taqwa Madinah, with Business Class flights and private chauffeur transport.',
      includedServices: [
        'تأشيرة VIP فورية وتأمين طبي شامل مع تغطية مستشفيات النخبة',
        'تذاكر طيران درجة رجال الأعمال على الخطوط السعودية',
        'أجنحة رئاسية فاخرة مطلة على الكعبة المشرفة',
        'سيارة GMC خاصة وسائق خاص مرافق للعائلة طوال فترة الرحلة',
        'خدمة الخادم الشخصي (Butler Service) على مدار الساعة',
        'وجبات الإفطار والعشاء بوفيه مفتوح بأرقى المطاعم العالمية'
      ],
      excludedServices: [
        'المشتريات الشخصية والطلبات الخاصة داخل الجناح'
      ],
      itinerary: [
        { day: 1, title_ar: 'استقبال بصالة كبار الزوار بمطار جدة والانتقال بسيارات GMC الخاصة إلى فندق رافلز قصر مكة', title_en: 'VIP Lounge reception at Jeddah Airport and GMC transfer to Raffles Makkah Palace' },
        { day: 3, title_ar: 'أداء مناسك العمرة مع مرشد خاص وخدمة عربات كهربائية VIP لكبار السن', title_en: 'Umrah performance with dedicated private guide and VIP electric carts for seniors' },
        { day: 8, title_ar: 'الانتقال بالسيارات الخاصة المجهزة إلى المدينة المنورة واستلام الأجنحة في فندق دار التقوى', title_en: 'Private chauffeur transfer to Madinah and suite check-in at Dar Al Taqwa' },
        { day: 12, title_ar: 'زيارة الروضة الشريفة بتصاريح حصرية وجولة ثقافية تاريخية خاصة بالمدينة', title_en: 'Exclusive Rawdah permits and private historic cultural tour of Madinah' },
        { day: 15, title_ar: 'توديع كبار الزوار بمطار المدينة والعودة على درجة رجال الأعمال إلى القاهرة', title_en: 'VIP farewell at Madinah Airport and Business Class return to Cairo' }
      ],
      internalNotes: 'برنامج مخصص لعملاء النخبة. تم تخصيص 2 مرشدين دينيين معتمدين و3 سائقين خاصين.',
      imageUrl: './assets/mataf-panoramic.jpg',
      createdAt: '2026-08-15T12:00:00Z',
      updatedAt: '2026-10-29T16:45:00Z'
    },
    {
      id: 'prog_umrah_ramadan',
      companyId: 'comp_aldorra_01',
      code: 'UMR-2026-RM04',
      name_ar: 'عمرة شهر رمضان المبارك',
      name_en: 'Ramadan Blessed Umrah',
      category: 'umrah',
      type: 'ramadan',
      status: 'published',
      availability: 'available',
      durationDays: 20,
      durationNights: 19,
      departureDate: '2027-03-01',
      returnDate: '2027-03-22',
      departureTime: '15:20',
      returnTime: '02:40',
      season: '1448H / 2027',
      bookingDeadline: '2027-02-15',
      destination_ar: 'مكة المكرمة والمدينة المنورة',
      destination_en: 'Makkah & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق الشهداء (أجياد — بالقرب من الحرم)',
      makkahHotel_en: 'Al Shohada Hotel (Ajyad — Close to Haram)',
      makkahNights: 10,
      makkahDistance: 350,
      madinahHotel_ar: 'فندق أنوار المدينة موفنبيك (الساحة الجنوبية)',
      madinahHotel_en: 'Anwar Al Madinah Mövenpick (South Plaza)',
      madinahNights: 9,
      madinahDistance: 200,
      airline_ar: 'مصر للطيران — رحلات موسمية منتظمة',
      airline_en: 'EgyptAir — Regular Seasonal Flights',
      flightType: 'direct',
      departureAirport: 'CAI — مطار القاهرة الدولي',
      arrivalAirport: 'JED — مطار الملك عبد العزيز بجدة',
      transportType_ar: 'حافلات سياحية حديثة ومكيفة موديل 2026',
      transportType_en: 'Modern Air-Conditioned 2026 Model Coaches',
      unitPrice: 85000,
      basePrice: 85000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 95000,
        tripleRoom: 89000,
        quadRoom: 85000,
        childPrice: 48000,
        infantPrice: 18000,
        deposit: 25000
      },
      capacity: 40,
      minGroupSize: 1,
      shortDescription_ar: 'نفحات روحانية في شهر رمضان المبارك مع حضور صلاة التراويح والتهجد في الحرمين الشريفين.',
      shortDescription_en: 'Spiritual experience in the Holy Month of Ramadan with Taraweeh and Tahajjud at the two Holy Mosques.',
      fullDescription_ar: 'برنامج عمرة رمضان المبارك يتيح للمعتمرين قضاء العشر الأوائل والوسطى من رمضان في رحاب الحرمين الشريفين، شامل الإفطار والسحور اليومي، مع تنظيم دروس إيمانية وصلاة التراويح بجوار الكعبة المشرفة.',
      fullDescription_en: 'Experience the early and middle days of Blessed Ramadan in Makkah and Madinah, including daily Iftar and Suhoor buffets, with guidance for Taraweeh and Tahajjud.',
      includedServices: [
        'تأشيرة العمرة والتأمين الطبي لموسم رمضان',
        'طيران مباشر القاهرة — جدة — القاهرة',
        'بوفيه إفطار وسحور يومي طوال فترة الإقامة',
        'تنظيم الإشراف على صلاة التراويح والتنقلات',
        'توفير وجبات سحور معلبة للمعتكفين في الحرم'
      ],
      excludedServices: [
        'المصروفات النقدية الشخصية',
        'رسوم إضافية لطلب جناح فردي أو خاص'
      ],
      itinerary: [
        { day: 1, title_ar: 'المغادرة من مطار القاهرة والوصول لمكة المكرمة لأداء عمرة رمضان المبارك', title_en: 'Departure from Cairo and arrival at Makkah to perform Ramadan Umrah' },
        { day: 5, title_ar: 'صلاة التراويح والجمعة المباركة في المسجد الحرام', title_en: 'Taraweeh and Friday prayers at the Grand Mosque' },
        { day: 11, title_ar: 'الانتقال إلى المدينة المنورة وصلاة التراويح في الروضة الشريفة', title_en: 'Transfer to Madinah and Taraweeh prayers at the Prophet’s Mosque' },
        { day: 20, title_ar: 'ختام الزيارة والتوجه لمطار جدة والعودة بسلام إلى أرض الوطن', title_en: 'Concluding visits and transfer to airport for departure to Cairo' }
      ],
      internalNotes: 'تم تأمين حصص وجبات الإفطار والسحور مسبقاً مع إدارة الإعاشة بالفنادق.',
      imageUrl: './assets/kaaba-kiswah.jpg',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-10-27T08:15:00Z'
    },
    {
      id: 'prog_hajj_tourist',
      companyId: 'comp_aldorra_01',
      code: 'HAJ-2026-TR01',
      name_ar: 'حج سياحي معتمد 4 نجوم',
      name_en: 'Tourist Hajj Certified 4-Star',
      category: 'hajj',
      type: 'tourist',
      status: 'published',
      availability: 'available',
      durationDays: 21,
      durationNights: 20,
      departureDate: '2027-05-15',
      returnDate: '2027-06-05',
      departureTime: '07:00',
      returnTime: '18:15',
      season: '1448H / 2027',
      bookingDeadline: '2027-04-30',
      destination_ar: 'مكة المكرمة، المشاعر المقدسة، والمدينة المنورة',
      destination_en: 'Makkah, Holy Sites, & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق ميلينيوم مكة (العزيزية بالقرب من منى)',
      makkahHotel_en: 'Millennium Makkah (Al Aziziyah near Mina)',
      makkahNights: 12,
      makkahDistance: 450,
      madinahHotel_ar: 'فندق دلة طيبة (المنطقة الشمالية للمسجد النبوي)',
      madinahHotel_en: 'Dallah Taibah Hotel (Northern Area)',
      madinahNights: 8,
      madinahDistance: 150,
      airline_ar: 'مصر للطيران — جسر الحج الجوي الرسمي',
      airline_en: 'EgyptAir — Official Hajj Air Bridge',
      flightType: 'direct',
      departureAirport: 'CAI — مطار القاهرة الدولي',
      arrivalAirport: 'JED — مدينة الحجاج بمطار الملك عبد العزيز',
      transportType_ar: 'حافلات نقابة السيارات المعتمدة + قطار المشاعر المقدسة',
      transportType_en: 'Official Syndicate AC Buses + Holy Sites Metro Train',
      unitPrice: 220000,
      basePrice: 220000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 245000,
        tripleRoom: 230000,
        quadRoom: 220000,
        childPrice: 120000,
        infantPrice: 45000,
        deposit: 50000
      },
      capacity: 60,
      minGroupSize: 1,
      shortDescription_ar: 'رحلة حج متكاملة تشمل مخيمات مطورة في منى وعرفات مع بوفيه متكامل وإشراف طبي وديني متخصص.',
      shortDescription_en: 'Full Hajj pilgrimage with upgraded Mina and Arafat camps, full catering, and medical & religious support.',
      fullDescription_ar: 'برنامج الحج السياحي المعتمد من وزارة السياحة وغرفة شركات السياحة، يضمن إقامة راقية بمكة والمدينة ومخيمات مطورة مكيفة في منى وعرفات، وبوفيه إفطار وغداء وعشاء، مع إشراف أطباء وعلماء أزهريين.',
      fullDescription_en: 'Official Hajj program certified by the Ministry of Tourism, offering prime accommodation in Makkah and Madinah, upgraded air-conditioned camps in Mina and Arafat, full-board catering, and medical/religious supervision.',
      includedServices: [
        'تأشيرة الحج النظامية والتأمين الصحي الشامل للحجاج',
        'طيران مباشر على الجسر الجوي لمصر للطيران',
        'الإقامة في مخيمات منى وعرفات المطورة المكيفة',
        'تذاكر قطار المشاعر المقدسة للتنقل بين منى وعرفات ومزدلفة',
        '3 وجبات يومية بنظام البوفيه المفتوح والمشروبات الساخنة والباردة على مدار الساعة',
        'طاقم طبي مرافق وعلماء أزهريون للإرشاد والفتوى'
      ],
      excludedServices: [
        'صك الأضحية (الهدي) — يمكن إضافته اختيارياً بقيمة 7,500 ج.م',
        'نفقات التنقلات الفردية الاختيارية'
      ],
      itinerary: [
        { day: 1, title_ar: 'المغادرة إلى جدة والتوجه إلى فندق مكة لأداء طواف القدوم', title_en: 'Departure to Jeddah and transfer to Makkah for Arrival Tawaf' },
        { day: 8, title_ar: 'يوم التروية: التوجه إلى مخيمات منى المطورة والمبيت بها', title_en: 'Day of Tarwiyah: Moving to Mina upgraded camps' },
        { day: 9, title_ar: 'يوم عرفة المبارك: الوقوف بجبل الرحمة وأداء صلاتي الظهر والعصر ثم الإفاضة لمزدلفة', title_en: 'Blessed Arafat Day: Standing on Mount Mercy, prayer, and Muzdalifah transfer' },
        { day: 10, title_ar: 'يوم النحر: رمي جمرة العقبة الكبرى والتحلل وطواف الإفاضة', title_en: 'Day of Nahr: Stoning the Jamarat, Tahallul, and Tawaf Al-Ifadah' },
        { day: 11, title_ar: 'أيام التشريق: رمي الجمرات والمبيت بمنى وسماع خطب العلماء', title_en: 'Days of Tashreeq: Jamarat and spiritual seminars at Mina' },
        { day: 14, title_ar: 'طواف الوداع والانتقال إلى المدينة المنورة لزيارة المسجد النبوي الشريف', title_en: 'Farewell Tawaf and transfer to Madinah to visit the Prophet’s Mosque' },
        { day: 21, title_ar: 'العودة بسلام إلى القاهرة عبر مطار المدينة المنورة', title_en: 'Return to Cairo via Madinah Airport' }
      ],
      internalNotes: 'تم سداد رسوم باقة المخيمات لدى شركة مطوفي حجاج الدول العربية (إكرام الضيف).',
      imageUrl: './assets/makkah-sunset-tawaf.jpg',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-10-26T15:00:00Z'
    },
    {
      id: 'prog_hajj_vip',
      companyId: 'comp_aldorra_01',
      code: 'HAJ-2026-VP02',
      name_ar: 'حج فاخر VIP أبراج ومخيمات مجر الكبش',
      name_en: 'VIP Luxury Hajj Towers & Majar Al-Kabsh',
      category: 'hajj',
      type: 'vip',
      status: 'published',
      availability: 'limited',
      durationDays: 28,
      durationNights: 27,
      departureDate: '2027-05-20',
      returnDate: '2027-06-17',
      departureTime: '23:30',
      returnTime: '10:45',
      season: '1448H / 2027',
      bookingDeadline: '2027-05-05',
      destination_ar: 'مكة المكرمة، المشاعر المقدسة VIP، والمدينة المنورة',
      destination_en: 'Makkah, VIP Holy Sites, & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق فيرمونت برج ساعة مكة الملكي (أبراج البيت)',
      makkahHotel_en: 'Fairmont Makkah Clock Royal Tower',
      makkahNights: 14,
      makkahDistance: 50,
      madinahHotel_ar: 'فندق أوبروي المدينة (إطلالة مباشرة على الحرم)',
      madinahHotel_en: 'The Oberoi Madina (Direct Haram View)',
      madinahNights: 13,
      madinahDistance: 60,
      airline_ar: 'الخطوط السعودية — درجة أولى ورجال أعمال',
      airline_en: 'Saudia Airlines — First & Business Class',
      flightType: 'direct',
      departureAirport: 'CAI — صالة كبار الزوار (VIP)',
      arrivalAirport: 'JED — صالة الطيران الخاص وكبار الزوار',
      transportType_ar: 'سيارات مرسيدس وسيارات خاصة وسيارات إلكترونية جولف بالمشاعر',
      transportType_en: 'Mercedes Vans, Private GMCs & Golf Carts in Holy Sites',
      unitPrice: 350000,
      basePrice: 350000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 385000,
        tripleRoom: 365000,
        quadRoom: 350000,
        childPrice: 195000,
        infantPrice: 75000,
        deposit: 80000
      },
      capacity: 25,
      minGroupSize: 1,
      shortDescription_ar: 'أعلى مستويات الرفاهية والخدمة الحصرية لرحلة الحج، أجنحة فندقية خاصة ومخيمات VIP مكيفة في مجر الكبش.',
      shortDescription_en: 'Ultimate luxury and VIP pilgrimage experience with private suites and exclusive Majar Al-Kabsh camps.',
      fullDescription_ar: 'رحلة الحج الأرقى في المنطقة، إقامة في أجنحة فيرمونت برج الساعة بمكة وأوبروي المدينة المنورة، ومخيمات خاصة فاخرة في مجر الكبش بمنى مجهزة بأحدث وسائل الراحة والخدمات الفندقية على مدار 24 ساعة، مع طيران رجال الأعمال وسيارة خاصة.',
      fullDescription_en: 'The region’s premier Hajj experience. Stay at Fairmont Clock Royal Tower suites and The Oberoi Madinah, paired with private luxury camps at Majar Al-Kabsh equipped with 24/7 dedicated butler and catering service.',
      includedServices: [
        'تأشيرة الحج الخاصة وتأمين كبار الشخصيات الطبي',
        'طيران رجال الأعمال والدرجة الأولى على الخطوط السعودية',
        'مخيمات النخبة VIP في مجر الكبش بمنى بجوار الجمرات مباشرة',
        'عربات جولف كهربائية خاصة لنقل الحجاج بين المخيم والجمرات',
        'بوفيه طعام عالمي خاص ومشروبات طازجة على مدار الساعة',
        'خادم شخصي (Butler) لكل جناح في الفندق والمخيم',
        'صك الأضحية المعتمد وتوزيعه بالكامل نيابة عن الحاج'
      ],
      excludedServices: [
        'الطلبات الخاصة خارج قائمة الخدمات المعتمدة'
      ],
      itinerary: [
        { day: 1, title_ar: 'استقبال بصالة كبار الزوار بمطار جدة والانتقال بسيارات مرسيدس إلى برج الساعة', title_en: 'VIP Lounge reception at Jeddah and Mercedes transfer to Clock Tower' },
        { day: 8, title_ar: 'الانتقال إلى مخيمات النخبة بمجر الكبش بمنى وأداء صلاة التراويح وذكر الله', title_en: 'Transfer to elite Majar Al-Kabsh camp at Mina' },
        { day: 9, title_ar: 'الوقوف بعرفة في مخيم مكيف مجهز بأحدث وسائل الراحة ثم الإفاضة إلى مزدلفة VIP', title_en: 'Standing at Arafat in luxury air-conditioned camp and VIP transfer to Muzdalifah' },
        { day: 10, title_ar: 'رمي جمرة العقبة بعربات الجولف الكهربائية وطواف الإفاضة بالمسجد الحرام', title_en: 'Electric golf cart transfer for Jamarat stoning and Tawaf Al-Ifadah' },
        { day: 15, title_ar: 'التوجه إلى المدينة المنورة بسيارات خاصة والإقامة في فندق أوبروي المدينة', title_en: 'Private car transfer to Madinah and check-in at The Oberoi Madinah' },
        { day: 28, title_ar: 'توديع الحجاج بصالة كبار الزوار بمطار المدينة والعودة إلى القاهرة', title_en: 'VIP departure from Madinah Airport returning to Cairo' }
      ],
      internalNotes: 'أكبر باقة مخصصة للشخصيات العامة. تم توفير أطباء استشاريين مخصصين وسيارة إسعاف مجهزة للمجموعة.',
      imageUrl: './assets/mataf-panoramic.jpg',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-10-30T17:00:00Z'
    },
    {
      id: 'prog_umrah_family',
      companyId: 'comp_aldorra_01',
      code: 'UMR-2026-FM05',
      name_ar: 'عمرة عائلية مميزة (مسودة)',
      name_en: 'Family Special Umrah (Draft)',
      category: 'umrah',
      type: 'family',
      status: 'draft',
      availability: 'available',
      durationDays: 12,
      durationNights: 11,
      departureDate: '2027-01-10',
      returnDate: '2027-01-22',
      departureTime: '10:00',
      returnTime: '19:30',
      season: '1447H / 2026',
      bookingDeadline: '2026-12-25',
      destination_ar: 'مكة المكرمة والمدينة المنورة',
      destination_en: 'Makkah & Madinah',
      departureCity_ar: 'القاهرة',
      departureCity_en: 'Cairo',
      makkahHotel_ar: 'فندق بارك إن راديسون مكة',
      makkahHotel_en: 'Park Inn by Radisson Makkah',
      makkahNights: 6,
      makkahDistance: 500,
      madinahHotel_ar: 'فندق كراون بلازا المدينة',
      madinahHotel_en: 'Crowne Plaza Madinah',
      madinahNights: 5,
      madinahDistance: 300,
      airline_ar: 'مصر للطيران — رحلات مباشرة',
      airline_en: 'EgyptAir — Direct Flights',
      flightType: 'direct',
      departureAirport: 'CAI — مطار القاهرة الدولي',
      arrivalAirport: 'JED — مطار الملك عبد العزيز',
      transportType_ar: 'حافلات عائلية مريحة ومكيفة',
      transportType_en: 'Comfortable AC Family Buses',
      unitPrice: 48000,
      basePrice: 48000,
      currency: 'EGP',
      pricing: {
        doubleRoom: 55000,
        tripleRoom: 51000,
        quadRoom: 48000,
        childPrice: 28000,
        infantPrice: 11000,
        deposit: 15000
      },
      capacity: 40,
      minGroupSize: 2,
      shortDescription_ar: 'برنامج عائلي مصمم لراحة الأسر والأطفال مع غرف متصلة وخدمات رعاية متكاملة.',
      shortDescription_en: 'Specially designed for family comfort with connecting rooms and comprehensive child support.',
      fullDescription_ar: 'مسودة برنامج عائلي مخصص للعائلات التي تصطحب أطفالها وكبار السن، يشمل غرفاً متصلة ووجبات عائلية ومرشدين ذوي خبرة في مرافقة المجموعات العائلية.',
      fullDescription_en: 'Draft family program with connecting rooms, family-friendly meals, and experienced guides assisting families with children and seniors.',
      includedServices: [
        'تأشيرة العمرة وتأمين طبي شامل',
        'تذاكر الطيران ذهاب وعودة',
        'إقامة في غرف عائلية متصلة',
        'وجبات إفطار يومية'
      ],
      excludedServices: [
        'المصروفات الشخصية'
      ],
      itinerary: [
        { day: 1, title_ar: 'المغادرة إلى مكة واستلام الغرف العائلية', title_en: 'Departure to Makkah and check-in to family rooms' },
        { day: 7, title_ar: 'الانتقال إلى المدينة المنورة وزيارة المسجد النبوي', title_en: 'Transfer to Madinah and visiting the Prophet’s Mosque' }
      ],
      internalNotes: 'مسودة قيد المراجعة مع قسم التسويق بانتظار تأكيد أسعار الغرف المتصلة من الفندق.',
      imageUrl: './assets/kaaba-kiswah.jpg',
      createdAt: '2026-10-20T11:00:00Z',
      updatedAt: '2026-10-29T10:00:00Z'
    }
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
    if (typeof options === 'string') options = { period: options };
    const {
      period = 'all',
      date = null,
      search = '',
      program = 'all',
      source = 'all',
      method = 'all',
      verification = 'all'
    } = (options || {});

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

  // --- PROGRAM MANAGEMENT METHODS (PAGE 5) ---

  function getCompanyPrograms(filters = {}) {
    let result = [...PROGRAMS];

    // Compute dynamic reservedSeats and availableSeats for each program from RAW_BOOKINGS
    result = result.map(p => {
      const activeBookings = RAW_BOOKINGS.filter(b => b.programId === p.id && b.bookingStatus !== 'rejected');
      const reservedSeats = activeBookings.reduce((sum, b) => sum + (b.travelersCount || 1), 0);
      const availableSeats = Math.max(0, (p.capacity || 0) - reservedSeats);
      return {
        ...p,
        reservedSeats,
        availableSeats,
        activeBookingsCount: activeBookings.length
      };
    });

    // 1. Text Search (name, code, hotels, destination)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(p => {
        return (p.name_ar && p.name_ar.toLowerCase().includes(q)) ||
               (p.name_en && p.name_en.toLowerCase().includes(q)) ||
               (p.code && p.code.toLowerCase().includes(q)) ||
               (p.makkahHotel_ar && p.makkahHotel_ar.toLowerCase().includes(q)) ||
               (p.makkahHotel_en && p.makkahHotel_en.toLowerCase().includes(q)) ||
               (p.madinahHotel_ar && p.madinahHotel_ar.toLowerCase().includes(q)) ||
               (p.madinahHotel_en && p.madinahHotel_en.toLowerCase().includes(q)) ||
               (p.destination_ar && p.destination_ar.toLowerCase().includes(q)) ||
               (p.destination_en && p.destination_en.toLowerCase().includes(q));
      });
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // 3. Type Filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type);
    }

    // 4. Status Filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }

    // 5. Availability Filter
    if (filters.availability && filters.availability !== 'all') {
      result = result.filter(p => p.availability === filters.availability);
    }

    // 6. Departure Date Range
    if (filters.dateFrom) {
      result = result.filter(p => p.departureDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(p => p.departureDate <= filters.dateTo);
    }

    // 7. Price Range
    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
      const min = Number(filters.minPrice);
      if (!isNaN(min)) result = result.filter(p => p.unitPrice >= min);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
      const max = Number(filters.maxPrice);
      if (!isNaN(max)) result = result.filter(p => p.unitPrice <= max);
    }

    // 8. Duration Days Filter
    if (filters.duration && filters.duration !== 'all') {
      const dur = Number(filters.duration);
      if (!isNaN(dur)) result = result.filter(p => p.durationDays === dur);
    }

    return result;
  }

  function getCompanyProgramById(id) {
    const prog = PROGRAMS.find(p => p.id === id);
    if (!prog) return null;

    const activeBookings = RAW_BOOKINGS.filter(b => b.programId === prog.id && b.bookingStatus !== 'rejected');
    const reservedSeats = activeBookings.reduce((sum, b) => sum + (b.travelersCount || 1), 0);
    const availableSeats = Math.max(0, (prog.capacity || 0) - reservedSeats);
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return {
      ...prog,
      reservedSeats,
      availableSeats,
      activeBookingsCount: activeBookings.length,
      totalRevenue,
      bookings: activeBookings.slice(0, 10).map(b => ({
        id: b.id,
        ref: b.ref,
        customerName: b.customerName_ar || b.customerName,
        phone: b.customerPhone,
        travelersCount: b.travelersCount,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        totalPrice: b.totalPrice,
        paidAmount: b.paidAmount
      }))
    };
  }

  function createCompanyProgram(data, user = null) {
    if (!data.name_ar && !data.name_en) {
      return { success: false, error: 'Program name is required' };
    }
    if (!data.departureDate || !data.returnDate) {
      return { success: false, error: 'Departure and return dates are required' };
    }
    if (data.returnDate < data.departureDate) {
      return { success: false, error: 'Return date cannot be earlier than departure date' };
    }

    const unitPrice = Number(data.unitPrice) || Number(data.basePrice) || 40000;
    const capacity = Number(data.capacity) || 45;
    const durationDays = Number(data.durationDays) || Math.max(1, Math.round((new Date(data.returnDate) - new Date(data.departureDate)) / (1000 * 60 * 60 * 24)));
    const durationNights = Math.max(0, durationDays - 1);

    const newId = 'prog_' + (data.category || 'umrah') + '_' + Date.now();
    const newCode = data.code || ((data.category === 'hajj' ? 'HAJ-' : 'UMR-') + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));

    const newProgram = {
      id: newId,
      companyId: 'comp_aldorra_01',
      code: newCode,
      name_ar: data.name_ar || data.name_en,
      name_en: data.name_en || data.name_ar,
      category: data.category || 'umrah',
      type: data.type || 'economy',
      status: data.status || 'published',
      availability: data.availability || 'available',
      durationDays,
      durationNights,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      departureTime: data.departureTime || '09:00',
      returnTime: data.returnTime || '18:00',
      season: data.season || '1447H / 2026',
      bookingDeadline: data.bookingDeadline || data.departureDate,
      destination_ar: data.destination_ar || 'مكة المكرمة والمدينة المنورة',
      destination_en: data.destination_en || 'Makkah & Madinah',
      departureCity_ar: data.departureCity_ar || 'القاهرة',
      departureCity_en: data.departureCity_en || 'Cairo',
      makkahHotel_ar: data.makkahHotel_ar || data.makkahHotel || 'فندق مكة المعتمد',
      makkahHotel_en: data.makkahHotel_en || data.makkahHotel || 'Makkah Certified Hotel',
      makkahNights: Number(data.makkahNights) || Math.ceil(durationNights / 2),
      makkahDistance: Number(data.makkahDistance) || 250,
      madinahHotel_ar: data.madinahHotel_ar || data.madinahHotel || 'فندق المدينة المعتمد',
      madinahHotel_en: data.madinahHotel_en || data.madinahHotel || 'Madinah Certified Hotel',
      madinahNights: Number(data.madinahNights) || Math.floor(durationNights / 2),
      madinahDistance: Number(data.madinahDistance) || 150,
      airline_ar: data.airline_ar || data.airline || 'مصر للطيران — رحلة مباشرة',
      airline_en: data.airline_en || data.airline || 'EgyptAir — Direct Flight',
      flightType: data.flightType || 'direct',
      departureAirport: data.departureAirport || 'CAI — مطار القاهرة الدولي',
      arrivalAirport: data.arrivalAirport || 'JED — مطار الملك عبد العزيز بجدة',
      transportType_ar: data.transportType_ar || 'حافلات سياحية حديثة ومكيفة',
      transportType_en: data.transportType_en || 'Modern Air-Conditioned Buses',
      unitPrice,
      basePrice: unitPrice,
      currency: data.currency || 'EGP',
      pricing: {
        doubleRoom: data.pricing?.doubleRoom || Math.round(unitPrice * 1.1),
        tripleRoom: data.pricing?.tripleRoom || Math.round(unitPrice * 1.05),
        quadRoom: data.pricing?.quadRoom || unitPrice,
        childPrice: data.pricing?.childPrice || Math.round(unitPrice * 0.6),
        infantPrice: data.pricing?.infantPrice || Math.round(unitPrice * 0.25),
        deposit: data.pricing?.deposit || Math.round(unitPrice * 0.3)
      },
      capacity,
      minGroupSize: Number(data.minGroupSize) || 1,
      shortDescription_ar: data.shortDescription_ar || data.shortDescription || 'برنامج مميز شامل الإقامة والانتقالات والإشراف.',
      shortDescription_en: data.shortDescription_en || data.shortDescription || 'Distinguished package including lodging, transfers, and supervision.',
      fullDescription_ar: data.fullDescription_ar || data.fullDescription || '',
      fullDescription_en: data.fullDescription_en || data.fullDescription || '',
      includedServices: Array.isArray(data.includedServices) ? data.includedServices : [
        'تأشيرة العمرة / الحج والتأمين الطبي الشامل',
        'تذاكر الطيران ذهاب وعودة',
        'الإقامة الفندقية المصنفة بمكة المكرمة والمدينة المنورة',
        'الانتقالات الداخلية بحافلات سياحية حديثة',
        'مشرف مرافق وإرشاد ديني معتمد'
      ],
      excludedServices: Array.isArray(data.excludedServices) ? data.excludedServices : [
        'المصروفات الشخصية والطلبات الفردية'
      ],
      itinerary: Array.isArray(data.itinerary) && data.itinerary.length ? data.itinerary : [
        { day: 1, title_ar: 'التجمع بالمطار والمغادرة ثم التوجه لمكة واستلام الغرف وأداء المناسك', title_en: 'Airport assembly, departure to Makkah, hotel check-in, and Umrah rituals' },
        { day: Math.ceil(durationDays / 2), title_ar: 'الانتقال إلى المدينة المنورة وزيارة المسجد النبوي الشريف', title_en: 'Transfer to Madinah and visiting the Prophet’s Mosque' },
        { day: durationDays, title_ar: 'صلاة الوداع والتوجه إلى المطار للعودة إلى القاهرة', title_en: 'Farewell prayer and airport transfer for return to Cairo' }
      ],
      internalNotes: data.internalNotes || '',
      imageUrl: data.imageUrl || './assets/kaaba-kiswah.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    PROGRAMS.unshift(newProgram);

    ACTIVITIES_FEED.unshift({
      id: 'act_' + Date.now(),
      type: 'program_created',
      title_ar: `إضافة برنامج جديد: ${newProgram.name_ar}`,
      title_en: `New program created: ${newProgram.name_en}`,
      time_ar: 'الآن',
      time_en: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'plus'
    });

    return { success: true, program: newProgram };
  }

  function updateCompanyProgram(id, data, user = null) {
    const prog = PROGRAMS.find(p => p.id === id);
    if (!prog) {
      return { success: false, error: 'Program not found' };
    }

    if (data.departureDate && data.returnDate && data.returnDate < data.departureDate) {
      return { success: false, error: 'Return date cannot be earlier than departure date' };
    }

    if (data.name_ar) prog.name_ar = data.name_ar;
    if (data.name_en) prog.name_en = data.name_en;
    if (data.code) prog.code = data.code;
    if (data.category) prog.category = data.category;
    if (data.type) prog.type = data.type;
    if (data.status) prog.status = data.status;
    if (data.availability) prog.availability = data.availability;
    if (data.departureDate) prog.departureDate = data.departureDate;
    if (data.returnDate) prog.returnDate = data.returnDate;
    if (data.departureTime) prog.departureTime = data.departureTime;
    if (data.returnTime) prog.returnTime = data.returnTime;
    if (data.season) prog.season = data.season;
    if (data.bookingDeadline) prog.bookingDeadline = data.bookingDeadline;
    if (data.destination_ar) prog.destination_ar = data.destination_ar;
    if (data.destination_en) prog.destination_en = data.destination_en;
    if (data.makkahHotel_ar) prog.makkahHotel_ar = data.makkahHotel_ar;
    if (data.makkahHotel_en) prog.makkahHotel_en = data.makkahHotel_en;
    if (data.makkahNights !== undefined) prog.makkahNights = Number(data.makkahNights);
    if (data.makkahDistance !== undefined) prog.makkahDistance = Number(data.makkahDistance);
    if (data.madinahHotel_ar) prog.madinahHotel_ar = data.madinahHotel_ar;
    if (data.madinahHotel_en) prog.madinahHotel_en = data.madinahHotel_en;
    if (data.madinahNights !== undefined) prog.madinahNights = Number(data.madinahNights);
    if (data.madinahDistance !== undefined) prog.madinahDistance = Number(data.madinahDistance);
    if (data.airline_ar) prog.airline_ar = data.airline_ar;
    if (data.airline_en) prog.airline_en = data.airline_en;
    if (data.flightType) prog.flightType = data.flightType;
    if (data.departureAirport) prog.departureAirport = data.departureAirport;
    if (data.arrivalAirport) prog.arrivalAirport = data.arrivalAirport;
    if (data.transportType_ar) prog.transportType_ar = data.transportType_ar;
    if (data.transportType_en) prog.transportType_en = data.transportType_en;
    if (data.unitPrice !== undefined) {
      prog.unitPrice = Number(data.unitPrice);
      prog.basePrice = Number(data.unitPrice);
    }
    if (data.pricing) {
      prog.pricing = {
        ...prog.pricing,
        ...data.pricing
      };
    }
    if (data.capacity !== undefined) prog.capacity = Number(data.capacity);
    if (data.minGroupSize !== undefined) prog.minGroupSize = Number(data.minGroupSize);
    if (data.shortDescription_ar) prog.shortDescription_ar = data.shortDescription_ar;
    if (data.shortDescription_en) prog.shortDescription_en = data.shortDescription_en;
    if (data.fullDescription_ar) prog.fullDescription_ar = data.fullDescription_ar;
    if (data.fullDescription_en) prog.fullDescription_en = data.fullDescription_en;
    if (data.internalNotes !== undefined) prog.internalNotes = data.internalNotes;
    if (data.imageUrl) prog.imageUrl = data.imageUrl;
    if (Array.isArray(data.includedServices)) prog.includedServices = data.includedServices;
    if (Array.isArray(data.excludedServices)) prog.excludedServices = data.excludedServices;

    // Recalculate duration if dates changed
    if (prog.departureDate && prog.returnDate) {
      const dur = Math.max(1, Math.round((new Date(prog.returnDate) - new Date(prog.departureDate)) / (1000 * 60 * 60 * 24)));
      prog.durationDays = dur;
      prog.durationNights = Math.max(0, dur - 1);
    }

    prog.updatedAt = new Date().toISOString();

    ACTIVITIES_FEED.unshift({
      id: 'act_' + Date.now(),
      type: 'program_updated',
      title_ar: `تحديث بيانات برنامج: ${prog.name_ar}`,
      title_en: `Updated program: ${prog.name_en}`,
      time_ar: 'الآن',
      time_en: 'Just now',
      timestamp: new Date().toISOString(),
      icon: 'edit'
    });

    return { success: true, program: prog };
  }

  function archiveOrDeleteCompanyProgram(id, user = null) {
    const progIndex = PROGRAMS.findIndex(p => p.id === id);
    if (progIndex === -1) {
      return { success: false, error: 'Program not found' };
    }

    const prog = PROGRAMS[progIndex];
    const hasBookings = RAW_BOOKINGS.some(b => b.programId === id);

    if (hasBookings) {
      // Safe Archiving: Keep program data and snapshots intact, update status to archived
      prog.status = 'archived';
      prog.availability = 'unavailable';
      prog.updatedAt = new Date().toISOString();

      ACTIVITIES_FEED.unshift({
        id: 'act_' + Date.now(),
        type: 'program_archived',
        title_ar: `أرشفة البرنامج: ${prog.name_ar} (لوجود حجوزات سابقة)`,
        title_en: `Archived program: ${prog.name_en} (has active bookings)`,
        time_ar: 'الآن',
        time_en: 'Just now',
        timestamp: new Date().toISOString(),
        icon: 'archive'
      });

      return {
        success: true,
        action: 'archived',
        message_ar: 'تم أرشفة البرنامج بنجاح. نظراً لوجود حجوزات سابقة مرتبطة به، تم إيقاف الحجز عليه وحفظ بياناته وسجلاته التاريخية بأمان.',
        message_en: 'Program successfully archived. Since historical bookings exist, future bookings were halted while preserving all booking records.'
      };
    } else {
      // Hard deletion is safe because zero bookings reference this program
      PROGRAMS.splice(progIndex, 1);

      ACTIVITIES_FEED.unshift({
        id: 'act_' + Date.now(),
        type: 'program_deleted',
        title_ar: `حذف البرنامج نهائياً: ${prog.name_ar}`,
        title_en: `Deleted program: ${prog.name_en}`,
        time_ar: 'الآن',
        time_en: 'Just now',
        timestamp: new Date().toISOString(),
        icon: 'trash'
      });

      return {
        success: true,
        action: 'deleted',
        message_ar: 'تم حذف البرنامج نهائياً بنجاح لعدم وجود أي حجوزات مرتبطة به.',
        message_en: 'Program permanently deleted successfully as it had no associated bookings.'
      };
    }
  }

  function getCompanyProgramsSummary() {
    const totalPrograms = PROGRAMS.length;
    const activePublished = PROGRAMS.filter(p => p.status === 'published').length;
    const nowStr = '2026-10-30';
    const upcomingTrips = PROGRAMS.filter(p => p.status === 'published' && p.departureDate >= nowStr).length;
    const draftUnpublished = PROGRAMS.filter(p => p.status === 'draft').length;

    // Available seats across all published programs
    let totalAvailableCapacity = 0;
    PROGRAMS.filter(p => p.status === 'published').forEach(p => {
      const activeBookings = RAW_BOOKINGS.filter(b => b.programId === p.id && b.bookingStatus !== 'rejected');
      const reserved = activeBookings.reduce((sum, b) => sum + (b.travelersCount || 1), 0);
      totalAvailableCapacity += Math.max(0, (p.capacity || 0) - reserved);
    });

    return {
      totalPrograms,
      activePublished,
      upcomingTrips,
      totalAvailableCapacity,
      draftUnpublished
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
    getFinancialOverviewData,
    getCompanyPrograms,
    getCompanyProgramById,
    createCompanyProgram,
    updateCompanyProgram,
    archiveOrDeleteCompanyProgram,
    getCompanyProgramsSummary
  };
});

