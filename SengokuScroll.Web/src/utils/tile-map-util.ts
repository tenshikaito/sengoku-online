/* eslint-disable no-constant-condition */
import Direction16 from "@/codetypes/direction16";
import TileFlagData from "@/data/tile-flag-data";
import TileFillData from "@/data/tile-fill-data";
import TileMap from "@/data/tile-map";
import TileMapImage from "@/data/tile-map-image";

export default class TileMapUtil {

    public static getAutoTileRowColumn(rmti: TileMapImage, tileId: number) {

        const r = Math.floor(tileId / rmti.autoTileIdColumnCount);
        const c = tileId % rmti.autoTileIdColumnCount;

        return { r, c };
    }

    public static getTileRowColumn(tmi: TileMapImage, tileId: number) {

        const r = Math.floor(tileId / tmi.tileIdColumnCount);
        const c = tileId % tmi.tileIdColumnCount;

        return { r, c };
    }

    public static getRiverTileRowColumn(tmi: TileMapImage, tileId: number) {

        const r = Math.floor(tileId / tmi.riverTileIdColumnCount);
        const c = tileId % tmi.riverTileIdRowCount;

        return { r, c };
    }

    public static getIndex(tm: TileMap, x: number, y: number) {

        const none = -1;

        if (x < 0 || x >= tm.width || y < 0 || y >= tm.height)
            return none;

        const index = tm.width * y + x;

        return index < 0 || index >= tm.length ? none : index;
    }

    public static setCursor(
        cursor: Phaser.GameObjects.Graphics,
        tileWidth: number,
        tileHeight: number,
        width: number,
        height: number) {

        cursor.clear();
        cursor.lineStyle(1, 0x000000);
        cursor.strokeRect(1, 1, width * tileWidth - 2, height * tileHeight - 2);
        cursor.lineStyle(2, 0xFFFFFF);
        cursor.strokeRect(3, 3, width * tileWidth - 6, height * tileHeight - 6);
        cursor.lineStyle(1, 0x000000);
        cursor.strokeRect(5, 5, width * tileWidth - 10, height * tileHeight - 10);
    }

    public static eachTile(height: number, width: number, each: (x: number, y: number) => void) {

        for (let y = 0, ly = height; y < ly; ++y) {

            for (let x = 0, lx = width; x < lx; ++x) {

                each(x, y);
            }
        }
    }

    public static eachTile9(
        tx: number,
        ty: number,
        width: number,
        height: number,
        each: (x: number, y: number, ox: number, oy: number, otx: number, oty: number) => void) {

        for (let y = -1, ly = 1; y <= ly; ++y) {

            const oy = ty + y

            if (oy < 0 || oy >= height) continue;

            for (let x = - 1, lx = 1; x <= lx; ++x) {

                const ox = tx + x;

                if (ox < 0 || ox >= width) continue;

                const otx = ox * 2;
                const oty = oy * 2;

                each(x, y, ox, oy, otx, oty);
            }
        }
    }

    public static checkTileFlag(
        tx: number,
        ty: number,
        width: number,
        height: number,
        checkFlag: (x: number, y: number, ox: number, oy: number, otx: number, oty: number) => boolean) {

        const data = new TileFlagData();

        TileMapUtil.eachTile9(tx, ty, width, height, (x, y, ox, oy, otx, oty) => {

            const isDiff = checkFlag(x, y, ox, oy, otx, oty);

            switch (y) {

                case -1:

                    switch (x) {

                        case -1: data.is1Flag = isDiff; break;
                        case 0: data.is2Flag = isDiff; break;
                        case 1: data.is3Flag = isDiff; break;
                    }

                    break;

                case 0:

                    switch (x) {

                        case -1: data.is4Flag = isDiff; break;
                        case 0: break;
                        case 1: data.is6Flag = isDiff; break;
                    }

                    break;

                case 1:

                    switch (x) {

                        case -1: data.is7Flag = isDiff; break;
                        case 0: data.is8Flag = isDiff; break;
                        case 1: data.is9Flag = isDiff; break;
                    }

                    break;
            }
        });

        return data;
    }

