import "phaser";
import SceneConstant from "@/constants/scene-constant";
import SceneBase from "./scene-base";

export default class SceneHome extends SceneBase {

	constructor() {

		super({
			key: SceneConstant.home
		})
	}

	create() {
		// TODO SCENE_TITLE BACKGROUND IMAGE
	}
}