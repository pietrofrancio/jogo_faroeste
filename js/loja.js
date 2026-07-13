// ================================
// SISTEMA DA LOJA
// ================================

// Ouro
let ouroEstoque = Number(localStorage.getItem("ouroEstoque")) || 0
const ouroInsuficiente = new Audio('../efeitos_sonoros/ouro_insuficiente.mp3')
// Personagens
let personagensComprados =
    JSON.parse(localStorage.getItem("personagensComprados")) || []

let personagemSelecionado =
    localStorage.getItem("personagemSelecionado") || "morgana"

// Músicas
let musicasCompradas =
    JSON.parse(localStorage.getItem("musicasCompradas")) || []

let musicaSelecionada =
    localStorage.getItem("musicaJogo") || "../music/musica_fundo1.mp3"

// Armas
let armasCompradas = JSON.parse(localStorage.getItem("armasCompradas")) || []
let velocidadeBala = 18
let armaSelecionada = localStorage.getItem("armaSelecionada") || "arma Inicial"

// Morgana sempre disponível
if (!personagensComprados.includes("morgana")) {
    personagensComprados.push("morgana")
    localStorage.setItem(
        "personagensComprados",
        JSON.stringify(personagensComprados)
    )
}

// Música padrão sempre disponível
if (!musicasCompradas.includes("../music/musica_fundo1.mp3")) {
    musicasCompradas.push("../music/musica_fundo1.mp3")

    localStorage.setItem(
        "musicasCompradas",
        JSON.stringify(musicasCompradas)
    )
}

// Arma Inicial sempre disponível
if(!armasCompradas.includes("arma Inicial")){
    armasCompradas.push("arma Inicial")

    localStorage.setItem(
        "armasCompradas",
        JSON.stringify(armasCompradas)
    )
}

// ================================

const displayOuro = document.getElementById("ouroLoja")

const personagens = [
    {
        nome: "morgana",
        preco: 0,
        botao: document.getElementById("btn-morgana")
    },
    {
        nome: "ruby",
        preco: 15,
        botao: document.getElementById("btn-ruby")
    },
    {
        nome: "jack",
        preco: 25,
        botao: document.getElementById("btn-jack")
    }
]

const musicas = [
    {
        caminho: "../music/musica_fundo1.mp3",
        preco: 0,
        botao: document.getElementById("btn-musica1")
    },
    {
        caminho: "../music/duelo_epico.mp3",
        preco: 10,
        botao: document.getElementById("btn-musica2")
    },
    {
        caminho: "../music/duelo_final.mp3",
        preco: 20,
        botao: document.getElementById("btn-musica3")
    }
]
const armas = [
    {
        tipo: "revolver",
        preco: 20,
        botao: document.getElementById('btn-revolver')
    },
    {
        tipo: "arma Inicial",
        preco: 0,
        botao: document.getElementById('btn-armaInicial')
    }
]

// ================================

function atualizarOuro() {
    displayOuro.innerText = `Ouro: ${ouroEstoque}`
}

// ================================

function atualizarPersonagens() {

    personagens.forEach(personagem => {

        const btn = personagem.botao

        if (personagem.nome === personagemSelecionado) {

            btn.innerText = "Equipado"
            btn.disabled = true

        }

        else if (personagensComprados.includes(personagem.nome)) {

            btn.innerText = "Selecionar"
            btn.disabled = false

        }

        else {

            btn.innerText = `Comprar (${personagem.preco})`
            btn.disabled = false

        }

    })

}

// ================================

