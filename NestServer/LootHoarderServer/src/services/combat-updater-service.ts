import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CommandBus, EventBus } from "@nestjs/cqrs";
import { AbilityTargetScheme } from "src/computed-game-state/ability-target-scheme";
import { CombatCharacterAbility } from "src/computed-game-state/area/combat-character-ability";
import { Combat } from "src/computed-game-state/area/combat";
import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { Game } from "src/computed-game-state/game";
import { ContractAbilityUsedMessage } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-used-message";
import { ContractBegunUsingAbilityMessage } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-begun-using-ability-message";
import { GamesManager } from "./games-manager";
import { RandomService } from "./random-service";
import { Area } from "src/computed-game-state/area/area";
import { GoToNextCombat } from "src/game-message-handlers/from-client/go-to-next-combat";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { AbilityTypeEffectApplyContinuousEffect } from "src/computed-game-state/ability-type-effect-apply-continuous-effect";
import { AbilityTypeEffectDealDamage } from "src/computed-game-state/ability-type-effect-deal-damage";
import { DbContinuousEffect } from "src/raw-game-state/db-continuous-effect";
import { ContinuousEffect } from "src/computed-game-state/area/continuous-effect";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { PassiveAbilityTakeDamageOverTime } from "src/computed-game-state/passive-ability-take-damage-over-time";
import { CharacterBehaviorPredicateEvaluator } from "./character-behavior-predicate-evaluator";
import { CharacterBehaviorTargetEvaluator } from "./character-behavior-target-evaluator";

@Injectable()
export class CombatUpdaterService implements OnApplicationBootstrap {
  private readonly tickFrequencyInMilliseconds: number = 100;
  private updatingInterval?: NodeJS.Timeout;
  private logger: Logger = new Logger('CombatUpdaterService');

  public constructor(
    private readonly gamesManager: GamesManager,
    private readonly randomService: RandomService,
    private readonly commandBus: CommandBus,
    private readonly characterBehaviorPredicateEvaluator: CharacterBehaviorPredicateEvaluator,
    private readonly characterBehaviorTargetEvaluator: CharacterBehaviorTargetEvaluator,
  ) {}

  public onApplicationBootstrap(): void {
    this.updatingInterval = setInterval(() => this.updateCombats(), this.tickFrequencyInMilliseconds);
  }

  private updateCombats(): void {
    const games = this.gamesManager.getGames();
    for(const game of games) {
      for(const area of game.areas) {
        if (area.currentCombat.hasEnded) {
          continue;
        }
        
        this.updateCombat(game, area, area.currentCombat);

        if (
          area.currentCombat.hasEnded 
          && area.currentCombat.didTeam1Win 
          && area.hasMoreCombats
          && game.settings.automaticallyGoToNextCombat
        ) {
          this.commandBus.execute(new GoToNextCombat (
            game,
            area,
          ));
        }
      }
    }
  }

