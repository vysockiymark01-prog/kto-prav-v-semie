// Версию кэша нужно поднимать при каждом деплое, который меняет ASSETS —
// иначе activate() ничего не чистит и старые клиенты годами сидят на "stale-while-revalidate",
// из-за чего HTML и JS могут закэшироваться в РАЗНЫХ версиях одновременно (несовпадающая разметка/переводы).
const CACHE_NAME = 'kto-prav-v4';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
];

// Файлы "оболочки" приложения (HTML/CSS/JS) — всегда сначала пытаемся взять из сети,
// чтобы обновления доходили до пользователя сразу же при следующем открытии приложения,
// а не после случайной фоновой ревалидации. В офлайне — откатываемся на кэш.
const APP_SHELL_SUFFIXES = ['/', '/index.html', '/css/style.css', '/js/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Кэшируем каждый файл ПО ОТДЕЛЬНОСТИ, а не одним cache.addAll(). addAll() атомарен:
      // если хотя бы один файл на секунду не отдался (сеть моргнула, CDN икнул),
      // весь офлайн-кэш остаётся пустым — и офлайн-режим не работает вообще ни для чего.
      Promise.allSettled(ASSETS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // destination === 'document' — доп. проверка на случай TWA/WebView, где request.mode
  // не всегда надёжно равен 'navigate' (встречается на некоторых версиях Android/Chrome).
  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';
  const isAppShell = isNavigation || APP_SHELL_SUFFIXES.some((suffix) => url.pathname.endsWith(suffix));

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
        .catch(() =>
          // Сначала пробуем точное совпадение по URL, а для любой навигации (даже с
          // незнакомым путём/параметрами) — откатываемся на закэшированный index.html,
          // чтобы офлайн работал даже если запрошенный адрес не совпал буква в букву.
          caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (isNavigation) return caches.match('./index.html');
            return undefined;
          })
        )
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
