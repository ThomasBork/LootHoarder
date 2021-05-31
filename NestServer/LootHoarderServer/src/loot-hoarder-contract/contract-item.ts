import { ContractPassiveAbility } from "./contract-passive-ability";

export interface ContractItem {
  id: number;
  typeKey: string;
  innateAbilities: ContractPassiveAbility[];
  additionalAbilities: ContractPassiveAbility[];
}