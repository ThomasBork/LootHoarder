import { ContractServerChatMessageType } from "src/loot-hoarder-contract/server-actions/contract-server-chat-message-type";

export class ChatMessage {
  public userId: number;
  public userName: string;
  public messageContent: string;
  public messageType: ContractServerChatMessageType;
  public timeStamp: Date;
  public isRead: boolean;

  public constructor(
    userId: number,
    userName: string,
    messageContent: string,
    messageType: ContractServerChatMessageType,
    timeStamp: Date,
  ) {
    this.userId = userId;
    this.userName = userName;
    this.messageContent = messageContent;
    this.messageType = messageType;
    this.timeStamp = timeStamp;

    this.isRead = false;
  }
}
