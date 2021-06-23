import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractGameTabUnlockedMessageContent } from "./contract-game-tab-unlocked-message-content";
import { ContractGameTabKey } from "../contract-game-tab-key";

export class ContractGameTabUnlockedMessage implements ContractServerWebSocketMessage<ContractGameTabUnlockedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractGameTabUnlockedMessageContent;
  public constructor(
    parentTabKey: ContractGameTabKey,
    childTabKey: string | undefined,
  ) {
    this.typeKey = ContractServerMessageType.gameTabUnlocked;
    this.data = { 
      parentTabKey,
      childTabKey
    };
  }
}
