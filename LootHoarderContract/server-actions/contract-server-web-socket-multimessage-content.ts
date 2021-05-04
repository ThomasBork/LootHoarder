import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";

export interface ContractServerWebSocketMultimessageContent {
  messages: ContractServerWebSocketMessage[]
}
