"use strict";


const VERSION = "0.0.2";
const CACHE_KEY = 'smarteat-' + VERSION;
const OFFLINE_PAGE = '/views/offline.html';

const PREFETCHED = [
   // '/menu.json',
   // '/intro/start',
   // OFFLINE_PAGE,
    // [...] other requests
];
const EXCLUDED = ['/manifest.json'];

async function _tryPutToCache(request: Request, response: Response) {
    // Only GET requests are allowed to be `put` into the cache.
    if (request.method.toLowerCase() != 'get')
        return;
    const url = request.url;
    // check if the requested url must not be included in the cache
    for (var excluded of EXCLUDED) {
        if (url.endsWith(excluded)) {
            return;
        }
    }
    // if caching is allowed for this request, then...
    const cache = await caches.open(CACHE_KEY);
    await cache.put(request,
        // responses might be allowed to be used only once, thus cloning
        response.clone());
}

// Listen to fetch events
const handleFetchEvent = async (event: FetchEvent): Promise<Response> => {

    let req = event.request.clone()
    let result
    // hult tinkoww iframe
    if(event.request.url.toLowerCase()==='https://securepay.tinkoff.ru/acq/index.html')
        return new Response('No Way')
    // Check if the image is a jpeg
    if (/\.jpg$|.png$/.test(event.request.url.toLowerCase())) {

        console.time('catch image request ' + event.request.url)
        // Inspect the accept header for WebP support
        var supportsWebp = false;
        if (event.request.headers.has('accept')){
            supportsWebp = event.request.headers
                .get('accept')
                .includes('webp');
            console.info('support webp')
        }

        // If we support WebP
        if (supportsWebp)
        {


            // Build the return URL
            var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + "(2).webp";
            console.info('Respond with ', returnUrl)
            result = await fetch(returnUrl, {
                mode: 'no-cors',
            })


            console.timeEnd('catch image request ' + event.request.url)
        }
        else {
            result = await fetch(req.url)
        }
    }
    else {
        result = await fetch(req)
    }

    return result
};


const _cacheFirst =  async (evt: FetchEvent) => {
    console.info('SW intercept request', evt.request.url, await evt.request.blob())
    if(evt.request.method !== 'GET') {
        return
    }
    // Network first (refreshes the cache), falling back to cache if offline.
    evt.respondWith(
        caches.match(evt.request)
            .then(
                async (cachedResponse: Response) => {

                    const url = evt.request.url;
                    if (cachedResponse) {
                        console.log('cached response for ' + url);
                        return cachedResponse;
                    }
                    try {
                        const r = await handleFetchEvent(evt);
                        // might respond `200 ok` even if offline, depending on the browser HTTP cache.
                        console.log('fresh response for ' + url);
                        await _tryPutToCache(evt.request, r);
                        return r;
                    } catch (_) {
                        console.warn(_);

                            console.log('offline response for ' + url);
                            return caches.match(OFFLINE_PAGE);
                    }

                }
            )
    );
}



self.addEventListener('fetch', _cacheFirst);

self.addEventListener('install', event => {
    console.log(VERSION + 'V1 installing…');

    // cache a cat SVG

});

self.addEventListener('activate', function (event: ExtendableEvent) {
   // self.Clients;
    console.log('Service Worker v'+VERSION+' ACTIVATED.')

    // In order to clear the cache, then update the {VERSION} above:
    // former cache version, if any, will be cleared.
    // Delete all caches that aren't named {CACHE_KEY}
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_KEY) {
                        console.info('Removing outdated cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});