    public static checkDirectionSame(
        tx: number,
        ty: number,
        width: number,
        height: number,
        direction: Direction16,
        checkSame?: (x: number, y: number, ox: number, oy: number, otx: number, oty: number) => boolean) {

        const data = new TileFlagData();

        switch (direction) {

            case Direction16.up:

                data.is2Flag = true;
                break;

            case Direction16.down:

                data.is8Flag = true;
                break;

            case Direction16.left:

                data.is4Flag = true;
                break;

            case Direction16.right:

                data.is6Flag = true;
                break;

            case Direction16.upDown:

                data.is2Flag = true;
                data.is8Flag = true;

                if (checkSame) {

                    TileMapUtil.eachTile9(tx, ty, width, height, (x, y, ox, oy, otx, oty) => {

                        switch (y) {

                            case -1:

                                switch (x) {

                                    case 0: data.is2Flag = checkSame(x, y, ox, oy, otx, oty); break;
                                }

                                break;

                            case 1:

                                switch (x) {

                                    case 0: data.is8Flag = checkSame(x, y, ox, oy, otx, oty); break;
                                }

                                break;
                        }
                    });
                }

                break;

            case Direction16.leftRight:

                data.is4Flag = true;
                data.is6Flag = true;

                if (checkSame) {

                    TileMapUtil.eachTile9(tx, ty, width, height, (x, y, ox, oy, otx, oty) => {

                        switch (y) {

                            case 0:

                                switch (x) {

                                    case -1: data.is4Flag = checkSame(x, y, ox, oy, otx, oty); break;
                                    case 1: data.is6Flag = checkSame(x, y, ox, oy, otx, oty); break;
                                }

                                break;

                        }
                    });
                }

                break;

            case Direction16.leftUp:

                data.is2Flag = true;
                data.is4Flag = true;
                break;

            case Direction16.leftDown:

                data.is4Flag = true;
                data.is8Flag = true;
                break;

            case Direction16.rightUp:

                data.is2Flag = true;
                data.is6Flag = true;
                break;

            case Direction16.rightDown:

                data.is6Flag = true;
                data.is8Flag = true;
                break;

            case Direction16.leftRightUp:

                data.is2Flag = true;
                data.is4Flag = true;
                data.is6Flag = true;
                break;

            case Direction16.leftRightDown:

                data.is4Flag = true;
                data.is6Flag = true;
                data.is8Flag = true;
                break;

            case Direction16.upDownLeft:

                data.is2Flag = true;
                data.is4Flag = true;
                data.is8Flag = true;
                break;

            case Direction16.upDownRight:

                data.is2Flag = true;
                data.is6Flag = true;
                data.is8Flag = true;
                break;

            case Direction16.all:

                data.is2Flag = true;
                data.is4Flag = true;
                data.is6Flag = true;
                data.is8Flag = true;
                break;
        }

        return data;
    }

    public static checkFlowDirectionSame(x: number, y: number, river: Direction16, r: Direction16) {

        let flag = false;

        switch (y) {

            case -1:

                switch (x) {

                    case 0:

                        switch (river) {

                            case Direction16.upDown:
                            case Direction16.upDownLeft:
                            case Direction16.upDownRight:
                            case Direction16.leftUp:
                            case Direction16.rightUp:
                            case Direction16.leftRightUp:
                            case Direction16.all:

                                switch (r) {

                                    case Direction16.upDown:
                                    case Direction16.upDownLeft:
                                    case Direction16.upDownRight:
                                    case Direction16.leftDown:
                                    case Direction16.rightDown:
                                    case Direction16.leftRightDown:
                                    case Direction16.all:

                                        flag = true;
                                        break;
                                }

                                break;
                        }

                        break;
                }

                break;

            case 0:

                switch (x) {

                    case -1:

                        switch (river) {

                            case Direction16.leftRight:
                            case Direction16.leftUp:
                            case Direction16.leftDown:
                            case Direction16.upDownLeft:
                            case Direction16.leftRightUp:
                            case Direction16.leftRightDown:
                            case Direction16.all:

                                switch (r) {

                                    case Direction16.leftRight:
                                    case Direction16.rightUp:
                                    case Direction16.rightDown:
                                    case Direction16.upDownRight:
                                    case Direction16.leftRightUp:
                                    case Direction16.leftRightDown:
                                    case Direction16.all:

                                        flag = true;
                                        break;
                                }

                                break;
                        }

                        break;

                    case 1:

                        switch (river) {

                            case Direction16.leftRight:
                            case Direction16.rightUp:
                            case Direction16.rightDown:
                            case Direction16.upDownRight:
                            case Direction16.leftRightUp:
                            case Direction16.leftRightDown:
                            case Direction16.all:

                                switch (r) {

                                    case Direction16.leftRight:
                                    case Direction16.leftUp:
                                    case Direction16.leftDown:
                                    case Direction16.upDownLeft:
                                    case Direction16.leftRightUp:
                                    case Direction16.leftRightDown:
                                    case Direction16.all:

                                        flag = true;
                                        break;
                                }

                                break;
                        }

                        break;
                }

                break;

            case 1:

                switch (x) {

                    case 0:

                        switch (river) {

                            case Direction16.upDown:
                            case Direction16.upDownLeft:
                            case Direction16.upDownRight:
                            case Direction16.leftRightDown:
                            case Direction16.rightDown:
                            case Direction16.leftDown:
                            case Direction16.all:

                                switch (r) {

                                    case Direction16.upDown:
                                    case Direction16.upDownLeft:
                                    case Direction16.upDownRight:
                                    case Direction16.leftUp:
                                    case Direction16.rightUp:
                                    case Direction16.leftRightUp:
                                    case Direction16.all:

                                        flag = true;
                                        break;
                                }

                                break;
                        }

                        break;
                }

                break;
        }

        return flag;
    }

