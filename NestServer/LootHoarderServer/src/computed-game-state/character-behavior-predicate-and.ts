import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateAnd extends CharacterBehaviorPredicate {
  public leftPredicate: CharacterBehaviorPredicate;
  public rightPredicate: CharacterBehaviorPredicate;
  public constructor(
    leftPredicate: CharacterBehaviorPredicate,
    rightPredicate: CharacterBehaviorPredicate,
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.and);
    this.leftPredicate = leftPredicate;
    this.rightPredicate = rightPredicate;
  }

  public toContractModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      leftPredicate: this.leftPredicate.toContractModel(),
      rightPredicate: this.rightPredicate.toContractModel(),
    };
  }
}