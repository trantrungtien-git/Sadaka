// public/js/blog_render.js

// --- 1. RENDER LIST (Trang danh sách) ---
function renderBlogList() {
  const blogListSection = document.querySelector(".blog-list-section");
  if (!blogListSection || blogData.length === 0) return;

  blogListSection.innerHTML = "";

  blogData.forEach((blog, index) => {
    const blogCard = `
      <a href="./blog_detail.html?slug=${blog.slug}">
        <div class="blog-content" ${index === 0 ? 'id="blog-info"' : ""}>
          <div class="blog-img">
            <img src="${blog.thumbnail}" alt="${blog.title}" loading="lazy">
          </div>
          <div class="title">
            <h2>${blog.title}</h2>
          </div>
          <div class="short-desc">
            <p>${blog.shortDesc}</p>
          </div>
          <span class="btn-desc"><span class="material-icons">arrow_forward</span></span>
        </div>
      </a>
    `;
    blogListSection.insertAdjacentHTML("beforeend", blogCard);
  });
}

// --- 2. CÁC HÀM TIỆN ÍCH ---
function getSlugFromURL() {
  return new URLSearchParams(window.location.search).get("slug");
}

function getBlogBySlug(slug) {
  return blogData.find((blog) => blog.slug === slug);
}

function renderRecommendedBlogs(currentSlug) {
  const listRcm = document.querySelector(".rcm-list");
  if (!listRcm) return;

  const recommended = blogData
    .filter((b) => b.slug !== currentSlug)
    .slice(0, 4);

  listRcm.innerHTML = recommended
    .map(
      (blog) => `
    <li>
        <a class="rcm-item" href="./blog_detail.html?slug=${blog.slug}">
            <div class="rcm-meta">
                <h3 class="title-blog">${blog.title}</h3>
                <div class="blog-date">
                    <span class="author">bởi: ${blog.author}</span>
                    <span class="date">| <time>${blog.dateFormatted}</time></span>
                </div>
            </div>
            <span class="rcm-arrow">→</span>
        </a>
    </li>
  `
    )
    .join("");
}

