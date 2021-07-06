import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorValueRelation } from "src/loot-hoarder-contract/contract-character-behavior-value-relation";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorPredicateRelativeValues extends CharacterBehaviorPredicate {
  private _leftValue: CharacterBehaviorValue;
  private _rightValue: CharacterBehaviorValue;
  private _valueRelation: ContractCharacterBehaviorValueRelation;

  public constructor(
    leftValue: CharacterBehaviorValue,
    rightValue: CharacterBehaviorValue,
    valueRelation: ContractCharacterBehaviorValueRelation,
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.relativeValues);
    this._leftValue = leftValue;
    this._rightValue = rightValue;
    this._valueRelation = valueRelation;

    this._leftValue.onChange.subscribe(() => this.onChange.next());
    this._rightValue.onChange.subscribe(() => this.onChange.next());
  }

  public get leftValue(): CharacterBehaviorValue {
    return this._leftValue;
  }
  public set leftValue(newValue: CharacterBehaviorValue) {
    if(this._leftValue !== newValue) {
      this._leftValue = newValue;
      this._leftValue.onChange.subscribe(() => this.onChange.next());
      this.onChange.next();
    }
  }

  public get rightValue(): CharacterBehaviorValue {
    return this._rightValue;
  }
  public set rightValue(newValue: CharacterBehaviorValue) {
    if(this._rightValue !== newValue) {
      this._rightValue = newValue;
      this._rightValue.onChange.subscribe(() => this.onChange.next());
      this.onChange.next();
    }
  }

  public get valueRelation(): ContractCharacterBehaviorValueRelation {
    return this._valueRelation;
  }
  public set valueRelation(newValue: ContractCharacterBehaviorValueRelation) {
    if(this._valueRelation !== newValue) {
      this._valueRelation = newValue;
      this.onChange.next();
    }
  }

  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      leftValue: this._leftValue.toContractModel(),
      rightValue: this._rightValue.toContractModel(),
      valueRelation: this._valueRelation
    };
  }
}