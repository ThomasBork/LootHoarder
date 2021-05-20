import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Attribute } from "./attribute";

export class AttributeSet {
  public attributes: Attribute[];

  public constructor(attributes: Attribute[]) {
    this.attributes = attributes;
  }

  public getAttribute(attributeType: ContractAttributeType, tags: string[]): Attribute {
    const attribute = this.findAttribute(attributeType, tags);
    if (!attribute) {
      throw Error (`Attribute with type ${attributeType} and tags ${tags.join(', ')} does not exist on this attribute set`);
    }
    return attribute;
  }

  public findAttribute(attributeType: ContractAttributeType, tags: string[]): Attribute | undefined {
    return this.attributes.find(a => 
      a.type === attributeType 
      && a.tags.length === tags.length 
      && a.tags.every(tag => tags.includes(tag))
    );
  }

  public setAttribute(
    attributeType: ContractAttributeType, 
    tags: string[], 
    additiveValue: number, 
    multiplicativeValue: number, 
    value: number
  ): void {
    const attribute = this.findAttribute(attributeType, tags);
    if (!attribute) {
      this.attributes.push({
        type: attributeType,
        tags: tags,
        additiveValue: additiveValue,
        multiplicativeValue: multiplicativeValue,
        value: value
      });
    } else {
      attribute.additiveValue = additiveValue;
      attribute.multiplicativeValue = multiplicativeValue;
      attribute.value = value;
    }
  }
}
