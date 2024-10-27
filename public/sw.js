const CACHE_NAME = 'image-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.match(/\.(jpg|jpeg|png|gif|mp4)$/)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});
