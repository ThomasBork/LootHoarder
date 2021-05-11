import { Injectable } from "@nestjs/common";
import { Game } from "src/computed-game-state/game";
import { Item } from "src/computed-game-state/item";
import { ItemAbilityRecipe } from "src/computed-game-state/item-ability-recipe";
import { ItemType } from "src/computed-game-state/item-type";
import { ValueRange } from "src/computed-game-state/value-range";
import { WeightedElement } from "src/computed-game-state/weighted-element";
import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { DbItem } from "src/raw-game-state/db-item";
import { DbItemAbility } from "src/raw-game-state/db-item-ability";
import { DbItemAbilityParameters } from "src/raw-game-state/db-item-ability-parameters";
import { RandomService } from "./random-service";
import { StaticGameContentService } from "./static-game-content-service";

@Injectable()
export class ItemSpawnerService {
  public static instance: ItemSpawnerService;

  private itemCategoryAbilityRollRecipes: Map<ContractItemCategory, WeightedElement<ItemAbilityRecipe>[]>;

  public constructor(
    private readonly randomService: RandomService,
    private readonly staticGameContentService: StaticGameContentService
  ) {
    ItemSpawnerService.instance = this;
    this.itemCategoryAbilityRollRecipes = new Map();
    this.setUpItemCategoryAbilityRollRecipes();
  }

  public spawnItem(game: Game, level: number): Item {
    const itemTypes = this.staticGameContentService.getAllItemTypes();
    const itemType = this.randomService.randomElementInArray(itemTypes);
    const innateAbilities = itemType.innateAbilityRecipes.map(recipe => this.createItemAbilityFromItemAbilityRecipe(recipe));
    const amountOfAdditionalAbilities = this.randomService.randomInteger(1, 3);
    const additionalAbilities = this.createNItemAbilities(itemType.category, amountOfAdditionalAbilities);
    const dbItem: DbItem = {
      id: game.getNextItemId(),
      typeKey: itemType.key,
      innateAbilities: innateAbilities,
      additionalAbilities: additionalAbilities
    };

    const item = Item.load(dbItem);
    return item;
  }

  public spawnStarterItem(game: Game, itemType: ItemType): DbItem {
    const innateAbilities = itemType.innateAbilityRecipes.map(recipe => this.createItemAbilityFromItemAbilityRecipe(recipe));
    const dbItem: DbItem = {
      id: game.getNextItemId(),
      typeKey: itemType.key,
      innateAbilities: innateAbilities,
      additionalAbilities: []
    };
    return dbItem;
  }

  private setUpItemCategoryAbilityRollRecipes(): void {
    const allItemRollRecipes = this.staticGameContentService.getAllItemAbilityRollRecipes();
    for(const itemRollRecipe of allItemRollRecipes) {
      for(const itemCategory of itemRollRecipe.itemCategories) {
        let weights = this.itemCategoryAbilityRollRecipes.get(itemCategory);
        if (!weights) {
          weights = [];
          this.itemCategoryAbilityRollRecipes.set(itemCategory, weights);
        }
        weights.push(new WeightedElement(itemRollRecipe.weight, itemRollRecipe.recipe));
      }
    }
  }

  private createNItemAbilities(itemCategory: ContractItemCategory, amount: number): DbItemAbility[] {
    const abilityRecipesForCategory = this.itemCategoryAbilityRollRecipes.get(itemCategory);
    if (!abilityRecipesForCategory) {
      throw Error (`Item category ${itemCategory} has no item ability recipes`);
    }
    const selectedAbilityRecipes = this.randomService.randomNWeightedElements(abilityRecipesForCategory, amount);
    const dbItemAbilities = selectedAbilityRecipes.map(recipe => this.createItemAbilityFromItemAbilityRecipe(recipe));
    return dbItemAbilities;
  }

  private createItemAbilityFromItemAbilityRecipe(recipe: ItemAbilityRecipe): DbItemAbility {
    const dbParameters: DbItemAbilityParameters = {};
    for(const key of Object.keys(recipe.parameters)) {
      let value = recipe.parameters[key];
      if (value instanceof ValueRange) {
        if (value.isInteger) {
          value = this.randomService.randomInteger(value.min, value.max);
        } else {
          value = this.randomService.randomFloat(value.min, value.max);
        }
      }
      dbParameters[key] = value;
    }
    return {
      typeKey: recipe.type.key,
      parameters: dbParameters
    };
  }
}
