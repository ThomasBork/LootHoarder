export class QuestRewardType {
  public key: string;
  public requiredParameters: string[];
  public constructor(
    key: string,
    requiredParameters: string[],
  ) {
    this.key = key;
    this.requiredParameters = requiredParameters;
  }
}