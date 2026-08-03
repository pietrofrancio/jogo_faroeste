// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const texto = document.getElementById("texto")
const fade = document.getElementById("fade")
const cenario = document.getElementById("cenario")
const nomePersonagem = document.getElementById("nome-personagem")
const imgPersonagem = document.getElementById("personagem")
const spanContinuar = document.querySelector(".continuar")
const spanPular = document.querySelector(".pular")

const rawSelection = localStorage.getItem("personagemSelecionado") || "morgana"
const personagemSelecionado = rawSelection.toLowerCase().trim()

console.log("=== DEBUG INICIAL ===");
console.log("Personagem recuperado do LocalStorage:", personagemSelecionado);

// ==========================================
// PERSONAGENS (Caminhos explícitos com ../img/)
// ==========================================

const personagens = {
    morgana: {
        nome: "Morgana",
        normal: "../img/morganaNormal.png",
        seria: "../img/morganaSeria.png",
        gananciosa: "../img/morganaGananciosa.png",
        preocupada: "../img/morganaPreocupada.png",
        maldicao1: "../img/morganaMaldicao1.png",
        maldicao2: "../img/morganaMaldicao2.png",
        maldicao3: "../img/morganaMaldicao3.png"
    },
    ruby: {
        nome: "Ruby",
        normal: "../img/rubyNormal.png",
        seria: "../img/rubySeria.png",
        gananciosa: "../img/rubyGananciosa.png",
        preocupada: "../img/rubyPreocupada.png",
        maldicao1: "../img/rubyMaldicao1.png",
        maldicao2: "../img/rubyMaldicao2.png",
        maldicao3: "../img/rubyMaldicao3.png"
    },
    jack: {
        nome: "Jack",
        normal: "../img/jackNormal.png",
        seria: "../img/jackSeria.png",
        gananciosa: "../img/jackGananciosa.png",
        preocupada: "../img/jackPreocupada.png",
        maldicao1: "../img/jackMaldicao1.png",
        maldicao2: "../img/jackMaldicao2.png",
        maldicao3: "../img/jackMaldicao3.png"
    },
    miguel: {
        nome: "Miguel",
        normal: "../img/miguelNormal.png",
        seria: "../img/miguelSeria.png",
        gananciosa: "../img/miguelGananciosa.png",
        preocupada: "../img/miguelPreocupada.png",
        maldicao1: "../img/miguelMaldicao1.png",
        maldicao2: "../img/miguelMaldicao2.png",
        maldicao3: "../img/miguelMaldicao3.png"
    }
}

// Resgata o protagonista correto. Se o LocalStorage falhar, usa o "jack" como padrão de segurança.
const protagonista = personagens[personagemSelecionado] || personagens["jack"];
console.log("Protagonista ativo carregado:", protagonista.nome);

if (imgPersonagem) {
    imgPersonagem.src = protagonista.normal;
}

// ==========================================
// MÚSICA
// ==========================================

const musica = document.getElementById("musica")
const somTransformacao = document.getElementById("somTransformacao")

if (musica) {
    musica.volume = 0.45
    musica.play().catch(() => { })
}

// ==========================================
// PULAR / AVANÇAR COM TECLADO
// ==========================================

window.addEventListener("keydown", async (e) => {
    if (bloqueiaInput) return;

    if (e.code === "Space") {
        e.preventDefault();
        await proximaCena();
    }

    if (e.code === "KeyS") {
        fade.style.opacity = 1;
        finalizarJogoVitoria();
    }
});

// ==========================================
// HISTÓRIA (Cenas corrigidas com a evolução da maldição)
// ==========================================

