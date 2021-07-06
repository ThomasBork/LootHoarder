import { Subject } from "rxjs";
import { ContractCharacterBehavior } from "src/loot-hoarder-contract/contract-character-behavior";
import { CharacterBehaviorAction } from "./character-behavior-action";

export class CharacterBehavior {
  public id: number;
  public name: string;
  public prioritizedActions: CharacterBehaviorAction[];

  public onChange: Subject<void>;

  public constructor(
    id: number,
    name: string,
    prioritizedActions: CharacterBehaviorAction[],
  ) {
    this.id = id;
    this.name = name;
    this.prioritizedActions = prioritizedActions;

    this.onChange = new Subject();

    this.prioritizedActions.forEach(action => action.onChange.subscribe(() => this.onChange.next()));
  }

  public addAction(action: CharacterBehaviorAction): void {
    this.prioritizedActions.push(action);
    action.onChange.subscribe(() => this.onChange.next());
    this.onChange.next();
  }

  public toContractModel(): ContractCharacterBehavior {
    return {
      id: this.id,
      name: this.name,
      prioritizedActions: this.prioritizedActions.map(action => action.toContractModel())
    };
  }
}
