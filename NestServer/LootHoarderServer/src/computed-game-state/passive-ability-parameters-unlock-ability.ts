import { PassiveAbilityParameters } from "./passive-ability-parameters";

export class PassiveAbilityParametersUnlockAbility extends PassiveAbilityParameters {
  public abilityTypeKey: string;
  public constructor(
    abilityTypeKey: string
  ) {
    super();
    this.abilityTypeKey = abilityTypeKey;
  }
}