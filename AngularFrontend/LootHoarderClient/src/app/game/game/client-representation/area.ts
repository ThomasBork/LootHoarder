import { AreaType } from "../static-game-content/area-type";
import { AreaHero } from "./area-hero";
import { Combat } from "./combat";

export class Area {
  public id: number;
  public type: AreaType;
  public heroes: AreaHero[];
  public currentCombat: Combat;
  public totalAmountOfCombats: number;
  public currentCombatNumber: number;

  public constructor(
    id: number,
    type: AreaType,
    heroes: AreaHero[],
    currentCombat: Combat,
    totalAmountOfCombats: number,
    currentCombatNumber: number,
  ) {
    this.id = id;
    this.type = type;
    this.heroes = heroes;
    this.currentCombat = currentCombat;
    this.totalAmountOfCombats = totalAmountOfCombats;
    this.currentCombatNumber = currentCombatNumber;
  }
}