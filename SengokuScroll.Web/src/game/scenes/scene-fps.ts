import "phaser";
import SceneConstant from "@/constants/scene-constant";
import SceneBase from "./scene-base";

export default class SceneFps extends SceneBase {

    private fpsText!: Phaser.GameObjects.Text;
    private currentFpsCount = 0;
    private delta = 0;

    public constructor() {

        super({
            key: SceneConstant.fps
        })
    }

    public create() {

        this.fpsText = this.add.text(16, 16, "", {
            ...this.textStyle,
            ...this.textShadow
        });
    }

    public update(_: number, delta: number) {

        ++this.currentFpsCount;
        this.delta += delta;
        if (this.delta >= 1000) {
            this.delta -= 1000;
            this.fpsText.text = `FPS:${this.currentFpsCount}`;
            this.currentFpsCount = 0;
        }
    }

    public exit() {

        this.fpsText.destroy();
    }
}