<template>
  <div>
    <el-container>
      <el-aside class="id-list">
        <el-table
            :data="list"
            :stripe="true"
            :show-header="false"
            highlight-current-row
            @current-change="selectItem">
            <el-table-column property="id" :formatter="tableIdNameFormatter"></el-table-column>
        </el-table>
        <el-input-number
            v-model="viewModel.idListLength"
            controls-position="right"
            :min="1"
            :max="GameConstant.tileTypeMaxCount">
        </el-input-number>
        <el-button @click="changeListCount()">{{dict.ok}}</el-button>
      </el-aside>
      <el-container>
        <el-main class="editor-content">
          <el-form :model="viewModel" label-width="80px">
            <el-container class="canvas-panel">
              <canvas ref="editor-canvas"></canvas>
            </el-container>
            <el-form-item :label="dict.sceneGameMapEditor.tileClimateView">
              <el-radio-group v-model="tileClimate" :disabled="viewModel.id === undefined" @change="refreshItem">
                <el-radio :label="TileClimate.normal">{{ dict.sceneGameMapEditor.normalClimate }}</el-radio>
                <el-radio :label="TileClimate.warm">{{ dict.sceneGameMapEditor.warmClimate }}</el-radio>
                <el-radio :label="TileClimate.cool">{{ dict.sceneGameMapEditor.coolClimate }}</el-radio>
                <el-radio :label="TileClimate.snow">{{ dict.sceneGameMapEditor.snowClimate }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="dict.name">
              <el-input v-model="viewModel.name" :disabled="viewModel.id === undefined"></el-input>
            </el-form-item>
            <el-form-item :label="dict.sceneGameMapEditor.tileTypeStatus">
              <el-text>{{ tileTypeStatus }}</el-text>
              <el-button class="inline-item" :disabled="canClearTile" @click="clearTileSelection()">{{ dict.sceneGameMapEditor.clearTileSelection }}</el-button>
            </el-form-item>
            <el-form-item :label="dict.terrain.text">
              <el-select v-model="viewModel.terrainId" :disabled="viewModel.id === undefined">
                <el-option
                  v-for="o in terrain"
                  :key="o.id"
                  :label="`${o.id}:${o.name}`"
                  :value="o.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="dict.introduction">
              <el-input type="textarea" v-model="viewModel.introduction" :disabled="viewModel.id === undefined"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="viewModel.id === undefined" @click="saveItem()">{{ dict.apply }}</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import { Options } from "vue-class-component";
import TileClimate from "@/codetypes/tile-climate";
import TileMapMasterData from "@/data/tile-map-master-data";
import TileMapImage from "@/data/tile-map-image";
import { TileSelector } from "@/game/tile-selector";
import TileType from "@/models/tile-type";
import Terrain from "@/models/terrain";
import TileTypeViewModel from "@/view-models/game-map-editor/tile-type-view-model";
import CommonUtil from "@/utils/common-util";
import ExampleUtil from "@/utils/example-util";
import ModelUtil from "@/utils/model-util";
import BaseVue from "@/BaseVue";
import GameMain from "../GameMain";

@Options({
  props: {},
})
export default class TileTypePanel extends BaseVue {
  public TileClimate = TileClimate;
  public viewModel = new TileTypeViewModel();
  public tileClimate = TileClimate.normal;
  public list: TileType[] = [];
  public terrain: Terrain[] = [];
  public listLengthChangedResult = 0;

  private game!: GameMain;
  private tileSelector!: TileSelector;

  public get tileTypeStatus() {
    const check = (id?: number) => {
      if (id === undefined) {
        return this.dict.sceneGameMapEditor.tileStatusNone;
      } else {
        return this.dict.sceneGameMapEditor.tileStatusNormal;
      }
    };

    switch (this.tileClimate) {
      case TileClimate.normal:
        return check(this.viewModel.tileId);
      case TileClimate.warm:
        return check(this.viewModel.warmTileId);
      case TileClimate.cool:
        return check(this.viewModel.coolTileId);
      case TileClimate.snow:
        return check(this.viewModel.snowTileId);
      default:
        throw new Error();
    }
  }

  public get canClearTile() {
    return (
      this.viewModel.id === undefined && this.tileClimate != TileClimate.normal
    );
  }

  public init(
    game: GameMain,
    tileMapImage: TileMapImage,
    tileMapMasterData: TileMapMasterData
  ) {
    this.list = tileMapMasterData.tileType;
    this.terrain = tileMapMasterData.terrain;
    this.viewModel = new TileTypeViewModel();
    this.viewModel.idListLength = tileMapMasterData.tileType.length;
    
    if (this.tileSelector) return;
    
    this.game = game;
    
    let list = game.textures.list as { [key: string]: Phaser.Textures.Texture };
    
    let tile = list[
      game.mainScene.tileMapComponent.tileKey
    ] as Phaser.Textures.Texture;
    
    let tileImage = tile.source[0].image as HTMLImageElement;
    
    let ct = this.$refs["editor-canvas"] as HTMLCanvasElement;
    
    let terrainTileSelector = new TileSelector(tileMapImage, ct, tileImage);
    
    terrainTileSelector.onTileSelected = (tileId) =>
      this.selectAutoTile(tileId);
    terrainTileSelector.init();
    terrainTileSelector.draw();
    
    this.tileSelector = terrainTileSelector;
  }

  public selectItem(row: TileType) {
    if (!row) return;
    
    let data = this.viewModel;
    let model = this.list[row.id];

    if (!model) return;

    ModelUtil.tileType2tileTypeViewModel(model, data);

    this.refreshItem();
  }

  public tableIdNameFormatter(row: TileType) {
    return `${row.id}:${row.name}`;
  }

  public selectAutoTile(id: number) {
    if (this.viewModel.id === undefined) return;

    switch (this.tileClimate) {
      case TileClimate.warm:
        this.viewModel.warmTileId = id;
        break;
      case TileClimate.cool:
        this.viewModel.coolTileId = id;
        break;
      case TileClimate.snow:
        this.viewModel.snowTileId = id;
        break;
    }

    this.refreshItem();
  }

  public refreshItem() {
    const check = (id?: number) => {
      if (id !== undefined && id >= 0) {
        this.tileSelector.setTileId(id);
      } else {
        this.tileSelector.draw();
      }
    };

    switch (this.tileClimate) {
      case TileClimate.normal:
        check(this.viewModel.tileId);
        break;
      case TileClimate.warm:
        check(this.viewModel.warmTileId);
        break;
      case TileClimate.cool:
        check(this.viewModel.coolTileId);
        break;
      case TileClimate.snow:
        check(this.viewModel.snowTileId);
        break;
    }
  }

  public changeListCount() {
    this.listLengthChangedResult = CommonUtil.changeListCount(
      this.list,
      this.viewModel.idListLength,
      (index: number) => ExampleUtil.getTileType(index)
    );
  }

  public clearTileSelection() {
    switch (this.tileClimate) {
      case TileClimate.normal:
        delete this.viewModel.tileId;
        break;
      case TileClimate.warm:
        delete this.viewModel.warmTileId;
        break;
      case TileClimate.cool:
        delete this.viewModel.coolTileId;
        break;
      case TileClimate.snow:
        delete this.viewModel.snowTileId;
        break;
    }

    this.refreshItem();
  }

  public saveItem() {
    let data = this.viewModel;

    if (data.id === undefined) return;

    let model = this.list[data.id];

    ModelUtil.tileTypeViewModel2tileType(data, model);

    CommonUtil.success(this.dict.msg.dataSaved);
  }
}
</script>
  