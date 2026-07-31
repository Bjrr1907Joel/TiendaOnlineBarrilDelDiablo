const CACHE_NAME = "barril-diablo-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/estilos.css",
  "./css/animaciones.css",
  "./js/app.js",
  "./js/pagos.js",
  "./js/redes.js",
  "./js/delivery.js",
  "./js/tragos.js",
  "./img/logo.png",
  "./img/qr_pago.jpeg",
  "./img/yape.png",
  "./img/plin.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
