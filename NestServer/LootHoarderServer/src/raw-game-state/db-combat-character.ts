import { DbAbility } from "./db-ability";
import { DbAttributeSet } from "./db-attribute-set";
import { DbCharacterBehavior } from "./db-character-behavior";
import { DbContinuousEffect } from "./db-continuous-effect";

export interface DbCombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
  currentMana: number;
  attributeSet: DbAttributeSet;
  abilities: DbAbility[];
  idOfAbilityBeingUsed?: number;
  idOfTargetOfAbilityBeingUsed?: number;
  remainingTimeToUseAbility: number;
  totalTimeToUseAbility?: number;
  continuousEffects: DbContinuousEffect[];
  behavior?: DbCharacterBehavior;
}
