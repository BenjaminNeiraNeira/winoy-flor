/* ==========================================================================
   effects.js
   1. Scroll progress bar at the top of the page.
   2. "Back to top" button.
   3. Navigation bar look: compact at the top, spread out after scrolling.
   4. Count-up numbers (elements with data-count).
   Plain JavaScript, no libraries. The page works without it.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1 and 2. Progress bar + back to top ---- */
  var bar = document.querySelector('.progress');
  var toTop = document.querySelector('.to-top');
  var nav = document.querySelector('.main-nav');
  var ticking = false;

  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? window.scrollY / max : 0;
    if (bar) {
      bar.style.setProperty('--p', progress.toFixed(4));
    }
    if (toTop) {
      toTop.classList.toggle('show', window.scrollY > 600);
    }
    // Navigation bar: compact at the top of the page, spread out after scrolling.
    // Two different limits (70 and 25 px) avoid flickering near the border.
    if (nav) {
      if (window.scrollY > 70) {
        nav.classList.add('is-scrolled');
      } else if (window.scrollY < 25) {
        nav.classList.remove('is-scrolled');
      }
    }
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- 3. Count-up numbers ---- */
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) {
    return; // the final numbers are already written in the HTML
  }

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1200;
    var start = null;

    function step(now) {
      if (start === null) {
        start = now;
      }
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) {
        window.requestAnimationFrame(step);
      }
    }

    el.textContent = '0';
    window.requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });
})();
