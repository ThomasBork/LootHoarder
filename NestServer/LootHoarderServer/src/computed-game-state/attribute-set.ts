import { Subject } from "rxjs";
import { ContractAttribute } from "src/loot-hoarder-contract/contract-attribute";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { DbAttributeSet } from "src/raw-game-state/db-attribute-set";
import { CombinedAttributeValueContainer } from "./combined-attribute-value-container";
import { AttributeValueChangeEvent } from "./attribute-value-change-event";

export class AttributeSet {
  public onChange: Subject<AttributeValueChangeEvent>;
  public onCombintedAttributeAdded: Subject<CombinedAttributeValueContainer>;
  
  private combinedAttributes: CombinedAttributeValueContainer[];
  private multiplicativeModifiers: Map<any, number>;
  
  public constructor(attributes: CombinedAttributeValueContainer[] = []) {
    this.combinedAttributes = [];
    this.multiplicativeModifiers = new Map();
    this.onCombintedAttributeAdded = new Subject();

    this.onChange = new Subject();

    for(const attribute of attributes) {
      this.addAttribute(attribute);
    }
  }

  public getAttribute(attributeType: ContractAttributeType, tag: string | undefined): CombinedAttributeValueContainer {
    let attribute = this.combinedAttributes.find(a => a.attributeType === attributeType && a.tag === tag);
    if (!attribute) {
      attribute = new CombinedAttributeValueContainer(attributeType, tag, 0, 1);
      this.addAttribute(attribute);
    }
    return attribute;
  }

  public toContractModel(): ContractAttribute[] {
    const additiveAttributes: ContractAttribute[] = this.combinedAttributes.map(attribute => {
      return {
        type: attribute.attributeType,
        tag: attribute.tag,
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
          tag: combinedAttribute.tag,
          additiveValue: combinedAttribute.additiveValueContainer.value,
          multiplicativeValue: combinedAttribute.multiplicativeValueContainer.value
        };
      })
    };
  }

  public setAdditiveAttributeSet(attributeSet: AttributeSet): void {
    for(const otherCombinedAttribute of attributeSet.combinedAttributes) {
      const thisCombinedAttribute = this.getAttribute(otherCombinedAttribute.attributeType, otherCombinedAttribute.tag);
      thisCombinedAttribute.additiveValueContainer.setAdditiveValueContainer(otherCombinedAttribute.additiveValueContainer);
    }
    attributeSet.onCombintedAttributeAdded.subscribe(otherCombinedAttribute => {
      const thisCombinedAttribute = this.getAttribute(otherCombinedAttribute.attributeType, otherCombinedAttribute.tag);
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
    this.onCombintedAttributeAdded.next(attribute);
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
      tag: attribute.tag,
      newAdditiveValue: attribute.additiveValueContainer.value,
      newMultiplicativeValue: attribute.multiplicativeValueContainer.value,
      newValue: attribute.valueContainer.value
    };
  }

  public static load(dbModel: DbAttributeSet): AttributeSet {
    const attributes: CombinedAttributeValueContainer[] = dbModel.attributes.map(dbAttribute => 
      new CombinedAttributeValueContainer(
        dbAttribute.type, 
        dbAttribute.tag, 
        dbAttribute.additiveValue,
        dbAttribute.multiplicativeValue
      )
    );
    const attributeSet: AttributeSet = new AttributeSet(attributes);
    return attributeSet;
  }
}