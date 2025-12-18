/**
 * MAIN.JS - SADAKA HR (Phiên bản Fix lỗi đường dẫn)
 */

(function () {
  "use strict";

  const CONFIG = {
    contentful: {
      space: "b6nnba82anu8",
      accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
    },
    selectors: {
      slider: ".hero-slider",
      dropdown: "#jobDropdownList",
      contactForm: "#contact-form",
    },
  };

  let appClient = null;

  if (typeof contentful !== "undefined") {
    appClient = contentful.createClient(CONFIG.contentful);
  } else {
    console.warn(
      "Lưu ý: Thư viện Contentful chưa được load ở trang này. Chức năng Dropdown sẽ tắt."
    );
  }

  const App = {
    init: function () {
      this.handleDropdown();
      this.handleSlider();
      this.handleScrollAnimations();
      this.handleContactForm();
      this.handleSmoothScroll();
      this.handleAboutCounters();
    },

    // --- XỬ LÝ DROPDOWN MENU (ĐÃ FIX) ---
    handleDropdown: async function () {
      const dropdownList = document.querySelector(CONFIG.selectors.dropdown);

      if (!dropdownList) return;

      if (!appClient) {
        dropdownList.innerHTML =
          '<li><a href="#" style="color:red">Lỗi: Thiếu thư viện Contentful</a></li>';
        return;
      }

      try {
        const response = await appClient.getEntries({
          content_type: "jobPost",
          limit: 5,
          order: "-sys.createdAt",
        });

        dropdownList.innerHTML = "";

        if (response.items.length === 0) {
          dropdownList.innerHTML =
            '<li><span style="padding:10px; display:block; text-align:center">Chưa có công việc nào.</span></li>';
          return;
        }

        // ✅ FIX: Dùng absolute path (bắt đầu bằng /) thay vì relative path
        // Điều này đảm bảo link luôn trỏ đúng từ root, không bị lặp /pages/
        const basePath = "/pages/job_detail.html";
        const recruitPath = "/pages/recruit.html";

        const html = response.items
          .map((item) => {
            const { title, slug } = item.fields;
            return `
            <li>
              <a href="${basePath}?slug=${slug}" title="${title}">
                ${title}
              </a>
            </li>
          `;
          })
          .join("");

        const viewAllLink = `
          <li>
            <a href="${recruitPath}" style="font-weight: 600; color: #d32f2f; background-color: #fafafa; text-align: center;">
              Xem tất cả công việc &rarr;
            </a>
          </li>
        `;

        dropdownList.innerHTML = html + viewAllLink;
      } catch (error) {
        console.error("Lỗi tải dropdown:", error);
        dropdownList.innerHTML =
          '<li><a href="#">Không thể tải dữ liệu</a></li>';
      }
    },

    // --- XỬ LÝ HERO SLIDER ---
    handleSlider: function () {
      if (document.querySelectorAll(".hero-slide").length === 0) return;

      const slides = document.querySelectorAll(".hero-slide");
      const dotsContainer = document.querySelector(".slider-dots");
      const prevBtn = document.querySelector(".slider-arrow-prev");
      const nextBtn = document.querySelector(".slider-arrow-next");
      let sliderInterval;

      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        slides.forEach((_, index) => {
          const dot = document.createElement("button");
          dot.classList.add("slider-dot");
          if (index === 0) dot.classList.add("active");
          dot.dataset.slide = index;
          dot.addEventListener("click", () => showSlide(index));
          dotsContainer.appendChild(dot);
        });
      }

      const dots = document.querySelectorAll(".slider-dot");
      let currentIndex = 0;

      function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        slides.forEach((s, i) =>
          s.classList.toggle("active", i === currentIndex)
        );
        dots.forEach((d, i) =>
          d.classList.toggle("active", i === currentIndex)
        );
      }

      if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        if (prevBtn.parentNode)
          prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener("click", () => {
          showSlide(currentIndex - 1);
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        if (nextBtn.parentNode)
          nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener("click", () => {
          showSlide(currentIndex + 1);
          resetAutoPlay();
        });
      }

      function startAutoPlay() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
      }

      function resetAutoPlay() {
        clearInterval(sliderInterval);
        startAutoPlay();
      }

      startAutoPlay();

      const sliderSection = document.querySelector(CONFIG.selectors.slider);
      if (sliderSection) {
        sliderSection.addEventListener("mouseenter", () =>
          clearInterval(sliderInterval)
        );
        sliderSection.addEventListener("mouseleave", startAutoPlay);
      }
    },

    // --- XỬ LÝ HIỆU ỨNG CUỘN ---
    handleScrollAnimations: function () {
      const targets = document.querySelectorAll(
        ".service-item, .why-card, .map-card"
      );
      if (targets.length === 0) return;

      if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("in-view"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      targets.forEach((el) => observer.observe(el));
    },

    // --- XỬ LÝ SỐ ĐẾM (About) ---
    handleAboutCounters: function () {
      const aboutSection = document.querySelector(".about-section");
      const counters = document.querySelectorAll(".about-stat-number");
      if (!aboutSection || counters.length === 0) return;

      let animated = false;

      const runAnimation = () => {
        if (animated) return;
        animated = true;
        counters.forEach((counter) => {
          const target = +counter.dataset.target;
          const duration = 1500;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
          }
          requestAnimationFrame(update);
        });
      };

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              aboutSection.classList.add("in-view");
              runAnimation();
              observer.disconnect();
            }
          },
          { threshold: 0.3 }
        );
        observer.observe(aboutSection);
      } else {
        aboutSection.classList.add("in-view");
        runAnimation();
      }
    },

    // --- XỬ LÝ FORM ---
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
        const fullName = formData.get("fullName")
          ? formData.get("fullName").trim()
          : "";
        const email = formData.get("email") ? formData.get("email").trim() : "";
        const service = formData.get("service");

        if (!fullName || !email || !service) {
          if (statusEl) {
            statusEl.style.color = "#EF4444";
            statusEl.textContent = "Vui lòng điền đầy đủ thông tin bắt buộc.";
          }
          return;
        }

        if (statusEl) {
          statusEl.style.color = "#10B981";
          statusEl.textContent = "Gửi thành công! Chúng tôi sẽ liên hệ sớm.";
        }
        form.reset();
      });
    },

    // --- SMOOTH SCROLL ---
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
