import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Area } from "src/computed-game-state/area/area";
import { DbArea } from "src/raw-game-state/db-area";
import { DbAreaHero } from "src/raw-game-state/db-area-hero";
import { DbCombat } from "src/raw-game-state/db-combat";
import { GamesManager } from "src/services/games-manager";
import { StaticGameContentService } from "src/static-game-content/static-game-content-service";
import { AreaCreated } from "../from-server/area-created";
import { EnterAreaType } from "./enter-area-type";

@CommandHandler(EnterAreaType)
export class EnterAreaTypeHandler implements ICommandHandler<EnterAreaType> {
  public constructor(
    private readonly eventBus: EventBus,
    private readonly gamesManager: GamesManager,
    private readonly staticGameContentService: StaticGameContentService,
  ) {

  }

  public async execute(command: EnterAreaType): Promise<void> {
    const dbHeroes: DbAreaHero[] = command.heroIds.map((heroId, index) => {
      return {
        gameId: command.game.id,
        heroId: heroId,
        combatCharacterId: index + 1,
        loot: {
          gold: 0,
          items: []
        }
      };
    });

    const currentCombat: DbCombat = {
      id: command.game.getNextCombatId(),
      team1: command.heroIds.map((heroId, index) => {
        const hero = command.game.findHero(heroId);
        if (!hero) {
          throw Error (`Hero with id: '${heroId}' does not exist.`);
        }
        return {
          id: index + 1,
          currentHealth: 100,
          name: hero.name,
          controllingUserId: command.game.userId
        };
      }),
      team2: [{
        id: command.heroIds.length + 1,
        currentHealth: 100,
        name: 'Dangerous Fish',
        controllingUserId: undefined
      }]
    };

    const dbArea: DbArea = {
      id: command.game.getNextAreaId(),
      typeKey: command.areaTypeKey,
      heroes: dbHeroes,
      currentCombat: currentCombat,
      currentCombatNumber: 1,
      totalAmountOfCombats: 3 // TODO: Get from area type
    };

    const area = Area.load(dbArea, this.staticGameContentService);

    command.game.addArea(area);

    this.eventBus.publish(new AreaCreated(command.game, area));
  }
}
