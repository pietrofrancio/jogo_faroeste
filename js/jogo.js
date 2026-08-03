// ==========================================
// 1. ELEMENTOS DO DOM (HTML)
// ==========================================
const cenario = document.getElementById("cenario")

// CORREÇÃO AQUI: 
// protagonistaHTML aponta para a DIV container (que se move)
// protagonistaIMG aponta para a TAG <img> (que muda o sprite)
const protagonistaHTML = document.getElementById("protagonistaHTML");
const protagonistaIMG = document.getElementById("protagonista");

const btnPause = document.getElementById("btnPause")
const hudVidas = document.getElementById("vidas")
const hudOuro = document.getElementById("ouro")
const hudPontos = document.getElementById("hudPontos")
const menuGameOver = document.getElementById("gameOverMenu")
const pauseTela = document.getElementById("pauseTela")
const painelPause = document.getElementById("painelPause")

if (cenario) {
    cenario.setAttribute("tabindex", "0");
    cenario.style.outline = "none";
}

// -------------------------------------------------------------
// EVITA O ERRO DE "already been declared" USANDO O ESCOPO GLOBAL
// -------------------------------------------------------------
window.personagemSelecionado = localStorage.getItem("personagemSelecionado") || "morgana";

// Dicionário completo com as expressões de cada um dos 4 heróis
// Dicionário completo de recursos padronizado com 10 sprites por ação
const dadosPersonagens = {
    morgana: {
        nome: "Morgana",
        dialogos: {
            normal: "../img/morganaNormal.png",
            seria: "../img/morganaSeria.png",
            preocupada: "../img/morganaPreocupada.png",
            gananciosa: "../img/morganaGananciosa.png"
        },
        sprites: {
            parada: "../img/morganaParada.png",
            // Correndo: Mapeado para os frames reais que ela tem (repetindo a sequência para fechar 10)
            correndo: [
                "../img/morganaCorrendo1.png",
                "../img/morganaCorrendo2.png",
                "../img/morganaCorrendo3.png",
                "../img/morganaCorrendo4.png",
                "../img/morganaCorrendo5.png",
                "../img/morganaCorrendo6.png",
                "../img/morganaCorrendo7.png",
                "../img/morganaCorrendo8.png",
                "../img/morganaCorrendo9.png",
                "../img/morganaCorrendo10.png",
                "../img/morganaCorrendo11.png"
            ],
            // Pulando: Mapeado para os frames de pulo dela (repetidos para fechar 10)
            pulando: [
                "../img/morganaPulando1.png",
                "../img/morganaPulando2.png",
                "../img/morganaPulando3.png",
                "../img/morganaPulando4.png",
                "../img/morganaPulando5.png",
                "../img/morganaPulando6.png",
            ],
            // Agachada: Caso ela use sprites do Miguel ou próprios, repetidos para fechar 10
            agachada: [
                "../img/morganaAgachada1.png",
                "../img/morganaAgachada2.png",
                "../img/morganaAgachada3.png",
            ],
            // Atirando: Repetido para fechar 10
            atirando: [
                "../img/morganaAtirando1.png",
                "../img/morganaAtirando2.png",
                "../img/morganaAtirando3.png",
                "../img/morganaAtirando4.png",
            ]
        }
    },
    miguel: {
        nome: "Miguel",
        dialogos: {
            normal: "../img/miguelNormal.png",
            seria: "../img/miguelSeria.png",
            preocupada: "../img/miguelPreocupada.png",
            gananciosa: "../img/miguelGananciosa.png"
        },
        sprites: {
            parada: "../img/miguelParada.png",
            // Correndo: Como ele tem de 1 a 9, adicionamos o frame 1 de novo no final para completar 10
            correndo: [
                "../img/miguelCorrendo1.png",
                "../img/miguelCorrendo2.png",
                "../img/miguelCorrendo3.png",
                "../img/miguelCorrendo4.png",
                "../img/miguelCorrendo5.png",
                "../img/miguelCorrendo6.png",
                "../img/miguelCorrendo7.png",
                "../img/miguelCorrendo8.png",
                "../img/miguelCorrendo9.png",
            ],
            // Pulando: Ele tem de 1 a 6. Completamos até 10 repetindo os frames iniciais
            pulando: [
                "../img/miguelPulando1.png",
                "../img/miguelPulando2.png",
                "../img/miguelPulando3.png",
                "../img/miguelPulando4.png",
                "../img/miguelPulando5.png",
                "../img/miguelPulando6.png",
            ],
            agachada: [
                "../img/miguelAgachado1.png",
                "../img/miguelAgachado2.png",
                "../img/miguelAgachado3.png",
                "../img/miguelAgachado4.png",
            ],
            atirando: [
                "../img/miguelAtirando1.png",
                "../img/miguelAtirando2.png",
                "../img/miguelAtirando3.png",
            ]
        }
    },
    ruby: {
        nome: "Ruby",
        dialogos: {
            normal: "../img/rubyNormal.png",
            seria: "../img/rubySeria.png",
            preocupada: "../img/rubyPreocupada.png",
            gananciosa: "../img/rubyGananciosa.png"
        },
        sprites: {
            parada: "../img/rubyParada.png",
            // Se a Ruby ainda não tiver sprites próprios de corrida, use os da Morgana/Miguel temporariamente. Ajuste depois!
            correndo: [
                "../img/rubyCorrendo1.png",
                "../img/rubyCorrendo2.png",
                "../img/rubyCorrendo3.png",
                "../img/rubyCorrendo4.png",
                "../img/rubyCorrendo5.png",
                "../img/rubyCorrendo6.png",
                "../img/rubyCorrendo7.png",
                "../img/rubyCorrendo8.png",
                "../img/rubyCorrendo9.png",
                "../img/rubyCorrendo10.png",
                "../img/rubyCorrendo11.png",
            ],
            pulando: [
                "../img/rubyPulando1.png",
                "../img/rubyPulando2.png",
                "../img/rubyPulando3.png",
                "../img/rubyPulando4.png",
                "../img/rubyPulando5.png",
                "../img/rubyPulando6.png",
                "../img/rubyPulando7.png",
            ],
            agachada: [
                "../img/rubyAgachada1.png",
                "../img/rubyAgachada2.png",
                "../img/rubyAgachada3.png",
                "../img/rubyAgachada4.png",
            ],
            atirando: [
                "../img/rubyAtirando1.png",
                "../img/rubyAtirando2.png",
                "../img/rubyAtirando3.png",
                "../img/rubyAtirando4.png",
            ]
        }
    },
    jack: {
        nome: "Jack",
        dialogos: {
            normal: "../img/jackNormal.png",
            seria: "../img/jackSeria.png",
            preocupada: "../img/jackPreocupada.png",
            gananciosa: "../img/jackGananciosa.png"
        },
        sprites: {
            parada: "../img/jackParada.png",
            correndo: [
                "../img/jackCorrendo1.png",
                "../img/jackCorrendo2.png",
                "../img/jackCorrendo3.png",
                "../img/jackCorrendo4.png",
                "../img/jackCorrendo5.png",
                "../img/jackCorrendo6.png",
                "../img/jackCorrendo7.png",
                "../img/jackCorrendo8.png",
                "../img/jackCorrendo9.png",
                "../img/jackCorrendo10.png",
                "../img/jackCorrendo11.png",
            ],
            pulando: [
                "../img/jackPulando1.png",
                "../img/jackPulando2.png",
                "../img/jackPulando3.png",
                "../img/jackPulando4.png",
                "../img/jackPulando5.png",
                "../img/jackPulando6.png",
                "../img/jackPulando7.png",
                "../img/jackPulando8.png",
                "../img/jackPulando9.png",
            ],
            agachada: [
                "../img/jackAgachada1.png",
                "../img/jackAgachada2.png",
                "../img/jackAgachada3.png",
                "../img/jackAgachada4.png",
                "../img/jackAgachada5.png",
                "../img/jackAgachada6.png",
            ],
            atirando: [
                "../img/jackAtirando1.png",
                "../img/jackAtirando2.png",
                "../img/jackAtirando3.png",
                "../img/jackAtirando4.png",
                "../img/jackAtirando5.png",
                "../img/jackAtirando6.png",
            ]
        }
    }
};

