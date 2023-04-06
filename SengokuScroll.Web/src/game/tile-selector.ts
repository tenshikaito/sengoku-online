import TileMapImage from "@/data/tile-map-image";
import TileMapConstant from "@/constants/tile-map-contant";
import TileMapUtil from "@/utils/tile-map-util";

export class TileSelector {

    protected tileMapImage: TileMapImage;
    protected canvas: HTMLCanvasElement;
    protected image: HTMLImageElement;
    protected isShowAll: boolean;

    public onTileSelected?: (tileId: number) => void;

    public constructor(tmi: TileMapImage, canvas: HTMLCanvasElement, image: HTMLImageElement, isShowAll = false) {

        this.tileMapImage = tmi;
        this.canvas = canvas;
        this.image = image;
        this.isShowAll = isShowAll;
    }

    public init() {

        const canvas = this.canvas;
        const image = this.image;

        canvas.width = image.width;
        canvas.height = image.height;

        this.draw();

        this.addClickEvent();
    }

    public draw() {

        const tmi = this.tileMapImage;
        const canvas = this.canvas;
        const image = this.image;
        const context = canvas.getContext("2d");

        context?.clearRect(0, 0, canvas.width, canvas.height);
        tmi.tileImage.filter(o => this.isShowAll || !o.isDisabled).forEach(o => {

            const rowId = Math.floor(o.tileId / tmi.tileIdColumnCount);
            const columnId = o.tileId % tmi.tileIdColumnCount;

            const y = rowId * tmi.tileHeight;
            const x = columnId * tmi.tileWidth;

            context?.drawImage(image, x, y, tmi.tileWidth, tmi.tileHeight, x, y, tmi.tileWidth, tmi.tileHeight);
        });
    }

    protected addClickEvent() {

        const tmi = this.tileMapImage;

        this.canvas.onclick = e => {

            e.preventDefault();

            const column = Math.floor(e.offsetX / tmi.tileWidth);
            const row = Math.floor(e.offsetY / tmi.tileHeight);

            if (this.checkTileValid(column, row))
                this.select(column, row);
        };
    }

    protected checkTileValid(column: number, row: number) {

        const tmi = this.tileMapImage;

        const tileId = this.getTileId(column, row);

        return this.isShowAll || !!tmi.tileImage.some(o => o.tileId == tileId && !o.isDisabled);
    }

    public select(column: number, row: number) {

        this.set(column, row);

        const tileId = this.getTileId(column, row);

        this.onTileSelected && this.onTileSelected(tileId);
    }

    public setTileId(tileId: number) {

        const { r, c } = TileMapUtil.getTileRowColumn(this.tileMapImage, tileId);

        this.set(r, c);
    }

    public set(column: number, row: number) {

        this.draw();

        const canvas = this.canvas;
        const context = canvas.getContext("2d");
        const rtmi = this.tileMapImage;

        if (context) {

            const x = column * rtmi.tileWidth;
            const y = row * rtmi.tileHeight;

            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.strokeRect(x + 1, y + 1, rtmi.tileWidth - 2, rtmi.tileHeight - 2);
            context.lineWidth = 2;
            context.strokeStyle = "white";
            context.strokeRect(x + 3, y + 3, rtmi.tileWidth - 6, rtmi.tileHeight - 6);
            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.strokeRect(x + 5, y + 5, rtmi.tileWidth - 10, rtmi.tileHeight - 10);
        }
    }

    protected getTileId(column: number, row: number) {

        return row * this.tileMapImage.tileIdColumnCount + column;
    }
}

export class AutoTileSelector extends TileSelector {

    public constructor(tmi: TileMapImage, canvas: HTMLCanvasElement, image: HTMLImageElement, isShowAll = false) {

        super(tmi, canvas, image, isShowAll);
    }

    public init() {

        const tmi = this.tileMapImage;
        const canvas = this.canvas;

        const maxRow = tmi.autoTileIdRowCount;
        const maxColumn = tmi.autoTileIdColumnCount;

        canvas.width = maxColumn * tmi.tileWidth;
        canvas.height = maxRow * tmi.tileHeight;

        this.draw();

        this.addClickEvent();
    }

