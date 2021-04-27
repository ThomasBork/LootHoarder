import { ContractAttributeSet } from './contract-attribute-set';
import { ContractCombatCharacterAbility } from './contract-combat-character-ability'

export interface ContractCombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
  attributes: ContractAttributeSet;
  abilities: ContractCombatCharacterAbility[];
  remainingTimeToUseAbility: number;
  totalTimeToUseAbility?: number;
  idOfTargetOfAbilityBeingUsed?: number;
  idOfAbilityBeingUsed?: number;
}