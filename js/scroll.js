/* =================================================================
   SCROLL MOTION — reusable across every section EXCEPT the hero
   (hero has its own reveal.js, synced to the loading screen).
   ================================================================= */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const observed = new WeakSet();

  let observer = null;

  /* ========= GENERIC REVEAL SYSTEM ========== */

  function getObserver() {
    if (observer) return observer;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            'is-visible',
            entry.isIntersecting
          );
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px 150px 0px',
      }
    );

    return observer;
  }


  /* ========== SERVICES — SECTION-SPECIFIC MOTION ============ */

  let servicesObserver = null;

  function initServicesMotion() {

    const services = document.querySelector('.services');

    if (!services) return;


    const serviceItems = services.querySelectorAll(
      '.service-item'
    );

    if (!serviceItems.length) return;


    /* ----------- Reduced motion / unsupported browser ------------ */

    if (
      prefersReduced ||
      !('IntersectionObserver' in window)
    ) {
      services.classList.add('is-motion-visible');
      return;
    }


    /* ----------- Add stagger delay to each service row ----------- */

    serviceItems.forEach((item, index) => {

      item.style.setProperty(
        '--service-motion-delay',
        `${index * 90}ms`
      );

    });


    /* ----------- Prevent duplicate observer ------------ */

    if (servicesObserver) return;


    /* ------------ Observe Services section -------------- */

    servicesObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            services.classList.add(
              'is-motion-visible'
            );

          } else {

            services.classList.remove(
              'is-motion-visible'
            );

          }

        });

      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -5% 0px'
      }
    );


    servicesObserver.observe(services);

  }


  /* ========= TESTIMONIALS — STAT COUNT-UP =========== */

  const statAnimFrames = new WeakMap();
  let statsObserver = null;

  function setStatText(el, value) {
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const suffix = el.dataset.countSuffix || '';
    el.textContent = value.toFixed(decimals) + suffix;
  }

  function animateStatCount(el) {
    const target = parseFloat(el.dataset.countTo);
    if (isNaN(target)) return;

    if (statAnimFrames.has(el)) {
      cancelAnimationFrame(statAnimFrames.get(el));
    }

    const duration = 850; 
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      setStatText(el, target * progress);

      if (progress < 1) {
        statAnimFrames.set(el, requestAnimationFrame(tick));
      } else {
        setStatText(el, target); 
        statAnimFrames.delete(el);
      }
    }

    statAnimFrames.set(el, requestAnimationFrame(tick));
  }

  function initTestimonialStats() {

    const statNums = document.querySelectorAll(
      '.testimonials-stat .stat-nums'
    );

    if (!statNums.length) return;


    /* ---------------------------------------------------------
       Reduced motion / unsupported browser: show final value
       instantly, no counting animation, no reset-on-scroll-out.
       --------------------------------------------------------- */

    if (
      prefersReduced ||
      !('IntersectionObserver' in window)
    ) {
      statNums.forEach((el) => {
        const target = parseFloat(el.dataset.countTo);
        if (isNaN(target)) return;
        setStatText(el, target);
      });
      return;
    }


    if (!statsObserver) {
      statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              animateStatCount(entry.target);

            } else {

              if (statAnimFrames.has(entry.target)) {
                cancelAnimationFrame(statAnimFrames.get(entry.target));
                statAnimFrames.delete(entry.target);
              }
              setStatText(entry.target, 0);

            }

          });
        },
        {
          threshold: 0.4,
        }
      );
    }

    statNums.forEach((el) => {
      statsObserver.observe(el);
    });

  }


  /* ========== ABOUT — TAB CARD MOTION ========= */

  let aboutEntryObserver = null;
  let aboutMutationObserver = null;
  const aboutEntryPlayed = new WeakSet();

  function playCardPop(panel) {
    if (!panel) return;

    const cards = Array.from(panel.querySelectorAll('.card-pop'));

    if (!cards.length) return;

    // reset all cards first
    cards.forEach((card, index) => {
      card.classList.remove('is-shown');
      card.style.setProperty('--card-pop-delay', `${index * 90}ms`);
    });

    void panel.offsetWidth;

    requestAnimationFrame(() => {
      cards.forEach((card) => {
        card.classList.add('is-shown');
      });
    });
  }

  function initAboutMotion() {

    const about = document.querySelector('.about');

    if (!about) return;


    const panels = about.querySelectorAll('.cards');

    if (!panels.length) return;


    /* -------- First-time scroll entrance for the default active panel ------------ */

    if (!aboutEntryObserver) {

      if (
        prefersReduced ||
        !('IntersectionObserver' in window)
      ) {

        playCardPop(about.querySelector('.cards:not([hidden])'));

      } else {

        aboutEntryObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                !aboutEntryPlayed.has(about)
              ) {
                aboutEntryPlayed.add(about);
                playCardPop(about.querySelector('.cards:not([hidden])'));
                aboutEntryObserver.unobserve(about);
              }
            });
          },
          {
            threshold: 0.2,
          }
        );

        aboutEntryObserver.observe(about);

      }

    }


    /* ------- Re-play whenever a tab switch reveals a different panel ---------- */

    if (
      !aboutMutationObserver &&
      'MutationObserver' in window
    ) {

      aboutMutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName !== 'hidden') return;

          const panel = mutation.target;

          if (panel.hidden) return; // only animate the panel that just became visible

          playCardPop(panel);
        });
      });

      panels.forEach((panel) => {
        aboutMutationObserver.observe(panel, {
          attributes: true,
          attributeFilter: ['hidden'],
        });
      });

    }

  }


  /* ============  REFRESH =========== */

  function refresh() {

    /* ========== Hero's .reveal elements are owned by reveal.js. ========== */

    const targets = Array.from(
      document.querySelectorAll('.reveal')
    ).filter(
      (el) => !el.closest('.hero')
    );


    /* ========== No motion support / user prefers none: just show generic reveal elements. ========== */

    if (
      prefersReduced ||
      !('IntersectionObserver' in window)
    ) {

      targets.forEach((el) => {
        el.classList.add('is-visible');
      });

    } else {

      const io = getObserver();

      targets.forEach((el) => {

        if (observed.has(el)) return;

        observed.add(el);

        io.observe(el);

      });

    }


    /* ---------------- Services-specific motion --------------- */

    initServicesMotion();


    /* ---------------- Testimonials stat count-up --------------- */

    initTestimonialStats();


    /* -------------  About tab card motion ---------------- */

    initAboutMotion();

  }


  /* ========= PUBLIC API =============== */

  window.ScrollMotion = {
    refresh
  };


  /* ============  INITIALIZE  ================ */

  document.addEventListener(
    'DOMContentLoaded',
    refresh
  );

})();