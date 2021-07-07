import { Injectable } from "@nestjs/common";
import { Game } from "src/computed-game-state/game";
import { Item } from "src/computed-game-state/item";
import { ItemAbilityRecipe } from "src/computed-game-state/item-ability-recipe";
import { ItemType } from "src/computed-game-state/item-type";
import { ValueRange } from "src/computed-game-state/value-range";
import { WeightedElement } from "src/computed-game-state/weighted-element";
import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { DbItem } from "src/raw-game-state/db-item";
import { DbItemPassiveAbility } from "src/raw-game-state/db-item-passive-ability";
import { DbPassiveAbilityParameters } from "src/raw-game-state/db-passive-ability-parameters";
import { RandomService } from "./random-service";
import { StaticGameContentService } from "./static-game-content-service";

@Injectable()
export class ItemSpawnerService {
  public static instance: ItemSpawnerService;

  private itemCategoryAbilityRollRecipes: Map<ContractItemCategory, WeightedElement<ItemAbilityRecipe>[]>;

  private weightedAmountOfAbilities!: WeightedElement<number>[];

  public constructor(
    private readonly randomService: RandomService,
    private readonly staticGameContentService: StaticGameContentService
  ) {
    ItemSpawnerService.instance = this;
    this.itemCategoryAbilityRollRecipes = new Map();
    this.setUpItemCategoryAbilityRollRecipes();
    this.setUpWeightedAmountOfAbilities();
  }

  public spawnItem(game: Game, level: number): Item {
    const itemTypes = this.staticGameContentService.getAllItemTypes();
    const itemType = this.randomService.randomElementInArray(itemTypes);
    const innateAbilities = itemType.innateAbilityRecipes.map(recipe => this.createItemAbilityFromItemAbilityRecipe(recipe, level));

    const amountOfAdditionalAbilities = this.randomService.randomWeightedElement(this.weightedAmountOfAbilities);
    const additionalAbilities = this.createNItemAbilities(itemType.category, amountOfAdditionalAbilities, level);
    const dbItem: DbItem = {
      id: game.getNextItemId(),
      typeKey: itemType.key,
      innateAbilities: innateAbilities,
      additionalAbilities: additionalAbilities,
      level: level
    };

    const item = Item.load(dbItem);
    return item;
  }

  public spawnStarterItem(game: Game, itemType: ItemType): DbItem {
    const innateAbilities = itemType.innateAbilityRecipes.map(recipe => this.createItemAbilityFromItemAbilityRecipe(recipe, 1));
    const dbItem: DbItem = {
      id: game.getNextItemId(),
      typeKey: itemType.key,
      innateAbilities: innateAbilities,
      additionalAbilities: [],
      level: 1
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

  private setUpWeightedAmountOfAbilities(): void {
    this.weightedAmountOfAbilities = [
      new WeightedElement(500, 1),
      new WeightedElement(1500, 2),
      new WeightedElement(1500, 3),
      new WeightedElement(500, 4),
    ];
  }

  private createNItemAbilities(itemCategory: ContractItemCategory, amount: number, maxLevel: number): DbItemPassiveAbility[] {
    const abilityRecipesForCategory = this.itemCategoryAbilityRollRecipes.get(itemCategory);
    if (!abilityRecipesForCategory) {
      throw Error (`Item category ${itemCategory} has no item ability recipes`);
    }
    const selectedAbilityRecipes = this.randomService.randomNWeightedElements(abilityRecipesForCategory, amount);
    const dbItemAbilities = selectedAbilityRecipes.map(recipe => {
      const level = this.randomService.randomInteger(1, maxLevel);
      return this.createItemAbilityFromItemAbilityRecipe(recipe, level);
    });
    return dbItemAbilities;
  }

  private createItemAbilityFromItemAbilityRecipe(recipe: ItemAbilityRecipe, abilityLevel: number): DbItemPassiveAbility {
    const dbParameters: DbPassiveAbilityParameters = {};
    for(const key of Object.keys(recipe.parameters)) {
      let value = recipe.parameters[key];
      if (value instanceof ValueRange) {
        const levelScalingInterval = this.calculateLevelScalingInterval(abilityLevel, value.min, value.max, value.levelScaling);
        if (value.isInteger) {
          const min = Math.floor(levelScalingInterval.min) + 1;
          const max = Math.floor(levelScalingInterval.max);
          value = this.randomService.randomInteger(min, max);
        } else {
          value = this.randomService.randomFloat(levelScalingInterval.min, levelScalingInterval.max);
        }
      }
      dbParameters[key] = value;
    }
    return {
      level: abilityLevel,
      ability: {
        typeKey: recipe.type.key,
        parameters: dbParameters
      }
    };
  }

  private calculateLevelScalingInterval(
    level: number, 
    level1Min: number, 
    level1Max: number, 
    levelScaling: number
  ): LevelScalingInterval {
    let minFactor = 0;
    for(let i = 0; i<level - 1; i++) {
      minFactor += Math.pow(levelScaling, i);
    }
    const maxFactor = minFactor + Math.pow(levelScaling, level - 1);

    const minMaxDelta = level1Max - level1Min;
    const min = level1Min + minMaxDelta * minFactor;
    const max = level1Min + minMaxDelta * maxFactor;

    return {
      min: min,
      max: max
    };
  }
}

interface LevelScalingInterval {
  min: number;
  max: number;
}
