import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValueNumber extends CharacterBehaviorValue {
  private _number: number;

  public constructor(number: number) {
    super(ContractCharacterBehaviorValueTypeKey.number);
    this._number = number;
  }

  public get number(): number {
    return this._number;
  }

  public set number(newValue: number) {
    if (this._number !== newValue) {
      this._number = newValue;
      this.onChange.next();
    }
  }

  public toContractModel(): ContractCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      number: this.number
    };
  }
}