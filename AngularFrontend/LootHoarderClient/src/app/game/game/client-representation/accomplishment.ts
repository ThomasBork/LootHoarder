import { AccomplishmentType } from "./accomplishment-type";

export class Accomplishment {
  public type: AccomplishmentType;
  public completedAmount: number;

  public constructor(
    type: AccomplishmentType,
    completedAmount: number
  ) {
    this.type = type;
    this.completedAmount = completedAmount;
  }

  public get isComplete(): boolean {
    return this.completedAmount >= this.type.requiredAmount;
  }

  public complete(): void {
    this.completedAmount = this.type.requiredAmount;
  }
}
