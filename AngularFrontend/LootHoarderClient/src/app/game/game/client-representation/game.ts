import { AreaType } from "./area-type";
import { Area } from "./area";
import { Hero } from "./hero";
import { GameAreaType } from "./game-area-type";
import { ContractGameSettings } from "src/loot-hoarder-contract/contract-game-settings";
import { Item } from "./item";
import { GameTabReference } from "./game-tab-reference";
import { Quest } from "./quest";
import { Achievement } from "./achievement";

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
  public quests: Quest[];
  public achievements: Achievement[];
  public maximumAmountOfHeroes: number;
  public disabledGameTabs: GameTabReference[]

  public constructor(
    id: number,
    createdAt: Date,
    settings: ContractGameSettings,
    heroes: Hero[],
    areas: Area[],
    completedAreaTypes: AreaType[],
    availableAreaTypes: AreaType[],
    allAreaTypes: GameAreaType[],
    disabledGameTabs: GameTabReference[],
    items: Item[],
    quests: Quest[],
    achievements: Achievement[],
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
    this.disabledGameTabs = disabledGameTabs;
    this.items = items;
    this.quests = quests;
    this.achievements = achievements;
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

  public getQuest(questTypeKey: string): Quest {
    const quest = this.quests.find(q => q.type.key === questTypeKey);
    if (!quest) {
      throw Error (`Could not find quest with type key: ${questTypeKey}`);
    }
    return quest;
  }

  public getAchievement(achievementTypeKey: string): Achievement {
    const achievement = this.achievements.find(q => q.type.key === achievementTypeKey);
    if (!achievement) {
      throw Error (`Could not find achievement with type key: ${achievementTypeKey}`);
    }
    return achievement;
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
