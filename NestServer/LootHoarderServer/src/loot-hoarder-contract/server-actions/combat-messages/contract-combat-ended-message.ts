import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";
import { ContractCombatEndedMessageContent } from "./contract-combat-ended-message-content";
import { ContractCombatMessageType } from "./contract-combat-message-type";

export class ContractCombatEndedMessage 
  extends ContractCombatWebSocketInnerMessage<ContractCombatEndedMessageContent> 
{
  public constructor(didTeam1Win: boolean) {
    super(
      ContractCombatMessageType.combatEnded, 
      {
        didTeam1Win
      }
    );
  }
}