/* Trang chính sách / trợ giúp — đánh dấu mục lục theo vị trí cuộn, mở FAQ theo hash */
(function () {
  'use strict';
  var links = document.querySelectorAll('.toc a');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var heads = Array.prototype.map.call(links, function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var io = new IntersectionObserver(function () {
      var top = null;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top < 160) top = h; });
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (top && map[top.id]) map[top.id].classList.add('is-active');
    }, { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] });
    heads.forEach(function (h) { io.observe(h); });
  }
  // Only one FAQ open at a time within a group keeps the page short on mobile
  document.querySelectorAll('.faq').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      d.parentElement.querySelectorAll('.faq[open]').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
