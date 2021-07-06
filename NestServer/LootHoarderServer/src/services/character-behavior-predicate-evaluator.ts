import { Injectable } from "@nestjs/common";
import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { CharacterBehaviorPredicate } from "src/computed-game-state/character-behavior-predicate";
import { CharacterBehaviorPredicateAbilityReady } from "src/computed-game-state/character-behavior-predicate-ability-ready";
import { CharacterBehaviorPredicateAnd } from "src/computed-game-state/character-behavior-predicate-and";
import { CharacterBehaviorPredicateHasContinuousEffect } from "src/computed-game-state/character-behavior-predicate-has-continuous-effect";
import { CharacterBehaviorPredicateNot } from "src/computed-game-state/character-behavior-predicate-not";
import { CharacterBehaviorPredicateOr } from "src/computed-game-state/character-behavior-predicate-or";
import { CharacterBehaviorPredicateRelativeValues } from "src/computed-game-state/character-behavior-predicate-relative-values";
import { ContractCharacterBehaviorValueRelation } from "src/loot-hoarder-contract/contract-character-behavior-value-relation";
import { CharacterBehaviorValueEvaluator } from "./character-behavior-value-evaluator";

@Injectable()
export class CharacterBehaviorPredicateEvaluator {

  public constructor(private readonly characterBehaviorValueEvaluator: CharacterBehaviorValueEvaluator) {

  }

  public evaluate (
    predicate: CharacterBehaviorPredicate,
    character: CombatCharacter
  ): boolean {
    const context: PredicateEvaluatorContext = {
      character: character
    };

    return this.evaluatePredicate(predicate, context);
  }

  private evaluatePredicate(predicate: CharacterBehaviorPredicate, context: PredicateEvaluatorContext): boolean {
    if (predicate instanceof CharacterBehaviorPredicateAbilityReady) {
      return this.evaluateAbilityReady(predicate, context);
    } else if (predicate instanceof CharacterBehaviorPredicateAnd) {
      return this.evaluateAnd(predicate, context);
    } else if (predicate instanceof CharacterBehaviorPredicateOr) {
      return this.evaluateOr(predicate, context);
    } else if (predicate instanceof CharacterBehaviorPredicateNot) {
      return this.evaluateNot(predicate, context);
    } else if (predicate instanceof CharacterBehaviorPredicateHasContinuousEffect) {
      return this.evaluateHasContinuousEffect(predicate, context);
    } else if (predicate instanceof CharacterBehaviorPredicateRelativeValues) {
      return this.evaluateRelativeValues(predicate, context);
    } else {
      throw Error (`Unhandled behavior predicate type: ${predicate.typeKey}`);
    }
  }

  private evaluateAbilityReady(predicate: CharacterBehaviorPredicateAbilityReady, context: PredicateEvaluatorContext): boolean {
    const ability = context.character.getAbility(predicate.abilityId);
    return ability.isReady;
  }

  private evaluateAnd(predicate: CharacterBehaviorPredicateAnd, context: PredicateEvaluatorContext): boolean {
    return predicate.innerPredicates.every(innerPredicate => this.evaluatePredicate(innerPredicate, context));
  }

  private evaluateOr(predicate: CharacterBehaviorPredicateOr, context: PredicateEvaluatorContext): boolean {
    return predicate.innerPredicates.some(innerPredicate => this.evaluatePredicate(innerPredicate, context));
  }

  private evaluateNot(predicate: CharacterBehaviorPredicateNot, context: PredicateEvaluatorContext): boolean {
    return !this.evaluatePredicate(predicate.innerPredicate, context);
  }

  private evaluateHasContinuousEffect(predicate: CharacterBehaviorPredicateHasContinuousEffect, context: PredicateEvaluatorContext): boolean {
    return context.character.continuousEffects.some(continuousEffect => continuousEffect.type === predicate.continuousEffectType);
  }

  private evaluateRelativeValues(predicate: CharacterBehaviorPredicateRelativeValues, context: PredicateEvaluatorContext): boolean {
    const leftResult = this.characterBehaviorValueEvaluator.evaluate(predicate.leftValue, context.character);
    const rightResult = this.characterBehaviorValueEvaluator.evaluate(predicate.rightValue, context.character);
    switch(predicate.valueRelation) {
      case ContractCharacterBehaviorValueRelation.equal: return leftResult === rightResult;
      case ContractCharacterBehaviorValueRelation.greaterThan: return leftResult > rightResult;
      case ContractCharacterBehaviorValueRelation.greaterThanOrEqual: return leftResult >= rightResult;
      case ContractCharacterBehaviorValueRelation.lessThan: return leftResult < rightResult;
      case ContractCharacterBehaviorValueRelation.lessThanOrEqual: return leftResult <= rightResult;
      case ContractCharacterBehaviorValueRelation.notEqual: return leftResult !== rightResult;
      default:
        throw Error (`Unhandled value relation: ${predicate.valueRelation}`);
    }
  }
}

interface PredicateEvaluatorContext {
  character: CombatCharacter
}