const CACHE_NAME = 'greenherb-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/login.html',
    '/css/style.css',
    '/utilizadores.js'
];

// Instalar: cache dos assets estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

// Ativar: limpar caches antigas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first para API, cache-first para assets
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Pedidos à API: sempre tentar rede primeiro
    if (url.includes('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() =>
                new Response(JSON.stringify({ erro: 'Sem ligação ao servidor.' }), {
                    headers: { 'Content-Type': 'application/json' }
                })
            )
        );
        return;
    }

    // Assets estáticos: cache-first com fallback para rede
    event.respondWith(
        caches.match(event.request).then(cached =>
            cached || fetch(event.request).then(response => {
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
        ).catch(() => caches.match('/index.html'))
    );
});
