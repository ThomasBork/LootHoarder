import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractSetCurrentHeroBehaviorMessageContent } from './contract-set-current-hero-behavior-message-content';

export class ContractSetCurrentHeroBehaviorMessage implements ContractClientWebSocketMessage<ContractSetCurrentHeroBehaviorMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractSetCurrentHeroBehaviorMessageContent;
  public constructor(heroId: number, behaviorId: number | undefined) {
    this.typeKey = ContractClientMessageType.setCurrentHeroBehavior;
    this.data = { heroId, behaviorId };
  }
}
