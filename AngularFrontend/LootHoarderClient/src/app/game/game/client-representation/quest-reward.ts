import { QuestRewardType } from "./quest-reward-type";

export abstract class QuestReward {
  public type: QuestRewardType;
  public description: string;

  public constructor(
    type: QuestRewardType,
    description: string
  ) {
    this.type = type;
    this.description = description;
  }
}