import MapEditStatus from "@/codetypes/map-edit-status";
import EventConstant from "@/constants/event-constant";
import SceneGameMapEditor from "../scene-game-map-editor";
import DrawStatus from "./draw-status";
import FillRectangleStatus from "./fill-rectangle-status";
import FillStatus from "./fill-status";
import OperationStatus from "./operation-status";
import ViewStatus from "./view-status";

export default class TileStatus extends OperationStatus {

    private method = <{ [key: string]: OperationStatus }>{};

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public init() {

        this.method[MapEditStatus.view] = new ViewStatus(this.scene);
        this.method[MapEditStatus.point] = new DrawTileStatus(this.scene);
        this.method[MapEditStatus.rectangle] = new FillRectangleTileStatus(this.scene);
        this.method[MapEditStatus.fill] = new FillTileStatus(this.scene);

        this.method[MapEditStatus.point].init();
        this.method[MapEditStatus.rectangle].init();
        this.method[MapEditStatus.fill].init();
    }

    public update(_time: number, _delta: number) {

        this.method[this.scene.currentDrawEditStatus]?.update(_time, _delta);
    }

    public onKeyPressed(e: KeyboardEvent) {

        super.onKeyPressed(e);

        switch (e.key) {

            case "a":
            case "A": this.scene.game.events.emit(EventConstant.switchGameDrawEditStatus, MapEditStatus.view); break;
            case "s":
            case "S": this.scene.game.events.emit(EventConstant.switchGameDrawEditStatus, MapEditStatus.point); break;
            case "d":
            case "D": this.scene.game.events.emit(EventConstant.switchGameDrawEditStatus, MapEditStatus.rectangle); break;
            case "f":
            case "F": this.scene.game.events.emit(EventConstant.switchGameDrawEditStatus, MapEditStatus.fill); break;
        }
    }

    public onPressed() {

        this.method[this.scene.currentDrawEditStatus]?.onPressed();
    }

    public onMouseMoved() {

        this.method[this.scene.currentDrawEditStatus]?.onMouseMoved();
    }

    public onClicked() {

        this.method[this.scene.currentDrawEditStatus]?.onClicked();
    }

    public onDragStart(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        this.method[this.scene.currentDrawEditStatus]?.onDragStart(_pointer, _gameObject);
    }

    public onDragged(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject, _x: number, _y: number) {

        this.method[this.scene.currentDrawEditStatus]?.onDragged(_pointer, _gameObject, _x, _y);
    }

    public onDragEnd(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        this.method[this.scene.currentDrawEditStatus]?.onDragEnd(_pointer, _gameObject);
    }
}

class DrawTileStatus extends DrawStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public drawTile() {

        if (this.scene.currentSelectedTileTypeId === undefined) return;

        const tilePosition = this.tileMapComponent.getTileMapXY();

        this.tileMapComponent.updateTileType(this.scene.isAutoTile, tilePosition.x, tilePosition.y, this.scene.currentSelectedTileTypeId);
    }
}

class FillRectangleTileStatus extends FillRectangleStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public fillRectange(startTx: number, startTy: number) {

        if (this.scene.currentSelectedTileTypeId === undefined) return;

        const pointerTile = this.tileMapComponent.getTileMapXY();

        this.tileMapComponent.fillRectangleTileType(
            this.scene.isAutoTile,
            this.scene.currentSelectedTileTypeId,
            startTx,
            startTy,
            pointerTile.x,
            pointerTile.y);

        super.fillRectange(startTx, startTy);

    }
}

class FillTileStatus extends FillStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public drawTile() {

        if (!this.scene.isAutoTile) return;

        if (this.scene.currentSelectedTileTypeId === undefined) return;

        const tilePosition = this.tileMapComponent.getTileMapXY();

        this.tileMapComponent.fillAutoTileType(this.scene.isAutoTile, tilePosition.x, tilePosition.y, this.scene.currentSelectedTileTypeId);

        super.drawTile();
    }
}

