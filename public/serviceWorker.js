// serviceWorker.js

// Nomes dos caches para melhor organização e gerenciamento
const CACHE_STATIC_NAME = 'sportfree-static-v1760125912625';
const CACHE_MUSIC_NAME = 'sportfree-music-v1';

// Lista de arquivos estáticos essenciais para o App Shell
const staticAssets = [
    './',
    'index.html',
    'style.css',
    'script.js',
    'db.js',
    'manifest.json',
    'icones/confi.png',
    'icones/playermusic.png',
    'icones/menu.png',
    'icones/IconSpotFree.png', 
    'icones/playlist.png',
    'icones/play.png',
    'icones/pause.png',
    'icones/retroceder.png',
    'icones/avancar.png',
    'icones/atualizacao.png',
    'icones/adicionar.png',
    'icones/aprovado.png',
    'icones/playnew.png',
    'icones//shuffle.png',
    'public/imagensCapa/capaSlay.png',
    'imagensCapa/capaEnough.png',
    'imagensCapa/euSentoGabu.jpg',
    'imagensCapa/capaAura.jpg',
    'theWhiteStripes.png',
    'imagensCapa/capaOrquestra.png',
    'imagensCapa/brodyagaFunk.jpg',
    'imagensCapa/bateForteEdanca.jpg',
    'imagensCapa/fazDeChicote.jpg',
    'imagensCapa/funkDoBouce.jpg',
    'imagensCapa/montagemXonada.jpg',
    'imagensCapa/passoBemSolto.jpg',
    'imagensCapa/funkOfGalactico.jpg',
    'imagensCapa/acelerada.jpg',
    'imagensCapa/sequenciaDaDezessete.jpg',
    'imagensCapa/igualPcDaChina.jpg',
    'imagensCapa/diaDelicia.png',
    'imagensCapa/montagemLadrao.jpg',
    'imagensCapa/spook.jpg',
    'imagensCapa/menteMa.jpg',
    'imagensCapa/montagemPrFunk.jpg',
    'imagensCapa/ComMedo.jpg',
    'imagensCapa/nuncaMuda.png',
    'imagensCapa/passaAvez.jpg',
    'imagensCapa/automotivoFenomenal.jpg',
    'imagensCapa/banheiraDeEspuma.jpg',
    'imagensCapa/treinamentoDeForca.jpg',
    'imagensCapa/murderInMyMind.jpg',
    'imagensCapa/montagemBailao.png', 
    'imagensCapa/montagemTomada.jpg',
    'imagensCapa/mysteriousGame.jpg',
    'imagensCapa/losVoltaje.jpg',
    'imagensCapa/glory.jpg',
    'imagensCapa/montagemBandido.jpg',
    'imagensCapa/slideDaTreme.jpg',
    'imagensCapa/automotivoDaTurbulencia.jpg',
    'imagensCapa/ritmadaInterestelar.jpg'
];

// EVENTO 'INSTALL':
self.addEventListener('install', event => {
    console.log('[Service Worker] Instalando Service Worker...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(cache => {
                console.log('[Service Worker] Cacheando shell do app');
                return cache.addAll(staticAssets);
            })
            .catch(error => {
                console.error('[Service Worker] Falha ao cachear shell do app:', error);
            })
    );
});

