import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { Area } from "src/computed-game-state/area/area";
import { AreaTypeEncounterMonsterType } from "src/computed-game-state/area/area-type-encounter-monster-type";
import { AttributeSet } from "src/computed-game-state/attribute-set";
import { Game } from "src/computed-game-state/game";
import { DbAbility } from "src/raw-game-state/db-ability";
import { DbCombatCharacter } from "src/raw-game-state/db-combat-character";

@Injectable()
export class MonsterSpawnerService {
  private logger: Logger = new Logger('CombatUpdaterService');

  public constructor(
  ) {}

  public createDbMonsterCombatCharacters(
    game: Game, 
    encounterMonsterTypes: AreaTypeEncounterMonsterType[], 
    areaLevel: number,
    firstMonsterId: number,
  ): DbCombatCharacter[] {
    const dbMonsterCombatCharacters = encounterMonsterTypes.map((encounterMonster, index) => {
      const monsterType = encounterMonster.monsterType;
      const dbAbilities: DbAbility[] = monsterType.abilityTypes.map(abilityType => {
        return {
          id: game.getNextAbilityId(),
          typeKey: abilityType.key,
          remainingCooldown: 0
        };
      });
      const level = areaLevel;

      const attributes = new AttributeSet(monsterType.baseAttributes.getValues());
      const attributesPerLevel = new AttributeSet(monsterType.attributesPerLevel.getValues());
      attributesPerLevel.setMultiplicativeModifier(this, level);
      attributes.setAdditiveValueContainers(attributesPerLevel);

      const dbCombatCharacter: DbCombatCharacter = {
        id: firstMonsterId + index,
        typeKey: monsterType.key,
        currentHealth: attributes.maximumHealthVC.value,
        name: monsterType.name,
        controllingUserId: game.userId,
        attributeSet: attributes
          .getValues()
          .toDbModel(),
        abilities: dbAbilities,
        idOfAbilityBeingUsed: undefined,
        remainingTimeToUseAbility: 0
      };
      return dbCombatCharacter;
    });
    return dbMonsterCombatCharacters;
  }
}
