import GameConstant from "@/constants/game-constant";
import SceneGameMapEditor from "../scene-game-map-editor";
import OperationStatus from "./operation-status";

export default class FillRectangleStatus extends OperationStatus {

    private startTx!: number;
    private startTy!: number;
    private dragStartTime!: number;

    public constructor(scene: SceneGameMapEditor) {

        super(scene);
    }

    public onMouseMoved() {

        if (!this.isDragging) super.onMouseMoved();
    }

    public onDragStart(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        super.onDragStart(_pointer, _gameObject);

        this.dragStartTime = new Date().getTime();

        const pointerTile = this.tileMapComponent.getTileMapXY();

        this.startTx = pointerTile.x;
        this.startTy = pointerTile.y;
    }

    public onDragged() {

        const pointerTile = this.tileMapComponent.getTileMapXY();

        this.dragged(this.startTx, this.startTy, pointerTile.x, pointerTile.y);
    }

    public dragged(startTx: number, startTy: number, x: number, y: number) {

        this.tileMapComponent.selectRectange(startTx, startTy, x, y);
    }

    public onDragEnd(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        super.onDragEnd(_pointer, _gameObject);

        if (new Date().getTime() - this.dragStartTime <= GameConstant.clickInterval) return;

        this.fillRectange(this.startTx, this.startTy);
    }

    public fillRectange(_startTx: number, _startTy: number) {

        this.tileMapComponent.resetCursor();

        super.updateTileInfoPanel();
    }
}