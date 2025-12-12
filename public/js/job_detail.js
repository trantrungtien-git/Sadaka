// public/js/job_detail.js
(function () {
  // Vercel + Vite: public/* sẽ ở root => dùng path tuyệt đối luôn
  const pub = (p) => "/" + String(p).replace(/^\/+/, ""); // "img/a.jpg" -> "/img/a.jpg"

  const $ = (sel) => document.querySelector(sel);

  function getParams() {
    const url = new URL(window.location.href);
    return {
      id: (url.searchParams.get("id") || "").trim().toLowerCase(),
      title: (url.searchParams.get("title") || "").trim(),
    };
  }

  // map theo id (bạn thêm tuỳ ý)
  const JOB_IMAGE_MAP = {
    edeka: "img/Edeka.jpg",
  };

  // slider mặc định
  const DEFAULT_SLIDES = [
    "img/Edeka.jpg",
    "img/Slider_2.jpg",
    "img/Slider_3.jpg",
  ];

  function init() {
    const { id, title } = getParams();

    // ---- title ----
    const titleEl = $("#job-title") || $(".job-title") || $("h1") || $("h2");
    if (titleEl && title) titleEl.textContent = title;

    // ---- lấy element ảnh chính (đổi selector cho đúng HTML bạn nếu cần) ----
    const sliderImg =
      $("#jobSliderImg") || // bạn đang có cái này (trong log trước)
      $("#slider-main-image") ||
      $("#job-main-image") ||
      $("#jobImg") ||
      $("img[data-role='job-image']");

    if (!sliderImg) return;

    // ---- danh sách slide (ưu tiên theo id job) ----
    const slides = [...DEFAULT_SLIDES];
    const cover = JOB_IMAGE_MAP[id];
    if (cover) slides[0] = cover;

    // set ảnh ban đầu
    let idx = 0;
    sliderImg.src = pub(slides[idx]);

    // nếu có thumbnail thì set luôn (optional)
    const t1 = $("#slide1") || $("#sliderImg1");
    const t2 = $("#slide2") || $("#sliderImg2");
    const t3 = $("#slide3") || $("#sliderImg3");
    if (t1) t1.src = pub(slides[0]);
    if (t2) t2.src = pub(slides[1]);
    if (t3) t3.src = pub(slides[2]);

    // ---- autoplay slider ----
    const INTERVAL_MS = 3000;
    let timer = setInterval(() => {
      idx = (idx + 1) % slides.length;
      sliderImg.src = pub(slides[idx]);
    }, INTERVAL_MS);

    // ---- (tuỳ chọn) nếu có nút prev/next ----
    const btnPrev = $("#btnPrev") || $(".btn-prev");
    const btnNext = $("#btnNext") || $(".btn-next");

    function go(step) {
      idx = (idx + step + slides.length) % slides.length;
      sliderImg.src = pub(slides[idx]);
      // reset timer để bấm tay không bị giật
      clearInterval(timer);
      timer = setInterval(() => {
        idx = (idx + 1) % slides.length;
        sliderImg.src = pub(slides[idx]);
      }, INTERVAL_MS);
    }

    if (btnPrev) btnPrev.addEventListener("click", () => go(-1));
    if (btnNext) btnNext.addEventListener("click", () => go(1));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
