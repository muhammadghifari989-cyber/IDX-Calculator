// IDX Calculator — Service Worker
// Cache version — update ini setiap kali ada perubahan besar
var CACHE_NAME = 'idx-calc-v1';

// File yang di-cache untuk offline
var CACHED_URLS = [
  './',
  './index.html',
  './app.html',
  './manifest.json'
];

// Install: cache file penting
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS).catch(function() {
        // Lanjut meski ada file yang gagal di-cache
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first, fallback ke cache
self.addEventListener('fetch', function(event) {
  // Skip non-GET dan request ke Firebase/Google APIs
  if (event.request.method !== 'GET') return;
  var url = event.request.url;
  if (url.includes('googleapis.com') || url.includes('gstatic.com') || url.includes('firebaseio.com') || url.includes('firestore.googleapis.com')) return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Cache respons yang berhasil
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        // Offline: ambil dari cache
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('./index.html');
        });
      })
  );
});
