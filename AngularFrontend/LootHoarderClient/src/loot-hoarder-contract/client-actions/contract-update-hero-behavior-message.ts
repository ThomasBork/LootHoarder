import { ContractCharacterBehavior } from '../contract-character-behavior';
import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractUpdateHeroBehaviorMessageContent } from './contract-update-hero-behavior-message-content';

export class ContractUpdateHeroBehaviorMessage implements ContractClientWebSocketMessage<ContractUpdateHeroBehaviorMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractUpdateHeroBehaviorMessageContent;
  public constructor(heroId: number, behavior: ContractCharacterBehavior) {
    this.typeKey = ContractClientMessageType.updateHeroBehavior;
    this.data = { heroId, behavior };
  }
}
