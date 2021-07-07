import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Hero } from "src/computed-game-state/hero";
import { DbHero } from "src/raw-game-state/db-hero";
import { DbHeroAbility } from "src/raw-game-state/db-hero-ability";
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

    const skillTreeStartingNode = this.staticGameContentService
      .getHeroSkillTree()
      .getHeroTypeStartingPosition(command.typeKey);

    const heroAbilities: DbHeroAbility[] = heroType.abilityTypes.map((abilityType, index) => {
      return {
        id: index + 1,
        isEnabled: true,
        typeKey: abilityType.key
      };
    });

    const dbHero: DbHero = {
      id: command.game.getNextHeroId(),
      typeKey: command.typeKey,
      name: command.name,
      level: 1,
      experience: 0,
      abilities: heroAbilities,
      behaviors: [],
      inventory: {
        leftHand: dbItem
      },
      cosmetics: {
        eyesId: command.eyesId,
        noseId: command.noseId,
        mouthId: command.mouthId
      },
      skillNodesLocations: [
        {
          x: skillTreeStartingNode.x,
          y: skillTreeStartingNode.y
        }
      ],
      nextAbilityId: heroAbilities.length + 1
    };

    const hero = Hero.load(dbHero);

    command.game.addHero(hero);
  }
}
