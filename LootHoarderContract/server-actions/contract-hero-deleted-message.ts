import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractHeroDeletedMessageContent } from "./contract-hero-deleted-message-content";

export class ContractHeroDeletedMessage implements ContractServerWebSocketMessage<ContractHeroDeletedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroDeletedMessageContent;
  public constructor(heroId: number) {
    this.typeKey = ContractServerMessageType.heroDeleted;
    this.data = { 
      heroId 
    };
  }
}
