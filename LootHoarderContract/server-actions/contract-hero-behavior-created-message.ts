import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroBehaviorCreatedMessageContent } from "./contract-hero-behavior-created-message-content";
import { ContractCharacterBehavior } from "../contract-character-behavior";

export class ContractHeroBehaviorCreatedMessage implements ContractServerWebSocketMessage<ContractHeroBehaviorCreatedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroBehaviorCreatedMessageContent;
  public constructor(
    heroId: number, 
    behavior: ContractCharacterBehavior
  ) {
    this.typeKey = ContractServerMessageType.heroBehaviorCreated;
    this.data = { 
      heroId,
      behavior
    };
  }
}