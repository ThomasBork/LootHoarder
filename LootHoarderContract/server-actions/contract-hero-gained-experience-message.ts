import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroGainedExperienceMessageContent } from "./contract-hero-gained-experience-message-content";

export class ContractHeroGainedExperienceMessage implements ContractServerWebSocketMessage<ContractHeroGainedExperienceMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroGainedExperienceMessageContent;
  public constructor(heroId: number, newLevel: number, newExperience: number) {
    this.typeKey = ContractServerMessageType.heroGainedExperience;
    this.data = { 
      heroId,
      newLevel,
      newExperience
    };
  }
}