<template>
  <div>
    <el-radio-group v-model="currentDrawPointEditStatus" @change="refreshDrawPointEditStatus()" style="margin: 10px;">
      <el-radio-button :title="dict.sceneGameEditor.hotkeyView" :label="MapEditorStatus.view">
        <el-icon><Rank /></el-icon>
      </el-radio-button>
      <el-radio-button :title="dict.sceneGameEditor.hotkeyPoint" :label="MapEditorStatus.point">
        <el-icon><Edit /></el-icon>
      </el-radio-button>
    </el-radio-group>
    <div>
      <el-table
        :data="tileSiteList"
        :stripe="true"
        :show-header="false"
        highlight-current-row
        @row-click="selectTileSite"
        @row-dblclick="editTileSite">
        <el-table-column property="name"></el-table-column>
        <el-table-column property="type" :formatter="tileSiteTableTypeFormatter"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Options } from "vue-class-component";
import MapEditStatus from "@/codetypes/map-edit-status";
import TileSiteType from "@/codetypes/tile-site-type";
import TileSite from "@/models/tile-site";
import BaseVue from "@/BaseVue";
import TileMap from "@/data/tile-map";

@Options({
  props: {
    switchDrawPointEditStatus: Function,
    selectTileSite: Function,
    editTileSite: Function,
  },
})
export default class TileSitePanel extends BaseVue {
  public MapEditorStatus = MapEditStatus;
  public currentDrawPointEditStatus = MapEditStatus.view;
  public tileSiteList = [] as TileSite[];
  public switchDrawPointEditStatus!: (status: MapEditStatus) => void;
  public selectTileSite!: (row: TileSite) => void;
  public editTileSite!: (row: TileSite) => void;

  public tileSiteTableTypeFormatter(row: TileSite) {
    switch (row.type) {
      case TileSiteType.stronghold:
        return this.dict.tileSiteType.stronghold;
      case TileSiteType.battlefield:
        return this.dict.tileSiteType.battlefield;
      default:
        return null;
    }
  }

  public refreshDrawPointEditStatus() {
    this.$nextTick(() =>
      this.switchDrawPointEditStatus(this.currentDrawPointEditStatus)
    );
  }
}
</script>
