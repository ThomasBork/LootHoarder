import { AreaType } from "./area-type";
import { Area } from "./area";
import { Hero } from "./hero";
import { GameAreaType } from "./game-area-type";

export class Game {
  public id: number;
  public createdAt: Date;
  public heroes: Hero[];
  public areas: Area[];
  public completedAreaType: AreaType[];
  public availableAreaType: AreaType[];
  public allAreaTypes: GameAreaType[];

  public constructor(
    id: number,
    createdAt: Date,
    heroes: Hero[],
    areas: Area[],
    completedAreaType: AreaType[],
    availableAreaType: AreaType[],
    allAreaTypes: GameAreaType[],
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.heroes = heroes;
    this.areas = areas;
    this.completedAreaType = completedAreaType;
    this.availableAreaType = availableAreaType;
    this.allAreaTypes = allAreaTypes;
  }
}
