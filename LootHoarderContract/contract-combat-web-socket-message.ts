import { ContractMessageType } from "./contract-message-type";
import { ContractWebSocketMessage } from "./contract-web-socket-message";
import { ContractCombatWebSocketInnerMessage } from "./contract-combat-web-socket-inner-message";

export interface ContractCombatWebSocketMessageContent<T = any> {
  combatId: number;
  innerMessage: ContractCombatWebSocketInnerMessage<T>;
}

export class ContractCombatWebSocketMessage<T = any> implements ContractWebSocketMessage {
  public typeKey: string;
  public data: ContractCombatWebSocketMessageContent<T>;
  public constructor(combatId: number, innerMessage: ContractCombatWebSocketInnerMessage<T>) {
    this.typeKey = ContractMessageType.combat;
    this.data = {
      combatId,
      innerMessage
    };
  }
}
