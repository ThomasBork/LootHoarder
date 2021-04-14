import { Injectable } from "@nestjs/common";
import { AreaType } from "./area-type";
import AreaTypes from "./area-types.json";
import AreaTypeTransitions from "./area-type-transitions.json";

@Injectable()
export class StaticGameContentService {
  private areaTypes!: AreaType[];

  public constructor(
  ) {
    this.loadAssets();
  }

  public getAreaType(key: string): AreaType {
    const areaType = this.areaTypes.find(x => x.key === key);
    if (!areaType) {
      throw Error (`Area type '${key}' not found.`);
    }
    return areaType;
  }

  private loadAssets(): void {
    this.loadAreaTypes();
  }

  private loadAreaTypes(): void {
    this.areaTypes = AreaTypes.map(a => new AreaType(
      a.key,
      a.name,
      a.description,
      a.level
    ));

    for(let transition of AreaTypeTransitions) {
      const areaType1 = this.getAreaType(transition[0]);
      const areaType2 = this.getAreaType(transition[1]);
      areaType1.adjacentAreaTypes.push(areaType2);
      areaType2.adjacentAreaTypes.push(areaType1);
    }
  }
}