import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Attribute } from "./attribute";

export class AttributeSet {
  public attributes: Attribute[];

  public constructor(attributes: Attribute[]) {
    this.attributes = attributes;
  }

  public getAttribute(attributeType: ContractAttributeType, tag: string | undefined): Attribute {
    const attribute = this.attributes.find(a => a.type === attributeType && a.tag === tag);
    if (!attribute) {
      throw Error (`Attribute with type ${attributeType} and tag ${tag} does not exist on this attribute set`);
    }
    return attribute;
  }

  public setAttribute(
    attributeType: ContractAttributeType, 
    tag: string | undefined, 
    additiveValue: number, 
    multiplicativeValue: number, 
    value: number
  ): void {
    const attribute = this.attributes.find(a => a.type === attributeType && a.tag === tag);
    if (!attribute) {
      this.attributes.push({
        type: attributeType,
        tag: tag,
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