// EVENTO 'ACTIVATE':
self.addEventListener('activate', event => {
    console.log('[Service Worker] Ativando Service Worker...');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_MUSIC_NAME) {
                    console.log('[Service Worker] Removendo cache antigo:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// EVENTO 'FETCH':
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    const pathWithoutSlash = requestUrl.pathname.startsWith('/') ? requestUrl.pathname.slice(1) : requestUrl.pathname;

    // Estratégia 1: Cache-First para arquivos estáticos (App Shell)
    const isStaticAsset = staticAssets.includes(requestUrl.pathname) || 
                          staticAssets.includes(pathWithoutSlash) || 
                          (requestUrl.pathname === '/' && staticAssets.includes('index.html')) || 
                          (requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith('/icones/')) || 
                          (requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith('/imagensCapa/'));

    if (isStaticAsset) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response; // Encontrado no cache, retorna
                    }
                    // Não está no cache, tenta buscar na rede
                    return fetch(event.request);
                })
                .catch(error => { // CORRIGIDO: Este catch agora lida com falhas do cache e da rede
                    console.log('[Service Worker] Falha ao servir do cache ou rede para ativo estático:', event.request.url);
                    // Retorna um fallback que é um objeto Response válido
                    return new Response('App Shell Offline', { status: 503, statusText: 'Service Unavailable' });
                })
        );
        return;
    }

    // Estratégia 2: Cache-First e tratamento de Range Requests para arquivos de música
    if (requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith('/pasta_musicas/') && event.request.method === 'GET') {
        event.respondWith(
            caches.open(CACHE_MUSIC_NAME).then(async cache => {
                console.log(`[Service Worker - DEBUG] Interceptando requisição para música: ${event.request.url}`);
                console.log(`[Service Worker - DEBUG] Requisição original (música):`, event.request);

                let cachedResponse = await cache.match(event.request);
                
                if (!cachedResponse) {
                    cachedResponse = await cache.match(event.request.url);
                    if (cachedResponse) {
                        console.log('[Service Worker - DEBUG] Música encontrada no cache por URL string (menos estrito).');
                    }
                }

                if (cachedResponse) {
                    const rangeHeader = event.request.headers.get('range');
                    
                    if (rangeHeader) {
                        console.log(`[Service Worker] Tratando Range Request: ${rangeHeader}`);
                        const responseBody = await cachedResponse.arrayBuffer();
                        const [rangeStart, rangeEnd] = parseRange(rangeHeader, responseBody.byteLength);

                        const partialBlob = new Blob([responseBody.slice(rangeStart, rangeEnd)], { type: cachedResponse.headers.get('Content-Type') });
                        
                        const responseToSend = new Response(partialBlob, {
                            status: 206,
                            statusText: 'Partial Content',
                            headers: {
                                'Content-Range': `bytes ${rangeStart}-${rangeEnd - 1}/${responseBody.byteLength}`,
                                'Accept-Ranges': 'bytes',
                                'Content-Length': partialBlob.size,
                                'Content-Type': cachedResponse.headers.get('Content-Type')
                            }
                        });

                        console.log('[Service Worker - DEBUG] Respondendo com 206 Headers:', Object.fromEntries(responseToSend.headers.entries()));
                        console.log('[Service Worker - DEBUG] Tamanho do Partial Blob:', partialBlob.size);

                        return responseToSend;

                    } else {
                        console.log('[Service Worker] Servindo música do cache (completa - 200 OK):', event.request.url);
                        return cachedResponse;
                    }
                }

                console.log('[Service Worker] Música não encontrada no cache (tentativas esgotadas), buscando da rede:', event.request.url);
                return fetch(event.request).then(netResponse => {
                    if (netResponse && netResponse.status === 200) {
                        const responseToCache = netResponse.clone();
                        cache.put(event.request, responseToCache); 
                        console.log('[Service Worker] Música adicionada ao cache após streaming:', event.request.url);
                    }
                    return netResponse;
                }).catch(error => {
                    console.error('[Service Worker] Falha ao buscar música da rede e não está no cache:', event.request.url, error);
                    return new Response('Música indisponível offline sem download prévio.', { status: 503, statusText: 'Service Unavailable' });
                });
            })
        );
        return;
    }

    event.respondWith(fetch(event.request)); 
});

// FUNÇÃO AUXILIAR PARA PARSEAR O CABEÇALHO 'RANGE'
function parseRange(rangeHeader, totalSize) {
    const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    let start = 0;
    let end = totalSize - 1;

    if (rangeMatch) {
        start = parseInt(rangeMatch[1], 10);
        if (rangeMatch[2]) {
            end = parseInt(rangeMatch[2], 10);
        }
    }
    end = Math.min(end, totalSize - 1);
    
    return [start, end + 1];
}

// Evento 'message': Opcional, mas útil para comunicação entre o app (script.js) e o Service Worker.
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'delete_cached_music') {
        caches.open(CACHE_MUSIC_NAME).then(cache => {
            cache.delete(event.data.url).then(deleted => {
                console.log(`[Service Worker] Música ${event.data.url} ${deleted ? 'removida' : 'não encontrada'} do cache.`);
            });
        });
    } 
    else if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
        console.log('[Service Worker] skipWaiting() chamado por mensagem do cliente.');
    }
});