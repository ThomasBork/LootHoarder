import { Subject } from "rxjs";
import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";

export abstract class CharacterBehaviorValue {
  public typeKey: ContractCharacterBehaviorValueTypeKey;
  public onChange: Subject<void>;
  
  public constructor(typeKey: ContractCharacterBehaviorValueTypeKey) {
    this.typeKey = typeKey;

    this.onChange = new Subject();
  }

  public abstract toContractModel(): ContractCharacterBehaviorValue;
}