import TileMapConstant from "@/constants/tile-map-contant";
import GameMasterData from "@/data/game-master-data";
import GameTileMapInfo from "@/data/game-tile-map-info";
import GameWorldData from "@/data/game-world-data";
import GameWorldDate from "@/data/game-world-date";
import GameWorldMasterData from "@/data/game-world-master-data";
import TileMap from "@/data/tile-map";
import TileMapMasterData from "@/data/tile-map-master-data";
import Terrain from "@/models/terrain";
import Region from "@/models/region";
import AutoTileImage from "@/models/image/auto-tile-image";
import TileMapImage from "@/data/tile-map-image";
import TileImage from "@/models/image/tile-image";
import AutoTileType from "@/models/auto-tile-type";
import TileType from "@/models/tile-type";

export default class ExampleUtil {

    private static getTileMapMasterData() {

        return <TileMapMasterData>{

            snowfieldTerrainId: 7,
            autoTileType: [{

                id: 0,
                name: "淺海",
                tileId: 0,
                terrainId: 0,
            },
            {
                id: 1,
                name: "深海",
                tileId: 4,
                terrainId: 1,
            },
            {
                id: 2,
                name: "河流",
                tileId: 0,
                terrainId: 2,
            },
            {
                id: 3,
                name: "河流",
                tileId: 4,
                terrainId: 3,
            },
            {
                id: 4,
                name: "湖泊",
                tileId: 0,
                terrainId: 2,
            },
            {
                id: 5,
                name: "湖泊",
                tileId: 4,
                terrainId: 3,
            },
            {
                id: 6,
                name: "平地",
                tileId: 8,
                warmTileId: 10,
                coolTileId: 16,
                snowfieldTileId: 32,
                terrainId: 4,
            },
            {
                id: 7,
                name: "草地",
                tileId: 9,
                warmTileId: 11,
                coolTileId: 17,
                snowfieldTileId: 32,
                terrainId: 5,
            },
            {
                id: 8,
                name: "森林",
                tileId: 13,
                warmTileId: 12,
                coolTileId: 20,
                snowfieldTileId: 36,
                terrainId: 6,
            },
            {
                id: 9,
                name: "荒地",
                tileId: 16,
                terrainId: 7,
            },
            {
                id: 10,
                name: "砂地",
                tileId: 24,
                terrainId: 8,
            },
            {
                id: 11,
                name: "雪地",
                tileId: 32,
                terrainId: 9,
            },
            {
                id: 12,
                name: "丘陵",
                tileId: 14,
                warmTileId: 14,
                coolTileId: 22,
                snowfieldTileId: 33,
                terrainId: 10,
            },
            {
                id: 13,
                name: "山地",
                tileId: 15,
                snowfieldTileId: 39,
                terrainId: 11,
            }],
            tileType: [{

                id: 0,
                name: "富士山1",
                tileId: 0,
                terrainId: 11,
            },
            {
                id: 1,
                name: "富士山2",
                tileId: 1,
                terrainId: 11,
            },
            {
                id: 2,
                name: "富士山3",
                tileId: 16,
                terrainId: 11,
            },
            {
                id: 3,
                name: "富士山4",
                tileId: 17,
                terrainId: 11,
            }],
            terrain: [{

                id: 0,
                name: "淺海",
                isWater: true,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 1,
                name: "深海",
                isWater: true,
                isDeepWater: true,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 2,
                name: "淺水",
                isWater: true,
                isDeepWater: false,
                isFreshWater: true,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 3,
                name: "深水",
                isWater: true,
                isDeepWater: true,
                isFreshWater: true,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 4,
                name: "平地",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 5,
                name: "草地",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 6,
                name: "森林",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 7,
                name: "荒地",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 8,
                name: "砂地",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 9,
                name: "雪地",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: false,
                isMountain: false,
                introduction: ""
            },
            {
                id: 10,
                name: "丘陵",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isDesert: false,
                isHill: true,
                isMountain: false,
                introduction: ""
            },
            {
                id: 11,
                name: "山地",
                isWater: false,
                isDeepWater: false,
                isFreshWater: false,
                isHill: false,
                isMountain: true,
                introduction: ""
            }],
            region: [{
                id: 0,
                name: "山城國"
            }]
        };
    }

