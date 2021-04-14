import { Combat } from 'src/computed-game-state/area/combat';
import { Game } from 'src/computed-game-state/game';

export class CombatsManager {
  private combats: Combat[] = [];

  public constructor() {}

  public addCombat(combat: Combat): void {
    this.combats.push(combat);
  }

  public getCombatsInGame(game: Game): Combat[] {
    // Change this to only return the combats that involve heroes from the game with this id.
    return this.combats;
  }
}