  private updateCombat(game: Game, area: Area, combat: Combat): void {
    const allCharacters = [...combat.team1, ...combat.team2];

    // Continuous effects
    for(const character of allCharacters) {
      if (character.isDead) {
        continue;
      }

      for(const continuousEffect of character.continuousEffects) {
        for(const continuousEffectAbility of continuousEffect.abilities) {
          if (continuousEffectAbility instanceof PassiveAbilityTakeDamageOverTime) {
            const timeTakingDamage = continuousEffect.lastsIndefinitely || continuousEffect.timeRemaining > this.tickFrequencyInMilliseconds
              ? this.tickFrequencyInMilliseconds
              : continuousEffect.timeRemaining;
            const damageTaken = continuousEffectAbility.damageTakenEverySecondVC.value * timeTakingDamage / 1000;
            const healthAfterDamageTaken = character.currentHealth - damageTaken;
            // Do not send this update. The client is responsible for updating this.
            character.setCurrentHealth(healthAfterDamageTaken, false);
          }
        }

        if(!continuousEffect.lastsIndefinitely) {
          continuousEffect.timeRemaining -= this.tickFrequencyInMilliseconds;
          if (continuousEffect.timeRemaining <= 0) {
            character.removeContinuousEffect(continuousEffect);
          }
        }
      }
    }
    
    // Abilities
    for(const character of allCharacters) {
      if (character.isDead) {
        continue;
      }

      let timeToCoolUsedAbility = 0;

      // Advance ability use
      if (character.isUsingAbility) {
        // If this tick is larger than the time left to use the ability, the remaining time will be cut off the cooldown after the ability is used.
        if (character.remainingTimeToUseAbility <= this.tickFrequencyInMilliseconds) {
          timeToCoolUsedAbility = this.tickFrequencyInMilliseconds - character.remainingTimeToUseAbility;
        }
        character.remainingTimeToUseAbility -= this.tickFrequencyInMilliseconds;
      }

      // Abilitiy cooldown
      for(const ability of character.abilities) {
        ability.remainingCooldown -= this.tickFrequencyInMilliseconds;
      }

      // Begin using ability
      if (!character.abilityBeingUsed) {
        const abilityToUseAndTarget = this.tryToChooseAbilityToUseAndTarget(area, combat, character);

        if (abilityToUseAndTarget) {
          // Now all events in the combat will be put into this new bucket
          combat.onCombatEvent.setUpNewEventBucket();
  
          const ability = abilityToUseAndTarget.ability;
          const target = abilityToUseAndTarget.target;

          character.abilityBeingUsed = ability;
          const timeToUse = ability.timeToUseVC.value;
          character.remainingTimeToUseAbility = timeToUse;
          character.totalTimeToUseAbility = timeToUse;
          character.targetOfAbilityBeingUsed = target;
          const manaAfterUse = character.currentMana - ability.manaCostVC.value;
          character.setCurrentMana(manaAfterUse);
  
          // Stop redirecting all events and send ability used message
          const messageInnerEvents = combat.onCombatEvent.flushEventBucket();
          const message = new ContractBegunUsingAbilityMessage(ability.id, character.id, target?.id, timeToUse, messageInnerEvents);
          combat.onCombatEvent.next(message);
        }
      }

      // Resolve ability
      if (character.abilityBeingUsed && character.remainingTimeToUseAbility <= 0) {
        // Now all events in the combat will be put into this new bucket
        combat.onCombatEvent.setUpNewEventBucket();

        const abilityToUse = character.abilityBeingUsed;
        this.resolveAbility(game, combat, character, abilityToUse, character.targetOfAbilityBeingUsed);

        character.abilityBeingUsed = undefined;
        character.targetOfAbilityBeingUsed = undefined;

        if (timeToCoolUsedAbility) {
          abilityToUse.remainingCooldown -= timeToCoolUsedAbility;
        }

        // Stop redirecting all events and send ability used message
        const messageInnerEvents = combat.onCombatEvent.flushEventBucket();
        const message = new ContractAbilityUsedMessage(abilityToUse.id, character.id, character.targetOfAbilityBeingUsed, abilityToUse.remainingCooldown, messageInnerEvents);
        combat.onCombatEvent.next(message);
      }
    }
  }

  private tryToChooseAbilityToUseAndTarget(
    area: Area,
    combat: Combat,
    character: CombatCharacter
  ): AbilityAndTarget | undefined {
    const availableAbilities = character.abilities
      .filter(ability => 
        ability.isReady
        && ( 
          // Has no target or has at least one legal target
          !ability.type.requiresTarget
          || combat.getLegalTargets(character, ability, false).length > 0
        )
        && ability.manaCostVC.value < character.currentMana
      );

    if (availableAbilities.length === 0) {
      return undefined;
    }

    if (character.behavior) {
      for(let behaviorAction of character.behavior.prioritizedActions) {
        const ability = character.getAbility(behaviorAction.abilityId);
        if (!availableAbilities.includes(ability)) {
          continue;
        }

        if (behaviorAction.predicate) {
          const actionPredicateResult = this.characterBehaviorPredicateEvaluator.evaluate(behaviorAction.predicate, character);
          if (!actionPredicateResult) {
            continue;
          }
        }

        let target: CombatCharacter | undefined = undefined;
        if (ability.type.requiresTarget) {
          if (!behaviorAction.target) {
            continue;
          }
          const legalTargets = combat.getLegalTargets(character, ability, false);
          const targetsFromAction = this.characterBehaviorTargetEvaluator.evaluate(behaviorAction.target, area, combat, character);
          const possibleTargets = targetsFromAction.filter(t => legalTargets.includes(t));

          if (possibleTargets.length === 0) {
            continue;
          }

          target = this.randomService.randomElementInArray(possibleTargets);
        }

        return {
          ability,
          target
        };
      }

      // No match
      return undefined;
    } else {
      const ability = this.randomService.randomElementInArray(availableAbilities);
      let target: CombatCharacter | undefined = undefined;
      if (ability.type.requiresTarget) {
        const legalTargets = combat.getLegalTargets(character, ability, false);
        target = this.randomService.randomElementInArray(legalTargets);
      }

      return {
        ability,
        target
      };
    }
  }

