// ====================
// SERVICE WORKER - PWA FUNCTIONALITY
// ====================

const CACHE_NAME = 'muslim-mart-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/auth.html',
    '/products.html',
    '/sales.html',
    '/reports.html',
    '/offline.html',
    '/manifest.json',
    '/js/auth.js',
    '/js/data.js',
    '/js/supabase.js',
    '/js/pwa.js',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching application assets');
                return cache.addAll(ASSETS_TO_CACHE.filter(url => !url.includes('cdn')));
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip browser extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Strategy: Network first, fall back to cache, then offline page
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network request failed
                // Try to return from cache
                return caches.match(request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match(OFFLINE_URL);
                        }

                        // Return placeholder response for other types
                        return new Response('Offline - Resource unavailable', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline sales
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-sales') {
        event.waitUntil(syncOfflineSales());
    }
});

// Sync offline sales when connection is restored
async function syncOfflineSales() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const offlineSalesResponse = await cache.match('/offline-sales');
        
        if (offlineSalesResponse) {
            const offlineSales = await offlineSalesResponse.json();
            
            // Send to all clients
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'SYNC_OFFLINE_SALES',
                    data: offlineSales
                });
            });

            // Clear offline sales after sync
            await cache.delete('/offline-sales');
        }
    } catch (error) {
        console.error('Background sync error:', error);
    }
}
