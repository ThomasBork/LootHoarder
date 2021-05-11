import { ItemAbilityRecipeParameters } from "./item-ability-recipe-parameters";
import { ItemAbilityType } from "./item-ability-type";

export class ItemAbilityRecipe {
  public type: ItemAbilityType;
  public parameters: ItemAbilityRecipeParameters;

  public constructor(type: ItemAbilityType, parameters: ItemAbilityRecipeParameters) {
    this.type = type;
    this.parameters = parameters;
  }
}
