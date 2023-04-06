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
                    :max="GameConstant.terrainMaxCount">
                </el-input-number>
                <el-button @click="changeListCount()">{{dict.ok}}</el-button>
            </el-aside>
            <el-container>
                <el-main class="editor-content">
                    <el-form :model="viewModel" label-width="80px">
                        <el-form-item :label="dict.name">
                            <el-input v-model="viewModel.name" :disabled="viewModel.id === undefined"></el-input>
                        </el-form-item>
                        <el-form-item :label="dict.type">
                            <el-checkbox v-model="viewModel.isWater" :label="dict.terrain.isWater" :disabled="viewModel.id === undefined"></el-checkbox>
                            <el-checkbox v-model="viewModel.isDeepWater" :label="dict.terrain.isDeepWater" :disabled="viewModel.id === undefined"></el-checkbox>
                            <el-checkbox v-model="viewModel.isFreshWater" :label="dict.terrain.isFreshWater" :disabled="viewModel.id === undefined"></el-checkbox>
                            <el-checkbox v-model="viewModel.isDesert" :label="dict.terrain.isDesert" :disabled="viewModel.id === undefined"></el-checkbox>
                            <el-checkbox v-model="viewModel.isHill" :label="dict.terrain.isHill" :disabled="viewModel.id === undefined"></el-checkbox>
                            <el-checkbox v-model="viewModel.isMountain" :label="dict.terrain.isMountain" :disabled="viewModel.id === undefined"></el-checkbox>
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
import { Options } from "vue-class-component";
import TileMapMasterData from "@/data/tile-map-master-data";
import Terrain from "@/models/terrain";
import TerrainViewModel from "@/view-models/game-map-editor/terrain-view-model";
import CommonUtil from "@/utils/common-util";
import ExampleUtil from "@/utils/example-util";
import ModelUtil from "@/utils/model-util";
import BaseVue from "@/BaseVue";

@Options({
  props: {},
})
export default class TerrainPanel extends BaseVue {
  public list: Terrain[] = [];
  public viewModel = new TerrainViewModel();
  public listLengthChangedResult = 0;

  public init(tileMapMasterData: TileMapMasterData) {
    this.list = tileMapMasterData.terrain;
    this.viewModel = new TerrainViewModel();
    this.viewModel.idListLength = tileMapMasterData.terrain.length;
  }

  public selectItem(row: Terrain) {
    if (!row) return;

    let data = this.viewModel;
    let model = this.list[row.id];

    if (!model) return;

    ModelUtil.terrain2terrainViewModel(model, data);
  }

  public tableIdNameFormatter(row: TerrainViewModel) {
    return `${row.id}:${row.name}`;
  }

  public changeListCount() {
    this.listLengthChangedResult = CommonUtil.changeListCount(
      this.list,
      this.viewModel.idListLength,
      (index: number) => ExampleUtil.getTerrain(index)
    );
  }

  public saveItem() {
    let data = this.viewModel;

    if (data.id === undefined) return;

    let model = this.list[data.id];

    ModelUtil.terrainViewModel2terrain(data, model);

    CommonUtil.success(this.dict.msg.dataSaved);
  }
}
</script>
  