    public static setAutoTileImage(data: TileFlagData, fill: TileFillData) {

        const { is1Flag, is2Flag, is3Flag, is4Flag, is6Flag, is7Flag, is8Flag, is9Flag } = data;
        const { fill1, fill2, fill3, fill4 } = fill;

        if (is2Flag && is4Flag) fill1(1, 0);
        else if (is2Flag) fill1(1, 1);
        else if (is4Flag) fill1(2, 0);
        else if (is1Flag) fill1(0, 1);
        else fill1(2, 1);

        if (is2Flag && is6Flag) fill2(1, 1);
        else if (is2Flag) fill2(1, 0);
        else if (is6Flag) fill2(2, 1);
        else if (is3Flag) fill2(0, 1);
        else fill2(2, 0);

        if (is8Flag && is4Flag) fill3(2, 0);
        else if (is8Flag) fill3(2, 1);
        else if (is4Flag) fill3(1, 0);
        else if (is7Flag) fill3(0, 1);
        else fill3(1, 1);

        if (is8Flag && is6Flag) fill4(2, 1);
        else if (is8Flag) fill4(2, 0);
        else if (is6Flag) fill4(1, 1);
        else if (is9Flag) fill4(0, 1);
        else fill4(1, 0);
    }

    public static setRiverTileImage(data: TileFlagData, fill: TileFillData) {

        const { is2Flag, is4Flag, is6Flag, is8Flag } = data;
        const { fill1, fill2, fill3, fill4 } = fill;

        if (is2Flag && is4Flag) fill1(4, 1);
        else if (is2Flag) fill1(4, 0);
        else if (is4Flag) fill1(3, 1);
        else if (is6Flag && is8Flag) fill1(3, 0);
        else if (is6Flag) fill1(2, 0);
        else if (is8Flag) fill1(2, 1);
        else fill1(0, 0);

        if (is2Flag && is6Flag) fill2(4, 0);
        else if (is2Flag) fill2(4, 1);
        else if (is6Flag) fill2(3, 0);
        else if (is4Flag && is8Flag) fill2(3, 1);
        else if (is4Flag) fill2(2, 0);
        else if (is8Flag) fill2(2, 1);
        else fill2(0, 0);

        if (is4Flag && is8Flag) fill3(3, 1);
        else if (is4Flag) fill3(4, 1);
        else if (is8Flag) fill3(3, 0);
        else if (is2Flag && is6Flag) fill3(4, 0);
        else if (is2Flag) fill3(2, 1);
        else if (is6Flag) fill3(2, 0);
        else fill3(0, 0);

        if (is6Flag && is8Flag) fill4(3, 0);
        else if (is6Flag) fill4(4, 0);
        else if (is8Flag) fill4(3, 1);
        else if (is2Flag && is4Flag) fill4(4, 1);
        else if (is2Flag) fill4(2, 1);
        else if (is4Flag) fill4(2, 0);
        else fill4(0, 0);
    }

    public static setEstuaryTileImage(data: TileFlagData, fill: TileFillData) {

        const { is2Flag, is4Flag, is6Flag, is8Flag } = data;
        const { fill1, fill2, fill3, fill4 } = fill;

        if (is2Flag && is4Flag) fill1(0, 1);
        else if (is2Flag) fill1(1, 1);
        else if (is4Flag) fill1(1, 0);
        else if (!is2Flag && !is4Flag && !is6Flag && !is8Flag) fill1(0, 0);
        else fill1(-1, -1);

        if (is2Flag && is6Flag) fill2(0, 1);
        else if (is2Flag) fill2(1, 1);
        else if (is6Flag) fill2(1, 0);
        else if (!is2Flag && !is4Flag && !is6Flag && !is8Flag) fill2(0, 0);
        else fill2(-1, -1);

        if (is4Flag && is8Flag) fill3(0, 1);
        else if (is4Flag) fill3(1, 0);
        else if (is8Flag) fill3(1, 1);
        else if (!is2Flag && !is4Flag && !is6Flag && !is8Flag) fill3(0, 0);
        else fill3(-1, -1);

        if (is6Flag && is8Flag) fill4(0, 1);
        else if (is6Flag) fill4(1, 0);
        else if (is8Flag) fill4(1, 1);
        else if (!is2Flag && !is4Flag && !is6Flag && !is8Flag) fill4(0, 0);
        else fill4(-1, -1);
    }

