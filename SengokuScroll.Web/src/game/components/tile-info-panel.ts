import CommonUtil from "@/utils/common-util";

export default class TileInfoPanel {

    private scene: Phaser.Scene;
    private width = 480;
    private height = 60;
    private alpha = 0.5;
    private offset = 50;
    private textMargin = 135;

    private lbTerrain: Phaser.GameObjects.Text;
    private lbRegion: Phaser.GameObjects.Text;
    private lbObject: Phaser.GameObjects.Text;

    private get add() {

        return this.scene.add;
    }

    public set terrain(value: string) {

        this.lbTerrain.text = value;
    }

    public set region(value: string) {

        this.lbRegion.text = value;
    }

    public set object(value: string) {

        this.lbObject.text = value;
    }

    public constructor(scene: Phaser.Scene) {

        this.scene = scene;

        const bg = this.add.graphics();

        const x = this.offset;
        let y = scene.game.canvas.height - this.offset - this.height;

        bg.fillStyle(0x000000, this.alpha);
        bg.fillRect(x, y, this.width, this.height);

        const style = CommonUtil.getTextStyle();

        y = y + 20;
        const offset = 30;

        this.lbTerrain = this.add.text(x + offset, y, "", style);
        this.lbRegion = this.add.text(x + offset + this.textMargin, y, "", style);
        this.lbObject = this.add.text(x + offset + (this.textMargin * 2), y, "", style);
    }
}