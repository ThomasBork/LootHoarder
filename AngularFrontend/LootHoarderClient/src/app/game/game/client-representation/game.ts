import { AreaType } from "../static-game-content/area-type";
import { Area } from "./area";
import { Hero } from "./hero";

export class Game {
  public id: number;
  public createdAt: Date;
  public heroes: Hero[];
  public areas: Area[];
  public completedAreaType: AreaType[];
  public availableAreaType: AreaType[];

  public constructor(
    id: number,
    createdAt: Date,
    heroes: Hero[],
    areas: Area[],
    completedAreaType: AreaType[],
    availableAreaType: AreaType[],
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.heroes = heroes;
    this.areas = areas;
    this.completedAreaType = completedAreaType;
    this.availableAreaType = availableAreaType;
  }
}
