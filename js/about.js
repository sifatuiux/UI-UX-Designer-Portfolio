(function () {
  'use strict';

  /* ------ Tabs: switch which card list is visible ------- */

  const tabs = document.querySelectorAll('.tabs-item');
  const panels = document.querySelectorAll('.cards');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== target;
      });
    });
  });

  /* -------- Cards: link / certificate actions -------- */

  const certModal = document.getElementById('certModal');
  const certImg = document.getElementById('certModalImg');
  const certTitle = document.getElementById('certModalTitle');

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const action = card.dataset.action;

      if (action === 'link') {
        // Education / YouTube course / Experience cards go out to their own tab.
        e.preventDefault();
        window.open(card.dataset.href, '_blank', 'noopener');
      }

      if (action === 'certificate') {
        // Course cards backed by a certificate: show a view-only preview.
        certImg.src = card.dataset.cert;
        certTitle.textContent = card.dataset.certTitle || 'Certificate';
        openModal(certModal);
      }
    });

    // Keyboard support for non-anchor cards (buttons already get this for free,
    // this covers the <a> cards too so Enter/Space behave the same everywhere).
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ------- Resume: view + download modal ------- */

  const resumeModal = document.getElementById('resumeModal');
  const viewResumeBtn = document.getElementById('viewResumeBtn');

  viewResumeBtn.addEventListener('click', () => openModal(resumeModal));

  /* ------  Shared modal open/close ------------ */

  let lastFocused = null;

  function openModal(modal) {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', () => closeModal(modal));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.is-open').forEach((modal) => closeModal(modal));
  });
})();