import RiverTileData from "./river-tile-data";
import TileSite from "../models/tile-site";
import Specialty from "@/models/specialty";

export default class TileMap {

    public width!: number;

    public height!: number;

    public length!: number;

    public autoTileType!: number[];

    public tileType!: { [key: number]: number };

    public tileTerrain!: number[];

    public tileLandform!: number[];

    public tile!: { [key: number]: number };

    public terrain!: number[];

    public region!: number[];

    public river!: { [key: number]: RiverTileData };

    public site!: { [key: number]: TileSite };

    public specialty!: { [key: number]: Specialty };
}
