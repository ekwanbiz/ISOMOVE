/* ISOMOVE service worker – membolehkan app digunakan tanpa internet.
   Tukar VERSION setiap kali fail app dikemas kini supaya murid dapat versi baharu. */
const VERSION = 'isomove-v27';

const APP_FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/fx.js',
  './simulasi/translasi.html',
  './simulasi/pantulan.html',
  './simulasi/putaran.html',
  './manifest.json',
  './favicon.svg',
  './icons/logo.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/inter-latin-400-normal.woff2',
  './fonts/inter-latin-600-normal.woff2',
  './fonts/inter-latin-700-normal.woff2',
  './fonts/space-grotesk-latin-500-normal.woff2',
  './fonts/space-grotesk-latin-700-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_FILES.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Salinan dalam peranti dahulu (pantas, juga tanpa internet). Versi baharu dipasang bila VERSION ditukar:
  // service worker baharu muat turun semua fail, kemudian app muat semula sendiri.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
