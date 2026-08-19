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
const personagemSelecionado = localStorage.getItem("personagemSelecionado") || "morgana";

const personagens = {
    morgana: {
        nome: "Morgana",
        normal: "../img/morganaNormal.png",
        seria: "../img/morganaSeria.png",
        preocupada: "../img/morganaPreucupada.png",
        gananciosa: "../img/morganaGananciosa.png" // Adicionado!
    },

    ruby: {
        nome: "Ruby",
        normal: "../img/rubyNormal.png",
        seria: "../img/rubySeria.png",
        preocupada: "../img/rubyPreucupada.png",
        gananciosa: "../img/rubyGananciosa.png" // Adicionado!
    },

    jack: {
        nome: "Jack",
        normal: "../img/jackNormal.png",
        seria: "../img/jackSeria.png",
        preocupada: "../img/jackPreucupada.png",
        gananciosa: "../img/jackGananciosa.png" // Adicionado!
    },

    miguel: {
        nome: "Miguel",
        normal: "../img/miguelNormal.png",
        seria: "../img/miguelSeria.png",
        preocupada: "../img/miguelPreucupada.png",
        gananciosa: "../img/miguelGananciosa.png" // Adicionado!
    }
};

const protagonista = personagens[personagemSelecionado];

// Define a imagem inicial com segurança
if (imgPersonagem && protagonista) {
    imgPersonagem.src = protagonista.normal;
}

// ==========================================
// MUSICA
// ==========================================
const musicaIntro = document.getElementById("musicaIntro")

if (musicaIntro) {
    musicaIntro.src = "../music/intro.mp3"
    musicaIntro.volume = 0.4

    musicaIntro.play().catch(() => {
        console.log("Aguardando interação do usuário.")
    })
}

// ==========================================
// PARA PULAR A HISTORIA
// ==========================================
window.addEventListener("keydown", (e) => {
    if (e.code === "KeyS") {
        fade.style.opacity = 1
        setTimeout(() => {
            window.location.href = "jogo.html"
        }, 1000)
    }
})

// ==========================================
// HISTÓRIA (CORRIGIDO: Narrador agora sem imagem do protagonista)
// ==========================================
const cenas = [
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "No velho oeste, onde a poeira cobre segredos e a lei vale menos que uma bala, existe um nome que nunca recusa trabalho...",
        imagem: "", // CORREÇÃO: Vazio para o narrador falar sozinho
        posicao: ""
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Dizem que você aceita qualquer serviço.",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Depende de quanta grana estamos falando.",
        imagem: protagonista.gananciosa, // Agora funciona perfeitamente!
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Não há alvo, você só tem uma missão, encontrar uma mina.",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Só isso? Parece fácil demais.",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Os rumores dizem que essa mina é absurdamente rica, ouro o bastante para tornar qualquer miserável em um homem poderoso!",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Tudo o que você precisa fazer é verificar sua existência, e me trazer provas disso.",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "E o preço?",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },
    {
        fundo: "../img/cenario1.png",
        nome: "Contratante",
        fala: "Bom, se você realmente encontrá-la, poderá ficar com metade de todo o seu ouro.",
        imagem: "../img/contratante.png",
        posicao: "direita"
    },
    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Parece bom para mim. Negócio fechado!",
        imagem: protagonista.normal,
        posicao: "esquerda"
    }
]

// ==========================================
// CENA ATUAL E VISUAL
// ==========================================
let cenaAtual = 0
let bloqueiaInput = false

if (nomePersonagem) nomePersonagem.innerText = cenas[cenaAtual].nome
if (texto) texto.innerText = cenas[cenaAtual].fala

function atualizarVisual() {
    // 1. Trata a imagem do personagem
    if (!cenas[cenaAtual].imagem || cenas[cenaAtual].imagem === "") {
        imgPersonagem.style.display = "none"
    } else {
        imgPersonagem.src = cenas[cenaAtual].imagem
        imgPersonagem.style.display = "block"

        // === AJUSTE DE POSIÇÃO E TAMANHO DA IMAGEM ===
        if (cenas[cenaAtual].posicao === "direita") {
            imgPersonagem.style.left = "auto"
            imgPersonagem.style.right = "50px"

            imgPersonagem.style.transform = "scale(1.4)"
            imgPersonagem.style.transformOrigin = "bottom"
        } else {
            imgPersonagem.style.right = "auto"
            imgPersonagem.style.left = "50px"
            imgPersonagem.style.transform = "scale(1)"
        }
    }

    // 2. Trata Nome, Texto e a DICA DE ESPAÇO!
    if (cenas[cenaAtual].posicao === "direita") {
        if (nomePersonagem) {
            nomePersonagem.style.left = "auto"
            nomePersonagem.style.right = "30px"
        }
        if (texto) texto.style.textAlign = "right"

        if (spanContinuar) {
            spanContinuar.style.left = "auto"
            spanContinuar.style.right = "30px"
        }
        if (spanPular) {
            spanPular.style.left = "auto"
            spanPular.style.right = "30px"
        }
    } else {
        if (nomePersonagem) {
            nomePersonagem.style.right = "auto"
            nomePersonagem.style.left = "30px"
        }
        if (texto) texto.style.textAlign = "left"

        if (spanContinuar) {
            spanContinuar.style.right = "auto"
            spanContinuar.style.left = "30px"
        }
        if (spanPular) {
            spanPular.style.right = "auto"
            spanPular.style.left = "30px"
        }
    }
}

atualizarVisual()

// ==========================================
// TROCAR CENA
// ==========================================
function proximaCena() {
    if (bloqueiaInput === true) return
    bloqueiaInput = true
    cenaAtual++

    if (cenaAtual >= cenas.length) {
        fade.style.opacity = 1
        setTimeout(() => {
            window.location.href = "jogo.html"
        }, 2000)
        return
    }

    fade.style.opacity = 1

    setTimeout(() => {
        if (cenario) cenario.style.backgroundImage = `url('${cenas[cenaAtual].fundo}')`
        if (nomePersonagem) nomePersonagem.innerText = cenas[cenaAtual].nome
        if (texto) texto.innerText = cenas[cenaAtual].fala

        atualizarVisual()

        fade.style.opacity = 0

        setTimeout(() => {
            bloqueiaInput = false
        }, 1000)

    }, 1000)
}

// ==========================================
// TECLA ESPAÇO
// ==========================================
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        proximaCena()
    }
})