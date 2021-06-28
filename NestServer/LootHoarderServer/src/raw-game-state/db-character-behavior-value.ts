import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractCharacterBehaviorValueTypeKey } from 'src/loot-hoarder-contract/contract-character-behavior-value-type-key';

export interface DbCharacterBehaviorValue {
  typeKey: ContractCharacterBehaviorValueTypeKey;
  number?: number;
  attributeTypeKey?: ContractAttributeType;
  attributeAbilityTags?: string[];
  abilityId?: number;
}