import { CombatCharacter } from "./combat-character";
import { Loot } from "./loot";

export class AreaHero {
  public gameId: number;
  public heroId: number;
  public combatCharacter: CombatCharacter;

  public constructor(
    gameId: number,
    heroId: number,
    combatCharacter: CombatCharacter
  ) {
    this.gameId = gameId;
    this.heroId = heroId;
    this.combatCharacter = combatCharacter;
  }
}