const cenas = [
    {
        fundo: "../img/cenario5.png",
        nome: "Narrador",
        fala: "Após derrotar a criatura que guardava a mina, o caçador finalmente encontrou o que tanto procurava.",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario5.png",
        usarProtagonista: true,
        fala: "Os boatos eram verdadeiros...",
        imagemChave: "normal",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        usarProtagonista: true,
        fala: "Olha todo esse ouro!",
        imagemChave: "gananciosa",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        usarProtagonista: true,
        fala: "Bom... acho que se eu levar só um pouco, ninguém vai sentir falta.",
        imagemChave: "gananciosa",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario5.png",
        usarProtagonista: true,
        fala: "É... acho que no final valeu a pena.",
        imagemChave: "gananciosa",
        posicao: "esquerda"
    },

    // Volta para a cidade
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Então...",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Ela existe?",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        usarProtagonista: true,
        fala: "Mais do que você imagina.",
        imagemChave: "gananciosa",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "Mas algo parecia errado...",
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

    // inicio da maldição
    {
        fundo: "../img/cenario1.png",
        usarProtagonista: true,
        fala: "O quê?",
        imagemChave: "maldicao1",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        usarProtagonista: true,
        fala: "Espera... o que está acontecendo comigo?",
        imagemChave: "maldicao2",
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        usarProtagonista: true,
        fala: "Não pode ser!!!",
        imagemChave: "maldicao3",
        posicao: "esquerda",
        transformar: true
    },

    // Finais com o Narrador
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "E no final, a mina nunca esteve vazia...",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "Ela apenas esperava que seu contratante encontrasse alguém para levar até o seu ouro.",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "E agora...",
        imagem: "",
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "Ela tem um novo guardião.",
        imagem: "",
        posicao: ""
    }
]

let cenaAtual = 0
let bloqueiaInput = false

// ==========================================
// RENDEREZADOR VISUAL DINÂMICO
// ==========================================
function atualizarVisual() {
    const cena = cenas[cenaAtual]

    if (cenario.tagName.toLowerCase() === "img") {
        cenario.src = cena.fundo
    } else {
        cenario.style.backgroundImage = `url('${cena.fundo}')`
    }

    if (cena.usarProtagonista) {
        nomePersonagem.innerText = protagonista.nome
    } else {
        nomePersonagem.innerText = cena.nome
    }

    nomePersonagem.style.display = "block"

    texto.innerText = cena.fala

    let imagemSrc = "";
    if (cena.usarProtagonista || cena.imagemChave) {
        imagemSrc = protagonista[cena.imagemChave] || protagonista.normal;
    } else {
        imagemSrc = cena.imagem;
    }

    console.log(`[Cena ${cenaAtual}] Exibindo: ${nomePersonagem.innerText} | Imagem Src: ${imagemSrc}`);

    if (!imagemSrc || imagemSrc === "") {
        imgPersonagem.style.display = "none"
        imgPersonagem.src = ""
    } else {
        imgPersonagem.style.display = "block"
        imgPersonagem.src = imagemSrc

        imgPersonagem.style.left = ""
        imgPersonagem.style.right = ""
        imgPersonagem.style.bottom = ""
        imgPersonagem.style.transform = ""
        imgPersonagem.style.transformOrigin = ""
        imgPersonagem.style.height = ""
        imgPersonagem.style.width = ""

        nomePersonagem.style.left = ""
        nomePersonagem.style.right = ""
        nomePersonagem.style.top = ""

        texto.style.textAlign = ""
        spanContinuar.style.left = ""
        spanContinuar.style.right = ""
        spanPular.style.left = ""
        spanPular.style.right = ""

        // ==========================================
        // PADRONIZAÇÃO DE TAMANHO E ALTURA (Igual para todos)
        // ==========================================
        imgPersonagem.style.height = "400px"
        imgPersonagem.style.width = "auto"

        if (cena.posicao === "direita") {
            imgPersonagem.style.left = "auto"
            imgPersonagem.style.right = "10px"
            imgPersonagem.style.bottom = "170px"
            imgPersonagem.style.transformOrigin = "bottom"

            nomePersonagem.style.left = "auto"
            nomePersonagem.style.right = "30px"
            texto.style.textAlign = "right"

            spanContinuar.style.left = "auto"
            spanContinuar.style.right = "30px"
            spanPular.style.left = "auto"
            spanPular.style.right = "30px"
        } else {
            imgPersonagem.style.right = "auto"
            imgPersonagem.style.left = "10px"
            imgPersonagem.style.bottom = "170px"
            imgPersonagem.style.transformOrigin = "bottom"

            nomePersonagem.style.right = "auto"
            nomePersonagem.style.left = "30px"
            texto.style.textAlign = "left"

            spanContinuar.style.left = "30px"
            spanContinuar.style.right = "auto"
            spanPular.style.left = "auto"
            spanPular.style.right = "30px"
        }
    }
}

