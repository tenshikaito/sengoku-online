import TileImageMap from "./tile-image-map";
import TileMapComponentBase from "./tile-map-component-base";

export default class TileImageMap4 extends TileImageMap {

    protected override get tileWidth() {

        return this.tileMapImage.tileWidth / 2;
    }

    protected override get tileHeight() {

        return this.tileMapImage.tileHeight / 2;
    }

    public constructor(tm: TileMapComponentBase, imageKey: string, tileDepth: number) {

        super(tm, imageKey, tileDepth);
    }
}