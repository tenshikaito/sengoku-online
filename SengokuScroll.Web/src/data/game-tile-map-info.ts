export default class GameTileMapInfo {

    public width!: number;

    public height!: number;

    public tilewidth!: number;

    public tileheight!: number;

    public layers!: Layer[];

    public tilesets!: Tileset[];

    public orientation!: string;

    public properties!: object;

    public version!: number;
}

class Layer {

    public name!: string;

    public width!: number;

    public height!: number;

    public x!: number;

    public y!: number;

    public type!: string;

    public opacity!: number;

    public visible!: boolean;

    public data!: number[];
}

class Tileset {

    public name!: string;

    public firstgid!: number;

    public tilecount!: number;

    public image!: string;

    public imagewidth!: number;

    public imageheight!: number;

    public tilewidth!: number;

    public tileheight!: number;

    public margin!: number;

    public properties!: object;

    public spacing!: number;

    public tiles?: Tile[];
}

class Tile {
    
    public id!: number;

    public animation!: TileAnimation[];
}

class TileAnimation {

    public tileid!: number;

    public duration!: number;
}