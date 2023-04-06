<template>
  <div id="root">
    <canvas id="game" :ref="refGameCanvas"></canvas>
    <MainDialog
      :ref="refMainDialog"
      :onSinglePlayerGameButtonClicked="onMainDialogSinglePlayerGameButtonClicked"
      :onMultiplayerGameButtonClicked="onMainDialogMultiplayerGameButtonClicked"
      :onEditGameWorldButtonClicked="onMainDialogEditGameWorldButtonClicked"
      :onEditGameMapButtonClicked="onMainDialogEditGameMapButtonClicked"
      :onOptionButtonClicked="onMainDialogOptionButtonClicked"
      :onConvertImageButtonClicked="onMainDialogConvertImageButtonClicked"
      :onTestButtonClicked="onMainDialogTestButtonClicked"/>
    <MultiplayerGameDialog
      :ref="refMultiplayerGameDialog"
      :onOkButtonClicked="onMultiplayerGameDialogOkButtonClicked"
      :onCancelButtonClicked="onMultiplayerGameDialogCancelButtonClicked"/>
    <EditGameMapDialog
      :ref="refEditGameMapDialog"
      :onCreateButtonClicked="onEditGameMapDialogCreateButtonClicked"
      :onCancelButtonClicked="onEditGameMapDialogCancelButtonClicked"
      :onFileSelected="onEditGameMapDialogSelectMapFileSelected"/>
    <CreateGameMapDialog
      :ref="refCreateGameMapDialog"
      :onOkButtonClicked="onCreateGameMapDialogOkButtonClicked"
      :onCancelButtonClicked="onCreateGameMapDialogCancelButtonClicked"/>
    <GameOptionDialog
      :ref="refGameOptionDialog"
      :onOkButtonClicked="onGameOptionDialogOkButtonClicked"
      :onCancelButtonClicked="onGameOptionDialogCancelButtonClicked"/>
    <ConvertImageDialog
      :ref="refConvertImageDialog"
      :onCloseButtonClicked="onConvertImageDialogCloseButtonClicked"/>
  </div>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import { ElMessage } from "element-plus";
// import "element-plus/lib/theme-chalk/display.css";
import RouterConstant from "@/constants/router-constant";
import GameMain from "@/components/main/GameMain";
import MainDialog from "@/components/main/MainDialog.vue";
import MultiplayerGameDialog from "@/components/main/MultiplayerGameDialog.vue";
import EditGameMapDialog from "@/components/main/EditGameMapDialog.vue";
import CreateGameMapDialog from "@/components/main/CreateGameMapDialog.vue";
import GameOptionDialog from "@/components/main/GameOptionDialog.vue";
import ConvertImageDialog from "@/components/main/ConvertImageDialog.vue";
import BaseVue from "@/BaseVue";
import ExampleUtil from "@/utils/example-util";
import StorageUtil from "@/utils/storage-util";
import CacheConstant from "@/constants/cache-constant";

@Options({
  components: {
    MainDialog,
    MultiplayerGameDialog,
    EditGameMapDialog,
    CreateGameMapDialog,
    GameOptionDialog,
    ConvertImageDialog,
  },
})
export default class MainView extends BaseVue {
  private game!: GameMain;

  public refGameCanvas = "gameCanvas";
  public refCreateWorld = "create-world";
  public refSelectWorld = "select-world";

  public refMainDialog = "mainDialog";
  public refMultiplayerGameDialog = "multiplayerGameDialog";
  public refEditGameMapDialog = "editGameMapDialog";
  public refCreateGameMapDialog = "createGameMapDialog";
  public refGameOptionDialog = "gameOptionDialog";
  public refConvertImageDialog = "convertImageDialog";

  public get gameCanvas() {
    return this.$refs[this.refGameCanvas] as HTMLCanvasElement;
  }

  public get mainDialog() {
    return this.$refs[this.refMainDialog] as MainDialog;
  }

  public get multiplayerGameDialog() {
    return this.$refs[this.refMultiplayerGameDialog] as MultiplayerGameDialog;
  }

  public get editGameMapDialog() {
    return this.$refs[this.refEditGameMapDialog] as EditGameMapDialog;
  }

  public get createGameMapDialog() {
    return this.$refs[this.refCreateGameMapDialog] as CreateGameMapDialog;
  }

  public get gameOptionDialog() {
    return this.$refs[this.refGameOptionDialog] as GameOptionDialog;
  }

  public get convertImageDialog() {
    return this.$refs[this.refConvertImageDialog] as ConvertImageDialog;
  }

  public mounted() {
    this.game = new GameMain(this.gameCanvas);
    this.mainDialog.show();
  }

