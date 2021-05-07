import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category"
import { ItemAbilityRecipe } from "./item-ability-recipe";
export class ItemType {
  public key: string;
  public name: string;
  public category: ContractItemCategory;
  public innateAbilityRecipes: ItemAbilityRecipe[];

  public constructor(
    key: string,
    name: string,
    category: ContractItemCategory,
    innateAbilityRecipes: ItemAbilityRecipe[],
  ) {
    this.key = key;
    this.name = name;
    this.category = category;
    this.innateAbilityRecipes = innateAbilityRecipes;
  }
}
