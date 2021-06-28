import { DbCharacterBehaviorPredicate } from "./db-character-behavior-predicate";
import { DbCharacterBehaviorTarget } from "./db-character-behavior-target";

export interface DbCharacterBehaviorAction {
  predicate?: DbCharacterBehaviorPredicate;
  abilityId: number;
  target?: DbCharacterBehaviorTarget;
}