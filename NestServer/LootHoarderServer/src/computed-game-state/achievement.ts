import { Subject } from "rxjs";
import { Accomplishment } from "./accomplishment";
import { AchievementType } from "./achievement-type";

export class Achievement {
  public type: AchievementType;
  public accomplishments: Accomplishment[];
  public onUpdate: Subject<void>;
  public constructor(
    type: AchievementType,
    accomplishments: Accomplishment[]
  ) {
    this.type = type;
    this.accomplishments = accomplishments;
    this.onUpdate = new Subject();
    this.setUpEventListeners();
  }

  public get isComplete(): boolean {
    return this.accomplishments.every(accomplishment => accomplishment.isComplete);
  }

  public get isBegun(): boolean {
    return this.accomplishments.some(accomplishment => accomplishment.completedAmount > 0);
  }

  private setUpEventListeners(): void {
    for(const accomplishment of this.accomplishments) {
      accomplishment.onUpdate.subscribe(() => 
        this.onUpdate.next()
      );
    }
  }
}