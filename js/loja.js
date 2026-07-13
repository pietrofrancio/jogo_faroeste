// ================================
// SISTEMA DA LOJA
// ================================

// Ouro
let ouro = Number(localStorage.getItem("ouro")) || Number(localStorage.getItem("ouroEstoque")) || 0;
const ouroInsuficiente = new Audio('../efeitos_sonoros/ouro_insuficiente.mp3');

// Personagens
let personagensComprados = JSON.parse(localStorage.getItem("personagensComprados")) || [];
let personagemSelecionado = localStorage.getItem("personagemSelecionado") || "morgana";

// Personagem do Jogador 2 (usado no modo Cooperativo / 2 Jogadores)
let personagemSelecionadoP2 = localStorage.getItem("personagemSelecionadoP2") || "morgana";

// Músicas
let musicasCompradas = JSON.parse(localStorage.getItem("musicasCompradas")) || [];
let musicaSelecionada = localStorage.getItem("musicaJogo") || "../music/musica_fundo1.mp3";

// Armas
let armasCompradas = JSON.parse(localStorage.getItem("armasCompradas")) || [];
let velocidadeBala = 18;
let armaSelecionada = localStorage.getItem("armaSelecionada") || "arma Inicial";

// Morgana sempre disponível
if (!personagensComprados.includes("morgana")) {
    personagensComprados.push("morgana");
    localStorage.setItem("personagensComprados", JSON.stringify(personagensComprados));
}

// Música padrão sempre disponível
if (!musicasCompradas.includes("../music/musica_fundo1.mp3")) {
    musicasCompradas.push("../music/musica_fundo1.mp3");
    localStorage.setItem("musicasCompradas", JSON.stringify(musicasCompradas));
}

// Arma Inicial sempre disponível
if(!armasCompradas.includes("arma Inicial")){
    armasCompradas.push("arma Inicial");
    localStorage.setItem("armasCompradas", JSON.stringify(armasCompradas));
}

// ================================

// Verifica qual o ID do HTML que está sendo usado no momento
const displayOuro = document.getElementById("ouroLoja") || document.getElementById("ouro");

const personagens = [
    { nome: "morgana", preco: 0, botao: document.getElementById("btn-morgana") },
    { nome: "ruby", preco: 15, botao: document.getElementById("btn-ruby") },
    { nome: "jack", preco: 25, botao: document.getElementById("btn-jack") }
];

const personagensP2 = [
    { nome: "morgana", preco: 0, botao: document.getElementById("btn-morgana-p2") },
    { nome: "ruby", preco: 15, botao: document.getElementById("btn-ruby-p2") },
    { nome: "jack", preco: 25, botao: document.getElementById("btn-jack-p2") }
];

const musicas = [
    { caminho: "../music/musica_fundo1.mp3", preco: 0, botao: document.getElementById("btn-musica1") },
    { caminho: "../music/duelo_epico.mp3", preco: 10, botao: document.getElementById("btn-musica2") },
    { caminho: "../music/duelo_final.mp3", preco: 20, botao: document.getElementById("btn-musica3") }
];

const armas = [
    { tipo: "revolver", preco: 20, botao: document.getElementById('btn-revolver') },
    { tipo: "arma Inicial", preco: 0, botao: document.getElementById('btn-armaInicial') }
];

// ================================

function atualizarOuro() {
    if (displayOuro) {
        displayOuro.innerText = `Ouro: ${ouro}`;
    }
}

// ================================

function atualizarPersonagens() {
    personagens.forEach(personagem => {
        const btn = personagem.botao;
        if (!btn) return;

        if (personagem.nome === personagemSelecionado) {
            btn.innerText = "Equipado";
            btn.disabled = true;
        } else if (personagensComprados.includes(personagem.nome)) {
            btn.innerText = "Selecionar";
            btn.disabled = false;
        } else {
            btn.innerText = `Comprar (${personagem.preco})`;
            btn.disabled = false;
        }
    });
}

function atualizarPersonagensP2() {
    personagensP2.forEach(personagem => {
        const btn = personagem.botao;
        if (!btn) return;

        if (personagem.nome === personagemSelecionadoP2) {
            btn.innerText = "Equipado";
            btn.disabled = true;
        } else if (personagensComprados.includes(personagem.nome)) {
            btn.innerText = "Selecionar";
            btn.disabled = false;
        } else {
            btn.innerText = `Comprar (${personagem.preco})`;
            btn.disabled = false;
        }
    });
}

// ================================

function atualizarMusicas() {
    musicas.forEach(musica => {
        const btn = musica.botao;
        if (!btn) return;

        if (musica.caminho === musicaSelecionada) {
            btn.innerText = "Equipada";
            btn.disabled = true;
        } else if (musicasCompradas.includes(musica.caminho)) {
            btn.innerText = "Selecionar";
            btn.disabled = false;
        } else {
            btn.innerText = `Comprar (${musica.preco})`;
            btn.disabled = false;
        }
    });
}

