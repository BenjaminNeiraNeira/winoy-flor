# Wiñoy Flor

Website of **Wiñoy Flor – Festival of the New Sun and the Flowers**, a fictional binational festival
(Medellín, Colombia and Temuco, Chile) created for a COIL project between Colombia and Chile.

> **Authors:** Group 5 of the COIL project between Chile and Colombia.
>
> The festival is fictional. It is inspired by two real celebrations: the Feria de las Flores (Colombia)
> and We Tripantu (Chile). The images were generated with artificial intelligence.

## Project structure

```
index.html            Main page (all the festival information)
css/
  variables.css       Colors and design tokens (light and dark mode)
  base.css            Reset, typography and layout
  components.css      Hero, navigation, cards and footer
  sections.css        Fact sheet, timeline, dishes, accordion, practices, sources
  footer.css          Credits footer: columns, venue map and share menu
  animations.css      Sun, petals and leaves, scroll reveal and hover effects
js/
  theme.js            Light / dark toggle in the navigation bar (remembers the choice)
  main.js             Active navigation link and scroll reveal
  effects.js          Progress bar, back-to-top button and count-up numbers
  map.js              Interactive venue map with a Colombia / Chile switch
  share.js            Share button, QR code, copy link and native share
assets/
  images/             Festival images (optimized JPEG files)
  icons/              Favicon
  vendor/
    leaflet/          Leaflet 1.9.4 (BSD-2-Clause), interactive maps
    qrcode/           qrcode-generator 1.4.4 (MIT), QR codes
```

## Themes

The page follows the system theme (light or dark). The button at the end of the navigation bar switches
between both, and the choice is saved in the browser (`localStorage`, key `winoy-theme`). Colors live in
`css/variables.css`.

## Map and QR code

- The map uses [Leaflet](https://leafletjs.com/) with OpenStreetMap tiles (© OpenStreetMap contributors).
  The tiles need an internet connection.
- The QR code is drawn in the browser. The address it opens is written in the
  `data-share-url` attribute of the `.share` element in `index.html`. For now it points to this page;
  when the infographic is ready, replace it with the infographic address.

## Page sections

About · Facts · Program · Food & drinks · Culture · Respect · Sustainability · Future implementations · Sources · Credits

The contributions from our partners in Colombia (guarapo, ruana, Feria de Cali, sancocho, lulada, champús, salsa) are inside Food & drinks, Culture and Respect.

## Run it locally

Open `index.html` in a browser, or use the Live Server extension in Visual Studio Code.

## Publishing

After changing a CSS or JavaScript file, raise the number in the `?v=6` part of its link in `index.html`
(for example `?v=7`). This makes browsers download the new file instead of showing an old cached copy.
If a script does not run, a safety net in `<head>` shows all the content after 2.5 seconds.


The site is meant to be published with GitHub Pages from the `main` branch.
