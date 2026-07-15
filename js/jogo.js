// ==========================================
// 1. ELEMENTOS DO DOM (HTML)
// ==========================================
const cenario = document.getElementById("cenario")
const protagonista = document.getElementById("protagonista")
const btnPause = document.getElementById("btnPause")
const hudVidas = document.getElementById("vidas")
const hudOuro = document.getElementById("ouro")
const hudPontos = document.getElementById("hudPontos")
const menuGameOver = document.getElementById("gameOverMenu")
const pauseTela = document.getElementById("pauseTela")
const painelPause = document.getElementById("painelPause")

cenario.setAttribute("tabindex", "0");
cenario.style.outline = "none";

// ---------------- LocalStorage -----------------
let ouroEstoque = parseInt(localStorage.getItem("ouroEstoque")) || 0;
let armaSelecionada = localStorage.getItem("armaSelecionada") || "";
let velocidadeBala = armaSelecionada === "revolver" ? 28 : 18;

// ==========================================
// MODO DE JOGO: 1 OU 2 JOGADORES 
// ==========================================
const modoDoisJogadores = localStorage.getItem("modoJogo") === "2";
const protagonista2 = document.getElementById("protagonista2");

if (protagonista2) {
    if (modoDoisJogadores) {
        protagonista2.classList.remove("oculto");
    } else {
        protagonista2.classList.add("oculto");
    }
}

// ==========================================
// 2. SISTEMA DE ÁUDIO (MÚSICA E EFEITOS)
// ==========================================
const musicaJogo = document.getElementById("musicaJogo")
const somTiro = new Audio('../efeitos_sonoros/efeito_sonoro_tiro.mp3')
const somMoeda = new Audio('../efeitos_sonoros/moeda_collect.mp3')

// Configuração de Sons //
somTiro.volume = 0.2

// Configuração da Música de Fundo (Verifica LocalStorage)
let musicaSalva = localStorage.getItem("musicaJogo")
musicaJogo.src = musicaSalva ? musicaSalva : "../music/musica_fundo1.mp3"
musicaJogo.volume = 0.2

// ==========================================
// 3. ESTADOS E CONTROLES DO JOGO
// ==========================================
let jogoPausado = false
let naContagem = false

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

