/**
 * Miqat Platform - Accounts Employee Workspace
 * Dedicated Manual Backup Flow Controller (Phase 6 - Frontend Simulation)
 * Strictly Mock Data & Frontend UI Demonstration
 */

(function () {
  'use strict';

  // --- 1. Simulation State Store ---
  const state = {
    currentStage: 'setup',       // 'setup' | 'progress' | 'receipt'
    selectedScope: 'full',       // 'full' | 'trans' | 'docs'
    simulatedReceiptData: null,  // Holds immutable runtime receipt snapshot
    progressTimer: null,         // Active interval reference
    completionTimeout: null,     // Active completion timeout reference
    currentStepIndex: 0,         // Active progress step index (0-3)
    isSimulating: false,         // Click guard to prevent overlapping executions
    sequenceCounter: 0           // In-page session sequence counter for collision-free IDs
  };

  // --- 2. Mock Scope Configurations ---
  const SCOPE_CONFIG = {
    full: {
      id: 'full',
      name_ar: 'النظام المتكامل وقاعدة البيانات (بيانات تجريبية)',
      name_en: 'Full System & Database (Mock Data)',
      desc_ar: 'محاكاة لقطة شاملة لكافة الجداول والقيود المحاسبية وسجلات النظام.',
      desc_en: 'Simulated comprehensive snapshot of all mock accounting tables and records.',
      size_str: '2.85 GB',
      records_mock_ar: '14,820 قيد محاسبي تجريبي',
      records_mock_en: '14,820 mock accounting entries'
    },
    trans: {
      id: 'trans',
      name_ar: 'سجل المعاملات والتسويات المالية (بيانات تجريبية)',
      name_en: 'Transactions & Ledgers (Mock Data)',
      desc_ar: 'محاكاة تجميع سجلات المدفوعات والقبوض وسندات الصرف التجريبية.',
      desc_en: 'Simulated collection of mock payments, receipts, and vouchers.',
      size_str: '1.68 GB',
      records_mock_ar: '8,450 معاملة تجريبية',
      records_mock_en: '8,450 mock transactions'
    },
    docs: {
      id: 'docs',
      name_ar: 'المستندات والإيصالات الرقمية (بيانات تجريبية)',
      name_en: 'Digital Receipts & Documents (Mock Data)',
      desc_ar: 'محاكاة أرشفة صور الإيصالات وفواتير الحجوزات والمرفقات التجريبية.',
      desc_en: 'Simulated archiving of mock receipt images, invoices, and attachments.',
      size_str: '920 MB',
      records_mock_ar: '2,140 مستند تجريبي',
      records_mock_en: '2,140 mock documents'
    }
  };

  // --- 3. Mock Simulation Milestones (Explicit Demonstration Only) ---
  const SIMULATION_STEPS = [
    {
      pct: 25,
      text_ar: '1. محاكاة قراءة وتجميع السجلات التجريبية للنطاق المختار...',
      text_en: '1. Simulating compilation of mock records for selected scope...'
    },
    {
      pct: 55,
      text_ar: '2. محاكاة تجهيز حزم البيانات التجريبية وضغطها افتراضياً...',
      text_en: '2. Simulating preparation and virtual compression of mock packages...'
    },
    {
      pct: 85,
      text_ar: '3. محاكاة نقل النسخة الافتراضية إلى وحدة التخزين التجريبية...',
      text_en: '3. Simulating virtual transfer of archive to mock storage unit...'
    },
    {
      pct: 100,
      text_ar: '4. محاكاة اكتمال العملية وتوليد إيصال العملية التجريبي...',
      text_en: '4. Simulating process completion and generating mock receipt...'
    }
  ];

  // --- 4. Page-Specific Translation Dictionary ---
  const I18N = {
    ar: {
      breadcrumb_reports: 'التقارير والنسخ الاحتياطي',
      breadcrumb_current: 'النسخ الاحتياطي اليدوي (محاكاة)',
      badge_mock: 'محاكاة تشغيلية — بيانات تجريبية',
      page_title: 'النسخ الاحتياطي اليدوي الفوري',
      page_subtitle: 'محاكاة تفاعلية لتنفيذ عملية نسخ احتياطي فوري للنظام والبيانات المالية (بيانات تجريبية للعرض فقط).',
      btn_back_center: 'العودة لمركز النسخ والتقارير',
      step1_badge: 'الخطوة 1 من 2',
      step1_title: 'تحديد نطاق النسخ الاحتياطي التجريبي',
      step1_desc: 'اختر نطاق البيانات المطلوب شموله في عملية المحاكاة التوضيحية:',
      scope_full_title: 'النظام المتكامل وقاعدة البيانات',
      scope_full_sub: 'محاكاة لقطة شاملة لكافة الجداول والقيود المحاسبية وسجلات النظام (~2.85 GB)',
      scope_trans_title: 'سجل المعاملات والتسويات المالية',
      scope_trans_sub: 'محاكاة تجميع سجلات المدفوعات والقبوض وسندات الصرف التجريبية (~1.68 GB)',
      scope_docs_title: 'المستندات والإيصالات الرقمية',
      scope_docs_sub: 'محاكاة أرشفة صور الإيصالات وفواتير الحجوزات والمرفقات التجريبية (~920 MB)',
      summary_title: 'ملخص النطاق المحدد (محاكاة):',
      summary_size_label: 'الحجم التقديري الافتراضي:',
      summary_records_label: 'السجلات التجريبية المشمولة:',
      summary_operator_label: 'الموظف المسؤول المنفذ:',
      checklist_badge: 'فحص أولي توضيحي',
      checklist_title: 'جاهزية بيئة المحاكاة (فحص توضيحي)',
      checklist_desc: 'مؤشرات توضيحية لسلامة بيئة المحاكاة قبل إطلاق العملية:',
      chk_env_label: 'فحص بيئة المحاكاة التوضيحية',
      chk_env_status: 'بيئة تجريبية جاهزة',
      chk_scope_label: 'التحقق من نطاق البيانات التجريبي المختار',
      chk_scope_status: 'نطاق تجريبي صالح',
      chk_read_label: 'محاكاة حالة قراءة السجلات التجريبية',
      chk_read_status: 'محاكاة جاهزة',
      chk_storage_label: 'محاكاة توفر مساحة التخزين الافتراضية',
      chk_storage_status: 'مساحة افتراضية متوفرة',
      step2_badge: 'الخطوة 2 من 2',
      step2_title: 'تأكيد وإطلاق المحاكاة',
      disclaimer_title: 'تنبيه توضيحي للمستخدم',
      disclaimer_text: 'هذه الشاشة تمثل محاكاة لواجهة النسخ الاحتياطي اليدوي لأغراض العرض والتجربة فقط. لا يتم إجراء أي اتصال بقاعدة بيانات حقيقية، ولا يتم إنشاء نسخ فعلية أو كتابة سجلات تدقيق دائمة.',
      btn_start_sim: 'بدء محاكاة النسخ الاحتياطي الآن',
      btn_cancel: 'إلغاء والعودة',
      progress_badge: 'محاكاة قيد المعالجة',
      progress_title: 'جاري محاكاة تنفيذ النسخ الاحتياطي...',
      progress_note: 'محاكاة تشغيلية لعرض الخطوات التوضيحية للمستخدم (لا يتم تنفيذ عمليات فعلية في الخلفية).',
      receipt_badge: 'محاكاة مكتملة',
      receipt_title: 'إيصال محاكاة النسخ الاحتياطي اليدوي',
      receipt_subtitle: 'تم إتمام محاكاة العملية بنجاح وتوليد تفاصيل الإيصال التجريبي التالية:',
      field_ref: 'الرقم المرجعي للمحاكاة:',
      field_date: 'تاريخ ووقت المحاكاة:',
      field_scope: 'النطاق التجريبي:',
      field_size: 'الحجم الافتراضي المسجل:',
      field_operator: 'الموظف المسؤول:',
      field_status: 'حالة المحاكاة:',
      status_completed: 'اكتملت المحاكاة',
      receipt_disclaimer: 'إشعار المحاكاة: هذه العملية تمت كمحاكاة واجهة مستخدم توضيحية باستخدام بيانات افتراضية، ولم ينتج عنها إنشاء ملفات نسخ احتياطي فعلية أو تعديل في قواعد البيانات.',
      btn_return_archive: 'العودة لسجل النسخ الاحتياطي والأرشيف',
      btn_new_sim: 'إجراء محاكاة جديدة',
      logout_desc: 'هل أنت متأكد من رغبتك في تسجيل الخروج من منصة الحسابات المالية؟'
    },
    en: {
      breadcrumb_reports: 'Daily Reports & Backup',
      breadcrumb_current: 'Manual Backup (Simulation)',
      badge_mock: 'Operational Simulation — Mock Data',
      page_title: 'Immediate Manual Backup',
      page_subtitle: 'Interactive simulation of an immediate manual backup for system and financial data (mock demonstration only).',
      btn_back_center: 'Back to Backup Center',
      step1_badge: 'Step 1 of 2',
      step1_title: 'Select Mock Backup Scope',
      step1_desc: 'Select the data scope to be included in the demonstration simulation:',
      scope_full_title: 'Full System & Database',
      scope_full_sub: 'Simulated comprehensive snapshot of all mock accounting tables and records (~2.85 GB)',
      scope_trans_title: 'Transactions & Ledgers',
      scope_trans_sub: 'Simulated collection of mock payments, receipts, and journal vouchers (~1.68 GB)',
      scope_docs_title: 'Digital Receipts & Documents',
      scope_docs_sub: 'Simulated archiving of mock receipt images, invoices, and attachments (~920 MB)',
      summary_title: 'Selected Scope Summary (Mock):',
      summary_size_label: 'Estimated Virtual Size:',
      summary_records_label: 'Included Mock Records:',
      summary_operator_label: 'Responsible Operator:',
      checklist_badge: 'Demonstration Check',
      checklist_title: 'Simulation Environment Readiness (Demonstration)',
      checklist_desc: 'Demonstrative indicators of simulation environment readiness before launching:',
      chk_env_label: 'Mock Simulation Environment Check',
      chk_env_status: 'Mock Environment Ready',
      chk_scope_label: 'Mock Data Scope Validation',
      chk_scope_status: 'Valid Mock Scope',
      chk_read_label: 'Simulated Mock Record Read State',
      chk_read_status: 'Simulation Ready',
      chk_storage_label: 'Simulated Virtual Storage Space',
      chk_storage_status: 'Virtual Space Available',
      step2_badge: 'Step 2 of 2',
      step2_title: 'Confirm & Launch Simulation',
      disclaimer_title: 'User Demonstration Notice',
      disclaimer_text: 'This screen is a frontend simulation of the manual backup interface for demonstration purposes only. No actual database connection, real backup creation, or permanent audit log writes are performed.',
      btn_start_sim: 'Start Backup Simulation Now',
      btn_cancel: 'Cancel & Return',
      progress_badge: 'Simulation in Progress',
      progress_title: 'Simulating Backup Execution...',
      progress_note: 'Operational simulation displaying demonstrative steps (no actual background processes are executed).',
      receipt_badge: 'Simulation Completed',
      receipt_title: 'Manual Backup Simulation Receipt',
      receipt_subtitle: 'Operation simulation completed successfully. The following mock receipt details have been generated:',
      field_ref: 'Simulation Reference:',
      field_date: 'Simulation Timestamp:',
      field_scope: 'Mock Scope:',
      field_size: 'Recorded Virtual Size:',
      field_operator: 'Responsible Operator:',
      field_status: 'Simulation Status:',
      status_completed: 'Simulation Completed',
      receipt_disclaimer: 'Simulation Notice: This operation was conducted as a demonstrative UI simulation using mock data. No actual backup files were created or modified in any database.',
      btn_return_archive: 'Return to Backup Log & Archive',
      btn_new_sim: 'Perform New Simulation',
      logout_desc: 'Are you sure you want to log out of the financial accounts platform?'
    }
  };

  // --- 5. Helper Functions ---
  function getIsArabic() {
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getLang === 'function') {
      return window.AccountsWorkspace.getLang() === 'ar';
    }
    return document.documentElement.lang !== 'en';
  }

  function getOperatorIdentity(isAr) {
    const nameEl = document.getElementById('acc-employee-name');
    if (nameEl && nameEl.textContent && nameEl.textContent.trim()) {
      const name = nameEl.textContent.trim();
      if (name.length > 0 && !name.includes('{{')) {
        const roleEl = document.getElementById('acc-employee-role');
        const role = roleEl && roleEl.textContent ? ` (${roleEl.textContent.trim()})` : '';
        return `${name}${role}`;
      }
    }
    return isAr ? 'موظف الحسابات' : 'Accounts Employee';
  }

  function formatLocalTimestamp(d) {
    const date = d || new Date();
    const pad = n => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Generates reference ID unique within the current page/session
  function generateReferenceId(d) {
    state.sequenceCounter++;
    const date = d || new Date();
    const pad = (n, len = 2) => String(n).padStart(len, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ms = pad(date.getMilliseconds(), 3);
    const seq = pad(state.sequenceCounter, 3);
    return `BK-${year}${month}${day}-${hours}${minutes}${seconds}-${ms}-SEQ${seq}-MANUAL`;
  }

  // Timer Lifecycle Cleanup: Clears both progress interval and completion timeout
  function clearAllTimers() {
    if (state.progressTimer) {
      clearInterval(state.progressTimer);
      state.progressTimer = null;
    }
    if (state.completionTimeout) {
      clearTimeout(state.completionTimeout);
      state.completionTimeout = null;
    }
  }

  // --- 6. Stage & View Accessibility Transitions ---
  function updateStageVisibility() {
    const setupSection = document.getElementById('rep-mb-setup-section');
    const progressSection = document.getElementById('rep-mb-progress-section');
    const receiptSection = document.getElementById('rep-mb-receipt-section');

    const isSetup = state.currentStage === 'setup';
    const isProgress = state.currentStage === 'progress';
    const isReceipt = state.currentStage === 'receipt';

    if (setupSection) {
      setupSection.style.display = isSetup ? 'block' : 'none';
      setupSection.setAttribute('aria-hidden', isSetup ? 'false' : 'true');
    }
    if (progressSection) {
      progressSection.style.display = isProgress ? 'block' : 'none';
      progressSection.setAttribute('aria-hidden', isProgress ? 'false' : 'true');
    }
    if (receiptSection) {
      receiptSection.style.display = isReceipt ? 'block' : 'none';
      receiptSection.setAttribute('aria-hidden', isReceipt ? 'false' : 'true');
    }
  }

  // --- 7. Scope Selection Handling (Accessible Native Radio Synchronization) ---
  function selectScope(scopeId) {
    if (!SCOPE_CONFIG[scopeId]) return;
    state.selectedScope = scopeId;

    const cards = document.querySelectorAll('.rep-scope-card');
    cards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      const isTarget = radio && radio.value === scopeId;
      card.classList.toggle('is-selected', isTarget);
      if (radio && radio.checked !== isTarget) {
        radio.checked = isTarget;
      }
    });

    renderScopeSummary();
  }

  function renderScopeSummary() {
    const isAr = getIsArabic();
    const cfg = SCOPE_CONFIG[state.selectedScope] || SCOPE_CONFIG.full;

    const sizeEl = document.getElementById('rep-mb-summary-size');
    const recordsEl = document.getElementById('rep-mb-summary-records');
    const opEl = document.getElementById('rep-mb-summary-operator');

    if (sizeEl) sizeEl.textContent = cfg.size_str;
    if (recordsEl) recordsEl.textContent = isAr ? cfg.records_mock_ar : cfg.records_mock_en;
    if (opEl) opEl.textContent = getOperatorIdentity(isAr);
  }

  // --- 8. Checklist Rendering ---
  function renderChecklist() {
    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;

    const items = [
      { id: 'chk-env', label: dict.chk_env_label, status: dict.chk_env_status },
      { id: 'chk-scope', label: dict.chk_scope_label, status: dict.chk_scope_status },
      { id: 'chk-read', label: dict.chk_read_label, status: dict.chk_read_status },
      { id: 'chk-storage', label: dict.chk_storage_label, status: dict.chk_storage_status }
    ];

    items.forEach(item => {
      const lblEl = document.getElementById(`${item.id}-label`);
      const valEl = document.getElementById(`${item.id}-status`);
      if (lblEl) lblEl.textContent = item.label;
      if (valEl) valEl.textContent = item.status;
    });
  }

  // --- 9. Progress Simulation with Dynamic Language Evaluation ---
  function applyStep(idx) {
    state.currentStepIndex = idx;
    const isAr = getIsArabic(); // Evaluated dynamically at render time
    const step = SIMULATION_STEPS[idx];
    const fillEl = document.getElementById('rep-sim-progress-fill');
    const pctEl = document.getElementById('rep-sim-progress-pct');
    const stepTextEl = document.getElementById('rep-sim-step-text');
    const trackEl = document.querySelector('.rep-sim-progress-track');

    if (fillEl) fillEl.style.width = `${step.pct}%`;
    if (pctEl) pctEl.textContent = `${step.pct}%`;
    if (stepTextEl) stepTextEl.textContent = isAr ? step.text_ar : step.text_en;
    if (trackEl) trackEl.setAttribute('aria-valuenow', step.pct);
  }

  function startSimulation() {
    if (state.isSimulating) return; // Prevent duplicate rapid clicks
    state.isSimulating = true;

    const btnStart = document.getElementById('rep-mb-btn-start-simulation');
    if (btnStart) {
      btnStart.disabled = true;
      btnStart.setAttribute('aria-busy', 'true');
    }

    clearAllTimers();
    state.currentStage = 'progress';
    state.currentStepIndex = 0;
    updateStageVisibility();

    applyStep(0);

    state.progressTimer = setInterval(() => {
      state.currentStepIndex++;
      if (state.currentStepIndex < SIMULATION_STEPS.length) {
        applyStep(state.currentStepIndex);
      } else {
        clearInterval(state.progressTimer);
        state.progressTimer = null;

        // Completion delay with cancelable timeout guard
        state.completionTimeout = setTimeout(() => {
          state.completionTimeout = null;
          // Guard: Only complete if simulation is still active
          if (state.isSimulating && state.currentStage === 'progress') {
            completeSimulation();
          }
        }, 350);
      }
    }, 450);
  }

  // --- 10. Runtime Receipt Generation with Frozen Operator Snapshot ---
  function completeSimulation() {
    const now = new Date();
    const refId = generateReferenceId(now);
    const timestampStr = formatLocalTimestamp(now);
    const cfg = SCOPE_CONFIG[state.selectedScope] || SCOPE_CONFIG.full;

    // Capture immutable bilingual operator snapshot at completion time
    const operatorSnapshot = {
      ar: getOperatorIdentity(true),
      en: getOperatorIdentity(false)
    };

    state.simulatedReceiptData = {
      referenceId: refId,
      timestamp: timestampStr,
      scopeKey: state.selectedScope,
      sizeStr: cfg.size_str,
      operator: operatorSnapshot,
      statusBadgeAr: 'اكتملت المحاكاة',
      statusBadgeEn: 'Simulation Completed'
    };

    state.isSimulating = false;
    state.currentStage = 'receipt';
    updateStageVisibility();
    renderReceiptCard();

    const receiptSection = document.getElementById('rep-mb-receipt-section');
    if (receiptSection && typeof receiptSection.scrollIntoView === 'function') {
      receiptSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderReceiptCard() {
    if (!state.simulatedReceiptData) return;
    const isAr = getIsArabic();
    const data = state.simulatedReceiptData;
    const cfg = SCOPE_CONFIG[data.scopeKey] || SCOPE_CONFIG.full;

    const idEl = document.getElementById('rep-mb-receipt-id');
    const dateEl = document.getElementById('rep-mb-receipt-date');
    const scopeEl = document.getElementById('rep-mb-receipt-scope');
    const sizeEl = document.getElementById('rep-mb-receipt-size');
    const opEl = document.getElementById('rep-mb-receipt-operator');
    const statusEl = document.getElementById('rep-mb-receipt-status');

    if (idEl) idEl.textContent = data.referenceId;
    if (dateEl) dateEl.textContent = data.timestamp;
    if (scopeEl) scopeEl.textContent = isAr ? cfg.name_ar : cfg.name_en;
    if (sizeEl) sizeEl.textContent = data.sizeStr;

    // Use captured frozen snapshot exclusively — NEVER re-invokes getOperatorIdentity()
    if (opEl && data.operator) {
      opEl.textContent = isAr ? data.operator.ar : data.operator.en;
    }
    if (statusEl) {
      statusEl.textContent = isAr ? data.statusBadgeAr : data.statusBadgeEn;
    }
  }

  function resetToNewSimulation() {
    clearAllTimers();
    state.isSimulating = false;
    state.currentStage = 'setup';
    state.currentStepIndex = 0;
    state.simulatedReceiptData = null;

    const btnStart = document.getElementById('rep-mb-btn-start-simulation');
    if (btnStart) {
      btnStart.disabled = false;
      btnStart.removeAttribute('aria-busy');
    }

    updateStageVisibility();
    selectScope('full');

    const fillEl = document.getElementById('rep-sim-progress-fill');
    const pctEl = document.getElementById('rep-sim-progress-pct');
    const trackEl = document.querySelector('.rep-sim-progress-track');
    if (fillEl) fillEl.style.width = '0%';
    if (pctEl) pctEl.textContent = '0%';
    if (trackEl) trackEl.setAttribute('aria-valuenow', '0');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- 11. Bilingual Rendering Engine (Preserves State During Language Toggles) ---
  function renderBilingualUI() {
    const isAr = getIsArabic();
    const dict = isAr ? I18N.ar : I18N.en;

    const textMappings = [
      { id: 'rep-bc-reports', text: dict.breadcrumb_reports },
      { id: 'rep-bc-current', text: dict.breadcrumb_current },
      { id: 'rep-mb-badge-mock', text: dict.badge_mock },
      { id: 'rep-mb-page-title', text: dict.page_title },
      { id: 'rep-mb-page-subtitle', text: dict.page_subtitle },
      { id: 'rep-mb-btn-back-center-text', text: dict.btn_back_center },
      { id: 'rep-mb-step1-badge', text: dict.step1_badge },
      { id: 'rep-mb-step1-title', text: dict.step1_title },
      { id: 'rep-mb-step1-desc', text: dict.step1_desc },
      { id: 'rep-scope-full-title', text: dict.scope_full_title },
      { id: 'rep-scope-full-sub', text: dict.scope_full_sub },
      { id: 'rep-scope-trans-title', text: dict.scope_trans_title },
      { id: 'rep-scope-trans-sub', text: dict.scope_trans_sub },
      { id: 'rep-scope-docs-title', text: dict.scope_docs_title },
      { id: 'rep-scope-docs-sub', text: dict.scope_docs_sub },
      { id: 'rep-mb-summary-title', text: dict.summary_title },
      { id: 'rep-mb-summary-size-lbl', text: dict.summary_size_label },
      { id: 'rep-mb-summary-records-lbl', text: dict.summary_records_label },
      { id: 'rep-mb-summary-op-lbl', text: dict.summary_operator_label },
      { id: 'rep-mb-chk-badge', text: dict.checklist_badge },
      { id: 'rep-mb-chk-title', text: dict.checklist_title },
      { id: 'rep-mb-chk-desc', text: dict.checklist_desc },
      { id: 'rep-mb-step2-badge', text: dict.step2_badge },
      { id: 'rep-mb-step2-title', text: dict.step2_title },
      { id: 'rep-mb-disclaimer-title', text: dict.disclaimer_title },
      { id: 'rep-mb-disclaimer-text', text: dict.disclaimer_text },
      { id: 'rep-mb-btn-start-text', text: dict.btn_start_sim },
      { id: 'rep-mb-btn-cancel-text', text: dict.btn_cancel },
      { id: 'rep-mb-progress-badge', text: dict.progress_badge },
      { id: 'rep-mb-progress-title', text: dict.progress_title },
      { id: 'rep-mb-progress-note', text: dict.progress_note },
      { id: 'rep-mb-receipt-badge', text: dict.receipt_badge },
      { id: 'rep-mb-receipt-title', text: dict.receipt_title },
      { id: 'rep-mb-receipt-subtitle', text: dict.receipt_subtitle },
      { id: 'rep-mb-field-ref-lbl', text: dict.field_ref },
      { id: 'rep-mb-field-date-lbl', text: dict.field_date },
      { id: 'rep-mb-field-scope-lbl', text: dict.field_scope },
      { id: 'rep-mb-field-size-lbl', text: dict.field_size },
      { id: 'rep-mb-field-op-lbl', text: dict.field_operator },
      { id: 'rep-mb-field-status-lbl', text: dict.field_status },
      { id: 'rep-mb-receipt-disclaimer', text: dict.receipt_disclaimer },
      { id: 'rep-mb-btn-return-archive-text', text: dict.btn_return_archive },
      { id: 'rep-mb-btn-new-sim-text', text: dict.btn_new_sim },
      { id: 'acc-logout-desc', text: dict.logout_desc }
    ];

    textMappings.forEach(m => {
      const el = document.getElementById(m.id);
      if (el) el.textContent = m.text;
    });

    renderScopeSummary();
    renderChecklist();

    // LIVE LANGUAGE SWITCH: Immediately re-render active progress step text without resetting
    if (state.currentStage === 'progress') {
      const step = SIMULATION_STEPS[state.currentStepIndex] || SIMULATION_STEPS[0];
      const stepTextEl = document.getElementById('rep-sim-step-text');
      if (stepTextEl) {
        stepTextEl.textContent = isAr ? step.text_ar : step.text_en;
      }
    }

    // Preserve receipt with frozen snapshot during language switch
    if (state.currentStage === 'receipt') {
      renderReceiptCard();
    }
  }

  // --- 12. Initialization & Event Binding ---
  function init() {
    updateStageVisibility();
    selectScope(state.selectedScope);
    renderChecklist();
    renderBilingualUI();

    // Scope native radio change listeners
    const radioInputs = document.querySelectorAll('input[name="backup-scope"]');
    radioInputs.forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.checked) {
          selectScope(this.value);
        }
      });
    });

    // Start Simulation Button
    const btnStart = document.getElementById('rep-mb-btn-start-simulation');
    if (btnStart) {
      btnStart.addEventListener('click', startSimulation);
    }

    // Cancel / Return Button
    const btnCancel = document.getElementById('rep-mb-btn-cancel-flow');
    if (btnCancel) {
      btnCancel.addEventListener('click', function () {
        clearAllTimers();
        state.isSimulating = false;
        window.location.href = 'accounts-reports-backup.html';
      });
    }

    // Receipt Action: Return to Backup Archive Tab via Deep Link
    const btnReturnArchive = document.getElementById('rep-mb-btn-return-archive');
    if (btnReturnArchive) {
      btnReturnArchive.addEventListener('click', function () {
        window.location.href = 'accounts-reports-backup.html#backup-archive';
      });
    }

    // Receipt Action: Perform New Simulation
    const btnNewSim = document.getElementById('rep-mb-btn-new-simulation');
    if (btnNewSim) {
      btnNewSim.addEventListener('click', resetToNewSimulation);
    }

    // Register with shared workspace refresh hook (Language / Theme toggles)
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onPageRefresh === 'function') {
      window.AccountsWorkspace.onPageRefresh(function () {
        renderBilingualUI();
      });
    }

    // Page-leave / Unload Lifecycle Cleanup
    window.addEventListener('beforeunload', clearAllTimers);
    window.addEventListener('pagehide', clearAllTimers);

    // BFCache (Back/Forward Cache) Restoration Handling
    window.addEventListener('pageshow', function (event) {
      if (event.persisted && state.isSimulating) {
        clearAllTimers();
        resetToNewSimulation();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
