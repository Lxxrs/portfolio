// TEMPORARY service-worker kill switch — the old Vue site registered a PWA
// service worker; returning visitors would otherwise get stale cached pages
// forever. This replacement self-destructs. DELETE THIS FILE after ~2 months.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", async () => {
  for (const k of await caches.keys()) await caches.delete(k);
  await self.registration.unregister();
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((c) => c.navigate(c.url));
});
