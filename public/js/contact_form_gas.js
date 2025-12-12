// contact_form_gas.js - Xử lý form với Google Apps Script

// ====== CẤU HÌNH GOOGLE APPS SCRIPT ======
const GAS_CONFIG = {
  WEB_APP_URL:
    "https://script.google.com/macros/s/AKfycbzPd498Bp_t30HnHn9q6-3faImSb5yiG3Agf0Ethcuc8QOx3NUCTy8LYXk-Rrgc_t-GFQ/exec",
  // ↑ THAY bằng Web App URL của bạn
};

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  // Hàm validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Hàm validate số điện thoại
  function isValidPhone(phone) {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  // Hàm hiển thị lỗi
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.parentElement.querySelector(".field-error");
    field.classList.add("error");
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
    }
  }

  // Hàm xóa lỗi
  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.parentElement.querySelector(".field-error");
    field.classList.remove("error");
    if (errorSpan) {
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
    }
  }

  // Xóa lỗi khi user nhập
  ["fullName", "email", "phone", "service", "message"].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", () => clearFieldError(fieldId));
      field.addEventListener("change", () => clearFieldError(fieldId));
    }
  });

  // Hàm validate form
  function validateForm(formData) {
    let isValid = true;

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      showFieldError("fullName", "Vui lòng nhập họ và tên (ít nhất 2 ký tự)");
      isValid = false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      showFieldError("email", "Vui lòng nhập địa chỉ email hợp lệ");
      isValid = false;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      showFieldError("phone", "Số điện thoại không hợp lệ");
      isValid = false;
    }

    if (!formData.service) {
      showFieldError("service", "Vui lòng chọn dịch vụ bạn quan tâm");
      isValid = false;
    }

    return isValid;
  }

  // Hàm hiển thị trạng thái
  function showStatus(message, type = "info") {
    formStatus.textContent = message;
    formStatus.className = "form-status " + type;
    formStatus.style.display = "block";
  }

  // Hàm gửi data đến Google Apps Script
  async function sendToGoogleScript(formData) {
    const response = await fetch(GAS_CONFIG.WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // Quan trọng cho Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Với mode: 'no-cors', không thể đọc response
    // Nhưng request vẫn được gửi và xử lý thành công
    return { success: true };
  }

  // Xử lý submit form
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Lấy dữ liệu form
    const formData = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      service: document.getElementById("service").value,
      message: document.getElementById("message").value.trim(),
    };

    // Validate
    if (!validateForm(formData)) {
      showStatus("Vui lòng kiểm tra lại thông tin!", "error");
      return;
    }

    // Disable nút submit
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="material-icons">hourglass_empty</span><span>Đang gửi...</span>';

    try {
      showStatus("Đang gửi thông tin...", "info");

      // Gửi đến Google Apps Script
      await sendToGoogleScript(formData);

      console.log("✅ Đã gửi data đến Google Apps Script");

      // Lưu vào localStorage để backup
      try {
        const contacts = JSON.parse(
          localStorage.getItem("sadaka_contacts") || "[]"
        );
        contacts.push({
          ...formData,
          timestamp: new Date().toISOString(),
          id: Date.now(),
        });
        localStorage.setItem("sadaka_contacts", JSON.stringify(contacts));
      } catch (e) {
        console.warn("Không thể lưu vào localStorage:", e);
      }

      // Hiển thị thông báo thành công
      showStatus(
        "✅ Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24h.",
        "success"
      );

      // Reset form sau 3 giây
      setTimeout(() => {
        contactForm.reset();
        formStatus.style.display = "none";
      }, 3000);
    } catch (error) {
      console.error("❌ Lỗi khi gửi:", error);
      showStatus(
        "❌ Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp: 090 990 8353",
        "error"
      );
    } finally {
      // Enable lại nút submit
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Debug functions
  window.viewSavedContacts = function () {
    const contacts = JSON.parse(
      localStorage.getItem("sadaka_contacts") || "[]"
    );
    console.table(contacts);
    return contacts;
  };
});
