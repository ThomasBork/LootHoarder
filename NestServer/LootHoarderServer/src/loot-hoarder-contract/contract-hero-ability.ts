import { ContractAbilityEffect } from './contract-ability-effect';

export interface ContractHeroAbility {
  id: number;
  typeKey: string;
  isEnabled: boolean;
  useSpeed: number;
  cooldownSpeed: number;
  cooldown: number;
  manaCost: number;
  criticalStrikeChance: number;
  criticalStrikeMultiplier: number;
  timeToUse: number;
  effects: ContractAbilityEffect[];
}
