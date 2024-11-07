let score = 0;
let enemies = [];
let gameInterval;
let enemyCount = 1;
let maxEnemies = 10;
const playerSpeed = 7; // Ajusta la velocidad si es necesario
const keysPressed = {}; // Para guardar el estado de las teclas presionadas
let gameActive = false; // Indicador de si el juego está activo

const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-button");
const gameContainer = document.getElementById("game-container");

// Función para iniciar el juego
function startGame() {
    if (gameActive) return; // Evita iniciar múltiples juegos al mismo tiempo
    gameActive = true;

    score = 0;
    enemyCount = 1;
    scoreDisplay.textContent = "Tiempo: " + score + "s";
    startButton.style.display = "none";
    player.style.left = "50%";
    player.style.top = "50%";

    // Limpiar enemigos anteriores (si los hay)
    clearEnemies();

    // Crear el primer enemigo y agregarlo al contenedor
    createEnemy();

    // Incrementa el tiempo cada segundo y chequea si debe agregar otro enemigo
    gameInterval = setInterval(updateScore, 1000);

    // Detecta el estado de las teclas
    document.addEventListener("keydown", (event) => (keysPressed[event.key] = true));
    document.addEventListener("keyup", (event) => (keysPressed[event.key] = false));

    // Inicia el bucle de movimiento del jugador
    requestAnimationFrame(updatePlayerPosition);
}

// Función para actualizar el puntaje (tiempo de supervivencia)
function updateScore() {
    if (!gameActive) return; // Verifica que el juego esté activo
    score++;
    scoreDisplay.textContent = "Tiempo: " + score + "s";

    // Cada 10 segundos se añade un nuevo enemigo (hasta un máximo de 5)
    if (score % 10 === 0 && enemyCount < maxEnemies) {
        createEnemy();
    }
}

// Función para crear un enemigo con movimiento continuo
function createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
    enemyCount++;
    moveEnemy(enemy); // Mueve el nuevo enemigo
}

// Función para mover el enemigo de forma continua y cambiar de dirección al chocar con los bordes
function moveEnemy(enemy) {
    let xSpeed = Math.random() * 3 + 1.5; // Velocidad horizontal
    let ySpeed = Math.random() * 3 + 1.5; // Velocidad vertical
    let bounceCountX = 0; // Contador de rebotes horizontales
    let bounceCountY = 0; // Contador de rebotes verticales

    function updatePosition() {
        if (!gameActive) return; // Detener movimiento si el juego no está activo

        const enemyRect = enemy.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();

        // Cambiar dirección si el enemigo toca los bordes
        if (enemyRect.left <= containerRect.left || enemyRect.right >= containerRect.right) {
            xSpeed = -xSpeed;
            bounceCountX++;

            // Si rebota en el mismo eje más de 3 veces seguidas, cambia el ángulo
            if (bounceCountX > 3) {
                xSpeed += (Math.random() * 2 - 1); // Ajusta el ángulo ligeramente
                bounceCountX = 0; // Reinicia el contador
            }
        }

        if (enemyRect.top <= containerRect.top || enemyRect.bottom >= containerRect.bottom) {
            ySpeed = -ySpeed;
            bounceCountY++;

            // Si rebota en el mismo eje más de 3 veces seguidas, cambia el ángulo
            if (bounceCountY > 3) {
                ySpeed += (Math.random() * 2 - 1); // Ajusta el ángulo ligeramente
                bounceCountY = 0; // Reinicia el contador
            }
        }

        // Actualizar la posición del enemigo
        enemy.style.left = (enemy.offsetLeft + xSpeed) + "px";
        enemy.style.top = (enemy.offsetTop + ySpeed) + "px";

        // Verificar colisión con el jugador
        checkCollision();

        // Continuar el movimiento
        requestAnimationFrame(updatePosition);
    }

    updatePosition();
}

// Función para actualizar la posición del jugador de forma continua
function updatePlayerPosition() {
    if (!gameActive) return; // Detener movimiento si el juego no está activo

    const playerRect = player.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    // Mover en todas las direcciones
    if (keysPressed["ArrowUp"] && playerRect.top > containerRect.top) {
        player.style.top = (player.offsetTop - playerSpeed) + "px";
    }
    if (keysPressed["ArrowDown"] && playerRect.bottom < containerRect.bottom) {
        player.style.top = (player.offsetTop + playerSpeed) + "px";
    }
    if (keysPressed["ArrowLeft"] && playerRect.left > containerRect.left) {
        player.style.left = (player.offsetLeft - playerSpeed) + "px";
    }
    if (keysPressed["ArrowRight"] && playerRect.right < containerRect.right) {
        player.style.left = (player.offsetLeft + playerSpeed) + "px";
    }

    // Verifica la colisión después de mover al jugador
    checkCollision();

    // Continua el ciclo de actualización
    requestAnimationFrame(updatePlayerPosition);
}

// Función para verificar colisiones entre el jugador y cualquier enemigo
function checkCollision() {
    const playerRect = player.getBoundingClientRect();

    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        if (
            playerRect.left < enemyRect.left + enemyRect.width &&
            playerRect.left + playerRect.width > enemyRect.left &&
            playerRect.top < enemyRect.top + enemyRect.height &&
            playerRect.top + playerRect.height > enemyRect.top
        ) {
            endGame();
        }
    });
}

// Función para finalizar el juego
function endGame() {
    gameActive = false; // Desactivar el juego
    clearInterval(gameInterval); // Detener el intervalo de actualización de puntaje
    startButton.style.display = "block";
    document.removeEventListener("keydown", movePlayer);
    alert("¡Juego terminado! Tiempo de supervivencia: " + score + " segundos");

    // Limpiar enemigos y vaciar el array de enemigos
    clearEnemies();
    enemyCount = 1; // Reiniciar el contador de enemigos
}

// Función para limpiar enemigos del contenedor
function clearEnemies() {
    enemies.forEach(enemy => enemy.remove());
    enemies = [];  // Vaciar el array para que no queden referencias a enemigos anteriores
}

// Evento para iniciar el juego al hacer clic en el botón de inicio
startButton.addEventListener("click", startGame);
