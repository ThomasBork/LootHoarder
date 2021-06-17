import { ContinuousEffectTypeAbilityRecipe } from "./continuous-effect-type-ability-recipe";

export class ContinuousEffectType {
  public key: string;
  public name: string;
  public isUnique: boolean;
  public abilityRecipes: ContinuousEffectTypeAbilityRecipe[];
  public constructor(
    key: string,
    name: string,
    isUnique: boolean,
    abilityRecipes: ContinuousEffectTypeAbilityRecipe[]
  ) {
    this.key = key;
    this.name = name;
    this.isUnique = isUnique;
    this.abilityRecipes = abilityRecipes;
  }
}