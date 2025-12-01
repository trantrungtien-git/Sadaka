document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const job = (window.JOBS || []).find((x) => x.id === id);
  if (!job) {
    document.title = "Job Detail | Sadaka HR";
    const titleEl = document.getElementById("jobTitle");
    if (titleEl) titleEl.textContent = "Không tìm thấy bài viết";
    return;
  }

  document.title = `${job.title} | Sadaka HR`;
  document.getElementById("jobTitle").textContent = job.title;
  document.getElementById("jobStatus").textContent = job.status;

  // render phần mô tả (bạn customize thêm tùy HTML)
  const desc = document.getElementById("jobDesc");
  desc.innerHTML = `
    <h4 class="slogan">${job.slogan}</h4>

    <h3>NỘI DUNG CÔNG VIỆC</h3>
    <ul>${job.sections.content.map((t) => `<li>${t}</li>`).join("")}</ul>

    <h3>THU NHẬP</h3>
    <ul>${job.sections.income.map((t) => `<li>${t}</li>`).join("")}</ul>

    <h3>PHÚC LỢI & ĐÃI NGỘ</h3>
    <ul>${job.sections.benefits.map((t) => `<li>${t}</li>`).join("")}</ul>

    <h3>YÊU CẦU TUYỂN DỤNG</h3>
    <ul>${job.sections.requirements.map((t) => `<li>${t}</li>`).join("")}</ul>
  `;
});
