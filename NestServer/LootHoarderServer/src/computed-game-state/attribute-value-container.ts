import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ValueContainer } from "./value-container";

export class AttributeValueContainer {
  public attributeType: ContractAttributeType;
  public abilityTags: string[];
  public valueContainer: ValueContainer;

  public constructor(
    attributeType: ContractAttributeType, 
    abilityTags: string[], 
    baseValue: number
  ) {
    this.attributeType = attributeType;
    this.abilityTags = abilityTags;
    this.valueContainer = new ValueContainer(baseValue);
  }
}