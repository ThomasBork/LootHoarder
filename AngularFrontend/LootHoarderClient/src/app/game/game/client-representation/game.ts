import { AreaType } from "./area-type";
import { Area } from "./area";
import { Hero } from "./hero";
import { GameAreaType } from "./game-area-type";
import { ContractGameSettings } from "src/loot-hoarder-contract/contract-game-settings";
import { Item } from "./item";

export class Game {
  public id: number;
  public createdAt: Date;
  public settings: ContractGameSettings;
  public heroes: Hero[];
  public areas: Area[];
  public completedAreaTypes: AreaType[];
  public availableAreaTypes: AreaType[];
  public allAreaTypes: GameAreaType[];
  public items: Item[];
  public maximumAmountOfHeroes: number;

  public constructor(
    id: number,
    createdAt: Date,
    settings: ContractGameSettings,
    heroes: Hero[],
    areas: Area[],
    completedAreaTypes: AreaType[],
    availableAreaTypes: AreaType[],
    allAreaTypes: GameAreaType[],
    items: Item[],
    maximumAmountOfHeroes: number,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.settings = settings;
    this.heroes = heroes;
    this.areas = areas;
    this.completedAreaTypes = completedAreaTypes;
    this.availableAreaTypes = availableAreaTypes;
    this.allAreaTypes = allAreaTypes;
    this.items = items;
    this.maximumAmountOfHeroes = maximumAmountOfHeroes;
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

  public getItem(id: number): Item {
    const item = this.items.find(h => h.id === id);
    if (!item) {
      throw Error (`Could not find item with id: ${id}`);
    }
    return item;
  }

  public getGameAreaType(areaTypeKey: string): GameAreaType {
    const gameAreaType = this.allAreaTypes.find(a => a.type.key === areaTypeKey);
    if (!gameAreaType) {
      throw Error (`Area type with key: ${areaTypeKey} does not exist`);
    }
    return gameAreaType;
  }

  public addItem(item: Item): void {
    this.items.push(item);
  }

  public removeItem(item: Item): void {
    this.items = this.items.filter(i => i !== item);
  }

  public removeHero(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
  }
}
