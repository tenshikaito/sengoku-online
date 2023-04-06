import Direction16 from "@/codetypes/direction16";
import RiverDirection from "@/codetypes/river-direction";

export default class RiverTileData {

    public riverId!: number;

    public direction!: Direction16;

    public isEstuary!: boolean;

    public flowDirection!: RiverDirection;
}