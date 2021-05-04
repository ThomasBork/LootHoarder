import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractAreaAbandonedMessageContent } from "./contract-area-abandoned-message-content";

export class ContractAreaAbandonedMessage implements ContractServerWebSocketMessage<ContractAreaAbandonedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractAreaAbandonedMessageContent;
  public constructor(areaId: number) {
    this.typeKey = ContractServerMessageType.areaAbandoned;
    this.data = { areaId };
  }
}
