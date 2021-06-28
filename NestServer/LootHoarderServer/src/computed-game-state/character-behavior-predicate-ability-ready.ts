import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateAbilityReady extends CharacterBehaviorPredicate {
  public abilityId: number;
  public constructor(
    abilityId: number
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.abilityReady);
    this.abilityId = abilityId;
  }
  
  public toContractModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      abilityId: this.abilityId,
    };
  }
}