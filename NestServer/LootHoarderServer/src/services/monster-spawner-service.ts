import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { AreaTypeEncounterMonsterType } from "src/computed-game-state/area/area-type-encounter-monster-type";
import { Game } from "src/computed-game-state/game";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
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

      const attributes = monsterType.baseAttributes.flatCopy();
      const attributesPerLevel = monsterType.attributesPerLevel.flatCopy();
      attributesPerLevel.setMultiplicativeModifier(this, level);
      attributes.setAdditiveAttributeSet(attributesPerLevel);

      const maximumHealth = attributes.getAttribute(ContractAttributeType.maximumHealth, []).valueContainer.value;

      const dbAttributeSet = attributes.toDbModel();

      const dbCombatCharacter: DbCombatCharacter = {
        id: firstMonsterId + index,
        typeKey: monsterType.key,
        currentHealth: maximumHealth,
        name: monsterType.name,
        controllingUserId: game.userId,
        attributeSet: dbAttributeSet,
        abilities: dbAbilities,
        idOfAbilityBeingUsed: undefined,
        remainingTimeToUseAbility: 0
      };
      return dbCombatCharacter;
    });
    return dbMonsterCombatCharacters;
  }
}
