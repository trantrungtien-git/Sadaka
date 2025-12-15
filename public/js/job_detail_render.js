// document.addEventListener("DOMContentLoaded", () => {
//   const params = new URLSearchParams(location.search);
//   const id = params.get("id");

//   const job = (window.JOBS || []).find((x) => x.id === id);
//   if (!job) {
//     document.title = "Job Detail | Sadaka HR";
//     const titleEl = document.getElementById("jobTitle");
//     if (titleEl) titleEl.textContent = "Không tìm thấy bài viết";
//     return;
//   }

//   document.title = `${job.title} | Sadaka HR`;
//   document.getElementById("jobTitle").textContent = job.title;
//   document.getElementById("jobStatus").textContent = job.status;

//   // render phần mô tả (bạn customize thêm tùy HTML)
//   const desc = document.getElementById("jobDesc");
//   desc.innerHTML = `
//     <h4 class="slogan">${job.slogan}</h4>

//     <h3>NỘI DUNG CÔNG VIỆC</h3>
//     <ul>${job.sections.content.map((t) => `<li>${t}</li>`).join("")}</ul>

//     <h3>THU NHẬP</h3>
//     <ul>${job.sections.income.map((t) => `<li>${t}</li>`).join("")}</ul>

//     <h3>PHÚC LỢI & ĐÃI NGỘ</h3>
//     <ul>${job.sections.benefits.map((t) => `<li>${t}</li>`).join("")}</ul>

//     <h3>YÊU CẦU TUYỂN DỤNG</h3>
//     <ul>${job.sections.requirements.map((t) => `<li>${t}</li>`).join("")}</ul>
//   `;
// });

// =========== CONTENTFUL INTEGRATION ===========

// FILE: public/js/job_detail_render.js

const client = contentful.createClient({
  space: "b6nnba82anu8",
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
});

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Lấy slug từ URL (ví dụ: job_detail.html?slug=cong-nhan-edeka)
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    window.location.href = "recruit.html";
    return;
  }

  try {
    // 2. Tìm bài viết trên Contentful khớp với slug
    const response = await client.getEntries({
      content_type: "jobPost",
      "fields.slug": slug,
      limit: 1,
    });

    if (response.items.length === 0) {
      document.getElementById("jobTitle").innerText = "Không tìm thấy bài viết";
      return;
    }

    const job = response.items[0].fields;

    // 3. Đổ dữ liệu vào HTML (Cần đảm bảo file HTML có các ID này)
    document.title = `${job.title} | Sadaka HR`;

    // Header
    const titleEl = document.getElementById("jobTitle");
    if (titleEl) titleEl.innerText = job.title;

    const statusEl = document.getElementById("jobStatus");
    if (statusEl) statusEl.innerText = "Đang tuyển"; // Mặc định

    // Ảnh chính
    const imgEl = document.getElementById("jobSliderImg");
    if (imgEl && job.image) {
      let url = job.image.fields.file.url;
      if (!url.startsWith("http")) url = "https:" + url;
      imgEl.src = url;
    }

    // Nội dung chi tiết (Ghép các trường lại)
    const descContainer = document.getElementById("jobDesc");
    if (descContainer) {
      // Hàm xử lý xuống dòng
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
                      display: inline-block; 
                      padding: 15px 40px; 
                      font-size: 16px; 
                      text-decoration: none;
                      background: linear-gradient(90deg, var(--brand-primary), var(--brand-primary-soft));
                      color: #fff;">
                    ỨNG TUYỂN NGAY
                  </a>
                </div>
            `;
    }
  } catch (error) {
    console.error("Lỗi:", error);
  }
});
