import { ContractAttribute } from './contract-attribute';
import { ContractCombatCharacterAbility } from './contract-combat-character-ability'

export interface ContractCombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
  attributes: ContractAttribute[];
  abilities: ContractCombatCharacterAbility[];
  remainingTimeToUseAbility: number;
  totalTimeToUseAbility?: number;
  idOfTargetOfAbilityBeingUsed?: number;
  idOfAbilityBeingUsed?: number;
}