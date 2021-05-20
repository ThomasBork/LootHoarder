import { ContractAttributeType } from "./contract-attribute-type";

export interface ContractAttribute {
  type: ContractAttributeType;
  tags: string[];
  additiveValue: number;
  multiplicativeValue: number;
  value: number;
}