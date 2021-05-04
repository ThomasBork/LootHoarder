import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractGoToNextCombatMessageContent } from './contract-go-to-next-combat-message-content';

export class ContractGoToNextCombatMessage implements ContractClientWebSocketMessage<ContractGoToNextCombatMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractGoToNextCombatMessageContent;
  public constructor(areaId: number) {
    this.typeKey = ContractClientMessageType.goToNextCombat;
    this.data = { areaId };
  }
}
