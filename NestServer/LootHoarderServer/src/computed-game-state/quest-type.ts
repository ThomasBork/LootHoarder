import { AccomplishmentType } from "./accomplishment-type";
import { QuestReward } from "./quest-reward";

export class QuestType {
  public key: string;
  public name: string;
  public previousQuestType?: QuestType;
  public requiredAccomplishmentTypes: AccomplishmentType[];
  public rewards: QuestReward[];
  public hiddenRewards: QuestReward[];

  public constructor(
    key: string,
    name: string,
    requiredAccomplishmentTypes: AccomplishmentType[],
    rewards: QuestReward[],
    hiddenRewards: QuestReward[],
  ) {
    this.key = key;
    this.name = name;
    this.requiredAccomplishmentTypes = requiredAccomplishmentTypes;
    this.rewards = rewards;
    this.hiddenRewards = hiddenRewards;
  }
}
