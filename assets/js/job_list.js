document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".job-content").forEach((card) => {
    const h2 = card.querySelector(".title h2");
    const a = card.querySelector("a.btn-desc");
    if (!h2 || !a) return;

    const jobTitle = h2.textContent.trim();

    const url = new URL(a.getAttribute("href"), window.location.href);
    url.searchParams.set("title", jobTitle);

    a.href = url.toString();
  });
});

document.querySelectorAll(".job-content").forEach((card) => {
  const id = card.dataset.id;
  const a = card.querySelector(".btn-desc");
  if (!id || !a) return;
  a.href = `../pages/job_detail.html?id=${encodeURIComponent(id)}`;
});
