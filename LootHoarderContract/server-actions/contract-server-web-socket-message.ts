import { ContractServerMessageType } from "./contract-server-message-type";

export interface ContractServerWebSocketMessage<T = any> {
  typeKey: ContractServerMessageType;
  data: T;
}
