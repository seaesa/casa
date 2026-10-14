/* Hero "Forge" — scroll-driven 3D-print image sequence.
   The section is tall; its inner stage is sticky. Scroll progress (0..1) picks a frame
   from a pre-rendered WebP sequence and draws it on a canvas, while text chapters and
   the layer gauge follow the same progress. */
(function () {
  'use strict';
  var DX = window.DX;
  var root = document.getElementById('forge');
  if (!root) return;

  var FRAMES = 120;
  var canvas = root.querySelector('.forge-canvas');
  var ctx = canvas.getContext('2d');
  var poster = root.querySelector('.forge-poster');
  var chapters = Array.prototype.slice.call(root.querySelectorAll('.forge-ch'));
  var steps = Array.prototype.slice.call(root.querySelectorAll('.forge-steps li'));
  var pctEl = root.querySelector('.forge-pct span');
  var skip = root.querySelector('.forge-skip');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var portraitMq = matchMedia('(max-aspect-ratio: 4/5)');

  // Place step labels along the vertical gauge (desktop)
  steps.forEach(function (li) { li.style.bottom = (parseFloat(li.dataset.at) * 100) + '%'; });

  /* ---------- Static fallback (reduced motion) ---------- */
  function goStatic() {
    root.classList.add('is-static');
    chapters.forEach(function (c, i) { c.classList.toggle('is-active', i === 0); });
    var set = portraitMq.matches ? 'm' : 'd';
    poster.src = DX.base + 'assets/hero/' + set + '/' + pad(FRAMES - 1) + '.webp';
    var src = poster.parentElement.querySelector('source');
    if (src) src.srcset = DX.base + 'assets/hero/m/' + pad(FRAMES - 1) + '.webp';
    canvas.hidden = true;
  }
  if (reduce.matches) { goStatic(); return; }

  /* ---------- Frame loading: coarse-to-fine so scrubbing works early ---------- */
  var set = null, images = [], loaded = [];
  function pad(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }
  function loadOrder() {
    var order = [], seen = {};
    [16, 8, 4, 2, 1].forEach(function (step) {
      for (var i = 0; i < FRAMES; i += step) if (!seen[i]) { seen[i] = 1; order.push(i); }
    });
    if (!seen[FRAMES - 1]) order.splice(1, 0, FRAMES - 1);
    return order;
  }
  function startLoading() {
    var next = portraitMq.matches ? 'm' : 'd';
    if (next === set) return;
    set = next;
    images = new Array(FRAMES);
    loaded = new Array(FRAMES);
    var queue = loadOrder();
    var active = 0, MAX = 6, token = set;
    function pump() {
      while (active < MAX && queue.length) {
        (function (i) {
          active++;
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () {
            active--;
            if (token !== set) return;
            images[i] = img; loaded[i] = true;
            needsDraw = true;
            requestTick();
            pump();
          };
          img.onerror = function () { active--; pump(); };
          img.src = DX.base + 'assets/hero/' + set + '/' + pad(i) + '.webp';
        })(queue.shift());
      }
    }
    pump();
  }

  // Nearest loaded frame to the target index
  function nearest(i) {
    if (loaded[i]) return i;
    for (var d = 1; d < FRAMES; d++) {
      if (i - d >= 0 && loaded[i - d]) return i - d;
      if (i + d < FRAMES && loaded[i + d]) return i + d;
    }
    return -1;
  }

  /* ---------- Canvas sizing & cover-fit drawing ---------- */
  var cw = 0, ch = 0;
  function resize() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = Math.round(r.width * dpr); ch = Math.round(r.height * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    lastDrawn = -1; needsDraw = true;
  }
  var lastDrawn = -1, needsDraw = true;
  function draw(i) {
    var k = nearest(i);
    if (k < 0 || (k === lastDrawn && !needsDraw)) return;
    var img = images[k];
    var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    lastDrawn = k; needsDraw = false;
    if (k !== -1 && poster.style.visibility !== 'hidden') poster.style.visibility = 'hidden';
  }

  /* ---------- Scroll progress ---------- */
  var target = 0, current = 0, ticking = false;
  function progress() {
    var r = root.getBoundingClientRect();
    var pin = root.querySelector('.forge-pin').offsetHeight;
    var total = root.offsetHeight - pin;
    var headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    var p = (headerH - r.top) / total;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }
  function wanted() { return Math.round(current * (FRAMES - 1)); }

  var activeIdx = 0;
  function updateUI(p) {
    root.style.setProperty('--p', p.toFixed(4));
    pctEl.textContent = Math.round(p * 100);
    root.classList.toggle('is-moving', p > 0.02);
    // floating contact buttons would cover the skip button and gauge while the hero is pinned
    var bottom = root.getBoundingClientRect().bottom;
    document.body.classList.toggle('hero-pinned', visible && bottom > window.innerHeight * 0.55);
    root.classList.toggle('is-ending', p > 0.85);
    var idx = 0;
    chapters.forEach(function (c, i) { if (p >= parseFloat(c.dataset.from)) idx = i; });
    // gaps between chapters keep the previous one visible until the next starts
    if (idx !== activeIdx) {
      chapters[activeIdx].classList.remove('is-active');
      chapters[idx].classList.add('is-active');
      activeIdx = idx;
    }
    steps.forEach(function (li, i) {
      var at = parseFloat(li.dataset.at);
      var nextAt = steps[i + 1] ? parseFloat(steps[i + 1].dataset.at) : 2;
      li.classList.toggle('is-current', p >= at && p < nextAt);
      li.classList.toggle('is-done', p >= nextAt);
    });
  }

  function tick() {
    ticking = false;
    // ease toward the scroll target for a smooth, film-like scrub
    var diff = target - current;
    current = Math.abs(diff) < 0.0008 ? target : current + diff * 0.18;
    updateUI(current);
    draw(wanted());
    if (current !== target) requestTick();
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }

  function onScroll() { target = progress(); requestTick(); }

  // No scroll listener: while the hero is near the viewport (IntersectionObserver),
  // a rAF loop samples the scroll position once per frame.
  var visible = true, watching = false;
  function watch() {
    if (!visible) { watching = false; return; }
    var t = progress();
    if (t !== target) { target = t; requestTick(); }
    requestAnimationFrame(watch);
  }
  function startWatch() { if (!watching) { watching = true; requestAnimationFrame(watch); } }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) { onScroll(); startWatch(); } else document.body.classList.remove('hero-pinned');
    }, { rootMargin: '200px 0px' }).observe(root);
  } else {
    startWatch();
  }
  window.addEventListener('resize', function () { resize(); startLoading(); onScroll(); });
  var onMq = function () { startLoading(); resize(); onScroll(); };
  portraitMq.addEventListener ? portraitMq.addEventListener('change', onMq) : portraitMq.addListener(onMq);
  var onReduce = function () { if (reduce.matches) goStatic(); };
  reduce.addEventListener ? reduce.addEventListener('change', onReduce) : reduce.addListener(onReduce);

  skip.addEventListener('click', function () {
    var end = root.getBoundingClientRect().bottom + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72);
    window.scrollTo({ top: end, behavior: 'auto' });
    var next = document.querySelector('.promo-strip');
    if (next) next.focus({ preventScroll: true });
  });

  resize();
  startLoading();
  target = current = progress();
  updateUI(current);
})();
