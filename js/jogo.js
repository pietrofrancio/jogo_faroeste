// ==========================================
// 1. ELEMENTOS DO DOM (HTML)
// ==========================================
const cenario      = document.getElementById("cenario")
const protagonista  = document.getElementById("protagonista")
const btnPause      = document.getElementById("btnPause")
const hudVidas      = document.getElementById("vidas")
const hudOuro       = document.getElementById("ouro")       
const hudPontos     = document.getElementById("hudPontos")  

cenario.setAttribute("tabindex", "0"); 
cenario.style.outline = "none";

// ==========================================
// 2. SISTEMA DE ÁUDIO (MÚSICA E EFEITOS)
// ==========================================
const musicaJogo = document.getElementById("musicaJogo")
const somTiro    = document.createElement("audio")

// Configuração do Tiro
somTiro.src = "../efeitos_sonoros/efeito_sonoro_tiro.mp3"
somTiro.volume = 0.2

// Configuração da Música de Fundo (Verifica LocalStorage)
let musicaSalva = localStorage.getItem("musicaJogo")
musicaJogo.src = musicaSalva ? musicaSalva : "../music/musica_fundo1.mp3"
musicaJogo.volume = 0.2

// ==========================================
// 3. ESTADOS E CONTROLES DO JOGO
// ==========================================
let jogoPausado = false
let naContagem  = false 

let indiceCenaAtual = 0;
let listaCenasAtiva = []; 
let emTransicaoDeFase = false;

// ==========================================
// 4. CENAS DE TRANSIÇÃO E SISTEMA DE DIÁLOGO
// ==========================================
let telaTransicaoElemento = null;

const cenasTransicao1_2 = [
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "Essa cidade já viu dias melhores",
        imagem: "../img/morganaNormal.png", 
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "Se aqui já está assim, imagina o que vem pela frente",
        imagem: "../img/morganaNormal.png", 
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "Algo me diz que esse trabalho vai longe demais...",
        imagem: "../img/morganaNormal.png", 
        posicao: "esquerda"
    },
];

function iniciarDialogo(listaDeCenas) {
    if (!listaDeCenas || listaDeCenas.length === 0) {
        console.error("Erro: Nenhuma cena foi passada para iniciarDialogo().");
        return;
    }

    emTransicaoDeFase = true;
    listaCenasAtiva = listaDeCenas;
    indiceCenaAtual = 0;

    if (typeof musicaJogo !== 'undefined' && musicaJogo) {
        musicaJogo.volume = 0.05;
    }

    const cenarioElemento = document.getElementById("cenario");
    if (!cenarioElemento) return;

    // CRIAÇÃO DA TELA DE TRANSIÇÃO (Ela nasce aqui se não existir no HTML)
    telaTransicaoElemento = document.getElementById("transicao-tela");
    if (!telaTransicaoElemento) {
        telaTransicaoElemento = document.createElement("div");
        telaTransicaoElemento.id = "transicao-tela";
        cenarioElemento.appendChild(telaTransicaoElemento);
    }

    // Limpa inimigos e feno da tela de forma segura
    if (typeof inimigos !== 'undefined' && inimigos) {
        inimigos.forEach(ini => { if (ini.elemento) ini.elemento.remove(); });
        inimigos = [];
    }
    if (typeof bolasFeno !== 'undefined' && bolasFeno) {
        bolasFeno.forEach(bola => { if (bola.elemento) bola.elemento.remove(); });
        bolasFeno = [];
    }

    // Cria ou recupera o personagem direto no cenário
    let imgAvatar = document.getElementById("personagem");
    if (!imgAvatar) {
        imgAvatar = document.createElement("img");
        imgAvatar.id = "personagem";
        cenarioElemento.appendChild(imgAvatar);
    }

    // Cria ou recupera a caixa de diálogo
    let painel = document.getElementById("dialogo");
    if (!painel) {
        painel = document.createElement("div");
        painel.id = "dialogo";
        cenarioElemento.appendChild(painel);
    }
    
    painel.style.display = "block";
    painel.innerHTML = `
        <div id="nome-personagem"></div>
        <div id="texto"></div>
        <div class="pular">Pressione S para pular a história</div>
        <div class="continuar">Pressione ESPAÇO para continuar</div>
    `;

    window.removeEventListener("keydown", gerenciarTeclasDialogo);
    window.addEventListener("keydown", gerenciarTeclasDialogo);

    mostrarCena();
}

function gerenciarTeclasDialogo(e) {
    if (emTransicaoDeFase) {
        if (e.code === "Space") {
            e.preventDefault(); 
            
            // Trava o clique se já estiver escurecendo para evitar bugs de avançar duplo
            if (telaTransicaoElemento.classList.contains("escuro")) return;

            // 1. Inicia o efeito de fechar a tela (fade out)
            telaTransicaoElemento.classList.add("escuro");

            // 2. Espera a tela apagar completamente (400ms) para trocar o texto escondido
            setTimeout(() => {
                indiceCenaAtual++;
                
                if (indiceCenaAtual < listaCenasAtiva.length) {
                    mostrarCena();
                    // 3. Abre a tela suavemente revelando a nova fala
                    telaTransicaoElemento.classList.remove("escuro");
                } else {
                    telaTransicaoElemento.classList.remove("escuro");
                    removerControlesEFechar();
                }
            }, 700); 
        }
        
        if (e.code === "KeyS") {
            e.preventDefault();
            if (telaTransicaoElemento) telaTransicaoElemento.classList.remove("escuro");
            removerControlesEFechar();
        }
    }
}

