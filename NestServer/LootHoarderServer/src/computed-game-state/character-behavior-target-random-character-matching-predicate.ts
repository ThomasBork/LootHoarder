import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetRandomCharacterMatchingPredicate extends CharacterBehaviorTarget {
  public canTargetAllies: boolean;
  public canTargetEnemies: boolean;
  public predicate: CharacterBehaviorPredicate;
  public constructor(
    canTargetAllies: boolean, 
    canTargetEnemies: boolean,
    predicate: CharacterBehaviorPredicate
  ) {
    super();
    this.canTargetAllies = canTargetAllies;
    this.canTargetEnemies = canTargetEnemies;
    this.predicate = predicate;
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

  public toDbModel(): DbCharacterBehaviorTarget {
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