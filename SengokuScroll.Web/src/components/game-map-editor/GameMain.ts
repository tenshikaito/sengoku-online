import { Game } from "phaser";
import SceneConstant from "@/constants/scene-constant";
import SceneGameMapEditor from "@/game/scenes/scene-game-map-editor";
import SceneFps from "@/game/scenes/scene-fps";
import ScenePointerTileInfo from "@/game/scenes/scene-pointer-tile-info";
import SceneGameUI from "@/game/scenes/scene-game-ui";

export default class GameMain extends Game {

    public get mainScene() {

        return this.scene.getScene(SceneConstant.gameMapEditor) as SceneGameMapEditor;
    }

    public constructor(canvas?: HTMLCanvasElement) {

        const config = {

            type: canvas ? Phaser.WEBGL : Phaser.AUTO,
            width: canvas?.width,
            height: canvas?.height,
            canvas: canvas,
            scene: [SceneGameMapEditor, SceneFps, ScenePointerTileInfo, SceneGameUI]
        } as Phaser.Types.Core.GameConfig;

        super(config);
    }
}