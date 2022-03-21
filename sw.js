const version = 'v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/quizproject.css',
        '/quizproject.js',
        '/manifest.json',
        '/notfound.txt',
        '/icons/icon-192x192.png',
        '/icons/icon-256x256.png',
        '/icons/icon-384x384.png',
        '/icons/icon-512x512.png',
        '/quizimages/loading.jpg',
        '/quizimages/q1-1.jpg',
        '/quizimages/q1-2.jpg',
        '/quizimages/q1-3.jpg',
        '/quizimages/q1-4.jpg',
        '/quizimages/q1-5.jpg',
        '/quizimages/q1-6.jpg',
        '/quizimages/q1-7.jpg',
        '/quizimages/q1-8.jpg',
        '/quizimages/q1-9.jpg',
        '/quizimages/q1-10.jpg',
        '/quizimages/q2-1.jpg',
        '/quizimages/q2-2.jpg',
        '/quizimages/q2-3.jpg',
        '/quizimages/q2-4.jpg',
        '/quizimages/q2-5.jpg',
        '/quizimages/q2-6.jpg',
        '/quizimages/q2-7.jpg',
        '/quizimages/q2-8.jpg',
        '/quizimages/q2-9.jpg',
        '/quizimages/q2-10.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open(version).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/notfound.txt');
      });
    }
  }));
});
