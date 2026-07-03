// ==========================================
// ELEMENTOS DA TELA
// ==========================================
const cenario = document.getElementById("cenario")
const protagonista = document.getElementById("protagonista")
const hudVidas = document.getElementById("vidas")
const btnPause = document.getElementById("btnPause")
const musicaJogo = document.getElementById("musicaJogo")
let jogoPausado = false
const hudOuro = document.getElementById("pontos")
let ouro = Number(localStorage.getItem("ouro")) || 0
hudOuro.innerText = `Ouro: ${ouro}`
//----------
let musicaSalva = localStorage.getItem("musicaJogo")
if(musicaSalva == null){
musicaJogo.src = "../music/musica_fundo1.mp3"
}else{
    musicaJogo.src = musicaSalva
}
musicaJogo.volume = 0.4

function iniciarMusica(){

    musicaJogo.play()

    window.removeEventListener("keydown", iniciarMusica)
    window.removeEventListener("mousedown", iniciarMusica)

}

window.addEventListener("keydown", iniciarMusica)
window.addEventListener("mousedown", iniciarMusica)
musicaJogo.play().catch(() => {})
const menuGameOver = document.getElementById("gameOverMenu")
const btnVida1 = document.getElementById("comprar1Vida")
const btnVida2 = document.getElementById("comprar2Vidas")
const btnRecusar = document.getElementById("recusar")
let invencivel = false
let moedas = []
let bolasFeno = []
// ==========================================
// BOTAO DE PAUSE
// ==========================================
btnPause.addEventListener("click", () => {
    jogoPausado = !jogoPausado
    if (jogoPausado) {
        btnPause.innerText = "▶ Continuar"
        musicaJogo.pause()
    } else {
        btnPause.innerText = "⏸ Pausar"
        musicaJogo.play()
        loopDoJogo()
    }
})

// ==========================================
// BOTAO DE recuar ao não querer comprar uma via se perder
// ==========================================
btnRecusar.addEventListener("click", () => {
    location.reload()
})
btnVida1.addEventListener("click", () => {

    if (ouro >= 3) {
        ouro -= 3
        localStorage.setItem("ouro", ouro)
        hudOuro.innerText = `Ouro: ${ouro}`
        vidas = 1
        hudVidas.innerText = `Vidas: ${vidas} ♥`

        //COLOCA A MORGANA (QUANDO COMPRAR VIDA) EM UM LUGAR 'SEGURO'
        protaX = 50
        protaY = chao

        protagonista.style.left = `${protaX}px`
        protagonista.style.bottom = `${protaY}px`
        invencivel = true
        const piscar = setInterval(() => {

            protagonista.style.opacity =
                protagonista.style.opacity == "0.3" ? "1" : "0.3"

        }, 150)
        // REMOVE TODOS OS INIMIGOS
        inimigos.forEach(i => i.elemento.remove())
        inimigos = []

        // REMOVE TODAS AS BOLAS DE FENO
        bolasFeno.forEach(b => b.elemento.remove())
        bolasFeno = []
        //----------------------------


        setTimeout(() => {
            invencivel = false
            clearInterval(piscar)
            protagonista.style.opacity = "1"
        }, 3000)
        menuGameOver.classList.add("oculto")
        jogoPausado = false
        loopDoJogo()
    } else {
        alert("Você não possui ouro suficiente!")
    }

})

