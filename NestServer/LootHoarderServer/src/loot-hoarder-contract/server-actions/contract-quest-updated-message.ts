import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractQuestUpdatedMessageContent } from "./contract-quest-updated-message-content";

export class ContractQuestUpdatedMessage implements ContractServerWebSocketMessage<ContractQuestUpdatedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractQuestUpdatedMessageContent;
  public constructor(questTypeKey: string, accomplishmentCompletedAmount: number[], isComplete: boolean) {
    this.typeKey = ContractServerMessageType.questUpdated;
    this.data = { 
      questTypeKey,
      accomplishmentCompletedAmount,
      isComplete
    };
  }
}
