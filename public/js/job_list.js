// public/js/job_list.js

const client = contentful.createClient({
  space: "b6nnba82anu8",
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
});

async function fetchJobs() {
  const container = document.getElementById("job-list-container");
  if (!container) return;

  try {
    const response = await client.getEntries({
      content_type: "jobPost",
      order: "-sys.createdAt",
    });

    if (response.items.length === 0) {
      container.innerHTML =
        "<p style='text-align:center; width:100%'>Hiện chưa có vị trí tuyển dụng nào.</p>";
      return;
    }

    let html = "";

    response.items.forEach((item) => {
      const job = item.fields;

      // Xử lý ảnh
      let imgUrl = "../assets/img/Logo_SADAKA.jpg";
      if (job.image && job.image.fields) {
        imgUrl = job.image.fields.file.url;
        if (!imgUrl.startsWith("http")) imgUrl = "https:" + imgUrl;
      }

      // HTML chuẩn theo CSS mới
      html += `
            <article class="job-card">
                <a href="job_detail.html?slug=${
                    job.slug
                  }" class="job-card-img-wrapper">
                      <img src="${imgUrl}" alt="${
                    job.title
                  }" class="job-card-img">
                      <span class="salary-badge">${
                        job.salary || "Thỏa thuận"
                      }</span>
                </a>

                <div class="job-card-body">
                    <a href="job_detail.html?slug=${
                      job.slug
                    }" style="text-decoration:none">
                        <h3 class="job-card-title">${job.title}</h3>
                    </a>

                    <div class="job-card-info">
                        <span><i class="material-icons">place</i> ${
                          job.location || "Đức"
                        }</span>
                        <span><i class="material-icons">schedule</i> ${
                          job.jobType || "Toàn thời gian"
                        }</span>
                    </div>

                    <p class="job-card-desc">
                        ${
                          job.slogan ||
                          "Cơ hội việc làm hấp dẫn tại CHLB Đức cùng Sadaka HR."
                        }
                    </p>

                    <div class="job-card-footer">
                        <span class="deadline-text">Hạn nộp: Đang tuyển</span>
                        <a href="job_detail.html?slug=${
                          job.slug
                        }" class="view-more-link">
                            Xem chi tiết <i class="material-icons" style="font-size:16px">arrow_forward</i>
                        </a>
                    </div>
                </div>
            </article>
            `;
    });

    container.innerHTML = html;
    container.className = "job-grid"; // Đảm bảo class grid được thêm vào
  } catch (error) {
    console.error("Lỗi:", error);
    container.innerHTML =
      "<p style='text-align:center'>Đang tải dữ liệu...</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchJobs);