btnVida2.addEventListener("click", () => {
    if (ouro >= 5) {
        ouro -= 5
        localStorage.setItem("ouro", ouro)
        hudOuro.innerText = `Ouro: ${ouro}`
        vidas = 2
        hudVidas.innerText = `Vidas: ${vidas} ♥`
        protaX = 50
        protaY = chao

        protagonista.style.left = `${protaX}px`
        protagonista.style.bottom = `${protaY}px`
        invencivel = true
        const piscar = setInterval(() => {

            protagonista.style.opacity =
                protagonista.style.opacity == "0.3" ? "1" : "0.3"

        }, 150)
        // REMOVE TODOS OS INIMIGOS
        inimigos.forEach(i => i.elemento.remove())
        inimigos = []

        // REMOVE TODAS AS BOLAS DE FENO
        bolasFeno.forEach(b => b.elemento.remove())
        bolasFeno = []
        //----------------------------
        setTimeout(() => {
            invencivel = false
            clearInterval(piscar)
            protagonista.style.opacity = "1"
        }, 3000)
        menuGameOver.classList.add("oculto")
        jogoPausado = false
        loopDoJogo()
    } else {
        alert("Você não possui ouro suficiente!")
    }

})
// ==========================================
// CONFIGURAÇÃO DOS SPRITES DA PROTAGONISTA
// ==========================================
const spritesMorgana = {
    parada: "../img/morganaParada.png",
    pulo: [
        "../img/morganaPulando1.png", "../img/morganaPulando2.png",
        "../img/morganaPulando3.png", "../img/morganaPulando4.png",
        "../img/morganaPulando5.png", "../img/morganaPulando6.png",
    ],
    correndo: [
        "../img/morganaCorrendo1.png", "../img/morganaCorrendo2.png",
        "../img/morganaCorrendo3.png", "../img/morganaCorrendo4.png",
        "../img/morganaCorrendo5.png", "../img/morganaCorrendo6.png",
        "../img/morganaCorrendo7.png", "../img/morganaCorrendo8.png",
        "../img/morganaCorrendo9.png", "../img/morganaCorrendo10.png",
        "../img/morganaCorrendo11.png",
    ],
    atirando: [
        "../img/morganaAtirando1.png", "../img/morganaAtirando2.png",
        "../img/morganaAtirando3.png", "../img/morganaAtirando4.png",
    ]
}

let frameCorrida = 0; let framePulo = 0; let frameAtirando = 0
let estaAtirando = false; let timerAnimacao = 0
const velocidadFrame = 14; const velocidadTiro = 10

// ==========================================
// VARIÁVEIS DE CONTROLE DO JOGO
// ==========================================
let vidas = 5
const chao = 50

let protaX = 50; let protaY = chao; let velY = 0
let pulando = false
const gravidade = 0.6; const forcaPulo = 20; const velocidadeAndar = 4

// ==========================================
// CONTROLES (Teclado e Mouse)
// ==========================================
let teclas = {}
window.addEventListener("keydown", (e) => teclas[e.code] = true)
window.addEventListener("keyup", (e) => teclas[e.code] = false)

let balas = [] // Lista que vai guardar as balas ativas no jogo

cenario.addEventListener("mousedown", () => {
    // Só atira se já não estiver atirando
    if (!estaAtirando) {
        estaAtirando = true
        frameAtirando = 0
        timerAnimacao = 0

        // Cria a bala por código
        criarBala()
    }
})

function criarBolaFeno() {

    const bola = document.createElement("img")

    bola.src = "../img/bolaFeno.png"
    bola.classList.add("bola-feno")

    let x = window.innerWidth
    let y = chao

    bola.style.left = `${x}px`
    bola.style.bottom = `${y}px`

    cenario.appendChild(bola)

    bolasFeno.push({
        elemento: bola,
        x: x,
        y: y,
        velocidade: 6
    })

}

function criarBala() {
    const balaElemento = document.createElement("div")
    balaElemento.classList.add("bala")

    // Descobre para onde a Morgana está olhando baseado no scaleX do transform
    const olhandoParaDireita = protagonista.style.transform !== "scaleX(-1)"

    // Posiciona a bala saindo mais ou menos da altura das mãos da Morgana
    let balaX = protaX + (olhandoParaDireita ? 100 : 20)
    let balaY = protaY + 75 // Altura do meio do corpo dela (150px / 2)

    balaElemento.style.left = `${balaX}px`
    balaElemento.style.bottom = `${balaY}px`

    cenario.appendChild(balaElemento)

    // Guarda a bala e a direção para onde ela deve voar
    balas.push({
        elemento: balaElemento,
        x: balaX,
        y: balaY,
        direcao: olhandoParaDireita ? 1 : -1
    })
}
function criarMoeda(x, y) {

    const moeda = document.createElement("img")

    moeda.src = "../img/moeda.png"   // imagem da moeda
    moeda.style.position = "absolute"
    moeda.style.width = "40px"
    moeda.style.height = "40px"
    moeda.style.left = `${x}px`
    moeda.style.bottom = `${y}px`
    moeda.style.zIndex = "4"

    cenario.appendChild(moeda)

    moedas.push({
        elemento: moeda,
        x: x,
        y: y
    })
}
// ==========================================
// SISTEMA DE FASES E INIMIGOS
// ==========================================
let faseAtual = 1
let inimigos = []

