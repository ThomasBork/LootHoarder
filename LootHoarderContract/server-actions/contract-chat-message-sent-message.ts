import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractServerChatMessageType } from "./contract-server-chat-message-type";
import { ContractChatMessageSentMessageContent } from "./contract-chat-message-sent-message-content";

export class ContractChatMessageSentMessage implements ContractServerWebSocketMessage<ContractChatMessageSentMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractChatMessageSentMessageContent;
  public constructor(userId: number, userName: string, messageContent: string, messageType: ContractServerChatMessageType) {
    this.typeKey = ContractServerMessageType.chatMessageSent;
    this.data = {
      user: {
        id: userId,
        userName: userName
      },
      messageContent: messageContent,
      messageType: messageType
    };
  }
}
