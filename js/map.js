/* ==========================================================================
   map.js - interactive map of the festival venues (Leaflet + OpenStreetMap).
   A switch changes between the Colombia venues and the Chile venues.
   The map is created only when the footer is about to be seen, so the page
   does not download map tiles before they are needed.
   ========================================================================== */

(function () {
  'use strict';

  var mapEl = document.getElementById('venue-map');
  if (!mapEl || !window.L) {
    return;
  }

  /* Venue coordinates (checked against OpenStreetMap) */
  var COUNTRIES = {
    co: {
      pin: '🌺',
      caption: 'Medellín, Colombia: Santa Elena, Botanical Garden and Parque de los Deseos.',
      places: [
        { name: 'Parque de los Deseos', lat: 6.26818, lng: -75.56617, text: 'Venue in Medellín.' },
        { name: 'Botanical Garden', lat: 6.27055, lng: -75.56353, text: 'Venue in Medellín.' },
        { name: 'Santa Elena', lat: 6.21052, lng: -75.49804, text: 'Silletero area and host families.' }
      ]
    },
    cl: {
      pin: '🌲',
      caption: 'Temuco, Chile: Cerro Ñielol and Plaza Teodoro Schmidt.',
      places: [
        { name: 'Plaza Teodoro Schmidt', lat: -38.73576, lng: -72.59043, text: 'Venue in Temuco.' },
        { name: 'Cerro Ñielol', lat: -38.72263, lng: -72.58671, text: 'Venue in Temuco (viewpoint of the hill).' }
      ]
    }
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var switchButtons = document.querySelectorAll('.map-switch button');
  var openLink = document.querySelector('.map-open');
  var caption = document.getElementById('map-caption');
  var map = null;
  var layers = {};
  var current = 'co';

  function boundsOf(key) {
    return L.latLngBounds(COUNTRIES[key].places.map(function (p) {
      return [p.lat, p.lng];
    }));
  }

  function buildLayer(key, country) {
    var group = L.layerGroup();
    country.places.forEach(function (place) {
      var icon = L.divIcon({
        className: 'venue-pin ' + key,
        html: '<span><i>' + country.pin + '</i></span>',
        iconSize: [38, 38],
        iconAnchor: [19, 44],
        popupAnchor: [0, -42]
      });
      var marker = L.marker([place.lat, place.lng], { icon: icon, title: place.name, alt: place.name });
      var box = document.createElement('div');
      var title = document.createElement('h3');
      var text = document.createElement('p');
      title.textContent = place.name;
      text.textContent = place.text;
      box.appendChild(title);
      box.appendChild(text);
      marker.bindPopup(box);
      group.addLayer(marker);
    });
    return group;
  }

  function updateLink(key) {
    var first = COUNTRIES[key].places[0];
    if (openLink) {
      openLink.href = 'https://www.google.com/maps/search/?api=1&query=' + first.lat + ',' + first.lng;
    }
    if (caption) {
      caption.textContent = COUNTRIES[key].caption;
    }
  }

  function show(key, animate) {
    if (!map) {
      return;
    }
    map.closePopup();
    if (layers[current]) {
      map.removeLayer(layers[current]);
    }
    layers[key] = layers[key] || buildLayer(key, COUNTRIES[key]);
    layers[key].addTo(map);
    current = key;
    updateLink(key);

    var options = { paddingTopLeft: [44, 96], paddingBottomRight: [44, 36], maxZoom: 15 };
    if (animate && !reduceMotion) {
      map.flyToBounds(boundsOf(key), Object.assign({ duration: 1.8 }, options));
    } else {
      map.fitBounds(boundsOf(key), options);
    }
  }

  function createMap() {
    if (map) {
      return;
    }
    // Zoom buttons go to the top-right corner, so "Open in Maps" stays visible
    map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: false });
    L.control.zoom({ position: 'topright' }).addTo(map);
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    var warned = false;
    tiles.on('tileerror', function () {
      if (warned) {
        return;
      }
      warned = true;
      var note = document.createElement('div');
      note.className = 'map-error';
      note.textContent = 'The map tiles could not be loaded. Check your internet connection.';
      mapEl.parentNode.appendChild(note);
    });

    show(current, false);
  }

  switchButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var key = button.getAttribute('data-country');
      if (!COUNTRIES[key] || key === current) {
        return;
      }
      switchButtons.forEach(function (other) {
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
      });
      createMap();
      show(key, true);
    });
  });

  updateLink(current);

  if ('IntersectionObserver' in window) {
    var watcher = new IntersectionObserver(
      function (entries, obs) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          createMap();
          obs.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    watcher.observe(mapEl);
  } else {
    createMap();
  }
})();
