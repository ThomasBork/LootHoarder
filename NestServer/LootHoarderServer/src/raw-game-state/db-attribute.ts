import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";

export interface DbAttribute {
  type: ContractAttributeType;
  tag?: string;
  additiveValue: number;
  multiplicativeValue: number;
}
