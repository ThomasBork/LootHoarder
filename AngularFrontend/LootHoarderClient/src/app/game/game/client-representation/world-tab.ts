import { AreaType } from "./area-type";

export class WorldTab {
  public worldMapX: number;
  public worldMapY: number;
  public worldMapZoom: number;
  public selectedAreaType?: AreaType;

  public constructor() {
    this.worldMapX = 0;
    this.worldMapY = 0;
    this.worldMapZoom = 1;
    this.selectedAreaType = undefined;
  }
}