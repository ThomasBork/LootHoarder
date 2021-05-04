import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractServerWebSocketMultimessageContent } from "./contract-server-web-socket-multimessage-content";

export class ContractServerWebSocketMultimessage implements ContractServerWebSocketMessage<ContractServerWebSocketMultimessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractServerWebSocketMultimessageContent;
  public constructor(messages: ContractServerWebSocketMessage[]) {
    this.typeKey = ContractServerMessageType.multimessage;
    this.data = { 
      messages
    };
  }
}