    private static getTileMap(width: number, height: number, value = 0) {

        const length = width * height;

        return <TileMap>{
            width: width,
            height: height,
            length: length,
            autoTileType: this.getArr(length, _ => value),
            tileType: {},
            tileTerrain: this.getArr(length, _ => value),
            tileLandform: this.getArr(length, _ => -1),
            tile: {},
            terrain: this.getArr(length, _ => 0),
            region: this.getArr(length, _ => 0),
            river: {},
            site: {},
        };
    }

    public static getGameTileMapInfo(
        width: number,
        height: number,
        tileWidth: number,
        tileHeight: number,
        autoTileImageWidth: number,
        autoTileImageHeight: number,
        tileImageWidth: number,
        tileImageHeight: number,
        eachTerrain: (index: number) => number) {

        const autoTileWidth = width * 2;
        const autoTileHeight = height * 2;
        const tileLength = autoTileWidth * autoTileHeight;

        tileWidth = tileWidth / 2;
        tileHeight = tileHeight / 2;

        return <GameTileMapInfo>{
            width: autoTileWidth,
            height: autoTileHeight,
            tilewidth: tileWidth,
            tileheight: tileHeight,
            orientation: "orthogonal",
            properties: {},
            version: 1,
            layers: [{
                name: "terrain",
                width: autoTileWidth,
                height: autoTileHeight,
                x: 0,
                y: 0,
                type: "tilelayer",
                opacity: 1,
                visible: true,
                data: this.getArr(tileLength, i => eachTerrain(i))
            },
            {
                name: "landform",
                width: autoTileWidth,
                height: autoTileHeight,
                x: 0,
                y: 0,
                type: "tilelayer",
                opacity: 1,
                visible: true,
                data: this.getArr(tileLength, _ => 0)
            }],
            tilesets: [{
                name: "autotile",
                firstgid: 1,
                image: "default.png",
                imagewidth: autoTileImageWidth,
                imageheight: autoTileImageHeight,
                tilewidth: tileWidth,
                tileheight: tileHeight,
                margin: 0,
                properties: {},
                spacing: 0,
            },
            {
                name: "tile",
                firstgid: 1,
                image: "default.png",
                imagewidth: tileImageWidth,
                imageheight: tileImageHeight,
                tilewidth: tileWidth,
                tileheight: tileHeight,
                margin: 0,
                properties: {},
                spacing: 0,
            }],

        };
    }

    private static getTileMapImage() {

        const tileImage = Array.from({ length: 100 }, (_, i) => ({
            tileId: i,
            isDisabled: false
        } as TileImage));

        const autoTileImage = Array.from({ length: 40 }, (_, i) => ({
            tileId: i,
            isDisabled: false,
            isSurface: false,
            backgroundTileId: -1
        } as AutoTileImage));

        [
            3, 4, 7, 9, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23, 25, 27, 28, 29, 30, 31, 33, 35, 36, 37, 38, 39
        ].map(o => autoTileImage.find(oo => oo.tileId == o)).forEach(o => o && (o.isSurface = true));

        [
            1, 2, 3, 5, 6, 7
        ].map(o => autoTileImage.find(oo => oo.tileId == o)).forEach(o => o && (o.isDisabled = true));

        [
            [3, 0],
            [4, 0],
            [5, 0],
            [6, 0],
            [7, 0],
            [9, 8],
            [11, 10],
            [17, 16],
            [19, 18],
            [25, 24],
            [27, 26],
            [33, 32],
            [35, 34]
        ].forEach(o => {
            const oo = autoTileImage.find(oo => oo.tileId == o[0]);

            oo && (oo.backgroundTileId = o[1]);
        });

        return <TileMapImage>{
            baseUrlPath: "",
            tileWidth: 32,
            tileHeight: 32,
            tileIdRowCount: 2,
            tileIdColumnCount: 16,
            tileImageName: TileMapConstant.tileFileName,
            tileImage: tileImage,
            imageAutoTileWidth: TileMapConstant.autoTileWidth,
            imageAutoTileHeight: TileMapConstant.autoTileHeight,
            autoTileIdRowCount: 5,
            autoTileIdColumnCount: 8,
            autoTileImageName: TileMapConstant.autoTileFileName,
            animatedAutoTileImage: [{
                tileId: 0,
                frameIdList: [0, 1, 2]
            },
            {
                tileId: 4,
                frameIdList: [4, 5, 6]
            }],
            autoTileImage: autoTileImage,
            imageRiverWidth: TileMapConstant.riverTileWidth,
            imageRiverHeight: TileMapConstant.riverTileHeight,
            riverTileIdRowCount: 1,
            riverTileIdColumnCount: 1,
            riverTileImageName: TileMapConstant.riverTileFileName,
            riverImage: [{
                tileId: 0,
            }],
            tileObjectImageName: TileMapConstant.tileObjectFileName,
            directionImageName: TileMapConstant.directionFileName
        };
    }

