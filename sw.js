const CACHE = "alhoot2-v1";
self.addEventListener("install", e => { e.waitUntil((async () => { const list = await (await fetch("/precache.json", { cache: "no-store" })).json(); const c = await caches.open(CACHE); await c.addAll(list); self.skipWaiting(); })()); });
self.addEventListener("activate", e => { e.waitUntil((async () => { for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k); await self.clients.claim(); })()); });
self.addEventListener("fetch", e => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith((async () => { const c = await caches.open(CACHE); const hit = await c.match(r, { ignoreSearch: true }) || (r.mode === "navigate" ? await c.match("/index.html") : null); if (hit) return hit; try { return await fetch(r); } catch { return new Response("offline", { status: 503 }); } })());
});
