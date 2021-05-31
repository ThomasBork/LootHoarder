import { ItemAbilityRecipeParameters } from "./item-ability-recipe-parameters";
import { PassiveAbilityType } from "./passive-ability-type";

export class ItemAbilityRecipe {
  public type: PassiveAbilityType;
  public parameters: ItemAbilityRecipeParameters;

  public constructor(type: PassiveAbilityType, parameters: ItemAbilityRecipeParameters) {
    this.type = type;
    this.parameters = parameters;
  }
}
