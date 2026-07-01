/** Register the service worker (served under the app's base path). */
export function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    const url = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(url).catch(() => {
      // Registration can fail on unsupported/insecure contexts — non-fatal.
    });
  });
}
