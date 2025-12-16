// ============= CONTACT FAB (ZALO, PHONE, EMAIL - ALL IN ONE) =============

(function () {
  "use strict";

  // Đợi DOM load xong
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactFab);
  } else {
    initContactFab();
  }

  function initContactFab() {
    // --- PHẦN 1: CẤU HÌNH THÔNG TIN (SỬA Ở ĐÂY LÀ ĂN HẾT) ---
    const CONTACT_INFO = {
      zalo: "0909908353",
      phoneDisplay: "090 990 8353",
      phoneCall: "0909908353",
      email: "sadakahr.text@gmail.com",
    };

    // --- PHẦN 2: TỰ ĐỘNG CẬP NHẬT LINK TRONG MENU ---
    const fabPanel = document.querySelector(".fab-panel");

    if (fabPanel) {
      // 1. Cập nhật Zalo
      const zaloLink = fabPanel.querySelector('a[href*="zalo.me"]');
      if (zaloLink) {
        zaloLink.href = `https://zalo.me/${CONTACT_INFO.zalo}`;
      }

      // 2. Cập nhật Email
      const mailLink = fabPanel.querySelector('a[href^="mailto:"]');
      if (mailLink) {
        mailLink.href = `mailto:${CONTACT_INFO.email}`;
      }

      // 3. Cập nhật Số điện thoại (Hotline)
      const phoneLink = fabPanel.querySelector('a[href^="tel:"]');
      if (phoneLink) {
        phoneLink.href = `tel:${CONTACT_INFO.phoneCall}`;

        // Cập nhật text hiển thị số điện thoại
        const phoneText = phoneLink.querySelector(".item-text");
        if (phoneText) {
          phoneText.textContent = `GỌI NGAY: ${CONTACT_INFO.phoneDisplay}`;
        }
      }
    }

    // --- PHẦN 3: XỬ LÝ ĐÓNG/MỞ MENU ---
    const root = document.querySelector(".contact-fab");
    if (!root) {
      console.warn("Contact FAB not found");
      return;
    }

    const btn = root.querySelector(".fab-btn");
    const panel = root.querySelector(".fab-panel");
    const closeBtn = root.querySelector(".panel-close");

    if (!btn || !panel) {
      console.warn("FAB button or panel not found");
      return;
    }

    const open = () => {
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
    };

    const close = () => {
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    };

    const toggle = () => {
      if (root.classList.contains("is-open")) {
        close();
      } else {
        open();
      }
    };

    // Sự kiện Click nút chính
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
      console.log("FAB clicked, is-open:", root.classList.contains("is-open"));
    });

    // Sự kiện nút đóng (X)
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        close();
      });
    }

    // Click ra ngoài thì đóng
    document.addEventListener("click", (e) => {
      if (!root.classList.contains("is-open")) return;
      if (!root.contains(e.target)) {
        close();
      }
    });

    // Nhấn ESC thì đóng
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && root.classList.contains("is-open")) {
        close();
      }
    });

    console.log("Contact FAB initialized successfully");
  }
})();
