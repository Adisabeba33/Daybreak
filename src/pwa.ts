/**
 * Register the service worker and keep the installed PWA up to date.
 *
 * When a new version is deployed, the browser fetches the new sw.js, installs
 * it (skipWaiting), and it takes control (clients.claim) — firing
 * `controllerchange`. We reload once at that point so the app swaps to the new
 * build. We only reload on a genuine *update* (there was already a controller),
 * never on the very first install, and guard against reload loops.
 */
export function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const hadController = !!navigator.serviceWorker.controller;
    let reloading = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || reloading) return;
      reloading = true;
      window.location.reload();
    });

    const url = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker
      .register(url)
      .then((reg) => {
        // Check for a new version now, and periodically while the app is open.
        reg.update().catch(() => {});
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      })
      .catch(() => {
        // Registration can fail on unsupported/insecure contexts — non-fatal.
      });
  });
}
