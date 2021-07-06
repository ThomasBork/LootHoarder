import { ContractCharacterBehaviorAction } from "src/loot-hoarder-contract/contract-character-behavior-action";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { DbCharacterBehaviorAction } from "src/raw-game-state/db-character-behavior-action";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorPredicateAbilityReady } from "./character-behavior-predicate-ability-ready";
import { CharacterBehaviorPredicateAnd } from "./character-behavior-predicate-and";
import { CharacterBehaviorPredicateHasContinuousEffect } from "./character-behavior-predicate-has-continuous-effect";
import { CharacterBehaviorPredicateNot } from "./character-behavior-predicate-not";
import { CharacterBehaviorPredicateOr } from "./character-behavior-predicate-or";
import { CharacterBehaviorPredicateRelativeValues } from "./character-behavior-predicate-relative-values";
import { CharacterBehaviorTarget } from "./character-behavior-target";
import { CharacterBehaviorTargetCharacterWithExtremeValue } from "./character-behavior-target-character-with-extreme-value";
import { CharacterBehaviorTargetRandomCharacter } from "./character-behavior-target-random-character";
import { CharacterBehaviorTargetRandomCharacterMatchingPredicate } from "./character-behavior-target-random-character-matching-predicate";
import { CharacterBehaviorTargetSpecificHero } from "./character-behavior-target-specific-hero";
import { CharacterBehaviorValue } from "./character-behavior-value";
import { CharacterBehaviorValueAttribute } from "./character-behavior-value-attribute";
import { CharacterBehaviorValueCurrentHealth } from "./character-behavior-value-current-health";
import { CharacterBehaviorValueCurrentMana } from "./character-behavior-value-current-mana";
import { CharacterBehaviorValueNumber } from "./character-behavior-value-number";
import { CharacterBehaviorValuePercentageCurrentHealth } from "./character-behavior-value-percentage-current-health";
import { CharacterBehaviorValuePercentageCurrentMana } from "./character-behavior-value-percentage-current-mana";
import { CharacterBehaviorValueRemainingCooldownOfAbility } from "./character-behavior-value-remaining-cooldown-of-ability";

export class CharacterBehaviorAction {
  public predicate?: CharacterBehaviorPredicate;
  public abilityId: number;
  public target?: CharacterBehaviorTarget;

  public constructor(
    predicate: CharacterBehaviorPredicate | undefined,
    abilityId: number,
    target: CharacterBehaviorTarget | undefined,
  ) {
    this.predicate = predicate;
    this.abilityId = abilityId;
    this.target = target;
  }

  public toContractModel(): ContractCharacterBehaviorAction {
    return {
      predicate: this.predicate?.toContractModel(),
      abilityId: this.abilityId,
      target: this.target?.toContractModel()
    };
  }

  public toDbModel(): DbCharacterBehaviorAction {
    return {
      predicate: this.predicate?.toDbModel(),
      abilityId: this.abilityId,
      target: this.target?.toDbModel()
    };
  }

  public static load(dbModel: DbCharacterBehaviorAction): CharacterBehaviorAction {
    const predicate = dbModel.predicate ? this.loadPredicate(dbModel.predicate) : undefined;
    const target = dbModel.target ? this.loadTarget(dbModel.target) : undefined;
    return new CharacterBehaviorAction(predicate, dbModel.abilityId, target);
  }

  private static loadPredicate(dbModel: DbCharacterBehaviorPredicate): CharacterBehaviorPredicate {
    switch(dbModel.typeKey) {
      case ContractCharacterBehaviorPredicateTypeKey.not: {
        if (!dbModel.innerPredicate) {
          throw Error (`Expected an inner predicate in a ${dbModel.typeKey} predicate`);
        }
        const innerPredicate = this.loadPredicate(dbModel.innerPredicate);
        return new CharacterBehaviorPredicateNot(innerPredicate);
      }
      case ContractCharacterBehaviorPredicateTypeKey.and: {
        if (!dbModel.innerPredicates) {
          throw Error (`Expected inner predicates in a ${dbModel.typeKey} predicate`);
        }
        const innerPredicates = dbModel.innerPredicates.map(innerPredicate => this.loadPredicate(innerPredicate));
        return new CharacterBehaviorPredicateAnd(innerPredicates);
      }
      case ContractCharacterBehaviorPredicateTypeKey.or: {
        if (!dbModel.innerPredicates) {
          throw Error (`Expected inner predicates in a ${dbModel.typeKey} predicate`);
        }
        const innerPredicates = dbModel.innerPredicates.map(innerPredicate => this.loadPredicate(innerPredicate));
        return new CharacterBehaviorPredicateOr(innerPredicates);
      }
      case ContractCharacterBehaviorPredicateTypeKey.relativeValues: {
        if (!dbModel.leftValue) {
          throw Error (`Expected an left value in a ${dbModel.typeKey} predicate`);
        }
        if (!dbModel.rightValue) {
          throw Error (`Expected an right Value in a ${dbModel.typeKey} predicate`);
        }
        if (!dbModel.valueRelation) {
          throw Error (`Expected a value relation in a ${dbModel.typeKey} predicate`);
        }
        const leftValue = this.loadValue(dbModel.leftValue);
        const rightValue = this.loadValue(dbModel.rightValue);
        return new CharacterBehaviorPredicateRelativeValues(leftValue, rightValue, dbModel.valueRelation);
      }
      case ContractCharacterBehaviorPredicateTypeKey.abilityReady: {
        if (!dbModel.abilityId) {
          throw Error (`Expected an ability id in a ${dbModel.typeKey} predicate`);
        }
        return new CharacterBehaviorPredicateAbilityReady(dbModel.abilityId);
      }
      case ContractCharacterBehaviorPredicateTypeKey.hasContinuousEffect: {
        if (!dbModel.continuousEffectTypeKey) {
          throw Error (`Expected an continuous effect type key in a ${dbModel.typeKey} predicate`);
        }
        const continuousEffectType = StaticGameContentService.instance.getContinuousEffectType(dbModel.continuousEffectTypeKey);
        return new CharacterBehaviorPredicateHasContinuousEffect(continuousEffectType);
      }
      default: 
        throw Error (`Unhandled behavior action predicate type: ${dbModel.typeKey}`);
    }
  }