// --- 3. RENDER CHI TIẾT (Trang Detail) ---
function renderBlogDetail() {
  console.log("🎨 Bắt đầu render blog detail...");

  const slug = getSlugFromURL();
  if (!slug) {
    console.warn("⚠️ Không tìm thấy slug trong URL");
    return;
  }

  const blog = getBlogBySlug(slug);
  if (!blog) {
    console.warn("⚠️ Không tìm thấy blog với slug:", slug);
    return;
  }

  console.log("📄 Rendering blog:", blog.title);
  console.log("📝 Content:", blog.content);

  // --- Cập nhật các trường cơ bản ---
  document.title = `${blog.title} | Sadaka HR`;

  const els = {
    title: document.querySelector(".blog-title"),
    author: document.querySelector(".author"),
    date: document.querySelector(".date time"),
    hero: document.querySelector(".hero-img img"),
    body: document.querySelector(".blog-text"),
  };

  if (els.title) els.title.textContent = blog.title;
  if (els.author) els.author.textContent = `bởi: ${blog.author}`;

  if (els.date) {
    els.date.dateTime = blog.date;
    els.date.textContent = blog.dateFormatted;
  }

  if (els.hero && blog.heroImage) {
    els.hero.src = blog.heroImage;
    els.hero.alt = blog.title;
  }

  // --- XỬ LÝ RICH TEXT ---
  if (!els.body) {
    console.error("❌ Không tìm thấy element .blog-text");
    return;
  }

  if (!blog.content) {
    console.error("❌ Không có content trong blog data");
    els.body.innerHTML =
      '<p style="color: red;">❌ Không có nội dung bài viết</p>';
    return;
  }

  // ⚠️ KIỂM TRA THƯ VIỆN - THỬ TẤT CẢ CÁC CÁCH GỌI
  console.log("🔍 Kiểm tra thư viện Rich Text Renderer:");

  let renderer = null;

  // Thử cách 1: window.richTextHtmlRenderer (đã expose trong HTML)
  if (
    window.richTextHtmlRenderer &&
    window.richTextHtmlRenderer.documentToHtmlString
  ) {
    renderer = window.richTextHtmlRenderer;
    console.log("   ✅ Sử dụng: window.richTextHtmlRenderer");
  }
  // Thử cách 2: ContentfulRichTextHtmlRenderer (global từ UMD)
  else if (
    window.ContentfulRichTextHtmlRenderer &&
    window.ContentfulRichTextHtmlRenderer.documentToHtmlString
  ) {
    renderer = window.ContentfulRichTextHtmlRenderer;
    console.log("   ✅ Sử dụng: window.ContentfulRichTextHtmlRenderer");
  }
  // Thử cách 3: contentfulRichTextHtmlRenderer
  else if (
    window.contentfulRichTextHtmlRenderer &&
    window.contentfulRichTextHtmlRenderer.documentToHtmlString
  ) {
    renderer = window.contentfulRichTextHtmlRenderer;
    console.log("   ✅ Sử dụng: window.contentfulRichTextHtmlRenderer");
  }

  if (!renderer) {
    console.error("❌ Không tìm thấy thư viện Rich Text Renderer!");
    console.log(
      "💡 Các biến global có sẵn:",
      Object.keys(window).filter(
        (k) =>
          k.toLowerCase().includes("contentful") ||
          k.toLowerCase().includes("richtext")
      )
    );

    els.body.innerHTML = `
      <div style="padding: 20px; background: #ffebee; border-left: 4px solid #f44336; color: #c62828;">
        <h3 style="margin: 0 0 10px 0;">❌ Không thể render nội dung Rich Text</h3>
        <p style="margin: 0;">Thư viện Rich Text Renderer chưa được load.</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          Kiểm tra Console để xem chi tiết lỗi.
        </p>
      </div>
    `;
    return;
  }

  try {
    console.log("✅ Thư viện đã sẵn sàng, bắt đầu render...");

    const options = {
      renderNode: {
        // Xử lý ảnh nhúng trong bài viết
        "embedded-asset-block": (node) => {
          console.log("🖼️ Rendering embedded image:", node);

          const file = node.data?.target?.fields?.file;
          const title = node.data?.target?.fields?.title || "";

          if (!file) {
            console.warn("⚠️ Không tìm thấy file trong embedded asset");
            return "";
          }

          return `
            <figure class="content-image-wrapper" style="margin: 20px 0; text-align: center;">
              <img src="${
                file.url
              }" alt="${title}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px;" />
              ${
                title
                  ? `<figcaption style="margin-top: 10px; font-size: 14px; color: #666; font-style: italic;">${title}</figcaption>`
                  : ""
              }
            </figure>
          `;
        },

        // Xử lý đoạn văn (giữ nguyên xuống dòng)
        paragraph: (node, next) => {
          return `<p>${next(node.content).replace(/\n/g, "<br/>")}</p>`;
        },

        // Xử lý heading
        "heading-1": (node, next) => `<h1>${next(node.content)}</h1>`,
        "heading-2": (node, next) => `<h2>${next(node.content)}</h2>`,
        "heading-3": (node, next) => `<h3>${next(node.content)}</h3>`,

        // Xử lý list
        "unordered-list": (node, next) => `<ul>${next(node.content)}</ul>`,
        "ordered-list": (node, next) => `<ol>${next(node.content)}</ol>`,
        "list-item": (node, next) => `<li>${next(node.content)}</li>`,
      },
    };

    // Chuyển JSON thành HTML
    const htmlContent = renderer.documentToHtmlString(blog.content, options);

    console.log("✅ HTML đã render thành công");
    console.log("   - Độ dài:", htmlContent.length, "ký tự");
    console.log("   - Preview:", htmlContent.substring(0, 200) + "...");

    els.body.innerHTML = htmlContent;
  } catch (error) {
    console.error("❌ Lỗi khi render Rich Text:", error);
    els.body.innerHTML = `
      <div style="padding: 20px; background: #ffebee; border-left: 4px solid #f44336;">
        <h3 style="color: #c62828; margin: 0 0 10px 0;">❌ Lỗi khi hiển thị nội dung</h3>
        <pre style="background: #fff; padding: 10px; border-radius: 4px; overflow-x: auto;">${error.message}</pre>
      </div>
    `;
  }

  renderRecommendedBlogs(slug);
  console.log("✅ Hoàn thành render blog detail");
}
