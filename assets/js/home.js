/* Trang chủ: dải khóa học nổi bật + masonry dự án (kiểu Pinterest) */
(function () {
  'use strict';
  var DX = window.DX;
  var COURSES = window.COURSES || [];

  /* ---------- Featured course rail ---------- */
  var FEATURED = [
    'tu-hoc-tiet-kiem', 'gia-su-11-chat-luong-cao', 'hoc-nhom-tiet-kiem', 'gia-su-11-ung-dung-chuyen-nganh',
    'khoa-hoc-luyen-thi-mcneel-level-1', 'huong-dan-dung-hinh-do-an-sinh-vien-1-thang',
    '10-cach-ung-dung-parametric-vao-facade', '10-cach-ung-dung-parametric-vao-form-ai'
  ];
  var rail = document.getElementById('rail');
  if (rail) {
    rail.innerHTML = FEATURED.map(function (slug) {
      return COURSES.filter(function (c) { return c.slug === slug; })[0];
    }).filter(Boolean).map(DX.courseCard).join('');

    var prev = document.querySelector('[data-rail="-1"]');
    var next = document.querySelector('[data-rail="1"]');
    var syncRail = function () {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    };
    var railStep = function (dir) {
      var card = rail.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * .8;
      rail.scrollBy({ left: dir * w * Math.max(1, Math.floor(rail.clientWidth / w)), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', function () { railStep(-1); });
    next.addEventListener('click', function () { railStep(1); });
    rail.addEventListener('scroll', syncRail, { passive: true });
    window.addEventListener('resize', syncRail);
    syncRail();
  }

  /* ---------- Projects (masonry + closeup) ---------- */
  var BOARD_DESC = 'Top dự án điển hình trong các lĩnh vực hoạt động của Đông xưởng Casa: từ ý tưởng tham số, mô hình hóa đến triển khai và gia công.';
  var NAM_DESC = 'Nam xưởng hoạt động trong lĩnh vực tư vấn thiết kế, thi công kiến trúc, nội thất, cảnh quan, quy hoạch và tạo dáng công nghiệp.';
  var CASA_DESC = 'Ứng dụng Computational Design trong hệ sinh thái Casa⁺: nghiên cứu, đào tạo và chuyển giao giải pháp công nghệ.';
  var WORK = [
    { img: 'project-kien-truc-canh-quan-1', w: 900, h: 1327, title: 'Kiến trúc, cảnh quan', cat: 'Dự án tiêu biểu', desc: BOARD_DESC },
    { img: 'about-1', w: 600, h: 500, title: 'Cấu trúc lưới gỗ uốn cong', cat: 'Casa⁺', desc: CASA_DESC },
    { img: 'project-thiet-ke-tao-dang', w: 900, h: 1327, title: 'Thiết kế tạo dáng', cat: 'Dự án tiêu biểu', desc: BOARD_DESC },
    { img: 'signature-dfma', w: 1000, h: 968, title: 'Signature: Design for Manufacturing & Assembly', cat: 'DfMA', desc: 'Computational Design và DfMA giúp doanh nghiệp đưa các quyết định thiết kế, sản xuất và lắp dựng lên giai đoạn đầu của dự án, nơi chi phí thay đổi thấp nhưng tác động tạo ra lớn nhất.' },
    { img: 'project-my-thuat-do-thi', w: 900, h: 1327, title: 'Mỹ thuật đô thị', cat: 'Dự án tiêu biểu', desc: BOARD_DESC },
    { img: 'field-big', w: 600, h: 500, title: 'Mái vòm thép tham số', cat: 'Lĩnh vực hoạt động', desc: 'Nghiên cứu, đào tạo và chuyển giao: ba lĩnh vực hoạt động chính của Đông xưởng.' },
    { img: 'nam-xuong-1', w: 375, h: 350, title: 'Tư vấn thiết kế', cat: 'Nam xưởng', desc: NAM_DESC },
    { img: 'project-kien-truc-canh-quan-2', w: 900, h: 1327, title: 'Kiến trúc, cảnh quan (phần 2)', cat: 'Dự án tiêu biểu', desc: BOARD_DESC },
    { img: 'about-2', w: 600, h: 396, title: 'Mô hình quy hoạch mái vòm lưới', cat: 'Casa⁺', desc: CASA_DESC },
    { img: 'project-gia-cong-ban-ve', w: 900, h: 1327, title: 'Gia công bản vẽ', cat: 'Dự án tiêu biểu', desc: BOARD_DESC },
    { img: 'nam-xuong-3', w: 375, h: 350, title: 'Triển khai thiết kế', cat: 'Nam xưởng', desc: NAM_DESC }
  ];

  var work = document.getElementById('work');
  if (!work) return;

  var nodes = WORK.map(function (p, i) {
    var el = document.createElement('article');
    el.className = 'pin';
    el.innerHTML =
      '<div class="pin-frame">' +
        '<a class="pin-media" href="' + DX.img(p.img) + '" data-open style="aspect-ratio:' + p.w + '/' + p.h + '" aria-label="Xem dự án: ' + DX.esc(p.title) + '">' +
          '<img src="' + DX.img(p.img) + '" width="' + p.w + '" height="' + p.h + '" alt="' + DX.esc(p.title) + '" loading="lazy" decoding="async">' +
          '<span class="pin-shade"></span>' +
          '<span class="pin-cap"><strong>' + DX.esc(p.title) + '</strong><span>' + DX.esc(p.cat) + '</span></span>' +
        '</a>' +
        '<div class="pin-actions"><button class="icon-btn pin-share" type="button" data-share aria-label="Chia sẻ ' + DX.esc(p.title) + '">' + DX.icon('share') + '</button></div>' +
      '</div>';
    el.dataset.index = i;
    DX.fadeIn(el.querySelector('img'));
    return el;
  });

  var cols = 0;
  function columnCount() {
    var w = work.clientWidth;
    return w >= 1100 ? 4 : w >= 700 ? 3 : 2;
  }
  function layout() {
    var n = columnCount();
    if (n === cols) return;
    cols = n;
    var gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 16;
    var colW = (work.clientWidth - gap * (n - 1)) / n;
    var heights = [], els = [], frag = document.createDocumentFragment();
    for (var c = 0; c < n; c++) {
      var col = document.createElement('div');
      col.className = 'masonry-col';
      els.push(col); heights.push(0); frag.appendChild(col);
    }
    WORK.forEach(function (p, i) {
      var s = 0;
      for (var j = 1; j < n; j++) if (heights[j] < heights[s] - 1) s = j;
      els[s].appendChild(nodes[i]);
      heights[s] += colW * p.h / p.w + gap;
    });
    work.innerHTML = '';
    work.appendChild(frag);
  }
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
  layout();

  var modal = document.getElementById('closeup');
  var mImg = modal.querySelector('.closeup-media img');
  var current = 0;
  function fill(i) {
    current = i;
    var p = WORK[i];
    mImg.src = DX.img(p.img);
    mImg.width = p.w; mImg.height = p.h; mImg.alt = p.title;
    modal.querySelector('.closeup-cat').textContent = p.cat;
    modal.querySelector('#closeup-title').textContent = p.title;
    modal.querySelector('.closeup-desc').textContent = p.desc;
    modal.querySelector('.closeup-nav.prev').hidden = i === 0;
    modal.querySelector('.closeup-nav.next').hidden = i === WORK.length - 1;
    modal.querySelector('.closeup').scrollTop = 0;
  }
  function step(d) { var i = current + d; if (i >= 0 && i < WORK.length) fill(i); }

  function shareUrl() { return location.href.split('#')[0] + '#work-title'; }
  work.addEventListener('click', function (e) {
    var pin = e.target.closest('.pin');
    if (!pin) return;
    var i = +pin.dataset.index;
    if (e.target.closest('[data-share]')) { e.preventDefault(); DX.share(WORK[i].title, shareUrl()); return; }
    if (e.target.closest('[data-open]')) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      fill(i);
      DX.openLayer(modal, { returnTo: pin.querySelector('[data-open]') });
    }
  });
  modal.querySelector('.closeup-nav.prev').addEventListener('click', function () { step(-1); });
  modal.querySelector('.closeup-nav.next').addEventListener('click', function () { step(1); });
  modal.querySelector('[data-modal-share]').addEventListener('click', function () { DX.share(WORK[current].title, shareUrl()); });
  document.addEventListener('keydown', function (e) {
    if (DX.topLayer() !== modal) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  var sx = null, sy = null, media = modal.querySelector('.closeup-media');
  media.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  media.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    sx = sy = null;
  });
})();
