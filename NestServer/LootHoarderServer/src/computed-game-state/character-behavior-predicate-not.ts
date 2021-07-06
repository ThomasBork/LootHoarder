import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateNot extends CharacterBehaviorPredicate {
  public innerPredicate: CharacterBehaviorPredicate;
  public constructor(
    innerPredicate: CharacterBehaviorPredicate
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.not);
    this.innerPredicate = innerPredicate;
  }
  
  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      innerPredicate: this.innerPredicate.toContractModel()
    };
  }
  
  public toDbModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      innerPredicate: this.innerPredicate.toDbModel()
    };
  }
}