import { Subject } from "rxjs";
import { ContractAttribute } from "src/loot-hoarder-contract/contract-attribute";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { DbAttributeSet } from "src/raw-game-state/db-attribute-set";
import { CombinedAttributeValueContainer } from "./combined-attribute-value-container";
import { AttributeValueChangeEvent } from "./attribute-value-change-event";

export class AttributeSet {
  public onChange: Subject<AttributeValueChangeEvent>;
  public onCombinedAttributeAdded: Subject<CombinedAttributeValueContainer>;
  
  private combinedAttributes: CombinedAttributeValueContainer[];
  private multiplicativeModifiers: Map<any, number>;
  
  public constructor(attributes: CombinedAttributeValueContainer[] = []) {
    this.combinedAttributes = [];
    this.multiplicativeModifiers = new Map();
    this.onCombinedAttributeAdded = new Subject();

    this.onChange = new Subject();

    for(const attribute of attributes) {
      this.addAttribute(attribute);
    }
  }

  /**
   * Creates a new attribute, if one does not already exist
   * @param attributeType 
   * @param abilityTags 
   * @returns 
   */
  public getAttribute(attributeType: ContractAttributeType, abilityTags: string[]): CombinedAttributeValueContainer {
    let attribute = this.combinedAttributes.find(a => 
      a.attributeType === attributeType 
      && a.abilityTags.length === abilityTags.length
      && a.abilityTags.every(tag => abilityTags.includes(tag))
    );
    if (!attribute) {
      attribute = new CombinedAttributeValueContainer(attributeType, abilityTags, 0, 1);
      this.addAttribute(attribute);
    }
    return attribute;
  }

  /**
   * Does not create new attributes.
   * @param attributeType 
   * @param tags 
   * @returns all attributes that include zero or more of the provided tags
   */
  public getAttributes(attributeType: ContractAttributeType, tags: string[]): CombinedAttributeValueContainer[] {
    const allCombinedAttributesIncludingTags = this.combinedAttributes.filter(attribute => 
      attribute.attributeType === attributeType
      && attribute.abilityTags.every(tag => tags.includes(tag))
    );

    return allCombinedAttributesIncludingTags;
  }

  public calculateAttributeValue(attributeType: ContractAttributeType, tags: string[]): number {
    // TODO cache this value
    const allCombinedAttributes = this.getAttributes(attributeType, tags);
    const additiveModifiersSum = allCombinedAttributes
      .map(attribute => attribute.additiveValueContainer.value)
      .reduce((v1, v2) => v1 + v2, 0);
    const multiplicativeModifiersProduct = allCombinedAttributes
      .map(attribute => attribute.multiplicativeValueContainer.value)
      .reduce((v1, v2) => v1 * v2, 0);
    return additiveModifiersSum * multiplicativeModifiersProduct;
  }

  public toContractModel(): ContractAttribute[] {
    const additiveAttributes: ContractAttribute[] = this.combinedAttributes.map(attribute => {
      return {
        type: attribute.attributeType,
        tags: [...attribute.abilityTags],
        additiveValue: attribute.additiveValueContainer.value,
        multiplicativeValue: attribute.multiplicativeValueContainer.value,
        value: attribute.valueContainer.value,
      };
    });

    return additiveAttributes;
  }

  public toDbModel(): DbAttributeSet {
    return {
      attributes: this.combinedAttributes.map(combinedAttribute => {
        return {
          type: combinedAttribute.attributeType,
          tags: [...combinedAttribute.abilityTags],
          additiveValue: combinedAttribute.additiveValueContainer.value,
          multiplicativeValue: combinedAttribute.multiplicativeValueContainer.value
        };
      })
    };
  }

  public setAdditiveAttributeSet(attributeSet: AttributeSet): void {
    for(const otherCombinedAttribute of attributeSet.combinedAttributes) {
      const thisCombinedAttribute = this.getAttribute(otherCombinedAttribute.attributeType, otherCombinedAttribute.abilityTags);
      thisCombinedAttribute.additiveValueContainer.setAdditiveValueContainer(otherCombinedAttribute.additiveValueContainer);
    }
    attributeSet.onCombinedAttributeAdded.subscribe(otherCombinedAttribute => {
      const thisCombinedAttribute = this.getAttribute(otherCombinedAttribute.attributeType, otherCombinedAttribute.abilityTags);
      thisCombinedAttribute.additiveValueContainer.setAdditiveValueContainer(otherCombinedAttribute.additiveValueContainer);
    });
  }

  public setMultiplicativeModifier(key: any, modifier: number): void {
    this.multiplicativeModifiers.set(key, modifier);
    for(const combinedAttribute of this.combinedAttributes) {
      combinedAttribute.multiplicativeValueContainer.setAdditiveModifier(key, modifier);
    }
  }

  public flatCopy(): AttributeSet {
    const copyAttributes = this.combinedAttributes.map(combined => combined.flatCopy());
    return new AttributeSet(copyAttributes);
  }

  private addAttribute(attribute: CombinedAttributeValueContainer): void {
    this.combinedAttributes.push(attribute);
    this.subscribeToChangeEvent(attribute);
    for(const [key, modifier] of this.multiplicativeModifiers) {
      attribute.multiplicativeValueContainer.setMultiplicativeModifier(key, modifier);
    }
    this.onCombinedAttributeAdded.next(attribute);
  }

  private subscribeToChangeEvent(attribute: CombinedAttributeValueContainer): void {
    attribute.additiveValueContainer.onValueChange.subscribe(change => 
      this.onChange.next(this.buildChangeEvent(attribute))
    );
    attribute.multiplicativeValueContainer.onValueChange.subscribe(change => 
      this.onChange.next(this.buildChangeEvent(attribute))
    );
    attribute.valueContainer.onValueChange.subscribe(change => 
      this.onChange.next(this.buildChangeEvent(attribute))
    );
  }

  private buildChangeEvent(attribute: CombinedAttributeValueContainer): AttributeValueChangeEvent {
    return { 
      type: attribute.attributeType, 
      tags: [...attribute.abilityTags],
      newAdditiveValue: attribute.additiveValueContainer.value,
      newMultiplicativeValue: attribute.multiplicativeValueContainer.value,
      newValue: attribute.valueContainer.value
    };
  }

  public static load(dbModel: DbAttributeSet): AttributeSet {
    const attributes: CombinedAttributeValueContainer[] = dbModel.attributes.map(dbAttribute => 
      new CombinedAttributeValueContainer(
        dbAttribute.type, 
        [...dbAttribute.tags], 
        dbAttribute.additiveValue,
        dbAttribute.multiplicativeValue
      )
    );
    const attributeSet: AttributeSet = new AttributeSet(attributes);
    return attributeSet;
  }
}