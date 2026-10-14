/* Trang cá nhân (đăng nhập giả lập: dữ liệu nằm trong localStorage) */
(function () {
  'use strict';
  var DX = window.DX;
  var COURSES = window.COURSES || [];
  var form = document.getElementById('profile-form');

  function bySlug(slug) { return COURSES.filter(function (c) { return c.slug === slug; })[0]; }

  function renderLists() {
    var saved = COURSES.filter(function (c) { return DX.isSaved('course:' + c.slug); });
    document.getElementById('acc-saved').innerHTML = saved.map(DX.courseCard).join('');
    document.getElementById('acc-saved-empty').hidden = saved.length > 0;
    document.getElementById('acc-saved-count').textContent = saved.length || '';

    var recent = [];
    try { recent = JSON.parse(localStorage.getItem('dx-recent') || '[]'); } catch (e) {}
    var list = recent.map(bySlug).filter(Boolean).slice(0, 6);
    document.getElementById('acc-recent').innerHTML = list.map(DX.courseCard).join('');
    document.getElementById('acc-recent-empty').hidden = list.length > 0;
  }

  function render() {
    var u = DX.user();
    if (!u) return;
    var since = u.since ? new Date(u.since) : new Date();
    document.getElementById('acc-since').textContent = 'Thành viên từ ' + since.toLocaleDateString('vi-VN');
    form.querySelector('#pf-name').value = u.name || '';
    form.querySelector('#pf-email').value = u.email || '';
    form.querySelector('#pf-phone').value = u.phone || '';
    form.querySelector('#pf-goal').value = u.goal || '';
    renderLists();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!DX.validate(form)) return;
    var u = DX.user() || {};
    u.name = form.querySelector('#pf-name').value.trim();
    u.email = form.querySelector('#pf-email').value.trim();
    u.phone = form.querySelector('#pf-phone').value.trim();
    u.goal = form.querySelector('#pf-goal').value;
    DX.setUser(u);
    DX.toast('Đã lưu thay đổi');
  });

  // Signing in or out on this page re-renders it in place
  document.addEventListener('dx:auth', render);
  // Un-saving a course from this page removes its card
  document.addEventListener('dx:saved', renderLists);

  render();
})();
