import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { GameTab } from "./game-tab";

export class QuestsTab extends GameTab {
  public constructor() {
    super(undefined, ContractGameTabKey.quests, 'Quests');
  }
}