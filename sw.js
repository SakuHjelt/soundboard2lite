// Pitää sovelluksen käytettävänä myös ilman nettiä.
// Hakee ensin netistä (jotta päivitykset tulevat), muuten käyttää välimuistia.
var CACHE = 'soundboard-d28';

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./', 'index.html', 'lite.html']); }));
  self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    })['catch'](function () {
      return caches.match(e.request);
    })
  );
});
