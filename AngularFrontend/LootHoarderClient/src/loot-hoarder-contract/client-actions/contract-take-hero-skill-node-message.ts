import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractTakeHeroSkillNodeMessageContent } from './contract-take-hero-skill-node-message-content';


export class ContractTakeHeroSkillNodeMessage implements ContractClientWebSocketMessage<ContractTakeHeroSkillNodeMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractTakeHeroSkillNodeMessageContent;
  public constructor(
    heroId: number, 
    nodeX: number, 
    nodeY: number,
  ) {
    this.typeKey = ContractClientMessageType.takeHeroSkillNode;
    this.data = { 
      heroId, 
      nodeX,
      nodeY,
    };
  }
}