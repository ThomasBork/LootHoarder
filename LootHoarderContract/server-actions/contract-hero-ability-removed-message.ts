import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroAbilityRemovedMessageContent } from "./contract-hero-ability-removed-message-content";

export class ContractHeroAbilityRemovedMessage implements ContractServerWebSocketMessage<ContractHeroAbilityRemovedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroAbilityRemovedMessageContent;
  public constructor(heroId: number, abilityId: number) {
    this.typeKey = ContractServerMessageType.heroAbilityRemoved;
    this.data = { 
      heroId,
      abilityId
    };
  }
}
