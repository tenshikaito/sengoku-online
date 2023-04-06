import Direction16 from "@/codetypes/direction16";
import RiverDirection from "@/codetypes/river-direction";
import TileSite from "@/models/tile-site";
import TileMapUtil from "@/utils/tile-map-util";
import TileMapComponentBase from "./tile-map-component-base";

export default class TileMapEditorComponent extends TileMapComponentBase {

    public updateTileType(isAutoTile: boolean, tilePositionX: number, tilePositionY: number, tileId: number) {

        const index = this.getTileMapIndex(tilePositionX, tilePositionY);

        if (index < 0) return;

        if (isAutoTile) {

            const autoTile = this.tileMapMasterData.autoTileType[tileId];

            this.tileMap.autoTileType[index] = autoTile.id;

            this.tileMap.terrain[index] = autoTile.terrainId;

            this.setAutoTile(tilePositionX, tilePositionY, autoTile.tileId, index);
        }
        else {

            const tile = this.tileMapMasterData.tileType[tileId];

            this.tileMap.tileType[index] = tile.id;

            this.tileMap.terrain[index] = tile.terrainId;

            this.setTile(tilePositionX, tilePositionY, tile.tileId, index);
        }
    }

    private setAutoTile(tilePositionX: number, tilePositionY: number, tileId: number, index: number) {

        const autoTile = this.tileMapImage.autoTileImage[tileId];

        const layer = autoTile.isSurface ? this.layerLandform : this.layerTerrain;

        this.getAutoTileList(layer)[index] = tileId;

        const river = this.tileMap.river[index];

        if (river) {

            const dnone = Direction16.none;

            this.updateRiverTile(tilePositionX, tilePositionY, -1, dnone, dnone, true, RiverDirection.none, index);
            this.updateRiverTile(tilePositionX, tilePositionY, -1, dnone, dnone, false, RiverDirection.none, index);
        }

        this.refreshTileViewXY(tilePositionX, tilePositionY, index);

        this.updateAutoTile(layer, tilePositionX, tilePositionY, index);

        if (autoTile.isSurface) {

            if (autoTile.backgroundTileId >= 0) {

                this.getAutoTileList(this.layerTerrain)[index] = autoTile.backgroundTileId;
                this.updateAutoTile(this.layerTerrain, tilePositionX, tilePositionY, index);
            }
        }
        else {

            this.getAutoTileList(this.layerLandform)[index] = -1;
            this.updateAutoTile(this.layerLandform, tilePositionX, tilePositionY, index);
        }
    }

    private updateAutoTile(layer: number, tx: number, ty: number, index: number) {

        this.eachTile9(tx, ty, (_x, _y, ox, oy) => this.refreshAutoTile(layer, ox, oy));

        this.setTile(tx, ty, -1, index);
    }

    public fillRectangle(
        startTx: number,
        startTy: number,
        tx: number,
        ty: number,
        each: (x: number, y: number, width: number, height: number) => void) {

        this.setCursor(1, 1);

        const { sx, sy, width, height } = this.getSelectedRectangle(startTx, startTy, tx, ty);

        for (let y = 0; y < height; ++y) {

            for (let x = 0; x < width; ++x) {

                each(sx + x, sy + y, width, height);
            }
        }
    }

    private setTile(tilePositionX: number, tilePositionY: number, tileId: number, index: number) {

        if (tileId < 0) delete this.tileMap.tile[index];
        else this.tileMap.tile[index] = tileId;

        const river = this.tileMap.river[index];

        if (river) {

            const dnone = Direction16.none;

            this.updateRiverTile(tilePositionX, tilePositionY, -1, dnone, dnone, true, RiverDirection.none, index);
            this.updateRiverTile(tilePositionX, tilePositionY, -1, dnone, dnone, false, RiverDirection.none, index);
        }

        this.refreshTileViewXY(tilePositionX, tilePositionY, index);

        this.refreshTile(tilePositionX, tilePositionY, index);
    }

    public fillRectangleTileType(isAutoTile: boolean, tileId: number, startTx: number, startTy: number, tx: number, ty: number) {

        this.fillRectangle(startTx, startTy, tx, ty, (x, y) => this.updateTileType(isAutoTile, x, y, tileId));
    }

    public fillAutoTileType(isAutoTile: boolean, tilePositionX: number, tilePositionY: number, tileId: number) {

        this.selectFillTile(tilePositionX, tilePositionY, (x, y) => this.updateTileType(isAutoTile, x, y, tileId));
    }

