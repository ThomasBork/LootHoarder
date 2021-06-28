import { Game } from "src/computed-game-state/game";

export class SetCurrentHeroBehavior {
  public constructor(
    public readonly game: Game,
    public readonly heroId: number,
    public readonly behaviorId: number | undefined
  ){}
}