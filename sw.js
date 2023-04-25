self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('game-store-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/static/js/bundle.js',
          '/static/js/main.chunk.js',
          '/static/js/vendors~main.chunk.js',
          '/manifest.json',
          '/logo192.png',
          '/logo512.png',
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
  