import GameConstant from "@/constants/game-constant";

export default class InputClickComponent {

    private scene!: Phaser.Scene;
    private lastPressTime = 0;

    public onClicked?: () => void;

    private get input() {

        return this.scene.input;
    }

    public constructor(scene: Phaser.Scene) {

        this.scene = scene;

        this.input.on(Phaser.Input.Events.POINTER_MOVE, () => {

            this.lastPressTime -= GameConstant.clickInterval;
        });

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {

            this.lastPressTime = new Date().getTime();
        });

        this.input.on(Phaser.Input.Events.POINTER_UP, () => {

            const now = new Date().getTime();

            if (now - this.lastPressTime > GameConstant.clickInterval) return;

            this.onClicked && this.onClicked();
        });
    }

    public destory() {

        this.input.off(Phaser.Input.Events.POINTER_MOVE);
        this.input.off(Phaser.Input.Events.POINTER_DOWN);
        this.input.off(Phaser.Input.Events.POINTER_UP);
    }
}