import { CombatWebSocketMessage } from "./combat-web-socket-message";

export class CombatCharacterCurrentHealthChangedMessage extends CombatWebSocketMessage {
  public constructor(combatId: number, characterId: number, newCurrentHealth: number) {
    super(
      combatId, 
      'character-current-health-changed', 
      { 
        characterId, 
        newCurrentHealth 
      });
  }
}