// === BANCO DE DADOS DOS INIMIGOS (ATUALIZADO PARA SUPORTAR LOOP DE TIRO) ===
// Dica: Se você tiver mais de um frame de tiro para eles, adicione na lista abaixo!
const dadosInimigos = {
    hostil1: { andando: ["../img/bandido1Andando1.png", "../img/bandido1Andando2.png", "../img/bandido1Andando3.png", "../img/bandido1Andando4.png", "../img/bandido1Andando5.png", "../img/bandido1Andando6.png", "../img/bandido1Andando7.png", "../img/bandido1Andando8.png"], atirando: ["../img/bandido1Atirando1.png", "../img/bandido1Atirando2.png", "../img/bandido1Atirando3.png", "../img/bandido1Atirando4.png",] },

    hostil2: { andando: ["../img/bandido2Andando1.png", "../img/bandido2Andando2.png", "../img/bandido2Andando3.png", "../img/bandido2Andando4.png", "../img/bandido2Andando5.png", "../img/bandido2Andando6.png", "../img/bandido2Andando7.png"], atirando: ["../img/bandido2Atirando1.png", "../img/bandido2Atirando2.png", "../img/bandido2Atirando3.png", "../img/bandido2Atirando4.png", "../img/bandido2Atirando5.png"] },

    hostil3: { andando: ["../img/xerifeAndando1.png", "../img/xerifeAndando2.png", "../img/xerifeAndando3.png", "../img/xerifeAndando4.png", "../img/xerifeAndando5.png", "../img/xerifeAndando6.png", "../img/xerifeAndando7.png"], atirando: ["../img/xerifeAtirando1.png", "../img/xerifeAtirando2.png", "../img/xerifeAtirando3.png", "../img/xerifeAtirando4.png", "../img/xerifeAtirando5.png"] },
//ARRUMAR
    obstaculo: {
        andando: ["../img/h1_anda1.png"]
    },

    chefao: {
        andando: ["../img/chefao_anda1.png"],
        atirando: ["../img/chefao_atira1.png", "../img/chefao_atira2.png"]
    }
}

// Configuração do mapa das fases e fundos de cenário
const configuracaoFases = {
    1: { inimigos: ["hostil1", "hostil2", "hostil3", "obstaculo"], fundo: "url('../img/cenario1.png')" },
    2: { inimigos: ["hostil1", "hostil2", "obstaculo"], fundo: "url('../img/cenario2.png')" },
    3: { inimigos: ["hostil2", "hostil3", "obstaculo"], fundo: "url('../img/cenario3.png')" },
    4: { inimigos: ["hostil1", "hostil2", "hostil3", "obstaculo"], fundo: "url('../img/cenario4.png')" },
    5: { inimigos: ["chefao"], fundo: "url('../img/cenario5.png')" }
}

function carregarCenarioDaFase() {
    cenario.style.backgroundImage = configuracaoFases[faseAtual].fundo
    cenario.style.backgroundSize = "cover"
    cenario.style.backgroundPosition = "center"
}

function criarInimigo() {
    const inimigoElemento = document.createElement("img")
    inimigoElemento.classList.add("inimigo")

    const listaInimigosDaFase = configuracaoFases[faseAtual].inimigos
    const tipoSorteado = listaInimigosDaFase[Math.floor(Math.random() * listaInimigosDaFase.length)]

    inimigoElemento.src = dadosInimigos[tipoSorteado].andando[0]

    if (tipoSorteado === "chefao") {
        inimigoElemento.style.width = "200px"
        inimigoElemento.style.height = "200px"
    }

    let posX = window.innerWidth
    inimigoElemento.style.left = `${posX}px`

    cenario.appendChild(inimigoElemento)

    inimigos.push({
        elemento: inimigoElemento,
        x: posX,
        tipo: tipoSorteado,
        frame: 0,
        timer: 0,
        estado: "andando",
        timerAtaque: 0
    })
}

setInterval(criarInimigo, 2500)
setInterval(criarBolaFeno, 7000)

function perderVida() {
    if (invencivel) {
        return
    }
    vidas--
    hudVidas.innerText = `Vidas: ${vidas} ♥`
    if (vidas <= 0) {

        jogoPausado = true

        menuGameOver.classList.remove("oculto")

        return

    }
}

