import { ContractAttributeSet } from "./contract-attribute-set";

export interface ContractHero {
  id: number;
  typeKey: string;
  name: string;
  level: number;
  experience: number;
  attributes: ContractAttributeSet;
}
