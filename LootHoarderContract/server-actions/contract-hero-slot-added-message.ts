import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroSlotAddedMessageContent } from "./contract-hero-slot-added-message-content";

export class ContractHeroSlotAddedMessage implements ContractServerWebSocketMessage<ContractHeroSlotAddedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroSlotAddedMessageContent;
  public constructor() {
    this.typeKey = ContractServerMessageType.heroSlotAdded;
    this.data = { 
    };
  }
}
