import { Area } from "src/computed-game-state/area/area";
import { Game } from "src/computed-game-state/game";

export class LeaveArea {
  public constructor(
    public readonly game: Game,
    public readonly area: Area,
  ){}
}
