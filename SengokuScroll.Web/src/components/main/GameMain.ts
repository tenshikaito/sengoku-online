import { Game } from "phaser";
import SceneHome from "@/game/scenes/scene-home";

export default class GameMain extends Game {

    public constructor(canvas?: HTMLCanvasElement) {

        const body = document.body;

        const config = {

            type: canvas ? Phaser.WEBGL : Phaser.AUTO,
            width: Math.min(window.innerWidth, body.clientWidth),
            height: Math.max(window.innerHeight, body.clientHeight),
            canvas: canvas,
            scene: [SceneHome]
        };

        super(config);

        window.onresize = () => {

            const canvas = this.canvas;
            const body = document.body;

            canvas.width = Math.min(window.innerWidth, body.clientWidth);
            canvas.height = Math.max(window.innerHeight, body.clientHeight);
        };
    }
}