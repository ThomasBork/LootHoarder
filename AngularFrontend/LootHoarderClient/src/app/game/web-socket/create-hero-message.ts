import { WebSocketMessage } from "./web-socket-message";

export interface CreateHeroMessageContent {
  hero: { typeKey: string, name: string };
}

export class CreateHeroMessage implements WebSocketMessage {
  public typeKey: string;
  public data: CreateHeroMessageContent;
  public constructor(typeKey: string, name: string) {
    this.typeKey = 'create-hero';
    this.data = { 
      hero: { 
        typeKey, 
        name 
      } 
    };
  }
}