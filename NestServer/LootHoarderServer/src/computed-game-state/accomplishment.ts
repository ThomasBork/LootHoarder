import { Subject } from "rxjs";
import { AccomplishmentType } from "./accomplishment-type";

export class Accomplishment {
  public type: AccomplishmentType;
  public onUpdate: Subject<void>;

  private _completedAmount: number;
  public constructor(
    type: AccomplishmentType,
    completedAmount: number
  ) {
    this.type = type;
    this._completedAmount = completedAmount;
    this.onUpdate = new Subject();
  }

  public get completedAmount(): number {
    return this._completedAmount;
  }
  public set completedAmount(newValue: number) {
    if (newValue !== this._completedAmount) {
      if (newValue > this.type.requiredAmount) {
        newValue = this.type.requiredAmount;
      }
      this._completedAmount = newValue;
      this.onUpdate.next();
    }
  }

  public get isComplete(): boolean {
    return this._completedAmount >= this.type.requiredAmount;
  }
}
