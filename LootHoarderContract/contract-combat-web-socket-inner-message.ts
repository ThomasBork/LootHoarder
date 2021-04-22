export class ContractCombatWebSocketInnerMessage<T = any> {
  public typeKey: string;
  public data: T;
  public constructor(typeKey: string, data: T) {
    this.typeKey = typeKey;
    this.data = data;
  }
}
