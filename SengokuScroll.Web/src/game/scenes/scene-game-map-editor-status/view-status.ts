import SceneGameMapEditor from "../scene-game-map-editor";
import OperationStatus from "./operation-status";

export default class ViewStatus extends OperationStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public override onDragged(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject, x: number, y: number) {

        this.tileMapComponent.scrollCamera(x, y);
    }
}