// ==========================================
// GAME LOOP
// ==========================================
function loopDoJogo() {
    if (jogoPausado) {
        return
    }
    // --- 1. MOVIMENTO E ANIMAÇÃO DA PROTAGONISTA ---
    let estaAndando = false
    if (teclas["ArrowRight"] || teclas["KeyD"]) { protaX += velocidadeAndar; protagonista.style.transform = "scaleX(1)"; estaAndando = true }
    if (teclas["ArrowLeft"] || teclas["KeyA"]) { protaX -= velocidadeAndar; protagonista.style.transform = "scaleX(-1)"; estaAndando = true }
    if (protaX < 0) protaX = 0

    if ((teclas["ArrowUp"] || teclas["KeyW"] || teclas["Space"]) && !pulando) { velY = forcaPulo; pulando = true }
    protaY += velY
    if (protaY > chao) velY -= gravidade
    if (protaY <= chao) { protaY = chao; pulando = false; velY = 0; framePulo = 0 }

    if (estaAtirando) {
        timerAnimacao++
        if (timerAnimacao >= velocidadTiro) {
            timerAnimacao = 0; frameAtirando++
            if (frameAtirando >= spritesMorgana.atirando.length) { estaAtirando = false; frameAtirando = 0 }
        }
        if (estaAtirando) protagonista.src = spritesMorgana.atirando[frameAtirando]
    }
    else if (pulando) {
        timerAnimacao++
        if (timerAnimacao >= velocidadFrame) { timerAnimacao = 0; if (framePulo < spritesMorgana.pulo.length - 1) framePulo++ }
        protagonista.src = spritesMorgana.pulo[framePulo]
    }
    else if (estaAndando) {
        timerAnimacao++
        if (timerAnimacao >= velocidadFrame) { timerAnimacao = 0; frameCorrida = (frameCorrida + 1) % spritesMorgana.correndo.length }
        protagonista.src = spritesMorgana.correndo[frameCorrida]
    }
    else {
        protagonista.src = spritesMorgana.parada; frameCorrida = 0; framePulo = 0; timerAnimacao = 0
    }

    protagonista.style.left = `${protaX}px`
    protagonista.style.bottom = `${protaY}px`

    // --- 2. LOGICA E ANIMAÇÃO DOS INIMIGOS ---
    for (let i = inimigos.length - 1; i >= 0; i--) {
        let ini = inimigos[i]

        // ================================================================
        // INTELEGÊNCIA DE PERSEGUIÇÃO E DIREÇÃO (CORRIGIDA DE VERDADE)
        // ================================================================
        if (ini.estado === "andando") {
            // Se a Morgana passou deles (está na direita)
            if (protaX > ini.x) {
                ini.x += 2; // Anda para a direita

                // CORREÇÃO: Como seu sprite original olha para a esquerda, 
                // para olhar para a DIREITA nós precisamos inverter ele com (1)
                ini.elemento.style.transform = "scaleX(1)";
            }
            // Se a Morgana está na frente deles (na esquerda)
            else {
                ini.x -= 3; // Anda para a esquerda

                // CORREÇÃO: Para olhar para a ESQUERDA (padrão dele), usamos (-1)
                ini.elemento.style.transform = "scaleX(-1)";
            }
        }

        // --- MOTOR DE ANIMAÇÃO UNIFICADO ---
        ini.timer++
        if (ini.timer >= 12) {
            ini.timer = 0
            let listaSprites = dadosInimigos[ini.tipo][ini.estado]
            ini.frame = (ini.frame + 1) % listaSprites.length
            ini.elemento.src = listaSprites[ini.frame]
        }

        // ================================================================
        // SISTEMA DE ATAQUE E COLISÃO CORPO A CORPO (RESOLVE O ACÚMULO)
        // ================================================================
        if (ini.tipo !== "obstaculo" && ini.tipo !== "chefao") {
            ini.timerAtaque++

            // --- 1. Distância para o TIRO ---
            let distanciaX = Math.abs(protaX - ini.x)

            if (distanciaX < 450) {

                ini.timerAtaque++

                if (ini.timerAtaque >= 80 && ini.estado === "andando") {

                    ini.timerAtaque = 0
                    ini.estado = "atirando"
                    ini.frame = 0

                    if (!pulando) {
                        perderVida()
                    }

                    setTimeout(() => {
                        ini.estado = "andando"
                        ini.frame = 0
                    }, 800)
                }

            } else {
                ini.timerAtaque = 0
            }

            // --- 2. COLISÃO CORPO A CORPO (CORREÇÃO DO BUG DA PAREDE) ---
            // Se o inimigo andar e bater diretamente no corpo da Morgana:
            let distFisicaX = Math.abs(protaX - ini.x)
            let distFisicaY = Math.abs(protaY - chao) // Checa se a Morgana não pulou por cima

            if (distFisicaX < 50 && distFisicaY < 70) {
                // Remove o inimigo que bateu nela para ele não ficar acumulado!
                ini.elemento.remove()
                inimigos.splice(i, 1)
                perderVida() // Tira vida pelo impacto físico
                continue
            }
        }

        // Obstáculo (Inimigo de Pular):
        else if (ini.tipo === "obstaculo") {
            let distProtaX = Math.abs(protaX - ini.x)
            let distProtaY = Math.abs(protaY - chao)

            if (distProtaX < 65 && distProtaY < 70) {
                ini.elemento.remove()
                inimigos.splice(i, 1)
                perderVida()
                continue
            }
        }

        // Remove o inimigo se ele fugir demais para as bordas (evita travar o PC)
        if (ini.x < -200 || ini.x > window.innerWidth + 200) {
            ini.elemento.remove()
            inimigos.splice(i, 1)
            continue
        }

        ini.elemento.style.left = `${ini.x}px`
    }

    // --- 3. LÓGICA DOS PROJÉTEIS (MOVIMENTO E COLISÃO) ---
    for (let b = balas.length - 1; b >= 0; b--) {
        let bala = balas[b]

        // Move a bala para a esquerda ou direita baseada na direção da Morgana
        bala.x += (8 * bala.direcao) // 8 é a velocidade da bala
        bala.elemento.style.left = `${bala.x}px`

        let balaDestruida = false

        // Checa colisão da bala com cada inimigo da tela
        for (let i = inimigos.length - 1; i >= 0; i--) {
            let ini = inimigos[i]

            let distBalaX = Math.abs(bala.x - ini.x)
            let distBalaY = Math.abs(bala.y - (chao + 75)) // Centro vertical do inimigo

            // Se a bala encostar no corpo do inimigo (caixa de 150px)
            if (distBalaX < 50 && distBalaY < 75) {

                // Cria a moeda onde o inimigo morreu
                criarMoeda(ini.x + 40, chao + 20)
                // Remove o inimigo da tela
                ini.elemento.remove()
                inimigos.splice(i, 1)

                // Remove a bala
                bala.elemento.remove()
                balas.splice(b, 1)

                balaDestruida = true
                console.log("Inimigo derrotado com feitiço!")

                // Se era o chefão na fase 5, encerra o jogo com vitória
                if (ini.tipo === "chefao") {
                    alert("Parabéns! Você derrotou o Chefão com seus poderes e salvou o dia!")
                    location.reload()
                }
                break // Para de checar outros inimigos para esta bala destruída
            }
        }

        if (balaDestruida) continue

        // Remove a bala se ela sair dos limites da tela para não travar o jogo
        if (bala.x > window.innerWidth || bala.x < -50) {
            bala.elemento.remove()
            balas.splice(b, 1)
        }
    }
    for (let i = moedas.length - 1; i >= 0; i--) {

        let moeda = moedas[i]

        let distanciaX = Math.abs(protaX - moeda.x)
        let distanciaY = Math.abs(protaY - moeda.y)

        if (distanciaX < 50 && distanciaY < 80) {

            ouro++

            localStorage.setItem("ouro", ouro)

            hudOuro.innerText = `Ouro: ${ouro}`

            moeda.elemento.remove()
            moedas.splice(i, 1)
        }
    }
    for (let i = bolasFeno.length - 1; i >= 0; i--) {

        let bola = bolasFeno[i]

        bola.x -= bola.velocidade

        bola.elemento.style.left = `${bola.x}px`

        let distanciaX = Math.abs(protaX - bola.x)
        let distanciaY = Math.abs(protaY - bola.y)

        // Se não pulou
        if (distanciaX < 60 && protaY <= chao + 20) {

            bola.elemento.remove()
            bolasFeno.splice(i, 1)

            perderVida()
            continue
        }

        // Remove quando sair da tela
        if (bola.x < -100) {

            bola.elemento.remove()
            bolasFeno.splice(i, 1)
        }
    }

    requestAnimationFrame(loopDoJogo)
}

// Inicializa o cenário e dá a partida no jogo
carregarCenarioDaFase()
loopDoJogo()