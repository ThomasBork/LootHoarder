import { ContractCharacterBehaviorPredicateTypeKey } from "./contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorValue } from "./contract-character-behavior-value";

export interface ContractCharacterBehaviorPredicate {
  typeKey: ContractCharacterBehaviorPredicateTypeKey;
  innerPredicate?: ContractCharacterBehaviorPredicate;
  leftPredicate?: ContractCharacterBehaviorPredicate;
  rightPredicate?: ContractCharacterBehaviorPredicate;
  leftValue?: ContractCharacterBehaviorValue;
  rightValue?: ContractCharacterBehaviorValue;
  continuousEffectTypeKey?: string;
  abilityId?: number;
}