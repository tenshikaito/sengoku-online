<template>
    <div>
        <el-tabs tab-position="left">
            <el-tab-pane :label="dict.autoTile">
                <el-container>
                    <el-main class="editor-content">
                        <el-container class="canvas-panel">
                            <canvas ref="editor-canvas-auto-tile"></canvas>
                        </el-container>
                        <el-form ref="auto-tile-form" label-width="80px">
                            <el-form-item :label="dict.id">
                                <span>{{ autoTileViewModel.tileId }}</span>
                            </el-form-item>
                            <el-form-item :label="dict.sceneGameMapEditor.backgroundTile">
                                <el-select v-model="autoTileViewModel.backgroundTileId" :disabled="autoTileViewModel.tileId === undefined">
                                    <el-option :value="-1" label="-"></el-option>
                                    <el-option
                                        v-for="o in autoTileImage"
                                        :key="o.tileId"
                                        :label="`${o.tileId}`"
                                        :value="o.tileId">
                                    </el-option>
                                </el-select>
                                <el-checkbox class="inline-item" :label="dict.sceneGameMapEditor.isSurface" v-model="autoTileViewModel.isSurface" :disabled="autoTileViewModel.tileId === undefined"></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox :label="dict.isDisable" v-model="autoTileViewModel.isDisabled" :disabled="autoTileViewModel.tileId === undefined"></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button :disabled="autoTileViewModel.tileId === undefined" @click="saveAutoTileItem()">{{ dict.apply }}</el-button>
                            </el-form-item>
                        </el-form>
                    </el-main>
                </el-container>
            </el-tab-pane>
            <el-tab-pane :label="dict.tile">
                <el-container>
                    <el-main>
                        <el-container class="canvas-panel">
                            <canvas ref="editor-canvas-tile"></canvas>
                        </el-container>
                        <el-main>
                            <el-form ref="tile-form" label-width="80px">
                                <el-form-item :label="dict.id">
                                    <span>{{ tileViewModel.tileId }}</span>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox :label="dict.isDisable" v-model="tileViewModel.isDisabled" :disabled="tileViewModel.tileId === undefined"></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-button :disabled="tileViewModel.tileId === undefined" @click="saveTileItem()">{{ dict.apply }}</el-button>
                                </el-form-item>
                            </el-form>
                        </el-main>
                    </el-main>
                </el-container>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import { Options } from "vue-class-component";
import { AutoTileSelector, TileSelector } from "@/game/tile-selector";
import TileMapImage from "@/data/tile-map-image";
import AutoTileViewModel from "@/view-models/game-map-editor/auto-tile-view-model";
import TileViewModel from "@/view-models/game-map-editor/tile-view-model";
import CommonUtil from "@/utils/common-util";
import ModelUtil from "@/utils/model-util";
import BaseVue from "@/BaseVue";
import GameMain from "../GameMain";
import AutoTileImage from "@/models/image/auto-tile-image";
import TileImage from "@/models/image/tile-image";

@Options({
  props: {},
})
export default class RmImagePanel extends BaseVue {
  public autoTileImage: AutoTileImage[] = [];
  public tileImage: TileImage[] = [];
  public autoTileViewModel = new AutoTileViewModel();
  public tileViewModel = new TileViewModel();

  private isInit = false;

  public init(game: GameMain, tileMapImage: TileMapImage) {
    this.autoTileImage = tileMapImage.autoTileImage;
    this.tileImage = tileMapImage.tileImage;
    
    if (this.isInit) return;

    let cat = this.$refs["editor-canvas-auto-tile"] as HTMLCanvasElement;
    let ct = this.$refs["editor-canvas-tile"] as HTMLCanvasElement;
    
    let list = game.textures.list as { [key: string]: Phaser.Textures.Texture };
    
    let autoTile = list[game.mainScene.tileMapComponent.autoTileKey];
    let tile = list[game.mainScene.tileMapComponent.tileKey];
    
    let autoTileImage = autoTile.source[0].image as HTMLImageElement;
    let tileImage = tile.source[0].image as HTMLImageElement;
    
    let autoTileSelector = new AutoTileSelector(
      tileMapImage,
      cat,
      autoTileImage,
      true
    );

    autoTileSelector.onTileSelected = (tileId) => this.selectAutoTile(tileId);
    autoTileSelector.init();
    autoTileSelector.draw();

    let tileSelector = new TileSelector(tileMapImage, ct, tileImage, true);

    tileSelector.onTileSelected = (tileId) => this.selectTile(tileId);
    tileSelector.init();
    tileSelector.draw();

    this.isInit = true;
  }

  public selectAutoTile(id: number) {
    let data = this.autoTileViewModel;
    let model = this.autoTileImage[id];

    ModelUtil.autoTileImage2autoTileViewModel(model, data);
  }

  public selectTile(id: number) {
    let data = this.tileViewModel;
    let model = this.tileImage[id];

    ModelUtil.tileImage2tileViewModel(model, data);
  }

  public saveAutoTileItem() {
    let data = this.autoTileViewModel;

    if (data.tileId === undefined) return;

    let model = this.autoTileImage[data.tileId];

    ModelUtil.autoTileViewModel2autoTileImage(data, model);

    CommonUtil.success(this.dict.msg.dataSaved);
  }

  public saveTileItem() {
    let data = this.tileViewModel;

    if (data.tileId === undefined) return;

    let model = this.tileImage[data.tileId];

    ModelUtil.tileViewModel2tileImage(data, model);

    CommonUtil.success(this.dict.msg.dataSaved);
  }
}
</script>
  