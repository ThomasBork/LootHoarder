import { AccomplishmentType } from "./accomplishment-type";
import { AreaType } from "./area/area-type";

export class AccomplishmentTypeCompleteSpecificAreaType extends AccomplishmentType {
  public areaType: AreaType;
  public constructor(
    requiredAmount: number,
    areaType: AreaType
  ) {
    super(requiredAmount);
    this.areaType = areaType;
  }
}
