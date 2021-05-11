import { AbilityType } from "../client-representation/ability-type";
import { ItemType } from "./item-type";

export class HeroType {
  public key: string;
  public name: string;
  public description: string;
  public abilityTypes: AbilityType[];
  public startingWeaponType: ItemType;

  public constructor(
    key: string,
    name: string,
    description: string,
    abilityTypes: AbilityType[],
    startingWeaponType: ItemType
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.abilityTypes = abilityTypes;
    this.startingWeaponType = startingWeaponType;
  }
}