import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValueNumber extends CharacterBehaviorValue {
  public number: number;
  public constructor(number: number) {
    super(ContractCharacterBehaviorValueTypeKey.number);
    this.number = number;
  }

  public toContractModel(): DbCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      number: this.number
    };
  }
}