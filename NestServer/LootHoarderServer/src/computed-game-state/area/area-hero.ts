import { DbAreaHero } from "src/raw-game-state/db-area-hero";
import { GamesManager } from "src/services/games-manager";
import { StaticGameContentService } from "src/static-game-content/static-game-content-service";
import { UIAreaHero } from "src/ui-game-state/ui-area-hero";
import { Hero } from "../hero";

export class AreaHero {
  public dbModel: DbAreaHero;
  public hero: Hero;

  private constructor(dbModel: DbAreaHero, hero: Hero) {
    this.dbModel = dbModel;
    this.hero = hero;
  }

  public getUIState(): UIAreaHero {
    return {
      gameId: this.dbModel.gameId,
      heroId: this.dbModel.heroId,
      combatCharacterId: this.dbModel.combatCharacterId,
      loot: {
        gold: 0,
        items: []
      }
    };
  }

  public static load(dbModel: DbAreaHero, staticContent: StaticGameContentService): AreaHero {
    const gamesManager = GamesManager.getInstance();
    const hero = gamesManager.getHero(dbModel.gameId, dbModel.heroId);
    if (!hero) {
      throw Error (`Hero not found. GameId: ${dbModel.gameId}, HeroId: ${dbModel.heroId}`);
    }
    const areaHero = new AreaHero(dbModel, hero);
    return areaHero;
  }
}