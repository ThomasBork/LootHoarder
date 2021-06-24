import { AccomplishmentDescriptionPart } from "./accomplishment-description-part";
import { AccomplishmentDescriptionPartTypeKey } from "./accomplishment-description-part-type-key";
import { AccomplishmentType } from "./accomplishment-type";

export class AccomplishmentTypeFullInventory extends AccomplishmentType {
  public constructor(
    requiredAmount: number
  ) {
    super(
      requiredAmount,
      [new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.string, 'Have a hero wear one item in each item slot')]
    );
  }
}
