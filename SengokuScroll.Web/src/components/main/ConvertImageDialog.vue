<template>
  <div>
    <el-dialog :title="dict.sceneMain.convertImage"
      id="convert-dialog"
      width="50%"
      v-model="isVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-tabs type="border-card" model-value="rm">
        <el-tab-pane name="rm" :label="dict.rmImage">
          <div v-if="isRmConvertResultVisible">
            <canvas ref="result-canvas1"></canvas>
            <canvas ref="result-canvas2"></canvas>
            <div>
              <el-button type="primary" @click="onConvertImageDialogExport1ButtonClicked()">Terrain {{ dict.export }}</el-button>
              <el-button type="primary" @click="onConvertImageDialogExport2ButtonClicked()">Tile {{ dict.export }}</el-button>
              <el-button @click="onBackButtonClicked()">{{ dict.back }}</el-button>
            </div>
          </div>
          <div v-else>
            <el-form label-width="auto">
              <el-form-item :label="dict.tileWidth">
                <el-input v-model="rmConvertData.tileWidth"></el-input>
              </el-form-item>
              <el-form-item :label="dict.tileHeight">
                <el-input v-model="rmConvertData.tileHeight"></el-input>
              </el-form-item>
              <el-form-item :label="dict.animatedAutoTileImage">
                <el-upload
                  action="#"
                  :accept="imageAcceptTypes"
                  :auto-upload="false"
                  :on-change="onAnimatedTerrainTileImageFileChanged">
                  <el-button size="small" type="primary">{{ dict.select }}</el-button>
                  <span class="el-upload__tip">{{ dict.sceneMain.uploadTip }}</span>
                </el-upload>
              </el-form-item>
              <el-form-item :label="dict.autoTileImage">
                <el-upload
                  action="#"
                  :accept="imageAcceptTypes"
                  :auto-upload="false"
                  :on-change="onTerrainTileImageFileChanged">
                  <el-button size="small" type="primary">{{ dict.select }}</el-button>
                  <span class="el-upload__tip">{{ dict.sceneMain.uploadTip }}</span>
                </el-upload>
              </el-form-item>
              <el-form-item :label="dict.tileImage">
                <el-upload
                  action="#"
                  :accept="imageAcceptTypes"
                  :auto-upload="false"
                  :on-change="onTileImageFileChanged">
                  <el-button size="small" type="primary">{{ dict.select }}</el-button>
                  <span class="el-upload__tip">{{ dict.sceneMain.uploadTip }}</span>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onConvertImageDialogRmGenerateButtonClicked()">{{ dict.generate }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <span>
          <el-button @click="onCloseButtonClicked()">{{ dict.close }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import { Options } from "vue-class-component";
import { ElMessage } from 'element-plus';
import RmvxImageConvertData from "@/modules/rmvx-image-convert-data";
import RmvxImageConverter from "@/modules/rmvx-image-converter";
import BaseMainDialog from "./BaseMainDialog";
import TileMapConstant from "@/constants/tile-map-contant";
import CommonUtil from "@/utils/common-util";

@Options({
  props: {
    onCloseButtonClicked: Function,
  },
})
export default class ConvertImageDialog extends BaseMainDialog {
  public isRmConvertResultVisible = false;
  public rmConvertData = new RmvxImageConvertData();
  public onCloseButtonClicked!: () => void;

  public imageAcceptTypes = ".jpg,.png";

  public get resultCanvas1() {
    return this.$refs["result-canvas1"] as HTMLCanvasElement;
  }

  public get resultCanvas2() {
    return this.$refs["result-canvas2"] as HTMLCanvasElement;
  }

  public init() {
    this.rmConvertData.init();
  }

  public onBackButtonClicked() {
    this.isRmConvertResultVisible = false;
  }

  public onAnimatedTerrainTileImageFileChanged(file: any) {
    this.rmConvertData.animatedAutoTileImageFile = file.raw;
  }

  public onTerrainTileImageFileChanged(file: any) {
    this.rmConvertData.autoTileImageFile = file.raw;
  }

  public onTileImageFileChanged(file: any) {
    this.rmConvertData.tileImageFile = file.raw;
  }

  public onConvertImageDialogRmGenerateButtonClicked() {
    this.isRmConvertResultVisible = true;

    setTimeout(() => {
      try {
        RmvxImageConverter.convert(
          this.resultCanvas1,
          this.resultCanvas2,
          this.rmConvertData
        );
      } catch (e) {
        console.error(e);
        ElMessage.error(this.dict.msg.error);
      }
    }, 0);
  }

  public onConvertImageDialogExport1ButtonClicked() {
    let dataUrl = this.resultCanvas1.toDataURL("image/png");

    CommonUtil.download(dataUrl, TileMapConstant.autoTileFileName);
  }

  public onConvertImageDialogExport2ButtonClicked() {
    let dataUrl = this.resultCanvas2.toDataURL("image/png");

    CommonUtil.download(dataUrl, TileMapConstant.tileFileName);
  }
}
</script>
