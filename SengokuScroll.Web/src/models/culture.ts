import StrongholdCategory from "./stronghold-category";
import UnitCategory from "./unit-category";

export default class Culture {

    public id!: number;

    public name!: string;

    public groupId!: number;

    public introduction!: string;

    public strongholdCategory!: StrongholdCategory[];

    public unitCategory!: UnitCategory;
}