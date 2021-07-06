import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { Subject } from "rxjs";

export abstract class CharacterBehaviorPredicate {
  public typeKey: ContractCharacterBehaviorPredicateTypeKey;
  public onChange: Subject<void>;
  
  public constructor(
    typeKey: ContractCharacterBehaviorPredicateTypeKey
  ) {
    this.typeKey = typeKey;
    this.onChange = new Subject();
  }
  
  public abstract toContractModel(): ContractCharacterBehaviorPredicate;
}