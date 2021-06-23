import { Accomplishment } from "./accomplishment";
import { AchievementType } from "./achievement-type";

export class Achievement {
  public type: AchievementType;
  public accomplishments: Accomplishment[];
  public isComplete: boolean;
  public constructor(
    type: AchievementType,
    accomplishments: Accomplishment[],
    isComplete: boolean
  ) {
    this.type = type;
    this.accomplishments = accomplishments;
    this.isComplete = isComplete;
  }

  public complete(): void {
    this.isComplete = true;
    this.accomplishments.forEach(a => a.complete());
  }
}