  public beforeUnmount() {
    this.game?.destroy(true);
  }

  public onMainDialogSinglePlayerGameButtonClicked() {
    this.mainDialog.hide();
  }

  public onMainDialogMultiplayerGameButtonClicked() {
    this.mainDialog.hide();
    this.multiplayerGameDialog.show();
  }

  public onMainDialogEditGameWorldButtonClicked() {
    this.mainDialog.hide();
  }

  public onMainDialogEditGameMapButtonClicked() {
    this.mainDialog.hide();
    this.editGameMapDialog.show();
  }

  public onMainDialogOptionButtonClicked() {
    this.mainDialog.hide();
    this.gameOptionDialog.show();

    // go.baseUrl = WebClient.baseUrl;
  }

  public onMainDialogConvertImageButtonClicked() {
    this.mainDialog.hide();
    this.convertImageDialog.init();
    this.convertImageDialog.show();
  }

  public onMainDialogTestButtonClicked() {
    this.mainDialog.hide();
    setTimeout(() => this.$router.replace({ name: "about" }), 200);
  }

  public onMultiplayerGameDialogCancelButtonClicked() {
    this.multiplayerGameDialog.hide();
    this.mainDialog.show();
  }

  public onMultiplayerGameDialogOkButtonClicked() {
    this.multiplayerGameDialog.hide();

    // let ci = <ConnectionInfo>{
    //   id: 1,
    //   name: "test",
    //   host: "localhost",
    //   port: 80,
    //   userId: 1,
    //   token: "123",
    // };

    // GameDataUtil.setConnectionInfo(ci);

    // window.game.switchSceneMultiplayerGame();
  }

  public onEditGameMapDialogCreateButtonClicked() {
    this.editGameMapDialog.hide();
    this.createGameMapDialog.show(true);
  }

  public onEditGameMapDialogCancelButtonClicked() {
    this.editGameMapDialog.hide();
    this.mainDialog.show();
  }

  public onEditGameMapDialogSelectMapFileSelected(event: Event) {
    try {
      let $target = event.target as HTMLInputElement;
      let files = $target.files;
      let file = files && files[0];
      $target.value = "";
      let fr = new FileReader();
      fr.onload = () => {
        try {
          let gwmd = JSON.parse(fr.result as string);

          StorageUtil.setSessionValue(CacheConstant.gameWorldMasterData, gwmd);

          setTimeout(() => {
            this.$router.replace({
              name: RouterConstant.gameMapEditor,
            });
          }, 100);
        } catch (error) {
          console.error(error);
          ElMessage.error(this.dict.sceneMain.selectMapFileError);
          setTimeout(() => this.editGameMapDialog.show(), 1000);
        }
      };
      this.editGameMapDialog.hide();
      if (file) fr.readAsText(file);
    } catch (error) {
      this.editGameMapDialog.show();
      ElMessage.error(this.dict.sceneMain.selectMapFileError);
    }
  }

  public onCreateGameMapDialogOkButtonClicked() {
    this.createGameMapDialog.hide();

    const gmo = this.createGameMapDialog.gameMapOption;

    let gwmd = ExampleUtil.getGameWorldMasterData(
      gmo.name,
      gmo.width,
      gmo.height
    );

    StorageUtil.setSessionValue(CacheConstant.gameWorldMasterData, gwmd);

    setTimeout(() => {
      this.$router.replace({
        name: RouterConstant.gameMapEditor,
      });
    }, 100);
  }

  public onCreateGameMapDialogCancelButtonClicked() {
    this.createGameMapDialog.hide();
    this.editGameMapDialog.show();
  }

  public onGameOptionDialogOkButtonClicked() {
    this.gameOptionDialog.hide();
    this.mainDialog.show();

    // WebClient.baseUrl = this.gameOption.baseUrl;
  }

  public onGameOptionDialogCancelButtonClicked() {
    this.gameOptionDialog.hide();
    this.mainDialog.show();
  }

  public onConvertImageDialogCloseButtonClicked() {
    this.convertImageDialog.hide();
    this.mainDialog.show();
  }
}
</script>

<style lang="scss" scoped>
#root {
  overflow: hidden;
}

canvas#game {
  position: absolute;
  top: 0;
  left: 0;
}

:deep .el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}

:deep .el-select {
  width: 100%;
}

:deep .el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep .el-dialog.el-row--flex {
  flex-direction: column;
}

:deep .el-dialog__body {
  padding-top: 10px;
}

:deep #convert-dialog .el-tab-pane {
  height: 60vh;
  overflow: auto;
  &div {
    text-align: center;
  }
}

:deep .main-button {
  width: 100%;
}

:deep .button-container {
  margin-bottom: 10px;
}
</style>
