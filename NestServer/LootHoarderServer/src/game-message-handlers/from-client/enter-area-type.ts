import { Game } from "src/computed-game-state/game";

export class EnterAreaType {
  public constructor(
    public readonly game: Game,
    public readonly areaTypeKey: string,
    public readonly heroIds: number[]
  ){}
}
