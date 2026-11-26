/* ==========================================================================
   Miqat Sales & Call Center CRM — Program Details (8 Tabs & Sales Assistant)
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;
  var SH = window.SalesCompaniesShared;

  var state = {
    program: null,
    customers: [],
    activeTab: 'overview',
    generatedScript: null
  };

  var VALID_TABS = ['overview', 'hotels', 'flights', 'itinerary', 'services', 'pricing', 'assistant', 'history'];

  function setTab(tabName) {
    if (VALID_TABS.indexOf(tabName) < 0) tabName = 'overview';
    state.activeTab = tabName;
    document.querySelectorAll('[data-pd-tab]').forEach(function (btn) {
      var active = btn.getAttribute('data-pd-tab') === tabName;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    VALID_TABS.forEach(function (t) {
      var panel = document.getElementById('pd-panel-' + t);
      if (!panel) return;
      if (t === tabName) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', 'until-found');
      }
    });
  }

  function buildDeterministicScript(p, inputs) {
    var en = SH.isEn();
    var title = en ? p.title_en : p.title_ar;
    var price = SH.formatCurrency(p.price_egp);
    var makkah = (en ? p.makkah_hotel_en : p.makkah_hotel_ar) || (en ? 'Makkah hotel' : 'فندق مكة');
    var madinah = (en ? p.madinah_hotel_en : p.madinah_hotel_ar) || (en ? 'Madinah hotel' : 'فندق المدينة');
    var distMakkah = p.makkah_distance_m != null ? (p.makkah_distance_m + (en ? 'm from Masjid al-Haram' : ' متر من المسجد الحرام')) : (en ? 'shuttle-connected access' : 'باصات ترددية متواصلة');
    var custName = inputs.customerName || (en ? '[Customer Name]' : '[اسم العميل]');
    var cType = inputs.customerType || 'general';
    var style = inputs.commStyle || (en ? 'warm and consultative' : 'ودود واستشاري');

    // CRITICAL: Never expose partner company name in customer-facing scripts!
    var typeAngleAr = {
      general: 'نركز على التوازن بين جودة السكن، القرب من الحرم، ووضوح كافة الخدمات المشمولة.',
      price_focused: 'نوضح القيمة الفعلية مقابل السعر (' + price + ') وما يشمله من تأشيرة وطيران وإقامة دون رسوم خفية.',
      distance_focused: 'نبرز المسافة الفعلية للفندق (' + distMakkah + ') لتقليل مشقة الحركة والانتقال.',
      hesitant: 'نطمئن العميل بأن البيانات محدثة ومعتمدة عبر منصة ميقات مع إمكانية مراجعة كافة التفاصيل قبل الالتزام.',
      comparing: 'نلخص نقاط التميز المباشرة في هذا البرنامج مقارنة بالبدائل المماثلة من حيث الفندق والطيران والوجبات.',
      price_objection: 'نشرح أن السعر يعكس مستوى الفندق (' + makkah + ') وتوقيت السفر والخدمات المضمونة، ونستعرض بدائل مرنة إذا رغب.'
    };
    var typeAngleEn = {
      general: 'Focus on balancing accommodation quality, Haram proximity, and transparent included services.',
      price_focused: 'Highlight net value for ' + price + ' covering visa, flights, and stays with no hidden fees.',
      distance_focused: 'Emphasize exact Haram proximity (' + distMakkah + ') to minimize daily walking effort.',
      hesitant: 'Reassure the customer with verified Miqat-curated details and clear review before commitment.',
      comparing: 'Summarize direct differentiators in hotels, flight routing, and meals versus alternatives.',
      price_objection: 'Explain how the rate reflects ' + makkah + ' quality and guaranteed inclusions, while offering alternative tiers if needed.'
    };

    if (en) {
      return {
        opening: 'Assalamu Alaikum ' + custName + ', this is [Agent Name] from Miqat Platform for Hajj & Umrah. Thank you for speaking with us (' + style + ' tone). Based on your inquiry, I would like to share a licensed option curated by Miqat.',
        needsConnection: 'You mentioned: ' + (inputs.needs || 'comfortable religious journey') + (inputs.budget ? (' | Target budget: ' + inputs.budget + ' EGP') : '') + (inputs.hotelPref ? (' | Hotel preference: ' + inputs.hotelPref) : '') + '. ' + (typeAngleEn[cType] || typeAngleEn.general),
        explanation: 'Package: ' + title + ' (' + (p.travel_date || 'dates TBD') + ' to ' + (p.return_date || 'TBD') + '). Stay at ' + makkah + ' (' + distMakkah + ') and ' + madinah + '. Flights: ' + (p.flight_en || 'Confirmed routing') + '. Price: ' + price + '.',
        sellingPoints: (p.services_en || []).slice(0, 4).map(function (s) { return '• ' + s; }).join('\n'),
        objections: 'Likely concern (' + (inputs.objections || 'price / distance / timing') + '): Clarify verified inclusions, cancellation policy (' + (p.cancellation_policy_en || 'per partner terms') + '), and note that Miqat Accounts handles official contracting and payments securely.',
        closing: 'Would you like me to send you the verified Miqat summary on WhatsApp now, or schedule a quick follow-up call once you review with your family?'
      };
    }

    return {
      opening: 'السلام عليكم أستاذ/ة ' + custName + '، مع حضرتك [اسم الموظف] من منصة ميقات المعتمدة لرحلات الحج والعمرة. يسعدنا تواصلك معنا، وبناءً على طلبك أشاركك ترشيحاً مناسباً ومعتمداً عبر منصة ميقات.',
      needsConnection: 'بناءً على احتياجات حضرتك (' + (inputs.needs || 'رحلة مريحة وميسرة') + ')' + (inputs.budget ? (' وميزانية ' + inputs.budget + ' ج.م') : '') + (inputs.hotelPref ? (' وتفضيل السكن: ' + inputs.hotelPref) : '') + ': ' + (typeAngleAr[cType] || typeAngleAr.general),
      explanation: 'البرنامج: ' + title + ' (من ' + (p.travel_date || 'يُحدد') + ' إلى ' + (p.return_date || 'يُحدد') + '). الإقامة في ' + makkah + ' (' + distMakkah + ') و' + madinah + '. الطيران: ' + (p.flight_ar || 'محدد') + '. السعر: ' + price + '.',
      sellingPoints: (p.services_ar || []).slice(0, 4).map(function (s) { return '• ' + s; }).join('\n'),
      objections: 'الرد على الاستفسار المحتمل (' + (inputs.objections || 'السعر أو المسافة أو الموعد') + '): نوضح ما يشمله السعر بشفافية مع سياسة الإلغاء (' + (p.cancellation_policy_ar || 'وفق ضوابط البرنامج') + ')، وتتم إجراءات التعاقد والسداد رسمياً عبر إدارة الحسابات في ميقات.',
      closing: 'هل تحب أن أرسل لحضرتك ملخص التفاصيل على واتساب الآن، أم نحدد موعد متابعة بعد مراجعتك مع الأسرة؟'
    };
  }

  function renderHeader() {
    var p = state.program;
    var en = SH.isEn();
    var compName = p.company ? (en ? p.company.name_en : p.company.name_ar) : '';
    var title = en ? p.title_en : p.title_ar;
    var avail = SH.getAvailabilityInfo(p.availability_status);
    var fresh = SH.getFreshnessInfo(p.freshness_state);
    var isCompared = SH.getCompareIds().indexOf(p.id) >= 0;

    document.getElementById('pd-breadcrumb-company').textContent = compName;
    document.getElementById('pd-breadcrumb-company').href = 'sales-company-programs.html?companyId=' + encodeURIComponent(p.company_id);
    document.getElementById('pd-breadcrumb-program').textContent = title;

    document.getElementById('pd-header-card').innerHTML =
      '<div class="sls-welcome-top">' +
        '<div>' +
          '<div class="sls-prog-badges">' +
            '<span class="status-pill status-pill-blue">' + SH.esc(SH.getTypeLabel(p)) + '</span>' +
            '<span class="status-pill ' + SH.esc(avail.cls) + '">' + SH.esc(avail.label) + ' (' + SH.esc(WS.formatNumber(p.seats_available)) + ')</span>' +
            '<span class="status-pill ' + SH.esc(fresh.cls) + '">' + SH.esc(fresh.label) + '</span>' +
          '</div>' +
          '<h1 class="acc-page-title">' + SH.esc(title) + '</h1>' +
          '<p class="sls-card-desc">' + SH.esc(compName) + ' • <strong dir="ltr">' + SH.esc(SH.formatCurrency(p.price_egp)) + '</strong></p>' +
        '</div>' +
        '<div class="sls-header-nav-actions">' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="pd-fav-btn">' + SH.esc(p.is_favorite ? (en ? 'Saved in Favorites ★' : 'محفوظ بالمفضلة ★') : (en ? 'Add to Favorites ☆' : 'إضافة للمفضلة ☆')) + '</button>' +
          '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="pd-cmp-btn">' + SH.esc(isCompared ? (en ? 'In Compare ✓' : 'في المقارنة ✓') : (en ? 'Compare' : 'مقارنة')) + '</button>' +
          '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" id="pd-wa-btn">' + SH.esc(en ? 'Share via WhatsApp' : 'مشاركة واتساب') + '</button>' +
          '<a href="sales-program-report.html?id=' + encodeURIComponent(p.id) + '" class="acc-btn acc-btn-secondary acc-btn-sm">' + SH.esc(en ? 'Report Data Error' : 'إبلاغ عن خطأ بيانات') + '</a>' +
        '</div>' +
      '</div>';

    document.getElementById('pd-fav-btn').addEventListener('click', async function () {
      await WS.apiFetch('/api/sales/programs/favorites/toggle', { method: 'POST', body: JSON.stringify({ programId: p.id }) });
      await loadProgram();
    });
    document.getElementById('pd-cmp-btn').addEventListener('click', function () {
      var r = SH.toggleCompareId(p.id);
      if (r.limitReached) SH.showToast(en ? 'Maximum 4 programs allowed.' : 'الحد الأقصى ٤ برامج للمقارنة.');
      renderHeader();
    });
    document.getElementById('pd-wa-btn').addEventListener('click', function () {
      SH.openWhatsAppShare(p);
    });
  }

  function renderTabsContent() {
    var p = state.program;
    var en = SH.isEn();
    var compName = p.company ? (en ? p.company.name_en : p.company.name_ar) : '';
    var miss = function (txt) { return '<span class="sls-missing-val">' + SH.esc(txt || (en ? 'Not provided by source' : 'غير متوفر من المصدر')) + '</span>'; };

    // 1. Overview
    document.getElementById('pd-body-overview').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Program Overview' : 'نظرة عامة على البرنامج') + '</h2>' +
      '<dl class="sls-detail-grid">' +
        '<div><dt>' + SH.esc(en ? 'Program Name' : 'اسم البرنامج') + '</dt><dd>' + SH.esc(en ? p.title_en : p.title_ar) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Classification' : 'التصنيف') + '</dt><dd>' + SH.esc(SH.getTypeLabel(p)) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Partner Company' : 'الشركة السياحية') + '</dt><dd>' + SH.esc(compName) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Price' : 'السعر') + '</dt><dd><bdi dir="ltr">' + SH.esc(SH.formatCurrency(p.price_egp)) + '</bdi></dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Travel / Return' : 'تاريخ السفر والعودة') + '</dt><dd><bdi dir="ltr">' + SH.esc((p.travel_date || '-') + ' → ' + (p.return_date || '-')) + '</bdi> (' + SH.esc(WS.formatNumber(p.duration_days || 0)) + ' ' + SH.esc(en ? 'days' : 'أيام') + ')</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Conversion Performance' : 'معدل تحويل العقود') + '</dt><dd><bdi dir="ltr">' + SH.esc(SH.formatConversionSummary(p)) + '</bdi>' + (p.is_limited_data ? ' <span class="status-pill status-pill-slate">' + SH.esc(en ? 'Limited Data' : 'بيانات محدودة') + '</span>' : '') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Data Source' : 'مصدر البيانات') + '</dt><dd>' + SH.esc((en ? p.data_source_en : p.data_source_ar) || '-') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Last Updated' : 'آخر تحديث') + '</dt><dd><bdi dir="ltr">' + SH.esc(SH.formatDateTime(p.last_updated_at)) + '</bdi></dd></div>' +
      '</dl>' +
      '<div class="sls-recommend-box">' +
        '<h3 class="sls-item-title">' + SH.esc(en ? 'Recommend Program to a Customer' : 'تسجيل ترشيح البرنامج لعميل') + '</h3>' +
        '<p class="sls-item-meta">' + SH.esc(en ? 'Linking this program to a customer ensures you receive an impact notification if its price, dates, or hotels change.' : 'ربط الترشيح بالعميل يضمن إرسال إشعار تأثير لك فور حدوث أي تغيير في السعر أو المواعيد أو الفنادق.') + '</p>' +
        '<div class="sls-filter-toolbar">' +
          '<select id="pd-rec-customer" class="acc-filter-select" style="flex:1 1 220px;">' +
            '<option value="">' + SH.esc(en ? '-- Select Customer --' : '-- اختر العميل --') + '</option>' +
            state.customers.map(function (c) { return '<option value="' + SH.esc(c.id) + '">' + SH.esc(en ? c.name_en : c.name_ar) + '</option>'; }).join('') +
          '</select>' +
          '<button type="button" id="pd-rec-submit" class="acc-btn acc-btn-primary acc-btn-sm">' + SH.esc(en ? 'Record Recommendation' : 'تسجيل الترشيح') + '</button>' +
        '</div>' +
      '</div>';

    document.getElementById('pd-rec-submit').addEventListener('click', async function () {
      var cid = document.getElementById('pd-rec-customer').value;
      if (!cid) { SH.showToast(en ? 'Please select a customer first.' : 'اختر العميل أولاً.'); return; }
      await WS.apiFetch('/api/sales/programs/recommend', { method: 'POST', body: JSON.stringify({ customerId: cid, programId: p.id }) });
      SH.showToast(en ? 'Recommendation recorded for impact notifications.' : 'تم تسجيل الترشيح لمتابعة تنبيهات التغيير.');
    });

    // 2. Hotels & Accommodation
    document.getElementById('pd-body-hotels').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Hotels & Accommodation' : 'الفنادق والإقامة') + '</h2>' +
      '<dl class="sls-detail-grid">' +
        '<div><dt>' + SH.esc(en ? 'Makkah Hotel' : 'فندق مكة') + '</dt><dd>' + SH.esc((en ? p.makkah_hotel_en : p.makkah_hotel_ar) || '-') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Distance from Masjid al-Haram' : 'المسافة من المسجد الحرام') + '</dt><dd>' + SH.formatDistance(p.makkah_distance_m) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Madinah Hotel' : 'فندق المدينة') + '</dt><dd>' + SH.esc((en ? p.madinah_hotel_en : p.madinah_hotel_ar) || '-') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Distance from Prophet Mosque' : 'المسافة من المسجد النبوي') + '</dt><dd>' + SH.formatDistance(p.madinah_distance_m) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Hotel Classification' : 'تصنيف الفندق') + '</dt><dd>' + (p.hotel_stars ? ('<bdi dir="ltr">' + WS.formatNumber(p.hotel_stars) + ' ★</bdi>') : miss()) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Room & Occupancy' : 'أنواع الغرف والتسكين') + '</dt><dd>' + SH.esc((en ? p.occupancy_summary_en : p.occupancy_summary_ar) || '-') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Meals' : 'الوجبات') + '</dt><dd>' + ((en ? p.meals_en : p.meals_ar) ? SH.esc(en ? p.meals_en : p.meals_ar) : miss()) + '</dd></div>' +
      '</dl>';

    // 3. Flights & Transportation
    document.getElementById('pd-body-flights').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Flights & Transportation' : 'الطيران والانتقالات') + '</h2>' +
      '<dl class="sls-detail-grid">' +
        '<div><dt>' + SH.esc(en ? 'Airline' : 'شركة الطيران') + '</dt><dd>' + SH.esc((en ? p.airline_en : p.airline_ar) || '-') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Flight Routing' : 'مسار الرحلة') + '</dt><dd>' + SH.esc((en ? p.flight_en : p.flight_ar) || '-') + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Departure Airport & Time' : 'مطار ووقت الإقلاع') + '</dt><dd>' + (p.departure_time ? (SH.esc(en ? p.departure_airport_en : p.departure_airport_ar) + ' — <bdi dir="ltr">' + SH.esc(p.departure_time) + '</bdi>') : miss()) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Arrival Airport & Time' : 'مطار ووقت الوصول') + '</dt><dd>' + (p.arrival_time ? (SH.esc(en ? p.arrival_airport_en : p.arrival_airport_ar) + ' — <bdi dir="ltr">' + SH.esc(p.arrival_time) + '</bdi>') : miss()) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Ground Transportation' : 'الانتقالات الداخلية') + '</dt><dd>' + SH.esc((en ? p.transport_en : p.transport_ar) || '-') + '</dd></div>' +
      '</dl>';

    // 4. Itinerary
    var itinerary = p.itinerary || [];
    document.getElementById('pd-body-itinerary').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Travel Itinerary' : 'خط السير والجدول الزمني') + '</h2>' +
      (itinerary.length
        ? '<ol class="sls-itinerary-list">' + itinerary.map(function (step) {
            return '<li class="sls-list-item"><div class="sls-item-main"><strong class="sls-item-title">' + SH.esc((en ? 'Day ' : 'اليوم ') + WS.formatNumber(step.day) + ': ' + (en ? step.title_en : step.title_ar)) + '</strong><span class="sls-item-meta">' + SH.esc(en ? step.desc_en : step.desc_ar) + '</span></div></li>';
          }).join('') + '</ol>'
        : '<div class="sls-empty-state"><p>' + SH.esc(en ? 'Detailed itinerary is not available from the partner source yet.' : 'خط السير التفصيلي غير متوفر من مصدر الشريك حالياً.') + '</p></div>');

    // 5. Included Services
    var inc = en ? (p.services_en || []) : (p.services_ar || []);
    var opt = en ? (p.optional_services_en || []) : (p.optional_services_ar || []);
    document.getElementById('pd-body-services').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Included vs Optional Services' : 'الخدمات المشمولة والاختيارية') + '</h2>' +
      '<div class="sls-grid-2">' +
        '<div><h3 class="sls-item-title">' + SH.esc(en ? 'Included in Program' : 'مشمولة في البرنامج') + '</h3>' +
          (inc.length ? '<ul class="sls-cmp-list">' + inc.map(function (s) { return '<li>' + SH.esc(s) + '</li>'; }).join('') + '</ul>' : miss()) +
        '</div>' +
        '<div><h3 class="sls-item-title">' + SH.esc(en ? 'Optional / Upgrade Services' : 'خدمات اختيارية / ترقيات') + '</h3>' +
          (opt.length ? '<ul class="sls-cmp-list">' + opt.map(function (s) { return '<li>' + SH.esc(s) + '</li>'; }).join('') + '</ul>' : '<p class="sls-item-meta">' + SH.esc(en ? 'No optional add-ons listed.' : 'لا توجد خدمات اختيارية مسجلة.') + '</p>') +
        '</div>' +
      '</div>';

    // 6. Pricing & Conditions
    var excl = en ? (p.excluded_costs_en || []) : (p.excluded_costs_ar || []);
    document.getElementById('pd-body-pricing').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Pricing & Conditions' : 'الأسعار والشروط') + '</h2>' +
      '<p class="sls-item-meta">' + SH.esc(en ? 'Read-only program conditions. Sales employees do not collect payments or modify financial records.' : 'بيانات للعرض فقط. موظف المبيعات لا يقوم بتحصيل المدفوعات أو تعديل السجلات المالية.') + '</p>' +
      '<dl class="sls-detail-grid">' +
        '<div><dt>' + SH.esc(en ? 'Base Program Price' : 'السعر الأساسي') + '</dt><dd><bdi dir="ltr">' + SH.esc(SH.formatCurrency(p.price_egp)) + '</bdi></dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Cancellation Policy' : 'سياسة الإلغاء') + '</dt><dd>' + ((en ? p.cancellation_policy_en : p.cancellation_policy_ar) ? SH.esc(en ? p.cancellation_policy_en : p.cancellation_policy_ar) : miss()) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Payment Conditions' : 'شروط السداد') + '</dt><dd>' + ((en ? p.payment_conditions_en : p.payment_conditions_ar) ? SH.esc(en ? p.payment_conditions_en : p.payment_conditions_ar) : miss()) + '</dd></div>' +
        '<div><dt>' + SH.esc(en ? 'Excluded Costs' : 'تكاليف غير مشمولة') + '</dt><dd>' + (excl.length ? SH.esc(excl.join(' • ')) : miss()) + '</dd></div>' +
      '</dl>';

    // 7. Sales Assistant
    renderSalesAssistant();

    // 8. Update History
    var chgs = p.changelog || [];
    document.getElementById('pd-body-history').innerHTML =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Program Update History' : 'سجل تحديثات البرنامج') + '</h2>' +
      '<p class="sls-item-meta">' + SH.esc(en ? 'Historical bookings remain bound to the terms active at booking time.' : 'الحجوزات التاريخية السابقة تحتفظ بشروطها وأسعارها وقت التعاقد ولا تتأثر بالتحديثات اللاحقة.') + '</p>' +
      (chgs.length
        ? '<div class="sls-list">' + chgs.map(function (c) {
            return '<div class="sls-list-item">' +
              '<div class="sls-item-main">' +
                '<strong class="sls-item-title">' + SH.esc(en ? c.field_en : c.field_ar) + '</strong>' +
                '<span class="sls-item-meta">' + SH.esc(en ? c.prev_value_en : c.prev_value_ar) + ' → ' + SH.esc(en ? c.new_value_en : c.new_value_ar) + '</span>' +
                '<span class="sls-item-meta">' + SH.esc(en ? c.data_source_en : c.data_source_ar) + '</span>' +
              '</div>' +
              '<span class="sls-item-meta"><bdi dir="ltr">' + SH.esc(SH.formatDateTime(c.created_at)) + '</bdi></span>' +
            '</div>';
          }).join('') + '</div>'
        : '<div class="sls-empty-state"><p>' + SH.esc(en ? 'No changes recorded for this program yet.' : 'لا توجد تغييرات مسجلة لهذا البرنامج حتى الآن.') + '</p></div>');
  }

  function renderSalesAssistant() {
    var p = state.program;
    var en = SH.isEn();
    var ready = en ? (p.ready_script_en || '') : (p.ready_script_ar || '');
    var saved = p.saved_scripts || [];

    var html =
      '<h2 class="sls-card-title">' + SH.esc(en ? 'Sales Assistant (Miqat-Branded Scripts)' : 'مساعد المبيعات (سكربتات باسم ميقات)') + '</h2>' +
      '<div class="sls-notice-banner">' +
        '<strong>' + SH.esc(en ? 'Prototype Template Notice:' : 'تنويه النموذج التجريبي:') + '</strong> ' +
        SH.esc(en ? 'Scripts are generated locally using deterministic templates (no external AI API connected). Partner company names are strictly excluded.' : 'يتم توليد السكربتات محلياً عبر قوالب ذكية محددة مسبقاً (لا يوجد ربط بمزود ذكاء اصطناعي خارجي حالياً). يتم استبعاد اسم الشركة الشريكة دائماً.') +
      '</div>' +
      '<div class="sls-assistant-section">' +
        '<div class="sls-card-head"><h3 class="sls-item-title">' + SH.esc(en ? 'Ready-Made Program Script' : 'السكربت الجاهز للبرنامج') + '</h3>' +
        '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" id="sa-copy-ready">' + SH.esc(en ? 'Copy Ready Script' : 'نسخ السكربت الجاهز') + '</button></div>' +
        '<textarea id="sa-ready-text" class="acc-filter-input sls-textarea" rows="4">' + SH.esc(ready) + '</textarea>' +
      '</div>' +
      '<form id="sa-gen-form" class="sls-smart-form">' +
        '<h3 class="sls-item-title">' + SH.esc(en ? 'Generate Customer-Specific Script' : 'تخصيص سكربت لعميل محدد') + '</h3>' +
        '<div class="sls-smart-grid">' +
          '<div class="sls-field"><label for="sa-cust-name">' + SH.esc(en ? 'Customer Name' : 'اسم العميل') + '</label><input type="text" id="sa-cust-name" class="acc-filter-input"></div>' +
          '<div class="sls-field"><label for="sa-cust-type">' + SH.esc(en ? 'Customer Type (Optional)' : 'نمط العميل (اختياري)') + '</label>' +
            '<select id="sa-cust-type" class="acc-filter-select">' +
              '<option value="general">' + SH.esc(en ? 'General / Balanced' : 'عام / متوازن') + '</option>' +
              '<option value="price_focused">' + SH.esc(en ? 'Price-Focused' : 'مهتم بالسعر') + '</option>' +
              '<option value="distance_focused">' + SH.esc(en ? 'Haram-Distance-Focused' : 'مهتم بالقرب من الحرم') + '</option>' +
              '<option value="hesitant">' + SH.esc(en ? 'Hesitant Customer' : 'عميل متردد') + '</option>' +
              '<option value="comparing">' + SH.esc(en ? 'Comparing Multiple Programs' : 'يقارن بين عدة برامج') + '</option>' +
              '<option value="price_objection">' + SH.esc(en ? 'Objecting to Price' : 'يعترض على السعر') + '</option>' +
            '</select>' +
          '</div>' +
          '<div class="sls-field"><label for="sa-budget">' + SH.esc(en ? 'Budget (EGP)' : 'الميزانية (ج.م)') + '</label><input type="text" id="sa-budget" class="acc-filter-input"></div>' +
          '<div class="sls-field"><label for="sa-needs">' + SH.esc(en ? 'Customer Profile & Needs' : 'احتياجات العميل وتفضيلاته') + '</label><input type="text" id="sa-needs" class="acc-filter-input"></div>' +
          '<div class="sls-field"><label for="sa-hotel-pref">' + SH.esc(en ? 'Hotel Preferences' : 'تفضيلات الفندق') + '</label><input type="text" id="sa-hotel-pref" class="acc-filter-input"></div>' +
          '<div class="sls-field"><label for="sa-objections">' + SH.esc(en ? 'Concerns / Objections' : 'المخاوف والاعتراضات') + '</label><input type="text" id="sa-objections" class="acc-filter-input"></div>' +
          '<div class="sls-field"><label for="sa-style">' + SH.esc(en ? 'Communication Style' : 'أسلوب التواصل') + '</label><input type="text" id="sa-style" class="acc-filter-input"></div>' +
        '</div>' +
        '<div class="sls-smart-submit-row">' +
          '<button type="submit" class="acc-btn acc-btn-primary acc-btn-sm">' + SH.esc(en ? 'Generate Structured Script' : 'توليد السكربت المخصص') + '</button>' +
        '</div>' +
      '</form>' +
      '<div id="sa-output-wrap" class="sls-assistant-output" ' + (state.generatedScript ? '' : 'hidden') + '>' +
        '<div class="sls-card-head">' +
          '<h3 class="sls-item-title">' + SH.esc(en ? 'Generated 6-Part Script (Editable)' : 'السكربت المولد من ٦ أجزاء (قابل للتعديل)') + '</h3>' +
          '<div class="sls-header-nav-actions">' +
            '<button type="button" id="sa-copy-all" class="acc-btn acc-btn-secondary acc-btn-sm">' + SH.esc(en ? 'Copy Full Script' : 'نسخ السكربت كاملاً') + '</button>' +
            '<button type="button" id="sa-save-btn" class="acc-btn acc-btn-primary acc-btn-sm">' + SH.esc(en ? 'Save Script' : 'حفظ السكربت') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="sls-field"><label for="sa-out-1">' + SH.esc(en ? '1. Call Opening' : '١. افتتاحية المكالمة') + '</label><textarea id="sa-out-1" class="acc-filter-input sls-textarea" rows="2"></textarea></div>' +
        '<div class="sls-field"><label for="sa-out-2">' + SH.esc(en ? '2. Customer-Needs Connection' : '٢. ربط باحتياجات العميل') + '</label><textarea id="sa-out-2" class="acc-filter-input sls-textarea" rows="2"></textarea></div>' +
        '<div class="sls-field"><label for="sa-out-3">' + SH.esc(en ? '3. Program Explanation' : '٣. شرح البرنامج') + '</label><textarea id="sa-out-3" class="acc-filter-input sls-textarea" rows="2"></textarea></div>' +
        '<div class="sls-field"><label for="sa-out-4">' + SH.esc(en ? '4. Key Selling Points' : '٤. أبرز نقاط البيع') + '</label><textarea id="sa-out-4" class="acc-filter-input sls-textarea" rows="3"></textarea></div>' +
        '<div class="sls-field"><label for="sa-out-5">' + SH.esc(en ? '5. Responses to Likely Objections' : '٥. الرد على الاعتراضات المحتملة') + '</label><textarea id="sa-out-5" class="acc-filter-input sls-textarea" rows="2"></textarea></div>' +
        '<div class="sls-field"><label for="sa-out-6">' + SH.esc(en ? '6. Closing / Next Step' : '٦. الإغلاق والخطوة التالية') + '</label><textarea id="sa-out-6" class="acc-filter-input sls-textarea" rows="2"></textarea></div>' +
      '</div>' +
      '<div class="sls-assistant-saved">' +
        '<h3 class="sls-item-title">' + SH.esc(en ? 'My Saved Scripts for This Program' : 'سكربتاتي المحفوظة لهذا البرنامج') + '</h3>' +
        (saved.length
          ? '<div class="sls-list">' + saved.map(function (s) {
              return '<div class="sls-list-item">' +
                '<div class="sls-item-main"><strong class="sls-item-title">' + SH.esc(s.title) + '</strong><span class="sls-item-meta"><bdi dir="ltr">' + SH.esc(SH.formatDateTime(s.created_at)) + '</bdi></span></div>' +
                '<div class="sls-header-nav-actions">' +
                  '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-load-script="' + SH.esc(s.id) + '">' + SH.esc(en ? 'Load' : 'تحميل') + '</button>' +
                  '<button type="button" class="acc-btn acc-btn-secondary acc-btn-sm" data-del-script="' + SH.esc(s.id) + '">' + SH.esc(en ? 'Delete' : 'حذف') + '</button>' +
                '</div>' +
              '</div>';
            }).join('') + '</div>'
          : '<p class="sls-item-meta">' + SH.esc(en ? 'No saved scripts yet.' : 'لا توجد سكربتات محفوظة بعد.') + '</p>') +
      '</div>';

    var container = document.getElementById('pd-body-assistant');
    container.innerHTML = html;

    if (state.generatedScript) {
      document.getElementById('sa-out-1').value = state.generatedScript.opening || '';
      document.getElementById('sa-out-2').value = state.generatedScript.needsConnection || '';
      document.getElementById('sa-out-3').value = state.generatedScript.explanation || '';
      document.getElementById('sa-out-4').value = state.generatedScript.sellingPoints || '';
      document.getElementById('sa-out-5').value = state.generatedScript.objections || '';
      document.getElementById('sa-out-6').value = state.generatedScript.closing || '';
    }

    document.getElementById('sa-copy-ready').addEventListener('click', async function () {
      try { await navigator.clipboard.writeText(document.getElementById('sa-ready-text').value); } catch (_) {}
      SH.showToast(en ? 'Ready script copied.' : 'تم نسخ السكربت الجاهز.');
    });

    document.getElementById('sa-gen-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = {
        customerName: document.getElementById('sa-cust-name').value.trim(),
        customerType: document.getElementById('sa-cust-type').value,
        budget: document.getElementById('sa-budget').value.trim(),
        needs: document.getElementById('sa-needs').value.trim(),
        hotelPref: document.getElementById('sa-hotel-pref').value.trim(),
        objections: document.getElementById('sa-objections').value.trim(),
        commStyle: document.getElementById('sa-style').value.trim()
      };
      state.generatedScript = buildDeterministicScript(p, inputs);
      renderSalesAssistant();
    });

    document.getElementById('sa-copy-all').addEventListener('click', async function () {
      var full = [1, 2, 3, 4, 5, 6].map(function (i) { return document.getElementById('sa-out-' + i).value; }).join('\n\n');
      try { await navigator.clipboard.writeText(full); } catch (_) {}
      SH.showToast(en ? 'Full custom script copied.' : 'تم نسخ السكربت المخصص كاملاً.');
    });

    document.getElementById('sa-save-btn').addEventListener('click', async function () {
      var scriptObj = {
        opening: document.getElementById('sa-out-1').value,
        needsConnection: document.getElementById('sa-out-2').value,
        explanation: document.getElementById('sa-out-3').value,
        sellingPoints: document.getElementById('sa-out-4').value,
        objections: document.getElementById('sa-out-5').value,
        closing: document.getElementById('sa-out-6').value
      };
      var custName = document.getElementById('sa-cust-name').value.trim();
      var title = (custName ? custName + ' — ' : '') + (en ? p.title_en : p.title_ar);
      await WS.apiFetch('/api/sales/programs/scripts', {
        method: 'POST',
        body: JSON.stringify({
          programId: p.id,
          title: title,
          customerType: document.getElementById('sa-cust-type').value,
          script: scriptObj
        })
      });
      SH.showToast(en ? 'Script saved to your personal list.' : 'تم حفظ السكربت في قائمتك الشخصية.');
      await loadProgram();
    });

    container.querySelectorAll('[data-load-script]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sid = btn.getAttribute('data-load-script');
        var found = (p.saved_scripts || []).find(function (x) { return x.id === sid; });
        if (!found) return;
        try {
          state.generatedScript = JSON.parse(found.script_json);
          renderSalesAssistant();
        } catch (_) {}
      });
    });

    container.querySelectorAll('[data-del-script]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var sid = btn.getAttribute('data-del-script');
        await WS.apiFetch('/api/sales/programs/scripts/' + encodeURIComponent(sid), { method: 'DELETE' });
        await loadProgram();
      });
    });
  }

  async function loadProgram() {
    var id = new URLSearchParams(window.location.search).get('id') || 'PRG-UMR-RAJAB';
    var [progRes, custRes] = await Promise.all([
      WS.apiFetch('/api/sales/programs/' + encodeURIComponent(id), { method: 'GET' }),
      WS.apiFetch('/api/sales/customers', { method: 'GET' })
    ]);
    state.program = progRes.program;
    state.customers = custRes.customers || [];
    renderHeader();
    renderTabsContent();
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await WS.init();
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id') || 'PRG-UMR-RAJAB';
    var initialTab = params.get('tab') || 'overview';

    await loadProgram();
    setTab(initialTab);
    try {
      await WS.apiFetch('/api/sales/programs/recent', {
        method: 'POST',
        body: JSON.stringify({ programId: id, contextType: 'viewed' })
      });
    } catch (_) {}

    document.querySelectorAll('[data-pd-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTab(btn.getAttribute('data-pd-tab'));
      });
    });

    VALID_TABS.forEach(function (t) {
      var panel = document.getElementById('pd-panel-' + t);
      if (panel) {
        panel.addEventListener('beforematch', function () { setTab(t); });
      }
    });

    WS.onRefresh(function () {
      renderHeader();
      renderTabsContent();
    });
  });
})();
