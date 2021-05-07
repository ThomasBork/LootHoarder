import { ContractAreaHero } from "src/loot-hoarder-contract/contract-area-hero";
import { DbAreaHero } from "src/raw-game-state/db-area-hero";
import { GamesManager } from "src/services/games-manager";
import { Hero } from "../hero";
import { CombatCharacter } from "./combat-character";
import { Loot } from "./loot";

export class AreaHero {
  public dbModel: DbAreaHero;
  public hero: Hero;
  public combatCharacter: CombatCharacter;

  private constructor(
    dbModel: DbAreaHero, 
    hero: Hero,
    combatCharacter: CombatCharacter
  ) {
    this.dbModel = dbModel;
    this.hero = hero;
    this.combatCharacter = combatCharacter;
  }
  
  public get gameId(): number { return this.dbModel.gameId; }
  public get heroId(): number { return this.dbModel.heroId; }

  public toContractModel(): ContractAreaHero {
    return {
      gameId: this.dbModel.gameId,
      heroId: this.dbModel.heroId,
      combatCharacterId: this.dbModel.combatCharacterId
    };
  }

  public static load(dbModel: DbAreaHero, combatCharacter: CombatCharacter): AreaHero {
    const gamesManager = GamesManager.instance;
    const hero = gamesManager.getHero(dbModel.gameId, dbModel.heroId);
    if (!hero) {
      throw Error (`Hero not found. GameId: ${dbModel.gameId}, HeroId: ${dbModel.heroId}`);
    }
    const areaHero = new AreaHero(dbModel, hero, combatCharacter);
    return areaHero;
  }
}
