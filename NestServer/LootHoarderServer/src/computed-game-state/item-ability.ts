import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractItemAbility } from "src/loot-hoarder-contract/contract-item-ability";
import { DbItemAbility } from "src/raw-game-state/db-item-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { ItemAbilityParameters } from "./item-ability-parameters";
import { ItemAbilityParametersAttribute } from "./item-ability-parameters-attribute";
import { ItemAbilityType } from "./item-ability-type";

export class ItemAbility {
  private dbModel: DbItemAbility;
  public type: ItemAbilityType;
  public parameters: ItemAbilityParameters;

  private constructor(dbModel: DbItemAbility, type: ItemAbilityType, parameters: ItemAbilityParameters) {
    this.dbModel = dbModel;
    this.type = type;
    this.parameters = parameters;
  }

  public toContractModel(): ContractItemAbility {
    return {
      typeKey: this.type.key,
      parameters: this.parameters
    };
  }

  public static load(dbModel: DbItemAbility): ItemAbility {
    const abilityType = StaticGameContentService.instance.getItemAbilityType(dbModel.typeKey);

    let abilityParameters: ItemAbilityParameters;
    switch(abilityType.key) {
      case 'attribute': {
        abilityParameters = new ItemAbilityParametersAttribute(
          ItemAbility.expectBoolean(dbModel.parameters.isAdditive),
          ItemAbility.expectString(dbModel.parameters.attributeType) as ContractAttributeType,
          dbModel.parameters.abilityTag ? ItemAbility.expectString(dbModel.parameters.abilityTag) : undefined,
          ItemAbility.expectNumber(dbModel.parameters.amount)
        );
      }
      break;
      default: 
        throw Error (`Unhandled ability type: ${abilityType.key}`);
    }
    
    const ability = new ItemAbility(dbModel, abilityType, abilityParameters);

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
}