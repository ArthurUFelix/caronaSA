// This is the "Offline page" service worker
const CACHE = "pwa-offline-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "/offline.html";

const urls = [
// '/offline.html',
  '/public/styles/material-web.min.css',
  '/public/scripts/libs/material-web.min.js',
  '/public/styles/style.css',
  '/public/images/logo.png',
  '/public/images/offline.jpg',
  '/public/scripts/libs/jquery.min.js'
];

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function(event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      console.log("[PWA Builder] Cached offline page during install");

      urls.map(url => {
        cache.add(url);
      });

      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if(response) {
          console.log("Cache encontrado");
          
          return response;
        } else {
          fetch(event.request).then(function (response) {
            console.log("Retornando pagina normalmente");
      
            if(response) {
              return response;
            }
          });
        }

        return cache.match(offlineFallbackPage).then(async function(response) {
          if(response) {
            console.log("Retornando offline page");
  
            return response;
          }
        });
      });
    })
  )
});