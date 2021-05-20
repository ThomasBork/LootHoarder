import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ValueContainer } from "./value-container";

export class CombinedAttributeValueContainer {
  public attributeType: ContractAttributeType;
  public abilityTags: string[];
  public additiveValueContainer: ValueContainer;
  public multiplicativeValueContainer: ValueContainer;
  public valueContainer: ValueContainer;

  public constructor(
    attributeType: ContractAttributeType, 
    abilityTags: string[], 
    baseAdditiveValue: number,
    baseMultiplicativeValue: number
  ) {
    this.attributeType = attributeType;
    this.abilityTags = abilityTags;
    this.additiveValueContainer = new ValueContainer(baseAdditiveValue);
    this.multiplicativeValueContainer = new ValueContainer(baseMultiplicativeValue);
    this.valueContainer = new ValueContainer(0);
    this.valueContainer.setAdditiveValueContainer(this.additiveValueContainer);
    this.valueContainer.setMultiplicativeValueContainer(this.multiplicativeValueContainer);
  }

  public flatCopy(): CombinedAttributeValueContainer {
    return new CombinedAttributeValueContainer(
      this.attributeType, 
      this.abilityTags,
      this.additiveValueContainer.value,
      this.multiplicativeValueContainer.value
    );
  }
}