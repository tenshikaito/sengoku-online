import Materials from "./materials";

export default class Unit {

    public id!: number;

    public name!: string;

    public category!: number;

    public x!: number;

    public y!: number;

    public member!: number;

    public commander!: number;

    public stronghold!: number;

    public materials!: Materials;

    public isNavy!: boolean;

    public training!: number;

    public morale!: number;

    public fatigue!: number;
}