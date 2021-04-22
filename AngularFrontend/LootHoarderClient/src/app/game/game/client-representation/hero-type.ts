import { AbilityType } from "../client-representation/ability-type";

export class HeroType {
  public key: string;
  public name: string;
  public description: string;
  public abilityTypes: AbilityType[];

  public constructor(
    key: string,
    name: string,
    description: string,
    abilityTypes: AbilityType[]
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.abilityTypes = abilityTypes;
  }
}