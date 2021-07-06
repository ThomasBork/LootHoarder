import { ContractCharacterBehaviorPredicateTypeKey } from "./contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorValue } from "./contract-character-behavior-value";
import { ContractCharacterBehaviorValueRelation } from "./contract-character-behavior-value-relation";

export interface ContractCharacterBehaviorPredicate {
  typeKey: ContractCharacterBehaviorPredicateTypeKey;
  innerPredicate?: ContractCharacterBehaviorPredicate;
  innerPredicates?: ContractCharacterBehaviorPredicate[];
  leftValue?: ContractCharacterBehaviorValue;
  rightValue?: ContractCharacterBehaviorValue;
  valueRelation?: ContractCharacterBehaviorValueRelation;
  continuousEffectTypeKey?: string;
  abilityId?: number;
}