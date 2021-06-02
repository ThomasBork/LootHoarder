import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroUnspentSkillPointsChangedMessageContent } from "./contract-hero-unspent-skill-points-changed-message-content";

export class ContractHeroUnspentSkillPointsChangedMessage implements ContractServerWebSocketMessage<ContractHeroUnspentSkillPointsChangedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroUnspentSkillPointsChangedMessageContent;
  public constructor(heroId: number, newUnspentSkillPoints: number) {
    this.typeKey = ContractServerMessageType.heroUnspentSkillPointsChanged;
    this.data = { 
      heroId,
      newUnspentSkillPoints
    };
  }
}