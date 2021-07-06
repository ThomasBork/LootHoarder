import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateAnd extends CharacterBehaviorPredicate {
  public innerPredicates: CharacterBehaviorPredicate[];
  public constructor(
    innerPredicates: CharacterBehaviorPredicate[],
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.and);
    this.innerPredicates = innerPredicates;
  }

  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      innerPredicates: this.innerPredicates.map(innerPredicate => innerPredicate.toContractModel())
    };
  }

  public toDbModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      innerPredicates: this.innerPredicates.map(innerPredicate => innerPredicate.toDbModel())
    };
  }
}