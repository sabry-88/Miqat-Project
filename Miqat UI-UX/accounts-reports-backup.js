/**
 * MIQAT ACCOUNTS WORKSPACE — PAGE 9: DAILY REPORTS & BACKUP CONTROLLER
 * 
 * Provides interactive state management, multi-tab coordination, mock data workflows,
 * standalone report details navigation (accounts-report-details.html), Excel (.xlsx) exports,
 * simulated manual backup execution, failure retry traceability, read-only restore audit log,
 * and high-density numeric storage capacity monitoring with zero progress bars.
 */

(function () {
  'use strict';

  // --- 1. Master Mock Data Catalog ---

  // Tourism Companies Master Catalog (Strict Data Isolation)
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
      total_pilgrims: 1040,
      collected_direct_egp: 3450000,
      collected_miqat_egp: 6320000,
      pending_collections_egp: 460000,
      settlements_completed_egp: 5780000,
      settlements_pending_egp: 540000,
      refunds_approved_egp: 230000,
      refunds_processing_egp: 55000,
      cancellations_count: 14,
      changes_count: 24
    }
  ];

  // Pre-configured Reports Catalog
  let reportsCatalog = [
    {
      id: 'REP-20261123-01',
      title_ar: 'تقرير المطابقة والعمليات المالية اليومي',
      title_en: 'Daily Financial Operations & Reconciliation',
      type_ar: 'تقرير يومي آلي',
      type_en: 'Automated Daily Report',
      scope: 'internal',
      category: 'all',
      date: '2026-11-23 09:30',
      period_ar: 'اليوم (23 نوفمبر 2026)',
      period_en: 'Today (23 Nov 2026)',
      size: '1.8 MB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261122-02',
      title_ar: 'تقرير تسويات شركات السياحة الأسبوعي',
      title_en: 'Weekly Tourism Company Settlements Report',
      type_ar: 'تقرير أسبوعي دوري',
      type_en: 'Periodic Weekly Report',
      scope: 'internal',
      category: 'settlements',
      date: '2026-11-22 18:00',
      period_ar: 'الأسبوع المنتهي في 22 نوفمبر 2026',
      period_en: 'Week ending 22 Nov 2026',
      size: '2.4 MB',
      format: 'XLSX / CSV',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261121-03',
      title_ar: 'كشف الحساب التشغيلي — شركة الدرة للسياحة',
      title_en: 'Operational Statement — Al-Durrah Tourism Co.',
      type_ar: 'تقرير شركة معزول',
      type_en: 'Isolated Company Report',
      scope: 'company',
      company_id: 'COMP-101',
      company_name_ar: 'شركة الدرة للسياحة',
      company_name_en: 'Al-Durrah Tourism Co.',
      category: 'all',
      date: '2026-11-21 14:15',
      period_ar: 'من 01 نوفمبر إلى 21 نوفمبر 2026',
      period_en: '01 Nov to 21 Nov 2026',
      size: '1.2 MB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261120-04',
      title_ar: 'سجل التحصيلات والمدفوعات الإلكترونية',
      title_en: 'Electronic Collections & Payments Ledger',
      type_ar: 'تقرير دوري',
      type_en: 'Periodic Report',
      scope: 'internal',
      category: 'collections',
      date: '2026-11-20 20:00',
      period_ar: 'من 14 نوفمبر إلى 20 نوفمبر 2026',
      period_en: '14 Nov to 20 Nov 2026',
      size: '3.1 MB',
      format: 'XLSX / CSV',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261119-05',
      title_ar: 'كشف حساب شركة نسك الهدى للسياحة',
      title_en: 'Company Statement — Nusuk Al-Huda Tourism',
      type_ar: 'تقرير شركة معزول',
      type_en: 'Isolated Company Report',
      scope: 'company',
      company_id: 'COMP-102',
      company_name_ar: 'شركة نسك الهدى للسياحة',
      company_name_en: 'Nusuk Al-Huda Tourism',
      category: 'all',
      date: '2026-11-19 11:20',
      period_ar: 'من 01 نوفمبر إلى 19 نوفمبر 2026',
      period_en: '01 Nov to 19 Nov 2026',
      size: '980 KB',
      format: 'XLSX / PDF',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261118-06',
      title_ar: 'تقرير طلبات الاسترداد والإلغاءات الشهري',
      title_en: 'Monthly Refunds & Cancellations Report',
      type_ar: 'تقرير شهري',
      type_en: 'Monthly Report',
      scope: 'internal',
      category: 'refunds',
      date: '2026-11-18 16:45',
      period_ar: 'شهر أكتوبر ونصف نوفمبر 2026',
      period_en: 'October & mid-November 2026',
      size: '1.9 MB',
      format: 'XLSX',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261117-07',
      title_ar: 'كشف الحساب التشغيلي — شركة هداية المعتمد للسياحة',
      title_en: 'Operational Statement — Hedaya Al-Moatamad Tourism',
      type_ar: 'تقرير شركة معزول',
      type_en: 'Isolated Company Report',
      scope: 'company',
      company_id: 'COMP-103',
      company_name_ar: 'شركة هداية المعتمد للسياحة',
      company_name_en: 'Hedaya Al-Moatamad Tourism',
      category: 'all',
      date: '2026-11-17 12:30',
      period_ar: 'من 01 نوفمبر إلى 17 نوفمبر 2026',
      period_en: '01 Nov to 17 Nov 2026',
      size: '1.4 MB',
      format: 'XLSX / CSV',
      status_ar: 'مكتمل ومتاح',
      status_en: 'Ready & Available',
      status_badge: 'status-pill-navy'
    },
    {
      id: 'REP-20261116-08',
      title_ar: 'التقرير الأسبوعي الدوري لمطابقة بوابات الدفع الإلكتروني',
      title_en: 'Weekly Electronic Payment Gateway Audit Report',
      type_ar: 'تقرير مجدول آلياً',
      type_en: 'Automated Scheduled Report',
      scope: 'internal',
      category: 'collections',
      date: '2026-11-16 08:00',
      period_ar: 'الأسبوع المنتهي في 16 نوفمبر 2026',
      period_en: 'Week ending 16 Nov 2026',
      size: '2.1 MB',
      format: 'XLSX / PDF',
      status_ar: 'مجدول ونشط',
      status_en: 'Scheduled & Active',
      status_badge: 'status-pill-blue'
    }
  ];

  // Master Permanent Backup Archive (Chronological: Year 2026 -> Months -> Days)
  let backupHistory = [
    {
      id: 'BK-20261123-0400',
      date: '2026-11-23 04:00',
      year: 2026,
      month: 11,
      day: 23,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.84,
      size_str: '2.84 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: 'a8f4c93b1e7d2580ef11bc4589d98214302174829adfac152763261981249764',
      duration: '4 دقائق و 12 ثانية',
      duration_en: '4m 12s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261122-1600',
      date: '2026-11-22 16:00',
      year: 2026,
      month: 11,
      day: 22,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.81,
      size_str: '2.81 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: '674bc28d9f1092e01b34a6efc19324081198539665bcfa903429188267491321',
      duration: '3 دقائق و 55 ثانية',
      duration_en: '3m 55s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261122-0400',
      date: '2026-11-22 04:00',
      year: 2026,
      month: 11,
      day: 22,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 0.42,
      size_str: '420 MB',
      status: 'failed',
      status_ar: 'فاشل (يحتاج تدقيق)',
      status_en: 'Failed (Needs Review)',
      status_badge: 'status-pill-amber',
      integrity: 'compromised',
      integrity_ar: 'غير مكتمل (انقطاع اتصال التخزين)',
      integrity_en: 'Incomplete (Storage Timeout)',
      sha256: 'INCOMPLETE_STREAM_TIMEOUT',
      duration: 'دقيقة واحدة (توقف)',
      duration_en: '1m (Aborted)',
      restore_status: 'never',
      restore_status_ar: 'غير قابلة للاسترجاع',
      restore_status_en: 'Not Restorable',
      failure_reason: 'انقطاع مؤقت في الاتصال بوحدة التخزين السحابية الثانوية (S3 Replica Connection Timeout)',
      failure_reason_en: 'Secondary cloud storage replica connection timeout',
      retried: false
    },
    {
      id: 'BK-20261121-1600',
      date: '2026-11-21 16:00',
      year: 2026,
      month: 11,
      day: 21,
      type: 'manual',
      type_ar: 'يدوي (موظف حسابات)',
      type_en: 'Manual (Accounts Officer)',
      initiator: 'ahmed',
      initiator_ar: 'أحمد صبري (موظف حسابات مالية)',
      initiator_en: 'Ahmed Sabry (Accounts Officer)',
      scope: 'trans',
      scope_ar: 'سجل المعاملات والتسويات المالية',
      scope_en: 'Transactions & Financial Ledgers',
      size_gb: 1.65,
      size_str: '1.65 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: 'bf35e128919ac90342918826749132174829adfac152763261981249764589d9',
      duration: '2 دقيقة و 40 ثانية',
      duration_en: '2m 40s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261120-1830-PRE',
      date: '2026-11-20 18:30',
      year: 2026,
      month: 11,
      day: 20,
      type: 'pre',
      type_ar: 'ما قبل التحديث (Pre-deployment)',
      type_en: 'Pre-deployment Snapshot',
      initiator: 'devops',
      initiator_ar: 'م. خالد المنصوري (DevOps Lead)',
      initiator_en: 'Eng. Khaled Al-Mansouri (DevOps Lead)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.82,
      size_str: '2.82 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: '5d41402abc4b2a76b9719d911017c592233f276f50f4a86b51bf494056230872',
      duration: '4 دقائق و 05 ثواني',
      duration_en: '4m 05s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261120-0400',
      date: '2026-11-20 04:00',
      year: 2026,
      month: 11,
      day: 20,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.80,
      size_str: '2.80 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      duration: '3 دقائق و 48 ثانية',
      duration_en: '3m 48s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261119-1600',
      date: '2026-11-19 16:00',
      year: 2026,
      month: 11,
      day: 19,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.78,
      size_str: '2.78 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      duration: '3 دقائق و 50 ثانية',
      duration_en: '3m 50s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261115-0400',
      date: '2026-11-15 04:00',
      year: 2026,
      month: 11,
      day: 15,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.75,
      size_str: '2.75 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      duration: '4 دقائق و 01 ثانية',
      duration_en: '4m 01s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261108-1600',
      date: '2026-11-08 16:00',
      year: 2026,
      month: 11,
      day: 8,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.70,
      size_str: '2.70 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: 'a127a931b268426027a001b979313cf8b3941ac2f0a2334f593ccf967ec1243b',
      duration: '3 دقائق و 44 ثانية',
      duration_en: '3m 44s',
      restore_status: 'used',
      restore_status_ar: 'تم استرجاعها سابقاً (بيئة فحص)',
      restore_status_en: 'Previously Restored (Staging)',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261105-2200-PRE',
      date: '2026-11-05 22:00',
      year: 2026,
      month: 11,
      day: 5,
      type: 'pre',
      type_ar: 'ما قبل التحديث (Pre-deployment)',
      type_en: 'Pre-deployment Snapshot',
      initiator: 'devops',
      initiator_ar: 'م. خالد المنصوري (DevOps Lead)',
      initiator_en: 'Eng. Khaled Al-Mansouri (DevOps Lead)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.68,
      size_str: '2.68 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: '9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee8f0',
      duration: '4 دقائق و 15 ثانية',
      duration_en: '4m 15s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261031-1600',
      date: '2026-10-31 16:00',
      year: 2026,
      month: 10,
      day: 31,
      type: 'manual',
      type_ar: 'يدوي (موظف حسابات)',
      type_en: 'Manual (Accounts Officer)',
      initiator: 'ahmed',
      initiator_ar: 'أحمد صبري (موظف حسابات مالية)',
      initiator_en: 'Ahmed Sabry (Accounts Officer)',
      scope: 'trans',
      scope_ar: 'سجل المعاملات والتسويات المالية',
      scope_en: 'Transactions & Financial Ledgers',
      size_gb: 1.58,
      size_str: '1.58 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      duration: '2 دقيقة و 22 ثانية',
      duration_en: '2m 22s',
      restore_status: 'never',
      restore_status_ar: 'لم تُسترجع',
      restore_status_en: 'Never Restored',
      failure_reason: null,
      retried: false
    },
    {
      id: 'BK-20261014-0400',
      date: '2026-10-14 04:00',
      year: 2026,
      month: 10,
      day: 14,
      type: 'auto',
      type_ar: 'تلقائي (كل 12 س)',
      type_en: 'Automatic (Every 12h)',
      initiator: 'system',
      initiator_ar: 'مجدول النظام الآلي (System Scheduler)',
      initiator_en: 'System Scheduler (Automated)',
      scope: 'full',
      scope_ar: 'النظام المتكامل وقاعدة البيانات',
      scope_en: 'Full System & Database',
      size_gb: 2.55,
      size_str: '2.55 GB',
      status: 'success',
      status_ar: 'ناجح ومكتمل',
      status_en: 'Successful',
      status_badge: 'status-pill-navy',
      integrity: 'verified',
      integrity_ar: 'متحقق ومطابق 100% (SHA-256)',
      integrity_en: '100% Verified (SHA-256)',
      sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      duration: '3 دقائق و 30 ثانية',
      duration_en: '3m 30s',
      restore_status: 'used',
      restore_status_ar: 'تم استرجاعها سابقاً (تدقيق معزول)',
      restore_status_en: 'Previously Restored (Audit Sandbox)',
      failure_reason: null,
      retried: false
    }
  ];

  // Master Restore History (READ ONLY - Strictly restricted to authorized Admins)
  const restoreHistory = [
    {
      id: 'RST-20261108-01',
      source_bk_id: 'BK-20261108-1600',
      date: '2026-11-09 10:15',
      executed_by: 'م. خالد المنصوري (DevOps Lead)',
      executed_by_en: 'Eng. Khaled Al-Mansouri (DevOps Lead)',
      target_env_ar: 'بيئة الاختبار المؤقتة (Staging Replica)',
      target_env_en: 'Staging Environment Replica',
      scope_ar: 'قاعدة بيانات الحجوزات والعمليات',
      scope_en: 'Bookings & Operations DB',
      status_ar: 'ناجح ومطابق 100%',
      status_en: 'Successful & Verified',
      status_badge: 'status-pill-navy',
      duration: '14 دقيقة و 20 ثانية',
      duration_en: '14m 20s',
      notes_ar: 'تم استرجاع النسخة للاختبار الدوري السنوي لسرعة التعافي في الكوارث (DR Drill). تمت مطابقة كافة قيود الحسابات بنجاح.',
      notes_en: 'Restored for periodic disaster recovery drill (DR Drill). All financial ledger entries verified successfully.'
    },
    {
      id: 'RST-20261015-02',
      source_bk_id: 'BK-20261014-0400',
      date: '2026-10-15 14:40',
      executed_by: 'م. سارة العتيبي (Systems Architect)',
      executed_by_en: 'Eng. Sara Al-Otaibi (Systems Architect)',
      target_env_ar: 'خادم التدقيق المالي المعزول (Audit Sandbox)',
      target_env_en: 'Isolated Financial Audit Sandbox',
      scope_ar: 'سجل التحصيلات والتسويات',
      scope_en: 'Collections & Settlements Ledger',
      status_ar: 'ناجح ومطابق 100%',
      status_en: 'Successful & Verified',
      status_badge: 'status-pill-navy',
      duration: '11 دقيقة و 45 ثانية',
      duration_en: '11m 45s',
      notes_ar: 'استرجاع معزول ومؤقت للتحقق من مطابقة التسويات البنكية للربع الثالث. تم إنهاء البيئة بعد اكتمال التدقيق.',
      notes_en: 'Temporary isolated restore to audit Q3 bank settlements. Environment decommissioned after audit.'
    }
  ];

  // Storage Stats (Thresholds: 70% Early Warning, 85% High Usage, 95% Critical)
  const storageData = {
    total_gb: 10240,       // 10.00 TB
    used_gb: 7516,         // 7.34 TB (~73.4%)
    remaining_gb: 2724,    // 2.66 TB (~26.6%)
    usage_percent: 73.4,
    thresholds: {
      early_warning: 70,
      high_usage: 85,
      critical: 95
    },
    growth_metrics: {
      avg_backup_gb: 2.82,
      monthly_consumption_gb: 169.2,
      est_months_to_full: 16.1,
      est_days_to_full: 483
    },
    category_breakdown: [
      {
        id: 'full_db',
        name_ar: 'النسخ المتكاملة لقواعد البيانات (Full DB)',
        name_en: 'Full Database Snapshots',
        size_tb: 4.82,
        percent: 64.1,
        color: 'var(--color-primary)',
        encryption: 'AES-256-GCM',
        schedule_ar: 'تلقائي كل 12 ساعة',
        schedule_en: 'Auto every 12h',
        integrity: 'SHA-256 Verified',
        last_snapshot: '2026-11-23 04:00'
      },
      {
        id: 'ledgers',
        name_ar: 'سجلات الحسابات والتدقيق المالي (Ledgers)',
        name_en: 'Financial Ledgers & Audit Logs',
        size_tb: 1.45,
        percent: 19.3,
        color: 'var(--color-accent)',
        encryption: 'AES-256-GCM',
        schedule_ar: 'تلقائي كل 12 ساعة',
        schedule_en: 'Auto every 12h',
        integrity: 'SHA-256 Verified',
        last_snapshot: '2026-11-23 04:00'
      },
      {
        id: 'docs',
        name_ar: 'المستندات والإيصالات الرقمية (Docs)',
        name_en: 'Digital Receipts & Documents',
        size_tb: 0.89,
        percent: 11.8,
        color: 'var(--color-secondary-blue)',
        encryption: 'AES-256-GCM',
        schedule_ar: 'يومي عند منتصف الليل',
        schedule_en: 'Daily at 00:00',
        integrity: 'SHA-256 Verified',
        last_snapshot: '2026-11-23 00:00'
      },
      {
        id: 'pre_deploy',
        name_ar: 'لقطات ما قبل التحديث (Pre-deployment)',
        name_en: 'Pre-deployment Snapshots',
        size_tb: 0.35,
        percent: 4.8,
        color: 'var(--color-text-muted)',
        encryption: 'AES-256-GCM',
        schedule_ar: 'يدوي بواسطة DevOps',
        schedule_en: 'Manual DevOps Trigger',
        integrity: 'SHA-256 Verified',
        last_snapshot: '2026-11-20 18:30'
      }
    ],
    time_breakdown: [
      { period_ar: 'شهر نوفمبر 2026 (الحالي)', period_en: 'November 2026 (Current)', size_gb: 342, count: 46 },
      { period_ar: 'شهر أكتوبر 2026', period_en: 'October 2026', size_gb: 510, count: 62 },
      { period_ar: 'الربع الثالث 2026 (يوليو - سبتمبر)', period_en: 'Q3 2026 (Jul - Sep)', size_gb: 1480, count: 184 },
      { period_ar: 'الأرشيف التاريخي التراكمي (السابق)', period_en: 'Cumulative Historical Archive', size_gb: 5184, count: 620 }
    ]
  };

  // --- 2. Active Application State ---
  let activeTab = 'reports-center';

  let reportFilters = {
    scope: 'internal',     // 'internal' | 'company'
    frequency: 'daily',    // 'daily' | 'weekly' | 'monthly' | 'custom'
    category: 'all',       // 'all' | 'bookings' | 'collections' | 'refunds' | 'cancellations' | 'settlements' | 'trip_changes' | 'cash_receipts'
    companyCode: '',
    fromDate: '2026-11-01',
    toDate: '2026-11-23'
  };

  let backupFilters = {
    dateFrom: '',
    dateTo: '',
    type: 'all',           // 'all' | 'auto' | 'manual' | 'pre'
    status: 'all',         // 'all' | 'success' | 'failed' | 'progress'
    initiator: 'all',      // 'all' | 'system' | 'ahmed' | 'devops'
    scope: 'all',          // 'all' | 'full' | 'trans' | 'docs'
    integrity: 'all',      // 'all' | 'verified' | 'compromised'
    restoreStatus: 'all',  // 'all' | 'never' | 'used'
    searchQuery: '',
    sort: 'date_desc',
    page: 1,
    pageSize: 6
  };

  // --- 3. DOM Cache ---
  let dom = {};

  function initDOM() {
    dom = {
      // Tab Buttons & Panes
      tabBtnReports: document.getElementById('tab-btn-reports'),
      tabBtnBackup: document.getElementById('tab-btn-backup'),
      tabBtnStorage: document.getElementById('tab-btn-storage'),
      paneReports: document.getElementById('pane-reports-center'),
      paneBackup: document.getElementById('pane-backup-archive'),
      paneStorage: document.getElementById('pane-storage-inventory'),

      // Section 1: Reports Center Form Controls
      scopeRadios: document.querySelectorAll('input[name="rep_scope"]'),
      freqRadios: document.querySelectorAll('input[name="rep_frequency"]'),
      categoryGroup: document.getElementById('rep-category-group'),
      categorySelect: document.getElementById('rep-filter-category'),
      companyGroup: document.getElementById('rep-company-group'),
      companySelect: document.getElementById('rep-filter-company'),
      dateRangeGroup: document.getElementById('rep-date-range-group'),
      fromDateInput: document.getElementById('rep-from-date'),
      toDateInput: document.getElementById('rep-to-date'),
      btnGenerateReport: document.getElementById('rep-btn-generate'),
      btnResetReportFilters: document.getElementById('rep-btn-reset-filters'),
      reportsTableBody: document.getElementById('rep-reports-table-body'),

      // Live Generator Summary & Validation
      summaryScopeVal: document.getElementById('rep-summary-scope-val'),
      summaryPeriodVal: document.getElementById('rep-summary-period-val'),
      summaryStatusPill: document.getElementById('rep-summary-status-pill'),
      validationMsg: document.getElementById('rep-company-validation-msg'),

      // Report History Search & Filters
      historySearch: document.getElementById('rep-history-search'),
      historyScopeSelect: document.getElementById('rep-history-scope-select'),
      historyStatusSelect: document.getElementById('rep-history-status-select'),
      historyResetBtn: document.getElementById('rep-history-reset-btn'),
      historyCountBadge: document.getElementById('rep-history-count-badge'),
      historyBadge: document.getElementById('rep-history-badge'),

      // Backup Section Controls
      btnQuickManualBackup: document.getElementById('rep-btn-quick-backup'),
      btnManualBackupSection: document.getElementById('rep-btn-manual-backup'),
      btnExportInventoryExcel: document.getElementById('rep-btn-inventory-report'),

      // Backup Filters
      bkSearchInput: document.getElementById('rep-bk-search-input'),
      bkTypeSelect: document.getElementById('rep-bk-filter-type'),
      bkStatusSelect: document.getElementById('rep-bk-filter-status'),
      bkInitiatorSelect: document.getElementById('rep-bk-filter-initiator'),
      bkScopeSelect: document.getElementById('rep-bk-filter-scope'),
      bkIntegritySelect: document.getElementById('rep-bk-filter-integrity'),
      bkRestoreSelect: document.getElementById('rep-bk-filter-restore'),
      bkFromDate: document.getElementById('rep-bk-from-date'),
      bkToDate: document.getElementById('rep-bk-to-date'),
      bkSortSelect: document.getElementById('rep-bk-sort-select'),
      btnResetBkFilters: document.getElementById('rep-btn-reset-bk-filters'),
      bkActiveFilterBadge: document.getElementById('rep-bk-active-filter-badge'),
      bkResultCountText: document.getElementById('rep-bk-result-count-text'),

      // Backup Tables & Pagination
      backupTableBody: document.getElementById('rep-backup-table-body'),
      btnBkPrev: document.getElementById('rep-bk-btn-prev'),
      btnBkNext: document.getElementById('rep-bk-btn-next'),
      bkPageInfo: document.getElementById('rep-bk-page-info'),
      restoreTableBody: document.getElementById('rep-restore-table-body'),

      // Failed Backup Retry Banner
      failedAlertBanner: document.getElementById('rep-failed-alert-banner'),
      btnRetryFailedBanner: document.getElementById('rep-btn-retry-failed-banner'),
      failedReasonText: document.getElementById('rep-failed-reason-text'),


      // Section 3: Storage Elements
      storageTotalVal: document.getElementById('rep-st-total-val'),
      storageUsedVal: document.getElementById('rep-st-used-val'),
      storageRemainingVal: document.getElementById('rep-st-remaining-val'),
      storagePercentVal: document.getElementById('rep-st-percent-val'),
      storageAlertBanner: document.getElementById('rep-st-alert-banner'),
      storageCatBreakdownGrid: document.getElementById('rep-st-cat-breakdown-grid'),
      storagePeriodBreakdownGrid: document.getElementById('rep-st-period-breakdown-grid')
    };
  }

  // --- 4. Helpers & Formatters ---

  function isRTL() {
    return document.documentElement.getAttribute('dir') === 'rtl';
  }

  function formatEGP(val) {
    if (val === null || val === undefined || isNaN(val)) return '0 ج.م';
    return Number(val).toLocaleString('ar-EG') + ' ج.م';
  }

  function formatEGP_EN(val) {
    if (val === null || val === undefined || isNaN(val)) return 'EGP 0';
    return 'EGP ' + Number(val).toLocaleString('en-US');
  }

  // --- 5. Tabs Navigation Controller ---

  function setupTabs() {
    const tabs = [
      { btn: dom.tabBtnReports, pane: dom.paneReports, id: 'reports-center' },
      { btn: dom.tabBtnBackup, pane: dom.paneBackup, id: 'backup-archive' },
      { btn: dom.tabBtnStorage, pane: dom.paneStorage, id: 'storage-inventory' }
    ];

    function activateTab(tabId) {
      const target = tabs.find(t => t.id === tabId);
      if (!target || !target.btn || !target.pane) return;
      tabs.forEach(item => {
        if (!item.btn || !item.pane) return;
        item.btn.classList.remove('is-active');
        item.btn.setAttribute('aria-selected', 'false');
        item.pane.classList.remove('is-active');
        item.pane.style.display = 'none';
      });
      target.btn.classList.add('is-active');
      target.btn.setAttribute('aria-selected', 'true');
      target.pane.classList.add('is-active');
      target.pane.style.display = 'block';
      activeTab = target.id;

      if (target.id === 'backup-archive') {
        renderBackupTable();
        renderRestoreTable();
        updateFailedBackupAlertBanner();
      } else if (target.id === 'storage-inventory') {
        renderStorageSection();
      }
    }

    tabs.forEach(t => {
      if (!t.btn) return;
      t.btn.addEventListener('click', function () {
        activateTab(t.id);
      });
    });

    // Hash deep-link activation (e.g. accounts-reports-backup.html#backup-archive)
    function checkHashDeepLink() {
      const hash = window.location.hash ? window.location.hash.substring(1) : '';
      if (hash && tabs.some(t => t.id === hash)) {
        activateTab(hash);
      }
    }

    checkHashDeepLink();
    window.addEventListener('hashchange', checkHashDeepLink);
  }

  // --- 6. Section 1: Reports Center Controller ---

  let activeExportReport = null;
  let selectedExportFormat = 'xlsx';

  function populateCompanySelect() {
    if (!dom.companySelect) return;
    const rtl = isRTL();
    const currentVal = dom.companySelect.value || reportFilters.companyCode;
    dom.companySelect.innerHTML = `
      <option value="" disabled ${!currentVal ? 'selected' : ''}>${rtl ? '— اختر شركة سياحة معتمدة —' : '— Select Contracted Company —'}</option>
      ` + TOURISM_COMPANIES.map(c => `
      <option value="${c.id}" ${currentVal === c.id ? 'selected' : ''}>${rtl ? c.name_ar : c.name_en} (${c.license} — ${c.city})</option>
    `).join('');
  }

  function setupReportForm() {
    // Populate Companies in Select Dropdown
    if (dom.companySelect) {
      populateCompanySelect();

      dom.companySelect.addEventListener('change', function () {
        reportFilters.companyCode = this.value;
        if (dom.validationMsg) dom.validationMsg.style.display = 'none';
        updateLiveSummary();
      });
    }

    if (dom.categorySelect) {
      dom.categorySelect.addEventListener('change', function () {
        reportFilters.category = this.value;
        updateLiveSummary();
      });
    }

    // Scope Radio Change Handler
    if (dom.scopeRadios) {
      dom.scopeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
          reportFilters.scope = this.value;
          dom.scopeRadios.forEach(r => {
            const chip = r.closest('label')?.querySelector('.acc-chip-btn');
            if (chip) chip.classList.toggle('is-active', r.checked);
          });
          if (dom.validationMsg) dom.validationMsg.style.display = 'none';
          updateScopeFormVisibility();
          updateLiveSummary();
        });
      });
    }

    // Frequency Radio Change Handler
    if (dom.freqRadios) {
      dom.freqRadios.forEach(radio => {
        radio.addEventListener('change', function () {
          reportFilters.frequency = this.value;
          dom.freqRadios.forEach(r => {
            const chip = r.closest('label')?.querySelector('.acc-chip-btn');
            if (chip) chip.classList.toggle('is-active', r.checked);
          });
          updateDateRangeVisibility();
          updateLiveSummary();
        });
      });
    }

    // Date inputs
    if (dom.fromDateInput) {
      dom.fromDateInput.addEventListener('change', function () {
        reportFilters.fromDate = this.value;
        updateLiveSummary();
      });
    }
    if (dom.toDateInput) {
      dom.toDateInput.addEventListener('change', function () {
        reportFilters.toDate = this.value;
        updateLiveSummary();
      });
    }

    // Reset Form Filters
    if (dom.btnResetReportFilters) {
      dom.btnResetReportFilters.addEventListener('click', function () {
        reportFilters.scope = 'internal';
        reportFilters.frequency = 'daily';
        reportFilters.category = 'all';
        reportFilters.companyCode = '';
        reportFilters.fromDate = '2026-11-01';
        reportFilters.toDate = '2026-11-23';

        const defaultScopeRadio = document.querySelector('input[name="rep_scope"][value="internal"]');
        if (defaultScopeRadio) defaultScopeRadio.checked = true;

        const defaultFreqRadio = document.querySelector('input[name="rep_frequency"][value="daily"]');
        if (defaultFreqRadio) defaultFreqRadio.checked = true;

        dom.scopeRadios.forEach(r => {
          const chip = r.closest('label')?.querySelector('.acc-chip-btn');
          if (chip) chip.classList.toggle('is-active', r.value === 'internal');
        });
        dom.freqRadios.forEach(r => {
          const chip = r.closest('label')?.querySelector('.acc-chip-btn');
          if (chip) chip.classList.toggle('is-active', r.value === 'daily');
        });

        if (dom.categorySelect) dom.categorySelect.value = 'all';
        if (dom.companySelect) dom.companySelect.value = '';
        if (dom.fromDateInput) dom.fromDateInput.value = '2026-11-01';
        if (dom.toDateInput) dom.toDateInput.value = '2026-11-23';
        if (dom.validationMsg) dom.validationMsg.style.display = 'none';

        updateScopeFormVisibility();
        updateDateRangeVisibility();
        updateLiveSummary();
      });
    }

    // History Search and Filters
    if (dom.historySearch) {
      dom.historySearch.addEventListener('input', renderReportsTable);
    }
    if (dom.historyScopeSelect) {
      dom.historyScopeSelect.addEventListener('change', renderReportsTable);
    }
    if (dom.historyStatusSelect) {
      dom.historyStatusSelect.addEventListener('change', renderReportsTable);
    }
    if (dom.historyResetBtn) {
      dom.historyResetBtn.addEventListener('click', function () {
        if (dom.historySearch) dom.historySearch.value = '';
        if (dom.historyScopeSelect) dom.historyScopeSelect.value = 'all';
        if (dom.historyStatusSelect) dom.historyStatusSelect.value = 'all';
        renderReportsTable();
      });
    }

    // Generate & Preview Button -> Navigates to accounts-report-details.html
    if (dom.btnGenerateReport) {
      dom.btnGenerateReport.addEventListener('click', function () {
        generateAndPreviewReport();
      });
    }

    // Initial Form State
    updateScopeFormVisibility();
    updateDateRangeVisibility();
    updateLiveSummary();
    renderReportsTable();
  }

  function updateLiveSummary() {
    const rtl = isRTL();
    const isCompany = reportFilters.scope === 'company';

    if (dom.summaryScopeVal) {
      if (isCompany) {
        const comp = TOURISM_COMPANIES.find(c => c.id === reportFilters.companyCode);
        if (comp) {
          dom.summaryScopeVal.textContent = rtl
            ? `تقرير شركة سياحة: ${comp.name_ar} (${comp.license})`
            : `Company Report: ${comp.name_en} (${comp.license})`;
        } else {
          dom.summaryScopeVal.textContent = rtl
            ? 'تقرير شركة سياحة (معزول — بانتظار تحديد الشركة)'
            : 'Tourism Company Report (Isolated — Please select company)';
        }
      } else {
        const catText = dom.categorySelect?.options[dom.categorySelect.selectedIndex]?.text || '';
        dom.summaryScopeVal.textContent = rtl
          ? `تقارير ميقات الداخلية: ${catText}`
          : `Miqat Internal: ${catText}`;
      }
    }

    if (dom.summaryPeriodVal) {
      const from = dom.fromDateInput?.value || reportFilters.fromDate;
      const to = dom.toDateInput?.value || reportFilters.toDate;
      let freqLabel = rtl ? 'تقرير يومي' : 'Daily Report';
      if (reportFilters.frequency === 'weekly') freqLabel = rtl ? 'تقرير أسبوعي' : 'Weekly Report';
      else if (reportFilters.frequency === 'monthly') freqLabel = rtl ? 'تقرير شهري' : 'Monthly Report';
      else if (reportFilters.frequency === 'custom') freqLabel = rtl ? 'نطاق مخصص' : 'Custom Range';

      dom.summaryPeriodVal.textContent = `${freqLabel} (${from} ${rtl ? 'إلى' : 'to'} ${to})`;
    }

    if (dom.summaryStatusPill) {
      if (isCompany && !reportFilters.companyCode) {
        dom.summaryStatusPill.className = 'acc-status-pill status-pill-amber';
        dom.summaryStatusPill.textContent = rtl ? 'بانتظار تحديد الشركة' : 'Awaiting Company Selection';
      } else {
        dom.summaryStatusPill.className = 'acc-status-pill status-pill-navy';
        dom.summaryStatusPill.textContent = rtl ? 'جاهز للمعاينة والتصدير' : 'Ready for Preview & Export';
      }
    }
  }

  function updateScopeFormVisibility() {
    const isCompany = reportFilters.scope === 'company';
    if (dom.companyGroup) dom.companyGroup.style.display = isCompany ? 'block' : 'none';
    if (dom.categoryGroup) dom.categoryGroup.style.display = isCompany ? 'none' : 'block';
  }

  function updateDateRangeVisibility() {
    if (dom.fromDateInput && dom.toDateInput) {
      const today = '2026-11-23';
      if (reportFilters.frequency === 'daily') {
        dom.fromDateInput.value = today;
        dom.toDateInput.value = today;
      } else if (reportFilters.frequency === 'weekly') {
        dom.fromDateInput.value = '2026-11-16';
        dom.toDateInput.value = today;
      } else if (reportFilters.frequency === 'monthly') {
        dom.fromDateInput.value = '2026-11-01';
        dom.toDateInput.value = today;
      }
      reportFilters.fromDate = dom.fromDateInput.value;
      reportFilters.toDate = dom.toDateInput.value;
    }
  }

  function generateAndPreviewReport() {
    // Read Form Values
    if (dom.categorySelect) reportFilters.category = dom.categorySelect.value;
    if (dom.companySelect) reportFilters.companyCode = dom.companySelect.value;
    if (dom.fromDateInput && dom.fromDateInput.value) reportFilters.fromDate = dom.fromDateInput.value;
    if (dom.toDateInput && dom.toDateInput.value) reportFilters.toDate = dom.toDateInput.value;

    const isCompany = reportFilters.scope === 'company';

    if (isCompany && !reportFilters.companyCode) {
      if (dom.validationMsg) dom.validationMsg.style.display = 'flex';
      if (dom.companySelect) dom.companySelect.focus();
      return;
    }

    if (dom.validationMsg) dom.validationMsg.style.display = 'none';

    let reportData = null;

    if (isCompany) {
      const comp = TOURISM_COMPANIES.find(c => c.id === reportFilters.companyCode) || TOURISM_COMPANIES[0];
      reportData = buildCompanyIsolatedReport(comp);
    } else {
      reportData = buildInternalMiqatReport();
    }

    // Cache generated report in sessionStorage for accounts-report-details.html
    try {
      sessionStorage.setItem('miqat_active_report', JSON.stringify(reportData));
    } catch (e) {
      console.warn('SessionStorage cache warning', e);
    }

    // Navigate cleanly to standalone details view
    const params = new URLSearchParams();
    params.set('scope', reportData.scope);
    if (isCompany && reportData.company) {
      params.set('companyId', reportData.company.id);
    }
    params.set('from', reportFilters.fromDate);
    params.set('to', reportFilters.toDate);
    window.location.href = `accounts-report-details.html?${params.toString()}`;
  }

  function buildCompanyIsolatedReport(comp) {
    const rtl = isRTL();
    return {
      scope: 'company',
      reportId: 'REP-COMP-' + comp.id + '-' + Date.now().toString().slice(-4),
      title: rtl ? `كشف حساب تشغيلي ومالي معزول — ${comp.name_ar}` : `Isolated Operational & Financial Statement — ${comp.name_en}`,
      company: comp,
      dateGenerated: '2026-11-23 17:30',
      period: `${reportFilters.fromDate} ${rtl ? 'إلى' : 'to'} ${reportFilters.toDate}`,
      summaryKPIs: [
        { label: rtl ? 'الرحلات التشغيلية النشطة' : 'Active Operational Trips', val: comp.active_trips + ' ' + (rtl ? 'رحلات' : 'trips'), class: 'kpi-blue' },
        { label: rtl ? 'إجمالي الحجوزات والمعتمرين' : 'Total Bookings / Pilgrims', val: `${comp.total_bookings} (${comp.total_pilgrims} ${rtl ? 'معتمر' : 'pax'})`, class: 'kpi-primary' },
        { label: rtl ? 'مبالغ محصلة مباشرة من الشركة' : 'Direct Company Collections', val: rtl ? formatEGP(comp.collected_direct_egp) : formatEGP_EN(comp.collected_direct_egp), class: 'kpi-primary' },
        { label: rtl ? 'مبالغ محصلة عبر منصة ميقات' : 'Miqat Platform Collections', val: rtl ? formatEGP(comp.collected_miqat_egp) : formatEGP_EN(comp.collected_miqat_egp), class: 'kpi-primary' },
        { label: rtl ? 'مبالغ معلقة قيد التحصيل' : 'Pending Collections', val: rtl ? formatEGP(comp.pending_collections_egp) : formatEGP_EN(comp.pending_collections_egp), class: 'kpi-warning' },
        { label: rtl ? 'تسويات مكتملة ومحولة للشركة' : 'Completed Company Settlements', val: rtl ? formatEGP(comp.settlements_completed_egp) : formatEGP_EN(comp.settlements_completed_egp), class: 'kpi-primary' },
        { label: rtl ? 'تسويات جارية قيد الاستحقاق' : 'Pending Settlements Due', val: rtl ? formatEGP(comp.settlements_pending_egp) : formatEGP_EN(comp.settlements_pending_egp), class: 'kpi-warning' },
        { label: rtl ? 'استردادات منفذة للعملاء' : 'Approved Customer Refunds', val: rtl ? formatEGP(comp.refunds_approved_egp) : formatEGP_EN(comp.refunds_approved_egp), class: 'kpi-secondary' },
        { label: rtl ? 'استردادات قيد المعالجة' : 'Refunds in Process', val: rtl ? formatEGP(comp.refunds_processing_egp) : formatEGP_EN(comp.refunds_processing_egp), class: 'kpi-warning' }
      ],
      detailRecords: [
        { ref: 'BKG-7701', customer: rtl ? 'محمود عبد الرحيم' : 'Mahmoud Abdel-Rahim', trip: rtl ? 'رحلة الوفاء 14 يوم' : 'Al-Wafaa 14-Day Trip', pax: 4, direct_amt: 60000, miqat_amt: 90000, pending_amt: 0, status: rtl ? 'مؤكد ومكتمل' : 'Confirmed' },
        { ref: 'BKG-7714', customer: rtl ? 'فاطمة إبراهيم السيد' : 'Fatma Ibrahim El-Sayed', trip: rtl ? 'رحلة النور 10 أيام' : 'Al-Noor 10-Day Trip', pax: 2, direct_amt: 35000, miqat_amt: 45000, pending_amt: 10000, status: rtl ? 'تحصيل جزئي' : 'Partial' },
        { ref: 'BKG-7729', customer: rtl ? 'حسين كمال الدين' : 'Hussein Kamal Eldin', trip: rtl ? 'رحلة التيسير الاقتصادية' : 'Al-Tayseer Economy', pax: 5, direct_amt: 50000, miqat_amt: 125000, pending_amt: 0, status: rtl ? 'مؤكد ومكتمل' : 'Confirmed' },
        { ref: 'BKG-7740', customer: rtl ? 'نجوى عبد الرحمن' : 'Nagwa Abdel-Rahman', trip: rtl ? 'رحلة الوفاء 14 يوم' : 'Al-Wafaa 14-Day Trip', pax: 3, direct_amt: 0, miqat_amt: 110000, pending_amt: 15000, status: rtl ? 'قيد استكمال الدفع' : 'Pending Payment' },
        { ref: 'BKG-7755', customer: rtl ? 'طارق سامي عبد الله' : 'Tarek Sami Abdullah', trip: rtl ? 'رحلة الهدى المميزة' : 'Al-Huda Premium Trip', pax: 2, direct_amt: 40000, miqat_amt: 70000, pending_amt: 0, status: rtl ? 'مؤكد ومكتمل' : 'Confirmed' }
      ],
      accountingNote: rtl
        ? 'بيانات معزولة خاصة بشركة السياحة المحددة فقط وفقاً لضوابط الخصوصية المعيارية. لا تتضمن عمولات أو مذكرات داخلية خاصة بمنصة ميقات.'
        : 'Strictly isolated tourism company data per compliance standards. Contains zero internal Miqat commissions or internal notes.'
    };
  }

  function buildInternalMiqatReport() {
    const rtl = isRTL();
    return {
      scope: 'internal',
      reportId: 'REP-INT-' + Date.now().toString().slice(-4),
      title: rtl ? 'التقرير المالي والتشغيلي المتكامل — منصة ميقات' : 'Comprehensive Financial & Operational Report — Miqat Platform',
      dateGenerated: '2026-11-23 17:30',
      period: `${reportFilters.fromDate} ${rtl ? 'إلى' : 'to'} ${reportFilters.toDate}`,
      summaryKPIs: [
        { label: rtl ? 'إجمالي الحجوزات المسجلة' : 'Total Registered Bookings', val: '1,429 ' + (rtl ? 'حجز' : 'bookings'), class: 'kpi-primary' },
        { label: rtl ? 'المبالغ المحصلة والمعتمدة فعلياً' : 'Approved & Cleared Collections', val: rtl ? formatEGP(22060000) : formatEGP_EN(22060000), class: 'kpi-primary' },
        { label: rtl ? 'مبالغ معلقة قيد التحصيل' : 'Pending Collections', val: rtl ? formatEGP(1515000) : formatEGP_EN(1515000), class: 'kpi-warning' },
        { label: rtl ? 'مبالغ مستردة فعلياً للعملاء' : 'Actually Refunded to Clients', val: rtl ? formatEGP(728000) : formatEGP_EN(728000), class: 'kpi-secondary' },
        { label: rtl ? 'استردادات قيد المراجعة والمعالجة' : 'Refunds in Process', val: rtl ? formatEGP(176000) : formatEGP_EN(176000), class: 'kpi-warning' },
        { label: rtl ? 'تسويات شركات السياحة المنفذة' : 'Completed Company Settlements', val: rtl ? formatEGP(18050000) : formatEGP_EN(18050000), class: 'kpi-primary' },
        { label: rtl ? 'تسويات معلقة مستحقة للشركات' : 'Pending Settlements Due', val: rtl ? formatEGP(2010000) : formatEGP_EN(2010000), class: 'kpi-warning' },
        { label: rtl ? 'تعديلات البرامج والرحلات' : 'Program / Trip Modifications', val: '77 ' + (rtl ? 'تعديلاً' : 'modifications'), class: 'kpi-blue' }
      ],
      detailRecords: [
        { ref: 'INT-BKG-881', category_ar: 'حجوزات مؤكدة', category_en: 'Confirmed Bookings', count: 1140, approved_amt: 18200000, pending_amt: 950000, status: rtl ? 'معتمد' : 'Approved' },
        { ref: 'INT-COL-442', category_ar: 'تحصيلات إلكترونية ونقدية', category_en: 'Collections & Deposits', count: 980, approved_amt: 22060000, pending_amt: 1515000, status: rtl ? 'مطابق' : 'Reconciled' },
        { ref: 'INT-REF-119', category_ar: 'طلبات استرداد مالي', category_en: 'Refund Requests', count: 38, approved_amt: 728000, pending_amt: 176000, status: rtl ? 'قيد التدقيق' : 'In Review' },
        { ref: 'INT-SET-205', category_ar: 'تسويات شركات السياحة', category_en: 'Tourism Company Settlements', count: 24, approved_amt: 18050000, pending_amt: 2010000, status: rtl ? 'معتمد وجاري' : 'Processed' },
        { ref: 'INT-MOD-088', category_ar: 'تعديلات وتغيير باقات', category_en: 'Program Modifications', count: 77, approved_amt: 1450000, pending_amt: 65000, status: rtl ? 'مكتمل' : 'Completed' }
      ],
      accountingNote: rtl
        ? 'تنبيه محاسبي معتمد: المبالغ المعلقة قيد التحصيل والاستردادات الجارية لا تُدرج ضمن السيولة الفعلية لمنصة ميقات حتى صدور إشعار الإقفال والتسوية النهائي.'
        : 'Approved Accounting Policy: Pending collections and in-process refunds are not recognized as cleared funds until settlement finalization.'
    };
  }

  function renderReportsTable() {
    if (!dom.reportsTableBody) return;
    const rtl = isRTL();

    const searchVal = (dom.historySearch?.value || '').trim().toLowerCase();
    const scopeFilter = dom.historyScopeSelect?.value || 'all';
    const statusFilter = dom.historyStatusSelect?.value || 'all';

    const filtered = reportsCatalog.filter(rep => {
      // Scope Filter
      if (scopeFilter !== 'all' && rep.scope !== scopeFilter) return false;

      // Status Filter
      if (statusFilter === 'ready' && rep.status_badge !== 'status-pill-navy') return false;
      if (statusFilter === 'scheduled' && rep.status_badge !== 'status-pill-blue') return false;

      // Search Query
      if (searchVal) {
        const matchesId = (rep.id || '').toLowerCase().includes(searchVal);
        const matchesTitleAr = (rep.title_ar || '').toLowerCase().includes(searchVal);
        const matchesTitleEn = (rep.title_en || '').toLowerCase().includes(searchVal);
        const matchesCompAr = (rep.company_name_ar || '').toLowerCase().includes(searchVal);
        const matchesCompEn = (rep.company_name_en || '').toLowerCase().includes(searchVal);
        if (!matchesId && !matchesTitleAr && !matchesTitleEn && !matchesCompAr && !matchesCompEn) return false;
      }

      return true;
    });

    if (dom.historyCountBadge) {
      dom.historyCountBadge.textContent = rtl
        ? `عرض ${filtered.length} من ${reportsCatalog.length} تقارير`
        : `Showing ${filtered.length} of ${reportsCatalog.length} reports`;
    }

    if (dom.historyBadge) {
      dom.historyBadge.textContent = rtl
        ? `${filtered.length} تقارير جاهزة للتصدير`
        : `${filtered.length} reports ready for export`;
    }

    if (filtered.length === 0) {
      dom.reportsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; opacity: 0.6;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p style="margin: 0; font-size: 0.85rem; font-weight: 600;">${rtl ? 'لا توجد تقارير مطابقة لمعايير البحث والتصفية المحددة' : 'No reports match the selected search and filter criteria'}</p>
          </td>
        </tr>
      `;
      return;
    }

    dom.reportsTableBody.innerHTML = filtered.map(rep => `
      <tr>
        <td>
          <div class="rep-table-title-cell">
            <strong>${rtl ? rep.title_ar : rep.title_en}</strong>
            <span class="rep-table-subtext"><bdi dir="ltr">${rep.id}</bdi> &bull; ${rtl ? rep.period_ar : rep.period_en}</span>
          </div>
        </td>
        <td><span class="acc-status-pill ${rep.scope === 'company' ? 'status-pill-amber' : 'status-pill-navy'}">${rtl ? rep.type_ar : rep.type_en}</span></td>
        <td><span class="rep-scope-tag">${rep.scope === 'company' ? (rtl ? rep.company_name_ar : rep.company_name_en) : (rtl ? 'داخلي — منصة ميقات' : 'Internal — Miqat')}</span></td>
        <td><span class="rep-table-mono"><bdi dir="ltr">${rep.date}</bdi></span></td>
        <td><span class="rep-table-mono"><bdi dir="ltr">${rep.size}</bdi></span></td>
        <td><span class="acc-status-pill ${rep.status_badge}">${rtl ? rep.status_ar : rep.status_en}</span></td>
        <td>
          <div class="acc-table-actions">
            <button type="button" class="btn btn-sm btn-secondary rep-btn-preview-row" data-id="${rep.id}" title="${rtl ? 'معاينة التقرير المستقل' : 'View Independent Report'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${rtl ? 'معاينة' : 'Preview'}</span>
            </button>
            <a href="accounts-report-export.html?id=${encodeURIComponent(rep.id)}" class="btn btn-sm btn-outline rep-btn-sim-export-row" data-id="${rep.id}" title="${rtl ? 'تصدير التقرير المعتمد' : 'Export Certified Report'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${rtl ? 'تصدير' : 'Export'}</span>
            </a>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach row button events
    dom.reportsTableBody.querySelectorAll('.rep-btn-preview-row').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        window.location.href = `accounts-report-details.html?id=${encodeURIComponent(id)}`;
      });
    });
  }

  // --- 7. Section 2: Backup & Archive Controller ---

  function setupBackupSection() {

    // Retry Failed Banner Button
    if (dom.btnRetryFailedBanner) {
      dom.btnRetryFailedBanner.addEventListener('click', function () {
        const failedItem = backupHistory.find(b => b.status === 'failed' && !b.retried);
        if (failedItem) {
          retryFailedBackup(failedItem.id);
        }
      });
    }

    // Export Inventory Excel
    if (dom.btnExportInventoryExcel) {
      dom.btnExportInventoryExcel.addEventListener('click', exportBackupInventoryExcel);
    }

    // Backup Filter Inputs
    if (dom.bkSearchInput) {
      dom.bkSearchInput.addEventListener('input', debounce(function () {
        backupFilters.searchQuery = this.value.trim().toLowerCase();
        backupFilters.page = 1;
        renderBackupTable();
      }, 250));
    }

    if (dom.bkTypeSelect) {
      dom.bkTypeSelect.addEventListener('change', function () {
        backupFilters.type = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkStatusSelect) {
      dom.bkStatusSelect.addEventListener('change', function () {
        backupFilters.status = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkInitiatorSelect) {
      dom.bkInitiatorSelect.addEventListener('change', function () {
        backupFilters.initiator = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkScopeSelect) {
      dom.bkScopeSelect.addEventListener('change', function () {
        backupFilters.scope = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkIntegritySelect) {
      dom.bkIntegritySelect.addEventListener('change', function () {
        backupFilters.integrity = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkRestoreSelect) {
      dom.bkRestoreSelect.addEventListener('change', function () {
        backupFilters.restoreStatus = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkFromDate) {
      dom.bkFromDate.addEventListener('change', function () {
        backupFilters.dateFrom = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkToDate) {
      dom.bkToDate.addEventListener('change', function () {
        backupFilters.dateTo = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.bkSortSelect) {
      dom.bkSortSelect.addEventListener('change', function () {
        backupFilters.sort = this.value;
        backupFilters.page = 1;
        renderBackupTable();
      });
    }

    if (dom.btnResetBkFilters) {
      dom.btnResetBkFilters.addEventListener('click', function () {
        backupFilters.searchQuery = '';
        backupFilters.type = 'all';
        backupFilters.status = 'all';
        backupFilters.initiator = 'all';
        backupFilters.scope = 'all';
        backupFilters.integrity = 'all';
        backupFilters.restoreStatus = 'all';
        backupFilters.dateFrom = '';
        backupFilters.dateTo = '';
        backupFilters.sort = 'date_desc';
        backupFilters.page = 1;

        if (dom.bkSearchInput) dom.bkSearchInput.value = '';
        if (dom.bkTypeSelect) dom.bkTypeSelect.value = 'all';
        if (dom.bkStatusSelect) dom.bkStatusSelect.value = 'all';
        if (dom.bkInitiatorSelect) dom.bkInitiatorSelect.value = 'all';
        if (dom.bkScopeSelect) dom.bkScopeSelect.value = 'all';
        if (dom.bkIntegritySelect) dom.bkIntegritySelect.value = 'all';
        if (dom.bkRestoreSelect) dom.bkRestoreSelect.value = 'all';
        if (dom.bkFromDate) dom.bkFromDate.value = '';
        if (dom.bkToDate) dom.bkToDate.value = '';
        if (dom.bkSortSelect) dom.bkSortSelect.value = 'date_desc';

        renderBackupTable();
      });
    }

    // Pagination
    if (dom.btnBkPrev) {
      dom.btnBkPrev.addEventListener('click', function () {
        if (backupFilters.page > 1) {
          backupFilters.page--;
          renderBackupTable();
        }
      });
    }

    if (dom.btnBkNext) {
      dom.btnBkNext.addEventListener('click', function () {
        const filtered = getFilteredBackupData();
        const maxPage = Math.ceil(filtered.length / backupFilters.pageSize) || 1;
        if (backupFilters.page < maxPage) {
          backupFilters.page++;
          renderBackupTable();
        }
      });
    }

    renderBackupTable();
    renderRestoreTable();
    updateFailedBackupAlertBanner();
  }

  function getFilteredBackupData() {
    return backupHistory.filter(item => {
      // Search
      if (backupFilters.searchQuery) {
        const q = backupFilters.searchQuery;
        const matchId = item.id.toLowerCase().includes(q);
        const matchSha = item.sha256.toLowerCase().includes(q);
        const matchInit = item.initiator_ar.toLowerCase().includes(q) || item.initiator_en.toLowerCase().includes(q);
        if (!matchId && !matchSha && !matchInit) return false;
      }
      // Type
      if (backupFilters.type !== 'all' && item.type !== backupFilters.type) return false;
      // Status
      if (backupFilters.status !== 'all' && item.status !== backupFilters.status) return false;
      // Initiator
      if (backupFilters.initiator !== 'all' && item.initiator !== backupFilters.initiator) return false;
      // Scope
      if (backupFilters.scope !== 'all' && item.scope !== backupFilters.scope) return false;
      // Integrity
      if (backupFilters.integrity !== 'all' && item.integrity !== backupFilters.integrity) return false;
      // Restore Status
      if (backupFilters.restoreStatus !== 'all' && item.restore_status !== backupFilters.restoreStatus) return false;
      // Date From
      if (backupFilters.dateFrom && item.date < backupFilters.dateFrom) return false;
      // Date To
      if (backupFilters.dateTo && item.date > backupFilters.dateTo + ' 23:59') return false;

      return true;
    }).sort((a, b) => {
      if (backupFilters.sort === 'date_desc') return b.date.localeCompare(a.date);
      if (backupFilters.sort === 'date_asc') return a.date.localeCompare(b.date);
      if (backupFilters.sort === 'size_desc') return b.size_gb - a.size_gb;
      if (backupFilters.sort === 'size_asc') return a.size_gb - b.size_gb;
      return 0;
    });
  }

  function renderBackupTable() {
    if (!dom.backupTableBody) return;
    const rtl = isRTL();
    const filtered = getFilteredBackupData();

    // Active filters badge
    let activeFilterCount = 0;
    if (backupFilters.searchQuery) activeFilterCount++;
    if (backupFilters.type !== 'all') activeFilterCount++;
    if (backupFilters.status !== 'all') activeFilterCount++;
    if (backupFilters.initiator !== 'all') activeFilterCount++;
    if (backupFilters.scope !== 'all') activeFilterCount++;
    if (backupFilters.integrity !== 'all') activeFilterCount++;
    if (backupFilters.restoreStatus !== 'all') activeFilterCount++;
    if (backupFilters.dateFrom || backupFilters.dateTo) activeFilterCount++;

    if (dom.bkActiveFilterBadge) {
      if (activeFilterCount > 0) {
        dom.bkActiveFilterBadge.style.display = 'inline-flex';
        dom.bkActiveFilterBadge.textContent = rtl ? `${activeFilterCount} فلاتر نشطة` : `${activeFilterCount} Active Filters`;
      } else {
        dom.bkActiveFilterBadge.style.display = 'none';
      }
    }

    // Pagination calculations
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / backupFilters.pageSize) || 1;
    if (backupFilters.page > totalPages) backupFilters.page = totalPages;

    const startIdx = (backupFilters.page - 1) * backupFilters.pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + backupFilters.pageSize);

    if (dom.bkResultCountText) {
      dom.bkResultCountText.textContent = rtl
        ? `عرض ${pageItems.length} من أصل ${totalCount} نسخة احتياطية (إجمالي السجل: ${backupHistory.length})`
        : `Showing ${pageItems.length} of ${totalCount} backups (Total: ${backupHistory.length})`;
    }

    if (dom.bkPageInfo) {
      dom.bkPageInfo.textContent = `${backupFilters.page} / ${totalPages}`;
    }

    if (dom.btnBkPrev) dom.btnBkPrev.disabled = backupFilters.page <= 1;
    if (dom.btnBkNext) dom.btnBkNext.disabled = backupFilters.page >= totalPages;

    if (pageItems.length === 0) {
      dom.backupTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-4 text-muted">
            ${rtl ? 'لا توجد نسخ احتياطية مطابقة للفلاتر المحددة' : 'No backups match the selected filter criteria'}
          </td>
        </tr>
      `;
      return;
    }

    dom.backupTableBody.innerHTML = pageItems.map(bk => `
      <tr>
        <td>
          <strong class="rep-table-mono"><bdi dir="ltr">${bk.id}</bdi></strong>
        </td>
        <td><span class="rep-table-mono"><bdi dir="ltr">${bk.date}</bdi></span></td>
        <td><span class="acc-status-pill ${bk.type === 'auto' ? 'status-pill-navy' : (bk.type === 'manual' ? 'status-pill-amber' : 'status-pill-slate')}">${rtl ? bk.type_ar : bk.type_en}</span></td>
        <td><span class="rep-table-initiator">${rtl ? bk.initiator_ar : bk.initiator_en}</span></td>
        <td><span class="rep-table-subtext">${rtl ? bk.scope_ar : bk.scope_en}</span></td>
        <td><strong class="rep-table-mono"><bdi dir="ltr">${bk.size_str}</bdi></strong></td>
        <td><span class="acc-status-pill ${bk.status_badge}">${rtl ? bk.status_ar : bk.status_en}</span></td>
        <td>
          <span class="acc-status-pill ${bk.integrity === 'verified' ? 'status-pill-navy' : 'status-pill-amber'}">
            ${rtl ? bk.integrity_ar : bk.integrity_en}
          </span>
        </td>
        <td>
          <div class="acc-table-actions">
            ${bk.status === 'failed' ? `
              <button type="button" class="btn btn-sm btn-secondary rep-btn-retry-row" data-id="${bk.id}" title="${rtl ? 'إعادة المحاولة' : 'Retry'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6"></path>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                <span>${rtl ? 'إعادة المحاولة' : 'Retry'}</span>
              </button>
            ` : `
              <button type="button" class="btn btn-sm btn-outline rep-btn-sha-row" data-sha="${bk.sha256}" data-id="${bk.id}" title="${rtl ? 'عرض البصمة الرقمية' : 'View Checksum'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>${rtl ? 'فحص SHA' : 'SHA'}</span>
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join('');

    // Attach retry button handlers
    dom.backupTableBody.querySelectorAll('.rep-btn-retry-row').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        retryFailedBackup(id);
      });
    });

    // Attach SHA view handlers
    dom.backupTableBody.querySelectorAll('.rep-btn-sha-row').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const sha = this.getAttribute('data-sha');
        alert((rtl ? `البصمة الرقمية للنسخة ${id}:\n` : `SHA-256 Checksum for ${id}:\n`) + sha);
      });
    });
  }

  function updateFailedBackupAlertBanner() {
    if (!dom.failedAlertBanner) return;
    const failedItem = backupHistory.find(b => b.status === 'failed' && !b.retried);
    if (failedItem) {
      dom.failedAlertBanner.style.display = 'flex';
      if (dom.failedReasonText) {
        dom.failedReasonText.textContent = isRTL() ? failedItem.failure_reason : failedItem.failure_reason_en;
      }
    } else {
      dom.failedAlertBanner.style.display = 'none';
    }
  }

  function retryFailedBackup(id) {
    const rtl = isRTL();
    const item = backupHistory.find(b => b.id === id);
    if (!item) return;

    if (!confirm(rtl ? `هل تريد إعادة تنفيذ النسخة الاحتياطية (${id}) الآن؟` : `Do you want to retry backup (${id}) now?`)) {
      return;
    }

    item.status = 'progress';
    item.status_ar = 'جاري إعادة المحاولة...';
    item.status_en = 'Retrying...';
    item.status_badge = 'status-pill-amber';
    renderBackupTable();

    setTimeout(() => {
      item.status = 'success';
      item.status_ar = 'ناجح ومكتمل (بعد الإعادة)';
      item.status_en = 'Successful (Retried)';
      item.status_badge = 'status-pill-navy';
      item.integrity = 'verified';
      item.integrity_ar = 'متحقق ومطابق 100% (SHA-256)';
      item.integrity_en = '100% Verified (SHA-256)';
      item.size_gb = 2.82;
      item.size_str = '2.82 GB';
      item.sha256 = '4d8a1c97ef3120ba89456201bcfda78092147586940aebcd147589632015a9bc';
      item.retried = true;
      item.failure_reason = null;

      updateFailedBackupAlertBanner();
      renderBackupTable();

      alert(rtl
        ? `تمت إعادة محاولة النسخ الاحتياطي (${id}) بنجاح وتوثيق البصمة الرقمية المعيارية.`
        : `Backup (${id}) successfully retried and verified with SHA-256 checksum.`);
    }, 1200);
  }

  // Read-Only Restore History Table
  function renderRestoreTable() {
    if (!dom.restoreTableBody) return;
    const rtl = isRTL();

    dom.restoreTableBody.innerHTML = restoreHistory.map(rst => `
      <tr>
        <td><strong class="rep-table-mono"><bdi dir="ltr">${rst.id}</bdi></strong></td>
        <td><span class="rep-table-mono text-accent"><bdi dir="ltr">${rst.source_bk_id}</bdi></span></td>
        <td><span>${rtl ? rst.executed_by : rst.executed_by_en}</span></td>
        <td><span class="acc-status-pill status-pill-slate">${rtl ? rst.target_env_ar : rst.target_env_en}</span></td>
        <td><span class="rep-table-mono"><bdi dir="ltr">${rst.date}</bdi></span></td>
        <td><span class="acc-status-pill ${rst.status_badge}">${rtl ? rst.status_ar : rst.status_en}</span></td>
        <td>
          <div class="rep-notes-text" title="${rtl ? rst.notes_ar : rst.notes_en}">
            ${rtl ? rst.notes_ar : rst.notes_en}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Excel Inventory Export (Full Chronological Backup Audit)
  function exportBackupInventoryExcel() {
    const rtl = isRTL();
    if (typeof XLSX === 'undefined') {
      alert(rtl ? 'مكتبة SheetJS غير متوفرة' : 'SheetJS is not loaded');
      return;
    }

    const wb = XLSX.utils.book_new();

    // Sheet 1: Master Backup Inventory
    const headers = [
      rtl ? 'رقم النسخة المعياري' : 'Backup ID',
      rtl ? 'التاريخ والتوقيت' : 'Timestamp',
      rtl ? 'النوع' : 'Type',
      rtl ? 'المنفذ / المحرك' : 'Initiator',
      rtl ? 'نطاق النسخة' : 'Scope',
      rtl ? 'الحجم الفعلي' : 'Size',
      rtl ? 'الحالة التشغيلية' : 'Status',
      rtl ? 'فحص المطابقة SHA-256' : 'Integrity Check',
      rtl ? 'البصمة الرقمية الكاملة' : 'Full SHA-256 Hash',
      rtl ? 'حالة الاسترجاع السابقة' : 'Restore History'
    ];

    const rows = backupHistory.map(b => [
      b.id,
      b.date,
      rtl ? b.type_ar : b.type_en,
      rtl ? b.initiator_ar : b.initiator_en,
      rtl ? b.scope_ar : b.scope_en,
      b.size_str,
      rtl ? b.status_ar : b.status_en,
      rtl ? b.integrity_ar : b.integrity_en,
      b.sha256,
      rtl ? b.restore_status_ar : b.restore_status_en
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, rtl ? 'سجل النسخ الاحتياطي' : 'Backups Inventory');

    // Sheet 2: Read-Only Restores Audit
    const restoreHeaders = [
      rtl ? 'رقم عملية الاسترجاع' : 'Restore ID',
      rtl ? 'النسخة المصدر' : 'Source Backup',
      rtl ? 'الجهة المنفذة (Admin)' : 'Admin Executed By',
      rtl ? 'البيئة المستهدفة' : 'Target Env',
      rtl ? 'التاريخ والتوقيت' : 'Timestamp',
      rtl ? 'الحالة' : 'Status',
      rtl ? 'ملاحظات الاعتماد' : 'Audit Notes'
    ];

    const restoreRows = restoreHistory.map(r => [
      r.id,
      r.source_bk_id,
      rtl ? r.executed_by : r.executed_by_en,
      rtl ? r.target_env_ar : r.target_env_en,
      r.date,
      rtl ? r.status_ar : r.status_en,
      rtl ? r.notes_ar : r.notes_en
    ]);

    const wsRestore = XLSX.utils.aoa_to_sheet([restoreHeaders, ...restoreRows]);
    XLSX.utils.book_append_sheet(wb, wsRestore, rtl ? 'سجل الاسترجاع التدقيقي' : 'Restore Audit Log');

    XLSX.writeFile(wb, `Miqat_Backups_Inventory_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // --- 8. Section 3: Storage & Capacity Controller (ZERO PROGRESS BARS) ---

  function renderStorageSection() {
    const rtl = isRTL();
    const st = storageData;

    // Overview KPIs
    if (dom.storageTotalVal) dom.storageTotalVal.innerHTML = `<bdi dir="ltr">${(st.total_gb / 1024).toFixed(2)} TB (${st.total_gb.toLocaleString()} GB)</bdi>`;
    if (dom.storageUsedVal) dom.storageUsedVal.innerHTML = `<bdi dir="ltr">${(st.used_gb / 1024).toFixed(2)} TB (${st.used_gb.toLocaleString()} GB)</bdi>`;
    if (dom.storageRemainingVal) dom.storageRemainingVal.innerHTML = `<bdi dir="ltr">${(st.remaining_gb / 1024).toFixed(2)} TB (${st.remaining_gb.toLocaleString()} GB)</bdi>`;
    if (dom.storagePercentVal) dom.storagePercentVal.innerHTML = `<bdi dir="ltr">${st.usage_percent}%</bdi>`;

    // Warning Banner: Trigger if usage > 70%
    if (dom.storageAlertBanner) {
      dom.storageAlertBanner.style.display = st.usage_percent >= st.thresholds.early_warning ? 'flex' : 'none';
    }

    // Category Breakdown Grid (ZERO PROGRESS BARS - Interactive Tooltips on Hover/Focus)
    if (dom.storageCatBreakdownGrid) {
      dom.storageCatBreakdownGrid.innerHTML = st.category_breakdown.map(cat => `
        <div class="rep-st-cat-card" tabindex="0" role="region" aria-label="${rtl ? cat.name_ar : cat.name_en}">
          <div class="rep-st-cat-header">
            <div class="rep-st-cat-title-wrap">
              <span class="rep-st-cat-color-dot" style="background-color:${cat.color};"></span>
              <strong class="rep-st-cat-name">${rtl ? cat.name_ar : cat.name_en}</strong>
            </div>
            <span class="rep-st-cat-pct-badge"><bdi dir="ltr">${cat.percent}%</bdi></span>
          </div>
          <div class="rep-st-cat-stats">
            <span class="rep-st-stat-size"><bdi dir="ltr">${cat.size_tb} TB</bdi></span>
            <span class="rep-st-cat-hint">${rtl ? 'مرر أو ركز للتفاصيل' : 'Hover/focus for details'}</span>
          </div>
          <div class="rep-st-cat-tooltip" role="tooltip">
            <div class="rep-st-tooltip-row">
              <span>${rtl ? 'التشفير:' : 'Encryption:'}</span>
              <strong><bdi dir="ltr">${cat.encryption}</bdi></strong>
            </div>
            <div class="rep-st-tooltip-row">
              <span>${rtl ? 'الجدولة:' : 'Schedule:'}</span>
              <strong>${rtl ? cat.schedule_ar : cat.schedule_en}</strong>
            </div>
            <div class="rep-st-tooltip-row">
              <span>${rtl ? 'البصمة:' : 'Checksum:'}</span>
              <strong class="text-accent"><bdi dir="ltr">${cat.integrity}</bdi></strong>
            </div>
            <div class="rep-st-tooltip-row">
              <span>${rtl ? 'آخر لقطة:' : 'Last Snapshot:'}</span>
              <strong><bdi dir="ltr">${cat.last_snapshot}</bdi></strong>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Period Breakdown Grid
    if (dom.storagePeriodBreakdownGrid) {
      dom.storagePeriodBreakdownGrid.innerHTML = st.time_breakdown.map(p => `
        <div class="rep-st-period-card">
          <div class="rep-st-period-name">
            <strong>${rtl ? p.period_ar : p.period_en}</strong>
            <span class="acc-status-pill status-pill-slate">${p.count} ${rtl ? 'نسخة' : 'archives'}</span>
          </div>
          <div class="rep-st-period-size">
            <strong><bdi dir="ltr">${p.size_gb >= 1024 ? (p.size_gb / 1024).toFixed(2) + ' TB' : p.size_gb + ' GB'}</bdi></strong>
          </div>
        </div>
      `).join('');
    }
  }

  // Utility Debounce
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function refreshDynamicContent() {
    populateCompanySelect();
    updateLiveSummary();
    renderReportsTable();
    renderBackupTable();
    renderRestoreTable();
    renderStorageSection();
    updateFailedBackupAlertBanner();
  }

  // --- 9. Initializer ---
  function initPage() {
    initDOM();
    setupTabs();
    setupReportForm();
    setupBackupSection();
    renderStorageSection();

    // Register refresh listener for live language and theme switches
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.onPageRefresh === 'function') {
      window.AccountsWorkspace.onPageRefresh(function () {
        refreshDynamicContent();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

})();
