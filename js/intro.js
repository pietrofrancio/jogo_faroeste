// ==========================================
// ELEMENTOS DA TELA
// ==========================================
const texto = document.getElementById("texto")
const fade = document.getElementById("fade")
const cenario = document.getElementById("cenario")
const nomePersonagem = document.getElementById("nome-personagem")
const imgPersonagem = document.getElementById("personagem")
// CAPTURANDO O SPAN AQUI:
const spanContinuar = document.querySelector(".continuar")
const spanPular = document.querySelector(".pular")

// ==========================================
// MUSICA
// ==========================================
const musicaIntro = document.getElementById("musicaIntro")

musicaIntro.src = "../music/intro.mp3"
musicaIntro.volume = 0.4

musicaIntro.play().catch(() => {
    console.log("Aguardando interação do usuário.")
})

// ==========================================
// PARA PULAR A HISTORIAAAAAAAAAAAAAA
// ==========================================
window.addEventListener("keydown", (e) => {

    if(e.code === "KeyS"){

        fade.style.opacity = 1

        setTimeout(() => {
            window.location.href = "jogo.html"
        }, 1000)
    }

})


// ==========================================
// HISTÓRIA
// ==========================================
const cenas = [
    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "No velho oeste, onde a poeira cobre segredos e a lei vale menos que uma bala, existe um nome que nunca recusa trabalho...",
        imagem: "",
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
        nome: "Protagonista",
        fala: "Depende de quanta grana estamos falando.",
        imagem: "../img/morganaNormal.png",
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
        nome: "Protagonista",
        fala: "Só isso? Parece fácil demais.",
        imagem: "../img/morganaNormal.png",
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
        nome: "Protagonista",
        fala: "E o preço?",
        imagem: "../img/morganaNormal.png",
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
        nome: "Protagonista",
        fala: "Parece bom para mim. Negócio fechado!",
        imagem: "../img/morganaNormal.png",
        posicao: "esquerda"
    }
]

// ==========================================
// CENA ATUAL E VISUAL
// ==========================================
let cenaAtual = 0
let bloqueiaInput = false

nomePersonagem.innerText = cenas[cenaAtual].nome
texto.innerText = cenas[cenaAtual].fala

// Função atualizada
function atualizarVisual() {

    // 1. Trata a imagem do personagem
    if (cenas[cenaAtual].imagem === "") {
        imgPersonagem.style.display = "none"
    } else {
        imgPersonagem.src = cenas[cenaAtual].imagem
        imgPersonagem.style.display = "block"

        // === AJUSTE DE POSIÇÃO E TAMANHO DA IMAGEM ===
        if (cenas[cenaAtual].posicao === "direita") {
            imgPersonagem.style.left = "auto"
            imgPersonagem.style.right = "50px"

            // ADICIONE ESTAS DUAS LINHAS PARA O CONTRATANTE:
            imgPersonagem.style.transform = "scale(1.4)" // 1.4 significa 40% maior. Ajuste esse número como quiser (ex: 1.2, 1.5, 2.0)
            imgPersonagem.style.transformOrigin = "bottom" // Faz ele crescer para cima, sem afundar no chão
        } else {
            imgPersonagem.style.right = "auto"
            imgPersonagem.style.left = "50px"

            // ADICIONE ESTA LINHA PARA A PROTAGONISTA VOLTAR AO NORMAL:
            imgPersonagem.style.transform = "scale(1)" // Volta ao tamanho original (100%)
        }
    }

    // 2. Trata Nome, Texto e agora a DICA DE ESPAÇO!
    if (cenas[cenaAtual].posicao === "direita") {
        // Lado direito
        nomePersonagem.style.left = "auto"
        nomePersonagem.style.right = "30px"
        texto.style.textAlign = "right"

        spanContinuar.style.left = "auto"
        spanContinuar.style.right = "30px"

        spanPular.style.left = "auto"
        spanPular.style.right = "30px"
    } else {
        // Lado esquerdo (padrão)
        nomePersonagem.style.right = "auto"
        nomePersonagem.style.left = "30px"
        texto.style.textAlign = "left"

        spanContinuar.style.right = "auto"
        spanContinuar.style.left = "30px"

        spanPular.style.right = "auto"
        spanPular.style.left = "30px"
    }
}

// Roda a função para a cena inicial
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
        cenario.style.backgroundImage = `url('${cenas[cenaAtual].fundo}')`
        nomePersonagem.innerText = cenas[cenaAtual].nome
        texto.innerText = cenas[cenaAtual].fala

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