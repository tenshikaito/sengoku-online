<template>
  <div>
    <el-radio-group v-model="currentDrawEditStatus" @change="refreshDrawEditStatus()">
      <el-radio-button :title="dict.sceneGameEditor.hotkeyView" :label="MapEditorStatus.view">
        <el-icon><Rank /></el-icon>
      </el-radio-button>
      <el-radio-button :title="dict.sceneGameEditor.hotkeyPoint" :label="MapEditorStatus.point">
        <el-icon><Edit /></el-icon>
      </el-radio-button>
      <el-radio-button :title="dict.sceneGameMapEditor.hotkeyRectangle" :label="MapEditorStatus.rectangle">
        <el-icon><Crop /></el-icon>
      </el-radio-button>
      <el-radio-button :title="dict.sceneGameMapEditor.hotkeyFill" :label="MapEditorStatus.fill">
        <el-icon><Brush /></el-icon>
      </el-radio-button>
    </el-radio-group>
    <div class="data-table">
      <el-table
        :data="list"
        :stripe="true"
        :show-header="false"
        highlight-current-row
        @current-change="switchRegion">
        <el-table-column property="id" :formatter="regionTableIdNameFormatter"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import MapEditStatus from "@/codetypes/map-edit-status";
import RegionViewModel from "@/view-models/game-map-editor/region-view-model";
import BaseVue from "@/BaseVue";
import Region from "@/models/region";

@Options({
  props: {
    tileMapMasterData: Object,
    switchDrawEditStatus: Function,
    switchRegion: Function,
  },
})
export default class RegionPanel extends BaseVue {
  public MapEditorStatus = MapEditStatus;
  public currentDrawEditStatus = MapEditStatus.view;
  public list: Region[] = [];
  public switchDrawEditStatus!: (status: MapEditStatus) => void;
  public switchRegion!: (region: RegionViewModel) => void;

  public regionTableIdNameFormatter(row: RegionViewModel) {
    return `${row.id}:${row.name}`;
  }

  public refreshDrawEditStatus() {
    this.$nextTick(() => this.switchDrawEditStatus(this.currentDrawEditStatus));
  }
}
</script>
