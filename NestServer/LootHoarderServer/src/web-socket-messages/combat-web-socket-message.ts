import { WebSocketMessage } from "./web-socket-message";

export interface CombatWebSocketMessageContent {
  combatId: number;
  innerMessage: WebSocketMessage;
}

export class CombatWebSocketMessage implements WebSocketMessage {
  public typeKey: string;
  public data: CombatWebSocketMessageContent;
  public constructor(combatId: number, innerMessageTypeKey: string, innerMessageData: any) {
    this.typeKey = 'combat';
    this.data = {
      combatId,
      innerMessage: {
        typeKey: innerMessageTypeKey,
        data: innerMessageData
      }
    };
  }
}
