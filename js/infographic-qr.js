/* ==========================================================================
   infographic-qr.js - draws the QR code of the credits ("Read the infographic").
   Every element with data-qr-url gets a QR code (an SVG) that opens that address.
   Uses the qrcode library already loaded by index.html.
   ========================================================================== */

(function () {
  'use strict';

  var boxes = document.querySelectorAll('[data-qr-url]');
  if (!boxes.length) {
    return;
  }

  boxes.forEach(function (box) {
    var url = (box.getAttribute('data-qr-url') || '').trim();
    if (!url || typeof qrcode !== 'function') {
      box.textContent = 'QR code not available';
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
    svg.setAttribute('aria-label', 'QR code that opens the infographic: ' + url);

    var bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', size);
    bg.setAttribute('height', size);
    bg.setAttribute('fill', '#ffffff');

    var modules = document.createElementNS(ns, 'path');
    modules.setAttribute('d', path);
    modules.setAttribute('fill', '#1b4d28');

    svg.appendChild(bg);
    svg.appendChild(modules);
    box.textContent = '';
    box.appendChild(svg);
  });
})();
