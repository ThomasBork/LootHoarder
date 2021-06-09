import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";

export class PassiveAbilityType {
  public key: ContractPassiveAbilityTypeKey;
  public parameters: string[];
  public constructor(
    key: ContractPassiveAbilityTypeKey,
    parameters: string[]
  ) {
    this.key = key;
    this.parameters = parameters;
  }
}