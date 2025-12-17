// document.querySelectorAll(".dropdown-toggle").forEach(function (toggle) {
//   toggle.addEventListener("click", function (e) {
//     e.preventDefault();
//     const li = this.parentElement;
//     li.classList.toggle("open");
//   });
// });

// Hero slider functionality
// const slides = document.querySelectorAll(".hero-slide");
// const dots = document.querySelectorAll(".slider-dot");
// const prevBtn = document.querySelector(".slider-arrow-prev");
// const nextBtn = document.querySelector(".slider-arrow-next");

// let currentIndex = 0;

// function showSlide(index) {
//   // Ensure index is within [0, slides.length)
//   if (index < 0) index = slides.length - 1;
//   if (index >= slides.length) index = 0;
//   currentIndex = index;

//   // Toggle active class for slides
//   slides.forEach((slide, i) => {
//     slide.classList.toggle("active", i === currentIndex);
//   });

//   // Toggle active class for dots
//   dots.forEach((dot, i) => {
//     dot.classList.toggle("active", i === currentIndex);
//   });
// }

// prevBtn.addEventListener("click", () => {
//   showSlide(currentIndex - 1);
// });

// nextBtn.addEventListener("click", () => {
//   showSlide(currentIndex + 1);
// });

// dots.forEach((dot) => {
//   dot.addEventListener("click", () => {
//     const slideIndex = Number(dot.dataset.slide);
//     showSlide(slideIndex);
//   });
// });

// // Auto-play functionality
// let autoPlay = setInterval(() => {
//   showSlide(currentIndex + 1);
// }, 7000);

// // Stop autoplay on hover
// document.querySelector(".hero-slider").addEventListener("mouseenter", () => {
//   clearInterval(autoPlay);
// });

// document.querySelector(".hero-slider").addEventListener("mouseleave", () => {
//   autoPlay = setInterval(() => {
//     showSlide(currentIndex + 1);
//   }, 7000);
// });

// ==========================================
// HERO SLIDER FUNCTIONALITY (Đã sửa lại)
// ==========================================

// Khai báo biến toàn cục để quản lý Autoplay
let sliderInterval;

// Đóng gói logic vào hàm initSlider để có thể gọi lại sau khi render dữ liệu
window.initSlider = function () {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.querySelector(".slider-dots");
  const prevBtn = document.querySelector(".slider-arrow-prev");
  const nextBtn = document.querySelector(".slider-arrow-next");

  // 1. Kiểm tra an toàn: Nếu không có slide nào thì dừng luôn
  if (slides.length === 0) return;

  // 2. Tự động tạo Dots dựa trên số lượng slide thực tế
  // (Giúp bạn không phải sửa HTML thủ công khi thêm/bớt slide)
  if (dotsContainer) {
    dotsContainer.innerHTML = ""; // Xóa dots cũ (nếu có)
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      if (index === 0) dot.classList.add("active");
      dot.dataset.slide = index;

      // Thêm sự kiện click cho dot
      dot.addEventListener("click", () => {
        showSlide(index);
      });

      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll(".slider-dot");
  let currentIndex = 0;

  // Hàm hiển thị slide
  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    // Toggle active class for slides
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    // Toggle active class for dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // Sự kiện nút Next / Prev
  // Cần cloneNode để xóa event listener cũ nếu hàm này bị gọi nhiều lần
  if (prevBtn) {
    const newPrev = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    newPrev.addEventListener("click", () => showSlide(currentIndex - 1));
  }

  if (nextBtn) {
    const newNext = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    newNext.addEventListener("click", () => showSlide(currentIndex + 1));
  }

  // 3. Xử lý Auto Play
  function startAutoPlay() {
    clearInterval(sliderInterval); // Xóa interval cũ để tránh chồng chéo
    sliderInterval = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000); // 5 giây đổi 1 lần
  }

  startAutoPlay();

  // Dừng autoplay khi di chuột vào slider
  const sliderSection = document.querySelector(".hero-slider");
  if (sliderSection) {
    sliderSection.addEventListener("mouseenter", () =>
      clearInterval(sliderInterval)
    );
    sliderSection.addEventListener("mouseleave", startAutoPlay);
  }
};

