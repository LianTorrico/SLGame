//frames
export default class SceneManager {
    constructor() {
        this.current = null;
    }

    change(scene) {
        this.current = scene;
        scene.start();
    }

    update(dt) {
        if (this.current) this.current.update(dt);
    }

    render(ctx) {
        if (this.current) this.current.render(ctx);
    }
}
