/* ==========================================================================
   share.js - "Share" button with a menu that shows a QR code.
   The QR code opens the address written in data-share-url (the festival
   page for now; it can be changed to the infographic later). If the
   attribute is empty, the address of the current page is used.
   ========================================================================== */

(function () {
  'use strict';

  var wrap = document.querySelector('.share');
  if (!wrap) {
    return;
  }

  var button = wrap.querySelector('.share-btn');
  var menu = document.getElementById('share-menu');
  var qrBox = document.getElementById('share-qr');
  var urlText = document.getElementById('share-url');
  var copyButton = document.getElementById('copy-link');
  var nativeButton = document.getElementById('native-share');
  var status = document.getElementById('share-status');

  var url = (wrap.getAttribute('data-share-url') || '').trim() ||
    (window.location.origin + window.location.pathname);
  var qrDrawn = false;

  function drawQr() {
    if (qrDrawn) {
      return;
    }
    qrDrawn = true;

    if (typeof qrcode !== 'function') {
      qrBox.textContent = 'QR code not available';
      return;
    }

    var qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();

    var count = qr.getModuleCount();
    var quiet = 4;
    var size = count + quiet * 2;
    var path = '';
    for (var row = 0; row < count; row += 1) {
      for (var col = 0; col < count; col += 1) {
        if (qr.isDark(row, col)) {
          path += 'M' + (col + quiet) + ' ' + (row + quiet) + 'h1v1h-1z';
        }
      }
    }

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'QR code that opens ' + url);

    var bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', size);
    bg.setAttribute('height', size);
    bg.setAttribute('fill', '#ffffff');

    var modules = document.createElementNS(ns, 'path');
    modules.setAttribute('d', path);
    modules.setAttribute('fill', '#1b4d28');

    svg.appendChild(bg);
    svg.appendChild(modules);
    qrBox.textContent = '';
    qrBox.appendChild(svg);
  }

  function openMenu() {
    drawQr();
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    status.textContent = '';
  }

  function say(message) {
    status.textContent = message;
  }

  urlText.textContent = url;

  button.addEventListener('click', function () {
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  document.addEventListener('click', function (event) {
    if (!menu.hidden && !wrap.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu();
      button.focus();
    }
  });

  copyButton.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () { say('Link copied!'); },
        function () { say('Could not copy. Select the link above.'); }
      );
      return;
    }
    var helper = document.createElement('textarea');
    helper.value = url;
    helper.setAttribute('readonly', '');
    helper.style.position = 'absolute';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    try {
      say(document.execCommand('copy') ? 'Link copied!' : 'Could not copy. Select the link above.');
    } catch (error) {
      say('Could not copy. Select the link above.');
    }
    document.body.removeChild(helper);
  });

  if (navigator.share) {
    nativeButton.hidden = false;
    nativeButton.addEventListener('click', function () {
      navigator.share({
        title: document.title,
        text: 'Discover ' + document.title + ', a fictional festival between Colombia and Chile.',
        url: url
      }).catch(function () {
        /* the person closed the share sheet: nothing to do */
      });
    });
  }
})();
