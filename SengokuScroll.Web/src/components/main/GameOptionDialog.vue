<template>
  <div>
    <el-dialog
      :title="dict.sceneMain.gameOption"
      v-model="isVisible"
      :class="dialogCustomClass" 
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form ref="form" :model="gameOption">
        <el-form-item :label="dict.sceneMain.webClientBaseUrl">
          <el-input v-model="gameOption.baseUrl"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span>
          <el-button @click=" onCancelButtonClicked()">{{ dict.cancel }}</el-button>
          <el-button type="primary" @click="onOkButtonClicked()">{{ dict.ok }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import { Options } from "vue-class-component";
import GameOption from "@/view-models/main/game-option-view-model";
import BaseMainDialog from "./BaseMainDialog";

@Options({
  props: {
    onOkButtonClicked: Function,
    onCancelButtonClicked: Function,
  },
})
export default class GameOptionDialog extends BaseMainDialog {
  public gameOption = new GameOption();
  public onOkButtonClicked!: () => void;
  public onCancelButtonClicked!: () => void;
}
</script>
