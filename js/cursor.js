

(function () {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!supportsHover) return; // mobile/touch: keep the native cursor, do nothing

  document.documentElement.classList.add("has-custom-cursor");

  const dot = document.createElement("div");
  dot.className = "cursor-dot";

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.innerHTML = `
    <span class="cursor-label">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C12 6.6 6.6 12 0 12C6.6 12 12 17.4 12 24C12 17.4 17.4 12 24 12C17.4 12 12 6.6 12 0Z"/>
      </svg>
    </span>`;

  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  const EASE = 0.15; // lower = more trailing lag, higher = snappier

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * EASE;
    ringY += (mouseY - ringY) * EASE;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();


  // one single target list.
  const HOVER_TARGETS = "a, button, .service-item, .process-card, .logo-marquee, .testimonial-card, .site-footer, .cs-stat, .cs-process-item, .cs-finding-item, .cs-compare-table, .cs-persona-block, .cs-empathy-block, .cs-typography-card, .cs-colors-card, .cs-lessons-item, .footer-contact-item, .hero-image, .work-image, .process-image, .about-photo, .cs-hero-image, .cs-problem-graphic, .cs-solution-image, .cs-persona-image, .cs-empathy-image, .cs-wireframe-wrap, .cs-ui-screen";

  // ---- Event delegation: works for elements that exist now AND
  // elements added later by works.js / services.js (cards, modal, etc.) ----
  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(HOVER_TARGETS);
    if (target) {
      ring.classList.add("is-hover");
      dot.classList.add("is-hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target.closest(HOVER_TARGETS);
    if (!target) return;

    // only remove the hover state once we've fully left the zone
    // (handles nested elements, e.g. an <img> inside a .work-image)
    const stillInside = e.relatedTarget && e.relatedTarget.closest?.(HOVER_TARGETS);
    if (!stillInside) {
      ring.classList.remove("is-hover");
      dot.classList.remove("is-hover");
    }
  });

  // hide the cursor entirely when it leaves the browser window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
})();