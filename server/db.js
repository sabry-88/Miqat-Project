/**
 * MIQAT JOURNEYHUB — PERSISTENT DATABASE & REPOSITORY ENGINE
 * 
 * Uses Node.js native SQLite (node:sqlite) with disk persistence at data/miqat.db.
 * Provides secure credential hashing (scrypt + cryptographic salt),
 * verified Hajj & Umrah program models, session persistence, and full
 * customer request lifecycle management ready for future employee assignment and Excel export.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'miqat.db');
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for high concurrency & integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize Schema
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT,
      governorate TEXT,
      role TEXT DEFAULT 'customer',
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS programs (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      trip_type TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      season_ar TEXT NOT NULL,
      season_en TEXT NOT NULL,
      duration_ar TEXT NOT NULL,
      duration_en TEXT NOT NULL,
      hotel_tier_ar TEXT NOT NULL,
      hotel_tier_en TEXT NOT NULL,
      proximity_ar TEXT NOT NULL,
      proximity_en TEXT NOT NULL,
      transport_ar TEXT NOT NULL,
      transport_en TEXT NOT NULL,
      price_indicative_ar TEXT NOT NULL,
      price_indicative_en TEXT NOT NULL,
      price_verified INTEGER DEFAULT 0,
      image_url TEXT NOT NULL,
      badge_ar TEXT,
      badge_en TEXT,
      description_ar TEXT NOT NULL,
      description_en TEXT NOT NULL,
      features_json TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      customer_governorate TEXT,
      program_id TEXT NOT NULL,
      program_name TEXT NOT NULL,
      program_category TEXT NOT NULL,
      status TEXT DEFAULT 'Pending Assignment',
      assigned_employee TEXT,
      notes TEXT,
      whatsapp_status TEXT DEFAULT 'ready_to_send',
      whatsapp_recipient TEXT DEFAULT '201203340116',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      audit_log_json TEXT NOT NULL,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
    CREATE INDEX IF NOT EXISTS idx_requests_customer ON requests(customer_phone);
    CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      request_id TEXT,
      program_id TEXT NOT NULL,
      program_title_ar TEXT NOT NULL,
      program_title_en TEXT NOT NULL,
      travelers_count INTEGER NOT NULL DEFAULT 1,
      currency TEXT NOT NULL DEFAULT 'EGP',
      unit_price INTEGER NOT NULL,
      package_total INTEGER,
      payment_option TEXT DEFAULT 'full',
      remaining_amount INTEGER DEFAULT 0,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      simulated_method TEXT NOT NULL DEFAULT 'mock_card',
      idempotency_key TEXT UNIQUE,
      failure_reason TEXT,
      paid_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      audit_log_json TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS refunds (
      id TEXT PRIMARY KEY,
      payment_reference TEXT UNIQUE NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EGP',
      reason TEXT NOT NULL,
      admin_id TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      audit_log_json TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (payment_reference) REFERENCES payments(reference) ON DELETE RESTRICT,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
    CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);
    CREATE INDEX IF NOT EXISTS idx_refunds_payment ON refunds(payment_reference);

    CREATE TABLE IF NOT EXISTS company_notifications (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      message_ar TEXT NOT NULL,
      message_en TEXT NOT NULL,
      unread INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      booking_id TEXT,
      booking_reference TEXT,
      customer_name_ar TEXT,
      customer_name_en TEXT,
      program_title_ar TEXT,
      program_title_en TEXT,
      amount REAL,
      currency TEXT DEFAULT 'EGP',
      admin_notice_json TEXT,
      action_url TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_comp_notif_company ON company_notifications(company_id);
    CREATE INDEX IF NOT EXISTS idx_comp_notif_created ON company_notifications(created_at);
    CREATE INDEX IF NOT EXISTS idx_comp_notif_type ON company_notifications(type);
    CREATE INDEX IF NOT EXISTS idx_comp_notif_unread ON company_notifications(unread);
  `);

  try { db.exec("ALTER TABLE payments ADD COLUMN package_total INTEGER"); } catch (e) {}
  try { db.exec("ALTER TABLE payments ADD COLUMN payment_option TEXT DEFAULT 'full'"); } catch (e) {}
  try { db.exec("ALTER TABLE payments ADD COLUMN remaining_amount INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN company_name TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN company_name_en TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN responsible_person TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN license_number TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN whatsapp TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN address TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN commercial_registry TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN contract_ref TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN contract_start TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN contract_end TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN contract_signed_at TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN partnership_level TEXT DEFAULT 'platinum'"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN contract_status TEXT DEFAULT 'active'"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN application_status TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN application_submitted_at TEXT"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN application_notes TEXT"); } catch (e) {}

  // Data normalization: ensure application_status is only assigned to company applicants
  try {
    db.exec(`
      UPDATE users SET application_status = NULL WHERE role NOT IN ('company', 'new_company');
      UPDATE users SET application_status = 'approved' WHERE (id = 'usr_comp_01156379990' OR (role = 'company' AND contract_status = 'active'));
      UPDATE users SET application_status = 'pending_review' WHERE (id = 'usr_newcomp_01156379991' OR role = 'new_company');
    `);
  } catch (e) {
    console.warn('application_status normalization notice:', e.message);
  }
}

/**
 * Password Security: Scrypt Key Derivation with Unique Salt
 */
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
  const computed = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Seed Verified Initial Programs Catalog
 */
