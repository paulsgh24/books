const CACHE = "v1";

const FILES_TO_CACHE = [
  '/books/index.html',
  '/books/authors.html',
  '/books/series.html',
  '/books/json/authors.json',
  '/books/json/books.json',
  '/books/json/series.json',
  '/books/manifest.webmanifest',
  '/books/img/symbol-192.png',
  '/books/img/symbol-512.png'
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
