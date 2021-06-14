import { AbilityTypeEffect } from "../ability-type-effect";
import { ValueContainer } from "../value-container";

export class CombatCharacterAbilityEffect {
  public typeEffect: AbilityTypeEffect;
  public powerVC: ValueContainer;

  public constructor(
    typeEffect: AbilityTypeEffect
  ) {
    this.typeEffect = typeEffect;

    this.powerVC = new ValueContainer(0);
  }
}
