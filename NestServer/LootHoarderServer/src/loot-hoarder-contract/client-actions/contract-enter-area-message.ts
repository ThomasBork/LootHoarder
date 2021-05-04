import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractEnterAreaMessageContent } from './contract-enter-area-message-content';

export class ContractEnterAreaMessage implements ContractClientWebSocketMessage {
  public typeKey: ContractClientMessageType;
  public data: ContractEnterAreaMessageContent;
  public constructor(typeKey: string, heroIds: number[]) {
    this.typeKey = ContractClientMessageType.enterArea;
    this.data = { typeKey, heroIds };
  }
}
