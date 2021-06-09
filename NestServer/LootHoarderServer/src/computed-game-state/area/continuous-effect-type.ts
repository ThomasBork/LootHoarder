import { ContinuousEffectTypeAbilityRecipe } from "./continuous-effect-type-ability-recipe";

export class ContinuousEffectType {
  public key: string;
  public isUnique: boolean;
  public abilityRecipes: ContinuousEffectTypeAbilityRecipe[];
  public constructor(
    key: string,
    isUnique: boolean,
    abilityRecipes: ContinuousEffectTypeAbilityRecipe[]
  ) {
    this.key = key;
    this.isUnique = isUnique;
    this.abilityRecipes = abilityRecipes;
  }
}
