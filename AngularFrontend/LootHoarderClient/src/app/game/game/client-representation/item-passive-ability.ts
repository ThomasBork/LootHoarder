import { PassiveAbility } from "./passive-ability";

export class ItemPassiveAbility {
  public level: number;
  public ability: PassiveAbility;

  public constructor(level: number, ability: PassiveAbility) {
    this.level = level;
    this.ability = ability;
  }
}
