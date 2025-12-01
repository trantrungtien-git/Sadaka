// ========== JOB DETAIL ==========

document.addEventListener("DOMContentLoaded", () => {
  const imgEl = document.getElementById("jobSliderImg");

  // 1) Danh sách ảnh (thay bằng ảnh của bạn)
  const images = [
    "../assets/img/Edeka.jpg",
    "../assets/img/Slider_2.jpg",
    "../assets/img/Slider_3.jpg",
    // "../assets/img/Slider_4.jpg",
  ];

  // 2) Cấu hình thời gian
  const intervalMs = 20000; // đứng mỗi ảnh bao lâu rồi đổi
  const fadeMs = 350; // phải khớp CSS opacity transition ~0.45s

  let index = 0;
  let timer = null;

  // preload cho mượt (đỡ nháy)
  images.forEach((src) => {
    const pre = new Image();
    pre.src = src;
  });

  function showNextImage() {
    // fade out
    imgEl.classList.add("is-fading");

    // sau khi fade out xong thì đổi src và fade in
    window.setTimeout(() => {
      index = (index + 1) % images.length;
      imgEl.src = images[index];

      // đảm bảo browser đã nhận src mới trước khi fade in
      requestAnimationFrame(() => {
        imgEl.classList.remove("is-fading");
      });
    }, fadeMs);
  }

  function start() {
    if (!images.length) return;
    // set ảnh đầu cho chắc
    imgEl.src = images[index];
    timer = window.setInterval(showNextImage, intervalMs);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Optional: pause khi tab bị ẩn để đỡ tốn tài nguyên
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  start();
});

// ../js/job_detail.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const jobTitle = params.get("title");

  if (jobTitle) {
    // đổi cái <title> trong <head>
    document.title = `${jobTitle} | Sadaka HR`;

    // nếu bạn muốn đồng thời đổi luôn cái H2 trong nội dung:
    const h2 = document.querySelector(".job-header .title h2");
    if (h2) h2.textContent = jobTitle;
  }
});
