// url's to save, cache version
var cacheName = 'reviewsApp-v1';
var images = [];
for (var i = 1; i <= 10; i++) {
  images.push(`./img/${i}.jpg`);
  images.push(`./img/${i}-l.jpg`);
};

self.addEventListener('install', function(event){
  //instaling service worker, cache files
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      cache.addAll(images); // adding images but not passing promise, if add fails main site content are still loaded
      return cache.addAll([ //adding main site files
        './',
        './index.html',
        './restaurant.html',
        './js/dbhelper.js',
        './js/main.js',
        './js/restaurant_info.js',
        './data/restaurants.json',
        './css/styles.css',
        './css/media.css',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // handling file requests
  event.respondWith(
    caches.match(event.request).then(function (response) { // check cache for requested file
      return response || fetch(event.request).then(function (responseToFetch) { // if in cache return, else if possible fetch from network
        return caches.open(cacheName).then(function (cache) { // if network available put file in cache for next time and return request
          cache.put(event.request, responseToFetch.clone());
          return responseToFetch;
        });
      });
    }).catch(function (error) {
      console.log('files not cached & no network connection', error); // if file is not in cache and networ is'nt available log msg
    })
  );
});

self.addEventListener('activate', function(event){
// handling old service worker versions
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
