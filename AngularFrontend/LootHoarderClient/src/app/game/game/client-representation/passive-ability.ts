import { AbilityTagTranslator } from "src/app/shared/ability-tag-translator";
import { PassiveAbilityParameters } from "./passive-ability-parameters";
import { PassiveAbilityType } from "./passive-ability-type";

export abstract class PassiveAbility {
  public type: PassiveAbilityType;
  public parameters: PassiveAbilityParameters;

  public constructor(type: PassiveAbilityType, parameters: PassiveAbilityParameters) {
    this.type = type;
    this.parameters = parameters;
  }

  public abstract get description(): string;

  protected getAbilityTagList(abilityTags: string[]): string {
    return abilityTags
      .map(tag => AbilityTagTranslator.translate(tag))
      .join(' ');
  }
}