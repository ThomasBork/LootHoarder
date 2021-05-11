import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Hero } from "src/computed-game-state/hero";
import { DbHero } from "src/raw-game-state/db-hero";
import { ItemSpawnerService } from "src/services/item-spawner-service";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { CreateHero } from "./create-hero";

@CommandHandler(CreateHero)
export class CreateHeroHandler implements ICommandHandler<CreateHero> {
  public constructor(
    private readonly staticGameContentService: StaticGameContentService,
    private readonly itemSpawnerService: ItemSpawnerService
  ) {

  }

  public async execute(command: CreateHero): Promise<void> {
    const heroType = this.staticGameContentService.getHeroType(command.typeKey);

    const dbItem = this.itemSpawnerService.spawnStarterItem(command.game, heroType.startItemType);

    const dbHero: DbHero = {
      id: command.game.getNextHeroId(),
      typeKey: command.typeKey,
      name: command.name,
      level: 1,
      experience: 0,
      abilityTypeKeys: heroType.abilityTypes.map(abilityType => abilityType.key),
      inventory: {
        leftHand: dbItem
      },
      cosmetics: {
        eyesId: command.eyesId,
        noseId: command.noseId,
        mouthId: command.mouthId
      }
    };

    const hero = Hero.load(dbHero);

    command.game.addHero(hero);
  }
}
