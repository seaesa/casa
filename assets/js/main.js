/* Đông xưởng — shared behaviour: header, drawer, dialogs, saved pins, toast, renderers */
(function () {
  'use strict';

  var DX = (window.DX = window.DX || {});

  DX.CATS = {
    'lo-trinh': 'Lộ trình học',
    'chuyen-nganh': 'Ứng dụng chuyên ngành',
    'thu-vien': 'Thư viện plugin, code',
    'workshop': 'Workshop hướng dẫn đồ án',
    'doanh-nghiep': 'Đào tạo doanh nghiệp',
    'mcneel': 'Luyện thi chứng nhận McNeel',
    'hoc-vien': 'Học viên tiêu biểu'
  };
  DX.ZALO = 'https://zalo.me/0763161286';
  DX.PORTFOLIO = 'https://drive.google.com/file/d/1umKdY0bDLekZFHfh5nF_6yRPSu75GtYu/view?usp=drive_link';

  /* ---------- helpers ---------- */
  DX.icon = function (name, cls) {
    return '<svg class="i ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  };
  DX.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  DX.price = function (c) {
    if (c.price === 0) return 'Miễn phí';
    if (c.price) return c.price.toLocaleString('vi-VN') + ' ₫';
    return '';
  };
  DX.initials = function (name) {
    var p = name.trim().split(/\s+/);
    return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  };
  /* ---------- storage (best effort) ---------- */
  var KEY = 'dx-saved';
  function readSaved() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  var saved = readSaved();
  DX.isSaved = function (id) { return saved.indexOf(id) > -1; };
  DX.savedCount = function () { return saved.length; };
  DX.toggleSave = function (id) {
    var i = saved.indexOf(id);
    if (i > -1) saved.splice(i, 1); else saved.push(id);
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* private mode */ }
    var on = i === -1;
    document.querySelectorAll('[data-save="' + CSS.escape(id) + '"]').forEach(function (b) { DX.paintSave(b, on); });
    DX.toast(on ? 'Đã lưu. Xem lại trong mục Đã lưu' : 'Đã bỏ lưu');
    document.dispatchEvent(new CustomEvent('dx:saved', { detail: { id: id, on: on } }));
    return on;
  };
  DX.paintSave = function (btn, on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    var label = btn.querySelector('.pin-save-label, .save-label');
    if (label) label.textContent = on ? 'Đã lưu' : 'Lưu';
    btn.setAttribute('aria-label', (on ? 'Bỏ lưu ' : 'Lưu ') + (btn.dataset.name || ''));
  };

  /* ---------- toast ---------- */
  var toastEl, toastTimer;
  DX.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2400);
  };

  /* ---------- share ---------- */
  DX.share = function (title, url) {
    url = new URL(url, location.href).href;
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { DX.toast('Đã sao chép liên kết'); }, function () { DX.toast(url); });
    } else {
      DX.toast(url);
    }
  };

  /* ---------- scroll lock (stacked) ---------- */
  var locks = 0;
  DX.lockScroll = function () {
    if (locks++ === 0) {
      var sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
    }
  };
  DX.unlockScroll = function () {
    if (locks > 0 && --locks === 0) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  };

  /* ---------- layer manager: drawer & modals ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var stack = [];
  DX.openLayer = function (el, opts) {
    opts = opts || {};
    if (stack.some(function (l) { return l.el === el; })) return;
    var layer = { el: el, returnTo: opts.returnTo || document.activeElement, onClose: opts.onClose };
    stack.push(layer);
    el.hidden = false;
    // force reflow so transition runs
    void el.offsetWidth;
    el.classList.add('is-open');
    if (opts.scrim) opts.scrim.classList.add('is-open');
    layer.scrim = opts.scrim;
    el.setAttribute('aria-hidden', 'false');
    DX.lockScroll();
    var first = el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE);
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 30);
  };
  DX.closeLayer = function (el) {
    var idx = -1;
    stack.forEach(function (l, i) { if (l.el === el) idx = i; });
    if (idx === -1) return;
    var layer = stack.splice(idx, 1)[0];
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (layer.scrim) layer.scrim.classList.remove('is-open');
    DX.unlockScroll();
    if (layer.onClose) layer.onClose();
    if (layer.returnTo && layer.returnTo.focus && document.contains(layer.returnTo)) {
      layer.returnTo.focus({ preventScroll: true });
    }
  };
  DX.topLayer = function () { return stack.length ? stack[stack.length - 1].el : null; };

  document.addEventListener('keydown', function (e) {
    var top = DX.topLayer();
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); DX.closeLayer(top); return; }
    if (e.key === 'Tab') {
      var items = Array.prototype.filter.call(top.querySelectorAll(FOCUSABLE), function (n) {
        return n.offsetParent !== null || n === document.activeElement;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!top.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  var fabTop = document.querySelector('.fab-top');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 4);
    if (fabTop) fabTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (fabTop) fabTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  /* ---------- drawer ---------- */
  var drawer = document.getElementById('drawer');
  var scrim = document.getElementById('scrim');
  var toggle = document.querySelector('.menu-toggle');
  if (drawer && toggle) {
    toggle.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'true');
      DX.openLayer(drawer, {
        scrim: scrim, returnTo: toggle,
        onClose: function () { toggle.setAttribute('aria-expanded', 'false'); }
      });
    });
    drawer.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { DX.closeLayer(drawer); });
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) DX.closeLayer(drawer);
    });
    scrim.addEventListener('click', function () { DX.closeLayer(drawer); });
    // close drawer when resizing to desktop
    var mq = matchMedia('(min-width: 1100px)');
    var onMq = function () { if (mq.matches) DX.closeLayer(drawer); };
    mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
  }

  /* ---------- generic modal close wiring ---------- */
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target.closest('[data-dismiss]')) DX.closeLayer(m);
    });
  });

  /* ---------- search ---------- */
  var search = document.querySelector('.site-header .search');
  if (search) {
    var input = search.querySelector('input');
    var clear = search.querySelector('.search-clear');
    var params = new URLSearchParams(location.search);
    if (params.get('q') && !input.value) input.value = params.get('q');
    var syncClear = function () { clear.hidden = !input.value; };
    input.addEventListener('input', syncClear);
    clear.addEventListener('click', function () {
      input.value = '';
      syncClear();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    syncClear();
    search.addEventListener('submit', function (e) {
      if (DX.onSearch) { e.preventDefault(); DX.onSearch(input.value, true); input.blur(); return; }
      if (!input.value.trim()) { e.preventDefault(); input.focus(); }
    });
    input.addEventListener('input', function () { if (DX.onSearch) DX.onSearch(input.value, false); });
  }

  /* ---------- auth dialog ---------- */
  var auth = document.getElementById('auth');
  if (auth) {
    var tabs = auth.querySelectorAll('[role="tab"]');
    var panels = auth.querySelectorAll('[role="tabpanel"]');
    var setTab = function (name) {
      tabs.forEach(function (t) {
        var on = t.dataset.tab === name;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.dataset.panel !== name; });
      auth.querySelector('#auth-title').textContent = name === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản học';
    };
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { setTab(t.dataset.tab); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var other = t.dataset.tab === 'login' ? 'register' : 'login';
          setTab(other);
          auth.querySelector('[data-tab="' + other + '"]').focus();
        }
      });
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-auth]');
      if (!b) return;
      e.preventDefault();
      var returnTo = b;
      if (drawer && drawer.contains(b)) { DX.closeLayer(drawer); returnTo = toggle; }
      setTab(b.dataset.auth);
      auth.querySelectorAll('.form-alert').forEach(function (a) { a.hidden = true; });
      DX.openLayer(auth, { returnTo: returnTo });
    });
    auth.querySelectorAll('form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!DX.validate(f)) return;
        var alert = f.querySelector('.form-alert');
        alert.hidden = false;
        alert.focus();
      });
    });
  }

  /* ---------- form validation ---------- */
  DX.validate = function (form) {
    var ok = true, firstBad = null;
    form.querySelectorAll('.field').forEach(function (fd) {
      var inp = fd.querySelector('input, select, textarea');
      if (!inp) return;
      var err = fd.querySelector('.field-error');
      var msg = '';
      var v = inp.value.trim();
      if (inp.required && !v) msg = 'Vui lòng nhập ' + (inp.dataset.label || 'thông tin này') + '.';
      else if (v && inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Email chưa đúng định dạng, ví dụ: ten@email.com.';
      else if (v && inp.type === 'tel' && !/^(\+?84|0)\d{9,10}$/.test(v.replace(/[\s.]/g, ''))) msg = 'Số điện thoại gồm 10 chữ số, ví dụ: 0763161286.';
      else if (v && inp.minLength > 0 && v.length < inp.minLength) msg = 'Cần ít nhất ' + inp.minLength + ' ký tự.';
      fd.classList.toggle('has-error', !!msg);
      inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      if (msg) { ok = false; if (!firstBad) firstBad = inp; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  };
  document.addEventListener('input', function (e) {
    var fd = e.target.closest && e.target.closest('.field.has-error');
    if (fd) { fd.classList.remove('has-error'); var er = fd.querySelector('.field-error'); if (er) er.textContent = ''; }
  });

  /* ---------- chip scroller fades ---------- */
  DX.initChips = function (wrap) {
    var row = wrap.querySelector('.chips');
    var l = wrap.querySelector('.chips-fade.left');
    var r = wrap.querySelector('.chips-fade.right');
    if (!row || !l || !r) return;
    var update = function () {
      var max = row.scrollWidth - row.clientWidth;
      l.classList.toggle('is-visible', row.scrollLeft > 4);
      r.classList.toggle('is-visible', row.scrollLeft < max - 4);
    };
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    l.querySelector('button').addEventListener('click', function () { row.scrollBy({ left: -row.clientWidth * .7 }); });
    r.querySelector('button').addEventListener('click', function () { row.scrollBy({ left: row.clientWidth * .7 }); });
    update();
    DX.revealChip = function (chip) {
      var cl = chip.offsetLeft, cw = chip.offsetWidth;
      if (cl < row.scrollLeft || cl + cw > row.scrollLeft + row.clientWidth) {
        row.scrollTo({ left: Math.max(0, cl - 64) });
      }
    };
  };
  document.querySelectorAll('.chips-wrap').forEach(DX.initChips);

  /* ---------- image fade-in ---------- */
  DX.fadeIn = function (img) {
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
    else {
      img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true });
    }
  };

  /* ---------- course card renderer (courses page, related lists) ---------- */
  DX.courseCard = function (c) {
    var id = 'course:' + c.slug;
    var on = DX.isSaved(id);
    var title = c.title;
    var price = DX.price(c);
    return '<article class="card">' +
      '<div class="card-media">' +
        '<img src="assets/img/' + c.img + '.webp" width="1000" height="704" alt="" loading="lazy" decoding="async">' +
        (c.badge ? '<span class="pin-badge' + (c.price === 0 ? ' is-free' : '') + '">' + DX.esc(c.badge) + '</span>' : '') +
        '<div class="pin-actions">' +
          '<button class="btn btn-red pin-save" type="button" data-save="' + id + '" data-name="' + DX.esc(title) + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Bỏ lưu ' : 'Lưu ') + DX.esc(title) + '">' +
            DX.icon('bookmark') + '<span class="pin-save-label">' + (on ? 'Đã lưu' : 'Lưu') + '</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="card-body">' +
        '<span class="card-cat">' + DX.esc(DX.CATS[c.cat]) + '</span>' +
        '<h3 class="card-title"><a href="course.html?slug=' + encodeURIComponent(c.slug) + '">' + DX.esc(title) + '</a></h3>' +
        '<p class="card-desc">' + DX.esc(c.desc) + '</p>' +
        '<div class="card-foot"><span class="avatar' + (c.mentor === 'Lê Minh Huy' ? '' : ' is-red') + '" aria-hidden="true">' + DX.initials(c.mentor) + '</span>' +
          '<span>' + DX.esc(c.mentor) + '</span>' +
          (price ? '<span class="price">' + price + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</article>';
  };

  // Save buttons anywhere (delegated)
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-save]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    DX.toggleSave(b.dataset.save);
  });
})();
