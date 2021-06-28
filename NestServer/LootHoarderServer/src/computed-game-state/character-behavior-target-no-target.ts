import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetNoTarget extends CharacterBehaviorTarget {
  public constructor() {
    super();
  }

  public toContractModel(): DbCharacterBehaviorTarget {    
    return {
      typeKey: ContractCharacterBehaviorTargetTypeKey.noTarget
    };
  }
}