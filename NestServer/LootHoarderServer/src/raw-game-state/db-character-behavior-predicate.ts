import { DbCharacterBehaviorValue } from "./db-character-behavior-value";
import { ContractCharacterBehaviorPredicateTypeKey } from 'src/loot-hoarder-contract/contract-character-behavior-predicate-type-key';
import { ContractCharacterBehaviorValueRelation } from "src/loot-hoarder-contract/contract-character-behavior-value-relation";

export interface DbCharacterBehaviorPredicate {
  typeKey: ContractCharacterBehaviorPredicateTypeKey;
  innerPredicate?: DbCharacterBehaviorPredicate;
  innerPredicates?: DbCharacterBehaviorPredicate[];
  leftValue?: DbCharacterBehaviorValue;
  rightValue?: DbCharacterBehaviorValue;
  valueRelation?: ContractCharacterBehaviorValueRelation;
  continuousEffectTypeKey?: string;
  abilityId?: number;
}