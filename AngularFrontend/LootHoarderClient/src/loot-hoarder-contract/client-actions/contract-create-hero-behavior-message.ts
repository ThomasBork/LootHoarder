import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractCreateHeroBehaviorMessageContent } from './contract-create-hero-behavior-message-content';

export class ContractCreateHeroBehaviorMessage implements ContractClientWebSocketMessage<ContractCreateHeroBehaviorMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractCreateHeroBehaviorMessageContent;
  public constructor(heroId: number) {
    this.typeKey = ContractClientMessageType.createHeroBehavior;
    this.data = { heroId };
  }
}
