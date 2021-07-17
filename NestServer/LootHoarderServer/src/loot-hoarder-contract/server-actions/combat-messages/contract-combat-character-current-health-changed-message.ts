import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";
import { ContractCombatCharacterCurrentHealthChangedMessageContent } from "./contract-combat-character-current-health-changed-message-content";
import { ContractCombatMessageType } from "./contract-combat-message-type";

export class ContractCombatCharacterCurrentHealthChangedMessage 
  extends ContractCombatWebSocketInnerMessage<ContractCombatCharacterCurrentHealthChangedMessageContent> 
{
  public constructor(characterId: number, previousCurrentHealth: number, newCurrentHealth: number) {
    super(
      ContractCombatMessageType.combatCharacterCurrentHealthChanged, 
      { 
        characterId, 
        previousCurrentHealth,
        newCurrentHealth 
      }
    );
  }
}