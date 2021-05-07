import { Injectable } from "@nestjs/common";
import { Game } from "src/computed-game-state/game";
import { Item } from "src/computed-game-state/item";
import { ItemAbilityRecipe } from "src/computed-game-state/item-ability-recipe";
import { WeightedElement } from "src/computed-game-state/weighted-element";
import { DbItem } from "src/raw-game-state/db-item";
import { DbItemAbility } from "src/raw-game-state/db-item-ability";
import { RandomService } from "./random-service";
import { StaticGameContentService } from "./static-game-content-service";

@Injectable()
export class ItemSpawnerService {
  public static instance: ItemSpawnerService;

  public constructor(
    private readonly randomService: RandomService,
    private readonly staticGameContentService: StaticGameContentService
  ) {
    ItemSpawnerService.instance = this;
  }

  public spawnItem(game: Game, level: number): Item {
    const itemTypes = this.staticGameContentService.getAllItemTypes();
    const itemType = this.randomService.randomElementInArray(itemTypes);
    const innateAbilities = itemType.innateAbilityRecipes.map(recipe => this.createItemAbilityFromItemAbilityRecipe(recipe));
    const dbItem: DbItem = {
      id: game.getNextItemId(),
      typeKey: itemType.key,
      innateAbilities: innateAbilities,
      additionalAbilities: []
    };

    const item = Item.load(dbItem);
    return item;
  }

  private createItemAbilityFromItemAbilityRecipe(recipe: ItemAbilityRecipe): DbItemAbility {
    return {
      typeKey: recipe.type.key,
      parameters: recipe.parameters
    };
  }
}
