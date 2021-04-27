import { Area } from "./area";
import { Game } from "./game";
import { Hero } from "./hero";
import { WorldTab } from "./world-tab";

export class UIState {
  public game: Game;
  public worldTab: WorldTab;

  public constructor(game: Game) {
    this.game = game;
    this.worldTab = new WorldTab();
  }

  public addHero(hero: Hero): void {
    this.game.heroes.push(hero);
  }

  public addArea(area: Area): void {
    const gameAreaType = this.game.allAreaTypes.find(areaType => area.type === areaType.type);
    if (!gameAreaType) {
      throw Error (`Area type ${area.type.key} was not found.`);
    }
    gameAreaType.areas.push(area);
    this.game.areas.push(area);

    for(const hero of this.game.heroes) {
      const areaHero = area.heroes.find(ah => 
        ah.gameId === this.game.id
        && ah.heroId === hero.id
      );
      if (areaHero) {
        hero.areaHero = areaHero;
      }
    }
  }
}
