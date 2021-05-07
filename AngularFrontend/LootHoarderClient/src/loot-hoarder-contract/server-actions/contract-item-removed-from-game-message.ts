import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractItemRemovedFromGameMessageContent } from "./contract-item-removed-from-game-message-content";

export class ContractItemRemovedFromGameMessage implements ContractServerWebSocketMessage<ContractItemRemovedFromGameMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractItemRemovedFromGameMessageContent;
  public constructor(itemId: number) {
    this.typeKey = ContractServerMessageType.itemRemovedFromGame;
    this.data = { 
      itemId
    };
  }
}
