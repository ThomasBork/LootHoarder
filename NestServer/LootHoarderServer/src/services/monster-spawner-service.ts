import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { AreaTypeEncounterMonsterType } from "src/computed-game-state/area/area-type-encounter-monster-type";
import { AttributeSet } from "src/computed-game-state/attribute-set";
import { Game } from "src/computed-game-state/game";
import { ValueContainer } from "src/computed-game-state/value-container";
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
          id: game.getNextCombatCharacterAbilityId(),
          typeKey: abilityType.key,
          remainingCooldown: 0
        };
      });
      const level = areaLevel;
      
      const attributes = new AttributeSet();
      
      for(const typeAttributeValueContainer of monsterType.baseAttributes.attributeValueContainers) {
        const combinedAttribute = attributes.getAttribute(typeAttributeValueContainer.attributeType, typeAttributeValueContainer.abilityTags);
        combinedAttribute.additiveValueContainer.setAdditiveValueContainer(typeAttributeValueContainer.valueContainer);
      }
      
      for(const typeAttributePerLevelValueContainer of monsterType.attributesPerLevel.attributeValueContainers) {
        const attributeFromLevelValueContainer = new ValueContainer();
        attributeFromLevelValueContainer.setAdditiveValueContainer(typeAttributePerLevelValueContainer.valueContainer);
        attributeFromLevelValueContainer.setMultiplicativeModifier(this, level);
        const combinedAttribute = attributes.getAttribute(typeAttributePerLevelValueContainer.attributeType, typeAttributePerLevelValueContainer.abilityTags);
        combinedAttribute.additiveValueContainer.setAdditiveValueContainer(attributeFromLevelValueContainer);
      }

      const maximumHealth = attributes.getAttribute(ContractAttributeType.maximumHealth, []).valueContainer.value;
      const maximumMana = attributes.getAttribute(ContractAttributeType.maximumMana, []).valueContainer.value;

      const dbAttributeSet = attributes.toDbModel();

      const dbCombatCharacter: DbCombatCharacter = {
        id: firstMonsterId + index,
        typeKey: monsterType.key,
        currentHealth: maximumHealth,
        currentMana: maximumMana,
        name: monsterType.name,
        controllingUserId: game.userId,
        attributeSet: dbAttributeSet,
        abilities: dbAbilities,
        idOfAbilityBeingUsed: undefined,
        remainingTimeToUseAbility: 0,
        continuousEffects: []
      };
      return dbCombatCharacter;
    });
    return dbMonsterCombatCharacters;
  }
}
