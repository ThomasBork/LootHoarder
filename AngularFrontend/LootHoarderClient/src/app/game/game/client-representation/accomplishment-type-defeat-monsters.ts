import { AccomplishmentDescriptionPart } from "./accomplishment-description-part";
import { AccomplishmentDescriptionPartTypeKey } from "./accomplishment-description-part-type-key";
import { AccomplishmentType } from "./accomplishment-type";

export class AccomplishmentTypeDefeatMonsters extends AccomplishmentType {
  public constructor(
    requiredAmount: number
  ) {
    super(
      requiredAmount,
      [
        new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.string, 'Defeat any monster')
      ]
    );
  }
}