function mostrarCena() {
    if (!listaCenasAtiva || !listaCenasAtiva[indiceCenaAtual]) return;

    const cena = listaCenasAtiva[indiceCenaAtual];
    const nomeEl = document.getElementById("nome-personagem");
    const textoEl = document.getElementById("texto");
    const cenarioElemento = document.getElementById("cenario");
    const imgAvatar = document.getElementById("personagem");

    if (nomeEl) nomeEl.innerText = cena.nome;
    if (textoEl) textoEl.innerText = cena.fala;
    
    // CORREÇÃO: Tratamento seguro para aplicar a imagem de fundo da transição
    if (cenarioElemento && cena.fundo) {
        cenarioElemento.style.backgroundImage = `url('${cena.fundo}')`;
    }

    if (imgAvatar) {
        if (cena.imagem) {
            imgAvatar.src = cena.imagem;
            imgAvatar.style.display = "block";
            
            if (cena.posicao === "direita") {
                imgAvatar.style.left = "auto";
                imgAvatar.style.right = "50px";
                imgAvatar.style.transform = "scaleX(-1)";
            } else {
                imgAvatar.style.right = "auto";
                imgAvatar.style.left = "50px";
                imgAvatar.style.transform = "scaleX(1)";
            }
        } else {
            imgAvatar.style.display = "none";
        }
    }
}

function removerControlesEFechar() {
    window.removeEventListener("keydown", gerenciarTeclasDialogo);
    
    const dialogoEl = document.getElementById("dialogo");
    if (dialogoEl) dialogoEl.style.display = "none";
    
    const imgAvatar = document.getElementById("personagem");
    if (imgAvatar) imgAvatar.style.display = "none";
    
    finalizarDialogo();
}

function finalizarDialogo() {
    emTransicaoDeFase = false;
    if (typeof musicaJogo !== 'undefined' && musicaJogo) {
        musicaJogo.volume = 0.2;
    }
    if (listaCenasAtiva === cenasTransicao1_2) {
        avancarDeFaseLogica(); 
    }
}

// ==========================================
// 5. PROGRESSÃO, OURO E PONTOS
// ==========================================
let ouro = Number(localStorage.getItem("ouro")) || 0
let pontos = 0
let faseAtual = 2 // Declarada aqui primeiro!

// CORREÇÃO: Calcula dinamicamente antes de exibir no HUD pela primeira vez
let pontosParaProximaFase = faseAtual * 40 

hudOuro.innerText = `Ouro: ${ouro}`
hudPontos.innerText = `Pontos: 0/${pontosParaProximaFase}`

function iniciarMusica(){
    musicaJogo.play()
    window.removeEventListener("keydown", iniciarMusica)
    window.removeEventListener("mousedown", iniciarMusica)
}

window.addEventListener("keydown", iniciarMusica)
window.addEventListener("mousedown", iniciarMusica)
musicaJogo.play().catch(() => {})
const menuGameOver = document.getElementById("gameOverMenu")
const btnVida1 = document.getElementById("comprar1Vida")
const btnVida2 = document.getElementById("comprar2Vidas")
const btnRecusar = document.getElementById("recusar")
let invencivel = false

let moedas = []
const spritesMoeda = [
    "../img/moeda1.png",
    "../img/moeda2.png",
    "../img/moeda3.png",
    "../img/moeda4.png",
    "../img/moeda5.png",
    "../img/moeda6.png",
    "../img/moeda7.png"
]

let bolasFeno = [] 
const spritesFeno = []
const totalSpritesFeno = 35 

for (let i = 1; i <= totalSpritesFeno; i++) {
    spritesFeno.push(`../img/bola_feno${i}.png`)
}

// ==========================================
// BOTÃO DE PAUSE
// ==========================================
btnPause.addEventListener("click", () => {
    jogoPausado = !jogoPausado;
    
    // Remove o foco do botão para não dar o bug do Espaço
    btnPause.blur(); 

    if (jogoPausado) {
        btnPause.innerText = "▶ Continuar";
        musicaJogo.pause();
    } else {
        btnPause.innerText = "⏸ Pausar";
        musicaJogo.play();
        
        // CORREÇÃO MÁSTER: Força o navegador a focar no cenário do jogo
        cenario.focus(); 
        
        // Só reinicia o loop se não houver outra instância rodando
        // Como o requestAnimationFrame já roda continuamente se emTransicaoDeFase for checado,
        // remover a chamada direta do loopDoJogo() aqui evita duplicações!
    }
});

btnRecusar.addEventListener("click", () => {
    location.reload()
})

