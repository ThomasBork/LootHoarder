import { AbilityType } from "./ability-type";
import { AbilityTypeEffect } from "./ability-type-effect";

export class AbilityEffect {
  public abilityType: AbilityType;
  public abilityTypeEffect: AbilityTypeEffect;
  public damageEffect: number;

  public constructor(
    abilityType: AbilityType,
    abilityTypeEffect: AbilityTypeEffect,
    damageEffect: number,
  ) {
    this.abilityType = abilityType;
    this.abilityTypeEffect = abilityTypeEffect;
    this.damageEffect = damageEffect;
  }
}
