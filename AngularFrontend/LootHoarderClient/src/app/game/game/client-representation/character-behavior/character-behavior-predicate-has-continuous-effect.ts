import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { ContinuousEffectType } from "../continuous-effect-type";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateHasContinuousEffect extends CharacterBehaviorPredicate {
  private _continuousEffectType: ContinuousEffectType;
  public constructor(
    continuousEffectType: ContinuousEffectType
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.hasContinuousEffect);
    this._continuousEffectType = continuousEffectType;
  }

  public get continuousEffectType(): ContinuousEffectType {
    return this._continuousEffectType;
  }
  public set continuousEffectType(newValue: ContinuousEffectType) {
    if(this._continuousEffectType !== newValue) {
      this._continuousEffectType = newValue;
      this.onChange.next();
    }
  }
  
  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      continuousEffectTypeKey: this._continuousEffectType.key
    };
  }
}
