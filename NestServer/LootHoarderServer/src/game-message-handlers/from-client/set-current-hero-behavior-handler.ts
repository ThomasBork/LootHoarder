import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CharacterBehavior } from "src/computed-game-state/character-behavior";
import { DbCharacterBehavior } from "src/raw-game-state/db-character-behavior";
import { SetCurrentHeroBehavior } from "./set-current-hero-behavior";

@CommandHandler(SetCurrentHeroBehavior)
export class SetCurrentHeroBehaviorHandler implements ICommandHandler<SetCurrentHeroBehavior> {
  public async execute(command: SetCurrentHeroBehavior): Promise<void> {
    const hero = command.game.getHero(command.heroId);
    if (command.behaviorId) {
      const behavior = hero.getBehavior(command.behaviorId);
      hero.setCurrentBehavior(behavior);
    } else {
      hero.setCurrentBehavior(undefined);
    }
  }
}
