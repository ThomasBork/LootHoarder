import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractSendChatMessageMessageContent } from './contract-send-chat-message-message-content';

export class ContractSendChatMessageMessage implements ContractClientWebSocketMessage<ContractSendChatMessageMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractSendChatMessageMessageContent;
  public constructor(messageContent: string) {
    this.typeKey = ContractClientMessageType.sendChatMessage;
    this.data = { 
      messageContent
    };
  }
}
