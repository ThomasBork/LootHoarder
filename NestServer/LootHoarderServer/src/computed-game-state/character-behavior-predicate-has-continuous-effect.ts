import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { ContinuousEffectType } from "./area/continuous-effect-type";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateHasContinuousEffect extends CharacterBehaviorPredicate {
  public continuousEffectType: ContinuousEffectType;
  public constructor(
    continuousEffectType: ContinuousEffectType
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.hasContinuousEffect);
    this.continuousEffectType = continuousEffectType;
  }
  
  public toContractModel(): DbCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      continuousEffectTypeKey: this.continuousEffectType.key
    };
  }
}