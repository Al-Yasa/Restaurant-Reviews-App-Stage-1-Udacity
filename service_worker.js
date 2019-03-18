const cacheName = 'v1';

// Install Service Worker and cache all files
self.addEventListener('install', event => {
    console.log('Service Worker Running');
});

// Activate Service Worker and remove unwanted caches if they exist
self.addEventListener('activate', event => {
    console.log('Service Worker Activated');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {return caches.delete(cache);}
                })
            )
        })
    );
});

/**
 * Intercepting Fetches with Service Worker:
 *  - if online: clone the response and cache it
 *  - if offline: load the cache
 */
self.addEventListener('fetch', event => {
    console.log('Service Worker Fetching');

    event.respondWith(
        fetch(event.request)
        .then(res => {
            const resClone = res.clone();
            caches
                .open(cacheName)
                .then(cache => {
                    cache.put(event.request, resClone)
                });
            return res;
        }).catch(error => caches.match(event.request).then(res => res))
    );
});
