import { Accomplishment } from "./accomplishment";
import { QuestType } from "./quest-type";

export class Quest {
  public type: QuestType;
  public accomplishments: Accomplishment[];
  public isComplete: boolean;
  public isAvailable: boolean;
  public constructor(
    type: QuestType,
    accomplishments: Accomplishment[],
    isComplete: boolean,
    isAvailable: boolean
  ) {
    this.type = type;
    this.accomplishments = accomplishments;
    this.isComplete = isComplete;
    this.isAvailable = isAvailable;
  }

  public complete(): void {
    this.isComplete = true;
    this.accomplishments.forEach(a => a.complete());
  }
}
