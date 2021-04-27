import { AbilityType } from "./ability-type";

export class CombatCharacterAbility {
  public id: number;
  public type: AbilityType;
  public remainingCooldown: number;

  public constructor(
    id: number,
    type: AbilityType,
    remainingCooldown: number
  ) {
    this.id = id;
    this.type = type;
    this.remainingCooldown = remainingCooldown;
  }
}
