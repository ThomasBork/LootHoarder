import { AreaType } from "./area-type";
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

  public changeCombat(combat: Combat, combatNumber: number): void {
    this.currentCombat = combat;
    this.currentCombatNumber = combatNumber;
    const allCharacters = combat.getAllCharacters();
    for(const hero of this.heroes) {
      const character = allCharacters.find(c => c.id === hero.combatCharacter.id);
      if (!character) {
        throw Error (`Combat character with id ${hero.combatCharacter.id} was not found.`);
      }
      hero.combatCharacter = character;
    }
  }
}