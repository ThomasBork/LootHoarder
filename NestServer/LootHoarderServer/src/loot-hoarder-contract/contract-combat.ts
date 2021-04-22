import { ContractCombatCharacter } from "./contract-combat-character";

export interface ContractCombat {
  id: number;
  team1: ContractCombatCharacter[];
  team2: ContractCombatCharacter[];
}