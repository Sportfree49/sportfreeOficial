import {
    openSportfreeDb,
    addMusicToDownloadedDb,
    getMusicFromDownloadedDb,
    getAllDownloadedMusicFromDb,
    removeMusicFromDownloadedDb
} from './db.js';

const BASE_URL = window.location.origin;

openSportfreeDb().catch(e => console.error("Erro ao abrir DB na inicialização:", e));


let playPauseBtn; 
let iconePlayPause;
let audio;
let nomeMusica;
let capaMusica;
let botaoPlaylist;
let caixaPlaylist;
let fecharPlaylist;
let listaMusicas;
let barraProgresso;
let tempoAtual;
let duracaoTotal;
let prevBtn;
let nextBtn;
let draggingItemIndex = null;
let btnHome;
let buttonPlayer;
let menuprincipal;
let player;


let indiceAtual = 0;
const musicas = [
    
    {
        nome: "Slay",
        arquivo: "public/pasta_musicas/slay.mp3",
        capa: "public/imagensCapa/capaSlay.png"
    },
    {
        nome: "Enough",
        arquivo: "pasta_musicas/enough.mp3",
        capa: "imagensCapa/capaEnough.png"
    },
    { 
        nome: "Aura",
        arquivo: "pasta_musicas/aura.mp3",
        capa: "imagensCapa/capaAura.jpg"
    },
    { 
        nome: "The white stripes-Remix",
        arquivo: "pasta_musicas/theWhiteStripes.mp3",
        capa: "imagensCapa/theWhiteStripes.png"
    },
    
    {
        nome: "Orquestra Maldita",
        arquivo: "pasta_musicas/orquestraMaldita.mp3",
        capa: "imagensCapa/capaOrquestra.png"
    },
    {
        nome: "Eu Sento Gabu",
        arquivo: "pasta_musicas/euSentoGabu.mp3",
        capa: "imagensCapa/euSentoGabu.jpg"
    },
    {
        nome: "Brodyaga Funk",
        arquivo: "pasta_musicas/brodyagaFunk.mp3",
        capa: "imagensCapa/brodyagaFunk.jpg"
    },
    {
        nome: "Bate Forte e Dança",
        arquivo: "pasta_musicas/bateForteEDanca.mp3",
        capa: "imagensCapa/bateForteEdanca.jpg"
    },
    {
        nome: "Faz de Chicote",
        arquivo: "pasta_musicas/fazDeChicote.mp3",
        capa: "imagensCapa/fazDeChicote.jpg"
    },
    {
        nome: "Funk Do Bouce",
        arquivo: "pasta_musicas/funkDoBouce.mp3",
        capa: "imagensCapa/funkDoBouce.jpg"
    },
    {
        nome: "Montagem Xonada",
        arquivo: "pasta_musicas/montagemXonada.mp3",
        capa: "imagensCapa/montagemXonada.jpg"
    },
    {
        nome: "Passo bem Solto",
        arquivo: "pasta_musicas/passoBemSolto.mp3",
        capa: "imagensCapa/passoBemSolto.jpg"
    },
    {
        nome: "Funk Of Galactico",
        arquivo: "pasta_musicas/funkOfGalactico.mp3",
        capa: "imagensCapa/funkOfGalactico.jpg"
    },
    { 
        nome: "Acelerada",
        arquivo: "pasta_musicas/acelerada.mp3",
        capa: "imagensCapa/acelerada.jpg"
    },
    {
        nome: "Sequência da DZ7",
        arquivo: "pasta_musicas/sequenciaDaDz7.mp3",
        capa: "imagensCapa/sequenciaDaDezessete.jpg"
    },
    {
        nome: "Igual Pc da China",
        arquivo: "pasta_musicas/igualPcDaChina.mp3",
        capa: "imagensCapa/igualPcDaChina.jpg"
    },
    {
        nome: "Dia Delícia",
        arquivo: "pasta_musicas/diaDelicia.mp3",
        capa: "imagensCapa/diaDelicia.png"
    },
    {
        nome: "Montagem Ladrão",
        arquivo: "pasta_musicas/montagemLadrao.mp3",
        capa: "imagensCapa/montagemLadrao.jpg"
    },
    {
        nome: "Spook",
        arquivo: "pasta_musicas/spook.mp3",
        capa: "imagensCapa/spook.jpg"
    },
    {
        nome: "Mente Má",
        arquivo: "pasta_musicas/menteMa.mp3",
        capa: "imagensCapa/menteMa.jpg"
    },
    {
        nome: "Montagem Pr Funk",
        arquivo: "pasta_musicas/montagemPrFunk.mp3",
        capa: "imagensCapa/montagemPrFunk.jpg"
    },
    { 
        nome: "Com Medo!",
        arquivo: "pasta_musicas/comMedo.mp3",
        capa: "imagensCapa/ComMedo.jpg"
    },
    {
        nome: "Nunca Muda",
        arquivo: "pasta_musicas/nuncaMuda.mp3",
        capa: "imagensCapa/nuncaMuda.png"
    },
    {
        nome: "Se não quer Passa a Vez",
        arquivo: "pasta_musicas/passa_a_Vez_.mp3",
        capa: "imagensCapa/passaAvez.jpg"
    },
    {
        nome: "Automotivo Fenomenal",
        arquivo: "pasta_musicas/automotivoFenomenal.mp3",
        capa: "imagensCapa/automotivoFenomenal.jpg"
    },
    {
        nome: "Banheira de Espuma",
        arquivo: "pasta_musicas/banheiraDeEspuma.mp3",
        capa: "imagensCapa/banheiraDeEspuma.jpg"
    },
    {
        nome: "Treinamento de Força",
        arquivo: "pasta_musicas/treinamentoDeForca.mp3",
        capa: "imagensCapa/treinamentoDeForca.jpg"
    },
    {
        nome: "Murder In My Mind",
        arquivo: "pasta_musicas/murderInMyMind.mp3",
        capa: "imagensCapa/murderInMyMind.jpg"
    },
    {
        nome: "Montagem Bailão",
        arquivo: "pasta_musicas/montagemBailao.mp3",
        capa: "imagensCapa/montagemBailao.png"
    },
    {
        nome: "Montagem Tomada",
        arquivo: "pasta_musicas/montagemTomada.mp3",
        capa: "imagensCapa/montagemTomada.jpg"
    },
    {
        nome: "Montagem Mysterious Game",
        arquivo: "pasta_musicas/mysteriousGame.mp3",
        capa: "imagensCapa/mysteriousGame.jpg"
    },
    {
        nome: "Los Voltaje",
        arquivo: "pasta_musicas/losVoltaje.mp3",
        capa: "imagensCapa/losVoltaje.jpg"
    },
    {
        nome: "Glory",
        arquivo: "pasta_musicas/glory.mp3",
        capa: "imagensCapa/glory.jpg"
    },
    {
        nome: "Montagem Bandido",
        arquivo: "pasta_musicas/montagemBandido.mp3",
        capa: "imagensCapa/montagemBandido.jpg"
    },
    {
        nome: "Slide Da Treme",
        arquivo: "pasta_musicas/slide_da_Treme.mp3",
        capa: "imagensCapa/slideDaTreme.jpg"
    },
    {
        nome: "Automotivo da Turbulência",
        arquivo: "pasta_musicas/automotivoturbulencia.mp3",
        capa: "imagensCapa/automotivoDaTurbulencia.jpg"
    },
    {
        nome: "Ritmada Interestelar",
        arquivo: "pasta_musicas/ritmada_Interestelar.mp3",
        capa: "imagensCapa/ritmadaInterestelar.jpg"
    },
];

