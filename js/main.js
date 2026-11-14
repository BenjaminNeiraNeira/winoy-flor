/* ==========================================================================
   main.js
   1. Highlights the navigation link of the section being viewed.
   2. Reveals elements marked with data-reveal while scrolling.
   Plain JavaScript, no libraries. The page content stays visible without it.
   ========================================================================== */

/* ---- 1. Active navigation link ---- */
(function () {
  'use strict';

  var links = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  links.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (section) {
      observer.observe(section);
    }
  });
})();

/* ---- 2. Scroll reveal ---- */
(function () {
  'use strict';

  // Tells index.html that this script is running (see the safety net in <head>)
  document.documentElement.classList.add('reveal-ready');

  var items = document.querySelectorAll('[data-reveal]');
  if (!items.length) {
    return;
  }

  // Without IntersectionObserver, just show everything.
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (item) {
      item.classList.add('is-visible');
    });
    return;
  }

  var revealer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (item) {
    revealer.observe(item);
  });
})();
