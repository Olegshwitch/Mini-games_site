// Малювання об'єктів
function draw() {
    // Очищення canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Малювання цеглинок
    bricks.forEach(brick => {
        if (brick.visible) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.color;
            ctx.fill();
            ctx.closePath();
        }
    });
    
    // Малювання платформи
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();
    ctx.closePath();
    
    // Малювання м'яча
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();
}

// Перевірка колізій
function collisionDetection() {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        if (brick.visible) {
            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                ball.dy = -ball.dy;
                brick.visible = false;
                score += 10;
                scoreElement.textContent = `Рахунок: ${score}`;
                
                // Перевірка, чи всі цеглинки знищені
                if (bricks.every(b => !b.visible)) {
                    levelComplete();
                }
            }
        }
    }
}

// Оновлення стану гри
function update() {
    if (!gameRunning) return;
    
    // Очищення canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Малювання об'єктів
    draw();
    
    // Колізії зі стінами
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Колізія з платформою
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
            
            // Зміна напрямку в залежності від того, де вдарився м'яч
            const hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.dx = hitPosition * 5; // Множник для більшого ефекту
        } else {
            // Пропуск м'яча
            lives--;
            livesElement.textContent = `Життя: ${lives}`;
            
            if (lives <= 0) {
                gameOver();
            } else {
                // Скидання позиції м'яча і платформи
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 40;
                ball.dx = ball.speed;
                ball.dy = -ball.speed;
                paddle.x = canvas.width / 2 - paddle.width / 2;
            }
        }
    }
    
    // Рух платформи
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
    
    // Рух м'яча
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Перевірка колізій
    collisionDetection();
    
    // Продовження анімації
    requestAnimationFrame(update);
}

// Обробники подій клавіатури
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Обробники подій кнопок
startBtn.addEventListener('click', startGame);

restartBtn.addEventListener('click', () => {
    gameOverElement.style.display = 'none';
    startGame();
});

nextLevelBtn.addEventListener('click', () => {
    levelCompleteElement.style.display = 'none';
    level++;
    initGameObjects();
    update();
});

instructionsBtn.addEventListener('click', () => {
    alert('Використовуйте стрілки вліво та вправо для руху платформи. Збивайте цеглинки м\'ячем, не даючи йому впасти.');
});

// Завершення рівня
function levelComplete() {
    gameRunning = false;
    levelCompleteElement.style.display = 'block';
}

// Завершення гри
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = `Ваш рахунок: ${score}`;
    gameOverElement.style.display = 'block';
}