function atualizarArmas() {
    armas.forEach(arma => {
        const btn = arma.botao;
        if (!btn) return;

        if (arma.tipo === armaSelecionada) {
            btn.innerText = "Equipada";
            btn.disabled = true;
        } else if (armasCompradas.includes(arma.tipo)) {
            btn.innerText = "Selecionar";
            btn.disabled = false;
        } else {
            btn.innerText = `Comprar (${arma.preco})`;
            btn.disabled = false;
        }
    });
}

// ================================
// PERSONAGENS P1
// ================================

function clicarPersonagem(nome) {
    const personagem = personagens.find(p => p.nome === nome);

    if (!personagensComprados.includes(nome)) {
        if (ouro < personagem.preco) {
            ouroInsuficiente.play().catch(e => console.log(e)); // Adicionado o .catch para evitar problemas na DOM
            alert("Ouro insuficiente!");
            return;
        }

        ouro -= personagem.preco;
        personagensComprados.push(nome);

        localStorage.setItem("ouro", ouro);
        // Atualiza a key antiga por precaução, se você ainda usar em outros lugares do código
        localStorage.setItem("ouroEstoque", ouro); 
        localStorage.setItem("personagensComprados", JSON.stringify(personagensComprados));
    }

    personagemSelecionado = nome;
    localStorage.setItem("personagemSelecionado", nome);

    atualizarOuro();
    atualizarPersonagens();
    atualizarPersonagensP2();
}

// ================================
// PERSONAGENS P2  
// ================================

function clicarPersonagemP2(nome) {
    const personagem = personagensP2.find(p => p.nome === nome);

    if (!personagensComprados.includes(nome)) {
        if (ouro < personagem.preco) {
            ouroInsuficiente.play().catch(e => console.log(e));
            alert("Ouro insuficiente!");
            return;
        }

        ouro -= personagem.preco;
        personagensComprados.push(nome);

        localStorage.setItem("ouro", ouro);
        localStorage.setItem("ouroEstoque", ouro);
        localStorage.setItem("personagensComprados", JSON.stringify(personagensComprados));
    }

    personagemSelecionadoP2 = nome;
    localStorage.setItem("personagemSelecionadoP2", nome);

    atualizarOuro();
    atualizarPersonagens();
    atualizarPersonagensP2();
}

// ================================
// MÚSICAS
// ================================

function clicarMusica(caminho) {
    const musica = musicas.find(m => m.caminho === caminho);

    if (!musicasCompradas.includes(caminho)) {
        if (ouro < musica.preco) {
            ouroInsuficiente.play().catch(e => console.log(e));
            alert("Ouro insuficiente!");
            return;
        }

        ouro -= musica.preco;
        musicasCompradas.push(caminho);

        localStorage.setItem("ouro", ouro);
        localStorage.setItem("ouroEstoque", ouro);
        localStorage.setItem("musicasCompradas", JSON.stringify(musicasCompradas));
    }

    musicaSelecionada = caminho;
    localStorage.setItem("musicaJogo", caminho);

    atualizarOuro();
    atualizarMusicas();
}

// ================================
// ARMAS
// ================================

function clicarArma(tipo) {
    const arma = armas.find(m => m.tipo === tipo);

    if (!armasCompradas.includes(tipo)) {
        if (ouro < arma.preco) {
            ouroInsuficiente.play().catch(e => console.log(e));
            alert("Ouro insuficiente!");
            return;
        }

        ouro -= arma.preco;
        armasCompradas.push(tipo);

        localStorage.setItem("ouro", ouro);
        localStorage.setItem("ouroEstoque", ouro);
        localStorage.setItem("armasCompradas", JSON.stringify(armasCompradas));
    }

    armaSelecionada = tipo;
    localStorage.setItem("armaSelecionada", tipo);

    velocidadeBala = armaSelecionada === "revolver" ? 28 : 18;
    
    atualizarOuro();
    atualizarArmas();
}

// ================================
// CONFIGURAÇÃO DOS EVENTOS (Garantindo que os elementos existem na tela)
// ================================

const configurarClique = (id, callback) => {
    const el = document.getElementById(id);
    if (el) el.onclick = callback;
};

// P1
configurarClique("btn-morgana", () => clicarPersonagem("morgana"));
configurarClique("btn-ruby", () => clicarPersonagem("ruby"));
configurarClique("btn-jack", () => clicarPersonagem("jack"));

// P2
configurarClique("btn-morgana-p2", () => clicarPersonagemP2("morgana"));
configurarClique("btn-ruby-p2", () => clicarPersonagemP2("ruby"));
configurarClique("btn-jack-p2", () => clicarPersonagemP2("jack"));

// Músicas
configurarClique("btn-musica1", () => clicarMusica("../music/musica_fundo1.mp3"));
configurarClique("btn-musica2", () => clicarMusica("../music/duelo_epico.mp3"));
configurarClique("btn-musica3", () => clicarMusica("../music/duelo_final.mp3"));

// Armas
configurarClique("btn-revolver", () => clicarArma("revolver"));
configurarClique("btn-armaInicial", () => clicarArma("arma Inicial"));


// ================================
// INICIALIZAÇÃO DA INTERFACE
// ================================

atualizarOuro();
atualizarPersonagens();
atualizarPersonagensP2();
atualizarMusicas();
atualizarArmas();