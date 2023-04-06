import CommonUtil from "@/utils/common-util";
import "phaser";

export default class SceneBase extends Phaser.Scene {

    protected get textStyle() {

        return CommonUtil.getTextStyle();
    }

    protected get textShadow() {

        return CommonUtil.getTextShadow();
    }
}