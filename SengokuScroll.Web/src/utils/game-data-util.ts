import CacheConstant from "@/constants/cache-constant";
import GameWorldData from "@/data/game-world-data";
import GameWorldMasterData from "@/data/game-world-master-data";
import { Game } from "phaser";

export default class GameDataUtil {

    public static setGameWorldMasterData(game: Game, gwmd: GameWorldMasterData) {
        
        game.cache.obj.add(CacheConstant.gameWorldMasterData, gwmd);
    }

    public static getGameWorldMasterData(game: Game) {
        
        return <GameWorldMasterData>game.cache.obj.get(CacheConstant.gameWorldMasterData);
    }

    public static getGameWorldData(game: Game) {
        
        const cache = game.cache;

        return <GameWorldData>cache.obj.get(CacheConstant.gameWorldData);
    }

    public static setGameWorldData(game: Game, gwd: GameWorldData) {
        
        game.cache.obj.add(CacheConstant.gameWorldData, gwd);
    }
}