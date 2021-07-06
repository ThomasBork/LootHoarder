import { ContractCharacterBehavior } from "src/loot-hoarder-contract/contract-character-behavior";
import { DbCharacterBehavior } from "src/raw-game-state/db-character-behavior";
import { CharacterBehaviorAction } from "./character-behavior-action";

export class CharacterBehavior {
  public dbModel: DbCharacterBehavior;
  public prioritizedActions: CharacterBehaviorAction[];

  public constructor(
    dbModel: DbCharacterBehavior,
    prioritizedActions: CharacterBehaviorAction[],
  ) {
    this.dbModel = dbModel;
    this.prioritizedActions = prioritizedActions;
  }

  public get id(): number { return this.dbModel.id; }
  public get name(): string { return this.dbModel.name; }

  public toContractModel(): ContractCharacterBehavior {
    return {
      id: this.id,
      name: this.name,
      prioritizedActions: this.prioritizedActions.map(action => action.toContractModel())
    };
  }

  public toDbModel(): DbCharacterBehavior {
    return {
      id: this.id,
      name: this.name,
      prioritizedActions: this.prioritizedActions.map(action => action.toDbModel())
    };
  }

  public static load(dbModel: DbCharacterBehavior): CharacterBehavior {
    const actions = dbModel.prioritizedActions.map(action => CharacterBehaviorAction.load(action));
    return new CharacterBehavior(dbModel, actions);
  }
}