import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractLeaveAreaMessageContent } from './contract-leave-area-message-content';

export class ContractLeaveAreaMessage implements ContractClientWebSocketMessage<ContractLeaveAreaMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractLeaveAreaMessageContent;
  public constructor(areaId: number) {
    this.typeKey = ContractClientMessageType.leaveArea;
    this.data = { areaId };
  }
}
