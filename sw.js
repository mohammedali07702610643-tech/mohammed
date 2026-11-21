// يخزن التطبيق والمكتبات حتى يفتح بدون إنترنت (والخرائط تنخزن من داخل التطبيق)
const SHELL="shell-v2";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  const mine=u.origin===location.origin||/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.host);
  if(!mine&&r.mode!=="navigate")return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r,cp)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==="navigate"?caches.match("./"):undefined))));
});
