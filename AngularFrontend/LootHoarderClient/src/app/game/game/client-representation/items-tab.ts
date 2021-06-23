import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { GameTab } from "./game-tab";

export class ItemsTab extends GameTab {
  public constructor() {
    super(undefined, ContractGameTabKey.items, 'Items');
  }
}