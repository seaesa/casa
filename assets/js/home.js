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
  // Ảnh từ board Pinterest “Tx: In3D + Tráng men” của Đông xưởng; mỗi ảnh giữ nguồn gốc (domain, link, pin)
  var WORK = [
   {
    "img": "board/b00",
    "w": 564,
    "h": 564,
    "title": "Gạch gốm điêu khắc nhiều màu đất",
    "cat": "Gốm in 3D",
    "note": "Our favorite (and timeless) summer neutral color story  Renato Sabatino : compressed ceramics  #ceramicart #earthy #summerneutrals #colorstory #sculpture #ceramicsculpture #slowluxury",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/C6q6NKhONEE/",
    "pin": "https://www.pinterest.com/pin/488429522111908831/"
   },
   {
    "img": "board/b02",
    "w": 564,
    "h": 564,
    "title": "Rạn san hô đô thị in 3D từ nấm sợi",
    "cat": "Vật liệu sinh học",
    "note": "This 3D printed urban reef is constructed from mycelium to increase biodiversity in cities! – Yanko Design",
    "domain": "yankodesign.com",
    "link": "https://www.yankodesign.com/2021/11/03/this-3d-printed-urban-reef-is-constructed-from-mycelium-to-increase-biodiversity-in-cities/amp/",
    "pin": "https://www.pinterest.com/pin/488429522111907592/"
   },
   {
    "img": "board/b04",
    "w": 564,
    "h": 759,
    "title": "Ghế bê tông in 3D",
    "cat": "Bê tông in 3D",
    "note": "",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/DTwVSLJCEyF/",
    "pin": "https://www.pinterest.com/pin/488429522111906539/"
   },
   {
    "img": "board/b07",
    "w": 564,
    "h": 705,
    "title": "Bề mặt đất sét đan lưới",
    "cat": "Gốm in 3D",
    "note": "",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/DHTROQHMOnI/?img_index=2",
    "pin": "https://www.pinterest.com/pin/488429522111906525/"
   },
   {
    "img": "board/b10",
    "w": 564,
    "h": 558,
    "title": "Khối GFRP hoa văn chéo",
    "cat": "Gạch và mặt dựng",
    "note": "Instagram 上的 Pratt School of Architecture：「 GFRP (Glass Fiber Reinforced Polymer) Detail and Physical Construct Developed by #PrattSoA Undergraduate Students Barbara MIGLIETTI… 」",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/Blfe9GeAwU0/?utm_source=ig_share_sheet&igshid=1i59xqxmdsyzw",
    "pin": "https://www.pinterest.com/pin/488429522111906519/"
   },
   {
    "img": "board/b13",
    "w": 526,
    "h": 800,
    "title": "Tháp in 3D xoắn",
    "cat": "Bê tông in 3D",
    "note": "",
    "domain": "",
    "link": "https://www.google.com/url?sa=i&url=https://svenpfeiffer.de/project/printed-column&psig=AOvVaw2yl-CnjMbmH6AGUm5GRgZi&ust=1718623054902000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiT2Pj_34YDFQAAAAAdAAAAABAJ",
    "pin": "https://www.pinterest.com/pin/488429522111906507/"
   },
   {
    "img": "board/b14",
    "w": 564,
    "h": 705,
    "title": "Tường in 3D vân sóng",
    "cat": "Gạch và mặt dựng",
    "note": "Materials and textures matter. 💪 Not just for how things look, but how they feel, age, and impact the world around us.  At Fab.Pub we’re always experimenting with new and unexpected materials. From sugar-based, industrially compostable bioplastics and recycled coffee to reclaimed timber and metallic filaments, each one tells a story.  Are you curious about the possibilities for your next piece or project? Let’s talk materials and textures🌱  Find out more about our materials on our website fab...",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/DQUVPGqjVNK/?img_index=5",
    "pin": "https://www.pinterest.com/pin/488429522111906506/"
   },
   {
    "img": "board/b22",
    "w": 564,
    "h": 702,
    "title": "Tấm mặt dựng đất nung in 3D",
    "cat": "Gạch và mặt dựng",
    "note": "Terracotta in the making! We’re experimenting with new tile designs for an upcoming project; blending traditional materials with fresh ideas to create something bold and new.🧱   #bespoke #terracotta #expression #ornamentation #craftmanship #beauty #materialtest #inprogress",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/DJlZgrSMUvd/",
    "pin": "https://www.pinterest.com/pin/488429522111898351/"
   },
   {
    "img": "board/b25",
    "w": 564,
    "h": 376,
    "title": "Gạch tráng men in 3D",
    "cat": "Tráng men",
    "note": "",
    "domain": "parametric-architecture.com",
    "link": "https://parametric-architecture.com/design-tech-talk-7-0/",
    "pin": "https://www.pinterest.com/pin/488429522111840644/"
   },
   {
    "img": "board/b28",
    "w": 564,
    "h": 846,
    "title": "Cột in 3D nhiều màu",
    "cat": "Bê tông in 3D",
    "note": "Making our crazy column designs structural  At Vertico, we push the boundaries of 3D concrete printing, creating columns that are both visually striking and structurally sound. While our designs embrace intricate and modern aesthetics, they never compromise on strength and functionality.  In the photos, you can see a textbook example of 3D-printed, thin-walled formwork reinforced with standard self-compacting concrete, offering exceptional compressive strength.  Stay tuned as we continue to explore new ways to combine design freedom with engineering excellence!",
    "domain": "vertico.com",
    "link": "https://www.vertico.com/projects/structural-columns",
    "pin": "https://www.pinterest.com/pin/488429522111840403/"
   },
   {
    "img": "board/b38",
    "w": 528,
    "h": 660,
    "title": "Mặt dựng điêu khắc bằng gạch",
    "cat": "Gạch và mặt dựng",
    "note": "Sculpting Facades: Using New Technology to Create a More Textural and Expressive Architecture | ArchDaily",
    "domain": "archdaily.com",
    "link": "https://www.archdaily.com/1012032/sculpting-facades-using-new-technology-to-create-a-more-textural-and-expressive-architecture",
    "pin": "https://www.pinterest.com/pin/488429522111818625/"
   },
   {
    "img": "board/b40",
    "w": 564,
    "h": 752,
    "title": "Công viên công cộng in 3D",
    "cat": "Bê tông in 3D",
    "note": "World's first 3D printed public park features 3D printed sculptures, benches, flower beds in China",
    "domain": "worldarchitecture.org",
    "link": "https://worldarchitecture.org/architecture-news/emhne/world-s-first-3d-printed-public-park-features-3d-printed-sculptures-benches-flower-beds-in-china.html",
    "pin": "https://www.pinterest.com/pin/488429522111818620/"
   },
   {
    "img": "board/b43",
    "w": 564,
    "h": 752,
    "title": "Gạch tráng men mới ra lò",
    "cat": "Tráng men",
    "note": "The first tiles are out of the kiln. 🍃 \nFor our new design in Turkey, more soon!\n\n#architecturalceramics #digitalcraftsmanship #bespokeceramics #algorithmicdesign #roboticfabrication",
    "domain": "instagram.com",
    "link": "https://www.instagram.com/p/DZK1uJQjbAa/",
    "pin": "https://www.pinterest.com/pin/488429522111796187/"
   },
   {
    "img": "board/b44",
    "w": 564,
    "h": 374,
    "title": "Gạch tổ ong kết hợp gạch nung",
    "cat": "Gạch và mặt dựng",
    "note": "",
    "domain": "3druck.com",
    "link": "https://3druck.com/3d-druckmaterialien/unipor-zeigt-3d-druck-von-mauerziegeln-2277966/",
    "pin": "https://www.pinterest.com/pin/488429522111796184/"
   },
   {
    "img": "board/b46",
    "w": 564,
    "h": 705,
    "title": "Tường gạch đất nung in 3D",
    "cat": "Gạch và mặt dựng",
    "note": "",
    "domain": "design-milk.com",
    "link": "https://design-milk.com/a-historic-building-with-a-3d-printed-ceramic-facade-in-amsterdam/",
    "pin": "https://www.pinterest.com/pin/488429522111796166/"
   },
   {
    "img": "board/b47",
    "w": 564,
    "h": 751,
    "title": "Bồn cây bê tông in 3D dạng hữu cơ",
    "cat": "Bê tông in 3D",
    "note": "",
    "domain": "enr.com",
    "link": "https://www.enr.com/articles/61333-3d-printed-concrete-finds-its-footing",
    "pin": "https://www.pinterest.com/pin/488429522111796163/"
   }
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
          '<span class="pin-cap"><strong>' + DX.esc(p.title) + '</strong><span>' + DX.esc(p.cat) + (p.domain ? ', ' + DX.esc(p.domain) : '') + '</span></span>' +
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
    var desc = modal.querySelector('.closeup-desc');
    desc.textContent = p.note ? '“' + p.note + '”' : '';
    desc.hidden = !p.note;
    modal.querySelector('.closeup-src').textContent = p.domain ? 'Nguồn: ' + p.domain : 'Nguồn: Pinterest';
    var srcBtn = modal.querySelector('[data-src]');
    srcBtn.href = p.link || p.pin;
    srcBtn.hidden = !p.link;
    modal.querySelector('[data-pin]').href = p.pin;
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
