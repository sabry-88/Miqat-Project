/**
 * MIQAT SALES & CALL CENTER CRM — DATABASE REPOSITORY & BUSINESS ENGINE
 *
 * Persists employee records, server-authoritative work sessions, breaks,
 * demo-labeled CRM records, points ledger, achievement badges, notifications,
 * and activity logs inside data/miqat.db (node:sqlite).
 */

const crypto = require('crypto');
const {
  COMPANIES_CATALOG,
  PROGRAMS_CATALOG,
  PROGRAM_CHANGELOG_SEED,
  COMPANY_SYNC_HISTORY_SEED,
  SALES_SCRIPTS,
  buildSeedRecords,
  FUN_CORNER_BANK
} = require('./salesMockData');

// Provisional configurable sample-size fairness threshold for program & company conversion metrics
const PROGRAM_PERF_CONFIG = {
  isProvisional: true,
  minReliableBookings: 5
};

// Configurable Work-Session Boundary Rules
const WORK_SESSION_RULES = {
  FULL_SHIFT_SECONDS: 8 * 3600,
  HALF_SHIFT_SECONDS: 4 * 3600,
  FULL_SHIFT_MAX_BREAKS: 4,
  HALF_SHIFT_MAX_BREAKS: 2,
  BREAK_ALLOWED_SECONDS: 15 * 60,
  BREAK_RETURN_WINDOW_SECONDS: 10 * 60,
  RESUME_MAX_MINUTES: 20,
  // 21-29 min boundary is not definitively specified; isolated configurable policy:
  AMBIGUOUS_GAP_MIN_MINUTES: 21,
  AMBIGUOUS_GAP_MAX_MINUTES: 29,
  AMBIGUOUS_GAP_POLICY: 'resume_non_destructive',
  END_EXACT_MINUTES: 30,
  NEW_SESSION_MIN_MINUTES: 31
};

// Configurable Provisional Commercial Leaderboard Formula (never ranked by calls/points)
const LEADERBOARD_WEIGHTS = {
  isProvisional: true,
  completedContractWeight: 100,
  completedBookingWeight: 40,
  targetAchievementPctWeight: 1.5
};

const POINTS_RULES = {
  outbound_call: { points: 5, label_ar: 'تسجيل مكالمة صادرة', label_en: 'Outbound Call Logged' },
  inbound_call: { points: 5, label_ar: 'تسجيل مكالمة واردة', label_en: 'Inbound Call Logged' },
  followup_scheduled: { points: 8, label_ar: 'جدولة متابعة عميل', label_en: 'Customer Follow-up Scheduled' }
};

function initSalesSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_employees (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      employee_code TEXT UNIQUE NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      workspace TEXT NOT NULL DEFAULT 'sales_crm',
      role_title_ar TEXT NOT NULL DEFAULT 'موظف مبيعات ومركز اتصال',
      role_title_en TEXT NOT NULL DEFAULT 'Sales & Call Center Specialist',
      status TEXT NOT NULL DEFAULT 'active',
      daily_target INTEGER NOT NULL DEFAULT 60,
      weekly_target INTEGER NOT NULL DEFAULT 300,
      monthly_target INTEGER NOT NULL DEFAULT 1200,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_work_sessions (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      shift_type TEXT NOT NULL,
      target_seconds INTEGER NOT NULL,
      worked_seconds INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      last_heartbeat_at TEXT NOT NULL,
      offline_started_at TEXT,
      ended_at TEXT,
      end_reason TEXT,
      emergency_reason TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sales_ws_emp ON sales_work_sessions(employee_id, status);

    CREATE TABLE IF NOT EXISTS sales_breaks (
      id TEXT PRIMARY KEY,
      work_session_id TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      allowed_seconds INTEGER NOT NULL DEFAULT 900,
      overtime_seconds INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      FOREIGN KEY (work_session_id) REFERENCES sales_work_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sales_breaks_ws ON sales_breaks(work_session_id, status);

    CREATE TABLE IF NOT EXISTS sales_customers (
      id TEXT PRIMARY KEY,
      owner_employee_id TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      phone TEXT,
      governorate TEXT NOT NULL,
      source TEXT NOT NULL,
      referrer_name TEXT,
      stage TEXT NOT NULL,
      program_id TEXT,
      company_name_ar TEXT,
      company_name_en TEXT,
      booking_completed INTEGER NOT NULL DEFAULT 0,
      contract_signed INTEGER NOT NULL DEFAULT 0,
      payment_confirmed INTEGER NOT NULL DEFAULT 0,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (owner_employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sales_cust_owner ON sales_customers(owner_employee_id, created_at);

    CREATE TABLE IF NOT EXISTS sales_calls (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      customer_id TEXT,
      direction TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      outcome TEXT,
      notes TEXT,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sales_calls_emp ON sales_calls(employee_id, created_at);

    CREATE TABLE IF NOT EXISTS sales_followups (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      due_at TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'normal',
      notes TEXT,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sales_fup_emp ON sales_followups(employee_id, due_at);

    CREATE TABLE IF NOT EXISTS sales_points_ledger (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      event_key TEXT NOT NULL,
      points INTEGER NOT NULL,
      reason_ar TEXT NOT NULL,
      reason_en TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(employee_id, event_key),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_badges (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      desc_ar TEXT NOT NULL,
      desc_en TEXT NOT NULL,
      threshold_points INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sales_employee_badges (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      badge_id TEXT NOT NULL,
      earned_at TEXT NOT NULL,
      UNIQUE(employee_id, badge_id),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE,
      FOREIGN KEY (badge_id) REFERENCES sales_badges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_notifications (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      body_ar TEXT NOT NULL,
      body_en TEXT NOT NULL,
      target_url TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_activity_log (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'employee',
      desc_ar TEXT NOT NULL,
      desc_en TEXT NOT NULL,
      ref_id TEXT,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
  `);

  seedBadgesCatalog(db);
  try { db.exec('ALTER TABLE sales_customers ADD COLUMN total_amount_egp INTEGER NOT NULL DEFAULT 0'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_customers ADD COLUMN paid_amount_egp INTEGER NOT NULL DEFAULT 0'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_customers ADD COLUMN whatsapp TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_customers ADD COLUMN cancellation_reason TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_customers ADD COLUMN cancellation_other_note TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_calls ADD COLUMN started_at TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_calls ADD COLUMN ended_at TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_calls ADD COLUMN outcome_other_note TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN purpose TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN delay_reason TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN rescheduled_from_id TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN cancel_reason TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN cancelled_at TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN completed_via TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN completed_at TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN tags_json TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN system_priority TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE sales_followups ADD COLUMN recurrence_rule TEXT'); } catch (_) {}
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_followup_history (
      id TEXT PRIMARY KEY,
      followup_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      prev_val TEXT,
      new_val TEXT,
      reason TEXT,
      note TEXT,
      actor_name_ar TEXT,
      actor_name_en TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales_saved_filters (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      page_key TEXT NOT NULL,
      name TEXT NOT NULL,
      filter_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sales_fun_progress (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      activity_date TEXT NOT NULL,
      activity_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      selected_index INTEGER NOT NULL,
      is_correct INTEGER NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      UNIQUE(employee_id, activity_date, activity_type),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_customer_comments (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      author_name_ar TEXT NOT NULL,
      author_name_en TEXT NOT NULL,
      comment TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES sales_customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_customer_history (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      prev_status TEXT,
      new_status TEXT,
      reason TEXT,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES sales_customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_lead_requests (
      id TEXT PRIMARY KEY,
      requested_by_employee_id TEXT NOT NULL,
      requested_by_name_ar TEXT NOT NULL,
      requested_by_name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      governorate TEXT NOT NULL,
      source TEXT NOT NULL,
      program_id TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending_admin_approval',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales_program_favorites (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(employee_id, program_id),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_pinned_items (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(employee_id, item_type, item_id),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_recent_programs (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      context_type TEXT NOT NULL DEFAULT 'viewed',
      viewed_at TEXT NOT NULL,
      UNIQUE(employee_id, program_id),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_saved_scripts (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      title TEXT NOT NULL,
      customer_type TEXT,
      inputs_json TEXT,
      script_json TEXT NOT NULL,
      is_prototype INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_program_error_reports (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      company_id TEXT NOT NULL,
      field_name TEXT NOT NULL,
      current_value TEXT,
      suggested_value TEXT,
      details TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_review',
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_program_recommendations (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_program_changelog (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      company_id TEXT NOT NULL,
      change_type TEXT NOT NULL,
      field_ar TEXT NOT NULL,
      field_en TEXT NOT NULL,
      prev_value_ar TEXT,
      prev_value_en TEXT,
      new_value_ar TEXT,
      new_value_en TEXT,
      importance TEXT NOT NULL DEFAULT 'medium',
      data_source_ar TEXT NOT NULL,
      data_source_en TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales_permission_requests (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      permission_key TEXT NOT NULL,
      permission_label_ar TEXT NOT NULL,
      permission_label_en TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_admin_review',
      is_prototype INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_profile_celebrations (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      achievement_key TEXT NOT NULL,
      celebrated_at TEXT NOT NULL,
      UNIQUE(employee_id, achievement_key),
      FOREIGN KEY (employee_id) REFERENCES sales_employees(id) ON DELETE CASCADE
    );
  `);

  try { db.exec('ALTER TABLE sales_employees ADD COLUMN whatsapp TEXT'); } catch (_) {}
  try { db.exec("ALTER TABLE sales_employees ADD COLUMN department_ar TEXT NOT NULL DEFAULT 'المبيعات ومركز الاتصال'"); } catch (_) {}
  try { db.exec("ALTER TABLE sales_employees ADD COLUMN department_en TEXT NOT NULL DEFAULT 'Sales & Call Center'"); } catch (_) {}

  const chgCount = db.prepare('SELECT COUNT(*) AS cnt FROM sales_program_changelog').get();
  if (!chgCount || chgCount.cnt === 0) {
    const chgStmt = db.prepare(`
      INSERT OR IGNORE INTO sales_program_changelog (
        id, program_id, company_id, change_type, field_ar, field_en,
        prev_value_ar, prev_value_en, new_value_ar, new_value_en,
        importance, data_source_ar, data_source_en, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of PROGRAM_CHANGELOG_SEED) {
      chgStmt.run(
        c.id, c.program_id, c.company_id, c.change_type, c.field_ar, c.field_en,
        c.prev_value_ar, c.prev_value_en, c.new_value_ar, c.new_value_en,
        c.importance, c.data_source_ar, c.data_source_en, c.created_at
      );
    }
  }
}

function seedBadgesCatalog(db) {
  const badges = [
    ['bdg_first_call', 'first_contact', 'أول تواصل', 'First Contact', 'تسجيل أول مكالمة متابعة مع عميل', 'Logged your first customer call', 5],
    ['bdg_momentum', 'steady_momentum', 'انطلاقة قوية', 'Steady Momentum', 'جمع 50 نقطة نشاط موثقة', 'Earned 50 verified activity points', 50],
    ['bdg_closer', 'contract_closer', 'منجز العقود', 'Contract Closer', 'تحقيق عقود مكتملة ومسددة بالكامل', 'Completed fully paid & signed contracts', 120],
    ['bdg_champion', 'excellence_star', 'نجم التميز', 'Excellence Star', 'بلوغ 250 نقطة أداء تحفيزية', 'Reached 250 motivational milestone points', 250]
  ];
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO sales_badges (id, code, title_ar, title_en, desc_ar, desc_en, threshold_points)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const b of badges) stmt.run(...b);
}

function createSalesRepository({ db, normalizePhone, hashPassword }) {
  initSalesSchema(db);

  function getEmployeeByUserId(userId) {
    if (!userId) return null;
    return db.prepare('SELECT * FROM sales_employees WHERE user_id = ?').get(userId) || null;
  }

  function getEmployeeByEmailOrPhone(email, phone) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = normalizePhone(phone || '');
    return db.prepare(
      'SELECT * FROM sales_employees WHERE lower(email) = ? OR phone = ?'
    ).get(cleanEmail, cleanPhone) || null;
  }

  function provisionSalesEmployee({ email, phone, password, nameAr, nameEn, resetPassword = false }) {
    if (!email || !phone || !password) {
      throw new Error('SALES_PROVISION_MISSING_CREDENTIALS');
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      throw new Error('SALES_PROVISION_INVALID_PHONE');
    }

    const existingUser = db.prepare(
      'SELECT id, name, phone, email, role FROM users WHERE lower(email) = ? OR phone = ?'
    ).get(cleanEmail, cleanPhone);

    if (existingUser) {
      const now = new Date().toISOString();
      let passwordReset = false;
      if (resetPassword) {
        const { salt, hash } = hashPassword(password);
        db.prepare(`
          UPDATE users
          SET password_salt = ?, password_hash = ?, phone = ?, email = ?, role = 'sales_employee', status = 'active', updated_at = ?
          WHERE id = ?
        `).run(salt, hash, cleanPhone, cleanEmail, now, existingUser.id);
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(existingUser.id);
        passwordReset = true;
      }

      let existingEmp = getEmployeeByUserId(existingUser.id);
      if (!existingEmp && (existingUser.role === 'sales_employee' || passwordReset)) {
        const empId = `emp_sales_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
        db.prepare(`
          INSERT INTO sales_employees (id, user_id, employee_code, name_ar, name_en, email, phone, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(empId, existingUser.id, 'SLS-2026-001', nameAr || existingUser.name, nameEn || 'Ahmed Sabry', cleanEmail, cleanPhone, now, now);
        existingEmp = getEmployeeByUserId(existingUser.id);
      } else if (existingEmp && passwordReset) {
        db.prepare(`
          UPDATE sales_employees
          SET email = ?, phone = ?, updated_at = ?
          WHERE id = ?
        `).run(cleanEmail, cleanPhone, now, existingEmp.id);
        existingEmp = getEmployeeByUserId(existingUser.id);
      }

      if (existingEmp) {
        seedSalesDemoDataIfEmpty(existingEmp.id);
      }
      const updatedUser = db.prepare('SELECT id, name, phone, email, role, status FROM users WHERE id = ?').get(existingUser.id);
      return {
        created: false,
        alreadyExists: true,
        passwordReset,
        user: updatedUser,
        employee: existingEmp
      };
    }

    const { salt, hash } = hashPassword(password);
    const now = new Date().toISOString();
    const userId = `usr_sls_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const empId = `emp_sls_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const displayAr = nameAr || 'أحمد صبري';
    const displayEn = nameEn || 'Ahmed Sabry';

    db.prepare(`
      INSERT INTO users (id, name, phone, email, governorate, role, password_salt, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'cairo', 'sales_employee', ?, ?, ?, ?)
    `).run(userId, displayAr, cleanPhone, cleanEmail, salt, hash, now, now);

    db.prepare(`
      INSERT INTO sales_employees (
        id, user_id, employee_code, name_ar, name_en, email, phone,
        workspace, role_title_ar, role_title_en, status,
        daily_target, weekly_target, monthly_target, created_at, updated_at
      )
      VALUES (?, ?, 'SLS-2026-001', ?, ?, ?, ?, 'sales_crm', 'أخصائي مبيعات ومركز اتصال', 'Sales & Call Center Specialist', 'active', 60, 300, 1200, ?, ?)
    `).run(empId, userId, displayAr, displayEn, cleanEmail, cleanPhone, now, now);

    seedSalesDemoDataIfEmpty(empId);

    return {
      created: true,
      alreadyExists: false,
      user: db.prepare('SELECT id, name, phone, email, role FROM users WHERE id = ?').get(userId),
      employee: getEmployeeByUserId(userId)
    };
  }

  function seedSalesDemoDataIfEmpty(employeeId) {
    const seededCheck = db.prepare(`SELECT COUNT(*) AS cnt FROM sales_customers WHERE owner_employee_id = ? AND id = 'CUS-D-118'`).get(employeeId);
    if (seededCheck && seededCheck.cnt > 0) return;

    const nowMs = Date.now();
    const isoAt = (offsetHours) => new Date(nowMs + offsetHours * 3600000).toISOString();
    const { customers, calls, followups, notifications, activities } = buildSeedRecords(nowMs);

    const insCust = db.prepare(`
      INSERT OR IGNORE INTO sales_customers (
        id, owner_employee_id, name_ar, name_en, phone, governorate, source, referrer_name,
        stage, program_id, company_name_ar, company_name_en,
        booking_completed, contract_signed, payment_confirmed, total_amount_egp, paid_amount_egp, is_demo, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    const updPay = db.prepare(`
      UPDATE sales_customers
      SET total_amount_egp = COALESCE(NULLIF(total_amount_egp, 0), ?),
          paid_amount_egp = COALESCE(NULLIF(paid_amount_egp, 0), ?),
          program_id = ?
      WHERE id = ? AND owner_employee_id = ? AND is_demo = 1
    `);
    for (const c of customers) {
      insCust.run(
        c[0], employeeId, c[1], c[2], c[3], c[4], c[5], c[6],
        c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15], c[16], c[16]
      );
      updPay.run(c[14], c[15], c[8], c[0], employeeId);
    }

    const insCall = db.prepare(`
      INSERT OR IGNORE INTO sales_calls (id, employee_id, customer_id, direction, duration_seconds, outcome, notes, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);
    for (const cal of calls) insCall.run(cal[0], employeeId, cal[1], cal[2], cal[3], cal[4], cal[5], cal[6]);

    const insFup = db.prepare(`
      INSERT OR IGNORE INTO sales_followups (id, employee_id, customer_id, due_at, status, priority, notes, is_demo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    for (const f of followups) insFup.run(f[0], employeeId, f[1], f[2], f[3], f[4], f[5], f[6], f[6]);

    db.prepare(`
      INSERT OR IGNORE INTO sales_points_ledger (id, employee_id, event_key, points, reason_ar, reason_en, created_at)
      VALUES (?, ?, 'seed_initial_activity', 65, 'نقاط نشاط تجريبية أولية', 'Initial demo activity milestone points', ?)
    `).run('PTS-D-001', employeeId, isoAt(-2));

    db.prepare(`
      INSERT OR IGNORE INTO sales_employee_badges (id, employee_id, badge_id, earned_at)
      VALUES ('EB-D-001', ?, 'bdg_first_call', ?), ('EB-D-002', ?, 'bdg_momentum', ?)
    `).run(employeeId, isoAt(-5), employeeId, isoAt(-2));

    const insNotif = db.prepare(`
      INSERT OR IGNORE INTO sales_notifications (id, employee_id, title_ar, title_en, body_ar, body_en, target_url, is_read, is_deleted, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?)
    `);
    for (const n of notifications) insNotif.run(n[0], employeeId, n[1], n[2], n[3], n[4], n[5], n[6], n[7]);

    const insAct = db.prepare(`
      INSERT OR IGNORE INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);
    for (const a of activities) insAct.run(a[0], employeeId, a[1], a[2], a[3], a[4], a[5], a[6]);

    // Historical ended shifts for profile/shift log
    db.prepare(`
      INSERT OR IGNORE INTO sales_work_sessions (id, employee_id, shift_type, target_seconds, worked_seconds, status, started_at, last_heartbeat_at, ended_at, end_reason, created_at, updated_at)
      VALUES (?, ?, 'full', 28800, 28920, 'ended', ?, ?, ?, 'shift_completed', ?, ?)
    `).run('SWS-D-01', employeeId, isoAt(-32), isoAt(-24), isoAt(-24), isoAt(-32), isoAt(-24));
    db.prepare(`
      INSERT OR IGNORE INTO sales_work_sessions (id, employee_id, shift_type, target_seconds, worked_seconds, status, started_at, last_heartbeat_at, ended_at, end_reason, created_at, updated_at)
      VALUES (?, ?, 'half', 14400, 14510, 'ended', ?, ?, ?, 'shift_completed', ?, ?)
    `).run('SWS-D-02', employeeId, isoAt(-56), isoAt(-52), isoAt(-52), isoAt(-56), isoAt(-52));
  }

  // --- Work Session & Break Engine (Server-Authoritative Timestamps) ---
  function getActiveWorkSession(employeeId) {
    const sess = db.prepare(`
      SELECT * FROM sales_work_sessions
      WHERE employee_id = ? AND status IN ('online', 'on_break', 'offline')
      ORDER BY created_at DESC LIMIT 1
    `).get(employeeId);
    if (!sess) return null;

    const breaks = db.prepare('SELECT * FROM sales_breaks WHERE work_session_id = ? ORDER BY started_at ASC').all(sess.id);
    const activeBreak = breaks.find(b => b.status === 'active') || null;
    const maxBreaks = sess.shift_type === 'half' ? WORK_SESSION_RULES.HALF_SHIFT_MAX_BREAKS : WORK_SESSION_RULES.FULL_SHIFT_MAX_BREAKS;

    // Live elapsed calculation without mutating DB unless heartbeat/transition
    let liveWorked = sess.worked_seconds;
    if (sess.status === 'online') {
      const delta = Math.max(0, Math.floor((Date.now() - Date.parse(sess.last_heartbeat_at)) / 1000));
      liveWorked += delta;
    }

    let liveBreakElapsed = 0;
    let liveBreakRemaining = 0;
    let liveBreakOvertime = 0;
    if (activeBreak) {
      liveBreakElapsed = Math.max(0, Math.floor((Date.now() - Date.parse(activeBreak.started_at)) / 1000));
      liveBreakRemaining = Math.max(0, activeBreak.allowed_seconds - liveBreakElapsed);
      liveBreakOvertime = Math.max(0, liveBreakElapsed - activeBreak.allowed_seconds);

      if (liveBreakOvertime >= WORK_SESSION_RULES.BREAK_RETURN_WINDOW_SECONDS) {
        const now = new Date().toISOString();
        db.prepare(`
          UPDATE sales_breaks SET ended_at = ?, duration_seconds = ?, overtime_seconds = ?, status = 'timeout' WHERE id = ?
        `).run(now, liveBreakElapsed, liveBreakOvertime, activeBreak.id);
        db.prepare(`
          UPDATE sales_work_sessions SET status = 'ended', ended_at = ?, end_reason = 'break_timeout', updated_at = ? WHERE id = ?
        `).run(now, now, sess.id);
        db.prepare(`
          INSERT OR IGNORE INTO sales_notifications (id, employee_id, title_ar, title_en, body_ar, body_en, target_url, is_read, is_deleted, is_demo, created_at)
          VALUES (?, ?, 'انتهاء الوردية لتجاوز مهلة الاستراحة', 'Shift Ended: Break Return Window Exceeded', 'تم إنهاء الوردية تلقائياً لتجاوز مهلة العودة (10 دقائق) بعد انتهاء الاستراحة.', 'Shift ended automatically after exceeding the 10-minute return window.', 'sales-profile.html', 0, 0, 0, ?)
        `).run(`SNTF-BRK-TO-${activeBreak.id}`, employeeId, now);
        return null;
      }

      if (liveBreakOvertime > 0) {
        const now = new Date().toISOString();
        db.prepare(`
          INSERT OR IGNORE INTO sales_notifications (id, employee_id, title_ar, title_en, body_ar, body_en, target_url, is_read, is_deleted, is_demo, created_at)
          VALUES (?, ?, 'تنبيه تجاوز وقت الاستراحة', 'Break Time Exceeded', 'انتهت مدة الاستراحة (15 دقيقة). يرجى العودة للعمل خلال 10 دقائق.', 'Your 15-minute break has expired. Please return within 10 minutes.', 'sales-dashboard.html', 0, 0, 0, ?)
        `).run(`SNTF-BRK-OV-${activeBreak.id}`, employeeId, now);
      }
    }

    return {
      ...sess,
      liveWorkedSeconds: liveWorked,
      remainingWorkSeconds: Math.max(0, sess.target_seconds - liveWorked),
      progressPct: Math.min(100, Math.round((liveWorked / sess.target_seconds) * 1000) / 10),
      breaksUsed: breaks.length,
      maxBreaks,
      remainingBreaks: Math.max(0, maxBreaks - breaks.length),
      activeBreak: activeBreak ? {
        ...activeBreak,
        elapsedSeconds: liveBreakElapsed,
        remainingSeconds: liveBreakRemaining,
        overtimeSeconds: liveBreakOvertime,
        returnWindowRemainingSeconds: Math.max(0, WORK_SESSION_RULES.BREAK_RETURN_WINDOW_SECONDS - liveBreakOvertime),
        isOvertime: liveBreakOvertime > 0
      } : null,
      canEmergencyStop: liveWorked >= Math.floor(sess.target_seconds / 2),
      rules: WORK_SESSION_RULES
    };
  }

  function startWorkSession(employeeId, shiftType) {
    const cleanShift = shiftType === 'half' ? 'half' : 'full';
    const current = getActiveWorkSession(employeeId);
    const now = new Date().toISOString();

    if (current && (current.status === 'online' || current.status === 'on_break')) {
      return current;
    }

    if (current && current.status === 'offline' && current.offline_started_at) {
      const gapMinutes = (Date.now() - Date.parse(current.offline_started_at)) / 60000;
      if (gapMinutes <= WORK_SESSION_RULES.RESUME_MAX_MINUTES ||
         (gapMinutes >= WORK_SESSION_RULES.AMBIGUOUS_GAP_MIN_MINUTES && gapMinutes <= WORK_SESSION_RULES.AMBIGUOUS_GAP_MAX_MINUTES && WORK_SESSION_RULES.AMBIGUOUS_GAP_POLICY === 'resume_non_destructive')) {
        db.prepare(`
          UPDATE sales_work_sessions
          SET status = 'online', offline_started_at = NULL, last_heartbeat_at = ?, updated_at = ?
          WHERE id = ?
        `).run(now, now, current.id);
        return getActiveWorkSession(employeeId);
      }
      // >= 30 minutes ends the prior session
      db.prepare(`
        UPDATE sales_work_sessions
        SET status = 'ended', ended_at = ?, end_reason = 'offline_timeout', updated_at = ?
        WHERE id = ?
      `).run(now, now, current.id);
    }

    const targetSeconds = cleanShift === 'half' ? WORK_SESSION_RULES.HALF_SHIFT_SECONDS : WORK_SESSION_RULES.FULL_SHIFT_SECONDS;
    const id = `SWS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_work_sessions (
        id, employee_id, shift_type, target_seconds, worked_seconds,
        status, started_at, last_heartbeat_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 0, 'online', ?, ?, ?, ?)
    `).run(id, employeeId, cleanShift, targetSeconds, now, now, now, now);

    return getActiveWorkSession(employeeId);
  }

  function goOffline(employeeId) {
    const current = getActiveWorkSession(employeeId);
    if (!current || current.status === 'offline') return current;
    const now = new Date().toISOString();
    if (current.activeBreak) {
      endBreak(employeeId);
    }
    const fresh = getActiveWorkSession(employeeId);
    db.prepare(`
      UPDATE sales_work_sessions
      SET status = 'offline', worked_seconds = ?, offline_started_at = ?, last_heartbeat_at = ?, updated_at = ?
      WHERE id = ?
    `).run(fresh.liveWorkedSeconds, now, now, now, fresh.id);
    return getActiveWorkSession(employeeId);
  }

  function resumeWorkSession(employeeId) {
    const current = getActiveWorkSession(employeeId);
    if (!current) return { resumed: false, requiresNewShift: true, session: null };
    if (current.status !== 'offline') return { resumed: true, session: current };

    const now = new Date().toISOString();
    const gapMinutes = current.offline_started_at ? (Date.now() - Date.parse(current.offline_started_at)) / 60000 : 0;

    if (gapMinutes >= WORK_SESSION_RULES.END_EXACT_MINUTES) {
      db.prepare(`
        UPDATE sales_work_sessions
        SET status = 'ended', ended_at = ?, end_reason = 'offline_timeout', updated_at = ?
        WHERE id = ?
      `).run(now, now, current.id);
      return { resumed: false, endedByTimeout: true, gapMinutes: Math.round(gapMinutes), session: null };
    }

    db.prepare(`
      UPDATE sales_work_sessions
      SET status = 'online', offline_started_at = NULL, last_heartbeat_at = ?, updated_at = ?
      WHERE id = ?
    `).run(now, now, current.id);

    return { resumed: true, gapMinutes: Math.round(gapMinutes), session: getActiveWorkSession(employeeId) };
  }

  function heartbeatWorkSession(employeeId) {
    const current = getActiveWorkSession(employeeId);
    if (!current || current.status !== 'online') return current;
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales_work_sessions
      SET worked_seconds = ?, last_heartbeat_at = ?, updated_at = ?
      WHERE id = ?
    `).run(current.liveWorkedSeconds, now, now, current.id);
    return getActiveWorkSession(employeeId);
  }

  function stopWorkSession(employeeId, { emergency = false, reason = '' } = {}) {
    const current = getActiveWorkSession(employeeId);
    if (!current) return { ok: false, error: 'NO_ACTIVE_SESSION' };
    if (current.activeBreak) endBreak(employeeId);

    const fresh = getActiveWorkSession(employeeId);
    const halfTarget = Math.floor(fresh.target_seconds / 2);

    if (emergency) {
      if (fresh.liveWorkedSeconds < halfTarget) {
        return { ok: false, error: 'EMERGENCY_STOP_REQUIRES_HALF_SHIFT' };
      }
      if (!String(reason || '').trim()) {
        return { ok: false, error: 'EMERGENCY_REASON_REQUIRED' };
      }
    } else if (fresh.liveWorkedSeconds < fresh.target_seconds) {
      return { ok: false, error: 'SHIFT_NOT_COMPLETED_USE_EMERGENCY' };
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales_work_sessions
      SET status = 'ended', worked_seconds = ?, ended_at = ?, end_reason = ?, emergency_reason = ?, updated_at = ?
      WHERE id = ?
    `).run(fresh.liveWorkedSeconds, now, emergency ? 'emergency_stop' : 'shift_completed', String(reason || '').trim() || null, now, fresh.id);

    return { ok: true, session: null };
  }

  function startBreak(employeeId) {
    const current = getActiveWorkSession(employeeId);
    if (!current || current.status !== 'online') return { ok: false, error: 'MUST_BE_ONLINE' };
    if (current.remainingBreaks <= 0) return { ok: false, error: 'NO_BREAKS_REMAINING' };

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales_work_sessions
      SET status = 'on_break', worked_seconds = ?, last_heartbeat_at = ?, updated_at = ?
      WHERE id = ?
    `).run(current.liveWorkedSeconds, now, now, current.id);

    const brkId = `SBRK-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_breaks (id, work_session_id, employee_id, started_at, allowed_seconds, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `).run(brkId, current.id, employeeId, now, WORK_SESSION_RULES.BREAK_ALLOWED_SECONDS);

    return { ok: true, session: getActiveWorkSession(employeeId) };
  }

  function endBreak(employeeId) {
    const current = getActiveWorkSession(employeeId);
    if (!current || !current.activeBreak) return { ok: false, error: 'NO_ACTIVE_BREAK' };

    const now = new Date().toISOString();
    const brk = current.activeBreak;
    const duration = Math.max(0, Math.floor((Date.now() - Date.parse(brk.started_at)) / 1000));
    const overtime = Math.max(0, duration - brk.allowed_seconds);

    db.prepare(`
      UPDATE sales_breaks
      SET ended_at = ?, duration_seconds = ?, overtime_seconds = ?, status = 'completed'
      WHERE id = ?
    `).run(now, duration, overtime, brk.id);

    db.prepare(`
      UPDATE sales_work_sessions
      SET status = 'online', last_heartbeat_at = ?, updated_at = ?
      WHERE id = ?
    `).run(now, now, current.id);

    return { ok: true, session: getActiveWorkSession(employeeId) };
  }

  function awardPointsIdempotent(employeeId, eventKey, ruleKey) {
    const rule = POINTS_RULES[ruleKey];
    if (!rule) return;
    const now = new Date().toISOString();
    const id = `PTS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT OR IGNORE INTO sales_points_ledger (id, employee_id, event_key, points, reason_ar, reason_en, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, employeeId, eventKey, rule.points, rule.label_ar, rule.label_en, now);

    // Unlock milestone badges if threshold met
    const totalRow = db.prepare('SELECT COALESCE(SUM(points), 0) AS total FROM sales_points_ledger WHERE employee_id = ?').get(employeeId);
    const totalPts = totalRow ? totalRow.total : 0;
    const eligible = db.prepare('SELECT id FROM sales_badges WHERE threshold_points <= ?').all(totalPts);
    const insBadge = db.prepare('INSERT OR IGNORE INTO sales_employee_badges (id, employee_id, badge_id, earned_at) VALUES (?, ?, ?, ?)');
    for (const b of eligible) {
      insBadge.run(`EB-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, employeeId, b.id, now);
    }
  }

  function recordCall(employeeId, { customerId, direction, startedAt, endedAt, durationSeconds, outcome, outcomeOtherNote, notes, nextStatus, cancelReason, cancelOtherNote }) {
    const cleanNotes = String(notes || '').trim();
    if (!cleanNotes) throw new Error('CALL_COMMENT_REQUIRED');
    const cleanDir = direction === 'inbound' ? 'inbound' : 'outbound';
    let cleanDur = Math.max(0, parseInt(durationSeconds, 10) || 0);
    if (startedAt && endedAt) {
      const ms = Date.parse(endedAt) - Date.parse(startedAt);
      if (!isNaN(ms) && ms >= 0) cleanDur = Math.max(1, Math.round(ms / 1000));
    }
    const now = new Date().toISOString();
    const callId = `CAL-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    db.prepare(`
      INSERT INTO sales_calls (id, employee_id, customer_id, direction, duration_seconds, outcome, outcome_other_note, notes, started_at, ended_at, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(callId, employeeId, customerId || null, cleanDir, cleanDur, outcome || 'answered', outcomeOtherNote || null, cleanNotes, startedAt || now, endedAt || now, now);

    if (customerId) {
      db.prepare(`
        INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
        VALUES (?, ?, ?, 'call_logged', NULL, ?, ?, ?, ?)
      `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, customerId, employeeId, outcome || 'answered', outcomeOtherNote || null, cleanNotes, now);

      if (nextStatus === 'cancelled' && cancelReason) {
        cancelCustomer(employeeId, customerId, { reason: cancelReason, otherNote: cancelOtherNote || cleanNotes });
      } else if (nextStatus && ['fresh_lead', 'contacted', 'follow_up'].includes(nextStatus)) {
        updateCustomerStage(employeeId, customerId, nextStatus, cleanNotes);
      }
    }

    const ruleKey = cleanDir === 'inbound' ? 'inbound_call' : 'outbound_call';
    awardPointsIdempotent(employeeId, `call:${callId}`, ruleKey);

    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'call_logged', 'employee', ?, ?, ?, 0, ?)
    `).run(
      `ACT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      employeeId,
      cleanDir === 'inbound' ? `تسجيل مكالمة واردة (${cleanDur} ث)` : `تسجيل مكالمة صادرة (${cleanDur} ث)`,
      cleanDir === 'inbound' ? `Logged inbound call (${cleanDur}s)` : `Logged outbound call (${cleanDur}s)`,
      callId,
      now
    );

    return { id: callId, direction: cleanDir, durationSeconds: cleanDur, startedAt: startedAt || now, endedAt: endedAt || now, createdAt: now };
  }

  function scheduleFollowup(employeeId, { customerId, dueAt, priority, purpose, notes, undated = false, rescheduleFromId = '', recurrenceRule = '' }) {
    const now = new Date().toISOString();
    const fupId = `FUP-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const cleanCust = customerId || 'CUS-D-105';
    const isUndated = Boolean(undated) || !dueAt;
    const status = isUndated ? 'undated' : 'scheduled';
    const cleanDue = isUndated ? '' : dueAt;

    // Server-side Duplicate Appointment Check (Section 15.1):
    // Prevent two active follow-ups for the same customer at the exact same minute.
    if (!isUndated && cleanDue) {
      const minuteKey = cleanDue.slice(0, 16);
      const dup = db.prepare(`
        SELECT id FROM sales_followups
        WHERE employee_id = ? AND customer_id = ? AND status NOT IN ('completed', 'cancelled', 'rescheduled')
          AND substr(due_at, 1, 16) = ? AND id != ?
      `).get(employeeId, cleanCust, minuteKey, rescheduleFromId || '');
      if (dup) {
        const err = new Error('DUPLICATE_FOLLOWUP_SAME_TIME');
        err.statusCode = 409;
        throw err;
      }
    }

    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };

    if (rescheduleFromId) {
      const prev = db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(rescheduleFromId, employeeId);
      if (prev) {
        db.prepare(`UPDATE sales_followups SET status = 'rescheduled', updated_at = ? WHERE id = ?`).run(now, rescheduleFromId);
        db.prepare(`
          INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
          VALUES (?, ?, ?, 'followup_rescheduled', ?, ?, 'rescheduled', ?, ?)
        `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, cleanCust, employeeId, prev.due_at || 'undated', cleanDue || 'undated', String(notes || '').trim(), now);
        db.prepare(`
          INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at)
          VALUES (?, ?, ?, ?, 'rescheduled', ?, ?, 'rescheduled', ?, ?, ?, ?)
        `).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, rescheduleFromId, cleanCust, employeeId, prev.due_at || 'undated', cleanDue || 'undated', String(notes || '').trim(), emp.name_ar, emp.name_en, now);
      }
    }

    db.prepare(`
      INSERT INTO sales_followups (id, employee_id, customer_id, due_at, status, priority, system_priority, purpose, notes, rescheduled_from_id, recurrence_rule, is_demo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(fupId, employeeId, cleanCust, cleanDue, status, priority || 'normal', priority || 'normal', String(purpose || '').trim() || null, String(notes || '').trim(), rescheduleFromId || null, recurrenceRule || null, now, now);

    db.prepare(`
      INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at)
      VALUES (?, ?, ?, ?, 'created', NULL, ?, ?, ?, ?, ?, ?)
    `).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, fupId, cleanCust, employeeId, cleanDue || 'undated', purpose || null, String(notes || '').trim(), emp.name_ar, emp.name_en, now);

    db.prepare(`
      INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
      VALUES (?, ?, ?, 'followup_scheduled', NULL, ?, ?, ?, ?)
    `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, cleanCust, employeeId, cleanDue || 'undated', purpose || null, String(notes || '').trim(), now);

    awardPointsIdempotent(employeeId, `fup:${fupId}`, 'followup_scheduled');

    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'followup_scheduled', 'employee', 'تمت جدولة متابعة عميل جديدة', 'Scheduled new customer follow-up', ?, 0, ?)
    `).run(`ACT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, employeeId, fupId, now);

    return { id: fupId, customerId: cleanCust, dueAt: cleanDue, priority: priority || 'normal', purpose: purpose || '', status };
  }

  function processOverdueFollowup(employeeId, followupId, delayReason) {
    const cleanReason = String(delayReason || '').trim();
    if (!cleanReason) throw new Error('DELAY_REASON_REQUIRED');
    const existing = db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(followupId, employeeId);
    if (!existing) throw new Error('FOLLOWUP_NOT_FOUND');
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const now = new Date().toISOString();
    db.prepare(`UPDATE sales_followups SET status = 'undated', due_at = '', delay_reason = ?, updated_at = ? WHERE id = ?`).run(cleanReason, now, followupId);
    db.prepare(`UPDATE sales_customers SET stage = 'follow_up', updated_at = ? WHERE id = ? AND owner_employee_id = ?`).run(now, existing.customer_id, employeeId);
    db.prepare(`
      INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at)
      VALUES (?, ?, ?, ?, 'overdue_processed', ?, 'undated', ?, ?, ?, ?, ?)
    `).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, followupId, existing.customer_id, employeeId, existing.due_at || 'overdue', cleanReason, existing.notes || '', emp.name_ar, emp.name_en, now);
    db.prepare(`
      INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
      VALUES (?, ?, ?, 'overdue_processed', ?, 'follow_without_due', ?, ?, ?)
    `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, existing.customer_id, employeeId, existing.due_at || 'overdue', cleanReason, existing.notes || '', now);
    return db.prepare('SELECT * FROM sales_followups WHERE id = ?').get(followupId);
  }

  function getPeriodWindow(period, customFrom, customTo) {
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    let from = startOfDay(now);
    let to = now;

    if (period === 'yesterday') {
      from = new Date(startOfDay(now).getTime() - 86400000);
      to = new Date(startOfDay(now).getTime() - 1);
    } else if (period === 'last7') {
      from = new Date(startOfDay(now).getTime() - 6 * 86400000);
    } else if (period === 'last30') {
      from = new Date(startOfDay(now).getTime() - 29 * 86400000);
    } else if (period === 'week') {
      const day = now.getDay();
      from = new Date(startOfDay(now).getTime() - day * 86400000);
    } else if (period === 'prev_week') {
      const day = now.getDay();
      const thisWeekStart = new Date(startOfDay(now).getTime() - day * 86400000);
      from = new Date(thisWeekStart.getTime() - 7 * 86400000);
      to = new Date(thisWeekStart.getTime() - 1);
    } else if (period === 'month') {
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (period === 'prev_month') {
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === 'year') {
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    } else if (period === 'custom' && customFrom && customTo) {
      const f = new Date(customFrom);
      const t = new Date(customTo + 'T23:59:59');
      if (!isNaN(f.getTime()) && !isNaN(t.getTime())) {
        from = f;
        to = t;
      }
    }
    return { fromIso: from.toISOString(), toIso: to.toISOString() };
  }

  function parseCsv(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(x => String(x).trim()).filter(Boolean);
    return String(val).split(',').map(x => x.trim()).filter(Boolean);
  }

  function getDashboardData(employee, filters = {}) {
    seedSalesDemoDataIfEmpty(employee.id);
    const period = filters.period || 'month';
    const { fromIso, toIso } = getPeriodWindow(period, filters.from || '', filters.to || '');

    const rawCustomers = db.prepare('SELECT * FROM sales_customers WHERE owner_employee_id = ?').all(employee.id);
    const rawCalls = db.prepare('SELECT * FROM sales_calls WHERE employee_id = ?').all(employee.id);
    const allFollowups = db.prepare(`
      SELECT f.*, c.name_ar AS customer_name_ar, c.name_en AS customer_name_en
      FROM sales_followups f
      LEFT JOIN sales_customers c ON c.id = f.customer_id
      WHERE f.employee_id = ?
      ORDER BY f.due_at ASC
    `).all(employee.id);

    const progById = new Map(PROGRAMS_CATALOG.map(p => [p.id, p]));
    const compByNameAr = new Map(COMPANIES_CATALOG.map(c => [c.name_ar, c.id]));
    const compByNameEn = new Map(COMPANIES_CATALOG.map(c => [c.name_en, c.id]));

    const q = String(filters.q || '').trim().toLowerCase();
    const stages = parseCsv(filters.stages);
    const govs = parseCsv(filters.govs);
    const fltSources = parseCsv(filters.sources);
    const companyIds = parseCsv(filters.companyIds);
    const programIds = parseCsv(filters.programIds);
    const category = filters.category || 'all';
    const contactState = filters.contactState || 'all';
    const followupState = filters.followupState || 'all';
    const referrer = String(filters.referrer || '').trim().toLowerCase();
    const bookingState = filters.bookingState || 'all';
    const contractState = filters.contractState || 'all';
    const callDir = filters.callDir || 'all';
    const callOutcome = filters.callOutcome || 'all';
    const callDuration = filters.callDuration || 'all';

    const callsByCust = new Map();
    for (const cal of rawCalls) {
      if (!cal.customer_id) continue;
      if (!callsByCust.has(cal.customer_id)) callsByCust.set(cal.customer_id, []);
      callsByCust.get(cal.customer_id).push(cal);
    }
    const fupsByCust = new Map();
    const nowIso = new Date().toISOString();
    for (const f of allFollowups) {
      if (!fupsByCust.has(f.customer_id)) fupsByCust.set(f.customer_id, []);
      fupsByCust.get(f.customer_id).push(f);
    }

    const hasNonDateFilters = Boolean(
      q || stages.length || govs.length || fltSources.length || companyIds.length || programIds.length ||
      category !== 'all' || contactState !== 'all' || followupState !== 'all' || referrer ||
      bookingState !== 'all' || contractState !== 'all' || callDir !== 'all' || callOutcome !== 'all' || callDuration !== 'all'
    );

    const matchesCallFilter = (cal) => {
      if (callDir !== 'all' && cal.direction !== callDir) return false;
      if (callOutcome !== 'all' && cal.outcome !== callOutcome) return false;
      if (callDuration === 'short' && (cal.duration_seconds || 0) >= 180) return false;
      if (callDuration === 'medium' && ((cal.duration_seconds || 0) < 180 || (cal.duration_seconds || 0) > 360)) return false;
      if (callDuration === 'long' && (cal.duration_seconds || 0) <= 360) return false;
      return true;
    };

    const allCustomers = rawCustomers.filter((c) => {
      const prog = progById.get(c.program_id) || null;
      const cid = prog ? prog.company_id : (compByNameAr.get(c.company_name_ar) || compByNameEn.get(c.company_name_en) || '');
      if (q) {
        const hay = `${c.name_ar} ${c.name_en} ${c.phone} ${c.referrer_name || ''} ${prog ? prog.title_ar + ' ' + prog.title_en : ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stages.length && !stages.includes(c.stage)) return false;
      if (govs.length && !govs.includes(c.governorate)) return false;
      if (fltSources.length && !fltSources.includes(c.source)) return false;
      if (companyIds.length && !companyIds.includes(cid)) return false;
      if (programIds.length && !programIds.includes(c.program_id)) return false;
      if (category !== 'all' && (!prog || prog.category !== category)) return false;
      if (referrer && !String(c.referrer_name || '').toLowerCase().includes(referrer)) return false;
      if (bookingState === 'completed' && c.booking_completed !== 1) return false;
      if (bookingState === 'not_booked' && c.booking_completed === 1) return false;
      if (contractState === 'completed' && !(c.contract_signed === 1 && c.payment_confirmed === 1)) return false;
      if (contractState === 'pending_payment' && !(c.booking_completed === 1 && c.payment_confirmed === 0)) return false;
      if (contractState === 'pending_contract' && !(c.booking_completed === 1 && c.contract_signed === 0)) return false;

      const cCalls = callsByCust.get(c.id) || [];
      if (contactState === 'contacted' && cCalls.length === 0) return false;
      if (contactState === 'not_contacted' && cCalls.length > 0) return false;
      if ((callDir !== 'all' || callOutcome !== 'all' || callDuration !== 'all') && !cCalls.some(matchesCallFilter)) return false;

      const cFups = (fupsByCust.get(c.id) || []).filter(f => f.status !== 'completed');
      if (followupState === 'has_followup' && cFups.length === 0) return false;
      if (followupState === 'with_due_date' && !cFups.some(f => Boolean(f.due_at))) return false;
      if (followupState === 'without_due_date' && !cFups.some(f => !f.due_at || f.status === 'undated')) return false;
      if (followupState === 'overdue' && !cFups.some(f => f.status === 'overdue' || (f.due_at && f.due_at < nowIso))) return false;
      return true;
    });

    const filteredCustIds = new Set(allCustomers.map(c => c.id));
    const periodCustomers = allCustomers.filter(c => c.created_at >= fromIso && c.created_at <= toIso);
    const periodCalls = rawCalls.filter(cal =>
      cal.created_at >= fromIso && cal.created_at <= toIso &&
      matchesCallFilter(cal) &&
      (!hasNonDateFilters || !cal.customer_id || filteredCustIds.has(cal.customer_id))
    );

    const assignedCount = allCustomers.length;
    const freshLeadsCount = periodCustomers.filter(c => c.stage === 'fresh_lead').length;
    const contactedCustomerIds = new Set(periodCalls.map(c => c.customer_id).filter(Boolean));
    const contactedCount = contactedCustomerIds.size;
    const outboundCalls = periodCalls.filter(c => c.direction === 'outbound').length;
    const inboundCalls = periodCalls.filter(c => c.direction === 'inbound').length;
    const totalCallDurationSec = periodCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);

    const activeFollowups = allFollowups.filter(f => f.status !== 'completed' && (!hasNonDateFilters || filteredCustIds.has(f.customer_id)));
    const overdueFollowups = activeFollowups.filter(f => f.status === 'overdue' || (f.due_at && f.due_at < nowIso));
    const undatedFollowups = activeFollowups.filter(f => !f.due_at || f.status === 'undated');

    const completedBookings = periodCustomers.filter(c => c.booking_completed === 1).length;
    // Contract is completed ONLY when BOTH contract_signed === 1 AND payment_confirmed === 1
    const completedContracts = periodCustomers.filter(c => c.contract_signed === 1 && c.payment_confirmed === 1).length;

    const totalContractValueEgp = periodCustomers.reduce((s, c) => s + (c.total_amount_egp || 0), 0);
    const totalPaidEgp = periodCustomers.reduce((s, c) => s + (c.paid_amount_egp || 0), 0);
    const paymentProgressPct = totalContractValueEgp > 0 ? Math.min(100, Math.round((totalPaidEgp / totalContractValueEgp) * 1000) / 10) : 0;

    const computeWindowAchieved = (winPeriod) => {
      const w = getPeriodWindow(winPeriod);
      const wCusts = allCustomers.filter(c => c.created_at >= w.fromIso && c.created_at <= w.toIso);
      const wCalls = rawCalls.filter(c => c.created_at >= w.fromIso && c.created_at <= w.toIso && (!hasNonDateFilters || filteredCustIds.has(c.customer_id)));
      const wContacted = new Set(wCalls.map(c => c.customer_id).filter(Boolean)).size;
      const wBooked = wCusts.filter(c => c.booking_completed === 1).length;
      const wContracts = wCusts.filter(c => c.contract_signed === 1 && c.payment_confirmed === 1).length;
      return wContacted + wBooked + wContracts;
    };

    const dailyAchieved = computeWindowAchieved('today');
    const weeklyAchieved = computeWindowAchieved('week');
    const monthlyAchieved = computeWindowAchieved('month');
    const targetBreakdown = {
      daily: { target: employee.daily_target, achieved: dailyAchieved, pct: employee.daily_target > 0 ? Math.min(100, Math.round((dailyAchieved / employee.daily_target) * 1000) / 10) : 0 },
      weekly: { target: employee.weekly_target, achieved: weeklyAchieved, pct: employee.weekly_target > 0 ? Math.min(100, Math.round((weeklyAchieved / employee.weekly_target) * 1000) / 10) : 0 },
      monthly: { target: employee.monthly_target, achieved: monthlyAchieved, pct: employee.monthly_target > 0 ? Math.min(100, Math.round((monthlyAchieved / employee.monthly_target) * 1000) / 10) : 0 }
    };

    const targetForPeriod = (period === 'week' || period === 'prev_week' || period === 'last7')
      ? employee.weekly_target
      : ((period === 'month' || period === 'prev_month' || period === 'last30' || period === 'year' || period === 'custom') ? employee.monthly_target : employee.daily_target);
    const achievedValue = contactedCount + completedBookings + completedContracts;
    const targetPct = targetForPeriod > 0 ? Math.min(100, Math.round((achievedValue / targetForPeriod) * 1000) / 10) : 0;

    // Previous period comparison (equal duration immediately preceding fromIso)
    const spanMs = Math.max(86400000, Date.parse(toIso) - Date.parse(fromIso));
    const prevFromIso = new Date(Date.parse(fromIso) - spanMs).toISOString();
    const prevToIso = fromIso;
    const prevCustomers = allCustomers.filter(c => c.created_at >= prevFromIso && c.created_at < prevToIso);
    const prevCalls = rawCalls.filter(c => c.created_at >= prevFromIso && c.created_at < prevToIso && matchesCallFilter(c) && (!hasNonDateFilters || filteredCustIds.has(c.customer_id)));
    const prevContacted = new Set(prevCalls.map(c => c.customer_id).filter(Boolean)).size;
    const prevBooked = prevCustomers.filter(c => c.booking_completed === 1).length;
    const prevContracts = prevCustomers.filter(c => c.contract_signed === 1 && c.payment_confirmed === 1).length;
    const prevAchieved = prevContacted + prevBooked + prevContracts;
    const prevKpis = {
      assignedCustomers: Math.max(0, assignedCount - periodCustomers.length),
      freshLeads: prevCustomers.filter(c => c.stage === 'fresh_lead').length,
      customersContacted: prevContacted,
      totalCalls: prevCalls.length,
      completedBookings: prevBooked,
      completedContracts: prevContracts,
      targetAchievementPct: targetForPeriod > 0 ? Math.min(100, Math.round((prevAchieved / targetForPeriod) * 1000) / 10) : 0
    };

    // Multi-series time buckets (6 buckets over the selected window)
    const buckets = [];
    const bucketCount = 6;
    const bucketSpan = Math.max(3600000 * 4, Math.floor((Date.parse(toIso) - Date.parse(fromIso)) / bucketCount));
    for (let i = 0; i < bucketCount; i++) {
      const bStart = Date.parse(fromIso) + i * bucketSpan;
      const bEnd = i === bucketCount - 1 ? Date.parse(toIso) + 1000 : (bStart + bucketSpan);
      const bStartIso = new Date(bStart).toISOString();
      const bEndIso = new Date(bEnd).toISOString();
      const bCust = allCustomers.filter(c => c.created_at >= bStartIso && c.created_at < bEndIso);
      const bCalls = periodCalls.filter(c => c.created_at >= bStartIso && c.created_at < bEndIso);
      const bFups = activeFollowups.filter(f => f.created_at >= bStartIso && f.created_at < bEndIso);
      const dt = new Date(bStart);
      buckets.push({
        label_ar: dt.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
        label_en: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        newCustomers: bCust.length,
        contacted: new Set(bCalls.map(c => c.customer_id).filter(Boolean)).size,
        followups: bFups.length,
        inboundCalls: bCalls.filter(c => c.direction === 'inbound').length,
        outboundCalls: bCalls.filter(c => c.direction === 'outbound').length
      });
    }

    // Mutually exclusive conversion distribution across all assigned customers
    const convContract = allCustomers.filter(c => c.contract_signed === 1 && c.payment_confirmed === 1).length;
    const convBooked = allCustomers.filter(c => c.booking_completed === 1 && !(c.contract_signed === 1 && c.payment_confirmed === 1)).length;
    const convFresh = allCustomers.filter(c => c.booking_completed !== 1 && c.stage === 'fresh_lead').length;
    const convInProgress = Math.max(0, allCustomers.length - convContract - convBooked - convFresh);
    const conversionDistribution = {
      total: allCustomers.length,
      fresh: convFresh,
      inProgress: convInProgress,
      booked: convBooked,
      contractCompleted: convContract
    };

    // Ranked Best Performing Companies & Programs table
    const progMap = new Map(PROGRAMS_CATALOG.map(p => [p.id, p]));
    const progStatsMap = new Map();
    for (const c of allCustomers) {
      const pid = c.program_id || 'PRG-UMR-RAJAB';
      const pObj = progMap.get(pid);
      if (!progStatsMap.has(pid)) {
        progStatsMap.set(pid, {
          program_id: pid,
          program_ar: pObj ? pObj.title_ar : pid,
          program_en: pObj ? pObj.title_en : pid,
          company_ar: c.company_name_ar || '—',
          company_en: c.company_name_en || '—',
          customers: 0,
          booked: 0,
          contracts: 0
        });
      }
      const r = progStatsMap.get(pid);
      r.customers += 1;
      if (c.booking_completed === 1) r.booked += 1;
      if (c.contract_signed === 1 && c.payment_confirmed === 1) r.contracts += 1;
    }
    const topPrograms = Array.from(progStatsMap.values())
      .map(r => ({
        ...r,
        performancePct: r.customers > 0 ? Math.round(((r.booked + r.contracts) / (r.customers * 2)) * 100) : 0
      }))
      .sort((a, b) => (b.contracts - a.contracts) || (b.booked - a.booked) || (b.customers - a.customers))
      .map((r, idx) => ({ ...r, rank: idx + 1 }));

    const referrers = allCustomers
      .filter(c => c.referrer_name)
      .map(c => ({ name: c.referrer_name, customer_ar: c.name_ar, customer_en: c.name_en, completed: c.contract_signed === 1 && c.payment_confirmed === 1 }));

    const bookingContractFunnel = {
      totalCustomers: periodCustomers.length,
      bookedCount: completedBookings,
      contractSignedCount: periodCustomers.filter(c => c.contract_signed === 1).length,
      completedContractsCount: completedContracts,
      totalValueEgp: totalContractValueEgp,
      paidEgp: totalPaidEgp
    };

    const recentInteractions = rawCalls
      .filter(sc => sc.created_at >= fromIso && sc.created_at <= toIso && matchesCallFilter(sc) && (!hasNonDateFilters || !sc.customer_id || filteredCustIds.has(sc.customer_id)))
      .sort((a, b) => (b.created_at > a.created_at ? 1 : -1))
      .slice(0, 6)
      .map(sc => {
        const cust = rawCustomers.find(c => c.id === sc.customer_id);
        return {
          ...sc,
          customer_ar: cust ? cust.name_ar : '—',
          customer_en: cust ? cust.name_en : '—'
        };
      });

    // Fun Corner daily deterministic items + persisted progress
    const todayDate = new Date().toISOString().slice(0, 10);
    const dayIdx = Math.floor(Date.now() / 86400000);
    const dailyRiddle = FUN_CORNER_BANK.riddles[dayIdx % FUN_CORNER_BANK.riddles.length];
    const dailyQuiz = FUN_CORNER_BANK.quizzes[dayIdx % FUN_CORNER_BANK.quizzes.length];
    const dailyChallenge = FUN_CORNER_BANK.miniChallenges[dayIdx % FUN_CORNER_BANK.miniChallenges.length];
    const todayFunRows = db.prepare('SELECT * FROM sales_fun_progress WHERE employee_id = ? AND activity_date = ?').all(employee.id, todayDate);
    const allFunDates = db.prepare('SELECT DISTINCT activity_date FROM sales_fun_progress WHERE employee_id = ? ORDER BY activity_date DESC').all(employee.id).map(r => r.activity_date);
    let streakDays = 0;
    let checkDate = new Date();
    for (let d = 0; d < 30; d++) {
      const iso = checkDate.toISOString().slice(0, 10);
      if (allFunDates.includes(iso)) {
        streakDays += 1;
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else if (d === 0) {
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else {
        break;
      }
    }
    const totalFunCompleted = db.prepare('SELECT COUNT(*) AS cnt FROM sales_fun_progress WHERE employee_id = ?').get(employee.id)?.cnt || 0;

    // Groupings: Sources, Companies/Programs, Geography
    const byKey = (arr, keyFn) => {
      const map = new Map();
      for (const item of arr) {
        const k = keyFn(item);
        if (!map.has(k)) map.set(k, { key: k, total: 0, booked: 0, contracts: 0 });
        const row = map.get(k);
        row.total += 1;
        if (item.booking_completed === 1) row.booked += 1;
        if (item.contract_signed === 1 && item.payment_confirmed === 1) row.contracts += 1;
      }
      return Array.from(map.values());
    };

    const sources = byKey(periodCustomers, c => c.source || 'other');
    const geography = byKey(periodCustomers, c => c.governorate || 'other_gov');
    const companiesMap = new Map();
    for (const c of periodCustomers) {
      const key = c.company_name_en || 'Other';
      if (!companiesMap.has(key)) {
        companiesMap.set(key, {
          company_ar: c.company_name_ar || key,
          company_en: c.company_name_en || key,
          total: 0,
          booked: 0,
          contracts: 0
        });
      }
      const row = companiesMap.get(key);
      row.total += 1;
      if (c.booking_completed === 1) row.booked += 1;
      if (c.contract_signed === 1 && c.payment_confirmed === 1) row.contracts += 1;
    }

    // Points & Badges
    const ptsRow = db.prepare('SELECT COALESCE(SUM(points), 0) AS total FROM sales_points_ledger WHERE employee_id = ?').get(employee.id);
    const pointsBalance = ptsRow ? ptsRow.total : 0;
    const allBadges = db.prepare('SELECT * FROM sales_badges ORDER BY threshold_points ASC').all();
    const earnedBadges = db.prepare(`
      SELECT b.*, eb.earned_at FROM sales_employee_badges eb
      JOIN sales_badges b ON b.id = eb.badge_id
      WHERE eb.employee_id = ?
      ORDER BY eb.earned_at DESC
    `).all(employee.id);
    const earnedIds = new Set(earnedBadges.map(b => b.id));
    const nextBadge = allBadges.find(b => !earnedIds.has(b.id)) || null;

    // Anonymous Commercial Leaderboard (Provisional Demo Comparison + Current Employee Score)
    const ownScore = Math.round(
      (completedContracts * LEADERBOARD_WEIGHTS.completedContractWeight) +
      (completedBookings * LEADERBOARD_WEIGHTS.completedBookingWeight) +
      (targetPct * LEADERBOARD_WEIGHTS.targetAchievementPctWeight)
    );
    const peerBenchmarks = [
      { code: 'AGT-104', contracts: 9, bookings: 14, targetPct: 92.0 },
      { code: 'AGT-219', contracts: 8, bookings: 12, targetPct: 88.5 },
      { code: 'AGT-118', contracts: 7, bookings: 11, targetPct: 85.0 },
      { code: 'AGT-305', contracts: 6, bookings: 10, targetPct: 80.0 },
      { code: 'AGT-142', contracts: 5, bookings: 9, targetPct: 76.5 },
      { code: 'AGT-267', contracts: 5, bookings: 8, targetPct: 72.0 },
      { code: 'AGT-188', contracts: 4, bookings: 7, targetPct: 68.0 },
      { code: 'AGT-311', contracts: 3, bookings: 6, targetPct: 62.5 },
      { code: 'AGT-290', contracts: 2, bookings: 4, targetPct: 54.0 },
      { code: 'AGT-334', contracts: 1, bookings: 2, targetPct: 40.0 }
    ].map(p => ({
      ...p,
      isCurrent: false,
      score: Math.round((p.contracts * LEADERBOARD_WEIGHTS.completedContractWeight) + (p.bookings * LEADERBOARD_WEIGHTS.completedBookingWeight) + (p.targetPct * LEADERBOARD_WEIGHTS.targetAchievementPctWeight))
    }));

    const combinedBoard = [
      ...peerBenchmarks,
      { code: 'YOU', isCurrent: true, contracts: completedContracts, bookings: completedBookings, targetPct, score: ownScore }
    ].sort((a, b) => b.score - a.score).map((row, idx) => ({ ...row, rank: idx + 1 }));

    const myEntry = combinedBoard.find(r => r.isCurrent);

    const notifications = db.prepare(`
      SELECT * FROM sales_notifications
      WHERE employee_id = ? AND is_deleted = 0
      ORDER BY created_at DESC LIMIT 6
    `).all(employee.id);
    const unreadNotifs = db.prepare(`
      SELECT COUNT(*) AS cnt FROM sales_notifications
      WHERE employee_id = ? AND is_deleted = 0 AND is_read = 0
    `).get(employee.id);

    const activity = db.prepare(`
      SELECT * FROM sales_activity_log
      WHERE employee_id = ?
      ORDER BY created_at DESC LIMIT 8
    `).all(employee.id);

    return {
      employee: {
        id: employee.id,
        code: employee.employee_code,
        name_ar: employee.name_ar,
        name_en: employee.name_en,
        role_title_ar: employee.role_title_ar,
        role_title_en: employee.role_title_en
      },
      workSession: getActiveWorkSession(employee.id),
      period,
      kpis: {
        assignedCustomers: assignedCount,
        freshLeads: freshLeadsCount,
        customersContacted: contactedCount,
        outboundCalls,
        inboundCalls,
        totalCallDurationSeconds: totalCallDurationSec,
        followupCustomers: activeFollowups.length,
        overdueFollowups: overdueFollowups.length,
        undatedFollowups: undatedFollowups.length,
        completedBookings,
        completedContracts,
        totalContractValueEgp,
        totalPaidEgp,
        paymentProgressPct,
        targetValue: targetForPeriod,
        achievedValue,
        remainingValue: Math.max(0, targetForPeriod - achievedValue),
        targetAchievementPct: targetPct
      },
      targetBreakdown,
      prevKpis,
      salesScripts: SALES_SCRIPTS,
      filterCatalog: {
        companies: COMPANIES_CATALOG,
        programs: PROGRAMS_CATALOG,
        referrers: Array.from(new Set(rawCustomers.map(c => c.referrer_name).filter(Boolean)))
      },
      analytics: {
        sources,
        geography,
        companies: Array.from(companiesMap.values()),
        trends: buckets,
        conversionDistribution,
        topPrograms,
        referrers,
        bookingContractFunnel
      },
      recentInteractions,
      funCorner: {
        date: todayDate,
        riddle: dailyRiddle,
        quiz: dailyQuiz,
        challenge: dailyChallenge,
        completedToday: todayFunRows,
        streakDays,
        totalCompleted: totalFunCompleted
      },
      followupsPreview: activeFollowups.slice(0, 8),
      customersOptions: allCustomers.map(c => ({ id: c.id, name_ar: c.name_ar, name_en: c.name_en })),
      leaderboard: {
        top10: combinedBoard.slice(0, 10),
        myRank: myEntry,
        weights: LEADERBOARD_WEIGHTS
      },
      gamification: {
        pointsBalance,
        earnedBadges,
        allBadges,
        nextBadge
      },
      notifications: {
        items: notifications,
        unreadCount: unreadNotifs ? unreadNotifs.cnt : 0
      },
      activity,
      dataNotice: {
        hasDemoRecords: allCustomers.some(c => c.is_demo === 1),
        message_ar: 'يتم عرض مؤشرات التشغيل من قاعدة البيانات مع سجلات تجريبية مبدئية محددة بوضوح حتى ربط بيانات العملاء الفعلية.',
        message_en: 'Metrics are persisted in SQLite with clearly labeled initial demo CRM records until live customer pipelines are connected.'
      }
    };
  }

  function getNotifications(employeeId) {
    return db.prepare('SELECT * FROM sales_notifications WHERE employee_id = ? AND is_deleted = 0 ORDER BY created_at DESC').all(employeeId);
  }

  function markNotificationRead(employeeId, notifId) {
    db.prepare('UPDATE sales_notifications SET is_read = 1 WHERE id = ? AND employee_id = ?').run(notifId, employeeId);
  }

  function deleteNotification(employeeId, notifId) {
    db.prepare('UPDATE sales_notifications SET is_deleted = 1 WHERE id = ? AND employee_id = ?').run(notifId, employeeId);
  }

  function getActivity(employeeId) {
    return db.prepare('SELECT * FROM sales_activity_log WHERE employee_id = ? ORDER BY created_at DESC LIMIT 50').all(employeeId);
  }

  function computeCustomerGroup(c, custFollowups, nowIso) {
    if (c.stage === 'cancelled' || c.cancellation_reason) return 'cancelled';
    if (c.stage === 'fresh_lead' && !custFollowups.some(f => f.status !== 'completed')) return 'fresh_lead';
    const hasDue = custFollowups.some(f => f.status !== 'completed' && f.status !== 'rescheduled' && Boolean(f.due_at));
    if (hasDue) return 'follow_with_due';
    return 'follow_without_due';
  }

  function getCustomers(employeeId, filters = {}) {
    seedSalesDemoDataIfEmpty(employeeId);
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const rawCustomers = db.prepare('SELECT * FROM sales_customers WHERE owner_employee_id = ?').all(employeeId);
    const rawCalls = db.prepare('SELECT * FROM sales_calls WHERE employee_id = ? ORDER BY created_at DESC').all(employeeId);
    const rawFups = db.prepare('SELECT * FROM sales_followups WHERE employee_id = ? ORDER BY due_at ASC').all(employeeId);

    const progMap = new Map(PROGRAMS_CATALOG.map(p => [p.id, p]));
    const compByNameAr = new Map(COMPANIES_CATALOG.map(c => [c.name_ar, c.id]));
    const compByNameEn = new Map(COMPANIES_CATALOG.map(c => [c.name_en, c.id]));
    const nowIso = new Date().toISOString();

    const callsByCust = new Map();
    for (const cal of rawCalls) {
      if (!cal.customer_id) continue;
      if (!callsByCust.has(cal.customer_id)) callsByCust.set(cal.customer_id, []);
      callsByCust.get(cal.customer_id).push(cal);
    }
    const fupsByCust = new Map();
    for (const f of rawFups) {
      if (!fupsByCust.has(f.customer_id)) fupsByCust.set(f.customer_id, []);
      fupsByCust.get(f.customer_id).push(f);
    }

    const enriched = rawCustomers.map(c => {
      const p = progMap.get(c.program_id) || null;
      const cid = p ? p.company_id : (compByNameAr.get(c.company_name_ar) || compByNameEn.get(c.company_name_en) || '');
      const cCalls = callsByCust.get(c.id) || [];
      const cFups = fupsByCust.get(c.id) || [];
      const activeFups = cFups.filter(f => f.status !== 'completed' && f.status !== 'rescheduled');
      const nextFup = activeFups.find(f => Boolean(f.due_at)) || activeFups[0] || null;
      const lastCall = cCalls[0] || null;
      const group = computeCustomerGroup(c, activeFups, nowIso);
      const hasOverdue = activeFups.some(f => f.status === 'overdue' || (f.due_at && f.due_at < nowIso));

      return {
        ...c,
        whatsapp: c.whatsapp || c.phone,
        company_id: cid,
        program_title_ar: p ? p.title_ar : (c.program_id || '—'),
        program_title_en: p ? p.title_en : (c.program_id || '—'),
        assigned_employee_ar: emp.name_ar,
        assigned_employee_en: emp.name_en,
        call_count: cCalls.length,
        last_call_at: lastCall ? lastCall.created_at : null,
        last_call_direction: lastCall ? lastCall.direction : null,
        last_call_outcome: lastCall ? lastCall.outcome : null,
        next_followup_at: nextFup ? nextFup.due_at : null,
        next_followup_id: nextFup ? nextFup.id : null,
        has_overdue: hasOverdue,
        open_followups: activeFups.length,
        customer_group: group
      };
    });

    const groupCounts = {
      fresh_lead: enriched.filter(r => r.customer_group === 'fresh_lead').length,
      follow_with_due: enriched.filter(r => r.customer_group === 'follow_with_due').length,
      follow_without_due: enriched.filter(r => r.customer_group === 'follow_without_due').length,
      cancelled: enriched.filter(r => r.customer_group === 'cancelled').length
    };
    const cancellationCounts = {
      low_budget: enriched.filter(r => r.customer_group === 'cancelled' && r.cancellation_reason === 'low_budget').length,
      not_interested: enriched.filter(r => r.customer_group === 'cancelled' && r.cancellation_reason === 'not_interested').length,
      not_registered_campaign: enriched.filter(r => r.customer_group === 'cancelled' && r.cancellation_reason === 'not_registered_campaign').length,
      inappropriate_behavior: enriched.filter(r => r.customer_group === 'cancelled' && r.cancellation_reason === 'inappropriate_behavior').length,
      other: enriched.filter(r => r.customer_group === 'cancelled' && r.cancellation_reason === 'other').length
    };

    const q = String(filters.q || '').trim().toLowerCase();
    const group = filters.group || '';
    const stage = filters.stage || '';
    const cancelReason = filters.cancelReason || '';
    const govs = parseCsv(filters.govs || filters.gov);
    const sources = parseCsv(filters.sources || filters.source);
    const companyIds = parseCsv(filters.companyIds);
    const programIds = parseCsv(filters.programIds);
    const contactState = filters.contactState || '';
    const followupState = filters.followupState || '';
    const callDir = filters.callDir || '';
    const callOutcome = filters.callOutcome || '';
    const referrer = String(filters.referrer || '').trim().toLowerCase();

    let rows = enriched.filter(r => {
      if (q) {
        const hay = `${r.name_ar} ${r.name_en} ${r.phone} ${r.whatsapp || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (group && r.customer_group !== group) return false;
      if (stage) {
        if (stage === 'booked') { if (r.booking_completed !== 1) return false; }
        else if (stage === 'contract_completed') { if (!(r.contract_signed === 1 && r.payment_confirmed === 1)) return false; }
        else if (['fresh_lead', 'follow_with_due', 'follow_without_due', 'cancelled'].includes(stage)) {
          if (r.customer_group !== stage && r.stage !== stage) return false;
        } else if (r.stage !== stage) return false;
      }
      if (cancelReason && r.cancellation_reason !== cancelReason) return false;
      if (govs.length && !govs.includes(r.governorate)) return false;
      if (sources.length && !sources.includes(r.source)) return false;
      if (companyIds.length && !companyIds.includes(r.company_id)) return false;
      if (programIds.length && !programIds.includes(r.program_id)) return false;
      if (referrer && !String(r.referrer_name || '').toLowerCase().includes(referrer)) return false;
      if (contactState === 'contacted' && r.call_count === 0) return false;
      if (contactState === 'not_contacted' && r.call_count > 0) return false;
      if (followupState === 'with_due_date' && !r.next_followup_at) return false;
      if (followupState === 'without_due_date' && (r.next_followup_at || r.open_followups === 0)) return false;
      if (followupState === 'overdue' && !r.has_overdue) return false;
      if (callDir && r.last_call_direction !== callDir) return false;
      if (callOutcome && r.last_call_outcome !== callOutcome) return false;
      if (filters.createdFrom && r.created_at < filters.createdFrom) return false;
      if (filters.createdTo && r.created_at > filters.createdTo + 'T23:59:59') return false;
      return true;
    });

    const sortBy = filters.sort || 'fresh_first';
    rows.sort((a, b) => {
      if (sortBy === 'newest') return b.created_at.localeCompare(a.created_at);
      if (sortBy === 'oldest') return a.created_at.localeCompare(b.created_at);
      if (sortBy === 'overdue_first') return (b.has_overdue ? 1 : 0) - (a.has_overdue ? 1 : 0);
      if (sortBy === 'nearest_fup') {
        if (!a.next_followup_at && !b.next_followup_at) return 0;
        if (!a.next_followup_at) return 1;
        if (!b.next_followup_at) return -1;
        return a.next_followup_at.localeCompare(b.next_followup_at);
      }
      if (sortBy === 'recent_contact') return (b.last_call_at || '').localeCompare(a.last_call_at || '');
      if (sortBy === 'least_recent_contact') return (a.last_call_at || '9999').localeCompare(b.last_call_at || '9999');
      if (sortBy === 'recent_activity') return b.updated_at.localeCompare(a.updated_at);
      // Default: fresh_first
      const af = a.customer_group === 'fresh_lead' ? 0 : 1;
      const bf = b.customer_group === 'fresh_lead' ? 0 : 1;
      if (af !== bf) return af - bf;
      return b.updated_at.localeCompare(a.updated_at);
    });

    return {
      items: rows,
      totalGlobal: enriched.length,
      groupCounts,
      cancellationCounts,
      filterCatalog: {
        companies: COMPANIES_CATALOG,
        programs: PROGRAMS_CATALOG,
        referrers: Array.from(new Set(rawCustomers.map(c => c.referrer_name).filter(Boolean)))
      }
    };
  }

  function getCustomerDetails(employeeId, customerId) {
    seedSalesDemoDataIfEmpty(employeeId);
    const res = getCustomers(employeeId, {});
    const customer = res.items.find(c => c.id === customerId);
    if (!customer) throw new Error('CUSTOMER_NOT_FOUND');
    const calls = db.prepare('SELECT * FROM sales_calls WHERE customer_id = ? AND employee_id = ? ORDER BY created_at DESC').all(customerId, employeeId);
    const followups = db.prepare('SELECT * FROM sales_followups WHERE customer_id = ? AND employee_id = ? ORDER BY created_at DESC').all(customerId, employeeId);
    const history = db.prepare('SELECT * FROM sales_customer_history WHERE customer_id = ? ORDER BY created_at DESC').all(customerId);
    const comments = db.prepare('SELECT * FROM sales_customer_comments WHERE customer_id = ? ORDER BY created_at DESC').all(customerId);
    const program = PROGRAMS_CATALOG.find(p => p.id === customer.program_id) || null;
    return { customer, calls, followups, history, comments, program };
  }

  function addCustomerComment(employee, customerId, comment) {
    const clean = String(comment || '').trim();
    if (!clean) throw new Error('COMMENT_REQUIRED');
    const cust = db.prepare('SELECT * FROM sales_customers WHERE id = ? AND owner_employee_id = ?').get(customerId, employee.id);
    if (!cust) throw new Error('CUSTOMER_NOT_FOUND');
    const now = new Date().toISOString();
    const id = `CMT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_customer_comments (id, customer_id, employee_id, author_name_ar, author_name_en, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, customerId, employee.id, employee.name_ar, employee.name_en, clean, now);
    db.prepare(`
      INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
      VALUES (?, ?, ?, 'comment_added', NULL, NULL, NULL, ?, ?)
    `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, customerId, employee.id, clean, now);
    return db.prepare('SELECT * FROM sales_customer_comments WHERE id = ?').get(id);
  }

  function editCustomerInfo(employeeId, customerId, payload) {
    const existing = db.prepare('SELECT * FROM sales_customers WHERE id = ? AND owner_employee_id = ?').get(customerId, employeeId);
    if (!existing) throw new Error('CUSTOMER_NOT_FOUND');
    const nameAr = String(payload.nameAr || existing.name_ar).trim();
    const nameEn = String(payload.nameEn || payload.nameAr || existing.name_en).trim();
    const phone = normalizePhone(payload.phone || existing.phone);
    const whatsapp = normalizePhone(payload.whatsapp || phone);
    const governorate = payload.governorate || existing.governorate;
    const source = payload.source || existing.source;
    const referrerName = payload.referrerName !== undefined ? (String(payload.referrerName || '').trim() || null) : existing.referrer_name;
    const prog = PROGRAMS_CATALOG.find(p => p.id === (payload.programId || existing.program_id)) || PROGRAMS_CATALOG[0];
    const comp = COMPANIES_CATALOG.find(c => c.id === prog.company_id) || COMPANIES_CATALOG[0];
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales_customers
      SET name_ar = ?, name_en = ?, phone = ?, whatsapp = ?, governorate = ?, source = ?, referrer_name = ?,
          program_id = ?, company_name_ar = ?, company_name_en = ?, updated_at = ?
      WHERE id = ? AND owner_employee_id = ?
    `).run(nameAr, nameEn, phone, whatsapp, governorate, source, referrerName, prog.id, comp.name_ar, comp.name_en, now, customerId, employeeId);
    db.prepare(`
      INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
      VALUES (?, ?, ?, 'info_edited', NULL, NULL, NULL, 'Updated customer contact/program details', ?)
    `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, customerId, employeeId, now);
    return db.prepare('SELECT * FROM sales_customers WHERE id = ?').get(customerId);
  }

  function cancelCustomer(employeeId, customerId, { reason, otherNote = '' }) {
    const allowed = ['low_budget', 'not_interested', 'not_registered_campaign', 'inappropriate_behavior', 'other'];
    if (!allowed.includes(reason)) throw new Error('INVALID_CANCELLATION_REASON');
    if (reason === 'other' && !String(otherNote || '').trim()) throw new Error('OTHER_REASON_EXPLANATION_REQUIRED');
    const existing = db.prepare('SELECT * FROM sales_customers WHERE id = ? AND owner_employee_id = ?').get(customerId, employeeId);
    if (!existing) throw new Error('CUSTOMER_NOT_FOUND');
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales_customers
      SET stage = 'cancelled', cancellation_reason = ?, cancellation_other_note = ?, updated_at = ?
      WHERE id = ? AND owner_employee_id = ?
    `).run(reason, reason === 'other' ? String(otherNote).trim() : null, now, customerId, employeeId);
    db.prepare(`
      INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
      VALUES (?, ?, ?, 'cancelled', ?, 'cancelled', ?, ?, ?)
    `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, customerId, employeeId, existing.cancellation_reason || existing.stage, reason, String(otherNote || '').trim() || null, now);
    return db.prepare('SELECT * FROM sales_customers WHERE id = ?').get(customerId);
  }

  function bulkUpdateCustomers(employeeId, { customerIds = [], action, stage, cancelReason, otherNote }) {
    if (!Array.isArray(customerIds) || !customerIds.length) throw new Error('NO_CUSTOMERS_SELECTED');
    const updated = [];
    for (const cid of customerIds) {
      if (action === 'cancel' && cancelReason) {
        updated.push(cancelCustomer(employeeId, cid, { reason: cancelReason, otherNote }));
      } else if (action === 'stage' && stage) {
        updated.push(updateCustomerStage(employeeId, cid, stage, 'Bulk status update'));
      }
    }
    return { count: updated.length, items: updated };
  }

  function submitLeadRequest(employee, { nameAr, nameEn, phone, whatsapp, governorate, source, programId, notes }) {
    const cleanName = String(nameAr || nameEn || '').trim();
    const cleanPhone = normalizePhone(phone || '');
    if (!cleanName || !cleanPhone) throw new Error('LEAD_NAME_AND_PHONE_REQUIRED');
    const now = new Date().toISOString();
    const id = `LREQ-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_lead_requests (
        id, requested_by_employee_id, requested_by_name_ar, requested_by_name_en,
        name_ar, name_en, phone, whatsapp, governorate, source, program_id, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_admin_approval', ?)
    `).run(
      id, employee.id, employee.name_ar, employee.name_en,
      cleanName, String(nameEn || cleanName).trim(), cleanPhone, normalizePhone(whatsapp || cleanPhone),
      governorate || 'cairo', source || 'call_center', programId || 'PRG-UMR-RAJAB', String(notes || '').trim() || null, now
    );
    return db.prepare('SELECT * FROM sales_lead_requests WHERE id = ?').get(id);
  }

  function getLeadRequests(employeeId) {
    return db.prepare('SELECT * FROM sales_lead_requests WHERE requested_by_employee_id = ? ORDER BY created_at DESC').all(employeeId);
  }

  function createCustomer(employeeId, { nameAr, nameEn, phone, governorate, source, programId, referrerName }) {
    const cleanPhone = normalizePhone(phone || '');
    const cleanNameAr = String(nameAr || nameEn || '').trim();
    const cleanNameEn = String(nameEn || nameAr || '').trim();
    if (!cleanNameAr || !cleanPhone) throw new Error('CUSTOMER_NAME_AND_PHONE_REQUIRED');
    const prog = PROGRAMS_CATALOG.find(p => p.id === programId) || PROGRAMS_CATALOG[0];
    const comp = COMPANIES_CATALOG.find(c => c.id === prog.company_id) || COMPANIES_CATALOG[0];
    const now = new Date().toISOString();
    const id = `CUS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_customers (
        id, owner_employee_id, name_ar, name_en, phone, governorate, source, referrer_name,
        stage, program_id, company_name_ar, company_name_en,
        booking_completed, contract_signed, payment_confirmed, total_amount_egp, paid_amount_egp, is_demo, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'fresh_lead', ?, ?, ?, 0, 0, 0, ?, 0, 0, ?, ?)
    `).run(id, employeeId, cleanNameAr, cleanNameEn, cleanPhone, governorate || 'cairo', source || 'call_center', referrerName || null, prog.id, comp.name_ar, comp.name_en, prog.price_egp, now, now);

    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'customer_created', 'employee', ?, ?, ?, 0, ?)
    `).run(`ACT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, employeeId, `إضافة عميل جديد: ${cleanNameAr}`, `Added new lead: ${cleanNameEn}`, id, now);

    return db.prepare('SELECT * FROM sales_customers WHERE id = ?').get(id);
  }

  function updateCustomerStage(employeeId, customerId, stage, note = '') {
    const allowed = ['fresh_lead', 'contacted', 'follow_up', 'booked_pending_payment', 'booked_pending_contract', 'contract_completed', 'cancelled'];
    if (!allowed.includes(stage)) throw new Error('INVALID_STAGE');
    const existing = db.prepare('SELECT * FROM sales_customers WHERE id = ? AND owner_employee_id = ?').get(customerId, employeeId);
    if (!existing) throw new Error('CUSTOMER_NOT_FOUND');
    const now = new Date().toISOString();
    db.prepare('UPDATE sales_customers SET stage = ?, cancellation_reason = CASE WHEN ? != \'cancelled\' THEN NULL ELSE cancellation_reason END, updated_at = ? WHERE id = ? AND owner_employee_id = ?').run(stage, stage, now, customerId, employeeId);
    db.prepare(`
      INSERT INTO sales_customer_history (id, customer_id, employee_id, event_type, prev_status, new_status, reason, note, created_at)
      VALUES (?, ?, ?, 'status_changed', ?, ?, NULL, ?, ?)
    `).run(`HST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, customerId, employeeId, existing.stage, stage, note || null, now);
    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'stage_updated', 'employee', ?, ?, ?, 0, ?)
    `).run(`ACT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, employeeId, `تحديث مرحلة العميل ${existing.name_ar}`, `Updated stage for ${existing.name_en}`, customerId, now);
    return db.prepare('SELECT * FROM sales_customers WHERE id = ?').get(customerId);
  }

  const PRIORITY_WEIGHTS = {
    isProvisional: true,
    base: { urgent: 100, high: 65, normal: 35 },
    overdueHours: { gt72: 45, gt24: 30, gt1: 20, lt1: 10 },
    dueTodayBonus: 25,
    bookingContextBonus: 15,
    postponementStep: 10
  };

  function computeFollowupPriorityScore(f, cust, nowMs) {
    const base = PRIORITY_WEIGHTS.base[f.priority] || PRIORITY_WEIGHTS.base.normal;
    let overdueBonus = 0;
    let overdueHours = 0;
    let overdueBucket = null;
    if (f.effectiveStatus === 'overdue' && f.due_at) {
      overdueHours = Math.max(0.1, (nowMs - Date.parse(f.due_at)) / 3600000);
      if (overdueHours > 72) { overdueBonus = PRIORITY_WEIGHTS.overdueHours.gt72; overdueBucket = 'gt_3d'; }
      else if (overdueHours > 24) { overdueBonus = PRIORITY_WEIGHTS.overdueHours.gt24; overdueBucket = '1_3d'; }
      else if (overdueHours >= 1) { overdueBonus = PRIORITY_WEIGHTS.overdueHours.gt1; overdueBucket = '1_24h'; }
      else { overdueBonus = PRIORITY_WEIGHTS.overdueHours.lt1; overdueBucket = 'lt_1h'; }
    }
    const todayStr = new Date(nowMs).toISOString().slice(0, 10);
    const dueTodayBonus = (f.due_at && f.due_at.slice(0, 10) === todayStr) ? PRIORITY_WEIGHTS.dueTodayBonus : 0;
    const bookingBonus = (cust && cust.booking_completed === 1) ? PRIORITY_WEIGHTS.bookingContextBonus : 0;
    const score = base + overdueBonus + dueTodayBonus + bookingBonus;
    const proposed = score >= 100 ? 'urgent' : (score >= 65 ? 'high' : 'normal');
    return { score, proposed, overdueHours: Math.round(overdueHours * 10) / 10, overdueBucket };
  }

  function getFollowups(employeeId, filters = {}) {
    seedSalesDemoDataIfEmpty(employeeId);
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const todayStr = nowIso.slice(0, 10);

    const rawCusts = db.prepare('SELECT * FROM sales_customers WHERE owner_employee_id = ?').all(employeeId);
    const custMap = new Map(rawCusts.map(c => [c.id, c]));
    const progMap = new Map(PROGRAMS_CATALOG.map(p => [p.id, p]));
    const compByNameAr = new Map(COMPANIES_CATALOG.map(c => [c.name_ar, c.id]));
    const compByNameEn = new Map(COMPANIES_CATALOG.map(c => [c.name_en, c.id]));
    const rawCalls = db.prepare('SELECT * FROM sales_calls WHERE employee_id = ? ORDER BY created_at DESC').all(employeeId);
    const callsByCust = new Map();
    for (const cal of rawCalls) {
      if (!cal.customer_id) continue;
      if (!callsByCust.has(cal.customer_id)) callsByCust.set(cal.customer_id, []);
      callsByCust.get(cal.customer_id).push(cal);
    }

    let rows = db.prepare(`
      SELECT f.*
      FROM sales_followups f
      WHERE f.employee_id = ? AND f.status != 'rescheduled'
    `).all(employeeId);

    rows = rows.map(r => {
      const cust = custMap.get(r.customer_id) || {};
      const prog = progMap.get(cust.program_id) || null;
      const companyId = prog ? prog.company_id : (compByNameAr.get(cust.company_name_ar) || compByNameEn.get(cust.company_name_en) || '');
      const cCalls = callsByCust.get(r.customer_id) || [];
      const lastCall = cCalls[0] || null;
      const effectiveStatus = r.status === 'completed'
        ? 'completed'
        : (r.status === 'cancelled'
          ? 'cancelled'
          : (!r.due_at ? 'undated' : (r.due_at < nowIso || r.status === 'overdue' ? 'overdue' : 'scheduled')));

      const pri = computeFollowupPriorityScore({ ...r, effectiveStatus }, cust, nowMs);
      let tags = [];
      try { tags = r.tags_json ? JSON.parse(r.tags_json) : []; } catch (_) {}

      return {
        ...r,
        effectiveStatus,
        priorityScore: pri.score,
        proposedPriority: pri.proposed,
        overdueHours: pri.overdueHours,
        overdueBucket: pri.overdueBucket,
        tags,
        customer_name_ar: cust.name_ar || r.customer_id,
        customer_name_en: cust.name_en || r.customer_id,
        customer_phone: cust.phone || '',
        customer_whatsapp: cust.whatsapp || cust.phone || '',
        governorate: cust.governorate || 'cairo',
        source: cust.source || 'call_center',
        company_id: companyId,
        company_name_ar: cust.company_name_ar || '',
        company_name_en: cust.company_name_en || '',
        program_id: cust.program_id || '',
        program_title_ar: prog ? prog.title_ar : (cust.program_id || '—'),
        program_title_en: prog ? prog.title_en : (cust.program_id || '—'),
        booking_completed: cust.booking_completed || 0,
        contract_signed: cust.contract_signed || 0,
        payment_confirmed: cust.payment_confirmed || 0,
        assigned_employee_ar: emp.name_ar,
        assigned_employee_en: emp.name_en,
        last_call_at: lastCall ? lastCall.created_at : null,
        last_call_outcome: lastCall ? lastCall.outcome : null
      };
    });

    // Apply multi-criteria filters consistently to analytics, groups, calendar & list
    const q = String(filters.q || '').trim().toLowerCase();
    const statusF = filters.status || '';
    const priorityF = filters.priority || '';
    const overdueBucketF = filters.overdueBucket || '';
    const govF = filters.gov || '';
    const sourceF = filters.source || '';
    const companyF = filters.companyId || '';
    const programF = filters.programId || '';
    const callOutcomeF = filters.callOutcome || '';
    const dueDateF = filters.dueDate || '';
    const periodF = filters.period || '';

    let periodWin = null;
    if (periodF) periodWin = getPeriodWindow(periodF, filters.from || '', filters.to || '');

    const filtered = rows.filter(r => {
      if (q) {
        const hay = `${r.customer_name_ar} ${r.customer_name_en} ${r.customer_phone} ${r.governorate} ${r.company_name_ar} ${r.company_name_en} ${r.program_title_ar} ${r.program_title_en} ${r.notes || ''} ${r.assigned_employee_ar}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusF && statusF !== 'all' && r.effectiveStatus !== statusF) return false;
      if (priorityF && r.priority !== priorityF) return false;
      if (overdueBucketF && r.overdueBucket !== overdueBucketF) return false;
      if (govF && r.governorate !== govF) return false;
      if (sourceF && r.source !== sourceF) return false;
      if (companyF && r.company_id !== companyF) return false;
      if (programF && r.program_id !== programF) return false;
      if (callOutcomeF && r.last_call_outcome !== callOutcomeF) return false;
      if (dueDateF === 'today' && (!r.due_at || r.due_at.slice(0, 10) !== todayStr)) return false;
      if (dueDateF === 'custom' && filters.dueExact && (!r.due_at || r.due_at.slice(0, 10) !== filters.dueExact)) return false;
      if (periodWin && (r.created_at < periodWin.fromIso || r.created_at > periodWin.toIso)) return false;
      return true;
    });

    const sortBy = filters.sort || 'priority';
    filtered.sort((a, b) => {
      if (sortBy === 'nearest_due') {
        if (!a.due_at && !b.due_at) return 0;
        if (!a.due_at) return 1;
        if (!b.due_at) return -1;
        return a.due_at.localeCompare(b.due_at);
      }
      if (sortBy === 'most_overdue') return b.overdueHours - a.overdueHours;
      if (sortBy === 'newest') return b.created_at.localeCompare(a.created_at);
      if (sortBy === 'oldest') return a.created_at.localeCompare(b.created_at);
      if (sortBy === 'last_contact') return (b.last_call_at || '').localeCompare(a.last_call_at || '');
      // Default: highest priorityScore first
      return b.priorityScore - a.priorityScore;
    });

    // Analytics derived strictly from filtered items
    const dueToday = filtered.filter(r => r.effectiveStatus !== 'completed' && r.effectiveStatus !== 'cancelled' && r.due_at && r.due_at.slice(0, 10) === todayStr).length;
    const upcoming = filtered.filter(r => r.effectiveStatus === 'scheduled').length;
    const overdueList = filtered.filter(r => r.effectiveStatus === 'overdue');
    const completedList = filtered.filter(r => r.effectiveStatus === 'completed');
    const cancelledList = filtered.filter(r => r.effectiveStatus === 'cancelled');
    const undatedList = filtered.filter(r => r.effectiveStatus === 'undated');

    const avgDelayHours = overdueList.length
      ? Math.round((overdueList.reduce((s, r) => s + r.overdueHours, 0) / overdueList.length) * 10) / 10
      : 0;
    const onTimeDenom = completedList.length + overdueList.length;
    const onTimeRate = onTimeDenom > 0 ? Math.round((completedList.length / onTimeDenom) * 100) : 100;
    const contactedCount = filtered.filter(r => Boolean(r.last_call_at)).length;
    const contactRate = filtered.length > 0 ? Math.round((contactedCount / filtered.length) * 100) : 0;
    const bookedCount = filtered.filter(r => r.booking_completed === 1).length;
    const conversionToBookingRate = filtered.length > 0 ? Math.round((bookedCount / filtered.length) * 100) : 0;

    // Overdue duration buckets
    const overdueBuckets = {
      lt_1h: overdueList.filter(r => r.overdueBucket === 'lt_1h'),
      '1_24h': overdueList.filter(r => r.overdueBucket === '1_24h'),
      '1_3d': overdueList.filter(r => r.overdueBucket === '1_3d'),
      gt_3d: overdueList.filter(r => r.overdueBucket === 'gt_3d')
    };

    // Today Focus (overdue + due today, top 6 + suggestedNext)
    const todayFocusItems = filtered
      .filter(r => r.effectiveStatus === 'overdue' || (r.effectiveStatus === 'scheduled' && r.due_at && r.due_at.slice(0, 10) === todayStr))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 6);

    const savedFilters = db.prepare(`SELECT id, name, filter_json, created_at FROM sales_saved_filters WHERE employee_id = ? AND page_key = 'followups' ORDER BY created_at DESC`).all(employeeId);

    // Real 6-day trend series from employee's follow-ups for KPI sparklines
    const trendDays = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      trendDays.push({
        date: dt,
        total: rows.filter(r => (r.created_at || '').slice(0, 10) <= dt).length,
        due: rows.filter(r => r.due_at && r.due_at.slice(0, 10) === dt).length,
        completed: rows.filter(r => r.effectiveStatus === 'completed' && (r.completed_at || r.updated_at || '').slice(0, 10) === dt).length,
        overdue: rows.filter(r => r.effectiveStatus === 'overdue' && r.due_at && r.due_at.slice(0, 10) <= dt).length
      });
    }
    const globalCounts = {
      all: rows.length,
      dueToday: rows.filter(r => r.effectiveStatus !== 'completed' && r.effectiveStatus !== 'cancelled' && r.due_at && r.due_at.slice(0, 10) === todayStr).length,
      scheduled: rows.filter(r => r.effectiveStatus === 'scheduled').length,
      overdue: rows.filter(r => r.effectiveStatus === 'overdue').length,
      undated: rows.filter(r => r.effectiveStatus === 'undated').length,
      completed: rows.filter(r => r.effectiveStatus === 'completed').length,
      cancelled: rows.filter(r => r.effectiveStatus === 'cancelled').length
    };

    return {
      items: filtered,
      globalCounts,
      analytics: {
        total: filtered.length,
        dueToday,
        upcoming,
        overdue: overdueList.length,
        completed: completedList.length,
        cancelled: cancelledList.length,
        undated: undatedList.length,
        onTimeCompletionRate: onTimeRate,
        avgDelayHours,
        contactRate,
        conversionToBookingRate,
        bookedCount,
        priorityWeights: PRIORITY_WEIGHTS,
        trends: trendDays
      },
      todayFocus: {
        items: todayFocusItems,
        suggestedNext: todayFocusItems[0] || filtered.find(r => r.effectiveStatus !== 'completed' && r.effectiveStatus !== 'cancelled') || null
      },
      groups: {
        scheduled: filtered.filter(r => r.effectiveStatus === 'scheduled'),
        undated: undatedList.sort((a, b) => (a.last_call_at || '').localeCompare(b.last_call_at || '') || b.priorityScore - a.priorityScore),
        overdue: overdueList,
        overdueBuckets,
        completed: completedList,
        cancelled: cancelledList
      },
      filterCatalog: {
        companies: COMPANIES_CATALOG,
        programs: PROGRAMS_CATALOG
      },
      savedFilters
    };
  }

  function getFollowupDetails(employeeId, followupId) {
    seedSalesDemoDataIfEmpty(employeeId);
    const ws = getFollowups(employeeId, {});
    const followup = ws.items.find(f => f.id === followupId) || db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(followupId, employeeId);
    if (!followup) throw new Error('FOLLOWUP_NOT_FOUND');
    const cust = db.prepare('SELECT * FROM sales_customers WHERE id = ? AND owner_employee_id = ?').get(followup.customer_id, employeeId) || {};
    const allCustomerFollowups = db.prepare('SELECT * FROM sales_followups WHERE customer_id = ? AND employee_id = ? ORDER BY created_at DESC').all(followup.customer_id, employeeId);
    const calls = db.prepare('SELECT * FROM sales_calls WHERE customer_id = ? AND employee_id = ? ORDER BY created_at DESC').all(followup.customer_id, employeeId);
    const history = db.prepare('SELECT * FROM sales_followup_history WHERE customer_id = ? ORDER BY created_at DESC').all(followup.customer_id);
    const activity = db.prepare('SELECT * FROM sales_activity_log WHERE employee_id = ? ORDER BY created_at DESC LIMIT 12').all(employeeId);
    return {
      followup,
      customer: cust,
      allCustomerFollowups,
      calls,
      history,
      activity,
      hasBookedOrContract: Boolean(cust.booking_completed === 1 || (cust.contract_signed === 1 && cust.payment_confirmed === 1))
    };
  }

  function editFollowup(employeeId, followupId, { dueAt, priority, purpose, notes, undated }) {
    const existing = db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(followupId, employeeId);
    if (!existing) throw new Error('FOLLOWUP_NOT_FOUND');
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const isUndated = Boolean(undated) || !dueAt;
    const cleanDue = isUndated ? '' : dueAt;
    const status = existing.status === 'completed' || existing.status === 'cancelled' ? existing.status : (isUndated ? 'undated' : 'scheduled');
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE sales_followups SET due_at = ?, status = ?, priority = ?, purpose = ?, notes = ?, updated_at = ?
      WHERE id = ? AND employee_id = ?
    `).run(cleanDue, status, priority || existing.priority, purpose !== undefined ? purpose : existing.purpose, notes !== undefined ? notes : existing.notes, now, followupId, employeeId);

    db.prepare(`
      INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at)
      VALUES (?, ?, ?, ?, 'edited', ?, ?, 'edited', ?, ?, ?, ?)
    `).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, followupId, existing.customer_id, employeeId, existing.due_at || 'undated', cleanDue || 'undated', String(notes || '').trim(), emp.name_ar, emp.name_en, now);

    return db.prepare('SELECT * FROM sales_followups WHERE id = ?').get(followupId);
  }

  function completeFollowup(employeeId, followupId, { completedVia = 'phone', note = '' } = {}) {
    const existing = db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(followupId, employeeId);
    if (!existing) throw new Error('FOLLOWUP_NOT_FOUND');
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const now = new Date().toISOString();
    db.prepare(`UPDATE sales_followups SET status = 'completed', completed_via = ?, completed_at = ?, updated_at = ? WHERE id = ? AND employee_id = ?`).run(completedVia, now, now, followupId, employeeId);
    db.prepare(`
      INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at)
      VALUES (?, ?, ?, ?, 'completed', ?, 'completed', ?, ?, ?, ?, ?)
    `).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, followupId, existing.customer_id, employeeId, existing.status, completedVia, note || existing.notes || '', emp.name_ar, emp.name_en, now);
    awardPointsIdempotent(employeeId, `fup_done:${followupId}`, 'followup_scheduled');
    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'followup_completed', 'employee', 'تم إتمام المتابعة بنجاح', 'Completed scheduled follow-up', ?, 0, ?)
    `).run(`ACT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, employeeId, followupId, now);
    return db.prepare('SELECT * FROM sales_followups WHERE id = ?').get(followupId);
  }

  function cancelFollowup(employeeId, followupId, reason) {
    const cleanReason = String(reason || '').trim();
    if (!cleanReason) throw new Error('CANCEL_REASON_REQUIRED');
    const existing = db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(followupId, employeeId);
    if (!existing) throw new Error('FOLLOWUP_NOT_FOUND');
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const now = new Date().toISOString();
    db.prepare(`UPDATE sales_followups SET status = 'cancelled', cancel_reason = ?, cancelled_at = ?, updated_at = ? WHERE id = ? AND employee_id = ?`).run(cleanReason, now, now, followupId, employeeId);
    db.prepare(`
      INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at)
      VALUES (?, ?, ?, ?, 'cancelled', ?, 'cancelled', ?, ?, ?, ?, ?)
    `).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, followupId, existing.customer_id, employeeId, existing.status, cleanReason, existing.notes || '', emp.name_ar, emp.name_en, now);
    return db.prepare('SELECT * FROM sales_followups WHERE id = ?').get(followupId);
  }

  function bulkFollowups(employeeId, { followupIds = [], action, priority, dueAt, reason, tag }) {
    if (!Array.isArray(followupIds) || !followupIds.length) throw new Error('NO_FOLLOWUPS_SELECTED');
    const emp = db.prepare('SELECT name_ar, name_en FROM sales_employees WHERE id = ?').get(employeeId) || { name_ar: 'أحمد صبري', name_en: 'Ahmed Sabry' };
    const now = new Date().toISOString();
    let count = 0;
    for (const fid of followupIds) {
      const ex = db.prepare('SELECT * FROM sales_followups WHERE id = ? AND employee_id = ?').get(fid, employeeId);
      if (!ex) continue;
      if (action === 'priority' && priority) {
        db.prepare('UPDATE sales_followups SET priority = ?, updated_at = ? WHERE id = ?').run(priority, now, fid);
        db.prepare(`INSERT INTO sales_followup_history (id, followup_id, customer_id, employee_id, event_type, prev_val, new_val, reason, note, actor_name_ar, actor_name_en, created_at) VALUES (?, ?, ?, ?, 'priority_changed', ?, ?, 'bulk', 'Bulk priority change', ?, ?, ?)`).run(`FHST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, fid, ex.customer_id, employeeId, ex.priority, priority, emp.name_ar, emp.name_en, now);
        count++;
      } else if (action === 'complete') {
        completeFollowup(employeeId, fid, { completedVia: 'review', note: 'Bulk complete' });
        count++;
      } else if (action === 'cancel') {
        cancelFollowup(employeeId, fid, reason || 'Bulk cancellation');
        count++;
      } else if (action === 'reschedule' && dueAt) {
        scheduleFollowup(employeeId, { customerId: ex.customer_id, dueAt, priority: ex.priority, purpose: ex.purpose, notes: ex.notes, rescheduleFromId: fid });
        count++;
      } else if (action === 'tag' && tag) {
        let tags = [];
        try { tags = ex.tags_json ? JSON.parse(ex.tags_json) : []; } catch (_) {}
        if (!tags.includes(tag)) tags.push(tag);
        db.prepare('UPDATE sales_followups SET tags_json = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(tags), now, fid);
        count++;
      }
    }
    return { count };
  }

  function saveFilter(employeeId, { pageKey = 'followups', name, filterObj }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) throw new Error('FILTER_NAME_REQUIRED');
    const id = `SFLT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_saved_filters (id, employee_id, page_key, name, filter_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, employeeId, pageKey, cleanName, JSON.stringify(filterObj || {}), new Date().toISOString());
    return db.prepare('SELECT * FROM sales_saved_filters WHERE id = ?').get(id);
  }

  function deleteSavedFilter(employeeId, id) {
    db.prepare('DELETE FROM sales_saved_filters WHERE id = ? AND employee_id = ?').run(id, employeeId);
  }

  function getCustomerStatsMap() {
    const rows = db.prepare('SELECT program_id, booking_completed, contract_signed, payment_confirmed, stage FROM sales_customers').all();
    const map = new Map();
    for (const r of rows) {
      if (!r.program_id) continue;
      if (!map.has(r.program_id)) map.set(r.program_id, { bookings: 0, contracts: 0 });
      const entry = map.get(r.program_id);
      if (r.booking_completed) entry.bookings += 1;
      if ((r.contract_signed && r.payment_confirmed) || r.stage === 'contract_completed') entry.contracts += 1;
    }
    return map;
  }

  function computePerfMetrics(bookings, contracts) {
    const b = Math.max(0, Number(bookings) || 0);
    const c = Math.min(b, Math.max(0, Number(contracts) || 0));
    const conversionRate = b > 0 ? Math.round((c / b) * 1000) / 10 : 0;
    const isLimitedData = b < PROGRAM_PERF_CONFIG.minReliableBookings;
    // Provisional sample-fairness score: penalizes tiny samples when comparing against reliable samples
    const sampleConfidence = Math.min(1, b / PROGRAM_PERF_CONFIG.minReliableBookings);
    const fairnessScore = Math.round(conversionRate * (0.45 + 0.55 * sampleConfidence) * 10) / 10;
    return {
      bookings: b,
      completed_contracts: c,
      conversion_rate: conversionRate,
      is_limited_data: isLimitedData,
      fairness_score: fairnessScore,
      min_reliable_bookings: PROGRAM_PERF_CONFIG.minReliableBookings
    };
  }

  function enrichProgram(p, employeeId, custStatsMap, favSet, pinSet) {
    const comp = COMPANIES_CATALOG.find(c => c.id === p.company_id) || null;
    const liveStats = custStatsMap.get(p.id) || { bookings: 0, contracts: 0 };
    const base = p.perf_baseline || { bookings: 0, completed_contracts: 0 };
    const perf = computePerfMetrics(base.bookings + liveStats.bookings, base.completed_contracts + liveStats.contracts);
    return {
      ...p,
      company_name_ar: comp ? comp.name_ar : '',
      company_name_en: comp ? comp.name_en : '',
      company_operational_status: comp ? comp.operational_status : 'unknown',
      ...perf,
      is_favorite: favSet ? favSet.has(p.id) : false,
      is_pinned: pinSet ? pinSet.has('program:' + p.id) : false
    };
  }

  function getEmployeeSets(employeeId) {
    if (!employeeId) return { favSet: new Set(), pinSet: new Set() };
    const favRows = db.prepare('SELECT program_id FROM sales_program_favorites WHERE employee_id = ?').all(employeeId);
    const pinRows = db.prepare('SELECT item_type, item_id FROM sales_pinned_items WHERE employee_id = ?').all(employeeId);
    return {
      favSet: new Set(favRows.map(r => r.program_id)),
      pinSet: new Set(pinRows.map(r => `${r.item_type}:${r.item_id}`))
    };
  }

  function evaluateSmartMatch(prog, criteria) {
    const matched = [];
    const unmatched = [];
    const missing = [];
    const reasonsAr = [];
    const reasonsEn = [];
    let evaluatedWeight = 0;
    let earnedWeight = 0;

    const addCriterion = (weight, ok, missingFlag, labelAr, labelEn, reasonOkAr, reasonOkEn, reasonFailAr, reasonFailEn) => {
      if (missingFlag) {
        missing.push({ label_ar: labelAr, label_en: labelEn });
        return;
      }
      evaluatedWeight += weight;
      if (ok) {
        earnedWeight += weight;
        matched.push({ label_ar: labelAr, label_en: labelEn });
        if (reasonOkAr) reasonsAr.push(reasonOkAr);
        if (reasonOkEn) reasonsEn.push(reasonOkEn);
      } else {
        unmatched.push({ label_ar: labelAr, label_en: labelEn });
        if (reasonFailAr) reasonsAr.push(reasonFailAr);
        if (reasonFailEn) reasonsEn.push(reasonFailEn);
      }
    };

    if (criteria.budget > 0) {
      const flex = Number.isFinite(Number(criteria.budgetFlexibilityPct)) ? Number(criteria.budgetFlexibilityPct) : 10;
      const maxAllowed = criteria.budget * (1 + Math.max(0, flex) / 100);
      const ok = prog.price_egp <= maxAllowed;
      const withinBase = prog.price_egp <= criteria.budget;
      addCriterion(
        28,
        ok,
        prog.price_egp == null,
        'الميزانية',
        'Budget',
        withinBase ? 'ضمن الميزانية المطلوبة' : `ضمن مرونة الميزانية (+${flex}%)`,
        withinBase ? 'Within target budget' : `Within budget flexibility (+${flex}%)`,
        'يتجاوز الحد الأقصى للميزانية',
        'Exceeds maximum budget limit'
      );
    }

    if (criteria.programType && criteria.programType !== 'all') {
      addCriterion(
        16,
        prog.program_type === criteria.programType || prog.category === criteria.programType,
        !prog.program_type,
        'نوع الرحلة',
        'Trip Type',
        'يطابق نوع الرحلة المطلوب',
        'Matches requested trip type',
        'نوع الرحلة مختلف',
        'Different trip type'
      );
    }

    if (criteria.travelDate) {
      const targetMs = Date.parse(criteria.travelDate);
      const progMs = prog.travel_date ? Date.parse(prog.travel_date) : NaN;
      const diffDays = (!isNaN(targetMs) && !isNaN(progMs)) ? Math.abs(progMs - targetMs) / 86400000 : null;
      addCriterion(
        14,
        diffDays !== null && diffDays <= 14,
        diffDays === null,
        'تاريخ السفر',
        'Travel Date',
        diffDays === 0 ? 'يطابق تاريخ السفر تماماً' : 'قريب من تاريخ السفر المفضل',
        diffDays === 0 ? 'Exact travel date match' : 'Close to preferred travel date',
        'تاريخ السفر بعيد عن الموعد المفضل',
        'Travel date differs from preference'
      );
    }

    if (criteria.maxMakkahDistance > 0) {
      addCriterion(
        12,
        prog.makkah_distance_m != null && prog.makkah_distance_m <= criteria.maxMakkahDistance,
        prog.makkah_distance_m == null,
        'القرب من المسجد الحرام',
        'Haram Distance',
        `على بُعد ${prog.makkah_distance_m}م من الحرم`,
        `${prog.makkah_distance_m}m from Masjid al-Haram`,
        'أبعد من المسافة المطلوبة عن الحرم',
        'Further from Haram than requested'
      );
    }

    if (criteria.maxMadinahDistance > 0) {
      addCriterion(
        8,
        prog.madinah_distance_m != null && prog.madinah_distance_m <= criteria.maxMadinahDistance,
        prog.madinah_distance_m == null,
        'القرب من المسجد النبوي',
        'Madinah Distance',
        `على بُعد ${prog.madinah_distance_m}م من المسجد النبوي`,
        `${prog.madinah_distance_m}m from Prophet Mosque`,
        'أبعد من المسافة المطلوبة بالمدينة',
        'Further in Madinah than requested'
      );
    }

    if (criteria.accommodationType && criteria.accommodationType !== 'all') {
      addCriterion(
        10,
        prog.accommodation_type === criteria.accommodationType,
        !prog.accommodation_type,
        'مستوى الإقامة',
        'Accommodation Level',
        'يطابق مستوى الإقامة المطلوب',
        'Matches accommodation tier',
        'مستوى الإقامة مختلف',
        'Different accommodation tier'
      );
    }

    if (criteria.hotelStars > 0) {
      addCriterion(
        8,
        prog.hotel_stars != null && prog.hotel_stars >= criteria.hotelStars,
        prog.hotel_stars == null,
        'تصنيف الفندق',
        'Hotel Rating',
        `${prog.hotel_stars} نجوم`,
        `${prog.hotel_stars}-Star rating`,
        'تصنيف الفندق أقل من المطلوب',
        'Hotel rating below requested'
      );
    }

    if (criteria.roomType && criteria.roomType !== 'all') {
      const rooms = Array.isArray(prog.room_types) ? prog.room_types : [];
      addCriterion(
        7,
        rooms.includes(criteria.roomType),
        rooms.length === 0,
        'نوع الغرفة',
        'Room Type',
        'نوع الغرفة متاح',
        'Requested room type available',
        'نوع الغرفة غير متاح',
        'Requested room type unavailable'
      );
    }

    if (criteria.mealsCode && criteria.mealsCode !== 'all') {
      addCriterion(
        7,
        prog.meals_code === criteria.mealsCode,
        !prog.meals_code || prog.meals_code === 'none',
        'الوجبات',
        'Meals',
        'يشمل نظام الوجبات المطلوب',
        'Includes requested meal plan',
        'نظام الوجبات مختلف',
        'Different meal plan'
      );
    }

    if (criteria.departurePeriod && criteria.departurePeriod !== 'all') {
      addCriterion(
        6,
        prog.departure_period === criteria.departurePeriod,
        !prog.departure_period,
        'وقت الإقلاع',
        'Departure Time',
        'وقت الإقلاع مناسب',
        'Preferred departure window',
        'وقت الإقلاع مختلف',
        'Different departure window'
      );
    }

    if (criteria.arrivalPeriod && criteria.arrivalPeriod !== 'all') {
      addCriterion(
        6,
        prog.arrival_period === criteria.arrivalPeriod,
        !prog.arrival_period,
        'وقت الوصول',
        'Arrival Time',
        'وقت الوصول مناسب',
        'Preferred arrival window',
        'وقت الوصول مختلف',
        'Different arrival window'
      );
    }

    if (criteria.minDuration > 0 || criteria.maxDuration > 0) {
      const minD = criteria.minDuration || 0;
      const maxD = criteria.maxDuration || 999;
      addCriterion(
        8,
        prog.duration_days != null && prog.duration_days >= minD && prog.duration_days <= maxD,
        prog.duration_days == null,
        'مدة الرحلة',
        'Trip Duration',
        `مدة الرحلة ${prog.duration_days} أيام`,
        `${prog.duration_days} days duration`,
        'مدة الرحلة خارج النطاق',
        'Duration outside requested range'
      );
    }

    if (criteria.cancellationCode && criteria.cancellationCode !== 'all') {
      addCriterion(
        6,
        prog.cancellation_code === criteria.cancellationCode,
        !prog.cancellation_policy_ar && !prog.cancellation_policy_en,
        'سياسة الإلغاء',
        'Cancellation Policy',
        'سياسة الإلغاء مطابقة',
        'Matches cancellation preference',
        'سياسة الإلغاء مختلفة',
        'Different cancellation policy'
      );
    }

    if (criteria.availabilityStatus && criteria.availabilityStatus !== 'all') {
      addCriterion(
        8,
        prog.availability_status === criteria.availabilityStatus,
        !prog.availability_status,
        'التوافر',
        'Availability',
        'حالة التوافر مطابقة',
        'Availability matches',
        'حالة التوافر مختلفة',
        'Availability differs'
      );
    }

    if (Array.isArray(criteria.services) && criteria.services.length > 0) {
      const joined = ((prog.services_ar || []).join(' ') + ' ' + (prog.services_en || []).join(' ')).toLowerCase();
      const hits = criteria.services.filter(sv => joined.includes(sv.toLowerCase()));
      addCriterion(
        10,
        hits.length === criteria.services.length,
        joined.trim().length === 0,
        'الخدمات الإضافية',
        'Included Services',
        `يشمل ${hits.length}/${criteria.services.length} من الخدمات المطلوبة`,
        `Includes ${hits.length}/${criteria.services.length} requested services`,
        'لا يشمل كافة الخدمات المحددة',
        'Missing some requested services'
      );
    }

    const matchScore = evaluatedWeight > 0 ? Math.round((earnedWeight / evaluatedWeight) * 100) : null;
    return {
      has_criteria: evaluatedWeight > 0 || missing.length > 0,
      match_score: matchScore,
      is_incomplete_evaluation: missing.length > 0,
      matched_criteria: matched,
      unmatched_criteria: unmatched,
      missing_criteria: missing,
      match_reasons_ar: reasonsAr,
      match_reasons_en: reasonsEn
    };
  }

  function getCompaniesAndPrograms({ employeeId = null, q = '', category = '', companyId = '', sort = 'conversion', favoritesOnly = false } = {}) {
    const custStatsMap = getCustomerStatsMap();
    const { favSet, pinSet } = getEmployeeSets(employeeId);

    const allPrograms = PROGRAMS_CATALOG.map(p => enrichProgram(p, employeeId, custStatsMap, favSet, pinSet));

    const companies = COMPANIES_CATALOG.map(c => {
      const compProgs = allPrograms.filter(p => p.company_id === c.id);
      const totalBookings = compProgs.reduce((acc, p) => acc + p.bookings, 0);
      const totalContracts = compProgs.reduce((acc, p) => acc + p.completed_contracts, 0);
      const perf = computePerfMetrics(totalBookings, totalContracts);
      return {
        ...c,
        total_programs: compProgs.length,
        umrah_count: compProgs.filter(p => p.program_type === 'umrah').length,
        hajj_count: compProgs.filter(p => p.program_type === 'hajj').length,
        vip_count: compProgs.filter(p => p.category === 'vip').length,
        ...perf,
        is_pinned: pinSet.has('company:' + c.id)
      };
    }).sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return b.fairness_score - a.fairness_score;
    });

    let programs = allPrograms;
    const term = String(q || '').trim().toLowerCase();
    if (term) {
      programs = programs.filter(p =>
        p.title_ar.toLowerCase().includes(term) ||
        p.title_en.toLowerCase().includes(term) ||
        p.company_name_ar.toLowerCase().includes(term) ||
        p.company_name_en.toLowerCase().includes(term) ||
        p.makkah_hotel_ar.toLowerCase().includes(term) ||
        p.makkah_hotel_en.toLowerCase().includes(term) ||
        (p.madinah_hotel_ar || '').toLowerCase().includes(term) ||
        (p.madinah_hotel_en || '').toLowerCase().includes(term)
      );
    }
    if (category && category !== 'all') {
      programs = programs.filter(p => p.category === category || p.program_type === category);
    }
    if (companyId && companyId !== 'all') {
      programs = programs.filter(p => p.company_id === companyId);
    }
    if (favoritesOnly) {
      programs = programs.filter(p => p.is_favorite);
    }

    const sortKey = sort || 'conversion';
    programs.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      if (sortKey === 'conversion') {
        if (a.is_limited_data !== b.is_limited_data) return a.is_limited_data ? 1 : -1;
        return b.conversion_rate - a.conversion_rate || b.bookings - a.bookings;
      }
      if (sortKey === 'bookings') return b.bookings - a.bookings;
      if (sortKey === 'contracts') return b.completed_contracts - a.completed_contracts;
      if (sortKey === 'price_asc') return a.price_egp - b.price_egp;
      if (sortKey === 'price_desc') return b.price_egp - a.price_egp;
      if (sortKey === 'updated') return Date.parse(b.last_updated_at || 0) - Date.parse(a.last_updated_at || 0);
      return b.conversion_rate - a.conversion_rate;
    });

    return {
      companies,
      programs,
      perf_config: PROGRAM_PERF_CONFIG,
      favorites_count: favSet.size
    };
  }

  function smartSearchPrograms(employeeId, criteria = {}) {
    const { companies, programs, perf_config } = getCompaniesAndPrograms({
      employeeId,
      q: criteria.q || '',
      companyId: criteria.companyId || 'all'
    });
    const evaluated = programs.map(p => ({
      ...p,
      match: evaluateSmartMatch(p, criteria)
    }));
    evaluated.sort((a, b) => {
      const sa = a.match.match_score == null ? -1 : a.match.match_score;
      const sb = b.match.match_score == null ? -1 : b.match.match_score;
      if (sb !== sa) return sb - sa;
      return b.fairness_score - a.fairness_score;
    });
    return { companies, programs: evaluated, perf_config };
  }

  function getProgramById(id, employeeId = null) {
    const p = PROGRAMS_CATALOG.find(x => x.id === id);
    if (!p) return null;
    const custStatsMap = getCustomerStatsMap();
    const { favSet, pinSet } = getEmployeeSets(employeeId);
    const enriched = enrichProgram(p, employeeId, custStatsMap, favSet, pinSet);
    const comp = COMPANIES_CATALOG.find(c => c.id === p.company_id) || null;
    const changelog = db.prepare('SELECT * FROM sales_program_changelog WHERE program_id = ? ORDER BY created_at DESC').all(p.id);
    const savedScripts = employeeId
      ? db.prepare('SELECT * FROM sales_saved_scripts WHERE employee_id = ? AND program_id = ? ORDER BY updated_at DESC').all(employeeId, p.id)
      : [];
    const relatedCustomers = employeeId
      ? db.prepare('SELECT id, name_ar, name_en, stage FROM sales_customers WHERE owner_employee_id = ? AND program_id = ? ORDER BY updated_at DESC LIMIT 10').all(employeeId, p.id)
      : [];
    return {
      ...enriched,
      company: comp,
      scripts: SALES_SCRIPTS,
      changelog,
      saved_scripts: savedScripts,
      related_customers: relatedCustomers,
      perf_config: PROGRAM_PERF_CONFIG
    };
  }

  function toggleFavorite(employeeId, programId) {
    if (!PROGRAMS_CATALOG.some(p => p.id === programId)) throw new Error('PROGRAM_NOT_FOUND');
    const existing = db.prepare('SELECT id FROM sales_program_favorites WHERE employee_id = ? AND program_id = ?').get(employeeId, programId);
    if (existing) {
      db.prepare('DELETE FROM sales_program_favorites WHERE id = ?').run(existing.id);
      return { programId, is_favorite: false };
    }
    const id = `SFAV-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare('INSERT INTO sales_program_favorites (id, employee_id, program_id, created_at) VALUES (?, ?, ?, ?)').run(id, employeeId, programId, new Date().toISOString());
    return { programId, is_favorite: true };
  }

  function togglePin(employeeId, itemType, itemId) {
    if (!['company', 'program'].includes(itemType)) throw new Error('INVALID_PIN_TYPE');
    const existing = db.prepare('SELECT id FROM sales_pinned_items WHERE employee_id = ? AND item_type = ? AND item_id = ?').get(employeeId, itemType, itemId);
    if (existing) {
      db.prepare('DELETE FROM sales_pinned_items WHERE id = ?').run(existing.id);
      return { itemType, itemId, is_pinned: false };
    }
    const id = `SPIN-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare('INSERT INTO sales_pinned_items (id, employee_id, item_type, item_id, created_at) VALUES (?, ?, ?, ?, ?)').run(id, employeeId, itemType, itemId, new Date().toISOString());
    return { itemType, itemId, is_pinned: true };
  }

  function recordRecentProgram(employeeId, programId, contextType = 'viewed') {
    if (!PROGRAMS_CATALOG.some(p => p.id === programId)) return null;
    const id = `SREC-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_recent_programs (id, employee_id, program_id, context_type, viewed_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(employee_id, program_id) DO UPDATE SET
        context_type = excluded.context_type,
        viewed_at = excluded.viewed_at
    `).run(id, employeeId, programId, contextType === 'recommended' ? 'recommended' : 'viewed', new Date().toISOString());
    return { programId, contextType };
  }

  function getRecentPrograms(employeeId) {
    const rows = db.prepare('SELECT program_id, context_type, viewed_at FROM sales_recent_programs WHERE employee_id = ? ORDER BY viewed_at DESC LIMIT 8').all(employeeId);
    const custStatsMap = getCustomerStatsMap();
    const { favSet, pinSet } = getEmployeeSets(employeeId);
    return rows.map(r => {
      const p = PROGRAMS_CATALOG.find(x => x.id === r.program_id);
      if (!p) return null;
      return { ...enrichProgram(p, employeeId, custStatsMap, favSet, pinSet), context_type: r.context_type, viewed_at: r.viewed_at };
    }).filter(Boolean);
  }

  function saveSalesScript(employeeId, payload = {}) {
    const programId = String(payload.programId || '').trim();
    const title = String(payload.title || '').trim();
    if (!programId || !title) throw new Error('SCRIPT_FIELDS_REQUIRED');
    const id = `SSCR-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO sales_saved_scripts (id, employee_id, program_id, title, customer_type, inputs_json, script_json, is_prototype, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(
      id, employeeId, programId, title,
      String(payload.customerType || 'general'),
      JSON.stringify(payload.inputs || {}),
      JSON.stringify(payload.script || {}),
      now, now
    );
    return db.prepare('SELECT * FROM sales_saved_scripts WHERE id = ?').get(id);
  }

  function deleteSalesScript(employeeId, scriptId) {
    db.prepare('DELETE FROM sales_saved_scripts WHERE id = ? AND employee_id = ?').run(scriptId, employeeId);
  }

  function submitErrorReport(employeeId, payload = {}) {
    const programId = String(payload.programId || '').trim();
    const fieldName = String(payload.fieldName || '').trim();
    const details = String(payload.details || '').trim();
    if (!programId || !fieldName || !details) throw new Error('REPORT_FIELDS_REQUIRED');
    const p = PROGRAMS_CATALOG.find(x => x.id === programId);
    if (!p) throw new Error('PROGRAM_NOT_FOUND');
    const id = `SRPT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO sales_program_error_reports (id, employee_id, program_id, company_id, field_name, current_value, suggested_value, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_review', ?)
    `).run(id, employeeId, p.id, p.company_id, fieldName, String(payload.currentValue || ''), String(payload.suggestedValue || ''), details, now);
    return db.prepare('SELECT * FROM sales_program_error_reports WHERE id = ?').get(id);
  }

  function getErrorReports(employeeId) {
    return db.prepare('SELECT * FROM sales_program_error_reports WHERE employee_id = ? ORDER BY created_at DESC').all(employeeId);
  }

  function recordRecommendation(employeeId, { customerId, programId, notes = '' }) {
    if (!customerId || !programId) throw new Error('RECOMMENDATION_FIELDS_REQUIRED');
    const id = `SREC-CUST-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO sales_program_recommendations (id, employee_id, customer_id, program_id, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, employeeId, customerId, programId, String(notes || ''), now);
    recordRecentProgram(employeeId, programId, 'recommended');
    return db.prepare('SELECT * FROM sales_program_recommendations WHERE id = ?').get(id);
  }

  function getProgramChangelog({ programId = '', companyId = '' } = {}) {
    let sql = 'SELECT * FROM sales_program_changelog WHERE 1=1';
    const params = [];
    if (programId && programId !== 'all') { sql += ' AND program_id = ?'; params.push(programId); }
    if (companyId && companyId !== 'all') { sql += ' AND company_id = ?'; params.push(companyId); }
    sql += ' ORDER BY created_at DESC';
    const rows = db.prepare(sql).all(...params);
    return rows.map(r => {
      const p = PROGRAMS_CATALOG.find(x => x.id === r.program_id);
      const c = COMPANIES_CATALOG.find(x => x.id === r.company_id);
      return {
        ...r,
        program_title_ar: p ? p.title_ar : r.program_id,
        program_title_en: p ? p.title_en : r.program_id,
        company_name_ar: c ? c.name_ar : r.company_id,
        company_name_en: c ? c.name_en : r.company_id
      };
    });
  }

  function simulateProgramChangeImpact(employeeId, { programId, changeType = 'price', field_ar, field_en, prev_value_ar, prev_value_en, new_value_ar, new_value_en, importance = 'high' }) {
    const p = PROGRAMS_CATALOG.find(x => x.id === programId);
    if (!p) throw new Error('PROGRAM_NOT_FOUND');
    const now = new Date().toISOString();
    const id = `CHG-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_program_changelog (
        id, program_id, company_id, change_type, field_ar, field_en,
        prev_value_ar, prev_value_en, new_value_ar, new_value_en,
        importance, data_source_ar, data_source_en, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, p.id, p.company_id, changeType,
      field_ar || 'تحديث تجريبي', field_en || 'Prototype Update',
      prev_value_ar || '', prev_value_en || '',
      new_value_ar || '', new_value_en || '',
      importance,
      'محاكاة تحديث البرنامج (نموذج تجريبي)', 'Program Change Simulation (Prototype)',
      now
    );

    // Notify ONLY employees who recommended this program to a customer (never unrelated employees, never mutating historical bookings)
    const recs = db.prepare(`
      SELECT r.employee_id, r.customer_id, c.name_ar AS cust_name_ar, c.name_en AS cust_name_en
      FROM sales_program_recommendations r
      LEFT JOIN sales_customers c ON c.id = r.customer_id
      WHERE r.program_id = ?
    `).all(p.id);

    let notifiedCount = 0;
    const ntfStmt = db.prepare(`
      INSERT INTO sales_notifications (id, employee_id, title_ar, title_en, body_ar, body_en, target_url, is_read, is_deleted, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?)
    `);
    for (const r of recs) {
      const ntfId = `SNTF-CHG-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
      const custAr = r.cust_name_ar || r.customer_id;
      const custEn = r.cust_name_en || r.customer_id;
      ntfStmt.run(
        ntfId,
        r.employee_id,
        `تحديث برنامج مرشح: ${p.title_ar}`,
        `Recommended Program Updated: ${p.title_en}`,
        `تم تحديث (${field_ar || 'بيانات البرنامج'}) من "${prev_value_ar || '-'}" إلى "${new_value_ar || '-'}" للعميل ${custAr}. الحجوزات السابقة تحتفظ بشروطها التاريخية.`,
        `Updated (${field_en || 'Program field'}) from "${prev_value_en || '-'}" to "${new_value_en || '-'}" affecting customer ${custEn}. Existing bookings retain historical terms.`,
        `sales-program-details.html?id=${encodeURIComponent(p.id)}&tab=history&customer=${encodeURIComponent(r.customer_id)}`,
        now
      );
      notifiedCount += 1;
    }

    return { change: db.prepare('SELECT * FROM sales_program_changelog WHERE id = ?').get(id), notifiedCount };
  }

  function getCompanySyncHistory(companyId = '') {
    let rows = COMPANY_SYNC_HISTORY_SEED;
    if (companyId && companyId !== 'all') {
      rows = rows.filter(r => r.company_id === companyId);
    }
    return rows.map(r => {
      const c = COMPANIES_CATALOG.find(x => x.id === r.company_id);
      const affected = (r.affected_program_ids || []).map(pid => {
        const p = PROGRAMS_CATALOG.find(x => x.id === pid);
        return { id: pid, title_ar: p ? p.title_ar : pid, title_en: p ? p.title_en : pid };
      });
      return {
        ...r,
        company_name_ar: c ? c.name_ar : r.company_id,
        company_name_en: c ? c.name_en : r.company_id,
        freshness_state: c ? c.freshness_state : 'stale',
        affected_programs: affected
      };
    });
  }

  function getProfileData(employee, { highlightPeriod = 'this_month' } = {}) {
    seedSalesDemoDataIfEmpty(employee.id);
    const dash = getDashboardData(employee, { period: 'month' });
    const shifts = db.prepare(`
      SELECT id, shift_type, target_seconds, worked_seconds, status, started_at, ended_at, end_reason
      FROM sales_work_sessions
      WHERE employee_id = ?
      ORDER BY created_at DESC LIMIT 15
    `).all(employee.id);

    const custRows = db.prepare('SELECT * FROM sales_customers WHERE owner_employee_id = ?').all(employee.id);
    const callRows = db.prepare('SELECT * FROM sales_calls WHERE employee_id = ?').all(employee.id);
    const fupRows = db.prepare('SELECT * FROM sales_followups WHERE employee_id = ?').all(employee.id);
    const earnedBadges = db.prepare(`
      SELECT b.*, eb.earned_at
      FROM sales_employee_badges eb
      JOIN sales_badges b ON b.id = eb.badge_id
      WHERE eb.employee_id = ?
      ORDER BY eb.earned_at DESC
    `).all(employee.id);
    const celebratedRows = db.prepare('SELECT achievement_key FROM sales_profile_celebrations WHERE employee_id = ?').all(employee.id);
    const celebratedSet = new Set(celebratedRows.map(r => r.achievement_key));

    const totalCustomers = custRows.length;
    const totalBookings = custRows.filter(c => c.booking_completed).length;
    const completedContracts = custRows.filter(c => (c.contract_signed && c.payment_confirmed) || c.stage === 'contract_completed').length;
    const totalCalls = callRows.length;
    const completedFollowups = fupRows.filter(f => f.status === 'completed').length;
    const overdueFollowups = fupRows.filter(f => f.status === 'overdue').length;
    const completedShifts = shifts.filter(s => s.worked_seconds >= 60).length;
    const customerToBookingPct = totalCustomers > 0 ? Math.round((totalBookings / totalCustomers) * 1000) / 10 : 0;
    const bookingToContractPct = totalBookings > 0 ? Math.round((completedContracts / totalBookings) * 1000) / 10 : 0;
    const customerToContractPct = totalCustomers > 0 ? Math.round((completedContracts / totalCustomers) * 1000) / 10 : 0;
    const followupCompletionPct = fupRows.length > 0 ? Math.round((completedFollowups / fupRows.length) * 1000) / 10 : 0;

    // Genuine measurable achievements
    const latestContractCust = custRows.filter(c => (c.contract_signed && c.payment_confirmed) || c.stage === 'contract_completed')
      .sort((a, b) => Date.parse(b.updated_at || 0) - Date.parse(a.updated_at || 0))[0];

    const rawAchievements = [
      {
        id: 'ach_first_contract',
        category: 'contracts',
        title_ar: 'أول عقد مكتمل',
        title_en: 'First Completed Contract',
        desc_ar: 'إتمام أول عقد موثق ومدفوع بالكامل عبر المنصة.',
        desc_en: 'Completed your first fully paid and signed contract.',
        condition_ar: 'إتمام عقد واحد مكتمل على الأقل (١ عقد)',
        condition_en: 'Complete at least 1 signed & paid contract',
        current_value: completedContracts,
        target_value: 1,
        earned_at: latestContractCust ? latestContractCust.updated_at : null
      },
      {
        id: 'ach_contract_closer',
        category: 'contracts',
        title_ar: 'منجز العقود (٣+ عقود)',
        title_en: 'Contract Closer (3+ Contracts)',
        desc_ar: 'تحقيق ٣ عقود مكتملة ومسجلة باسمك في سجل المبيعات.',
        desc_en: 'Achieved 3 or more completed contracts in CRM records.',
        condition_ar: 'إتمام ٣ عقود مكتملة',
        condition_en: 'Complete 3 signed & paid contracts',
        current_value: completedContracts,
        target_value: 3,
        earned_at: completedContracts >= 3 && latestContractCust ? latestContractCust.updated_at : null
      },
      {
        id: 'ach_conversion_pro',
        category: 'conversion',
        title_ar: 'كفاءة التحويل (٢٠٪+)',
        title_en: 'Conversion Efficiency (20%+)',
        desc_ar: 'تحويل ٢٠٪ أو أكثر من العملاء إلى عقود مكتملة (بحد أدنى ٥ عملاء).',
        desc_en: 'Convert 20%+ of assigned customers to completed contracts (min 5 customers).',
        condition_ar: 'معدل تحويل ≥ ٢٠٪ من ٥ عملاء على الأقل',
        condition_en: 'Conversion rate >= 20% with at least 5 customers',
        current_value: totalCustomers >= 5 ? customerToContractPct : 0,
        target_value: 20,
        earned_at: (totalCustomers >= 5 && customerToContractPct >= 20 && latestContractCust) ? latestContractCust.updated_at : null
      },
      {
        id: 'ach_call_connector',
        category: 'engagement',
        title_ar: 'تواصل نشط (١٠+ مكالمات)',
        title_en: 'Active Customer Engagement (10+ Calls)',
        desc_ar: 'تسجيل ١٠ مكالمات واردة أو صادرة موثقة مع العملاء.',
        desc_en: 'Logged 10 or more verified inbound/outbound customer calls.',
        condition_ar: 'تسجيل ١٠ مكالمات عملاء',
        condition_en: 'Log 10 customer calls',
        current_value: totalCalls,
        target_value: 10,
        earned_at: totalCalls >= 10 && callRows[0] ? callRows[0].created_at : null
      },
      {
        id: 'ach_followup_keeper',
        category: 'followups',
        title_ar: 'انضباط المتابعات (٥ متابعات)',
        title_en: 'Follow-up Consistency (5 Completed)',
        desc_ar: 'إغلاق ٥ متابعات عملاء بنجاح في المواعيد المحددة.',
        desc_en: 'Successfully completed 5 scheduled customer follow-ups.',
        condition_ar: 'إتمام ٥ متابعات عملاء',
        condition_en: 'Complete 5 customer follow-ups',
        current_value: completedFollowups,
        target_value: 5,
        earned_at: completedFollowups >= 5 && fupRows[0] ? fupRows[0].updated_at : null
      },
      {
        id: 'ach_shift_discipline',
        category: 'consistency',
        title_ar: 'انطلاقة الورديات',
        title_en: 'Shift Commitment',
        desc_ar: 'تسجيل حضور فعلي في وردية عمل عبر نظام التوقيت المعتمد.',
        desc_en: 'Recorded verified work shift presence in the shift timer.',
        condition_ar: 'تسجيل وردية عمل واحدة على الأقل',
        condition_en: 'Complete at least 1 tracked work shift',
        current_value: completedShifts,
        target_value: 1,
        earned_at: completedShifts >= 1 && shifts[0] ? shifts[0].started_at : null
      }
    ];

    const achievements = rawAchievements.map(a => {
      const earned = a.current_value >= a.target_value;
      const pct = Math.min(100, Math.round((a.current_value / Math.max(1, a.target_value)) * 100));
      const status = earned ? 'earned' : (a.current_value > 0 ? 'in_progress' : 'available');
      return {
        ...a,
        status,
        progress_pct: pct,
        is_newly_earned: earned && !celebratedSet.has(a.id)
      };
    });

    // Professional Growth metrics (honest about available historical comparison)
    const targetPct = dash.targetBreakdown && dash.targetBreakdown.month ? dash.targetBreakdown.month.pct : 0;
    const growth = {
      hasPreviousPeriodData: false,
      previousPeriodNote_ar: 'بيانات الفترة السابقة غير متوفرة تاريخياً في السجل المحلي؛ يتم عرض الأداء الحالي الموثق بشفافية.',
      previousPeriodNote_en: 'Historical previous-period baseline is not yet stored locally; showing verified current-period metrics honestly.',
      isRuleBasedAdvice: true,
      metrics: [
        {
          id: 'target_achievement',
          label_ar: 'تحقيق الهدف الشهري',
          label_en: 'Monthly Target Achievement',
          definition_ar: 'النسبة المئوية للنقاط المنجزة مقابل الهدف الشهري المعتمد.',
          definition_en: 'Percentage of verified points achieved against monthly target.',
          current: targetPct,
          unit: '%',
          previous: null,
          trend: targetPct >= 50 ? 'up' : 'steady'
        },
        {
          id: 'cust_to_booking',
          label_ar: 'تحويل العميل إلى حجز',
          label_en: 'Customer-to-Booking Rate',
          definition_ar: 'نسبة العملاء الذين أتموا خطوة الحجز المبدئي.',
          definition_en: 'Share of assigned customers who completed a booking.',
          current: customerToBookingPct,
          unit: '%',
          previous: null,
          trend: customerToBookingPct >= 30 ? 'up' : 'steady'
        },
        {
          id: 'booking_to_contract',
          label_ar: 'تحويل الحجز إلى عقد مكتمل',
          label_en: 'Booking-to-Contract Rate',
          definition_ar: 'نسبة الحجوزات التي اكتمل سدادها وتوقيع عقدها.',
          definition_en: 'Share of bookings that reached full payment & signed contract.',
          current: bookingToContractPct,
          unit: '%',
          previous: null,
          trend: bookingToContractPct >= 60 ? 'up' : 'steady'
        },
        {
          id: 'followup_rate',
          label_ar: 'إنجاز المتابعات',
          label_en: 'Follow-up Completion Rate',
          definition_ar: 'نسبة المتابعات المكتملة من إجمالي المتابعات المسجلة.',
          definition_en: 'Completed follow-ups out of total recorded follow-ups.',
          current: followupCompletionPct,
          unit: '%',
          previous: null,
          trend: overdueFollowups === 0 ? 'up' : 'attention'
        }
      ],
      strengths_ar: [
        completedContracts > 0 ? `تحقيق ${completedContracts} عقود مكتملة بنسبة ${bookingToContractPct}% من الحجوزات.` : 'نشاط جيد في التواصل الأولي مع العملاء.',
        totalCalls >= 10 ? `حجم تواصل هاتفي قوي (${totalCalls} مكالمة موثقة).` : 'بداية منتظمة في تسجيل المكالمات.'
      ],
      strengths_en: [
        completedContracts > 0 ? `Closed ${completedContracts} completed contracts (${bookingToContractPct}% of bookings).` : 'Active initial engagement with assigned customers.',
        totalCalls >= 10 ? `Strong call activity (${totalCalls} verified logged calls).` : 'Consistent start on call logging.'
      ],
      improvements_ar: [
        overdueFollowups > 0 ? `يوجد ${overdueFollowups} متابعة متأخرة تحتاج إغلاقاً سريعاً لرفع معدل الانضباط.` : 'الحفاظ على صفر متابعات متأخرة.',
        'التركيز على تحويل العملاء في مرحلة «بانتظار السداد» إلى عقود مكتملة.'
      ],
      improvements_en: [
        overdueFollowups > 0 ? `${overdueFollowups} overdue follow-up(s) need attention to boost completion rate.` : 'Maintain zero overdue follow-ups.',
        'Prioritize converting pending-payment bookings into completed contracts.'
      ]
    };

    // Period-based Personal Highlights (honest per period)
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).getTime();

    const inPeriod = (iso) => {
      const ms = Date.parse(iso || '');
      if (isNaN(ms)) return false;
      if (highlightPeriod === 'last_month') return ms >= startOfLastMonth && ms < startOfThisMonth;
      if (highlightPeriod === 'quarter') return ms >= startOfQuarter;
      return ms >= startOfThisMonth;
    };

    const periodCustomers = custRows.filter(c => inPeriod(c.updated_at || c.created_at));
    const periodContracts = periodCustomers.filter(c => (c.contract_signed && c.payment_confirmed) || c.stage === 'contract_completed');
    const progCounts = new Map();
    for (const c of periodContracts) {
      if (!c.program_id) continue;
      progCounts.set(c.program_id, (progCounts.get(c.program_id) || 0) + 1);
    }
    let bestProgId = null, bestProgCount = 0;
    for (const [pid, cnt] of progCounts.entries()) {
      if (cnt > bestProgCount) { bestProgId = pid; bestProgCount = cnt; }
    }
    const bestProg = bestProgId ? PROGRAMS_CATALOG.find(p => p.id === bestProgId) : null;
    const latestEarnedAch = achievements.find(a => a.status === 'earned' && inPeriod(a.earned_at));

    const highlights = [];
    if (periodContracts.length > 0) {
      highlights.push({
        id: 'hl_contracts',
        title_ar: 'أقوى حصيلة عقود مكتملة',
        title_en: 'Strongest Completed Contracts',
        value_ar: `${periodContracts.length} عقود مكتملة`,
        value_en: `${periodContracts.length} Completed Contracts`,
        desc_ar: 'عقود موثقة ومسددة بالكامل خلال الفترة المحددة.',
        desc_en: 'Fully signed and paid contracts during the selected period.'
      });
    }
    if (bestProg) {
      highlights.push({
        id: 'hl_program',
        title_ar: 'أفضل برنامج في التحويل',
        title_en: 'Best-Converting Program',
        value_ar: bestProg.title_ar,
        value_en: bestProg.title_en,
        desc_ar: `${bestProgCount} عقود مكتملة على هذا البرنامج في الفترة المحددة.`,
        desc_en: `${bestProgCount} completed contract(s) on this program in selected period.`
      });
    }
    if (latestEarnedAch) {
      highlights.push({
        id: 'hl_badge',
        title_ar: 'إنجاز محقق في الفترة',
        title_en: 'Period Achievement Earned',
        value_ar: latestEarnedAch.title_ar,
        value_en: latestEarnedAch.title_en,
        desc_ar: latestEarnedAch.desc_ar,
        desc_en: latestEarnedAch.desc_en
      });
    }

    // Career Journey (strictly from genuine records — no invented promotions)
    const journey = [
      {
        id: 'jrn_joined',
        category: 'milestone',
        title_ar: 'الانضمام إلى فريق ميقات',
        title_en: 'Joined Miqat Sales & Call Center',
        desc_ar: `تم تفعيل حساب الموظف (${employee.employee_code}) في قسم ${employee.department_ar || 'المبيعات ومركز الاتصال'}.`,
        desc_en: `Employee profile (${employee.employee_code}) activated in ${employee.department_en || 'Sales & Call Center'}.`,
        date: employee.created_at,
        actor_ar: 'إدارة النظام',
        actor_en: 'System Admin'
      },
      ...earnedBadges.map(b => ({
        id: 'jrn_bdg_' + b.id,
        category: 'badge',
        title_ar: `وسام مستحق: ${b.title_ar}`,
        title_en: `Badge Earned: ${b.title_en}`,
        desc_ar: b.desc_ar,
        desc_en: b.desc_en,
        date: b.earned_at,
        actor_ar: 'محرك الإنجازات',
        actor_en: 'Achievement Engine'
      })),
      ...(latestContractCust ? [{
        id: 'jrn_contract_' + latestContractCust.id,
        category: 'achievement',
        title_ar: 'إتمام عقد عميل موثق',
        title_en: 'Verified Contract Completed',
        desc_ar: `اكتمال السداد وتوقيع العقد للعميل ${latestContractCust.name_ar}.`,
        desc_en: `Full payment & contract completion for ${latestContractCust.name_en}.`,
        date: latestContractCust.updated_at,
        actor_ar: 'إدارة الحسابات',
        actor_en: 'Accounts Department'
      }] : [])
    ].sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0));

    // Security & Sessions (real sessions table for this user)
    const activeSessions = db.prepare(`
      SELECT token, expires_at, created_at
      FROM sessions
      WHERE user_id = ? AND expires_at > ?
      ORDER BY created_at DESC
    `).all(employee.user_id, new Date().toISOString());

    const security = {
      lastLoginAt: activeSessions[0] ? activeSessions[0].created_at : employee.updated_at,
      activeSessionsCount: activeSessions.length,
      sessions: activeSessions.map((s, idx) => ({
        id: 'SES-' + (idx + 1),
        tokenPreview: s.token.slice(0, 10) + '...',
        created_at: s.created_at,
        expires_at: s.expires_at,
        isCurrentHint: idx === 0
      })),
      passwordPolicy_ar: 'تغيير كلمة المرور متاح حصرياً عبر إدارة النظام (Admin) ولا يمكن تغييره من حساب الموظف.',
      passwordPolicy_en: 'Password changes are managed exclusively by System Admin and cannot be modified by employees.',
      twoFactorStatus: 'future_capability'
    };

    // Permissions (read-only actual state + permission requests)
    const permissions = {
      categories: [
        {
          key: 'allowed',
          status: 'allowed',
          items: [
            { key: 'view_customers', label_ar: 'عرض ومتابعة العملاء المعينين', label_en: 'View & follow up assigned customers' },
            { key: 'log_calls', label_ar: 'تسجيل المكالمات الصادرة والواردة', label_en: 'Log inbound & outbound calls' },
            { key: 'browse_programs', label_ar: 'استعراض ومقارنة برامج الشركات', label_en: 'Browse & compare partner programs' },
            { key: 'edit_contact', label_ar: 'تعديل رقم الهاتف وواتساب الشخصي', label_en: 'Edit personal phone & WhatsApp number' }
          ]
        },
        {
          key: 'approval_required',
          status: 'approval_required',
          items: [
            { key: 'request_lead', label_ar: 'طلب إضافة عميل جديد (يتطلب موافقة الإدارة)', label_en: 'Request new customer lead (requires Admin approval)' },
            { key: 'report_program_err', label_ar: 'الإبلاغ عن خطأ بيانات برنامج للمراجعة', label_en: 'Submit program data error for review' }
          ]
        },
        {
          key: 'not_allowed',
          status: 'not_allowed',
          items: [
            { key: 'collect_payments', label_ar: 'تحصيل المدفوعات أو تعديل السجلات المالية', label_en: 'Collect payments or modify financial records' },
            { key: 'edit_program_source', label_ar: 'تعديل أسعار أو تفاصيل برامج الشركات', label_en: 'Edit partner program rates or source data' },
            { key: 'change_password_role', label_ar: 'تغيير كلمة المرور أو الصلاحيات أو البريد', label_en: 'Change password, permissions, or email' }
          ]
        }
      ],
      requests: db.prepare('SELECT * FROM sales_permission_requests WHERE employee_id = ? ORDER BY created_at DESC').all(employee.id)
    };

    // Account Activity Timeline (filtered to account/profile/security/permissions/admin)
    const rawActivity = db.prepare(`
      SELECT * FROM sales_activity_log
      WHERE employee_id = ?
      ORDER BY created_at DESC LIMIT 40
    `).all(employee.id);

    const mapActivityCat = (t) => {
      if (t === 'profile_updated') return 'profile';
      if (t === 'security_sessions_terminated' || t === 'login') return 'security';
      if (t === 'permission_requested') return 'permissions';
      if (t === 'contract_confirmed' || t === 'badge_earned') return 'admin';
      return 'other';
    };

    const accountActivity = rawActivity
      .map(a => ({ ...a, account_category: mapActivityCat(a.action_type) }))
      .filter(a => a.account_category !== 'other');

    return {
      employee: {
        ...employee,
        ...dash.employee,
        department_ar: employee.department_ar || 'المبيعات ومركز الاتصال',
        department_en: employee.department_en || 'Sales & Call Center',
        joined_at: employee.created_at
      },
      targetBreakdown: dash.targetBreakdown,
      gamification: dash.gamification,
      workSession: dash.workSession,
      shifts,
      achievements,
      growth,
      highlights,
      journey,
      security,
      permissions,
      accountActivity
    };
  }

  function updateProfileContact(employeeId, { phone, whatsapp } = {}) {
    const cleanPhone = normalizePhone(phone || '');
    const cleanWa = whatsapp ? normalizePhone(whatsapp) : '';
    if (!cleanPhone || cleanPhone.length < 8) throw new Error('INVALID_PHONE');
    const emp = db.prepare('SELECT * FROM sales_employees WHERE id = ?').get(employeeId);
    if (!emp) throw new Error('EMPLOYEE_NOT_FOUND');
    const now = new Date().toISOString();
    db.prepare('UPDATE sales_employees SET phone = ?, whatsapp = ?, updated_at = ? WHERE id = ?')
      .run(cleanPhone, cleanWa, now, employeeId);

    const actId = `SACT-PRF-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'profile_updated', 'employee', ?, ?, ?, 0, ?)
    `).run(
      actId, employeeId,
      `تحديث بيانات التواصل الشخصية (الهاتف: ${cleanPhone}${cleanWa ? '، واتساب: ' + cleanWa : ''})`,
      `Updated personal contact info (Phone: ${cleanPhone}${cleanWa ? ', WhatsApp: ' + cleanWa : ''})`,
      employeeId, now
    );
    return db.prepare('SELECT * FROM sales_employees WHERE id = ?').get(employeeId);
  }

  function submitPermissionRequest(employeeId, { permissionKey, permissionLabelAr, permissionLabelEn, reason } = {}) {
    const cleanReason = String(reason || '').trim();
    if (!permissionKey || !cleanReason) throw new Error('PERMISSION_REQUEST_FIELDS_REQUIRED');
    const id = `SPRM-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO sales_permission_requests (id, employee_id, permission_key, permission_label_ar, permission_label_en, reason, status, is_prototype, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending_admin_review', 1, ?)
    `).run(id, employeeId, permissionKey, permissionLabelAr || permissionKey, permissionLabelEn || permissionKey, cleanReason, now);

    const actId = `SACT-PRM-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'permission_requested', 'employee', ?, ?, ?, 1, ?)
    `).run(
      actId, employeeId,
      `إرسال طلب صلاحية للإدارة: ${permissionLabelAr || permissionKey}`,
      `Submitted permission request to Admin: ${permissionLabelEn || permissionKey}`,
      id, now
    );
    return db.prepare('SELECT * FROM sales_permission_requests WHERE id = ?').get(id);
  }

  function markCelebratedAchievements(employeeId, keys = []) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO sales_profile_celebrations (id, employee_id, achievement_key, celebrated_at)
      VALUES (?, ?, ?, ?)
    `);
    for (const k of (keys || [])) {
      stmt.run(`SCEL-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`, employeeId, String(k), now);
    }
    return { ok: true };
  }

  function terminateOtherSessions(userId, currentToken, employeeId) {
    if (!currentToken) throw new Error('NO_ACTIVE_SESSION_TOKEN');
    const info = db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(userId, currentToken);
    const now = new Date().toISOString();
    const actId = `SACT-SEC-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO sales_activity_log (id, employee_id, action_type, source, desc_ar, desc_en, ref_id, is_demo, created_at)
      VALUES (?, ?, 'security_sessions_terminated', 'employee', ?, ?, ?, 0, ?)
    `).run(
      actId, employeeId,
      `إنهاء الجلسات النشطة الأخرى (${info.changes} جلسة)`,
      `Terminated other active sessions (${info.changes} session(s))`,
      employeeId, now
    );
    return { terminatedCount: info.changes };
  }

  function submitFunActivity(employeeId, { activityType, itemId, selectedIndex }) {
    const allowed = ['riddle', 'quiz', 'challenge'];
    if (!allowed.includes(activityType)) throw new Error('INVALID_FUN_TYPE');
    const bankList = activityType === 'riddle'
      ? FUN_CORNER_BANK.riddles
      : (activityType === 'quiz' ? FUN_CORNER_BANK.quizzes : FUN_CORNER_BANK.miniChallenges);
    const item = bankList.find(x => x.id === itemId) || bankList[0];
    const idx = parseInt(selectedIndex, 10);
    const isCorrect = idx === item.correctIndex ? 1 : 0;
    const score = isCorrect ? 10 : 5;
    const todayDate = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    const id = `FUN-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    db.prepare(`
      INSERT INTO sales_fun_progress (id, employee_id, activity_date, activity_type, item_id, selected_index, is_correct, score, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(employee_id, activity_date, activity_type) DO UPDATE SET
        selected_index = excluded.selected_index,
        is_correct = excluded.is_correct,
        score = excluded.score
    `).run(id, employeeId, todayDate, activityType, item.id, isNaN(idx) ? 0 : idx, isCorrect, score, now);

    return {
      activityType,
      itemId: item.id,
      isCorrect: Boolean(isCorrect),
      correctIndex: item.correctIndex,
      score,
      explanation_ar: item.explanation_ar,
      explanation_en: item.explanation_en
    };
  }

  return {
    WORK_SESSION_RULES,
    LEADERBOARD_WEIGHTS,
    getEmployeeByUserId,
    getEmployeeByEmailOrPhone,
    provisionSalesEmployee,
    getActiveWorkSession,
    startWorkSession,
    goOffline,
    resumeWorkSession,
    heartbeatWorkSession,
    stopWorkSession,
    startBreak,
    endBreak,
    recordCall,
    scheduleFollowup,
    getDashboardData,
    getNotifications,
    markNotificationRead,
    deleteNotification,
    getActivity,
    getCustomers,
    getCustomerDetails,
    addCustomerComment,
    editCustomerInfo,
    cancelCustomer,
    bulkUpdateCustomers,
    submitLeadRequest,
    getLeadRequests,
    processOverdueFollowup,
    createCustomer,
    updateCustomerStage,
    getFollowups,
    getFollowupDetails,
    editFollowup,
    completeFollowup,
    cancelFollowup,
    bulkFollowups,
    saveFilter,
    deleteSavedFilter,
    getCompaniesAndPrograms,
    smartSearchPrograms,
    getProgramById,
    toggleFavorite,
    togglePin,
    recordRecentProgram,
    getRecentPrograms,
    saveSalesScript,
    deleteSalesScript,
    submitErrorReport,
    getErrorReports,
    recordRecommendation,
    getProgramChangelog,
    simulateProgramChangeImpact,
    getCompanySyncHistory,
    getProfileData,
    updateProfileContact,
    submitPermissionRequest,
    markCelebratedAchievements,
    terminateOtherSessions,
    submitFunActivity
  };
}

module.exports = { createSalesRepository };
