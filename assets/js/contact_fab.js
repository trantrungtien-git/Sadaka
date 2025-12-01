// ============= CONTACT FAB =============

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".contact-fab");
  if (!root) return;

  const btn = root.querySelector(".fab-btn");
  const panel = root.querySelector(".fab-panel");
  const closeBtn = root.querySelector(".panel-close");

  if (!btn || !panel) return;

  const open = () => root.classList.add("is-open");
  const close = () => root.classList.remove("is-open");
  const toggle = () => root.classList.toggle("is-open");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  // click ra ngoài để đóng
  document.addEventListener("click", (e) => {
    if (!root.classList.contains("is-open")) return;
    if (!root.contains(e.target)) close();
  });

  // ESC để đóng
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
