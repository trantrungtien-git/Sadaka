// FILE: public/js/job_detail_render.js

const client = contentful.createClient({
  space: "b6nnba82anu8",
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
});

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Lấy slug từ URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    window.location.href = "recruit.html";
    return;
  }

  try {
    // 2. Tìm bài viết hiện tại
    const response = await client.getEntries({
      content_type: "jobPost",
      "fields.slug": slug,
      limit: 1,
    });

    if (response.items.length === 0) {
      document.getElementById("jobTitle").innerText = "Không tìm thấy bài viết";
      return;
    }

    // Lấy toàn bộ entry để dùng cả sys.id và fields
    const currentEntry = response.items[0];
    const job = currentEntry.fields;

    // --- RENDER BÀI VIẾT CHÍNH ---
    document.title = `${job.title} | Sadaka HR`;

    const titleEl = document.getElementById("jobTitle");
    if (titleEl) titleEl.innerText = job.title;

    const statusEl = document.getElementById("jobStatus");
    if (statusEl) statusEl.innerText = "Đang tuyển";

    const imgEl = document.getElementById("jobSliderImg");
    if (imgEl && job.image) {
      let url = job.image.fields.file.url;
      if (!url.startsWith("http")) url = "https:" + url;
      imgEl.src = url;
    }

    const descContainer = document.getElementById("jobDesc");
    if (descContainer) {
      const format = (text) => (text ? text.replace(/\n/g, "<br>") : "");

      descContainer.innerHTML = `
                ${
                  job.slogan
                    ? `<h4 class="slogan" style="font-weight:bold; color:#d32f2f; margin-bottom:20px">${job.slogan}</h4>`
                    : ""
                }
                ${
                  job.jobDesc
                    ? `<h3>NỘI DUNG CÔNG VIỆC</h3><p>${format(job.jobDesc)}</p>`
                    : ""
                }
                ${
                  job.income
                    ? `<h3>THU NHẬP</h3><p>${format(job.income)}</p>`
                    : ""
                }
                ${
                  job.benefits
                    ? `<h3>PHÚC LỢI & ĐÃI NGỘ</h3><p>${format(
                        job.benefits
                      )}</p>`
                    : ""
                }
                ${
                  job.requirements
                    ? `<h3>YÊU CẦU TUYỂN DỤNG</h3><p>${format(
                        job.requirements
                      )}</p>`
                    : ""
                }
                
                <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 30px;">
                  <p style="margin-bottom: 15px; color: #666;">Bạn đã sẵn sàng cho hành trình mới?</p>
                  <a href="./contact.html" class="cta-btn" style="
                      display: inline-block; padding: 15px 40px; font-size: 16px; text-decoration: none;
                      background: linear-gradient(90deg, var(--brand-primary), var(--brand-primary-soft));
                      color: #fff; border-radius: 4px;">
                    ỨNG TUYỂN NGAY
                  </a>
                </div>
            `;
    }

    // --- GỌI HÀM RENDER BÀI VIẾT LIÊN QUAN ---
    // Truyền vào ID của bài hiện tại để loại trừ nó ra khỏi list liên quan
    await renderRelatedJobs(currentEntry.sys.id);
  } catch (error) {
    console.error("Lỗi khi tải bài viết:", error);
  }
});

// Hàm lấy và hiển thị các bài viết liên quan
async function renderRelatedJobs(currentId) {
  const grid = document.getElementById("relatedJobsGrid"); // Đảm bảo ID này khớp với HTML bước 1
  if (!grid) return;

  try {
    // Lấy 3 bài viết mới nhất, TRỪ bài hiện tại (sys.id[ne])
    const relatedData = await client.getEntries({
      content_type: "jobPost",
      "sys.id[ne]": currentId, // ne = not equal (không bằng)
      limit: 3,
      order: "-sys.createdAt", // Bài mới nhất lên đầu
    });

    if (relatedData.items.length === 0) {
      grid.innerHTML = "<p>Hiện chưa có bài viết liên quan nào khác.</p>";
      return;
    }

    // Tạo HTML cho từng thẻ
    const html = relatedData.items
      .map((item) => {
        const fields = item.fields;

        // Xử lý ảnh thumbnail
        let thumbUrl = "../assets/img/Logo_SADAKA.jpg"; // Ảnh mặc định nếu không có
        if (fields.image && fields.image.fields && fields.image.fields.file) {
          thumbUrl = fields.image.fields.file.url;
          if (!thumbUrl.startsWith("http")) thumbUrl = "https:" + thumbUrl;
        }

        // Tạo thẻ HTML giống hệt cấu trúc cũ của bạn
        return `
                <article class="related-card">
                    <a href="job_detail.html?slug=${fields.slug}">
                        <div class="related-thumb">
                            <img src="${thumbUrl}" alt="${fields.title}" style="object-fit: cover; height: 200px; width: 100%;">
                            <span class="related-badge">Đang tuyển</span>
                        </div>

                        <div class="related-titlebar">
                            <h4 style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${fields.title}
                            </h4>
                        </div>
                    </a>
                </article>
            `;
      })
      .join("");

    grid.innerHTML = html;
  } catch (err) {
    console.error("Lỗi tải bài viết liên quan:", err);
  }
}