function seedPrograms() {
  const count = db.prepare('SELECT COUNT(*) as count FROM programs').get().count;
  if (count > 0) return;

  const catalog = [
    {
      id: 'umrah_economy',
      category: 'umrah_economy',
      trip_type: 'umrah',
      title_ar: 'عمرة اقتصادية معتمدة',
      title_en: 'Standard Economy Umrah',
      season_ar: 'موسم رجب وشعبان ١٤٤٨هـ',
      season_en: 'Rajab & Shaban Season',
      duration_ar: '١٠ أيام / ٩ ليالٍ',
      duration_en: '10 Days / 9 Nights',
      hotel_tier_ar: 'اقتصادي مصنف معتمد',
      hotel_tier_en: 'Approved Economy Tier',
      proximity_ar: 'حافلات ترددية دورية على مدار ٢٤ ساعة إلى ساحات الحرم',
      proximity_en: '24/7 Shuttle bus service to Haram courtyards',
      transport_ar: 'طيران منظم / حافلات سياحية حديثة ومكيفة',
      transport_en: 'Scheduled Flights / Modern AC Coaches',
      price_indicative_ar: 'تبدأ من ٣٣,٠٠٠ ج.م (حسب نوع التسكين)',
      price_indicative_en: 'Starting from EGP 33,000 (Based on room type)',
      price_verified: 1,
      image_url: './assets/kaaba-kiswah.jpg',
      badge_ar: 'خيارات ملائمة للميزانية',
      badge_en: 'Budget Friendly',
      description_ar: 'برامج عملية متوازنة تركز على توفير متطلبات الإقامة المعتمدة ووسائل النقل المستمرة لتيسير أداء المناسك براحة وطمأنينة.',
      description_en: 'Balanced practical programs providing certified accommodations and round-the-clock transportation for a peaceful pilgrimage.',
      features_json: JSON.stringify([
        'فنادق مصنفة ومعتمدة مع حافلات ترددية مستمرة',
        'استخراج التأشيرة والتأمين الطبي الشامل',
        'إشراف إداري وتفويج منتظم طوال مدة الرحلة',
        'مزارات مكة المكرمة والمدينة المنورة بإشراف مرشدين'
      ]),
      sort_order: 1
    },
    {
      id: 'umrah_premium',
      category: 'umrah_premium',
      trip_type: 'umrah',
      title_ar: 'عمرة متميزة (٤ و ٥ نجوم)',
      title_en: 'Premium Umrah (4 & 5 Stars)',
      season_ar: 'متاح طوال العام • مواسم منتظمة',
      season_en: 'Year-Round Regular Seasons',
      duration_ar: '١٢ يوماً / ١١ ليلة',
      duration_en: '12 Days / 11 Nights',
      hotel_tier_ar: '٤ أو ٥ نجوم راقية',
      hotel_tier_en: '4 or 5-Star Certified Hotels',
      proximity_ar: 'مسافة سير قصيرة (أقل من ٤٠٠ متر من الحرمين)',
      proximity_en: 'Short walking distance (<400m from Haramain)',
      transport_ar: 'طيران مباشر مجدول (القاهرة - جدة / المدينة)',
      transport_en: 'Direct Scheduled Flights (Cairo - JED / MED)',
      price_indicative_ar: 'تبدأ من ٦٢,٠٠٠ ج.م (حسب الإطلالة والغرفة)',
      price_indicative_en: 'Starting from EGP 62,000 (Based on view & room)',
      price_verified: 1,
      image_url: './assets/makkah-sunset-tawaf.jpg',
      badge_ar: 'توازن الراحة والقرب',
      badge_en: 'Balanced Comfort',
      description_ar: 'تجمع بين الفنادق الفاخرة القريبة من ساحات الحرمين والخدمات المنظمة بدقة لضمان رحلة هادئة ميسرة للعائلات وكبار السن.',
      description_en: 'Combines upscale hotels steps away from the Haramain with meticulously organized services for families and seniors.',
      features_json: JSON.stringify([
        'فنادق ٤ و ٥ نجوم قريبة سيراً على الأقدام',
        'رحلات طيران مباشرة واستقبال وتوديع خاص بالمطارات',
        'بوفيه إفطار يومي فاخر في مكة المكرمة والمدينة المنورة',
        'مرشد ديني متخصص ومرافقة دائمة'
      ]),
      sort_order: 2
    },
    {
      id: 'umrah_vip',
      category: 'umrah_vip',
      trip_type: 'umrah',
      title_ar: 'عمرة فاخرة خاصة (VIP)',
      title_en: 'Luxury VIP Umrah Experience',
      season_ar: 'متاح حسب الطلب طوال العام',
      season_en: 'On-Demand Year-Round',
      duration_ar: 'باقات مرنة (٧ إلى ١٤ يوماً)',
      duration_en: 'Flexible (7 to 14 Days)',
      hotel_tier_ar: 'صف أول ٥ نجوم • إطلالة مباشرة على الكعبة',
      hotel_tier_en: 'Front-Row 5-Star • Direct Kaaba View',
      proximity_ar: 'مباشرة على ساحات الحرم المكي (أبراج الساعة / وقف الملك عبدالعزيز)',
      proximity_en: 'Direct access to Haram Courtyard (Clock Towers)',
      transport_ar: 'سيارات خاصة VIP وطيران على درجات رجال الأعمال',
      transport_en: 'Private VIP Chauffeur & Business Class',
      price_indicative_ar: 'باقات مخصصة — تواصل لتحديد متطلبات الجناح',
      price_indicative_en: 'Customized packages — Contact for suite options',
      price_verified: 0,
      image_url: './assets/mataf-panoramic.jpg',
      badge_ar: 'أعلى درجات الخصوصية والرفاهية',
      badge_en: 'Ultimate Luxury',
      description_ar: 'تجربة روحانية استثنائية تشمل أجنحة ملكية مطلة على الكعبة المشرفة، وخدمات تنقل خاصة وسريعة مع مدير تجربة مخصص.',
      description_en: 'An exceptional pilgrimage featuring royal Kaaba-view suites, private chauffeured transfers, and dedicated concierge.',
      features_json: JSON.stringify([
        'أجنحة فاخرة صف أول بإطلالة بانورامية على الكعبة',
        'استقبال صالة كبار الشخصيات وتنقلات بسيارات فاخرة خاصة',
        'خدمة كونسيرج ومرافقة شخصية على مدار الساعة',
        'مرونة تامة في تحديد التواريخ وبرامج المزارات الخاصة'
      ]),
      sort_order: 3
    },
    {
      id: 'umrah_ramadan',
      category: 'umrah_ramadan',
      trip_type: 'umrah',
      title_ar: 'عمرة شهر رمضان المبارك',
      title_en: 'Holy Month of Ramadan Umrah',
      season_ar: 'رمضان المبارك ١٤٤٨هـ (الأولى / الوسطى / العشر الأواخر)',
      season_en: 'Ramadan 1448H (Early / Mid / Last 10 Days)',
      duration_ar: '١٥ إلى ٢٥ يوماً',
      duration_en: '15 to 25 Days',
      hotel_tier_ar: 'باقات رمضانية متنوعة (اقتصادي، ٤ نجوم، ٥ نجوم)',
      hotel_tier_en: 'Various Ramadan Packages (Econ to 5-Star)',
      proximity_ar: 'فنادق مركزية لتيسير شهود صلوات التراويح والتهجد',
      proximity_en: 'Central hotels ensuring seamless Taraweeh & Tahajjud attendance',
      transport_ar: 'رحلات طيران مباشرة مخصصة لموسم رمضان',
      transport_en: 'Dedicated Ramadan direct charter & scheduled flights',
      price_indicative_ar: 'تحدد الأسعار وفق فترة الإقامة (الأوائل أو العشر الأواخر)',
      price_indicative_en: 'Priced according to period (First vs Last 10 days)',
      price_verified: 0,
      image_url: './assets/makkah-sunset-tawaf.jpg',
      badge_ar: 'روحانية الشهر الفضيل وليالي القدر',
      badge_en: 'Spiritual Ramadan Nights',
      description_ar: 'برامج منظمة تتيح للمعتمر قضاء أيام وليالي شهر رمضان بالقرب من البيت العتيق مع تنظيم وجبات الإفطار والسحور والصلوات.',
      description_en: 'Specially planned itineraries to experience Ramadan in Makkah with arranged Iftar, Suhoor, and proximity to prayer halls.',
      features_json: JSON.stringify([
        'باقات مخصصة للعشر الأواخر وليلة ختم القرآن',
        'ترتيبات إفطار وسحور مجهزة يومياً',
        'مواقع فندقية قريبة تسهل التواجد في الصلوات',
        'تأمين صحي وتنظيم تفويج مكثف ومستمر'
      ]),
      sort_order: 4
    },
    {
      id: 'hajj_tourist',
      category: 'hajj_tourist',
      trip_type: 'hajj',
      title_ar: 'الحج السياحي المنظم',
      title_en: 'Organized Tourist Hajj Program',
      season_ar: 'موسم الحج السنوي المعتمد ١٤٤٨هـ',
      season_en: 'Annual Certified Hajj Season',
      duration_ar: '١٨ إلى ٢٢ يوماً',
      duration_en: '18 to 22 Days',
      hotel_tier_ar: 'باقات سياحية متعددة (اقتصادي، ٤ نجوم، ٥ نجوم)',
      hotel_tier_en: 'Tiered Options (Economy to 5-Star Luxury)',
      proximity_ar: 'مخيمات المشاعر المطورة (منى وعرفات) + فنادق مكة والمدينة',
      proximity_en: 'Upgraded camps in Mina & Arafat + City hotels',
      transport_ar: 'طيران دولي + قطار الحرمين السريع + حافلات مخصصة',
      transport_en: 'International Flight + Haramain High-Speed Train + AC Buses',
      price_indicative_ar: 'تخضع الأسعار للضوابط الرسمية المعتمدة لشركات السياحة',
      price_indicative_en: 'Subject to official ministerial tourism regulations',
      price_verified: 0,
      image_url: './assets/mataf-panoramic.jpg',
      badge_ar: 'خيارات فندقية وتنوع برامج',
      badge_en: 'Multiple Hospitality Tiers',
      description_ar: 'برامج حج رسمية تقدمها شركات السياحة المرخصة بإشراف وزارة السياحة، توفر إقامة مريحة في مكة والمدينة ومخيمات مطورة بالمشاعر.',
      description_en: 'Official Hajj programs provided by licensed tourism agencies featuring upgraded holy site camps and integrated logistics.',
      features_json: JSON.stringify([
        'إشراف ومطابقة تامة مع الضوابط واللوائح الرسمية',
        'مخيمات مكيفة ومجهزة بالكامل في منى وعرفات',
        'خدمات إعاشة ووجبات طازجة طوال أيام التشريق',
        'لجان طبية وإرشادية ترافق الحجاج على مدار الساعة'
      ]),
      sort_order: 5
    },
    {
      id: 'hajj_vip',
      category: 'hajj_vip',
      trip_type: 'hajj',
      title_ar: 'الحج الفاخر بالمشاعر (VIP)',
      title_en: 'Luxury VIP Hajj Experience',
      season_ar: 'موسم الحج السنوي المعتمد ١٤٤٨هـ',
      season_en: 'Annual Certified Hajj Season',
      duration_ar: '١٤ إلى ٢٠ يوماً',
      duration_en: '14 to 20 Days',
      hotel_tier_ar: 'صف أول ٥ نجوم بمكة + مخيمات VIP المطورة',
      hotel_tier_en: '5-Star Makkah Front Row + VIP Camps',
      proximity_ar: 'أقرب مخيمات لجسر الجمرات + فنادق الساحة المركزية',
      proximity_en: 'Closest camps to Jamarat + Central Haram hotels',
      transport_ar: 'قطار المشاعر السريع وسيارات خاصة وتنقلات ميسرة',
      transport_en: 'Haramain Train, Private Transfers & Jamarat shuttles',
      price_indicative_ar: 'باقات فاخرة محدودة — تواصل لطلب بيان المواصفات',
      price_indicative_en: 'Exclusive limited suites — Contact for detailed specs',
      price_verified: 0,
      image_url: './assets/kaaba-kiswah.jpg',
      badge_ar: 'أرقى معايير الراحة بالمشاعر',
      badge_en: 'Highest Holy Site Comfort',
      description_ar: 'أرقى برامج الحج التي تضمن توفير مخيمات فندقية مكيفة بمواقع متميزة بالقرب من الجمرات، وإقامة فندقية فاخرة وخدمات ضيافة ورعاية مخصصة.',
      description_en: 'Elite Hajj program offering luxury air-conditioned camps near Jamarat, 5-star suites overlooking the Kaaba, and personalized care.',
      features_json: JSON.stringify([
        'مخيمات VIP مطورة بمواقع متقدمة قرب منشأة الجمرات',
        'بوفيهات مفتوحة وخدمة ضيافة مستمرة طوال أيام المناسك',
        'إقامة فندقية ٥ نجوم صف أول مطلة على الحرم',
        'أطقم مخصصة للرعاية الصحية والإرشاد والتفويج الميسر'
      ]),
      sort_order: 6
    },
    {
      id: 'hajj_lottery',
      category: 'hajj_lottery',
      trip_type: 'hajj',
      title_ar: 'حج القرعة (المسار الرسمي المنظم)',
      title_en: 'Official Lottery Hajj (General Track)',
      season_ar: 'موسم الحج السنوي المعتمد ١٤٤٨هـ',
      season_en: 'Annual Certified Hajj Season',
      duration_ar: 'وفق الجدول الرسمي المعلن (حوالي ٣٠ يوماً)',
      duration_en: 'According to official schedule (~30 Days)',
      hotel_tier_ar: 'مستوى رسمي موحد معتمد',
      hotel_tier_en: 'Official Unified Standard',
      proximity_ar: 'المشاعر المقدسة الرسمية ومناطق سكن الحجاج المعتمدة',
      proximity_en: 'Official holy site zones and approved pilgrim lodgings',
      transport_ar: 'طيران ونقل بري معتمد وفق مواعيد التفويج الرسمية',
      transport_en: 'Charter flights and authorized transport schedules',
      price_indicative_ar: 'يحدد ويعلن رسمياً من قِبل الجهات الحكومية المنظمة',
      price_indicative_en: 'Officially determined and published by government organizers',
      price_verified: 0,
      image_url: './assets/mataf-panoramic.jpg',
      badge_ar: 'المسار الحكومي المنظم',
      badge_en: 'Official Government Track',
      description_ar: 'توضيح استرشادي لمعايير ومواعيد إجراءات حج القرعة الرسمي لتسهيل المقارنة بين المسار الحكومي ومسارات الحج السياحي.',
      description_en: 'Informative guidance on official lottery Hajj standards to facilitate clear comparison with tourism packages.',
      features_json: JSON.stringify([
        'تنظيم رسمي يخضع للضوابط والقرارات الحكومية المعتمدة',
        'مخيمات معتمدة في منى وعرفات بإشراف بعثة الحج الرسمية',
        'مواعيد قرعة وتسجيل محددة بدقة وفق الإعلانات الرسمية',
        'لا تمثل ميقات جهة تسجيل بالقرعة وإنما تقدم دليلاً استرشادياً موحداً'
      ]),
      sort_order: 7
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO programs (
      id, category, trip_type, title_ar, title_en, season_ar, season_en,
      duration_ar, duration_en, hotel_tier_ar, hotel_tier_en, proximity_ar, proximity_en,
      transport_ar, transport_en, price_indicative_ar, price_indicative_en, price_verified,
      image_url, badge_ar, badge_en, description_ar, description_en, features_json, sort_order
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?
    )
  `);

  for (const p of catalog) {
    insertStmt.run(
      p.id, p.category, p.trip_type, p.title_ar, p.title_en, p.season_ar, p.season_en,
      p.duration_ar, p.duration_en, p.hotel_tier_ar, p.hotel_tier_en, p.proximity_ar, p.proximity_en,
      p.transport_ar, p.transport_en, p.price_indicative_ar, p.price_indicative_en, p.price_verified,
      p.image_url, p.badge_ar, p.badge_en, p.description_ar, p.description_en, p.features_json, p.sort_order
    );
  }
}

/**
 * Egyptian & International Phone Normalization Helper
 */
function normalizePhone(raw) {
  if (!raw) return '';
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let cleaned = String(raw).trim();
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replace(new RegExp(arabicNumerals[i], 'g'), i);
  }
  cleaned = cleaned.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+20')) {
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('0020') && cleaned.length === 14) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.startsWith('20') && cleaned.length === 12) {
    cleaned = '0' + cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Seed Test Customer Account
 * Target: Phone: 01156379992
 * Password: Asabry753# (Secured with scrypt + salt. Never stored plaintext)
 */
function seedTestCustomer() {
  const phone = '01156379992';
  const initialPassword = process.env.TEST_CUSTOMER_PASSWORD || 'Asabry753#';
  const { salt, hash } = hashPassword(initialPassword);
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    return;
  }

  db.prepare(`
    INSERT INTO users (id, name, phone, email, governorate, role, password_salt, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr_cust_01156379992',
    'أحمد محمود الشريف (حساب العميل التجريبي)',
    phone,
    'ahmed.customer@miqat.test',
    'cairo',
    'customer',
    salt,
    hash,
    now,
    now
  );
}

/**
 * Seed Test Existing Partner Company Account
 * Target: AL DORRA TRAVEL
 * Phone: 01156379990
 * Email: aldorra@gmail.com
 * Responsible Person: محمد سعيد
 * License: 47852
 * Governorate: الجيزة
 * Password: Asabry753## (Secured with scrypt + salt. Never stored plaintext)
 */
function seedTestCompany() {
  const phone = '01156379990';
  const initialPassword = process.env.TEST_COMPANY_PASSWORD || 'Asabry753##';
  const { salt, hash } = hashPassword(initialPassword);
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    db.prepare(`
      UPDATE users
      SET name = 'شركة الدرة للسياحة',
          company_name = 'شركة الدرة للسياحة',
          company_name_en = 'AL DORRA TRAVEL',
          responsible_person = 'محمد سعيد',
          license_number = '47852',
          email = 'aldorra@gmail.com',
          governorate = 'الجيزة',
          address = 'شارع الهرم، الجيزة، مصر',
          whatsapp = '01156379990',
          commercial_registry = 'CR-104928',
          contract_ref = 'MQ-CTR-2025-084',
          contract_start = '2025-01-01',
          contract_end = '2026-12-31',
          contract_signed_at = '2024-12-20',
          partnership_level = 'platinum',
          contract_status = 'active',
          application_status = 'approved',
          role = 'company',
          status = 'active',
          password_salt = ?,
          password_hash = ?,
          updated_at = ?
      WHERE phone = ?
    `).run(salt, hash, now, phone);
    return;
  }

  db.prepare(`
    INSERT INTO users (
      id, name, phone, email, governorate, role, company_name, company_name_en, responsible_person, license_number, address, whatsapp, commercial_registry, contract_ref, contract_start, contract_end, contract_signed_at, partnership_level, contract_status, status, application_status, password_salt, password_hash, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr_comp_01156379990',
    'شركة الدرة للسياحة',
    phone,
    'aldorra@gmail.com',
    'الجيزة',
    'company',
    'شركة الدرة للسياحة',
    'AL DORRA TRAVEL',
    'محمد سعيد',
    '47852',
    'شارع الهرم، الجيزة، مصر',
    '01156379990',
    'CR-104928',
    'MQ-CTR-2025-084',
    '2025-01-01',
    '2026-12-31',
    '2024-12-20',
    'platinum',
    'active',
    'active',
    'approved',
    salt,
    hash,
    now,
    now
  );
}

/**
 * Seed Test New Company Partner Account (Pending Review)
 * Target: New Tourism Partner Applicant (Development Test Account)
 * Phone: 01156379991
 * Password: Asabry753### (Secured with scrypt + salt. Never stored plaintext)
 * Role: new_company
 * Status: pending_review
 * Application Status: pending_review
 */
function seedNewCompanyTestAccount() {
  const phone = '01156379991';
  const initialPassword = process.env.TEST_NEW_COMPANY_PASSWORD || 'Asabry753###';
  const { salt, hash } = hashPassword(initialPassword);
  const now = new Date().toISOString();
  const submissionDate = '2026-11-01T10:00:00.000Z';

  const existing = db.prepare('SELECT id, role, phone FROM users WHERE phone = ?').get(phone);
  if (existing) {
    if (existing.id === 'usr_newcomp_01156379991' || existing.role === 'new_company') {
      db.prepare(`
        UPDATE users
        SET name = 'شركة تجريبية جديدة (قيد المراجعة)',
            company_name = 'شركة تجريبية جديدة',
            company_name_en = 'New Test Travel Agency',
            responsible_person = 'مقدم الطلب (حساب تجريبي)',
            license_number = NULL,
            email = 'newpartner.test@miqat.test',
            governorate = 'cairo',
            address = 'شارع التحرير، الدقي، الجيزة',
            whatsapp = '01156379991',
            commercial_registry = NULL,
            contract_ref = NULL,
            contract_start = NULL,
            contract_end = NULL,
            contract_signed_at = NULL,
            partnership_level = 'applicant',
            contract_status = 'pending',
            role = 'new_company',
            status = 'pending_review',
            application_status = 'pending_review',
            application_submitted_at = COALESCE(application_submitted_at, ?),
            application_notes = 'طلب شراكة جديد قيد المراجعة الإدارية والتحقق من المستندات',
            password_salt = ?,
            password_hash = ?,
            updated_at = ?
        WHERE phone = ?
      `).run(submissionDate, salt, hash, now, phone);
      return;
    } else {
      console.warn(`[WARNING] Phone ${phone} is already assigned to unexpected user ID ${existing.id}. Skipping overwrite to preserve integrity.`);
      return;
    }
  }

  db.prepare(`
    INSERT INTO users (
      id, name, phone, email, governorate, role, company_name, company_name_en, responsible_person, license_number, address, whatsapp, commercial_registry, contract_ref, contract_start, contract_end, contract_signed_at, partnership_level, contract_status, status, application_status, application_submitted_at, application_notes, password_salt, password_hash, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr_newcomp_01156379991',
    'شركة تجريبية جديدة (قيد المراجعة)',
    phone,
    'newpartner.test@miqat.test',
    'cairo',
    'new_company',
    'شركة تجريبية جديدة',
    'New Test Travel Agency',
    'مقدم الطلب (حساب تجريبي)',
    null,
    'شارع التحرير، الدقي، الجيزة',
    '01156379991',
    null,
    null,
    null,
    null,
    null,
    'applicant',
    'pending',
    'pending_review',
    'pending_review',
    submissionDate,
    'طلب شراكة جديد قيد المراجعة الإدارية والتحقق من المستندات',
    salt,
    hash,
    submissionDate,
    now
  );
}

/**
 * Seed Test Accounts Employee Account
 * Target: Ahmed Sabry - Financial Accounts Employee
 * Phone: 01156379993
 * Email / Identifier: ahmed-employee-Financial-accounts
 * Password: Asabry753#1 (Secured with scrypt + salt. Never stored plaintext)
 * Role: accounts_employee
 */
function seedAccountsEmployeeTestAccount() {
  const phone = '01156379993';
  const email = 'ahmed-employee-Financial-accounts';
  const initialPassword = process.env.TEST_ACCOUNTS_EMPLOYEE_PASSWORD || 'Asabry753#1';
  const { salt, hash } = hashPassword(initialPassword);
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id, phone, email, role FROM users WHERE phone = ? OR LOWER(email) = LOWER(?)').get(phone, email);
  if (existing) {
    db.prepare(`
      UPDATE users
      SET name = 'أحمد صبري — إدارة الحسابات المالية',
          phone = ?,
          email = ?,
          role = 'accounts_employee',
          status = 'active',
          application_status = NULL,
          password_salt = ?,
          password_hash = ?,
          updated_at = ?
      WHERE id = ?
    `).run(phone, email, salt, hash, now, existing.id);
    return;
  }

  db.prepare(`
    INSERT INTO users (
      id, name, phone, email, governorate, role, status, application_status, password_salt, password_hash, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr_acc_01156379993',
    'أحمد صبري — إدارة الحسابات المالية',
    phone,
    email,
    'cairo',
    'accounts_employee',
    'active',
    null,
    salt,
    hash,
    now,
    now
  );
}

// Initialize tables and initial data
initSchema();
seedPrograms();
seedTestCustomer();
seedTestCompany();
seedNewCompanyTestAccount();
seedAccountsEmployeeTestAccount();

/**
 * Repository Methods
 */

// --- Users & Sessions ---
function getUserByPhoneOrEmail(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).trim();
  const normalized = normalizePhone(clean);
  return db.prepare(`
    SELECT * FROM users 
    WHERE phone = ? 
       OR phone = ? 
       OR LOWER(email) = LOWER(?)
  `).get(clean, normalized, clean);
}

function getUserById(id) {
  if (!id) return null;
  return db.prepare(`
    SELECT id, name, phone, email, governorate, role, company_name, company_name_en, 
           responsible_person, license_number, address, whatsapp, commercial_registry, 
           contract_ref, contract_start, contract_end, contract_signed_at, 
           partnership_level, contract_status, status, application_status, 
           application_submitted_at, application_notes, created_at, updated_at 
    FROM users 
    WHERE id = ? OR (id = 'usr_comp_01156379990' AND ? = 'comp_aldorra_01')
  `).get(id, id);
}

function checkPhoneOrEmailExists(phone, email, excludeUserId) {
  if (phone) {
    const cleanPhone = normalizePhone(phone);
    const existing = db.prepare('SELECT id FROM users WHERE phone = ? AND id != ?').get(cleanPhone, excludeUserId || '');
    if (existing) return { conflict: 'phone' };
  }
  if (email && String(email).trim()) {
    const cleanEmail = String(email).trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?').get(cleanEmail, excludeUserId || '');
    if (existing) return { conflict: 'email' };
  }
  return null;
}

function updateUserProfile(userId, { phone, email } = {}) {
  if (!userId) throw new Error('USER_ID_REQUIRED');
  const user = getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const now = new Date().toISOString();
  const newPhone = phone !== undefined ? normalizePhone(phone) : user.phone;
  const newEmail = email !== undefined ? (email && String(email).trim() ? String(email).trim() : null) : user.email;

  // Name is strictly excluded from this parameterized update
  db.prepare(`
    UPDATE users
    SET phone = ?,
        email = ?,
        updated_at = ?
    WHERE id = ?
  `).run(newPhone, newEmail, now, userId);

  return getUserById(userId);
}

function updateCompanyProfile(userId, { responsible_person, phone, whatsapp, email, governorate, address } = {}) {
  if (!userId) throw new Error('USER_ID_REQUIRED');
  const user = getUserById(userId) || (userId === 'comp_aldorra_01' ? getUserByPhoneOrEmail('01156379990') : null);
  if (!user) throw new Error('COMPANY_NOT_FOUND');

  const now = new Date().toISOString();
  const actualUserId = user.id;

  const newResponsible = responsible_person !== undefined ? String(responsible_person).trim() : user.responsible_person;
  const newPhone = phone !== undefined ? normalizePhone(phone) : user.phone;
  const newWhatsapp = whatsapp !== undefined ? (whatsapp ? normalizePhone(whatsapp) : null) : user.whatsapp;
  const newEmail = email !== undefined ? (email && String(email).trim() ? String(email).trim().toLowerCase() : null) : user.email;
  const newGovernorate = governorate !== undefined ? String(governorate).trim() : user.governorate;
  const newAddress = address !== undefined ? String(address).trim() : user.address;

  // STRICT PROTECTION: company_name, license_number, role, and contract fields are never modified here
  db.prepare(`
    UPDATE users
    SET responsible_person = ?,
        phone = ?,
        whatsapp = ?,
        email = ?,
        governorate = ?,
        address = ?,
        updated_at = ?
    WHERE id = ?
  `).run(newResponsible, newPhone, newWhatsapp, newEmail, newGovernorate, newAddress, now, actualUserId);

  return getUserById(actualUserId);
}

function createUser({ name, phone, email, governorate, password, role = 'customer' }) {
  const { salt, hash } = hashPassword(password);
  const id = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, name, phone, email, governorate, role, password_salt, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name.trim(),
    phone.trim(),
    email ? email.trim() : null,
    governorate || null,
    role,
    salt,
    hash,
    now,
    now
  );

  return getUserById(id);
}

function createSession(userId) {
  const token = `mqt_sess_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userId, expiresAt, now);

  return { token, expiresAt };
}

function getUserBySessionToken(token) {
  if (!token) return null;
  const sess = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!sess) return null;

  if (sess.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return getUserById(sess.user_id);
}

function deleteSession(token) {
  if (!token) return;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

// --- Programs ---
function getAllPrograms({ category, tripType } = {}) {
  let query = 'SELECT * FROM programs WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (tripType && tripType !== 'all') {
    query += ' AND trip_type = ?';
    params.push(tripType);
  }

  query += ' ORDER BY sort_order ASC';
  const rows = db.prepare(query).all(...params);

  return rows.map(r => ({
    ...r,
    features: JSON.parse(r.features_json || '[]')
  }));
}

function getProgramById(id) {
  if (!id) return null;
  const row = db.prepare('SELECT * FROM programs WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...row,
    features: JSON.parse(row.features_json || '[]')
  };
}

// --- Requests ---
function generateRequestId() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MQT-REQ-${y}${m}${d}-${rand}`;
}

function createRequest({
  customerId,
  customerName,
  customerPhone,
  customerEmail,
  customerGovernorate,
  programId,
  notes
}) {
  const program = getProgramById(programId);
  if (!program) {
    throw new Error(`Program not found with ID: ${programId}`);
  }

  const requestId = generateRequestId();
  const now = new Date().toISOString();
  const initialAudit = JSON.stringify([
    {
      timestamp: now,
      action: 'REQUEST_CREATED',
      actor: customerName,
      details: 'Customer submitted program details inquiry via Miqat JourneyHub'
    }
  ]);

  db.prepare(`
    INSERT INTO requests (
      id, customer_id, customer_name, customer_phone, customer_email,
      customer_governorate, program_id, program_name, program_category,
      status, assigned_employee, notes, whatsapp_status, whatsapp_recipient,
      created_at, updated_at, audit_log_json
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `).run(
    requestId,
    customerId || null,
    customerName.trim(),
    customerPhone.trim(),
    customerEmail ? customerEmail.trim() : null,
    customerGovernorate || null,
    program.id,
    program.title_ar,
    program.category,
    'Pending Assignment',
    null,
    notes ? notes.trim() : null,
    'ready_to_send',
    '201203340116',
    now,
    now,
    initialAudit
  );

  return getRequestById(requestId);
}

function getRequestById(id) {
  if (!id) return null;
  const row = db.prepare('SELECT * FROM requests WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...row,
    audit_log: JSON.parse(row.audit_log_json || '[]')
  };
}

function getAllRequests({ status, programId, limit = 50, offset = 0 } = {}) {
  let query = 'SELECT * FROM requests WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (programId) {
    query += ' AND program_id = ?';
    params.push(programId);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = db.prepare(query).all(...params);
  return rows.map(r => ({
    ...r,
    audit_log: JSON.parse(r.audit_log_json || '[]')
  }));
}

function updateRequestStatus(id, { status, assignedEmployee, notes, actor = 'System' }) {
  const req = getRequestById(id);
  if (!req) return null;

  const now = new Date().toISOString();
  const audit = req.audit_log || [];
  audit.push({
    timestamp: now,
    action: 'STATUS_UPDATED',
    actor,
    details: `Status changed from ${req.status} to ${status || req.status}. Assigned: ${assignedEmployee || req.assigned_employee}`
  });

  db.prepare(`
    UPDATE requests
    SET status = COALESCE(?, status),
        assigned_employee = COALESCE(?, assigned_employee),
        notes = COALESCE(?, notes),
        updated_at = ?,
        audit_log_json = ?
    WHERE id = ?
  `).run(
    status || null,
    assignedEmployee || null,
    notes || null,
    now,
    JSON.stringify(audit),
    id
  );

  return getRequestById(id);
}

function recordWhatsAppDispatched(id, { mode = 'prefilled_link_opened' } = {}) {
  const req = getRequestById(id);
  if (!req) return null;

  const now = new Date().toISOString();
  const audit = req.audit_log || [];
  audit.push({
    timestamp: now,
    action: 'WHATSAPP_DISPATCHED',
    actor: 'Customer',
    details: `Customer opened WhatsApp conversation targeting receiver +201203340116 (${mode})`
  });

  db.prepare(`
    UPDATE requests
    SET whatsapp_status = ?,
        updated_at = ?,
        audit_log_json = ?
    WHERE id = ?
  `).run('link_opened', now, JSON.stringify(audit), id);

  return getRequestById(id);
}

// --- Admin Secure Provisioning ---
function provisionAdminUser({ phone, password, name = 'مدير النظام (مسؤول المدفوعات)', email = 'admin@miqat.test' }) {
  if (!phone || !password) {
    throw new Error('ADMIN_PROVISION_MISSING_CREDENTIALS');
  }
  const cleanPhone = normalizePhone(phone);
  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(cleanPhone);
  if (existing) {
    db.prepare(`
      UPDATE users
      SET role = 'admin',
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          password_salt = ?,
          password_hash = ?,
          updated_at = ?
      WHERE id = ?
    `).run(name, email, salt, hash, now, existing.id);
    return getUserById(existing.id);
  } else {
    const adminId = `usr_adm_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO users (id, name, phone, email, governorate, role, password_salt, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'admin', ?, ?, ?, ?)
    `).run(adminId, name, cleanPhone, email, 'cairo', salt, hash, now, now);
    return getUserById(adminId);
  }
}

// Check startup environment variables for initial admin bootstrap
if (process.env.MIQAT_ADMIN_PHONE && process.env.MIQAT_ADMIN_PASSWORD) {
  try {
    provisionAdminUser({
      phone: process.env.MIQAT_ADMIN_PHONE,
      password: process.env.MIQAT_ADMIN_PASSWORD,
      name: process.env.MIQAT_ADMIN_NAME || 'مدير النظام المعتمد',
      email: process.env.MIQAT_ADMIN_EMAIL || 'admin@miqat.test'
    });
    console.log('[Security] Admin user provisioned from environment configuration.');
  } catch (err) {
    console.error('[Security] Failed to provision admin user:', err.message);
  }
}

// --- Payments & Refunds Repository ---

function createPaymentRecord({
  id,
  reference,
  customerId,
  customerName,
  customerPhone,
  customerEmail,
  requestId,
  programId,
  programTitleAr,
  programTitleEn,
  travelersCount = 1,
  currency = 'EGP',
  unitPrice,
  packageTotal = null,
  paymentOption = 'full',
  remainingAmount = 0,
  totalAmount,
  status = 'Pending',
  simulatedMethod = 'mock_card',
  idempotencyKey = null
}) {
  const now = new Date().toISOString();
  const pkgTotalVal = packageTotal != null ? packageTotal : totalAmount;
  const planLabel = paymentOption === 'deposit_30' ? '30% Deposit' : 'Full Payment';
  const initialAudit = JSON.stringify([
    {
      timestamp: now,
      action: 'PAYMENT_INITIATED',
      actor: customerName,
      details: `Simulated payment initiated for ${travelersCount} traveler(s) - Plan: ${planLabel} - Paid now: ${totalAmount} ${currency} (Package: ${pkgTotalVal} ${currency})`
    }
  ]);

  db.prepare(`
    INSERT INTO payments (
      id, reference, customer_id, customer_name, customer_phone, customer_email,
      request_id, program_id, program_title_ar, program_title_en, travelers_count,
      currency, unit_price, package_total, payment_option, remaining_amount, total_amount,
      status, simulated_method, idempotency_key,
      created_at, updated_at, audit_log_json
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?
    )
  `).run(
    id,
    reference,
    customerId,
    customerName,
    customerPhone,
    customerEmail || null,
    requestId || null,
    programId,
    programTitleAr,
    programTitleEn,
    travelersCount,
    currency,
    unitPrice,
    pkgTotalVal,
    paymentOption,
    remainingAmount,
    totalAmount,
    status,
    simulatedMethod,
    idempotencyKey || null,
    now,
    now,
    initialAudit
  );

  return getPaymentByReference(reference);
}

function getPaymentByReference(reference) {
  if (!reference) return null;
  const row = db.prepare('SELECT * FROM payments WHERE reference = ?').get(reference);
  if (!row) return null;

  let refund = null;
  if (row.status === 'Refunded') {
    refund = db.prepare('SELECT * FROM refunds WHERE payment_reference = ?').get(reference);
    if (refund) {
      refund.audit_log = JSON.parse(refund.audit_log_json || '[]');
    }
  }

  return {
    ...row,
    audit_log: JSON.parse(row.audit_log_json || '[]'),
    refund
  };
}

function getPaymentByIdempotencyKey(key) {
  if (!key) return null;
  const row = db.prepare('SELECT * FROM payments WHERE idempotency_key = ?').get(key);
  if (!row) return null;
  return getPaymentByReference(row.reference);
}

function getPaymentsByCustomerId(customerId, { status, limit = 50, offset = 0 } = {}) {
  if (!customerId) return [];
  let query = 'SELECT * FROM payments WHERE customer_id = ?';
  const params = [customerId];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = db.prepare(query).all(...params);
  return rows.map(r => ({
    ...r,
    audit_log: JSON.parse(r.audit_log_json || '[]')
  }));
}

function getAllPaymentsAdmin({ search, status, limit = 50, offset = 0 } = {}) {
  let query = 'SELECT * FROM payments WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query += ' AND (reference LIKE ? OR customer_phone LIKE ? OR customer_name LIKE ?)';
    params.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = db.prepare(query).all(...params);
  return rows.map(r => {
    let refund = null;
    if (r.status === 'Refunded') {
      refund = db.prepare('SELECT * FROM refunds WHERE payment_reference = ?').get(r.reference);
      if (refund) {
        refund.audit_log = JSON.parse(refund.audit_log_json || '[]');
      }
    }
    return {
      ...r,
      audit_log: JSON.parse(r.audit_log_json || '[]'),
      refund
    };
  });
}

function updatePaymentStatus(reference, {
  status,
  failureReason = null,
  paidAt = null,
  actor = 'System',
  details = ''
}) {
  const payment = getPaymentByReference(reference);
  if (!payment) return null;

  const now = new Date().toISOString();
  const audit = payment.audit_log || [];
  audit.push({
    timestamp: now,
    action: `STATUS_${status.toUpperCase()}`,
    actor,
    details: details || `Payment status changed from ${payment.status} to ${status}`
  });

  db.prepare(`
    UPDATE payments
    SET status = ?,
        failure_reason = COALESCE(?, failure_reason),
        paid_at = COALESCE(?, paid_at),
        updated_at = ?,
        audit_log_json = ?
    WHERE reference = ?
  `).run(
    status,
    failureReason,
    paidAt,
    now,
    JSON.stringify(audit),
    reference
  );

  return getPaymentByReference(reference);
}

function executeRefundAtomic({ paymentReference, reason, adminId, adminName }) {
  const cleanReason = (reason || '').trim();
  if (!cleanReason || cleanReason.length < 5 || cleanReason.length > 500) {
    throw new Error('REFUND_REASON_INVALID');
  }

  db.exec('BEGIN IMMEDIATE;');
  try {
    const payment = db.prepare('SELECT * FROM payments WHERE reference = ?').get(paymentReference);
    if (!payment) {
      throw new Error('PAYMENT_NOT_FOUND');
    }
    if (payment.status !== 'Paid') {
      throw new Error('PAYMENT_NOT_ELIGIBLE_FOR_REFUND');
    }

    const existingRefund = db.prepare('SELECT id FROM refunds WHERE payment_reference = ?').get(paymentReference);
    if (existingRefund) {
      throw new Error('PAYMENT_ALREADY_REFUNDED');
    }

    const now = new Date().toISOString();
    const audit = JSON.parse(payment.audit_log_json || '[]');
    audit.push({
      timestamp: now,
      action: 'PAYMENT_REFUNDED',
      actor: adminName,
      details: `Simulated refund of ${payment.total_amount} ${payment.currency} processed by Admin ${adminName} (${adminId}). Reason: ${cleanReason}`
    });

    const updateRes = db.prepare(`
      UPDATE payments
      SET status = 'Refunded',
          updated_at = ?,
          audit_log_json = ?
      WHERE reference = ? AND status = 'Paid'
    `).run(now, JSON.stringify(audit), paymentReference);

    if (updateRes.changes === 0) {
      throw new Error('PAYMENT_STATUS_CONFLICT');
    }

    const randSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const refundId = `MQT-REF-${Date.now()}-${randSuffix}`;
    const refundAudit = JSON.stringify([{
      timestamp: now,
      action: 'REFUND_RECORDED',
      actor: adminName,
      details: `Mock refund recorded for transaction reference ${paymentReference}`
    }]);

    db.prepare(`
      INSERT INTO refunds (
        id, payment_reference, amount, currency, reason, admin_id, admin_name, created_at, audit_log_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      refundId,
      paymentReference,
      payment.total_amount,
      payment.currency,
      cleanReason,
      adminId,
      adminName,
      now,
      refundAudit
    );

    db.exec('COMMIT;');
    return getPaymentByReference(paymentReference);
  } catch (err) {
    try {
      db.exec('ROLLBACK;');
    } catch (rbErr) {}
    throw err;
  }
}

function getRefundByPaymentReference(paymentReference) {
  if (!paymentReference) return null;
  const row = db.prepare('SELECT * FROM refunds WHERE payment_reference = ?').get(paymentReference);
  if (!row) return null;
  return {
    ...row,
    audit_log: JSON.parse(row.audit_log_json || '[]')
  };
}

/**
 * Company Notifications Repository
 */
const SEED_COMPANY_NOTIFICATIONS = [
  {
    id: 'notif_1',
    company_id: 'comp_aldorra_01',
    type: 'new_booking',
    title_ar: 'طلب حجز إلكتروني جديد — BK-2026-1045',
    title_en: 'New Online Booking Request — BK-2026-1045',
    message_ar: 'تم استلام حجز جديد لعدد 2 معتمرين ببرنامج عمرة اقتصادية موفرة (انطلاق 15 نوفمبر 2026).',
    message_en: 'New booking request received for 2 pilgrims in Economic Umrah Saver program (departure Nov 15, 2026).',
    unread: 1,
    created_at: '2026-10-29T10:15:00.000Z',
    booking_id: 'bkg_1000',
    booking_reference: 'BK-2026-1045',
    customer_name_ar: 'أحمد محمود الشريف',
    customer_name_en: 'Ahmed Mahmoud El-Sharif',
    program_title_ar: 'عمرة اقتصادية موفرة',
    program_title_en: 'Economic Umrah Saver',
    amount: 76000,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1000'
  },
  {
    id: 'notif_2',
    company_id: 'comp_aldorra_01',
    type: 'deposit_received',
    title_ar: 'تأكيد سداد الدفعة المقدمة عبر بوابة الدفع',
    title_en: 'Deposit Payment Verified via Payment Gateway',
    message_ar: 'تم بنجاح استلام دفعة جدية الحجز بمبلغ 22,800 ج.م للحجز BK-2026-1045 وتأكيد صلاحية الحجز مبدئياً.',
    message_en: 'Booking deposit of 22,800 EGP successfully received for BK-2026-1045; reservation is pre-confirmed.',
    unread: 1,
    created_at: '2026-10-29T09:42:00.000Z',
    booking_id: 'bkg_1000',
    booking_reference: 'BK-2026-1045',
    customer_name_ar: 'أحمد محمود الشريف',
    customer_name_en: 'Ahmed Mahmoud El-Sharif',
    program_title_ar: 'عمرة اقتصادية موفرة',
    program_title_en: 'Economic Umrah Saver',
    amount: 22800,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1000'
  },
  {
    id: 'notif_3',
    company_id: 'comp_aldorra_01',
    type: 'admin_update',
    title_ar: 'تعميم وزاري رقم 84/1447: ضوابط البصمة الحيوية والتسكين الإلزامي',
    title_en: 'Official Circular 84/1447: Biometric Verification & Mandatory Housing Rules',
    message_ar: 'اعتماد الآلية التنفيذية الجديدة لإصدار تصاريح العمرة والربط المباشر مع منصة نسك للفنادق المؤهلة لموسم 1447هـ.',
    message_en: 'Implementation directives approved for Umrah permits issuing and direct API integration with Nusuk portal for 1447H.',
    unread: 1,
    created_at: '2026-10-29T08:30:00.000Z',
    booking_id: null,
    booking_reference: null,
    customer_name_ar: null,
    customer_name_en: null,
    program_title_ar: null,
    program_title_en: null,
    amount: null,
    currency: 'EGP',
    admin_notice_json: JSON.stringify({
      circularNumber: 'CIRC-1447-084',
      issuer_ar: 'وزارة الحج والعمرة — الإدارة العامة لشركات العمرة الخارجية',
      issuer_en: 'Ministry of Hajj & Umrah — General Directorate of External Umrah',
      issueDate: '2026-10-29',
      effectiveDate: '2026-11-01',
      subject_ar: 'الربط التقني الموحد للبصمة الحيوية وإلزامية عقود الإسكان المصادقة عبر نسك مسار',
      subject_en: 'Unified Biometric API Integration & Mandatory Certified Housing Contracts via Nusuk Masar',
      body_ar: 'بناءً على التوجيهات الوزارية الصادرة لتنظيم موسم 1447هـ، يلزم على كافة الشركات السياحية المصرح لها التأكد من استكمال كافة بيانات البصمة الحيوية للمعتمرين وإرفاق عقود التسكين المصادقة إلكترونياً قبل موعد الرحلة بـ 72 ساعة على الأقل لتفادي تأخير إصدار التأشيرات وتفويج الأفواج بالمنافذ الجوية.',
      body_en: 'In accordance with regulatory directives for season 1447H, all accredited tourism companies must complete pilgrim biometric verifications and upload electronic housing contracts via Nusuk Masar at least 72 hours prior to flight departure to prevent visa delays at ports of entry.'
    }),
    action_url: '#modal-adminNoticeModal'
  },
  {
    id: 'notif_4',
    company_id: 'comp_aldorra_01',
    type: 'payment_update',
    title_ar: 'توثيق دفعة مالية مستلمة بمقر الشركة',
    title_en: 'Direct Payment Logged at Company Branch',
    message_ar: 'تم توثيق سداد القسط الثاني بقيمة 78,000 ج.م نقداً / شيك مصرفي للحجز BK-2026-1039 وتحديث السجل المالي.',
    message_en: 'Second installment of 78,000 EGP logged at company branch for BK-2026-1039 and ledger balance updated.',
    unread: 1,
    created_at: '2026-10-28T16:20:00.000Z',
    booking_id: 'bkg_1006',
    booking_reference: 'BK-2026-1039',
    customer_name_ar: 'محمود حسن إبراهيم',
    customer_name_en: 'Mahmoud Hassan Ibrahim',
    program_title_ar: 'عمرة متميزة 5 نجوم',
    program_title_en: 'Umrah Premium 5-Star',
    amount: 78000,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1006'
  },
  {
    id: 'notif_5',
    company_id: 'comp_aldorra_01',
    type: 'program_change',
    title_ar: 'طلب ترقية غرفة وتعديل موعد العودة',
    title_en: 'Room Upgrade & Return Date Modification Request',
    message_ar: 'تقدم العميل بطلب ترقية الغرفة من رباعية إلى ثنائية مع تعديل رحلة العودة لتكون يوم 30 نوفمبر.',
    message_en: 'Customer submitted a request to upgrade from Quad to Double room with departure flight adjusted to Nov 30.',
    unread: 1,
    created_at: '2026-10-27T14:10:00.000Z',
    booking_id: 'bkg_1002',
    booking_reference: 'BK-2026-1043',
    customer_name_ar: 'عمر عبد العزيز خليل',
    customer_name_en: 'Omar Abdel-Aziz Khalil',
    program_title_ar: 'عمرة اقتصادية موفرة',
    program_title_en: 'Economic Umrah Saver',
    amount: null,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1002'
  },
  {
    id: 'notif_6',
    company_id: 'comp_aldorra_01',
    type: 'booking_rejected',
    title_ar: 'إلغاء حجز لعدم اكتمال سداد الدفعة المقدمة',
    title_en: 'Booking Cancelled Due to Unpaid Deposit Deadline',
    message_ar: 'تم إلغاء الحجز BK-2026-1042 تلقائياً بعد انقضاء مهلة السداد (72 ساعة) وإعادة إتاحة المقعدين في البرنامج.',
    message_en: 'Booking BK-2026-1042 was cancelled following the expiration of the 72-hour payment window; seats released.',
    unread: 0,
    created_at: '2026-10-26T11:45:00.000Z',
    booking_id: 'bkg_1003',
    booking_reference: 'BK-2026-1042',
    customer_name_ar: 'مريم محمود النجار',
    customer_name_en: 'Maryam Mahmoud El-Naggar',
    program_title_ar: 'عمرة النخبة VIP المباشرة',
    program_title_en: 'Luxury Direct VIP Umrah',
    amount: null,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1003'
  },
  {
    id: 'notif_7',
    company_id: 'comp_aldorra_01',
    type: 'new_booking',
    title_ar: 'طلب حجز جديد — موسم رمضان المبارك',
    title_en: 'New Booking Request — Holy Ramadan Season',
    message_ar: 'تم تسجيل حجز جديد لعدد 2 معتمرين لبرنامج العشر الأواخر من رمضان مع سداد دفعة تأكيد 51,000 ج.م.',
    message_en: 'New booking registered for 2 pilgrims in Ramadan Last Ten Days program with 51,000 EGP confirmation deposit.',
    unread: 0,
    created_at: '2026-10-25T13:00:00.000Z',
    booking_id: 'bkg_1004',
    booking_reference: 'BK-2026-1041',
    customer_name_ar: 'عبد الرحمن طارق الفقي',
    customer_name_en: 'Abdel-Rahman Tarek El-Fiqi',
    program_title_ar: 'عمرة شهر رمضان المبارك',
    program_title_en: 'Holy Ramadan Umrah',
    amount: 170000,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1004'
  },
  {
    id: 'notif_8',
    company_id: 'comp_aldorra_01',
    type: 'admin_update',
    title_ar: 'اعتماد الحصة التقديرية لموسم الحج السياحي 1447هـ',
    title_en: 'Approval of 1447H Tourism Hajj Quota Allocation',
    message_ar: 'صدور الموافقة الرسمية على تخصيص حصة شركة الدرة للسياحة (فئة أ) بواقع 120 تأشيرة حج سياحي فاخر واقتصادي.',
    message_en: 'Official approval issued allocating Al Dorra Travel (Tier A) 120 pilgrim visas across luxury and economic programs.',
    unread: 0,
    created_at: '2026-10-22T09:00:00.000Z',
    booking_id: null,
    booking_reference: null,
    customer_name_ar: null,
    customer_name_en: null,
    program_title_ar: null,
    program_title_en: null,
    amount: null,
    currency: 'EGP',
    admin_notice_json: JSON.stringify({
      circularNumber: 'CIRC-1447-079',
      issuer_ar: 'لجنة الحج العليا — وزارة السياحة والآثار',
      issuer_en: 'Supreme Hajj Committee — Ministry of Tourism & Antiquities',
      issueDate: '2026-10-22',
      effectiveDate: '2026-10-25',
      subject_ar: 'تخصيص الحصص المعتمدة للشركات السياحية فئة (أ) لموسم حج 1447هـ',
      subject_en: 'Allocation of Certified Quotas for Category (A) Tourism Companies for Hajj Season 1447H',
      body_ar: 'تعلن اللجنة العليا للحج والعمرة عن اعتماد الحصة الرسمية للشركات ذات الملاءة والخبرة المتميزة، وقد تم تحديد حصة شركة الدرة للسياحة بـ 120 حاجاً موزعة بين باقات الحج السياحي الـ 5 نجوم والحج الاقتصادي، مع التأكيد على الالتزام بضوابط غرفة شركات السياحة.',
      body_en: 'The Supreme Committee for Hajj and Umrah announces the official allocation of pilgrimage quotas for accredited companies. Al Dorra Travel has been granted 120 pilgrim visas across 5-star and economic programs, strictly adhering to Chamber guidelines.'
    }),
    action_url: '#modal-adminNoticeModal'
  },
  {
    id: 'notif_9',
    company_id: 'comp_aldorra_01',
    type: 'deposit_received',
    title_ar: 'سداد دفعة إلكترونية للحجز BK-2026-1038',
    title_en: 'Electronic Deposit Received for BK-2026-1038',
    message_ar: 'تم استلام دفعة مقدمة بقيمة 22,800 ج.م عبر بطاقة ائتمانية وتأكيد الحجز برقم المرجع BK-2026-1038.',
    message_en: 'Deposit of 22,800 EGP received via credit card; booking BK-2026-1038 confirmed.',
    unread: 0,
    created_at: '2026-10-18T10:30:00.000Z',
    booking_id: 'bkg_1007',
    booking_reference: 'BK-2026-1038',
    customer_name_ar: 'هدى إبراهيم السيد',
    customer_name_en: 'Huda Ibrahim El-Sayed',
    program_title_ar: 'عمرة اقتصادية موفرة',
    program_title_en: 'Economic Umrah Saver',
    amount: 22800,
    currency: 'EGP',
    admin_notice_json: null,
    action_url: 'company-booking-details.html?id=bkg_1007'
  }
];

function seedCompanyNotifications(companyId = 'comp_aldorra_01') {
  try {
    const existing = db.prepare('SELECT COUNT(*) as cnt FROM company_notifications WHERE company_id = ?').get(companyId);
    if (existing && existing.cnt > 0) return;

    const stmt = db.prepare(`
      INSERT INTO company_notifications (
        id, company_id, type, title_ar, title_en, message_ar, message_en,
        unread, created_at, booking_id, booking_reference, customer_name_ar, customer_name_en,
        program_title_ar, program_title_en, amount, currency, admin_notice_json, action_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const notif of SEED_COMPANY_NOTIFICATIONS) {
      stmt.run(
        notif.id,
        notif.company_id,
        notif.type,
        notif.title_ar,
        notif.title_en,
        notif.message_ar,
        notif.message_en,
        notif.unread,
        notif.created_at,
        notif.booking_id,
        notif.booking_reference,
        notif.customer_name_ar,
        notif.customer_name_en,
        notif.program_title_ar,
        notif.program_title_en,
        notif.amount,
        notif.currency,
        notif.admin_notice_json,
        notif.action_url
      );
    }
  } catch (err) {
    console.error('Error seeding company notifications:', err);
  }
}

function getCompanyNotificationsFromDb(companyId = 'comp_aldorra_01', filters = {}) {
  try {
    seedCompanyNotifications(companyId);
    let sql = 'SELECT * FROM company_notifications WHERE company_id = ?';
    const params = [companyId];

    if (filters.period) {
      const todayStr = '2026-10-29';
      if (filters.period === 'today') {
        sql += ' AND date(created_at) = ?';
        params.push(todayStr);
      } else if (filters.period === 'week') {
        sql += ' AND created_at >= date(?, "-7 days")';
        params.push(todayStr);
      } else if (filters.period === 'month') {
        sql += ' AND created_at >= date(?, "-30 days")';
        params.push(todayStr);
      }
    }

    if (filters.dateFrom) {
      sql += ' AND date(created_at) >= ?';
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      sql += ' AND date(created_at) <= ?';
      params.push(filters.dateTo);
    }

    if (filters.type && filters.type !== 'all') {
      if (Array.isArray(filters.type)) {
        sql += ` AND type IN (${filters.type.map(() => '?').join(',')})`;
        params.push(...filters.type);
      } else {
        sql += ' AND type = ?';
        params.push(filters.type);
      }
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'unread') {
        sql += ' AND unread = 1';
      } else if (filters.status === 'read') {
        sql += ' AND unread = 0';
      }
    }

    if (filters.bookingRef) {
      sql += ' AND (booking_reference LIKE ? OR booking_id LIKE ?)';
      params.push(`%${filters.bookingRef}%`, `%${filters.bookingRef}%`);
    }

    if (filters.search) {
      sql += ' AND (title_ar LIKE ? OR title_en LIKE ? OR message_ar LIKE ? OR message_en LIKE ? OR customer_name_ar LIKE ? OR customer_name_en LIKE ? OR booking_reference LIKE ? OR program_title_ar LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s, s, s, s, s, s, s);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = db.prepare(sql).all(...params);
    return rows.map(r => ({
      ...r,
      unread: Boolean(r.unread),
      admin_notice: r.admin_notice_json ? JSON.parse(r.admin_notice_json) : null
    }));
  } catch (err) {
    console.error('getCompanyNotificationsFromDb error:', err);
    return [];
  }
}

function getCompanyNotificationsSummaryFromDb(companyId = 'comp_aldorra_01') {
  try {
    seedCompanyNotifications(companyId);
    const todayStr = '2026-10-29';
    const totalRow = db.prepare('SELECT COUNT(*) as cnt FROM company_notifications WHERE company_id = ?').get(companyId);
    const unreadRow = db.prepare('SELECT COUNT(*) as cnt FROM company_notifications WHERE company_id = ? AND unread = 1').get(companyId);
    const readRow = db.prepare('SELECT COUNT(*) as cnt FROM company_notifications WHERE company_id = ? AND unread = 0').get(companyId);
    const todayRow = db.prepare('SELECT COUNT(*) as cnt FROM company_notifications WHERE company_id = ? AND date(created_at) = ?').get(companyId, todayStr);

    return {
      total: totalRow ? totalRow.cnt : 0,
      unread: unreadRow ? unreadRow.cnt : 0,
      read: readRow ? readRow.cnt : 0,
      today: todayRow ? todayRow.cnt : 0
    };
  } catch (err) {
    console.error('getCompanyNotificationsSummaryFromDb error:', err);
    return { total: 0, unread: 0, read: 0, today: 0 };
  }
}

function markCompanyNotificationReadInDb(notificationId, isUnread = false) {
  try {
    const val = isUnread ? 1 : 0;
    db.prepare('UPDATE company_notifications SET unread = ? WHERE id = ?').run(val, notificationId);
    const row = db.prepare('SELECT * FROM company_notifications WHERE id = ?').get(notificationId);
    if (!row) return null;
    return {
      ...row,
      unread: Boolean(row.unread),
      admin_notice: row.admin_notice_json ? JSON.parse(row.admin_notice_json) : null
    };
  } catch (err) {
    console.error('markCompanyNotificationReadInDb error:', err);
    return null;
  }
}

function markAllCompanyNotificationsReadInDb(companyId = 'comp_aldorra_01') {
  try {
    db.prepare('UPDATE company_notifications SET unread = 0 WHERE company_id = ?').run(companyId);
    return true;
  } catch (err) {
    console.error('markAllCompanyNotificationsReadInDb error:', err);
    return false;
  }
}

function createCompanyNotificationInDb(notification) {
  try {
    const id = notification.id || `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = notification.created_at || new Date().toISOString();
    const adminJson = notification.admin_notice ? JSON.stringify(notification.admin_notice) : (notification.admin_notice_json || null);

    db.prepare(`
      INSERT INTO company_notifications (
        id, company_id, type, title_ar, title_en, message_ar, message_en,
        unread, created_at, booking_id, booking_reference, customer_name_ar, customer_name_en,
        program_title_ar, program_title_en, amount, currency, admin_notice_json, action_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      notification.company_id || 'comp_aldorra_01',
      notification.type,
      notification.title_ar,
      notification.title_en,
      notification.message_ar,
      notification.message_en,
      notification.unread !== undefined ? (notification.unread ? 1 : 0) : 1,
      now,
      notification.booking_id || null,
      notification.booking_reference || null,
      notification.customer_name_ar || null,
      notification.customer_name_en || null,
      notification.program_title_ar || null,
      notification.program_title_en || null,
      notification.amount || null,
      notification.currency || 'EGP',
      adminJson,
      notification.action_url || (notification.booking_id ? `company-booking-details.html?id=${notification.booking_id}` : null)
    );

    const row = db.prepare('SELECT * FROM company_notifications WHERE id = ?').get(id);
    return {
      ...row,
      unread: Boolean(row.unread),
      admin_notice: row.admin_notice_json ? JSON.parse(row.admin_notice_json) : null
    };
  } catch (err) {
    console.error('createCompanyNotificationInDb error:', err);
    return null;
  }
}

module.exports = {
  db,
  normalizePhone,
  verifyPassword,
  hashPassword,
  getUserByPhoneOrEmail,
  getUserById,
  checkPhoneOrEmailExists,
  updateUserProfile,
  createUser,
  createSession,
  getUserBySessionToken,
  deleteSession,
  getAllPrograms,
  getProgramById,
  createRequest,
  getRequestById,
  getAllRequests,
  updateRequestStatus,
  recordWhatsAppDispatched,
  provisionAdminUser,
  seedTestCompany,
  updateCompanyProfile,
  createPaymentRecord,
  getPaymentByReference,
  getPaymentByIdempotencyKey,
  getPaymentsByCustomerId,
  getAllPaymentsAdmin,
  updatePaymentStatus,
  executeRefundAtomic,
  getRefundByPaymentReference,
  seedCompanyNotifications,
  getCompanyNotificationsFromDb,
  getCompanyNotificationsSummaryFromDb,
  markCompanyNotificationReadInDb,
  markAllCompanyNotificationsReadInDb,
  createCompanyNotificationInDb,
  seedNewCompanyTestAccount,
  seedAccountsEmployeeTestAccount
};
