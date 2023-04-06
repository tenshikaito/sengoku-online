import "phaser";
import SceneBase from "./scene-base";
import dict from "@/game-dictionary";
import SceneConstant from "@/constants/scene-constant";
import EventConstant from "@/constants/event-constant";
import UIEventConstant from "@/constants/ui-event-constant";
import MapEditStatus from "@/codetypes/map-edit-status";
import DrawType from "@/codetypes/draw-type";
import MapTileViewStatus from "@/codetypes/map-tile-view-status";
import Direction16 from "@/codetypes/direction16";
import RiverDirection from "@/codetypes/river-direction";
import TileMapEditorComponent from "@/game/components/tile-map-editor-component";
import TileSite from "@/models/tile-site";
import OperationStatus from "./scene-game-map-editor-status/operation-status";
import ViewStatus from "./scene-game-map-editor-status/view-status";
import TileStatus from "./scene-game-map-editor-status/tile-status";
import RegionStatus from "./scene-game-map-editor-status/region-status";
import RiverStatus from "./scene-game-map-editor-status/river-status";
import TileObjectStatus from "./scene-game-map-editor-status/tile-object-status";

export default class SceneGameMapEditor extends SceneBase {

    public tileMapComponent!: TileMapEditorComponent;
    public isAutoTile!: boolean;
    public currentDrawEditStatus = MapEditStatus.view;
    public currentDrawPointEditStatus = MapEditStatus.view;
    public currentSelectedTileTypeId?: number;
    public currentSelectedRegionId?: number;
    public currentSelectedRiverId?: number;
    public currentRiverDirection16!: Direction16;
    public currentEstuaryDirection16!: Direction16;
    public isEstuary!: boolean;
    public flowDirection!: RiverDirection;

    private progressText!: Phaser.GameObjects.Text;
    private currentStatus!: OperationStatus;

    private viewStatus!: ViewStatus;
    private tileStatus!: TileStatus;
    private regionStatus!: RegionStatus;
    private riverStatus!: RiverStatus;
    private tileObjectStatus!: TileObjectStatus;

    private currentSceneKey;
    private isLoadError = false;
    private lastPointerTile = Phaser.Math.Vector2.ZERO;

    public get tileMapMasterData() {

        return this.tileMapComponent.tileMapMasterData;
    }

    public get tileMap() {

        return this.tileMapComponent.tileMap;
    }

    public get rmTileMapImage() {

        return this.tileMapComponent.tileMapImage;
    }

    public constructor() {

        const currentSceneKey = SceneConstant.gameMapEditor;

        super({
            key: currentSceneKey
        });

        this.currentSceneKey = currentSceneKey;

        this.tileMapComponent = new TileMapEditorComponent(this);

        this.viewStatus = new ViewStatus(this);
        this.tileStatus = new TileStatus(this);
        this.regionStatus = new RegionStatus(this);
        this.riverStatus = new RiverStatus(this);
        this.tileObjectStatus = new TileObjectStatus(this);

        this.viewStatus.init();
        this.tileStatus.init();
        this.regionStatus.init();
        this.riverStatus.init();
        this.tileObjectStatus.init();

        this.switchDrawType(DrawType.tile);
    }

