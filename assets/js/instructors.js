/* Trang Giảng viên — liệt kê khóa học theo mentor */
(function () {
  'use strict';
  var DX = window.DX;
  var COURSES = window.COURSES || [];
  document.querySelectorAll('[data-mentor]').forEach(function (box) {
    var name = box.dataset.mentor;
    var list = COURSES.filter(function (c) { return c.mentor === name; });
    box.querySelector('[data-count]').textContent = list.length + ' khóa học đang phụ trách';
    var shown = list.slice(0, 6);
    box.querySelector('.mentor-courses').innerHTML = shown.map(function (c) {
      return '<a href="' + DX.page('course', '?slug=' + encodeURIComponent(c.slug)) + '">' +
        '<img src="' + DX.img(c.img) + '" width="1000" height="704" alt="" loading="lazy">' +
        '<span>' + DX.esc(c.title) + '</span></a>';
    }).join('');
    var more = box.querySelector('.mentor-more');
    if (list.length > shown.length) {
      more.hidden = false;
      more.textContent = 'Xem thêm ' + (list.length - shown.length) + ' khóa học';
      more.href = DX.page('courses', '?q=' + encodeURIComponent(name));
    }
  });
})();
