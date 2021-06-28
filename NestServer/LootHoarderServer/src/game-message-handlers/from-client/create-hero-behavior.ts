import { Game } from "src/computed-game-state/game";

export class CreateHeroBehavior {
  public constructor(
    public readonly game: Game,
    public readonly heroId: number
  ){}
}