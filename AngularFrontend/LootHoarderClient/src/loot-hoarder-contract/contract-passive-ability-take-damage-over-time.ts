import { ContractPassiveAbility } from './contract-passive-ability';

export interface ContractPassiveAbilityTakeDamageOverTime extends ContractPassiveAbility {
  damageTakenEverySecond: number;
}