const cenasTransicao3_4 = [
    {
        fundo: "../img/cenario3.png",
        nome: "Protagonista",
        fala: "O que são todas essas coisas?",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario3.png",
        nome: "Protagonista",
        fala: "Antes eram fantasmas, agora esqueletos e até camelos zumbis!?",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario3.png",
        nome: "Protagonista",
        fala: "Tem algo de errado nesse trabalho. Cada passo me leva mais fundo e eu não sei se tem volta.",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
];

const cenasTransicao4_5 = [
    {
        fundo: "../img/cenario4.png",
        nome: "Protagonista",
        fala: "Se isso tá aqui fora nem quero imaginar o que tem dentro naquela mina...",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario4.png",
        nome: "Protagonista",
        fala: "Essa coisa me trouxe até aqui, e agora é tarde demais para fugir.",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
];

const cenasDueloFase5 = [
    {
        fundo: "../img/cenario5.png",
        nome: "Morgana",
        fala: "Então ela realmente existe…",
        imagem: "../img/morganaNormal.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "...",
        fala: "Olha só, mais um atraído pelo brilho do ouro.",
        imagem: "../img/chefao.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "Morgana",
        fala: "Quem é você!?",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "O Primeiro Minerador",
        fala: "Eu fui o primeiro a encontrar a mina. Digamos que sou o que sobrou daqui.",
        imagem: "../img/chefao.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "Morgana",
        fala: "O que aconteceu com esse lugar?",
        imagem: "../img/morganaPreucupada.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "O Primeiro Minerador",
        fala: "Encontramos ouro, muito muito ouro. E levados pela ganância, cavamos mais fundo do que devíamos...",
        imagem: "../img/chefao.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "O Primeiro Minerador",
        fala: "E então… abrimos algo.",
        imagem: "../img/chefao.png",
        posicao: "direita"
    }, {
        fundo: "../img/cenario5.png",
        nome: "Morgana",
        fala: "E você ficou...",
        imagem: "../img/morganaNormal.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "O Primeiro Minerador",
        fala: "Eu tentei sair, mas a mina não deixa ninguém ir realmente embora.",
        imagem: "../img/chefao.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "O Primeiro Minerador",
        fala: "E quanto mais ouro você leva…",
        imagem: "../img/chefao.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "O Primeiro Minerador",
        fala: "Mais forte ela fica!!!",
        imagem: "../img/chefao.png",
        posicao: "direita"
    },
];

const cenasFimFase5 = [
    {
        fundo: "../img/cenario5.png",
        nome: "Protagonista",
        fala: "Os boatos eram verdadeiros… olha todo esse ouro!",
        imagem: "../img/morganaNormal.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "Protagonista",
        fala: "Bom, acho que se eu levar só um pouco, eles nem vão dar falta.",
        imagem: "../img/morganaGananciosa.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        nome: "Protagonista",
        fala: "É, acho que no final valeu a pena...",
        imagem: "../img/morganaGananciosa.png",
        posicao: "esquerda"
    },
];

const cenasFimJogo = [
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Então… ela existe?",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "Mais do que você imagina.",
        imagem: "../img/morganaGananciosa.png",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "Mas algo parece errado...",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Você...",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "O que?",
        imagem: "",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "Espera, o que está acontecendo comigo?",
        imagem: "",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Protagonista",
        fala: "Não pode ser!!!",
        imagem: "",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "E no final, a mina nunca esteve vazia.",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "Ela só estava esperando o seu contratante encontrar alguém para que a história se repetisse.",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "E agora… ela tem um novo guardião.",
        imagem: "",
        posicao: ""
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

    telaTransicaoElemento = document.getElementById("transicao-tela");
    if (!telaTransicaoElemento) {
        telaTransicaoElemento = document.createElement("div");
        telaTransicaoElemento.id = "transicao-tela";
        cenarioElemento.appendChild(telaTransicaoElemento);
    }

    if (listaDeCenas !== cenasFimFase5 && listaDeCenas !== cenasFimJogo) {
        if (typeof inimigos !== 'undefined' && inimigos) {
            inimigos.forEach(ini => { if (ini.elemento) ini.elemento.remove(); });
            inimigos = [];
        }
        if (typeof bolasFeno !== 'undefined' && bolasFeno) {
            bolasFeno.forEach(bola => { if (bola.elemento) bola.elemento.remove(); });
            bolasFeno = [];
        }
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

    // Tratamento seguro para aplicar a imagem de fundo da transição
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
    else if (listaCenasAtiva === cenasTransicao2_3) {
        avancarDeFaseLogica();
    }
    else if (listaCenasAtiva === cenasTransicao3_4) {
        avancarDeFaseLogica();
    }
    else if (listaCenasAtiva === cenasTransicao4_5) {
        avancarDeFaseLogica();
    }
    else if (listaCenasAtiva === cenasDueloFase5) {
        if (typeof telaTransicaoElemento !== 'undefined' && telaTransicaoElemento) {
            telaTransicaoElemento.classList.remove("escuro");
        }
        iniciarContagemFase();
    }

    else if (listaCenasAtiva === cenasFimFase5) {
        setTimeout(() => {
            iniciarDialogo(cenasFimJogo);
        }, 300);
    }

    // ==========================================
    // FIM DE JOGO (PLOT TWIST DO NARRADOR)
    // ==========================================
    else if (listaCenasAtiva === cenasFimJogo) {
        const boxDialogo = document.getElementById("dialogo");
        if (boxDialogo) {
            boxDialogo.classList.add("oculto");
        }

        // 2. Procura a imagem do fim do jogo e a exibe
        const imgFim = document.getElementById("tela-fim-jogo");
        if (imgFim) {
            imgFim.classList.remove("oculto");

            // 3. Quando o jogador clicar na imagem do final, o jogo reinicia!
            imgFim.addEventListener("click", () => {
                location.reload();
            });
        } else {
            // Caso esqueça de colocar a imagem no HTML, o alert serve como segurança
            alert("Parabéns! Você completou a história!");
            location.reload();
        }
    }
}

// ==========================================
// 5. PROGRESSÃO, OURO E PONTOS
// ==========================================
let ouro = 0
let pontos = 0
let faseAtual = 5

// Calcula dinamicamente antes de exibir no HUD pela primeira vez
let pontosParaProximaFase = faseAtual * 40

hudOuro.innerText = `Ouro: ${ouro}`
hudPontos.innerText = `Pontos: 0/${pontosParaProximaFase}`

// ==========================================
// TEXTO DO HUD DE VIDAS  
// ==========================================
function textoVidas() {
    return modoDoisJogadores ? `Vidas da Equipe: ${vidas}` : `Vidas: ${vidas}`;
}

function iniciarMusica() {
    musicaJogo.play()
    window.removeEventListener("keydown", iniciarMusica)
    window.removeEventListener("mousedown", iniciarMusica)
}

window.addEventListener("keydown", iniciarMusica)
window.addEventListener("mousedown", iniciarMusica)
musicaJogo.play().catch(() => { })
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

const spritesEspirito = [
    "../img/espirito1.png",
    "../img/espirito2.png",
    "../img/espirito3.png",
    "../img/espirito4.png",
    "../img/espirito5.png",
    "../img/espirito6.png"
];

const spritesEspirito2 = [
    "../img/espirito2_1.png",
    "../img/espirito2_2.png",
    "../img/espirito2_3.png",
    "../img/espirito2_4.png",
    "../img/espirito2_5.png",
    "../img/espirito2_6.png"
];

for (let i = 1; i <= totalSpritesFeno; i++) {
    spritesFeno.push(`../img/bola_feno${i}.png`)
}

// ==========================================
// BOTÃO DE PAUSE
// ==========================================
btnPause.addEventListener("click", () => {
    jogoPausado = !jogoPausado;
    btnPause.blur();

    if (jogoPausado) {
        btnPause.innerText = "▶ Continuar"
        musicaJogo.pause()
        pauseTela.classList.remove("oculto")
        painelPause.appendChild(btnPause)

    } else {
        btnPause.innerText = "⏸ Pausar"
        musicaJogo.play()
        pauseTela.classList.add("oculto");
        const hud = document.getElementById('hud');
        const ultimoElemento = hud.lastElementChild
        hud.insertBefore(btnPause, ultimoElemento);

        cenario.focus()
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

function criarSprites(nome) {

    return {

        parada: `../img/${nome}Parada.png`,

        agachada: [
            `../img/${nome}Agachada1.png`,
            `../img/${nome}Agachada2.png`,
            `../img/${nome}Agachada3.png`
        ],

        pulo: [
            `../img/${nome}Pulando1.png`,
            `../img/${nome}Pulando2.png`,
            `../img/${nome}Pulando3.png`,
            `../img/${nome}Pulando4.png`,
            `../img/${nome}Pulando5.png`,
            `../img/${nome}Pulando6.png`
        ],

        correndo: [
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

        atirando: [
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
    jack: criarSprites("jack"),
    arthur: criarSprites("arthur")
}

// ==========================================
// SEGURANÇA: SÓ USAR PERSONAGENS COM SPRITES 100% PRONTOS 
// ==========================================
const PERSONAGENS_COM_SPRITES_COMPLETOS = [
    "morgana",
    "ruby",
    "jack",
    "arthur"
];

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
// VARIÁVEIS DE CONTROLO DO JOGO (AJUSTADAS)
// ==========================================
let vidas = 5

hudVidas.innerText = textoVidas();

const chao = 100
let protaX = 50; let protaY = chao; let velY = 0
let pulando = false
let agachado = false;

const gravidade = 1.4;
const forcaPulo = 26;
const velocidadeAndar = 10;

// ==========================================
// VARIÁVEIS DO JOGADOR 2
// ==========================================
let frameCorrendo2 = 0; let framePulo2 = 0; let frameAtirando2 = 0; let frameAgachado2 = 0;
let estaAtirando2 = false; let timerAnimacao2 = 0;

let protaX2 = 220; let protaY2 = chao; let velY2 = 0;
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
        somTiro.play().catch(() => { });
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
            somTiro.play().catch(() => { });
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
        frameAgachado = 0;

        protagonista.style.width = "";
        protagonista.style.height = "";
    }

    // Jogador 2 levanta 
    if (modoDoisJogadores && e.code === "ArrowDown") {
        agachado2 = false;
        frameAgachado2 = 0;

        protagonista2.style.width = "";
        protagonista2.style.height = "";
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
    somTiro.play().catch(() => { });
});

let balas = []

function criarBolaFeno() {
    if (faseAtual === 5) return;

    // Se o jogo estiver pausado ou em transição, também não cria nada
    if (emTransicaoDeFase || jogoPausado) return;

    const fenoElemento = document.createElement("img");
    fenoElemento.className = "bola-feno";

    let posY = chao;
    let asSprites = null;

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
        // --- ABUTRE DA FASE 3 ---
        const tipoAbutre = Math.random() > 0.5 ? 1 : 2;

        if (tipoAbutre === 1) {
            asSprites = spritesAbutre1;
        } else {
            asSprites = spritesAbutre2;
        }

        fenoElemento.src = asSprites[0];
        fenoElemento.style.width = "120px";
        fenoElemento.style.height = "120px";
        fenoElemento.style.transform = "none";

        if (Math.random() > 0.5) {
            posY = chao + 100;
        } else {
            posY = chao;
        }
    }
    else if (faseAtual === 4) {
        // --- ESPÍRITOS DA FASE 4 ---
        const usarEspiritoTipo2 = Math.random() > 0.5;
        asSprites = usarEspiritoTipo2 ? spritesEspirito2 : spritesEspirito;

        fenoElemento.src = asSprites[0];
        fenoElemento.style.width = "90px";
        fenoElemento.style.height = "90px";
        fenoElemento.style.transform = "none";

        if (Math.random() > 0.5) {
            posY = chao + 85;
        } else {
            posY = chao + 5;
        }
    }
    else {
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
        spritesAnimacao: asSprites
    });
}

function criarBala() {
    const balaElemento = document.createElement("div")
    balaElemento.classList.add("bala")

    const olhandoParaDireita = protagonista.style.transform !== "scaleX(-1)"

    let balaX = protaX + (olhandoParaDireita ? 100 : 20)
    let balaY = protaY + 95

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

// ============================================================
// FUNÇÃO DE COLISÃO COM INIMIGOS
// ============================================================
function jogadorColidiuComObstaculo(pX, pY, pAgachado, bolaObj) {
    // 1. Definição da Caixa de Colisão da Morgana
    let morgana = {
        esquerda: pX + 25,
        direita: pX + 115,
        chao: pY + 15,
        topo: pY + 155
    };

    // 2. Ajuste Dinâmico se ela estiver AGACHADA
    if (pAgachado) {
        morgana.topo = pY + 80;
    }

    // 3. Definição da Caixa de Colisão do Obstáculo (Feno, Abutre ou Espírito)
    let largObstaculo = bolaObj.elemento.offsetWidth || 60;
    let altObstaculo = bolaObj.elemento.offsetHeight || 60;

    let folgaX = 15;
    let folgaY = 15;

    let obstaculo = {
        esquerda: bolaObj.x + folgaX,
        direita: bolaObj.x + largObstaculo - folgaX,
        chao: bolaObj.y + folgaY,
        topo: bolaObj.y + altObstaculo - folgaY
    };

    // 4. Lógica de Cruzamento de Caixas (AABB Collision)
    let colidiuNoEixoX = (morgana.direita > obstaculo.esquerda) && (morgana.esquerda < obstaculo.direita);
    let colidiuNoEixoY = (morgana.topo > obstaculo.chao) && (morgana.chao < obstaculo.topo);

    // Só há colisão se houver cruzamento nos dois eixos ao mesmo tempo
    return colidiuNoEixoX && colidiuNoEixoY;
}

// ==========================================
// SISTEMA DE FASES E INIMIGOS
// ==========================================
faseAtual = 5 // aqui muda em q faze começa o jogoooo 

let projeteisChefao = [];

function criarBolaPoder(chefaoX, chefaoY, viradoParaEsquerda) {
    const bola = document.createElement("div");
    bola.className = "bola-poder";

    bola.style.position = "absolute";
    bola.style.width = "45px";
    bola.style.height = "45px";
    bola.style.borderRadius = "50%";

    bola.style.backgroundColor = "#ba313d";
    bola.style.boxShadow = "0 0 20px 8px rgb(169, 44, 54), inset 0 0 10px #781414";
    bola.style.zIndex = "5";

    let alturaPoder = parseFloat(chefaoY) + 130;
    bola.style.bottom = `${alturaPoder}px`;
    bola.style.left = `${chefaoX}px`;

    cenario.appendChild(bola);

    let velocidadeReal = viradoParaEsquerda ? -12 : 12;

    projeteisChefao.push({
        elemento: bola,
        x: chefaoX,
        y: alturaPoder,
        velocidade: velocidadeReal
    });
}

let inimigos = []

const dadosInimigos = {
    hostil1: { andando: ["../img/bandido1Andando1.png", "../img/bandido1Andando2.png", "../img/bandido1Andando3.png", "../img/bandido1Andando4.png", "../img/bandido1Andando5.png", "../img/bandido1Andando6.png", "../img/bandido1Andando7.png"], atirando: ["../img/bandido1Atirando1.png", "../img/bandido1Atirando2.png", "../img/bandido1Atirando3.png", "../img/bandido1Atirando4.png"] },
    hostil2: { andando: ["../img/bandido2Andando1.png", "../img/bandido2Andando2.png", "../img/bandido2Andando3.png", "../img/bandido2Andando4.png", "../img/bandido2Andando5.png", "../img/bandido2Andando6.png", "../img/bandido2Andando7.png"], atirando: ["../img/bandido2Atirando1.png", "../img/bandido2Atirando2.png", "../img/bandido2Atirando3.png", "../img/bandido2Atirando4.png", "../img/bandido2Atirando5.png"] },
    hostil3: { andando: ["../img/xerifeAndando1.png", "../img/xerifeAndando2.png", "../img/xerifeAndando3.png", "../img/xerifeAndando4.png", "../img/xerifeAndando5.png", "../img/xerifeAndando6.png", "../img/xerifeAndando7.png"], atirando: ["../img/xerifeAtirando1.png", "../img/xerifeAtirando2.png", "../img/xerifeAtirando3.png", "../img/xerifeAtirando4.png", "../img/xerifeAtirando5.png"] },

    // --- NOVOS INIMIGOS DA FASE 2 ---
    bandidoCavalo1: { andando: ["../img/bandidoCavalo1Andando1.png", "../img/bandidoCavalo1Andando2.png", "../img/bandidoCavalo1Andando3.png", "../img/bandidoCavalo1Andando4.png", "../img/bandidoCavalo1Andando5.png", "../img/bandidoCavalo1Andando6.png"], atirando: ["../img/bandidoCavalo1Atirando1.png", "../img/bandidoCavalo1Atirando2.png", "../img/bandidoCavalo1Atirando3.png"] },
    bandidoCavalo2: { andando: ["../img/bandidoCavalo2Andando1.png", "../img/bandidoCavalo2Andando2.png", "../img/bandidoCavalo2Andando3.png", "../img/bandidoCavalo2Andando4.png", "../img/bandidoCavalo2Andando5.png", "../img/bandidoCavalo2Andando6.png"], atirando: ["../img/bandidoCavalo2Atirando1.png", "../img/bandidoCavalo2Atirando2.png", "../img/bandidoCavalo2Atirando3.png"] },
    fantasma: { andando: ["../img/pistoleiroAndando1.png", "../img/pistoleiroAndando2.png", "../img/pistoleiroAndando3.png", "../img/pistoleiroAndando4.png", "../img/pistoleiroAndando5.png", "../img/pistoleiroAndando6.png"], atirando: ["../img/pistoleiroAtirando1.png", "../img/pistoleiroAtirando2.png",] },

    // --- NOVOS INIMIGOS DA FASE 3 ---
    cavaloEsqueleto1: { andando: ["../img/cavaloEsqueleto1andando1.png", "../img/cavaloEsqueleto1andando2.png", "../img/cavaloEsqueleto1andando3.png", "../img/cavaloEsqueleto1andando4.png", "../img/cavaloEsqueleto1andando5.png"], atirando: ["../img/cavaloEsqueleto1atirando1.png", "../img/cavaloEsqueleto1atirando2.png", "cavaloEsqueleto1atirando3"] },
    cavaloEsqueleto2: { andando: ["../img/cavaloEsqueleto2andando1.png", "../img/cavaloEsqueleto2andando2.png", "../img/cavaloEsqueleto2andando3.png", "../img/cavaloEsqueleto2andando4.png", "../img/cavaloEsqueleto2andando5.png"], atirando: ["../img/cavaloEsqueleto2atirando1.png", "../img/cavaloEsqueleto2atirando2.png", "../img/cavaloEsqueleto2atirando2.png"] },
    camelo: { andando: ["../img/camelo1.png", "../img/camelo2.png", "../img/camelo3.png", "../img/camelo4.png", "../img/camelo5.png", "../img/camelo6.png"] },

    // --- NOVOS INIMIGOS DA FASE 4 ---
    zumbi1: { andando: ["../img/zumbi1.png", "../img/zumbi2.png", "../img/zumbi3.png", "../img/zumbi4.png", "../img/zumbi5.png", "../img/zumbi6.png", "../img/zumbi7.png"] },
    zumbi2: { andando: ["../img/zumbi2_1.png", "../img/zumbi2_2.png", "../img/zumbi2_3.png", "../img/zumbi2_4.png", "../img/zumbi2_5.png", "../img/zumbi2_6.png", "../img/zumbi2_7.png"] },
    esqueleto: { andando: ["../img/esqueleto1.png", "../img/esqueleto2.png", "../img/esqueleto3.png", "../img/esqueleto4.png", "../img/esqueleto5.png", "../img/esqueleto6.png", "../img/esqueleto7.png"] },

    // --- CHEFÃO DA FASE 4 ---
    chefao: { andando: ["../img/chefao1.png", "../img/chefao2.png", "../img/chefao3.png", "../img/chefao4.png", "../img/chefao5.png"], atirando: ["../img/chefaoAtacando1.png", "../img/chefaoAtacando2.png", "../img/chefaoAtacando3.png", "../img/chefaoAtacando4.png", "../img/chefaoAtacando5.png", "../img/chefaoAtacando6.png", "../img/chefaoAtacando7.png", "../img/chefaoAtacando8.png"] },
}

const configuracaoFases = {
    1: { nome: "Cidade Empoeirada", inimigos: ["hostil1", "hostil2", "hostil3"], fundo: "url('../img/cenario1.png')" },
    2: { nome: "Sob Um Sol Escaldante", inimigos: ["bandidoCavalo1", "bandidoCavalo2", "fantasma"], fundo: "url('../img/cenario2.png')" },
    3: { nome: "Vozes Que Vêm Lá Debaixo", inimigos: ["cavaloEsqueleto1", "cavaloEsqueleto2", "camelo"], fundo: "url('../img/cenario3.png')" },
    4: { nome: "Aqueles que Nunca Partiram", inimigos: ["zumbi1", "zumbi2", "esqueleto"], fundo: "url('../img/cenario4.png')" },
    5: { nome: "Veias de Ouro", inimigos: ["chefao"], fundo: "url('../img/cenario5.png')" }
}

function carregarCenarioDaFase() {
    if (configuracaoFases[faseAtual]) {
        cenario.style.backgroundImage = configuracaoFases[faseAtual].fundo
    }
}

function criarInimigo() {
    if (jogoPausado || naContagem || emTransicaoDeFase || (typeof emDialogo !== 'undefined' && emDialogo)) return;

    // =======================================================
    // LÓGICA DA FASE 5 (DUELO FINAL)
    // =======================================================
    if (faseAtual === 5) {
        const jaTemChefao = inimigos.some(ini => ini.tipo === "chefao");
        if (jaTemChefao) return;

        const inimigoElemento = document.createElement("img");
        inimigoElemento.classList.add("inimigo");
        inimigoElemento.classList.add("chefao");

        if (dadosInimigos["chefao"] && dadosInimigos["chefao"].andando) {
            inimigoElemento.src = dadosInimigos["chefao"].andando[0];
        } else {
            inimigoElemento.src = "img/chefao1.png";
        }

        inimigoElemento.style.width = "280px";
        inimigoElemento.style.height = "320px";

        let posX = window.innerWidth - 350;
        inimigoElemento.style.left = `${posX}px`;
        inimigoElemento.style.bottom = `${chao}px`;
        inimigoElemento.style.transform = "scaleX(-1)";

        cenario.appendChild(inimigoElemento);

        inimigos.push({
            elemento: inimigoElemento,
            x: posX,
            tipo: "chefao",
            estado: "andando",
            frame: 0,
            timer: 0,
            timerAtaque: 0,
            vida: 1,
            velocidade: 3
        });

        // ----------------------------------------------------------------
        // ADICIONA A BARRA DE VIDA DE RPG DO CHEFÃO DINAMICAMENTE
        // ----------------------------------------------------------------
        const chefaoHud = document.createElement("div");
        chefaoHud.id = "chefao-hud";
        chefaoHud.style.position = "absolute";
        chefaoHud.style.top = "70px";
        chefaoHud.style.left = "50%";
        chefaoHud.style.transform = "translateX(-50%)";
        chefaoHud.style.width = "450px";
        chefaoHud.style.textAlign = "center";
        chefaoHud.style.zIndex = "10";

        // Nome do Chefão acima da barra
        const chefaoNome = document.createElement("div");
        chefaoNome.innerText = "★ CHEFÃO ★";
        chefaoNome.style.color = "#ffebc2";
        chefaoNome.style.fontFamily = "'Courier New', monospace";
        chefaoNome.style.fontWeight = "bold";
        chefaoNome.style.fontSize = "22px";
        chefaoNome.style.textShadow = "2px 2px 4px #000000";
        chefaoNome.style.marginBottom = "6px";

        // Fundo cinza escuro da barra
        const barraBg = document.createElement("div");
        barraBg.style.width = "100%";
        barraBg.style.height = "16px";
        barraBg.style.backgroundColor = "#222";
        barraBg.style.border = "3px solid #a07040";
        barraBg.style.borderRadius = "6px";
        barraBg.style.overflow = "hidden";
        barraBg.style.boxShadow = "0 0 15px rgba(0,0,0,0.7)";

        // O preenchimento vermelho da vida
        const barraFg = document.createElement("div");
        barraFg.id = "chefao-vida-progresso";
        barraFg.style.width = "100%";
        barraFg.style.height = "100%";
        barraFg.style.backgroundColor = "#510808";
        barraFg.style.transition = "width 0.3s ease-out";

        barraBg.appendChild(barraFg);
        chefaoHud.appendChild(chefaoNome);
        chefaoHud.appendChild(barraBg);
        cenario.appendChild(chefaoHud);

        console.log("O Chefão do Duelo Final nasceu com a Barra de Vida ativa!");
        return;
    }

    const listaInimigosDaFase = configuracaoFases[faseAtual].inimigos;
    const tipoSorteado = listaInimigosDaFase[Math.floor(Math.random() * listaInimigosDaFase.length)];

    if (!dadosInimigos[tipoSorteado]) return;

    const inimigoElemento = document.createElement("img");

    if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2" || tipoSorteado === "cavaloEsqueleto1" || tipoSorteado === "cavaloEsqueleto2") {
        inimigoElemento.classList.add("inimigo-cavalo");
    } else {
        inimigoElemento.classList.add("inimigo");
    }

    inimigoElemento.src = dadosInimigos[tipoSorteado].andando[0];

    if (tipoSorteado === "chefao") {
        inimigoElemento.style.width = "200px";
        inimigoElemento.style.height = "200px";
    }
    else if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2" || tipoSorteado === "cavaloEsqueleto1" || tipoSorteado === "cavaloEsqueleto2") {
        inimigoElemento.style.width = "230px";
        inimigoElemento.style.height = "170px";
    }
    else if (tipoSorteado === "camelo") {
        inimigoElemento.style.width = "240px";
        inimigoElemento.style.height = "180px";
    }
    else if (tipoSorteado === "fantasma") {
        inimigoElemento.style.width = "130px";
        inimigoElemento.style.height = "150px";
    }
    else {
        inimigoElemento.style.width = "140px";
        inimigoElemento.style.height = "160px";
    }

    let direcaoInicial = "scaleX(1)";
    if (tipoSorteado === "fantasma") {
        direcaoInicial = "scaleX(-1)";
    }
    inimigoElemento.style.transform = direcaoInicial;

    let posX = window.innerWidth;
    inimigoElemento.style.left = `${posX}px`;
    inimigoElemento.style.bottom = `${chao}px`;

    cenario.appendChild(inimigoElemento);

    let vidaInimigo = 1;
    let velocidadeInimigo = 3;

    if (tipoSorteado === "bandidoCavalo1" || tipoSorteado === "bandidoCavalo2" || tipoSorteado === "cavaloEsqueleto1" || tipoSorteado === "cavaloEsqueleto2") {
        vidaInimigo = 2;
        velocidadeInimigo = 6;
    }
    else if (tipoSorteado === "camelo") {
        vidaInimigo = 3;
        velocidadeInimigo = 2.5;
    }
    else if (tipoSorteado === "coiote1" || tipoSorteado === "coiote2" || tipoSorteado === "coiote3") {
        velocidadeInimigo = 12;
    }

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

window.atualizarBarraVidaChefao = function (vidaAtual) {
    const barra = document.getElementById("chefao-vida-progresso");
    const hud = document.getElementById("chefao-hud");

    if (barra) {
        let porcentagem = (vidaAtual / 20) * 100;
        if (porcentagem < 0) porcentagem = 0;
        if (porcentagem > 100) porcentagem = 100;

        console.log(`Vida do Chefão: ${vidaAtual} / 20 (${porcentagem}%)`);

        barra.style.width = `${porcentagem}%`;

        if (porcentagem < 30) {
            barra.style.backgroundColor = "rgb(40, 5, 5)";
        }
    } else {
        console.warn("Elemento 'chefao-vida-progresso' não foi encontrado na tela!");
    }

    // Se o Chefão morreu, remove o HUD da tela suavemente
    if (vidaAtual <= 0 && hud) {
        hud.style.transition = "opacity 0.5s ease-out";
        hud.style.opacity = "0";
        setTimeout(() => {
            hud.remove();
        }, 500);
    }
};

let chefaoAtivo = null;

function iniciarContagemFase() {
    if (faseAtual === 1) pontosParaProximaFase = 40;
    else if (faseAtual === 2) pontosParaProximaFase = 80;
    else if (faseAtual === 3) pontosParaProximaFase = 120;
    else if (faseAtual === 4) pontosParaProximaFase = 160;

    // Garante que mostre "Duelo Final!" no HUD caso seja a Fase 5
    if (faseAtual < 5) {
        hudPontos.innerText = `Pontos: ${pontos}/${pontosParaProximaFase}`;
    } else {
        hudPontos.innerText = "Duelo Final!";
    }

    naContagem = true;
    jogoPausado = true;

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

            // ==========================================
            // NOVO: SE FOR A FASE 5, SPAWNA O CHEFÃO!
            // ==========================================
            if (faseAtual === 5) {
                criarInimigo();
            }

            console.log("Contagem finalizada! Jogo rodando.");
        }
    }, 1000);
}

// ==========================================
// VARIÁVEIS DE CONTROLO DE FPS 
// ==========================================
let ultimoTempoQuadro = 0;
const fpsAlvo = 60;
const intervaloQuadro = 1000 / fpsAlvo;

// ==========================================
// GAME LOOP (VERSÃO CORRIGIDA E OTIMIZADA)
// ==========================================
function loopDoJogo(tempoAtual) {
    // Garante que o loop continue rodando mesmo se estiver em transição ou pausado
    if (emTransicaoDeFase || jogoPausado || naContagem) {
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

    // Aplicação da gravidade física
    protaY += velY;
    if (protaY > chao) {
        velY -= gravidade;
    }
    if (protaY <= chao) {
        protaY = chao;
        pulando = false;
        velY = 0;
        framePulo = 0;
    }

    // --- ATUALIZAÇÃO DO SPRITE VISUAL ---
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
            if (protagonista.style.width !== "") protagonista.style.width = "";
            if (protagonista.style.height !== "") protagonista.style.height = "";
        }
    }
    else if (agachado) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            frameAgachado++;
            if (frameAgachado >= spritesMorgana.agachada.length) {
                frameAgachado = spritesMorgana.agachada.length - 1;
            }
        }
        protagonista.src = spritesMorgana.agachada[frameAgachado];
        if (protagonista.style.width !== "120px") {
            protagonista.style.width = "120px";
            protagonista.style.height = "120px";
        }
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
        if (protagonista.style.width !== "") protagonista.style.width = "";
        if (protagonista.style.height !== "") protagonista.style.height = "";
    }
    else if (estaAndando) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            frameCorrendo = (frameCorrendo + 1) % spritesMorgana.correndo.length;
        }
        protagonista.src = spritesMorgana.correndo[frameCorrendo];
        if (protagonista.style.width !== "120px") {
            protagonista.style.width = "120px";
            protagonista.style.height = "140px";
        }
    }
    else {
        protagonista.src = spritesMorgana.parada;
        frameCorrendo = 0;
        if (protagonista.style.width !== "") protagonista.style.width = "";
        if (protagonista.style.height !== "") protagonista.style.height = "";
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

        // Física do Jogador 2
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
            if (protagonista2.style.width !== "100px") {
                protagonista2.style.width = "100px";
                protagonista2.style.height = "100px";
            }
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
            if (protagonista2.style.width !== "120px") {
                protagonista2.style.width = "120px";
                protagonista2.style.height = "140px";
            }
        }
        else {
            protagonista2.src = spritesJogador2.parada;
            frameCorrendo2 = 0;
            if (protagonista2.style.width !== "") protagonista2.style.width = "";
            if (protagonista2.style.height !== "") protagonista2.style.height = "";
        }

        protagonista2.style.left = `${protaX2}px`;
        protagonista2.style.bottom = `${protaY2}px`;
    }

    // --- 2. LÓGICA E ANIMAÇÃO DOS INIMIGOS ---
    for (let i = inimigos.length - 1; i >= 0; i--) {
        let ini = inimigos[i];
        let velInimigoAtual = (ini.velocidade !== undefined) ? ini.velocidade : 3;
        let direcaoX = 1;

        // Alvo Inteligente (Mira no mais próximo)
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
        let limiteAnimacao = (ini.tipo === "chefao") ? 14 : 12;

        if (ini.timer >= limiteAnimacao) {
            ini.timer = 0;
            let listaSprites = dadosInimigos[ini.tipo][ini.estado];
            ini.frame = (ini.frame + 1) % listaSprites.length;
            ini.elemento.src = listaSprites[ini.frame];

            // Ajuste de Dimensões
            if (["bandidoCavalo1", "bandidoCavalo2", "cavaloZombie", "cavaloEsqueleto1", "cavaloEsqueleto2"].includes(ini.tipo)) {
                ini.elemento.style.width = "220px";
                ini.elemento.style.height = "160px";
            }
            else if (ini.tipo === "camelo") {
                ini.elemento.style.width = "240px";
                ini.elemento.style.height = "180px";
            }
            else if (ini.tipo === "chefao") {
                ini.elemento.style.width = "280px";
                ini.elemento.style.height = "320px";
            }
        }

        ini.elemento.style.transform = `scaleX(${direcaoX})`;

        // --- LÓGICA DE ATAQUE DO CHEFÃO ---
        if (ini.tipo === "chefao") {
            ini.timerAtaque++;
            if (ini.timerAtaque >= 180 && ini.estado === "andando") {
                ini.timerAtaque = 0;
                ini.estado = "atirando";
                ini.frame = 0;

                const estiloTransform = ini.elemento.style.transform || "";
                const viradoParaEsquerda = estiloTransform.includes("scaleX(-1)");

                setTimeout(() => {
                    if (inimigos.includes(ini)) {
                        criarBolaPoder(ini.x, ini.elemento.style.bottom, viradoParaEsquerda);
                    }
                }, 400);

                setTimeout(() => {
                    ini.estado = "andando";
                    ini.frame = 0;
                }, 1200);
            }
        }

        // --- LÓGICA DOS INIMIGOS COMUNS (ATIRADORES) ---
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

            // Colisão Física Individual
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

        // Remove inimigos que saem do limite do mapa
        if (ini.x < -200 || ini.x > window.innerWidth + 200) {
            ini.elemento.remove();
            inimigos.splice(i, 1);
            continue;
        }

        ini.elemento.style.left = `${ini.x}px`;
    }

    // --- 3. LÓGICA DOS PROJÉTEIS DOS JOGADORES ---
    for (let b = balas.length - 1; b >= 0; b--) {
        let bala = balas[b];
        bala.x += (velocidadeBala * bala.direcao);
        bala.elemento.style.left = `${bala.x}px`;
        let balaDestruida = false;

        for (let i = inimigos.length - 1; i >= 0; i--) {
            let ini = inimigos[i];
            let distBalaX = Math.abs(bala.x - ini.x);
            let inimigoYCentro = (typeof ini.y !== 'undefined') ? (ini.y + 75) : (chao + 75);
            let distBalaY = Math.abs(bala.y - inimigoYCentro);

            if (distBalaX < 50 && distBalaY < 90) {
                bala.elemento.remove();
                balas.splice(b, 1);
                balaDestruida = true;
                ini.vida--;

                if (ini.tipo === "chefao") {
                    window.atualizarBarraVidaChefao(ini.vida);
                }

                if (ini.vida <= 0) {
                    let pontosGanhos = 0;
                    if (ini.tipo === "hostil1" || ini.tipo === "hostil2") pontosGanhos = 3;
                    else if (ini.tipo === "hostil3" || ini.tipo === "fantasma") pontosGanhos = 5;
                    else if (["bandidoCavalo1", "bandidoCavalo2", "cavaloEsqueleto1", "cavaloEsqueleto2"].includes(ini.tipo)) pontosGanhos = 7;
                    else if (ini.tipo === "camelo") pontosGanhos = 10;
                    else if (["zumbi1", "zumbi2", "esqueleto"].includes(ini.tipo)) pontosGanhos = 8;
                    else if (ini.tipo === "chefao") pontosGanhos = 20;

                    pontos += pontosGanhos;
                    hudPontos.innerText = `Pontos: ${pontos}/${pontosParaProximaFase}`;

                    criarMoeda(ini.x + 40, (ini.y || chao) + 20);
                    ini.elemento.remove();
                    inimigos.splice(i, 1);

                    // Se NÃO for o chefão, segue o fluxo normal de verificar mudança de fase
                    if (ini.tipo === "chefao") {
                        const barraVida = document.getElementById("barra-vida-chefao") ||
                            document.getElementById("barra-chefao") ||
                            document.getElementById("boss-bar") ||
                            document.querySelector(".barra-chefao");

                        if (barraVida) {
                            barraVida.remove();
                        }

                        iniciarDialogo(cenasFimFase5);
                    }

                    // Se FOR o chefão, inicia as falas finais da vitória!
                    if (ini.tipo === "chefao") {
                        iniciarDialogo(cenasFimFase5);
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

    // --- 4. LÓGICA E ANIMAÇÃO DAS MOEDAS ---
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
            hudOuro.innerText = `Ouro: ${ouro}`;
            moeda.elemento.remove();
            moedas.splice(i, 1);
            somMoeda.currentTime = 0;
            somMoeda.play().catch(() => { });
        }
    }

    // --- 5. LÓGICA DAS BOLAS DE FENO (OBSTÁCULOS) ---
    for (let i = bolasFeno.length - 1; i >= 0; i--) {
        let bola = bolasFeno[i];
        bola.x -= bola.velocidade;

        if (bola.spritesAnimacao) {
            bola.timer++;
            let limiteTimer = (faseAtual === 4) ? 16 : 6;
            let dimen = "120px";

            if (bola.timer >= limiteTimer) {
                bola.timer = 0;
                bola.frame = (bola.frame + 1) % bola.spritesAnimacao.length;
                bola.elemento.src = bola.spritesAnimacao[bola.frame];
            }

            bola.elemento.style.width = dimen;
            bola.elemento.style.height = dimen;
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

    // --- 6. PROJÉTEIS DO CHEFÃO ---
    for (let j = projeteisChefao.length - 1; j >= 0; j--) {
        let proj = projeteisChefao[j];
        proj.x += proj.velocidade;
        proj.elemento.style.left = `${proj.x}px`;

        let tamanhoBola = 45;
        let colidiuP1 = false;
        let alturaProta1 = agachado ? 70 : 145;
        let topoJogador1 = protaY + alturaProta1;

        let colidiuHorizontalP1 = Math.abs((protaX + 25) - (proj.x + 22)) < 45;
        let colidiuVerticalP1 = (proj.y < topoJogador1) && ((proj.y + tamanhoBola) > protaY);

        if (colidiuHorizontalP1 && colidiuVerticalP1) colidiuP1 = true;

        let colidiuP2 = false;
        if (modoDoisJogadores) {
            let alturaProta2 = agachado2 ? 70 : 145;
            let topoJogador2 = protaY2 + alturaProta2;

            let colidiuHorizontalP2 = Math.abs((protaX2 + 25) - (proj.x + 22)) < 45;
            let colidiuVerticalP2 = (proj.y < topoJogador2) && ((proj.y + tamanhoBola) > protaY2);

            if (colidiuHorizontalP2 && colidiuVerticalP2) colidiuP2 = true;
        }

        if (colidiuP1 || colidiuP2) {
            proj.elemento.remove();
            projeteisChefao.splice(j, 1);
            perderVida();
            continue;
        }

        if (proj.x < -100) {
            proj.elemento.remove();
            projeteisChefao.splice(j, 1);
        }
    }

    requestAnimationFrame(loopDoJogo);
}

// ==========================================
// OUTRAS FUNÇÕES AUXILIARES DO MOTOR
// ==========================================
function verificarMudancaDeFase() {
    if (pontos >= pontosParaProximaFase) {
        salvarOuroNoEstoque();
        if (faseAtual === 1) iniciarDialogo(cenasTransicao1_2);
        else if (faseAtual === 2) iniciarDialogo(cenasTransicao2_3);
        else if (faseAtual === 3) iniciarDialogo(cenasTransicao3_4);
        else if (faseAtual === 4) iniciarDialogo(cenasTransicao4_5);
        else if (faseAtual < 5) avancarDeFaseLogica();
        else {
            alert("Parabéns! Você concluiu o jogo!");
            location.reload();
        }
    }
}

function avancarDeFaseLogica() {
    pontos = 0;
    faseAtual++;

    if (faseAtual === 1) pontosParaProximaFase = 40;
    else if (faseAtual === 2) pontosParaProximaFase = 80;
    else if (faseAtual === 3) pontosParaProximaFase = 120;
    else if (faseAtual === 4) pontosParaProximaFase = 160;

    inimigos.forEach(ini => ini.elemento.remove());
    inimigos = [];

    if (typeof balas !== 'undefined') {
        balas.forEach(b => b.elemento.remove());
        balas = [];
    }
    if (typeof moedas !== 'undefined') {
        moedas.forEach(m => m.elemento.remove());
        moedas = [];
    }

    carregarCenarioDaFase();

    if (faseAtual < 5) {
        hudPontos.innerText = `Pontos: 0/${pontosParaProximaFase}`;
    } else {
        hudPontos.innerText = "Duelo Final!";
    }

    protaX = 50;
    protaY = chao;
    protagonista.style.left = `${protaX}px`;
    protagonista.style.bottom = `${protaY}px`;

    if (modoDoisJogadores) {
        protaX2 = 220;
        protaY2 = chao;
        protagonista2.style.left = `${protaX2}px`;
        protagonista2.style.bottom = `${protaY2}px`;
    }

    if (faseAtual === 5) {
        iniciarDialogo(cenasDueloFase5);
    } else {
        iniciarContagemFase();
    }
}

function perderVida() {
    if (invencivel) return;

    vidas--;
    hudVidas.innerText = textoVidas();

    if (vidas <= 0) {
        vidas = 0;
        hudVidas.innerText = textoVidas();
        ouro = 0;
        hudOuro.innerText = `Ouro: ${ouro}`;

        jogoPausado = true;
        menuGameOver.classList.remove("oculto");
        musicaJogo.pause();
    } else {
        invencivel = true;
        jogoPausado = false;
        cenario.focus();

        const piscar = setInterval(() => {
            protagonista.style.opacity = protagonista.style.opacity === "0.3" ? "1" : "0.3";
            if (modoDoisJogadores && protagonista2) {
                protagonista2.style.opacity = protagonista.style.opacity;
            }
        }, 150);

        setTimeout(() => {
            invencivel = false;
            clearInterval(piscar);
            protagonista.style.opacity = "1";
            if (modoDoisJogadores && protagonista2) {
                protagonista2.style.opacity = "1";
            }
        }, 1500);
    }
}

window.addEventListener("beforeunload", function () {
    if (ouro > 0 && vidas > 0) {
        let estoqueAtual = parseInt(localStorage.getItem("ouroEstoque")) || 0;
        estoqueAtual += ouro;
        localStorage.setItem("ouroEstoque", estoqueAtual);
    }
});

function salvarOuroNoEstoque() {
    let estoqueAtual = parseInt(localStorage.getItem("ouroEstoque")) || 0;
    estoqueAtual += ouro;
    localStorage.setItem("ouroEstoque", estoqueAtual);
    ouro = 0;
    hudOuro.innerText = `Ouro: ${ouro}`;
    console.log("Estoque atualizado! Novo total: " + estoqueAtual);
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA DOS MOTORES DO JOGO
// ==========================================
carregarCenarioDaFase();
loopDoJogo();
iniciarContagemFase();

setInterval(() => {
    if (!jogoPausado && !emTransicaoDeFase && !naContagem) {
        criarInimigo();
    }
}, 2500);

setInterval(() => {
    if (!jogoPausado && !emTransicaoDeFase && !naContagem) {
        criarBolaFeno();
    }
}, 4000);