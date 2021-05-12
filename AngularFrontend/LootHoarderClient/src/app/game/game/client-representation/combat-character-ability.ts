import { AbilityType } from "./ability-type";

export class CombatCharacterAbility {
  public id: number;
  public type: AbilityType;
  public cooldown: number;
  public remainingCooldown: number;

  public constructor(
    id: number,
    type: AbilityType,
    cooldown: number,
    remainingCooldown: number
  ) {
    this.id = id;
    this.type = type;
    this.cooldown = cooldown;
    this.remainingCooldown = remainingCooldown;
  }
}
