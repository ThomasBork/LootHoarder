import { ContractClientMessageType } from "./contract-client-message-type";

export interface ContractClientWebSocketMessage<T = any> {
  typeKey: ContractClientMessageType;
  data: T;
}
