const areaJogo = document.getElementById('area-jogo');
const pontuacaoElemento = document.getElementById('pontuacao');

const largura = 800;
const altura = 600;
const TAMANHO_SEGMENTO_INICIAL = 18;
const TAMANHO_SEGMENTO_MAXIMO = 40;
const VELOCIDADE_INICIAL = 2.2;
const RECOMPENSA_CRESCIMENTO = 4; // Quantos segmentos a mais por fruta
const RAIO_FRUTA = TAMANHO_SEGMENTO_INICIAL / 2.8;
const RAIO_COLISAO_FRUTA = TAMANHO_SEGMENTO_INICIAL / 1.5;
const INTERVALO_ATUALIZACAO = 1000 / 60; // 60 FPS

let tamanhoSegmento = TAMANHO_SEGMENTO_INICIAL;
let velocidade = VELOCIDADE_INICIAL;
let tempoUltimaAtualizacao = 0;

let minhoca = [
    { x: largura / 2, y: altura / 2 }
];
let direcao = { x: 1, y: 0 }; // Começa indo para a direita
let proximaDirecao = { x: 1, y: 0 };
let fruta = gerarFruta();
let pontuacao = 0;

function desenhar() {
    const contexto = areaJogo.getContext('2d');
    contexto.clearRect(0, 0, largura, altura);

    // Desenhar fruta (menor)
    contexto.fillStyle = '#e53935';
    contexto.beginPath();
    contexto.arc(fruta.x, fruta.y, RAIO_FRUTA, 0, 2 * Math.PI);
    contexto.fill();

    // Desenhar minhoca
    contexto.fillStyle = '#4caf50';
    for (let segmento of minhoca) {
        contexto.beginPath();
        contexto.arc(segmento.x, segmento.y, TAMANHO_SEGMENTO_INICIAL / 2, 0, 2 * Math.PI);
        contexto.fill();
    }
}

function atualizar() {
    direcao.x = proximaDirecao.x;
    direcao.y = proximaDirecao.y;

    const cabeca = minhoca[0];
    const novaCabeca = {
        x: cabeca.x + direcao.x * velocidade,
        y: cabeca.y + direcao.y * velocidade
    };
    minhoca.unshift(novaCabeca);

    // Mantém o comprimento da minhoca proporcional à pontuação
    while (minhoca.length > pontuacao * RECOMPENSA_CRESCIMENTO + 1) {
        minhoca.pop();
    }

    // Verifica se comeu a fruta
    if (Math.hypot(novaCabeca.x - fruta.x, novaCabeca.y - fruta.y) < RAIO_COLISAO_FRUTA) {
        pontuacao++;
        fruta = gerarFruta();
        // Não aumenta o tamanho do segmento, só o comprimento
    }

    // Limitar minhoca dentro da área
    if (
        novaCabeca.x < TAMANHO_SEGMENTO_INICIAL/2 || novaCabeca.x > largura - TAMANHO_SEGMENTO_INICIAL/2 ||
        novaCabeca.y < TAMANHO_SEGMENTO_INICIAL/2 || novaCabeca.y > altura - TAMANHO_SEGMENTO_INICIAL/2
    ) {
        reiniciarJogo();
    }

    pontuacaoElemento.textContent = `Pontuação: ${pontuacao}`;
}

function gerarFruta() {
    return {
        x: Math.random() * (largura - TAMANHO_SEGMENTO_INICIAL * 2) + TAMANHO_SEGMENTO_INICIAL,
        y: Math.random() * (altura - TAMANHO_SEGMENTO_INICIAL * 2) + TAMANHO_SEGMENTO_INICIAL
    };
}

function reiniciarJogo() {
    minhoca = [{ x: largura / 2, y: altura / 2 }];
    pontuacao = 0;
    fruta = gerarFruta();
    direcao = { x: 0, y: 0 };
    velocidade = VELOCIDADE_INICIAL;
    tamanhoSegmento = TAMANHO_SEGMENTO_INICIAL;
}

window.addEventListener('keydown', function(evento) {
    switch (evento.key) {
        case 'ArrowUp':
        case 'w':
            if (!(direcao.x === 0 && direcao.y === -1)) proximaDirecao = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
            if (!(direcao.x === 0 && direcao.y === 1)) proximaDirecao = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
            if (!(direcao.x === -1 && direcao.y === 0)) proximaDirecao = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
            if (!(direcao.x === 1 && direcao.y === 0)) proximaDirecao = { x: 1, y: 0 };
            break;
    }
});

function loopJogo(tempoAtual) {
    if (!tempoUltimaAtualizacao || tempoAtual - tempoUltimaAtualizacao > INTERVALO_ATUALIZACAO) {
        atualizar();
        desenhar();
        tempoUltimaAtualizacao = tempoAtual;
    }
    requestAnimationFrame(loopJogo);
}

requestAnimationFrame(loopJogo);
