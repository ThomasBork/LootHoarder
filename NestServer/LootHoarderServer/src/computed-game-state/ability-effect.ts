import { ContractAbilityEffect } from "src/loot-hoarder-contract/contract-ability-effect";
import { AbilityType } from "./ability-type";
import { AbilityTypeEffect } from "./ability-type-effect";
import { ValueContainer } from "./value-container";

export class AbilityEffect {
  public abilityType: AbilityType;
  public abilityTypeEffect: AbilityTypeEffect;
  public damageEffectVC: ValueContainer;

  public constructor(
    abilityType: AbilityType,
    abilityTypeEffect: AbilityTypeEffect
  ) {
    this.abilityType = abilityType;
    this.abilityTypeEffect = abilityTypeEffect;

    this.damageEffectVC = new ValueContainer(0);
  }

  public toContractModel(): ContractAbilityEffect {
    const abilityTypeEffectTypeIndex = this.abilityType.effects.indexOf(this.abilityTypeEffect);
    return {
      abilityTypeKey: this.abilityType.key,
      abilityTypeEffectTypeIndex: abilityTypeEffectTypeIndex,
      damageEffect: this.damageEffectVC.value
    };
  }
}
