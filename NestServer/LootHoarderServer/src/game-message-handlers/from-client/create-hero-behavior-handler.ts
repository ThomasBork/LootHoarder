import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CharacterBehavior } from "src/computed-game-state/character-behavior";
import { DbCharacterBehavior } from "src/raw-game-state/db-character-behavior";
import { ItemSpawnerService } from "src/services/item-spawner-service";
import { CreateHeroBehavior } from "./create-hero-behavior";

@CommandHandler(CreateHeroBehavior)
export class CreateHeroBehaviorHandler implements ICommandHandler<CreateHeroBehavior> {
  public constructor (private readonly itemSpawnerService: ItemSpawnerService) {

  }
  
  public async execute(command: CreateHeroBehavior): Promise<void> {
    const hero = command.game.getHero(command.heroId);
    const dbBehavior: DbCharacterBehavior = {
      id: command.game.getNextHeroBehaviorId(),
      name: 'Custom behavior',
      prioritizedActions: []
    };
    const behavior = CharacterBehavior.load(dbBehavior);
    hero.addBehavior(behavior);    
  }
}
