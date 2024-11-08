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

    // Si se alcanza el tiempo de 100 segundos, detener el juego y mostrar mensaje
    if (score >= 100) {
        showCompletionMessage();
        endGame();
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
    let xSpeed = Math.random() * 4 + 2; // Velocidad horizontal
    let ySpeed = Math.random() * 4 + 2; // Velocidad vertical
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
            if (bounceCountX > 3) {
                xSpeed += (Math.random() * 2 - 1);
                bounceCountX = 0;
            }
        }

        if (enemyRect.top <= containerRect.top || enemyRect.bottom >= containerRect.bottom) {
            ySpeed = -ySpeed;
            bounceCountY++;
            if (bounceCountY > 3) {
                ySpeed += (Math.random() * 2 - 1);
                bounceCountY = 0;
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
    if (!gameActive) return;

    const playerRect = player.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

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

    checkCollision();
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
    gameActive = false;
    clearInterval(gameInterval);
    startButton.style.display = "block";
    document.removeEventListener("keydown", movePlayer);

    clearEnemies();
    enemyCount = 1;
}

// Función para mostrar el mensaje de finalización del juego
function showCompletionMessage() {
    const messageBox = document.createElement("div");
    messageBox.textContent = "¡Has completado el juego!";
    messageBox.style.position = "absolute";
    messageBox.style.top = "50%";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translate(-50%, -50%)";
    messageBox.style.padding = "20px";
    messageBox.style.backgroundColor = "#333";
    messageBox.style.color = "#fff";
    messageBox.style.fontSize = "1.5em";
    messageBox.style.border = "2px solid #fff";
    messageBox.style.borderRadius = "10px";
    gameContainer.appendChild(messageBox);
}

// Función para limpiar enemigos del contenedor
function clearEnemies() {
    enemies.forEach(enemy => enemy.remove());
    enemies = [];
}

// Evento para iniciar el juego al hacer clic en el botón de inicio
startButton.addEventListener("click", startGame);
