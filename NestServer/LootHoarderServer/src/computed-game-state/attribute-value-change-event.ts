import { ContractAttributeType } from "../loot-hoarder-contract/contract-attribute-type";

export interface AttributeValueChangeEvent {
  type: ContractAttributeType;
  newValue: number;
}
