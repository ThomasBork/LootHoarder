import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";

export interface ContractAbilityUsedMessageContent {
  abilityId: number,
  usingCombatCharacterId: number,
  targetCombatCharacterId?: number,
  newRemainingCooldown: number,
  effects: ContractCombatWebSocketInnerMessage[]
}
