import { Subject } from "rxjs";
import { ContractCharacterBehaviorAction } from "src/loot-hoarder-contract/contract-character-behavior-action";
import { HeroAbility } from "../hero-ability";
import { CharacterBehaviorPredicate } from "./character-behavior-predicate";
import { CharacterBehaviorTarget } from "./character-behavior-target";

export class CharacterBehaviorAction {
  public onChange: Subject<void>;

  private _predicate?: CharacterBehaviorPredicate;
  private _ability: HeroAbility;
  private _target?: CharacterBehaviorTarget;

  public constructor(
    predicate: CharacterBehaviorPredicate | undefined,
    ability: HeroAbility,
    target: CharacterBehaviorTarget | undefined,
  ) {
    this._predicate = predicate;
    this._ability = ability;
    this._target = target;

    this.onChange = new Subject();

    this._predicate?.onChange.subscribe(() => this.onChange.next());
    this._target?.onChange.subscribe(() => this.onChange.next());
  }

  public get predicate(): CharacterBehaviorPredicate | undefined {
    return this._predicate;
  }
  public set predicate(newValue: CharacterBehaviorPredicate | undefined) {
    if (this._predicate !== newValue) {
      this._predicate = newValue;
      this._predicate?.onChange.subscribe(() => this.onChange.next());
      this.onChange.next();
    }
  }

  public get ability(): HeroAbility {
    return this._ability;
  }
  public set ability(newValue: HeroAbility) {
    if (this._ability !== newValue) {
      this._ability = newValue;
      this.onChange.next();
    }
  }

  public get target(): CharacterBehaviorTarget | undefined {
    return this._target;
  }
  public set target(newValue: CharacterBehaviorTarget | undefined) {
    if (this._target !== newValue) {
      this._target = newValue;
      this._target?.onChange.subscribe(() => this.onChange.next());
      this.onChange.next();
    }
  }

  public toContractModel(): ContractCharacterBehaviorAction {
    return {
      predicate: this._predicate?.toContractModel(),
      abilityId: this._ability.id,
      target: this._target?.toContractModel()
    };
  }
}
