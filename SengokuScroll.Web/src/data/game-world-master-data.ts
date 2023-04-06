import GameMasterData from "./game-master-data";
import TileMap from "./tile-map";
import TileMapImage from "./tile-map-image";
import TileMapMasterData from "./tile-map-master-data";

export default class GameWorldMasterData {

    public name!: string;

    public tileMap!: TileMap;

    public tileMapImage!: TileMapImage;

    public tileMapMasterData!: TileMapMasterData;

    public gameMasterData!: GameMasterData;
}