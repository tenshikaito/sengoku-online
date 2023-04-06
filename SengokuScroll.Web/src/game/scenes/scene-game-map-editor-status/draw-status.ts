import SceneGameMapEditor from "../scene-game-map-editor";
import OperationStatus from "./operation-status";

export default class DrawStatus extends OperationStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public onClicked() {

        this.drawTile();
    }

    public onDragged() {

        this.drawTile();
    }

    public drawTile() {

        super.updateTileInfoPanel();
    }
}
