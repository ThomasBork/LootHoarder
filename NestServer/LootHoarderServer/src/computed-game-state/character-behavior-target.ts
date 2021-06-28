import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";

export abstract class CharacterBehaviorTarget {
  public constructor() {}

  public abstract toContractModel(): DbCharacterBehaviorTarget;
}