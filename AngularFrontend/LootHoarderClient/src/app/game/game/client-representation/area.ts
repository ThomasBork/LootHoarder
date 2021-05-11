import { AreaType } from "./area-type";
import { AreaHero } from "./area-hero";
import { Combat } from "./combat";
import { Loot } from "./loot";
import { Item } from "./item";
import { Hero } from "./hero";

export class Area {
  public id: number;
  public type: AreaType;
  public heroes: AreaHero[];
  public currentCombat: Combat;
  public totalAmountOfCombats: number;
  public currentCombatNumber: number;
  public loot: Loot;

  public constructor(
    id: number,
    type: AreaType,
    heroes: AreaHero[],
    currentCombat: Combat,
    totalAmountOfCombats: number,
    currentCombatNumber: number,
    loot: Loot,
  ) {
    this.id = id;
    this.type = type;
    this.heroes = heroes;
    this.currentCombat = currentCombat;
    this.totalAmountOfCombats = totalAmountOfCombats;
    this.currentCombatNumber = currentCombatNumber;
    this.loot = loot;
  }

  public changeCombat(combat: Combat, combatNumber: number, gameHeroes: Hero[]): void {
    this.currentCombat = combat;
    this.currentCombatNumber = combatNumber;
    const allCharacters = combat.getAllCharacters();
    for(const hero of this.heroes) {
      const character = allCharacters.find(c => c.id === hero.combatCharacter.id);
      if (!character) {
        throw Error (`Combat character with id ${hero.combatCharacter.id} was not found.`);
      }
      const gameHero = gameHeroes.find(h => h.id === hero.heroId);
      if (!gameHero) {
        throw Error (`Hero with id: ${hero.heroId} was not found`);
      }
      character.hero = gameHero;
      hero.combatCharacter = character;
    }
  }

  public addItemToLoot(item: Item): void {
    this.loot.items.push(item);
  }
}