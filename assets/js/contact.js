/* Trang Liên hệ — form mở email soạn sẵn */
(function () {
  'use strict';
  var DX = window.DX;
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!DX.validate(form)) return;
    var d = new FormData(form);
    var body = [
      'Họ và tên: ' + d.get('name'),
      'Số điện thoại: ' + d.get('phone'),
      d.get('email') ? 'Email: ' + d.get('email') : '',
      'Quan tâm: ' + d.get('topic'),
      '',
      d.get('message')
    ].filter(function (l, i) { return l !== '' || i === 4; }).join('\n');
    var href = 'mailto:dongxuong@casa-evolution.com?subject=' + encodeURIComponent('[Website] ' + d.get('topic') + ' - ' + d.get('name')) +
      '&body=' + encodeURIComponent(body);
    window.location.href = href;
    DX.toast('Đang mở ứng dụng email của bạn');
  });
})();
