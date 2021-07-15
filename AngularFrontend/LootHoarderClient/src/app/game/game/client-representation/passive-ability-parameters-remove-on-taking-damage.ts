import { PassiveAbilityParameters } from "./passive-ability-parameters";

export class PassiveAbilityParametersRemoveOnTakingDamage extends PassiveAbilityParameters {
  public abilityTags: string[];
  public constructor(
    abilityTags: string[]
  ) {
    super();
    this.abilityTags = abilityTags;
  }
}