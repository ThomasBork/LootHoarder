import { AccomplishmentDescriptionPart } from "./accomplishment-description-part";
import { AccomplishmentDescriptionPartTypeKey } from "./accomplishment-description-part-type-key";
import { AccomplishmentType } from "./accomplishment-type";

export class AccomplishmentTypeSpecial extends AccomplishmentType {
  public description: string;
  public constructor(
    requiredAmount: number,
    description: string
  ) {
    super(
      requiredAmount,
      [new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.string, description)]
    );
    this.description = description;
  }
}