async function handleDownloadMusic(music) {
    if (!navigator.serviceWorker) {
        alert('Seu navegador não suporta Service Workers, o download offline não é possível.');
        console.error('Service Workers não suportados.');
        return;
    }
    try {
        const existingDownload = await getMusicFromDownloadedDb(music.id);
        if (existingDownload && existingDownload.isDownloaded) {
            alert(`"${music.title}" já está baixada para uso offline.`);
            return;
        }
        console.log(`Iniciando download de "${music.title}"...`);
        const cache = await caches.open('sportfree-music-v1');
        await cache.add(music.audioUrl);
        console.log(`Música "${music.title}" adicionada ao cache.`);
        const downloadedMusicData = {
            id: music.id,
            title: music.title,
            artist: music.artist,
            audioUrl: music.audioUrl,
            isDownloaded: true,
            downloadedAt: new Date().toISOString()
        };
        await addMusicToDownloadedDb(downloadedMusicData);
        console.log(`Metadados de "${music.title}" salvos no IndexedDB.`);
        alert(`"${music.title}" baixada com sucesso para uso offline!`);
        updateUIForDownloadedMusic(music.id, true);
    } catch (error) {
        console.error(`Erro ao baixar "${music.title}":`, error);
        alert(`Falha ao baixar "${music.title}" para uso offline. Verifique sua conexão e tente novamente.`);
    }
}
function updateUIForDownloadedMusic(musicId, isDownloaded) {
    const button = document.querySelector(`.download-button[data-music-id="${musicId}"]`);
    if (button) {
        const icon = button.querySelector('.download-icon');
        if (isDownloaded) {
            if (icon) {
                icon.src = 'icones/aprovado.png';
                icon.alt = 'Baixado';
            }
            button.disabled = true;
        } else {
            if (icon) {
                icon.src = 'icones/adicionar.png';
                icon.alt = 'Baixar';
            }
            button.disabled = false;
        }
    }
}
async function updateDownloadButtonsStatus() {
    const downloadedSongs = await getAllDownloadedMusicFromDb();
    downloadedSongs.forEach(music => {
        updateUIForDownloadedMusic(music.id, true);
    });
}
async function tocarMusica(autoPlay = true) {
    const musica = musicas[indiceAtual];
    if (!musica) return;
    
    const playerBackground = document.getElementById('player-background');
    if (playerBackground) {
        console.log('[DEBUG] Tentando definir background-image para:', musica.capa);
        playerBackground.style.backgroundImage = `url('${musica.capa}')`;
        console.log('[DEBUG] Background-image definido com sucesso!');
    }

    audio.src = musica.arquivo;
    capaMusica.src = musica.capa;
    nomeMusica.textContent = musica.nome;

    if (autoPlay) {
        try {
            await audio.play();
            iconePlayPause.src = "icones/pause.png";
        } catch (err) {
            console.warn("Play bloqueado até interação do usuário:", err);
        }
           } 
 

        if ('mediaSession' in navigator) {
        let title = musica.nome;
        let artist = 'Artista Desconhecido';
        const parts = musica.nome.split(' - ');
        if (parts.length > 1) {
            title = parts[0].trim();
            artist = parts[1].trim();
        } else {
            if (musica.nome.toLowerCase().includes('eternxlkz')) {
                artist = 'Eternxlkz';
                title = musica.nome.replace(/eternxlkz/i, '').trim();
                title = title.replace(/^-|-$/g, '').trim();
            } else if (musica.nome === 'Música Teste') {
                artist = 'Artista do Teste';
            }
        }
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: 'Sportfree Playlist',
            artwork: [
                { src: musica.capa, sizes: '96x96', type: 'image/png' },
                { src: musica.capa, sizes: '128x128', type: 'image/png' },
                { src: musica.capa, sizes: '192x192', type: 'image/png' },
                { src: musica.capa, sizes: '256x256', type: 'image/png' },
                { src: musica.capa, sizes: '384x384', type: 'image/png' },
                { src: musica.capa, sizes: '512x512', type: 'image/png' },
            ]
        });
    }
        }

