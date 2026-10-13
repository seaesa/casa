# Đông xưởng — giao diện mới

Bản thiết kế lại website [dongxuong.casa-evolution.com](https://dongxuong.casa-evolution.com/) bằng HTML, CSS, JS thuần. Nội dung và hình ảnh lấy từ website gốc.

## Xem thử

```bash
python3 -m http.server 5173
# mở http://localhost:5173
```

## Các trang

| File | Nội dung |
|---|---|
| `index.html` | Trang chủ dạng lưới Pinterest: lọc theo chủ đề, tìm kiếm trực tiếp, lưu ghim, xem nhanh |
| `courses.html` | Danh sách 31 khóa học, lọc theo nhóm (`?cat=`), tìm kiếm (`?q=`) |
| `course.html?slug=…` | Chi tiết khóa học + khóa học liên quan |
| `about.html` | Về chúng tôi |
| `contact.html` | Liên hệ, mã QR Zalo, form gửi email, bản đồ |
| `instructors.html` | Giảng viên |
| `help.html` | Câu hỏi thường gặp |
| `privacy.html`, `terms.html`, `payment.html` | Chính sách, điều khoản, quy định thanh toán |

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

Header, menu, footer và dialog đăng nhập dùng chung được sinh bởi `tools/build.py`. Sau khi sửa file trong `tools/src/` hoặc `tools/content/`, chạy:

```bash
python3 tools/build.py
```

## Lưu ý

- Đăng nhập, đăng ký: form có kiểm tra dữ liệu, nhưng chưa nối với hệ thống tài khoản. Sau khi gửi, người dùng được dẫn sang hệ thống học tập hiện tại.
- Nút “Đăng ký khóa học” dẫn đến trang khóa học tương ứng trên hệ thống gốc.
- Mục “Đã lưu” lưu trong trình duyệt (localStorage).
