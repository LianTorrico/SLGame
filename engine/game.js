//costruttore
export default class game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.lastTime = 0;
        this.sceneManager = null;
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.sceneManager) {
            this.sceneManager.update(delta);
            this.sceneManager.render(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}
