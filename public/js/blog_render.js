// blogRender.js - Fixed version cho Grid Layout

// Hàm render danh sách blog cho trang blog.html
function renderBlogList() {
  const blogListSection = document.querySelector(".blog-list-section");

  if (!blogListSection) {
    console.log("Không tìm thấy .blog-list-section");
    return;
  }

  // XÓA HOÀN TOÀN nội dung cũ
  blogListSection.innerHTML = "";

  console.log("Đang render", blogData.length, "blog posts");

  // Render từng bài viết
  blogData.forEach((blog, index) => {
    const blogCard = `
      <a href="./blog_detail.html?slug=${blog.slug}">
        <div class="blog-content" ${index === 0 ? 'id="blog-info"' : ""}>
          <div class="blog-img">
            <img src="${blog.thumbnail}" alt="${blog.title}">
          </div>

          <div class="title">
            <h2>${blog.title}</h2>
          </div>

          <div class="short-desc">
            <p>${blog.shortDesc}</p>
          </div>

          <span class="btn-desc" aria-label="Xem chi tiết">
            <span class="material-icons">arrow_forward</span>
          </span>
        </div>
      </a>
    `;

    blogListSection.insertAdjacentHTML("beforeend", blogCard);
  });

  console.log("Đã render xong", blogListSection.children.length, "cards");
}

// Hàm lấy slug từ URL
function getSlugFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("slug");
}

// Hàm tìm blog theo slug
function getBlogBySlug(slug) {
  return blogData.find((blog) => blog.slug === slug);
}

// Hàm lấy danh sách blog đề xuất (loại trừ blog hiện tại)
function getRecommendedBlogs(currentSlug, limit = 4) {
  return blogData.filter((blog) => blog.slug !== currentSlug).slice(0, limit);
}

// Hàm render chi tiết blog cho trang blog_detail.html
function renderBlogDetail() {
  const slug = getSlugFromURL();

  if (!slug) {
    console.error("Không tìm thấy slug trong URL");
    return;
  }

  const blog = getBlogBySlug(slug);

  if (!blog) {
    console.error("Không tìm thấy bài viết với slug:", slug);
    return;
  }

  // Render tiêu đề blog
  const blogTitle = document.querySelector(".blog-title");
  if (blogTitle) {
    blogTitle.textContent = blog.title;
  }

  // Render tác giả và ngày
  const authorSpan = document.querySelector(".author");
  if (authorSpan) {
    authorSpan.textContent = `bởi: ${blog.author}`;
  }

  const dateTime = document.querySelector(".date time");
  if (dateTime) {
    dateTime.setAttribute("datetime", blog.date);
    dateTime.textContent = blog.dateFormatted;
  }

  // Render ảnh hero
  const heroImg = document.querySelector(".hero-img img");
  if (heroImg) {
    heroImg.src = blog.heroImage;
    heroImg.alt = blog.title;
  }

  // Render nội dung blog
  const blogText = document.querySelector(".blog-text");
  if (blogText) {
    blogText.innerHTML = blog.content;
  }

  // Render danh sách blog đề xuất
  renderRecommendedBlogs(slug);

  // Update document title
  document.title = `${blog.title} | Sadaka HR`;
}

// Hàm render danh sách blog đề xuất
function renderRecommendedBlogs(currentSlug) {
  const rcmList = document.querySelector(".rcm-list");

  if (!rcmList) return;

  // Xóa nội dung cũ
  rcmList.innerHTML = "";

  // Lấy danh sách blog đề xuất
  const recommendedBlogs = getRecommendedBlogs(currentSlug, 4);

  // Render từng blog đề xuất
  recommendedBlogs.forEach((blog) => {
    const rcmItem = `
      <li>
        <a class="rcm-item" href="./blog_detail.html?slug=${blog.slug}">
          <div class="rcm-meta">
            <h3 class="title-blog">${blog.title}</h3>
            <div class="blog-date">
              <span class="author">bởi: ${blog.author}</span>
              <span class="date">| <time datetime="${blog.date}">${blog.dateFormatted}</time></span>
            </div>
          </div>
          <span class="rcm-arrow" aria-hidden="true">→</span>
        </a>
      </li>
    `;

    rcmList.insertAdjacentHTML("beforeend", rcmItem);
  });
}

// Khởi động khi DOM loaded
document.addEventListener("DOMContentLoaded", async function () {
  // 1. CHỜ tải dữ liệu từ Contentful về trước
  await fetchBlogData();

  // 2. Sau khi có dữ liệu rồi mới Render
  const currentPage = window.location.pathname;

  // Logic check trang (giữ nguyên hoặc điều chỉnh tùy đường dẫn thực tế)
  if (currentPage.includes("blog.html") || currentPage.endsWith("/blog")) {
    renderBlogList();
  } else if (
    currentPage.includes("blog_detail.html") ||
    currentPage.includes("blog-detail")
  ) {
    renderBlogDetail();
  }
});

// Export functions (nếu cần dùng ở nơi khác)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    renderBlogList,
    renderBlogDetail,
    getBlogBySlug,
    getRecommendedBlogs,
  };
}
