import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractArea } from "../contract-area";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractAreaCreatedMessageContent } from "./contract-area-created-message-content";

export class ContractAreaCreatedMessage implements ContractServerWebSocketMessage<ContractAreaCreatedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractAreaCreatedMessageContent;
  public constructor(area: ContractArea) {
    this.typeKey = ContractServerMessageType.areaAdded;
    this.data = { area };
  }
}