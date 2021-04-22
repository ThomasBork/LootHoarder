import { ContractWebSocketMessage } from "./contract-web-socket-message";
import { ContractArea } from "./contract-area";
import { ContractMessageType } from "./contract-message-type";
import { ContractAreaCreatedMessageContent } from "./contract-area-created-message-content";

export class ContractAreaCreatedMessage implements ContractWebSocketMessage {
  public typeKey: string;
  public data: ContractAreaCreatedMessageContent;
  public constructor(area: ContractArea) {
    this.typeKey = ContractMessageType.areaAdded;
    this.data = { area };
  }
}