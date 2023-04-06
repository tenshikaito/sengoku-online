// import ServiceResultModel from "@/apis/service-result-model";
// import TileSiteType from "@/codetypes/tile-site-type";
// import ConnectionInfo from "@/data/connection-info";
// import MultiplayerGameData from "@/data/multiplayer-game-data";
// import TileSite from "@/models/tile-site";
// import SceneBase from "@/scenes/scene-base";
// import ExampleUtil from "@/utils/example-util";
// import TileMapUtil from "@/utils/tile-map-util";
// import PlayerView from "@/view-models/player-view";

// export default class MultiplayerGameClient {

//     protected scene: SceneBase;
//     protected connectionInfo: ConnectionInfo;

//     public constructor(scene: SceneBase, ci: ConnectionInfo) {

//         this.scene = scene;
//         this.connectionInfo = ci;
//     }

//     public connect() {

//     }

//     public getUserData() {

//         return new ServiceResultModel<PlayerView>();
//     }

//     public getGameData() {

//         return new ServiceResultModel<MultiplayerGameData>();
//     }

//     public disconnect() {

//     }
// }

// export class TestMultiplayerGameClient extends MultiplayerGameClient {

//     public getGameData() {

//         let mgd = new MultiplayerGameData();

//         let gwmd = ExampleUtil.getGameWorldMasterData("test", 100, 100);

//         mgd.gameWorldMasterData = gwmd;

//         TileMapUtil.eachTile(gwmd.tileMap.width, gwmd.tileMap.height, (x, y) => {

//             if (x > 10 && y > 10 && x < gwmd.tileMap.width - 10 && y < gwmd.tileMap.height - 10)
//                 gwmd.tileMap.tileTerrain[TileMapUtil.getIndex(gwmd.tileMap, x, y)] = 4;
//         });

//         gwmd.tileMap.site[TileMapUtil.getIndex(gwmd.tileMap, 10, 10)] = <TileSite>{

//             id: 1,
//             name: "上海",
//             x: 20,
//             y: 20,
//             type: TileSiteType.stronghold,
//             introduction: ""
//         };

//         return this.getServiceResult(mgd);
//     }

//     private getServiceResult<T>(data: T) {

//         let m = new ServiceResultModel<T>();

//         m.code = 0;
//         m.data = data;

//         return m;
//     }
// }