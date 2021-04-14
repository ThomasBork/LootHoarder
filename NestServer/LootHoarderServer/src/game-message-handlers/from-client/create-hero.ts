import { Game } from "src/computed-game-state/game";

export class CreateHero {
  public constructor(
    public readonly game: Game,
    public readonly typeKey: string,
    public readonly name: string
  ){}
}