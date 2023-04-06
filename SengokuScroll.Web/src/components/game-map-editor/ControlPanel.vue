<template>
    <div id="control-panel">
        <div>
            <el-button type="primary" v-show="isInit" @click="onDatabaseButtonClicked">{{dict.sceneGameEditor.database}}</el-button>
            <el-button type="primary" v-show="isInit" @click="onSaveButtonClicked">{{dict.save}}</el-button>
            <el-button type="primary" v-show="isInit" @click="onLoadButtonClicked" :disabled="!isRecordSaved">{{dict.load}}</el-button>
            <el-button type="primary" v-show="isInit" @click="onExportButtonClicked">{{dict.export}}</el-button>
            <el-button type="default" @click="onExitButtonClicked">{{dict.exit}}</el-button>
        </div>
        <div v-show="isInit" style="margin-top: 10px;">
            <el-radio-group v-model="currentTileViewStatus" @change="refreshViewStatus">
                <el-radio-button :label="MapTileViewStatus.none">{{dict.tileViewStatus.none}}</el-radio-button>
                <el-radio-button :label="MapTileViewStatus.terrain">{{dict.tileViewStatus.terrain}}</el-radio-button>
                <el-radio-button :label="MapTileViewStatus.region">{{dict.tileViewStatus.region}}</el-radio-button>
            </el-radio-group>
            <el-checkbox v-model="isShowRiverDirection" @change="refreshRiverDirectionViewStatus" style="margin-left:10px; vertical-align: bottom;">{{dict.isShowRiverDirection}}</el-checkbox>
        </div>
        <div class="edit-area" v-show="isInit">
            <el-tabs v-model="drawType" tab-position="left" @tab-click="onDrawTypeClicked">
                <el-tab-pane :name="DrawType.tile" :label="dict.sceneGameMapEditor.editMapTile">
                    <TilePanel
                        :ref="refTilePanel"
                        :switchDrawEditStatus="switchDrawEditStatus"
                        switchTerrain="switchTerrain"
                        :switchAutoTileType="switchAutoTileType"
                        :switchTileType="switchTileType"/>
                </el-tab-pane>
                <el-tab-pane :name="DrawType.region" :label="dict.sceneGameMapEditor.editMapRegion">
                    <RegionPanel
                        :ref="refRegionPanel"
                        :switchDrawEditStatus="switchDrawEditStatus"
                        :switchRegion="switchRegion"/>
                </el-tab-pane>
                <el-tab-pane :name="DrawType.river" :label="dict.sceneGameMapEditor.editMapRiver">
                    <RiverPanel
                        :ref="refRiverPanel"
                        :refreshDirectionStatus="refreshDirectionStatus"
                        :switchDrawPointEditStatus="switchDrawPointEditStatus"
                        :refreshFlowDirection="refreshFlowDirection"
                        :refreshIsEstuary="refreshIsEstuary"/>
                </el-tab-pane>
                <el-tab-pane :name="DrawType.tileSite" :label="dict.sceneGameMapEditor.editMapTileSite">
                    <TileSitePanel
                        :ref="refTileSitePanel"
                        v-model:tileMapMasterData="tileMapMasterData"
                        :switchDrawPointEditStatus="switchDrawPointEditStatus"
                        :selectTileSite="selectTileSite"
                        :editTileSite="editTileSite"/>
                </el-tab-pane>
                <el-tab-pane :name="DrawType.none" :label="dict.sceneGameMapEditor.editorNote">
                    
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import { Options } from "vue-class-component";
import BaseVue from "@/BaseVue";
import DrawType from "@/codetypes/draw-type";
import MapEditStatus from "@/codetypes/map-edit-status";
import MapTileViewStatus from "@/codetypes/map-tile-view-status";
import TileMapMasterData from "@/data/tile-map-master-data";
import TileMapImage from "@/data/tile-map-image";

