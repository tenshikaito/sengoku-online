import "phaser";
import SceneConstant from "@/constants/scene-constant";
import SceneBase from "./scene-base";
import EventConstant from "@/constants/event-constant";

export default class ScenePointerTileInfo extends SceneBase {

    private currentScene!: string;
    private text!: Phaser.GameObjects.Text;

    public constructor() {

        super({
            key: SceneConstant.pointerTileInfo
        });
    }

    public init(data: any) {

        this.currentScene = data.key;
    }

    public create() {
        
        this.text = this.add.text(16, 32, "", {
            ...this.textStyle,
            ...this.textShadow
        });

        const scene = this.scene.get(this.currentScene);

        scene.events.on(EventConstant.pointerTileInfo, (x: number, y: number) => this.text.text = `x: ${x}, y: ${y}`);
    }

    public exit() {
        
        this.scene.get(this.currentScene).events.off(EventConstant.pointerTileInfo);

        this.text.destroy();
    }
}