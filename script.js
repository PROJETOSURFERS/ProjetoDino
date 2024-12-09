let dino = document.getElementById('dino');
let police = document.getElementById('police');
let meteor = document.getElementById('meteor');
let score = document.getElementById('score');
let gameOver = document.getElementById('gameOver');
let restartBtn = document.getElementById('restartBtn');

let dinoY = 10;
let policeX = 800;
let meteorX = 600;
let meteorY = -100;
let points = 0;
let gameRunning = true;

function moveDino(event) {
    if (event.key === "ArrowUp" || event.type === "touchstart") {
        dinoY = 100;
        dino.style.bottom = dinoY + "px";
    }
}

function movePolice() {
    policeX -= 3;
    if (policeX < 0) policeX = 800;
    police.style.left = policeX + "px";
}

function moveMeteor() {
    meteorY += 5;
    if (meteorY > 400) {
        meteorY = -100;
        meteorX = Math.random() * 700 + 50;
    }
    meteor.style.top = meteorY + "px";
    meteor.style.left = meteorX + "px";
}

function checkCollision() {
    if (Math.abs(dinoY - meteorY) < 60 && Math.abs(100 - meteorX) < 50) {
        gameRunning = false;
        gameOver.style.display = "block";
    }
}

function updateScore() {
    if (gameRunning) {
        points++;
        score.textContent = "Pontuação: " + points;
    }
}

function gameLoop() {
    if (!gameRunning) return;
    
    movePolice();
    moveMeteor();
    checkCollision();
    updateScore();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", moveDino);
document.addEventListener("touchstart", moveDino);

restartBtn.addEventListener("click", () => {
    gameOver.style.display = "none";
    points = 0;
    policeX = 800;
    meteorX = 600;
    meteorY = -100;
    dinoY = 10;
    gameRunning = true;
    gameLoop();
});

gameLoop();
