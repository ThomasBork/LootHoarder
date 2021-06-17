import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersTakeDamageOverTime } from "./passive-ability-parameters-take-damage-over-time";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbilityTakeDamageOverTime extends PassiveAbility {
  public type!: PassiveAbilityType;
  public parameters!: PassiveAbilityParametersTakeDamageOverTime;
  public damageTakenEverySecond: number;

  public constructor(type: PassiveAbilityType, parameters: PassiveAbilityParametersTakeDamageOverTime, damageTakenEverySecond: number) {
    super(type, parameters);
    this.damageTakenEverySecond = damageTakenEverySecond;
  }

  public get description(): string {
    const damagePerSecond = this.parameters.damagePerSecond;
    const abilityTags = this.parameters.abilityTags;

    const abilityTagText = abilityTags.length > 0 
      ? this.getAbilityTagList(abilityTags) + ' ' 
      : '';
    const damageText = Math.floor(damagePerSecond);

    return `Take ${damageText} ${abilityTagText}damage every second.`;
  }
}
