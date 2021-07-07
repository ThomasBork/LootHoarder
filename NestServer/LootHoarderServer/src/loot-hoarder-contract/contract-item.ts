import { ContractItemPassiveAbility } from "./contract-item-passive-ability";

export interface ContractItem {
  id: number;
  typeKey: string;
  innateAbilities: ContractItemPassiveAbility[];
  additionalAbilities: ContractItemPassiveAbility[];
  level: number;
  remainingCraftPotential: number;
}