// serviceWorker.js - versão corrigida e mais resiliente
const CACHE_STATIC_NAME = 'sportfree-static-v1760125912625';
const CACHE_MUSIC_NAME = 'sportfree-music-v1';
const CACHE_RUNTIME = 'sportfree-runtime-v1';

// Lista de arquivos essenciais (confirme os caminhos no seu deploy)
// OBS: corrigi 'icones//shuffle.png' -> 'icones/shuffle.png' e 'theWhiteStripes.png' -> 'imagensCapa/theWhiteStripes.png'.
// Se seus arquivos estiverem em outros paths, ajuste aqui.
const staticAssets = [
  '/',
  '/index.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/db.js',
  '/manifest.json',
  '/icones/confi.png',
  '/icones/playermusic.png',
  '/icones/menu.png',
  '/icones/IconSpotFree.png',
  '/icones/playlist.png',
  '/icones/play.png',
  '/icones/pause.png',
  '/icones/retroceder.png',
  '/icones/avancar.png',
  '/icones/adicionar.png',
  '/icones/aprovado.png',
  '/icones/playnew.png',
  '/icones/shuffle.png',
  '/imagensCapa/capaSlay.PNG',
  '/imagensCapa/capaEnough.PNG',
  '/imagensCapa/euSentoGabu.jpg',
  '/imagensCapa/capaAura.jpg',
  '/imagensCapa/theWhiteStripes.png',
  '/imagensCapa/capaOrquestra.PNG',
  '/imagensCapa/brodyagaFunk.jpg',
  '/imagensCapa/bateForteEdanca.jpg',
  '/imagensCapa/fazDeChicote.jpg',
  '/imagensCapa/funkDoBouce.jpg',
  '/imagensCapa/montagemXonada.jpg',
  '/imagensCapa/passoBemSolto.jpg',
  '/imagensCapa/funkOfGalactico.jpg',
  '/imagensCapa/acelerada.jpg',
  '/imagensCapa/sequenciaDaDezessete.jpg',
  '/imagensCapa/cingadoze.png',
  '/imagensCapa/igualPcDaChina.jpg',
  '/imagensCapa/diaDelicia.png',
  '/imagensCapa/montagemLadrao.jpg',
  '/imagensCapa/spook.jpg',
  '/imagensCapa/menteMa.jpg',
  '/imagensCapa/montagemPrFunk.jpg',
  '/imagensCapa/ComMedo.jpg',
  '/imagensCapa/famosinha.jpg',
  '/imagensCapa/fazOM.jpg',
  '/imagensCapa/ondaDaBalinha.jpg',
  '/imagensCapa/possoatenaodarflores.png',
  '/imagensCapa/sequenciaFeiticeira.jpg',
  '/imagensCapa/construcaoDeAmor.jpg',
  '/imagensCapa/pdePecado.jpg', 
  '/imagensCapa/nuncaMuda.PNG',
  '/imagensCapa/passaAvez.jpg',
  '/imagensCapa/automotivoFenomenal.jpg',
  '/imagensCapa/banheiraDeEspuma.jpg',
  '/imagensCapa/treinamentoDeForca.jpg',
  '/imagensCapa/murderInMyMind.jpg',
  '/imagensCapa/montagemBailao.png',
  '/imagensCapa/montagemTomada.jpg',
  '/imagensCapa/mysteriousGame.jpg',
  '/imagensCapa/losVoltaje.jpg',
  '/imagensCapa/glory.jpg',
  '/imagensCapa/montagemBandido.jpg',
  '/imagensCapa/slideDaTreme.jpg',
  '/imagensCapa/automotivoTurbulencia.jpg',
  '/imagensCapa/ritmadaInterestelar.jpg',
  '/favicon.ico'
];

// INSTALL - precache, mas com tolerância a falhas de alguns arquivos
self.addEventListener('install', event => {
  console.log('[SW] Install iniciado');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_STATIC_NAME);
      // Tenta adicionar cada asset individualmente para não falhar todo o install
      const results = await Promise.allSettled(
        staticAssets.map(async (url) => {
          try {
            // Usar Request absoluto relativo à origem (garante consistência)
            const req = new Request(url, { cache: 'no-cache' });
            const resp = await fetch(req);
            if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
            await cache.put(req, resp.clone());
            console.log('[SW] Cacheado:', url);
            return { url, status: 'ok' };
          } catch (err) {
            console.warn('[SW] Falha ao cachear', url, err);
            return { url, status: 'failed', error: String(err) };
          }
        })
      );
      console.log('[SW] Resultado do precache (resumido):', results.filter(r => r.status === 'rejected' || (r.value && r.value.status === 'failed')).length, 'falhas.');
      // ativa imediatamente para facilitar testes
      await self.skipWaiting();
    })()
  );
});

// ACTIVATE - limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Activate iniciado');
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => {
        if (![CACHE_STATIC_NAME, CACHE_MUSIC_NAME, CACHE_RUNTIME].includes(key)) {
          console.log('[SW] Deletando cache antigo:', key);
          return caches.delete(key);
        }
      }));
      await self.clients.claim();
    })()
  );
});

