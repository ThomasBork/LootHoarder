import { CombatCharacter } from "./combat-character";
import { Hero } from "./hero";

export class AreaHero {
  public gameHero: Hero;
  public combatCharacter: CombatCharacter;

  public constructor(
    gameHero: Hero,
    combatCharacter: CombatCharacter,
  ) {
    this.gameHero = gameHero;
    this.combatCharacter = combatCharacter;
  }
}