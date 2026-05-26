import Input from "./engine/Input.js";
import Enemy from "./entities/Enemy.js";

const spritePlayer = new Image();
spritePlayer.src= './assets/sprites/player/Totale.png';
spritePlayer.onload = function() {
    AnimPlayer();
};
let lastTime = 0;

const canvas = document.getElementById("game");
// -------------------------
// SIMPLE ANIMATION SYSTEM (Totale.png placeholder)
// -------------------------
let currentAnim = "idle";
let animFrame = 0;
let animTime = 0;



// Assumption (placeholder): Totale.png contains a single-row spritesheet.
// If later you discover multiple rows or different frame sizes per anim,
// just update these values.
const animConfig = {
idle: {
    img: spritePlayer,
    frameW: 18,
    frameH: 39,
    startX: 111,
    startY: 41,
    spacing: 240,
    frames: 12,
    fps: 8
},

    walk: { 
    img: spritePlayer, 
    frameW: 18, 
    frameH: 38, 
    startX: 110, 
    startY: 171,
    spacing: 240,
    frames: 8, 
    fps: 13
},
dash: {
    img: spritePlayer,
    frameW: 22,
    frameH: 34,
    startX: 108,
    startY: 687,
    spacing: 221,
    frames: 4,
    fps: 20
},

    //jump:  { img: spritePlayer, frameW: 18, frameH: 39, startX: 111 , startY: frames: 1, fps: 8 },


    fall:  { img: spritePlayer, frameW: 18, frameH: 39, startX: 111, frames: 1, fps: 8 },
    attack:{ img: spritePlayer, frameW: 18, frameH: 39, startX: 111, frames: 1, fps: 12 },
};


function setAnim(name) {
    if (currentAnim === name) return;
    currentAnim = name;
    animFrame = 0;
    animTime = 0;
}

function stepAnim(dt) {
    const cfg = animConfig[currentAnim];
    // if frames is 1, no need to advance
    if (!cfg || cfg.frames <= 1) return;
    animTime += dt;
    const frameDuration = 1000 / cfg.fps;
    while (animTime >= frameDuration) {
        animTime -= frameDuration;
        animFrame = (animFrame + 1) % cfg.frames;
    }
}

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;




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

const totalFrames= 13;

let isDashing = false;
let dashCooldown = false;
let dashTimer = 0;
let dashFrame = 0;
let dashFrameTimer = 0;

const dashFrameWidth = 22;
const dashFrameHeight = 34;
const dashStartX = 108;  // primo frame
const dashStartY = 687;
const dashFrameDistance = 221;
const dashTotalFrames = 4

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
    const dx = player.x - enemy.x-15; //Spazio aggiuntivo per anim
    const dy = player.y - enemy.y; //Inutile\
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
let facingLeft= false;
var teleport = 1; //2 frame (andata, ritorno, stesso frame, funge da timer in questo caso)

function startDash(direction) {
    isDashing = true;
    dashCooldown = true;
    dashTimer = 180; // durata dash in ms
    dashFrame = 0;
    dashFrameTimer = 0;

    player.dashDir = direction;
}

function updateDash(dt) {
    if (!isDashing) return;

    // Movimento rapido
    const DASH_SPEED = 0.6; // smooth, fast, but not teleport
    player.x += player.dashDir * DASH_SPEED * dt;


    // Timer dash
    dashTimer -= dt;
    if (dashTimer <= 0) {
        isDashing = false;

        // Cooldown di 300ms
        setTimeout(() => {
            dashCooldown = false;
        }, 300);
    }

    // Animazione dash
    dashFrameTimer += dt;
if (dashFrameTimer > 30) { // faster animation
    dashFrame = (dashFrame + 1) % dashTotalFrames;
    dashFrameTimer = 0;
}

}



function update(dt) {
    updateDash(dt);
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
    let moving = false;
    if (input.isDown("KeyA")) {
        player.x -= player.speed * dt;
        moving = true;
        facingLeft = true;
    }

    if (input.isDown("KeyD")) {
        player.x += player.speed * dt;
        moving = true;
        facingLeft = false;
    }
    //Dash sinistra
    if (!dashCooldown && !isDashing) {
    if (input.isDown("KeyQ") && input.isDown("KeyA")) {
        startDash(-1); // dash a sinistra
    }
    if (input.isDown("KeyQ") && input.isDown("KeyD")) {
        startDash(1); // dash a destra
    }
}

    // ANIMAZIONI (semplice: idle / walk / jump / fall)
    if (!grounded) {
        if (velY < 0) setAnim("jump");
        else setAnim("fall");
    } else {
        if (moving) setAnim("walk");
        else setAnim("idle");
    }

    stepAnim(dt);
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
    AnimPlayer();
}

function AnimPlayer() {
    ctx.save();

    const SCALE = 2; // <--- cambia questo per ingrandire/ridurre

    // DASH HA PRIORITÀ ASSOLUTA
    if (isDashing) {
        const sx = dashStartX + dashFrame * dashFrameDistance;
        const sy = dashStartY;

        if (facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                spritePlayer,
                sx, sy,
                dashFrameWidth, dashFrameHeight,
                -(player.x + dashFrameWidth * SCALE),
                player.y - 8,
                dashFrameWidth * SCALE,
                dashFrameHeight * SCALE
            );
        } else {
            ctx.drawImage(
                spritePlayer,
                sx, sy,
                dashFrameWidth, dashFrameHeight,
                player.x,
                player.y - 8,
                dashFrameWidth * SCALE,
                dashFrameHeight * SCALE
            );
        }

        ctx.restore();
        return;
    }

    // NORMAL ANIMATIONS
    const cfg = animConfig[currentAnim];
    if (!cfg) return;

    const sx = cfg.startX + animFrame * cfg.spacing;
    const sy = cfg.startY;

    if (facingLeft) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            cfg.img,
            sx, sy,
            cfg.frameW, cfg.frameH,
            -(player.x + cfg.frameW * SCALE),
            player.y - 8,
            cfg.frameW * SCALE,
            cfg.frameH * SCALE
        );
    } else {
        ctx.drawImage(
            cfg.img,
            sx, sy,
            cfg.frameW, cfg.frameH,
            player.x,
            player.y - 8,
            cfg.frameW * SCALE,
            cfg.frameH * SCALE
        );
    }

    ctx.restore();
}








requestAnimationFrame(loop);




