import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Area } from "src/computed-game-state/area/area";
import { Hero } from "src/computed-game-state/hero";
import { DbAbility } from "src/raw-game-state/db-ability";
import { DbArea } from "src/raw-game-state/db-area";
import { DbAreaHero } from "src/raw-game-state/db-area-hero";
import { DbCharacterBehavior } from "src/raw-game-state/db-character-behavior";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";
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
      const abilityIdsMap = new Map<number, number>();
      
      const dbAbilities: DbAbility[] = hero.abilities.map(ability => {
        const dbAbility = {
          id: command.game.getNextCombatCharacterAbilityId(),
          typeKey: ability.type.key,
          remainingCooldown: 0
        };
        abilityIdsMap.set(ability.id, dbAbility.id);
        return dbAbility;
      });

      const dbCombatCharacter: DbCombatCharacter = {
        id: index + 1,
        typeKey: hero.type.key,
        currentHealth: hero.maximumHealthVC.value,
        currentMana: hero.maximumManaVC.value,
        name: hero.name,
        controllingUserId: command.game.userId,
        attributeSet: hero.attributes
          .toDbModel(),
        abilities: dbAbilities,
        idOfAbilityBeingUsed: undefined,
        remainingTimeToUseAbility: 0,
        continuousEffects: [],
        behavior: this.buildDbBehavior(hero, abilityIdsMap)
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

  private buildDbBehavior(hero: Hero, abilityIdsMap: Map<number, number>): DbCharacterBehavior | undefined {
    if (!hero.currentBehavior) {
      return undefined;
    }

    const getNewAbilityId = (oldAbilityId: number) => {
      const newId = abilityIdsMap.get(oldAbilityId);
      if (newId === undefined) {
        throw Error (`Ability with id ${oldAbilityId} not found`);
      }
      return newId;
    };

    return {
      id: hero.currentBehavior.id,
      name: hero.currentBehavior.name,
      prioritizedActions: hero.currentBehavior.prioritizedActions.map(action => {
        const predicate = action.predicate ? this.buildDbBehaviorPredicate(action.predicate.toDbModel(), getNewAbilityId) : undefined;
        const target = action.target ? this.buildDbBehaviorTarget(action.target.toDbModel(), getNewAbilityId) : undefined;
        return {
          abilityId: getNewAbilityId(action.abilityId),
          predicate: predicate,
          target: target
        };
      })
    }
  }

  private buildDbBehaviorPredicate(predicate: DbCharacterBehaviorPredicate, abilityIdMapper: (oldAbilityId: number) => number): DbCharacterBehaviorPredicate {
    return {
      typeKey: predicate.typeKey,
      abilityId: predicate.abilityId ? abilityIdMapper(predicate.abilityId) : undefined,
      continuousEffectTypeKey: predicate.continuousEffectTypeKey,
      innerPredicate: predicate.innerPredicate ? this.buildDbBehaviorPredicate(predicate.innerPredicate, abilityIdMapper) : undefined,
      innerPredicates: predicate.innerPredicates?.map(innerPredicate => this.buildDbBehaviorPredicate(innerPredicate, abilityIdMapper)),
      leftValue: predicate.leftValue ? this.buildDbBehaviorValue(predicate.leftValue, abilityIdMapper) : undefined,
      rightValue: predicate.rightValue ? this.buildDbBehaviorValue(predicate.rightValue, abilityIdMapper) : undefined,
      valueRelation: predicate.valueRelation
    };
  }

  private buildDbBehaviorTarget(target: DbCharacterBehaviorTarget, abilityIdMapper: (oldAbilityId: number) => number): DbCharacterBehaviorTarget {
    return {
      typeKey: target.typeKey,
      heroId: target.heroId,
      predicate: target.predicate ? this.buildDbBehaviorPredicate(target.predicate, abilityIdMapper) : undefined,
      value: target.value ? this.buildDbBehaviorValue(target.value, abilityIdMapper) : undefined
    };
  }

  private buildDbBehaviorValue(value: DbCharacterBehaviorValue, abilityIdMapper: (oldAbilityId: number) => number): DbCharacterBehaviorValue {
    return {
      typeKey: value.typeKey,
      abilityId: value.abilityId ? abilityIdMapper(value.abilityId) : undefined,
      attributeAbilityTags: value.attributeAbilityTags,
      attributeTypeKey: value.attributeTypeKey,
      number: value.number
    };
  }
}
