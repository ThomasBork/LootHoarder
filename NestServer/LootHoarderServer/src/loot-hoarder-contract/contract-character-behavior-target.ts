import { ContractCharacterBehaviorPredicate } from "./contract-character-behavior-predicate";
import { ContractCharacterBehaviorTargetTypeKey } from "./contract-character-behavior-target-type-key";
import { ContractCharacterBehaviorValue } from "./contract-character-behavior-value";

export interface ContractCharacterBehaviorTarget {
  typeKey: ContractCharacterBehaviorTargetTypeKey;
  heroId?: number;
  predicate?: ContractCharacterBehaviorPredicate;
  value?: ContractCharacterBehaviorValue;
}