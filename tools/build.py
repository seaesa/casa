#!/usr/bin/env python3
"""Ghép các trang HTML tĩnh từ tools/src/*.html + partials dùng chung.

Chạy:  python3 tools/build.py
Kết quả ghi ra thư mục gốc dự án (index.html, courses.html, ...).
"""
import hashlib
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "src"
CONTENT = ROOT / "tools" / "content"

SITE = "Đông xưởng"
FONTS = ("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800"
         "&family=Bricolage+Grotesque:opsz,wght@12..96,600..800&display=swap")

PAGES = {
    "index":       dict(title="Đông xưởng | Powered by Casa⁺", nav="home", scripts=["courses-data", "hero", "home"],
                        desc="Đông xưởng Casa: đào tạo và chuyển giao quy trình Computational Design, Rhino & Grasshopper cho cá nhân và doanh nghiệp ngành AEC."),
    "courses":     dict(title="Khóa học | Đông xưởng", nav="courses", scripts=["courses-data", "courses"],
                        desc="Lộ trình và khóa học Rhino, Grasshopper, Parametric Design tại Đông xưởng Casa."),
    "course":      dict(title="Khóa học | Đông xưởng", nav="courses", scripts=["courses-data", "course"],
                        desc="Chi tiết khóa học tại Đông xưởng Casa."),
    "about":       dict(title="Về chúng tôi | Đông xưởng", nav="about", scripts=[],
                        desc="Casa⁺ và Đông xưởng: tầm nhìn, sứ mệnh, giá trị cốt lõi và lĩnh vực hoạt động."),
    "contact":     dict(title="Liên hệ | Đông xưởng", nav="contact", scripts=["contact"],
                        desc="Liên hệ Đông xưởng Casa qua hotline 0763161286, Zalo hoặc email dongxuong@casa-evolution.com."),
    "instructors": dict(title="Giảng viên | Đông xưởng", nav="instructors", scripts=["courses-data", "instructors"],
                        desc="Đội ngũ mentor của Đông xưởng Casa."),
    "help":        dict(title="Trợ giúp | Đông xưởng", nav="help", scripts=["docs"],
                        desc="Câu hỏi thường gặp về tài khoản, thanh toán, hoàn tiền và hỗ trợ học tập tại Đông xưởng."),
    "privacy":     dict(title="Chính sách bảo mật | Đông xưởng", nav="privacy", scripts=["docs"], doc="chinh-sach-bao-mat",
                        desc="Chính sách bảo mật thông tin khách hàng của C.A.S JSC."),
    "terms":       dict(title="Điều khoản dịch vụ | Đông xưởng", nav="terms", scripts=["docs"], doc="dieu-khoan-dich-vu",
                        desc="Điều khoản dịch vụ áp dụng cho học viên của C.A.S JSC."),
    "payment":     dict(title="Quy định về thanh toán | Đông xưởng", nav="payment", scripts=["docs"], doc="quy-dinh-ve-thanh-toan",
                        desc="Quy định về thanh toán, đổi trả và hoàn tiền tại Đông xưởng."),
}

MAIN_NAV = [("home", "index.html", "Trang chủ"), ("courses", "courses.html", "Khóa học"),
            ("about", "about.html", "Về chúng tôi"), ("contact", "contact.html", "Liên hệ")]
SUB_NAV = [("instructors", "instructors.html", "Giảng viên"), ("help", "help.html", "Trợ giúp"),
           ("privacy", "privacy.html", "Chính sách bảo mật"), ("terms", "terms.html", "Điều khoản dịch vụ"),
           ("payment", "payment.html", "Quy định về thanh toán")]
DOC_NAV = [("help", "help.html", "Trợ giúp"), ("privacy", "privacy.html", "Chính sách bảo mật"),
           ("terms", "terms.html", "Điều khoản dịch vụ"), ("payment", "payment.html", "Quy định về thanh toán")]

ICON_DIR = ROOT / "tools" / "icons"


def load_icons():
    """Tabler Icons (MIT, tabler.io/icons) đọc từ tools/icons/*.svg."""
    icons = {}
    for f in sorted(ICON_DIR.glob("*.svg")):
        svg = f.read_text(encoding="utf-8")
        inner = svg[svg.index(">", svg.index("<svg")) + 1: svg.rindex("</svg>")]
        inner = re.sub(r'<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*/>', "", inner).strip()
        inner = re.sub(r"\s+", " ", inner)
        if 'fill="currentColor"' in svg.split(">", 1)[0] + ">":
            inner = f'<g fill="currentColor" stroke="none">{inner}</g>'
        icons[f.stem] = inner
    return icons


