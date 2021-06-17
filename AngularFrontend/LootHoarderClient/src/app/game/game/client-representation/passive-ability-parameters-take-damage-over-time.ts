import { PassiveAbilityParameters } from "./passive-ability-parameters";

export class PassiveAbilityParametersTakeDamageOverTime extends PassiveAbilityParameters {
  public damagePerSecond: number;
  public abilityTags: string[];
  public constructor(
    damagePerSecond: number,
    abilityTags: string[]
  ) {
    super();
    this.damagePerSecond = damagePerSecond;
    this.abilityTags = abilityTags;
  }
}