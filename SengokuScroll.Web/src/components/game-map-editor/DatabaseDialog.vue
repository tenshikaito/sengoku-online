<template>
  <el-dialog
    :title="dict.sceneGameEditor.database"
    v-model="isVisible"
    :before-close="onDatabaseDialogCancelButtonClicked"
    :close-on-click-modal="false"
    top="5vh"
    @opened="onDatabaseDialogOpened()">
    <el-tabs type="card">
      <el-tab-pane :label="dict.autoTile">
        <AutoTileTypePanel :ref="refAutoTileTypePanel"/>
      </el-tab-pane>
      <el-tab-pane :label="dict.tile">
        <TileTypePanel :ref="refTileTypePanel"/>
      </el-tab-pane>
      <el-tab-pane :label="dict.terrain.text">
        <TerrainPanel :ref="refTerrainPanel"/>
      </el-tab-pane>
      <el-tab-pane :label="dict.region">
        <RegionPanel :ref="refRegionPanel"/>
      </el-tab-pane>
      <el-tab-pane :label="dict.rmImage">
        <RmImagePanel :ref="refRmImagePanel"/>
      </el-tab-pane>
    </el-tabs>
    <template v-slot:footer>
      <span>
        <el-button @click="onDatabaseDialogCancelButtonClicked()">{{ dict.cancel }}</el-button>
        <el-button type="primary" @click="onDatabaseDialogSaveButtonClicked()">{{ dict.apply }}</el-button>
        <el-button type="primary" @click="onDatabaseDialogOkButtonClicked()">{{ dict.ok }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import AutoTileTypePanel from "./database-dialog/AutoTileTypePanel.vue";
import TileTypePanel from "./database-dialog/TileTypePanel.vue";
import TerrainPanel from "./database-dialog/TerrainPanel.vue";
import RegionPanel from "./database-dialog/RegionPanel.vue";
import RmImagePanel from "./database-dialog/RmImagePanel.vue";
import BaseDialog from "../BaseDialog";
import TileMapMasterData from "@/data/tile-map-master-data";
import TileMapImage from "@/data/tile-map-image";
import GameMain from "./GameMain";
import CommonUtil from "@/utils/common-util";

@Options({
  components: {
    AutoTileTypePanel,
    TileTypePanel,
    TerrainPanel,
    RegionPanel,
    RmImagePanel,
  },
  props: {
    onDatabaseDialogOpened: Function,
    onDatabaseDialogOkButtonClicked: Function,
    onDatabaseDialogSaveButtonClicked: Function,
    onDatabaseDialogCancelButtonClicked: Function
  },
})
export default class DatabaseDialog extends BaseDialog {
  public tileMapMasterData!: TileMapMasterData;
  public tileMapImage!: TileMapImage;
  public onDatabaseDialogOpened!: () => void;
  public onDatabaseDialogOkButtonClicked!: () => void;
  public onDatabaseDialogSaveButtonClicked!: () => void;
  public onDatabaseDialogCancelButtonClicked!: () => void;

  public refAutoTileTypePanel = "autoTileTypePanel";
  public refTileTypePanel = "tileTypePanel";
  public refTerrainPanel = "terrainPanel";
  public refRegionPanel = "regionPanel";
  public refRmImagePanel = "rmImagePanel";

  public get autoTileTypePanel() {
    return this.$refs[this.refAutoTileTypePanel] as AutoTileTypePanel;
  }

  public get tileTypePanel() {
    return this.$refs[this.refTileTypePanel] as TileTypePanel;
  }

  public get terrainPanel() {
    return this.$refs[this.refTerrainPanel] as TerrainPanel;
  }

  public get regionPanel() {
    return this.$refs[this.refRegionPanel] as RegionPanel;
  }

  public get rmImagePanel() {
    return this.$refs[this.refRmImagePanel] as RmImagePanel;
  }

  public created() {
    this.hide();
  }

  public setData(
    tileMapMasterData: TileMapMasterData,
    tileMapImage: TileMapImage
  ) {
    this.tileMapMasterData = CommonUtil.copy(tileMapMasterData);
    this.tileMapImage = CommonUtil.copy(tileMapImage);
  }

  public build(game: GameMain) {
    this.autoTileTypePanel.init(game, this.tileMapImage, this.tileMapMasterData);
    this.tileTypePanel.init(game, this.tileMapImage, this.tileMapMasterData);
    this.terrainPanel.init(this.tileMapMasterData);
    this.regionPanel.init(this.tileMapMasterData);
    this.rmImagePanel.init(game, this.tileMapImage);
  }
}
</script>

<style lang="scss" scoped>
$height: calc(75vh - 62px - 54px - 60px - 41px);

:deep .el-container {
  border: 1px solid #ebeef5;
}

:deep .canvas-panel {
  margin-bottom: 18px;
  overflow: auto;
}

:deep .id-list {
  width: auto !important;
  & > .el-table {
    height: $height;
    overflow: auto;
  }
}

:deep .editor-content {
  height: calc($height + 30px);
  overflow: auto;
}

:deep .inline-item {
  margin-left: 18px;
}
</style>