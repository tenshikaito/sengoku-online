<template>
  <div>
    <el-radio-group v-model="currentDrawEditStatus" @change="refreshDrawEditStatus">
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
    <el-tabs type="card" tab-position="top" style="margin-top: 20px;">
      <el-tab-pane :label="dict.autoTile">
        <div class="data-table">
          <el-radio-group v-model="currentAutoTileTypeId">
            <el-radio
              v-for="o in autoTileType"
              :key="o.id"
              :label="o.id"
              border
              @click="switchAutoTileType(o)">{{ tableIdNameFormatter(o) }}</el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="dict.tile">
        <div class="data-table">
          <el-radio-group v-model="currentTileTypeId">
            <el-radio
              v-for="o in tileType"
              :key="o.id"
              :label="o.id"
              border
              @click="switchTileType(o)">{{ tableIdNameFormatter(o) }}</el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import MapEditStatus from "@/codetypes/map-edit-status";
import AutoTileType from "@/models/auto-tile-type";
import TileType from "@/models/tile-type";
import BaseVue from "@/BaseVue";

@Options({
  props: {
    switchDrawEditStatus: Function,
    switchAutoTileType: Function,
    switchTileType: Function,
  },
})
export default class TilePanel extends BaseVue {
  public MapEditorStatus = MapEditStatus;
  public currentDrawEditStatus = MapEditStatus.view;
  public autoTileType: AutoTileType[] = [];
  public tileType: TileType[] = [];
  public currentAutoTileTypeId = -1;
  public currentTileTypeId = -1;
  public switchDrawEditStatus!: (status: MapEditStatus) => void;
  public switchAutoTileType!: (autoTileType: AutoTileType) => void;
  public switchTileType!: (tileType: TileType) => void;

  public tableIdNameFormatter(item: TileType) {
    return `${item.id}:${item.name}`;
  }

  public refreshDrawEditStatus() {
    this.switchDrawEditStatus(this.currentDrawEditStatus);
  }
}
</script>
