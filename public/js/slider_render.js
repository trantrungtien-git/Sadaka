// Đặt đoạn này vào file main.js hoặc tạo file slider_render.js
const client = contentful.createClient({
  space: "b6nnba82anu8", // Space ID của bạn
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA", // Token của bạn
});

async function renderSlider() {
  const container = document.getElementById("hero-slider-container");

  try {
    // 1. Lấy các bài viết từ Contentful
    // Bạn có thể thêm bộ lọc: 'fields.isSlider': true nếu muốn chọn lọc bài nào được lên slider
    const response = await client.getEntries({
      content_type: "jobPost",
      limit: 4, // Lấy 4 bài mới nhất
      order: "-sys.createdAt", // Sắp xếp bài mới nhất lên đầu
    });

    if (response.items.length === 0) return;

    let html = "";

    // 2. Chạy vòng lặp qua từng bài viết để tạo HTML
    response.items.forEach((item, index) => {
      const job = item.fields;

      // Kiểm tra xem bài viết có ảnh không, nếu không thì dùng ảnh mặc định
      let imageUrl = "./public/img/default-bg.jpg";
      if (job.image && job.image.fields && job.image.fields.file) {
        imageUrl = job.image.fields.file.url;
        if (!imageUrl.startsWith("http")) imageUrl = "https:" + imageUrl;
      }

      // Xử lý class 'active' cho slide đầu tiên
      const activeClass = index === 0 ? "active" : "";

      // Tạo HTML (Chú ý dòng href chứa SLUG tự động)
      html += `
        <a href="./pages/job_detail.html?slug=${job.slug}" 
           class="hero-slide ${activeClass}" 
           style="background-image: url('${imageUrl}'); display: block; text-decoration: none; color: inherit;">
           
           <div class="hero-slide-overlay"></div>
           <div class="hero-slide-container">
             <div class="hero-slide-content">
               <h1>${job.title.toUpperCase()}</h1>
               <p>${
                 job.slogan || "Cơ hội việc làm và định cư hấp dẫn tại CHLB Đức"
               }</p>
             </div>
             <div class="hero-slide-image">
               <img src="${imageUrl}" alt="${job.title}" />
             </div>
           </div>
        </a>
      `;
    });

    // 3. Đổ HTML vào trang
    container.innerHTML = html;

    // QUAN TRỌNG:
    // Sau khi render xong mới được khởi động chức năng chuyển slide (Nút bấm, Dots...)
    // Nếu bạn có hàm initSlider() trong main.js, hãy gọi nó ở đây:
    if (typeof initSlider === "function") {
      initSlider();
    }
  } catch (error) {
    console.error("Lỗi tải Slider:", error);
    container.innerHTML =
      "<p style='color:white; text-align:center'>Không thể tải dữ liệu.</p>";
  }
}

// Gọi hàm khi web tải xong
document.addEventListener("DOMContentLoaded", renderSlider);