btnVida1.addEventListener("click", () => {
    if (ouro >= 3) {
        ouro -= 3
        localStorage.setItem("ouro", ouro)
        hudOuro.innerText = `Ouro: ${ouro}`
        vidas = 1
        hudVidas.innerText = `Vidas: ${vidas} ♥`
        protaX = 50
        protaY = chao
        protagonista.style.left = `${protaX}px`
        protagonista.style.bottom = `${protaY}px`
        invencivel = true
        const piscar = setInterval(() => {
            protagonista.style.opacity = protagonista.style.opacity == "0.3" ? "1" : "0.3"
        }, 150)

        inimigos.forEach(i => i.elemento.remove())
        inimigos = []
        bolasFeno.forEach(b => b.elemento.remove())
        bolasFeno = []

        setTimeout(() => {
            invencivel = false
            clearInterval(piscar)
            protagonista.style.opacity = "1"
        }, 3000)
        menuGameOver.classList.add("oculto")
        jogoPausado = false
        loopDoJogo()
    } else {
        alert("Você não possui ouro suficiente!")
    }
})

btnVida2.addEventListener("click", () => {
    if (ouro >= 5) {
        ouro -= 5
        localStorage.setItem("ouro", ouro)
        hudOuro.innerText = `Ouro: ${ouro}`
        vidas = 2
        hudVidas.innerText = `Vidas: ${vidas} ♥`
        protaX = 50
        protaY = chao
        protagonista.style.left = `${protaX}px`
        protagonista.style.bottom = `${protaY}px`
        invencivel = true
        const piscar = setInterval(() => {
            protagonista.style.opacity = protagonista.style.opacity == "0.3" ? "1" : "0.3"
        }, 150)
        inimigos.forEach(i => i.elemento.remove())
        inimigos = []
        bolasFeno.forEach(b => b.elemento.remove())
        bolasFeno = []

        setTimeout(() => {
            invencivel = false
            clearInterval(piscar)
            protagonista.style.opacity = "1"
        }, 3000)
        menuGameOver.classList.add("oculto")
        jogoPausado = false
        loopDoJogo()
    } else {
        alert("Você não possui ouro suficiente!")
    }
})

// ==========================================
// CONFIGURAÇÃO DOS SPRITES DA PROTAGONISTA
// ==========================================
const spritesMorgana = {
    parada: "../img/morganaParada.png",
    pulo: [
        "../img/morganaPulando1.png", "../img/morganaPulando2.png",
        "../img/morganaPulando3.png", "../img/morganaPulando4.png",
        "../img/morganaPulando5.png", "../img/morganaPulando6.png",
    ],
    correndo: [
        "../img/morganaCorrendo1.png", "../img/morganaCorrendo2.png",
        "../img/morganaCorrendo3.png", "../img/morganaCorrendo4.png",
        "../img/morganaCorrendo5.png", "../img/morganaCorrendo6.png",
        "../img/morganaCorrendo7.png", "../img/morganaCorrendo8.png",
        "../img/morganaCorrendo9.png", "../img/morganaCorrendo10.png",
        "../img/morganaCorrendo11.png",
    ],
    atirando: [
        "../img/morganaAtirando1.png", "../img/morganaAtirando2.png",
        "../img/morganaAtirando3.png", "../img/morganaAtirando4.png",
    ]
}

let frameCorrida = 0; let framePulo = 0; let frameAtirando = 0
let estaAtirando = false; let timerAnimacao = 0
const velocidadFrame = 14; const velocidadTiro = 10

// ==========================================
// VARIÁVEIS DE CONTROLE DO JOGO (AJUSTADAS)
// ==========================================
let vidas = 5
const chao = 100
let protaX = 50; let protaY = chao; let velY = 0
let pulando = false

// Aumentamos a velocidade, o pulo e a gravidade para o jogo responder melhor a 60 FPS:
const gravidade = 1.4;         // Antes era 0.5
const forcaPulo = 26;         // Antes era 18
const velocidadeAndar = 10;     // Antes era 4

// ==========================================
// CONTROLES (Teclado e Mouse)
// ==========================================
let teclas = {}

window.addEventListener("keydown", (e) => {
    if (emTransicaoDeFase || jogoPausado || naContagem) return; // CORREÇÃO: Não faz nada se o jogo estiver travado/pausado

    teclas[e.code] = true

    if (e.code === "Space" && !estaAtirando) {
        estaAtirando = true
        frameAtirando = 0
        timerAnimacao = 0
        
        somTiro.currentTime = 0 
        somTiro.play().catch(() => {}) 
        
        //criarBala()
    }
})

window.addEventListener("keyup", (e) => {
    if (emTransicaoDeFase) return;
    teclas[e.code] = false
})

let balas = [] 

function criarBolaFeno() { 
    if (emTransicaoDeFase || jogoPausado) return;
    const fenoElemento = document.createElement("img")
    fenoElemento.className = "bola-feno"

    if (faseAtual === 2) {
        // Sorteia apenas o coiote cinza ou o laranja para ser o obstáculo de pulo
        const skinsCoiote = [
            "../img/coioteCinzaAndando1.png",
            "../img/coioteLaranjaAndando1.png"
        ];
        const skinSorteada = skinsCoiote[Math.floor(Math.random() * skinsCoiote.length)];
        fenoElemento.src = skinSorteada;
        
        fenoElemento.style.width = "180px";  
        fenoElemento.style.height = "120px";
        
        // 🌟 CONTROLE DE DIREÇÃO DE RÉ:
        // Se a sua imagem original olha para a ESQUERDA, use "scaleX(1)".
        // Se ela originalmente olha para a DIREITA, mude para "scaleX(-1)" para que ele ande de frente!
        if (skinSorteada.includes("coioteCinza")) {
            fenoElemento.style.transform = "scaleX(-1)"; 
        } else if (skinSorteada.includes("coioteLaranja")) {
            fenoElemento.style.transform = "scaleX(-1)";
        }
    } else {
        fenoElemento.src = spritesFeno[0];
        fenoElemento.style.width = "60px";  
        fenoElemento.style.height = "60px";
        fenoElemento.style.transform = "none";
    } 
    
    fenoElemento.style.position = "absolute";
    fenoElemento.style.zIndex = "4";
    
    let posX = window.innerWidth + 50;
    let posY = chao;

    fenoElemento.style.bottom = `${posY}px`;
    fenoElemento.style.left = `${posX}px`;

    cenario.appendChild(fenoElemento);

    bolasFeno.push({
        elemento: fenoElemento,
        x: posX,
        y: posY,
        velocidade: 12, // Velocidade ideal de corrida
        frame: 0,      
        timer: 0,
        skinOriginal: fenoElemento.src 
    });
}

