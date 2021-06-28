import { ContractCharacterBehavior } from '../contract-character-behavior';

export interface ContractHeroBehaviorCreatedMessageContent {
  heroId: number,
  behavior: ContractCharacterBehavior
}
