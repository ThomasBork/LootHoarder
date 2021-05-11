import { Area } from "./area";
import { AreaType } from "./area-type";
import { Combat } from "./combat";
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

  public removeArea(areaId: number): void {
    const area = this.game.getArea(areaId);
    for(const hero of this.game.heroes) {
      if (hero.areaHero && area.heroes.includes(hero.areaHero)) {
        hero.areaHero = undefined;
      }
    }

    for(const areaType of this.game.allAreaTypes) {
      const areaIndex = areaType.areas.indexOf(area);
      if (areaIndex >= 0) {
        areaType.areas.splice(areaIndex, 1);
      }
    }

    const areaIndex = this.game.areas.indexOf(area);
    if (areaIndex >= 0) {
      this.game.areas.splice(areaIndex, 1);
    }
  }

  public startCombat(area: Area, combat: Combat, combatNumber: number): void {
    area.changeCombat(combat, combatNumber, this.game.heroes);
  }

  public addCompletedAreaType(areaType: AreaType): void {
    this.game.completedAreaTypes.push(areaType);
    this.game.getGameAreaType(areaType.key).isCompleted = true;
  }

  public addAvailableAreaTypes(areaTypes: AreaType[]): void {
    this.game.availableAreaTypes.push(...areaTypes);
    for(const areaType of areaTypes) {
      this.game.getGameAreaType(areaType.key).isAvailable = true;
    }
  }
}
