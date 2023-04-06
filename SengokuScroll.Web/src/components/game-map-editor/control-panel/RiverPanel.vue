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
    <el-tabs v-model="currentIsEstuary" type="card" @tab-click="refreshIsEstuary">
      <el-tab-pane name="no" :label="dict.river">
        <el-radio-group v-model="currentRiverDirection" @change="refreshDirectionStatus" style="margin: 10px;">
          <el-radio-button :label="Direction16.leftRight">─</el-radio-button>
          <el-radio-button :label="Direction16.upDown">│</el-radio-button>
          <el-radio-button :label="Direction16.leftUp">┘</el-radio-button>
          <el-radio-button :label="Direction16.leftDown">┑</el-radio-button>
          <el-radio-button :label="Direction16.rightUp">└</el-radio-button>
          <el-radio-button :label="Direction16.rightDown">┌</el-radio-button>
          <el-radio-button :label="Direction16.leftRightUp">┴</el-radio-button>
          <el-radio-button :label="Direction16.leftRightDown">┬</el-radio-button>
          <el-radio-button :label="Direction16.upDownLeft">┤</el-radio-button>
          <el-radio-button :label="Direction16.upDownRight">├</el-radio-button>
          <el-radio-button :label="Direction16.all">┼</el-radio-button>
          <el-radio-button :label="Direction16.none">╳</el-radio-button>
        </el-radio-group>
      </el-tab-pane>
      <el-tab-pane name="yes" :label="dict.estuary">
        <el-radio-group v-model="currentEstuaryDirection" @change="refreshDirectionStatus()" style="margin: 10px;">
          <el-radio-button :label="Direction16.up">↑</el-radio-button>
          <el-radio-button :label="Direction16.down">↓</el-radio-button>
          <el-radio-button :label="Direction16.left">←</el-radio-button>
          <el-radio-button :label="Direction16.right">→</el-radio-button>
          <el-radio-button :label="Direction16.leftUp">┘</el-radio-button>
          <el-radio-button :label="Direction16.leftDown">┑</el-radio-button>
          <el-radio-button :label="Direction16.rightUp">└</el-radio-button>
          <el-radio-button :label="Direction16.rightDown">┌</el-radio-button>
          <el-radio-button :label="Direction16.leftRightUp">┴</el-radio-button>
          <el-radio-button :label="Direction16.leftRightDown">┬</el-radio-button>
          <el-radio-button :label="Direction16.upDownLeft">┤</el-radio-button>
          <el-radio-button :label="Direction16.upDownRight">├</el-radio-button>
          <el-radio-button :label="Direction16.all">┼</el-radio-button>
          <el-radio-button :label="Direction16.none">╳</el-radio-button>
        </el-radio-group>
      </el-tab-pane>
    </el-tabs>
    <el-radio-group v-model="currentFlowDirection" @change="refreshFlowDirection()" style="margin: 10px;">
      <el-radio-button :label="RiverDirection.left2right">→</el-radio-button>
      <el-radio-button :label="RiverDirection.right2left">←</el-radio-button>
      <el-radio-button :label="RiverDirection.up2down">↓</el-radio-button>
      <el-radio-button :label="RiverDirection.down2up">↑</el-radio-button>
    </el-radio-group>
    <div class="canvas-panel" style="margin-top: 10px;">
      <canvas :ref="refCanvasRiver"></canvas>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Options } from "vue-class-component";
import Direction16 from "@/codetypes/direction16";
import MapEditStatus from "@/codetypes/map-edit-status";
import RiverDirection from "@/codetypes/river-direction";
import BaseVue from "@/BaseVue";

@Options({
  props: {
    switchDrawPointEditStatus: Function,
    refreshDirectionStatus: Function,
    refreshIsEstuary: Function,
    refreshFlowDirection: Function,
  },
})
export default class RegionPanel extends BaseVue {
  public MapEditorStatus = MapEditStatus;
  public Direction16 = Direction16;
  public RiverDirection = RiverDirection;
  public currentDrawPointEditStatus = MapEditStatus.view;
  public currentRiverDirection = Direction16.leftRight;
  public currentEstuaryDirection = Direction16.up;
  public currentIsEstuary = "no";
  public currentFlowDirection = RiverDirection.left2right;

  public switchDrawPointEditStatus!: (status: MapEditStatus) => void;
  public refreshDirectionStatus!: () => void;
  public refreshIsEstuary!: () => void;
  public refreshFlowDirection!: () => void;

  public refCanvasRiver = "canvas-river";

  public get canvasRiver() {
    return this.$refs[this.refCanvasRiver] as HTMLCanvasElement;
  }

  public refreshDrawPointEditStatus() {
    this.$nextTick(() =>
      this.switchDrawPointEditStatus(this.currentDrawPointEditStatus)
    );
  }
}
</script>