function criarBala() {
    const balaElemento = document.createElement("div")
    balaElemento.classList.add("bala")

    const olhandoParaDireita = protagonista.style.transform !== "scaleX(-1)"

    let balaX = protaX + (olhandoParaDireita ? 100 : 20)
    let balaY = protaY + 75 

    balaElemento.style.left = `${balaX}px`
    balaElemento.style.bottom = `${balaY}px`

    cenario.appendChild(balaElemento)

    balas.push({
        elemento: balaElemento,
        x: balaX,
        y: balaY,
        direcao: olhandoParaDireita ? 1 : -1
    })
}

function criarMoeda(x, y) {
    const moeda = document.createElement("img")

    moeda.src = spritesMoeda[0] 
    moeda.style.position = "absolute"
    moeda.style.width = "25px"
    moeda.style.height = "25px"
    moeda.style.left = `${x}px`
    moeda.style.bottom = `${y}px`
    moeda.style.zIndex = "4"

    cenario.appendChild(moeda)

    let direcaoX = Math.random() > 0.5 ? 1.5 : -1.5

    moedas.push({
        elemento: moeda,
        x: x,
        y: y,
        velY: 12,        
        velX: direcaoX,  
        noChao: false,   
        frame: 0,        
        timer: 0         
    })
}

// ==========================================
// SISTEMA DE FASES E INIMIGOS
// ==========================================
faseAtual = 1
let inimigos = []

const dadosInimigos = {
    hostil1: { andando: ["../img/bandido1Andando1.png", "../img/bandido1Andando2.png", "../img/bandido1Andando3.png", "../img/bandido1Andando4.png", "../img/bandido1Andando5.png", "../img/bandido1Andando6.png", "../img/bandido1Andando7.png"], atirando: ["../img/bandido1Atirando1.png", "../img/bandido1Atirando2.png", "../img/bandido1Atirando3.png", "../img/bandido1Atirando4.png"] },
    hostil2: { andando: ["../img/bandido2Andando1.png", "../img/bandido2Andando2.png", "../img/bandido2Andando3.png", "../img/bandido2Andando4.png", "../img/bandido2Andando5.png", "../img/bandido2Andando6.png", "../img/bandido2Andando7.png"], atirando: ["../img/bandido2Atirando1.png", "../img/bandido2Atirando2.png", "../img/bandido2Atirando3.png", "../img/bandido2Atirando4.png", "../img/bandido2Atirando5.png"] },
    hostil3: { andando: ["../img/xerifeAndando1.png", "../img/xerifeAndando2.png", "../img/xerifeAndando3.png", "../img/xerifeAndando4.png", "../img/xerifeAndando5.png", "../img/xerifeAndando6.png", "../img/xerifeAndando7.png"], atirando: ["../img/xerifeAtirando1.png", "../img/xerifeAtirando2.png", "../img/xerifeAtirando3.png", "../img/xerifeAtirando4.png", "../img/xerifeAtirando5.png"] },
    chefao:  { andando: ["../img/chefao_anda1.png"], atirando: ["../img/chefao_atira1.png", "../img/chefao_atira2.png"] },
    
   // --- NOVOS INIMIGOS DA FASE 2 ---
    bandidoCavalo1: { andando: ["../img/bandidoCavalo1Andando1.png", "../img/bandidoCavalo1Andando2.png", "../img/bandidoCavalo1Andando3.png", "../img/bandidoCavalo1Andando4.png", "../img/bandidoCavalo1Andando5.png"], atirando: ["../img/bandidoCavalo1Atirando1.png", "../img/bandidoCavalo1Atirando2.png"] },
    bandidoCavalo2: { andando: ["../img/cavalo2_anda1.png", "../img/cavalo2_anda2.png"], atirando: ["../img/cavalo2_atira1.png"] },
    fantasma:       { andando: ["../img/pistoleiroAndando1.png", "../img/pistoleiroAndando2.png", "../img/pistoleiroAndando3.png", "../img/pistoleiroAndando4.png", "../img/pistoleiroAndando5.png"],  atirando: ["../img/pistoleiroAtirando1.png", "../img/pistoleiroAtirando2.png"] },
}

