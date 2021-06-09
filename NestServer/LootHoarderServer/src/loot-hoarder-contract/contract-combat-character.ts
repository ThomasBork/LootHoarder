import { ContractAttribute } from './contract-attribute';
import { ContractCombatCharacterAbility } from './contract-combat-character-ability'
import { ContractContinuousEffect } from './server-actions/combat-messages/contract-continuous-effect';

export interface ContractCombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
  currentMana: number;
  attributes: ContractAttribute[];
  abilities: ContractCombatCharacterAbility[];
  remainingTimeToUseAbility: number;
  totalTimeToUseAbility?: number;
  idOfTargetOfAbilityBeingUsed?: number;
  idOfAbilityBeingUsed?: number;
  continuousEffects: ContractContinuousEffect[];
}