// Define o herói ativo usando a variável global window
// Define o herói ativo
const heroiAtivo = dadosPersonagens[window.personagemSelecionado] || dadosPersonagens.morgana;

// Mantém o objeto "protagonista" compatível com os diálogos (usando os desenhos grandes de busto)
const protagonista = heroiAtivo.dialogos;

document.addEventListener("DOMContentLoaded", () => {
    // Aplica a imagem de pixel art do herói no cenário de jogo (Gameplay)
    if (protagonistaIMG && heroiAtivo) {
        protagonistaIMG.src = heroiAtivo.sprites.parada; // Agora sim! Carrega a Morgana pequenininha em pixel art
        protagonistaIMG.alt = `Protagonista - ${heroiAtivo.nome}`;
    }

    // Corrige o painel de Game Over dinamicamente para o herói atual
    const textoGameOver = document.querySelector(".textoGameOver");
    if (textoGameOver && heroiAtivo) {
        textoGameOver.innerHTML = `
            Agora os ventos do deserto apagam os rastros de ${heroiAtivo.nome} na areia...
            <br><br>
            Deseja começar uma nova aventura?
        `;
    }
});

// ---------------- LocalStorage -----------------
let ouroEstoque = parseInt(localStorage.getItem("ouroEstoque")) || 0;
let armaSelecionada = localStorage.getItem("armaSelecionada") || "";
let velocidadeBala = armaSelecionada === "revolver" ? 28 : 18;

// ==========================================
// MODO DE JOGO: 1 OU 2 JOGADORES 
// ==========================================
const modoDoisJogadores = localStorage.getItem("modoJogo") === "2";
const protagonista2 = document.getElementById("protagonista2");
const protagonista2HTML = document.getElementById("protagonista2HTML");

if (protagonista2HTML) {
    if (modoDoisJogadores) {
        protagonista2HTML.classList.remove("oculto");
    } else {
        protagonista2HTML.classList.add("oculto");
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
        nome: protagonista.nome,
        fala: "Essa cidade já viu dias melhores",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Se aqui já está assim, imagina o que vem pela frente",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Algo me diz que esse trabalho vai longe demais...",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },
];

const cenasTransicao2_3 = [
    {
        fundo: "../img/cenario2.png",
        nome: protagonista.nome,
        fala: "O que era aquela coisa!?",
        imagem: protagonista.seria,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario2.png",
        nome: protagonista.nome,
        fala: "Coiotes eu entendo… mas pistoleiros fantasmas? Isso não é normal",
        imagem: protagonista.seria,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario2.png",
        nome: protagonista.nome,
        fala: "Mas não importa, vou seguir em frente, eu preciso encontrar todo aquele ouro",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },
];

const cenasTransicao3_4 = [
    {
        fundo: "../img/cenario3.png",
        nome: protagonista.nome,
        fala: "O que são todas essas coisas?",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario3.png",
        nome: protagonista.nome,
        fala: "Antes eram fantasmas, agora esqueletos e até camelos zumbis!?",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario3.png",
        nome: protagonista.nome,
        fala: "Tem algo de errado nesse trabalho. Cada passo me leva mais fundo e eu não sei se tem volta.",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },
];

const cenasTransicao4_5 = [
    {
        fundo: "../img/cenario4.png",
        nome: protagonista.nome,
        fala: "Se isso tá aqui fora nem quero imaginar o que tem dentro naquela mina...",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario4.png",
        nome: protagonista.nome,
        fala: "Essa coisa me trouxe até aqui, e agora é tarde demais para fugir.",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },
];

