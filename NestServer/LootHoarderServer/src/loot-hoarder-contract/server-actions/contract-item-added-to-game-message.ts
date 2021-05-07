import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractItemAddedToGameMessageContent } from "./contract-item-added-to-game-message-content";
import { ContractItem } from "../contract-item";

export class ContractItemAddedToGameMessage implements ContractServerWebSocketMessage<ContractItemAddedToGameMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractItemAddedToGameMessageContent;
  public constructor(item: ContractItem) {
    this.typeKey = ContractServerMessageType.itemAddedToGame;
    this.data = { item };
  }
}
