import { AreaTypeEncounterMonsterType } from "./area-type-encounter-monster-type";

export class AreaTypeEncounter {
  public monsterTypes: AreaTypeEncounterMonsterType[];
  public constructor(monsterTypes: AreaTypeEncounterMonsterType[]) {
    this.monsterTypes = monsterTypes;
  }
}