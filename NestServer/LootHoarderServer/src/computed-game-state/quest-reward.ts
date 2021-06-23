import { QuestRewardType } from "./quest-reward-type";

export abstract class QuestReward {
  public type: QuestRewardType;

  public constructor(
    type: QuestRewardType
  ) {
    this.type = type;
  }
}