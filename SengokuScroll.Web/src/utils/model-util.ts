import AutoTileType from "@/models/auto-tile-type";
import AutoTileImage from "@/models/image/auto-tile-image";
import TileImage from "@/models/image/tile-image";
import Region from "@/models/region";
import Terrain from "@/models/terrain";
import TileType from "@/models/tile-type";
import AutoTileTypeViewModel from "@/view-models/game-map-editor/auto-tile-type-view-model";
import AutoTileViewModel from "@/view-models/game-map-editor/auto-tile-view-model";
import RegionViewModel from "@/view-models/game-map-editor/region-view-model";
import TerrainViewModel from "@/view-models/game-map-editor/terrain-view-model";
import TileTypeViewModel from "@/view-models/game-map-editor/tile-type-view-model";
import TileViewModel from "@/view-models/game-map-editor/tile-view-model";

export default class ModelUtil {

    public static autoTileType2autoTileTypeViewModel(from: AutoTileType, to: AutoTileTypeViewModel) {
        this.tileType2tileTypeViewModel(from, to);

        return to;
    }

    public static autoTileTypeViewModel2autoTileType(from: AutoTileTypeViewModel, to: AutoTileType) {
        this.tileTypeViewModel2tileType(from, to);

        return to;
    }

    public static tileType2tileTypeViewModel(from: TileType, to: TileTypeViewModel) {
        to.id = from.id;
        to.name = from.name;
        to.tileId = from.tileId;
        to.warmTileId = from.warmTileId;
        to.coolTileId = from.coolTileId;
        to.snowTileId = from.snowfieldTileId;
        to.terrainId = from.terrainId;

        return to;
    }

    public static tileTypeViewModel2tileType(from: TileTypeViewModel, to: TileType) {
        to.id = from.id!;
        to.name = from.name!;
        to.tileId = from.tileId!;
        to.warmTileId = from.warmTileId;
        to.coolTileId = from.coolTileId;
        to.snowfieldTileId = from.snowTileId;
        to.terrainId = from.terrainId!;

        return to;
    }

    public static terrain2terrainViewModel(from: Terrain, to: TerrainViewModel) {
        to.id = from.id;
        to.name = from.name;
        to.isWater = from.isWater;
        to.isDeepWater = from.isDeepWater;
        to.isFreshWater = from.isFreshWater;
        to.isDesert = from.isDesert;
        to.isHill = from.isHill;
        to.isMountain = from.isMountain;
        to.introduction = from.introduction;

        return to;
    }

    public static terrainViewModel2terrain(from: TerrainViewModel, to: Terrain) {
        to.id = from.id!;
        to.name = from.name;
        to.isWater = from.isWater;
        to.isDeepWater = from.isDeepWater;
        to.isFreshWater = from.isFreshWater;
        to.isDesert = from.isDesert;
        to.isHill = from.isHill;
        to.isMountain = from.isMountain;
        to.introduction = from.introduction;

        return to;
    }

    public static region2regionViewModel(from: Region, to: RegionViewModel) {
        to.id = from.id;
        to.name = from.name;
        to.introduction = from.introduction;

        return to;
    }

    public static regionViewModel2region(from: RegionViewModel, to: Region) {
        to.id = from.id!;
        to.name = from.name;
        to.introduction = from.introduction;

        return to;
    }

    public static autoTileImage2autoTileViewModel(from: AutoTileImage, to: AutoTileViewModel) {
        to.tileId = from.tileId;
        to.isSurface = from.isSurface;
        to.backgroundTileId = from.backgroundTileId;
        to.isDisabled = from.isDisabled;

        return to;
    }

    public static tileImage2tileViewModel(from: TileImage, to: TileViewModel) {
        to.tileId = from.tileId;
        to.isDisabled = from.isDisabled;

        return to;
    }

    public static autoTileViewModel2autoTileImage(from: AutoTileViewModel, to: AutoTileImage) {
        to.tileId = from.tileId!;
        to.isSurface = from.isSurface;
        to.backgroundTileId = from.backgroundTileId!;
        to.isDisabled = from.isDisabled;

        return to;
    }

    public static tileViewModel2tileImage(from: TileViewModel, to: TileImage) {
        to.tileId = from.tileId!;
        to.isDisabled = from.isDisabled;

        return to;
    }
}