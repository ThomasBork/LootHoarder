import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersRemoveOnTakingDamage } from "./passive-ability-parameters-remove-on-taking-damage";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbilityRemoveOnTakingDamage extends PassiveAbility {
  public type!: PassiveAbilityType;
  public parameters!: PassiveAbilityParametersRemoveOnTakingDamage;

  public constructor(type: PassiveAbilityType, parameters: PassiveAbilityParametersRemoveOnTakingDamage) {
    super(type, parameters);
  }

  public get description(): string {
    const abilityTags = this.parameters.abilityTags;

    const abilityTagText = abilityTags.length > 0 
      ? this.getAbilityTagList(abilityTags) + ' ' 
      : '';

    return `Removed on taking ${abilityTagText}damage.`;
  }
}
