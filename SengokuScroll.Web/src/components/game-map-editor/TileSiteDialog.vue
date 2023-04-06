<template>
    <div>
      <el-dialog
        class="tile-site"
        v-model="isVisible"
        :title="dict.tileSite"
        :close-on-click-modal="false">
        <el-form ref="form" :model="tileSite" label-width="80px">
          <el-form-item :label="dict.name">
            <el-input v-model="tileSite.name"></el-input>
          </el-form-item>
          <el-form-item :label="dict.tileSiteType.text">
            <el-select v-model="tileSite.type">
              <el-option :label="dict.tileSiteType.stronghold" :value="TileSiteType.stronghold"></el-option>
              <el-option :label="dict.tileSiteType.battlefield" :value="TileSiteType.battlefield"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="dict.introduction">
            <el-input type="textarea" v-model="tileSite.introduction"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <span>
            <el-button @click="onTileSiteDialogCancelButtonClicked()">{{ dict.cancel }}</el-button>
            <el-button type="danger" v-if="!isTileSiteCreate" @click="onTileSiteDialogDeleteButtonClicked()">{{ dict.delete }}</el-button>
            <el-button type="primary" v-if="isTileSiteCreate" @click="onTileSiteDialogCreateButtonClicked()">{{ dict.create }}</el-button>
            <el-button type="primary" v-else @click="onTileSiteDialogEditButtonClicked()">{{ dict.edit }}</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts">
import { Options } from "vue-class-component";
import TileSiteType from "@/codetypes/tile-site-type";
import TileSite from "@/models/tile-site";
import BaseDialog from "../BaseDialog";

@Options({
  props: {
    onTileSiteDialogCreateButtonClicked: Function,
    onTileSiteDialogEditButtonClicked: Function,
    onTileSiteDialogDeleteButtonClicked: Function,
    onTileSiteDialogCancelButtonClicked: Function,
  },
})
export default class TileSiteDialog extends BaseDialog {
  public TileSiteType = TileSiteType;
  public isTileSiteCreate = true;

  public onTileSiteDialogCreateButtonClicked!: () => void;
  public onTileSiteDialogEditButtonClicked!: () => void;
  public onTileSiteDialogDeleteButtonClicked!: () => void;
  public onTileSiteDialogCancelButtonClicked!: () => void;

  public tileSite = new TileSite();

  public create(x: number, y: number, index: number) {
    this.isTileSiteCreate = true;

    let site = this.tileSite;

    site.id = index;
    site.name = "";
    site.x = x;
    site.y = y;
    site.type = TileSiteType.stronghold;
    site.introduction = "";

    this.show();
  }

  public editTileSite(ts: TileSite) {
    this.isTileSiteCreate = false;

    let site = this.tileSite;

    site.id = ts.id;
    site.name = ts.name;
    site.x = ts.x;
    site.y = ts.y;
    site.type = TileSiteType.stronghold;
    site.introduction = ts.introduction;

    this.show();
  }
}
</script>
  