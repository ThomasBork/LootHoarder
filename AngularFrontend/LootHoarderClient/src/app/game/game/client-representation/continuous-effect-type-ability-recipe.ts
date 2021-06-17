import { PassiveAbilityType } from "./passive-ability-type";

export class ContinuousEffectTypeAbilityRecipe {
  public passiveAbilityType: PassiveAbilityType;
  public parameters: { [keys: string]: string | boolean | number | string[] };

  public constructor(
    passiveAbilityType: PassiveAbilityType,
    parameters: { [keys: string]: string | boolean | number | string[] }
  ) {
    this.passiveAbilityType = passiveAbilityType;
    this.parameters = parameters;
  }
}
