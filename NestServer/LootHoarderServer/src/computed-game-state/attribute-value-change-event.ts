import { ContractAttributeType } from "../loot-hoarder-contract/contract-attribute-type";

export interface AttributeValueChangeEvent {
  type: ContractAttributeType;
  tags: string[];
  newAdditiveValue: number;
  newMultiplicativeValue: number;
  newValue: number;
}
