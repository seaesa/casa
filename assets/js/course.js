/* Trang chi tiết khóa học */
(function () {
  'use strict';
  var DX = window.DX;
  var COURSES = window.COURSES || [];
  var slug = new URLSearchParams(location.search).get('slug');
  var c = COURSES.filter(function (x) { return x.slug === slug; })[0];
  var root = document.getElementById('course-root');

  if (!c) {
    document.getElementById('course-missing').hidden = false;
    root.hidden = true;
    return;
  }

  var catLabel = DX.CATS[c.cat];
  document.title = c.title + ' | Đông xưởng';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', c.desc.slice(0, 155));

  var crumbCat = document.getElementById('crumb-cat');
  crumbCat.textContent = catLabel;
  crumbCat.href = DX.page('courses', '?cat=' + c.cat);
  document.getElementById('crumb-current').textContent = c.title;

  var img = document.getElementById('course-img');
  img.src = DX.img(c.img);
  img.alt = c.title;

  document.getElementById('course-title').textContent = c.title;
  var tags = '<a class="tag" href="' + DX.page('courses', '?cat=' + c.cat) + '">' + DX.esc(catLabel) + '</a>';
  if (c.badge) tags = '<span class="tag is-red">' + DX.esc(c.badge) + '</span>' + tags;
  document.getElementById('course-tags').innerHTML = tags;

  document.getElementById('course-mentor').innerHTML =
    '<span class="avatar' + (c.mentor === 'Lê Minh Huy' ? '' : ' is-red') + '" aria-hidden="true">' + DX.initials(c.mentor) + '</span>' +
    '<span>' + DX.esc(c.mentor) + '<small>Mentor phụ trách</small></span>';

  var price = DX.price(c);
  document.getElementById('course-price').innerHTML = price
    ? '<small>Học phí</small>' + price
    : '<small>Học phí</small>Liên hệ tư vấn';

  var enroll = document.getElementById('course-enroll');
  enroll.href = c.url;

  var save = document.getElementById('course-save');
  save.dataset.save = 'course:' + c.slug;
  save.dataset.name = c.title;
  DX.paintSave(save, DX.isSaved('course:' + c.slug));

  document.getElementById('course-share').addEventListener('click', function () { DX.share(c.title, location.href); });

  var desc = document.getElementById('course-desc');
  desc.textContent = c.desc;

  // Related: same category first, then fill with others
  var related = COURSES.filter(function (x) { return x.cat === c.cat && x.slug !== c.slug; });
  if (related.length < 4) {
    related = related.concat(COURSES.filter(function (x) { return x.cat !== c.cat && x.cat !== 'hoc-vien'; }).slice(0, 4 - related.length));
  }
  document.getElementById('related-grid').innerHTML = related.slice(0, 4).map(DX.courseCard).join('');
  document.getElementById('related-more').href = DX.page('courses', '?cat=' + c.cat);
})();
