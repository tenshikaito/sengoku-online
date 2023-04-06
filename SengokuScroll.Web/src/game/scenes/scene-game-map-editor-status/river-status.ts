import MapEditStatus from "@/codetypes/map-edit-status";
import EventConstant from "@/constants/event-constant";
import SceneGameMapEditor from "../scene-game-map-editor";
import DrawStatus from "./draw-status";
import OperationStatus from "./operation-status";
import ViewStatus from "./view-status";

export default class RiverStatus extends OperationStatus {

    private method = <{ [key: string]: OperationStatus }>{};

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public init() {

        this.method[MapEditStatus.view] = new ViewStatus(this.scene);
        this.method[MapEditStatus.point] = new DrawRiverStatus(this.scene);
    }

    public update(_time: number, _delta: number) {

        this.method[this.scene.currentDrawPointEditStatus]?.update(_time, _delta);
    }

    public onKeyPressed(e: KeyboardEvent) {

        super.onKeyPressed(e);

        switch (e.key) {

            case "a":
            case "A": this.scene.game.events.emit(EventConstant.switchGameDrawPointEditStatus, MapEditStatus.view); break;
            case "s":
            case "S": this.scene.game.events.emit(EventConstant.switchGameDrawPointEditStatus, MapEditStatus.point); break;
        }
    }

    public onPressed() {

        this.method[this.scene.currentDrawPointEditStatus]?.onPressed();
    }

    public onMouseMoved() {

        this.method[this.scene.currentDrawPointEditStatus]?.onMouseMoved();
    }

    public onClicked() {

        this.method[this.scene.currentDrawPointEditStatus]?.onClicked();
    }

    public onDragStart(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        this.method[this.scene.currentDrawPointEditStatus]?.onDragStart(_pointer, _gameObject);
    }

    public onDragged(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject, _x: number, _y: number) {

        this.method[this.scene.currentDrawPointEditStatus]?.onDragged(_pointer, _gameObject, _x, _y);
    }

    public onDragEnd(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        this.method[this.scene.currentDrawPointEditStatus]?.onDragEnd(_pointer, _gameObject);
    }
}

class DrawRiverStatus extends DrawStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public drawTile() {

        if (this.scene.currentSelectedRiverId === undefined) return;

        const tilePosition = this.tileMapComponent.getTileMapXY();

        this.tileMapComponent.updateRiverTile(
            tilePosition.x,
            tilePosition.y,
            this.scene.currentSelectedRiverId,
            this.scene.currentRiverDirection16,
            this.scene.currentEstuaryDirection16,
            this.scene.isEstuary,
            this.scene.flowDirection);

        super.drawTile();
    }
}
