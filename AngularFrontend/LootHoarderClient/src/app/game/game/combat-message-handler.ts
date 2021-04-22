import { Injectable } from "@angular/core";
import { ContractAbilityUsedMessageContent } from "src/loot-hoarder-contract/combat-messages/contract-ability-used-message-content";
import { ContractCombatCharacterCurrentHealthChangedMessageContent } from "src/loot-hoarder-contract/combat-messages/contract-combat-character-current-health-changed-message-content";
import { ContractCombatMessageType } from "src/loot-hoarder-contract/combat-messages/contract-combat-message-type";
import { ContractCombatWebSocketInnerMessage } from "src/loot-hoarder-contract/contract-combat-web-socket-inner-message";
import { Combat } from "./client-representation/combat";
import { Game } from "./client-representation/game";

@Injectable()
export class CombatMessageHandler {
  public constructor(
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
      case ContractCombatMessageType.abilityUsed: {
        this.handleAbilityUsed(game, combat, message.data);
      }
      break;
      default:
        throw Error (`Unhandled combat message: ${message.typeKey}`);
    }
  }

  private handleAbilityUsed(game: Game, combat: Combat, data: ContractAbilityUsedMessageContent) {
    // TODO: Handle the actual ability use
    for(const innerMessage of data.effects) {
      this.handleMessage(game, combat.id, innerMessage);
    }
  }

  private handleCharacterCurrentHealthChanged(combat: Combat, data: ContractCombatCharacterCurrentHealthChangedMessageContent) {
    const characterId = data.characterId;
    const newCurrentHealth = data.newCurrentHealth;
    const character = combat.team1.concat(combat.team2).find(c => c.id === characterId);
    if (!character) {
      throw Error (`Character with id: ${characterId} was not found in combat with id: ${combat.id}`);
    }
    character.currentHealth = newCurrentHealth;
  }
}
