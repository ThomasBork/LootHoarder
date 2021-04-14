import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { GamesManager } from "src/services/games-manager";
import { AreaCreatedMessage } from "src/web-socket-messages/area-created-message";
import { AreaCreated } from "./area-created";

@EventsHandler(AreaCreated)
export class AreaCreatedHandler implements IEventHandler<AreaCreated> {
  public constructor(
    private readonly gamesManager: GamesManager
  ) {}

  public handle(event: AreaCreated): void {
    const message = new AreaCreatedMessage(event.area.getUIState());
    this.gamesManager.sendMessage(event.game, message);
  }
}