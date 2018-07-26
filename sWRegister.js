/*========= Service Worker Registration ============*/
if(navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(registrated) {
    console.log('Service Worker successfuly registrated');
  }).catch(function (error) {
    console.log('Service Worker not registrated', error);
  });
}
