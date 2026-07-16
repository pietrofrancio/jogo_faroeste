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

const personagemSelecionado =
    localStorage.getItem("personagemSelecionado") || "morgana"

// ==========================================
// PERSONAGENS
// ==========================================

const personagens = {

    morgana: {
        nome: "Morgana",
        normal: "../img/morganaNormal.png",
        seria: "../img/morganaSeria.png",
        preocupada: "../img/morganaPreucupada.png",

        maldicao1: "../img/morganaMaldicao1.png",
        maldicao2: "../img/morganaMaldicao2.png",
        maldicao3: "../img/morganaMaldicao3.png"
    },

    ruby: {
        nome: "Ruby",
        normal: "../img/rubyNormal.png",
        seria: "../img/rubySeria.png",
        preocupada: "../img/rubyPreucupada.png",

        maldicao1: "../img/rubyMaldicao1.png",
        maldicao2: "../img/rubyMaldicao2.png",
        maldicao3: "../img/rubyMaldicao3.png"
    },

    jack: {
        nome: "Jack",
        normal: "../img/jackNormal.png",
        seria: "../img/jackSeria.png",
        preocupada: "../img/jackPreucupada.png",

        maldicao1: "../img/jackMaldicao1.png",
        maldicao2: "../img/jackMaldicao2.png",
        maldicao3: "../img/jackMaldicao3.png"
    },

    miguel: {
        nome: "Miguel",
        normal: "../img/miguelNormal.png",
        seria: "../img/miguelSeria.png",
        preocupada: "../img/miguelPreucupada.png",

        maldicao1: "../img/miguelMaldicao1.png",
        maldicao2: "../img/miguelMaldicao2.png",
        maldicao3: "../img/miguelMaldicao3.png"
    }

}

const protagonista = personagens[personagemSelecionado]

imgPersonagem.src = protagonista.normal

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
// PULAR
// ==========================================


window.addEventListener("keydown", async (e) => {
    if (bloqueiaInput) return;
    if (e.code === "Enter") {
        e.preventDefault();
        await proximaCena();
    }
    if (e.code === "KeyS") {
        fade.style.opacity = 1;
        finalizarJogoVitoria()
    }
});

// ==========================================
// HISTÓRIA
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
        nome: protagonista.nome,
        fala: "Os boatos eram verdade...",
        imagem: protagonista.seria,
        posicao: "esquerda"
    },

    {
        fundo: "../img/cenario5.png",
        nome: protagonista.nome,
        fala: "Olha todo esse ouro.",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },

    {
        fundo: "../img/cenario5.png",
        nome: protagonista.nome,
        fala: "Bom... acho que se eu levar só um pouco, ninguém vai sentir falta.",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },

    {
        fundo: "../img/cenario5.png",
        nome: protagonista.nome,
        fala: "É... acho que no final valeu a pena.",
        imagem: protagonista.normal,
        posicao: "esquerda"
    },

    // volta para a cidade

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
        nome: protagonista.nome,
        fala: "Mais do que você imagina.",
        imagem: protagonista.seria,
        posicao: "esquerda"
    },

    {
        fundo: "../img/cenario1.png",
        nome: "Narrador",
        fala: "Mas algo parecia errado.",
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
        nome: protagonista.nome,
        fala: "O quê?",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },

    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Espera... o que está acontecendo comigo?",
        imagem: protagonista.preocupada,
        posicao: "esquerda"
    },

    {
        fundo: "../img/cenario1.png",
        nome: protagonista.nome,
        fala: "Não pode ser!",
        imagem: protagonista.preocupada,
        posicao: "esquerda",
        transformar: true
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
        fala: "Ela apenas esperava que alguém encontrasse seu ouro.",
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
// VISUAL
// ==========================================

if (nomePersonagem) nomePersonagem.innerText = cenas[cenaAtual].nome
if (texto) texto.innerText = cenas[cenaAtual].fala

function atualizarVisual() {

    const cena = cenas[cenaAtual]

    // Fundo
    if (cenario.tagName.toLowerCase() === "img") {
        cenario.src = cena.fundo
    } else {
        cenario.style.backgroundImage = `url('${cena.fundo}')`
    }

    // Nome
    nomePersonagem.innerText = cena.nome

    // Texto
    texto.innerText = cena.fala

    // Narrador
    if (!cena.imagem) {

        imgPersonagem.style.display = "none"

    } else {

        imgPersonagem.style.display = "block"
        imgPersonagem.src = cena.imagem

        if (cena.posicao === "direita") {

            imgPersonagem.style.left = "auto"
            imgPersonagem.style.right = "50px"

            imgPersonagem.style.transform = "scale(1.4)"
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
            imgPersonagem.style.left = "50px"

            if (cena.imagem === protagonista.seria && personagemSelecionado === "morgana") {
                imgPersonagem.style.transform = "scale(1.5)";
                imgPersonagem.style.bottom = "150px";   // ajuste conforme necessário

            } else {
                imgPersonagem.style.transform = "scale(1)";
            }
            nomePersonagem.style.right = "auto"
            nomePersonagem.style.left = "30px"

            texto.style.textAlign = "left"

            spanContinuar.style.left = "30px";
            spanContinuar.style.right = "auto";

            spanPular.style.left = "auto";
            spanPular.style.right = "30px";

        }

    }

}

// ==========================================
// TRANSFORMAÇÃO
// ==========================================
async function iniciarTransformacao() {

    bloqueiaInput = true

    if (somTransformacao) {

        somTransformacao.currentTime = 0
        somTransformacao.play().catch(() => { })

    }

    if (musica) {

        const volumeInicial = musica.volume

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
console.log(JSON.stringify(sprites, null, 2));
    for (let i = 0; i < sprites.length; i++) {

    imgPersonagem.src = sprites[i]

    // mantém o personagem no lugar certo
    imgPersonagem.style.left = "50px"
    imgPersonagem.style.right = "auto"
    imgPersonagem.style.bottom = "150px"
    imgPersonagem.style.transform = "scale(1.5)"
    imgPersonagem.style.transformOrigin = "bottom"

    fade.style.background = "red"
    fade.style.opacity = .45

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
// TROCAR CENA
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


function finalizarJogoVitoria() {


    const telaVitoria = document.createElement("div");
    telaVitoria.classList.add("tela-vitoria-container");


    // Lembre de ajustar o caminho da imagem do cowboy!
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

console.log("Tela de vitória criada");
    document.body.appendChild(telaVitoria);


   document.getElementById("btn-recomecar").addEventListener("click", () => {
    window.location.href = "../html/jogo.html";
});


    // Evento para voltar ao Menu Principal
    document.getElementById("btn-menu-principal").addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}