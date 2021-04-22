import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";

export interface ContractAbilityUsedMessageContent {
  abilityId: number,
  usingCombatCharacterId: number,
  targetCombatCharacterId?: number,
  effects: ContractCombatWebSocketInnerMessage[]
}
