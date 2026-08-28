const VERSION = 'closeout-kit-v3';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const CORE = [
  '/',
  '/index.html',
  '/offline.html',
  '/demo',
  '/packet/engagement',
  '/packet/assets',
  '/packet/access-tasks',
  '/packet/support',
  '/packet/acknowledgement',
  '/packet/export',
  '/privacy/',
  '/terms/',
  '/manifest.webmanifest',
  '/robots.txt',
  '/art/harbor-closeout-960.webp',
  '/art/harbor-closeout-1536.webp',
  '/art/harbor-closeout-960.avif',
  '/art/harbor-closeout-1536.avif',
  '/art/harbor-closeout-1536.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(CORE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => ![SHELL, RUNTIME].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/art/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME).then((cache) => cache.put(event.request, copy));
      return response;
    })));
  }
});
