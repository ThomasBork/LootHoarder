import { AttributeValueContainer } from "./attribute-value-container";

export class AttributeValueSet {  
  public attributeValueContainers: AttributeValueContainer[];

  public constructor(
    attributeValueContainers: AttributeValueContainer[]
  ) {
    this.attributeValueContainers = attributeValueContainers;
  }

  public flatCopy(): AttributeValueSet {
    const valueContainers = this.attributeValueContainers.map(valueContainer => 
      new AttributeValueContainer(
        valueContainer.attributeType, 
        [...valueContainer.abilityTags], 
        valueContainer.valueContainer.value
      )
    );
    return new AttributeValueSet(valueContainers);
  }
}