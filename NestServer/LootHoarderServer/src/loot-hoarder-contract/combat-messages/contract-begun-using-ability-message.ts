import { ContractCombatMessageType } from "./contract-combat-message-type";
import { ContractCombatWebSocketInnerMessage } from "../contract-combat-web-socket-inner-message";
import { ContractBegunUsingAbilityMessageContent } from "./contract-begun-using-ability-message-content";

export class ContractBegunUsingAbilityMessage
  extends ContractCombatWebSocketInnerMessage<ContractBegunUsingAbilityMessageContent> 
{
  public constructor(
    abilityId: number,
    usingCombatCharacterId: number,
    targetCombatCharacterId: number | undefined,
    timeToUse: number,
    effects: ContractCombatWebSocketInnerMessage[]
  ) {
    super(
      ContractCombatMessageType.begunUsingAbility, 
      { 
        abilityId, 
        usingCombatCharacterId,
        targetCombatCharacterId,
        timeToUse,
        effects
      }
    );
  }
}