import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractItemEquippedMessageContent } from "./contract-item-equipped-message-content";
import { ContractItem } from "../contract-item";
import { ContractInventoryPosition } from "../contract-inventory-position";

export class ContractItemEquippedMessage implements ContractServerWebSocketMessage<ContractItemEquippedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractItemEquippedMessageContent;
  public constructor(heroId: number, item: ContractItem, position: ContractInventoryPosition) {
    this.typeKey = ContractServerMessageType.itemEquipped;
    this.data = { 
      heroId,
      item,
      position
    };
  }
}
