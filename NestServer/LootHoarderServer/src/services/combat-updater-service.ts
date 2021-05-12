import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CommandBus, EventBus } from "@nestjs/cqrs";
import { AbilityTargetScheme } from "src/computed-game-state/ability-target-scheme";
import { AbilityTypeEffect } from "src/computed-game-state/ability-type-effect";
import { Ability } from "src/computed-game-state/area/ability";
import { Combat } from "src/computed-game-state/area/combat";
import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { DamageType } from "src/computed-game-state/damage-type";
import { Game } from "src/computed-game-state/game";
import { ContractAbilityUsedMessage } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-used-message";
import { ContractBegunUsingAbilityMessage } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-begun-using-ability-message";
import { GamesManager } from "./games-manager";
import { RandomService } from "./random-service";
import { Area } from "src/computed-game-state/area/area";
import { GoToNextCombat } from "src/game-message-handlers/from-client/go-to-next-combat";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";

@Injectable()
export class CombatUpdaterService implements OnApplicationBootstrap {
  private readonly tickFrequencyInMilliseconds: number = 100;
  private updatingInterval?: NodeJS.Timeout;
  private logger: Logger = new Logger('CombatUpdaterService');

  public constructor(
    private readonly gamesManager: GamesManager,
    private readonly randomService: RandomService,
    private readonly commandBus: CommandBus
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
        const availableAbilities = character.abilities
          .filter(ability => 
            ability.isReady
            && ( 
              // Has no target or has at least one legal target
              !ability.type.requiresTarget
              || combat.getLegalTargets(character, ability, false).length > 0
            )
          );

        if (availableAbilities.length > 0) {
          // Now all events in the combat will be put into this new bucket
        combat.onCombatEvent.setUpNewEventBucket();

          const chosenAbility = this.randomService.randomElementInArray(availableAbilities);
          let target: CombatCharacter | undefined = undefined;
          if (chosenAbility.type.requiresTarget) {
            const legalTargets = combat.getLegalTargets(character, chosenAbility, false);
            target = this.randomService.randomElementInArray(legalTargets);
          }

          character.abilityBeingUsed = chosenAbility;
          const timeToUse = chosenAbility.timeToUseVC.value;
          character.remainingTimeToUseAbility = timeToUse;
          character.totalTimeToUseAbility = timeToUse;
          character.targetOfAbilityBeingUsed = target;

          // Stop redirecting all events and send ability used message
          const messageInnerEvents = combat.onCombatEvent.flushEventBucket();
          const message = new ContractBegunUsingAbilityMessage(chosenAbility.id, character.id, target?.id, timeToUse, messageInnerEvents);
          combat.onCombatEvent.next(message);
        }
      }

      // Use ability
      if (character.abilityBeingUsed && character.remainingTimeToUseAbility <= 0) {
        // Now all events in the combat will be put into this new bucket
        combat.onCombatEvent.setUpNewEventBucket();

        const abilityToUse = character.abilityBeingUsed;
        this.resolveAbility(combat, character, abilityToUse, character.targetOfAbilityBeingUsed);

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

  private resolveAbility(combat: Combat, usingCharacter: CombatCharacter, ability: Ability, targetCharacter: CombatCharacter | undefined): void {
    const lifeStealEffects: AbilityTypeEffect[] = [];
    const otherEffects: AbilityTypeEffect[] = [];

    this.logger.log(`[${usingCharacter.id}]: Begins resolving ${ability.type.name}.`);

    for(const effect of ability.type.effects) {
      switch(effect.type.key) {
        case 'life-steal':
          lifeStealEffects.push(effect);
          break;
        default: 
          otherEffects.push(effect);
          break;
      }
    }

    const criticalStrikeChance = ability.criticalStrikeChanceVC.value;
    const criticalStrikeRoll = this.randomService.randomFloat(0, 1);
    const isCriticalStrike = criticalStrikeRoll <= criticalStrikeChance;

    for(const effect of otherEffects) {
      switch(effect.type.key) {
        case 'deal-damage': {
          const baseAmount = effect.parameters['baseAmount'] as number;

          let damageGiven = baseAmount;

          damageGiven *= ability.powerVC.value / 100;

          if (isCriticalStrike) {
            const criticalStrikeDamageMultiplier = 1.5;
            damageGiven *= criticalStrikeDamageMultiplier;
          }

          const charactersTakingDamage: CombatCharacter[] = [];
          if (effect.requiresTarget) {
            if (!targetCharacter) {
              throw Error (`Must have a target ability '${ability.type.key}' for effect with key = ${effect.type.key}`);
            }
            charactersTakingDamage.push(targetCharacter);
          } else {
            const allies = combat.getAllies(usingCharacter);
            const enemies = combat.getEnemies(usingCharacter);

            switch(effect.targetScheme) {
              case AbilityTargetScheme.all: {
                charactersTakingDamage.push(...allies, ...enemies);
              }
              break;
              case AbilityTargetScheme.allAllies: {
                charactersTakingDamage.push(...allies);
              }
              break;
              case AbilityTargetScheme.allEnemies: {
                charactersTakingDamage.push(...enemies);
              }
              break;
            }
          }

          for(const characterTakingDamage of charactersTakingDamage) {
            let damageTaken = damageGiven;
            const resistance = characterTakingDamage.attributes.calculateAttributeValue(ContractAttributeType.resistance, ability.type.tags);
            const resistanceMultiplier = 100 / (100 + resistance);
            damageTaken *= resistanceMultiplier;
            characterTakingDamage.currentHealth -= damageTaken;
          }
        }
        break;
        default: {
          throw Error (`Unhandled ability effect type: ${effect.type.key}`);
        }
        break;
      }
    }

    ability.startCooldown();
    this.logger.log(`[${usingCharacter.id}]: Begins cooling down ${ability.type.name} over ${ability.remainingCooldown} milliseconds.`);
  }
}
