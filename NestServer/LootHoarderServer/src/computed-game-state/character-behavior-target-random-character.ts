import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetRandomCharacter extends CharacterBehaviorTarget {
  public canTargetAllies: boolean;
  public canTargetEnemies: boolean;
  public constructor(canTargetAllies: boolean, canTargetEnemies: boolean) {
    super();
    this.canTargetAllies = canTargetAllies;
    this.canTargetEnemies = canTargetEnemies;
  }

  public toContractModel(): DbCharacterBehaviorTarget {
    const typeKey = !this.canTargetAllies
      ? ContractCharacterBehaviorTargetTypeKey.randomEnemy
      : !this.canTargetEnemies
        ? ContractCharacterBehaviorTargetTypeKey.randomAlly
        : ContractCharacterBehaviorTargetTypeKey.randomCharacter;
    
    return {
      typeKey: typeKey
    };
  }
}