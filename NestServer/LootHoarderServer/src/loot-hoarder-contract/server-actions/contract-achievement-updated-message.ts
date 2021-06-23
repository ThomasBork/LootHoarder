import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractAchievementUpdatedMessageContent } from "./contract-achievement-updated-message-content";

export class ContractAchievementUpdatedMessage implements ContractServerWebSocketMessage<ContractAchievementUpdatedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractAchievementUpdatedMessageContent;
  public constructor(achievementTypeKey: string, accomplishmentCompletedAmount: number[], isComplete: boolean) {
    this.typeKey = ContractServerMessageType.achievementUpdated;
    this.data = { 
      achievementTypeKey,
      accomplishmentCompletedAmount,
      isComplete
    };
  }
}
