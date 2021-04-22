import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { AbilityTargetScheme } from "src/computed-game-state/ability-target-scheme";
import { AbilityTypeEffect } from "src/computed-game-state/ability-type-effect";
import { Ability } from "src/computed-game-state/area/ability";
import { Combat } from "src/computed-game-state/area/combat";
import { CombatCharacter } from "src/computed-game-state/area/combat-character";
import { DamageType } from "src/computed-game-state/damage-type";
import { Game } from "src/computed-game-state/game";
import { ContractCombatWebSocketMessage } from "src/loot-hoarder-contract/contract-combat-web-socket-message";
import { ContractAbilityUsedMessage } from "src/loot-hoarder-contract/combat-messages/contract-ability-used-message";
import { GamesManager } from "./games-manager";
import { RandomService } from "./random-service";
import { Area } from "src/computed-game-state/area/area";

@Injectable()
export class CombatUpdaterService implements OnApplicationBootstrap {
  private readonly tickFrequencyInMilliseconds: number = 100;
  private updatingInterval?: NodeJS.Timeout;
  private logger: Logger = new Logger('CombatUpdaterService');

  public constructor(
    private readonly gamesManager: GamesManager,
    private readonly eventBus: EventBus,
    private readonly randomService: RandomService
  ) {}

  public onApplicationBootstrap(): void {
    this.updatingInterval = setInterval(() => this.updateCombats(), this.tickFrequencyInMilliseconds);
  }

  private updateCombats(): void {
    const games = this.gamesManager.getGames();
    for(const game of games) {
      for(const area of game.areas) {
        this.updateCombat(game, area, area.currentCombat);
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
          const chosenAbility = this.randomService.randomElementInArray(availableAbilities);
          let target: CombatCharacter | undefined = undefined;
          if (chosenAbility.type.requiresTarget) {
            const legalTargets = combat.getLegalTargets(character, chosenAbility, false);
            target = this.randomService.randomElementInArray(legalTargets);
          }

          character.abilityBeingUsed = chosenAbility;
          character.remainingTimeToUseAbility = chosenAbility.timeToUseVC.value;
          character.targetOfAbilityBeingUsed = target;

          this.logger.log(`[${character.id}]: Begins using ${chosenAbility.type.name} in ${character.remainingTimeToUseAbility} milliseconds.`);
        }
      }

      // Use ability
      if (character.abilityBeingUsed && character.remainingTimeToUseAbility <= 0) {
        // Now all events in the combat will be put into this new bucket
        combat.redirectAllEventsToNewBucket();

        const abilityToUse = character.abilityBeingUsed;
        this.resolveAbility(combat, character, abilityToUse, character.targetOfAbilityBeingUsed);

        character.abilityBeingUsed = undefined;
        character.targetOfAbilityBeingUsed = undefined;

        if (timeToCoolUsedAbility) {
          abilityToUse.remainingCooldown -= timeToCoolUsedAbility;
        }

        // Stop redirecting all events and send ability used message
        const abilityInnerEvents = combat.flushBucketAndStopRedirectingEvents();
        const innerMessage = new ContractAbilityUsedMessage(abilityToUse.id, character.id, character.targetOfAbilityBeingUsed, abilityInnerEvents);
        const message = new ContractCombatWebSocketMessage(combat.id, innerMessage);
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
          const damageType = effect.parameters['damageType'] as DamageType;

          const isPhysicalDamage = damageType === DamageType.physical;
          const isElementalDamage = damageType === DamageType.cold
            || damageType === DamageType.fire
            || damageType === DamageType.lightning;

          let damageGiven = baseAmount;
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
            if (isPhysicalDamage) {
              const armorDamageMultiplier = 100 / (100 + characterTakingDamage.attributes.armorVC.value);
              damageTaken *= armorDamageMultiplier;
            }
            if (isElementalDamage) {
              const magicResistanceDamageMultiplier = 100 / (100 + characterTakingDamage.attributes.magicResistanceVC.value);
              damageTaken *= magicResistanceDamageMultiplier;
            }
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
