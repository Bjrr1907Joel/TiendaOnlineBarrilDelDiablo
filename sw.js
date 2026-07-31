const CACHE_NAME = "barril-diablo-v4";

const ASSETS = [
  "./",
  "./index.html",
  "./tienda.html",
  "./css/estilos.css",
  "./css/animaciones.css",
  "./css/tienda.css",
  "./js/app.js",
  "./js/pagos.js",
  "./js/redes.js",
  "./js/delivery.js",
  "./js/tragos.js",
  "./js/productos.js",
  "./js/tienda.js",
  "./img/logo.png",
  "./img/qr_pago.jpeg",
  "./img/yape.png",
  "./img/plin.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
