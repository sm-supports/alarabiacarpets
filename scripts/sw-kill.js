/**
 * The service worker's kill switch: a replacement for public/sw.js that removes itself.
 * Not part of the build; it stays here as the template.
 *
 * Use it when public/sw.js itself is broken, for instance pages that no longer load:
 *   1. cp scripts/sw-kill.js public/sw.js     (same name: browsers only ever check /sw.js)
 *   2. Set SERVICE_WORKER = false in src/lib/site.ts, so pages stop registering it and
 *      unregister whatever copy a browser still has.
 *   3. npm run deploy.
 * Every browser that has the worker checks /sw.js on its next page load (public/_headers
 * serves it no-cache). This version installs at once, unregisters the registration and
 * reloads the tabs the old worker controlled, which then load straight from the network.
 * It has no fetch handler, so nothing passes through it meanwhile.
 *
 * Leave it deployed for months: a browser that comes back later still has to fetch it.
 * Never delete /sw.js instead. A 404 on the update check keeps the old worker running.
 *
 * Rehearsed against a local build (see the WP13 commit): the old worker unregisters and
 * the tab reloads uncontrolled.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: "window" });
      await Promise.all(tabs.map((tab) => tab.navigate(tab.url).catch(() => {})));
    })()
  );
});