// CORRIGIDO: Removido a duplicidade das fases e corrigido o "host2" da fase 3
const configuracaoFases = {
    1: { nome: "Cidade Empoeirada", inimigos: ["hostil1", "hostil2", "hostil3"], fundo: "url('../img/cenario1.png')" },
    2: { nome: "Sob Um Sol Escaldante", inimigos: ["bandidoCavalo1", "bandidoCavalo2", "fantasma"], fundo: "url('../img/cenario2.png')" },
    3: { nome: "O Desfiladeiro Sombrio", inimigos: ["hostil2", "hostil3"], fundo: "url('../img/cenario3.png')" },
    4: { nome: "Emboscada no Saloon", inimigos: ["hostil1", "hostil2", "hostil3"], fundo: "url('../img/cenario4.png')" },
    5: { nome: "O Confronto Final", inimigos: ["chefao"], fundo: "url('../img/cenario5.png')" }
}

function carregarCenarioDaFase() {
    if (configuracaoFases[faseAtual]) {
        cenario.style.backgroundImage = configuracaoFases[faseAtual].fundo
    }
}

function criarInimigo() {
    if (jogoPausado || naContagem || emTransicaoDeFase) return;
    
    // 1. Sorteia qual inimigo vai nascer baseado na fase atual
    const listaInimigosDaFase = configuracaoFases[faseAtual].inimigos;
    const tipoSorteado = listaInimigosDaFase[Math.floor(Math.random() * listaInimigosDaFase.length)];

    // Verificação de segurança para evitar que o jogo quebre caso falte alguma imagem
    if (!dadosInimigos[tipoSorteado]) return;

    const inimigoElemento = document.createElement("img");
    
    // 2. Define a classe CSS correta de acordo com o tipo
    if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2") {
        inimigoElemento.classList.add("inimigo-cavalo");
    } else {
        inimigoElemento.classList.add("inimigo");
    }

    inimigoElemento.src = dadosInimigos[tipoSorteado].andando[0];

    // 3. Ajustes inline de tamanho (limpos nos cavalos para o CSS de 400px agir)
    if (tipoSorteado === "chefao") {
        inimigoElemento.style.width = "200px";
        inimigoElemento.style.height = "200px";
    } 
    else if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2") {
        inimigoElemento.style.width = "";
        inimigoElemento.style.height = "";
    }
    else {
        inimigoElemento.style.width = "140px";
        inimigoElemento.style.height = "160px";
    }

    // 4. Configuração de direção e posicionamento inicial de spawn
    let direcaoInicial = "scaleX(1)";
    if (tipoSorteado === "fantasma") {
        direcaoInicial = "scaleX(-1)";
    }
    inimigoElemento.style.transform = direcaoInicial;

    let posX = window.innerWidth;
    inimigoElemento.style.left = `${posX}px`;
    inimigoElemento.style.bottom = `${chao}px`;

    cenario.appendChild(inimigoElemento);

    // 5. Configuração das velocidades de movimento
    let velocidadeInimigo = 7;
    if (tipoSorteado === "coiote1" || tipoSorteado === "coiote2" || tipoSorteado === "coiote3") {
        velocidadeInimigo = 12; 
    }

    // 6. Lógica de Vida (Resistência): Cavalos tomam 2 tiros, o restante toma 1
    let vidaInimigo = 1;
    if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2") {
        vidaInimigo = 2;
    }

    // 7. Salva o inimigo no array principal
    inimigos.push({
        elemento: inimigoElemento,
        x: posX,
        tipo: tipoSorteado,
        frame: 0,
        timer: 0,
        estado: "andando",
        timerAtaque: 0,
        velocidade: velocidadeInimigo,
        vida: vidaInimigo
    });
}

function iniciarContagemFase() {
    pontosParaProximaFase = faseAtual * 40;
    naContagem = true;
    jogoPausado = true; // Pausa o jogo para a contagem

    // Remove qualquer tela de contagem antiga que possa ter ficado presa
    const telaAntiga = document.getElementById("telaIntroFase");
    if (telaAntiga) telaAntiga.remove();

    const telaIntro = document.createElement("div");
    telaIntro.id = "telaIntroFase";
    
    telaIntro.style.position = "absolute";
    telaIntro.style.top = "0";
    telaIntro.style.left = "0";
    telaIntro.style.width = "100%";
    telaIntro.style.height = "100%";
    telaIntro.style.display = "flex";
    telaIntro.style.flexDirection = "column";
    telaIntro.style.justifyContent = "center";
    telaIntro.style.alignItems = "center";
    telaIntro.style.backgroundColor = "rgba(0, 0, 0, 0.85)"; 
    telaIntro.style.zIndex = "10";
    telaIntro.style.fontFamily = "'Press Start 2P', cursive"; 
    telaIntro.style.color = "#ffebc2"; 

    const dadosFase = configuracaoFases[faseAtual];
    
    telaIntro.innerHTML = `
        <h1 style="font-size: 30px; margin-bottom: 40px; color: #ffebc2; text-align: center; line-height: 1.8;">
            Fase ${faseAtual}: ${dadosFase.nome}
        </h1>
        <h2 id="textoContagem" style="font-size: 50px; color: #ffebc2;">3</h2>
    `;
    
    cenario.appendChild(telaIntro);

    let contador = 3;
    const textoContagem = document.getElementById("textoContagem");

    const intervalo = setInterval(() => {
        contador--;
        if (contador > 0) {
            if (textoContagem) textoContagem.innerText = contador;
        } else if (contador === 0) {
            if (textoContagem) textoContagem.innerText = "ATIRE!"; 
        } else {
            clearInterval(intervalo);
            telaIntro.remove(); 
            
            // CORREÇÃO: Garante que o estado do jogo volte ao normal e reativa o loop
            naContagem = false;
            jogoPausado = false; 
            loopDoJogo(); 
            console.log("Contagem finalizada! Jogo rodando.");
        }
    }, 1000);
}

