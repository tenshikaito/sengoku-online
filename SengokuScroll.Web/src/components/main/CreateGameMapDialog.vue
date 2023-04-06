<template>
  <div>
    <el-dialog :title="dict.sceneMain.createGameMap"
      v-model="isVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :ref="refCreateGameMapFormId" :model="gameMapOption" :rules="createMapRules">
        <el-form-item :label-width="formLabelWidth" :label="dict.sceneMain.mapName" prop="name">
          <el-input v-model="gameMapOption.name"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="dict.sceneMain.mapType" prop="type">
          <el-select v-model="gameMapOption.type">
            <el-option :label="dict.gameMapType.rpgmaker" :value="GameMapType.rpgmaker"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="dict.sceneMain.mapWidth" prop="width">
          <el-input v-model.number="gameMapOption.width"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="dict.sceneMain.mapHeight" prop="height">
          <el-input v-model.number="gameMapOption.height"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span>
          <el-button @click="onCancelButtonClicked()">{{ dict.cancel }}</el-button>
          <el-button type="primary" @click="onOkButtonClicked()">{{ dict.ok }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import GameConstant from "@/constants/game-constant";
import GameMapType from "@/codetypes/game-map-type";
import GameMapOption from "@/view-models/main/game-map-option-view-model";
import CommonUtil from "@/utils/common-util";
import BaseMainDialog from "./BaseMainDialog";

@Options({
  props: {
    onOkButtonClicked: Function,
    onCancelButtonClicked: Function,
  },
})
export default class CreateGameMapDialog extends BaseMainDialog {
  public GameMapType = GameMapType;
  public isVisible = false;
  public gameMapOption = new GameMapOption();
  public onOkButtonClicked!: () => void;
  public onCancelButtonClicked!: () => void;

  public refCreateGameMapFormId = "createGameMapFormId";

  public get createMapRules() {
    return {
      name: [
        { required: true, message: " " },
        {
          min: 2,
          max: 12,
          message: this.dict.sceneMain.mapNameLengthMsg,
        },
      ],
      width: [
        { required: true, message: " " },
        {
          type: "number",
          message: this.dict.msg.inputNumber,
        },
        { validator: this.checkMaxValue },
      ],
      height: [
        { required: true, message: " " },
        {
          type: "number",
          message: this.dict.msg.inputNumber,
        },
        { validator: this.checkMaxValue },
      ],
    };
  }

  public get checkMaxValue() {
    return (_rule: unknown, value: unknown, callback: (e?: Error) => void) => {
      if (Number.isInteger(value)) {
        let v = value as number;
        if (
          v < GameConstant.mapSizeMinValue ||
          v > GameConstant.mapSizeMaxValue
        ) {
          let msg = CommonUtil.format(
            this.dict.sceneMain.mapSizeMaxValueMsg,
            GameConstant.mapSizeMinValue,
            GameConstant.mapSizeMaxValue
          );
          callback(new Error(msg));
          return;
        }
      }
      callback();
    };
  }

  public init() {
    this.gameMapOption = new GameMapOption();
    
    let form = this.$refs[this.refCreateGameMapFormId] as HTMLFormElement;

    form.resetFields();
  }
}
</script>
