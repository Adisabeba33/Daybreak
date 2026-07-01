/*
 * Daybreak service worker.
 *
 * Phase 1: makes the app installable and usable offline. Strategy:
 *  - navigations (HTML)  → network-first, fall back to cache (never serve a
 *    stale app shell while online; still works with no connection)
 *  - same-origin assets  → stale-while-revalidate (instant, refreshed in bg)
 *
 * Phase 2 will add a `push` handler here to show reminder notifications
 * delivered via Web Push — the registration below is the foundation for it.
 */
const CACHE = "daybreak-v1";

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
          const net = await fetch(request);
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
