import { ContractCombatMessageType } from "./combat-messages/contract-combat-message-type";

export class ContractCombatWebSocketInnerMessage<T = any> {
  public typeKey: ContractCombatMessageType;
  public data: T;
  public constructor(typeKey: ContractCombatMessageType, data: T) {
    this.typeKey = typeKey;
    this.data = data;
  }
}
