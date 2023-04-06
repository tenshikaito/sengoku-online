import Goods from "./goods";
import Materials from "./materials";

export default class Stronghold {

    public id!: number;

    public name!: string;

    public category!: number;

    public parent!: number;

    public hp!: number;

    public x!: number;

    public y!: number;

    public culture!: number;

    public religion!: number;

    public population!: number;

    public soldier!: number;

    public wounded!: number;

    public materials!: Materials;

    public agriculture!: number;

    public commerce!: number;

    public industry!: number;

    public pollTaxRate!: number;

    public agriculturalTaxRate!: number;

    public tradeTaxRate!: number;

    public tariffTaxRate!: number;

    public cost!: number;

    public labour!: number;

    public administrationEfficiency!: number;

    public publicOrder!: number;

    public popularFeelings!: number;

    public storedMoney!: number;

    public storedFood!: number;

    public storedDaily!: number;

    public storedLuxury!: number;

    public literacyRate!: number;

    public introduction!: number;

    public core!: number[];
}