<template>
  <div>
    <el-dialog
      :title="dict.sceneMain.title"
      v-model="isVisible"
      :class="dialogCustomClass" 
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row>
        <el-button class="main-button" :disabled="true" :title="dict.developing" @click="onSinglePlayerGameButtonClicked()">{{dict.sceneMain.singlePlayerGame}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" @click="onMultiplayerGameButtonClicked()">{{dict.sceneMain.multiplayerGame}}</el-button>
      </el-row>
      <el-row class="hidden-sm-and-down">
        <el-button class="main-button" :disabled="true" @click="onEditGameWorldButtonClicked()">{{dict.sceneMain.editGameWorld}}</el-button>
      </el-row>
      <el-row class="hidden-sm-and-down">
        <el-button class="main-button" @click="onEditGameMapButtonClicked()">{{dict.sceneMain.editGameMap}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" @click="onOptionButtonClicked()">{{dict.sceneMain.gameOption}}</el-button>
      </el-row>
      <el-row class="hidden-sm-and-down">
        <el-button class="main-button" @click=" onConvertImageButtonClicked()">{{dict.sceneMain.convertImage}}</el-button>
      </el-row>
      <el-row>
        <el-button class="main-button" v-if="false" @click="onTestButtonClicked()">test</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseMainDialog from "./BaseMainDialog";

@Options({
  props: {
    onSinglePlayerGameButtonClicked: Function,
    onMultiplayerGameButtonClicked: Function,
    onEditGameWorldButtonClicked: Function,
    onEditGameMapButtonClicked: Function,
    onOptionButtonClicked: Function,
    onConvertImageButtonClicked: Function,
    onTestButtonClicked: Function,
  },
})
export default class MainDialog extends BaseMainDialog {
  public onSinglePlayerGameButtonClicked!: () => void;
  public onMultiplayerGameButtonClicked!: () => void;
  public onEditGameWorldButtonClicked!: () => void;
  public onEditGameMapButtonClicked!: () => void;
  public onOptionButtonClicked!: () => void;
  public onConvertImageButtonClicked!: () => void;
  public onTestButtonClicked!: () => void;
}
</script>
