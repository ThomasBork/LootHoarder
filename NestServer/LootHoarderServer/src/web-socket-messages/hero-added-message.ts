import { UIHero } from "src/ui-game-state/ui-hero";
import { WebSocketMessage } from "./web-socket-message";

export interface HeroAddedMessageContent {
  hero: UIHero
}

export class HeroAddedMessage implements WebSocketMessage {
  public typeKey: string;
  public data: HeroAddedMessageContent;
  public constructor(hero: UIHero) {
    this.typeKey = 'hero-added';
    this.data = { hero };
  }
}