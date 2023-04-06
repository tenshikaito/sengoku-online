import UnitType from "@/codetypes/unit-type";

export default class UnitCategory {

    public id!: number;

    public name!: string;

    public image!: string;

    public type!: UnitType;

    public member!: number;

    public attack!: number;

    public shoot!: number;

    public construct!: number;

    public damage!: number;

    public defense!: number;

    public armor!: number;

    public speed!: number;

    public capacity!: number;

    public labour!: number;

    public buildTime!: number;

    public cost!: number;

    public maintenance!: number;

    public introduction!: string;
}