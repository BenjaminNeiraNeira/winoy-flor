/* ==========================================================================
   main.js - highlights the navigation link of the section being viewed.
   Plain JavaScript, no libraries. The page works without it.
   ========================================================================== */

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
