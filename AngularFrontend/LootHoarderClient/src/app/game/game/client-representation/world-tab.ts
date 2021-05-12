import { AreaType } from "./area-type";

export class WorldTab {
  public readonly worldMapWidth = 8000;
  public readonly worldMapHeight = 4000;
  public readonly worldMapFixtureX = 3575;
  public readonly worldMapFixtureY = 1800;
  public worldMapX: number;
  public worldMapY: number;
  public worldMapZoom: number;
  public selectedAreaType?: AreaType;

  public constructor() {
    this.worldMapX = -this.worldMapFixtureX + 300;
    this.worldMapY = -this.worldMapFixtureY + 300;
    this.worldMapZoom = 1;
    this.selectedAreaType = undefined;
  }
}