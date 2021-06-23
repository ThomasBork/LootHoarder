export abstract class AccomplishmentType {
  public requiredAmount: number;
  protected constructor(requiredAmount: number) {
    this.requiredAmount = requiredAmount;
  }
}
