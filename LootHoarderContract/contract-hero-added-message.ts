import { ContractMessageType } from "./contract-message-type";
import { ContractWebSocketMessage } from "./contract-web-socket-message";
import { ContractHero } from "./contract-hero";
import { ContractHeroAddedMessageContent } from "./contract-hero-added-message-content";

export class ContractHeroAddedMessage implements ContractWebSocketMessage {
  public typeKey: string;
  public data: ContractHeroAddedMessageContent;
  public constructor(hero: ContractHero) {
    this.typeKey = ContractMessageType.heroAdded;
    this.data = { hero };
  }
}
