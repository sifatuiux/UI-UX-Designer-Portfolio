(function () {
  'use strict';

  /* ================= Contact form → mailto ================= */

  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const descInput = document.getElementById('contactDescription');
  const emailInput = document.getElementById('contactEmail');
  const note = document.getElementById('contactFormNote');
  const DEST_EMAIL = 'ieaminislamsifat12@gmail.com';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const email = emailInput.value.trim();

      if (!name || !description || !email) {
        note.textContent = 'Please fill in your name, project description, and email.';
        note.classList.remove('is-success');
        return;
      }

      // Reconstruct the full sentence exactly as it reads on the page,
      // so the email that arrives is the complete message, not just
      // raw field values.
      const body =
        `Hello Ieamin, myself ${name}\n\n` +
        `and I am looking for someone to help me. I am giving you a short description about my project:\n${description}\n\n` +
        `I am giving you my E-mail address to connect with me.\n${email}`;

      const subject = `New Project Inquiry from ${name}`;

      const mailtoUrl =
        `mailto:${DEST_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      note.textContent = 'Opening your email app…';
      note.classList.add('is-success');

      window.location.href = mailtoUrl;
    });
  }

  /* ================= Auto-grow the description textarea ================= */

  if (descInput) {
    const resize = () => {
      descInput.style.height = 'auto';
      descInput.style.height = `${descInput.scrollHeight}px`;
    };
    descInput.addEventListener('input', resize);
    resize();
  }

  /* ================= Back to top ================= */

  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================= Footer year ================= */

  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

})();