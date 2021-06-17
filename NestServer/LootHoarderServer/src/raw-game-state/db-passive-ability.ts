import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { DbPassiveAbilityParameters } from "./db-passive-ability-parameters";

export interface DbPassiveAbility {
  typeKey: ContractPassiveAbilityTypeKey;
  parameters: DbPassiveAbilityParameters;
}