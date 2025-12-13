# 🌍 SADAKA HR - Nền Tảng Tuyển Dụng & Xuất Khẩu Lao Động

![Build Status](https://img.shields.io/github/actions/workflow/status/trantrungtien-git/Sadaka/build-posts.yml?label=Build%20Content)
![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/tech-Vite%20%7C%20Bootstrap%20%7C%20GAS-orange.svg)

> **Website chính thức của SADAKA HR** - Chuyên trang thông tin về đào tạo, du học nghề và xuất khẩu lao động (Đức, Nhật, Hàn). Dự án được xây dựng theo kiến trúc **Modern Static Site**, kết hợp sức mạnh của **Vite**, **Decap CMS** và quy trình tự động hóa **CI/CD** qua GitHub Actions.

## 🚀 Điểm Nhấn Công Nghệ (Highlights)

Khác với các website tĩnh truyền thống, SADAKA HR áp dụng mô hình **"Serverless Content Pipeline"**:

1.  **Headless CMS Management:** Sử dụng **Decap CMS** (trước là Netlify CMS) giúp đội ngũ Marketing viết bài, quản lý đơn hàng ngay trên giao diện web mà không cần biết code.
2.  **Automated Content Build:** Mỗi khi có bài viết mới, **GitHub Actions** sẽ tự động kích hoạt script chuyển đổi dữ liệu từ Markdown sang JSON, cập nhật nội dung cho website tức thì mà không cần build lại toàn bộ trang.
3.  **Serverless CRM:** Hệ thống form liên hệ kết nối trực tiếp với **Google Sheets** qua Google Apps Script, tích hợp cơ chế **Local Storage Backup** để đảm bảo không mất dữ liệu khách hàng.

## 🛠 Tech Stack (Công Nghệ)

| Hạng mục | Công nghệ | Vai trò trong dự án |
| --- | --- | --- |
| **Frontend Core** | HTML5, CSS3, Vanilla JS | Xây dựng giao diện và logic người dùng |
| **Bundler** | **Vite** | Công cụ phát triển và đóng gói siêu tốc |
| **Framework** | **Bootstrap 5** | Hệ thống Grid & Component Responsive |
| **SSG / Tooling** | **Eleventy (11ty)** | Hỗ trợ xử lý template và cấu trúc tĩnh |
| **CMS** | **Decap CMS** | Quản lý nội dung bài viết (Blog/Jobs) dựa trên Git |
| **CI/CD** | **GitHub Actions** | Tự động hóa quy trình build dữ liệu bài viết (`build-posts.js`) |
| **Backend** | Google Apps Script | Xử lý API Form (No-CORS) |

## 📂 Cấu Trúc Dự Án

```bash
sadaka/
├── .github/
│   ├── workflows/       # Các file cấu hình CI/CD
│   │   └── build-posts.yml # Workflow tự động build bài viết
│   └── scripts/
│       └── build-posts.js  # Script convert Markdown -> JSON
├── admin/               # Trang quản trị CMS
│   ├── config.yml       # Cấu hình data schema cho Decap CMS
│   └── index.html       # Giao diện Admin
├── content/             # Kho nội dung (Database dạng file)
│   ├── posts/           # Bài viết blog (.md)
│   └── pages/           # Nội dung các trang tĩnh
├── public/              # Assets tĩnh (Images, JSON data đã build)
│   ├── js/              # Logic frontend
│   │   ├── contact_form_gas.js  # Xử lý form liên hệ
│   │   ├── blog_data.js         # Dữ liệu bài viết (Client-side)
│   │   └── ...
│   └── img/             # Kho hình ảnh
├── src/                 # Mã nguồn phát triển
├── index.html           # Trang chủ
├── package.json         # Khai báo dependencies
└── vite.config.js       # Cấu hình Vite
```

## ⚙️ Hướng Dẫn Cài Đặt (Local Development)
Yêu cầu:
Node.js (v16 trở lên)

Git

Bước 1: Clone dự án
Bash

git clone [https://github.com/trantrungtien-git/Sadaka.git](https://github.com/trantrungtien-git/Sadaka.git)
cd Sadaka
Bước 2: Cài đặt thư viện
Bash

npm install
Bước 3: Chạy môi trường Dev
Bash

npm run dev
Truy cập: http://localhost:5173 để xem trang web.

Bước 4: Build Production
Bash

npm run build
Kết quả sẽ được tạo trong thư mục dist/.

## 📝 Quy Trình Quản Lý Nội Dung (CMS)
Truy cập trang quản trị: /admin/

Đăng nhập bằng tài khoản GitHub (được phân quyền).

Tạo bài viết mới hoặc chỉnh sửa thông tin đơn hàng.

Nhấn Publish:

Decap CMS sẽ tạo commit và push file .md lên kho chứa GitHub.

GitHub Actions tự động chạy build-posts.js.

Dữ liệu mới sẽ xuất hiện trên website sau vài giây.

## 🤝 Đóng Góp (Contributing)
Dự án được phát triển và duy trì bởi Team Tech SADAKA. Mọi đóng góp vui lòng tạo Pull Request hoặc liên hệ trực tiếp.

📄 License
Copyright © 2025 SADAKA JSC. All rights reserved.
