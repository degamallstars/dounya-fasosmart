// sw.js
const CACHE_NAME = 'fasosmart-v1';
const STATIC_URLS = [
  '/',
  '/index.html',
  '/artisans.html',
  '/fonctionnement.html',
  '/global.js',
  '/animations.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // We use addAll but wrap in try/catch to ensure missing files don't fail the whole install
        return Promise.all(
          STATIC_URLS.map(url => {
            return cache.add(url).catch(reason => {
              console.warn('Cache add failed for', url, reason);
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  // Cache First for static assets and images, Network Second. 
  // Network First for HTML to ensure latest content.
  if (event.request.destination === 'image' || event.request.url.includes('.css') || event.request.url.includes('.js')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Network First strategy for HTML
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // If not in cache, returning undefined causes the Safari error "Returned response is null".
          // We must return a valid Response object.
          return new Response('Contenu indisponible hors ligne.', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
    );
  }
});
