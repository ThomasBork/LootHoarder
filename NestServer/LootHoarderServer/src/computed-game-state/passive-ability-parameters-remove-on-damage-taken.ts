import { PassiveAbilityParameters } from "./passive-ability-parameters";

export class PassiveAbilityParametersRemoveOnDamageTaken extends PassiveAbilityParameters {
  public abilityTags: string[];
  public constructor(
    abilityTags: string[]
  ) {
    super();
    this.abilityTags = abilityTags;
  }
}
