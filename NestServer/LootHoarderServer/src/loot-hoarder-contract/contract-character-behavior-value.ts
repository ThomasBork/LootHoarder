import { ContractAttributeType } from './contract-attribute-type';
import { ContractCharacterBehaviorValueTypeKey } from './contract-character-behavior-value-type-key';
export interface ContractCharacterBehaviorValue {
  typeKey: ContractCharacterBehaviorValueTypeKey;
  number?: number;
  attributeTypeKey?: ContractAttributeType;
  attributeAbilityTags?: string[];
  abilityId?: number;
}