    public setTileId(tileId: number) {

        const { r, c } = TileMapUtil.getAutoTileRowColumn(this.tileMapImage, tileId);

        this.set(c, r);
    }

    public draw() {

        const tmi = this.tileMapImage;
        const image = this.image;
        const canvas = this.canvas;
        const context = canvas.getContext("2d");

        context?.clearRect(0, 0, canvas.width, canvas.height);

        tmi.autoTileImage.filter(o => this.isShowAll || !o.isDisabled).forEach(o => {

            const rowId = Math.floor(o.tileId / tmi.autoTileIdColumnCount);
            const columnId = o.tileId % tmi.autoTileIdColumnCount;

            const y = rowId * tmi.tileHeight;
            const x = columnId * tmi.tileWidth;

            if (o.backgroundTileId) {

                context?.drawImage(
                    image,
                    o.backgroundTileId % tmi.autoTileIdColumnCount * tmi.tileWidth * tmi.imageAutoTileWidth + tmi.tileWidth / 2,
                    Math.floor(o.backgroundTileId / tmi.autoTileIdColumnCount) * tmi.tileHeight * tmi.imageAutoTileHeight + tmi.tileHeight + tmi.tileHeight / 2,
                    tmi.tileWidth,
                    tmi.tileHeight,
                    x,
                    y,
                    tmi.tileWidth,
                    tmi.tileHeight);
            }

            context?.drawImage(
                image,
                x * this.tileMapImage.imageAutoTileWidth,
                y * this.tileMapImage.imageAutoTileHeight,
                tmi.tileWidth,
                tmi.tileHeight,
                x,
                y,
                tmi.tileWidth,
                tmi.tileHeight);
        });
    }

    protected checkTileValid(column: number, row: number) {

        const rtmi = this.tileMapImage;

        const tileId = this.getTileId(column, row);

        return this.isShowAll || rtmi.autoTileImage.some(o => o.tileId == tileId && !o.isDisabled);
    }

    protected getTileId(column: number, row: number) {

        return row * this.tileMapImage.autoTileIdColumnCount + column;
    }
}

export class RiverTileSelector extends TileSelector {

    public constructor(tmi: TileMapImage, canvas: HTMLCanvasElement, image: HTMLImageElement, isShowAll = false) {

        super(tmi, canvas, image, isShowAll);
    }

    public init() {

        const tmi = this.tileMapImage;
        const canvas = this.canvas;

        const maxRow = tmi.riverTileIdRowCount;
        const maxColumn = tmi.riverTileIdColumnCount;

        canvas.width = maxColumn * tmi.tileWidth;
        canvas.height = maxRow * tmi.tileHeight;

        this.draw();

        this.addClickEvent();
    }

    public draw() {

        const tmi = this.tileMapImage;
        const canvas = this.canvas;
        const image = this.image;
        const context = canvas.getContext("2d");

        context?.clearRect(0, 0, canvas.width, canvas.height);

        tmi.riverImage.filter(o => this.isShowAll || !o.isDisabled).forEach(o => {

            const rowId = Math.floor(o.tileId / tmi.riverTileIdColumnCount);
            const columnId = o.tileId % tmi.riverTileIdColumnCount;

            const y = rowId * tmi.tileHeight;
            const x = columnId * tmi.tileWidth;

            context?.drawImage(
                image,
                x * TileMapConstant.riverTileWidth,
                y * TileMapConstant.riverTileHeight,
                tmi.tileWidth,
                tmi.tileHeight,
                x,
                y,
                tmi.tileWidth,
                tmi.tileHeight);
        });
    }

    protected checkTileValid(column: number, row: number) {

        const tmi = this.tileMapImage;

        const tileId = this.getTileId(column, row);

        return this.isShowAll || tmi.riverImage.some(o => o.tileId == tileId && !o.isDisabled);
    }

    public select(column: number, row: number) {

        this.set(column, row);

        const tileId = this.getTileId(column, row);

        this.onTileSelected && this.onTileSelected(tileId);
    }

    public setTileId(tileId: number) {

        const { r, c } = TileMapUtil.getRiverTileRowColumn(this.tileMapImage, tileId);

        this.set(r, c);
    }

    protected getTileId(column: number, row: number) {

        return row * this.tileMapImage.riverTileIdColumnCount + column;
    }
}
