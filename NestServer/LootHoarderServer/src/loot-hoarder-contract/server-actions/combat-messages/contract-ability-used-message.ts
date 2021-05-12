import { ContractAbilityUsedMessageContent } from "./contract-ability-used-message-content";
import { ContractCombatMessageType } from "./contract-combat-message-type";
import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";

export class ContractAbilityUsedMessage
  extends ContractCombatWebSocketInnerMessage<ContractAbilityUsedMessageContent> 
{
  public constructor(
    abilityId: number,
    usingCombatCharacterId: number,
    targetCombatCharacterId: number | undefined,
    newRemainingCooldown: number,
    effects: ContractCombatWebSocketInnerMessage[]
  ) {
    super(
      ContractCombatMessageType.abilityUsed, 
      { 
        abilityId, 
        usingCombatCharacterId,
        targetCombatCharacterId,
        newRemainingCooldown,
        effects
      }
    );
  }
}