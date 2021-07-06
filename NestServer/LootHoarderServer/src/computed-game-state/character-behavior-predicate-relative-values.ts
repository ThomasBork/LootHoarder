import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorValueRelation } from "src/loot-hoarder-contract/contract-character-behavior-value-relation";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorPredicateRelativeValues extends CharacterBehaviorPredicate {
  public leftValue: CharacterBehaviorValue;
  public rightValue: CharacterBehaviorValue;
  public valueRelation: ContractCharacterBehaviorValueRelation;
  public constructor(
    leftValue: CharacterBehaviorValue,
    rightValue: CharacterBehaviorValue,
    valueRelation: ContractCharacterBehaviorValueRelation,
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.relativeValues);
    this.leftValue = leftValue;
    this.rightValue = rightValue;
    this.valueRelation = valueRelation;
  }

  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      leftValue: this.leftValue.toContractModel(),
      rightValue: this.rightValue.toContractModel(),
      valueRelation: this.valueRelation
    };
  }

  public toDbModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      leftValue: this.leftValue.toDbModel(),
      rightValue: this.rightValue.toDbModel(),
      valueRelation: this.valueRelation
    };
  }
}