// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Función para generar un color aleatorio
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;  // Asignamos color
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;  // Usamos el color asignado
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;  // Asignamos color a las paletas
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = this.color;  // Usamos el color asignado para la paleta
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = [];  // Múltiples pelotas
        this.paddle1 = new Paddle(0, canvas.height / 2 - 100, 10, 200, getRandomColor(), true); // Paleta del jugador con doble altura
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, getRandomColor()); // Paleta de la computadora
        this.keys = {};  // Para capturar las teclas

        // Crear múltiples pelotas con diferentes propiedades
        this.createBalls(5); // Crearemos 5 pelotas
    }

    createBalls(numBalls) {
        for (let i = 0; i < numBalls; i++) {
            let radius = Math.random() * 10 + 10; // Tamaños aleatorios entre 10 y 20
            let speedX = Math.random() * 4 + 2; // Velocidad aleatoria en X entre 2 y 6
            let speedY = Math.random() * 4 + 2; // Velocidad aleatoria en Y entre 2 y 6
            let color = getRandomColor(); // Color aleatorio
            this.balls.push(new Ball(canvas.width / 2, canvas.height / 2, radius, speedX, speedY, color));
        }
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        this.balls.forEach(ball => {
            ball.move();

            // Colisiones con la paleta del jugador (paddle1)
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX; // Rebote horizontal
            }

            // Colisiones con la paleta de la computadora (paddle2)
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX; // Rebote horizontal
            }

            // Detectar cuando la pelota sale de los bordes (punto marcado)
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.balls[0]); // La IA sigue la primera pelota
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();
