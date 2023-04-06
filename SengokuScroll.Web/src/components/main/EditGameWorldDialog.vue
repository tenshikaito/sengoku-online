<template>
  <div>
    <el-dialog
      :title="dict.sceneMain.editGameWorld"
      v-model="isVisible"
      :class="dialogCustomClass" 
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row>
        <el-button class="main-button" @click="onCreateButtonClicked()">{{dict.sceneMain.createGameWorld}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" @click="onSelelctButtonClicked()">{{dict.sceneMain.selectGameWorld}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" @click="onCancelButtonClicked()">{{dict.cancel}}</el-button>
      </el-row>
    </el-dialog>
    <input type="file" :accept="mapFileAcceptTypes" :ref="refCreateWorld" @change="onGameMapFileSelected" v-show="false" />
    <input type="file" :accept="worldFileAcceptTypes" :ref="refSelectWorld" @change="onGameWorldFileSelected" v-show="false" />
  </div>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import GameConstant from "@/constants/game-constant";
import BaseMainDialog from "./BaseMainDialog";

@Options({
  props: {
    onCreateButtonClicked: Function,
    onCancelButtonClicked: Function,
    onFileChanged: Function,
  },
})
export default class EditGameWorldDialog extends BaseMainDialog {
  public mapFileAcceptTypes = `.${GameConstant.masterFileExtension}`;
  public worldFileAcceptTypes = `.${GameConstant.worldFileExtension}`;
  public onCancelButtonClicked!: () => void;
  public onGameMapFileSelected!: (event: Event) => void;
  public onGameWorldFileSelected!: (event: Event) => void;

  public refCreateWorld = "create-world";
  public refSelectWorld = "select-world";

  public show() {
    this.isVisible = true;
  }

  public hide() {
    this.isVisible = false;
  }

  public onCreateButtonClicked() {
    (this.$refs[this.refCreateWorld] as HTMLInputElement).click();
  }

  public onSelelctButtonClicked() {
    (this.$refs[this.refSelectWorld] as HTMLInputElement).click();
  }
}
</script>
