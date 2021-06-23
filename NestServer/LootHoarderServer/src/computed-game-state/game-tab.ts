import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";

export class GameTab {
  public parentTabKey: ContractGameTabKey;
  public childTabKey?: string;
  public constructor(
    parentTabKey: ContractGameTabKey,
    childTabKey: string | undefined
  ) {
    this.parentTabKey = parentTabKey;
    this.childTabKey = childTabKey;
  }
}