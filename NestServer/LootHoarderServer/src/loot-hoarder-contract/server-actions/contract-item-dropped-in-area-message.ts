import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractItemDroppedInAreaMessageContent } from "./contract-item-dropped-in-area-message-content";
import { ContractItem } from "../contract-item";

export class ContractItemDroppedInAreaMessage implements ContractServerWebSocketMessage<ContractItemDroppedInAreaMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractItemDroppedInAreaMessageContent;
  public constructor(areaId: number, item: ContractItem) {
    this.typeKey = ContractServerMessageType.itemDroppedInArea;
    this.data = { areaId, item };
  }
}
