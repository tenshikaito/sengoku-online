import AutoTileType from "@/models/auto-tile-type";
import Region from "@/models/region";
import SpecialtyCategory from "@/models/specialty-category";
import Terrain from "@/models/terrain";
import TileType from "@/models/tile-type";

export default class TileMapMasterData {

    public snowfieldTerrainId!: number;

    public terrain!: Terrain[];

    public autoTileType!: AutoTileType[];

    public tileType!: TileType[];

    public region!: Region[];

    public specialty!: SpecialtyCategory[];
}
