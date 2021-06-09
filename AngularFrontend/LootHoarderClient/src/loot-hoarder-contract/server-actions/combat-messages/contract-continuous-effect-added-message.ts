import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";
import { ContractContinuousEffectAddedMessageContent } from "./contract-continuous-effect-added-message-content";
import { ContractCombatMessageType } from "./contract-combat-message-type";
import { ContractContinuousEffect } from "./contract-continuous-effect";

export class ContractContinuousEffectAddedMessage 
  extends ContractCombatWebSocketInnerMessage<ContractContinuousEffectAddedMessageContent> 
{
  public constructor(combatCharacterId: number, continuousEffect: ContractContinuousEffect) {
    super(
      ContractCombatMessageType.continuousEffectAdded, 
      { 
        combatCharacterId, 
        continuousEffect 
      }
    );
  }
}