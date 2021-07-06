import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CharacterBehavior } from "src/computed-game-state/character-behavior";
import { ContractCharacterBehavior } from "src/loot-hoarder-contract/contract-character-behavior";
import { ContractCharacterBehaviorAction } from "src/loot-hoarder-contract/contract-character-behavior-action";
import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { DbCharacterBehavior } from "src/raw-game-state/db-character-behavior";
import { DbCharacterBehaviorAction } from "src/raw-game-state/db-character-behavior-action";
import { DbCharacterBehaviorPredicate } from "src/raw-game-state/db-character-behavior-predicate";
import { DbCharacterBehaviorTarget } from "src/raw-game-state/db-character-behavior-target";
import { UpdateHeroBehavior } from "./update-hero-behavior";

@CommandHandler(UpdateHeroBehavior)
export class UpdateHeroBehaviorHandler implements ICommandHandler<UpdateHeroBehavior> {
  public async execute(command: UpdateHeroBehavior): Promise<void> {
    const hero = command.game.getHero(command.heroId);
    const dbBehavior = this.mapBehavior(command.behavior);
    const behavior = CharacterBehavior.load(dbBehavior);
    hero.updateBehavior(behavior);
  }

  private mapBehavior(behavior: ContractCharacterBehavior): DbCharacterBehavior {
    return {
      id: behavior.id,
      name: behavior.name,
      prioritizedActions: behavior.prioritizedActions.map(action => this.mapAction(action))
    };
  }

  private mapAction(action: ContractCharacterBehaviorAction): DbCharacterBehaviorAction {
    return {
      predicate: action.predicate 
        ? this.mapPredicate(action.predicate)
        : undefined,
      abilityId: action.abilityId,
      target: action.target
        ? this.mapTarget(action.target)
        : undefined
    };
  }

  private mapPredicate(predicate: ContractCharacterBehaviorPredicate): DbCharacterBehaviorPredicate {
    return {
      typeKey: predicate.typeKey,
      abilityId: predicate.abilityId,
      continuousEffectTypeKey: predicate.continuousEffectTypeKey,
      innerPredicate: predicate.innerPredicate,
      innerPredicates: predicate.innerPredicates?.map(innerPredicate => this.mapPredicate(innerPredicate)),
      leftValue: predicate.leftValue,
      rightValue: predicate.rightValue
    };
  }

  private mapTarget(target: ContractCharacterBehaviorTarget): DbCharacterBehaviorTarget {
    return {
      typeKey: target.typeKey,
      heroId: target.heroId,
      predicate: target.predicate,
      value: target.value
    };
  }
}
