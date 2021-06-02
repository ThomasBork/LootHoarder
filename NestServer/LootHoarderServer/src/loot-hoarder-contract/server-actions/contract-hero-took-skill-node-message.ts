import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroTookSkillNodeMessageContent } from "./contract-hero-took-skill-node-message-content";
import { ContractSkillNodeLocation } from "../contract-skill-node-location";

export class ContractHeroTookSkillNodeMessage implements ContractServerWebSocketMessage<ContractHeroTookSkillNodeMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroTookSkillNodeMessageContent;
  public constructor(heroId: number, nodeX: number, nodeY: number, newAvailableSkillNodes: ContractSkillNodeLocation[]) {
    this.typeKey = ContractServerMessageType.heroTookSkillNode;
    this.data = { 
      heroId,
      nodeX,
      nodeY,
      newAvailableSkillNodes
    };
  }
}