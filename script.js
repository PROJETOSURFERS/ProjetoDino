const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dinoY = canvas.height - 100;
let dinoX = 50;
let gravity = 0.8;
let velocity = 0;
let isJumping = false;
let obstacles = [];
let coins = [];
let policeDistance = 150;

function drawDino() {
    ctx.fillStyle = "green";
    ctx.fillRect(dinoX, dinoY - 30, 30, 30); // Desenhando o dinossauro
}

function drawObstacles() {
    ctx.fillStyle = "brown";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, canvas.height - 50, obstacle.width, 50);
        obstacle.x -= 5; // Obstáculos se movem para a esquerda
    });
}

function drawCoins() {
    ctx.fillStyle = "yellow";
    coins.forEach((coin) => {
        ctx.beginPath();
        ctx.arc(coin.x, canvas.height - 75, 10, 0, Math.PI * 2, false);
        ctx.fill();
        coin.x -= 5; // Moedas se movem para a esquerda
    });
}

function checkCollisions() {
    obstacles.forEach((obstacle, index) => {
        if (dinoX + 30 > obstacle.x && dinoX < obstacle.x + obstacle.width && dinoY > canvas.height - 50) {
            endGame();
        }
    });

    coins.forEach((coin, index) => {
        if (dinoX + 30 > coin.x - 10 && dinoX < coin.x + 10 && dinoY > canvas.height - 75) {
            coins.splice(index, 1); // Remove a moeda ao colidir
        }
    });
}

function drawPolice() {
    ctx.fillStyle = "blue";
    ctx.fillRect(dinoX + 100, dinoY - 30, 20, 30); // Policial
    policeDistance += 0.1;
    if (policeDistance >= canvas.width) {
        endGame();
    }
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        velocity = -15;
    }
}

function restartGame() {
    dinoY = canvas.height - 100;
    dinoX = 50;
    gravity = 0.8;
    velocity = 0;
    isJumping = false;
    obstacles = [];
    coins = [];
    policeDistance = 150;
    gameOverDiv.classList.add('hidden');
    loop();
}

function endGame() {
    gameOverDiv.classList.remove('hidden');
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDino();
    drawObstacles();
    drawCoins();
    drawPolice();
    checkCollisions();

    if (isJumping) {
        dinoY += velocity;
        velocity += gravity;
        if (dinoY >= canvas.height - 100) {
            isJumping = false;
            dinoY = canvas.height - 100;
        }
    }

    if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, width: Math.random() * 50 + 50 });
    }

    if (Math.random() < 0.01) {
        coins.push({ x: canvas.width, y: canvas.height - 75 });
    }

    requestAnimationFrame(update);
}

canvas.addEventListener('click', jump); // Clique para pular
canvas.addEventListener('touchstart', jump); // Toque na tela para pular

update();