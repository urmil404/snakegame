// snake.js

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var gridSize = 20; // Smaller grid size
var gridWidth = canvas.width / gridSize;
var gridHeight = canvas.height / gridSize;

var snake = {
    x: Math.floor(gridWidth / 2) * gridSize,
    y: Math.floor(gridHeight / 2) * gridSize,
    dx: gridSize,
    dy: 0,
    cells: [],
    maxCells: 4
};

var appleCount = 0; // To keep track of eaten apples
var apple = {
    x: Math.floor(Math.random() * gridWidth) * gridSize,
    y: Math.floor(Math.random() * gridHeight) * gridSize
};

var frameRate = 60; // Initial frame rate (60 fps)
var speedIncrement = 2; // Speed increment (in milliseconds)

var count = 0; // Counter for game loop

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawSnakeFace() {
    context.fillStyle = 'white';
    context.fillRect(snake.x + gridSize / 4, snake.y + gridSize / 4, gridSize / 2, gridSize / 2);
}

function drawAppleCount() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Apples: ' + appleCount, 10, 30);
}

function drawGameOver() {
    context.fillStyle = 'white';
    context.font = '40px Arial';
    context.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2 - 20);
    context.font = '20px Arial';
    context.fillText('Score: ' + appleCount, canvas.width / 2 - 50, canvas.height / 2 + 20);
}

function loop() {
    requestAnimationFrame(loop);

    if (++count < 4) {
        return;
    }
    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        gameOver();
        return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, gridSize, gridSize);

    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, gridSize - 1, gridSize - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            appleCount++;

            if (appleCount % 5 === 0) { // Display count every 5 apples
                drawAppleCount();
            }

            apple.x = getRandomInt(0, gridWidth) * gridSize;
            apple.y = getRandomInt(0, gridHeight) * gridSize;

            // Increase speed based on apple count
            frameRate -= speedIncrement;
            if (frameRate < 50) {
                frameRate = 50; // Minimum frame rate
            }
        }

        // Check collision with self
        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[ i ].x && cell.y === snake.cells[ i ].y) {
                gameOver();
                return;
            }
        }
    });

    drawSnakeFace();
}

function gameOver() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGameOver();
}

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -gridSize;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -gridSize;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = gridSize;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = gridSize;
        snake.dx = 0;
    }
});
document.querySelector('.up').addEventListener('click', () => {
    if (snake.dy === 0) {
        snake.dy = -gridSize;
        snake.dx = 0;
    }
});

document.querySelector('.left').addEventListener('click', () => {
    if (snake.dx === 0) {
        snake.dx = -gridSize;
        snake.dy = 0;
    }
});

document.querySelector('.down').addEventListener('click', () => {
    if (snake.dy === 0) {
        snake.dy = gridSize;
        snake.dx = 0;
    }
});

document.querySelector('.right').addEventListener('click', () => {
    if (snake.dx === 0) {
        snake.dx = gridSize;
        snake.dy = 0;
    }
});

requestAnimationFrame(loop);
