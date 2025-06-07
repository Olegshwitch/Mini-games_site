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
    canvasHeight = Math.floor(canvasWidth * 0.625);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    if (gameRunning) {
        initGameObjects();
    }
}

// Ініціалізація ігрових об'єктів
function initGameObjects() {
    paddle = {
        x: canvas.width / 2 - canvas.width * 0.125,
        y: canvas.height - 20,
        width: canvas.width * 0.25,
        height: 15,
        speed: canvas.width * 0.01
    };

    ball = {
        x: canvas.width / 2,
        y: canvas.height - 40,
        radius: canvas.width * 0.0125,
        dx: canvas.width * 0.00625,
        dy: -canvas.width * 0.00625,
        speed: canvas.width * 0.00625
    };

    createBricks();
}

function createBricks() {
    bricks = [];
    const brickRowCount = 3 + level;
    const brickColumnCount = 8;
    const brickWidth = canvas.width * 0.09375;
    const brickHeight = canvas.width * 0.025;
    const brickPadding = canvas.width * 0.0125;
    const brickOffsetTop = canvas.width * 0.075;
    const brickOffsetLeft = canvas.width * 0.0375;

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

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    bricks.forEach(brick => {
        if (brick.visible) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            ctx.closePath();
        }
    });
}

function collisionDetection() {
    bricks.forEach(brick => {
        if (brick.visible) {
            if (ball.x > brick.x && ball.x < brick.x + brick.width &&
                ball.y > brick.y && ball.y < brick.y + brick.height) {
                ball.dy = -ball.dy;
                brick.visible = false;
                score += 10;
                scoreElement.textContent = `Рахунок: ${score}`;
                
                if (bricks.every(b => !b.visible)) {
                    levelComplete();
                }
            }
        }
    });
}

function paddleCollision() {
    if (ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        const hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        const angle = hitPosition * Math.PI / 3;
        
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        livesElement.textContent = `Життя: ${lives}`;
        
        if (lives <= 0) {
            gameOver();
        } else {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 40;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -5;
    paddle.x = canvas.width / 2 - 50;
}

function updatePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.fillText(`Рівень: ${level}`, 20, 30);
}

function update() {
    updatePaddle();
    updateBall();
    collisionDetection();
    paddleCollision();
    draw();
    
    if (gameRunning) {
        requestAnimationFrame(update);
    }
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = `Ваш рахунок: ${score}`;
    gameOverElement.style.display = 'block';
}

function levelComplete() {
    gameRunning = false;
    levelCompleteElement.style.display = 'block';
}

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

function nextLevel() {
    level++;
    gameRunning = true;
    levelCompleteElement.style.display = 'none';
    initGame();
    update();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', nextLevel);
instructionsBtn.addEventListener('click', () => {
    window.location.href = 'index1.html';
});

initCanvasSize();
