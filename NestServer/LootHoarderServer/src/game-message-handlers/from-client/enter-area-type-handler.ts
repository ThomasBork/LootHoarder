import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Area } from "src/computed-game-state/area/area";
import { DbAbility } from "src/raw-game-state/db-ability";
import { DbArea } from "src/raw-game-state/db-area";
import { DbAreaHero } from "src/raw-game-state/db-area-hero";
import { DbCombat } from "src/raw-game-state/db-combat";
import { DbCombatCharacter } from "src/raw-game-state/db-combat-character";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { EnterAreaType } from "./enter-area-type";

@CommandHandler(EnterAreaType)
export class EnterAreaTypeHandler implements ICommandHandler<EnterAreaType> {
  public constructor(
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
          currentHealth: hero.attributes.maximumHealthVC.value,
          name: hero.name,
          controllingUserId: command.game.userId,
          attributeSet: hero.attributes
            .getValues()
            .toDbModel(),
          abilities: dbAbilities,
          idOfAbilityBeingUsed: undefined,
          remainingTimeToUseAbility: 0
        };
        return dbCombatCharacter;
      }),
      // TODO: Get enemies types from area
      team2: [{
        id: command.heroIds.length + 1,
        typeKey: 'dangerous-fish',
        currentHealth: 10000,
        name: 'Dangerous Fish',
        controllingUserId: undefined,
        attributeSet: {
          maximumHealth: 10000,
          maximumMana: 0,
          attackPower: 10,
          spellPower: 10,
          attackSpeed: 0.5,
          castSpeed: 0.5,
          attackCooldownSpeed: 1,
          spellCooldownSpeed: 1,
          armor: 30,
          magicResistance: 10,
        },
        abilities: [
          {
            id: command.game.getNextAbilityId(),
            typeKey: 'basic-attack',
            remainingCooldown: 0
          }
        ],
        idOfAbilityBeingUsed: undefined,
        remainingTimeToUseAbility: 0
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

    const area = Area.load(dbArea);

    command.game.addArea(area);
  }
}
