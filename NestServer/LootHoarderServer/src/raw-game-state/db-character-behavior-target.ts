import { DbCharacterBehaviorPredicate } from "./db-character-behavior-predicate";
import { ContractCharacterBehaviorTargetTypeKey } from 'src/loot-hoarder-contract/contract-character-behavior-target-type-key';
import { DbCharacterBehaviorValue } from "./db-character-behavior-value";

export interface DbCharacterBehaviorTarget {
  typeKey: ContractCharacterBehaviorTargetTypeKey;
  heroId?: number;
  predicate?: DbCharacterBehaviorPredicate;
  value?: DbCharacterBehaviorValue;
}