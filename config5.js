// Отримуємо елементи DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const levelCompleteElement = document.getElementById('level-complete');
const nextLevelBtn = document.getElementById('next-level-btn');

// Змінні гри
let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let bricks = [];
let ball = {};
let paddle = {};
let rightPressed = false;
let leftPressed = false;
let canvasWidth, canvasHeight;

// Кольори для цеглинок
const brickColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];

// Ініціалізація розмірів canvas
function initCanvasSize() {
    const container = document.querySelector('.game-board-container');
    canvasWidth = container.clientWidth;
    canvasHeight = Math.floor(canvasWidth * 0.625); // 5/8 співвідношення
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    if (gameRunning) {
        initGameObjects();
    }
}

// Ініціалізація ігрових об'єктів
function initGameObjects() {
    // Платформа
    paddle = {
        x: canvas.width / 2 - canvas.width * 0.125, // 12.5% ширини canvas
        y: canvas.height - 20,
        width: canvas.width * 0.25, // 25% ширини canvas
        height: 15,
        speed: canvas.width * 0.01 // Швидкість залежить від ширини
    };

    // М'яч
    ball = {
        x: canvas.width / 2,
        y: canvas.height - 40,
        radius: canvas.width * 0.0125, // 1.25% ширини canvas
        dx: canvas.width * 0.00625, // 0.625% ширини canvas
        dy: -canvas.width * 0.00625,
        speed: canvas.width * 0.00625
    };

    // Створення цеглинок
    createBricks();
}

// Створення цеглинок
function createBricks() {
    bricks = [];
    const brickRowCount = 3 + level;
    const brickColumnCount = 8;
    const brickWidth = canvas.width * 0.09375; // 9.375% ширини canvas (75px при 800px)
    const brickHeight = canvas.width * 0.025; // 2.5% ширини canvas (20px при 800px)
    const brickPadding = canvas.width * 0.0125; // 1.25% ширини canvas (10px при 800px)
    const brickOffsetTop = canvas.width * 0.075; // 7.5% ширини canvas (60px при 800px)
    const brickOffsetLeft = canvas.width * 0.0375; // 3.75% ширини canvas (30px при 800px)

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            const brickColor = brickColors[r % brickColors.length];
            
            bricks.push({
                x: brickX,
                y: brickY,
                width: brickWidth,
                height: brickHeight,
                color: brickColor,
                visible: true
            });
        }
    }
}

// Інші функції залишаються такими ж, але використовують нові властивості об'єктів

// Ініціалізація гри
function initGame() {
    initGameObjects();
}

// Початок гри
function startGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    level = 1;
    scoreElement.textContent = `Рахунок: ${score}`;
    livesElement.textContent = `Життя: ${lives}`;
    gameOverElement.style.display = 'none';
    levelCompleteElement.style.display = 'none';
    initGame();
    update();
}

// Обробник події resize
window.addEventListener('resize', () => {
    initCanvasSize();
});

// Ініціалізація при завантаженні
initCanvasSize();

// Решта вашого коду залишається без змін...
// (всі інші функції, які не змінювалися)
