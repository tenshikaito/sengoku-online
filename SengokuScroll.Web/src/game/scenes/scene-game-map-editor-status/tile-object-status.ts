import MapEditStatus from "@/codetypes/map-edit-status";
import EventConstant from "@/constants/event-constant";
import SceneGameMapEditor from "../scene-game-map-editor";
import DrawStatus from "./draw-status";
import OperationStatus from "./operation-status";
import ViewStatus from "./view-status";


export default class TileObjectStatus extends OperationStatus {

    private method = <{ [key: string]: OperationStatus }>{};

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public init() {

        this.method[MapEditStatus.view] = new ViewStatus(this.scene);
        this.method[MapEditStatus.point] = new DrawTileObjectStatus(this.scene);
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

class DrawTileObjectStatus extends DrawStatus {

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }
    
    public drawTile() {

        const tilePosition = this.tileMapComponent.getTileMapXY();

        const index = this.tileMapComponent.getTileMapIndex(tilePosition.x, tilePosition.y);

        if (index < 0) return;

        const tileSite = this.tileMapComponent.tileMap.site[index];
        
        if (tileSite) this.scene.game.events.emit(EventConstant.editTileSite, tileSite);
        else this.scene.game.events.emit(EventConstant.createTileSite, tilePosition.x, tilePosition.y, index);

        super.drawTile();
    }
}
