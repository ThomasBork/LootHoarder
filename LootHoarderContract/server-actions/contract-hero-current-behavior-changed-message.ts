import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroCurrentBehaviorChangedMessageContent } from "./contract-hero-current-behavior-changed-message-content";

export class ContractHeroCurrentBehaviorChangedMessage implements ContractServerWebSocketMessage<ContractHeroCurrentBehaviorChangedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroCurrentBehaviorChangedMessageContent;
  public constructor(
    heroId: number, 
    behaviorId: number | undefined
  ) {
    this.typeKey = ContractServerMessageType.heroCurrentBehaviorChanged;
    this.data = { 
      heroId,
      behaviorId
    };
  }
}