const cenasDueloFase5 = [
    {
        fundo: "../img/cenario5.png",
        nome: protagonista.nome,
        fala: "Então ela realmente existe...",
        imagem: protagonista.normal,
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
        nome: protagonista.nome,
        fala: "Quem é você!?",
        imagem: protagonista.preocupada,
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
        nome: protagonista.nome,
        fala: "O que aconteceu com esse lugar?",
        imagem: protagonista.preocupada,
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
        nome: protagonista.nome,
        fala: "E você ficou...",
        imagem: protagonista.normal,
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

    // ====================================================================
    // 1. TRADUÇÃO DINÂMICA DO PROTAGONISTA & VERSÃO GANANCIOSA (Corrigido)
    // ====================================================================
    let nomeLocutor = cena.nome;
    let imagemLocutor = cena.imagem; // Mantém a imagem padrão do diálogo como primeiro plano de segurança

    // Lista de termos que indicam que o locutor é o protagonista
    const termosProtagonista = ["Morgana", "protagonista", "player", "Protagonista", "heroi", "Heroi"];

    if (termosProtagonista.includes(cena.nome) || termosProtagonista.includes(cena.locutor) || !nomeLocutor || nomeLocutor === "undefined") {
        
        // 1. Define o Nome de forma segura
        if (typeof heroiAtivo !== 'undefined' && heroiAtivo && heroiAtivo.nome && heroiAtivo.nome !== "undefined") {
            nomeLocutor = heroiAtivo.nome;
        } else if (typeof personagemSelecionado !== 'undefined' && personagemSelecionado && personagemSelecionado !== "undefined") {
            nomeLocutor = personagemSelecionado.charAt(0).toUpperCase() + personagemSelecionado.slice(1);
        } else {
            nomeLocutor = "Ruby"; // Nome reserva caso tudo falhe
        }

        // 2. Define a Imagem de forma segura
        // Se a cena pedir especificamente a versão gananciosa
        if (cena.imagem && typeof cena.imagem === "string" && cena.imagem.toLowerCase().includes("gananciosa")) {
            const heroiNomeArquivo = (typeof personagemSelecionado !== 'undefined' && personagemSelecionado) 
                ? personagemSelecionado 
                : "morgana";
            imagemLocutor = `../img/${heroiNomeArquivo}Gananciosa.png`;
        } 
        // Caso contrário, tenta usar o sprite do herói ativo
        else if (typeof heroiAtivo !== 'undefined' && heroiAtivo && heroiAtivo.sprite) {
            imagemLocutor = heroiAtivo.sprite;
        } else if (typeof heroiAtivo !== 'undefined' && heroiAtivo && heroiAtivo.normal) {
            imagemLocutor = heroiAtivo.normal;
        }
        // Se não houver herói ativo configurado, ele NÃO mexe no `imagemLocutor`, 
        // mantendo a imagem original da cena que já estava funcionando!
    }

    // Garantia final contra strings "undefined" no nome
    if (!nomeLocutor || nomeLocutor === "undefined") {
        nomeLocutor = "Ruby";
    }

    // ====================================================================
    // 2. REGRA DO NARRADOR (Esconder o avatar quando ele falar)
    // ====================================================================
    let exibirAvatar = true;
    if (nomeLocutor === "Narrador" || nomeLocutor === "narrador" || !imagemLocutor) {
        exibirAvatar = false;
    }

    // ====================================================================
    // 3. APLICAÇÃO DOS DADOS CORRIGIDOS NA TELA
    // ====================================================================
    if (nomeEl) nomeEl.innerText = nomeLocutor;
    if (textoEl) textoEl.innerText = cena.fala; // Mantém o .fala original!

    // Tratamento seguro para aplicar a imagem de fundo da transição
    if (cenarioElemento && cena.fundo) {
        cenarioElemento.style.backgroundImage = `url('${cena.fundo}')`;
    }

    if (imgAvatar) {
        if (exibirAvatar) {
            imgAvatar.src = imagemLocutor;
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
            // Se for narrador ou não tiver imagem, oculta completamente o elemento img
            imgAvatar.style.display = "none";
        }
    }
}

function removerControlesEFechar() {
    // 1. Remove o listener do diálogo para não vazar entrada
    window.removeEventListener("keydown", gerenciarTeclasDialogo);

    const dialogoEl = document.getElementById("dialogo");
    if (dialogoEl) dialogoEl.style.display = "none";

    const imgAvatar = document.getElementById("personagem");
    if (imgAvatar) imgAvatar.style.display = "none";

    // ====================================================================
    // 2. CORREÇÃO DO PULO INFINITO (Reseta as variáveis de movimento do jogo)
    // ====================================================================
    
    if (typeof teclasPressionadas !== 'undefined') {
        teclasPressionadas["Space"] = false;
        teclasPressionadas["KeyW"] = false;
        teclasPressionadas["ArrowUp"] = false;
    }
    
    if (typeof estaPulando !== 'undefined') {
        estaPulando = false; 
    }

    if (typeof heroiAtivo !== 'undefined' && heroiAtivo) {
        if (heroiAtivo.velocidadeY) heroiAtivo.velocidadeY = 0;
        if (heroiAtivo.estaPulando) heroiAtivo.estaPulando = false;
    }

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
    // ==========================================
    // AÇÃO APÓS TERMINAR O DIÁLOGO DO DUELO
    // ==========================================
    else if (listaCenasAtiva === cenasDueloFase5) {
        // Libera a tela de transição tirando o escuro (se houver)
        if (typeof telaTransicaoElemento !== 'undefined' && telaTransicaoElemento) {
            telaTransicaoElemento.classList.remove("escuro");
        }

        // DISPARA A CONTAGEM DRAMÁTICA DA FASE 5!
        iniciarContagemFase();
    }
}

// ==========================================
// 5. PROGRESSÃO, OURO E PONTOS
// ==========================================
let ouro = 0;
let pontos = 0
let faseAtual = 5 // Declarada aqui primeiro!

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
// Array com as 6 imagens de animação do espírito flutuante
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
    // Remove o foco do botão para não dar o bug do Espaço
    btnPause.blur();

    // mudanças: tela de pause surgindo e botão de pause mudando de lugar
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

        // Força o navegador a focar no cenário do jogo
        cenario.focus()

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
    miguel: criarSprites("miguel")
}

// ==========================================
// SEGURANÇA: SÓ USAR PERSONAGENS COM SPRITES 100% PRONTOS 
// ==========================================

const PERSONAGENS_COM_SPRITES_COMPLETOS = [
    "morgana",
    "ruby",
    "jack",
    "miguel"
];
function resolverPersonagemSeguro(nomeEscolhido) {
    return PERSONAGENS_COM_SPRITES_COMPLETOS.includes(nomeEscolhido)
        ? nomeEscolhido
        : "morgana";
}

const spritesMorgana =
    personagens[resolverPersonagemSeguro(personagemSelecionado)] || personagens.morgana

const personagemSelecionadoP2 =
    localStorage.getItem("personagemSelecionadoP2") || "jack"

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

