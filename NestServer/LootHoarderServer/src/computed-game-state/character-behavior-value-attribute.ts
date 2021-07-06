import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValueAttribute extends CharacterBehaviorValue {
  public attributeType: ContractAttributeType; 
  public attributeAbilityTags: string[];
  public constructor(attributeType: ContractAttributeType, attributeAbilityTags: string[]) {
    super(ContractCharacterBehaviorValueTypeKey.attribute);
    this.attributeType = attributeType;
    this.attributeAbilityTags = attributeAbilityTags;
  }

  public toContractModel(): ContractCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      attributeTypeKey: this.attributeType,
      attributeAbilityTags: this.attributeAbilityTags,
    };
  }

  public toDbModel(): DbCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      attributeTypeKey: this.attributeType,
      attributeAbilityTags: this.attributeAbilityTags,
    };
  }
}