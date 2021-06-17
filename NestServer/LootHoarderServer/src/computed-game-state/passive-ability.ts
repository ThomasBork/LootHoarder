import { ContractPassiveAbility } from "src/loot-hoarder-contract/contract-passive-ability";
import { DbPassiveAbility } from "src/raw-game-state/db-passive-ability";
import { PassiveAbilityParameters } from "./passive-ability-parameters";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbility {
  protected dbModel: DbPassiveAbility;
  public type: PassiveAbilityType;
  public parameters: PassiveAbilityParameters;

  public constructor(
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
}