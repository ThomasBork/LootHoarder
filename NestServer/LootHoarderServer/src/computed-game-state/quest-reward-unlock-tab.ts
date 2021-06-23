import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { QuestReward } from "./quest-reward";
import { QuestRewardType } from "./quest-reward-type";

export class QuestRewardUnlockTab extends QuestReward {
  public parentTabKey: ContractGameTabKey;
  public childTabKey?: string;
  public constructor(
    type: QuestRewardType,
    parentTabKey: ContractGameTabKey,
    childTabKey: string | undefined,
  ) {
    super(type);
    this.parentTabKey = parentTabKey;
    this.childTabKey = childTabKey;
  }
}
