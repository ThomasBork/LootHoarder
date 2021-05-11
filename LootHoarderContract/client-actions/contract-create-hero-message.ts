import { ContractCreateHeroMessageContent } from './contract-create-hero-message-content';
import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';


export class ContractCreateHeroMessage implements ContractClientWebSocketMessage {
  public typeKey: ContractClientMessageType;
  public data: ContractCreateHeroMessageContent;
  public constructor(
    typeKey: string, 
    name: string, 
    eyesId: number,
    noseId: number,
    mouthId: number
  ) {
    this.typeKey = ContractClientMessageType.createHero;
    this.data = { 
      hero: { 
        typeKey, 
        name,
        eyesId,
        noseId,
        mouthId
      } 
    };
  }
}