import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractItemUnequippedMessageContent } from "./contract-item-unequipped-message-content";
import { ContractInventoryPosition } from "../contract-inventory-position";

export class ContractItemUnequippedMessage implements ContractServerWebSocketMessage<ContractItemUnequippedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractItemUnequippedMessageContent;
  public constructor(heroId: number, itemId: number, position: ContractInventoryPosition) {
    this.typeKey = ContractServerMessageType.itemUnequipped;
    this.data = { 
      heroId,
      itemId,
      position
    };
  }
}
