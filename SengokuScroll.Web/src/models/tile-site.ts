import TileSiteType from "@/codetypes/tile-site-type";

export default class TileSite {

    public id!: number;

    public name!: string;

    public type!: TileSiteType;

    public x!: number;

    public y!: number;

    public introduction!: string;
}