import { Subject } from "rxjs";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValueAttribute extends CharacterBehaviorValue {
  public attributeAbilityTags: string[];
  
  private _attributeType: ContractAttributeType;

  public constructor(attributeType: ContractAttributeType, attributeAbilityTags: string[]) {
    super(ContractCharacterBehaviorValueTypeKey.attribute);
    
    this._attributeType = attributeType;
    this.attributeAbilityTags = attributeAbilityTags;
  }

  public get attributeType(): ContractAttributeType {
    return this._attributeType;
  }
  public set attributeType(newValue: ContractAttributeType) {
    if (this._attributeType !== newValue) {
      this._attributeType = newValue;
      this.onChange.next();
    }
  }

  public changeAbilityTag(previousTag: string, newTag: string): void {
    const index = this.attributeAbilityTags.indexOf(previousTag);
    this.attributeAbilityTags.splice(index, 1, newTag);
    this.onChange.next();
  }

  public toContractModel(): ContractCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      attributeTypeKey: this.attributeType,
      attributeAbilityTags: this.attributeAbilityTags,
    };
  }
}