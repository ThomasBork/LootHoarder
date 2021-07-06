import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateAnd extends CharacterBehaviorPredicate {
  public innerPredicates: CharacterBehaviorPredicate[];
  public constructor(
    innerPredicates: CharacterBehaviorPredicate[],
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.and);
    this.innerPredicates = innerPredicates;

    this.innerPredicates.forEach(innerPredicate => innerPredicate.onChange.subscribe(() => this.onChange.next()));
  }

  public removeInnerPredicate(innerPredicate: CharacterBehaviorPredicate): void {
    const index = this.innerPredicates.indexOf(innerPredicate);
    if (index < 0) {
      throw Error (`Inner predicate was not found: ${innerPredicate.typeKey}`);
    }
    this.innerPredicates.splice(index, 1);
    innerPredicate.onChange.unsubscribe();
    this.onChange.next();
  }

  public addInnerPredicate(newPredicate: CharacterBehaviorPredicate): void {
    this.innerPredicates.push(newPredicate);
    newPredicate.onChange.subscribe(() => this.onChange.next())
    this.onChange.next();
  }

  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      innerPredicates: this.innerPredicates.map(innerPredicate => innerPredicate.toContractModel()),
    };
  }
}