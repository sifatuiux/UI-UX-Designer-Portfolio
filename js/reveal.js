/* =================================================================
   SCROLL REVEAL — reusable across the whole site
   Watches every .reveal element and toggles .is-visible as it
   enters/leaves the viewport, so the motion replays both ways
   (scroll down = animate in, scroll back up = animate out and
   replays when it re-enters).

   Waits for the loading screen to finish (loaderComplete event, fired by
   loader.js) before it starts observing. Otherwise above-the-fold sections
   like the hero would finish animating while still hidden behind the
   loader, and appear to "snap" into place instead of animating in.
   ================================================================= */
(function () {
  'use strict';

  let started = false;

  function initReveal() {
    if (started) return;
    started = true;

    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No motion support / user prefers none: just show everything, skip the observer.
    if (!('IntersectionObserver' in window) || prefersReduced) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 150px 0px', // treat anything up to 150px below the fold as already visible
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  const loader = document.getElementById('loader');

  if (loader) {
    window.addEventListener('loaderComplete', initReveal, { once: true });
    // Safety net: start anyway after 4s even if loaderComplete never fires,
    // so reveal never silently fails to run.
    setTimeout(initReveal, 4000);
  } else {
    // No loader on this page at all — nothing to wait for.
    initReveal();
  }
})();