import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { Area } from "./area";
import { GameTab } from "./game-tab";

export class CombatTab extends GameTab {
  public selectedArea?: Area;

  public constructor() {
    super(undefined, ContractGameTabKey.combat, 'Combat');
    this.selectedArea = undefined;
  }
}