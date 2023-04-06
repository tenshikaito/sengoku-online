<template>
  <div>
    <el-dialog :title="dict.sceneMain.multiplayerGame"
      v-model="isVisible"
      :class="dialogCustomClass" 
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
        <el-row>
          <el-col :span="18">
            <el-table>
              
            </el-table>
          </el-col>
          <el-col :span="6">
            <div>
              <el-button></el-button>
            </div>
            <div>
              <el-button></el-button>
            </div>
            <div>
              <el-button></el-button>
            </div>
          </el-col>
        </el-row>
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
import BaseMainDialog from "./BaseMainDialog";

@Options({
  props: {
    onOkButtonClicked: Function,
    onCancelButtonClicked: Function,
  },
})
export default class MultiplayerGameDialog extends BaseMainDialog {
  public onOkButtonClicked!: () => void;
  public onCancelButtonClicked!: () => void;
}
</script>
