import { AreaTypeRepeatedEncounter } from "./area-type-repeated-encounter";

export class AreaType {
  public key: string;
  public name: string;
  public description: string;
  public level: number;
  public adjacentAreaTypes: AreaType[];
  public repeatedEncounters: AreaTypeRepeatedEncounter[];

  public constructor(
    key: string,
    name: string,
    description: string,
    level: number,
    repeatedEncounters: AreaTypeRepeatedEncounter[]
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.level = level;
    this.repeatedEncounters = repeatedEncounters;

    this.adjacentAreaTypes = [];
  }
}
