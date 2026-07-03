/*
 * Daybreak service worker.
 *
 * Phase 1: installable + offline-capable, and — importantly — self-updating so
 * the installed PWA doesn't get stuck on an old build.
 *   - navigations (HTML)  → network-first with `cache: "reload"` so the freshly
 *     deployed index.html always wins over any HTTP cache; falls back to cache
 *     only when offline.
 *   - hashed assets       → stale-while-revalidate (instant, refreshed in bg).
 * On activate we drop old caches and take control immediately (skipWaiting +
 * clients.claim); the page reloads once when the new worker takes over (see
 * src/pwa.ts). Bump CACHE on breaking changes to force a clean sweep.
 *
 * Phase 2 will add a `push` handler here for reminder notifications.
 */
const CACHE = "daybreak-v3";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(request, { cache: "reload" });
          const cache = await caches.open(CACHE);
          cache.put(request, net.clone());
          return net;
        } catch {
          const cached = await caches.match(request);
          return cached || caches.match(self.registration.scope + "index.html");
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      const network = fetch(request)
        .then((res) => {
          caches.open(CACHE).then((cache) => cache.put(request, res.clone()));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })(),
  );
});
