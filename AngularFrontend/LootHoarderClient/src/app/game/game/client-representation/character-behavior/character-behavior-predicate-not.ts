import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateNot extends CharacterBehaviorPredicate {
  private _innerPredicate: CharacterBehaviorPredicate;
  public constructor(
    innerPredicate: CharacterBehaviorPredicate
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.not);
    this._innerPredicate = innerPredicate;
  }

  public get innerPredicate(): CharacterBehaviorPredicate {
    return this._innerPredicate;
  }
  public set innerPredicate(newValue: CharacterBehaviorPredicate) {
    if(this._innerPredicate !== newValue) {
      this._innerPredicate = newValue;
      this._innerPredicate.onChange.subscribe(() => this.onChange.next());
      this.onChange.next();
    }
  }
  
  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      innerPredicate: this._innerPredicate.toContractModel()
    };
  }
}