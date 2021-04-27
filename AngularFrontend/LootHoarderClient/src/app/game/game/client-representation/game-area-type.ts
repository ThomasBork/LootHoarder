import { Area } from "./area";
import { AreaType } from "./area-type";

export class GameAreaType {
  public type: AreaType;
  public isCompleted: boolean;
  public isAvailable: boolean;
  public areas: Area[]; 

  public constructor(
    type: AreaType,
    isCompleted: boolean, 
    isAvailable: boolean, 
    areas: Area[]
  ) {
    this.type = type;
    this.isCompleted = isCompleted;
    this.isAvailable = isAvailable;
    this.areas = areas;
  }
}