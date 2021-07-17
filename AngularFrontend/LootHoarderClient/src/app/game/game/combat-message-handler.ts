import { Injectable } from "@angular/core";
import { ContractCombatWebSocketInnerMessage } from "src/loot-hoarder-contract/server-actions/contract-combat-web-socket-inner-message";
import { ContractCombatMessageType } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-combat-message-type";
import { ContractAbilityUsedMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-used-message-content";
import { ContractBegunUsingAbilityMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-begun-using-ability-message-content";
import { ContractCombatCharacterCurrentHealthChangedMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-combat-character-current-health-changed-message-content";
import { ContractCombatCharacterCurrentManaChangedMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-combat-character-current-mana-changed-message-content";
import { ContractCombatEndedMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-combat-ended-message-content";
import { ContractContinuousEffectAddedMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-continuous-effect-added-message-content";
import { ContractContinuousEffectRemovedMessageContent } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-continuous-effect-removed-message-content";
import { Combat } from "./client-representation/combat";
import { Game } from "./client-representation/game";
import { GameStateMapper } from "./game-state-mapper";

@Injectable()
export class CombatMessageHandler {
  public constructor(
    private readonly gameStateMapper: GameStateMapper
  ) {}

  public handleMessage(game: Game, combatId: number, message: ContractCombatWebSocketInnerMessage): void {
    const area = game.areas.find(area => area.currentCombat.id === combatId);
    if (!area) {
      throw Error ('Combat not found with id: ' + combatId);
    }
    const combat = area.currentCombat;
    switch(message.typeKey) {
      case ContractCombatMessageType.combatCharacterCurrentHealthChanged: {
        this.handleCharacterCurrentHealthChanged(combat, message.data);
      }
      break;
      case ContractCombatMessageType.combatCharacterCurrentManaChanged: {
        this.handleCharacterCurrentManaChanged(combat, message.data);
      }
      break;
      case ContractCombatMessageType.begunUsingAbility: {
        this.handleBegunUsingAbility(game, combat, message.data);
      }
      break;
      case ContractCombatMessageType.abilityUsed: {
        this.handleAbilityUsed(game, combat, message.data);
      }
      break;
      case ContractCombatMessageType.combatEnded: {
        this.handleCombatEnded(combat, message.data);
      }
      break;
      case ContractCombatMessageType.continuousEffectAdded: {
        this.handleContinuousEffectAdded(combat, message.data);
      }
      break;
      case ContractCombatMessageType.continuousEffectRemoved: {
        this.handleContinuousEffectRemoved(combat, message.data);
      }
      break;
      default:
        throw Error (`Unhandled combat message: ${message.typeKey}`);
    }
  }

  private handleBegunUsingAbility(game: Game, combat: Combat, data: ContractBegunUsingAbilityMessageContent): void {
    const usingCharacter = combat.getCharacter(data.usingCombatCharacterId);
    usingCharacter.remainingTimeToUseAbility = data.timeToUse;
    usingCharacter.totalTimeToUseAbility = data.timeToUse;
    usingCharacter.abilityBeingUsed = usingCharacter.getAbility(data.abilityId);
    usingCharacter.targetOfAbilityBeingUsed = data.targetCombatCharacterId 
      ? combat.getCharacter(data.targetCombatCharacterId)
      : undefined;

    for(const innerMessage of data.effects) {
      this.handleMessage(game, combat.id, innerMessage);
    }
  }

  private handleAbilityUsed(game: Game, combat: Combat, data: ContractAbilityUsedMessageContent): void {
    const usingCharacter = combat.getCharacter(data.usingCombatCharacterId);
    if (usingCharacter.abilityBeingUsed && usingCharacter.abilityBeingUsed.id === data.abilityId) {
      usingCharacter.abilityBeingUsed = undefined;
      usingCharacter.totalTimeToUseAbility = undefined;
      usingCharacter.remainingTimeToUseAbility = 0;
      usingCharacter.targetOfAbilityBeingUsed = undefined;
    }

    const ability = usingCharacter.getAbility(data.abilityId);
    ability.remainingCooldown = data.newRemainingCooldown;

    for(const innerMessage of data.effects) {
      this.handleMessage(game, combat.id, innerMessage);
    }
  }

  private handleCharacterCurrentHealthChanged(combat: Combat, data: ContractCombatCharacterCurrentHealthChangedMessageContent): void {
    const characterId = data.characterId;
    const previousCurrentHealth = data.previousCurrentHealth;
    const newCurrentHealth = data.newCurrentHealth;
    const character = combat.team1.concat(combat.team2).find(c => c.id === characterId);
    if (!character) {
      throw Error (`Character with id: ${characterId} was not found in combat with id: ${combat.id}`);
    }
    character.currentHealth = newCurrentHealth;
    if (previousCurrentHealth > newCurrentHealth) {
      const damageTaken = previousCurrentHealth - newCurrentHealth;
      character.showDamageTaken(damageTaken);
    } else {
      const healthRestored = newCurrentHealth - previousCurrentHealth;
      character.showHealthRestored(healthRestored);
    }
  }

  private handleCharacterCurrentManaChanged(combat: Combat, data: ContractCombatCharacterCurrentManaChangedMessageContent): void {
    const characterId = data.characterId;
    const newCurrentMana = data.newCurrentMana;
    const character = combat.team1.concat(combat.team2).find(c => c.id === characterId);
    if (!character) {
      throw Error (`Character with id: ${characterId} was not found in combat with id: ${combat.id}`);
    }
    character.currentMana = newCurrentMana;
  }

  private handleCombatEnded(combat: Combat, data: ContractCombatEndedMessageContent): void {
    combat.hasEnded = true;
    combat.didTeam1Win = data.didTeam1Win;
  }

  private handleContinuousEffectAdded(combat: Combat, data: ContractContinuousEffectAddedMessageContent): void {
    const character = combat.getCharacter(data.combatCharacterId);
    const continuousEffect = this.gameStateMapper.mapToContinuousEffect(data.continuousEffect);
    character.continuousEffects.push(continuousEffect);
  }

  private handleContinuousEffectRemoved(combat: Combat, data: ContractContinuousEffectRemovedMessageContent): void {
    const character = combat.getCharacter(data.combatCharacterId);
    const continuousEffect = character.getContinuousEffect(data.continuousEffectId);
    character.removeContinuousEffect(continuousEffect);
  }
}
