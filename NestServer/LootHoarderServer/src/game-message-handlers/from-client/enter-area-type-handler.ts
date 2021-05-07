import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Area } from "src/computed-game-state/area/area";
import { DbAbility } from "src/raw-game-state/db-ability";
import { DbArea } from "src/raw-game-state/db-area";
import { DbAreaHero } from "src/raw-game-state/db-area-hero";
import { DbCombat } from "src/raw-game-state/db-combat";
import { DbCombatCharacter } from "src/raw-game-state/db-combat-character";
import { MonsterSpawnerService } from "src/services/monster-spawner-service";
import { RandomService } from "src/services/random-service";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { EnterAreaType } from "./enter-area-type";

@CommandHandler(EnterAreaType)
export class EnterAreaTypeHandler implements ICommandHandler<EnterAreaType> {
  public constructor(
    private readonly staticGameContentService: StaticGameContentService,
    private readonly randomService: RandomService,
    private readonly monsterSpawnerService: MonsterSpawnerService
  ) {

  }

  public async execute(command: EnterAreaType): Promise<void> {
    const game = command.game;
    const areaType = this.staticGameContentService.getAreaType(command.areaTypeKey);

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

    const dbHeroCombatCharacters = command.heroIds.map((heroId, index) => {
      const hero = command.game.findHero(heroId);
      if (!hero) {
        throw Error (`Hero with id: '${heroId}' does not exist.`);
      }
      const dbAbilities: DbAbility[] = hero.abilityTypes.map(abilityType => {
        return {
          id: command.game.getNextAbilityId(),
          typeKey: abilityType.key,
          remainingCooldown: 0
        };
      });
      const dbCombatCharacter: DbCombatCharacter = {
        id: index + 1,
        typeKey: hero.type.key,
        currentHealth: hero.maximumHealthVC.value,
        name: hero.name,
        controllingUserId: command.game.userId,
        attributeSet: hero.attributes
          .toDbModel(),
        abilities: dbAbilities,
        idOfAbilityBeingUsed: undefined,
        remainingTimeToUseAbility: 0
      };
      return dbCombatCharacter;
    });

    const areaTypeRepeatedEncounter = areaType.repeatedEncounters[0];
    const encounter = this.randomService.randomWeightedElement(areaTypeRepeatedEncounter.weightedEncounters);
    const firstMonsterId = dbHeroCombatCharacters.length + 1;
    const dbMonsterCombatCharacters = this.monsterSpawnerService.createDbMonsterCombatCharacters(game, encounter.monsterTypes, areaType.level, firstMonsterId);

    const currentCombat: DbCombat = {
      id: command.game.getNextCombatId(),
      hasEnded: false,
      didTeam1Win: undefined,
      team1: dbHeroCombatCharacters,
      team2: dbMonsterCombatCharacters
    };

    const totalAmountOfCombats = areaType.repeatedEncounters
      .map(repeatedEncounter => repeatedEncounter.repetitionAmount)
      .reduce((a1, a2) => a1 + a2, 0);

    const dbArea: DbArea = {
      id: command.game.getNextAreaId(),
      typeKey: command.areaTypeKey,
      heroes: dbHeroes,
      currentCombat: currentCombat,
      currentCombatNumber: 1,
      totalAmountOfCombats: totalAmountOfCombats,
      loot: {
        gold: 0,
        items: []
      }
    };

    const area = Area.load(dbArea);

    command.game.addArea(area);
  }
}
