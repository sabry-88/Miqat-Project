/**
 * MIQAT ACCOUNTS WORKSPACE — FULL BOOKING ACTIVITY LOG CONTROLLER
 * 
 * Manages the chronological, immutable audit log view for a specific booking:
 * - Real-time search across activity titles, actors, and descriptions
 * - Category filter chips (All, Payments, Status, Refunds, Notes, System)
 * - Direction-aware navigation breadcrumb back to booking details
 * - Strict Zero-Red and Zero-Green status pill compliance
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AccountsBookingActivity = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let currentBooking = null;
  let allActivities = [];
  let filterCategory = 'all';
  let searchQuery = '';

  function getLang() {
    if (window.AccountsWorkspace && typeof window.AccountsWorkspace.getLang === 'function') {
      return window.AccountsWorkspace.getLang();
    }
    return document.documentElement.lang || 'ar';
  }

  function formatNum(num) {
    const lang = getLang();
    const n = Number(num) || 0;
    return lang === 'ar' ? n.toLocaleString('ar-EG') : n.toLocaleString('en-US');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getCategoryBadge(type) {
    const lang = getLang();
    switch (type) {
      case 'payment':
      case 'payments':
        return { label: lang === 'ar' ? 'سداد وتحصيل' : 'Payment', cssClass: 'status-pill-navy' };
      case 'status':
        return { label: lang === 'ar' ? 'تغير حالة' : 'Status Change', cssClass: 'status-pill-blue' };
      case 'refund':
      case 'refunds':
        return { label: lang === 'ar' ? 'استرداد مالي' : 'Refund', cssClass: 'status-pill-indigo' };
      case 'note':
      case 'notes':
        return { label: lang === 'ar' ? 'ملاحظة خاصة' : 'Internal Note', cssClass: 'status-pill-amber' };
      case 'system':
      case 'creation':
      default:
        return { label: lang === 'ar' ? 'إجراء نظام' : 'System Event', cssClass: 'status-pill-slate' };
    }
  }

  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id') || 'BK-2026-1045';

    loadBookingData(bookingId);
    setupFilters();
    updateStaticLabels();

    window.addEventListener('accounts-lang-changed', function () {
      updateStaticLabels();
      if (currentBooking) {
        renderHeader();
        renderTimeline();
      }
    });
  }

  function updateStaticLabels() {
    const lang = getLang();
    const isEn = lang === 'en';

    // Section context card aria-label
    const secCtx = document.getElementById('sec-activity-context-card');
    if (secCtx) secCtx.setAttribute('aria-label', isEn ? 'Current Booking Information' : 'بيانات الحجز الحالية');

    // Section title & subtitle
    const secStream = document.getElementById('sec-full-activity-stream');
    if (secStream) {
      const h2 = secStream.querySelector('.acc-sec-title');
      if (h2) h2.textContent = isEn ? 'Comprehensive Chronological Audit Trail' : 'السجل التاريخي الشامل للنشاط والعمليات (Audit Trail)';
      const p = secStream.querySelector('.acc-sec-subtitle');
      if (p) p.textContent = isEn ? 'Immutable chronological audit log documenting all administrative and financial actions on this booking.' : 'سجل تدقيق زمني غير قابل للتعديل أو الحذف، يوثق كافة الحركات الإدارية والمالية المنفذة على الحجز.';
    }

    // Search input placeholder & aria-label
    const searchInput = document.getElementById('act-search-input');
    if (searchInput) {
      searchInput.setAttribute('placeholder', isEn ? 'Search activity title, details, or actor...' : 'بحث في عنوان النشاط أو التفاصيل أو اسم المنفذ...');
      searchInput.setAttribute('aria-label', isEn ? 'Search in activity log' : 'بحث في سجل النشاط');
    }

    // Category chips labels
    const catLabels = {
      all: isEn ? 'All Activities' : 'كافة النشاطات',
      payments: isEn ? 'Payments & Collections' : 'المدفوعات والتحصيل',
      status: isEn ? 'Status Changes' : 'تغيرات الحالات',
      refunds: isEn ? 'Refunds' : 'الاسترداد المالي',
      notes: isEn ? 'Internal Notes' : 'الملاحظات الداخلية',
      system: isEn ? 'System Updates' : 'تحديثات النظام'
    };

    document.querySelectorAll('#act-category-chips .acc-chip-btn').forEach(btn => {
      const cat = btn.getAttribute('data-cat');
      if (cat && catLabels[cat]) {
        btn.textContent = catLabels[cat];
      }
    });
  }

  function loadBookingData(bookingId) {
    if (!window.AccountsMockData) return;

    currentBooking = window.AccountsMockData.getBookingDetails(bookingId);
    if (!currentBooking) {
      // Fallback to first booking
      const all = window.AccountsMockData.getAllBookings();
      if (all && all.length > 0) {
        currentBooking = all[0];
      }
    }

    if (currentBooking) {
      allActivities = window.AccountsMockData.getBookingFullActivityLog(currentBooking.id) || [];
      renderHeader();
      renderTimeline();
    }
  }

  function renderHeader() {
    const b = currentBooking;
    if (!b) return;

    const lang = getLang();
    const btnBack = document.getElementById('btn-back-to-booking');
    if (btnBack) {
      btnBack.href = `accounts-booking-details.html?id=${encodeURIComponent(b.id)}`;
    }

    const backLabel = document.getElementById('txt-back-booking-label');
    if (backLabel) {
      backLabel.textContent = lang === 'ar' ? `العودة إلى تفاصيل الحجز (${b.id})` : `Back to Booking (${b.id})`;
    }

    const elId = document.getElementById('act-booking-id');
    if (elId) elId.textContent = b.id;

    const elBStatus = document.getElementById('act-booking-status');
    if (elBStatus) {
      let bLabel = b.booking_status;
      if (b.booking_status === 'confirmed') bLabel = lang === 'ar' ? 'مؤكد' : 'Confirmed';
      else if (b.booking_status === 'deposit_paid') bLabel = lang === 'ar' ? 'عربون مسدد' : 'Deposit Paid';
      else if (b.booking_status === 'under_review') bLabel = lang === 'ar' ? 'قيد المراجعة' : 'Under Review';
      elBStatus.textContent = bLabel;
      elBStatus.className = 'acc-status-pill status-pill-navy';
    }

    const elPStatus = document.getElementById('act-payment-status');
    if (elPStatus) {
      let pLabel = b.payment_status;
      if (b.payment_status === 'paid' || b.payment_status === 'paid_full') pLabel = lang === 'ar' ? 'مسدد بالكامل' : 'Paid in Full';
      else if (b.payment_status === 'partial') pLabel = lang === 'ar' ? 'سداد جزئي' : 'Partial Payment';
      else if (b.payment_status === 'pending_clearance') pLabel = lang === 'ar' ? 'بانتظار التحصيل' : 'Pending Clearance';
      elPStatus.textContent = pLabel;
      elPStatus.className = 'acc-status-pill status-pill-navy';
    }

    const elCust = document.getElementById('act-customer-name');
    if (elCust) {
      const custName = lang === 'en' 
        ? (b.customer_name_en || b.customer_name_ar || b.customer_name)
        : (b.customer_name_ar || b.customer_name_en || b.customer_name);
      elCust.textContent = custName || 'أحمد محمود الشريف';
    }

    const elComp = document.getElementById('act-company-name');
    if (elComp) {
      const compName = lang === 'en'
        ? (b.company_name_en || b.company_en || b.company_name_ar || b.company_ar || b.company_name)
        : (b.company_name_ar || b.company_ar || b.company_name_en || b.company_en || b.company_name);
      elComp.textContent = compName || 'شركة الدرة للسياحة';
    }

    const elCount = document.getElementById('act-total-count');
    if (elCount) {
      elCount.textContent = lang === 'ar' ? `إجمالي العمليات: ${formatNum(allActivities.length)}` : `Total operations: ${formatNum(allActivities.length)}`;
    }
  }

  function setupFilters() {
    // Search input
    const searchInput = document.getElementById('act-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = this.value.trim().toLowerCase();
        renderTimeline();
      });
    }

    // Category chips
    const chips = document.querySelectorAll('#act-category-chips .acc-chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => c.classList.remove('is-active'));
        this.classList.add('is-active');
        filterCategory = this.getAttribute('data-cat') || 'all';
        renderTimeline();
      });
    });
  }

  function renderTimeline() {
    const stream = document.getElementById('full-activities-timeline');
    if (!stream) return;

    const lang = getLang();

    let filtered = allActivities.filter(act => {
      // Category filter
      if (filterCategory !== 'all') {
        const type = (act.type || '').toLowerCase();
        if (filterCategory === 'payments' && !type.includes('payment')) return false;
        if (filterCategory === 'status' && !type.includes('status')) return false;
        if (filterCategory === 'refunds' && !type.includes('refund')) return false;
        if (filterCategory === 'notes' && !type.includes('note')) return false;
        if (filterCategory === 'system' && !type.includes('system') && !type.includes('creation')) return false;
      }

      // Search query filter
      if (searchQuery) {
        const title = (lang === 'en' ? (act.title_en || act.title) : (act.title_ar || act.title)) || '';
        const desc = (lang === 'en' ? (act.desc_en || act.description) : (act.desc_ar || act.description)) || '';
        const actor = (lang === 'en' ? (act.actor_en || act.actor) : (act.actor_ar || act.actor)) || '';
        if (!title.toLowerCase().includes(searchQuery) && 
            !desc.toLowerCase().includes(searchQuery) && 
            !actor.toLowerCase().includes(searchQuery)) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length === 0) {
      stream.innerHTML = `
        <div class="acc-stream-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>${lang === 'ar' ? 'لا توجد نشاطات مطابقة لمعايير البحث والتصفية المحددة' : 'No activities matching the search and filter criteria'}</p>
        </div>
      `;
      return;
    }

    stream.innerHTML = filtered.map(act => {
      const catBadge = getCategoryBadge(act.type);
      return `
        <div class="acc-timeline-item is-full-item">
          <div class="acc-timeline-marker"></div>
          <div class="acc-timeline-content">
            <div class="acc-timeline-header">
              <div class="acc-timeline-title-wrap">
                <span class="acc-status-pill ${catBadge.cssClass}">${catBadge.label}</span>
                <strong class="acc-timeline-title">${escapeHtml(lang === 'en' ? (act.title_en || act.title) : (act.title_ar || act.title))}</strong>
              </div>
              <span class="acc-timeline-date tabular-nums">${escapeHtml(act.date || act.timestamp || '')}</span>
            </div>
            <p class="acc-timeline-desc">${escapeHtml(lang === 'en' ? (act.desc_en || act.description) : (act.desc_ar || act.description || ''))}</p>
            <div class="acc-timeline-meta-bar">
              <span class="acc-timeline-author">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${escapeHtml(lang === 'en' ? (act.actor_en || act.actor) : (act.actor_ar || act.actor || 'النظام المركزي'))}
              </span>
              ${act.ref_id ? `
                <span class="acc-code-pill tabular-nums">${escapeHtml(act.ref_id)}</span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    loadBookingData
  };
});

