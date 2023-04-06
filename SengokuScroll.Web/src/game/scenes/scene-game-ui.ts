import "phaser";
import SceneConstant from "@/constants/scene-constant";
import SceneBase from "./scene-base";
import TileInfoPanel from "@/game/components/tile-info-panel";
import EventConstant from "@/constants/event-constant";

export default class SceneGameUI extends SceneBase {

    public tileInfoPanel!: TileInfoPanel;

    private currentScene!: string;

    public constructor() {

        super({
            key: SceneConstant.gameUI
        });
    }

    public init(data: any) {

        this.currentScene = data.key;
    }

    public create() {

        this.tileInfoPanel = new TileInfoPanel(this);

        const scene = this.scene.get(this.currentScene);

        scene.events.on(EventConstant.tileInfo, (terrain: string, region: string, object: string) => {

            this.tileInfoPanel.terrain = terrain;
            this.tileInfoPanel.region = region;
            this.tileInfoPanel.object = object;
        });
    }
}