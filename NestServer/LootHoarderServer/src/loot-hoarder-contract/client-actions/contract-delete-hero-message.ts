import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractDeleteHeroMessageContent } from './contract-delete-hero-message-content';


export class ContractDeleteHeroMessage implements ContractClientWebSocketMessage<ContractDeleteHeroMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractDeleteHeroMessageContent;
  public constructor(
    heroId: number
  ) {
    this.typeKey = ContractClientMessageType.deleteHero;
    this.data = { 
      heroId
    };
  }
}