// Aumentamos a velocidade, o pulo e a gravidade para o jogo responder melhor a 60 FPS:
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

        protagonistaHTML.style.width = "";
        protagonistaHTML.style.height = "";
    }

    // Jogador 2 levanta 
    if (modoDoisJogadores && e.code === "ArrowDown") {
        agachado2 = false;
        frameAgachado2 = 0;

        protagonista2HTML.style.width = "";
        protagonista2HTML.style.height = "";
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

    let posY = chao; // Altura padrão (no chão)
    let asSprites = null; // Guardará o array de animação se houver

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

    const olhandoParaDireita = protagonistaHTML.style.transform !== "scaleX(-1)"

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

    const olhandoParaDireita = protagonista2HTML.style.transform !== "scaleX(-1)"

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

function criarVida(x, y) {
    const vida = document.createElement("img");

    vida.src = "../img/vida.png"; // coloque o nome da imagem da vida
    vida.style.position = "absolute";
    vida.style.width = "40px";
    vida.style.height = "40px";
    vida.style.left = `${x}px`;
    vida.style.bottom = `${y}px`;
    vida.style.zIndex = "4";

    cenario.appendChild(vida);

    vidasDropadas.push({
        elemento: vida,
        x,
        y
    });
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
        morgana.topo = pY + 80; // Nova altura da caixa de colisão agachada
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
faseAtual = 1 // aqui muda em q faze começa o jogoooo 
let inimigos = []
let vidaDropadaNaFase = false;
let vidasDropadas = [];

const dadosInimigos = {
    hostil1: { andando: ["../img/bandido1Andando1.png", "../img/bandido1Andando2.png", "../img/bandido1Andando3.png", "../img/bandido1Andando4.png", "../img/bandido1Andando5.png", "../img/bandido1Andando6.png", "../img/bandido1Andando7.png"], atirando: ["../img/bandido1Atirando1.png", "../img/bandido1Atirando2.png", "../img/bandido1Atirando3.png", "../img/bandido1Atirando4.png"] },
    hostil2: { andando: ["../img/bandido2Andando1.png", "../img/bandido2Andando2.png", "../img/bandido2Andando3.png", "../img/bandido2Andando4.png", "../img/bandido2Andando5.png", "../img/bandido2Andando6.png", "../img/bandido2Andando7.png"], atirando: ["../img/bandido2Atirando1.png", "../img/bandido2Atirando2.png", "../img/bandido2Atirando3.png", "../img/bandido2Atirando4.png", "../img/bandido2Atirando5.png"] },
    hostil3: { andando: ["../img/xerifeAndando1.png", "../img/xerifeAndando2.png", "../img/xerifeAndando3.png", "../img/xerifeAndando4.png", "../img/xerifeAndando5.png", "../img/xerifeAndando6.png", "../img/xerifeAndando7.png"], atirando: ["../img/xerifeAtirando1.png", "../img/xerifeAtirando2.png", "../img/xerifeAtirando3.png", "../img/xerifeAtirando4.png", "../img/xerifeAtirando5.png"] },

    // --- NOVOS INIMIGOS DA FASE 2 ---
    bandidoCavalo1: { andando: ["../img/bandidoCavalo1Andando1.png", "../img/bandidoCavalo1Andando2.png", "../img/bandidoCavalo1Andando3.png", "../img/bandidoCavalo1Andando4.png", "../img/bandidoCavalo1Andando5.png", "../img/bandidoCavalo1Andando6.png"], atirando: ["../img/bandidoCavalo1Atirando1.png", "../img/bandidoCavalo1Atirando2.png", "../img/bandidoCavalo1Atirando3.png"] },
    bandidoCavalo2: { andando: ["../img/bandidoCavalo2Andando1.png", "../img/bandidoCavalo2Andando2.png", "../img/bandidoCavalo2Andando3.png", "../img/bandidoCavalo2Andando4.png", "../img/bandidoCavalo2Andando5.png", "../img/bandidoCavalo2Andando6.png"], atirando: ["../img/bandidoCavalo2Atirando1.png", "../img/bandidoCavalo2Atirando2.png", "../img/bandidoCavalo2Atirando3.png"] },
    fantasma: { andando: ["../img/pistoleiroAndando1.png", "../img/pistoleiroAndando2.png", "../img/pistoleiroAndando3.png", "../img/pistoleiroAndando4.png", "../img/pistoleiroAndando5.png", "../img/pistoleiroAndando6.png"], atirando: ["../img/pistoleiroAtirando1.png", "../img/pistoleiroAtirando2.png",] },

    // --- NOVOS INIMIGOS DA FASE 3 ---
    cavaloEsqueleto1: { andando: ["../img/cavaloEsqueleto1andando1.png", "../img/cavaloEsqueleto1andando2.png", "../img/cavaloEsqueleto1andando3.png", "../img/cavaloEsqueleto1andando4.png", "../img/cavaloEsqueleto1andando5.png"], atirando: ["../img/cavaloEsqueleto1atirando1.png", "../img/cavaloEsqueleto1atirando2.png", "../img/cavaloEsqueleto1atirando3.png"] },
    cavaloEsqueleto2: { andando: ["../img/cavaloEsqueleto2andando1.png", "../img/cavaloEsqueleto2andando2.png", "../img/cavaloEsqueleto2andando3.png", "../img/cavaloEsqueleto2andando4.png", "../img/cavaloEsqueleto2andando5.png"], atirando: ["../img/cavaloEsqueleto2atirando1.png", "../img/cavaloEsqueleto2atirando2.png", "../img/cavaloEsqueleto2atirando3.png"] },
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
    // Adicionamos "emDialogo" (ou a variável que você usa para travar o jogo nas conversas)
    if (jogoPausado || naContagem || emTransicaoDeFase || (typeof emDialogo !== 'undefined' && emDialogo)) return;

    // =======================================================
    // LÓGICA DA FASE 5 (DUELO FINAL)
    // =======================================================
    if (faseAtual === 5) {
        const jaTemChefao = inimigos.some(ini => ini.tipo === "chefao");
        if (jaTemChefao) return; // Se já existir o Chefão no jogo, não criamos mais nada!

        const inimigoElemento = document.createElement("img");
        inimigoElemento.classList.add("inimigo");
        inimigoElemento.classList.add("chefao");

        // Define a sprite inicial do Chefão com base no objeto de animação
        if (dadosInimigos["chefao"] && dadosInimigos["chefao"].andando) {
            inimigoElemento.src = dadosInimigos["chefao"].andando[0];
        } else {
            inimigoElemento.src = "img/chefao1.png";
        }

        inimigoElemento.style.width = "280px";
        inimigoElemento.style.height = "320px";

        let posX = window.innerWidth - 350;
        inimigoElemento.style.left = `${posX}px`;
        let alturaFlutuando = chao + 40;
        inimigoElemento.style.bottom = `${alturaFlutuando}px`;
        inimigoElemento.style.transform = "scaleX(-1)";

        cenario.appendChild(inimigoElemento);

        // --- CRIAÇÃO DA BARRA DE VIDA DO CHEFÃO ---
        // Remove se por acaso já existir uma antiga
        const barraAntiga = document.getElementById("container-vida-chefao");
        if (barraAntiga) barraAntiga.remove();

        const containerVida = document.createElement("div");
        containerVida.id = "container-vida-chefao";
        containerVida.innerHTML = `
            <div id="titulo-chefao">Chefão</div>
            <div id="barra-vida-fundo">
                <div id="barra-vida-cheia"></div>
            </div>
        `;
        cenario.appendChild(containerVida);

        inimigos.push({
            elemento: inimigoElemento,
            x: posX,
            tipo: "chefao",
            estado: "andando", // Garante que o loop de animação funcione!
            frame: 0,
            timer: 0,
            timerAtaque: 0,
            vida: 25,
            velocidade: 3
        });

        console.log("O Chefão do Duelo Final nasceu com 10 de vida!");
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
        inimigoElemento.style.width = "160px";
        inimigoElemento.style.height = "140px";
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
    // Se for o chefão, sobe ele um pouco. Se for outro inimigo, mantém no chão normal!
    if (tipoSorteado === "chefao") {
        inimigoElemento.style.bottom = `${chao + 40}px`;
    } else {
        inimigoElemento.style.bottom = `${chao}px`;
    }

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

let chefaoAtivo = null; // Guardará o objeto do Chefão

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

    // ... código anterior da iniciarContagemFase() ...

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
                criarInimigo(); // Usa a criação padrão que já configura a animação e velocidade!
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
            protagonistaHTML.style.transform = "scaleX(1)";
            estaAndando = true;
        }
        if (esquerda1) {
            protaX -= velocidadeAndar;
            protagonistaHTML.style.transform = "scaleX(-1)";
            estaAndando = true;
        }
        if (protaX < 0) protaX = 0;

        if (pular1 && !pulando) {
            velY = forcaPulo;
            pulando = true;
        }
    }

    // Aplicação da gravidade e pulo (Modificado para a Fase 5)
    let chaoEfetivo = chao;
    if (typeof faseAtual !== 'undefined' && faseAtual === 5) {
        chaoEfetivo = chao - 30; // Diminui o valor para fazer o boneco andar mais perto do fundo da tela (ex: -30px)
    }

    protaY += velY;
    if (protaY > chaoEfetivo) velY -= gravidade;
    if (protaY <= chaoEfetivo) { protaY = chaoEfetivo; pulando = false; velY = 0; framePulo = 0; }

    // --- ATUALIZAÇÃO DO SPRITE VISUAL (JOGADOR 1) ---
    // LARGURA_ATIRANDO_EXTRA: os frames de "atirando" têm o braço/arma esticando bem mais
    // para os lados do que os outros estados. Se usarmos a mesma caixa de 150px, a imagem
    // inteira precisa encolher pra caber o frame mais largo. Damos mais espaço horizontal
    // só nesse estado (compensando o "left" pra não pular de posição) para o personagem
    // não parecer menor enquanto atira.
    const LARGURA_NORMAL = 150;
    const LARGURA_ATIRANDO = 220;
    const DESLOC_ATIRANDO = (LARGURA_ATIRANDO - LARGURA_NORMAL) / 2;
    let deslocLargura1 = 0;

    if (estaAtirando) {
        timerAnimacao++;
        if (timerAnimacao >= 5) {
            timerAnimacao = 0;
            frameAtirando++;
            if (frameAtirando >= heroiAtivo.sprites.atirando.length) {
                estaAtirando = false;
                frameAtirando = 0;
            }
        }
        if (estaAtirando) {
            protagonistaIMG.src = heroiAtivo.sprites.atirando[frameAtirando];
            protagonistaHTML.style.width = `${LARGURA_ATIRANDO}px`;
            protagonistaHTML.style.height = "170px";
            deslocLargura1 = DESLOC_ATIRANDO;
        }
    }
    else if (agachado) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            frameAgachado++;
            if (frameAgachado >= heroiAtivo.sprites.agachada.length) {
                frameAgachado = heroiAtivo.sprites.agachada.length - 1;
            }
        }
        protagonistaIMG.src = heroiAtivo.sprites.agachada[frameAgachado];
        // Agachada agora fica mais próxima da altura de pé (era 130px)
        protagonistaHTML.style.width = "150px";
        protagonistaHTML.style.height = "150px";
    }
    else if (pulando) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            framePulo++;
            if (framePulo >= heroiAtivo.sprites.pulando.length) {
                framePulo = heroiAtivo.sprites.pulando.length - 1;
            }
        }
        protagonistaIMG.src = heroiAtivo.sprites.pulando[framePulo];
        // NOVO TAMANHO MAIOR
        protagonistaHTML.style.width = "150px";
        protagonistaHTML.style.height = "170px";
    }
    else if (estaAndando) {
        timerAnimacao++;
        if (timerAnimacao >= 6) {
            timerAnimacao = 0;
            frameCorrendo = (frameCorrendo + 1) % heroiAtivo.sprites.correndo.length;
        }
        protagonistaIMG.src = heroiAtivo.sprites.correndo[frameCorrendo];
        // NOVO TAMANHO MAIOR
        protagonistaHTML.style.width = "150px";
        protagonistaHTML.style.height = "170px";
    }
    else {
        protagonistaIMG.src = heroiAtivo.sprites.parada;
        frameCorrendo = 0;

        // NOVO TAMANHO MAIOR
        protagonistaHTML.style.width = "150px";
        protagonistaHTML.style.height = "170px";
    }
    protagonistaHTML.style.left = `${protaX - deslocLargura1}px`;
    protagonistaHTML.style.bottom = `${protaY}px`;

    // --- 1B. MOVIMENTO E ANIMAÇÃO DO JOGADOR 2 ---
    if (modoDoisJogadores) {
        let estaAndando2 = false;

        if (!agachado2) {
            if (teclas["ArrowRight"]) {
                protaX2 += velocidadeAndar;
                protagonista2HTML.style.transform = "scaleX(1)"; // Corrigido para protagonista2HTML
                estaAndando2 = true;
            }
            if (teclas["ArrowLeft"]) {
                protaX2 -= velocidadeAndar;
                protagonista2HTML.style.transform = "scaleX(-1)"; // Corrigido para protagonista2HTML
                estaAndando2 = true;
            }
            if (protaX2 < 0) protaX2 = 0;

            if (teclas["ArrowUp"] && !pulando2) {
                velY2 = forcaPulo;
                pulando2 = true;
            }
        }

        // Física (gravidade/pulo) idêntica à do Jogador 1

        let chaoEfetivo2 = chao;
        if (typeof faseAtual !== 'undefined' && faseAtual === 5) {
            chaoEfetivo2 = chao - 30; // Aplica a mesma redução para o segundo jogador
        }

        protaY2 += velY2;
        if (protaY2 > chaoEfetivo2) velY2 -= gravidade;
        if (protaY2 <= chaoEfetivo2) { protaY2 = chaoEfetivo2; pulando2 = false; velY2 = 0; framePulo2 = 0; }

        // Sprite visual do Jogador 2
        // Mesma lógica do Jogador 1: dá mais largura à caixa durante o tiro, compensando
        // o "left" pra evitar que o personagem pareça encolher ou pular de posição.
        let deslocLargura2 = 0;

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
                protagonista2HTML.style.width = `${LARGURA_ATIRANDO}px`;
                protagonista2HTML.style.height = "170px";
                deslocLargura2 = DESLOC_ATIRANDO;
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
            // Agachada agora fica mais próxima da altura de pé (era 130px)
            protagonista2HTML.style.width = "150px";
            protagonista2HTML.style.height = "150px";
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
            protagonista2HTML.style.width = "150px";
            protagonista2HTML.style.height = "170px";
        }
        else if (estaAndando2) {
            timerAnimacao2++;
            if (timerAnimacao2 >= 6) {
                timerAnimacao2 = 0;
                frameCorrendo2 = (frameCorrendo2 + 1) % spritesJogador2.correndo.length;
            }
            protagonista2.src = spritesJogador2.correndo[frameCorrendo2];

            protagonista2HTML.style.width = "150px";
            protagonista2HTML.style.height = "170px";
        }
        else {
            protagonista2.src = spritesJogador2.parada;
            frameCorrendo2 = 0;

            protagonista2HTML.style.width = "150px";
            protagonista2HTML.style.height = "170px";
        }

        protagonista2HTML.style.left = `${protaX2 - deslocLargura2}px`;
        protagonista2HTML.style.bottom = `${protaY2}px`;
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
            let proximoX = ini.x;

            // Calcula para onde ele deveria ir normalmente
            if (alvoX > ini.x) {
                proximoX += velInimigoAtual;
                direcaoX = 1;
            } else {
                proximoX -= velInimigoAtual;
                direcaoX = -1;
            }

            // --- REGRA ESPECIAL DO CHEFÃO: LIMITES DA TELA INTEIRA ---
            if (ini.tipo === "chefao") {
                const limiteEsquerdo = 50; // Evita que ele passe totalmente da borda esquerda
                const limiteDireito = window.innerWidth - 320; // Evita que ele suma na borda direita

                if (proximoX < limiteEsquerdo) {
                    proximoX = limiteEsquerdo;
                } else if (proximoX > limiteDireito) {
                    proximoX = limiteDireito;
                }
            }

            // Aplica a nova posição calculada
            ini.x = proximoX;
        }
        else {
            direcaoX = alvoX > ini.x ? 1 : -1;
        }

        ini.timer++;

        // Define o limite da troca de sprite (24 para o Chefão, 12 para o resto)
        let limiteAnimacao = (ini.tipo === "chefao") ? 14 : 12;

        if (ini.timer >= limiteAnimacao) {
            ini.timer = 0;
            let listaSprites = dadosInimigos[ini.tipo][ini.estado];
            ini.frame = (ini.frame + 1) % listaSprites.length;
            ini.elemento.src = listaSprites[ini.frame];

            // --- CONTROLE DE TAMANHO ABSOLUTO ---
            if (ini.tipo === "bandidoCavalo1" || ini.tipo === "bandidoCavalo2" || ini.tipo === "cavaloZombie" || ini.tipo === "cavaloEsqueleto1" || ini.tipo === "cavaloEsqueleto2") {
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

                if (typeof faseAtual !== 'undefined' && faseAtual === 5) {
                    ini.elemento.style.bottom = `${chao - 30}px`;
                }
            }
        }

        ini.elemento.style.transform = `scaleX(${direcaoX})`;

        // ========================================================
        // 2.1 LÓGICA DE ATAQUE EXCLUSIVA DO CHEFÃO (DISPARO FISICO SINCRONIZADO)
        // ========================================================
        if (ini.tipo === "chefao") {
            ini.timerAtaque++;

            // Ele decide atacar a cada 180 frames (~3 segundos)
            if (ini.timerAtaque >= 180 && ini.estado === "andando") {
                ini.timerAtaque = 0;
                ini.estado = "atirando"; // Muda para o estado de ataque
                ini.frame = 0;           // Reinicia a animação de ataque
                ini.timer = 0;           // Reseta o timer de frames
                ini.disparouNoFrame = false; // Variável de controle para não disparar várias vezes na mesma animação

                // Após 1.2 segundos (tempo total da animação de ataque), ele volta a andar
                setTimeout(() => {
                    ini.estado = "andando";
                    ini.frame = 0;
                    ini.disparouNoFrame = false;
                }, 1200);
            }

            // --- SINCRONIZAÇÃO DO DISPARO COM O SPRITE DO FRAME 5 ---
            // Se ele estiver no estado de atirar, monitoramos a animação quadro a quadro
            if (ini.estado === "atirando" && !ini.disparouNoFrame) {
                // Pegamos o caminho do sprite que está sendo exibido neste frame
                let spriteAtual = ini.elemento.src;
const somTiroChefao = new Audio("../efeitos_sonoros/tiro-chefao.mp3");
                // Se o sprite atual contiver o nome "chefaoAtacando5" (ou o número do frame da imagem for o 5)
                if (spriteAtual.includes("chefaoAtacando5") || ini.frame === 4) { // frame 4 é o quinto elemento (0, 1, 2, 3, 4)
                    ini.disparouNoFrame = true; // Trava para disparar apenas uma bola por ataque
 // SOM DO TIRO DO CHEFÃO
    somTiroChefao.currentTime = 0;
    somTiroChefao.play().catch(() => {});
                    // --- CRIAÇÃO DA BOLA DE PODER ---
                    const bola = document.createElement("div");
                    bola.classList.add("bola-poder");

                    let bolaX = ini.x;
                    let bolaY = 240; // AQUI MUDA A BOLA DO CHEFÃOOOOOOOOO

                    bola.style.left = `${bolaX}px`;
                    bola.style.bottom = `${bolaY}px`;
                    cenario.appendChild(bola);

                    const direcaoDisparo = alvoX < ini.x ? -1 : 1;

                    // Move a bola de poder quadro a quadro a 60 FPS
                    const intervaloMovimento = setInterval(() => {
                        if (jogoPausado) return;

                        // Se por algum motivo a bola sumiu do cenário antes, para o timer para evitar travar o jogo
                        if (!bola || !cenario.contains(bola)) {
                            clearInterval(intervaloMovimento);
                            return;
                        }

                        bolaX += 8 * direcaoDisparo;
                        bola.style.left = `${bolaX}px`;

                        const protaHTML = document.getElementById("protagonistaHTML");

                        // SÓ roda a colisão física se o protagonista e a bola existirem fisicamente na página!
                        if (protaHTML && bola) {
                            const recProta = protaHTML.getBoundingClientRect();
                            const recBola = bola.getBoundingClientRect();

                            const colidiu = !(
                                recBola.right < recProta.left ||
                                recBola.left > recProta.right ||
                                recBola.bottom < recProta.top ||
                                recBola.top > recProta.bottom
                            );

                            if (colidiu) {
                                perderVida();
                                bola.remove();
                                clearInterval(intervaloMovimento);
                                return; // Para a execução do bloco imediatamente
                            }
                        }

                        // Remove a bola se ela passar dos limites da tela
                        if (bolaX < -100 || bolaX > window.innerWidth + 100) {
                            if (cenario.contains(bola)) {
                                bola.remove();
                            }
                            clearInterval(intervaloMovimento);
                        }
                    }, 1000 / 60);
                }
            }
        }

        // ========================================================
        // 2.2 LÓGICA DOS INIMIGOS COMUNS (NÃO CHEFÃO)
        // ========================================================
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

                        // SISTEMA DE ESQUIVA
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
        bala.x += (velocidadeBala * bala.direcao);
        bala.elemento.style.left = `${bala.x}px`;
        let balaDestruida = false;

        for (let i = inimigos.length - 1; i >= 0; i--) {
            let ini = inimigos[i];

            let distBalaX = Math.abs(bala.x - ini.x);

            let chaoInimigo = (typeof faseAtual !== 'undefined' && faseAtual === 5 && ini.tipo === "chefao") ? (chao - 30) : chao;
            let inimigoYCentro = (typeof ini.y !== 'undefined') ? (ini.y + 75) : (chaoInimigo + 75);
            let distBalaY = Math.abs(bala.y - inimigoYCentro);

            if (distBalaX < 50 && distBalaY < 90) {
                bala.elemento.remove();
                balas.splice(b, 1);
                balaDestruida = true;

                ini.vida--;

                // Onde o inimigo toma dano no seu jogo:
                if (ini.tipo === "chefao") {
                    // Calcula a porcentagem restante de vida com base no máximo de 25
                    const porcentagem = (ini.vida / 25) * 100;
                    const barraEfeito = document.getElementById("barra-vida-cheia");
                    if (barraEfeito) {
                        barraEfeito.style.width = `${porcentagem}%`;
                    }
                }

                if (ini.vida <= 0) {
                    let pontosGanhos = 0;

                    if (ini.tipo === "hostil1" || ini.tipo === "hostil2") {
                        pontosGanhos = 3;
                    } else if (ini.tipo === "hostil3" || ini.tipo === "fantasma") {
                        pontosGanhos = 5;
                    } else if (ini.tipo === "bandidoCavalo1" || ini.tipo === "bandidoCavalo2" || ini.tipo === "cavaloEsqueleto1" || ini.tipo === "cavaloEsqueleto2") {
                        pontosGanhos = 7;
                    } else if (ini.tipo === "camelo") {
                        pontosGanhos = 10;
                    } else if (ini.tipo === "zumbi1" || ini.tipo === "zumbi2" || ini.tipo === "esqueleto") {
                        pontosGanhos = 8;
                    } else if (ini.tipo === "chefao") {
                        pontosGanhos = 20;
                    }

                    pontos += pontosGanhos;
                    hudPontos.innerText = `Pontos: ${pontos}/${pontosParaProximaFase}`;

                    criarMoeda(ini.x + 40, (ini.y || chao) + 20);

                    if (!vidaDropadaNaFase && Math.random() < 0.12) {
                        criarVida(ini.x + 40, (ini.y || chao) + 20);
                        vidaDropadaNaFase = true;
                    }

                    // Remove o chefão
                    ini.elemento.remove();
                    inimigos.splice(i, 1);

                    // Se era o chefão, termina o jogo
                    if (ini.tipo === "chefao") {
                        jogoPausado = true;
                        setTimeout(() => {
                            window.location.href = "fim.html";
                        }, 500);
                        return;
                    }

                    // Caso contrário, verifica mudança de fase
                    verificarMudancaDeFase();

                    // 2. Se for o Chefão, executa uma finalização com atraso (delay)
                    function finalizarJogoVitoria() {
                        jogoPausado = true;
                        setTimeout(() => {
                            window.location.href = "fim.html";
                        }, 500);
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
            hudOuro.innerText = `Ouro: ${ouro}`;
            

            moeda.elemento.remove();
            moedas.splice(i, 1);
            somMoeda.currentTime = 0;
            somMoeda.play().catch(() => { });
        }
    }

    // --- LÓGICA DE COLETAR VIDAS ---
    for (let i = vidasDropadas.length - 1; i >= 0; i--) {
        let vida = vidasDropadas[i];
        vida.elemento.style.left = `${vida.x}px`;
        vida.elemento.style.bottom = `${vida.y}px`;

        let pegou = Math.abs(protaX - vida.x) < 50 &&
            Math.abs(protaY - vida.y) < 80;

        if (!pegou && modoDoisJogadores) {
            pegou = Math.abs(protaX2 - vida.x) < 50 &&
                Math.abs(protaY2 - vida.y) < 80;
        }

        if (pegou) {
            if (vidas < 5) {
                vidas++;
                hudVidas.innerText = textoVidas();
            }

            vida.elemento.remove();
            vidasDropadas.splice(i, 1);
        }
    }

    // --- 4. LÓGICA E ANIMAÇÃO DAS BOLAS DE FENO (OBSTÁCULOS/COIOTES/ABUTRES) ---
    for (let i = bolasFeno.length - 1; i >= 0; i--) {
        let bola = bolasFeno[i];

        bola.x -= bola.velocidade;

        if (bola.spritesAnimacao) {
            bola.timer++;

            // Configurações padrão (para os Abutres da Fase 3)
            let limiteTimer = 6;
            let largura = "120px";
            let altura = "120px";

            // Ajustes específicos se for o Espírito (Fase 4)
            if (faseAtual === 4) {
                limiteTimer = 16;
                largura = "120px";
                altura = "120px";
            }

            if (bola.timer >= limiteTimer) {
                bola.timer = 0;
                bola.frame = (bola.frame + 1) % bola.spritesAnimacao.length;
                bola.elemento.src = bola.spritesAnimacao[bola.frame];
            }

            bola.elemento.style.width = largura;
            bola.elemento.style.height = altura;
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
        salvarOuroNoEstoque();
        if (faseAtual === 1) {
            iniciarDialogo(cenasTransicao1_2);
        }
        else if (faseAtual === 2) {
            iniciarDialogo(cenasTransicao2_3);
        }
        else if (faseAtual === 3) {
            iniciarDialogo(cenasTransicao3_4);
        }
        else if (faseAtual === 4) {
            iniciarDialogo(cenasTransicao4_5);
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
    pontos = 0;
    faseAtual++;
    vidaDropadaNaFase = false; // libera um novo drop para a próxima fase

    // --- ATUALIZA A META DE PONTOS DA NOVA FASE AQUI ---
    if (faseAtual === 1) {
        pontosParaProximaFase = 40;
    } else if (faseAtual === 2) {
        pontosParaProximaFase = 80;
    } else if (faseAtual === 3) {
        pontosParaProximaFase = 120;
    } else if (faseAtual === 4) {
        pontosParaProximaFase = 160;
    }

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
    protagonistaHTML.style.left = `${protaX}px`;
    protagonistaHTML.style.bottom = `${protaY}px`;

    // Reposiciona também o Jogador 2 usando o elemento HTML correto
    if (modoDoisJogadores && protagonista2HTML) {
        protaX2 = 220;
        protaY2 = chao;
        protagonista2HTML.style.left = `${protaX2}px`;
        protagonista2HTML.style.bottom = `${protaY2}px`;
    }

    // ========================================================
    // SE FOR A FASE 5, ABRE O DIÁLOGO PRIMEIRO. SE NÃO, CONTAGEM!
    // ========================================================
    if (faseAtual === 5) {
        iniciarDialogo(cenasDueloFase5); // Começa direto conversando
    } else {
        iniciarContagemFase(); // Outras fases começam direto na contagem
    }
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

        // 1. Zera o ouro da gameplay atual
        ouro = 0;
        hudOuro.innerText = `Ouro: ${ouro}`;

        // 2. 👈 ADICIONE ESTA LINHA AQUI para deletar o ouro salvo no navegador!

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
            protagonistaHTML.style.opacity = protagonistaHTML.style.opacity === "0.3" ? "1" : "0.3";
            // Corrigido para aplicar opacidade no elemento HTML do Jogador 2
            if (modoDoisJogadores && protagonista2HTML) {
                protagonista2HTML.style.opacity = protagonistaHTML.style.opacity;
            }
        }, 150);

        setTimeout(() => {
            invencivel = false;
            clearInterval(piscar);
            protagonistaHTML.style.opacity = "1";
            // Garante o retorno da opacidade normal no HTML do Jogador 2
            if (modoDoisJogadores && protagonista2HTML) {
                protagonista2HTML.style.opacity = "1";
            }
        }, 1500); // 1 segundo e meio de invencibilidade piscando
    }
}

window.addEventListener("beforeunload", function () {
    // Se o jogo não estiver pausado por Game Over (ou seja, o jogador saiu no meio)
    // você garante que o ouro coletado até ali vá para o estoque
    if (ouro > 0 && vidas > 0) {
        let estoqueAtual = parseInt(localStorage.getItem("ouroEstoque")) || 0;
        estoqueAtual += ouro;
        localStorage.setItem("ouroEstoque", estoqueAtual);
    }
});


function salvarOuroNoEstoque() {
    // 1. Pega o estoque antigo do localStorage. Se não existir, assume 0.
    let estoqueAtual = parseInt(localStorage.getItem("ouroEstoque")) || 0;

    // 2. Soma o ouro coletado nesta partida ao estoque permanente
    estoqueAtual += ouro;

    // 3. Salva o novo total acumulado de volta no localStorage
    localStorage.setItem("ouroEstoque", estoqueAtual);

    }

function mostrarTelaFim() {
    // 1. Pausa ou para o loop do seu jogo para os inimigos pararem de se mover
    jogoPausado = true;

    // 2. Remove a barra de vida do chefão se ela ainda estiver na tela
    const barraChefao = document.getElementById("container-vida-chefao");
    if (barraChefao) barraChefao.remove();

    // 3. Remove a classe 'oculto' para fazer a tela de fim aparecer
    const telaFim = document.getElementById("tela-fim-jogo");
    if (telaFim) {
        telaFim.classList.remove("oculto");
    }
}

// Função do botão "REINICIAR"
function reiniciarPartida() {
    // Esconde a tela de fim de jogo novamente
    const telaFim = document.getElementById("tela-fim-jogo");
    if (telaFim) {
        telaFim.classList.add("oculto");
    }

    // Se o seu jogo reinicia recarregando a página (método mais limpo e seguro):
    location.reload();

    // OU se você tiver uma função própria de reset sem recarregar a página, chame ela aqui:
    // resetarVariaveisDoJogo();
}

// Função do botão "MENU PRINCIPAL"
function voltarAoMenu() {
    // Esconde a tela de fim de jogo
    const telaFim = document.getElementById("tela-fim-jogo");
    if (telaFim) {
        telaFim.classList.add("oculto");
    }

    // Redireciona para o arquivo do seu menu principal (ex: index.html ou menu.html)
    // Ajuste o nome do arquivo para o nome real do seu arquivo de menu!
    window.location.href = "index.html";
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
    criarBolaFeno();
}, 4000);