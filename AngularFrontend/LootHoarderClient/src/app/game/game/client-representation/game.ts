import { AreaType } from "./area-type";
import { Area } from "./area";
import { Hero } from "./hero";
import { GameAreaType } from "./game-area-type";
import { ContractGameSettings } from "src/loot-hoarder-contract/contract-game-settings";

export class Game {
  public id: number;
  public createdAt: Date;
  public settings: ContractGameSettings;
  public heroes: Hero[];
  public areas: Area[];
  public completedAreaTypes: AreaType[];
  public availableAreaTypes: AreaType[];
  public allAreaTypes: GameAreaType[];

  public constructor(
    id: number,
    createdAt: Date,
    settings: ContractGameSettings,
    heroes: Hero[],
    areas: Area[],
    completedAreaTypes: AreaType[],
    availableAreaTypes: AreaType[],
    allAreaTypes: GameAreaType[],
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.settings = settings;
    this.heroes = heroes;
    this.areas = areas;
    this.completedAreaTypes = completedAreaTypes;
    this.availableAreaTypes = availableAreaTypes;
    this.allAreaTypes = allAreaTypes;
  }

  public getHero(id: number): Hero {
    const hero = this.heroes.find(h => h.id === id);
    if (!hero) {
      throw Error (`Could not find hero with id: ${id}`);
    }
    return hero;
  }

  public getArea(id: number): Area {
    const area = this.areas.find(h => h.id === id);
    if (!area) {
      throw Error (`Could not find area with id: ${id}`);
    }
    return area;
  }

  public getGameAreaType(areaTypeKey: string): GameAreaType {
    const gameAreaType = this.allAreaTypes.find(a => a.type.key === areaTypeKey);
    if (!gameAreaType) {
      throw Error (`Area type with key: ${areaTypeKey} does not exist`);
    }
    return gameAreaType;
  }
}
