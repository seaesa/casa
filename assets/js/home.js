/* Trang chủ — Pinterest-style feed */
(function () {
  'use strict';
  var DX = window.DX;

  /* ---------- Pin data ---------- */
  var PROJECT_DESC = 'Top dự án điển hình trong các lĩnh vực hoạt động của Đông xưởng Casa: từ ý tưởng tham số, mô hình hóa đến triển khai và gia công.';
  var projects = [
    { key: 'kien-truc-canh-quan-1', title: 'Kiến trúc, cảnh quan' },
    { key: 'thiet-ke-tao-dang', title: 'Thiết kế tạo dáng' },
    { key: 'my-thuat-do-thi', title: 'Mỹ thuật đô thị' },
    { key: 'kien-truc-canh-quan-2', title: 'Kiến trúc, cảnh quan (phần 2)' },
    { key: 'gia-cong-ban-ve', title: 'Gia công bản vẽ' }
  ].map(function (p) {
    return {
      id: 'project:' + p.key, kind: 'project', group: 'du-an',
      img: 'project-' + p.key, w: 900, h: 1327,
      title: p.title, catLabel: 'Dự án tiêu biểu', desc: PROJECT_DESC,
      action: { label: 'Hồ sơ năng lực', href: DX.PORTFOLIO, external: true }
    };
  });

  var signature = {
    id: 'project:signature-dfma', kind: 'project', group: 'du-an',
    img: 'signature-dfma', w: 1000, h: 968,
    title: 'Signature: Design for Manufacturing & Assembly (DfMA)', catLabel: 'Dự án tiêu biểu',
    desc: 'Computational Design và DfMA là nền tảng giúp doanh nghiệp đưa các quyết định thiết kế, sản xuất và lắp dựng lên giai đoạn đầu của dự án, nơi chi phí thay đổi thấp nhưng tác động tạo ra lớn nhất.',
    action: { label: 'Hồ sơ năng lực', href: DX.PORTFOLIO, external: true }
  };

  var routes = [
    { key: 'tu-hoc', title: 'Casa⁺ | Tự học tiết kiệm', cat: 'lo-trinh', w: 700, h: 540,
      desc: 'Các khóa học giúp người học nắm vững kiến thức cơ bản đến nâng cao của Rhinoceros & Grasshopper một cách bài bản và có hệ thống.' },
    { key: 'gia-su', title: 'Casa⁺ | Gia sư chất lượng cao', cat: 'chuyen-nganh', w: 700, h: 598,
      desc: 'Các khóa học tập trung giải quyết bài toán thực tế ứng dụng Rhinoceros, Grasshopper vào dựng hình hoặc khai triển bản vẽ mô hình kiến trúc, nội thất, façade và tạo dáng.' },
    { key: 'doanh-nghiep', title: 'Casa⁺ | Đào tạo thực chiến cho doanh nghiệp', cat: 'doanh-nghiep', w: 700, h: 596,
      desc: 'Chương trình đào tạo và chuyển giao quy trình Computational Design được thiết kế theo nhu cầu doanh nghiệp, giúp chuẩn hóa quy trình, nâng cao năng lực đội ngũ và tối ưu hiệu quả triển khai dự án.' },
    { key: 'mcneel', title: 'McNeel | Luyện thi chứng nhận quốc tế', cat: 'mcneel', w: 700, h: 594,
      desc: 'Khóa học chuẩn hóa kỹ năng, chinh phục chứng chỉ quốc tế để khẳng định năng lực chuyên môn và bứt phá sự nghiệp thiết kế toàn cầu.' }
  ].map(function (r) {
    return {
      id: 'route:' + r.key, kind: 'route', group: 'lo-trinh',
      img: 'route-' + r.key, w: r.w, h: r.h, contain: true,
      title: r.title, catLabel: 'Đâu là lộ trình của bạn?', desc: r.desc,
      action: { label: 'Xem khóa học', href: 'courses.html?cat=' + r.cat }
    };
  });

  var courses = (window.COURSES || []).map(function (c) {
    return {
      id: 'course:' + c.slug, kind: 'course', group: c.cat, course: c,
      img: c.img, w: 1000, h: 704,
      title: c.title, catLabel: DX.CATS[c.cat], desc: c.desc,
      mentor: c.mentor, price: DX.price(c), badge: c.badge, free: c.price === 0,
      action: { label: 'Xem chi tiết', href: 'course.html?slug=' + encodeURIComponent(c.slug) }
    };
  });

  // Interleave so tall project images break up the landscape course covers.
  var visuals = [projects[0], routes[0], projects[1], signature, routes[1], projects[2], routes[2], projects[3], routes[3], projects[4]];
  var PINS = [];
  var ci = 0, vi = 0;
  while (ci < courses.length || vi < visuals.length) {
    if (vi < visuals.length) PINS.push(visuals[vi++]);
    for (var k = 0; k < 3 && ci < courses.length; k++) PINS.push(courses[ci++]);
  }

  /* ---------- Rendering ---------- */
  var feed = document.getElementById('feed');
  var emptyEl = document.getElementById('feed-empty');
  var countEl = document.getElementById('feed-count');

  function pinHTML(p, index) {
    var on = DX.isSaved(p.id);
    var sub = '';
    if (p.kind === 'course') {
      sub = '<div class="pin-sub"><span class="avatar' + (p.mentor === 'Lê Minh Huy' ? '' : ' is-red') + '" aria-hidden="true">' + DX.initials(p.mentor) + '</span>' +
        '<span>' + DX.esc(p.mentor) + '</span>' + (p.price ? '<span class="pin-price">' + p.price + '</span>' : '') + '</div>';
    } else {
      sub = '<div class="pin-sub"><span>' + DX.esc(p.catLabel) + '</span></div>';
    }
    var goExternal = p.action.external ? ' target="_blank" rel="noopener"' : '';
    return '<article class="pin" data-id="' + DX.esc(p.id) + '" data-index="' + index + '">' +
      '<div class="pin-frame">' +
      '<a class="pin-media' + (p.contain ? ' is-contain' : '') + '" href="' + DX.esc(p.action.href) + '"' + goExternal +
        ' data-open style="aspect-ratio:' + p.w + '/' + p.h + '" aria-label="Xem nhanh: ' + DX.esc(p.title) + '">' +
        '<img src="assets/img/' + p.img + '.webp" width="' + p.w + '" height="' + p.h + '" alt="' + DX.esc(p.title) + '" loading="lazy" decoding="async">' +
        '<span class="pin-shade"></span>' +
        (p.badge ? '<span class="pin-badge' + (p.free ? ' is-free' : '') + '">' + DX.esc(p.badge) + '</span>' : '') +
      '</a>' +
      '<div class="pin-actions">' +
        '<button class="btn btn-red pin-save" type="button" data-save="' + DX.esc(p.id) + '" data-name="' + DX.esc(p.title) + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Bỏ lưu ' : 'Lưu ') + DX.esc(p.title) + '">' +
          DX.icon('bookmark') + '<span class="pin-save-label">' + (on ? 'Đã lưu' : 'Lưu') + '</span></button>' +
        '<a class="btn pin-go" href="' + DX.esc(p.action.href) + '"' + goExternal + ' tabindex="-1">' + DX.icon(p.action.external ? 'external' : 'arrow-up-right') + '<span>' + DX.esc(p.action.label) + '</span></a>' +
        '<button class="icon-btn pin-share" type="button" data-share aria-label="Chia sẻ ' + DX.esc(p.title) + '">' + DX.icon('share') + '</button>' +
      '</div>' +
      '</div>' +
      '<div class="pin-meta"><h3 class="pin-title">' + DX.esc(p.title) + '</h3>' + sub + '</div>' +
    '</article>';
  }

  // Build all pin nodes once.
  var tmp = document.createElement('div');
  tmp.innerHTML = PINS.map(pinHTML).join('');
  var nodes = Array.prototype.slice.call(tmp.children);
  nodes.forEach(function (n) { DX.fadeIn(n.querySelector('img')); });

  /* ---------- Masonry ---------- */
  function columnCount() {
    var w = feed.clientWidth;
    if (w >= 1500) return 6;
    if (w >= 1180) return 5;
    if (w >= 880) return 4;
    if (w >= 600) return 3;
    return 2;
  }
  var currentCols = 0;
  var visible = PINS.map(function (_, i) { return i; });

  function layout(force) {
    var cols = columnCount();
    if (!force && cols === currentCols) return;
    currentCols = cols;
    var gap = parseFloat(getComputedStyle(feed).getPropertyValue('--gap')) || 16;
    var colW = (feed.clientWidth - gap * (cols - 1)) / cols;
    var heights = [];
    var colEls = [];
    var frag = document.createDocumentFragment();
    for (var c = 0; c < cols; c++) {
      var col = document.createElement('div');
      col.className = 'masonry-col';
      colEls.push(col);
      heights.push(0);
      frag.appendChild(col);
    }
    var metaH = colW < 200 ? 64 : 72;
    visible.forEach(function (i) {
      var p = PINS[i];
      var shortest = 0;
      for (var j = 1; j < cols; j++) if (heights[j] < heights[shortest] - 1) shortest = j;
      colEls[shortest].appendChild(nodes[i]);
      heights[shortest] += colW * p.h / p.w + metaH;
    });
    feed.innerHTML = '';
    feed.appendChild(frag);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { layout(false); }, 120);
  });

  /* ---------- Filtering ---------- */
  var state = { group: 'all', q: '' };
  var chips = document.querySelectorAll('#feed-chips .chip');
  var savedChip = document.querySelector('#feed-chips [data-group="saved"]');

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }
  PINS.forEach(function (p) { p._hay = norm([p.title, p.desc, p.catLabel, p.mentor || ''].join(' ')); });

  function apply() {
    var q = norm(state.q.trim());
    var terms = q ? q.split(/\s+/) : [];
    visible = [];
    PINS.forEach(function (p, i) {
      if (state.group === 'saved' && !DX.isSaved(p.id)) return;
      if (state.group !== 'all' && state.group !== 'saved' && p.group !== state.group) return;
      if (terms.length && !terms.every(function (t) { return p._hay.indexOf(t) > -1; })) return;
      visible.push(i);
    });
    layout(true);
    emptyEl.hidden = visible.length > 0;
    if (!visible.length) {
      var h = emptyEl.querySelector('.h-3'), t = emptyEl.querySelector('p');
      if (state.group === 'saved' && !q) {
        h.textContent = 'Bạn chưa lưu ghim nào';
        t.textContent = 'Nhấn “Lưu” trên ảnh dự án hoặc khóa học để gom chúng vào đây.';
      } else {
        h.textContent = 'Không tìm thấy kết quả cho “' + state.q.trim() + '”';
        t.textContent = 'Thử từ khóa ngắn hơn, ví dụ “facade”, “sofa” hoặc “McNeel”, hoặc xem tất cả.';
      }
    }
    countEl.textContent = visible.length + ' ghim';
    updateSavedCount();
  }

  function updateSavedCount() {
    var n = DX.savedCount();
    savedChip.querySelector('.count').textContent = n ? n : '';
  }

  function setGroup(g) {
    state.group = g;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.group === g ? 'true' : 'false'); });
    var active = document.querySelector('#feed-chips [data-group="' + g + '"]');
    if (active && DX.revealChip) DX.revealChip(active);
    apply();
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      setGroup(c.dataset.group);
      var bar = document.querySelector('.feed-bar');
      var top = bar.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72);
      if (window.scrollY > top + 2) window.scrollTo({ top: top });
    });
  });
  document.getElementById('feed-reset').addEventListener('click', function () {
    var input = document.querySelector('.site-header .search input');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    state.q = '';
    setGroup('all');
  });

  document.addEventListener('dx:saved', function () {
    updateSavedCount();
    if (state.group === 'saved') apply();
  });

  // Live search from the header field
  var searchTimer;
  DX.onSearch = function (value, submitted) {
    clearTimeout(searchTimer);
    var run = function () {
      state.q = value;
      apply();
      if (submitted) {
        var bar = document.querySelector('.feed-bar');
        var top = bar.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72);
        window.scrollTo({ top: Math.max(0, top) });
      }
    };
    if (submitted) run(); else searchTimer = setTimeout(run, 160);
  };

  /* ---------- Closeup modal ---------- */
  var modal = document.getElementById('closeup');
  var mImg = modal.querySelector('.closeup-media img');
  var mMedia = modal.querySelector('.closeup-media');
  var mCat = modal.querySelector('.closeup-cat');
  var mTitle = modal.querySelector('#closeup-title');
  var mDesc = modal.querySelector('.closeup-desc');
  var mPerson = modal.querySelector('.closeup-person');
  var mPrice = modal.querySelector('.closeup-price');
  var mPrimary = modal.querySelector('[data-primary]');
  var mSave = modal.querySelector('[data-modal-save]');
  var mZalo = modal.querySelector('[data-zalo]');
  var current = -1;

  function fillModal(i) {
    current = i;
    var p = PINS[i];
    mMedia.classList.toggle('is-contain', !!p.contain);
    mImg.classList.remove('is-loaded');
    mImg.src = 'assets/img/' + p.img + '.webp';
    mImg.width = p.w; mImg.height = p.h;
    mImg.alt = p.title;
    mCat.textContent = p.catLabel;
    mTitle.textContent = p.title;
    mDesc.textContent = p.desc;
    if (p.mentor) {
      mPerson.hidden = false;
      mPerson.innerHTML = '<span class="avatar' + (p.mentor === 'Lê Minh Huy' ? '' : ' is-red') + '" aria-hidden="true">' + DX.initials(p.mentor) + '</span><span>' + DX.esc(p.mentor) + '<small>Mentor</small></span>';
    } else mPerson.hidden = true;
    mPrice.hidden = !p.price;
    mPrice.textContent = p.price || '';
    mPrimary.href = p.action.href;
    mPrimary.querySelector('span').textContent = p.action.label;
    if (p.action.external) { mPrimary.target = '_blank'; mPrimary.rel = 'noopener'; }
    else { mPrimary.removeAttribute('target'); mPrimary.removeAttribute('rel'); }
    mSave.dataset.save = p.id;
    mSave.dataset.name = p.title;
    DX.paintSave(mSave, DX.isSaved(p.id));
    mZalo.hidden = p.kind !== 'course';
    var pos = visible.indexOf(i);
    modal.querySelector('.closeup-nav.prev').hidden = pos <= 0;
    modal.querySelector('.closeup-nav.next').hidden = pos === -1 || pos >= visible.length - 1;
    DX.fadeIn(mImg);
    modal.querySelector('.closeup').scrollTop = 0;
  }

  function step(dir) {
    var pos = visible.indexOf(current) + dir;
    if (pos >= 0 && pos < visible.length) fillModal(visible[pos]);
  }

  feed.addEventListener('click', function (e) {
    var pinEl = e.target.closest('.pin');
    if (!pinEl) return;
    var i = +pinEl.dataset.index;
    if (e.target.closest('[data-share]')) {
      e.preventDefault();
      var p = PINS[i];
      DX.share(p.title, p.action.href);
      return;
    }
    if (e.target.closest('[data-open]') || e.target.closest('.pin-title')) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab clicks through
      e.preventDefault();
      fillModal(i);
      DX.openLayer(modal, { returnTo: pinEl.querySelector('[data-open]') });
    }
  });
  modal.querySelector('.closeup-nav.prev').addEventListener('click', function () { step(-1); });
  modal.querySelector('.closeup-nav.next').addEventListener('click', function () { step(1); });
  document.addEventListener('keydown', function (e) {
    if (DX.topLayer() !== modal) return;
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  // Swipe between pins on touch
  var sx = null, sy = null;
  mMedia.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  mMedia.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    sx = sy = null;
  });
  modal.querySelector('[data-modal-share]').addEventListener('click', function () {
    var p = PINS[current];
    DX.share(p.title, p.action.href);
  });

  /* ---------- Team video ---------- */
  var video = document.querySelector('.hello-media video');
  var vbtn = document.querySelector('.media-toggle');
  if (video && vbtn) {
    var paint = function () {
      var playing = !video.paused;
      vbtn.innerHTML = DX.icon(playing ? 'pause' : 'play');
      vbtn.setAttribute('aria-label', playing ? 'Tạm dừng video' : 'Phát video');
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
    else video.play().catch(function () {});
    video.addEventListener('play', paint);
    video.addEventListener('pause', paint);
    vbtn.addEventListener('click', function () { video.paused ? video.play() : video.pause(); });
    paint();
  }

  /* ---------- Init ---------- */
  var initialQ = new URLSearchParams(location.search).get('q') || '';
  state.q = initialQ;
  apply();
})();
