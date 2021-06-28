import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorPredicateRelativeValues extends CharacterBehaviorPredicate {
  public leftValue: CharacterBehaviorValue;
  public rightValue: CharacterBehaviorValue;
  public constructor(
    leftValue: CharacterBehaviorValue,
    rightValue: CharacterBehaviorValue,
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.relativeValues);
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }

  public toContractModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      leftValue: this.leftValue.toContractModel(),
      rightValue: this.rightValue.toContractModel(),
    };
  }
}