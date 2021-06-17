export enum ContractServerMessageType {
  authenticationResponse = 'authentication-response',
  areaAdded = 'area-created',
  areaAbandoned = 'area-abandoned',
  areaTypeCompleted = 'area-type-completed',
  combat = 'combat',
  combatStarted = 'combat-started',
  chatMessageSent = 'chat-message-sent',
  chatStatus = 'chat-status',
  fullGameState = 'full-game-state',
  heroAbilityAdded = 'hero-ability-added',
  heroAbilityRemoved = 'hero-ability-removed',
  heroAbilityValueChanged = 'hero-ability-value-changed',
  heroAdded = 'hero-added',
  heroAttributeChanged = 'hero-attribute-changed',
  heroDeleted = 'hero-deleted',
  heroGainedExperience = 'hero-gained-experience',
  heroTookSkillNode = 'hero-took-skill-node',
  heroUnspentSkillPointsChanged = 'hero-unspent-skill-points-changed',
  itemAddedToGame = 'item-added-to-game',
  itemDroppedInArea = 'item-dropped-in-area',
  itemEquipped = 'item-equipped',
  itemRemovedFromGame = 'item-removed-from-game',
  itemUnequipped = 'item-unequipped',
  multimessage = 'multimessage'
}
