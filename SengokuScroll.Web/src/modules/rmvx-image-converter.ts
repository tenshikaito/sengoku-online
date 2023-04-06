import TileMapConstant from "@/constants/tile-map-contant";
import RmvxImageConvertData from "./rmvx-image-convert-data";

export default class RmvxImageConverter {

    public static convert(
        canvas1: HTMLCanvasElement,
        canvas2: HTMLCanvasElement,
        data: RmvxImageConvertData,
        onFinished?: () => void | undefined) {

        const context1 = canvas1.getContext("2d");
        const context2 = canvas2.getContext("2d");

        if (!context1 || !context2 || !data.animatedAutoTileImageFile)
            throw new Error();

        const dtwc = TileMapConstant.autoTileWidth;
        const dthc = TileMapConstant.autoTileHeight;

        const dbWidth = dtwc * data.tileWidth;
        const dbHeight = dthc * data.tileHeight;

        canvas1.width = dbWidth * 8;
        canvas1.height = dbHeight * 5;

        canvas2.width = data.tileWidth * 16;
        canvas2.height = data.tileHeight * 2;

        let converter = new Converter(context1, data);

        this.load(data.animatedAutoTileImageFile, img1 => {

            converter.setImage(img1);

            let sx = 0, sy = 0, dx = 0, dy = 0;

            const drawTerrainTile = () => {
                converter.drawAutoTile(sx, sy, dx, dy);
                ++sx;
                ++dx;
            }

            drawTerrainTile();
            drawTerrainTile();
            drawTerrainTile();
            drawTerrainTile();
            sx = 0; ++sy;
            drawTerrainTile();
            drawTerrainTile();
            drawTerrainTile();
            drawTerrainTile();
            sx = 0; sy = 0;
            dx = 0; ++dy;

            if (!data.autoTileImageFile) throw new Error();

            this.load(data.autoTileImageFile, img2 => {

                converter.setImage(img2);

                for (let ly = 4; sy < ly; ++sy, ++dy) {
                    for (let lx = 8; sx < lx; ++sx, ++dx) {
                        converter.drawAutoTile(sx, sy, dx, dy);
                    }
                    sx = 0; dx = 0;
                }

                if (!data.tileImageFile) throw new Error();

                this.load(data.tileImageFile, img3 => {

                    if (!context2) throw Error();

                    converter = new Converter(context2, data);

                    converter.setImage(img3);

                    const draw4 = (osx: number, osy: number, odx: number, ody: number) => {
                        converter.drawTile(osx, osy, odx, ody);
                        converter.drawTile(osx + 1, osy, odx + 1, ody);
                        converter.drawTile(osx, osy + 1, odx, ody + 1);
                        converter.drawTile(osx + 1, osy + 1, odx + 1, ody + 1);
                    }

                    dx = 0; dy = 0;

                    draw4(0, 5, dx, dy); dx += 2;
                    draw4(0, 3, dx, dy); dx += 2;
                    draw4(2, 3, dx, dy); dx += 2;
                    draw4(2, 5, dx, dy); dx += 2;
                    draw4(4, 3, dx, dy); dx += 2;
                    draw4(4, 5, dx, dy); dx += 2;
                    draw4(6, 3, dx, dy); dx += 2;
                    draw4(6, 5, dx, dy); dx += 2;

                    onFinished && onFinished();
                });
            });
        });
    }

    private static load(file: File, onloaded: (img: HTMLImageElement) => void) {

        if (file) {

            const image = new Image();

            const fr = new FileReader();

            fr.onload = () => {

                image.onload = () => onloaded && onloaded(image);

                image.src = <string>fr.result;
            };

            fr.readAsDataURL(file);
        }
    }
}

class Converter {

    private context: CanvasRenderingContext2D;
    private data: RmvxImageConvertData;
    private img!: HTMLImageElement;

    public constructor(context: CanvasRenderingContext2D, data: RmvxImageConvertData) {
        this.context = context;
        this.data = data;
    }

    public setImage(img: HTMLImageElement) {
        this.img = img;
    }

    public drawTile(sxCount: number, syCount: number, dxCount: number, dyCount: number) {
        const tw = this.data.tileWidth;
        const th = this.data.tileHeight;
        this.context.drawImage(this.img, sxCount * tw, syCount * th, tw, th, dxCount * tw, dyCount * th, tw, th);
    }

