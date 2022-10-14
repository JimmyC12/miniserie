//asignar un nombre y versión al caché
const CACHE_NAME = "v1_cache_programador_fitness",
  urlsToCache = [
    "./",
    "style.css",
    "script.js",
    "./assets/c-sharp-c-logo-02F17714BA-seeklogo.com.png",
  ];

// durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).then(() => self.skipWaiting());
      })
      .catch((err) => console.log("Falló registro de caché", err))
  );
});

// una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener("activate", (e) => {
  const cacheWhiteList = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then((cachesNames) => {
        cachesNames.map((cacheName) => {
          //Eliminamos lo que ya no se necesita en el caché
          if (cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        });
      })
      // Le indica al SW activar el caché actual
      .then(() => self.clients.claim())
  );
});

// cuando el navegador recupera una url (puede actualizar los archivos almacenados en caché por si hay un cambio en el servidor)
self.addEventListener("fetch", (e) => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.responseWith(
    caches.matches(e.request).then((res) => {
      if (res) {
        // recuperar del caché
        return res;
      }

      // recuperar de la petición a la url
      return fetch(e.request);
    })
  );
});
