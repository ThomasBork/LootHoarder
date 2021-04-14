import { UIArea } from "src/ui-game-state/ui-area";
import { UIHero } from "src/ui-game-state/ui-hero";
import { WebSocketMessage } from "./web-socket-message";

export interface AreaCreatedMessageContent {
  area: UIArea
}

export class AreaCreatedMessage implements WebSocketMessage {
  public typeKey: string;
  public data: AreaCreatedMessageContent;
  public constructor(area: UIArea) {
    this.typeKey = 'area-created';
    this.data = { area };
  }
}