ICONS = load_icons()


def icon(name, cls=""):
    return f'<svg class="i {cls}" aria-hidden="true"><use href="#i-{name}"></use></svg>'


def sprite():
    syms = "".join(f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items())
    return f'<svg width="0" height="0" style="position:absolute" aria-hidden="true">{syms}</svg>'


def cur(page, key):
    return ' aria-current="page"' if page == key else ""


def header(page):
    nav = "".join(f'<li><a href="{href}"{cur(page, k)}>{label}</a></li>' for k, href, label in MAIN_NAV)
    return f'''<a class="skip-link" href="#main">Bỏ qua, đến nội dung chính</a>
<header class="site-header">
  <div class="container header-bar">
    <a class="brand" href="index.html" aria-label="Đông xưởng, về trang chủ">
      <img src="assets/img/logo.webp" width="600" height="235" alt="Đông xưởng, Powered by Casa⁺">
    </a>
    <nav class="main-nav" aria-label="Điều hướng chính"><ul>{nav}</ul></nav>
    <form class="search" role="search" action="courses.html" method="get">
      {icon("search")}
      <label class="sr-only" for="site-q">Tìm khóa học, dự án</label>
      <input id="site-q" name="q" type="search" placeholder="Tìm khóa học, dự án, mentor" autocomplete="off" enterkeyhint="search">
      <button class="icon-btn search-clear" type="button" aria-label="Xóa từ khóa" hidden>{icon("close")}</button>
    </form>
    <div class="header-actions">
      <button class="btn btn-ghost" type="button" data-auth="login">Đăng nhập</button>
      <button class="btn btn-red" type="button" data-auth="register">Đăng ký</button>
    </div>
    <button class="icon-btn menu-toggle" type="button" aria-controls="drawer" aria-expanded="false" aria-label="Mở menu">{icon("menu")}</button>
  </div>
</header>'''


def drawer(page):
    main = "".join(f'<a href="{href}"{cur(page, k)}>{label}{icon("chevron-right")}</a>' for k, href, label in MAIN_NAV)
    sub = "".join(f'<a href="{href}"{cur(page, k)}>{label}</a>' for k, href, label in SUB_NAV)
    return f'''<div class="scrim" id="scrim" aria-hidden="true"></div>
<aside class="drawer" id="drawer" aria-label="Menu" aria-hidden="true" hidden>
  <div class="drawer-head">
    <img src="assets/img/logo.webp" width="600" height="235" alt="Đông xưởng">
    <button class="icon-btn" type="button" data-close aria-label="Đóng menu">{icon("close")}</button>
  </div>
  <div class="drawer-body">
    <nav class="drawer-nav" aria-label="Điều hướng chính (di động)">{main}</nav>
    <nav class="drawer-sub" aria-label="Thông tin">{sub}</nav>
  </div>
  <div class="drawer-foot">
    <button class="btn btn-ghost" type="button" data-auth="login">Đăng nhập</button>
    <button class="btn btn-red" type="button" data-auth="register">Đăng ký</button>
  </div>
</aside>'''


