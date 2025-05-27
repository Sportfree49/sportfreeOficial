self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('sportfree-cache').then(cache => {
            return cache.addAll([
            '/',
            'index.html',
            'style.css',
            'script.js',
            'icones/app.png',
            'icones/app512.png',
            ]);      
        })
    );
});

self.addEventListener('feth', event => {
event.respondWith(
    caches.match(event.request).then(response=>{
      return response || fetch(event.request);

    })
);
});








