import { AccomplishmentType } from "./accomplishment-type";
import { MonsterType } from "./area/monster-type";

export class AccomplishmentTypeDefeatSpecificMonsterType extends AccomplishmentType {
  public monsterType: MonsterType;
  public constructor(
    requiredAmount: number,
    monsterType: MonsterType
  ) {
    super(requiredAmount);
    this.monsterType = monsterType;
  }
}