// Tự động chạy thử 1 lần khi trang load (Dành cho trường hợp HTML tĩnh không dùng JS render)
document.addEventListener("DOMContentLoaded", () => {
  // Chỉ chạy nếu tìm thấy slide có sẵn trong HTML
  if (document.querySelectorAll(".hero-slide").length > 0) {
    window.initSlider();
  }
});

// ==== Reveal services on scroll ====
document.addEventListener("DOMContentLoaded", () => {
  const serviceItems = document.querySelectorAll(".service-item");
  const getButtonsEvent = document.querySelectorAll(".service-btn");

  if (!("IntersectionObserver" in window)) {
    serviceItems.forEach((item) => item.classList.add("in-view"));
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
    { threshold: 0.2 }
  );

  getButtonsEvent.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Bấm nút ", btn.innerText);
    });
  });

  serviceItems.forEach((item) => observer.observe(item));
});

document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector(".about-section");
  const counters = document.querySelectorAll(".about-stat-number");

  if (!aboutSection || !counters.length) return;

  let animated = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const duration = 1200; // ms
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value.toString();
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toString();
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Using IntersectionObserver for run in one when scroll
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            aboutSection.classList.add("in-view");
            animateCounters();
            observer.unobserve(aboutSection);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(aboutSection);
  } else {
    aboutSection.classList.add("in-view");
    animateCounters();
  }
});

// ==== Reveal "Why Choose" cards on scroll ====
document.addEventListener("DOMContentLoaded", () => {
  const whyCards = document.querySelectorAll(".why-card");

  if (!whyCards.length) return;

  // Browser cũ: hiện luôn
  if (!("IntersectionObserver" in window)) {
    whyCards.forEach((card) => card.classList.add("in-view"));
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
    { threshold: 0.2 }
  );

  whyCards.forEach((card) => observer.observe(card));
});

// Contact section
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const statusEl = document.getElementById("form-status");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // reset last error
    statusEl.textContent = "";
    const fields = contactForm.querySelectorAll(".form-field");
    fields.forEach((f) => {
      f.classList.remove("has-error");
      const err = f.querySelector(".field-error");
      if (err) err.textContent = "";
    });

    // get value
    const fullName = contactForm.fullName.value.trim();
    const email = contactForm.email.value.trim();
    const service = contactForm.service.value.trim();

    let hasError = false;

    function setError(name, message) {
      const field = contactForm
        .querySelector(`[name="${name}"]`)
        ?.closest(".form-field");
      if (!field) return;
      field.classList.add("has-error");
      const err = field.querySelector(".field-error");
      if (err) err.textContent = message;
      hasError = true;
    }

    if (!fullName) setError("fullName", "Please enter your full name.");
    if (!email) {
      setError("email", "Please enter your email.");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("email", "Please enter a valid email address.");
    }
    if (!service) setError("service", "Please select a service.");

    if (hasError) {
      statusEl.style.color = "#EF4444";
      statusEl.textContent = "Please check the highlighted fields.";
      return;
    }

    // Tới đây là hợp lệ – bạn có thể gọi API/backend ở đây
    // Demo: chỉ hiện thông báo thành công + reset form
    statusEl.style.color = "#10B981";
    statusEl.textContent =
      "Thank you! We have received your information and will contact you soon.";

    contactForm.reset();
  });
});

// ========== CONTACT PAGE ==========
document.addEventListener("DOMContentLoaded", function () {
  const mapCard = document.querySelector(".map-card");
  if (!mapCard || !("IntersectionObserver" in window)) {
    // nếu trình duyệt cũ thì cho hiện luôn
    if (mapCard) mapCard.classList.add("in-view");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mapCard.classList.add("in-view");
          observer.disconnect(); // chỉ chạy 1 lần
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(mapCard);
});

// ============ BLOG PAGE ============
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".cta-btn");
  const target = document.querySelector(".job-content");

  if (!btn || !target) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
