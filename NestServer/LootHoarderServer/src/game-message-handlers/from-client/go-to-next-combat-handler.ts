import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Combat } from "src/computed-game-state/area/combat";
import { DbCombat } from "src/raw-game-state/db-combat";
import { MonsterSpawnerService } from "src/services/monster-spawner-service";
import { RandomService } from "src/services/random-service";
import { GoToNextCombat } from "./go-to-next-combat";

@CommandHandler(GoToNextCombat)
export class GoToNextCombatHandler implements ICommandHandler<GoToNextCombat> {
  public constructor(
    private readonly randomService: RandomService,
    private readonly monsterSpawnerService: MonsterSpawnerService
  ) {

  }

  public async execute(command: GoToNextCombat): Promise<void> {
    const game = command.game;
    const area = command.area;

    if (area.currentCombatNumber === area.totalAmountOfCombats) {
      throw Error (`Area has no next combat after combat number ${area.currentCombatNumber}`);
    }

    const dbHeroCombatCharacters = area.heroes.map(hero => hero.combatCharacter.dbModel);

    let nextRepeatedEncounter = undefined;
    let encountersToSkip = area.currentCombatNumber;
    for(const repeatedEncounter of area.type.repeatedEncounters) {
      if (encountersToSkip < repeatedEncounter.repetitionAmount) {
        nextRepeatedEncounter = repeatedEncounter;
        break;
      }
      encountersToSkip -= repeatedEncounter.repetitionAmount;
    }

    if (!nextRepeatedEncounter) {
      throw Error (`Area has no next combat after combat number ${area.currentCombatNumber}`);
    }

    const encounter = this.randomService.randomWeightedElement(nextRepeatedEncounter.weightedEncounters);
    const firstMonsterId = dbHeroCombatCharacters.length + 1;
    const dbMonsterCombatCharacters = this.monsterSpawnerService.createDbMonsterCombatCharacters(game, encounter.monsterTypes, area.type.level, firstMonsterId);

    const dbCombat: DbCombat = {
      id: game.getNextCombatId(),
      hasEnded: false,
      didTeam1Win: undefined,
      team1: dbHeroCombatCharacters,
      team2: dbMonsterCombatCharacters
    }

    const combat = Combat.load(dbCombat);

    area.startNewCurrentCombat(combat);
  }
}
