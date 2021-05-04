import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractHero } from "../contract-hero";
import { ContractHeroAddedMessageContent } from "./contract-hero-added-message-content";

export class ContractHeroAddedMessage implements ContractServerWebSocketMessage {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroAddedMessageContent;
  public constructor(hero: ContractHero) {
    this.typeKey = ContractServerMessageType.heroAdded;
    this.data = { hero };
  }
}