import TilePanel from "./control-panel/TilePanel.vue";
import RegionPanel from "./control-panel/RegionPanel.vue";
import RiverPanel from "./control-panel/RiverPanel.vue";
import TileSitePanel from "./control-panel/TileSitePanel.vue";
import AutoTileTypeViewModel from "@/view-models/game-map-editor/auto-tile-type-view-model";
import TileTypeViewModel from "@/view-models/game-map-editor/tile-type-view-model";
import RegionViewModel from "@/view-models/game-map-editor/region-view-model";
import TileSite from "@/models/tile-site";
import GameMain from "./GameMain";
import { RiverTileSelector } from "@/game/tile-selector";
import TileMap from "@/data/tile-map";
@Options({
  components: {
    TilePanel,
    RegionPanel,
    RiverPanel,
    TileSitePanel,
  },
  props: {
    tileMapMasterData: Object,
    onDatabaseButtonClicked: Function,
    onSaveButtonClicked: Function,
    onLoadButtonClicked: Function,
    onExportButtonClicked: Function,
    onExitButtonClicked: Function,
    refreshViewStatus: Function,
    refreshRiverDirectionViewStatus: Function,
    onDrawTypeClicked: Function,
    switchDrawEditStatus: Function,
    switchDrawPointEditStatus: Function,
    switchAutoTileType: Function,
    switchTileType: Function,
    switchRegion: Function,
    refreshDirectionStatus: Function,
    refreshFlowDirection: Function,
    refreshIsEstuary: Function,
    selectTileSite: Function,
    editTileSite: Function,
  },
})
export default class ControlPanel extends BaseVue {
  public isInit = false;
  public isRecordSaved = false;
  public tileMapMasterData!: TileMapMasterData;
  public DrawType = DrawType;
  public MapTileViewStatus = MapTileViewStatus;
  public drawType = DrawType.tile;
  public currentTileViewStatus = MapTileViewStatus.none;
  public isShowRiverDirection = false;

  public currentDrawEditStatus = MapEditStatus.view;
  public currentDrawPointEditStatus = MapEditStatus.view;

  public onDatabaseButtonClicked!: () => void;
  public onSaveButtonClicked!: () => void;
  public onLoadButtonClicked!: () => void;
  public onExportButtonClicked!: () => void;
  public onExitButtonClicked!: () => void;

  public refreshViewStatus!: () => void;
  public refreshRiverDirectionViewStatus!: () => void;
  public onDrawTypeClicked!: () => void;
  public switchDrawEditStatus!: (status: MapEditStatus) => void;
  public switchDrawPointEditStatus!: (status: MapEditStatus) => void;
  public switchAutoTileType!: (autoTileType: AutoTileTypeViewModel) => void;
  public switchTileType!: (tileType: TileTypeViewModel) => void;
  public switchRegion!: (row: RegionViewModel) => void;
  public refreshDirectionStatus!: () => void;
  public refreshFlowDirection!: () => void;
  public refreshIsEstuary!: () => void;
  public selectTileSite!: (row: TileSite) => void;
  public editTileSite!: (row: TileSite) => void;

  public refTilePanel = "tilePanel";
  public refRegionPanel = "regionPanel";
  public refRiverPanel = "riverPanel";
  public refTileSitePanel = "tileSitePanel";

  public get tilePanel() {
    return this.$refs[this.refTilePanel] as TilePanel;
  }

  public get regionPanel() {
    return this.$refs[this.refRegionPanel] as RegionPanel;
  }

  public get riverPanel() {
    return this.$refs[this.refRiverPanel] as RiverPanel;
  }

  public get tileSitePanel() {
    return this.$refs[this.refTileSitePanel] as TileSitePanel;
  }

  public show() {
    this.isInit = true;
  }

  public initTileSelector(game: GameMain, tileMapImage: TileMapImage) {
    // let canvasTerrain = this.terrainPanel.canvasTerrain;
    // let canvasTile = this.terrainPanel.canvasTile;
    let canvasRiver = this.riverPanel.canvasRiver;
    let list = game.textures.list as { [key: string]: Phaser.Textures.Texture };
    // let autoTile = list[
    //   game.mainScene.tileMapComponent.autoTileKey
    // ] as Phaser.Textures.Texture;
    // let tile = list[
    //   game.mainScene.tileMapComponent.tileKey
    // ] as Phaser.Textures.Texture;
    let river = list[
      game.mainScene.tileMapComponent.riverKey
    ] as Phaser.Textures.Texture;
    // let terrainSelector = new TileSelectorManager(
    //   tileMapImage,
    //   canvasTerrain,
    //   canvasTile,
    //   autoTile.source[0].image as HTMLImageElement,
    //   tile.source[0].image as HTMLImageElement
    // );
    // terrainSelector.onTileSelected = (isAutoTile, tileId) =>
    //   game.mainScene.setDrawTile(TileDrawType.tile, isAutoTile, tileId);
    // terrainSelector.init();
    let riverSelector = new RiverTileSelector(
      tileMapImage,
      canvasRiver,
      river.source[0].image as HTMLImageElement
    );
    riverSelector.onTileSelected = (tileId) =>
      game.mainScene.setDrawRiver(tileId);
    riverSelector.init();
  }

  public refreshTileSiteList(tileMap: TileMap) {
    this.tileSitePanel.tileSiteList = Object.values(tileMap.site);
  }
}
</script>

<style lang="scss" scoped>
:deep .edit-area {
  overflow: auto;
  margin-top: 20px;
}

:deep .data-table {
  width: 100%;
  overflow: auto;
  max-height: 360px;
}
</style>