import { ContractCharacterBehaviorPredicate } from "./contract-character-behavior-predicate";
import { ContractCharacterBehaviorTarget } from "./contract-character-behavior-target";

export interface ContractCharacterBehaviorAction {
  predicate?: ContractCharacterBehaviorPredicate;
  abilityId: number;
  target?: ContractCharacterBehaviorTarget;
}