import { AbilityType } from "./ability-type";
import { AbilityTypeEffect } from "./ability-type-effect";

export class AbilityEffect {
  public abilityType: AbilityType;
  public abilityTypeEffect: AbilityTypeEffect;
  public power: number;

  public constructor(
    abilityType: AbilityType,
    abilityTypeEffect: AbilityTypeEffect,
    power: number,
  ) {
    this.abilityType = abilityType;
    this.abilityTypeEffect = abilityTypeEffect;
    this.power = power;
  }
}
