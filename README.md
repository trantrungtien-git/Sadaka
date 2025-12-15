# 🌍 SADAKA HR - Nền Tảng Tuyển Dụng & Xuất Khẩu Lao Động

![Build Status](https://img.shields.io/github/actions/workflow/status/trantrungtien-git/Sadaka/build-posts.yml?label=Build%20Content)
![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/tech-Vite%20%7C%20Bootstrap%20%7C%20GAS-orange.svg)

> Website chính thức của **SADAKA HR**, chuyên cung cấp thông tin tuyển dụng, đào tạo nghề và du học Đức. Dự án được xây dựng dưới dạng **Static Site** (trang tĩnh) sử dụng HTML/CSS/JS thuần kết hợp với **Vite** để đóng gói và **Contentful** (Headless CMS) để quản lý nội dung.

## 🚀 Điểm Nhấn Công Nghệ (Highlights)

Khác với các website tĩnh truyền thống, SADAKA HR áp dụng mô hình **"Serverless Content Pipeline"**:

* **Core:** HTML5, CSS3, JavaScript (ES6+).
* **Build Tool:** [Vite](https://vitejs.dev/) - Giúp dev nhanh và build code tối ưu.
* **CMS (Quản lý nội dung):** [Contentful](https://www.contentful.com/) - Lưu trữ bài viết và tin tuyển dụng.
* **Styling:** CSS thuần (biến CSS variables), thiết kế Responsive.

## 🛠 Tech Stack (Công Nghệ)

| Hạng mục | Công nghệ | Vai trò trong dự án |
| --- | --- | --- |
| **Frontend Core** | HTML5, CSS3, Vanilla JS | Xây dựng giao diện và logic người dùng |
| **Bundler** | **Vite** | Công cụ phát triển và đóng gói siêu tốc |
| **Framework** | **Bootstrap 5** | Hệ thống Grid & Component Responsive |
| **SSG / Tooling** | **Eleventy (11ty)** | Hỗ trợ xử lý template và cấu trúc tĩnh |
| **CMS** | **Contentful** | Quản lý nội dung bài viết (Blog/Jobs) bằng Contentful |
| **CI/CD** | **GitHub Actions** | Tự động hóa quy trình build dữ liệu bài viết (`build-posts.js`) |
| **Backend** | Google Apps Script | Xử lý API Form (No-CORS) |

## 📂 Cấu trúc thư mục

```text
├── assets/             # Tài nguyên gốc (SCSS, ảnh chưa xử lý - nếu có)
├── pages/              # Các trang con (Recruit, Blog, Contact...)
├── public/             # Thư mục chứa tài nguyên tĩnh (được copy y nguyên khi build)
│   ├── css/            # File CSS chính
│   ├── img/            # Hình ảnh
│   └── js/             # Các file xử lý Logic (gọi API Contentful)
├── main.js             # Entry point của Vite
├── vite.config.js      # Cấu hình Vite
└── index.html          # Trang chủ
```

## ⚙️ Hướng Dẫn Cài Đặt (Local Development)
Yêu cầu: Node.js (v16 trở lên)

1. Clone dự án và cài đặt thư viện
```
# Clone repo
git clone [https://github.com/trantrungtien-git/sadaka.git](https://github.com/trantrungtien-git/sadaka.git)

# Di chuyển vào thư mục dự án
cd sadaka

# Cài đặt các gói phụ thuộc (dependencies)
npm install
```

2. Chạy môi trường Development
Lệnh này sẽ khởi động server local (thường là http://localhost:5173). Mọi thay đổi trong code sẽ tự động cập nhật lên trình duyệt.

```
npm run dev
```

3. Đóng gói (Build) để deploy
Khi hoàn thiện, chạy lệnh này để Vite tối ưu hóa code và xuất ra thư mục dist/.

```
npm run build
```

## 🔑 Cấu hình Contentful (CMS)
Dự án kết nối trực tiếp với Contentful thông qua API. Để thay đổi nội dung (Tuyển dụng, Bài viết), hãy truy cập Contentful Web App.

Cấu hình API Key
Hiện tại, API Key đang được cấu hình trong các file JS tương ứng trong thư mục public/js/.

 * Space ID: b6nnba82anu8
 * Access Token: (Đã tích hợp trong code)

Lưu ý bảo mật: Access Token hiện tại là loại Content Delivery API (chỉ đọc), nên an toàn khi để public trên client-side. Tuy nhiên, tuyệt đối không được để lộ Content Management Token (token quyền ghi/xóa) vào code.

Mô hình dữ liệu (Content Models)
Dự án yêu cầu các Content Type sau trên Contentful:

 1. Job Post (jobPost): Dùng cho trang Tuyển dụng.

    * title (Text): Tên công việc.
    * slug (Text): Đường dẫn tĩnh (VD: dieu-duong-vien).
    * image (Media): Ảnh đại diện.
    * description (Rich Text/Text): Mô tả chi tiết.
    * location, jobType, deadline, slogan.

 2. Blog Post (blogPost): Dùng cho trang Tin tức.

    * title, slug, image, content.

## 📱 Liên hệ Dev
Phát triển bởi: Tran Trung Tien - Fullstack developer

Repository: [GitHub Link](https://github.com/trantrungtien-git/Sadaka.git)


### Những điểm tôi đã chỉnh sửa trong README này:
1.  **Loại bỏ Decap CMS:** Không còn nhắc đến `admin/config.yml` hay Netlify CMS nữa.
2.  **Thêm phần Vite:** Vì repo của bạn có `vite.config.js`, nên việc nhắc người dùng chạy `npm run dev` là chuẩn xác nhất (thay vì mở file HTML thủ công).
3.  **Làm rõ Contentful:** Tôi đã liệt kê rõ Space ID và nhắc nhở về bảo mật Token (chỉ dùng token Read-only).
4.  **Content Model:** Liệt kê các trường dữ liệu cần thiết để người quản trị Contentful biết cần tạo gì.

## 🤝 Đóng Góp (Contributing)
Dự án được phát triển và duy trì bởi Team Tech SADAKA. Mọi đóng góp vui lòng tạo Pull Request hoặc liên hệ trực tiếp.

📄 License
Copyright © 2025 SADAKA JSC. All rights reserved.
