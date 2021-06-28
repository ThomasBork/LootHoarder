import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { CharacterBehaviorTarget } from "./character-behavior-target";
import { CharacterBehaviorValue } from "./character-behavior-value";

export class CharacterBehaviorTargetCharacterWithExtremeValue extends CharacterBehaviorTarget {
  public canTargetAllies: boolean;
  public canTargetEnemies: boolean;
  public matchLeastValue: boolean;
  public value: CharacterBehaviorValue;
  public constructor(
    canTargetAllies: boolean, 
    canTargetEnemies: boolean, 
    matchLeastValue: boolean,
    value: CharacterBehaviorValue
  ) {
    super();
    this.canTargetAllies = canTargetAllies;
    this.canTargetEnemies = canTargetEnemies;
    this.matchLeastValue = matchLeastValue;
    this.value = value;
  }

  public toContractModel(): DbCharacterBehaviorTarget {
    const typeKey = this.matchLeastValue
      ? !this.canTargetAllies
        ? ContractCharacterBehaviorTargetTypeKey.enemyWithTheLeastValue
        : !this.canTargetEnemies
          ? ContractCharacterBehaviorTargetTypeKey.allyWithTheLeastValue
          : ContractCharacterBehaviorTargetTypeKey.characterWithTheLeastValue
      : !this.canTargetAllies
        ? ContractCharacterBehaviorTargetTypeKey.enemyWithTheMostValue
        : !this.canTargetEnemies
          ? ContractCharacterBehaviorTargetTypeKey.allyWithTheMostValue
          : ContractCharacterBehaviorTargetTypeKey.characterWithTheMostValue
    
    return {
      typeKey: typeKey,
      value: this.value.toContractModel(),
    };
  }
}