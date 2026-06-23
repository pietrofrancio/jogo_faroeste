// 1. Configuração Inicial do Canvas e Contexto
const canvas = document.getElementById('des');
const des = canvas.getContext('2d'); 

const chao_y = 600; // Posição Y onde fica o chão

// ---------------------------------------------------------
// 2. Definição das Classes
// ---------------------------------------------------------
class ObjetoJogo {
    constructor(x, y, w, h, cor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.cor = cor;
    }

    desenha() {
        des.fillStyle = this.cor;
        des.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Jogador extends ObjetoJogo {
    constructor(x, y, w, h, cor) {
        super(x, y, w, h, cor);
        this.velY = 0;
        this.gravidade = 0.8;
        this.forcaPulo = -18; 
        this.pulando = false;
    }

    pula() {
        if (!this.pulando) {
            this.velY = this.forcaPulo;
            this.pulando = true;
        }
    }

    atualizaMovimento() {
        this.velY += this.gravidade;
        this.y += this.velY;

        // Impede o jogador de cair abaixo do chão
        if (this.y >= chao_y - this.h) {
            this.y = chao_y - this.h;
            this.velY = 0;
            this.pulando = false;
        }
    }

    colidiuCom(obstaculo) {
        return (
            this.x < obstaculo.x + obstaculo.w &&
            this.x + this.w > obstaculo.x &&
            this.y < obstaculo.y + obstaculo.h &&
            this.y + this.h > obstaculo.y
        );
    }
}

class Obstaculo extends ObjetoJogo {
    constructor(x, y, w, h, cor, velocidade) {
        super(x, y, w, h, cor);
        this.velocidade = velocidade;
        this.ativo = true;
    }

    atualizaMovimento() {
        if (!this.ativo) return;
        this.x -= this.velocidade;
    }

    saiuDaTela() {
        return this.x + this.w < 0;
    }
}

// ---------------------------------------------------------
// 3. Inicialização dos Objetos
// ---------------------------------------------------------
const player = new Jogador(100, chao_y - 80, 60, 80, "blue"); 
const inimigos = [];

// Função para gerar inimigos
function gerarObstaculo() {
    let tamanho = 40 + Math.random() * 40; 
    inimigos.push(new Obstaculo(canvas.width, chao_y - tamanho, 40, tamanho, "red", 8));
}

// Gera um inimigo a cada 2 segundos
setInterval(gerarObstaculo, 2000);

// Evento de Pulo
window.addEventListener("keydown", (e) => {
    if(e.code === "Space" || e.code === "ArrowUp") {
        player.pula();
    }
});

// ---------------------------------------------------------
// 4. Loop Principal do Jogo
// ---------------------------------------------------------
function gameLoop() {
    // Limpa a tela inteira para o próximo frame
    des.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o chão verde para referência visual
    des.fillStyle = "green";
    des.fillRect(0, chao_y, canvas.width, 5);

    // Atualiza e desenha o jogador
    player.atualizaMovimento();
    player.desenha();

    // Atualiza, desenha e limpa os inimigos
    for (let i = inimigos.length - 1; i >= 0; i--) {
        let inimigo = inimigos[i];
        inimigo.atualizaMovimento();
        inimigo.desenha();

        // Checa colisão
        if (player.colidiuCom(inimigo)) {
            console.log("Game Over!");
        }

        // Remove do array se saiu da tela (otimização de memória)
        if (inimigo.saiuDaTela()) {
            inimigos.splice(i, 1);
        }
    }

    // Mantém o loop rodando a ~60 FPS
    requestAnimationFrame(gameLoop);
}

// 5. Inicia o Jogo
gameLoop();