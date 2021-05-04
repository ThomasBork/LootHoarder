import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractCombatStartedMessageContent } from "./contract-combat-started-message-content";
import { ContractCombat } from "../contract-combat";

export class ContractCombatStartedMessage implements ContractServerWebSocketMessage<ContractCombatStartedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractCombatStartedMessageContent;
  public constructor(areaId: number, combat: ContractCombat, combatNumber: number) {
    this.typeKey = ContractServerMessageType.combatStarted;
    this.data = { areaId, combat, combatNumber };
  }
}
