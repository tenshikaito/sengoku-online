import TileMapComponentBase from "./tile-map-component-base";

export default class TileImageMap {

    public tileImageMap: { [key: number]: Phaser.GameObjects.Image } = {};

    protected tileMapComponent: TileMapComponentBase;
    protected imageKey!: string;
    protected tileDepth: number;
    protected isVisible = true;

    protected get tileMapImage() {

        return this.tileMapComponent.tileMapImage;
    }

    protected get scene() {

        return this.tileMapComponent.scene;
    }

    protected get tileWidth() {

        return this.tileMapImage.tileWidth;
    }

    protected get tileHeight() {

        return this.tileMapImage.tileHeight;
    }

    public set visible(value: boolean) {

        this.isVisible = value;

        for (const k in this.tileImageMap)
            this.tileImageMap[k].visible = value;
    }

    public constructor(tm: TileMapComponentBase, imageKey: string, tileDepth: number) {

        this.tileMapComponent = tm;
        this.imageKey = imageKey;
        this.tileDepth = tileDepth;
    }
    
    public setTileImage(tileIndex: number, x: number, y: number, index: number) {

        let img = this.tileImageMap[index];

        if (tileIndex < 0) {

            if (img) {

                img.destroy();

                delete this.tileImageMap[index];
            }

            return;
        }

        if (img) {

            img.setFrame(tileIndex);
        }
        else {

            x *= this.tileWidth;
            y *= this.tileHeight;

            img = this.scene.add.image(x, y, this.imageKey, tileIndex);
        
            img.depth = this.tileDepth;
            img.visible = this.isVisible;

            img.displayOriginX = 0;
            img.displayOriginY = 0;

            this.tileImageMap[index] = img;
        }
    }
}