import { AccomplishmentDescriptionPart } from "./accomplishment-description-part";
import { AccomplishmentDescriptionPartTypeKey } from "./accomplishment-description-part-type-key";
import { AccomplishmentType } from "./accomplishment-type";
import { MonsterType } from "./monster-type";

export class AccomplishmentTypeDefeatSpecificMonsterType extends AccomplishmentType {
  public monsterType: MonsterType;
  public constructor(
    requiredAmount: number,
    monsterType: MonsterType
  ) {
    super(
      requiredAmount,
      [
        new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.string, 'Defeat the'),
        new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.monsterType, monsterType),
        new AccomplishmentDescriptionPart(AccomplishmentDescriptionPartTypeKey.string, 'monster'),
      ]
    );
    this.monsterType = monsterType;
  }
}
