self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('game-store-cache').then((cache) => {
      return cache.addAll([
        '/gamestore/',
        '/gamestore/index.html',
        '/gamestore/static/js/bundle.js',
        '/gamestore/static/js/main.chunk.js',
        '/gamestore/static/js/vendors~main.chunk.js',
        '/gamestore/manifest.json',
        '/gamestore/logo192.png',
        '/gamestore/logo512.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
