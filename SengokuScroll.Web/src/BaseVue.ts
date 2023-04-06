import { Vue } from 'vue-class-component';
import GameDictionary from "@/game-dictionary";
import GameConstant from "@/constants/game-constant";

export default class BaseVue extends Vue {

    public dict = GameDictionary;
    public GameConstant = GameConstant;
}