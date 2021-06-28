import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";

export abstract class CharacterBehaviorPredicate {
  public typeKey: ContractCharacterBehaviorPredicateTypeKey;
  
  public constructor(
    typeKey: ContractCharacterBehaviorPredicateTypeKey
  ) {
    this.typeKey = typeKey;
  }
  
  public abstract toContractModel(): DbCharacterBehaviorPredicate;
}