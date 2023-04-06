import TileMapImage from "../data/tile-map-image";
import { TileSelector, AutoTileSelector } from "./tile-selector";

export default class TileSelectorManager {

    private autoTileSelector: AutoTileSelector;
    private tileSelector: TileSelector;

    public onTileSelected?: (isAutoTile: boolean, tileId: number) => void;

    public constructor(
        tmi: TileMapImage,
        canvasAutoTile: HTMLCanvasElement,
        canvasTile: HTMLCanvasElement,
        imageAutoTile: HTMLImageElement,
        imageTile: HTMLImageElement) {

        const autoTileSelector = new AutoTileSelector(tmi, canvasAutoTile, imageAutoTile);
        const tileSelector = new TileSelector(tmi, canvasTile, imageTile);

        autoTileSelector.onTileSelected = (tileId) => {

            this.tileSelector.draw();
            this.onTileSelected && this.onTileSelected(true, tileId);
        };

        tileSelector.onTileSelected = (tileId) => {

            this.autoTileSelector.draw();
            this.onTileSelected && this.onTileSelected(false, tileId);
        };

        autoTileSelector.init();
        tileSelector.init();

        this.autoTileSelector = autoTileSelector;
        this.tileSelector = tileSelector;
    }

    public init() {

        this.autoTileSelector.select(0, 0);
    }

    public setTileId(isAutoTile: boolean, tileId: number) {

        if (isAutoTile) {

            this.autoTileSelector.setTileId(tileId);
            this.tileSelector.draw();
        }
        else {

            this.tileSelector.setTileId(tileId);
            this.autoTileSelector.draw();
        }
    }
}
