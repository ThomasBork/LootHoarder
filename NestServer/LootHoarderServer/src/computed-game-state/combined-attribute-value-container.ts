import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ValueContainer } from "./value-container";

export class CombinedAttributeValueContainer {
  public attributeType: ContractAttributeType;
  public abilityTags: string[];
  public additiveValueContainer: ValueContainer;
  public multiplicativeValueContainer: ValueContainer;
  public accumulatedAdditiveValueContainer: ValueContainer;
  public accumulatedMultiplicativeValueContainer: ValueContainer;
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
    this.accumulatedAdditiveValueContainer = new ValueContainer(0);
    this.accumulatedMultiplicativeValueContainer = new ValueContainer(1);
    this.accumulatedAdditiveValueContainer.setAdditiveValueContainer(this.additiveValueContainer);
    this.accumulatedMultiplicativeValueContainer.setMultiplicativeValueContainer(this.multiplicativeValueContainer);
    this.valueContainer = new ValueContainer(0);
    this.valueContainer.setAdditiveValueContainer(this.accumulatedAdditiveValueContainer);
    this.valueContainer.setMultiplicativeValueContainer(this.accumulatedMultiplicativeValueContainer);
  }
}