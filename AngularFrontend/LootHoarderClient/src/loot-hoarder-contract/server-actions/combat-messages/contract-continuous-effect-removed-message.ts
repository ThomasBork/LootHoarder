import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";
import { ContractContinuousEffectRemovedMessageContent } from "./contract-continuous-effect-removed-message-content";
import { ContractCombatMessageType } from "./contract-combat-message-type";

export class ContractContinuousEffectRemovedMessage 
  extends ContractCombatWebSocketInnerMessage<ContractContinuousEffectRemovedMessageContent> 
{
  public constructor(combatCharacterId: number, continuousEffectId: number) {
    super(
      ContractCombatMessageType.continuousEffectRemoved, 
      { 
        combatCharacterId, 
        continuousEffectId
      }
    );
  }
}