// ==========================================
// VARIÁVEIS DE CONTROLO DE FPS 
// ==========================================
let ultimoTempoQuadro = 0;
const fpsAlvo = 60;
const intervaloQuadro = 1000 / fpsAlvo; // ~16.66ms por quadro

// ==========================================
// GAME LOOP (VERSÃO COM FPS CORRIGIDO)
// ==========================================
function loopDoJogo(tempoAtual) {
    // Garante que o loop continue rodando mesmo se estiver em transição
    if (emTransicaoDeFase) {
        requestAnimationFrame(loopDoJogo);
        return;
    }
    
    if (jogoPausado || naContagem) {
        requestAnimationFrame(loopDoJogo);
        return;
    }

    // Se for o primeiro quadro, inicializa o tempo
    if (!ultimoTempoQuadro) ultimoTempoQuadro = tempoAtual;

    // Calcula quanto tempo passou desde o último quadro renderizado
    const tempoDecorrido = tempoAtual - ultimoTempoQuadro;

    // Se ainda não passou tempo suficiente para atingir o FPS alvo, pula este frame
    if (tempoDecorrido < intervaloQuadro) {
        requestAnimationFrame(loopDoJogo);
        return;
    }

    // Atualiza o tempo do último quadro descontando o excesso para manter a precisão
    ultimoTempoQuadro = tempoAtual - (tempoDecorrido % intervaloQuadro);

    // =========================================================================
    // DAQUI PARA BAIXO RODA A 60 FPS CRAVADOS (Seu código original de física)
    // =========================================================================

    // --- 1. MOVIMENTO E ANIMAÇÃO DA PROTAGONISTA ---
    let estaAndando = false
    if (teclas["ArrowRight"] || teclas["KeyD"]) { protaX += velocidadeAndar; protagonista.style.transform = "scaleX(1)"; estaAndando = true }
    if (teclas["ArrowLeft"] || teclas["KeyA"]) { protaX -= velocidadeAndar; protagonista.style.transform = "scaleX(-1)"; estaAndando = true }
    if (protaX < 0) protaX = 0

    if ((teclas["ArrowUp"] || teclas["KeyW"]) && !pulando) { velY = forcaPulo; pulando = true }
    protaY += velY
    if (protaY > chao) velY -= gravidade
    if (protaY <= chao) { protaY = chao; pulando = false; velY = 0; framePulo = 0 }

    if (estaAtirando) {
        timerAnimacao++
        if (timerAnimacao >= velocidadTiro) {
            timerAnimacao = 0; 
            frameAtirando++
            
            // CORREÇÃO DE SINCRONIA: 
            // Se o braço estica no frame 2, criamos a bala aqui!
            // (Se achar que ainda não bateu, mude o número 2 para 1 ou 3)
            if (frameAtirando === 3) {
                criarBala();
            }

            if (frameAtirando >= spritesMorgana.atirando.length) { 
                estaAtirando = false; 
                frameAtirando = 0; 
            }
        }
        if (estaAtirando) protagonista.src = spritesMorgana.atirando[frameAtirando]
    }
    else if (pulando) {
        timerAnimacao++
        if (timerAnimacao >= velocidadFrame) { timerAnimacao = 0; if (framePulo < spritesMorgana.pulo.length - 1) framePulo++ }
        protagonista.src = spritesMorgana.pulo[framePulo]
    }
    else if (estaAndando) {
        timerAnimacao++
        if (timerAnimacao >= velocidadFrame) { timerAnimacao = 0; frameCorrida = (frameCorrida + 1) % spritesMorgana.correndo.length }
        protagonista.src = spritesMorgana.correndo[frameCorrida]
    }
    else {
        protagonista.src = spritesMorgana.parada; frameCorrida = 0; framePulo = 0; timerAnimacao = 0
    }

    protagonista.style.left = `${protaX}px`
    protagonista.style.bottom = `${protaY}px`

    // --- 2. LÓGICA E ANIMAÇÃO DOS INIMIGOS ---
    for (let i = inimigos.length - 1; i >= 0; i--) {
        let ini = inimigos[i]
        let direcaoTransform = "scaleX(1)"

        let velInimigoAtual = ini.velocidade ? ini.velocidade : 3;

        // Movimentação em direção ao player (Apenas se não estiver atirando)
if (ini.estado === "andando") {
    if (protaX > ini.x) {
        ini.x += velInimigoAtual; 
        direcaoTransform = "scaleX(1)";
    } else {
        ini.x -= velInimigoAtual; 
        direcaoTransform = "scaleX(-1)";
    }
} else {
    // Se estiver atirando, fica parado, mas olhando para a Morgana
    direcaoTransform = protaX > ini.x ? "scaleX(1)" : "scaleX(-1)";
}

        ini.timer++
        if (ini.timer >= 12) {
            ini.timer = 0
            let listaSprites = dadosInimigos[ini.tipo][ini.estado]
            ini.frame = (ini.frame + 1) % listaSprites.length
            ini.elemento.src = listaSprites[ini.frame]
        }

        if (ini.tipo !== "chefao") {
            const atiradores = ["hostil1", "hostil2", "hostil3", "bandidoCavalo1", "bandidoCavalo2", "fantasma"];
            
            if (atiradores.includes(ini.tipo)) {
                ini.timerAtaque++
                let distanciaX = Math.abs(protaX - ini.x)

                if (distanciaX < 450) {
                    if (ini.timerAtaque >= 80 && ini.estado === "andando") {
                        ini.timerAtaque = 0
                        ini.estado = "atirando"
                        ini.frame = 0

                        if (!pulando) perderVida()

                        setTimeout(() => {
                            ini.estado = "andando"
                            ini.frame = 0
                        }, 800)
                    }
                } else {
                    ini.timerAtaque = 0
                }
            }

            let distFisicaX = Math.abs(protaX - ini.x)
            let distFisicaY = Math.abs(protaY - chao) 

            if (distFisicaX < 50 && distFisicaY < 70) {
                ini.elemento.remove()
                inimigos.splice(i, 1)
                perderVida() 
                continue
            }
        }

        if (ini.x < -200 || ini.x > window.innerWidth + 200) {
            ini.elemento.remove()
            inimigos.splice(i, 1)
            continue
        }

        ini.elemento.style.left = `${ini.x}px`
        ini.elemento.style.transform = direcaoTransform 
    }

    // --- 3. LÓGICA DOS PROJÉTEIS (MOVIMENTO E COLISÃO) ---
    for (let b = balas.length - 1; b >= 0; b--) {
        let bala = balas[b];
        bala.x += (18 * bala.direcao);
        bala.elemento.style.left = `${bala.x}px`;
        let balaDestruida = false;

        for (let i = inimigos.length - 1; i >= 0; i--) {
            let ini = inimigos[i];
            let distBalaX = Math.abs(bala.x - ini.x);
            let distBalaY = Math.abs(bala.y - (chao + 75)); 

            if (distBalaX < 50 && distBalaY < 75) {
                // Remove a bala da tela e do array imediatamente
                bala.elemento.remove();
                balas.splice(b, 1);
                balaDestruida = true;

                // Reduz a vida do inimigo atingido
                ini.vida--;

                // O inimigo só morre e dá pontos se a vida dele chegar a 0
                if (ini.vida <= 0) {
                    let pontosGanhos = 0;

                    // Define os pontos baseado no tipo do inimigo abatido
                    if (ini.tipo === "hostil1" || ini.tipo === "hostil2") {
                        pontosGanhos = 3;
                    } else if (ini.tipo === "hostil3" || ini.tipo === "fantasma") {
                        pontosGanhos = 5;
                    } else if (ini.tipo === "bandidoCavalo1" || ini.tipo === "bandidoCavalo2") {
                        pontosGanhos = 7; // Cavalos dão mais pontos por terem 2 de vida
                    } else if (ini.tipo === "chefao") {
                        pontosGanhos = 20;
                    }

                    // Incrementa os pontos e atualiza o placar na tela
                    pontos += pontosGanhos;
                    hudPontos.innerText = `Pontos: ${pontos}/${pontosParaProximaFase}`;

                    // Dropa a moeda onde o inimigo morreu
                    criarMoeda(ini.x + 40, chao + 20);
                    
                    // Remove o inimigo morto da tela e do array
                    ini.elemento.remove();
                    inimigos.splice(i, 1);

                    // Verifica se o jogador acumulou pontos para mudar de fase
                    verificarMudancaDeFase();

                    // Se for o chefão, finaliza o jogo
                    if (ini.tipo === "chefao") {
                        alert("Parabéns! Você derrotou o Chefão com seus poderes e salvou o dia!");
                        location.reload();
                    }
                }
                break; // Sai do loop de inimigos pois esta bala já colidiu
            }
        }

        if (balaDestruida) continue;

        // Remove a bala caso ela saia dos limites da tela sem atingir ninguém
        if (bala.x > window.innerWidth || bala.x < -50) {
            bala.elemento.remove();
            balas.splice(b, 1);
        }
    }

// --- LÓGICA E ANIMAÇÃO DAS MOEDAS ---
for (let i = moedas.length - 1; i >= 0; i--) {
    let moeda = moedas[i]

    if (!moeda.noChao) {
        moeda.velY -= 0.6 
        moeda.y += moeda.velY
        moeda.x += moeda.velX 

        if (moeda.y <= chao + 20) { // 🌟 Adicione esta chave que faltava!
            moeda.y = chao + 20 
            moeda.velY = 0
            moeda.velX = 0
            moeda.noChao = true 
        }
    }

        moeda.timer++
        if (moeda.timer >= 8) { 
            moeda.timer = 0
            moeda.frame = (moeda.frame + 1) % spritesMoeda.length
            moeda.elemento.src = spritesMoeda[moeda.frame]
        }

        moeda.elemento.style.left = `${moeda.x}px`
        moeda.elemento.style.bottom = `${moeda.y}px`

        let distanciaX = Math.abs(protaX - moeda.x)
        let distanciaY = Math.abs(protaY - moeda.y)

        if (distanciaX < 50 && distanciaY < 80) {
            ouro++
            localStorage.setItem("ouro", ouro)
            hudOuro.innerText = `Ouro: ${ouro}`
            moeda.elemento.remove()
            moedas.splice(i, 1)
        }
    }


  // --- 4. LÓGICA E ANIMAÇÃO DAS BOLAS DE FENO (OBSTÁCULOS/COIOTES) ---
    for (let i = bolasFeno.length - 1; i >= 0; i--) {
        let bola = bolasFeno[i]
        
        // 🌟 CORREÇÃO CRÍTICA: Subtrai a velocidade para ele se mover da DIREITA para a ESQUERDA!
        bola.x -= bola.velocidade

        bola.timer++
        if (bola.timer >= 5) { 
            bola.timer = 0
            
            if (faseAtual === 2) {
                bola.frame = (bola.frame + 1) % 6; // Ambos têm animação de 6 frames
                
                if (bola.skinOriginal.includes("coioteCinza")) {
                    bola.elemento.src = `../img/coioteCinzaAndando${bola.frame + 1}.png`;
                    bola.elemento.style.transform = "scaleX(1)"; // Alinhe o scale com o Passo B
                } else if (bola.skinOriginal.includes("coioteLaranja")) {
                    bola.elemento.src = `../img/coioteLaranjaAndando${bola.frame + 1}.png`;
                    bola.elemento.style.transform = "scaleX(1)"; // Alinhe o scale com o Passo B
                }
                
                bola.elemento.style.width = "180px";
                bola.elemento.style.height = "120px";
            } else {
                bola.frame = (bola.frame + 1) % spritesFeno.length;
                bola.elemento.src = spritesFeno[bola.frame];
                bola.elemento.style.width = "60px";
                bola.elemento.style.height = "60px";
            }
        }

        bola.elemento.style.left = `${bola.x}px`
        bola.elemento.style.bottom = `${bola.y}px`

        let distanciaX = Math.abs(protaX - bola.x)
        let limiteColisao = (faseAtual === 2) ? 90 : 60; 

        if (distanciaX < limiteColisao && protaY <= chao + 40) {
            bola.elemento.remove()
            bolasFeno.splice(i, 1)
            perderVida()
            continue
        }

        // 🌟 CORREÇÃO CRÍTICA: Deleta o bicho apenas quando ele sumir completamente na ESQUERDA
        if (bola.x < -200) {
            bola.elemento.remove()
            bolasFeno.splice(i, 1)
        }
    }

    // Chama o próximo quadro passando o parâmetro de tempo implicitamente
    requestAnimationFrame(loopDoJogo);
}

