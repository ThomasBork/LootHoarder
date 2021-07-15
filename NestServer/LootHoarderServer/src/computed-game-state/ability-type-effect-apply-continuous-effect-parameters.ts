import { DbPassiveAbility } from "src/raw-game-state/db-passive-ability";
import { DbPassiveAbilityParameters } from "src/raw-game-state/db-passive-ability-parameters";
import { ContinuousEffectType } from "./area/continuous-effect-type";

export class AbilityTypeEffectApplyContinuousEffectParameters {
  public continuousEffectType: ContinuousEffectType;
  public duration: number;
  public additionalAbilityParameters: { [keys: string]: string | boolean | number | string[] }[];

  public constructor(
    continuousEffectType: ContinuousEffectType,
    duration: number,
    additionalAbilityParameters: { [keys: string]: string | boolean | number | string[] }[],
  ) {
    this.continuousEffectType = continuousEffectType;
    this.duration = duration;
    this.additionalAbilityParameters = additionalAbilityParameters;

    this.validateInput();
  }

  
  public buildDbPassiveAbilities(): DbPassiveAbility[] {
    const dbPassiveAbilities: DbPassiveAbility[] = [];
    for(let i = 0; i<this.continuousEffectType.abilityRecipes.length; i++) {
      const recipe = this.continuousEffectType.abilityRecipes[i];
      const additionalParameters = this.additionalAbilityParameters[i];
      const dbParameters: DbPassiveAbilityParameters = {};
      for(let recipeParameterKey of Object.keys(recipe.parameters)) {
        const value = recipe.parameters[recipeParameterKey];
        dbParameters[recipeParameterKey] = value;
      }
      for(let additionalParameterKey of Object.keys(additionalParameters)) {
        const value = additionalParameters[additionalParameterKey];
        dbParameters[additionalParameterKey] = value;
      }
      const dbPassiveAbility: DbPassiveAbility = {
        typeKey: recipe.passiveAbilityType.key,
        parameters: dbParameters
      }
      dbPassiveAbilities.push(dbPassiveAbility);
    }
    return dbPassiveAbilities;
  }

  private validateInput(): void {
    const recipeAmount = this.continuousEffectType.abilityRecipes.length;
    const parametersAmount = this.additionalAbilityParameters.length;
    if (recipeAmount !== parametersAmount) {
      throw Error (`The continuous effect type ${this.continuousEffectType.key} has ${recipeAmount} ability recipes, but ${parametersAmount} parameters were provided.`);
    }

    for(let i = 0; i<this.continuousEffectType.abilityRecipes.length; i++) {
      const recipe = this.continuousEffectType.abilityRecipes[i];
      const additionalParameters = this.additionalAbilityParameters[i];
      for(const requiredParameterKey of recipe.requiredDataParameters) {
        if (!additionalParameters.hasOwnProperty(requiredParameterKey)) {
          throw Error (`The continuous effect type ${this.continuousEffectType.key} has a required parameter "${requiredParameterKey} which is not present in this ability type."`);
        }
      }
    }
  }
}