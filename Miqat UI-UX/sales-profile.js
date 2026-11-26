/* ==========================================================================
   Miqat Sales & Call Center CRM — Page 5: My Profile Interactive Controller
   ========================================================================== */
(function () {
  'use strict';

  var WS = window.SalesWorkspace;

  var state = {
    data: null,
    activeTab: 'overview',
    highlightPeriod: 'this_month',
    achFilter: 'all',
    activityFilter: 'all',
    editingContact: false,
    savingContact: false,
    celebrationDismissed: false
  };

  var VALID_TABS = ['overview', 'info', 'growth', 'journey', 'security'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function isEn() {
    return WS && WS.getLang() === 'en';
  }

  function formatDate(iso) {
    if (!iso) return isEn() ? 'Not available' : 'غير متوفر';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleDateString(isEn() ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (_) {
      return String(iso);
    }
  }

  function formatDateTime(iso) {
    if (!iso) return isEn() ? 'Not available' : 'غير متوفر';
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

  function computeDurationLabel(joinedIso) {
    if (!joinedIso) return isEn() ? 'Not available' : 'غير متاح';
    var ms = Date.now() - Date.parse(joinedIso);
    if (isNaN(ms) || ms < 0) return isEn() ? 'New member' : 'عضو جديد';
    var days = Math.max(1, Math.floor(ms / 86400000));
    if (days < 30) return isEn() ? (days + ' day(s)') : (WS.formatNumber(days) + ' يوم');
    var months = Math.floor(days / 30);
    return isEn() ? (months + ' month(s)') : (WS.formatNumber(months) + ' شهر');
  }

  function showToast(msg) {
    var old = document.getElementById('sls-prof-toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'sls-prof-toast';
    el.className = 'sls-toast-banner';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 3200);
  }

  function applyStaggerFallback(container) {
    if (!container) return;
    if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-delay: calc(sibling-index() * 0.1s)')) return;
    Array.from(container.children).forEach(function (el, idx) {
      el.style.setProperty('--sibling-index', idx + 1);
    });
  }

  function setTab(tab) {
    if (VALID_TABS.indexOf(tab) < 0) tab = 'overview';
    state.activeTab = tab;
    document.querySelectorAll('[data-ptab]').forEach(function (btn) {
      btn.setAttribute('aria-selected', btn.getAttribute('data-ptab') === tab ? 'true' : 'false');
    });
    VALID_TABS.forEach(function (t) {
      var panel = document.getElementById('ppanel-' + t);
      if (!panel) return;
      if (t === tab) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', 'until-found');
    });
  }

  function renderHero() {
    var d = state.data;
    if (!d) return;
    var emp = d.employee;
    var en = isEn();
    var name = en ? emp.name_en : emp.name_ar;
    var role = en ? emp.role_title_en : emp.role_title_ar;
    var dept = en ? emp.department_en : emp.department_ar;
    var initial = (name || 'M').trim().charAt(0).toUpperCase();
    var latestEarned = (d.achievements || []).find(function (a) { return a.status === 'earned'; });
    var monthPct = (d.targetBreakdown && d.targetBreakdown.month) ? d.targetBreakdown.month.pct : 0;
    var cheerMsg = en
      ? (latestEarned ? 'Your consistency is making a difference — keep building your success!' : 'Welcome to your Miqat space — every step forward counts!')
      : (latestEarned ? 'استمراريتك تصنع فارقاً حقيقياً — واصل بناء نجاحك!' : 'مرحباً بك في مساحتك بميقات — كل خطوة للأمام تستحق التقدير!');

    document.getElementById('prof-hero-card').innerHTML =
      '<div class="sls-prof-hero-top">' +
        '<div class="sls-prof-identity">' +
          '<div class="sls-prof-avatar" aria-hidden="true">' + esc(initial) + '</div>' +
          '<div class="sls-prof-id-text">' +
            '<div class="sls-prog-badges">' +
              '<span class="status-pill status-pill-navy">' + esc(en ? 'Active Account' : 'حساب نشط') + '</span>' +
              '<span class="status-pill status-pill-blue"><bdi dir="ltr">' + esc(emp.employee_code) + '</bdi></span>' +
            '</div>' +
            '<h1 class="acc-page-title">' + esc(name) + '</h1>' +
            '<p class="sls-card-desc">' + esc(role) + ' • ' + esc(dept) + ' • ' + esc(en ? 'Joined:' : 'تاريخ الانضمام:') + ' <bdi dir="ltr">' + esc(formatDate(emp.joined_at)) + '</bdi></p>' +
            '<p class="sls-motivational">' + esc(cheerMsg) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="sls-prof-hero-widgets">' +
          '<div class="sls-prof-mini-card">' +
            '<span class="sls-item-meta">' + esc(en ? 'Latest Earned Milestone' : 'أحدث إنجاز محقق') + '</span>' +
            '<strong class="sls-item-title">' + esc(latestEarned ? (en ? latestEarned.title_en : latestEarned.title_ar) : (en ? 'In Progress' : 'قيد التقدم')) + '</strong>' +
          '</div>' +
          '<div class="sls-prof-mini-card">' +
            '<span class="sls-item-meta">' + esc(en ? 'Monthly Growth Progress' : 'مؤشر النمو الشهري') + '</span>' +
            '<strong class="sls-item-title"><bdi dir="ltr">' + esc(WS.formatNumber(monthPct)) + '%</bdi></strong>' +
            '<progress class="sls-progress sls-anim-progress" value="' + esc(monthPct) + '" max="100" aria-label="Monthly Growth"></progress>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderCelebration() {
    var d = state.data;
    var banner = document.getElementById('prof-celebration-banner');
    if (!d || state.celebrationDismissed) {
      banner.hidden = true;
      return;
    }
    var newlyEarned = (d.achievements || []).filter(function (a) { return a.is_newly_earned; });
    if (!newlyEarned.length) {
      banner.hidden = true;
      return;
    }
    var en = isEn();
    var first = newlyEarned[0];
    banner.hidden = false;
    banner.innerHTML =
      '<div class="sls-celebrate-inner">' +
        '<div>' +
          '<strong>' + esc(en ? 'Another milestone achieved! Your progress is worth celebrating.' : 'إنجاز جديد مستحق! تقدمك يستحق الاحتفاء.') + '</strong>' +
          '<p class="sls-item-meta">' + esc(en ? first.title_en : first.title_ar) + ' — ' + esc(en ? first.desc_en : first.desc_ar) + '</p>' +
        '</div>' +
        '<button type="button" class="acc-btn acc-btn-primary acc-btn-sm" id="prof-ack-celebrate">' + esc(en ? 'Acknowledge Milestone' : 'تأكيد واستمرار') + '</button>' +
      '</div>';

    document.getElementById('prof-ack-celebrate').addEventListener('click', async function () {
      state.celebrationDismissed = true;
      banner.hidden = true;
      try {
        await WS.apiFetch('/api/sales/profile/celebrate', {
          method: 'POST',
          body: JSON.stringify({ keys: newlyEarned.map(function (a) { return a.id; }) })
        });
      } catch (_) {}
    });
  }

  function renderHighlights() {
    var d = state.data;
    if (!d) return;
    var en = isEn();
    document.querySelectorAll('[data-hl-period]').forEach(function (btn) {
      var active = btn.getAttribute('data-hl-period') === state.highlightPeriod;
      btn.classList.toggle('acc-btn-primary', active);
      btn.classList.toggle('acc-btn-secondary', !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    var grid = document.getElementById('prof-highlights-grid');
    var list = d.highlights || [];
    if (!list.length) {
      grid.innerHTML = '<div class="sls-empty-state"><p>' + esc(en ? 'No verified highlights recorded for this period yet. Keep building your success!' : 'لا توجد محطات بارزة مسجلة لهذه الفترة حتى الآن. واصل التقدم!') + '</p></div>';
      return;
    }
    grid.innerHTML = list.map(function (h) {
      return '<article class="sls-sub-card sls-stagger-item sls-highlight-card">' +
        '<span class="status-pill status-pill-amber">' + esc(en ? h.title_en : h.title_ar) + '</span>' +
        '<strong class="sls-highlight-val">' + esc(en ? h.value_en : h.value_ar) + '</strong>' +
        '<p class="sls-item-meta">' + esc(en ? h.desc_en : h.desc_ar) + '</p>' +
      '</article>';
    }).join('');
    applyStaggerFallback(grid);
  }

  function renderPersonalAndWorkInfo() {
    var d = state.data;
    if (!d) return;
    var emp = d.employee;
    var en = isEn();
    var roTag = '<span class="status-pill status-pill-slate">' + esc(en ? 'Read-only' : 'للقراءة فقط') + '</span>';

    var personalCard = document.getElementById('prof-personal-card');
    if (state.editingContact) {
      personalCard.innerHTML =
        '<header class="sls-card-head">' +
          '<h2 class="sls-card-title">' + esc(en ? 'Personal Information' : 'البيانات الشخصية') + '</h2>' +
          '<span class="status-pill status-pill-blue">' + esc(en ? 'Editing Contact' : 'تعديل التواصل') + '</span>' +
        '</header>' +
        '<form id="prof-contact-form" class="sls-smart-form">' +
          '<div class="sls-field"><label for="prof-in-phone">' + esc(en ? 'Phone Number (Editable)' : 'رقم الهاتف (قابل للتعديل)') + '</label>' +
            '<input type="tel" id="prof-in-phone" class="acc-filter-input" value="' + esc(emp.phone || '') + '" required dir="ltr"></div>' +
          '<div class="sls-field"><label for="prof-in-wa">' + esc(en ? 'WhatsApp Number (Editable)' : 'رقم واتساب (قابل للتعديل)') + '</label>' +
            '<input type="tel" id="prof-in-wa" class="acc-filter-input" value="' + esc(emp.whatsapp || '') + '" dir="ltr"></div>' +
          '<p class="sls-item-meta">' + esc(en ? 'Full name, email, employee ID, department, job title, and joining date are permanently read-only.' : 'الاسم الكامل والبريد الإلكتروني والرقم الوظيفي والقسم والمسمى وتاريخ الانضمام للقراءة فقط.') + '</p>' +
          '<div class="sls-prog-actions">' +
            '<button type="submit" id="prof-save-btn" class="acc-btn acc-btn-primary acc-btn-sm" ' + (state.savingContact ? 'disabled' : '') + '>' + esc(state.savingContact ? (en ? 'Saving...' : 'جاري الحفظ...') : (en ? 'Save Changes' : 'حفظ التعديلات')) + '</button>' +
            '<button type="button" id="prof-cancel-edit" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(en ? 'Cancel' : 'إلغاء') + '</button>' +
          '</div>' +
        '</form>';

      document.getElementById('prof-cancel-edit').addEventListener('click', function () {
        state.editingContact = false;
        renderPersonalAndWorkInfo();
      });
      document.getElementById('prof-contact-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        var phone = document.getElementById('prof-in-phone').value.trim();
        var wa = document.getElementById('prof-in-wa').value.trim();
        if (phone.replace(/\D/g, '').length < 8) {
          showToast(en ? 'Please enter a valid phone number.' : 'يرجى إدخال رقم هاتف صحيح.');
          return;
        }
        state.savingContact = true;
        renderPersonalAndWorkInfo();
        try {
          await WS.apiFetch('/api/sales/profile/contact', {
            method: 'PATCH',
            body: JSON.stringify({ phone: phone, whatsapp: wa })
          });
          state.editingContact = false;
          state.savingContact = false;
          showToast(en ? 'Contact information updated successfully.' : 'تم تحديث بيانات التواصل بنجاح.');
          await loadProfile();
        } catch (err) {
          state.savingContact = false;
          renderPersonalAndWorkInfo();
          showToast(en ? 'Failed to update contact info.' : 'تعذر تحديث بيانات التواصل.');
        }
      });
    } else {
      personalCard.innerHTML =
        '<header class="sls-card-head">' +
          '<h2 class="sls-card-title">' + esc(en ? 'Personal Information' : 'البيانات الشخصية') + '</h2>' +
          '<button type="button" id="prof-edit-contact-btn" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(en ? 'Edit Phone / WhatsApp' : 'تعديل الهاتف / واتساب') + '</button>' +
        '</header>' +
        '<dl class="sls-detail-grid">' +
          '<div><dt>' + esc(en ? 'Full Name' : 'الاسم الكامل') + ' ' + roTag + '</dt><dd>' + esc(en ? emp.name_en : emp.name_ar) + '</dd></div>' +
          '<div><dt>' + esc(en ? 'Email' : 'البريد الإلكتروني') + ' ' + roTag + '</dt><dd><bdi dir="ltr">' + esc(emp.email) + '</bdi></dd></div>' +
          '<div><dt>' + esc(en ? 'Phone' : 'رقم الهاتف') + '</dt><dd><bdi dir="ltr">' + esc(emp.phone || '-') + '</bdi></dd></div>' +
          '<div><dt>' + esc(en ? 'WhatsApp' : 'رقم واتساب') + '</dt><dd><bdi dir="ltr">' + esc(emp.whatsapp || (en ? 'Not set' : 'غير مسجل')) + '</bdi></dd></div>' +
          '<div><dt>' + esc(en ? 'Employee ID' : 'الرقم الوظيفي') + ' ' + roTag + '</dt><dd><bdi dir="ltr">' + esc(emp.employee_code) + '</bdi></dd></div>' +
          '<div><dt>' + esc(en ? 'Department' : 'القسم') + ' ' + roTag + '</dt><dd>' + esc(en ? emp.department_en : emp.department_ar) + '</dd></div>' +
          '<div><dt>' + esc(en ? 'Job Title' : 'المسمى الوظيفي') + ' ' + roTag + '</dt><dd>' + esc(en ? emp.role_title_en : emp.role_title_ar) + '</dd></div>' +
          '<div><dt>' + esc(en ? 'Joining Date' : 'تاريخ الانضمام') + ' ' + roTag + '</dt><dd><bdi dir="ltr">' + esc(formatDate(emp.joined_at)) + '</bdi></dd></div>' +
        '</dl>';
      document.getElementById('prof-edit-contact-btn').addEventListener('click', function () {
        state.editingContact = true;
        renderPersonalAndWorkInfo();
      });
    }

    var latestShift = (d.shifts && d.shifts[0]) || d.workSession || null;
    var shiftLabel = latestShift
      ? (latestShift.shift_type === 'half' ? WS.t('shift_half') : WS.t('shift_full'))
      : (en ? 'Not started yet' : 'لم تبدأ بعد');

    document.getElementById('prof-work-card').innerHTML =
      '<header class="sls-card-head">' +
        '<h2 class="sls-card-title">' + esc(en ? 'Work Information' : 'بيانات العمل') + '</h2>' + roTag +
      '</header>' +
      '<dl class="sls-detail-grid">' +
        '<div><dt>' + esc(en ? 'Department' : 'القسم') + '</dt><dd>' + esc(en ? emp.department_en : emp.department_ar) + '</dd></div>' +
        '<div><dt>' + esc(en ? 'Job Title' : 'المسمى الوظيفي') + '</dt><dd>' + esc(en ? emp.role_title_en : emp.role_title_ar) + '</dd></div>' +
        '<div><dt>' + esc(en ? 'Employment Status' : 'الحالة الوظيفية') + '</dt><dd><span class="status-pill status-pill-navy">' + esc(en ? 'Active' : 'نشط') + '</span></dd></div>' +
        '<div><dt>' + esc(en ? 'Joining Date' : 'تاريخ الانضمام') + '</dt><dd><bdi dir="ltr">' + esc(formatDate(emp.joined_at)) + '</bdi></dd></div>' +
        '<div><dt>' + esc(en ? 'Tenure' : 'مدة العمل') + '</dt><dd>' + esc(computeDurationLabel(emp.joined_at)) + '</dd></div>' +
        '<div><dt>' + esc(en ? 'Shift Type' : 'نظام الوردية') + '</dt><dd>' + esc(shiftLabel) + '</dd></div>' +
      '</dl>' +
      '<h3 class="sls-item-title" style="margin-block-start:0.5rem;">' + esc(en ? 'Recent Work Shifts' : 'سجل الورديات الأخيرة') + '</h3>' +
      '<div class="sls-list">' +
        ((d.shifts && d.shifts.length) ? d.shifts.slice(0, 4).map(function (s) {
          return '<div class="sls-list-item">' +
            '<div class="sls-item-main"><span class="sls-item-title">' + esc(s.shift_type === 'half' ? WS.t('shift_half') : WS.t('shift_full')) + '</span>' +
            '<span class="sls-item-meta"><bdi dir="ltr">' + esc(WS.formatDuration(s.worked_seconds)) + '</bdi> • <bdi dir="ltr">' + esc(formatDateTime(s.started_at)) + '</bdi></span></div>' +
            '<span class="status-pill status-pill-navy">' + esc(s.status) + '</span>' +
          '</div>';
        }).join('') : '<p class="sls-item-meta">' + esc(en ? 'No shifts logged yet.' : 'لا توجد ورديات مسجلة بعد.') + '</p>') +
      '</div>';
  }

  function renderAchievementsAndGrowth() {
    var d = state.data;
    if (!d) return;
    var en = isEn();
    var allAch = d.achievements || [];
    var filtered = allAch.filter(function (a) {
      return state.achFilter === 'all' || a.status === state.achFilter;
    });

    var statusLabel = function (st) {
      if (st === 'earned') return { cls: 'status-pill-navy', txt: en ? 'Earned' : 'محقق' };
      if (st === 'in_progress') return { cls: 'status-pill-amber', txt: en ? 'In Progress' : 'قيد التقدم' };
      return { cls: 'status-pill-slate', txt: en ? 'Available' : 'متاح' };
    };

    var achCard = document.getElementById('prof-achievements-card');
    achCard.innerHTML =
      '<header class="sls-card-head">' +
        '<div>' +
          '<h2 class="sls-card-title">' + esc(en ? 'My Achievements' : 'إنجازاتي المستحقة') + '</h2>' +
          '<p class="sls-card-desc">' + esc(en ? 'Measured strictly from verified CRM contracts, calls, follow-ups, and shifts.' : 'مبنية على نتائجك الفعلية الموثقة في العقود والمكالمات والمتابعات والورديات.') + '</p>' +
        '</div>' +
        '<div class="sls-period-pills">' +
          ['all', 'earned', 'in_progress', 'available'].map(function (f) {
            var lbl = f === 'all' ? (en ? 'All' : 'الكل') : statusLabel(f).txt;
            return '<button type="button" class="acc-btn ' + (state.achFilter === f ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-ach-filter="' + f + '">' + esc(lbl) + '</button>';
          }).join('') +
        '</div>' +
      '</header>' +
      '<div class="sls-cards-grid sls-stagger-list" id="prof-ach-grid">' +
        (filtered.length ? filtered.map(function (a) {
          var st = statusLabel(a.status);
          return '<button type="button" class="sls-sub-card sls-stagger-item sls-ach-card" data-ach-id="' + esc(a.id) + '">' +
            '<div class="sls-prog-card-top">' +
              '<span class="status-pill ' + st.cls + '">' + esc(st.txt) + '</span>' +
              '<span class="sls-item-meta"><bdi dir="ltr">' + esc(WS.formatNumber(a.current_value)) + ' / ' + esc(WS.formatNumber(a.target_value)) + '</bdi></span>' +
            '</div>' +
            '<strong class="sls-item-title">' + esc(en ? a.title_en : a.title_ar) + '</strong>' +
            '<p class="sls-item-meta">' + esc(en ? a.desc_en : a.desc_ar) + '</p>' +
            '<progress class="sls-progress sls-anim-progress" value="' + esc(a.progress_pct) + '" max="100"></progress>' +
            '<span class="sls-item-meta">' + esc(a.earned_at ? ((en ? 'Earned: ' : 'تاريخ التحقق: ') + formatDate(a.earned_at)) : (en ? a.condition_en : a.condition_ar)) + '</span>' +
          '</button>';
        }).join('') : '<div class="sls-empty-state"><p>' + esc(en ? 'No achievements in this category yet.' : 'لا توجد إنجازات في هذا التصنيف حالياً.') + '</p></div>') +
      '</div>';

    applyStaggerFallback(document.getElementById('prof-ach-grid'));

    achCard.querySelectorAll('[data-ach-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.achFilter = btn.getAttribute('data-ach-filter');
        renderAchievementsAndGrowth();
      });
    });

    achCard.querySelectorAll('[data-ach-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ach = allAch.find(function (x) { return x.id === btn.getAttribute('data-ach-id'); });
        if (!ach) return;
        var dlg = document.getElementById('prof-ach-dialog');
        document.getElementById('prof-ach-dlg-title').textContent = en ? ach.title_en : ach.title_ar;
        document.getElementById('prof-ach-dlg-body').innerHTML =
          '<p>' + esc(en ? ach.desc_en : ach.desc_ar) + '</p>' +
          '<dl class="sls-detail-grid">' +
            '<div><dt>' + esc(en ? 'Condition' : 'الشرط المطلوب') + '</dt><dd>' + esc(en ? ach.condition_en : ach.condition_ar) + '</dd></div>' +
            '<div><dt>' + esc(en ? 'Current Progress' : 'التقدم الحالي') + '</dt><dd><bdi dir="ltr">' + esc(WS.formatNumber(ach.current_value)) + ' / ' + esc(WS.formatNumber(ach.target_value)) + ' (' + esc(WS.formatNumber(ach.progress_pct)) + '%)</bdi></dd></div>' +
            '<div><dt>' + esc(en ? 'Earned Date' : 'تاريخ الإنجاز') + '</dt><dd>' + esc(ach.earned_at ? formatDateTime(ach.earned_at) : (en ? 'Not earned yet' : 'لم يكتمل بعد')) + '</dd></div>' +
          '</dl>';
        dlg.showModal();
      });
    });

    // Professional Growth
    var g = d.growth;
    var growthCard = document.getElementById('prof-growth-card');
    growthCard.innerHTML =
      '<header class="sls-card-head">' +
        '<div>' +
          '<h2 class="sls-card-title">' + esc(en ? 'Professional Growth' : 'النمو والتطور المهني') + '</h2>' +
          '<p class="sls-card-desc">' + esc(en ? g.previousPeriodNote_en : g.previousPeriodNote_ar) + '</p>' +
        '</div>' +
        '<span class="status-pill status-pill-blue">' + esc(en ? 'Rule-Based Guidance (No Live AI)' : 'توجيهات مبنية على القواعد (ليست ذكاءً اصطناعياً حياً)') + '</span>' +
      '</header>' +
      '<div class="sls-cards-grid">' +
        g.metrics.map(function (m) {
          return '<article class="sls-sub-card">' +
            '<div class="sls-prog-card-top">' +
              '<strong class="sls-item-title">' + esc(en ? m.label_en : m.label_ar) + '</strong>' +
              '<span class="status-pill status-pill-navy"><bdi dir="ltr">' + esc(WS.formatNumber(m.current)) + esc(m.unit) + '</bdi></span>' +
            '</div>' +
            '<p class="sls-item-meta">' + esc(en ? m.definition_en : m.definition_ar) + '</p>' +
            '<progress class="sls-progress sls-anim-progress" value="' + esc(Math.min(100, m.current)) + '" max="100"></progress>' +
          '</article>';
        }).join('') +
      '</div>' +
      '<div class="sls-grid-2">' +
        '<div class="sls-sub-card"><h3 class="sls-item-title">' + esc(en ? 'Genuine Strengths' : 'نقاط القوة الفعلية') + '</h3>' +
          '<ul class="sls-cmp-list">' + (en ? g.strengths_en : g.strengths_ar).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="sls-sub-card"><h3 class="sls-item-title">' + esc(en ? 'Development Recommendations' : 'فرص التطوير والتوصيات') + '</h3>' +
          '<ul class="sls-cmp-list">' + (en ? g.improvements_en : g.improvements_ar).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
      '</div>';
  }

  function renderJourney() {
    var d = state.data;
    if (!d) return;
    var en = isEn();
    var jList = d.journey || [];
    document.getElementById('prof-journey-card').innerHTML =
      '<header class="sls-card-head">' +
        '<div>' +
          '<h2 class="sls-card-title">' + esc(en ? 'My Journey at Miqat' : 'رحلتي المهنية في ميقات') + '</h2>' +
          '<p class="sls-card-desc">' + esc(en ? 'Chronological record of verified milestones and achievements (read-only).' : 'السجل الزمني للمحطات والإنجازات الموثقة (للقراءة فقط دون تعديل).') + '</p>' +
        '</div>' +
      '</header>' +
      '<ol class="sls-journey-timeline sls-stagger-list" id="prof-journey-list">' +
        jList.map(function (ev) {
          return '<li class="sls-sub-card sls-stagger-item sls-journey-item">' +
            '<div class="sls-prog-card-top">' +
              '<span class="status-pill status-pill-blue">' + esc(ev.category) + '</span>' +
              '<span class="sls-item-meta"><bdi dir="ltr">' + esc(formatDateTime(ev.date)) + '</bdi></span>' +
            '</div>' +
            '<strong class="sls-item-title">' + esc(en ? ev.title_en : ev.title_ar) + '</strong>' +
            '<p class="sls-item-meta">' + esc(en ? ev.desc_en : ev.desc_ar) + '</p>' +
            '<span class="sls-item-meta">' + esc(en ? 'Source:' : 'المصدر:') + ' ' + esc(en ? ev.actor_en : ev.actor_ar) + '</span>' +
          '</li>';
        }).join('') +
      '</ol>';
    applyStaggerFallback(document.getElementById('prof-journey-list'));
  }

  function renderSecurityPermissionsActivity() {
    var d = state.data;
    if (!d) return;
    var en = isEn();
    var sec = d.security;

    document.getElementById('prof-security-card').innerHTML =
      '<header class="sls-card-head">' +
        '<h2 class="sls-card-title">' + esc(en ? 'Account & Security' : 'الحساب والأمان') + '</h2>' +
        '<button type="button" id="prof-term-btn" class="acc-btn acc-btn-secondary acc-btn-sm">' + esc(en ? 'Terminate Other Sessions' : 'إنهاء الجلسات الأخرى') + '</button>' +
      '</header>' +
      '<dl class="sls-detail-grid">' +
        '<div><dt>' + esc(en ? 'Last Successful Login' : 'آخر تسجيل دخول') + '</dt><dd><bdi dir="ltr">' + esc(formatDateTime(sec.lastLoginAt)) + '</bdi></dd></div>' +
        '<div><dt>' + esc(en ? 'Active Sessions' : 'الجلسات النشطة') + '</dt><dd><bdi dir="ltr">' + esc(WS.formatNumber(sec.activeSessionsCount)) + '</bdi></dd></div>' +
        '<div><dt>' + esc(en ? 'Password Policy' : 'سياسة كلمة المرور') + '</dt><dd>' + esc(en ? sec.passwordPolicy_en : sec.passwordPolicy_ar) + '</dd></div>' +
        '<div><dt>' + esc(en ? 'Two-Factor Auth (2FA)' : 'التحقق الثنائي (2FA)') + '</dt><dd><span class="status-pill status-pill-slate">' + esc(en ? 'Future Capability (Not Active)' : 'ميزة مستقبلية (غير مفعلة)') + '</span></dd></div>' +
      '</dl>';

    document.getElementById('prof-term-btn').addEventListener('click', function () {
      var dlg = document.getElementById('prof-terminate-dialog');
      dlg.returnValue = '';
      dlg.showModal();
    });

    var perm = d.permissions;
    var permCatLabel = function (k) {
      if (k === 'allowed') return { cls: 'status-pill-navy', txt: en ? 'Allowed' : 'مسموح' };
      if (k === 'approval_required') return { cls: 'status-pill-amber', txt: en ? 'Approval Required' : 'يتطلب موافقة' };
      return { cls: 'status-pill-slate', txt: en ? 'Not Allowed (Admin Only)' : 'غير مسموح (للإدارة فقط)' };
    };

    document.getElementById('prof-permissions-card').innerHTML =
      '<header class="sls-card-head">' +
        '<h2 class="sls-card-title">' + esc(en ? 'My Permissions' : 'صلاحياتي') + '</h2>' +
        '<a href="sales-profile-permission.html" class="acc-btn acc-btn-primary acc-btn-sm">' + esc(en ? 'Request Permission' : 'طلب صلاحية من الإدارة') + '</a>' +
      '</header>' +
      '<div class="sls-list">' +
        perm.categories.map(function (cat) {
          var meta = permCatLabel(cat.key);
          return '<div class="sls-sub-card">' +
            '<span class="status-pill ' + meta.cls + '">' + esc(meta.txt) + '</span>' +
            '<ul class="sls-cmp-list">' + cat.items.map(function (i) { return '<li>' + esc(en ? i.label_en : i.label_ar) + '</li>'; }).join('') + '</ul>' +
          '</div>';
        }).join('') +
      '</div>' +
      (perm.requests && perm.requests.length ? '<h3 class="sls-item-title">' + esc(en ? 'Recent Permission Requests (Prototype)' : 'طلبات الصلاحيات المرسلة (نموذج تجريبي)') + '</h3><div class="sls-list">' +
        perm.requests.slice(0, 3).map(function (r) {
          return '<div class="sls-list-item"><div class="sls-item-main"><strong class="sls-item-title">' + esc(en ? r.permission_label_en : r.permission_label_ar) + '</strong><span class="sls-item-meta">' + esc(r.reason) + '</span></div><span class="status-pill status-pill-amber">' + esc(en ? 'Pending Admin' : 'بانتظار الإدارة') + '</span></div>';
        }).join('') + '</div>' : '');

    var acts = (d.accountActivity || []).filter(function (a) {
      return state.activityFilter === 'all' || a.account_category === state.activityFilter;
    });

    document.getElementById('prof-activity-card').innerHTML =
      '<header class="sls-card-head">' +
        '<h2 class="sls-card-title">' + esc(en ? 'Account Activity Timeline' : 'سجل نشاط الحساب') + '</h2>' +
        '<div class="sls-period-pills">' +
          [
            { k: 'all', ar: 'الكل', en: 'All' },
            { k: 'profile', ar: 'الملف', en: 'Profile' },
            { k: 'security', ar: 'الأمان', en: 'Security' },
            { k: 'permissions', ar: 'الصلاحيات', en: 'Permissions' },
            { k: 'admin', ar: 'إداري', en: 'Admin' }
          ].map(function (f) {
            return '<button type="button" class="acc-btn ' + (state.activityFilter === f.k ? 'acc-btn-primary' : 'acc-btn-secondary') + ' acc-btn-sm" data-act-filter="' + f.k + '">' + esc(en ? f.en : f.ar) + '</button>';
          }).join('') +
        '</div>' +
      '</header>' +
      '<div class="sls-list">' +
        (acts.length ? acts.map(function (a) {
          return '<div class="sls-list-item">' +
            '<div class="sls-item-main"><strong class="sls-item-title">' + esc(en ? a.desc_en : a.desc_ar) + '</strong>' +
            '<span class="sls-item-meta"><bdi dir="ltr">' + esc(formatDateTime(a.created_at)) + '</bdi> • ' + esc(a.source) + '</span></div>' +
            '<span class="status-pill status-pill-blue">' + esc(a.account_category) + '</span>' +
          '</div>';
        }).join('') : '<div class="sls-empty-state"><p>' + esc(en ? 'No account activity recorded for this filter.' : 'لا يوجد نشاط مسجل لهذا التصنيف.') + '</p></div>') +
      '</div>';

    document.getElementById('prof-activity-card').querySelectorAll('[data-act-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.activityFilter = btn.getAttribute('data-act-filter');
        renderSecurityPermissionsActivity();
      });
    });
  }

  function renderAll() {
    renderHero();
    renderCelebration();
    renderHighlights();
    renderPersonalAndWorkInfo();
    renderAchievementsAndGrowth();
    renderJourney();
    renderSecurityPermissionsActivity();
  }

  async function loadProfile() {
    state.data = await WS.apiFetch('/api/sales/profile?highlightPeriod=' + encodeURIComponent(state.highlightPeriod), { method: 'GET' });
    renderAll();
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await WS.init();
    await loadProfile();

    document.querySelectorAll('[data-ptab]').forEach(function (btn) {
      btn.addEventListener('click', function () { setTab(btn.getAttribute('data-ptab')); });
    });

    VALID_TABS.forEach(function (t) {
      var panel = document.getElementById('ppanel-' + t);
      if (panel) panel.addEventListener('beforematch', function () { setTab(t); });
    });

    document.querySelectorAll('[data-hl-period]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        state.highlightPeriod = btn.getAttribute('data-hl-period');
        await loadProfile();
      });
    });

    document.getElementById('prof-ach-dlg-close').addEventListener('click', function () {
      document.getElementById('prof-ach-dialog').close();
    });

    document.getElementById('prof-terminate-dialog').addEventListener('close', async function () {
      var rv = this.returnValue;
      this.returnValue = '';
      if (rv === 'confirm') {
        var res = await WS.apiFetch('/api/sales/profile/sessions/terminate-others', { method: 'POST' });
        showToast(isEn()
          ? ('Terminated ' + res.terminatedCount + ' other active session(s).')
          : ('تم إنهاء ' + WS.formatNumber(res.terminatedCount) + ' جلسة نشطة أخرى.'));
        await loadProfile();
      }
    });

    WS.onRefresh(renderAll);
  });
})();
