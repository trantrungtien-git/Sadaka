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

// ======== CONTENTFUL JOB LIST FETCH & RENDER ========

// public/js/job_detail_render.js

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Cấu hình Contentful (Dùng chung key với job_list.js)
  const client = contentful.createClient({
    space: "b6nnba82anu8", // Space ID của bạn
    accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA", // Token của bạn
  });

  // 2. Lấy slug từ URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    window.location.href = "recruit.html";
    return;
  }

  // 3. Hàm hiển thị chi tiết
  try {
    const response = await client.getEntries({
      content_type: "jobPost", // Đã sửa thành 'jobPost' theo JSON của bạn
      "fields.slug": slug,
      limit: 1,
    });

    if (response.items.length === 0) {
      document.getElementById("jobTitle").textContent =
        "Không tìm thấy bài tuyển dụng này";
      return;
    }

    const job = response.items[0].fields;

    // --- A. Cập nhật Tiêu đề & Trạng thái ---
    document.title = `${job.title} | Sadaka HR`;
    document.getElementById("jobTitle").textContent = job.title;

    // Vì JSON mới không có trường deadline, mặc định là "Còn tuyển"
    document.getElementById("jobStatus").textContent = "Còn tuyển";

    // --- B. Cập nhật Ảnh (Xử lý mảng jobImage) ---
    // Model mới: jobImage là Array -> Lấy ảnh đầu tiên làm ảnh chính
    if (job.jobImage && job.jobImage.length > 0) {
      const firstImg = job.jobImage[0].fields.file.url;
      const finalUrl = firstImg.startsWith("//")
        ? "https:" + firstImg
        : firstImg;
      document.getElementById("jobSliderImg").src = finalUrl;
    }

    // --- C. Xây dựng Nội dung chi tiết (Ghép các trường lại) ---
    // Model mới tách rời: slogan, jobDesc, benefits, requirements
    const descEl = document.getElementById("jobDesc");
    let htmlContent = "";

    // 1. Slogan
    if (job.slogan) {
      htmlContent += `<h4 class="slogan">${job.slogan}</h4>`;
    }

    // Hàm hỗ trợ đổi ký tự xuống dòng \n thành thẻ <br> để hiển thị đẹp
    const formatText = (text) => (text ? text.replace(/\n/g, "<br/>") : "");

    // 2. Nội dung công việc (Vị trí, Địa điểm...)
    if (job.jobDesc) {
      htmlContent += `
            <h3>NỘI DUNG CÔNG VIỆC</h3>
            <div class="job-section-text">
                ${formatText(job.jobDesc)}
            </div>
        `;
    }

    // 3. Phúc lợi
    if (job.benefits) {
      htmlContent += `
            <h3>PHÚC LỢI & ĐÃI NGỘ</h3>
            <div class="job-section-text">
                ${formatText(job.benefits)}
            </div>
        `;
    }

    // 4. Yêu cầu
    if (job.requirements) {
      htmlContent += `
            <h3>YÊU CẦU TUYỂN DỤNG</h3>
            <div class="job-section-text">
                ${formatText(job.requirements)}
            </div>
        `;
    }

    // 5. Thêm nút Ứng tuyển cuối bài
    htmlContent += `
        <div style="margin-top: 30px; text-align: center;">
            <a href="./contact.html" class="cta-btn" style="background: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display:inline-block; font-weight: bold;">
                ỨNG TUYỂN NGAY
            </a>
        </div>
    `;

    // Render ra màn hình
    descEl.innerHTML = htmlContent;

    // --- D. (Tùy chọn) Load bài viết liên quan ---
    // loadRelatedJobs(client, slug);
  } catch (error) {
    console.error("Lỗi khi tải chi tiết công việc:", error);
    document.getElementById("jobTitle").textContent = "Lỗi kết nối dữ liệu";
  }
});
