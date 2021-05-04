import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";

export interface ContractBegunUsingAbilityMessageContent {
  abilityId: number,
  usingCombatCharacterId: number,
  targetCombatCharacterId?: number,
  timeToUse: number,
  effects: ContractCombatWebSocketInnerMessage[]
}
