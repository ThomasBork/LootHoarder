import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractPassiveAbility } from "src/loot-hoarder-contract/contract-passive-ability";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { DbPassiveAbility } from "src/raw-game-state/db-passive-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { PassiveAbilityParameters } from "./passive-ability-parameters";
import { PassiveAbilityParametersAttribute } from "./passive-ability-parameters-attribute";
import { PassiveAbilityParametersTakeDamageOverTime } from "./passive-ability-parameters-take-damage-over-time";
import { PassiveAbilityParametersUnlockAbility } from "./passive-ability-parameters-unlock-ability";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbility {
  private dbModel: DbPassiveAbility;
  public type: PassiveAbilityType;
  public parameters: PassiveAbilityParameters;

  private constructor(
    dbModel: DbPassiveAbility, 
    type: PassiveAbilityType, 
    parameters: PassiveAbilityParameters
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.parameters = parameters;
  }

  public toContractModel(): ContractPassiveAbility {
    return {
      typeKey: this.type.key,
      parameters: this.parameters
    };
  }

  public static load(dbModel: DbPassiveAbility): PassiveAbility {
    const abilityType = StaticGameContentService.instance.getPassiveAbilityType(dbModel.typeKey);

    let abilityParameters: PassiveAbilityParameters;
    switch(abilityType.key) {
      case ContractPassiveAbilityTypeKey.attribute: {
        abilityParameters = new PassiveAbilityParametersAttribute(
          PassiveAbility.expectBoolean(dbModel.parameters.isAdditive),
          PassiveAbility.expectString(dbModel.parameters.attributeType) as ContractAttributeType,
          PassiveAbility.expectStringArray(dbModel.parameters.abilityTags),
          PassiveAbility.expectNumber(dbModel.parameters.amount)
        );
      }
      break;
      case ContractPassiveAbilityTypeKey.unlockAbility: {
        abilityParameters = new PassiveAbilityParametersUnlockAbility(
          PassiveAbility.expectString(dbModel.parameters.abilityTypeKey)
        );
      }
      break;
      case ContractPassiveAbilityTypeKey.takeDamageOverTime: {
        abilityParameters = new PassiveAbilityParametersTakeDamageOverTime(
          PassiveAbility.expectNumber(dbModel.parameters.damagePerSecond),
          PassiveAbility.expectStringArray(dbModel.parameters.abilityTags)
        );
      }
      break;
      default: 
        throw Error (`Unhandled ability type: ${abilityType.key}`);
    }
    
    const ability = new PassiveAbility(dbModel, abilityType, abilityParameters);

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