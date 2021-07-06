import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetRandomCharacter extends CharacterBehaviorTarget {
  public canTargetAllies: boolean;
  public canTargetEnemies: boolean;
  public constructor(canTargetAllies: boolean, canTargetEnemies: boolean) {
    super();
    this.canTargetAllies = canTargetAllies;
    this.canTargetEnemies = canTargetEnemies;
  }

  public toContractModel(): ContractCharacterBehaviorTarget {
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