  private static loadTarget(dbModel: DbCharacterBehaviorTarget): CharacterBehaviorTarget {
    switch(dbModel.typeKey) {
      case ContractCharacterBehaviorTargetTypeKey.randomAlly: {
        return new CharacterBehaviorTargetRandomCharacter(true, false);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomEnemy: {
        return new CharacterBehaviorTargetRandomCharacter(false, true);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomCharacter: {
        return new CharacterBehaviorTargetRandomCharacter(true, true);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomAllyMatchingPredicate: {
        if (!dbModel.predicate) {
          throw Error (`Expected a predicate in a ${dbModel.typeKey} value`);
        }
        const predicate = this.loadPredicate(dbModel.predicate);
        return new CharacterBehaviorTargetRandomCharacterMatchingPredicate(true, false, predicate);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomEnemyMatchingPredicate: {
        if (!dbModel.predicate) {
          throw Error (`Expected a predicate in a ${dbModel.typeKey} value`);
        }
        const predicate = this.loadPredicate(dbModel.predicate);
        return new CharacterBehaviorTargetRandomCharacterMatchingPredicate(false, true, predicate);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomCharacterMatchingPredicate: {
        if (!dbModel.predicate) {
          throw Error (`Expected a predicate in a ${dbModel.typeKey} value`);
        }
        const predicate = this.loadPredicate(dbModel.predicate);
        return new CharacterBehaviorTargetRandomCharacterMatchingPredicate(true, true, predicate);
      }
      case ContractCharacterBehaviorTargetTypeKey.specificHero: {
        if (!dbModel.heroId) {
          throw Error (`Expected a hero id in a ${dbModel.typeKey} value`);
        }
        return new CharacterBehaviorTargetSpecificHero(dbModel.heroId);
      }
      case ContractCharacterBehaviorTargetTypeKey.allyWithTheLeastValue: {
        if (!dbModel.value) {
          throw Error (`Expected a value in a ${dbModel.typeKey} value`);
        }
        const value = this.loadValue(dbModel.value);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, false, true, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.allyWithTheMostValue: {
        if (!dbModel.value) {
          throw Error (`Expected a value in a ${dbModel.typeKey} value`);
        }
        const value = this.loadValue(dbModel.value);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, false, false, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.enemyWithTheLeastValue: {
        if (!dbModel.value) {
          throw Error (`Expected a value in a ${dbModel.typeKey} value`);
        }
        const value = this.loadValue(dbModel.value);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(false, true, true, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.enemyWithTheMostValue: {
        if (!dbModel.value) {
          throw Error (`Expected a value in a ${dbModel.typeKey} value`);
        }
        const value = this.loadValue(dbModel.value);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(false, true, false, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.characterWithTheLeastValue: {
        if (!dbModel.value) {
          throw Error (`Expected a value in a ${dbModel.typeKey} value`);
        }
        const value = this.loadValue(dbModel.value);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, true, true, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.characterWithTheMostValue: {
        if (!dbModel.value) {
          throw Error (`Expected a value in a ${dbModel.typeKey} value`);
        }
        const value = this.loadValue(dbModel.value);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, true, false, value);
      }
      default: 
        throw Error (`Unhandled behavior action target type: ${dbModel.typeKey}`);
    }
  }

  private static loadValue(dbModel: DbCharacterBehaviorValue): CharacterBehaviorValue {
    switch(dbModel.typeKey) {
      case ContractCharacterBehaviorValueTypeKey.attribute: {
        if (!dbModel.attributeTypeKey) {
          throw Error (`Expected an attribute type key in a ${dbModel.typeKey} value`);
        }
        if (!dbModel.attributeAbilityTags) {
          throw Error (`Expected attribute ability tags in a ${dbModel.typeKey} value`);
        }
        return new CharacterBehaviorValueAttribute(dbModel.attributeTypeKey, dbModel.attributeAbilityTags);
      }
      case ContractCharacterBehaviorValueTypeKey.currentHealth: {
        return new CharacterBehaviorValueCurrentHealth();
      }
      case ContractCharacterBehaviorValueTypeKey.currentMana: {
        return new CharacterBehaviorValueCurrentMana();
      }
      case ContractCharacterBehaviorValueTypeKey.percentageCurrentHealth: {
        return new CharacterBehaviorValuePercentageCurrentHealth();
      }
      case ContractCharacterBehaviorValueTypeKey.percentageCurrentMana: {
        return new CharacterBehaviorValuePercentageCurrentMana();
      }
      case ContractCharacterBehaviorValueTypeKey.number: {
        if (dbModel.number === undefined) {
          throw Error (`Expected a number in a ${dbModel.typeKey} value`);
        }
        return new CharacterBehaviorValueNumber(dbModel.number);
      }
      case ContractCharacterBehaviorValueTypeKey.remainingCooldownOfAbility: {
        if (!dbModel.abilityId) {
          throw Error (`Expected an ability id in a ${dbModel.typeKey} value`);
        }
        return new CharacterBehaviorValueRemainingCooldownOfAbility(dbModel.abilityId);
      }
      default: 
        throw Error (`Unhandled behavior value type: ${dbModel.typeKey}`);
    }
  }
}