def auth_dialog():
    return f'''<div class="modal dialog" id="auth" role="dialog" aria-modal="true" aria-labelledby="auth-title" aria-hidden="true" hidden>
  <div class="modal-scrim" data-dismiss></div>
  <div class="modal-panel">
    <button class="icon-btn modal-close" type="button" data-dismiss aria-label="Đóng">{icon("close")}</button>
    <div class="dialog-body">
      <img class="brand-mark" src="assets/img/logo.webp" width="600" height="235" alt="">
      <h2 id="auth-title">Chào mừng trở lại</h2>
      <p>Học Rhino &amp; Grasshopper cùng Đông xưởng</p>
      <div class="tabs" role="tablist" aria-label="Tài khoản">
        <button type="button" role="tab" id="tab-login" data-tab="login" aria-controls="panel-login" aria-selected="true">Đăng nhập</button>
        <button type="button" role="tab" id="tab-register" data-tab="register" aria-controls="panel-register" aria-selected="false" tabindex="-1">Đăng ký</button>
      </div>
      <form role="tabpanel" id="panel-login" data-panel="login" aria-labelledby="tab-login" novalidate>
        <div class="form-alert" tabindex="-1" hidden>Tài khoản học được quản lý trên hệ thống học tập của Đông xưởng. <a class="link" href="https://dongxuong.casa-evolution.com/" target="_blank" rel="noopener">Tiếp tục đăng nhập tại đây</a>.</div>
        <div class="field"><label for="li-email">Email</label><input class="input" id="li-email" type="email" autocomplete="email" required data-label="email"><span class="field-error" aria-live="polite"></span></div>
        <div class="field"><label for="li-pass">Mật khẩu</label><input class="input" id="li-pass" type="password" autocomplete="current-password" required minlength="6" data-label="mật khẩu"><span class="field-error" aria-live="polite"></span></div>
        <button class="btn btn-red btn-lg btn-block" type="submit">Đăng nhập</button>
      </form>
      <form role="tabpanel" id="panel-register" data-panel="register" aria-labelledby="tab-register" novalidate hidden>
        <div class="form-alert" tabindex="-1" hidden>Tài khoản học được tạo trên hệ thống học tập của Đông xưởng. <a class="link" href="https://dongxuong.casa-evolution.com/" target="_blank" rel="noopener">Tiếp tục đăng ký tại đây</a>.</div>
        <div class="field"><label for="re-name">Họ và tên</label><input class="input" id="re-name" type="text" autocomplete="name" required data-label="họ và tên"><span class="field-error" aria-live="polite"></span></div>
        <div class="field"><label for="re-email">Email</label><input class="input" id="re-email" type="email" autocomplete="email" required data-label="email"><span class="field-error" aria-live="polite"></span></div>
        <div class="field"><label for="re-phone">Số điện thoại</label><input class="input" id="re-phone" type="tel" autocomplete="tel" inputmode="tel" required data-label="số điện thoại"><span class="field-error" aria-live="polite"></span></div>
        <div class="field"><label for="re-pass">Mật khẩu</label><input class="input" id="re-pass" type="password" autocomplete="new-password" required minlength="6" data-label="mật khẩu"><span class="field-error" aria-live="polite"></span></div>
        <button class="btn btn-red btn-lg btn-block" type="submit">Tạo tài khoản</button>
        <p class="form-note">Khi đăng ký, bạn đồng ý với <a class="link" href="terms.html">Điều khoản dịch vụ</a> và <a class="link" href="privacy.html">Chính sách bảo mật</a>.</p>
      </form>
    </div>
  </div>
</div>'''


def footer():
    intro = "".join(f'<li><a href="{h}">{l}</a></li>' for _, h, l in
                    [("", "about.html", "Về chúng tôi"), ("", "instructors.html", "Giảng viên"),
                     ("", "privacy.html", "Chính sách bảo mật"), ("", "terms.html", "Điều khoản dịch vụ"),
                     ("", "payment.html", "Quy định về thanh toán"), ("", "help.html", "Trợ giúp")])
    cats = [("lo-trinh", "Lộ trình học"), ("chuyen-nganh", "Ứng dụng chuyên ngành"), ("thu-vien", "Thư viện plugin, code"),
            ("workshop", "Workshop đồ án"), ("doanh-nghiep", "Đào tạo doanh nghiệp"), ("mcneel", "Luyện thi McNeel")]
    courses = "".join(f'<li><a href="courses.html?cat={k}">{l}</a></li>' for k, l in cats)
    return f'''<section class="cover" aria-label="Khẩu hiệu">
  <img src="assets/img/footer-cover.webp" width="2000" height="720" alt="" loading="lazy">
  <blockquote class="sr-only">“The second home of Architecture and Design students”, Đông xưởng, Powered by Casa⁺</blockquote>
</section>
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="assets/img/logo.webp" width="600" height="235" alt="Đông xưởng, Powered by Casa⁺" loading="lazy">
      <p class="footer-company">Công ty Cổ phần Dịch vụ và Giáo dục C.A.S</p>
      <ul class="footer-info">
        <li>76/50B Phan Tây Hồ, Phường Cầu Kiệu, TP Hồ Chí Minh, Việt Nam</li>
        <li>Hotline: <a href="tel:0763161286">0763 161 286</a></li>
        <li><a href="mailto:dongxuong@casa-evolution.com">dongxuong@casa-evolution.com</a></li>
        <li>Đại diện pháp luật: Trần Hoàng Thiện</li>
        <li>Giờ mở cửa: 9:00 - 18:30</li>
      </ul>
    </div>
    <nav aria-labelledby="f-intro"><h2 id="f-intro">Giới thiệu</h2><ul class="footer-links">{intro}</ul></nav>
    <nav aria-labelledby="f-courses"><h2 id="f-courses">Khóa học</h2><ul class="footer-links">{courses}</ul></nav>
    <div>
      <h2>Theo dõi chúng tôi</h2>
      <div class="socials">
        <a href="https://www.facebook.com/Dongxuongpoweredbycasa" target="_blank" rel="noopener" aria-label="Facebook">{icon("facebook")}</a>
        <a href="https://www.youtube.com/@Dongxuongpoweredbycasa" target="_blank" rel="noopener" aria-label="YouTube">{icon("youtube")}</a>
        <a href="https://zalo.me/0763161286" target="_blank" rel="noopener" aria-label="Zalo"><strong style="font-size:12px">Zalo</strong></a>
      </div>
      <p style="margin-top:18px"><a class="btn btn-white" href="https://drive.google.com/file/d/1umKdY0bDLekZFHfh5nF_6yRPSu75GtYu/view?usp=drive_link" target="_blank" rel="noopener">{icon("file")}Hồ sơ năng lực</a></p>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© 2025 C.A.S JSC. Đông xưởng là thương hiệu thành viên của Casa⁺.</span>
    <span>Phát triển bởi <a href="https://hoola.vn/" target="_blank" rel="noopener">Hoola</a></span>
  </div>
</footer>
<div class="fab-stack">
  <button class="fab fab-top" type="button" aria-label="Lên đầu trang">{icon("arrow-up")}</button>
  <a class="fab fab-zalo" href="https://zalo.me/0763161286" target="_blank" rel="noopener" aria-label="Nhắn tin Zalo">Zalo</a>
  <a class="fab fab-phone" href="tel:0763161286" aria-label="Gọi hotline 0763 161 286">{icon("phone")}</a>
</div>'''


