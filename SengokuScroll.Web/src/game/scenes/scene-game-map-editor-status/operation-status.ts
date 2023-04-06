import SceneGameMapEditor from "../scene-game-map-editor";

export default class OperationStatus {

    public scene: SceneGameMapEditor;

    protected isDragging = false;
    protected scrollSpeed = 30;

    protected get tileMapComponent() {

        return this.scene.tileMapComponent;
    }

    protected get map() {

        return this.tileMapComponent.map;
    }

    public constructor(scene: SceneGameMapEditor) {

        this.scene = scene;
    }

    public init() {

        return;
    }

    public update(_time: number, _delta: number) {

        return;
    }

    public onKeyPressed(_e: KeyboardEvent) {

        if (this.isDragging) return;
    }

    public onMouseMoved() {

        this.tileMapComponent.updateCursor();

        this.updateTileInfoPanel();
    }

    public onPressed() {

        return;
    }

    public onClicked() {

        return;
    }

    public onDragStart(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        this.isDragging = true;
    }

    public onDragged(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject, _x: number, _y: number) {

        return;
    }

    public onDragEnd(_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject) {

        this.isDragging = false;
    }

    protected updateTileInfoPanel() {

        this.scene.updateTileInfoPanel();
    }
}
