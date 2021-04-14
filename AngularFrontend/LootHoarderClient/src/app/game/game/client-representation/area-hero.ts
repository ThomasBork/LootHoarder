import { CombatCharacter } from "./combat-character";
import { Loot } from "./loot";

export class AreaHero {
  public gameId: number;
  public heroId: number;
  public loot: Loot;
  public combatCharacter: CombatCharacter;

  public constructor(
    gameId: number,
    heroId: number,
    loot: Loot,
    combatCharacter: CombatCharacter
  ) {
    this.gameId = gameId;
    this.heroId = heroId;
    this.loot = loot;
    this.combatCharacter = combatCharacter;
  }
}