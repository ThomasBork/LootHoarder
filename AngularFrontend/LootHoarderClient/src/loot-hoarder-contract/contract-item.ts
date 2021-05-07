import { ContractItemAbility } from "./contract-item-ability";

export interface ContractItem {
  id: number;
  typeKey: string;
  abilities: ContractItemAbility[];
}