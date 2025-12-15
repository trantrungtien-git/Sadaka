// public/js/job_list.js

// Khởi tạo Client Contentful (Giữ nguyên key của bạn)
const client = contentful.createClient({
  space: "b6nnba82anu8",
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
});

async function fetchJobs() {
  const container = document.getElementById("job-list-container");
  if (!container) return;

  try {
    // Hiện loading đẹp hơn tí
    container.innerHTML = `<p style="text-align:center; padding: 40px; color:#666;">Đang tải danh sách việc làm...</p>`;

    const response = await client.getEntries({
      content_type: "jobPost",
      order: "-sys.createdAt",
    });

    if (response.items.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 50px; width:100%;">
            <img src="../assets/img/Logo_SADAKA.jpg" style="width:80px; opacity:0.5; margin-bottom:10px;">
            <p>Hiện chưa có vị trí tuyển dụng nào.</p>
        </div>`;
      return;
    }

    let html = "";

    response.items.forEach((item) => {
      const job = item.fields;

      // Xử lý ảnh (Fallback nếu không có ảnh)
      let imgUrl = "../assets/img/Logo_SADAKA.jpg";
      if (job.image && job.image.fields) {
        imgUrl = job.image.fields.file.url;
        if (!imgUrl.startsWith("http")) imgUrl = "https:" + imgUrl;
      }

      // Format lại HTML chuẩn cấu trúc Card
      html += `
        <article class="job-card">
            <a href="job_detail.html?slug=${job.slug}" class="job-thumb-link">
                <span class="job-status-badge">Đang tuyển</span>
                <img src="${imgUrl}" alt="${job.title}" loading="lazy">
            </a>

            <div class="job-card-body">
                <a href="job_detail.html?slug=${
                  job.slug
                }" class="job-card-title">
                    ${job.title}
                </a>

                <div class="job-meta">
                    <span>
                        <i class="material-icons" style="font-size:16px">place</i> 
                        ${job.location || "CHLB Đức"}
                    </span>
                    <span>
                        <i class="material-icons" style="font-size:16px">schedule</i> 
                        ${job.jobType || "Toàn thời gian"}
                    </span>
                </div>

                <p class="job-desc">
                    ${
                      job.slogan ||
                      "Cơ hội việc làm hấp dẫn tại CHLB Đức cùng Sadaka HR. Môi trường chuyên nghiệp, thu nhập cao."
                    }
                </p>

                <div class="job-card-footer">
                    <span style="font-size:0.8rem; color:#888;">
                        Hạn nộp: ${
                          job.deadline
                            ? new Date(job.deadline).toLocaleDateString("vi-VN")
                            : "Không giới hạn"
                        }
                    </span>
                    <a href="job_detail.html?slug=${
                      job.slug
                    }" class="btn-detail">
                        Xem chi tiết <i class="material-icons" style="font-size:16px">arrow_forward</i>
                    </a>
                </div>
            </div>
        </article>
      `;
    });

    container.className = "job-grid"; // Áp dụng Grid Layout
    container.innerHTML = html;
  } catch (error) {
    console.error("Lỗi:", error);
    container.innerHTML = `<p style='text-align:center; color:red;'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", fetchJobs);