    public drawAutoTile(sxCount: number, syCount: number, dxCount: number, dyCount: number) {

        const stwc = TileMapConstant.autoTileWidth;
        const sthc = TileMapConstant.autoTileHeight;
        const dtwc = TileMapConstant.autoTileWidth;
        const dthc = TileMapConstant.autoTileHeight;
        const tw = this.data.tileWidth;
        const th = this.data.tileHeight;

        const sx = sxCount * stwc * tw;
        const sy = syCount * sthc * th;

        const dx = dxCount * dtwc * tw;
        const dy = dyCount * dthc * th;

        let odx = dx;
        let ody = dy;

        const draw = this.drawRmTile;

        for (let iy = 0; iy < dthc; ++iy) {

            for (let ix = 0; ix < dtwc; ++ix) {

                this.draw(ix, iy, sx, sy, odx, ody, tw, th, draw);

                odx += tw;
            }

            odx = dx;
            ody += th;
        }
    }

    private draw(
        ix: number,
        iy: number,
        sx: number,
        sy: number,
        dx: number,
        dy: number,
        tw: number,
        th: number,
        each: (
            ix: number,
            iy: number,
            drawIcon: () => void,
            drawTopLeft: (ox: number, oy: number) => void,
            drawTopRight: (ox: number, oy: number) => void,
            drawBottomLeft: (ox: number, oy: number) => void,
            drawBottomRight: (ox: number, oy: number) => void,
            drawOriginTopLeft: () => void,
            drawOriginTopRight: () => void,
            drawOriginBottomLeft: () => void,
            drawOriginBottomRight: () => void) => void) {

        const tw2 = tw / 2;
        const th2 = th / 2;

        const topLeft = 0;
        const topRight = 1;
        const bottomLeft = 2;
        const bootomRight = 3;

        const getTileVertex = (ox: number, oy: number, id: number) => {

            switch (id) {

                case topLeft: return [sx + ox * tw, sy + oy * th];
                case topRight: return [sx + ox * tw + tw2, sy + oy * th];
                case bottomLeft: return [sx + ox * tw, sy + oy * th + th2];
                case bootomRight: return [sx + ox * tw + tw2, sy + oy * th + th2];
            }

            throw new Error();
        }

        const drawTopLeft = (ox: number, oy: number) => {
            const [x, y] = getTileVertex(ox, oy, topLeft);
            this.context.drawImage(this.img, x, y, tw2, th2, dx, dy, tw2, th2);
        }

        const drawTopRight = (ox: number, oy: number) => {
            const [x, y] = getTileVertex(ox, oy, topRight);
            this.context.drawImage(this.img, x, y, tw2, th2, dx + tw2, dy, tw2, th2);
        }

        const drawBottomLeft = (ox: number, oy: number) => {
            const [x, y] = getTileVertex(ox, oy, bottomLeft);
            this.context.drawImage(this.img, x, y, tw2, th2, dx, dy + th2, tw2, th2);
        }

        const drawBottomRight = (ox: number, oy: number) => {
            const [x, y] = getTileVertex(ox, oy, bootomRight);
            this.context.drawImage(this.img, x, y, tw2, th2, dx + tw2, dy + th2, tw2, th2);
        }

        const drawOriginTopLeft = () => drawTopLeft(1, 2);
        const drawOriginTopRight = () => drawTopRight(0, 2);
        const drawOriginBottomLeft = () => drawBottomLeft(1, 1);
        const drawOriginBottomRight = () => drawBottomRight(0, 1);

        const drawIcon = () => this.context.drawImage(this.img, sx, sy, tw, th, dx, dy, tw, th);

        each(
            ix,
            iy,
            drawIcon,
            drawTopLeft,
            drawTopRight,
            drawBottomLeft,
            drawBottomRight,
            drawOriginTopLeft,
            drawOriginTopRight,
            drawOriginBottomLeft,
            drawOriginBottomRight);
    }