async function proximaMusica() {
    indiceAtual = (indiceAtual + 1) % musicas.length;
    await tocarMusica();
}

async function musicaAnterior() {
    indiceAtual = (indiceAtual - 1 + musicas.length) % musicas.length;
    await tocarMusica();
}

async function playPauseMusica() {
    if (audio.paused) {
        try {
            await audio.play();
            iconePlayPause.src = "icones/pause.png";
        } catch (error) {
            console.error("Erro ao tentar dar play:", error);
        }
    } else {
        audio.pause();
        iconePlayPause.src = "icones/play.png";
    }
}

function mostrarMusicas() {
    listaMusicas.innerHTML = "";

    musicas.forEach((musica, index) => {
        const item = document.createElement("div");
        item.classList.add("musica-item");
        item.draggable = true;
        item.dataset.index = index;

        const img = document.createElement("img");
        img.src = musica.capa;
        img.alt = `Capa da música ${musica.nome}`;

        const nome = document.createElement("span");
        nome.textContent = musica.nome;

        const musicId = musica.nome.replace(/\s+/g, '-') + '_' + musicas.findIndex(m => m.nome === musica.nome);
        const fullAudioUrl = `${BASE_URL}/${musica.arquivo}`;

        const downloadButton = document.createElement("button");
        downloadButton.classList.add("download-button");
        downloadButton.title = "Baixar para offline";

        const downloadIcon = document.createElement("img");
        downloadIcon.classList.add("download-icon");
        downloadIcon.src = 'icones/adicionar.png';
        downloadIcon.alt = 'Baixar';
        downloadIcon.width = 20;
        downloadIcon.height = 20;

        downloadButton.appendChild(downloadIcon);
        downloadButton.dataset.musicId = musicId;
        downloadButton.dataset.musicTitle = musica.nome;
        downloadButton.dataset.musicArtist = musica.nome.split(' - ')[1] || 'Artista Desconhecido';
        downloadButton.dataset.musicUrl = fullAudioUrl;

        const playButton = document.createElement("button");
        playButton.classList.add("play-from-list-button");
        playButton.dataset.musicIndex = index;

        const playIcon = document.createElement("img");
        playIcon.classList.add("play-icon");
        playIcon.src = 'icones/playnew.png';
        playIcon.alt = 'Tocar música';
        playIcon.width = 20;
        playIcon.height = 20;

        playButton.appendChild(playIcon);

        item.appendChild(img);
        item.appendChild(nome);
        item.appendChild(downloadButton);
        item.appendChild(playButton);

        // ---- Drag and Drop ----
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", index);
            item.classList.add("dragging");
        });

        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
        });

        item.addEventListener("dragover", (e) => {
            e.preventDefault();
            const dragging = document.querySelector(".dragging");
            const bounding = item.getBoundingClientRect();
            const offset = e.clientY - bounding.top;

            if (offset > bounding.height / 2) {
                item.after(dragging);
            } else {
                item.before(dragging);
            }
        });

        item.addEventListener("drop", (e) => {
            e.preventDefault();
            const fromIndex = e.dataTransfer.getData("text/plain");
            const toIndex = item.dataset.index;

            if (fromIndex !== toIndex) {
                const [moved] = musicas.splice(fromIndex, 1);
                musicas.splice(toIndex, 0, moved);
                mostrarMusicas(); // re-renderiza playlist
            }
        });

        listaMusicas.appendChild(item);
    });
}


