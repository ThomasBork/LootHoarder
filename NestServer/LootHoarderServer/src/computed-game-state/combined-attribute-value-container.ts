import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ValueContainer } from "./value-container";

export class CombinedAttributeValueContainer {
  public attributeType: ContractAttributeType;
  public tag?: string;
  public additiveValueContainer: ValueContainer;
  public multiplicativeValueContainer: ValueContainer;
  public valueContainer: ValueContainer;

  public constructor(
    attributeType: ContractAttributeType, 
    tag: string | undefined, 
    baseAdditiveValue: number,
    baseMultiplicativeValue: number
  ) {
    this.attributeType = attributeType;
    this.tag = tag;
    this.additiveValueContainer = new ValueContainer(baseAdditiveValue);
    this.multiplicativeValueContainer = new ValueContainer(baseMultiplicativeValue);
    this.valueContainer = new ValueContainer(0);
    this.valueContainer.setAdditiveValueContainer(this.additiveValueContainer);
    this.valueContainer.setMultiplicativeValueContainer(this.multiplicativeValueContainer);
  }

  public flatCopy(): CombinedAttributeValueContainer {
    return new CombinedAttributeValueContainer(
      this.attributeType, 
      this.tag,
      this.additiveValueContainer.value,
      this.multiplicativeValueContainer.value
    );
  }
}