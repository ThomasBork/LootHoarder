import { QuestReward } from "./quest-reward";
import { QuestRewardType } from "./quest-reward-type";

export class QuestRewardHeroSlot extends QuestReward {
  public constructor(
    type: QuestRewardType
  ) {
    super(type);
  }
}
