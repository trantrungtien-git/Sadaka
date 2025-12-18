/**
 * MOBILE MENU HANDLER
 * Xử lý hamburger menu cho mobile
 */

(function () {
  "use strict";

  // Chờ DOM load xong
  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
  });

  function initMobileMenu() {
    // Tạo nút hamburger và overlay
    createMobileElements();

    // Lấy các elements
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const navbarHeader = document.querySelector(".navbar-header");
    const overlay = document.querySelector(".mobile-menu-overlay");
    const dropdownToggles = document.querySelectorAll(".has-dropdown");

    if (!menuToggle || !navbarHeader) return;

    // Toggle menu khi click hamburger
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Đóng menu khi click overlay
    if (overlay) {
      overlay.addEventListener("click", function () {
        closeMenu();
      });
    }

    // Xử lý dropdown trong mobile menu
    dropdownToggles.forEach(function (item) {
      const toggle = item.querySelector(".dropdown-toggle");
      if (toggle) {
        // Clone để xóa event listeners cũ
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        newToggle.addEventListener("click", function (e) {
          // Chỉ xử lý toggle trên mobile
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle class active
            item.classList.toggle("active");

            // Đóng các dropdown khác
            dropdownToggles.forEach(function (otherItem) {
              if (otherItem !== item) {
                otherItem.classList.remove("active");
              }
            });
          }
        });
      }
    });

    // Đóng menu khi click vào link (trừ dropdown toggle)
    const navLinks = navbarHeader.querySelectorAll("a:not(.dropdown-toggle)");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // Đóng menu khi resize về desktop
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 768) {
          closeMenu();
          // Reset dropdown states
          dropdownToggles.forEach(function (item) {
            item.classList.remove("active");
          });
        }
      }, 250);
    });

    // Ngăn scroll khi menu mở
    function toggleMenu() {
      menuToggle.classList.toggle("active");
      navbarHeader.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");

      // Toggle body scroll
      if (navbarHeader.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    function closeMenu() {
      menuToggle.classList.remove("active");
      navbarHeader.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";

      // Reset dropdown states
      dropdownToggles.forEach(function (item) {
        item.classList.remove("active");
      });
    }
  }

  function createMobileElements() {
    // Tạo nút hamburger
    const header = document.getElementById("main-header");
    if (!header) return;

    // Kiểm tra xem đã có hamburger chưa
    if (header.querySelector(".mobile-menu-toggle")) return;

    // Tạo hamburger button
    const hamburger = document.createElement("button");
    hamburger.className = "mobile-menu-toggle";
    hamburger.setAttribute("aria-label", "Toggle menu");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    // Thêm hamburger sau logo
    const logoLink = header.querySelector(".logo-link");
    if (logoLink && logoLink.nextSibling) {
      header.insertBefore(hamburger, logoLink.nextSibling);
    }

    // Tạo overlay
    if (!document.querySelector(".mobile-menu-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "mobile-menu-overlay";
      document.body.appendChild(overlay);
    }
  }
})();
