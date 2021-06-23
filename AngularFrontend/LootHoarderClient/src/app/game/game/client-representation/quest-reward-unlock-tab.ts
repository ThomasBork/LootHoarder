import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { GameTab } from "./game-tab";
import { QuestReward } from "./quest-reward";
import { QuestRewardType } from "./quest-reward-type";

export class QuestRewardUnlockTab extends QuestReward {
  public parentTabKey: ContractGameTabKey;
  public childTabKey?: string;

  private  _tab?: GameTab;

  public constructor(
    type: QuestRewardType,
    parentTabKey: ContractGameTabKey,
    childTabKey?: string,
  ) {
    super(type, `[WILL BE CHANGED]`);
    this.parentTabKey = parentTabKey;
    this.childTabKey = childTabKey;
  }

  public get tab(): GameTab {
    if (!this._tab) {
      throw Error (`The ${this.parentTabKey}, ${this.childTabKey} tab was accessed before initialization`);
    }
    return this._tab;
  }

  public set tab(newTab: GameTab) {
    this._tab = newTab;
    if (newTab.parentTab) {
      this.description = `Unlock the ${newTab.parentTab.name} > ${newTab.name} tab`;
    } else {
      this.description = `Unlock the ${newTab.name} tab`;
    }
  }
}
