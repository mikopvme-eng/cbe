// Cache names
const CACHE_NAME = 'cbe-banking-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/CLOGO.png',
  '/cbe-logo.png',
  '/qr-code.png',
  '/cbe-stamp.png',
  '/app-logo.png',
  '/floating-icon.png',
  '/worldcbe.jpg',
  '/qr-receipt.jpg',
  '/icon-512x512-maskable.jpg',
  '/screenshot-1.jpg',
  '/screenshot-2.jpg',
];

// Install event - cache static assets robustly
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) => {
          return fetch(url).then((response) => {
            if (response.ok) {
              return cache.put(url, response);
            }
            console.warn(`Service Worker: Failed to fetch ${url} for caching.`);
          }).catch((error) => {
            console.warn(`Service Worker: Failed to cache ${url}`, error);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        return caches.match(event.request);
      });
    })
  );
});

// ✅ KEEP — message handler (safe, no caching)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
