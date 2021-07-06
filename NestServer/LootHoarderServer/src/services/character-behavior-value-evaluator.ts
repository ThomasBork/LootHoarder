import { Injectable } from "@nestjs/common";
import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { CharacterBehaviorValue } from "src/computed-game-state/character-behavior-value";
import { CharacterBehaviorValueAttribute } from "src/computed-game-state/character-behavior-value-attribute";
import { CharacterBehaviorValueCurrentHealth } from "src/computed-game-state/character-behavior-value-current-health";
import { CharacterBehaviorValueCurrentMana } from "src/computed-game-state/character-behavior-value-current-mana";
import { CharacterBehaviorValueNumber } from "src/computed-game-state/character-behavior-value-number";
import { CharacterBehaviorValuePercentageCurrentHealth } from "src/computed-game-state/character-behavior-value-percentage-current-health";
import { CharacterBehaviorValuePercentageCurrentMana } from "src/computed-game-state/character-behavior-value-percentage-current-mana";
import { CharacterBehaviorValueRemainingCooldownOfAbility } from "src/computed-game-state/character-behavior-value-remaining-cooldown-of-ability";

@Injectable()
export class CharacterBehaviorValueEvaluator {
  public evaluate (
    value: CharacterBehaviorValue,
    character: CombatCharacter
  ): number {
    const context: ValueEvaluatorContext = {
      character: character
    };

    return this.evaluateValue(value, context);
  }

  private evaluateValue(value: CharacterBehaviorValue, context: ValueEvaluatorContext): number {
    if (value instanceof CharacterBehaviorValueAttribute) {
      return this.evaluateAttribute(value, context);
    } else if (value instanceof CharacterBehaviorValueCurrentHealth) {
      return this.evaluateCurrentHealth(value, context);
    } else if (value instanceof CharacterBehaviorValueCurrentMana) {
      return this.evaluateCurrentMana(value, context);
    } else if (value instanceof CharacterBehaviorValueNumber) {
      return this.evaluateNumber(value, context);
    } else if (value instanceof CharacterBehaviorValuePercentageCurrentHealth) {
      return this.evaluatePercentageCurrentHealth(value, context);
    } else if (value instanceof CharacterBehaviorValuePercentageCurrentMana) {
      return this.evaluatePercentageCurrentMana(value, context);
    } else if (value instanceof CharacterBehaviorValueRemainingCooldownOfAbility) {
      return this.evaluateRemainingCooldownOfAbility(value, context);
    } else {
      throw Error (`Unhandled value type: ${value.typeKey}`);
    }
  }

  private evaluateAttribute(value: CharacterBehaviorValueAttribute, context: ValueEvaluatorContext): number {
    const attribute = context.character.attributes.getAttribute(value.attributeType, value.attributeAbilityTags);
    return attribute.valueContainer.value;
  }

  private evaluateCurrentHealth(value: CharacterBehaviorValueCurrentHealth, context: ValueEvaluatorContext): number {
    return context.character.currentHealth;
  }

  private evaluateCurrentMana(value: CharacterBehaviorValueCurrentMana, context: ValueEvaluatorContext): number {
    return context.character.currentMana;
  }

  private evaluateNumber(value: CharacterBehaviorValueNumber, context: ValueEvaluatorContext): number {
    return value.number;
  }

  private evaluatePercentageCurrentHealth(value: CharacterBehaviorValuePercentageCurrentHealth, context: ValueEvaluatorContext): number {
    return 100 * context.character.currentHealth / context.character.maximumHealthVC.value;
  }

  private evaluatePercentageCurrentMana(value: CharacterBehaviorValuePercentageCurrentMana, context: ValueEvaluatorContext): number {
    return 100 * context.character.currentMana / context.character.maximumManaVC.value;
  }

  private evaluateRemainingCooldownOfAbility(value: CharacterBehaviorValueRemainingCooldownOfAbility, context: ValueEvaluatorContext): number {
    const ability = context.character.getAbility(value.abilityId);
    return ability.remainingCooldown / 1000;
  }
}

interface ValueEvaluatorContext {
  character: CombatCharacter
}