import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";
import { ContractCombatCharacterCurrentManaChangedMessageContent } from "./contract-combat-character-current-mana-changed-message-content";
import { ContractCombatMessageType } from "./contract-combat-message-type";

export class ContractCombatCharacterCurrentManaChangedMessage 
  extends ContractCombatWebSocketInnerMessage<ContractCombatCharacterCurrentManaChangedMessageContent> 
{
  public constructor(characterId: number, previousCurrentMana: number, newCurrentMana: number) {
    super(
      ContractCombatMessageType.combatCharacterCurrentManaChanged, 
      { 
        characterId, 
        previousCurrentMana,
        newCurrentMana 
      }
    );
  }
}