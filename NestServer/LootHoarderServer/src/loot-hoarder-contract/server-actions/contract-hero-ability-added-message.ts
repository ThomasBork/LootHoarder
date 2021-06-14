import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroAbilityAddedMessageContent } from "./contract-hero-ability-added-message-content";
import { ContractHeroAbility } from "../contract-hero-ability";

export class ContractHeroAbilityAddedMessage implements ContractServerWebSocketMessage<ContractHeroAbilityAddedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroAbilityAddedMessageContent;
  public constructor(heroId: number, ability: ContractHeroAbility) {
    this.typeKey = ContractServerMessageType.heroAbilityAdded;
    this.data = { 
      heroId,
      ability
    };
  }
}
