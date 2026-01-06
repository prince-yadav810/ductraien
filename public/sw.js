// Service Worker with Network-First Strategy for better updates
// Update this version number on each deploy to force cache refresh
const CACHE_VERSION = 'v2-' + Date.now();
const CACHE_NAME = 'ductraien-' + CACHE_VERSION;

// Static assets to cache (only icons/images)
const STATIC_CACHE = [
    '/icon-192.png',
    '/icon-512.png',
    '/logo.png'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing new version:', CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE);
            })
            .catch((err) => {
                console.log('[SW] Cache installation failed:', err);
            })
    );
    // Force waiting SW to become active immediately
    self.skipWaiting();
});

// Activate event - clean up ALL old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating new version:', CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete ALL caches except current
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all clients immediately
    self.clients.claim();

    // Notify all clients to refresh
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED' });
        });
    });
});

// Fetch event - NETWORK FIRST strategy for HTML/JS, cache for static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (Firebase, APIs, etc.)
    if (!url.origin.includes(self.location.origin)) {
        return;
    }

    // For HTML and JS files - ALWAYS go network first
    if (event.request.mode === 'navigate' ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.jsx') ||
        url.pathname.endsWith('.css') ||
        url.pathname === '/') {

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Got network response, cache it
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, try cache
                    return caches.match(event.request)
                        .then(cached => cached || caches.match('/index.html'));
                })
        );
        return;
    }

    // For static assets (images) - cache first
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) {
                    return cached;
                }
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                });
            })
    );
});

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
