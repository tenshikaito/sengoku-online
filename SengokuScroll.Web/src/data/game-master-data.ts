import Armor from "@/models/armor";
import Character from "@/models/character";
import Culture from "@/models/culture";
import Goods from "@/models/goods";
import Item from "@/models/item";
import Religion from "@/models/religion";
import Vehicle from "@/models/vehicle";
import Weapon from "@/models/weapon";

export default class GameMasterData {

    public culture!: Culture[];

    public religion!: Religion[];

    public character!: Character[];

    public weapon!: Weapon[];

    public armor!: Armor[];

    public vehicle!: Vehicle[];

    public item!: Item[];

    public goods!: Goods[];
}