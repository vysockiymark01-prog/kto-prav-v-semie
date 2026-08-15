// Версию кэша нужно поднимать при каждом деплое, который меняет ASSETS —
// иначе activate() ничего не чистит и старые клиенты годами сидят на "stale-while-revalidate",
// из-за чего HTML и JS могут закэшироваться в РАЗНЫХ версиях одновременно (несовпадающая разметка/переводы).
const CACHE_NAME = 'kto-prav-v2';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Файлы "оболочки" приложения (HTML/CSS/JS) — всегда сначала пытаемся взять из сети,
// чтобы обновления доходили до пользователя сразу же при следующем открытии приложения,
// а не после случайной фоновой ревалидации. В офлайне — откатываемся на кэш.
const APP_SHELL_SUFFIXES = ['/', '/index.html', '/css/style.css', '/js/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAppShell =
    event.request.mode === 'navigate' ||
    APP_SHELL_SUFFIXES.some((suffix) => url.pathname.endsWith(suffix));

  if (isAppShell) {
    // Network-first: свежая версия, если есть сеть; кэш — только как офлайн-подстраховка.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Остальное (иконки, манифест и т.п.) — кэш-первично, это не меняется между деплоями часто.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
