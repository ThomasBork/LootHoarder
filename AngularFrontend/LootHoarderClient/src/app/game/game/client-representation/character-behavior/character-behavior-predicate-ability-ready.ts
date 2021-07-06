import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { HeroAbility } from "../hero-ability";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";

export class CharacterBehaviorPredicateAbilityReady extends CharacterBehaviorPredicate {
  private _ability: HeroAbility;
  public constructor(
    ability: HeroAbility
  ) {
    super(ContractCharacterBehaviorPredicateTypeKey.abilityReady);
    this._ability = ability;
  }

  public get ability(): HeroAbility {
    return this._ability;
  }
  public set ability(newValue: HeroAbility) {
    if(this._ability !== newValue) {
      this._ability = newValue;
      this.onChange.next();
    }
  }
  
  public toContractModel(): ContractCharacterBehaviorPredicate {
    return {
      typeKey: this.typeKey,
      abilityId: this._ability.id,
    };
  }
}