# ---------------------------------------------------------------- policy docs
def doc_to_html(name):
    lines = [l.strip() for l in (CONTENT / f"{name}.txt").read_text(encoding="utf-8").splitlines()]
    lines = [l for l in lines if l and l != "Đăng nhập"]
    title = lines.pop(0)
    out, toc, in_list = [], [], False
    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False
    for i, l in enumerate(lines):
        e = html.escape(l)
        e = re.sub(r"(https?://[^\s<]+)", r'<a href="\1" target="_blank" rel="noopener">\1</a>', e)
        e = re.sub(r"([\w.]+@casa-evolution\.com)", r'<a href="mailto:\1">\1</a>', e)
        if re.match(r"^[IVX]+\.\s", l):
            close_list()
            hid = f"muc-{len(toc) + 1}"
            label = re.sub(r"^[IVX]+\.\s*", "", l).capitalize()
            toc.append((hid, label))
            out.append(f'<h2 id="{hid}">{html.escape(label)}</h2>')
        elif re.match(r"^(\d+\.\d+|V\.\d)\s", l):
            close_list()
            out.append(f"<h4>{e}</h4>")
        elif re.match(r"^\d+\.\s", l) and l.upper() == l:
            close_list()
            out.append(f"<h3>{html.escape(l.capitalize())}</h3>")
        elif re.match(r"^[-–+▪]\s?", l):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append("<li>" + re.sub(r"^[-–+▪]\s?", "", e) + "</li>")
        elif re.match(r"^\d+\.\s", l):
            close_list()
            out.append(f"<p>{e}</p>")
        else:
            close_list()
            if l.endswith(":") and len(l) < 90:
                out.append(f"<p><strong>{e}</strong></p>")
            else:
                out.append(f"<p>{e}</p>")
    close_list()
    return title, "\n".join(out), toc


def doc_side(page, toc):
    links = "".join(f'<a href="{h}"{cur(page, k)}>{l}</a>' for k, h, l in DOC_NAV)
    toc_html = ""
    if toc:
        items = "".join(f'<a href="#{i}">{html.escape(t)}</a>' for i, t in toc)
        toc_html = f'<nav aria-labelledby="toc-h"><h2 id="toc-h">Trong trang này</h2><div class="toc">{items}</div></nav>'
    return f'<aside class="doc-side"><nav aria-labelledby="docs-h"><h2 id="docs-h">Thông tin</h2><div class="doc-links">{links}</div></nav>{toc_html}</aside>'


def doc_mobile_nav(page):
    chips = "".join(f'<a class="chip" href="{h}"{cur(page, k)}>{l}</a>' for k, h, l in DOC_NAV)
    return f'''<div class="doc-mobile-nav"><div class="chips-wrap">
  <div class="chips">{chips}</div>
  <div class="chips-fade left"><button class="icon-btn" type="button" aria-label="Cuộn trái" tabindex="-1">{icon("chevron-left")}</button></div>
  <div class="chips-fade right"><button class="icon-btn" type="button" aria-label="Cuộn phải" tabindex="-1">{icon("chevron-right")}</button></div>
</div></div>'''


