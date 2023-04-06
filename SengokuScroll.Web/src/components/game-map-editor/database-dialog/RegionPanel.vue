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
                    :max="GameConstant.regionMaxCount">
                </el-input-number>
                <el-button @click="changeListCount()">{{dict.ok}}</el-button>
            </el-aside>
            <el-container>
                <el-main class="editor-content">
                    <el-form ref="viewModel-form" :model="viewModel" label-width="80px">
                        <el-form-item :label="dict.name">
                            <el-input v-model="viewModel.name" :disabled="viewModel.id === undefined"></el-input>
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
import Region from "@/models/region";
import RegionViewModel from "@/view-models/game-map-editor/region-view-model";
import CommonUtil from "@/utils/common-util";
import ExampleUtil from "@/utils/example-util";
import ModelUtil from "@/utils/model-util";
import BaseVue from "@/BaseVue";

@Options({
  props: {},
})
export default class RegionPanel extends BaseVue {
  public list: Region[] = [];
  public viewModel = new RegionViewModel();
  public listLengthChangedResult = 0;

  public init(tileMapMasterData: TileMapMasterData) {
    this.list = tileMapMasterData.region;
    this.viewModel = new RegionViewModel();
    this.viewModel.idListLength = tileMapMasterData.region.length;
  }

  public tableIdNameFormatter(row: RegionViewModel) {
    return `${row.id}:${row.name}`;
  }

  public selectItem(row: Region) {
    if (!row) return;
    
    let data = this.viewModel;
    let model = this.list[row.id];

    if (!model) return;

    ModelUtil.region2regionViewModel(model, data);
  }

  public changeListCount() {
    this.listLengthChangedResult = CommonUtil.changeListCount(
      this.list,
      this.viewModel.idListLength,
      (index: number) => ExampleUtil.getRegion(index)
    );
  }

  public saveItem() {
    let data = this.viewModel;

    if (data.id === undefined) return;

    let model = this.list[data.id];

    ModelUtil.regionViewModel2region(data, model);

    CommonUtil.success(this.dict.msg.dataSaved);
  }
}
</script>
  