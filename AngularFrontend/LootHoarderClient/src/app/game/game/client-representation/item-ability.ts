import { ItemAbilityType } from "./item-ability-type";

export class ItemAbility {
  public type: ItemAbilityType;
  public parameters: any;

  public constructor(type: ItemAbilityType, parameters: any) {
    this.type = type;
    this.parameters = parameters;
  }
}