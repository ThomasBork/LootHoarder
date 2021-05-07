import { ContractAttribute } from "./contract-attribute";
import { ContractInventory } from "./contract-inventory";

export interface ContractHero {
  id: number;
  typeKey: string;
  name: string;
  level: number;
  experience: number;
  attributes: ContractAttribute[];
  inventory: ContractInventory;
}
