import { ContractCombat } from "../contract-combat";

export interface ContractCombatStartedMessageContent {
  areaId: number;
  combat: ContractCombat;
  combatNumber: number;
}
