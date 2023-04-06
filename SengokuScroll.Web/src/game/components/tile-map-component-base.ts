/* eslint-disable no-case-declarations */
import Direction16 from "@/codetypes/direction16";
import MapTileViewStatus from "@/codetypes/map-tile-view-status";
import RiverDirection from "@/codetypes/river-direction";
import TileSiteType from "@/codetypes/tile-site-type";
import GameConstant from "@/constants/game-constant";
import TileMapConstant from "@/constants/tile-map-contant";
import GameWorldMasterData from "@/data/game-world-master-data";
import TileFillData from "@/data/tile-fill-data";
import ExampleUtil from "@/utils/example-util";
import GameDataUtil from "@/utils/game-data-util";
import TileMapUtil from "@/utils/tile-map-util";
import WebClient from "@/web-client";
import InputClickComponent from "./input-click-component";
import TileImageMap from "./tile-image-map";
import TileImageMap4 from "./tile-image-map4";

export default abstract class TileMapComponentBase {

    public scene!: Phaser.Scene;
    public map!: Phaser.Tilemaps.Tilemap;
    public gameWorldMasterData!: GameWorldMasterData;
    public inputClickComponent!: InputClickComponent;
    public onMouseMoved?: () => void;
    public onMapPressed?: () => void;
    public onMapClicked?: () => void;
    public onMapDragStart?: (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => void;
    public onMapDragged?: (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, x: number, y: number) => void;
    public onMapDragEnd?: (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => void;

    protected layerTerrain = 0;
    protected layerLandform = 1;
    protected layerTile = 2;
    protected layerRiver = 3;

    private keyMap = "map";
    private colorInterval = 37;

    private cursor!: Phaser.GameObjects.Graphics;
    private layer1!: Phaser.Tilemaps.TilemapLayer;
    private layer2!: Phaser.Tilemaps.TilemapLayer;
    private tileImageMap!: TileImageMap;
    private riverTileImageMap!: TileImageMap4;
    private directionImageMap!: TileImageMap;
    private tileObjectImageMap!: TileImageMap;

    private tileViewStatus: MapTileViewStatus = MapTileViewStatus.none;
    private hsv = Phaser.Display.Color.HSVColorWheel();

    private autoTileIndexMap: { [key: number]: { sx: number, sy: number; } } = {};
    private riverIndexMap: { [key: number]: { sx: number, sy: number; } } = {};

    public get tileMap() {

        return this.gameWorldMasterData.tileMap;
    }

    public get tileMapImage() {

        return this.gameWorldMasterData.tileMapImage;
    }

    public get tileMapMasterData() {

        return this.gameWorldMasterData.tileMapMasterData;
    }

    public get autoTileKey() {

        return WebClient.getPath("autotile");
    }

    public get tileKey() {

        return WebClient.getPath("tile");
    }

    public get riverKey() {

        return WebClient.getPath("river");
    }

    public get directionKey() {

        return WebClient.getPath("direction");
    }

    public get tileSiteKey() {

        return WebClient.getPath("tileSite");
    }

    private get autoTileColumnCountPerRow() {

        return this.tileMapImage.imageAutoTileWidth * this.tileMapImage.autoTileIdColumnCount * 2;
    }

    private get riverTileColumnCountPerRow() {

        return this.tileMapImage.imageRiverWidth * this.tileMapImage.riverTileIdColumnCount * 2;
    }

    private get load() {
        return this.scene.load;
    }

    private get make() {

        return this.scene.make;
    }

    private get input() {

        return this.scene.input;
    }

    private get camera() {

        return this.scene.cameras.main;
    }

    public constructor(scene: Phaser.Scene) {

        this.scene = scene;
    }

    public set visible(value: boolean) {

        this.layer1.visible = value;
        this.layer2.visible = value;
        this.cursor.visible = value;
        this.tileImageMap.visible = value;
        this.riverTileImageMap.visible = value;
        this.directionImageMap.visible = value;
        this.tileObjectImageMap.visible = value;
    }

    public preload() {

        this.tileImageMap = new TileImageMap(this, this.tileKey, GameConstant.tileDepth);
        this.riverTileImageMap = new TileImageMap4(this, this.riverKey, GameConstant.riverTileDepth);
        this.tileObjectImageMap = new TileImageMap(this, this.tileSiteKey, GameConstant.tileObjectTileDepth);
        this.directionImageMap = new TileImageMap(this, this.directionKey, GameConstant.directionTileDepth);

        const gwmd = GameDataUtil.getGameWorldMasterData(this.scene.game);

        this.gameWorldMasterData = gwmd;

        const tm = gwmd.tileMap;
        const tmi = gwmd.tileMapImage;

        this.load.setBaseURL(WebClient.baseUrl);
        this.load.image(this.autoTileKey, TileMapConstant.autoTileFileName);
        this.load.spritesheet(<Phaser.Types.Loader.FileTypes.ImageFileConfig>{
            key: this.tileKey,
            url: tmi.tileImageName,
            frameConfig: {
                frameWidth: tmi.tileWidth,
                frameHeight: tmi.tileHeight,
                startFrame: 0,
                endFrame: tmi.tileIdRowCount * tmi.tileIdColumnCount
            }
        });
        this.load.spritesheet(<Phaser.Types.Loader.FileTypes.ImageFileConfig>{
            key: this.riverKey,
            url: tmi.riverTileImageName,
            frameConfig: {
                frameWidth: tmi.tileWidth / 2,
                frameHeight: tmi.tileHeight / 2,
                startFrame: 0,
                endFrame: tmi.riverTileIdRowCount * tmi.riverTileIdColumnCount * tmi.imageRiverWidth * tmi.imageRiverHeight * 2 * 2
            }
        });
        this.load.spritesheet(<Phaser.Types.Loader.FileTypes.ImageFileConfig>{
            key: this.directionKey,
            url: tmi.directionImageName,
            frameConfig: {
                frameWidth: tmi.tileWidth,
                frameHeight: tmi.tileHeight,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet(<Phaser.Types.Loader.FileTypes.ImageFileConfig>{
            key: this.tileSiteKey,
            url: tmi.tileObjectImageName,
            frameConfig: {
                frameWidth: tmi.tileWidth,
                frameHeight: tmi.tileHeight,
                startFrame: 0,
                endFrame: 2
            }
        });

        const gtmi = ExampleUtil.getGameTileMapInfo(
            tm.width,
            tm.height,
            tmi.tileWidth,
            tmi.tileHeight,
            tmi.imageAutoTileWidth * tmi.tileWidth * tmi.autoTileIdColumnCount,
            tmi.imageAutoTileHeight * tmi.tileHeight * tmi.autoTileIdRowCount,
            tmi.tileWidth * tmi.tileIdColumnCount,
            tmi.tileHeight * tmi.tileIdRowCount,
            i => ExampleUtil.getDefaultData(i, tm.width * 2));

        this.load.tilemapTiledJSON(this.keyMap, gtmi);
    }

    public create() {

        const map = this.make.tilemap({ key: this.keyMap });
        const autoTiles = map.addTilesetImage('autotile', this.autoTileKey);

        this.layer1 = map.createLayer(this.layerTerrain, autoTiles).setInteractive();
        this.layer2 = map.createLayer(this.layerLandform, autoTiles);

        this.input.setDraggable(this.layer1);

        this.map = map;

        this.init();

        const tileWidth = this.tileMapImage.tileWidth;
        const tileHeight = this.tileMapImage.tileHeight;

        this.initCursor();

        const offset = 3;
        const offsetWidth = offset * tileWidth;
        const offsetHeight = offset * tileHeight;

        const camera = this.camera;

        camera.setBounds(
            -offsetWidth,
            -offsetHeight,
            this.map.widthInPixels + offsetWidth * 2,
            this.map.heightInPixels + offsetHeight * 2);

        this.input.on(Phaser.Input.Events.POINTER_MOVE, () => this.onMouseMoved && this.onMouseMoved());

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => this.onMapPressed && this.onMapPressed());

        this.input.on(Phaser.Input.Events.DRAG_START, (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {

            this.onMapDragStart && this.onMapDragStart(pointer, gameObject);
        });

        this.input.on(Phaser.Input.Events.DRAG, (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {

            this.onMapDragged && this.onMapDragged(pointer, gameObject, dragX, dragY);
        });

        this.input.on(Phaser.Input.Events.DRAG_END, (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {

            this.onMapDragEnd && this.onMapDragEnd(pointer, gameObject);
        });

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (_p: Phaser.Input.Pointer, _go: Phaser.GameObjects.GameObject, _deltaX: number, deltaY: number, _deltaZ: number) => {

            if (deltaY > 0) this.zoomOut();
            else if (deltaY < 0) this.zoomIn();
        });

        this.inputClickComponent = new InputClickComponent(this.scene);

        this.inputClickComponent.onClicked = () => this.onMapClicked && this.onMapClicked();
    }

    public init() {

        this.eachTile((x, y) => {

            const index = this.getTileMapIndex(x, y);

            this.refreshAutoTile(this.layerTerrain, x, y, index);
            this.refreshAutoTile(this.layerLandform, x, y, index);
            this.refreshTile(x, y, index);
            this.refreshRiverTile(x, y, index);
            this.refreshTileSite(x, y, index);
        });
    }

    private initCursor() {

        this.cursor = this.scene.add.graphics();
        this.cursor.depth = GameConstant.cursorDepth;

        this.setCursor(1, 1);
    }

    public updateCursor() {

        const pointerTile = this.getPointerTileXY();

        const px = pointerTile.x / 2;
        const py = pointerTile.y / 2;

        if (px < 0 || px >= this.tileMap.width
            || py < 0 || py >= this.tileMap.height)
            return;

        const worldPoint = this.map.tileToWorldXY(pointerTile.x, pointerTile.y);

        this.cursor.x = worldPoint.x;
        this.cursor.y = worldPoint.y;
    }

    public resetCursor() {

        this.setCursor(1, 1);
    }

    protected setCursor(width: number, height: number) {

        const tileWidth = this.tileMapImage.tileWidth;
        const tileHeight = this.tileMapImage.tileHeight;

        TileMapUtil.setCursor(this.cursor, tileWidth, tileHeight, width, height);
    }

    public getWorldXY() {

        return <Phaser.Math.Vector2>this.input.activePointer.positionToCamera(this.camera);
    }

    public getTileMapIndex(x: number, y: number) {

        return TileMapUtil.getIndex(this.tileMap, x, y);
    }

    private getPointerTileXY() {

        const worldPoint = this.getWorldXY();

        const pointerTile = this.map.worldToTileXY(worldPoint.x, worldPoint.y);

        if (pointerTile.x % 2 != 0) pointerTile.x -= 1;
        if (pointerTile.y % 2 != 0) pointerTile.y -= 1;

        return pointerTile;
    }

    public getTileMapXY() {

        const pointerTile = this.getPointerTileXY();

        pointerTile.x /= 2;
        pointerTile.y /= 2;

        return pointerTile;
    }

    private zoomIn() {

        const camera = this.camera;
        let value = camera.zoom;

        switch (camera.zoom) {

            case 0.5: value = 1; break;
            case 1: value = 2; break;
            case 2: value = 4; break;
        }

        camera.zoom = value;
    }

    private zoomOut() {

        const camera = this.camera;
        let value = camera.zoom;

        switch (camera.zoom) {

            case 1: value = 0.5; break;
            case 2: value = 1; break;
            case 4: value = 2; break;
        }

        camera.zoom = value;
    }

    public locateTo(x: number, y: number) {

        const camera = this.camera;

        camera.scrollX = x - camera.centerX;
        camera.scrollY = y - camera.centerY;
    }

    public scrollCamera(x: number, y: number) {

        const camera = this.camera;

        camera.scrollX -= x;
        camera.scrollY -= y;
    }

    protected refreshAutoTile(layer: number, tx: number, ty: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(tx, ty) : index;

        if (i < 0) return;

        const tileId = this.getTileId(layer, tx, ty, i);

        this.getAutoTileIndex(tileId, getTileIndex => {

            const fill = (r: number, c: number, otx: number, oty: number) =>
                this.setAutoTileImage(getTileIndex(r, c), otx, oty, layer);

            const otx = tx * 2;
            const oty = ty * 2;

            const tileFill = new TileFillData();

            tileFill.fill1 = (r: number, c: number) => fill(r * 2, c * 2, otx, oty);
            tileFill.fill2 = (r: number, c: number) => fill(r * 2, c * 2 + 1, otx + 1, oty);
            tileFill.fill3 = (r: number, c: number) => fill(r * 2 + 1, c * 2, otx, oty + 1);
            tileFill.fill4 = (r: number, c: number) => fill(r * 2 + 1, c * 2 + 1, otx + 1, oty + 1);

            const data = this.checkTileFlag(tx, ty, (_x, _y, ox, oy) => {

                const currentTileId = this.getTileId(layer, ox, oy);

                return tileId != currentTileId;
            });

            TileMapUtil.setAutoTileImage(data, tileFill);
        });
    }

    protected checkTileFlag(
        tx: number,
        ty: number,
        checkDiff: (x: number, y: number, ox: number, oy: number, otx: number, oty: number) => boolean) {

        return TileMapUtil.checkTileFlag(tx, ty, this.tileMap.width, this.tileMap.height, checkDiff);
    }

    private checkDirectionSame(
        tx: number,
        ty: number,
        direction: Direction16,
        checkSame?: (x: number, y: number, ox: number, oy: number, otx: number, oty: number) => boolean) {

        return TileMapUtil.checkDirectionSame(tx, ty, this.tileMap.width, this.tileMap.height, direction, checkSame);
    }

    private getAutoTileIndex(tileId: number, getTileIndex: (f: (row: number, column: number) => number) => void) {

        const get = () => {

            if (this.autoTileIndexMap[tileId] !== undefined) return this.autoTileIndexMap[tileId];

            const { r, c } = TileMapUtil.getAutoTileRowColumn(this.tileMapImage, tileId);
            const sx = this.tileMapImage.imageAutoTileWidth * c * 2;
            const sy = this.tileMapImage.imageAutoTileHeight * r * 2;

            return this.autoTileIndexMap[tileId] = { sx, sy };
        };

        const { sx, sy } = get();
        const atccpr = this.autoTileColumnCountPerRow;
        const func = (row: number, column: number) => (sy + row) * atccpr + (sx + column) + 1;

        getTileIndex(func);
    }

    private getRiverTileIndex(tileId: number, getTileIndex: (f: (row: number, column: number) => number) => void) {

        const get = () => {

            if (this.riverIndexMap[tileId] !== undefined) return this.riverIndexMap[tileId];

            const { r, c } = TileMapUtil.getRiverTileRowColumn(this.tileMapImage, tileId);
            const sx = this.tileMapImage.imageRiverWidth * c * 2;
            const sy = this.tileMapImage.imageRiverHeight * r * 2;

            return this.riverIndexMap[tileId] = { sx, sy };
        };

        const { sx, sy } = get();
        const rtccpr = this.riverTileColumnCountPerRow;
        const func = (row: number, column: number) => (sy + row) * rtccpr + (sx + column);

        getTileIndex(func);
    }

    protected refreshTile(tilePositionX: number, tilePositionY: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(tilePositionX, tilePositionY) : index;

        if (i < 0) return;

        const tileId = this.getTileId(this.layerTile, tilePositionX, tilePositionY);

        this.tileImageMap.setTileImage(tileId, tilePositionX, tilePositionY, i);
    }

    public selectRectange(startTx: number, startTy: number, tx: number, ty: number) {

        const { sx, sy, width, height } = this.getSelectedRectangle(startTx, startTy, tx, ty);

        const p = this.map.tileToWorldXY(sx, sy);

        this.cursor.x = p.x * 2;
        this.cursor.y = p.y * 2;

        this.setCursor(width, height);
    }

    protected getTileId(layer: number, tx: number, ty: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(tx, ty) : index;

        switch (layer) {

            case this.layerTerrain:
            case this.layerLandform:

                const list = this.getAutoTileList(layer);

                return list[i];
            case this.layerTile:

                const tileId = this.tileMap.tile[i];

                return tileId === undefined ? -1 : tileId;
            case this.layerRiver:

                const river = this.tileMap.river[i];

                return river === undefined ? -1 : river.riverId;
            default:

                throw new Error();
        }
    }

    protected getAutoTileList(layer: number) {

        let list = <number[]>[];

        switch (layer) {

            case this.layerTerrain: list = this.tileMap.tileTerrain; break;
            case this.layerLandform: list = this.tileMap.tileLandform; break;
        }

        return list;
    }

    private setAutoTileImage(index: number, x: number, y: number, layer: number) {

        this.map.fill(index, x, y, 1, 1, undefined, layer);
    }

    protected getSelectedRectangle(startTx: number, startTy: number, tx: number, ty: number) {

        const sx = Math.min(startTx, tx);
        const sy = Math.min(startTy, ty);

        let width = Math.abs(startTx - tx);
        let height = Math.abs(startTy - ty);

        width = Math.max(width, 1);
        height = Math.max(height, 1);

        if (startTx > tx) ++width;
        if (startTy > ty) ++height;

        return { sx, sy, width, height };
    }

    public switchTileViewStatus(status: MapTileViewStatus) {

        const last = this.tileViewStatus;

        this.tileViewStatus = status;

        if (last != status) this.refreshTileView();
    }

    public switchRiverDirectionViewStatus(visible: boolean) {

        this.directionImageMap.visible = visible;
    }

    private refreshTileView() {

        switch (this.tileViewStatus) {

            case MapTileViewStatus.none: this.eachTile((x, y) => this.refreshTileViewNone(x, y)); break;
            case MapTileViewStatus.terrain: this.eachTile((x, y) => this.refreshTileViewTerrain(x, y)); break;
            case MapTileViewStatus.region: this.eachTile((x, y) => this.refreshTileViewRegion(x, y)); break;
        }
    }

    protected refreshTileViewXY(x: number, y: number, index: number) {

        switch (this.tileViewStatus) {

            case MapTileViewStatus.none: this.refreshTileViewNone(x, y, index); break;
            case MapTileViewStatus.terrain: this.refreshTileViewTerrain(x, y, index); break;
            case MapTileViewStatus.region: this.refreshTileViewRegion(x, y, index); break;
        }
    }

    private refreshTileViewNone(x: number, y: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(x, y) : index;

        this.setTileColor(x, y, 0xffffff, i);
    }

    private refreshTileViewTerrain(x: number, y: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(x, y) : index;

        const c = this.hsv[this.tileMap.terrain[i] * this.colorInterval % this.hsv.length];
        const c32 = Phaser.Display.Color.GetColor32(c.r, c.g, c.b, c.a);

        this.setTileColor(x, y, c32, i);
    }

    private refreshTileViewRegion(x: number, y: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(x, y) : index;

        const c = this.hsv[this.tileMap.region[i] * this.colorInterval % this.hsv.length];
        const c32 = Phaser.Display.Color.GetColor32(c.r, c.g, c.b, c.a);

        this.setTileColor(x, y, c32, i);
    }

    private setTileColor(x: number, y: number, tint: number, index: number) {

        x *= 2;
        y *= 2;

        const set = (layer: Phaser.Tilemaps.TilemapLayer) => {

            layer.layer.data[y][x].tint = tint;
            layer.layer.data[y + 1][x].tint = tint;
            layer.layer.data[y][x + 1].tint = tint;
            layer.layer.data[y + 1][x + 1].tint = tint;
        };

        set(this.layer1);
        set(this.layer2);

        const img = this.tileImageMap.tileImageMap[index];

        img && (img.tint = tint);
    }

    public updateRegion(x: number, y: number, regionId: number) {

        const index = this.getTileMapIndex(x, y);

        if (index < 0) return;

        this.tileMap.region[index] = regionId;

        this.refreshTileViewXY(x, y, index);
    }

    protected refreshRiverTile(tx: number, ty: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(tx, ty) : index;

        if (i < 0) return;

        const layer = this.layerRiver;
        const tileId = this.getTileId(layer, tx, ty);

        const otx = tx * 2;
        const oty = ty * 2;

        if (tileId < 0) {

            this.setRiverTileImage(-1, otx, oty);
            this.setRiverTileImage(-1, otx + 1, oty);
            this.setRiverTileImage(-1, otx, oty + 1);
            this.setRiverTileImage(-1, otx + 1, oty + 1);
            this.directionImageMap.setTileImage(-1, tx, ty, i);
            return;
        }

        const river = this.tileMap.river[i];

        switch (river.flowDirection) {

            case RiverDirection.left2right: this.directionImageMap.setTileImage(0, tx, ty, i); break;
            case RiverDirection.right2left: this.directionImageMap.setTileImage(1, tx, ty, i); break;
            case RiverDirection.up2down: this.directionImageMap.setTileImage(2, tx, ty, i); break;
            case RiverDirection.down2up: this.directionImageMap.setTileImage(3, tx, ty, i); break;
        }

        if (river.isEstuary) {

            this.getRiverTileIndex(tileId, getTileIndex => {

                const fill = (r: number, c: number, otx: number, oty: number) =>
                    this.setRiverTileImage(getTileIndex(r, c), otx, oty);

                const tileFill = new TileFillData();

                tileFill.fill1 = (r: number, c: number) => fill(r * 2, c * 2, otx, oty);
                tileFill.fill2 = (r: number, c: number) => fill(r * 2, c * 2 + 1, otx + 1, oty);
                tileFill.fill3 = (r: number, c: number) => fill(r * 2 + 1, c * 2, otx, oty + 1);
                tileFill.fill4 = (r: number, c: number) => fill(r * 2 + 1, c * 2 + 1, otx + 1, oty + 1);

                const data = this.checkDirectionSame(tx, ty, river.direction);

                TileMapUtil.setEstuaryTileImage(data, tileFill);
            });
        } else {

            this.getRiverTileIndex(tileId, getTileIndex => {

                const fill = (r: number, c: number, otx: number, oty: number) =>
                    this.setRiverTileImage(getTileIndex(r, c), otx, oty);

                    const tileFill = new TileFillData();

                tileFill.fill1 = (r: number, c: number) => fill(r * 2, c * 2, otx, oty);
                tileFill.fill2 = (r: number, c: number) => fill(r * 2, c * 2 + 1, otx + 1, oty);
                tileFill.fill3 = (r: number, c: number) => fill(r * 2 + 1, c * 2, otx, oty + 1);
                tileFill.fill4 = (r: number, c: number) => fill(r * 2 + 1, c * 2 + 1, otx + 1, oty + 1);

                const data = this.checkDirectionSame(tx, ty, river.direction, (x, y, ox, oy) => {

                    const i = this.getTileMapIndex(ox, oy);

                    if (i < 0) return true;

                    const r = this.tileMap.river[i];

                    if (!r) return false;

                    const flag = TileMapUtil.checkFlowDirectionSame(x, y, river.direction, r.direction);

                    return tileId == r.riverId && (r.isEstuary || flag);
                });

                TileMapUtil.setRiverTileImage(data, tileFill)
            });
        }
    }

    private setRiverTileImage(tileIndex: number, x: number, y: number) {

        const index = y * this.tileMap.width * 2 + x;

        this.riverTileImageMap.setTileImage(tileIndex, x, y, index);
    }

    protected refreshTileSite(tx: number, ty: number, index?: number) {

        const i = index === undefined ? this.getTileMapIndex(tx, ty) : index;

        if (i < 0) return;

        const ts = this.tileMap.site[i];

        if (ts) {

            switch (ts.type) {

                case TileSiteType.stronghold:

                    this.tileObjectImageMap.setTileImage(TileMapConstant.tileSiteStrongholdImageId, ts.x, ts.y, i);
                    break;

                case TileSiteType.battlefield:

                    this.tileObjectImageMap.setTileImage(TileMapConstant.tileSiteBattlefieldImageId, ts.x, ts.y, i);
                    break;
            }
        }
        else {

            this.tileObjectImageMap.setTileImage(-1, 0, 0, i);
        }
    }

    private eachTile(each: (x: number, y: number) => void) {

        TileMapUtil.eachTile(this.tileMap.height, this.tileMap.width, each);
    }

    public destory() {

        this.scene.cache.tilemap.remove(this.keyMap);

        this.inputClickComponent.destory();

        this.input.off(Phaser.Input.Events.POINTER_MOVE);
        this.input.off(Phaser.Input.Events.POINTER_DOWN);
        this.input.off(Phaser.Input.Events.DRAG_START);
        this.input.off(Phaser.Input.Events.DRAG);
        this.input.off(Phaser.Input.Events.DRAG_END);
        this.input.off(Phaser.Input.Events.POINTER_WHEEL);
    }
}