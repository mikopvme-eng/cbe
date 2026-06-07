// Service Worker - No caching for security
// All data is fetched fresh on every request

// Install event - no caching
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - no cache cleanup needed
self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// Fetch event - no caching, always fetch fresh
self.addEventListener('fetch', (event) => {
  // Always fetch from network, no caching
  event.respondWith(fetch(event.request));
});

// Message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
