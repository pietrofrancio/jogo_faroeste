// ================================
// SISTEMA DA LOJA
// ================================

// Ouro
let ouro = Number(localStorage.getItem("ouro")) || 0

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

// ================================

const displayOuro = document.getElementById("ouro")

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
        caminho: "../music/musica2.mp3",
        preco: 10,
        botao: document.getElementById("btn-musica2")
    },
    {
        caminho: "../music/musica3.mp3",
        preco: 20,
        botao: document.getElementById("btn-musica3")
    }
]

// ================================

function atualizarOuro() {
    displayOuro.innerText = `Ouro: ${ouro}`
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

// ================================
// PERSONAGENS
// ================================

function clicarPersonagem(nome) {

    const personagem = personagens.find(p => p.nome === nome)

    if (!personagensComprados.includes(nome)) {

        if (ouro < personagem.preco) {
            alert("Ouro insuficiente!")
            return
        }

        ouro -= personagem.preco

        personagensComprados.push(nome)

        localStorage.setItem("ouro", ouro)

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

        if (ouro < musica.preco) {

            alert("Ouro insuficiente!")
            return

        }

        ouro -= musica.preco

        musicasCompradas.push(caminho)

        localStorage.setItem("ouro", ouro)

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
// EVENTOS
// ================================

document.getElementById("btn-morgana").onclick = () => clicarPersonagem("morgana")
document.getElementById("btn-ruby").onclick = () => clicarPersonagem("ruby")
document.getElementById("btn-jack").onclick = () => clicarPersonagem("jack")

document.getElementById("btn-musica1").onclick = () => clicarMusica("../music/musica_fundo1.mp3")
document.getElementById("btn-musica2").onclick = () => clicarMusica("../music/musica2.mp3")
document.getElementById("btn-musica3").onclick = () => clicarMusica("../music/musica3.mp3")

// ================================

atualizarOuro()
atualizarPersonagens()
atualizarMusicas()