function verificarMudancaDeFase() {
    if (pontos < pontosParaProximaFase) return;
    if (faseAtual >= 5) return;

    if (faseAtual === 1) {
        iniciarDialogo(cenasTransicao1_2);
        return; 
    }

    avancarDeFaseLogica();
}

function avancarDeFaseLogica() {
    pontos = 0 
    faseAtual++

    inimigos.forEach(ini => ini.elemento.remove())
    inimigos = []

    if (typeof balas !== 'undefined') {
        balas.forEach(b => b.elemento.remove())
        balas = []
    }
    if (typeof moedas !== 'undefined') {
        moedas.forEach(m => m.elemento.remove())
        moedas = []
    }

    carregarCenarioDaFase()
    hudPontos.innerText = `Points: 0/${pontosParaProximaFase}`

    protaX = 50;
    protaY = chao;
    protagonista.style.left = `${protaX}px`;
    protagonista.style.bottom = `${protaY}px`;

    iniciarContagemFase()
}

// ==========================================
// FUNÇÃO DE DANO (FALTAVA NO CÓDIGO)
// ==========================================
function perderVida() {
    if (invencivel) return; // Se estiver no tempo de piscar, ignora o dano

    vidas--;
    hudVidas.innerText = `Vidas: ${vidas} ♥`;

    if (vidas <= 0) {
        jogoPausado = true;
        menuGameOver.classList.remove("oculto");
        musicaJogo.pause();
    } else {
        // Ativa uma pequena invencibilidade temporária ao tomar dano para não morrer instantaneamente
        invencivel = true;
        
        // Garante que o jogo não trave e que o controle do teclado continue ativo
        jogoPausado = false;
        cenario.focus(); 

        const piscar = setInterval(() => {
            protagonista.style.opacity = protagonista.style.opacity === "0.3" ? "1" : "0.3";
        }, 150);

        setTimeout(() => {
            invencivel = false;
            clearInterval(piscar);
            protagonista.style.opacity = "1";
        }, 1500); // 1 segundo e meio de invencibilidade piscando
    }
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA DOS MOTORES DO JOGO
// ==========================================

// 1. Carrega o plano de fundo da Fase 1
carregarCenarioDaFase();

// 2. Inicia o loop principal de física e animações
loopDoJogo();

// 3. Inicia a contagem regressiva (3, 2, 1... ATIRE!) para liberar a Fase 1
iniciarContagemFase();

// 4. Temporizador para criar inimigos a cada 2.5 segundos
setInterval(() => {
    criarInimigo();
}, 2500);

// 5. Temporizador para criar as bolas de feno rolando a cada 4 segundos
setInterval(() => {
    criarBolaFeno(); // Adicionado os parênteses e o final do nome correto
}, 4000);