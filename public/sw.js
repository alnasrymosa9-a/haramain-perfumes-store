// Service Worker - الحرمين للعود والعطور
const CACHE_NAME = 'haramain-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // تجاهل أخطاء التخزين المؤقت
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // تجاهل طلبات Supabase - لا تخزنها في الكاش
  if (url.hostname.includes('supabase.co')) return;
  
  // تجاهل طلبات الـ API
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // تخزين فقط ملفات الموقع الأساسية
        if (
          response.ok &&
          url.origin === self.location.origin &&
          !url.pathname.includes('supabase')
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // إرجاع الصفحة الرئيسية للـ SPA
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html') || new Response('Offline', { status: 503 });
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
