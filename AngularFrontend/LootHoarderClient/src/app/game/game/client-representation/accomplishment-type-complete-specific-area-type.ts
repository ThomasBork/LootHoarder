import { AccomplishmentDescriptionPart } from "./accomplishment-description-part";
import { AccomplishmentDescriptionPartTypeKey } from "./accomplishment-description-part-type-key";
import { AccomplishmentType } from "./accomplishment-type";
import { AreaType } from "./area-type";

export class AccomplishmentTypeCompleteSpecificAreaType extends AccomplishmentType {
  public areaType: AreaType;
  public constructor(
    requiredAmount: number,
    areaType: AreaType
  ) {
    super(
      requiredAmount,
      [
        new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.string, 'Complete the'),
        new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.areaType, areaType)
      ]
    );

    this.areaType = areaType;
  }
}
