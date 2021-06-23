import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { GameAreaType } from "./game-area-type";
import { GameTab } from "./game-tab";

export class WorldTab extends GameTab {
  public readonly worldMapWidth = 8000;
  public readonly worldMapHeight = 4000;
  public readonly worldMapFixtureX = 3575;
  public readonly worldMapFixtureY = 1800;
  public worldMapCenterX?: number;
  public worldMapCenterY?: number;
  public worldMapX: number;
  public worldMapY: number;
  public worldMapZoom: number;
  public selectedAreaType?: GameAreaType;

  public constructor() {
    super(undefined, ContractGameTabKey.world, 'World');
    this.worldMapCenterX = this.worldMapFixtureX;
    this.worldMapCenterY = this.worldMapFixtureY;
    this.worldMapX = -this.worldMapFixtureX + 300;
    this.worldMapY = -this.worldMapFixtureY + 300;
    this.worldMapZoom = 1;
    this.selectedAreaType = undefined;

    this.onOpen.subscribe(()=> {
      if (this.selectedAreaType) {
        this.centerOnAreaType(this.selectedAreaType);
      }
    });
  }

  public centerOnAreaType(areaType: GameAreaType): void {
    this.worldMapCenterX = this.worldMapFixtureX + areaType.type.x;
    this.worldMapCenterY = this.worldMapFixtureY + areaType.type.y;
  }
}
