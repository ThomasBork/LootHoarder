import { Injectable } from "@nestjs/common";
import { Area } from "src/computed-game-state/area/area";
import { Combat } from "src/computed-game-state/area/combat";
import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { CharacterBehaviorTarget } from "src/computed-game-state/character-behavior-target";
import { CharacterBehaviorTargetCharacterWithExtremeValue } from "src/computed-game-state/character-behavior-target-character-with-extreme-value";
import { CharacterBehaviorTargetRandomCharacter } from "src/computed-game-state/character-behavior-target-random-character";
import { CharacterBehaviorTargetRandomCharacterMatchingPredicate } from "src/computed-game-state/character-behavior-target-random-character-matching-predicate";
import { CharacterBehaviorTargetSpecificHero } from "src/computed-game-state/character-behavior-target-specific-hero";
import { CharacterBehaviorPredicateEvaluator } from "./character-behavior-predicate-evaluator";
import { CharacterBehaviorValueEvaluator } from "./character-behavior-value-evaluator";

@Injectable()
export class CharacterBehaviorTargetEvaluator {

  public constructor(
    private readonly characterBehaviorPredicateEvaluator: CharacterBehaviorPredicateEvaluator,
    private readonly characterBehaviorValueEvaluator: CharacterBehaviorValueEvaluator,
  ) {

  }

  public evaluate (
    target: CharacterBehaviorTarget,
    area: Area,
    combat: Combat,
    character: CombatCharacter
  ): CombatCharacter[] {
    const livingAllies = combat.getAllies(character).filter(c => c.isAlive);
    const livingEnemies = combat.getEnemies(character).filter(c => c.isAlive);

    const context: TargetEvaluatorContext = {
      area: area,
      combat: combat,
      character: character,
      allies: livingAllies,
      enemies: livingEnemies,
    };

    return this.evaluateTarget(target, context);
  }

  private evaluateTarget(target: CharacterBehaviorTarget, context: TargetEvaluatorContext): CombatCharacter[] {
    if (target instanceof CharacterBehaviorTargetCharacterWithExtremeValue) {
      return this.evaluateCharacterWithExtremeValue(target, context);
    } else if (target instanceof CharacterBehaviorTargetRandomCharacter) {
      return this.evaluateRandomCharacter(target, context);
    } else if (target instanceof CharacterBehaviorTargetRandomCharacterMatchingPredicate) {
      return this.evaluateRandomCharacterMatchingPredicate(target, context);
    } else if (target instanceof CharacterBehaviorTargetSpecificHero) {
      return this.evaluateSpecificHero(target, context);
    } else {
      throw Error (`Unhandled behavior target`);
    }
  }

  private evaluateCharacterWithExtremeValue(target: CharacterBehaviorTargetCharacterWithExtremeValue, context: TargetEvaluatorContext):  CombatCharacter[] {
    const possibleTargets = [];
    if (target.canTargetAllies) {
      possibleTargets.push(...context.allies);
    }
    if (target.canTargetEnemies) {
      possibleTargets.push(...context.enemies);
    }

    if (possibleTargets.length === 0) {
      return [];
    }

    const characterValues = possibleTargets.map(character => this.characterBehaviorValueEvaluator.evaluate(target.value, character));

    const charactersWithExtremeValues: CombatCharacter[] = [];

    for(let i = 0; i < characterValues.length; i++) {
      const character = possibleTargets[i];
      const characterValue = characterValues[i];
      if (target.matchLeastValue) {
        const isLeastValue = characterValues.every(v => v >= characterValue);
        if (isLeastValue) {
          charactersWithExtremeValues.push(character);
        }
      } else {
        const isHighestValue = characterValues.every(v => v <= characterValue);
        if (isHighestValue) {
          charactersWithExtremeValues.push(character);
        }
      }
    }

    return charactersWithExtremeValues;
  }

  private evaluateRandomCharacter(target: CharacterBehaviorTargetRandomCharacter, context: TargetEvaluatorContext):  CombatCharacter[] {
    const possibleTargets = [];
    if (target.canTargetAllies) {
      possibleTargets.push(...context.allies);
    }
    if (target.canTargetEnemies) {
      possibleTargets.push(...context.enemies);
    }
    return possibleTargets;
  }

  private evaluateRandomCharacterMatchingPredicate(target: CharacterBehaviorTargetRandomCharacterMatchingPredicate, context: TargetEvaluatorContext):  CombatCharacter[] {
    const possibleTargets = [];
    if (target.canTargetAllies) {
      possibleTargets.push(...context.allies);
    }
    if (target.canTargetEnemies) {
      possibleTargets.push(...context.enemies);
    }

    const charactersMatchingPredicate: CombatCharacter[] = [];

    for(let possibleTarget of possibleTargets) {
      const matchesPredicate = this.characterBehaviorPredicateEvaluator.evaluate(target.predicate, possibleTarget);
      if (matchesPredicate) {
        charactersMatchingPredicate.push(possibleTarget);
      }
    }

    return charactersMatchingPredicate;
  }

  private evaluateSpecificHero(target: CharacterBehaviorTargetSpecificHero, context: TargetEvaluatorContext):  CombatCharacter[] {
    const hero = context.area.heroes.find(areaHero => areaHero.hero.id === target.heroId);
    if (!hero) {
      throw Error (`Could not find hero with id = ${target.heroId}`);
    }

    if (!hero.combatCharacter.isAlive) {
      return [];
    }

    return [hero.combatCharacter];
  }
}

interface TargetEvaluatorContext {
  area: Area,
  combat: Combat,
  character: CombatCharacter,
  allies: CombatCharacter[],
  enemies: CombatCharacter[]
}