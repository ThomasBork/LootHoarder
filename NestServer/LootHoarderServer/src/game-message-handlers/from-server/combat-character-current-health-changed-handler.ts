import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { GamesManager } from "src/services/games-manager";
import { CombatCharacterCurrentHealthChangedMessage } from "src/web-socket-messages/combat-character-current-health-changed-message";
import { CombatCharacterCurrentHealthChanged } from "./combat-character-current-health-changed";

@EventsHandler(CombatCharacterCurrentHealthChanged)
export class CombatCharacterCurrentHealthChangedHandler implements IEventHandler<CombatCharacterCurrentHealthChanged> {
  public constructor(
    private readonly gamesManager: GamesManager
  ) {}

  public handle(event: CombatCharacterCurrentHealthChanged): void {
    const message = new CombatCharacterCurrentHealthChangedMessage(event.combatId, event.character.id, event.newCurrentHealth);
    this.gamesManager.sendMessage(event.game, message);
  }
}
