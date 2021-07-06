import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";

export abstract class CharacterBehaviorTarget {
  public constructor() {}

  public abstract toContractModel(): ContractCharacterBehaviorTarget;

  public abstract toDbModel(): DbCharacterBehaviorTarget;
}