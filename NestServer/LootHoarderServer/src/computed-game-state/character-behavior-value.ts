import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";

export abstract class CharacterBehaviorValue {
  public typeKey: ContractCharacterBehaviorValueTypeKey;
  public constructor(typeKey: ContractCharacterBehaviorValueTypeKey) {
    this.typeKey = typeKey;
  }

  public abstract toContractModel(): DbCharacterBehaviorValue;
}