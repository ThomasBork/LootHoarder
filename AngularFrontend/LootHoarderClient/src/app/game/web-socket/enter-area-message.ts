import { WebSocketMessage } from "./web-socket-message";

export interface EnterAreaMessageContent {
  typeKey: string;
  heroIds: number[];
}

export class EnterAreaMessage implements WebSocketMessage {
  public typeKey: string;
  public data: EnterAreaMessageContent;
  public constructor(typeKey: string, heroIds: number[]) {
    this.typeKey = 'enter-area';
    this.data = { typeKey, heroIds };
  }
}