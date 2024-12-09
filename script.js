const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Variáveis de jogo
let isGameOver = false;
let score = 0;
let player = { x: 50, y: 300, width: 50, height: 50, dy: 0, isJumping: false };
let obstacles = [{ x: 800, y: 300, width: 50, height: 50 }];
let meteor = { x: 800, y: -100, width: 100, height: 100, dy: 5 };
let bloodEffect = false;

// Controle de eventos (toques ou teclado)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.isJumping) jump();
});
canvas.addEventListener('touchstart', jump);

// Função de pulo
function jump() {
    if (!player.isJumping) {
        player.isJumping = true;
        player.dy = -15;
    }
}

// Loop de animação
function gameLoop() {
    if (isGameOver) {
        showGameOverScreen();
        return;
    }
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Atualização de lógica do jogo
function update() {
    // Física do jogador
    player.dy += 1;
    player.y += player.dy;
    if (player.y > 300) {
        player.y = 300;
        player.isJumping = false;
    }

    // Obstáculos
    obstacles.forEach((obstacle, i) => {
        obstacle.x -= 5;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
        }

        // Verificar colisão
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            triggerGameOver();
        }
    });

    // Adicionar novos obstáculos
    if (Math.random() < 0.01) {
        obstacles.push({ x: 800, y: 300, width: 50, height: 50 });
    }

    // Meteorito
    if (isGameOver) {
        meteor.y += meteor.dy;
        if (meteor.y > 400 && !bloodEffect) {
            bloodEffect = true;
            setTimeout(() => (bloodEffect = false), 500);
        }
    }
}

// Desenhar elementos na tela
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jogador
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Obstáculos
    ctx.fillStyle = 'red';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Meteorito
    if (isGameOver) {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 50, 0, Math.PI * 2);
        ctx.fill();

        if (bloodEffect) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y + 50, 30, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Pontuação
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, 20);
}

// Tela de game over
function showGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Você foi extinto!', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Pressione R para reiniciar', canvas.width / 2, canvas.height / 2 + 50);
}

// Reiniciar jogo
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR') resetGame();
});

function resetGame() {
    isGameOver = false;
    score = 0;
    player.y = 300;
    player.dy = 0;
    obstacles = [{ x: 800, y: 300, width: 50, height: 50 }];
    meteor.y = -100;
    bloodEffect = false;
    gameLoop();
}

function triggerGameOver() {
    isGameOver = true;
    setTimeout(() => {
        meteor.x = player.x;
        meteor.y = -100;
    }, 500);
}

// Iniciar jogo
gameLoop();
