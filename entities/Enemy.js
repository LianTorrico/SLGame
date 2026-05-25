export default class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 60;

        this.speed = 0.23; // più veloce
        this.state = "idle";
        this.color = "orange";

        this.attackRange = 70;
        this.chaseRange = 350;

        this.attackCooldown = 0;
        this.decisionCooldown = 0;

        this.aggression = 0.8; // 80% aggressivo
    }

    update(dt, player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);

        // Cooldown
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.decisionCooldown > 0) this.decisionCooldown -= dt;

        // Decisioni AI
        if (this.decisionCooldown <= 0) {
            this.chooseState(dist);
            this.decisionCooldown = 200 + Math.random() * 200; // decisioni rapide
        }

        // Esecuzione stato
        if (this.state === "chase") this.chasePlayer(dt, player);
        if (this.state === "attack") this.tryAttack(player);
        if (this.state === "strafe") this.strafe(dt, player);

        // Rispetta terreno
        const ground = 200;
        if (this.y > ground) this.y = ground;
        // Blocca la Y del nemico sul terreno
        this.y = 200; // stesso valore di ground

    }

    chooseState(dist) {
        // Attacco se vicino
        const AfterAttack=0;
        if (dist < this.attackRange) { //All infinito
            this.state = "attack";
            this.color = "red";
            //Animaione
            if (this.color=="red"){
                //import vita
                //se collisione=vita--
            }
            //Dopo anim = Cooldownattacconuovo
            return;
        }

        // Zona media → aggressivo
        if (dist < this.chaseRange) {
            const roll = Math.random();

            if (roll < this.aggression) {
                this.state = "chase";
                this.color = "yellow";
            } else {
                this.state = "strafe";
                this.color = "blue";
            }
            return;
        }

        // Lontano → avvicinati
        this.state = "chase";
        this.color = "orange";
    }

    chasePlayer(dt, player) {
        // Insegue solo in X
        const dir = player.x > this.x ? 1 : -1;
        this.x += dir * this.speed * dt;
    }


    strafe(dt, player) {
        // Movimento laterale casuale, sempre solo in X
        const dir = Math.random() < 0.5 ? 1 : -1;
        this.x += dir * this.speed * dt * 0.7;
    }


    tryAttack(player) {
        if (this.attackCooldown <= 0) {
            console.log("Enemy attacks!");
            this.attackCooldown = 900; // attacchi più frequenti
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    }
}
