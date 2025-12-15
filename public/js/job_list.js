// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".job-content").forEach((card) => {
//     const h2 = card.querySelector(".title h2");
//     const a = card.querySelector("a.btn-desc");
//     if (!h2 || !a) return;

//     const jobTitle = h2.textContent.trim();

//     const url = new URL(a.getAttribute("href"), window.location.href);
//     url.searchParams.set("title", jobTitle);

//     a.href = url.toString();
//   });
// });

// document.querySelectorAll(".job-content").forEach((card) => {
//   const id = card.dataset.id;
//   const a = card.querySelector(".btn-desc");
//   if (!id || !a) return;
//   a.href = `../pages/job_detail.html?id=${encodeURIComponent(id)}`;
// });

// public/js/job_list.js

// 1. KẾT NỐI CONTENTFUL
const client = contentful.createClient({
  space: "b6nnba82anu8", // Thay Space ID của bạn
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA", // Thay Access Token của bạn
});

// 2. HÀM LẤY DỮ LIỆU
async function fetchJobs() {
  try {
    const response = await client.getEntries({
      content_type: "jobPosting", // ID bạn đặt ở Bước 1
      order: "-sys.createdAt", // Việc mới nhất lên đầu
    });

    const jobs = response.items.map((item) => {
      const fields = item.fields;
      // Xử lý ngày tháng (nếu có trường deadline)
      let deadlineStr = "";
      if (fields.deadline) {
        const d = new Date(fields.deadline);
        deadlineStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      }

      return {
        id: item.sys.id,
        title: fields.title,
        slug: fields.slug,
        salary: fields.salary || "Thỏa thuận",
        location: fields.location || "Toàn quốc",
        jobType: fields.jobType || "Full-time",
        deadline: deadlineStr,
        shortDesc: fields.shortDesc || "",
        // Nếu có ảnh thumbnail thì lấy, không thì dùng ảnh mặc định
        // thumbnail: fields.thumbnail ? fields.thumbnail.fields.file.url : '../assets/img/default-job.jpg'
      };
    });

    renderJobList(jobs);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu tuyển dụng:", error);
    document.getElementById("job-list").innerHTML =
      "<p>Đang cập nhật danh sách việc làm...</p>";
  }
}

// 3. HÀM RENDER RA HTML
function renderJobList(jobs) {
  const container = document.getElementById("job-list");

  // Nếu không tìm thấy container trong HTML thì dừng lại
  if (!container) return;

  if (jobs.length === 0) {
    container.innerHTML = "<p>Hiện chưa có vị trí tuyển dụng nào.</p>";
    return;
  }

  let html = "";

  jobs.forEach((job) => {
    // HTML này bạn chỉnh cho giống design của bạn (class, thẻ div...)
    html += `
        <div class="job-item">
            <div class="job-content">
                <h3 class="job-title">
                    <a href="job_detail.html?slug=${job.slug}">${job.title}</a>
                </h3>
                
                <div class="job-meta">
                    <span class="meta-item"><i class="material-icons">attach_money</i> ${job.salary}</span>
                    <span class="meta-item"><i class="material-icons">place</i> ${job.location}</span>
                    <span class="meta-item"><i class="material-icons">schedule</i> ${job.jobType}</span>
                </div>

                <p class="job-desc">${job.shortDesc}</p>

                <div class="job-footer">
                    <span class="deadline">Hạn nộp: ${job.deadline}</span>
                    <a href="job_detail.html?slug=${job.slug}" class="btn-apply">Xem chi tiết</a>
                </div>
            </div>
        </div>
        `;
  });

  container.innerHTML = html;
}

// 4. CHẠY KHI TRANG LOAD XONG
document.addEventListener("DOMContentLoaded", function () {
  // Chỉ chạy nếu đang ở trang có id="job-list" (tránh lỗi ở trang khác)
  if (document.getElementById("job-list")) {
    fetchJobs();
  }
});