def doc_page(page, meta):
    title, body, toc = doc_to_html(meta["doc"])
    nice = title.capitalize()
    return f'''<div class="container">
  <div class="page-head">
    <ol class="crumbs"><li><a href="index.html">Trang chủ</a></li><li><a href="help.html">Thông tin</a></li><li aria-current="page">{html.escape(nice)}</li></ol>
    <h1 class="h-1">{html.escape(nice)}</h1>
    <p class="lead">Áp dụng cho website dongxuong.casa-evolution.com, vận hành bởi Công ty Cổ phần Dịch vụ &amp; Giáo dục C.A.S (C.A.S JSC).</p>
  </div>
  {doc_mobile_nav(page)}
  <div class="doc-layout">
    {doc_side(page, toc)}
    <article class="prose">{body}</article>
  </div>
</div>'''


# ---------------------------------------------------------------- clean URLs
# Mỗi trang được xuất ra <trang>/index.html để URL không có đuôi .html
# (vd. /courses/, /course/?slug=...). Chạy được trên mọi hosting tĩnh, không cần rewrite.
LINK_ATTR = re.compile(r'(\b(?:href|src|srcset|action|content|poster)=")(?!https?:|mailto:|tel:|#|data:|//)([^"]*)"')


def clean_urls(doc, base):
    """Đổi 'trang.html?x' -> '<base>trang/?x' và 'assets/...' -> '<base>assets/...'."""
    def fix(m):
        attr, url = m.group(1), m.group(2)
        page = re.match(r"^([\w-]+)\.html(.*)$", url)
        if page:
            name, rest = page.groups()
            url = base + ("" if name == "index" else name + "/") + rest
            return f'{attr}{url or "./"}"'
        if url.startswith("assets/"):
            return f'{attr}{base}{url}{version(url)}"'
        return m.group(0)
    return LINK_ATTR.sub(fix, doc).replace("__BASE__", base)


def version(url):
    """?v=<hash nội dung> cho CSS/JS/icon để trình duyệt tải bản mới sau mỗi lần build."""
    if not (url.endswith((".css", ".js")) or url.startswith("assets/icons/")):
        return ""
    return "?v=" + hashlib.md5((ROOT / url).read_bytes()).hexdigest()[:8]


def write_redirect(page):
    """Giữ link cũ dạng trang.html hoạt động: chuyển sang trang/ kèm query và hash."""
    (ROOT / f"{page}.html").write_text(f'''<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<title>Đang chuyển trang…</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="{page}/">
<script>location.replace("{page}/" + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url={page}/">
</head><body><a href="{page}/">Đến trang mới</a></body></html>
''', encoding="utf-8")


def build():
    for page, meta in PAGES.items():
        if "doc" in meta:
            main = doc_page(page, meta)
        else:
            main = (SRC / f"{page}.html").read_text(encoding="utf-8")
            main = main.replace("{{doc_side}}", doc_side(page, [])).replace("{{doc_mobile_nav}}", doc_mobile_nav(page))
            main = re.sub(r"\{\{icon:([\w-]+)\}\}", lambda m: icon(m.group(1)), main)
        order = [x for x in meta["scripts"] if x == "courses-data"] + ["main"] + \
                [x for x in meta["scripts"] if x != "courses-data"]
        scripts = "\n".join(f'<script src="assets/js/{x}.js"></script>' for x in order)
        doc = f'''<!doctype html>
<html lang="vi" data-base="__BASE__">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{meta["title"]}</title>
<meta name="description" content="{html.escape(meta["desc"])}">
<meta name="theme-color" content="#ffffff">
<meta property="og:title" content="{meta["title"]}">
<meta property="og:description" content="{html.escape(meta["desc"])}">
<meta property="og:image" content="assets/img/signature-dfma.webp">
<link rel="icon" href="assets/icons/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="manifest" href="assets/icons/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="{page}">
{sprite()}
{header(meta["nav"])}
{drawer(meta["nav"])}
<main id="main" tabindex="-1">
{main}
</main>
{footer()}
{auth_dialog()}
{scripts}
</body>
</html>
'''
        if page == "index":
            out, base = ROOT / "index.html", ""
        else:
            out, base = ROOT / page / "index.html", "../"
            out.parent.mkdir(exist_ok=True)
            write_redirect(page)
        out.write_text(clean_urls(doc, base), encoding="utf-8")
        print("built", out.relative_to(ROOT))


if __name__ == "__main__":
    build()
