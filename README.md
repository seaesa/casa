# Đông xưởng — giao diện mới

Bản thiết kế lại website [dongxuong.casa-evolution.com](https://dongxuong.casa-evolution.com/) bằng HTML, CSS, JS thuần. Nội dung và hình ảnh lấy từ website gốc.

## Xem thử

```bash
python3 -m http.server 5173
# mở http://localhost:5173
```

## Các trang (URL không có đuôi .html)

| URL | File | Nội dung |
|---|---|---|
| `/` | `index.html` | Trang chủ: hero cuộn để in 3D, lộ trình, khóa học nổi bật, dự án dạng Pinterest, học viên và đối tác |
| `/courses/` | `courses/index.html` | Danh sách khóa học, lọc `?cat=`, tìm `?q=` |
| `/course/?slug=…` | `course/index.html` | Chi tiết khóa học |
| `/about/` | `about/index.html` | Về chúng tôi |
| `/contact/` | `contact/index.html` | Liên hệ |
| `/instructors/` | `instructors/index.html` | Giảng viên |
| `/help/` | `help/index.html` | Trợ giúp |
| `/privacy/`, `/terms/`, `/payment/` | `…/index.html` | Chính sách, điều khoản, thanh toán |

Mỗi trang nằm trong thư mục riêng nên URL sạch chạy được trên mọi hosting tĩnh (Netlify, Vercel, GitHub Pages, Nginx, Apache…) mà không cần cấu hình rewrite. Link cũ dạng `courses.html?q=…` vẫn hoạt động: file `courses.html` ở thư mục gốc tự chuyển sang `/courses/?q=…`. `/index.html` được rút gọn thành `/`.

## Cấu trúc

```
assets/css/style.css        toàn bộ style (design tokens ở :root)
assets/js/main.js           header, menu mobile, dialog, lưu ghim, toast
assets/js/courses-data.js   dữ liệu khóa học
assets/js/home.js           lưới masonry + modal xem nhanh
assets/js/*.js              script riêng từng trang
assets/img/                 ảnh đã tối ưu (WebP, MP4)
tools/build.py              ghép header/footer dùng chung vào từng trang
tools/src/                  nội dung từng trang (sửa ở đây)
tools/content/              văn bản chính sách gốc
```

Header, menu, footer và dialog đăng nhập dùng chung được sinh bởi `tools/build.py`. Build cũng tự đổi link `trang.html` thành `trang/`, chỉnh đường dẫn tương đối theo thư mục, và gắn `?v=<hash>` vào CSS/JS để trình duyệt luôn tải bản mới. Trong `tools/src/` cứ viết link dạng `courses.html`; trong JS dùng `DX.page('courses', '?cat=…')` và `DX.img('ten-anh')`.

Sau khi sửa file trong `tools/src/`, `tools/content/` hoặc `assets/`, chạy:

```bash
python3 tools/build.py
```

## Giao diện

- Theme trắng cho toàn site. Hero là khối tối duy nhất (nền của video, biến `--hero-bg`). Màu nhấn duy nhất là đỏ thương hiệu (`--red` cho nền nút, `--red-text` cho chữ). Toàn bộ màu khai báo bằng biến trong `:root` của `assets/css/style.css`.
- Bo góc: nút dạng viên thuốc, ảnh và thẻ 16px, panel 24px.
- Icon: [Tabler Icons](https://tabler.io/icons) (MIT), file SVG gốc trong `tools/icons/`, build gom thành sprite. Thêm icon: tải SVG từ Tabler vào thư mục này rồi build lại.
- Ảnh và thẻ có viền mảnh `--line` để ảnh nền trắng (bìa khóa học, bảng dự án) không lẫn vào nền trang.

## Hero trang chủ (cuộn để in 3D)

- Chuỗi 120 khung hình WebP trong `assets/hero/d/` (ngang 1280×720, cho máy tính) và `assets/hero/m/` (dọc 540×960, cho điện thoại; khung cắt bám theo vật thể).
- Nguồn: video “3D printer creating large orange object in workshop” của Raphaël Quinet trên Pexels (giấy phép Pexels, dùng miễn phí kể cả thương mại): https://www.pexels.com/video/34254813/
- `assets/js/hero.js`: tải khung hình từ thưa đến dày, vẽ lên canvas theo tiến độ cuộn, đổi 4 chương chữ và thước đo lớp in. Chế độ giảm chuyển động hiện ảnh tĩnh.
- Muốn thay bằng render Rhino/Grasshopper của Đông xưởng: xuất 120 ảnh, đặt tên `000.webp`…`119.webp` vào hai thư mục trên. Không cần sửa code.

## Lưu ý

- Đăng nhập, đăng ký: form có kiểm tra dữ liệu, nhưng chưa nối với hệ thống tài khoản. Sau khi gửi, người dùng được dẫn sang hệ thống học tập hiện tại.
- Nút “Đăng ký khóa học” dẫn đến trang khóa học tương ứng trên hệ thống gốc.
- Mục “Đã lưu” lưu trong trình duyệt (localStorage).
