import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValuePercentageCurrentHealth extends CharacterBehaviorValue {
  public constructor() {
    super(ContractCharacterBehaviorValueTypeKey.percentageCurrentHealth);
  }

  public toContractModel(): DbCharacterBehaviorValue {
    return {
      typeKey: this.typeKey
    };
  }
}