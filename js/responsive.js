// ============================================================
// responsive.js
// Handles all mobile-responsive interactivity (burger menu, etc).
// Future sections' mobile-only JS logic will also live here.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* ---------------- Mobile burger menu ---------------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!burgerBtn) {
    console.warn("[responsive.js] #burgerBtn not found in DOM — check the id in your HTML.");
    return;
  }
  if (!mobileMenu) {
    console.warn("[responsive.js] #mobileMenu not found in DOM — check the id in your HTML.");
    return;
  }

  console.log("[responsive.js] burger menu initialized successfully.");

  const openMenu = () => {
    mobileMenu.classList.add("is-open");
    burgerBtn.classList.add("is-active");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("is-open");
    burgerBtn.classList.remove("is-active");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    console.log("[responsive.js] burger clicked. currently open:", isOpen, "-> toggling to:", !isOpen);
    isOpen ? closeMenu() : openMenu();
  };

  burgerBtn.addEventListener("click", toggleMenu);

    mobileMenu.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  mobileMenu.querySelectorAll("[data-menu-close]").forEach((el) => {
    el.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMenu();
  });

  // ---------------- (future) other sections' mobile JS ----------------
});