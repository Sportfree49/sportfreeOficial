
const musicas = [
  {
    nome: "Slay - Eternxlkz",
    arquivo: "pasta_musicas/slay.mp3", 
    capa: "imagensCapa/capaSlay.png"
  },
  {
    nome: "Enough - Eternxlkz",
    arquivo: "pasta_musicas/enough.mp3" ,
    capa: "imagensCapa/capaEnough.png"
  },
  {  
    nome: "Orquestra Maldita - Eternxlkz",
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
    capa: "imagensCapa/bateforte.png"
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
    nome: "Funk Of Galactico",
    arquivo: "pasta_musicas/funkOfGalactico.mp3", 
    capa: "imagensCapa/funkOfGalactico.jpg"
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
    nome: "Montagem Pr Funk",
    arquivo: "pasta_musicas/montagemPrFunk.mp3", 
    capa: "imagensCapa/montagemPrFunk.jpg"
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
    nome: "Glory",
    arquivo: "pasta_musicas/glory.mp3", 
    capa: "imagensCapa/glory.jpg"
  },
  {
    nome: "Slide Da Treme",
    arquivo: "pasta_musicas/slide_da_Treme.mp3", 
    capa: "imagensCapa/slidetreme.png"
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
let indiceAtual = 0;
const playPauseBtn = document.getElementById('playPauseBtn');
const iconePlayPause = document.getElementById('iconePlayPause')
const audio = document.getElementById('audio');
const nomeMusica = document.getElementById('nome-musica')
const capaMusica = document.getElementById('capa_musica');

const botaoPlaylist = document.getElementById('botaoPlaylist'); // Variaveis da Playlist
const caixaPlaylist = document.getElementById('caixaPlaylist');
const fecharPlaylist = document.getElementById('fecharPlaylist');
const listaMusicas = document.getElementById('listaMusicas');

const barraProgresso = document.getElementById('barra-progresso');
const tempoAtual = document.getElementById('tempo-atual');
const duracaoTotal = document.getElementById('duracao-total');

function tocarMusica(){
 const musica = musicas[indiceAtual];

 audio.src = musica.arquivo;
 nomeMusica.textContent = musica.nome;
 capaMusica.src = musica.capa;

 audio.play();
 iconePlayPause.src = 'icones/pause.png';


 }

playPauseBtn.addEventListener('click', function () {
  if (audio.paused) {
    audio.play();
   iconePlayPause.src = 'icones/pause.png';
  } else {
    audio.pause();
    iconePlayPause.src = 'icones/play.png';
  }
});
 function proximaMusica() {
  indiceAtual++;
  if (indiceAtual >= musicas.length){
    indiceAtual = 0;
}

audio.src = musicas[indiceAtual].arquivo
nomeMusica.textContent = musicas[indiceAtual].nome
capaMusica.src = musicas[indiceAtual].capa;

audio.play();
iconePlayPause.src = "icones/pause.png";


}

function musicaAnterior(){
  indiceAtual--;
  if (indiceAtual < 0){
    indiceAtual = musicas.length -1;
  }
  audio.src = musicas[indiceAtual].arquivo;
  nomeMusica.textContent = musicas[indiceAtual].nome;
  capaMusica.src = musicas[indiceAtual].capa;
  
  audio.play();
  iconePlayPause.src = "icones/pause.png";
}

audio.addEventListener('ended', proximaMusica);

botaoPlaylist.addEventListener("click", () => {
  caixaPlaylist.style.display = "block";
  mostrarMusicas();
});

fecharPlaylist.addEventListener("click", () => {
 caixaPlaylist.style.display = "none"; 
});

function mostrarMusicas() {
  listaMusicas.innerHTML = "";
  
  musicas.forEach((musica, index) =>{
    const item = document.createElement("div");
    item.classList.add("musica-item");

    const img = document.createElement("img");
    img.src = musica.capa;

    const nome = document.createElement("span");
    nome.textContent = musica.nome;

    item.appendChild(img);
    item.appendChild(nome);

    item.addEventListener("click", () => {
      indiceAtual = index;
      tocarMusica();
      caixaPlaylist.style.display = "none";
    });
    listaMusicas.appendChild(item);
  });
}

// Atualiza a barra conforme a música toca
audio.addEventListener('timeupdate', () =>{
  const progresso = (audio.currentTime / audio.duration) * 100;
  barraProgresso.value = progresso || 0;

  tempoAtual.textContent = formatarTempo(audio.currentTime);
  duracaoTotal.textContent = formatarTempo(audio.duration);
});

// Quando o usuário arrasta a barra
barraProgresso.addEventListener('input', () => {
  const tempo = (barraProgresso.value / 100)* audio.duration;
  audio.currentTime = tempo;

});

// Formatar segundos em minutos:segundos
function formatarTempo(segundos) {
  if (isNaN(segundos)) return "0:00";
  const minutos = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${minutos}:${seg}`;
}

console.log