// FETCH - estratégias
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    // Apenas lida com GETs
    return;
  }

  const requestUrl = new URL(event.request.url);

  // 1) Navegação (HTML) - network-first com fallback para cache / offline.html
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 2) Músicas (pasta_musicas) - cache-first + suporte a Range Requests
  if (requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith('/pasta_musicas/')) {
    event.respondWith(handleMusicRequest(event));
    return;
  }

  // 3) Assets estáticos (icones, imagens de capa, css, js, etc) - cache-first, depois network e armazenar no runtime
  if (requestUrl.origin === self.location.origin &&
      (requestUrl.pathname.startsWith('/icones/') || requestUrl.pathname.startsWith('/imagensCapa/') ||
       requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.js') || requestUrl.pathname.endsWith('.png') ||
       requestUrl.pathname.endsWith('.jpg') || requestUrl.pathname.endsWith('.jpeg') || requestUrl.pathname.endsWith('.svg') || requestUrl.pathname.endsWith('.ico'))) {

    event.respondWith(cacheFirstThenNetwork(event.request));
    return;
  }

  // 4) Default: tentativa de responder do cache, senão rede
  event.respondWith(cacheFirstThenNetwork(event.request));
});

// Network-first para páginas de navegação
async function networkFirst(request) {
  try {
    const fetchResponse = await fetch(request);
    // Atualiza runtime cache
    const cache = await caches.open(CACHE_RUNTIME);
    try { cache.put(request, fetchResponse.clone()); } catch (e) { /* ignore opaque cross-origin puts */ }
    return fetchResponse;
  } catch (err) {
    console.warn('[SW] networkFirst: fetch falhou, tentando cache para', request.url, err);
    const cached = await caches.match(request);
    if (cached) return cached;
    // fallback para offline.html
    const offline = await caches.match('/offline.html') || await caches.match('/index.html');
    if (offline) return offline;
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Cache-first then network (usado para assets)
async function cacheFirstThenNetwork(request) {
  const cacheMatch = await caches.match(request);
  if (cacheMatch) return cacheMatch;
  try {
    const response = await fetch(request);
    // salva no runtime cache para futuras requisições
    const cache = await caches.open(CACHE_RUNTIME);
    try { cache.put(request, response.clone()); } catch (e) { /* ignore */ }
    return response;
  } catch (err) {
    console.warn('[SW] cacheFirstThenNetwork: fetch falhou para', request.url, err);
    // se for imagem, tenta um fallback de imagem (se você tiver /imagensCapa/default.png)
    if (request.destination === 'image') {
      const fallback = await caches.match('/imagensCapa/default.png');
      if (fallback) return fallback;
    }
    // tente algum cache global
    const anyCached = await caches.match('/offline.html');
    if (anyCached) return anyCached;
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Handler específico para músicas com suporte a Range
async function handleMusicRequest(event) {
  const req = event.request;
  const cache = await caches.open(CACHE_MUSIC_NAME);

  try {
    // Tenta encontrar no cache
    let cachedResponse = await cache.match(req);
    if (!cachedResponse) {
      // tenta por URL string
      cachedResponse = await cache.match(req.url);
    }

    if (cachedResponse) {
      const rangeHeader = req.headers.get('range');
      if (rangeHeader) {
        // Range request - devolve parte
        const arrayBuffer = await cachedResponse.arrayBuffer();
        const [start, endExclusive] = parseRange(rangeHeader, arrayBuffer.byteLength);
        const sliced = arrayBuffer.slice(start, endExclusive);
        const partialBlob = new Blob([sliced], { type: cachedResponse.headers.get('Content-Type') || 'audio/mpeg' });
        const headers = new Headers({
          'Content-Range': `bytes ${start}-${endExclusive - 1}/${arrayBuffer.byteLength}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(partialBlob.size),
          'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg'
        });
        return new Response(partialBlob, { status: 206, statusText: 'Partial Content', headers });
      } else {
        // Resposta completa do cache
        return cachedResponse;
      }
    }

    // Não no cache -> buscar da rede e armazenar (se disponível)
    const netResp = await fetch(req);
    if (netResp && netResp.ok) {
      try { await cache.put(req, netResp.clone()); } catch (e) { console.warn('[SW] falha ao gravar música no cache:', e); }
    }
    return netResp;
  } catch (err) {
    console.error('[SW] handleMusicRequest erro:', err);
    return new Response('Música indisponível offline sem download prévio.', { status: 503, statusText: 'Service Unavailable' });
  }
}

// parseRange: retorna [start, endExclusive]
function parseRange(rangeHeader, totalSize) {
  const matches = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
  let start = 0;
  let end = totalSize - 1;
  if (matches) {
    start = parseInt(matches[1], 10);
    if (matches[2]) {
      end = parseInt(matches[2], 10);
    }
  }
  start = Math.max(0, Math.min(start, totalSize - 1));
  end = Math.max(start, Math.min(end, totalSize - 1));
  return [start, end + 1]; // endExclusive
}

// Mensagens vindas do cliente (ex.: deletar música do cache, skipWaiting)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.action === 'delete_cached_music' && event.data.url) {
    caches.open(CACHE_MUSIC_NAME).then(cache => {
      cache.delete(event.data.url).then(deleted => {
        console.log('[SW] delete_cached_music:', event.data.url, deleted);
      });
    });
  } else if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
    console.log('[SW] skipWaiting recebido via message');
  }
});