<template>
  <el-container id="root">
    <el-aside>
      <el-scrollbar>
        <ControlPanel
          :ref="refControlPanel"
          :onDatabaseButtonClicked="onDatabaseButtonClicked"
          :onSaveButtonClicked="onSaveButtonClicked"
          :onLoadButtonClicked="onLoadButtonClicked"
          :onExportButtonClicked="onExportButtonClicked"
          :onExitButtonClicked="onExitButtonClicked"
          :refreshViewStatus="refreshViewStatus"
          :refreshRiverDirectionViewStatus="refreshRiverDirectionViewStatus"
          :onDrawTypeClicked="onDrawTypeClicked"
          :switchDrawEditStatus="switchDrawEditStatus"
          :switchDrawPointEditStatus="switchDrawPointEditStatus"
          :switchAutoTileType="switchAutoTileType"
          :switchTileType="switchTileType"
          :switchRegion="switchRegion"
          :refreshDirectionStatus="refreshDirectionStatus"
          :refreshFlowDirection="refreshFlowDirection"
          :refreshIsEstuary="refreshIsEstuary"
          :selectTileSite="selectTileSite"
          :editTileSite="editTileSite"/>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <canvas id="game" :ref="refGameCanvas"></canvas>
    </el-container>
  </el-container>
  <DatabaseDialog
    :ref="refDatabaseDialog"
    :onDatabaseDialogOpened="onDatabaseDialogOpened"
    :onDatabaseDialogOkButtonClicked="onDatabaseDialogOkButtonClicked"
    :onDatabaseDialogSaveButtonClicked="onDatabaseDialogSaveButtonClicked"
    :onDatabaseDialogCancelButtonClicked="onDatabaseDialogCancelButtonClicked"/>
  <TileSiteDialog
    :ref="refTileSiteDialog"
    :onTileSiteDialogCreateButtonClicked="onTileSiteDialogCreateButtonClicked"
    :onTileSiteDialogEditButtonClicked="onTileSiteDialogEditButtonClicked"
    :onTileSiteDialogDeleteButtonClicked="onTileSiteDialogDeleteButtonClicked"
    :onTileSiteDialogCancelButtonClicked="onTileSiteDialogCancelButtonClicked"/>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import { ElMessageBox } from "element-plus";
import Direction16 from "@/codetypes/direction16";
import MapTileViewStatus from "@/codetypes/map-tile-view-status";
import MapEditStatus from "@/codetypes/map-edit-status";
import RiverDirection from "@/codetypes/river-direction";
import TileSiteType from "@/codetypes/tile-site-type";
import BaseVue from "@/BaseVue";
import DrawType from "@/codetypes/draw-type";
import RouterConstant from "@/constants/router-constant";
import CacheConstant from "@/constants/cache-constant";
import UIEventConstant from "@/constants/ui-event-constant";
import GameMain from "@/components/game-map-editor/GameMain";
import ControlPanel from "@/components/game-map-editor/ControlPanel.vue";
import DatabaseDialog from "@/components/game-map-editor/DatabaseDialog.vue";
import TileSiteDialog from "@/components/game-map-editor/TileSiteDialog.vue";
import TileMap from "@/data/tile-map";
import TileMapImage from "@/data/tile-map-image";
import TileMapMasterData from "@/data/tile-map-master-data";
import GameWorldMasterData from "@/data/game-world-master-data";
import TileSite from "@/models/tile-site";
import AutoTileTypeViewModel from "@/view-models/game-map-editor/auto-tile-type-view-model";
import TileTypeViewModel from "@/view-models/game-map-editor/tile-type-view-model";
import TerrainViewModel from "@/view-models/game-map-editor/terrain-view-model";
import RegionViewModel from "@/view-models/game-map-editor/region-view-model";
import CommonUtil from "@/utils/common-util";
import StorageUtil from "@/utils/storage-util";
import GameDataUtil from "@/utils/game-data-util";

@Options({
  components: {
    ControlPanel,
    DatabaseDialog,
    TileSiteDialog,
  },
})
export default class GameMapEditorView extends BaseVue {
  private game!: GameMain;

  public DrawType = DrawType;
  public MapEditorStatus = MapEditStatus;
  public MapTileViewStatus = MapTileViewStatus;
  public Direction16 = Direction16;
  public RiverDirection = RiverDirection;
  public TileSiteType = TileSiteType;
  public isTileSiteCreate = true;

  private recordKey = "map-record";
  private isInit = false;

  public refGameCanvas = "gameCanvas";
  public refControlPanel = "controlPanel";
  public refDatabaseDialog = "databaseDialog";
  public refTileSiteDialog = "tileSiteDialog";

