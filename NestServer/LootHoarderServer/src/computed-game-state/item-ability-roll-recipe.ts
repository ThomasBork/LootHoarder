import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { ItemAbilityRecipe } from "./item-ability-recipe";

export class ItemAbilityRollRecipe {
  public itemCategories: ContractItemCategory[];
  public weight: number;
  public recipe: ItemAbilityRecipe;
  public constructor(
    itemCategories: ContractItemCategory[],
    weight: number,
    recipe: ItemAbilityRecipe,
  ) {
    this.itemCategories = itemCategories;
    this.weight = weight;
    this.recipe = recipe;
  }
}
