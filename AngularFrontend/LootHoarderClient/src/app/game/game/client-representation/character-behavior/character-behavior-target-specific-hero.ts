import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorTargetSpecificHero extends CharacterBehaviorTarget {
  private _heroId: number;
  public constructor(heroId: number) {
    super();
    this._heroId = heroId;
  }
  public get heroId(): number {
    return this._heroId;
  }
  public set heroId(newValue: number) {
    if(this._heroId !== newValue) {
      this._heroId = newValue;
      this.onChange.next();
    }
  }

  public toContractModel(): ContractCharacterBehaviorTarget {
    return {
      typeKey: ContractCharacterBehaviorTargetTypeKey.specificHero,
      heroId: this._heroId,
    };
  }
}