import { Subject } from "rxjs";
import { ContractAttribute } from "src/loot-hoarder-contract/contract-attribute";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { DbAttributeSet } from "src/raw-game-state/db-attribute-set";
import { CombinedAttributeValueContainer } from "./combined-attribute-value-container";
import { AttributeValueChangeEvent } from "./attribute-value-change-event";
import { AttributeValueSet } from "./attribute-value-set";

export class AttributeSet {
  public onChange: Subject<AttributeValueChangeEvent>;
  public onCombinedAttributeAdded: Subject<CombinedAttributeValueContainer>;
  
  private combinedAttributes: CombinedAttributeValueContainer[];
  
  public constructor(attributes: CombinedAttributeValueContainer[] = []) {
    this.combinedAttributes = [];
    this.onCombinedAttributeAdded = new Subject();

    this.onChange = new Subject();

    for(const attribute of attributes) {
      this.addAttribute(attribute);
    }
  }

  /**
   * Creates a new attribute if one does not already exist
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

  public setAdditiveAttributeValueSet(attributeValueSet: AttributeValueSet): void {
    for(const attributeValueContainer of attributeValueSet.attributeValueContainers) {
      const thisCombinedAttribute = this.getAttribute(attributeValueContainer.attributeType, attributeValueContainer.abilityTags);
      thisCombinedAttribute.additiveValueContainer.setAdditiveValueContainer(attributeValueContainer.valueContainer);
    }
  }

  private addAttribute(newAttribute: CombinedAttributeValueContainer): void {
    const combinedAttributesEffectingNewAttribute = this.combinedAttributes.filter(existingAttribute => 
      existingAttribute.attributeType === newAttribute.attributeType
      && existingAttribute.abilityTags.every(tag => newAttribute.abilityTags.includes(tag))
    );

    const combinedAttributesEffectedByNewAttribute = this.combinedAttributes.filter(existingAttribute => 
      newAttribute.attributeType === existingAttribute.attributeType
      && newAttribute.abilityTags.every(tag => existingAttribute.abilityTags.includes(tag))
    );

    for (let existingAttribute of combinedAttributesEffectingNewAttribute) {
      newAttribute.accumulatedAdditiveValueContainer.setAdditiveValueContainer(existingAttribute.additiveValueContainer);
      newAttribute.accumulatedMultiplicativeValueContainer.setMultiplicativeValueContainer(existingAttribute.multiplicativeValueContainer);
    };

    for (let existingAttribute of combinedAttributesEffectedByNewAttribute) {
      existingAttribute.accumulatedAdditiveValueContainer.setAdditiveValueContainer(newAttribute.additiveValueContainer);
      existingAttribute.accumulatedMultiplicativeValueContainer.setMultiplicativeValueContainer(newAttribute.multiplicativeValueContainer);
    };

    this.combinedAttributes.push(newAttribute);
    this.subscribeToChangeEvent(newAttribute);
    this.onCombinedAttributeAdded.next(newAttribute);
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