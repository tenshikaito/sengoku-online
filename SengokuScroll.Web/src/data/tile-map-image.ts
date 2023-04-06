import AnimatedTileImage from "@/models/image/animated-tile-image";
import AutoTileImage from "@/models/image/auto-tile-image";
import RiverTileImage from "@/models/image/river-tile-image";
import TileImage from "@/models/image/tile-image";

export default class TileMapImage {

    public tileWidth!: number;

    public tileHeight!: number;

    public tileImageName!: string;

    public tileIdRowCount!: number;

    public tileIdColumnCount!: number;

    public tileImage!: TileImage[];

    public autoTileImageName!: string;

    public autoTileIdRowCount!: number;

    public autoTileIdColumnCount!: number;

    public imageAutoTileWidth!: number;

    public imageAutoTileHeight!: number;

    public baseUrlPath!: string;

    public animatedAutoTileImage!: AnimatedTileImage[];

    public autoTileImage!: AutoTileImage[];

    public imageRiverWidth!: number;

    public imageRiverHeight!: number;

    public riverTileImageName!: string;

    public riverTileIdRowCount!: number;

    public riverTileIdColumnCount!: number;

    public riverImage!: RiverTileImage[];

    public directionImageName!: string;

    public tileObjectImageName!: string;
}
