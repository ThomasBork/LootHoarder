import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractChatStatusMessageContent } from "./contract-chat-status-message-content";
import { ChatStatusUser } from "./contract-chat-status-user";

export class ContractChatStatusMessage implements ContractServerWebSocketMessage<ContractChatStatusMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractChatStatusMessageContent;
  public constructor(users: ChatStatusUser[]) {
    this.typeKey = ContractServerMessageType.chatStatus;
    this.data = {
      users: users
    };
  }
}
