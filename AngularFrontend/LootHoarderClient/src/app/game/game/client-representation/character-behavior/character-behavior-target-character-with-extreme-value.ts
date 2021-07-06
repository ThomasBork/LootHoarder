import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { CharacterBehaviorTarget } from "./character-behavior-target";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorTargetCharacterWithExtremeValue extends CharacterBehaviorTarget {
  public canTargetAllies: boolean;
  public canTargetEnemies: boolean;

  private _matchLeastValue: boolean;
  private _value: CharacterBehaviorValue;

  public constructor(
    canTargetAllies: boolean, 
    canTargetEnemies: boolean, 
    matchLeastValue: boolean,
    value: CharacterBehaviorValue
  ) {
    super();
    this.canTargetAllies = canTargetAllies;
    this.canTargetEnemies = canTargetEnemies;
    this._matchLeastValue = matchLeastValue;
    this._value = value;

    this._value.onChange.subscribe(() => this.onChange.next());
  }

  public get matchLeastValue(): boolean {
    return this._matchLeastValue;
  }
  public set matchLeastValue(newValue: boolean) {
    if(this._matchLeastValue !== newValue) {
      this._matchLeastValue = newValue;
      this.onChange.next();
    }
  }

  public get value(): CharacterBehaviorValue {
    return this._value;
  }
  public set value(newValue: CharacterBehaviorValue) {
    if(this._value !== newValue) {
      this._value = newValue;
      this._value.onChange.subscribe(() => this.onChange.next());
      this.onChange.next();
    }
  }

  public toContractModel(): ContractCharacterBehaviorTarget {
    const typeKey = this.matchLeastValue
      ? !this.canTargetAllies
        ? ContractCharacterBehaviorTargetTypeKey.enemyWithTheLeastValue
        : !this.canTargetEnemies
          ? ContractCharacterBehaviorTargetTypeKey.allyWithTheLeastValue
          : ContractCharacterBehaviorTargetTypeKey.characterWithTheLeastValue
      : !this.canTargetAllies
        ? ContractCharacterBehaviorTargetTypeKey.enemyWithTheMostValue
        : !this.canTargetEnemies
          ? ContractCharacterBehaviorTargetTypeKey.allyWithTheMostValue
          : ContractCharacterBehaviorTargetTypeKey.characterWithTheMostValue
    
    return {
      typeKey: typeKey,
      value: this.value.toContractModel(),
    };
  }
}