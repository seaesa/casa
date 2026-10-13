/* Trang Khóa học — tabs, search, saved filter */
(function () {
  'use strict';
  var DX = window.DX;
  var COURSES = window.COURSES || [];
  var grid = document.getElementById('course-grid');
  var emptyEl = document.getElementById('course-empty');
  var countEl = document.getElementById('course-count');
  var input = document.getElementById('course-q');
  var chips = document.querySelectorAll('#course-chips .chip');

  var params = new URLSearchParams(location.search);
  var state = {
    cat: DX.CATS[params.get('cat')] || params.get('cat') === 'saved' ? params.get('cat') : 'all',
    q: params.get('q') || ''
  };
  input.value = state.q;

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }
  COURSES.forEach(function (c) { c._hay = norm([c.title, c.desc, c.mentor, DX.CATS[c.cat]].join(' ')); });

  // Counts on chips
  chips.forEach(function (ch) {
    var g = ch.dataset.cat;
    var n = g === 'all' ? COURSES.length : g === 'saved' ? null : COURSES.filter(function (c) { return c.cat === g; }).length;
    if (n !== null) ch.querySelector('.count').textContent = n;
  });

  function syncUrl() {
    var p = new URLSearchParams();
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.q.trim()) p.set('q', state.q.trim());
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function render() {
    var terms = norm(state.q.trim()).split(/\s+/).filter(Boolean);
    var list = COURSES.filter(function (c) {
      if (state.cat === 'saved') { if (!DX.isSaved('course:' + c.slug)) return false; }
      else if (state.cat !== 'all' && c.cat !== state.cat) return false;
      return terms.every(function (t) { return c._hay.indexOf(t) > -1; });
    });
    grid.innerHTML = list.map(DX.courseCard).join('');
    emptyEl.hidden = list.length > 0;
    if (!list.length) {
      var h = emptyEl.querySelector('.h-3'), t = emptyEl.querySelector('p');
      if (state.cat === 'saved' && !terms.length) {
        h.textContent = 'Chưa có khóa học nào được lưu';
        t.textContent = 'Nhấn “Lưu” trên ảnh khóa học để xem lại nhanh tại đây.';
      } else {
        h.textContent = 'Không có khóa học phù hợp';
        t.textContent = 'Thử từ khóa khác như “facade”, “sofa”, “McNeel”, hoặc xem tất cả khóa học.';
      }
    }
    countEl.textContent = list.length + ' khóa học';
    chips.forEach(function (ch) { ch.setAttribute('aria-pressed', ch.dataset.cat === state.cat ? 'true' : 'false'); });
    var savedChip = document.querySelector('#course-chips [data-cat="saved"] .count');
    if (savedChip) savedChip.textContent = COURSES.filter(function (c) { return DX.isSaved('course:' + c.slug); }).length || '';
    syncUrl();
  }

  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      state.cat = ch.dataset.cat;
      render();
      if (DX.revealChip) DX.revealChip(ch);
    });
  });

  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { state.q = input.value; render(); }, 140);
  });
  document.getElementById('course-search').addEventListener('submit', function (e) {
    e.preventDefault();
    state.q = input.value; render(); input.blur();
  });
  document.getElementById('course-reset').addEventListener('click', function () {
    state.cat = 'all'; state.q = ''; input.value = ''; render();
  });

  // Header search on this page filters in place
  DX.onSearch = function (value, submitted) {
    if (!submitted) return;
    state.q = value; input.value = value; render();
    grid.scrollIntoView({ block: 'start' });
  };

  document.addEventListener('dx:saved', function () { if (state.cat === 'saved') render(); else {
    var savedChip = document.querySelector('#course-chips [data-cat="saved"] .count');
    if (savedChip) savedChip.textContent = COURSES.filter(function (c) { return DX.isSaved('course:' + c.slug); }).length || '';
  } });

  render();
  var active = document.querySelector('#course-chips .chip[aria-pressed="true"]');
  if (active && DX.revealChip) DX.revealChip(active);
})();
