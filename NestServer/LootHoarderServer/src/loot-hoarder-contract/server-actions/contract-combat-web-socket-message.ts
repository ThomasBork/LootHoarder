import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractCombatWebSocketInnerMessage } from "./contract-combat-web-socket-inner-message";

export interface ContractCombatWebSocketMessageContent<T = any> {
  combatId: number;
  innerMessage: ContractCombatWebSocketInnerMessage<T>;
}

export class ContractCombatWebSocketMessage<T = any> implements ContractServerWebSocketMessage {
  public typeKey: ContractServerMessageType;
  public data: ContractCombatWebSocketMessageContent<T>;
  public constructor(combatId: number, innerMessage: ContractCombatWebSocketInnerMessage<T>) {
    this.typeKey = ContractServerMessageType.combat;
    this.data = {
      combatId,
      innerMessage
    };
  }
}
