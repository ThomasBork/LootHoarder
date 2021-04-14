import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { Game } from "src/computed-game-state/game";
import { Hero } from "../../computed-game-state/hero";

export class CombatCharacterCurrentHealthChanged {
  public constructor(
    public readonly game: Game,
    public readonly combatId: number,
    public readonly character: CombatCharacter,
    public readonly newCurrentHealth: number
  ) {
    
  }
}