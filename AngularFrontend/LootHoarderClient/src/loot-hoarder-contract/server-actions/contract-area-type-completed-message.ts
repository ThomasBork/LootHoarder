import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractAreaTypeCompletedMessageContent } from "./contract-area-type-completed-message-content";

export class ContractAreaTypeCompletedMessage implements ContractServerWebSocketMessage<ContractAreaTypeCompletedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractAreaTypeCompletedMessageContent;
  public constructor(areaTypeKey: string, newAvailableAreaTypeKeys: string[]) {
    this.typeKey = ContractServerMessageType.areaTypeCompleted;
    this.data = { areaTypeKey, newAvailableAreaTypeKeys };
  }
}
