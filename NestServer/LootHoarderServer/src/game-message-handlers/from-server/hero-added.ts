import { Game } from "src/computed-game-state/game";
import { Hero } from "../../computed-game-state/hero";

export class HeroAdded {
  public constructor(
    public readonly game: Game,
    public readonly hero: Hero
  ) {
    
  }
}