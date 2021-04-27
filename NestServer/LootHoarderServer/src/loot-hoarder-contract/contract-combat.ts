import { ContractCombatCharacter } from "./contract-combat-character";

export interface ContractCombat {
  id: number;
  hasEnded: boolean,
  didTeam1Win?: boolean,
  team1: ContractCombatCharacter[];
  team2: ContractCombatCharacter[];
}