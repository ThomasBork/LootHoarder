import { ContractAttributeType } from "./contract-attribute-type";

export interface ContractAttribute {
  type: ContractAttributeType;
  tag?: string;
  additiveValue: number;
  multiplicativeValue: number;
  value: number;
}