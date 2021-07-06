import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetSpecificHero extends CharacterBehaviorTarget {
  public heroId: number;
  public constructor(heroId: number) {
    super();
    this.heroId = heroId;
  }

  public toContractModel(): ContractCharacterBehaviorTarget {
    return {
      typeKey: ContractCharacterBehaviorTargetTypeKey.specificHero,
      heroId: this.heroId,
    };
  }

  public toDbModel(): DbCharacterBehaviorTarget {
    return {
      typeKey: ContractCharacterBehaviorTargetTypeKey.specificHero,
      heroId: this.heroId,
    };
  }
}