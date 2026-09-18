/* =================================================================
   CASE STUDY MOTION — scroll reveal for the case study page
   Same reveal system/style as the homepage (reveal.js + scroll.js):
   watches every .reveal element and toggles .is-visible as it
   enters/leaves the viewport, so the motion replays both ways
   (scroll down = animate in, scroll back up = animate out and
   replays when it re-enters).

   The case study page has no loading screen, so — unlike the
   homepage hero — there's no need to wait for a loaderComplete
   event before observing. Above-the-fold elements (hero title,
   hero image) simply animate in as soon as the page loads.
   ================================================================= */
(function () {
  'use strict';

  function initCaseStudyReveal() {
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

  document.addEventListener('DOMContentLoaded', initCaseStudyReveal);
})();