  public gameWorldMasterData!: GameWorldMasterData;

  public getTileMap(): TileMap {
    return this.gameWorldMasterData.tileMap;
  }
  public getTileMapImage(): TileMapImage {
    return this.gameWorldMasterData.tileMapImage;
  }

  public getTileMapMasterData(): TileMapMasterData {
    return this.gameWorldMasterData.tileMapMasterData;
  }

  public get gameScene() {
    return this.game.mainScene;
  }

  public get controlPanel() {
    return this.$refs[this.refControlPanel] as ControlPanel;
  }

  public get gameCanvas() {
    return this.$refs[this.refGameCanvas] as HTMLCanvasElement;
  }

  public get databaseDialog() {
    return this.$refs[this.refDatabaseDialog] as DatabaseDialog;
  }

  public get tileSiteDialog() {
    return this.$refs[this.refTileSiteDialog] as TileSiteDialog;
  }

  public get drawType() {
    return this.controlPanel.drawType;
  }

  public get currentDrawEditStatus() {
    return this.controlPanel.tilePanel.currentDrawEditStatus;
  }

  public set currentDrawEditStatus(value: MapEditStatus) {
    this.controlPanel.tilePanel.currentDrawEditStatus = value;
    this.controlPanel.regionPanel.currentDrawEditStatus = value;
  }

  public get currentDrawPointEditStatus() {
    return this.controlPanel.riverPanel.currentDrawPointEditStatus;
  }

  public set currentDrawPointEditStatus(value: MapEditStatus) {
    this.controlPanel.riverPanel.currentDrawPointEditStatus = value;
    this.controlPanel.tileSitePanel.currentDrawPointEditStatus = value;
  }

  public get currentTileViewStatus() {
    return this.controlPanel.currentTileViewStatus;
  }

  public set currentTileViewStatus(value: MapTileViewStatus) {
    this.controlPanel.currentTileViewStatus = value;
  }

  public get currentRiverDirection() {
    return this.controlPanel.riverPanel.currentRiverDirection;
  }

  public set currentRiverDirection(value: Direction16) {
    this.controlPanel.riverPanel.currentRiverDirection = value;
  }

  public get currentEstuaryDirection() {
    return this.controlPanel.riverPanel.currentEstuaryDirection;
  }

  public set currentEstuaryDirection(value: Direction16) {
    this.controlPanel.riverPanel.currentEstuaryDirection = value;
  }

  public get isShowRiverDirection() {
    return this.controlPanel.isShowRiverDirection;
  }

  public set isShowRiverDirection(value: boolean) {
    this.controlPanel.isShowRiverDirection = value;
  }

  public get currentIsEstuary() {
    return this.controlPanel.riverPanel.currentIsEstuary;
  }

  public set currentIsEstuary(value: string) {
    this.controlPanel.riverPanel.currentIsEstuary = value;
  }

  public get currentFlowDirection() {
    return this.controlPanel.riverPanel.currentFlowDirection;
  }

  public set currentFlowDirection(value: RiverDirection) {
    this.controlPanel.riverPanel.currentFlowDirection = value;
  }

  public beforeCreate() {
    try {
      let gwmd = StorageUtil.getSessionValue<GameWorldMasterData>(
        CacheConstant.gameWorldMasterData
      );

      if (!gwmd) throw new Error();

      this.gameWorldMasterData = gwmd;

      this.isInit = true;
    } catch (e) {
      this.$router.replace({
        name: RouterConstant.main,
      });
    }
  }

  public mounted() {
    if (!this.isInit) return;

    this.refreshControlPanel();

    this.$nextTick(() => {
      const canvas = this.gameCanvas;

      canvas.width = canvas.parentElement?.clientWidth || canvas.width;
      canvas.height = document.body.clientHeight || canvas.height;

      this.game = new GameMain(this.gameCanvas);

      GameDataUtil.setGameWorldMasterData(this.game, this.gameWorldMasterData);

      this.game.events.on(
        UIEventConstant.switchGameDrawEditStatus,
        (status: MapEditStatus) => this.switchDrawEditStatus(status)
      );
      this.game.events.on(
        UIEventConstant.switchGameDrawPointEditStatus,
        (status: MapEditStatus) => this.switchDrawPointEditStatus(status)
      );
      this.game.events.on(
        UIEventConstant.createTileSite,
        (x: number, y: number, index: number) =>
          this.createTileSite(x, y, index)
      );
      this.game.events.on(UIEventConstant.editTileSite, (ts: TileSite) =>
        this.editTileSite(ts)
      );

      this.game.events.once(UIEventConstant.resourceLoaded, () => {
        this.controlPanel.show();

        this.$nextTick(() => {
          this.switchDrawEditStatus(MapEditStatus.view);
          this.switchDrawPointEditStatus(MapEditStatus.view);
          this.refreshDirectionStatus();
          this.refreshIsEstuary();
          this.refreshFlowDirection();
          this.refreshRiverDirectionViewStatus();

          this.initTileSelector();
          this.refreshTileSiteList();
        });
      });
      this.game.events.once(UIEventConstant.resourceLoadError, () => {
        setTimeout(() => {
          this.$router.replace({
            name: RouterConstant.main,
          });
        }, 3000);
      });
    });
  }

