import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";

export abstract class CharacterBehaviorPredicate {
  public typeKey: ContractCharacterBehaviorPredicateTypeKey;
  
  public constructor(
    typeKey: ContractCharacterBehaviorPredicateTypeKey
  ) {
    this.typeKey = typeKey;
  }
  
  public abstract toContractModel(): ContractCharacterBehaviorPredicate;
  
  public abstract toDbModel(): DbCharacterBehaviorPredicate;
}