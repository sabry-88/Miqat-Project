/* ==========================================================================
   Miqat Sales & Call Center CRM — Page 4 Shared UI, Comparison & WhatsApp Helper
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function isEn() {
    return WS && WS.getLang() === 'en';
  }

  function getEmployeeStorageKey(suffix) {
    var userId = 'anon';
    try {
      var u = JSON.parse(localStorage.getItem('miqat_user') || 'null');
      if (u && (u.id || u.email)) userId = String(u.id || u.email).replace(/[^a-zA-Z0-9_-]/g, '_');
    } catch (_) {}
    return 'miqat_sales_' + suffix + '_' + userId;
  }

  function getCompareIds() {
    try {
      var raw = localStorage.getItem(getEmployeeStorageKey('compare_programs'));
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.slice(0, 4) : [];
    } catch (_) {
      return [];
    }
  }

  function setCompareIds(ids) {
    try {
      var clean = Array.from(new Set((ids || []).filter(Boolean))).slice(0, 4);
      localStorage.setItem(getEmployeeStorageKey('compare_programs'), JSON.stringify(clean));
      return clean;
    } catch (_) {
      return ids || [];
    }
  }

  function toggleCompareId(programId) {
    var ids = getCompareIds();
    var idx = ids.indexOf(programId);
    if (idx >= 0) {
      ids.splice(idx, 1);
      setCompareIds(ids);
      return { ids: ids, added: false, limitReached: false };
    }
    if (ids.length >= 4) {
      return { ids: ids, added: false, limitReached: true };
    }
    ids.push(programId);
    setCompareIds(ids);
    return { ids: ids, added: true, limitReached: false };
  }

  function formatDateShort(iso) {
    if (!iso) return isEn() ? 'Not specified' : 'غير محدد';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleDateString(isEn() ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (_) {
      return String(iso);
    }
  }

  function formatDateTime(iso) {
    if (!iso) return isEn() ? 'Not specified' : 'غير محدد';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleString(isEn() ? 'en-US' : 'ar-EG', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (_) {
      return String(iso);
    }
  }

  function formatCurrency(val) {
    if (val == null || val === '') return isEn() ? 'Not available' : 'غير متاح';
    var num = WS ? WS.formatNumber(val) : String(val);
    return num + ' ' + (isEn() ? 'EGP' : 'ج.م');
  }

  function formatDistance(meters) {
    if (meters == null || meters === '') {
      return '<span class="sls-missing-val">' + esc(isEn() ? 'Distance not provided' : 'المسافة غير متوفرة') + '</span>';
    }
    var m = WS ? WS.formatNumber(meters) : String(meters);
    return '<bdi dir="ltr">' + esc(m) + ' ' + (isEn() ? 'm' : 'م') + '</bdi>';
  }

  function getFreshnessInfo(state) {
    var map = {
      up_to_date: { cls: 'status-pill-navy', ar: 'محدّث', en: 'Up to date' },
      needs_update: { cls: 'status-pill-amber', ar: 'يحتاج تحديثاً', en: 'Needs update' },
      stale: { cls: 'status-pill-slate', ar: 'بيانات قديمة', en: 'Stale data' },
      connection_failed: { cls: 'status-pill-amber', ar: 'تعذر اتصال المصدر', en: 'Source connection failed' }
    };
    var item = map[state] || map.stale;
    return { cls: item.cls, label: isEn() ? item.en : item.ar };
  }

  function getOperationalStatusInfo(state) {
    var map = {
      active: { cls: 'status-pill-navy', ar: 'نشط ومعتمد', en: 'Active Partner' },
      limited: { cls: 'status-pill-amber', ar: 'توافر محدود', en: 'Limited Availability' },
      review: { cls: 'status-pill-slate', ar: 'قيد المراجعة', en: 'Under Review' }
    };
    var item = map[state] || map.review;
    return { cls: item.cls, label: isEn() ? item.en : item.ar };
  }

  function getAvailabilityInfo(state) {
    var map = {
      available: { cls: 'status-pill-navy', ar: 'متاح للحجز', en: 'Available' },
      limited: { cls: 'status-pill-amber', ar: 'مقاعد محدودة', en: 'Limited Seats' },
      waitlist: { cls: 'status-pill-blue', ar: 'قائمة انتظار', en: 'Waitlist' },
      unavailable: { cls: 'status-pill-slate', ar: 'غير متاح', en: 'Unavailable' }
    };
    var item = map[state] || map.available;
    return { cls: item.cls, label: isEn() ? item.en : item.ar };
  }

  function getTypeLabel(p) {
    if (p.program_type === 'hajj' || p.category === 'hajj') return isEn() ? 'Hajj' : 'حج';
    if (p.category === 'vip') return isEn() ? 'Umrah (VIP)' : 'عمرة (VIP)';
    return isEn() ? 'Umrah' : 'عمرة';
  }

  function formatConversionSummary(item) {
    var pct = WS ? WS.formatNumber(item.conversion_rate) : String(item.conversion_rate);
    var c = WS ? WS.formatNumber(item.completed_contracts) : String(item.completed_contracts);
    var b = WS ? WS.formatNumber(item.bookings) : String(item.bookings);
    if (isEn()) {
      return pct + '% (' + c + ' contracts / ' + b + ' bookings)';
    }
    return pct + '٪ (' + c + ' عقد مكتمل من ' + b + ' حجز)';
  }

  function buildWhatsAppMessage(p) {
    var en = isEn();
    var title = en ? p.title_en : p.title_ar;
    var makkah = (en ? p.makkah_hotel_en : p.makkah_hotel_ar) || (en ? 'To be confirmed' : 'قيد التأكيد');
    var madinah = (en ? p.madinah_hotel_en : p.madinah_hotel_ar) || (en ? 'To be confirmed' : 'قيد التأكيد');
    var flight = (en ? p.flight_en : p.flight_ar) || (en ? 'To be confirmed' : 'قيد التأكيد');
    var services = (en ? (p.services_en || []) : (p.services_ar || [])).slice(0, 4);
    var distMakkah = p.makkah_distance_m != null ? (p.makkah_distance_m + (en ? 'm from Masjid al-Haram' : ' متر من المسجد الحرام')) : (en ? 'Distance pending source confirmation' : 'المسافة قيد التأكيد من المصدر');

    var lines = [];
    if (en) {
      lines.push('Assalamu Alaikum — Greetings from *Miqat Platform* for Hajj & Umrah.');
      lines.push('');
      lines.push('*Program:* ' + title);
      lines.push('*Price:* ' + (p.price_egp != null ? (WS.formatNumber(p.price_egp) + ' EGP') : 'Upon inquiry'));
      if (p.travel_date && p.return_date) {
        lines.push('*Dates:* ' + p.travel_date + ' to ' + p.return_date + (p.duration_days ? ' (' + p.duration_days + ' days)' : ''));
      }
      lines.push('*Makkah Hotel:* ' + makkah + ' (' + distMakkah + ')');
      lines.push('*Madinah Hotel:* ' + madinah);
      lines.push('*Flight:* ' + flight);
      if (services.length) {
        lines.push('*Included Services:*');
        services.forEach(function (sv) { lines.push('- ' + sv); });
      }
      lines.push('');
      lines.push('Reply to this message to confirm availability and reserve your seats with Miqat.');
    } else {
      lines.push('السلام عليكم ورحمة الله وبركاته — تحية طيبة من *منصة ميقات* لخدمات الحج والعمرة.');
      lines.push('');
      lines.push('*البرنامج:* ' + title);
      lines.push('*السعر:* ' + (p.price_egp != null ? (WS.formatNumber(p.price_egp) + ' ج.م') : 'يُحدد عند الاستفسار'));
      if (p.travel_date && p.return_date) {
        lines.push('*المواعيد:* من ' + p.travel_date + ' إلى ' + p.return_date + (p.duration_days ? ' (' + WS.formatNumber(p.duration_days) + ' أيام)' : ''));
      }
      lines.push('*فندق مكة:* ' + makkah + ' (' + distMakkah + ')');
      lines.push('*فندق المدينة:* ' + madinah);
      lines.push('*الطيران:* ' + flight);
      if (services.length) {
        lines.push('*أبرز الخدمات المشمولة:*');
        services.forEach(function (sv) { lines.push('- ' + sv); });
      }
      lines.push('');
      lines.push('يسعدنا تواصلكم لتأكيد المقاعد المتاحة وإتمام الحجز عبر منصة ميقات.');
    }
    return lines.join('\n');
  }

  function showToast(msg) {
    var existing = document.getElementById('sls-cmp-toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.id = 'sls-cmp-toast';
    el.className = 'sls-toast-banner';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 3200);
  }

  function ensureWhatsAppDialog() {
    var dlg = document.getElementById('sls-wa-share-dialog');
    if (dlg) return dlg;
    dlg = document.createElement('dialog');
    dlg.id = 'sls-wa-share-dialog';
    dlg.className = 'sls-dialog sls-wa-dialog';
    dlg.setAttribute('aria-labelledby', 'sls-wa-title');
    dlg.innerHTML =
      '<div class="sls-wa-head">' +
        '<h2 id="sls-wa-title" class="sls-card-title"></h2>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-wa-close-btn"></button>' +
      '</div>' +
      '<p class="sls-item-meta" id="sls-wa-notice"></p>' +
      '<label for="sls-wa-textarea" class="sls-field-label" id="sls-wa-label"></label>' +
      '<textarea id="sls-wa-textarea" class="acc-filter-input sls-textarea" rows="8"></textarea>' +
      '<div class="sls-wa-actions">' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sls-wa-copy-btn"></button>' +
        '<a href="#" target="_blank" rel="noopener noreferrer" class="acc-btn acc-btn-primary acc-btn-sm" id="sls-wa-open-link"></a>' +
      '</div>';
    document.body.appendChild(dlg);
    dlg.querySelector('#sls-wa-close-btn').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('#sls-wa-copy-btn').addEventListener('click', async function () {
      var ta = dlg.querySelector('#sls-wa-textarea');
      try { await navigator.clipboard.writeText(ta.value); } catch (_) {}
      showToast(isEn() ? 'WhatsApp message copied (Miqat-branded, partner name excluded).' : 'تم نسخ رسالة واتساب (باسم ميقات فقط ودون اسم الشركة الشريكة).');
    });
    dlg.querySelector('#sls-wa-textarea').addEventListener('input', function () {
      var ta = dlg.querySelector('#sls-wa-textarea');
      dlg.querySelector('#sls-wa-open-link').href = 'https://wa.me/?text=' + encodeURIComponent(ta.value);
    });
    return dlg;
  }

  function openWhatsAppShare(program) {
    var dlg = ensureWhatsAppDialog();
    var en = isEn();
    var msg = buildWhatsAppMessage(program);
    dlg.querySelector('#sls-wa-title').textContent = en ? 'Prepare Customer WhatsApp Message' : 'تجهيز رسالة واتساب للعميل';
    dlg.querySelector('#sls-wa-close-btn').textContent = en ? 'Close' : 'إغلاق';
    dlg.querySelector('#sls-wa-notice').textContent = en
      ? 'Partner company identity and internal conversion metrics are automatically excluded. Preparing a message does not claim automatic delivery.'
      : 'يتم استبعاد اسم الشركة الشريكة ومؤشرات التحويل الداخلية تلقائياً. تجهيز الرسالة لا يعني الإرسال التلقائي.';
    dlg.querySelector('#sls-wa-label').textContent = en ? 'Customer-Facing Message Preview (Editable)' : 'معاينة الرسالة الموجهة للعميل (قابلة للتعديل)';
    dlg.querySelector('#sls-wa-textarea').value = msg;
    dlg.querySelector('#sls-wa-copy-btn').textContent = en ? 'Copy Message' : 'نسخ الرسالة';
    var openLink = dlg.querySelector('#sls-wa-open-link');
    openLink.textContent = en ? 'Open in WhatsApp' : 'فتح في واتساب';
    openLink.href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    dlg.showModal();
  }

  function renderProgramCardHTML(p, opts) {
    opts = opts || {};
    var en = isEn();
    var title = en ? p.title_en : p.title_ar;
    var compName = en ? p.company_name_en : p.company_name_ar;
    var makkahHotel = (en ? p.makkah_hotel_en : p.makkah_hotel_ar) || (en ? 'Not specified' : 'غير محدد');
    var airline = (en ? p.airline_en : p.airline_ar) || (en ? 'Not specified' : 'غير محدد');
    var occ = (en ? p.occupancy_summary_en : p.occupancy_summary_ar) || (en ? 'Not specified' : 'غير محدد');
    var services = en ? (p.services_en || []) : (p.services_ar || []);
    var servicesSummary = services.length ? services.slice(0, 2).join(' • ') : (en ? 'Services details missing' : 'تفاصيل الخدمات غير متوفرة');
    var source = (en ? p.data_source_en : p.data_source_ar) || (en ? 'Source unknown' : 'مصدر غير محدد');
    var avail = getAvailabilityInfo(p.availability_status);
    var fresh = getFreshnessInfo(p.freshness_state);
    var compareIds = opts.compareIds || getCompareIds();
    var isCompared = compareIds.indexOf(p.id) >= 0;

    var matchBlock = '';
    if (p.match && p.match.has_criteria) {
      var scoreTxt = p.match.match_score != null ? (WS.formatNumber(p.match.match_score) + '%') : (en ? 'Incomplete' : 'غير مكتمل');
      var reasons = en ? (p.match.match_reasons_en || []) : (p.match.match_reasons_ar || []);
      var missing = p.match.missing_criteria || [];
      matchBlock =
        '<div class="sls-match-box">' +
          '<div class="sls-match-head">' +
            '<strong>' + esc(en ? 'Match Score' : 'نسبة التوافق') + ': <bdi dir="ltr">' + esc(scoreTxt) + '</bdi></strong>' +
            (p.match.is_incomplete_evaluation
              ? '<span class="status-pill status-pill-amber">' + esc(en ? 'Partial Data' : 'بيانات ناقصة') + '</span>'
              : '<span class="status-pill status-pill-navy">' + esc(en ? 'Evaluated' : 'تقييم مكتمل') + '</span>') +
          '</div>' +
          (reasons.length ? '<div class="sls-item-meta">' + esc(reasons.slice(0, 3).join(' • ')) + '</div>' : '') +
          (missing.length
            ? '<div class="sls-item-meta sls-missing-val">' + esc(en ? 'Not evaluated (missing): ' : 'معايير لم تُقيّم لنقص البيانات: ') +
              esc(missing.map(function (m) { return en ? m.label_en : m.label_ar; }).join('، ')) + '</div>'
            : '') +
        '</div>';
    }

    return '<article class="sls-sub-card sls-prog-card" data-program-id="' + esc(p.id) + '">' +
      '<div class="sls-prog-card-top">' +
        '<div class="sls-prog-badges">' +
          '<span class="status-pill status-pill-blue">' + esc(getTypeLabel(p)) + '</span>' +
          '<span class="status-pill ' + esc(avail.cls) + '">' + esc(avail.label) + ' (' + esc(WS.formatNumber(p.seats_available)) + ')</span>' +
          (p.is_recently_updated ? '<span class="status-pill status-pill-amber">' + esc(en ? 'Updated' : 'محدّث حديثاً') + '</span>' : '') +
          (p.is_pinned ? '<span class="status-pill status-pill-navy">' + esc(en ? 'Pinned' : 'مثبّت') + '</span>' : '') +
        '</div>' +
        '<strong class="sls-prog-price"><bdi dir="ltr">' + esc(formatCurrency(p.price_egp)) + '</bdi></strong>' +
      '</div>' +
      '<div>' +
        '<h3 class="sls-item-title"><a href="sales-program-details.html?id=' + encodeURIComponent(p.id) + '" class="sls-prog-title-link">' + esc(title) + '</a></h3>' +
        '<div class="sls-item-meta">' + esc(compName) + '</div>' +
      '</div>' +
      matchBlock +
      '<dl class="sls-prog-meta-grid">' +
        '<div><dt>' + esc(en ? 'Travel Dates' : 'موعد السفر') + '</dt><dd><bdi dir="ltr">' + esc(p.travel_date || '-') + ' → ' + esc(p.return_date || '-') + '</bdi></dd></div>' +
        '<div><dt>' + esc(en ? 'Makkah Hotel' : 'فندق مكة') + '</dt><dd>' + esc(makkahHotel) + ' (' + formatDistance(p.makkah_distance_m) + ')</dd></div>' +
        '<div><dt>' + esc(en ? 'Airline' : 'الطيران') + '</dt><dd>' + esc(airline) + '</dd></div>' +
        '<div><dt>' + esc(en ? 'Accommodation' : 'الإقامة') + '</dt><dd>' + esc(occ) + '</dd></div>' +
      '</dl>' +
      '<div class="sls-item-meta">' + esc(servicesSummary) + '</div>' +
      '<div class="sls-perf-row">' +
        '<span class="sls-item-meta">' + esc(en ? 'Conversion:' : 'التحويل:') + ' <strong><bdi dir="ltr">' + esc(formatConversionSummary(p)) + '</bdi></strong></span>' +
        (p.is_limited_data
          ? '<span class="status-pill status-pill-slate">' + esc(en ? 'Limited Data' : 'بيانات محدودة') + '</span>'
          : '') +
      '</div>' +
      '<div class="sls-prog-source-row">' +
        '<span class="status-pill ' + esc(fresh.cls) + '">' + esc(fresh.label) + '</span>' +
        '<span class="sls-item-meta">' + esc(source) + ' • <bdi dir="ltr">' + esc(formatDateShort(p.last_updated_at)) + '</bdi></span>' +
      '</div>' +
      '<div class="sls-prog-actions">' +
        '<a href="sales-program-details.html?id=' + encodeURIComponent(p.id) + '" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(en ? 'Details' : 'التفاصيل') + '</a>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-action="fav" data-id="' + esc(p.id) + '" aria-pressed="' + (p.is_favorite ? 'true' : 'false') + '">' +
          esc(p.is_favorite ? (en ? 'Saved ★' : 'بالمفضلة ★') : (en ? 'Favorite ☆' : 'مفضلة ☆')) +
        '</button>' +
        '<button type="button" class="acc-btn ' + (isCompared ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-action="compare" data-id="' + esc(p.id) + '" aria-pressed="' + (isCompared ? 'true' : 'false') + '">' +
          esc(isCompared ? (en ? 'In Compare ✓' : 'بالمقارنة ✓') : (en ? 'Compare' : 'مقارنة')) +
        '</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-action="share" data-id="' + esc(p.id) + '">' + esc(en ? 'WhatsApp' : 'واتساب') + '</button>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-action="pin-program" data-id="' + esc(p.id) + '" aria-pressed="' + (p.is_pinned ? 'true' : 'false') + '">' +
          esc(p.is_pinned ? (en ? 'Unpin' : 'إلغاء التثبيت') : (en ? 'Pin' : 'تثبيت')) +
        '</button>' +
      '</div>' +
    '</article>';
  }

  window.SalesCompaniesShared = {
    esc: esc,
    isEn: isEn,
    getCompareIds: getCompareIds,
    setCompareIds: setCompareIds,
    toggleCompareId: toggleCompareId,
    formatDateShort: formatDateShort,
    formatDateTime: formatDateTime,
    formatCurrency: formatCurrency,
    formatDistance: formatDistance,
    getFreshnessInfo: getFreshnessInfo,
    getOperationalStatusInfo: getOperationalStatusInfo,
    getAvailabilityInfo: getAvailabilityInfo,
    getTypeLabel: getTypeLabel,
    formatConversionSummary: formatConversionSummary,
    buildWhatsAppMessage: buildWhatsAppMessage,
    openWhatsAppShare: openWhatsAppShare,
    renderProgramCardHTML: renderProgramCardHTML,
    showToast: showToast
  };
})();
