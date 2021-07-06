import { Subject } from "rxjs";
import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";

export abstract class CharacterBehaviorTarget {
  public onChange: Subject<void>;

  public constructor() {
    this.onChange = new Subject();
  }

  public abstract toContractModel(): ContractCharacterBehaviorTarget;
}