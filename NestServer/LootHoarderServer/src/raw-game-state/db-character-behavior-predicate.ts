import { DbCharacterBehaviorValue } from "./db-character-behavior-value";
import { ContractCharacterBehaviorPredicateTypeKey } from 'src/loot-hoarder-contract/contract-character-behavior-predicate-type-key';

export interface DbCharacterBehaviorPredicate {
  typeKey: ContractCharacterBehaviorPredicateTypeKey;
  innerPredicate?: DbCharacterBehaviorPredicate;
  leftPredicate?: DbCharacterBehaviorPredicate;
  rightPredicate?: DbCharacterBehaviorPredicate;
  leftValue?: DbCharacterBehaviorValue;
  rightValue?: DbCharacterBehaviorValue;
  continuousEffectTypeKey?: string;
  abilityId?: number;
}