    public selectFillTile(tilePositionX: number, tilePositionY: number, each: (x: number, y: number) => void) {

        const index = this.getTileMapIndex(tilePositionX, tilePositionY);

        if (index < 0) return;

        const tx = tilePositionX;
        const ty = tilePositionY;

        let targetTileId = this.getTileId(this.layerTile, tx, ty);

        if (targetTileId >= 0) {

            const targetBackTileId = this.getTileId(this.layerTerrain, tx, ty, index);
            const targetBack2TileId = this.getTileId(this.layerLandform, tx, ty, index);

            this.searchTile(tilePositionX, tilePositionY, (otx, oty) => {

                const currentTileId = this.getTileId(this.layerTile, otx, oty);
                const currentBackTileId = this.getTileId(this.layerTerrain, otx, oty);
                const currentBac2kTileId = this.getTileId(this.layerLandform, otx, oty);

                return currentTileId == targetTileId
                    && currentBackTileId === targetBackTileId
                    && currentBac2kTileId == targetBack2TileId;
            }, each);
        }
        else {

            targetTileId = this.getTileId(this.layerLandform, tx, ty, index);

            if (targetTileId >= 0) {

                const targetBackTileId = this.getTileId(this.layerTerrain, tx, ty, index);

                this.searchTile(tilePositionX, tilePositionY, (otx, oty) => {

                    const currentTileId = this.getTileId(this.layerLandform, otx, oty);
                    const currentBackTileId = this.getTileId(this.layerTerrain, otx, oty);

                    return currentTileId == targetTileId && currentBackTileId === targetBackTileId;
                }, each);
            }
            else {

                targetTileId = this.getTileId(this.layerTerrain, tx, ty, index);

                this.searchTile(tilePositionX, tilePositionY, (otx, oty) => {

                    const currentTileId = this.getTileId(this.layerTerrain, otx, oty);

                    return currentTileId == targetTileId;
                }, each);
            }
        }
    }

    public updateRegion(x: number, y: number, regionId: number) {

        const index = this.getTileMapIndex(x, y);

        if (index < 0) return;

        this.tileMap.region[index] = regionId;

        this.refreshTileViewXY(x, y, index);
    }

    public fillRectangleRegion(regionId: number, startTx: number, startTy: number, tx: number, ty: number) {

        this.fillRectangle(startTx, startTy, tx, ty, (x, y) => this.updateRegion(x, y, regionId));
    }

    public fillRegion(tilePositionX: number, tilePositionY: number, regionId: number) {

        this.selectRegionTile(tilePositionX, tilePositionY, (x, y) => this.updateRegion(x, y, regionId));
    }

    public selectRegionTile(tilePositionX: number, tilePositionY: number, each: (x: number, y: number) => void) {

        const index = this.getTileMapIndex(tilePositionX, tilePositionY);

        if (index < 0) return;

        const targetRegionId = this.tileMap.region[index];

        this.searchTile(tilePositionX, tilePositionY, (otx, oty) => {

            const i = this.getTileMapIndex(otx, oty);

            if (i < 0) return false;

            const currentRegionId = this.tileMap.region[i];

            return currentRegionId == targetRegionId;
        }, each);
    }

    public updateRiverTile(
        x: number,
        y: number,
        riverId: number,
        riverDirection: Direction16,
        estuaryDirection: Direction16,
        isEstuary: boolean,
        flowDirection: RiverDirection,
        index?: number) {

        const i = index == undefined ? this.getTileMapIndex(x, y) : index;

        if (i < 0) return;

        this.setRiverTile(x, y, riverId, riverDirection, estuaryDirection, isEstuary, flowDirection, i);

        this.eachTile9(x, y, (_x, _y, ox, oy) => this.refreshRiverTile(ox, oy));
    }

    private setRiverTile(
        tilePositionX: number,
        tilePositionY: number,
        riverId: number,
        riverDirection: Direction16,
        estuaryDirection: Direction16,
        isEstuary: boolean,
        flowDirection: RiverDirection,
        index: number) {

        let isSetValue = false;
        const isWater = this.tileMapMasterData.terrain[this.tileMap.terrain[index]].isWater;

        if ((isWater && !isEstuary) || (!isWater && isEstuary)) return;

        if (isEstuary) {

            if (estuaryDirection == Direction16.none) {

                delete this.tileMap.river[index];
            }
            else {

                isSetValue = true;

                let isValid = true;

                const data = this.checkTileFlag(tilePositionX, tilePositionY, (x, y, ox, oy) => {

                    const i = this.getTileMapIndex(ox, oy);

                    if (i < 0) return false;

                    return this.tileMapMasterData.terrain[this.tileMap.terrain[i]].isWater != isWater;
                });

                if (!data.is2Flag && !data.is4Flag && !data.is6Flag && !data.is8Flag) isValid = false;

                if (!isValid) return;
            }
        }
        else {

            if (riverDirection == Direction16.none) delete this.tileMap.river[index];
            else isSetValue = true;
        }

        if (isSetValue) {

            this.tileMap.river[index] = {

                riverId: riverId,
                direction: isEstuary ? estuaryDirection : riverDirection,
                isEstuary: isEstuary,
                flowDirection: flowDirection
            };
        }

        this.refreshRiverTile(tilePositionX, tilePositionY, index);
    }

    public createTileSite(ts: TileSite) {

        this.tileMap.site[ts.id] = ts;

        this.refreshTileSite(ts.x, ts.y);
    }

    public editTileSite(ts: TileSite) {

        this.tileMap.site[ts.id] = ts;
    }

    public deleteTileSite(ts: TileSite) {

        delete this.tileMap.site[ts.id];

        this.refreshTileSite(ts.x, ts.y, ts.id);
    }

    private searchTile(
        x: number,
        y: number,
        isSelectedTile: (tx: number, ty: number) => boolean,
        each?: (tx: number, ty: number) => void) {

        return TileMapUtil.searchTile(this.tileMap, x, y, isSelectedTile, each);
    }

    private eachTile9(
        tx: number,
        ty: number,
        each: (x: number, y: number, ox: number, oy: number, otx: number, oty: number) => void) {

        TileMapUtil.eachTile9(tx, ty, this.tileMap.width, this.tileMap.height, each);
    }
}