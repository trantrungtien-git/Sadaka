/**
 * MAIN.JS - SADAKA HR
 * Phiên bản Fix lỗi Slider (Sử dụng MutationObserver để chờ dữ liệu tải xong)
 */

(function () {
  "use strict";

  const CONFIG = {
    contentful: {
      space: "b6nnba82anu8",
      accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
    },
    selectors: {
      sliderContainer: "#hero-slider-container", // ID của khung chứa slide
      sliderItems: ".hero-slide",
      dropdown: "#jobDropdownList",
      contactForm: "#contact-form",
    },
  };

  let appClient = null;

  if (typeof contentful !== "undefined") {
    appClient = contentful.createClient(CONFIG.contentful);
  } else {
    // Chỉ warn nhẹ, không chặn luồng chạy
    console.warn("Contentful SDK chưa load hoặc không cần thiết ở trang này.");
  }

  const App = {
    init: function () {
      this.handleDropdown();
      this.handleSliderObserver(); // Dùng Observer thay vì gọi trực tiếp
      this.handleScrollAnimations();
      this.handleContactForm();
      this.handleSmoothScroll();
      this.handleAboutCounters();
    },

    // --- 1. XỬ LÝ DROPDOWN ---
    handleDropdown: async function () {
      const dropdownList = document.querySelector(CONFIG.selectors.dropdown);
      if (!dropdownList || !appClient) return;

      try {
        const response = await appClient.getEntries({
          content_type: "jobPost",
          limit: 5,
          order: "-sys.createdAt",
        });

        dropdownList.innerHTML = "";
        if (response.items.length === 0) {
          dropdownList.innerHTML =
            '<li><span style="padding:10px; display:block">Chưa có công việc.</span></li>';
          return;
        }

        const basePath = "/pages/job_detail.html";
        const recruitPath = "/pages/recruit.html";

        const html = response.items
          .map((item) => {
            const { title, slug } = item.fields;
            return `<li><a href="${basePath}?slug=${slug}">${title}</a></li>`;
          })
          .join("");

        const viewAll = `<li><a href="${recruitPath}" style="font-weight:600; color:#d32f2f; background:#fafafa; text-align:center">Xem tất cả &rarr;</a></li>`;
        dropdownList.innerHTML = html + viewAll;
      } catch (error) {
        console.error("Dropdown Error:", error);
      }
    },

    // --- 2. XỬ LÝ SLIDER (NÂNG CẤP: CHỜ DỮ LIỆU) ---
    handleSliderObserver: function () {
      const container = document.querySelector(
        CONFIG.selectors.sliderContainer
      );
      if (!container) {
        // Nếu không có container ID, thử tìm class cha (trường hợp trang tĩnh)
        if (
          document.querySelectorAll(CONFIG.selectors.sliderItems).length > 0
        ) {
          this.runSliderLogic();
        }
        return;
      }

      // Cách 1: Nếu slide đã có sẵn (HTML tĩnh), chạy luôn
      if (container.querySelectorAll(CONFIG.selectors.sliderItems).length > 0) {
        this.runSliderLogic();
        return;
      }

      // Cách 2: Nếu chưa có slide (đang load từ API), thì ngồi canh
      // MutationObserver sẽ theo dõi sự thay đổi trong DOM
      const observer = new MutationObserver((mutations) => {
        if (
          container.querySelectorAll(CONFIG.selectors.sliderItems).length > 0
        ) {
          // Khi thấy slide xuất hiện, kích hoạt logic và hủy theo dõi
          this.runSliderLogic();
          observer.disconnect();
        }
      });

      observer.observe(container, { childList: true, subtree: true });
    },

    // Logic chạy slider (được gọi sau khi chắc chắn đã có ảnh)
    runSliderLogic: function () {
      const slides = document.querySelectorAll(CONFIG.selectors.sliderItems);
      // Nút bấm nằm ngoài container nên query riêng
      const prevBtn = document.querySelector(".slider-arrow-prev");
      const nextBtn = document.querySelector(".slider-arrow-next");
      const dotsContainer = document.querySelector(".slider-dots");

      if (slides.length === 0) return;

      // 1. Tạo Dots
      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        slides.forEach((_, index) => {
          const dot = document.createElement("button");
          dot.classList.add("slider-dot");
          if (index === 0) dot.classList.add("active");
          dot.dataset.slide = index;
          dot.addEventListener("click", () => {
            showSlide(index);
            resetAutoPlay();
          });
          dotsContainer.appendChild(dot);
        });
      }

      const dots = document.querySelectorAll(".slider-dot");
      let currentIndex = 0;
      let sliderInterval;

      // 2. Hàm chuyển slide
      function showSlide(index) {
        // Xử lý vòng lặp
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        // Toggle active class
        slides.forEach((s, i) =>
          s.classList.toggle("active", i === currentIndex)
        );
        dots.forEach((d, i) =>
          d.classList.toggle("active", i === currentIndex)
        );
      }

      // 3. Xử lý nút bấm (Clone node để xóa event cũ nếu chạy lại hàm này)
      if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener("click", () => {
          showSlide(currentIndex - 1);
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener("click", () => {
          showSlide(currentIndex + 1);
          resetAutoPlay();
        });
      }

      // 4. Auto Play
      function startAutoPlay() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => showSlide(currentIndex + 1), 6000); // 6 giây
      }

      function resetAutoPlay() {
        clearInterval(sliderInterval);
        startAutoPlay();
      }

      // Kích hoạt lần đầu
      // showSlide(0); // Không cần gọi dòng này nếu CSS đã set cái đầu tiên hiện
      startAutoPlay();

      // Pause khi hover
      const sliderWrapper = document.querySelector(".hero-slider");
      if (sliderWrapper) {
        sliderWrapper.addEventListener("mouseenter", () =>
          clearInterval(sliderInterval)
        );
        sliderWrapper.addEventListener("mouseleave", startAutoPlay);
      }
    },

    // --- 3. CÁC HIỆU ỨNG KHÁC (Giữ nguyên) ---
    handleScrollAnimations: function () {
      const targets = document.querySelectorAll(
        ".service-item, .why-card, .map-card"
      );
      if (targets.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in-view");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      targets.forEach((el) => observer.observe(el));
    },

    handleAboutCounters: function () {
      const section = document.querySelector(".about-section");
      const counters = document.querySelectorAll(".about-stat-number");
      if (!section || counters.length === 0) return;

      let started = false;
      const run = () => {
        if (started) return;
        started = true;
        counters.forEach((c) => {
          const target = +c.dataset.target;
          const duration = 2000;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            c.textContent = Math.floor(
              target * (1 - Math.pow(1 - progress, 3))
            );
            if (progress < 1) requestAnimationFrame(step);
            else c.textContent = target;
          };
          requestAnimationFrame(step);
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            section.classList.add("in-view");
            run();
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(section);
    },

    handleContactForm: function () {
      const form = document.querySelector(CONFIG.selectors.contactForm);
      if (!form) return;
      const statusEl = document.getElementById("form-status");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (statusEl) statusEl.textContent = "";
        form
          .querySelectorAll(".form-field")
          .forEach((f) => f.classList.remove("has-error"));
        const formData = new FormData(form);
        if (
          !formData.get("fullName") ||
          !formData.get("email") ||
          !formData.get("service")
        ) {
          if (statusEl) {
            statusEl.style.color = "#EF4444";
            statusEl.textContent = "Vui lòng điền đủ thông tin.";
          }
          return;
        }
        if (statusEl) {
          statusEl.style.color = "#10B981";
          statusEl.textContent = "Gửi thành công!";
        }
        form.reset();
      });
    },

    handleSmoothScroll: function () {
      const btn = document.querySelector(".cta-btn");
      const target = document.querySelector(".job-content");
      if (btn && target) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
})();