    private static getArr(length: number, each: (index: number) => number) {

        const arr = [];

        for (let i = 0; i < length; ++i) {

            arr[i] = each(i);
        }

        return arr;
    }

    public static getDefaultData(i: number, columnWidth: number): number {

        switch (Math.floor(i / columnWidth) % 2) {

            case 0:

                switch (i % 2) {

                    case 0: return 131;
                    case 1: return 130;
                }

                break;

            case 1:

                switch (i % 2) {

                    case 0: return 99;
                    case 1: return 98;
                }

                break;
        }

        return 0;
    }

    public static getGameWorldData(gwmd: GameWorldMasterData) {

        return <GameWorldData>{
            ...gwmd
        };
    }

    public static getGameWorldMasterData(name: string, width: number, height: number, value = 0) {

        return <GameWorldMasterData>{

            name: name,
            tileMap: this.getTileMap(width, height, value),
            tileMapImage: this.getTileMapImage(),
            tileMapMasterData: this.getTileMapMasterData(),
            gameMasterData: this.getGameMasterData()
        };
    }

    private static getGameMasterData() {

        return <GameMasterData>{

            culture: [{
                id: 1,
                name: "大和",
                introduction: ""
            },
            {
                id: 2,
                name: "蝦夷",
                introduction: ""
            },
            {
                id: 3,
                name: "琉球",
                introduction: ""
            },
            {
                id: 4,
                name: "明",
                introduction: ""
            },
            {
                id: 5,
                name: "朝鮮",
                introduction: ""
            },
            {
                id: 6,
                name: "英吉利",
                introduction: ""
            },
            {
                id: 7,
                name: "荷蘭",
                introduction: ""
            },
            {
                id: 8,
                name: "西班牙",
                introduction: ""
            },
            {
                id: 9,
                name: "葡萄牙",
                introduction: ""
            }],
            religion: [{
                id: 1,
                name: "神道教",
                introduction: ""
            },
            {
                id: 2,
                name: "佛教",
                introduction: ""
            },
            {
                id: 3,
                name: "基督教",
                introduction: ""
            },
            {
                id: 5,
                name: "原始宗教",
                introduction: ""
            }],
            character: [{
                id: 1,
                name: "織田信長",
                introduction: ""
            }],
            weapon: [{
                id: 1,
                name: "武器",
                introduction: ""
            }],
            armor: [{
                id: 1,
                name: "防具",
                introduction: ""
            }],
            vehicle: [{
                id: 1,
                name: "驮马",
                introduction: ""
            }],
            item: [{
                id: 1,
                name: "獨立宣言",
                introduction: ""
            }],
            goods: [{
                id: 1,
                name: "金錢"
            }]
        };
    }

    private static getGameWorldDate() {

        return <GameWorldDate>{

            year: 1453,
            month: 5,
            day: 29
        };
    }

    public static getAutoTileType(id: number) {

        return <AutoTileType>{

            id: id,
            name: "",
            tileId: 0,
            terrainId: 0
        };
    }

    public static getTileType(id: number) {

        return <TileType>{

            id: id,
            name: "",
            tileId: 0,
            terrainId: 0
        };
    }

    public static getTerrain(id: number) {

        return <Terrain>{

            id: id,
            name: "",
            tileId: 0,
            isWater: false,
            isFreshWater: false,
            isDeepWater: false,
            isDesert: false,
            isHill: false,
            isMountain: false,
            introduction: "",
        };
    }

    public static getRegion(id: number) {

        return <Region>{

            id: id,
            name: "",
            introduction: "",
        };
    }
}