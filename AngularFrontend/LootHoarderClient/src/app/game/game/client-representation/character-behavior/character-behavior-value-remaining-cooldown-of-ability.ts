import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { HeroAbility } from "../hero-ability";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValueRemainingCooldownOfAbility extends CharacterBehaviorValue {
  private _ability: HeroAbility;

  public constructor(ability: HeroAbility) {
    super(ContractCharacterBehaviorValueTypeKey.remainingCooldownOfAbility);

    this._ability = ability;
  }

  public get ability(): HeroAbility {
    return this._ability;
  }
  public set ability(newValue: HeroAbility) {
    if (this._ability !== newValue) {
      this._ability = newValue;
      this.onChange.next();
    }
  }

  public toContractModel(): ContractCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      abilityId: this.ability.id,
    };
  }
}