function formatarTempo(segundos) {
    if (isNaN(segundos)) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${seg}`;
}

document.addEventListener('DOMContentLoaded', () => {
    playPauseBtn = document.getElementById('playPauseBtn');
    iconePlayPause = document.getElementById('iconePlayPause');
    audio = document.getElementById('audio');
    nomeMusica = document.getElementById('nome-musica');
    capaMusica = document.getElementById('capa_musica');
    botaoPlaylist = document.getElementById('botaoPlaylist');
    caixaPlaylist = document.getElementById('caixaPlaylist');
    fecharPlaylist = document.getElementById('fecharPlaylist');
    listaMusicas = document.getElementById('listaMusicas');
    barraProgresso = document.getElementById('barra-progresso');
    tempoAtual = document.getElementById('tempo-atual');
    duracaoTotal = document.getElementById('duracao-total');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    btnHome = document.getElementById('btnHome');
    buttonPlayer = document.getElementById('buttonPlayer');
    menuprincipal = document.querySelector('.menuprincipal');
    player = document.querySelector('.player');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceWorker.js')
            .then(reg => {
                console.log('Service Worker registrado com sucesso:', reg);
                reg.update();
                reg.onupdatefound = () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.onstatechange = () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    if (confirm('Uma nova versão do Sportfree está disponível! Atualizar agora?')) {
                                        newWorker.postMessage({ action: 'skipWaiting' });
                                    }
                                } else {
                                    console.log('Conteúdo em cache para uso offline.');
                                }
                            }
                        };
                    }
                };
            })
            .catch(error => {
                console.error('Falha no registro do Service Worker:', error);
            });
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Novo Service Worker assumiu o controle. Recarregando a página...');
            window.location.reload();
        });
    }

    audio.addEventListener('timeupdate', () => {
        const progresso = (audio.currentTime / audio.duration) * 100;
        barraProgresso.value = progresso || 0;
        tempoAtual.textContent = formatarTempo(audio.currentTime);
        duracaoTotal.textContent = formatarTempo(audio.duration);
    });

    barraProgresso.addEventListener('input', () => {
        const tempo = (barraProgresso.value / 100) * audio.duration;
        audio.currentTime = tempo;
    });

    playPauseBtn.addEventListener("click", playPauseMusica);
    nextBtn.addEventListener("click", async () => await proximaMusica());
    prevBtn.addEventListener("click", async () => await musicaAnterior());

    audio.addEventListener("ended", async () => {
    await proximaMusica();
});

    botaoPlaylist.addEventListener("click", () => {
        caixaPlaylist.style.display = "block";
        mostrarMusicas();
        updateDownloadButtonsStatus();
    });

    fecharPlaylist.addEventListener("click", () => {
        caixaPlaylist.style.display = "none";
    });


    buttonPlayer.addEventListener("click", () => {
        menuprincipal.classList.add("hidden");
        player.classList.remove("hidden");
    });

    btnHome.addEventListener("click", () => {
        menuprincipal.classList.remove("hidden");
        player.classList.add("hidden");
    });






    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('download-button') || event.target.closest('.download-button')) {
            const button = event.target.closest('.download-button');
            const musicToDownload = {
                id: button.dataset.musicId,
                title: button.dataset.musicTitle,
                artist: button.dataset.musicArtist,
                audioUrl: button.dataset.musicUrl
            };
            await handleDownloadMusic(musicToDownload);
        }
        if (event.target.classList.contains('play-from-list-button') || event.target.closest('.play-from-list-button')) {
            const button = event.target.closest('.play-from-list-button');
            const index = parseInt(button.dataset.musicIndex, 10);
            if (!isNaN(index) && musicas[index]) {
                indiceAtual = index;
                tocarMusica();
                caixaPlaylist.style.display = "none";
                audio.play();
                iconePlayPause.src = 'icones/pause.png';
            }
        }
    });

    listaMusicas.addEventListener('dragstart', (e) => {
        draggingItemIndex = parseInt(e.target.closest('.musica-item').dataset.index, 10);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggingItemIndex);
        e.target.closest('.musica-item').classList.add('dragging');
    });

    listaMusicas.addEventListener('dragover', (e) => {
        e.preventDefault();
        const targetItem = e.target.closest('.musica-item');
        if (targetItem && targetItem.dataset.index !== draggingItemIndex) {
            targetItem.classList.add('dragging-over');
        }
    });

    listaMusicas.addEventListener('dragleave', (e) => {
        const targetItem = e.target.closest('.musica-item');
        if (targetItem) {
            targetItem.classList.remove('dragging-over');
        }
    });
    
    listaMusicas.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetItem = e.target.closest('.musica-item');
        if (targetItem) {
            const dropTargetIndex = parseInt(targetItem.dataset.index, 10);

            if (draggingItemIndex !== dropTargetIndex) {
                const [itemToMove] = musicas.splice(draggingItemIndex, 1);
                musicas.splice(dropTargetIndex, 0, itemToMove);
                
                // Atualiza o índice da música que está tocando
                const musicaTocando = musicas[indiceAtual];
                indiceAtual = musicas.findIndex(musica => musica.nome === musicaTocando.nome);

                // Re-renderiza a lista de músicas
                mostrarMusicas();
            }
        }
        // Remove a classe "dragging-over" de todos os itens
        document.querySelectorAll('.musica-item').forEach(item => item.classList.remove('dragging-over'));
    });

    listaMusicas.addEventListener('dragend', (e) => {
        e.target.closest('.musica-item').classList.remove('dragging');
        document.querySelectorAll('.musica-item').forEach(item => item.classList.remove('dragging-over'));
    });

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
            audio.play();
            iconePlayPause.src = 'icones/pause.png';
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause();
            iconePlayPause.src = 'icones/play.png';
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            musicaAnterior();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            proximaMusica();
        });
        navigator.mediaSession.setActionHandler('seekbackward', (event) => {
            const skipTime = event.seekOffset || 10;
            audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        });
        navigator.mediaSession.setActionHandler('seekforward', (event) => {
            const skipTime = event.seekOffset || 10;
            audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        });
        navigator.mediaSession.setActionHandler('seekto', (event) => {
            if (event.seekTime !== undefined) {
                audio.currentTime = event.seekTime;
            }
        });
    }

    const checkUpdateButton = document.getElementById('checkUpdateButton');
    if (checkUpdateButton) {
        checkUpdateButton.addEventListener('click', checkForUpdatesManually);
    }

    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('splash-hidden');
            splashScreen.addEventListener('transitionend', () => {
                splashScreen.remove();
            });
        }, 1000);
    }
    
    tocarMusica();
    iconePlayPause.src = 'icones/play.png';
    console.log('Sportfree script.js carregado e DOM pronto.');
});

/*node server.js*/

/*git add .
git commit -m "Adicionando imagens e músicas faltantes"
git push origin main
*/