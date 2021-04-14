import { Injectable } from "@angular/core";
import { WebSocketMessage } from "../web-socket/web-socket-message";
import { Combat } from "./client-representation/combat";
import { Game } from "./client-representation/game";

@Injectable()
export class CombatMessageHandler {
  public constructor(
  ) {}

  public handleMessage(game: Game, combatId: number, message: WebSocketMessage): void {
    const area = game.areas.find(area => area.currentCombat.id === combatId);
    if (!area) {
      throw Error ('Combat not found with id: ' + combatId);
    }
    const combat = area.currentCombat;
    switch(message.typeKey) {
      case 'character-current-health-changed': {
        this.handleCharacterCurrentHealthChanged(combat, message.data);
      }
      break;
    }
  }

  private handleCharacterCurrentHealthChanged(combat: Combat, data: any) {
    const characterId = data.characterId as number;
    const newCurrentHealth = data.newCurrentHealth as number;
    const character = combat.team1.concat(combat.team2).find(c => c.id === characterId);
    if (!character) {
      throw Error (`Character with id: ${characterId} was not found in combat with id: ${combat.id}`);
    }
    character.currentHealth = newCurrentHealth;
  }
}
