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
  multimessage = 'multimessage'
}