// ==========================================
// SISTEMA DE TRANSFORMAÇÃO (ESTÁGIOS DA MALDIÇÃO)
// ==========================================
async function iniciarTransformacao() {
    bloqueiaInput = true

    if (somTransformacao) {
        somTransformacao.currentTime = 0
        somTransformacao.play().catch(() => { })
    }

    if (musica) {
        const intervalo = setInterval(() => {
            if (musica.volume > 0.05) {
                musica.volume -= 0.03
            } else {
                clearInterval(intervalo)
            }
        }, 120)
    }

    document.body.classList.add("transformando")

    const sprites = [
        protagonista.normal,
        protagonista.maldicao1,
        protagonista.normal,
        protagonista.maldicao2,
        protagonista.normal,
        protagonista.maldicao3,
        protagonista.maldicao2,
        protagonista.maldicao1,
        protagonista.maldicao3,
        protagonista.maldicao2,
        protagonista.maldicao3
    ]

    console.log("Iniciando animação de transformação para:", protagonista.nome);

    for (let i = 0; i < sprites.length; i++) {
        imgPersonagem.src = sprites[i]

        imgPersonagem.style.left = "10px"
        imgPersonagem.style.right = "auto"
        imgPersonagem.style.bottom = "30px"
        imgPersonagem.style.height = "400px"
        imgPersonagem.style.width = "auto"
        imgPersonagem.style.transformOrigin = "bottom"

        fade.style.background = "red"
        fade.style.opacity = 0.45

        await new Promise(r => setTimeout(r, 180))
        fade.style.opacity = 0
        await new Promise(r => setTimeout(r, 120))
    }

    fade.style.background = "black"
    imgPersonagem.src = protagonista.maldicao3
    await new Promise(r => setTimeout(r, 900))

    document.body.classList.remove("transformando")
    bloqueiaInput = false
}

// ==========================================
// TRANSFORMAÇÃO / TROCAR CENA
// ==========================================
async function proximaCena() {
    if (bloqueiaInput) return

    if (cenas[cenaAtual].transformar) {
        await iniciarTransformacao()
    }

    bloqueiaInput = true
    cenaAtual++

    if (cenaAtual >= cenas.length) {
        fade.style.background = "black"
        fade.style.opacity = 0;
        finalizarJogoVitoria();

        if (musica) {
            musica.pause()
        }
        return
    }

    fade.style.opacity = 1
    setTimeout(() => {
        atualizarVisual()
        fade.style.opacity = 0
        setTimeout(() => {
            bloqueiaInput = false
        }, 700)
    }, 700)
}

atualizarVisual()

// ==========================================
// TELA FINAL DE VITÓRIA
// ==========================================
function finalizarJogoVitoria() {
    const telaVitoria = document.createElement("div");
    telaVitoria.classList.add("tela-vitoria-container");

    telaVitoria.innerHTML = `
       <img src="../img/fim.png" alt="Fim de Jogo" class="tela-vitoria-bg" />

       <div class="tela-vitoria-header">
           <h1 class="tela-vitoria-titulo">O FIM</h1>
           <p class="tela-vitoria-subtitulo">O horizonte é lindo, mas você já não pertence ao mundo dos vivos...</p>
       </div>

       <div class="tela-vitoria-botoes">
           <button id="btn-recomecar" class="btn-fim btn-recomecar">Jogar Novamente</button>
           <button id="btn-menu-principal" class="btn-fim btn-menu">Menu Principal</button>
       </div>
    `;

    console.log("Tela de vitória criada com sucesso!");
    document.body.appendChild(telaVitoria);

    document.getElementById("btn-recomecar").addEventListener("click", () => {
        window.location.href = "../html/jogo.html";
    });

    document.getElementById("btn-menu-principal").addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}