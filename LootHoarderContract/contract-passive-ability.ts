import { ContractPassiveAbilityTypeKey } from './contract-passive-ability-type-key';

export interface ContractPassiveAbility {
  typeKey: ContractPassiveAbilityTypeKey;
  parameters: any;
}