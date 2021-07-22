import { AbilityTypeEffect } from "../ability-type-effect";
import { ValueContainer } from "../value-container";

export class CombatCharacterAbilityEffect {
  public typeEffect: AbilityTypeEffect;
  public damageEffectVC: ValueContainer;
  public healthRecoveryEffectVC: ValueContainer;
  public manaRecoveryEffectVC: ValueContainer;

  public constructor(
    typeEffect: AbilityTypeEffect
  ) {
    this.typeEffect = typeEffect;

    this.damageEffectVC = new ValueContainer(0);
    this.healthRecoveryEffectVC = new ValueContainer(0);
    this.manaRecoveryEffectVC = new ValueContainer(0);
  }
}
