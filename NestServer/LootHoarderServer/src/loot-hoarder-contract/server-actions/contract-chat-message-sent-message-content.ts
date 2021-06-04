import { ContractServerChatMessageType } from "./contract-server-chat-message-type";

export interface ContractChatMessageSentMessageContent {
  user: {
    id: number,
    userName: string
  };
  messageContent: string;
  messageType: ContractServerChatMessageType;
}