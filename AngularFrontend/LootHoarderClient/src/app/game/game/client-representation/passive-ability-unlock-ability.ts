import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersUnlockAbility } from "./passive-ability-parameters-unlock-ability";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbilityUnlockAbility extends PassiveAbility {
  public type!: PassiveAbilityType;
  public parameters!: PassiveAbilityParametersUnlockAbility;

  public constructor(type: PassiveAbilityType, parameters: PassiveAbilityParametersUnlockAbility) {
    super(type, parameters);
  }

  public get description(): string {
    return `Unlocks the ${this.parameters.abilityType.name} ability`;
  }
}
