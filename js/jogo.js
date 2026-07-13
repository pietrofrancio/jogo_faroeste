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
// MODO DE JOGO: 1 OU 2 JOGADORES 
// ==========================================

const modoDoisJogadores = localStorage.getItem("modoJogo") === "2";
const protagonista2 = document.getElementById("protagonista2");

if (modoDoisJogadores) {
    protagonista2.classList.remove("oculto");
} else {
    protagonista2.classList.add("oculto");
}

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

const cenasTransicao2_3 = [
    {
        fundo: "../img/cenario2.png",
        nome: "Protagonista",
        fala: "O que era aquela coisa!?",
        imagem: "../img/morganaSeria.png", 
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario2.png",
        nome: "Protagonista",
        fala: "Coiotes eu entendo… mas pistoleiros fantasmas? Isso não é normal",
        imagem: "../img/morganaSeria.png", 
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario2.png",
        nome: "Protagonista",
        fala: "Mas não importa, vou seguir em frente, eu preciso encontrar todo aquele ouro",
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
    if (cenarioElemento && cena.fundo) {
        cenarioElemento.style.backgroundImage = `url('${cena.fundo}')`;
    }

    if (imgAvatar) {
    if (cena.imagem) {
        imgAvatar.src = cena.imagem;
        imgAvatar.style.display = "block";
        
        // Limpa os estilos antigos antes de aplicar os novos para evitar conflito
        imgAvatar.style.left = "";
        imgAvatar.style.right = "";
        
        if (cena.posicao === "direita") {
            imgAvatar.style.right = "50px";
            imgAvatar.style.transform = "scaleX(-1)";
        } else {
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
    if (listaCenasAtiva === cenasTransicao2_3) {
        avancarDeFaseLogica(); 
    }
}

// ==========================================
// 5. PROGRESSÃO, OURO E PONTOS
// ==========================================
let ouro = Number(localStorage.getItem("ouro")) || 0
let pontos = 0
let faseAtual = 1
let pontosParaProximaFase = faseAtual * 40 

hudOuro.innerText = `Ouro: ${ouro}`
hudPontos.innerText = `Pontos: 0/${pontosParaProximaFase}`

// ==========================================
// TEXTO DO HUD DE VIDAS  
// ==========================================

function textoVidas() {
    return modoDoisJogadores ? `Vidas da Equipe: ${vidas}` : `Vidas: ${vidas}`;
}

function iniciarMusica(){
    musicaJogo.play()
    window.removeEventListener("keydown", iniciarMusica)
    window.removeEventListener("mousedown", iniciarMusica)
}

window.addEventListener("keydown", iniciarMusica)
window.addEventListener("mousedown", iniciarMusica)
musicaJogo.play().catch(() => {})
const menuGameOver = document.getElementById("gameOverMenu")
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

let abutres = [] 
const spritesAbutre1 = [
    "../img/abutre1voando1.png", "../img/abutre1voando2.png", "../img/abutre1voando3.png",
    "../img/abutre1voando4.png", "../img/abutre1voando5.png", "../img/abutre1voando6.png",
    "../img/abutre1voando7.png"
]
const spritesAbutre2 = [
    "../img/abutre2voando1.png", "../img/abutre2voando2.png", "../img/abutre2voando3.png",
    "../img/abutre2voando4.png", "../img/abutre2voando5.png", "../img/abutre2voando6.png",
    "../img/abutre2voando7.png"
]

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
// ==========================================
// PERSONAGEM SELECIONADO
// ==========================================

const personagemSelecionado =
    localStorage.getItem("personagemSelecionado") || "morgana"

function criarSprites(nome){

    return{

        parada:`../img/${nome}Parada.png`,

        agachada:[
            `../img/${nome}Agachada.png`
        ],

        pulo:[
            `../img/${nome}Pulando1.png`,
            `../img/${nome}Pulando2.png`,
            `../img/${nome}Pulando3.png`,
            `../img/${nome}Pulando4.png`,
            `../img/${nome}Pulando5.png`,
            `../img/${nome}Pulando6.png`
        ],

        correndo:[
            `../img/${nome}Correndo1.png`,
            `../img/${nome}Correndo2.png`,
            `../img/${nome}Correndo3.png`,
            `../img/${nome}Correndo4.png`,
            `../img/${nome}Correndo5.png`,
            `../img/${nome}Correndo6.png`,
            `../img/${nome}Correndo7.png`,
            `../img/${nome}Correndo8.png`,
            `../img/${nome}Correndo9.png`,
            `../img/${nome}Correndo10.png`,
            `../img/${nome}Correndo11.png`
        ],

        atirando:[
            `../img/${nome}Atirando1.png`,
            `../img/${nome}Atirando2.png`,
            `../img/${nome}Atirando3.png`,
            `../img/${nome}Atirando4.png`
        ]

    }

}

const personagens = {
    morgana: criarSprites("morgana"),
    ruby: criarSprites("ruby"),
    jack: criarSprites("jack")
}

// ==========================================
// SEGURANÇA: SÓ USAR PERSONAGENS COM SPRITES 100% PRONTOS 
// ==========================================

const PERSONAGENS_COM_SPRITES_COMPLETOS = ["morgana"];

function resolverPersonagemSeguro(nomeEscolhido) {
    return PERSONAGENS_COM_SPRITES_COMPLETOS.includes(nomeEscolhido)
        ? nomeEscolhido
        : "morgana";
}

const spritesMorgana =
    personagens[resolverPersonagemSeguro(personagemSelecionado)] || personagens.morgana

const personagemSelecionadoP2 =
    localStorage.getItem("personagemSelecionadoP2") || "morgana"

const spritesJogador2 =
    personagens[resolverPersonagemSeguro(personagemSelecionadoP2)] || personagens.morgana

console.log("Personagem salvo (Jogador 1):", personagemSelecionado);
console.log("Personagem salvo (Jogador 2):", personagemSelecionadoP2);
console.log(personagens);

let frameCorrendo = 0; let framePulo = 0; let frameAtirando = 0; let frameAgachado = 0; 
let estaAtirando = false; let timerAnimacao = 0;
const velocidadFrame = 14; const velocidadTiro = 10;

// ==========================================
// VARIÁVEIS DE CONTROLE DO JOGO (AJUSTADAS)
// ==========================================
let vidas = 5

hudVidas.innerText = textoVidas();

const chao = 100
let protaX = 50; let protaY = chao; let velY = 0
let pulando = false
let agachado = false; 
const gravidade = 1.4;         // Antes era 0.5
const forcaPulo = 26;         // Antes era 18
const velocidadeAndar = 10;     // Antes era 4

// ==========================================
// VARIÁVEIS DO JOGADOR 2
// ==========================================

let frameCorrendo2 = 0; let framePulo2 = 0; let frameAtirando2 = 0; let frameAgachado2 = 0;
let estaAtirando2 = false; let timerAnimacao2 = 0;

let protaX2 = 220; let protaY2 = chao; let velY2 = 0; // Nasce um pouco à frente do Jogador 1
let pulando2 = false;
let agachado2 = false;

// ==========================================
// CONTROLES (Teclado e Mouse)
// ==========================================
let teclas = {}

// --- NO EVENTO KEYDOWN ---
window.addEventListener("keydown", (e) => {
    if (emTransicaoDeFase || jogoPausado || naContagem) return;

    teclas[e.code] = true;

    const teclaAgacharJogador1 = modoDoisJogadores
        ? e.code === "KeyS"
        : (e.code === "ArrowDown" || e.code === "KeyS");

    if (teclaAgacharJogador1 && !pulando) {
        // Se ele acabou de agachar agora, reseta o frame da animação
        if (!agachado) {
            frameAgachado = 0;
            timerAnimacao = 0;
        }
        agachado = true;
    }

    // Tiro do Jogador 1: tecla ESPAÇO (funciona igual nos dois modos).
    if (e.code === "Space" && !estaAtirando) {
        estaAtirando = true;
        frameAtirando = 0;
        timerAnimacao = 0;
        criarBala();
        somTiro.currentTime = 0;
        somTiro.play().catch(() => {});
    }

    // ==========================================
    // CONTROLES DO JOGADOR 2 
    // ==========================================
    if (modoDoisJogadores) {
        // Agachar: Seta pra baixo
        if (e.code === "ArrowDown" && !pulando2) {
            if (!agachado2) {
                frameAgachado2 = 0;
                timerAnimacao2 = 0;
            }
            agachado2 = true;
        }

        // Atirar: tecla ENTER 
        if (e.code === "Enter" && !estaAtirando2) {
            estaAtirando2 = true;
            frameAtirando2 = 0;
            timerAnimacao2 = 0;
            criarBala2();
            somTiro.currentTime = 0;
            somTiro.play().catch(() => {});
        }
    }
});

// --- NO EVENTO KEYUP ---
window.addEventListener("keyup", (e) => {
    if (emTransicaoDeFase) return;
    teclas[e.code] = false;

    const teclaAgacharJogador1 = modoDoisJogadores
        ? e.code === "KeyS"
        : (e.code === "ArrowDown" || e.code === "KeyS");

    if (teclaAgacharJogador1) {
        agachado = false;
        frameAgachado = 0; // Reseta para a próxima vez que agachar
    }

    // Jogador 2 levanta 
    if (modoDoisJogadores && e.code === "ArrowDown") {
        agachado2 = false;
        frameAgachado2 = 0;
    }
});

// ==========================================
// TIRO DO JOGADOR 1 COM O MOUSE  
// ==========================================

cenario.addEventListener("mousedown", () => {
    if (!modoDoisJogadores) return;
    if (emTransicaoDeFase || jogoPausado || naContagem) return;
    if (estaAtirando) return;

    estaAtirando = true;
    frameAtirando = 0;
    timerAnimacao = 0;
    criarBala();
    somTiro.currentTime = 0;
    somTiro.play().catch(() => {});
});

let balas = [] 

function criarBolaFeno() { 
    if (emTransicaoDeFase || jogoPausado) return;
    const fenoElemento = document.createElement("img")
    fenoElemento.className = "bola-feno"

    let posY = chao; // Altura padrão (no chão)
    let asSprites = null; // Guardará o array de animação se for abutre

    if (faseAtual === 2) {
        // --- COIOTES DA FASE 2 ---
        const skinsCoiote = [
            "../img/coioteCinzaAndando1.png",
            "../img/coioteLaranjaAndando1.png"
        ];
        const skinSorteada = skinsCoiote[Math.floor(Math.random() * skinsCoiote.length)];
        fenoElemento.src = skinSorteada;
        
        fenoElemento.style.width = "180px";  
        fenoElemento.style.height = "120px";
        
        if (skinSorteada.includes("coioteCinza") || skinSorteada.includes("coioteLaranja")) {
            fenoElemento.style.transform = "scaleX(-1)"; 
        }
    } 
    else if (faseAtual === 3) {
        // --- ABUTRES DA FASE 3 ---
        // Sorteia entre o tipo 1 e o tipo 2
        const tipoAbutre = Math.random() > 0.5 ? 1 : 2;
        if (tipoAbutre === 1) {
            asSprites = spritesAbutre1;
        } else {
            asSprites = spritesAbutre2;
        }

        fenoElemento.src = asSprites[0]; // Começa na primeira sprite
        fenoElemento.style.width = "120px";  // Mantém o tamanho ajustado para o voo
        fenoElemento.style.height = "120px";
        fenoElemento.style.transform = "none";

        // Faz ele voar: Sorteia uma altura no céu (entre 220px e 320px)
        posY = Math.floor(Math.random() * (320 - 220 + 1)) + 220;
    } 
    else {
        // --- BOLA DE FENO PADRÃO (FASE 1 E DEMAIS) ---
        fenoElemento.src = spritesFeno[0];
        fenoElemento.style.width = "60px";  
        fenoElemento.style.height = "60px";
        fenoElemento.style.transform = "none";
    } 
    
    fenoElemento.style.position = "absolute";
    fenoElemento.style.zIndex = "4";
    
    let posX = window.innerWidth + 50;

    fenoElemento.style.bottom = `${posY}px`;
    fenoElemento.style.left = `${posX}px`;

    cenario.appendChild(fenoElemento);

    bolasFeno.push({
        elemento: fenoElemento,
        x: posX,
        y: posY,
        velocidade: 10, 
        frame: 0,      
        timer: 0,
        skinOriginal: fenoElemento.src,
        spritesAnimacao: asSprites // Passa o array de 7 imagens certinho
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

// ==========================================
// TIRO DO JOGADOR 2 
// ==========================================

function criarBala2() {
    const balaElemento = document.createElement("div")
    balaElemento.classList.add("bala")

    const olhandoParaDireita = protagonista2.style.transform !== "scaleX(-1)"

    let balaX = protaX2 + (olhandoParaDireita ? 100 : 20)
    let balaY = protaY2 + 75

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
// COLISÃO JOGADOR <-> BOLA DE FENO/OBSTÁCULO  
// ==========================================

function jogadorColidiuComObstaculo(px, py, estaAgachado, bola) {
    let distX = Math.abs(px - bola.x);
    let distY = Math.abs(py - bola.y);
    let limiteX = (faseAtual === 2) ? 90 : 60;

    if (bola.spritesAnimacao) {
        // Abutres (obstáculo que voa): caixa de colisão fixa, não importa se está agachado
        return distX < 60 && distY < 60;
    }

    // Feno normal ou coiotes altos: se o jogador estiver agachado, passa reto sem tirar vida!
    return distX < limiteX && py <= chao + 40 && !estaAgachado;
}

// ==========================================
// SISTEMA DE FASES E INIMIGOS
// ==========================================
faseAtual = 1  // aqui muda em q faze começa o jogoooo 
let inimigos = []

const dadosInimigos = {
    hostil1: { andando: ["../img/bandido1Andando1.png", "../img/bandido1Andando2.png", "../img/bandido1Andando3.png", "../img/bandido1Andando4.png", "../img/bandido1Andando5.png", "../img/bandido1Andando6.png", "../img/bandido1Andando7.png"], atirando: ["../img/bandido1Atirando1.png", "../img/bandido1Atirando2.png", "../img/bandido1Atirando3.png", "../img/bandido1Atirando4.png"] },
    hostil2: { andando: ["../img/bandido2Andando1.png", "../img/bandido2Andando2.png", "../img/bandido2Andando3.png", "../img/bandido2Andando4.png", "../img/bandido2Andando5.png", "../img/bandido2Andando6.png", "../img/bandido2Andando7.png"], atirando: ["../img/bandido2Atirando1.png", "../img/bandido2Atirando2.png", "../img/bandido2Atirando3.png", "../img/bandido2Atirando4.png", "../img/bandido2Atirando5.png"] },
    hostil3: { andando: ["../img/xerifeAndando1.png", "../img/xerifeAndando2.png", "../img/xerifeAndando3.png", "../img/xerifeAndando4.png", "../img/xerifeAndando5.png", "../img/xerifeAndando6.png", "../img/xerifeAndando7.png"], atirando: ["../img/xerifeAtirando1.png", "../img/xerifeAtirando2.png", "../img/xerifeAtirando3.png", "../img/xerifeAtirando4.png", "../img/xerifeAtirando5.png"] },
    
   // --- NOVOS INIMIGOS DA FASE 2 ---
    bandidoCavalo1: { andando: ["../img/bandidoCavalo1Andando1.png", "../img/bandidoCavalo1Andando2.png", "../img/bandidoCavalo1Andando3.png", "../img/bandidoCavalo1Andando4.png", "../img/bandidoCavalo1Andando5.png", "../img/bandidoCavalo1Andando6.png"], atirando: ["../img/bandidoCavalo1Atirando1.png", "../img/bandidoCavalo1Atirando2.png", "../img/bandidoCavalo1Atirando3.png"] },
    bandidoCavalo2: { andando: ["../img/bandidoCavalo2Andando1.png", "../img/bandidoCavalo2Andando2.png", "../img/bandidoCavalo2Andando6.png", "../img/bandidoCavalo2Andando4.png", "../img/bandidoCavalo2Andando5.png", "../img/bandidoCavalo2Andando6.png"], atirando: ["../img/bandidoCavalo2Atirando1.png", "../img/bandidoCavalo2Atirando2.png", "../img/bandidoCavalo2Atirando3.png"] },
    fantasma:       { andando: ["../img/pistoleiroAndando1.png", "../img/pistoleiroAndando2.png", "../img/pistoleiroAndando3.png", "../img/pistoleiroAndando4.png", "../img/pistoleiroAndando5.png", "../img/pistoleiroAndando6.png"],  atirando: ["../img/pistoleiroAtirando1.png", "../img/pistoleiroAtirando2.png", ] },

   // --- NOVOS INIMIGOS DA FASE 3 ---
    cavaloEsqueleto1:       { andando: ["../img/cavaloEsqueleto1andando1.png", "../img/cavaloEsqueleto1andando2.png", "../img/cavaloEsqueleto1andando3.png", "../img/cavaloEsqueleto1andando4.png", "../img/cavaloEsqueleto1andando5.png"],  atirando: ["../img/cavaloEsqueleto1atirando1.png", "../img/cavaloEsqueleto1atirando2.png", "cavaloEsqueleto1atirando3"] },
    cavaloEsqueleto2:       { andando: ["../img/cavaloEsqueleto2andando1.png", "../img/cavaloEsqueleto2andando2.png", "../img/cavaloEsqueleto2andando3.png", "../img/cavaloEsqueleto2andando4.png", "../img/cavaloEsqueleto2andando5.png"],  atirando: ["../img/cavaloEsqueleto2atirando1.png", "../img/cavaloEsqueleto2atirando2.png", "../img/cavaloEsqueleto2atirando2.png"] },
    camelo:       { andando: ["../img/camelo1.png", "../img/camelo2.png", "../img/camelo3.png", "../img/camelo4.png", "../img/camelo5.png", "../img/camelo6.png"] },
}

const configuracaoFases = {
    1: { nome: "Cidade Empoeirada", inimigos: ["hostil1", "hostil2", "hostil3"], fundo: "url('../img/cenario1.png')" },
    2: { nome: "Sob Um Sol Escaldante", inimigos: ["bandidoCavalo1", "bandidoCavalo2", "fantasma"], fundo: "url('../img/cenario2.png')" },
    3: { nome: "Vozes Que Vêm Lá Debaixo", inimigos: ["cavaloEsqueleto1", "cavaloEsqueleto2", "camelo"], fundo: "url('../img/cenario3.png')" },
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
    if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2" || tipoSorteado === "cavaloEsqueleto1" || tipoSorteado === "cavaloEsqueleto2") {
        inimigoElemento.classList.add("inimigo-cavalo");
    } else {
        inimigoElemento.classList.add("inimigo");
    }

    inimigoElemento.src = dadosInimigos[tipoSorteado].andando[0];

    // 3. Ajustes inline de tamanho inicial no nascimento
    if (tipoSorteado === "chefao") {
        inimigoElemento.style.width = "200px";
        inimigoElemento.style.height = "200px";
    } 
    else if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2" || tipoSorteado === "cavaloEsqueleto1" || tipoSorteado === "cavaloEsqueleto2") {
        inimigoElemento.style.width = "230px";  // Força o tamanho desde o nascimento
        inimigoElemento.style.height = "170px";
    }
    else if (tipoSorteado === "camelo") {
        inimigoElemento.style.width = "240px";  // Força o tamanho do camelo desde o nascimento
        inimigoElemento.style.height = "180px";
    }
    else if (tipoSorteado === "fantasma") {
        inimigoElemento.style.width = "130px";
        inimigoElemento.style.height = "150px";
    }
    else {
        // Demais inimigos padrão
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

    // 5 e 6. Definição unificada de Velocidade e Vida 
    let vidaInimigo = 1;
    let velocidadeInimigo = 3; // Velocidade padrão de caminhada dos inimigos

    if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2" || tipoSorteado === "cavaloEsqueleto1" || tipoSorteado === "cavaloEsqueleto2") {
        vidaInimigo = 2;       // Precisam de 2 tiros
        velocidadeInimigo = 6; // Velocidade de corrida normal
    } 
    else if (tipoSorteado === "camelo") {
        vidaInimigo = 3;       // Precisa de 2 tiros
        velocidadeInimigo = 2.5; // Bem mais devagar que os demais!
    }
    else if (tipoSorteado === "coiote1" || tipoSorteado === "coiote2" || tipoSorteado === "coiote3") {
        velocidadeInimigo = 12; // Coiotes continuam super rápidos
    }

    // 7. Salva o inimigo no array principal 
    inimigos.push({
        elemento: inimigoElemento,
        x: posX,
        tipo: tipoSorteado, 
        estado: "andando",
        frame: 0,
        timer: 0,
        timerAtaque: 0,
        vida: vidaInimigo,        
        velocidade: velocidadeInimigo 
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

    const dicaControles = (modoDoisJogadores && faseAtual === 1)
        ? `<p style="font-size: 12px; color:#d4a55a; margin-top:20px; line-height:1.8; text-align:center;">
               Jogador 1: WASD para mover/pular/agachar • Clique do mouse (ou Espaço) para atirar<br>
               Jogador 2: Setas para mover/pular/agachar • Enter para atirar
           </p>`
        : "";

    telaIntro.innerHTML = `
        <h1 style="font-size: 30px; margin-bottom: 40px; color: #ffebc2; text-align: center; line-height: 1.8;">
            Fase ${faseAtual}: ${dadosFase.nome}
        </h1>
        <h2 id="textoContagem" style="font-size: 50px; color: #ffebc2;">3</h2>
        ${dicaControles}
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


    // --- 1. MOVIMENTO E ANIMAÇÃO DA PROTAGONISTA ---
    let estaAndando = false;

    // SÓ PERMITE ANDAR E PULAR SE NÃO ESTIVER AGACHADO
    if (!agachado) {

        const direita1 = modoDoisJogadores ? teclas["KeyD"] : (teclas["ArrowRight"] || teclas["KeyD"]);
        const esquerda1 = modoDoisJogadores ? teclas["KeyA"] : (teclas["ArrowLeft"] || teclas["KeyA"]);
        const pular1 = modoDoisJogadores ? teclas["KeyW"] : (teclas["ArrowUp"] || teclas["KeyW"]);

        if (direita1) { 
            protaX += velocidadeAndar; 
            protagonista.style.transform = "scaleX(1)"; 
            estaAndando = true; 
        }
        if (esquerda1) { 
            protaX -= velocidadeAndar; 
            protagonista.style.transform = "scaleX(-1)"; 
            estaAndando = true; 
        }
        if (protaX < 0) protaX = 0;

        if (pular1 && !pulando) { 
            velY = forcaPulo; 
            pulando = true; 
        }
    }

    // Aplicação da gravidade e pulo
    protaY += velY;
    if (protaY > chao) velY -= gravidade;
    if (protaY <= chao) { protaY = chao; pulando = false; velY = 0; framePulo = 0; }

    // --- ATUALIZAÇÃO DO SPRITE VISUAL 
    if (estaAtirando) {
        timerAnimacao++;
        if (timerAnimacao >= 5) {
            timerAnimacao = 0;
            frameAtirando++;
            if (frameAtirando >= spritesMorgana.atirando.length) {
                estaAtirando = false;
                frameAtirando = 0;
            }
        }
        if (estaAtirando) {
            protagonista.src = spritesMorgana.atirando[frameAtirando];
        }
    } 
    else if (agachado) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            frameAgachado++;
            // Mantém travado no último frame (totalmente agachada) enquanto segurar a seta
            if (frameAgachado >= spritesMorgana.agachada.length) {
                frameAgachado = spritesMorgana.agachada.length - 1;
            }
        }
        protagonista.src = spritesMorgana.agachada[frameAgachado];
    } 
    else if (pulando) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            framePulo++;
            if (framePulo >= spritesMorgana.pulo.length) {
                framePulo = spritesMorgana.pulo.length - 1;
            }
        }
        protagonista.src = spritesMorgana.pulo[framePulo];
    } 
    else if (estaAndando) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            frameCorrendo = (frameCorrendo + 1) % spritesMorgana.correndo.length;
        }
        protagonista.src = spritesMorgana.correndo[frameCorrendo];
    } 
    else {
        protagonista.src = spritesMorgana.parada;
    }

    protagonista.style.left = `${protaX}px`;
    protagonista.style.bottom = `${protaY}px`;

    // --- 1B. MOVIMENTO E ANIMAÇÃO DO JOGADOR 2 ---
    if (modoDoisJogadores) {
        let estaAndando2 = false;

        if (!agachado2) {
            if (teclas["ArrowRight"]) {
                protaX2 += velocidadeAndar;
                protagonista2.style.transform = "scaleX(1)";
                estaAndando2 = true;
            }
            if (teclas["ArrowLeft"]) {
                protaX2 -= velocidadeAndar;
                protagonista2.style.transform = "scaleX(-1)";
                estaAndando2 = true;
            }
            if (protaX2 < 0) protaX2 = 0;

            if (teclas["ArrowUp"] && !pulando2) {
                velY2 = forcaPulo;
                pulando2 = true;
            }
        }

        // Física (gravidade/pulo) idêntica à do Jogador 1
        protaY2 += velY2;
        if (protaY2 > chao) velY2 -= gravidade;
        if (protaY2 <= chao) { protaY2 = chao; pulando2 = false; velY2 = 0; framePulo2 = 0; }

        // Sprite visual do Jogador 2 
        if (estaAtirando2) {
            timerAnimacao2++;
            if (timerAnimacao2 >= 5) {
                timerAnimacao2 = 0;
                frameAtirando2++;
                if (frameAtirando2 >= spritesJogador2.atirando.length) {
                    estaAtirando2 = false;
                    frameAtirando2 = 0;
                }
            }
            if (estaAtirando2) {
                protagonista2.src = spritesJogador2.atirando[frameAtirando2];
            }
        }
        else if (agachado2) {
            timerAnimacao2++;
            if (timerAnimacao2 >= 6) {
                timerAnimacao2 = 0;
                frameAgachado2++;
                if (frameAgachado2 >= spritesJogador2.agachada.length) {
                    frameAgachado2 = spritesJogador2.agachada.length - 1;
                }
            }
            protagonista2.src = spritesJogador2.agachada[frameAgachado2];
        }
        else if (pulando2) {
            timerAnimacao2++;
            if (timerAnimacao2 >= 6) {
                timerAnimacao2 = 0;
                framePulo2++;
                if (framePulo2 >= spritesJogador2.pulo.length) {
                    framePulo2 = spritesJogador2.pulo.length - 1;
                }
            }
            protagonista2.src = spritesJogador2.pulo[framePulo2];
        }
        else if (estaAndando2) {
            timerAnimacao2++;
            if (timerAnimacao2 >= 6) {
                timerAnimacao2 = 0;
                frameCorrendo2 = (frameCorrendo2 + 1) % spritesJogador2.correndo.length;
            }
            protagonista2.src = spritesJogador2.correndo[frameCorrendo2];
        }
        else {
            protagonista2.src = spritesJogador2.parada;
        }

        protagonista2.style.left = `${protaX2}px`;
        protagonista2.style.bottom = `${protaY2}px`;
    }

    // --- 2. LÓGICA E ANIMAÇÃO DOS INIMIGOS ---
    for (let i = inimigos.length - 1; i >= 0; i--) {
        let ini = inimigos[i];
        
        let velInimigoAtual = (ini.velocidade !== undefined) ? ini.velocidade : 3;
        let direcaoX = 1;

        // ==========================================
        // ALVO DO INIMIGO (jogador mais próximo, no modo 2 jogadores)
        // ==========================================
        let alvoX = protaX;
        let alvoPulando = pulando;
        let alvoAgachado = agachado;

        if (modoDoisJogadores) {
            const distAteJogador1 = Math.abs(protaX - ini.x);
            const distAteJogador2 = Math.abs(protaX2 - ini.x);
            if (distAteJogador2 < distAteJogador1) {
                alvoX = protaX2;
                alvoPulando = pulando2;
                alvoAgachado = agachado2;
            }
        }

        if (ini.estado === "andando") {
            if (alvoX > ini.x) {
                ini.x += velInimigoAtual; 
                direcaoX = 1;
            } else {
                ini.x -= velInimigoAtual; 
                direcaoX = -1;
            }
        } else {
            direcaoX = alvoX > ini.x ? 1 : -1;
        }

        ini.timer++;
        if (ini.timer >= 12) {
            ini.timer = 0;
            let listaSprites = dadosInimigos[ini.tipo][ini.estado];
            ini.frame = (ini.frame + 1) % listaSprites.length;
            ini.elemento.src = listaSprites[ini.frame];

            // --- CONTROLE DE TAMANHO ABSOLUTO 
            if (ini.tipo === "bandidoCavalo1" || ini.tipo === "bandidoCavalo2" || ini.tipo === "cavaloZombie" || ini.tipo === "cavaloEsqueleto1" || ini.tipo === "cavaloEsqueleto2") {
                ini.elemento.style.width = "220px";  
                ini.elemento.style.height = "160px";
            } 
            else if (ini.tipo === "cameloZumbi") {
                ini.elemento.style.width = "240px"; 
                ini.elemento.style.height = "180px";
            }
        }

        ini.elemento.style.transform = `scaleX(${direcaoX})`;

        if (ini.tipo !== "chefao") {
            const atiradores = ["hostil1", "hostil2", "hostil3", "bandidoCavalo1", "bandidoCavalo2", "fantasma"];
            
            if (atiradores.includes(ini.tipo)) {
                ini.timerAtaque++;
                let distanciaX = Math.abs(alvoX - ini.x);

                if (distanciaX < 450) {
                    if (ini.timerAtaque >= 80 && ini.estado === "andando") {
                        ini.timerAtaque = 0;
                        ini.estado = "atirando";
                        ini.frame = 0;

                        // SISTEMA DE ESQUIVA: Não toma dano se estiver pulando OU agachada!
                        if (!alvoPulando && !alvoAgachado) perderVida();

                        setTimeout(() => {
                            ini.estado = "andando";
                            ini.frame = 0;
                        }, 800);
                    }
                } else {
                    ini.timerAtaque = 0;
                }
            }

            // --- COLISÃO FÍSICA (INIMIGO ENCOSTOU NO JOGADOR) ---
            let colidiuFisicamente = false;

            let distFisica1X = Math.abs(protaX - ini.x);
            let distFisica1Y = Math.abs(protaY - chao);
            if (distFisica1X < 50 && distFisica1Y < 70) {
                colidiuFisicamente = true;
            }

            if (!colidiuFisicamente && modoDoisJogadores) {
                let distFisica2X = Math.abs(protaX2 - ini.x);
                let distFisica2Y = Math.abs(protaY2 - chao);
                if (distFisica2X < 50 && distFisica2Y < 70) {
                    colidiuFisicamente = true;
                }
            }

            if (colidiuFisicamente) {
                ini.elemento.remove();
                inimigos.splice(i, 1);
                perderVida(); 
                continue;
            }
        }

        if (ini.x < -200 || ini.x > window.innerWidth + 200) {
            ini.elemento.remove();
            inimigos.splice(i, 1);
            continue;
        }

        ini.elemento.style.left = `${ini.x}px`;
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
                bala.elemento.remove();
                balas.splice(b, 1);
                balaDestruida = true;

                ini.vida--;

                if (ini.vida <= 0) {
                    let pontosGanhos = 0;

                    if (ini.tipo === "hostil1" || ini.tipo === "hostil2") {
                        pontosGanhos = 3;
                    } else if (ini.tipo === "hostil3" || ini.tipo === "fantasma") {
                        pontosGanhos = 5;
                    } else if (ini.tipo === "bandidoCavalo1" || ini.tipo === "bandidoCavalo2" || ini.tipo === "cavaloEsqueleto1" || ini.tipo === "cavaloEsqueleto2") {
                        pontosGanhos = 7; 
                    } else if (ini.tipo === "cameloZumbi") { 
                        pontosGanhos = 10; 
                    } else if (ini.tipo === "chefao") {
                        pontosGanhos = 20;
                    }

                    pontos += pontosGanhos;
                    hudPontos.innerText = `Pontos: ${pontos}/${pontosParaProximaFase}`;

                    criarMoeda(ini.x + 40, chao + 20);
                    
                    ini.elemento.remove();
                    inimigos.splice(i, 1);

                    verificarMudancaDeFase();

                    if (ini.tipo === "chefao") {
                        alert("Parabéns! Você derrotou o Chefão com seus poderes e salvou o dia!");
                        location.reload();
                    }
                }
                break; 
            }
        }

        if (balaDestruida) continue;

        if (bala.x > window.innerWidth || bala.x < -50) {
            bala.elemento.remove();
            balas.splice(b, 1);
        }
    }

    // --- LÓGICA E ANIMAÇÃO DAS MOEDAS ---
    for (let i = moedas.length - 1; i >= 0; i--) {
        let moeda = moedas[i];

        if (!moeda.noChao) {
            moeda.velY -= 0.6; 
            moeda.y += moeda.velY;
            moeda.x += moeda.velX; 

            if (moeda.y <= chao + 20) { 
                moeda.y = chao + 20; 
                moeda.velY = 0;
                moeda.velX = 0;
                moeda.noChao = true; 
            }
        }

        moeda.timer++;
        if (moeda.timer >= 8) { 
            moeda.timer = 0;
            moeda.frame = (moeda.frame + 1) % spritesMoeda.length;
            moeda.elemento.src = spritesMoeda[moeda.frame];
        }

        moeda.elemento.style.left = `${moeda.x}px`;
        moeda.elemento.style.bottom = `${moeda.y}px`;

        let pegouMoeda = false;

        let distanciaX1 = Math.abs(protaX - moeda.x);
        let distanciaY1 = Math.abs(protaY - moeda.y);
        if (distanciaX1 < 50 && distanciaY1 < 80) pegouMoeda = true;

        if (!pegouMoeda && modoDoisJogadores) {
            let distanciaX2 = Math.abs(protaX2 - moeda.x);
            let distanciaY2 = Math.abs(protaY2 - moeda.y);
            if (distanciaX2 < 50 && distanciaY2 < 80) pegouMoeda = true;
        }

        if (pegouMoeda) {
            ouro++;
            localStorage.setItem("ouro", ouro);
            hudOuro.innerText = `Ouro: ${ouro}`;
            moeda.elemento.remove();
            moedas.splice(i, 1);
        }
    }

    // --- 4. LÓGICA E ANIMAÇÃO DAS BOLAS DE FENO (OBSTÁCULOS/COIOTES/ABUTRES) ---
    for (let i = bolasFeno.length - 1; i >= 0; i--) {
        let bola = bolasFeno[i];
        
        bola.x -= bola.velocidade;

        if (bola.spritesAnimacao) { 
            bola.timer++;
            if (bola.timer >= 6) { 
                bola.timer = 0;
                bola.frame = (bola.frame + 1) % bola.spritesAnimacao.length; 
                bola.elemento.src = bola.spritesAnimacao[bola.frame];
            }
            bola.elemento.style.width = "120px";
            bola.elemento.style.height = "120px";
            bola.elemento.style.transform = "none";
        } 
        else if (faseAtual === 2) {
            bola.timer++;
            if (bola.timer >= 5) { 
                bola.timer = 0;
                bola.frame = (bola.frame + 1) % 6; 
                
                if (bola.skinOriginal.includes("coioteCinza")) {
                    bola.elemento.src = `../img/coioteCinzaAndando${bola.frame + 1}.png`;
                } else if (bola.skinOriginal.includes("coioteLaranja")) {
                    bola.elemento.src = `../img/coioteLaranjaAndando${bola.frame + 1}.png`;
                }
            }
            bola.elemento.style.width = "180px";
            bola.elemento.style.height = "120px";
            bola.elemento.style.transform = "scaleX(1)";
        } 
        else {
            bola.timer++;
            if (bola.timer >= 5) { 
                bola.timer = 0;
                bola.frame = (bola.frame + 1) % spritesFeno.length;
                bola.elemento.src = spritesFeno[bola.frame];
            }
            bola.elemento.style.width = "60px";
            bola.elemento.style.height = "60px";
            bola.elemento.style.transform = "none";
        }

        bola.elemento.style.left = `${bola.x}px`;
        bola.elemento.style.bottom = `${bola.y}px`;

        let colidiu = jogadorColidiuComObstaculo(protaX, protaY, agachado, bola);
        if (!colidiu && modoDoisJogadores) {
            colidiu = jogadorColidiuComObstaculo(protaX2, protaY2, agachado2, bola);
        }

        if (colidiu) {
            bola.elemento.remove();
            bolasFeno.splice(i, 1);
            perderVida();
            continue;
        }

        if (bola.x < -200) {
            bola.elemento.remove();
            bolasFeno.splice(i, 1);
        }
    }

    requestAnimationFrame(loopDoJogo);
}
function verificarMudancaDeFase() {
    if (pontos >= pontosParaProximaFase) {

        if (faseAtual === 1) {
            iniciarDialogo(cenasTransicao1_2);
        }
        else if (faseAtual === 2) {
            iniciarDialogo(cenasTransicao2_3);
        }
        else if (faseAtual < 5) {
            avancarDeFaseLogica();
        }
        else {
            alert("Parabéns! Você concluiu o jogo!");
            location.reload();
        }
    }
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
    hudPontos.innerText = `Pontos: 0/${pontosParaProximaFase}`

    protaX = 50;
    protaY = chao;
    protagonista.style.left = `${protaX}px`;
    protagonista.style.bottom = `${protaY}px`;

    // Reposiciona também o Jogador 2 
    if (modoDoisJogadores) {
        protaX2 = 220;
        protaY2 = chao;
        protagonista2.style.left = `${protaX2}px`;
        protagonista2.style.bottom = `${protaY2}px`;
    }

    iniciarContagemFase()
}

// ==========================================
// FUNÇÃO DE DANO 
// ==========================================
function perderVida() {
    if (invencivel) return; // Se estiver no tempo de piscar, ignora o dano

    vidas--;
    hudVidas.innerText = textoVidas();

    if (vidas <= 0) {
    vidas = 0;
    hudVidas.innerText = textoVidas();

    // Zera o ouro
    ouro = 0;
    localStorage.setItem("ouro", ouro);
    hudOuro.innerText = `Ouro: ${ouro}`;

    jogoPausado = true;
    menuGameOver.classList.remove("oculto");
    musicaJogo.pause();
}else {
        // Ativa uma pequena invencibilidade temporária ao tomar dano para não morrer instantaneamente
        invencivel = true;
        
        // Garante que o jogo não trave e que o controle do teclado continue ativo
        jogoPausado = false;
        cenario.focus(); 

        const piscar = setInterval(() => {
            protagonista.style.opacity = protagonista.style.opacity === "0.3" ? "1" : "0.3";

            if (modoDoisJogadores) {
                protagonista2.style.opacity = protagonista.style.opacity;
            }
        }, 150);

        setTimeout(() => {
            invencivel = false;
            clearInterval(piscar);
            protagonista.style.opacity = "1";
            if (modoDoisJogadores) {
                protagonista2.style.opacity = "1";
            }
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