<template>
  <div>
    <el-dialog
      :title="dict.sceneMain.editGameMap"
      v-model="isVisible"
      :class="dialogCustomClass" 
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row>
        <el-button class="main-button" @click="onCreateButtonClicked()">{{dict.sceneMain.createGameMap}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" @click="onSelelctButtonClicked()">{{dict.sceneMain.selectGameMap}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" @click="onCancelButtonClicked()">{{dict.cancel}}</el-button>
      </el-row>
    </el-dialog>
    <input type="file" :accept="mapFileAcceptTypes" :ref="refSelectMap" @change="onFileSelected" v-show="false" />
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
    onFileSelected: Function,
  },
})
export default class EditGameMapDialog extends BaseMainDialog {
  public mapFileAcceptTypes = `.${GameConstant.masterFileExtension}`;
  public onCreateButtonClicked!: () => void;
  public onCancelButtonClicked!: () => void;
  public onFileSelected!: (event: Event) => void;

  public refSelectMap = "select-map";

  public onSelelctButtonClicked() {
    (this.$refs[this.refSelectMap] as HTMLInputElement).click();
  }
}
</script>
