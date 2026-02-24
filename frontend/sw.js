// Service Worker para PWA
const CACHE_NAME = 'igreja-app-v1.0.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/pagamentos.html',
  '/admin.html',
  '/mobile.html',
  '/assets/css/bootstrap.min.css',
  '/assets/js/bootstrap.bundle.min.js',
  '/assets/js/config.js',
  '/assets/js/auth.js',
  '/assets/js/donations.js',
  '/assets/js/admin.js',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigationRequest = event.request.mode === 'navigate';

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put('/index.html', responseToCache);
          });
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (!isSameOrigin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Atualizar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sync em background
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Sincronização em background');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implementar sincronização de dados offline
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação da Igreja',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/assets/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Sistema da Igreja', options)
  );
});