  public beforeUnmount() {
    this.game?.destroy(false);
  }

  public refreshControlPanel() {
    const cp = this.controlPanel;

    cp.tilePanel.autoTileType = this.getTileMapMasterData().autoTileType;
    cp.tilePanel.tileType = this.getTileMapMasterData().tileType;
    cp.regionPanel.list = this.getTileMapMasterData().region;
  }

  public onDrawTypeClicked() {
    this.$nextTick(() => this.gameScene.switchDrawType(this.drawType));
  }

  public switchDrawEditStatus(status: MapEditStatus) {
    this.currentDrawEditStatus = status;

    this.gameScene.switchDrawEditStatus(this.currentDrawEditStatus);
  }

  public switchDrawPointEditStatus(status: MapEditStatus) {
    this.currentDrawPointEditStatus = status;

    this.gameScene.switchDrawPointEditStatus(this.currentDrawPointEditStatus);
  }

  public refreshViewStatus() {
    this.$nextTick(() =>
      this.gameScene.switchTileViewStatus(this.currentTileViewStatus)
    );
  }

  public refreshRiverDirectionViewStatus() {
    this.$nextTick(() =>
      this.gameScene.switchRiverDirectionViewStatus(this.isShowRiverDirection)
    );
  }

  public refreshDrawEditStatus() {
    this.$nextTick(() => {
      this.gameScene.switchDrawEditStatus(this.currentDrawEditStatus);
      this.gameScene.switchDrawPointEditStatus(this.currentDrawPointEditStatus);
    });
  }

  public refreshDirectionStatus() {
    this.$nextTick(() =>
      this.gameScene.setDirection16(
        this.currentRiverDirection,
        this.currentEstuaryDirection
      )
    );
  }

  public refreshIsEstuary() {
    this.$nextTick(() =>
      this.gameScene.setIsEstuary(this.currentIsEstuary == "yes")
    );
  }

  public refreshFlowDirection() {
    this.$nextTick(() =>
      this.gameScene.setFlowDirection(this.currentFlowDirection)
    );
  }

  public switchAutoTileType(autoTileType: AutoTileTypeViewModel) {
    if (autoTileType?.id === undefined) return;

    this.gameScene.setDrawTileType(true, autoTileType.id);
  }

  public switchTileType(tileType: TileTypeViewModel) {
    if (tileType?.id === undefined) return;

    this.gameScene.setDrawTileType(false, tileType.id);
  }

  public switchRegion(region: RegionViewModel) {
    if (region?.id === undefined) return;

    this.gameScene.setDrawRegion(region.id as number);
  }

  public terrainTableIdNameFormatter(row: TerrainViewModel) {
    return `${row.id}:${row.name}`;
  }

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

  public selectTileSite(row: TileSite) {
    this.gameScene.locateTile(row.x, row.y);
  }

  public editSelectedTileSite(row: TileSite) {
    this.editTileSite(row);
  }

  private saveDatabase() {
    this.mergeData();

    const dd = this.databaseDialog;
    const attp = dd.autoTileTypePanel;
    const ttp = dd.tileTypePanel;
    const tp = dd.terrainPanel;
    const rp = dd.regionPanel;

    if (attp.listLengthChangedResult < 0) this.refreshAutoTileType();
    if (ttp.listLengthChangedResult < 0) this.refreshTileType();
    if (tp.listLengthChangedResult < 0) this.refreshTerrian();
    if (rp.listLengthChangedResult < 0) this.refreshRegion();

    const tmmd = this.getTileMapMasterData();

    tmmd.autoTileType = CommonUtil.copy(attp.list);
    tmmd.tileType = CommonUtil.copy(ttp.list);
    tmmd.terrain = CommonUtil.copy(tp.list);
    tmmd.region = CommonUtil.copy(rp.list);

    GameDataUtil.setGameWorldMasterData(this.game, this.gameWorldMasterData);

    this.refreshControlPanel();
  }