    public static setRoadTileImage(data: TileFlagData, fill: TileFillData) {

        const { is2Flag: is2Diff, is4Flag: is4Diff, is6Flag: is6Diff, is8Flag: is8Diff, } = data;
        const { fill1, fill2, fill3, fill4 } = fill;

        if (is2Diff && is4Diff && is6Diff && is8Diff) fill1(-1, -1);
        else if (is2Diff && is4Diff && is8Diff) fill1(2, 0);
        else if (is2Diff && is4Diff && is6Diff) fill1(2, 1);
        else if (is2Diff && is4Diff) fill1(3, 0);
        else if (is2Diff) fill1(3, 1);
        else if (is4Diff) fill1(4, 0);
        else fill1(4, 1);

        if (is2Diff && is4Diff && is6Diff && is8Diff) fill2(-1, -1);
        else if (is2Diff && is6Diff && is8Diff) fill2(2, 0);
        else if (is2Diff && is4Diff && is6Diff) fill2(2, 1);
        else if (is2Diff && is6Diff) fill2(3, 1);
        else if (is2Diff) fill2(3, 0);
        else if (is6Diff) fill2(4, 1);
        else fill2(4, 0)

        if (is2Diff && is4Diff && is6Diff && is8Diff) fill3(-1, -1);
        else if (is2Diff && is4Diff && is8Diff) fill3(2, 0);
        else if (is4Diff && is6Diff && is8Diff) fill3(2, 1);
        else if (is4Diff && is8Diff) fill3(4, 0);
        else if (is4Diff) fill3(3, 0);
        else if (is8Diff) fill3(4, 1);
        else fill3(3, 1);

        if (is2Diff && is4Diff && is6Diff && is8Diff) fill4(-1, -1);
        else if (is2Diff && is6Diff && is8Diff) fill4(2, 0);
        else if (is4Diff && is6Diff && is8Diff) fill4(2, 1);
        else if (is6Diff && is8Diff) fill4(4, 1);
        else if (is6Diff) fill4(3, 1);
        else if (is8Diff) fill4(4, 0);
        else fill4(3, 0);
    }

    public static searchTile(
        tm: TileMap,
        x: number,
        y: number,
        isSelectedTile: (tx: number, ty: number) => boolean,
        each?: (tx: number, ty: number) => void) {

        const arr = <{ [key: string]: any }>{};
        const route = <{ [key: string]: any }>{};
        const passed = <{ [key: string]: any }>{};

        const appendRoute = (x: number, y: number) => {

            const key = `${x}_${y}`;

            !passed[key] && (route[key] = 1);
        };

        appendRoute(x, y);

        while (true) {

            const keys = <string[]>Object.keys(route);

            if (!keys.length) break;

            for (const o of keys) {

                delete route[o];

                if (passed[o]) continue;

                const { x: tx, y: ty } = this.getXY(o);

                if (TileMapUtil.getIndex(tm, tx, ty) < 0) continue;

                TileMapUtil.eachTile9(tx, ty, tm.width, tm.height, (x, y, ox, oy, _otx, _oty) => {

                    const checkTile = () => {

                        passed[o] = 1;

                        if (isSelectedTile(ox, oy)) arr[o] = 1;
                        else return;

                        appendRoute(ox, oy);
                    };

                    switch (y) {

                        case -1:

                            switch (x) {

                                case 0: checkTile(); break;
                            }

                            break;

                        case 0:

                            switch (x) {

                                case -1: checkTile(); break;
                                case 0: checkTile(); break;
                                case 1: checkTile(); break;
                            }

                            break;

                        case 1:

                            switch (x) {

                                case 0: checkTile(); break;
                            }

                            break;
                    }
                });
            }
        }

        const list = Object.keys(arr).map(o => TileMapUtil.getXY(o));

        each && list.forEach(o => each(o.x, o.y));

        return list;
    }

    public static getXY(key: string): { x: number, y: number } {

        const tarr = key.split("_");

        return { x: parseInt(tarr[0]), y: parseInt(tarr[1]) };
    }
}