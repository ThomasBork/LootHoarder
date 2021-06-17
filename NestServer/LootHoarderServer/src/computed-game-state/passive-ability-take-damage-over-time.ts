import { ContractPassiveAbilityTakeDamageOverTime } from "src/loot-hoarder-contract/contract-passive-ability-take-damage-over-time";
import { DbPassiveAbility } from "src/raw-game-state/db-passive-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersTakeDamageOverTime } from "./passive-ability-parameters-take-damage-over-time";
import { PassiveAbilityType } from "./passive-ability-type";
import { ValueContainer } from "./value-container";

export class PassiveAbilityTakeDamageOverTime extends PassiveAbility {
  public parameters!: PassiveAbilityParametersTakeDamageOverTime;
  public damageTakenEverySecondVC: ValueContainer;

  private constructor(
    dbModel: DbPassiveAbility, 
    type: PassiveAbilityType, 
    parameters: PassiveAbilityParametersTakeDamageOverTime
  ) {
    super(dbModel, type, parameters);

    this.damageTakenEverySecondVC = new ValueContainer(parameters.damagePerSecond);
  }

  public toContractModel(): ContractPassiveAbilityTakeDamageOverTime {
    return {
      typeKey: this.type.key,
      parameters: this.parameters,
      damageTakenEverySecond: this.damageTakenEverySecondVC.value
    };
  }

  public static load(dbModel: DbPassiveAbility): PassiveAbilityTakeDamageOverTime {
    const abilityType = StaticGameContentService.instance.getPassiveAbilityType(dbModel.typeKey);

    const abilityParameters = new PassiveAbilityParametersTakeDamageOverTime(
      PassiveAbilityTakeDamageOverTime.expectNumber(dbModel.parameters.damagePerSecond),
      PassiveAbilityTakeDamageOverTime.expectStringArray(dbModel.parameters.abilityTags)
    );

    const ability = new PassiveAbilityTakeDamageOverTime(dbModel, abilityType, abilityParameters);

    return ability;
  }

  private static expectBoolean(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    throw Error(`Expected value to be boolean: ${value}`);
  }

  private static expectNumber(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    throw Error(`Expected value to be number: ${value}`);
  }

  private static expectString(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    throw Error(`Expected value to be string: ${value}`);
  }

  private static expectStringArray(value: any): string[] {
    if (typeof value === 'object' && value instanceof Array) {
      return value;
    }
    throw Error(`Expected value to be string array: ${value}`);
  }
}