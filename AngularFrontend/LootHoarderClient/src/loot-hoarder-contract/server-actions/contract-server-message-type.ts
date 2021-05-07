export enum ContractServerMessageType {
  authenticationResponse = 'authentication-response',
  areaAdded = 'area-created',
  areaAbandoned = 'area-abandoned',
  areaTypeCompleted = 'area-type-completed',
  combat = 'combat',
  combatStarted = 'combat-started',
  fullGameState = 'full-game-state',
  heroAdded = 'hero-added',
  heroAttributeChanged = 'hero-attribute-changed',
  heroGainedExperience = 'hero-gained-experience',
  itemAddedToGame = 'item-added-to-game',
  itemDroppedInArea = 'item-dropped-in-area',
  itemEquipped = 'item-equipped',
  itemRemovedFromGame = 'item-removed-from-game',
  itemUnequipped = 'item-unequipped',
  multimessage = 'multimessage'
}
