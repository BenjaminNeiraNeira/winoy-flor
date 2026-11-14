/* ==========================================================================
   theme.js - light / dark toggle in the navigation bar.
   - The default theme is always light.
   - The dark theme is only turned on with this button (it adds
     data-theme="dark" to <html>). The choice is remembered in localStorage.
   - index.html restores the saved choice before the page is painted.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  if (!button) {
    return;
  }

  var icon = button.querySelector('.icon');
  var label = button.querySelector('.toggle-text');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* The theme that is being shown right now */
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  /* Updates the button so it always offers the opposite theme */
  function render() {
    var dark = currentTheme() === 'dark';
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    if (icon) {
      icon.textContent = dark ? '☀️' : '🌙';
    }
    if (label) {
      label.textContent = dark ? 'Light' : 'Dark';
    }
  }

  button.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';

    // Short color fade while the theme changes
    if (!reduceMotion) {
      root.classList.add('theme-anim');
      window.setTimeout(function () {
        root.classList.remove('theme-anim');
      }, 500);
    }

    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('winoy-theme', next);
    } catch (error) {
      /* storage not available: the choice only lasts until the page is closed */
    }
    render();
  });

  render();
})();