    private drawRmExpandedTile(
        ix: number,
        iy: number,
        drawIcon: () => void,
        drawTopLeft: (ox: number, oy: number) => void,
        drawTopRight: (ox: number, oy: number) => void,
        drawBottomLeft: (ox: number, oy: number) => void,
        drawBottomRight: (ox: number, oy: number) => void,
        drawOriginTopLeft: () => void,
        drawOriginTopRight: () => void,
        drawOriginBottomLeft: () => void,
        drawOriginBottomRight: () => void) {

        switch (iy) {

            case 0:

                switch (ix) {

                    case 0:
                        drawIcon();
                        break;

                    case 1:
                        drawTopLeft(1, 0);
                        drawOriginTopRight();
                        drawOriginBottomLeft();
                        drawOriginBottomRight();
                        break;

                    case 2:
                        drawOriginTopLeft();
                        drawTopRight(1, 0);
                        drawOriginBottomLeft();
                        drawOriginBottomRight();
                        break;
                }
                break;

            case 1:

                switch (ix) {

                    case 0:
                        break;

                    case 1:
                        drawOriginTopLeft();
                        drawOriginTopRight();
                        drawBottomLeft(1, 0);
                        drawOriginBottomRight();
                        break;

                    case 2:
                        drawOriginTopLeft();
                        drawOriginTopRight();
                        drawOriginBottomLeft();
                        drawBottomRight(1, 0);
                        break;
                }
                break;

            case 2:

                switch (ix) {

                    case 0:
                        drawTopLeft(0, 1);
                        drawTopRight(0, 1);
                        drawBottomLeft(0, 1);
                        drawOriginBottomRight();
                        break;

                    case 1:
                        drawTopLeft(1, 1);
                        drawTopRight(1, 0)
                        drawOriginBottomLeft();
                        drawOriginBottomRight();
                        break;

                    case 2:
                        drawTopLeft(1, 1);
                        drawTopRight(1, 1)
                        drawOriginBottomLeft();
                        drawBottomRight(1, 1);
                        break;
                }
                break;

            case 3:

                switch (ix) {

                    case 0:
                        drawTopLeft(0, 2);
                        drawOriginTopRight();
                        drawBottomLeft(0, 2);
                        drawBottomRight(0, 2);
                        break;

                    case 1:
                        drawOriginTopLeft();
                        drawOriginTopRight();
                        drawBottomLeft(1, 2);
                        drawBottomRight(1, 2);
                        break;

                    case 2:
                        drawOriginTopLeft();
                        drawTopRight(1, 2);
                        drawBottomLeft(1, 2);
                        drawBottomRight(1, 2);
                        break;
                }
                break;
        }
    }

    private drawRmTile(
        ix: number,
        iy: number,
        drawIcon: () => void,
        drawTopLeft: (ox: number, oy: number) => void,
        drawTopRight: (ox: number, oy: number) => void,
        drawBottomLeft: (ox: number, oy: number) => void,
        drawBottomRight: (ox: number, oy: number) => void,
        drawOriginTopLeft: () => void,
        drawOriginTopRight: () => void,
        drawOriginBottomLeft: () => void,
        drawOriginBottomRight: () => void) {

        switch (iy) {

            case 0:

                switch (ix) {

                    case 0:
                        drawIcon();
                        break;

                    case 1:
                        drawTopLeft(1, 0);
                        drawTopRight(1, 0);
                        drawBottomLeft(1, 0);
                        drawBottomRight(1, 0);
                        break;
                }
                break;

            case 1:

                switch (ix) {

                    case 0:
                        drawTopLeft(0, 1);
                        drawTopRight(0, 1);
                        drawBottomLeft(0, 1);
                        drawOriginBottomRight();
                        break;

                    case 1:
                        drawTopLeft(1, 1);
                        drawTopRight(1, 1)
                        drawOriginBottomLeft();
                        drawBottomRight(1, 1);
                        break;
                }
                break;

            case 2:

                switch (ix) {

                    case 0:
                        drawTopLeft(0, 2);
                        drawOriginTopRight();
                        drawBottomLeft(0, 2);
                        drawBottomRight(0, 2);
                        break;

                    case 1:
                        drawOriginTopLeft();
                        drawTopRight(1, 2);
                        drawBottomLeft(1, 2);
                        drawBottomRight(1, 2);
                        break;
                }
                break;
        }
    }
}