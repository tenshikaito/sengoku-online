import BaseVue from "@/BaseVue";

export default class BaseDialog extends BaseVue {
  public isVisible = false;

  public init() {
    return;
  }

  public show(isInit = false) {
    this.isVisible = true;

    if (isInit) {
      this.$nextTick(() => this.init());
    }
  }

  public hide() {
    this.isVisible = false;
  }
}