function atualizarMusicas() {

    musicas.forEach(musica => {

        const btn = musica.botao

        if (musica.caminho === musicaSelecionada) {

            btn.innerText = "Equipada"
            btn.disabled = true

        }

        else if (musicasCompradas.includes(musica.caminho)) {

            btn.innerText = "Selecionar"
            btn.disabled = false

        }

        else {

            btn.innerText = `Comprar (${musica.preco})`
            btn.disabled = false

        }

    })

}
function atualizarArmas() {

    armas.forEach(arma => {

        const btn = arma.botao

        if (arma.tipo === armaSelecionada) {

            btn.innerText = "Equipada"
            btn.disabled = true

        }

        else if (armasCompradas.includes(arma.tipo)) {

            btn.innerText = "Selecionar"
            btn.disabled = false

        }

        else {

            btn.innerText = `Comprar (${arma.preco})`
            btn.disabled = false

        }

    })

}

// ================================
// PERSONAGENS
// ================================

function clicarPersonagem(nome) {

    const personagem = personagens.find(p => p.nome === nome)

    if (!personagensComprados.includes(nome)) {

        if (ouroEstoque < personagem.preco) {
            ouroInsuficiente.play()
            alert("Ouro insuficiente!")
            return
        }

        ouroEstoque-= personagem.preco

        personagensComprados.push(nome)

        localStorage.setItem("ouroEstoque", ouroEstoque)

        localStorage.setItem(
            "personagensComprados",
            JSON.stringify(personagensComprados)
        )

    }

    personagemSelecionado = nome

    localStorage.setItem(
        "personagemSelecionado",
        nome
    )

    atualizarOuro()
    atualizarPersonagens()

}

// ================================
// MÚSICAS
// ================================

function clicarMusica(caminho) {

    const musica = musicas.find(m => m.caminho === caminho)

    if (!musicasCompradas.includes(caminho)) {

        if (ouroEstoque < musica.preco) {
            ouroInsuficiente.play()
            alert("Ouro insuficiente!")
            return

        }

        ouroEstoque -= musica.preco

        musicasCompradas.push(caminho)

        localStorage.setItem("ouroEstoque", ouroEstoque)

        localStorage.setItem(
            "musicasCompradas",
            JSON.stringify(musicasCompradas)
        )

    }

    musicaSelecionada = caminho

    localStorage.setItem(
        "musicaJogo",
        caminho
    )

    atualizarOuro()
    atualizarMusicas()

}

// ================================
// ARMAS
// ================================

function clicarArma(tipo) {

    const arma = armas.find(m => m.tipo === tipo)

    if (!armasCompradas.includes(tipo)) {

        if (ouroEstoque < arma.preco) {
            ouroInsuficiente.play()
            alert("Ouro insuficiente!")
            return

        }

        ouroEstoque -= arma.preco

        armasCompradas.push(tipo)

        localStorage.setItem("ouroEstoque", ouroEstoque)

        localStorage.setItem(
            "armasCompradas",
            JSON.stringify(armasCompradas)
        )

    }

    armaSelecionada = tipo

    localStorage.setItem(
        "armaSelecionada",
        tipo
    )

    velocidadeBala = armaSelecionada === "revolver" ? 28 : 18;
    velocidadeBala = armaSelecionada === "arma Inicial" ? 18 : 18;
    
    atualizarOuro()
    atualizarArmas()

}

// ================================
// EVENTOS
// ================================

document.getElementById("btn-morgana").onclick = () => clicarPersonagem("morgana")
document.getElementById("btn-ruby").onclick = () => clicarPersonagem("ruby")
document.getElementById("btn-jack").onclick = () => clicarPersonagem("jack")

document.getElementById("btn-musica1").onclick = () => clicarMusica("../music/musica_fundo1.mp3")
document.getElementById("btn-musica2").onclick = () => clicarMusica("../music/duelo_epico.mp3")
document.getElementById("btn-musica3").onclick = () => clicarMusica("../music/duelo_final.mp3")

document.getElementById("btn-revolver").onclick = ()=> clicarArma("revolver")
document.getElementById("btn-armaInicial").onclick = ()=> clicarArma("arma Inicial")

// ================================

atualizarOuro()
atualizarPersonagens()
atualizarMusicas()
atualizarArmas()