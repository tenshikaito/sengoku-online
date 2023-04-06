import SceneGameMapEditor from "../scene-game-map-editor";
import OperationStatus from "./operation-status";

export default class FillStatus extends OperationStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public init() {

        return;
    }

    public onClicked() {

        this.drawTile();
    }

    public drawTile() {

        super.updateTileInfoPanel();
    }
}
