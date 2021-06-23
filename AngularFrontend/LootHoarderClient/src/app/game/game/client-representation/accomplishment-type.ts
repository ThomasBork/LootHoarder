import { AccomplishmentDescriptionPart } from "./accomplishment-description-part";

export abstract class AccomplishmentType {
  public requiredAmount: number;
  public descriptionParts: AccomplishmentDescriptionPart[];
  protected constructor(
    requiredAmount: number,
    descriptionParts: AccomplishmentDescriptionPart[]
  ) {
    this.requiredAmount = requiredAmount;
    this.descriptionParts = descriptionParts;
  }
}
