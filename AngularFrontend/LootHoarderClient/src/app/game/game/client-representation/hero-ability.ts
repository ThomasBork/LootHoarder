import { AbilityType } from "./ability-type";

export class HeroAbility {
  public id: number;
  public type: AbilityType;
  public isEnabled: boolean;

  public constructor(
    id: number,
    type: AbilityType,
    isEnabled: boolean
  ) {
    this.id = id;
    this.type = type;
    this.isEnabled = isEnabled;
  }
}
