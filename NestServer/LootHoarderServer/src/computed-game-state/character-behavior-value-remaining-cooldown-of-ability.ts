import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { DbCharacterBehaviorValue } from "src/raw-game-state/db-character-behavior-value";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorValueRemainingCooldownOfAbility extends CharacterBehaviorValue {
  public abilityId: number;
  public constructor(abilityId: number) {
    super(ContractCharacterBehaviorValueTypeKey.remainingCooldownOfAbility);
    this.abilityId = abilityId;
  }

  public toContractModel(): ContractCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      abilityId: this.abilityId,
    };
  }

  public toDbModel(): DbCharacterBehaviorValue {
    return {
      typeKey: this.typeKey,
      abilityId: this.abilityId,
    };
  }
}