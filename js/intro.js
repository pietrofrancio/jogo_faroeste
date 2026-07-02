// ==========================================
// ELEMENTOS DA TELA
// ==========================================

const texto = document.getElementById("texto")
const fade = document.getElementById("fade")
const cenario = document.getElementById("cenario")

// ==========================================
// MUSICA
// ===========================================
const musicaIntro = document.getElementById("musicaIntro")

musicaIntro.src = "../music/intro.mp3"
musicaIntro.volume = 0.4

musicaIntro.play().catch(() => {
    console.log("Aguardando interação do usuário.")
})
// ==========================================
// HISTÓRIA
// ==========================================

const cenas = [

{
    fundo: "../img/cenario1.png",

    fala: "Depois de anos viajando pelo Oeste, finalmente encontrei a cidade de Black Creek."
},

{
    fundo: "../img/cenario2.png",

    fala: "Os moradores diziam que uma antiga mina escondia riquezas inimagináveis."
},

{
    fundo: "../img/cenario3.png",

    fala: "Mas também falavam sobre criaturas sombrias que surgiam durante a noite."
},

{
    fundo: "../img/cenario4.png",

    fala: "Se eu quiser descobrir a verdade, precisarei seguir em frente."
}

]

// ==========================================
// CENA ATUAL
// ==========================================

let cenaAtual = 0

texto.innerText = cenas[cenaAtual].fala

// ==========================================
// TROCAR CENA
// ==========================================

function proximaCena(){

    cenaAtual++

    // acabou a história
    if(cenaAtual >= cenas.length){

        fade.style.opacity = 1

        setTimeout(() => {

            window.location.href = "jogo.html"

        }, 2000)

        return
    }

    // fade para preto

    fade.style.opacity = 1

    setTimeout(() => {

        cenario.style.backgroundImage =
        `url('${cenas[cenaAtual].fundo}')`

        texto.innerText =
        cenas[cenaAtual].fala

        fade.style.opacity = 0

    }, 1000)

}

// ==========================================
// TECLA ESPAÇO
// ==========================================

window.addEventListener("keydown", (e)=>{

    if(e.code === "Space"){

        proximaCena()

    }

})