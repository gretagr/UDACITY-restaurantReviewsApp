var cacheName = 'reviewsApp-v1';
var images = [];
for (var i = 1; i <= 10; i++) {
  images.push(`./img/${i}.jpg`);
  images.push(`./img/${i}-l.jpg`);
};


self.addEventListener('install', function(event){
  console.log('[ServiceWorker] Installed');
  event.waitUntil(
    caches.open('reviewsApp-v1').then(function(cache) {
      cache.addAll(images); // adding images but not passing promise, if add fails main site content are still loaded
      return cache.addAll([
        './',
        './index.html',
        './restaurant.html',
        './js/dbhelper.js',
        './js/main.js',
        './js/restaurant_info.js',
        './data/restaurants.json',
        './css/styles.css',
        './css/media.css',
      ]); //adding main site files
    })
  );
});
self.addEventListener('activate', function(event){
console.log('[ServiceWorker] Activated');
    event.waitUntil(
    caches.keys().then(function(allCaches) {
      return Promise.all(allCaches.map(function (thisCache){
        if(thisCache !== cacheName) {
          return caches.delete(thisCache);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {

      if (response) {
        console.log('[serviceWorker] found in cache', event.request.url, response);
        return response;
      }

      var request = event.request.clone();

      return fetch(request).then(function (response) {

        if (!response){
          console.log("[ServiceWorker] No response from fetch ")
          return response;
        }
        var responseClone = response.clone();

          caches.open(cacheName).then(function (cache) {
            cache.put(event.request, responseClone);
            console.log('[ServiceWorker] New Data Cached', event.request.url);
            return response;
          });
      }).catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
      });
    })
  );
});