  private resolveAbility(game: Game, combat: Combat, usingCharacter: CombatCharacter, ability: CombatCharacterAbility, targetCharacter: CombatCharacter | undefined): void {
    const criticalStrikeChance = ability.criticalStrikeChanceVC.value;
    const criticalStrikeRoll = this.randomService.randomFloat(0, 1);
    const isCriticalStrike = criticalStrikeRoll <= criticalStrikeChance;

    for(const effect of ability.effects) {
      const effectedCharacters: CombatCharacter[] = [];
      if (effect.typeEffect.requiresTarget) {
        if (!targetCharacter) {
          throw Error (`Must have a target ability '${ability.type.key}' for effect with key = ${effect.typeEffect.type.key}`);
        }
        effectedCharacters.push(targetCharacter);
      } else {
        const allies = combat.getAllies(usingCharacter);
        const enemies = combat.getEnemies(usingCharacter);

        switch(effect.typeEffect.targetScheme) {
          case AbilityTargetScheme.all: {
            effectedCharacters.push(...allies, ...enemies);
          }
          break;
          case AbilityTargetScheme.allAllies: {
            effectedCharacters.push(...allies);
          }
          break;
          case AbilityTargetScheme.allEnemies: {
            effectedCharacters.push(...enemies);
          }
          break;
        }
      }

      if (effect.typeEffect instanceof AbilityTypeEffectApplyContinuousEffect) {
        for(const effectedCharacter of effectedCharacters) {
          const dbContinuousEffect: DbContinuousEffect = {
            id: game.getNextContinuousEffectId(),
            typeKey: effect.typeEffect.parameters.continuousEffectType.key,
            lastsIndefinitely: effect.typeEffect.parameters.duration === 0,
            timeRemaining: effect.typeEffect.parameters.duration,
            abilities: effect.typeEffect.parameters.buildDbPassiveAbilities()
          };

          for(const dbPassiveAbility of dbContinuousEffect.abilities) {
            if (dbPassiveAbility.typeKey === ContractPassiveAbilityTypeKey.takeDamageOverTime) {
              (dbPassiveAbility.parameters.damagePerSecond as number) *= effect.powerVC.value / 100;
            }
          }

          const continuousEffect = ContinuousEffect.load(dbContinuousEffect);
          effectedCharacter.addContinuousEffect(continuousEffect);
        }
      } else if (effect.typeEffect instanceof AbilityTypeEffectDealDamage) {
        const baseAmount = effect.typeEffect.parameters.baseAmount;

        let damageGiven = baseAmount;

        damageGiven *= effect.powerVC.value / 100;

        if (isCriticalStrike) {
          const criticalStrikeDamageMultiplier = 1.5;
          damageGiven *= criticalStrikeDamageMultiplier;
        }

        for(const characterTakingDamage of effectedCharacters) {
          const damageTaken = this.calculateDamageTaken(damageGiven, characterTakingDamage, effect.typeEffect.tags);
          const healthAfterDamageTaken = characterTakingDamage.currentHealth - damageTaken;
          characterTakingDamage.setCurrentHealth(healthAfterDamageTaken);
        }
      } else {
        throw Error (`Unhandled ability effect type: ${effect.typeEffect.type.key}`);
      }
    }

    ability.startCooldown();
  }

  private calculateDamageTaken (damageGiven: number, characterTakingDamage: CombatCharacter, abilityTags: string[]): number {
    const resistanceCombinedAttribute = characterTakingDamage.attributes.getAttribute(ContractAttributeType.resistance, abilityTags);
    const resistance = resistanceCombinedAttribute.valueContainer.value;
    const resistanceMultiplier = 100 / (100 + resistance);
    return damageGiven * resistanceMultiplier;
  }
}

interface AbilityAndTarget {
  ability: CombatCharacterAbility,
  target: CombatCharacter | undefined
}