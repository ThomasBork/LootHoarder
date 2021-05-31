import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbility {
  public type: PassiveAbilityType;
  public parameters: any;

  public constructor(type: PassiveAbilityType, parameters: any) {
    this.type = type;
    this.parameters = parameters;
  }
}