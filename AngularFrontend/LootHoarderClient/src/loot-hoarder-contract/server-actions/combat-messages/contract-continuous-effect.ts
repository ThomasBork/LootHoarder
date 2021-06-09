import { ContractPassiveAbility } from '../../contract-passive-ability';

export interface ContractContinuousEffect {
  id: number;
  typeKey: string;
  abilities: ContractPassiveAbility[];
  timeRemaining: number;
  lastsIndefinitely: boolean;
}