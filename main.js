import Input from "./engine/Input.js";
import Enemy from "./entities/Enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const input = new Input();

// SALTO
let velY = 0;
const jumpForce = -0.9;       // forza verso l’alto
const gravityForce = 0.003;   // gravità
let grounded = true;

const player = {
    x: 400,
    y: 200,
    w: 40,
    h: 60,
    speed: 0.34
};

const ground = 200;

// ENEMY
const enemy = new Enemy(100, 200);

let lastTime = 0;

function loop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    update(dt);
    JumpGravity(dt);

    enemy.update(dt, player);
    EnemyCollisions();

    render();
    enemy.render(ctx);

    requestAnimationFrame(loop);
}

// -------------------------
// GRAVITÀ + SALTO
// -------------------------
function JumpGravity(dt) {
    velY += gravityForce * dt;
    player.y += velY * dt;

    if (player.y >= ground) {
        player.y = ground;
        velY = 0;
        grounded = true;
    }
}

// -------------------------
// COLLISIONE ENEMY ↔ PLAYER
// -------------------------
function EnemyCollisions() {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    const minDist = (player.w + enemy.w) / 2;

    if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDist - dist;

        // spinge indietro il nemico
        enemy.x -= Math.cos(angle) * overlap;
        enemy.y -= Math.sin(angle) * overlap;
    }

    // Enemy rispetta il terreno
    if (enemy.y > ground) {
        enemy.y = ground;
    }
}

// -------------------------
// UPDATE
// -------------------------
var playercolor = "#4caf50";

function update(dt) {
    // SALTO
    if (input.isDown("KeyW") && grounded) {
        velY = jumpForce;
        grounded = false;
        playercolor = "purple";
    }

    if (input.isUp("KeyW") && grounded) {
        playercolor = "#4caf50";
    }

    // MOVIMENTO
    if (input.isDown("KeyA")) player.x -= player.speed * dt;
    if (input.isDown("KeyD")) player.x += player.speed * dt;
}

// -------------------------
// RENDER
// -------------------------
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pavimento
    ctx.fillStyle = "red";
    ctx.fillRect(0, 230, 1200, 100);

    // Player
    playerrender(playercolor);
}

function playerrender(color) {
    ctx.fillStyle = color;
    ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
}

requestAnimationFrame(loop);
