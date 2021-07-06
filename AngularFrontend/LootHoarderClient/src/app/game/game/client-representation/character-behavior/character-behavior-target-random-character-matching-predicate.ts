import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetRandomCharacterMatchingPredicate extends CharacterBehaviorTarget {
  public canTargetAllies: boolean;
  public canTargetEnemies: boolean;

  private _predicate: CharacterBehaviorPredicate;

  public constructor(
    canTargetAllies: boolean, 
    canTargetEnemies: boolean,
    predicate: CharacterBehaviorPredicate
  ) {
    super();
    this.canTargetAllies = canTargetAllies;
    this.canTargetEnemies = canTargetEnemies;
    this._predicate = predicate;

    this._predicate.onChange.subscribe(() => this.onChange.next());
  }

  public get predicate(): CharacterBehaviorPredicate {
    return this._predicate;
  }
  public set predicate(newValue: CharacterBehaviorPredicate) {
    if(this._predicate !== newValue) {
      this._predicate = newValue;
      this.onChange.next();
      this._predicate.onChange.subscribe(() => this.onChange.next());
    }
  }

  public toContractModel(): ContractCharacterBehaviorTarget {
    const typeKey = !this.canTargetAllies
      ? ContractCharacterBehaviorTargetTypeKey.randomEnemyMatchingPredicate
      : !this.canTargetEnemies
        ? ContractCharacterBehaviorTargetTypeKey.randomAllyMatchingPredicate
        : ContractCharacterBehaviorTargetTypeKey.randomCharacterMatchingPredicate;
    
    return {
      typeKey: typeKey,
      predicate: this.predicate.toContractModel()
    };
  }
}