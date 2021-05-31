import { Game } from "src/computed-game-state/game";

export class TakeHeroSkillNode {
  public constructor(
    public readonly game: Game,
    public readonly heroId: number,
    public readonly nodeX: number,
    public readonly nodeY: number,
  ){}
}
