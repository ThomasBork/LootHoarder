import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { GamesManager } from "src/services/games-manager";
import { HeroAddedMessage } from "src/web-socket-messages/hero-added-message";
import { HeroAdded } from "./hero-added";

@EventsHandler(HeroAdded)
export class HeroAddedHandler implements IEventHandler<HeroAdded> {
  public constructor(
    private readonly gamesManager: GamesManager
  ) {}

  public handle(event: HeroAdded): void {
    const message = new HeroAddedMessage(event.hero.getUIState());
    this.gamesManager.sendMessage(event.game, message);
  }
}