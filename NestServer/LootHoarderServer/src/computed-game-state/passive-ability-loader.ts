import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { DbPassiveAbility } from "src/raw-game-state/db-passive-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersAttribute } from "./passive-ability-parameters-attribute";
import { PassiveAbilityParametersUnlockAbility } from "./passive-ability-parameters-unlock-ability";
import { PassiveAbilityTakeDamageOverTime } from "./passive-ability-take-damage-over-time";

export class PassiveAbilityLoader {
  public static loadAbility(dbModel: DbPassiveAbility): PassiveAbility {
    switch(dbModel.typeKey) {
      case ContractPassiveAbilityTypeKey.attribute: {
        const abilityType = StaticGameContentService.instance.getPassiveAbilityType(dbModel.typeKey);
        const abilityParameters = new PassiveAbilityParametersAttribute(
          PassiveAbilityLoader.expectBoolean(dbModel.parameters.isAdditive),
          PassiveAbilityLoader.expectString(dbModel.parameters.attributeType) as ContractAttributeType,
          PassiveAbilityLoader.expectStringArray(dbModel.parameters.abilityTags),
          PassiveAbilityLoader.expectNumber(dbModel.parameters.amount)
        );
    
        const ability = new PassiveAbility(dbModel, abilityType, abilityParameters);
        return ability;
      }
      case ContractPassiveAbilityTypeKey.unlockAbility: {
        const abilityType = StaticGameContentService.instance.getPassiveAbilityType(dbModel.typeKey);

        const abilityParameters = new PassiveAbilityParametersUnlockAbility(
          PassiveAbilityLoader.expectString(dbModel.parameters.abilityTypeKey)
        );
    
        const ability = new PassiveAbility(dbModel, abilityType, abilityParameters);
        return ability;
      }
      case ContractPassiveAbilityTypeKey.takeDamageOverTime: {
        const ability = PassiveAbilityTakeDamageOverTime.load(dbModel);
        return ability;
      }
      default: 
        throw Error (`Unhandled ability type: ${dbModel.typeKey}`);
    }
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