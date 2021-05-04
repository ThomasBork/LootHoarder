import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroAttributeChangedMessageContent } from "./contract-hero-attribute-changed-message-content";
import { ContractAttributeType } from "../contract-attribute-type";

export class ContractHeroAttributeChangedMessage implements ContractServerWebSocketMessage<ContractHeroAttributeChangedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroAttributeChangedMessageContent;
  public constructor(heroId: number, attributeType: ContractAttributeType, newValue: number) {
    this.typeKey = ContractServerMessageType.heroAttributeChanged;
    this.data = { 
      heroId,
      attributeType,
      newValue
    };
  }
}