    public preload() {

        const camera = this.cameras.main;
        this.progressText = this.add.text(camera.width / 2, camera.height - 48, dict.msg.loading, this.textStyle);

        this.isLoadError = false;

        this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => this.progressText.text = `${dict.msg.loading}...${Math.floor(value * 100)}%`);
        this.load.once(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.FileTypes.ImageFile) => {

            this.load.off(Phaser.Loader.Events.PROGRESS);

            this.isLoadError = true

            this.events.emit(EventConstant.error, `${dict.msg.dataLoadFailed}: ${file.src}`);
        });
        this.load.once(Phaser.Loader.Events.COMPLETE, () => {

            this.load.off(Phaser.Loader.Events.PROGRESS);
        });

        this.tileMapComponent.preload();
    }

    public create() {

        if (this.isLoadError) {

            this.game.events.emit(UIEventConstant.resourceLoadError);

            return;
        }

        this.progressText.text = dict.msg.initMap;

        setTimeout(() => {

            this.tileMapComponent.create();
            this.tileMapComponent.visible = false;

            this.progressText.text = dict.msg.initSystem;

            setTimeout(() => {

                this.tileMapComponent.onMouseMoved = () => this.onMouseMoved();
                this.tileMapComponent.onMapPressed = () => this.onMapPressed();
                this.tileMapComponent.onMapClicked = () => this.onMapClicked();
                this.tileMapComponent.onMapDragStart = (pointer, gameObject) => this.onMapDragStart(pointer, gameObject);
                this.tileMapComponent.onMapDragged = (pointer, gameObject, x, y) => this.onMapDragged(pointer, gameObject, x, y);
                this.tileMapComponent.onMapDragEnd = (pointer, gameObject) => this.onMapDragEnd(pointer, gameObject);

                this.addKeyEvent();

                this.tileMapComponent.visible = true;

                this.switchRiverDirectionViewStatus(false);

                this.game.events.on(UIEventConstant.initMap, () => this.initMap());

                this.switchDrawType(DrawType.tile);
                this.switchDrawEditStatus(MapEditStatus.view);

                this.scene.run(SceneConstant.gameUI, { key: this.currentSceneKey });
                this.scene.run(SceneConstant.fps);
                this.scene.run(SceneConstant.pointerTileInfo, { key: this.currentSceneKey });

                this.game.events.emit(UIEventConstant.resourceLoaded);

                this.progressText.destroy();
            }, 500);
        }, 0);
    }

    public update(time: number, delta: number) {

        this.currentStatus.update(time, delta);
    }

    private addKeyEvent() {

        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (e: KeyboardEvent) => this.onKeyPressed(e));
    }

    private onKeyPressed(e: KeyboardEvent) {

        this.currentStatus.onKeyPressed(e);
    }

    private onMouseMoved() {

        this.currentStatus.onMouseMoved();
    }

    private onMapPressed() {

        this.currentStatus.onPressed();
    }

    private onMapClicked() {

        this.currentStatus.onClicked();
    }

    private onMapDragStart(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {

        this.currentStatus.onDragStart(pointer, gameObject);
    }

    private onMapDragged(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, x: number, y: number) {

        this.currentStatus.onDragged(pointer, gameObject, x, y);
    }

    private onMapDragEnd(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {

        this.currentStatus.onDragEnd(pointer, gameObject);
    }

    public initMap() {

        this.tileMapComponent.init();
    }

    public switchDrawType(drawType: DrawType) {

        switch (drawType) {

            case DrawType.tile: this.currentStatus = this.tileStatus; break;
            case DrawType.region: this.currentStatus = this.regionStatus; break;
            case DrawType.river: this.currentStatus = this.riverStatus; break;
            case DrawType.tileSite: this.currentStatus = this.tileObjectStatus; break;
            default: this.currentStatus = this.viewStatus; break;
        }
    }

    public switchTileViewStatus(status: MapTileViewStatus) {

        this.tileMapComponent.switchTileViewStatus(status);
    }

    public switchRiverDirectionViewStatus(isShow: boolean) {

        this.tileMapComponent.switchRiverDirectionViewStatus(isShow);
    }

    public switchDrawEditStatus(status: MapEditStatus) {

        if (this.currentDrawEditStatus) this.tileMapComponent.resetCursor();

        this.currentDrawEditStatus = status;
    }

    public switchDrawPointEditStatus(status: MapEditStatus) {

        if (this.currentDrawEditStatus) this.tileMapComponent.resetCursor();

        this.currentDrawPointEditStatus = status;
    }

    public setDrawTileType(isAutoTile: boolean, id: number) {

        this.isAutoTile = isAutoTile;
        this.currentSelectedTileTypeId = id;
    }

    public setDrawRegion(id: number) {

        this.currentSelectedRegionId = id;
    }

    public setDrawRiver(id: number) {

        this.currentSelectedRiverId = id;
    }

    public setDirection16(river: Direction16, estuary: Direction16) {

        this.currentRiverDirection16 = river;
        this.currentEstuaryDirection16 = estuary;
    }

    public setIsEstuary(value: boolean) {

        this.isEstuary = value;
    }

    public setFlowDirection(value: RiverDirection) {

        this.flowDirection = value;
    }

    public createTileSite(tileSite: TileSite) {

        this.tileMapComponent.createTileSite(tileSite);
    }

    public editTileSite(tileSite: TileSite) {

        this.tileMapComponent.editTileSite(tileSite);
    }

    public deleteTileSite(tileSite: TileSite) {

        this.tileMapComponent.deleteTileSite(tileSite);
    }

    public locateTile(x: number, y: number) {

        const tilePosition = this.tileMapComponent.map.tileToWorldXY(x, y);

        this.tileMapComponent.locateTo(tilePosition.x * 2, tilePosition.y * 2);
    }

    public exit() {

        this.events.removeListener(EventConstant.pointerTileInfo);
        this.tileMapComponent.destory();

        this.scene.stop(SceneConstant.gameUI);
        this.scene.stop(SceneConstant.fps);
        this.scene.stop(SceneConstant.pointerTileInfo);
    }

    public updateTileInfoPanel() {

        const tp = this.tileMapComponent.getTileMapXY();

        if (tp.x == this.lastPointerTile.x && tp.y == this.lastPointerTile.y) return;

        this.lastPointerTile = tp;

        this.events.emit(EventConstant.pointerTileInfo, tp.x, tp.y);

        const index = this.tileMapComponent.getTileMapIndex(tp.x, tp.y);

        if (index < 0) {

            this.events.emit(EventConstant.tileInfo, "", "", "");
            return;
        }

        const tm = this.tileMap;
        const tmmd = this.tileMapMasterData;

        let tileName = "";
        const tid = tm.tileType[index];

        if (tid !== undefined) {
            
            tileName = tmmd.tileType[tid]?.name || "";
        }
        else {
            
            tileName = tmmd.autoTileType[tm.autoTileType[index]].name;
        }

        const river = tm.river[index] !== undefined
            ? tm.river[index].isEstuary
                ? dict.estuary
                : dict.river
            : null;

        const site = tm.site[index]?.name;

        this.events.emit(
            EventConstant.tileInfo,
            tileName,
            tmmd.region[tm.region[index]].name,
            river && site ? `${site}·${river}` : (site || river || ""));
    }
}