  private mergeData() {
    return;
  }

  public refreshAutoTileType() {
    let list = this.getTileMapMasterData().autoTileType;

    let t = this.getTileMap().autoTileType;

    t.forEach((o, i) => {
      if (!list.some((oo) => oo.id == o)) t[i] = 0;
    });
  }

  public refreshTileType() {
    let list = this.getTileMapMasterData().autoTileType;

    let t = this.getTileMap().tileType;

    for (let i in t) {
      if (!list.some((oo) => oo.id == t[i])) delete t[i];
    }
  }

  public refreshTerrian() {
    let list = this.getTileMapMasterData().terrain;

    let t = this.getTileMap().terrain;

    t.forEach((o, i) => {
      if (!list.some((oo) => oo.id == o)) t[i] = 0;
    });
  }

  public refreshRegion() {
    let list = this.getTileMapMasterData().region;

    let t = this.getTileMap().region;

    t.forEach((o, i) => {
      if (!list.some((oo) => oo.id == o)) t[i] = 0;
    });
  }

  public initTileSelector() {
    this.$nextTick(() => {
      this.controlPanel.initTileSelector(this.game, this.getTileMapImage());
    });
  }

  public onDatabaseButtonClicked() {
    this.databaseDialog.show();
  }

  public onSaveButtonClicked() {
    this.mergeData();

    StorageUtil.setSessionValue(this.recordKey, this.gameWorldMasterData);

    this.controlPanel.isRecordSaved = true;

    CommonUtil.success(this.dict.msg.dataSaved);
  }

  public onLoadButtonClicked() {
    let data = StorageUtil.getSessionValue<GameWorldMasterData>(this.recordKey);

    if (!data) return;

    CommonUtil.setValues(data, this.gameWorldMasterData);

    this.refreshControlPanel();

    this.game.events.emit(UIEventConstant.initMap);

    CommonUtil.success(this.dict.msg.dataLoaded);
  }

  public onExportButtonClicked() {
    this.mergeData();

    CommonUtil.downloadJson(
      this.gameWorldMasterData,
      `${this.gameWorldMasterData.name}.${this.GameConstant.masterFileExtension}`
    );
  }

  public onExitButtonClicked() {
    this.$router.replace({
      name: RouterConstant.main,
    });
  }

  public onDatabaseDialogOpened() {
    this.databaseDialog.setData(this.getTileMapMasterData(), this.getTileMapImage());

    this.$nextTick(() => this.databaseDialog.build(this.game));
  }

  public onDatabaseDialogOkButtonClicked() {
    this.saveDatabase();

    this.databaseDialog.hide();
  }

  public onDatabaseDialogSaveButtonClicked() {
    this.saveDatabase();

    CommonUtil.success(this.dict.msg.dataSaved);
  }

  public onDatabaseDialogCancelButtonClicked() {
    this.databaseDialog.hide();
  }

  public createTileSite(x: number, y: number, index: number) {
    this.tileSiteDialog.create(x, y, index);
  }

  public editTileSite(ts: TileSite) {
    this.tileSiteDialog.editTileSite(ts);
  }

  public onTileSiteDialogCreateButtonClicked() {
    this.tileSiteDialog.hide();

    this.gameScene.createTileSite({
      ...this.tileSiteDialog.tileSite,
    } as TileSite);

    this.refreshTileSiteList();
  }

  public onTileSiteDialogEditButtonClicked() {
    this.tileSiteDialog.hide();

    this.gameScene.editTileSite({
      ...this.tileSiteDialog.tileSite,
    } as TileSite);

    this.refreshTileSiteList();
  }

  public async onTileSiteDialogDeleteButtonClicked() {
    try {
      await ElMessageBox.confirm(
        this.dict.sceneGameMapEditor.confirmDeleteTileSiteMsg,
        this.dict.confirm,
        {
          confirmButtonText: this.dict.ok,
          cancelButtonText: this.dict.cancel,
          type: "warning",
        }
      );
    } catch {
      return;
    }

    this.tileSiteDialog.hide();

    this.gameScene.deleteTileSite({
      ...this.tileSiteDialog.tileSite,
    } as TileSite);

    setTimeout(() => this.refreshTileSiteList(), 100);
  }

  private refreshTileSiteList() {
    this.controlPanel.refreshTileSiteList(this.getTileMap());
  }

  public onTileSiteDialogCancelButtonClicked() {
    this.tileSiteDialog.hide();
  }
}
</script>

<style lang="scss" scoped>
#root {
  & aside {
    width: 33%;
    padding: 20px;
  }
}

:deep .canvas-panel {
  overflow: auto;
}
</style>