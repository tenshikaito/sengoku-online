export default class RmvxImageConvertData {
    
  public tileWidth = 32;
  public tileHeight = 32;
  public animatedAutoTileImageFile?: File;
  public autoTileImageFile?: File;
  public tileImageFile?: File;

  public init() {
    this.animatedAutoTileImageFile = undefined;
    this.autoTileImageFile = undefined;
    this.tileImageFile = undefined;
  }
}