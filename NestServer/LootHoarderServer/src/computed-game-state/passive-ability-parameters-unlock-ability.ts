import { AbilityType } from "./ability-type";
import { PassiveAbilityParameters } from "./passive-ability-parameters";

export class PassiveAbilityParametersUnlockAbility extends PassiveAbilityParameters {
  public abilityType: AbilityType;
  public constructor(
    abilityType: AbilityType
  ) {
    super();
    this.abilityType = abilityType;
  }
}